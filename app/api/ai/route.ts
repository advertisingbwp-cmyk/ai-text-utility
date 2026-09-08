import { NextResponse } from "next/server";
import { isAllowedAiMode, ALLOWED_AI_MODES, AiMode, AiResponseBody } from "@/lib/ai/types";
import { getAiProvider } from "@/lib/ai/provider";
import { globalAiRateLimiter } from "@/lib/ai/rateLimiter";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse<AiResponseBody>> {
  try {
    // 1. IP-based Abuse Protection & Rate Limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = (forwarded ? forwarded.split(",")[0].trim() : realIp) || "127.0.0.1";

    const rateLimit = globalAiRateLimiter.check(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Too many AI requests from this IP. Please wait a minute before trying again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
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
      temperature: isNaN(envTemp) ? 1.0 : envTemp,
    });

    return NextResponse.json({
      success: true,
      result,
      model,
    });
  } catch (err: unknown) {
    // Sanitized error logging without logging full user text
    const message = err instanceof Error ? err.message : "An unexpected server error occurred.";
    console.error("[AI Route Error]:", message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
