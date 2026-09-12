"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolWorkspaceResolver } from "@/components/layouts";
import { requestAiTool, SLUG_TO_AI_MODE } from "@/lib/tools/aiTools";
import { trackEvent } from "@/lib/analytics";
import { Sparkles, RefreshCw, AlertTriangle } from "lucide-react";

export const AiTool: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const [input, setInput] = useState<string>(tool.sampleInput || "");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    const aiMode = SLUG_TO_AI_MODE[tool.slug] || "grammar";
    setIsLoading(true);
    setError(null);

    trackEvent("ai_tool_used", {
      toolSlug: tool.slug,
      category: tool.category,
      inputLength: input.length,
    });

    requestAiTool(aiMode, input)
      .then((res) => {
        setOutput(res);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "AI transformation failed.");
      })
      .finally(() => {
        setIsLoading(false);
      });
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

  const customControls = (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs w-full">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium">
          <Sparkles size={13} className="text-blue-500 dark:text-blue-400" />
          Google Gemini
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          Model: <strong className="text-slate-700 dark:text-slate-200">Gemini Flash</strong>
        </span>
        {input.length > 10000 ? (
          <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded">
            <AlertTriangle size={13} />
            Input exceeds limit ({input.length.toLocaleString()} / 10,000 chars)
          </span>
        ) : input.length > 8000 ? (
          <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
            <AlertTriangle size={13} />
            Approaching limit ({input.length.toLocaleString()} / 10,000 chars)
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {error && (
          <button
            type="button"
            onClick={handleRun}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors cursor-pointer"
          >
            <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
            Retry
          </button>
        )}
      </div>
    </div>
  );

  return (
    <ToolWorkspaceResolver
      tool={tool}
      input={input}
      output={output}
      onInputChange={setInput}
      onRun={handleRun}
      onClear={handleClear}
      onSwap={handleSwap}
      isLoading={isLoading}
      error={error}
      customControls={customControls}
    />
  );
};
