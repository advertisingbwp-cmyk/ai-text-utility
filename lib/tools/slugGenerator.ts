import { removeLetterAccents } from "./removeAccents.ts";

export interface SlugOptions {
  separator?: string;
  lowercase?: boolean;
  preserveCase?: boolean;
}

export function generateSlug(input: string, options: SlugOptions = {}): string {
  if (!input || !input.trim()) return "";

  const separator = options.separator || "-";
  const shouldLowercase = options.lowercase ?? !options.preserveCase;

  // 1. Normalize unicode diacritics
  let text = removeLetterAccents(input.trim());

  // 2. Convert common symbols to words or spaces
  text = text
    .replace(/&/g, " and ")
    .replace(/@/g, " at ")
    .replace(/%/g, " percent ");

  // 3. Lowercase if required
  if (shouldLowercase) {
    text = text.toLowerCase();
  }

  // 4. Remove all characters that are not alphanumeric or whitespace
  // Keep letters, numbers, and spaces
  text = text.replace(/[^\p{L}\p{N}\s-]/gu, "");

  // 5. Replace spaces, tabs, underscores, and consecutive hyphens with separator
  const escapedSep = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  text = text.replace(/[\s_-]+/g, separator);

  // 6. Collapse repeated separators
  const multiSepRegex = new RegExp(`(${escapedSep}){2,}`, "g");
  text = text.replace(multiSepRegex, separator);

  // 7. Strip leading and trailing separators
  const leadTrailRegex = new RegExp(`^${escapedSep}+|${escapedSep}+$`, "g");
  text = text.replace(leadTrailRegex, "");

  return text;
}
