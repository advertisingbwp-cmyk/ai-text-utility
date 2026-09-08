"use client";

import React from "react";
import { Clock, Calendar, Download, Trash2, ArrowRight } from "lucide-react";
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
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs">
          {customControls}
        </div>
      )}

      {/* 2. Compact Primary Converter Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-5 shadow-subtle backdrop-blur-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Input Parameter
            </span>
          </div>

          <div className="flex items-center gap-2">
            {tool.sampleInput && (
              <button
                type="button"
                onClick={() => onInputChange(tool.sampleInput || "")}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                title="Clear"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Input Field (Clean single-line or small text input instead of giant 12-row box) */}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            className="w-full px-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* 3. Breakdown & Calculation Results */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Live Interval & Calculation Breakdown
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!output}
              aria-label="Download calculation report"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
              title="Download report"
            >
              <Download size={14} />
            </button>
            <CopyButton text={output} />
          </div>
        </div>

        <div className="p-5">
          {customPreview ? (
            customPreview
          ) : (
            <div className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
              {output || "Awaiting input..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
