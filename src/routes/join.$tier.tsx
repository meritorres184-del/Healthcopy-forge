import { createFileRoute, Link } from "@tanstack/react-router";
import { getTier } from "../lib/tiers";

export const Route = createFileRoute("/join/$tier")({
  component: TierConfirmPage,
});

function TierConfirmPage() {
  const { tier } = Route.useParams();
  const selected = getTier(tier);

  if (!selected) {
    return (
      <main>
        <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Plan not found
            </h1>
            <p className="mt-4 text-gray-600">
              We couldn't find that membership plan. Choose one of the plans
              below.
            </p>
            <Link
              to="/join"
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-emerald-700"
            >
              Choose a Plan
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const formatAmount = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Confirm Your Plan
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {selected.name} Membership
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            {selected.tagline} — {formatAmount(selected.price)} per month,
            cancel anytime.
          </p>
        </div>
      </section>

      {/* Confirm card */}
      <section className="px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selected.name} Plan
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  {selected.description}
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                  ${selected.price}
                </span>
                <span className="ml-1 text-sm text-gray-400">/month</span>
              </div>
            </div>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
              What's included
            </h3>
            <ul className="mt-4 space-y-3">
              {selected.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
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
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                type="button"
                className="w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-emerald-700"
              >
                Proceed to Payment
              </button>
              <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm text-gray-600">
                Secure checkout is being finalized.
              </p>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3 text-sm text-gray-500">
              <Link
                to="/join"
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                ← Compare plans again
              </Link>
              <span>
                Need to see other options?{" "}
                <Link
                  to="/library"
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                >
                  Browse the library
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
