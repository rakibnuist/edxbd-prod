import { activeCountries } from '@/lib/countries';
import {
  cleanText,
  formatScholarshipSummary,
  isMedicalQuery,
  normalizeCountrySlug,
  scoreCandidateUniversities,
  type FitCandidateUniversity,
  type FitProfileInput,
  type FitResponseLanguage,
} from '@/lib/fit-matcher';
import { destinationPath } from '@/lib/site-urls';
import type { CleanUniversityRecord } from '@/lib/university-records';

export interface AdvisorMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AdvisorCitation {
  title: string;
  href: string;
  category: 'university' | 'cost_plan' | 'destination' | 'guide';
  note?: string;
}

export type AdvisorStreamEvent =
  | { type: 'status'; label: string }
  | { type: 'chunk'; text: string }
  | { type: 'citations'; citations: AdvisorCitation[] }
  | { type: 'done'; mode: 'gemini' | 'catalog'; model?: string }
  | { type: 'error'; error: string };

export interface NormalizedAdvisorRequest {
  question: string;
  history: AdvisorMessage[];
  language: FitResponseLanguage;
}

export interface AdvisorFunctionDeclaration {
  type: 'function';
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const ADVISOR_TOOL_DECLARATIONS: AdvisorFunctionDeclaration[] = [
  {
    type: 'function',
    name: 'search_universities_and_programs',
    description:
      'Search recorded active universities, non-paused programs, tuition ranges, scholarship awards, and recognition status (e.g. WDOMS & BMDC) in the EduExpress Prisma database.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Subject, degree, or university keyword (e.g. "Computer Science", "MBBS", "Sichuan University", "Civil Engineering").',
        },
        country: {
          type: 'string',
          description: 'Optional country filter such as "China", "Malaysia", or "not-sure".',
        },
        degreeLevel: {
          type: 'string',
          description: 'Optional student current/target level: "HSC / A Level", "Bachelor", "Master", "PhD", "MBBS", "Diploma".',
        },
        limit: {
          type: 'integer',
          description: 'Maximum institutions to return (1 to 5).',
        },
      },
      required: ['query'],
    },
  },
  {
    type: 'function',
    name: 'get_cost_breakdown',
    description:
      'Retrieve published ClearCost cost plans (tuition before/after scholarship, hostel, insurance, medical, visa, service fees) for a university, and/or indicative destination costs and EduExpress fee separation rules.',
    parameters: {
      type: 'object',
      properties: {
        universitySlugOrName: {
          type: 'string',
          description: 'Optional university slug or name (e.g. "anhui-medical-university", "Sichuan University").',
        },
        destination: {
          type: 'string',
          description: 'Optional country name or slug (e.g. "china", "malaysia", "hungary", "uk").',
        },
      },
    },
  },
  {
    type: 'function',
    name: 'lookup_verified_guides',
    description:
      'Find verified EduExpress guides and policy pages covering MBBS recognition (BMDC/WDOMS), CSC scholarships, X1/X2 student visas, IELTS waivers/MOI, cost breakdowns, or fee transparency.',
    parameters: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Topic keyword such as "mbbs bmdc", "csc scholarship", "visa", "cost", "ielts waiver", or "fees transparency".',
        },
        language: {
          type: 'string',
          description: 'Preferred guide language: "en" or "bn".',
        },
      },
      required: ['topic'],
    },
  },
];

interface GuideEntry {
  title: string;
  bnTitle?: string;
  href: string;
  bnHref?: string;
  category: AdvisorCitation['category'];
  keywords: RegExp;
  summary: string;
  bnSummary?: string;
}

const VERIFIED_GUIDES: GuideEntry[] = [
  {
    title: 'MBBS in China — BMDC & WDOMS recognition',
    bnTitle: 'চীনে MBBS গাইড (BMDC ও WDOMS স্বীকৃতি)',
    href: '/mbbs-in-china-bangladesh',
    bnHref: '/bn/mbbs-in-china-bangladesh',
    category: 'guide',
    keywords: /mbbs|medical|doctor|bmdc|wdoms|clinical|pmc|license/i,
    summary: 'Verify WDOMS listing and Bangladesh (BMDC) recognition rules before comparing MBBS fees in China.',
    bnSummary: 'চীনে MBBS পড়ার খরচ তুলনা করার আগে WDOMS তালিকা ও বাংলাদেশ (BMDC) স্বীকৃতির শর্ত যাচাই করুন।',
  },
  {
    title: 'Cost of studying in China (Itemised breakdown)',
    bnTitle: 'চীনে পড়াশোনার খরচ ও প্যাকেজ (বিস্তারিত)',
    href: '/study-in-china-cost-bangladesh',
    bnHref: '/bn/study-in-china-cost-bangladesh',
    category: 'guide',
    keywords: /china.*cost|cost.*china|tuition|hostel|budget|living|expense|package|fee|খরচ|টিউশন/i,
    summary: 'Separates university tuition, hostel, insurance, embassy visa fees, living estimates, and EduExpress China visa-first fee terms (no service charge before China visa approval).',
    bnSummary: 'বিশ্ববিদ্যালয় টিউশন, হোস্টেল, দূতাবাস ফি, থাকা-খাওয়া এবং চায়না ভিসার পর EduExpress সার্ভিস চার্জের আলাদা হিসাব।',
  },
  {
    title: 'CSC & Chinese university scholarships',
    bnTitle: 'CSC ও চাইনিজ স্কলারশিপ গাইড',
    href: '/china-scholarships-bangladesh',
    bnHref: '/bn/csc-scholarship-bangladesh',
    category: 'guide',
    keywords: /csc|scholarship|stipend|waiver|belt.*road|provincial|স্কলারশিপ|বৃত্তি/i,
    summary: 'Explains CSC, provincial, and university scholarships, what costs remain payable (travel, medical, insurance, personal living), and GPA renewal rules. Selection is competitive and never guaranteed.',
    bnSummary: 'CSC, প্রাদেশিক ও বিশ্ববিদ্যালয় বৃত্তির কভারেজ, কোন খরচ বাকি থাকে এবং নবায়নের (renewal) GPA শর্ত।',
  },
  {
    title: '2027 CSCA Entrance Exam Guide & Free CSCA Master Pro Prep',
    bnTitle: 'CSCA ভর্তি পরীক্ষার গাইড ২০২৭ (বাংলা)',
    href: '/updates/csca-guide-study-in-china',
    bnHref: '/bn/csca-exam-bangladesh',
    category: 'guide',
    keywords: /csca|entrance.*exam|mock.*test|cscamaster|admission.*test|ভর্তি.*পরীক্ষা|মক.*টেস্ট/i,
    summary: 'China Scholastic Competency Assessment (CSCA) subjects, Dhaka (UTC+6) schedule, CNY 450/700 fee rules, CSCA-exempt options, and complimentary CSCA Master Pro access (CNY 99 value on cscamaster.com) when opening a verified China application file with EduExpress at BDT 0 file-opening charge.',
    bnSummary: 'চীনে আন্ডারগ্র্যাজুয়েট ভর্তির CSCA পরীক্ষার সিলেবাস, ঢাকা সময়সূচি (UTC+6), ফি পেমেন্ট এবং এডুএক্সপ্রেসে ফাইল ওপেন করলেই ফ্রি CSCA Master Pro (CNY ৯৯ মূল্য) মক টেস্ট অ্যাক্সেস।',
  },
  {
    title: 'China Student Visa Guide (X1 / X2)',
    bnTitle: 'চায়না স্টুডেন্ট ভিসা গাইড (X1/X2)',
    href: '/china-student-visa-bangladesh',
    bnHref: '/bn/china-student-visa-bangladesh',
    category: 'guide',
    keywords: /visa|jw201|jw202|embassy|solvency|police clearance|ভিসা|দূতাবাস/i,
    summary: 'Covers JW201/JW202 forms, X1/X2 visa differences, medical examination, police clearance, and Dhaka Embassy submission steps.',
    bnSummary: 'JW201/JW202 অনুমোদন, X1/X2 ভিসা, মেডিকেল ও ঢাকা দূতাবাসের নথিপত্র প্রস্তুতি।',
  },
  {
    title: 'Study in China without IELTS / MOI routes',
    href: '/study-in-china-without-ielts',
    category: 'guide',
    keywords: /ielts|moi|english|language|proficiency|duolingo|ইংরেজি/i,
    summary: 'How Medium of Instruction (MOI) letters or university language assessments work for select English-taught China programs (note: CSCA and admission tests still apply where required).',
  },
  {
    title: 'China intakes and deadlines',
    href: '/china-intakes-deadlines',
    category: 'guide',
    keywords: /intake|deadline|march|september|spring|autumn|সময়|মার্চ|সেপ্টেম্বর/i,
    summary: 'Compare March (Spring) and September (Autumn) admission windows and document cutoff timelines.',
  },
  {
    title: 'Malaysia study cost & EMGS overview',
    href: '/malaysia-study-cost-bangladesh',
    category: 'guide',
    keywords: /malaysia|emgs|rm\b|kuala lumpur|foundation|মালয়েশিয়া/i,
    summary: 'Year-one tuition estimates, EMGS student pass fees, and living costs in Malaysia.',
  },
  {
    title: 'Fees & transparency policy',
    href: '/fees-and-transparency',
    category: 'guide',
    keywords: /refund|transparent|service.*fee|charge|who receives|policy|সার্ভিস/i,
    summary: 'Explains who receives every payment, refund boundaries, and why China visa-first consultancy charges apply only after China visa approval.',
  },
  {
    title: 'How we verify university records',
    href: '/how-we-verify-universities',
    category: 'guide',
    keywords: /verify|verified|source|mo[ep]|recognition|rank/i,
    summary: 'How EduExpress audits MoE listings, WDOMS/BMDC checks, fee tables, and ClearCost records.',
  },
  {
    title: 'Free Education Fit Assessment',
    href: '/education-fit-assessment',
    category: 'guide',
    keywords: /apply|shortlist|assessment|match|review|recommend/i,
    summary: 'Submit your level, results, subject, and budget for a written route check before paying consultancy or application fees.',
  },
];

export function normalizeAdvisorRequest(raw: unknown): { data?: NormalizedAdvisorRequest; error?: string } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { error: 'Advisor request must be a JSON object.' };
  }
  const body = raw as Record<string, unknown>;
  const question = cleanText(body.question, 600);
  if (!question || question.length < 3) {
    return { error: 'Enter a clear study, university, scholarship, or cost question (at least 3 characters).' };
  }

  const historyRaw = Array.isArray(body.history) ? body.history : [];
  const history: AdvisorMessage[] = [];
  for (const item of historyRaw.slice(-6)) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const entry = item as Record<string, unknown>;
    const role = entry.role === 'assistant' ? 'assistant' : entry.role === 'user' ? 'user' : null;
    const content = cleanText(entry.content, 1200);
    if (role && content) {
      history.push({ role, content });
    }
  }

  return {
    data: {
      question,
      history,
      language: body.language === 'bn' ? 'bn' : 'en',
    },
  };
}

function toCandidateShape(record: CleanUniversityRecord): FitCandidateUniversity {
  return {
    slug: record.slug,
    name: record.name,
    country: record.country,
    city: record.city,
    degrees: record.degree,
    taught: record.taught,
    intakes: record.intake,
    majors: record.details.majors,
    tuition: record.details.tuition,
    recognitionAuthority: record.recognitionAuthority,
    verificationStatus: record.verificationStatus,
    hasPublishedCostPlan: record.costPlans.some(plan => plan.isPublished),
    programs: record.programs
      .filter(program => program.status !== 'paused')
      .map(program => ({
        name: program.name,
        level: program.level,
        subject: program.subject,
        languages: program.languages,
        intakes: program.intakes,
        tuition: program.tuition,
        tuitionAfterScholarship: program.tuitionAfterScholarship,
      })),
    scholarships: record.scholarships
      .filter(scholarship => scholarship.status !== 'closed')
      .map(scholarship => ({
        title: scholarship.title,
        amount: scholarship.amount,
        coverage: scholarship.coverage,
        condition: scholarship.condition,
      })),
  };
}

function findUniversityBySlugOrName(
  records: CleanUniversityRecord[],
  query: string,
): CleanUniversityRecord | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return (
    records.find(r => r.slug.toLowerCase() === q)
    || records.find(r => r.name.toLowerCase() === q)
    || records.find(r => r.aliases.some(alias => alias.toLowerCase() === q))
    || records.find(r => r.name.toLowerCase().includes(q) || r.slug.includes(q.replace(/\s+/g, '-')))
  );
}

export function executeAdvisorTool(
  toolName: string,
  rawArgs: Record<string, unknown>,
  records: CleanUniversityRecord[],
  language: FitResponseLanguage,
): { toolResult: Record<string, unknown>; citations: AdvisorCitation[] } {
  const activeRecords = records.filter(record => record.isActive);
  const citations: AdvisorCitation[] = [];

  if (toolName === 'search_universities_and_programs') {
    const query = cleanText(rawArgs.query, 200) || 'Computer Science';
    const countryArg = cleanText(rawArgs.country, 60);
    const levelArg = cleanText(rawArgs.degreeLevel, 80) || 'HSC / A Level';
    const limit = typeof rawArgs.limit === 'number' && Number.isFinite(rawArgs.limit)
      ? Math.max(1, Math.min(5, Math.round(rawArgs.limit)))
      : 4;

    const exactUni = findUniversityBySlugOrName(activeRecords, query);
    const profile: FitProfileInput = {
      academicLevel: levelArg,
      subject: query,
      preferredCountries: countryArg && !/all|not sure/i.test(countryArg)
        ? [normalizeCountrySlug(countryArg)]
        : [],
      responseLanguage: language,
    };

    const candidates = activeRecords.map(toCandidateShape);
    const scored = scoreCandidateUniversities(profile, candidates, limit);
    const ordered = exactUni
      ? [toCandidateShape(exactUni), ...scored.filter(item => item.slug !== exactUni.slug)].slice(0, limit)
      : scored;

    const universities = ordered.map(item => {
      const full = activeRecords.find(r => r.slug === item.slug);
      const hasCostPlan = Boolean(full?.costPlans.some(plan => plan.isPublished));
      citations.push({
        title: `${item.name} (${item.city}, ${item.country})`,
        href: `/universities/${item.slug}`,
        category: 'university',
        note: item.programs[0]?.tuition || item.tuition,
      });
      if (hasCostPlan) {
        citations.push({
          title: `${item.name} ClearCost schedule`,
          href: `/universities/${item.slug}/clear-cost`,
          category: 'cost_plan',
        });
      }
      return {
        slug: item.slug,
        name: item.name,
        country: item.country,
        city: item.city,
        tuitionOverview: item.tuition,
        taughtLanguages: item.taught,
        intakes: item.intakes,
        verificationStatus: item.verificationStatus,
        recognitionAuthority: item.recognitionAuthority,
        matchedPrograms: item.programs.slice(0, 3),
        scholarships: item.scholarships.slice(0, 2).map(s => ({
          summary: formatScholarshipSummary(s),
          condition: s.condition,
        })),
        profilePath: `/universities/${item.slug}`,
        clearCostPath: hasCostPlan ? `/universities/${item.slug}/clear-cost` : undefined,
      };
    });

    return {
      toolResult: {
        matchedCount: universities.length,
        medicalQueryDetected: isMedicalQuery(profile),
        universities,
      },
      citations,
    };
  }

  if (toolName === 'get_cost_breakdown') {
    const uniQuery = cleanText(rawArgs.universitySlugOrName, 160);
    const destQuery = cleanText(rawArgs.destination, 80);

    const uni = uniQuery ? findUniversityBySlugOrName(activeRecords, uniQuery) : undefined;
    const countrySlug = destQuery
      ? normalizeCountrySlug(destQuery)
      : uni
        ? normalizeCountrySlug(uni.country)
        : '';
    const country = activeCountries.find(c => c.slug === countrySlug);

    const publishedPlans = uni?.costPlans.filter(plan => plan.isPublished).slice(0, 2) || [];

    if (uni) {
      citations.push({
        title: publishedPlans.length > 0 ? `${uni.name} ClearCost breakdown` : `${uni.name} profile & fees`,
        href: publishedPlans.length > 0 ? `/universities/${uni.slug}/clear-cost` : `/universities/${uni.slug}`,
        category: publishedPlans.length > 0 ? 'cost_plan' : 'university',
        note: publishedPlans[0]?.totalEstimate || uni.details.tuition,
      });
    }

    if (country) {
      citations.push({
        title: `${country.name} destination & costs`,
        href: destinationPath(country.slug),
        category: 'destination',
        note: country.costs.tuition,
      });
    }

    if (country?.slug === 'china' || !country) {
      citations.push({
        title: language === 'bn' ? 'চীনে পড়াশোনার খরচ ও প্যাকেজ' : 'Cost of studying in China',
        href: language === 'bn' ? '/bn/study-in-china-cost-bangladesh' : '/study-in-china-cost-bangladesh',
        category: 'guide',
      });
    }

    return {
      toolResult: {
        university: uni
          ? {
              slug: uni.slug,
              name: uni.name,
              country: uni.country,
              tuitionOverview: uni.details.tuition,
              publishedCostPlans: publishedPlans,
              recordedFees: uni.fees.slice(0, 6),
              clearCostPath: publishedPlans.length > 0 ? `/universities/${uni.slug}/clear-cost` : undefined,
            }
          : null,
        destinationCosts: country
          ? {
              country: country.name,
              slug: country.slug,
              serviceStatus: country.serviceStatus,
              indicativeTuition: country.costs.tuition,
              indicativeLiving: country.costs.living,
              currency: country.costs.currency,
              intakes: country.intakesText,
              scholarships: country.scholarships.slice(0, 3),
              guidePath: destinationPath(country.slug),
            }
          : null,
        eduExpressFeePolicy: {
          chinaVisaFirstRule: 'For China admissions, EduExpress charges no consultancy service fee before China visa approval; university tuition, hostel, medical, and embassy fees remain separate and paid according to official receipts.',
          guaranteeRule: 'Admission, scholarships, and visas cannot be guaranteed.',
        },
      },
      citations,
    };
  }

  // lookup_verified_guides fallback/handler
  const topic = cleanText(rawArgs.topic, 200) || 'study';
  const lang = rawArgs.language === 'bn' ? 'bn' : language;
  const matched = VERIFIED_GUIDES.filter(entry => entry.keywords.test(topic));
  const selected = (matched.length > 0 ? matched : [VERIFIED_GUIDES[1], VERIFIED_GUIDES[2], VERIFIED_GUIDES[9]]).slice(0, 4);

  const guides = selected.map(entry => {
    const href = lang === 'bn' && entry.bnHref ? entry.bnHref : entry.href;
    const title = lang === 'bn' && entry.bnTitle ? entry.bnTitle : entry.title;
    const summary = lang === 'bn' && entry.bnSummary ? entry.bnSummary : entry.summary;
    citations.push({ title, href, category: entry.category });
    return { title, href, summary };
  });

  return {
    toolResult: { guides },
    citations,
  };
}

export function dedupeCitations(list: AdvisorCitation[], maxItems = 6): AdvisorCitation[] {
  const out: AdvisorCitation[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    if (!item.href.startsWith('/') || seen.has(item.href)) continue;
    seen.add(item.href);
    out.push(item);
    if (out.length >= maxItems) break;
  }
  return out;
}

export function buildCatalogAdvisorFallbackAnswer(
  question: string,
  records: CleanUniversityRecord[],
  language: FitResponseLanguage,
): { text: string; citations: AdvisorCitation[] } {
  const bn = language === 'bn';
  const medical = isMedicalQuery({ subject: question });
  const destinationMatch = activeCountries.find(c =>
    new RegExp(`\\b${c.name.toLowerCase()}|${c.slug.replace('-', ' ')}\\b`, 'i').test(question),
  );
  const detectedDestination = destinationMatch?.slug || (/china|চীন|csc|mbbs/i.test(question) ? 'china' : undefined);

  const uniExec = executeAdvisorTool(
    'search_universities_and_programs',
    {
      query: medical ? 'MBBS' : question,
      country: detectedDestination || '',
      limit: 3,
    },
    records,
    language,
  );
  const costExec = executeAdvisorTool(
    'get_cost_breakdown',
    {
      destination: detectedDestination || 'china',
    },
    records,
    language,
  );
  const guideExec = executeAdvisorTool(
    'lookup_verified_guides',
    { topic: question, language },
    records,
    language,
  );

  const citations = dedupeCitations([
    ...guideExec.citations,
    ...uniExec.citations,
    ...costExec.citations,
  ]);

  const uniList = ((uniExec.toolResult as { universities?: Array<{ name: string; city: string; country: string; tuitionOverview: string; recognitionAuthority?: string }> }).universities) || [];
  const destInfo = (costExec.toolResult as { destinationCosts?: { country: string; indicativeTuition: string; indicativeLiving: string } | null }).destinationCosts;

  const lines: string[] = bn
    ? [
        `আপনার প্রশ্নের (${question}) উত্তরে EduExpress-এর যাচাইকৃত রেকর্ড ও গাইড অনুযায়ী গুরুত্বপূর্ণ তথ্যগুলো নিচে দেওয়া হলো:`,
        '',
        ...(medical
          ? ['- **MBBS / মেডিকেল স্বীকৃতি যাচাই:** খরচ তুলনা করার আগে বিশ্ববিদ্যালয়টি WDOMS তালিকাভুক্ত কি না এবং বাংলাদেশ (BMDC)-এর বর্তমান শর্ত পূরণ করে কি না তা যাচাই করা বাধ্যতামূলক।']
          : []),
        ...(destInfo
          ? [`- **${destInfo.country} আনুমানিক খরচ:** টিউশন রেঞ্জ ${destInfo.indicativeTuition} এবং থাকা-খাওয়া প্রায় ${destInfo.indicativeLiving}। বিশ্ববিদ্যালয়, হোস্টেল, দূতাবাস ও থার্ড-পার্টি খরচ আলাদাভাবে হিসাব করা হয়।`]
          : []),
        ...(uniList.length > 0
          ? [
              '- **ডাটাবেসে রেকর্ডকৃত প্রাসঙ্গিক বিশ্ববিদ্যালয়:**',
              ...uniList.map(
                u => `  • **${u.name}** (${u.city}, ${u.country}) — ${u.tuitionOverview}${u.recognitionAuthority ? ` · ${u.recognitionAuthority}` : ''}`,
              ),
            ]
          : []),
        '- **স্বচ্ছতা ও ফি নীতি:** চায়না রুটের ক্ষেত্রে ভিসা অনুমোদনের আগে কোনো EduExpress সার্ভিস ফি প্রযোজ্য নয়। ভর্তি, স্কলারশিপ বা ভিসার কোনো গ্যারান্টি দেওয়া হয় না — এগুলো সম্পূর্ণভাবে সংশ্লিষ্ট বিশ্ববিদ্যালয় ও দূতাবাসের সিদ্ধান্ত।',
      ]
    : [
        `Here is what EduExpress International's verified records show for your question (**${question}**):`,
        '',
        ...(medical
          ? ['- **Medical recognition first:** Always verify active WDOMS listing and Bangladesh (BMDC) licensing eligibility before comparing MBBS tuition or scholarships.']
          : []),
        ...(destInfo
          ? [`- **${destInfo.country} cost range:** Indicative tuition is ${destInfo.indicativeTuition} with estimated living expenses around ${destInfo.indicativeLiving}. Tuition, hostel, embassy visa fees, and third-party costs remain itemised separately.`]
          : []),
        ...(uniList.length > 0
          ? [
              '- **Recorded catalog matches to inspect:**',
              ...uniList.map(
                u => `  • **${u.name}** (${u.city}, ${u.country}) — ${u.tuitionOverview}${u.recognitionAuthority ? ` · ${u.recognitionAuthority}` : ''}`,
              ),
            ]
          : []),
        '- **Verification & fee boundary:** No consultancy can guarantee admission, scholarships, or visas. For China routes, EduExpress charges no service fee before China visa approval (university, medical, and embassy costs remain separate). Submit the free Fit Assessment if you would like a written shortlist checked against your transcripts.',
      ];

  return {
    text: lines.join('\n'),
    citations,
  };
}
