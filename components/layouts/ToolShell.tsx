"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, X, AlertCircle } from "lucide-react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { FavoriteStar } from "@/components/FavoriteStar";
import { addRecentTool } from "@/lib/storage";
import { getToolTheme } from "@/lib/toolThemes";

export interface ToolShellProps {
  tool: ToolDefinition;
  error?: string | null;
  onClear?: () => void;
  onRun?: () => void;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
}

export const ToolShell: React.FC<ToolShellProps> = ({
  tool,
  error,
  onClear,
  onRun,
  headerExtra,
  children,
}) => {
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const theme = getToolTheme(tool.id, tool.category);

  // Track as recently used in localStorage
  useEffect(() => {
    addRecentTool(tool.id);
  }, [tool.id]);

  // Global Keyboard Shortcuts
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
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
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
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs border ${theme.bg} ${theme.border}`}
            >
              <span className="text-2xl select-none" role="img" aria-hidden="true">
                {theme.emoji}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {tool.name}
                </h1>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
                >
                  {tool.category}
                </span>
                {tool.supportsLiveMode && (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
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
            <FavoriteStar
              toolId={tool.id}
              toolName={tool.name}
              size={20}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            />
          </div>
        </div>

        {/* Header Extra Controls */}
        {headerExtra && (
          <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
            {headerExtra}
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

      {/* Main Workspace */}
      {children}

      {/* Keyboard Shortcuts Modal */}
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
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
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
                className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
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
