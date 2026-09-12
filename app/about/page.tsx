import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Cpu, Zap, Lock, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | AI Text Utility",
  description:
    "Learn about AI Text Utility's mission to provide fast, private, browser-native text tools and AI writing assistants.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "About Us", item: `${baseUrl}/about` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 text-slate-600 dark:text-slate-300">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to All Tools
        </Link>

        <header className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold">
            <Sparkles size={14} /> Our Mission &amp; Engineering Principles
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">About AI Text Utility</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            AI Text Utility is an independent web application focused on practical text processing for developers, writers, students, and everyday users. The project combines browser-native utilities with a small set of optional AI-assisted writing tools.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 space-y-2">
            <Lock size={16} className="text-emerald-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Browser-first privacy</h2>
            <p className="text-xs leading-relaxed">Standard formatting, cleanup, counting, and conversion tools run locally in your browser rather than uploading your text to our application server.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 space-y-2">
            <Zap size={16} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Practical utilities</h2>
            <p className="text-xs leading-relaxed">The catalog covers common writing, developer, formatting, cleanup, encoding, date, and text-transformation tasks without requiring an account.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 space-y-2">
            <Cpu size={16} className="text-purple-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Optional AI assistance</h2>
            <p className="text-xs leading-relaxed">AI features are deliberately separate from local tools. When you use one, the requested text is sent to the configured AI provider to produce the requested result.</p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Why we built it</h2>
            <p>Simple text operations should be quick and understandable. Many utility sites make basic tasks harder with unnecessary registration, confusing interfaces, or aggressive monetization. AI Text Utility is designed around a different principle: give the user a clear tool, explain what it does, and make the result easy to copy or use.</p>
            <p>The project is intentionally modular so individual utilities can be tested and improved without changing the rest of the catalog. Educational sections on tool pages explain common workflows, limitations, privacy behavior, and practical use cases.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">How the tools work</h2>
            <p>Most text tools execute entirely on the client. Examples include word and character counting, case conversion, whitespace cleanup, encoding/decoding, JSON formatting, regular-expression testing, and several date and text transformations. These operations do not need a server request.</p>
            <p>AI Magic tools work differently: a user explicitly chooses an AI operation, the browser sends that request to our protected backend, and the backend communicates with the configured AI provider. The site does not expose provider credentials to the browser.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Quality and transparency</h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /><span><strong>No account required:</strong> the core utilities are available without registration.</span></div>
              <div className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /><span><strong>Clear limitations:</strong> security-sensitive tools include warnings where an output should not be treated as proof of authenticity or security.</span></div>
              <div className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /><span><strong>Human-readable guidance:</strong> tool pages include explanations, examples, FAQs, and links to related utilities rather than relying only on an interactive widget.</span></div>
              <div className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /><span><strong>Support:</strong> questions and bug reports can be sent through the Contact page.</span></div>
            </div>
          </section>

          <section className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/30">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Our goal</h2>
            <p className="mt-2">We want AI Text Utility to be a dependable reference point for small text and developer tasks: useful on the first visit, understandable without prior knowledge, and respectful of the data users paste into the tools.</p>
          </section>
        </div>
      </div>
    </>
  );
}
