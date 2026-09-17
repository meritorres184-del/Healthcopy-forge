// JVZoo retailer disclosure — required on every product sales page.
// Text matches the standalone /disclaimer page (Jvzoo retailer paragraph).
export function JvzooDisclaimer({ compact }: { compact?: boolean }) {
  const text = (
    <>
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
        <p className="text-center text-[10px] leading-relaxed text-gray-400">
          {text}
        </p>
      </div>
    );
  }
  return (
    <section className="bg-white px-4 pb-14 pt-2 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <p className="text-center text-xs leading-relaxed text-gray-400">
          {text}
        </p>
      </div>
    </section>
  );
}