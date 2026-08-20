import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/purchase/success")({
  component: PurchaseSuccessPage,
});

function PurchaseSuccessPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-10 w-10 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Thank You For Your Purchase!
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Your payment was successful. Check your email for download
          instructions — your content pack will be delivered straight to your
          inbox.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/packs"
            className="inline-flex items-center rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700"
          >
            Browse More Packs
          </Link>
          <Link
            to="/"
            className="inline-flex items-center rounded-xl border-2 border-gray-200 px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-emerald-200 hover:text-emerald-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
