import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

// Canonical production domain. The site is served ONLY at
// https://www.healthcopyforge.com (the bare apex is not served), so every
// absolute SEO URL must use the www host.
const SITE_URL = "https://www.healthcopyforge.com";

// Per-route title/description pairs. These mirror the per-route head()
// values added in SEO P0 item 1 (PR #7), so og:/twitter: tags stay
// consistent with each page's <title> and meta description.
const ROUTE_SEO: Record<string, { title: string; description: string }> = {
  "/": {
    title: "SEO Health & Wellness PLR Content Packs | HealthCopy Forge",
    description:
      "SEO-written health & wellness PLR packs for coaches: articles, emails, social posts & lead magnets. Original in-house content. $47/pack.",
  },
  "/packs": {
    title: "Health & Wellness PLR Packs: 7 Topics | HealthCopy Forge",
    description:
      "Browse 7 SEO-written health PLR packs: nutrition, supplements, fitness, sleep, stress, aging & holistic wellness. $47 each or any 4 for $97.",
  },
  "/library": {
    title: "Member Content Library | HealthCopy Forge",
    description:
      "Members: browse every HealthCopy Forge PLR pack and download articles, emails, social posts & lead magnets in any format.",
  },
  "/pricing": {
    title: "Pricing: $47 PLR Packs or $47–$97/mo Membership",
    description:
      "One pack $47, any 4 for $97, or monthly membership $47–$97 with new SEO health articles, ebooks & courses. Cancel anytime.",
  },
  "/membership": {
    title: "Health PLR Membership: New Content Monthly",
    description:
      "Get new SEO-written health & wellness PLR monthly: articles, ebooks, courses, journals & trackers. Essentials $47, Pro $97.",
  },
  "/affiliates": {
    title: "Affiliates: Earn 50% Promoting Health & Wellness PLR",
    description:
      "Promote SEO-written health & wellness PLR: 50% per pack, 30% recurring on memberships, 90-day cookie. Done-for-you promo kit.",
  },
};

const DEFAULT_SEO = ROUTE_SEO["/"];

// Renders the per-route canonical link plus Open Graph / Twitter tags.
// The pathname comes from live router state, so the canonical always
// reflects the current route — never a hardcoded single URL. Pack detail
// pages (/library/<slug>) have no static head() entry, so their OG tags
// fall back to the pack title/description from the route loader data,
// then to the site default.
function SeoHead() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const matches = useRouterState({ select: (s) => s.matches });
  const normalized =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;
  const canonical = SITE_URL + normalized;
  let seo = ROUTE_SEO[normalized];
  if (!seo) {
    const leaf = matches[matches.length - 1];
    const data = leaf ? (leaf.loaderData as unknown) : null;
    if (
      data &&
      typeof data === "object" &&
      typeof (data as { title?: unknown }).title === "string" &&
      typeof (data as { description?: unknown }).description === "string"
    ) {
      const pack = data as { title: string; description: string };
      seo = {
        title: pack.title + " | HealthCopy Forge",
        description: pack.description,
      };
    } else {
      seo = DEFAULT_SEO;
    }
  }
  return (
    <>
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
    </>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HealthCopy Forge — Done-for-You Health PLR Content Packs" },
      {
        name: "description",
        content:
          "Ready-to-rebrand health PLR content packs for affiliate marketers. Articles, email sequences, social media posts, and lead magnets — skip the writing, grow your audience.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-800">404</h1>
        <p className="text-gray-600">Page not found</p>
        <Link
          to="/"
          className="mt-4 inline-block text-emerald-600 hover:text-emerald-700 underline"
        >
          Back to home
        </Link>
      </div>
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Header />
      <Outlet />
      <Footer />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <HeadContent />
        <SeoHead />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh bg-white text-gray-900 antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
            H
          </span>
          HealthCopy Forge
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <Link
            to="/packs"
            className="hover:text-emerald-600 transition-colors"
          >
            Packs
          </Link>
          <Link
            to="/pricing"
            className="hover:text-emerald-600 transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/library"
            className="hover:text-emerald-600 transition-colors"
          >
            Library
          </Link>
          <Link
            to="/affiliates"
            className="hover:text-emerald-600 transition-colors"
          >
            Affiliates
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              HealthCopy Forge
            </h4>
            <p className="text-sm text-gray-500">
              Done-for-you PLR content packs for health-niche affiliate
              marketers.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-emerald-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/packs"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Content Packs
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/library"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Library
                </Link>
              </li>
              <li>
                <Link
                  to="/affiliates"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Affiliates
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors">
                  support@healthcopyforge.com
                </a>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} HealthCopy Forge. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
