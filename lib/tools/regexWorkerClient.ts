import { REGEX_MAX_INPUT, REGEX_MAX_PATTERN, REGEX_MAX_MATCHES } from "./regexTester";
import type { RegexTestResult } from "./regexTester";

export const REGEX_TIMEOUT_MS = 1000;
export interface RegexTask { input: string; pattern: string; flags: string; maxMatches?: number }
export type RegexWorker = Pick<Worker, "onmessage" | "onerror" | "onmessageerror" | "postMessage" | "terminate">;

export class RegexTaskRunner {
  private active: { finish: (result: RegexTestResult | null) => void } | null = null;
  constructor(
    private createWorker: () => RegexWorker = () => new Worker(new URL("./regex.worker.ts", import.meta.url), { type: "module" }),
    private timeoutMs = REGEX_TIMEOUT_MS,
  ) {}

  cancel() { this.active?.finish(null); }

  run(task: RegexTask): Promise<RegexTestResult | null> {
    this.cancel();
    const started = performance.now();
    const error = (message: string): RegexTestResult => ({
      isValid: false, pattern: task.pattern, flags: task.flags, matches: [], matchCount: 0,
      error: message, durationMs: performance.now() - started,
    });
    if (task.input.length > REGEX_MAX_INPUT || task.pattern.length > REGEX_MAX_PATTERN) {
      return Promise.resolve(error("Use at most 1,000,000 input characters and 10,000 pattern characters."));
    }
    if (!task.pattern) return Promise.resolve({ isValid: true, pattern: "", flags: task.flags, matches: [], matchCount: 0, durationMs: 0 });
    return new Promise(resolve => {
      let worker: RegexWorker;
      try { worker = this.createWorker(); }
      catch { resolve(error("Regex worker could not start. Reload or use a browser with Web Worker support.")); return; }
      const current = { finish: (result: RegexTestResult | null) => {
        if (this.active !== current) return;
        this.active = null;
        clearTimeout(timer);
        worker.onmessage = worker.onerror = worker.onmessageerror = null;
        worker.terminate();
        resolve(result);
      } };
      this.active = current;
      const timer = setTimeout(() => current.finish(error(`Regex timed out after ${this.timeoutMs} ms. Simplify the pattern or shorten the input.`)), this.timeoutMs);
      worker.onmessage = event => current.finish(event.data);
      worker.onerror = event => {
        event.preventDefault();
        current.finish(error("Regex worker failed. Reload and try a simpler pattern."));
      };
      worker.onmessageerror = () => current.finish(error("Regex worker returned an unreadable result. Try again."));
      try { worker.postMessage({ ...task, maxMatches: task.maxMatches ?? REGEX_MAX_MATCHES }); }
      catch { current.finish(error("Regex task could not be sent to the worker. Reload and try again.")); }
    });
  }
}
