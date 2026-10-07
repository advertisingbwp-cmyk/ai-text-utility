import test from "node:test";
import assert from "node:assert/strict";
import { Worker } from "node:worker_threads";
import { RegexTaskRunner, REGEX_TIMEOUT_MS } from "../lib/tools/regexWorkerClient.ts";
import { testRegex, DEFAULT_REGEX_PATTERN } from "../lib/tools/regexTester.ts";

test("regex semantics: normal, no match, syntax, flags, captures and sample", () => {
  const result = testRegex("user_id_1024 user_id_22", DEFAULT_REGEX_PATTERN, "g");
  assert.equal(result.matchCount, 2);
  assert.deepEqual([result.matches[0].start, result.matches[0].end, result.matches[0].fullMatch], [0, 12, "user_id_1024"]);
  assert.equal(result.matches[0].groups[0].value, "1024");
  assert.equal(testRegex("aaa", "a", "").matchCount, 1);
  assert.equal(testRegex("aaa", "a", "g").matchCount, 3);
  assert.equal(testRegex("aaa", "z").matchCount, 0);
  assert.equal(testRegex("a", "[").isValid, false);
  assert.equal(testRegex("a", "a", "zz").isValid, false);
  assert.equal(testRegex("a", "a", "gg").isValid, false);
  assert.equal(testRegex("Aa", "a", "gi").matchCount, 2);
  assert.equal(testRegex("a\na", "^a", "gm").matchCount, 2);
  assert.equal(testRegex("a\nb", "a.b", "s").matchCount, 1);
  assert.equal(testRegex("aa aa", "a", "gy").matchCount, 2);
  assert.equal(testRegex("ba", "a", "y").matchCount, 0);
  assert.equal(testRegex("", "^$", "g").matchCount, 1);
  assert.equal(testRegex("a", "", "g").matchCount, 0);
});

test("zero-length matches advance by Unicode code point and result caps are explicit", () => {
  assert.deepEqual(testRegex("😀a", "(?:)", "gu").matches.map(m => m.start), [0, 2, 3]);
  assert.equal(testRegex("aaaa", "(?=a)", "g").matchCount, 4);
  const capped = testRegex("a".repeat(10000), "a", "g");
  assert.equal(capped.matchCount, 500);
  assert.equal(capped.truncated, true);
  assert.equal(testRegex("aaaa", "a", "g", 2).matchCount, 2);
  assert.equal(testRegex("a".repeat(1_000_001), "a").isValid, false);
  const largeCaptures = testRegex("a".repeat(10000), "(?=(a+))", "g");
  assert.equal(largeCaptures.truncated, true);
  assert.ok(largeCaptures.matchCount < 500, "capture payload size is bounded before transfer/render");
});

class FakeWorker {
  onmessage: any = null;
  onerror: any = null;
  onmessageerror: any = null;
  terminated = 0;
  task: any;
  postMessage(task: any) { this.task = task; }
  terminate() { this.terminated++; }
}

test("new tasks cancel old work and late results cannot replace current output", async () => {
  const workers: FakeWorker[] = [];
  const runner = new RegexTaskRunner(() => {
    const worker = new FakeWorker(); workers.push(worker); return worker;
  });
  const old = runner.run({ input: "aaa", pattern: "old", flags: "g" });
  const lateMessage = workers[0].onmessage;
  const latest = runner.run({ input: "aaa", pattern: "a", flags: "" });
  assert.equal(await old, null);
  assert.equal(workers[0].terminated, 1);
  lateMessage({ data: testRegex("aaa", "old") });
  workers[1].onmessage({ data: testRegex("aaa", "a", "") });
  assert.equal((await latest)!.matchCount, 1);
  assert.equal(workers[1].terminated, 1);
  const cancelled = runner.run({ input: "a", pattern: "a", flags: "" });
  runner.cancel();
  assert.equal(await cancelled, null);
  assert.equal(workers[2].terminated, 1);
});

test("worker initialization, runtime, transfer failures and empty pattern settle safely", async () => {
  const unavailable = new RegexTaskRunner(() => { throw new Error("private stack"); });
  assert.match((await unavailable.run({ input: "a", pattern: "a", flags: "" }))!.error!, /could not start/);
  assert.equal((await unavailable.run({ input: "a", pattern: "", flags: "" }))!.isValid, true);
  for (const kind of ["onerror", "onmessageerror", "postMessage"] as const) {
    const worker = new FakeWorker();
    if (kind === "postMessage") worker.postMessage = () => { throw new Error("private stack"); };
    const runner = new RegexTaskRunner(() => worker);
    const task = runner.run({ input: "a", pattern: "a", flags: "" });
    if (kind !== "postMessage") worker[kind]({ preventDefault() {} });
    const result = await task;
    assert.equal(result!.isValid, false);
    assert.doesNotMatch(result!.error!, /private stack/);
    assert.equal(worker.terminated, 1);
  }
});

test("actual worker terminates catastrophic regex at deadline while main thread ticks", async () => {
  const workers: Worker[] = [];
  const terminations: Promise<number>[] = [];
  const runner = new RegexTaskRunner(() => {
    const nodeWorker = new Worker(new URL("./fixtures/regex-worker.mjs", import.meta.url), { execArgv: ["--experimental-strip-types"] });
    workers.push(nodeWorker);
    const port = new FakeWorker();
    port.postMessage = task => nodeWorker.postMessage(task);
    port.terminate = () => { terminations.push(nodeWorker.terminate()); };
    nodeWorker.on("message", data => port.onmessage?.({ data }));
    nodeWorker.on("error", () => port.onerror?.({ preventDefault() {} }));
    return port;
  });
  let ticks = 0;
  const heartbeat = setInterval(() => ticks++, 20);
  try {
    const started = performance.now();
    const result = await runner.run({ input: "a".repeat(27) + "!", pattern: "^(a+)+$", flags: "g" });
    const elapsed = performance.now() - started;
    console.log("Catastrophic worker evidence:", JSON.stringify({ elapsedMs: elapsed, heartbeatTicks: ticks, timeoutMs: REGEX_TIMEOUT_MS }));
    assert.match(result!.error!, /timed out after 1000 ms/);
    assert.ok(elapsed < 3500, "timeout must settle within a bounded scheduling tolerance");
    assert.ok(ticks >= 10, "main event loop stays responsive");
    assert.equal(terminations.length, 1);
    await Promise.all(terminations);
    const next = await runner.run({ input: "user_id_42", pattern: DEFAULT_REGEX_PATTERN, flags: "g" });
    assert.equal(next!.matches[0].groups[0].value, "42");
    assert.equal(terminations.length, 2);
    await Promise.all(terminations);
  } finally {
    clearInterval(heartbeat);
    runner.cancel();
    await Promise.all(workers.map(worker => worker.terminate()));
  }
});
