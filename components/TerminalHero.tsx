"use client";

import React, { useState } from "react";
import { Search, ArrowRight, ShieldCheck, Zap, Lock, Sparkles, Check, RefreshCw } from "lucide-react";
import { TOOLS_REGISTRY } from "@/data/toolsRegistry";

interface DemoPreset {
  id: string;
  name: string;
  toolName: string;
  sublabel: string;
  input: string;
  output: string;
  charsBefore: number;
  charsAfter: number;
}

const PRESETS: DemoPreset[] = [
  {
    id: "clean-spaces",
    name: "Text Cleaner",
    toolName: "Text Cleaner",
    sublabel: "Remove extra spaces",
    input: "1  Hello   World!\n2  \\n\\n\n3  This is a sample   text   with\n   extra   spaces  .",
    output: "Hello World!\n\nThis is a sample text with\nextra spaces.",
    charsBefore: 68,
    charsAfter: 49,
  },
  {
    id: "word-metrics",
    name: "Word Counter",
    toolName: "Word Counter",
    sublabel: "Real-time metrics",
    input: "Fast, reliable browser utilities running locally inside modern browser memory.",
    output: "10 words · 77 characters · 1 sentence · ~0.05 min read",
    charsBefore: 77,
    charsAfter: 54,
  },
  {
    id: "json-beautify",
    name: "JSON Formatter",
    toolName: "JSON Formatter",
    sublabel: "Format & validate",
    input: `{"service":"ai-text-utility","status":"live","tools":${TOOLS_REGISTRY.length}}`,
    output: `{\n  "service": "ai-text-utility",\n  "status": "live",\n  "tools": ${TOOLS_REGISTRY.length}\n}`,
    charsBefore: 70,
    charsAfter: 84,
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

  return (
    <section className="relative w-full pt-1 pb-4 sm:pt-2 sm:pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Hero Typography & Trust Indicators */}
        <div className="lg:col-span-6 w-full min-w-0 flex flex-col items-start text-left space-y-4 sm:space-y-5">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-brand-500/15 border border-blue-500/20 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-tight shadow-2xs">
            <Sparkles size={13} className="text-brand-600 dark:text-brand-400" />
            <span>{totalTools} Powerful Tools</span>
          </div>

          {/* Primary H1 (Figma Proportions: ~15-20% reduced) */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.14]">
            Your All-in-One{" "}
            <span className="block sm:inline bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-brand-400 dark:via-indigo-300 dark:to-fuchsia-400">
              Text Utility Suite
            </span>
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
            Analyze, transform, clean, format, and generate text with modern browser-based utilities. Most standard tools run locally in your browser, while AI tools use server-side requests.
          </p>

          {/* Compact 3-item Trust Row (Figma Layout) */}
          <div className="w-full pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                <ShieldCheck size={18} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Standard Tools Local</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Most standard utilities run in-browser</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Zap size={18} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Fast Processing</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Browser-based deterministic utilities</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
                <Sparkles size={18} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">AI Tools</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Server-assisted where required</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Modern Aurora Glass Preview App Card (Figma Layout) */}
        <div className="lg:col-span-6 w-full min-w-0">
          <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-xl dark:shadow-2xl overflow-hidden transition-all backdrop-blur-md">
            {/* Top Bar / App Card Chrome */}
            <div className="h-11 bg-slate-50/90 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 px-4 flex items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              {/* Preset Selector Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 min-w-0">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActivePreset(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activePreset.id === preset.id
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold border border-slate-200/70 dark:border-slate-700/60"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-medium shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
                <span>Live Preview</span>
              </div>
            </div>

            {/* Preview Body: Split Input/Output View */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
                {/* Input Box */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 dark:text-slate-500 block">
                    Input
                  </span>
                  <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all min-h-[96px] leading-relaxed">
                    {activePreset.input}
                  </div>
                </div>

                {/* Center Action Arrow */}
                <div className="hidden sm:flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center shadow-xs">
                    <ArrowRight size={13} />
                  </div>
                </div>

                {/* Output Box */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                      Cleaned Result
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      aria-label="Copy demo output"
                      className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
                    >
                      {copied ? <Check size={11} className="text-emerald-500" /> : <RefreshCw size={11} />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-all min-h-[96px] leading-relaxed">
                    {activePreset.output}
                  </div>
                </div>
              </div>

              {/* Bottom Status Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-medium text-[11px]">{activePreset.sublabel}</span>
                </div>
                <div className="font-mono text-[11px]">
                  Characters: {activePreset.charsBefore} → {activePreset.charsAfter}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
