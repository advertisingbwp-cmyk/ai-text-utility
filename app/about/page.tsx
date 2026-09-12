import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Cpu, Zap, Lock, Globe, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | AI Text Utility",
  description:
    "Learn about AI Text Utility's mission to provide fast, private, browser-native text tools and AI writing assistants with zero data collection.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About Us",
        item: `${baseUrl}/about`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 text-slate-600 dark:text-slate-300">
        {/* Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to All Tools
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold">
            <Sparkles size={14} />
            Our Mission &amp; Engineering Principles
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            About AI Text Utility
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A privacy-first developer and writer utility platform designed for instantaneous text transformations.
          </p>
        </div>

        {/* Pillar Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm shadow-subtle space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Lock size={16} />
            </div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Strict Local Privacy</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Standard format, cleanup, and conversion tools process text entirely within your browser memory. No data is transmitted to our servers.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm shadow-subtle space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Zap size={16} />
            </div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Zero Latency &amp; No Ads Clutter</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Engineered with Web Cryptography APIs, Web Workers, and native string methods for instant calculations without lag.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm shadow-subtle space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Cpu size={16} />
            </div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Ephemeral AI Intelligence</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              AI-assisted editing uses secure, stateless, serverless endpoints with zero retention and automatic credential protection.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Why We Built AI Text Utility</h2>
            <p>
              Many online text tools are bogged down with aggressive popups, deceptive click targets, intrusive trackers, and slow round-trip server requests for basic operations like counting words or converting letter cases.
            </p>
            <p>
              We created <strong>AI Text Utility</strong> to provide a clean, modern, and trustworthy alternative. Every tool is crafted with accessibility (WCAG 2.2 AA), instant execution, and comprehensive privacy at its core.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">What Sets Our Platform Apart</h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>No Account Required:</strong> Every utility is freely accessible without signups, paywalls, or feature gates.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Accurate Developer Precision:</strong> From RFC-compliant UUID generation to UTF-8 compliant Base64 encoding and JSON parsing with exact line-and-column error locators.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Transparent Monetization:</strong> We use lightweight, non-intrusive banner placements that never block tool controls or trick users into misclicks.</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
