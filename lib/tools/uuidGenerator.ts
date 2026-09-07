/**
 * UUID / GUID Generator
 * Generates RFC 4122 v4 UUIDs using crypto.randomUUID() with crypto.getRandomValues fallback.
 */

export interface UuidGeneratorOptions {
  count?: number;
  uppercase?: boolean;
  removeHyphens?: boolean;
}

/**
 * Fallback generator using crypto.getRandomValues for RFC 4122 v4 compliant UUID.
 */
function generateFallbackUuid(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);

  // Set version 4: bits 12-15 of time_hi_and_version to 0100
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set variant RFC 4122: bits 6-7 of clock_seq_hi_and_reserved to 01
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Generates one or more UUIDs.
 */
export function generateUuids(options: UuidGeneratorOptions = {}): string[] {
  const { count = 1, uppercase = false, removeHyphens = false } = options;
  const validCount = Math.max(1, Math.min(100, count));
  const uuids: string[] = [];

  const hasRandomUuid = typeof globalThis.crypto?.randomUUID === "function";

  for (let i = 0; i < validCount; i++) {
    let uuid = hasRandomUuid
      ? globalThis.crypto.randomUUID()
      : generateFallbackUuid();

    if (removeHyphens) {
      uuid = uuid.replace(/-/g, "");
    }

    if (uppercase) {
      uuid = uuid.toUpperCase();
    }

    uuids.push(uuid);
  }

  return uuids;
}
