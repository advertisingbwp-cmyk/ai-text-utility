import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { JSDOM } from "jsdom";
import { AdsterraResponsiveBanner, AdsterraNativeBanner, AdsterraSmartLink } from "../components/ads/index.ts";
import { ToolAdvertisements } from "../components/ads/ToolAdvertisements.tsx";
import { getToolAdPolicy } from "../lib/adPolicy.ts";
import { getToolBySlug, TOOLS_REGISTRY } from "../data/toolsRegistry.ts";
import { AdsterraFrame, bannerDocument, nativeDocument } from "../components/ads/AdsterraFrame.tsx";
import { AD_FORMAT_ENABLED } from "../lib/adPolicy.ts";

function inspectAds(element: React.ReactNode) {
  const dom = new JSDOM(renderToString(element));
  const frames = [...dom.window.document.querySelectorAll("iframe")];
  assert.equal(dom.window.document.querySelectorAll("script").length, 0, "no parent provider scripts");
  for (const frame of frames) {
    assert.equal(frame.getAttribute("sandbox"), "allow-scripts allow-popups");
    assert.equal(frame.getAttribute("referrerpolicy"), "no-referrer");
    assert.ok(Number(frame.getAttribute("height")) > 0);
    assert.ok(frame.srcdoc.includes("invoke.js"));
    assert.doesNotMatch(frame.getAttribute("sandbox")!, /allow-same-origin|allow-top-navigation|allow-popups-to-escape-sandbox/);
  }
  const result = frames.map(frame => ({ title: frame.title, width: frame.width, height: frame.height, srcdoc: frame.srcdoc }));
  dom.window.close();
  return result;
}

test("banner IDs and dimensions are preserved; scripts exist only inside sandboxed srcDoc", () => {
  const frames = inspectAds(React.createElement(React.Fragment, null,
    ...[[320, 50, "87759585f06f50f90802d1b4cea40a5d"], [300, 250, "dc60669d213c871b2e2024882d61f041"],
      [728, 90, "3b17baca8ac1f38a721ac113ce53e459"]].map(([width, height, key]) =>
      React.createElement(AdsterraFrame, { key, title: "Test banner", width, height: Number(height),
        document: bannerDocument(String(key), Number(width), Number(height)) }))));
  assert.deepEqual(frames.map(f => [f.width, f.height]), [["320", "50"], ["300", "250"], ["728", "90"]]);
  for (const [index, key] of ["87759585f06f50f90802d1b4cea40a5d", "dc60669d213c871b2e2024882d61f041", "3b17baca8ac1f38a721ac113ce53e459"].entries()) {
    assert.ok(frames[index].srcdoc.includes(key));
  }
});

test("Native provider is inside an isolated fixed-height frame, never a main-DOM script", () => {
  const [frame] = inspectAds(React.createElement(AdsterraFrame, { title: "Native", width: "100%", height: 160, document: nativeDocument }));
  assert.equal(frame.height, "160");
  assert.ok(frame.srcdoc.includes("container-8aca604b8b2ab0a3b2106d4958e02b1d"));
  assert.ok(frame.srcdoc.includes("pl31247526.profitableratecpmnetwork.com"));
});

test("central policy limits sensitive pages to isolated banners and keeps ordinary placements", () => {
  for (const tool of TOOLS_REGISTRY) {
    const policy = getToolAdPolicy(tool);
    const frames = inspectAds(React.createElement(ToolAdvertisements, { tool }));
    assert.equal(frames.length, 0, "incompatible provider formats stay disabled on every tool");
    assert.equal(policy.isolatedBanner, true, "policy permits compatible isolated banners");
    assert.equal(policy.isolatedNative, !policy.sensitive);
    if (tool.requiresAI || ["password-generator", "jwt-decoder", "hash-generator"].includes(tool.slug)) {
      assert.equal(policy.sensitive, true);
      assert.ok(frames.every(f => f.title !== "Sponsored Native Ad"));
    }
  }
  assert.equal(getToolAdPolicy(getToolBySlug("remove-extra-spaces")!).sensitive, false);
  for (const slug of ["base64", "query-string-parser", "extract-emails-urls", "json-formatter"]) {
    assert.equal(getToolAdPolicy(getToolBySlug(slug)!).sensitive, true);
  }
  const html = renderToString(React.createElement(ToolAdvertisements, { tool: getToolBySlug("jwt-decoder")! }));
  assert.doesNotMatch(html, /Sponsored Content|Sponsored Native Ad/);
  assert.match(html, /aria-hidden="true"/);
});

test("incompatible embedded formats are disabled without fake ad labels; slots stay reserved", () => {
  assert.deepEqual(AD_FORMAT_ENABLED, { banner: false, native: false });
  const html = renderToString(React.createElement(React.Fragment, null,
    React.createElement(AdsterraResponsiveBanner), React.createElement(AdsterraNativeBanner)));
  const dom = new JSDOM(html);
  assert.equal(dom.window.document.querySelectorAll("iframe,script").length, 0);
  assert.equal(dom.window.document.body.textContent, "");
  assert.equal(dom.window.document.querySelectorAll('[aria-hidden="true"]').length, 4);
  assert.match(html, /height:70px/);
  assert.match(html, /height:270px/);
  assert.match(html, /height:110px/);
  dom.window.close();
});

test("all SmartLink variants preserve outbound protections and sponsored disclosure", () => {
  for (const variant of ["button", "badge", "link"] as const) {
    const dom = new JSDOM(renderToString(React.createElement(AdsterraSmartLink, { variant })));
    const link = dom.window.document.querySelector("a")!;
    assert.equal(link.target, "_blank");
    assert.equal(link.rel, "noopener noreferrer sponsored");
    assert.match(link.href, /key=3c4dfd2355641f0419fce1f81a541b61/);
    assert.match(link.textContent!, /Ad/);
    assert.equal(dom.window.document.querySelectorAll("script").length, 0);
    dom.window.close();
  }
});

test("ad SSR hydrates without parent scripts; frame errors leave parent workspace usable", async () => {
  const dom = new JSDOM("<!doctype html><div id='root'></div>", { url: "https://example.test" });
  const saved = new Map<string, PropertyDescriptor | undefined>();
  for (const [name, value] of Object.entries({ window: dom.window, document: dom.window.document,
    navigator: dom.window.navigator, IS_REACT_ACT_ENVIRONMENT: true })) {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, value });
  }
  const { hydrateRoot } = await import("react-dom/client");
  const { act } = React;
  let clicks = 0;
  const element = React.createElement("main", null,
    React.createElement("textarea", { defaultValue: "PRIVATE_TEST_INPUT" }),
    React.createElement("button", { onClick: () => clicks++ }, "Run tool"),
    React.createElement(AdsterraFrame, { title: "Isolated test ad", width: 300, height: 250,
      document: bannerDocument("dc60669d213c871b2e2024882d61f041", 300, 250) }));
  const container = document.getElementById("root")!;
  container.innerHTML = renderToString(element);
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    await act(async () => { root = hydrateRoot(container, element, { onRecoverableError: e => errors.push(e) }); });
    assert.equal(container.querySelectorAll("script").length, 0);
    for (const frame of container.querySelectorAll("iframe")) {
      assert.doesNotMatch(frame.srcdoc, /PRIVATE_TEST_INPUT/);
      const height = frame.getAttribute("height");
      await act(async () => { frame.dispatchEvent(new dom.window.Event("error")); });
      assert.equal(frame.getAttribute("height"), height);
    }
    await act(async () => { container.querySelector("button")!.click(); });
    assert.equal(clicks, 1);
    assert.equal(container.querySelector("textarea")!.value, "PRIVATE_TEST_INPUT");
    assert.deepEqual(errors, []);
    assert.equal(container.querySelectorAll("script").length, 0);
  } finally {
    if (root) await act(async () => root!.unmount());
    dom.window.close();
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  }
});
