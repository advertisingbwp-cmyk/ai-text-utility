export interface RegexMatchGroup {
  index: number;
  name?: string;
  value: string;
}

export interface RegexMatchItem {
  match: string;
  index: number;
  length: number;
  groups: RegexMatchGroup[];
}

export interface RegexTestResult {
  isValid: boolean;
  error?: string;
  pattern: string;
  flags: string;
  matches: RegexMatchItem[];
  matchCount: number;
}

export function testRegex(
  text: string,
  pattern: string,
  flags: string = "g"
): RegexTestResult {
  if (!pattern) {
    return {
      isValid: true,
      pattern: "",
      flags,
      matches: [],
      matchCount: 0,
    };
  }

  // Ensure 'g' and 'd' flags are present for multi-match search and group index mapping
  let cleanFlags = flags;
  if (!cleanFlags.includes("g")) cleanFlags += "g";
  if (!cleanFlags.includes("d")) cleanFlags += "d";

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, cleanFlags);
  } catch {
    // If 'd' flag isn't supported or fails, fallback without 'd'
    cleanFlags = flags.includes("g") ? flags : `${flags}g`;
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

  if (!text) {
    return {
      isValid: true,
      pattern,
      flags,
      matches: [],
      matchCount: 0,
    };
  }

  const matches: RegexMatchItem[] = [];
  let match: RegExpExecArray | null;
  let safetyLimit = 2000;
  const startTime = Date.now();

  while ((match = regex.exec(text)) !== null) {
    const groups: RegexMatchGroup[] = [];
    const matchIndices = (match as unknown as { indices?: { [key: number]: [number, number]; groups?: Record<string, [number, number]> } }).indices;

    // Capture groups without duplication
    for (let i = 1; i < match.length; i++) {
      if (match[i] !== undefined) {
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
          name,
          value: match[i],
        });
      }
    }

    matches.push({
      match: match[0],
      index: match.index,
      length: match[0].length,
      groups,
    });

    // Zero-width match safeguard to prevent infinite loop
    if (match[0].length === 0) {
      regex.lastIndex++;
    }

    if (--safetyLimit <= 0 || Date.now() - startTime > 1000) break;
  }

  return {
    isValid: true,
    pattern,
    flags,
    matches,
    matchCount: matches.length,
  };
}

export function formatRegexReport(result: RegexTestResult): string {
  if (!result.isValid) {
    return `Regex Syntax Error: ${result.error}`;
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
