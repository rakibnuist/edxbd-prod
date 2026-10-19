/** Import reviewed public research into the local CMS. Run without --apply to preview. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });
if (!process.env.DATABASE_URL?.startsWith('file:')) throw new Error('This import is restricted to a local SQLite database.');
const root = fileURLToPath(new URL('../', import.meta.url));
const payload = JSON.parse(await readFile(path.join(root, 'data/research/china-universities-2026-10-19.json'), 'utf8'));
const guidePath = path.join(root, 'src/data/chinaStudyResearch.json');
let guide;
try { guide = JSON.parse(await readFile(guidePath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const db = new PrismaClient();
const slugs = payload.universities.map(item => item.slug);
if (new Set(slugs).size !== slugs.length) throw new Error('Duplicate university slug in research.');
for (const item of payload.universities) {
  if (!item.sources.length || item.sources.some(source => !/^https:\/\//.test(source.url))) throw new Error(`Missing official HTTPS source: ${item.slug}`);
}
try {
  const existing = await db.university.findMany({ where: { slug: { in: slugs } }, include: { programs: true, fees: true, scholarships: true, costPlans: true } });
  const missing = slugs.filter(slug => !existing.some(item => item.slug === slug));
  console.log(JSON.stringify({ mode: process.argv.includes('--apply') ? 'apply' : 'preview', researchProfiles: slugs.length, newUniversities: missing, studyGuide: Boolean(guide) }, null, 2));
  if (process.argv.includes('--apply')) {
    const campaigns = await db.intakeCampaign.findMany({ where: { slug: { in: ['china-university-research', 'china-study-research'] } } });
    const backupDir = path.join(os.tmpdir(), 'eduexpress-research-backups');
    await mkdir(backupDir, { recursive: true });
    const backupPath = path.join(backupDir, `china-research-${Date.now()}.json`);
    await writeFile(backupPath, JSON.stringify({ existing, campaigns, createdSlugs: missing }, null, 2));
    await db.$transaction(async tx => {
      for (const item of payload.universities) {
        const previous = existing.find(row => row.slug === item.slug);
        const urls = Array.from(new Set([...(previous ? JSON.parse(previous.sourceUrls || '[]') : []), ...item.sources.map(source => source.url)]));
        const tuitionSummaries = {
          'nuist': 'CNY 15,000 / year for undergraduate study (published schedule; confirm selected cycle)',
          'nuaa': 'CNY 22,900 business / 23,900 engineering per year (2026 guide; reconfirm next cycle)',
          'zhejiang-normal-university': 'CNY 18,000 / academic year (2026 undergraduate guide; reconfirm next cycle)',
          'jiangsu-university-of-science-and-technology': 'CNY 11,250 / academic year for English bachelor’s (2026 guide; reconfirm next cycle)',
          'jiangsu-university-of-technology': 'CNY 14,000–18,000 / academic year by subject (2026 guide; reconfirm next cycle)',
          'lyu': 'Current fees not confirmed — request an official program fee sheet',
        };
        const common = { officialUrl: item.officialUrl, sourceUrls: JSON.stringify(urls), ...(tuitionSummaries[item.slug] ? { tuition: tuitionSummaries[item.slug] } : {}) };
        if (previous) {
          // Partial research never upgrades a legacy record to fully verified.
          await tx.university.update({ where: { id: previous.id }, data: common });
          if (item.slug === 'nuist') {
            await tx.program.updateMany({ where: { universityId: previous.id, level: 'Bachelor' }, data: { tuition: 'CNY 15,000 / year (published schedule; confirm selected cycle)', sourceUrl: 'https://gjy.nuist.edu.cn/english/FeeswPayment/listm.htm', applicationDeadline: 'Next-cycle deadline not verified', eligibility: JSON.stringify(['CSCA subjects depend on language and subject; confirm exact eligibility in the current program notice.']) } });
          }
        } else {
          await tx.university.create({ data: {
            ...common, slug: item.slug, name: item.name, city: item.city, country: 'China', location: `${item.city}, ${item.province}, China`,
            intake: [...new Set(item.programs.flatMap(program => program.intakes))].join(','),
            degree: [...new Set(item.programs.map(program => program.level))].join(','),
            taught: [...new Set(item.programs.flatMap(program => program.languages))].join(','),
            majors: item.programs.map(program => program.name).join(','),
            tuition: 'See dated official fee research below; next-cycle costs require confirmation', tuitionDetails: '[]',
            documents: '[]', notes: JSON.stringify(['Official-source research is available. Historical program listings are not open offers.']), badges: '[]', aliases: '[]', legacySlugs: '[]',
            isActive: true, relationshipType: 'public_direct_application', verificationStatus: 'under_verification',
            programs: { create: item.programs.map(program => ({ ...program, languages: program.languages.join(','), intakes: program.intakes.join(','), eligibility: JSON.stringify(program.eligibility) })) },
          } });
        }
        if (previous && item.replaceProgramListing) {
          // Retain unsupported legacy rows for recovery, while showing only researched options.
          await tx.program.updateMany({ where: { universityId: previous.id }, data: { status: 'paused' } });
          for (const program of item.programs) {
            const data = { ...program, languages: program.languages.join(','), intakes: program.intakes.join(','), eligibility: JSON.stringify(program.eligibility), tuitionAfterScholarship: null };
            const priorProgram = previous.programs.find(row => row.name === program.name && row.level === program.level);
            if (priorProgram) await tx.program.update({ where: { id: priorProgram.id }, data });
            else await tx.program.create({ data: { ...data, universityId: previous.id } });
          }
          await tx.university.update({ where: { id: previous.id }, data: {
            intake: [...new Set(item.programs.flatMap(program => program.intakes))].join(','),
            degree: [...new Set(item.programs.map(program => program.level))].join(','),
            taught: [...new Set(item.programs.flatMap(program => program.languages))].join(','),
            majors: item.programs.map(program => program.name).join(','),
            deadlineApplication: item.programs[0]?.applicationDeadline || null,
            deadlineStartDate: 'September 2026 — historical cycle',
          } });
        }
      }
      const campaign = { title: 'China university official-source research', destination: 'China', intake: 'Dated source research; no open-intake assertion', contentJson: JSON.stringify(payload), sourceLabel: payload.editorialStatus, verificationStatus: 'source-reviewed', lastReviewedAt: new Date('2026-10-19T00:00:00+06:00'), nextReviewAt: new Date('2027-01-19T00:00:00+06:00'), isPublished: true };
      await tx.intakeCampaign.upsert({ where: { slug: 'china-university-research' }, create: { slug: 'china-university-research', ...campaign }, update: campaign });
      if (guide) {
        const guideCampaign = { ...campaign, title: 'Study in China research guide', contentJson: JSON.stringify(guide), sourceLabel: 'Automated editorial source research; human education and compliance review pending' };
        await tx.intakeCampaign.upsert({ where: { slug: 'china-study-research' }, create: { slug: 'china-study-research', ...guideCampaign }, update: guideCampaign });
      }
    });
    console.log(`Imported into local CMS. Pre-import snapshot: ${backupPath}`);
  }
} finally { await db.$disconnect(); }
