import { createFileRoute } from "@tanstack/react-router";
import { EBOOKS } from "../lib/ebooks";
import { ebookCover } from "../lib/ebookCovers";

// Hub for the 11 standalone PLR ebooks. Kept deliberately plain: cover, title,
// what the buyer gets and the price, all from the same src/lib/ebooks.ts copy
// the sales pages use, so this page can never contradict a listing.
//
// $27 one-time — LOCKED by the owner (2026-09-13) for the standalone ebook line.
const EBOOK_PRICE = 27;

export const Route = createFileRoute("/ebooks/")({
  head: () => ({
    meta: [
      { title: "Ready-to-Rebrand PLR Ebooks: Health & Wellness | HealthCopy Forge" },
      {
        name: "description",
        content:
          "11 ready-to-rebrand health & wellness PLR ebooks. Each is a fully editable Word file with a PLR license file, a medical disclaimer file and a cover image — $27 each, instant download.",
      },
    ],
  }),
  component: EbooksIndexPage,
});

function EbooksIndexPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            PLR Ebooks
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Ready-to-Rebrand Health &amp; Wellness PLR Ebooks
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Fully editable Word ebooks you can put your own name on and publish as
            your own. Each one comes with a PLR license file, a medical disclaimer
            file and the cover image — ${EBOOK_PRICE} each, instant download.
          </p>
        </div>
      </section>

      {/* Ebook grid */}
      <section className="px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {EBOOKS.map((ebook) => {
            const cover = ebookCover(ebook.slug);
            return (
              <div
                key={ebook.slug}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                {cover ? (
                  <img
                    src={cover}
                    alt={`${ebook.title} bookcover`}
                    className="mx-auto h-56 w-auto rounded-xl shadow-md"
                  />
                ) : null}
                <h2 className="mt-5 text-lg font-bold tracking-tight text-gray-900">
                  {ebook.title}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {ebook.chapters} chapters · {ebook.wordCount}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-lg font-extrabold text-gray-900">
                    ${EBOOK_PRICE}
                  </span>
                  <a
                    href={`/ebooks/${ebook.slug}`}
                    className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    View details →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
