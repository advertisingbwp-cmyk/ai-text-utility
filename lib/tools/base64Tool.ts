/**
 * Base64 Encoder / Decoder
 * Fully Unicode (UTF-8) compliant using TextEncoder and TextDecoder.
 * Supports standard and URL-safe Base64 variants.
 */

export interface Base64Options {
  mode: "encode" | "decode";
  urlSafe?: boolean;
}

export interface Base64Result {
  result: string;
  error?: string;
}

/**
 * Encodes text into UTF-8 Base64 string.
 */
export function encodeBase64(text: string, urlSafe = false): string {
  if (!text) return "";

  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  let base64 = btoa(binary);

  if (urlSafe) {
    base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  return base64;
}

/**
 * Decodes standard or URL-safe Base64 string back into UTF-8 text.
 */
export function decodeBase64(base64Str: string): { result: string; error?: string } {
  if (!base64Str) return { result: "" };

  try {
    let clean = base64Str.trim();

    // Convert URL-safe characters back to standard Base64
    clean = clean.replace(/-/g, "+").replace(/_/g, "/");

    // Add necessary padding if missing
    while (clean.length % 4 !== 0) {
      clean += "=";
    }

    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const decoded = new TextDecoder().decode(bytes);
    return { result: decoded };
  } catch {
    return {
      result: "",
      error: "Invalid Base64 input: String contains invalid characters or corrupted padding.",
    };
  }
}

/**
 * Combined entry point for Base64 transformation.
 */
export function transformBase64(text: string, options: Base64Options): Base64Result {
  if (options.mode === "encode") {
    return { result: encodeBase64(text, options.urlSafe) };
  } else {
    return decodeBase64(text);
  }
}
