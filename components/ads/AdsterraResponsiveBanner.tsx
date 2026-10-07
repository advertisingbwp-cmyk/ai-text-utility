"use client";
import React, { useEffect, useState } from "react";
import { AdsterraFrame, AdPending } from "./AdsterraFrame";
import { bannerForWidth, type AdFormat } from "@/lib/adFrames";

export const AdsterraResponsiveBanner: React.FC<{ className?: string }> = ({ className }) => {
  const [format, setFormat] = useState<AdFormat | null>(null);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 639px)");
    const tablet = window.matchMedia("(max-width: 767px)");
    const update = () => setFormat(bannerForWidth(mobile.matches ? 320 : tablet.matches ? 640 : 768));
    update();
    mobile.addEventListener("change", update);
    tablet.addEventListener("change", update);
    return () => { mobile.removeEventListener("change", update); tablet.removeEventListener("change", update); };
  }, []);
  // Mount only the active format: CSS-hidden frames would still request ads.
  return format ? <AdsterraFrame key={format} format={format} className={className} /> : <AdPending className={className} />;
};
