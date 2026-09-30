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

  const validStatus = React.useMemo(() => {
    if (tool.slug === "json-formatter") {
      return {
        title: "Valid JSON",
        description: "Valid syntax parsed and formatted cleanly",
        badge: "Valid JSON",
      };
    }
    if (tool.slug === "jwt-decoder") {
      return {
        title: "Decoded Successfully",
        description: "Payload and header claims decoded cleanly (signature unverified)",
        badge: "Decoded",
      };
    }
    return {
      title: "Parsed Successfully",
      description: "Parsed and formatted cleanly",
      badge: "Parsed",
    };
  }, [tool.slug]);

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
          className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all ${
            error
              ? "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
              : isValid
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400"
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
                {error ? "Validation Error" : isValid ? validStatus.title : "Awaiting Validation"}
              </div>
              <div className="text-xs mt-0.5 font-mono">
                {error || (isValid ? validStatus.description : "Type or paste to inspect")}
              </div>
            </div>
          </div>

          {isValid && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
              {validStatus.badge}
            </span>
          )}
        </div>
      )}

      {/* Optional Formatting / Inspection Options Bar */}
      {customControls && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-xs flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
            <span>Inspection &amp; Formatting Settings</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">{customControls}</div>
        </div>
      )}

      {/* 2. Dual Workspace or Structured Preview */}
      {customPreview ? (
        <div className="space-y-5">
          {/* Top Token/Code Input */}
          <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70 overflow-hidden shadow-xs focus-within:border-brand-500/40 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-tight">
                <FileCode size={14} className="text-brand-600 dark:text-brand-400" />
                Raw Input Token / Code
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
                    aria-label="Clear input"
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
              aria-label="Raw validation input"
              rows={4}
              className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[120px]"
            />
          </div>

          {/* Structured Inspection View */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 p-5 sm:p-6 shadow-xs transition-all">
            {customPreview}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Source Input */}
          <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70 overflow-hidden shadow-xs focus-within:border-brand-500/40 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-tight">
                <FileCode size={14} className="text-brand-600 dark:text-brand-400" />
                Raw Input
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
                    aria-label="Clear input"
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
              aria-label="Raw text to format and validate"
              rows={14}
              className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[260px]"
            />

            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>{input.length.toLocaleString()} characters</span>
              <span className="text-slate-400 dark:text-slate-500">In-Browser Parser</span>
            </div>
          </div>

          {/* Formatted Output */}
          <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 overflow-hidden shadow-xs transition-all duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                Validated &amp; Formatted Result
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!output}
                  aria-label="Download validated output"
                  className="min-w-10 min-h-10 flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
                  title="Download as .txt"
                >
                  <Download size={16} />
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
              className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-sm sm:text-base resize-y focus:outline-none leading-relaxed min-h-[260px] cursor-default"
            />

            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>{output ? `${output.length.toLocaleString()} characters formatted` : "Awaiting input"}</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold bg-slate-200/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">Read-only</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
