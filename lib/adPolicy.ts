import type { ToolDefinition } from "../data/tools/types";
const sensitiveSlugs = new Set([
  "password-generator", "jwt-decoder", "hash-generator",
  "base64", "url-encoder", "query-string-parser", "extract-emails-urls",
  "json-formatter", "json-to-csv", "csv-to-json",
]);
export function getToolAdPolicy(tool: Pick<ToolDefinition, "slug" | "category" | "requiresAI">) {
  const sensitive = tool.requiresAI === true || tool.category === "AI Magic" || sensitiveSlugs.has(tool.slug);
  return { sensitive, isolatedBanner: true, isolatedNative: !sensitive };
}
