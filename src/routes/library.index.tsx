import { createFileRoute } from "@tanstack/react-router";
import { getLibraryPacks } from "../lib/packs";
import { ContentUnavailable } from "../components/ContentUnavailable";
import { JvzooDisclaimer } from "../components/JvzooDisclaimer";
import { JvzooBuyButton } from "../components/JvzooBuyButton";
import { liveJvzooProduct } from "../jvzoo";

export const Route = createFileRoute("/library/")({
  head: () => ({
    meta: [
      { title: "Member Content Library | HealthCopy Forge" },
      {
        name: "description",
        content:
          "Members: browse every HealthCopy Forge PLR pack and download articles, emails, social posts & lead magnets in any format.",
      },
    ],
  }),
  loader: async () => {
    try {
      return { packs: await getLibraryPacks(), degraded: false };
    } catch (err) {
      // Reads are already retried in src/db.ts; if they still fail, say so on
      // the page rather than letting the loader error blank it.
      console.error(
        "[library] content_packs read failed; rendering the unavailable notice",
        err,
      );
      return { packs: [], degraded: true };
    }
  },
  component: LibraryPage,
});

function LibraryPage() {
  const { packs, degraded } = Route.useLoaderData();

  if (degraded) {
    return (
      <main>
        <ContentUnavailable heading="Your Content Library" />
      </main>
    );
  }

  // Group by category for a clean library layout.
  const categoryLabels: Record<string, string> = {
    Nutrition: "Nutrition & Everyday Wellness",
    Supplements: "Supplements & Nutritional Support",
    Fitness: "Fitness & Exercise",
    "Sleep & Recovery": "Sleep & Recovery",
    "Stress & Mind-Body": "Stress Management & Mind-Body Wellness",
    "Healthy Aging": "Healthy Aging & Lifestyle",
    "Natural & Holistic": "Natural & Holistic Wellness",
  };
  const groups: { name: string; packs: typeof packs }[] = [];
  for (const pack of packs) {
    const label = categoryLabels[pack.category] ?? pack.category;
    let group = groups.find((g) => g.name === label);
    if (!group) {
      group = { name: label, packs: [] };
      groups.push(group);
    }
    group.packs.push(pack);
  }
  // Packs that have a JVZoo listing. The library page is a public route, so it
  // carries the same buy button + tracking pixel + retailer disclaimer as every
  // other pack page: a visitor (or a reviewer) landing here always has a working
  // buy path, and a page that sells is never without the required disclaimer.
  const buyable = packs.filter((pack) => liveJvzooProduct(pack.slug));

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Member Library
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Your <span className="text-emerald-600">Content Library</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
            Every pack available to members — and everything we publish next.
            Browse below, open a pack, and download any format.
          </p>
        </div>
      </section>

      {/* Note */}
      <section className="px-4 pt-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-6 py-4 text-sm text-emerald-800">
            <strong>Note:</strong> Member access is being finalized — your
            purchases will appear here.
          </div>
        </div>
      </section>

      {/* Pack grid */}
      <section className="px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          {groups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-gray-500">
                No packs available yet. Check back soon — new content is on the
                way.
              </p>
            </div>
          ) : (
            groups.map((category) => (
              <div key={category.name} className="mb-16">
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {category.name}
                  </h2>
                  <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-500">
                    {category.packs.length}{" "}
                    {category.packs.length > 1 ? "packs" : "pack"}
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.packs.map((pack) => (
                    <PackCard key={pack.slug} pack={pack} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Buy any pack — JVZoo buy button + tracking pixel per pack */}
      {buyable.length > 0 ? (
        <section className="border-t border-gray-100 bg-gray-50 px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                Buy a pack now
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
                Every pack is a one-time purchase with instant download after
                checkout — buy securely through JVZoo.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {buyable.map((pack) => {
                const j = liveJvzooProduct(pack.slug);
                if (!j) return null;
                return (
                  <div
                    key={pack.slug}
                    className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
                  >
                    <p className="text-base font-bold leading-snug text-gray-900">
                      {pack.title}
                    </p>
                    <span className="text-sm text-gray-500">
                      ${pack.price} one-time
                    </span>
                    <JvzooBuyButton
                      product={j}
                      imgClassName="h-11 w-auto rounded-lg shadow-sm transition-transform hover:scale-105"
                    />
                  </div>
                );
              })}
            </div>
            <JvzooDisclaimer compact />
          </div>
        </section>
      ) : null}
    </main>
  );
}

function PackCard({ pack }: { pack: any }) {
  return (
    <a href={`/library/${pack.slug}`} className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:border-emerald-200">
      <div className="h-2 rounded-t-2xl bg-emerald-500" />
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-3 w-fit rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          {pack.category}
        </span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">
          {pack.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
          {pack.description}
        </p>
        <div className="mt-4 space-y-1.5">
          {pack.includes.map((item: string) => (
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
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-xl font-extrabold text-gray-900">
            ${pack.price}
          </span>
          <span className="text-sm font-semibold text-emerald-600 transition-colors group-hover:text-emerald-700">
            Open pack →
          </span>
        </div>
      </div>
    </a>
  );
}
