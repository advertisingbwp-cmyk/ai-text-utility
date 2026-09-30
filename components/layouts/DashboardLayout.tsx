"use client";

import React from "react";
import {
  FileText,
  Trash2,
  LayoutDashboard,
} from "lucide-react";
import { WorkspaceProps } from "./types";

export const DashboardLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  onInputChange,
  onClear,
  customControls,
  customPreview,
  inputPlaceholder = "Type or paste your text to analyze...",
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Large Primary Input / Editor */}
      <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70 overflow-hidden shadow-xs focus-within:border-brand-500/40 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-150">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-tight">
            <FileText size={14} className="text-brand-600 dark:text-brand-400" />
            Active Text Editor
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
                aria-label="Clear editor text"
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
                title="Clear text"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          aria-label="Dashboard text input"
          rows={tool.slug === "hash-generator" ? 4 : 8}
          className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed min-h-[160px]"
        />

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <span>{input.length.toLocaleString()} characters in memory</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live Metrics Sync
          </span>
        </div>
      </div>

      {/* Optional Options / Controls */}
      {customControls && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-xs">
          {customControls}
        </div>
      )}

      {/* 2. Live Metrics & Cards Dashboard Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            <LayoutDashboard size={14} className="text-brand-600 dark:text-brand-400" />
            <span>Live Analysis Dashboard</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time breakdown</span>
        </div>

        {customPreview ? (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 p-5 sm:p-6 shadow-xs transition-all">
            {customPreview}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
            <LayoutDashboard size={20} className="text-slate-300 dark:text-slate-600" />
            <span>Start typing in the editor above to calculate and populate metrics.</span>
          </div>
        )}
      </div>
    </div>
  );
};
