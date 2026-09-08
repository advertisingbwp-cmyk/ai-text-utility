"use client";

import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  FileCode,
  Download,
  Trash2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { WorkspaceProps } from "./types";

export const ValidatorLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  output,
  onInputChange,
  onClear,
  onDownload,
  error,
  customControls,
  customPreview,
  inputPlaceholder = "Paste code, schema, or token to validate...",
  outputPlaceholder = "Validated and formatted output will appear here...",
}) => {
  const isValid = !error && output.length > 0;
  const hasInput = input.trim().length > 0;

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
    a.download = `${tool.slug}-validated.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Validation Status Banner */}
      {hasInput && (
        <div
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
            error
              ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300"
              : isValid
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300"
              : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          <div className="flex items-center gap-3">
            {error ? (
              <AlertCircle size={20} className="text-rose-500 shrink-0" />
            ) : isValid ? (
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
            ) : (
              <ShieldCheck size={20} className="text-slate-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                {error ? "Validation Error" : isValid ? "Valid Syntax" : "Awaiting Validation"}
              </div>
              <div className="text-xs mt-0.5 font-mono">
                {error || (isValid ? "100% compliant and parsed cleanly" : "Type or paste to inspect")}
              </div>
            </div>
          </div>

          {isValid && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
              Verified
            </span>
          )}
        </div>
      )}

      {/* Optional Formatting / Inspection Options Bar */}
      {customControls && (
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
            <span>Inspection & Formatting Settings</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">{customControls}</div>
        </div>
      )}

      {/* 2. Dual Workspace or Structured Preview */}
      {customPreview ? (
        <div className="space-y-5">
          {/* Top Token/Code Input */}
          <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileCode size={14} className="text-slate-400" />
                Raw Input Token / Code
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
                    aria-label="Clear input"
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
              aria-label="Raw validation input"
              rows={4}
              className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
            />
          </div>

          {/* Structured Inspection View */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-5 shadow-subtle backdrop-blur-xs">
            {customPreview}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Source Input */}
          <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileCode size={14} className="text-slate-400" />
                Raw Input
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
                    aria-label="Clear input"
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
              aria-label="Raw text to format and validate"
              rows={14}
              className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
            />

            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>{input.length.toLocaleString()} characters</span>
              <span className="text-slate-400">Client-Side Parser</span>
            </div>
          </div>

          {/* Formatted Output */}
          <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Validated & Formatted Result
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!output}
                  aria-label="Download validated output"
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
              aria-label="Validated result"
              rows={14}
              className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
            />

            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>{output ? `${output.length} characters formatted` : "Awaiting input"}</span>
              <span className="text-slate-400">Read-only</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
