/**
 * Serverless-Compatible Rate Limiting Layer
 * Pluggable architecture supporting:
 * 1. Local in-memory sliding window limiter (development & testing)
 * 2. Distributed Upstash Redis REST limiter (production serverless / multi-instance Vercel)
 * 3. Graceful failover: persistent runtime-local memory if Redis fails.
 * Local state is not shared across instances, cold starts or regions.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
  limit: number;
}

export interface AiRateLimiter {
  check(ip: string): Promise<RateLimitResult> | RateLimitResult;
  reset?(): void | Promise<void>;
}

interface RateLimitRecord {
  timestamps: number[];
}

/**
 * In-Memory Sliding Window Rate Limiter
 * Tracks requests by client IP with automatic memory cleanup.
 */
export class InMemoryRateLimiter implements AiRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  public readonly maxRequests: number;
  public readonly windowMs: number;
  private lastCleanup: number = Date.now();

  constructor(maxRequests = 15, windowMs = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  public check(ip: string): RateLimitResult {
    const now = Date.now();
    this.cleanupIfNeeded(now);

    const record = this.store.get(ip) || { timestamps: [] };
    const recent = record.timestamps.filter((ts) => now - ts < this.windowMs);

    if (recent.length >= this.maxRequests) {
      const oldest = recent[0];
      const resetMs = Math.max(0, this.windowMs - (now - oldest));
      return {
        allowed: false,
        remaining: 0,
        resetMs,
        limit: this.maxRequests,
      };
    }

    recent.push(now);
    this.store.set(ip, { timestamps: recent });

    return {
      allowed: true,
      remaining: Math.max(0, this.maxRequests - recent.length),
      resetMs: Math.max(0, this.windowMs - (now - recent[0])),
      limit: this.maxRequests,
    };
  }

  public reset(): void {
    this.store.clear();
  }

  private cleanupIfNeeded(now: number): void {
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

// Export alias for backward compatibility with existing tests
export const RateLimiter = InMemoryRateLimiter;

export interface UpstashRedisConfig {
  url: string;
  token: string;
  maxRequests?: number;
  windowMs?: number;
  timeoutMs?: number;
}

/**
 * Distributed Upstash Redis Rate Limiter
 * Uses native HTTP fetch to Upstash REST API.
 * Requires zero external npm dependencies and works seamlessly in Vercel Serverless/Edge.
 */
export class UpstashRedisRateLimiter implements AiRateLimiter {
  private url: string;
  private token: string;
  public readonly maxRequests: number;
  public readonly windowMs: number;
  private timeoutMs: number;
  private fallbackLimiter: InMemoryRateLimiter;
  private lastWarningAt = -Infinity;

  constructor(config: UpstashRedisConfig) {
    this.url = config.url.replace(/\/+$/, "");
    this.token = config.token;
    this.maxRequests = config.maxRequests || 15;
    this.windowMs = config.windowMs || 60 * 1000;
    this.timeoutMs = config.timeoutMs || 1500;
    this.fallbackLimiter = new InMemoryRateLimiter(this.maxRequests, this.windowMs);
  }

  public async check(ip: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowSeconds = Math.ceil(this.windowMs / 1000);
    const windowBucket = Math.floor(now / this.windowMs);
    const key = `ratelimit:ai:${ip.replace(/[^a-zA-Z0-9_.-]/g, "_")}:${windowBucket}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      // INCR is atomic; the pipeline as a whole is not a transaction.
      // Keep the counter in Redis rather than doing a read/modify/write locally.
      const response = await fetch(`${this.url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, windowSeconds * 2],
        ]),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Upstash returned HTTP ${response.status}`);
      }

      interface UpstashResponseItem {
        result?: number;
        error?: string;
      }

      const results = (await response.json()) as UpstashResponseItem[];
      const count = Number(results?.[0]?.result);

      if (!Number.isSafeInteger(count) || count < 1 || results?.[0]?.error ||
          results?.[1]?.error || results?.[1]?.result !== 1) {
        throw new Error("Invalid response format from Upstash Redis pipeline");
      }

      const resetMs = Math.max(0, (windowBucket + 1) * this.windowMs - Date.now());
      const allowed = count <= this.maxRequests;
      const remaining = Math.max(0, this.maxRequests - count);

      return {
        allowed,
        remaining,
        resetMs,
        limit: this.maxRequests,
      };
    } catch {
      // One sanitized warning per minute per runtime, including during concurrent failures.
      // Never include raw infrastructure errors, URLs, credentials or client IPs.
      const warningAt = Date.now();
      if (warningAt - this.lastWarningAt >= 60_000) {
        this.lastWarningAt = warningAt;
        console.warn("[RateLimiter]: Redis unavailable or invalid response; using runtime-local rate limiting. Redis will be retried on the next request.");
      }
      return this.fallbackLimiter.check(ip);
    } finally {
      clearTimeout(timer);
    }
  }

  public async reset(): Promise<void> {
    this.fallbackLimiter.reset();
  }
}

/**
 * Configuration is read once when this server module is initialized.
 * Redeploy/restart the runtime to apply changed environment settings.
 */
function createAiRateLimiter(): AiRateLimiter {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    return new UpstashRedisRateLimiter({
      url: upstashUrl,
      token: upstashToken,
      maxRequests: defaultMax,
      windowMs: 60 * 1000,
    });
  }

  return globalInMemoryLimiter;
}

// Singleton in-memory limiter
const configuredMax = Number(process.env.AI_RATE_LIMIT_PER_IP_MINUTE || "15");
const defaultMax = Number.isSafeInteger(configuredMax) && configuredMax > 0 ? configuredMax : 15;
export const globalInMemoryLimiter = new InMemoryRateLimiter(defaultMax);

// One Redis client and one persistent fallback per module/runtime.
export const globalAiRateLimiter = createAiRateLimiter();

export function getAiRateLimiter(): AiRateLimiter {
  return globalAiRateLimiter;
}
