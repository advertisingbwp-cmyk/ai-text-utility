export interface RemoveSpecialCharsOptions {
  mode?: "alphanumeric-only" | "keep-punctuation" | "custom";
  preserveSpaces?: boolean;
  preserveNewlines?: boolean;
  customAllowedChars?: string;
  collapseSpaces?: boolean;
}

export function removeSpecialChars(
  input: string,
  options: RemoveSpecialCharsOptions = {}
): string {
  if (!input) return "";

  const mode = options.mode || "alphanumeric-only";
  const preserveSpaces = options.preserveSpaces ?? true;
  const preserveNewlines = options.preserveNewlines ?? true;
  const customAllowed = options.customAllowedChars || "";
  const collapseSpaces = options.collapseSpaces ?? true;

  let regexPattern: string;

  if (mode === "alphanumeric-only") {
    // Keep Unicode letters (\p{L}), numbers (\p{N}), and optionally spaces / newlines
    let allowed = "\\p{L}\\p{N}";
    if (preserveSpaces) allowed += " ";
    if (preserveNewlines) allowed += "\\r\\n\\t";
    regexPattern = `[^${allowed}]`;
  } else if (mode === "keep-punctuation") {
    // Keep letters, numbers, spaces, newlines, and standard punctuation (. , ! ? ' " - : ; ( ))
    let allowed = "\\p{L}\\p{N}.,!?'\"\\-:;()";
    if (preserveSpaces) allowed += " ";
    if (preserveNewlines) allowed += "\\r\\n\\t";
    regexPattern = `[^${allowed}]`;
  } else {
    // Custom allowed chars
    const escapedCustom = customAllowed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let allowed = `\\p{L}\\p{N}${escapedCustom}`;
    if (preserveSpaces) allowed += " ";
    if (preserveNewlines) allowed += "\\r\\n\\t";
    regexPattern = `[^${allowed}]`;
  }

  const regex = new RegExp(regexPattern, "gu");
  let result = input.replace(regex, "");

  if (collapseSpaces && preserveSpaces) {
    // Collapse multi-spaces left by stripped characters
    if (preserveNewlines) {
      result = result
        .split(/\r?\n/)
        .map((line) => line.replace(/[ \t]{2,}/g, " "))
        .join("\n");
    } else {
      result = result.replace(/ {2,}/g, " ").trim();
    }
  }

  return result;
}
