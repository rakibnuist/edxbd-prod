import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
try {
  const landing = JSON.parse(await readFile(new URL('../data/research/china-march-2027-landing.json', import.meta.url), 'utf8'));
  const record = await prisma.intakeCampaign.findUnique({ where: { slug: 'china-march-2027-intake' } });
  if (!record) throw new Error('Seed the existing campaign first; this importer never replaces the original campaign.');
  const content = JSON.parse(record.contentJson);
  await prisma.intakeCampaign.update({ where: { id: record.id }, data: { contentJson: JSON.stringify({ ...content, researchedLanding: landing }) } });
  console.log('Added researched landing content; original planning routes, sources and status preserved.');
} finally { await prisma.$disconnect(); }
