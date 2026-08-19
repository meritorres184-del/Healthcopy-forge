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

export const Route = createFileRoute("/packs")({
  loader: () => getBusinessName(),
  component: PacksPage,
});

function PacksPage() {
  const businessName = Route.useLoaderData();

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Content Packs
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {businessName} PLR Content Packs
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Professionally researched, ready-to-rebrand content packs for
            health-niche affiliate marketers. Each pack includes articles, email
            sequences, social media posts, and a lead magnet.
          </p>
        </div>
      </section>

      {/* Pack Grid */}
      <section className="px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          {categories.map((category) => (
            <div key={category.name} className="mb-16">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {category.name}
                </h2>
                <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-500">
                  {category.packs.length} pack{category.packs.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.packs.map((pack) => (
                  <PackCard key={pack.title} pack={pack} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Teaser */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            More on the Way
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            New Packs Added Regularly
          </h2>
          <p className="mt-3 text-gray-600">
            We're constantly researching and writing new content packs across
            trending health sub-niches. Check back soon — or join the membership
            to get new drops automatically.
          </p>
          <Link
            to="/membership"
            className="mt-6 inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            Learn about membership →
          </Link>
        </div>
      </section>
    </main>
  );
}

// --- Pack Card Component ---

function PackCard({ pack }: { pack: Pack }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:border-emerald-100">
      {/* Top accent bar */}
      <div
        className={`h-2 rounded-t-2xl ${pack.comingSoon ? "bg-amber-400" : "bg-emerald-500"}`}
      />

      <div className="flex flex-1 flex-col p-6">
        {/* Badge row */}
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            {pack.category}
          </span>
          {pack.comingSoon && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              Coming Soon
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 leading-snug">
          {pack.title}
        </h3>

        {/* Description */}
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
          {pack.description}
        </p>

        {/* What's inside */}
        <div className="mt-4 space-y-1.5">
          {pack.includes.map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-gray-500">
              <svg
                className="h-4 w-4 flex-shrink-0 text-emerald-400"
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
            </div>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="mt-6 flex items-end justify-between border-t border-gray-100 pt-4">
          <div>
            <span className="text-2xl font-extrabold text-gray-900">
              ${pack.price}
            </span>
            <span className="ml-0.5 text-sm text-gray-400">one-time</span>
          </div>
          {pack.comingSoon ? (
            <span className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-400 cursor-not-allowed">
              Coming Soon
            </span>
          ) : (
            <button
              type="button"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 cursor-not-allowed opacity-70"
              title="Purchasing will be available soon"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Data Types ---

interface Pack {
  title: string;
  description: string;
  price: number;
  category: string;
  comingSoon: boolean;
  includes: string[];
}

interface CategoryGroup {
  name: string;
  packs: Pack[];
}

// --- Placeholder Data ---

const categories: CategoryGroup[] = [
  {
    name: "Supplements & Nutrition",
    packs: [
      {
        title: "The Ultimate Probiotics Content Pack",
        description:
          "Complete PLR kit covering gut health, probiotic strains, and supplement guides. Perfect for supplement affiliate sites.",
        price: 47,
        category: "Supplements",
        comingSoon: false,
        includes: [
          "5 SEO-optimized articles",
          "7-day email sequence",
          "10 social media posts",
          "Probiotic checklist lead magnet",
        ],
      },
      {
        title: "Nootropics & Brain Health Bundle",
        description:
          "Cognitive enhancement and brain health content for the booming nootropics niche. Ready to rebrand in minutes.",
        price: 67,
        category: "Supplements",
        comingSoon: false,
        includes: [
          "6 long-form articles",
          "5-day nurture sequence",
          "12 social media templates",
          "Brain-boosting foods guide (PDF)",
        ],
      },
      {
        title: "Collagen & Skin Health Pack",
        description:
          "Beauty-from-within content focused on collagen supplements, skin health, and anti-aging nutrition.",
        price: 57,
        category: "Supplements",
        comingSoon: true,
        includes: [
          "4 articles",
          "Email welcome series",
          "8 social posts",
          "Glow-up checklist lead magnet",
        ],
      },
    ],
  },
  {
    name: "Fitness & Performance",
    packs: [
      {
        title: "Pre-Workout & Energy Content Kit",
        description:
          "Everything you need to promote pre-workout supplements, energy boosters, and workout nutrition to fitness audiences.",
        price: 37,
        category: "Fitness",
        comingSoon: false,
        includes: [
          "4 articles on pre-workout nutrition",
          "5-email launch sequence",
          "10 Instagram-ready posts",
          "Pre-workout timing guide",
        ],
      },
      {
        title: "Recovery & Muscle Growth Bundle",
        description:
          "Post-workout recovery, protein timing, and muscle-building content tailored for the fitness supplement market.",
        price: 77,
        category: "Fitness",
        comingSoon: true,
        includes: [
          "6 in-depth articles",
          "7-day drip sequence",
          "15 social media templates",
          "Recovery protocol lead magnet",
        ],
      },
    ],
  },
  {
    name: "Natural Health & Wellness",
    packs: [
      {
        title: "Adaptogens & Herbal Wellness Pack",
        description:
          "Ride the adaptogen trend with content on ashwagandha, rhodiola, reishi, and other herbal supplements — all PLR-ready.",
        price: 87,
        category: "Natural Health",
        comingSoon: false,
        includes: [
          "7 articles on adaptogenic herbs",
          "10-email educational sequence",
          "20 social media posts",
          "Herbal wellness starter guide",
        ],
      },
    ],
  },
];
