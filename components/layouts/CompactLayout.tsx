"use client";

import React from "react";
import { Clock, Calendar, Download, Trash2 } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { WorkspaceProps } from "./types";

export const CompactLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  output,
  onInputChange,
  onClear,
  onDownload,
  customControls,
  customPreview,
  inputPlaceholder = "Enter value...",
}) => {
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
    a.download = `${tool.slug}-result.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Compact Controls Toolbar */}
      {customControls && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-xs">
          {customControls}
        </div>
      )}

      {/* 2. Compact Primary Converter Card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70 p-5 shadow-xs focus-within:border-brand-500/40 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Input Parameter
            </span>
          </div>

          <div className="flex items-center gap-2">
            {tool.sampleInput && (
              <button
                type="button"
                onClick={() => onInputChange(tool.sampleInput || "")}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/90 dark:bg-slate-800/70 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
              >
                Load Preset
              </button>
            )}
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                disabled={!input}
                aria-label="Clear input value"
                className="min-w-10 min-h-10 flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
                title="Clear"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Input Field */}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            className="w-full px-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 rounded-xl border border-slate-200/70 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* 3. Breakdown & Calculation Results */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 overflow-hidden shadow-xs transition-all duration-150">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              Live Interval &amp; Calculation Breakdown
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!output}
              aria-label="Download calculation report"
              className="min-w-10 min-h-10 flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
              title="Download report"
            >
              <Download size={16} />
            </button>
            <CopyButton text={output} />
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {customPreview ? (
            customPreview
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Result will compute automatically..."
              aria-label="Calculation output"
              rows={6}
              className="w-full p-4 bg-white/70 dark:bg-slate-900/50 rounded-xl border border-slate-200/70 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[140px] cursor-default"
            />
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{output ? `${output.length.toLocaleString()} characters in output` : "Ready to calculate"}</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold bg-slate-200/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">Calculation Result</span>
        </div>
      </div>
    </div>
  );
};
