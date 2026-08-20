import { sql } from "../db";
import { migrate } from "./migrate";

/**
 * Seed script. Runs migrations first, then inserts the 6 placeholder content
 * packs. Idempotent: packs are keyed on their unique `slug` with
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
    slug: "probiotics-content-pack",
    title: "The Ultimate Probiotics Content Pack",
    description:
      "Complete PLR kit covering gut health, probiotic strains, and supplement guides. Perfect for supplement affiliate sites.",
    priceCents: 4700,
    category: "Supplements",
    comingSoon: false,
    includes: [
      "5 SEO-optimized articles",
      "7-day email sequence",
      "10 social media posts",
      "Probiotic checklist lead magnet",
    ],
  },
  {
    slug: "nootropics-brain-health-bundle",
    title: "Nootropics & Brain Health Bundle",
    description:
      "Cognitive enhancement and brain health content for the booming nootropics niche. Ready to rebrand in minutes.",
    priceCents: 6700,
    category: "Supplements",
    comingSoon: false,
    includes: [
      "6 long-form articles",
      "5-day nurture sequence",
      "12 social media templates",
      "Brain-boosting foods guide (PDF)",
    ],
  },
  {
    slug: "collagen-skin-health-pack",
    title: "Collagen & Skin Health Pack",
    description:
      "Beauty-from-within content focused on collagen supplements, skin health, and anti-aging nutrition.",
    priceCents: 5700,
    category: "Supplements",
    comingSoon: true,
    includes: [
      "4 articles",
      "Email welcome series",
      "8 social posts",
      "Glow-up checklist lead magnet",
    ],
  },
  {
    slug: "pre-workout-energy-content-kit",
    title: "Pre-Workout & Energy Content Kit",
    description:
      "Everything you need to promote pre-workout supplements, energy boosters, and workout nutrition to fitness audiences.",
    priceCents: 3700,
    category: "Fitness",
    comingSoon: false,
    includes: [
      "4 articles on pre-workout nutrition",
      "5-email launch sequence",
      "10 Instagram-ready posts",
      "Pre-workout timing guide",
    ],
  },
  {
    slug: "recovery-muscle-growth-bundle",
    title: "Recovery & Muscle Growth Bundle",
    description:
      "Post-workout recovery, protein timing, and muscle-building content tailored for the fitness supplement market.",
    priceCents: 7700,
    category: "Fitness",
    comingSoon: true,
    includes: [
      "6 in-depth articles",
      "7-day drip sequence",
      "15 social media templates",
      "Recovery protocol lead magnet",
    ],
  },
  {
    slug: "adaptogens-herbal-wellness-pack",
    title: "Adaptogens & Herbal Wellness Pack",
    description:
      "Ride the adaptogen trend with content on ashwagandha, rhodiola, reishi, and other herbal supplements — all PLR-ready.",
    priceCents: 8700,
    category: "Natural Health",
    comingSoon: false,
    includes: [
      "7 articles on adaptogenic herbs",
      "10-email educational sequence",
      "20 social media posts",
      "Herbal wellness starter guide",
    ],
  },
];

export async function seed() {
  await migrate();
  const db = sql();

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
