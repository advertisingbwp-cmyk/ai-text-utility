"use client";

import React, { useMemo } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  Download,
  Trash2,
  FileCode,
  Sparkles,
} from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { WorkspaceProps } from "./types";

export const TwoWayLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  output,
  onInputChange,
  onClear,
  onSwap,
  onDownload,
  customControls,
  inputPlaceholder = "Enter text to encode or decode...",
  outputPlaceholder = "Converted result will appear automatically...",
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
    <div className="space-y-6">
      {/* 1. Bidirectional Direction Selector & Options */}
      <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={16} className="text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Bidirectional Workflow
          </span>
        </div>

        {customControls && (
          <div className="flex-1 flex items-center justify-start md:justify-end gap-3 flex-wrap">
            {customControls}
          </div>
        )}
      </div>

      {/* 2. Side-by-Side Synced Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative">
        {/* Source Workspace */}
        <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileCode size={14} className="text-slate-400" />
              Source Input
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
                  disabled={!input && !output}
                  aria-label="Clear input and result"
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                  title="Clear (Ctrl+Shift+X)"
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
            aria-label="Source text input"
            rows={12}
            className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
          />

          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{input.length.toLocaleString()} characters</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Input Ready</span>
          </div>
        </div>

        {/* Target Converted Workspace */}
        <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Converted Output
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-center gap-1.5">
              {onSwap && (
                <button
                  type="button"
                  onClick={onSwap}
                  disabled={!output}
                  aria-label="Swap converted output to input"
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                  title="Swap output to input"
                >
                  <ArrowLeftRight size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={handleDownload}
                disabled={!output && !input}
                aria-label="Download converted output"
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                title="Download as .txt"
              >
                <Download size={14} />
              </button>
              <CopyButton text={output} />
            </div>
          </div>

          <textarea
            readOnly
            value={output}
            placeholder={outputPlaceholder}
            aria-label="Converted output"
            rows={12}
            className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
          />

          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{output ? `${output.length} characters` : "Auto converted"}</span>
            <span className="text-slate-400">Read-only</span>
          </div>
        </div>
      </div>
    </div>
  );
};
