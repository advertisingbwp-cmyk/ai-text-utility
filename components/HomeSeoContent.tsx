import React from "react";
import Link from "next/link";
import { ArrowRight, Type, Code2, ShieldCheck } from "lucide-react";
import { getToolBySlug } from "@/data/toolsRegistry";
import { getToolSeoBlueprint, TOP_10_P0_TOOLS } from "@/data/seoBlueprint";
import { AdsterraResponsiveBanner, AdsterraNativeBanner } from "@/components/ads";

export function HomeSeoContent() {
  return (
    <>
      {/* Factual Information & Guidance Card (Moved down to preserve first viewport) */}
      <section className="max-w-4xl mx-auto rounded-2xl border border-white/70 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 space-y-3.5 shadow-xs" aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Free online text tools for everyday work</h2>
        <p className="text-sm leading-relaxed text-[#5F6F89] dark:text-slate-400 max-w-[72ch]">
          AI Text Utility is a collection of browser-based tools for writers, students, developers, and office workflows. Use the tools to count words and characters, clean lists, change text case, format JSON, test regular expressions, encode data, generate identifiers, work with dates, or prepare text for publishing. Most utilities process your input locally in the browser, so routine text transformations do not need a server upload.
        </p>
        <p className="text-sm leading-relaxed text-[#5F6F89] dark:text-slate-400 max-w-[72ch]">
          Each tool page includes practical instructions, feature details, common questions, limitations, and links to related utilities. AI Magic tools are optional and clearly separated from the browser-only tools because they require a server request to an AI provider.
        </p>
      </section>

      <section aria-labelledby="how-it-works-heading" className="max-w-4xl mx-auto pt-8 border-t border-[rgba(100,120,160,0.12)] dark:border-slate-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 id="how-it-works-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              How to choose the right tool
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6F89] dark:text-slate-400 mt-1">
              Select the fastest workflow suited to your task and privacy needs
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-white/70 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/60 backdrop-blur-md space-y-3 shadow-xs hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-500/12 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-400/30 icon-3d shadow-2xs">
              <Type size={17} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">For writing</h3>
            <p className="text-xs leading-relaxed text-[#5F6F89] dark:text-slate-400">
              Use <Link href="/tools/word-counter" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Word Counter</Link> for length checks, <Link href="/tools/case-converter" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Case Converter</Link> for capitalization, <Link href="/tools/remove-extra-spaces" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Cleanup tools</Link> for messy text, and the AI writing tools when you want an assisted rewrite.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-white/70 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/60 backdrop-blur-md space-y-3 shadow-xs hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-400/30 icon-3d shadow-2xs">
              <Code2 size={17} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">For developers</h3>
            <p className="text-xs leading-relaxed text-[#5F6F89] dark:text-slate-400">
              Use <Link href="/tools/json-formatter" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">JSON Formatter</Link>, <Link href="/tools/regex-tester" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Regex Tester</Link>, <Link href="/tools/base64" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Base64</Link>, <Link href="/tools/uuid-generator" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">UUID</Link>, <Link href="/tools/jwt-decoder" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">JWT</Link>, <Link href="/tools/url-encoder" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">URL encoding</Link>, hashing, and date utilities for quick checks during development.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-white/70 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/60 backdrop-blur-md space-y-3 shadow-xs hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-xl bg-purple-500/12 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-400/30 icon-3d shadow-2xs">
              <ShieldCheck size={17} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">For privacy</h3>
            <p className="text-xs leading-relaxed text-[#5F6F89] dark:text-slate-400">
              Ordinary transformations process text in your browser without sending it to our backend. AI requests leave the browser. Embedded ads are currently disabled; sponsored links lead to external sites. Read the <Link href="/privacy" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Privacy Policy</Link> for details.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs pt-2">
          <Link href="/about" className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-sm">
            About the project <ArrowRight size={13} />
          </Link>
          <Link href="/privacy" className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-sm">
            Privacy Policy <ArrowRight size={13} />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-sm">
            Contact support <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* Sponsored Adsterra Responsive Banner */}
      <AdsterraResponsiveBanner />

      <section aria-labelledby="popular-tools-heading" className="pt-8 border-t border-[rgba(100,120,160,0.12)] dark:border-slate-800/80 space-y-4">
        <div>
          <h2 id="popular-tools-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Popular Free Developer &amp; Text Tools
          </h2>
          <p className="text-xs text-[#5F6F89] dark:text-slate-400 mt-0.5">
            Fast, privacy-focused browser utilities with client-side execution
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {TOP_10_P0_TOOLS.map((slug) => {
            const blueprint = getToolSeoBlueprint(slug);
            const tool = getToolBySlug(slug);
            if (!blueprint || !tool) return null;
            return (
              <div key={slug}>
                <Link
                  href={`/tools/${slug}`}
                  className="group p-3.5 rounded-2xl border border-white/70 dark:border-slate-800/80 bg-white/65 dark:bg-slate-900/60 backdrop-blur-md hover:bg-white/90 dark:hover:bg-slate-900/90 hover:border-white/90 dark:hover:border-slate-700/80 transition-all duration-200 flex flex-col justify-between space-y-2 shadow-xs hover:shadow-md hover:-translate-y-0.5 h-full"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                      {blueprint.h1}
                    </span>
                    <span className="text-[11px] text-[#5F6F89] dark:text-slate-400 line-clamp-1 mt-0.5 block">
                      {blueprint.primaryKeyword}
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold inline-flex items-center gap-1 pt-1">
                    <span>Open tool</span>
                    <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sponsored Adsterra Native Banner */}
      <AdsterraNativeBanner />
    </>
  );
}
