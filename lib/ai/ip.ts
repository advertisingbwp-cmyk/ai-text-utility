/**
 * Client IP Extraction & Validation Utility
 * Safely extracts client IP addresses across serverless edge platforms (Vercel, AWS, Cloudflare).
 * Validates IP structure to prevent header injection and rate limiter key pollution.
 */

const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
const IPV6_REGEX = /^[0-9a-fA-F:]+$/;

/**
 * Validates whether a string is a well-formed IPv4 or IPv6 address.
 */
export function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false;
  const trimmed = ip.trim();
  if (IPV4_REGEX.test(trimmed)) return true;
  if (trimmed.includes(":") && IPV6_REGEX.test(trimmed) && trimmed.length <= 45) return true;
  return false;
}

/**
 * Safely extracts and sanitizes client IP address from request headers.
 * Header priority:
 * 1. x-vercel-forwarded-for (Vercel Edge trusted header)
 * 2. x-real-ip (Standard reverse proxy header)
 * 3. x-forwarded-for (First comma-separated IP)
 * 4. Fallback: 127.0.0.1
 */
export function extractClientIp(headers: Headers): string {
  // 1. Vercel trusted edge header
  const vercelIp = headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const candidate = vercelIp.split(",")[0].trim();
    if (isValidIp(candidate)) return candidate;
  }

  // 2. Direct real IP header
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    const candidate = realIp.trim();
    if (isValidIp(candidate)) return candidate;
  }

  // 3. Standard forwarded-for
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const candidate = forwarded.split(",")[0].trim();
    if (isValidIp(candidate)) return candidate;
  }

  // 4. Safe localhost fallback
  return "127.0.0.1";
}
