/**
 * AI Magic System Types
 * Shared definitions for requests, responses, modes, and provider abstraction.
 */

export const ALLOWED_AI_MODES = [
  "grammar",
  "professional",
  "friendly",
  "summarize",
  "paraphrase",
  "expand",
] as const;

export type AiMode = (typeof ALLOWED_AI_MODES)[number];

export function isAllowedAiMode(mode: unknown): mode is AiMode {
  return typeof mode === "string" && ALLOWED_AI_MODES.includes(mode as AiMode);
}

export interface AiRequestBody {
  mode: AiMode;
  text: string;
}

export type AiResponseBody =
  | {
      success: true;
      result: string;
      model?: string;
    }
  | {
      success: false;
      error: string;
    };

export interface AiProviderConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  timeoutMs: number;
  maxOutputTokens: number;
}

export interface AiProvider {
  name: string;
  execute(mode: AiMode, text: string, config: AiProviderConfig): Promise<string>;
}
