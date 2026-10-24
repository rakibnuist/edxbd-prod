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

test('unified search matches levels, language, destination and scholarship text', () => {
  assert.equal(directory.universityMatchesFilters(record, filters({ search: 'China masters English' })), true);
  assert.equal(directory.universityMatchesFilters(record, filters({ search: 'China PhD' })), false);
  const funded = university({ scholarships: [{ status: 'planned', title: 'Merit scholarship', coverage: 'Full tuition' }] });
  assert.equal(directory.universityMatchesFilters(funded, filters({ search: 'China scholarship tuition' })), true);
});

test('unified search must match one program and must not combine different degree/language options', () => {
  assert.equal(directory.universityMatchesFilters(record, filters({ search: 'Bachelor English' })), false);
  assert.equal(directory.universityMatchesFilters(record, filters({ search: 'Engineering March' })), false);
  assert.equal(directory.universityMatchesFilters(record, filters({ search: 'China Masters English' })), true);
  assert.deepEqual(directory.matchingPrograms(record, filters({ search: 'China Masters English' })).map(item => item.name), ['Management']);
});

test('published guide funding routes are informational and must fit the matching program', () => {
  const closed = { status: 'closed', title: 'University scholarship' };
  const uni = university({ scholarships: [closed], programs: [program('Trade', 'Bachelor', ['English'], ['September']), program('Chinese language', 'Language', ['Chinese'], [])], fundingRoutes: [{ title: 'Government scholarship', value: 'CNY 20,000 / year', levels: ['Bachelor'] }] });
  assert.equal(directory.universityMatchesFilters(uni, filters({ scholarship: true, level: 'Bachelor' })), true);
  assert.equal(directory.universityMatchesFilters(uni, filters({ scholarship: true, level: 'Language' })), false);
  assert.equal(uni.scholarships[0].status, 'closed');
  assert.equal(directory.universityMatchesFilters(uni, filters({ search: 'scholarship Bachelor English' })), true);
  assert.equal(directory.universityMatchesFilters(uni, filters({ search: 'scholarships Bachelor English' })), true);
  assert.equal(directory.universityMatchesFilters(uni, filters({ search: 'Language scholarship' })), false);
});

test('a degree mentioned in another scholarship cannot make a different program match a search', () => {
  const uni = university({ programs: [program('Business', 'Bachelor', ['English'], []), program('Trade', 'Master', ['English'], [])], fundingRoutes: [{ title: 'Bachelor Government Scholarship', value: 'CNY 20,000 / year', levels: ['Bachelor'] }, { title: 'Master Government Scholarship', value: 'CNY 30,000 / year', levels: ['Master'] }] });
  assert.deepEqual(directory.matchingPrograms(uni, filters({ search: 'Master English' })).map(item => item.name), ['Trade']);
});

test('tuition summaries format comparable fees without mixing periods, currencies or award values', () => {
  assert.equal(directory.directoryTuitionSummary(['7500 CNY/Year']), 'CNY 7,500 / year');
  assert.equal(directory.directoryTuitionSummary(['CNY 15,000 / year', '18000 RMB/Year']), 'CNY 15,000–18,000 / year');
  assert.equal(directory.directoryTuitionSummary(['CNY 8,000 / semester', 'CNY 15,000 / year']), 'View program fees');
  assert.equal(directory.directoryTuitionSummary(['USD 5,000 / year', 'CNY 15,000 / year']), 'View program fees');
  assert.equal(directory.directoryTuitionSummary(['Approximately CNY 10,000 / year']), 'Approximately CNY 10,000 / year');
  assert.equal(directory.directoryTuitionSummary(['CNY 0 / year']), 'CNY 0 / year');
});

test('CSCA exemption requires explicit sourced evidence on the matching China program', () => {
  const exempt = { ...program('Engineering', 'Bachelor', ['English'], ['September']), sourceUrl: 'https://example.edu/admission', eligibility: ['CSCA exam is not required.'] };
  const required = { ...program('Management', 'Bachelor', ['Chinese'], ['March']), sourceUrl: 'https://example.edu/admission', eligibility: ['CSCA required.'] };
  const uni = university({ programs: [exempt, required] });
  assert.equal(directory.universityMatchesFilters(uni, filters({ cscaFree: true })), true);
  assert.equal(directory.universityMatchesFilters(uni, filters({ cscaFree: true, language: 'Chinese' })), false);
  assert.equal(directory.universityMatchesFilters(university(), filters({ cscaFree: true })), false);
  for (const eligibility of [[], ['English applicants are exempt from Professional Chinese in CSCA.'], ['CSCA may not be required.'], ['CSCA not required for some applicants.']]) {
    assert.equal(directory.programIsCscaFree({ ...exempt, eligibility }), false);
  }
  assert.equal(directory.programIsCscaFree({ ...exempt, sourceUrl: '' }), false);
  assert.equal(directory.universityMatchesFilters({ ...uni, country: 'Malaysia' }, filters({ cscaFree: true })), false);
  const params = directory.writeDirectoryFilters(new URLSearchParams('compare=one'), filters({ cscaFree: true }));
  assert.equal(directory.readDirectoryFilters(params).cscaFree, true);
  assert.equal(directory.writeDirectoryFilters(params, filters()).get('cscaFree'), null);
});

test('intakes use complete month names and ignore source years and study-end months', () => {
  assert.deepEqual(directory.intakeMonths(['Sep 2026 (closed)', 'Feb. or March', 'Jan, Apr, May', 'September 2026 to July 2028', 'September 2026–July 2028']), ['January', 'February', 'March', 'April', 'May', 'September']);
  const uni = university({ programs: [program('Trade', 'Bachelor', ['English'], ['September 2026 (closed) or March 2027 (confirm deadline)'])] });
  assert.equal(directory.universityMatchesFilters(uni, filters({ intake: 'September' })), true);
  assert.equal(directory.universityMatchesFilters(uni, filters({ intake: 'March' })), true);
  assert.equal(directory.universityMatchesFilters(uni, filters({ intake: 'May' })), false);
  assert.equal(directory.readDirectoryFilters(new URLSearchParams('intake=September+2026')).intake, 'September');
  assert.equal(directory.directoryOptions([uni], '').intakes.some(label => /\d|closed|deadline/.test(label)), false);
});
