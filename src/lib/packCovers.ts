// Bookcover images — ONE map, keyed by pack slug.
//
// The cover file names follow the pack number (`/covers/pack-<n>.jpg`) because
// that is how the owner's cover JPEGs are named on disk. Packs 1–6 use the
// `-1` suffix their originals shipped with; packs 7–13 are plain `pack-<n>.jpg`.
//
// Before this map existed, `/packs` and each pack detail page derived the file name
// from a 1–8 table that defaulted to `pack-1-1.jpg` for anything it did not
// know — so a new pack silently showed pack 1's cover. Adding a pack now means
// adding one line here, and a slug with no cover renders no image instead of the
// wrong one.
//
// The three packs added 2026-11 (heart health, the preventive health checklist and
// brain health) have no pack number — the owner's 1–13 set is what carries numbers —
// so their covers are named from the slug instead: `pack-<slug>.jpg`. The files are
// the owner's own finished covers, copied byte-identical from the same JPGs that
// ship as Bookcover.jpg inside each release ZIP. They are shown on the three
// unlisted pages (`/library/<slug>`, see src/lib/pendingPacks.ts) and the build gate
// checks that each page carries its image and that the file is on disk.
export const PACK_COVERS: Record<string, string> = {
  "nutrition-everyday-wellness": "/covers/pack-1-1.jpg",
  "supplements-nutritional-support": "/covers/pack-2-1.jpg",
  "fitness-exercise": "/covers/pack-3-1.jpg",
  "sleep-recovery": "/covers/pack-4-1.jpg",
  "stress-management-mind-body-wellness": "/covers/pack-5-1.jpg",
  "healthy-aging-lifestyle": "/covers/pack-6-1.jpg",
  "natural-holistic-wellness": "/covers/pack-7.jpg",
  "product-reviews-buying-guides": "/covers/pack-8.jpg",
  "protein-shakes-protein-nutrition": "/covers/pack-9.jpg",
  "intermittent-fasting-time-restricted-eating": "/covers/pack-10.jpg",
  "health-coaching-functional-nutrition-glp-1-support": "/covers/pack-11.jpg",
  "functional-nutrition-glp-1-adaptation": "/covers/pack-12.jpg",
  "womens-longevity-biology-specific-care": "/covers/pack-13.jpg",
  // The three 2026-11 packs — unlisted until their JVZoo IDs arrive.
  "heart-health-cardiovascular-2026-2027":
    "/covers/pack-heart-health-cardiovascular-2026-2027.jpg",
  "preventive-health-checklist": "/covers/pack-preventive-health-checklist.jpg",
  "brain-health-neurological": "/covers/pack-brain-health-neurological.jpg",
};

/** Cover path for a pack slug, or undefined when that pack has no cover file. */
export function packCover(slug: string): string | undefined {
  return PACK_COVERS[slug];
}
