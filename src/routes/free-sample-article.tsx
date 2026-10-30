import { createFileRoute } from "@tanstack/react-router";
import {
  FREE_SAMPLE_ARTICLE_BLOCKS,
  FREE_SAMPLE_ARTICLE_TITLE,
  FREE_SAMPLE_DISCLAIMER,
  type ArticleBlock,
} from "../content/freeSampleArticle";
// ─── /free-sample-article — the free sample, delivered on the page ────────────
//
// Owner decision (2026-10-30): the free-sample giveaway must NOT depend on email.
// The MailerLite account has no verified sender and no automation, so the old
// success copy ("Check your inbox — your sample article is on its way") promised
// an email nobody would ever receive. Instead the visitor is handed the article
// itself, immediately, on this page — it works with MailerLite up, down or absent.
//
// The article is the owner's own already-written, already-sold content: article 1
// of Pack 1, "What Healthy Nutrition Actually Means", reproduced VERBATIM from
// src/content/free-sample-article.txt (see scripts/build-free-sample-article.mjs
// for the exact provenance and the block classification). Do not reword, trim,
// merge or "improve" a single sentence here — tests/free-sample-article-content.test.ts
// rebuilds this page's text from the source file and fails on any difference.
//
// UNLISTED, like /affiliate-kit (the precedent this page follows):
//   * reached from the free-sample form's success state (FreeSampleForm), by direct
//     link only;
//   * NOT in the header/footer nav (src/routes/__root.tsx) and not in the sitemap
//     (public/sitemap.xml), so it is not discoverable by browsing;
//   * `noindex, nofollow` robots meta so it never lands in search results.
//   It DOES use the normal root layout — it is not one of the /sales/* JVZoo clean
//   pages and must never opt out of the header/footer.
//
// BRAND ONLY: no author name anywhere (standing owner rule for PLR content).

export const FREE_SAMPLE_ARTICLE_PATH = "/free-sample-article";

/** The label above the headline. */
export const FREE_SAMPLE_LABEL = "Free Sample Article";
/** Publisher line — brand only, never an author name. */
export const FREE_SAMPLE_PUBLISHER = "Published by HealthCopy Forge";
/** Where the sample comes from, stated plainly. */
export const FREE_SAMPLE_SOURCE =
  "A free sample from the Nutrition & Everyday Wellness article pack.";

export const Route = createFileRoute("/free-sample-article")({
  head: () => ({
    meta: [
      { title: "Free Sample Article: What Healthy Nutrition Actually Means | HealthCopy Forge" },
      {
        name: "description",
        content:
          "Read a full HealthCopy Forge article, free: “What Healthy Nutrition Actually Means” from the Nutrition & Everyday Wellness article pack.",
      },
      // Unlisted page: reached from the free-sample form, never indexed.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FreeSampleArticlePage,
});

function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "h1":
      return (
        <h2 className="mt-10 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          {block.text}
        </h2>
      );
    case "h2":
      return (
        <h2 className="mt-10 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-6 text-lg font-bold text-gray-900">{block.text}</h3>
      );
    case "p":
      return (
        <p className="mt-4 text-base leading-relaxed text-gray-700">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul className="mt-4 list-disc space-y-1.5 pl-6 text-base leading-relaxed text-gray-700">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-4 list-decimal space-y-1.5 pl-6 text-base leading-relaxed text-gray-700">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case "hr":
      return <hr className="mt-10 border-emerald-100" />;
  }
}

/**
 * The page body. Exported so the content test can render it to static markup and
 * compare the text against the source article (see
 * tests/free-sample-article-content.test.ts) — the guarantee that nobody can
 * silently paraphrase the owner's article.
 */
export function FreeSampleArticlePage() {
  const [disclaimerHeading, disclaimerTitle, ...disclaimerBody] =
    FREE_SAMPLE_DISCLAIMER;

  return (
    <main>
      <article className="px-4 pt-12 pb-4 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            {FREE_SAMPLE_LABEL}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {FREE_SAMPLE_ARTICLE_TITLE}
          </h1>
          <p className="mt-3 text-sm font-semibold text-emerald-700">
            {FREE_SAMPLE_PUBLISHER}
          </p>
          <p className="mt-1 text-sm text-gray-500">{FREE_SAMPLE_SOURCE}</p>
          <hr className="mt-6 border-gray-200" />
          {FREE_SAMPLE_ARTICLE_BLOCKS.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </article>

      {/* Soft close: what this article is a sample of. */}
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            If you want this ready to brand and publish
          </h2>
          <p className="mt-2 text-base leading-relaxed text-gray-700">
            This is one article from a done-for-you pack of SEO-written health and
            wellness content — yours to customize, put your name on and publish. See
            the packs, or let the membership send you fresh articles every month.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/packs"
              className="inline-block w-full rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:w-auto"
            >
              See the article packs
            </a>
            <a
              href="/join"
              className="inline-block w-full rounded-lg border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 sm:w-auto"
            >
              See the membership
            </a>
          </div>
        </div>
      </section>

      {/* The owner's approved medical disclaimer, verbatim, at the end. */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-gray-50 px-6 py-6">
          <h2 className="text-xs font-bold tracking-wide text-gray-500 uppercase">
            {disclaimerHeading}
          </h2>
          <p className="mt-2 text-sm font-semibold text-gray-700">
            {disclaimerTitle}
          </p>
          {disclaimerBody.map((paragraph, i) =>
            // The disclaimer's own short section labels ("Affiliate Disclosure",
            // "PLR Customization Notice") carry no closing punctuation; they are
            // shown as sub-labels, the wording untouched.
            /[.!?]$/.test(paragraph) ? (
              <p key={i} className="mt-3 text-xs leading-relaxed text-gray-600">
                {paragraph}
              </p>
            ) : (
              <p key={i} className="mt-4 text-xs font-semibold text-gray-700">
                {paragraph}
              </p>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
