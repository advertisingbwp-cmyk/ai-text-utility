"use client";

import React from "react";
import { AdsterraFrame, bannerDocument } from "./AdsterraFrame";
import { AD_FORMAT_ENABLED } from "@/lib/adPolicy";

const document = bannerDocument("dc60669d213c871b2e2024882d61f041", 300, 250);

export const AdsterraBanner300x250: React.FC<{ className?: string }> = ({ className = "" }) => {
  if (!AD_FORMAT_ENABLED.banner) {
    return <div aria-hidden="true" className={`my-4 ${className}`} style={{ width: 300, height: 270 }} />;
  }
  return (
  <div className={`flex flex-col items-center justify-center my-4 ${className}`}>
    <span className="text-xs uppercase font-mono tracking-wider text-slate-600 dark:text-slate-400 font-semibold mb-1">
      Advertisement
    </span>
    <AdsterraFrame width={300} height={250} title="Sponsored Ad 300x250" document={document}
      className="rounded-xl overflow-hidden shadow-xs border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900" />
  </div>
  );
};
