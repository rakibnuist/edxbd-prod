import {
  asStringList,
  cleanText,
  hydrateGuideRoutes,
  hydrateUniversityMatches,
  isMedicalQuery,
  normalizeCountrySlug,
  type FitCandidateUniversity,
  type FitGuideLink,
  type FitProfileInput,
  type FitResponseLanguage,
  type FitRouteRecommendation,
  type FitUniversityMatch,
} from '@/lib/fit-matcher';
import type { LeadRecord } from '@/lib/lead-workflow';

export type LeadReadinessTier =
  | 'ready_for_shortlist'
  | 'needs_documents'
  | 'needs_budget_clarification'
  | 'high_risk_review';

export type LeadRecommendedTeam =
  | 'china_admissions'
  | 'malaysia_admissions'
  | 'europe_uk_admissions'
  | 'medical_review'
  | 'general';

export interface LeadCopilotTriage {
  readinessTier: LeadReadinessTier;
  readinessConfidence?: number;
  medicalReviewRequired: boolean;
  medicalReviewConfidence?: number;
  scholarshipExpectationRisk: boolean;
  scholarshipRiskConfidence?: number;
  recommendedTeam: LeadRecommendedTeam;
  source: 'gemini-decision-1' | 'heuristic';
}

export interface LeadCopilotResult {
  mode: 'gemini' | 'catalog';
  model?: string;
  decisionModel?: string;
  language: FitResponseLanguage;
  leadId: string;
  triage: LeadCopilotTriage;
  counselorBrief: string;
  verificationPriorities: string[];
  missingDocuments: string[];
  matchedUniversities: FitUniversityMatch[];
  recommendedRoutes: FitRouteRecommendation[];
  whatsappDraft: string;
  emailSubject: string;
  emailDraft: string;
  internalNoteSnippet: string;
}

export interface DecisionAnswerLike {
  type?: string;
  choice?: string;
  noul?: number;
  confidence?: number;
}

export const READINESS_TIERS: LeadReadinessTier[] = [
  'ready_for_shortlist',
  'needs_documents',
  'needs_budget_clarification',
  'high_risk_review',
];

export const RECOMMENDED_TEAMS: LeadRecommendedTeam[] = [
  'china_admissions',
  'malaysia_admissions',
  'europe_uk_admissions',
  'medical_review',
  'general',
];

export const LEAD_COPILOT_JSON_SCHEMA: Record<string, unknown> = {
  type: 'object',
  properties: {
    counselorBrief: {
      type: 'string',
      description: '2-3 factual internal sentences summarizing student readiness, target route, and concrete next counselor action.',
    },
    verificationPriorities: {
      type: 'array',
      maxItems: 5,
      items: { type: 'string' },
      description: 'Specific eligibility, recognition, fee-separation, or visa checks the counselor must verify.',
    },
    missingDocuments: {
      type: 'array',
      maxItems: 5,
      items: { type: 'string' },
      description: 'Documents, test scores, or financial answers missing from this lead record.',
    },
    universityMatches: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'Exact slug from candidateRecords.' },
          badge: { type: 'string', description: 'Short status tag such as Strong fit, Verify BMDC first, or ClearCost recorded.' },
          matchedProgram: { type: 'string', description: 'Exact program name from candidateRecords if present.' },
          scholarshipNote: { type: 'string', description: 'Exact scholarship title/amount context from candidateRecords without guarantees.' },
          reason: { type: 'string', description: '1 concise internal counselor rationale grounded in candidateRecords.' },
        },
        required: ['slug', 'badge', 'reason'],
      },
    },
    recommendedRoutes: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          badge: { type: 'string' },
          note: { type: 'string' },
          href: { type: 'string', description: 'Exact relative path from allowedGuides or /universities/<slug>.' },
        },
        required: ['title', 'badge', 'note', 'href'],
      },
    },
    whatsappDraft: {
      type: 'string',
      description: 'Warm, clear WhatsApp reply addressed to the student/guardian in the requested language without guaranteeing admission, scholarships, or visas.',
    },
    emailSubject: {
      type: 'string',
      description: 'Concise factual email subject line in the requested language.',
    },
    emailDraft: {
      type: 'string',
      description: 'Structured email reply draft in the requested language separating university costs from service terms and listing clear next questions.',
    },
  },
  required: [
    'counselorBrief',
    'verificationPriorities',
    'missingDocuments',
    'universityMatches',
    'recommendedRoutes',
    'whatsappDraft',
    'emailSubject',
    'emailDraft',
  ],
};

type LeadProfileSource = Pick<
  LeadRecord,
  | 'id'
  | 'name'
  | 'country'
  | 'destinationInterest'
  | 'program'
  | 'message'
  | 'notes'
  | 'status'
  | 'source'
  | 'assignedTeam'
  | 'riskFlag'
  | 'medicalProgram'
  | 'assessAcademicLevel'
  | 'assessAcademicResults'
  | 'assessSubject'
  | 'assessBudget'
  | 'assessIntake'
  | 'assessLanguage'
  | 'assessCareerGoal'
> & {
  assessPreferredCountries?: string | null;
};

function parseCountryList(rawJson: string | null | undefined, country: string, interest: string | null | undefined): string[] {
  const values: string[] = [];
  if (rawJson) {
    try {
      const parsed: unknown = JSON.parse(rawJson);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          const text = cleanText(item, 60);
          if (text) values.push(normalizeCountrySlug(text));
        }
      }
    } catch {
      // Ignore malformed stored JSON strings and rely on primary destination columns.
    }
  }

  for (const fallbackVal of [interest, country]) {
    const cleaned = cleanText(fallbackVal, 80);
    if (cleaned && !/not specified|not sure|unspecified/i.test(cleaned)) {
      values.push(normalizeCountrySlug(cleaned));
    }
  }

  return Array.from(new Set(values)).filter(Boolean).slice(0, 5);
}

export function buildLeadProfileForCatalog(
  lead: LeadProfileSource,
  language: FitResponseLanguage = 'en',
): FitProfileInput {
  const subject = cleanText(lead.assessSubject || lead.program || '', 200)
    || (/\b(mbbs|medicine|clinical)\b/i.test(lead.message || '') ? 'MBBS' : 'General study options');

  return {
    academicLevel: cleanText(lead.assessAcademicLevel || '', 120) || 'HSC / A Level',
    academicResults: cleanText(lead.assessAcademicResults || '', 120) || undefined,
    subject,
    careerGoal: cleanText(lead.assessCareerGoal || lead.message || '', 300) || undefined,
    budget: cleanText(lead.assessBudget || '', 120) || undefined,
    intake: cleanText(lead.assessIntake || '', 120) || undefined,
    language: cleanText(lead.assessLanguage || '', 120) || undefined,
    preferredCountries: parseCountryList(lead.assessPreferredCountries, lead.country, lead.destinationInterest),
    responseLanguage: language,
  };
}

const SCHOLARSHIP_EXPECTATION_RE = /\b(100%\s*free|full\s*free|free\s*scholarship|fully\s*funded|full\s*stipend|no\s*cost|zero\s*cost)\b/i;

export function buildDeterministicLeadTriage(
  lead: LeadProfileSource,
  profile: FitProfileInput,
): LeadCopilotTriage {
  const textBlob = `${lead.message || ''} ${lead.notes || ''} ${profile.careerGoal || ''} ${profile.budget || ''}`;
  const medicalReviewRequired = Boolean(lead.medicalProgram || isMedicalQuery(profile));
  const scholarshipExpectationRisk = SCHOLARSHIP_EXPECTATION_RE.test(textBlob)
    || /under\s*5\s*lakh/i.test(profile.budget || '');

  let readinessTier: LeadReadinessTier = 'ready_for_shortlist';
  if (lead.riskFlag || scholarshipExpectationRisk || (medicalReviewRequired && !lead.assessAcademicResults)) {
    readinessTier = 'high_risk_review';
  } else if (!lead.assessBudget || /not sure/i.test(lead.assessBudget)) {
    readinessTier = 'needs_budget_clarification';
  } else if (!lead.assessAcademicResults || !lead.assessLanguage || /not sure/i.test(lead.assessLanguage)) {
    readinessTier = 'needs_documents';
  }

  let recommendedTeam: LeadRecommendedTeam = 'general';
  if (medicalReviewRequired) {
    recommendedTeam = 'medical_review';
  } else if (profile.preferredCountries.includes('china')) {
    recommendedTeam = 'china_admissions';
  } else if (profile.preferredCountries.includes('malaysia')) {
    recommendedTeam = 'malaysia_admissions';
  } else if (profile.preferredCountries.some(slug => !['china', 'malaysia', 'not-sure'].includes(slug))) {
    recommendedTeam = 'europe_uk_admissions';
  }

  return {
    readinessTier,
    medicalReviewRequired,
    scholarshipExpectationRisk,
    recommendedTeam,
    source: 'heuristic',
  };
}

export function extractDecisionTriage(
  answers: Record<string, DecisionAnswerLike> | undefined,
  baseline: LeadCopilotTriage,
): LeadCopilotTriage {
  if (!answers || typeof answers !== 'object') return baseline;

  let readinessTier = baseline.readinessTier;
  let readinessConfidence: number | undefined;
  let recommendedTeam = baseline.recommendedTeam;
  let medicalReviewRequired = baseline.medicalReviewRequired;
  let medicalReviewConfidence: number | undefined;
  let scholarshipExpectationRisk = baseline.scholarshipExpectationRisk;
  let scholarshipRiskConfidence: number | undefined;
  let usedDecisionModel = false;

  const readinessAns = answers.readiness;
  if (readinessAns?.type === 'choice' && READINESS_TIERS.includes(readinessAns.choice as LeadReadinessTier)) {
    readinessTier = readinessAns.choice as LeadReadinessTier;
    readinessConfidence = typeof readinessAns.confidence === 'number' ? readinessAns.confidence : undefined;
    usedDecisionModel = true;
  }

  const teamAns = answers.team_route;
  if (teamAns?.type === 'choice' && RECOMMENDED_TEAMS.includes(teamAns.choice as LeadRecommendedTeam)) {
    recommendedTeam = teamAns.choice as LeadRecommendedTeam;
    usedDecisionModel = true;
  }

  const medAns = answers.medical_review;
  if (medAns?.type === 'noul' && typeof medAns.noul === 'number') {
    medicalReviewRequired = medAns.noul >= 0.5 || baseline.medicalReviewRequired;
    medicalReviewConfidence = medAns.noul;
    usedDecisionModel = true;
  }

  const schAns = answers.scholarship_expectation_risk;
  if (schAns?.type === 'noul' && typeof schAns.noul === 'number') {
    scholarshipExpectationRisk = schAns.noul >= 0.5;
    scholarshipRiskConfidence = schAns.noul;
    usedDecisionModel = true;
  }

  if (!usedDecisionModel) return baseline;

  return {
    readinessTier,
    readinessConfidence,
    medicalReviewRequired,
    medicalReviewConfidence,
    scholarshipExpectationRisk,
    scholarshipRiskConfidence,
    recommendedTeam,
    source: 'gemini-decision-1',
  };
}

function buildMissingDocuments(lead: LeadProfileSource, profile: FitProfileInput, medical: boolean): string[] {
  const bn = profile.responseLanguage === 'bn';
  const items: string[] = [];
  if (!lead.assessAcademicResults) {
    items.push(bn ? 'SSC ও HSC / সর্বশেষ পরীক্ষার মার্কশিট ও GPA/CGPA' : 'Academic transcripts and latest GPA/CGPA breakdown');
  }
  if (!lead.assessLanguage || /no test|not sure/i.test(lead.assessLanguage)) {
    items.push(bn ? 'IELTS / TOEFL স্কোর অথবা ইংরেজি মাধ্যম (MOI) তথ্য' : 'English test score (IELTS/TOEFL) or MOI eligibility confirmation');
  }
  if (!lead.assessBudget || /not sure/i.test(lead.assessBudget)) {
    items.push(bn ? 'টিউশন, হোস্টেল ও থাকা-খাওয়াসহ বাৎসরিক বাজেট' : 'Confirmed yearly budget covering tuition, hostel, and living costs');
  }
  if (medical) {
    items.push(bn ? 'SSC/HSC জীববিজ্ঞান ও রসায়ন নম্বর এবং BMDC/WDOMS সম্মতি যাচাই' : 'HSC Biology/Chemistry grades for BMDC & university medical entry eligibility');
  }
  if (items.length === 0) {
    items.push(bn ? 'পাসপোর্টের বায়ো-পেজ ও পুলিশ ক্লিয়ারেন্স প্রস্তুতি' : 'Valid passport bio page scan and notarized academic certificates');
  }
  return items.slice(0, 5);
}

export function formatCopilotNoteSnippet(
  result: Pick<LeadCopilotResult, 'mode' | 'triage' | 'counselorBrief' | 'matchedUniversities' | 'missingDocuments'>,
): string {
  const lines = [
    `[AI Co-pilot · ${result.triage.readinessTier.replaceAll('_', ' ')} | ${result.triage.recommendedTeam.replaceAll('_', ' ')}]`,
    result.counselorBrief,
  ];
  if (result.matchedUniversities.length > 0) {
    lines.push(
      `Verified options to review: ${result.matchedUniversities
        .map(u => (u.matchedProgram ? `${u.name} (${u.matchedProgram})` : u.name))
        .join('; ')}`,
    );
  }
  if (result.missingDocuments.length > 0) {
    lines.push(`Next missing items: ${result.missingDocuments.slice(0, 3).join(' · ')}`);
  }
  return lines.join('\n');
}

export function buildCatalogLeadCopilotFallback(
  lead: LeadProfileSource,
  profile: FitProfileInput,
  candidates: FitCandidateUniversity[],
  guides: FitGuideLink[],
  triage: LeadCopilotTriage,
): LeadCopilotResult {
  const bn = profile.responseLanguage === 'bn';
  const medical = triage.medicalReviewRequired;
  const studentName = cleanText(lead.name, 80) || (bn ? 'শিক্ষার্থী' : 'there');
  const firstName = studentName.split(/\s+/)[0] || studentName;
  const destinationLabel = cleanText(lead.country || profile.preferredCountries[0] || '', 60) || (bn ? 'চীন ও সক্রিয় দেশসমূহ' : 'China and active destinations');
  const isChina = profile.preferredCountries.includes('china') || /china/i.test(lead.country || '');

  const matchedUniversities: FitUniversityMatch[] = candidates.slice(0, 3).map(uni => {
    const program = uni.programs[0];
    const scholarship = uni.scholarships[0];
    const scholarshipText = scholarship
      ? [scholarship.title, scholarship.amount && scholarship.amount !== scholarship.title ? scholarship.amount : ''].filter(Boolean).join(' · ')
      : undefined;

    return {
      slug: uni.slug,
      name: uni.name,
      country: uni.country,
      city: uni.city,
      href: `/universities/${uni.slug}`,
      badge: medical
        ? (bn ? 'BMDC/WDOMS যাচাই জরুরি' : 'Verify recognition first')
        : uni.hasPublishedCostPlan
          ? (bn ? 'ClearCost তালিকা আছে' : 'ClearCost recorded')
          : (bn ? 'ক্যাটালগ ম্যাচ' : 'Catalog match'),
      matchedProgram: program ? `${program.name} (${program.level})` : undefined,
      tuitionSummary: program?.tuition || uni.tuition,
      scholarshipNote: scholarshipText,
      recognitionNote: uni.recognitionAuthority,
      verificationStatus: uni.verificationStatus,
      reason: bn
        ? `${uni.city}, ${uni.country}-এ ${profile.subject} বিষয়ে রেকর্ডকৃত বিকল্প; চূড়ান্ত আসন ও যোগ্যতা যাচাই করুন।`
        : `Catalog match in ${uni.city}, ${uni.country} for ${profile.subject}; confirm seat availability and latest entry criteria before advising.`,
    };
  });

  const recommendedRoutes: FitRouteRecommendation[] = guides.slice(0, 3).map((guide, index) => ({
    title: guide.title,
    badge: index === 0 ? (bn ? 'প্রধান গাইড' : 'Primary guide') : (bn ? 'তুলনা করুন' : 'Reference'),
    note: guide.description,
    href: guide.href,
  }));

  const missingDocuments = buildMissingDocuments(lead, profile, medical);
  const verificationPriorities: string[] = bn
    ? [
        ...(medical ? ['বাংলাদেশি অনুশীলনের জন্য BMDC ও WDOMS তালিকাভুক্তি আগে যাচাই করুন'] : []),
        'বিশ্ববিদ্যালয় টিউশন, হোস্টেল, দূতাবাস ও থার্ড-পার্টি ফি আলাদাভাবে লিখিত দেখান',
        ...(isChina ? ['ভিসা অনুমোদনের আগে কোনো EduExpress সার্ভিস ফি প্রযোজ্য নয় — এই নীতি স্পষ্ট করুন'] : []),
        'স্কলারশিপ কভারেজ ও নবায়নের (renewal) শর্ত যাচাই করুন; কোনো নিশ্চয়তা দেবেন না',
      ]
    : [
        ...(medical ? ['Verify current WDOMS listing and Bangladesh (BMDC) recognition rules before comparing tuition'] : []),
        'Separate university tuition, hostel, insurance, and third-party visa/embassy fees clearly in writing',
        ...(isChina ? ['Reiterate EduExpress visa-first policy: no EduExpress service fee before China visa approval'] : []),
        'Confirm scholarship eligibility, GPA renewal criteria, and out-of-pocket costs without promising selection',
      ];

  const topNames = matchedUniversities.map(u => u.name).join(', ');
  const counselorBrief = bn
    ? `${studentName} (${profile.academicLevel}, বিষয়: ${profile.subject}, গন্তব্য: ${destinationLabel}) — প্রাথমিক অবস্থা: ${triage.readinessTier.replaceAll('_', ' ')}। ${triage.scholarshipExpectationRisk ? 'বাজেট বা স্কলারশিপ প্রত্যাশা বাস্তবসম্মতভাবে যাচাই করা দরকার।' : 'যোগ্যতা ও প্রয়োজনীয় ডকুমেন্ট যাচাই করে পরবর্তী শর্টলিস্ট পাঠানো যাবে।'}`
    : `${studentName} (${profile.academicLevel}, ${profile.subject} for ${destinationLabel}) — triage status: ${triage.readinessTier.replaceAll('_', ' ')}. ${triage.scholarshipExpectationRisk ? 'Clarify realistic out-of-pocket costs and non-covered living/third-party fees early.' : 'Verify academic scores and documents before sharing a written shortlist.'}`;

  const topGuideHref = recommendedRoutes[0]?.href || '/education-fit-assessment';
  const whatsappDraft = bn
    ? [
        `আসসালামু আলাইকুম ${firstName}, EduExpress International (ধানমন্ডি, ঢাকা) থেকে বলছি।`,
        `আপনার ${profile.subject} (${destinationLabel}) নিয়ে আগ্রহের জন্য ধন্যবাদ। আপনার প্রোফাইল অনুযায়ী ${topNames ? `${topNames}-এর মতো বিকল্পগুলো` : 'যোগ্য বিকল্পগুলো'} আমরা যাচাই করতে পারি।`,
        `সঠিক বিশ্ববিদ্যালয় ও সম্পূর্ণ খরচের লিখিত হিসাব পাঠানোর আগে দয়া করে নিচের তথ্যগুলো শেয়ার করবেন:`,
        `১) ${missingDocuments[0]}`,
        missingDocuments[1] ? `২) ${missingDocuments[1]}` : '',
        isChina
          ? `উল্লেখ্য, চীনের জন্য আমাদের সার্ভিস ফি ভিসা অনুমোদনের আগে প্রযোজ্য নয় (বিশ্ববিদ্যালয় ও দূতাবাস ফি আলাদা)। কোনো আসন বা স্কলারশিপের গ্যারান্টি না দিয়েই আমরা বাস্তব তথ্য অনুযায়ী সহায়তা করি।`
          : `বিস্তারিত লিখিত গাইড দেখতে পারেন: https://eduexpressint.com${topGuideHref}`,
      ]
        .filter(Boolean)
        .join('\n')
    : [
        `Assalamu Alaikum ${firstName}, this is the admissions team at EduExpress International (Dhanmondi, Dhaka).`,
        `Thank you for your enquiry about ${profile.subject} (${destinationLabel}). Before recommending specific universities${topNames ? ` such as ${topNames}` : ''}, we check real eligibility, recognition, and separated costs without making admission or visa guarantees.`,
        `To prepare an accurate written shortlist, please reply with:`,
        `- ${missingDocuments[0]}`,
        missingDocuments[1] ? `- ${missingDocuments[1]}` : '',
        isChina
          ? `Note: For China admissions, EduExpress charges no service fee before China visa approval (university, embassy, and medical fees remain separate). Guide: https://eduexpressint.com${topGuideHref}`
          : `You can also review our guide here: https://eduexpressint.com${topGuideHref}`,
      ]
        .filter(Boolean)
        .join('\n');

  const emailSubject = bn
    ? `${profile.subject} (${destinationLabel}) — প্রাথমিক যোগ্যতা ও খরচের তথ্য | EduExpress International`
    : `Next steps for ${profile.subject} (${destinationLabel}) — EduExpress International`;

  const emailDraft = bn
    ? [
        `প্রিয় ${studentName},`,
        '',
        `EduExpress International-এ যোগাযোগ করার জন্য ধন্যবাদ। আপনার ${profile.subject} (${destinationLabel}) সংক্রান্ত তথ্য আমরা পেয়েছি।`,
        '',
        topNames ? `প্রাথমিকভাবে যেসব বিশ্ববিদ্যালয় রেকর্ড যাচাই করা যায়: ${topNames}` : '',
        medical ? 'গুরুত্বপূর্ণ: মেডিকেল (MBBS) প্রোগ্রামের ক্ষেত্রে খরচ তুলনা করার আগে WDOMS ও বাংলাদেশ (BMDC) স্বীকৃতির নিয়ম যাচাই করা জরুরি।' : '',
        '',
        'পরবর্তী ধাপে সঠিক শর্টলিস্ট ও টিউশন-হোস্টেল-ভিসা খরচের লিখিত ব্রেকডাউন প্রস্তুত করতে নিচের তথ্যগুলো পাঠালে উপকৃত হবো:',
        ...missingDocuments.map(item => `• ${item}`),
        '',
        `প্রয়োজনীয় গাইড: https://eduexpressint.com${topGuideHref}`,
        '',
        'শুভেচ্ছান্তে,',
        'অ্যাডমিশন কাউন্সেলিং টিম',
        'EduExpress International (ধানমন্ডি, ঢাকা)',
      ]
        .filter(line => line !== null)
        .join('\n')
    : [
        `Dear ${studentName},`,
        '',
        `Thank you for reaching out to EduExpress International regarding ${profile.subject} (${destinationLabel}).`,
        '',
        topNames ? `Recorded institutions worth reviewing once your documents are confirmed: ${topNames}.` : '',
        medical ? 'Important verification note: For medical study (MBBS), we check current WDOMS listing and Bangladesh (BMDC) recognition rules before comparing fees.' : '',
        '',
        'To give you a written eligibility check and an itemised cost breakdown (separating university, hostel, embassy, and service terms cleanly), please reply with:',
        ...missingDocuments.map(item => `- ${item}`),
        '',
        `Relevant verified guide: https://eduexpressint.com${topGuideHref}`,
        '',
        'Warm regards,',
        'Admissions Counseling Team',
        'EduExpress International — Dhanmondi, Dhaka',
      ]
        .filter(Boolean)
        .join('\n');

  const result: LeadCopilotResult = {
    mode: 'catalog',
    language: profile.responseLanguage,
    leadId: lead.id,
    triage,
    counselorBrief,
    verificationPriorities: verificationPriorities.slice(0, 5),
    missingDocuments,
    matchedUniversities,
    recommendedRoutes,
    whatsappDraft,
    emailSubject,
    emailDraft,
    internalNoteSnippet: '',
  };

  result.internalNoteSnippet = formatCopilotNoteSnippet(result);
  return result;
}

export function sanitizeAndHydrateLeadCopilot(
  rawModelJson: unknown,
  lead: LeadProfileSource,
  profile: FitProfileInput,
  candidates: FitCandidateUniversity[],
  guides: FitGuideLink[],
  triage: LeadCopilotTriage,
  models: { model?: string; decisionModel?: string },
): LeadCopilotResult {
  const fallback = buildCatalogLeadCopilotFallback(lead, profile, candidates, guides, triage);
  if (!rawModelJson || typeof rawModelJson !== 'object' || Array.isArray(rawModelJson)) {
    return {
      ...fallback,
      decisionModel: triage.source === 'gemini-decision-1' ? models.decisionModel : undefined,
    };
  }

  const parsed = rawModelJson as Record<string, unknown>;
  const matchedUniversities = hydrateUniversityMatches(
    parsed.universityMatches,
    candidates,
    fallback.matchedUniversities,
    3,
  );
  const recommendedRoutes = hydrateGuideRoutes(parsed.recommendedRoutes, candidates, guides, 3);

  const verificationPriorities = asStringList(parsed.verificationPriorities, 5);
  if (triage.medicalReviewRequired && !verificationPriorities.some(item => /bmdc|wdoms|licens|স্বীকৃতি/i.test(item))) {
    verificationPriorities.unshift(
      profile.responseLanguage === 'bn'
        ? 'বাংলাদেশে অনুশীলনের জন্য WDOMS ও BMDC স্বীকৃতি আগে যাচাই করুন'
        : 'Confirm WDOMS listing and Bangladesh (BMDC) recognition before shortlisting MBBS options',
    );
  }

  const missingDocuments = asStringList(parsed.missingDocuments, 5);
  const counselorBrief = cleanText(parsed.counselorBrief, 650) || fallback.counselorBrief;

  const preserveMultiline = (value: unknown, maxLen: number): string => {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLen);
  };

  const result: LeadCopilotResult = {
    mode: 'gemini',
    model: models.model || 'gemini-4-hydrogen',
    decisionModel: triage.source === 'gemini-decision-1' ? models.decisionModel : undefined,
    language: profile.responseLanguage,
    leadId: lead.id,
    triage,
    counselorBrief,
    verificationPriorities: (verificationPriorities.length > 0 ? verificationPriorities : fallback.verificationPriorities).slice(0, 5),
    missingDocuments: (missingDocuments.length > 0 ? missingDocuments : fallback.missingDocuments).slice(0, 5),
    matchedUniversities: matchedUniversities.length > 0 ? matchedUniversities : fallback.matchedUniversities,
    recommendedRoutes: recommendedRoutes.length > 0 ? recommendedRoutes : fallback.recommendedRoutes,
    whatsappDraft: preserveMultiline(parsed.whatsappDraft, 1600) || fallback.whatsappDraft,
    emailSubject: cleanText(parsed.emailSubject, 160) || fallback.emailSubject,
    emailDraft: preserveMultiline(parsed.emailDraft, 2500) || fallback.emailDraft,
    internalNoteSnippet: '',
  };

  result.internalNoteSnippet = formatCopilotNoteSnippet(result);
  return result;
}
