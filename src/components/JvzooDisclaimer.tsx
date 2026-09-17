// JVZoo compliance disclaimer — required verbatim on every product sales page.
// Exact text supplied by JVZoo Compliance Team (income disclaimer, Facebook
// notice, DMCA copyright, retailer disclosure). Must be clear and conspicuous:
// rendered as ONE contiguous paragraph (no injected tags/breaks inside the
// text) at a readable size — never smaller than the page body copy.
const DISCLAIMER_TEXT =
  "Disclaimer: Please note that this product does not provide any guarantee of income or success. The results achieved by the product owner or any other individuals mentioned are not indicative of future success or earnings. This website is not affiliated with FaceBook or any of its associated entities. Once you navigate away from FaceBook, the responsibility for the content and its usage lies solely with the user. All content on this website, including but not limited to text, images, and multimedia, is protected by copyright law and the Digital Millennium Copyright Act. Unauthorized copying, duplication, modification, or theft, whether intentional or unintentional, is strictly prohibited. Violators will be prosecuted to the fullest extent of the law. We want to clarify that JVZoo serves as the retailer for the products featured on this site. JVZoo® is a registered trademark of BBC Systems Inc., a Florida corporation located at 1809 E. Broadway Street, Suite 125, Oviedo, FL 32765, USA, and is used with permission. The role of JVZoo as a retailer does not constitute an endorsement, approval, or review of these products or any claims, statements, or opinions used in their promotion.";

export function JvzooDisclaimer({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-center text-sm leading-relaxed text-gray-600">
          {DISCLAIMER_TEXT}
        </p>
      </div>
    );
  }
  return (
    <section className="bg-white px-4 pb-14 pt-2 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-base leading-relaxed text-gray-700">
          {DISCLAIMER_TEXT}
        </p>
      </div>
    </section>
  );
}