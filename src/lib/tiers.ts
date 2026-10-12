// Membership tier definitions shared across the /join and /join/$tier pages.

export interface Tier {
  slug: string; // 'essentials' | 'pro' — matches the URL param
  name: string;
  price: number; // monthly USD
  tagline: string;
  description: string;
  benefits: string[];
  highlighted?: boolean;
}

export const TIERS: Tier[] = [
  {
    slug: "essentials",
    name: "Essentials",
    price: 47,
    tagline: "Content to publish consistently",
    description:
      "A steady stream of fresh, ready-to-customize content — 5 new SEO articles every month plus a rotating mini ebook, wellness journal, tracker, checklist, or cheat sheet. Everything ships with keyword, title, meta, and CTA support.",
    benefits: [
      "5 new SEO-written articles per month",
      "Keyword, title, meta & CTA support",
      "Rotating mini ebook",
      "Wellness journal",
      "Tracker",
      "Checklist / cheat sheet",
      "Cancel anytime",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    price: 97,
    tagline: "Content + digital products to publish, grow, promote, sell",
    description:
      "Everything in Essentials, expanded — 10–15 articles plus content briefs each month, a full-length PLR ebook, a complete PLR course, premium journals and workbooks, and a monthly Mystery Bonus.",
    benefits: [
      "Everything in Essentials",
      "10–15 articles + content briefs per month",
      "Full-length PLR ebook (40–60 pages)",
      "Complete PLR course (modules, workbook, sales copy)",
      "Premium journal / workbook",
      "Tracker bundle & monthly PLR report",
      "Lead-magnet & email-marketing vaults",
      "Monthly Mystery Bonus",
      "Cancel anytime",
    ],
    highlighted: true,
  },
];

export function getTier(slug: string): Tier | undefined {
  return TIERS.find((t) => t.slug === slug);
}