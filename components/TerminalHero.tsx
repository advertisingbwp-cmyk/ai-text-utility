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
            <Zap size={13} className="text-brand-600 dark:text-brand-400 fill-brand-600/20" />
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
            Analyze, transform, clean, and generate text with modern, fast and privacy-focused tools. Built for developers, writers and everyone who works with text.
          </p>

          {/* Compact 3-item Trust Row (3D Tactile Layout) */}
          <div className="w-full pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 text-left">
            <div className="flex-1 p-2.5 rounded-2xl bg-white/65 dark:bg-slate-900/65 backdrop-blur-md border border-white/70 dark:border-slate-800 shadow-[0_4px_16px_rgba(55,95,180,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(37,99,235,0.10)] transition-all flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/12 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30 icon-3d">
                <ShieldCheck size={18} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Private &amp; Secure</div>
                <div className="text-[11px] text-[#5F6F89] dark:text-slate-400">Most tools run in your browser</div>
              </div>
            </div>

            <div className="flex-1 p-2.5 rounded-2xl bg-white/65 dark:bg-slate-900/65 backdrop-blur-md border border-white/70 dark:border-slate-800 shadow-[0_4px_16px_rgba(55,95,180,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(147,51,234,0.10)] transition-all flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/12 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-400/30 icon-3d">
                <Zap size={18} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Fast Processing</div>
                <div className="text-[11px] text-[#5F6F89] dark:text-slate-400">Instant results as you work</div>
              </div>
            </div>

            <div className="flex-1 p-2.5 rounded-2xl bg-white/65 dark:bg-slate-900/65 backdrop-blur-md border border-white/70 dark:border-slate-800 shadow-[0_4px_16px_rgba(55,95,180,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(14,165,233,0.10)] transition-all flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/12 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30 icon-3d">
                <Sparkles size={18} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">AI Powered</div>
                <div className="text-[11px] text-[#5F6F89] dark:text-slate-400">Advanced tools with AI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Floating Hero Showcase App Card */}
        <div className="lg:col-span-6 w-full min-w-0">
          <div className="relative group">
            {/* Ambient 3D Aurora Backlight */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-400/35 via-indigo-500/25 to-pink-500/35 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition duration-500 -z-10" />

            <div className="relative rounded-2xl sm:rounded-3xl border border-white/80 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/80 hero-card-3d overflow-hidden transition-all backdrop-blur-xl">
              {/* Top Bar / App Card Chrome */}
              <div className="h-11 bg-white/60 dark:bg-slate-950/80 border-b border-[rgba(100,120,160,0.12)] dark:border-slate-800/80 px-4 flex items-center justify-between gap-3 select-none backdrop-blur-md">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] inline-block" />
                </div>

                {/* Preset Selector Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 min-w-0">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setActivePreset(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        activePreset.id === preset.id
                          ? "bg-white/90 dark:bg-slate-800 text-slate-900 dark:text-white shadow-[0_2px_6px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] font-bold border border-white/80 dark:border-slate-700/80 scale-[1.02]"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                      }`}
                    >
                      {activePreset.id === preset.id && <Sparkles size={11} className="text-amber-500" />}
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-medium shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xs">
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
                    <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all min-h-[96px] leading-relaxed">
                      {activePreset.input}
                    </div>
                  </div>

                  {/* Center Action Arrow */}
                  <div className="hidden sm:flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center shadow-[0_4px_10px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,1)] hover:scale-110 hover:text-brand-600 transition-all">
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
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white/90 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-900/90 border border-emerald-300/60 dark:border-emerald-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_4px_14px_-2px_rgba(16,185,129,0.12)] font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-all min-h-[96px] leading-relaxed">
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
      </div>
    </section>
  );
};
