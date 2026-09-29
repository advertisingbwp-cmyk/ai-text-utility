/** @type {import('next').NextConfig} */

/**
 * Content Security Policy (CSP) Configuration
 * Permits self-hosted assets, inline scripts/styles for Next.js hydration,
 * and verified upstream domains for Adsterra ad delivery and AI API endpoints.
 */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.profitableratecpmnetwork.com https://*.highrevenueformat.com https://vercel.live;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  frame-src 'self' data: blob: https://*.profitableratecpmnetwork.com https://*.highrevenueformat.com;
  connect-src 'self' https://*.profitableratecpmnetwork.com https://*.highrevenueformat.com https://generativelanguage.googleapis.com https://api.openai.com https://*.upstash.io;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspHeader,
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
