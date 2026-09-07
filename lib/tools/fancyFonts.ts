/**
 * Fancy Unicode Fonts Generator
 * Converts regular text into stylized Unicode glyphs:
 * Gothic (Fraktur), Bold Sans, Script, Circled, and Double-Struck.
 * Gracefully preserves unmapped characters (spaces, punctuation, non-Latin chars).
 */

export type FancyFontStyle =
  | "gothic"
  | "bold-sans"
  | "script"
  | "circled"
  | "double-struck"
  | "monospace";

export interface FancyFontItem {
  id: FancyFontStyle;
  name: string;
  preview: string;
}

const LATIN_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LATIN_LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

// Unicode style tables
const FONT_MAPS: Record<FancyFontStyle, { upper: string[]; lower: string[]; digits?: string[] }> = {
  gothic: {
    upper: [
      "𝔄", "𝔅", "ℭ", "𝔇", "𝔈", "𝔉", "𝔊", "ℌ", "ℑ", "𝔍", "𝔎", "𝔏", "𝔐",
      "𝔑", "𝔒", "𝔓", "𝔔", "ℜ", "𝔖", "𝔗", "𝔘", "𝔙", "𝔚", "𝔛", "𝔜", "ℨ",
    ],
    lower: [
      "𝔞", "𝔟", "𝔠", "𝔡", "𝔢", "𝔣", "𝔤", "𝔥", "𝔦", "𝔧", "𝔨", "𝔩", "𝔪",
      "𝔫", "𝔬", "𝔭", "𝔮", "𝔯", "𝔰", "𝔱", "𝔲", "𝔳", "𝔴", "𝔵", "𝔶", "𝔷",
    ],
  },
  "bold-sans": {
    upper: [
      "𝗔", "𝗕", "𝗖", "𝗗", "𝗘", "𝗙", "𝗚", "𝗛", "𝗜", "𝗝", "𝗞", "𝗟", "𝗠",
      "𝗡", "𝗢", "𝗣", "𝗤", "𝗥", "𝗦", "𝗧", "𝗨", "𝗩", "𝗪", "𝗫", "𝗬", "𝗭",
    ],
    lower: [
      "𝗮", "𝗯", "𝗰", "𝗱", "𝗲", "𝗳", "𝗴", "𝗵", "𝗶", "𝗷", "𝗸", "𝗹", "𝗺",
      "𝗻", "𝗼", "𝗽", "𝗾", "𝗿", "𝘀", "𝘁", "𝘂", "𝘃", "𝘄", "𝘅", "𝘆", "𝘇",
    ],
    digits: ["𝟬", "𝟭", "𝟮", "𝟯", "𝟰", "𝟱", "𝟲", "𝟳", "𝟴", "𝟵"],
  },
  script: {
    upper: [
      "𝒜", "ℬ", "𝒞", "𝒟", "ℰ", "ℱ", "𝒢", "ℋ", "ℐ", "𝒥", "𝒦", "ℒ", "ℳ",
      "𝒩", "𝒪", "𝒫", "𝒬", "ℛ", "𝒮", "𝒯", "𝒰", "𝒱", "𝒲", "𝒳", "𝒴", "𝒵",
    ],
    lower: [
      "𝒶", "𝒷", "𝒸", "𝒹", "ℯ", "𝒻", "ℊ", "𝒽", "𝒾", "𝒿", "𝓀", "𝓁", "𝓂",
      "𝓃", "ℴ", "𝓅", "𝓆", "𝓇", "𝓈", "𝓉", "𝓊", "𝓋", "𝓌", "𝓍", "𝓎", "𝓏",
    ],
  },
  circled: {
    upper: [
      "Ⓐ", "Ⓑ", "Ⓒ", "Ⓓ", "Ⓔ", "Ⓕ", "Ⓖ", "Ⓗ", "Ⓘ", "Ⓙ", "Ⓚ", "Ⓛ", "Ⓜ",
      "Ⓝ", "Ⓞ", "Ⓟ", "Ⓠ", "Ⓡ", "Ⓢ", "Ⓣ", "Ⓤ", "Ⓥ", "Ⓦ", "Ⓧ", "Ⓨ", "Ⓩ",
    ],
    lower: [
      "ⓐ", "ⓑ", "ⓒ", "ⓓ", "ⓔ", "ⓕ", "ⓖ", "ⓗ", "ⓘ", "ⓙ", "ⓚ", "ⓛ", "ⓜ",
      "ⓝ", "ⓞ", "ⓟ", "ⓠ", "ⓡ", "ⓢ", "ⓣ", "ⓤ", "ⓥ", "ⓦ", "ⓧ", "ⓨ", "ⓩ",
    ],
    digits: ["⓪", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"],
  },
  "double-struck": {
    upper: [
      "𝔸", "𝔹", "ℂ", "𝔻", "𝔼", "𝔽", "𝔾", "ℍ", "𝕀", "𝕁", "𝕂", "𝕃", "𝕄",
      "ℕ", "𝕆", "ℙ", "ℚ", "ℝ", "𝕊", "𝕋", "𝕌", "𝕍", "𝕎", "𝕏", "𝕐", "ℤ",
    ],
    lower: [
      "𝕒", "𝕓", "𝕔", "𝕕", "𝕖", "𝕗", "𝕘", "𝕙", "𝕚", "𝕛", "𝕜", "𝕝", "𝕞",
      "𝕟", "𝕠", "𝕡", "𝕢", "𝕣", "𝕤", "𝕥", "𝕦", "𝕧", "𝕨", "𝕩", "𝕪", "𝕫",
    ],
    digits: ["𝟘", "𝟙", "𝟚", "𝟛", "𝟜", "𝟝", "𝟞", "𝟟", "𝟠", "𝟡"],
  },
  monospace: {
    upper: [
      "𝙰", "𝙱", "𝙲", "𝙳", "𝙴", "𝙵", "𝙶", "𝙷", "𝙸", "𝙹", "𝙺", "𝙻", "𝙼",
      "𝙽", "𝙾", "𝙿", "𝚀", "𝚁", "𝚂", "𝚃", "𝚄", "𝚅", "𝚆", "𝚇", "𝚈", "𝚉",
    ],
    lower: [
      "𝚊", "𝚋", "𝚌", "𝚍", "𝚎", "𝚏", "𝚐", "𝚑", "𝚒", "𝚓", "𝚔", "𝚕", "𝚖",
      "𝚗", "𝚘", "𝚙", "𝚚", "𝚛", "𝚜", "𝚝", "𝚞", "𝚟", "𝚠", "𝚡", "𝚢", "𝚣",
    ],
    digits: ["𝟶", "𝟷", "𝟸", "𝟹", "𝟺", "𝟻", "𝟼", "𝟽", "𝟾", "𝟿"],
  },
};

const STYLE_NAMES: Record<FancyFontStyle, string> = {
  gothic: "Gothic / Fraktur",
  "bold-sans": "Bold Sans-Serif",
  script: "Script / Cursive",
  circled: "Circled / Bubble",
  "double-struck": "Double-Struck / Blackboard",
  monospace: "Monospace / Typewriter",
};

/**
 * Transforms text into a specific fancy font style.
 */
export function convertFancyFont(text: string, style: FancyFontStyle): string {
  if (!text) return "";

  const map = FONT_MAPS[style];
  if (!map) return text;

  let result = "";

  for (const char of text) {
    const upperIdx = LATIN_UPPER.indexOf(char);
    if (upperIdx !== -1 && map.upper[upperIdx]) {
      result += map.upper[upperIdx];
      continue;
    }

    const lowerIdx = LATIN_LOWER.indexOf(char);
    if (lowerIdx !== -1 && map.lower[lowerIdx]) {
      result += map.lower[lowerIdx];
      continue;
    }

    const digitIdx = DIGITS.indexOf(char);
    if (digitIdx !== -1 && map.digits && map.digits[digitIdx]) {
      result += map.digits[digitIdx];
      continue;
    }

    // Unmapped character: preserve as is
    result += char;
  }

  return result;
}

/**
 * Generates all fancy font variations for a given input text.
 */
export function generateAllFancyFonts(text: string): FancyFontItem[] {
  const styles: FancyFontStyle[] = [
    "gothic",
    "bold-sans",
    "script",
    "circled",
    "double-struck",
    "monospace",
  ];

  return styles.map((id) => ({
    id,
    name: STYLE_NAMES[id],
    preview: convertFancyFont(text, id),
  }));
}
