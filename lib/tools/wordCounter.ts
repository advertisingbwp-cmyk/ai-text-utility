export interface WordStatistics {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  lines: number;
  paragraphs: number;
  readingTimeSeconds: number;
  readingTimeFormatted: string;
  speakingTimeSeconds: number;
  speakingTimeFormatted: string;
}

export function calculateWordStatistics(input: string): WordStatistics {
  if (!input) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      lines: 0,
      paragraphs: 0,
      readingTimeSeconds: 0,
      readingTimeFormatted: "0s",
      speakingTimeSeconds: 0,
      speakingTimeFormatted: "0s",
    };
  }

  const characters = input.length;
  const charactersNoSpaces = input.replace(/\s/g, "").length;

  const trimmed = input.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  const lines = input.split(/\r?\n/).length;

  const paragraphs = trimmed
    ? trimmed.split(/\r?\n\s*\r?\n/).filter((p) => p.trim().length > 0).length
    : 0;

  const sentences = trimmed
    ? trimmed
        .split(/[.!?]+(?:\s+|$)/)
        .filter((s) => s.trim().length > 0).length
    : 0;

  // Reading time at ~200 WPM
  const readingTimeSeconds = words > 0 ? Math.ceil((words / 200) * 60) : 0;
  const readingTimeFormatted =
    readingTimeSeconds >= 60
      ? `${Math.floor(readingTimeSeconds / 60)}m ${readingTimeSeconds % 60}s`
      : `${readingTimeSeconds}s`;

  // Speaking time at ~130 WPM
  const speakingTimeSeconds = words > 0 ? Math.ceil((words / 130) * 60) : 0;
  const speakingTimeFormatted =
    speakingTimeSeconds >= 60
      ? `${Math.floor(speakingTimeSeconds / 60)}m ${speakingTimeSeconds % 60}s`
      : `${speakingTimeSeconds}s`;

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    lines,
    paragraphs,
    readingTimeSeconds,
    readingTimeFormatted,
    speakingTimeSeconds,
    speakingTimeFormatted,
  };
}

export function formatWordStatisticsReport(stats: WordStatistics): string {
  return [
    `Word Count             : ${stats.words.toLocaleString()}`,
    `Character Count        : ${stats.characters.toLocaleString()}`,
    `Characters (no spaces) : ${stats.charactersNoSpaces.toLocaleString()}`,
    `Sentence Count         : ${stats.sentences.toLocaleString()}`,
    `Paragraph Count        : ${stats.paragraphs.toLocaleString()}`,
    `Line Count             : ${stats.lines.toLocaleString()}`,
    `Estimated Reading Time : ${stats.readingTimeFormatted}`,
    `Estimated Speaking Time: ${stats.speakingTimeFormatted}`,
  ].join("\n");
}
