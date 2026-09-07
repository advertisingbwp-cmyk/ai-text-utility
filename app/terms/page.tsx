import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileCheck, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | OmniText Utility",
  description:
    "Read the OmniText Terms of Service regarding utility usage, user rights, output ownership, cryptographic disclaimers, and liability limits.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 text-slate-300">
      {/* Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to All Tools
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <FileCheck size={14} />
          User Agreement
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400">
          Last Updated: September 2026 • Effective Immediately
        </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using OmniText (the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service.
            If you do not agree with any portion of these terms, please do not use the website or utilities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. Permitted Use & Ownership</h2>
          <p>
            OmniText provides web-based text utilities, formatters, and AI transformation tools for personal, educational,
            and professional productivity.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong>Your Content:</strong> You retain complete ownership of all text, data, and code you input into our tools.</li>
            <li><strong>Generated Output:</strong> You own all output, formatted code, and transformations generated through your use of the Service.</li>
            <li><strong>Zero Commercial Restrictions:</strong> You are free to use generated output in commercial software, writing, and publications without attribution.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">3. Cryptographic & Security Disclaimers</h2>
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs space-y-2 text-amber-200/90">
            <div className="font-semibold flex items-center gap-1.5 text-amber-400">
              <AlertCircle size={15} />
              Important Cryptographic Notice:
            </div>
            <p>
              Tools such as the JWT Decoder, Hash Generator, and Password Generator are provided for developer debugging and convenience.
              Specifically:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-amber-300/80">
              <li>Decoding a JWT inspects unverified Base64URL claims; it does <strong>NOT</strong> verify signatures or guarantee authenticity.</li>
              <li>SHA-1 is cryptographically weak and provided solely for legacy checksums; do not use it for sensitive security applications.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">4. AI Tools Acceptable Use</h2>
          <p>
            When utilizing AI Magic features, you agree not to generate, process, or disseminate unlawful, harassing, defamatory,
            or sexually explicit material, or content that infringes on third-party intellectual property or privacy rights.
          </p>
          <p className="text-slate-400">
            Automated scraping, programmatic abuse, or attempting to bypass rate limits or security controls is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">5. Disclaimer of Warranties</h2>
          <p className="text-slate-400">
            THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
            OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, OR UNINTERRUPTED AVAILABILITY.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">6. Limitation of Liability</h2>
          <p className="text-slate-400">
            IN NO EVENT SHALL OMNITEXT, ITS OPERATORS, OR CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL,
            OR PUNITIVE DAMAGES RESULTING FROM YOUR USE OF OR INABILITY TO USE THE TOOLS, DATA LOSS, OR RELIANCE ON ANY CALCULATION OR REWRITE.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">7. Modifications to the Service</h2>
          <p className="text-slate-400">
            We reserve the right to modify, suspend, or discontinue any feature, tool, or aspect of the Service at any time without prior notice.
          </p>
        </section>
      </div>
    </div>
  );
}
