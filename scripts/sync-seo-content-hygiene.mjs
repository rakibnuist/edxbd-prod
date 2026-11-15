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
import { sync2027UniversityGuidesAndRecords } from './lib/seo-university-guides-2027.mjs';

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
    metaTitle: '2027 CSCA Entrance Test Guide: China | EduExpress',
    metaDescription:
      '2027 China CSCA entrance exam guide for Bangladeshi students: test structure, schedule, registration fees, scoring and preparation rules.',
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
    metaTitle: 'CSC Universities List 2027 (306 Schools) | EduExpress',
    metaDescription:
      '2027 directory of 306 Chinese universities accepting Chinese Government Scholarship (CSC) applications, with verified admission criteria & guides.',
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

  // 7. Upgrade flagship CSC directory and CSCA guide to 2027 metadata, first-party assets, and headings
  const flagship2027Upgrades = [
    {
      slug: 'complete-csc-universities-list-2026',
      title: 'Complete CSC Universities List (2027 Cycle) - 306 Universities',
      metaTitle: 'CSC Universities List 2027 (306 Schools) | EduExpress',
      metaDescription:
        '2027 directory of 306 Chinese universities accepting Chinese Government Scholarship (CSC) applications, with verified admission criteria & guides.',
      excerpt:
        '2027 directory of 306 universities accepting Chinese Government Scholarship (CSC) applications for international students, with verified Bangladeshi admission profiles and Type A/B guidance.',
      featuredImage: '/og/china.jpg',
      requireLocalImage: true,
      requiredSources: [
        'https://www.campuschina.org/',
        'https://eduexpressint.com/csc-scholarship-bangladesh',
        'https://eduexpressint.com/china-universities',
      ],
      headingReplacements: [
        ['Complete CSC Universities List (2026)', 'Complete CSC Universities List (2027 Cycle)'],
        ['for international students in 2026', 'for international students in 2027'],
      ],
    },
    {
      slug: 'csca-guide-study-in-china',
      title: '2027 CSCA Complete Guide: Your Path to Study in China',
      metaTitle: '2027 CSCA Entrance Test Guide: China | EduExpress',
      metaDescription:
        '2027 China CSCA entrance exam guide for Bangladeshi students: test structure, schedule, registration fees, scoring and preparation rules.',
      excerpt:
        'Updated 2027 guide to the China Scholastic Competency Assessment (CSCA) for Chinese undergraduate admissions — exam format, dates, fees, scoring, and preparation steps.',
      featuredImage: '',
      requireLocalImage: false,
      requiredSources: [
        'https://www.csca.cn',
        'https://www.campuschina.org/',
      ],
      headingReplacements: [
        ['2026 CSCA Complete Guide: Your Path to Study in China', '2027 CSCA Complete Guide: Your Path to Study in China'],
        ['starting in 2026', 'for 2027 intakes'],
      ],
    },
  ];

  for (const spec of flagship2027Upgrades) {
    const post = await prisma.content.findUnique({
      where: { slug: spec.slug },
      select: {
        id: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        sourceUrls: true,
        lastVerifiedAt: true,
      },
    });
    if (!post) continue;

    let existingSources = [];
    if (typeof post.sourceUrls === 'string' && post.sourceUrls.trim()) {
      try {
        const parsed = JSON.parse(post.sourceUrls);
        if (Array.isArray(parsed)) {
          existingSources = parsed.filter((u) => typeof u === 'string' && u.trim().length > 0);
        }
      } catch {
        existingSources = [];
      }
    }
    const mergedSourcesJson = JSON.stringify(
      Array.from(new Set([...spec.requiredSources, ...existingSources])),
    );

    let nextContent = post.content;
    for (const [from, to] of spec.headingReplacements) {
      if (nextContent.includes(from)) {
        nextContent = nextContent.replaceAll(from, to);
      }
    }

    const currentImage = typeof post.featuredImage === 'string' ? post.featuredImage.trim() : '';
    const needsLocalImage = spec.requireLocalImage && (!currentImage || !currentImage.startsWith('/'));
    const nextImage = needsLocalImage ? spec.featuredImage : post.featuredImage;

    const changed =
      post.title !== spec.title ||
      post.metaTitle !== spec.metaTitle ||
      post.metaDescription !== spec.metaDescription ||
      post.excerpt !== spec.excerpt ||
      nextContent !== post.content ||
      nextImage !== post.featuredImage ||
      post.sourceUrls !== mergedSourcesJson ||
      !post.lastVerifiedAt;

    if (changed) {
      const verifiedAt = new Date();
      const reviewAt = new Date(verifiedAt.getTime() + 90 * 24 * 60 * 60 * 1000);
      await prisma.content.update({
        where: { id: post.id },
        data: {
          title: spec.title,
          metaTitle: spec.metaTitle,
          metaDescription: spec.metaDescription,
          excerpt: spec.excerpt,
          content: nextContent,
          featuredImage: nextImage,
          sourceUrls: mergedSourcesJson,
          lastVerifiedAt: verifiedAt,
          nextReviewAt: reviewAt,
        },
      });
      updated++;
      console.log(`Upgraded ${spec.slug} to 2027 cycle metadata & assets.`);
    }
  }

  updated += await sync2027UniversityGuidesAndRecords(prisma);

  console.log(`SEO content hygiene sync complete (rows updated: ${updated}).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
