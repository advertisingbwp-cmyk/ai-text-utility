"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolWorkspaceResolver } from "@/components/layouts";
import { CopyButton } from "@/components/CopyButton";
import {
  calculateWordStatistics,
  formatWordStatisticsReport,
  analyzeCharacterFrequency,
  formatCharacterFrequency,
  analyzeWordFrequency,
  formatWordFrequency,
  extractEmailsAndUrls,
  formatExtractionResult,
} from "@/lib/tools/index";
import { trackEvent } from "@/lib/analytics";

export const TableTool: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const [input, setInput] = useState<string>(tool.sampleInput || "");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Character Frequency State
  const [charSort, setCharSort] = useState<"frequency" | "alphabetical">("frequency");
  const [charIgnoreWs, setCharIgnoreWs] = useState<boolean>(false);
  const [charIgnoreCaps, setCharIgnoreCaps] = useState<boolean>(false);

  // Word Frequency State
  const [wordSort, setWordSort] = useState<"frequency" | "alphabetical">("frequency");
  const [wordMinLen, setWordMinLen] = useState<number>(1);
  const [wordIgnoreCaps, setWordIgnoreCaps] = useState<boolean>(true);

  const executeTool = useCallback(
    (currentInput: string) => {
      setError(null);
      if (!currentInput) {
        setOutput("");
        return;
      }

      try {
        switch (tool.slug) {
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

          case "extract-emails-urls": {
            const res = extractEmailsAndUrls(currentInput);
            setOutput(formatExtractionResult(res));
            break;
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error executing analysis");
      }
    },
    [tool.slug, charSort, charIgnoreWs, charIgnoreCaps, wordSort, wordMinLen, wordIgnoreCaps]
  );

  useEffect(() => {
    if (!tool.supportsLiveMode) return;

    if (input.length >= 2000) {
      const timer = setTimeout(() => {
        executeTool(input);
      }, 120);
      return () => clearTimeout(timer);
    }

    executeTool(input);
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
    switch (tool.slug) {
      case "character-frequency":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Sort By:</span>
              <select
                value={charSort}
                onChange={(e) => setCharSort(e.target.value as "frequency" | "alphabetical")}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="frequency">Highest Frequency</option>
                <option value="alphabetical">Alphabetical Order</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={charIgnoreWs}
                onChange={(e) => setCharIgnoreWs(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Ignore Whitespace</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={charIgnoreCaps}
                onChange={(e) => setCharIgnoreCaps(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Ignore Case</span>
            </label>
          </div>
        );

      case "word-frequency":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Sort By:</span>
              <select
                value={wordSort}
                onChange={(e) => setWordSort(e.target.value as "frequency" | "alphabetical")}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="frequency">Highest Frequency</option>
                <option value="alphabetical">Alphabetical Order</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Min Word Length:</span>
              <input
                type="number"
                min={1}
                max={20}
                value={wordMinLen}
                onChange={(e) => setWordMinLen(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 font-mono text-center focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={wordIgnoreCaps}
                onChange={(e) => setWordIgnoreCaps(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Case Insensitive</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  }, [tool.slug, charSort, charIgnoreWs, charIgnoreCaps, wordSort, wordMinLen, wordIgnoreCaps]);

  const customPreview = useMemo(() => {
    if (tool.slug === "word-counter") {
      const stats = calculateWordStatistics(input);
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Words</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {stats.words.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Characters</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                {stats.characters.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">No Spaces</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                {stats.charactersNoSpaces.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Sentences</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                {stats.sentences.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Paragraphs</div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {stats.paragraphs.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/40">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Lines</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                {stats.lines.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/60 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Reading Time (~200 WPM):</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">{stats.readingTimeFormatted}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/60 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Speaking Time (~130 WPM):</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.speakingTimeFormatted}</span>
          </div>
        </div>
      );
    }

    if (tool.slug === "character-frequency") {
      const items = analyzeCharacterFrequency(input, {
        sortBy: charSort,
        ignoreWhitespace: charIgnoreWs,
        ignoreCase: charIgnoreCaps,
      });
      if (items.length === 0) {
        return (
          <div className="text-slate-400 text-xs py-8 text-center font-mono">
            Enter text above to view character frequency analysis.
          </div>
        );
      }
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Unique Glyphs: <strong className="text-slate-800 dark:text-slate-200">{items.length}</strong></span>
            <span>Ranked by {charSort === "frequency" ? "Frequency" : "Alphabetical"}</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50/90 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Character</th>
                  <th className="p-3">Count</th>
                  <th className="p-3">Percentage</th>
                  <th className="p-3 w-1/3">Distribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {items.slice(0, 100).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold text-brand-600 dark:text-brand-400 text-sm">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {item.displayCharacter}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{item.count.toLocaleString()}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{item.percentage}%</td>
                    <td className="p-3">
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${Math.min(100, item.percentage * 2)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (tool.slug === "word-frequency") {
      const items = analyzeWordFrequency(input, {
        sortBy: wordSort,
        minWordLength: wordMinLen,
        ignoreCase: wordIgnoreCaps,
      });
      if (items.length === 0) {
        return (
          <div className="text-slate-400 text-xs py-8 text-center font-mono">
            Enter text above to view word frequency analysis.
          </div>
        );
      }
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Unique Words: <strong className="text-slate-800 dark:text-slate-200">{items.length}</strong></span>
            <span>Ranked by {wordSort === "frequency" ? "Frequency" : "Alphabetical"}</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50/90 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Word</th>
                  <th className="p-3">Count</th>
                  <th className="p-3">Percentage</th>
                  <th className="p-3 w-1/3">Distribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {items.slice(0, 100).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.word}
                    </td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{item.count.toLocaleString()}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{item.percentage}%</td>
                    <td className="p-3">
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(100, item.percentage * 2)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (tool.slug === "extract-emails-urls") {
      const res = extractEmailsAndUrls(input);
      if (res.totalFound === 0) {
        return (
          <div className="text-slate-400 text-xs py-8 text-center font-mono">
            No emails or URLs detected in the input text.
          </div>
        );
      }
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/40">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Emails Extracted</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">{res.emails.length}</div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/40">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">URLs Extracted</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-1">{res.urls.length}</div>
            </div>
          </div>

          {res.emails.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Emails ({res.emails.length})</span>
                <CopyButton text={res.emails.join("\\n")} label="Copy All Emails" />
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {res.emails.map((email, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 text-xs font-mono">
                    <span className="text-slate-800 dark:text-slate-200 truncate">{email}</span>
                    <CopyButton text={email} variant="ghost" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {res.urls.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>URLs ({res.urls.length})</span>
                <CopyButton text={res.urls.join("\\n")} label="Copy All URLs" />
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {res.urls.map((url, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 text-xs font-mono">
                    <span className="text-slate-800 dark:text-slate-200 truncate">{url}</span>
                    <CopyButton text={url} variant="ghost" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  }, [tool.slug, input, charSort, charIgnoreWs, charIgnoreCaps, wordSort, wordMinLen, wordIgnoreCaps]);

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