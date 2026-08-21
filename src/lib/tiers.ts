// Membership tier definitions shared across the /join and /join/$tier pages.

export interface Tier {
  slug: string; // 'standard' | 'premium' — matches the URL param
  name: string;
  price: number; // monthly USD
  tagline: string;
  description: string;
  benefits: string[];
  highlighted?: boolean;
}

export const TIERS: Tier[] = [
  {
    slug: "standard",
    name: "Standard",
    price: 39,
    tagline: "Full library access",
    description:
      "Everything you need for a steady stream of health content — full library access plus a fresh exclusive pack every month.",
    benefits: [
      "Full access to the entire content library",
      "One exclusive monthly pack",
      "All content formats: articles, email sequences, social posts & lead magnets",
      "Professionally edited, grammar-free content",
      "Compliant-friendly, researched content",
      "Cancel anytime",
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    price: 59,
    tagline: "Everything in Standard, plus more",
    description:
      "For serious affiliates who want more content, faster. Maximum volume with early access and a monthly publishing plan.",
    benefits: [
      "Everything in Standard",
      "Two exclusive packs per month",
      "7-day early access to new packs",
      "Monthly content calendar",
      "All content formats: articles, email sequences, social posts & lead magnets",
      "Professionally edited, grammar-free content",
      "Cancel anytime",
    ],
    highlighted: true,
  },
];

export function getTier(slug: string): Tier | undefined {
  return TIERS.find((t) => t.slug === slug);
}
