"use client";

import React, { useRef, useState } from "react";
import type { ToolDefinition } from "@/data/toolsRegistry";
import { ToolShell } from "@/components/layouts/ToolShell";
import { CopyButton } from "@/components/CopyButton";
import { compareTexts, formatDiffReport, MAX_DIFF_CHARS, type DiffOptions, type DiffPart } from "@/lib/tools/diffChecker";
import { trackEvent } from "@/lib/analytics";

export function DiffCheckerTool({ tool }: { tool: ToolDefinition }) {
  const [texts, setTexts] = useState(["", ""]);
  const [options, setOptions] = useState<DiffOptions>({ mode: "word", ignoreCase: false, ignoreSpaces: false });
  const [parts, setParts] = useState<DiffPart[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(-1);
  const versions = useRef([0, 0]);
  const marks = useRef<Record<number, HTMLSpanElement | null>>({});
  const reset = () => { setParts(null); setActive(-1); setError(null); };
  const changeText = (side: number, text: string) => {
    versions.current[side]++;
    setTexts(old => old.map((value, index) => index === side ? text : value)); reset();
  };
  const clear = () => { versions.current = versions.current.map(v => v + 1); setTexts(["", ""]); reset(); };
  const run = () => {
    reset();
    try {
      if (!texts[0] && !texts[1]) throw new Error("Enter text in at least one panel to compare.");
      setParts(compareTexts(texts[0], texts[1], options));
      trackEvent("tool_used", { toolSlug: tool.slug, action: options.mode, inputLength: texts[0].length + texts[1].length });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Comparison failed."); }
  };
  const loadFile = async (side: number, file?: File) => {
    if (!file) return;
    const version = ++versions.current[side];
    reset();
    if (!file.name.toLowerCase().endsWith(".txt") || file.size > 120_000) {
      setError("Choose a .txt file up to 120 KB (30,000 characters)."); return;
    }
    try {
      const text = await file.text();
      if (versions.current[side] !== version) return;
      if (text.length > MAX_DIFF_CHARS || text.includes("\0")) throw new Error("Choose a plain-text file up to 30,000 characters.");
      changeText(side, text);
    } catch (cause) {
      if (versions.current[side] === version) setError(cause instanceof Error ? cause.message : "Could not read the file.");
    }
  };
  const changes = parts?.flatMap((part, index) => part.kind === "equal" ? [] : [index]) || [];
  const navigate = (direction: number) => {
    const next = active < 0 ? (direction > 0 ? 0 : changes.length - 1) : (active + direction + changes.length) % changes.length;
    setActive(next);
    const element = marks.current[changes[next]];
    element?.scrollIntoView({ block: "center", behavior: "auto" }); element?.focus({ preventScroll: true });
  };
  const report = parts ? formatDiffReport(parts, options) : "";
  const download = () => {
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "text-comparison.txt"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const button = "rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40";
  return <ToolShell tool={tool} error={error} onRun={run} onClear={clear}>
    <p className="text-sm text-slate-600 dark:text-slate-300">Compare locally in your browser. Your comparison text is not uploaded or saved. Up to 30,000 characters per panel.</p>
    <div className="grid gap-4 md:grid-cols-2">
      {texts.map((text, side) => <div key={side} className="min-w-0 space-y-2">
        <label htmlFor={`diff-input-${side}`} className="font-semibold">{side === 0 ? "Original text" : "Revised text"}</label>
        <textarea id={`diff-input-${side}`} value={text} onChange={event => changeText(side, event.target.value)} spellCheck={false}
          placeholder={side === 0 ? "Paste the original version…" : "Paste the revised version…"}
          className="block min-h-56 w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-sm dark:border-slate-600 dark:bg-slate-900" />
        <div className="text-xs text-slate-500">{text.length.toLocaleString()} / 30,000 characters</div>
        <label className="block text-sm">Upload {side === 0 ? "original" : "revised"} .txt
          <input type="file" accept=".txt,text/plain" className="block max-w-full text-xs mt-1" onChange={event => {
            void loadFile(side, event.target.files?.[0]); event.target.value = "";
          }} />
        </label>
      </div>)}
    </div>
    <div className="flex flex-wrap items-center gap-4">
      <label className="text-sm">Compare by <select value={options.mode} className="rounded border p-2 bg-white dark:bg-slate-900" onChange={event => {
        setOptions({ ...options, mode: event.target.value as DiffOptions["mode"] }); reset();
      }}><option value="word">Word</option><option value="line">Line</option></select></label>
      {(["ignoreCase", "ignoreSpaces"] as const).map(key => <label key={key} className="flex gap-2 items-center text-sm">
        <input type="checkbox" checked={options[key]} onChange={event => { setOptions({ ...options, [key]: event.target.checked }); reset(); }} />
        {key === "ignoreCase" ? "Ignore letter case" : "Ignore extra spaces"}
      </label>)}
    </div>
    {(options.ignoreCase || options.ignoreSpaces) && <p className="text-sm">Results and exports show normalized text: {options.ignoreCase ? "lowercase; " : ""}{options.ignoreSpaces ? "collapsed spaces and trimmed line edges; " : ""}inputs stay unchanged.</p>}
    <div className="flex flex-wrap gap-2">
      <button className={button + " bg-blue-600! text-white hover:bg-blue-700!"} onClick={run}>Compare texts</button>
      <button className={button} onClick={() => { versions.current = versions.current.map(v => v + 1); setTexts([texts[1], texts[0]]); reset(); }}>Swap texts</button>
      <button className={button} onClick={clear}>Clear</button>
      <button className={button} onClick={() => {
        versions.current = versions.current.map(v => v + 1); setTexts(["The quick brown fox.\nReady to publish.", "The quick red fox.\nReady to share."]); reset();
      }}>Try example</button>
      <button className={button} onClick={() => {
        versions.current = versions.current.map(v => v + 1);
        setTexts(texts.map(text => text.split("\n").map(line => line.replace(/[^\S\n]+/g, " ").trim()).join("\n"))); reset();
      }}>Clean spaces in both</button>
    </div>
    {parts !== null && <section aria-label="Comparison results" className="space-y-3">
      <p role="status">{changes.length ? `${parts.filter(p => p.kind === "removed").length} removed sections · ${parts.filter(p => p.kind === "added").length} added sections` : "No differences with the selected options."}</p>
      <p className="text-sm">− Removed: red underline · + Added: green underline. Whitespace changes may appear as highlighted gaps.</p>
      <div className="flex flex-wrap items-center gap-2">
        <button className={button} disabled={!changes.length} onClick={() => navigate(-1)}>Previous change</button>
        <button className={button} disabled={!changes.length} onClick={() => navigate(1)}>Next change</button>
        <span aria-live="polite" className="text-sm">{active >= 0 ? `Change ${active + 1} of ${changes.length}` : ""}</span>
        <CopyButton text={report} label="Copy report" />
        <button className={button} onClick={download}>Download comparison</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(["removed", "added"] as const).map((kind, side) => <div key={kind} className="min-w-0">
          <h2 className="font-semibold mb-2">{side === 0 ? "Original — removals" : "Revised — additions"}</h2>
          <pre className="min-h-32 whitespace-pre-wrap wrap-anywhere rounded-xl border border-slate-300 dark:border-slate-600 p-3 font-mono text-sm">
            {parts.filter(part => part.kind === "equal" || part.kind === kind).length === 0 && <span className="text-slate-500">(empty text)</span>}
            {parts.map((part, index) => part.kind === "equal" ? <span key={index}>{part.text}</span> : part.kind === kind
              ? <span key={index} ref={element => { marks.current[index] = element; }} tabIndex={-1}
                  aria-label={`${kind}: ${part.text}`} className={`underline decoration-2 outline-offset-2 ${kind === "removed" ? "bg-red-100 text-red-950 dark:bg-red-950 dark:text-red-100" : "bg-green-100 text-green-950 dark:bg-green-950 dark:text-green-100"} ${changes[active] === index ? "outline-2 outline-blue-500" : ""}`}>{part.text}</span> : null)}
          </pre>
        </div>)}
      </div>
    </section>}
  </ToolShell>;
}
