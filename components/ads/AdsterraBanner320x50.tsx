"use client";

import React from "react";
import { AdsterraFrame, bannerDocument } from "./AdsterraFrame";
import { AD_FORMAT_ENABLED } from "@/lib/adPolicy";

const document = bannerDocument("87759585f06f50f90802d1b4cea40a5d", 320, 50);

export const AdsterraBanner320x50: React.FC<{ className?: string }> = ({ className = "" }) => {
  if (!AD_FORMAT_ENABLED.banner) {
    return <div aria-hidden="true" className={`my-3 ${className}`} style={{ width: 320, height: 70 }} />;
  }
  return (
  <div className={`flex flex-col items-center justify-center my-3 ${className}`}>
    <span className="text-xs uppercase font-mono tracking-wider text-slate-600 dark:text-slate-400 font-semibold mb-1">
      Advertisement
    </span>
    <AdsterraFrame width={320} height={50} title="Sponsored Ad 320x50" document={document}
      className="rounded-lg overflow-hidden shadow-xs border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900" />
  </div>
  );
};
