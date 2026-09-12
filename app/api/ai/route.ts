import { NextResponse } from "next/server";
import { isAllowedAiMode, ALLOWED_AI_MODES, AiMode, AiResponseBody } from "@/lib/ai/types";
import { getAiProvider, AiProviderError, redactSensitiveText } from "@/lib/ai/provider";
import { getAiRateLimiter } from "@/lib/ai/rateLimiter";
import { extractClientIp } from "@/lib/ai/ip";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse<AiResponseBody>> {
  try {
    // 1. IP-based Abuse Protection & Distributed/In-Memory Rate Limiting
    const clientIp = extractClientIp(req.headers);
    const rateLimiter = getAiRateLimiter();
    const rateLimit = await rateLimiter.check(clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Too many AI requests. Please wait a moment before trying again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil((Date.now() + rateLimit.resetMs) / 1000).toString(),
          },
        }
      );
    }

    // 2. Parse and Validate Request Payload
    let body: Record<string, unknown> | null = null;
    try {
      const parsed = await req.json();
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        body = parsed as Record<string, unknown>;
      }
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload. Expected JSON object with 'mode' and 'text'.",
        },
        { status: 400 }
      );
    }

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body. Expected a JSON object.",
        },
        { status: 400 }
      );
    }

    // Support 'mode' with fallback to 'action'
    const mode = typeof body.mode === "string" ? body.mode : typeof body.action === "string" ? body.action : undefined;
    const text = body.text;

    // 3. Strict Mode Validation
    if (!mode || !isAllowedAiMode(mode)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid or missing mode '${String(mode)}'. Allowed modes: ${ALLOWED_AI_MODES.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    // 4. Input Text Validation & Length Constraints
    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide valid, non-empty text to process.",
        },
        { status: 400 }
      );
    }

    const maxInputChars = parseInt(process.env.AI_MAX_INPUT_CHARS || "10000", 10);
    const limit = isNaN(maxInputChars) ? 10000 : maxInputChars;

    if (text.length > limit) {
      return NextResponse.json(
        {
          success: false,
          error: `Input text length (${text.length.toLocaleString()} chars) exceeds the maximum allowed limit of ${limit.toLocaleString()} characters.`,
        },
        { status: 413 }
      );
    }

    // 5. Server-Side Credentials & Config
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.AI_API_KEY ||
      process.env.EXPLABS_API_KEY;

    if (!apiKey) {
      console.error("[AI Route Error]: AI service credentials missing (GEMINI_API_KEY not configured).");
      return NextResponse.json(
        {
          success: false,
          error: "AI service is currently unconfigured. Set GEMINI_API_KEY in environment variables.",
        },
        { status: 503 }
      );
    }

    const baseUrl =
      process.env.AI_BASE_URL ||
      "https://generativelanguage.googleapis.com/v1beta";

    const model = process.env.AI_MODEL || "gemini-flash-latest";
    const timeoutMs = parseInt(process.env.AI_TIMEOUT_MS || "25000", 10);
    const maxOutputTokens = parseInt(process.env.AI_MAX_OUTPUT_TOKENS || "2000", 10);
    const envTemp = process.env.AI_TEMPERATURE ? parseFloat(process.env.AI_TEMPERATURE) : 0.7;

    // 6. Execute via Pluggable Provider Layer
    const provider = getAiProvider();
    const result = await provider.execute(mode as AiMode, text, {
      apiKey,
      baseUrl,
      model,
      timeoutMs: isNaN(timeoutMs) ? 25000 : timeoutMs,
      maxOutputTokens: isNaN(maxOutputTokens) ? 2000 : maxOutputTokens,
      temperature: isNaN(envTemp) ? 0.7 : envTemp,
    });

    return NextResponse.json(
      {
        success: true,
        result,
        model,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      }
    );
  } catch (err: unknown) {
    let statusCode = 500;
    let clientMessage = "An error occurred while processing your request with AI.";
    const rawLog = err instanceof Error ? err.message : String(err);

    if (err instanceof AiProviderError) {
      statusCode = err.status;
      if (statusCode === 400) {
        clientMessage = "Invalid request payload sent to the AI service.";
      } else if (statusCode === 401 || statusCode === 403) {
        clientMessage = "AI service authentication error. Please check server API key configuration.";
      } else if (statusCode === 429) {
        clientMessage = "Rate limit exceeded from upstream AI provider. Please wait a moment.";
      } else if (statusCode === 503 || statusCode === 504) {
        clientMessage = "AI service is temporarily unavailable or timed out. Please try again shortly.";
      } else {
        clientMessage = "The AI provider encountered an issue while processing your text.";
      }
    } else if (err instanceof Error && err.name === "AbortError") {
      statusCode = 504;
      clientMessage = "AI request timed out. Please try again with shorter text.";
    }

    // Redact any sensitive tokens or keys before logging server-side
    console.error(`[AI Route Error] [Status ${statusCode}]:`, redactSensitiveText(rawLog));

    return NextResponse.json(
      {
        success: false,
        error: clientMessage,
      },
      { status: statusCode }
    );
  }
}
