// LIVE Stripe checkout destinations (owner's standard Stripe account, live 2026-10-12).
//
// Every paid membership + course CTA on the site points at one of these three
// Stripe Payment Links, and nowhere else — there is no on-site checkout flow and
// no server-side Stripe API call to break:
//
//   * The link page is hosted by Stripe, so card data never touches this site.
//   * The price is set on the Stripe product ($47/mo Essentials, $97/mo Pro,
//     $47 one-time Course) — the number rendered on the page is display copy, so
//     if a price ever changes, change BOTH the Stripe product and the copy here.
//   * Each link's after-completion redirect is configured to send the buyer back
//     to https://www.healthcopyforge.com/join — keep that behavior when editing
//     the links in Stripe.
//
// The article packs and ebooks are NOT sold here: those purchases hand off to
// JVZoo (see src/jvzoo.ts). This module is only the Stripe side of the business.
//
// scripts/verify-prerender.mjs asserts these exact URLs appear in the baked HTML
// of the pages below, so a CTA that silently loses its link fails the build
// instead of shipping a dead button.

export const STRIPE_PAYMENT_LINKS = {
  /** Membership tier 1 — Health Copy Forge Essentials, $47/month. */
  essentials: "https://buy.stripe.com/00wdRbdCza7AfUS5w53sI00",
  /** Membership tier 2 — Health Copy Forge Pro, $97/month. */
  pro: "https://buy.stripe.com/8x26oJfKHfrUaAy4s13sI01",
  /** Standalone digital product — Health Copy Forge Course, $47 one-time. */
  course: "https://buy.stripe.com/bJeaEZ41ZcfI0ZY0bL3sI02",
} as const;

export type StripeCheckoutKey = keyof typeof STRIPE_PAYMENT_LINKS;

/** The payment link for a membership tier slug ('essentials' | 'pro'). */
export function membershipCheckoutHref(tierSlug: string): string | undefined {
  return tierSlug === "essentials" || tierSlug === "pro"
    ? STRIPE_PAYMENT_LINKS[tierSlug]
    : undefined;
}

/** The standalone course offer, as shown on /pricing, /membership and /join/pro. */
export const COURSE_OFFER = {
  name: "Complete PLR Course",
  price: 47,
  href: STRIPE_PAYMENT_LINKS.course,
  blurb:
    "A complete, rebrandable PLR course — modules, workbook and sales copy you can publish under your own brand.",
} as const;
