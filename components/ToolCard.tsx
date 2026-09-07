"use client";

import React from "react";
import Link from "next/link";
import { ToolDefinition } from "@/data/toolsRegistry";
import { DynamicIcon } from "@/components/DynamicIcon";
import { FavoriteStar } from "@/components/FavoriteStar";
import { Sparkles } from "lucide-react";

export const ToolCard: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const isAI = tool.category === "AI Magic";

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 hover:shadow-lg hover:shadow-black/20">
      <Link
        href={`/tools/${tool.slug}`}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50"
      >
        <span className="sr-only">Open {tool.name}</span>
      </Link>

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
              isAI
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                : "bg-slate-800 text-slate-200 border border-slate-700/60"
            }`}
          >
            <DynamicIcon name={tool.icon} size={20} />
          </div>

          <div className="relative z-20 flex items-center gap-1.5">
            {isAI && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                <Sparkles size={10} /> AI
              </span>
            )}
            <FavoriteStar toolId={tool.id} />
          </div>
        </div>

        <h3 className="text-base font-semibold text-slate-100 group-hover:text-brand-400 transition-colors mb-1.5">
          {tool.name}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-medium text-slate-400">{tool.category}</span>
        <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
          Open tool →
        </span>
      </div>
    </div>
  );
};
