/**
 * Reverse Text Logic
 * Supports reversing characters, words, or lines with Unicode surrogate pair safety.
 */

export type ReverseMode = "characters" | "words" | "lines";

export interface ReverseOptions {
  mode?: ReverseMode;
}

export function reverseText(
  text: string,
  options: ReverseOptions | ReverseMode = "characters"
): string {
  if (!text) return "";

  const mode = typeof options === "string" ? options : options.mode || "characters";

  switch (mode) {
    case "characters": {
      // Reverse each line's characters or full text while keeping line breaks
      const lines = text.split(/\r?\n/);
      const reversedLines = lines.map((line) => {
        // Array.from splits correctly across surrogate pairs and emojis
        return Array.from(line).reverse().join("");
      });
      return reversedLines.join("\n");
    }

    case "words": {
      // Reverse the order of words within each line
      const lines = text.split(/\r?\n/);
      const reversedLines = lines.map((line) => {
        const words = line.trim().split(/\s+/).filter(Boolean);
        return words.reverse().join(" ");
      });
      return reversedLines.join("\n");
    }

    case "lines": {
      // Invert the order of lines in the document
      const lines = text.split(/\r?\n/);
      return lines.reverse().join("\n");
    }

    default:
      return text;
  }
}
