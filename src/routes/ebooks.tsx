import { createFileRoute, Outlet } from "@tanstack/react-router";
// Layout route for the PLR ebook line. /ebooks renders the ebook hub
// (ebooks.index.tsx); /ebooks/$slug renders an individual ebook's sales page
// (ebooks.$slug.tsx). The <Outlet/> below is required so child routes render —
// without it the child silently never appears and the URL looks like it
// "matched the wrong page".
export const Route = createFileRoute("/ebooks")({
  component: EbooksLayout,
});
function EbooksLayout() {
  return <Outlet />;
}
