import { Temporal } from "@js-temporal/polyfill";

/**
 * Accept ISO dates and ISO date-times only; optional explicit Z/offset wins.
 * Date-only defaults to UTC; zone-less date-time defaults to the browser zone.
 * Explicit UTC/local/IANA selection applies to both. Reject DST gaps/overlaps.
 */
export function parseStrictDate(input: string, timezone?: string): Date {
  const clean = input.trim();
  const match = /^(\d{4}-\d{2}-\d{2})(?:[Tt ](\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?)([Zz]|[+-]\d{2}:?\d{2})?)?$/.exec(clean);
  if (!match) return new Date(NaN);
  try {
    const plain = Temporal.PlainDateTime.from(match[1] + "T" + (match[2] ?? "00:00:00"), { overflow: "reject" });
    // Temporal accepts leap second 60 by clamping it; our millisecond UI rejects it.
    if (match[2] && /:\d{2}:60(?:\.|$)/.test(match[2])) return new Date(NaN);
    let epoch: number;
    if (match[3]) {
      epoch = Temporal.Instant.from(plain.toString() + match[3].toUpperCase()).epochMilliseconds;
    } else {
      const zone = timezone === "local" || (!timezone && match[2])
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : timezone || "UTC";
      epoch = plain.toZonedDateTime(zone, { disambiguation: "reject" }).epochMilliseconds;
    }
    const date = new Date(epoch);
    return date.getUTCFullYear() >= 0 && date.getUTCFullYear() <= 9999 ? date : new Date(NaN);
  } catch {
    return new Date(NaN);
  }
}
