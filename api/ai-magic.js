// Vercel Serverless Function: api/ai-magic.js
export default async function handler(req, res) {
  // Allow CORS for local dev & production
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey =
    process.env.EXPLABS_API_KEY ||
    process.env.EXPERIENTIAL_API_KEY ||
    process.env.EXPERIENTIAL_LABS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error:
        "Experiential Labs API Key not found. Please configure EXPLABS_API_KEY in your Vercel Environment Variables.",
    });
  }

  try {
    const { action, text, targetTone, customPrompt, model: requestedModel } = req.body || {};

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Please enter text to process." });
    }

    // Prompts mapping based on tool action
    const systemPrompts = {
      grammar:
        "You are an expert copyeditor and proofreader. Correct all spelling, punctuation, capitalization, and grammar mistakes in the provided text while strictly preserving its original meaning and voice. Return ONLY the corrected text without any introductory pleasantries, explanations, or quotes.",
      professional:
        "You are an executive business communications expert. Rewrite the text into a clear, professional, authoritative, and polished tone suitable for formal emails, business proposals, and workplace communications. Return ONLY the rewritten text without conversational filler.",
      friendly:
        "You are an engaging and warm communicator. Rewrite the text in a friendly, conversational, warm, and approachable tone while keeping the core message intact. Return ONLY the rewritten text.",
      summarize:
        "You are a master summarizer. Summarize the key points of the text into concise, high-impact bullet points followed by a one-sentence core takeaway. Be clear, accurate, and direct. Return ONLY the summary.",
      expand:
        "You are an articulate content writer. Expand, elaborate, and add depth to the provided text. Provide helpful context, clear explanations, and structure without unnecessary fluff. Return ONLY the expanded text.",
      paraphrase:
        "You are a creative linguist. Paraphrase and rewrite the text with fresh vocabulary and varied sentence structure while maintaining the exact original meaning. Ensure natural fluency and high readability. Return ONLY the paraphrased text.",
      persuasive:
        "You are a master copywriter. Rewrite the text to be compelling, persuasive, and action-oriented, highlighting benefits and driving engagement. Return ONLY the rewritten text.",
      urdu_fix:
        "You are a native Urdu language specialist. Fix grammar, spelling, and phrasing in Roman Urdu or Urdu script. Return ONLY the improved version.",
    };

    const systemPrompt =
      systemPrompts[action] ||
      customPrompt ||
      "You are a helpful AI text assistant. Improve and process the following text as requested. Return only the final output.";

    // Default to fast, capable model on Experiential Labs
    const model = requestedModel || "claude-sonnet-5";

    const response = await fetch("https://api.experientiallabs.ai/v1/chat/completions", {
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
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Experiential Labs API Error:", response.status, errBody);

      // If specific model fails, try fallback
      if (model !== "gpt-5.6-sol" && response.status === 404) {
        const fallbackRes = await fetch("https://api.experientiallabs.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-5.6-sol",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: text },
            ],
          }),
        });

        if (fallbackRes.ok) {
          const fbData = await fallbackRes.json();
          const content = fbData?.choices?.[0]?.message?.content || "";
          return res.status(200).json({ result: content, model: "gpt-5.6-sol" });
        }
      }

      return res.status(response.status).json({
        error: `Experiential Labs AI returned error (${response.status}): ${errBody}`,
      });
    }

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content || "";

    return res.status(200).json({
      success: true,
      result: result.trim(),
      model: data?.model || model,
    });
  } catch (error) {
    console.error("Internal Server Error in ai-magic:", error);
    return res.status(500).json({
      error: "Internal server error: " + (error.message || String(error)),
    });
  }
}
