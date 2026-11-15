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
const leadWorkflowUrl = dataUrl(await transpile('./lead-workflow.ts'));
const copilot = await import(
  dataUrl(
    await transpile('./lead-copilot.ts', {
      "'@/lib/fit-matcher'": `'${fitMatcherUrl}'`,
      "'@/lib/lead-workflow'": `'${leadWorkflowUrl}'`,
    }),
  ),
);
const fitMatcher = await import(fitMatcherUrl);

const candidates = [
  {
    slug: 'anhui-medical-university',
    name: 'Anhui Medical University',
    country: 'China',
    city: 'Hefei',
    degrees: ['Bachelor'],
    taught: ['English'],
    intakes: ['September'],
    majors: ['Clinical Medicine (MBBS)'],
    tuition: 'CNY 30,000 / year',
    recognitionAuthority: 'Ministry of Education (MoE) PR China · WDOMS & BMDC Listed',
    verificationStatus: 'verified',
    hasPublishedCostPlan: true,
    programs: [
      {
        name: 'Clinical Medicine (MBBS)',
        level: 'Bachelor',
        subject: 'Medicine',
        languages: ['English'],
        intakes: ['September'],
        tuition: 'CNY 30,000 / year',
      },
    ],
    scholarships: [
      { title: 'Anhui Provincial Scholarship (15,000-20,000 RMB)', amount: 'Anhui Provincial Scholarship (15,000-20,000 RMB)' },
    ],
  },
];

const mbbsLead = {
  id: 'lead-1',
  name: 'Nusrat Jahan',
  email: 'nusrat@example.com',
  phone: '+8801711000000',
  country: 'China',
  destinationInterest: 'china',
  program: null,
  message: 'Looking for 100% free full scholarship MBBS in China.',
  notes: '',
  status: 'new',
  source: 'homepage_admissions_discovery',
  assignedTeam: 'china_admissions',
  riskFlag: false,
  medicalProgram: true,
  assessAcademicLevel: 'HSC / A Level',
  assessAcademicResults: null,
  assessSubject: 'MBBS',
  assessBudget: 'Under 5 lakh BDT / year',
  assessIntake: 'Autumn 2027',
  assessLanguage: 'English — no test yet',
  assessCareerGoal: 'Doctor',
  assessPreferredCountries: '["china"]',
};

test('buildLeadProfileForCatalog and deterministic triage flag medical and unrealistic scholarship leads', () => {
  const profile = copilot.buildLeadProfileForCatalog(mbbsLead, 'en');
  assert.equal(profile.subject, 'MBBS');
  assert.deepEqual(profile.preferredCountries, ['china']);

  const triage = copilot.buildDeterministicLeadTriage(mbbsLead, profile);
  assert.equal(triage.medicalReviewRequired, true);
  assert.equal(triage.scholarshipExpectationRisk, true);
  assert.equal(triage.readinessTier, 'high_risk_review');
  assert.equal(triage.recommendedTeam, 'medical_review');
  assert.equal(triage.source, 'heuristic');
});

test('extractDecisionTriage maps calibrated ChoiceAnswer and NoulAnswer objects safely', () => {
  const profile = copilot.buildLeadProfileForCatalog(mbbsLead, 'en');
  const baseline = copilot.buildDeterministicLeadTriage(mbbsLead, profile);

  const merged = copilot.extractDecisionTriage(
    {
      readiness: { type: 'choice', choice: 'needs_documents', confidence: 0.87 },
      team_route: { type: 'choice', choice: 'medical_review', confidence: 0.93 },
      medical_review: { type: 'noul', noul: 0.96, confidence: 0.96 },
      scholarship_expectation_risk: { type: 'noul', noul: 0.91, confidence: 0.91 },
    },
    baseline,
  );

  assert.equal(merged.source, 'gemini-decision-1');
  assert.equal(merged.readinessTier, 'needs_documents');
  assert.equal(merged.readinessConfidence, 0.87);
  assert.equal(merged.medicalReviewRequired, true);
  assert.equal(merged.scholarshipExpectationRisk, true);
});

test('sanitizeAndHydrateLeadCopilot strips ungrounded universities/URLs and enforces BMDC checks', () => {
  const profile = copilot.buildLeadProfileForCatalog(mbbsLead, 'en');
  const guides = fitMatcher.buildAllowedGuides(profile, 'en');
  const triage = copilot.buildDeterministicLeadTriage(mbbsLead, profile);

  const result = copilot.sanitizeAndHydrateLeadCopilot(
    {
      counselorBrief: 'Applicant wants MBBS in China with unrealistic full-free expectations and missing HSC Biology GPA.',
      verificationPriorities: ['Request HSC Biology and Chemistry grades cleanly'],
      missingDocuments: ['SSC & HSC Biology marksheets'],
      universityMatches: [
        { slug: 'fake-medical-college', badge: 'Top pick', reason: 'Should be dropped' },
        { slug: 'anhui-medical-university', badge: 'Verify BMDC first', matchedProgram: 'Clinical Medicine (MBBS)', reason: 'WDOMS & BMDC listed university in Hefei.' },
      ],
      recommendedRoutes: [
        { title: 'Phishing', badge: 'Bad', note: 'Drop', href: 'https://bad.example/login' },
        { title: 'MBBS in China guide', badge: 'Start here', note: 'Review BMDC rules and separated fees.', href: '/mbbs-in-china-bangladesh' },
      ],
      whatsappDraft: 'Assalamu Alaikum Nusrat, please share your HSC Biology grades so we can check eligibility.',
      emailSubject: 'Next steps for China MBBS eligibility check',
      emailDraft: 'Dear Nusrat,\n\nPlease reply with your HSC grades so we can review eligibility.',
    },
    mbbsLead,
    profile,
    candidates,
    guides,
    triage,
    { model: 'gemini-4-hydrogen', decisionModel: 'gemini-decision-1' },
  );

  assert.equal(result.mode, 'gemini');
  assert.equal(result.matchedUniversities.length, 1);
  assert.equal(result.matchedUniversities[0].slug, 'anhui-medical-university');
  assert.equal(result.matchedUniversities[0].scholarshipNote, 'Anhui Provincial Scholarship (15,000-20,000 RMB)');
  assert.equal(result.recommendedRoutes.length, 1);
  assert.equal(result.recommendedRoutes[0].href, '/mbbs-in-china-bangladesh');
  assert.ok(result.verificationPriorities.some(item => /bmdc|wdoms/i.test(item)));
  assert.ok(result.internalNoteSnippet.includes('Anhui Medical University'));
});

test('buildCatalogLeadCopilotFallback creates Bengali WhatsApp and Email drafts with visa-first China note', () => {
  const profile = copilot.buildLeadProfileForCatalog(mbbsLead, 'bn');
  const guides = fitMatcher.buildAllowedGuides(profile, 'bn');
  const triage = copilot.buildDeterministicLeadTriage(mbbsLead, profile);

  const bnFallback = copilot.buildCatalogLeadCopilotFallback(mbbsLead, profile, candidates, guides, triage);
  assert.equal(bnFallback.mode, 'catalog');
  assert.equal(bnFallback.language, 'bn');
  assert.ok(/[\u0980-\u09FF]/.test(bnFallback.whatsappDraft));
  assert.ok(/ভিসা/.test(bnFallback.whatsappDraft));
  assert.ok(/BMDC/.test(bnFallback.emailDraft));
});
