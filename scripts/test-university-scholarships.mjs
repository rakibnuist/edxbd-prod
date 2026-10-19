import assert from 'node:assert/strict';
import test from 'node:test';
import { scholarshipMatchesProgram, scholarshipReductionLabel } from '../src/lib/university-scholarship-view.ts';

const program = (id, name, level, languages = ['Chinese']) => ({ id, name, level, languages });
const award = overrides => ({ levels: ['Bachelor', 'Master', 'Language'], ...overrides });

test('an explicit programme list prevents cross-matching CLEC degree and major combinations', () => {
  const clec = award({ programNames: ['Chinese Language and Literature', 'International Chinese Language Education'], programIds: ['bachelor-chinese', 'master-teaching'] });
  assert.equal(scholarshipMatchesProgram(clec, program('bachelor-chinese', 'Chinese Language and Literature', 'Bachelor')), true);
  assert.equal(scholarshipMatchesProgram(clec, program('master-teaching', 'International Chinese Language Education', 'Master')), true);
  assert.equal(scholarshipMatchesProgram(clec, program('master-literature', 'Chinese Language and Literature', 'Master')), false);
});

test('degree, teaching language and named programme restrictions must all match', () => {
  const selected = award({ levels: ['Master'], languages: ['Chinese'], programNames: ['Meteorology'] });
  assert.equal(scholarshipMatchesProgram(selected, program('one', 'Meteorology', 'Master')), true);
  assert.equal(scholarshipMatchesProgram(selected, program('two', 'Meteorology', 'Master', ['English'])), false);
  assert.equal(scholarshipMatchesProgram(selected, program('three', 'Meteorology', 'Bachelor')), false);
  assert.equal(scholarshipMatchesProgram(selected, program('four', 'Finance', 'Master')), false);
});

test('a scholar category is never silently treated as a bachelor award', () => {
  assert.equal(scholarshipMatchesProgram(award({ levels: ['Senior scholar'] }), program('one', 'Meteorology', 'Bachelor')), false);
});

test('a fixed-award label never invents a currency or confuses a stipend with tuition', () => {
  assert.match(scholarshipReductionLabel({ tuitionReduction: { type: 'fixed', value: 10000, period: 'year' } }), /currency not specified/);
  assert.doesNotMatch(scholarshipReductionLabel({ tuitionReduction: { type: 'fixed', value: 10000 } }), /CNY/);
  assert.equal(scholarshipReductionLabel({ stipend: 'CNY 3,000 per month' }), '');
  assert.equal(scholarshipReductionLabel({ tuitionReduction: { type: 'percent', value: 50 } }), '50% tuition reduction');
});
