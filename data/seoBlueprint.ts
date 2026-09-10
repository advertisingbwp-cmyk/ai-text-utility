export interface ToolSeoBlueprint {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  aboveTheFoldIntro: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  popularAnchor: string;
  clusterSlugs: string[];
}

export const SEO_BLUEPRINT_MAP: Record<string, ToolSeoBlueprint> = {
  "word-counter": {
    slug: "word-counter",
    title: "Word Counter – Free Online Word Count & Character Counter",
    metaDescription:
      "Count words, characters, sentences and paragraphs instantly with this free online word counter. Fast, accurate and easy to use.",
    h1: "Free Word Counter",
    aboveTheFoldIntro:
      "Count words and characters instantly. Paste or type your text to see word count, character count, sentences, paragraphs and more in real time.",
    primaryKeyword: "word counter",
    secondaryKeywords: [
      "word counter online",
      "word count",
      "word count checker",
      "count words",
      "online word counter",
      "character counter",
      "character count",
      "sentence counter",
      "paragraph counter",
      "reading time",
    ],
    popularAnchor: "Free Word Counter",
    clusterSlugs: [
      "character-frequency",
      "word-frequency",
      "case-converter",
      "remove-duplicate-lines",
      "regex-tester",
    ],
  },
  "json-formatter": {
    slug: "json-formatter",
    title: "JSON Formatter & Validator – Free Online JSON Beautifier",
    metaDescription:
      "Format, beautify and validate JSON online. Fix unreadable JSON, check syntax and instantly view properly formatted JSON for free.",
    h1: "JSON Formatter & Validator",
    aboveTheFoldIntro:
      "Format and validate JSON instantly. Paste your JSON to beautify its structure, improve readability and detect syntax errors.",
    primaryKeyword: "json formatter",
    secondaryKeywords: [
      "json formatter online",
      "json beautifier",
      "json validator",
      "format json",
      "json pretty print",
      "json viewer",
      "json checker",
      "json parser",
    ],
    popularAnchor: "Online JSON Formatter",
    clusterSlugs: [
      "json-to-csv",
      "csv-to-json",
      "query-string-parser",
      "jwt-decoder",
      "base64",
    ],
  },
  "password-generator": {
    slug: "password-generator",
    title: "Password Generator – Free Strong & Random Password Generator",
    metaDescription:
      "Generate strong, random passwords instantly. Choose password length, characters and options with this free online password generator.",
    h1: "Strong Password Generator",
    aboveTheFoldIntro:
      "Generate strong random passwords with customizable length and character options. Create a new password instantly in your browser.",
    primaryKeyword: "password generator",
    secondaryKeywords: [
      "random password generator",
      "strong password generator",
      "secure password generator",
      "password generator online",
      "strong random password",
      "16 character password generator",
      "20 character password generator",
      "random password",
    ],
    popularAnchor: "Strong Password Generator",
    clusterSlugs: [
      "uuid-generator",
      "base64",
      "hash-generator",
      "lorem-ipsum",
    ],
  },
  "uuid-generator": {
    slug: "uuid-generator",
    title: "UUID Generator – Free Random UUID v4 Generator Online",
    metaDescription:
      "Generate random UUID v4 identifiers instantly. Free online UUID generator with one-click copying and no unnecessary setup.",
    h1: "UUID v4 Generator",
    aboveTheFoldIntro:
      "Generate random UUID v4 identifiers instantly. Create a UUID, copy it with one click and generate another whenever you need one.",
    primaryKeyword: "uuid generator",
    secondaryKeywords: [
      "uuid generator online",
      "UUID v4 generator",
      "random UUID generator",
      "generate UUID",
      "UUID creator",
      "GUID generator",
      "UUID generator free",
      "random UUID",
    ],
    popularAnchor: "UUID Generator",
    clusterSlugs: [
      "password-generator",
      "base64",
      "json-formatter",
      "hash-generator",
    ],
  },
  "regex-tester": {
    slug: "regex-tester",
    title: "Regex Tester – Free Online Regular Expression Tester",
    metaDescription:
      "Test regular expressions online with this free regex tester. Check matches, validate patterns and quickly debug your regular expressions.",
    h1: "Regex Tester",
    aboveTheFoldIntro:
      "Test and debug regular expressions instantly. Enter a regex pattern and sample text to find matches and verify your expression.",
    primaryKeyword: "regex tester",
    secondaryKeywords: [
      "regex tester online",
      "regular expression tester",
      "regex checker",
      "regex validator",
      "regex debugger",
      "test regex",
      "regular expression tester online",
    ],
    popularAnchor: "Online Regex Tester",
    clusterSlugs: [
      "extract-emails-urls",
      "character-frequency",
      "word-frequency",
      "query-string-parser",
    ],
  },
  "case-converter": {
    slug: "case-converter",
    title: "Case Converter – Uppercase, Lowercase & Title Case Online",
    metaDescription:
      "Convert text to uppercase, lowercase, title case and more with this free online case converter. Fast, simple and easy to use.",
    h1: "Case Converter",
    aboveTheFoldIntro:
      "Convert text between uppercase, lowercase, title case, sentence case and other formats instantly.",
    primaryKeyword: "case converter",
    secondaryKeywords: [
      "uppercase converter",
      "lowercase converter",
      "title case converter",
      "sentence case converter",
      "change case",
      "text case converter",
      "uppercase lowercase converter",
      "proper case converter",
    ],
    popularAnchor: "Case Converter",
    clusterSlugs: [
      "word-counter",
      "remove-accents",
      "fancy-fonts",
      "reverse-text",
      "sort-lines",
    ],
  },
  "base64": {
    slug: "base64",
    title: "Base64 Encoder & Decoder – Free Online Base64 Tool",
    metaDescription:
      "Encode text to Base64 or decode Base64 back to text online. Fast, free and easy-to-use Base64 encoder and decoder.",
    h1: "Base64 Encoder & Decoder",
    aboveTheFoldIntro:
      "Encode text to Base64 or decode Base64 strings instantly. Use the tool directly in your browser.",
    primaryKeyword: "base64 encoder",
    secondaryKeywords: [
      "base64 decoder",
      "base64 encode",
      "base64 decode",
      "base64 converter",
      "base64 encoder online",
      "base64 decoder online",
      "decode base64",
      "encode to base64",
    ],
    popularAnchor: "Base64 Encoder & Decoder",
    clusterSlugs: [
      "url-encoder",
      "json-formatter",
      "hash-generator",
      "jwt-decoder",
    ],
  },
  "url-encoder": {
    slug: "url-encoder",
    title: "URL Encoder & Decoder – Free Online URL Encoding Tool",
    metaDescription:
      "Encode or decode URLs online with this free URL encoder and decoder. Convert special characters to percent encoding instantly.",
    h1: "URL Encoder & Decoder",
    aboveTheFoldIntro:
      "Encode URLs or decode percent-encoded text instantly. Convert special characters into URL-safe encoded values with ease.",
    primaryKeyword: "url encoder",
    secondaryKeywords: [
      "url decoder",
      "url encode",
      "url decode",
      "percent encoding",
      "url encoding online",
      "encode url",
      "decode url",
      "percent encode",
    ],
    popularAnchor: "URL Encoder & Decoder",
    clusterSlugs: [
      "base64",
      "query-string-parser",
      "slug-generator",
      "html-minifier",
      "json-formatter",
    ],
  },
  "jwt-decoder": {
    slug: "jwt-decoder",
    title: "JWT Decoder – Decode JSON Web Tokens Online",
    metaDescription:
      "Decode JWT tokens online and inspect their header and payload. Free JWT decoder for quickly viewing JSON Web Token data.",
    h1: "JWT Decoder",
    aboveTheFoldIntro:
      "Decode a JSON Web Token and inspect its header and payload instantly. Paste a JWT to view its encoded data in a readable format.",
    primaryKeyword: "jwt decoder",
    secondaryKeywords: [
      "jwt decoder online",
      "decode jwt",
      "jwt token decoder",
      "json web token decoder",
      "jwt debugger",
      "jwt parser",
      "decode jwt token",
    ],
    popularAnchor: "JWT Decoder",
    clusterSlugs: [
      "json-formatter",
      "base64",
      "hash-generator",
      "query-string-parser",
    ],
  },
  "lorem-ipsum": {
    slug: "lorem-ipsum",
    title: "Lorem Ipsum Generator – Free Dummy Text Generator",
    metaDescription:
      "Generate Lorem Ipsum placeholder text instantly. Create paragraphs, sentences or words of dummy text for websites, designs and layouts.",
    h1: "Lorem Ipsum Generator",
    aboveTheFoldIntro:
      "Generate placeholder Lorem Ipsum text for websites, designs, mockups and layouts. Choose the amount of text you need and copy it instantly.",
    primaryKeyword: "lorem ipsum generator",
    secondaryKeywords: [
      "lorem ipsum",
      "lorem ipsum text",
      "dummy text generator",
      "placeholder text generator",
      "random text generator",
      "lorem ipsum generator online",
      "dummy text",
    ],
    popularAnchor: "Lorem Ipsum Generator",
    clusterSlugs: [
      "word-counter",
      "case-converter",
      "fancy-fonts",
      "character-frequency",
    ],
  },
};

export function getToolSeoBlueprint(slug: string): ToolSeoBlueprint | undefined {
  return SEO_BLUEPRINT_MAP[slug];
}

export const TOP_10_P0_TOOLS: string[] = [
  "word-counter",
  "json-formatter",
  "password-generator",
  "uuid-generator",
  "regex-tester",
  "case-converter",
  "base64",
  "url-encoder",
  "jwt-decoder",
  "lorem-ipsum",
];
