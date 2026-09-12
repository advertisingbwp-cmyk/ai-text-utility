"use client";

import React from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import {
  AiTool,
  DateTimeTool,
  FancyFontsTool,
  GeneratorTool,
  JsonTool,
  RegexTool,
  TableTool,
  TransformTool,
} from "@/components/tools";

export const ToolPageClient: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  // 1. AI Magic Tools (6 tools)
  if (tool.category === "AI Magic") {
    return <AiTool tool={tool} />;
  }

  // 2. Fancy Fonts Generator Workspace (1 tool)
  if (tool.slug === "fancy-fonts") {
    return <FancyFontsTool tool={tool} />;
  }

  // 3. Date & Time Tools (2 tools)
  if (
    tool.category === "Date & Time" ||
    tool.slug === "unix-timestamp" ||
    tool.slug === "date-difference"
  ) {
    return <DateTimeTool tool={tool} />;
  }

  // 4. Content & Hash Generators (4 tools)
  if (
    tool.slug === "password-generator" ||
    tool.slug === "uuid-generator" ||
    tool.slug === "lorem-ipsum" ||
    tool.slug === "hash-generator"
  ) {
    return <GeneratorTool tool={tool} />;
  }

  // 5. JSON, CSV, Markdown, HTML & JWT Parsers (6 tools)
  if (
    tool.slug === "json-formatter" ||
    tool.slug === "json-to-csv" ||
    tool.slug === "csv-to-json" ||
    tool.slug === "jwt-decoder" ||
    tool.slug === "markdown-to-html" ||
    tool.slug === "html-minifier"
  ) {
    return <JsonTool tool={tool} />;
  }

  // 6. Regex & Query String Inspectors (2 tools)
  if (tool.slug === "regex-tester" || tool.slug === "query-string-parser") {
    return <RegexTool tool={tool} />;
  }

  // 7. Table & Frequency Analytics Tools (4 tools)
  if (
    tool.slug === "word-counter" ||
    tool.slug === "character-frequency" ||
    tool.slug === "word-frequency" ||
    tool.slug === "extract-emails-urls"
  ) {
    return <TableTool tool={tool} />;
  }

  // 8. Text Transformations & Cleanups (18 tools)
  return <TransformTool tool={tool} />;
};

export default ToolPageClient;
