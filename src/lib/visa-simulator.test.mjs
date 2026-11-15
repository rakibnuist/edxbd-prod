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

const visaSimulator = await import(
  dataUrl(
    await transpile('./visa-simulator.ts', {
      "'@/lib/fit-matcher'": `'${fitMatcherUrl}'`,
    }),
  ),
);

const {
  getQuestionsForDestination,
  evaluateAnswersLocally,
  CHINA_VISA_QUESTIONS,
  MALAYSIA_VISA_QUESTIONS,
} = visaSimulator;

test('getQuestionsForDestination provides destination-specific 4-stage questions', () => {
  const chinaQ = getQuestionsForDestination('china');
  assert.equal(chinaQ.length, 4);
  assert.equal(chinaQ[0].category, 'purpose');
  assert.equal(chinaQ[1].category, 'institution');
  assert.equal(chinaQ[2].category, 'funding');
  assert.equal(chinaQ[3].category, 'post_study');

  const myQ = getQuestionsForDestination('malaysia');
  assert.equal(myQ.length, 4);
  assert.ok(myQ[2].questionEn.includes('EMGS'));
});

test('evaluateAnswersLocally detects unauthorized work and settlement red flags', () => {
  const highRiskInput = {
    destination: 'china',
    universityName: 'Nanjing University of Information Science & Technology',
    programName: 'Computer Science',
    academicLevel: 'Bachelor',
    language: 'en',
    answers: [
      { questionId: 1, answer: 'China has advanced computing curriculum and international laboratories.' },
      { questionId: 2, answer: 'NUIST is in Nanjing, Jiangsu Province, 4-year degree in English.' },
      { questionId: 3, answer: 'My parents will pay the first semester, then I will do part-time job there to cover my expenses.' },
      { questionId: 4, answer: 'I want to settle in China permanently and find a permanent job there.' },
    ],
  };

  const feedback = evaluateAnswersLocally(highRiskInput);
  assert.equal(feedback.verdict, 'needs_revision');
  assert.ok(feedback.readinessScore < 60);
  assert.ok(feedback.redFlags.some(f => f.includes('off-campus work') || f.includes('Student visas prohibit')));
  assert.ok(feedback.redFlags.some(f => f.includes('Immigration intent')));
});

test('evaluateAnswersLocally generates strong verdict and bilingual tips for compliant answers', () => {
  const strongInput = {
    destination: 'china',
    universityName: 'Anhui Medical University',
    programName: 'Clinical Medicine (MBBS)',
    academicLevel: 'Bachelor',
    language: 'bn',
    answers: [
      { questionId: 1, answer: 'আনোয়ার মেডিকেল বিশ্ববিদ্যালয়ের ক্লিনিক্যাল কারিকুলাম ও আন্তর্জাতিক স্বীকৃতি চমৎকার।' },
      { questionId: 2, answer: 'বিশ্ববিদ্যালয়টি আনহুই প্রদেশের হেফেই শহরে অবস্থিত, ৫ বছর পাঠদান ও ১ বছর ইন্টার্নশিপ।' },
      { questionId: 3, answer: 'আমার পিতা একজন প্রতিষ্ঠিত ব্যবসায়ী এবং তিনি ব্যাংকের মাধ্যমে সকল টিউশন ও হোস্টেল ব্যয় বহন করবেন।' },
      { questionId: 4, answer: 'পড়াশোনা সম্পন্ন করে আমি বাংলাদেশে ফিরে আসব এবং বিএমডিসি লাইসেন্সিং পরীক্ষায় অংশ নিয়ে চিকিৎসা সেবা দেব।' },
    ],
  };

  const feedback = evaluateAnswersLocally(strongInput);
  assert.equal(feedback.verdict, 'strong');
  assert.ok(feedback.readinessScore >= 80);
  assert.equal(feedback.redFlags.length, 0);
  assert.ok(feedback.counselorTips.length >= 2);
  assert.ok(feedback.verdictLabel.includes('সন্তোষজনক'));
});
