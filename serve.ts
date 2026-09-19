// Production server for the built site. The TanStack Start build emits a portable
// fetch handler (dist/server/server.js) plus static client assets (dist/client);
// this wraps them in a Bun server on port 3000 — static files first, SSR for the
// rest. Run `bun run build` before starting. Restart it with `bun run publish`.
//
// STATIC FIRST IS THE COMPLIANCE FIX: the build pre-renders every sales and
// marketing route to HTML in dist/client (see vite.config.ts), so those URLs are
// answered with a file read here — never with a per-request SSR stream. The live
// edge has been observed cutting streamed SSR bodies and returning a "repaired"
// but content-less document; a file-backed response cannot be cut, and it needs no
// database at request time. Only genuinely dynamic requests (and paths with no
// file) reach the SSR handler.
//
// Starting a new instance supersedes the old one: it frees the port no matter
// which user owns the current server (provisioning starts it as `engine`; a team
// member's `bun run publish` runs as their own user), so publish never collides
// with an already-running server. Every sandbox user has passwordless sudo, so
// the takeover works across user boundaries.
import handler from "./dist/server/server.js";
// Pinned, NOT read from the environment. The published preview URL
// (<label>.<PUBLIC_SITE_DOMAIN>) is reverse-proxied to 0.0.0.0:3000 inside the
// sandbox, so the default site MUST bind there. Bun auto-loads .env files, so
// honouring process.env.PORT/HOST would let a stray env var or a .env in the site
// dir silently move the site off :3000 (or onto loopback) and break the public URL.
const PORT = 3000;
const HOST = "0.0.0.0";
const CLIENT_DIR = `${import.meta.dir}/dist/client`;
/**
 * Every file in dist/client that could answer this request path, in priority
 * order. TanStack's prerender writes a page as `<path>/index.html`
 * (`/packs` -> `dist/client/packs/index.html`,
 * `/library/sleep-recovery` -> `dist/client/library/sleep-recovery/index.html`,
 * `/` -> `dist/client/index.html`). The first candidate is the exact path, so
 * real assets (/assets/*.js, /zips/*.zip, /covers/*.jpg, /robots.txt) match
 * immediately; the rest exist purely to map a clean URL onto its pre-rendered
 * HTML file.
 */
function staticCandidates(pathname: string): string[] {
  const clean = pathname.split("#")[0].split("?")[0];
  if (clean.endsWith("/")) return [clean + "index.html", clean + ".html"];
  return [clean, clean + ".html", clean + "/index.html"];
}
// Startup inventory: how many pre-rendered pages this instance can serve from
// disk. Printed into .run/server.log on every publish, so "is the live server
// actually answering from files?" is answerable without probing from outside.
// A shortfall is not fatal here — `bun run build` fails earlier (see
// scripts/verify-prerender.mjs) if a required route was not baked — but it makes
// an incomplete build visible at startup.
const baked = new Bun.Glob("**/index.html").scanSync(CLIENT_DIR);
let bakedCount = 0;
for (const _ of baked) bakedCount++;
// Free PORT regardless of which user owns the current listener. lsof runs under
// sudo so it can see (and the kill can signal) a process owned by another user;
// the loop waits for the socket to actually release before we bind.
const freePort =
  `for _ in $(seq 1 25); do ` +
  `pids=$(lsof -t -iTCP:${String(PORT)} -sTCP:LISTEN 2>/dev/null || true); ` +
  `if [ -z "$pids" ]; then exit 0; fi; ` +
  `kill $pids 2>/dev/null || true; sleep 0.2; ` +
  `done`;
// Take over the port, re-freeing and retrying if another publish grabbed it in the
// gap between freeing and binding (last publish wins). Bun.serve throws EADDRINUSE
// synchronously, so without this a raced publish would die while the shell already
// reported success.
for (let attempt = 1; ; attempt++) {
  await Bun.$`sudo sh -c ${freePort}`.quiet().nothrow();
  try {
    Bun.serve({
      port: PORT,
      hostname: HOST,
      async fetch(req) {
        const { pathname } = new URL(req.url);
        for (const candidate of staticCandidates(pathname)) {
          const file = Bun.file(CLIENT_DIR + candidate);
          if (await file.exists()) return new Response(file);
        }
        return (
          handler as { fetch: (r: Request) => Response | Promise<Response> }
        ).fetch(req);
      },
    });
    break;
  } catch (err) {
    if (attempt >= 10) throw err;
    await Bun.sleep(200);
  }
}
console.log(
  `team-site serving on http://${HOST}:${String(PORT)} — ${String(bakedCount)} pre-rendered pages served from dist/client, SSR only for dynamic paths`,
);
