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

export const Route = createFileRoute("/")({
  loader: () => getBusinessName(),
  component: Home,
});

function Home() {
  const businessName = Route.useLoaderData();

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white px-4 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            PLR Content for Health Niche Marketers
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Done-for-You Health{" "}
            <span className="text-emerald-600">PLR Content Packs</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Skip the writing and focus on driving traffic and conversions.
            Professionally researched, ready-to-rebrand content packs —
            including articles, email sequences, social media posts, and lead
            magnets — built for health-niche affiliate marketers.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/packs"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200"
            >
              Browse Packs
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center rounded-xl border-2 border-gray-200 px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-emerald-200 hover:text-emerald-700"
            >
              View Pricing
            </Link>
          </div>
        </div>
        {/* Decorative background blur */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-10 -left-20 h-64 w-64 rounded-full bg-green-200/30 blur-3xl" />
      </section>

      {/* Value Proposition Section */}
      <section className="px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need to{" "}
              <span className="text-emerald-600">Grow Your Audience</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Each content pack is a complete marketing arsenal — researched,
              written, and ready for you to brand as your own.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Who This Is For
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built for Health &amp; Wellness Affiliates
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Whether you're promoting supplements, running a fitness blog, or
            building a natural-health audience — our PLR packs give you the
            content engine to keep your funnel full without spending hours
            staring at a blank page.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience) => (
              <div
                key={audience.label}
                className="flex flex-col items-center rounded-xl bg-white px-6 py-8 shadow-sm"
              >
                <span className="text-2xl">{audience.emoji}</span>
                <span className="mt-3 text-sm font-semibold text-gray-800">
                  {audience.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section id="pricing" className="px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Simple Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Two Ways to Get Your Content
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Grab a single pack or unlock the entire library — no subscriptions
            required unless you want one.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {/* Individual Packs */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-left shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">
                Individual Packs
              </h3>
              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                $27 – $97
              </p>
              <p className="mt-1 text-sm text-gray-500">per pack</p>
              <ul className="mt-6 space-y-3">
                {[
                  "Ready-to-rebrand articles",
                  "Email sequences included",
                  "Social media post templates",
                  "Lead magnet in every pack",
                  "One-time purchase — yours forever",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
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
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/packs"
                className="mt-8 block w-full rounded-xl bg-white border-2 border-emerald-600 px-6 py-3 text-center text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-50"
              >
                Browse Packs
              </Link>
            </div>

            {/* Membership */}
            <div className="relative rounded-2xl border-2 border-emerald-500 bg-white p-8 text-left shadow-lg shadow-emerald-100">
              <span className="absolute -top-3 right-6 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                Best Value
              </span>
              <h3 className="text-xl font-bold text-gray-900">Membership</h3>
              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                $39 – $59
              </p>
              <p className="mt-1 text-sm text-gray-500">per month</p>
              <ul className="mt-6 space-y-3">
                {[
                  "Full access to the entire library",
                  "Exclusive monthly content drops",
                  "All article packs included",
                  "All email sequences included",
                  "All social media templates included",
                  "All lead magnets included",
                  "Cancel anytime",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
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
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="mt-8 block w-full rounded-xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700"
              >
                Join Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Stop Writing and Start Growing?
          </h2>
          <p className="mt-4 text-lg text-emerald-100">
            Join health-niche affiliates who are already using {businessName}{" "}
            content packs to scale their content marketing — without the
            burnout.
          </p>
          <Link
            to="/packs"
            className="mt-8 inline-flex items-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl"
          >
            Get Started Now
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}

// --- Data ---

const features = [
  {
    title: "Ready-to-Rebrand Articles",
    description:
      "Professionally researched, compliance-friendly health articles you can publish as your own. Edit, brand, and go live in minutes.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
  },
  {
    title: "Email Sequences",
    description:
      "Pre-written nurture sequences that build trust and warm up your subscribers for affiliate offers — just add your links.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
  {
    title: "Social Media Posts",
    description:
      "Swipe-ready social content optimized for engagement — Instagram, Facebook, Twitter/X, and LinkedIn templates included.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
        />
      </svg>
    ),
  },
  {
    title: "Lead Magnets",
    description:
      "High-converting opt-in assets — checklists, guides, and mini-reports — designed to grow your email list in health niches.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
        />
      </svg>
    ),
  },
];

const audiences = [
  { emoji: "💊", label: "Supplement Promoters" },
  { emoji: "💪", label: "Fitness Influencers" },
  { emoji: "🌿", label: "Natural-Health Bloggers" },
  { emoji: "🎯", label: "Niche Site Owners" },
];
