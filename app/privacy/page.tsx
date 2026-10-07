import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | AI Text Utility",
  description:
    "Learn how AI Text Utility protects your privacy with browser-native client-side processing, zero-logging AI transformations, and minimal data collection.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck size={14} />
          Privacy-First Architecture
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last Updated: October 2026 • Effective Immediately
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Lock size={16} />
          </div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Client-Side Processing</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Format, text, cleanup, and transform tools execute 100% inside your local browser memory.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Server size={16} />
          </div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Secure AI Processing</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            AI text requests are encrypted in transit via HTTPS and handled via Google Gemini API.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <EyeOff size={16} />
          </div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">No Sensitive Tracking</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Our application analytics events exclude input text. Advertising partners have separate data practices described below.
          </p>
        </div>
      </div>

      {/* Policy Content */}
      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">1. Information We Do NOT Collect</h2>
          <p>
            AI Text Utility was purposefully engineered to respect personal privacy and confidentiality. For all offline,
            text, format, cleanup, and transform utilities (such as Word Counter, Regex Tester, JSON Formatter, Base64 Encoder,
            and Hash Generator), your content is processed entirely within your web browser using JavaScript client-side APIs.
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Our browser-only tools do not send your input or generated output to our backend. Advertising requests are separate from tool processing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">2. AI Magic Tools Processing</h2>
          <p>
            When you deliberately use our AI-powered features (such as Grammar Fixer, AI Summarizer, or Paraphraser),
            your input text is securely transmitted via HTTPS to our serverless backend endpoint (<code>/api/ai</code>), which
            proxies your request to the upstream AI provider (Google Gemini API).
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-500 dark:text-slate-400 pl-2">
            <li>AI requests are transmitted over TLS-encrypted HTTPS connections.</li>
            <li>Our application backend does not store or persist your raw text inputs or generated outputs in any database.</li>
            <li>For paid Gemini API usage, Google states that prompts and responses are not used to improve its products by default; limited retention may still occur for service operation and abuse monitoring.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">3. Local Storage & Preferences</h2>
          <p>
            We use browser <code>localStorage</code> exclusively to persist your convenience preferences, such as:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-500 dark:text-slate-400 pl-2">
            <li>Bookmarked favorite tools (e.g. <code>aitextutility_favorites</code>)</li>
            <li>Recently accessed utilities (e.g. <code>aitextutility_recent</code>)</li>
            <li>Dark or light interface theme preferences</li>
          </ul>
          <p className="text-slate-500 dark:text-slate-400">
            This data remains entirely on your device and is never uploaded or synchronized to remote databases.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">4. Telemetry & Analytics</h2>
          <p>
            We collect high-level, anonymized usage telemetry (such as tool visit counts, button clicks, and error frequencies)
            to identify broken features and improve performance.
          </p>
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Our analytics pipeline strictly never collects, transmits, or inspects the text, code, or data you input into any tool.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">5. Advertising & Third-Party Partners</h2>
          <p>
            Sponsored links from advertising partners, including Adsterra, help support our free tools. Embedded advertising is currently disabled as explained below.
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Ad networks receive network information such as your IP address and browser details when ads load. They may use cookies, web beacons or device identifiers, subject to browser restrictions and their own privacy policies. These identifiers are not necessarily anonymous.
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Embedded banner and Native ad formats are currently disabled because their scripts require access unavailable in our sandbox. Sponsored links remain available. Any embedded format we enable must run in a sandboxed frame without same-origin access, and we do not pass tool input or output into ad frames.
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Sensitive tool pages do not load embedded advertising while compatible isolated banners are unavailable. Sponsored links open an external site in a new tab without access to the originating tab; that site&apos;s own privacy practices apply after you click.
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            You can control or disable cookie tracking at any time via your browser privacy settings, or by utilizing industry opt-out tools such as the Network Advertising Initiative (NAI) or Digital Advertising Alliance (DAA).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">6. Contact & Inquiries</h2>
          <p className="text-slate-500 dark:text-slate-400">
            If you have questions, feedback, or privacy-related inquiries regarding AI Text Utility, please contact our support team at{" "}
            <a
              href="mailto:support@aitextutility.com"
              className="text-brand-600 dark:text-brand-400 underline hover:text-brand-700 dark:hover:text-brand-300 font-medium"
            >
              support@aitextutility.com
            </a>{" "}
            or visit our{" "}
            <Link
              href="/contact"
              className="text-brand-600 dark:text-brand-400 underline hover:text-brand-700 dark:hover:text-brand-300 font-medium"
            >
              Contact page
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
