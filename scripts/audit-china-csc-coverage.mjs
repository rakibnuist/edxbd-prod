#!/usr/bin/env node
/**
 * Audit China University Coverage vs. the 306 CSC-Designated Universities List
 * stored in `Content.slug = 'complete-csc-universities-list-2027'`.
 *
 * Produces:
 *   data/research/china-csc-306-gap-audit.json
 *
 * With `--apply-matched`, also updates matched existing China universities in SQLite
 * with `isCscDesignated = true` and their official `chineseName` (汉字) — strictly
 * factual metadata without fabricating any tuition or fee data.
 */

import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ROOT = process.cwd();
const APPLY_MATCHED = process.argv.includes('--apply-matched');

function normalizeName(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\bthe\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const KNOWN_CSC_SLUG_MAP = {
  'china university of petroleum east china': 'china-university-of-petroleum-east-china',
  'china university of geosciences wuhan': 'china-university-of-geosciences',
  'tiangong university formerly tianjin university of science and technology': 'tianjin-university-of-science-and-technology',
  'guangxi university for nationalities': 'guangxi-minzu-university',
  'jingdezhen ceramic institute': 'jingdezhen-ceramic-university',
};

function parseJsonArray(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

async function main() {
  const post = await prisma.content.findUnique({
    where: { slug: 'complete-csc-universities-list-2027' },
    select: { content: true },
  });
  if (!post?.content) {
    throw new Error('Could not find complete-csc-universities-list-2027 in Content table.');
  }

  // Extract all <li><span ...>EN</span><span class="cn-name">CN</span></li> (all 306 entries)
  const cscList = [];
  const itemRe = /<span(?:\s+class="en-name")?>([^<]+)<\/span>\s*<span class="cn-name">([^<]+)<\/span>/gi;
  for (const m of post.content.matchAll(itemRe)) {
    const enName = m[1].replace(/&amp;/g, '&').trim();
    const cnName = m[2].trim();
    if (enName) cscList.push({ enName, cnName, norm: normalizeName(enName) });
  }

  const chinaUnis = await prisma.university.findMany({
    where: { isActive: true, country: 'China' },
    include: { programs: true, scholarships: true, fees: true },
    orderBy: { name: 'asc' },
  });

  // Build lookup index from existing China universities (name, aliases, slug-expanded)
  const lookup = new Map();
  for (const u of chinaUnis) {
    const keys = [
      normalizeName(u.name),
      normalizeName(u.slug.replace(/-/g, ' ')),
      ...parseJsonArray(u.aliases).map(normalizeName),
    ].filter(Boolean);
    for (const key of keys) {
      if (!lookup.has(key)) lookup.set(key, u);
    }
  }

  const matched = [];
  const missingCsc = [];
  const matchedUniIds = new Set();

  for (const csc of cscList) {
    let found = lookup.get(csc.norm);
    if (!found && KNOWN_CSC_SLUG_MAP[csc.norm]) {
      found = chinaUnis.find((u) => u.slug === KNOWN_CSC_SLUG_MAP[csc.norm]);
    }
    // Secondary fuzzy match for comma/hyphen variations (e.g. "China University of Petroleum, Beijing" vs "(Beijing)")
    if (!found) {
      found = chinaUnis.find((u) => {
        const uNorm = normalizeName(u.name);
        if (uNorm === csc.norm) return true;
        // Also compare with aliases
        return parseJsonArray(u.aliases).some((al) => normalizeName(al) === csc.norm);
      });
    }
    if (found) {
      matched.push({
        cscEnName: csc.enName,
        cscCnName: csc.cnName,
        matchedSlug: found.slug,
        matchedName: found.name,
        hasEnglish: found.programs.some((p) => /english/i.test(p.languages || '')),
        hasChineseLanguage: found.programs.some(
          (p) => /language|non.?degree/i.test(p.level || '') || /chinese\s+language/i.test(p.name || ''),
        ),
        programCount: found.programs.length,
        scholarshipCount: found.scholarships.length,
      });
      matchedUniIds.add(found.id);

      if (APPLY_MATCHED) {
        await prisma.university.update({
          where: { id: found.id },
          data: {
            isCscDesignated: true,
            chineseName: found.chineseName || csc.cnName,
          },
        });
      }
    } else {
      missingCsc.push({
        enName: csc.enName,
        cnName: csc.cnName,
        suggestedSlug: csc.enName
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''),
      });
    }
  }

  // Audit existing China universities missing Chinese Language programs or incomplete scholarships
  const existingWithoutChineseLang = chinaUnis
    .filter(
      (u) =>
        !u.programs.some(
          (p) => /language|non.?degree/i.test(p.level || '') || /chinese\s+language/i.test(p.name || ''),
        ),
    )
    .map((u) => ({ slug: u.slug, name: u.name, city: u.city, isCscDesignated: matchedUniIds.has(u.id) }));

  const vagueScholarships = [];
  for (const u of chinaUnis) {
    for (const s of u.scholarships) {
      if (!s.coverage && !s.amount) {
        vagueScholarships.push({
          universitySlug: u.slug,
          universityName: u.name,
          scholarshipId: s.id,
          title: s.title,
          type: s.type || '',
        });
      }
    }
  }

  const report = {
    generatedAtIso: new Date().toISOString(),
    summary: {
      totalCscListCount: cscList.length,
      existingActiveChinaUniversities: chinaUnis.length,
      matchedCscUniversities: matched.length,
      missingCscUniversitiesCount: missingCsc.length,
      nonCscExistingChinaUniversities: chinaUnis.length - matchedUniIds.size,
      existingChinaMissingChineseLanguageProgram: existingWithoutChineseLang.length,
      existingScholarshipsMissingExplicitCoverageOrAmount: vagueScholarships.length,
    },
    missingCscUniversities: missingCsc,
    existingWithoutChineseLanguageProgram: existingWithoutChineseLang,
    vagueScholarshipsSample: vagueScholarships.slice(0, 60),
  };

  const outPath = path.join(ROOT, 'data/research/china-csc-306-gap-audit.json');
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log('=== CHINA 306 CSC COVERAGE AUDIT ===');
  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`Saved full manifest to ${outPath}`);
  if (APPLY_MATCHED) {
    console.log(`Updated ${matchedUniIds.size} matched China universities with isCscDesignated=true and official chineseName.`);
  }
}

main()
  .catch((err) => {
    console.error('audit-china-csc-coverage failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
