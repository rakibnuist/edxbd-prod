import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { filterProgramRows, programFilterChoices } from '../src/lib/university-program-filters.ts';

const rows = [
  { id: 'atmosphere', name: 'Atmospheric Science', school: 'School of Atmospheric Sciences', languages: ['English', 'Chinese'] },
  { id: 'computer', name: 'Computer Science and Technology', school: 'School of Computer Science', languages: ['English'] },
  { id: 'business', name: 'Business Administration', school: 'Business School', languages: ['Chinese'] },
];
const empty = { major: '', medium: '', query: '' };

test('all choices preserve the complete level catalogue', () => {
  assert.deepEqual(filterProgramRows(rows, empty), rows);
});

test('bilingual majors match either offered medium without duplicate results', () => {
  assert.deepEqual(filterProgramRows(rows, { ...empty, medium: 'English' }).map(row => row.id), ['atmosphere', 'computer']);
  assert.deepEqual(filterProgramRows(rows, { ...empty, medium: 'Chinese' }).map(row => row.id), ['atmosphere', 'business']);
});

test('major, language and school search intersect rather than override one another', () => {
  assert.deepEqual(filterProgramRows(rows, { major: 'Atmospheric Science', medium: 'Chinese', query: 'school atmosphere' }), []);
  assert.deepEqual(filterProgramRows(rows, { major: 'Atmospheric Science', medium: 'Chinese', query: 'school atmospheric' }).map(row => row.id), ['atmosphere']);
  assert.deepEqual(filterProgramRows(rows, { major: 'Business Administration', medium: 'English', query: '' }), []);
});

test('search ignores case and extra whitespace and requires every word', () => {
  assert.deepEqual(filterProgramRows(rows, { ...empty, query: '  COMPUTER  technology ' }).map(row => row.id), ['computer']);
  assert.deepEqual(filterProgramRows(rows, { ...empty, query: 'computer business' }), []);
});

test('native dropdown choices are sorted, unique and exclude blank media', () => {
  assert.deepEqual(programFilterChoices(['English', 'Chinese', ' english ', '', '  ', 'Chinese']), ['Chinese', 'English']);
});

test('NUIST catalogue retains every option while medium choices reflect actual programme languages', async () => {
  const payload = JSON.parse(await readFile(new URL('../data/research/nuist-programme-details.json', import.meta.url), 'utf8'));
  const programs = payload.universities.find(row => row.slug === 'nuist').programs;
  assert.equal(filterProgramRows(programs, empty).length, 155);
  for (const level of ['Bachelor', 'Master', 'PhD', 'Language']) {
    const levelRows = programs.filter(row => row.level === level);
    for (const medium of ['English', 'Chinese']) {
      const filtered = filterProgramRows(levelRows, { ...empty, medium });
      assert.equal(filtered.length, levelRows.filter(row => row.languages.includes(medium)).length);
      assert.ok(filtered.every(row => row.level === level));
    }
  }
});
