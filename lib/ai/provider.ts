/**
 * AI Provider Layer
 * Pluggable architecture supporting Google Gemini and OpenAI-compatible endpoints.
 * Hardened for security, timeouts, transient retries, and sensitive data redaction.
 */

import type { AiMode, AiProvider, AiProviderConfig } from "./types.ts";
import { getSystemPrompt } from "./prompts.ts";

/**
 * Custom error class for AI Provider issues with status code and transient state tracking.
 */
export class AiProviderError extends Error {
  public readonly status: number;
  public readonly isTransient: boolean;

  constructor(message: string, status = 500, isTransient = false) {
    super(message);
    this.name = "AiProviderError";
    this.status = status;
    this.isTransient = isTransient;
  }
}

/**
 * Strips known API key and credential formats from strings before logging or exposure.
 */
export function redactSensitiveText(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/AIza[0-9A-Za-z-_]{35}/g, "[REDACTED_GEMINI_KEY]")
    .replace(/sk-[a-zA-Z0-9]{20,}/g, "[REDACTED_OPENAI_KEY]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED_TOKEN]");
}

export class GeminiProvider implements AiProvider {
  public readonly name = "Google-Gemini";

  public async execute(
    mode: AiMode,
    text: string,
    config: AiProviderConfig
  ): Promise<string> {
    const { apiKey, baseUrl, model, timeoutMs, maxOutputTokens, temperature } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const systemPrompt = getSystemPrompt(mode);
    const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
    const endpoint = `${cleanBaseUrl}/models/${model}:generateContent`;

    const effectiveTemperature = typeof temperature === "number" ? temperature : 0.7;

    try {
      const requestPayload = {
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text }],
          },
        ],
        generationConfig: {
          temperature: effectiveTemperature,
          maxOutputTokens,
        },
      };

      let response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      // If temporary high-demand spike (503/429), try configurable stable version fallback
      if (!response.ok && (response.status === 503 || response.status === 429) && model === "gemini-flash-latest") {
        const fallbackModel = process.env.AI_FALLBACK_MODEL || "gemini-2.5-flash";
        const fallbackEndpoint = `${cleanBaseUrl}/models/${fallbackModel}:generateContent`;
        const fallbackResponse = await fetch(fallbackEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });
        if (fallbackResponse.ok) {
          response = fallbackResponse;
        }
      }

      if (!response.ok) {
        let errMessage = `Upstream AI provider error (Status ${response.status})`;
        try {
          const errBody = await response.json();
          if (errBody?.error?.message) {
            errMessage = errBody.error.message;
          } else if (typeof errBody?.error === "string") {
            errMessage = errBody.error;
          }
        } catch {
          // Non-JSON error body
        }
        const isTransient = response.status === 429 || response.status === 503 || response.status === 504;
        throw new AiProviderError(redactSensitiveText(errMessage), response.status, isTransient);
      }

      interface GeminiResponse {
        candidates?: Array<{
          content?: {
            parts?: Array<{
              text?: string;
            }>;
          };
        }>;
      }

      let data: GeminiResponse | null = null;
      try {
        data = (await response.json()) as GeminiResponse;
      } catch {
        throw new AiProviderError("Malformed response from AI provider (Invalid JSON payload).", 502, false);
      }

      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof content !== "string") {
        throw new AiProviderError("Malformed response from AI provider (Missing candidates/content in response).", 502, false);
      }

      return content.trim();
    } catch (err: unknown) {
      if (err instanceof AiProviderError) {
        throw err;
      }
      if (err instanceof Error && err.name === "AbortError") {
        throw new AiProviderError(`AI request timed out after ${Math.round(timeoutMs / 1000)} seconds.`, 504, true);
      }
      const msg = err instanceof Error ? err.message : String(err);
      throw new AiProviderError(redactSensitiveText(msg), 500, false);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export class OpenAiCompatibleProvider implements AiProvider {
  public readonly name = "OpenAI-Compatible";

  public async execute(
    mode: AiMode,
    text: string,
    config: AiProviderConfig
  ): Promise<string> {
    const { apiKey, baseUrl, model, timeoutMs, maxOutputTokens, temperature } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const systemPrompt = getSystemPrompt(mode);
    const endpoint = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

    const effectiveTemperature = typeof temperature === "number" ? temperature : 1.0;

    try {
      const requestPayload: Record<string, unknown> = {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        max_tokens: maxOutputTokens,
      };

      if (effectiveTemperature !== undefined) {
        requestPayload.temperature = effectiveTemperature;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errMessage = `Upstream AI provider error (Status ${response.status})`;
        try {
          const errBody = await response.json();
          if (errBody?.error?.message) {
            errMessage = errBody.error.message;
          } else if (typeof errBody?.error === "string") {
            errMessage = errBody.error;
          }
        } catch {
          // Non-JSON error body
        }
        const isTransient = response.status === 429 || response.status === 503 || response.status === 504;
        throw new AiProviderError(redactSensitiveText(errMessage), response.status, isTransient);
      }

      interface ProviderResponse {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      }

      let data: ProviderResponse | null = null;
      try {
        data = (await response.json()) as ProviderResponse;
      } catch {
        throw new AiProviderError("Malformed response from AI provider (Invalid JSON payload).", 502, false);
      }

      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== "string") {
        throw new AiProviderError("Malformed response from AI provider (Missing choices/content in response).", 502, false);
      }

      return content.trim();
    } catch (err: unknown) {
      if (err instanceof AiProviderError) {
        throw err;
      }
      if (err instanceof Error && err.name === "AbortError") {
        throw new AiProviderError(`AI request timed out after ${Math.round(timeoutMs / 1000)} seconds.`, 504, true);
      }
      const msg = err instanceof Error ? err.message : String(err);
      throw new AiProviderError(redactSensitiveText(msg), 500, false);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Factory function to retrieve the configured AI provider.
 * Default is GeminiProvider.
 */
export function getAiProvider(providerType?: string): AiProvider {
  const provider = providerType || process.env.AI_PROVIDER || "gemini";
  if (provider.toLowerCase().includes("openai")) {
    return new OpenAiCompatibleProvider();
  }
  return new GeminiProvider();
}
