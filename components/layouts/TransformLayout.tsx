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
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
            <span>Options & Mode</span>
          </div>
          {customControls}
        </div>
      )}

      {/* Editor Grid: Input ➔ Live Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input Panel */}
        <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileText size={14} className="text-slate-400" />
              Source Input
            </span>
            <div className="flex items-center gap-1.5">
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
                  aria-label="Clear input and output"
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
            rows={11}
            className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
          />

          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-[11px] text-slate-500 dark:text-slate-400 font-mono flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span>{stats.words.toLocaleString()} words</span>
              <span>•</span>
              <span>{stats.chars.toLocaleString()} chars</span>
              <span>•</span>
              <span>{stats.lines.toLocaleString()} lines</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock size={12} />
              <span>{stats.readingTimeSec}s read</span>
            </div>
          </div>
        </div>

        {/* Live Output Panel */}
        <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Live Result
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              {canSwap && onSwap && (
                <button
                  type="button"
                  onClick={onSwap}
                  disabled={!output}
                  aria-label="Swap result to input"
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                  title="Swap output to input"
                >
                  <ArrowLeftRight size={14} />
                </button>
              )}
              {canDownload && (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!output && !input}
                  aria-label="Download result as text file"
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                  title="Download as .txt"
                >
                  <Download size={14} />
                </button>
              )}
              <CopyButton text={output} />
            </div>
          </div>

          <textarea
            readOnly
            value={output}
            placeholder={outputPlaceholder}
            aria-label="Transformed result output"
            rows={11}
            className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
          />

          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{output ? `${output.length} characters generated` : "Instant live conversion"}</span>
            <span className="text-slate-400 dark:text-slate-500">Read-only</span>
          </div>
        </div>
      </div>
    </div>
  );
};
