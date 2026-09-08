"use client";

import React from "react";
import { Search, Sparkles, FileText, Trash2 } from "lucide-react";
import { WorkspaceProps } from "./types";

export const HighlightLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  onInputChange,
  onClear,
  customControls,
  customPreview,
  inputPlaceholder = "Enter test string to evaluate against regex...",
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Regex Pattern & Flags Toolbar */}
      {customControls && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
            <Search size={15} className="text-brand-600 dark:text-brand-400" />
            <span>Regular Expression Pattern & Flags</span>
          </div>
          {customControls}
        </div>
      )}

      {/* 2. Test String Editor */}
      <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileText size={14} className="text-slate-400" />
            Test Text String
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
                aria-label="Clear test string"
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
          aria-label="Test text string"
          rows={5}
          className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
        />
      </div>

      {/* 3. Live Highlighted Matches & Breakdown */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Live Highlighted Matches & Capture Groups
            </span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
            Active Evaluation
          </span>
        </div>

        <div className="p-5">
          {customPreview ? (
            customPreview
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Enter a pattern and test string above to inspect matches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
