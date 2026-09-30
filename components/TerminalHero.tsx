"use client";

import React, { useState } from "react";
import { Search, ArrowRight, ShieldCheck, Zap, Lock, Sparkles, Check, RefreshCw } from "lucide-react";
import { TOOLS_REGISTRY } from "@/data/toolsRegistry";

interface DemoPreset {
  id: string;
  name: string;
  toolName: string;
  input: string;
  output: string;
  metrics: { label: string; value: string }[];
}

const PRESETS: DemoPreset[] = [
  {
    id: "clean-spaces",
    name: "Space Cleaner",
    toolName: "Remove Extra Spaces",
    input: "Clean   repeated     spaces    and\n\truntime   formatting      artifacts.",
    output: "Clean repeated spaces and\n\truntime formatting artifacts.",
    metrics: [
      { label: "Excess Spaces", value: "-14" },
      { label: "Tabs Preserved", value: "1" },
      { label: "Processing", value: "In-Browser" },
    ],
  },
  {
    id: "word-metrics",
    name: "Word Counter",
    toolName: "Word & Text Metrics",
    input: "Fast, private text utilities running locally inside modern browser memory.",
    output: "10 words · 73 characters · 1 sentence · 0.05 min read",
    metrics: [
      { label: "Words", value: "10" },
      { label: "Characters", value: "73" },
      { label: "Reading Time", value: "3s" },
    ],
  },
  {
    id: "json-beautify",
    name: "JSON Formatter",
    toolName: "JSON Formatter & Validator",
    input: '{"service":"ai-text-utility","status":"live","tools":43,"local":true}',
    output: '{\n  "service": "ai-text-utility",\n  "status": "live",\n  "tools": 43,\n  "local": true\n}',
    metrics: [
      { label: "Syntax", value: "Valid" },
      { label: "Keys", value: "4" },
      { label: "Indentation", value: "2 spaces" },
    ],
  },
];

export const TerminalHero: React.FC = () => {
  const [activePreset, setActivePreset] = useState<DemoPreset>(PRESETS[0]);
  const [copied, setCopied] = useState(false);
  const totalTools = TOOLS_REGISTRY.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(activePreset.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <section className="relative w-full pt-2 pb-6 sm:pt-4 sm:pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Hero Typography & Actions */}
        <div className="lg:col-span-6 w-full min-w-0 flex flex-col items-start text-left space-y-5">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/25 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-tight shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Modern Aurora Utility Suite · {totalTools} Tools</span>
          </div>

          {/* Primary H1 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Text tools that run at the speed of{" "}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent dark:from-brand-400 dark:via-indigo-300 dark:to-cyan-400">
              browser memory
            </span>
            .
          </h1>

          {/* Value Proposition */}
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Fast, reliable text utilities for developers, writers, and technical workflows. Most standard utilities run locally in your browser, while AI tools use secure server-side requests.
          </p>

          {/* Prominent Search Command Bar & CTA */}
          <div className="w-full max-w-xl space-y-3 pt-1">
            <button
              type="button"
              onClick={handleOpenPalette}
              aria-label="Search all tools (Press Ctrl+K)"
              className="w-full flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-xs hover:shadow-md transition-all duration-200 group cursor-pointer text-left active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center transition-colors group-hover:bg-brand-600 group-hover:text-white shrink-0">
                  <Search size={16} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors block">
                    Search all {totalTools} utilities...
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block truncate">
                    Word counter, JSON formatter, regex tester, cleanup...
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold shadow-2xs group-hover:border-brand-400/50 transition-colors">
                  <span className="text-xs">⌘</span>K
                </kbd>
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-brand-600 group-hover:bg-brand-50 dark:group-hover:bg-brand-950 transition-colors">
                  <ArrowRight size={13} />
                </div>
              </div>
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>Instant client-side execution for standard tools</span>
              <a
                href="#tools-section"
                className="font-medium text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Browse categories</span>
                <ArrowRight size={11} />
              </a>
            </div>
          </div>

          {/* Trust Indicators Row */}
          <div className="w-full pt-4 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-left">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 dark:bg-slate-900/30 border border-slate-200/70 dark:border-slate-800/50 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Standard Tools Local</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">In-browser processing</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 dark:bg-slate-900/30 border border-slate-200/70 dark:border-slate-800/50 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <Zap size={16} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Fast Local Processing</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Deterministic utilities</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 dark:bg-slate-900/30 border border-slate-200/70 dark:border-slate-800/50 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Lock size={16} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Privacy Distinctions</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">AI server calls explicit</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Modern Aurora Glass Preview OS Window */}
        <div className="lg:col-span-6 w-full min-w-0">
          <div className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/85 shadow-lg dark:shadow-2xl overflow-hidden transition-all">
            {/* Titlebar / OS Header */}
            <div className="h-11 bg-slate-100/80 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800/80 px-3.5 flex items-center justify-between gap-2 select-none">
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium ml-2 hidden sm:inline-block">
                  utility.preview.ts
                </span>
              </div>

              {/* Mode Pills */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 min-w-0">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActivePreset(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activePreset.id === preset.id
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold border border-slate-200/70 dark:border-slate-700/60"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Body */}
            <div className="p-4 sm:p-5 space-y-3.5">
              {/* Tool Identifier */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>{activePreset.toolName}</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                  Live Engine
                </span>
              </div>

              {/* Input Area */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Input Sample</span>
                <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/70 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all min-h-[44px]">
                  {activePreset.input}
                </div>
              </div>

              {/* Output Area */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Instant Transformation</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {copied ? <Check size={11} className="text-emerald-500" /> : <RefreshCw size={11} />}
                    <span>{copied ? "Copied!" : "Copy Output"}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-cyan-50/60 dark:from-brand-950/40 dark:via-indigo-950/30 dark:to-cyan-950/30 border border-blue-200/70 dark:border-brand-800/60 font-mono text-xs text-brand-950 dark:text-brand-200 whitespace-pre-wrap break-all min-h-[44px]">
                  {activePreset.output}
                </div>
              </div>

              {/* Metrics Pill Row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                {activePreset.metrics.map((m, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 text-center">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{m.label}</div>
                    <div className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
