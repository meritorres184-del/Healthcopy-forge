// The BARE-ROOT form of a sales page URL -> its canonical /sales/<slug> page.
//
// WHY THIS EXISTS (2026-10-26): a JVZoo reviewer opens whatever URL a listing's
// "Sales Page URL" field carries. If that field is missing the /sales/ prefix
// (https://www.healthcopyforge.com/healthy-grocery instead of
// .../sales/healthy-grocery) there is no route for it, so the request answers the
// site's 404 page — which a reviewer reads as "Sales Page unreachable", the exact
// rejection we have been fighting. The /sales/<slug> alias layer in
// src/routes/sales.$slug.tsx cannot cover it: a bare-root URL is a different
// route, not a different slug.
//
// HOW IT IS SERVED: request-time 301s from the global request middleware in
// src/start.ts, i.e. before the router (and therefore before its not-found
// handler) ever sees the request. Nothing here is pre-rendered: a baked page
// answers 200, and this must answer 301.
//
// THE MAP IS THE ENTIRE GUARD. Only the 40 strings below redirect. A miss returns
// null and the request continues untouched, so every real root route
// (/, /packs, /pricing, /library, /affiliates, /ebooks, /join, /membership,
// /sales, /affiliate-kit, /kit-delivery, ...) and every unknown path keep exactly
// the behaviour they have today.
//
// Keep this map a mirror of SALES_SLUG_ALIASES in src/routes/sales.$slug.tsx: the
// same 20 wired course slugs and the same 20 aliases, one line each, with the
// JVZoo product id for the ones that have a live listing.
export const ROOT_SALES_REDIRECTS: Record<string, string> = {
  // ── The 20 wired course slugs: the bare-root form of a live page ────────────
  // Every one of these is a real /sales/<slug> page, so the bare-root form must
  // land there (the owner pasted /healthy-grocery this way on 2026-10-26).
  "active-living": "/sales/active-living", // JVZoo 458158
  "balance-stability": "/sales/balance-stability", // JVZoo 458450
  "balanced-eating": "/sales/balanced-eating", // JVZoo 458983
  "bodyweight-exercise": "/sales/bodyweight-exercise", // JVZoo 459045
  "busy-lifestyle": "/sales/busy-lifestyle", // JVZoo 459047
  "cardiovascular-fitness": "/sales/cardiovascular-fitness", // JVZoo 459049
  "eating-budget": "/sales/eating-budget", // JVZoo 459101
  "exercise-motivation": "/sales/exercise-motivation", // JVZoo 459117
  "exercise-recovery": "/sales/exercise-recovery", // JVZoo 459119
  "fitness-after-50": "/sales/fitness-after-50", // JVZoo 459123
  "food-labels": "/sales/food-labels", // JVZoo 459125
  "fruits-vegetables": "/sales/fruits-vegetables", // JVZoo 459127
  "functional-fitness": "/sales/functional-fitness", // JVZoo 459129
  "healthy-grocery": "/sales/healthy-grocery", // JVZoo 459131
  "healthy-pantry": "/sales/healthy-pantry", // JVZoo 459135
  "healthy-snacking": "/sales/healthy-snacking", // JVZoo 459139
  "home-fitness-beginners": "/sales/home-fitness-beginners", // JVZoo 459143
  "home-workout-space": "/sales/home-workout-space", // JVZoo 459169
  "low-impact-fitness": "/sales/low-impact-fitness", // JVZoo 459171
  "meal-planning-budget": "/sales/meal-planning-budget", // JVZoo 459173

  // ── Listing-title slugs: the URL derived from the listing TITLE ─────────────
  // Same set as the /sales/ alias layer: the kit slug is not the listing title,
  // so a title-derived URL must still reach the real page.
  "active-living-for-busy-people": "/sales/active-living", // JVZoo 458158
  "adding-more-fruits-and-vegetables-to-your-diet": "/sales/fruits-vegetables", // JVZoo 459127
  "balance-and-stability-training": "/sales/balance-stability", // JVZoo 458450
  "bodyweight-exercise-basics": "/sales/bodyweight-exercise", // JVZoo 459045
  "building-a-balanced-eating-routine": "/sales/balanced-eating", // JVZoo 458983
  "building-a-healthy-pantry": "/sales/healthy-pantry", // JVZoo 459135
  "cardiovascular-fitness-basics": "/sales/cardiovascular-fitness", // JVZoo 459049
  "creating-your-own-home-workout-space": "/sales/home-workout-space", // JVZoo 459169
  "eating-well-on-a-budget": "/sales/eating-budget", // JVZoo 459101
  "exercise-motivation-and-consistency": "/sales/exercise-motivation", // JVZoo 459117
  "exercise-recovery-fundamentals": "/sales/exercise-recovery", // JVZoo 459119
  "functional-fitness-for-everyday-life": "/sales/functional-fitness", // JVZoo 459129
  "healthy-grocery-shopping": "/sales/healthy-grocery", // JVZoo 459131
  "home-fitness-for-beginners": "/sales/home-fitness-beginners", // JVZoo 459143
  "meal-planning-for-beginners": "/sales/meal-planning-budget", // JVZoo 459173
  "nutrition-for-busy-lifestyles": "/sales/busy-lifestyle", // JVZoo 459047
  "understanding-food-labels": "/sales/food-labels", // JVZoo 459125

  // ── Misspelled listing URLs (the ones a JVZoo reviewer already follows) ─────
  "bodyweight-exercises": "/sales/bodyweight-exercise", // plural
  "fiteness-after-50": "/sales/fitness-after-50", // missing "s"
  "execise-recovery": "/sales/exercise-recovery", // missing "r"
};

/**
 * The 301 target for a request pathname, or null to let the request continue.
 *
 * Only the 40 keys of ROOT_SALES_REDIRECTS can match: the pathname is reduced to a
 * single bare segment ("/healthy-grocery" -> "healthy-grocery") and looked up
 * verbatim, so a real route (/packs, /pricing, /library, /sales, ...) or an
 * unknown path can never be redirected by this guard.
 *
 * One trailing slash is normalised first: a listing field pasted as
 * ".../healthy-grocery/" is the same page, and no real route exists as "/x/", so
 * the normalisation cannot shadow one.
 */
export function rootSalesRedirectTarget(pathname: string): string | null {
  const path =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  if (!path.startsWith("/")) return null;
  const segment = path.slice(1);
  // A nested path (/library/healthy-grocery) is not a bare-root slug.
  if (segment === "" || segment.includes("/")) return null;
  return Object.prototype.hasOwnProperty.call(ROOT_SALES_REDIRECTS, segment)
    ? ROOT_SALES_REDIRECTS[segment]!
    : null;
}
