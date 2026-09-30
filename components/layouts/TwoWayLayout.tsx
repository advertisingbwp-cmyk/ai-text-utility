"use client";

import React from "react";
import {
  ArrowLeftRight,
  Download,
  Trash2,
  FileCode,
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
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
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
        {/* Source Workspace - Editable Surface */}
        <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70 overflow-hidden shadow-xs focus-within:border-brand-500/40 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-tight">
              <FileCode size={14} className="text-brand-600 dark:text-brand-400" />
              Source Input
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
                  disabled={!input && !output}
                  aria-label="Clear input and result"
                  className="min-w-10 min-h-10 flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
                  title="Clear (Ctrl+Shift+X)"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          <textarea
            id="two-way-source-input"
            name="sourceInput"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            aria-label="Source text input"
            rows={12}
            className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[220px]"
          />

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{input.length.toLocaleString()} characters</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Input Ready</span>
          </div>
        </div>

        {/* Target Converted Workspace - Read-Only Surface */}
        <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 overflow-hidden shadow-xs transition-all duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                Converted Output
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Auto converted" />
            </div>

            <div className="flex items-center gap-1.5">
              {onSwap && (
                <button
                  type="button"
                  onClick={onSwap}
                  disabled={!output}
                  aria-label="Swap converted output to input"
                  className="min-w-10 min-h-10 flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 disabled:opacity-30 rounded-xl transition-all cursor-pointer group active:scale-[0.96]"
                  title="Swap output to input"
                >
                  <ArrowLeftRight size={16} className="transition-transform duration-200 group-hover:rotate-180" />
                </button>
              )}
              <button
                type="button"
                onClick={handleDownload}
                disabled={!output && !input}
                aria-label="Download converted output"
                className="min-w-10 min-h-10 flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
                title="Download as .txt"
              >
                <Download size={16} />
              </button>
              <CopyButton text={output} />
            </div>
          </div>

          <textarea
            id="two-way-converted-output"
            name="convertedOutput"
            readOnly
            value={output}
            placeholder={outputPlaceholder}
            aria-label="Converted output"
            rows={12}
            className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[220px] cursor-default"
          />

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{output ? `${output.length.toLocaleString()} characters` : "Auto converted"}</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold bg-slate-200/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">Read-only</span>
          </div>
        </div>
      </div>
    </div>
  );
};
