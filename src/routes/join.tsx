import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout route for the membership flow. /join renders the tier comparison
// (join.index.tsx); /join/$tier renders the per-tier confirmation page
// (join.$tier.tsx). The <Outlet/> below is required so child routes render.
export const Route = createFileRoute("/join")({
  component: JoinLayout,
});

function JoinLayout() {
  return <Outlet />;
}
