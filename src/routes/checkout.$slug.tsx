import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sql } from "../db";

// Read all packs so we can resolve the requested slug server-side.
const getPacks = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await sql()`
    select slug, title, description, price_cents, category, coming_soon, includes
    from content_packs
    order by id`;
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    description: r.description,
    price: (r.price_cents as number) / 100,
    category: r.category,
    comingSoon: r.coming_soon as boolean,
    includes: r.includes as string[],
  }));
});

export const Route = createFileRoute("/checkout/$slug")({
  loader: async ({ params }) => {
    const packs = await getPacks();
    const pack = packs.find(
      (p) => p.slug === params.slug && !p.comingSoon,
    );
    return { pack: pack ?? null };
  },
  component: CheckoutPage,
});

function CheckoutPage() {
  const { pack } = Route.useLoaderData();

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
          <Link
            to="/packs"
            className="mt-8 inline-flex items-center rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700"
          >
            Browse Packs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-emerald-50 to-white px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/packs"
          className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          ← Back to packs
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
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
