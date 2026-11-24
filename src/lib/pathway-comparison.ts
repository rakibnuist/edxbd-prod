import 'server-only';

import { cache } from 'react';
import { getUniversityRankings, type UniversityRanking } from '@/lib/university-rankings';
import { getUniversityRecords, type CleanUniversityRecord } from '@/lib/university-records';

export const PATHWAY_LAST_UPDATED_ISO = '2026-11-25';
export const PATHWAY_LAST_UPDATED_LABEL = 'November 2026';

export const PATHWAY_FX_BASELINE = {
  myrToBdt: 30.2,
  cnyToBdt: 18.7,
  checkedLabel: 'November 2026',
} as const;

export const PATHWAY_BOOKLET_PDF = {
  href: '/EduExpress_OLevel_ALevel_Pathways_Malaysia_China_Sep2027.pdf',
  title: 'O-Level & A-Level Pathway Guide: Malaysia & China (September 2027 Intake)',
  pagesLabel: '10-Page Print-Ready A4 Booklet (PDF)',
} as const;

export type OfficialSource = {
  label: string;
  href: string;
};

export const MALAYSIA_O_LEVEL_SOURCES: OfficialSource[] = [
  { label: 'Education Malaysia Global Services (EMGS)', href: 'https://educationmalaysia.gov.my/' },
  { label: 'Malaysian Qualifications Register (MQR / MQA)', href: 'https://www2.mqa.gov.my/mqr/' },
  { label: 'Ministry of Higher Education Malaysia (MoHE)', href: 'https://www.mohe.gov.my/en' },
  { label: 'British Council Bangladesh — School Exams', href: 'https://www.britishcouncil.org.bd/en/exam/school' },
  { label: 'Bangladesh Bank — Foreign Exchange Guidelines', href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline' },
];

export const CHINA_O_LEVEL_SOURCES: OfficialSource[] = [
  { label: 'Ministry of Education of the People’s Republic of China (MoE)', href: 'http://en.moe.gov.cn/' },
  { label: 'Campus China — Official Study in China Portal', href: 'https://www.campuschina.org/' },
  { label: 'Embassy of China in Bangladesh', href: 'https://bd.china-embassy.gov.cn/eng/' },
  { label: 'Ministry of Education Order No. 42 (International Student Rules)', href: 'https://www.campuschina.org/content/details3_74776.html' },
];

export const COMPARISON_HUB_SOURCES: OfficialSource[] = [
  { label: 'ShanghaiRanking — Academic Ranking & Best Chinese Universities', href: 'https://www.shanghairanking.com/' },
  { label: 'QS World University Rankings', href: 'https://www.topuniversities.com/world-university-rankings' },
  { label: 'Times Higher Education World University Rankings', href: 'https://www.timeshighereducation.com/world-university-rankings' },
  { label: 'North South University (NSU) — Tuition & Fees', href: 'https://www.northsouth.edu/academic/tuition-and-fees/' },
  { label: 'East West University (EWU) — Tuition Fees', href: 'https://www.ewubd.edu/tuition-fees' },
  { label: 'American International University-Bangladesh (AIUB) — Tuition Fees', href: 'https://www.aiub.edu/tuition-fees' },
  { label: 'UK Visas and Immigration — Student Visa', href: 'https://www.gov.uk/student-visa' },
  { label: 'Study Australia — Living Costs & Financial Capacity', href: 'https://www.studyaustralia.gov.au/en/plan-your-move/living-and-education-costs' },
  { label: 'Education Malaysia Global Services (EMGS)', href: 'https://educationmalaysia.gov.my/' },
];

export const BANGLADESH_A_LEVEL_TRACKS = [
  {
    route: 'Private Candidate / Coaching Route (3 Subjects, 2 Years)',
    tuitionAndCoaching: 'BDT 350,000 – 400,000 (coaching ~BDT 4,500–6,000/subject/month)',
    labsAndMocks: 'BDT 45,000 – 90,000 science practical labs (if STEM) + BDT 11,000 – 21,000 mocks/books',
    boardExams: 'BDT 100,000 – 130,000 (CAIE 3 subjects) or BDT 200,000 – 220,000 (Edexcel IAL 18 units, incl. 15% VAT)',
    academicTotal: 'BDT 480,000 – 735,000 (academic & exam total only)',
    timeBeforeBachelor: '2 Years before university enrollment',
  },
  {
    route: 'Full-Time Dhaka English-Medium School Route (3–4 Subjects, 2 Years)',
    tuitionAndCoaching: 'Mid-tier schools: BDT 18,000–30,000/month · Premium schools: BDT 35,000–65,000+/month',
    labsAndMocks: 'Admission/re-enrollment & lab/session charges: BDT 30,000 – 150,000+',
    boardExams: 'BDT 100,000 – 220,000+ (British Council CAIE or Edexcel IAL registration, incl. 15% VAT)',
    academicTotal: 'BDT 750,000 – 1,500,000+ (academic & exam total only)',
    timeBeforeBachelor: '2 Years before university enrollment',
  },
] as const;

export const CHINA_DIPLOMA_SCHOLARSHIP_TIERS = [
  {
    tier: 'Tier 1 · Full Diploma Scholarship',
    tuitionFee: 'CNY 0 (100% Free)',
    hostelFee: 'CNY 0 (Free On-Campus Dormitory)',
    institutionalTotal: 'CNY 0 / year (Tuition + Hostel)',
    notes: 'Competitive institutional or provincial quota; subject to annual academic & attendance review.',
  },
  {
    tier: 'Tier 2 · Class B (Tuition-Free Route)',
    tuitionFee: 'CNY 0 (100% Free)',
    hostelFee: 'CNY 1,200 – 3,000 / year',
    institutionalTotal: 'CNY 1,200 – 3,000 / year (Hostel only)',
    notes: 'Most widely available merit route for strong SSC / O-Level profiles; hostel rate depends on room sharing.',
  },
  {
    tier: 'Tier 3 · Partial Scholarship Package',
    tuitionFee: 'Reduced institutional tuition',
    hostelFee: 'Included in combined package range',
    institutionalTotal: 'CNY 5,000 – 8,000 / year (Tuition + Hostel)',
    notes: 'Accessible entry option when full tuition-waiver seats fill; exact split stated in the written offer letter.',
  },
] as const;

export const BANGLADESH_PRIVATE_UNIVERSITIES = [
  {
    name: 'North South University (NSU)',
    category: 'Category A Private University · Dhaka',
    bbaAcademicTotal: '~BDT 10.56 – 10.90 Lakh (120 credits + admission & semester fees)',
    cseAcademicTotal: '~BDT 11.66 – 12.00 Lakh (130 credits + lab & semester fees)',
    livingNote: 'Dhaka accommodation, meals, and daily commuting are borne separately by the family.',
    recognitionNote: 'UGC Bangladesh approved private university; degree requires 4 years post-HSC / A-Level.',
  },
  {
    name: 'East West University (EWU)',
    category: 'Category A Private University · Dhaka',
    bbaAcademicTotal: '~BDT 9.17 Lakh (130 credits + BDT 25,000 admission + lab/activity fees)',
    cseAcademicTotal: '~BDT 10.03 Lakh (140 credits + admission & lab/activity fees)',
    livingNote: 'Dhaka accommodation, meals, and daily commuting are borne separately by the family.',
    recognitionNote: 'UGC Bangladesh approved; 4-year undergraduate duration after HSC / A-Level.',
  },
  {
    name: 'American International University-Bangladesh (AIUB)',
    category: 'Category A Private University · Dhaka',
    bbaAcademicTotal: '~BDT 10.80 – 11.30 Lakh (120–126 credits + admission & annual fees)',
    cseAcademicTotal: '~BDT 13.80 – 14.30 Lakh (148 credits + admission & annual fees)',
    livingNote: 'Dhaka accommodation, meals, and daily commuting are borne separately by the family.',
    recognitionNote: 'UGC Bangladesh approved; 4-year undergraduate duration after HSC / A-Level.',
  },
] as const;

export const WESTERN_BENCHMARKS = [
  {
    country: 'United Kingdom (UK)',
    eduExpressStatus: 'Active EduExpress Service',
    degreeDuration: '3 Years (Honours) after A-Level or 1-Yr Foundation',
    annualTuitionOnly: '£12,000 – £38,000 / year (~BDT 18L – 58L / yr)',
    fourOrThreeYearTuition: '£36,000 – £114,000 total tuition (3 years, before scholarships)',
    annualLivingSeparated: '£10,800 – £14,100 / year (~BDT 16L – 22L / yr; separated from tuition)',
    entryNote: 'Requires 2–3 A-Levels (or Foundation after O-Level) + IELTS 6.0–6.5; Graduate Route changes to 18 months for most non-PhD applications from Jan 2027.',
  },
  {
    country: 'United States (USA)',
    eduExpressStatus: 'Cost Benchmark & Transfer Target',
    degreeDuration: '4 Years Bachelor’s',
    annualTuitionOnly: 'USD 20,000 – 65,000+ / year (~BDT 25L – 81L+ / yr)',
    fourOrThreeYearTuition: 'USD 80,000 – 260,000+ total tuition (4 years, before institutional aid)',
    annualLivingSeparated: 'USD 12,000 – 22,000 / year (~BDT 15L – 27L / yr; separated from tuition)',
    entryNote: 'Evaluates O-Level + A-Level transcripts (plus SAT/ACT at selective campuses) + IELTS/TOEFL; accessible via Malaysia ADTP / credit transfer to lower early costs.',
  },
  {
    country: 'Australia',
    eduExpressStatus: 'Cost Benchmark & Branch/Transfer Target',
    degreeDuration: '3 – 4 Years Bachelor’s',
    annualTuitionOnly: 'AUD 25,000 – 50,000 / year (~BDT 20L – 39L / yr)',
    fourOrThreeYearTuition: 'AUD 75,000 – 200,000 total tuition (before merit bursaries)',
    annualLivingSeparated: 'AUD 24,000 – 32,000 / year (Visa financial benchmark AUD 29,710/yr; separated)',
    entryNote: 'A-Level entry or Monash/Curtin branch campuses in Malaysia issuing the identical Australian degree at roughly one-third the cost.',
  },
  {
    country: 'New Zealand',
    eduExpressStatus: 'Cost Benchmark & Post-Bachelor Target',
    degreeDuration: '3 – 4 Years Bachelor’s',
    annualTuitionOnly: 'NZD 28,000 – 45,000 / year (~BDT 20L – 33L / yr)',
    fourOrThreeYearTuition: 'NZD 84,000 – 180,000 total tuition (before partial scholarships)',
    annualLivingSeparated: 'NZD 18,000 – 24,000 / year (~BDT 13L – 18L / yr; separated)',
    entryNote: 'Accepts A-Levels (typically 3 passes) or recognized Foundation / 1st-year university transfer with IELTS 6.0+.',
  },
] as const;

export const MALAYSIA_O_LEVEL_WIN_CARDS = [
  {
    badge: 'Time Advantage',
    metric: '1 to 2 Years Saved',
    title: 'Graduate Earlier Than A-Level Peers',
    detail:
      'Skip two extra pre-university years in Bangladesh: complete a 1-year Foundation + 3-year Bachelor in 4 years total after O-Levels, instead of 5–6 years via A-Levels.',
  },
  {
    badge: 'Tuition Reallocation',
    metric: 'BDT 4.8L – 15L+ Redirected',
    title: 'Replace Sunk A-Level Fees With University Credit',
    detail:
      'Redirect BDT 4.8–7.35 lakh (private/coaching + British Council fees) or BDT 7.5–15L+ (Dhaka schools) from a school-leaving exam straight into MQA-accredited university Foundation tuition (from RM 15k–22k / ~BDT 4.53L–6.64L at 30.20 BDT/MYR; living separate).',
  },
  {
    badge: 'Credential Outcome',
    metric: 'UK / AU / Dual Parchment',
    title: 'Same Global Degree Path Without Early Western Cost',
    detail:
      'Progress directly into Monash, Nottingham, or Heriot-Watt branch campuses, UK dual-degree private universities, or 1+2 / 2+1 credit transfers to the UK, Australia, or USA.',
  },
] as const;

export const MALAYSIA_VS_A_LEVEL_WIN_ROWS = [
  {
    criterion: 'Years After O-Level to Complete a Bachelor’s Degree',
    stayForALevel: '5 to 6 Years (2 yrs A-Levels + 3–4 yrs Bachelor)',
    malaysiaPath: '4 Years (1-yr Foundation + 3-yr Bachelor) or ~4–4.5 Years (Diploma + Yr 2 transfer)',
    studentWin: 'Enter full-time employment or a Master’s program 1 to 2 full years ahead of peers.',
  },
  {
    criterion: 'Pre-University Academic & Exam Spend (Living Separated)',
    stayForALevel: 'BDT 4.80L – 7.35L (coaching + British Council) or BDT 7.50L – 15.0L+ (Dhaka schools)',
    malaysiaPath: 'RM 15,000 – 22,000 (~BDT 4.53L – 6.64L) standard Foundation; RM 25k–36k top private/branch',
    studentWin: 'Stop paying for two years of high-school exam prep and put that capital directly into university credits.',
  },
  {
    criterion: 'Qualification Earned After Year 1',
    stayForALevel: 'AS-Level intermediate modules only (cannot enter university yet)',
    malaysiaPath: 'Completed MQA Foundation Certificate — ready for Year 1 Bachelor admission',
    studentWin: 'Every semester counts toward university progression with zero wasted exam retakes.',
  },
  {
    criterion: 'Access to UK / Australian / US Universities',
    stayForALevel: 'Requires high A-Level grades + IELTS + BDT 20L–80L+/yr tuition abroad',
    malaysiaPath: 'Direct branch-campus degree in Malaysia OR 1+2 / 2+1 transfer after Year 1–2',
    studentWin: 'Keep the same Western degree goal at roughly one-third the early-year tuition.',
  },
] as const;

export const CHINA_3_PLUS_2_WIN_CARDS = [
  {
    badge: 'Fast-Track Timeline',
    metric: '5 Years After SSC / O-Level',
    title: '1 Full Year Faster to a Bachelor’s Degree',
    detail:
      'Complete a 3-year Higher Vocational Diploma + 2-year Top-Up Bachelor in 5 years after SSC or O-Level—finishing one full year sooner than Bangladesh’s 6-year HSC/A-Level + Bachelor route.',
  },
  {
    badge: 'Institutional Cost Win',
    metric: 'CNY 0 – 8,000 / Year',
    title: 'Zero or Heavily Subsidized Tuition & Dorm Fees',
    detail:
      'Qualified students earn Tier 1 (CNY 0 tuition + CNY 0 dorm), Tier 2 Class B (CNY 0 tuition + CNY 1,200–3,000/yr dorm), or Tier 3 (CNY 5,000–8,000/yr combined), keeping living expenses separate.',
  },
  {
    badge: 'Applied Skill Advantage',
    metric: '3 Years Lab & Workshop Training',
    title: 'Graduate With Practical Tech Skills + Bachelor Degree',
    detail:
      'Unlike two theoretical HSC/A-Level years, students train from Day 1 in robotics, CNC, mechatronics, software, or e-commerce workshops before completing their 2-year Bachelor upgrade.',
  },
] as const;

export const CHINA_5_YEAR_WIN_ROWS = [
  {
    criterion: 'Total Duration From SSC / O-Level to Bachelor’s Degree',
    bangladeshLocal6Yr: '6 Years (2 yrs HSC/A-Level + 4 yrs Dhaka Private Bachelor)',
    china3Plus2: '5 Years Total (3-yr Diploma + 2-yr Top-Up Bachelor)',
    studentWin: '1 full academic year saved before Master’s study or technical career entry.',
  },
  {
    criterion: 'Pre-Bachelor + 3-Yr Academic & Hostel Cost (Living Separated)',
    bangladeshLocal6Yr: 'BDT 4.8L–15L+ (A-Level) + BDT 9.17L–14.30L (NSU/EWU/AIUB 4-yr fees)',
    china3Plus2: 'Diploma yrs 1–3: CNY 0 (Tier 1), CNY 3,600–9,000 (Tier 2), or CNY 15k–24k (Tier 3) total tuition + dorm',
    studentWin: 'Dramatically lowers out-of-pocket institutional tuition & dorm fees during the first 3 years.',
  },
  {
    criterion: 'Technical Readiness & Portfolio',
    bangladeshLocal6Yr: '2 years of general board exam preparation before touching a major lab',
    china3Plus2: '3 years of applied engineering, software, or automation lab training + Chinese HSK fluency',
    studentWin: 'Students gain both a Higher Vocational Diploma and a Bachelor’s degree plus bilingual tech readiness.',
  },
] as const;

export const UNIFIED_BACHELOR_WIN_MATRIX = [
  {
    factor: 'Global University Ranking & Academic Standing (QS World 2027)',
    chinaTrack: 'QS World 2027 Top 50–730 (e.g., Zhejiang #47, HIT #190, Tianjin #235, Sichuan #300, SCUT #=342, Dalian UT #463, Zhengzhou #=581)',
    malaysiaTrack: 'QS World 2027 #31–#528 via public, branch & UK dual campuses (Monash #31*, UM #56, Nottingham #97*, UTM #158, Taylor’s #272, Sunway #354, APU #528)',
    dhakaPrivateTrack: 'NSU QS #901–950, BRAC/DIU #1001–1200, AIUB #1401+; EWU & others outside QS World 2027',
    westernTrack: 'Global Top 50–600 options in UK, USA, Australia & NZ',
    winnerVerdict: 'China & Malaysia deliver QS World #31–#581 credentials without Western price tags.',
  },
  {
    factor: '4-Year / Full-Degree Tuition (Living Costs Separated)',
    chinaTrack: 'CNY 0 (full university merit/entrance waivers where awarded) to CNY 17,000–100,000 total over 4 yrs (~BDT 0–18.7L)',
    malaysiaTrack: 'RM 30,000–174,000 (~BDT 9.1L–52.5L total 3-yr tuition before 15%–75% merit waivers)',
    dhakaPrivateTrack: 'BDT 9.17 Lakh – 14.30 Lakh total tuition & institutional fees (EWU, NSU, AIUB)',
    westernTrack: '~BDT 54 Lakh – 3.2+ Crore total tuition over 3–4 years (before rare scholarships)',
    winnerVerdict: 'China University Scholarships beat Western tuition by 80%–100% and rival or beat Dhaka Category-A fees.',
  },
  {
    factor: 'Campus Infrastructure, Labs & Dormitories',
    chinaTrack: 'Residential university towns, national key STEM/AI labs, libraries & on-campus dorms (CNY 1,300–11,000/yr)',
    malaysiaTrack: 'Modern integrated international campuses in Greater KL & Selangor with tech/hospitality hubs',
    dhakaPrivateTrack: 'Urban commuter campuses with no residential campus town or national R&D lab scale',
    westernTrack: 'High-grade research campuses with separate high housing costs',
    winnerVerdict: 'China offers research-university campuses & residential dorms at a fraction of Dhaka private cost.',
  },
  {
    factor: 'Technology, Engineering & Business Ecosystem',
    chinaTrack: 'Direct exposure to AI, robotics, semiconductors, EV, clean tech & global supply-chain hubs',
    malaysiaTrack: 'ASEAN digital/FinTech hub with corporate co-ops and UK/Australian curricula',
    dhakaPrivateTrack: 'Strong local corporate alumni network inside Bangladesh’s domestic market',
    westernTrack: 'Mature Western employer markets with strict visa & sponsorship hurdles',
    winnerVerdict: 'China immerses STEM & business undergraduates directly inside the world’s manufacturing & AI engine.',
  },
  {
    factor: 'Post-Bachelor Global Master’s & Career Leverage',
    chinaTrack: 'MoE-accredited Bachelor qualifies for UK, USA, Australia, NZ & EU Master’s + China K-Visa STEM route—with saved capital',
    malaysiaTrack: 'Seamless progression to UK/AU Master’s or 1+2 / 2+1 undergraduate credit transfer',
    dhakaPrivateTrack: 'Eligible for overseas Master’s, but requires funding both local Bachelor + full overseas Master’s',
    westernTrack: 'Direct local job-search visas (e.g., UK 18-month Graduate Route from Jan 2027), at steep upfront debt/capital outlay',
    winnerVerdict: 'Preserve undergraduate capital in China or Malaysia, then fund a top UK/US/AU Master’s with ease.',
  },
] as const;

export const BD_VS_CHINA_WIN_CARDS = [
  {
    badge: 'Global Rank Upgrade',
    metric: 'World Top 100 – 650',
    title: 'Replace Local Private Ranking With Global Prestige',
    detail:
      'Top Chinese universities in our live dataset hold verified ShanghaiRanking, QS, and THE global top-100 to top-650 positions, compared with domestic private campuses in Dhaka.',
  },
  {
    badge: 'Tuition Advantage',
    metric: 'BDT 9.2L–14.3L vs CNY 0–25k/yr',
    title: 'University Scholarships Match or Beat Dhaka Fees',
    detail:
      'NSU, EWU, and AIUB require BDT 9.17–14.30 lakh in 4-year tuition and institutional fees. Qualified A-Level and HSC students can win University Scholarships in China lowering annual tuition to CNY 0–18,000/yr (living separated).',
  },
  {
    badge: 'Campus & Masterplan',
    metric: 'Research Campus → Global Master’s',
    title: 'Residential Labs Now, Western Master’s Later',
    detail:
      'Students live on purpose-built university towns with national engineering labs, graduate debt-light, and remain eligible for Master’s or PhD study in the UK, USA, Australia, or Europe.',
  },
] as const;

export const BD_VS_CHINA_PROOF_ROWS = [
  {
    criterion: 'University Ranking & Research Reputation (QS World 2027)',
    bangladeshPrivate: 'NSU (QS #901–950), BRAC (#1001–1200), AIUB (#1401+), and EWU (not listed in QS 2027) hold strong domestic private recognition in Bangladesh.',
    chinaRanked: 'Zhejiang (QS #47), HIT (QS #190), Tianjin (QS #235), Sichuan (QS #300), SCUT (QS #=342), Dalian UT (QS #463), Zhengzhou (QS #=581), NUAA (QS #721–730).',
    winReason: 'Immediate jump into a globally ranked, state-backed Project 985 / 211 / Double First-Class university brand.',
  },
  {
    criterion: '4-Year Tuition & Mandatory Academic Fees (Living Separated)',
    bangladeshPrivate: 'EWU ~BDT 9.17L–10.03L · NSU ~BDT 10.56L–12.00L · AIUB ~BDT 10.80L–14.30L (4-yr BBA/CSE tuition + admission/lab fees).',
    chinaRanked: 'CNY 0/yr (with 100% entrance/merit waiver where awarded) or CNY 4,250–25,000/yr; total 4-yr net tuition often rivals or stays below Dhaka private fees.',
    winReason: 'Families pay equal or lower academic tuition while upgrading to an international research university.',
  },
  {
    criterion: 'Campus Facilities, Labs & Student Housing',
    bangladeshPrivate: 'Urban commuter buildings in Dhaka without residential dorm towns or comparable national engineering infrastructure.',
    chinaRanked: 'Full university cities with AI/robotics/engineering labs, libraries, sports stadiums, and gated international dorms (CNY 1,300–11,000/yr).',
    winReason: 'True residential campus life, lab exposure, and zero Dhaka traffic commute.',
  },
  {
    criterion: 'Subject Focus & Technology Ecosystem',
    bangladeshPrivate: 'Classroom theory focused on local service-sector and private-enterprise hiring.',
    chinaRanked: 'English-taught CS, AI, Integrated Circuits, Mechanical/Civil Engineering & International Trade inside the world’s top manufacturing and tech hub.',
    winReason: 'Direct academic exposure to high-growth global STEM and supply-chain industries.',
  },
  {
    criterion: 'Post-Graduation Mobility (Master’s & Career)',
    bangladeshPrivate: 'Eligible for foreign Master’s later, after already spending BDT 9–14L+ locally.',
    chinaRanked: 'MoE-accredited 4-year Bachelor accepted for UK, USA, Australia, NZ & EU Master’s—plus China STEM K-Visa and global corporate opportunities.',
    winReason: 'Graduate with an international degree and apply straight to top global postgraduate programs.',
  },
] as const;

export const BD_VS_ABROAD_WIN_CARDS = [
  {
    badge: 'O-Level Speed Win',
    metric: '1 to 2 Years Saved',
    title: 'Skip Pre-University Delays via Malaysia or China 3+2',
    detail:
      'Instead of 2 extra years for A-Levels/HSC plus 4 years in Dhaka, O-Level & SSC students start Foundation/Diploma in Malaysia (4 yrs total to Bachelor) or 3+2 in China (5 yrs total).',
  },
  {
    badge: 'Smart Capital Allocation',
    metric: '65% – 95% Tuition Variance',
    title: 'Choose High-ROI Study Destinations Over Blind Debt',
    detail:
      'Comparing Dhaka private fees against China, Malaysia, European tuition routes (Hungary/Finland), and Western benchmarks stops families from overpaying BDT 1–3 crore unnecessarily.',
  },
  {
    badge: 'Global Credential Value',
    metric: 'UK / AU / EU / China Mobility',
    title: 'Earn Internationally Portable Degrees Early',
    detail:
      'Branch campuses in Malaysia, UK 3-year Honours, European public degrees, and ranked Chinese universities deliver stronger international employer and Master’s recognition than local commuter degrees.',
  },
] as const;

export const BD_VS_ABROAD_DESTINATION_ROWS = [
  {
    destination: 'Bangladesh (Stay Home: A-Level + Dhaka Category-A Private)',
    serviceNote: 'Local Baseline (NSU, EWU, AIUB)',
    duration: '2 yrs A-Level/HSC + 4 yrs Bachelor (6 yrs)',
    tuitionOnly: 'A-Level: BDT 4.8L–15L+ · Private Uni: BDT 9.17L–14.30L (4 yrs)',
    livingSeparated: 'Family home or Dhaka rent/commute (borne separately)',
    winOrTradeoff: 'Familiar local environment, but longest timeline (6 yrs) and no international degree or global campus ranking.',
  },
  {
    destination: 'Malaysia (Active EduExpress Service · BDT 0 Agency Fee)',
    serviceNote: 'O-Level Foundation/Diploma + UK/AU Branch & Dual Degrees',
    duration: '1-yr Foundation + 3-yr Bachelor (4 yrs after O-Level)',
    tuitionOnly: 'Foundation: RM 15k–36k · Bachelor: RM 10k–58k/yr (15%–75% merit waivers available)',
    livingSeparated: 'RM 1,200 – 2,000 / month (~BDT 36.2k–60.4k/mo at 30.20 BDT/MYR)',
    winOrTradeoff: 'WIN: Saves 2 years after O-Levels and awards identical Monash (#31*), Nottingham (#97*), Heriot-Watt (#325*) or UK dual degrees at ~1/3 Western tuition.',
  },
  {
    destination: 'China (Flagship EduExpress Service · Visa-First)',
    serviceNote: '3+2 Diploma after SSC/O-Level or 4-Yr Ranked Bachelor',
    duration: '5 yrs after SSC/O-Level (3+2) or 4 yrs after A-Level/HSC',
    tuitionOnly: 'Diploma tiers: CNY 0–8k/yr · Bachelor w/ University Scholarships: CNY 0–25k/yr',
    livingSeparated: 'Campus dorms CNY 1,300–11,000/yr + food/personal ~CNY 800–1,400/mo (separated)',
    winOrTradeoff: 'WIN: Highest scholarship support at global top-100–650 campuses with top STEM/business labs.',
  },
  {
    destination: 'United Kingdom (Active EduExpress Service)',
    serviceNote: 'Direct 3-Yr Honours / Foundation / 1-Yr Master’s',
    duration: '3 yrs Bachelor (after A-Level) · 1 yr Master’s',
    tuitionOnly: '£12,000 – £38,000 / year (~BDT 18L – 58L / yr)',
    livingSeparated: '£10,800 – £14,100 / year (~BDT 16L – 22L / yr)',
    winOrTradeoff: 'Fastest Western degree (3-yr Bachelor, 1-yr Master’s) & Graduate Route (18 months from Jan 2027), at higher GBP cost.',
  },
  {
    destination: 'Europe & Regional Active Routes (Hungary, Finland, Cyprus, Croatia, Georgia, South Korea)',
    serviceNote: 'Active EduExpress Services',
    duration: '3 – 4 yrs Bachelor (5–6 yrs MBBS in Georgia)',
    tuitionOnly: 'Hungary €3,000–€6,000/yr · Finland €6,000–€12,000/yr · Cyprus €2,500–€4,500/yr · Georgia MBBS $4,500–$6,500/yr',
    livingSeparated: 'Finland €800/mo (€9,600/yr Migri benchmark) · Hungary €400–€600/mo · Cyprus €300–€400/mo · Georgia $300–$500/mo',
    winOrTradeoff: 'English-taught European and East Asian public, engineering, and medical programs well below UK/US/AU tuition.',
  },
  {
    destination: 'USA, Australia & New Zealand (Financial Benchmarks)',
    serviceNote: 'Benchmark & Malaysia Transfer / Post-Bachelor Master’s Targets',
    duration: '3 – 4 yrs Bachelor',
    tuitionOnly: 'USA: $20k–$65k+/yr · Australia: AUD 25k–50k/yr · NZ: NZD 28k–45k/yr',
    livingSeparated: 'USA: $12k–$22k/yr · Australia: AUD 24k–32k/yr · NZ: NZD 18k–24k/yr',
    winOrTradeoff: 'Top global brands but steep BDT 1–3+ Cr cost; best accessed via Malaysia 1+2 transfer or post-China Master’s.',
  },
] as const;

export type RankedChinaBachelorRow = {
  slug: string;
  name: string;
  city: string;
  worldRankLabel: string | null;
  nationalRankLabel: string | null;
  rankSort: number;
  englishPrograms: string[];
  bachelorTuition: string;
  universityScholarship: string;
  hostelFee: string;
  officialUrl?: string;
  lastVerifiedAt?: string;
};

const RANK_FALLBACK_SLUGS = [
  'zhejiang-university',
  'sichuan-university',
  'hitsz',
  'hit-harbin',
  'tianjin-university',
  'scut',
  'dalian-university-of-technology',
  'china-university-of-petroleum-east-china',
  'xidian-university',
  'nanchang-university',
  'tiangong-university',
  'hubei-university-of-technology',
  'jiangsu-university-of-science-and-technology',
];

function parseNumericRank(rank?: string | null): number {
  if (!rank) return 99999;
  const match = rank.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 99999;
}

function formatRankingBadge(ranking: UniversityRanking | undefined): string | null {
  if (!ranking) return null;
  const prefix = ranking.scope === 'national' ? `${ranking.publisher} China #` : `${ranking.publisher} World #`;
  return `${prefix}${ranking.rank} (${ranking.year})`;
}

/**
 * Pulls live active Chinese universities from the EduExpress catalog that offer
 * English-taught non-MBBS Bachelor's programs and recorded University / Provincial /
 * Belt & Road scholarships (excluding standalone CSC-only entries), ranked by
 * verified global/national position.
 */
export const getTopChinaScholarshipUniversities = cache(async (limit = 10): Promise<RankedChinaBachelorRow[]> => {
  try {
    const records = await getUniversityRecords('China');
    const candidates = records.filter(record => {
      if (!record.isActive) return false;
      const hasEnglishBachelor = record.programs.some(
        program =>
          /bachelor/i.test(program.level) &&
          !/mbbs|clinical medicine/i.test(program.name) &&
          program.languages.some(lang => /english/i.test(lang)),
      );
      const hasNonCscAward = record.scholarships.some(
        scholarship => !/\bcsc\b|chinese government scholarship/i.test(scholarship.title),
      );
      return hasEnglishBachelor && hasNonCscAward;
    });

    const enriched = await Promise.all(
      candidates.map(async record => {
        const rankings = await getUniversityRankings(record.slug);
        const worldRank = rankings.find(r => r.scope === 'world');
        const nationalRank = rankings.find(r => r.scope === 'national');
        const worldSort = worldRank ? parseNumericRank(worldRank.rank) : 99999;
        const nationalSort = nationalRank ? parseNumericRank(nationalRank.rank) + 2000 : 99999;
        const fallbackBoost = RANK_FALLBACK_SLUGS.includes(record.slug) ? 0 : 10000;

        const bachelorProgs = record.programs.filter(
          program =>
            /bachelor/i.test(program.level) &&
            !/mbbs|clinical medicine/i.test(program.name) &&
            program.languages.some(lang => /english/i.test(lang)),
        );
        const uniScholarships = record.scholarships.filter(
          scholarship => !/\bcsc\b|chinese government scholarship/i.test(scholarship.title),
        );
        const hostelRecord = record.fees.find(fee => /hostel|dorm|accom/i.test(fee.item));

        const primaryTuition =
          bachelorProgs.find(p => p.tuitionAfterScholarship)?.tuitionAfterScholarship ||
          bachelorProgs.find(p => p.tuition)?.tuition ||
          record.details.tuition;

        const scholarshipLabels = uniScholarships
          .slice(0, 2)
          .map(s => (s.amount ? `${s.title} (${s.amount})` : s.coverage ? `${s.title} — ${s.coverage}` : s.title))
          .join(' · ');

        const hasExplicitAwardDetail =
          uniScholarships.some(s => Boolean(s.amount || s.coverage)) ||
          /free|after scholarship/i.test(primaryTuition);
        const detailPriority = hasExplicitAwardDetail ? 0 : 300;

        return {
          slug: record.slug,
          name: record.name,
          city: record.city,
          worldRankLabel: formatRankingBadge(worldRank),
          nationalRankLabel: formatRankingBadge(nationalRank),
          rankSort: Math.min(worldSort, nationalSort) + fallbackBoost + detailPriority,
          englishPrograms: Array.from(new Set(bachelorProgs.map(p => p.name))).slice(0, 3),
          bachelorTuition: primaryTuition,
          universityScholarship: scholarshipLabels || 'University / Provincial Merit Scholarship',
          hostelFee: hostelRecord?.cost || 'Confirm dorm category on profile',
          officialUrl: record.officialUrl,
          lastVerifiedAt: record.lastVerifiedAt,
        } satisfies RankedChinaBachelorRow;
      }),
    );

    return enriched
      .filter(row => row.worldRankLabel || row.nationalRankLabel)
      .sort((a, b) => a.rankSort - b.rankSort)
      .slice(0, limit);
  } catch {
    return [];
  }
});

export const getMalaysiaPathwayRecords = cache(async (): Promise<CleanUniversityRecord[]> => {
  try {
    const records = await getUniversityRecords('Malaysia');
    return records.filter(record => record.isActive);
  } catch {
    return [];
  }
});
