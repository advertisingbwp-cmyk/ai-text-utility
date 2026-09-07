export interface RemoveEmptyLinesOptions {
  mode?: "remove-all" | "preserve-paragraphs";
}

export function removeEmptyLines(
  input: string,
  options: RemoveEmptyLinesOptions = {}
): string {
  if (!input) return "";

  const mode = options.mode || "remove-all";
  const lines = input.split(/\r?\n/);

  if (mode === "remove-all") {
    return lines.filter((line) => line.trim() !== "").join("\n");
  }

  // Preserve paragraphs: collapse multiple blank lines into a single blank line
  const result: string[] = [];
  let prevWasEmpty = false;

  for (const line of lines) {
    const isEmpty = line.trim() === "";
    if (isEmpty) {
      if (!prevWasEmpty && result.length > 0) {
        result.push("");
        prevWasEmpty = true;
      }
    } else {
      result.push(line);
      prevWasEmpty = false;
    }
  }

  // Remove any trailing blank line created by collapse
  if (result.length > 0 && result[result.length - 1] === "") {
    result.pop();
  }

  return result.join("\n");
}
