import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {TOOLS_REGISTRY} from '../data/toolsRegistry.ts';
import {SEARCH_GUIDES} from '../data/seo/searchGuides.ts';
const origin = 'http://127.0.0.1:3001';
const server=spawn('node',['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3001'],{stdio:['ignore','pipe','pipe']});
const normalize = value => value.replace(/\s+/g, ' ').trim();
let canonicalOrigin;
const titles = new Set();
const canonicalPaths = new Set(['/', '/about', '/contact', '/privacy', '/terms', ...TOOLS_REGISTRY.map(tool => `/tools/${tool.slug}`)]);
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
  for (const anchor of doc.querySelectorAll('a[href]')) {
   const target = new URL(anchor.getAttribute('href'), canonical.href);
   if (target.origin === canonicalOrigin && target.pathname.startsWith('/tools/')) {
    assert.ok(canonicalPaths.has(target.pathname), `${path}: broken or noncanonical tool link ${target.pathname}`);
   }
  }
  const searchGuide = SEARCH_GUIDES[path.replace('/tools/', '')];
  if (searchGuide) {
   assert.ok(doc.querySelector('#search-guide-heading'), `${path}: server-rendered practical guide`);
   assert.ok(doc.body.textContent.includes(searchGuide.example.output), `${path}: published example`);
  }
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
 assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), 'canonical sitemap discovery');
 const sitemapResponse = await fetch(origin + '/sitemap.xml');
 assert.equal(sitemapResponse.status, 200);
 const sitemapDom = new JSDOM(await sitemapResponse.text(), {contentType: 'text/xml'});
 const urls = [...sitemapDom.window.document.querySelectorAll('loc')].map(node => node.textContent);
 assert.deepEqual(new Set(urls), new Set([...canonicalPaths].map(path => canonicalOrigin + path)), 'sitemap contains exactly the canonical pages');
 assert.equal(urls.length, canonicalPaths.size, 'no duplicate sitemap entries');
 sitemapDom.window.close();
 const image = await fetch(origin + '/og-image.png');
 assert.equal(image.status, 200);
 console.log(`PASS: ${TOOLS_REGISTRY.length + 5} canonical pages, titles, descriptions, H1s, social images, FAQ/schema parity, aliases, 404/noindex, named controls, internal tool links, practical guides and canonical sitemap`);
} finally { server.kill(); }
