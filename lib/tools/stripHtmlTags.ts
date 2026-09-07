export interface StripHtmlOptions {
  preserveLineBreaks?: boolean;
  decodeEntities?: boolean;
}

const ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&lsquo;": "‘",
  "&rsquo;": "’",
  "&mdash;": "—",
  "&ndash;": "–",
  "&hellip;": "…",
  "&bull;": "•",
};

export function stripHtmlTags(
  input: string,
  options: StripHtmlOptions = {}
): string {
  if (!input) return "";

  const preserveLineBreaks = options.preserveLineBreaks ?? true;
  const decodeEntities = options.decodeEntities ?? true;

  let text = input;

  // 1. Strip script and style contents completely
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // 2. Replace block tags with newlines or spaces to prevent word concatenation
  if (preserveLineBreaks) {
    text = text.replace(/<\/(?:p|div|h[1-6]|li|tr|blockquote|section|article)>/gi, "\n");
    text = text.replace(/<br\s*[\/]?>/gi, "\n");
    text = text.replace(/<\/(?:td|th)>/gi, "\t");
  } else {
    text = text.replace(/<\/(?:p|div|h[1-6]|li|tr|td|th|blockquote)>\s*/gi, " ");
    text = text.replace(/<br\s*[\/]?>/gi, " ");
  }

  // 3. Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // 4. Decode HTML entities
  if (decodeEntities) {
    for (const [entity, replacement] of Object.entries(ENTITY_MAP)) {
      text = text.replaceAll(entity, replacement);
    }
    // Decode decimal/hex numeric entities safely
    text = text.replace(/&#(\d+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 10))
    );
    text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    );
  }

  // 5. Clean up multiple newlines/whitespace
  if (preserveLineBreaks) {
    text = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l, idx, arr) => l !== "" || (idx > 0 && arr[idx - 1] !== ""))
      .join("\n");
  } else {
    text = text.replace(/\s+/g, " ").trim();
  }

  return text.trim();
}
