import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/downloads")({
  component: DownloadsPage,
});

function DownloadsPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Content Library
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Content Pack Downloads
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Every article pack in the HealthCopy Forge library, ready to download
            as a single ZIP. Each pack contains the full set of assets — articles,
            email swipes, social media posts, lead magnet, license, and
            disclaimers.
          </p>
        </div>
      </section>

      {/* Download list */}
      <section className="px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="divide-y divide-gray-100">
              {packs.map((pack) => (
                <div
                  key={pack.file}
                  className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
                >
                  {/* Cover thumbnail */}
                  <div className="flex h-20 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-emerald-50 to-white">
                    {pack.cover ? (
                      <img
                        src={pack.cover}
                        alt={`${pack.title} bookcover`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold text-emerald-600">
                        Pack {pack.number}
                      </span>
                    )}
                  </div>

                  {/* Title & meta */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        Pack {pack.number}
                      </span>
                      <span className="text-xs text-gray-400">{pack.size}</span>
                    </div>
                    <h3 className="mt-1.5 font-semibold text-gray-900">
                      {pack.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">{pack.file}</p>
                  </div>

                  {/* Download button */}
                  <a
                    href={`/zips/${pack.file}`}
                    download
                    className="inline-flex flex-shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v10m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                      />
                    </svg>
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Missing a pack or a file? Contact us and we&rsquo;ll get it to you.
          </p>

          <div className="mt-6 text-center">
            <Link
              to="/packs"
              className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              ← Back to Content Packs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- Data ---

const packs = [
  {
    number: 1,
    title: "Nutrition & Everyday Wellness",
    file: "article-pack-1-nutrition-everyday-wellness.zip",
    size: "8.4 MB",
    cover: "/covers/pack-1-1.jpg",
  },
  {
    number: 2,
    title: "Supplements & Nutritional Support",
    file: "article-pack-2-supplements-nutritional-support.zip",
    size: "4.5 MB",
    cover: "/covers/pack-2-1.jpg",
  },
  {
    number: 3,
    title: "Fitness & Exercise",
    file: "article-pack-3-fitness-exercise.zip",
    size: "5.4 MB",
    cover: "/covers/pack-3-1.jpg",
  },
  {
    number: 4,
    title: "Sleep & Recovery",
    file: "article-pack-4-sleep-recovery.zip",
    size: "5.3 MB",
    cover: "/covers/pack-4-1.jpg",
  },
  {
    number: 5,
    title: "Stress Management",
    file: "article-pack-5-stress-management.zip",
    size: "7.0 MB",
    cover: "/covers/pack-5-1.jpg",
  },
  {
    number: 6,
    title: "Healthy Aging",
    file: "article-pack-6-healthy-aging.zip",
    size: "25.6 MB",
    cover: "/covers/pack-6-1.jpg",
  },
  {
    number: 7,
    title: "Natural & Holistic Wellness",
    file: "article-pack-7-natural-holistic-wellness.zip",
    size: "20.1 MB",
    cover: "/covers/pack-7.jpg",
  },
  {
    number: 8,
    title: "Product Reviews & Buying Guides",
    file: "article-pack-8-product-reviews-buying-guides.zip",
    size: "0.4 MB",
    cover: null,
  },
];;