// ─── Pending article packs — pages that exist BEFORE the content does ────────
//
// Added 2026-11-02. The owner is submitting three new article packs to JVZoo this
// week and needs a real sales page URL for each listing. The written content
// itself does not exist yet (she sends the files Sunday), so these three entries
// are deliberately THIN: the owner's exact title, her descriptive line where she
// gave one, and the contents every HealthCopy Forge article pack carries by
// construction. Nothing here states a number of articles, a word count, a chapter
// or module list, or anything "verified against the release ZIP" — none of that
// exists yet, so none of it may be claimed.
//
// WHY THEY ARE UNLISTED (and what unlists them):
//   * a shopper must never land on a product page with no way to buy it, so these
//     three pages are kept out of the /packs grid, the /library hub, the header /
//     footer nav and public/sitemap.xml — exactly like /free-sample-article and
//     /affiliate-kit;
//   * each one bakes with `noindex, nofollow` (see the head() in
//     src/routes/library.$slug.tsx) so it never lands in search results;
//   * JVZoo's reviewer can still open the URL directly, which is the whole point.
//   * they are NOT rows in the content_packs table and NOT in src/db/seed.ts, so
//     no listing surface can pick them up by accident.
// WHAT UNLISTS THEM: the owner's real content (which arrives with its references
// block) and a JVZoo product ID pasted into src/jvzoo.ts. When both exist, the
// pack is promoted to a normal row in src/db/seed.ts and its slug moves into the
// listed set — at that point delete its entry here and add it there.
//
// The page itself is the ordinary pack page (src/routes/library.$slug.tsx), the
// same component family as every live pack. With no JVZoo ID in src/jvzoo.ts,
// liveJvzooProduct() returns undefined and the page renders the existing
// not-yet-listed state — the $47 price and no buy button, no dead href, no JVZoo
// anchor and no Stripe link.

export interface PendingPack {
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  comingSoon: boolean;
  includes: string[];
  /** Always true: a pending pack is never listed while it has no content/ID. */
  unlisted: true;
}

// The approved verbatim origin claim (owner policy — same words as every live
// pack's description). Kept in one place so the three pages cannot drift.
const ORIGIN_CLAIM =
  "**100% Original, In-House Written Content.** Every word in this pack — and in every HealthCopy Forge pack — is originally written by us. Nothing is reused, resold, or repurposed from any other PLR store. You are getting fresh, unique content that was created specifically for HealthCopy Forge, so your audience sees something they won't find anywhere else.";

// What EVERY HealthCopy Forge article pack contains, by construction. No counts,
// no word counts, no chapter names — those do not exist for these packs yet.
const STANDARD_CONTENTS =
  "**Every Article Pack Includes:**\n* SEO-written health and wellness articles on the pack's topic\n* The Private Label Rights (PLR) License — edit, rebrand and publish as your own\n* A medical disclaimer you can customize for your own site\n* A ready-to-customize lead magnet\n* Email swipes\n* Social media posts\n* The pack's bookcover image";

// Owner policy (2026-10-27): every NEW written piece ships with a references
// block listing the real sources used to create it. That is a standing promise
// about how the pack is written, so it can be stated before the files land.
const REFERENCES_NOTE =
  "Every new HealthCopy Forge pack also ships with a references block listing the real sources used to create it.";

const CUSTOMISE_NOTE =
  "The content is written with search in mind and is ready to customize, brand and promote: add your own voice, images, internal links, recommendations and calls to action before you publish.";

export const PENDING_PACKS: Record<string, PendingPack> = {
  // ── Owner's title list, 2026-11-02. No "Part N" numbering and no collection
  // line — she asked explicitly for neither, so neither appears anywhere.
  "heart-health-cardiovascular-2026-2027": {
    // 2026-11-02 — UNLISTED: the content files have not arrived and there is no
    // JVZoo ID. It unlists when the owner's real content lands and an ID is pasted
    // into src/jvzoo.ts (then promote it to a content_packs row in src/db/seed.ts).
    slug: "heart-health-cardiovascular-2026-2027",
    title: "Heart Health & Cardiovascular Disease in 2026–2027",
    // The first two blocks are the owner's own words: her title, then her
    // descriptive line for this product, verbatim.
    description:
      "\n\n**Heart Health & Cardiovascular Disease in 2026–2027**\n\n" +
      "The Complete Guide to Heart Disease Prevention, High Blood Pressure, Cholesterol, Stroke Risk, Cardiovascular Nutrition, Exercise, and Emerging Heart Health Research\n\n" +
      "A done-for-you HealthCopy Forge article pack on heart health and cardiovascular disease, for health and wellness publishers who want to cover prevention, high blood pressure, cholesterol, stroke risk, cardiovascular nutrition, exercise and emerging heart health research without writing the content themselves.\n\n" +
      ORIGIN_CLAIM +
      "\n\n" +
      STANDARD_CONTENTS +
      "\n\n" +
      CUSTOMISE_NOTE +
      "\n\n" +
      REFERENCES_NOTE +
      "\n",
    price: 47,
    category: "Heart Health",
    comingSoon: false,
    includes: [
      "SEO-written articles on the pack's topic",
      "Private Label Rights (PLR) license",
      "Medical disclaimer",
      "Lead magnet",
      "Email swipes",
      "Social media posts",
      "Bookcover image",
    ],
    unlisted: true,
  },

  "preventive-health-checklist": {
    // 2026-11-02 — UNLISTED: the content files have not arrived and there is no
    // JVZoo ID. It unlists when the owner's real content lands and an ID is pasted
    // into src/jvzoo.ts (then promote it to a content_packs row in src/db/seed.ts).
    slug: "preventive-health-checklist",
    title: "The Preventive Health & Disease Prevention Checklist",
    description:
      "\n\n**The Preventive Health & Disease Prevention Checklist**\n\n" +
      "A done-for-you HealthCopy Forge article pack on preventive health and disease prevention, for health and wellness publishers who want to publish prevention-focused content and practical checklists for their audience without writing it from scratch.\n\n" +
      ORIGIN_CLAIM +
      "\n\n" +
      STANDARD_CONTENTS +
      "\n\n" +
      CUSTOMISE_NOTE +
      "\n\n" +
      REFERENCES_NOTE +
      "\n",
    price: 47,
    category: "Preventive Health",
    comingSoon: false,
    includes: [
      "SEO-written articles on the pack's topic",
      "Private Label Rights (PLR) license",
      "Medical disclaimer",
      "Lead magnet",
      "Email swipes",
      "Social media posts",
      "Bookcover image",
    ],
    unlisted: true,
  },

  "brain-health-neurological": {
    // 2026-11-02 — UNLISTED: the content files have not arrived and there is no
    // JVZoo ID. It unlists when the owner's real content lands and an ID is pasted
    // into src/jvzoo.ts (then promote it to a content_packs row in src/db/seed.ts).
    slug: "brain-health-neurological",
    title: "Brain Health & Neurological Diseases",
    description:
      "\n\n**Brain Health & Neurological Diseases**\n\n" +
      "A done-for-you HealthCopy Forge article pack on brain health and neurological disease, for health and wellness publishers who want to cover this topic for their audience without writing the content from scratch.\n\n" +
      ORIGIN_CLAIM +
      "\n\n" +
      STANDARD_CONTENTS +
      "\n\n" +
      CUSTOMISE_NOTE +
      "\n\n" +
      REFERENCES_NOTE +
      "\n",
    price: 47,
    category: "Brain Health",
    comingSoon: false,
    includes: [
      "SEO-written articles on the pack's topic",
      "Private Label Rights (PLR) license",
      "Medical disclaimer",
      "Lead magnet",
      "Email swipes",
      "Social media posts",
      "Bookcover image",
    ],
    unlisted: true,
  },
};

/** The pending pack for a slug, or undefined when the slug is not one of them. */
export function pendingPack(slug: string): PendingPack | undefined {
  return PENDING_PACKS[slug];
}

/** Slugs of the three pending packs, in the order they are listed above. */
export const PENDING_PACK_SLUGS = Object.keys(PENDING_PACKS);
