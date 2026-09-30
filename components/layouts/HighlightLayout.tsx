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
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            <Search size={14} className="text-brand-600 dark:text-brand-400" />
            <span>Regular Expression Pattern &amp; Flags</span>
          </div>
          {customControls}
        </div>
      )}

      {/* 2. Test String Editor */}
      <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70 overflow-hidden shadow-xs focus-within:border-brand-500/40 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-150">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-tight">
            <FileText size={14} className="text-brand-600 dark:text-brand-400" />
            Test Text String
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
                disabled={!input}
                aria-label="Clear test string"
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
          aria-label="Test text string"
          rows={6}
          className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[140px]"
        />

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{input.length.toLocaleString()} characters in test string</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">In-Browser Regex Engine</span>
        </div>
      </div>

      {/* 3. Live Highlighted Matches & Breakdown */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 overflow-hidden shadow-xs transition-all duration-150">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              Live Highlighted Matches &amp; Capture Groups
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
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <Search size={20} className="text-slate-300 dark:text-slate-600" />
              <span>Enter a pattern and test string above to inspect matches.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
