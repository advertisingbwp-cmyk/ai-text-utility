import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

test('modal contains keyboard focus, suppresses background shortcuts, and restores trigger focus', async () => {
 const dom = new JSDOM('<button id="trigger">Open</button><div id="root"></div>', {url:'https://example.test'});
 const saved = new Map<string, PropertyDescriptor | undefined>();
 for (const [key,value] of Object.entries({window:dom.window,self:dom.window,document:dom.window.document,navigator:dom.window.navigator,IS_REACT_ACT_ENVIRONMENT:true})) {
  saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));
  Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});
 }
 dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true;this.querySelector<HTMLElement>('button')?.focus();};
 dom.window.HTMLDialogElement.prototype.close=function(){this.open=false;};
 dom.window.HTMLElement.prototype.getClientRects=function(){return [{width:10,height:10}] as unknown as DOMRectList;};
 const {default:React,act}=await import('react');
 const {createRoot}=await import('react-dom/client');
 const {Modal}=await import('../components/Modal.tsx');
 const root=createRoot(document.getElementById('root')!);
 const trigger=document.getElementById('trigger')!;
 let closed=0, background=0;
 const listener=()=>background++;
 window.addEventListener('keydown',listener);
 try {
  trigger.focus();
  await act(async()=>root.render(React.createElement(Modal,{label:'Search tools',onClose:()=>closed++,children:[React.createElement('button',{key:'a'},'First'),React.createElement('button',{key:'b'},'Last')]})));
  const [first,last]=Array.from(document.querySelectorAll<HTMLButtonElement>('dialog button'));
  assert.equal(document.activeElement,first);
  first.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true}));
  assert.equal(document.activeElement,last);
  last.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));
  assert.equal(document.activeElement,first);
  first.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Enter',ctrlKey:true,bubbles:true}));
  assert.equal(background,0);
  document.querySelector('dialog')!.dispatchEvent(new dom.window.Event('cancel',{bubbles:false,cancelable:true}));
  assert.equal(closed,1);
  await act(async()=>root.unmount());
  assert.equal(document.activeElement,trigger);
  assert.equal(document.body.style.overflow,'');
  const {DateTimeTool}=await import('../components/tools/DateTimeTool.tsx');
  const {getToolBySlug}=await import('../data/toolsRegistry.ts');
  const datesRoot=createRoot(document.getElementById('root')!);
  try {
    await act(async()=>datesRoot.render(React.createElement(DateTimeTool,{tool:getToolBySlug('date-difference')!})));
    const fields=Array.from(document.querySelectorAll<HTMLInputElement>('#tool-workspace input[type="text"]'));
    assert.equal(fields.length,2);
    assert.match(fields[0].labels![0].textContent!,/Start date/);
    assert.match(fields[1].labels![0].textContent!,/End date/);
    const fill=async(el:HTMLInputElement,value:string)=>act(async()=>{
      Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value')!.set!.call(el,value);
      el.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
    });
    await fill(fields[0],'');
    await fill(fields[1],'2026-03-01');
    assert.equal(fields[0].value,'');
    assert.equal(fields[1].value,'2026-03-01');
    await fill(fields[0],'2026-01-31');
    assert.match(document.querySelector('#tool-workspace')!.textContent!,/1 month, 1 day/);
    assert.equal(document.querySelector('[role="alert"]'),null);
  } finally {await act(async()=>datesRoot.unmount());}

 } finally {
  window.removeEventListener('keydown',listener);dom.window.close();
  for(const [key,value] of saved) {if(value)Object.defineProperty(globalThis,key,value);else Reflect.deleteProperty(globalThis,key);}
 }
});
