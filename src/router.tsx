import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { installFullPageLinkNav } from "./lib/fullPageLinks";
// Every internal link is a full-page load (see src/lib/fullPageLinks.ts).
//
// This runs as soon as the client bundle is evaluated — before React hydrates,
// so before the router can attach any click interception — and is a no-op on
// the server (it checks for `document`). Without it, a plain left-click on a
// pack link could be swallowed by the client router and do nothing, which is
// the exact defect JVZoo compliance reproduced.
installFullPageLinkNav();
export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: () => <p>Not found</p>,
  });
}
