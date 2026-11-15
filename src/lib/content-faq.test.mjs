import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('../../scripts/lib/typescript-source-resolver.mjs', import.meta.url));

const { extractFaqsFromHtml } = await import('./content-faq.ts');

test('extractFaqsFromHtml extracts <details><summary> Q&As cleanly and deduplicates', () => {
  const html = `
    <h2>Overview</h2>
    <p>Some intro paragraph.</p>
    <h2>Frequently asked questions</h2>
    <details>
      <summary>What is the Nanchang University CSC agency number?</summary>
      <p>The official CSC agency code for <strong>Nanchang University</strong> is 10403.</p>
    </details>
    <details>
      <summary>What is the Nanchang University CSC agency number?</summary>
      <p>Duplicate question should be ignored.</p>
    </details>
    <details>
      <summary>When is the 2027 Type B deadline?</summary>
      <p>The published notice sets the deadline at 1 March 2027.</p>
      <ul><li>Submit NCU online application</li><li>Submit CSC portal application</li></ul>
    </details>
    <details>
      <summary>More</summary>
      <p>Too short summary should be skipped.</p>
    </details>
  `;

  const faqs = extractFaqsFromHtml(html);
  assert.equal(faqs.length, 2);
  assert.equal(faqs[0].question, 'What is the Nanchang University CSC agency number?');
  assert.match(faqs[0].answer, /10403/);
  assert.equal(faqs[1].question, 'When is the 2027 Type B deadline?');
  assert.match(faqs[1].answer, /1 March 2027/);
  assert.match(faqs[1].answer, /Submit NCU online application/);
});

test('extractFaqsFromHtml falls back to <h3> Q&As inside FAQ section when no <details> exist', () => {
  const html = `
    <h2>Admission steps</h2>
    <h3>Step 1: Documents</h3>
    <p>Prepare passport and transcripts.</p>
    <h2>Frequently asked questions</h2>
    <h3>Can Bangladeshi students apply for CSC at Chengdu Normal University?</h3>
    <p>Verify current CSC or provincial scholarship allocations directly on cdnu.edu.cn before applying.</p>
    <h2>Next steps</h2>
    <h3>Ready to apply?</h3>
    <p>Contact EduExpress International for free file verification.</p>
  `;

  const faqs = extractFaqsFromHtml(html);
  assert.equal(faqs.length, 1);
  assert.equal(
    faqs[0].question,
    'Can Bangladeshi students apply for CSC at Chengdu Normal University?',
  );
  assert.match(faqs[0].answer, /cdnu\.edu\.cn/);
});

test('extractFaqsFromHtml respects limit and empty input', () => {
  assert.deepEqual(extractFaqsFromHtml(''), []);
  assert.deepEqual(extractFaqsFromHtml(null), []);
  const repeated = Array.from({ length: 5 }, (_, idx) => `
    <details><summary>Valid FAQ Question Number ${idx + 1}?</summary><p>Complete detailed answer number ${idx + 1}.</p></details>
  `).join('\n');
  assert.equal(extractFaqsFromHtml(repeated, 3).length, 3);
});
