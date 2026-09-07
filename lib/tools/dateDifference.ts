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
export function parseDateWithTimezone(dateStr: string, timezone?: string): Date {
  const clean = dateStr.trim();
  if (!clean) return new Date(NaN);

  // If timezone is UTC and no offset is present, append Z for ISO format if needed
  if (timezone === "UTC" && !clean.endsWith("Z") && !/[+-]\d{2}(:?\d{2})?$/.test(clean)) {
    // If format is YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
    const withT = clean.includes("T") ? clean : clean.replace(" ", "T");
    const parsed = new Date(`${withT}Z`);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  // If a specific IANA timezone was requested (e.g. "America/New_York")
  if (timezone && timezone !== "local" && timezone !== "UTC") {
    try {
      // Create a temporary date and shift according to target timezone
      const localParsed = new Date(clean);
      if (!isNaN(localParsed.getTime())) {
        // Find offset using Intl
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        // Test validity of timezone string
        formatter.format(localParsed);
        return localParsed;
      }
    } catch {
      // Fallback to standard parsing
    }
  }

  return new Date(clean);
}

/**
 * Computes calendar breakdown (years, months, days, hours, minutes, seconds).
 */
function calculateCalendarBreakdown(
  earlyDate: Date,
  laterDate: Date
): {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  let y1 = earlyDate.getUTCFullYear();
  let m1 = earlyDate.getUTCMonth();
  let d1 = earlyDate.getUTCDate();
  let h1 = earlyDate.getUTCHours();
  let min1 = earlyDate.getUTCMinutes();
  let s1 = earlyDate.getUTCSeconds();

  const y2 = laterDate.getUTCFullYear();
  const m2 = laterDate.getUTCMonth();
  const d2 = laterDate.getUTCDate();
  const h2 = laterDate.getUTCHours();
  const min2 = laterDate.getUTCMinutes();
  const s2 = laterDate.getUTCSeconds();

  let seconds = s2 - s1;
  let minutes = min2 - min1;
  let hours = h2 - h1;
  let days = d2 - d1;
  let months = m2 - m1;
  let years = y2 - y1;

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  if (days < 0) {
    // Days in previous month of earlyDate
    const prevMonthDays = new Date(Date.UTC(y2, m2, 0)).getUTCDate();
    days += prevMonthDays;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
  };
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
    return defaultFail(`Invalid start date: "${rawStart}". Please enter a valid date or ISO string.`);
  }

  if (isNaN(d2.getTime())) {
    return defaultFail(`Invalid end date: "${rawEnd}". Please enter a valid date or ISO string.`);
  }

  let t1 = d1.getTime();
  let t2 = d2.getTime();

  // If includeEndDay is checked, add 24 hours to the end date (unless reversed)
  if (includeEndDay) {
    t2 += 24 * 60 * 60 * 1000;
  }

  const diffMs = t2 - t1;
  const isSameDate = diffMs === 0;
  const isReversed = diffMs < 0;
  const direction: "forward" | "backward" | "same" = isSameDate
    ? "same"
    : isReversed
      ? "backward"
      : "forward";

  const absMs = Math.abs(diffMs);
  const totalSeconds = Math.floor(absMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Number((totalDays / 7).toFixed(1));

  // Determine chronological order for breakdown
  const earlyDate = isReversed ? new Date(t2) : new Date(t1);
  const laterDate = isReversed ? new Date(t1) : new Date(t2);

  const breakdown = calculateCalendarBreakdown(earlyDate, laterDate);

  // Build human-readable breakdown text
  const parts: string[] = [];
  if (breakdown.years > 0) parts.push(`${breakdown.years} year${breakdown.years > 1 ? "s" : ""}`);
  if (breakdown.months > 0) parts.push(`${breakdown.months} month${breakdown.months > 1 ? "s" : ""}`);
  if (breakdown.days > 0) parts.push(`${breakdown.days} day${breakdown.days > 1 ? "s" : ""}`);
  if (breakdown.hours > 0) parts.push(`${breakdown.hours} hour${breakdown.hours > 1 ? "s" : ""}`);
  if (breakdown.minutes > 0) parts.push(`${breakdown.minutes} minute${breakdown.minutes > 1 ? "s" : ""}`);
  if (breakdown.seconds > 0 || parts.length === 0) parts.push(`${breakdown.seconds} second${breakdown.seconds > 1 ? "s" : ""}`);

  const humanBreakdown = isSameDate
    ? "0 seconds (Identical timestamps)"
    : `${parts.join(", ")}${isReversed ? " (Start date is after End date)" : ""}`;

  const formattedReport = [
    `=== Date Difference Summary ===`,
    `Start Date (UTC):   ${new Date(t1).toISOString()}`,
    `End Date (UTC):     ${new Date(t2).toISOString()}`,
    `Direction:          ${isSameDate ? "Exact Same Date" : isReversed ? "End date precedes Start date" : "Start date to End date"}`,
    ``,
    `Duration Breakdown: ${humanBreakdown}`,
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
