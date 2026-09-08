import test from "node:test";
import assert from "node:assert/strict";
import { TOOLS_REGISTRY, getAllTools } from "../data/toolsRegistry.ts";
import {
  TOOL_SPECIFIC_CONTENT,
  getToolEducationalContent,
} from "../data/toolFaqs.ts";

test("Tool FAQs - Coverage for All Registered Tools", () => {
  const allTools = getAllTools();
  assert.equal(allTools.length, 43, "Should have exactly 43 tools in registry");

  for (const tool of allTools) {
    const specific = TOOL_SPECIFIC_CONTENT[tool.slug];
    assert.ok(
      specific,
      `Tool '${tool.slug}' (${tool.name}) must have an entry in TOOL_SPECIFIC_CONTENT`
    );

    // Verify How-to steps
    assert.ok(
      Array.isArray(specific.howToSteps) && specific.howToSteps.length >= 3,
      `Tool '${tool.slug}' must have at least 3 how-to steps`
    );
    for (const step of specific.howToSteps) {
      assert.ok(step.trim().length > 10, `Step in '${tool.slug}' too short: ${step}`);
    }

    // Verify Features
    assert.ok(
      Array.isArray(specific.features) && specific.features.length >= 3,
      `Tool '${tool.slug}' must have at least 3 features`
    );
    for (const feat of specific.features) {
      assert.ok(feat.trim().length > 10, `Feature in '${tool.slug}' too short: ${feat}`);
    }

    // Verify FAQs
    assert.ok(
      Array.isArray(specific.faqs) && specific.faqs.length >= 2,
      `Tool '${tool.slug}' must have at least 2 FAQs`
    );
    for (const faq of specific.faqs) {
      assert.ok(faq.question.trim().endsWith("?"), `Question in '${tool.slug}' must end in '?': ${faq.question}`);
      assert.ok(faq.answer.trim().length > 20, `Answer in '${tool.slug}' must be substantial: ${faq.answer}`);
    }
  }
});

test("Tool FAQs - Strict Security & Anti-Mismatch Audit", () => {
  const allTools = getAllTools();

  for (const tool of allTools) {
    const content = getToolEducationalContent(tool.category, tool.slug, tool.name);

    // 1. JWT decoding check: only jwt-decoder can ask about JWT decoding
    if (tool.slug !== "jwt-decoder") {
      for (const faq of content.faqs) {
        assert.ok(
          !faq.question.toLowerCase().includes("jwt"),
          `Tool '${tool.slug}' has mismatched JWT question: ${faq.question}`
        );
      }
    }

    // 2. Hash generator check: only hash-generator can ask about cryptographic hashes or MD5/SHA
    if (tool.slug !== "hash-generator") {
      for (const faq of content.faqs) {
        assert.ok(
          !faq.question.toLowerCase().includes("cryptographic hash") &&
          !faq.question.toLowerCase().includes("sha-") &&
          !faq.question.toLowerCase().includes("md5"),
          `Tool '${tool.slug}' has mismatched Hash question: ${faq.question}`
        );
      }
    }

    // 3. Password / UUID randomness check
    if (tool.slug !== "password-generator" && tool.slug !== "uuid-generator") {
      for (const faq of content.faqs) {
        assert.ok(
          !faq.question.toLowerCase().includes("passwords and uuids truly random"),
          `Tool '${tool.slug}' has generic copy-paste password/UUID question: ${faq.question}`
        );
      }
    }

    // 4. Fancy fonts check
    if (tool.slug !== "fancy-fonts") {
      for (const faq of content.faqs) {
        assert.ok(
          !faq.question.toLowerCase().includes("social media platforms") &&
          !faq.question.toLowerCase().includes("empty boxes or question marks"),
          `Tool '${tool.slug}' has mismatched fancy font question: ${faq.question}`
        );
      }
    }

    // 5. AI Magic check: AI tools must NOT claim 100% client-side execution in features/FAQs
    if (tool.category === "AI Magic") {
      const allText = [
        ...content.features,
        ...content.faqs.map((f) => f.answer),
      ].join(" ").toLowerCase();

      assert.ok(
        allText.includes("serverless") || allText.includes("gemini") || allText.includes("https"),
        `AI tool '${tool.slug}' must accurately explain serverless/AI architecture`
      );
      assert.ok(
        !allText.includes("100% client-side") && !allText.includes("purely within your browser"),
        `AI tool '${tool.slug}' must NOT claim to be 100% client-side`
      );
    }
  }
});

test("Tool FAQs - Aliases Resolve to Content", () => {
  const aliasesToTest = [
    { alias: "base64-encoder-decoder", expectedSlug: "base64" },
    { alias: "unix-timestamp-converter", expectedSlug: "unix-timestamp" },
    { alias: "date-difference-calculator", expectedSlug: "date-difference" },
    { alias: "grammar-fixer", expectedSlug: "ai-grammar" },
    { alias: "ai-summarizer", expectedSlug: "ai-summarize" },
  ];

  for (const { alias, expectedSlug } of aliasesToTest) {
    const content = getToolEducationalContent("Any", alias, "Alias Tool");
    assert.equal(content.slug, expectedSlug, `Alias '${alias}' should resolve to '${expectedSlug}'`);
    assert.ok(content.faqs.length >= 2, `Alias '${alias}' should have valid FAQs`);
  }
});
