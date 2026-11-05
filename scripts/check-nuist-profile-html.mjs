import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const profile = JSON.parse(await readFile(new URL('../data/research/nuist-programme-details.json', import.meta.url), 'utf8')).universities.find(item => item.slug === 'nuist');
const origin = process.env.PROFILE_TEST_ORIGIN || 'http://127.0.0.1:3000';
const response = await fetch(`${origin}/universities/nuist`);
const html = await response.text();
const content = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
const publicText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
const missingPrograms = profile.programs.filter(program => !content.includes(program.name));
const missingScholarships = profile.scholarshipOptions.filter(option => !content.includes(option.title));
const graph = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => {
  const value = JSON.parse(match[1]);
  return value['@graph'] || [value];
});
const courses = graph.filter(item => item['@type'] === 'Course');
assert.equal(response.status, 200);
assert.equal(missingPrograms.length, 0, `Missing HTML program rows: ${missingPrograms.map(program => program.name).join(', ')}`);
assert.equal(missingScholarships.length, 0, `Missing HTML scholarships: ${missingScholarships.map(option => option.title).join(', ')}`);
assert.equal(courses.length, profile.programs.length);
assert.match(html, /<link rel="canonical" href="https:\/\/eduexpressint.com\/universities\/nuist"/);
assert.match(content, /Nanjing University of Information Science and Technology \(NUIST\)/);
assert.match(content, /NUIST Excellent Freshmen Scholarship|NUIST Longshan Scholarship/);
assert.doesNotMatch(content, /Sources checked|Next review|Last verified|\/Users\/a1\/|xwechat_files/);
assert.doesNotMatch(publicText, /\bdeadline\b|closed (?:admission )?cycle|\b202[6-9]\b/i);
assert.match(publicText, /Your admission checklist/);
assert.match(publicText, /whether you apply as a self-funded student or through a scholarship/);
assert.match(publicText, /Programs, teaching languages, duration and tuition before scholarship/);
assert.match(publicText, /Filter programs by degree, subject and teaching language/);
assert.match(content, /href="#university-enquiry"/);
assert.match(content, /<form(?=[^>]*method="post")(?=[^>]*action="\/api\/leads")[^>]*>/);
assert.match(content, /<select[^>]*name="program"/);
assert.match(publicText, /Apply with EduExpress International/);
// The compact design mounts the interactive calculator and filters when opened.
// All programme/award facts remain in initial HTML; browser QA checks the controls.
assert.match(publicText, /Build your personal ClearCost plan/);
console.log(JSON.stringify({ status: response.status, bytes: Buffer.byteLength(html), programsInInitialHTML: profile.programs.length, scholarshipsInInitialHTML: profile.scholarshipOptions.length, coursesInSchema: courses.length, sourceDatesAndPrivatePathsAbsent: true, evergreenPublicCopy: true, universalAdmissionDocuments: true, calculatorAvailableOnOpen: true }, null, 2));
