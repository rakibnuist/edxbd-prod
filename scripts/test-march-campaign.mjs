import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { publicMarchCatalogue, filterMarchCatalogue, sortMarchCatalogue } from '../src/lib/march-campaign-catalogue.ts';
import { marchEnquiryPayload, validateMarchEnquiry, emptyMarchEnquiry } from '../src/lib/march-campaign-enquiry.ts';
const fields = { academicLevel: 'HSC / A Level completed', result: 'HSC GPA 4.50', route: 'Chinese language', name: ' Campaign QA Student ', phone: '+880 1700 000000', email: 'QA@example.invalid ', consent: true };
const context = { consentTimestamp: '2026-10-24T00:00:00.000Z', utm: { utm_source: 'facebook', utm_campaign: 'spring_test' }, trackingConsent: false, eventId: 'test_march_lead' };
test('qualification and contact validation rejects incomplete/invalid data without inferring admission eligibility', () => {
  assert.equal(Object.keys(validateMarchEnquiry(emptyMarchEnquiry)).length, 7);
  assert.deepEqual(validateMarchEnquiry(fields), {});
  for (const patch of [{email:'bad@address'}, {phone:'123'}, {phone:'017<script>'}, {consent:false}, {academicLevel:'invented'}, {route:'unsupported'}]) assert.ok(Object.keys(validateMarchEnquiry({...fields,...patch})).length > 0);
});
test('lead preserves the chosen institution, programme, intake, qualifications and attribution', () => {
  const payload = marchEnquiryPayload(fields, { ...context, university: 'HUST', program: 'Chinese Language' });
  assert.equal(payload.program, 'HUST — Chinese Language');
  assert.equal(payload.assessment.subject, 'HUST — Chinese Language');
  assert.equal(payload.assessment.academicResults, fields.result);
  assert.equal(payload.assessment.intake, 'March 2027');
  assert.equal(payload.source, 'meta_china_march_2027');
  assert.equal(payload.email, 'qa@example.invalid');
  assert.equal(payload.name, 'Campaign QA Student');
  assert.equal(payload.consentTimestamp, context.consentTimestamp);
  assert.equal(payload.metaEventId, context.eventId);
  assert.equal(payload.trackingConsent, false);
  assert.deepEqual(payload.utm, context.utm);
});
test('organic visitors and undecided students retain an honest enquiry context', () => {
  const payload = marchEnquiryPayload({...fields,route:'Help me choose a route'}, {...context,utm:{}});
  assert.equal(payload.source,'china_march_2027_landing');
  assert.equal(payload.program,'Help me choose a route');
  assert.equal(payload.leadType,'campaign_assessment');
});
test('researched costs retain correct billing periods and do not republish preliminary fee claims', async () => {
  const data=JSON.parse(await readFile(new URL('../data/research/china-march-2027-landing.json',import.meta.url),'utf8'));
  assert.equal(data.examples.find(item=>item.id==='hust-language').tuition,'CNY 8,000');
  assert.equal(data.examples.find(item=>item.id==='hit-foundation').tuition,'CNY 12,300');
  assert.match(data.examples.find(item=>item.id==='sjtu-language').start,/ফেব্রুয়ারি/);
  for(const example of data.examples) { assert.ok(data.research.sources.some(source=>source.id===example.id)); assert.ok(example.period); }
  assert.equal(data.examples.some(item=>item.route==='degree'),false);
});

test('all seventeen institutions have real logos and only researched ranking numbers are published', async () => {
 const data=JSON.parse(await readFile(new URL('../data/research/china-march-2027-landing.json',import.meta.url),'utf8'));
 const catalogue=publicMarchCatalogue(data.universities);
 assert.equal(catalogue.length,17);
 assert.equal(catalogue.reduce((n,u)=>n+u.programmes.length,0),20);
 for(const university of catalogue){
   assert.ok((await readFile(new URL('../public'+university.logo,import.meta.url))).length>100);
   if (university.ranking) assert.ok(university.ranking.value.startsWith(university.ranking.scope));
   if (university.ranking) assert.equal(university.ranking.publisher,'ShanghaiRanking');
   assert.equal(university.ranking?.year,undefined);assert.equal(university.ranking?.sourceUrl,undefined);
   for(const programme of university.programmes) assert.ok(programme.majors.length&&programme.tuition&&programme.scholarship&&programme.feeBasis);
 }
 assert.match(catalogue.find(u=>u.acronym==='CSTU').ranking.value,/private/);
});
test('search and programme category must match the same course route', async () => {
 const data=JSON.parse(await readFile(new URL('../data/research/china-march-2027-landing.json',import.meta.url),'utf8'));
 const catalogue=publicMarchCatalogue(data.universities);
 assert.equal(filterMarchCatalogue(catalogue,'','all').length,17);
 assert.equal(filterMarchCatalogue(catalogue,'','foundation').length,12);
 assert.equal(filterMarchCatalogue(catalogue,'','bachelor').length,4);
 assert.equal(filterMarchCatalogue(catalogue,'','masters').length,1);
 assert.equal(filterMarchCatalogue(catalogue,'','language').length,2);
 assert.equal(filterMarchCatalogue(catalogue,'petroleum','foundation')[0].acronym,'XSYU');
 assert.equal(filterMarchCatalogue(catalogue,'hust','language')[0].programmes.length,1);
 assert.equal(filterMarchCatalogue(catalogue,'hust physics','language').length,0);
 assert.equal(filterMarchCatalogue(catalogue,'no-such-university','all').length,0);
});

test('PDF costs preserve bundled amounts, distinct preparation courses and post-arrival award timing', async () => {
 const data=JSON.parse(await readFile(new URL('../data/research/china-march-2027-landing.json',import.meta.url),'utf8'));
 const programme=code=>data.universities.find(u=>u.acronym===code).programmes[0];
 assert.equal(programme('CQJTU').tuition,'CNY 6,000');assert.match(programme('CQJTU').tuitionLabel,/hostel/);
 assert.equal(programme('CQJTU').scholarshipTiers.length,3);assert.ok(programme('CQJTU').majors.includes('Network and New Media'));
 const hit=data.universities.find(u=>u.acronym==='HIT').programmes;
 assert.equal(hit.length,1);assert.equal(hit[0].tuition,'CNY 7,300');assert.ok(data.research.omittedCampaignRoutes.some(p=>p.tuition==='CNY 12,300'));
 assert.match(programme('CSTU').costItems[2].note,/not an extra/);
 assert.match(programme('WMU').scholarshipConditions,/Full tuition/);assert.equal(programme('WMU').professionalNote,'');
 assert.equal(data.universities.find(u=>u.acronym==='HBAFA').ranking,null);
 assert.equal(data.universities.find(u=>u.acronym==='WZU').programmes.length,2);
 assert.equal(programme('HDU').scholarshipTiers.length,3);
 assert.equal(data.research.attachedProjectPdf.pages,16);assert.ok(data.research.attachedProjectPdf.sha256);
});

 test('sorting preserves ranking scope, numeric fee order, filtering and source order', async () => {
 const data=JSON.parse(await readFile(new URL('../data/research/china-march-2027-landing.json',import.meta.url),'utf8'));
 const catalogue=publicMarchCatalogue(data.universities);
 const original=catalogue.map(u=>u.id);
 assert.equal(sortMarchCatalogue(catalogue,'world-ranking')[0].acronym,'SJTU');
 assert.equal(sortMarchCatalogue(catalogue,'china-ranking')[0].acronym,'CQJTU');
 assert.equal(sortMarchCatalogue(catalogue,'fees-low')[0].acronym,'WZU');
 assert.equal(sortMarchCatalogue(catalogue,'fees-high')[0].acronym,'NJIT');
 assert.equal(sortMarchCatalogue(catalogue,'name')[0].acronym,'CSTU');
 assert.deepEqual(catalogue.map(u=>u.id),original);
 const medical=filterMarchCatalogue(catalogue,'cqmu','bachelor');
 assert.equal(sortMarchCatalogue(medical,'fees-low')[0].programmes[0].tuition,'CNY 30,000');
 });
 test('bachelor highlights retain all award tiers and owner-supplied new pathway details', async () => {
 const data=JSON.parse(await readFile(new URL('../data/research/china-march-2027-landing.json',import.meta.url),'utf8'));
 for(const university of data.universities)for(const p of university.programmes)assert.ok(p.fundingStage&&p.fundingHighlight);
 const find=code=>data.universities.find(u=>u.acronym===code).programmes[0];
 assert.match(find('CQJTU').fundingHighlight,/100% tuition.*1,000/);
 assert.equal(find('HIT').scholarshipTiers.length,4);
 assert.match(find('XSYU').fundingHighlight,/1,500/);
 assert.equal(find('SDUT').majorGroups[0].majors.length,8);
 assert.equal(find('SDUT').majorGroups[1].majors.length,2);
 assert.match(find('SDUT').csca,/required/);
 assert.ok(find('SDUT').costItems.some(item=>item.amount==='CNY 5,200 / year'));
 assert.match(find('CQMU').scholarshipConditions,/30%/);
 assert.equal(data.universities.find(u=>u.acronym==='CQMU').programmes.length,2);
 });
