"use client";

import React from "react";
import {
  Sparkles,
  RefreshCw,
  FileText,
  Trash2,
  Copy,
  Download,
  AlertTriangle,
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
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs">
          {customControls}
        </div>
      )}

      {/* 2. Source Text Input Card */}
      <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileText size={14} className="text-slate-400" />
            Input Draft
          </span>
          <div className="flex items-center gap-2">
            {tool.sampleInput && (
              <button
                type="button"
                onClick={() => onInputChange(tool.sampleInput || "")}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                title="Clear"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          aria-label="AI text input"
          rows={7}
          className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
        />

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span className={isOverLimit ? "text-rose-600 dark:text-rose-400 font-bold" : ""}>
            {input.length.toLocaleString()} / 10,000 max characters
          </span>
          <span className="text-slate-400">Strictly on-demand execution</span>
        </div>
      </div>

      {/* 3. Primary AI Action Trigger Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 shadow-subtle">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Sparkles size={14} className="text-blue-500 shrink-0" />
          <span>Powered by Google Gemini 2.5 Flash</span>
        </div>

        <div className="flex items-center gap-2.5">
          {onRun && (
            <button
              type="button"
              onClick={onRun}
              disabled={isLoading || !input.trim() || isOverLimit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md bg-brand-600 hover:bg-brand-500 shadow-brand-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
      <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              AI Generated Result
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!output}
              aria-label="Download AI output"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
              title="Download as .txt"
            >
              <Download size={14} />
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
            rows={7}
            className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
          />
        )}

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{output ? `${output.length.toLocaleString()} characters generated` : "Awaiting execution"}</span>
          <span className="text-slate-400">Direct Gemini Response</span>
        </div>
      </div>
    </div>
  );
};
