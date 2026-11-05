// Stored-XSS regression tests for the CMS article sanitiser.
// Run: node --test scripts/test-content-html.mjs
import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));
const { sanitizeUpdateHtml, htmlToText, ALLOWED_CONTENT_TAGS } = await import('../src/lib/content-html.ts');
const { toContentData } = await import('../src/lib/content-serialize.ts');

const ALLOWED = new Set(ALLOWED_CONTENT_TAGS);
const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", colon: ':', tab: '\t', newline: '\n' };
const decode = value => value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);?/gi, (entity, body) => {
  if (body[0] === '#') return String.fromCodePoint(body[1].toLowerCase() === 'x' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10));
  return NAMED_ENTITIES[body.toLowerCase()] ?? entity;
});

// sanitize-html re-serialises every tag canonically (lowercase names, double-
// quoted attribute values with `"` escaped), so a strict scan of its output is
// a faithful view of what a browser will build from it.
function inspect(html) {
  const tags = [];
  for (const match of html.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'>/=]+(?:="[^"]*")?)*)\s*\/?>/g)) {
    const attrs = [...match[2].matchAll(/\s+([^\s"'>/=]+)(?:="([^"]*)")?/g)].map(([, name, value = '']) => ({ name: name.toLowerCase(), value: decode(value) }));
    tags.push({ name: match[1].toLowerCase(), attrs });
  }
  // Anything that still looks like markup outside a recognised tag means the
  // scan did not understand the output; fail loudly instead of passing.
  const leftover = html.replace(/<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'>/=]+(?:="[^"]*")?)*)\s*\/?>/g, '');
  assert.ok(!/[<>]/.test(leftover), `unparsed markup left in output: ${leftover}`);
  return tags;
}

function assertSafe(input) {
  const output = sanitizeUpdateHtml(input);
  for (const tag of inspect(output)) {
    assert.ok(ALLOWED.has(tag.name), `<${tag.name}> must not survive: ${output}`);
    for (const { name, value } of tag.attrs) {
      assert.ok(!name.startsWith('on'), `event handler ${name} survived: ${output}`);
      assert.ok(!['style', 'srcdoc', 'formaction', 'xlink:href', 'action', 'background'].includes(name), `${name} survived: ${output}`);
      if (['href', 'src', 'cite'].includes(name)) {
        const scheme = value.replace(/[\u0000- ]/g, '').toLowerCase();
        assert.ok(!/^(?:javascript|vbscript|livescript):/.test(scheme), `script URL survived: ${output}`);
        assert.ok(!scheme.startsWith('//'), `protocol-relative URL survived: ${output}`);
        if (tag.name !== 'img') assert.ok(!scheme.startsWith('data:'), `data: link survived: ${output}`);
      }
    }
  }
  assert.equal(sanitizeUpdateHtml(output), output, 'sanitising is idempotent');
  return output;
}

const BYPASS_PAYLOADS = [
  // The three confirmed bypasses of the old regex sanitiser.
  '<img/src=x/onerror=alert(1)>',
  '<svg/onload=alert(1)>',
  '<a href="&#106;avascript:alert(1)">click</a>',
  // Variants of the same holes that do execute in browsers.
  '<img/onerror=alert(1) src=x>',
  '<a/onmouseover=alert(1) href=#>x</a>',
  '<IMG SRC=x ONERROR=alert(1)>',
  '<img src=x\nonerror=alert(1)>',
  '<img src=x\tonerror=alert(1)>',
  '<p/onclick="alert(1)">x</p>',
  '<a href="&#x6A;&#x61;&#x76;&#x61;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3A;alert(1)">x</a>',
  '<a href="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058alert(1)">x</a>',
  '<a href="javascript&colon;alert(1)">x</a>',
  '<a href="java&#x09;script:alert(1)">x</a>',
  '<a href="java\nscript:alert(1)">x</a>',
  '<a href=" &#14; javascript:alert(1)">x</a>',
  '<a href="JaVaScRiPt:alert(1)">x</a>',
  '<a href=javascript:alert(1)>x</a>',
  "<a href='javascript:alert(1)'>x</a>",
  '<a href="vbscript:msgbox(1)">x</a>',
  '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">x</a>',
  '<a href="//evil.example/phish">x</a>',
  '<img src="javascript:alert(1)">',
  '<blockquote cite="javascript:alert(1)">q</blockquote>',
  // Raw scripts, embedded documents and style.
  '<script>alert(1)</script>',
  '<scr<script>ipt>alert(1)</script>',
  '<iframe src="javascript:alert(1)"></iframe>',
  '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
  '<object data="javascript:alert(1)"></object><embed src="javascript:alert(1)">',
  '<form action="javascript:alert(1)"><button formaction="javascript:alert(1)">go</button></form>',
  '<input autofocus onfocus=alert(1)>',
  '<details open ontoggle=alert(1)>x</details>',
  '<style>@import "javascript:alert(1)";</style>',
  '<p style="background:url(javascript:alert(1))">x</p>',
  '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
  '<base href="javascript:alert(1)//">',
  '<link rel="stylesheet" href="https://evil.example/x.css">',
  '<body onload=alert(1)><p>x</p></body>',
  // Parser-differential (mXSS) shapes.
  '<noscript><p title="</noscript><img src=x onerror=alert(1)>"></noscript>',
  '<math><mtext><table><mglyph><style><img src=x onerror=alert(1)>',
  '<svg><style><img src=x onerror=alert(1)></style></svg>',
  '<!--><img src=x onerror=alert(1)>-->',
  '<![CDATA[><img src=x onerror=alert(1)>]]>',
  '<template><img src=x onerror=alert(1)></template>',
  '<textarea><img src=x onerror=alert(1)></textarea>',
  '<xmp><img src=x onerror=alert(1)></xmp>',
  '<a href="https://ok.example" title="&quot;><img src=x onerror=alert(1)>">x</a>',
  // DOM clobbering of page globals.
  '<img id="dataLayer" src="x"><div id="__next_f">x</div><a id="fbq" href="/">x</a>',
];

test('confirmed bypass payloads no longer carry script', () => {
  assert.equal(sanitizeUpdateHtml('<svg/onload=alert(1)>'), '');
  assert.equal(sanitizeUpdateHtml('<a href="&#106;avascript:alert(1)">click</a>'), '<a>click</a>');
  // Browsers read `x/onerror=alert(1)` as the src URL (no handler attribute);
  // the sanitiser keeps that harmless relative URL and adds no handler.
  const img = sanitizeUpdateHtml('<img/src=x/onerror=alert(1)>');
  assert.deepEqual(inspect(img).map(tag => tag.attrs.map(attr => attr.name)), [['src']]);
  assert.equal(sanitizeUpdateHtml('<img/onerror=alert(1) src=x>'), '<img src="x" />');
});

for (const payload of BYPASS_PAYLOADS) {
  test(`neutralises ${JSON.stringify(payload).slice(0, 90)}`, () => {
    assertSafe(payload);
  });
}

test('the readable text around stripped markup is kept', () => {
  assert.equal(assertSafe('<p onclick="alert(1)" style="color:red">Fees &amp; costs</p>'), '<p>Fees &amp; costs</p>');
  assert.equal(assertSafe('<iframe src="https://x.example"></iframe><p>after</p>'), '<p>after</p>');
  assert.equal(assertSafe('<script>alert(1)</script><p>after</p>'), '<p>after</p>');
});

test('pasted full documents are reduced to their body, with the H1 demoted', () => {
  const output = assertSafe('<!DOCTYPE html><html><head><title>Doc</title><meta charset="utf-8"><style>body{color:red}</style></head><body class="x"><h1 id="intro">Intake 2027</h1><p>Body</p><!-- note --></body></html>');
  assert.equal(output, '<h2 id="intro">Intake 2027</h2><p>Body</p>');
});

test('the formatting editors use survives unchanged', () => {
  const article = [
    '<h2 id="fees-2027" class="section-title">Fees</h2>',
    '<h3>Tuition</h3><p>Pay <strong>before</strong> <em>March</em>, <u>not</u> <s>later</s> <mark>today</mark> H<sub>2</sub>O x<sup>2</sup>.</p>',
    '<ul><li>One</li><li>Two</li></ul><ol start="3"><li>Three</li></ol>',
    '<blockquote><p>Quoted</p></blockquote><pre><code>npm run dev</code></pre><hr />',
    '<p><a href="https://www.csc.edu.cn/">CSC</a> <a href="/updates/china-intake">Intake</a> <a href="#fees-2027">Fees</a> <a href="mailto:info@example.com">Email</a> <a href="tel:+8801700000000">Call</a></p>',
    '<figure><img src="https://eduexpressint.com/a.webp" alt="Campus" width="640" height="360" loading="lazy" /><figcaption>Campus</figcaption></figure>',
    '<img src="data:image/png;base64,iVBORw0KGgo=" alt="inline" />',
    '<table><caption>Costs</caption><thead><tr><th scope="col" colspan="2">Item</th></tr></thead><tbody><tr><td rowspan="2">Visa</td><td>5,000</td></tr></tbody></table>',
    '<div class="callout"><p>Note</p></div><details><summary>More</summary><p>Hidden</p></details>',
    '<dl><dt>Term</dt><dd>Definition</dd></dl><p><abbr title="Chinese Scholarship Council">CSC</abbr> <time datetime="2027-03-01">1 March</time> <br />End</p>',
  ].join('');
  assert.equal(assertSafe(article), article);
});

test('links opening a new tab cannot reach window.opener', () => {
  assert.equal(
    assertSafe('<a href="https://x.example" target="_blank" rel="nofollow">x</a>'),
    '<a href="https://x.example" target="_blank" rel="nofollow noopener noreferrer">x</a>',
  );
  assert.equal(assertSafe('<a href="https://x.example" target="evil">x</a>'), '<a href="https://x.example">x</a>');
});

test('content is sanitised before it is saved through the admin API', () => {
  const data = toContentData({ title: 'T', slug: 't', author: 'A', content: '<p>ok</p><img/onerror=alert(1) src=x><svg/onload=alert(1)>' });
  assert.equal(data.content, '<p>ok</p><img src="x" />');
  const partial = toContentData({ content: '<a href="&#106;avascript:alert(1)">x</a>' }, true);
  assert.deepEqual(partial, { content: '<a>x</a>' });
  assert.ok(!('content' in toContentData({ title: 'only title' }, true)), 'partial updates leave content alone');
});

test('empty input is an empty string', () => {
  assert.equal(sanitizeUpdateHtml(null), '');
  assert.equal(sanitizeUpdateHtml(undefined), '');
  assert.equal(sanitizeUpdateHtml(''), '');
});

test('plain-text extraction is unchanged', () => {
  assert.equal(htmlToText('<h1>Title</h1><p>One &amp; two</p><script>x()</script>'), 'Title One & two');
});
