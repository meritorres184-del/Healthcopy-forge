// Canonical JVZoo buy blocks — one entry per live listing, all built from the
// product ID so every product renders byte-identical markup.
//
// This is JVZoo's dashboard "use your own button" code, exactly:
//
//   <a href="https://jvzoo.com/b/0/{ID}/2" target="_blank"
//      rel="nofollow noopener noreferrer">
//     <img src="https://i.jvzoo.com/0/{ID}/2" border="0" alt="..." /></a>
//   <img src="https://i.jvzoo.com/0/{ID}/2" width="1" height="1" border="0" alt="" />
//
// Points that matter for compliance (a reviewer flagged the old markup):
//   * the bare host `jvzoo.com` (no `www.`) in the link,
//   * the `/2` variant for the link, for the button image INSIDE the anchor,
//     and for the 1x1 tracking pixel that follows it.
// Render it with <JvzooBuyButton> (src/components/JvzooBuyButton.tsx) so no page
// can drift from this shape; scripts/verify-prerender.mjs fails the build if a
// baked page does not contain it.
export interface JvzooProduct {
  id: string; // JVZoo product ID, e.g. "452435"
  href: string; // buy link: https://jvzoo.com/b/0/{ID}/2
  btn: string; // button image inside <a>: https://i.jvzoo.com/0/{ID}/2
  src: string; // 1x1 tracking pixel: https://i.jvzoo.com/0/{ID}/2
  alt: string; // alt text for the button image
}

function jvzooProduct(id: string, alt: string): JvzooProduct {
  return {
    id,
    href: `https://jvzoo.com/b/0/${id}/2`,
    btn: `https://i.jvzoo.com/0/${id}/2`,
    src: `https://i.jvzoo.com/0/${id}/2`,
    alt,
  };
}

// A pack whose JVZoo listing does not exist yet. Kept as a named constant (not a
// literal "") so the ID reader in scripts/verify-prerender.mjs — which matches
// digit IDs only — can never mistake a not-yet-listed pack for a live one.
const NOT_LISTED_YET = "";

// Live JVZoo listings, keyed by site pack slug.
export const jvzooProducts: Record<string, JvzooProduct> = {
  // Pack 1 — Nutrition & Everyday Wellness
  "nutrition-everyday-wellness": jvzooProduct(
    "452429",
    "Article Pack 1 Nutrition & Everyday Wellness",
  ),
  // Pack 8 — Product Reviews & Buying Guides
  "product-reviews-buying-guides": jvzooProduct(
    "452451",
    "Article Pack 8 Product Reviews & Buying Guides",
  ),
  // Pack 7 — Natural & Holistic Wellness
  "natural-holistic-wellness": jvzooProduct(
    "452449",
    "Article Pack 7 Natural & Holistic Wellness",
  ),
  // Pack 6 — Healthy Aging & Lifestyle
  "healthy-aging-lifestyle": jvzooProduct(
    "452447",
    "Article Pack 6 Healthy Aging & Lifestyle",
  ),
  // Pack 5 — Stress Management & Mind-Body Wellness
  "stress-management-mind-body-wellness": jvzooProduct(
    "452445",
    "Article Pack 5 Stress Management & Mind-Body Wellness",
  ),
  // Pack 4 — Sleep & Recovery
  "sleep-recovery": jvzooProduct("452435", "Article Pack 4 Sleep & Recovery"),
  // Pack 3 — Fitness & Exercise
  "fitness-exercise": jvzooProduct("452433", "Article Pack 3 Fitness & Exercise"),
  // Pack 2 — Supplements & Nutritional Support
  "supplements-nutritional-support": jvzooProduct(
    "452431",
    "Article Pack 2 Supplements & Nutritional Support",
  ),
  // ---------------------------------------------------------------------------
  // Packs 9–13 — listings not created yet (owner creates them).
  //
  // This is the ONE place to wire them up: replace NOT_LISTED_YET with the
  // JVZoo product ID once the owner sends it, e.g.
  //   "protein-shakes-protein-nutrition": jvzooProduct("452460", "Article Pack 9 Protein Shakes & Protein Nutrition"),
  // then republish. While an ID is missing, that pack's page renders the price
  // and the "instant download" state instead of a buy block — never a dead link
  // — and scripts/verify-prerender.mjs requires the canonical buy block for a
  // pack only once its ID is present.
  "protein-shakes-protein-nutrition": jvzooProduct(
    NOT_LISTED_YET,
    "Article Pack 9 Protein Shakes & Protein Nutrition",
  ),
  "intermittent-fasting-time-restricted-eating": jvzooProduct(
    NOT_LISTED_YET,
    "Article Pack 10 Intermittent Fasting & Time-Restricted Eating",
  ),
  "health-coaching-functional-nutrition-glp-1-support": jvzooProduct(
    NOT_LISTED_YET,
    "Article Pack 11 Health Coaching, Functional Nutrition & GLP-1 Support in 2026",
  ),
  "functional-nutrition-glp-1-adaptation": jvzooProduct(
    NOT_LISTED_YET,
    "Article Pack 12 Functional Nutrition, GLP-1 & Adaptation in 2026",
  ),
  "womens-longevity-biology-specific-care": jvzooProduct(
    NOT_LISTED_YET,
    "Article Pack 13 Women's Longevity & Biology-Specific Care",
  ),
};

/**
 * The buy block for a slug, or `undefined` when that pack has no live JVZoo
 * listing yet. Render every buy button through this: it is what keeps a pack
 * with an empty ID from emitting a broken href / a blank button image.
 */
export function liveJvzooProduct(slug: string): JvzooProduct | undefined {
  const product = jvzooProducts[slug];
  return product && product.id ? product : undefined;
}

// Fixed Packs 1–4 bundle (JVZoo product 453431) — same canonical shape.
export const bundleBuy = jvzooProduct(
  "453431",
  "Health & Wellness PLR Mega Bundle: 60 SEO Articles + Complete Content Resources Packs 1-4",
);
