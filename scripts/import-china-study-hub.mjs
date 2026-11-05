import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
try {
  if (!process.env.DATABASE_URL?.startsWith('file:')) throw new Error('This import is restricted to the local SQLite CMS.');
  const record = await prisma.intakeCampaign.findUnique({ where: { slug: 'china-study-research' } });
  if (!record) throw new Error('The existing China research record is required.');
  const hub = JSON.parse(await readFile(new URL('../src/data/chinaStudyHub.json', import.meta.url), 'utf8'));
  const original = JSON.parse(record.contentJson);
  await mkdir('data/research/backups', { recursive: true });
  await writeFile(`data/research/backups/china-hub-${Date.now()}.json`, JSON.stringify(record, null, 2) + '\n');
  await prisma.intakeCampaign.update({ where: { id: record.id }, data: { contentJson: JSON.stringify({ ...original, hub }) } });
  console.log('China hub content added to the local CMS; existing university and guide research preserved.');
} finally { await prisma.$disconnect(); }
