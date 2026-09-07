/**
 * Fancy Unicode Fonts Generator
 * Converts regular text into stylized Unicode glyphs, decorated text,
 * combining marks, aesthetic symbols, and decorative wing/kaomoji frames.
 * Gracefully preserves unmapped characters (spaces, punctuation, non-Latin chars).
 */

export type FancyFontStyle =
  // Alphabets & Letter Styles
  | "gothic"
  | "bold-gothic"
  | "script"
  | "bold-script"
  | "bold-serif"
  | "italic-serif"
  | "bold-italic-serif"
  | "bold-sans"
  | "sans-italic"
  | "sans-bold-italic"
  | "double-struck"
  | "monospace"
  | "fullwidth"
  | "small-caps"
  | "superscript"
  | "subscript"
  | "upside-down"
  | "mirrored"
  // Circled & Squared
  | "circled"
  | "circled-black"
  | "squared"
  | "squared-black"
  // Aesthetic & Pseudo
  | "currency-symbols"
  | "katakana-style"
  | "runic-style"
  | "crazy-mix"
  // Lines & Combining
  | "strikethrough"
  | "slash-strike"
  | "underline"
  | "double-underline"
  | "tilde-strike"
  | "cross-box"
  | "sparkle-combining"
  | "seagull-below"
  | "bridge-above"
  // Brackets & Frames
  | "lenticular-brackets"
  | "corner-brackets"
  | "white-brackets"
  | "bar-boxed"
  // Joiners & Connectors
  | "joiner-hearts"
  | "joiner-stars"
  | "joiner-bubbles"
  | "joiner-blocks"
  | "joiner-dashed"
  | "joiner-waves"
  // Wings, Stars & Kaomoji
  | "wings-stars"
  | "wings-sparkle"
  | "royal-flourish"
  | "audio-waves"
  | "cute-hearts"
  | "ribbon-hearts"
  | "kaomoji-hug"
  | "diamond-badge"
  | "sword-shield"
  | "bookmark-love"
  | "magic-stars"
  | "flower-blossom";

export type FancyFontCategory =
  | "all"
  | "alphabets"
  | "circled-squared"
  | "combining-lines"
  | "brackets-boxes"
  | "joiners"
  | "decorations-wings";

export interface FancyFontItem {
  id: FancyFontStyle;
  name: string;
  category: FancyFontCategory;
  preview: string;
}

const LATIN_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LATIN_LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

// Unicode style tables
const FONT_MAPS: Record<
  string,
  { upper: string[]; lower: string[]; digits?: string[] }
> = {
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
  "bold-gothic": {
    upper: [
      "𝕬", "𝕭", "𝕮", "𝕯", "𝕰", "𝕱", "𝕲", "𝕳", "𝕴", "𝕵", "𝕶", "𝕷", "𝕸",
      "𝕹", "𝕺", "𝕻", "𝕼", "𝕽", "𝕾", "𝕿", "𝖀", "𝖁", "𝖂", "𝖃", "𝖄", "𝖅",
    ],
    lower: [
      "𝖆", "𝖇", "𝖈", "𝖉", "𝖊", "𝖋", "𝖌", "𝖍", "𝖎", "𝖏", "𝖐", "𝖑", "𝖒",
      "𝖓", "𝖔", "𝖕", "𝖖", "𝖗", "𝖘", "𝖙", "𝖚", "𝖛", "𝖜", "𝖝", "𝖞", "𝖟",
    ],
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
  "bold-script": {
    upper: [
      "𝓐", "𝓑", "𝓒", "𝓓", "𝓔", "𝓕", "𝓖", "𝓗", "𝓘", "𝓙", "𝓚", "𝓛", "𝓜",
      "𝓝", "𝓞", "𝓟", "𝓠", "𝓡", "𝓢", "𝓣", "𝓤", "𝓥", "𝓦", "𝓧", "𝓨", "𝓩",
    ],
    lower: [
      "𝓪", "𝓫", "𝓬", "𝓭", "𝓮", "𝓯", "𝓰", "𝓱", "𝓲", "𝓳", "𝓴", "𝓵", "𝓶",
      "𝓷", "𝓸", "𝓹", "𝓺", "𝓻", "𝓼", "𝓽", "𝓾", "𝓿", "𝔀", "𝓍", "𝔂", "𝔃",
    ],
  },
  "bold-serif": {
    upper: [
      "𝐀", "𝐁", "𝐂", "𝐃", "𝐄", "𝐅", "𝐆", "𝐇", "𝐈", "𝐉", "𝐊", "𝐋", "𝐌",
      "𝐍", "𝐎", "𝐏", "𝐐", "𝐑", "𝐒", "𝐓", "𝐔", "𝐕", "𝐖", "𝐗", "𝐘", "𝐙",
    ],
    lower: [
      "𝐚", "𝐛", "𝐜", "𝐝", "𝐞", "𝐟", "𝐠", "𝐡", "𝐢", "𝐣", "𝐤", "𝐥", "𝐦",
      "𝐧", "𝐨", "𝐩", "𝐪", "𝐫", "𝐬", "𝐭", "𝐮", "𝐯", "𝐰", "𝐱", "𝐲", "𝐳",
    ],
    digits: ["𝟎", "𝟏", "𝟐", "𝟑", "𝟒", "𝟓", "𝟔", "𝟕", "𝟖", "𝟗"],
  },
  "italic-serif": {
    upper: [
      "𝐴", "𝐵", "𝐶", "𝐷", "𝐸", "𝐹", "𝐺", "𝐻", "𝐼", "𝐽", "𝐾", "𝐿", "𝑀",
      "𝑁", "𝑂", "𝑃", "𝑄", "𝑅", "𝑆", "𝑇", "𝑈", "𝑉", "𝑊", "𝑋", "𝑌", "𝑍",
    ],
    lower: [
      "𝑎", "𝑏", "𝑐", "𝑑", "𝑒", "𝑓", "𝑔", "ℎ", "𝑖", "𝑗", "𝑘", "𝑙", "𝑚",
      "𝑛", "𝑜", "𝑝", "𝑞", "𝑟", "𝑠", "𝑡", "𝑢", "𝑣", "𝑤", "𝑥", "𝑦", "𝑧",
    ],
  },
  "bold-italic-serif": {
    upper: [
      "𝑨", "𝑩", "𝑪", "𝑫", "𝑬", "𝑭", "𝑮", "𝑯", "𝑰", "𝑱", "𝑲", "𝑳", "𝑴",
      "𝑵", "𝑶", "𝑷", "𝑸", "𝑹", "𝑺", "𝑻", "𝑼", "𝑽", "𝑾", "𝑿", "𝒀", "𝒁",
    ],
    lower: [
      "𝒂", "𝒃", "𝒄", "𝒅", "𝒆", "𝒇", "𝒈", "𝒉", "𝒊", "𝒋", "𝒌", "𝒍", "𝒎",
      "𝒏", "𝒐", "𝒑", "𝒒", "𝒓", "𝒔", "𝒕", "𝒖", "𝒗", "𝒘", "𝒙", "𝒚", "𝒛",
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
  "sans-italic": {
    upper: [
      "𝘈", "𝘉", "𝘊", "𝘋", "𝘌", "𝘍", "𝘎", "𝘏", "𝘐", "𝘑", "𝘒", "𝘓", "𝘔",
      "𝘕", "𝘖", "𝘗", "𝘘", "𝘙", "𝘚", "𝘛", "𝘜", "𝘝", "𝘞", "𝘟", "𝘠", "𝘡",
    ],
    lower: [
      "𝘢", "𝘣", "𝘤", "𝘥", "𝘦", "𝘧", "𝘨", "𝘩", "𝘪", "𝘫", "𝘬", "𝘭", "𝘮",
      "𝘯", "𝘰", "𝘱", "𝘲", "𝘳", "𝘴", "𝘵", "𝘶", "𝘷", "𝘸", "𝘹", "𝘺", "𝘻",
    ],
  },
  "sans-bold-italic": {
    upper: [
      "𝘼", "𝘽", "𝘾", "𝘿", "𝙀", "𝙁", "𝙂", "𝙃", "𝙄", "𝙅", "𝙆", "𝙇", "𝙈",
      "𝙉", "𝙊", "𝙋", "𝙌", "𝙍", "𝙎", "𝙏", "𝙐", "𝙑", "𝙒", "𝙓", "𝙔", "𝙕",
    ],
    lower: [
      "𝙖", "𝙗", "𝙘", "𝙙", "𝙚", "𝙛", "𝙜", "𝙝", "𝙞", "𝙟", "𝙠", "ｌ", "𝙢",
      "𝙣", "𝙤", "𝙥", "𝙦", "𝙧", "𝙨", "𝙩", "𝙪", "𝙫", "𝙬", "𝙭", "𝙮", "𝙯",
    ],
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
  fullwidth: {
    upper: [
      "Ａ", "Ｂ", "Ｃ", "Ｄ", "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ",
      "Ｎ", "Ｏ", "Ｐ", "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ", "Ｗ", "Ｘ", "Ｙ", "Ｚ",
    ],
    lower: [
      "ａ", "ｂ", "ｃ", "ｄ", "ｅ", "ｆ", "ｇ", "ｈ", "ｉ", "ｊ", "ｋ", "ｌ", "ｍ",
      "ｎ", "ｏ", "ｐ", "ｑ", "ｒ", "ｓ", "ｔ", "ｕ", "ｖ", "ｗ", "ｘ", "ｙ", "ｚ",
    ],
    digits: ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"],
  },
  "small-caps": {
    upper: [
      "ᴀ", "ʙ", "ᴄ", "ᴅ", "ᴇ", "ғ", "ɢ", "ʜ", "ɪ", "ᴊ", "ᴋ", "ʟ", "ᴍ",
      "ɴ", "ᴏ", "ᴘ", "ǫ", "ʀ", "s", "ᴛ", "ᴜ", "ᴠ", "ᴡ", "x", "ʏ", "ᴢ",
    ],
    lower: [
      "ᴀ", "ʙ", "ᴄ", "ᴅ", "ᴇ", "ғ", "ɢ", "ʜ", "ɪ", "ᴊ", "ᴋ", "ʟ", "ᴍ",
      "ɴ", "ᴏ", "ᴘ", "ǫ", "ʀ", "s", "ᴛ", "ᴜ", "ᴠ", "ᴡ", "x", "ʏ", "ᴢ",
    ],
  },
  superscript: {
    upper: [
      "ᴬ", "ᴮ", "ᶜ", "ᴰ", "ᴱ", "ᶠ", "ᴳ", "ᴴ", "ᴵ", "ᴶ", "ᴷ", "ᴸ", "ᴹ",
      "ᴺ", "ᴼ", "ᴾ", "ᑫ", "ᴿ", "ˢ", "ᵀ", "ᵁ", "ⱽ", "ᵂ", "ˣ", "ʸ", "ᶻ",
    ],
    lower: [
      "ᵃ", "ᵇ", "ᶜ", "ᵈ", "ᵉ", "ᶠ", "ᵍ", "ʰ", "ⁱ", "ʲ", "ᵏ", "ˡ", "ᵐ",
      "ⁿ", "ᵒ", "ᵖ", "ᑫ", "ʳ", "ˢ", "ᵗ", "ᵘ", "ᵛ", "ʷ", "ˣ", "ʸ", "ᶻ",
    ],
    digits: ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"],
  },
  subscript: {
    upper: [
      "ₐ", "ᵦ", "𝒸", "𝒹", "ₑ", "𝒻", "𝓰", "ₕ", "ᵢ", "ⱼ", "ₖ", "ₗ", "ₘ",
      "ₙ", "ₒ", "ₚ", "ᵩ", "ᵣ", "ₛ", "ₜ", "ᵤ", "ᵥ", "𝓌", "ₓ", "ᵧ", "𝓏",
    ],
    lower: [
      "ₐ", "ᵦ", "𝒸", "𝒹", "ₑ", "𝒻", "𝓰", "ₕ", "ᵢ", "ⱼ", "ₖ", "ₗ", "ₘ",
      "ₙ", "ₒ", "ₚ", "ᵩ", "ᵣ", "ₛ", "ₜ", "ᵤ", "ᵥ", "𝓌", "ₓ", "ᵧ", "𝓏",
    ],
    digits: ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"],
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
  "circled-black": {
    upper: [
      "🅐", "🅑", "🅒", "🅓", "🅔", "🅕", "🅖", "🅗", "🅘", "🅙", "🅚", "🅛", "🅜",
      "🅝", "🅞", "🅟", "🅠", "🅡", "🅢", "🅣", "🅤", "🅥", "🅦", "🅧", "🅨", "🅩",
    ],
    lower: [
      "🅐", "🅑", "🅒", "🅓", "🅔", "🅕", "🅖", "🅗", "🅘", "🅙", "🅚", "🅛", "🅜",
      "🅝", "🅞", "🅟", "🅠", "🅡", "🅢", "🅣", "🅤", "🅥", "🅦", "🅧", "🅨", "🅩",
    ],
    digits: ["⓿", "❶", "❷", "❸", "❹", "❺", "❻", "❼", "❽", "❾"],
  },
  squared: {
    upper: [
      "🄰", "🄱", "🄲", "🄳", "🄴", "🄵", "🄶", "🄷", "🄸", "🄹", "🄺", "🄻", "🄼",
      "🄽", "🄾", "🄿", "🅀", "🅁", "🅂", "🅃", "🅄", "🅅", "🅆", "🅇", "🅈", "🅉",
    ],
    lower: [
      "🄰", "🄱", "🄲", "🄳", "🄴", "🄵", "🄶", "🄷", "🄸", "🄹", "🄺", "🄻", "🄼",
      "🄽", "🄾", "🄿", "🅀", "🅁", "🅂", "🅃", "🅄", "🅅", "🅆", "🅇", "🅈", "🅉",
    ],
  },
  "squared-black": {
    upper: [
      "🅰", "🅱", "🅲", "🅳", "🅴", "🅵", "🅶", "🅷", "🅸", "🅹", "🅺", "🅻", "🅼",
      "🅽", "🅾", "🅿", "🆀", "🆁", "🆂", "🆃", "🆄", "🆅", "🆆", "🆇", "🆈", "🆉",
    ],
    lower: [
      "🅰", "🅱", "🅲", "🅳", "🅴", "🅵", "🅶", "🅷", "🅸", "🅹", "🅺", "🅻", "🅼",
      "🅽", "🅾", "🅿", "🆀", "🆁", "🆂", "🆃", "🆄", "🆅", "🆆", "🆇", "🆈", "🆉",
    ],
  },
  "currency-symbols": {
    upper: [
      "Λ", "ß", "¢", "Ð", "Ɛ", "Ƒ", "₲", "н", "ɪ", "ʝ", "Ҡ", "Ł", "௱",
      "Л", "Ø", "þ", "Ǫ", "尺", "ら", "Ť", "Ʊ", "Ʋ", "Ш", "Ж", "Ұ", "Ẕ",
    ],
    lower: [
      "λ", "в", "¢", "Ð", "є", "ƒ", "g", "н", "ι", "ʝ", "к", "ℓ", "м",
      "η", "σ", "ρ", "ҩ", "я", "ѕ", "т", "υ", "ν", "ω", "χ", "у", "z",
    ],
  },
  "katakana-style": {
    upper: [
      "ﾑ", "乃", "ᄃ", "Ð", "乇", "ｷ", "Ǥ", "ん", "ﾉ", "ﾌ", "ズ", "ﾚ", "从",
      "刀", "Ø", "ｱ", "Ҩ", "尺", "丂", "ｲ", "Ц", "ﾘ", "Щ", "ﾒ", "ﾘ", "乙",
    ],
    lower: [
      "ﾑ", "乃", "ᄃ", "Ð", "乇", "ｷ", "Ǥ", "ん", "ﾉ", "ﾌ", "ズ", "ﾚ", "从",
      "刀", "Ø", "ｱ", "Ҩ", "尺", "丂", "ｲ", "Ц", "ﾘ", "Щ", "ﾒ", "ﾘ", "乙",
    ],
  },
  "runic-style": {
    upper: [
      "ᚨ", "ᛒ", "ᚲ", "ᛞ", "ᛖ", "ᚠ", "ᚷ", "ᚺ", "ᛁ", "ᛃ", "ᚲ", "ᛚ", "ᛗ",
      "ᚾ", "ᛟ", "ᛈ", "ᛩ", "ᚱ", "ᛋ", "ᛏ", "ᚢ", "ᚡ", "ᚹ", "ᛉ", "ᛦ", "ᛯ",
    ],
    lower: [
      "ᚨ", "ᛒ", "ᚲ", "ᛞ", "ᛖ", "ᚠ", "ᚷ", "ᚺ", "ᛁ", "ᛃ", "ᚲ", "ᛚ", "ᛗ",
      "ᚾ", "ᛟ", "ᛈ", "ᛩ", "ᚱ", "ᛋ", "ᛏ", "ᚢ", "ᚡ", "ᚹ", "ᛉ", "ᛦ", "ᛯ",
    ],
  },
};

const UPSIDE_DOWN_MAP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ",
  k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ",
  u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "∀", B: "ᗺ", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I", J: "ſ",
  K: "⋊", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Ò", R: "ᴚ", S: "S", T: "⊥",
  U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6",
  "?": "¿", "!": "¡", ".": "˙", ",": "'", "'": ",", "\"": "„", "<": ">", ">": "<",
  "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "&": "⅋", "_": "‾",
};

const MIRRORED_MAP: Record<string, string> = {
  A: "A", B: "ᙠ", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "ꟻ", G: "Ꭾ", H: "H", I: "I", J: "ᒐ",
  K: "ʞ", L: "⅃", M: "M", N: "И", O: "O", P: "ꟼ", Q: "Ọ", R: "Я", S: "Ꙅ", T: "T",
  U: "U", V: "V", W: "W", X: "X", Y: "Y", Z: "S",
  a: "ɒ", b: "d", c: "ɔ", d: "b", e: "ɘ", f: "Ꮈ", g: "ǫ", h: "ʜ", i: "i", j: "į",
  k: "ʞ", l: "|", m: "m", n: "n", o: "o", p: "q", q: "p", r: "ɿ", s: "ꙅ", t: "ƚ",
  u: "u", v: "v", w: "w", x: "x", y: "ʏ", z: "ƹ",
  "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<",
};

export const STYLE_METADATA: Record<
  FancyFontStyle,
  { name: string; category: FancyFontCategory }
> = {
  // Alphabets
  gothic: { name: "Old English / Fraktur", category: "alphabets" },
  "bold-gothic": { name: "Bold Fraktur", category: "alphabets" },
  script: { name: "Script / Cursive", category: "alphabets" },
  "bold-script": { name: "Bold Script Cursive", category: "alphabets" },
  "bold-serif": { name: "Bold Serif", category: "alphabets" },
  "italic-serif": { name: "Italic Serif", category: "alphabets" },
  "bold-italic-serif": { name: "Bold Italic Serif", category: "alphabets" },
  "bold-sans": { name: "Bold Sans-Serif", category: "alphabets" },
  "sans-italic": { name: "Sans-Serif Italic", category: "alphabets" },
  "sans-bold-italic": { name: "Sans Bold Italic", category: "alphabets" },
  "double-struck": { name: "Double-Struck / Blackboard", category: "alphabets" },
  monospace: { name: "Monospace / Typewriter", category: "alphabets" },
  fullwidth: { name: "Wide / Fullwidth", category: "alphabets" },
  "small-caps": { name: "Small Caps", category: "alphabets" },
  superscript: { name: "Superscript (Tiny High)", category: "alphabets" },
  subscript: { name: "Subscript (Tiny Low)", category: "alphabets" },
  "upside-down": { name: "Upside Down / Flipped", category: "alphabets" },
  mirrored: { name: "Mirrored / Backwards", category: "alphabets" },

  // Circled & Squared
  circled: { name: "Circled / Bubble", category: "circled-squared" },
  "circled-black": { name: "Black Bubble (Inverted)", category: "circled-squared" },
  squared: { name: "Squared Box", category: "circled-squared" },
  "squared-black": { name: "Negative Black Square", category: "circled-squared" },

  // Aesthetic & Symbols
  "currency-symbols": { name: "Aesthetic Hacker / Symbols", category: "alphabets" },
  "katakana-style": { name: "Japanese Katakana Look", category: "alphabets" },
  "runic-style": { name: "Ancient Norse Runes", category: "alphabets" },
  "crazy-mix": { name: "Crazy Stylish Mixed Lettering", category: "alphabets" },

  // Combining & Lines
  strikethrough: { name: "Strikethrough Line", category: "combining-lines" },
  "slash-strike": { name: "Slash Strike", category: "combining-lines" },
  underline: { name: "Underline Line", category: "combining-lines" },
  "double-underline": { name: "Double Underline", category: "combining-lines" },
  "tilde-strike": { name: "Tilde Strike Wave", category: "combining-lines" },
  "cross-box": { name: "Cross Boxed Glyphs", category: "combining-lines" },
  "sparkle-combining": { name: "Sparkle Ray Diacritic", category: "combining-lines" },
  "seagull-below": { name: "Seagull Accent", category: "combining-lines" },
  "bridge-above": { name: "Bridge Above Accent", category: "combining-lines" },

  // Brackets & Boxes
  "lenticular-brackets": { name: "Thick Lenticular Brackets 【】", category: "brackets-boxes" },
  "corner-brackets": { name: "Corner Asian Brackets 『』", category: "brackets-boxes" },
  "white-brackets": { name: "Double White Brackets ⟦⟧", category: "brackets-boxes" },
  "bar-boxed": { name: "Overline Bar Box [t̲̅]", category: "brackets-boxes" },

  // Joiners & Connectors
  "joiner-hearts": { name: "Hearts Connector (♥)", category: "joiners" },
  "joiner-stars": { name: "Star Dust Connector (⋆)", category: "joiners" },
  "joiner-bubbles": { name: "Bubble Connector (⊶)", category: "joiners" },
  "joiner-blocks": { name: "Textured Shading (░)", category: "joiners" },
  "joiner-dashed": { name: "Dashed Bar Divider (╎)", category: "joiners" },
  "joiner-waves": { name: "Wave Ribbon (〜)", category: "joiners" },

  // Wings & Decorative Frames
  "wings-stars": { name: "Stars & Wings Frame ★彡...彡★", category: "decorations-wings" },
  "wings-sparkle": { name: "Sparkle Wings ミ★ ... ★彡", category: "decorations-wings" },
  "royal-flourish": { name: "Royal Flourish ꧁•⊹٭...٭⊹•꧂", category: "decorations-wings" },
  "audio-waves": { name: "Audio Equalizer ıllıllı...ıllıllı", category: "decorations-wings" },
  "cute-hearts": { name: "Cute Sparkle Hearts (◍•ᴗ•◍) 💖", category: "decorations-wings" },
  "ribbon-hearts": { name: "Sweet Ribbon Hearts 💖´ *•.¸♥¸.•*", category: "decorations-wings" },
  "kaomoji-hug": { name: "Cute Kaomoji Hug (づ｡◕‿‿◕｡)づ", category: "decorations-wings" },
  "diamond-badge": { name: "Diamond Badge ◈━◈...◈━◈", category: "decorations-wings" },
  "sword-shield": { name: "Warrior Swords ⚔️...⚔️", category: "decorations-wings" },
  "bookmark-love": { name: "Bookmark Love '*•.¸♡...♡¸.•*'", category: "decorations-wings" },
  "magic-stars": { name: "Magic Dust ⋆✨...✨⋆", category: "decorations-wings" },
  "flower-blossom": { name: "Sakura Blossom 🌸💮...💮🌸", category: "decorations-wings" },
};

/**
 * Transforms text into a specific fancy font style.
 */
export function convertFancyFont(text: string, style: FancyFontStyle): string {
  if (!text) return "";

  // 1. Table-based font mapping
  const map = FONT_MAPS[style];
  if (map) {
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

      result += char;
    }
    return result;
  }

  // 2. Specialized Algorithmic Styles
  switch (style) {
    case "upside-down": {
      const flipped = Array.from(text)
        .map((ch) => UPSIDE_DOWN_MAP[ch] || ch)
        .reverse()
        .join("");
      return flipped;
    }

    case "mirrored": {
      const mirrored = Array.from(text)
        .map((ch) => MIRRORED_MAP[ch] || ch)
        .reverse()
        .join("");
      return mirrored;
    }

    case "crazy-mix": {
      // Alternates Fraktur, Script, Circled, Small caps and adds cute emojis
      const pool = ["gothic", "script", "circled", "small-caps", "bold-sans"];
      let mixed = "";
      let i = 0;
      for (const char of text) {
        if (/[a-zA-Z]/.test(char)) {
          const s = pool[i % pool.length] as FancyFontStyle;
          mixed += convertFancyFont(char, s);
          i++;
        } else {
          mixed += char;
        }
      }
      return `🍓🏆 ${mixed} 🍔🍮`;
    }

    // Combining Diacritics
    case "strikethrough":
      return Array.from(text).map((c) => (c === " " ? " " : `${c}\u0336`)).join("");

    case "slash-strike":
      return Array.from(text).map((c) => (c === " " ? " " : `${c}\u0338`)).join("");

    case "underline":
      return Array.from(text).map((c) => (c === " " ? " " : `${c}\u0332`)).join("");

    case "double-underline":
      return Array.from(text).map((c) => (c === " " ? " " : `${c}\u0333`)).join("");

    case "tilde-strike":
      return Array.from(text).map((c) => (c === " " ? " " : `${c}\u0334`)).join("");

    case "cross-box":
      return Array.from(text).map((c) => (c === " " ? " " : `${c}\u033D\u0353`)).join("");

    case "sparkle-combining":
      return Array.from(text).map((c) => (c === " " ? " " : `${c}\u0489`)).join("");

    case "seagull-below":
      return Array.from(text).map((c) => (c === " " ? " " : `${c}\u033C`)).join("");

    case "bridge-above":
      return Array.from(text).map((c) => (c === " " ? " " : `${c}\u0346`)).join("");

    // Brackets
    case "lenticular-brackets":
      return Array.from(text).map((c) => (c === " " ? " " : `【${c}】`)).join("");

    case "corner-brackets":
      return Array.from(text).map((c) => (c === " " ? " " : `『${c}』`)).join("");

    case "white-brackets":
      return Array.from(text).map((c) => (c === " " ? " " : `⟦${c}⟧`)).join("");

    case "bar-boxed":
      return Array.from(text).map((c) => (c === " " ? " " : `[${c}\u0305\u0332]`)).join("");

    // Joiners & Connectors
    case "joiner-hearts":
      return Array.from(text).map((c) => (c === " " ? " " : c)).join("♥");

    case "joiner-stars":
      return Array.from(text).map((c) => (c === " " ? " " : c)).join("⋆");

    case "joiner-bubbles":
      return Array.from(text).map((c) => (c === " " ? " " : c)).join("⊶");

    case "joiner-blocks":
      return `░${Array.from(text).map((c) => (c === " " ? " " : c)).join("░")}░`;

    case "joiner-dashed":
      return Array.from(text).map((c) => (c === " " ? " " : c)).join("╎");

    case "joiner-waves":
      return Array.from(text).map((c) => (c === " " ? " " : c)).join("〜");

    // Wings & Frames
    case "wings-stars": {
      const caps = convertFancyFont(text, "small-caps");
      return `★彡[${caps}]彡★`;
    }

    case "wings-sparkle": {
      const italic = convertFancyFont(text, "sans-italic");
      return `ミ★ ${italic} ★彡`;
    }

    case "royal-flourish":
      return `꧁•⊹٭${text}٭⊹•꧂`;

    case "audio-waves":
      return `ıllıllı ${text} ıllıllı`;

    case "cute-hearts":
      return `(◍•ᴗ•◍) ミ💖 ${text} 💖彡`;

    case "ribbon-hearts":
      return `💖´ *•.¸♥¸.•** ${text} **•.¸♥¸.•*´💖`;

    case "kaomoji-hug":
      return `(づ｡◕‿‿◕｡)づ ${text} ٩(˘◡˘)۶`;

    case "diamond-badge":
      return `◈━◈ ${text} ◈━◈`;

    case "sword-shield":
      return `⚔️ ${text} ⚔️`;

    case "bookmark-love":
      return `'*•.¸♡ ${text} ♡¸.•*'`;

    case "magic-stars":
      return `⋆✨ ${text} ✨⋆`;

    case "flower-blossom":
      return `🌸💮 ${text} 💮🌸`;

    default:
      return text;
  }
}

/**
 * Returns all available fancy font styles.
 */
export const ALL_FANCY_FONT_STYLES: FancyFontStyle[] = Object.keys(
  STYLE_METADATA
) as FancyFontStyle[];

/**
 * Generates all fancy font variations for a given input text.
 */
export function generateAllFancyFonts(text: string): FancyFontItem[] {
  return ALL_FANCY_FONT_STYLES.map((id) => {
    const meta = STYLE_METADATA[id];
    return {
      id,
      name: meta?.name || id,
      category: meta?.category || "alphabets",
      preview: convertFancyFont(text, id),
    };
  });
}
