// Node transport adapter for the actual browser worker entry, not a second regex engine.
import { parentPort } from "node:worker_threads";
globalThis.postMessage = data => parentPort.postMessage(data);
await import("../../lib/tools/regex.worker.ts");
parentPort.on("message", data => globalThis.onmessage({ data }));
