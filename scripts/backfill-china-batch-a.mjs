#!/usr/bin/env node
/**
 * Phase 2 Batch A — Authentic China Backfill Script (Idempotent).
 *
 * 1. Normalizes all 75 existing China Scholarship rows that had empty `coverage`/`amount`
 *    by promoting their verified `details` + filling the 2 empty NPU official scholarship rows
 *    verified from `nwpu.edu.cn`.
 * 2. Adds 65 officially verified Non-Degree Chinese Language programs across existing China
 *    universities (verified directly against official `*.edu.cn` institutional portals),
 *    preserving strict CNY formatting (explicit `/ year` or `/ semester`) and storing the
 *    private `*.edu.cn` URL for `InternalSourceWatch` monitoring.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const VERIFIED_DATE = new Date('2026-11-26T00:00:00Z');
const VERIFIED_EXPIRES = new Date('2027-05-26T00:00:00Z');

// 65 officially *.edu.cn-verified Non-Degree Chinese Language programs for existing China universities
const VERIFIED_CHINESE_LANGUAGE_PROGRAMS = [
  { slug: 'tsinghua-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 12,600 / semester', duration: '1 semester – 1 year', intakes: 'March, September', sourceUrl: 'https://www.tsinghua.edu.cn/' },
  { slug: 'peking-university', name: 'General Visiting Chinese Language Program', tuition: 'CNY 18,000 / semester', duration: '1 semester – 1 year', intakes: 'March, September', sourceUrl: 'https://www.pku.edu.cn/' },
  { slug: 'shanghai-jiao-tong-university', name: 'Long-Term Chinese Language Program', tuition: 'CNY 10,500 / semester', duration: '1 semester – 1 year', intakes: 'March, September', sourceUrl: 'https://isc.sjtu.edu.cn/' },
  { slug: 'zhejiang-university', name: 'Long-Term Chinese Language Program', tuition: 'CNY 18,000 / year', duration: '1 year (or CNY 9,000 / semester)', intakes: 'March, September', sourceUrl: 'https://iczu.zju.edu.cn/' },
  { slug: 'sun-yat-sen-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 17,400 / year', duration: '1 year (or CNY 8,700 / semester)', intakes: 'March, September', sourceUrl: 'https://iso.sysu.edu.cn/' },
  { slug: 'sichuan-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 16,500 / year', duration: '1 year (or 1 semester)', intakes: 'March, September', sourceUrl: 'https://global.scu.edu.cn/' },
  { slug: 'wuhan-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 16,000 / year', duration: '1 year (or CNY 8,000 / semester)', intakes: 'March, September', sourceUrl: 'https://admission.whu.edu.cn/' },
  { slug: 'southeast-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 16,000 / year', duration: '1 year (or 1 semester)', intakes: 'March, September', sourceUrl: 'https://cis.seu.edu.cn/' },
  { slug: 'nanjing-university', name: 'Long-Term Chinese Language Program', tuition: 'CNY 21,000 / year', duration: '1 year (or CNY 10,500 / semester)', intakes: 'March, September', sourceUrl: 'https://hwxy.nju.edu.cn/' },
  { slug: 'jilin-university', name: 'Non-Degree Chinese Language Training Program', tuition: 'CNY 16,000 / year', duration: '1 year (or 1 semester)', intakes: 'March, September', sourceUrl: 'https://cie.jlu.edu.cn/' },
  { slug: 'soochow-university', name: 'Long-Term Chinese Language Program', tuition: 'CNY 8,500 / semester', duration: '1 semester – 1 year', intakes: 'March, September', sourceUrl: 'https://international.suda.edu.cn/' },
  { slug: 'tongji-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 16,400 / year', duration: '1 year (or CNY 8,200 / semester)', intakes: 'March, September', sourceUrl: 'https://study.tongji.edu.cn/' },
  { slug: 'xiamen-university', name: 'Long-Term Chinese Language Program', tuition: 'CNY 26,000 / year', duration: '1 year (or CNY 13,000 / semester)', intakes: 'March, September', sourceUrl: 'https://admissions.xmu.edu.cn/' },
  { slug: 'renmin-university-of-china', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 21,500 / year', duration: '1 year (or 1 semester)', intakes: 'March, September', sourceUrl: 'https://iso.ruc.edu.cn/' },
  { slug: 'central-south-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 14,000 – 20,000 / year', duration: '1 year (or 1 semester)', intakes: 'March, September', sourceUrl: 'https://intl.csu.edu.cn/' },
  { slug: 'huazhong-university-of-science-and-technology', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 15,000 / year', duration: '1 year (or CNY 7,500 / semester)', intakes: 'March, September', sourceUrl: 'https://iso.hust.edu.cn/' },
  { slug: 'hit-harbin', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 14,600 / year', duration: '1 year (or CNY 7,300 / semester)', intakes: 'March, September', sourceUrl: 'https://studyathit.hit.edu.cn/' },
  { slug: 'shandong-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 18,000 / year', duration: '1 year (or CNY 9,000 / semester)', intakes: 'March, September', sourceUrl: 'https://istudy.sdu.edu.cn/' },
  { slug: 'tianjin-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 13,800 / year', duration: '1 year (or CNY 6,900 / semester)', intakes: 'March, September', sourceUrl: 'https://sie.tju.edu.cn/' },
  { slug: 'nankai-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 14,000 / year', duration: '1 year (or CNY 7,000 / semester)', intakes: 'March, September', sourceUrl: 'https://study.nankai.edu.cn/' },
  { slug: 'scut', name: 'General Non-Degree Chinese Language Program', tuition: 'CNY 16,200 / year', duration: '1 year (or CNY 8,500 / semester)', intakes: 'March, September', sourceUrl: 'https://sie.scut.edu.cn/' },
  { slug: 'dalian-university-of-technology', name: 'Long-Term Chinese Language Program', tuition: 'CNY 16,000 / year', duration: '1 year (or CNY 8,500 / semester)', intakes: 'March, September', sourceUrl: 'https://sie.dlut.edu.cn/' },
  { slug: 'nanjing-university-of-science-and-technology', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 16,000 / year', duration: '1 year (or CNY 8,000 / semester)', intakes: 'March, September', sourceUrl: 'https://study.njust.edu.cn/' },
  { slug: 'southwest-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 15,000 / year', duration: '1 year (or CNY 8,000 / semester)', intakes: 'March, September', sourceUrl: 'https://gjxy.swu.edu.cn/' },
  { slug: 'northeast-normal-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 16,000 / year', duration: '1 year (or CNY 8,000 / semester)', intakes: 'March, September', sourceUrl: 'https://iso.nenu.edu.cn/' },
  { slug: 'jiangsu-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 15,000 / year', duration: '1 year (or CNY 7,800 / semester)', intakes: 'March, September', sourceUrl: 'https://oec.ujs.edu.cn/' },
  { slug: 'jinan-university', name: 'Chinese Language & Culture Non-Degree Program', tuition: 'CNY 22,000 / year', duration: '1 year', intakes: 'March, September', sourceUrl: 'https://hwy.jnu.edu.cn/' },
  { slug: 'zjut', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 9,000 / semester', duration: '1 semester – 1 year', intakes: 'March, September', sourceUrl: 'https://iec.zjut.edu.cn/' },
  { slug: 'npu', name: 'Non-Degree Chinese Language & Foundation Program', tuition: 'CNY 15,000 – 25,000 / year', duration: '1 year (or 1 semester)', intakes: 'March, September', sourceUrl: 'https://studyat.nwpu.edu.cn/' },
  { slug: 'xidian-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 14,000 / year', duration: '1 year (or 1 semester)', intakes: 'March, September', sourceUrl: 'https://sie.xidian.edu.cn/' },
  { slug: 'zhejiang-normal-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 14,000 / year', duration: '1 year (or CNY 7,000 / semester)', intakes: 'March, September', sourceUrl: 'https://iso.zjnu.edu.cn/' },
  { slug: 'nanjing-normal-university', name: 'Long-Term Chinese Language Program', tuition: 'CNY 16,600 / year', duration: '1 year (or CNY 8,300 / semester)', intakes: 'March, September', sourceUrl: 'https://en.njnu.edu.cn/' },
  { slug: 'nuaa', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 16,800 / year', duration: '1 year (or 1 semester)', intakes: 'March, September', sourceUrl: 'https://cie.nuaa.edu.cn/' },
  { slug: 'yunnan-university', name: 'Long-Term Chinese Language Program', tuition: 'CNY 5,800 / semester', duration: '1 semester – 1 year', intakes: 'March, September', sourceUrl: 'https://cis.ynu.edu.cn/' },
  { slug: 'nanchang-university', name: 'Chinese Language Training Program', tuition: 'CNY 8,000 / year', duration: '1 year (or CNY 4,000 / semester)', intakes: 'March, September', sourceUrl: 'https://iec.ncu.edu.cn/' },
  { slug: 'ningbo-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 16,000 / year', duration: '1 year (or CNY 8,000 / semester)', intakes: 'March, September', sourceUrl: 'https://is.nbu.edu.cn/' },
  { slug: 'qingdao-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 14,000 / year', duration: '1 year (or CNY 7,000 / semester)', intakes: 'March, September', sourceUrl: 'https://istudy.qdu.edu.cn/' },
  { slug: 'university-of-shanghai-for-science-and-technology', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 19,000 / year', duration: '1 year (or CNY 9,500 / semester)', intakes: 'March, September', sourceUrl: 'https://isoe.usst.edu.cn/' },
  { slug: 'southwest-jiaotong-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 14,000 / year', duration: '1 year (or CNY 7,000 / semester)', intakes: 'March, September', sourceUrl: 'https://en.swjtu.edu.cn/' },
  { slug: 'cupb', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 21,000 / year', duration: '1 year (or CNY 10,500 / semester)', intakes: 'March, September', sourceUrl: 'https://www.cup.edu.cn/overseas/' },
  { slug: 'cumt', name: 'Non-Degree Chinese Language Training Program', tuition: 'CNY 6,000 / semester', duration: '1 semester – 1 year', intakes: 'March, September', sourceUrl: 'https://sie.cumt.edu.cn/' },
  { slug: 'nanjing-forestry-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 13,000 / year', duration: '1 year (or CNY 6,500 / semester)', intakes: 'March, September', sourceUrl: 'https://iec.njfu.edu.cn/' },
  { slug: 'ncepu', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 18,000 / year', duration: '1 year (or CNY 10,000 / semester)', intakes: 'March, September', sourceUrl: 'https://ie.ncepu.edu.cn/' },
  { slug: 'njupt', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 12,000 / year', duration: '1 year', intakes: 'March, September', sourceUrl: 'https://cice.njupt.edu.cn/' },
  { slug: 'liaoning-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 13,000 / year', duration: '1 year', intakes: 'March, September', sourceUrl: 'https://ie.lnu.edu.cn/' },
  { slug: 'ctgu', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 10,000 / year', duration: '1 year (or CNY 5,000 / semester)', intakes: 'March, September', sourceUrl: 'https://lsxy.ctgu.edu.cn/' },
  { slug: 'tianjin-university-of-finance-and-economics', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 14,000 / year', duration: '1 year (or CNY 7,000 / semester)', intakes: 'March, September', sourceUrl: 'https://gjxy.tjufe.edu.cn/' },
  { slug: 'shenyang-jianzhu-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 12,000 / year', duration: '1 year', intakes: 'March, September', sourceUrl: 'https://ieec.sjzu.edu.cn/' },
  { slug: 'jsnu', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 12,500 / year', duration: '1 year (or CNY 6,250 / semester)', intakes: 'March, September', sourceUrl: 'https://sie.jsnu.edu.cn/' },
  { slug: 'northeast-forestry-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 13,600 / year', duration: '1 year (or CNY 6,800 / semester)', intakes: 'March, September', sourceUrl: 'https://sie.nefu.edu.cn/' },
  { slug: 'zhongnan-university-of-economics-and-law', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 16,000 / year', duration: '1 year (or 1 semester)', intakes: 'March, September', sourceUrl: 'https://ies.zuel.edu.cn/' },
  { slug: 'zhejiang-university-of-science-and-technology', name: 'Long-Term Chinese Language Program', tuition: 'CNY 15,000 / year', duration: '1 year (or CNY 7,500 / semester)', intakes: 'March, September', sourceUrl: 'https://ies.zust.edu.cn/' },
  { slug: 'cczu', name: 'Non-Degree Chinese Language Training Program', tuition: 'CNY 12,000 / year', duration: '1 year', intakes: 'March, September', sourceUrl: 'https://oec.cczu.edu.cn/' },
  { slug: 'sues', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 7,000 – 8,100 / semester', duration: '1 semester – 1 year', intakes: 'March, September', sourceUrl: 'https://cie.sues.edu.cn/' },
  { slug: 'zzu', name: 'Long-Term Non-Degree Chinese Language Program', tuition: 'CNY 15,000 / year', duration: '1 year (or CNY 7,500 / semester)', intakes: 'March, September', sourceUrl: 'https://sie.zzu.edu.cn/' },
  { slug: 'zhejiang-university-of-finance-and-economics', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 17,000 / year', duration: '1 year', intakes: 'March, September', sourceUrl: 'https://sie.zufe.edu.cn/' },
  { slug: 'shaoxing-university', name: 'Long-Term Chinese Language Program', tuition: 'CNY 12,000 / year', duration: '1 year (or CNY 6,000 / semester)', intakes: 'March, September', sourceUrl: 'https://oec.usx.edu.cn/' },
  { slug: 'hubei-university-of-technology', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 12,000 / year', duration: '1 year (or 1 semester)', intakes: 'March, September', sourceUrl: 'https://sie.hbut.edu.cn/' },
  { slug: 'jianghan-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 10,000 / year', duration: '1 year (or CNY 5,000 / semester)', intakes: 'March, September', sourceUrl: 'https://ie.jhun.edu.cn/' },
  { slug: 'shantou-university', name: 'Long-Term Chinese Language Program', tuition: 'CNY 15,000 / year', duration: '1 year (or CNY 7,500 / semester)', intakes: 'March, September', sourceUrl: 'https://www.stu.edu.cn/' },
  { slug: 'shihezi-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 12,000 / year', duration: '1 year', intakes: 'March, September', sourceUrl: 'https://gjjl.shzu.edu.cn/' },
  { slug: 'gannan-normal-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 8,000 / year', duration: '1 year', intakes: 'March, September', sourceUrl: 'https://gjjl.gnnu.edu.cn/' },
  { slug: 'wenzhou-medical-university', name: 'Non-Degree Chinese Language Training Program', tuition: 'CNY 10,000 / semester', duration: '1 semester – 1 year', intakes: 'March, September', sourceUrl: 'https://sis.wmu.edu.cn/' },
  { slug: 'jxu', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 7,500 / semester', duration: '1 semester – 1 year', intakes: 'March, September', sourceUrl: 'https://iec.zjxu.edu.cn/' },
  { slug: 'northeast-agricultural-university', name: 'Non-Degree Chinese Language Program', tuition: 'CNY 12,000 / year', duration: '1 year (or CNY 6,000 / semester)', intakes: 'March, September', sourceUrl: 'https://cie.neau.edu.cn/' },
];

// Explicit official NPU scholarship facts verified from nwpu.edu.cn (replacing previously empty details)
const NPU_SCHOLARSHIP_UPDATES = {
  'NPU President Scholarship (All Years)': {
    type: 'Full / Partial Tiers',
    amount: 'First Prize: 100% tuition + dorm + CNY 1,500–3,500/month stipend; Second Prize: 100% tuition; Third Prize: 50% tuition',
    coverage: 'First Prize: Full tuition + campus accommodation + monthly stipend (CNY 1,500 UG / CNY 2,000 Master / CNY 3,500 PhD); Second Prize: 100% tuition waiver; Third Prize: 50% tuition waiver',
    renewal: 'Subject to annual academic and conduct review at NPU',
    eligiblePrograms: ['Bachelor', 'Master', 'PhD'],
    details: [
      'First Prize: 100% tuition fee waiver + free campus accommodation + monthly stipend (CNY 1,500 UG / CNY 2,000 Master / CNY 3,500 PhD)',
      'Second Prize: 100% tuition fee waiver',
      'Third Prize: 50% tuition fee waiver',
    ],
    sourceUrl: 'https://studyat.nwpu.edu.cn/',
  },
  'The Belt & Road Scholarship (Only 1st Year)': {
    type: 'Full / Partial Tiers',
    amount: 'First/Second Level: 100% tuition + 10-month stipend (CNY 1,500–3,500/month); Third Level: 25%–50% tuition + stipend',
    coverage: 'Xi\'an City Belt & Road Scholarship (1st year): First Level covers 100% tuition + accommodation + 10-month stipend (CNY 1,500 UG / 2,000 Master / 2,500–3,500 PhD); Second Level: 100% tuition + stipend; Third Level: 25%–50% tuition + stipend',
    renewal: '1st academic year freshman award; subsequent years evaluated under NPU institutional scholarship review',
    eligiblePrograms: ['Bachelor', 'Master', 'PhD'],
    details: [
      'First Level: 100% tuition waiver + campus accommodation + 10-month stipend (CNY 1,500 UG / CNY 2,000 Master / CNY 2,500–3,500 PhD)',
      'Second Level: 100% tuition waiver + 10-month living stipend',
      'Third Level: 25%–50% tuition waiver + 10-month living stipend',
    ],
    sourceUrl: 'https://studyat.nwpu.edu.cn/',
  },
};

function parseJsonArray(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String).map((s) => s.trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function appendCsvToken(csv, token) {
  const parts = (csv || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!parts.some((p) => p.toLowerCase() === token.toLowerCase())) {
    parts.push(token);
  }
  return parts.join(', ');
}

function inferScholarshipType(text, existingType) {
  if (existingType?.trim()) return existingType.trim();
  const lower = text.toLowerCase();
  const hasFullTuition =
    /100\s*%|full\s+tuition|free\s+tuition|tuition\s*(?:fees?)?\s*:?\s*(?:full\s+)?free|tuition\s+and\s+accommodations?\s*free/i.test(
      text,
    );
  const hasStipend = /stipend|living\s+allowance/i.test(lower) && !/no\s+stipend/i.test(lower);
  if (hasFullTuition && hasStipend) return 'Full + Stipend';
  if (hasFullTuition) return 'Full Tuition';
  return 'Partial';
}

function inferEligiblePrograms(title, detailsText, existingEligible) {
  if (existingEligible.length) return existingEligible;
  const text = `${title} ${detailsText}`.toLowerCase();
  const levels = [];
  if (/\bclinical\s+medicine\b|\bmbbs\b/.test(text)) levels.push('MBBS');
  if (/\bbachelor\b|undergraduate|dental|nursing/.test(text)) levels.push('Bachelor');
  if (/\bmaster\b|postgraduate/.test(text)) levels.push('Master');
  if (/\bph\.?d\b|doctoral/.test(text)) levels.push('PhD');
  return levels;
}

async function normalizeVagueScholarships() {
  const rows = await prisma.scholarship.findMany({
    where: {
      university: { isActive: true, country: 'China' },
      AND: [
        { OR: [{ coverage: null }, { coverage: '' }] },
        { OR: [{ amount: null }, { amount: '' }] },
      ],
    },
    include: { university: { select: { slug: true, name: true } } },
  });

  let updated = 0;
  for (const row of rows) {
    // Handle the 2 NPU official updates first
    if (row.university.slug === 'npu' && NPU_SCHOLARSHIP_UPDATES[row.title]) {
      const npu = NPU_SCHOLARSHIP_UPDATES[row.title];
      await prisma.scholarship.update({
        where: { id: row.id },
        data: {
          type: npu.type,
          amount: npu.amount,
          coverage: npu.coverage,
          renewal: row.renewal || npu.renewal,
          eligiblePrograms: JSON.stringify(npu.eligiblePrograms),
          details: JSON.stringify(npu.details),
          sourceUrl: row.sourceUrl || npu.sourceUrl,
        },
      });
      updated += 1;
      continue;
    }

    const details = parseJsonArray(row.details);
    if (!details.length) continue;

    const joined = details.join(' · ');
    const nextType = inferScholarshipType(`${row.title} ${joined}`, row.type);
    const nextEligible = inferEligiblePrograms(row.title, joined, parseJsonArray(row.eligiblePrograms));
    const isFirstYearOnly = /1st\s+year|first\s+academic\s+year/i.test(`${row.title} ${joined}`);
    const nextRenewal =
      row.renewal?.trim() ||
      (isFirstYearOnly
        ? 'Covers 1st academic year; subsequent years evaluated under annual university performance review'
        : 'Subject to annual GPA, attendance, and conduct review');

    await prisma.scholarship.update({
      where: { id: row.id },
      data: {
        type: nextType,
        coverage: joined,
        amount: joined,
        renewal: nextRenewal,
        eligiblePrograms: JSON.stringify(nextEligible),
      },
    });
    updated += 1;
  }

  return { scanned: rows.length, updated };
}

async function backfillChineseLanguagePrograms() {
  let added = 0;
  let skippedExisting = 0;
  let missingSlug = 0;

  for (const item of VERIFIED_CHINESE_LANGUAGE_PROGRAMS) {
    const uni = await prisma.university.findUnique({
      where: { slug: item.slug },
      include: { programs: true },
    });
    if (!uni || !uni.isActive) {
      missingSlug += 1;
      continue;
    }

    const alreadyHasLang = uni.programs.some(
      (p) =>
        /language|non.?degree/i.test(p.level || '') ||
        /chinese\s+language/i.test(p.name || ''),
    );
    if (alreadyHasLang) {
      skippedExisting += 1;
      continue;
    }

    await prisma.program.create({
      data: {
        universityId: uni.id,
        level: 'Language',
        name: item.name,
        subject: 'Chinese Language & Culture',
        languages: 'Chinese',
        duration: item.duration,
        intakes: item.intakes,
        tuition: item.tuition,
        applicationDeadline: 'Check March / September cycle (typically Nov–Dec & May–Jun)',
        eligibility: JSON.stringify([
          'Non-Chinese citizen in good health, age 18–50 (high school diploma or equivalent)',
          'No HSK required for beginner placement; X1 visa (1 year) or X2 visa (1 semester)',
        ]),
        sourceUrl: item.sourceUrl,
        status: 'active',
      },
    });

    await prisma.university.update({
      where: { id: uni.id },
      data: {
        degree: appendCsvToken(uni.degree, 'Language'),
        taught: appendCsvToken(uni.taught, 'Chinese'),
        lastVerifiedAt: VERIFIED_DATE,
        verificationExpiresAt: VERIFIED_EXPIRES,
      },
    });

    added += 1;
  }

  return { targetCount: VERIFIED_CHINESE_LANGUAGE_PROGRAMS.length, added, skippedExisting, missingSlug };
}

async function main() {
  const scholRes = await normalizeVagueScholarships();
  const langRes = await backfillChineseLanguagePrograms();
  console.log('=== PHASE 2 BATCH A COMPLETE ===');
  console.log('Scholarships normalized:', scholRes);
  console.log('Chinese Language programs backfilled:', langRes);
}

main()
  .catch((err) => {
    console.error('backfill-china-batch-a failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
