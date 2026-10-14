import test from "node:test";
import assert from "node:assert/strict";
import { compareTexts, formatDiffReport, type DiffOptions } from "../../lib/tools/diffChecker.ts";
const options: DiffOptions = { mode: "word", ignoreCase: false, ignoreSpaces: false };
test("diff preserves both inputs across replacements, Unicode, whitespace and empty sides", () => {
  for (const [left, right] of [["brown fox", "red fox"], ["", "hello"], ["bye", ""], ["a a b", "a b a"], ["سلام 👋\n", "سلام 🌍\n"], [" a\n\n", "a\n"], ["<script>x</script>", "<b>x</b>"]]) {
    for (const mode of ["word", "line"] as const) {
      const parts = compareTexts(left, right, { ...options, mode });
      assert.equal(parts.filter(p => p.kind !== "added").map(p => p.text).join(""), left);
      assert.equal(parts.filter(p => p.kind !== "removed").map(p => p.text).join(""), right);
    }
  }
  assert.deepEqual(compareTexts("brown", "red", options), [{ kind: "removed", text: "brown" }, { kind: "added", text: "red" }]);
});
test("diff ignores only requested differences and normalizes line endings", () => {
  assert.deepEqual(compareTexts("HELLO  world\r\n", "hello world\n", { ...options, ignoreCase: true, ignoreSpaces: true }), [{ kind: "equal", text: "hello world\n" }]);
  assert.ok(compareTexts("A", "a", options).some(p => p.kind !== "equal"));
  assert.ok(compareTexts("a\nb", "a b", { ...options, ignoreSpaces: true }).some(p => p.kind !== "equal"));
  assert.deepEqual(compareTexts("", "", options), []);
});
test("diff bounds work before allocating a comparison matrix", () => {
  assert.throws(() => compareTexts("x".repeat(30001), "", options), /30,000/);
  assert.throws(() => compareTexts("x ".repeat(1100), "y", options), /2,000/);
  assert.ok(compareTexts("x ".repeat(1100), "y", { ...options, mode: "line" }).length);
});
test("report labels changes and comparison options", () => {
  const report = formatDiffReport(compareTexts("before", "after", options), options);
  assert.match(report, /\[REMOVED\]\nbefore/);
  assert.match(report, /\[ADDED\]\nafter/);
  assert.match(report, /ignore case: false/);
});
