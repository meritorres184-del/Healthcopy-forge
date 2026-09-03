import { sql } from "../db";
import { migrate } from "./migrate";

/**
 * Seed script. Runs migrations first, then inserts the real 7 article packs
 * (owner-defined). Idempotent: packs are keyed on their unique `slug` with
 * `on conflict (slug) do nothing`, so re-running never duplicates rows.
 *
 * Run standalone with:  bun run db:seed
 */

interface SeedPack {
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  category: string;
  comingSoon: boolean;
  includes: string[];
}

const packs: SeedPack[] = [
  {
    slug: "nutrition-everyday-wellness",
    title: "Article Pack 1: Nutrition & Everyday Wellness",
    description:
      "Want to build your nutrition content without starting from zero? This pack gives you a ready-to-customize foundation of SEO-written PLR content covering important nutrition and everyday wellness topics.",
    priceCents: 4700,
    category: "Nutrition",
    comingSoon: false,
    includes: [
      "15 SEO-written articles, ~5,000 words each (~75,000 words)",
      "Email swipes & sequences",
      "Social media posts",
      "Lead magnet content",
      "PLR license",
      "Health & wellness disclaimers",
      "Bookcover & images",
    ],
  },
  {
    slug: "supplements-nutritional-support",
    title: "Article Pack 2: Supplements & Nutritional Support",
    description:
      "Want to create supplement content without doing all the research yourself? This pack gives you a ready-made foundation for building educational supplement and nutritional-support content.",
    priceCents: 4700,
    category: "Supplements",
    comingSoon: false,
    includes: [
      "15 SEO-written articles, ~5,000 words each (~75,000 words)",
      "Email swipes & sequences",
      "Social media posts",
      "Lead magnet content",
      "PLR license",
      "Health & wellness disclaimers",
      "Bookcover & images",
    ],
  },
  {
    slug: "fitness-exercise",
    title: "Article Pack 3: Fitness & Exercise",
    description:
      "Ready to build more than a few random fitness posts? This pack gives you a head start — content covering multiple areas of everyday fitness so you can customize it for your wellness audience.",
    priceCents: 4700,
    category: "Fitness",
    comingSoon: false,
    includes: [
      "15 SEO-written articles, ~5,000 words each (~75,000 words)",
      "Email swipes & sequences",
      "Social media posts",
      "Lead magnet content",
      "PLR license",
      "Health & wellness disclaimers",
      "Bookcover & images",
    ],
  },
  {
    slug: "sleep-recovery",
    title: "Article Pack 4: Sleep & Recovery",
    description:
      "Want to expand your wellness content into sleep and recovery? This pack gives you a ready-to-customize content foundation that helps you expand into the sleep and recovery niche.",
    priceCents: 4700,
    category: "Sleep & Recovery",
    comingSoon: false,
    includes: [
      "15 SEO-written articles, ~5,000 words each (~75,000 words)",
      "Email swipes & sequences",
      "Social media posts",
      "Lead magnet content",
      "PLR license",
      "Health & wellness disclaimers",
      "Bookcover & images",
    ],
  },
  {
    slug: "stress-management-mind-body-wellness",
    title: "Article Pack 5: Stress Management & Mind-Body Wellness",
    description:
      "Give your audience more than another “just relax” article. This pack gives you a starting point — customizable content covering multiple areas of stress management and mind-body wellness.",
    priceCents: 4700,
    category: "Stress & Mind-Body",
    comingSoon: false,
    includes: [
      "15 SEO-written articles, ~5,000 words each (~75,000 words)",
      "Email swipes & sequences",
      "Social media posts",
      "Lead magnet content",
      "PLR license",
      "Health & wellness disclaimers",
      "Bookcover & images",
    ],
  },
  {
    slug: "healthy-aging-lifestyle",
    title: "Article Pack 6: Healthy Aging & Lifestyle",
    description:
      "Want to reach the growing healthy-aging audience? This pack gives you comprehensive content covering multiple aspects of wellness and healthy aging so you don’t have to build this entire content category yourself.",
    priceCents: 4700,
    category: "Healthy Aging",
    comingSoon: false,
    includes: [
      "14 in-depth articles, ~5,000 words each (~70,000 words)",
      "Email swipes & sequences",
      "Social media posts",
      "Lead magnet content",
      "PLR license",
      "Health & wellness disclaimers",
      "Bookcover & images",
    ],
  },
  {
    slug: "natural-holistic-wellness",
    title: "Article Pack 7: Natural & Holistic Wellness",
    description:
      "Want to expand into natural and holistic wellness? This pack gives you a customizable content foundation covering a variety of natural and holistic wellness topics so you can start building this part of your business faster.",
    priceCents: 4700,
    category: "Natural & Holistic",
    comingSoon: false,
    includes: [
      "12 in-depth articles + FAQ section (~101,000 words)",
      "Email swipes & sequences",
      "Social media posts",
      "Lead magnet content",
      "PLR license",
      "Health & wellness disclaimers",
      "Bookcover & images",
    ],
  },
];

// Slugs that shipped with the original placeholder seed. Replacing the
// placeholder catalog with the real 7-pack lineup, so any row left over from
// the old seed is removed (a re-run of this seed is then idempotent).
const LEGACY_PLACEHOLDER_SLUGS = [
  "probiotics-content-pack",
  "nootropics-brain-health-bundle",
  "collagen-skin-health-pack",
  "pre-workout-energy-content-kit",
  "recovery-muscle-growth-bundle",
  "adaptogens-herbal-wellness-pack",
];

export async function seed() {
  await migrate();
  const db = sql();

  if (LEGACY_PLACEHOLDER_SLUGS.length > 0) {
    const placeholders = LEGACY_PLACEHOLDER_SLUGS.map(
      (_, i) => `$${i + 1}`,
    ).join(", ");
    await db.query(
      `delete from content_packs where slug in (${placeholders})`,
      LEGACY_PLACEHOLDER_SLUGS,
    );
  }

  for (const p of packs) {
    await db`
      insert into content_packs
        (slug, title, description, price_cents, category, coming_soon, includes)
      values
        (${p.slug}, ${p.title}, ${p.description}, ${p.priceCents}, ${p.category}, ${p.comingSoon}, ${p.includes})
      on conflict (slug) do nothing
    `;
  }

  const { count } = (
    await db`select count(*)::int as count from content_packs`
  )[0];
  console.log(`seed complete: ${count} content packs in database`);
}

if (import.meta.main) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}