export interface TrimLinesOptions {
  mode?: "both" | "leading" | "trailing";
  removeEmptyLines?: boolean;
}

export function trimLines(
  input: string,
  options: TrimLinesOptions = {}
): string {
  if (!input) return "";

  const mode = options.mode || "both";
  const removeEmpty = options.removeEmptyLines ?? false;

  const lines = input.split(/\r?\n/);

  const trimmedLines = lines.map((line) => {
    switch (mode) {
      case "leading":
        return line.replace(/^\s+/, "");
      case "trailing":
        return line.replace(/\s+$/, "");
      case "both":
      default:
        return line.trim();
    }
  });

  if (removeEmpty) {
    return trimmedLines.filter((l) => l !== "").join("\n");
  }

  return trimmedLines.join("\n");
}
