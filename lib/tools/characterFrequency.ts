export interface CharacterFrequencyOptions {
  sortBy?: "frequency" | "alphabetical";
  ignoreCase?: boolean;
  ignoreWhitespace?: boolean;
}

export interface CharacterFrequencyItem {
  character: string;
  displayCharacter: string;
  count: number;
  percentage: number;
}

export function analyzeCharacterFrequency(
  input: string,
  options: CharacterFrequencyOptions = {}
): CharacterFrequencyItem[] {
  if (!input) return [];

  const sortBy = options.sortBy || "frequency";
  const ignoreCase = options.ignoreCase ?? false;
  const ignoreWhitespace = options.ignoreWhitespace ?? false;

  let text = input;
  if (ignoreCase) {
    text = text.toLowerCase();
  }

  const map = new Map<string, number>();
  let totalValid = 0;

  for (const char of text) {
    if (ignoreWhitespace && /\s/.test(char)) {
      continue;
    }
    map.set(char, (map.get(char) || 0) + 1);
    totalValid++;
  }

  if (totalValid === 0) return [];

  const items: CharacterFrequencyItem[] = [];

  for (const [char, count] of map.entries()) {
    let display = char;
    if (char === " ") display = "[space]";
    else if (char === "\n") display = "[newline]";
    else if (char === "\t") display = "[tab]";
    else if (char === "\r") display = "[return]";

    const percentage = Number(((count / totalValid) * 100).toFixed(2));
    items.push({
      character: char,
      displayCharacter: display,
      count,
      percentage,
    });
  }

  if (sortBy === "alphabetical") {
    items.sort((a, b) => a.character.localeCompare(b.character));
  } else {
    items.sort((a, b) => b.count - a.count || a.character.localeCompare(b.character));
  }

  return items;
}

export function formatCharacterFrequency(items: CharacterFrequencyItem[]): string {
  if (items.length === 0) return "No characters to analyze.";

  const header = "Char           | Count | Percentage\n-----------------------------------";
  const rows = items.map((item) => {
    const charCol = item.displayCharacter.padEnd(14, " ");
    const countCol = String(item.count).padStart(5, " ");
    const pctCol = `${item.percentage.toFixed(2)}%`.padStart(8, " ");
    return `${charCol} | ${countCol} | ${pctCol}`;
  });

  return [header, ...rows].join("\n");
}
