export interface RemoveExtraSpacesOptions {
  collapseType?: "spaces-only" | "all-whitespace";
  trimTrailingSpaces?: boolean;
}

export function removeExtraSpaces(
  input: string,
  options: RemoveExtraSpacesOptions = {}
): string {
  if (!input) return "";

  const collapseType = options.collapseType || "spaces-only";
  const trimTrailingSpaces = options.trimTrailingSpaces ?? true;

  if (collapseType === "all-whitespace") {
    return input.replace(/\s+/g, " ").trim();
  }

  // spaces-only: collapse consecutive spaces (U+0020) without destroying tabs or newlines
  const lines = input.split(/\r?\n/);
  const processed = lines.map((line) => {
    // Replace multiple spaces with a single space
    let cleaned = line.replace(/ {2,}/g, " ");
    if (trimTrailingSpaces) {
      cleaned = cleaned.replace(/ +$/, "");
    }
    return cleaned;
  });

  return processed.join("\n");
}
