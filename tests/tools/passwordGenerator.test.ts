import test from "node:test";
import assert from "node:assert/strict";
import { generatePasswords } from "../../lib/tools/passwordGenerator.ts";

test("passwords respect length, count and every enabled character class", () => {
  for (const length of [4, 16, 64, 128]) {
    const result = generatePasswords({ length, count: 10 });
    assert.equal(result.passwords.length, 10);
    for (const password of result.passwords) {
      assert.equal(password.length, length);
      for (const pattern of [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/]) {
        assert.match(password, pattern);
      }
    }
  }
});

test("passwords exclude disabled classes and ambiguous characters", () => {
  for (const selected of ["uppercase", "lowercase", "numbers", "symbols"] as const) {
    const options = { uppercase: false, lowercase: false, numbers: false, symbols: false,
      excludeAmbiguous: true, length: 64, count: 5, [selected]: true };
    const patterns = { uppercase: /^[A-Z]+$/, lowercase: /^[a-z]+$/, numbers: /^[0-9]+$/, symbols: /^[^A-Za-z0-9]+$/ };
    for (const password of generatePasswords(options).passwords) {
      assert.match(password, patterns[selected]);
      assert.doesNotMatch(password, /[il1Lo0OI]/);
    }
  }
});

test("password metadata describes the selected pool and length", () => {
  const result = generatePasswords({ length: 24, uppercase: false, lowercase: false,
    numbers: true, symbols: false, excludeAmbiguous: true, count: 3 });
  assert.equal(result.entropyBits, 72);
  assert.equal(result.strength, "medium");
  assert.equal(result.passwords.length, 3);
});

test("password generation fails clearly without Web Crypto and never uses Math.random", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "crypto")!;
  const random = Math.random;
  try {
    Object.defineProperty(globalThis, "crypto", { configurable: true, value: undefined });
    Math.random = () => { throw new Error("insecure random called"); };
    assert.throws(() => generatePasswords(), /Secure password generation is unavailable/);
  } finally {
    Object.defineProperty(globalThis, "crypto", descriptor);
    Math.random = random;
  }
});
