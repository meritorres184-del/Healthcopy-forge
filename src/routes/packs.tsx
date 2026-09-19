import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { readWithRetry } from "../db";
import { JvzooDisclaimer } from "../components/JvzooDisclaimer";
import { bundleBuy, jvzooProducts } from "../jvzoo";
import { UNAVAILABLE_MESSAGE } from "../components/ContentUnavailable";

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

// Read the content packs from the database instead of hardcoded data.
const getPacks = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await readWithRetry(
    "packs.list",
    (db) => db`select
      slug, title, description, price_cents, category, coming_soon, includes
    from content_packs
    order by id`,
  );
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    description: r.description,
    price: (r.price_cents as number) / 100,
    category: r.category,
    comingSoon: r.coming_soon as boolean,
    includes: r.includes as string[],
    cover: `/covers/pack-${slugToPackNumber(r.slug)}.jpg`,
  }));
});

// Map a pack slug back to its 1–7 cover image file.
function slugToPackNumber(slug: string): string {
  const map: Record<string, string> = {
    "nutrition-everyday-wellness": "1-1",
    "supplements-nutritional-support": "2-1",
    "fitness-exercise": "3-1",
    "sleep-recovery": "4-1",
    "stress-management-mind-body-wellness": "5-1",
    "healthy-aging-lifestyle": "6-1",
    "natural-holistic-wellness": "7",
    "product-reviews-buying-guides": "8",
  };
  return map[slug] ?? "1-1";
}

export const Route = createFileRoute("/packs")({
  head: () => ({
    meta: [
      { title: "Health & Wellness PLR Packs: 7 Topics | HealthCopy Forge" },
      {
        name: "description",
        content:
          "Browse 7 SEO-written health PLR packs: nutrition, supplements, fitness, sleep, stress, aging & holistic wellness. $47 each or any 4 for $97.",
      },
    ],
  }),
  loader: async (): Promise<PacksLoaderData> => {
    const businessName = await getBusinessName();
    try {
      return { businessName, packs: await getPacks(), degraded: false };
    } catch (err) {
      // A failed read must never blank this page — JVZoo buyers (and JVZoo's
      // own reviewers) land here. Render the notice plus the live buy buttons.
      console.error(
        "[packs] content_packs read failed; rendering the degraded pack list",
        err,
      );
      return { businessName, packs: [], degraded: true };
    }
  },
  component: PacksPage,
});

// Loader shape for /packs. `degraded` is true only when the pack list could
// not be read; the page then shows an honest notice instead of the grid.
type PacksLoaderData = {
  businessName: string;
  packs: Pack[];
  degraded: boolean;
};

function PacksPage() {
  const { packs, degraded } = Route.useLoaderData();

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Content Packs
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            SEO-Written Health &amp; Wellness PLR Content Packs
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Comprehensive, SEO-written health and wellness content you can
            customize for your own brand and audience. Use it for your website.
            Turn it into newsletter content. Create social media posts. Add your
            own affiliate recommendations. Repurpose it into other content and
            digital resources according to the included PLR license.
          </p>
        </div>
      </section>

      {/* Pack Grid */}
      <section className="px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          {degraded ? (
            <>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center">
                <p className="text-base font-semibold text-amber-900">
                  {UNAVAILABLE_MESSAGE} — the pack details didn&apos;t load
                </p>
                <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
                  Our content service didn&apos;t answer just now, so the pack
                  descriptions are missing from this page. Every pack is still
                  on sale through the links below; reload in a moment for the
                  full details.
                </p>
              </div>
              <FallbackPackButtons />
            </>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packs.map((pack) => (
                <PackCard key={pack.slug} pack={pack} />
              ))}
            </div>
          )}

          {/* 4-Pack Bundle note */}
          <div className="mt-14 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center sm:px-10">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Any 4 Packs for $97
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Choose any four packs and save over $90 compared to buying them
              individually — or grab the ready-made Packs 1–4 Mega Bundle below
              and get started right away.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={bundleBuy.href}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                <img
                  src={bundleBuy.btn}
                  alt={bundleBuy.alt}
                  border="0"
                  className="h-16 w-auto rounded-xl shadow-md transition-transform hover:scale-105"
                />
              </a>
              {/* JVZoo tracking pixel — required alongside the buy button */}
              <img
                src={bundleBuy.src}
                width="1"
                height="1"
                alt=""
                aria-hidden="true"
                className="pointer-events-none"
              />
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Buy securely through JVZoo — instant download after checkout.
            </p>
          </div>
          <JvzooDisclaimer compact />
        </div>
      </section>


      {/* CTA */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Start With More Than a Blank Page
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Which Packs Fit Your Business?
          </h2>
          <p className="mt-3 text-gray-600">
            Seven article packs. Seven wellness categories. One powerful content
            library. Instead of sitting down every week and asking, “What am I
            going to write about now?” — you can ask, “What can I create from the
            content I already have?”
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

// --- Degraded (database unreachable) pack list ---
//
// The JVZoo buy buttons, links and tracking pixels come from src/jvzoo.ts, not
// the database, so they can stay live even when the pack rows cannot be read.
// Names come from the button alt text (e.g. "Article Pack 4 Sleep & Recovery").
function packNameFromAlt(alt: string): string {
  return alt.replace(/^Article Pack \d+\s*/, "").trim();
}

function FallbackPackButtons() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(jvzooProducts).map(([slug, j]) => (
        <div
          key={slug}
          className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
        >
          <p className="text-base font-bold leading-snug text-gray-900">
            {packNameFromAlt(j.alt)}
          </p>
          <span className="text-sm text-gray-500">$47 one-time</span>
          <a href={j.href} target="_blank" rel="nofollow noopener noreferrer">
            <img
              src={j.btn}
              alt={j.alt}
              border="0"
              className="h-11 w-auto rounded-lg shadow-sm transition-transform hover:scale-105"
            />
          </a>
          {/* JVZoo tracking pixel — required alongside the buy button */}
          <img
            src={j.src}
            width="1"
            height="1"
            alt=""
            aria-hidden="true"
            className="pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
}

// --- Pack Card Component ---

function PackCard({ pack }: { pack: Pack }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:border-emerald-100">
      {/* Cover */}
      {pack.cover && (
        <div className="overflow-hidden rounded-t-2xl bg-gradient-to-b from-emerald-50 to-white">
          <img
            src={pack.cover}
            alt={`${pack.title} bookcover`}
            loading="lazy"
            className="mx-auto h-56 w-auto object-contain"
          />
        </div>
      )}

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
            <div
              key={item}
              className="flex items-center gap-2 text-xs text-gray-500"
            >
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
          ) : jvzooProducts[pack.slug] ? (
            <>
              <a
                href={jvzooProducts[pack.slug].href}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                <img
                  src={jvzooProducts[pack.slug].btn}
                  alt={jvzooProducts[pack.slug].alt}
                  border="0"
                  className="h-11 w-auto rounded-lg shadow-sm transition-transform hover:scale-105"
                />
              </a>
              {/* JVZoo tracking pixel — required alongside the buy button */}
              <img
                src={jvzooProducts[pack.slug].src}
                width="1"
                height="1"
                alt=""
                aria-hidden="true"
                className="pointer-events-none"
              />
            </>
          ) : null}
        </div>
        <JvzooDisclaimer compact />
      </div>
    </div>
  );
}

// --- Data Types ---

interface Pack {
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  comingSoon: boolean;
  includes: string[];
  cover: string;
}