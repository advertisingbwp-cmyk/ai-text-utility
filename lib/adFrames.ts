export const AD_SANDBOX = "allow-scripts allow-same-origin allow-popups";
export const AD_LOAD_TIMEOUT_MS = 15_000;
export const AD_UNITS = {
  "banner-320x50": { width: 320, height: 50, title: "Sponsored Ad 320x50" },
  "banner-300x250": { width: 300, height: 250, title: "Sponsored Ad 300x250" },
  "banner-728x90": { width: 728, height: 90, title: "Sponsored Ad 728x90" },
  native: { width: "100%", height: 250, title: "Sponsored Native Ad" },
} as const;
export type AdFormat = keyof typeof AD_UNITS;
export function bannerForWidth(width: number): AdFormat {
  return width < 640 ? "banner-320x50" : width < 768 ? "banner-300x250" : "banner-728x90";
}
