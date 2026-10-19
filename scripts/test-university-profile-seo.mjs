import assert from 'node:assert/strict';
import test from 'node:test';
import { universityProfileSeo, universityProfileStructuredData, universitySearchIdentity } from '../src/lib/university-profile-seo.ts';
import { universityIsIndexable, universityVerificationErrors } from '../src/lib/university-governance.ts';

const nuist = {
  name: 'Nanjing University of Information Science and Technology', slug: 'nuist',
  city: 'Nanjing', country: 'China', aliases: ['NUIST', 'Nanjing University of Information Science and Technology (NUIST)'],
  logo: '/images/nuist-logo.webp',
};
const program = (id, name, level, languages = ['English']) => ({ id, name, level, languages, duration: '4 years', qualifications: [], languageRequirements: [], documents: [], fees: [], notes: [] });

test('NUIST search title is concise and its description identifies the full university', () => {
  const seo = universityProfileSeo(nuist);
  assert.equal(seo.title, 'NUIST: Fees, Scholarships & Programs');
  assert.match(seo.description, /Study at Nanjing University of Information Science and Technology \(NUIST\)/);
  assert.match(seo.description, /Nanjing, China/);
  assert.equal(seo.canonical, 'https://eduexpressint.com/universities/nuist');
});

test('only recorded acronyms are used; existing names are never duplicated', () => {
  assert.equal(universitySearchIdentity({ name: 'Example University', aliases: [] }).shortName, 'Example University');
  assert.equal(universitySearchIdentity({ name: 'Example University', aliases: ['Other university name'] }).acronym, undefined);
  assert.equal(universitySearchIdentity({ name: 'Example University (EU)', aliases: ['EU'] }).displayName, 'Example University (EU)');
});

test('the semantic catalogue covers every supplied level, rather than a legacy four-course subset', () => {
  const programs = [program('bachelor', 'Atmospheric Science', 'Bachelor'), program('masters', 'Meteorology', 'Master'), program('phd', 'Computer Science and Technology', 'PhD'), program('language', 'Chinese Language', 'Language', ['Chinese'])];
  const graph = universityProfileStructuredData(nuist, programs)['@graph'];
  const courses = graph.filter(item => item['@type'] === 'Course');
  assert.equal(courses.length, programs.length);
  assert.deepEqual(courses.map(item => item.educationalLevel), ['Bachelor', 'Master', 'PhD', 'Language']);
  const institution = graph.find(item => item['@type'] === 'CollegeOrUniversity');
  assert.equal(institution.hasCourse.length, programs.length);
  assert.deepEqual(institution.alternateName, nuist.aliases);
});

test('duplicate course rows are collapsed, but different languages remain distinct', () => {
  const graph = universityProfileStructuredData(nuist, [program('a', 'Computer Science', 'Bachelor'), program('b', 'Computer Science', 'Bachelor'), program('c', 'Computer Science', 'Bachelor', ['Chinese'])])['@graph'];
  assert.equal(graph.filter(item => item['@type'] === 'Course').length, 2);
});

test('schema preserves the publisher and canonical identity without inventing offers or review claims', () => {
  const graph = universityProfileStructuredData(nuist, [program('bachelor', 'Atmospheric Science', 'Bachelor')])['@graph'];
  const page = graph.find(item => item['@type'] === 'WebPage');
  const institution = graph.find(item => item['@type'] === 'CollegeOrUniversity');
  assert.equal(page.publisher['@id'], 'https://eduexpressint.com/#organization');
  assert.equal(page.mainEntity['@id'], institution['@id']);
  assert.equal(institution.logo, 'https://eduexpressint.com/images/nuist-logo.webp');
  const json = JSON.stringify(graph);
  for (const forbidden of ['Offer', 'aggregateRating', 'dateModified', 'lastVerifiedAt', 'sourceUrl', 'sameAs']) assert.ok(!json.includes(`"${forbidden}"`), forbidden);
});

test('breadcrumb schema follows the visible home, directory and university path', () => {
  const breadcrumb = universityProfileStructuredData(nuist, [])['@graph'].find(item => item['@type'] === 'BreadcrumbList');
  assert.deepEqual(breadcrumb.itemListElement.map(item => item.name), ['Home', 'Universities', nuist.name]);
  assert.equal(breadcrumb.itemListElement[2].item, 'https://eduexpressint.com/universities/nuist');
});

test('adding an authentic programme catalogue does not bypass verification or expiry gates', () => {
  const complete = { verificationStatus: 'verified', officialUrl: 'https://www.nuist.edu.cn/', sourceUrls: ['https://gjy.nuist.edu.cn/'], lastVerifiedAt: '2026-10-19', verificationExpiresAt: '2027-01-19' };
  const now = new Date('2026-10-19T00:00:00Z');
  assert.equal(universityIsIndexable({ ...complete, verificationStatus: 'under_verification' }, now), false);
  assert.equal(universityIsIndexable({ ...complete, verificationExpiresAt: '2026-01-01' }, now), false);
  assert.equal(universityIsIndexable(complete, now), true);
  assert.ok(universityVerificationErrors({ ...complete, programs: [] }, now).includes('Add the recognition or accreditation source.'));
  assert.ok(universityVerificationErrors({ ...complete, programs: [] }, now).includes('Add at least one active program.'));
});
