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
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/85 dark:border-slate-800/80 bg-gradient-to-b from-white via-white to-slate-50/60 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-950/80 hover:bg-white dark:hover:bg-slate-900 p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300/90 dark:hover:border-slate-700/80 transition-all duration-200 hover:-translate-y-1 active:scale-[0.99]">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 shrink-0 border ${theme.bg} ${theme.border} shadow-2xs`}
            aria-hidden="true"
          >
            <DynamicIcon
              name={tool.icon}
              size={18}
              className={`${theme.text} transition-transform duration-200 group-hover:rotate-3`}
            />
          </div>

          <div className="relative z-20 flex items-center">
            <FavoriteStar toolId={tool.id} toolName={tool.name} size={15} className="p-1" />
          </div>
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1 line-clamp-1">
          <Link
            href={`/tools/${tool.slug}`}
            className="focus:outline-none focus:underline after:content-[''] after:absolute after:inset-0 after:rounded-2xl after:z-0"
          >
            {tool.name}
          </Link>
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border truncate max-w-[65%] ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
          {tool.category}
        </span>
        <span
          className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-300 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/60 flex items-center justify-center transition-all shrink-0 shadow-2xs"
          aria-hidden="true"
        >
          <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
};
