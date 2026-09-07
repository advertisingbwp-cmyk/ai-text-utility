import test from "node:test";
import assert from "node:assert/strict";

import {
  isAllowedAiMode,
  ALLOWED_AI_MODES,
} from "../../lib/ai/types.ts";
import type { AiMode } from "../../lib/ai/types.ts";

import { SYSTEM_PROMPTS, getSystemPrompt } from "../../lib/ai/prompts.ts";
import { RateLimiter } from "../../lib/ai/rateLimiter.ts";
import { OpenAiCompatibleProvider } from "../../lib/ai/provider.ts";

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

test("3. Rate Limiter - Abuse Protection & Serverless Compatibility", () => {
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

test("4. AI Provider - Valid Request Execution", async () => {
  const originalFetch = globalThis.fetch;
  try {
    // Mock successful upstream provider response
    globalThis.fetch = async (url, options) => {
      const body = JSON.parse(options?.body as string);
      assert.equal(body.model, "test-model");
      assert.equal(body.messages[1].content, "Sample user text");

      return new Response(
        JSON.stringify({
          id: "chatcmpl-test",
          model: "test-model",
          choices: [
            {
              message: {
                role: "assistant",
                content: "Corrected user text.",
              },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    const provider = new OpenAiCompatibleProvider();
    const result = await provider.execute("grammar", "Sample user text", {
      apiKey: "test-key",
      baseUrl: "https://mock.api/v1",
      model: "test-model",
      timeoutMs: 5000,
      maxOutputTokens: 1000,
    });

    assert.equal(result, "Corrected user text.");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("5. AI Provider - Provider Error Response", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          error: {
            message: "Invalid API key provided or quota exceeded.",
          },
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    };

    const provider = new OpenAiCompatibleProvider();
    await assert.rejects(
      async () => {
        await provider.execute("professional", "Some draft", {
          apiKey: "bad-key",
          baseUrl: "https://mock.api/v1",
          model: "test-model",
          timeoutMs: 5000,
          maxOutputTokens: 1000,
        });
      },
      {
        message: "Invalid API key provided or quota exceeded.",
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("6. AI Provider - Malformed Provider Response", async () => {
  const originalFetch = globalThis.fetch;
  try {
    // Missing choices array
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          id: "empty-response",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    const provider = new OpenAiCompatibleProvider();
    await assert.rejects(
      async () => {
        await provider.execute("summarize", "Text to summarize", {
          apiKey: "key",
          baseUrl: "https://mock.api/v1",
          model: "model",
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

test("7. AI Provider - Timeout Handling", async () => {
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

    const provider = new OpenAiCompatibleProvider();
    await assert.rejects(
      async () => {
        await provider.execute("expand", "Brief note", {
          apiKey: "key",
          baseUrl: "https://mock.api/v1",
          model: "model",
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
