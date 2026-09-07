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

  // Ensure 'g' flag is present for multi-match search unless deliberately omitted
  const cleanFlags = flags.includes("g") ? flags : `${flags}g`;

  let regex: RegExp;
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

  while ((match = regex.exec(text)) !== null) {
    const groups: RegexMatchGroup[] = [];

    // Capture numbered groups
    for (let i = 1; i < match.length; i++) {
      if (match[i] !== undefined) {
        groups.push({
          index: i,
          value: match[i],
        });
      }
    }

    // Capture named groups
    if (match.groups) {
      for (const [name, val] of Object.entries(match.groups)) {
        if (val !== undefined) {
          groups.push({
            index: groups.length + 1,
            name,
            value: val,
          });
        }
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

    if (--safetyLimit <= 0) break;
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
