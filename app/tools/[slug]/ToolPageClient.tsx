"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolLayout } from "@/components/ToolLayout";
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
            generateHash(currentInput, {
              algorithm: hashAlgo,
              uppercase: hashUpper,
            })
              .then((res) => {
                setOutput(res.hash);
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

      // --- Format Controls ---
      case "json-formatter":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Indentation:</span>
              <select
                value={jsonIndent}
                onChange={(e) =>
                  setJsonIndent(
                    e.target.value === "minify" ? "minify" : (parseInt(e.target.value) as 2 | 4)
                  )
                }
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="minify">Minify (Compact)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={jsonSortKeys}
                onChange={(e) => setJsonSortKeys(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Sort Keys A-Z</span>
            </label>
          </div>
        );

      case "json-to-csv":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Delimiter:</span>
              <select
                value={jsonToCsvDelim}
                onChange={(e) => setJsonToCsvDelim(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="&#9;">Tab (\t)</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={jsonToCsvQuoteAll}
                onChange={(e) => setJsonToCsvQuoteAll(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Quote All Fields</span>
            </label>
          </div>
        );

      case "csv-to-json":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Delimiter:</span>
              <select
                value={csvToJsonDelim}
                onChange={(e) => setCsvToJsonDelim(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="&#9;">Tab (\t)</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={csvToJsonHeaders}
                onChange={(e) => setCsvToJsonHeaders(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>First Row is Header</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={csvToJsonParseTypes}
                onChange={(e) => setCsvToJsonParseTypes(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Auto-parse Numbers & Booleans</span>
            </label>
          </div>
        );

      case "add-line-numbers":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Start Number:</span>
              <input
                type="number"
                min={0}
                value={lineNumStart}
                onChange={(e) => setLineNumStart(Math.max(0, parseInt(e.target.value) || 1))}
                className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 font-mono text-center focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Delimiter:</span>
              <select
                value={lineNumDelim}
                onChange={(e) => setLineNumDelim(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value=". ">Period & Space (&ldquo;. &rdquo;)</option>
                <option value=" | ">Pipe (&ldquo; | &rdquo;)</option>
                <option value=": ">Colon (&ldquo;: &rdquo;)</option>
                <option value=") ">Parenthesis (&ldquo;) &rdquo;)</option>
                <option value="	">Tab</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={lineNumPadZeros}
                onChange={(e) => setLineNumPadZeros(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Pad with Zeros</span>
            </label>
          </div>
        );

      case "markdown-to-html":
        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Output View:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMarkdownView("source")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  markdownView === "source"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={htmlMinifyComments}
                onChange={(e) => setHtmlMinifyComments(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Strip Comments</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={htmlMinifyWs}
                onChange={(e) => setHtmlMinifyWs(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
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
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={dedupeCase}
                onChange={(e) => setDedupeCase(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Case Sensitive</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={dedupeTrim}
                onChange={(e) => setDedupeTrim(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
              <span className="text-slate-400">Trim:</span>
              <select
                value={trimMode}
                onChange={(e) => setTrimMode(e.target.value as "both" | "leading" | "trailing")}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="both">Both Ends</option>
                <option value="leading">Leading Only</option>
                <option value="trailing">Trailing Only</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={trimRemoveEmpty}
                onChange={(e) => setTrimRemoveEmpty(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Remove Empty Lines</span>
            </label>
          </div>
        );

      case "remove-extra-spaces":
        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Scope:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSpacesMode("spaces-only")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  spacesMode === "spaces-only"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={stripHtmlBreaks}
                onChange={(e) => setStripHtmlBreaks(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Preserve Line Breaks on Blocks</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={stripHtmlEntities}
                onChange={(e) => setStripHtmlEntities(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Decode Entities (e.g. &amp; → &)</span>
            </label>
          </div>
        );

      case "remove-line-breaks":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Replace With:</span>
              <select
                value={lineBreaksSep}
                onChange={(e) => setLineBreaksSep(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value=" ">Space (&ldquo; &rdquo;)</option>
                <option value=", ">Comma & Space (&ldquo;, &rdquo;)</option>
                <option value="; ">Semicolon & Space (&ldquo;; &rdquo;)</option>
                <option value="">Nothing (Join Directly)</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={lineBreaksParagraphs}
                onChange={(e) => setLineBreaksParagraphs(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Keep Double Line Breaks (Paragraphs)</span>
            </label>
          </div>
        );

      case "remove-special-chars":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Preset:</span>
              <select
                value={specialCharsMode}
                onChange={(e) =>
                  setSpecialCharsMode(
                    e.target.value as "alphanumeric-only" | "keep-punctuation" | "custom"
                  )
                }
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="alphanumeric-only">Alphanumeric Only (Letters & Numbers)</option>
                <option value="keep-punctuation">Keep Standard Punctuation</option>
                <option value="custom">Custom Allowed Characters</option>
              </select>
            </div>
            {specialCharsMode === "custom" && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Allowed:</span>
                <input
                  type="text"
                  value={specialCharsCustom}
                  onChange={(e) => setSpecialCharsCustom(e.target.value)}
                  placeholder="e.g. @._-/"
                  className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-brand-500"
                />
              </div>
            )}
          </div>
        );

      // --- Transform Tools Controls ---
      case "case-converter":
        return (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Target Case:</span>
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
              <span className="text-slate-400">Sort By:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="az">A → Z (Alphabetical)</option>
                <option value="za">Z → A (Reverse Alphabetical)</option>
                <option value="shortest-first">Shortest → Longest</option>
                <option value="longest-first">Longest → Shortest</option>
                <option value="numeric">Natural / Numeric</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={sortCase}
                onChange={(e) => setSortCase(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Case-Sensitive</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={sortPreserveDups}
                onChange={(e) => setSortPreserveDups(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
              />
              <span>Preserve Duplicates</span>
            </label>
          </div>
        );

      case "reverse-text":
        return (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Reverse:</span>
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Decode
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={base64UrlSafe}
                onChange={(e) => setBase64UrlSafe(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Decode
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Encoding Scope:</span>
              <select
                value={urlScope}
                onChange={(e) => setUrlScope(e.target.value as "component" | "full")}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
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
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={hashUpper}
                onChange={(e) => setHashUpper(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 bg-slate-800"
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
              <span className="text-slate-400">Length:</span>
              <input
                type="number"
                min={4}
                max={128}
                value={pwLength}
                onChange={(e) => setPwLength(Math.max(4, parseInt(e.target.value) || 16))}
                className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-center font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Count:</span>
              <input
                type="number"
                min={1}
                max={50}
                value={pwCount}
                onChange={(e) => setPwCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-center font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={pwUpper}
                onChange={(e) => setPwUpper(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 bg-slate-800"
              />
              <span>A-Z</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={pwLower}
                onChange={(e) => setPwLower(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 bg-slate-800"
              />
              <span>a-z</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={pwNumbers}
                onChange={(e) => setPwNumbers(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 bg-slate-800"
              />
              <span>0-9</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={pwSymbols}
                onChange={(e) => setPwSymbols(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 bg-slate-800"
              />
              <span>!@#$</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={pwExcludeAmbiguous}
                onChange={(e) => setPwExcludeAmbiguous(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 bg-slate-800"
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
              <span className="text-slate-400">Quantity:</span>
              <input
                type="number"
                min={1}
                max={100}
                value={uuidCount}
                onChange={(e) => setUuidCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-center font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={uuidUpper}
                onChange={(e) => setUuidUpper(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 bg-slate-800"
              />
              <span>UPPERCASE</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={uuidNoHyphens}
                onChange={(e) => setUuidNoHyphens(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 bg-slate-800"
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
              <span className="text-slate-400">Unit:</span>
              <select
                value={loremUnit}
                onChange={(e) => setLoremUnit(e.target.value as LoremUnit)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Count:</span>
              <input
                type="number"
                min={1}
                max={100}
                value={loremCount}
                onChange={(e) => setLoremCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-center font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={loremStartWith}
                onChange={(e) => setLoremStartWith(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 bg-slate-800"
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
            <span className="text-slate-400">Style:</span>
            <select
              value={fancyStyle}
              onChange={(e) => setFancyStyle(e.target.value as FancyFontStyle | "all")}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Styles (Overview Cards)</option>
              <option value="gothic">Gothic / Fraktur</option>
              <option value="bold-sans">Bold Sans-Serif</option>
              <option value="script">Script / Cursive</option>
              <option value="circled">Circled / Bubble</option>
              <option value="double-struck">Double-Struck / Blackboard</option>
              <option value="monospace">Monospace / Typewriter</option>
            </select>
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

    if (tool.slug === "markdown-to-html" && markdownView === "preview") {
      const html = convertMarkdownToHtml(input);
      return (
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 p-2">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      );
    }

    if (tool.slug === "jwt-decoder" && jwtView === "visual") {
      const decoded = decodeJwt(input);
      if (!input.trim()) {
        return (
          <div className="text-slate-400 text-xs py-8 text-center font-mono">
            Paste a JWT (JSON Web Token) to inspect header, claims, and payload.
          </div>
        );
      }

      if (!decoded.isValid) {
        return (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-300 text-xs space-y-2">
            <div className="font-semibold flex items-center gap-1.5">
              <span>✕ Invalid JWT</span>
            </div>
            <p className="text-slate-400">{decoded.error}</p>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs">
            {decoded.warning}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {decoded.algorithm && (
              <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 font-mono font-medium">
                Algorithm: {decoded.algorithm}
              </span>
            )}
            {decoded.isExpired !== undefined && (
              <span
                className={`px-2.5 py-1 rounded-lg font-mono font-medium border ${
                  decoded.isExpired
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}
              >
                {decoded.isExpired ? "Status: Expired" : "Status: Active (Not Expired)"}
              </span>
            )}
            {decoded.expiresAt && (
              <span className="text-slate-400 text-[11px]">
                Exp: {decoded.expiresAt}
              </span>
            )}
          </div>

          {/* Header Card */}
          <div className="p-3.5 rounded-xl border border-pink-500/20 bg-pink-950/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
                Header: Algorithm & Token Type
              </span>
            </div>
            <pre className="text-xs font-mono text-pink-200 bg-slate-950/50 p-3 rounded-lg overflow-x-auto border border-pink-500/10">
              {decoded.formattedHeader}
            </pre>
          </div>

          {/* Payload Card */}
          <div className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-950/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Payload: Data Claims
              </span>
            </div>
            <pre className="text-xs font-mono text-purple-200 bg-slate-950/50 p-3 rounded-lg overflow-x-auto border border-purple-500/10">
              {decoded.formattedPayload}
            </pre>
          </div>

          {/* Signature Card */}
          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-950/10 space-y-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Signature (Raw Base64)
            </span>
            <div className="text-xs font-mono text-cyan-200 bg-slate-950/50 p-2.5 rounded-lg break-all border border-cyan-500/10">
              {decoded.signature || "(No signature)"}
            </div>
          </div>
        </div>
      );
    }

    if (tool.slug === "fancy-fonts" && fancyStyle === "all") {
      const styles = generateAllFancyFonts(input || "Text Tools");
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {styles.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {item.name}
                </span>
                <CopyButton text={item.preview} variant="ghost" />
              </div>
              <div className="text-sm font-medium text-slate-100 break-words font-mono">
                {item.preview}
              </div>
            </div>
          ))}
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
              <span className="text-slate-400">Strength:</span>
              <span
                className={`px-2.5 py-0.5 rounded-md font-semibold text-xs border uppercase tracking-wider ${
                  strengthColors[res.strength]
                }`}
              >
                {res.strength.replace("-", " ")}
              </span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">
              ~{res.entropyBits} bits of entropy
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {res.passwords.map((pw, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs font-mono"
              >
                <span className="text-slate-100 font-semibold tracking-wider break-all select-all">
                  {pw}
                </span>
                <CopyButton text={pw} variant="ghost" />
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
  ]);

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
