import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";
import { validateAdFrameOrigin } from "../lib/adFrameOrigin.mjs";
import { AD_SANDBOX, AD_UNITS, AD_LOAD_TIMEOUT_MS, bannerForWidth } from "../lib/adFrames.ts";
import { getToolAdPolicy } from "../lib/adPolicy.ts";
import { TOOLS_REGISTRY, getToolBySlug } from "../data/toolsRegistry.ts";
import { AdsterraSmartLink } from "../components/ads/AdsterraSmartLink.tsx";

process.env.NEXT_PUBLIC_AD_FRAME_ORIGIN = "https://ads.example.test";
process.env.NEXT_PUBLIC_SITE_URL = "https://app.example.test";
const { AdsterraFrame } = await import("../components/ads/AdsterraFrame.tsx");
const { AdsterraResponsiveBanner } = await import("../components/ads/AdsterraResponsiveBanner.tsx");
const read = (path: string) => readFileSync(new URL("../"+path, import.meta.url), "utf8");

test("ad origin accepts only separate bare origins and explicit loopback testing", () => {
  assert.equal(validateAdFrameOrigin("https://ads.example.test", "https://app.example.test"), "https://ads.example.test");
  for (const value of [undefined, "", "/ad-frame", "https://app.example.test", "https://ads.example.test/path",
    "https://ads.example.test?text=private", "https://ads.example.test/#fragment", "https://user:pass@ads.example.test", "http://ads.example.test", "javascript:alert(1)"]) {
    assert.equal(validateAdFrameOrigin(value, "https://app.example.test"), null);
  }
  assert.equal(validateAdFrameOrigin("http://127.0.0.1:3003", "http://127.0.0.1:3002"), "http://127.0.0.1:3003");
  assert.equal(validateAdFrameOrigin("http://127.0.0.1:3003", "https://app.example.test"), null);
});

test("sandbox permits only scripts, ad-origin state and sandboxed popups", () => {
  assert.equal(AD_SANDBOX, "allow-scripts allow-same-origin allow-popups");
  assert.doesNotMatch(AD_SANDBOX, /allow-top-navigation|allow-forms|allow-modals|allow-downloads|allow-popups-to-escape/);
});

test("responsive format selection preserves exact mobile/tablet/desktop dimensions", () => {
  for (const [width, format] of [[320,"banner-320x50"],[639,"banner-320x50"],[640,"banner-300x250"],[767,"banner-300x250"],[768,"banner-728x90"],[1440,"banner-728x90"]] as const)
    assert.equal(bannerForWidth(width), format);
  assert.deepEqual([AD_UNITS["banner-320x50"].height,AD_UNITS["banner-300x250"].height,AD_UNITS["banner-728x90"].height],[50,250,90]);
});

test("sensitive pages retain banners and exclude Native without dead placeholders", () => {
  for (const tool of TOOLS_REGISTRY) {
    const policy=getToolAdPolicy(tool);
    assert.equal(policy.isolatedBanner,true);
    assert.equal(policy.isolatedNative,!policy.sensitive);
    if(tool.requiresAI||["password-generator","jwt-decoder","hash-generator","query-string-parser"].includes(tool.slug)) assert.equal(policy.sensitive,true);
  }
  assert.equal(getToolAdPolicy(getToolBySlug("remove-extra-spaces")!).isolatedNative,true);
  assert.doesNotMatch(read("components/ads/ToolAdvertisements.tsx"), /224|aria-hidden/);
});

test("provider scripts and IDs exist only in dedicated host documents", () => {
  const keys={"banner-320x50":"87759585f06f50f90802d1b4cea40a5d","banner-300x250":"dc60669d213c871b2e2024882d61f041","banner-728x90":"3b17baca8ac1f38a721ac113ce53e459"};
  for(const [format,key] of Object.entries(keys)){
    const html=read("ad-host/public/"+format+".html");
    assert.ok(html.includes("https://www.highrevenueformat.com/"+key+"/invoke.js"));
    assert.ok(html.includes('key:"'+key+'"'));
  }
  const native=read("ad-host/public/native.html");
  assert.match(native,/data-cfasync="false"/);
  assert.ok(native.includes("https://pl31247526.profitableratecpmnetwork.com/8aca604b8b2ab0a3b2106d4958e02b1d/invoke.js"));
  assert.ok(native.includes('id="container-8aca604b8b2ab0a3b2106d4958e02b1d"'));
  for(const name of ["AdsterraFrame","AdsterraBanner320x50","AdsterraBanner300x250","AdsterraBanner728x90","AdsterraNativeBanner","AdsterraResponsiveBanner"])
    assert.doesNotMatch(read("components/ads/"+name+".tsx"),/invoke\.js|srcDoc=|contentDocument|document\.write/);
});

test("main CSP restricts scripts to self and frames to the configured ad origin", async () => {
  const { default: config }=await import("../next.config.mjs");
  const headers=await config.headers();
  const csp=headers[0].headers.find((h:any)=>h.key==="Content-Security-Policy")!.value;
  assert.match(csp,/frame-src https:\/\/ads\.example\.test;/);
  assert.match(csp,/script-src 'self' 'unsafe-inline' 'unsafe-eval';/);
  assert.match(csp,/worker-src 'self' blob:;/);
});

test("privacy copy describes isolated ads without anonymous or globally disabled claims", () => {
  for(const file of ["app/privacy/page.tsx","components/HomeSeoContent.tsx","components/ToolSeoContent.tsx"]){
    const source=read(file);
    assert.match(source,/cross-origin/);
    assert.doesNotMatch(source,/ads are currently disabled|advertising is currently disabled|advertising is anonymous/);
  }
});

test("SmartLink keeps exact destination and outbound disclosure protections", () => {
  for(const variant of ["button","badge","link"] as const){
    const dom=new JSDOM(renderToString(React.createElement(AdsterraSmartLink,{variant})));
    const a=dom.window.document.querySelector("a")!;
    assert.equal(a.href,"https://www.profitableratecpmnetwork.com/wpnm4nd8?key=3c4dfd2355641f0419fce1f81a541b61");
    assert.equal(a.target,"_blank");assert.equal(a.rel,"noopener noreferrer sponsored");
    assert.match(a.textContent!,/Ad/);dom.window.close();
  }
});

test("controlled browser fixture probes all five parent boundaries without provider requests", () => {
  const child=read("tests/fixtures/ad-isolation-child.html");
  for(const name of ["document","input","textarea","localStorage","sessionStorage"]) assert.ok(child.includes(name));
  assert.doesNotMatch(child,/TEST_SECRET|TEST_PRIVATE|highrevenueformat|profitableratecpmnetwork/);
  assert.match(read("tests/fixtures/ad-isolation-server.mjs"),/connect-src 'none'/);
  // Actual SecurityError assertions run in the real-browser fixture, not jsdom.
});

test("ad host deployment is standalone and never included in the main public directory", () => {
  const config=JSON.parse(read("ad-host/vercel.json"));
  assert.equal(config.framework,null);assert.equal(config.buildCommand,"node build.mjs");
  assert.match(read("ad-host/build.mjs"),/frame-ancestors/);
  assert.doesNotMatch(read("ad-host/public/status.js"),/parent\.document|parent\.localStorage|parent\.sessionStorage/);
});

test("cross-origin frames hydrate, authenticate messages, collapse failures, and clean up", async t => {
  const dom=new JSDOM("<!doctype html><div id='root'></div>",{url:"https://app.example.test"});
  const saved=new Map<string,PropertyDescriptor|undefined>();
  for(const [name,value] of Object.entries({window:dom.window,document:dom.window.document,navigator:dom.window.navigator,IS_REACT_ACT_ENVIRONMENT:true})){
    saved.set(name,Object.getOwnPropertyDescriptor(globalThis,name));Object.defineProperty(globalThis,name,{configurable:true,value});
  }
  const {hydrateRoot}=await import("react-dom/client");
  const {act}=React;
  const container=document.getElementById("root")!;
  let clicks=0;
  const element=React.createElement("main",null,React.createElement("button",{onClick:()=>clicks++},"Run"),
    React.createElement(AdsterraFrame,{format:"banner-320x50"}));
  container.innerHTML=renderToString(element);
  assert.equal(container.querySelectorAll("script,iframe").length,0,"SSR is safe before actual-origin validation");
  const errors:unknown[]=[];
  let root:ReturnType<typeof hydrateRoot>|undefined;
  try{
    await act(async()=>{root=hydrateRoot(container,element,{onRecoverableError:e=>errors.push(e)});});
    const frame=container.querySelector("iframe")!;
    assert.equal(frame.src,"https://ads.example.test/banner-320x50");
    assert.notEqual(new URL(frame.src).origin,dom.window.location.origin);
    assert.equal(frame.sandbox?.toString() || frame.getAttribute("sandbox"),AD_SANDBOX);
    assert.equal(frame.hasAttribute("srcdoc"),false);
    assert.equal(frame.getAttribute("referrerpolicy"),"no-referrer");
    const send=async(origin:string,source:any,status:string)=>act(async()=>{
      window.dispatchEvent(new dom.window.MessageEvent("message",{origin,source,data:{type:"ad-frame-status",format:"banner-320x50",status}}));
    });
    await send("https://evil.example.test",frame.contentWindow,"unavailable");
    await send("https://ads.example.test",window,"unavailable");
    assert.ok(container.querySelector("iframe"),"spoofed origin/source cannot alter slot");
    await send("https://ads.example.test",frame.contentWindow,"unavailable");
    assert.equal(container.querySelectorAll("iframe,aside").length,0,"entire unavailable slot collapses");
    await act(async()=>container.querySelector("button")!.click());
    assert.equal(clicks,1);assert.deepEqual(errors,[]);
    await act(async()=>root!.render(React.createElement(AdsterraFrame,{format:"native",key:"native"})));
    assert.equal(container.querySelector("iframe")!.src,"https://ads.example.test/native");
    await act(async()=>container.querySelector("iframe")!.dispatchEvent(new dom.window.Event("error")));
    assert.equal(container.innerHTML,"","frame error leaves no placeholder");
    t.mock.timers.enable({apis:["setTimeout"]});
    await act(async()=>root!.render(React.createElement(AdsterraFrame,{format:"banner-728x90",key:"timeout"})));
    assert.ok(container.querySelector("iframe"));
    await act(async()=>t.mock.timers.tick(AD_LOAD_TIMEOUT_MS));
    assert.equal(container.innerHTML,"","silent load failure is bounded");
    t.mock.timers.reset();
    dom.reconfigure({url:"https://ads.example.test"});
    await act(async()=>root!.render(React.createElement(AdsterraFrame,{format:"banner-320x50",key:"unsafe-alias"})));
    assert.equal(container.innerHTML,"","actual same-origin alias is rejected after hydration");
    dom.reconfigure({url:"https://app.example.test"});
    let width=320;
    const listeners=new Set<()=>void>();
    window.matchMedia=((query:string)=>({get matches(){return width <= (query.includes("639") ? 639 : 767);},
      addEventListener:(_event:string,listener:()=>void)=>listeners.add(listener),
      removeEventListener:(_event:string,listener:()=>void)=>listeners.delete(listener) })) as any;
    await act(async()=>root!.render(React.createElement(AdsterraResponsiveBanner)));
    for(const [nextWidth,format] of [[320,"banner-320x50"],[640,"banner-300x250"],[1024,"banner-728x90"]] as const){
      await act(async()=>{width=nextWidth;listeners.forEach(listener=>listener());});
      assert.equal(container.querySelectorAll("iframe").length,1,"only active responsive unit mounts");
      assert.equal(container.querySelector("iframe")!.src,"https://ads.example.test/"+format);
    }
  }finally{
    t.mock.timers.reset();
    if(root)await act(async()=>root!.unmount());
    dom.window.close();
    for(const[name,descriptor]of saved){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else Reflect.deleteProperty(globalThis,name);}
  }
});
