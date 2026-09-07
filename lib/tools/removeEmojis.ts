export function removeEmojis(input: string): string {
  if (!input) return "";

  // Comprehensive Unicode regex matching Extended Pictographic, Emoji Presentation, and zero-width joiners
  return input
    .replace(
      /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F1E6}-\u{1F1FF}\u{200D}\u{FE0F}\u{FE0E}]/gu,
      ""
    )
    .replace(/\s{2,}/g, " ") // Clean up collapsed spaces left by stripped emojis
    .trim();
}
