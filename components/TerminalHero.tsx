"use client";

import React, { useState } from "react";
import { Search, ArrowRight, ShieldCheck, Zap, Lock, Sparkles, Check, RefreshCw } from "lucide-react";

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
      { label: "Execution", value: "<0.1ms" },
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
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-4">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/25 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-tight shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Modern Aurora Utility Suite · 46+ Tools</span>
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
            Format, inspect, convert, and clean text instantly with browser-native execution.
            Professional client-side utilities engineered for developers, writers, and technical workflows.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto pt-1">
            <button
              type="button"
              onClick={handleOpenPalette}
              aria-label="Open Command Palette (Press Ctrl+K)"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-brand-600 dark:hover:bg-brand-500 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-180 active:scale-[0.98] cursor-pointer"
            >
              <Search size={15} aria-hidden="true" />
              <span>Search 46+ Tools</span>
              <kbd className="ml-1 text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/20 dark:bg-black/20 text-white/90">
                ⌘K
              </kbd>
            </button>

            <a
              href="#tools-section"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm transition-all duration-180 active:scale-[0.98]"
            >
              <span>Explore Utilities</span>
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>

          {/* Trust Indicators Row */}
          <div className="w-full pt-4 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-left">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Local In-Browser</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">Private memory execution</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <Zap size={16} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Instant Output</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">Microsecond compute</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Lock size={16} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Private by Design</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">No server storage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Modern Aurora Glass Preview OS Window */}
        <div className="lg:col-span-6 w-full">
          <div className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-glass dark:shadow-2xl overflow-hidden transition-all">
            {/* Titlebar / OS Header */}
            <div className="h-10 bg-slate-100/70 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800/80 px-3.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium ml-2">
                  utility.preview.ts
                </span>
              </div>

              {/* Mode Pills */}
              <div className="flex items-center gap-1">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActivePreset(preset)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      activePreset.id === preset.id
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-semibold"
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
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all min-h-[44px]">
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
                <div className="p-2.5 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-800/60 font-mono text-xs text-brand-900 dark:text-brand-200 whitespace-pre-wrap break-all min-h-[44px]">
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
