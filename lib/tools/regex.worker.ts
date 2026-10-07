import { testRegex } from "./regexTester.ts";
import type { RegexTask } from "./regexWorkerClient";

const scope = globalThis as unknown as {
  onmessage: (event: { data: RegexTask }) => void;
  postMessage: (value: unknown) => void;
};

scope.onmessage = ({ data }) => {
  const started = performance.now();
  try {
    const result = testRegex(data.input, data.pattern, data.flags, data.maxMatches);
    scope.postMessage({ ...result, durationMs: performance.now() - started });
  } catch {
    scope.postMessage({ isValid: false, pattern: data.pattern, flags: data.flags,
      matches: [], matchCount: 0, error: "Regex evaluation failed. Simplify the pattern and try again.",
      durationMs: performance.now() - started });
  }
};
