"use client";

import React, { useMemo } from "react";
import {
  FileText,
  Trash2,
  ArrowLeftRight,
  Download,
  Clock,
  Sparkles,
} from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { WorkspaceProps } from "./types";

export const TransformLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  output,
  onInputChange,
  onClear,
  onSwap,
  onDownload,
  downloadTitle = "Download as .txt",
  customControls,
  inputPlaceholder = "Enter or paste your text here...",
  outputPlaceholder = "Transformed text will appear here automatically...",
  canSwap = true,
  canDownload = true,
}) => {
  // Live input stats
  const stats = useMemo(() => {
    const chars = input.length;
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = input ? input.split("\n").length : 0;
    const readingTimeSec = Math.ceil((words / 200) * 60);
    return { chars, words, lines, readingTimeSec };
  }, [input]);

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
    <div className="space-y-5">
      {/* Contextual Controls Bar (e.g. Case buttons, Sort options, etc.) */}
      {customControls && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
            <span>Options &amp; Mode</span>
          </div>
          {customControls}
        </div>
      )}

      {/* Editor Grid: Input ➔ Live Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input Panel - Distinct Editable Feel */}
        <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70 overflow-hidden shadow-xs focus-within:border-brand-500/40 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-tight">
              <FileText size={14} className="text-brand-600 dark:text-brand-400" />
              Source Input
            </span>
            <div className="flex items-center gap-1.5">
              {tool.sampleInput && (
                <button
                  type="button"
                  onClick={() => onInputChange(tool.sampleInput || "")}
                  className="btn-secondary h-8 px-3 text-xs font-semibold cursor-pointer active:scale-[0.98] inline-flex items-center"
                >
                  Load Sample
                </button>
              )}
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  disabled={!input && !output}
                  aria-label="Clear input and output"
                  className="btn-icon text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 cursor-pointer active:scale-[0.96]"
                  title="Clear (Ctrl+Shift+X)"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          <textarea
            id="source-text-input"
            name="sourceTextInput"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            aria-label="Source text input"
            rows={12}
            className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[220px]"
          />

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-[11px] text-slate-500 dark:text-slate-400 font-mono flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span>{stats.words.toLocaleString()} words</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>{stats.chars.toLocaleString()} chars</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>{stats.lines.toLocaleString()} lines</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
              <Clock size={12} />
              <span>{stats.readingTimeSec}s read</span>
            </div>
          </div>
        </div>

        {/* Live Output Panel - Distinct Read-Only Feel */}
        <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 overflow-hidden shadow-xs transition-all duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                Live Result
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Result updates automatically" />
            </div>
            <div className="flex items-center gap-1.5">
              {canSwap && onSwap && (
                <button
                  type="button"
                  onClick={onSwap}
                  disabled={!output}
                  aria-label="Swap result to input"
                  className="btn-icon text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30 cursor-pointer group active:scale-[0.96]"
                  title="Swap output to input"
                >
                  <ArrowLeftRight size={15} className="transition-transform duration-200 group-hover:rotate-180" />
                </button>
              )}
              {canDownload && (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!output && !input}
                  aria-label="Download result as text file"
                  className="btn-icon text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30 cursor-pointer active:scale-[0.96]"
                  title={downloadTitle}
                >
                  <Download size={15} />
                </button>
              )}
              <CopyButton text={output} />
            </div>
          </div>

          <textarea
            id="transformed-result-output"
            name="transformedResultOutput"
            readOnly
            value={output}
            placeholder={outputPlaceholder}
            aria-label="Transformed result output"
            rows={12}
            className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[220px] cursor-default"
          />

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{output ? `${output.length.toLocaleString()} characters generated` : "Instant browser conversion"}</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold bg-slate-200/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">Read-only</span>
          </div>
        </div>
      </div>
    </div>
  );
};
