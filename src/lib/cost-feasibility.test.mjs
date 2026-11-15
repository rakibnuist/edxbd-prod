import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import ts from 'typescript';

const transpile = async (relPath, replacements = {}) => {
  const source = await readFile(new URL(relPath, import.meta.url), 'utf8');
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  for (const [specifier, target] of Object.entries(replacements)) {
    outputText = outputText.replaceAll(specifier, target);
  }
  return outputText;
};

const dataUrl = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;

const siteUrlsUrl = dataUrl(await transpile('./site-urls.ts'));
const siteNavUrl = dataUrl(
  await transpile('../data/siteNavigation.ts', { "'@/lib/site-urls'": `'${siteUrlsUrl}'` }),
);
const directoryUrl = dataUrl(await transpile('./university-directory.ts'));
const fitMatcherUrl = dataUrl(
  await transpile('./fit-matcher.ts', {
    "'@/data/siteNavigation'": `'${siteNavUrl}'`,
    "'@/lib/site-urls'": `'${siteUrlsUrl}'`,
    "'@/lib/university-directory'": `'${directoryUrl}'`,
  }),
);

const costFeasibility = await import(
  dataUrl(
    await transpile('./cost-feasibility.ts', {
      "'@/lib/fit-matcher'": `'${fitMatcherUrl}'`,
    }),
  ),
);

const {
  estimateCityTier,
  evaluateCostFeasibilityLocally,
  COST_FEASIBILITY_SCHEMA,
} = costFeasibility;

test('estimateCityTier distinguishes Tier 1 megacities from regional Tier 2 cities', () => {
  assert.equal(estimateCityTier('Shanghai'), 'Tier 1 (Higher Living Cost)');
  assert.equal(estimateCityTier('Beijing'), 'Tier 1 (Higher Living Cost)');
  assert.equal(estimateCityTier('Nanjing'), 'Tier 2 / Emerging (Moderate Living Cost)');
  assert.equal(estimateCityTier('Wuhan'), 'Tier 2 / Emerging (Moderate Living Cost)');
  assert.equal(estimateCityTier('Hefei'), 'Tier 2 / Emerging (Moderate Living Cost)');
});

test('evaluateCostFeasibilityLocally calculates year-one totals and provides budget verdict', () => {
  assert.ok(COST_FEASIBILITY_SCHEMA.properties.verdict);

  const samplePrograms = [
    {
      key: 'nuist-cs',
      name: 'Computer Science & Technology',
      universityName: 'Nanjing University of Information Science & Technology',
      universitySlug: 'nuist',
      city: 'Nanjing',
      level: 'Bachelor',
      tuitionCny: 16000,
      tuitionText: 'CNY 16,000 / year',
      tuitionAfterScholarshipCny: 8000,
      recordedFees: [
        { category: 'accommodation', item: 'Double room hostel', cost: 'CNY 4,000 / year', period: 'year', mandatory: true },
        { category: 'insurance', item: 'Medical insurance', cost: 'CNY 800 / year', period: 'year', mandatory: true },
      ],
    },
  ];

  // Comfortably affordable: Budget 800,000 BDT vs ~360,000 BDT cost
  const affordableReport = evaluateCostFeasibilityLocally({
    programs: samplePrograms,
    familyBudgetBdtPerYear: 800000,
    bdtCnyExchangeRate: 17.5,
    language: 'en',
  });

  assert.equal(affordableReport.verdict, 'comfortably_affordable');
  assert.ok(affordableReport.programAnalyses.length === 1);
  assert.ok(affordableReport.programAnalyses[0].firstYearTotalCny >= 20000);
  assert.ok(affordableReport.programAnalyses[0].scholarshipImpact.includes('saves ~BDT'));
  assert.ok(affordableReport.feeTransparencyAudit.eduExpressPolicy.includes('BDT 0'));

  // High financial risk: Budget 200,000 BDT vs ~360,000 BDT cost
  const riskyReport = evaluateCostFeasibilityLocally({
    programs: samplePrograms,
    familyBudgetBdtPerYear: 200000,
    bdtCnyExchangeRate: 17.5,
    language: 'bn',
  });

  assert.equal(riskyReport.verdict, 'high_financial_risk');
  assert.ok(riskyReport.verdictHeadline.includes('উচ্চ আর্থিক ঝুঁকি'));
  assert.ok(riskyReport.counselorBudgetTips.length >= 2);
});
