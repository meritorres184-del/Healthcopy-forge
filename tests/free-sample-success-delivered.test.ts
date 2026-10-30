/**
 * The free sample is DELIVERED ON THE PAGE, not by email.
 *
 * Owner decision (2026-10-30): the MailerLite account has no verified sender and
 * no automation, so the old success copy — "Check your inbox — your sample
 * article is on its way" — promised an email that never existed. The success state
 * now thanks the visitor and links straight to /free-sample-article.
 *
 * These tests lock that in from both ends:
 *   - the form's success state carries a real href to the article page;
 *   - the old email promise is gone from the component, and the new copy promises
 *     nothing that does not happen;
 *   - the page it points at exists, is unlisted (noindex) and renders the article.
 *
 * Run with: bun test tests/free-sample-success-delivered.test.ts
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FAILURE_MESSAGE,
  FREE_SAMPLE_ARTICLE_HREF,
  SUCCESS_HINT,
  SUCCESS_LINK_LABEL,
  SUCCESS_MESSAGE,
  outcomeFor,
} from "../src/components/FreeSampleForm";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const COMPONENT = join(ROOT, "src/components/FreeSampleForm.tsx");
const PAGE = join(ROOT, "src/routes/free-sample-article.tsx");
const SITEMAP = join(ROOT, "public/sitemap.xml");

const componentSource = readFileSync(COMPONENT, "utf8");
const pageSource = readFileSync(PAGE, "utf8");

describe("free-sample success state delivers the article on the page", () => {
  test("the success state links to /free-sample-article", () => {
    expect(FREE_SAMPLE_ARTICLE_HREF).toBe("/free-sample-article");
    // The link is rendered from the constant, so it cannot drift from the route.
    expect(componentSource).toContain("href={FREE_SAMPLE_ARTICLE_HREF}");
    expect(componentSource).toContain("{SUCCESS_LINK_LABEL}");
    // …and the label is a real, readable call to action, not an empty anchor.
    expect(SUCCESS_LINK_LABEL.toLowerCase()).toContain("free sample article");
  });

  test("the old email promise is gone from the component", () => {
    expect(componentSource).not.toContain("Check your inbox");
    expect(componentSource.toLowerCase()).not.toContain("on its way");
  });

  test("the success copy promises only what happens", () => {
    // Nothing about an inbox, a send, or a delivery — the sample is right here.
    const promise =
      /inbox|on its way|we'll send|we will send|sent to|delivered|arriving|check your/i;
    expect(SUCCESS_MESSAGE).not.toMatch(promise);
    expect(SUCCESS_HINT).not.toMatch(promise);
    // And it does say the sample is ready, and that nothing is sent.
    expect(SUCCESS_MESSAGE.toLowerCase()).toContain("free sample article");
    expect(SUCCESS_HINT.toLowerCase()).toContain("nothing is sent");
  });

  test("a successful signup yields the success outcome; a failed one still does not", () => {
    expect(outcomeFor({ subscribed: true })).toEqual({
      status: "success",
      message: SUCCESS_MESSAGE,
    });
    // The PR #60 failure state is untouched.
    expect(outcomeFor({ subscribed: false })).toEqual({
      status: "error",
      message: FAILURE_MESSAGE,
    });
    expect(FAILURE_MESSAGE).toBe(
      "We couldn't add you to our list just now. Please try again in a moment.",
    );
  });
});

describe("/free-sample-article is the page the form points at", () => {
  test("the route exists and is registered at exactly that path", () => {
    expect(pageSource).toContain('createFileRoute("/free-sample-article")');
    expect(pageSource).toContain(
      'export const FREE_SAMPLE_ARTICLE_PATH = "/free-sample-article"',
    );
  });

  test("it is unlisted: noindex, not in the sitemap, not in any nav", () => {
    expect(pageSource).toContain('content: "noindex, nofollow"');
    expect(readFileSync(SITEMAP, "utf8")).not.toContain("/free-sample-article");
    // Not in the shared header/footer navigation.
    const root = readFileSync(join(ROOT, "src/routes/__root.tsx"), "utf8");
    expect(root).not.toContain("/free-sample-article");
  });

  test("it carries the brand line and never an author name", () => {
    expect(pageSource).toContain("Published by HealthCopy Forge");
    // Standing owner rule: PLR content is brand-only, no author byline anywhere.
    expect(pageSource).not.toMatch(/written by|author:|byline/i);
    const publishedBy = pageSource.match(/Published by [^"\n]+/g) ?? [];
    expect(publishedBy).toEqual(["Published by HealthCopy Forge"]);
  });
});
