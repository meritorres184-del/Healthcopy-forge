import { createFileRoute, Link } from "@tanstack/react-router";
import { sql } from "../db";

interface Pack {
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  comingSoon: boolean;
  includes: string[];
}

export const Route = createFileRoute("/library/$slug")({
  loader: async ({ params }) => {
    const rows = await sql()`
      select slug, title, description, price_cents, category, coming_soon, includes
      from content_packs
      where slug = ${params.slug}`;
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      slug: r.slug,
      title: r.title,
      description: r.description,
      price: (r.price_cents as number) / 100,
      category: r.category,
      comingSoon: r.coming_soon as boolean,
      includes: r.includes as string[],
    } as Pack;
  },
  component: PackDetailPage,
});

function PackDetailPage() {
  const pack = Route.useLoaderData<Pack | null>();

  if (!pack) {
    return (
      <main>
        <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Pack not found
            </h1>
            <p className="mt-4 text-gray-600">
              We couldn't find that content pack in the library.
            </p>
            <Link
              to="/library"
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-emerald-700"
            >
              Back to Library
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/library"
            className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            ← Back to Library
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {pack.category}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              ${pack.price} value
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {pack.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            {pack.description}
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">What's included</h2>
            <ul className="mt-5 space-y-3">
              {pack.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-gray-700"
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
          </div>

          {/* Content types */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Content formats
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Every pack includes each format below — professionally edited and
              ready to rebrand as your own.
            </p>
            <div className="mt-5 space-y-3">
              {contentTypes.map((ct) => (
                <div
                  key={ct.name}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      {ct.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {ct.name}
                      </p>
                      <p className="text-xs text-gray-500">{ct.note}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled
                    title="Downloads are being finalized"
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-400 cursor-not-allowed"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm text-gray-600">
              Downloads will be enabled once member access is finalized.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Enjoying this pack?
          </h2>
          <p className="mt-3 text-emerald-100">
            Get every pack — including new monthly drops — with a membership.
          </p>
          <Link
            to="/join"
            className="mt-6 inline-flex items-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50"
          >
            See Membership Plans
          </Link>
        </div>
      </section>
    </main>
  );
}

const contentTypes = [
  {
    name: "Articles",
    note: "SEO-optimized, ready to rebrand",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    name: "Email Sequence",
    note: "Nurture & launch sequences",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    name: "Social Posts",
    note: "Platform-ready templates",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    name: "Lead Magnet",
    note: "Opt-in asset to grow your list",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
