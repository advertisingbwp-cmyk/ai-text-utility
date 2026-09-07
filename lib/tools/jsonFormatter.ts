export interface JsonFormatterOptions {
  indentation?: 2 | 4 | "minify";
  sortKeys?: boolean;
}

export interface JsonValidationResult {
  isValid: boolean;
  formatted: string;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
  type?: "object" | "array" | "primitive";
  sizeBytes?: number;
}

export function formatAndValidateJson(
  input: string,
  options: JsonFormatterOptions = {}
): JsonValidationResult {
  if (!input || !input.trim()) {
    return {
      isValid: true,
      formatted: "",
      type: "primitive",
      sizeBytes: 0,
    };
  }

  const indentation = options.indentation ?? 2;
  const sortKeys = options.sortKeys ?? false;

  try {
    let parsed = JSON.parse(input);

    if (sortKeys && typeof parsed === "object" && parsed !== null) {
      parsed = sortObjectKeys(parsed);
    }

    const type: "object" | "array" | "primitive" = Array.isArray(parsed)
      ? "array"
      : typeof parsed === "object" && parsed !== null
      ? "object"
      : "primitive";

    const space = indentation === "minify" ? 0 : indentation;
    const formatted = JSON.stringify(parsed, null, space);

    return {
      isValid: true,
      formatted,
      type,
      sizeBytes: new Blob([formatted]).size,
    };
  } catch (err) {
    let errorMsg = err instanceof Error ? err.message : "Invalid JSON";
    let errorLine: number | undefined;
    let errorColumn: number | undefined;

    // Extract line/column from standard V8 error if present (e.g. at line 2 column 5)
    const lineColMatch = errorMsg.match(/at line (\d+) column (\d+)/i);
    if (lineColMatch) {
      errorLine = parseInt(lineColMatch[1], 10);
      errorColumn = parseInt(lineColMatch[2], 10);
    } else {
      const posMatch = errorMsg.match(/at position (\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const upToPos = input.slice(0, pos);
        const lines = upToPos.split("\n");
        errorLine = lines.length;
        errorColumn = lines[lines.length - 1].length + 1;
        errorMsg += ` (Line ${errorLine}, Column ${errorColumn})`;
      }
    }

    return {
      isValid: false,
      formatted: "",
      error: errorMsg,
      errorLine,
      errorColumn,
    };
  }
}

function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  if (typeof obj === "object" && obj !== null) {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    for (const key of keys) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return obj;
}
