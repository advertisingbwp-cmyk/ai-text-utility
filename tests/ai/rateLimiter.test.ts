import test from "node:test";
import assert from "node:assert/strict";
import { InMemoryRateLimiter, UpstashRedisRateLimiter } from "../../lib/ai/rateLimiter.ts";
import { extractClientIp } from "../../lib/ai/ip.ts";

const config = { url: "https://redis.example.test", token: "test-secret", maxRequests: 2, windowMs: 60_000 };
const redisResponse = (count: number) => Response.json([{ result: count }, { result: 1 }]);

test("local sliding window: independent IPs, final slot, rejection and exact expiry", t => {
  let now = 100_000;
  t.mock.method(Date, "now", () => now);
  const limiter = new InMemoryRateLimiter(2, 60_000);
  assert.deepEqual(limiter.check("ip-a"), { allowed: true, remaining: 1, resetMs: 60_000, limit: 2 });
  now += 10_000;
  assert.deepEqual(limiter.check("ip-a"), { allowed: true, remaining: 0, resetMs: 50_000, limit: 2 });
  assert.deepEqual(limiter.check("ip-a"), { allowed: false, remaining: 0, resetMs: 50_000, limit: 2 });
  assert.equal(limiter.check("ip-b").remaining, 1);
  now = 160_000;
  assert.deepEqual(limiter.check("ip-a"), { allowed: true, remaining: 0, resetMs: 10_000, limit: 2 });
  assert.equal(limiter.check("ip-a").allowed, false);
  now = 230_000;
  assert.equal(limiter.check("ip-a").remaining, 1);
});

test("Redis uses INCR results, correct bucket reset and nonnegative counts", async t => {
  t.mock.method(Date, "now", () => 125_000);
  let count = 0;
  t.mock.method(globalThis, "fetch", async (url: string, options: RequestInit) => {
    assert.equal(url, "https://redis.example.test/pipeline");
    assert.equal((options.headers as Record<string, string>).Authorization, "Bearer test-secret");
    assert.deepEqual(JSON.parse(options.body as string), [
      ["INCR", "ratelimit:ai:203.0.113.1:2"], ["EXPIRE", "ratelimit:ai:203.0.113.1:2", 120],
    ]);
    return redisResponse(++count);
  });
  const limiter = new UpstashRedisRateLimiter(config);
  const results = [];
  for (let i = 0; i < 5; i++) results.push(await limiter.check("203.0.113.1"));
  assert.deepEqual(results.map(r => r.allowed), [true, true, false, false, false]);
  assert.deepEqual(results.map(r => r.remaining), [1, 0, 0, 0, 0]);
  assert.ok(results.every(r => r.resetMs === 55_000));
});

test("Redis recovery resumes distributed results and preserves local outage history", async t => {
  let outage = true;
  let attempts = 0;
  let redisCount = 0;
  t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async () => {
    attempts++;
    if (outage) throw new Error("offline");
    return redisResponse(++redisCount);
  });
  const limiter = new UpstashRedisRateLimiter(config);
  assert.equal((await limiter.check("same-ip")).allowed, true);
  assert.equal((await limiter.check("same-ip")).allowed, true);
  assert.equal((await limiter.check("same-ip")).allowed, false);
  outage = false;
  assert.equal((await limiter.check("same-ip")).remaining, 1);
  assert.equal((await limiter.check("same-ip")).remaining, 0);
  assert.equal((await limiter.check("same-ip")).allowed, false);
  outage = true;
  assert.equal((await limiter.check("same-ip")).allowed, false);
  assert.equal((await limiter.check("other-ip")).allowed, true);
  assert.equal(attempts, 8);
});

test("Redis reset timing excludes network latency", async t => {
  let now = 125_000;
  t.mock.method(Date, "now", () => now);
  t.mock.method(globalThis, "fetch", async () => {
    now += 5000;
    return redisResponse(2);
  });
  const result = await new UpstashRedisRateLimiter(config).check("same");
  assert.equal(result.resetMs, 50_000);
  assert.equal(result.remaining, 0);
});

test("concurrent Redis failures share a synchronous fallback counter", async t => {
  const warn = t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async () => {
    await Promise.resolve();
    throw new Error("offline");
  });
  const limiter = new UpstashRedisRateLimiter(config);
  const results = await Promise.all(Array.from({ length: 20 }, () => limiter.check("same-ip")));
  assert.equal(results.filter(r => r.allowed).length, 2);
  assert.equal(results.filter(r => !r.allowed).length, 18);
  assert.ok(results.every(r => r.remaining >= 0));
  assert.equal(warn.mock.callCount(), 1);
});

test("outage warnings are sanitized and throttled to one per minute", async t => {
  let now = 100_000;
  t.mock.method(Date, "now", () => now);
  const warn = t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async () => { throw new Error("Bearer secret-token https://secret-host"); });
  const limiter = new UpstashRedisRateLimiter(config);
  await limiter.check("a");
  now += 59_999;
  await limiter.check("a");
  assert.equal(warn.mock.callCount(), 1);
  now++;
  await limiter.check("a");
  assert.equal(warn.mock.callCount(), 2);
  assert.doesNotMatch(JSON.stringify(warn.mock.calls.map(c => c.arguments)), /secret-token|secret-host/);
});

test("Redis timeout falls back without throwing and retries on recovery", async t => {
  t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", (_url: string, options: RequestInit) =>
    new Promise((_resolve, reject) => options.signal!.addEventListener("abort",
      () => reject(new Error("timeout")), { once: true })));
  const limiter = new UpstashRedisRateLimiter({ ...config, timeoutMs: 5 });
  assert.equal((await limiter.check("same")).remaining, 1);
  assert.equal((await limiter.check("same")).remaining, 0);
  assert.equal((await limiter.check("same")).allowed, false);
  t.mock.method(globalThis, "fetch", async () => redisResponse(1));
  assert.equal((await limiter.check("same")).remaining, 1);
});

test("HTTP and malformed Redis responses use persistent fallback, never fail open", async t => {
  t.mock.method(console, "warn", () => {});
  const failures = [
    () => new Response("unavailable", { status: 503 }),
    () => new Response("not-json"),
    () => Response.json([{ result: null }, { result: 1 }]),
    () => Response.json([{ result: -1 }, { result: 1 }]),
    () => Response.json([{ result: 1.5 }, { result: 1 }]),
    () => Response.json([{ error: "secret" }, { result: 1 }]),
    () => Response.json([{ result: 1 }, { error: "secret" }]),
    () => Response.json([]),
  ];
  let i = 0;
  t.mock.method(globalThis, "fetch", async () => failures[i++]());
  const limiter = new UpstashRedisRateLimiter(config);
  const results = [];
  for (let j = 0; j < failures.length; j++) results.push(await limiter.check("same"));
  assert.equal(results.filter(r => r.allowed).length, 2);
  assert.ok(results.slice(2).every(r => !r.allowed && r.remaining === 0));
});

test("trusted Vercel IP takes precedence over conflicting generic headers", () => {
  for (const spoofed of ["198.51.100.1", "198.51.100.2", "198.51.100.3"]) {
    assert.equal(extractClientIp(new Headers({
      "x-vercel-forwarded-for": "203.0.113.1",
      "x-real-ip": spoofed, "x-forwarded-for": spoofed,
    })), "203.0.113.1");
  }
});
