import { Fragment, type ReactNode } from "react";

// Shared product-copy renderer for the long, line-based descriptions this site
// sells: the article-pack descriptions (owner-written, stored in the database)
// and the ebook long descriptions (from the JVZoo posting kit, in
// src/lib/ebooks.ts).
//
// It renders the text VERBATIM. It adds no words, drops nothing and reorders
// nothing — it only decides block structure (blank line = new block, lines
// starting with "* " or "- " = a bullet list) and inline emphasis
// (**bold**, *italic*, `code`), which is how the owner and the kit write.
//
// Why this exists: rendering a line-based description as one run-on paragraph
// collapses the owner's bullets and paragraph breaks, which is exactly what a
// JVZoo reviewer reads as "missing text / wall of text".
type DescriptionBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

export function toDescriptionBlocks(text: string): DescriptionBlock[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const blocks: DescriptionBlock[] = [];
  for (const line of lines) {
    const bullet = /^([*-])\s+/.exec(line);
    if (bullet) {
      const last = blocks[blocks.length - 1];
      const item = line.slice(bullet[0].length).trim();
      if (last && last.kind === "ul") last.items.push(item);
      else blocks.push({ kind: "ul", items: [item] });
    } else {
      blocks.push({ kind: "p", text: line });
    }
  }
  return blocks;
}

// Inline emphasis only: **bold**, *italic*, `code`. Anything else — including a
// bare asterisk in the owner's copy — passes through untouched.
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;

function inline(text: string, keyBase: string): ReactNode[] {
  return text
    .split(INLINE)
    .filter((part) => part !== "")
    .map((part, index) => {
      const key = keyBase + "-" + String(index);
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={key} className="font-semibold text-gray-800">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code key={key} className="rounded bg-gray-100 px-1 text-[0.95em] text-gray-800">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return <em key={key}>{part.slice(1, -1)}</em>;
      }
      return <Fragment key={key}>{part}</Fragment>;
    });
}

export function ProductDescription({
  text,
  className = "mt-4 space-y-3",
}: {
  text: string;
  /** Wrapper classes; the default matches the pack sales pages. */
  className?: string;
}) {
  const blocks = toDescriptionBlocks(text);
  return (
    <div className={className}>
      {blocks.map((block, index) =>
        block.kind === "p" ? (
          <p key={index} className="text-lg leading-relaxed text-gray-600">
            {inline(block.text, "p" + String(index))}
          </p>
        ) : (
          <ul
            key={index}
            className="ml-5 list-disc space-y-1.5 text-base leading-relaxed text-gray-600"
          >
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{inline(item, "li" + String(index) + "-" + String(itemIndex))}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}
