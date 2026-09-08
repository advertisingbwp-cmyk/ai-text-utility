import test from "node:test";
import assert from "node:assert/strict";
import {
  TOOLS_REGISTRY,
  CATEGORIES,
  getAllTools,
  getToolBySlug,
  getToolsByCategory,
  getFeaturedTools,
  searchTools,
} from "../data/toolsRegistry.ts";

test("Tools Registry - Structure & Uniqueness", () => {
  const allTools = getAllTools();
  assert.ok(allTools.length >= 40, "Registry should contain 40+ utilities");

  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const tool of allTools) {
    assert.ok(tool.id, `Tool missing id: ${JSON.stringify(tool)}`);
    assert.ok(tool.name, `Tool ${tool.id} missing name`);
    assert.ok(tool.slug, `Tool ${tool.id} missing slug`);
    assert.ok(tool.category, `Tool ${tool.id} missing category`);
    assert.ok(tool.description, `Tool ${tool.id} missing description`);
    assert.ok(tool.icon, `Tool ${tool.id} missing icon`);
    assert.ok(Array.isArray(tool.keywords) && tool.keywords.length > 0, `Tool ${tool.id} missing keywords`);

    assert.ok(!ids.has(tool.id), `Duplicate tool id detected: ${tool.id}`);
    assert.ok(!slugs.has(tool.slug), `Duplicate tool slug detected: ${tool.slug}`);

    ids.add(tool.id);
    slugs.add(tool.slug);
  }
});

test("Tools Registry - Valid Categories", () => {
  const validCategories = new Set(CATEGORIES.map((c) => c.name));
  for (const tool of TOOLS_REGISTRY) {
    assert.ok(
      validCategories.has(tool.category),
      `Tool ${tool.id} has invalid category: ${tool.category}`
    );
  }
});

test("Tools Registry - Lookup Helpers", () => {
  const wordCounter = getToolBySlug("word-counter");
  assert.ok(wordCounter, "getToolBySlug should find 'word-counter'");
  assert.equal(wordCounter?.name, "Word Counter");

  const nonExistent = getToolBySlug("non-existent-tool");
  assert.equal(nonExistent, undefined);

  const textTools = getToolsByCategory("Text");
  assert.ok(textTools.length > 0);
  assert.ok(textTools.every((t) => t.category === "Text"));

  const featured = getFeaturedTools();
  assert.ok(featured.length > 0);
  assert.ok(featured.every((t) => t.featured));
});

test("Tools Registry - Search Engine", () => {
  const all = searchTools("");
  assert.equal(all.length, TOOLS_REGISTRY.length);

  const results = searchTools("slug");
  assert.ok(results.some((t) => t.slug === "slug-generator"));

  const aiResults = searchTools("AI Magic");
  assert.ok(aiResults.length >= 6);

  const empty = searchTools("xyznonexistenttool999");
  assert.equal(empty.length, 0);
});

test("Tools Registry - Valid Layouts", () => {
  const validLayouts = new Set([
    "transform",
    "generator",
    "dashboard",
    "table",
    "twoWay",
    "validator",
    "highlight",
    "splitPreview",
    "gallery",
    "compact",
    "ai",
  ]);

  for (const tool of TOOLS_REGISTRY) {
    assert.ok(
      validLayouts.has(tool.layout),
      `Tool ${tool.id} has invalid layout: ${(tool as any).layout}`
    );
  }
});

