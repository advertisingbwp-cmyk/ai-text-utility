/** Escape HTML parser control characters without changing the JSON payload. */
export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
