import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support | HealthCopy Forge" },
      {
        name: "description",
        content:
          "HealthCopy Forge support — help with downloads, PLR licensing, payments, and memberships. Find answers fast or contact us.",
      },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const faqs = [
    {
      q: "How do I access my content after purchase?",
      a: "Purchases are delivered instantly as digital downloads. After checkout you'll be able to download your pack's ZIP file directly from the site, and a download link is also emailed to the address you used at checkout. If you don't see it, check your spam folder first.",
    },
    {
      q: "What can I do with the PLR content?",
      a: "Under the PLR license included with every purchase, you may edit, customize, rebrand, and publish the content for your own use or your clients' use — blog posts, emails, social media, lead magnets, and more. You may not resell or redistribute the original unedited content as competing PLR or share the editable source files. The license that ships with your pack spells out the details.",
    },
    {
      q: "Can I use this on my own website and social media?",
      a: "Yes — that's exactly what it's for. Rewrite or use as-is, add your own branding, and publish it under your name. For health content, please keep the medical disclaimer included with your pack attached or adapted, and don't present informational content as personal medical advice.",
    },
    {
      q: "Do you offer refunds?",
      a: "Because our products are delivered instantly as digital downloads, all sales are final unless required otherwise by law. If you experience a problem with your download or purchase, contact us and we'll help resolve it.",
    },
    {
      q: "How do I cancel my membership?",
      a: "You can cancel a membership at any time — access continues until the end of the paid period, and you won't be charged again. If you need help cancelling, contact us.",
    },
    {
      q: "Is the content for informational or medical purposes?",
      a: "All content is written for informational and publishing purposes and is not intended to diagnose, treat, cure, or prevent any disease, nor to replace professional medical advice. Always consult a qualified health professional before making health decisions.",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Support
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            How Can We Help?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
            Answers to the questions we hear most — and a direct line to us if
            you need more.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-12 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-gray-900">{faq.q}</h2>
              <p className="mt-2 leading-relaxed text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-emerald-50 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Still Need Help?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-gray-600">
            Email us and we'll get back to you as soon as we can — usually
            within one business day.
          </p>
          <a
            href="mailto:healthcopy2026@gmail.com"
            className="mt-5 inline-block rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            healthcopy2026@gmail.com
          </a>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-gray-50 p-8">
          <h2 className="text-xl font-bold text-gray-900">Disclaimer</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600">
            <p>
              Please note that this product does not provide any guarantee of
              income or success. The results achieved by the product owner or
              any other individuals mentioned are not indicative of future
              success or earnings.
            </p>
            <p>
              This website is not affiliated with FaceBook or any of its
              associated entities. Once you navigate away from FaceBook, the
              responsibility for the content and its usage lies solely with the
              user.
            </p>
            <p>
              All content on this website, including but not limited to text,
              images, and multimedia, is protected by copyright law and the
              Digital Millennium Copyright Act. Unauthorized copying,
              duplication, modification, or theft, whether intentional or
              unintentional, is strictly prohibited. Violators will be
              prosecuted to the fullest extent of the law.
            </p>
            <p>
              We want to clarify that JVZoo serves as the retailer for the
              products featured on this site. JVZoo® is a registered trademark
              of BBC Systems Inc., a Florida corporation located at 1809 E.
              Broadway Street, Suite 125, Oviedo, FL 32765, USA, and is used
              with permission. The role of JVZoo as a retailer does not
              constitute an endorsement, approval, or review of these products
              or any claims, statements, or opinions used in their promotion.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}