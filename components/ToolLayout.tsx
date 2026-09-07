"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Play,
  Trash2,
  ArrowLeftRight,
  Download,
  AlertCircle,
  HelpCircle,
  X,
  FileText,
  Clock,
} from "lucide-react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { DynamicIcon } from "@/components/DynamicIcon";
import { FavoriteStar } from "@/components/FavoriteStar";
import { CopyButton } from "@/components/CopyButton";
import { addRecentTool } from "@/lib/storage";

export interface ToolLayoutProps {
  tool: ToolDefinition;
  input: string;
  output: string;
  onInputChange: (val: string) => void;
  onRun?: () => void;
  onClear?: () => void;
  onSwap?: () => void;
  onDownload?: () => void;
  isLoading?: boolean;
  error?: string | null;
  canSwap?: boolean;
  canDownload?: boolean;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  customControls?: React.ReactNode;
  customPreview?: React.ReactNode;
  customWorkspace?: React.ReactNode;
  hideDefaultInput?: boolean;
  hideDefaultOutput?: boolean;
  hideActionBar?: boolean;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  input,
  output,
  onInputChange,
  onRun,
  onClear,
  onSwap,
  onDownload,
  isLoading = false,
  error = null,
  canSwap = true,
  canDownload = true,
  inputPlaceholder = "Enter or paste your text here...",
  outputPlaceholder = "Output will appear here automatically or after clicking Run...",
  customControls,
  customPreview,
  customWorkspace,
  hideDefaultInput = false,
  hideDefaultOutput = false,
  hideActionBar = false,
}) => {
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Track as recently used in localStorage
  useEffect(() => {
    addRecentTool(tool.id);
  }, [tool.id]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+/ = Help
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcutsHelp((prev) => !prev);
        return;
      }

      // Ctrl+Enter = Run
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (onRun) {
          e.preventDefault();
          onRun();
        }
        return;
      }

      // Ctrl+Shift+X = Clear
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "X" || e.key === "x")) {
        if (onClear) {
          e.preventDefault();
          onClear();
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRun, onClear]);

  // Calculate live input statistics
  const stats = useMemo(() => {
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, "").length;
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = input ? input.split("\n").length : 0;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const readingTimeSec = Math.ceil((words / 200) * 60);

    return { chars, charsNoSpaces, words, lines, sentences, readingTimeSec };
  }, [input]);

  // Default download handler
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

  const isAI = tool.category === "AI Magic";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Breadcrumb & Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            All Tools
          </Link>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <Link
            href={`/#category-${tool.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            {tool.category}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-slate-200 font-semibold">{tool.name}</span>
        </div>

        <button
          type="button"
          onClick={() => setShowShortcutsHelp(true)}
          aria-label="View keyboard shortcuts"
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Keyboard shortcuts"
        >
          <HelpCircle size={14} />
          <span className="hidden sm:inline">Shortcuts</span>
        </button>
      </nav>

      {/* Tool Header Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/50 p-6 shadow-subtle backdrop-blur-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                isAI
                  ? "bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200/80 dark:border-brand-800/60"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60"
              }`}
            >
              <DynamicIcon name={tool.icon} size={24} />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {tool.name}
                </h1>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isAI
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/60"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {tool.category}
                </span>
                {tool.supportsLiveMode && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Live Auto-Run
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <FavoriteStar toolId={tool.id} showLabel size={18} />
          </div>
        </div>

        {/* Custom Controls Slot */}
        {customControls && (
          <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
            {customControls}
          </div>
        )}
      </div>

      {/* Error Alert State */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in"
        >
          <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Error: </span>
            {error}
          </div>
        </div>
      )}

      {/* Main Workspace Panels */}
      {customWorkspace ? (
        customWorkspace
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Input Panel */}
          {!hideDefaultInput && (
            <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" />
                  Input Text
                </span>
                <div className="flex items-center gap-1.5">
                  {tool.sampleInput && (
                    <button
                      type="button"
                      onClick={() => onInputChange(tool.sampleInput || "")}
                      className="px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
                    >
                      Load Sample
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClear}
                    disabled={!input && !output}
                    aria-label="Clear input and output"
                    className="px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 rounded-md transition-colors"
                    title="Clear (Ctrl+Shift+X)"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <textarea
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={inputPlaceholder}
                aria-label="Text input"
                rows={12}
                className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
              />

              {/* Input Live Stats Bar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-[11px] text-slate-500 dark:text-slate-400 font-mono flex-wrap gap-2">
                <div className="flex items-center gap-3">
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
          )}

          {/* Output Panel / Preview */}
          {!hideDefaultOutput && (
            <div className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-subtle">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Output Result
                </span>
                <div className="flex items-center gap-1.5">
                  {canSwap && onSwap && (
                    <button
                      type="button"
                      onClick={onSwap}
                      disabled={!output}
                      aria-label="Swap output to input"
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-md transition-colors"
                      title="Swap Output to Input"
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
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-md transition-colors"
                      title="Download output as .txt"
                    >
                      <Download size={14} />
                    </button>
                  )}
                  <CopyButton text={output} />
                </div>
              </div>

              {customPreview ? (
                <div className="p-4 flex-1 overflow-auto">{customPreview}</div>
              ) : (
                <textarea
                  readOnly
                  value={output}
                  placeholder={outputPlaceholder}
                  aria-label="Text output"
                  rows={12}
                  className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs sm:text-sm resize-y focus:outline-none leading-relaxed"
                />
              )}

              <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span>{output ? `${output.length} characters generated` : "Waiting for input"}</span>
                <span className="text-[10px] text-slate-400">Read-only</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Action Bar */}
      {!hideActionBar && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 shadow-subtle">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Press{" "}
            <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Ctrl+Enter
            </kbd>{" "}
            to run
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
              >
                Clear
              </button>
            )}

            {onRun && (
              <button
                type="button"
                onClick={onRun}
                disabled={isLoading || !input}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md bg-brand-600 hover:bg-brand-500 shadow-brand-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {isAI ? <Sparkles size={14} /> : <Play size={14} />}
                    <span>{isAI ? "Generate with AI" : "Process Text"}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Shortcuts Modal */}
      {showShortcutsHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowShortcutsHelp(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle size={18} className="text-brand-600 dark:text-brand-400" />
                Keyboard Shortcuts
              </h3>
              <button
                type="button"
                onClick={() => setShowShortcutsHelp(false)}
                aria-label="Close keyboard shortcuts dialog"
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-600 dark:text-slate-300">Run Active Tool</span>
                <kbd className="font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                  Ctrl + Enter
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-600 dark:text-slate-300">Clear Input & Output</span>
                <kbd className="font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                  Ctrl + Shift + X
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-600 dark:text-slate-300">Open Command Palette</span>
                <kbd className="font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                  Ctrl + K
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-600 dark:text-slate-300">Show / Hide Shortcuts</span>
                <kbd className="font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                  Ctrl + /
                </kbd>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 text-right">
              <button
                type="button"
                onClick={() => setShowShortcutsHelp(false)}
                className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-xs"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
