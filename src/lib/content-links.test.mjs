import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('../../scripts/lib/typescript-source-resolver.mjs', import.meta.url));

const { repairUpdateInternalLinks } = await import('./content-links.ts');

test('repairUpdateInternalLinks rewrites /assessment and known university slug aliases', () => {
  const validSlugs = new Set(['zzu', 'npu', 'jsnu', 'njupt', 'nanchang-university']);
  const input =
    '<p>Start our <a href="/assessment">Fit Assessment</a> or apply to ' +
    '<a class="link" href="/universities/zhengzhou-university" target="_self">Zhengzhou University</a>, ' +
    '<a href="/universities/jiangsu-normal-university#fees">JSNU</a>, and ' +
    '<a href="/universities/nanchang-university">NCU</a>.</p>';

  const out = repairUpdateInternalLinks(input, validSlugs);
  assert.match(out, /href="\/education-fit-assessment"/);
  assert.doesNotMatch(out, /href="\/assessment"/);
  assert.match(out, /<a class="link" href="\/universities\/zzu" target="_self">Zhengzhou University<\/a>/);
  assert.match(out, /<a href="\/universities\/jsnu#fees">JSNU<\/a>/);
  assert.match(out, /<a href="\/universities\/nanchang-university">NCU<\/a>/);
});

test('repairUpdateInternalLinks unwraps missing university profile links to avoid 404 internal links', () => {
  const validSlugs = new Set(['zzu']);
  const input =
    '<td><a href="/universities/peking-university"><strong>Peking University</strong></a></td>' +
    '<td><a href="https://eduexpressint.com/universities/nanjing-university">Nanjing University</a></td>' +
    '<td><a href="/universities/zzu">ZZU</a></td>';

  const out = repairUpdateInternalLinks(input, validSlugs);
  assert.equal(
    out,
    '<td><strong>Peking University</strong></td><td>Nanjing University</td><td><a href="/universities/zzu">ZZU</a></td>',
  );
});
