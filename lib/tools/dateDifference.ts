import { Temporal } from "@js-temporal/polyfill";
import { parseStrictDate } from "./dateParsing.ts";

/**
 * Date Difference Calculator
 * Computes exact duration, total days, hours, minutes, seconds,
 * and human-readable breakdown between two dates with full timezone and daylight saving awareness.
 */

export interface DateDifferenceOptions {
  startDate: string;
  endDate: string;
  startTimezone?: string; // "UTC", "local", or IANA timezone name
  endTimezone?: string;   // "UTC", "local", or IANA timezone name
  includeEndDay?: boolean; // Whether to add 1 full day for inclusive counting
}

export interface DateDifferenceResult {
  isValid: boolean;
  isSameDate: boolean;
  isReversed: boolean;
  direction: "forward" | "backward" | "same";
  startDateIso: string;
  endDateIso: string;
  totalMilliseconds: number;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  totalWeeks: number;
  breakdown: {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  humanBreakdown: string;
  formattedReport: string;
  error?: string;
}

/**
 * Parses a date string taking into account an explicit timezone if provided and not already specified in the string.
 */
export const parseDateWithTimezone = parseStrictDate;

/** UTC calendar decomposition: whole clamped months, then remaining days/time. */
function calculateCalendarBreakdown(earlyDate: Date, laterDate: Date) {
  const early = Temporal.PlainDateTime.from(earlyDate.toISOString().slice(0, -1));
  const later = Temporal.PlainDateTime.from(laterDate.toISOString().slice(0, -1));
  let months = (later.year - early.year) * 12 + later.month - early.month;
  let anchor = early.add({ months }, { overflow: "constrain" });
  if (Temporal.PlainDateTime.compare(anchor, later) > 0) {
    months -= 1;
    anchor = early.add({ months }, { overflow: "constrain" });
  }
  const rest = anchor.until(later, { largestUnit: "days" });
  return { years: Math.floor(months / 12), months: months % 12,
    days: rest.days, hours: rest.hours, minutes: rest.minutes, seconds: rest.seconds };
}

/**
 * Main Date Difference calculation.
 */
export function calculateDateDifference(
  options: DateDifferenceOptions
): DateDifferenceResult {
  const {
    startDate: rawStart,
    endDate: rawEnd,
    startTimezone,
    endTimezone,
    includeEndDay = false,
  } = options;

  const defaultFail = (err: string): DateDifferenceResult => ({
    isValid: false,
    isSameDate: false,
    isReversed: false,
    direction: "same",
    startDateIso: "",
    endDateIso: "",
    totalMilliseconds: 0,
    totalSeconds: 0,
    totalMinutes: 0,
    totalHours: 0,
    totalDays: 0,
    totalWeeks: 0,
    breakdown: { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 },
    humanBreakdown: "",
    formattedReport: "",
    error: err,
  });

  if (!rawStart?.trim() || !rawEnd?.trim()) {
    return defaultFail("Please provide both a start date and an end date.");
  }

  const d1 = parseDateWithTimezone(rawStart, startTimezone);
  const d2 = parseDateWithTimezone(rawEnd, endTimezone);

  if (isNaN(d1.getTime())) {
    return defaultFail(`Invalid start date: "${rawStart}". Use YYYY-MM-DD or ISO date-time. Invalid dates, unknown zones and ambiguous/nonexistent local times are rejected; use an explicit offset for DST transitions.`);
  }

  if (isNaN(d2.getTime())) {
    return defaultFail(`Invalid end date: "${rawEnd}". Use YYYY-MM-DD or ISO date-time. Invalid dates, unknown zones and ambiguous/nonexistent local times are rejected; use an explicit offset for DST transitions.`);
  }

  const t1 = d1.getTime();
  const t2 = d2.getTime();

  const diffMs = t2 - t1;
  const isSameDate = diffMs === 0;
  const isReversed = diffMs < 0;
  const direction: "forward" | "backward" | "same" = isSameDate
    ? "same"
    : isReversed
      ? "backward"
      : "forward";

  const absMs = Math.abs(diffMs) + (includeEndDay ? 86400000 : 0);
  const totalSeconds = Math.floor(absMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Number((totalDays / 7).toFixed(1));

  // Determine chronological order for breakdown
  const earlyDate = isReversed ? new Date(t2) : new Date(t1);
  const laterDate = new Date(Math.max(t1, t2) + (includeEndDay ? 86400000 : 0));

  const breakdown = calculateCalendarBreakdown(earlyDate, laterDate);

  // Build human-readable breakdown text
  const parts: string[] = [];
  if (breakdown.years > 0) parts.push(`${breakdown.years} year${breakdown.years > 1 ? "s" : ""}`);
  if (breakdown.months > 0) parts.push(`${breakdown.months} month${breakdown.months > 1 ? "s" : ""}`);
  if (breakdown.days > 0) parts.push(`${breakdown.days} day${breakdown.days > 1 ? "s" : ""}`);
  if (breakdown.hours > 0) parts.push(`${breakdown.hours} hour${breakdown.hours > 1 ? "s" : ""}`);
  if (breakdown.minutes > 0) parts.push(`${breakdown.minutes} minute${breakdown.minutes > 1 ? "s" : ""}`);
  if (breakdown.seconds > 0 || parts.length === 0) parts.push(`${breakdown.seconds} second${breakdown.seconds > 1 ? "s" : ""}`);

  const humanBreakdown = isSameDate && !includeEndDay
    ? "0 seconds (Identical timestamps)"
    : `${parts.join(", ")}${isReversed ? " (Start date is after End date)" : ""}`;

  const formattedReport = [
    `=== Date Difference Summary ===`,
    `Start Date (UTC):   ${new Date(t1).toISOString()}`,
    `End Date (UTC):     ${new Date(t2).toISOString()}`,
    `Direction:          ${isSameDate ? "Exact Same Date" : isReversed ? "End date precedes Start date" : "Start date to End date"}`,
    ``,
    `Duration Breakdown (UTC calendar): ${humanBreakdown}`,
    includeEndDay ? "Inclusive counting: adds 24 elapsed hours; input dates remain unchanged." : "Duration excludes the end instant.",
    ``,
    `Total Days:         ${totalDays.toLocaleString()} days`,
    `Total Weeks:        ${totalWeeks} weeks`,
    `Total Hours:        ${totalHours.toLocaleString()} hours`,
    `Total Minutes:      ${totalMinutes.toLocaleString()} minutes`,
    `Total Seconds:      ${totalSeconds.toLocaleString()} seconds`,
  ].join("\n");

  return {
    isValid: true,
    isSameDate,
    isReversed,
    direction,
    startDateIso: new Date(t1).toISOString(),
    endDateIso: new Date(t2).toISOString(),
    totalMilliseconds: absMs,
    totalSeconds,
    totalMinutes,
    totalHours,
    totalDays,
    totalWeeks,
    breakdown,
    humanBreakdown,
    formattedReport,
  };
}

/**
 * Helper to parse a combined dual-date string (e.g. "2026-01-01 to 2026-12-31" or newline-separated).
 */
export function parseDualDateString(input: string): { start: string; end: string } {
  const clean = input.trim();
  if (clean.includes("\n")) {
    const lines = clean.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    return { start: lines[0] || "", end: lines[1] || "" };
  }

  if (/\s+to\s+/i.test(clean)) {
    const parts = clean.split(/\s+to\s+/i);
    return { start: parts[0].trim(), end: parts[1].trim() };
  }

  if (clean.includes(" -> ")) {
    const parts = clean.split(" -> ");
    return { start: parts[0].trim(), end: parts[1].trim() };
  }

  if (clean.includes(" - ")) {
    const parts = clean.split(" - ");
    return { start: parts[0].trim(), end: parts[1].trim() };
  }

  return { start: clean, end: "" };
}
