import { createFileRoute } from "@tanstack/react-router";
// ─── /affiliate-kit — the affiliates' private promo hub ───────────────────────
//
// Owner-approved (2026-10-26): ONE short link to hand every affiliate instead of
// attaching files. Deliberately UNLISTED — it is reached by direct link only, so:
//   * it is NOT in the header/footer nav (see src/routes/__root.tsx) and not in
//     any marketing page's link list;
//   * it carries a `noindex, nofollow` robots meta so it never shows up in search;
//   * it still uses the NORMAL root layout — this is NOT one of the /sales/* JVZoo
//     clean pages and must never opt out of the header/footer.
//
// Every file it links to is staged (site-only, NOT in git, exactly like the other
// kit-delivery assets) under `public/kit-delivery/affiliate-kit/`:
//   packs/    <- /home/team/shared/content-packs/promo-kit/        (13 pack folders + 7 shared docs)
//   ebooks/   <- /home/team/shared/content-packs/ebook-promo-kit/  (11 ebook folders + README)
//   banners/  <- /home/team/shared/content-packs/_assets/affiliate-banners/  (3 PNGs + the docx)
//   affiliate-promo-kits.zip / affiliate-ebook-promo-kits.zip       (rebuilt from those sources)
// Links are ROOT-RELATIVE ("/kit-delivery/...") so they are same-origin with the
// page on both the dev host and www.healthcopyforge.com — a cross-origin href is
// what silently breaks the owner's downloads (see the kit-file-downloads skill).
//
// Product titles below are copied VERBATIM from the kit READMEs (the folder-name
// slugs are the real paths on disk — never derive a link from a title):
//   packs:  content-packs/promo-kit/README.md          ("Packs covered: 1 … 13")
//   ebooks: content-packs/ebook-promo-kit/README.md    ("The 11 kits" table)

const KIT_ROOT = "/kit-delivery/affiliate-kit";

// The three files every product folder carries, in the order affiliates need them.
const KIT_FILES = [
  { label: "Sample excerpts", file: "sample-excerpts.md" },
  { label: "Social posts", file: "social-posts.md" },
  { label: "Swipe emails", file: "swipe-emails.md" },
] as const;

type Product = { title: string; folder: string };

// Article packs 1–13, in kit order (folders exactly as they exist under packs/).
const PACKS: Product[] = [
  { title: "Nutrition & Everyday Wellness", folder: "pack-1-nutrition-everyday-wellness" },
  { title: "Supplements & Nutritional Support", folder: "pack-2-supplements-nutritional-support" },
  { title: "Fitness & Exercise", folder: "pack-3-fitness-exercise" },
  { title: "Sleep & Recovery", folder: "pack-4-sleep-recovery" },
  { title: "Stress Management", folder: "pack-5-stress-management" },
  { title: "Healthy Aging", folder: "pack-6-healthy-aging" },
  { title: "Natural & Holistic Wellness", folder: "pack-7-natural-holistic-wellness" },
  { title: "Product Reviews & Buying Guides", folder: "pack-8-product-reviews-buying-guides" },
  { title: "Protein Shakes & Protein Nutrition", folder: "pack-9-protein-shakes-protein-nutrition" },
  {
    title: "Intermittent Fasting & Time-Restricted Eating",
    folder: "pack-10-intermittent-fasting-time-restricted-eating",
  },
  {
    title: "Health Coaching, Functional Nutrition & GLP-1 Support in 2026",
    folder: "pack-11-health-coaching-functional-nutrition-glp-1-support",
  },
  {
    title: "Functional Nutrition, GLP-1 & Adaptation in 2026",
    folder: "pack-12-functional-nutrition-glp-1-adaptation",
  },
  {
    title: "Women's Longevity & Biology-Specific Care",
    folder: "pack-13-womens-longevity-biology-specific-care",
  },
];

// Master Resell ebooks E1–E11, in kit order (folders under ebooks/).
const EBOOKS: Product[] = [
  { title: "Balanced Nutrition Made Simple", folder: "ebook-balanced-nutrition" },
  { title: "Brain Healthy Lifestyle Habits", folder: "ebook-brain-habits" },
  { title: "Gut Health for Beginners", folder: "ebook-gut-health" },
  { title: "Healthy Hair and Scalp Wellness", folder: "ebook-hair-scalp" },
  { title: "Healthy Bones and Everyday Lifestyle", folder: "ebook-healthy-bones" },
  { title: "Healthy Feet and Foot Care", folder: "ebook-healthy-feet" },
  { title: "Heart Healthy Lifestyle Habits", folder: "ebook-heart-habits" },
  { title: "Hydration and Wellness", folder: "ebook-hydration" },
  { title: "Joint Friendly Fitness", folder: "ebook-joint-fitness" },
  { title: "Posture and Everyday Movement", folder: "ebook-posture" },
  { title: "Protein for Healthy Aging", folder: "ebook-protein-aging" },
];

// The shared start-here documents sitting at the top level of packs/.
const SHARED_RESOURCES = [
  {
    file: "why-promote-healthcopy-forge.md",
    title: "Why promote HealthCopy Forge",
    blurb: "The offer, the audience and the angles that make it an easy yes.",
  },
  {
    file: "headlines-and-hooks.md",
    title: "Headlines & hooks",
    blurb: "A bank of ready-to-adapt headlines, hooks, benefit lines and CTAs.",
  },
  {
    file: "promotional-calendar.md",
    title: "Promotional calendar",
    blurb: "A suggested two-week launch rhythm plus an evergreen schedule.",
  },
  {
    file: "affiliate-disclosure-reminder.md",
    title: "Affiliate disclosure reminder",
    blurb: "Plain-language guidance on disclosing your affiliate relationship.",
  },
  {
    file: "product-information-sheet.md",
    title: "Product information sheet",
    blurb: "What is inside each pack, the price, and the commission — facts fast.",
  },
] as const;

const BANNERS = ["banner-1.png", "banner-2.png", "banner-3.png"] as const;

const PROGRAM_FACTS = [
  { value: "50%", label: "commission on article packs, ebooks and courses" },
  { value: "30%", label: "recurring commission on referred memberships" },
  { value: "90-day", label: "cookie window on every referral" },
  { value: "Auto-approve", label: "no waiting to be accepted" },
] as const;

export const Route = createFileRoute("/affiliate-kit")({
  head: () => ({
    meta: [
      { title: "Affiliate Promo Kit | HealthCopy Forge" },
      {
        name: "description",
        content:
          "Private promo kit for HealthCopy Forge affiliates: sample excerpts, social posts and swipe emails for every article pack and ebook, plus banners and a one-click download.",
      },
      // Unlisted page: reachable by direct link only, never indexed.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AffiliateKitPage,
});

function ProductCard({
  product,
  group,
  index,
}: {
  product: Product;
  group: "packs" | "ebooks";
  index: number;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">
        {group === "packs" ? `Pack ${index + 1}` : `Ebook ${index + 1}`}
      </p>
      <h3 className="mt-1 text-base font-bold text-gray-900">{product.title}</h3>
      <ul className="mt-3 space-y-1.5">
        {KIT_FILES.map((f) => (
          <li key={f.file}>
            <a
              href={`${KIT_ROOT}/${group}/${product.folder}/${f.file}`}
              className="text-sm font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-800 hover:decoration-emerald-600"
            >
              {f.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AffiliateKitPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Affiliates
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Affiliate Promo Kit
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Welcome — this is your promo kit. Everything here is ready to post, send
            or hand to your designer, written for the HealthCopy Forge article packs,
            the Master Resell ebooks and the PLR courses. Drop your own affiliate link
            into the placeholder and you can start promoting today.
          </p>
        </div>
      </section>

      {/* Program facts */}
      <section className="px-4 pb-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAM_FACTS.map((fact) => (
              <div
                key={fact.value}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-6 text-center"
              >
                <p className="text-2xl font-extrabold text-emerald-700">{fact.value}</p>
                <p className="mt-1 text-sm leading-snug text-gray-700">{fact.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate links + one-download */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Get your affiliate links</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Apply once and JVZoo auto-approves you. Every product has its own link —
              grab the one for the pack, ebook or course you are promoting.
            </p>
            <a
              href="/affiliates"
              className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Get your affiliate links
            </a>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Everything in one download</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Prefer to keep the kit on your own computer? Download both bundles —
              every folder below, in one file each.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`${KIT_ROOT}/affiliate-promo-kits.zip`}
                download
                className="rounded-lg bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Download the article-pack promo kits (ZIP)
              </a>
              <a
                href={`${KIT_ROOT}/affiliate-ebook-promo-kits.zip`}
                download
                className="rounded-lg bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Download the ebook promo kits (ZIP)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Shared start-here resources */}
      <section className="bg-emerald-50/50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Shared start-here resources
          </h2>
          <p className="mt-2 max-w-2xl text-base text-gray-600">
            Start with these: why the offer is easy to promote, the angles that work,
            the launch rhythm, how to disclose your affiliate relationship properly,
            and the facts on every product.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="divide-y divide-gray-100">
              {SHARED_RESOURCES.map((item) => (
                <a
                  key={item.file}
                  href={`${KIT_ROOT}/packs/${item.file}`}
                  className="block px-6 py-4 transition-colors hover:bg-emerald-50/60"
                >
                  <p className="text-base font-semibold text-emerald-700">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.blurb}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Article packs */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Ready-to-post sample content
          </h2>
          <p className="mt-2 max-w-3xl text-base text-gray-600">
            Each product folder holds three files: genuine sample excerpts you can use
            as a free preview, ready-to-post social captions, and swipe emails to send
            to your own list.
          </p>

          <h3 className="mt-10 text-xl font-bold text-gray-900">
            Article packs 1–13
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            $47 per pack · 50% commission per sale.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PACKS.map((product, i) => (
              <ProductCard key={product.folder} product={product} group="packs" index={i} />
            ))}
          </div>

          <h3 className="mt-12 text-xl font-bold text-gray-900">
            Master Resell ebooks (11)
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            $27 per ebook · 50% commission per sale.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EBOOKS.map((product, i) => (
              <ProductCard key={product.folder} product={product} group="ebooks" index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Banners */}
      <section className="bg-emerald-50/50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Promo banners
          </h2>
          <p className="mt-2 max-w-2xl text-base text-gray-600">
            Right-click any banner and choose “Save image as…” to download it and post
            it with your affiliate link.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6">
            {BANNERS.map((file, i) => (
              <figure
                key={file}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                <img
                  src={`${KIT_ROOT}/banners/${file}`}
                  alt={`HealthCopy Forge affiliate banner ${i + 1}`}
                  className="h-auto w-full rounded-lg"
                  loading="lazy"
                />
                <figcaption className="mt-2 text-center text-xs text-gray-500">
                  banner-{i + 1}.png
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">That is the whole kit</h2>
          <p className="mt-2 text-base text-gray-700">
            Keep your affiliate disclosure on every post and email, use the wording in
            the files as written, and there is nothing else to set up.
          </p>
          <a
            href="/affiliates"
            className="mt-5 inline-block rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Get your affiliate links
          </a>
        </div>
      </section>
    </main>
  );
}
