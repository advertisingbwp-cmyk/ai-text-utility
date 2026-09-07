export interface RemoveLineBreaksOptions {
  separator?: string;
  collapseParagraphs?: boolean;
}

export function removeLineBreaks(
  input: string,
  options: RemoveLineBreaksOptions = {}
): string {
  if (!input) return "";

  const separator = options.separator !== undefined ? options.separator : " ";
  const collapseParagraphs = options.collapseParagraphs ?? false;

  if (collapseParagraphs) {
    // Keep double newlines as paragraph breaks, but join single newlines
    const paragraphs = input.split(/\n\s*\n/);
    const cleanedParagraphs = paragraphs.map((p) => {
      const lines = p.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      return lines.join(separator);
    });
    return cleanedParagraphs.filter(Boolean).join("\n\n");
  }

  // Join all lines with separator, ensuring words do not collide
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.join(separator);
}
