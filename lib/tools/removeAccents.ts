const LIGATURES_MAP: Record<string, string> = {
  "æ": "ae",
  "Æ": "Ae",
  "œ": "oe",
  "Œ": "Oe",
  "ß": "ss",
  "ø": "o",
  "Ø": "O",
  "ł": "l",
  "Ł": "L",
  "ð": "d",
  "Ð": "D",
  "þ": "th",
  "Þ": "Th",
};

export function removeLetterAccents(input: string): string {
  if (!input) return "";

  // Replace special linguistic ligatures
  let result = input;
  for (const [ligature, replacement] of Object.entries(LIGATURES_MAP)) {
    result = result.replaceAll(ligature, replacement);
  }

  // Decompose accented characters and strip combining diacritical marks
  return result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
