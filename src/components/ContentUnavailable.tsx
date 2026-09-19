import type { ReactNode } from "react";
import { jvzooProducts } from "../jvzoo";
import { JvzooBuyButton } from "./JvzooBuyButton";
import { JvzooDisclaimer } from "./JvzooDisclaimer";

// Shown in the page body when a database read fails even after retries.
//
// Why this exists: a thrown loader error makes TanStack render its bare default
// error widget, which leaves a sales page with no headline, no description and
// no buy button — exactly what JVZoo compliance reported as "page incomplete /
// missing text / missing buy button". This block keeps the page honest and
// useful instead: it says plainly that the content did not load, keeps the
// JVZoo buy button + tracking pixel + retailer disclaimer live, and gives the
// visitor a way to keep browsing.
//
// Copy rule: never dress this up as normal content. Say what happened.
export const UNAVAILABLE_MESSAGE =
  "Content temporarily unavailable — refresh in a moment";

/** "sleep-recovery" -> "Sleep Recovery" (fallback heading when the DB is down). */
export function slugToHeading(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface Props {
  /** Optional product/headline to show above the notice (e.g. the pack name). */
  heading?: string;
  /** Pack slug — when set, the pack's JVZoo buy button, pixel and disclaimer render too. */
  slug?: string;
  /** Extra copy shown under the notice. */
  children?: ReactNode;
}

export function ContentUnavailable({ heading, slug, children }: Props) {
  const buy = slug ? jvzooProducts[slug] : undefined;
  return (
    <>
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            HealthCopy Forge
          </span>
          {heading ? (
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {heading}
            </h1>
          ) : null}
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5">
            <p className="text-base font-semibold text-amber-900">
              {UNAVAILABLE_MESSAGE}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
              Our content service didn&apos;t answer just now, so the details that
              normally appear on this page haven&apos;t loaded. Nothing has been
              removed from the library — reload this page and everything will be
              back.
            </p>
          </div>

          {buy ? (
            <div className="mt-8 flex flex-col items-center gap-3">
              <JvzooBuyButton
                product={buy}
                imgClassName="h-16 w-auto rounded-xl shadow-md transition-transform hover:scale-105"
              />
              <p className="text-xs text-gray-500">
                Buy securely through JVZoo — instant download after checkout.
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="/packs" className="inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-emerald-700">
              Browse all packs
            </a>
            <a href="/" className="inline-flex rounded-xl border border-emerald-200 bg-white px-6 py-3 text-base font-semibold text-emerald-700 transition-all hover:bg-emerald-50">
              Back to home
            </a>
          </div>

          {children}
        </div>
      </section>
      {buy ? <JvzooDisclaimer /> : null}
    </>
  );
}
