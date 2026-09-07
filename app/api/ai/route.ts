import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.EXPLABS_API_KEY ||
      process.env.EXPERIENTIAL_API_KEY ||
      process.env.EXPERIENTIAL_LABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Experiential Labs API Key not configured. Please set EXPLABS_API_KEY in environment variables.",
        },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const { action, text, model: requestedModel } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Please provide valid text to process." },
        { status: 400 }
      );
    }

    if (text.length > 30000) {
      return NextResponse.json(
        { error: "Input text exceeds maximum allowed limit (30,000 characters)." },
        { status: 413 }
      );
    }

    const systemPrompts: Record<string, string> = {
      grammar:
        "You are an expert copyeditor and proofreader. Correct all spelling, punctuation, capitalization, and grammar mistakes in the provided text while strictly preserving its original meaning and voice. Return ONLY the corrected text without any pleasantries, intro, or explanations.",
      professional:
        "You are an executive business communications expert. Rewrite the text into a clear, professional, authoritative, and polished tone suitable for formal workplace communications. Return ONLY the rewritten text.",
      friendly:
        "You are an engaging and warm communicator. Rewrite the text in a friendly, conversational, warm, and approachable tone while keeping the core message intact. Return ONLY the rewritten text.",
      summarize:
        "You are a master summarizer. Summarize the key points of the text into concise, high-impact bullet points followed by a one-sentence core takeaway. Return ONLY the summary.",
      expand:
        "You are an articulate content writer. Expand, elaborate, and add depth to the provided text. Provide helpful context and structure without fluff. Return ONLY the expanded text.",
      paraphrase:
        "You are a creative linguist. Paraphrase and rewrite the text with fresh vocabulary and varied sentence structure while maintaining the exact original meaning. Return ONLY the paraphrased text.",
    };

    const systemPrompt =
      systemPrompts[action] ||
      "You are a helpful AI text utility assistant. Improve the text as requested. Return ONLY the final output.";

    const model = requestedModel || "claude-sonnet-5";

    const response = await fetch(
      "https://api.experientiallabs.ai/v1/chat/completions",
      {
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
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        {
          error: `Upstream AI provider error (${response.status}): ${errText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      result: result.trim(),
      model: data?.model || model,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Internal Server Error: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
