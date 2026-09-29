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
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-all ${className}`}
      >
        <Sparkles size={13} className="text-amber-500" />
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
        className={`inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors ${className}`}
      >
        <span>{label}</span>
        <ExternalLink size={11} />
      </a>
    );
  }

  return (
    <a
      href={smartLinkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-all ${className}`}
    >
      <Sparkles size={11} className="text-amber-500" />
      <span>{label}</span>
    </a>
  );
};
