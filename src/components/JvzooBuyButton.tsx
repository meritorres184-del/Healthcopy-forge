import type { JvzooProduct } from "../jvzoo";
// Canonical JVZoo buy block — the dashboard's "use your own button" code.
//
// Rendered exactly as JVZoo ships it:
//   <a href="https://jvzoo.com/b/0/{ID}/2" target="_blank"
//      rel="nofollow noopener noreferrer"><img src="https://i.jvzoo.com/0/{ID}/2"
//      border="0" alt="..." /></a>
//   <img src="https://i.jvzoo.com/0/{ID}/2" width="1" height="1" border="0" alt="" />
//
// The anchor image and the 1x1 tracking pixel are the same `/2` URL, and the
// link uses the bare `jvzoo.com` host — a JVZoo reviewer flagged the previous
// markup (www host, /1 button image) as non-canonical. Use this component
// everywhere a buy button is rendered so no page can drift; the build-time gate
// in scripts/verify-prerender.mjs checks every baked page for this shape.
export function JvzooBuyButton({
  product,
  imgClassName,
}: {
  product: JvzooProduct;
  imgClassName?: string;
}) {
  return (
    <>
      <a
        href={product.href}
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        <img
          src={product.btn}
          alt={product.alt}
          border="0"
          className={imgClassName}
        />
      </a>
      {/* JVZoo tracking pixel — the i.jvzoo.com part of the buy button code */}
      <img
        src={product.src}
        width="1"
        height="1"
        border="0"
        alt=""
        aria-hidden="true"
        className="pointer-events-none"
      />
    </>
  );
}
