import test from "node:test";
import assert from "node:assert/strict";

import { formatAndValidateJson } from "../../lib/tools/jsonFormatter.ts";
import { convertJsonToCsv } from "../../lib/tools/jsonToCsv.ts";
import { convertCsvToJson } from "../../lib/tools/csvToJson.ts";
import { addLineNumbers } from "../../lib/tools/addLineNumbers.ts";
import { convertMarkdownToHtml } from "../../lib/tools/markdownToHtml.ts";
import { minifyHtml } from "../../lib/tools/htmlMinifier.ts";

test("1. JSON Formatter & Validator", () => {
  assert.equal(formatAndValidateJson("").isValid, true);

  // Valid JSON 2-space indentation
  const valid = formatAndValidateJson('{"name":"Alice","age":30,"roles":["admin","dev"]}');
  assert.equal(valid.isValid, true);
  assert.equal(valid.type, "object");
  assert.ok(valid.formatted.includes("  \"name\": \"Alice\""));

  // Minify
  const minified = formatAndValidateJson('{\n  "a": 1,\n  "b": 2\n}', { indentation: "minify" });
  assert.equal(minified.formatted, '{"a":1,"b":2}');

  // 4-space indentation
  const indent4 = formatAndValidateJson('{"a":1}', { indentation: 4 });
  assert.ok(indent4.formatted.includes("    \"a\": 1"));

  // Invalid JSON reporting
  const invalid = formatAndValidateJson('{"name": "Alice", age: 30}');
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.error);
});

test("2. JSON to CSV Converter", () => {
  assert.equal(convertJsonToCsv(""), "");

  const jsonInput = JSON.stringify([
    { id: 1, name: "Alice Johnson", role: "Engineer, Lead", note: 'Has "expert" badge' },
    { id: 2, name: "Bob Smith", role: "Designer", note: "Standard" },
  ]);

  const csv = convertJsonToCsv(jsonInput);
  const lines = csv.split("\n");

  assert.equal(lines[0], "id,name,role,note");
  // Commas and quotes properly quoted and escaped
  assert.ok(lines[1].includes('"Engineer, Lead"'));
  assert.ok(lines[1].includes('"Has ""expert"" badge"'));

  // Invalid non-array throws clear error
  assert.throws(() => convertJsonToCsv('"just a string"'), /requires an array/);
});

test("3. CSV to JSON Converter", () => {
  assert.equal(convertCsvToJson(""), "[]");

  const csvInput = `name,age,city,notes
"Johnson, Alice",28,Seattle,"Loves ""TypeScript"" & coding"
Bob,32,Austin,""`;

  const json = convertCsvToJson(csvInput);
  const parsed = JSON.parse(json);

  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].name, "Johnson, Alice");
  assert.equal(parsed[0].age, 28); // Type coercion to number
  assert.equal(parsed[0].notes, 'Loves "TypeScript" & coding');
  assert.equal(parsed[1].name, "Bob");
  assert.equal(parsed[1].age, 32);
  assert.equal(parsed[1].notes, "");
});

test("4. Add Line Numbers", () => {
  assert.equal(addLineNumbers(""), "");

  const code = "const a = 1;\nconst b = 2;\nconst c = a + b;";
  const numbered = addLineNumbers(code, { startNumber: 1, delimiter: ". " });
  const lines = numbered.split("\n");

  assert.equal(lines[0], "1. const a = 1;");
  assert.equal(lines[1], "2. const b = 2;");
  assert.equal(lines[2], "3. const c = a + b;");

  // Custom start number and zero padding
  const padded = addLineNumbers("line one\nline two", { startNumber: 9, padWithZeros: true, delimiter: " | " });
  assert.ok(padded.includes("09 | line one"));
  assert.ok(padded.includes("10 | line two"));
});

test("5. Markdown to HTML Converter", () => {
  assert.equal(convertMarkdownToHtml(""), "");

  const md = `# AI Text Utility Tools

A **bold statement** and *italic words* with \`inline code\`.

> Quoted wisdom from developers

- Fast execution
- 100% private

[Visit Docs](https://example.com)

\`\`\`typescript
const answer = 42;
\`\`\``;

  const html = convertMarkdownToHtml(md);

  assert.ok(html.includes("<h1>AI Text Utility Tools</h1>"));
  assert.ok(html.includes("<strong>bold statement</strong>"));
  assert.ok(html.includes("<em>italic words</em>"));
  assert.ok(html.includes("<code>inline code</code>"));
  assert.ok(html.includes("<blockquote><p>Quoted wisdom from developers</p></blockquote>"));
  assert.ok(html.includes("<ul>\n  <li>Fast execution</li>\n  <li>100% private</li>\n</ul>"));
  assert.ok(html.includes('<a href="https://example.com" target="_blank" rel="noopener noreferrer">Visit Docs</a>'));
  assert.ok(html.includes('<pre><code class="language-typescript">const answer = 42;</code></pre>'));

  // XSS Security checks
  const malicious = '<script>alert("XSS")</script>[Click](javascript:alert(1))';
  const sanitized = convertMarkdownToHtml(malicious);
  assert.ok(!sanitized.includes("<script>"));
  assert.ok(!sanitized.includes("href=\"javascript:"));
});

test("6. HTML Minifier", () => {
  assert.equal(minifyHtml("").minified, "");

  const rawHtml = `
  <!DOCTYPE html>
  <html>
    <!-- Header Comment -->
    <head>
      <style>
        body { margin: 0; padding: 10px; }
      </style>
    </head>
    <body>
      <div   class="container"    id="main"   >
        <h1>   Welcome to AI Text Utility   </h1>
        <p>Fast client-side tools.</p>
      </div>
      <script>
        const msg = "  preserve   spaces  ";
      </script>
    </body>
  </html>
  `;

  const result = minifyHtml(rawHtml);

  // Comment stripped
  assert.ok(!result.minified.includes("<!-- Header Comment -->"));
  // Style preserved
  assert.ok(result.minified.includes("body { margin: 0; padding: 10px; }"));
  // Script preserved
  assert.ok(result.minified.includes('const msg = "  preserve   spaces  ";'));
  // Tags compacted
  assert.ok(result.minified.includes('<div class="container" id="main">'));
  // Size reduction achieved
  assert.ok(result.savedPercentage > 20);
});
