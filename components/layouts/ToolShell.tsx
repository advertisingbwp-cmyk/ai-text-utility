"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, X, AlertCircle } from "lucide-react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { DynamicIcon } from "@/components/DynamicIcon";
import { FavoriteStar } from "@/components/FavoriteStar";
import { addRecentTool } from "@/lib/storage";
import { getToolTheme } from "@/lib/toolThemes";
import { getToolSeoBlueprint } from "@/data/seoBlueprint";

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
  const blueprint = getToolSeoBlueprint(tool.slug);

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
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium"
          >
            <ArrowLeft size={13} />
            <span>All Tools</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <Link
            href={`/#category-${tool.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            {tool.category}
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-none">
            {tool.name}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowShortcutsHelp(true)}
          aria-label="View keyboard shortcuts"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Keyboard shortcuts"
        >
          <HelpCircle size={14} />
          <span className="hidden sm:inline font-medium">Shortcuts</span>
        </button>
      </nav>

      {/* Tool Header Card - Modern Aurora Glass */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 p-6 shadow-xs backdrop-blur-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border ${theme.bg} ${theme.border} shadow-xs transition-transform`}
              aria-hidden="true"
            >
              <DynamicIcon name={tool.icon} size={24} className={theme.text} />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {blueprint?.h1 || tool.name}
                </h1>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
                >
                  {tool.category}
                </span>
                {tool.supportsLiveMode && (
                  <span
                    title="Updates automatically as you type"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
                    <span>Live</span>
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {blueprint?.aboveTheFoldIntro || tool.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <FavoriteStar
              toolId={tool.id}
              toolName={tool.name}
              size={20}
              className="p-2.5 border border-slate-200/90 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
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
            className="w-full max-w-md rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 shadow-2xl text-slate-900 dark:text-slate-100 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle size={18} className="text-brand-600 dark:text-brand-400" />
                <span>Keyboard Shortcuts</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowShortcutsHelp(false)}
                aria-label="Close keyboard shortcuts dialog"
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Run Active Tool</span>
                <kbd className="font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold shadow-2xs">
                  Ctrl + Enter
                </kbd>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Clear Input &amp; Output</span>
                <kbd className="font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold shadow-2xs">
                  Ctrl + Shift + X
                </kbd>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Open Command Palette</span>
                <kbd className="font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold shadow-2xs">
                  Ctrl + K
                </kbd>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Show / Hide Shortcuts</span>
                <kbd className="font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold shadow-2xs">
                  Ctrl + /
                </kbd>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                type="button"
                onClick={() => setShowShortcutsHelp(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-brand-600 dark:hover:bg-brand-500 text-xs font-semibold shadow-xs transition-colors cursor-pointer active:scale-[0.98]"
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
