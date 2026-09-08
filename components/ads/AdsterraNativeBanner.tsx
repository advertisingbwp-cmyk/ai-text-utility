"use client";

import React, { useEffect, useRef } from "react";

export const AdsterraNativeBanner: React.FC<{ className?: string }> = ({ className = "" }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;
    if (bannerRef.current.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://bibleearthquake.com/8aca604b8b2ab0a3b2106d4958e02b1d/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    bannerRef.current.appendChild(script);
  }, []);

  return (
    <aside
      aria-label="Sponsored advertisement"
      className={`w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-6 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-900/40 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
          Advertisement
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Sponsored Content
        </span>
      </div>
      <div ref={bannerRef} className="w-full flex justify-center overflow-hidden">
        <div id="container-8aca604b8b2ab0a3b2106d4958e02b1d" />
      </div>
    </aside>
  );
};
