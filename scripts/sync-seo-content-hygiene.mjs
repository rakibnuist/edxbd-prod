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
  ['href="[Link to Study in China Entrance Exam Mock Test, if available]"', 'href="https://www.cscamaster.com/free-exam"'],
  ['<a href="https://www.csca.cn" target="_blank" rel="noopener noreferrer" class="accent-link">“Study in China” Entrance Exam Mock Test</a>', '<a href="https://www.cscamaster.com/free-exam" target="_blank" rel="noopener noreferrer" class="accent-link">CSCA Master Free Entrance Exam Mock Test</a>'],
  ['href="[Link to a page on your site listing Chinese universities or foundation programs]"', 'href="/china-universities"'],
  ['href="[Link to your contact page or consultation form]"', 'href="/education-fit-assessment"'],
];

const CSCA_BANGLADESH_ACTION_SECTION = `
  <section class="section" id="bangladesh-csca-action-guide">
    <div class="container">
      <div class="card">
        <h2 id="bangladesh-csca-guide">🇧🇩 VII. Bangladesh Applicant Action Guide: Dhaka Timetable (UTC+6), Fee Payment &amp; Home Proctoring</h2>
        <p>Bangladeshi students preparing for the 2026/2027 CSCA sittings face three practical hurdles: converting Beijing test blocks to Dhaka time, paying the CNY exam fee without local mobile wallets, and passing remote AI proctoring during power or broadband fluctuations. Use this verified checklist:</p>

        <h3>1. 2026–2027 CSCA Sitting Schedule in Bangladesh Standard Time (Dhaka UTC+6)</h3>
        <p>All official CSCA sessions on <a href="https://www.csca.cn" target="_blank" rel="noopener noreferrer">csca.cn</a> are published in Beijing Time (UTC+8), which is <strong>2 hours ahead of Dhaka (UTC+6)</strong>. Sessions alternate between two start blocks (check live countdowns on <a href="https://www.cscamaster.com/csca/countries/bangladesh" target="_blank" rel="noopener noreferrer">CSCA Master Bangladesh Schedule</a>):</p>
        <table>
          <thead>
            <tr>
              <th>Sitting Dates</th>
              <th>Day 1 (Dhaka Time · UTC+6)</th>
              <th>Day 2 (Dhaka Time · UTC+6)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>14–15 Nov 2026 · 23–24 Jan 2027 · 13–14 Mar 2027 · 24–25 Apr 2027</strong> (14:00 Beijing Block)</td>
              <td>Professional Chinese: <strong>12:00 PM – 1:30 PM</strong><br/>Mathematics: <strong>3:00 PM – 4:00 PM</strong></td>
              <td>Physics: <strong>12:00 PM – 1:00 PM</strong><br/>Chemistry: <strong>2:30 PM – 3:30 PM</strong></td>
            </tr>
            <tr>
              <td><strong>19–20 Dec 2026 · 26–27 Jun 2027</strong> (08:00 Beijing Block)</td>
              <td>Professional Chinese: <strong>6:00 AM – 7:30 AM</strong><br/>Mathematics: <strong>9:00 AM – 10:00 AM</strong></td>
              <td>Physics: <strong>6:00 AM – 7:00 AM</strong><br/>Chemistry: <strong>8:30 AM – 9:30 AM</strong></td>
            </tr>
          </tbody>
        </table>

        <h3>2. How to Pay the CNY 450 / CNY 700 CSCA Fee from Bangladesh</h3>
        <ul class="list styled">
          <li><strong>Dual-Currency Card Endorsement:</strong> Local BDT-only cards, bKash, and Nagad do not work directly on <code>csca.cn</code>. Use a <strong>Bangladeshi Visa or Mastercard endorsed for international e-commerce against your passport</strong> (or an authorized guardian/family international card).</li>
          <li><strong>Exact Passport Matching:</strong> Your registered full name, date of birth, and passport number on <code>csca.cn</code> must match your passport and your <a href="/csc-scholarship-bangladesh">CSC scholarship / university application</a> character-for-character. Any mismatch can void your score report or block entry on test day.</li>
        </ul>

        <h3>3. Remote Home-Based Test Survival Checklist (Bangladesh Power &amp; Broadband)</h3>
        <ul class="list styled">
          <li><strong>Windows Computer Required:</strong> The remote-proctored home test client requires a Windows desktop or laptop with a working webcam and microphone (macOS, iPads, and Chromebooks are not supported for the primary exam client).</li>
          <li><strong>Dual-Device Camera Setup:</strong> A secondary smartphone or tablet is required as your side/rear monitoring camera under AI proctoring rules.</li>
          <li><strong>Load-Shedding &amp; 20 Mbps Fail-Safe:</strong> Connect your Wi-Fi router to a mini-UPS, keep both your laptop and secondary phone at 100% charge, and keep a 4G mobile data hotspot (minimum 20 Mbps symmetric stability) ready so brief electricity cuts do not disconnect your proctored session.</li>
        </ul>

        <h3>4. Free CSCA Master Pro Access (CNY 99 Value) &amp; CSCA-Exempt Routes</h3>
        <p>Students who open a verified China undergraduate or CSC scholarship application file with EduExpress (<strong>BDT 0 file-opening charge</strong> and <strong>no EduExpress service fee before China visa approval</strong>) receive a complimentary <strong>CSCA Master Pro seat activation code</strong> on <a href="https://www.cscamaster.com/" target="_blank" rel="noopener noreferrer">cscamaster.com</a> — unlocking unlimited attempts across 155 full-length mock papers, 21 timed official past papers, and 2,867 syllabus drills. Want to check which Chinese universities require CSCA in 2027 vs 2028 or explore exemptions? Read our <a href="/updates/csca-exam-guide-chinese-universities-2026-2027">2026–2028 University CSCA Policy &amp; Exemption Roadmap</a> or <a href="/universities?country=China&amp;cscaFree=1">browse Chinese universities with CSCA-exempt options</a>.</p>

        <h2>❓ VIII. Frequently Asked Questions (FAQ)</h2>
        <details>
          <summary>Is the CSCA exam required for Master’s or PhD CSC Scholarship applicants from Bangladesh?</summary>
          <p>No. The CSCA is strictly an undergraduate (Bachelor’s) admission and scholarship assessment. Master’s and Doctoral (PhD) applicants for the Chinese Government Scholarship (CSC Type A and Type B) do not need to sit the CSCA; they are evaluated on their bachelor’s/master’s transcripts, research proposal, recommendation letters, and language proof.</p>
        </details>
        <details>
          <summary>How do I get free CSCA Master Pro exam preparation with EduExpress?</summary>
          <p>Complete a <a href="/education-fit-assessment">Free Education Fit Assessment</a> and open your verified China undergraduate or CSC scholarship application file with EduExpress (BDT 0 file-opening charge; no EduExpress service fee before China visa approval). Once your core academic documents are verified, your counselor issues a complimentary CSCA Master Pro activation code (worth CNY 99 per intake on cscamaster.com) unlocking all 155 mock tests and 21 timed official past papers. Note that official exam registration (CNY 450–700) is paid separately on csca.cn.</p>
        </details>
        <details>
          <summary>What is the CSCA exam time in Bangladesh (Dhaka time)?</summary>
          <p>Bangladesh (UTC+6) is 2 hours behind Beijing Time (UTC+8). For 14:00 Beijing sessions (Nov, Jan, Mar, Apr), Day 1 exams start at 12:00 PM Dhaka time (Professional Chinese) and 3:00 PM Dhaka time (Mathematics), while Day 2 starts at 12:00 PM (Physics) and 2:30 PM (Chemistry). For 08:00 Beijing sessions (Dec, Jun), exams start at 6:00 AM and 9:00 AM Dhaka time on Day 1, and 6:00 AM and 8:30 AM Dhaka time on Day 2.</p>
        </details>
        <details>
          <summary>Can I apply to Chinese universities for a Bachelor’s degree without taking CSCA?</summary>
          <p>While CSCA is mandatory for 2026/2027 Chinese Government Scholarship (CGS) undergraduate applicants and selected top-tier universities, several self-funded and university-scholarship undergraduate tracks still waive or do not require CSCA for the 2027 intake before universal rollout in 2028. Use our <a href="/universities?country=China&amp;cscaFree=1">CSCA-exempt Chinese university filter</a> to compare verified options.</p>
        </details>
      </div>
    </div>
  </section>
`;

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
    slug: 'complete-csc-universities-list-2027',
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

const INTERNAL_HREF_FIXES = [
  [/href=(["'])(?:https?:\/\/(?:www\.)?eduexpressint\.com)?\/assessment\/?([?#][^"']*)?\1/gi, (_m, q, s = '') => `href=${q}/education-fit-assessment${s}${q}`],
  [/href=(["'])(?:https?:\/\/(?:www\.)?eduexpressint\.com)?\/universities\/zhengzhou-university\/?((?:\/clear-cost)?(?:[?#][^"']*)?)\1/gi, (_m, q, s = '') => `href=${q}/universities/zzu${s}${q}`],
  [/href=(["'])(?:https?:\/\/(?:www\.)?eduexpressint\.com)?\/universities\/northwestern-polytechnical-university\/?((?:\/clear-cost)?(?:[?#][^"']*)?)\1/gi, (_m, q, s = '') => `href=${q}/universities/npu${s}${q}`],
  [/href=(["'])(?:https?:\/\/(?:www\.)?eduexpressint\.com)?\/universities\/jiangsu-normal-university\/?((?:\/clear-cost)?(?:[?#][^"']*)?)\1/gi, (_m, q, s = '') => `href=${q}/universities/jsnu${s}${q}`],
  [/href=(["'])(?:https?:\/\/(?:www\.)?eduexpressint\.com)?\/universities\/nanjing-university-of-posts-and-telecommunications\/?((?:\/clear-cost)?(?:[?#][^"']*)?)\1/gi, (_m, q, s = '') => `href=${q}/universities/njupt${s}${q}`],
];

function sanitizeStoredContentHtmlHygiene(html) {
  let next = html || '';
  for (const [pattern, replacer] of INTERNAL_HREF_FIXES) {
    next = next.replace(pattern, replacer);
  }
  next = next.replace(/<h1(\b[^>]*)>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');
  next = next.replace(/<img\b([^>]*)>/gi, (match, attrs) =>
    /\balt\s*=/i.test(attrs) ? match : `<img alt=""${attrs}>`,
  );
  return next;
}

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

  // 3b. Fix legacy /assessment + university alias links, stored <h1>, and missing img alt across ALL Content rows
  const allContentsForHygiene = await prisma.content.findMany({
    select: { id: true, slug: true, content: true },
  });
  for (const row of allContentsForHygiene) {
    const cleaned = sanitizeStoredContentHtmlHygiene(row.content);
    if (cleaned !== row.content) {
      await prisma.content.update({
        where: { id: row.id },
        data: { content: cleaned },
      });
      updated++;
      console.log(`Cleaned HTML internal links / heading / alt hygiene for ${row.slug}`);
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

  // 6.5. Migrate legacy 2026 CSC directory slug to 2027
  const legacyCscDirectory = await prisma.content.findUnique({
    where: { slug: 'complete-csc-universities-list-2026' },
  });
  if (legacyCscDirectory) {
    await prisma.content.update({
      where: { id: legacyCscDirectory.id },
      data: { slug: 'complete-csc-universities-list-2027' },
    });
    console.log('Migrated legacy CSC directory slug complete-csc-universities-list-2026 -> complete-csc-universities-list-2027');
  }

  // 7. Upgrade flagship CSC directory and CSCA guide to 2027 metadata, first-party assets, and headings
  const flagship2027Upgrades = [
    {
      slug: 'complete-csc-universities-list-2027',
      title: 'Complete CSC Universities List (2027 Cycle) - 306 Universities',
      metaTitle: 'CSC Universities List 2027 (306 Schools) | EduExpress',
      metaDescription:
        '2027 directory of 306 Chinese universities accepting Chinese Government Scholarship (CSC) applications, with verified admission criteria & guides.',
      excerpt:
        '2027 directory of 306 universities accepting Chinese Government Scholarship (CSC) applications for international students, with verified Bangladeshi admission profiles and Type A/B guidance.',
      featuredImage: '/updates/covers/complete-csc-universities-list-2027.jpg',
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
        'https://www.cscamaster.com/csca/countries/bangladesh',
      ],
      headingReplacements: [
        ['2026 CSCA Complete Guide: Your Path to Study in China', '2027 CSCA Complete Guide: Your Path to Study in China'],
        ['starting in 2026', 'for 2027 intakes'],
        ['Start preparing now for the 2026 CSCA', 'Start preparing now for the 2026–2027 CSCA'],
        ['First Global Test: <strong>December 21, 2025</strong>', '2026–2027 Sittings: <strong>Jan, Mar, Apr, Jun, Nov &amp; Dec</strong>'],
        ['Registration Opens: <strong>November 2025</strong>', 'Mock Practice: <a href="https://www.cscamaster.com/free-exam" target="_blank" rel="noopener noreferrer"><strong>Free on CSCA Master</strong></a>'],
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
    if (
      spec.slug === 'csca-guide-study-in-china' &&
      !nextContent.includes('id="bangladesh-csca-action-guide"')
    ) {
      const conclusionAnchor = '<h2 id="conclusion">';
      const idx = nextContent.indexOf(conclusionAnchor);
      if (idx !== -1) {
        const sectionStart = nextContent.lastIndexOf('<section class="section">', idx);
        if (sectionStart !== -1) {
          nextContent =
            nextContent.slice(0, sectionStart) +
            CSCA_BANGLADESH_ACTION_SECTION +
            '\n' +
            nextContent.slice(sectionStart);
        } else {
          nextContent += CSCA_BANGLADESH_ACTION_SECTION;
        }
      } else {
        nextContent += CSCA_BANGLADESH_ACTION_SECTION;
      }
    }

    const currentImage = typeof post.featuredImage === 'string' ? post.featuredImage.trim() : '';
    const nextImage = spec.featuredImage || currentImage;

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
