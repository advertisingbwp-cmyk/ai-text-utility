/**
 * Unix Timestamp Converter
 * Pure TypeScript logic for bidirectional conversion between epoch timestamps and human dates.
 * Handles seconds (10 digits), milliseconds (13 digits), timezones, and range validation.
 */

export interface UnixTimestampOptions {
  mode?: "auto" | "timestamp-to-date" | "date-to-timestamp";
  unit?: "auto" | "seconds" | "milliseconds";
  timezone?: string; // "UTC", "local", or IANA timezone name e.g. "America/New_York"
}

export interface UnixTimestampResult {
  isValid: boolean;
  input: string;
  detectedMode: "timestamp-to-date" | "date-to-timestamp";
  usedUnit: "seconds" | "milliseconds";
  seconds: number;
  milliseconds: number;
  iso: string;
  utc: string;
  local: string;
  timezoneFormatted?: string;
  relativeTime: string;
  formattedReport: string;
  error?: string;
}

// Practical year boundaries for standard web dates (Year 0 to 9999)
const MIN_SAFE_TIMESTAMP_MS = -62167219200000; // 0001-01-01T00:00:00Z
const MAX_SAFE_TIMESTAMP_MS = 253402300799000; // 9999-12-31T23:59:59Z

/**
 * Formats a relative duration into human-readable text (e.g. "2 hours ago", "in 3 days").
 */
export function formatRelativeTime(targetDate: Date, baseDate = new Date()): string {
  const diffMs = targetDate.getTime() - baseDate.getTime();
  const isFuture = diffMs > 0;
  const absSec = Math.round(Math.abs(diffMs) / 1000);

  if (absSec < 5) return "just now";
  if (absSec < 60) return isFuture ? `in ${absSec} seconds` : `${absSec} seconds ago`;

  const absMin = Math.floor(absSec / 60);
  if (absMin < 60) return isFuture ? `in ${absMin} minute${absMin > 1 ? "s" : ""}` : `${absMin} minute${absMin > 1 ? "s" : ""} ago`;

  const absHours = Math.floor(absMin / 60);
  if (absHours < 24) return isFuture ? `in ${absHours} hour${absHours > 1 ? "s" : ""}` : `${absHours} hour${absHours > 1 ? "s" : ""} ago`;

  const absDays = Math.floor(absHours / 24);
  if (absDays < 30) return isFuture ? `in ${absDays} day${absDays > 1 ? "s" : ""}` : `${absDays} day${absDays > 1 ? "s" : ""} ago`;

  const absMonths = Math.floor(absDays / 30);
  if (absMonths < 12) return isFuture ? `in ${absMonths} month${absMonths > 1 ? "s" : ""}` : `${absMonths} month${absMonths > 1 ? "s" : ""} ago`;

  const absYears = Math.floor(absDays / 365);
  return isFuture ? `in ${absYears} year${absYears > 1 ? "s" : ""}` : `${absYears} year${absYears > 1 ? "s" : ""} ago`;
}

/**
 * Main conversion function.
 */
export function convertUnixTimestamp(
  rawInput: string,
  options: UnixTimestampOptions = {}
): UnixTimestampResult {
  const input = rawInput.trim();

  const defaultFailResult = (err: string): UnixTimestampResult => ({
    isValid: false,
    input,
    detectedMode: "timestamp-to-date",
    usedUnit: "seconds",
    seconds: 0,
    milliseconds: 0,
    iso: "",
    utc: "",
    local: "",
    relativeTime: "",
    formattedReport: "",
    error: err,
  });

  if (!input) {
    return defaultFailResult("Please provide a Unix timestamp or date string to convert.");
  }

  const {
    mode = "auto",
    unit = "auto",
    timezone = "local",
  } = options;

  // Detect mode: check if input is purely numeric (supports negative sign)
  const isNumeric = /^-?\d+(\.\d+)?$/.test(input);
  const detectedMode: "timestamp-to-date" | "date-to-timestamp" =
    mode === "auto"
      ? isNumeric
        ? "timestamp-to-date"
        : "date-to-timestamp"
      : mode;

  let targetDate: Date;
  let usedUnit: "seconds" | "milliseconds" = "seconds";
  let seconds = 0;
  let milliseconds = 0;

  if (detectedMode === "timestamp-to-date") {
    if (!isNumeric) {
      return defaultFailResult(`Invalid numeric timestamp: "${input}". Expected integer or decimal epoch value.`);
    }

    const numericVal = parseFloat(input);

    if (isNaN(numericVal)) {
      return defaultFailResult("Timestamp evaluates to NaN.");
    }

    // Determine whether input represents seconds or milliseconds
    if (unit === "seconds") {
      usedUnit = "seconds";
      seconds = Math.floor(numericVal);
      milliseconds = Math.round(numericVal * 1000);
    } else if (unit === "milliseconds") {
      usedUnit = "milliseconds";
      milliseconds = Math.round(numericVal);
      seconds = Math.floor(numericVal / 1000);
    } else {
      // Auto-detect unit: if 12+ digits or > 30 billion, treat as milliseconds
      if (Math.abs(numericVal) > 30000000000 || input.replace(/^-/, "").length >= 12) {
        usedUnit = "milliseconds";
        milliseconds = Math.round(numericVal);
        seconds = Math.floor(numericVal / 1000);
      } else {
        usedUnit = "seconds";
        seconds = Math.floor(numericVal);
        milliseconds = Math.round(numericVal * 1000);
      }
    }

    // Practical range check
    if (milliseconds < MIN_SAFE_TIMESTAMP_MS || milliseconds > MAX_SAFE_TIMESTAMP_MS) {
      return defaultFailResult(
        `Timestamp out of practical range (Years 0001 - 9999). Received ${usedUnit}: ${numericVal}.`
      );
    }

    targetDate = new Date(milliseconds);
  } else {
    // date-to-timestamp mode
    targetDate = new Date(input);

    if (isNaN(targetDate.getTime())) {
      return defaultFailResult(
        `Unable to parse date string: "${input}". Supported formats include ISO 8601 (2026-09-07T14:30:00Z), RFC 2822, or standard date formats.`
      );
    }

    milliseconds = targetDate.getTime();
    seconds = Math.floor(milliseconds / 1000);
    usedUnit = unit === "milliseconds" ? "milliseconds" : "seconds";

    if (milliseconds < MIN_SAFE_TIMESTAMP_MS || milliseconds > MAX_SAFE_TIMESTAMP_MS) {
      return defaultFailResult(
        `Date "${input}" is outside practical Gregorian calendar limits (Years 0001 - 9999).`
      );
    }
  }

  // Format outputs
  const iso = targetDate.toISOString();
  const utc = targetDate.toUTCString();
  const local = targetDate.toLocaleString();
  const relativeTime = formatRelativeTime(targetDate);

  let timezoneFormatted: string | undefined;
  if (timezone && timezone !== "local" && timezone !== "UTC") {
    try {
      timezoneFormatted = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        dateStyle: "full",
        timeStyle: "long",
      }).format(targetDate);
    } catch {
      timezoneFormatted = `(Timezone "${timezone}" not recognized)`;
    }
  }

  const formattedReport = [
    `=== Unix Timestamp Conversion ===`,
    `Epoch (Seconds):       ${seconds}`,
    `Epoch (Milliseconds):  ${milliseconds}`,
    `Unit Detected/Used:    ${usedUnit}`,
    `ISO 8601:              ${iso}`,
    `UTC (GMT):             ${utc}`,
    `Local Time:            ${local}`,
    timezoneFormatted ? `Selected Timezone:     ${timezoneFormatted} (${timezone})` : null,
    `Relative to Now:       ${relativeTime}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    isValid: true,
    input,
    detectedMode,
    usedUnit,
    seconds,
    milliseconds,
    iso,
    utc,
    local,
    timezoneFormatted,
    relativeTime,
    formattedReport,
  };
}

/**
 * Returns current timestamp information.
 */
export function getCurrentTimestamp(): {
  seconds: number;
  milliseconds: number;
  iso: string;
} {
  const now = Date.now();
  return {
    seconds: Math.floor(now / 1000),
    milliseconds: now,
    iso: new Date(now).toISOString(),
  };
}
