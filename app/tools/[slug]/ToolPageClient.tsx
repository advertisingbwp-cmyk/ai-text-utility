"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolLayout } from "@/components/ToolLayout";

export const ToolPageClient: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const [input, setInput] = useState<string>(tool.sampleInput || "");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = () => {
    setIsLoading(true);
    setError(null);

    // Foundation stub (Actual logic implemented in Phase 2)
    setTimeout(() => {
      setIsLoading(false);
      setOutput(
        `[Phase 1 Foundation Verified]\nTool: ${tool.name} (${tool.slug})\nCategory: ${tool.category}\nInput Characters: ${input.length}\nStatus: Architecture, SEO, layout, and keyboard shortcuts operational.`
      );
    }, 250);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setOutput("");
    }
  };

  return (
    <ToolLayout
      tool={tool}
      input={input}
      output={output}
      onInputChange={setInput}
      onRun={handleRun}
      onClear={handleClear}
      onSwap={handleSwap}
      isLoading={isLoading}
      error={error}
    />
  );
};
