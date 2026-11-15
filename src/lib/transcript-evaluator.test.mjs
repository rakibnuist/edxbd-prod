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

const transcriptEvaluator = await import(
  dataUrl(
    await transpile('./transcript-evaluator.ts', {
      "'@/lib/fit-matcher'": `'${fitMatcherUrl}'`,
    }),
  ),
);

const {
  evaluateBmdcEligibility,
  sanitizeAndHydrateTranscriptEvaluation,
  buildCatalogTranscriptFallback,
  TRANSCRIPT_EVALUATOR_SCHEMA,
} = transcriptEvaluator;

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
    aliases: ['AMU'],
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
        totalEstimate: 'CNY 38,000',
      },
    ],
    fees: [],
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
    intake: ['March'],
    aliases: ['APU'],
    recognitionAuthority: 'Malaysian Qualifications Agency (MQA)',
    verificationStatus: 'verified',
    isActive: true,
    details: {
      tuition: 'USD 8,500 / year',
      majors: ['Computer Science'],
    },
    programs: [
      {
        id: 'p-2',
        name: 'BSc (Hons) in Computer Science',
        level: 'Bachelor',
        subject: 'Computer Science',
        languages: ['English'],
        intakes: ['March'],
        tuition: 'USD 8,500 / year',
        status: 'active',
      },
    ],
    scholarships: [],
    costPlans: [],
    fees: [],
  },
];

test('evaluateBmdcEligibility enforces BMDC rules on Science group and Biology >= 3.50', () => {
  const eligibleSci = {
    examination: 'HSC Examination',
    groupOrMajor: 'Science',
    gpa: 5.0,
    scale: 5.0,
    isScienceGroup: true,
    subjects: [
      { name: 'Physics', grade: 'A+', gradePoint: 5.0 },
      { name: 'Chemistry', grade: 'A+', gradePoint: 5.0 },
      { name: 'Biology', grade: 'A', gradePoint: 4.0 },
    ],
  };

  const res1 = evaluateBmdcEligibility(eligibleSci, 'en');
  assert.equal(res1.status, 'eligible');
  assert.equal(res1.biologySatisfied, true);
  assert.equal(res1.biologyGradePoint, 4.0);

  const lowBioSci = {
    examination: 'HSC Examination',
    groupOrMajor: 'Science',
    gpa: 4.5,
    scale: 5.0,
    isScienceGroup: true,
    subjects: [
      { name: 'Physics', grade: 'A+', gradePoint: 5.0 },
      { name: 'Chemistry', grade: 'A', gradePoint: 4.0 },
      { name: 'Biology', grade: 'B', gradePoint: 3.0 },
    ],
  };

  const res2 = evaluateBmdcEligibility(lowBioSci, 'en');
  assert.equal(res2.status, 'ineligible_biology');
  assert.equal(res2.biologySatisfied, false);
  assert.ok(res2.ruleExplanation.includes('3.50'));

  const commerce = {
    examination: 'HSC Examination',
    groupOrMajor: 'Business Studies',
    gpa: 4.8,
    scale: 5.0,
    isScienceGroup: false,
    subjects: [
      { name: 'Accounting', grade: 'A+', gradePoint: 5.0 },
      { name: 'Finance', grade: 'A', gradePoint: 4.0 },
    ],
  };

  const res3 = evaluateBmdcEligibility(commerce, 'bn');
  assert.equal(res3.status, 'ineligible_biology');
  assert.equal(res3.biologySatisfied, false);
  assert.ok(res3.ruleExplanation.includes('বিজ্ঞান বিভাগ'));
});

test('sanitizeAndHydrateTranscriptEvaluation links grounded institutions and attaches ClearCost paths', () => {
  assert.ok(TRANSCRIPT_EVALUATOR_SCHEMA.properties.subjects);

  const rawGeminiOutput = {
    candidateName: 'Tahmid Rahman',
    examination: 'HSC Examination',
    educationBoard: 'Dhaka',
    passingYear: 2024,
    groupOrMajor: 'Science',
    gpa: 4.92,
    scale: 5.0,
    isScienceGroup: true,
    subjects: [
      { name: 'Physics', grade: 'A+', gradePoint: 5.0 },
      { name: 'Chemistry', grade: 'A+', gradePoint: 5.0 },
      { name: 'Biology', grade: 'A+', gradePoint: 5.0 },
      { name: 'Higher Mathematics', grade: 'A', gradePoint: 4.0 },
    ],
    eligibleDisciplines: ['MBBS / Clinical Medicine (Subject to BMDC)', 'Computer Science'],
    counselorSummary: 'Strong science background with outstanding biology and chemistry performance.',
  };

  const hydrated = sanitizeAndHydrateTranscriptEvaluation(rawGeminiOutput, sampleRecords, 'en');
  assert.equal(hydrated.mode, 'gemini');
  assert.equal(hydrated.analysis.gpa, 4.92);
  assert.equal(hydrated.bmdcEligibility.biologySatisfied, true);
  assert.ok(hydrated.recommendedMatches.length > 0);

  const mbbsMatch = hydrated.recommendedMatches.find(m => m.slug === 'anhui-medical-university');
  assert.ok(mbbsMatch);
  assert.equal(mbbsMatch.clearCostPath, '/universities/anhui-medical-university/clear-cost');
  assert.equal(mbbsMatch.bmdcRecognized, true);
});

test('buildCatalogTranscriptFallback provides safe offline catalog recommendations', () => {
  const fallback = buildCatalogTranscriptFallback(
    { targetSubject: 'MBBS', language: 'bn' },
    sampleRecords,
  );

  assert.equal(fallback.mode, 'catalog');
  assert.equal(fallback.language, 'bn');
  assert.ok(fallback.recommendedMatches.length > 0);
  assert.ok(fallback.counselorSummary.includes('ক্যাটালগ'));
});
