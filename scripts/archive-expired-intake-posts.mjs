#!/usr/bin/env node
/**
 * Archives the closed March 2026 intake announcements.
 *
 * Archived posts stay reachable (transparency + backlinks) but are noindexed
 * and excluded from sitemaps/RSS. Their bogus 2024-01-15 publication dates are
 * replaced with the real record creation date.
 *
 * Usage: node scripts/archive-expired-intake-posts.mjs [--dry-run]
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dryRun = process.argv.includes('--dry-run');
const ARCHIVED_AT = new Date('2026-04-01T00:00:00.000Z');

const slugs = [
  'zzu-march-2026-admissions-open',
  'nuist-march-2026-admissions-open',
  'cpu-march-2026-admissions-open',
  'nuaa-march-2026-admissions-open',
  'ntu-march-2026-admissions-nantong-university',
  'lyu-march-2026-admissions-linyi-university',
  'xsyu-march-2026-admissions-xian-shiyou-university',
  'pzu-march-2026-admissions-direct-major-panzhihua-university',
  'zjut-march-2026-chinese-language-program',
  'cauc-march-2026-foundation-program-scholarship',
];

async function main() {
  const rows = await prisma.content.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true, publishedAt: true, createdAt: true, archivedAt: true },
  });

  const changes = rows.map(row => ({
    slug: row.slug,
    archivedAt: ARCHIVED_AT,
    publishedAt: row.publishedAt && row.publishedAt < new Date('2025-01-01') ? row.createdAt : row.publishedAt,
    previousPublishedAt: row.publishedAt,
    previousArchivedAt: row.archivedAt,
  }));

  console.log(JSON.stringify({ dryRun, matched: rows.length, changes }, null, 2));

  if (dryRun) return;
  for (const row of rows) {
    await prisma.content.update({
      where: { id: row.id },
      data: {
        archivedAt: ARCHIVED_AT,
        ...(row.publishedAt && row.publishedAt < new Date('2025-01-01') ? { publishedAt: row.createdAt } : {}),
      },
    });
  }
  console.log(JSON.stringify({ updated: rows.length }, null, 2));
}

main()
  .catch(error => { console.error(error); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
