import { createServerFn } from "@tanstack/react-start";
import { Buffer } from "node:buffer";
import { sql } from "../db";

export interface FreeSampleInput {
  name?: string;
  email: string;
  packSlug?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Free-sample opt-in: validate email, upsert into `leads`, and — only when a
// Brevo API key is available — forward the address to Brevo's Contacts API.
function resolveBrevoApiKey(): string | null {
  const raw = process.env.BREVO_API_KEY ?? process.env.Brevo_Secrets_key;
  if (!raw) return null;
  let key = raw.trim();
  if (!key.startsWith("xkeysib-")) {
    // The stored value may be a BASE64-wrapped JSON blob like
    // {"api_key":"xkeysib-..."} — unwrap it if so.
    try {
      const parsed = JSON.parse(Buffer.from(key, "base64").toString("utf8"));
      if (parsed && typeof parsed.api_key === "string") {
        key = parsed.api_key.trim();
      }
    } catch {
      // Not a base64 JSON blob — validate the raw value below.
    }
  }
  // Only accept values that look like real Brevo keys; anything else is
  // treated as unset so the local opt-in keeps working without the forward.
  return key.startsWith("xkeysib-") ? key : null;
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
    const apiKey = resolveBrevoApiKey();
    if (apiKey) {
      try {
        const body: Record<string, unknown> = {
          email: cleanEmail,
          attributes: {
            FIRSTNAME: cleanName,
          },
          updateEnabled: true,
        };
        const listIdRaw = process.env.BREVO_LIST_ID;
        if (listIdRaw) {
          const listIds = listIdRaw
            .split(",")
            .map((v) => v.trim())
            .filter((v) => /^\d+$/.test(v))
            .map(Number);
          if (listIds.length > 0) body.listIds = listIds;
        }
        const res = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          subscribed = true;
          await sql()`update leads set subscribed = true where email = ${cleanEmail}`;
        }
      } catch {
        // Newsletter forwarding must never break the opt-in itself.
      }
    }

    return { ok: true as const, subscribed };
  });