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
const matcher = await import(
  dataUrl(
    await transpile('./fit-matcher.ts', {
      "'@/data/siteNavigation'": `'${siteNavUrl}'`,
      "'@/lib/site-urls'": `'${siteUrlsUrl}'`,
      "'@/lib/university-directory'": `'${directoryUrl}'`,
    }),
  ),
);

const sampleCandidates = [
  {
    slug: 'sichuan-university',
    name: 'Sichuan University',
    country: 'China',
    city: 'Chengdu',
    degrees: ['Bachelor', 'MBBS'],
    taught: ['English'],
    intakes: ['September'],
    majors: ['Software Engineering', 'MBBS'],
    tuition: 'CNY 17,500–45,000 / year',
    recognitionAuthority: 'Ministry of Education (MoE) PR China · WDOMS & BMDC Listed',
    verificationStatus: 'verified',
    hasPublishedCostPlan: true,
    programs: [
      {
        name: 'Software Engineering',
        level: 'Bachelor',
        subject: 'Computer Science',
        languages: ['English'],
        intakes: ['September'],
        tuition: '22,000 CNY/Year',
      },
      {
        name: 'Clinical Medicine (MBBS)',
        level: 'MBBS',
        subject: 'Medicine',
        languages: ['English'],
        intakes: ['September'],
        tuition: '39,000 CNY/Year',
      },
    ],
    scholarships: [
      { title: 'Belt & Road Scholarship', amount: '20,000 CNY/Year' },
    ],
  },
  {
    slug: 'asia-pacific-university',
    name: 'Asia Pacific University of Technology & Innovation',
    country: 'Malaysia',
    city: 'Kuala Lumpur',
    degrees: ['Foundation', 'Diploma', 'Bachelor', 'Master'],
    taught: ['English'],
    intakes: ['March', 'September'],
    majors: ['Computer Science', 'Cybersecurity'],
    tuition: 'RM 24,000 – RM 32,000 / year',
    recognitionAuthority: 'MQA Malaysia',
    verificationStatus: 'verified',
    hasPublishedCostPlan: false,
    programs: [
      {
        name: 'BSc (Hons) in Computer Science',
        level: 'Bachelor',
        subject: 'Computer Science',
        languages: ['English'],
        intakes: ['March', 'September'],
        tuition: 'RM 28,000 / year',
      },
    ],
    scholarships: [],
  },
  {
    slug: 'dalian-university-of-technology',
    name: 'Dalian University of Technology',
    country: 'China',
    city: 'Dalian',
    degrees: ['Bachelor'],
    taught: ['English'],
    intakes: ['September'],
    majors: ['Civil Engineering', 'Mechanical Engineering'],
    tuition: 'CNY 19,500 / year',
    recognitionAuthority: 'Ministry of Education (MoE), PR China',
    verificationStatus: 'under_verification',
    hasPublishedCostPlan: true,
    programs: [
      {
        name: 'Mechanical Design & Manufacturing',
        level: 'Bachelor',
        subject: 'Engineering',
        languages: ['English'],
        intakes: ['September'],
        tuition: '19,500 CNY/Year',
      },
    ],
    scholarships: [{ title: 'University Scholarship', amount: 'Partial waiver' }],
  },
];

test('normalizeFitProfileInput enforces required fields and normalizes destinations', () => {
  assert.ok(matcher.normalizeFitProfileInput(null).error);
  assert.ok(matcher.normalizeFitProfileInput({ academicLevel: 'HSC / A Level', subject: '' }).error);

  const valid = matcher.normalizeFitProfileInput({
    academicLevel: ' HSC / A Level ',
    subject: ' Computer Science ',
    preferredCountries: ['United Kingdom', 'China', 'China'],
    responseLanguage: 'bn',
  });
  assert.equal(valid.error, undefined);
  assert.equal(valid.data.academicLevel, 'HSC / A Level');
  assert.equal(valid.data.subject, 'Computer Science');
  assert.deepEqual(valid.data.preferredCountries, ['uk', 'china']);
  assert.equal(valid.data.responseLanguage, 'bn');
});

test('scoreCandidateUniversities prioritizes subject, country, and medical recognition', () => {
  const csChina = matcher.scoreCandidateUniversities(
    {
      academicLevel: 'HSC / A Level',
      subject: 'Computer Science',
      preferredCountries: ['china'],
      language: 'English — no test yet',
      intake: 'Autumn 2027',
      responseLanguage: 'en',
    },
    sampleCandidates,
    3,
  );
  assert.equal(csChina[0].slug, 'sichuan-university');

  const csMalaysia = matcher.scoreCandidateUniversities(
    {
      academicLevel: 'HSC / A Level',
      subject: 'Computer Science',
      preferredCountries: ['malaysia'],
      language: 'IELTS / TOEFL ready',
      intake: 'Spring 2027',
      responseLanguage: 'en',
    },
    sampleCandidates,
    3,
  );
  assert.equal(csMalaysia[0].slug, 'asia-pacific-university');

  const mbbsChina = matcher.scoreCandidateUniversities(
    {
      academicLevel: 'HSC / A Level',
      subject: 'MBBS',
      careerGoal: 'Doctor',
      preferredCountries: ['china'],
      responseLanguage: 'en',
    },
    sampleCandidates,
    3,
  );
  assert.equal(mbbsChina[0].slug, 'sichuan-university');
  assert.equal(mbbsChina[0].programs.length, 1);
  assert.equal(mbbsChina[0].programs[0].level, 'MBBS');

  const mixedWithUnrelatedProgram = [
    ...sampleCandidates,
    {
      slug: 'legacy-cs-major-only',
      name: 'Legacy CS University',
      country: 'Malaysia',
      city: 'Semenyih',
      degrees: ['Bachelor'],
      taught: ['English'],
      intakes: ['September'],
      majors: ['Computer Science', 'Chemical Engineering'],
      tuition: 'RM 35,000 / year',
      verificationStatus: 'verified',
      hasPublishedCostPlan: true,
      programs: [
        {
          name: 'BEng (Hons) in Chemical Engineering',
          level: 'Bachelor',
          subject: 'Engineering',
          languages: ['English'],
          intakes: ['September'],
          tuition: 'RM 38,000 / year',
        },
      ],
      scholarships: [],
    },
  ];
  const scoredMixed = matcher.scoreCandidateUniversities(
    {
      academicLevel: 'HSC / A Level',
      subject: 'Computer Science',
      preferredCountries: ['malaysia'],
      responseLanguage: 'en',
    },
    mixedWithUnrelatedProgram,
    4,
  );
  assert.equal(scoredMixed[0].slug, 'asia-pacific-university');
  const legacyEntry = scoredMixed.find(item => item.slug === 'legacy-cs-major-only');
  assert.ok(legacyEntry);
  assert.equal(legacyEntry.programs.length, 0);
});

test('sanitizeAndHydrateGeminiPreview rejects hallucinated slugs and unsafe URLs while preserving DB facts', () => {
  const profile = {
    academicLevel: 'HSC / A Level',
    subject: 'MBBS',
    preferredCountries: ['china'],
    responseLanguage: 'en',
  };
  const guides = matcher.buildAllowedGuides(profile, 'en');

  const hydrated = matcher.sanitizeAndHydrateGeminiPreview(
    {
      summaryHeadline: 'Medical study routes to check first',
      summaryNote: 'Verify WDOMS and BMDC status before comparing tuition.',
      universityMatches: [
        {
          slug: 'hallucinated-university',
          badge: 'Fake',
          reason: 'Should be dropped',
        },
        {
          slug: 'sichuan-university',
          badge: 'Verify recognition',
          matchedProgram: 'Clinical Medicine (MBBS)',
          reason: 'Matches English-taught MBBS in Chengdu with published ClearCost plan.',
        },
      ],
      routes: [
        {
          title: 'Malicious link',
          badge: 'Bad',
          note: 'Should be filtered out',
          href: 'https://evil.example/phish',
        },
        {
          title: 'MBBS in China guide',
          badge: 'Start here',
          note: 'Check WDOMS & BMDC status and separated costs.',
          href: '/mbbs-in-china-bangladesh',
        },
      ],
      checks: ['Tuition and hostel costs separately'],
      missing: ['HSC biology and chemistry marks'],
      clarifyingQuestion: 'Do you have your HSC GPA and passport ready?',
    },
    profile,
    sampleCandidates,
    guides,
  );

  assert.equal(hydrated.mode, 'gemini');
  assert.equal(hydrated.universityMatches.length, 1);
  assert.equal(hydrated.universityMatches[0].slug, 'sichuan-university');
  assert.equal(hydrated.universityMatches[0].href, '/universities/sichuan-university');
  assert.equal(hydrated.universityMatches[0].recognitionNote, 'Ministry of Education (MoE) PR China · WDOMS & BMDC Listed');
  assert.equal(hydrated.routes.length, 1);
  assert.equal(hydrated.routes[0].href, '/mbbs-in-china-bangladesh');
  assert.ok(
    hydrated.checks.some(item => /bmdc|wdoms/i.test(item)),
    'Expected automatic WDOMS/BMDC recognition check for medical queries',
  );
});

test('buildCatalogFallbackPreview supports Bengali output with grounded university cards', () => {
  const profile = {
    academicLevel: 'HSC / A Level',
    subject: 'Computer Science',
    preferredCountries: ['china'],
    responseLanguage: 'bn',
  };
  const guides = matcher.buildAllowedGuides(profile, 'bn');
  const preview = matcher.buildCatalogFallbackPreview(profile, sampleCandidates, guides);

  assert.equal(preview.mode, 'catalog');
  assert.equal(preview.language, 'bn');
  assert.equal(preview.universityMatches.length, 3);
  assert.equal(preview.universityMatches[0].href, '/universities/sichuan-university');
  const costRoute = preview.routes.find(route => route.href === '/bn/study-in-china-cost-bangladesh');
  assert.ok(costRoute);
  assert.ok(/[\u0980-\u09FF]/.test(costRoute.note));
  assert.ok(preview.missing.length >= 3);
});
