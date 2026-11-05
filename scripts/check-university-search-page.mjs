/** Check actual local HTML and both sitemaps; no CRM writes or external requests. */
import assert from 'node:assert/strict';
const origin = 'http://127.0.0.1:3000';
const get = async path => { const res = await fetch(origin + path); assert.equal(res.status, 200, path); return res.text(); };
const ahut = await get('/universities/ahut');
assert.match(ahut, /<meta name="robots" content="index, follow"/);
assert.match(ahut, /<link rel="canonical" href="https:\/\/eduexpressint.com\/universities\/ahut"/);
assert.match(ahut, /<title>Anhui University of Technology: Fees &amp; Scholarships \| EduExpress International<\/title>/);
assert.equal((ahut.match(/<h1\b/g) || []).length, 1);
for (const id of ['overview', 'programs', 'scholarships', 'fees', 'admission', 'documents', 'rankings']) {
  assert.ok(ahut.includes('href="#' + id + '"'), 'Crawlable link: ' + id);
  assert.ok(ahut.includes('id="' + id + '"'), 'Stable section: ' + id);
}
assert.ok(!/<section\b[^>]*id="(?:overview|programs|scholarships|fees|admission|documents|rankings)"[^>]*\shidden(?:[\s=>])/.test(ahut), 'Guide sections must remain visible');
assert.ok(ahut.includes('International Economics and Trade'));
assert.match(ahut, /<table\b/);
assert.match(ahut, /<form\b[^>]*method="post"/);
assert.ok(ahut.includes('href="/study-in-china-from-bangladesh"'));
assert.ok(ahut.includes('href="/china-student-visa-bangladesh"'));
const ld = [...ahut.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1])).find(value => value['@graph']?.some(item => item['@type'] === 'CollegeOrUniversity'));
assert.ok(ld, 'University semantic graph');
assert.ok(ld['@graph'].some(item => item['@type'] === 'CollegeOrUniversity'));
assert.equal(ld['@graph'].filter(item => item['@type'] === 'Course').length, 8);
for (const course of ld['@graph'].filter(item => item['@type'] === 'Course')) assert.ok(ahut.includes('id="' + course['@id'].split('#')[1] + '"'), 'Visible course anchor: ' + course.name);
const thin = await get('/universities/tsinghua-university');
assert.match(thin, /<meta name="robots" content="noindex, follow"/);
for (const path of ['/sitemap.xml', '/sitemaps/universities.xml']) {
  const xml = await get(path);
  assert.ok(xml.includes('<loc>https://eduexpressint.com/universities/ahut</loc>'), path);
  assert.ok(!xml.includes('<loc>https://eduexpressint.com/universities/tsinghua-university</loc>'), 'Thin profile excluded: ' + path);
}
console.log('Search-page checks passed: full-name title, canonical, index eligibility, visible sections, complete semantic catalogue, form, related guide links and consistent sitemaps.');
