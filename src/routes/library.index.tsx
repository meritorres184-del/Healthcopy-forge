import { createFileRoute, Link } from "@tanstack/react-router";
import { getLibraryPacks } from "../lib/packs";

export const Route = createFileRoute("/library/")({
  loader: () => getLibraryPacks(),
  component: LibraryPage,
});

function LibraryPage() {
  const packs = Route.useLoaderData();

  // Group by category for a clean library layout.
  const categoryLabels: Record<string, string> = {
    Supplements: "Supplements & Nutrition",
    Fitness: "Fitness & Performance",
    "Natural Health": "Natural Health & Wellness",
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
    </main>
  );
}

function PackCard({ pack }: { pack: any }) {
  return (
    <Link
      to="/library/$slug"
      params={{ slug: pack.slug }}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:border-emerald-200"
    >
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
    </Link>
  );
}
