import { createServerFn } from "@tanstack/react-start";
import { sql } from "../db";

export interface FreeSampleInput {
  name?: string;
  email: string;
  packSlug?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Free-sample opt-in: validate email, upsert into `leads`, and — only when
// BUTTONDOWN_API_KEY is set — forward the address to Buttondown.
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
    const apiKey = process.env.BUTTONDOWN_API_KEY;
    if (apiKey) {
      try {
        const res = await fetch(
          "https://api.buttondown.email/v1/subscribers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${apiKey}`,
            },
            body: JSON.stringify({
              email_address: cleanEmail,
              type: "subscriber",
            }),
          },
        );
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
