import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// ── Static pre-rendering (SSG) ───────────────────────────────────────────────
// WHY THIS EXISTS: the live edge intermittently cuts *streamed* SSR responses at
// ~5-7KB and then "repairs" the document (closing tags + its reload script), so a
// sales page can arrive syntactically complete but content-less — no headline,
// no description, no JVZoo buy button. That is exactly what JVZoo compliance
// reported. Static files are never cut, so every route that can be rendered
// without per-request state is baked to HTML at build time here, written into
// dist/client and served as a *file* by serve.ts — never rendered per request on
// the live edge.
//
// The database IS reachable at build time (publishing runs `vite build` in this
// sandbox), so real pack data bakes into the HTML. To keep that guarantee from
// silently degrading, `onSuccess` throws when a page baked the "content
// unavailable" fallback: if the DB is unreachable during a build, the build
// FAILS loudly instead of publishing a content-less sales page.
//
// `crawlLinks: false` is load-bearing, not cosmetic: the prerenderer writes every
// fetched response with `res.text()` under the requested path, and this site
// links to /zips/*.zip and /covers/*.jpg — crawling those links would overwrite
// the pack ZIPs and cover images with mojibake. Routes are listed explicitly.
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
const TIER_SLUGS = ["essentials", "pro"];

// Static (non-dynamic) routes. `autoStaticPathsDiscovery` also picks up static
// routes automatically, so a newly added page is covered without editing this
// list; these are listed explicitly to keep the pre-rendered set auditable.
const STATIC_PATHS = [
  "/",
  "/affiliates",
  "/disclaimer",
  "/downloads",
  "/join/",
  "/library/",
  "/membership",
  "/packs",
  "/pricing",
  "/privacy",
  "/purchase/cancel",
  "/purchase/success",
  "/support",
  "/terms",
];

// Dynamic routes need one entry per concrete path.
const PRERENDER_PAGES = [
  ...STATIC_PATHS.map((path) => ({ path })),
  ...PACK_SLUGS.map((slug) => ({ path: "/library/" + slug })),
  ...PACK_SLUGS.map((slug) => ({ path: "/checkout/" + slug })),
  ...TIER_SLUGS.map((tier) => ({ path: "/join/" + tier })),
];

// Emitted by components/ContentUnavailable.tsx when a DB read failed.
const DEGRADED_MARKER = "Content temporarily unavailable";

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    // The site is reverse-proxied behind <label>.<PUBLIC_SITE_DOMAIN>; the proxy
    // masks the Host to localhost:3000, but accept any host so a dev server never
    // rejects a proxied request with "Blocked request".
    allowedHosts: true,
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      // `pages` is a top-level start option (NOT a key of `prerender`): one entry
      // per route that must be baked. Static routes are also discovered
      // automatically, but dynamic routes only exist here.
      pages: PRERENDER_PAGES,
      prerender: {
        enabled: true,
        // Keep discovery on so future static routes are covered too.
        autoStaticPathsDiscovery: true,
        crawlLinks: false,
        // 2 CPUs on this box — keep the prerender pool small so the build stays
        // inside the memory budget.
        concurrency: 2,
        retryCount: 1,
        retryDelay: 500,
        failOnError: true,
        onSuccess: ({ page, html }) => {
          if (html.includes(DEGRADED_MARKER)) {
            throw new Error(
              "Pre-render baked the degraded fallback for " +
                page.path +
                " (database unavailable at build time) — refusing to publish a content-less page.",
            );
          }
        },
      },
    }),
    viteReact(),
  ],
});
