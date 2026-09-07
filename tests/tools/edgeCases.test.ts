import test from "node:test";
import assert from "node:assert/strict";

import {
  convertTabsAndSpaces,
  removeLetterAccents,
  generateSlug,
  removeEmojis,
  calculateWordStatistics,
  analyzeCharacterFrequency,
  analyzeWordFrequency,
  testRegex,
  extractEmailsAndUrls,
  parseQueryString,
  formatAndValidateJson,
  convertJsonToCsv,
  convertCsvToJson,
  addLineNumbers,
  convertMarkdownToHtml,
  minifyHtml,
  removeDuplicateLines,
  removeEmptyLines,
  trimLines,
  removeExtraSpaces,
  stripHtmlTags,
  removeLineBreaks,
  removeSpecialChars,
  convertCase,
  sortLines,
  reverseText,
  transformBase64,
  encodeBase64,
  decodeBase64,
  transformUrl,
  generateHash,
  decodeJwt,
  generatePasswords,
  generateUuids,
  generateLoremIpsum,
  rot13,
  convertFancyFont,
  convertUnixTimestamp,
  calculateDateDifference,
} from "../../lib/tools/index.ts";

test("Edge Cases 1: Unicode, Emojis, Arabic/Urdu & Multi-Language", async () => {
  const arabicUrdu = "یہ ایک آزمائشی متن ہے۔ السلام علیکم و رحمة الله و بركاته";
  const mixed = "Hello 🌍! یہ ایک ٹیسٹ ہے۔ こんにちは 123 🚀";

  // Word counter with Arabic/Urdu and emojis
  const stats = calculateWordStatistics(mixed);
  assert.ok(stats.words > 0);
  assert.ok(stats.characters > 0);

  // Slug generator with Arabic/Urdu
  const slug = generateSlug("آزمائشی عنوان Urdu Title 2026! 🔥");
  assert.ok(slug.includes("urdu-title-2026"));

  // Remove emojis
  const stripped = removeEmojis(mixed);
  assert.ok(!stripped.includes("🌍"));
  assert.ok(!stripped.includes("🚀"));
  assert.ok(stripped.includes("Hello"));
  assert.ok(stripped.includes("یہ ایک ٹیسٹ ہے۔"));

  // Reverse text with graphemes and Arabic
  const rev = reverseText("مرحبا", { mode: "characters" });
  assert.equal(rev, "ابحرم");

  // Base64 with Arabic & Emojis
  const encoded = encodeBase64(mixed);
  const decoded = decodeBase64(encoded);
  assert.equal(decoded.result, mixed);

  // Hash generator with Arabic & Emojis
  const hash = await generateHash(mixed, { algorithm: "SHA-256" });
  assert.ok(hash.hash.length === 64);

  // Character frequency with Unicode
  const charFreq = analyzeCharacterFrequency(mixed);
  assert.ok(charFreq.length > 0);

  // Word frequency with mixed text
  const wordFreq = analyzeWordFrequency(mixed);
  assert.ok(wordFreq.length > 0);
});

test("Edge Cases 2: Empty Input Handling Across All Pure Tools", async () => {
  assert.equal(convertTabsAndSpaces(""), "");
  assert.equal(removeLetterAccents(""), "");
  assert.equal(generateSlug(""), "");
  assert.equal(removeEmojis(""), "");
  assert.equal(addLineNumbers(""), "");
  assert.equal(convertMarkdownToHtml(""), "");
  assert.equal(minifyHtml("").minified, "");
  assert.equal(removeDuplicateLines(""), "");
  assert.equal(removeEmptyLines(""), "");
  assert.equal(trimLines(""), "");
  assert.equal(removeExtraSpaces(""), "");
  assert.equal(stripHtmlTags(""), "");
  assert.equal(removeLineBreaks(""), "");
  assert.equal(removeSpecialChars(""), "");
  assert.equal(convertCase("", "uppercase"), "");
  assert.equal(sortLines("", "az"), "");
  assert.equal(reverseText(""), "");
  assert.equal(transformBase64("", { mode: "encode" }).result, "");
  assert.equal(transformBase64("", { mode: "decode" }).result, "");
  assert.equal(transformUrl("", { mode: "encode" }).result, "");
  assert.equal(transformUrl("", { mode: "decode" }).result, "");
  assert.equal((await generateHash("")).hash, "");
  assert.equal(decodeJwt("").isValid, false);
  assert.equal(rot13(""), "");
  assert.equal(convertFancyFont("", "script"), "");

  const jsonEmpty = formatAndValidateJson("");
  assert.equal(jsonEmpty.isValid, true);
  assert.equal(jsonEmpty.formatted, "");

  const csvEmpty = convertJsonToCsv("");
  assert.equal(csvEmpty, "");

  const csvToJsonEmpty = convertCsvToJson("");
  assert.equal(csvToJsonEmpty, "[]");

  const dualDateEmpty = calculateDateDifference("", "");
  assert.equal(dualDateEmpty.isValid, false);

  const timestampEmpty = convertUnixTimestamp("");
  assert.equal(timestampEmpty.isValid, false);
});

test("Edge Cases 3: Very Large Input (100k+ chars)", async () => {
  // Generate 100,000 character string
  const baseChunk = "OmniText high performance browser text utility toolkit! 1234567890.\n";
  const repeatCount = Math.ceil(100000 / baseChunk.length);
  const largeText = baseChunk.repeat(repeatCount);
  assert.ok(largeText.length >= 100000);

  // Large Base64 encode & decode
  const b64 = encodeBase64(largeText);
  assert.ok(b64.length > 0);
  const back = decodeBase64(b64);
  assert.equal(back.result, largeText);

  // Large Case Conversion
  const upper = convertCase(largeText, "uppercase");
  assert.equal(upper.length, largeText.length);

  // Large Word Count
  const stats = calculateWordStatistics(largeText);
  assert.ok(stats.characters >= 100000);
  assert.ok(stats.words > 10000);

  // Large Hash Generation
  const hash = await generateHash(largeText, { algorithm: "SHA-256" });
  assert.equal(hash.hash.length, 64);

  // Large Duplicate Line Removal
  const deduped = removeDuplicateLines(largeText);
  const lines = deduped.trim().split("\n");
  assert.equal(lines.length, 1);
});

test("Edge Cases 4: Malformed and Boundary Inputs", () => {
  // 1. Broken JSON in formatter
  const brokenJson = formatAndValidateJson("{ invalid: json, missing quotes }");
  assert.equal(brokenJson.isValid, false);
  assert.ok(brokenJson.error);

  // 2. Broken JSON in JSON to CSV (throws descriptive Error)
  assert.throws(
    () => convertJsonToCsv("[{ name: 'test' incomplete"),
    /Invalid JSON/
  );

  // 3. Corrupted Base64 decoding
  const brokenB64 = decodeBase64("!!!NotABase64String===");
  assert.ok(brokenB64.error);

  // 4. Broken Percent-Encoding in URL
  const brokenUrl = transformUrl("%E0%A4%A", { mode: "decode" });
  assert.ok(brokenUrl.error);

  // 5. Broken Regex Syntax
  const brokenRegex = testRegex("sample", "[a-z");
  assert.equal(brokenRegex.isValid, false);
  assert.ok(brokenRegex.error);

  // 6. Malformed JWT tokens
  const notAJwt = decodeJwt("not.a.valid.jwt.string.with.too.many.dots");
  assert.equal(notAJwt.isValid, false);
  assert.ok(notAJwt.error);

  const brokenBase64Jwt = decodeJwt("badHeader.badPayload.badSignature");
  assert.equal(brokenBase64Jwt.isValid, false);
  assert.ok(brokenBase64Jwt.error);

  // 7. JWT with extreme non-finite or huge numbers in exp/iat (must not throw RangeError)
  const hugeExpPayload = btoa(JSON.stringify({ exp: 1e30, iat: NaN }));
  const dummyHeader = btoa(JSON.stringify({ alg: "HS256" }));
  const safeJwt = decodeJwt(`${dummyHeader}.${hugeExpPayload}.signature`);
  assert.equal(safeJwt.isValid, true);

  // 8. Invalid Unix timestamps
  const badTs = convertUnixTimestamp("not_a_valid_timestamp");
  assert.equal(badTs.isValid, false);
  assert.ok(badTs.error);

  // 9. Invalid Dates in Date Difference
  const badDateDiff = calculateDateDifference("invalid-date-1", "invalid-date-2");
  assert.equal(badDateDiff.isValid, false);
  assert.ok(badDateDiff.error);
});

test("Edge Cases 5: Security & XSS Sanitization", () => {
  // XSS vector in Markdown to HTML: javascript: protocol
  const mdJs = "[Click Me](javascript:alert('XSS'))";
  const htmlJs = convertMarkdownToHtml(mdJs);
  assert.ok(!htmlJs.includes("javascript:alert"));
  assert.ok(htmlJs.includes("#unsafe-url"));

  // XSS vector in Markdown to HTML: SVG data URI
  const mdSvg = "![Malicious SVG](data:image/svg+xml;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)";
  const htmlSvg = convertMarkdownToHtml(mdSvg);
  assert.ok(!htmlSvg.includes("data:image/svg+xml"));
  assert.ok(htmlSvg.includes("#unsafe-url"));

  // Safe raster image data URI should be allowed
  const mdPng = "![Safe PNG](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==)";
  const htmlPng = convertMarkdownToHtml(mdPng);
  assert.ok(htmlPng.includes("data:image/png;base64"));

  // HTML entity decoding with supplementary plane (code point > 65535, e.g. emoji &#128512;)
  const entityEmoji = stripHtmlTags("Hello &#128512; &#x1F600; world!");
  assert.ok(entityEmoji.includes("😀"));
});
