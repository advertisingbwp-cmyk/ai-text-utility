"use client";

import React, { useState, useRef, useEffect } from "react";
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

  const active = useRef<AbortController | null>(null);
  const [resultReady, setResultReady] = useState(false);
  const [resultTool, setResultTool] = useState<string | null>(null);
  useEffect(() => {
    setIsLoading(false);
    setResultReady(false);
    setOutput("");
    setError(null);
    return () => { active.current?.abort(); active.current = null; };
  }, [tool.slug]);

  const invalidate = () => {
    active.current?.abort();
    active.current = null;
    setIsLoading(false);
    setResultReady(false);
    setOutput("");
    setError(null);
  };
  const changeInput = (value: string) => {
    invalidate();
    setInput(value);
  };
  const handleRun = () => {
    // Ref guard also protects repeated keyboard events before React rerenders.
    if (active.current) return;
    invalidate();
    if (!input.trim()) return;
    if (input.length > 10000) { setError("Use at most 10,000 characters."); return; }
    const controller = new AbortController();
    active.current = controller;
    setIsLoading(true);
    trackEvent("ai_tool_used", {toolSlug: tool.slug, category: tool.category, inputLength: input.length});
    requestAiTool(SLUG_TO_AI_MODE[tool.slug] || "grammar", input, controller.signal)
      .then(result => {
        if (active.current !== controller || controller.signal.aborted) return;
        setResultTool(tool.slug);
        setOutput(result);
        setResultReady(true);
      })
      .catch(err => {
        if (active.current !== controller || controller.signal.aborted) return;
        setOutput("");
        setResultReady(false);
        setError(err instanceof Error ? err.message : "AI transformation failed.");
      })
      .finally(() => {
        if (active.current !== controller) return;
        active.current = null;
        setIsLoading(false);
      });
  };
  const handleClear = () => changeInput("");
  const handleSwap = () => { if (resultReady) changeInput(output); };

  const customControls = (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs w-full">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium">
          <Sparkles size={13} className="text-blue-500 dark:text-blue-400" />
          AI-assisted writing
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          Text is sent to an AI provider. Review results before use.
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
        {isLoading && <button type="button" onClick={invalidate} className="px-3 py-1 rounded-lg border">Cancel request</button>}
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
      resultReady={resultReady && resultTool === tool.slug}
      onInputChange={changeInput}
      onRun={handleRun}
      onClear={handleClear}
      onSwap={handleSwap}
      isLoading={isLoading}
      error={error}
      customControls={customControls}
    />
  );
};
