import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { minifyHtml } from "../../lib/tools/htmlMinifier.ts";
import { convertMarkdownToHtml } from "../../lib/tools/markdownToHtml.ts";
import { convertUnixTimestamp } from "../../lib/tools/unixTimestamp.ts";
import { calculateDateDifference, parseDateWithTimezone } from "../../lib/tools/dateDifference.ts";

test("HTML preserves DOM text, attributes, raw blocks and placeholder literals", () => {
  for (const input of [
    '<span>Hello</span> <span>world</span>',
    '<div   data-value="a  b > c"   title="x  y">a  b\n c</div>',
    '<p>___HTML_VERBATIM_BLOCK_0___</p><pre> a  b\n c </pre>',
    '<script>const s = "<!-- retain -->  x";</script><style>p { white-space: pre }</style>',
    '<textarea> a  b\n &amp; </textarea><div style="white-space:pre"> a  b\n </div>',
    '<svg><text xml:space="preserve"> a  b </text></svg>',
    '<input   value=hello/   disabled><img   src=foo  />',
    '<div   data-x="first" data-x="second">hello</div>',
    '<template><span   title="a  b"> a  b </span></template>',
    '<p   title="unterminated >  value',
  ]) assert.equal(new JSDOM(minifyHtml(input).minified).serialize(), new JSDOM(input).serialize(), input);
  assert.equal(minifyHtml(" \n ").minified, " \n ");
  const input = '<div   a="b">  text </div><!-- remove -->';
  assert.equal(minifyHtml(input, {stripComments:false, collapseWhitespace:false}).minified, input);
  assert.equal(minifyHtml('a<!-- remove --> b').minified, 'a b');
  assert.equal(minifyHtml('<!--[if IE]>special<![endif]-->').minified, '<!--[if IE]>special<![endif]-->');
});

test("Markdown preserves destinations, code, nesting and safe HTML", () => {
  const tick = String.fromCharCode(96);
  const md = '[link](https://example.com/a_b_c?x=1&y=2)\n\n' +
    tick + '**literal** _value_ <script>' + tick + '\n\n' +
    '![a & b](https://example.com/a_b_c.png)\n\n' +
    '- outer\n  - inner\n\n~~gone~~\n\nfirst line\nsecond line';
  const doc = new JSDOM(convertMarkdownToHtml(md)).window.document;
  assert.equal(doc.querySelector('a')?.getAttribute('href'), 'https://example.com/a_b_c?x=1&y=2');
  assert.equal(doc.querySelector('code')?.textContent, '**literal** _value_ <script>');
  assert.equal(doc.querySelector('img')?.getAttribute('alt'), 'a & b');
  assert.equal(doc.querySelector('img')?.getAttribute('src'), 'https://example.com/a_b_c.png');
  assert.equal(doc.querySelector('li li')?.textContent, 'inner');
  assert.equal(doc.querySelector('del')?.textContent, 'gone');
  assert.ok(doc.body.textContent?.includes('first line\nsecond line'));
  for (const attack of ['<script>alert(1)</script>','<img src=x onerror=alert(1)>','[x](javascript:alert%281%29)','[x](jav&#x61;script:alert%281%29)','![x](data:image/svg+xml,test)']) {
    const unsafe = new JSDOM(convertMarkdownToHtml(attack)).window.document;
    assert.equal(unsafe.querySelector('script,[onerror]'), null);
    for (const el of unsafe.querySelectorAll('[href],[src]')) assert.doesNotMatch(el.getAttribute('href') || el.getAttribute('src') || '', /^(javascript|data|vbscript):/i);
  }
});

test("timestamp decimals, negatives, explicit units and rounded consistency", () => {
  assert.equal(convertUnixTimestamp("1700000000.5").iso, "2023-11-14T22:13:20.500Z");
  assert.equal(convertUnixTimestamp("-1700000000.5").iso, "1916-02-18T01:46:39.500Z");
  assert.equal(convertUnixTimestamp("1700000000000.5").usedUnit, "milliseconds");
  assert.equal(convertUnixTimestamp("1000", {unit:"milliseconds"}).milliseconds, 1000);
  for (const input of ["1.9999", "-0.0001", "-1.9999"]) {
    const result = convertUnixTimestamp(input, {unit:"seconds"});
    assert.equal(result.seconds, Math.floor(result.milliseconds / 1000));
    assert.equal(new Date(result.milliseconds).toISOString(), result.iso);
  }
});

test("strict dates reject invalid calendars and ambiguous formats", () => {
  for (const input of ["2026-02-30","2025-02-29","2026-04-31","2026-13-01","01/02/2026","2026-01-01T24:00:00Z","2026-01-01T12:30:60Z"]) {
    assert.equal(convertUnixTimestamp(input, {mode:"date-to-timestamp"}).isValid, false, input);
    assert.equal(calculateDateDifference({startDate:input,endDate:"2026-03-01"}).isValid, false, input);
  }
  assert.equal(parseDateWithTimezone("2024-02-29", "UTC").toISOString(), "2024-02-29T00:00:00.000Z");
  assert.equal(parseDateWithTimezone("0000-01-01", "UTC").getUTCFullYear(), 0);
  assert.equal(convertUnixTimestamp("9999-12-31T23:59:59.999Z").isValid, true);
});

test("IANA offsets and daylight saving gaps/overlaps", () => {
  assert.equal(parseDateWithTimezone("2026-01-01T12:00:00","Asia/Karachi").toISOString(), "2026-01-01T07:00:00.000Z");
  assert.equal(parseDateWithTimezone("2026-01-01T12:00:00","America/New_York").toISOString(), "2026-01-01T17:00:00.000Z");
  assert.equal(parseDateWithTimezone("2026-07-01T12:00:00","America/New_York").toISOString(), "2026-07-01T16:00:00.000Z");
  for (const input of ["2026-03-08T02:30:00","2026-11-01T01:30:00"]) assert.ok(Number.isNaN(parseDateWithTimezone(input,"America/New_York").getTime()));
  assert.equal(parseDateWithTimezone("2026-11-01T01:30:00-04:00","America/New_York").toISOString(), "2026-11-01T05:30:00.000Z");
  assert.ok(Number.isNaN(parseDateWithTimezone("2026-01-01","Bad/Zone").getTime()));
  const dst = calculateDateDifference({startDate:"2026-03-08T00:00:00",endDate:"2026-03-09T00:00:00",startTimezone:"America/New_York",endTimezone:"America/New_York"});
  assert.equal(dst.totalHours,23);
});

test("clamped month breakdown and symmetric inclusive counting", () => {
  const month = calculateDateDifference({startDate:"2026-01-31",endDate:"2026-03-01"});
  assert.equal(month.totalDays,29);
  assert.equal(month.breakdown.months,1);
  assert.equal(month.breakdown.days,1);
  for (const [startDate,endDate] of [["2026-01-01","2026-01-02"],["2026-01-02","2026-01-01"]]) {
    const r = calculateDateDifference({startDate,endDate,includeEndDay:true});
    assert.equal(r.totalDays,2);
    assert.equal(r.isReversed,startDate>endDate);
    assert.equal(r.startDateIso,startDate+"T00:00:00.000Z");
    assert.equal(r.endDateIso,endDate+"T00:00:00.000Z");
  }
  const same = calculateDateDifference({startDate:"2026-01-01",endDate:"2026-01-01",includeEndDay:true});
  assert.equal(same.totalDays,1);
  assert.equal(same.isSameDate,true);
  assert.match(same.humanBreakdown,/1 day/);
});
