import { sql } from "../db";
import { PACK_DESCRIPTIONS } from "../lib/packDescriptions";
import { migrate } from "./migrate";

/**
 * Seed script. Runs migrations first, then upserts the article packs
 * (owner-defined; Packs 1-8 descriptions come verbatim from
 * src/lib/packDescriptions.ts). Idempotent: packs are keyed on their unique
 * `slug` with `on conflict (slug) do update`, so re-running never duplicates a
 * row and always brings an edited title/description/includes block up to date.
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
    description: PACK_DESCRIPTIONS["nutrition-everyday-wellness"],
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
    description: PACK_DESCRIPTIONS["supplements-nutritional-support"],
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
      "Bookcover",
    ],
  },
  {
    slug: "fitness-exercise",
    title: "Article Pack 3: Fitness & Exercise",
    description: PACK_DESCRIPTIONS["fitness-exercise"],
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
      "Bookcover",
    ],
  },
  {
    slug: "sleep-recovery",
    title: "Article Pack 4: Sleep & Recovery",
    description: PACK_DESCRIPTIONS["sleep-recovery"],
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
      "Bookcover",
    ],
  },
  {
    slug: "stress-management-mind-body-wellness",
    title: "Article Pack 5: Stress Management & Mind-Body Wellness",
    description: PACK_DESCRIPTIONS["stress-management-mind-body-wellness"],
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
      "Bookcover",
    ],
  },
  {
    slug: "healthy-aging-lifestyle",
    title: "Article Pack 6: Healthy Aging & Lifestyle",
    description: PACK_DESCRIPTIONS["healthy-aging-lifestyle"],
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
    description: PACK_DESCRIPTIONS["natural-holistic-wellness"],
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
  {
    slug: "product-reviews-buying-guides",
    title: "Article Pack 8: Product Reviews & Buying Guides",
    description: PACK_DESCRIPTIONS["product-reviews-buying-guides"],
    priceCents: 4700,
    category: "Product Reviews",
    comingSoon: false,
    includes: [
      "Original reviews, buying guides & comparisons (~26,800 words)",
      "Email swipes & sequences",
      "Social media posts",
      "Lead magnet content",
      "PLR license",
      "Health & wellness disclaimers",
      "Bookcover",
    ],
  },
  // ---------------------------------------------------------------------
  // Packs 9-13 (delivered 2026-09-22). `comingSoon: false` on purpose:
  // their /library pages are pre-rendered and the owner is listing them on
  // JVZoo, so each pack slug must resolve to a real pack.
  // Descriptions are the owner's own text from
  // _incoming/packN/packN-description.txt, verbatim; where that file's first
  // line is the pack's title heading it is used as `title` and the
  // description starts on line 2. Word counts from
  // release-zips/packs-9-13-zips-INVENTORY.md (article / whole document).
  // A pack shows a JVZoo buy button once its product ID is in src/jvzoo.ts.
  {
    slug: "protein-shakes-protein-nutrition",
    title: "Article Pack 9 — Protein Shakes & Protein Nutrition",
    description:
      "Article Pack 9: Protein Shakes & Protein Nutrition gives you ready-to-customize PLR content covering protein shakes, protein powders, protein sources, exercise nutrition, product selection, and current protein trends.\nInstead of researching and creating protein-focused content from scratch, you receive a complete content and marketing package that you can adapt to your own brand.\nWhat You Receive\n1 In-Depth SEO Article\n A comprehensive article, Protein Shakes in 2026: Latest Research, Benefits, Types, Ingredients, and How to Choose the Best Protein Shake, covering topics such as:\n* Whey, casein, and milk protein\n* Soy, pea, rice, and blended plant proteins\n* Collagen protein\n* Protein and muscle growth\n* Protein shakes for older adults\n* Protein for endurance athletes\n* Protein shakes and weight management\n* Protein timing\n* Ready-to-drink shakes vs. protein powder\n* Protein shake labels and product quality\n* Third-party testing\n* Digestive considerations\n* Clear protein drinks and newer protein trends\n* Protein shakes vs. whole foods\n* How to choose a protein shake\n1 Lead Magnet\n The Protein Shake Smart Shopper Checklist gives you a ready-made educational freebie that can be branded and used to help build your email list.\n10 Social Media Posts\n Ready-to-customize posts covering protein shakes, whey vs. plant protein, workout nutrition, vegan protein, label reading, whole-food protein, and smart protein shopping.\n5 Email Swipes\n Prewritten promotional and educational emails that can be customized for your subscribers, including subject lines and email copy.\n1 Medical and Nutritional Disclaimer\n A ready-to-use disclaimer designed for the health and nutrition content included in the pack.\n1 Private Label Rights License\n The included PLR license explains how you can customize, rebrand, publish, repurpose, and sell finished products created from the content. No signature is required.\nWays You Can Use the Content\nCustomize the materials for your brand and turn them into blog content, website content, newsletters, email campaigns, social media posts, lead magnets, ebooks, guides, educational resources, coaching materials, membership content, or other digital products permitted by the included PLR license.\nYou can also add your own branding, graphics, calls to action, product recommendations, and affiliate links where appropriate.\nYou receive more than an article—you receive a ready-to-customize protein nutrition content package designed to help you create more and publish faster.",
    priceCents: 4700,
    category: "Protein Nutrition",
    comingSoon: false,
    includes: [
      "1 in-depth SEO-written article (4,133 words; 6,001 words in the complete pack document)",
      "Lead magnet: The Protein Shake Smart Shopper Checklist",
      "10 social media posts",
      "5 email swipes",
      "PLR license",
      "Medical and nutritional disclaimer",
      "Bookcover",
    ],
  },
  {
    slug: "intermittent-fasting-time-restricted-eating",
    title: "Article Pack 10 — Intermittent Fasting & Time-Restricted Eating",
    description:
      "Give your audience timely, research-informed content on one of the most popular topics in nutrition and weight management with Health Copy Forge Article Pack 10: Intermittent Fasting & Time-Restricted Eating.\nThis ready-to-customize PLR content package explores the latest information on intermittent fasting, including popular fasting schedules, weight management, metabolic health, meal timing, exercise, nutrition, fasting safety, and emerging research.\nWhat You Receive\n1 In-Depth SEO Article\nIntermittent Fasting in 2026: Latest Research, Benefits, Fasting Schedules, Weight Loss, Metabolic Health, and How to Fast Safely\nThe article covers:\n* What intermittent fasting is and how it works\n* Time-restricted eating\n* 12:12, 14:10, 16:8, and 18:6 fasting\n* Alternate-day fasting\n* The 5:2 diet\n* Intermittent fasting and weight management\n* Fasting vs. conventional calorie restriction\n* Blood sugar and insulin sensitivity\n* Type 2 diabetes considerations\n* Meal timing and circadian rhythms\n* Heart and metabolic health\n* Diet quality during intermittent fasting\n* Protein, fiber, and hydration\n* Intermittent fasting and exercise\n* Muscle preservation\n* Hunger, headaches, fatigue, and common challenges\n* Intermittent fasting for women and older adults\n* Early vs. late time-restricted eating\n* Autophagy and longevity claims\n* Gut health and inflammation research\n* Common fasting myths\n* What breaks a fast\n* How to begin intermittent fasting\n* Common intermittent fasting mistakes\n* Sustainability and long-term considerations\n* Current intermittent fasting research\n1 Lead Magnet\nThe Intermittent Fasting Starter Guide & Daily Checklist gives you a ready-to-brand resource that helps readers select a fasting window, plan nutrient-rich meals, monitor hydration, track how they feel, and identify situations where professional guidance may be appropriate.\nUse it as an email opt-in, subscriber freebie, website download, coaching resource, or bonus digital product.\n10 Social Media Posts\nReady-to-customize posts covering:\n* Intermittent fasting basics\n* 14:10 and 16:8 fasting\n* Weight management\n* Nutrition during fasting\n* Fasted exercise\n* Fasting beverages\n* Diabetes considerations\n* Sustainable fasting habits\n5 Email Swipes\nPrewritten educational emails with subject lines covering current intermittent fasting research, fasting schedules, weight management, nutrition, and important considerations before beginning a fasting routine.\n1 Medical and Nutritional Disclaimer\nA ready-to-use health disclaimer covering the educational nature of the content and important considerations surrounding medications, diabetes, pregnancy, breastfeeding, eating disorders, and specialized nutritional needs.\n1 Private Label Rights License\nThe included PLR license allows buyers to customize, edit, rebrand, publish, and repurpose the material according to the license terms.\nNo signature is required.\nWays You Can Use This Pack\nCustomize and repurpose the content for:\n* Blogs and websites\n* Health and wellness newsletters\n* Email marketing\n* Social media\n* Lead-generation campaigns\n* Ebooks and reports\n* Digital guides\n* Coaching resources\n* Membership content\n* Educational materials\n* Affiliate marketing content\n* Other finished digital products permitted by the PLR license\nAdd your own branding, logo, graphics, calls to action, affiliate links, product recommendations, and business information where appropriate.\nArticle Pack 10 gives you a complete intermittent fasting content and marketing package you can customize for your audience without researching and creating every piece from scratch.\nCreate More. Publish Faster.",
    priceCents: 4700,
    category: "Intermittent Fasting",
    comingSoon: false,
    includes: [
      "1 in-depth SEO-written article (4,882 words; 6,675 words in the complete pack document)",
      "Lead magnet: The Intermittent Fasting Starter Guide & Daily Checklist",
      "10 social media posts",
      "5 email swipes",
      "PLR license",
      "Medical and nutrition disclaimer",
      "Bookcover",
    ],
  },
  {
    slug: "health-coaching-functional-nutrition-glp-1-support",
    title: "Article Pack 11 — Health Coaching, Functional Nutrition & GLP-1 Support in 2026",
    description:
      "Stay current with one of the fastest-evolving areas of health and wellness with Health Coaching, Functional Nutrition & GLP-1 Support in 2026. This comprehensive PLR article pack explores the latest research and practical strategies surrounding GLP-1 medications, nutrition, lifestyle coaching, muscle preservation, metabolic health, and sustainable weight management.\nDesigned for health and wellness bloggers, coaches, content creators, affiliate marketers, and digital publishers, the pack examines how nutrition and lifestyle strategies can support people using GLP-1 medications while emphasizing adequate protein, resistance training, nutrient quality, healthy habits, and long-term weight-management approaches.\nThe content also explores the expanding role of health coaching and functional nutrition, including behavior change, personalized nutrition strategies, maintaining lean muscle during weight loss, managing common nutrition challenges, and helping individuals build sustainable routines beyond the scale.\nWith timely, research-informed content focused on the rapidly changing weight-management landscape of 2026, Article Pack 11 gives buyers ready-to-customize material they can use for blogs, websites, newsletters, educational resources, lead generation, and digital products.\nKey topics include GLP-1 nutrition support, health coaching, functional nutrition, protein and muscle health, resistance training, metabolic wellness, lifestyle change, healthy weight loss, weight maintenance, and sustainable weight management.",
    priceCents: 4700,
    category: "GLP-1 Support",
    comingSoon: false,
    includes: [
      "1 in-depth SEO-written article (4,718 words; 6,474 words in the complete pack document)",
      "Lead magnet: The GLP-1 Nutrition & Healthy Habits Checklist",
      "10 social media posts",
      "5 email swipes",
      "PLR license",
      "Medical, nutrition and GLP-1 disclaimer",
      "Bookcover",
    ],
  },
  {
    slug: "functional-nutrition-glp-1-adaptation",
    title: "Article Pack 12 — Functional Nutrition, GLP-1 & Adaptation in 2026",
    description:
      "Stay ahead of one of the fastest-growing topics in health and wellness with Functional Nutrition, GLP-1 & Adaptation in 2026. This research-informed PLR article pack gives you ready-to-customize content covering nutrition, appetite changes, muscle health, gut health, and sustainable lifestyle adaptation during GLP-1-supported weight management.\nInstead of spending hours researching complex GLP-1 nutrition topics and creating content from scratch, you can start with professionally prepared content and adapt it to your brand, audience, and publishing strategy.\nDesigned for health and wellness bloggers, coaches, affiliate marketers, content creators, website owners, and digital publishers, Article Pack 12 combines timely subject matter with the flexibility of private label rights.\nContent Benefits\nArticle Pack 12 helps you quickly expand your health and wellness content library with in-depth material covering timely GLP-1 and functional nutrition topics.\nThe content explores GLP-1 nutrition, appetite and satiety changes, protein intake, muscle preservation, resistance training, hydration, nutrient density, digestive and gut health, meal planning, healthy eating behaviors, and sustainable lifestyle adaptation.\nWith this PLR content, you can:\n* Save hours of research, outlining, and writing.\n* Customize the content to match your brand and audience.\n* Publish articles on your blog or website.\n* Repurpose material into newsletters and educational resources.\n* Turn article concepts into lead magnets and supporting content.\n* Create social media content from key ideas and educational points.\n* Build a larger library of content around GLP-1 medications, nutrition, metabolic wellness, and healthy weight management.\nRather than concentrating solely on weight loss, the pack addresses the broader lifestyle considerations surrounding GLP-1 use, including maintaining adequate nutrition when appetite decreases, supporting lean muscle, navigating digestive changes, and developing sustainable health habits.\nBusiness Benefits\nArticle Pack 12 isn’t simply more content for your website. It gives you a flexible content asset that can support multiple areas of your online business.\nDepending on the rights provided in the included PLR license, you can customize and repurpose the material to help:\n* Keep your blog or website consistently updated without writing everything from scratch.\n* Attract search traffic by publishing content around timely health and wellness topics.\n* Build authority within the GLP-1, nutrition, weight-management, and wellness markets.\n* Grow your email list by transforming appropriate content into lead-generation resources.\n* Support affiliate promotions with educational content related to relevant products and services.\n* Create additional digital content and resources for your audience.\n* Maintain a more consistent publishing schedule while reducing content-production time.\n* Get more value from a single content purchase by repurposing material across multiple marketing channels.\nFor busy entrepreneurs and content creators, that means less time researching and writing—and more time publishing, marketing, building an audience, and growing your business.\nStart Publishing Today\nGet Article Pack 12 now, customize the content for your brand, and start publishing. Turn these ready-to-use PLR resources into blog content, email campaigns, lead-generation materials, social content, and other marketing assets that help move your business forward.\nStop starting from scratch. Get the content, make it yours, and put it to work for your business today.\nHealth Copy Forge — Create More. Publish Faster.",
    priceCents: 4700,
    category: "GLP-1 Adaptation",
    comingSoon: false,
    includes: [
      "1 in-depth SEO-written article (5,345 words; 7,084 words in the complete pack document)",
      "Lead magnet: The GLP-1 Adaptation Tracker",
      "10 social media posts",
      "5 email swipes",
      "PLR license",
      "Medical, nutrition and GLP-1 disclaimer",
      "Bookcover",
    ],
  },
  {
    slug: "womens-longevity-biology-specific-care",
    title: "Article Pack 13 — Women’s Longevity & Biology-Specific Care",
    description:
      "Give your audience timely, research-informed content on one of the fastest-growing areas of women’s wellness with Article Pack 13 — Women’s Longevity & Biology-Specific Care.\nThis ready-to-customize PLR content package explores how female biology can influence aging across the lifespan, with special attention to healthspan, menopause, hormones, cardiovascular health, brain health, bone strength, muscle preservation, metabolism, nutrition, preventive care, and healthy aging.\nDesigned for health and wellness bloggers, coaches, content creators, affiliate marketers, membership-site owners, and digital-product sellers, this pack gives you a substantial foundation of content you can customize for your own brand and audience.\nWhat’s Included\n1 In-Depth SEO Article\nWomen’s Longevity & Biology-Specific Care in 2026: Latest Research on Female Aging, Menopause, Hormones, Heart Health, Brain Health, Bone Strength, Muscle, Metabolism, and Healthy Aging\nThe article explores important topics in modern women’s longevity, including:\n* Women’s lifespan vs. healthspan\n* Female biology and aging\n* Chronological age vs. biological age\n* Sex-specific aging research\n* Women’s health across the life course\n* Perimenopause and menopause\n* Menopausal hormone therapy\n* Early menopause and premature ovarian insufficiency\n* Women’s cardiovascular health\n* Pregnancy history and future health\n* Blood pressure and cholesterol\n* Metabolic health\n* Muscle preservation\n* Resistance training for women\n* Functional exercise after age 60\n* Bone health and osteoporosis\n* Calcium and vitamin D\n* Protein and healthy aging\n* Creatine and women’s health\n* Brain and cognitive health\n* Sleep and sleep apnea\n* Women’s longevity nutrition\n* Mediterranean-style eating\n* Fiber and gut health\n* Blood-sugar health\n* Midlife body-composition changes\n* Immune aging and inflammation\n* Mental health and social connection\n* Cancer screening and preventive care\n* Fall prevention, balance, and mobility\n* Longevity supplements\n* “Hormone balance” and cortisol claims\n* Biological-age testing\n* Wearables and precision women’s health\n* Healthy aging after 60, 70, and 80\n* Frailty prevention\n* Walking, strength, and mobility\n* Alcohol and tobacco\n* Genetics and family history\n* Practical women’s longevity strategies\nThe content takes a balanced approach to women’s healthy aging without relying on exaggerated anti-aging promises or presenting one supplement, hormone, diet, or treatment as the answer to longevity.\n1 Lead Magnet\nThe Women’s Longevity & Healthspan Checklist: 10 Areas to Support Stronger, Healthier Aging\nA ready-to-customize lead-generation resource covering:\n* Heart health\n* Muscle and strength\n* Bone health\n* Nutrition\n* Movement\n* Menopause and hormonal health\n* Brain and sleep health\n* Preventive care\n* Healthy lifestyle habits\n* Personal healthspan goals\nCustomize it with your branding and use it as an email opt-in, downloadable checklist, subscriber bonus, coaching resource, or membership freebie.\n10 Social Media Posts\nReceive 10 ready-to-customize posts covering topics such as:\n* Women’s healthspan\n* Muscle and longevity\n* Menopause\n* Cardiovascular health\n* Bone health\n* Pregnancy history\n* Biological age\n* Resistance training\n* Longevity supplements\n* Biology-specific care\nUse them on Facebook, Instagram, LinkedIn, Pinterest, or other appropriate platforms to educate your audience and drive readers back to your content, products, services, or email list.\n5 Email Swipes\nThe pack includes five ready-to-customize emails:\nEmail 1: Are You Building Lifespan or Healthspan?\nEmail 2: The Longevity Tool Women Often Ignore\nEmail 3: Menopause Is Bigger Than Hot Flashes\nEmail 4: Don’t Let an “Anti-Aging” Test Scare You\nEmail 5: Your Women’s Longevity Checklist\nUse the emails for newsletters, nurture sequences, educational campaigns, lead-magnet follow-up, product promotion, or audience engagement.\n1 Medical & Women’s Health Disclaimer\nA ready-to-use disclaimer is included to help distinguish general educational information from individualized medical, nutritional, hormone-therapy, diagnostic, or treatment advice.\n1 Private Label Rights License\nYour PLR license gives you extensive flexibility to customize and repurpose the content for your business.\nYou can:\n* Rewrite and edit the content\n* Add your brand name and logo\n* Add your own graphics and images\n* Publish customized versions on your blog or website\n* Use the content in newsletters and emails\n* Create social media content\n* Turn the material into ebooks, reports, guides, checklists, and worksheets\n* Incorporate appropriate material into courses and memberships\n* Use the content for lead generation\n* Customize the included lead magnet\n* Create finished digital products\n* Add calls to action\n* Add appropriate affiliate links and product recommendations\n* Publish customized versions under your own brand\nNo attribution is required.\nNo signature is required.\nPurchase and lawful possession of the package constitutes acceptance of the PLR license.\nWho Can Use This Pack?\nArticle Pack 13 is designed for:\n* Health and wellness bloggers\n* Women’s wellness brands\n* Healthy-aging content creators\n* Menopause and midlife wellness creators\n* Wellness coaches\n* Affiliate marketers\n* Newsletter publishers\n* Membership-site owners\n* Digital-product creators\n* Health and wellness website owners\nWays to Turn This Pack Into More Content\nOne PLR package can become much more than a single article.\nBreak individual sections into separate blog posts. Turn the women’s longevity checklist into an email opt-in. Create a menopause or healthy-aging email series. Repurpose key sections into social posts, newsletters, educational handouts, mini-guides, or membership content.\nYou can also add your own graphics, calls to action, recommended resources, products, services, and appropriate affiliate offers to create a customized content funnel for your business.\nArticle Pack 13 gives you a ready-to-customize women’s longevity content package built around one powerful idea: healthy aging for women is about more than adding years to life—it’s about protecting strength, health, function, independence, and quality of life throughout those years.\nCreate More. Publish Faster.",
    priceCents: 4700,
    category: "Women's Longevity",
    comingSoon: false,
    includes: [
      "1 in-depth SEO-written article (5,658 words; 7,479 words in the complete pack document)",
      "Lead magnet: The Women's Longevity & Healthspan Checklist: 10 Areas to Support Stronger, Healthier Aging",
      "10 social media posts",
      "5 email swipes",
      "PLR license",
      "Medical and women's health disclaimer",
      "Bookcover",
    ],
  },
  // ── The first of the three 2026-11 packs to be LISTED (JVZoo 462871, owner
  // 2026-11-13). Promoted from src/lib/pendingPacks.ts, where it lived while
  // it had no listing: same title, description, price, category and contents,
  // so the page it renders now is the page the reviewer already saw.
  {
    slug: "heart-health-cardiovascular-2026-2027",
    title: "Heart Health & Cardiovascular Disease in 2026–2027",
    description:
      "\n\n**Heart Health & Cardiovascular Disease in 2026–2027**\n\nThe Complete Guide to Heart Disease Prevention, High Blood Pressure, Cholesterol, Stroke Risk, Cardiovascular Nutrition, Exercise, and Emerging Heart Health Research\n\nGive your audience research-informed, ready-to-customize content on the leading area of preventive health with Heart Health & Cardiovascular Disease in 2026–2027. This PLR article pack covers heart disease prevention, high blood pressure, cholesterol, stroke risk, cardiovascular nutrition, exercise, sleep and stress, and the research changing how clinicians approach heart health right now.\n\nInstead of researching and writing a long, sourced heart-health article from scratch, you receive a complete content and marketing package you can adapt to your own brand — one in-depth article, a printable checklist, ten social posts, seven emails and a real sources list.\n\n**What's inside this pack:**\n* 1 in-depth SEO article — *Heart Health & Cardiovascular Disease in 2026–2027*, 6,039 words (9,140 words in the complete pack document, which also carries the lead magnet, the social posts and the email swipes), covering: high blood pressure and what blood-pressure numbers mean · cholesterol, triglycerides and additional lipid markers · coronary artery disease · heart failure · atrial fibrillation and heart-rhythm disorders · stroke prevention and early warning signs · women's heart health, pregnancy-related risk and menopause · heart disease in younger adults and familial hypercholesterolemia · the Mediterranean diet · aerobic exercise, resistance training and everyday walking · arterial plaque and coronary artery calcium testing · stress, depression, anxiety and sleep · heart health biomarkers, ApoB and high-sensitivity C-reactive protein · the 2026 cholesterol guideline · lipoprotein(a)-targeting therapies · cardiovascular-kidney-metabolic health · GLP-1-based treatments and cardiovascular risk · wearables, artificial intelligence and advanced imaging · and a seven-step long-term heart health plan\n* 1 lead magnet — *The Heart Health & Cardiovascular Disease Prevention Checklist*: a printable, ready-to-brand checklist with a heart health numbers table (blood pressure, total, LDL and HDL cholesterol, triglycerides, blood glucose, hemoglobin A1c, lipoprotein(a) and ApoB), a cardiovascular risk-factor checklist, heart-healthy nutrition habits, cardiovascular fitness, sleep and stress checklists, emergency warning signs, a 30-day heart health action plan, and questions to ask a healthcare professional. Use it as an email opt-in, subscriber freebie, website download, coaching resource or bonus.\n* 10 social media posts — ready-to-customize posts, each with its own hashtags: heart disease prevention starts with everyday habits · high blood pressure often has no symptoms · understanding cholesterol and heart disease risk · the warning signs of stroke · women's heart health · the Mediterranean diet and your heart · movement supports heart health · what is atherosclerosis · new developments in heart health testing · a 30-day heart health challenge\n* 7 email swipes — seven prewritten emails with [First Name] and [Your Name or Brand] placeholders and bracketed call-to-action buttons, covering: understanding your cardiovascular risk factors · blood pressure and cholesterol results · seven heart-healthy habits · women's heart health and menopause · the checklist as a free download · what is changing in cardiovascular research, testing and treatment · and choosing one first action. Use them for a nurture sequence, a newsletter series, lead-magnet follow-up, or affiliate promotions.\n* 1 Sources and Further Reading list — eight full citations with working links and DOIs, including the American Heart Association's Life's Essential 8 advisory, the PREDIMED Mediterranean-diet trial and the National Sleep Foundation's sleep-duration recommendations. You can show your audience where the information comes from.\n* 1 medical disclaimer — covering blood pressure and cholesterol goals, medication and supplement decisions, and emergency warning signs (heart attack and stroke). It is embedded in the pack document and also ships as a standalone Word file inside the ZIP.\n* 1 Private Label Rights License — the terms are set out below. (Also embedded in the pack document.)\n* Bookcover.jpg — the pack cover image, inside the ZIP\n\n**Ways you can use the content:** customize the material for your brand and turn it into blog posts, website content, newsletters, email campaigns, social media posts, a lead magnet, ebooks and reports, guides, coaching materials, membership content, or other digital products permitted by the included PLR license. Split the article's sections into separate blog posts, turn the checklist into an email opt-in, and build a heart-health email series from the seven emails. Add your own branding, graphics, calls to action, product recommendations and affiliate links where appropriate.\n\n**Who it's for:** heart-health, healthy-aging and chronic-disease-prevention bloggers, health and wellness newsletter publishers, wellness coaches and health coaches, and affiliate marketers in the cardiovascular, nutrition, fitness and supplement categories who want accurate, sourced, ready-to-brand heart-health content.\n\n**100% Original, In-House Written Content.** Every word in this pack — and in every HealthCopy Forge pack — is originally written by us. Nothing is reused, resold, or repurposed from any other PLR store. You are getting fresh, unique content that was created specifically for HealthCopy Forge, so your audience sees something they won't find anywhere else.\n\n**PLR license.** The Private Label Rights License is included inside the ZIP and explains how the content may be used, edited, customized, branded and repurposed according to its terms. The license is not transferable: you can sell your own customized, finished products to end users, but the PLR rights themselves cannot be passed on, sublicensed or resold as PLR. No separate license purchase is needed, and no signature is required.\n\n**Delivery:** instant download of one ZIP containing all files — the article, the lead magnet checklist, the ten social posts, the seven email swipes, the sources list, the PLR license, the medical disclaimer and the bookcover.\n",
    priceCents: 4700,
    category: "Heart Health",
    comingSoon: false,
    includes: [
      "1 in-depth SEO article — 6,039 words on heart health and cardiovascular disease",
      "1 lead magnet — The Heart Health & Cardiovascular Disease Prevention Checklist",
      "10 social media posts, each with its own hashtags",
      "7 email swipes",
      "1 Sources and Further Reading list — 8 citations with working links and DOIs",
      "Medical disclaimer",
      "Private Label Rights (PLR) license — edit, rebrand and sell your finished products; the PLR rights are not transferable down",
      "Bookcover.jpg",
    ],
  },
  // ── The second of the three 2026-11 packs to be LISTED (JVZoo 462879,
  // owner 2026-11-13). Promoted from src/lib/pendingPacks.ts, where it lived
  // while it had no listing: same title, description, price, category and
  // contents, so the page it renders now is the page the reviewer already saw.
  {
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
      "**100% Original, In-House Written Content.** Every word in this pack — and in every HealthCopy Forge pack — is originally written by us. Nothing is reused, resold, or repurposed from any other PLR store. You are getting fresh, unique content that was created specifically for HealthCopy Forge, so your audience sees something they won't find anywhere else." +
      "\n\n" +
      "**PLR license.** The Private Label Rights License is included inside the ZIP and explains how the content may be used, edited, customized, branded and repurposed according to its terms. The license is not transferable: you can sell your own customized, finished products to end users, but the PLR rights themselves cannot be passed on, sublicensed or resold as PLR. No separate license purchase is needed, and no signature is required." +
      "\n\n" +
      "**Delivery:** instant download of one ZIP containing all files — the checklist document, the ten social posts, the three email swipes, the sources list, the PLR license, the medical disclaimer and the bookcover.\n",
    priceCents: 4700,
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
      -- Re-running the seed refreshes existing rows instead of skipping them,
      -- so an edit to a title/description/includes block above (or to
      -- src/lib/packDescriptions.ts, which feeds the packs 1-8 descriptions)
      -- reaches the live pages on the next build. Insert-only ("do nothing")
      -- silently kept the old storefront blurbs alive.
      on conflict (slug) do update set
        title = excluded.title,
        description = excluded.description,
        price_cents = excluded.price_cents,
        category = excluded.category,
        coming_soon = excluded.coming_soon,
        includes = excluded.includes
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