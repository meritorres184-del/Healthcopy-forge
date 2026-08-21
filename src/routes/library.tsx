import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout route for the member library. /library renders the pack grid
// (library.index.tsx); /library/$slug renders an individual pack's content
// page (library.$slug.tsx). The <Outlet/> below is required so child routes
// render.
export const Route = createFileRoute("/library")({
  component: LibraryLayout,
});

function LibraryLayout() {
  return <Outlet />;
}
