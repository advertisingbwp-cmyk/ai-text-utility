export type ToolCategory =
  | "Text"
  | "Format"
  | "Cleanup"
  | "Transform"
  | "Date & Time"
  | "AI Magic";

export type ToolLayout =
  | "transform"
  | "generator"
  | "dashboard"
  | "table"
  | "twoWay"
  | "validator"
  | "highlight"
  | "splitPreview"
  | "gallery"
  | "compact"
  | "ai";

export interface ToolDefinition {
  layout: ToolLayout;
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  description: string;
  icon: string; // Lucide icon name string
  keywords: string[];
  featured?: boolean;
  logicReference?: string;
  supportsLiveMode?: boolean;
  requiresAI?: boolean;
  sampleInput?: string;
  aliases?: string[];
  customComponent?: "regex-tester" | "json-formatter" | "password-generator" | "date-calculator" | "query-parser" | "default";
}

export const CATEGORIES: { name: ToolCategory; icon: string; description: string }[] = [
  { name: "Text", icon: "FileText", description: "Analyze, extract, and manipulate textual content" },
  { name: "Format", icon: "Code2", description: "Format, beautify, and convert structured data" },
  { name: "Cleanup", icon: "Eraser", description: "Sanitize, trim, and strip noise from text" },
  { name: "Transform", icon: "Shuffle", description: "Encode, convert cases, hash, and generate text" },
  { name: "Date & Time", icon: "Calendar", description: "Unix timestamps, date calculations, and intervals" },
  { name: "AI Magic", icon: "Sparkles", description: "AI-assisted rewriting, proofreading, and summarization" },
];
