import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";

test("missing ad origin renders no frames or permanent blank slots", async () => {
  delete process.env.NEXT_PUBLIC_AD_FRAME_ORIGIN;
  const { AdsterraFrame } = await import("../components/ads/AdsterraFrame.tsx");
  const { AdsterraResponsiveBanner } = await import("../components/ads/AdsterraResponsiveBanner.tsx");
  assert.equal(renderToString(React.createElement(AdsterraFrame, { format: "native" })), "");
  assert.equal(renderToString(React.createElement(AdsterraResponsiveBanner)), "");
});
