import test from "node:test";
import assert from "node:assert/strict";

test("Redis outage: five API requests reuse one limiter and allow only two", async t => {
  let now = 120_000;
  t.mock.method(Date, "now", () => now);
  const env = { ...process.env };
  const originalFetch = globalThis.fetch;
  const originalWarn = console.warn;
  process.env.AI_RATE_LIMIT_PER_IP_MINUTE = "2";
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.test";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-redis-secret";
  process.env.GEMINI_API_KEY = "test-ai-secret";
  process.env.AI_PROVIDER = "gemini";
  let redisAttempts = 0;
  const warnings: unknown[][] = [];
  console.warn = (...args) => { warnings.push(args); };
  globalThis.fetch = async (url) => {
    if (String(url).startsWith("https://redis.example.test")) {
      redisAttempts++;
      throw new Error("Redis unavailable: test-redis-secret");
    }
    now += 1000; // Provider latency must not shift the advertised rate-limit reset.
    return Response.json({ candidates: [{ content: { parts: [{ text: "Corrected." }] } }] });
  };
  try {
    const { getAiRateLimiter } = await import("../../lib/ai/rateLimiter.ts");
    const { POST } = await import("../../app/api/ai/route.ts");
    const instances = [];
    const responses = [];
    for (let i = 0; i < 5; i++) {
      instances.push(getAiRateLimiter());
      responses.push(await POST(new Request("https://example.test/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-vercel-forwarded-for": "203.0.113.20" },
        body: JSON.stringify({ mode: "grammar", text: "Test text." }),
      })));
    }
    const evidence = {
      statuses: responses.map(response => response.status),
      remaining: responses.map(response => response.headers.get("X-RateLimit-Remaining")),
      uniqueInstances: new Set(instances).size,
      redisAttempts,
    };
    console.log("Five-request outage reproduction:", JSON.stringify(evidence));
    assert.deepEqual(evidence.statuses, [200, 200, 429, 429, 429]);
    assert.equal(evidence.uniqueInstances, 1);
    assert.deepEqual(evidence.remaining, ["1", "0", "0", "0", "0"]);
    assert.equal(redisAttempts, 5);
    for (const response of responses) {
      assert.equal(response.headers.get("X-RateLimit-Limit"), "2");
      assert.equal(response.headers.get("X-RateLimit-Reset"), "180");
      assert.doesNotMatch(await response.text(), /test-redis-secret|stack|Redis unavailable/);
      if (response.status === 429) {
        assert.equal(response.headers.get("Retry-After"), "58");
      } else {
        assert.equal(response.headers.get("Retry-After"), null);
      }
    }
    assert.equal(warnings.length, 1, "outage warnings are throttled");
    assert.doesNotMatch(JSON.stringify(warnings), /test-redis-secret/);
  } finally {
    globalThis.fetch = originalFetch;
    console.warn = originalWarn;
    for (const key of Object.keys(process.env)) if (!(key in env)) delete process.env[key];
    Object.assign(process.env, env);
  }
});
