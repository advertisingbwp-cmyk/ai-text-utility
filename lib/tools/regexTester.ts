export interface RegexMatchGroup {
  start?: number;
  end?: number;
  index: number;
  name?: string;
  value: string;
}

export interface RegexMatchItem {
  start: number;
  end: number;
  fullMatch: string;
  match: string;
  index: number;
  length: number;
  groups: RegexMatchGroup[];
}

export interface RegexTestResult {
  durationMs?: number;
  truncated?: boolean;
  isValid: boolean;
  error?: string;
  pattern: string;
  flags: string;
  matches: RegexMatchItem[];
  matchCount: number;
}

export const DEFAULT_REGEX_PATTERN = "user_id_(\\d+)";
export const REGEX_MAX_MATCHES = 500;
export const REGEX_MAX_INPUT = 1_000_000;
export const REGEX_MAX_PATTERN = 10_000;
export const REGEX_MAX_RESULT_CHARS = 1_000_000;

// Synchronous engine: browser callers MUST execute this in regex.worker.ts.

export function testRegex(
  text: string,
  pattern: string,
  flags: string = "g",
  maxMatches: number = REGEX_MAX_MATCHES
): RegexTestResult {
  const started = performance.now();
  if (text.length > REGEX_MAX_INPUT || pattern.length > REGEX_MAX_PATTERN) {
    return { isValid: false, error: "Use at most 1,000,000 input characters and 10,000 pattern characters.", pattern, flags, matches: [], matchCount: 0 };
  }
  if (!pattern) {
    return {
      isValid: true,
      pattern: "",
      flags,
      matches: [],
      matchCount: 0,
    };
  }

  // 'd' supplies capture ranges; never force 'g' when the user disabled it.
  let cleanFlags = flags;
  if (!cleanFlags.includes("d")) cleanFlags += "d";

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, cleanFlags);
  } catch {
    // If 'd' flag isn't supported or fails, fallback without 'd'
    cleanFlags = flags;
    try {
      regex = new RegExp(pattern, cleanFlags);
    } catch (err) {
      return {
        isValid: false,
        error: err instanceof Error ? err.message : "Invalid regular expression",
        pattern,
        flags,
        matches: [],
        matchCount: 0,
      };
    }
  }

  const matches: RegexMatchItem[] = [];
  let match: RegExpExecArray | null;
  const limit = Number.isFinite(maxMatches) ? Math.max(1, Math.min(REGEX_MAX_MATCHES, Math.floor(maxMatches))) : REGEX_MAX_MATCHES;
  let truncated = false;
  let resultCharacters = 0;
  let groupCount = 0;

  while ((match = regex.exec(text)) !== null) {
    if (resultCharacters + match[0].length > REGEX_MAX_RESULT_CHARS || groupCount >= 2000) {
      truncated = true;
      break;
    }
    resultCharacters += match[0].length;
    const groups: RegexMatchGroup[] = [];
    const matchIndices = (match as unknown as { indices?: { [key: number]: [number, number]; groups?: Record<string, [number, number]> } }).indices;

    // Capture groups without duplication
    for (let i = 1; i < match.length; i++) {
      if (match[i] !== undefined) {
        if (resultCharacters + match[i].length > REGEX_MAX_RESULT_CHARS || groupCount >= 2000) {
          truncated = true;
          break;
        }
        resultCharacters += match[i].length;
        groupCount++;
        let name: string | undefined;

        if (matchIndices?.groups && matchIndices[i]) {
          const range = matchIndices[i];
          for (const [k, v] of Object.entries(matchIndices.groups)) {
            if (v && v[0] === range[0] && v[1] === range[1]) {
              name = k;
              break;
            }
          }
        } else if (match.groups) {
          // Fallback: match by value if indices are unavailable
          for (const [k, v] of Object.entries(match.groups)) {
            if (v === match[i]) {
              name = k;
              break;
            }
          }
        }

        groups.push({
          index: i,
          start: matchIndices?.[i]?.[0],
          end: matchIndices?.[i]?.[1],
          name,
          value: match[i],
        });
      }
    }

    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      fullMatch: match[0],
      match: match[0],
      index: match.index,
      length: match[0].length,
      groups,
    });

    if (!flags.includes("g") || truncated) break;
    // Stop without another potentially expensive exec. The UI says the cap was reached.
    if (matches.length >= limit) { truncated = true; break; }

    // Advance by a full code point in Unicode mode, including astral characters.
    if (match[0].length === 0) {
      const point = text.codePointAt(regex.lastIndex);
      regex.lastIndex += regex.unicode && point !== undefined && point > 0xffff ? 2 : 1;
    }
  }

  return {
    isValid: true,
    pattern,
    flags,
    matches,
    matchCount: matches.length,
    truncated,
    durationMs: performance.now() - started,
  };
}

export function formatRegexReport(result: RegexTestResult): string {
  if (!result.isValid) {
    return `Regex Error: ${result.error}`;
  }

  if (!result.pattern) {
    return "Enter a regular expression pattern to test.";
  }

  if (result.matches.length === 0) {
    return `Pattern /${result.pattern}/${result.flags} yielded 0 matches.`;
  }

  const lines: string[] = [
    `Found ${result.matchCount} match${result.matchCount === 1 ? "" : "es"}:`,
    "--------------------------------------------------",
  ];
  if (result.truncated) lines.push("Result limit reached; additional matches may exist.");

  result.matches.forEach((m, idx) => {
    lines.push(`Match #${idx + 1} [idx ${m.index}..${m.index + m.length}]: "${m.match}"`);
    if (m.groups.length > 0) {
      m.groups.forEach((g) => {
        lines.push(`  Group ${g.name ? `'${g.name}'` : `#${g.index}`}: "${g.value}"`);
      });
    }
  });

  return lines.join("\n");
}
