// ─── The new packs — real product pages for their JVZoo listings ─────────────
//
// Added 2026-11-02, rewritten 2026-11-06, two entries left as of 2026-11-13 (the
// third, heart-health-cardiovascular-2026-2027, is now LISTED — JVZoo 462871 — and
// lives as a normal content_packs row in src/db/seed.ts; the promotion below was
// followed exactly for it). These pages exist so the owner has a real product page
// URL to paste into each JVZoo listing. On 11-02 the packs were
// titles only; the content now exists, is packaged in three release ZIPs
// (/home/team/shared/release-zips) and is verified. So every entry below states
// what the pack ACTUALLY is: the real word counts, the real lead-magnet names and
// contents, and the real numbers of social posts, email swipes and sources.
// Nothing here is a placeholder, and nothing here describes a file that does not
// exist in the ZIP.
//
// WHERE THE FACTS COME FROM — content-packs/packs-2026-11-PAGE-FACTS.md (figures)
// and the three pack sections of kit-delivery/packs-2026-11-jvzoo-posting-kit.md
// (wording). Every figure was re-checked against the release ZIP on 2026-11-06:
// complete pack documents 9,140 / 4,506 / 5,883 words, articles 6,039 and 4,076,
// checklist 1,954, 10 social posts each, 7 / 3 / 3 email swipes, 8 / 8 / 5
// sources. If a number here and the ZIP ever disagree, the ZIP wins: fix this file.
//
// WHY THEY ARE STILL UNLISTED (and what unlists them):
//   * a shopper must never land on a product page with no way to buy it, so these
//     pages are kept out of the /packs grid, the /library hub, the header /
//     footer nav and public/sitemap.xml — exactly like /free-sample-article and
//     /affiliate-kit;
//   * each one bakes with `noindex, nofollow` (see the head() in
//     src/routes/library.$slug.tsx) so it never lands in search results;
//   * JVZoo's reviewer can still open the URL directly, which is the whole point;
//   * they are NOT rows in the content_packs table and NOT in src/db/seed.ts, so
//     no listing surface can pick them up by accident.
// WHAT UNLISTS THEM: a JVZoo product ID pasted into src/jvzoo.ts. liveJvzooProduct()
// then returns the listing and the page renders its canonical buy block. When that
// happens, promote the pack to a normal row in src/db/seed.ts, move its slug into
// the listed set, and delete its entry here.
//
// The page itself is the ordinary pack page (src/routes/library.$slug.tsx), the
// same component family as every live pack. While there is no JVZoo ID,
// liveJvzooProduct() returns undefined and the page renders the $47 price with no
// buy button — no dead href, no JVZoo anchor and no Stripe link — and, because the
// pack is unlisted, the contents list without the disabled member-download block.

export interface PendingPack {
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  comingSoon: boolean;
  includes: string[];
  /** What one ZIP actually delivers — rendered in place of the generic line. */
  delivery: string;
  /** Always true: a pending pack is never listed while it has no JVZoo ID. */
  unlisted: true;
}

// The approved verbatim origin claim (owner policy — same words as every live
// pack's description). Kept in one place so the two pages cannot drift.
const ORIGIN_CLAIM =
  "**100% Original, In-House Written Content.** Every word in this pack — and in every HealthCopy Forge pack — is originally written by us. Nothing is reused, resold, or repurposed from any other PLR store. You are getting fresh, unique content that was created specifically for HealthCopy Forge, so your audience sees something they won't find anywhere else.";

// The licence terms, in the owner's approved wording. Identical for all three
// packs: PLR rights are not transferable down.
const PLR_LICENSE_NOTE =
  "**PLR license.** The Private Label Rights License is included inside the ZIP and explains how the content may be used, edited, customized, branded and repurposed according to its terms. The license is not transferable: you can sell your own customized, finished products to end users, but the PLR rights themselves cannot be passed on, sublicensed or resold as PLR. No separate license purchase is needed, and no signature is required.";

// Owner policy (2026-10-27): every NEW written piece ships with a references block
// listing the real sources used to create it. Each pack's own source count is in
// its "What's inside" list below.
export const PENDING_PACKS: Record<string, PendingPack> = {
  // ── 1 of 2. Shaped differently from the other pack on purpose: there is NO long
  // article and NO separate lead magnet — the checklist document IS the product.
  // The page says so plainly rather than implying an article that is not there.
  "preventive-health-checklist": {
    // 2026-11-06 — UNLISTED: content verified in the release ZIP, no JVZoo ID yet.
    slug: "preventive-health-checklist",
    title: "The Preventive Health & Disease Prevention Checklist",
    description:
      "\n\n**The Preventive Health & Disease Prevention Checklist**\n\n" +
      "Your Personal Guide to Early Detection, Health Screenings, Chronic Disease Prevention & Lifelong Wellness\n\n" +
      "This pack is shaped differently from an ordinary article pack, and it is worth saying plainly: **the checklist document is the product.** There is no separate long article and no separate lead magnet — what you get is one complete, printable preventive health checklist, plus the social posts, the emails and the sources list you need to publish and promote it the same week.\n\n" +
      "It walks a reader through screening, risk factors, biomarkers, nutrition, movement, sleep, stress and environmental health, then turns all of it into a 30-day action plan and a progress tracker. You can hand it to your audience as a free download, or customize it and sell it as your own branded guide.\n\n" +
      "**What's inside this pack:**\n" +
      "* The checklist document itself — *The Preventive Health & Disease Prevention Checklist*, 1,954 words (4,506 words in the complete pack document, which also carries the social posts, the emails, the references and the license). Its sections are: a preventive health screening checklist · chronic disease risk assessment (personal, family, lifestyle and environmental risk factors) · essential health biomarkers to understand, with a review page · daily nutrition for disease prevention, with a nutrition checklist and goal page · lifestyle medicine and healthy habits (physical activity, restorative sleep, stress management and emotional wellness) with an improvement plan · environmental health checklist and action plan · a personalized preventive healthcare planner · five questions to ask your healthcare professional · a four-week, 30-day preventive health action plan · a personal prevention progress tracker · and a lifelong preventive health commitment page. It ships with fill-in lines, checkboxes and goal prompts throughout, so it works as a printable or as a branded PDF.\n" +
      "* 10 social media posts — ready-to-customize posts: preventive healthcare starts today · why early detection matters · know your chronic disease risk factors · preventive nutrition for lifelong wellness · sleep is essential for disease prevention · understand your health biomarkers · move more for long-term health · your environment matters to your health · a 30-day preventive health challenge · the future of preventive medicine in 2027\n" +
      "* 3 email swipes — three prewritten emails with [First Name] and [Your Name or Brand] placeholders and bracketed call-to-action buttons: the checklist offer with its full contents list · personalized prevention and what is changing in preventive medicine · and emerging preventive technologies (genetic risk assessment, biomarkers, wearables, artificial intelligence, precision nutrition and multi-cancer early detection research), each framed as something to discuss with a healthcare professional.\n" +
      "* 1 Sources and Further Reading list — eight full citations with working links, including the U.S. Preventive Services Task Force A and B recommendations, the National Heart, Lung, and Blood Institute, MedlinePlus, the A1C test guidance, the Physical Activity Guidelines for Americans, the National Sleep Foundation's sleep-duration paper and the Environmental Protection Agency's radon page.\n" +
      "* 1 medical disclaimer — a short, ready-to-use disclaimer stating that the guide is educational and informational only, does not replace professional medical advice, diagnosis or treatment, and that screening schedules, tests and vaccinations vary by individual circumstances. It is embedded in the pack document and also ships as a standalone Word file inside the ZIP.\n" +
      "* 1 Private Label Rights License — the terms are set out below. (Also embedded in the pack document.)\n" +
      "* Bookcover.jpg — the pack cover image, inside the ZIP\n\n" +
      "**Ways you can use the content:** put your logo on it and give it away to build your email list. Customize it and sell it as a branded printable or PDF. Split its sections into blog posts or a short email course. Use the ten social posts to promote the download and the three emails to deliver it. Add your own branding, graphics, calls to action and appropriate affiliate links.\n\n" +
      "**Who it's for:** health and wellness bloggers and newsletter publishers, wellness and health coaches who want a client-ready intake or goal-setting resource, preventive-health and healthy-aging content creators, and affiliate marketers in the health, supplement and screening categories who want a lead magnet they can brand and publish quickly.\n\n" +
      ORIGIN_CLAIM +
      "\n\n" +
      PLR_LICENSE_NOTE +
      "\n\n" +
      "**Delivery:** instant download of one ZIP containing all files — the checklist document, the ten social posts, the three email swipes, the sources list, the PLR license, the medical disclaimer and the bookcover.\n",
    price: 47,
    category: "Preventive Health",
    comingSoon: false,
    includes: [
      "The checklist document itself — 1,954 words. This pack has no separate long article and no separate lead magnet: the checklist IS the product",
      "10 social media posts",
      "3 email swipes",
      "1 Sources and Further Reading list — 8 citations with working links",
      "Medical disclaimer",
      "Private Label Rights (PLR) license — edit, rebrand and sell your finished products; the PLR rights are not transferable down",
      "Bookcover.jpg",
    ],
    delivery:
      "Instant download of one ZIP containing all files — the 1,954-word checklist document itself, the ten social posts, the three email swipes, the sources list, the PLR license, the medical disclaimer and the bookcover.",
    unlisted: true,
  },

  // ── 2 of 2.
  "brain-health-neurological": {
    // 2026-11-06 — UNLISTED: content verified in the release ZIP, no JVZoo ID yet.
    slug: "brain-health-neurological",
    title: "Brain Health & Neurological Diseases",
    description:
      "\n\n**Brain Health & Neurological Diseases**\n\n" +
      "Give your audience research-informed, ready-to-customize content on one of the fastest-growing areas of healthy aging with Brain Health & Neurological Diseases. This PLR article pack covers cognitive longevity, memory and cognitive aging, dementia risk reduction, nutrition and exercise for the brain, sleep, hearing and social connection, supplements, cognitive screening, Alzheimer's biomarkers and the research moving fastest in 2026–2027.\n\n" +
      "Instead of researching a long, careful brain-health article from scratch, you receive a complete content and marketing package you can adapt to your own brand — one in-depth article, a printable checklist with a seven-day habit planner, ten social posts, three emails and a real sources list.\n\n" +
      "**What's inside this pack:**\n" +
      "* 1 in-depth SEO article — *Brain Health & Neurological Diseases*, 4,076 words (5,883 words in the complete pack document, which also carries the lead magnet, the social posts and the email swipes), covering: normal cognitive aging versus cognitive impairment · how the brain changes with age, brain blood flow and neuroinflammation · neuroplasticity and cognitive reserve · cardiovascular health and cognitive longevity (blood pressure, cholesterol, diabetes, smoking) · the Mediterranean and MIND diets, omega-3s and B vitamins · aerobic exercise, resistance training and brain-derived neurotrophic factor · sleep, memory consolidation, the glymphatic system and sleep apnea · social connection, hearing and vision health · stress, cortisol, depression and cognitive symptoms · insulin resistance, obesity and metabolic health · air pollution, head injuries and alcohol · cognitive screening, assessment tools, laboratory evaluation and brain imaging · Alzheimer's biomarkers — amyloid, tau and blood-based testing · brain health supplements and their limitations · brain training and cognitive engagement · strategies for early, middle and older adulthood · and emerging research including disease-modifying Alzheimer's treatments, blood-based diagnostics, precision neurology and artificial intelligence\n" +
      "* 1 lead magnet — *The Brain Health & Cognitive Longevity Checklist* — \"Protect Your Brain. Strengthen Healthy Habits. Support Lifelong Cognitive Wellness.\" It includes a brain health action checklist (screenings, movement, nutrition, sleep, hearing and vision, social engagement, learning, fall prevention, medication review and when to seek evaluation), a seven-day brain health habit planner, and questions to ask a healthcare provider. Use it as an email opt-in, subscriber freebie, coaching resource or bonus.\n" +
      "* 10 social media posts — ready-to-customize posts, each with its own hashtags: brain health awareness · cognitive longevity · exercise and brain function · nutrition for brain health · sleep and memory · neuroplasticity · hearing health and cognition · knowing the warning signs · brain health research · a lifelong brain health plan\n" +
      "* 3 email swipes — three prewritten emails with [First Name] and [Your Name or Brand] placeholders and bracketed call-to-action buttons: an introduction to cognitive longevity and the evidence-based habits behind it · the free Brain Health & Cognitive Longevity Checklist offer, with its contents and seven-day planner described · and what is new in brain health research (neuroplasticity, cardiovascular risk factors, Alzheimer's biomarkers and new treatments), framed honestly — no single strategy guarantees dementia prevention.\n" +
      "* 1 Sources and Further Reading list — five numbered sources with publisher, date, link or DOI, including the National Institute on Aging's cognitive health guidance, the 2024 Lancet Commission on dementia prevention, the MIND-diet randomized trial in the New England Journal of Medicine, the ACHIEVE hearing-intervention trial in The Lancet, and the FDA announcement of the first blood test cleared for use in diagnosing Alzheimer's disease.\n" +
      "* 1 medical disclaimer — a ready-to-use health and medical information disclaimer covering brain health, dementia and Alzheimer's disease, medications and supplements, when memory changes should be evaluated, and the emergency signs of a possible stroke. It is embedded in the pack document and also ships as a standalone Word file inside the ZIP.\n" +
      "* 1 Private Label Rights License — the terms are set out below. (Also embedded in the pack document.)\n" +
      "* Bookcover.jpg — the pack cover image, inside the ZIP\n\n" +
      "**Ways you can use the content:** customize the material for your brand and turn it into blog posts, website content, newsletters, email campaigns, social media posts, a lead magnet, ebooks and reports, guides, coaching materials, membership content, or other digital products permitted by the included PLR license. Break the article's sections into separate posts, use the checklist as an opt-in, and build a brain-health email series from the three emails. Add your own branding, graphics, calls to action, product recommendations and affiliate links where appropriate.\n\n" +
      "**Who it's for:** brain-health, healthy-aging and senior-wellness bloggers, health and wellness newsletter publishers, wellness coaches and caregivers' resource creators, and affiliate marketers in the cognitive-health, nutrition, fitness and supplement categories who want accurate, sourced, ready-to-brand brain-health content.\n\n" +
      ORIGIN_CLAIM +
      "\n\n" +
      PLR_LICENSE_NOTE +
      "\n\n" +
      "**Delivery:** instant download of one ZIP containing all files — the article, the Brain Health & Cognitive Longevity Checklist, the ten social posts, the three email swipes, the sources list, the PLR license, the medical disclaimer and the bookcover.\n",
    price: 47,
    category: "Brain Health",
    comingSoon: false,
    includes: [
      "1 in-depth SEO article — 4,076 words on brain health and neurological diseases",
      "1 lead magnet — The Brain Health & Cognitive Longevity Checklist (action checklist + seven-day habit planner)",
      "10 social media posts, each with its own hashtags",
      "3 email swipes",
      "1 Sources and Further Reading list — 5 citations with working links and DOIs",
      "Medical disclaimer",
      "Private Label Rights (PLR) license — edit, rebrand and sell your finished products; the PLR rights are not transferable down",
      "Bookcover.jpg",
    ],
    delivery:
      "Instant download of one ZIP containing all files — the 4,076-word article, the Brain Health & Cognitive Longevity Checklist, the ten social posts, the three email swipes, the sources list, the PLR license, the medical disclaimer and the bookcover.",
    unlisted: true,
  },
};

/** The pending pack for a slug, or undefined when the slug is not one of them. */
export function pendingPack(slug: string): PendingPack | undefined {
  return PENDING_PACKS[slug];
}

/** Slugs of the pending packs, in the order they are listed above. */
export const PENDING_PACK_SLUGS = Object.keys(PENDING_PACKS);
