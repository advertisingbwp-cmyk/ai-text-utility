import test from "node:test";
import assert from "node:assert/strict";

import {
  isAllowedAiMode,
  ALLOWED_AI_MODES,
} from "../../lib/ai/types.ts";
import type { AiMode } from "../../lib/ai/types.ts";

import { SYSTEM_PROMPTS, getSystemPrompt } from "../../lib/ai/prompts.ts";
import {
  RateLimiter,
  InMemoryRateLimiter,
  UpstashRedisRateLimiter,
} from "../../lib/ai/rateLimiter.ts";
import {
  GeminiProvider,
  OpenAiCompatibleProvider,
  getAiProvider,
  AiProviderError,
  redactSensitiveText,
} from "../../lib/ai/provider.ts";
import { isValidIp, extractClientIp } from "../../lib/ai/ip.ts";

test("1. AI Mode Validation", () => {
  // Allowed modes
  for (const mode of ALLOWED_AI_MODES) {
    assert.equal(isAllowedAiMode(mode), true);
  }

  // Unknown / rejected modes
  assert.equal(isAllowedAiMode("hack"), false);
  assert.equal(isAllowedAiMode("sql-inject"), false);
  assert.equal(isAllowedAiMode(""), false);
  assert.equal(isAllowedAiMode(null), false);
  assert.equal(isAllowedAiMode(123), false);
});

test("2. AI Prompts - Strict Specification Matching", () => {
  assert.equal(ALLOWED_AI_MODES.length, 6);

  // Verify each mode has distinct, customized system instructions
  for (const mode of ALLOWED_AI_MODES) {
    const prompt = getSystemPrompt(mode);
    assert.ok(prompt.length > 50);
    assert.equal(prompt, SYSTEM_PROMPTS[mode]);
  }

  assert.ok(SYSTEM_PROMPTS.grammar.includes("Fix grammar, spelling, punctuation"));
  assert.ok(SYSTEM_PROMPTS.professional.includes("professional, concise, and formal"));
  assert.ok(SYSTEM_PROMPTS.friendly.includes("natural, warm, and conversational"));
  assert.ok(SYSTEM_PROMPTS.summarize.includes("concise bullet points"));
  assert.ok(SYSTEM_PROMPTS.paraphrase.includes("Rewrite naturally while preserving meaning"));
  assert.ok(SYSTEM_PROMPTS.expand.includes("Expand the content with useful detail"));
});

test("3. Rate Limiter - Abuse Protection & Sliding Window", () => {
  const limiter = new RateLimiter(3, 1000); // 3 requests per 1000ms

  // First 3 requests allowed
  const r1 = limiter.check("192.168.1.1");
  assert.equal(r1.allowed, true);
  assert.equal(r1.remaining, 2);

  const r2 = limiter.check("192.168.1.1");
  assert.equal(r2.allowed, true);
  assert.equal(r2.remaining, 1);

  const r3 = limiter.check("192.168.1.1");
  assert.equal(r3.allowed, true);
  assert.equal(r3.remaining, 0);

  // 4th request blocked
  const r4 = limiter.check("192.168.1.1");
  assert.equal(r4.allowed, false);
  assert.equal(r4.remaining, 0);
  assert.ok(r4.resetMs > 0);

  // Different IP is still allowed
  const otherIp = limiter.check("10.0.0.1");
  assert.equal(otherIp.allowed, true);
});

test("4. Gemini Provider - Valid Request Execution", async () => {
  const originalFetch = globalThis.fetch;
  try {
    // Mock successful Gemini API response
    globalThis.fetch = async (url, options) => {
      assert.ok(String(url).includes("/models/gemini-flash-latest:generateContent"));
      assert.equal(options?.headers?.["X-goog-api-key"], "test-gemini-key");

      const body = JSON.parse(options?.body as string);
      assert.equal(body.contents[0].parts[0].text, "Sample user text");
      assert.ok(body.systemInstruction.parts[0].text.includes("Fix grammar"));

      return new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [{ text: "Corrected user text by Gemini." }],
                role: "model",
              },
              finishReason: "STOP",
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    const provider = new GeminiProvider();
    const result = await provider.execute("grammar", "Sample user text", {
      apiKey: "test-gemini-key",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      model: "gemini-flash-latest",
      timeoutMs: 5000,
      maxOutputTokens: 1000,
      temperature: 0.7,
    });

    assert.equal(result, "Corrected user text by Gemini.");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("5. Gemini Provider - Provider Error Response", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          error: {
            message: "API key not valid. Please pass a valid API key.",
            code: 400,
            status: "INVALID_ARGUMENT",
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    };

    const provider = new GeminiProvider();
    await assert.rejects(
      async () => {
        await provider.execute("professional", "Some draft", {
          apiKey: "bad-key",
          baseUrl: "https://generativelanguage.googleapis.com/v1beta",
          model: "gemini-flash-latest",
          timeoutMs: 5000,
          maxOutputTokens: 1000,
        });
      },
      {
        message: "API key not valid. Please pass a valid API key.",
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("6. Gemini Provider - Malformed Provider Response", async () => {
  const originalFetch = globalThis.fetch;
  try {
    // Missing candidates array
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          promptFeedback: { blockReason: "OTHER" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    const provider = new GeminiProvider();
    await assert.rejects(
      async () => {
        await provider.execute("summarize", "Text to summarize", {
          apiKey: "key",
          baseUrl: "https://generativelanguage.googleapis.com/v1beta",
          model: "gemini-flash-latest",
          timeoutMs: 5000,
          maxOutputTokens: 500,
        });
      },
      {
        message: /Malformed response from AI provider/,
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("7. Gemini Provider - Timeout Handling", async () => {
  const originalFetch = globalThis.fetch;
  try {
    // Hang until aborted
    globalThis.fetch = async (url, options) => {
      const signal = options?.signal as AbortSignal;
      return new Promise((_, reject) => {
        signal.addEventListener("abort", () => {
          const abortErr = new Error("This operation was aborted");
          abortErr.name = "AbortError";
          reject(abortErr);
        });
      });
    };

    const provider = new GeminiProvider();
    await assert.rejects(
      async () => {
        await provider.execute("expand", "Brief note", {
          apiKey: "key",
          baseUrl: "https://generativelanguage.googleapis.com/v1beta",
          model: "gemini-flash-latest",
          timeoutMs: 50, // 50ms quick timeout
          maxOutputTokens: 500,
        });
      },
      {
        message: /AI request timed out/,
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("8. AI Provider Factory - Default to GeminiProvider", () => {
  const defaultProvider = getAiProvider();
  assert.equal(defaultProvider.name, "Google-Gemini");

  const openAiProvider = getAiProvider("openai");
  assert.equal(openAiProvider.name, "OpenAI-Compatible");
});

test("9. IP Address Extraction & Validation", () => {
  // Valid IPv4
  assert.equal(isValidIp("127.0.0.1"), true);
  assert.equal(isValidIp("192.168.1.1"), true);
  assert.equal(isValidIp("10.0.0.1"), true);
  assert.equal(isValidIp("255.255.255.255"), true);

  // Invalid IPv4
  assert.equal(isValidIp("256.0.0.1"), false);
  assert.equal(isValidIp("1.2.3"), false);
  assert.equal(isValidIp("1.2.3.4.5"), false);
  assert.equal(isValidIp("192.168.1.1; DROP TABLE users;"), false);
  assert.equal(isValidIp(""), false);

  // Valid IPv6
  assert.equal(isValidIp("::1"), true);
  assert.equal(isValidIp("2001:0db8:85a3:0000:0000:8a2e:0370:7334"), true);

  // Header extraction priority
  const headersVercel = new Headers({
    "x-vercel-forwarded-for": "203.0.113.195, 198.51.100.1",
    "x-real-ip": "198.51.100.2",
    "x-forwarded-for": "198.51.100.3",
  });
  assert.equal(extractClientIp(headersVercel), "203.0.113.195");

  const headersRealIp = new Headers({
    "x-real-ip": "198.51.100.2",
    "x-forwarded-for": "198.51.100.3",
  });
  assert.equal(extractClientIp(headersRealIp), "198.51.100.2");

  const headersForwarded = new Headers({
    "x-forwarded-for": "198.51.100.3, 10.0.0.1",
  });
  assert.equal(extractClientIp(headersForwarded), "198.51.100.3");

  const emptyHeaders = new Headers();
  assert.equal(extractClientIp(emptyHeaders), "127.0.0.1");
});

test("10. Sensitive Token Redaction", () => {
  const geminiSample = "Error calling https://generativelanguage.googleapis.com with key AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q failed";
  const redactedGemini = redactSensitiveText(geminiSample);
  assert.ok(!redactedGemini.includes("AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q"));
  assert.ok(redactedGemini.includes("[REDACTED_GEMINI_KEY]"));

  const openAiSample = "Authorization failed for sk-1234567890abcdef1234567890abcdef token";
  const redactedOpenAi = redactSensitiveText(openAiSample);
  assert.ok(!redactedOpenAi.includes("sk-1234567890abcdef1234567890abcdef"));
  assert.ok(redactedOpenAi.includes("[REDACTED_OPENAI_KEY]"));

  const bearerSample = "Request failed with header Bearer eyJhbGciOiJIUzI1NiJ9.test";
  const redactedBearer = redactSensitiveText(bearerSample);
  assert.ok(!redactedBearer.includes("eyJhbGciOiJIUzI1NiJ9.test"));
  assert.ok(redactedBearer.includes("Bearer [REDACTED_TOKEN]"));
});

test("11. Distributed Upstash Redis Rate Limiter & Graceful Failover", async () => {
  const originalFetch = globalThis.fetch;
  let pipelineCallCount = 0;

  try {
    // Mock Upstash REST pipeline endpoint
    globalThis.fetch = async (url, options) => {
      assert.ok(String(url).includes("/pipeline"));
      assert.equal(options?.headers?.["Authorization"], "Bearer test-upstash-token");
      pipelineCallCount++;

      // Return simulated INCR result
      return new Response(
        JSON.stringify([
          { result: pipelineCallCount }, // INCR count
          { result: 1 },                 // EXPIRE result
        ]),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    const upstashLimiter = new UpstashRedisRateLimiter({
      url: "https://test-redis.upstash.io",
      token: "test-upstash-token",
      maxRequests: 2,
      windowMs: 60000,
    });

    const res1 = await upstashLimiter.check("192.168.1.100");
    assert.equal(res1.allowed, true);
    assert.equal(res1.remaining, 1);

    const res2 = await upstashLimiter.check("192.168.1.100");
    assert.equal(res2.allowed, true);
    assert.equal(res2.remaining, 0);

    const res3 = await upstashLimiter.check("192.168.1.100");
    assert.equal(res3.allowed, false);
    assert.equal(res3.remaining, 0);

    // Failover test: Upstash network error
    globalThis.fetch = async () => {
      throw new Error("Connection refused to Upstash Redis REST");
    };

    // Should fail over gracefully to local in-memory limiter without throwing
    const failoverRes = await upstashLimiter.check("192.168.1.200");
    assert.equal(failoverRes.allowed, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
