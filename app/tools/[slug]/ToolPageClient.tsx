"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolLayout } from "@/components/ToolLayout";

// Import pure Phase 2 tools
import {
  convertTabsAndSpaces,
  removeLetterAccents,
  generateSlug,
  removeEmojis,
  calculateWordStatistics,
  formatWordStatisticsReport,
  analyzeCharacterFrequency,
  formatCharacterFrequency,
  analyzeWordFrequency,
  formatWordFrequency,
  testRegex,
  formatRegexReport,
  extractEmailsAndUrls,
  formatExtractionResult,
  parseQueryString,
  formatQueryParserReport,
} from "@/lib/tools/index";

export const ToolPageClient: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const [input, setInput] = useState<string>(tool.sampleInput || "");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Tool Specific Options
  // 1. Tabs ↔ Spaces
  const [tabDir, setTabDir] = useState<"tabs-to-spaces" | "spaces-to-tabs">("tabs-to-spaces");
  const [tabWidth, setTabWidth] = useState<number>(2);

  // 2. Slug Generator
  const [slugSep, setSlugSep] = useState<string>("-");
  const [slugLower, setSlugLower] = useState<boolean>(true);

  // 3. Character Frequency
  const [charSort, setCharSort] = useState<"frequency" | "alphabetical">("frequency");
  const [charIgnoreWs, setCharIgnoreWs] = useState<boolean>(false);
  const [charIgnoreCaps, setCharIgnoreCaps] = useState<boolean>(false);

  // 4. Word Frequency
  const [wordSort, setWordSort] = useState<"frequency" | "alphabetical">("frequency");
  const [wordMinLen, setWordMinLen] = useState<number>(1);
  const [wordIgnoreCaps, setWordIgnoreCaps] = useState<boolean>(true);

  // 5. Regex Tester
  const [regexPattern, setRegexPattern] = useState<string>("user_id_(\\d+)");
  const [regexFlags, setRegexFlags] = useState<string>("g");

  // 6. Query String Parser
  const [queryView, setQueryView] = useState<"table" | "json" | "text">("table");

  // Pure execution router
  const executeTool = useCallback(
    (currentInput: string) => {
      setError(null);
      if (!currentInput && !["lorem-ipsum", "uuid-generator", "password-generator"].includes(tool.slug)) {
        setOutput("");
        return;
      }

      try {
        switch (tool.slug) {
          case "tabs-to-spaces":
            setOutput(convertTabsAndSpaces(currentInput, { direction: tabDir, spacesPerTab: tabWidth }));
            break;

          case "remove-accents":
            setOutput(removeLetterAccents(currentInput));
            break;

          case "slug-generator":
            setOutput(generateSlug(currentInput, { separator: slugSep, lowercase: slugLower }));
            break;

          case "remove-emojis":
            setOutput(removeEmojis(currentInput));
            break;

          case "word-counter": {
            const stats = calculateWordStatistics(currentInput);
            setOutput(formatWordStatisticsReport(stats));
            break;
          }

          case "character-frequency": {
            const items = analyzeCharacterFrequency(currentInput, {
              sortBy: charSort,
              ignoreWhitespace: charIgnoreWs,
              ignoreCase: charIgnoreCaps,
            });
            setOutput(formatCharacterFrequency(items));
            break;
          }

          case "word-frequency": {
            const items = analyzeWordFrequency(currentInput, {
              sortBy: wordSort,
              minWordLength: wordMinLen,
              ignoreCase: wordIgnoreCaps,
            });
            setOutput(formatWordFrequency(items));
            break;
          }

          case "regex-tester": {
            const res = testRegex(currentInput, regexPattern, regexFlags);
            if (!res.isValid) {
              setError(res.error || "Invalid Regular Expression");
            }
            setOutput(formatRegexReport(res));
            break;
          }

          case "extract-emails-urls": {
            const res = extractEmailsAndUrls(currentInput);
            setOutput(formatExtractionResult(res));
            break;
          }

          case "query-string-parser": {
            const res = parseQueryString(currentInput);
            if (queryView === "json") {
              setOutput(JSON.stringify(res.jsonRepresentation, null, 2));
            } else {
              setOutput(formatQueryParserReport(res));
            }
            break;
          }

          default:
            // Placeholder for remaining phases
            setOutput(
              `[Tool Architecture Ready]\nTool: ${tool.name}\nCategory: ${tool.category}\nInput: ${currentInput}\n(Tool logic will be implemented in subsequent phases.)`
            );
            break;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error executing tool");
      }
    },
    [
      tool.slug,
      tool.name,
      tool.category,
      tabDir,
      tabWidth,
      slugSep,
      slugLower,
      charSort,
      charIgnoreWs,
      charIgnoreCaps,
      wordSort,
      wordMinLen,
      wordIgnoreCaps,
      regexPattern,
      regexFlags,
      queryView,
    ]
  );

  // Live Auto-Run for tools supporting live mode
  useEffect(() => {
    if (tool.supportsLiveMode) {
      executeTool(input);
    }
  }, [input, tool.supportsLiveMode, executeTool]);

  const handleRun = () => {
    setIsLoading(true);
    executeTool(input);
    setIsLoading(false);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setOutput("");
    }
  };

  // Custom Controls for Specialized Tools
  const customControls = useMemo(() => {
    switch (tool.slug) {
      case "tabs-to-spaces":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Direction:</span>
              <select
                value={tabDir}
                onChange={(e) => setTabDir(e.target.value as "tabs-to-spaces" | "spaces-to-tabs")}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="tabs-to-spaces">Tabs → Spaces</option>
                <option value="spaces-to-tabs">Spaces → Tabs</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Spaces per Tab:</span>
              <input
                type="number"
                min={1}
                max={8}
                value={tabWidth}
                onChange={(e) => setTabWidth(Math.max(1, Math.min(8, parseInt(e.target.value) || 2)))}
                className="w-14 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 font-mono text-center focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        );

      case "slug-generator":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Separator:</span>
              <select
                value={slugSep}
                onChange={(e) => setSlugSep(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="-">Hyphen (-)</option>
                <option value="_">Underscore (_)</option>
                <option value=".">Dot (.)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={slugLower}
                onChange={(e) => setSlugLower(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Lowercase Output</span>
            </label>
          </div>
        );

      case "character-frequency":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Sort By:</span>
              <select
                value={charSort}
                onChange={(e) => setCharSort(e.target.value as "frequency" | "alphabetical")}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="frequency">Highest Frequency</option>
                <option value="alphabetical">Alphabetical Order</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={charIgnoreWs}
                onChange={(e) => setCharIgnoreWs(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Ignore Whitespace</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={charIgnoreCaps}
                onChange={(e) => setCharIgnoreCaps(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Ignore Case</span>
            </label>
          </div>
        );

      case "word-frequency":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Sort By:</span>
              <select
                value={wordSort}
                onChange={(e) => setWordSort(e.target.value as "frequency" | "alphabetical")}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="frequency">Highest Frequency</option>
                <option value="alphabetical">Alphabetical Order</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Min Word Length:</span>
              <input
                type="number"
                min={1}
                max={20}
                value={wordMinLen}
                onChange={(e) => setWordMinLen(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 font-mono text-center focus:outline-none focus:border-brand-500"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={wordIgnoreCaps}
                onChange={(e) => setWordIgnoreCaps(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Case Insensitive</span>
            </label>
          </div>
        );

      case "regex-tester":
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
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-brand-500"
                />
                <span className="font-mono text-slate-400 text-sm">/</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Flags:</span>
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
                        className={`px-2 py-0.5 rounded font-mono text-xs font-semibold transition-colors ${
                          active
                            ? "bg-brand-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:text-white"
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

      case "query-string-parser":
        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Display Format:</span>
            <div className="flex items-center gap-1">
              {(["table", "json", "text"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setQueryView(mode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    queryView === mode
                      ? "bg-brand-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [
    tool.slug,
    tabDir,
    tabWidth,
    slugSep,
    slugLower,
    charSort,
    charIgnoreWs,
    charIgnoreCaps,
    wordSort,
    wordMinLen,
    wordIgnoreCaps,
    regexPattern,
    regexFlags,
    queryView,
  ]);

  // Custom Interactive Previews
  const customPreview = useMemo(() => {
    if (tool.slug === "query-string-parser" && queryView === "table") {
      const parsed = parseQueryString(input);
      if (parsed.entries.length === 0) {
        return (
          <div className="text-slate-400 text-xs py-8 text-center">
            Enter a query string (e.g. <code className="text-brand-400 font-mono">?name=John&age=25</code>) to view parsed parameters.
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Total Parameters: <strong className="text-slate-200">{parsed.totalParams}</strong>
            </span>
            <span>
              Unique Keys: <strong className="text-slate-200">{parsed.uniqueKeys}</strong>
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Key</th>
                  <th className="p-3">Decoded Value</th>
                  <th className="p-3">Raw Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {parsed.entries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-semibold text-emerald-400">{entry.decodedKey}</td>
                    <td className="p-3 text-slate-100">{entry.decodedValue || <span className="text-slate-600">(empty)</span>}</td>
                    <td className="p-3 text-slate-400">{entry.rawValue || <span className="text-slate-600">(empty)</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (tool.slug === "word-counter") {
      const stats = calculateWordStatistics(input);
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="text-[11px] text-slate-400">Words</div>
              <div className="text-xl font-bold text-emerald-400 font-mono">
                {stats.words.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="text-[11px] text-slate-400">Characters</div>
              <div className="text-xl font-bold text-slate-100 font-mono">
                {stats.characters.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="text-[11px] text-slate-400">No Spaces</div>
              <div className="text-xl font-bold text-slate-100 font-mono">
                {stats.charactersNoSpaces.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="text-[11px] text-slate-400">Sentences</div>
              <div className="text-xl font-bold text-blue-400 font-mono">
                {stats.sentences.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="text-[11px] text-slate-400">Paragraphs</div>
              <div className="text-xl font-bold text-purple-400 font-mono">
                {stats.paragraphs.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="text-[11px] text-slate-400">Lines</div>
              <div className="text-xl font-bold text-slate-100 font-mono">
                {stats.lines.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs">
            <span className="text-slate-400">Reading Time (~200 WPM):</span>
            <span className="font-semibold text-amber-400">{stats.readingTimeFormatted}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs">
            <span className="text-slate-400">Speaking Time (~130 WPM):</span>
            <span className="font-semibold text-blue-400">{stats.speakingTimeFormatted}</span>
          </div>
        </div>
      );
    }

    if (tool.slug === "regex-tester") {
      const res = testRegex(input, regexPattern, regexFlags);
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Matches Found:{" "}
              <strong className={res.matchCount > 0 ? "text-emerald-400" : "text-slate-400"}>
                {res.matchCount}
              </strong>
            </span>
            {res.isValid ? (
              <span className="text-[11px] text-emerald-400 font-mono">✓ Valid Expression</span>
            ) : (
              <span className="text-[11px] text-rose-400 font-mono">✕ Invalid Syntax</span>
            )}
          </div>

          {res.matches.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {res.matches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs font-mono space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Match #{idx + 1}</span>
                    <span className="text-[10px] text-slate-500">
                      idx {m.index}..{m.index + m.length}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 break-all font-semibold">
                    {m.match}
                  </div>
                  {m.groups.length > 0 && (
                    <div className="mt-1 pt-1 border-t border-slate-800/80 space-y-1">
                      {m.groups.map((g, gIdx) => (
                        <div key={gIdx} className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="text-purple-400">{g.name ? g.name : `Group ${g.index}`}:</span>
                          <span className="text-slate-200">{g.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-xs py-8 text-center font-mono">
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
    <ToolLayout
      tool={tool}
      input={input}
      output={output}
      onInputChange={setInput}
      onRun={handleRun}
      onClear={handleClear}
      onSwap={handleSwap}
      isLoading={isLoading}
      error={error}
      customControls={customControls}
      customPreview={customPreview}
    />
  );
};
