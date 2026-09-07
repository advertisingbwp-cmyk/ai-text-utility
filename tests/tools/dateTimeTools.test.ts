import test from "node:test";
import assert from "node:assert/strict";

import {
  convertUnixTimestamp,
  getCurrentTimestamp,
  formatRelativeTime,
} from "../../lib/tools/unixTimestamp.ts";

import {
  calculateDateDifference,
  parseDualDateString,
  parseDateWithTimezone,
} from "../../lib/tools/dateDifference.ts";

test("1. Unix Timestamp Converter - Seconds & Milliseconds", () => {
  // Empty input
  const empty = convertUnixTimestamp("");
  assert.equal(empty.isValid, false);
  assert.ok(empty.error);

  // 10-digit seconds
  const secResult = convertUnixTimestamp("1773000000");
  assert.equal(secResult.isValid, true);
  assert.equal(secResult.detectedMode, "timestamp-to-date");
  assert.equal(secResult.usedUnit, "seconds");
  assert.equal(secResult.seconds, 1773000000);
  assert.equal(secResult.milliseconds, 1773000000000);
  assert.ok(secResult.iso.startsWith("2026-03-08"));
  assert.ok(secResult.utc.includes("GMT"));

  // 13-digit milliseconds
  const msResult = convertUnixTimestamp("1773000000000");
  assert.equal(msResult.isValid, true);
  assert.equal(msResult.usedUnit, "milliseconds");
  assert.equal(msResult.seconds, 1773000000);

  // Explicit unit override
  const forcedSec = convertUnixTimestamp("1000", { unit: "seconds" });
  assert.equal(forcedSec.usedUnit, "seconds");
  assert.equal(forcedSec.milliseconds, 1000000);

  const forcedMs = convertUnixTimestamp("1000", { unit: "milliseconds" });
  assert.equal(forcedMs.usedUnit, "milliseconds");
  assert.equal(forcedMs.seconds, 1);
});

test("2. Unix Timestamp Converter - Date to Timestamp", () => {
  const dateStr = "2026-01-01T00:00:00.000Z";
  const res = convertUnixTimestamp(dateStr);
  assert.equal(res.isValid, true);
  assert.equal(res.detectedMode, "date-to-timestamp");
  assert.equal(res.iso, dateStr);
  assert.equal(res.seconds, 1767225600);
  assert.equal(res.milliseconds, 1767225600000);
});

test("3. Unix Timestamp Converter - Range and Error Handling", () => {
  // Non-numeric in timestamp mode
  const nonNum = convertUnixTimestamp("abc-xyz", { mode: "timestamp-to-date" });
  assert.equal(nonNum.isValid, false);
  assert.ok(nonNum.error?.includes("Invalid numeric timestamp"));

  // Outside practical calendar range (year > 9999)
  const hugeVal = convertUnixTimestamp("999999999999999");
  assert.equal(hugeVal.isValid, false);
  assert.ok(hugeVal.error?.includes("out of practical range"));

  // Invalid date string
  const badDate = convertUnixTimestamp("not-a-real-date", { mode: "date-to-timestamp" });
  assert.equal(badDate.isValid, false);
  assert.ok(badDate.error?.includes("Unable to parse date"));
});

test("4. Unix Timestamp Converter - Timezone & Helpers", () => {
  const res = convertUnixTimestamp("1767225600", { timezone: "America/New_York" });
  assert.equal(res.isValid, true);
  assert.ok(res.timezoneFormatted);
  assert.ok(res.formattedReport.includes("America/New_York"));

  const now = getCurrentTimestamp();
  assert.ok(now.seconds > 1700000000);
  assert.ok(now.milliseconds > 1700000000000);
  assert.ok(now.iso.includes("T"));

  const pastDate = new Date(Date.now() - 3600 * 2000);
  assert.ok(formatRelativeTime(pastDate).includes("hour"));
});

test("5. Date Difference Calculator - Standard Interval", () => {
  const diff = calculateDateDifference({
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-01-03T12:00:00Z",
  });

  assert.equal(diff.isValid, true);
  assert.equal(diff.isSameDate, false);
  assert.equal(diff.isReversed, false);
  assert.equal(diff.direction, "forward");
  assert.equal(diff.totalDays, 2);
  assert.equal(diff.totalHours, 60);
  assert.equal(diff.totalMinutes, 3600);
  assert.equal(diff.totalSeconds, 216000);
  assert.ok(diff.humanBreakdown.includes("2 days, 12 hours"));
});

test("6. Date Difference Calculator - Same Dates & Reversed Dates", () => {
  // Same date
  const same = calculateDateDifference({
    startDate: "2026-05-15T10:00:00Z",
    endDate: "2026-05-15T10:00:00Z",
  });
  assert.equal(same.isSameDate, true);
  assert.equal(same.totalSeconds, 0);
  assert.equal(same.direction, "same");
  assert.ok(same.humanBreakdown.includes("0 seconds"));

  // Reversed dates (start is after end)
  const reversed = calculateDateDifference({
    startDate: "2026-12-31T00:00:00Z",
    endDate: "2026-01-01T00:00:00Z",
  });
  assert.equal(reversed.isReversed, true);
  assert.equal(reversed.direction, "backward");
  assert.equal(reversed.totalDays, 364);
  assert.ok(reversed.humanBreakdown.includes("Start date is after End date"));
});

test("7. Date Difference Calculator - Timezones & Inclusive Option", () => {
  // Inclusive counting (+1 day)
  const inc = calculateDateDifference({
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-01-01T00:00:00Z",
    includeEndDay: true,
  });
  assert.equal(inc.totalDays, 1);
  assert.equal(inc.totalHours, 24);

  // Explicit UTC timezone
  const dUtc = parseDateWithTimezone("2026-06-01 12:00:00", "UTC");
  assert.equal(dUtc.toISOString(), "2026-06-01T12:00:00.000Z");

  // Dual date string parsing
  const dual1 = parseDualDateString("2026-01-01 to 2026-12-31");
  assert.equal(dual1.start, "2026-01-01");
  assert.equal(dual1.end, "2026-12-31");

  const dual2 = parseDualDateString("2026-03-01\n2026-04-01");
  assert.equal(dual2.start, "2026-03-01");
  assert.equal(dual2.end, "2026-04-01");
});

test("8. Date Difference Calculator - Invalid Input", () => {
  const badStart = calculateDateDifference({
    startDate: "not-a-date",
    endDate: "2026-01-01",
  });
  assert.equal(badStart.isValid, false);
  assert.ok(badStart.error?.includes("Invalid start date"));

  const empty = calculateDateDifference({
    startDate: "",
    endDate: "",
  });
  assert.equal(empty.isValid, false);
  assert.ok(empty.error);
});
