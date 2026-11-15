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

const sopReviewer = await import(
  dataUrl(
    await transpile('./sop-reviewer.ts', {
      "'./fit-matcher'": `'${fitMatcherUrl}'`,
    }),
  ),
);

const {
  normalizeSopReviewRequest,
  countWords,
  buildCatalogSopFallback,
  RECOMMENDED_WORD_RANGES,
} = sopReviewer;

test('normalizeSopReviewRequest validates inputs and sets sensible defaults', () => {
  assert.throws(() => normalizeSopReviewRequest(null), /must be an object/);
  assert.throws(() => normalizeSopReviewRequest({ text: '' }), /text is required/);
  assert.throws(() => normalizeSopReviewRequest({ text: 'too short' }), /minimum 30 characters/);

  const normalized = normalizeSopReviewRequest({
    text: 'This is a long study plan describing my future research ambitions at Southeast University in Nanjing.',
    documentType: 'SOP',
    targetCountry: 'China (CSC)',
    targetDegree: 'Master of Science',
    targetSubject: 'Software Engineering',
    language: 'bn',
  });

  assert.equal(normalized.documentType, 'sop');
  assert.equal(normalized.targetCountry, 'China');
  assert.equal(normalized.targetDegree, 'Master');
  assert.equal(normalized.targetSubject, 'Software Engineering');
  assert.equal(normalized.language, 'bn');
});

test('countWords accurately splits text into tokens', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords('   '), 0);
  assert.equal(countWords('Hello world from Dhaka'), 4);
  assert.equal(countWords('  Chinese   Government   Scholarship   Type-B  '), 4);
});

test('buildCatalogSopFallback scores drafts and enforces word count boundaries', () => {
  const shortReq = {
    text: 'I want to study in China. Please grant me a scholarship for my degree in Beijing.',
    documentType: 'study_plan',
    targetCountry: 'China',
    targetDegree: 'Master',
    language: 'en',
  };

  const result = buildCatalogSopFallback(shortReq);
  assert.ok(result.overallScore < 70, 'Critically short text should have score < 70');
  assert.equal(result.mode, 'catalog');
  assert.ok(result.weaknesses.some(w => w.includes('critically low') || w.includes('words')));
  assert.equal(result.recommendedWordRange.min, RECOMMENDED_WORD_RANGES.Master.min);
});

test('buildCatalogSopFallback detects red flags (unauthorized work and immigration) and MBBS rules', () => {
  const riskyDraft = {
    text: 'I plan to study MBBS in Nanjing. During weekends, I will do a part-time job to work and pay my expenses. After graduation, I want to immigrate and settle down in China permanently.',
    documentType: 'study_plan',
    targetCountry: 'China',
    targetDegree: 'MBBS',
    targetSubject: 'Clinical Medicine MBBS',
    language: 'en',
  };

  const result = buildCatalogSopFallback(riskyDraft);
  assert.ok(result.countrySpecificFeedback.visaComplianceRisk, 'Should flag visa risk for work and settlement');
  assert.ok(result.countrySpecificFeedback.medicalLicensingNote, 'Should include BMDC medical licensing note');
  assert.ok(
    result.countrySpecificFeedback.medicalLicensingNote.includes('BMDC') ||
      result.countrySpecificFeedback.medicalLicensingNote.includes('WDOMS'),
  );
  assert.ok(result.weaknesses.some(w => w.includes('employment') || w.includes('work')));
  assert.ok(result.weaknesses.some(w => w.includes('immigration') || w.includes('settlement')));
});

test('buildCatalogSopFallback outputs authentic Bengali when language is bn', () => {
  const bnReq = {
    text: 'আমার নাম রাকিব। আমি চীনে মাস্টার্স করার জন্য সিএসসি স্কলারশিপ পেতে চাই। আমার গবেষণার বিষয় কৃত্রিম বুদ্ধিমত্তা। ডিগ্রি শেষে আমি বাংলাদেশে ফিরে আসব।',
    documentType: 'study_plan',
    targetCountry: 'China',
    targetDegree: 'Master',
    language: 'bn',
  };

  const result = buildCatalogSopFallback(bnReq);
  assert.equal(result.language, 'bn');
  assert.ok(result.disclaimer.includes('এডুএক্সপ্রেস'));
  assert.ok(result.strengths.length > 0);
});
