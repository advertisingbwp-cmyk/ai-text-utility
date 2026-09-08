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
    <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
        Sponsored Recommendation
      </span>
      <div ref={bannerRef} className="w-full flex justify-center overflow-hidden">
        <div id="container-8aca604b8b2ab0a3b2106d4958e02b1d" />
      </div>
    </div>
  );
};
