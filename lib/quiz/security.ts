import crypto from "crypto";

const PIN_SALT = process.env.QUIZ_PIN_SALT || "quiz_secure_salt_2026";

/**
 * Creates a deterministic SHA-256 hash of the creator's PIN with salt.
 */
export function hashPin(pin: string): string {
  const clean = pin.trim();
  return crypto.createHash("sha256").update(`${PIN_SALT}:${clean}`).digest("hex");
}

/**
 * Verifies if entered PIN matches stored hash.
 */
export function verifyPin(enteredPin: string, storedHash: string): boolean {
  if (!enteredPin || !storedHash) return false;
  const hash = hashPin(enteredPin);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}

/**
 * Generates an unguessable 32-character hex secret token for the creator.
 */
export function generateCreatorToken(): string {
  return "adm_" + crypto.randomBytes(16).toString("hex");
}

/**
 * In-memory brute force rate limiter for PIN verification: max 5 attempts per IP per 10 minutes.
 */
const pinAttempts = new Map<string, { count: number; resetAt: number }>();

export function checkPinRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = pinAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    pinAttempts.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) {
    return false;
  }
  entry.count++;
  return true;
}

/**
 * Compact URL-safe Base64 encoding for self-contained quiz payload fallback.
 */
export function encodeQuizPayload(payload: unknown): string {
  const json = JSON.stringify(payload);
  return Buffer.from(json).toString("base64url");
}

export function decodeQuizPayload<T>(token: string): T | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
