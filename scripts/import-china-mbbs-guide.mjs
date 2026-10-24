import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
try {
  if (!process.env.DATABASE_URL?.startsWith('file:')) throw new Error('Only the local SQLite CMS is supported.');
  const record = await prisma.intakeCampaign.findUnique({ where: { slug: 'china-study-research' } });
  if (!record) throw new Error('The China research record is required.');
  const mbbs = JSON.parse(await readFile(new URL('../src/data/chinaMbbsGuide.json', import.meta.url), 'utf8'));
  const research = JSON.parse(await readFile(new URL('../src/data/chinaStudyResearch.json', import.meta.url), 'utf8'));
  const workbook = JSON.parse(await readFile(new URL('../data/research/china-mbbs-workbook.json', import.meta.url), 'utf8'));
  await mkdir('data/research/backups', { recursive: true });
  await writeFile(`data/research/backups/china-mbbs-${Date.now()}.json`, JSON.stringify(record, null, 2) + '\n');
  const original = JSON.parse(record.contentJson);
  // Update the related medical guidance without replacing other CMS research.
  const risks = original.risks?.map(item => /Medicine:/.test(item.title) ? research.risks.find(entry => /Medicine:/.test(entry.title)) ?? item : item);
  await prisma.intakeCampaign.update({ where: { id: record.id }, data: { contentJson: JSON.stringify({ ...original, ...(risks ? { risks } : {}), mbbs, mbbsWorkbook: workbook }) } });
  console.log('MBBS guide and workbook research saved locally; existing China content preserved.');
} finally { await prisma.$disconnect(); }
