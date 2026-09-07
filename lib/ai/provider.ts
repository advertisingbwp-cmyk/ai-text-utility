/**
 * AI Provider Layer
 * Pluggable architecture: Easily swap between Experiential Labs, OpenAI, Anthropic, or custom endpoints
 * without touching tool business logic or UI.
 */

import type { AiMode, AiProvider, AiProviderConfig } from "./types.ts";
import { getSystemPrompt } from "./prompts.ts";

export class OpenAiCompatibleProvider implements AiProvider {
  public readonly name = "OpenAI-Compatible";

  public async execute(
    mode: AiMode,
    text: string,
    config: AiProviderConfig
  ): Promise<string> {
    const { apiKey, baseUrl, model, timeoutMs, maxOutputTokens } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const systemPrompt = getSystemPrompt(mode);
    const endpoint = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text },
          ],
          max_tokens: maxOutputTokens,
          temperature: mode === "grammar" ? 0.2 : 0.7,
        }),
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
        throw new Error(errMessage);
      }

      let data: any;
      try {
        data = await response.json();
      } catch {
        throw new Error("Malformed response from AI provider (Invalid JSON payload).");
      }

      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== "string") {
        throw new Error("Malformed response from AI provider (Missing choices/content in response).");
      }

      return content.trim();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`AI request timed out after ${Math.round(timeoutMs / 1000)} seconds.`);
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Factory function to retrieve the configured AI provider.
 * Default is OpenAiCompatibleProvider (compatible with Experiential Labs).
 */
export function getAiProvider(): AiProvider {
  return new OpenAiCompatibleProvider();
}
