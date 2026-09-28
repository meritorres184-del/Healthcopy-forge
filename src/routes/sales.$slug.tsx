import { createFileRoute } from "@tanstack/react-router";
import { readWithRetry } from "../db";
import { bundleBuy, liveJvzooProduct } from "../jvzoo";
import { packCover } from "../lib/packCovers";
import { ebookBySlug } from "../lib/ebooks";
import { ebookCover } from "../lib/ebookCovers";
import { cleanSaleBySlug, type CleanSaleKind } from "../lib/cleanSales";
import { ProductDescription } from "../components/ProductDescription";
import { JvzooDisclaimer } from "../components/JvzooDisclaimer";
import { JvzooBuyButton } from "../components/JvzooBuyButton";
import {
  UNAVAILABLE_MESSAGE,
  slugToHeading,
} from "../components/ContentUnavailable";

// JVZoo COMPLIANCE "CLEAN" SALES PAGE — /sales/<slug>
//
// One page per flagged JVZoo listing (the twenty-five in src/lib/cleanSales.ts):
// thirteen article packs, the fixed Packs 1-4 bundle and nine ebooks. JVZoo's
// reviewer requirement is verbatim
//
//   "Please remove ALL links that direct away from the sales page. You can keep
//    the terms, privacy, disclaimers, support, etc. All other links must be
//    removed."
//
// The normal sales pages (/library/<slug>, /ebooks/<slug>) are full site pages:
// header nav, a logo link to "/", a "Back to Library" link, a footer of site
// links and a mailto. Those are the links that were flagged. This page renders
// the SAME product copy, cover and canonical JVZoo buy block, but its only
// outbound hrefs are:
//
//   * the JVZoo buy link and its button image (the product's own listing),
//   * /terms, /privacy, /disclaimer, /support (the pages JVZoo explicitly allows),
//   * the local cover image and the site's own JS/CSS/font assets.
//
// Rule for anyone editing this file: do NOT add a link. No back link, no logo
// link, no breadcrumb, no "browse other packs", no mailto — not even inside a
// degraded/fallback branch. The build gate (scripts/verify-prerender.mjs) reads
// every href out of the baked HTML and FAILS the build on any href that is not
// on that allowlist, so a stray link here cannot reach a reviewer.
//
// The root layout also renders no header and no footer for /sales/* (see
// src/routes/__root.tsx), and the minimal footer at the bottom of this file
// carries the four allowed links.
//
// The copy is NOT written here: packs read the owner's description from the
// database exactly like /library/<slug> does (same readWithRetry + degraded
// fallback), ebooks read src/lib/ebooks.ts like /ebooks/<slug> does. Nothing is
// reworded or shortened.
//
// The fixed Packs 1-4 bundle is the one product with no owner-written long
// description and no database row: its page reuses the bundle block on /packs
// (src/routes/packs.tsx) VERBATIM — heading, price, supporting sentence — see the
// BUNDLE_* constants below. Nothing beyond that block is claimed.

// $27 one-time — LOCKED by the owner (2026-09-13) for the standalone ebook line.
const EBOOK_PRICE = 27;

// The fixed Packs 1-4 bundle (JVZoo 453431). It is NOT the site's flexible "any
// four packs" mechanic: the listing sells one fixed product, Packs 1-4, so this
// page must sell that same fixed product — a "choose any four" promise on a page
// reached from a fixed listing would be misleading, and a name that does not
// match the listing invites another "product name must be unique" flag.
//
// It is not a pack and has no content_packs row, so there is no owner
// ProductDescription to read. Everything below is OWNED data: the name comes
// straight from src/jvzoo.ts (`bundleBuy`, the same object the buy button uses,
// so page and listing can never drift), and the description is built only from
// the pack names in src/jvzoo.ts, the article count in the listing name
// (15 per pack x 4), and the house positioning line already used on the other
// clean pages. No stats, testimonials or superlatives are invented.
const BUNDLE_TITLE = bundleBuy.alt;
const BUNDLE_PRICE = 97;
const BUNDLE_CATEGORY = "Article Pack Bundle (PLR)";
const BUNDLE_DESCRIPTION =
  "The complete Packs 1-4 set — Article Pack 1 Nutrition & Everyday Wellness, Article Pack 2 Supplements & Nutritional Support, Article Pack 3 Fitness & Exercise and Article Pack 4 Sleep & Recovery — 60 SEO-written articles. SEO-written health & wellness PLR content from HealthCopy Forge — ready to customize, brand & promote.";
const BUNDLE_COVER_SLUG = "nutrition-everyday-wellness";

interface CleanSale {
  slug: string;
  kind: CleanSaleKind;
  title: string;
  category: string;
  price: number;
  description: string;
  includes: string[];
  stats: { label: string; value: string }[];
  /** Set only by the degraded fallback below — a database read that failed. */
  unavailable?: boolean;
}

// Fallback for the one case where the pack row could not be read. It keeps the
// page truthful (no invented copy), keeps the product name, price, buy block,
// tracking pixel and retailer disclaimer on the page, and — unlike the library
// page's notice — it adds NO link at all, because a reviewer must not find one.
// UNAVAILABLE_MESSAGE is the site-wide degraded marker: the prerender guard in
// vite.config.ts refuses to bake it, so this branch can never be published.
function degradedSale(slug: string, kind: CleanSaleKind): CleanSale {
  return {
    slug,
    kind,
    title: kind === "bundle" ? BUNDLE_TITLE : slugToHeading(slug),
    category:
      kind === "ebook"
        ? "PLR Ebook"
        : kind === "bundle"
          ? BUNDLE_CATEGORY
          : "Article Pack (PLR)",
    price:
      kind === "ebook" ? EBOOK_PRICE : kind === "bundle" ? BUNDLE_PRICE : 47,
    description:
      "SEO-written health & wellness PLR content from HealthCopy Forge — ready to customize, brand & promote.",
    includes: [],
    stats: [],
    unavailable: true,
  };
}

// Title + description for this page, used twice on purpose: by the route `head`
// (the real <title> and <meta name="description">) and by the loader result,
// because SeoHead in __root.tsx reads `title`/`description` off the leaf route's
// loader data for the og:/twitter: tags.
function saleMeta(sale: CleanSale | null): { title: string; description: string } {
  if (!sale) {
    return {
      title: "Health & Wellness PLR Content | HealthCopy Forge",
      description:
        "Ready-to-rebrand health & wellness PLR content from HealthCopy Forge — instant download after checkout through JVZoo.",
    };
  }
  const shape =
    sale.kind === "ebook"
      ? "a ready-to-rebrand PLR ebook"
      : sale.kind === "bundle"
        ? "a ready-to-rebrand PLR article-pack bundle"
        : "a ready-to-rebrand PLR article pack";
  return {
    title: sale.title + " | HealthCopy Forge",
    description:
      sale.title +
      " — " +
      shape +
      " you can edit, brand and publish as your own. Instant download, $" +
      String(sale.price) +
      " one-time, through JVZoo.",
  };
}

export const Route = createFileRoute("/sales/$slug")({
  head: ({ loaderData }) => {
    const data = loaderData as { title: string; description: string } | undefined;
    const meta = saleMeta(null);
    return {
      meta: [
        { title: data?.title ?? meta.title },
        { name: "description", content: data?.description ?? meta.description },
      ],
    };
  },
  loader: async ({ params }) => {
    const entry = cleanSaleBySlug(params.slug);
    if (!entry) {
      // Not one of the twenty-five clean-page products: a link-free "not available"
      // page. (Only those slugs are pre-rendered; anything else is an SSR request.)
      const meta = saleMeta(null);
      return { sale: null, title: meta.title, description: meta.description };
    }

    if (entry.kind === "bundle") {
      // The fixed Packs 1-4 bundle: no database read (there is no row) and no
      // owner ProductDescription, so name and copy come from the BUNDLE_*
      // constants above — the listing name taken from `bundleBuy` plus the four
      // pack names. Its buy block is the same named `bundleBuy` export (JVZoo
      // 453431) rather than a slug-keyed entry in src/jvzoo.ts.
      const sale: CleanSale = {
        slug: entry.slug,
        kind: "bundle",
        title: BUNDLE_TITLE,
        category: BUNDLE_CATEGORY,
        price: BUNDLE_PRICE,
        description: BUNDLE_DESCRIPTION,
        includes: [],
        stats: [],
      };
      const meta = saleMeta(sale);
      return { sale, title: meta.title, description: meta.description };
    }

    if (entry.kind === "ebook") {
      // Static catalogue (src/lib/ebooks.ts) — no database read, so an ebook page
      // can never bake into a degraded state.
      const ebook = ebookBySlug(params.slug);
      if (!ebook) {
        const meta = saleMeta(null);
        return { sale: null, title: meta.title, description: meta.description };
      }
      const sale: CleanSale = {
        slug: ebook.slug,
        kind: "ebook",
        title: ebook.title,
        category: "PLR Ebook",
        price: EBOOK_PRICE,
        description: ebook.description,
        includes: ebook.includes,
        stats: [
          { label: "Chapters", value: String(ebook.chapters) },
          { label: "Word count", value: ebook.wordCount },
          { label: "Delivery", value: "Instant ZIP download" },
          { label: "License", value: "PLR / Master Rights" },
        ],
      };
      const meta = saleMeta(sale);
      return { sale, title: meta.title, description: meta.description };
    }

    // Article pack: the same row and the same read path as /library/<slug>.
    try {
      const rows = await readWithRetry(
        "clean-sales.pack-detail",
        (db) => db`
      select slug, title, description, price_cents, category, coming_soon, includes
      from content_packs
      where slug = ${params.slug}`,
      );
      if (rows.length === 0) {
        const meta = saleMeta(null);
        return { sale: null, title: meta.title, description: meta.description };
      }
      const r = rows[0];
      const sale: CleanSale = {
        slug: String(r.slug),
        kind: "pack",
        title: String(r.title),
        category: String(r.category ?? "Article Pack (PLR)"),
        price: (r.price_cents as number) / 100,
        description: String(r.description),
        includes: (r.includes as string[] | null) ?? [],
        stats: [],
      };
      const meta = saleMeta(sale);
      return { sale, title: meta.title, description: meta.description };
    } catch (err) {
      // Any read failure (already retried inside readWithRetry) degrades to the
      // link-free notice instead of a thrown loader error: a thrown error renders
      // TanStack's bare error widget, which would leave the page with no content
      // and no buy button — the exact JVZoo compliance failure this page fixes.
      console.error(
        `[sales/$slug] could not read pack "${params.slug}"; rendering the link-free fallback`,
        err,
      );
      const sale = degradedSale(params.slug, "pack");
      const meta = saleMeta(sale);
      return { sale, title: meta.title, description: meta.description };
    }
  },
  component: CleanSalePage,
});

function CleanSalePage() {
  const { sale } = Route.useLoaderData();

  if (!sale) {
    return (
      <main className="bg-white px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            This page isn&apos;t available
          </h1>
          <p className="mt-4 text-gray-600">
            The product page you followed isn&apos;t here. Please reopen the link
            from the JVZoo product listing.
          </p>
        </div>
      </main>
    );
  }

  const cover =
    sale.kind === "ebook"
      ? ebookCover(sale.slug)
      : sale.kind === "bundle"
        ? packCover(BUNDLE_COVER_SLUG)
        : packCover(sale.slug);
  // The canonical buy block for THIS product's own JVZoo listing. Every render
  // site goes through this helper so a page can never emit a non-canonical link
  // (www host / /1 image) or a half-built button. The bundle is the one product
  // whose buy block is a named export (bundleBuy, JVZoo 453431) instead of a
  // slug-keyed entry in src/jvzoo.ts.
  const buy = sale.kind === "bundle" ? bundleBuy : liveJvzooProduct(sale.slug);

  return (
    <main className="bg-white">
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            HealthCopy Forge
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {sale.category}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              ${sale.price} value
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {sale.title}
          </h1>

          {sale.unavailable ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-left">
              <p className="text-base font-semibold text-amber-900">
                {UNAVAILABLE_MESSAGE}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
                The product details normally shown here haven&apos;t loaded.
                Reload this page and everything will be back.
              </p>
            </div>
          ) : (
            <>
              <ProductDescription text={sale.description} />
              {cover ? (
                <img
                  src={cover}
                  alt={sale.title + " bookcover"}
                  className="mx-auto mt-10 h-80 w-auto rounded-2xl shadow-xl"
                />
              ) : null}
            </>
          )}
        </div>
      </section>

      {sale.includes.length > 0 ? (
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900">What&apos;s included</h2>
              <ul className="mt-5 space-y-3">
                {sale.includes.map((item) => (
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
              {sale.stats.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {sale.stats.map((stat) => (
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
              ) : null}
              <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-gray-600">
                Delivered as a single ZIP — fully editable, ready to brand and
                publish as your own, with the PLR license, the medical disclaimer
                and the cover image inside.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* The product's own canonical JVZoo buy block (link + button image + 1x1
          tracking pixel). This is the only outbound link on the page apart from
          the four allowed legal/support links in the footer. */}
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
              ${sale.price}
              <span className="ml-2 align-middle text-base font-medium text-gray-500">
                one-time payment
              </span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Delivered as one ZIP, instantly after checkout through JVZoo.
            </p>
          </div>
        </section>
      )}

      {/* JVZoo retailer disclosure + EU non-refundable waiver — required verbatim
          on every product sales page, rendered here exactly as on the main
          sales pages (same component, same wording). */}
      <JvzooDisclaimer />

      {/* Minimal footer: the four links JVZoo's reviewer explicitly allows, and
          nothing else. No home link, no nav, no mailto. */}
      <footer className="border-t border-gray-100 bg-gray-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-600">
            <a href="/terms" className="hover:text-emerald-600 transition-colors">
              Terms
            </a>
            <a href="/privacy" className="hover:text-emerald-600 transition-colors">
              Privacy
            </a>
            <a href="/disclaimer" className="hover:text-emerald-600 transition-colors">
              Disclaimer
            </a>
            <a href="/support" className="hover:text-emerald-600 transition-colors">
              Support
            </a>
          </nav>
          <p className="mt-4 text-xs leading-relaxed text-gray-400">
            &copy; HealthCopy Forge. All rights reserved. JVZoo is the retailer
            for this product.
          </p>
        </div>
      </footer>
    </main>
  );
}
