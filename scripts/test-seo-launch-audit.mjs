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

  assert.equal(reportJson.license, 'https://creativecommons.org/licenses/by/4.0/');
  assert.equal(reportJson.methodology?.license, 'https://creativecommons.org/licenses/by/4.0/');

  const reportHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-study-report-bangladesh.html'), 'utf8');
  assert.ok(reportHtml.includes('https://eduexpressint.com/china-study-report.json'));
  assert.ok(reportHtml.includes('DataDownload'));
  assert.ok(reportHtml.includes('https://creativecommons.org/licenses/by/4.0/'));

  const llmsFull = fs.readFileSync(path.join(BUILD_APP_DIR, 'llms-full.txt.body'), 'utf8');
  assert.ok(llmsFull.includes('https://eduexpressint.com/china-study-report.json'));
  assert.ok(fs.existsSync(path.join(BUILD_APP_DIR, 'pricing.md.body')));
  assert.ok(fs.existsSync(path.join(BUILD_APP_DIR, 'robots.txt.body')));
  assert.ok(fs.existsSync(path.join(BUILD_APP_DIR, 'sitemap.xml.body')));

  const dhakaHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'education-consultant-dhaka.html'), 'utf8');
  assert.ok(dhakaHtml.includes('EduExpress Ltd.') && dhakaHtml.includes('FAQPage'));

  const partnershipHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'partnership.html'), 'utf8');
  assert.ok(
    partnershipHtml.includes('institutional-cooperation') &&
      partnershipHtml.includes('/china-study-report-bangladesh') &&
      partnershipHtml.includes('$800') &&
      partnershipHtml.includes('$600') &&
      partnershipHtml.includes('$500') &&
      partnershipHtml.includes('$150') &&
      !partnershipHtml.includes('$450') &&
      !partnershipHtml.includes('$300') &&
      !partnershipHtml.includes('Type-D') &&
      partnershipHtml.includes('FAQPage') &&
      partnershipHtml.includes('"@type":"Service"'),
    'partnership.html must emit updated China USD tiers ($800/$600/$500/$150), Service & FAQPage schema, and institutional cooperation links',
  );

  const b2bHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'b2b.html'), 'utf8');
  assert.ok(
    b2bHtml.includes('b2b-services') &&
      b2bHtml.includes('b2b-sop') &&
      b2bHtml.includes('b2b-inquiry') &&
      b2bHtml.includes('FAQPage') &&
      b2bHtml.includes('mainEntityOfPage') &&
      b2bHtml.includes('/partnership') &&
      !/\$500|\$450|\$400|\$300/.test(b2bHtml),
    'b2b.html must include B2B sections, FAQPage schema, mainEntityOfPage, /partnership cross-link, and no public USD rate table',
  );

  const aboutHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'about.html'), 'utf8');
  assert.ok(aboutHtml.includes('Abdullah Al Rakib') && aboutHtml.includes('EduExpress Ltd.'));

  const cscHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'csc-scholarship-bangladesh.html'), 'utf8');
  assert.ok(
    cscHtml.includes('/updates/complete-csc-universities-list-2027') &&
      cscHtml.includes('/updates/csca-guide-study-in-china'),
  );

  const reqHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-admission-requirements.html'), 'utf8');
  assert.ok(reqHtml.includes('/updates/csca-guide-study-in-china') && reqHtml.includes('/updates/china-k-visa'));

  const finlandHtml = fs.existsSync(path.join(BUILD_APP_DIR, 'study-in-finland-from-bangladesh.html'))
    ? fs.readFileSync(path.join(BUILD_APP_DIR, 'study-in-finland-from-bangladesh.html'), 'utf8')
    : fs.readFileSync(path.join(process.cwd(), 'src/app/study-in-finland-from-bangladesh/page.tsx'), 'utf8');
  assert.ok(finlandHtml.includes('9,600') && !finlandHtml.includes('6,720'));

  const croatiaHtml = fs.existsSync(path.join(BUILD_APP_DIR, 'study-in-croatia-from-bangladesh.html'))
    ? fs.readFileSync(path.join(BUILD_APP_DIR, 'study-in-croatia-from-bangladesh.html'), 'utf8')
    : fs.readFileSync(path.join(BUILD_APP_DIR, 'destinations', 'croatia.html'), 'utf8');
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

  const ukCostHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'uk-study-cost-bangladesh.html'), 'utf8');
  assert.ok(
    ukCostHtml.includes('Planning Assumption') &&
      ukCostHtml.includes('1,483') &&
      ukCostHtml.includes('1,136') &&
      ukCostHtml.includes('gov.uk/student-visa'),
    'uk-study-cost-bangladesh must include Planning Assumption, UKVI maintenance sums, and GOV.UK citation',
  );
  assert.ok(!ukCostHtml.includes('Official Planning Baseline'));

  const finlandCostHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'finland-study-cost-bangladesh.html'), 'utf8');
  assert.ok(
    finlandCostHtml.includes('Planning Assumption') &&
      finlandCostHtml.includes('9,600') &&
      finlandCostHtml.includes('800') &&
      finlandCostHtml.includes('migri.fi/en/residence-permit-for-studies') &&
      !finlandCostHtml.includes('6,720'),
    'finland-study-cost-bangladesh must include Planning Assumption, Migri EUR 9,600 / EUR 800 figures, Migri link, and no obsolete 6,720',
  );
  assert.ok(!finlandCostHtml.includes('Official Planning Baseline'));

  const hungaryCostHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'hungary-study-cost-bangladesh.html'), 'utf8');
  assert.ok(
    hungaryCostHtml.includes('Planning Assumption') &&
      hungaryCostHtml.includes('Stipendium Hungaricum') &&
      hungaryCostHtml.includes('stipendiumhungaricum.hu') &&
      hungaryCostHtml.includes('oif.gov.hu'),
    'hungary-study-cost-bangladesh must include Planning Assumption, Stipendium Hungaricum, and NDGAP citation',
  );
  assert.ok(!hungaryCostHtml.includes('Official Planning Baseline'));

  const koreaCostHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'south-korea-study-cost-bangladesh.html'), 'utf8');
  assert.ok(
    koreaCostHtml.includes('Planning Assumption') &&
      koreaCostHtml.includes('Global Korea Scholarship') &&
      koreaCostHtml.includes('studyinkorea.go.kr') &&
      koreaCostHtml.includes('overseas.mofa.go.kr'),
    'south-korea-study-cost-bangladesh must include Planning Assumption, Global Korea Scholarship, and NIIED/MOFA citations',
  );
  assert.ok(!koreaCostHtml.includes('Official Planning Baseline'));

  const maltaCostHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'malta-study-cost-bangladesh.html'), 'utf8');
  assert.ok(
    maltaCostHtml.includes('Planning Assumption') &&
      maltaCostHtml.includes('Identità') &&
      maltaCostHtml.includes('Jobsplus') &&
      maltaCostHtml.includes('identita.gov.mt') &&
      maltaCostHtml.includes('mfhea.mt'),
    'malta-study-cost-bangladesh must include Planning Assumption, Identità, Jobsplus, and MFHEA citations',
  );
  assert.ok(!maltaCostHtml.includes('Official Planning Baseline'));

  const cyprusCostHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'cyprus-study-cost-bangladesh.html'), 'utf8');
  assert.ok(
    cyprusCostHtml.includes('Planning Assumption') &&
      cyprusCostHtml.includes('Civil Registry and Migration Department') &&
      cyprusCostHtml.includes('CYQAA') &&
      cyprusCostHtml.includes('Northern Cyprus') &&
      cyprusCostHtml.includes('moi.gov.cy/crmd') &&
      cyprusCostHtml.includes('dipae.ac.cy'),
    'cyprus-study-cost-bangladesh must include Planning Assumption, CRMD, CYQAA, Northern Cyprus warning, and official citations',
  );
  assert.ok(!cyprusCostHtml.includes('Official Planning Baseline'));

  const malaysiaVisaHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'malaysia-student-visa-bangladesh.html'), 'utf8');
  assert.ok(
    malaysiaVisaHtml.includes('Planning Assumption') &&
      malaysiaVisaHtml.includes('Education Malaysia Global Services') &&
      malaysiaVisaHtml.includes('Jabatan Imigresen Malaysia') &&
      malaysiaVisaHtml.includes('Single Entry Visa') &&
      malaysiaVisaHtml.includes('i-KAD') &&
      malaysiaVisaHtml.includes('educationmalaysia.gov.my'),
    'malaysia-student-visa-bangladesh must include Planning Assumption, EMGS, JIM, Single Entry Visa, i-KAD, and official citations',
  );
  assert.ok(!malaysiaVisaHtml.includes('Official Planning Baseline'));

  const greeceCostHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'greece-study-cost-bangladesh.html'), 'utf8');
  assert.ok(
    greeceCostHtml.includes('Planning Assumption') &&
      greeceCostHtml.includes('Hellenic Authority for Higher Education') &&
      greeceCostHtml.includes('Type-D') &&
      greeceCostHtml.includes('Athens') &&
      greeceCostHtml.includes('Thessaloniki') &&
      greeceCostHtml.includes('ethaae.gr'),
    'greece-study-cost-bangladesh must include Planning Assumption, HAHE, Type-D, Athens, Thessaloniki, and official citations',
  );
  assert.ok(!greeceCostHtml.includes('Official Planning Baseline'));

  const georgiaCostHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'georgia-study-cost-bangladesh.html'), 'utf8');
  assert.ok(
    georgiaCostHtml.includes('Planning Assumption') &&
      georgiaCostHtml.includes('National Center for Educational Quality Enhancement') &&
      georgiaCostHtml.includes('Tbilisi State Medical University') &&
      georgiaCostHtml.includes('D3') &&
      georgiaCostHtml.includes('BMDC') &&
      georgiaCostHtml.includes('eqe.ge'),
    'georgia-study-cost-bangladesh must include Planning Assumption, NCEQE, TSMU, D3, BMDC, and official citations',
  );
  assert.ok(!georgiaCostHtml.includes('Official Planning Baseline'));

  const croatiaCostHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'croatia-study-cost-bangladesh.html'), 'utf8');
  assert.ok(
    croatiaCostHtml.includes('Planning Assumption') &&
      croatiaCostHtml.includes('Agency for Science and Higher Education') &&
      croatiaCostHtml.includes('University of Zagreb') &&
      croatiaCostHtml.includes('Type D') &&
      croatiaCostHtml.includes('azvo.hr'),
    'croatia-study-cost-bangladesh must include Planning Assumption, ASHE, Zagreb, Type D, and official citations',
  );
  assert.ok(!croatiaCostHtml.includes('Official Planning Baseline'));

  const thailandCostHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'thailand-study-cost-bangladesh.html'), 'utf8');
  assert.ok(
    thailandCostHtml.includes('Planning Assumption') &&
      thailandCostHtml.includes('Ministry of Higher Education, Science, Research and Innovation') &&
      thailandCostHtml.includes('Chulalongkorn University') &&
      thailandCostHtml.includes('Non-Immigrant ED') &&
      thailandCostHtml.includes('mhesi.go.th'),
    'thailand-study-cost-bangladesh must include Planning Assumption, MHESI, Chulalongkorn, Non-Immigrant ED, and official citations',
  );
  assert.ok(!thailandCostHtml.includes('Official Planning Baseline'));

  const mbbsHubHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'mbbs-in-china-bangladesh.html'), 'utf8');
  assert.ok(
    mbbsHubHtml.includes('/updates/mbbs-in-china-admission-guide-bangladesh'),
    'mbbs-in-china-bangladesh must link to /updates/mbbs-in-china-admission-guide-bangladesh',
  );

  const chinaHubHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'study-in-china-from-bangladesh.html'), 'utf8');
  for (const href of [
    '/csc-scholarship-bangladesh',
    '/china-march-2027-intake',
    '/china-study-report-bangladesh',
    '/updates/china-k-visa',
    '/updates/csca-guide-study-in-china',
    '/updates/study-cs-ai-in-china-bangladesh',
    '/updates/study-business-finance-in-china-bangladesh',
  ]) {
    assert.ok(chinaHubHtml.includes(href), `study-in-china-from-bangladesh must link to ${href}`);
  }

  const bdVsChinaHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'bangladesh-vs-china-bachelor-study.html'), 'utf8');
  assert.ok(
    bdVsChinaHtml.includes('/updates/study-cs-ai-in-china-bangladesh'),
    'bangladesh-vs-china-bachelor-study must link to /updates/study-cs-ai-in-china-bangladesh',
  );
  assert.ok(
    bdVsChinaHtml.includes('/updates/study-business-finance-in-china-bangladesh'),
    'bangladesh-vs-china-bachelor-study must link to /updates/study-business-finance-in-china-bangladesh',
  );

  const marchIntakeHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-march-2027-intake.html'), 'utf8');
  assert.ok(
    marchIntakeHtml.includes('/updates/china-march-2027-language-foundation-guide'),
    'china-march-2027-intake must link to /updates/china-march-2027-language-foundation-guide',
  );

  const bnHubHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'bn', 'study-in-china.html'), 'utf8');
  assert.ok(
    bnHubHtml.includes('CreativeWork') && bnHubHtml.includes('/updates/csca-guide-study-in-china'),
    'bn/study-in-china must emit citationJsonLd and link CSCA guide',
  );

  const ukPath = fs.existsSync(path.join(BUILD_APP_DIR, 'study-in-uk-from-bangladesh.html'))
    ? path.join(BUILD_APP_DIR, 'study-in-uk-from-bangladesh.html')
    : path.join(BUILD_APP_DIR, 'destinations', 'uk.html');
  const ukHtml = fs.readFileSync(ukPath, 'utf8');
  assert.ok(
    ukHtml.includes('https://www.gov.uk/student-visa') && ukHtml.includes('CreativeWork'),
    'study-in-uk-from-bangladesh must include UKVI official link and citationJsonLd',
  );
  assert.ok(
    finlandHtml.includes('https://migri.fi/en/residence-permit-for-studies') || finlandHtml.includes('https://migri.fi/en/studying-in-finland'),
    'destinations/finland must include Migri URL',
  );

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
    ['bn/csca-exam-bangladesh.html', '/updates/csca-guide-study-in-china'],
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

test('Step 15 built HTML checks — single FAQPage on Malaysia guides, clean Malaysia uni fees, institutional schema & login noindex', () => {
  for (const slug of [
    'study-in-malaysia-from-bangladesh',
    'malaysia-study-cost-bangladesh',
    'malaysia-student-visa-bangladesh',
  ]) {
    const html = fs.readFileSync(path.join(BUILD_APP_DIR, `${slug}.html`), 'utf8');
    const faqCount = (html.match(/"@type":"FAQPage"/g) || []).length;
    assert.equal(faqCount, 1, `${slug}.html must emit exactly 1 FAQPage schema block (got ${faqCount})`);
    assert.ok(
      html.includes('2026-11-15') &&
        html.includes('mainEntityOfPage') &&
        html.includes(`https://eduexpressint.com/${slug}#breadcrumb`),
      `${slug}.html must include dateModified, mainEntityOfPage, and #breadcrumb`,
    );
  }

  for (const uniSlug of [
    'asia-pacific-university',
    'heriot-watt-university-malaysia',
    'monash-university-malaysia',
    'sunway-university',
    'taylors-university',
    'ucsi-university',
    'universiti-malaya',
    'universiti-teknologi-malaysia',
    'university-of-nottingham-malaysia',
  ]) {
    const html = fs.readFileSync(path.join(BUILD_APP_DIR, 'universities', `${uniSlug}.html`), 'utf8');
    assert.ok(!html.includes('100% Free Application'), `${uniSlug}.html must not contain "100% Free Application"`);
    assert.ok(html.includes('BDT 0 EduExpress Service Fee'), `${uniSlug}.html must clearly label BDT 0 EduExpress Service Fee`);
  }

  for (const instSlug of ['about', 'partnership', 'contact']) {
    const html = fs.readFileSync(path.join(BUILD_APP_DIR, `${instSlug}.html`), 'utf8');
    assert.ok(
      html.includes('2026-11-15') && html.includes('mainEntityOfPage'),
      `${instSlug}.html must include 2026-11-15 dateModified and mainEntityOfPage`,
    );
  }

  const loginHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'login.html'), 'utf8');
  assert.ok(
    loginHtml.includes('noindex') && loginHtml.includes('rel="canonical"'),
    'login.html must emit noindex meta robots and canonical URL',
  );
});

test('Step 16 built HTML checks — bn visa SERP bounds, homepage WebPage schema, Dhaka NAP/links & mainEntityOfPage parity', () => {
  const bnVisaHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'bn', 'china-student-visa-bangladesh.html'), 'utf8');
  const bnTitle = (bnVisaHtml.match(/<title[^>]*>(.*?)<\/title>/i) || ['', ''])[1];
  const bnDesc = (bnVisaHtml.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || ['', ''])[1];
  assert.ok(bnTitle.length <= 62, `bn/china-student-visa-bangladesh title length ${bnTitle.length} must be <= 62`);
  assert.ok(bnDesc.length <= 160, `bn/china-student-visa-bangladesh description length ${bnDesc.length} must be <= 160`);
  assert.ok(bnVisaHtml.includes('2026-11-15T00:00:00Z'), 'bn/china-student-visa-bangladesh.html must include dateModified');

  const homeHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'index.html'), 'utf8');
  assert.ok(
    homeHtml.includes('"@type":"WebPage"') &&
      homeHtml.includes('"mainEntityOfPage":"https://eduexpressint.com/"') &&
      homeHtml.includes('2026-11-15'),
    'index.html must include WebPage node with mainEntityOfPage and dateModified',
  );
  assert.ok(
    homeHtml.includes('id="b2b-partner-desk"') &&
      homeHtml.includes('href="/b2b"') &&
      homeHtml.includes('href="/b2b#b2b-inquiry"') &&
      homeHtml.includes('href="/partnership#china-partner-terms"'),
    'index.html must include the B2B Partner Desk banner linking to /b2b and /partnership',
  );

  const dhakaHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'education-consultant-dhaka.html'), 'utf8');
  assert.ok(
    dhakaHtml.includes('"mainEntityOfPage":"https://eduexpressint.com/education-consultant-dhaka"') &&
      dhakaHtml.includes('1983-333566') &&
      dhakaHtml.includes('1329-663505') &&
      dhakaHtml.includes('href="/china-study-report-bangladesh"') &&
      dhakaHtml.includes('href="/fees-and-transparency"') &&
      dhakaHtml.includes('maps.google.com/maps') &&
      dhakaHtml.includes('id="book-consultation"') &&
      dhakaHtml.includes('id="dhanmondi-team"') &&
      dhakaHtml.includes('"hasMap"'),
    'education-consultant-dhaka.html must contain full NAP, mainEntityOfPage, embedded map, team, booking form, hasMap schema, and trust/benchmark links',
  );

  const contactHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'contact.html'), 'utf8');
  assert.ok(
    contactHtml.includes('maps.google.com/maps') && contactHtml.includes('id="office-map"'),
    'contact.html must include embedded Dhanmondi Google Map section',
  );

  for (const slug of [
    'destinations',
    'find-education',
    'scholarships',
    'education-fit-assessment',
    'your-study-journey',
    'china-study-report-bangladesh',
    'china-march-2027-intake',
    'programs',
    'programs/masters-in-china',
    'compare-costs',
    'bn/study-in-china',
    'bn/study-in-china-cost-bangladesh',
    'privacy',
    'terms',
    'universities/asia-pacific-university',
    'csc-scholarship-bangladesh',
    'bn/csc-scholarship-bangladesh',
    'study-in-uk-from-bangladesh',
    'study-in-south-korea-from-bangladesh',
    'study-in-hungary-from-bangladesh',
    'study-in-finland-from-bangladesh',
    'study-in-malta-from-bangladesh',
    'study-in-cyprus-from-bangladesh',
    'study-in-georgia-from-bangladesh',
    'study-in-greece-from-bangladesh',
    'study-in-croatia-from-bangladesh',
    'study-in-thailand-from-bangladesh',
  ]) {
    const html = fs.readFileSync(path.join(BUILD_APP_DIR, `${slug}.html`), 'utf8');
    assert.ok(html.includes('"mainEntityOfPage":"https://eduexpressint.com/'), `${slug}.html must include mainEntityOfPage`);
    assert.ok(
      html.includes('"isPartOf":{"@id":"https://eduexpressint.com/#website"}'),
      `${slug}.html must include #website isPartOf link`,
    );
  }
  for (const csc of ['csc-scholarship-bangladesh', 'bn/csc-scholarship-bangladesh']) {
    const html = fs.readFileSync(path.join(BUILD_APP_DIR, `${csc}.html`), 'utf8');
    assert.ok(html.includes('"dateModified":"2026-11-15T00:00:00Z"'), `${csc}.html must include refreshed dateModified`);
  }
  const indexHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'index.html'), 'utf8');
  assert.equal(
    (indexHtml.match(/"@type":"WebSite","@id":"https:\/\/eduexpressint\.com\/#website"/g) || []).length,
    1,
    'index.html must define #website entity once without duplication',
  );
  for (const rel of [
    'about',
    'study-in-uk-from-bangladesh',
    'how-we-verify-universities',
    'better-education-standard',
    'privacy',
    'bn/study-in-china',
    'universities/asia-pacific-university',
  ]) {
    const html = fs.readFileSync(path.join(BUILD_APP_DIR, `${rel}.html`), 'utf8');
    assert.ok(
      html.includes('"@id":"https://eduexpressint.com/#website","url":"https://eduexpressint.com/"'),
      `${rel}.html must define the global #website entity in RootLayout`,
    );
  }
});

function walkBuiltHtml(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, ent.name);
    if (ent.isDirectory()) walkBuiltHtml(fullPath, acc);
    else if (ent.name.endsWith('.html')) acc.push(fullPath);
  }
  return acc;
}

function collectJsonLdIds(node, defined, referenced) {
  if (Array.isArray(node)) {
    for (const item of node) collectJsonLdIds(item, defined, referenced);
    return;
  }
  if (!node || typeof node !== 'object') return;
  const keys = Object.keys(node);
  if (typeof node['@id'] === 'string') {
    if (keys.length === 1 || (keys.length === 2 && keys.includes('@type'))) referenced.push(node['@id']);
    else defined.push(node['@id']);
  }
  for (const [k, v] of Object.entries(node)) {
    if (k !== '@id') collectJsonLdIds(v, defined, referenced);
  }
}

test('Built indexable HTML pages have unique @ids, resolved references, WebPage publisher, and Article rich fields', () => {
  const htmlFiles = walkBuiltHtml(BUILD_APP_DIR).sort();
  assert.ok(htmlFiles.length > 150, `Expected > 150 built HTML files, found ${htmlFiles.length}`);

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const rel = path.relative(BUILD_APP_DIR, file);
    if (rel.startsWith('_') || /noindex|NEXT_HTTP_ERROR_FALLBACK|NEXT_REDIRECT/.test(html)) continue;

    const defined = [];
    const referenced = [];
    let hasWebPage = false;

    for (const match of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
      const parsed = JSON.parse(match[1]);
      collectJsonLdIds(parsed, defined, referenced);
      const nodes = parsed['@graph'] ? parsed['@graph'] : [parsed];
      for (const n of nodes) {
        if (!n || typeof n !== 'object') continue;
        const types = Array.isArray(n['@type']) ? n['@type'].join(',') : String(n['@type'] || '');
        if (/(WebPage|CollectionPage|AboutPage|ContactPage|ProfilePage)/.test(types)) {
          hasWebPage = true;
          for (const field of ['mainEntityOfPage', 'isPartOf', 'publisher', 'inLanguage', 'url']) {
            assert.ok(n[field], `${rel} WebPage node missing ${field}`);
          }
        }
        if (/(Article|BlogPosting|Report|ScholarlyArticle)/.test(types)) {
          for (const field of ['mainEntityOfPage', 'publisher', 'inLanguage', 'image', 'datePublished', 'dateModified']) {
            assert.ok(n[field], `${rel} Article node missing ${field}`);
          }
        }
      }
    }

    assert.ok(hasWebPage, `${rel} must include a WebPage/CollectionPage JSON-LD node`);
    const counts = new Map();
    for (const id of defined) counts.set(id, (counts.get(id) ?? 0) + 1);
    for (const [id, count] of counts) {
      assert.equal(count, 1, `${rel} defines duplicate JSON-LD @id ${id}`);
    }
    const defSet = new Set(defined);
    for (const ref of referenced) {
      assert.ok(defSet.has(ref), `${rel} has unresolved JSON-LD @id reference ${ref}`);
    }
  }

  const intakesHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-intakes-deadlines.html'), 'utf8');
  assert.ok(intakesHtml.includes('"primaryImageOfPage"'), 'china-intakes-deadlines.html must include primaryImageOfPage');

  const marchHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-march-2027-intake.html'), 'utf8');
  assert.ok(marchHtml.includes('"primaryImageOfPage":{"@type":"ImageObject","url":"https://eduexpressint.com/og/march-2027.jpg"}'));
  assert.ok(marchHtml.includes('content="en_GB"'));

  const sitemapBody = fs.readFileSync(path.join(BUILD_APP_DIR, 'sitemap.xml.body'), 'utf8');
  for (const legacy of ['/destinations/china', '/destinations/malaysia', '/destinations/netherlands']) {
    assert.ok(!sitemapBody.includes(`<loc>https://eduexpressint.com${legacy}</loc>`), `sitemap.xml must not emit redirect URL ${legacy}`);
  }

  const aboutHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'about.html'), 'utf8');
  const aboutDescMatch = aboutHtml.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  assert.ok(aboutDescMatch && aboutDescMatch[1].length >= 120 && aboutDescMatch[1].length <= 160, 'about.html description must be 120..160 chars');

  const nanjingHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'china-universities', 'nanjing.html'), 'utf8');
  assert.ok(nanjingHtml.includes('"primaryImageOfPage":{"@type":"ImageObject","url":"https://eduexpressint.com/og/china.jpg"}'));

  for (const rel of [
    'programs.html',
    'programs/english-taught-bachelor-china.html',
    'malaysia-study-cost-bangladesh.html',
    'malaysia-student-visa-bangladesh.html',
    'study-in-malaysia-from-bangladesh.html',
  ]) {
    const html = fs.readFileSync(path.join(BUILD_APP_DIR, rel), 'utf8');
    const levels = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((m) => Number(m[1]));
    for (let i = 1; i < levels.length; i += 1) {
      assert.ok(levels[i] - levels[i - 1] <= 1, `${rel} skips heading level h${levels[i - 1]} -> h${levels[i]}`);
    }
  }

  for (const imgRel of [
    'programs.html',
    'china-student-visa-bangladesh.html',
    'how-we-verify-universities.html',
    'updates.html',
    'study-in-china-from-bangladesh.html',
    'csc-scholarship-bangladesh.html',
    'china-study-report-bangladesh.html',
    'about.html',
    'contact.html',
  ]) {
    assert.ok(fs.readFileSync(path.join(BUILD_APP_DIR, imgRel), 'utf8').includes('"primaryImageOfPage"'), `${imgRel} must include primaryImageOfPage`);
  }
});

test('Step 26 built HTML check: all 20 Step 26 routes emit primaryImageOfPage ImageObject', () => {
  const step26HtmlFiles = [
    'privacy.html',
    'terms.html',
    'fees-and-transparency.html',
    'partnership.html',
    'proof-library.html',
    'services.html',
    'for-parents.html',
    'your-study-journey.html',
    'compare-costs.html',
    'mbbs-in-china-bangladesh.html',
    'success-stories.html',
    'china-success-stories.html',
    'study-in-malaysia-from-bangladesh.html',
    'malaysia-study-cost-bangladesh.html',
    'malaysia-student-visa-bangladesh.html',
    'bn/study-in-china.html',
    'bn/csc-scholarship-bangladesh.html',
    'bn/mbbs-in-china-bangladesh.html',
    'bn/csca-exam-bangladesh.html',
    'bn/study-in-china-cost-bangladesh.html',
    'bn/china-student-visa-bangladesh.html',
  ];
  for (const rel of step26HtmlFiles) {
    const filePath = path.join(BUILD_APP_DIR, rel);
    assert.ok(fs.existsSync(filePath), `Missing built HTML: ${rel}`);
    const html = fs.readFileSync(filePath, 'utf8');
    assert.match(
      html,
      /"primaryImageOfPage":\{"@type":"ImageObject","url":"https:\/\/eduexpressint\.com\//,
      `Missing primaryImageOfPage ImageObject in ${rel}`
    );
  }
});

test('Bangladesh Study Abroad Market SEO Hub, Bengali Twin, and CC BY 4.0 JSON Dataset', () => {
  const marketJson = JSON.parse(
    fs.readFileSync(path.join(BUILD_APP_DIR, 'bangladesh-study-abroad-market.json.body'), 'utf8'),
  );
  assert.equal(marketJson.license, 'https://creativecommons.org/licenses/by/4.0/');
  assert.equal(marketJson.snapshot.activeDestinationCount, 12);
  assert.ok(marketJson.snapshot.liveCatalog.activeUniversities >= 100);
  assert.ok(marketJson.officialSources.some((s) => s.href.includes('bb.org.bd')));
  assert.equal(
    marketJson.publisher.address,
    'Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209',
  );

  const marketHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'bangladesh-study-abroad-market.html'), 'utf8');
  assert.ok(
    marketHtml.includes('https://eduexpressint.com/bangladesh-study-abroad-market.json') &&
      marketHtml.includes('DataDownload') &&
      marketHtml.includes('FAQPage') &&
      marketHtml.includes('href="/bn/bangladesh-study-abroad-market"') &&
      marketHtml.includes('href="/b2b"') &&
      marketHtml.includes('href="/china-study-report-bangladesh"') &&
      /hreflang="bn-bd"/i.test(marketHtml),
    'bangladesh-study-abroad-market.html must emit Dataset, DataDownload, FAQPage, hreflang, and key cross-links',
  );

  const bnMarketHtml = fs.readFileSync(path.join(BUILD_APP_DIR, 'bn', 'bangladesh-study-abroad-market.html'), 'utf8');
  assert.ok(
    bnMarketHtml.includes('FAQPage') &&
      bnMarketHtml.includes('href="/bangladesh-study-abroad-market"') &&
      /hreflang="en-bd"/i.test(bnMarketHtml) &&
      bnMarketHtml.includes('https://eduexpressint.com/bn/bangladesh-study-abroad-market#breadcrumb'),
    'bn/bangladesh-study-abroad-market.html must emit FAQPage, English twin hreflang, and Bangla breadcrumb',
  );

  const llmsFullBody = fs.readFileSync(path.join(BUILD_APP_DIR, 'llms-full.txt.body'), 'utf8');
  assert.ok(
    llmsFullBody.includes('https://eduexpressint.com/bangladesh-study-abroad-market.json') &&
      llmsFullBody.includes('https://eduexpressint.com/bn/bangladesh-study-abroad-market'),
    'llms-full.txt must reference Bangladesh Study Abroad Market EN, BN, and JSON URLs',
  );

  const sitemapBody = fs.readFileSync(path.join(BUILD_APP_DIR, 'sitemap.xml.body'), 'utf8');
  assert.ok(
    sitemapBody.includes('https://eduexpressint.com/bangladesh-study-abroad-market') &&
      sitemapBody.includes('https://eduexpressint.com/bn/bangladesh-study-abroad-market'),
    'sitemap.xml must include English and Bengali Bangladesh Study Abroad Market URLs',
  );
});
