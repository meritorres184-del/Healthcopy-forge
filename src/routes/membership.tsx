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

export const Route = createFileRoute("/membership")({
  loader: () => getBusinessName(),
  component: MembershipPage,
});

function MembershipPage() {
  const businessName = Route.useLoaderData();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Membership
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Full Library Access,{" "}
            <span className="text-emerald-600">New Packs Every Month</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Done-for-you content you can rebrand and publish immediately —
            articles, email sequences, social posts, and lead magnets — all
            professionally researched and edited, grammar-free and ready for
            your audience.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#join"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700"
            >
              Join the Membership
            </a>
            <Link
              to="/packs"
              className="inline-flex items-center rounded-xl border-2 border-gray-200 px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-emerald-200 hover:text-emerald-700"
            >
              Browse the Packs
            </Link>
          </div>
        </div>
        {/* Decorative background blur */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-10 -left-20 h-64 w-64 rounded-full bg-green-200/30 blur-3xl" />
      </section>

      {/* Benefits */}
      <section className="px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything in the Library,{" "}
              <span className="text-emerald-600">Plus Monthly Drops</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              One membership unlocks every pack we've ever written — and every
              pack we'll write next.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Research & compliance band */}
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-8 py-6 text-center sm:flex-row sm:text-left">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
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
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </span>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Professionally Edited, Grammar-Free &amp; Compliant-Friendly
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                Unlike most PLR, every pack is professionally edited and
                grammar-free — so the content reads clean when you publish it.
                It's also built around accurate, defensible claims with
                compliant-friendly framing, so you keep your audience's trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Who This Is For
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built for Health &amp; Wellness Affiliates
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            If you promote health products or publish health content, the
            membership gives you a constant supply of ready-to-use material —
            no writing required.
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
                <span className="mt-1 text-xs leading-relaxed text-gray-500">
                  {audience.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Callout / Join */}
      <section id="join" className="px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <div className="relative rounded-2xl border-2 border-emerald-500 bg-white p-8 text-center shadow-lg shadow-emerald-100 sm:p-12">
            <span className="absolute -top-3 right-1/2 translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
              Best Value
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {businessName} Membership
            </h2>
            <div className="mt-6">
              <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                $39–$59
              </span>
              <span className="ml-1 text-lg text-gray-400">/month</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Full library access · Exclusive monthly drops · Cancel anytime
            </p>
            <Link
              to="/join"
              className="mt-8 block w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-emerald-700"
            >
              Join the Membership
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Choose between{" "}
              <Link
                to="/join"
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                Standard
              </Link>{" "}
              and{" "}
              <Link
                to="/join"
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                Premium
              </Link>{" "}
              to unlock full library access plus monthly drops. Cancel anytime.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- Data ---

const benefits = [
  {
    title: "Full Library Access",
    description:
      "Every content pack we've published — and everything we publish while you're a member. No paywalls, no extra fees.",
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
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
  {
    title: "Monthly Exclusive Drops",
    description:
      "New content packs land every month — and some drops are members-only, so your library keeps growing while your competitors keep writing.",
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
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Ready-to-Rebrand Articles",
    description:
      "SEO-friendly, professionally edited and grammar-free articles you can edit, brand, and publish as your own in minutes.",
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
      "Pre-written nurture and launch sequences that build trust and warm up your subscribers — just add your affiliate links.",
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
    title: "Social Media Templates",
    description:
      "Swipe-ready posts for Instagram, Facebook, X/Twitter, and LinkedIn — captions, hooks, and hashtags included.",
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
  {
    emoji: "💊",
    label: "Supplement Promoters",
    description: "Fresh content for every launch",
  },
  {
    emoji: "💪",
    label: "Fitness Influencers",
    description: "Posts that keep your feed full",
  },
  {
    emoji: "🌿",
    label: "Health Bloggers",
    description: "Articles that rank and convert",
  },
  {
    emoji: "🎯",
    label: "Niche Site Owners",
    description: "Scalable content, zero writing",
  },
];
