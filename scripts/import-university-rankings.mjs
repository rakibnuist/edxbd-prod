/** Import primary publisher ranking research to the local CMS. Preview by default. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });
if (!process.env.DATABASE_URL?.startsWith('file:')) throw new Error('Ranking import is restricted to a local SQLite database.');
const root = fileURLToPath(new URL('../', import.meta.url));
const payload = JSON.parse(await readFile(path.join(root, 'data/research/university-rankings.json'), 'utf8'));
const publisherHosts = { 'Times Higher Education': 'www.timeshighereducation.com', ShanghaiRanking: 'www.shanghairanking.com', QS: 'www.topuniversities.com' };
if (payload.version !== 1 || !Array.isArray(payload.universities) || Number.isNaN(Date.parse(payload.checkedAt)) || Number.isNaN(Date.parse(payload.nextReviewAt))) throw new Error('Invalid ranking payload.');
const slugs = payload.universities.map(item => item.slug);
if (slugs.some(slug => typeof slug !== 'string' || !slug.trim()) || new Set(slugs).size !== slugs.length) throw new Error('Invalid or duplicate university slug.');
for (const profile of payload.universities) {
  if (!Array.isArray(profile.rankings) || !profile.rankings.length) throw new Error(`Missing ranking records: ${profile.slug}`);
  const recordKeys = new Set();
  for (const ranking of profile.rankings) {
    const source = new URL(ranking.sourceUrl);
    if (source.protocol !== 'https:' || source.hostname !== publisherHosts[ranking.publisher]) throw new Error(`Source must be an approved primary publisher: ${profile.slug}`);
    if (typeof ranking.rankingName !== 'string' || !ranking.rankingName.trim() || !Number.isInteger(ranking.year) || ranking.year < 2000 || ranking.year > 2100 || !/^=?\d+(?:[–-]\d+|\+)?$/.test(ranking.rank) || !['world', 'subject', 'national'].includes(ranking.scope)) throw new Error(`Invalid ranking: ${profile.slug}`);
    if (ranking.scope === 'subject' && !ranking.subject?.trim()) throw new Error(`A subject ranking must name its subject: ${profile.slug}`);
    const recordKey = [ranking.publisher, ranking.rankingName, ranking.year, ranking.subject ?? ''].join('|');
    if (recordKeys.has(recordKey)) throw new Error(`Duplicate ranking: ${profile.slug}`);
    recordKeys.add(recordKey);
  }
}
const db = new PrismaClient();
try {
  const universities = await db.university.findMany({ where: { slug: { in: slugs } }, select: { slug: true } });
  const missing = slugs.filter(slug => !universities.some(item => item.slug === slug));
  if (missing.length) throw new Error(`Create university records before importing rankings: ${missing.join(', ')}`);
  const previous = await db.intakeCampaign.findUnique({ where: { slug: 'university-rankings' } });
  const contentJson = JSON.stringify(payload);
  const apply = process.argv.includes('--apply');
  const unchanged = previous?.contentJson === contentJson && previous?.isPublished === true;
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'preview', profiles: slugs.length, rankingRecords: payload.universities.reduce((count, profile) => count + profile.rankings.length, 0), unchanged }, null, 2));
  if (apply && !unchanged) {
    const backupDir = path.join(os.tmpdir(), 'eduexpress-research-backups');
    await mkdir(backupDir, { recursive: true });
    const backupPath = path.join(backupDir, `university-rankings-${Date.now()}.json`);
    await writeFile(backupPath, JSON.stringify({ campaign: previous, importedSlugs: slugs }, null, 2));
    const campaign = {
      title: 'University ranking publisher research', destination: 'China', intake: 'Ranking reference; not an intake offer', contentJson,
      sourceLabel: payload.editorialStatus, verificationStatus: 'source-reviewed', lastReviewedAt: new Date(payload.checkedAt), nextReviewAt: new Date(payload.nextReviewAt), isPublished: true,
    };
    await db.intakeCampaign.upsert({ where: { slug: 'university-rankings' }, create: { slug: 'university-rankings', ...campaign }, update: campaign });
    console.log(`Ranking research imported into local CMS. Pre-import snapshot: ${backupPath}`);
  }
} finally { await db.$disconnect(); }
