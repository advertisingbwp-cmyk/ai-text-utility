/**
 * Lorem Ipsum Generator
 * Generates natural Latin placeholder text with configurable units:
 * paragraphs, sentences, or words.
 */

export type LoremUnit = "paragraphs" | "sentences" | "words";

export interface LoremIpsumOptions {
  unit?: LoremUnit;
  count?: number;
  startWithLoremIpsum?: boolean;
}

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos",
  "accusamus", "iusto", "odio", "dignissimos", "ducimus", "blanditiis",
  "praesentium", "voluptatum", "deleniti", "atque", "corrupti", "quos", "dolores",
  "quas", "molestias", "excepturi", "sint", "obcaecati", "cupiditate", "provident",
  "similique", "sunt", "in", "culpa", "officia", "deserunt", "mollitia", "animi",
  "dolorum", "fuga", "harum", "quidem", "rerum", "facilis", "expedita", "distinctio",
  "nam", "libero", "tempore", "cum", "soluta", "nobis", "eligendi", "optio",
  "cumque", "nihil", "impedit", "quo", "minus", "quod", "maxime", "placeat",
  "facere", "possimus", "omnis", "voluptas", "assumenda", "est", "omnis", "dolor",
  "repellendus", "temporibus", "autem", "quibusdam", "debitis", "aut", "rerum",
  "necessitatibus", "saepe", "eveniet", "voluptates", "repudiandae", "sint", "molestiae",
];

const STANDARD_INTRO = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function getRandomWord(): string {
  const idx = Math.floor(Math.random() * LOREM_WORDS.length);
  return LOREM_WORDS[idx];
}

function generateSentence(minWords = 8, maxWords = 18): string {
  const wordCount = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(getRandomWord());
  }

  // Capitalize first word
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  // Optionally insert a comma in the middle
  if (wordCount > 9 && Math.random() > 0.4) {
    const commaIndex = Math.floor(wordCount / 2);
    words[commaIndex] = words[commaIndex] + ",";
  }

  return words.join(" ") + ".";
}

function generateParagraph(sentenceCount = 4): string {
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}

export function generateLoremIpsum(options: LoremIpsumOptions = {}): string {
  const {
    unit = "paragraphs",
    count = 3,
    startWithLoremIpsum = true,
  } = options;

  const validCount = Math.max(1, Math.min(100, count));

  if (unit === "words") {
    const words: string[] = [];
    if (startWithLoremIpsum) {
      const introWords = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(" ");
      for (let i = 0; i < validCount; i++) {
        words.push(i < introWords.length ? introWords[i] : getRandomWord());
      }
    } else {
      for (let i = 0; i < validCount; i++) {
        words.push(getRandomWord());
      }
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
    return words.join(" ") + ".";
  }

  if (unit === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < validCount; i++) {
      if (i === 0 && startWithLoremIpsum) {
        sentences.push(STANDARD_INTRO);
      } else {
        sentences.push(generateSentence());
      }
    }
    return sentences.join(" ");
  }

  // Paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < validCount; i++) {
    if (i === 0 && startWithLoremIpsum) {
      const restSentences = [generateSentence(), generateSentence(), generateSentence()];
      paragraphs.push([STANDARD_INTRO, ...restSentences].join(" "));
    } else {
      paragraphs.push(generateParagraph(4 + (i % 3)));
    }
  }

  return paragraphs.join("\n\n");
}
