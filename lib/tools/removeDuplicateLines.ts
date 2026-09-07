export interface RemoveDuplicateLinesOptions {
  caseSensitive?: boolean;
  trimBeforeCompare?: boolean;
}

export function removeDuplicateLines(
  input: string,
  options: RemoveDuplicateLinesOptions = {}
): string {
  if (!input) return "";

  const caseSensitive = options.caseSensitive ?? true;
  const trimBeforeCompare = options.trimBeforeCompare ?? false;

  const lines = input.split(/\r?\n/);
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    let key = line;
    if (trimBeforeCompare) {
      key = key.trim();
    }
    if (!caseSensitive) {
      key = key.toLowerCase();
    }

    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }

  return result.join("\n");
}
