import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const ROOT = process.cwd();
const read = (relPath) => fs.readFileSync(path.join(ROOT, relPath), 'utf8');

const toBengaliDigits = (value) =>
  String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);

test('CSC pages match primary CSC scholarship research constraints', () => {
  const research = JSON.parse(read('data/research/china-scholarship-guide.json'));
  const enCsc = read('src/app/csc-scholarship-bangladesh/page.tsx');
  const bnCsc = read('src/app/bn/csc-scholarship-bangladesh/page.tsx');

  // Verify stipends, exclusive age bounds, and insurance dynamically from research JSON
  for (const cat of research.standardCsc.categories) {
    const formattedStipend = cat.monthlyStipend.toLocaleString('en-US');
    const bnStipend = toBengaliDigits(formattedStipend);
    assert.ok(enCsc.includes(formattedStipend), `Missing EN CSC stipend ${formattedStipend} for ${cat.id}`);
    assert.ok(bnCsc.includes(bnStipend), `Missing BN CSC stipend ${bnStipend} for ${cat.id}`);
    assert.ok(
      enCsc.includes(`under ${cat.ageLimitExclusive}`),
      `Missing EN exclusive age limit under ${cat.ageLimitExclusive} for ${cat.id}`
    );
    assert.ok(
      bnCsc.includes(`${toBengaliDigits(cat.ageLimitExclusive)} বছরের কম`),
      `Missing BN exclusive age limit ${toBengaliDigits(cat.ageLimitExclusive)} বছরের কম for ${cat.id}`
    );
  }

  const { annualPolicyValue, shortProgrammePolicyValue } = research.standardCsc.insurance;
  assert.ok(enCsc.includes(`CNY ${annualPolicyValue}`));
  assert.ok(enCsc.includes(`CNY ${shortProgrammePolicyValue}`));
  assert.ok(bnCsc.includes(`CNY ${toBengaliDigits(annualPolicyValue)}`));
  assert.ok(bnCsc.includes(`CNY ${toBengaliDigits(shortProgrammePolicyValue)}`));

  for (const banned of [
    'Minimum 800 words',
    'Valid for at least 12 months',
    'All academic certificates and transcripts must be notarized and verified by the Ministry of Foreign Affairs (MOFA) Bangladesh before submitting to CSC',
  ]) {
    assert.ok(!enCsc.includes(banned), `Forbidden unresearched CSC claim present: "${banned}"`);
  }

  for (const snippet of [
    '২,৫০০',
    '৩,০০০',
    '৩,৫০০',
    'CNY ৮০০',
    'CNY ৪০০',
    '২৫ বছরের কম',
    '৩৫ বছরের কম',
    '৪০ বছরের কম',
    '৪৫ বছরের কম',
    '৫০ বছরের কম',
  ]) {
    assert.ok(bnCsc.includes(snippet), `Missing researched CSC fact "${snippet}" in BN CSC guide`);
  }

  for (const banned of ['অনূর্ধ্ব ২৫', 'অনূর্ধ্ব ৩৫', 'অনূর্ধ্ব ৪০', '১০০% গ্যারান্টি']) {
    assert.ok(!bnCsc.includes(banned), `Imprecise CSC boundary or guarantee in BN CSC guide: "${banned}"`);
  }
});

test('Bengali China cost, visa, and MBBS guides avoid unresearched rates, solvency myths, and guarantee phrasing', () => {
  const pages = [
    'src/app/bn/csc-scholarship-bangladesh/page.tsx',
    'src/app/bn/study-in-china-cost-bangladesh/page.tsx',
    'src/app/bn/china-student-visa-bangladesh/page.tsx',
    'src/app/bn/mbbs-in-china-bangladesh/page.tsx',
  ];

  const bannedClaims = [
    '১৮.৬৬',
    '18.66',
    '১২২ টাকা',
    'শতভাগ',
    '১০০%',
    '৫ থেকে ৮ লাখ',
    'BMDC ও WHO',
    '৪ থেকে ৭ কার্যদিবস',
    '৩ মাসের সিঙ্গেল',
  ];

  for (const relPath of pages) {
    const content = read(relPath);
    for (const banned of bannedClaims) {
      assert.ok(!content.includes(banned), `Forbidden unresearched claim "${banned}" found in ${relPath}`);
    }
  }

  const bnCost = read('src/app/bn/study-in-china-cost-bangladesh/page.tsx');
  const bnVisa = read('src/app/bn/china-student-visa-bangladesh/page.tsx');

  for (const target of [bnCost, bnVisa]) {
    assert.ok(target.includes('USD ২,৫০০'), 'Missing primary Chinese Embassy USD 2,500 bank threshold note');
    assert.ok(target.includes('Complete China Support Package'), 'Missing consolidated China support package name');
    assert.ok(target.includes('BDT ২,০০,০০০'), 'Missing Complete China Support Package BDT 2,00,000 note');
  }
});

test('Canonical Dhanmondi NAP is aligned and legacy office/package duplicates are cleaned in seed & footer', () => {
  const officeLib = read('src/lib/office-record.ts');
  const trustSeed = read('scripts/seed-trust-records.js');
  const footer = read('src/components/Footer.tsx');
  const localSeoSkill = read('.agents/skills/eduexpress-local-entity-seo/SKILL.md');

  assert.ok(officeLib.includes("'dhanmondi-decision-desk'"));
  assert.ok(officeLib.includes("'Saturday to Thursday, 11:00 AM to 6:00 PM'"));
  assert.ok(trustSeed.includes("'dhanmondi-decision-desk'"));
  assert.ok(trustSeed.includes("'Saturday to Thursday, 11:00 AM to 6:00 PM'"));
  assert.ok(
    trustSeed.includes("prisma.office.deleteMany") && trustSeed.includes("slug: 'dhanmondi-head-office'"),
    'Trust seed must remove legacy dhanmondi-head-office duplicate'
  );
  assert.ok(
    trustSeed.includes("slug: 'china-complete-support-package'") && trustSeed.includes('isPublished: false'),
    'Trust seed must publish china-complete-support-package and keep legacy package slugs unpublished'
  );
  assert.ok(!footer.includes('41/A'), 'Footer fallback must never contain stale House 41/A address');
  assert.ok(footer.includes('DEFAULT_OFFICE_RECORD'), 'Footer must use canonical DEFAULT_OFFICE_RECORD fallback');
  assert.ok(!localSeoSkill.includes('9:00 AM'), 'Local SEO skill NAP hours must match canonical 11:00 AM - 6:00 PM');
  assert.ok(
    localSeoSkill.includes('Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209'),
    'Local SEO skill NAP address must include Evergreen Latif canonical line'
  );
});

test('Step 2 SEO: citationJsonLd, bilingual trails/cross-links, OG locale, sitemaps, benchmark JSON & Dhaka FAQ', () => {
  const jsonLd = read('src/lib/json-ld.ts');
  assert.ok(jsonLd.includes('export function citationJsonLd('), 'json-ld.ts must export citationJsonLd');
  assert.ok(jsonLd.includes('toSafeExternalUrl') && jsonLd.includes("'@type': 'CreativeWork'"));

  const bnPages = [
    'src/app/bn/study-in-china/page.tsx',
    'src/app/bn/china-student-visa-bangladesh/page.tsx',
    'src/app/bn/study-in-china-cost-bangladesh/page.tsx',
    'src/app/bn/mbbs-in-china-bangladesh/page.tsx',
    'src/app/bn/csc-scholarship-bangladesh/page.tsx',
  ];
  for (const relPath of bnPages) {
    const src = read(relPath);
    assert.ok(src.includes('const trail: Crumb[] ='), `${relPath} must type trail as Crumb[]`);
    assert.ok(!/const trail[^;]*href:\s*'\/bn\//s.test(src), `${relPath} trail must use path:, not href:`);
  }
  for (const relPath of bnPages) {
    const src = read(relPath);
    assert.ok(src.includes('citationJsonLd('), `${relPath} must emit citationJsonLd`);
    assert.ok(src.includes('reviewedBy:') && src.includes('mainEntityOfPage:'), `${relPath} must emit reviewedBy & mainEntityOfPage`);
  }

  const guideData = read('src/data/chinaGuidePages.ts');
  assert.ok(guideData.includes("type: 'article'") && guideData.includes("locale: 'en_BD'"));
  for (const slug of [
    'china-admission-requirements',
    'china-scholarships-bangladesh',
    'china-student-visa-bangladesh',
    'study-in-china-cost-bangladesh',
    'study-in-china-without-ielts',
    'life-in-china-bangladeshi-students',
    'china-intakes-deadlines',
  ]) {
    const wrapper = read(`src/app/${slug}/page.tsx`);
    assert.ok(
      wrapper.includes("type: 'article'") && wrapper.includes("locale: 'en_BD'"),
      `${slug}/page.tsx metadata must declare type: 'article' and locale: 'en_BD'`
    );
  }

  const guideComp = read('src/components/china/ChinaGuidePage.tsx');
  assert.ok(guideComp.includes('...citationJsonLd(guide.sources)'));
  assert.ok(guideComp.includes('/bn/study-in-china-cost-bangladesh') && guideComp.includes('/bn/china-student-visa-bangladesh'));

  assert.ok(read('src/app/study-in-china-from-bangladesh/page.tsx').includes("href=\"/bn/study-in-china\""));
  assert.ok(read('src/app/csc-scholarship-bangladesh/page.tsx').includes("href=\"/bn/csc-scholarship-bangladesh\""));
  assert.ok(read('src/app/mbbs-in-china-bangladesh/page.tsx').includes("href=\"/bn/mbbs-in-china-bangladesh\""));

  const guidesSitemap = read('src/app/sitemaps/guides.xml/route.ts');
  for (const slug of [
    'csc-scholarship-bangladesh',
    'china-march-2027-intake',
    'malaysia-study-cost-bangladesh',
    'malaysia-student-visa-bangladesh',
    'bn/china-student-visa-bangladesh',
    'bn/study-in-china-cost-bangladesh',
    'bn/csc-scholarship-bangladesh',
    'bn/mbbs-in-china-bangladesh',
  ]) {
    assert.ok(guidesSitemap.includes(`'${slug}'`), `guides.xml must include ${slug}`);
  }
  assert.ok(guidesSitemap.includes('handbuiltStaticGuides.has(slug)'));

  const mainSitemap = read('src/app/sitemap.ts');
  const tail = mainSitemap.slice(mainSitemap.indexOf('const categoryRoutes'));
  assert.ok(!tail.includes('lastModified: new Date()'), 'sitemap.ts category/city routes must not emit synthetic new Date() lastModified');

  const reportPage = read('src/app/china-study-report-bangladesh/page.tsx');
  const reportJson = read('src/app/china-study-report.json/route.ts');
  assert.ok(reportPage.includes("'@type': 'DataDownload'") && reportPage.includes('/china-study-report.json'));
  assert.ok(reportPage.includes('CHINA_REPORT_OFFICIAL_AUTHORITIES') && reportJson.includes('CHINA_REPORT_OFFICIAL_AUTHORITIES'));
  assert.ok(reportPage.includes('ReportCitationActions'));
  assert.ok(read('public/llms.txt').includes('/china-study-report.json'));
  assert.ok(read('src/lib/machine-readable.ts').includes('/china-study-report.json'));
  assert.ok(read('src/lib/machine-readable.ts').includes('officialAuthoritiesBlock'));

  assert.ok(read('src/app/universities/[slug]/page.tsx').includes('event="university_view"'));
  assert.ok(read('src/app/china-success-stories/page.tsx').includes('event="success_story_view"'));
  assert.ok(read('src/components/finders/CostCompare.tsx').includes('trackCompareCompleted'));

  const prodSeed = read('scripts/seed-production-db.mjs');
  assert.ok(prodSeed.includes('scripts/seed-trust-records.js'), 'seed-production-db.mjs must sync canonical Dhanmondi trust records on deploy');
  assert.ok(prodSeed.includes('scripts/archive-expired-intake-posts.mjs'), 'seed-production-db.mjs must archive expired March 2026 posts');
  assert.ok(prodSeed.includes('scripts/sync-seo-content-hygiene.mjs'), 'seed-production-db.mjs must run SEO content hygiene on deploy');
  assert.ok(read('scripts/archive-expired-intake-posts.mjs').includes('bnu-zhuhai-mba-mpa-scholarship-2026'));

  assert.ok(read('src/app/csc-scholarship-bangladesh/page.tsx').includes('/updates/complete-csc-universities-list-2026'));
  assert.ok(guideComp.includes('/updates/csca-guide-study-in-china') && guideComp.includes('/updates/china-k-visa'));

  const dhakaPage = read('src/app/education-consultant-dhaka/page.tsx');
  assert.ok(dhakaPage.includes('<FaqBlock') && dhakaPage.includes('EduExpress Ltd.') && dhakaPage.includes('DEFAULT_OFFICE_RECORD'));

  const countriesSource = read('src/lib/countries.ts');
  const finlandBlock = countriesSource.slice(
    countriesSource.indexOf("slug: 'finland'"),
    countriesSource.indexOf("slug: 'cyprus'"),
  );
  assert.ok(finlandBlock.includes('€9,600') && finlandBlock.includes('€800/month'));
  assert.ok(!finlandBlock.includes('€6,720') && !finlandBlock.includes('€560/month'));

  const croatiaBlock = countriesSource.slice(
    countriesSource.indexOf("slug: 'croatia'"),
    countriesSource.indexOf("slug: 'georgia'"),
  );
  assert.ok(!/schengen/i.test(croatiaBlock), 'Croatia destination copy must not sell Schengen');
  assert.ok(!countriesSource.includes('Schengen-adjacent'));

  for (const relPath of [
    'src/app/study-in-malaysia-from-bangladesh/page.tsx',
    'src/app/malaysia-study-cost-bangladesh/page.tsx',
    'src/app/malaysia-student-visa-bangladesh/page.tsx',
  ]) {
    const src = read(relPath);
    assert.ok(src.includes("locale: 'en_BD'"), `${relPath} must use en_BD locale`);
    assert.ok(src.includes('citationJsonLd('), `${relPath} must emit citationJsonLd`);
  }

  const malaysiaCost = read('src/app/malaysia-study-cost-bangladesh/page.tsx');
  assert.ok(malaysiaCost.includes('Planning Assumption'));
  assert.ok(!malaysiaCost.includes('Official Planning Baseline'));
  assert.ok(!malaysiaCost.includes('100% halal'));

  const malaysiaHub = read('src/app/study-in-malaysia-from-bangladesh/page.tsx');
  assert.ok(!malaysiaHub.includes('100% Employability'));

  const chinaHubJson = read('src/data/chinaStudyHub.json');
  for (const href of [
    '/csc-scholarship-bangladesh',
    '/china-march-2027-intake',
    '/china-study-report-bangladesh',
    '/updates/china-k-visa',
  ]) {
    assert.ok(chinaHubJson.includes(href), `chinaStudyHub.json must cross-link ${href}`);
  }
  assert.ok(
    read('src/app/study-in-china-from-bangladesh/page.tsx').includes('/updates/csca-guide-study-in-china'),
    'study-in-china-from-bangladesh must cross-link /updates/csca-guide-study-in-china',
  );

  const bnHub = read('src/app/bn/study-in-china/page.tsx');
  assert.ok(bnHub.includes("hrefLang={item.href.startsWith('/bn/') ? 'bn' : 'en'}"));
  for (const href of ['/china-march-2027-intake', '/updates/csca-guide-study-in-china', '/updates/china-k-visa']) {
    assert.ok(bnHub.includes(href), `bn/study-in-china must link to ${href}`);
  }

  assert.ok(read('src/app/destinations/[country]/page.tsx').includes('citationJsonLd('));
  assert.ok(read('src/app/updates/[slug]/page.tsx').includes('citationJsonLd('));
  const mainSitemapSrc = read('src/app/sitemap.ts');
  assert.ok(mainSitemapSrc.includes('publicTestimonialWhere') && mainSitemapSrc.includes('/success-stories'));
  assert.ok(!read('src/lib/university-profile-seo.ts').includes('100% free'));

  const chinaIntakesSrc = read('src/app/china-intakes-deadlines/page.tsx');
  assert.ok(chinaIntakesSrc.includes('citationJsonLd('));
  assert.ok(chinaIntakesSrc.includes('/updates/csca-guide-study-in-china'));
  assert.ok(chinaIntakesSrc.includes('/updates/china-k-visa'));

  const evidenceSrc = read('src/data/evidencePages.ts');
  assert.ok(!evidenceSrc.includes("'2026-10-19'"));
  for (const key of ['better-education-standard', 'how-we-verify-universities', 'compare-study-destinations', 'country-status']) {
    const start = evidenceSrc.indexOf(`slug: '${key}'`);
    assert.ok(start !== -1, `Missing evidence page ${key}`);
    assert.ok(evidenceSrc.indexOf('sources:', start) !== -1, `Evidence page ${key} must include official sources`);
  }

  assert.ok(!read('scripts/seed-malaysia-catalog.mjs').includes('100% graduate employment'));
  assert.ok(!read('scripts/complete-all-universities-data.mjs').includes('100% free admission processing'));

  const uniProfileClient = read('src/components/universities/UniversityProfileClient.tsx');
  assert.ok(!uniProfileClient.includes('100% free'), 'UniversityProfileClient must not advertise "100% free"');

  const countriesXmlSrc = read('src/app/sitemaps/countries.xml/route.ts');
  for (const dupSlug of [
    'bn/china-student-visa-bangladesh',
    'bn/study-in-china-cost-bangladesh',
    'bn/csc-scholarship-bangladesh',
    'bn/mbbs-in-china-bangladesh',
  ]) {
    assert.ok(!countriesXmlSrc.includes(dupSlug), `countries.xml must not duplicate guide ${dupSlug}`);
  }

  const layoutSrc = read('src/app/layout.tsx');
  assert.ok(layoutSrc.includes('publishingPrinciples') && layoutSrc.includes('actionableFeedbackPolicy'));
  assert.ok(read('src/app/programs/page.tsx').includes('ItemList'));
  assert.ok(read('src/lib/machine-readable.ts').includes('OFFICIAL_COUNTRY_SOURCES'));
});

test('Step 13 — success stories, updates category, and Bengali China hub cross-links stay coherent', () => {
  const categoryPage = read('src/app/updates/category/[category]/page.tsx');
  assert.ok(categoryPage.includes('mainEntityOfPage: url'));
  assert.ok(categoryPage.includes("isPartOf: { '@id': 'https://eduexpressint.com/#website' }"));
  assert.ok(categoryPage.includes('dateModified: latestPostDate'));

  const guides = read('src/app/updates/guides.ts');
  for (const href of [
    '/china-intakes-deadlines',
    '/china-scholarships-bangladesh',
    '/csc-scholarship-bangladesh',
    '/mbbs-in-china-bangladesh',
    '/china-study-report-bangladesh',
    '/updates/csca-guide-study-in-china',
  ]) {
    assert.ok(guides.includes(href), `updates/guides.ts must include ${href}`);
  }

  const storiesPage = read('src/app/success-stories/page.tsx');
  assert.ok(storiesPage.includes('breadcrumb: { \'@id\': `${canonical}#breadcrumb` }'));
  assert.ok(storiesPage.includes('mainEntityOfPage: canonical'));
  assert.ok(storiesPage.includes('/china-success-stories'));
  assert.ok(storiesPage.includes('/china-study-report-bangladesh'));

  const chinaStoriesPage = read('src/app/china-success-stories/page.tsx');
  assert.ok(chinaStoriesPage.includes('mainEntityOfPage: canonical'));
  assert.ok(chinaStoriesPage.includes('/success-stories'));
  assert.ok(chinaStoriesPage.includes('/china-study-report-bangladesh'));

  const bnCross = read('src/components/page/BnChinaRelatedGuides.tsx');
  for (const href of [
    '/bn/study-in-china',
    '/bn/study-in-china-cost-bangladesh',
    '/bn/csc-scholarship-bangladesh',
    '/bn/china-student-visa-bangladesh',
    '/bn/mbbs-in-china-bangladesh',
    '/china-march-2027-intake',
    '/china-study-report-bangladesh',
    '/updates/csca-guide-study-in-china',
    '/updates/china-k-visa',
  ]) {
    assert.ok(bnCross.includes(href), `BnChinaRelatedGuides must include ${href}`);
  }

  for (const bnFile of [
    'src/app/bn/csc-scholarship-bangladesh/page.tsx',
    'src/app/bn/mbbs-in-china-bangladesh/page.tsx',
    'src/app/bn/study-in-china-cost-bangladesh/page.tsx',
    'src/app/bn/china-student-visa-bangladesh/page.tsx',
  ]) {
    assert.ok(read(bnFile).includes('<BnChinaRelatedGuides'), `${bnFile} must render <BnChinaRelatedGuides>`);
  }
});

test('Step 14 — llms.txt, IndexNow, ChinaGuidePage bilingual links & core conversion pages stay fresh', () => {
  const llms = read('public/llms.txt');
  for (const needle of [
    'https://eduexpressint.com/sitemap.xml',
    'https://eduexpressint.com/updates/csca-guide-study-in-china',
    'https://eduexpressint.com/updates/china-k-visa',
    'https://eduexpressint.com/china-success-stories',
  ]) {
    assert.ok(llms.includes(needle), `public/llms.txt must include ${needle}`);
  }

  const indexNow = read('src/lib/indexnow.ts');
  assert.ok(indexNow.includes("'/updates/csca-guide-study-in-china'"));
  assert.ok(indexNow.includes("'/updates/china-k-visa'"));

  const chinaGuideComp = read('src/components/china/ChinaGuidePage.tsx');
  assert.ok(chinaGuideComp.includes("'/china-scholarships-bangladesh'"));
  assert.ok(chinaGuideComp.includes("'/bn/csc-scholarship-bangladesh'"));
  assert.ok(chinaGuideComp.includes("'/china-march-2027-intake'"));

  for (const freshFile of [
    'src/app/find-education/page.tsx',
    'src/app/scholarships/page.tsx',
    'src/app/your-study-journey/page.tsx',
    'src/app/education-fit-assessment/page.tsx',
    'src/app/fees-and-transparency/page.tsx',
    'src/app/for-parents/page.tsx',
    'src/app/services/page.tsx',
    'src/app/proof-library/page.tsx',
  ]) {
    assert.ok(read(freshFile).includes('2026-11-15'), `${freshFile} must carry refreshed 2026-11-15 review date`);
  }
});
