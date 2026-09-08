"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolWorkspaceResolver } from "@/components/layouts";
import { CopyButton } from "@/components/CopyButton";

// Import pure Phase 2, 3 & 4 tools
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
  formatAndValidateJson,
  convertJsonToCsv,
  convertCsvToJson,
  addLineNumbers,
  convertMarkdownToHtml,
  minifyHtml,
  HtmlMinifierResult,
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
  generateHash,
  HashAlgorithm,
  decodeJwt,
  generatePasswords,
  generateUuids,
  generateLoremIpsum,
  LoremUnit,
  rot13,
  convertFancyFont,
  generateAllFancyFonts,
  FancyFontStyle,
  FancyFontCategory,
  STYLE_METADATA,
  convertUnixTimestamp,
  getCurrentTimestamp,
  calculateDateDifference,
  parseDualDateString,
  requestAiTool,
  SLUG_TO_AI_MODE,
} from "@/lib/tools/index";
import { trackEvent } from "@/lib/analytics";
import { Sparkles, RefreshCw, AlertTriangle } from "lucide-react";

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

  // === Format Tools State ===
  const [jsonIndent, setJsonIndent] = useState<2 | 4 | "minify">(2);
  const [jsonSortKeys, setJsonSortKeys] = useState<boolean>(false);
  const [jsonToCsvDelim, setJsonToCsvDelim] = useState<string>(",");
  const [jsonToCsvQuoteAll, setJsonToCsvQuoteAll] = useState<boolean>(false);
  const [csvToJsonDelim, setCsvToJsonDelim] = useState<string>(",");
  const [csvToJsonHeaders, setCsvToJsonHeaders] = useState<boolean>(true);
  const [csvToJsonParseTypes, setCsvToJsonParseTypes] = useState<boolean>(true);
  const [lineNumStart, setLineNumStart] = useState<number>(1);
  const [lineNumDelim, setLineNumDelim] = useState<string>(". ");
  const [lineNumPadZeros, setLineNumPadZeros] = useState<boolean>(false);
  const [markdownView, setMarkdownView] = useState<"preview" | "source">("source");
  const [htmlMinifyComments, setHtmlMinifyComments] = useState<boolean>(true);
  const [htmlMinifyWs, setHtmlMinifyWs] = useState<boolean>(true);
  const [htmlMinifyStats, setHtmlMinifyStats] = useState<HtmlMinifierResult | null>(null);

  // === Cleanup Tools State ===
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

  // === Transform Tools State ===
  const [caseMode, setCaseMode] = useState<CaseMode>("uppercase");
  const [sortOrder, setSortOrder] = useState<SortOrder>("az");
  const [sortCase, setSortCase] = useState<boolean>(false);
  const [sortPreserveDups, setSortPreserveDups] = useState<boolean>(true);
  const [reverseMode, setReverseMode] = useState<ReverseMode>("characters");
  const [base64Mode, setBase64Mode] = useState<"encode" | "decode">("encode");
  const [base64UrlSafe, setBase64UrlSafe] = useState<boolean>(false);
  const [urlMode, setUrlMode] = useState<"encode" | "decode">("encode");
  const [urlScope, setUrlScope] = useState<"component" | "full">("component");
  const [hashAlgo, setHashAlgo] = useState<HashAlgorithm>("SHA-256");
  const [hashUpper, setHashUpper] = useState<boolean>(false);
  const [allHashes, setAllHashes] = useState<{ [algo: string]: string }>({});
  const [jwtView, setJwtView] = useState<"visual" | "raw">("visual");
  const [pwLength, setPwLength] = useState<number>(16);
  const [pwUpper, setPwUpper] = useState<boolean>(true);
  const [pwLower, setPwLower] = useState<boolean>(true);
  const [pwNumbers, setPwNumbers] = useState<boolean>(true);
  const [pwSymbols, setPwSymbols] = useState<boolean>(true);
  const [pwExcludeAmbiguous, setPwExcludeAmbiguous] = useState<boolean>(false);
  const [pwCount, setPwCount] = useState<number>(1);
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidUpper, setUuidUpper] = useState<boolean>(false);
  const [uuidNoHyphens, setUuidNoHyphens] = useState<boolean>(false);
  const [loremUnit, setLoremUnit] = useState<LoremUnit>("paragraphs");
  const [loremCount, setLoremCount] = useState<number>(3);
  const [loremStartWith, setLoremStartWith] = useState<boolean>(true);
  const [fancyStyle, setFancyStyle] = useState<FancyFontStyle | "all">("all");
  const [fancyCategoryFilter, setFancyCategoryFilter] = useState<FancyFontCategory>("all");
  const [fancySearch, setFancySearch] = useState<string>("");

  // === Date & Time Tools State ===
  const [unixUnit, setUnixUnit] = useState<"auto" | "seconds" | "milliseconds">("auto");
  const [unixTz, setUnixTz] = useState<string>("local");
  const [dateDiffIncludeEnd, setDateDiffIncludeEnd] = useState<boolean>(false);
  const [dateDiffTz, setDateDiffTz] = useState<string>("UTC");

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

          // --- Format Tools ---
          case "json-formatter": {
            const res = formatAndValidateJson(currentInput, {
              indentation: jsonIndent,
              sortKeys: jsonSortKeys,
            });
            if (!res.isValid) {
              setError(res.error || "Invalid JSON syntax");
              setOutput("");
            } else {
              setOutput(res.formatted);
            }
            break;
          }

          case "json-to-csv": {
            const res = convertJsonToCsv(currentInput, {
              delimiter: jsonToCsvDelim,
              quoteAll: jsonToCsvQuoteAll,
            });
            setOutput(res);
            break;
          }

          case "csv-to-json": {
            const res = convertCsvToJson(currentInput, {
              delimiter: csvToJsonDelim,
              hasHeaders: csvToJsonHeaders,
              parseNumbersAndBooleans: csvToJsonParseTypes,
            });
            setOutput(res);
            break;
          }

          case "add-line-numbers": {
            setOutput(
              addLineNumbers(currentInput, {
                startNumber: lineNumStart,
                delimiter: lineNumDelim,
                padWithZeros: lineNumPadZeros,
              })
            );
            break;
          }

          case "markdown-to-html": {
            setOutput(convertMarkdownToHtml(currentInput));
            break;
          }

          case "html-minifier": {
            const res = minifyHtml(currentInput, {
              stripComments: htmlMinifyComments,
              collapseWhitespace: htmlMinifyWs,
            });
            setHtmlMinifyStats(res);
            setOutput(res.minified);
            break;
          }

          // --- Cleanup Tools ---
          case "remove-duplicate-lines": {
            setOutput(removeDuplicateLines(currentInput, { caseSensitive: dedupeCase, trimBeforeCompare: dedupeTrim }));
            break;
          }

          case "remove-empty-lines": {
            setOutput(removeEmptyLines(currentInput, { mode: emptyLinesMode }));
            break;
          }

          case "trim-lines": {
            setOutput(trimLines(currentInput, { mode: trimMode, removeEmptyLines: trimRemoveEmpty }));
            break;
          }

          case "remove-extra-spaces": {
            setOutput(removeExtraSpaces(currentInput, { collapseType: spacesMode }));
            break;
          }

          case "strip-html-tags": {
            setOutput(stripHtmlTags(currentInput, { preserveLineBreaks: stripHtmlBreaks, decodeEntities: stripHtmlEntities }));
            break;
          }

          case "remove-line-breaks": {
            setOutput(removeLineBreaks(currentInput, { separator: lineBreaksSep, collapseParagraphs: lineBreaksParagraphs }));
            break;
          }

          case "remove-special-chars": {
            setOutput(removeSpecialChars(currentInput, {
              mode: specialCharsMode,
              customAllowedChars: specialCharsCustom,
            }));
            break;
          }

          // --- Transform Tools ---
          case "case-converter": {
            setOutput(convertCase(currentInput, caseMode));
            break;
          }

          case "sort-lines": {
            setOutput(
              sortLines(currentInput, {
                order: sortOrder,
                caseSensitive: sortCase,
                preserveDuplicates: sortPreserveDups,
              })
            );
            break;
          }

          case "reverse-text": {
            setOutput(reverseText(currentInput, reverseMode));
            break;
          }

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

          case "hash-generator": {
            const algos: HashAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512", "SHA-1"];
            Promise.all(
              algos.map((algo) =>
                generateHash(currentInput, { algorithm: algo, uppercase: hashUpper }).then((r) => ({
                  algo,
                  hash: r.hash,
                }))
              )
            )
              .then((results) => {
                const map: { [algo: string]: string } = {};
                results.forEach((r) => {
                  map[r.algo] = r.hash;
                });
                setAllHashes(map);
                setOutput(map[hashAlgo] || results[0]?.hash || "");
              })
              .catch((err) => {
                setError(err instanceof Error ? err.message : "Hashing failed");
              });
            break;
          }

          case "jwt-decoder": {
            const res = decodeJwt(currentInput);
            if (res.error) {
              setError(res.error);
            }
            if (res.payload) {
              setOutput(res.formattedPayload);
            } else if (res.header) {
              setOutput(res.formattedHeader);
            } else {
              setOutput("");
            }
            break;
          }

          case "password-generator": {
            const res = generatePasswords({
              length: pwLength,
              uppercase: pwUpper,
              lowercase: pwLower,
              numbers: pwNumbers,
              symbols: pwSymbols,
              excludeAmbiguous: pwExcludeAmbiguous,
              count: pwCount,
            });
            setOutput(res.passwords.join("\n"));
            break;
          }

          case "uuid-generator": {
            const uuids = generateUuids({
              count: uuidCount,
              uppercase: uuidUpper,
              removeHyphens: uuidNoHyphens,
            });
            setOutput(uuids.join("\n"));
            break;
          }

          case "lorem-ipsum": {
            setOutput(
              generateLoremIpsum({
                unit: loremUnit,
                count: loremCount,
                startWithLoremIpsum: loremStartWith,
              })
            );
            break;
          }

          case "rot13": {
            setOutput(rot13(currentInput));
            break;
          }

          case "fancy-fonts": {
            if (fancyStyle === "all") {
              const all = generateAllFancyFonts(currentInput);
              setOutput(
                all
                  .map((item) => `[${item.name}]\n${item.preview}`)
                  .join("\n\n")
              );
            } else {
              setOutput(convertFancyFont(currentInput, fancyStyle));
            }
            break;
          }

          // --- Date & Time Tools ---
          case "unix-timestamp": {
            const res = convertUnixTimestamp(currentInput, {
              unit: unixUnit,
              timezone: unixTz,
            });
            if (res.error) {
              setError(res.error);
            }
            setOutput(res.formattedReport);
            break;
          }

          case "date-difference": {
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
            break;
          }

          // --- AI Magic Tools ---
          case "ai-grammar":
          case "ai-professional":
          case "ai-friendly":
          case "ai-summarize":
          case "ai-paraphrase":
          case "ai-expand": {
            const aiMode = SLUG_TO_AI_MODE[tool.slug] || "grammar";
            setIsLoading(true);
            requestAiTool(aiMode, currentInput)
              .then((aiResult) => {
                setOutput(aiResult);
              })
              .catch((err) => {
                setError(err instanceof Error ? err.message : "AI transformation failed.");
              })
              .finally(() => {
                setIsLoading(false);
              });
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
      jsonIndent,
      jsonSortKeys,
      jsonToCsvDelim,
      jsonToCsvQuoteAll,
      csvToJsonDelim,
      csvToJsonHeaders,
      csvToJsonParseTypes,
      lineNumStart,
      lineNumDelim,
      lineNumPadZeros,
      htmlMinifyComments,
      htmlMinifyWs,
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
      hashAlgo,
      hashUpper,
      jwtView,
      pwLength,
      pwUpper,
      pwLower,
      pwNumbers,
      pwSymbols,
      pwExcludeAmbiguous,
      pwCount,
      uuidCount,
      uuidUpper,
      uuidNoHyphens,
      loremUnit,
      loremCount,
      loremStartWith,
      fancyStyle,
      unixUnit,
      unixTz,
      dateDiffTz,
      dateDiffIncludeEnd,
    ]
  );

  // Track tool_opened on mount
  useEffect(() => {
    trackEvent("tool_opened", {
      toolSlug: tool.slug,
      category: tool.category,
    });
  }, [tool.slug, tool.category]);

  // Live Auto-Run for tools supporting live mode
  useEffect(() => {
    if (tool.supportsLiveMode) {
      executeTool(input);
    }
  }, [input, tool.supportsLiveMode, executeTool]);

  const handleRun = () => {
    setIsLoading(true);
    trackEvent(tool.category === "AI Magic" ? "ai_tool_used" : "tool_used", {
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

  // Custom Controls for Specialized Tools
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
                        className={`px-2 py-0.5 rounded font-mono text-xs font-semibold transition-colors ${
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

      case "query-string-parser":
        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Display Format:</span>
            <div className="flex items-center gap-1">
              {(["table", "json", "text"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setQueryView(mode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
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

      // --- Format Controls ---
      case "json-formatter":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Indentation:</span>
              <select
                value={jsonIndent}
                onChange={(e) =>
                  setJsonIndent(
                    e.target.value === "minify" ? "minify" : (parseInt(e.target.value) as 2 | 4)
                  )
                }
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="minify">Minify (Compact)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={jsonSortKeys}
                onChange={(e) => setJsonSortKeys(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Sort Keys A-Z</span>
            </label>
          </div>
        );

      case "json-to-csv":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Delimiter:</span>
              <select
                value={jsonToCsvDelim}
                onChange={(e) => setJsonToCsvDelim(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="&#9;">Tab (\t)</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={jsonToCsvQuoteAll}
                onChange={(e) => setJsonToCsvQuoteAll(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Quote All Fields</span>
            </label>
          </div>
        );

      case "csv-to-json":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Delimiter:</span>
              <select
                value={csvToJsonDelim}
                onChange={(e) => setCsvToJsonDelim(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="&#9;">Tab (\t)</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={csvToJsonHeaders}
                onChange={(e) => setCsvToJsonHeaders(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>First Row is Header</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={csvToJsonParseTypes}
                onChange={(e) => setCsvToJsonParseTypes(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Auto-parse Numbers & Booleans</span>
            </label>
          </div>
        );

      case "add-line-numbers":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Start Number:</span>
              <input
                type="number"
                min={0}
                value={lineNumStart}
                onChange={(e) => setLineNumStart(Math.max(0, parseInt(e.target.value) || 1))}
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
                <option value=". ">Period & Space (&ldquo;. &rdquo;)</option>
                <option value=" | ">Pipe (&ldquo; | &rdquo;)</option>
                <option value=": ">Colon (&ldquo;: &rdquo;)</option>
                <option value=") ">Parenthesis (&ldquo;) &rdquo;)</option>
                <option value="	">Tab</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={lineNumPadZeros}
                onChange={(e) => setLineNumPadZeros(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Pad with Zeros</span>
            </label>
          </div>
        );

      case "markdown-to-html":
        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Output View:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMarkdownView("source")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  markdownView === "source"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                HTML Source
              </button>
              <button
                type="button"
                onClick={() => setMarkdownView("preview")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  markdownView === "preview"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Rendered Preview
              </button>
            </div>
          </div>
        );

      case "html-minifier":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={htmlMinifyComments}
                onChange={(e) => setHtmlMinifyComments(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Strip Comments</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={htmlMinifyWs}
                onChange={(e) => setHtmlMinifyWs(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Collapse Whitespace</span>
            </label>

            {htmlMinifyStats && htmlMinifyStats.originalSizeBytes > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-semibold">
                Saved {htmlMinifyStats.savedPercentage}% (
                {htmlMinifyStats.originalSizeBytes} → {htmlMinifyStats.minifiedSizeBytes} B)
              </span>
            )}
          </div>
        );

      // --- Cleanup Controls ---
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
              <span>Case Sensitive</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={dedupeTrim}
                onChange={(e) => setDedupeTrim(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Trim Lines Before Comparing</span>
            </label>
          </div>
        );

      case "remove-empty-lines":
        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Mode:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setEmptyLinesMode("remove-all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
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
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  emptyLinesMode === "preserve-paragraphs"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Preserve Paragraphs (Keep 1 Blank)
              </button>
            </div>
          </div>
        );

      case "trim-lines":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Trim:</span>
              <select
                value={trimMode}
                onChange={(e) => setTrimMode(e.target.value as "both" | "leading" | "trailing")}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="both">Both Ends</option>
                <option value="leading">Leading Only</option>
                <option value="trailing">Trailing Only</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={trimRemoveEmpty}
                onChange={(e) => setTrimRemoveEmpty(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Remove Empty Lines</span>
            </label>
          </div>
        );

      case "remove-extra-spaces":
        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Scope:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSpacesMode("spaces-only")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  spacesMode === "spaces-only"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Spaces Only (Keep Tabs & Newlines)
              </button>
              <button
                type="button"
                onClick={() => setSpacesMode("all-whitespace")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  spacesMode === "all-whitespace"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                All Whitespace (One Single Line)
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
              <span>Preserve Line Breaks on Blocks</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={stripHtmlEntities}
                onChange={(e) => setStripHtmlEntities(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Decode Entities (e.g. &amp; → &)</span>
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
                <option value=" ">Space (&ldquo; &rdquo;)</option>
                <option value=", ">Comma & Space (&ldquo;, &rdquo;)</option>
                <option value="; ">Semicolon & Space (&ldquo;; &rdquo;)</option>
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
              <span>Keep Double Line Breaks (Paragraphs)</span>
            </label>
          </div>
        );

      case "remove-special-chars":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Preset:</span>
              <select
                value={specialCharsMode}
                onChange={(e) =>
                  setSpecialCharsMode(
                    e.target.value as "alphanumeric-only" | "keep-punctuation" | "custom"
                  )
                }
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="alphanumeric-only">Alphanumeric Only (Letters & Numbers)</option>
                <option value="keep-punctuation">Keep Standard Punctuation</option>
                <option value="custom">Custom Allowed Characters</option>
              </select>
            </div>
            {specialCharsMode === "custom" && (
              <div className="flex items-center gap-2">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Allowed:</span>
                <input
                  type="text"
                  value={specialCharsCustom}
                  onChange={(e) => setSpecialCharsCustom(e.target.value)}
                  placeholder="e.g. @._-/"
                  className="w-28 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-mono text-xs focus:outline-none focus:border-brand-500 shadow-2xs"
                />
              </div>
            )}
          </div>
        );

      // --- Transform Tools Controls ---
      case "case-converter":
        return (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Target Case:</span>
            {(
              [
                ["uppercase", "UPPERCASE"],
                ["lowercase", "lowercase"],
                ["title", "Title Case"],
                ["sentence", "Sentence case"],
                ["camel", "camelCase"],
                ["pascal", "PascalCase"],
                ["snake", "snake_case"],
                ["kebab", "kebab-case"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCaseMode(mode)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  caseMode === mode
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        );

      case "sort-lines":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Sort By:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="az">A → Z (Alphabetical)</option>
                <option value="za">Z → A (Reverse Alphabetical)</option>
                <option value="shortest-first">Shortest → Longest</option>
                <option value="longest-first">Longest → Shortest</option>
                <option value="numeric">Natural / Numeric</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={sortCase}
                onChange={(e) => setSortCase(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Case-Sensitive</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={sortPreserveDups}
                onChange={(e) => setSortPreserveDups(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Preserve Duplicates</span>
            </label>
          </div>
        );

      case "reverse-text":
        return (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Reverse:</span>
            {(
              [
                ["characters", "Characters (Mirror)"],
                ["words", "Word Order"],
                ["lines", "Line Sequence"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setReverseMode(mode)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  reverseMode === mode
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        );

      case "base64":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setBase64Mode("encode")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
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
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
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
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
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
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
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

      case "hash-generator":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              {(["SHA-256", "SHA-1", "SHA-384", "SHA-512"] as const).map((algo) => (
                <button
                  key={algo}
                  type="button"
                  onClick={() => setHashAlgo(algo)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    hashAlgo === algo
                      ? algo === "SHA-1"
                        ? "bg-amber-600 text-white"
                        : "bg-brand-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={hashUpper}
                onChange={(e) => setHashUpper(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>UPPERCASE Hex</span>
            </label>
            {hashAlgo === "SHA-1" && (
              <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                ⚠️ Legacy: SHA-1 is weak for security
              </span>
            )}
          </div>
        );

      case "jwt-decoder":
        return (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs w-full">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              <span>⚠️ Decoding Only: Does NOT verify cryptographic signature.</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setJwtView("visual")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  jwtView === "visual"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Visual Inspector
              </button>
              <button
                type="button"
                onClick={() => setJwtView("raw")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  jwtView === "raw"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                }`}
              >
                Raw JSON
              </button>
            </div>
          </div>
        );

      case "password-generator":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Length:</span>
              <input
                type="number"
                min={4}
                max={128}
                value={pwLength}
                onChange={(e) => setPwLength(Math.max(4, parseInt(e.target.value) || 16))}
                className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 text-center font-mono focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Count:</span>
              <input
                type="number"
                min={1}
                max={50}
                value={pwCount}
                onChange={(e) => setPwCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 text-center font-mono focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={pwUpper}
                onChange={(e) => setPwUpper(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 bg-white dark:bg-slate-800"
              />
              <span>A-Z</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={pwLower}
                onChange={(e) => setPwLower(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 bg-white dark:bg-slate-800"
              />
              <span>a-z</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={pwNumbers}
                onChange={(e) => setPwNumbers(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 bg-white dark:bg-slate-800"
              />
              <span>0-9</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={pwSymbols}
                onChange={(e) => setPwSymbols(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 bg-white dark:bg-slate-800"
              />
              <span>!@#$</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={pwExcludeAmbiguous}
                onChange={(e) => setPwExcludeAmbiguous(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 bg-white dark:bg-slate-800"
              />
              <span>No Ambiguous (il1Lo0O)</span>
            </label>
            <button
              type="button"
              onClick={() => handleRun()}
              className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium"
            >
              Regenerate
            </button>
          </div>
        );

      case "uuid-generator":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Quantity:</span>
              <input
                type="number"
                min={1}
                max={100}
                value={uuidCount}
                onChange={(e) => setUuidCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 text-center font-mono focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={uuidUpper}
                onChange={(e) => setUuidUpper(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 bg-white dark:bg-slate-800"
              />
              <span>UPPERCASE</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={uuidNoHyphens}
                onChange={(e) => setUuidNoHyphens(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 bg-white dark:bg-slate-800"
              />
              <span>Remove Hyphens</span>
            </label>
            <button
              type="button"
              onClick={() => handleRun()}
              className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium"
            >
              Generate Fresh UUIDs
            </button>
          </div>
        );

      case "lorem-ipsum":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Unit:</span>
              <select
                value={loremUnit}
                onChange={(e) => setLoremUnit(e.target.value as LoremUnit)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Count:</span>
              <input
                type="number"
                min={1}
                max={100}
                value={loremCount}
                onChange={(e) => setLoremCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 text-center font-mono focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={loremStartWith}
                onChange={(e) => setLoremStartWith(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 bg-white dark:bg-slate-800"
              />
              <span>Start with &ldquo;Lorem ipsum...&rdquo;</span>
            </label>
            <button
              type="button"
              onClick={() => handleRun()}
              className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium"
            >
              Generate
            </button>
          </div>
        );

      case "rot13":
        return (
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Caesar Cipher: Rotates ASCII letters by 13 positions (A ↔ N). Numbers, emojis, and Unicode are preserved intact.</span>
          </div>
        );

      case "fancy-fonts":
        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Style:</span>
            <select
              value={fancyStyle}
              onChange={(e) => setFancyStyle(e.target.value as FancyFontStyle | "all")}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs max-w-[260px] truncate"
            >
              <option value="all">✨ All Styles (Overview Cards)</option>
              <optgroup label="🔤 Alphabets & Letter Styles">
                <option value="gothic">Old English / Fraktur</option>
                <option value="bold-gothic">Bold Fraktur</option>
                <option value="script">Script / Cursive</option>
                <option value="bold-script">Bold Script Cursive</option>
                <option value="bold-serif">Bold Serif</option>
                <option value="italic-serif">Italic Serif</option>
                <option value="bold-italic-serif">Bold Italic Serif</option>
                <option value="bold-sans">Bold Sans-Serif</option>
                <option value="sans-italic">Sans-Serif Italic</option>
                <option value="sans-bold-italic">Sans Bold Italic</option>
                <option value="double-struck">Double-Struck / Blackboard</option>
                <option value="monospace">Monospace / Typewriter</option>
                <option value="fullwidth">Wide / Fullwidth</option>
                <option value="small-caps">Small Caps</option>
                <option value="superscript">Superscript (Tiny High)</option>
                <option value="subscript">Subscript (Tiny Low)</option>
                <option value="upside-down">Upside Down / Flipped</option>
                <option value="mirrored">Mirrored / Backwards</option>
                <option value="currency-symbols">Aesthetic Hacker / Symbols</option>
                <option value="katakana-style">Japanese Katakana Look</option>
                <option value="runic-style">Ancient Norse Runes</option>
                <option value="crazy-mix">Crazy Stylish Mixed</option>
              </optgroup>
              <optgroup label="⭕ Circled & Squared">
                <option value="circled">Circled / Bubble</option>
                <option value="circled-black">Black Bubble (Inverted)</option>
                <option value="squared">Squared Box</option>
                <option value="squared-black">Negative Black Square</option>
              </optgroup>
              <optgroup label="✂️ Combining Marks & Lines">
                <option value="strikethrough">Strikethrough Line</option>
                <option value="slash-strike">Slash Strike</option>
                <option value="underline">Underline Line</option>
                <option value="double-underline">Double Underline</option>
                <option value="tilde-strike">Tilde Strike Wave</option>
                <option value="cross-box">Cross Boxed Glyphs</option>
                <option value="sparkle-combining">Sparkle Ray Diacritic</option>
                <option value="seagull-below">Seagull Accent</option>
                <option value="bridge-above">Bridge Above Accent</option>
              </optgroup>
              <optgroup label="📦 Brackets & Frames">
                <option value="lenticular-brackets">Thick Lenticular 【】</option>
                <option value="corner-brackets">Corner Brackets 『』</option>
                <option value="white-brackets">White Brackets ⟦⟧</option>
                <option value="bar-boxed">Overline Bar Box [t̲̅]</option>
              </optgroup>
              <optgroup label="🔗 Joiners & Connectors">
                <option value="joiner-hearts">Hearts Connector (♥)</option>
                <option value="joiner-stars">Star Dust Connector (⋆)</option>
                <option value="joiner-bubbles">Bubble Connector (⊶)</option>
                <option value="joiner-blocks">Textured Shading (░)</option>
                <option value="joiner-dashed">Dashed Bar Divider (╎)</option>
                <option value="joiner-waves">Wave Ribbon (〜)</option>
              </optgroup>
              <optgroup label="🌟 Wings, Stars & Kaomoji">
                <option value="wings-stars">Stars & Wings ★彡...彡★</option>
                <option value="wings-sparkle">Sparkle Wings ミ★...★彡</option>
                <option value="royal-flourish">Royal Flourish ꧁•...•꧂</option>
                <option value="audio-waves">Audio Equalizer ıllıllı</option>
                <option value="cute-hearts">Cute Sparkle Hearts (◍•ᴗ•◍)</option>
                <option value="ribbon-hearts">Sweet Ribbon Hearts 💖</option>
                <option value="kaomoji-hug">Cute Kaomoji Hug (づ｡◕‿‿◕｡)づ</option>
                <option value="diamond-badge">Diamond Badge ◈━◈</option>
                <option value="sword-shield">Warrior Swords ⚔️</option>
                <option value="bookmark-love">Bookmark Love '*•.¸♡</option>
                <option value="magic-stars">Magic Dust ⋆✨</option>
                <option value="flower-blossom">Sakura Blossom 🌸💮</option>
              </optgroup>
            </select>
          </div>
        );

      // --- Date & Time Controls ---
      case "unix-timestamp":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Unit:</span>
              <select
                value={unixUnit}
                onChange={(e) =>
                  setUnixUnit(e.target.value as "auto" | "seconds" | "milliseconds")
                }
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
              className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium"
            >
              Insert Current Time (Now)
            </button>
          </div>
        );

      case "date-difference":
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
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Year 2026
              </button>
              <button
                type="button"
                onClick={() => setInput("2026-09-07 to 2026-12-25")}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Christmas 2026
              </button>
            </div>
          </div>
        );

      // --- AI Magic Tools Controls ---
      case "ai-grammar":
      case "ai-professional":
      case "ai-friendly":
      case "ai-summarize":
      case "ai-paraphrase":
      case "ai-expand":
        return (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium">
                <Sparkles size={13} className="text-blue-500 dark:text-blue-400" />
                Google Gemini
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Model: <strong className="text-slate-700 dark:text-slate-200">Gemini Flash</strong>
              </span>
              {input.length > 10000 ? (
                <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded">
                  <AlertTriangle size={13} />
                  Input exceeds limit ({input.length.toLocaleString()} / 10,000 chars)
                </span>
              ) : input.length > 8000 ? (
                <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                  <AlertTriangle size={13} />
                  Approaching limit ({input.length.toLocaleString()} / 10,000 chars)
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {error && (
                <button
                  type="button"
                  onClick={() => handleRun()}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors"
                >
                  <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
                  Retry
                </button>
              )}
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
    jsonIndent,
    jsonSortKeys,
    jsonToCsvDelim,
    jsonToCsvQuoteAll,
    csvToJsonDelim,
    csvToJsonHeaders,
    csvToJsonParseTypes,
    lineNumStart,
    lineNumDelim,
    lineNumPadZeros,
    markdownView,
    htmlMinifyComments,
    htmlMinifyWs,
    htmlMinifyStats,
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
    hashAlgo,
    hashUpper,
    jwtView,
    pwLength,
    pwCount,
    pwUpper,
    pwLower,
    pwNumbers,
    pwSymbols,
    pwExcludeAmbiguous,
    uuidCount,
    uuidUpper,
    uuidNoHyphens,
    loremUnit,
    loremCount,
    loremStartWith,
    fancyStyle,
    unixUnit,
    unixTz,
    dateDiffTz,
    dateDiffIncludeEnd,
  ]);

  // Custom Interactive Previews
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

    if (tool.slug === "markdown-to-html" && markdownView === "preview") {
      const html = convertMarkdownToHtml(input);
      return (
        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-3 p-2">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      );
    }

    if (tool.slug === "jwt-decoder" && jwtView === "visual") {
      const decoded = decodeJwt(input);
      if (!input.trim()) {
        return (
          <div className="text-slate-500 dark:text-slate-400 text-xs py-8 text-center font-mono">
            Paste a JWT (JSON Web Token) to inspect header, claims, and payload.
          </div>
        );
      }

      if (!decoded.isValid) {
        return (
          <div className="p-4 rounded-xl border border-rose-500/25 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-xs space-y-2">
            <div className="font-semibold flex items-center gap-1.5">
              <span>✕ Invalid JWT</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">{decoded.error}</p>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-medium">
            {decoded.warning}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {decoded.algorithm && (
              <span className="px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 text-pink-700 dark:text-pink-400 font-mono font-medium">
                Algorithm: {decoded.algorithm}
              </span>
            )}
            {decoded.isExpired !== undefined && (
              <span
                className={`px-2.5 py-1 rounded-lg font-mono font-medium border ${
                  decoded.isExpired
                    ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400"
                    : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                }`}
              >
                {decoded.isExpired ? "Status: Expired" : "Status: Active (Not Expired)"}
              </span>
            )}
            {decoded.expiresAt && (
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                Exp: {decoded.expiresAt}
              </span>
            )}
          </div>

          {/* Header Card */}
          <div className="p-3.5 rounded-xl border border-pink-200 dark:border-pink-500/20 bg-pink-50/60 dark:bg-pink-950/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-pink-700 dark:text-pink-400 uppercase tracking-wider">
                Header: Algorithm & Token Type
              </span>
            </div>
            <pre className="text-xs font-mono text-pink-900 dark:text-pink-200 bg-white dark:bg-slate-950/50 p-3 rounded-lg overflow-x-auto border border-pink-200/80 dark:border-pink-500/10">
              {decoded.formattedHeader}
            </pre>
          </div>

          {/* Payload Card */}
          <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-500/20 bg-purple-50/60 dark:bg-purple-950/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                Payload: Data Claims
              </span>
            </div>
            <pre className="text-xs font-mono text-purple-900 dark:text-purple-200 bg-white dark:bg-slate-950/50 p-3 rounded-lg overflow-x-auto border border-purple-200/80 dark:border-purple-500/10">
              {decoded.formattedPayload}
            </pre>
          </div>

          {/* Signature Card */}
          <div className="p-3.5 rounded-xl border border-cyan-200 dark:border-cyan-500/20 bg-cyan-50/60 dark:bg-cyan-950/10 space-y-2">
            <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
              Signature (Raw Base64)
            </span>
            <div className="text-xs font-mono text-cyan-900 dark:text-cyan-200 bg-white dark:bg-slate-950/50 p-2.5 rounded-lg break-all border border-cyan-200/80 dark:border-cyan-500/10">
              {decoded.signature || "(No signature)"}
            </div>
          </div>
        </div>
      );
    }


    if (tool.slug === "password-generator") {
      const res = generatePasswords({
        length: pwLength,
        uppercase: pwUpper,
        lowercase: pwLower,
        numbers: pwNumbers,
        symbols: pwSymbols,
        excludeAmbiguous: pwExcludeAmbiguous,
        count: pwCount,
      });

      const strengthColors = {
        "very-weak": "text-rose-500 bg-rose-500/10 border-rose-500/20",
        weak: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
        strong: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        "very-strong": "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      };

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Strength:</span>
              <span
                className={`px-2.5 py-0.5 rounded-md font-semibold text-xs border uppercase tracking-wider ${
                  strengthColors[res.strength]
                }`}
              >
                {res.strength.replace("-", " ")}
              </span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              ~{res.entropyBits} bits of entropy
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {res.passwords.map((pw, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-mono shadow-2xs"
              >
                <span className="text-slate-900 dark:text-slate-100 font-semibold tracking-wider break-all select-all">
                  {pw}
                </span>
                <CopyButton text={pw} variant="ghost" />
              </div>
            ))}
          </div>
        </div>
      );
    }

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
                <CopyButton text={res.emails.join("\n")} label="Copy All Emails" />
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
                <CopyButton text={res.urls.join("\n")} label="Copy All URLs" />
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

    if (tool.slug === "hash-generator") {
      const algos = [
        { name: "SHA-256", bits: 256, hash: allHashes["SHA-256"] || output },
        { name: "SHA-384", bits: 384, hash: allHashes["SHA-384"] || "" },
        { name: "SHA-512", bits: 512, hash: allHashes["SHA-512"] || "" },
        { name: "SHA-1 (Legacy)", bits: 160, hash: allHashes["SHA-1"] || "" },
      ];
      return (
        <div className="space-y-3">
          {algos.map((item) => (
            <div key={item.name} className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
              <div className="min-w-[130px] shrink-0">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">{item.bits} bits</div>
              </div>
              <div className="flex-1 font-mono text-xs text-slate-700 dark:text-slate-300 break-all select-all py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60">
                {item.hash || (input ? "Calculating..." : "Awaiting input...")}
              </div>
              <div className="shrink-0 self-end sm:self-center">
                <CopyButton text={item.hash} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (tool.slug === "uuid-generator") {
      const uuids = output ? output.split("\n").filter(Boolean) : [];
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Generated UUIDs (RFC 4122 v4)</span>
            <span>{uuids.length} identifiers</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {uuids.map((id, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-mono">
                <span className="text-slate-900 dark:text-slate-100 font-semibold">{id}</span>
                <CopyButton text={id} variant="ghost" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  }, [
    tool.slug,
    input,
    output,
    allHashes,
    regexPattern,
    regexFlags,
    queryView,
    markdownView,
    jwtView,
    fancyStyle,
    pwLength,
    pwUpper,
    pwLower,
    pwNumbers,
    pwSymbols,
    pwExcludeAmbiguous,
    pwCount,
    uuidCount,
    uuidUpper,
    uuidNoHyphens,
    charSort,
    charIgnoreWs,
    charIgnoreCaps,
    wordSort,
    wordMinLen,
    wordIgnoreCaps,
    unixUnit,
    unixTz,
    dateDiffTz,
    dateDiffIncludeEnd,
  ]);

  const isFancyFonts = tool.slug === "fancy-fonts";

  const renderFancyFontsWorkspace = () => {
    const currentInput = input || "Text Tools Platform 2026";
    const allStyles = generateAllFancyFonts(currentInput);
    const filteredStyles = allStyles.filter((item) => {
      const matchesCat =
        fancyCategoryFilter === "all" || item.category === fancyCategoryFilter;
      const matchesSearch =
        !fancySearch.trim() ||
        item.name.toLowerCase().includes(fancySearch.toLowerCase()) ||
        item.preview.toLowerCase().includes(fancySearch.toLowerCase());
      return matchesCat && matchesSearch;
    });

    const categories: { id: FancyFontCategory; label: string }[] = [
      { id: "all", label: `All (${allStyles.length})` },
      { id: "alphabets", label: "🔤 Alphabets" },
      { id: "circled-squared", label: "⭕ Circled & Boxed" },
      { id: "combining-lines", label: "✂️ Lines & Glitch" },
      { id: "brackets-boxes", label: "📦 Brackets" },
      { id: "joiners", label: "🔗 Connectors" },
      { id: "decorations-wings", label: "🌟 Wings & Cute" },
    ];

    return (
      <div className="space-y-5">
        {/* Full-Width Top Input Box */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/60 overflow-hidden shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/50">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
                Type or paste text to stylize
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live preview enabled • {allStyles.length}+ styles
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInput("Stylish Text 2026")}
                className="inline-flex items-center justify-center min-h-[36px] sm:min-h-[40px] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                Load Sample
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setOutput("");
                }}
                disabled={!input}
                className="inline-flex items-center justify-center min-h-[36px] sm:min-h-[40px] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-200 dark:border-slate-700/80 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                title="Clear text"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="p-4 bg-white/50 dark:bg-slate-950/20">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your text here (e.g. your name, bio, gaming nickname, or message)..."
              rows={3}
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-sans text-base sm:text-lg resize-y focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>
              {(input || "").length} characters • {(input || "").trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">
              Instant client-side generation
            </span>
          </div>
        </div>

        {/* Filter Bar: Category Tabs & Local Font Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFancyCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  fancyCategoryFilter === cat.id
                    ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs"
                    : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200/90 dark:border-slate-700/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px] md:w-64">
            <input
              type="text"
              placeholder="Filter font styles..."
              aria-label="Filter font styles"
              value={fancySearch}
              onChange={(e) => setFancySearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl pl-3.5 pr-8 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all shadow-xs"
            />
            {fancySearch && (
              <button
                type="button"
                onClick={() => setFancySearch("")}
                aria-label="Clear filter search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Cards Grid: Compact cards with title case, 12px labels, and comfortable preview */}
        {filteredStyles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 text-sm">
            No font styles found matching &quot;{fancySearch}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredStyles.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-2.5 group shadow-xs hover:shadow-cardHover"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate tracking-normal">
                    {item.name}
                  </span>
                  <CopyButton text={item.preview} />
                </div>
                <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 break-words select-all leading-normal py-0.5 min-h-[38px] flex items-center font-sans">
                  {item.preview}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

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
      customControls={isFancyFonts ? null : customControls}
      customPreview={customPreview}
      customWorkspace={isFancyFonts ? renderFancyFontsWorkspace() : undefined}
    />
  );
};
