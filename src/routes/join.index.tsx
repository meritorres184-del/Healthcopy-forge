import { createFileRoute, Link } from "@tanstack/react-router";
import { TIERS } from "../lib/tiers";

export const Route = createFileRoute("/join/")({
  component: JoinPage,
});

function JoinPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Join the Membership
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Choose Your <span className="text-emerald-600">Membership Plan</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
            Pick the tier that fits your publishing volume. Both plans unlock the
            full library — the difference is how much fresh content lands each
            month.
          </p>
        </div>
      </section>

      {/* Tier comparison */}
      <section className="px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            {TIERS.map((tier) => (
              <div
                key={tier.slug}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg ${
                  tier.highlighted
                    ? "border-emerald-500 shadow-emerald-100"
                    : "border-gray-200"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 right-6 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                    Best Value
                  </span>
                )}
                <h2 className="text-xl font-bold text-gray-900">
                  {tier.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{tier.tagline}</p>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                    ${tier.price}
                  </span>
                  <span className="ml-1 text-sm text-gray-400">/month</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {tier.description}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <CheckIcon />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/join/$tier"
                  params={{ tier: tier.slug }}
                  className={`mt-8 block w-full rounded-xl px-6 py-3.5 text-center text-base font-semibold text-white shadow-md transition-all ${
                    tier.highlighted
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  Choose {tier.name}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Both plans include full library access, exclusive monthly drops, and
            you can cancel anytime. Secure checkout is being finalized — you'll
            confirm your plan on the next step.
          </p>
        </div>
      </section>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
