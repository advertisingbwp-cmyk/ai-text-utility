/**
 * Cryptographic Hash Generator
 * Uses Web Crypto API (crypto.subtle.digest).
 * Supports SHA-256, SHA-1, SHA-384, and SHA-512.
 * Includes security warnings for legacy algorithms like SHA-1.
 */

export type HashAlgorithm = "SHA-256" | "SHA-1" | "SHA-384" | "SHA-512";

export interface HashOptions {
  algorithm?: HashAlgorithm;
  uppercase?: boolean;
}

export interface HashResult {
  hash: string;
  algorithm: HashAlgorithm;
  byteLength: number;
  warning?: string;
}

/**
 * Computes cryptographic hash using Web Crypto API.
 */
export async function generateHash(
  text: string,
  options: HashOptions = {}
): Promise<HashResult> {
  const { algorithm = "SHA-256", uppercase = false } = options;

  if (!text) {
    return {
      hash: "",
      algorithm,
      byteLength: 0,
      warning:
        algorithm === "SHA-1"
          ? "SHA-1 is cryptographically weak and deprecated for security purposes. Use SHA-256 or stronger."
          : undefined,
    };
  }

  // Ensure crypto.subtle exists in current environment
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("Web Crypto API (crypto.subtle) is not available in this environment.");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  let hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  if (uppercase) {
    hashHex = hashHex.toUpperCase();
  }

  let warning: string | undefined;
  if (algorithm === "SHA-1") {
    warning =
      "Security Notice: SHA-1 is cryptographically broken and vulnerable to collision attacks. It is NOT recommended for security, digital signatures, or password hashing. It is provided here only for legacy checksum and Git commit hash verification.";
  }

  return {
    hash: hashHex,
    algorithm,
    byteLength: hashBuffer.byteLength,
    warning,
  };
}
