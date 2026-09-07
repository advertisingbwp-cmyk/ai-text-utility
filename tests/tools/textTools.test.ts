import test from "node:test";
import assert from "node:assert/strict";

import { convertTabsAndSpaces } from "../../lib/tools/tabsToSpaces.ts";
import { removeLetterAccents } from "../../lib/tools/removeAccents.ts";
import { generateSlug } from "../../lib/tools/slugGenerator.ts";
import { removeEmojis } from "../../lib/tools/removeEmojis.ts";
import { calculateWordStatistics } from "../../lib/tools/wordCounter.ts";
import { analyzeCharacterFrequency } from "../../lib/tools/characterFrequency.ts";
import { analyzeWordFrequency } from "../../lib/tools/wordFrequency.ts";
import { testRegex } from "../../lib/tools/regexTester.ts";
import { extractEmailsAndUrls } from "../../lib/tools/extractEmailsUrls.ts";
import { parseQueryString } from "../../lib/tools/queryStringParser.ts";

test("1. Tabs <-> Spaces Converter", () => {
  assert.equal(convertTabsAndSpaces(""), "");
  assert.equal(
    convertTabsAndSpaces("\thello\tworld", { direction: "tabs-to-spaces", spacesPerTab: 2 }),
    "  hello  world"
  );
  assert.equal(
    convertTabsAndSpaces("\thello", { direction: "tabs-to-spaces", spacesPerTab: 4 }),
    "    hello"
  );
  assert.equal(
    convertTabsAndSpaces("    hello", { direction: "spaces-to-tabs", spacesPerTab: 4 }),
    "\thello"
  );
});

test("2. Remove Accents / Diacritics", () => {
  assert.equal(removeLetterAccents(""), "");
  assert.equal(
    removeLetterAccents("Crème brûlée, résumé, façade, naïve, señor, El Niño."),
    "Creme brulee, resume, facade, naive, senor, El Nino."
  );
  assert.equal(removeLetterAccents("Straße"), "Strasse");
  assert.equal(removeLetterAccents("pure ascii text 123"), "pure ascii text 123");
});

test("3. Slug Generator", () => {
  assert.equal(generateSlug(""), "");
  assert.equal(
    generateSlug("How to Build & Deploy a Next.js App in 2026!"),
    "how-to-build-and-deploy-a-nextjs-app-in-2026"
  );
  assert.equal(
    generateSlug("---  Café  ---  Résumé  ---"),
    "cafe-resume"
  );
  assert.equal(
    generateSlug("Multiple   ---   Spaces  &&& Hyphens"),
    "multiple-spaces-and-and-and-hyphens"
  );
  assert.equal(
    generateSlug("Custom Separator Test", { separator: "_" }),
    "custom_separator_test"
  );
});

test("4. Remove Emojis", () => {
  assert.equal(removeEmojis(""), "");
  assert.equal(
    removeEmojis("Hello world! 🚀 Exploring tech 🤖✨ Have a blast! 🎉"),
    "Hello world! Exploring tech Have a blast!"
  );
  assert.equal(removeEmojis("No emojis here 123."), "No emojis here 123.");
});

test("5. Word Counter", () => {
  const empty = calculateWordStatistics("");
  assert.equal(empty.words, 0);
  assert.equal(empty.characters, 0);
  assert.equal(empty.sentences, 0);
  assert.equal(empty.lines, 0);

  const sample = "First sentence. Second sentence!\n\nThird sentence in paragraph two?";
  const stats = calculateWordStatistics(sample);
  assert.equal(stats.words, 9);
  assert.equal(stats.sentences, 3);
  assert.equal(stats.paragraphs, 2);
  assert.equal(stats.lines, 3);
  assert.ok(stats.characters > stats.charactersNoSpaces);
  assert.ok(stats.readingTimeSeconds > 0);
});

test("6. Character Frequency Analyzer", () => {
  assert.deepEqual(analyzeCharacterFrequency(""), []);

  const items = analyzeCharacterFrequency("aab c", { sortBy: "frequency" });
  assert.equal(items[0].character, "a");
  assert.equal(items[0].count, 2);

  const alpha = analyzeCharacterFrequency("ba c", { sortBy: "alphabetical", ignoreWhitespace: true });
  assert.equal(alpha[0].character, "a");
  assert.equal(alpha[1].character, "b");
  assert.equal(alpha[2].character, "c");
});

test("7. Word Frequency Lists", () => {
  assert.deepEqual(analyzeWordFrequency(""), []);

  const items = analyzeWordFrequency("the apple and the banana and the orange");
  assert.equal(items[0].word, "the");
  assert.equal(items[0].count, 3);
  assert.equal(items[1].word, "and");
  assert.equal(items[1].count, 2);

  const alpha = analyzeWordFrequency("zebra apple banana", { sortBy: "alphabetical" });
  assert.equal(alpha[0].word, "apple");
  assert.equal(alpha[1].word, "banana");
  assert.equal(alpha[2].word, "zebra");
});

test("8. Regular Expression Tester", () => {
  // Empty pattern
  const empty = testRegex("test text", "");
  assert.equal(empty.matchCount, 0);
  assert.equal(empty.isValid, true);

  // Valid pattern
  const res = testRegex("user_id_1024 completed task at 2026-09-07", "user_id_(\\d+)");
  assert.equal(res.isValid, true);
  assert.equal(res.matchCount, 1);
  assert.equal(res.matches[0].groups[0].value, "1024");

  // Invalid regex pattern
  const invalid = testRegex("hello", "[invalid(");
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.error);
});

test("9. Extract Emails / URLs", () => {
  assert.deepEqual(extractEmailsAndUrls(""), { emails: [], urls: [], totalFound: 0 });

  const text = "Contact contact@example.com or support@example.com. Visit https://example.com and www.test.org/api.";
  const res = extractEmailsAndUrls(text);
  assert.equal(res.emails.length, 2);
  assert.ok(res.emails.includes("contact@example.com"));
  assert.ok(res.emails.includes("support@example.com"));
  assert.equal(res.urls.length, 2);
  assert.ok(res.urls.includes("https://example.com"));
  assert.ok(res.urls.includes("https://www.test.org/api"));
});

test("10. Query String Parser", () => {
  assert.deepEqual(parseQueryString(""), {
    entries: [],
    totalParams: 0,
    uniqueKeys: 0,
    jsonRepresentation: {},
  });

  const parsed = parseQueryString("?name=John&age=25&role=dev&flag");
  assert.equal(parsed.totalParams, 4);
  assert.equal(parsed.jsonRepresentation["name"], "John");
  assert.equal(parsed.jsonRepresentation["age"], "25");
  assert.equal(parsed.jsonRepresentation["role"], "dev");
  assert.equal(parsed.jsonRepresentation["flag"], "");

  // URL decoding and duplicate keys
  const complex = parseQueryString("https://example.com/search?q=hello+world&tag=react&tag=nextjs&code=%E2%9C%93");
  assert.equal(complex.jsonRepresentation["q"], "hello world");
  assert.deepEqual(complex.jsonRepresentation["tag"], ["react", "nextjs"]);
  assert.equal(complex.jsonRepresentation["code"], "✓");
});
