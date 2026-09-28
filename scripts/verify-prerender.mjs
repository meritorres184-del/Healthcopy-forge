#!/usr/bin/env bun
// POST-BUILD GATE — prove the pre-rendered sales pages really are on disk, complete.
//
// WHY: every route that can be rendered without per-request state is baked to HTML
// by the prerender step in vite.config.ts, and serve.ts answers those URLs with a
// *file read* (never a per-request SSR stream, which the live edge has been seen to
// cut and "repair" into a content-less document). That guarantee is only as good as
// the files: if a route is missing from the prerender list, the build silently
// leaves it to SSR — and if the database hiccups at build time, the bake can emit
// the "content unavailable" fallback instead of the real page.
//
// The prerender onSuccess guard in vite.config.ts covers the second case for pages
// it did render; this gate covers both, for the exact set of URLs that must be
// served from disk. It runs as part of `bun run build`, so a bad build FAILS THERE
// instead of reaching the live site (and a JVZoo reviewer).
//
// Runs offline: it only reads dist/client. Keep REQUIRED in sync with
// PRERENDER_PAGES in vite.config.ts.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CLIENT = join(ROOT, "dist/client");

// Emitted by components/ContentUnavailable.tsx when a DB read failed.
const DEGRADED_MARKER = "Content temporarily unavailable";
// What a healthy baked page must contain: the closing tag of a finished document.
const CLOSED = "</html>";

const PACK_SLUGS = [
  "nutrition-everyday-wellness",
  "supplements-nutritional-support",
  "fitness-exercise",
  "sleep-recovery",
  "stress-management-mind-body-wellness",
  "healthy-aging-lifestyle",
  "natural-holistic-wellness",
  "product-reviews-buying-guides",
  "protein-shakes-protein-nutrition",
  "intermittent-fasting-time-restricted-eating",
  "health-coaching-functional-nutrition-glp-1-support",
  "functional-nutrition-glp-1-adaptation",
  "womens-longevity-biology-specific-care",
];

// The 11 standalone PLR ebooks (src/lib/ebooks.ts -> EBOOK_SLUGS in vite.config.ts).
// Same treatment as the packs: one baked page per concrete /ebooks/<slug> URL, so the
// links the owner hands to JVZoo are served complete from disk.
const EBOOK_SLUGS = [
  "balanced-nutrition",
  "brain-habits",
  "gut-health",
  "healthy-bones",
  "healthy-feet",
  "hair-scalp",
  "heart-habits",
  "hydration",
  "joint-fitness",
  "posture",
  "protein-aging",
];

// JVZoo COMPLIANCE "CLEAN" SALES PAGES — /sales/<slug>, one per FLAGGED listing
// (the thirteen article packs + the fixed Packs 1-4 bundle + nine ebooks a JVZoo
// reviewer rejected with "remove ALL links that direct away from the sales
// page"). Canonical list:
// src/lib/cleanSales.ts; kept in sync with CLEAN_SALES_SLUGS in vite.config.ts,
// which is what actually bakes them. protein-aging (ebook 454751) is NOT here:
// the owner is deactivating that listing as a duplicate.
//
// These pages map to products whose JVZoo IDs are ALREADY counted below (packs
// 9-13 are in PACK_SLUGS; ebooks are read from src/jvzoo.ts), so this list must
// NOT feed the "14 product IDs" count — it is only an extra page family.
//
// Second flag round (2026-09-28): the four remaining ebook listings whose JVZoo
// sales URL still pointed at the full-chrome /ebooks/<slug> page. Same page
// family, same checks; kept as their own const so the rounds stay readable —
// they are NOT new product IDs, so `allIds` below must stay at 14.
const CLEAN_SALES_EBOOK_SLUGS_2ND_ROUND = [
  "balanced-nutrition",
  "brain-habits",
  "heart-habits",
  "posture",
];
// Third flag round (2026-09-28): the eight original article packs (Packs 1-8) and
// the fixed Packs 1-4 bundle listing (JVZoo 453431). Same page family, same
// checks; kept as their own consts so the rounds stay readable. The pack IDs and
// the bundle ID are ALREADY counted in `allIds` below (13 packs + 1 bundle = 14),
// so these are extra *pages* for IDs already counted, never new IDs.
const CLEAN_SALES_PACKS_3RD_ROUND = [
  "nutrition-everyday-wellness",
  "supplements-nutritional-support",
  "fitness-exercise",
  "sleep-recovery",
  "stress-management-mind-body-wellness",
  "healthy-aging-lifestyle",
  "natural-holistic-wellness",
  "product-reviews-buying-guides",
];
// The fixed Packs 1-4 bundle is not a pack and is NOT in the slug -> ID map read
// out of src/jvzoo.ts: it is the single `bundleBuy` export (JVZoo 453431). That is
// why it resolves through idForSlug() below instead of idBySlug.
const CLEAN_SALES_BUNDLE_SLUG = "packs-1-4-bundle";
// The third-round clean pages: the eight original packs + the fixed bundle, in the
// same order as src/lib/cleanSales.ts.
const CLEAN_SALES_ROUND_3_SLUGS = [
  ...CLEAN_SALES_PACKS_3RD_ROUND,
  CLEAN_SALES_BUNDLE_SLUG,
];
// Rounds 1-2: the five Packs 9-13 and the nine ebooks flagged before them.
const CLEAN_SALES_SLUGS_ROUNDS_1_2 = [
  "protein-shakes-protein-nutrition",
  "intermittent-fasting-time-restricted-eating",
  "health-coaching-functional-nutrition-glp-1-support",
  "functional-nutrition-glp-1-adaptation",
  "womens-longevity-biology-specific-care",
  "healthy-bones",
  "gut-health",
  "hair-scalp",
  "joint-fitness",
  "hydration",
  ...CLEAN_SALES_EBOOK_SLUGS_2ND_ROUND,
];
// The canonical clean-page set the gate checks: every flag round.
const CLEAN_SALES_SLUGS = [
  ...CLEAN_SALES_ROUND_3_SLUGS,
  ...CLEAN_SALES_SLUGS_ROUNDS_1_2,
];

// Sales URLs that must be FULL pages. 15 KB is the floor the team holds the live
// pages to; the real pages run 16.6-57 KB.
//
// The third-round clean pages are held to their own, lower floor: a clean page
// renders no site chrome at all, Packs 1-8 carry shorter owner descriptions than
// Packs 9-13, and the bundle has no owner description of its own — so those pages
// are legitimately 8.7-12.7 KB. 8 KB still catches the truncated bake this floor
// exists for (the live edge cuts streamed responses at ~5-7 KB — see the note at
// the top of vite.config.ts), and the closed-document check, the required text
// and the href allowlist below carry the rest.
const SALES_MIN_BYTES_3RD_ROUND = 8000;
const SALES = [
  "/packs",
  "/library",
  "/ebooks",
  ...PACK_SLUGS.map((s) => "/library/" + s),
  ...EBOOK_SLUGS.map((s) => "/ebooks/" + s),
  ...CLEAN_SALES_SLUGS_ROUNDS_1_2.map((s) => "/sales/" + s),
];
const SALES_MIN_BYTES = 15000;

// Which packs have a JVZoo listing, read from src/jvzoo.ts (the same source the
// buy blocks are rendered from, so this can never drift). Needed here because
// the buy-path requirement below is per page.
//
// A pack whose listing does not exist yet (packs 9-13 until the owner sends the
// product IDs) must NOT be forced to carry a buy link: its page renders the
// price and the "available for instant download" state instead. The moment an
// ID is pasted into src/jvzoo.ts, that pack is back under the full check — see
// wantsBuy() and the negative check in the loop.
const jvzooSource = readFileSync(join(ROOT, "src", "jvzoo.ts"), "utf8");
const idBySlug = new Map(
  [...jvzooSource.matchAll(/^\s*"([a-z0-9-]+)":\s*jvzooProduct\(\s*"(\d+)"/gm)].map(
    (m) => [m[1], m[2]],
  ),
);
// The fixed Packs 1-4 bundle (JVZoo 453431): the one product whose buy block is a
// named export (`bundleBuy`) instead of a slug-keyed entry, so it needs its own ID
// reader. It is one of the 14 counted IDs, and it is the product behind the
// /sales/packs-1-4-bundle clean page.
const bundleId = (jvzooSource.match(/bundleBuy\s*=\s*jvzooProduct\(\s*"(\d+)"/) || [])[1];

// The slug -> JVZoo ID lookup used below. It is idBySlug plus the bundle, so a buy
// requirement and the canonical-buy-block check resolve for every product page —
// including the bundle's clean page — through ONE function.
function idForSlug(slug) {
  if (slug === CLEAN_SALES_BUNDLE_SLUG) return bundleId;
  return idBySlug.get(slug);
}

// The two product-page shapes: an article pack (/library/<slug>) and a standalone
// ebook (/ebooks/<slug>). Both render from the same slug-keyed map in src/jvzoo.ts.
// `/sales/<slug>` is the JVZoo compliance clean page for the same product as its
// `/library/<slug>` or `/ebooks/<slug>` page, so it resolves through the same
// slug -> ID map and is held to the same buy-block requirement (the bundle's clean
// page resolves through idForSlug). It adds no new product IDs: allIds below
// counts PACK_SLUGS + the bundle only.
const PRODUCT_PATH = /^\/(?:library|ebooks|sales)\/(.+)$/;

// /packs and /library always carry a working buy path (thirteen live packs + the
// Packs 1-4 bundle). A product page (/library/<pack>, /ebooks/<ebook>) is held to
// that only when that product has a live listing. /ebooks is the ebook hub: a page
// of links to the ebook sales pages, not a buy page.
function wantsBuy(path) {
  if (path === "/packs" || path === "/library") return true;
  const match = PRODUCT_PATH.exec(path);
  return match ? Boolean(idForSlug(match[1])) : false;
}
// A product page with no listing must not ship a half-built buy block either.
function listingSlugOf(path) {
  const match = PRODUCT_PATH.exec(path);
  return match ? match[1] : null;
}

// Every other route the site pre-renders: it must exist and be a finished document.
const OTHER = [
  "/",
  "/affiliates",
  "/disclaimer",
  "/downloads",
  "/join",
  "/join/essentials",
  "/join/pro",
  "/membership",
  "/pricing",
  "/privacy",
  "/support",
  "/terms",
  "/purchase/success",
  "/purchase/cancel",
  ...PACK_SLUGS.map((s) => "/checkout/" + s),
];
const OTHER_MIN_BYTES = 5000;

// Sales pages must keep the JVZoo buy path: the buy-button link and the tracking
// pixel are what JVZoo compliance checks for.
const BUY_MARKERS = ["jvzoo.com/b/", "i.jvzoo.com"];

const file = (path) => join(CLIENT, path === "/" ? "index.html" : path + "/index.html");

const failures = [];
const rows = [];

for (const [path, min, wantBuy] of [
  ...SALES.map((p) => [p, SALES_MIN_BYTES, wantsBuy(p)]),
  // The third-round clean pages, at their own floor (see the comment above). Every
  // one of them has a live listing, so the buy path is required.
  ...CLEAN_SALES_ROUND_3_SLUGS.map((s) => [
    "/sales/" + s,
    SALES_MIN_BYTES_3RD_ROUND,
    true,
  ]),
  ...OTHER.map((p) => [p, OTHER_MIN_BYTES, false]),
]) {
  const f = file(path);
  const problems = [];
  let size = 0;
  if (!existsSync(f)) {
    problems.push("no baked file (route missing from the prerender list?)");
  } else {
    const html = readFileSync(f, "utf8");
    size = Buffer.byteLength(html);
    if (size < min) problems.push(`only ${size}B (floor ${min}B)`);
    if (!html.includes(CLOSED)) problems.push("document never closes — truncated bake");
    if (html.includes(DEGRADED_MARKER)) problems.push("baked the unavailable fallback");
    if (wantBuy) {
      for (const marker of BUY_MARKERS) {
        if (!html.includes(marker)) problems.push(`missing ${marker}`);
      }
    } else {
      const slug = listingSlugOf(path);
      if (slug !== null && !idForSlug(slug)) {
        for (const marker of BUY_MARKERS) {
          if (html.includes(marker)) {
            problems.push(`no JVZoo listing for this product but the page ships ${marker}`);
          }
        }
      }
    }
  }
  rows.push([path, size, problems]);
  if (problems.length) failures.push([path, problems]);
}

// --- Canonical JVZoo buy-block gate (added 2026-09-19) ---
//
// A JVZoo reviewer requires the dashboard's "use your own button" snippet shape:
//
//   <a href="https://jvzoo.com/b/0/{ID}/2" target="_blank"
//      rel="nofollow noopener noreferrer"><img src="https://i.jvzoo.com/0/{ID}/2"
//      border="0" alt="..." /></a>
//   <img src="https://i.jvzoo.com/0/{ID}/2" width="1" height="1" border="0" alt="" />
//
// i.e. the bare `jvzoo.com` host, and the `/2` variant on the link, on the
// button image inside the anchor, AND on the 1x1 tracking pixel. The product
// IDs are read from src/jvzoo.ts, so this gate can never drift from the code
// that renders the buttons.
// (bundleId is read above, next to the slug -> ID map, because the page-level
// checks that run before this point need it too.)
// The article-pack IDs + the bundle. Read from the pack slugs explicitly rather
// than "every ID in the file" so that wiring up the 11 ebook listings later (one
// line each in src/jvzoo.ts) can never make this count check fire.
const packIds = [...new Set(PACK_SLUGS.map((s) => idBySlug.get(s)).filter(Boolean))];
const allIds = [...new Set([...packIds, ...(bundleId ? [bundleId] : [])])];
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pad = (s, n) => String(s).padEnd(n);
function canonicalBuyProblems(html, id) {
  const problems = [];
  const link = `https://jvzoo.com/b/0/${id}/2`;
  const img = `https://i.jvzoo.com/0/${id}/2`;
  const anchor = new RegExp(
    `<a href="${escapeRe(link)}"[^>]*>\\s*<img src="${escapeRe(img)}"`,
  );
  const pixel = new RegExp(`<img src="${escapeRe(img)}" width="1" height="1"`);
  if (!html.includes(`href="${link}"`)) problems.push(`no buy link ${link}`);
  if (!anchor.test(html)) problems.push(`button image inside the anchor is not ${img}`);
  if (!pixel.test(html)) problems.push(`no 1x1 tracking pixel ${img}`);
  if (html.includes(`/0/${id}/1`)) problems.push(`non-canonical /1 image for product ${id}`);
  return problems;
}
if (allIds.length !== 14) {
  failures.push([
    "src/jvzoo.ts",
    [`expected 14 product IDs (13 packs + 1 bundle), read ${allIds.length}`],
  ]);
}
const buyPages = [
  // /packs shows all thirteen live packs plus the Packs 1-4 bundle.
  ["/packs", allIds],
  // /library shows the thirteen live pack buy buttons; the bundle is only sold on /packs.
  ["/library", packIds],
  ...PACK_SLUGS.map((s) => [
    "/library/" + s,
    idBySlug.has(s) ? [idBySlug.get(s)] : [],
  ]),
  ...EBOOK_SLUGS.map((s) => [
    "/ebooks/" + s,
    idBySlug.has(s) ? [idBySlug.get(s)] : [],
  ]),
  // The clean pages for the fourteen flagged listings: each must carry the canonical
  // buy block for its OWN product ID (the same IDs counted above — no new ones).
  ...CLEAN_SALES_SLUGS.map((s) => [
    "/sales/" + s,
    idForSlug(s) ? [idForSlug(s)] : [],
  ]),
];
const buyRows = [];
for (const [path, ids] of buyPages) {
  const f = file(path);
  const problems = [];
  if (!existsSync(f)) {
    problems.push("no baked file (route missing from the prerender list?)");
  } else {
    const html = readFileSync(f, "utf8");
    for (const id of ids) problems.push(...canonicalBuyProblems(html, id));
    if (html.includes("www.jvzoo.com/b/")) {
      problems.push("non-canonical www.jvzoo.com buy link");
    }
  }
  buyRows.push([path, ids.length, problems]);
  if (problems.length) failures.push(["buy-block " + path, problems]);
}

// --- Clean-sales-page gate (JVZoo link removal, added 2026-09-27) ---
//
// The reviewer requirement on the flagged listings, verbatim: "Please remove
// ALL links that direct away from the sales page. You can keep the terms,
// privacy, disclaimers, support, etc. All other links must be removed."
//
// So a /sales/<slug> page may carry ONLY:
//   * its own JVZoo buy link and the button image / 1x1 pixel on i.jvzoo.com,
//   * the four pages the reviewer allows by name: /terms, /privacy,
//     /disclaimer, /support,
//   * the local cover image and the site's own JS/CSS/font assets,
//   * its self-canonical URL (fine, and it keeps the page out of a duplicate
//     content mess — the buyer must be able to reach it, so it is not noindexed).
//
// This reads the raw href attributes out of the BAKED HTML (not the React tree),
// so a link added anywhere — including inside a fallback branch, the shared
// disclaimer component or the root layout's header/footer — fails the build
// instead of reaching a reviewer. Every href is checked twice: it must match the
// allowlist, and it must not match a forbidden pattern (the explicit messages
// make a failure obvious at a glance).
const ALLOWED_HREF = [
  /^https:\/\/jvzoo\.com\/b\//,
  /^https:\/\/i\.jvzoo\.com\//,
  /^\/terms$/,
  /^\/privacy$/,
  /^\/disclaimer$/,
  /^\/support$/,
  /^\/covers\//,
  /^\/assets\//,
  // Font preconnects + stylesheet (bare host on the preconnect, no path).
  /^https:\/\/fonts\.googleapis\.com(\/|$)/,
  /^https:\/\/fonts\.gstatic\.com(\/|$)/,
  /^https:\/\/www\.healthcopyforge\.com\/sales\//, // self-canonical
];
const FORBIDDEN_HREF = [
  [/^\/$/, "link back to the site home page"],
  [/^\/library/, "link to /library"],
  [/^\/packs/, "link to /packs"],
  [/^\/ebooks/, "link to /ebooks"],
  [/^\/affiliates/, "link to /affiliates"],
  [/^\/membership/, "link to /membership"],
  [/^\/pricing/, "link to /pricing"],
  [/^\/join/, "link to /join"],
  [/^\/checkout/, "link to /checkout"],
  [/^\/downloads/, "link to /downloads"],
  [/^\/zips\//, "link to a /zips download"],
  [/^mailto:/, "mailto link"],
  [/^https?:\/\/(?!jvzoo\.com|i\.jvzoo\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|www\.healthcopyforge\.com\/sales\/)/, "external link off the sales page"],
];
// Text that must / must not appear in a clean page's baked HTML.
const CLEAN_REQUIRED_TEXT = [
  "jvzoo.com/b/",
  "i.jvzoo.com",
  "I understand and agree that this purchase is non-refundable",
  "JVZoo serves as the retailer",
];
const CLEAN_FORBIDDEN_TEXT = [
  "Available for instant download",
  "Content temporarily unavailable",
  "www.jvzoo.com",
];
const cleanRows = [];
for (const slug of CLEAN_SALES_SLUGS) {
  const path = "/sales/" + slug;
  const f = file(path);
  const problems = [];
  if (!existsSync(f)) {
    problems.push("no baked file (route missing from the prerender list?)");
  } else {
    const html = readFileSync(f, "utf8");
    const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
    const checked = new Set();
    for (const href of hrefs) {
      if (checked.has(href)) continue;
      checked.add(href);
      const forbidden = FORBIDDEN_HREF.find(([re]) => re.test(href));
      if (forbidden) {
        problems.push(`forbidden href "${href}" — ${forbidden[1]}`);
      } else if (!ALLOWED_HREF.some((re) => re.test(href))) {
        problems.push(`href not on the clean-page allowlist: "${href}"`);
      }
    }
    for (const text of CLEAN_REQUIRED_TEXT) {
      if (!html.includes(text)) {
        problems.push(`missing required text "${text}"`);
      }
    }
    for (const text of CLEAN_FORBIDDEN_TEXT) {
      if (html.includes(text)) problems.push(`must not contain "${text}"`);
    }
    const id = idForSlug(slug);
    if (!id) {
      problems.push(
        "no JVZoo product ID for this clean sales slug (src/jvzoo.ts / bundleBuy)",
      );
    } else {
      problems.push(...canonicalBuyProblems(html, id));
    }
  }
  cleanRows.push([path, problems]);
  if (problems.length) failures.push(["clean-sales " + path, problems]);
}
console.log("pre-render gate — dist/client");
for (const [path, size, problems] of rows) {
  const status = problems.length ? "FAIL" : "ok  ";
  console.log(
    `  ${status} ${pad(path, 52)} ${pad(size ? size + "B" : "-", 9)}${
      problems.join("; ")
    }`,
  );
}

console.log("\ncanonical JVZoo buy blocks \u2014 every baked sales page");
for (const [path, count, problems] of buyRows) {
  const status = problems.length ? "FAIL" : "ok  ";
  console.log(
    `  ${status} ${pad(path, 52)} ${pad(count + " product(s)", 13)}${problems.join(
      "; ",
    )}`,
  );
}

console.log(
  "\nJVZoo link-removal clean pages \u2014 /sales/<slug> (only the buy link + terms/privacy/disclaimer/support allowed)",
);
for (const [path, problems] of cleanRows) {
  const status = problems.length ? "FAIL" : "ok  ";
  console.log(`  ${status} ${pad(path, 56)}${problems.join("; ")}`);
}
if (failures.length) {
  console.error(
    `\npre-render gate FAILED for ${failures.length} route(s). ` +
      "Refusing to publish pages that would not be served complete from disk " +
      "with canonical JVZoo buy blocks. " +
      "Check the prerender list in vite.config.ts and that the database was " +
      "reachable during this build (it is read at build time, not request time).",
  );
  process.exit(1);
}
console.log(
  `\npre-render gate passed: ${rows.length} routes baked and complete; ` +
    `${buyRows.length} sales pages carry canonical JVZoo buy blocks.`,
);
