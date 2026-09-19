import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer | HealthCopy Forge" },
      {
        name: "description",
        content:
          "HealthCopy Forge disclaimer — no guarantee of income or success, Facebook affiliation notice, copyright notice, and JVZoo retailer disclosure.",
      },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Legal
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Disclaimer
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: September 16, 2026
          </p>
        </div>
      </section>
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-gray-700">
          <p>
            Please note that this product does not provide any guarantee of
            income or success. The results achieved by the product owner or any
            other individuals mentioned are not indicative of future success or
            earnings.
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
            unintentional, is strictly prohibited. Violators will be prosecuted
            to the fullest extent of the law.
          </p>
          <p>
            We want to clarify that JVZoo serves as the retailer for the
            products featured on this site. JVZoo® is a registered trademark of
            BBC Systems Inc., a Florida corporation located at 1809 E.
            Broadway Street, Suite 125, Oviedo, FL 32765, USA, and is used with
            permission. The role of JVZoo as a retailer does not constitute an
            endorsement, approval, or review of these products or any claims,
            statements, or opinions used in their promotion.
          </p>
        </div>
      </section>
    </main>
  );
}