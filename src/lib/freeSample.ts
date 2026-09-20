import { createServerFn } from "@tanstack/react-start";
import { Buffer } from "node:buffer";
import { sql } from "../db";

export interface FreeSampleInput {
  name?: string;
  email: string;
  packSlug?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** MailerLite's current API gateway. */
const MAILERLITE_API = "https://connect.mailerlite.com/api";

/**
 * The group the owner's MailerLite automation watches ("subscriber joins group
 * → welcome sequence"). Every opt-in is placed in this group as an ACTIVE
 * subscriber so the automation fires immediately. Resolved by name; created if
 * missing.
 */
const WELCOME_GROUP_NAME = "Welcome";

/** Resolve the API key, tolerating the wrapper formats the platform secret may use. */
function resolveMailerLiteApiKey(): string | null {
  const raw =
    process.env.MAILERLITE_API_KEY ??
    process.env.MailerLite_Secrets_key ??
    process.env.mailerlite_key;
  if (!raw) return null;
  let key = raw.trim();
  if (!key.startsWith("ml|")) {
    // The stored value may be a BASE64-wrapped JSON blob like
    // {"api_key":"ml|…"} or {"MAILERLITE_API_KEY":"ml|…"} — unwrap it if so.
    try {
      const parsed = JSON.parse(Buffer.from(key, "base64").toString("utf8"));
      if (parsed && typeof parsed === "object") {
        const candidate = [
          (parsed as Record<string, unknown>).api_key,
          (parsed as Record<string, unknown>).MAILERLITE_API_KEY,
          (parsed as Record<string, unknown>).mailerlite_key,
          (parsed as Record<string, unknown>).key,
        ].find((v): v is string => typeof v === "string" && v.trim().length > 0);
        if (candidate) key = candidate.trim();
      }
    } catch {
      // Not a base64 JSON blob — validate the raw value below.
    }
  }
  key = key.replace(/^Bearer\s+/i, "").trim();
  // MailerLite issues `ml|…` keys and also ships JWT-shaped API tokens
  // (their tokens look like `eyJ0eXAiOiJKV1Qi….`). Accept either; treat
  // anything else as unset so the local opt-in keeps working without a forward.
  const looksLikeJwt = /^eyJ[\w-]*\.[\w-]+\.[\w-]+$/.test(key);
  return key.startsWith("ml|") || looksLikeJwt ? key : null;
}

function mailerLiteHeaders(key: string): Record<string, string> {
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/** Cached for the process lifetime — the group id never changes. */
let cachedWelcomeGroupId: string | null = null;

function pickGroupId(body: unknown): string | null {
  const list = (body as { data?: unknown })?.data;
  if (!Array.isArray(list)) return null;
  const match = list.find(
    (g) =>
      typeof (g as { name?: unknown })?.name === "string" &&
      (g as { name: string }).name.trim().toLowerCase() ===
        WELCOME_GROUP_NAME.toLowerCase(),
  ) as { id?: unknown } | undefined;
  return match?.id != null ? String(match.id) : null;
}

async function findWelcomeGroupId(key: string): Promise<string | null> {
  const res = await fetch(
    `${MAILERLITE_API}/groups?filter[name]=${encodeURIComponent(WELCOME_GROUP_NAME)}&limit=100`,
    { method: "GET", headers: mailerLiteHeaders(key) },
  );
  if (!res.ok) return null;
  return pickGroupId(await res.json().catch(() => null));
}

/**
 * Resolve the "Welcome" group by name, creating it when it does not exist.
 * Returns null only if the group can't be found or created — the opt-in itself
 * still succeeds in that case (the address is just not grouped).
 */
async function resolveWelcomeGroupId(key: string): Promise<string | null> {
  if (cachedWelcomeGroupId) return cachedWelcomeGroupId;
  let id = await findWelcomeGroupId(key);
  if (!id) {
    const res = await fetch(`${MAILERLITE_API}/groups`, {
      method: "POST",
      headers: mailerLiteHeaders(key),
      body: JSON.stringify({ name: WELCOME_GROUP_NAME }),
    });
    if (res.ok) {
      const body = (await res.json().catch(() => null)) as {
        data?: { id?: unknown };
      } | null;
      if (body?.data?.id != null) id = String(body.data.id);
    }
    // Either the create raced with another process or it was rejected because
    // the group already exists — look it up once more before giving up.
    if (!id) id = await findWelcomeGroupId(key);
  }
  if (id) cachedWelcomeGroupId = id;
  return id;
}

/**
 * Forward one opt-in to MailerLite. Returns true when the subscriber is
 * present, ACTIVE and (when the group could be resolved) in the "Welcome"
 * group. Never throws.
 */
async function forwardToMailerLite(
  key: string,
  email: string,
  name: string | null,
): Promise<boolean> {
  const groupId = await resolveWelcomeGroupId(key);
  const payload: Record<string, unknown> = { email, status: "active" };
  if (name) payload.fields = { name };
  if (groupId) payload.groups = [groupId];

  // Verified against the live API: POST /subscribers answers 201 for a new
  // address and 200 (upsert, same id) when the address already exists, so this
  // one call covers both cases while re-asserting active status + group.
  const res = await fetch(`${MAILERLITE_API}/subscribers`, {
    method: "POST",
    headers: mailerLiteHeaders(key),
    body: JSON.stringify(payload),
  });
  if (res.ok) return true;

  // Defensive fallback if the API ever rejects an existing address with a
  // conflict: PUT /subscribers/{id-or-email} updates instead (PATCH is not
  // supported; a PUT against an unknown address is a harmless 404).
  if (res.status === 409 || res.status === 422) {
    const put = await fetch(
      `${MAILERLITE_API}/subscribers/${encodeURIComponent(email)}`,
      {
        method: "PUT",
        headers: mailerLiteHeaders(key),
        body: JSON.stringify(payload),
      },
    );
    if (put.ok) return true;
  }
  return false;
}

export const submitFreeSample = createServerFn({ method: "POST" })
  .validator((input: FreeSampleInput) => input)
  .handler(async ({ data }) => {
    const { name, email, packSlug } = data;
    const cleanEmail = (email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    const cleanName = (name ?? "").trim() || null;
    const cleanPack = (packSlug ?? "").trim() || null;

    await sql()`
      insert into leads (name, email, pack_slug)
      values (${cleanName}, ${cleanEmail}, ${cleanPack})
      on conflict (email) do nothing
    `;

    let subscribed = false;
    const apiKey = resolveMailerLiteApiKey();
    if (apiKey) {
      try {
        if (await forwardToMailerLite(apiKey, cleanEmail, cleanName)) {
          subscribed = true;
          await sql()`update leads set subscribed = true where email = ${cleanEmail}`;
        }
      } catch {
        // Newsletter forwarding must never break the opt-in itself.
      }
    }

    return { ok: true as const, subscribed };
  });
