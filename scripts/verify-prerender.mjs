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
];

// Sales URLs that must be FULL pages with a working buy path. 15 KB is the floor
// the team holds the live pages to; the real pages run 16.6-57 KB.
const SALES = ["/packs", "/library", ...PACK_SLUGS.map((s) => "/library/" + s)];
const SALES_MIN_BYTES = 15000;

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
  ...SALES.map((p) => [p, SALES_MIN_BYTES, true]),
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
    }
  }
  rows.push([path, size, problems]);
  if (problems.length) failures.push([path, problems]);
}

const pad = (s, n) => String(s).padEnd(n);
console.log("pre-render gate — dist/client");
for (const [path, size, problems] of rows) {
  const status = problems.length ? "FAIL" : "ok  ";
  console.log(
    `  ${status} ${pad(path, 52)} ${pad(size ? size + "B" : "-", 9)}${
      problems.join("; ")
    }`,
  );
}

if (failures.length) {
  console.error(
    `\npre-render gate FAILED for ${failures.length} route(s). ` +
      "Refusing to publish pages that would not be served complete from disk. " +
      "Check the prerender list in vite.config.ts and that the database was " +
      "reachable during this build (it is read at build time, not request time).",
  );
  process.exit(1);
}
console.log(`\npre-render gate passed: ${rows.length} routes baked and complete.`);
