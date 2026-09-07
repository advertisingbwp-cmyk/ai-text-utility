export interface JsonToCsvOptions {
  delimiter?: string;
  quoteAll?: boolean;
}

export function convertJsonToCsv(
  input: string,
  options: JsonToCsvOptions = {}
): string {
  if (!input || !input.trim()) return "";

  const delimiter = options.delimiter || ",";
  const quoteAll = options.quoteAll ?? false;

  let data: unknown;
  try {
    data = JSON.parse(input);
  } catch (err) {
    throw new Error(
      `Invalid JSON: ${err instanceof Error ? err.message : "Parse failure"}`
    );
  }

  // Handle single object by wrapping into array
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    data = [data];
  }

  if (!Array.isArray(data)) {
    throw new Error(
      "Unsupported structure: JSON to CSV requires an array of objects (e.g. [{\"id\": 1, \"name\": \"Alice\"}])."
    );
  }

  if (data.length === 0) {
    return "";
  }

  // Verify all elements are objects
  const isAllObjects = data.every(
    (item) => typeof item === "object" && item !== null && !Array.isArray(item)
  );

  if (!isAllObjects) {
    throw new Error(
      "Unsupported structure: Every item in the JSON array must be an object."
    );
  }

  // Collect all unique column headers across all objects in array
  const headerSet = new Set<string>();
  for (const item of data as Record<string, unknown>[]) {
    for (const key of Object.keys(item)) {
      headerSet.add(key);
    }
  }

  const headers = Array.from(headerSet);
  if (headers.length === 0) {
    return "";
  }

  const escapeCsvCell = (val: unknown): string => {
    if (val === null || val === undefined) {
      return "";
    }

    let str: string;
    if (typeof val === "object") {
      str = JSON.stringify(val);
    } else {
      str = String(val);
    }

    const needsQuotes =
      quoteAll ||
      str.includes(delimiter) ||
      str.includes('"') ||
      str.includes("\n") ||
      str.includes("\r");

    if (needsQuotes) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows: string[] = [];

  // Header row
  rows.push(headers.map(escapeCsvCell).join(delimiter));

  // Data rows
  for (const item of data as Record<string, unknown>[]) {
    const row = headers.map((header) => escapeCsvCell(item[header]));
    rows.push(row.join(delimiter));
  }

  return rows.join("\n");
}
