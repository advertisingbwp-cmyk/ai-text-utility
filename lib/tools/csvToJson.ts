export interface CsvToJsonOptions {
  delimiter?: string;
  hasHeaders?: boolean;
  parseNumbersAndBooleans?: boolean;
}

export function parseCsvRows(csv: string, delimiter: string = ","): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  const len = csv.length;
  for (let i = 0; i < len; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote: "" -> "
          currentCell += '"';
          i++; // Skip next quote
        } else {
          // Closing quote
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentCell);
        currentCell = "";
      } else if (char === "\r") {
        if (nextChar === "\n") {
          i++; // Skip \n in CRLF
        }
        currentRow.push(currentCell);
        currentCell = "";
        rows.push(currentRow);
        currentRow = [];
      } else if (char === "\n") {
        currentRow.push(currentCell);
        currentCell = "";
        rows.push(currentRow);
        currentRow = [];
      } else {
        currentCell += char;
      }
    }
  }

  // Push remaining cell and row if any
  if (currentCell !== "" || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows.filter((r) => r.length > 0 && r.some((cell) => cell.trim() !== ""));
}

export function convertCsvToJson(
  input: string,
  options: CsvToJsonOptions = {}
): string {
  if (!input || !input.trim()) return "[]";

  const delimiter = options.delimiter || ",";
  const hasHeaders = options.hasHeaders ?? true;
  const parseNumbers = options.parseNumbersAndBooleans ?? true;

  const rawRows = parseCsvRows(input, delimiter);
  if (rawRows.length === 0) return "[]";

  const coerce = (val: string): unknown => {
    if (!parseNumbers) return val;
    if (val === "") return "";
    if (val === "true") return true;
    if (val === "false") return false;
    if (val === "null") return null;
    if (!isNaN(Number(val)) && val.trim() !== "") {
      return Number(val);
    }
    return val;
  };

  if (!hasHeaders) {
    const arrayResult = rawRows.map((row) => row.map(coerce));
    return JSON.stringify(arrayResult, null, 2);
  }

  const headers = rawRows[0].map((h) => h.trim());
  const dataRows = rawRows.slice(1);

  const objects = dataRows.map((row) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      const cellVal = row[index] !== undefined ? row[index] : "";
      obj[header || `col_${index + 1}`] = coerce(cellVal);
    });
    return obj;
  });

  return JSON.stringify(objects, null, 2);
}
