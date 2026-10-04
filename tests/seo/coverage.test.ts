import test from "node:test";
import assert from "node:assert/strict";
import { TOOLS_REGISTRY, getToolBySlug } from "../../data/toolsRegistry.ts";
import { getToolSeoBlueprint } from "../../data/seoBlueprint.ts";
import { SUPPLEMENTAL_GUIDES } from "../../data/seo/supplementalGuides.ts";

test("Every public tool has distinct metadata and canonical related links", () => {
  const titles = new Set<string>();
  for (const tool of TOOLS_REGISTRY) {
    const blueprint = getToolSeoBlueprint(tool.slug);
    assert.ok(blueprint, `Missing blueprint: ${tool.slug}`);
    assert.ok(!titles.has(blueprint.title), `Duplicate title: ${tool.slug}`);
    titles.add(blueprint.title);
    assert.ok(blueprint.metaDescription.length > 40);
    for (const slug of blueprint.clusterSlugs) {
      assert.equal(getToolBySlug(slug)?.slug, slug, `Noncanonical link from ${tool.slug}: ${slug}`);
    }
    if (tool.requiresAI && SUPPLEMENTAL_GUIDES[tool.slug]) {
      assert.match(blueprint.metaDescription, /AI provider/);
    }
  }
});
