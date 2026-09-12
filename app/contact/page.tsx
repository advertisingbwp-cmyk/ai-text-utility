import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Bug, Sparkles, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | AI Text Utility",
  description:
    "Get in touch with the AI Text Utility team for support, feature suggestions, bug reports, and partnership inquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
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
        name: "Contact Us",
        item: `${baseUrl}/contact`,
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
            <Mail size={14} />
            Support &amp; Inquiries
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Contact AI Text Utility
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Have questions, ideas for new text utilities, or found an edge-case bug? We would love to hear from you.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm shadow-subtle space-y-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Mail size={18} />
            </div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">General Support</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              For general questions, usage assistance, or website feedback:
            </p>
            <a
              href="mailto:support@aitextutility.com"
              className="inline-block text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              support@aitextutility.com
            </a>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm shadow-subtle space-y-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Bug size={18} />
            </div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Bug &amp; Edge Cases</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Spotted an unexpected output or parsing failure on a specific text string?
            </p>
            <a
              href="mailto:bugs@aitextutility.com"
              className="inline-block text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            >
              bugs@aitextutility.com
            </a>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm shadow-subtle space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles size={18} />
            </div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Feature Requests</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Need a particular cipher, regex helper, or format converter added to the suite?
            </p>
            <a
              href="mailto:features@aitextutility.com"
              className="inline-block text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              features@aitextutility.com
            </a>
          </div>
        </div>

        {/* Expected Response Timeline */}
        <div className="p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-100/50 dark:bg-slate-900/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <HelpCircle size={14} className="text-brand-500" />
            Response Timeline &amp; Communication Policy
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Our engineering team reviews incoming issues and requests regularly. Standard support inquiries typically receive a response within 24–48 business hours. We do not sell or share your contact information.
          </p>
        </div>
      </div>
    </>
  );
}
