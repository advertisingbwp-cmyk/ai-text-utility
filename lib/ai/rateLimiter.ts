/**
 * Serverless-Compatible In-Memory Sliding Window Rate Limiter
 * Tracks requests by IP address with automatic expiration and memory cleanup.
 */

interface RateLimitRecord {
  timestamps: number[];
}

export class RateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private lastCleanup: number = Date.now();

  constructor(maxRequests = 15, windowMs = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Checks if an IP is within the rate limit.
   */
  public check(ip: string): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    this.cleanupIfNeeded(now);

    const record = this.store.get(ip) || { timestamps: [] };
    // Filter out timestamps outside current window
    const recent = record.timestamps.filter((ts) => now - ts < this.windowMs);

    if (recent.length >= this.maxRequests) {
      const oldest = recent[0];
      const resetMs = Math.max(0, this.windowMs - (now - oldest));
      return {
        allowed: false,
        remaining: 0,
        resetMs,
      };
    }

    recent.push(now);
    this.store.set(ip, { timestamps: recent });

    return {
      allowed: true,
      remaining: Math.max(0, this.maxRequests - recent.length),
      resetMs: this.windowMs,
    };
  }

  /**
   * Resets rate limits (useful in testing).
   */
  public reset(): void {
    this.store.clear();
  }

  /**
   * Cleans up expired entries periodically to prevent memory growth.
   */
  private cleanupIfNeeded(now: number): void {
    // Run cleanup every 5 minutes
    if (now - this.lastCleanup > 5 * 60 * 1000) {
      for (const [key, record] of this.store.entries()) {
        const active = record.timestamps.filter((ts) => now - ts < this.windowMs);
        if (active.length === 0) {
          this.store.delete(key);
        } else {
          this.store.set(key, { timestamps: active });
        }
      }
      this.lastCleanup = now;
    }
  }
}

// Global singleton instance for the app runtime
const defaultMax = parseInt(process.env.AI_RATE_LIMIT_PER_IP_MINUTE || "15", 10);
export const globalAiRateLimiter = new RateLimiter(isNaN(defaultMax) ? 15 : defaultMax);
