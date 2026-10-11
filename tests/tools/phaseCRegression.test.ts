import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { CSV_GUIDE_EXAMPLE, HTML_GUIDE_EXAMPLE } from '../../data/seo/examples.ts';
import { convertCsvToJson } from '../../lib/tools/csvToJson.ts';
import { minifyHtml } from '../../lib/tools/htmlMinifier.ts';
import { convertMarkdownToHtml } from '../../lib/tools/markdownToHtml.ts';
import { markdownPreviewHtml } from '../../lib/tools/markdownPreview.ts';

test('published CSV and HTML examples match default tool output exactly', () => {
  assert.equal(convertCsvToJson(CSV_GUIDE_EXAMPLE.input), CSV_GUIDE_EXAMPLE.output);
  assert.equal(minifyHtml(HTML_GUIDE_EXAMPLE.input).minified, HTML_GUIDE_EXAMPLE.output);
});

test('Markdown preview nests headings without changing exported headings or escaped code', () => {
  const source = '# Title\n\n## Section\n\n###### Detail\n\n`<h1>example</h1>`\n\n[unsafe](javascript:alert(1))';
  const output = convertMarkdownToHtml(source);
  const dom = new JSDOM(markdownPreviewHtml(output));
  assert.equal(dom.window.document.querySelector('h1'), null);
  assert.equal(dom.window.document.querySelector('h2')?.textContent, 'Title');
  assert.equal(dom.window.document.querySelector('h3')?.textContent, 'Section');
  assert.equal(dom.window.document.querySelector('h6')?.textContent, 'Detail');
  assert.equal(dom.window.document.querySelector('code')?.textContent, '<h1>example</h1>');
  assert.ok(!dom.window.document.querySelector('a')?.getAttribute('href')?.startsWith('javascript:'));
  assert.match(output, /<h1>Title<\/h1>/);
  dom.window.close();
});

import { serializeStructuredData } from '../../lib/structuredData.ts';
test('structured data cannot swallow the page or terminate its script through HTML examples', () => {
  for (const text of ['<!-- example <script> -->', '</script><h1>Injected</h1>', '<pre> & <style>']) {
    const data = { text };
    const dom = new JSDOM(`<script type="application/ld+json">${serializeStructuredData(data)}</script><h1>Actual page</h1>`);
    assert.deepEqual(JSON.parse(dom.window.document.querySelector('script')!.textContent!), data);
    assert.equal(dom.window.document.querySelectorAll('h1').length, 1);
    assert.equal(dom.window.document.querySelector('h1')!.textContent, 'Actual page');
    dom.window.close();
  }
});
