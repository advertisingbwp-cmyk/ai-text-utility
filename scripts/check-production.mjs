import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {TOOLS_REGISTRY} from '../data/toolsRegistry.ts';
const origin = 'http://127.0.0.1:3001';
const server=spawn('node',['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3001'],{stdio:['ignore','pipe','pipe']});
const normalize = value => value.replace(/\s+/g, ' ').trim();
let canonicalOrigin;
const titles = new Set();
async function inspect(path) {
 const res = await fetch(origin + path);
 assert.equal(res.status, 200, path);
 const dom = new JSDOM(await res.text());
 const doc = dom.window.document;
 try {
  const canonicals = doc.querySelectorAll('link[rel="canonical"]');
  assert.equal(canonicals.length, 1, `${path}: one canonical`);
  const canonical = new URL(canonicals[0].href);
  canonicalOrigin ??= canonical.origin;
  assert.equal(canonical.href, canonicalOrigin + path, `${path}: canonical`);
  assert.equal(doc.querySelectorAll('h1').length, 1, `${path}: one host heading`);
  const title = doc.title.trim();
  assert.ok(title && !titles.has(title), `${path}: unique nonempty title`);
  titles.add(title);
  assert.ok(doc.querySelector('meta[name="description"]')?.content.trim(), `${path}: description`);
  assert.ok(!doc.querySelector('meta[name="robots"]')?.content.includes('noindex'), `${path}: indexable`);
  assert.ok(doc.querySelector('meta[property="og:image"]')?.content, `${path}: OG image`);
  assert.ok(doc.querySelector('meta[name="twitter:image"]')?.content, `${path}: social image`);
  for (const el of doc.querySelectorAll('input:not([type="hidden"]), textarea, select, button')) {
   const named = el.getAttribute('aria-label')?.trim() || el.getAttribute('aria-labelledby')?.split(/\s+/).some(id => doc.getElementById(id)?.textContent.trim()) || el.labels?.length || (el.tagName === 'BUTTON' && (el.textContent.trim() || el.title));
   assert.ok(named, `${path}: unnamed ${el.tagName} ${el.id}`);
  }
  assert.ok(doc.querySelector('a[href="#main-content"]'), `${path}: skip link`);
  const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent));
  if (path.startsWith('/tools/')) {
   assert.ok(schemas.some(s => s['@type'] === 'WebApplication'), `${path}: application schema`);
   assert.equal(doc.querySelector('meta[property="og:url"]')?.content, canonical.href, `${path}: OG URL`);
   const faq = schemas.find(s => s['@type'] === 'FAQPage');
   assert.ok(faq, `${path}: FAQ schema`);
   const section = doc.querySelector('section[aria-labelledby="faq-heading"]');
   const questions = [...section.querySelectorAll('h3')];
   assert.equal(questions.length, faq.mainEntity.length, `${path}: FAQ count`);
   questions.forEach((q, i) => {
    assert.equal(normalize(q.textContent), normalize(faq.mainEntity[i].name), `${path}: FAQ question`);
    assert.equal(normalize(q.nextElementSibling.textContent), normalize(faq.mainEntity[i].acceptedAnswer.text), `${path}: FAQ answer`);
   });
  }
  if (path === '/') assert.ok(doc.body.textContent.includes('Free online text tools for everyday work'));
 } finally { dom.window.close(); }
}
try {
 await new Promise((resolve,reject)=>{server.stdout.on('data',d=>{if(d.toString().includes('Ready'))resolve()});server.on('error',reject);server.on('exit',c=>reject(new Error(`server exited ${c}`)));setTimeout(()=>reject(new Error('startup timeout')),15000).unref()});
 for (const path of ['/', '/about', '/contact', '/privacy', '/terms']) await inspect(path);
 for (const tool of TOOLS_REGISTRY) {
  await inspect(`/tools/${tool.slug}`);
  for(const alias of tool.aliases||[]) {
   const res = await fetch(`${origin}/tools/${alias}`, {redirect:'manual'});
   assert.equal(res.status, 308, alias);
   assert.equal(new URL(res.headers.get('location'), origin).pathname, `/tools/${tool.slug}`, alias);
  }
 }
 const missing = await fetch(origin + '/tools/does-not-exist-phase-c');
 assert.equal(missing.status, 404);
 const missingDom = new JSDOM(await missing.text());
 assert.ok([...missingDom.window.document.querySelectorAll('meta[name="robots"]')].some(el => el.content.includes('noindex')));
 missingDom.window.close();
 const robots = await (await fetch(origin + '/robots.txt')).text();
 assert.ok(!robots.includes('Disallow: /_next/'));
 const image = await fetch(origin + '/og-image.png');
 assert.equal(image.status, 200);
 console.log(`PASS: ${TOOLS_REGISTRY.length + 5} canonical pages, unique titles, descriptions, one H1, social images, visible FAQ/schema parity, aliases, 404/noindex crawlable assets and named controls`);
} finally { server.kill(); }
