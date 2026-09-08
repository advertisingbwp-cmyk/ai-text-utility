"use client";

import React from "react";
import { Sparkles, Trash2, Layers } from "lucide-react";
import { WorkspaceProps } from "./types";

export const GalleryLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  onInputChange,
  onClear,
  customControls,
  customPreview,
  customWorkspace,
  inputPlaceholder = "Type or paste text to stylize across font gallery...",
}) => {
  // If full custom gallery workspace is provided (as Fancy Fonts currently has)
  if (customWorkspace) {
    return <div className="space-y-6">{customWorkspace}</div>;
  }

  return (
    <div className="space-y-6">
      {/* 1. Full-Width Top Input Box */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/60 overflow-hidden shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
              Source Text to Stylize
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live preview enabled
            </span>
          </div>

          <div className="flex items-center gap-2">
            {tool.sampleInput && (
              <button
                type="button"
                onClick={() => onInputChange(tool.sampleInput || "Stylish Text 2026")}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Load Sample
              </button>
            )}
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                disabled={!input}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-200 dark:border-slate-700/80 disabled:opacity-40 rounded-xl transition-all shadow-xs cursor-pointer"
                title="Clear text"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="p-4 bg-white/50 dark:bg-slate-950/20">
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            rows={3}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-sans text-base sm:text-lg resize-y focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{input.length} characters in input</span>
          <span className="text-slate-400">Instant client-side font transformation</span>
        </div>
      </div>

      {/* 2. Gallery Filter & Search Controls */}
      {customControls && (
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle">
          {customControls}
        </div>
      )}

      {/* 3. Style Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Layers size={14} className="text-brand-600 dark:text-brand-400" />
          <span>Style Variations Gallery</span>
        </div>

        {customPreview ? (
          customPreview
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            Type text above to preview font styles.
          </div>
        )}
      </div>
    </div>
  );
};
