import React from "react";
import type { ToolDefinition } from "@/data/toolsRegistry";
import { getToolAdPolicy } from "@/lib/adPolicy";
import { AdsterraResponsiveBanner } from "./AdsterraResponsiveBanner";
import { AdsterraNativeBanner } from "./AdsterraNativeBanner";
export function ToolAdvertisements({ tool }: { tool: ToolDefinition }) {
  const policy = getToolAdPolicy(tool);
  return <>
    {policy.isolatedBanner && <AdsterraResponsiveBanner />}
    {policy.isolatedNative && <AdsterraNativeBanner />}
  </>;
}
