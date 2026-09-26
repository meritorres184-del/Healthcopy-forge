import { createFileRoute } from "@tanstack/react-router";
import { jvzooProducts, liveJvzooProduct } from "../jvzoo";
import { ebookBySlug, type Ebook } from "../lib/ebooks";
import { ebookCover } from "../lib/ebookCovers";
import { JvzooDisclaimer } from "../components/JvzooDisclaimer";
import { JvzooBuyButton } from "../components/JvzooBuyButton";
import { ProductDescription } from "../components/ProductDescription";

// Standalone ebook sales page — /ebooks/<slug>, the URL the owner hands to JVZoo
// for that ebook's marketplace listing.
//
// Structure mirrors the article-pack sales page (/library/<slug>): cover, title,
// the full description, what's included, price, and then EITHER the canonical
// JVZoo buy block OR the "available for instant download" state when the
// listing's product ID has not been pasted in yet (see liveJvzooProduct — an
// empty ID can never emit a dead link, and never a half-built buy block).
//
// The page copy is NOT written here: it comes from src/lib/ebooks.ts, which is
// generated from the JVZoo posting kit (marketer-drafted, drawn from the on-disk
// ebooks). Rendered verbatim — no rewording, no added claims.
//
// $27 one-time — LOCKED by the owner (2026-09-13) for the standalone ebook line.
const EBOOK_PRICE = 27;

// Title + description for this page. Used twice on purpose:
//  - the route `head` below, which writes the real <title>/<meta name="description">
//  - the loader result, because SeoHead in __root.tsx reads `title`/`description`
//    off the leaf route's loader data for the og:/twitter: tags — that is how the
//    pack sales pages get their og tags, and the ebook pages follow the same shape.
function ebookMeta(ebook: Ebook | null): { title: string; description: string } {
  if (!ebook) {
    return {
      title: "PLR Ebooks — Ready to Rebrand",
      description:
        "Ready-to-rebrand health & wellness PLR ebooks from HealthCopy Forge — editable Word files with a PLR license, a medical disclaimer and the cover image.",
    };
  }
  const price = "$" + String(EBOOK_PRICE);
  return {
    title: `${ebook.title} — PLR Ebook, Ready to Rebrand`,
    description: `${ebook.title}: a ready-to-rebrand PLR ebook — ${ebook.wordCount} in ${String(
      ebook.chapters,
    )} chapters, fully editable, with the PLR license, the medical disclaimer and the cover image. Instant download, ${price}.`,
  };
}

export const Route = createFileRoute("/ebooks/$slug")({
  head: ({ loaderData }) => {
    const data = loaderData as { title: string; description: string } | undefined;
    const meta = ebookMeta(null);
    return {
      meta: [
        {
          title: data?.title
            ? data.title + " | HealthCopy Forge"
            : meta.title + " | HealthCopy Forge",
        },
        { name: "description", content: data?.description ?? meta.description },
      ],
    };
  },
  // Static data (src/lib/ebooks.ts) — no database read on purpose, so this page
  // can never bake into the degraded "content unavailable" state.
  loader: ({ params }) => {
    const ebook = ebookBySlug(params.slug) ?? null;
    const meta = ebookMeta(ebook);
    return { ebook, title: meta.title, description: meta.description };
  },
  component: EbookDetailPage,
});

function EbookDetailPage() {
  const { ebook } = Route.useLoaderData();

  if (!ebook) {
    return (
      <main>
        <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Ebook not found
            </h1>
            <p className="mt-4 text-gray-600">
              We couldn't find that ebook in the catalogue.
            </p>
            <a
              href="/ebooks"
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-emerald-700"
            >
              Back to Ebooks
            </a>
          </div>
        </section>
      </main>
    );
  }

  const cover = ebookCover(ebook.slug);
  // The buy block for this ebook, or undefined while its JVZoo listing has no
  // product ID yet (src/jvzoo.ts). Every render site goes through this helper.
  const buy = liveJvzooProduct(ebook.slug);

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <a
            href="/ebooks"
            className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            ← Back to Ebooks
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              PLR Ebook
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              ${EBOOK_PRICE} value
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {ebook.wordCount}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {ebook.title}
          </h1>
          <ProductDescription text={ebook.description} />
          {cover ? (
            <img
              src={cover}
              alt={`${ebook.title} bookcover`}
              className="mx-auto mt-10 h-80 w-auto rounded-2xl shadow-xl"
            />
          ) : null}
        </div>
      </section>

      {/* What's included */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">What's included</h2>
            <ul className="mt-5 space-y-3">
              {ebook.includes.map((item) => (
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

          <div>
            <h2 className="text-xl font-bold text-gray-900">At a glance</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Chapters", value: String(ebook.chapters) },
                { label: "Word count", value: ebook.wordCount },
                { label: "Delivery", value: "Instant ZIP download" },
                { label: "License", value: "PLR / Master Rights" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-gray-600">
              One editable Word file plus the license file, the medical
              disclaimer file and the cover image — all inside a single ZIP, ready
              to brand and publish as your own.
            </p>
          </div>
        </div>
      </section>

      {/* JVZoo purchase — rendered only when this ebook's JVZoo listing has a
          product ID (see liveJvzooProduct). Paste the ID in src/jvzoo.ts to
          switch the ebook over; until then the page shows its price and the
          instant-download state: never a dead href, never a button that goes
          nowhere. */}
      {buy ? (
        <section className="bg-white px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Get Instant Access
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Buy securely through JVZoo — instant download after checkout.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <JvzooBuyButton
                product={buy}
                imgClassName="h-16 w-auto rounded-xl shadow-md transition-transform hover:scale-105"
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Get Instant Access
            </h2>
            <p className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900">
              ${EBOOK_PRICE}
              <span className="ml-2 align-middle text-base font-medium text-gray-500">
                one-time payment
              </span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Instant download of one ZIP containing all files — the editable
              ebook, the PLR license file, the medical disclaimer file and the
              cover image.
            </p>
            <p className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800">
              Available for instant download
            </p>
            <a
              href="/support"
              className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
            >
              Questions about this ebook? Contact support →
            </a>
          </div>
        </section>
      )}
      {/* JVZoo retailer disclosure — required on every product sales page */}
      {jvzooProducts[ebook.slug] ? <JvzooDisclaimer /> : null}
    </main>
  );
}
