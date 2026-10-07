"use client";

import React from "react";
import { Sparkles, RefreshCw, Download, Sliders } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { WorkspaceProps } from "./types";

export const GeneratorLayout: React.FC<WorkspaceProps> = ({
  tool,
  output,
  onRun,
  onDownload,
  isLoading = false,
  customControls,
  customPreview,
  outputPlaceholder = "Generated output will appear here...",
}) => {
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = tool.slug === "password-generator" ? "generated-passwords.txt" : `${tool.slug}-result.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Options & Configuration Card */}
      {customControls && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
            <Sliders size={14} className="text-brand-600 dark:text-brand-400" />
            <span>Generation Parameters</span>
          </div>
          {customControls}
        </div>
      )}

      {/* 2. Primary Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Generated in browser according to selected parameters
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onRun && (
            <button
              type="button"
              onClick={onRun}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md bg-brand-600 hover:bg-brand-500 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              <span>Generate New</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Prominent Generated Result Display */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 overflow-hidden shadow-xs transition-all duration-150">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              Generated Value
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!output}
              aria-label="Download generated output"
              className="min-w-10 min-h-10 flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
              title="Download as .txt"
            >
              <Download size={16} />
            </button>
            <CopyButton text={output} />
          </div>
        </div>

        {/* Specialized Visual Preview or Fallback Textarea */}
        {customPreview ? (
          <div className="p-5">{customPreview}</div>
        ) : (
          <div className="p-4 sm:p-5">
            <textarea
              readOnly
              value={output}
              placeholder={outputPlaceholder}
              aria-label="Generated output text"
              rows={8}
              className="w-full p-4 bg-white/70 dark:bg-slate-900/50 rounded-xl border border-slate-200/70 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[160px] cursor-default"
            />
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{output ? `${output.length.toLocaleString()} characters generated` : "Ready to generate"}</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold bg-slate-200/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">Generated result</span>
        </div>
      </div>
    </div>
  );
};
