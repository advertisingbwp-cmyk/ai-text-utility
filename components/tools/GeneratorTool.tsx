"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolWorkspaceResolver } from "@/components/layouts";
import { CopyButton } from "@/components/CopyButton";
import {
  generatePasswords,
  generateUuids,
  generateLoremIpsum,
  LoremUnit,
  generateHash,
  HashAlgorithm,
} from "@/lib/tools/index";
import { trackEvent } from "@/lib/analytics";

export const GeneratorTool: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const [input, setInput] = useState<string>(tool.sampleInput || "");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Password Generator State
  const [pwLength, setPwLength] = useState<number>(16);
  const [pwUpper, setPwUpper] = useState<boolean>(true);
  const [pwLower, setPwLower] = useState<boolean>(true);
  const [pwNumbers, setPwNumbers] = useState<boolean>(true);
  const [pwSymbols, setPwSymbols] = useState<boolean>(true);
  const [pwExcludeAmbiguous, setPwExcludeAmbiguous] = useState<boolean>(false);
  const [pwCount, setPwCount] = useState<number>(1);

  // UUID Generator State
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidUpper, setUuidUpper] = useState<boolean>(false);
  const [uuidNoHyphens, setUuidNoHyphens] = useState<boolean>(false);

  // Lorem Ipsum State
  const [loremUnit, setLoremUnit] = useState<LoremUnit>("paragraphs");
  const [loremCount, setLoremCount] = useState<number>(3);
  const [loremStartWith, setLoremStartWith] = useState<boolean>(true);

  // Hash Generator State
  const [hashAlgo, setHashAlgo] = useState<HashAlgorithm>("SHA-256");
  const [hashUpper, setHashUpper] = useState<boolean>(false);
  const [allHashes, setAllHashes] = useState<{ [algo: string]: string }>({});

  const executeTool = useCallback(
    (currentInput: string) => {
      setError(null);

      try {
        switch (tool.slug) {
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
            const text = generateLoremIpsum({
              unit: loremUnit,
              count: loremCount,
              startWithLoremIpsum: loremStartWith,
            });
            setOutput(text);
            break;
          }

          case "hash-generator": {
            if (!currentInput) {
              setOutput("");
              setAllHashes({});
              return;
            }
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
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error generating content");
      }
    },
    [
      tool.slug,
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
      hashAlgo,
      hashUpper,
    ]
  );

  useEffect(() => {
    executeTool(input);
  }, [input, executeTool]);

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
              onClick={handleRun}
              className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium cursor-pointer"
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
                onChange={(e) => setUuidCount(Math.max(1, parseInt(e.target.value) || 5))}
                className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 text-center font-mono focus:outline-none focus:border-brand-500 shadow-2xs"
              />
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={uuidUpper}
                onChange={(e) => setUuidUpper(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 bg-white dark:bg-slate-800"
              />
              <span>UPPERCASE</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
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
              onClick={handleRun}
              className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium cursor-pointer"
            >
              Generate New
            </button>
          </div>
        );

      case "lorem-ipsum":
        return (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Generate:</span>
              <input
                type="number"
                min={1}
                max={50}
                value={loremCount}
                onChange={(e) => setLoremCount(Math.max(1, parseInt(e.target.value) || 3))}
                className="w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 text-center font-mono focus:outline-none focus:border-brand-500 shadow-2xs"
              />
              <select
                value={loremUnit}
                onChange={(e) => setLoremUnit(e.target.value as LoremUnit)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-2xs capitalize"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={loremStartWith}
                onChange={(e) => setLoremStartWith(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-brand-600 bg-white dark:bg-slate-800"
              />
              <span>Start with &quot;Lorem ipsum...&quot;</span>
            </label>
            <button
              type="button"
              onClick={handleRun}
              className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium cursor-pointer"
            >
              Regenerate
            </button>
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
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
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

      default:
        return null;
    }
  }, [
    tool.slug,
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
    hashAlgo,
    hashUpper,
    handleRun,
  ]);

  const customPreview = useMemo(() => {
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

    if (tool.slug === "hash-generator") {
      const algos = [
        { name: "SHA-256", bits: 256, hash: allHashes["SHA-256"] || output },
        { name: "SHA-384", bits: 384, hash: allHashes["SHA-384"] || "" },
        { name: "SHA-512", bits: 512, hash: allHashes["SHA-512"] || "" },
        { name: "SHA-1 (Legacy)", bits: 160, hash: allHashes["SHA-1"] || "" },
      ];
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2.5">
            {algos.map((item) => (
              <div
                key={item.name}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">
                    {item.name} <span className="text-slate-400 font-normal">({item.bits} bits)</span>
                  </span>
                  {item.hash && <CopyButton text={item.hash} variant="ghost" />}
                </div>
                <div className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all select-all bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 min-h-[34px] flex items-center">
                  {item.hash || <span className="text-slate-400 dark:text-slate-600 font-sans italic">Enter text to hash...</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  }, [
    tool.slug,
    pwLength,
    pwUpper,
    pwLower,
    pwNumbers,
    pwSymbols,
    pwExcludeAmbiguous,
    pwCount,
    allHashes,
    output,
  ]);

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
