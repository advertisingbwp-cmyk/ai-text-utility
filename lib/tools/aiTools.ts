/**
 * Client-side AI Tool Adapter
 * Dispatches requests to /api/ai securely without exposing credentials.
 */

import type { AiMode, AiResponseBody } from "../ai/types.ts";

export const SLUG_TO_AI_MODE: Record<string, AiMode> = {
  "ai-grammar": "grammar",
  "ai-professional": "professional",
  "ai-friendly": "friendly",
  "ai-summarize": "summarize",
  "ai-paraphrase": "paraphrase",
  "ai-expand": "expand",
};

export async function requestAiTool(mode: AiMode, text: string): Promise<string> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mode, text }),
  });

  const data: AiResponseBody = await response.json().catch(() => ({
    success: false,
    error: `HTTP ${response.status}: Failed to parse response from server.`,
  }));

  if (!data.success) {
    throw new Error(data.error || "AI transformation failed.");
  }

  return data.result;
}
