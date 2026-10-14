export type DiffOptions = { mode: "word" | "line"; ignoreCase: boolean; ignoreSpaces: boolean };
export type DiffPart = { kind: "equal" | "added" | "removed"; text: string };
export const MAX_DIFF_CHARS = 30_000;
export const MAX_DIFF_TOKENS = 2_000;

/** Bounded LCS: at most 4 million cells, with no network or stored content. */
export function compareTexts(original: string, revised: string, options: DiffOptions): DiffPart[] {
  if (original.length > MAX_DIFF_CHARS || revised.length > MAX_DIFF_CHARS)
    throw new Error("Use up to 30,000 characters per text.");
  const prepare = (text: string) => {
    let value = text.replace(/\r\n?/g, "\n");
    if (options.ignoreSpaces) value = value.split("\n").map(line => line.replace(/[^\S\n]+/g, " ").trim()).join("\n");
    if (options.ignoreCase) value = value.toLowerCase();
    return value;
  };
  const tokenize = (text: string) => options.mode === "line"
    ? text.match(/[^\n]*\n|[^\n]+$/g) || []
    : text.match(/[\p{L}\p{N}_]+|\s+|[^\p{L}\p{N}_\s]/gu) || [];
  const left = prepare(original), right = prepare(revised);
  if (left === right) return left ? [{ kind: "equal", text: left }] : [];
  const a = tokenize(left), b = tokenize(right);
  if (a.length > MAX_DIFF_TOKENS || b.length > MAX_DIFF_TOKENS)
    throw new Error("Too many comparison units (maximum 2,000 per text). Try line mode or a shorter excerpt.");
  const width = b.length + 1;
  const table = new Uint16Array((a.length + 1) * width);
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      table[i * width + j] = a[i] === b[j] ? 1 + table[(i + 1) * width + j + 1]
        : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
  const parts: DiffPart[] = [];
  const append = (kind: DiffPart["kind"], text: string) => {
    const last = parts.at(-1);
    if (last?.kind === kind) last.text += text;
    else parts.push({ kind, text });
  };
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { append("equal", a[i++]); j++; }
    else if (i < a.length && (j === b.length || table[(i + 1) * width + j] >= table[i * width + j + 1]))
      append("removed", a[i++]);
    else append("added", b[j++]);
  }
  return parts;
}

export function formatDiffReport(parts: DiffPart[], options: DiffOptions): string {
  return [
    "Text comparison report",
    `Mode: ${options.mode}; ignore case: ${options.ignoreCase}; ignore extra spaces: ${options.ignoreSpaces}`,
    "Legend: UNCHANGED / REMOVED / ADDED. This is a readable report, not a patch file.",
    ...parts.map(part => `[${part.kind === "equal" ? "UNCHANGED" : part.kind.toUpperCase()}]\n${part.text}`),
  ].join("\n\n");
}
