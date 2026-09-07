export interface WordFrequencyOptions {
  sortBy?: "frequency" | "alphabetical";
  ignoreCase?: boolean;
  minWordLength?: number;
}

export interface WordFrequencyItem {
  word: string;
  count: number;
  percentage: number;
}

export function analyzeWordFrequency(
  input: string,
  options: WordFrequencyOptions = {}
): WordFrequencyItem[] {
  if (!input || !input.trim()) return [];

  const sortBy = options.sortBy || "frequency";
  const ignoreCase = options.ignoreCase ?? true;
  const minLength = options.minWordLength ?? 1;

  let text = input;
  if (ignoreCase) {
    text = text.toLowerCase();
  }

  // Extract words supporting Unicode letters, numbers, and hyphens/apostrophes within words
  const rawWords = text.match(/[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu) || [];

  const validWords = rawWords.filter((w) => w.length >= minLength);
  const total = validWords.length;

  if (total === 0) return [];

  const map = new Map<string, number>();
  for (const word of validWords) {
    map.set(word, (map.get(word) || 0) + 1);
  }

  const items: WordFrequencyItem[] = [];
  for (const [word, count] of map.entries()) {
    const percentage = Number(((count / total) * 100).toFixed(2));
    items.push({ word, count, percentage });
  }

  if (sortBy === "alphabetical") {
    items.sort((a, b) => a.word.localeCompare(b.word));
  } else {
    items.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  }

  return items;
}

export function formatWordFrequency(items: WordFrequencyItem[]): string {
  if (items.length === 0) return "No words found in the provided text.";

  const header = "Rank | Word             | Count | Density\n-----------------------------------------";
  const rows = items.map((item, index) => {
    const rankCol = String(index + 1).padStart(4, " ");
    const wordCol = item.word.padEnd(16, " ");
    const countCol = String(item.count).padStart(5, " ");
    const densCol = `${item.percentage.toFixed(2)}%`.padStart(7, " ");
    return `${rankCol} | ${wordCol} | ${countCol} | ${densCol}`;
  });

  return [header, ...rows].join("\n");
}
