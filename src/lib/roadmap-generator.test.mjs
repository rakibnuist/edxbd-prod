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

const roadmapMod = await import(
  dataUrl(
    await transpile('./roadmap-generator.ts', {
      "'./fit-matcher'": `'${fitMatcherUrl}'`,
    }),
  ),
);

const { normalizeRoadmapRequest, buildCatalogRoadmapFallback } = roadmapMod;

test('normalizeRoadmapRequest normalizes inputs and sets safe defaults', () => {
  assert.throws(() => normalizeRoadmapRequest(null), /must be an object/);

  const normalized = normalizeRoadmapRequest({
    studentName: 'Md. Tanvir Ahmed',
    studentPhone: '01711223344',
    studentEmail: 'tanvir@example.com',
    targetCountry: 'China (CSC)',
    targetDegree: 'Master of Engineering',
    intendedMajor: 'Computer Science',
    targetIntake: 'March 2027',
    gpa: '3.80 / 4.00',
    consent: true,
  });

  assert.equal(normalized.studentName, 'Md. Tanvir Ahmed');
  assert.equal(normalized.studentPhone, '01711223344');
  assert.equal(normalized.studentEmail, 'tanvir@example.com');
  assert.equal(normalized.targetCountry, 'China');
  assert.equal(normalized.targetDegree, 'Master');
  assert.equal(normalized.intendedMajor, 'Computer Science');
  assert.equal(normalized.targetIntake, 'March 2027');
  assert.equal(normalized.consent, true);
});

test('buildCatalogRoadmapFallback generates grounded recommendations and ClearCost itemization', () => {
  const req = {
    studentName: 'Amina Khatun',
    targetCountry: 'China',
    targetDegree: 'Bachelor',
    intendedMajor: 'Software Engineering',
    targetIntake: 'September 2027',
    gpa: '5.00',
    budgetRange: 'CNY 15,000–25,000 / year',
    language: 'en',
  };

  const summary = buildCatalogRoadmapFallback(req);

  assert.equal(summary.mode, 'catalog');
  assert.ok(summary.executiveSummary.includes('Amina Khatun'));
  assert.ok(summary.recommendedInstitutions.length >= 3);
  assert.ok(summary.feeItemization.tuitionRange.length > 0);
  assert.ok(summary.feeItemization.eduExpressServiceFee.includes('Zero service fee before China visa approval'));
  assert.ok(summary.timelineMilestones.length >= 3);
});

test('buildCatalogRoadmapFallback enforces BMDC licensing criteria when MBBS is targeted', () => {
  const req = {
    studentName: 'Rahim Chowdhury',
    targetCountry: 'China',
    targetDegree: 'MBBS',
    intendedMajor: 'Clinical Medicine (MBBS)',
    targetIntake: 'March 2027',
    gpa: '4.90',
    language: 'en',
  };

  const summary = buildCatalogRoadmapFallback(req);

  assert.ok(summary.complianceNotes.some(note => note.includes('BMDC') && note.includes('Biology')));
  assert.ok(summary.recommendedInstitutions.some(inst => inst.name.includes('Medical')));
});

test('buildStudyRoadmapPdf compiles valid PDF document bytes with header and metadata', async () => {
  const pdfLibUrl = import.meta.resolve('pdf-lib');
  const roadmapGenUrl = dataUrl(
    await transpile('./roadmap-generator.ts', { "'./fit-matcher'": `'${fitMatcherUrl}'` }),
  );

  const { buildStudyRoadmapPdf } = await import(
    dataUrl(
      await transpile('./pdf-roadmap.ts', {
        "'pdf-lib'": `'${pdfLibUrl}'`,
        "'./roadmap-generator'": `'${roadmapGenUrl}'`,
      }),
    ),
  );

  const sampleReq = {
    studentName: 'Farhana Yasmin',
    targetCountry: 'China',
    targetDegree: 'Master',
    intendedMajor: 'Data Science',
    targetIntake: 'March 2027',
    gpa: '3.75',
    language: 'en',
  };

  const summary = buildCatalogRoadmapFallback(sampleReq);
  const pdfBytes = await buildStudyRoadmapPdf(summary);

  assert.ok(pdfBytes instanceof Uint8Array, 'Output must be a Uint8Array');
  assert.ok(pdfBytes.length > 5000, `PDF size (${pdfBytes.length} bytes) should be substantial`);

  // Verify PDF header magic bytes %PDF-
  const header = Buffer.from(pdfBytes.slice(0, 5)).toString('ascii');
  assert.equal(header, '%PDF-');
});
