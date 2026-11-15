import { cleanText, type FitResponseLanguage } from '@/lib/fit-matcher';

export type VisaDestination = 'china' | 'malaysia';

export interface VisaInterviewQuestion {
  id: number;
  category: 'purpose' | 'institution' | 'funding' | 'post_study';
  questionEn: string;
  questionBn: string;
  contextEn: string;
  contextBn: string;
  keyCheckingPoints: string[];
  commonMistakes: string[];
}

export interface VisaAnswerSubmission {
  questionId: number;
  answer: string;
}

export interface VisaSimulationInput {
  destination: VisaDestination;
  universityName: string;
  programName: string;
  academicLevel: string;
  answers: VisaAnswerSubmission[];
  language: FitResponseLanguage;
}

export interface QuestionCorrection {
  question: string;
  studentAnswer: string;
  recommendedResponse: string;
  tip: string;
}

export interface VisaInterviewFeedback {
  mode: 'gemini' | 'catalog';
  destination: VisaDestination;
  readinessScore: number;
  verdict: 'strong' | 'moderate' | 'needs_revision';
  verdictLabel: string;
  strengths: string[];
  redFlags: string[];
  counselorTips: string[];
  corrections: QuestionCorrection[];
  language: FitResponseLanguage;
}

export const CHINA_VISA_QUESTIONS: VisaInterviewQuestion[] = [
  {
    id: 1,
    category: 'purpose',
    questionEn: 'Why did you choose China to study this specific program instead of continuing your studies in Bangladesh?',
    questionBn: 'বাংলাদেশে পড়াশোনা না করে চীনের এই নির্দিষ্ট প্রোগ্রামে পড়তে যাওয়ার কারণ কী?',
    contextEn: 'Consular officers verify genuine student intent and whether you have researched your academic reasons.',
    contextBn: 'দূতাবাস কর্মকর্তা নিশ্চিত হতে চান যে আপনি পড়াশোনার বাস্তব কারণ জেনে বুঝে সিদ্ধান্ত নিয়েছেন কি না।',
    keyCheckingPoints: ['Program-specific curriculum', 'Advanced laboratory or international faculty', 'Cost-to-quality ratio'],
    commonMistakes: ['Saying Bangladesh education has no value', 'Stating intention to immigrate or settle in China', 'Vague or generic answers'],
  },
  {
    id: 2,
    category: 'institution',
    questionEn: 'Tell me about the university in your JW202/JW201 form. What city is it in, what is the degree duration, and what is the medium of instruction?',
    questionBn: 'আপনার JW202/JW201 ফর্মের বিশ্ববিদ্যালয় সম্পর্কে বলুন। এটি কোন শহরে অবস্থিত, কোর্সের মেয়াদ কত এবং শিক্ষার মাধ্যম কী?',
    contextEn: 'Tests whether you know your exact university details, city geography, and language requirements.',
    contextBn: 'আপনি নিজের বিশ্ববিদ্যালয়ের শহর, কোর্স সময়কাল এবং ইংরেজির মাধ্যম সম্পর্কে অবগত কি না তা যাচাই করা হয়।',
    keyCheckingPoints: ['Correct city name (e.g. Nanjing, Hefei, Wuhan)', 'Degree duration (e.g. 4 years for Bachelor, 5+1 for MBBS)', 'English vs Chinese medium'],
    commonMistakes: ['Not knowing which province or city the university is in', 'Confusing MBBS internship years', 'Saying you do not know JW form number'],
  },
  {
    id: 3,
    category: 'funding',
    questionEn: 'Who is sponsoring your tuition, accommodation, and living expenses in China, and what is their source of income?',
    questionBn: 'চীনে আপনার টিউশন, হোস্টেল ও থাকা-খাওয়ার খরচ কে বহন করছেন এবং তাদের আয়ের উৎস কী?',
    contextEn: 'Verifies financial stability and consistency with the submitted bank solvency certificate.',
    contextBn: 'ব্যাংক সলভেন্সি সার্টিফিকেটের সাথে স্পন্সরের পেশা ও আয়ের মিল রয়েছে কি না তা দেখা হয়।',
    keyCheckingPoints: ['Primary sponsor relationship (parents/guardians)', 'Specific business or employment details', 'Clear understanding of living budget'],
    commonMistakes: ['Saying you plan to do part-time jobs in China (illegal on student visa without special school permit)', 'Saying friends or distant relatives will pay', 'Not knowing your annual tuition amount'],
  },
  {
    id: 4,
    category: 'post_study',
    questionEn: 'What are your concrete career plans after completing your graduation in China?',
    questionBn: 'চীনে পড়াশোনা সম্পন্ন করার পর আপনার ভবিষ্যৎ কর্মপরিকল্পনা কী?',
    contextEn: 'CRUCIAL: Non-immigrant student visa requires clear intent to return to Bangladesh or pursue verified professional licensing.',
    contextBn: 'ভিসা নিয়মানুযায়ী পড়াশোনা শেষে দেশে ফিরে আসার সুস্পষ্ট পরিকল্পনা থাকা আবশ্যক।',
    keyCheckingPoints: ['For MBBS: Appearing in BMDC licensing exam in Dhaka', 'For Engineering/CS: Joining IT/Engineering sectors in Bangladesh', 'Strong family and career ties to Bangladesh'],
    commonMistakes: ['Saying you want to remain in China permanently', 'Saying you will look for any job in China without returning', 'Having no career roadmap'],
  },
];

export const MALAYSIA_VISA_QUESTIONS: VisaInterviewQuestion[] = [
  {
    id: 1,
    category: 'purpose',
    questionEn: 'What led you to choose Malaysia and this university for your higher education?',
    questionBn: 'উচ্চশিক্ষার জন্য মালয়েশিয়া এবং এই বিশ্ববিদ্যালয়টি কেন বেছে নিয়েছেন?',
    contextEn: 'EMGS and immigration assess genuine academic intention and English readiness.',
    contextBn: 'ইমিগ্রেশন আপনার পড়াশোনার প্রস্তুতি ও উদ্দেশ্য পর্যালোচনা করে।',
    keyCheckingPoints: ['Dual-degree or MQA accredited curriculum', 'English-speaking campus environment', 'Career progression'],
    commonMistakes: ['Vague destination comparison', 'Saying you chose Malaysia just for travel'],
  },
  {
    id: 2,
    category: 'institution',
    questionEn: 'Which campus will you be attending, what is your program title, and what are the entry requirements?',
    questionBn: 'আপনি কোন ক্যাম্পাসে পড়বেন, প্রোগ্রামের নাম কী এবং ভর্তির আবশ্যিক শর্ত কী ছিল?',
    contextEn: 'Verifies matching offer letter and eVAL application credentials.',
    contextBn: 'অফার লেটার ও ই-ভ্যালের তথ্যের সাথে আপনার বক্তব্যের মিল যাচাই।',
    keyCheckingPoints: ['Campus location (e.g. Kuala Lumpur, Cyberjaya)', 'Exact program title and MQA status'],
    commonMistakes: ['Mispronouncing institution name', 'Uncertainty about course duration'],
  },
  {
    id: 3,
    category: 'funding',
    questionEn: 'How will your tuition fees and EMGS renewal charges be funded during your stay in Malaysia?',
    questionBn: 'মালয়েশিয়ায় আপনার টিউশন ও বার্ষিক EMGS রিনিউয়াল ফি কীভাবে পরিশোধ করা হবে?',
    contextEn: 'Verifies financial solvency and awareness of yearly visa renewal costs.',
    contextBn: 'বার্ষিক ভিসা রিনিউ এবং টিউশনের জন্য পর্যাপ্ত ফান্ডের নিশ্চয়তা।',
    keyCheckingPoints: ['Legitimate sponsor funds in bank account', 'Awareness of EMGS annual medical/visa renewal charges'],
    commonMistakes: ['Relying on unauthorized off-campus employment', 'Unaware of living costs in Ringgit (RM)'],
  },
  {
    id: 4,
    category: 'post_study',
    questionEn: 'What career position will you pursue in Bangladesh once you graduate from Malaysia?',
    questionBn: 'মালয়েশিয়া থেকে গ্র্যাজুয়েশন শেষে বাংলাদেশে কী ধরনের কর্মসংস্থানে যুক্ত হবেন?',
    contextEn: 'Demonstrates non-immigrant intent and return to home country.',
    contextBn: 'ডিগ্রি শেষে বাংলাদেশে ফিরে আসার ক্যারিয়ার লক্ষ্য।',
    keyCheckingPoints: ['Specific industry role in Bangladesh', 'Leveraging international qualification locally'],
    commonMistakes: ['Saying you intend to overstay on a social visit pass'],
  },
];

export function getQuestionsForDestination(destination: VisaDestination): VisaInterviewQuestion[] {
  return destination === 'malaysia' ? MALAYSIA_VISA_QUESTIONS : CHINA_VISA_QUESTIONS;
}

export const VISA_FEEDBACK_SCHEMA = {
  type: 'object',
  properties: {
    readinessScore: {
      type: 'integer',
      description: 'Score from 0 to 100 assessing embassy interview readiness.',
    },
    verdict: {
      type: 'string',
      enum: ['strong', 'moderate', 'needs_revision'],
      description: 'Overall interview readiness verdict.',
    },
    verdictLabel: {
      type: 'string',
      description: 'One-sentence summary verdict in requested language.',
    },
    strengths: {
      type: 'array',
      items: { type: 'string' },
      description: '2 to 3 strong points observed in the answers.',
    },
    redFlags: {
      type: 'array',
      items: { type: 'string' },
      description: 'Potential red flags that could trigger visa scrutiny or rejection.',
    },
    counselorTips: {
      type: 'array',
      items: { type: 'string' },
      description: '2 to 3 actionable counselor tips to polish before embassy submission.',
    },
    corrections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          studentAnswer: { type: 'string' },
          recommendedResponse: { type: 'string', description: 'Diplomatic, factual model answer.' },
          tip: { type: 'string' },
        },
        required: ['question', 'studentAnswer', 'recommendedResponse', 'tip'],
      },
    },
  },
  required: ['readinessScore', 'verdict', 'verdictLabel', 'strengths', 'redFlags', 'counselorTips', 'corrections'],
} as const;

export function evaluateAnswersLocally(input: VisaSimulationInput): VisaInterviewFeedback {
  const questions = getQuestionsForDestination(input.destination);
  const bn = input.language === 'bn';

  let score = 75;
  const redFlags: string[] = [];
  const strengths: string[] = [];
  const corrections: QuestionCorrection[] = [];

  for (const q of questions) {
    const sub = input.answers.find(a => a.questionId === q.id);
    const ans = cleanText(sub?.answer, 500);

    const questionText = bn ? q.questionBn : q.questionEn;

    if (!ans || ans.length < 15) {
      score -= 15;
      redFlags.push(
        bn
          ? `প্রশ্ন ${q.id}: উত্তর অত্যন্ত সংক্ষিপ্ত বা অসম্পূর্ণ।`
          : `Question ${q.id}: Answer is too brief or incomplete.`,
      );
      corrections.push({
        question: questionText,
        studentAnswer: ans || (bn ? 'কোনো উত্তর দেওয়া হয়নি' : 'No answer provided'),
        recommendedResponse: bn
          ? `আমার উদ্দেশ্য ${input.universityName}-এ ${input.programName} সম্পন্ন করা। দেশে ফিরে এসে সংশ্লিষ্ট খাতে ক্যারিয়ার গড়ে তোলার দৃঢ় পরিকল্পনা রয়েছে।`
          : `My objective is to complete my degree in ${input.programName} at ${input.universityName} and return to Bangladesh to build my professional career.`,
        tip: bn ? 'নির্দিষ্ট তথ্য দিয়ে কমপক্ষে ২-৩ বাক্যে উত্তর দিন।' : 'Answer in 2-3 specific, confident sentences.',
      });
      continue;
    }

    // Check for common red flags
    if (/part-time|job|work\s+there|পার্টটাইম|কাজ/i.test(ans) && q.category === 'funding') {
      score -= 20;
      redFlags.push(
        bn
          ? 'পার্ট-টাইম চাকরির উল্লেখ: চায়না বা মালয়েশিয়া স্টুডেন্ট ভিসায় অননুমোদিত কাজ করার কথা বললে ভিসা বাতিল হতে পারে।'
          : 'Mentioning off-campus work: Student visas prohibit unauthorized employment; funding must rely on official sponsors.',
      );
    }

    if (/settle|permanent|stay\s+there|থাকে\s+যাব|স্থায়ী/i.test(ans) && q.category === 'post_study') {
      score -= 25;
      redFlags.push(
        bn
          ? 'স্থায়ীভাবে থেকে যাওয়ার ইঙ্গিত: স্টুডেন্ট ভিসা নন-ইমিগ্র্যান্ট ক্যাটাগরি, পড়াশোনা শেষে দেশে ফিরে আসার সুস্পষ্ট ইচ্ছা প্রকাশ করা আবশ্যক।'
          : 'Immigration intent detected: Embassy requires clear intent to return to Bangladesh upon graduation.',
      );
    }

    if (ans.length >= 40 && !/part-time|settle/i.test(ans)) {
      score += 3;
      strengths.push(
        bn
          ? `প্রশ্ন ${q.id}: অ্যাকাডেমিক লক্ষ্য ও তথ্য স্পষ্ট।`
          : `Question ${q.id}: Clear academic focus and structure.`,
      );
    }

    corrections.push({
      question: questionText,
      studentAnswer: ans,
      recommendedResponse: bn
        ? `আমি ${input.universityName}-এর ${input.programName} কোর্সের পাঠ্যক্রম এবং আন্তর্জাতিক স্বীকৃতির কারণে এটি নির্বাচন করেছি। স্পন্সর হিসেবে আমার অভিভাবক সকল ব্যয় বহন করবেন এবং কোর্স শেষে দেশে ফিরে আমি বিএমডিসি/আইটি সেক্টরে যুক্ত হব।`
        : `I selected ${input.universityName} for its verified curriculum in ${input.programName}. My tuition and living expenses are fully supported by my parents, and upon graduation, I plan to return to Bangladesh to advance my career.`,
      tip: bn ? 'কনসুলার অফিসারের চোখের দিকে তাকিয়ে আত্মবিশ্বাসের সাথে উত্তর দিন।' : 'Maintain eye contact and deliver factual points confidently.',
    });
  }

  score = Math.max(30, Math.min(95, score));

  const verdict: 'strong' | 'moderate' | 'needs_revision' =
    score >= 80 ? 'strong' : score >= 60 ? 'moderate' : 'needs_revision';

  const verdictLabel = bn
    ? verdict === 'strong'
      ? 'ভিসা ইন্টারভিউ প্রস্তুতি অত্যন্ত সন্তোষজনক।'
      : verdict === 'moderate'
      ? 'প্রস্তুতি ভালো, তবে ফান্ডিং ও ক্যারিয়ার সংক্রান্ত উত্তর আরও স্পষ্ট করা প্রয়োজন।'
      : 'গুরুত্বপূর্ণ অসঙ্গতি রয়েছে; জমা দেওয়ার আগে কাউন্সেলরের সাথে রিভিশন দরকার।'
    : verdict === 'strong'
    ? 'Interview readiness is strong and well-aligned with embassy expectations.'
    : verdict === 'moderate'
    ? 'Moderate readiness; refine funding and post-graduation intent details.'
    : 'High risk answers identified; revision with an EduExpress counselor is recommended.';

  const counselorTips = bn
    ? [
        'JW202/JW201 ফর্ম ও অফার লেটারে লেখা শহর ও টিউশন ফি মুখস্থ রাখুন।',
        'ভিসা ইন্টারভিউতে কখনোই চীনে পার্ট-টাইম কাজ করে খরচ চালানোর কথা বলবেন না।',
        'পড়াশোনা শেষে বাংলাদেশে ফিরে আসার ক্যারিয়ার পরিকল্পনা সুস্পষ্ট রাখুন।',
      ]
    : [
        'Memorize the exact city, tuition figure, and degree duration shown on your JW form.',
        'Never mention unauthorized part-time work when discussing living expenses.',
        'Clearly articulate your intent to return to Bangladesh to practice or work after graduation.',
      ];

  return {
    mode: 'catalog',
    destination: input.destination,
    readinessScore: score,
    verdict,
    verdictLabel,
    strengths: strengths.length > 0 ? strengths.slice(0, 3) : [bn ? 'মৌলিক তথ্য উপস্থিত।' : 'Basic facts addressed.'],
    redFlags,
    counselorTips,
    corrections,
    language: input.language,
  };
}
