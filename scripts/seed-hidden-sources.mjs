#!/usr/bin/env node
/**
 * Populate the private server-only `InternalSourceWatch` vault from:
 * 1. All 32 global country deep visa/financial-proof/scholarship URLs
 * 2. All active University, Program, Scholarship, and Fee deep sourceUrls in SQLite
 *
 * Idempotent: safe to run repeatedly (upserts by unique `watchKey`).
 * Strictly internal — never writes any public CSV or client artifact.
 */

import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ROOT = process.cwd();

function isHttpUrl(val) {
  return typeof val === 'string' && /^https?:\/\/[^\s]+$/i.test(val.trim());
}

function parseJsonUrls(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((v) => String(v || '').trim()).filter(isHttpUrl);
  } catch {
    // ignore malformed json
  }
  return [];
}

/**
 * Parse PRIVATE_COUNTRY_SOURCE_SEEDS directly from src/lib/private-source-registry.ts
 * without requiring a TypeScript transpiler at runtime.
 */
function loadCountrySeedsFromTs() {
  const filePath = path.join(ROOT, 'src/lib/private-source-registry.ts');
  const src = fs.readFileSync(filePath, 'utf8');
  const seeds = [];
  const blockRe = /\{[^{}]*watchKey:\s*'([^']+)'[^{}]*\}/g;
  for (const match of src.matchAll(blockRe)) {
    const block = match[0];
    const grab = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*'([^']+)'`));
      return m ? m[1] : '';
    };
    const intervalMatch = block.match(/checkIntervalDays:\s*(\d+)/);
    const watchKey = grab('watchKey');
    const sourceUrl = grab('sourceUrl');
    if (!watchKey || !isHttpUrl(sourceUrl)) continue;
    seeds.push({
      watchKey,
      entityType: 'country_policy',
      entityId: grab('countrySlug'),
      entityLabel: grab('entityLabel'),
      country: grab('countryName'),
      sourceUrl,
      authorityLabel: grab('authorityLabel') || 'National Regulatory Authority',
      checkIntervalDays: intervalMatch ? Number(intervalMatch[1]) : 21,
    });
  }
  return seeds;
}

async function main() {
  const candidates = new Map();
  const addCandidate = (row) => {
    if (!row.watchKey || !isHttpUrl(row.sourceUrl)) return;
    if (!candidates.has(row.watchKey)) {
      candidates.set(row.watchKey, row);
    }
  };

  // 1. All 32 global destinations + Bangladesh Bank GFET
  const countrySeeds = loadCountrySeedsFromTs();
  for (const seed of countrySeeds) addCandidate(seed);

  // 2. All active universities and child records
  const universities = await prisma.university.findMany({
    where: { isActive: true },
    include: {
      programs: true,
      scholarships: true,
      fees: true,
    },
  });

  for (const uni of universities) {
    if (isHttpUrl(uni.officialUrl)) {
      addCandidate({
        watchKey: `university:${uni.slug}:official`,
        entityType: 'university',
        entityId: uni.id,
        entityLabel: `${uni.name} — Official Portal`,
        country: uni.country,
        sourceUrl: uni.officialUrl.trim(),
        authorityLabel: `${uni.name} Official Website`,
        checkIntervalDays: 60,
      });
    }

    if (isHttpUrl(uni.recognitionSourceUrl)) {
      addCandidate({
        watchKey: `university:${uni.slug}:recognition`,
        entityType: 'university',
        entityId: uni.id,
        entityLabel: `${uni.name} — Recognition Registry`,
        country: uni.country,
        sourceUrl: uni.recognitionSourceUrl.trim(),
        authorityLabel: uni.recognitionAuthority || 'National Accreditation Registry',
        checkIntervalDays: 90,
      });
    }

    const extraUrls = parseJsonUrls(uni.sourceUrls);
    extraUrls.forEach((url, idx) => {
      if (url === uni.officialUrl?.trim()) return;
      addCandidate({
        watchKey: `university:${uni.slug}:source-${idx + 1}`,
        entityType: 'university',
        entityId: uni.id,
        entityLabel: `${uni.name} — Admission Notice #${idx + 1}`,
        country: uni.country,
        sourceUrl: url,
        authorityLabel: `${uni.name} Admissions Notice`,
        checkIntervalDays: 45,
      });
    });

    // Deduplicate deep program/scholarship/fee sourceUrls per university so we don't spam the same URL 20 times
    const seenPerUni = new Set([uni.officialUrl?.trim(), ...extraUrls].filter(Boolean));

    for (const p of uni.programs) {
      const url = p.sourceUrl?.trim();
      if (!isHttpUrl(url) || seenPerUni.has(url)) continue;
      seenPerUni.add(url);
      addCandidate({
        watchKey: `program:${uni.slug}:${p.id}`,
        entityType: 'program',
        entityId: p.id,
        entityLabel: `${uni.name} — ${p.name} (${p.level})`,
        country: uni.country,
        sourceUrl: url,
        authorityLabel: `${uni.name} Programme Notice`,
        checkIntervalDays: 45,
      });
    }

    for (const s of uni.scholarships) {
      const url = s.sourceUrl?.trim();
      if (!isHttpUrl(url) || seenPerUni.has(url)) continue;
      seenPerUni.add(url);
      addCandidate({
        watchKey: `scholarship:${uni.slug}:${s.id}`,
        entityType: 'scholarship',
        entityId: s.id,
        entityLabel: `${uni.name} — ${s.title}`,
        country: uni.country,
        sourceUrl: url,
        authorityLabel: `${uni.name} Scholarship Notice`,
        checkIntervalDays: 30,
      });
    }

    for (const f of uni.fees) {
      const url = f.sourceUrl?.trim();
      if (!isHttpUrl(url) || seenPerUni.has(url)) continue;
      seenPerUni.add(url);
      addCandidate({
        watchKey: `fee:${uni.slug}:${f.id}`,
        entityType: 'fee',
        entityId: f.id,
        entityLabel: `${uni.name} — ${f.item}`,
        country: uni.country,
        sourceUrl: url,
        authorityLabel: `${uni.name} Fee Schedule`,
        checkIntervalDays: 60,
      });
    }
  }

  let createdOrUpdated = 0;
  for (const row of candidates.values()) {
    await prisma.internalSourceWatch.upsert({
      where: { watchKey: row.watchKey },
      create: {
        watchKey: row.watchKey,
        entityType: row.entityType,
        entityId: row.entityId,
        entityLabel: row.entityLabel,
        country: row.country,
        sourceUrl: row.sourceUrl,
        authorityLabel: row.authorityLabel,
        checkIntervalDays: row.checkIntervalDays,
        status: 'active',
      },
      update: {
        entityLabel: row.entityLabel,
        country: row.country,
        sourceUrl: row.sourceUrl,
        authorityLabel: row.authorityLabel,
        checkIntervalDays: row.checkIntervalDays,
      },
    });
    createdOrUpdated += 1;
  }

  const byType = await prisma.internalSourceWatch.groupBy({
    by: ['entityType'],
    _count: { _all: true },
  });

  console.log(`=== InternalSourceWatch synced: ${createdOrUpdated} private source URLs ===`);
  for (const g of byType) {
    console.log(`  - ${g.entityType}: ${g._count._all}`);
  }
}

main()
  .catch((err) => {
    console.error('seed-hidden-sources failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
