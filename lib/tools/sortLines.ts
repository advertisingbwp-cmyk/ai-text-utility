/**
 * Sort Lines Logic
 * Supports A-Z, Z-A, shortest->longest, longest->shortest, numeric/natural sorting,
 * and optional deduplication and case sensitivity.
 */

export type SortOrder =
  | "az"
  | "za"
  | "shortest-first"
  | "longest-first"
  | "numeric";

export interface SortLinesOptions {
  order?: SortOrder;
  caseSensitive?: boolean;
  preserveDuplicates?: boolean;
}

export function sortLines(
  text: string,
  options: SortLinesOptions = {}
): string {
  if (!text) return "";

  const {
    order = "az",
    caseSensitive = false,
    preserveDuplicates = true,
  } = options;

  // Split lines preserving CRLF vs LF
  const hasCrlf = text.includes("\r\n");
  const delimiter = hasCrlf ? "\r\n" : "\n";
  let lines = text.split(/\r?\n/);

  // Optional deduplication
  if (!preserveDuplicates) {
    const seen = new Set<string>();
    lines = lines.filter((line) => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Create comparator
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: caseSensitive ? "variant" : "base",
  });

  const sorted = [...lines].sort((a, b) => {
    switch (order) {
      case "az":
        return collator.compare(a, b);

      case "za":
        return collator.compare(b, a);

      case "shortest-first": {
        const lenDiff = a.length - b.length;
        return lenDiff !== 0 ? lenDiff : collator.compare(a, b);
      }

      case "longest-first": {
        const lenDiff = b.length - a.length;
        return lenDiff !== 0 ? lenDiff : collator.compare(a, b);
      }

      case "numeric": {
        // Natural numeric sort prioritizing extracted numeric values
        return collator.compare(a, b);
      }

      default:
        return 0;
    }
  });

  return sorted.join(delimiter);
}
