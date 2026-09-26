// Ebook cover images — ONE map, keyed by ebook slug.
//
// Each file was copied out of that ebook's release ZIP (`Bookcover.jpg`, verified
// by sha256 against the ZIP entry AND against the owner's original cover file in
// _incoming/ebook-covers-raw/, 2026-09-22) and renamed to the clean, predictable
// `/covers/ebook-<slug>.jpg` — the owner's original cover filenames have messy
// spacing, casing and `.JPEG` extensions that are unsafe in a URL.
//
// Mirror of src/lib/packCovers.ts: adding an ebook means adding one line here, and
// a slug with no cover renders no image rather than someone else's cover.
export const EBOOK_COVERS: Record<string, string> = {
  "balanced-nutrition": "/covers/ebook-balanced-nutrition.jpg",
  "brain-habits": "/covers/ebook-brain-habits.jpg",
  "gut-health": "/covers/ebook-gut-health.jpg",
  "healthy-bones": "/covers/ebook-healthy-bones.jpg",
  "healthy-feet": "/covers/ebook-healthy-feet.jpg",
  "hair-scalp": "/covers/ebook-hair-scalp.jpg",
  "heart-habits": "/covers/ebook-heart-habits.jpg",
  "hydration": "/covers/ebook-hydration.jpg",
  "joint-fitness": "/covers/ebook-joint-fitness.jpg",
  "posture": "/covers/ebook-posture.jpg",
  "protein-aging": "/covers/ebook-protein-aging.jpg",
};

/** Cover path for an ebook slug, or undefined when that ebook has no cover file. */
export function ebookCover(slug: string): string | undefined {
  return EBOOK_COVERS[slug];
}
