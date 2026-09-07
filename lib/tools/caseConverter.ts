/**
 * Case Converter Logic
 * Converts text across multiple programming and typographical cases.
 * Handles Unicode letters and handles empty/edge inputs gracefully.
 */

export type CaseMode =
  | "uppercase"
  | "lowercase"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab";

export interface CaseConvertOptions {
  mode: CaseMode;
}

/**
 * Splits text into constituent words recognizing:
 * - spaces, hyphens, underscores, dots, slashes
 * - camelCase transitions (e.g. "fooBar" -> "foo", "Bar")
 * - acronym transitions (e.g. "HTMLParser" -> "HTML", "Parser")
 */
export function extractWords(text: string): string[] {
  if (!text) return [];

  // Replace symbols/punctuation with spaces
  const normalized = text
    .replace(/[\-_./\\:]+/g, " ")
    .replace(/([a-z\p{Ll}])([A-Z\p{Lu}])/gu, "$1 $2")
    .replace(/([A-Z\p{Lu}]+)([A-Z\p{Lu}][a-z\p{Ll}])/gu, "$1 $2");

  return normalized
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Converts text into the specified case mode.
 */
export function convertCase(text: string, options: CaseConvertOptions | CaseMode): string {
  if (!text) return "";

  const mode = typeof options === "string" ? options : options.mode;

  switch (mode) {
    case "uppercase":
      return text.toUpperCase();

    case "lowercase":
      return text.toLowerCase();

    case "title": {
      // Capitalize the first letter of each word; lowercase the rest
      return text.replace(/\b([\p{L}\p{N}])([\p{L}\p{N}]*)\b/gu, (_, first, rest) => {
        return first.toUpperCase() + rest.toLowerCase();
      });
    }

    case "sentence": {
      // Lowercase everything first, then capitalize start of sentences (. ! ? or newline)
      const lower = text.toLowerCase();
      return lower.replace(/(^\s*|[.!?\n]\s+)([\p{L}])/gu, (match, sep, char) => {
        return sep + char.toUpperCase();
      });
    }

    case "camel": {
      const words = extractWords(text);
      if (words.length === 0) return "";
      return words
        .map((w, idx) => {
          const lower = w.toLowerCase();
          if (idx === 0) return lower;
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("");
    }

    case "pascal": {
      const words = extractWords(text);
      if (words.length === 0) return "";
      return words
        .map((w) => {
          const lower = w.toLowerCase();
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("");
    }

    case "snake": {
      const words = extractWords(text);
      return words.map((w) => w.toLowerCase()).join("_");
    }

    case "kebab": {
      const words = extractWords(text);
      return words.map((w) => w.toLowerCase()).join("-");
    }

    default:
      return text;
  }
}
