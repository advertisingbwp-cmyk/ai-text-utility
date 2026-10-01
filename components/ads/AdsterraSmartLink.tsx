"use client";

import React from "react";
import { ExternalLink, Sparkles } from "lucide-react";

interface AdsterraSmartLinkProps {
  label?: string;
  className?: string;
  variant?: "button" | "badge" | "link";
}

export const AdsterraSmartLink: React.FC<AdsterraSmartLinkProps> = ({
  label = "Explore Premium Partner Deals",
  className = "",
  variant = "badge",
}) => {
  const smartLinkUrl =
    "https://www.profitableratecpmnetwork.com/wpnm4nd8?key=3c4dfd2355641f0419fce1f81a541b61";

  if (variant === "button") {
    return (
      <a
        href={smartLinkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/70 dark:bg-slate-900/60 backdrop-blur-md text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all ${className}`}
      >
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/80 dark:border-slate-700 leading-none">
          Ad
        </span>
        <span>{label}</span>
        <ExternalLink size={12} className="opacity-70" />
      </a>
    );
  }

  if (variant === "link") {
    return (
      <a
        href={smartLinkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors ${className}`}
      >
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/80 dark:border-slate-700 leading-none">
          Ad
        </span>
        <span>{label}</span>
        <ExternalLink size={11} className="opacity-70" />
      </a>
    );
  }

  return (
    <a
      href={smartLinkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/60 dark:bg-slate-900/60 backdrop-blur-md text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-all ${className}`}
    >
      <span className="px-1 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/80 dark:border-slate-700 leading-none">
        Ad
      </span>
      <span>{label}</span>
      <ExternalLink size={10} className="text-slate-400 dark:text-slate-500" />
    </a>
  );
};
