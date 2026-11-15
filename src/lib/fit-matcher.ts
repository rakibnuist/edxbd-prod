import { destinationLinks } from '@/data/siteNavigation';
import { destinationPath } from '@/lib/site-urls';
import { intakeMonths, SUBJECT_AREAS } from '@/lib/university-directory';

export type FitResponseLanguage = 'en' | 'bn';

export interface FitProfileInput {
  academicLevel: string;
  academicResults?: string;
  subject: string;
  careerGoal?: string;
  budget?: string;
  intake?: string;
  language?: string;
  preferredCountries: string[];
  responseLanguage: FitResponseLanguage;
}

export interface FitCandidateProgram {
  name: string;
  level: string;
  subject?: string;
  languages: string[];
  intakes: string[];
  tuition?: string;
  tuitionAfterScholarship?: string;
}

export interface FitCandidateScholarship {
  title: string;
  amount?: string;
  coverage?: string;
  condition?: string;
}

export interface FitCandidateUniversity {
  slug: string;
  name: string;
  country: string;
  city: string;
  degrees: string[];
  taught: string[];
  intakes: string[];
  majors: string[];
  tuition: string;
  recognitionAuthority?: string;
  verificationStatus: 'verified' | 'under_verification' | 'expired';
  hasPublishedCostPlan: boolean;
  programs: FitCandidateProgram[];
  scholarships: FitCandidateScholarship[];
}

export interface FitUniversityMatch {
  slug: string;
  name: string;
  country: string;
  city: string;
  href: string;
  badge: string;
  matchedProgram?: string;
  tuitionSummary: string;
  scholarshipNote?: string;
  recognitionNote?: string;
  verificationStatus: 'verified' | 'under_verification' | 'expired';
  reason: string;
}

export interface FitRouteRecommendation {
  title: string;
  badge: string;
  note: string;
  href: string;
}

export interface FitGuideLink {
  title: string;
  href: string;
  description: string;
}

export interface FitPreviewResult {
  mode: 'gemini' | 'catalog';
  model?: string;
  language: FitResponseLanguage;
  summaryHeadline: string;
  summaryNote: string;
  universityMatches: FitUniversityMatch[];
  routes: FitRouteRecommendation[];
  checks: string[];
  missing: string[];
  clarifyingQuestion?: string;
}

const MEDICAL_PATTERN = /\b(mbbs|medicine|medical|doctor|dentist|dental|clinical|pharmacy|nursing)\b/i;

const LEVEL_MAP: Record<string, string[]> = {
  'ssc / o level': ['foundation', 'diploma', 'chinese language', 'language'],
  'hsc / a level': ['bachelor', 'mbbs', 'foundation', 'diploma', 'chinese language'],
  diploma: ['bachelor', 'diploma', 'foundation'],
  "bachelor's": ['master', 'phd'],
  "master's": ['phd', 'master'],
};

const COUNTRY_SLUGS: Record<string, string> = {
  china: 'china',
  malaysia: 'malaysia',
  uk: 'uk',
  'united kingdom': 'uk',
  'united-kingdom': 'uk',
  hungary: 'hungary',
  'south korea': 'south-korea',
  'south-korea': 'south-korea',
  korea: 'south-korea',
  finland: 'finland',
  malta: 'malta',
  cyprus: 'cyprus',
  georgia: 'georgia',
  greece: 'greece',
  croatia: 'croatia',
  thailand: 'thailand',
};

const STOP_WORDS = new Set([
  'and', 'the', 'for', 'with', 'in', 'of', 'to', 'a', 'an', 'study', 'degree', 'program', 'course',
]);

const BROAD_ACADEMIC_TERMS = new Set([
  'science', 'sciences', 'engineering', 'studies', 'management', 'technology', 'arts', 'honours', 'hons', 'bachelor', 'master',
]);

export const FIT_PREVIEW_JSON_SCHEMA: Record<string, unknown> = {
  type: 'object',
  properties: {
    summaryHeadline: {
      type: 'string',
      description: 'Short, calm headline summarizing the student fit in the requested language.',
    },
    summaryNote: {
      type: 'string',
      description: '1 to 2 plain sentences summarizing realistic routes, trade-offs, and verification priorities without guaranteeing admission, scholarships, or visas.',
    },
    universityMatches: {
      type: 'array',
      maxItems: 4,
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'Exact slug from candidateRecords.' },
          badge: { type: 'string', description: 'Short label like Strong subject fit, Verify recognition first, or Open cost plan.' },
          matchedProgram: { type: 'string', description: 'Exact matching program name from candidateRecords if available.' },
          scholarshipNote: { type: 'string', description: 'Recorded scholarship context from candidateRecords without inventing coverage.' },
          reason: { type: 'string', description: '1 concise sentence explaining why this recorded university fits or what to verify.' },
        },
        required: ['slug', 'badge', 'reason'],
      },
    },
    routes: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Actionable route title.' },
          badge: { type: 'string', description: 'Short tag.' },
          note: { type: 'string', description: 'Practical guidance on cost, eligibility, or verification.' },
          href: { type: 'string', description: 'Exact href chosen from allowedGuides or /universities/<slug>.' },
        },
        required: ['title', 'badge', 'note', 'href'],
      },
    },
    checks: {
      type: 'array',
      maxItems: 5,
      items: { type: 'string' },
      description: 'Concrete eligibility, cost, recognition, or visa checks required next.',
    },
    missing: {
      type: 'array',
      maxItems: 5,
      items: { type: 'string' },
      description: 'Specific academic, budget, language, or document details still needed.',
    },
    clarifyingQuestion: {
      type: 'string',
      description: 'One short practical question a counsellor would ask next.',
    },
  },
  required: ['summaryHeadline', 'summaryNote', 'universityMatches', 'routes', 'checks', 'missing'],
};

export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

export function normalizeCountrySlug(value: string): string {
  const key = value.trim().toLowerCase();
  return COUNTRY_SLUGS[key] || key.replace(/\s+/g, '-');
}

export function isMedicalQuery(profile: Pick<FitProfileInput, 'subject' | 'careerGoal'>): boolean {
  return MEDICAL_PATTERN.test(`${profile.subject} ${profile.careerGoal || ''}`);
}

export function normalizeFitProfileInput(raw: unknown): { data?: FitProfileInput; error?: string } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { error: 'Assessment profile must be a JSON object.' };
  }

  const body = raw as Record<string, unknown>;
  const academicLevel = cleanText(body.academicLevel, 120);
  const subject = cleanText(body.subject, 200);

  if (!academicLevel || !subject) {
    return { error: 'Academic level and subject are required to match study routes.' };
  }

  const preferredCountriesRaw = Array.isArray(body.preferredCountries) ? body.preferredCountries : [];
  const preferredCountries = Array.from(
    new Set(
      preferredCountriesRaw
        .map(item => cleanText(item, 60))
        .filter(Boolean)
        .map(normalizeCountrySlug),
    ),
  ).slice(0, 5);

  return {
    data: {
      academicLevel,
      academicResults: cleanText(body.academicResults, 120) || undefined,
      subject,
      careerGoal: cleanText(body.careerGoal, 300) || undefined,
      budget: cleanText(body.budget, 120) || undefined,
      intake: cleanText(body.intake, 120) || undefined,
      language: cleanText(body.language, 120) || undefined,
      preferredCountries,
      responseLanguage: body.responseLanguage === 'bn' ? 'bn' : 'en',
    },
  };
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .split(/\s+/)
    .filter(token => token.length >= 2 && !STOP_WORDS.has(token));
}

function levelMatchesText(targetLevels: string[], raw: string): boolean {
  const value = raw.toLowerCase();
  return targetLevels.some(target => {
    if (target === 'bachelor') return /bachelor|undergraduate|mbbs/.test(value);
    if (target === 'master') return /master|postgraduate/.test(value);
    if (target === 'phd') return /phd|doctor/.test(value);
    if (target === 'mbbs') return /mbbs|clinical|medicine/.test(value);
    if (target === 'foundation') return /foundation|preparatory|pre-?university/.test(value);
    if (target === 'diploma') return /diploma|associate/.test(value);
    if (target === 'chinese language') return /language|chinese/.test(value);
    return value.includes(target);
  });
}

function getTargetLevels(academicLevel: string): string[] {
  const key = academicLevel.trim().toLowerCase();
  return LEVEL_MAP[key] || ['bachelor', 'master', 'foundation'];
}

function intakeOverlapScore(studentIntake: string | undefined, recordIntakes: string[]): number {
  if (!studentIntake || /not sure|flexible/i.test(studentIntake)) return 0;
  const lower = studentIntake.toLowerCase();
  const months = intakeMonths(recordIntakes);
  if (lower.includes('spring') && months.some(m => ['February', 'March', 'April'].includes(m))) return 10;
  if (lower.includes('autumn') && months.some(m => ['September', 'October'].includes(m))) return 10;
  return 0;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wordPrefixMatches(text: string, term: string): boolean {
  return new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(term)}`, 'i').test(text);
}

export function scoreCandidateUniversities(
  profile: FitProfileInput,
  records: FitCandidateUniversity[],
  limit = 8,
): FitCandidateUniversity[] {
  const medical = isMedicalQuery(profile);
  const targetLevels = getTargetLevels(profile.academicLevel);
  const subjectOnly = cleanText(profile.subject, 200);
  const combinedText = `${subjectOnly} ${profile.careerGoal || ''}`.trim();
  const matchedAreas = SUBJECT_AREAS.filter(area => area.pattern.test(subjectOnly));
  const areaList = matchedAreas.length > 0
    ? matchedAreas
    : SUBJECT_AREAS.filter(area => area.pattern.test(combinedText));

  const rawTokens = tokenize(subjectOnly);
  const narrowedTokens = rawTokens.filter(token => !BROAD_ACADEMIC_TERMS.has(token));
  const specificTerms = narrowedTokens.length > 0 || areaList.length > 0 ? narrowedTokens : rawTokens;
  const subjectPhrase = subjectOnly.toLowerCase();

  const selectedCountries = profile.preferredCountries.filter(c => c !== 'not-sure');
  const openChoice = selectedCountries.length === 0;

  const scored = records.map(uni => {
    let score = 0;
    const uniCountry = normalizeCountrySlug(uni.country);

    if (!openChoice) {
      if (selectedCountries.includes(uniCountry)) score += 45;
      else score -= 15;
    } else if (uniCountry === 'china') {
      score += 12;
    } else if (uniCountry === 'malaysia') {
      score += 8;
    }

    const scoredPrograms = uni.programs
      .map(program => {
        const programText = `${program.name} ${program.subject || ''} ${program.level}`;
        const programLower = programText.toLowerCase();
        const levelOk = levelMatchesText(targetLevels, program.level);
        const exactPhrase = subjectPhrase.length >= 3 && programLower.includes(subjectPhrase);
        const termHit = specificTerms.some(term => wordPrefixMatches(programText, term));
        const areaHit = areaList.some(area => area.pattern.test(programText));
        const medHit = medical && MEDICAL_PATTERN.test(programText);

        let progScore = 0;
        if (medHit) {
          progScore = levelOk ? 4 : 2;
        } else if (levelOk && (exactPhrase || termHit || areaHit)) {
          if (exactPhrase) progScore += 3;
          if (termHit) progScore += 2;
          if (areaHit) progScore += 1;
        }
        return { program, progScore };
      })
      .filter(entry => entry.progScore > 0)
      .sort((a, b) => b.progScore - a.progScore);

    const matchingPrograms = scoredPrograms.map(entry => entry.program);

    if (scoredPrograms.length > 0) {
      score += 56 + scoredPrograms[0].progScore * 4;
    } else {
      const levelFit = uni.degrees.some(d => levelMatchesText(targetLevels, d))
        || uni.programs.some(p => levelMatchesText(targetLevels, p.level));
      if (levelFit) score += 12;

      const majorText = uni.majors.join(' ').toLowerCase();
      if ((subjectPhrase.length >= 3 && majorText.includes(subjectPhrase))
        || specificTerms.some(term => wordPrefixMatches(majorText, term))) {
        score += 22;
      } else if (areaList.some(area => area.pattern.test(majorText))) {
        score += 12;
      }
    }

    if (medical) {
      const hasMedical = uni.programs.some(p => MEDICAL_PATTERN.test(`${p.name} ${p.level} ${p.subject || ''}`))
        || MEDICAL_PATTERN.test(uni.majors.join(' '))
        || MEDICAL_PATTERN.test(uni.degrees.join(' '));
      if (hasMedical) {
        score += 40;
        if (/wdoms|bmdc/i.test(uni.recognitionAuthority || '')) score += 18;
      } else {
        score -= 25;
      }
    }

    if (profile.language) {
      const taughtBlob = `${uni.taught.join(' ')} ${uni.programs.flatMap(p => p.languages).join(' ')}`.toLowerCase();
      if (/english/i.test(profile.language) && taughtBlob.includes('english')) score += 12;
      if (/another language/i.test(profile.language) && taughtBlob.includes('chinese')) score += 8;
    }

    const allIntakes = [...uni.intakes, ...uni.programs.flatMap(p => p.intakes)];
    score += intakeOverlapScore(profile.intake, allIntakes);

    if (uni.verificationStatus === 'verified') score += 8;
    if (uni.hasPublishedCostPlan) score += 6;
    if (uni.scholarships.length > 0) score += 5;

    // Keep only programs that actually match the query so unrelated programs are never mislabeled.
    const rankedPrograms = matchingPrograms.slice(0, 3);

    return {
      score,
      candidate: {
        ...uni,
        programs: rankedPrograms,
        scholarships: uni.scholarships.slice(0, 2),
      },
    };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name))
    .slice(0, limit)
    .map(entry => entry.candidate);
}

export function buildAllowedGuides(
  profile: FitProfileInput,
  responseLanguage: FitResponseLanguage,
): FitGuideLink[] {
  const selected = profile.preferredCountries.filter(c => c !== 'not-sure');
  const openChoice = selected.length === 0;
  const wantsChina = openChoice || selected.includes('china');
  const wantsMalaysia = openChoice || selected.includes('malaysia');
  const medical = isMedicalQuery(profile);

  const guides: FitGuideLink[] = [];
  const push = (title: string, href: string, description: string) => {
    if (!guides.some(item => item.href === href)) {
      guides.push({ title, href, description });
    }
  };

  const bn = responseLanguage === 'bn';

  if (wantsChina) {
    if (medical) {
      push(
        bn ? 'চীনে MBBS গাইড (BMDC ও WDOMS)' : 'MBBS in China — recognition & costs',
        bn ? '/bn/mbbs-in-china-bangladesh' : '/mbbs-in-china-bangladesh',
        bn
          ? 'বাংলাদেশি মেডিকেল শিক্ষার্থীদের জন্য BMDC ও WDOMS তালিকাভুক্তি, টিউশন সূচি ও যোগ্যতা যাচাই।'
          : 'BMDC/WDOMS listing, tuition schedule, and eligibility checks for Bangladeshi medical applicants.',
      );
    }
    push(
      bn ? 'চীনে পড়াশোনার খরচ ও প্যাকেজ' : 'Cost of studying in China',
      bn ? '/bn/study-in-china-cost-bangladesh' : '/study-in-china-cost-bangladesh',
      bn
        ? 'বিশ্ববিদ্যালয়, দূতাবাস, থাকা-খাওয়া এবং ভিসার পর সার্ভিস চার্জের আলাদা হিসাব।'
        : 'Separated university, embassy, living, and EduExpress visa-first fee details.',
    );
    push(
      bn ? 'CSC ও চাইনিজ স্কলারশিপ গাইড' : 'China scholarships explained',
      bn ? '/bn/csc-scholarship-bangladesh' : '/china-scholarships-bangladesh',
      bn
        ? 'CSC, প্রাদেশিক ও বিশ্ববিদ্যালয় স্কলারশিপের কভারেজ, নবায়নের শর্ত এবং বাকি খরচ।'
        : 'Coverage, renewal conditions, and what remains payable under CSC, provincial, and university awards.',
    );
    push(
      bn ? 'চায়না স্টুডেন্ট ভিসা (X1/X2)' : 'China student visa guide',
      bn ? '/bn/china-student-visa-bangladesh' : '/china-student-visa-bangladesh',
      bn
        ? 'JW201/JW202 অনুমোদন ও ঢাকা দূতাবাসের ভিসা ডকুমেন্ট প্রস্তুতি।'
        : 'JW201/JW202 and Dhaka embassy document readiness.',
    );
    push(
      bn ? 'চায়না বিশ্ববিদ্যালয় তালিকা' : 'China university directory',
      '/china-universities',
      bn ? 'চীনের যাচাইকৃত বিশ্ববিদ্যালয়, শহর ও প্রোগ্রাম খুঁজুন।' : 'Browse recorded Chinese universities, cities, and programs.',
    );
    push(
      bn ? 'চীনে ইনটেক ও সময়সীমা' : 'China intakes and deadlines',
      '/china-intakes-deadlines',
      bn ? 'মার্চ ও সেপ্টেম্বর ইনটেকের সময়সীমা তুলনা করুন।' : 'Compare March and September application timelines.',
    );
  }

  if (wantsMalaysia) {
    push(
      bn ? 'বাংলাদেশ থেকে মালয়েশিয়ায় পড়াশোনা' : 'Study in Malaysia from Bangladesh',
      '/study-in-malaysia-from-bangladesh',
      bn
        ? 'মালয়েশিয়ার পাথওয়ে, ইংরেজি শর্ত ও EMGS ভিসা ধাপ তুলনা করুন।'
        : 'Compare Malaysian pathways, English rules, and EMGS visa steps.',
    );
    push(
      bn ? 'মালয়েশিয়া পড়াশোনার খরচ' : 'Malaysia study cost breakdown',
      '/malaysia-study-cost-bangladesh',
      bn
        ? 'প্রথম বছরের টিউশন, EMGS ও থাকা-খাওয়ার আনুমানিক হিসাব।'
        : 'Year-one tuition, EMGS, and living estimates.',
    );
  }

  for (const slug of selected) {
    if (slug === 'china' || slug === 'malaysia') continue;
    const match = destinationLinks.find(item => normalizeCountrySlug(item.name) === slug || item.href === destinationPath(slug));
    if (match) {
      push(
        bn ? `${match.name} স্টাডি গাইড` : `${match.name} study guide`,
        match.href,
        bn ? `${match.name}-এর ভর্তির নিয়ম, খরচ ও ভিসা যাচাই করুন।` : `Entry rules, costs, and visa checks for ${match.name}.`,
      );
    }
  }

  push(
    bn ? 'সক্রিয় দেশগুলো তুলনা করুন' : 'Compare active destinations',
    '/destinations',
    bn ? 'EduExpress-এর সব সক্রিয় দেশের সংক্ষিপ্ত তুলনা।' : 'Side-by-side overview of all open EduExpress destinations.',
  );
  push(
    bn ? 'বিশ্ববিদ্যালয় ও প্রোগ্রাম খুঁজুন' : 'University & program finder',
    '/universities',
    bn ? 'যাচাইকৃত বিশ্ববিদ্যালয় ও টিউশন রেকর্ড ফিল্টার করুন।' : 'Filter verified university and tuition records.',
  );
  push(
    bn ? 'ফি ও স্বচ্ছতা নীতি' : 'Fees and transparency policy',
    '/fees-and-transparency',
    bn ? 'কোন ফি কাকে দেওয়া হয় এবং রিফান্ডের শর্ত কী।' : 'Who receives each payment and what is refundable.',
  );

  return guides;
}

export function formatScholarshipSummary(scholarship: FitCandidateScholarship | undefined): string | undefined {
  if (!scholarship) return undefined;
  const parts: string[] = [];
  for (const part of [scholarship.title, scholarship.amount || scholarship.coverage]) {
    const cleaned = part?.trim();
    if (cleaned && !parts.some(existing => existing.toLowerCase() === cleaned.toLowerCase())) {
      parts.push(cleaned);
    }
  }
  return parts.length > 0 ? parts.join(' · ') : undefined;
}

export function buildCatalogFallbackPreview(
  profile: FitProfileInput,
  candidates: FitCandidateUniversity[],
  guides: FitGuideLink[],
): FitPreviewResult {
  const bn = profile.responseLanguage === 'bn';
  const medical = isMedicalQuery(profile);
  const selected = profile.preferredCountries.filter(c => c !== 'not-sure');
  const matches = candidates.slice(0, 3).map((uni): FitUniversityMatch => {
    const program = uni.programs[0];
    const scholarshipNote = formatScholarshipSummary(uni.scholarships[0]);

    return {
      slug: uni.slug,
      name: uni.name,
      country: uni.country,
      city: uni.city,
      href: `/universities/${uni.slug}`,
      badge: medical
        ? (bn ? 'স্বীকৃতি যাচাই জরুরি' : 'Verify recognition first')
        : uni.hasPublishedCostPlan
          ? (bn ? 'লিখিত খরচ তালিকা আছে' : 'ClearCost plan recorded')
          : (bn ? 'তালিকাভুক্ত ম্যাচ' : 'Catalog match'),
      matchedProgram: program ? `${program.name} (${program.level})` : undefined,
      tuitionSummary: program?.tuition || uni.tuition,
      scholarshipNote,
      recognitionNote: uni.recognitionAuthority,
      verificationStatus: uni.verificationStatus,
      reason: bn
        ? `${uni.city}, ${uni.country}-এ আপনার বিষয় (${profile.subject}) ও বর্তমান স্তরের সাথে সম্পর্কিত রেকর্ড রয়েছে। চূড়ান্ত যোগ্যতা ও সাম্প্রতিক ইনটেক আসন যাচাই করতে হবে।`
        : `Recorded match in ${uni.city}, ${uni.country} for ${profile.subject} at your study level; confirm intake seat availability and entry criteria before applying.`,
    };
  });

  const routes: FitRouteRecommendation[] = guides.slice(0, 3).map((guide, index) => ({
    title: guide.title,
    badge: index === 0 ? (bn ? 'প্রথম ধাপ' : 'Start here') : (bn ? 'তুলনা করুন' : 'Compare'),
    note: guide.description,
    href: guide.href,
  }));

  const missing: string[] = [];
  if (!profile.academicResults) {
    missing.push(bn ? 'সর্বশেষ GPA / CGPA এবং বিষয়ভিত্তিক নম্বর' : 'Latest GPA, CGPA or transcript grades');
  }
  if (!profile.budget || /not sure/i.test(profile.budget)) {
    missing.push(bn ? 'টিউশন ও থাকা-খাওয়াসহ বাৎসরিক বাস্তব বাজেট' : 'A realistic yearly budget including living costs');
  }
  if (!profile.language || /not sure/i.test(profile.language)) {
    missing.push(bn ? 'IELTS / ইংরেজি দক্ষতা বা MOI প্রস্তুতি' : 'English test status or MOI eligibility');
  }
  if (!profile.intake || /not sure/i.test(profile.intake)) {
    missing.push(bn ? 'পছন্দের ইনটেক (মার্চ / সেপ্টেম্বর)' : 'Preferred intake and target timeline');
  }
  if (missing.length === 0) {
    missing.push(
      bn
        ? 'সত্যায়িত মার্কশিট, পাসপোর্ট ও পুলিশ ক্লিয়ারেন্সের কপি'
        : 'Scanned transcripts, passport bio page, and supporting documents',
    );
  }

  const checks: string[] = bn
    ? [
        'বিশ্ববিদ্যালয়ের স্বীকৃতি ও আপনার সাবজেক্টের যোগ্যতা যাচাই',
        'টিউশন, হোস্টেল, ভিসা ও থার্ড-পার্টি খরচ আলাদা করে লিখিত হিসাব',
        'স্কলারশিপের শর্ত ও নবায়নের (renewal) নিয়ম',
        medical ? 'বাংলাদেশে BMDC ও WDOMS তালিকাভুক্তি যাচাই' : 'ভিসা ডকুমেন্ট ও সলভেন্সি প্রস্তুতি',
      ]
    : [
        'University recognition and exact program entry eligibility',
        'Tuition, hostel, insurance and third-party fees itemised separately',
        'Scholarship conditions, renewal GPA rules and remaining payable costs',
        medical ? 'WDOMS and BMDC medical licensing recognition pathway' : 'Visa document readiness and financial proof rules',
      ];

  const destSummary = selected.length ? selected.join(', ') : (bn ? 'চীন ও সক্রিয় দেশসমূহ' : 'China and active destinations');

  return {
    mode: 'catalog',
    language: profile.responseLanguage,
    summaryHeadline: bn
      ? `${profile.subject} নিয়ে পড়াশোনার প্রাথমিক পথ`
      : `Starting study routes for ${profile.subject}`,
    summaryNote: bn
      ? `আপনার ${profile.academicLevel} প্রোফাইল ও পছন্দের দেশ (${destSummary}) অনুযায়ী যাচাইকৃত বিশ্ববিদ্যালয় রেকর্ড থেকে প্রাথমিক তালিকা তৈরি করা হয়েছে। কোনো ভর্তি বা ভিসার নিশ্চয়তা ছাড়াই লিখিত খরচ ও যোগ্যতা দেখে পরবর্তী সিদ্ধান্ত নেওয়া উচিত।`
      : `Based on your ${profile.academicLevel} profile and destination interest (${destSummary}), these recorded universities and guides are practical starting points to verify costs and entry criteria before applying.`,
    universityMatches: matches,
    routes,
    checks,
    missing,
    clarifyingQuestion: bn
      ? 'আপনি কি মূলত ইংরেজি মাধ্যমে পড়তে চান এবং আপনার পাসপোর্ট কি প্রস্তুত আছে?'
      : 'Are you targeting an English-taught intake only, and is your passport ready?',
  };
}

export function asStringList(value: unknown, maxItems: number, maxLen = 220): string[] {
  if (!Array.isArray(value)) return [];
  const items: string[] = [];
  for (const entry of value) {
    const text = cleanText(entry, maxLen);
    if (text && !items.includes(text)) items.push(text);
    if (items.length >= maxItems) break;
  }
  return items;
}

export function hydrateUniversityMatches(
  rawMatches: unknown,
  candidates: FitCandidateUniversity[],
  fallbackMatches: FitUniversityMatch[],
  maxItems = 4,
): FitUniversityMatch[] {
  if (!Array.isArray(rawMatches)) return [];
  const candidateBySlug = new Map(candidates.map(item => [item.slug, item]));
  const hydratedMatches: FitUniversityMatch[] = [];
  const seenSlugs = new Set<string>();

  for (const item of rawMatches) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const entry = item as Record<string, unknown>;
    const slug = cleanText(entry.slug, 120);
    const dbRecord = candidateBySlug.get(slug);
    if (!dbRecord || seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const requestedProgram = cleanText(entry.matchedProgram, 160);
    const matchingProgram = dbRecord.programs.find(p =>
      requestedProgram && p.name.toLowerCase() === requestedProgram.toLowerCase(),
    ) || dbRecord.programs[0];

    const scholarshipText = cleanText(entry.scholarshipNote, 200)
      || formatScholarshipSummary(dbRecord.scholarships[0]);

    hydratedMatches.push({
      slug: dbRecord.slug,
      name: dbRecord.name,
      country: dbRecord.country,
      city: dbRecord.city,
      href: `/universities/${dbRecord.slug}`,
      badge: cleanText(entry.badge, 60) || fallbackMatches[0]?.badge || 'Catalog match',
      matchedProgram: matchingProgram ? `${matchingProgram.name} (${matchingProgram.level})` : undefined,
      tuitionSummary: matchingProgram?.tuition || dbRecord.tuition,
      scholarshipNote: scholarshipText || undefined,
      recognitionNote: dbRecord.recognitionAuthority,
      verificationStatus: dbRecord.verificationStatus,
      reason: cleanText(entry.reason, 260) || fallbackMatches.find(m => m.slug === slug)?.reason || '',
    });

    if (hydratedMatches.length >= maxItems) break;
  }

  return hydratedMatches;
}

export function hydrateGuideRoutes(
  rawRoutes: unknown,
  candidates: FitCandidateUniversity[],
  guides: FitGuideLink[],
  maxItems = 3,
): FitRouteRecommendation[] {
  if (!Array.isArray(rawRoutes)) return [];
  const allowedHrefs = new Set<string>([
    ...guides.map(item => item.href),
    ...candidates.map(item => `/universities/${item.slug}`),
  ]);
  const hydratedRoutes: FitRouteRecommendation[] = [];
  const seenHrefs = new Set<string>();

  for (const item of rawRoutes) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const entry = item as Record<string, unknown>;
    const href = cleanText(entry.href, 200);
    if (!href || !allowedHrefs.has(href) || seenHrefs.has(href)) continue;
    const title = cleanText(entry.title, 120);
    const note = cleanText(entry.note, 260);
    if (!title || !note) continue;
    seenHrefs.add(href);
    hydratedRoutes.push({
      title,
      badge: cleanText(entry.badge, 50) || 'Recommended check',
      note,
      href,
    });
    if (hydratedRoutes.length >= maxItems) break;
  }

  return hydratedRoutes;
}

export function sanitizeAndHydrateGeminiPreview(
  rawModelJson: unknown,
  profile: FitProfileInput,
  candidates: FitCandidateUniversity[],
  guides: FitGuideLink[],
  modelName = 'gemini-4-hydrogen',
): FitPreviewResult {
  const fallback = buildCatalogFallbackPreview(profile, candidates, guides);
  if (!rawModelJson || typeof rawModelJson !== 'object' || Array.isArray(rawModelJson)) {
    return fallback;
  }

  const parsed = rawModelJson as Record<string, unknown>;
  const hydratedMatches = hydrateUniversityMatches(parsed.universityMatches, candidates, fallback.universityMatches, 4);
  const hydratedRoutes = hydrateGuideRoutes(parsed.routes, candidates, guides, 3);

  const checks = asStringList(parsed.checks, 5);
  if (isMedicalQuery(profile) && !checks.some(item => /bmdc|wdoms|licens|স্বীকৃতি/i.test(item))) {
    checks.unshift(
      profile.responseLanguage === 'bn'
        ? 'বাংলাদেশে অনুশীলনের জন্য BMDC ও WDOMS তালিকাভুক্তি যাচাই'
        : 'Confirm WDOMS listing and Bangladesh (BMDC) medical licensing recognition',
    );
  }

  const missing = asStringList(parsed.missing, 5);

  return {
    mode: 'gemini',
    model: modelName,
    language: profile.responseLanguage,
    summaryHeadline: cleanText(parsed.summaryHeadline, 140) || fallback.summaryHeadline,
    summaryNote: cleanText(parsed.summaryNote, 420) || fallback.summaryNote,
    universityMatches: hydratedMatches.length > 0 ? hydratedMatches : fallback.universityMatches,
    routes: hydratedRoutes.length > 0 ? hydratedRoutes : fallback.routes,
    checks: (checks.length > 0 ? checks : fallback.checks).slice(0, 5),
    missing: missing.length > 0 ? missing : fallback.missing,
    clarifyingQuestion: cleanText(parsed.clarifyingQuestion, 220) || fallback.clarifyingQuestion,
  };
}
