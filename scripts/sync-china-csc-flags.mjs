#!/usr/bin/env node
/**
 * Sync `isCscDesignated = true` and official `chineseName` (汉字) across all
 * 306 matched CSC-designated Chinese universities using the verified snapshot
 * in `data/research/china-csc-306-gap-audit.json`.
 *
 * Idempotent & fast: safe to run on every production boot via `seed-production-db.mjs`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ROSTER_PATH = path.join(process.cwd(), 'data/research/china-csc-306-roster.json');

async function main() {
  if (!fs.existsSync(ROSTER_PATH)) {
    console.warn(`CSC 306 roster manifest not found at ${ROSTER_PATH}; skipping CSC flag sync.`);
    return;
  }

  const roster = JSON.parse(fs.readFileSync(ROSTER_PATH, 'utf8'));
  const entries = Array.isArray(roster.universities) ? roster.universities : [];
  if (entries.length === 0) {
    console.warn('CSC 306 roster manifest has no entries; skipping.');
    return;
  }

  const existingChina = await prisma.university.findMany({
    where: { country: 'China' },
    select: { id: true, slug: true, isCscDesignated: true, chineseName: true, cscAgencyNumber: true },
  });
  const bySlug = new Map(existingChina.map((u) => [u.slug, u]));

  let updated = 0;
  let alreadySynced = 0;
  let missing = 0;

  for (const row of entries) {
    const slug = typeof row.slug === 'string' ? row.slug.trim() : '';
    if (!slug) continue;
    const uni = bySlug.get(slug);
    if (!uni) {
      missing += 1;
      continue;
    }

    const nextChineseName = uni.chineseName || (typeof row.chineseName === 'string' ? row.chineseName.trim() : null);
    const nextAgency = uni.cscAgencyNumber || (typeof row.cscAgencyNumber === 'string' ? row.cscAgencyNumber.trim() : null);
    const needsUpdate =
      !uni.isCscDesignated ||
      (nextChineseName && nextChineseName !== uni.chineseName) ||
      (nextAgency && nextAgency !== uni.cscAgencyNumber);

    if (!needsUpdate) {
      alreadySynced += 1;
      continue;
    }

    await prisma.university.update({
      where: { id: uni.id },
      data: {
        isCscDesignated: true,
        ...(nextChineseName ? { chineseName: nextChineseName } : {}),
        ...(nextAgency ? { cscAgencyNumber: nextAgency } : {}),
      },
    });
    updated += 1;
  }

  const totalFlagged = await prisma.university.count({
    where: { isActive: true, country: 'China', isCscDesignated: true },
  });

  console.log(
    `=== CSC 306 flag sync complete: updated=${updated}, alreadySynced=${alreadySynced}, missing=${missing}, activeCscChina=${totalFlagged}/306 ===`,
  );
}

main()
  .catch((err) => {
    console.error('CSC flag sync failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
