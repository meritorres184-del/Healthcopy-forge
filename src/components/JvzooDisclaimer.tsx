// JVZoo compliance disclaimer — required on every product sales page.
// Full required text (income/earnings disclaimer, Facebook notice, copyright/DMCA,
// retailer disclosure) per JVZoo Compliance Team: must be clear and conspicuous,
// no smaller font. Do NOT shrink this text below ~text-sm on sales pages.
export function JvzooDisclaimer({ compact }: { compact?: boolean }) {
  const text = (
    <>
      Disclaimer: Please note that this product does not provide any guarantee of
      income or success. The results achieved by the product owner or any other
      individuals mentioned are not indicative of future success or earnings.
      This website is not affiliated with FaceBook or any of its associated
      entities. Once you navigate away from FaceBook, the responsibility for the
      content and its usage lies solely with the user. All content on this
      website, including but not limited to text, images, and multimedia, is
      protected by copyright law and the Digital Millennium Copyright Act.
      Unauthorized copying, duplication, modification, or theft, whether
      intentional or unintentional, is strictly prohibited. Violators will be
      prosecuted to the fullest extent of the law.
      <br className="hidden sm:block" />
      <br className="sm:hidden" />
      We want to clarify that JVZoo serves as the retailer for the products
      featured on this site. JVZoo® is a registered trademark of BBC Systems
      Inc., a Florida corporation located at 1809 E. Broadway Street, Suite 125,
      Oviedo, FL 32765, USA, and is used with permission. The role of JVZoo as a
      retailer does not constitute an endorsement, approval, or review of these
      products or any claims, statements, or opinions used in their promotion.
    </>
  );
  if (compact) {
    return (
      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-center text-xs leading-relaxed text-gray-500">
          {text}
        </p>
      </div>
    );
  }
  return (
    <section className="bg-white px-4 pb-14 pt-2 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <p className="text-center text-sm leading-relaxed text-gray-600">
          {text}
        </p>
      </div>
    </section>
  );
}