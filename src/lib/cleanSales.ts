// JVZoo COMPLIANCE "CLEAN" SALES PAGES — /sales/<slug>
//
// WHY THIS EXISTS
// JVZoo compliance flagged live listings with the same reviewer requirement,
// verbatim:
//
//   "Please remove ALL links that direct away from the sales page. You can keep
//    the terms, privacy, disclaimers, support, etc. All other links must be
//    removed."
//
// The product URLs registered in those listings were the normal site pages
// (/library/<slug>, /ebooks/<slug>), and those pages carry the whole site
// chrome — header nav (Home / Packs / Library / Ebooks / Affiliates), a logo
// link to the home page, a "Back to Library" link and a footer of site links
// plus a mailto address. That is what the reviewer saw.
//
// Five flag rounds so far, twenty-five listings in total:
//   * round 1 (2026-09-27): five article packs (Packs 9–13) + five ebooks;
//   * round 2 (2026-09-28): the four remaining ebook listings whose JVZoo sales
//     URL still pointed at the /ebooks/<slug> page;
//   * round 3 (2026-09-28): the eight original article packs (Packs 1–8) and the
//     fixed Packs 1–4 bundle listing (JVZoo 453431);
//   * round 4 (2026-09-28): the Healthy Feet ebook (JVZoo 454739), requested by
//     the owner after round 3 shipped (it had not been flagged, but she wants the
//     link-free page for that listing too);
//   * round 5 (2026-09-28): the Protein for Healthy Aging ebook (JVZoo 454751),
//     also requested by the owner — with it, every live product in the store has
//     a link-free page. No product is excluded.
//
// Slug -> JVZoo product ID stay in src/jvzoo.ts (one map, never duplicated);
// this list only says which slugs get a clean page and which product shape to
// render. Keep it in sync with CLEAN_SALES_SLUGS in vite.config.ts (prerender)
// and scripts/verify-prerender.mjs (build gate).
//
// Nothing is excluded: all 25 products now have a clean page (9/28, at the
// owner's request).

/** Which sales-page shape to render for a clean page. */
export type CleanSaleKind = "pack" | "ebook" | "bundle";

export interface CleanSaleEntry {
  /** Site slug — shared by the clean page, the normal page and src/jvzoo.ts. */
  slug: string;
  kind: CleanSaleKind;
}

/**
 * The bundle slug. The fixed Packs 1–4 bundle is NOT a pack and has no row in
 * the database and no owner ProductDescription: it is the single `bundleBuy`
 * export in src/jvzoo.ts (JVZoo 453431) and its copy lives in the bundle block
 * on /packs. It gets a clean page like any flagged listing.
 */
export const CLEAN_SALES_BUNDLE_SLUG = "packs-1-4-bundle";

/** The twenty-five flagged (or, for rounds 4–5, owner-requested) products that
 * get a /sales/<slug> page. */
export const CLEAN_SALES: CleanSaleEntry[] = [
  // --- Eight article packs (Packs 1-8) ---
  { slug: "nutrition-everyday-wellness", kind: "pack" },
  { slug: "supplements-nutritional-support", kind: "pack" },
  { slug: "fitness-exercise", kind: "pack" },
  { slug: "sleep-recovery", kind: "pack" },
  { slug: "stress-management-mind-body-wellness", kind: "pack" },
  { slug: "healthy-aging-lifestyle", kind: "pack" },
  { slug: "natural-holistic-wellness", kind: "pack" },
  { slug: "product-reviews-buying-guides", kind: "pack" },
  // --- The fixed Packs 1-4 bundle (JVZoo 453431) ---
  { slug: CLEAN_SALES_BUNDLE_SLUG, kind: "bundle" },
  // --- Five article packs (Packs 9-13) ---
  { slug: "protein-shakes-protein-nutrition", kind: "pack" },
  { slug: "intermittent-fasting-time-restricted-eating", kind: "pack" },
  { slug: "health-coaching-functional-nutrition-glp-1-support", kind: "pack" },
  { slug: "functional-nutrition-glp-1-adaptation", kind: "pack" },
  { slug: "womens-longevity-biology-specific-care", kind: "pack" },
  // --- Five PLR ebooks (first flag round) ---
  { slug: "healthy-bones", kind: "ebook" },
  { slug: "gut-health", kind: "ebook" },
  { slug: "hair-scalp", kind: "ebook" },
  { slug: "joint-fitness", kind: "ebook" },
  { slug: "hydration", kind: "ebook" },
  // --- Four more PLR ebooks (second flag round): the remaining ebook listings
  // whose JVZoo sales URL still pointed at the full-chrome /ebooks/<slug> page ---
  { slug: "balanced-nutrition", kind: "ebook" },
  { slug: "brain-habits", kind: "ebook" },
  { slug: "heart-habits", kind: "ebook" },
  { slug: "posture", kind: "ebook" },
  // --- Fourth flag round: the Healthy Feet ebook (JVZoo 454739), added at the
  // owner's request (2026-09-28). Same link-free page; the ID already exists in
  // src/jvzoo.ts, so no new product ID is introduced. ---
  { slug: "healthy-feet", kind: "ebook" },
  // --- Fifth round: the Protein for Healthy Aging ebook (JVZoo 454751), also
  // requested by the owner (2026-09-28) — it completes the catalog (all 25
  // products). That listing had been left out while the owner considered
  // deactivating it as a duplicate; she asked for its clean page instead, so it is
  // included. Its ID already exists in src/jvzoo.ts. ---
  { slug: "protein-aging", kind: "ebook" },
];

export const CLEAN_SALES_SLUGS: string[] = CLEAN_SALES.map((e) => e.slug);

const BY_SLUG = new Map<string, CleanSaleEntry>(CLEAN_SALES.map((e) => [e.slug, e]));

/**
 * The clean-page entry for a slug, or undefined for any slug that is not one of
 * the flagged products. The route renders a link-free "not available" page for
 * an unknown slug rather than borrowing content from the normal pages.
 */
export function cleanSaleBySlug(slug: string): CleanSaleEntry | undefined {
  return BY_SLUG.get(slug);
}
