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
  // Packs 9–13 — wired as the owner sends listing IDs. Pack 9 live (454667,
  // owner 9/26); 10–13 still awaiting their JVZoo product IDs.
  //
  // This is the ONE place to wire them up: replace NOT_LISTED_YET with the
  // JVZoo product ID once the owner sends it, e.g.
  //   "intermittent-fasting-time-restricted-eating": jvzooProduct("452460", "Article Pack 10 Intermittent Fasting & Time-Restricted Eating"),
  // then republish. While an ID is missing, that pack's page renders the price
  // and the "instant download" state instead of a buy block — never a dead link
  // — and scripts/verify-prerender.mjs requires the canonical buy block for a
  // pack only once its ID is present.
  "protein-shakes-protein-nutrition": jvzooProduct(
    "454667",
    "Article Pack 9 Protein Shakes & Protein Nutrition",
  ),
  "intermittent-fasting-time-restricted-eating": jvzooProduct(
    "454669",
    "Article Pack 10 Intermittent Fasting & Time-Restricted Eating",
  ),
  "health-coaching-functional-nutrition-glp-1-support": jvzooProduct(
    "454673",
    "Article Pack 11 Health Coaching, Functional Nutrition & GLP-1 Support in 2026",
  ),
  "functional-nutrition-glp-1-adaptation": jvzooProduct(
    "454675",
    "Article Pack 12 Functional Nutrition, GLP-1 & Adaptation in 2026",
  ),
  "womens-longevity-biology-specific-care": jvzooProduct(
    "454679",
    "Article Pack 13 Women's Longevity & Biology-Specific Care",
  ),

  // ---------------------------------------------------------------------------
  // Ebooks E1-E11 — the standalone PLR ebook line, $27 each (src/lib/ebooks.ts).
  //
  // Same rule as the packs above: this is the ONE place to wire them up. Replace
  // NOT_LISTED_YET with the JVZoo product ID once the owner sends it, e.g.
  //   "balanced-nutrition": jvzooProduct("452470", "Balanced Nutrition Made Simple — Master Resell Ebook"),
  // then republish. While an ID is missing, that ebook's page (/ebooks/<slug>)
  // renders its price and the "instant download" state instead of a buy block —
  // never a dead link — and scripts/verify-prerender.mjs requires the canonical
  // buy block for an ebook only once its ID is present (and forbids any JVZoo
  // markup on an ebook page whose ID is still empty).
  "balanced-nutrition": jvzooProduct(
    "454681",
    "Balanced Nutrition Made Simple — Master Resell Ebook",
  ),
  "brain-habits": jvzooProduct(
    "454687",
    "Brain Healthy Lifestyle Habits — Master Resell Ebook",
  ),
  "gut-health": jvzooProduct(
    "454695",
    "Gut Health for Beginners — Master Resell Ebook",
  ),
  "healthy-bones": jvzooProduct(
    "454731",
    "Healthy Bones and Everyday Lifestyle — Master Resell Ebook",
  ),
  "healthy-feet": jvzooProduct(
    "454739",
    "Healthy Feet and Foot Care — Master Resell Ebook",
  ),
  "hair-scalp": jvzooProduct(
    "454741",
    "Healthy Hair and Scalp Wellness — Master Resell Ebook",
  ),
  "heart-habits": jvzooProduct(
    "454743",
    "Heart Healthy Lifestyle Habits — Master Resell Ebook",
  ),
  "hydration": jvzooProduct(
    "454745",
    "Hydration and Wellness — Master Resell Ebook",
  ),
  "joint-fitness": jvzooProduct(
    "454747",
    "Joint Friendly Fitness — Master Resell Ebook",
  ),
  "posture": jvzooProduct(
    "454749",
    "Posture and Everyday Movement — Master Resell Ebook",
  ),
  "protein-aging": jvzooProduct(
    "454751",
    "Protein for Healthy Aging — Master Resell Ebook",
  ),
};

// ---------------------------------------------------------------------------
// Wired COURSE listings — the 35 standalone PLR courses (/sales/<slug>, $47).
//
// Same rule as the packs and ebooks above: wiring a course is ONE line here, and
// this is the ONLY place it happens. The 35 course pages went live BEFORE their
// JVZoo listings did (the owner pastes each page's URL into the listing she is
// creating, so the URL has to answer 200 first, and a JVZoo product ID cannot
// exist before its listing does). Each one therefore ships with an interim
// Stripe buy button inside a marked injection point on /sales/<slug>. Adding the
// course's product ID below is the whole swap:
//   * liveJvzooProduct() starts returning the product, so the canonical
//     <JvzooBuyButton> (anchor + button image + 1x1 tracking pixel) renders into
//     that same container and the interim Stripe anchor disappears, and
//   * scripts/verify-prerender.mjs holds the page to the canonical buy block and
//     refuses the Stripe href on it (the gate half of this one-line step is
//     WIRED_COURSES in that file — keep the two in sync, the gate fails the
//     build if they disagree).
//
// Deliberately its OWN map rather than an entry in `jvzooProducts`: /packs'
// fallback button list iterates jvzooProducts and parses each alt as an article
// pack name, so a course in that map could present a course as an article pack.
// Only the slug-keyed lookup (liveJvzooProduct, below) serves both lines.
export const courseJvzooProducts: Record<string, JvzooProduct> = {
  // Active Living for Busy People — course page /sales/active-living. Listing
  // created by the owner 2026-10-18; that page's button was swapped from the
  // interim Stripe link to this canonical JVZoo block for product 458158.
  "active-living": jvzooProduct(
    "458158",
    "Active Living for Busy People \u2014 PLR Course",
  ),
  // Balance and Stability Training — course page /sales/balance-stability.
  // Listing created by the owner 2026-10-23; that page's button was swapped from
  // the interim Stripe link to this canonical JVZoo block for product 458450. The
  // listing name is the catalog title ("Balance and Stability Training"), NOT the
  // alt text in the owner's pasted snippet, which carries a typo.
  "balance-stability": jvzooProduct(
    "458450",
    "Balance and Stability Training \u2014 PLR Course",
  ),
  // Building a Balanced Eating Routine — course page /sales/balanced-eating.
  // Listing created by the owner 2026-10-23; that page's button was swapped from
  // the interim Stripe link to this canonical JVZoo block for product 458983. The
  // alt text in the owner's pasted snippet ("Building a Balanced Eating Routine")
  // is the catalog title, so the line below is that title plus our "\u2014 PLR
  // Course" suffix, exactly like the two entries above.
  "balanced-eating": jvzooProduct(
    "458983",
    "Building a Balanced Eating Routine \u2014 PLR Course",
  ),
  // Bodyweight Exercise Basics — course page /sales/bodyweight-exercise. Listing
  // created by the owner 2026-10-23; that page's button was swapped from the
  // interim Stripe link to this canonical JVZoo block for product 459045. The alt
  // text in the owner's pasted snippet ("Bodyweight Exercise Basics") is the
  // catalog title with no typo, so the line below is that title plus our "\u2014 PLR
  // Course" suffix, exactly like the three entries above.
  "bodyweight-exercise": jvzooProduct(
    "459045",
    "Bodyweight Exercise Basics \u2014 PLR Course",
  ),
  // Nutrition for Busy Lifestyles — course page /sales/busy-lifestyle. Listing
  // created by the owner 2026-10-23; that page's button was swapped from the
  // interim Stripe link to this canonical JVZoo block for product 459047. The alt
  // text in the owner's pasted snippet ("Nutrition for Busy Lifestyles") is the
  // catalog title with no typo, so the line below is that title plus our "\u2014 PLR
  // Course" suffix, exactly like the four entries above.
  "busy-lifestyle": jvzooProduct(
    "459047",
    "Nutrition for Busy Lifestyles \u2014 PLR Course",
  ),
  // Cardiovascular Fitness Basics — course page /sales/cardiovascular-fitness.
  // Listing created by the owner 2026-10-24; that page's button was swapped from
  // the interim Stripe link to this canonical JVZoo block for product 459049. The
  // alt text in the owner's pasted snippet ("Cardiovascular Fitness Basics") is the
  // catalog title with no typo, so the line below is that title plus our "\u2014 PLR
  // Course" suffix, exactly like the five entries above.
  "cardiovascular-fitness": jvzooProduct(
    "459049",
    "Cardiovascular Fitness Basics \u2014 PLR Course",
  ),
  // Eating Well on a Budget — course page /sales/eating-budget. Listing created by
  // the owner 2026-10-24; that page's button was swapped from the interim Stripe
  // link to this canonical JVZoo block for product 459101. The alt text in the
  // owner's pasted snippet ("Eating Well on a Budget") is the catalog title with no
  // typo, so the line below is that title plus our "\u2014 PLR Course" suffix,
  // exactly like the six entries above.
  "eating-budget": jvzooProduct(
    "459101",
    "Eating Well on a Budget \u2014 PLR Course",
  ),
  // Exercise Motivation and Consistency — course page /sales/exercise-motivation.
  // Listing created by the owner 2026-10-25; that page's button was swapped from the
  // interim Stripe link to this canonical JVZoo block for product 459117. The alt
  // text in the owner's pasted snippet ("Exercise Motivation and Consistency") is the
  // catalog title with no typo, so the line below is that title plus our "\u2014 PLR
  // Course" suffix, exactly like the seven entries above.
  "exercise-motivation": jvzooProduct(
    "459117",
    "Exercise Motivation and Consistency \u2014 PLR Course",
  ),
  // Exercise Recovery Fundamentals — course page /sales/exercise-recovery. Listing
  // created by the owner 2026-10-25; that page's button was swapped from the interim
  // Stripe link to this canonical JVZoo block for product 459119. The alt text in the
  // owner's pasted snippet ("Exercise Recovery Fundamentals") is the catalog title
  // with no typo, so the line below is that title plus our "\u2014 PLR Course"
  // suffix, exactly like the eight entries above.
  "exercise-recovery": jvzooProduct(
    "459119",
    "Exercise Recovery Fundamentals \u2014 PLR Course",
  ),
};

/**
 * The buy block for a slug, or `undefined` when that product has no live JVZoo
 * listing yet. Render every buy button through this: it is what keeps a product
 * with an empty ID from emitting a broken href / a blank button image. Serves
 * both maps: the pack/ebook line (jvzooProducts) and the wired courses
 * (courseJvzooProducts).
 */
export function liveJvzooProduct(slug: string): JvzooProduct | undefined {
  const product = jvzooProducts[slug] ?? courseJvzooProducts[slug];
  return product && product.id ? product : undefined;
}

// Fixed Packs 1–4 bundle (JVZoo product 453431) — same canonical shape.
export const bundleBuy = jvzooProduct(
  "453431",
  "Health & Wellness PLR Mega Bundle: 60 SEO Articles + Complete Content Resources Packs 1-4",
);
