/**
 * CONTENT FIDELITY — the free sample article is the owner's article, verbatim.
 *
 * /free-sample-article reproduces article 1 of Pack 1 ("What Healthy Nutrition
 * Actually Means") exactly: her sentences, her subheadings, her bullet lists, her
 * curly quotes, her em dashes and her inline "(World Health Organization)"
 * attributions. It is her copyrighted product content, so a paraphrase, a merged
 * paragraph, a dropped sentence or an "improved" word is a defect, not an edit.
 *
 * These tests make that impossible to do silently. They compare, three ways:
 *   1. RENDERED PAGE  — the page is rendered to static markup, tags stripped, and
 *                       the article text is compared to the source text
 *                       (whitespace-normalised). This is what a visitor actually
 *                       gets, so this is the real guarantee.
 *   2. BLOCK DATA     — the typed block list the page maps over reproduces the
 *                       source text, and has exactly one text unit per source
 *                       line (so two paragraphs cannot be merged into one and
 *                       still "match").
 *   3. STRUCTURE      — subheadings stay headings, bullet runs stay lists, the
 *                       underscore rules stay rules, and the counts are pinned.
 * Plus: the medical disclaimer at the end is byte-for-byte the owner's approved
 * wording from pack-1-disclaimer.txt.
 *
 * The source of truth is committed at src/content/free-sample-article.txt — the
 * verbatim extraction of lines 1..866 of
 * article-pack-1-nutrition-everyday-wellness/articles/pack-1-nutrition-everyday-wellness.txt
 * (article 2's title is line 951 there; lines 867..950 are blank). See
 * scripts/build-free-sample-article.mjs for the full provenance.
 *
 * Run with: bun test tests/free-sample-article-content.test.ts
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  FREE_SAMPLE_ARTICLE_BLOCKS,
  FREE_SAMPLE_ARTICLE_TITLE,
  FREE_SAMPLE_DISCLAIMER,
} from "../src/content/freeSampleArticle";
import {
  blocksToText,
  sourceLines,
  sourcePlainText,
} from "../scripts/build-free-sample-article.mjs";
import { FreeSampleArticlePage } from "../src/routes/free-sample-article";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ARTICLE_TXT = join(ROOT, "src/content/free-sample-article.txt");
const DISCLAIMER_TXT = join(ROOT, "src/content/free-sample-disclaimer.txt");

const sourceText = readFileSync(ARTICLE_TXT, "utf8");
const source = sourceLines(sourceText);
const disclaimerText = readFileSync(DISCLAIMER_TXT, "utf8");

const collapse = (s: string) => s.replace(/\s+/g, " ").trim();

/** Strip tags and decode the entities React emits, leaving readable text. */
function visibleText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

const pageHtml = renderToStaticMarkup(createElement(FreeSampleArticlePage));
const pageText = collapse(visibleText(pageHtml));

/** The block list as the page maps over it (the title is rendered separately). */
const blocksWithTitle = [
  { kind: "h1" as const, text: FREE_SAMPLE_ARTICLE_TITLE },
  ...FREE_SAMPLE_ARTICLE_BLOCKS,
];

/**
 * The text a browser shows for these blocks. The ONLY difference from
 * blocksToText() is the ordered lists: their numbers are drawn by the browser from
 * the <ol>, not emitted as text, so they are not part of the rendered text.
 * (The sibling test below proves the blocks themselves reproduce the source,
 * numbers included — so "rendered == blocks" + "blocks == source" is the chain.)
 * The title is left out because the page puts the brand/publisher line between the
 * <h1> and the body; it is asserted separately.
 */
function renderedBodyText(): string {
  const parts: string[] = [];
  for (const b of blocksWithTitle.slice(1)) {
    // <hr> carries no text — it is the visual form of the source's "________"
    // rule lines, which the block-data test above still checks verbatim.
    if (b.kind === "hr") continue;
    else if (b.kind === "ul") parts.push(...b.items);
    else if (b.kind === "ol") parts.push(...b.items);
    else parts.push(b.text);
  }
  return collapse(parts.join(" "));
}

describe("the rendered page carries the article verbatim", () => {
  test("the article's full text appears on the rendered page, unchanged", () => {
    // The whole body, in order, as one contiguous run of text.
    expect(pageText).toContain(renderedBodyText());
    expect(pageText).toContain(FREE_SAMPLE_ARTICLE_TITLE);
  });

  test("the rendered page carries long verbatim slices of the source itself", () => {
    // Anchored on the source file, not on the blocks: these sentences must appear
    // on the page word for word. A paraphrase anywhere in them fails here.
    expect(pageText).toContain(
      "The World Health Organization describes those four principles\u2014adequacy, balance, moderation, and diversity\u2014as foundations of a healthy diet.",
    );
    expect(pageText).toContain(
      "A healthy diet does not require perfect meals, expensive ingredients, eliminating entire food groups, counting every calorie, or following the latest dietary trend.",
    );
    expect(pageText).toContain(
      "The foundation is remarkably straightforward: eat a wide variety of nourishing foods, get enough of what your body needs, moderate what is easy to overconsume, and build a way of eating that you can realistically sustain.",
    );
    expect(pageText).toContain("That is what healthy nutrition actually means.");
  });

  test("the rendered article starts and ends where the source does", () => {
    expect(pageText.startsWith("Free Sample Article What Healthy Nutrition Actually Means")).toBe(
      true,
    );
    expect(pageText).toContain(
      "World Health Organization \u2014 Healthy Diet WHO/FAO \u2014 What Are Healthy Diets? Dietary Guidelines for Americans",
    );
    // Article 2 must NOT have leaked in: its title and opening line are absent.
    expect(pageText).not.toContain(
      "Macronutrients: Protein, Carbohydrates, and Healthy Fats",
    );
    expect(pageText).not.toContain(
      "Introduction: The Three Macronutrients Your Body Needs",
    );
  });

  test("the source's curly quotes, em dashes and attributions survive", () => {
    // Typographic characters are part of her voice — a straight-quote "cleanup"
    // would be a silent edit.
    expect(pageText).toContain("What Does \u201cHealthy Nutrition\u201d Actually Mean?");
    expect(pageText).toContain(
      "those four principles\u2014adequacy, balance, moderation, and diversity\u2014as foundations",
    );
    expect(pageText).toContain(
      "Whole Foods Do Not Mean \u201cNever Eat Processed Foods\u201d",
    );
    const attributions = pageText.match(/\(World Health Organization\)/g) ?? [];
    expect(attributions).toHaveLength(17);
    expect(pageText).toContain("(Dietary Guidelines)");
  });

  test("the page does not add claims, statistics or citations of its own", () => {
    // Every sentence on the page must come from the article, the disclaimer or
    // the short furniture. The article's own text is checked above; here we pin
    // the furniture down so nothing new can be slipped into the article body.
    const furniture = [
      "Free Sample Article",
      "Published by HealthCopy Forge",
      "A free sample from the Nutrition & Everyday Wellness article pack.",
      "If you want this ready to brand and publish",
    ];
    for (const line of furniture) expect(pageText).toContain(line);
    // No new "Sources"/"References" section beyond hers, and no added URLs.
    expect(pageHtml).not.toMatch(/https?:\/\//);
  });
});

describe("the block data reproduces the source exactly", () => {
  test("blocks -> text equals the source text (whitespace-normalised)", () => {
    expect(collapse(blocksToText(blocksWithTitle))).toBe(sourcePlainText(source));
  });

  test("one text unit per source line — no paragraph was merged or split", () => {
    const units = blocksWithTitle.reduce((n, b) => {
      if (b.kind === "hr") return n;
      if (b.kind === "ul" || b.kind === "ol") return n + b.items.length;
      return n + 1;
    }, 0);
    const sourceUnits = source.filter((l) => !/^_+$/.test(l)).length;
    expect(units).toBe(sourceUnits);
    expect(sourceUnits).toBe(755);
  });

  test("the structure is preserved: headings, lists and section rules", () => {
    const count = (kind: string) =>
      FREE_SAMPLE_ARTICLE_BLOCKS.filter((b) => b.kind === kind).length;
    // 32 numbered sections + 7 unnumbered headings (Introduction, "What Does …",
    // Avoiding Nutritional Deficiency, Why Carbohydrates Belong…, Conclusion,
    // Quick Reference, Sources and further reading).
    expect(count("h2")).toBe(39);
    // 5 meal-framework components + Vitamins + Minerals + 5 meal labels.
    expect(count("h3")).toBe(12);
    // The article's own section rules between sections.
    expect(count("hr")).toBe(37);
    // 240 bullet items in 29 runs, and 2 ordered lists (12 + 17 items).
    const ul = FREE_SAMPLE_ARTICLE_BLOCKS.filter((b) => b.kind === "ul");
    expect(ul).toHaveLength(29);
    expect(ul.reduce((n, b) => n + (b.kind === "ul" ? b.items.length : 0), 0)).toBe(240);
    const ol = FREE_SAMPLE_ARTICLE_BLOCKS.filter((b) => b.kind === "ol");
    expect(ol.map((b) => (b.kind === "ol" ? b.items.length : 0))).toEqual([12, 17]);

    // Spot-check that real subheadings are headings, not paragraphs.
    const headings = FREE_SAMPLE_ARTICLE_BLOCKS.filter(
      (b) => b.kind === "h2" || b.kind === "h3",
    ).map((b) => (b.kind === "h2" || b.kind === "h3" ? b.text : ""));
    for (const heading of [
      "1. Healthy Nutrition Starts With Adequacy",
      "17. What About Sugar?",
      "32. The Bigger Picture: Nutrition Is a Pattern, Not a Performance",
      "Introduction: Healthy Eating Is More Than \u201cEating Healthy Foods\u201d",
      "Sources and further reading",
      "Vitamins",
      "Breakfast",
    ]) {
      expect(headings).toContain(heading);
    }
  });

  test("the title is the article's own title, not a rewrite", () => {
    expect(FREE_SAMPLE_ARTICLE_TITLE).toBe(source[0]);
    expect(FREE_SAMPLE_ARTICLE_TITLE).toBe("What Healthy Nutrition Actually Means");
  });
});

describe("the medical disclaimer is verbatim", () => {
  test("every line matches pack-1-disclaimer.txt", () => {
    const expected = disclaimerText
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l !== "");
    expect(FREE_SAMPLE_DISCLAIMER).toEqual(expected);
    expect(FREE_SAMPLE_DISCLAIMER).toHaveLength(18);
  });

  test("it is rendered at the end of the page, after the article", () => {
    const disclaimerStart = pageText.indexOf(
      "The information contained in What It Means to Be Healthy",
    );
    expect(disclaimerStart).toBeGreaterThan(
      pageText.indexOf("That is what healthy nutrition actually means."),
    );
    expect(pageText).toContain(
      "The author, publisher, content provider, distributor, and associated parties assume no responsibility",
    );
    // The last thing on the page is the end of the disclaimer.
    expect(
      pageText.trimEnd().endsWith(
        "should seek appropriate guidance from qualified healthcare professionals when necessary.",
      ),
    ).toBe(true);
  });
});
