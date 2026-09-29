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
  "fancy-fonts": {
    slug: "fancy-fonts",
    title: "Fancy Font Generator – Cool Text & Stylish Fonts Copy Paste",
    metaDescription:
      "Generate fancy fonts and stylish text instantly. Create cool copy-and-paste fonts for Instagram, TikTok, Discord, gaming profiles, bios and social posts.",
    h1: "Fancy Font Generator",
    aboveTheFoldIntro:
      "Generate stylish Unicode text and fancy fonts instantly. Type your text once and copy cool font styles for Instagram bios, TikTok captions, Discord, gaming profiles and social media.",
    primaryKeyword: "fancy font generator",
    secondaryKeywords: [
      "fancy font generator",
      "fancy text generator",
      "cool fonts",
      "stylish text generator",
      "font generator copy paste",
      "instagram font generator",
      "instagram fonts",
      "tiktok fonts",
      "discord fonts",
      "cool text generator",
      "cursive text generator",
      "gothic text generator",
      "aesthetic fonts",
      "unicode font generator",
      "fancy letters",
      "stylish fonts copy paste",
    ],
    popularAnchor: "Fancy Font Generator",
    clusterSlugs: [
      "case-converter",
      "lorem-ipsum",
      "word-counter",
      "reverse-text",
      "remove-emojis",
    ],
  },
  "slug-generator": {
    slug: "slug-generator",
    title: "Slug Generator – Free URL Slug & SEO Friendly Slug Maker",
    metaDescription:
      "Convert text into clean, SEO-friendly URL slugs instantly. Create lowercase, hyphen-separated slugs for blog posts, pages and website URLs for free.",
    h1: "Free Slug Generator",
    aboveTheFoldIntro:
      "Convert titles, headings or any text into clean SEO-friendly URL slugs instantly. Generate lowercase, hyphen-separated slugs that are ready to use in websites, blogs and CMS platforms.",
    primaryKeyword: "slug generator",
    secondaryKeywords: [
      "slug generator",
      "url slug generator",
      "seo slug generator",
      "slug maker",
      "url slug maker",
      "seo friendly url generator",
      "convert text to slug",
      "text to slug",
      "permalink generator",
      "url slug converter",
      "website slug generator",
      "blog slug generator",
      "clean url generator",
      "seo friendly slug",
      "lowercase slug generator",
      "hyphen url generator",
    ],
    popularAnchor: "Free Slug Generator",
    clusterSlugs: [
      "url-encoder",
      "case-converter",
      "remove-accents",
      "remove-special-chars",
      "word-counter",
    ],
  },
  "json-to-csv": {
    slug: "json-to-csv",
    title: "JSON to CSV Converter – Convert JSON to CSV Online Free",
    metaDescription:
      "Convert JSON to CSV online instantly. Transform JSON arrays and structured data into clean CSV format for Excel, spreadsheets and data analysis.",
    h1: "JSON to CSV Converter",
    aboveTheFoldIntro:
      "Convert JSON data into clean CSV format instantly. Paste your JSON and generate spreadsheet-ready CSV for Excel, Google Sheets, databases and data workflows.",
    primaryKeyword: "json to csv",
    secondaryKeywords: [
      "json to csv",
      "json to csv converter",
      "convert json to csv",
      "json to csv online",
      "json converter",
      "json array to csv",
      "json file to csv",
      "json to excel",
      "json to spreadsheet",
      "convert json array to csv",
      "online json to csv converter",
      "json csv converter",
      "json data to csv",
      "json export csv",
      "json to comma separated values",
    ],
    popularAnchor: "JSON to CSV Converter",
    clusterSlugs: [
      "csv-to-json",
      "json-formatter",
      "query-string-parser",
      "base64",
      "word-counter",
    ],
  },
  "csv-to-json": {
    slug: "csv-to-json",
    title: "CSV to JSON Converter – Convert CSV to JSON Online Free",
    metaDescription:
      "Convert CSV to JSON online instantly. Transform spreadsheet rows into structured JSON objects for APIs, development, databases and data workflows.",
    h1: "CSV to JSON Converter",
    aboveTheFoldIntro:
      "Convert CSV data into structured JSON instantly. Paste spreadsheet-style rows and generate clean JSON objects for APIs, web apps, databases and development workflows.",
    primaryKeyword: "csv to json",
    secondaryKeywords: [
      "csv to json",
      "csv to json converter",
      "convert csv to json",
      "csv to json online",
      "csv converter",
      "csv file to json",
      "spreadsheet to json",
      "excel csv to json",
      "csv rows to json",
      "convert csv file to json",
      "online csv to json converter",
      "csv json converter",
      "csv data to json",
      "csv to json array",
      "tabular data to json",
    ],
    popularAnchor: "CSV to JSON Converter",
    clusterSlugs: [
      "json-to-csv",
      "json-formatter",
      "query-string-parser",
      "base64",
      "html-minifier",
    ],
  },
};

import { getToolBySlug } from "../tools/index.ts";

export function getToolSeoBlueprint(slug: string): ToolSeoBlueprint | undefined {
  if (SEO_BLUEPRINT_MAP[slug]) return SEO_BLUEPRINT_MAP[slug];
  const tool = getToolBySlug(slug);
  if (tool && SEO_BLUEPRINT_MAP[tool.slug]) {
    return SEO_BLUEPRINT_MAP[tool.slug];
  }
  return undefined;
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
