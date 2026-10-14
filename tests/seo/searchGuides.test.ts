import test from "node:test";
import assert from "node:assert/strict";
import { SEARCH_GUIDES } from "../../data/seo/searchGuides.ts";
import { getToolBySlug } from "../../data/toolsRegistry.ts";
import { getToolEducationalContent } from "../../data/seo/faq.ts";
import { generateSlug } from "../../lib/tools/slugGenerator.ts";
import { removeSpecialChars } from "../../lib/tools/removeSpecialChars.ts";
import { removeExtraSpaces } from "../../lib/tools/removeExtraSpaces.ts";
import { removeDuplicateLines } from "../../lib/tools/removeDuplicateLines.ts";
import { stripHtmlTags } from "../../lib/tools/stripHtmlTags.ts";
import { minifyHtml } from "../../lib/tools/htmlMinifier.ts";
import { generateHash } from "../../lib/tools/hashGenerator.ts";

test("Published deterministic search examples match the actual tools", async () => {
  const transforms: Record<string, (input: string) => string | Promise<string>> = {
    "slug-generator": generateSlug,
    "remove-special-chars": removeSpecialChars,
    "remove-extra-spaces": removeExtraSpaces,
    "remove-duplicate-lines": removeDuplicateLines,
    "strip-html-tags": stripHtmlTags,
    "html-minifier": (input) => minifyHtml(input).minified,
    "hash-generator": async (input) => (await generateHash(input)).hash,
  };
  for (const [slug, transform] of Object.entries(transforms)) {
    const example = SEARCH_GUIDES[slug].example;
    assert.equal(await transform(example.input), example.output, slug);
  }
});

test("Search-intent FAQs reach the shared visible and structured-data source", () => {
  for (const [slug, guide] of Object.entries(SEARCH_GUIDES)) {
    const tool = getToolBySlug(slug)!;
    assert.ok(tool, slug);
    const content = getToolEducationalContent(tool.category, slug, tool.name);
    assert.ok(content.faqs.some((faq) => faq.question === guide.faq.question && faq.answer === guide.faq.answer), slug);
    if (tool.requiresAI) assert.match(guide.example.note, /[Ii]llustrative/);
  }
});
