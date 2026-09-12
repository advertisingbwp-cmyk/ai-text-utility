import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateWordStatistics,
  convertCase,
  generateSlug,
  formatAndValidateJson,
  convertJsonToCsv,
  convertCsvToJson,
  testRegex,
  extractEmailsAndUrls,
  removeDuplicateLines,
  removeEmptyLines,
  trimLines,
  removeExtraSpaces,
  stripHtmlTags,
  removeSpecialChars,
  addLineNumbers,
  reverseText,
} from "../../lib/tools/index.ts";

test("Phase 2 - 1. Word Counter: CRLF, Sentences & Reading Time", () => {
  // Test CRLF paragraph counting
  const crlfText = "Paragraph one with some words.\r\n\r\nParagraph two with more words.\r\n\r\nParagraph three.";
  const crlfStats = calculateWordStatistics(crlfText);
  assert.equal(crlfStats.paragraphs, 3, "CRLF text should have exactly 3 paragraphs");
  assert.equal(crlfStats.lines, 5, "CRLF text should have 5 lines");
  assert.equal(crlfStats.words, 12, "Word count should be 12");
  assert.equal(crlfStats.sentences, 3, "Sentence count should be 3");

  // Test sentence boundary punctuation (. ! ?)
  const punctuationText = "Hello world! How are you doing? I am fine... Thanks.";
  const puncStats = calculateWordStatistics(punctuationText);
  assert.equal(puncStats.sentences, 4, "Should recognize !, ?, ..., and . as sentence terminators");

  // Test reading and speaking times
  assert.equal(crlfStats.readingTimeFormatted, "4s");
  assert.equal(crlfStats.speakingTimeFormatted, "6s");

  // Empty string
  const emptyStats = calculateWordStatistics("");
  assert.equal(emptyStats.words, 0);
  assert.equal(emptyStats.characters, 0);
  assert.equal(emptyStats.paragraphs, 0);
  assert.equal(emptyStats.readingTimeFormatted, "0s");
});

test("Phase 2 - 2. Case Converter: All 8 Modes & Acronym Boundaries", () => {
  const input = "getHTMLParserResponse";

  assert.equal(convertCase(input, "uppercase"), "GETHTMLPARSERRESPONSE");
  assert.equal(convertCase(input, "lowercase"), "gethtmlparserresponse");
  assert.equal(convertCase(input, "camel"), "getHtmlParserResponse");
  assert.equal(convertCase(input, "pascal"), "GetHtmlParserResponse");
  assert.equal(convertCase(input, "snake"), "get_html_parser_response");
  assert.equal(convertCase(input, "kebab"), "get-html-parser-response");
  assert.equal(convertCase("hello world", "title"), "Hello World");
  assert.equal(convertCase("hello world. how are you?", "sentence"), "Hello world. How are you?");

  // Multi-language unicode case conversion
  assert.equal(convertCase("café naïve", "uppercase"), "CAFÉ NAÏVE");
  assert.equal(convertCase("MÜNCHEN STRASSE", "lowercase"), "münchen strasse");
  assert.equal(convertCase("über-cool-tool", "camel"), "überCoolTool");
});

test("Phase 2 - 3. Slug Generator: Custom Separators & Diacritics", () => {
  // Default separator (-) and diacritics
  const slug1 = generateSlug("Crème Brûlée & Café au Lait!");
  assert.equal(slug1, "creme-brulee-and-cafe-au-lait");

  // Custom separator (_)
  const slug2 = generateSlug("User Profile: Settings & Privacy 100%", { separator: "_" });
  assert.equal(slug2, "user_profile_settings_and_privacy_100_percent");

  // Symbol mappings (@ and %)
  const slug3 = generateSlug("Meet me @ the park with 50% discount");
  assert.equal(slug3, "meet-me-at-the-park-with-50-percent-discount");

  // Preserve case option
  const slug4 = generateSlug("Version v2.0 Release", { preserveCase: true });
  assert.equal(slug4, "Version-v20-Release");

  // Multiple consecutive symbols and spaces
  const slug5 = generateSlug("   ---Hello...  World???---   ");
  assert.equal(slug5, "hello-world");
});

test("Phase 2 - 4. JSON Formatter & Validator: Deep Sort & Error Locators", () => {
  // Unsorted keys deep test
  const rawJson = JSON.stringify({
    zebra: 1,
    apple: { kiwi: true, banana: [3, 2, 1] },
    mango: 2,
  });

  const formattedSorted = formatAndValidateJson(rawJson, { sortKeys: true, indentation: 2 });
  assert.equal(formattedSorted.isValid, true);
  const parsedSorted = JSON.parse(formattedSorted.formatted);
  assert.deepEqual(Object.keys(parsedSorted), ["apple", "mango", "zebra"]);
  assert.deepEqual(Object.keys(parsedSorted.apple), ["banana", "kiwi"]);

  // Minify option
  const minified = formatAndValidateJson(rawJson, { indentation: "minify" });
  assert.equal(minified.isValid, true);
  assert.ok(!minified.formatted.includes("\n"));

  // Error location test
  const brokenJson = '{\n  "name": "test",\n  "age": \n}';
  const errResult = formatAndValidateJson(brokenJson);
  assert.equal(errResult.isValid, false);
  assert.ok(errResult.error);
  assert.ok(errResult.errorLine !== undefined && errResult.errorLine >= 1);

  // Primitives
  assert.equal(formatAndValidateJson("123").isValid, true);
  assert.equal(formatAndValidateJson('"just a string"').isValid, true);
  assert.equal(formatAndValidateJson("true").isValid, true);
  assert.equal(formatAndValidateJson("null").isValid, true);
});

test("Phase 2 - 5. JSON ↔ CSV: Quoting, Multi-line & Leading Zeros Preservation", () => {
  // Critical fix: Leading zeros in postal codes / IDs must NOT be coerced to number
  const csvWithLeadingZeros = `id,zip,name\n001,01234,Boston Office\n002,00852,San Juan`;
  const jsonOutput = convertCsvToJson(csvWithLeadingZeros);
  const parsedJson = JSON.parse(jsonOutput);

  assert.equal(parsedJson[0].id, "001", "Leading zeros on id must be preserved as string");
  assert.equal(parsedJson[0].zip, "01234", "Leading zeros on zip code must be preserved as string");
  assert.equal(parsedJson[1].id, "002");
  assert.equal(parsedJson[1].zip, "00852");

  // Values with newlines and commas
  const complexData = [
    { title: "Line 1\nLine 2", tag: "Tech, AI", rating: 5 },
    { title: 'Contains "quotes"', tag: "Simple", rating: 4 },
  ];

  const csv = convertJsonToCsv(JSON.stringify(complexData));
  assert.ok(csv.includes('"Line 1\nLine 2"'));
  assert.ok(csv.includes('"Tech, AI"'));
  assert.ok(csv.includes('"Contains ""quotes"""'));

  // Roundtrip back to JSON
  const roundtripJson = convertCsvToJson(csv);
  const roundtripParsed = JSON.parse(roundtripJson);
  assert.equal(roundtripParsed[0].title, "Line 1\nLine 2");
  assert.equal(roundtripParsed[0].tag, "Tech, AI");
  assert.equal(roundtripParsed[0].rating, 5);
  assert.equal(roundtripParsed[1].title, 'Contains "quotes"');
});

test("Phase 2 - 6. Regex Tester: Named Capture Groups Without Duplication", () => {
  // Regex with both named and regular capture groups
  const regexRes = testRegex(
    "Date: 2026-09-12 and 2025-01-01",
    "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})"
  );

  assert.equal(regexRes.isValid, true);
  assert.equal(regexRes.matchCount, 2);

  const firstMatch = regexRes.matches[0];
  assert.equal(firstMatch.match, "2026-09-12");
  // Group count must be exactly 3 (year, month, day), NOT duplicated to 6
  assert.equal(firstMatch.groups.length, 3, "Named groups must not create duplicate entries");
  assert.equal(firstMatch.groups[0].name, "year");
  assert.equal(firstMatch.groups[0].value, "2026");
  assert.equal(firstMatch.groups[1].name, "month");
  assert.equal(firstMatch.groups[1].value, "09");
  assert.equal(firstMatch.groups[2].name, "day");
  assert.equal(firstMatch.groups[2].value, "12");

  // Zero width assertions
  const boundaryRes = testRegex("the cat in the hat", "\\bcat\\b");
  assert.equal(boundaryRes.matchCount, 1);
  assert.equal(boundaryRes.matches[0].match, "cat");
});

test("Phase 2 - 7. Text Cleanup: Duplicate Lines & Preserved Newlines", () => {
  // Duplicate lines with whitespace difference
  const wsLines = "item 1\n  item 1  \nitem 2\nitem 1";
  const dedupedExact = removeDuplicateLines(wsLines, { trimBeforeCompare: false });
  assert.equal(dedupedExact, "item 1\n  item 1  \nitem 2");

  const dedupedTrimmed = removeDuplicateLines(wsLines, { trimBeforeCompare: true });
  assert.equal(dedupedTrimmed, "item 1\nitem 2");

  // Special characters with preserveNewlines
  const codeSnippet = "\n\nHello @World #2026!\nLine two with $dollar.\n\n";
  const cleanedCode = removeSpecialChars(codeSnippet, {
    mode: "alphanumeric-only",
    preserveNewlines: true,
    preserveSpaces: true,
  });

  // Verify document-level newlines are not destroyed by .trim()
  assert.ok(cleanedCode.startsWith("\n\n"), "Leading newlines must be preserved");
  assert.ok(cleanedCode.endsWith("\n\n"), "Trailing newlines must be preserved");
  assert.ok(cleanedCode.includes("Hello World 2026"));

  // Strip HTML tags with script without hanging
  const dirtyHtml = "<p>Clean text</p><script>alert('malicious')</script><b>Bold</b>";
  const stripped = stripHtmlTags(dirtyHtml);
  assert.equal(stripped.replace(/\s+/g, " ").trim(), "Clean text Bold");
});

test("Phase 2 - 8. Email & URL Extraction: Advanced Boundaries", () => {
  const text = `
    Contact us at Support@AI-Text-Utility.com or sales@example.co.uk.
    Visit https://ai-text-utility.vercel.app/tools/word-counter?ref=producthunt#demo!
    Also check www.github.com/advertisingbwp-cmyk/ai-text-utility, and ftp://files.example.com/data.zip.
    Duplicate mention of support@ai-text-utility.com should be deduplicated.
  `;

  const extracted = extractEmailsAndUrls(text, { deduplicate: true, sort: true });

  // Emails should be lowercased and deduplicated
  assert.equal(extracted.emails.length, 2);
  assert.equal(extracted.emails[0], "sales@example.co.uk");
  assert.equal(extracted.emails[1], "support@ai-text-utility.com");

  // URLs should have punctuation stripped and www prefixed
  assert.ok(extracted.urls.some((u) => u.startsWith("https://ai-text-utility.vercel.app")));
  assert.ok(extracted.urls.some((u) => u.startsWith("https://www.github.com")));
  assert.ok(extracted.urls.some((u) => u.startsWith("ftp://files.example.com")));
  // Ensure trailing comma or exclamation was not captured as part of URL
  assert.ok(!extracted.urls.some((u) => u.endsWith("!") || u.endsWith(",")));
});

test("Phase 2 - 9. Pure Function Determinism", () => {
  const testString = "  Hello World 2026! Testing Pure Function Consistency.  ";

  // Run 10 times consecutively - each execution must be identical (referential and value equality)
  const initialWordStats = calculateWordStatistics(testString);
  const initialSlug = generateSlug(testString);
  const initialCase = convertCase(testString, "kebab");
  const initialRev = reverseText(testString, "words");
  const initialNum = addLineNumbers(testString);

  for (let i = 0; i < 10; i++) {
    assert.deepEqual(calculateWordStatistics(testString), initialWordStats);
    assert.equal(generateSlug(testString), initialSlug);
    assert.equal(convertCase(testString, "kebab"), initialCase);
    assert.equal(reverseText(testString, "words"), initialRev);
    assert.equal(addLineNumbers(testString), initialNum);
  }
});

test("Phase 2 - 10. Large Input Safety & Performance (150KB+)", () => {
  const paragraph = "The quick brown fox jumps over the lazy dog repeatedly in high performance testing scenarios. 1234567890.\n";
  const largeInput = paragraph.repeat(1500); // ~160KB of text
  assert.ok(largeInput.length > 150000);

  const start = Date.now();

  // Test speed of core transformations on large input
  const stats = calculateWordStatistics(largeInput);
  assert.ok(stats.words > 15000);

  const deduped = removeDuplicateLines(largeInput);
  assert.ok(deduped.length < 500); // Collapses to 1 line

  const slug = generateSlug(largeInput.slice(0, 1000));
  assert.ok(slug.length > 0);

  const duration = Date.now() - start;
  // Should easily finish under 200ms
  assert.ok(duration < 500, `Execution time was ${duration}ms, expected under 500ms`);
});
