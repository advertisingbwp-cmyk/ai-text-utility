/**
 * JWT (JSON Web Token) Decoder
 * Pure client-side decoder.
 *
 * CRITICAL SECURITY NOTICE:
 * JWT decoding extracts unverified claims. It does NOT verify the cryptographic
 * signature or validate token authenticity. Never trust unverified claims for
 * authorization decisions.
 */

export interface JwtClaims {
  [key: string]: unknown;
}

export interface JwtDecodeResult {
  isValid: boolean;
  header: JwtClaims | null;
  payload: JwtClaims | null;
  signature: string;
  formattedHeader: string;
  formattedPayload: string;
  issuedAt?: string;
  expiresAt?: string;
  isExpired?: boolean;
  algorithm?: string;
  warning: string;
  error?: string;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function decodeJwt(token: string): JwtDecodeResult {
  const defaultWarning =
    "⚠️ SECURITY WARNING: Decoding a JWT merely parses the Base64URL-encoded header and payload. It DOES NOT verify the signature, ensure token integrity, or validate authenticity. Never make security decisions based solely on unverified client-side decoding.";

  if (!token || !token.trim()) {
    return {
      isValid: false,
      header: null,
      payload: null,
      signature: "",
      formattedHeader: "",
      formattedPayload: "",
      warning: defaultWarning,
    };
  }

  const cleanToken = token.trim();
  const parts = cleanToken.split(".");

  if (parts.length !== 3) {
    return {
      isValid: false,
      header: null,
      payload: null,
      signature: "",
      formattedHeader: "",
      formattedPayload: "",
      warning: defaultWarning,
      error: `Invalid JWT format: A valid JSON Web Token must contain exactly 3 dot-separated parts (Header, Payload, Signature). Found ${parts.length} parts.`,
    };
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  let headerObj: JwtClaims | null = null;
  let payloadObj: JwtClaims | null = null;

  try {
    const headerJson = base64UrlDecode(headerB64);
    headerObj = JSON.parse(headerJson);
  } catch (err) {
    return {
      isValid: false,
      header: null,
      payload: null,
      signature: signatureB64,
      formattedHeader: "",
      formattedPayload: "",
      warning: defaultWarning,
      error: `Failed to decode JWT Header: ${err instanceof Error ? err.message : "Malformed Base64URL or JSON"}`,
    };
  }

  try {
    const payloadJson = base64UrlDecode(payloadB64);
    payloadObj = JSON.parse(payloadJson);
  } catch (err) {
    return {
      isValid: false,
      header: headerObj,
      payload: null,
      signature: signatureB64,
      formattedHeader: JSON.stringify(headerObj, null, 2),
      formattedPayload: "",
      warning: defaultWarning,
      error: `Failed to decode JWT Payload: ${err instanceof Error ? err.message : "Malformed Base64URL or JSON"}`,
    };
  }

  // Inspect standard claims: exp, iat, alg
  let issuedAt: string | undefined;
  let expiresAt: string | undefined;
  let isExpired: boolean | undefined;

  if (payloadObj) {
    if (typeof payloadObj.iat === "number" && Number.isFinite(payloadObj.iat)) {
      try {
        issuedAt = new Date(payloadObj.iat * 1000).toISOString();
      } catch {
        // Ignore invalid range timestamp
      }
    }
    if (typeof payloadObj.exp === "number" && Number.isFinite(payloadObj.exp)) {
      try {
        const expDate = new Date(payloadObj.exp * 1000);
        expiresAt = expDate.toISOString();
        isExpired = Date.now() > expDate.getTime();
      } catch {
        // Ignore invalid range timestamp
      }
    }
  }

  const algorithm =
    headerObj && typeof headerObj.alg === "string" ? headerObj.alg : undefined;

  return {
    isValid: true,
    header: headerObj,
    payload: payloadObj,
    signature: signatureB64,
    formattedHeader: JSON.stringify(headerObj, null, 2),
    formattedPayload: JSON.stringify(payloadObj, null, 2),
    issuedAt,
    expiresAt,
    isExpired,
    algorithm,
    warning: defaultWarning,
  };
}
