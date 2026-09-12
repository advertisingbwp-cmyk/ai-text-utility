import type { ToolDefinition } from "./types.ts";
import { CATEGORIES } from "./types.ts";

export const VALID_LAYOUTS = new Set([
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

export interface RegistryValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a tools registry for structural integrity, unique IDs/slugs,
 * non-colliding aliases, and valid category/layout assignments.
 */
export function validateToolsRegistry(tools: ToolDefinition[]): RegistryValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const validCategories = new Set(CATEGORIES.map((c) => c.name));
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenAliases = new Map<string, string>(); // alias -> toolId

  for (const tool of tools) {
    // 1. Required core metadata
    if (!tool.id || typeof tool.id !== "string" || !tool.id.trim()) {
      errors.push(`Tool missing valid 'id': ${JSON.stringify(tool)}`);
    }
    if (!tool.name || typeof tool.name !== "string" || !tool.name.trim()) {
      errors.push(`Tool '${tool.id}' missing valid 'name'`);
    }
    if (!tool.slug || typeof tool.slug !== "string" || !tool.slug.trim()) {
      errors.push(`Tool '${tool.id}' missing valid 'slug'`);
    }
    if (!tool.category || !validCategories.has(tool.category)) {
      errors.push(`Tool '${tool.id}' has invalid category '${tool.category}'`);
    }
    if (!tool.description || typeof tool.description !== "string" || !tool.description.trim()) {
      errors.push(`Tool '${tool.id}' missing valid 'description'`);
    }
    if (!tool.icon || typeof tool.icon !== "string" || !tool.icon.trim()) {
      errors.push(`Tool '${tool.id}' missing valid 'icon'`);
    }
    if (!Array.isArray(tool.keywords) || tool.keywords.length === 0) {
      errors.push(`Tool '${tool.id}' missing keywords array`);
    }
    if (!tool.layout || !VALID_LAYOUTS.has(tool.layout)) {
      errors.push(`Tool '${tool.id}' has invalid layout '${tool.layout}'`);
    }

    // 2. ID Uniqueness
    if (seenIds.has(tool.id)) {
      errors.push(`Duplicate tool ID detected: '${tool.id}'`);
    } else {
      seenIds.add(tool.id);
    }

    // 3. Slug Uniqueness
    if (seenSlugs.has(tool.slug)) {
      errors.push(`Duplicate tool slug detected: '${tool.slug}'`);
    } else {
      seenSlugs.add(tool.slug);
    }

    // 4. Aliases Uniqueness & Collisions
    if (tool.aliases && Array.isArray(tool.aliases)) {
      for (const alias of tool.aliases) {
        if (!alias || typeof alias !== "string" || !alias.trim()) {
          errors.push(`Tool '${tool.id}' contains malformed alias: '${String(alias)}'`);
          continue;
        }

        // Check if alias collides with an existing primary slug
        if (seenSlugs.has(alias)) {
          errors.push(`Alias collision: Alias '${alias}' in tool '${tool.id}' collides with primary tool slug '${alias}'.`);
        }

        // Check if alias collides with an alias in another tool
        if (seenAliases.has(alias)) {
          errors.push(`Duplicate alias '${alias}' used in both '${seenAliases.get(alias)}' and '${tool.id}'.`);
        } else {
          seenAliases.set(alias, tool.id);
        }
      }
    }
  }

  // Double check if any primary slug collides with previously registered aliases
  for (const slug of seenSlugs) {
    if (seenAliases.has(slug)) {
      errors.push(`Slug-alias collision: Slug '${slug}' is also declared as an alias in '${seenAliases.get(slug)}'.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Asserts that the registry is completely valid, throwing an Error if any invariant fails.
 */
export function assertValidRegistry(tools: ToolDefinition[]): void {
  const result = validateToolsRegistry(tools);
  if (!result.valid) {
    throw new Error(`[Registry Validation Failed]:\n - ${result.errors.join("\n - ")}`);
  }
}
