import type { ToolDefinition } from "../data/tools/types";

// Production-browser verification: every current invoke.js throws on document.cookie
// in an opaque-origin sandbox. Keep disabled until the provider supports this boundary;
// never enable allow-same-origin or remove sandbox to make an ad load.
export const AD_FORMAT_ENABLED = { banner: false, native: false } as const;

const sensitiveSlugs = new Set([
  "password-generator", "jwt-decoder", "hash-generator",
  "base64", "url-encoder", "query-string-parser", "extract-emails-urls",
  "json-formatter", "json-to-csv", "csv-to-json",
]);

export function getToolAdPolicy(tool: Pick<ToolDefinition, "slug" | "category" | "requiresAI">) {
  const sensitive = tool.requiresAI === true || tool.category === "AI Magic" || sensitiveSlugs.has(tool.slug);
  return { sensitive, isolatedBanner: true, isolatedNative: !sensitive };
}
