"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolWorkspaceResolver } from "@/components/layouts";
import { testRegex, formatRegexReport, parseQueryString, formatQueryParserReport } from "@/lib/tools/index";
import { trackEvent } from "@/lib/analytics";

export const RegexTool: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const [input, setInput] = useState<string>(tool.sampleInput || "");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Regex Tester State
  const [regexPattern, setRegexPattern] = useState<string>("user_id_(\\\\d+)");
  const [regexFlags, setRegexFlags] = useState<string>("g");

  // Query String Parser State
  const [queryView, setQueryView] = useState<"table" | "json" | "text">("table");

  const executeTool = useCallback(
    (currentInput: string) => {
      setError(null);
      if (!currentInput) {
        setOutput("");
        return;
      }

      try {
        if (tool.slug === "regex-tester") {
          const res = testRegex(currentInput, regexPattern, regexFlags);
          if (!res.isValid) {
            setError(res.error || "Invalid Regular Expression");
          }
          setOutput(formatRegexReport(res));
        } else if (tool.slug === "query-string-parser") {
          const res = parseQueryString(currentInput);
          if (queryView === "json") {
            setOutput(JSON.stringify(res.jsonRepresentation, null, 2));
          } else {
            setOutput(formatQueryParserReport(res));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error executing regex / parser");
      }
    },
    [tool.slug, regexPattern, regexFlags, queryView]
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
    if (tool.slug === "regex-tester") {
      return (
        <div className="space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              <span className="font-mono text-slate-400 text-sm">/</span>
              <input
                type="text"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-brand-500 shadow-2xs"
              />
              <span className="font-mono text-slate-400 text-sm">/</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Flags:</span>
              <div className="flex items-center gap-1">
                {["g", "i", "m", "s", "u"].map((flag) => {
                  const active = regexFlags.includes(flag);
                  return (
                    <button
                      key={flag}
                      type="button"
                      onClick={() => {
                        setRegexFlags((prev) =>
                          active ? prev.replace(flag, "") : `${prev}${flag}`
                        );
                      }}
                      className={`px-2 py-0.5 rounded font-mono text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? "bg-brand-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {flag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tool.slug === "query-string-parser") {
      return (
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-700 dark:text-slate-300 font-medium">Display Format:</span>
          <div className="flex items-center gap-1">
            {(["table", "json", "text"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setQueryView(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                  queryView === mode
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  }, [tool.slug, regexPattern, regexFlags, queryView]);

  const customPreview = useMemo(() => {
    if (tool.slug === "query-string-parser" && queryView === "table") {
      const parsed = parseQueryString(input);
      if (parsed.entries.length === 0) {
        return (
          <div className="text-slate-500 dark:text-slate-400 text-xs py-8 text-center">
            Enter a query string (e.g. <code className="text-brand-600 dark:text-brand-400 font-mono">?name=John&age=25</code>) to view parsed parameters.
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>
              Total Parameters: <strong className="text-slate-900 dark:text-slate-100">{parsed.totalParams}</strong>
            </span>
            <span>
              Unique Keys: <strong className="text-slate-900 dark:text-slate-100">{parsed.uniqueKeys}</strong>
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-950/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Key</th>
                  <th className="p-3">Decoded Value</th>
                  <th className="p-3">Raw Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-slate-950/40">
                {parsed.entries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-400 dark:text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">{entry.decodedKey}</td>
                    <td className="p-3 text-slate-900 dark:text-slate-100 font-medium">{entry.decodedValue || <span className="text-slate-400 dark:text-slate-600 font-normal">(empty)</span>}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{entry.rawValue || <span className="text-slate-400 dark:text-slate-600 font-normal">(empty)</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (tool.slug === "regex-tester") {
      const res = testRegex(input, regexPattern, regexFlags);
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Matches Found:{" "}
              <strong className={res.matchCount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}>
                {res.matchCount}
              </strong>
            </span>
            {res.isValid ? (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">✓ Valid Expression</span>
            ) : (
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-mono font-medium">✕ Invalid Syntax</span>
            )}
          </div>

          {res.matches.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {res.matches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-mono space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-400 font-semibold">Match #{idx + 1}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      idx {m.index}..{m.index + m.length}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 break-all font-semibold">
                    {m.match}
                  </div>
                  {m.groups.length > 0 && (
                    <div className="mt-1 pt-1 border-t border-slate-200 dark:border-slate-800/80 space-y-1">
                      {m.groups.map((g, gIdx) => (
                        <div key={gIdx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <span className="text-purple-600 dark:text-purple-400 font-medium">{g.name ? g.name : `Group ${g.index}`}:</span>
                          <span className="text-slate-800 dark:text-slate-200">{g.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 dark:text-slate-400 text-xs py-8 text-center font-mono">
              {res.isValid
                ? "No matches found in the provided text."
                : `Error: ${res.error}`}
            </div>
          )}
        </div>
      );
    }

    return null;
  }, [tool.slug, input, regexPattern, regexFlags, queryView]);

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