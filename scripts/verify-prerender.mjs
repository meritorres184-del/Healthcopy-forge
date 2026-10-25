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
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
// The build output this gate inspects. Defaults to the real dist/client, i.e. the
// behaviour `bun run build` has always had. PRERENDER_CLIENT_DIR points it at a
// MUTATED COPY of that tree instead — that is how the negative tests prove the
// gate still bites (inject a forbidden href, delete the injection point, inject a
// JVZoo pixel into a pending page) without touching the real build output.
const CLIENT = process.env.PRERENDER_CLIENT_DIR
  ? resolve(process.env.PRERENDER_CLIENT_DIR)
  : join(ROOT, "dist/client");

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
// (the thirteen article packs + the fixed Packs 1-4 bundle + eleven ebooks = 25,
// the whole catalog: nine ebooks a JVZoo reviewer rejected with "remove ALL links
// that direct away from the sales page", plus Healthy Feet and Protein for
// Healthy Aging, which the owner asked for). Canonical list:
// src/lib/cleanSales.ts; kept in sync with CLEAN_SALES_SLUGS in vite.config.ts,
// which is what actually bakes them. Nothing is excluded.
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
// Fourth flag round (2026-09-28, after round 3 shipped): the Healthy Feet ebook
// (JVZoo 454739). That listing was never flagged — the owner asked for its
// link-free page herself — but it is the same page family and the same checks,
// so it is its own const for the same reason as the other rounds. Its ID already
// exists in src/jvzoo.ts, so it adds no new product ID: `allIds` stays at 14.
// Held to the standard 15 KB SALES floor (it joins the rounds 1-2 spread below),
// because it is an ebook with a full owner description like those pages, not one
// of the shorter third-round pages.
const CLEAN_SALES_EBOOK_SLUGS_4TH_ROUND = ["healthy-feet"];
// Fifth round (2026-09-28, after round 4 shipped): the Protein for Healthy Aging
// ebook (JVZoo 454751), also requested by the owner — she had previously been
// leaving it out of the clean pages while considering deactivating it as a
// duplicate, then asked for its page, so it completes the catalog (25 pages).
// Same page family, same checks, its own const for the same reason as the other
// rounds. Its ID already exists in src/jvzoo.ts, so it adds no new product ID:
// `allIds` stays at 14. Held to the standard 15 KB SALES floor (it is an ebook
// with a full owner description), like round 4.
const CLEAN_SALES_EBOOK_SLUGS_5TH_ROUND = ["protein-aging"];
const CLEAN_SALES_COURSE_SLUGS = [
// Sixth family (2026-10-15): the 35 standalone PLR courses. NOT a flag round and
// not a "page the owner asked for after a flag": the owner creates the 35 course
// JVZoo listings herself and wants each course's own link-free URL in hand BEFORE
// the listing exists (she will not point a listing at a placeholder URL, and she
// will not go back and edit a listing). A JVZoo product ID cannot exist before its
// listing does, so these 35 pages ship WITHOUT a buy button and are exempt from the
// canonical-buy-block check through PENDING_COURSE_BUY_SLUGS below — instead each
// one must carry the marked, empty injection point the canonical button renders
// into (src/routes/sales.<slug>.tsx). Every OTHER clean-page rule still applies to
// them: the href allowlist, the forbidden-href list (incl. /checkout), no external
// resources, no webfont, closed document, size floor, no degraded bake, and the
// negative check that they ship no JVZoo marker at all.
//
// Wiring one course later is TWO lines, one per half, and never a page edit: the
// course's ID in src/jvzoo.ts (which is what renders the canonical buy block) and
// the course in WIRED_COURSES below (which is what holds the page to it). The gate
// cross-checks the two and fails the build if they disagree, so a course can never
// go live with a buy block the gate is not checking — and the page itself is never
// touched (src/routes/sales.<slug>.tsx already renders the canonical block into the
// same container the interim Stripe button sits in).
  "active-living",
  "balance-stability",
  "balanced-eating",
  "bodyweight-exercise",
  "busy-lifestyle",
  "cardiovascular-fitness",
  "eating-budget",
  "exercise-motivation",
  "exercise-recovery",
  "fitness-after-50",
  "food-labels",
  "fruits-vegetables",
  "functional-fitness",
  "healthy-grocery",
  "healthy-pantry",
  "healthy-snacking",
  "home-fitness-beginners",
  "home-workout-space",
  "low-impact-fitness",
  "meal-planning-budget",
  "meal-prep",
  "mindful-eating",
  "mobility-flexibility",
  "nutrition-basics",
  "nutrition-wellness",
  "plant-forward",
  "portion-awareness",
  "resistance-band",
  "starting-exercise",
  "strength-training",
  "stretching-fundamentals",
  "sustainable-eating",
  "tracking-fitness",
  "walking-fitness",
  "weekly-fitness",
];
// The courses whose JVZoo listing the owner has now CREATED, with the product ID
// the page's canonical buy block must carry — the gate half of the wiring step
// (the page half is the single entry in src/jvzoo.ts -> courseJvzooProducts, which
// is what actually renders the button). Listed by hand on purpose: the gate must
// not silently accept a new buy block appearing on a course page, and the
// cross-check beside idBySlug below fails the build if this list and src/jvzoo.ts
// disagree (a course wired in code but not here, one listed here with no ID in the
// code, or a wrong ID on either side). The count of product IDs the gate checks
// grows by one per entry here: 14 -> 15 with active-living, 15 -> 16 with
// balance-stability, 16 -> 17 with balanced-eating, 17 -> 18 with
// bodyweight-exercise, 18 -> 19 with busy-lifestyle, 19 -> 20 with
// cardiovascular-fitness, 20 -> 21 with eating-budget, 21 -> 22 with
// exercise-motivation, 22 -> 23 with exercise-recovery, 23 -> 24 with
// fitness-after-50, 24 -> 25 with food-labels, 25 -> 26 with fruits-vegetables,
// 26 -> 27 with functional-fitness, 27 -> 28 with healthy-grocery.
//
// active-living — "Active Living for Busy People", JVZoo product 458158, the first
// course listing the owner created (2026-10-18).
//
// balance-stability — "Balance and Stability Training", JVZoo product 458450, the
// second (2026-10-23).
//
// balanced-eating — "Building a Balanced Eating Routine", JVZoo product 458983, the
// third (2026-10-23).
//
// bodyweight-exercise — "Bodyweight Exercise Basics", JVZoo product 459045, the
// fourth (2026-10-23).
//
// busy-lifestyle — "Nutrition for Busy Lifestyles", JVZoo product 459047, the fifth
// (2026-10-23).
//
// cardiovascular-fitness — "Cardiovascular Fitness Basics", JVZoo product 459049, the
// sixth (2026-10-24).
//
// eating-budget — "Eating Well on a Budget", JVZoo product 459101, the seventh
// (2026-10-24).
//
// exercise-motivation — "Exercise Motivation and Consistency", JVZoo product 459117,
// the eighth (2026-10-25).
//
// exercise-recovery — "Exercise Recovery Fundamentals", JVZoo product 459119, the
// ninth (2026-10-25).
//
// fitness-after-50 — "Fitness After 50", JVZoo product 459123, the tenth
// (2026-10-25).
//
// food-labels — "Understanding Food Labels", JVZoo product 459125, the eleventh
// (2026-10-25).
//
// fruits-vegetables — "Adding More Fruits and Vegetables to Your Diet", JVZoo
// product 459127, the twelfth (2026-10-25).
//
// functional-fitness — "Functional Fitness for Everyday Life", JVZoo product
// 459129, the thirteenth (2026-10-25).
//
// healthy-grocery — "Healthy Grocery Shopping", JVZoo product 459131, the
// fourteenth (2026-10-25). Each such page therefore carries the full
// canonical buy block (link + button image + 1x1 tracking pixel) and NO interim
// Stripe href.
const WIRED_COURSES = [
  ["active-living", "458158"],
  ["balance-stability", "458450"],
  ["balanced-eating", "458983"],
  ["bodyweight-exercise", "459045"],
  ["busy-lifestyle", "459047"],
  ["cardiovascular-fitness", "459049"],
  ["eating-budget", "459101"],
  ["exercise-motivation", "459117"],
  ["exercise-recovery", "459119"],
  ["fitness-after-50", "459123"],
  ["food-labels", "459125"],
  ["fruits-vegetables", "459127"],
  ["functional-fitness", "459129"],
  ["healthy-grocery", "459131"],
];
const WIRED_COURSE_SLUGS = new Set(WIRED_COURSES.map(([slug]) => slug));
// The course slugs whose JVZoo listing may not exist yet, so the buy block CANNOT
// be on their page: every course that is NOT wired above (21 today). Derived from
// CLEAN_SALES_COURSE_SLUGS rather than listed by hand so that (a) a newly added
// course page is buy-pending by default — it must never claim a buy path it does
// not have — and (b) this set can never contradict WIRED_COURSES. The clean-page
// loop below additionally requires that such a page has no product ID
// (idForSlug(slug) is empty), so a wired course is held to the canonical buy block
// on both halves: it left this set, and it has an ID. (Derived without reading
// idBySlug here on purpose: that map is declared further down beside the
// buy-block section, and reading it above its declaration is a
// temporal-dead-zone error.)
const PENDING_COURSE_BUY_SLUGS = new Set(
  CLEAN_SALES_COURSE_SLUGS.filter((s) => !WIRED_COURSE_SLUGS.has(s)),
);
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
  ...CLEAN_SALES_EBOOK_SLUGS_4TH_ROUND,
  ...CLEAN_SALES_EBOOK_SLUGS_5TH_ROUND,
  ...CLEAN_SALES_COURSE_SLUGS,
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
// The 35 course pages get their own floor: like a third-round page they render no
// site chrome, but their copy is the kit's full long-form sales page (roughly 4,000
// characters of description plus the cover), so they land around 12-14 KB. 8 KB
// still catches the truncated bake this floor exists for (the live edge cuts
// streamed responses at ~5-7 KB) and the closed-document, injection-point,
// required-text and href-allowlist checks below carry the rest.
const SALES_MIN_BYTES_COURSE = 8000;
const SALES = [
  "/packs",
  "/library",
  "/ebooks",
  ...PACK_SLUGS.map((s) => "/library/" + s),
  ...EBOOK_SLUGS.map((s) => "/ebooks/" + s),
  ...CLEAN_SALES_SLUGS_ROUNDS_1_2.map((s) => "/sales/" + s),
  // The fourth-round clean page (Healthy Feet) joins them at the same 15 KB floor.
  ...CLEAN_SALES_EBOOK_SLUGS_4TH_ROUND.map((s) => "/sales/" + s),
  // The fifth-round clean page (Protein for Healthy Aging) too: full owner
  // description, same 15 KB floor.
  ...CLEAN_SALES_EBOOK_SLUGS_5TH_ROUND.map((s) => "/sales/" + s),
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
// The bundle's listing NAME, read from the same `bundleBuy` export the buy button
// uses. Its clean page (see the bundle check further down) is reached from that
// FIXED listing, so it must present this exact name — and must never carry the
// site's flexible "any four packs" copy, which describes the /packs checkout
// mechanic rather than the fixed product.
const bundleListingName = (jvzooSource.match(
  /bundleBuy\s*=\s*jvzooProduct\(\s*"\d+",\s*"((?:[^"\\]|\\.)*)"/,
) || [])[1];

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
  // The 35 course pages, at their own floor. Their buy-path expectation is whatever
  // their listing state says: nothing today (no product ID exists yet, and the loop
  // below then proves the page ships no JVZoo marker at all), the full canonical buy
  // block the moment the owner's ID is in src/jvzoo.ts.
  ...CLEAN_SALES_COURSE_SLUGS.map((s) => [
    "/sales/" + s,
    SALES_MIN_BYTES_COURSE,
    wantsBuy("/sales/" + s),
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
// The 13 packs + the fixed bundle: the IDs the /packs and /library pages sell, and
// the set the "14 product IDs" count below is about.
const packBundleIds = [...new Set([...packIds, ...(bundleId ? [bundleId] : [])])];
// The courses the owner has wired, read back out of src/jvzoo.ts — the same file
// the buy blocks are rendered from, so this can never drift from the code.
const wiredCourseSlugs = CLEAN_SALES_COURSE_SLUGS.filter((s) => idBySlug.has(s));
const wiredCourseIds = [...new Set(wiredCourseSlugs.map((s) => idBySlug.get(s)))];
// EVERY product ID the gate expects a canonical buy block for: the 14 packs +
// bundle above, plus one per wired course. 28 today (14 + active-living 458158 +
// balance-stability 458450 + balanced-eating 458983 + bodyweight-exercise 459045 +
// busy-lifestyle 459047 + cardiovascular-fitness 459049 + eating-budget 459101 +
// exercise-motivation 459117 + exercise-recovery 459119 + fitness-after-50 459123 +
// food-labels 459125 + fruits-vegetables 459127 + functional-fitness 459129 +
// healthy-grocery 459131);
// it grows by one each time the owner sends another course's listing ID.
const allIds = [...new Set([...packBundleIds, ...wiredCourseIds])];
// The gate half and the code half of the course wiring step must agree EXACTLY.
// This is what stops a course page from going live with a buy block nothing here
// was told about (that page would otherwise pass every other check: it has an ID,
// so it is no longer treated as pending).
if (wiredCourseSlugs.length !== WIRED_COURSES.length) {
  failures.push([
    "src/jvzoo.ts",
    [
      `expected ${WIRED_COURSES.length} wired course listing(s) in src/jvzoo.ts ` +
        `(${WIRED_COURSES.map(([s, id]) => `${s} ${id}`).join(", ")}), read ` +
        `${wiredCourseSlugs.length} course ID(s) from the file`,
    ],
  ]);
} else {
  for (const [slug, id] of WIRED_COURSES) {
    const found = idBySlug.get(slug);
    if (found !== id) {
      failures.push([
        "src/jvzoo.ts",
        [
          `course "${slug}" is wired to ${found ?? "(no ID)"} but WIRED_COURSES expects ${id}`,
        ],
      ]);
    }
  }
}
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
if (packBundleIds.length !== 14) {
  failures.push([
    "src/jvzoo.ts",
    [
      `expected 14 product IDs (13 packs + 1 bundle), read ${packBundleIds.length}`,
    ],
  ]);
}
const buyPages = [
  // /packs shows all thirteen live packs plus the Packs 1-4 bundle. NOT allIds:
  // a wired course's buy block belongs on that course's own sales page, never on
  // the packs page.
  ["/packs", packBundleIds],
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
  // The clean pages for the twenty-five listings (flag rounds 1-4 plus the
  // owner-requested Protein for Healthy Aging page): each must carry the
  // canonical buy block for its OWN product ID (the same IDs counted above — no
  // new ones). The 35 course pages contribute an EMPTY id list until the owner
  // wires each course into src/jvzoo.ts — then that page is checked here in full
  // (their IDs are not part of the 14 counted above: the count is the 13 packs +
  // the fixed bundle, and it must stay 14).
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
//   * the local cover image and the site's own JS/CSS assets (no webfont: fonts
//     are stripped from these pages too — see the note in ALLOWED_HREF),
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
  // NOTE: Google Fonts used to be allowed here (two preconnects + the Inter
  // stylesheet). They are FORBIDDEN now — the reviewer's rule is that the only
  // hosts a clean page may touch are jvzoo.com and i.jvzoo.com, and the font
  // <link>s were the last non-JVZoo external hrefs on these pages. The links are
  // suppressed for /sales/* in __root.tsx (RootDocument); the FORBIDDEN_HREF
  // entries below fail the build if they ever come back. Do not re-add them.
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
  // The /checkout/<slug> placeholder routes were DELETED (owner rule, 2026-09-30:
  // no sales-style page outside /sales/<slug>). The guard STAYS: any link to a
  // /checkout URL is now a broken link, and a clean page may never carry one.
  [/^\/checkout/, "link to the deleted /checkout route (sales pages live at /sales/<slug>)"],
  [/^\/downloads/, "link to /downloads"],
  [/^\/zips\//, "link to a /zips download"],
  [/^mailto:/, "mailto link"],
  [
    /^https:\/\/fonts\.googleapis\.com(\/|$)/,
    "Google Fonts preconnect/stylesheet \u2014 fonts must be stripped from clean pages",
  ],
  [
    /^https:\/\/fonts\.gstatic\.com(\/|$)/,
    "Google Fonts gstatic preconnect \u2014 fonts must be stripped from clean pages",
  ],
  [/^https?:\/\/(?!jvzoo\.com|i\.jvzoo\.com|www\.healthcopyforge\.com\/sales\/)/, "external link off the sales page"],
];
// Text that must / must not appear in a clean page's baked HTML.
//
// Split in two on purpose (2026-10-15): the retailer disclosure and the EU waiver
// belong on EVERY clean page, while the buy markers can only exist where a listing
// does — the 35 course pages have no product ID yet, and requiring a JVZoo URL on
// them would force a non-canonical or invented buy link, which is exactly what this
// gate exists to prevent.
const CLEAN_REQUIRED_TEXT = [
  "I understand and agree that this purchase is non-refundable",
  "JVZoo serves as the retailer",
];
// Required only where the product HAS a JVZoo listing (i.e. idForSlug(slug) is set).
const CLEAN_REQUIRED_BUY_TEXT = ["jvzoo.com/b/", "i.jvzoo.com"];
// The course pages' own required text: the owner's verbatim "Course Description for
// Listings" sentence (quoted in every course's kit § 7 sales-page copy), the price
// she locked, and the offer block. If a course page ever bakes without its real copy
// — the failure mode a size floor alone cannot name — this fails the build.
const COURSE_REQUIRED_TEXT = [
  "This is a done-for-you PLR (private label rights) course",
  "Get Instant Access",
  "$47",
];
// Required only on a course page whose listing is still PENDING: the interim
// Stripe button's own label, so such a page can never bake with a buy href but no
// readable call to action. A wired course page renders the canonical JVZoo block
// instead ("Buy securely through JVZoo — instant download after checkout"), so
// requiring "Buy Now" there would be requiring the wrong button.
const COURSE_PENDING_REQUIRED_TEXT = ["Buy Now"];
// The empty container the canonical JVZoo buy button + 1x1 pixel render into once
// the course's product ID exists. Required on a course page whose listing is still
// pending, so the injection point cannot be deleted by accident.
const COURSE_BUY_INJECTION_POINT = 'data-jvzoo-buy-injection-point="pending-product-id"';
// INTERIM BUY BUTTON on the 35 course pages (2026-10-18). Those pages are live
// before their JVZoo listings exist, and a JVZoo reviewer must find a REAL,
// working Buy button on each one — so while a course has no product ID its
// injection point carries the site's own LIVE Stripe checkout link for the
// standalone course ($47 one-time, the same product /pricing and /membership
// sell). This is the exact URL src/routes/sales.<slug>.tsx renders there
// (COURSE_INTERIM_BUY_HREF = STRIPE_PAYMENT_LINKS.course, src/lib/stripeLinks.ts)
// and the exact URL the /pricing and /membership CTAs use.
//
// It is PERMITTED on a clean page ONLY when that page is a course page whose
// JVZoo ID is still pending (see the clean-page loop below): on the 25 existing
// listings, on the bundle, and on a course page that already has its ID it is a
// forbidden href — "external link off the sales page" — and fails the build. The
// check at the bottom beside STRIPE_LINKS holds this literal and
// STRIPE_LINKS.course together so the two copies can never drift.
const COURSE_INTERIM_BUY_HREF = "https://buy.stripe.com/bJeaEZ41ZcfI0ZY0bL3sI02";
const CLEAN_FORBIDDEN_TEXT = [
  "Available for instant download",
  "Content temporarily unavailable",
  "www.jvzoo.com",
  // The site's flexible "any four packs" mechanic, not the fixed bundle JVZoo
  // sells (453431) — it must not appear on any clean page, and least of all on
  // the bundle page.
  "Any 4 Packs",
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
    const id = idForSlug(slug);
    // True only while this course's JVZoo listing does not exist yet: its page
    // carries the interim Stripe buy button (COURSE_INTERIM_BUY_HREF) instead of a
    // JVZoo buy block. Both halves matter — a course slug whose ID has arrived is
    // held to the canonical JVZoo block and must NOT still ship the Stripe link.
    const pendingCourseBuy = !id && PENDING_COURSE_BUY_SLUGS.has(slug);
    const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
    const checked = new Set();
    for (const href of hrefs) {
      if (checked.has(href)) continue;
      checked.add(href);
      // The interim Stripe buy button: checked BEFORE the allowlist/forbidden
      // rules because on a pending course page it is the one permitted non-JVZoo
      // outbound link (the buy path the page exists to provide), and everywhere
      // else on a clean page it is exactly what this gate must stop.
      if (href === COURSE_INTERIM_BUY_HREF) {
        if (!pendingCourseBuy) {
          problems.push(
            `forbidden href "${href}" — the interim Stripe course buy button is allowed only on a course page whose JVZoo product ID is still pending`,
          );
        }
        continue;
      }
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
    if (id) {
      for (const text of CLEAN_REQUIRED_BUY_TEXT) {
        if (!html.includes(text)) {
          problems.push(`missing required buy text "${text}"`);
        }
      }
    }
    if (CLEAN_SALES_COURSE_SLUGS.includes(slug)) {
      for (const text of COURSE_REQUIRED_TEXT) {
        if (!html.includes(text)) {
          problems.push(`missing course sales-page text "${text}"`);
        }
      }
    }
    for (const text of CLEAN_FORBIDDEN_TEXT) {
      if (html.includes(text)) problems.push(`must not contain "${text}"`);
    }
    if (slug === CLEAN_SALES_BUNDLE_SLUG) {
      // The bundle page sells the FIXED listing, so it has to carry that
      // listing's exact name (React escapes "&" as "&amp;" in the baked HTML).
      if (!bundleListingName) {
        problems.push(
          "could not read the bundle listing name from src/jvzoo.ts (bundleBuy)",
        );
      } else if (
        !html.includes(bundleListingName) &&
        !html.includes(bundleListingName.replace(/&/g, "&amp;"))
      ) {
        problems.push(
          `bundle clean page must present the fixed listing name "${bundleListingName}"`,
        );
      }
    }
    if (!id) {
      if (pendingCourseBuy) {
        // A course whose listing the owner has not created yet: the JVZoo buy block
        // CANNOT be on the page (no product ID exists), so require the marked
        // injection point AND the interim Stripe buy button that lives inside it —
        // exactly once, as a real href, with no second copy of the URL anywhere else
        // on the page. The page must also ship no JVZoo marker at all: a half-built
        // or borrowed buy block would ship a wrong product and must fail the build.
        if (!html.includes(COURSE_BUY_INJECTION_POINT)) {
          problems.push(
            "course page with no listing yet must carry the marked buy-button injection point",
          );
        }
        const buyAnchors = html.split(`href="${COURSE_INTERIM_BUY_HREF}"`).length - 1;
        if (buyAnchors !== 1) {
          problems.push(
            `pending course page must carry the interim Stripe buy anchor exactly once (href="${COURSE_INTERIM_BUY_HREF}" found ${buyAnchors} time(s))`,
          );
        }
        for (const text of COURSE_PENDING_REQUIRED_TEXT) {
          if (!html.includes(text)) {
            problems.push(
              `pending course page must carry its interim buy button's text "${text}"`,
            );
          }
        }
        const buyMentions = html.split(COURSE_INTERIM_BUY_HREF).length - 1;
        if (buyMentions !== buyAnchors) {
          problems.push(
            `the interim Stripe course URL appears ${buyMentions} time(s) but only ${buyAnchors} as a buy anchor`,
          );
        }
        for (const marker of BUY_MARKERS) {
          if (html.includes(marker)) {
            problems.push(
              `no JVZoo listing for this course yet but the page ships ${marker}`,
            );
          }
        }
      } else {
        problems.push(
          "no JVZoo product ID for this clean sales slug (src/jvzoo.ts / bundleBuy)",
        );
      }
    } else {
      problems.push(...canonicalBuyProblems(html, id));
    }
  }
  cleanRows.push([path, problems]);
  if (problems.length) failures.push(["clean-sales " + path, problems]);
}
// --- Live Stripe checkout gate (added 2026-10-12) ---
//
// The membership tiers and the standalone course sell through the owner's LIVE
// Stripe payment links (src/lib/stripeLinks.ts). Those CTAs are plain <a href>
// to buy.stripe.com, so the only way they can go wrong is silently: a copy edit
// that drops the link, a placeholder sentence that survives the change, or a
// tier pointed at the wrong plan. All three fail the build here.
//
// Keep the URLs in sync with src/lib/stripeLinks.ts when a price or link changes.
const STRIPE_LINKS = {
  essentials: "https://buy.stripe.com/00wdRbdCza7AfUS5w53sI00",
  pro: "https://buy.stripe.com/8x26oJfKHfrUaAy4s13sI01",
  course: "https://buy.stripe.com/bJeaEZ41ZcfI0ZY0bL3sI02",
};
// page -> the payment links that MUST appear as a real href in its baked HTML.
const CHECKOUT_REQUIRED = [
  ["/join", [STRIPE_LINKS.essentials, STRIPE_LINKS.pro, STRIPE_LINKS.course]],
  ["/join/essentials", [STRIPE_LINKS.essentials]],
  ["/join/pro", [STRIPE_LINKS.pro, STRIPE_LINKS.course]],
  ["/pricing", [STRIPE_LINKS.course]],
  ["/membership", [STRIPE_LINKS.course]],
];
// The interim course buy button above must be the SAME link the rest of the site
// sells the course through (src/lib/stripeLinks.ts -> STRIPE_PAYMENT_LINKS.course,
// src/routes/sales.<slug>.tsx -> COURSE_INTERIM_BUY_HREF). Two copies of a URL in
// two files is how a buy button starts pointing at a dead or wrong payment link,
// so the clean-page loop above used the literal and this asserts the literal is
// still the course link.
if (COURSE_INTERIM_BUY_HREF !== STRIPE_LINKS.course) {
  failures.push([
    "scripts/verify-prerender.mjs",
    [
      `COURSE_INTERIM_BUY_HREF (${COURSE_INTERIM_BUY_HREF}) is not STRIPE_LINKS.course (${STRIPE_LINKS.course})`,
    ],
  ]);
}
// Copy that became untrue once checkout went live: the site must never again
// advertise a membership checkout that does not exist.
const DEAD_CHECKOUT_TEXT = ["checkout opens soon"];
const DEAD_CHECKOUT_ROUTE = 'href="/checkout';

const checkoutRows = [];
for (const [path, links] of CHECKOUT_REQUIRED) {
  const f = file(path);
  const problems = [];
  if (!existsSync(f)) {
    problems.push("no baked file (route missing from the prerender list?)");
  } else {
    const html = readFileSync(f, "utf8");
    for (const link of links) {
      if (!html.includes(`href="${link}"`)) {
        problems.push(`missing Stripe CTA ${link}`);
      }
    }
    for (const text of DEAD_CHECKOUT_TEXT) {
      if (html.includes(text)) problems.push(`still advertises "${text}"`);
    }
    if (html.includes(DEAD_CHECKOUT_ROUTE)) {
      problems.push('links to the deleted /checkout route');
    }
  }
  checkoutRows.push([path, problems]);
  if (problems.length) failures.push(["checkout " + path, problems]);
}

// Owner rule (2026-09-30): /checkout/* is deleted and must 404 — so no baked
// page anywhere on the site may link to it. Checked across every pre-rendered
// route above, which is the whole public site.
for (const [path] of rows) {
  const f = file(path);
  if (existsSync(f) && readFileSync(f, "utf8").includes(DEAD_CHECKOUT_ROUTE)) {
    failures.push([
      "checkout href " + path,
      ["links to the deleted /checkout route"],
    ]);
  }
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
console.log(
  "\nlive Stripe checkout \u2014 membership + course CTAs (buy.stripe.com)",
);
for (const [path, problems] of checkoutRows) {
  const status = problems.length ? "FAIL" : "ok  ";
  console.log(`  ${status} ${pad(path, 52)}${problems.join("; ")}`);
}
// Every route-level failure was printed by the row loops above. The rest are
// FILE-level failures — src/jvzoo.ts (the product-ID count and the course-wiring
// cross-check) and this gate's own literals. Print them too: a wiring mistake
// must never fail the build with a bare failure count and no message saying what
// is wrong.
const printedPaths = new Set([
  ...rows.map(([p]) => p),
  ...buyRows.map(([p]) => "buy-block " + p),
  ...cleanRows.map(([p]) => "clean-sales " + p),
  ...checkoutRows.map(([p]) => "checkout " + p),
  ...rows.map(([p]) => "checkout href " + p),
]);
const fileFailures = failures.filter(([p]) => !printedPaths.has(p));
if (fileFailures.length) {
  console.error("\nfile-level gate failures — src/jvzoo.ts / this gate");
  for (const [p, problems] of fileFailures) {
    console.error("  FAIL " + p + ": " + problems.join("; "));
  }
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
    `${buyRows.length} sales pages carry canonical JVZoo buy blocks; ` +
    `${allIds.length} product IDs wired ` +
    `(${packBundleIds.length} packs/bundle + ${wiredCourseIds.length} course${
      wiredCourseIds.length === 1 ? "" : "s"
    }); ${PENDING_COURSE_BUY_SLUGS.size} of ${CLEAN_SALES_COURSE_SLUGS.length} ` +
    `course pages still pending a JVZoo listing.`,
);
