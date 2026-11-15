import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const BUILD_APP_DIR = path.join(process.cwd(), '.next', 'server', 'app');

function walkHtml(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkHtml(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results.sort();
}

const decode = (value) =>
  value
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const routeFromFile = (file) =>
  '/' +
  path
    .relative(BUILD_APP_DIR, file)
    .replace(/\\/g, '/')
    .replace(/\.html$/, '')
    .replace(/^index$/, '')
    .replace(/\/index$/, '');

test('Pre-deploy SEO Launch Acceptance Audit across built Next.js artifacts', () => {
  assert.ok(
    fs.existsSync(path.join(BUILD_APP_DIR, 'index.html')),
    'Built artifacts missing under .next/server/app — run `npm run build` first.',
  );

  const htmlFiles = walkHtml(BUILD_APP_DIR);
  const redirectTargets = new Set([
    '/destinations/china',
    '/destinations/malaysia',
    '/destinations/netherlands',
    '/home',
    '/complaints-and-review',
    '/success-stories/china',
  ]);

  let auditedCount = 0;

  for (const file of htmlFiles) {
    const rel = routeFromFile(file);
    if (rel.startsWith('/_') || rel.startsWith('/admin') || rel.startsWith('/login')) continue;
    const html = fs.readFileSync(file, 'utf8');
    // Redirect-only shells (`permanentRedirect` in Next.js App Router) render __next_error__ markers
    if (html.includes('id="__next_error__"')) continue;

    auditedCount += 1;

    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    assert.ok(titleMatch, `${rel}: missing <title>`);
    const title = decode(titleMatch[1].trim());
    assert.ok(title.length > 0, `${rel}: empty <title>`);
    assert.ok((title.match(/EduExpress/gi) || []).length <= 1, `${rel}: doubled brand title "${title}"`);

    const descMatch =
      html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i);
    assert.ok(descMatch && descMatch[1].trim().length > 0, `${rel}: missing meta description`);

    const robots = html.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"/i)?.[1] || '';
    const isNoindex = /noindex/i.test(robots);
    const canonicals = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/gi)].map((m) => m[1]);

    if (!isNoindex) {
      assert.equal(canonicals.length, 1, `${rel}: expected 1 canonical, got ${canonicals.length}`);
      if (rel !== '/') {
        assert.notEqual(canonicals[0], 'https://eduexpressint.com', `${rel}: inner page canonicalized to homepage`);
      }
      const expectedCanonical = rel.startsWith('/destinations/')
        ? `https://eduexpressint.com/study-in-${rel.slice('/destinations/'.length)}-from-bangladesh`
        : `https://eduexpressint.com${rel === '/' ? '' : rel}`;
      assert.equal(canonicals[0], expectedCanonical, `${rel}: unexpected canonical "${canonicals[0]}"`);
      assert.equal([...html.matchAll(/<h1\b/gi)].length, 1, `${rel}: expected exactly 1 <h1>`);
    }

    const ogLocale = html.match(/<meta[^>]*property="og:locale"[^>]*content="([^"]*)"/i)?.[1];
    assert.notEqual(ogLocale, 'en_US', `${rel}: stale en_US og:locale emitted`);

    for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
      const parsed = JSON.parse(match[1]);
      assert.ok(!JSON.stringify(parsed).includes('aggregateRating'), `${rel}: forbidden self-serving aggregateRating`);
    }

    for (const leaked of ['41/A,', 'dhanmondi-head-office', '9:00 AM', '100% visa', 'guaranteed visa', '/home/rakib/']) {
      assert.ok(!html.toLowerCase().includes(leaked.toLowerCase()), `${rel}: leaked forbidden text "${leaked}"`);
    }

    for (const linkMatch of html.matchAll(/<a\b[^>]*href="([^"]*)"/gi)) {
      const href = linkMatch[1];
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const cleanPath = href.split('#')[0].split('?')[0] || '/';
      assert.ok(!redirectTargets.has(cleanPath), `${rel}: links to redirecting URL "${href}"`);
    }

    for (const imgMatch of html.matchAll(/<img\b([^>]*)>/gi)) {
      const attrs = imgMatch[1];
      const src = attrs.match(/\bsrc="([^"]*)"/i)?.[1] || '';
      const alt = attrs.match(/\balt="([^"]*)"/i)?.[1];
      assert.ok(alt !== undefined, `${rel}: <img> missing alt attribute (${src})`);
      if (src.startsWith('/') && !src.startsWith('/_next/') && !src.startsWith('/images/uploaded')) {
        const assetPath = path.join(process.cwd(), 'public', src.split('?')[0]);
        assert.ok(fs.existsSync(assetPath), `${rel}: broken local image "${src}"`);
      }
    }
  }

  assert.ok(auditedCount >= 180, `Expected >= 180 audited indexable HTML pages, got ${auditedCount}`);

  // Machine-readable & benchmark artifact assertions
  const reportJson = JSON.parse(fs.readFileSync(path.join(BUILD_APP_DIR, 'china-study-report.json.body'), 'utf8'));
  assert.ok(reportJson.report.universityCount >= 100, 'Expected active China university benchmark count >= 100');
  assert.equal(reportJson.officialSources.length, 6);
  assert.equal(
    reportJson.publisher.address,
    'Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209',
  );
  assert.equal(reportJson.publisher.hours, 'Saturday to Thursday, 11:00 AM to 6:00 PM');

  const reportHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-study-report-bangladesh.html'), 'utf8');
  assert.ok(reportHtml.includes('https://eduexpressint.com/china-study-report.json'));
  assert.ok(reportHtml.includes('DataDownload'));

  const llmsFull = fs.readFileSync(path.join(BUILD_APP_DIR, 'llms-full.txt.body'), 'utf8');
  assert.ok(llmsFull.includes('https://eduexpressint.com/china-study-report.json'));
  assert.ok(fs.existsSync(path.join(BUILD_APP_DIR, 'pricing.md.body')));
  assert.ok(fs.existsSync(path.join(BUILD_APP_DIR, 'robots.txt.body')));
  assert.ok(fs.existsSync(path.join(BUILD_APP_DIR, 'sitemap.xml.body')));

  const dhakaHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'education-consultant-dhaka.html'), 'utf8');
  assert.ok(dhakaHtml.includes('EduExpress Ltd.') && dhakaHtml.includes('FAQPage'));

  const partnershipHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'partnership.html'), 'utf8');
  assert.ok(partnershipHtml.includes('institutional-cooperation') && partnershipHtml.includes('/china-study-report-bangladesh'));

  const aboutHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'about.html'), 'utf8');
  assert.ok(aboutHtml.includes('Abdullah Al Rakib') && aboutHtml.includes('EduExpress Ltd.'));

  const cscHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'csc-scholarship-bangladesh.html'), 'utf8');
  assert.ok(
    cscHtml.includes('/updates/complete-csc-universities-list-2026') &&
      cscHtml.includes('/updates/csca-guide-study-in-china'),
  );

  const reqHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-admission-requirements.html'), 'utf8');
  assert.ok(reqHtml.includes('/updates/csca-guide-study-in-china') && reqHtml.includes('/updates/china-k-visa'));

  const finlandHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'destinations', 'finland.html'), 'utf8');
  assert.ok(finlandHtml.includes('9,600') && !finlandHtml.includes('6,720'));

  const croatiaHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'destinations', 'croatia.html'), 'utf8');
  assert.ok(!/schengen/i.test(croatiaHtml), 'study-in-croatia-from-bangladesh must not sell Schengen');

  for (const slug of [
    'bn/china-student-visa-bangladesh',
    'bn/study-in-china-cost-bangladesh',
    'bn/csc-scholarship-bangladesh',
    'bn/mbbs-in-china-bangladesh',
  ]) {
    const html = fs.readFileSync(path.join(BUILD_APP_DIR, `${slug}.html`), 'utf8');
    assert.ok(html.includes('https://eduexpressint.com/bn/study-in-china'), `${slug}: missing BN hub breadcrumb`);
  }

  const malaysiaCostHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'malaysia-study-cost-bangladesh.html'), 'utf8');
  assert.ok(
    malaysiaCostHtml.includes('Planning Assumption') && malaysiaCostHtml.includes('educationmalaysia.gov.my'),
    'malaysia-study-cost-bangladesh must include Planning Assumption and EMGS citation',
  );
  assert.ok(!malaysiaCostHtml.includes('Official Planning Baseline'));

  const chinaHubHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'study-in-china-from-bangladesh.html'), 'utf8');
  for (const href of [
    '/csc-scholarship-bangladesh',
    '/china-march-2027-intake',
    '/china-study-report-bangladesh',
    '/updates/china-k-visa',
    '/updates/csca-guide-study-in-china',
  ]) {
    assert.ok(chinaHubHtml.includes(href), `study-in-china-from-bangladesh must link to ${href}`);
  }

  const bnHubHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'bn', 'study-in-china.html'), 'utf8');
  assert.ok(
    bnHubHtml.includes('CreativeWork') && bnHubHtml.includes('/updates/csca-guide-study-in-china'),
    'bn/study-in-china must emit citationJsonLd and link CSCA guide',
  );

  const ukHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'destinations', 'uk.html'), 'utf8');
  assert.ok(
    ukHtml.includes('https://www.gov.uk/student-visa') && ukHtml.includes('CreativeWork'),
    'destinations/uk must include UKVI official link and citationJsonLd',
  );
  assert.ok(finlandHtml.includes('https://migri.fi/en/studying-in-finland'), 'destinations/finland must include Migri URL');

  const sitemapBody = fs.readFileSync(path.join(BUILD_APP_DIR, 'sitemap.xml.body'), 'utf8');
  assert.ok(
    sitemapBody.includes('https://eduexpressint.com/success-stories') &&
      sitemapBody.includes('https://eduexpressint.com/china-success-stories'),
    'sitemap.xml must include consented success-story routes',
  );

  const intakesHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-intakes-deadlines.html'), 'utf8');
  assert.ok(
    intakesHtml.includes('CreativeWork') &&
      intakesHtml.includes('/updates/csca-guide-study-in-china') &&
      intakesHtml.includes('/updates/china-k-visa'),
    'china-intakes-deadlines must emit citationJsonLd and cross-link CSCA + K-Visa updates',
  );

  const verifyHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'how-we-verify-universities.html'), 'utf8');
  assert.ok(
    verifyHtml.includes('CreativeWork') && verifyHtml.includes('https://www.campuschina.org/'),
    'how-we-verify-universities must emit citationJsonLd and official authority links',
  );

  const layoutCheckHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'index.html'), 'utf8');
  assert.ok(
    layoutCheckHtml.includes('publishingPrinciples') && layoutCheckHtml.includes('actionableFeedbackPolicy'),
    'Root layout Organization schema must declare publishingPrinciples and actionableFeedbackPolicy',
  );

  const programsHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'programs.html'), 'utf8');
  assert.ok(
    programsHtml.includes('ItemList') && programsHtml.includes('/updates/csca-guide-study-in-china'),
    '/programs must emit ItemList schema and cross-link CSCA guide',
  );

  const nanjingHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-universities', 'nanjing.html'), 'utf8');
  assert.ok(
    nanjingHtml.includes('/study-in-china-from-bangladesh') && nanjingHtml.includes('/programs'),
    'city university pages must link to China hub and /programs finder',
  );

  const llmsFullBody = fs.readFileSync(path.join(BUILD_APP_DIR, 'llms-full.txt.body'), 'utf8');
  assert.ok(
    llmsFullBody.includes('educationmalaysia.gov.my') && llmsFullBody.includes('www.gov.uk/student-visa'),
    'llms-full.txt must list Malaysia and active destination regulators',
  );
});

test('built HTML checks — success stories schema/cross-links and all Bengali China guides', () => {
  const storiesHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'success-stories.html'), 'utf8');
  assert.ok(
    storiesHtml.includes('https://eduexpressint.com/success-stories#breadcrumb') &&
      storiesHtml.includes('BreadcrumbList') &&
      storiesHtml.includes('/china-success-stories') &&
      storiesHtml.includes('/china-study-report-bangladesh'),
    'success-stories.html must include breadcrumb schema and China story/report cross-links',
  );

  const chinaStoriesHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-success-stories.html'), 'utf8');
  assert.ok(
    chinaStoriesHtml.includes('https://eduexpressint.com/china-success-stories#breadcrumb') &&
      chinaStoriesHtml.includes('mainEntityOfPage') &&
      chinaStoriesHtml.includes('/success-stories') &&
      chinaStoriesHtml.includes('/china-study-report-bangladesh'),
    'china-success-stories.html must include mainEntityOfPage, breadcrumb, and stories/report links',
  );

  const bnPages = [
    ['bn/study-in-china-cost-bangladesh.html', '/study-in-china-cost-bangladesh'],
    ['bn/china-student-visa-bangladesh.html', '/china-student-visa-bangladesh'],
    ['bn/csc-scholarship-bangladesh.html', '/csc-scholarship-bangladesh'],
    ['bn/mbbs-in-china-bangladesh.html', '/mbbs-in-china-bangladesh'],
  ];

  for (const [file, englishTwin] of bnPages) {
    const html = fs.readFileSync(path.join(BUILD_APP_DIR, file), 'utf8');
    for (const target of [
      englishTwin,
      '/bn/study-in-china',
      '/china-march-2027-intake',
      '/china-study-report-bangladesh',
      '/updates/csca-guide-study-in-china',
      '/updates/china-k-visa',
    ]) {
      assert.ok(html.includes(`href="${target}"`), `${file} must link to ${target}`);
    }
  }
});

test('Step 14 built HTML checks — ChinaGuidePage counterparts, refreshed commercial hubs and benchmark links', () => {
  const chinaScholarshipsHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-scholarships-bangladesh.html'), 'utf8');
  assert.ok(
    chinaScholarshipsHtml.includes('href="/bn/csc-scholarship-bangladesh"') &&
      chinaScholarshipsHtml.includes('href="/china-march-2027-intake"'),
    'china-scholarships-bangladesh.html must link Bengali CSC twin and March 2027 intake',
  );

  const admReqHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-admission-requirements.html'), 'utf8');
  assert.ok(
    admReqHtml.includes('href="/bn/study-in-china"') &&
      admReqHtml.includes('href="/china-march-2027-intake"'),
    'china-admission-requirements.html must link Bengali hub and March 2027 intake',
  );

  const findEduHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'find-education.html'), 'utf8');
  assert.ok(
    findEduHtml.includes('2026-11-15') &&
      findEduHtml.includes('href="/china-march-2027-intake"') &&
      findEduHtml.includes('href="/china-study-report-bangladesh"') &&
      findEduHtml.includes('href="/study-in-malaysia-from-bangladesh"'),
    'find-education.html must carry 2026-11-15 review date and commercial starting points',
  );

  const feesHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'fees-and-transparency.html'), 'utf8');
  assert.ok(
    feesHtml.includes('2026-11-15') &&
      feesHtml.includes('href="/china-study-report-bangladesh"') &&
      feesHtml.includes('href="/malaysia-study-cost-bangladesh"'),
    'fees-and-transparency.html must carry 2026-11-15 review date and benchmark/Malaysia fee links',
  );

  const scholarshipsHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'scholarships.html'), 'utf8');
  assert.ok(
    scholarshipsHtml.includes('2026-11-15') &&
      scholarshipsHtml.includes('href="/updates/csca-guide-study-in-china"'),
    'scholarships.html must carry 2026-11-15 review date and CSCA guide link',
  );

  const proofHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'proof-library.html'), 'utf8');
  assert.ok(
    proofHtml.includes('2026-11-15') &&
      proofHtml.includes('href="/education-consultant-dhaka"'),
    'proof-library.html must carry 2026-11-15 review date and Dhanmondi office guide link',
  );
});
