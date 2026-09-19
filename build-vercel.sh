#!/usr/bin/env bash
# Produce a Vercel Build Output API bundle (.vercel/output) for this site, then
# deploy it with:  bunx vercel deploy --prebuilt
#
# Why Build Output API instead of Vercel's Vite/framework detection:
#  - TanStack Start emits a host-agnostic fetch handler (dist/server/server.js)
#    that dynamic-imports its own ./assets chunks and externalizes node deps.
#    Letting Vercel trace/detect that is fragile.
#  - Bundling it into one self-contained file (deps + dynamic chunks inlined) in a
#    single render.func removes all tracing/detection risk. vercel-entry.ts adapts
#    the Node (req,res) launcher to the web fetch handler.
set -euo pipefail
cd "$(dirname "$0")"
umask 002

echo "[1/3] vite build (light — safe under the sandbox memory cap)"
# The workspace starts as sources only (deps live with the image's pre-built
# placeholder copy); no-op once node_modules is current.
bun install
bun run build

echo "[2/3] assemble .vercel/output (Build Output API v3)"
rm -rf .vercel/output
mkdir -p .vercel/output/functions/render.func
cp -R dist/client .vercel/output/static

echo "[3/3] bundle SSR handler + deps into the render function"
bun build vercel-entry.ts --target node \
  --outfile .vercel/output/functions/render.func/index.mjs

cat > .vercel/output/functions/render.func/.vc-config.json <<'JSON'
{ "runtime": "nodejs22.x", "handler": "index.mjs", "launcherType": "Nodejs", "supportsResponseStreaming": true }
JSON

# Routing: every PRE-RENDERED page is served as a static FILE, never rendered by
# the SSR function. This is the compliance fix: the function reads the database on
# every request, so a DB hiccup there produces the same content-less sales page the
# JVZoo reviewers reported (18+ denials), while a file read cannot fail that way.
# Only paths with no baked file fall through to the function, and the route list is
# derived from dist/client — adding a page to the prerender list in vite.config.ts
# covers it here automatically (and index.html is deliberately NOT deleted, so "/"
# is a file too).
bun -e '
  const { readdirSync, writeFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const walk = (dir, out = []) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, out);
      else if (e.name === "index.html") out.push(p);
    }
    return out;
  };
  const root = ".vercel/output/static";
  const escapeRe = (s) => s.replace(/[.*+?^()|[\]{}]/g, (m) => "\\" + m);
  const routes = walk(root)
    .map((f) => f.slice(root.length))
    .sort()
    .map((rel) => {
      const clean = rel.replace(/\/index\.html$/, "") || "/";
      return clean === "/"
        ? { src: "^/?$", dest: "/index.html" }
        : { src: "^" + escapeRe(clean) + "/?$", dest: clean + "/index.html" };
    });
  routes.push({ handle: "filesystem" }, { src: "/(.*)", dest: "/render" });
  writeFileSync(
    ".vercel/output/config.json",
    JSON.stringify({ version: 3, routes }, null, 2) + "\n",
  );
  console.log("routed " + (routes.length - 2) + " pre-rendered pages to static files");
'

echo "done -> .vercel/output ready for: bunx vercel deploy --prebuilt"
