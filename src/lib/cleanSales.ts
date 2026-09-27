// JVZoo COMPLIANCE "CLEAN" SALES PAGES — /sales/<slug>
//
// WHY THIS EXISTS
// JVZoo compliance flagged ten live listings (five article packs, five ebooks)
// with the same reviewer requirement, verbatim:
//
//   "Please remove ALL links that direct away from the sales page. You can keep
//    the terms, privacy, disclaimers, support, etc. All other links must be
//    removed."
//
// The normal sales pages (/library/<slug>, /ebooks/<slug>) are full site pages:
// header navigation (Home / Packs / Library / Ebooks / Affiliates), a logo link
// to "/", a "Back to Library" link and a footer of site links + a mailto. Those
// are the links the reviewer saw. This module lists the affected products so the
// /sales/<slug> route can serve a dedicated page whose ONLY outbound links are
// the JVZoo buy link, the JVZoo button image, the four legal/support pages and
// the product cover.
//
// The ten are exactly the flagged products. protein-aging (ebook 454751) is
// deliberately NOT here: the owner is deactivating that listing as a duplicate,
// so it gets no clean page.
//
// Slug -> JVZoo product ID stay in src/jvzoo.ts (one map, never duplicated);
// this list only says which slugs get a clean page and which product shape to
// render. Keep it in sync with CLEAN_SALES_SLUGS in vite.config.ts (prerender)
// and scripts/verify-prerender.mjs (build gate).

/** Which sales-page shape to render for a clean page. */
export type CleanSaleKind = "pack" | "ebook";

export interface CleanSaleEntry {
  /** Site slug — shared by the clean page, the normal page and src/jvzoo.ts. */
  slug: string;
  kind: CleanSaleKind;
}

/** The ten flagged products that get a /sales/<slug> page. */
export const CLEAN_SALES: CleanSaleEntry[] = [
  // --- Five article packs (Pack 9-13) ---
  { slug: "protein-shakes-protein-nutrition", kind: "pack" },
  { slug: "intermittent-fasting-time-restricted-eating", kind: "pack" },
  { slug: "health-coaching-functional-nutrition-glp-1-support", kind: "pack" },
  { slug: "functional-nutrition-glp-1-adaptation", kind: "pack" },
  { slug: "womens-longevity-biology-specific-care", kind: "pack" },
  // --- Five PLR ebooks ---
  { slug: "healthy-bones", kind: "ebook" },
  { slug: "gut-health", kind: "ebook" },
  { slug: "hair-scalp", kind: "ebook" },
  { slug: "joint-fitness", kind: "ebook" },
  { slug: "hydration", kind: "ebook" },
];

export const CLEAN_SALES_SLUGS: string[] = CLEAN_SALES.map((e) => e.slug);

const BY_SLUG = new Map<string, CleanSaleEntry>(CLEAN_SALES.map((e) => [e.slug, e]));

/**
 * The clean-page entry for a slug, or undefined for any slug that is not one of
 * the ten flagged products. The route renders a link-free "not available" page
 * for an unknown slug rather than borrowing content from the normal pages.
 */
export function cleanSaleBySlug(slug: string): CleanSaleEntry | undefined {
  return BY_SLUG.get(slug);
}
