"use client";

import React from "react";
import Link from "next/link";
import { ToolDefinition } from "@/data/toolsRegistry";
import { DynamicIcon } from "@/components/DynamicIcon";
import { FavoriteStar } from "@/components/FavoriteStar";
import { ArrowRight } from "lucide-react";

export const ToolCard: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const isAI = tool.category === "AI Magic";

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-5 shadow-card hover:shadow-cardHover hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5">
      <Link
        href={`/tools/${tool.slug}`}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50"
      >
        <span className="sr-only">Open {tool.name}</span>
      </Link>

      <div>
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isAI
                ? "bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200/80 dark:border-brand-800/60"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60"
            }`}
          >
            <DynamicIcon name={tool.icon} size={18} />
          </div>

          <div className="relative z-20 flex items-center">
            <FavoriteStar toolId={tool.id} toolName={tool.name} />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1.5">
          {tool.name}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-500 dark:text-slate-400">{tool.category}</span>
        <span className="inline-flex items-center gap-1 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 font-medium transition-colors">
          Open tool
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
};
