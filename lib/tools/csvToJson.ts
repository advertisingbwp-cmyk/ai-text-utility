import { validateDelimiter, validateConversionInput, MAX_TABLE_CELLS } from './csvConversion';

export interface CsvToJsonOptions {
  delimiter?: string;
  hasHeaders?: boolean;
  parseNumbersAndBooleans?: boolean;
}

export function parseCsvRows(input: string, delimiter = ','): string[][] {
  validateDelimiter(delimiter);
  validateConversionInput(input);
  const csv = input.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [], cell = '';
  let state: 'start' | 'text' | 'quoted' | 'closed' = 'start';
  let touched = false, cells = 0;
  const endCell = () => {
    if (++cells > MAX_TABLE_CELLS) throw new Error('CSV exceeds the 1,000,000 cell limit.');
    row.push(cell); cell = ''; state = 'start';
  };
  const endRow = () => { endCell(); rows.push(row); row = []; touched = false; };
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (state === 'quoted') {
      if (c === '"') {
        if (csv[i + 1] === '"') { cell += '"'; i++; }
        else state = 'closed';
      } else cell += c;
      continue;
    }
    if (c === delimiter) { endCell(); touched = true; }
    else if (c === '\r' || c === '\n') {
      if (c === '\r' && csv[i + 1] === '\n') i++;
      endRow();
    } else if (c === '"' && state === 'start') { state = 'quoted'; touched = true; }
    else if (c === '"' || state === 'closed') {
      throw new Error('Malformed CSV near character ' + (i + 1) + ': quotes must enclose the entire field.');
    } else { cell += c; state = 'text'; touched = true; }
  }
  if (state === 'quoted') throw new Error('Malformed CSV: unclosed quoted field.');
  if (touched || row.length) endRow();
  return rows;
}

export function convertCsvToJson(input: string, options: CsvToJsonOptions = {}): string {
  const rows = parseCsvRows(input, options.delimiter ?? ',');
  const coerce = (value: string): unknown => {
    if (!options.parseNumbersAndBooleans) return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    // Conservative inference preserves decimals, exponents, formatting and unsafe IDs.
    if (/^-?(0|[1-9]\d*)$/.test(value) && value !== '-0' && Number.isSafeInteger(Number(value))) return Number(value);
    return value;
  };
  if (options.hasHeaders === false) return JSON.stringify(rows.map(row => row.map(coerce)), null, 2);
  const originals = rows[0];
  let width = originals.length;
  for (const row of rows) width = Math.max(width, row.length);
  if (width * (rows.length - 1) > MAX_TABLE_CELLS) throw new Error('CSV exceeds the 1,000,000 cell table limit.');
  const reserved = new Set(originals.filter(Boolean)), used = new Set<string>();
  const suffixes = new Map<string, number>();
  const headers = Array.from({length: width}, (_, i) => {
    const original = originals[i] || '';
    const base = original || 'column_' + (i + 1);
    let key = base;
    if (used.has(key) || (!original && reserved.has(key))) {
      let suffix = suffixes.get(base) ?? 2;
      do { key = base + '_' + suffix++; } while (used.has(key) || reserved.has(key));
      suffixes.set(base, suffix);
    }
    used.add(key);
    return key;
  });
  return JSON.stringify(rows.slice(1).map(row => {
    const result: Record<string, unknown> = Object.create(null);
    headers.forEach((key, i) => { result[key] = coerce(row[i] ?? ''); });
    return result;
  }), null, 2);
}
