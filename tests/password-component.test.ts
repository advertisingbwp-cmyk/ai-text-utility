import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

test("password preview, clipboard and download share one result without extra generation", async () => {
  const dom = new JSDOM("<!doctype html><div id='root'></div>", { url: "https://example.test" });
  const saved = new Map<string, PropertyDescriptor | undefined>();
  const install = (name: string, value: unknown) => {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  };
  install("window", dom.window);
  install("self", dom.window);
  install("document", dom.window.document);
  install("navigator", dom.window.navigator);
  install("localStorage", dom.window.localStorage);
  install("IS_REACT_ACT_ENVIRONMENT", true);
  let calls = 0;
  install("crypto", { getRandomValues: (array: Uint32Array) => {
    array[0] = ++calls;
    return array;
  } });
  const { default: React, act } = await import("react");
  const { createRoot, hydrateRoot } = await import("react-dom/client");
  const { renderToString } = await import("react-dom/server");
  const { GeneratorTool } = await import("../components/tools/GeneratorTool.tsx");
  const { getToolBySlug } = await import("../data/toolsRegistry.ts");
  const tool = getToolBySlug("password-generator");
  const element = React.createElement(GeneratorTool, { tool });
  const container = document.getElementById("root")!;
  let copied = "";
  Object.defineProperty(window, "isSecureContext", { value: true });
  Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { copied = text; } } });
  let downloaded: Blob | undefined;
  let filename = "";
  const oldCreate = URL.createObjectURL;
  const oldRevoke = URL.revokeObjectURL;
  URL.createObjectURL = (blob: Blob) => { downloaded = blob; return "blob:test"; };
  URL.revokeObjectURL = () => {};
  dom.window.HTMLAnchorElement.prototype.click = function () { filename = this.download; };
  const visible = () => Array.from(container.querySelectorAll("span.select-all")).map(node => node.textContent!);
  const click = async (button: Element) => { await act(async () => (button as HTMLButtonElement).click()); };
  const copies = () => container.querySelectorAll('button[aria-label="Copy"],button[aria-label="Copied to clipboard"]');
  let root = createRoot(container);
  try {
    await act(async () => root.render(element));
    const before = calls;
    const preview = visible().join("\n");
    await click(copies()[0]);
    await click(container.querySelector('[aria-label="Download generated output"]')!);
    const download = await downloaded!.text();
    console.log("Password result evidence:", JSON.stringify({ preview, copied, download, callsBeforeActions: before, callsAfterActions: calls }));
    assert.equal(copied, preview);
    assert.equal(download, preview);
    assert.equal(filename, "generated-passwords.txt");
    assert.equal(calls, before);
    assert.equal(before, 31, "one generation on mount");
    await click(copies()[1]);
    assert.equal(copied, visible()[0]);
    assert.equal(calls, before);
    await act(async () => root.render(React.createElement(GeneratorTool, { tool: { ...tool } })));
    assert.equal(calls, before, "parent rerender does not regenerate");
    for (const label of ["Generate New", "Regenerate"]) {
      const oldCalls = calls;
      await click(Array.from(container.querySelectorAll("button")).find(b => b.textContent === label)!);
      assert.equal(calls - oldCalls, 31);
    }
    const setNumber = async (index: number, value: string) => {
      const input = container.querySelectorAll('input[type="number"]')[index];
      await act(async () => {
        Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value")!.set!.call(input, value);
        input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
      });
    };
    let optionCalls = calls;
    await setNumber(1, "3");
    assert.equal(calls - optionCalls, 3 * 31, "count change generates one batch");
    assert.equal(visible().length, 3);
    optionCalls = calls;
    await setNumber(0, "24");
    assert.equal(calls - optionCalls, 3 * 47, "length change generates one batch");
    assert.ok(visible().every(password => password.length === 24));
    // Toggle every option, returning numbers to enabled for the final result.
    for (const index of [0, 1, 2, 2, 3, 4]) {
      optionCalls = calls;
      await click(container.querySelectorAll('input[type="checkbox"]')[index]);
      assert.equal(calls - optionCalls, 3 * 47, "checkbox change generates one batch");
    }
    assert.ok(visible().every(password => /^[2-9]{24}$/.test(password)));
    assert.match(container.textContent!, /~72 bits of entropy/);
    assert.match(container.textContent!, /medium/);
    const multiCalls = calls;
    await click(copies()[0]);
    await click(container.querySelector('[aria-label="Download generated output"]')!);
    assert.equal(copied, visible().join("\n"));
    assert.equal(await downloaded!.text(), copied);
    for (let i = 0; i < 3; i++) {
      await click(copies()[i + 1]);
      assert.equal(copied, visible()[i]);
    }
    assert.equal(calls, multiCalls);
    await act(async () => root.unmount());
    const beforeSSR = calls;
    const html = renderToString(element);
    assert.equal(calls, beforeSSR, "SSR must not consume randomness");
    assert.equal(html, renderToString(element));
    assert.match(html, /Generate a password to begin/);
    container.innerHTML = html;
    const hydrationErrors: unknown[] = [];
    await act(async () => {
      root = hydrateRoot(container, React.createElement(React.StrictMode, null, element), {
        onRecoverableError: (error) => hydrationErrors.push(error),
      });
    });
    assert.deepEqual(hydrationErrors, []);
    assert.equal(calls - beforeSSR, 31, "StrictMode initializes once");
    assert.equal(visible().length, 1);
    Object.defineProperty(globalThis, "crypto", { configurable: true, value: undefined });
    await click(Array.from(container.querySelectorAll("button")).find(b => b.textContent === "Generate New")!);
    assert.match(container.querySelector('[role="alert"]')!.textContent!, /Secure password generation is unavailable/);
    assert.deepEqual(visible(), []);
    assert.equal((copies()[0] as HTMLButtonElement).disabled, true);
  } finally {
    await act(async () => root.unmount());
    URL.createObjectURL = oldCreate;
    URL.revokeObjectURL = oldRevoke;
    // Let CopyButton feedback timers settle before restoring the DOM globals.
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 2100)); });
    dom.window.close();
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  }
});
