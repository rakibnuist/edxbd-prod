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
const countriesUrl = dataUrl(await transpile('./countries.ts'));

const advisorTools = await import(
  dataUrl(
    await transpile('./advisor-tools.ts', {
      "'@/lib/site-urls'": `'${siteUrlsUrl}'`,
      "'@/lib/fit-matcher'": `'${fitMatcherUrl}'`,
      "'@/lib/countries'": `'${countriesUrl}'`,
    }),
  ),
);

const {
  normalizeAdvisorRequest,
  executeAdvisorTool,
  dedupeCitations,
  buildCatalogAdvisorFallbackAnswer,
  ADVISOR_TOOL_DECLARATIONS,
} = advisorTools;

const sampleRecords = [
  {
    id: 'u-1',
    slug: 'anhui-medical-university',
    name: 'Anhui Medical University',
    chineseName: '安徽医科大学',
    country: 'China',
    city: 'Hefei',
    province: 'Anhui',
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['September'],
    aliases: ['AMU', 'Anhui Med'],
    recognitionAuthority: 'Ministry of Education (MoE) PR China · WDOMS & BMDC Listed',
    verificationStatus: 'verified',
    isActive: true,
    details: {
      tuition: 'CNY 30,000 / year',
      majors: ['Clinical Medicine (MBBS)'],
    },
    programs: [
      {
        id: 'p-1',
        name: 'Clinical Medicine (MBBS)',
        level: 'Bachelor',
        subject: 'Medicine',
        languages: ['English'],
        intakes: ['September'],
        tuition: 'CNY 30,000 / year',
        tuitionAfterScholarship: 'CNY 20,000 / year',
        status: 'active',
      },
    ],
    scholarships: [
      {
        id: 's-1',
        title: 'Anhui Provincial Government Scholarship',
        amount: 'CNY 10,000 / year',
        coverage: 'Tuition reduction',
        condition: 'Maintain GPA 3.0',
        status: 'open',
      },
    ],
    costPlans: [
      {
        id: 'cp-1',
        name: 'MBBS Year 1 ClearCost',
        isPublished: true,
        totalEstimate: 'CNY 38,000 (Tuition + Hostel)',
      },
    ],
    fees: [
      { category: 'Tuition', amount: 'CNY 30,000' },
      { category: 'Hostel', amount: 'CNY 4,000' },
    ],
  },
  {
    id: 'u-2',
    slug: 'asia-pacific-university',
    name: 'Asia Pacific University of Technology & Innovation',
    chineseName: '',
    country: 'Malaysia',
    city: 'Kuala Lumpur',
    province: 'Federal Territory',
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['March', 'November'],
    aliases: ['APU'],
    recognitionAuthority: 'Malaysian Qualifications Agency (MQA)',
    verificationStatus: 'verified',
    isActive: true,
    details: {
      tuition: 'USD 8,500 / year',
      majors: ['Computer Science', 'Cybersecurity'],
    },
    programs: [
      {
        id: 'p-2',
        name: 'BSc (Hons) in Computer Science',
        level: 'Bachelor',
        subject: 'Computer Science',
        languages: ['English'],
        intakes: ['March', 'November'],
        tuition: 'USD 8,500 / year',
        tuitionAfterScholarship: 'USD 6,800 / year',
        status: 'active',
      },
    ],
    scholarships: [
      {
        id: 's-2',
        title: 'Merit Scholarship',
        amount: 'Up to 30% tuition waiver',
        coverage: 'Tuition waiver',
        condition: 'Based on high school GPA',
        status: 'open',
      },
    ],
    costPlans: [],
    fees: [],
  },
];

test('normalizeAdvisorRequest validates and cleans incoming questions', () => {
  const empty = normalizeAdvisorRequest({});
  assert.ok(empty.error);

  const short = normalizeAdvisorRequest({ question: 'hi' });
  assert.ok(short.error);

  const valid = normalizeAdvisorRequest({
    question: ' Can I study MBBS in China with BMDC recognition? ',
    language: 'bn',
    history: [
      { role: 'user', content: 'What are the deadlines?' },
      { role: 'assistant', content: 'March and September intakes are available.' },
    ],
  });

  assert.equal(valid.error, undefined);
  assert.ok(valid.data);
  assert.equal(valid.data.question, 'Can I study MBBS in China with BMDC recognition?');
  assert.equal(valid.data.language, 'bn');
  assert.equal(valid.data.history.length, 2);
  assert.equal(valid.data.history[0].role, 'user');
});

test('executeAdvisorTool search_universities_and_programs scores candidates and attaches citations', () => {
  assert.equal(ADVISOR_TOOL_DECLARATIONS.length, 3);

  const result = executeAdvisorTool(
    'search_universities_and_programs',
    { query: 'Clinical Medicine', country: 'China', limit: 2 },
    sampleRecords,
    'en',
  );

  assert.equal(result.toolResult.medicalQueryDetected, true);
  const universities = result.toolResult.universities;
  assert.ok(Array.isArray(universities));
  assert.ok(universities.length > 0);
  assert.equal(universities[0].slug, 'anhui-medical-university');
  assert.equal(universities[0].clearCostPath, '/universities/anhui-medical-university/clear-cost');

  assert.ok(result.citations.some(c => c.href === '/universities/anhui-medical-university'));
  assert.ok(result.citations.some(c => c.href === '/universities/anhui-medical-university/clear-cost'));
});

test('executeAdvisorTool get_cost_breakdown and lookup_verified_guides return policy and guide citations', () => {
  const cost = executeAdvisorTool(
    'get_cost_breakdown',
    { universitySlugOrName: 'anhui-medical-university', destination: 'China' },
    sampleRecords,
    'en',
  );

  assert.ok(cost.toolResult.university);
  assert.equal(cost.toolResult.university.slug, 'anhui-medical-university');
  assert.ok(cost.toolResult.eduExpressFeePolicy.chinaVisaFirstRule.includes('no consultancy service fee'));

  const guidesEn = executeAdvisorTool(
    'lookup_verified_guides',
    { topic: 'bmdc mbbs recognition', language: 'en' },
    sampleRecords,
    'en',
  );
  assert.ok(guidesEn.citations.some(c => c.href === '/mbbs-in-china-bangladesh'));

  const guidesBn = executeAdvisorTool(
    'lookup_verified_guides',
    { topic: 'cost and package fees', language: 'bn' },
    sampleRecords,
    'bn',
  );
  assert.ok(guidesBn.citations.some(c => c.href === '/bn/study-in-china-cost-bangladesh'));
});

test('dedupeCitations removes duplicate paths and caps items', () => {
  const citations = [
    { title: 'A', href: '/universities/anhui-medical-university', category: 'university' },
    { title: 'A copy', href: '/universities/anhui-medical-university', category: 'university' },
    { title: 'Cost', href: '/universities/anhui-medical-university/clear-cost', category: 'cost_plan' },
    { title: 'External', href: 'https://external.com', category: 'guide' },
  ];

  const deduped = dedupeCitations(citations, 5);
  assert.equal(deduped.length, 2);
  assert.equal(deduped[0].href, '/universities/anhui-medical-university');
  assert.equal(deduped[1].href, '/universities/anhui-medical-university/clear-cost');
});

test('buildCatalogAdvisorFallbackAnswer produces grounded answers in English and Bengali', () => {
  const enAnswer = buildCatalogAdvisorFallbackAnswer(
    'What is the cost of MBBS at Anhui Medical University?',
    sampleRecords,
    'en',
  );

  assert.ok(enAnswer.text.includes('Medical recognition first'));
  assert.ok(enAnswer.text.includes('Anhui Medical University'));
  assert.ok(enAnswer.text.includes('No consultancy can guarantee admission'));
  assert.ok(enAnswer.citations.length > 0);

  const bnAnswer = buildCatalogAdvisorFallbackAnswer(
    'চীনে কম্পিউটার সায়েন্স পড়ার টিউশন ফি কত?',
    sampleRecords,
    'bn',
  );

  assert.ok(bnAnswer.text.includes('EduExpress-এর যাচাইকৃত রেকর্ড'));
  assert.ok(bnAnswer.text.includes('স্বচ্ছতা ও ফি নীতি'));
  assert.ok(bnAnswer.citations.length > 0);
});
