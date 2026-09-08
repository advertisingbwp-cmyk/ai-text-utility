"use client";

import React from "react";
import Link from "next/link";
import { ToolDefinition } from "@/data/toolsRegistry";
import { DynamicIcon } from "@/components/DynamicIcon";
import { FavoriteStar } from "@/components/FavoriteStar";
import { ArrowRight } from "lucide-react";
import { getToolTheme } from "@/lib/toolThemes";

export const ToolCard: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const theme = getToolTheme(tool.id, tool.category);

  return (
    <div className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-3.5 sm:p-5 pb-3.5 sm:pb-5 shadow-card hover:shadow-cardHover hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
          <div
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 shrink-0 shadow-2xs border ${theme.bg} ${theme.border}`}
          >
            <span className="text-[19px] sm:text-[22px] leading-none select-none transition-transform group-hover:rotate-6" role="img" aria-hidden="true">
              {theme.emoji}
            </span>
          </div>

          <div className="relative z-20 flex items-center">
            <FavoriteStar toolId={tool.id} toolName={tool.name} size={16} className="p-1 sm:p-1.5" />
          </div>
        </div>

        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1 sm:mb-1.5 line-clamp-1 sm:line-clamp-none">
          <Link
            href={`/tools/${tool.slug}`}
            className="focus:outline-none focus:underline after:content-[''] after:absolute after:inset-0 after:rounded-xl sm:after:rounded-2xl after:z-0"
          >
            {tool.name}
          </Link>
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300 truncate max-w-[55%]">
          {tool.category}
        </span>
        <span className="relative z-10 inline-flex items-center gap-0.5 sm:gap-1 text-slate-600 group-hover:text-brand-600 dark:text-slate-300 dark:group-hover:text-brand-400 font-medium transition-colors shrink-0">
          <span>Open</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
};
