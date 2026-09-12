"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolWorkspaceResolver } from "@/components/layouts";
import {
  formatAndValidateJson,
  convertJsonToCsv,
  convertCsvToJson,
  convertMarkdownToHtml,
  minifyHtml,
  HtmlMinifierResult,
  decodeJwt,
} from "@/lib/tools/index";
import { trackEvent } from "@/lib/analytics";

export const JsonTool: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const [input, setInput] = useState<string>(tool.sampleInput || "");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Format Tools State
  const [jsonIndent, setJsonIndent] = useState<2 | 4 | "minify">(2);
  const [jsonSortKeys, setJsonSortKeys] = useState<boolean>(false);
  const [jsonToCsvDelim, setJsonToCsvDelim] = useState<string>(",");
  const [jsonToCsvQuoteAll, setJsonToCsvQuoteAll] = useState<boolean>(false);
  const [csvToJsonDelim, setCsvToJsonDelim] = useState<string>(",");
  const [csvToJsonHeaders, setCsvToJsonHeaders] = useState<boolean>(true);
  const [csvToJsonParseTypes, setCsvToJsonParseTypes] = useState<boolean>(true);
  const [markdownView, setMarkdownView] = useState<"preview" | "source">("source");
  const [htmlMinifyComments, setHtmlMinifyComments] = useState<boolean>(true);
  const [htmlMinifyWs, setHtmlMinifyWs] = useState<boolean>(true);
  const [htmlMinifyStats, setHtmlMinifyStats] = useState<HtmlMinifierResult | null>(null);
  const [jwtView, setJwtView] = useState<"visual" | "raw">("visual");

  const executeTool = useCallback(
    (currentInput: string) => {
      setError(null);
      if (!currentInput) {
        setOutput("");
        setHtmlMinifyStats(null);
        return;
      }

      try {
        switch (tool.slug) {
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
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error executing format/validator tool");
      }
    },
    [
      tool.slug,
      jsonIndent,
      jsonSortKeys,
      jsonToCsvDelim,
      jsonToCsvQuoteAll,
      csvToJsonDelim,
      csvToJsonHeaders,
      csvToJsonParseTypes,
      htmlMinifyComments,
      htmlMinifyWs,
    ]
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
    setHtmlMinifyStats(null);
  };

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setOutput("");
    }
  };

  const customControls = useMemo(() => {
    switch (tool.slug) {
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
                <option value="\t">Tab (\\t)</option>
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
                <option value="\t">Tab (\\t)</option>
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
              <span>First Row as Headers</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={csvToJsonParseTypes}
                onChange={(e) => setCsvToJsonParseTypes(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
              />
              <span>Parse Numbers & Booleans</span>
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
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs w-full">
            <div className="flex flex-wrap items-center gap-4">
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
            </div>

            {htmlMinifyStats && (
              <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                <span>Original: {htmlMinifyStats.originalSizeBytes} B</span>
                <span>→</span>
                <span>Minified: {htmlMinifyStats.minifiedSizeBytes} B</span>
                <span className="font-bold">({htmlMinifyStats.savedPercentage}% saved)</span>
              </div>
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
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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

      default:
        return null;
    }
  }, [
    tool.slug,
    jsonIndent,
    jsonSortKeys,
    jsonToCsvDelim,
    jsonToCsvQuoteAll,
    csvToJsonDelim,
    csvToJsonHeaders,
    csvToJsonParseTypes,
    markdownView,
    htmlMinifyComments,
    htmlMinifyWs,
    htmlMinifyStats,
    jwtView,
  ]);

  const customPreview = useMemo(() => {
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
            <span className="text-xs font-semibold text-pink-700 dark:text-pink-400 uppercase tracking-wider">
              Header: Algorithm & Token Type
            </span>
            <pre className="text-xs font-mono text-pink-900 dark:text-pink-200 bg-white dark:bg-slate-950/50 p-3 rounded-lg overflow-x-auto border border-pink-200/80 dark:border-pink-500/10">
              {decoded.formattedHeader}
            </pre>
          </div>

          {/* Payload Card */}
          <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-500/20 bg-purple-50/60 dark:bg-purple-950/10 space-y-2">
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
              Payload: Data Claims
            </span>
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

    return null;
  }, [tool.slug, input, markdownView, jwtView]);

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
      customPreview={customPreview}
    />
  );
};