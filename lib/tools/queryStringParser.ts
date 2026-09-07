export interface QueryParamEntry {
  key: string;
  decodedKey: string;
  rawValue: string;
  decodedValue: string;
}

export interface QueryParserResult {
  entries: QueryParamEntry[];
  totalParams: number;
  uniqueKeys: number;
  jsonRepresentation: Record<string, string | string[]>;
}

function safeDecode(val: string): string {
  try {
    return decodeURIComponent(val.replace(/\+/g, " "));
  } catch {
    return val;
  }
}

export function parseQueryString(input: string): QueryParserResult {
  if (!input || !input.trim()) {
    return {
      entries: [],
      totalParams: 0,
      uniqueKeys: 0,
      jsonRepresentation: {},
    };
  }

  let query = input.trim();

  // If full URL, extract portion after '?'
  const questionIdx = query.indexOf("?");
  if (questionIdx !== -1) {
    query = query.slice(questionIdx + 1);
  }

  // Strip trailing hash if present
  const hashIdx = query.indexOf("#");
  if (hashIdx !== -1) {
    query = query.slice(0, hashIdx);
  }

  // Split pairs
  const pairs = query.split(/[&;]/).filter(Boolean);
  const entries: QueryParamEntry[] = [];
  const json: Record<string, string | string[]> = {};

  for (const pair of pairs) {
    const eqIdx = pair.indexOf("=");
    let rawKey = "";
    let rawValue = "";

    if (eqIdx === -1) {
      rawKey = pair;
      rawValue = "";
    } else {
      rawKey = pair.slice(0, eqIdx);
      rawValue = pair.slice(eqIdx + 1);
    }

    const decodedKey = safeDecode(rawKey);
    const decodedValue = safeDecode(rawValue);

    entries.push({
      key: rawKey,
      decodedKey,
      rawValue,
      decodedValue,
    });

    // Populate JSON structure handling duplicate keys
    if (json[decodedKey] === undefined) {
      json[decodedKey] = decodedValue;
    } else if (Array.isArray(json[decodedKey])) {
      (json[decodedKey] as string[]).push(decodedValue);
    } else {
      json[decodedKey] = [json[decodedKey] as string, decodedValue];
    }
  }

  const uniqueKeys = new Set(entries.map((e) => e.decodedKey)).size;

  return {
    entries,
    totalParams: entries.length,
    uniqueKeys,
    jsonRepresentation: json,
  };
}

export function formatQueryParserReport(result: QueryParserResult): string {
  if (result.entries.length === 0) {
    return "No query parameters found in the input.";
  }

  const lines: string[] = [
    `Total Parameters: ${result.totalParams} (${result.uniqueKeys} unique keys)`,
    "==================================================",
  ];

  result.entries.forEach((e, idx) => {
    lines.push(
      `[${idx + 1}] Key: "${e.decodedKey}"${e.key !== e.decodedKey ? ` (raw: ${e.key})` : ""}`
    );
    lines.push(
      `    Value: "${e.decodedValue}"${e.rawValue !== e.decodedValue ? ` (raw: ${e.rawValue})` : ""}`
    );
    lines.push("--------------------------------------------------");
  });

  lines.push("");
  lines.push("JSON Representation:");
  lines.push(JSON.stringify(result.jsonRepresentation, null, 2));

  return lines.join("\n");
}
