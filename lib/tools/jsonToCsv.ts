import { validateDelimiter, validateConversionInput, MAX_TABLE_CELLS } from './csvConversion';

export interface JsonToCsvOptions {
  delimiter?: string;
  quoteAll?: boolean;
}

export function convertJsonToCsv(
  input: string,
  options: JsonToCsvOptions = {}
): string {
  validateConversionInput(input);

  const delimiter = options.delimiter ?? ",";
  validateDelimiter(delimiter);
  const quoteAll = options.quoteAll ?? false;

  let data: unknown;
  try {
    data = JSON.parse(input.replace(/^\uFEFF/, ''), (_key, value: unknown) => {
      if (typeof value === 'number' && (!Number.isFinite(value) || (Number.isInteger(value) && !Number.isSafeInteger(value)))) {
        throw new Error('Unsafe JSON number: quote large integers as strings to preserve exact digits.');
      }
      return value;
    });
  } catch (err) {
    throw new Error(
      err instanceof Error && err.message.startsWith('Unsafe JSON number:')
        ? err.message : 'Invalid JSON: check quotes, commas and brackets.'
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
    throw new Error('No records to convert: provide a non-empty array of objects.');
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
    throw new Error('No columns to convert: provide objects with at least one key.');
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
  if (headers.length * data.length > MAX_TABLE_CELLS) throw new Error('JSON exceeds the 1,000,000 cell table limit.');

  // Header row
  rows.push(headers.map(escapeCsvCell).join(delimiter));

  // Data rows
  for (const item of data as Record<string, unknown>[]) {
    const row = headers.map((header) => escapeCsvCell(Object.hasOwn(item, header) ? item[header] : undefined));
    rows.push(row.join(delimiter));
  }

  return rows.join("\n");
}
