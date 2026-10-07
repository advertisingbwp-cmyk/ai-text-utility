export const MAX_CONVERSION_BYTES = 5 * 1024 * 1024;
export const MAX_TABLE_CELLS = 1_000_000;

export function validateDelimiter(delimiter: string) {
  if (delimiter.length !== 1 || /["\r\n\uFEFF]/.test(delimiter)) {
    throw new Error('Choose a single-character delimiter. Tab must be a real tab, not literal \\t.');
  }
}

export function validateConversionInput(input: string) {
  if (!input.replace(/^\uFEFF/, '').length) throw new Error('Enter CSV or JSON content to convert.');
  if (input.length > MAX_CONVERSION_BYTES || new TextEncoder().encode(input).length > MAX_CONVERSION_BYTES) {
    throw new Error('Input exceeds the 5 MiB limit.');
  }
}

export async function readConversionFile(file: File, direction: 'csv-to-json' | 'json-to-csv') {
  if (!(direction === 'csv-to-json' ? /\.(csv|tsv)$/i : /\.json$/i).test(file.name)) {
    throw new Error(direction === 'csv-to-json' ? 'Choose a .csv or .tsv file.' : 'Choose a .json file.');
  }
  if (file.size > MAX_CONVERSION_BYTES) throw new Error('File exceeds the 5 MiB limit.');
  let text: string;
  try { text = new TextDecoder('utf-8', {fatal: true}).decode(await file.arrayBuffer()); }
  catch { throw new Error('Cannot read file as UTF-8. Choose a readable UTF-8 text file.'); }
  validateConversionInput(text);
  return {text, delimiter: /\.tsv$/i.test(file.name) ? '\t' : undefined};
}

export function conversionExport(direction: 'csv-to-json' | 'json-to-csv', delimiter: string) {
  if (direction === 'csv-to-json') return {filename: 'converted.json', mime: 'application/json;charset=utf-8'};
  return delimiter === '\t'
    ? {filename: 'converted.tsv', mime: 'text/tab-separated-values;charset=utf-8'}
    : {filename: 'converted.csv', mime: 'text/csv;charset=utf-8'};
}
