import test from "node:test";
import assert from "node:assert/strict";

test("without Redis, the runtime reuses in-memory counters across five requests", async () => {
  const env = { ...process.env };
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  process.env.AI_RATE_LIMIT_PER_IP_MINUTE = "2";
  try {
    const { getAiRateLimiter } = await import("../../lib/ai/rateLimiter.ts");
    const instances = [];
    const results = [];
    for (let i = 0; i < 5; i++) {
      instances.push(getAiRateLimiter());
      results.push(await getAiRateLimiter().check("203.0.113.20"));
    }
    console.log("In-memory five-request reproduction:", JSON.stringify(results.map(r => r.allowed)));
    assert.equal(new Set(instances).size, 1);
    assert.deepEqual(results.map(r => r.allowed), [true, true, false, false, false]);
    assert.deepEqual(results.map(r => r.remaining), [1, 0, 0, 0, 0]);
  } finally {
    for (const key of Object.keys(process.env)) if (!(key in env)) delete process.env[key];
    Object.assign(process.env, env);
  }
});
