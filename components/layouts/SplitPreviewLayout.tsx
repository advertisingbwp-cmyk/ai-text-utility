"use client";

import React, { useState } from "react";
import {
  FileText,
  Eye,
  Code,
  Download,
  Trash2,
} from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { WorkspaceProps } from "./types";

export const SplitPreviewLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  output,
  onInputChange,
  onClear,
  onDownload,
  customPreview,
  inputPlaceholder = "Type or paste Markdown here...",
}) => {
  const [viewMode, setViewMode] = useState<"rendered" | "source">("rendered");

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    const content = output || input;
    if (!content) return;
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.slug}-output.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Left Column: Markdown Source Editor */}
        <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70 overflow-hidden shadow-xs focus-within:border-brand-500/40 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-tight">
              <FileText size={14} className="text-brand-600 dark:text-brand-400" />
              Markdown Editor
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
                  aria-label="Clear Markdown input"
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
                  title="Clear"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          <textarea
            id="split-preview-input"
            name="markdownInput"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            aria-label="Markdown text input"
            rows={16}
            className="w-full flex-1 p-4 sm:p-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/90 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed min-h-[260px]"
          />

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{input.length.toLocaleString()} chars</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Live compilation</span>
          </div>
        </div>

        {/* Right Column: Live Rendered Preview / HTML Source */}
        <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 overflow-hidden shadow-xs transition-all duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
            {/* View Mode Switch */}
            <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("rendered")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === "rendered"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Eye size={13} />
                <span>Live Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("source")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === "source"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Code size={13} />
                <span>HTML Code</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!output}
                aria-label="Download HTML file"
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 disabled:opacity-30 rounded-xl transition-all cursor-pointer active:scale-[0.96]"
                title="Download HTML"
              >
                <Download size={14} />
              </button>
              <CopyButton text={output} label="Copy HTML" />
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-5 overflow-auto bg-white/40 dark:bg-slate-950/20 min-h-[260px]">
            {viewMode === "rendered" ? (
              customPreview ? (
                customPreview
              ) : (
                <div
                  className="prose dark:prose-invert max-w-none text-xs sm:text-sm"
                  dangerouslySetInnerHTML={{ __html: output || "<p class='text-slate-400 italic'>Preview will render here live...</p>" }}
                />
              )
            ) : (
              <textarea
                id="split-preview-output"
                name="htmlOutput"
                readOnly
                value={output}
                aria-label="Raw HTML output"
                rows={16}
                className="w-full h-full p-2 bg-transparent text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:outline-none leading-relaxed resize-none cursor-default"
              />
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{output.length.toLocaleString()} chars generated</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Sanitized HTML</span>
          </div>
        </div>
      </div>
    </div>
  );
};
