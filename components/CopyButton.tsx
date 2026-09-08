"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  label?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  className = "",
  variant = "outline",
  label = "Copy",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      trackEvent("tool_copied", { toolSlug: "clipboard", outputLength: text.length });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      aria-label={copied ? "Copied to clipboard" : label}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500/50",
        variant === "outline" &&
          "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white shadow-2xs",
        variant === "ghost" &&
          "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50",
        variant === "default" &&
          "bg-brand-600 text-white hover:bg-brand-500 shadow-2xs",
        copied && "text-emerald-600 dark:text-emerald-400 border-emerald-500/50",
        className
      )}
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-400 stroke-[2.5]" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
