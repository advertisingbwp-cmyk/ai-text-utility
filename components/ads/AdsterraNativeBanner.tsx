"use client";

import React from "react";
import { AdsterraFrame, nativeDocument } from "./AdsterraFrame";
import { AD_FORMAT_ENABLED } from "@/lib/adPolicy";

export const AdsterraNativeBanner: React.FC<{ className?: string }> = ({ className = "" }) => {
  if (!AD_FORMAT_ENABLED.native) {
    return <div aria-hidden="true" className={`my-6 h-[224px] ${className}`} />;
  }

  return (
    <aside
      aria-label="Sponsored advertisement"
      className={`w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-6 p-4 rounded-2xl border border-white/70 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md shadow-xs ${className}`}
    >
      <div className="flex items-center gap-2 mb-2.5 h-5">
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700 leading-none inline-flex items-center">
          Advertisement
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none inline-flex items-center">
          Sponsored Content
        </span>
      </div>
      <div className="w-full h-[160px] flex justify-center items-center overflow-hidden relative">
        <AdsterraFrame title="Sponsored Native Ad" width="100%" height={160} document={nativeDocument} className="w-full" />
      </div>
    </aside>
  );
};
