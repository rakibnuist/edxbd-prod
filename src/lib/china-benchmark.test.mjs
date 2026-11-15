import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import ts from 'typescript';

const transpile = async name => ts.transpileModule(
  await readFile(new URL(name, import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } },
).outputText;
const dataUrl = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;

const clearCostUrl = dataUrl(await transpile('./clear-cost.ts'));
const safeUrlModuleUrl = dataUrl(await transpile('./safe-url.ts'));
const catalogViewsUrl = dataUrl(
  (await transpile('./catalog-views.ts'))
    .replace("'./clear-cost'", `'${clearCostUrl}'`)
    .replace("'./safe-url'", `'${safeUrlModuleUrl}'`),
);
const cityPagesUrl = dataUrl(await transpile('./city-pages.ts'));
const benchmark = await import(
  dataUrl(
    (await transpile('./china-benchmark.ts'))
      .replace("'./catalog-views'", `'${catalogViewsUrl}'`)
      .replace("'./city-pages'", `'${cityPagesUrl}'`),
  ),
);

test('summarizeDistribution computes exact min, quartiles, median and max', () => {
  assert.deepEqual(benchmark.summarizeDistribution([]), {
    count: 0, min: null, q1: null, median: null, q3: null, max: null,
  });
  assert.deepEqual(benchmark.summarizeDistribution([28000, 16000, 20000, 24000, 32000]), {
    count: 5, min: 16000, q1: 20000, median: 24000, q3: 28000, max: 32000,
  });
});

test('buildChinaBenchmark counts only active China institutions and explicit CNY records', () => {
  const makeUni = (overrides) => ({
    id: 'id-1',
    slug: 'nanjing-university',
    legacySlugs: [],
    name: 'Nanjing University',
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
      {
        level: 'Master',
        name: 'Data Science',
        languages: ['English'],
        intakes: ['September'],
        tuition: '25,000 - 30,000 CNY/Year',
        eligibility: [],
        status: 'active',
      },
    ],
    fees: [
      { item: 'Application Fee', cost: '400 CNY' },
      { item: 'Accommodation Fee', cost: '6,000 CNY/Year' },
    ],
    scholarships: [
      {
        title: 'Chinese Government Scholarship',
        details: [],
        eligiblePrograms: ['Master'],
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
    recognitionAuthority: 'Ministry of Education (MoE), PR China',
    sourceUrls: [],
    lastVerifiedAt: '2026-10-20T00:00:00.000Z',
    verificationStatus: 'verified',
    ...overrides,
  });

  const universities = [
    makeUni({}),
    makeUni({
      id: 'id-2',
      slug: 'malaysia-uni',
      name: 'Malaysia University',
      country: 'Malaysia',
      city: 'Kuala Lumpur',
    }),
    makeUni({
      id: 'id-3',
      slug: 'inactive-cn',
      name: 'Inactive University',
      isActive: false,
    }),
  ];

  const report = benchmark.buildChinaBenchmark(universities, [], 7, new Date('2026-11-01T00:00:00Z'));
  assert.equal(report.universityCount, 1);
  assert.equal(report.cityCount, 1);
  assert.equal(report.verification.verified, 1);
  assert.equal(report.programCounts.total, 2);
  assert.equal(report.tuitionDistributions.bachelorEnglish.median, 20000);
  // Ranged tuition ("25,000 - 30,000 CNY/Year") must not be collapsed into a guessed midpoint.
  assert.equal(report.tuitionDistributions.master.count, 0);
  assert.equal(report.feeBenchmarks.find(item => item.category === 'application').median, 400);
  assert.equal(report.scholarshipTotal, 1);
  assert.equal(report.storyCount, 7);
  assert.equal(report.latestVerifiedIso, '2026-10-20');
});
