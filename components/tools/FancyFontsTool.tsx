"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolWorkspaceResolver } from "@/components/layouts";
import { CopyButton } from "@/components/CopyButton";
import {
  generateAllFancyFonts,
  FancyFontCategory,
} from "@/lib/tools/fancyFonts";
import { Sparkles } from "lucide-react";

export const FancyFontsTool: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const [input, setInput] = useState<string>(tool.sampleInput || "Hello World");
  const [debouncedInput, setDebouncedInput] = useState<string>(tool.sampleInput || "Hello World");
  const [output, setOutput] = useState<string>("");
  const [fancyCategoryFilter, setFancyCategoryFilter] = useState<FancyFontCategory>("all");
  const [fancySearch, setFancySearch] = useState<string>("");

  useEffect(() => {
    if (input.length > 500) {
      const timer = setTimeout(() => {
        setDebouncedInput(input);
      }, 150);
      return () => clearTimeout(timer);
    }
    setDebouncedInput(input);
  }, [input]);

  const allStyles = useMemo(() => {
    const textToConvert = debouncedInput || "Type something...";
    return generateAllFancyFonts(textToConvert);
  }, [debouncedInput]);

  const categories: { id: FancyFontCategory; label: string }[] = useMemo(
    () => [
      { id: "all", label: `All (${allStyles.length})` },
      { id: "alphabets", label: "🔤 Alphabets" },
      { id: "circled-squared", label: "⭕ Circled & Boxed" },
      { id: "combining-lines", label: "✂️ Lines & Glitch" },
      { id: "brackets-boxes", label: "📦 Brackets" },
      { id: "joiners", label: "🔗 Connectors" },
      { id: "decorations-wings", label: "🌟 Wings & Cute" },
    ],
    [allStyles.length]
  );

  const filteredStyles = useMemo(() => {
    return allStyles.filter((item) => {
      const matchesCategory =
        fancyCategoryFilter === "all" || item.category === fancyCategoryFilter;
      const matchesSearch =
        !fancySearch.trim() ||
        item.name.toLowerCase().includes(fancySearch.toLowerCase()) ||
        item.id.toLowerCase().includes(fancySearch.toLowerCase()) ||
        item.preview.toLowerCase().includes(fancySearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allStyles, fancyCategoryFilter, fancySearch]);

  const fancyFontsWorkspace = (
    <div className="space-y-5">
      {/* Full-Width Top Input Box */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/60 overflow-hidden shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
              Type or paste text to stylize
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live preview enabled • {allStyles.length}+ styles
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInput("Stylish Text 2026")}
              className="inline-flex items-center justify-center min-h-[36px] sm:min-h-[40px] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer"
            >
              Load Sample
            </button>
            <button
              type="button"
              onClick={() => {
                setInput("");
                setOutput("");
              }}
              disabled={!input}
              className="inline-flex items-center justify-center min-h-[36px] sm:min-h-[40px] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-200 dark:border-slate-700/80 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-400/40 cursor-pointer"
              title="Clear text"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="p-4 bg-white/50 dark:bg-slate-950/20">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your text here (e.g. your name, bio, gaming nickname, or message)..."
            rows={3}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-sans text-base sm:text-lg resize-y focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>
            {(input || "").length} characters • {(input || "").trim().split(/\s+/).filter(Boolean).length} words
          </span>
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">
            Instant client-side generation
          </span>
        </div>
      </div>

      {/* Filter Bar: Category Tabs & Local Font Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFancyCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                fancyCategoryFilter === cat.id
                  ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs"
                  : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200/90 dark:border-slate-700/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px] md:w-64">
          <input
            type="text"
            placeholder="Filter font styles..."
            aria-label="Filter font styles"
            value={fancySearch}
            onChange={(e) => setFancySearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl pl-3.5 pr-8 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all shadow-xs"
          />
          {fancySearch && (
            <button
              type="button"
              onClick={() => setFancySearch("")}
              aria-label="Clear filter search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid: Compact cards with title case, 12px labels, and comfortable preview */}
      {filteredStyles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 text-sm">
          No font styles found matching &quot;{fancySearch}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {filteredStyles.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-2.5 group shadow-xs hover:shadow-cardHover"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate tracking-normal">
                  {item.name}
                </span>
                <CopyButton text={item.preview} />
              </div>
              <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 break-words select-all leading-normal py-0.5 min-h-[38px] flex items-center font-sans">
                {item.preview}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ToolWorkspaceResolver
      tool={tool}
      input={input}
      output={output}
      onInputChange={setInput}
      onRun={() => {}}
      onClear={() => {
        setInput("");
        setOutput("");
      }}
      customWorkspace={fancyFontsWorkspace}
    />
  );
};
