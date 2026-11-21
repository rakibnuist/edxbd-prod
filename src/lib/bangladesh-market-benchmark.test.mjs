import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('../../scripts/lib/typescript-source-resolver.mjs', import.meta.url));

const {
  BANGLADESH_MACRO_INDICATORS,
  BANGLADESH_MARKET_SOURCES,
  STUDENT_FILE_COMPARISON,
  buildBangladeshMarketBenchmark,
} = await import('./bangladesh-market-benchmark.ts');

test('buildBangladeshMarketBenchmark aggregates active universities across countries and all 12 destinations', () => {
  const makeUni = (overrides) => ({
    id: 'u1',
    slug: 'sample-uni',
    legacySlugs: [],
    name: 'Sample University',
    aliases: [],
    location: 'Nanjing, China',
    country: 'China',
    city: 'Nanjing',
    intake: ['September'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {},
    details: { majors: [], tuition: 'CNY 20,000 / year', tuitionDetails: [] },
    programs: [
      {
        level: 'Bachelor',
        name: 'Computer Science',
        languages: ['English'],
        intakes: ['September'],
        tuition: 'CNY 20,000 / year',
        eligibility: [],
        sourceUrl: 'https://example.edu.cn/cs',
        status: 'active',
      },
    ],
    fees: [{ item: 'Application Fee', cost: '400 CNY' }],
    scholarships: [
      {
        title: 'University Merit Scholarship',
        details: [],
        eligiblePrograms: ['Bachelor'],
        status: 'active',
      },
    ],
    costPlans: [],
    documents: [],
    deadlines: { application: '', startDate: '' },
    notes: [],
    badges: [],
    isActive: true,
    officialUrl: 'https://example.edu.cn',
    relationshipType: 'public_direct_application',
    recognitionAuthority: 'MoE China',
    sourceUrls: [],
    lastVerifiedAt: '2026-11-15T00:00:00Z',
    verificationStatus: 'verified',
    ...overrides,
  });

  const snapshot = buildBangladeshMarketBenchmark(
    [
      makeUni({ id: '1', slug: 'uni-cn', country: 'China' }),
      makeUni({
        id: '2',
        slug: 'uni-my',
        country: 'Malaysia',
        city: 'Kuala Lumpur',
        verificationStatus: 'under_verification',
      }),
      makeUni({ id: '3', slug: 'uni-inactive', country: 'China', isActive: false }),
    ],
    4,
    new Date('2026-11-21T00:00:00Z'),
  );

  assert.equal(snapshot.activeDestinationCount, 12);
  assert.equal(snapshot.destinations.length, 12);
  assert.equal(snapshot.liveCatalog.activeUniversities, 2);
  assert.equal(snapshot.liveCatalog.programsCount, 2);
  assert.equal(snapshot.liveCatalog.itemizedFeeRowsCount, 2);
  assert.equal(snapshot.liveCatalog.scholarshipsCount, 2);
  assert.equal(snapshot.liveCatalog.verifiedUniversitiesCount, 1);
  assert.equal(snapshot.liveCatalog.consentedStoriesCount, 4);

  const china = snapshot.destinations.find((d) => d.slug === 'china');
  const uk = snapshot.destinations.find((d) => d.slug === 'uk');
  const finland = snapshot.destinations.find((d) => d.slug === 'finland');
  const croatia = snapshot.destinations.find((d) => d.slug === 'croatia');

  assert.equal(china?.href, '/study-in-china-from-bangladesh');
  assert.match(uk?.keyGuardrail ?? '', /18 mos/i);
  assert.match(finland?.keyGuardrail ?? '', /9,600/);
  assert.doesNotMatch(croatia?.keyGuardrail ?? '', /sell Schengen/i);
  assert.ok(BANGLADESH_MACRO_INDICATORS.length >= 5);
  assert.ok(BANGLADESH_MARKET_SOURCES.some((s) => s.href.includes('bb.org.bd')));
  assert.ok(STUDENT_FILE_COMPARISON.length === 3);
});
