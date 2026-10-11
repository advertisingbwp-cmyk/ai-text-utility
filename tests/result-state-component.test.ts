import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

test("Phase B: current and empty result exports, debounced edits, AI races and failures", async () => {
  const dom = new JSDOM('<div id="root"></div>', {url:"https://example.test"});
  const saved = new Map<string,PropertyDescriptor|undefined>();
  for (const [name,value] of Object.entries({window:dom.window,self:dom.window,document:dom.window.document,navigator:dom.window.navigator,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true})) {
    saved.set(name,Object.getOwnPropertyDescriptor(globalThis,name));
    Object.defineProperty(globalThis,name,{configurable:true,writable:true,value});
  }
  const {default:React,act} = await import("react");
  const {createRoot} = await import("react-dom/client");
  const {getToolBySlug} = await import("../data/toolsRegistry.ts");
  const {ToolWorkspaceResolver} = await import("../components/layouts/ToolWorkspaceResolver.tsx");
  const {TransformTool} = await import("../components/tools/TransformTool.tsx");
  const {JsonTool} = await import("../components/tools/JsonTool.tsx");
  const {GeneratorTool} = await import("../components/tools/GeneratorTool.tsx");
  const {AiTool} = await import("../components/tools/AiTool.tsx");
  const root = createRoot(document.getElementById("root")!);
  let copied: string|undefined, downloaded:Blob|undefined;
  Object.defineProperty(window,"isSecureContext",{value:true});
  Object.defineProperty(navigator,"clipboard",{value:{writeText:async(text:string)=>{copied=text;}}});
  const originalCrypto = Object.getOwnPropertyDescriptor(globalThis,"crypto");
  const oldCreate=URL.createObjectURL, oldRevoke=URL.revokeObjectURL, oldFetch=globalThis.fetch;
  URL.createObjectURL=blob=>{downloaded=blob as Blob; return "blob:test";};
  URL.revokeObjectURL=()=>{};
  dom.window.HTMLAnchorElement.prototype.click=function(){};
  const click=async(el:Element)=>act(async()=>{(el as HTMLButtonElement).click();});
  const copy=()=>document.querySelector<HTMLButtonElement>('button[aria-label="Copy"],button[aria-label="Copy HTML"],button[aria-label="Copied to clipboard"]')!;
  const download=()=>document.querySelector<HTMLButtonElement>('button[aria-label^="Download"]')!;
  const fill=async(value:string)=>act(async()=>{
    const el=document.querySelector<HTMLTextAreaElement>('textarea:not([readonly])')!;
    Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype,"value")!.set!.call(el,value);
    el.dispatchEvent(new dom.window.Event("input",{bubbles:true}));
  });
  const run=async()=>act(async()=>{window.dispatchEvent(new dom.window.KeyboardEvent("keydown",{key:"Enter",ctrlKey:true,bubbles:true}));});
  const clear=()=>document.querySelector<HTMLButtonElement>('button[aria-label^="Clear"]')!;
  const requests:{signal:AbortSignal;resolve:(r:Response)=>void;reject:(e:Error)=>void}[]=[];
  globalThis.fetch=(_url,opts)=>new Promise<Response>((resolve,reject)=>requests.push({signal:opts!.signal as AbortSignal,resolve,reject}));
  const finish=async(index:number,text:string,status=200)=>act(async()=>{
    requests[index].resolve(new Response(JSON.stringify(status===200?{success:true,result:text}:{success:false,error:text}),{status}));
    await Promise.resolve();
  });
  try {
    // Every downloadable shared layout must save an empty result, never SOURCE.
    for(const layout of ["transform","twoWay","compact","table","splitPreview","validator","generator","ai"] as const) {
      const tool={...getToolBySlug("remove-extra-spaces")!,layout};
      const props={tool,input:"SOURCE",output:"",resultReady:true,onInputChange:()=>{}};
      await act(async()=>root.render(React.createElement(ToolWorkspaceResolver,{...props,key:layout})));
      assert.ok(!download().disabled,layout);
      await click(download());
      assert.equal(await downloaded!.text(),"",layout);
      if(copy()) {await click(copy()); assert.equal(copied,"",layout);}
      for(const state of [{resultReady:false},{isLoading:true},{error:"Bad input"}]) {
        await act(async()=>root.render(React.createElement(ToolWorkspaceResolver,{...props,...state,output:"OLD",key:layout})));
        assert.equal(download().disabled,true,layout);
        if(copy()) assert.equal(copy().disabled,true,layout);
      }
    }
    await act(async()=>root.render(React.createElement(TransformTool,{tool:getToolBySlug("remove-special-chars")!,key:"clean"})));
    await fill("@#$");
    assert.equal(document.querySelector<HTMLTextAreaElement>('textarea[readonly]')!.value,"");
    assert.match(document.body.textContent!,/result is empty/);
    await click(download()); await click(copy());
    assert.equal(await downloaded!.text(),""); assert.equal(copied,"");
    await fill("x".repeat(3000));
    assert.equal(download().disabled,true,"old result unavailable during debounce");
    assert.equal(copy().disabled,true);
    await act(async()=>{await new Promise(r=>setTimeout(r,160));});
    await click(download());
    assert.equal(await downloaded!.text(),"x".repeat(3000));
    await click(clear());
    assert.equal(download().disabled,true);
    await act(async()=>root.render(React.createElement(JsonTool,{tool:getToolBySlug("json-formatter")!,key:"json"})));
    await fill('{"a":1}');
    assert.ok(!download().disabled);
    await fill("{bad");
    assert.equal(download().disabled,true);
    assert.equal(copy().disabled,true);

    const digests: {resolve:(value:ArrayBuffer)=>void; reject:(error:Error)=>void}[]=[];
    Object.defineProperty(globalThis,"crypto",{configurable:true,value:{subtle:{digest:()=>new Promise<ArrayBuffer>((resolve,reject)=>digests.push({resolve,reject}))}}});
    await act(async()=>root.render(React.createElement(GeneratorTool,{tool:{...getToolBySlug("hash-generator")!,sampleInput:""},key:"hash"})));
    await fill("old hash");
    assert.equal(digests.length,4);
    await fill("new hash");
    assert.equal(digests.length,8);
    await act(async()=>{digests.slice(4,8).forEach(d=>d.resolve(new Uint8Array([2,3]).buffer));await Promise.resolve();});
    await click(copy()); assert.equal(copied,"0203");
    await act(async()=>{digests.slice(0,4).forEach(d=>d.resolve(new Uint8Array([9]).buffer));await Promise.resolve();});
    await click(copy()); assert.equal(copied,"0203","old hashes cannot replace new result");
    await fill("failing hash");
    await act(async()=>{digests.slice(8).forEach(d=>d.reject(new Error("Hash failed")));await Promise.resolve();});
    assert.equal(copy(),null);
    assert.ok(!document.body.textContent!.includes("0203"));
    await fill("clear hash");
    await click(clear());
    await act(async()=>{digests.slice(12).forEach(d=>d.resolve(new Uint8Array([7]).buffer));await Promise.resolve();});
    assert.equal(copy(),null);
    if(originalCrypto) Object.defineProperty(globalThis,"crypto",originalCrypto);

    await act(async()=>root.render(React.createElement(AiTool,{tool:getToolBySlug("ai-grammar")!,key:"ai"})));
    await fill("first"); await run(); await run();
    assert.equal(requests.length,1,"duplicate shortcut does not submit twice");
    await fill("second");
    assert.equal(requests[0].signal.aborted,true);
    await run();
    await finish(0,"STALE");
    assert.equal(document.querySelector('textarea[readonly]'),null,"new request stays loading");
    assert.ok(document.body.textContent!.includes("Cancel request"),"old finally cannot stop new loading state");
    await finish(1,"CURRENT");
    assert.equal(document.querySelector<HTMLTextAreaElement>('textarea[readonly]')!.value,"CURRENT");
    await click(copy()); await click(download());
    assert.equal(copied,"CURRENT"); assert.equal(await downloaded!.text(),"CURRENT");
    await run();
    assert.equal(download().disabled,true,"previous success unavailable while retrying");
    await finish(2,"Provider unavailable",503);
    assert.equal(copy().disabled,true);
    assert.match(document.body.textContent!,/Provider unavailable/);
    await run();
    await click(clear());
    assert.equal(requests[3].signal.aborted,true);
    await finish(3,"LATE AFTER CLEAR");
    assert.equal(document.querySelector<HTMLTextAreaElement>('textarea[readonly]')!.value,"");
    assert.equal(download().disabled,true);
    await fill("cancel this"); await run();
    await click([...document.querySelectorAll("button")].find(b=>b.textContent==="Cancel request")!);
    assert.equal(requests[4].signal.aborted,true);
    await finish(4,"CANCELLED");
    assert.equal(download().disabled,true);
    await fill("x".repeat(10001)); await run();
    assert.equal(requests.length,5,"keyboard submission respects character limit");
    await fill("unmount"); await run();
    await act(async()=>root.render(React.createElement("div")));
    assert.equal(requests[5].signal.aborted,true);
    await finish(5,"AFTER UNMOUNT");
  } finally {
    await act(async()=>root.unmount());
    await new Promise(r=>setTimeout(r,1050));
    if(originalCrypto) Object.defineProperty(globalThis,"crypto",originalCrypto);
    globalThis.fetch=oldFetch; URL.createObjectURL=oldCreate; URL.revokeObjectURL=oldRevoke;
    dom.window.close();
    for(const [name,value] of saved) {if(value)Object.defineProperty(globalThis,name,value);else Reflect.deleteProperty(globalThis,name);}
  }
});
