"use client";

import React from "react";
import { Sparkles, RefreshCw, Download, Copy, Sliders } from "lucide-react";
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
    a.download = `${tool.slug}-result.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Options & Configuration Card */}
      {customControls && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-5 shadow-subtle backdrop-blur-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
            <Sliders size={15} className="text-brand-600 dark:text-brand-400" />
            <span>Generation Parameters</span>
          </div>
          {customControls}
        </div>
      )}

      {/* 2. Primary Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 shadow-subtle">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Client-side cryptographically secure generation
        </div>

        <div className="flex items-center gap-2.5">
          {onRun && (
            <button
              type="button"
              onClick={onRun}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md bg-brand-600 hover:bg-brand-500 shadow-brand-600/20 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              <span>Generate New</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Prominent Generated Result Display */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Generated Value
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!output}
              aria-label="Download generated output"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
              title="Download as .txt"
            >
              <Download size={14} />
            </button>
            <CopyButton text={output} />
          </div>
        </div>

        {/* If specialized visual preview is provided (e.g. Password cards with strength meter) */}
        {customPreview ? (
          <div className="p-5">{customPreview}</div>
        ) : (
          <div className="p-4">
            <textarea
              readOnly
              value={output}
              placeholder={outputPlaceholder}
              aria-label="Generated output text"
              rows={8}
              className="w-full p-3 bg-slate-50/60 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-sm resize-y focus:outline-none leading-relaxed"
            />
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{output ? `${output.length} characters generated` : "Ready to generate"}</span>
          <span className="text-slate-400 dark:text-slate-500">100% Private (No server transmission)</span>
        </div>
      </div>
    </div>
  );
};
