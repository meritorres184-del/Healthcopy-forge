import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readWithRetry } from "../db";
import { ContentUnavailable } from "../components/ContentUnavailable";
import { packCover } from "../lib/packCovers";

// Read all packs so we can resolve the requested slug server-side.
const getPacks = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await readWithRetry(
    "checkout.packs",
    (db) => db`
    select slug, title, description, price_cents, category, coming_soon, includes
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
    cover: packCover(r.slug),
  }));
});


export const Route = createFileRoute("/checkout/$slug")({
  loader: async ({ params }) => {
    try {
      const packs = await getPacks();
      const pack = packs.find(
        (p) => p.slug === params.slug && !p.comingSoon,
      );
      return { pack: pack ?? null, unavailable: false };
    } catch (err) {
      // Retried already (src/db.ts): show an honest notice, not a blank page.
      console.error(
        `[checkout/$slug] could not read packs for "${params.slug}"`,
        err,
      );
      return { pack: null, unavailable: true };
    }
  },
  component: CheckoutPage,
});

function CheckoutPage() {
  const { pack, unavailable } = Route.useLoaderData();

  if (unavailable) {
    return (
      <main>
        <ContentUnavailable
          heading="Checkout"
          slug={Route.useParams().slug}
        />
      </main>
    );
  }

  if (!pack) {
    return (
      <main className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Pack Not Found
          </h1>
          <p className="mt-4 text-gray-600">
            We couldn't find that content pack — or it isn't available for
            purchase yet.
          </p>
          <a href="/packs" className="mt-8 inline-flex items-center rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700">
            Browse Packs
          </a>
        </div>
      </main>
    );
  }
  return (
    <main className="bg-gradient-to-b from-emerald-50 to-white px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <a href="/packs" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
          ← Back to packs
        </a>
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
          {pack.cover ? (
            <div className="mb-6 flex justify-center">
              <img
                src={pack.cover}
                alt={`${pack.title} bookcover`}
                className="h-64 w-auto rounded-lg object-contain shadow-sm"
              />
            </div>
          ) : null}
          <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {pack.category}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {pack.title}
          </h1>
          <p className="mt-4 leading-relaxed text-gray-600">
            {pack.description}
          </p>
          <div className="mt-6 space-y-1.5">
            {pack.includes.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <svg
                  className="h-4 w-4 flex-shrink-0 text-emerald-500"
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
          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-extrabold text-gray-900">
                  ${pack.price}
                </span>
                <span className="ml-1 text-sm text-gray-400">one-time</span>
              </div>
              <span className="text-sm text-gray-500">
                Instant download after purchase
              </span>
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-emerald-700"
            >
              Proceed to Payment
            </button>
            <p className="mt-4 text-center text-sm text-gray-500">
              Secure checkout is being finalized — payments will process here
              shortly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
