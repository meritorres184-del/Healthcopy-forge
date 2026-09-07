import { createFileRoute } from "@tanstack/react-router";

// ─── Swap-ready CTA URLs ──────────────────────────────────────────────────────
// Single place to edit later when the owner provides the real destinations.

// Target for the "Apply to join the HealthCopy Forge Affiliate Program" CTAs
// (Sections 12/14). The real JVZoo affiliate signup URL is NOT known yet — the
// owner will provide it from her JVZoo vendor dashboard. TODO: replace "#"
// with the JVZoo affiliate application URL once provided.
const AFFILIATE_APPLY_URL = "#";

// Target for the Section 9 free-sample button. The free sample article link is
// NOT known yet. TODO: replace "#" with the free sample article URL once the
// owner provides/enables it.
const FREE_SAMPLE_URL = "#";

export const Route = createFileRoute("/affiliates")({
  head: () => ({
    meta: [
      { title: "Affiliates: Earn 50% Promoting Health & Wellness PLR" },
      {
        name: "description",
        content:
          "Promote SEO-written health & wellness PLR: 50% per pack, 30% recurring on memberships, 90-day cookie. Done-for-you promo kit.",
      },
    ],
  }),
  component: AffiliatesPage,
});

function AffiliatesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Earn 50% Promoting SEO-Written Health &amp; Wellness PLR
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg italic leading-relaxed text-emerald-700">
            SEO-Written Health &amp; Wellness PLR Content — Ready to Customize,
            Brand &amp; Promote.
          </p>
        </div>
      </section>

      {/* 2. The Opportunity in One Paragraph */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            2. The Opportunity in One Paragraph
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-600 sm:text-lg">
            <p>
              HealthCopy Forge is a done-for-you PLR content library built
              specifically for the health and wellness niche. Every pack
              contains original, researched, SEO-written content — in-depth
              articles plus the email swipes, social media posts, lead magnet,
              license, and disclaimers buyers need to turn it into their own
              branded content. Your job is to introduce it. We handle the
              content, the checkout, and most of the writing.
            </p>
            <p>
              As a HealthCopy Forge affiliate you earn{" "}
              <strong className="font-semibold text-gray-900">
                50% commission on every pack sale
              </strong>{" "}
              — about{" "}
              <strong className="font-semibold text-gray-900">
                $23.50 on a $47 pack
              </strong>{" "}
              and about{" "}
              <strong className="font-semibold text-gray-900">
                $48.50 on the $97 4-pack bundle
              </strong>{" "}
              — plus{" "}
              <strong className="font-semibold text-gray-900">
                30% recurring commission on referred members
              </strong>{" "}
              who stay active. Your affiliate link works for{" "}
              <strong className="font-semibold text-gray-900">90 days</strong>.
              Apply, get approved, grab your done-for-you promo kit, and start
              promoting — most affiliates are set up in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Who This Content Is For */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            3. Who This Content Is For
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            Our buyers are the people who need a steady supply of fresh,
            credible health content:
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Health and wellness bloggers and website owners",
              "Affiliate marketers in supplements, fitness, nutrition, sleep, and healthy-living niches",
              "Wellness coaches and trainers",
              "Content creators, influencers, and newsletter publishers",
              "Online business owners who need quality content for websites, blogs, email, social media, and lead generation",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-gray-600 sm:text-base"
              >
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            These are people who are constantly producing content — and fresh,
            responsibly written health content is hard to find. When you
            recommend HealthCopy Forge, your audience gets it immediately:
            ready-to-brand content they can publish the same day.
          </p>
        </div>
      </section>

      {/* 4. Why These Products Are Easy to Promote */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            4. Why These Products Are Easy to Promote
          </h2>
          <ul className="mt-6 space-y-4">
            {easyToPromote.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3 text-sm text-gray-600 sm:text-base"
              >
                <CheckIcon />
                <span>
                  <strong className="font-semibold text-gray-900">
                    {item.title}
                  </strong>
                  {item.body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. What Every Buyer Receives */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            5. What Every Buyer Receives
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            Each pack ships a complete content system. Most packs include{" "}
            <strong className="font-semibold text-gray-900">
              15 in-depth, SEO-written articles at roughly 5,000 words each —
              about 75,000 words of article content
            </strong>{" "}
            (Pack 6 contains 14 articles at about 70,000 words; Pack 7 contains
            12 in-depth articles plus an FAQ bonus section). Every pack also
            includes:
          </p>
          <ul className="mt-6 space-y-3">
            {[
              ["Email swipes", " — ready-to-adapt promotional emails"],
              ["Social media posts", " — captions for multiple platforms"],
              [
                "Lead magnet content",
                " — to help buyers build their email list",
              ],
              [
                "A PLR license",
                " — clear terms for customizing and using the content",
              ],
              [
                "Health & wellness disclaimers",
                " — appropriate, customizable disclaimer content",
              ],
              ["A bookcover and images", " for the pack"],
            ].map(([title, body]) => (
              <li
                key={title}
                className="flex items-start gap-3 text-sm text-gray-600 sm:text-base"
              >
                <CheckIcon />
                <span>
                  <strong className="font-semibold text-gray-900">
                    {title}
                  </strong>
                  {body}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            Under the included PLR license, buyers can edit, customize, and
            rebrand the content, publish it under their own name, and repurpose
            it into blog posts, emails, lead magnets, videos, podcasts, courses,
            and more — including adding their own affiliate links where
            appropriate.
          </p>
        </div>
      </section>

      {/* 6. Affiliate Commission Structure */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            6. Affiliate Commission Structure
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            Simple and transparent:
          </p>
          <ul className="mt-6 space-y-4">
            {commissionStructure.map((item, idx) => (
              <li
                key={`comm-${idx}`}
                className="flex items-start gap-3 text-sm text-gray-600 sm:text-base"
              >
                <CheckIcon />
                <span>
                  {"parts" in item ? (
                    item.parts.map((part, i) =>
                      part.b ? (
                        <strong
                          key={i}
                          className="font-semibold text-gray-900"
                        >
                          {part.t}
                        </strong>
                      ) : (
                        <span key={i}>{part.t}</span>
                      )
                    )
                  ) : (
                    <>
                      <strong className="font-semibold text-gray-900">
                        {item.title}
                      </strong>
                      {item.body}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm italic leading-relaxed text-gray-500">
            (Figures are examples at current prices — not guarantees of income.)
          </p>
        </div>
      </section>

      {/* 7. Example Affiliate Earnings Per Sale */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            7. Example Affiliate Earnings Per Sale
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            Here's the simple math, shown honestly:
          </p>
          <ul className="mt-6 space-y-3">
            {earningsExamples.map((item) => (
              <li
                key={item.prefix}
                className="flex items-start gap-3 text-sm text-gray-600 sm:text-base"
              >
                <CheckIcon />
                <span>
                  {item.prefix} <strong className="font-semibold text-gray-900">{item.value}</strong>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            These are arithmetic examples at today's prices — not a promise of
            sales, traffic, or income. Your results depend on your audience and
            how you promote.
          </p>
        </div>
      </section>

      {/* 8. Your Done-for-You Affiliate Promo Kit */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            8. Your Done-for-You Affiliate Promo Kit
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            We built the campaign material for you. Every approved affiliate
            receives:
          </p>
          <ul className="mt-6 space-y-3">
            {promoKit.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-gray-600 sm:text-base"
              >
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            Join, grab your affiliate link and your kit, and start introducing
            the products to your audience — without building an entire campaign
            from scratch.
          </p>
        </div>
      </section>

      {/* 9. See the Content First — Free Sample */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            9. See the Content First — Free Sample
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            Before you decide, see the quality for yourself.
          </p>
          <a
            href={FREE_SAMPLE_URL}
            className="mt-8 inline-flex items-center rounded-xl border-2 border-emerald-600 bg-white px-8 py-3.5 text-base font-semibold text-emerald-600 transition-all hover:bg-emerald-50"
          >
            FREE SAMPLE LINK
          </a>
          <p className="mt-8 text-base leading-relaxed text-gray-600 sm:text-lg">
            Our free sample article gives you a real look at the writing
            quality, article organization, SEO structure, keyword placement,
            depth, and formatting — so you know exactly what you'd be
            recommending.
          </p>
        </div>
      </section>

      {/* 10. Current PLR Product Categories */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            10. Current PLR Product Categories
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            The library covers seven health and wellness topics, each available
            as a $47 pack:
          </p>
          <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm text-gray-600 sm:text-base">
            {packCategories.map((item) => (
              <li key={item}>
                <strong className="font-semibold text-gray-900">{item}</strong>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            Packs 1–4 are also available together as a{" "}
            <strong className="font-semibold text-gray-900">
              $97 4-pack bundle — roughly 300,000 words
            </strong>{" "}
            of long-form content covering nutrition, supplements, fitness, and
            sleep.
          </p>
        </div>
      </section>

      {/* 11. New Content, Released Regularly */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            11. New Content, Released Regularly
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-600 sm:text-lg">
            <p>
              The library is open-ended and growing. New SEO-written health
              &amp; wellness PLR content is added regularly — coming topics
              include{" "}
              <strong className="font-semibold text-gray-900">
                meal planning, yoga, meditation, massage, and acupuncture
              </strong>
              , plus new packs, bundles, special promotions, seasonal content,
              and membership plans.
            </p>
            <p>
              Fresh products mean fresh angles for you: new packs give your
              audience new reasons to buy — and give you new content to promote
              all year.
            </p>
          </div>
        </div>
      </section>

      {/* 12. Affiliate FAQs */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            12. Affiliate FAQs
          </h2>
          <div className="mt-10 space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Affiliate Terms & Disclosures */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            13. Affiliate Terms &amp; Disclosures
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-600 sm:text-lg">
            {terms.map((term) => (
              <p key={term.title}>
                <strong className="font-semibold text-gray-900">
                  {term.title}
                </strong>{" "}
                {term.body}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Join the HealthCopy Forge Affiliate Program */}
      <section className="bg-emerald-600 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            14. Join the HealthCopy Forge Affiliate Program
          </h2>
          <p className="mt-6 text-base leading-relaxed text-emerald-100 sm:text-lg">
            You promote. We provide the content, the checkout, and done-for-you
            promotional resources. Here's how to start:
          </p>
          <ol className="mx-auto mt-6 max-w-xl list-decimal space-y-3 pl-5 text-left text-sm text-emerald-100 sm:text-base">
            <li>
              <strong className="font-semibold text-white">Apply</strong> — your
              application is personally reviewed and approved before you start
              promoting.
            </li>
            <li>
              <strong className="font-semibold text-white">
                Get your 90-day affiliate link
              </strong>{" "}
              and your done-for-you promo kit.
            </li>
            <li>
              <strong className="font-semibold text-white">
                Start with the pack or bundle your audience needs most
              </strong>{" "}
              — the free sample shows you exactly what you're recommending.
            </li>
          </ol>
          <a
            href={AFFILIATE_APPLY_URL}
            className="mt-10 inline-flex items-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50"
          >
            Apply to join the HealthCopy Forge Affiliate Program
          </a>
          <p className="mt-6 text-base leading-relaxed text-emerald-100 sm:text-lg">
            Questions? We're happy to help you get set up and pick the right
            packs for your audience.
          </p>
          <p className="mt-8 text-sm italic text-emerald-200">
            HealthCopy Forge — SEO-written health &amp; wellness PLR content,
            ready to customize, brand &amp; promote.
          </p>
        </div>
      </section>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

// ─── Content data (verbatim from affiliates-page-copy.md) ─────────────────────

const easyToPromote = [
  {
    title: "Ready-made products.",
    body: " Complete packs with the checkout already in place. You promote; we handle the rest.",
  },
  {
    title: "SEO-written.",
    body: " Keywords are woven naturally through titles, headings, subheadings, and article copy — a head start on search visibility for buyers.",
  },
  {
    title: "In-depth, not filler.",
    body: " Substantial long-form articles — roughly 75,000 words of article content in most packs — instead of thin recycled posts.",
  },
  {
    title: "Compliance-friendly.",
    body: " Content is responsibly framed, with health & wellness disclaimers included in every pack — designed to help buyers publish informative content without unnecessary medical claims.",
  },
  {
    title: "A full toolkit, not just articles.",
    body: " Each pack includes email swipes, social media posts, a lead magnet, a PLR license, disclaimers, a bookcover, and images.",
  },
  {
    title: "A product your own peers need.",
    body: " The buyers are content-hungry health marketers — the same audience you already reach.",
  },
];

const commissionStructure = [
  {
    title: "50% commission on every qualifying pack sale.",
    body: " Individual packs are $47; the 4-pack bundle is $97.",
  },
  {
    parts: [
      { t: "That's about ", b: false },
      { t: "$23.50 on a $47 pack", b: true },
      { t: " and about ", b: false },
      { t: "$48.50 on the $97 bundle", b: true },
    ],
  },
  {
    title:
      "30% recurring commission on referred members who remain active.",
    body: " The membership has two tiers — Essentials at $47/month and Pro at $97/month — and you earn 30% of each referred member's subscription fee while they stay a member.",
  },
  {
    title: "90-day cookie.",
    body: " A visitor who clicks your link has 90 days to buy, and the sale still counts as yours.",
  },
  {
    title: "Manual review and approval.",
    body: " Every affiliate applies and is personally reviewed and approved before they can promote. It's a quality program built with curated partners — which protects your audience and your reputation.",
  },
];

const earningsExamples = [
  { prefix: "1 pack sale at $47 →", value: "~$23.50" },
  { prefix: "1 bundle sale at $97 →", value: "~$48.50" },
  { prefix: "Sell 10 packs →", value: "~$235 (10 × $23.50)" },
  { prefix: "Sell 5 bundles →", value: "~$242.50 (5 × $48.50)" },
  {
    prefix: "10 referred members on Essentials who stay active →",
    value:
      "~$141/month in recurring commissions (10 × 30% of $47, or $14.10 per member per month)",
  },
];

const promoKit = [
  "Ready-to-customize email swipes",
  "Social media posts (Facebook, Instagram, Pinterest, and short posts)",
  "Product descriptions",
  "Headlines and hooks",
  "Calls to action",
  "Promotional graphics and banners",
  "Sample content for previews",
  "A product information sheet with the facts at a glance",
  "An affiliate disclosure reminder",
  "A suggested promotional calendar",
];

const packCategories = [
  "Nutrition & Everyday Wellness",
  "Supplements & Nutritional Support",
  "Fitness & Exercise",
  "Sleep & Recovery",
  "Stress Management",
  "Healthy Aging",
  "Natural & Holistic Wellness",
];

const faqs = [
  {
    question: "How do I join?",
    answer:
      "Apply through the button below. Every application is personally reviewed and approved before you start promoting, so you know each partner is a good match — and your audience only ever hears about a quality product.",
  },
  {
    question: "What do I earn?",
    answer:
      "50% commission on pack sales — about $23.50 on a $47 pack and about $48.50 on the $97 bundle — plus 30% recurring commission on referred members who remain active (Essentials $47/month, Pro $97/month).",
  },
  {
    question: "How long is the cookie?",
    answer:
      "90 days. If a visitor clicks your link and buys within 90 days, the sale is credited to you.",
  },
  {
    question: "What's in the promo kit?",
    answer:
      "Email swipes, social media posts, product descriptions, headlines and hooks, calls to action, promotional graphics and banners, sample content, a product information sheet, an affiliate disclosure reminder, and a suggested promotional calendar.",
  },
  {
    question: "Is the content mine to rebrand?",
    answer:
      "That's exactly what PLR is for. Under the license included with each pack, buyers may edit, customize, and rebrand the content, publish it under their own name, and repurpose it into blog posts, emails, lead magnets, videos, courses, and more. What they may not do is resell the original unedited package as competing PLR or share the editable source files — customization is encouraged, and the license spells out the terms.",
  },
  {
    question: "What topics are covered?",
    answer:
      "Seven packs today: nutrition, supplements, fitness, sleep & recovery, stress management, healthy aging, and natural & holistic wellness — with new topics added regularly.",
  },
  {
    question: "Do I need my own website?",
    answer:
      "No. You can promote through email, social media, or any channel where your audience is. A website helps, but it's not required.",
  },
];

const terms = [
  {
    title: "Commission terms.",
    body: " Qualifying pack sales earn 50% commission; referred members earn 30% recurring commission while they remain active. Cookie duration is 90 days. Each affiliate is manually reviewed and approved before promoting. Prices and commission structures may change — always confirm current terms before you promote.",
  },
  {
    title: "No income guarantees.",
    body: " We make no promises about your sales, traffic, search rankings, conversions, or income. The earnings examples on this page are arithmetic at current prices, not guarantees. Your results depend on your audience and your promotion.",
  },
  {
    title: "Affiliate disclosure.",
    body: " If you're in the U.S., follow the FTC's guidelines on endorsements: clearly and conspicuously disclose your affiliate relationship whenever you promote — in posts, emails, videos, and on your pages. Check current FTC guidelines regularly; the affiliate disclosure reminder in our promo kit helps you stay on top of it.",
  },
  {
    title: "Responsible health & wellness promotion.",
    body: " Our content is educational and informational, written with responsible language, and every pack includes health & wellness disclaimers. Keep those disclaimers with the content, and don't make medical claims in your promotions — the content is not individualized medical advice.",
  },
  {
    title: "PLR licensing.",
    body: " Buyers receive clear private label rights with every pack: they may edit, customize, rebrand, publish, and sell finished products created from the content, subject to the terms in the included license — including not reselling the original package as competing PLR.",
  },
];