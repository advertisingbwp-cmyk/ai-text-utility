"use client";

import React, { useEffect, useRef, useState } from "react";
import { validateAdFrameOrigin } from "@/lib/adFrameOrigin.mjs";
import { AD_SANDBOX, AD_LOAD_TIMEOUT_MS, AD_UNITS, type AdFormat } from "@/lib/adFrames";

const configuredOrigin = process.env.NEXT_PUBLIC_AD_FRAME_ORIGIN;
const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app";
export const configuredAdOrigin = validateAdFrameOrigin(configuredOrigin, siteOrigin);

export function AdPending({ format, className = "" }: { format?: AdFormat; className?: string }) {
  if (!configuredAdOrigin) return null;
  const unit = format ? AD_UNITS[format] : null;
  return <aside aria-hidden="true" className={`flex flex-col items-center my-4 ${className}`}>
    <span className="h-4 mb-1" />
    <div style={unit ? { height: unit.height, width: unit.width, maxWidth: "100%" } : undefined}
      className={unit ? undefined : "h-[50px] sm:h-[250px] md:h-[90px]"} />
  </aside>;
}

export function AdsterraFrame({ format, className = "" }: { format: AdFormat; className?: string }) {
  const [origin, setOrigin] = useState<string | null | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const unit = AD_UNITS[format];

  useEffect(() => {
    // Check the actual embedding origin too, including preview domains and aliases.
    const expected = configuredAdOrigin;
    setOrigin(expected && validateAdFrameOrigin(expected, window.location.origin));
  }, []);

  useEffect(() => {
    if (!origin) return;
    setFailed(false);
    const timer = setTimeout(() => setFailed(true), AD_LOAD_TIMEOUT_MS);
    const element = frame.current;
    const fail = () => { clearTimeout(timer); setFailed(true); };
    element?.addEventListener("error", fail);
    const receive = (event: MessageEvent) => {
      if (event.origin !== origin || event.source !== frame.current?.contentWindow) return;
      const data = event.data;
      if (data?.type !== "ad-frame-status" || data.format !== format) return;
      if (data.status === "ready") clearTimeout(timer);
      else if (data.status === "unavailable") { clearTimeout(timer); setFailed(true); }
    };
    window.addEventListener("message", receive);
    return () => { clearTimeout(timer); element?.removeEventListener("error", fail); window.removeEventListener("message", receive); };
  }, [origin, format]);

  if (origin === undefined) return <AdPending format={format} className={className} />;
  if (!origin || failed) return null;
  return <aside aria-label="Sponsored advertisement" className={`flex flex-col items-center my-4 ${className}`}>
    <span className="text-xs uppercase font-mono text-slate-500 mb-1">Advertisement</span>
    <iframe key={format} ref={frame} title={unit.title} width={unit.width} height={unit.height}
      src={`${origin}/${format}`} sandbox={AD_SANDBOX} referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={{ height: unit.height, maxWidth: "100%", border: 0, flexShrink: 0 }}
      className={format === "native" ? "w-full" : undefined} />
  </aside>;
}
