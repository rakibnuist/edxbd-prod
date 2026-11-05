import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { universityGuideIsIndexable } from '../src/lib/university-guide-indexing.ts';
dotenv.config({path:'.env.local',quiet:true});
dotenv.config({quiet:true});
if (!process.env.DATABASE_URL?.startsWith('file:')) throw new Error('Local SQLite verification only.');
const db=new PrismaClient();
const base=process.env.MBBS_GUIDE_BASE_URL || 'http://127.0.0.1:3000';
const manifest=JSON.parse(await readFile('data/research/mbbs-directory/import-manifest.json','utf8'));
const plain=html=>html.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').replaceAll('&amp;','&').replaceAll('&#x27;',"'");
async function get(path) { const response=await fetch(new URL(path,base),{signal:AbortSignal.timeout(60000)});assert.equal(response.status,200,path);return response.text(); }
try {
 const rows=await db.university.findMany({where:{slug:{in:manifest.entries.map(e=>e.slug)}},include:{programs:true,scholarships:true}});
 assert.equal(rows.length,45);assert.equal(new Set(rows.map(u=>u.id)).size,45);
 const campaign=await db.intakeCampaign.findUnique({where:{slug:'university-profile-details'}});
 const profiles=JSON.parse(campaign.contentJson).universities;
 const backupNames=(await readdir('data/research/backups')).filter(name=>name.startsWith('mbbs-universities-')).sort();
 const original=JSON.parse(await readFile(`data/research/backups/${backupNames[0]}`,'utf8'));
 for(const prior of original.universities) {
   const now=rows.find(row=>row.id===prior.id);assert(now,`Preserve identity: ${prior.name}`);
   for(const course of prior.programs.filter(p=>!/clinical medicine|\bmbbs\b/i.test(p.name))) assert(now.programs.some(p=>p.id===course.id&&p.name===course.name),`Preserve course: ${course.name}`);
 }
 for(const entry of manifest.entries) {
   const row=rows.find(row=>row.slug===entry.slug);assert(row.isActive);
   assert(row.logo?.startsWith('/images/'),`${entry.name}: local university emblem`);
   await readFile(`public${row.logo}`);
   const profile=profiles.find(p=>p.slug===entry.slug);assert(profile?.internal?.workbookImport);
   const course=profile.programs.find(p=>p.id===`mbbs-workbook-${entry.slug}`);assert(course,entry.slug);
   const databaseCourse=row.programs.find(p=>p.name===course.name && p.level==='Bachelor');assert(databaseCourse);
   if(course.languages.includes('Chinese')) assert.doesNotMatch(databaseCourse.subject || '',/MBBS/);
   const tuition=course.fees.find(fee=>fee.key==='tuition');
   if(entry.feeBasis==='owner-planning-estimate') {assert.equal(tuition.amount,undefined);assert.match(tuition.displayAmount,/estimate/);}
   else {assert(Number.isFinite(tuition.amount));assert(course.sourceUrl?.startsWith('https://'));}
   for(const award of profile.scholarshipOptions || []) if(/Study Grant|Entrance Scholarship|WMU|CQMU|FJMU/i.test(award.title)) assert.equal(award.tuitionReduction,undefined,`${award.title}: cash support cannot become an upfront waiver`);
 }
 const [directory,sitemap]=await Promise.all([get('/universities?country=China&search=medicine&limit=500'),get('/sitemaps/universities.xml')]);
 const directoryText=plain(directory);
 for(const entry of manifest.entries) {assert(directoryText.includes(entry.name),`Visible directory name: ${entry.name}`);assert(directory.includes(`/universities/${entry.slug}`));}
 assert.doesNotMatch(directory,/workbookImport|originalProfile|source-corrections|\/Users\/a1\/Downloads/);
 const titles=new Set();let indexed=0;
 // A bounded crawl checks the live route and its crawler-facing content for every imported institution.
 for(let start=0;start<manifest.entries.length;start+=3) {
   await Promise.all(manifest.entries.slice(start,start+3).map(async entry=>{
    const html=await get(`/universities/${entry.slug}`);const profile=profiles.find(p=>p.slug===entry.slug);const text=plain(html);
    const title=plain(html.match(/<title>(.*?)<\/title>/s)[1]);assert(!titles.has(title));titles.add(title);
    assert.equal((title.match(/EduExpress International/g)||[]).length,1);
    assert.equal((html.match(/<h1\b/g)||[]).length,1);
    assert(html.includes(`rel="canonical" href="https://eduexpressint.com/universities/${entry.slug}"`));
    assert(text.includes(entry.name));assert(text.includes(entry.programme));
    assert(html.includes('CollegeOrUniversity'));assert(html.includes('BreadcrumbList'));assert(html.includes('"@type":"Course"'));
    assert(html.includes('href="/mbbs-in-china-bangladesh"'));
    assert.doesNotMatch(html,/workbookImport|originalProfile|source-corrections|\/Users\/a1\/Downloads/);
    const eligible=universityGuideIsIndexable(profile);if(eligible) indexed++;
    assert(html.includes(`name="robots" content="${eligible?'index':'noindex'}, follow"`),`Publication rules: ${entry.slug}`);
    assert.equal(sitemap.includes(`<loc>https://eduexpressint.com/universities/${entry.slug}</loc>`),eligible,`Sitemap parity: ${entry.slug}`);
   }));
 }
 console.log(`PASS: 45 distinct database records and SSR profiles, preserved existing programmes, estimate isolation, scholarship calculations, canonical titles, schema, medical links and sitemap parity. ${indexed} researched guides currently qualify for indexing.`);
} finally {await db.$disconnect();}
