// JVZoo buy buttons & tracking pixels for HealthCopy Forge products.
// Keyed by pack slug (and "bundle" for the fixed Packs 1-4 bundle).
// href/src are the verbatim codes provided by the owner from the JVZoo
// Seller Dashboard (three orange dots -> Buy Buttons).
export interface JvzooProduct {
  href: string; // full buy button link, e.g. https://www.jvzoo.com/b/0/XXXXXX/2
  src: string;  // tracking pixel / button image URL (i.jvzoo.com)
  alt: string;  // alt text shown for the button image
}

export const jvzooProducts: Record<string, JvzooProduct> = {
  // Pack 1 — Nutrition & Everyday Wellness
  "nutrition-everyday-wellness": {
    href: "https://www.jvzoo.com/b/0/452429/2",
    src: "https://i.jvzoo.com/0/452429/2",
    alt: "Article Pack 1 Nutrition & Everyday Wellness",
  },
};