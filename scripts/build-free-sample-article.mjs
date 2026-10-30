#!/usr/bin/env node
// GENERATOR — the free-sample article's block data, from the verbatim source.
//
// WHY A GENERATOR: /free-sample-article must show the owner's article EXACTLY as
// she wrote it — no paraphrase, no merged sentences, no dropped bullets. Hand
// copying ~790 lines into JSX is how a word gets lost. So the text is committed
// once, verbatim (src/content/free-sample-article.txt), and this script turns it
// into the typed block list the page renders. Re-run it after re-extracting the
// source; never hand-edit the generated module.
//
// PROVENANCE OF THE SOURCE TEXT (pack 1, article 1 — "What Healthy Nutrition
// Actually Means"):
//   /home/team/shared/content-packs/article-pack-1-nutrition-everyday-wellness/
//     articles/pack-1-nutrition-everyday-wellness.txt
//   * The extraction is lines 1..866 of that file (BOM stripped, CRLF -> LF).
//   * Line 951 of that file is article 2's title, "Macronutrients: Protein,
//     Carbohydrates, and Healthy Fats", immediately followed on line 952 by
//     "Introduction: The Three Macronutrients Your Body Needs". Lines 867..950
//     are blank, so 866 ("Dietary Guidelines for Americans", the last line of
//     article 1's "Sources and further reading" list) is the true end of article 1.
//   * Nothing else was changed: curly quotes, em dashes and the inline
//     "(World Health Organization)" / "(Dietary Guidelines)" attributions are
//     byte-for-byte as written.
//   Disclaimer: pack-1-disclaimer.txt, verbatim.
//
// HOW THE STRUCTURE IS DECIDED (the source is a flat Google-Docs text export:
// one paragraph per line, headings indistinguishable from paragraphs by markup,
// so they are recognised by shape):
//   * line 1                                   -> h1 (the article title)
//   * a line of underscores                    -> hr (the article's section rule)
//   * "* item"                                 -> bullet in a <ul> run
//   * "N. Heading" where N is the NEXT section
//     number in sequence, and no trailing "."  -> h2 (the article's 32 numbered
//     sections). The sequence test is what keeps the numbered *lists* out: after
//     section 13 the next numbered line is "1. A protein source", which is not 14.
//   * "N. text" that is NOT a section heading:
//       - followed by "N+1. ..."               -> an ordered list (<ol>) run, the
//                                                 numbers being re-rendered by the
//                                                 browser (they are 1..N exactly)
//       - otherwise                            -> h3 (the five components of
//                                                 section 13's meal framework)
//   * the handful of unnumbered headings       -> h2/h3 from the explicit sets
//                                                 below (they are listed by exact
//                                                 text, and the run FAILS if one
//                                                 is missing, so a re-extraction
//                                                 that shifts them is caught)
//   * everything else                          -> p (one per source line, which is
//                                                 exactly one paragraph in the
//                                                 export)
//
// Usage: node scripts/build-free-sample-article.mjs   (or: bun run …)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ARTICLE_TXT = join(ROOT, "src/content/free-sample-article.txt");
const DISCLAIMER_TXT = join(ROOT, "src/content/free-sample-disclaimer.txt");
const OUT = join(ROOT, "src/content/freeSampleArticle.ts");

// The article's unnumbered headings, by exact text (see the header note).
const H2_BY_TEXT = new Set([
  "Introduction: Healthy Eating Is More Than \u201cEating Healthy Foods\u201d",
  "What Does \u201cHealthy Nutrition\u201d Actually Mean?",
  "Avoiding Nutritional Deficiency",
  "Why Carbohydrates Belong in a Healthy Diet",
  "Conclusion: Healthy Nutrition Is Simpler Than It Sounds",
  "Quick Reference: The Principles of Healthy Nutrition",
  "Sources and further reading",
]);
const H3_BY_TEXT = new Set([
  "Vitamins",
  "Minerals",
  "Breakfast",
  "Lunch",
  "Snack",
  "Dinner",
  "Dessert",
]);

const SECTION_HEADING = /^(\d+)\.\s+(\S.*)$/;
const BULLET = /^\* (.*)$/;
const RULE = /^_+$/;

/** Split the committed source into its non-blank lines. */
export function sourceLines(text) {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .filter((l) => l.trim() !== "");
}

/** Classify the source lines into render blocks. Pure — the test re-uses it. */
export function buildBlocks(lines) {
  const blocks = [];
  const seenH2 = new Set();
  const seenH3 = new Set();
  let nextSection = 1; // the next numbered section heading we expect (1..32)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (blocks.length === 0) {
      blocks.push({ kind: "h1", text: line });
      continue;
    }
    if (RULE.test(line)) {
      blocks.push({ kind: "hr" });
      continue;
    }
    const bullet = BULLET.exec(line);
    if (bullet) {
      const items = [bullet[1]];
      while (i + 1 < lines.length && BULLET.test(lines[i + 1])) {
        i += 1;
        items.push(BULLET.exec(lines[i])[1]);
      }
      blocks.push({ kind: "ul", items });
      continue;
    }
    const numbered = SECTION_HEADING.exec(line);
    if (numbered) {
      const n = Number(numbered[1]);
      if (n === nextSection && !line.endsWith(".")) {
        nextSection += 1;
        blocks.push({ kind: "h2", text: line });
        continue;
      }
      // A numbered run of 2+ consecutive items is an ordered list; the numbers
      // must be 1,2,3,… so re-rendering them from the list position is exact.
      const run = [line];
      let j = i;
      while (j + 1 < lines.length) {
        const nxt = SECTION_HEADING.exec(lines[j + 1]);
        if (!nxt) break;
        const expected = Number(SECTION_HEADING.exec(run[run.length - 1])[1]) + 1;
        if (Number(nxt[1]) !== expected) break;
        j += 1;
        run.push(lines[j]);
      }
      if (run.length > 1) {
        if (Number(SECTION_HEADING.exec(run[0])[1]) !== 1) {
          throw new Error(
            `ordered list starting at ${SECTION_HEADING.exec(run[0])[1]}, not 1: ${run[0]}`,
          );
        }
        blocks.push({
          kind: "ol",
          items: run.map((r) => SECTION_HEADING.exec(r)[2]),
        });
        i = j;
        continue;
      }
      blocks.push({ kind: "h3", text: line });
      continue;
    }
    if (H2_BY_TEXT.has(line)) {
      seenH2.add(line);
      blocks.push({ kind: "h2", text: line });
      continue;
    }
    if (H3_BY_TEXT.has(line)) {
      seenH3.add(line);
      blocks.push({ kind: "h3", text: line });
      continue;
    }
    blocks.push({ kind: "p", text: line });
  }

  for (const text of H2_BY_TEXT) {
    if (!seenH2.has(text)) throw new Error(`missing expected h2 heading: ${text}`);
  }
  for (const text of H3_BY_TEXT) {
    if (!seenH3.has(text)) throw new Error(`missing expected h3 heading: ${text}`);
  }
  if (nextSection !== 33) {
    throw new Error(
      `expected 32 numbered sections, found ${nextSection - 1} (next was ${nextSection})`,
    );
  }
  return blocks;
}

/** Flatten blocks back to plain text — the inverse the content test compares. */
export function blocksToText(blocks) {
  const out = [];
  for (const b of blocks) {
    if (b.kind === "hr") out.push("________________");
    else if (b.kind === "ul") out.push(...b.items);
    else if (b.kind === "ol") out.push(...b.items.map((t, i) => `${i + 1}. ${t}`));
    else out.push(b.text);
  }
  return out.join(" ");
}

const collapse = (s) => s.replace(/\s+/g, " ").trim();

/**
 * The source's plain text, for comparison with blocksToText(): the only thing
 * dropped is the "* " bullet MARKER (the marker is structure — it becomes a <ul>
 * — while the item text itself is kept verbatim). Ordered-list numbers and the
 * underscore rules stay, because those are reproduced too.
 */
export function sourcePlainText(lines) {
  return collapse(lines.map((l) => l.replace(/^\* /, "")).join(" "));
}

function ts(value) {
  // JSON.stringify gives a valid TS string literal and escapes the curly quotes
  // and em dashes as \uXXXX, which keeps the generated file pure ASCII (no
  // encoding accidents when the repo is checked out anywhere).
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, (c) => {
    return "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0");
  });
}

function main() {
  const articleText = readFileSync(ARTICLE_TXT, "utf8");
  const disclaimerText = readFileSync(DISCLAIMER_TXT, "utf8");
  const lines = sourceLines(articleText);
  const blocks = buildBlocks(lines);

  // Self-check: the blocks must reproduce the source exactly (whitespace aside).
  const rebuilt = collapse(blocksToText(blocks));
  const original = sourcePlainText(lines);
  if (rebuilt !== original) {
    throw new Error(
      "block list does not reproduce the source text — refusing to write the module",
    );
  }

  const disclaimerParagraphs = disclaimerText
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");

  const counts = blocks.reduce((acc, b) => {
    acc[b.kind] = (acc[b.kind] || 0) + 1;
    return acc;
  }, {});

  const body = `// GENERATED FILE — do not edit by hand.
//
// Produced by scripts/build-free-sample-article.mjs from the verbatim source in
// src/content/free-sample-article.txt (pack 1, article 1 — "What Healthy Nutrition
// Actually Means", source lines 1..866 of
// article-pack-1-nutrition-everyday-wellness/articles/pack-1-nutrition-everyday-wellness.txt)
// and src/content/free-sample-disclaimer.txt (pack-1-disclaimer.txt).
//
// The article is the owner's own copyrighted product content. It is reproduced
// EXACTLY: tests/free-sample-article-content.test.ts rebuilds the plain text from
// these blocks and compares it, whitespace-normalised, to the source file, so a
// paraphrase, a dropped sentence or a merged paragraph fails the test suite.
//
// Re-generate with: node scripts/build-free-sample-article.mjs

export type ArticleBlock =
  | { kind: "h1"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "hr" };

/** The article title, exactly as the owner wrote it. */
export const FREE_SAMPLE_ARTICLE_TITLE = ${ts(blocks[0].text)};

/** Body blocks after the title: headings, paragraphs, lists and section rules. */
export const FREE_SAMPLE_ARTICLE_BLOCKS: ArticleBlock[] = [
${blocks
  .slice(1)
  .map((b) =>
    b.kind === "ul" || b.kind === "ol"
      ? `  { kind: ${ts(b.kind)}, items: [\n${b.items.map((t) => `    ${ts(t)},`).join("\n")}\n  ] },`
      : b.kind === "hr"
        ? `  { kind: "hr" },`
        : `  { kind: ${ts(b.kind)}, text: ${ts(b.text)} },`,
  )
  .join("\n")}
];

/** The owner's approved medical disclaimer, verbatim, one entry per line. */
export const FREE_SAMPLE_DISCLAIMER: string[] = [
${disclaimerParagraphs.map((t) => `  ${ts(t)},`).join("\n")}
];
`;

  writeFileSync(OUT, body, "utf8");
  console.log(`wrote ${OUT}`);
  console.log(
    `  ${blocks.length} blocks: ` +
      Object.entries(counts)
        .map(([k, v]) => `${v} ${k}`)
        .join(", "),
  );
  console.log(`  ${disclaimerParagraphs.length} disclaimer lines`);
  console.log("  source text reproduced exactly: yes");
}

// Only build when run directly — the content test imports the helpers above.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
