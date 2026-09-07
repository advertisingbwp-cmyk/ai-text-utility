import React from "react";
import Link from "next/link";
import { ToolDefinition, getToolsByCategory, getFeaturedTools } from "@/data/toolsRegistry";
import { getToolEducationalContent } from "@/data/toolFaqs";
import { DynamicIcon } from "@/components/DynamicIcon";
import { AdUnit } from "@/components/AdUnit";
import { Check, ShieldCheck, HelpCircle, ArrowRight } from "lucide-react";

export interface ToolSeoContentProps {
  tool: ToolDefinition;
}

export const ToolSeoContent: React.FC<ToolSeoContentProps> = ({ tool }) => {
  const content = getToolEducationalContent(tool.category, tool.slug, tool.name);

  // Find related tools (excluding current tool)
  const relatedTools = getToolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 4);

  const fallbackTools =
    relatedTools.length >= 3
      ? relatedTools
      : [
          ...relatedTools,
          ...getFeaturedTools().filter(
            (t) => t.slug !== tool.slug && !relatedTools.some((r) => r.slug === t.slug)
          ),
        ].slice(0, 4);

  const isAI = tool.category === "AI Magic";

  return (
    <div className="max-w-6xl mx-auto mt-12 space-y-12 text-slate-300">
      {/* Educational Guide Section */}
      <section aria-labelledby="about-heading" className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 id="about-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            About {tool.name}
          </h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-3xl">
            {tool.description} Designed for software developers, content writers, students, and data
            professionals who value accuracy, speed, and privacy.
          </p>
        </div>

        {/* How It Works & Key Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* How to Use */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              How to Use {tool.name}
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-300 list-decimal list-inside leading-relaxed">
              {content.howToSteps.map((step, idx) => (
                <li key={idx} className="pl-1">
                  <span className="text-slate-200">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Key Features & Privacy */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                <ShieldCheck className="text-emerald-400" size={20} />
                Key Features & Security
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                {content.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
              <span>
                {isAI
                  ? "AI requests are encrypted via HTTPS and never saved or used for model training."
                  : "All processing runs 100% locally in your browser memory. Your text never leaves your device."}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Non-Intrusive Ad Banner */}
      <AdUnit slotId="tool-content-ad" format="horizontal" />

      {/* Frequently Asked Questions */}
      <section aria-labelledby="faq-heading" className="space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 id="faq-heading" className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="text-brand-400" size={22} />
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Common questions regarding {tool.name}, data safety, and supported capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 space-y-2 hover:border-slate-700 transition-colors"
            >
              <h3 className="text-sm font-semibold text-slate-100">
                {faq.question}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools Recommendation */}
      {fallbackTools.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <h2 id="related-heading" className="text-lg font-bold text-white">
              Related {tool.category} Tools
            </h2>
            <Link
              href={`/#category-${tool.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1 transition-colors"
            >
              Explore Category <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {fallbackTools.map((rel) => (
              <Link
                key={rel.id}
                href={`/tools/${rel.slug}`}
                className="group p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-brand-400 group-hover:bg-brand-500/10 transition-colors shrink-0">
                    <DynamicIcon name={rel.icon} size={16} />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    {rel.name}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {rel.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
