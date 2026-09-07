import test from "node:test";
import assert from "node:assert/strict";

import { convertCase } from "../../lib/tools/caseConverter.ts";
import { sortLines } from "../../lib/tools/sortLines.ts";
import { reverseText } from "../../lib/tools/reverseText.ts";
import { transformBase64, encodeBase64, decodeBase64 } from "../../lib/tools/base64Tool.ts";
import { transformUrl } from "../../lib/tools/urlEncoderTool.ts";
import { generateHash } from "../../lib/tools/hashGenerator.ts";
import { decodeJwt } from "../../lib/tools/jwtDecoder.ts";
import { generatePasswords } from "../../lib/tools/passwordGenerator.ts";
import { generateUuids } from "../../lib/tools/uuidGenerator.ts";
import { generateLoremIpsum } from "../../lib/tools/loremIpsum.ts";
import { rot13 } from "../../lib/tools/rot13.ts";
import { convertFancyFont, generateAllFancyFonts } from "../../lib/tools/fancyFonts.ts";

test("1. Case Converter", () => {
  assert.equal(convertCase("", "uppercase"), "");

  const sample = "hello world_test-example";
  assert.equal(convertCase(sample, "uppercase"), "HELLO WORLD_TEST-EXAMPLE");
  assert.equal(convertCase("HELLO WORLD", "lowercase"), "hello world");
  assert.equal(convertCase("the quick brown fox", "title"), "The Quick Brown Fox");
  assert.equal(convertCase("hello world. this is a test! how are you?", "sentence"), "Hello world. This is a test! How are you?");
  assert.equal(convertCase("hello world test", "camel"), "helloWorldTest");
  assert.equal(convertCase("hello world test", "pascal"), "HelloWorldTest");
  assert.equal(convertCase("hello World Test", "snake"), "hello_world_test");
  assert.equal(convertCase("hello World Test", "kebab"), "hello-world-test");

  // Unicode letter support
  assert.equal(convertCase("élégant café", "uppercase"), "ÉLÉGANT CAFÉ");
});

test("2. Sort Lines", () => {
  assert.equal(sortLines(""), "");

  const fruits = "Zebra\nApple\nMango\nApple\nBanana";

  // A-Z with deduplication
  const sortedAzDeduped = sortLines(fruits, { order: "az", preserveDuplicates: false });
  assert.equal(sortedAzDeduped, "Apple\nBanana\nMango\nZebra");

  // Z-A with duplicates preserved
  const sortedZa = sortLines(fruits, { order: "za", preserveDuplicates: true });
  assert.equal(sortedZa, "Zebra\nMango\nBanana\nApple\nApple");

  // Shortest -> Longest
  const lines = "a\naaaa\naa\naaaaaa\naaa";
  assert.equal(sortLines(lines, { order: "shortest-first" }), "a\naa\naaa\naaaa\naaaaaa");

  // Longest -> Shortest
  assert.equal(sortLines(lines, { order: "longest-first" }), "aaaaaa\naaaa\naaa\naa\na");

  // Numeric / Natural sorting
  const numList = "item10\nitem2\nitem1\nitem20";
  assert.equal(sortLines(numList, { order: "numeric" }), "item1\nitem2\nitem10\nitem20");
});

test("3. Reverse Text", () => {
  assert.equal(reverseText(""), "");

  // Characters with Unicode emojis / surrogate pairs
  assert.equal(reverseText("Hello 🚀"), "🚀 olleH");

  // Words
  assert.equal(reverseText("The quick brown fox", "words"), "fox brown quick The");

  // Lines
  assert.equal(reverseText("Line 1\nLine 2\nLine 3", "lines"), "Line 3\nLine 2\nLine 1");
});

test("4. Base64 Encoder / Decoder", () => {
  assert.equal(encodeBase64(""), "");
  assert.equal(decodeBase64("").result, "");

  // Unicode & Emoji support
  const unicodeText = "Hello World! 🚀 Café München & 北京";
  const encoded = encodeBase64(unicodeText);
  const decoded = decodeBase64(encoded);
  assert.equal(decoded.result, unicodeText);

  // URL-Safe Base64
  const urlSafeEncoded = encodeBase64("subject?query=1&flag=true", true);
  assert.ok(!urlSafeEncoded.includes("+"));
  assert.ok(!urlSafeEncoded.includes("/"));
  assert.ok(!urlSafeEncoded.endsWith("="));
  assert.equal(decodeBase64(urlSafeEncoded).result, "subject?query=1&flag=true");

  // Malformed Base64 error
  const invalidResult = decodeBase64("@@Not-Valid-Base64!!");
  assert.ok(invalidResult.error);
});

test("5. URL Encoder / Decoder", () => {
  assert.equal(transformUrl("").result, "");

  const text = "Hello World & Next.js = 100%!";
  const encoded = transformUrl(text, { mode: "encode", scope: "component" });
  assert.equal(encoded.result, "Hello%20World%20%26%20Next.js%20%3D%20100%25!");

  const decoded = transformUrl(encoded.result, { mode: "decode", scope: "component" });
  assert.equal(decoded.result, text);

  // Malformed percent-encoded input
  const malformed = transformUrl("%E0%A4%A", { mode: "decode" });
  assert.ok(malformed.error);
  assert.ok(malformed.error.includes("Malformed URL encoding"));
});

test("6. Hash Generator", async () => {
  const empty = await generateHash("");
  assert.equal(empty.hash, "");

  const sample = "Antigravity2026";
  const sha256Res = await generateHash(sample, { algorithm: "SHA-256" });
  assert.equal(sha256Res.algorithm, "SHA-256");
  assert.equal(sha256Res.hash.length, 64);
  assert.equal(sha256Res.byteLength, 32);

  // Uppercase hex
  const upperRes = await generateHash(sample, { algorithm: "SHA-256", uppercase: true });
  assert.equal(upperRes.hash, sha256Res.hash.toUpperCase());

  // SHA-1 warning
  const sha1Res = await generateHash(sample, { algorithm: "SHA-1" });
  assert.equal(sha1Res.algorithm, "SHA-1");
  assert.equal(sha1Res.hash.length, 40);
  assert.ok(sha1Res.warning);
  assert.ok(sha1Res.warning.includes("SHA-1 is cryptographically broken"));
});

test("7. JWT Decoder", () => {
  // Empty
  assert.equal(decodeJwt("").isValid, false);

  // Malformed structure
  assert.equal(decodeJwt("invalid.token").isValid, false);

  // Standard valid JWT
  const validToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MTYyMzkwMjJ9.4pz-KEndggPQywPpVIcv";
  const decoded = decodeJwt(validToken);

  assert.equal(decoded.isValid, true);
  assert.equal(decoded.header?.alg, "HS256");
  assert.equal(decoded.payload?.sub, "1234567890");
  assert.equal(decoded.payload?.name, "John Doe");
  assert.equal(decoded.isExpired, false);
  assert.ok(decoded.warning.includes("SECURITY WARNING"));
});

test("8. Password Generator", () => {
  const res = generatePasswords({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    count: 3,
  });

  assert.equal(res.passwords.length, 3);
  for (const pw of res.passwords) {
    assert.equal(pw.length, 20);
    assert.match(pw, /[A-Z]/);
    assert.match(pw, /[a-z]/);
    assert.match(pw, /[0-9]/);
  }
  assert.equal(res.strength, "very-strong");

  // Exclude ambiguous characters
  const unambiguous = generatePasswords({
    length: 50,
    excludeAmbiguous: true,
  });
  assert.ok(!/[il1Lo0OI]/.test(unambiguous.passwords[0]));
});

test("9. UUID Generator", () => {
  const uuids = generateUuids({ count: 5 });
  assert.equal(uuids.length, 5);

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  for (const id of uuids) {
    assert.match(id, uuidRegex);
  }

  // Format options: uppercase and removeHyphens
  const customUuids = generateUuids({ count: 2, uppercase: true, removeHyphens: true });
  assert.equal(customUuids[0].length, 32);
  assert.ok(!customUuids[0].includes("-"));
  assert.equal(customUuids[0], customUuids[0].toUpperCase());
});

test("10. Lorem Ipsum Generator", () => {
  // Paragraphs
  const paras = generateLoremIpsum({ unit: "paragraphs", count: 2, startWithLoremIpsum: true });
  assert.ok(paras.startsWith("Lorem ipsum dolor sit amet"));
  assert.equal(paras.split("\n\n").length, 2);

  // Sentences
  const sentences = generateLoremIpsum({ unit: "sentences", count: 3 });
  assert.ok(sentences.length > 20);

  // Words
  const words = generateLoremIpsum({ unit: "words", count: 10 });
  assert.equal(words.split(" ").length, 10);
});

test("11. ROT13 Cipher", () => {
  assert.equal(rot13(""), "");

  const sample = "The Quick Brown Fox Jumps Over The Lazy Dog 123! Café 🚀";
  const rotated = rot13(sample);
  // ASCII rotated
  assert.ok(rotated.startsWith("Gur Dhvpx Oebja Sbk"));
  // Numbers, punctuation, non-ASCII Unicode (é) and emojis intact
  assert.ok(rotated.includes("123!"));
  assert.ok(rotated.includes("Pnsé 🚀"));

  // ROT13 is symmetric: rot13(rot13(x)) === x
  assert.equal(rot13(rotated), sample);
});

test("12. Fancy Unicode Fonts Generator", () => {
  assert.equal(convertFancyFont("", "gothic"), "");

  const sample = "Text 2026!";

  // Gothic
  const gothic = convertFancyFont(sample, "gothic");
  assert.ok(gothic.includes("𝔗𝔢𝔵𝔱"));
  assert.ok(gothic.endsWith("!"));

  // Bold Sans
  const boldSans = convertFancyFont(sample, "bold-sans");
  assert.ok(boldSans.includes("𝗧𝗲𝘅𝘁"));
  assert.ok(boldSans.includes("𝟮𝟬𝟮𝟲"));

  // Circled
  const circled = convertFancyFont(sample, "circled");
  assert.ok(circled.includes("Ⓣⓔⓧⓣ"));

  // Double-Struck
  const dblStruck = convertFancyFont(sample, "double-struck");
  assert.ok(dblStruck.includes("𝕋𝕖𝕩𝕥"));

  // Small Caps
  const smallCaps = convertFancyFont("sample", "small-caps");
  assert.ok(smallCaps.includes("sᴀᴍᴘʟᴇ"));

  // Strikethrough combining
  const strike = convertFancyFont("abc", "strikethrough");
  assert.ok(strike.includes("\u0336"));

  // Wings & Stars frame
  const wings = convertFancyFont("sample", "wings-stars");
  assert.ok(wings.includes("★彡"));
  assert.ok(wings.includes("彡★"));

  // Generate all styles
  const allStyles = generateAllFancyFonts("Hello");
  assert.ok(allStyles.length >= 40);
  assert.ok(allStyles.some((s) => s.id === "script"));
  assert.ok(allStyles.some((s) => s.id === "wings-stars"));
  assert.ok(allStyles.some((s) => s.id === "crazy-mix"));
});
