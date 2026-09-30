"use client";

import React from "react";
import { Sparkles, Layers } from "lucide-react";
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
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70 overflow-hidden shadow-xs focus-within:border-brand-500/40 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-150">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-tight">
              <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
              Source Text to Stylize
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
              Live preview enabled
            </span>
          </div>

          <div className="flex items-center gap-2">
            {tool.sampleInput && (
              <button
                type="button"
                onClick={() => onInputChange(tool.sampleInput || "Stylish Text 2026")}
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
                aria-label="Clear text"
                className="min-h-10 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 border border-slate-200/80 dark:border-slate-700/80 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
                title="Clear text"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-transparent">
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            rows={3}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-sans text-base sm:text-lg resize-y focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{input.length.toLocaleString()} characters in input</span>
          <span className="text-slate-400 dark:text-slate-500">In-browser Unicode font generation</span>
        </div>
      </div>

      {/* 2. Gallery Filter & Search Controls */}
      {customControls && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-xs">
          {customControls}
        </div>
      )}

      {/* 3. Style Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          <Layers size={14} className="text-brand-600 dark:text-brand-400" />
          <span>Style Variations Gallery</span>
        </div>

        {customPreview ? (
          customPreview
        ) : (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
            <Layers size={20} className="text-slate-300 dark:text-slate-600" />
            <span>Type text above to preview font styles.</span>
          </div>
        )}
      </div>
    </div>
  );
};
