import type { FitResponseLanguage } from '@/lib/fit-matcher';
import type { FeeRow } from '@/lib/catalog-views';

export interface FeasibilityProgramInput {
  key: string;
  name: string;
  universityName: string;
  universitySlug: string;
  city: string;
  level: string;
  tuitionCny: number;
  tuitionText: string;
  tuitionAfterScholarshipCny?: number;
  recordedFees: FeeRow[];
}

export interface FeasibilityRequest {
  programs: FeasibilityProgramInput[];
  familyBudgetBdtPerYear?: number;
  bdtCnyExchangeRate: number;
  language: FitResponseLanguage;
}

export interface ProgramCostAnalysis {
  universityName: string;
  universitySlug: string;
  programName: string;
  city: string;
  cityTier: 'Tier 1 (Higher Living Cost)' | 'Tier 2 / Emerging (Moderate Living Cost)';
  firstYearTotalCny: number;
  firstYearTotalBdt: number;
  recurringYearsAnnualCny: number;
  recurringYearsAnnualBdt: number;
  scholarshipImpact: string;
}

export interface FeasibilityReport {
  mode: 'gemini' | 'catalog';
  verdict: 'comfortably_affordable' | 'realistic_with_buffer' | 'budget_stretch' | 'high_financial_risk';
  verdictHeadline: string;
  verdictDetail: string;
  programAnalyses: ProgramCostAnalysis[];
  currencySensitivityNote: string;
  feeTransparencyAudit: {
    universityPayable: string;
    thirdPartyPayable: string;
    eduExpressPolicy: string;
  };
  counselorBudgetTips: string[];
  language: FitResponseLanguage;
}

export const TIER_1_CITIES = new Set([
  'shanghai',
  'beijing',
  'guangzhou',
  'shenzhen',
]);

export function estimateCityTier(city: string): 'Tier 1 (Higher Living Cost)' | 'Tier 2 / Emerging (Moderate Living Cost)' {
  const norm = city.trim().toLowerCase();
  return TIER_1_CITIES.has(norm)
    ? 'Tier 1 (Higher Living Cost)'
    : 'Tier 2 / Emerging (Moderate Living Cost)';
}

export const COST_FEASIBILITY_SCHEMA = {
  type: 'object',
  properties: {
    verdict: {
      type: 'string',
      enum: ['comfortably_affordable', 'realistic_with_buffer', 'budget_stretch', 'high_financial_risk'],
    },
    verdictHeadline: { type: 'string', description: 'Concise verdict headline in requested language.' },
    verdictDetail: { type: 'string', description: '2 to 3 sentence evaluation comparing family budget against real university fees.' },
    currencySensitivityNote: { type: 'string', description: 'Exchange rate risk advice for BDT to CNY fluctuation.' },
    counselorBudgetTips: {
      type: 'array',
      items: { type: 'string' },
      description: 'Actionable financial planning tips for Bangladeshi families.' },
  },
  required: ['verdict', 'verdictHeadline', 'verdictDetail', 'currencySensitivityNote', 'counselorBudgetTips'],
} as const;

export function evaluateCostFeasibilityLocally(input: FeasibilityRequest): FeasibilityReport {
  const rate = input.bdtCnyExchangeRate > 0 ? input.bdtCnyExchangeRate : 17.2;
  const budgetBdt = input.familyBudgetBdtPerYear && input.familyBudgetBdtPerYear > 0
    ? input.familyBudgetBdtPerYear
    : 700000;
  const bn = input.language === 'bn';

  const analyses: ProgramCostAnalysis[] = input.programs.map(p => {
    let firstYearOtherFeesCny = 0;
    for (const f of p.recordedFees) {
      const match = f.cost.match(/(\d+[\d,]*)/);
      if (match) {
        const val = Number(match[1].replace(/,/g, ''));
        if (Number.isFinite(val) && val > 0 && !f.cost.includes('/')) {
          firstYearOtherFeesCny += val;
        }
      }
    }

    if (firstYearOtherFeesCny === 0) {
      firstYearOtherFeesCny = 5000; // Standard estimate for hostel + insurance + medical check
    }

    const firstYearTotalCny = p.tuitionCny + firstYearOtherFeesCny;
    const firstYearTotalBdt = Math.round(firstYearTotalCny * rate);

    const recurringYearsAnnualCny = p.tuitionCny + Math.round(firstYearOtherFeesCny * 0.7); // Hostel + insurance
    const recurringYearsAnnualBdt = Math.round(recurringYearsAnnualCny * rate);

    const cityTier = estimateCityTier(p.city);

    const scholarshipImpact = p.tuitionAfterScholarshipCny && p.tuitionAfterScholarshipCny < p.tuitionCny
      ? bn
        ? `স্কলারশিপের পর টিউশন CNY ${p.tuitionAfterScholarshipCny.toLocaleString()} (বাৎসরিক সাশ্রয় প্রায় BDT ${Math.round((p.tuitionCny - p.tuitionAfterScholarshipCny) * rate).toLocaleString()})। স্কলারশিপ প্রতি বছর জিপিএ নবায়নের শর্তাধীন।`
        : `Tuition after scholarship: CNY ${p.tuitionAfterScholarshipCny.toLocaleString()} (saves ~BDT ${Math.round((p.tuitionCny - p.tuitionAfterScholarshipCny) * rate).toLocaleString()}/year). Subject to annual GPA renewal.`
      : bn
      ? 'স্ব-অর্থায়নে পূর্ণ টিউশন প্রযোজ্য। ভর্তি পরবর্তী সেমিস্টারে বিশ্ববিদ্যালয় একাডেমিক মেধা স্কলারশিপের সুযোগ থাকতে পারে।'
      : 'Standard self-funded tuition. Post-admission merit scholarships may be available based on semester GPA.';

    return {
      universityName: p.universityName,
      universitySlug: p.universitySlug,
      programName: p.name,
      city: p.city,
      cityTier,
      firstYearTotalCny,
      firstYearTotalBdt,
      recurringYearsAnnualCny,
      recurringYearsAnnualBdt,
      scholarshipImpact,
    };
  });

  const maxFirstYearBdt = Math.max(...analyses.map(a => a.firstYearTotalBdt), 0);
  const ratio = maxFirstYearBdt / budgetBdt;

  let verdict: 'comfortably_affordable' | 'realistic_with_buffer' | 'budget_stretch' | 'high_financial_risk';
  let verdictHeadline: string;
  let verdictDetail: string;

  if (ratio <= 0.85) {
    verdict = 'comfortably_affordable';
    verdictHeadline = bn
      ? 'পারিবারিক বাজেটের সাথে সম্পূর্ণ সামঞ্জস্যপূর্ণ'
      : 'Comfortably within planned family budget';
    verdictDetail = bn
      ? `প্রথম বছরের আনুমানিক খরচ (সর্বোচ্চ BDT ${maxFirstYearBdt.toLocaleString()}) আপনার বার্ষিক বাজেট (BDT ${budgetBdt.toLocaleString()})-এর তুলনায় স্বাচ্ছন্দ্যজনক। জরুরি খরচের জন্য পর্যাপ্ত তহবিল উদ্বৃত্ত থাকবে।`
      : `Year-one estimated costs (up to BDT ${maxFirstYearBdt.toLocaleString()}) fit well inside your annual budget of BDT ${budgetBdt.toLocaleString()}, leaving comfortable headroom for personal living expenses.`;
  } else if (ratio <= 1.15) {
    verdict = 'realistic_with_buffer';
    verdictHeadline = bn
      ? 'বাজেটের মধ্যে বাস্তবসম্মত (১০-১৫% মুদ্রা বাফার বাঞ্ছনীয়)'
      : 'Realistic with 10–15% currency fluctuation buffer';
    verdictDetail = bn
      ? `প্রথম বছরের মোট ব্যয় আপনার বাজেটের প্রায় কাছাকাছি। টাকা ও চীনা ইউয়ানের বিনিময় হারের পরিবর্তনের কথা বিবেচনা করে পরিবারকে অতিরিক্ত ১০-১৫% আপৎকালীন তহবিল প্রস্তুত রাখার পরামর্শ দেওয়া হচ্ছে।`
      : `Year-one university expenses align closely with your budget. Families should keep a 10–15% emergency cash reserve to protect against CNY/BDT exchange rate fluctuations.`;
  } else if (ratio <= 1.45) {
    verdict = 'budget_stretch';
    verdictHeadline = bn
      ? 'বাজেটের তুলনায় ব্যয় কিছুটা বেশি (স্কলারশিপ বা টিয়ার-২ শহর বিবেচনা করুন)'
      : 'Budget stretch — consider scholarship routes or Tier-2 cities';
    verdictDetail = bn
      ? `প্রথম বছরের প্রাক্কলিত খরচ বাজেটের চেয়ে প্রায় ২৫-৪০% বেশি। প্রথম বছরের হোস্টেল ও ভর্তি ফি এককালীন পরিশোধ করতে হয়। কম খরচের টিয়ার-২ বিশ্ববিদ্যালয় অথবা স্কলারশিপ রুট পর্যালোচনা করা উচিত।`
      : `Year-one upfront costs exceed your planned budget by 25–40%. Consider applying for partial scholarship programs or Tier-2 regional universities with lower living costs.`;
  } else {
    verdict = 'high_financial_risk';
    verdictHeadline = bn
      ? 'উচ্চ আর্থিক ঝুঁকি — বিকল্প বাজেট প্রোগ্রাম নির্বাচন আবশ্যক'
      : 'High financial risk — alternative affordable institutions advised';
    verdictDetail = bn
      ? `নির্বাচিত বিশ্ববিদ্যালয়ের খরচ আপনার বর্তমান বাজেটের চেয়ে অনেক বেশি। স্টুডেন্ট ভিসায় অননুমোদিত কাজের ওপর নির্ভর করে বিদেশে যাওয়া সম্পূর্ণ ঝুঁকিপূর্ণ। সাশ্রয়ী টিউশনের অন্যান্য প্রতিষ্ঠান বিবেচনা করুন।`
      : `Selected programs substantially exceed the indicated family budget. Relying on unauthorized part-time work is strictly prohibited on student visas. We advise selecting affordable alternative institutions.`;
  }

  const currencySensitivityNote = bn
    ? `১ চাইনিজ ইউয়ান = BDT ${rate.toFixed(1)} হারে হিসাব করা হয়েছে। ইউয়ানের দর ১ টাকা বাড়লে বছরে প্রায় BDT ${(maxFirstYearBdt / rate).toFixed(0)} অতিরিক্ত খরচ হতে পারে।`
    : `Calculated at 1 CNY = BDT ${rate.toFixed(1)}. A 1-taka shift in the exchange rate alters your annual requirement by ~BDT ${(maxFirstYearBdt / rate).toFixed(0)}.`;

  const counselorBudgetTips = bn
    ? [
        'প্রথম বর্ষের টিউশন ও হোস্টেল ফি বিশ্ববিদ্যালয়ে পৌঁছানোর পর সরাসরি ক্যাম্পাস একাউন্টে পরিশোধযোগ্য।',
        'ভিসা আবেদনের জন্য ঢাকা দূতাবাসের ফি, ট্রাভেল হেলথ চেকআপ এবং বিমান টিকিট বিশ্ববিদ্যালয়ের হিসাব থেকে সম্পূর্ণ আলাদা।',
        'EduExpress চায়না স্টুডেন্ট ভিসা অনুমোদনের পূর্বে কোনো কনসালটেন্সি সার্ভিস ফি গ্রহণ করে না।',
      ]
    : [
        'First-year tuition and hostel fees are paid directly to the university cashier/portal upon campus arrival.',
        'Third-party expenses (Dhaka Embassy visa fee, Dhaka medical examination, airfare) are paid separately to respective authorities.',
        'EduExpress charges zero consultancy service fee before China visa approval under our visa-first commitment.',
      ];

  return {
    mode: 'catalog',
    verdict,
    verdictHeadline,
    verdictDetail,
    programAnalyses: analyses,
    currencySensitivityNote,
    feeTransparencyAudit: {
      universityPayable: 'Tuition, On-campus Hostel, Campus Insurance, Registration & Residence Permit',
      thirdPartyPayable: 'Dhaka Chinese Embassy Visa Fee (~BDT 4,500), Physical Exam (~BDT 6,500), Police Clearance (~BDT 500), Flight ticket',
      eduExpressPolicy: 'BDT 0 consultancy service fee before China visa approval. No payment without itemised receipts.',
    },
    counselorBudgetTips,
    language: input.language,
  };
}
