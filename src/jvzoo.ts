// JVZoo buy buttons & tracking pixels for HealthCopy Forge products.
// Keyed by pack slug (the fixed Packs 1-4 bundle lives in packs.tsx).
// href = buy-button link; src = tracking pixel (i.jvzoo.com/0/{id}/2);
// btn  = hosted buy-button image (i.jvzoo.com/0/{id}/1) — the visible button.
// Both button image AND tracking pixel are required on every sales page.
export interface JvzooProduct {
  href: string; // full buy button link, e.g. https://www.jvzoo.com/b/0/XXXXXX/2
  src: string;  // tracking pixel (i.jvzoo.com/0/XXXXXX/2) — rendered as a 1x1
  btn: string;  // hosted buy-button image (i.jvzoo.com/0/XXXXXX/1) — the visible button
  alt: string;  // alt text shown for the button image
}
export const jvzooProducts: Record<string, JvzooProduct> = {
  // Pack 1 — Nutrition & Everyday Wellness
  "nutrition-everyday-wellness": {
    href: "https://www.jvzoo.com/b/0/452429/2",
    src: "https://i.jvzoo.com/0/452429/2",
    btn: "https://i.jvzoo.com/0/452429/1",
    alt: "Article Pack 1 Nutrition & Everyday Wellness",
  },
  // Pack 8 — Product Reviews & Buying Guides
  "product-reviews-buying-guides": {
    href: "https://www.jvzoo.com/b/0/452451/2",
    src: "https://i.jvzoo.com/0/452451/2",
    btn: "https://i.jvzoo.com/0/452451/1",
    alt: "Article Pack 8 Product Reviews & Buying Guides",
  },
  // Pack 7 — Natural & Holistic Wellness
  "natural-holistic-wellness": {
    href: "https://www.jvzoo.com/b/0/452449/2",
    src: "https://i.jvzoo.com/0/452449/2",
    btn: "https://i.jvzoo.com/0/452449/1",
    alt: "Article Pack 7 Natural & Holistic Wellness",
  },
  // Pack 6 — Healthy Aging & Lifestyle
  "healthy-aging-lifestyle": {
    href: "https://www.jvzoo.com/b/0/452447/2",
    src: "https://i.jvzoo.com/0/452447/2",
    btn: "https://i.jvzoo.com/0/452447/1",
    alt: "Article Pack 6 Healthy Aging & Lifestyle",
  },
  // Pack 5 — Stress Management & Mind-Body Wellness
  "stress-management-mind-body-wellness": {
    href: "https://www.jvzoo.com/b/0/452445/2",
    src: "https://i.jvzoo.com/0/452445/2",
    btn: "https://i.jvzoo.com/0/452445/1",
    alt: "Article Pack 5 Stress Management & Mind-Body Wellness",
  },
  // Pack 4 — Sleep & Recovery
  "sleep-recovery": {
    href: "https://www.jvzoo.com/b/0/452435/2",
    src: "https://i.jvzoo.com/0/452435/2",
    btn: "https://i.jvzoo.com/0/452435/1",
    alt: "Article Pack 4 Sleep & Recovery",
  },
  // Pack 3 — Fitness & Exercise
  "fitness-exercise": {
    href: "https://www.jvzoo.com/b/0/452433/2",
    src: "https://i.jvzoo.com/0/452433/2",
    btn: "https://i.jvzoo.com/0/452433/1",
    alt: "Article Pack 3 Fitness & Exercise",
  },
  // Pack 2 — Supplements & Nutritional Support
  "supplements-nutritional-support": {
    href: "https://www.jvzoo.com/b/0/452431/2",
    src: "https://i.jvzoo.com/0/452431/2",
    btn: "https://i.jvzoo.com/0/452431/1",
    alt: "Article Pack 2 Supplements & Nutritional Support",
  },
};
// Fixed Packs 1–4 bundle (JVZoo product 453431) — buy button + tracking pixel.
export const bundleBuy = {
  href: "https://www.jvzoo.com/b/0/453431/2",
  src: "https://i.jvzoo.com/0/453431/2",
  btn: "https://i.jvzoo.com/0/453431/1",
  alt: "Health & Wellness PLR Mega Bundle: 60 SEO Articles + Complete Content Resources Packs 1-4",
};