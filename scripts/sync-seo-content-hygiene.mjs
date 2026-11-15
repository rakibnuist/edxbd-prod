#!/usr/bin/env node
/**
 * Idempotent SEO & factual content hygiene for live CMS `Content` rows:
 * 1. Replaces broken CMS template placeholder links (`[Link to ...]`) in
 *    `csca-guide-study-in-china` with working internal/official URLs.
 * 2. Populates missing `excerpt` (from existing `metaDescription`), `category`,
 *    `publishedAt` (from real `createdAt`), and cited official `sourceUrls` on
 *    active China guides without overwriting newer editorial edits.
 * 3. Unpublishes/archives obsolete orphan non-update rows (`type: 'destination'`
 *    Croatia draft carrying deprecated Schengen copy, and duplicate `type: 'page'`
 *    `china-k-visa-for-stem-a-guide-for-bangladeshi-graduates`).
 *
 * Safe to run repeatedly on deploy from `scripts/seed-production-db.mjs`.
 */
import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ARCHIVED_AT = new Date('2026-04-01T00:00:00.000Z');

const CSCA_LINK_REPLACEMENTS = [
  ['href="[Link to your Chinese Government Scholarship info page]"', 'href="/csc-scholarship-bangladesh"'],
  ['href="[Link to a general \'Study in China\' page on your site]"', 'href="/study-in-china-from-bangladesh"'],
  ['href="[Link to HSK info page on your site or official HSK site]"', 'href="/china-admission-requirements"'],
  ['href="[Link to Study in China Entrance Exam Mock Test, if available]"', 'href="https://www.csca.cn"'],
  ['href="[Link to a page on your site listing Chinese universities or foundation programs]"', 'href="/china-universities"'],
  ['href="[Link to your contact page or consultation form]"', 'href="/education-fit-assessment"'],
];

const ACTIVE_CHINA_METADATA_DEFAULTS = [
  {
    slug: 'csca-guide-study-in-china',
    category: 'Exam Guide',
    metaTitle: '2026 CSCA Entrance Test Guide: China | EduExpress',
    metaDescription:
      '2026 China CSCA entrance exam guide for Bangladeshi students: test structure, schedule, registration fees, scoring and preparation rules.',
    sources: ['https://www.csca.cn', 'https://www.campuschina.org/'],
  },
  {
    slug: 'china-k-visa',
    category: 'Visa & Policy',
    metaTitle: 'China K-Visa Guide for STEM Graduates | EduExpress',
    metaDescription:
      'China K-Visa guide for Bangladeshi STEM graduates: eligibility rules, required documents and application steps without employer sponsorship.',
    sources: [
      'https://bd.china-embassy.gov.cn/eng/',
      'https://www.visaforchina.cn/DAC3_EN/qianzhengyewu',
    ],
  },
  {
    slug: 'complete-csc-universities-list-2026',
    category: 'Scholarships',
    metaTitle: 'CSC Universities List 2026 (306 Schools) | EduExpress',
    metaDescription:
      'Directory of 306 Chinese universities accepting Chinese Government Scholarship (CSC) applications for 2026, with verified admission criteria.',
    sources: ['https://www.campuschina.org/'],
  },
  {
    slug: 'how-to-apply-csc-type-a-scholarship-complete-guide',
    category: 'Scholarships',
    metaTitle: 'CSC Type A Scholarship Application Guide | EduExpress',
    metaDescription:
      'Step-by-step CSC Type A (Bilateral Program) scholarship guide for Bangladeshi applicants: eligibility rules, required documents and key deadlines.',
    sources: ['https://www.campuschina.org/'],
  },
];

const ORPHAN_ROWS_TO_ARCHIVE = [
  'study-in-croatia-eu-education-adriatic-coast-2025',
  'study-in-south-korea-complete-guide-2025',
  'china-k-visa-for-stem-a-guide-for-bangladeshi-graduates',
];

async function main() {
  let updated = 0;

  // 1. Replace placeholder bracket links in CSCA guide
  const csca = await prisma.content.findUnique({ where: { slug: 'csca-guide-study-in-china' } });
  if (csca) {
    let nextHtml = csca.content;
    for (const [pattern, replacement] of CSCA_LINK_REPLACEMENTS) {
      nextHtml = nextHtml.split(pattern).join(replacement);
    }
    if (nextHtml !== csca.content) {
      await prisma.content.update({
        where: { id: csca.id },
        data: { content: nextHtml },
      });
      updated++;
      console.log('Fixed placeholder links in csca-guide-study-in-china.');
    }
  }

  // 2. Populate missing metadata fields from verified existing fields
  for (const spec of ACTIVE_CHINA_METADATA_DEFAULTS) {
    const row = await prisma.content.findUnique({ where: { slug: spec.slug } });
    if (!row) continue;

    const patch = {};
    if (!row.category && spec.category) patch.category = spec.category;
    if (spec.metaTitle && (!row.metaTitle?.trim() || row.metaTitle.trim().length > 60)) {
      patch.metaTitle = spec.metaTitle;
    }
    if (spec.metaDescription && (!row.metaDescription?.trim() || row.metaDescription.trim().length > 160)) {
      patch.metaDescription = spec.metaDescription;
    }
    const nextMetaDescription = patch.metaDescription ?? row.metaDescription;
    if ((!row.excerpt || !row.excerpt.trim()) && nextMetaDescription?.trim()) {
      patch.excerpt = nextMetaDescription.trim();
    }
    if (!row.publishedAt && row.createdAt) {
      patch.publishedAt = row.createdAt;
    }
    const existingSources = (() => {
      try {
        const parsed = JSON.parse(row.sourceUrls || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();
    if (existingSources.length === 0 && spec.sources?.length) {
      patch.sourceUrls = JSON.stringify(spec.sources);
    }

    if (Object.keys(patch).length > 0) {
      await prisma.content.update({ where: { id: row.id }, data: patch });
      updated++;
      console.log(`Updated metadata defaults for ${spec.slug}:`, Object.keys(patch).join(', '));
    }
  }

  // 3. Unpublish & archive orphan non-update/duplicate drafts
  for (const slug of ORPHAN_ROWS_TO_ARCHIVE) {
    const row = await prisma.content.findUnique({ where: { slug } });
    if (!row) continue;
    if (row.isPublished || !row.archivedAt) {
      await prisma.content.update({
        where: { id: row.id },
        data: {
          isPublished: false,
          archivedAt: row.archivedAt ?? ARCHIVED_AT,
        },
      });
      updated++;
      console.log(`Archived orphan non-update draft: ${slug}`);
    }
  }

  // 4. Sync versioned chinaStudyHub.json into intakeCampaign 'china-study-research'
  const researchRecord = await prisma.intakeCampaign.findUnique({
    where: { slug: 'china-study-research' },
  });
  if (researchRecord) {
    const hub = JSON.parse(
      await readFile(new URL('../src/data/chinaStudyHub.json', import.meta.url), 'utf8'),
    );
    const parsed = JSON.parse(researchRecord.contentJson || '{}');
    if (JSON.stringify(parsed.hub) !== JSON.stringify(hub)) {
      await prisma.intakeCampaign.update({
        where: { id: researchRecord.id },
        data: { contentJson: JSON.stringify({ ...parsed, hub }) },
      });
      updated++;
      console.log('Synced chinaStudyHub.json into intakeCampaign china-study-research.');
    }
  }

  // 5. Clean superlative claims in University.notes and university-profile-details IntakeCampaign
  const apu = await prisma.university.findUnique({
    where: { slug: 'asia-pacific-university' },
    select: { id: true, notes: true },
  });
  if (apu?.notes && apu.notes.includes('100% graduate employment track record')) {
    await prisma.university.update({
      where: { id: apu.id },
      data: {
        notes: apu.notes.replace(
          '100% graduate employment track record',
          'Strong graduate employability track record across tech and business sectors',
        ),
      },
    });
    updated++;
    console.log('Cleaned employability superlative in University notes for asia-pacific-university.');
  }

  const profileDetails = await prisma.intakeCampaign.findUnique({
    where: { slug: 'university-profile-details' },
    select: { id: true, contentJson: true },
  });
  if (profileDetails?.contentJson && /100%\s+free\s+admission\s+processing/i.test(profileDetails.contentJson)) {
    await prisma.intakeCampaign.update({
      where: { id: profileDetails.id },
      data: {
        contentJson: profileDetails.contentJson.replace(/100%\s+free\s+admission\s+processing/gi, 'free admission processing'),
      },
    });
    updated++;
    console.log('Cleaned "100% free admission processing" superlatives in university-profile-details.');
  }

  // 6. Replace blank or generic "Admin"/"Administrator" Content authors with the organization name
  const contentRows = await prisma.content.findMany({
    select: { id: true, slug: true, author: true },
  });
  for (const row of contentRows) {
    const trimmed = typeof row.author === 'string' ? row.author.trim() : '';
    if (!trimmed || /^(admin|administrator|eduexpress)$/i.test(trimmed)) {
      await prisma.content.update({
        where: { id: row.id },
        data: { author: 'EduExpress International' },
      });
      updated++;
      console.log(`Normalized generic Content author for ${row.slug}.`);
    }
  }

  console.log(`SEO content hygiene sync complete (rows updated: ${updated}).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
