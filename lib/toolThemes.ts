import { ToolCategory } from "@/data/toolsRegistry";

export interface ColorTheme {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const CATEGORY_THEMES: Record<ToolCategory, ColorTheme> = {
  Text: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200/80 dark:border-blue-800/60",
    badgeBg: "bg-blue-50 dark:bg-blue-950/60",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-200/80 dark:border-blue-800/60",
  },
  Format: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/60",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-200/80 dark:border-emerald-800/60",
  },
  Cleanup: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200/80 dark:border-amber-800/60",
    badgeBg: "bg-amber-50 dark:bg-amber-950/60",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBorder: "border-amber-200/80 dark:border-amber-800/60",
  },
  Transform: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200/80 dark:border-purple-800/60",
    badgeBg: "bg-purple-50 dark:bg-purple-950/60",
    badgeText: "text-purple-700 dark:text-purple-300",
    badgeBorder: "border-purple-200/80 dark:border-purple-800/60",
  },
  "Date & Time": {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-200/80 dark:border-sky-800/60",
    badgeBg: "bg-sky-50 dark:bg-sky-950/60",
    badgeText: "text-sky-700 dark:text-sky-300",
    badgeBorder: "border-sky-200/80 dark:border-sky-800/60",
  },
  "AI Magic": {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "border-fuchsia-200/80 dark:border-fuchsia-800/60",
    badgeBg: "bg-fuchsia-50 dark:bg-fuchsia-950/60",
    badgeText: "text-fuchsia-700 dark:text-fuchsia-300",
    badgeBorder: "border-fuchsia-200/80 dark:border-fuchsia-800/60",
  },
};

export const TOOL_THEMES: Record<string, ColorTheme> = {
  // === Text Tools ===
  "word-counter": {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/60",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-200/80 dark:border-emerald-800/60",
  },
  "slug-generator": {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200/80 dark:border-indigo-800/60",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/60",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    badgeBorder: "border-indigo-200/80 dark:border-indigo-800/60",
  },
  "remove-emojis": {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200/80 dark:border-amber-800/60",
    badgeBg: "bg-amber-50 dark:bg-amber-950/60",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBorder: "border-amber-200/80 dark:border-amber-800/60",
  },
  "tabs-to-spaces": {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200/80 dark:border-cyan-800/60",
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/60",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    badgeBorder: "border-cyan-200/80 dark:border-cyan-800/60",
  },
  "remove-accents": {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200/80 dark:border-rose-800/60",
    badgeBg: "bg-rose-50 dark:bg-rose-950/60",
    badgeText: "text-rose-700 dark:text-rose-300",
    badgeBorder: "border-rose-200/80 dark:border-rose-800/60",
  },
  "character-frequency": {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200/80 dark:border-violet-800/60",
    badgeBg: "bg-violet-50 dark:bg-violet-950/60",
    badgeText: "text-violet-700 dark:text-violet-300",
    badgeBorder: "border-violet-200/80 dark:border-violet-800/60",
  },
  "word-frequency": {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200/80 dark:border-blue-800/60",
    badgeBg: "bg-blue-50 dark:bg-blue-950/60",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-200/80 dark:border-blue-800/60",
  },
  "extract-emails-urls": {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-200/80 dark:border-teal-800/60",
    badgeBg: "bg-teal-50 dark:bg-teal-950/60",
    badgeText: "text-teal-700 dark:text-teal-300",
    badgeBorder: "border-teal-200/80 dark:border-teal-800/60",
  },
  "regex-tester": {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200/80 dark:border-orange-800/60",
    badgeBg: "bg-orange-50 dark:bg-orange-950/60",
    badgeText: "text-orange-700 dark:text-orange-300",
    badgeBorder: "border-orange-200/80 dark:border-orange-800/60",
  },
  "query-string-parser": {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "border-fuchsia-200/80 dark:border-fuchsia-800/60",
    badgeBg: "bg-fuchsia-50 dark:bg-fuchsia-950/60",
    badgeText: "text-fuchsia-700 dark:text-fuchsia-300",
    badgeBorder: "border-fuchsia-200/80 dark:border-fuchsia-800/60",
  },

  // === Format Tools ===
  "json-formatter": {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200/80 dark:border-amber-800/60",
    badgeBg: "bg-amber-50 dark:bg-amber-950/60",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBorder: "border-amber-200/80 dark:border-amber-800/60",
  },
  "json-to-csv": {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/60",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-200/80 dark:border-emerald-800/60",
  },
  "csv-to-json": {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-200/80 dark:border-sky-800/60",
    badgeBg: "bg-sky-50 dark:bg-sky-950/60",
    badgeText: "text-sky-700 dark:text-sky-300",
    badgeBorder: "border-sky-200/80 dark:border-sky-800/60",
  },
  "add-line-numbers": {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200/80 dark:border-indigo-800/60",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/60",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    badgeBorder: "border-indigo-200/80 dark:border-indigo-800/60",
  },
  "markdown-to-html": {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200/80 dark:border-rose-800/60",
    badgeBg: "bg-rose-50 dark:bg-rose-950/60",
    badgeText: "text-rose-700 dark:text-rose-300",
    badgeBorder: "border-rose-200/80 dark:border-rose-800/60",
  },
  "html-minifier": {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200/80 dark:border-purple-800/60",
    badgeBg: "bg-purple-50 dark:bg-purple-950/60",
    badgeText: "text-purple-700 dark:text-purple-300",
    badgeBorder: "border-purple-200/80 dark:border-purple-800/60",
  },

  // === Cleanup Tools ===
  "remove-extra-spaces": {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-200/80 dark:border-sky-800/60",
    badgeBg: "bg-sky-50 dark:bg-sky-950/60",
    badgeText: "text-sky-700 dark:text-sky-300",
    badgeBorder: "border-sky-200/80 dark:border-sky-800/60",
  },
  "remove-duplicate-lines": {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200/80 dark:border-red-800/60",
    badgeBg: "bg-red-50 dark:bg-red-950/60",
    badgeText: "text-red-700 dark:text-red-300",
    badgeBorder: "border-red-200/80 dark:border-red-800/60",
  },
  "remove-empty-lines": {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200/80 dark:border-amber-800/60",
    badgeBg: "bg-amber-50 dark:bg-amber-950/60",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBorder: "border-amber-200/80 dark:border-amber-800/60",
  },
  "trim-lines": {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-200/80 dark:border-teal-800/60",
    badgeBg: "bg-teal-50 dark:bg-teal-950/60",
    badgeText: "text-teal-700 dark:text-teal-300",
    badgeBorder: "border-teal-200/80 dark:border-teal-800/60",
  },
  "strip-html-tags": {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200/80 dark:border-violet-800/60",
    badgeBg: "bg-violet-50 dark:bg-violet-950/60",
    badgeText: "text-violet-700 dark:text-violet-300",
    badgeBorder: "border-violet-200/80 dark:border-violet-800/60",
  },
  "remove-line-breaks": {
    bg: "bg-pink-50 dark:bg-pink-950/40",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200/80 dark:border-pink-800/60",
    badgeBg: "bg-pink-50 dark:bg-pink-950/60",
    badgeText: "text-pink-700 dark:text-pink-300",
    badgeBorder: "border-pink-200/80 dark:border-pink-800/60",
  },
  "remove-special-chars": {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200/80 dark:border-blue-800/60",
    badgeBg: "bg-blue-50 dark:bg-blue-950/60",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-200/80 dark:border-blue-800/60",
  },

  // === Transform Tools ===
  "case-converter": {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200/80 dark:border-violet-800/60",
    badgeBg: "bg-violet-50 dark:bg-violet-950/60",
    badgeText: "text-violet-700 dark:text-violet-300",
    badgeBorder: "border-violet-200/80 dark:border-violet-800/60",
  },
  "fancy-fonts": {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "border-fuchsia-200/80 dark:border-fuchsia-800/60",
    badgeBg: "bg-fuchsia-50 dark:bg-fuchsia-950/60",
    badgeText: "text-fuchsia-700 dark:text-fuchsia-300",
    badgeBorder: "border-fuchsia-200/80 dark:border-fuchsia-800/60",
  },
  "sort-lines": {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200/80 dark:border-cyan-800/60",
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/60",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    badgeBorder: "border-cyan-200/80 dark:border-cyan-800/60",
  },
  "reverse-text": {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200/80 dark:border-orange-800/60",
    badgeBg: "bg-orange-50 dark:bg-orange-950/60",
    badgeText: "text-orange-700 dark:text-orange-300",
    badgeBorder: "border-orange-200/80 dark:border-orange-800/60",
  },
  base64: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/60",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-200/80 dark:border-emerald-800/60",
  },
  "url-encoder": {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200/80 dark:border-blue-800/60",
    badgeBg: "bg-blue-50 dark:bg-blue-950/60",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-200/80 dark:border-blue-800/60",
  },
  "hash-generator": {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200/80 dark:border-rose-800/60",
    badgeBg: "bg-rose-50 dark:bg-rose-950/60",
    badgeText: "text-rose-700 dark:text-rose-300",
    badgeBorder: "border-rose-200/80 dark:border-rose-800/60",
  },
  "jwt-decoder": {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200/80 dark:border-amber-800/60",
    badgeBg: "bg-amber-50 dark:bg-amber-950/60",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBorder: "border-amber-200/80 dark:border-amber-800/60",
  },
  "password-generator": {
    bg: "bg-green-50 dark:bg-green-950/40",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200/80 dark:border-green-800/60",
    badgeBg: "bg-green-50 dark:bg-green-950/60",
    badgeText: "text-green-700 dark:text-green-300",
    badgeBorder: "border-green-200/80 dark:border-green-800/60",
  },
  "uuid-generator": {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200/80 dark:border-indigo-800/60",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/60",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    badgeBorder: "border-indigo-200/80 dark:border-indigo-800/60",
  },
  "lorem-ipsum": {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-200/80 dark:border-teal-800/60",
    badgeBg: "bg-teal-50 dark:bg-teal-950/60",
    badgeText: "text-teal-700 dark:text-teal-300",
    badgeBorder: "border-teal-200/80 dark:border-teal-800/60",
  },
  rot13: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200/80 dark:border-purple-800/60",
    badgeBg: "bg-purple-50 dark:bg-purple-950/60",
    badgeText: "text-purple-700 dark:text-purple-300",
    badgeBorder: "border-purple-200/80 dark:border-purple-800/60",
  },

  // === Date & Time Tools ===
  "unix-timestamp": {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-200/80 dark:border-sky-800/60",
    badgeBg: "bg-sky-50 dark:bg-sky-950/60",
    badgeText: "text-sky-700 dark:text-sky-300",
    badgeBorder: "border-sky-200/80 dark:border-sky-800/60",
  },
  "date-difference": {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/60",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-200/80 dark:border-emerald-800/60",
  },

  // === AI Magic Tools ===
  "ai-grammar": {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200/80 dark:border-violet-800/60",
    badgeBg: "bg-violet-50 dark:bg-violet-950/60",
    badgeText: "text-violet-700 dark:text-violet-300",
    badgeBorder: "border-violet-200/80 dark:border-violet-800/60",
  },
  "ai-professional": {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200/80 dark:border-blue-800/60",
    badgeBg: "bg-blue-50 dark:bg-blue-950/60",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-200/80 dark:border-blue-800/60",
  },
  "ai-friendly": {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200/80 dark:border-amber-800/60",
    badgeBg: "bg-amber-50 dark:bg-amber-950/60",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBorder: "border-amber-200/80 dark:border-amber-800/60",
  },
  "ai-summarize": {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "border-fuchsia-200/80 dark:border-fuchsia-800/60",
    badgeBg: "bg-fuchsia-50 dark:bg-fuchsia-950/60",
    badgeText: "text-fuchsia-700 dark:text-fuchsia-300",
    badgeBorder: "border-fuchsia-200/80 dark:border-fuchsia-800/60",
  },
  "ai-paraphrase": {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-200/80 dark:border-teal-800/60",
    badgeBg: "bg-teal-50 dark:bg-teal-950/60",
    badgeText: "text-teal-700 dark:text-teal-300",
    badgeBorder: "border-teal-200/80 dark:border-teal-800/60",
  },
  "ai-expand": {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200/80 dark:border-rose-800/60",
    badgeBg: "bg-rose-50 dark:bg-rose-950/60",
    badgeText: "text-rose-700 dark:text-rose-300",
    badgeBorder: "border-rose-200/80 dark:border-rose-800/60",
  },
};

export function getToolTheme(toolId: string, category?: ToolCategory): ColorTheme {
  if (TOOL_THEMES[toolId]) {
    return TOOL_THEMES[toolId];
  }
  if (category && CATEGORY_THEMES[category]) {
    return CATEGORY_THEMES[category];
  }
  return {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200/80 dark:border-blue-800/60",
    badgeBg: "bg-blue-50 dark:bg-blue-950/60",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-200/80 dark:border-blue-800/60",
  };
}

export function getCategoryTheme(category: ToolCategory): ColorTheme {
  return CATEGORY_THEMES[category] || CATEGORY_THEMES["Text"];
}
