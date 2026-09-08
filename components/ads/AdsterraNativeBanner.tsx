"use client";

import React, { useEffect, useRef } from "react";

export const AdsterraNativeBanner: React.FC<{ className?: string }> = ({ className = "" }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    // A11y: Observe dynamic script additions and ensure all links have accessible text
    const observer = new MutationObserver(() => {
      if (!bannerRef.current) return;
      const links = bannerRef.current.querySelectorAll<HTMLAnchorElement>("a");
      links.forEach((link, idx) => {
        if (!link.getAttribute("aria-label") && !link.textContent?.trim()) {
          const title =
            link.closest("div")?.querySelector(".container-8aca604b8b2ab0a3b2106d4958e02b1d__title")?.textContent?.trim() ||
            `Sponsored link ${idx + 1}`;
          link.setAttribute("aria-label", `Visit sponsored ad: ${title}`);
        }
        if (!link.getAttribute("rel") || !link.getAttribute("rel")?.includes("noopener")) {
          link.setAttribute("rel", "noopener noreferrer nofollow");
        }
      });
    });

    observer.observe(bannerRef.current, { childList: true, subtree: true });

    if (!bannerRef.current.querySelector("script")) {
      const script = document.createElement("script");
      script.src = "https://bibleearthquake.com/8aca604b8b2ab0a3b2106d4958e02b1d/invoke.js";
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      bannerRef.current.appendChild(script);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <aside
      aria-label="Sponsored advertisement"
      className={`w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-6 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-900/40 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
          Advertisement
        </span>
        <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
          Sponsored Content
        </span>
      </div>
      <div ref={bannerRef} className="w-full flex justify-center overflow-hidden">
        <div id="container-8aca604b8b2ab0a3b2106d4958e02b1d" />
      </div>
    </aside>
  );
};
