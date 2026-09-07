export interface LineNumberOptions {
  startNumber?: number;
  delimiter?: string;
  padWithZeros?: boolean;
  alignRight?: boolean;
  skipEmptyLines?: boolean;
}

export function addLineNumbers(
  input: string,
  options: LineNumberOptions = {}
): string {
  if (!input) return "";

  const startNumber = Math.max(0, options.startNumber ?? 1);
  const delimiter = options.delimiter ?? ". ";
  const padWithZeros = options.padWithZeros ?? false;
  const alignRight = options.alignRight ?? true;
  const skipEmptyLines = options.skipEmptyLines ?? false;

  const lines = input.split(/\r?\n/);
  const totalCount = startNumber + lines.length;
  const maxDigits = String(totalCount).length;

  let currentNum = startNumber;

  const resultLines = lines.map((line) => {
    if (skipEmptyLines && line.trim() === "") {
      return line;
    }

    let numStr = String(currentNum);
    if (padWithZeros) {
      numStr = numStr.padStart(maxDigits, "0");
    } else if (alignRight) {
      numStr = numStr.padStart(maxDigits, " ");
    }

    currentNum++;
    return `${numStr}${delimiter}${line}`;
  });

  return resultLines.join("\n");
}
