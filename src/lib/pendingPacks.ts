// ─── Pending packs — the empty registry ──────────────────────────────────────
//
// Added 2026-11-02, emptied 2026-11-13. This file held the new article packs while
// they had no JVZoo listing: real product pages (content written, packaged and
// verified) that were baked at their /library/<slug> URL but kept UNLISTED — out
// of the /packs grid, the /library hub, the header / footer nav and
// public/sitemap.xml, baked with `noindex, nofollow`, and carrying no buy button,
// because a shopper must never land on a product page with no way to buy it.
//
// All three packs the owner submitted on 2026-11-13 now have listings — Heart
// Health & Cardiovascular Disease in 2026–2027 (462871), The Preventive Health &
// Disease Prevention Checklist (462879) and Brain Health & Neurological Diseases
// (462883) — so each was promoted, exactly as the note below describes, to a
// normal content_packs row in src/db/seed.ts with its ID in src/jvzoo.ts. There is
// nothing pending: PENDING_PACKS is empty, the pages render as ordinary listed
// packs, and the build gate holds them to the LISTED state instead (sitemap,
// indexable, canonical buy block — see scripts/verify-prerender.mjs).
//
// HOW TO ADD ONE BACK: if a future pack must go to JVZoo before its listing
// exists, add an entry below (real title, real contents, real word counts — never
// a placeholder), keep it out of src/db/seed.ts, and teach the gate about it again
// so the unlisted state cannot leak into a page a shopper can reach.
//
// The page itself is the ordinary pack page (src/routes/library.$slug.tsx): with
// no JVZoo ID, liveJvzooProduct() returns undefined and the page renders the $47
// price with no buy button — no dead href, no JVZoo anchor and no Stripe link.

export interface PendingPack {
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  comingSoon: boolean;
  includes: string[];
  /** What one ZIP actually delivers — rendered in place of the generic line. */
  delivery: string;
  /** Always true: a pending pack is never listed while it has no JVZoo ID. */
  unlisted: true;
}

// Empty on purpose (2026-11-13): every pack in the catalog has a JVZoo listing.
// The type and the helpers stay so the route keeps one code path, and so the next
// pack can be staged here without touching it.
export const PENDING_PACKS: Record<string, PendingPack> = {};

/** The pending pack for a slug, or undefined when the slug is not one of them. */
export function pendingPack(slug: string): PendingPack | undefined {
  return PENDING_PACKS[slug];
}

/** Slugs of the pending packs, in the order they are listed above. */
export const PENDING_PACK_SLUGS = Object.keys(PENDING_PACKS);
