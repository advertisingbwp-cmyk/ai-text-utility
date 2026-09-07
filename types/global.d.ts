export {};

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}
