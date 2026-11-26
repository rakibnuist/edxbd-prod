import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('../../scripts/lib/typescript-source-resolver.mjs', import.meta.url));

const {
  GLOBAL_DESTINATIONS_BENCHMARK,
  GLOBAL_DESTINATIONS_BY_SLUG,
} = await import('./global-study-destinations.ts');

const {
  toPublicScholarshipScenario,
  scholarshipAppliesToProgram,
  computeScholarshipAdjustedEstimate,
} = await import('./widget-scholarship-math.ts');

const { buildBangladeshMarketBenchmark } = await import('./bangladesh-market-benchmark.ts');

test('Global study destinations benchmark covers 32 countries with scholarships and verified 2026/27 thresholds', () => {
  assert.equal(GLOBAL_DESTINATIONS_BENCHMARK.length, 32);

  const active = GLOBAL_DESTINATIONS_BENCHMARK.filter((d) => d.serviceStatus !== 'Benchmark Reference');
  const reference = GLOBAL_DESTINATIONS_BENCHMARK.filter((d) => d.serviceStatus === 'Benchmark Reference');
  assert.equal(active.length, 12);
  assert.equal(reference.length, 20);

  for (const dest of GLOBAL_DESTINATIONS_BENCHMARK) {
    assert.ok(dest.flagshipScholarships.length >= 1, `${dest.slug} must include flagship scholarship benchmark(s)`);
    assert.ok(dest.officialVisaFinancialProof.length > 15, `${dest.slug} must record statutory visa financial proof`);
    assert.ok(dest.publicAuthorityNames.length >= 1, `${dest.slug} must include Tier-1 authority names`);
    assert.ok(dest.lastVerifiedIso === '2026-11-26', `${dest.slug} must carry current verification date`);
    // Benchmark reference destinations must never pretend to have an active counseling guide link
    if (dest.serviceStatus === 'Benchmark Reference') {
      assert.equal(dest.href, null, `${dest.slug} reference destination must keep href=null`);
    }
    // Tier-1 root portals must be root origins only (no deep brochure/scraping paths)
    for (const portal of dest.publicAuthorityRootPortals) {
      const parsed = new URL(portal.href);
      assert.equal(parsed.pathname, '/', `${dest.slug} publicAuthorityRootPortals must expose root domain only: ${portal.href}`);
    }
  }

  // Spot-check verified late-2026 statutory financial thresholds
  assert.match(GLOBAL_DESTINATIONS_BY_SLUG.get('canada').officialVisaFinancialProof, /23,448/);
  assert.match(GLOBAL_DESTINATIONS_BY_SLUG.get('australia').officialVisaFinancialProof, /29,710/);
  assert.match(GLOBAL_DESTINATIONS_BY_SLUG.get('germany').officialVisaFinancialProof, /11,904/);
  assert.match(GLOBAL_DESTINATIONS_BY_SLUG.get('france').officialVisaFinancialProof, /877\.50|10,530/);
  assert.match(GLOBAL_DESTINATIONS_BY_SLUG.get('italy').officialVisaFinancialProof, /10,179\.85/);
  assert.match(GLOBAL_DESTINATIONS_BY_SLUG.get('netherlands').officialVisaFinancialProof, /13,569\.24/);
  assert.match(GLOBAL_DESTINATIONS_BY_SLUG.get('sweden').officialVisaFinancialProof, /10,656/);
  assert.match(GLOBAL_DESTINATIONS_BY_SLUG.get('norway').officialVisaFinancialProof, /170,368/);
  assert.match(GLOBAL_DESTINATIONS_BY_SLUG.get('new-zealand').officialVisaFinancialProof, /20,000/);
  assert.match(GLOBAL_DESTINATIONS_BY_SLUG.get('finland').officialVisaFinancialProof, /9,600/);
});

test('Scholarship scenario math separates gross tuition, explicit fee waivers, and living stipends', () => {
  const csc = toPublicScholarshipScenario('nuist', 0, {
    title: 'Chinese Government Scholarship (CSC)',
    type: 'Full + Stipend',
    eligiblePrograms: ['Bachelor', 'Master', 'PhD'],
  });

  assert.equal(csc.tuitionWaiverType, 'percent');
  assert.equal(csc.tuitionWaiverValue, 100);
  assert.equal(csc.waivesAccommodation, true);
  assert.equal(csc.waivesInsurance, true);

  const fees = [
    { item: 'Application Fee', cost: 'CNY 400', category: 'application', firstYearCny: 400 },
    { item: 'Accommodation', cost: 'CNY 4,000 / year', category: 'accommodation', firstYearCny: 4000 },
    { item: 'Medical Insurance', cost: 'CNY 800 / year', category: 'insurance', firstYearCny: 800 },
    { item: 'Residence Permit', cost: 'CNY 400', category: 'residence', firstYearCny: 400 },
    { item: 'Medical Check', cost: 'CNY 500', category: 'medical', firstYearCny: 500 },
    { item: 'Registration Fee', cost: 'CNY 0', category: 'registration', firstYearCny: 0 },
  ];

  const est = computeScholarshipAdjustedEstimate(
    { annualTuitionCny: 20000, level: 'Master' },
    fees,
    csc,
  );

  assert.equal(est.grossTotalCny, 26100);
  assert.equal(est.tuitionDeductionCny, 20000);
  assert.equal(est.netTuitionCny, 0);
  // Only tuition + accommodation (4000) + insurance (800) waived -> app (400) + residence (400) + medical (500) = 1300 remain!
  assert.equal(est.netTotalCny, 1300);
  // Stipend is shown separately (CNY 3,000 for Master), NEVER subtracted from CNY 1,300 cash fees
  assert.equal(est.stipendMonthlyCny, 3000);

  // Fixed CNY scholarship check
  const fixed = toPublicScholarshipScenario('nuist', 1, {
    title: 'Belt & Road Scholarship',
    type: 'Partial',
    amount: '10,000 CNY/Year',
    eligiblePrograms: ['Bachelor'],
  });
  assert.equal(fixed.tuitionWaiverType, 'fixed_cny');
  assert.equal(fixed.tuitionWaiverValue, 10000);
  assert.equal(scholarshipAppliesToProgram(fixed, { level: 'Bachelor', languages: ['English'] }), true);
  assert.equal(scholarshipAppliesToProgram(fixed, { level: 'PhD', languages: ['English'] }), false);

  // Target net-tuition scholarship check (never confuse "Pay 7,000 CNY/Year" with a 7,000 deduction!)
  const netTarget = toPublicScholarshipScenario('hbut', 2, {
    title: 'Entrance Scholarship',
    details: ['Tuition reduced to 7000 CNY/Year'],
  });
  assert.equal(netTarget.tuitionWaiverType, 'net_tuition_cny');
  assert.equal(netTarget.tuitionWaiverValue, 7000);
  const netEst = computeScholarshipAdjustedEstimate(
    { annualTuitionCny: 16000, level: 'Bachelor' },
    fees,
    netTarget,
  );
  assert.equal(netEst.netTuitionCny, 7000);
  assert.equal(netEst.tuitionDeductionCny, 9000);
});

test('2-Tier Hybrid Model: public widget, finders, and benchmark keep deep source URLs hidden', () => {
  const ROOT = process.cwd();
  const widgetSrc = fs.readFileSync(path.join(ROOT, 'src/components/embed/CostCalculatorWidget.tsx'), 'utf8');
  assert.ok(!widgetSrc.includes('sourceUrl'), 'CostCalculatorWidget must never reference or render private sourceUrl');
  assert.ok(!widgetSrc.includes('officialSources'), 'CostCalculatorWidget must not render external officialSources links');
  assert.ok(!widgetSrc.includes('.slice(0, 180)'), 'CostCalculatorWidget must not cap universities/programs at 180');
  assert.ok(widgetSrc.includes('Chinese language'), 'CostCalculatorWidget must include Chinese language level filter');
  assert.ok(widgetSrc.includes('Scholarship Scenario'), 'CostCalculatorWidget must include Scholarship Scenario selector');

  const catalogViews = fs.readFileSync(path.join(ROOT, 'src/lib/catalog-views.ts'), 'utf8');
  assert.ok(!catalogViews.includes('sourceUrl: httpUrl('), 'catalog-views public rows must strip granular sourceUrl');

  const snapshot = buildBangladeshMarketBenchmark([], 0, new Date('2026-11-26T00:00:00Z'));
  assert.equal(snapshot.activeDestinationCount, 12);
  assert.equal(snapshot.globalBenchmarkDestinationCount, 32);
  assert.equal(snapshot.globalDestinations.length, 32);
});
