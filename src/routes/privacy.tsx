import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | HealthCopy Forge" },
      {
        name: "description",
        content:
          "Privacy Policy for HealthCopy Forge — what information we collect, how we use it, and your choices.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Legal
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: September 16, 2026
          </p>
        </div>
      </section>
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              When you sign up for our newsletter, request a free sample, or
              make a purchase, we collect the information you provide — such as
              your name and email address. We do not collect payment card
              numbers; payments are handled securely by our payment providers.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              2. How We Use Your Information
            </h2>
            <p className="mt-2">
              We use your information to deliver the content you requested,
              process your purchases, send you updates and promotional emails
              you have opted into, and improve our products. You can
              unsubscribe from emails at any time using the link in any email
              we send.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              3. Sharing Your Information
            </h2>
            <p className="mt-2">
              We do not sell your personal information. We share information
              only with the service providers that power this business — such
              as our email delivery and payment processing services — and only
              as necessary to operate the site and deliver our products.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              4. Data Security
            </h2>
            <p className="mt-2">
              We take reasonable measures to protect the information we hold.
              No method of transmission over the internet is perfectly secure,
              so we cannot guarantee absolute security.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              5. Your Choices
            </h2>
            <p className="mt-2">
              You may unsubscribe from our emails at any time, and you may
              contact us to request access to, correction of, or deletion of the
              personal information we hold about you.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              6. Changes to This Policy
            </h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. The "Last
              updated" date at the top reflects the most recent change.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">7. Contact</h2>
            <p className="mt-2">
              Questions about privacy? Contact us at{" "}
              <a
                href="mailto:support@healthcopyforge.com"
                className="text-emerald-600 hover:underline"
              >
                support@healthcopyforge.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}