import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import ts from 'typescript';

// Strip types for Node's test runner without loading the server-only record loader.
const source = await readFile(new URL('./university-directory.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const directory = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const program = (name, level, languages, intakes, subject = name, status = 'active') => ({ name, level, languages, intakes, subject, status, eligibility: [] });
const university = (overrides = {}) => ({ id: 'one', slug: 'one', name: 'One University', aliases: ['OU'], isActive: true, country: 'China', city: 'Nanjing', programs: [], degree: ['Bachelor'], taught: ['English'], intake: ['September'], details: { majors: ['Engineering'] }, scholarships: [], ...overrides });
const filters = (overrides = {}) => ({ ...directory.emptyDirectoryFilters, ...overrides });
const record = university({ programs: [program('Engineering', 'Bachelor', ['Chinese'], ['September']), program('Management', 'Master', ['English'], ['March']), program('Medicine', 'Bachelor', ['English'], ['March'], 'Medicine', 'paused')] });

test('academic filters must match one non-paused program', () => {
  assert.equal(directory.universityMatchesFilters(record, filters({ level: 'Bachelor', language: 'English' })), false);
  assert.equal(directory.universityMatchesFilters(record, filters({ subject: 'Engineering', intake: 'March' })), false);
  assert.equal(directory.universityMatchesFilters(record, filters({ subject: 'Medicine' })), false);
  assert.equal(directory.universityMatchesFilters(record, filters({ level: 'Master', language: 'English', intake: 'March', subject: 'Management' })), true);
});

test('study planner levels match authentic catalogue label variants without crossing degrees', () => {
  const variants = university({ programs: [program('Computing', "Master's", ['English'], []), program('Research', 'Doctoral', ['Chinese'], [])] });
  assert.equal(directory.universityMatchesFilters(variants, filters({ level: 'Master', language: 'English' })), true);
  assert.equal(directory.universityMatchesFilters(variants, filters({ level: 'Master', language: 'Chinese' })), false);
  assert.equal(directory.universityMatchesFilters(variants, filters({ level: 'PhD', language: 'Chinese' })), true);
  assert.equal(directory.universityMatchesFilters(variants, filters({ level: 'Bachelor' })), false);
  assert.equal(directory.universityMatchesFilters(university({ degree: ['Bachelor’s'] }), filters({ level: 'Bachelor' })), true);
});

test('legacy fallback applies only when no program rows exist', () => {
  assert.equal(directory.universityMatchesFilters(university(), filters({ level: 'Bachelor', language: 'English', subject: 'Engineering', intake: 'September' })), true);
  assert.equal(directory.universityMatchesFilters(university({ programs: [program('Engineering', 'Master', ['Chinese'], ['March'])] }), filters({ level: 'Bachelor' })), false);
  const pausedOnly = university({ programs: [program('Medicine', 'Bachelor', ['English'], ['March'], 'Medicine', 'paused')] });
  assert.equal(directory.directoryOptions([pausedOnly], '').languages.length, 0);
});

test('inactive and paused options are excluded; aliases remain searchable', () => {
  assert.equal(directory.universityMatchesFilters(university({ isActive: false }), filters()), false);
  assert.equal(directory.universityMatchesFilters(record, filters({ search: 'ou' })), true);
  assert.equal(directory.directoryOptions([record], '').subjects.includes('Medicine'), false);
});

test('recorded scholarship filter excludes closed options and includes planned records', () => {
  assert.equal(directory.universityMatchesFilters(university({ scholarships: [{ status: 'closed' }] }), filters({ scholarship: true })), false);
  assert.equal(directory.universityMatchesFilters(university({ scholarships: [{ status: 'planned' }] }), filters({ scholarship: true })), true);
});

test('filter URL state round-trips and resets pagination while preserving the shortlist', () => {
  const selected = filters({ subject: 'Engineering', language: 'English', scholarship: true, sort: 'city' });
  const params = directory.writeDirectoryFilters(new URLSearchParams('country=China&search=old&compare=one&limit=24'), selected);
  assert.equal(params.get('country'), null);
  assert.equal(params.get('search'), null);
  assert.equal(params.get('compare'), 'one');
  assert.equal(params.get('limit'), null);
  assert.deepEqual(directory.readDirectoryFilters(params), selected);
});

test('comparison accepts only three distinct known active records', () => {
  const records = ['one', 'two', 'three', 'four'].map(slug => university({ slug }));
  records.push(university({ slug: 'inactive', isActive: false }));
  assert.deepEqual(directory.selectedComparisonSlugs(new URLSearchParams('compare=one,inactive,two,invalid,one,three,four'), records), ['one', 'two', 'three']);
});
