import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | HealthCopy Forge" },
      {
        name: "description",
        content:
          "Terms of Service for HealthCopy Forge — PLR licensing, payments, refunds, disclaimers, and contact details.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Legal
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: September 16, 2026
          </p>
        </div>
      </section>
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-gray-900">1. Agreement</h2>
            <p className="mt-2">
              These Terms of Service ("Terms") govern your use of the
              HealthCopy Forge website and your purchase of our digital content
              products. By using this website or purchasing a product, you
              agree to these Terms. If you do not agree, please do not use the
              site or purchase products.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              2. Products &amp; Delivery
            </h2>
            <p className="mt-2">
              HealthCopy Forge sells digital content products, including SEO-written
              health and wellness PLR article packs, ebooks, courses, and
              membership subscriptions. All products are delivered digitally via
              download. A separate license and medical disclaimer accompany each
              product and are part of what you receive.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              3. Payments &amp; Pricing
            </h2>
            <p className="mt-2">
              Current prices are displayed at checkout. Payments are processed
              securely through our payment providers. Membership subscriptions
              recur monthly until cancelled. You can cancel a membership at any
              time; access continues until the end of the paid period.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              4. Refunds &amp; Exchange
            </h2>
            <p className="mt-2">
              Because our products are delivered instantly as digital downloads,
              all sales are final unless required otherwise by law. If you
              experience a problem with your download, please contact support
              and we will help resolve it.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              5. PLR License
            </h2>
            <p className="mt-2">
              Each product is licensed under the PLR license included with it.
              In general, you may edit, customize, rebrand, and publish the
              content for your own use or your clients' use. You may not resell
              or redistribute the original unedited content as competing PLR,
              nor share the editable source files publicly. Your specific
              rights and restrictions are spelled out in the license that ships
              with each product — please read it.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              6. Not Medical Advice
            </h2>
            <p className="mt-2">
              Our content is written for informational and publishing purposes
              and is not intended to diagnose, treat, cure, or prevent any
              disease, nor to replace professional medical advice. Always
              consult a qualified health professional before making health
              decisions. Each product includes a medical disclaimer to that
              effect.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              7. Limitation of Liability
            </h2>
            <p className="mt-2">
              To the fullest extent permitted by law, HealthCopy Forge shall
              not be liable for any indirect, incidental, or consequential
              damages arising from your use of the website or any product
              purchased.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">8. Contact</h2>
            <p className="mt-2">
              Questions about these Terms? Contact us at{" "}
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