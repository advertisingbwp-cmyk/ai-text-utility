"use client";

import React from "react";
import { FileText, Trash2, Table as TableIcon, Download } from "lucide-react";
import { WorkspaceProps } from "./types";

export const TableLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  output,
  onInputChange,
  onClear,
  onDownload,
  customControls,
  customPreview,
  inputPlaceholder = "Enter or paste text to analyze into structured table...",
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
    a.download = `${tool.slug}-data.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Input Panel & Controls */}
      <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle backdrop-blur-xs">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileText size={14} className="text-slate-400" />
            Source Data
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
                disabled={!input}
                aria-label="Clear source data"
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                title="Clear input"
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
          aria-label="Table source text input"
          rows={6}
          className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
        />

        {/* Custom Controls Embedded inside Input footer if available */}
        {customControls && (
          <div className="px-4 py-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
            {customControls}
          </div>
        )}
      </div>

      {/* 2. Structured Table / Card Results */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <TableIcon size={14} className="text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tabular Analysis & Breakdown
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!input}
            aria-label="Download table report"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
            title="Download report"
          >
            <Download size={14} />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-x-auto">
          {customPreview ? (
            customPreview
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Enter content above to generate tabular breakdown.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
