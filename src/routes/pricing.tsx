import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";

const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "HealthCopy Forge";
  } catch {
    return "HealthCopy Forge";
  }
});

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing: $47 PLR Packs or $47–$97/mo Membership" },
      {
        name: "description",
        content:
          "One pack $47, any 4 for $97, or monthly membership $47–$97 with new SEO health articles, ebooks & courses. Cancel anytime.",
      },
    ],
  }),
  loader: () => getBusinessName(),
  component: PricingPage,
});

function PricingPage() {
  const businessName = Route.useLoaderData();

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Simple Pricing
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Two Ways to Get Your Content
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
            Buy a single pack when you need it, or join the membership for a
            steady stream of fresh content. Either way, every piece of content
            is SEO-written and ready to customize, brand, and promote.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-4 pb-12 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Individual Packs */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Individual Packs</h2>
              <p className="mt-2 text-sm text-gray-500">
                $47 per pack — or any 4 packs for $97. One-time purchase, yours
                forever.
              </p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                  $47
                </span>
                <span className="ml-1 text-sm text-gray-400">per pack</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {packsIncluded.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/packs"
                className="mt-8 block w-full rounded-xl border-2 border-emerald-600 bg-white px-6 py-3 text-center text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-50"
              >
                Browse the 7 Packs
              </Link>
            </div>

            {/* Membership */}
            <div className="relative flex flex-col rounded-2xl border-2 border-emerald-500 bg-white p-8 shadow-lg shadow-emerald-100">
              <span className="absolute -top-3 right-6 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                Best Value
              </span>
              <h2 className="text-xl font-bold text-gray-900">Membership</h2>
              <p className="mt-2 text-sm text-gray-500">
                Essentials $47/mo — content to publish consistently. Pro $97/mo —
                content plus digital products to publish, grow, promote, and
                sell.
              </p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                  $47–$97
                </span>
                <span className="ml-1 text-sm text-gray-400">per month</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {membershipIncluded.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/join"
                className="mt-8 block w-full rounded-xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700"
              >
                Join the Membership
              </Link>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Checkout goes live soon — both one-time packs and memberships will be
            available then.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Not Sure Which Option Is Right?
          </h2>
          <p className="mt-4 text-lg text-emerald-100">
            Start with a single pack to try the quality, or jump straight into{" "}
            {businessName} Membership for the whole library. You can't go wrong
            with either.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/packs"
              className="inline-flex items-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50"
            >
              Browse Packs
            </Link>
            <Link
              to="/join"
              className="inline-flex items-center rounded-xl border-2 border-white/70 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              See the Membership
            </Link>
          </div>
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

// --- Data ---

const packsIncluded = [
  "SEO-written, ready-to-customize articles",
  "Email swipes & sequences included",
  "Social media posts included",
  "Lead magnet in every pack",
  "PLR license & health disclaimers included",
  "Bookcover & images in every pack",
  "One-time purchase — yours forever",
];

const membershipIncluded = [
  "Essentials — 5 new SEO articles monthly",
  "Pro — 10–15 articles + PLR ebook & course",
  "Keyword, title, meta & CTA support",
  "Rotating mini ebooks, journals, trackers & checklists",
  "Lead-magnet & email-marketing vaults on Pro",
  "Monthly Mystery Bonus on Pro",
  "Cancel anytime",
];

const faqs = [
  {
    question: "Can I buy a single pack without a membership?",
    answer:
      "Absolutely. Individual packs are $47 each (any 4 packs for $97), and you keep them forever.",
  },
  {
    question: "What formats are included in each pack?",
    answer:
      "Every pack includes SEO-written articles, email swipes & sequences, social media posts, a lead magnet, a PLR license, health & wellness disclaimers, and a bookcover.",
  },
  {
    question: "Can I cancel my membership anytime?",
    answer:
      "Yes — there are no contracts. Cancel anytime and you keep access through the end of your billing period.",
  },
  {
    question: "Can I really rebrand and publish the content as my own?",
    answer:
      "Yes. It's PLR (private label rights) — customize, brand, and publish it as your own. That's the whole point.",
  },
];
