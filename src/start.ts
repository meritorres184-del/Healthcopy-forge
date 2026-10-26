// Global request middleware — the site's only root-level, pre-router hook.
//
// TanStack Start auto-detects this file (src/start.ts) and imports `startInstance`
// from it; the export name is load-bearing (the generated route tree reads its
// type, and the server handler imports it at request time). Nothing else about the
// app changes: options not set here keep their framework defaults.
//
// WHAT RUNS HERE: the bare-root sales-slug 301 guard. A JVZoo listing whose Sales
// Page URL field lost the /sales/ prefix (/healthy-grocery) would otherwise fall
// through to the router, match nothing and answer the 404 page — which a reviewer
// records as "Sales Page unreachable". This middleware answers the 301 before the
// router (and before its not-found handler) ever sees the request, so the 40
// mapped slugs land on their live page while every real route and every unknown
// path behaves exactly as before. The map and the rationale live in
// src/lib/rootSalesRedirect.ts.
import { createCsrfMiddleware, createMiddleware, createStart } from "@tanstack/react-start";
import { rootSalesRedirectTarget } from "./lib/rootSalesRedirect";

// Server functions are same-origin RPC endpoints and must stay CSRF-protected.
// The framework applies this same filter by default when a start instance declares
// no CSRF middleware; declaring it keeps that protection explicit and keeps the
// "not protected by the CSRF middleware" warning out of the build and server logs.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

const bareRootSalesRedirect = createMiddleware({ type: "request" }).server(
  ({ pathname, next }) => {
    const location = rootSalesRedirectTarget(pathname);
    if (location) {
      // Absolute-path Location, 301: the URL a listing carries is permanently the
      // canonical /sales/<slug> page, so search engines and reviewers both follow
      // it there. An empty body — nothing to render, nothing to slow the redirect.
      return new Response(null, {
        status: 301,
        headers: { location },
      });
    }
    return next();
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, bareRootSalesRedirect],
}));
