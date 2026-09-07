/**
 * URL Encoder / Decoder
 * Supports component and full URI encoding/decoding with error handling for malformed input.
 */

export interface UrlEncoderOptions {
  mode: "encode" | "decode";
  scope?: "component" | "full";
}

export interface UrlEncoderResult {
  result: string;
  error?: string;
}

export function transformUrl(
  text: string,
  options: UrlEncoderOptions = { mode: "encode", scope: "component" }
): UrlEncoderResult {
  if (!text) return { result: "" };

  const { mode = "encode", scope = "component" } = options;

  if (mode === "encode") {
    try {
      const encoded =
        scope === "full" ? encodeURI(text) : encodeURIComponent(text);
      return { result: encoded };
    } catch (err: unknown) {
      return {
        result: "",
        error: `URL encoding failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  } else {
    try {
      const decoded =
        scope === "full" ? decodeURI(text) : decodeURIComponent(text);
      return { result: decoded };
    } catch (err: unknown) {
      return {
        result: "",
        error: `Malformed URL encoding: Unable to decode sequence (${err instanceof Error ? err.message : String(err)}). Ensure percent-encoded hex characters (e.g. %20) are complete and valid UTF-8.`,
      };
    }
  }
}
