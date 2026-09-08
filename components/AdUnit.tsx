"use client";

import React, { useEffect, useRef } from "react";

export interface AdUnitProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
}

/**
 * Reusable Google AdSense Ad Unit Component.
 * - Entirely driven by NEXT_PUBLIC_ADSENSE_PUBLISHER_ID environment variable.
 * - Does NOT render fake or broken ad placeholders when unconfigured.
 * - Non-intrusive placement that never overlaps action buttons or inputs.
 */
export const AdUnit: React.FC<AdUnitProps> = ({
  slotId = "default-slot",
  format = "auto",
  responsive = true,
  className = "",
}) => {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    // Only attempt ad push if publisher ID is configured and in browser
    if (publisherId && typeof window !== "undefined" && !pushedRef.current) {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushedRef.current = true;
      } catch {
        // Suppress AdSense push errors gracefully
      }
    }
  }, [publisherId]);

  // If no publisher ID is configured, do not render fake ad boxes
  if (!publisherId) {
    return null;
  }

  return (
    <div
      className={`my-6 mx-auto w-full flex flex-col items-center justify-center overflow-hidden transition-all ${className}`}
      aria-label="Advertisement"
    >
      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 font-medium select-none">
        Advertisement
      </span>
      <div className="w-full min-h-[90px] bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 rounded-xl flex items-center justify-center p-2">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
};
