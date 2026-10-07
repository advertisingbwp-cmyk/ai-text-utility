"use client";

import React from "react";
import { AdsterraFrame, bannerDocument } from "./AdsterraFrame";
import { AD_FORMAT_ENABLED } from "@/lib/adPolicy";

const document = bannerDocument("3b17baca8ac1f38a721ac113ce53e459", 728, 90);

export const AdsterraBanner728x90: React.FC<{ className?: string }> = ({ className = "" }) => {
  if (!AD_FORMAT_ENABLED.banner) {
    return <div aria-hidden="true" className={`my-4 ${className}`} style={{ width: 728, height: 110 }} />;
  }
  return (
  <div className={`flex flex-col items-center justify-center my-4 ${className}`}>
    <span className="text-xs uppercase font-mono tracking-wider text-slate-600 dark:text-slate-400 font-semibold mb-1">
      Advertisement
    </span>
    <AdsterraFrame width={728} height={90} title="Sponsored Ad 728x90" document={document}
      className="rounded-xl overflow-hidden shadow-xs border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900" />
  </div>
  );
};
