"use client";

import React from "react";
import {
  FileText,
  Trash2,
  LayoutDashboard,
  Clock,
  Sparkles,
  Layers,
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
      <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle backdrop-blur-xs">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileText size={14} className="text-slate-400" />
            Active Text Editor
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
                aria-label="Clear editor text"
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                title="Clear text"
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
          aria-label="Dashboard text input"
          rows={tool.slug === "hash-generator" ? 4 : 8}
          className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
        />

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <span>{input.length.toLocaleString()} characters in memory</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Metrics Sync
          </span>
        </div>
      </div>

      {/* Optional Options / Controls */}
      {customControls && (
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle">
          {customControls}
        </div>
      )}

      {/* 2. Live Metrics & Cards Dashboard Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <LayoutDashboard size={15} className="text-brand-600 dark:text-brand-400" />
            <span>Live Analysis Dashboard</span>
          </div>
          <span className="text-[11px] text-slate-400">Real-time breakdown</span>
        </div>

        {customPreview ? (
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-5 shadow-subtle backdrop-blur-xs">
            {customPreview}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs">
            Start typing above to populate metrics.
          </div>
        )}
      </div>
    </div>
  );
};
