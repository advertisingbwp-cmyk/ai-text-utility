"use client";

import React from "react";
import {
  Sparkles,
  FileText,
  Trash2,
  Download,
} from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { WorkspaceProps } from "./types";

export const AILayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  output,
  onInputChange,
  onRun,
  onClear,
  onDownload,
  isLoading = false,
  error = null,
  customControls,
  inputPlaceholder = "Enter text to transform with AI...",
}) => {
  const isOverLimit = input.length > 10000;

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    const content = output || input;
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.slug}-ai-result.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. AI Options & Model Bar */}
      {customControls && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-xs">
          {customControls}
        </div>
      )}

      {/* 2. Source Text Input Card */}
      <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70 overflow-hidden shadow-xs focus-within:border-brand-500/40 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-150">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-tight">
            <FileText size={14} className="text-brand-600 dark:text-brand-400" />
            Input Draft
          </span>
          <div className="flex items-center gap-2">
            {tool.sampleInput && (
              <button
                type="button"
                onClick={() => onInputChange(tool.sampleInput || "")}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/90 dark:bg-slate-800/70 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
              >
                Load Sample
              </button>
            )}
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                disabled={!input && !output}
                aria-label="Clear input and result"
                className="min-w-10 min-h-10 flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
                title="Clear"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          aria-label="AI text input"
          rows={8}
          className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[180px]"
        />

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span className={isOverLimit ? "text-rose-600 dark:text-rose-400 font-bold" : ""}>
            {input.length.toLocaleString()} / 10,000 max characters
          </span>
          <span className="text-slate-400 dark:text-slate-500">On-demand generation</span>
        </div>
      </div>

      {/* 3. Primary AI Action Trigger Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl border border-violet-500/20 dark:border-violet-500/20 bg-gradient-to-r from-violet-500/5 via-brand-500/5 to-cyan-500/5 dark:from-violet-950/20 dark:via-brand-950/20 dark:to-cyan-950/20 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Sparkles size={15} className="text-violet-500 shrink-0" />
          <span>AI requests are sent through the application&apos;s server-side AI endpoint to the configured AI provider.</span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onRun && (
            <button
              type="button"
              onClick={onRun}
              disabled={isLoading || !input.trim() || isOverLimit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enhancing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>{output ? "Regenerate with AI" : "Process with AI"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 4. AI Result Card */}
      <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 overflow-hidden shadow-xs transition-all duration-150">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-violet-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              AI Generated Result
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!output}
              aria-label="Download AI output"
              className="min-w-10 min-h-10 flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
              title="Download as .txt"
            >
              <Download size={16} />
            </button>
            <CopyButton text={output} />
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
          </div>
        ) : (
          <textarea
            readOnly
            value={output}
            placeholder="AI result will appear here after clicking 'Process with AI'..."
            aria-label="AI result output"
            rows={8}
            className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[180px] cursor-default"
          />
        )}

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{output ? `${output.length.toLocaleString()} characters generated` : "Awaiting execution"}</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400">Server AI Endpoint</span>
        </div>
      </div>
    </div>
  );
};
