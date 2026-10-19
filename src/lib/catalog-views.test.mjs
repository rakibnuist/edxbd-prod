import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import ts from 'typescript';

// Strip types for Node's test runner; load clear-cost the same way and inline it.
const transpile = async name => ts.transpileModule(await readFile(new URL(name, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const dataUrl = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const clearCostUrl = dataUrl(await transpile('./clear-cost.ts'));
const views = await import(dataUrl((await transpile('./catalog-views.ts')).replace("'./clear-cost'", `'${clearCostUrl}'`)));

const now = new Date(2026, 9, 20, 12);

test('deadlines: explicit closed text, day-first and month-first dates', () => {
  assert.equal(views.deadlineHasPassed('31 May 2026 (closed; self-funded routes)', now), true);
  assert.equal(views.deadlineHasPassed('30th June 2027', now), false);
  assert.equal(views.deadlineHasPassed('May 30th, 2027 (Depends on Seats)', now), false);
  assert.equal(views.deadlineHasPassed('June 30th, 2025 (Depends on Seats)', now), true);
  assert.equal(views.deadlineHasPassed('20 October 2026', now), false, 'open until the end of the stated day');
  assert.equal(views.deadlineHasPassed('Not specified', now), false);
  assert.equal(views.deadlineHasPassed(undefined, now), false);
});

test('scholarship categories follow the awarding body', () => {
  assert.equal(views.scholarshipCategory('Chinese Government Scholarship'), 'Chinese Government (CSC)');
  assert.equal(views.scholarshipCategory('Zhejiang Provincial Government Scholarship'), 'Provincial or city government');
  assert.equal(views.scholarshipCategory('Belt and Road International Students Scholarship'), 'Belt and Road / ministry');
  assert.equal(views.scholarshipCategory('International Chinese Language Teachers Scholarship — Language'), 'Chinese language (CLEC)');
  assert.equal(views.scholarshipCategory('NPU President Scholarship (All Years)'), 'University scholarship');
});

test('program rows only price one explicit yearly CNY figure', () => {
  const program = (tuition, extra = {}) => ({ level: 'Bachelor', name: 'Engineering', languages: ['English'], intakes: [], eligibility: [], status: 'active', tuition, ...extra });
  const university = { slug: 'u', name: 'U', city: 'Nanjing', isActive: true, programs: [program('CNY 15,000 / year'), program('10,000 – 15,000 CNY/Year'), program('Free (1st Year)'), program('18000 CNY/Year (Original)', { level: "Master's" }), program('CNY 9,000 / year', { status: 'paused' })], scholarships: [] };
  const rows = views.toProgramRows([university, { ...university, slug: 'inactive', isActive: false }], now);
  assert.deepEqual(rows.map(row => row.annualTuitionCny), [15000, null, null, 18000]);
  assert.equal(rows[3].level, 'Master');
});

test('fees: categories and first-year amounts', () => {
  assert.equal(views.feeCategory('Tuition Fees'), null);
  assert.equal(views.feeCategory('Hostel Fee'), 'accommodation');
  assert.equal(views.feeCategory('Visa Extension Fees'), 'residence');
  assert.equal(views.feeCategory('Medical Check Up'), 'medical');
  const rows = views.toFeeRows({ fees: [
    { item: 'Application Fee', cost: '400 CNY' },
    { item: 'Insurance Fee', cost: '800 CNY/Year' },
    { item: 'Medical Check Up', cost: '400 – 800 CNY (1st Year only)' },
    { item: 'Tuition Fee', cost: '20000 CNY/Year' },
  ] });
  assert.deepEqual(rows.map(row => [row.category, row.firstYearCny]), [['application', 400], ['insurance', 800], ['medical', null]]);
});

test('first-year estimate totals only when every recorded item is explicit', () => {
  const fee = (category, firstYearCny) => ({ item: category, cost: '', category, firstYearCny });
  const clear = views.firstYearEstimate({ annualTuitionCny: 20000 }, [fee('application', 400), fee('insurance', 800), fee('accommodation', 6000)]);
  assert.equal(clear.total, 27200);
  assert.deepEqual(clear.missing, ['Registration fee', 'Medical check', 'Residence permit']);
  const unclear = views.firstYearEstimate({ annualTuitionCny: 20000 }, [fee('accommodation', 6000), fee('accommodation', 9000), fee('medical', null)]);
  assert.equal(unclear.total, null);
  assert.deepEqual(unclear.unclear, ['Accommodation', 'Medical check']);
  assert.equal(views.firstYearEstimate({ annualTuitionCny: null }, []).total, null);
});
