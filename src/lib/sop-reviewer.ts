import { cleanText, type FitResponseLanguage } from './fit-matcher';

export type SopDocumentType = 'study_plan' | 'sop' | 'research_proposal';
export type SopTargetDegree = 'Bachelor' | 'Master' | 'PhD' | 'MBBS';
export type SopTargetCountry = 'China' | 'Malaysia' | 'General';

export interface SopReviewRequest {
  text: string;
  documentType: SopDocumentType;
  targetCountry: SopTargetCountry;
  targetDegree: SopTargetDegree;
  targetSubject?: string;
  language: FitResponseLanguage;
}

export interface SopSuggestion {
  category: 'structure' | 'academic_depth' | 'relevance' | 'compliance';
  title: string;
  text: string;
  exampleBeforeAfter?: {
    before: string;
    after: string;
  };
}

export interface SopCountrySpecificFeedback {
  cscAlignment?: string;
  visaComplianceRisk?: string;
  medicalLicensingNote?: string;
}

export interface SopReviewResult {
  overallScore: number;
  status: 'excellent' | 'good' | 'needs_work' | 'insufficient';
  wordCount: number;
  estimatedReadTimeMinutes: number;
  recommendedWordRange: { min: number; max: number };
  strengths: string[];
  weaknesses: string[];
  actionableSuggestions: SopSuggestion[];
  countrySpecificFeedback: SopCountrySpecificFeedback;
  language: FitResponseLanguage;
  mode: 'gemini' | 'catalog';
  disclaimer: string;
}

export const RECOMMENDED_WORD_RANGES: Record<SopTargetDegree, { min: number; max: number }> = {
  Bachelor: { min: 500, max: 1000 },
  Master: { min: 800, max: 1500 },
  PhD: { min: 1000, max: 2500 },
  MBBS: { min: 600, max: 1200 },
};

/**
 * Normalizes and validates incoming raw request payload for SOP/Study Plan review.
 */
export function normalizeSopReviewRequest(input: unknown): SopReviewRequest {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid request payload: must be an object.');
  }

  const obj = input as Record<string, unknown>;

  const rawText = typeof obj.text === 'string' ? obj.text.trim() : '';
  if (!rawText) {
    throw new Error('Study plan or SOP text is required.');
  }
  if (rawText.length < 30) {
    throw new Error('Draft is too short for meaningful critique (minimum 30 characters).');
  }
  if (rawText.length > 20000) {
    throw new Error('Draft exceeds the maximum length limit of 20,000 characters.');
  }

  let docType: SopDocumentType = 'study_plan';
  const rawDocType = String(obj.documentType || '').toLowerCase();
  if (rawDocType.includes('sop') || rawDocType.includes('statement')) {
    docType = 'sop';
  } else if (rawDocType.includes('research') || rawDocType.includes('proposal')) {
    docType = 'research_proposal';
  }

  let targetCountry: SopTargetCountry = 'China';
  const rawCountry = String(obj.targetCountry || '').toLowerCase();
  if (rawCountry.includes('malaysia')) {
    targetCountry = 'Malaysia';
  } else if (rawCountry.includes('general') || rawCountry.includes('other')) {
    targetCountry = 'General';
  }

  let targetDegree: SopTargetDegree = 'Master';
  const rawDegree = String(obj.targetDegree || '').toLowerCase();
  if (rawDegree.includes('phd') || rawDegree.includes('doctor')) {
    targetDegree = 'PhD';
  } else if (rawDegree.includes('mbbs') || rawDegree.includes('medicine') || rawDegree.includes('clinical')) {
    targetDegree = 'MBBS';
  } else if (rawDegree.includes('bachelor') || rawDegree.includes('undergrad')) {
    targetDegree = 'Bachelor';
  }

  const targetSubject = cleanText(obj.targetSubject, 100) || undefined;
  const language: FitResponseLanguage = obj.language === 'bn' ? 'bn' : 'en';

  return {
    text: rawText,
    documentType: docType,
    targetCountry,
    targetDegree,
    targetSubject,
    language,
  };
}

/**
 * Counts words in a string accurately across ASCII and unicode boundaries.
 */
export function countWords(text: string): number {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  return tokens.length;
}

/**
 * Builds a deterministic, rule-based review when the Gemini API is offline or rate-limited.
 */
export function buildCatalogSopFallback(req: SopReviewRequest): SopReviewResult {
  const words = countWords(req.text);
  const readTime = Math.max(1, Math.ceil(words / 200));
  const recommendedRange = RECOMMENDED_WORD_RANGES[req.targetDegree] || { min: 800, max: 1500 };

  const isBn = req.language === 'bn';
  const lower = req.text.toLowerCase();

  let score = 70;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: SopSuggestion[] = [];

  // 1. Word Count Assessment
  if (words < recommendedRange.min * 0.5) {
    score -= 25;
    weaknesses.push(
      isBn
        ? `শব্দ সংখ্যা অপ্রতুল (${words} শব্দ)। ${req.targetDegree} পর্যায়ের জন্য ন্যূনতম ${recommendedRange.min} শব্দ প্রয়োজন।`
        : `Word count is critically low (${words} words). ${req.targetDegree} applications require at least ${recommendedRange.min} words.`,
    );
    suggestions.push({
      category: 'structure',
      title: isBn ? 'একাডেমিক পরিকল্পনার ব্যাপ্তি বাড়ান' : 'Expand Academic Scope',
      text: isBn
        ? `CSC এবং বিশ্ববিদ্যালয় স্কলারশিপের জন্য আপনার গবেষণার রূপরেখা, পদ্ধতি এবং লক্ষ্যগুলো আরও বিশদ করুন।`
        : `For Chinese CSC and university scholarship reviews, provide granular milestones for coursework, research methodology, and expected publications.`,
    });
  } else if (words < recommendedRange.min) {
    score -= 10;
    weaknesses.push(
      isBn
        ? `শব্দ সংখ্যা নির্দেশিত সীমার চেয়ে কিছুটা কম (${words}/${recommendedRange.min} শব্দ)।`
        : `Slightly below recommended length (${words} of ${recommendedRange.min} words recommended).`,
    );
  } else if (words >= recommendedRange.min && words <= recommendedRange.max) {
    score += 15;
    strengths.push(
      isBn
        ? `উপযুক্ত শব্দ সংখ্যা (${words} শব্দ), যা আন্তর্জাতিক অ্যাডমিশন কমিটির প্রত্যাশা পূরণ করে।`
        : `Optimal document length (${words} words) well-aligned with ${req.targetDegree} expectations.`,
    );
  } else {
    // Exceeds max
    score -= 5;
    suggestions.push({
      category: 'structure',
      title: isBn ? 'সংক্ষিপ্ত ও সুনির্দিষ্ট করুন' : 'Condense Narrative',
      text: isBn
        ? `লেখাটি নির্দেশিত সীমা অতিক্রম করেছে (${words} শব্দ)। অপ্রয়োজনীয় ভূমিকা বা ব্যক্তিগত গল্প সংক্ষেপ করুন।`
        : `The document exceeds ${recommendedRange.max} words. Condense generic introductory anecdotes and emphasize concrete research goals.`,
    });
  }

  // 2. Academic & Methodology Analysis
  const academicKeywords = ['research', 'methodology', 'thesis', 'laboratory', 'curriculum', 'objectives', 'professor', 'faculty', 'algorithm', 'investigate', 'analysis', 'gpa', 'bachelor', 'undergraduate', 'published'];
  const matchedKeywords = academicKeywords.filter(k => lower.includes(k));

  if (matchedKeywords.length >= 4) {
    score += 10;
    strengths.push(
      isBn
        ? 'গবেষণা ও শিক্ষাগত উদ্দেশ্যের স্পষ্ট উল্লেখ রয়েছে।'
        : 'Demonstrates clear academic vocabulary and focus on technical or scholastic milestones.',
    );
  } else {
    score -= 8;
    weaknesses.push(
      isBn
        ? 'নির্দিষ্ট গবেষণা পদ্ধতি বা সিলেবাস সম্পর্কিত গভীরতার অভাব রয়েছে।'
        : 'Lacks technical depth or explicit research methodologies and laboratory goals.',
    );
    suggestions.push({
      category: 'academic_depth',
      title: isBn ? 'গবেষণা পদ্ধতি ও মাইলফলক উল্লেখ করুন' : 'Articulate Specific Research Methodology',
      text: isBn
        ? 'আপনার থিসিস বা প্রকল্পের মূল বিষয়বস্তু এবং সম্ভাব্য সুপারভাইজারের ল্যাবের সাথে এর সঙ্গতি তুলে ধরুন।'
        : 'Specify target lab research themes, methodologies (e.g. empirical, computational, or clinical), and why the host faculty aligns with your thesis.',
      exampleBeforeAfter: {
        before: 'I want to study in China because it has high technology and good professors.',
        after: 'My undergraduate capstone focused on distributed data pipelines; at your institution, I aim to extend this by investigating edge-node caching algorithms under Dr. Chen’s network systems laboratory.',
      },
    });
  }

  // 3. Bangladesh Ties & Post-Study Career Goals (Non-immigrant Intent)
  const returnKeywords = ['return to bangladesh', 'dhaka', 'bangladesh', 'career in bangladesh', 'contribute to my country', 'home country', 'national economy'];
  const hasReturnIntent = returnKeywords.some(k => lower.includes(k));

  if (hasReturnIntent) {
    score += 8;
    strengths.push(
      isBn
        ? 'শিক্ষা সমাপনান্তে বাংলাদেশে প্রত্যাবর্তনের সুনির্দিষ্ট ভবিষ্যৎ পরিকল্পনা উল্লেখিত হয়েছে।'
        : 'Articulates clear post-graduation career trajectory with strong ties to Bangladesh.',
    );
  } else {
    score -= 7;
    suggestions.push({
      category: 'compliance',
      title: isBn ? 'ভবিষ্যৎ কর্মপরিকল্পনা ও দেশে ফেরার উদ্দেশ্য স্পষ্ট করুন' : 'Clarify Post-Graduation Return Intent',
      text: isBn
        ? 'ভিসা ও স্কলারশিপ কমিটি দেখতে চায় আপনি ডিগ্রি অর্জনের পর বাংলাদেশে বা আন্তর্জাতিকভাবে কীভাবে অবদান রাখবেন।'
        : 'CSC and consular evaluators require non-immigrant intent: detail how your Chinese/Malaysian qualification will advance your career in Bangladesh industries or academia.',
    });
  }

  // 4. Red Flag Detection: Unauthorized Work or Settlement
  const workFlags = ['part-time job', 'work and pay', 'cover my living by working', 'part time work', 'earn money'];
  const hasWorkFlags = workFlags.some(k => lower.includes(k));

  const settlementFlags = ['permanent residence', 'settle down in china', 'immigrate', 'pr in china', 'permanent residency'];
  const hasSettlementFlags = settlementFlags.some(k => lower.includes(k));

  const countrySpecific: SopCountrySpecificFeedback = {};

  if (req.targetCountry === 'China') {
    countrySpecific.cscAlignment = isBn
      ? 'CSC টাইপ-এ এবং টাইপ-বি স্কলারশিপ পর্যালোচনায় প্রথম ২ অনুচ্ছেদে সুনির্দিষ্ট গবেষণা প্রস্তাবনা থাকা আবশ্যক।'
      : 'CSC Type A & B committees prioritize study plans detailing semester-by-semester milestones (Year 1: coursework/HSK; Year 2-3: laboratory research and thesis defense).';
  }

  if (hasWorkFlags) {
    score -= 15;
    weaknesses.push(
      isBn
        ? 'অਣঅনুমোদিত খণ্ডকালীন কাজের (part-time work) উল্লেখ রয়েছে, যা চীন সরকারের স্টুডেন্ট ভিসা নিয়মের পরিপন্থী।'
        : 'Mentions off-campus employment. Chinese X1/X2 visa regulations strictly prohibit unauthorized off-campus work.',
    );
    countrySpecific.visaComplianceRisk = isBn
      ? 'চীনে শিক্ষার্থীদের কাজের অনুমতি ছাড়া চাকরি সম্পূর্ণ নিষিদ্ধ। আবেদনপত্রে কাজের উদ্দেশ্য লিখলে স্কলারশিপ বাতিল হতে পারে।'
      : 'Strict visa compliance: Do not mention self-funding through part-time work. Chinese student visas strictly prohibit off-campus employment unless formally approved under university internship schemes.';
  }

  if (hasSettlementFlags) {
    score -= 15;
    weaknesses.push(
      isBn
        ? 'স্থায়ী অভিবাসনের (immigration) ইঙ্গিত রয়েছে, যা নন-ইমিগ্র্যান্ট স্টুডেন্ট ভিসার ক্ষেত্রে ঝুঁকিপূর্ণ।'
        : 'Contains expressions suggesting immigration or permanent settlement, compromising student non-immigrant intent.',
    );
    countrySpecific.visaComplianceRisk = (countrySpecific.visaComplianceRisk ? countrySpecific.visaComplianceRisk + ' ' : '') +
      (isBn
        ? 'স্টাডি প্ল্যানে বিদেশে স্থায়ী বসবাসের পরিবর্তে ডিগ্রি শেষে দেশে ফিরে কাজ করার পরিকল্পনা প্রদর্শন করুন।'
        : 'Consular risk: Frame all future aspirations around returning to Bangladesh or international scholastic career progression.');
  }

  // 5. MBBS / Medical Licensing Caveats
  if (req.targetDegree === 'MBBS' || (req.targetSubject && /mbbs|medicine|medical|doctor|clinical/i.test(req.targetSubject))) {
    countrySpecific.medicalLicensingNote = isBn
      ? 'মেডিকেল কাউন্সিল (BMDC) সতর্কতা: চীনে এমবিবিএস করার ক্ষেত্রে সংশ্লিষ্ট বিশ্ববিদ্যালয়টি WDOMS তালিকাভুক্ত হতে হবে এবং এইচএসসিতে জীববিজ্ঞানে ন্যূনতম জিপিএ ৩.৫০ থাকা বাধ্যতামূলক।'
      : 'BMDC Licensing Requirement: Ensure your chosen Chinese medical university is listed in WDOMS and eligible for the Bangladesh Medical and Dental Council (BMDC) qualifying exam. Minimum HSC Biology GPA >= 3.50 required.';
  }

  // Constrain overall score between 20 and 96
  const finalScore = Math.max(20, Math.min(96, score));
  let status: 'excellent' | 'good' | 'needs_work' | 'insufficient' = 'needs_work';
  if (finalScore >= 85) status = 'excellent';
  else if (finalScore >= 70) status = 'good';
  else if (finalScore < 45) status = 'insufficient';

  if (strengths.length === 0) {
    strengths.push(
      isBn
        ? 'প্রাথমিক খসড়ায় অধ্যয়নের মৌলিক আগ্রহ প্রকাশ পেয়েছে।'
        : 'Provides a foundational statement of academic intent.',
    );
  }

  return {
    overallScore: finalScore,
    status,
    wordCount: words,
    estimatedReadTimeMinutes: readTime,
    recommendedWordRange: recommendedRange,
    strengths,
    weaknesses,
    actionableSuggestions: suggestions,
    countrySpecificFeedback: countrySpecific,
    language: req.language,
    mode: 'catalog',
    disclaimer: isBn
      ? 'এডুএক্সপ্রেস এআই রিভিউ একটি পরামর্শমূলক মূল্যায়ন। এটি বিশ্ববিদ্যালয় বা সিএসসি স্কলারশিপ প্রাপ্তির নিশ্চয়তা দেয় না।'
      : 'EduExpress AI evaluation is an advisory critique based on university and CSC rubrics. It does not guarantee admission or scholarship award.',
  };
}
