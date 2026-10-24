import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { universityGuideIsIndexable } from '../src/lib/university-guide-indexing.ts';
import { universityIsIndexable } from '../src/lib/university-governance.ts';
const ahut = JSON.parse(await readFile('data/research/ahut-official-programmes.json', 'utf8')).universities[0];
const now = new Date('2026-10-23T12:00:00Z');

test('the explicitly published, sourced AHUT guide can be indexed independently of admission status', () => {
  const snapshot = structuredClone(ahut);
  assert.equal(universityGuideIsIndexable(ahut, now), true);
  assert.equal(universityIsIndexable({ verificationStatus: 'under_verification' }, now), false);
  assert.deepEqual(ahut, snapshot);
  assert.equal(ahut.internal.programStatus, 'planned');
  assert.ok(ahut.scholarshipOptions.some(option => option.status === 'closed'));
});
test('a publication flag alone cannot index a thin or unsourced guide', () => {
  assert.equal(universityGuideIsIndexable({ ...ahut, programs: [] }, now), false);
  assert.equal(universityGuideIsIndexable({ ...ahut, programs: [null] }, now), false);
  assert.equal(universityGuideIsIndexable({ ...ahut, overview: '' }, now), false);
  assert.equal(universityGuideIsIndexable({ ...ahut, programs: ahut.programs.map(program => ({ ...program, sourceUrl: 'https://unrelated.example/course' })) }, now), false);
  assert.equal(universityGuideIsIndexable({ ...ahut, programs: ahut.programs.map(program => ({ ...program, qualifications: [], documents: [] })) }, now), false);
});
test('drafts, missing provenance, a future research date and malformed payloads remain excluded', () => {
  for (const value of [null, {}, { ...ahut, internal: {} }, { ...ahut, internal: { searchPublication: { ...ahut.internal.searchPublication, index: false } } }, { ...ahut, internal: { searchPublication: { ...ahut.internal.searchPublication, sources: ['https://unrelated.example/a', 'https://unrelated.example/b'] } } }, { ...ahut, internal: { searchPublication: { ...ahut.internal.searchPublication, researchedAt: '2030-01-01' } } }]) assert.equal(universityGuideIsIndexable(value, now), false);
});
