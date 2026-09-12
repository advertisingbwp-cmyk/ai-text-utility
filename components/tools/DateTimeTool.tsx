"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolWorkspaceResolver } from "@/components/layouts";
import { CopyButton } from "@/components/CopyButton";
import {
  convertUnixTimestamp,
  getCurrentTimestamp,
  calculateDateDifference,
  parseDualDateString,
} from "@/lib/tools/index";
import { trackEvent } from "@/lib/analytics";

export const DateTimeTool: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const [input, setInput] = useState<string>(tool.sampleInput || "");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Tool Specific Options
  const [unixUnit, setUnixUnit] = useState<"auto" | "seconds" | "milliseconds">("auto");
  const [unixTz, setUnixTz] = useState<string>("local");
  const [dateDiffIncludeEnd, setDateDiffIncludeEnd] = useState<boolean>(false);
  const [dateDiffTz, setDateDiffTz] = useState<string>("UTC");

  const executeTool = useCallback(
    (currentInput: string) => {
      setError(null);
      if (!currentInput) {
        setOutput("");
        return;
      }

      try {
        if (tool.slug === "unix-timestamp") {
          const res = convertUnixTimestamp(currentInput, { unit: unixUnit, timezone: unixTz });
          if (!res.isValid) {
            setError(res.error || "Invalid Unix Timestamp or Date format");
          }
          setOutput(res.formattedReport);
        } else if (tool.slug === "date-difference") {
          const parsed = parseDualDateString(currentInput);
          const res = calculateDateDifference({
            startDate: parsed.start,
            endDate: parsed.end,
            startTimezone: dateDiffTz,
            endTimezone: dateDiffTz,
            includeEndDay: dateDiffIncludeEnd,
          });
          if (res.error) {
            setError(res.error);
          }
          setOutput(res.formattedReport);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error executing date calculation");
      }
    },
    [tool.slug, unixUnit, unixTz, dateDiffTz, dateDiffIncludeEnd]
  );

  useEffect(() => {
    if (tool.supportsLiveMode) {
      executeTool(input);
    }
  }, [input, tool.supportsLiveMode, executeTool]);

  const handleRun = () => {
    setIsLoading(true);
    trackEvent("tool_used", {
      toolSlug: tool.slug,
      category: tool.category,
      inputLength: input.length,
    });
    executeTool(input);
    setIsLoading(false);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const customControls = useMemo(() => {
    if (tool.slug === "unix-timestamp") {
      return (
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Unit:</span>
            <select
              value={unixUnit}
              onChange={(e) => setUnixUnit(e.target.value as "auto" | "seconds" | "milliseconds")}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
            >
              <option value="auto">Auto-Detect (10 vs 13 digits)</option>
              <option value="seconds">Seconds (10 digits)</option>
              <option value="milliseconds">Milliseconds (13 digits)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Display Timezone:</span>
            <select
              value={unixTz}
              onChange={(e) => setUnixTz(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
            >
              <option value="local">Local Timezone</option>
              <option value="UTC">UTC / GMT</option>
              <option value="America/New_York">New York (EST/EDT)</option>
              <option value="Europe/London">London (GMT/BST)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Asia/Karachi">Karachi (PKT)</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              const now = getCurrentTimestamp();
              setInput(unixUnit === "milliseconds" ? now.milliseconds.toString() : now.seconds.toString());
            }}
            className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium cursor-pointer"
          >
            Insert Current Time (Now)
          </button>
        </div>
      );
    }

    if (tool.slug === "date-difference") {
      return (
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Calculation Timezone:</span>
            <select
              value={dateDiffTz}
              onChange={(e) => setDateDiffTz(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
            >
              <option value="UTC">UTC / GMT (Zero Drift)</option>
              <option value="local">Browser Local Time</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={dateDiffIncludeEnd}
              onChange={(e) => setDateDiffIncludeEnd(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-brand-600 bg-white dark:bg-slate-800"
            />
            <span>Include End Date (+1 Full Day)</span>
          </label>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Presets:</span>
            <button
              type="button"
              onClick={() => setInput("2026-01-01 to 2026-12-31")}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Year 2026
            </button>
            <button
              type="button"
              onClick={() => setInput("2026-09-07 to 2026-12-25")}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Christmas 2026
            </button>
          </div>
        </div>
      );
    }

    return null;
  }, [tool.slug, unixUnit, unixTz, dateDiffTz, dateDiffIncludeEnd]);

  const customPreview = useMemo(() => {
    if (tool.slug === "unix-timestamp") {
      const res = convertUnixTimestamp(input, { unit: unixUnit, timezone: unixTz });
      if (!input.trim() || !res.isValid) return null;

      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Unit: <strong className="text-brand-600 dark:text-brand-400">{res.usedUnit}</strong>
              </span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                {res.relativeTime}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
              {res.utc}
            </div>
            {res.timezoneFormatted && (
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {res.timezoneFormatted}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/40 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Epoch Seconds</div>
                <div className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{res.seconds}</div>
              </div>
              <CopyButton text={res.seconds.toString()} variant="ghost" />
            </div>

            <div className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/40 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Epoch Milliseconds</div>
                <div className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{res.milliseconds}</div>
              </div>
              <CopyButton text={res.milliseconds.toString()} variant="ghost" />
            </div>

            <div className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/40 flex items-center justify-between sm:col-span-2">
              <div className="overflow-hidden">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">ISO 8601 (UTC)</div>
                <div className="text-xs font-mono text-slate-900 dark:text-slate-200 truncate">{res.iso}</div>
              </div>
              <CopyButton text={res.iso} variant="ghost" />
            </div>
          </div>
        </div>
      );
    }

    if (tool.slug === "date-difference") {
      const parsed = parseDualDateString(input);
      const res = calculateDateDifference({
        startDate: parsed.start,
        endDate: parsed.end,
        startTimezone: dateDiffTz,
        endTimezone: dateDiffTz,
        includeEndDay: dateDiffIncludeEnd,
      });

      if (!res.isValid) return null;

      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-brand-200 dark:border-brand-500/20 bg-brand-50/70 dark:bg-brand-500/5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
                Exact Duration Breakdown
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {res.isSameDate ? "Same Date" : res.isReversed ? "Backward Interval" : "Forward Interval"}
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
              {res.humanBreakdown}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-center shadow-2xs">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">{res.totalDays.toLocaleString()}</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">Total Days</div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-center shadow-2xs">
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">{res.totalHours.toLocaleString()}</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">Total Hours</div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-center shadow-2xs">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">{res.totalMinutes.toLocaleString()}</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">Total Minutes</div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-center shadow-2xs">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono">{res.totalSeconds.toLocaleString()}</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">Total Seconds</div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }, [tool.slug, input, unixUnit, unixTz, dateDiffTz, dateDiffIncludeEnd]);

  return (
    <ToolWorkspaceResolver
      tool={tool}
      input={input}
      output={output}
      onInputChange={setInput}
      onRun={handleRun}
      onClear={handleClear}
      isLoading={isLoading}
      error={error}
      customControls={customControls}
      customPreview={customPreview}
    />
  );
};
