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
            Buy a single pack when you need it, or unlock the entire library with
            a membership. Either way, every piece of content is researched,
            written, and ready to rebrand as your own.
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
                Buy only what you need — one-time purchase, yours forever.
              </p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                  $27–$97
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
                Browse Packs
              </Link>
            </div>

            {/* Membership */}
            <div className="relative flex flex-col rounded-2xl border-2 border-emerald-500 bg-white p-8 shadow-lg shadow-emerald-100">
              <span className="absolute -top-3 right-6 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                Best Value
              </span>
              <h2 className="text-xl font-bold text-gray-900">Membership</h2>
              <p className="mt-2 text-sm text-gray-500">
                Full library access plus exclusive monthly drops.
              </p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                  $39–$59
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
                to="/membership"
                hash="join"
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
              to="/membership"
              hash="join"
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
  "Ready-to-rebrand articles",
  "Email sequences included",
  "Social media post templates",
  "Lead magnet in every pack",
  "One-time purchase — yours forever",
];

const membershipIncluded = [
  "Full access to the entire library",
  "Exclusive monthly content drops",
  "All articles, email sequences, social posts & lead magnets",
  "Compliant-friendly, researched content",
  "New packs added every month",
  "Cancel anytime",
];

const faqs = [
  {
    question: "Can I buy a single pack without a membership?",
    answer:
      "Absolutely. Individual packs are one-time purchases between $27 and $97, and you keep them forever.",
  },
  {
    question: "What formats are included in each pack?",
    answer:
      "Every pack includes ready-to-rebrand articles, email sequences, social media posts, and a lead magnet.",
  },
  {
    question: "Can I cancel my membership anytime?",
    answer:
      "Yes — there are no contracts. Cancel anytime and you keep access through the end of your billing period.",
  },
  {
    question: "Can I really rebrand and publish the content as my own?",
    answer:
      "Yes. It's PLR (private label rights) — edit, rebrand, and publish it as your own. That's the whole point.",
  },
];
