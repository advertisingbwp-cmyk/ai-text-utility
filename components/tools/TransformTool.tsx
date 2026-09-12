"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolWorkspaceResolver } from "@/components/layouts";
import {
  convertTabsAndSpaces,
  removeLetterAccents,
  generateSlug,
  removeEmojis,
  addLineNumbers,
  removeDuplicateLines,
  removeEmptyLines,
  trimLines,
  removeExtraSpaces,
  stripHtmlTags,
  removeLineBreaks,
  removeSpecialChars,
  convertCase,
  CaseMode,
  sortLines,
  SortOrder,
  reverseText,
  ReverseMode,
  transformBase64,
  transformUrl,
  rot13,
} from "@/lib/tools/index";
import { trackEvent } from "@/lib/analytics";

export const TransformTool: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const [input, setInput] = useState<string>(tool.sampleInput || "");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Specific transform options
  const [tabDir, setTabDir] = useState<"tabs-to-spaces" | "spaces-to-tabs">("tabs-to-spaces");
  const [tabWidth, setTabWidth] = useState<number>(2);
  const [slugSep, setSlugSep] = useState<string>("-");
  const [slugLower, setSlugLower] = useState<boolean>(true);
  const [lineNumStart, setLineNumStart] = useState<number>(1);
  const [lineNumDelim, setLineNumDelim] = useState<string>(". ");
  const [lineNumPadZeros, setLineNumPadZeros] = useState<boolean>(false);

  // Cleanup options
  const [dedupeCase, setDedupeCase] = useState<boolean>(true);
  const [dedupeTrim, setDedupeTrim] = useState<boolean>(false);
  const [emptyLinesMode, setEmptyLinesMode] = useState<"remove-all" | "preserve-paragraphs">("remove-all");
  const [trimMode, setTrimMode] = useState<"both" | "leading" | "trailing">("both");
  const [trimRemoveEmpty, setTrimRemoveEmpty] = useState<boolean>(false);
  const [spacesMode, setSpacesMode] = useState<"spaces-only" | "all-whitespace">("spaces-only");
  const [stripHtmlBreaks, setStripHtmlBreaks] = useState<boolean>(true);
  const [stripHtmlEntities, setStripHtmlEntities] = useState<boolean>(true);
  const [lineBreaksSep, setLineBreaksSep] = useState<string>(" ");
  const [lineBreaksParagraphs, setLineBreaksParagraphs] = useState<boolean>(false);
  const [specialCharsMode, setSpecialCharsMode] = useState<"alphanumeric-only" | "keep-punctuation" | "custom">("alphanumeric-only");
  const [specialCharsCustom, setSpecialCharsCustom] = useState<string>("");

  // Transform options
  const [caseMode, setCaseMode] = useState<CaseMode>("uppercase");
  const [sortOrder, setSortOrder] = useState<SortOrder>("az");
  const [sortCase, setSortCase] = useState<boolean>(false);
  const [sortPreserveDups, setSortPreserveDups] = useState<boolean>(true);
  const [reverseMode, setReverseMode] = useState<ReverseMode>("characters");
  const [base64Mode, setBase64Mode] = useState<"encode" | "decode">("encode");
  const [base64UrlSafe, setBase64UrlSafe] = useState<boolean>(false);
  const [urlMode, setUrlMode] = useState<"encode" | "decode">("encode");
  const [urlScope, setUrlScope] = useState<"component" | "full">("component");

  const executeTool = useCallback(
    (currentInput: string) => {
      setError(null);
      if (!currentInput) {
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

          case "add-line-numbers":
            setOutput(
              addLineNumbers(currentInput, {
                startNumber: lineNumStart,
                delimiter: lineNumDelim,
                padWithZeros: lineNumPadZeros,
              })
            );
            break;

          // --- Cleanup Tools ---
          case "remove-duplicate-lines":
            setOutput(
              removeDuplicateLines(currentInput, {
                caseSensitive: dedupeCase,
                trimBeforeCompare: dedupeTrim,
              })
            );
            break;

          case "remove-empty-lines":
            setOutput(removeEmptyLines(currentInput, { mode: emptyLinesMode }));
            break;

          case "trim-lines":
            setOutput(
              trimLines(currentInput, {
                mode: trimMode,
                removeEmptyLines: trimRemoveEmpty,
              })
            );
            break;

          case "remove-extra-spaces":
            setOutput(removeExtraSpaces(currentInput, { collapseType: spacesMode }));
            break;

          case "strip-html-tags":
            setOutput(
              stripHtmlTags(currentInput, {
                preserveLineBreaks: stripHtmlBreaks,
                decodeEntities: stripHtmlEntities,
              })
            );
            break;

          case "remove-line-breaks":
            setOutput(
              removeLineBreaks(currentInput, {
                separator: lineBreaksSep,
                collapseParagraphs: lineBreaksParagraphs,
              })
            );
            break;

          case "remove-special-chars":
            setOutput(
              removeSpecialChars(currentInput, {
                mode: specialCharsMode,
                customAllowedChars: specialCharsCustom,
              })
            );
            break;

          // --- Transform Tools ---
          case "case-converter":
            setOutput(convertCase(currentInput, caseMode));
            break;

          case "sort-lines":
            setOutput(
              sortLines(currentInput, {
                order: sortOrder,
                caseSensitive: sortCase,
                preserveDuplicates: sortPreserveDups,
              })
            );
            break;

          case "reverse-text":
            setOutput(reverseText(currentInput, reverseMode));
            break;

          case "base64": {
            const res = transformBase64(currentInput, {
              mode: base64Mode,
              urlSafe: base64UrlSafe,
            });
            if (res.error) {
              setError(res.error);
              setOutput("");
            } else {
              setOutput(res.result);
            }
            break;
          }

          case "url-encoder": {
            const res = transformUrl(currentInput, {
              mode: urlMode,
              scope: urlScope,
            });
            if (res.error) {
              setError(res.error);
              setOutput("");
            } else {
              setOutput(res.result);
            }
            break;
          }

          case "rot13":
            setOutput(rot13(currentInput));
            break;

          default:
            setOutput(currentInput);
            break;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error executing tool");
      }
    },
    [
      tool.slug,
      tabDir,
      tabWidth,
      slugSep,
      slugLower,
      lineNumStart,
      lineNumDelim,
      lineNumPadZeros,
      dedupeCase,
      dedupeTrim,
      emptyLinesMode,
      trimMode,
      trimRemoveEmpty,
      spacesMode,
      stripHtmlBreaks,
      stripHtmlEntities,
      lineBreaksSep,
      lineBreaksParagraphs,
      specialCharsMode,
      specialCharsCustom,
      caseMode,
      sortOrder,
      sortCase,
      sortPreserveDups,
      reverseMode,
      base64Mode,
      base64UrlSafe,
      urlMode,
      urlScope,
    ]
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

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setOutput("");
    }
  };

  const customControls = useMemo(() => {
    switch (tool.slug) {
      case "tabs-to-spaces":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Direction:</span>
              <select
                value={tabDir}
                onChange={(e) => setTabDir(e.target.value as "tabs-to-spaces" | "spaces-to-tabs")}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="tabs-to-spaces">Tabs → Spaces</option>
                <option value="spaces-to-tabs">Spaces → Tabs</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Spaces per Tab:</span>
              <input
                type="number"
                min={1}
                max={8}
                value={tabWidth}
                onChange={(e) => setTabWidth(Math.max(1, Math.min(8, parseInt(e.target.value) || 2)))}
                className="w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 font-mono text-center focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>
          </div>
        );

      case "slug-generator":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Separator:</span>
              <select
                value={slugSep}
                onChange={(e) => setSlugSep(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="-">Hyphen (-)</option>
                <option value="_">Underscore (_)</option>
                <option value=".">Dot (.)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={slugLower}
                onChange={(e) => setSlugLower(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Lowercase Output</span>
            </label>
          </div>
        );

      case "add-line-numbers":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Start At:</span>
              <input
                type="number"
                value={lineNumStart}
                onChange={(e) => setLineNumStart(parseInt(e.target.value) || 1)}
                className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 font-mono text-center focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Delimiter:</span>
              <select
                value={lineNumDelim}
                onChange={(e) => setLineNumDelim(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value=". ">Dot & Space (1. )</option>
                <option value=") ">Parenthesis & Space (1) )</option>
                <option value=": ">Colon & Space (1: )</option>
                <option value=" - ">Hyphen (1 - )</option>
                <option value="\t">Tab indent</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={lineNumPadZeros}
                onChange={(e) => setLineNumPadZeros(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Pad with Leading Zeros (01, 02)</span>
            </label>
          </div>
        );

      case "remove-duplicate-lines":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={dedupeCase}
                onChange={(e) => setDedupeCase(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Case Sensitive Match</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={dedupeTrim}
                onChange={(e) => setDedupeTrim(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Trim Whitespace Before Compare</span>
            </label>
          </div>
        );

      case "remove-empty-lines":
        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Removal Mode:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setEmptyLinesMode("remove-all")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  emptyLinesMode === "remove-all"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Remove All Blank Lines
              </button>
              <button
                type="button"
                onClick={() => setEmptyLinesMode("preserve-paragraphs")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  emptyLinesMode === "preserve-paragraphs"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Collapse Multiple (Keep Paragraphs)
              </button>
            </div>
          </div>
        );

      case "trim-lines":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Trim Position:</span>
              <select
                value={trimMode}
                onChange={(e) => setTrimMode(e.target.value as "both" | "leading" | "trailing")}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="both">Both Ends (Start & End)</option>
                <option value="leading">Leading (Start Only)</option>
                <option value="trailing">Trailing (End Only)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={trimRemoveEmpty}
                onChange={(e) => setTrimRemoveEmpty(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Remove Empty Lines Resulting from Trim</span>
            </label>
          </div>
        );

      case "remove-extra-spaces":
        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Collapse Scope:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSpacesMode("spaces-only")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  spacesMode === "spaces-only"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Spaces & Tabs Only (Keep Line Breaks)
              </button>
              <button
                type="button"
                onClick={() => setSpacesMode("all-whitespace")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  spacesMode === "all-whitespace"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                All Whitespace (Single Line Output)
              </button>
            </div>
          </div>
        );

      case "strip-html-tags":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={stripHtmlBreaks}
                onChange={(e) => setStripHtmlBreaks(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Convert &lt;br&gt; and &lt;p&gt; into Newlines</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={stripHtmlEntities}
                onChange={(e) => setStripHtmlEntities(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Decode HTML Entities (&amp;amp; → &amp;)</span>
            </label>
          </div>
        );

      case "remove-line-breaks":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Replace With:</span>
              <select
                value={lineBreaksSep}
                onChange={(e) => setLineBreaksSep(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value=" ">Single Space (&quot; &quot;)</option>
                <option value=", ">Comma & Space (&quot;, &quot;)</option>
                <option value="; ">Semicolon & Space (&quot;; &quot;)</option>
                <option value="">Nothing (Join Directly)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={lineBreaksParagraphs}
                onChange={(e) => setLineBreaksParagraphs(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Preserve Double Line Breaks (Paragraphs)</span>
            </label>
          </div>
        );

      case "remove-special-chars":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Filter Mode:</span>
              <select
                value={specialCharsMode}
                onChange={(e) =>
                  setSpecialCharsMode(e.target.value as "alphanumeric-only" | "keep-punctuation" | "custom")
                }
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="alphanumeric-only">Alphanumeric Only (A-Z, 0-9, spaces)</option>
                <option value="keep-punctuation">Keep Standard Punctuation (. , ! ? - _)</option>
                <option value="custom">Custom Allowed List</option>
              </select>
            </div>

            {specialCharsMode === "custom" && (
              <div className="flex items-center gap-2">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Allowed Characters:</span>
                <input
                  type="text"
                  placeholder="@#$%^&*"
                  value={specialCharsCustom}
                  onChange={(e) => setSpecialCharsCustom(e.target.value)}
                  className="w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:border-brand-500 shadow-2xs"
                />
              </div>
            )}
          </div>
        );

      case "case-converter":
        return (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {(
              [
                { id: "uppercase", label: "UPPERCASE" },
                { id: "lowercase", label: "lowercase" },
                { id: "title", label: "Title Case" },
                { id: "sentence", label: "Sentence case" },
                { id: "camel", label: "camelCase" },
                { id: "pascal", label: "PascalCase" },
                { id: "snake", label: "snake_case" },
                { id: "kebab", label: "kebab-case" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCaseMode(item.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  caseMode === item.id
                    ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        );

      case "sort-lines":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Order:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="az">A → Z (Alphabetical)</option>
                <option value="za">Z → A (Reverse)</option>
                <option value="length-asc">Length: Shortest First</option>
                <option value="length-desc">Length: Longest First</option>
                <option value="random">Shuffle / Randomize</option>
                <option value="reverse">Reverse Existing Order</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={sortCase}
                onChange={(e) => setSortCase(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Case Sensitive</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={sortPreserveDups}
                onChange={(e) => setSortPreserveDups(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Preserve Duplicate Lines</span>
            </label>
          </div>
        );

      case "reverse-text":
        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Reverse Mode:</span>
            <div className="flex items-center gap-1">
              {(
                [
                  { id: "characters", label: "Characters (Full Inversion)" },
                  { id: "words", label: "Words in Line" },
                  { id: "lines", label: "Lines (Bottom to Top)" },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setReverseMode(item.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                    reverseMode === item.id
                      ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        );

      case "base64":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setBase64Mode("encode")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  base64Mode === "encode"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Encode
              </button>
              <button
                type="button"
                onClick={() => setBase64Mode("decode")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  base64Mode === "decode"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Decode
              </button>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={base64UrlSafe}
                onChange={(e) => setBase64UrlSafe(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>URL-Safe Base64 (- and _)</span>
            </label>
          </div>
        );

      case "url-encoder":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setUrlMode("encode")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  urlMode === "encode"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Encode
              </button>
              <button
                type="button"
                onClick={() => setUrlMode("decode")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  urlMode === "decode"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Decode
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Encoding Scope:</span>
              <select
                value={urlScope}
                onChange={(e) => setUrlScope(e.target.value as "component" | "full")}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="component">Component (encodeURIComponent - converts ?, &, =)</option>
                <option value="full">Full URI (encodeURI - preserves URL structure)</option>
              </select>
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
    lineNumStart,
    lineNumDelim,
    lineNumPadZeros,
    dedupeCase,
    dedupeTrim,
    emptyLinesMode,
    trimMode,
    trimRemoveEmpty,
    spacesMode,
    stripHtmlBreaks,
    stripHtmlEntities,
    lineBreaksSep,
    lineBreaksParagraphs,
    specialCharsMode,
    specialCharsCustom,
    caseMode,
    sortOrder,
    sortCase,
    sortPreserveDups,
    reverseMode,
    base64Mode,
    base64UrlSafe,
    urlMode,
    urlScope,
  ]);

  return (
    <ToolWorkspaceResolver
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
    />
  );
};