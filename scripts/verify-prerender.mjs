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

// Sales URLs that must be FULL pages. 15 KB is the floor the team holds the live
// pages to; the real pages run 16.6-57 KB.
const SALES = ["/packs", "/library", ...PACK_SLUGS.map((s) => "/library/" + s)];
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
// /packs and /library always carry a working buy path (eight live packs + the
// Packs 1-4 bundle). A /library/<slug> page is held to that only when the pack
// has a live listing.
function wantsBuy(path) {
  if (path === "/packs" || path === "/library") return true;
  const match = /^\/library\/(.+)$/.exec(path);
  return match ? idBySlug.has(match[1]) : false;
}
// A pack page with no listing must not ship a half-built buy block either.
function packSlugOf(path) {
  const match = /^\/library\/(.+)$/.exec(path);
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
      const slug = packSlugOf(path);
      if (slug !== null && !idBySlug.has(slug)) {
        for (const marker of BUY_MARKERS) {
          if (html.includes(marker)) {
            problems.push(`no JVZoo listing for this pack but the page ships ${marker}`);
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
const bundleId = (jvzooSource.match(/bundleBuy\s*=\s*jvzooProduct\(\s*"(\d+)"/) || [])[1];
const allIds = [...new Set([...idBySlug.values(), ...(bundleId ? [bundleId] : [])])];
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
if (allIds.length !== 9) {
  failures.push([
    "src/jvzoo.ts",
    [`expected 9 product IDs (8 packs + 1 bundle), read ${allIds.length}`],
  ]);
}
const packIds = [...new Set(idBySlug.values())];
const buyPages = [
  // /packs shows all eight packs plus the Packs 1-4 bundle.
  ["/packs", allIds],
  // /library shows the eight pack buy buttons; the bundle is only sold on /packs.
  ["/library", packIds],
  ...PACK_SLUGS.map((s) => [
    "/library/" + s,
    idBySlug.has(s) ? [idBySlug.get(s)] : [],
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
