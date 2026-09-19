// Direct-click navigation fix (JVZoo compliance, 2026-09-19).
//
// Symptom the reviewer reproduced: opening a pack link in a new tab works, but a
// plain left-click on it does nothing at all — the URL never changes.
//
// Every page of this site is pre-rendered to static HTML at build time and is
// served straight from disk (see vite.config.ts prerender + scripts/
// verify-prerender.mjs). Client-side SPA navigation buys us nothing here, and
// the framework's click interception can fail on these routes and swallow the
// click. This installs a document-level CAPTURE-phase listener, so it runs
// before any other click handler, and turns every internal link into an
// ordinary full-page load — exactly what a reviewer (and a visitor) expects.
//
// Deliberately narrow: only same-origin, root-relative anchors, only plain left
// clicks. Modifier-clicks (ctrl/cmd/shift/alt), middle-clicks, target="_blank"
// links, download links and in-page "#fragment" links keep their native
// behaviour.
const INSTALL_FLAG = "__hcfFullPageLinksInstalled";

export function installFullPageLinkNav(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const store = window as unknown as Record<string, unknown>;
  if (store[INSTALL_FLAG]) return;
  store[INSTALL_FLAG] = true;

  document.addEventListener(
    "click",
    (event) => {
      // Shift/ctrl/cmd/alt clicks and middle-clicks mean "open in a new tab" —
      // leave those to the browser.
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const target = event.target as Element | null;
      if (!target || typeof target.closest !== "function") return;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      // _blank (and any other named/foreign window) stays native.
      const anchorTarget = (anchor.getAttribute("target") ?? "").toLowerCase();
      if (anchorTarget !== "" && anchorTarget !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href") ?? "";
      // Internal, root-relative only. "#..." is handled by the check below;
      // "//host/path" is protocol-relative and therefore external.
      if (!href.startsWith("/") || href.startsWith("//")) return;

      // Take the click over completely: stop any other handler (including the
      // framework's client-side router) from seeing it, so nothing can
      // preventDefault the navigation or cancel it with a history pushState.
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(href);
    },
    true, // capture phase — runs before every bubble-phase handler
  );
}
