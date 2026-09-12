import type { ToolCategory, ToolDefinition } from "./types.ts";
import { CATEGORIES } from "./types.ts";
import { TEXT_TOOLS } from "./text.ts";
import { FORMAT_TOOLS } from "./format.ts";
import { CLEANUP_TOOLS } from "./cleanup.ts";
import { TRANSFORM_TOOLS } from "./transform.ts";
import { DATE_TIME_TOOLS } from "./dateTime.ts";
import { AI_TOOLS } from "./ai.ts";
import { validateToolsRegistry, assertValidRegistry } from "./validation.ts";

export * from "./types.ts";
export * from "./validation.ts";
export { TEXT_TOOLS } from "./text.ts";
export { FORMAT_TOOLS } from "./format.ts";
export { CLEANUP_TOOLS } from "./cleanup.ts";
export { TRANSFORM_TOOLS } from "./transform.ts";
export { DATE_TIME_TOOLS } from "./dateTime.ts";
export { AI_TOOLS } from "./ai.ts";

/**
 * Unified Central Tools Registry.
 * Assembles all category modules and enforces structural invariants.
 */
export const TOOLS_REGISTRY: ToolDefinition[] = [
  ...TEXT_TOOLS,
  ...FORMAT_TOOLS,
  ...CLEANUP_TOOLS,
  ...TRANSFORM_TOOLS,
  ...DATE_TIME_TOOLS,
  ...AI_TOOLS,
];

// In non-production or build initialization, validate registry integrity
if (process.env.NODE_ENV !== "production") {
  const result = validateToolsRegistry(TOOLS_REGISTRY);
  if (!result.valid) {
    console.error("[TOOLS_REGISTRY VALIDATION ERROR]:", result.errors);
  }
}

// Cached slug and alias index for O(1) lookups
const SLUG_LOOKUP_MAP = new Map<string, ToolDefinition>();

for (const tool of TOOLS_REGISTRY) {
  SLUG_LOOKUP_MAP.set(tool.slug, tool);
  SLUG_LOOKUP_MAP.set(tool.id, tool);
  if (tool.aliases) {
    for (const alias of tool.aliases) {
      SLUG_LOOKUP_MAP.set(alias, tool);
    }
  }
}

// Central Public Lookup Helpers
export function getAllTools(): ToolDefinition[] {
  return TOOLS_REGISTRY;
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return SLUG_LOOKUP_MAP.get(slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((t) => t.category === category);
}

export function getFeaturedTools(): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((t) => t.featured);
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return TOOLS_REGISTRY;
  return TOOLS_REGISTRY.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
