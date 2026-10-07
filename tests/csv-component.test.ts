import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';

test('CSV/JSON component: file import, real tabs, copy/download parity, errors and import races', async () => {
  const dom = new JSDOM('<div id="root"></div>', {url:'https://example.test'});
  const saved = new Map<string,PropertyDescriptor|undefined>();
  for (const [name,value] of Object.entries({window:dom.window,self:dom.window,document:dom.window.document,navigator:dom.window.navigator,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true})) {
    saved.set(name,Object.getOwnPropertyDescriptor(globalThis,name));
    Object.defineProperty(globalThis,name,{configurable:true,writable:true,value});
  }
  const {default:React,act}=await import('react');
  const {createRoot}=await import('react-dom/client');
  const {JsonTool}=await import('../components/tools/JsonTool.tsx');
  const {getToolBySlug}=await import('../data/toolsRegistry.ts');
  const root=createRoot(document.getElementById('root')!);
  let copied='', filename='', blob:Blob|undefined;
  Object.defineProperty(window,'isSecureContext',{value:true});
  Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{copied=text;}}});
  const oldCreate=URL.createObjectURL, oldRevoke=URL.revokeObjectURL;
  URL.createObjectURL=(value:Blob)=>{blob=value;return 'blob:csv-test';};
  URL.revokeObjectURL=()=>{};
  dom.window.HTMLAnchorElement.prototype.click=function(){filename=this.download;};
  const output=()=>document.querySelector<HTMLTextAreaElement>('#transformed-result-output')!.value;
  const setInput=async(value:string)=>{await act(async()=>{
    const el=document.querySelector<HTMLTextAreaElement>('#source-text-input')!;
    Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype,'value')!.set!.call(el,value);
    el.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
  });};
  const select=async(id:string,value:string)=>{await act(async()=>{
    const el=document.getElementById(id) as HTMLSelectElement;
    el.value=value;el.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
  });};
  const file=async(value:File)=>{await act(async()=>{
    const el=document.getElementById('conversion-file') as HTMLInputElement;
    Object.defineProperty(el,'files',{configurable:true,value:[value]});
    el.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
    await new Promise(resolve=>setTimeout(resolve,10));
  });};
  const parity=async(ext:string,mime:string)=>{
    const preview=output();
    assert.ok(preview);
    await act(async()=>document.querySelector<HTMLButtonElement>('button[aria-label="Copy"],button[aria-label="Copied to clipboard"]')!.click());
    await act(async()=>document.querySelector<HTMLButtonElement>('button[aria-label="Download result as text file"]')!.click());
    assert.equal(copied,preview);assert.equal(await blob!.text(),preview);
    assert.equal(filename,'converted.'+ext);assert.equal(blob!.type,mime+';charset=utf-8');
  };
  try {
    await act(async()=>root.render(React.createElement(JsonTool,{tool:getToolBySlug('csv-to-json'),key:'csv'})));
    assert.equal((document.getElementById('csv-to-json-parse-types') as HTMLInputElement).checked,false);
    const tab=document.querySelector<HTMLOptionElement>('#csv-to-json-delimiter option[value="\t"]');
    assert.ok(tab,'tab option contains the actual tab character');
    await file(new File(['\uFEFFid\tname\n90071992547409931234\tعلی'],'sample.tsv'));
    assert.equal((document.getElementById('csv-to-json-delimiter') as HTMLSelectElement).value,'\t');
    assert.equal(JSON.parse(output())[0].id,'90071992547409931234');
    await parity('json','application/json');
    await select('csv-to-json-delimiter',';');
    await file(new File(['name;name\nAli;Khan'],'sample.csv'));
    assert.deepEqual(JSON.parse(output()),[{name:'Ali',name_2:'Khan'}]);
    await setInput('a\n"bad');
    assert.equal(output(),'');assert.match(document.body.textContent!,/Malformed CSV/);
    assert.equal(document.querySelector('button[aria-label="Download result as text file"]'),null);
    await file(new File(['x'],'wrong.json'));
    assert.match(document.body.textContent!,/Choose a .csv or .tsv/);
    let finish!:(value:ArrayBuffer)=>void;
    const pending={name:'slow.csv',size:3,arrayBuffer:()=>new Promise<ArrayBuffer>(resolve=>{finish=resolve;})} as File;
    await file(pending);
    await setInput('a\nnew');
    await act(async()=>{finish(new TextEncoder().encode('a\nold').buffer);await Promise.resolve();});
    assert.equal(JSON.parse(output())[0].a,'new','late import cannot replace newer typed input');
    await act(async()=>root.render(React.createElement(JsonTool,{tool:getToolBySlug('json-to-csv'),key:'json'})));
    await file(new File(['\uFEFF[{"a":1,"obj":{"x":2}},{"b":true}]'],'data.json'));
    assert.match(output(),/^a,obj,b\n/);
    await parity('csv','text/csv');
    await select('json-to-csv-delimiter','\t');
    assert.ok(output().includes('\t'));assert.ok(!output().includes('\\t'));
    await parity('tsv','text/tab-separated-values');
    await setInput('{"id":90071992547409931234}');
    assert.equal(output(),'');assert.match(document.body.textContent!,/quote large integers/);
    await setInput('{bad');assert.equal(output(),'');assert.match(document.body.textContent!,/Invalid JSON/);
    await setInput('');assert.equal(output(),'');assert.match(document.body.textContent!,/Enter CSV or JSON/);
  } finally {
    await act(async()=>root.unmount());
    await new Promise(resolve=>setTimeout(resolve,2100));
    URL.createObjectURL=oldCreate;URL.revokeObjectURL=oldRevoke;
    dom.window.close();
    for(const [name,value] of saved) {if(value)Object.defineProperty(globalThis,name,value);else Reflect.deleteProperty(globalThis,name);}
  }
});
