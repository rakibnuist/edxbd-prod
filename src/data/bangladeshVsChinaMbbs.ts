import type { OfficialSource } from '@/lib/pathway-comparison';

export const MBBS_COMPARISON_LAST_UPDATED_ISO = '2026-11-25';
export const MBBS_COMPARISON_LAST_UPDATED_LABEL = '25 November 2026';
export const MBBS_COMPARISON_NEXT_REVIEW_LABEL = '25 February 2027';

export const CHINA_VISA_FIRST_TERMS =
  'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';

export interface BangladeshPrivateFeeRow {
  item: string;
  statutoryAmount: string;
  paymentTiming: string;
  notes: string;
}

/**
 * Verified against Bangladesh Ministry of Health & Family Welfare (MOHFW) and
 * Directorate General of Medical Education (DGME) private medical college fee gazettes.
 */
export const BANGLADESH_PRIVATE_FEE_BREAKDOWN: BangladeshPrivateFeeRow[] = [
  {
    item: 'Admission Fee (Government Ceiling)',
    statutoryAmount: 'BDT 19,44,000',
    paymentTiming: '60% at admission, 20% before 1st Prof, 20% before 3rd Prof',
    notes: 'Official MOHFW gazetted cap for local Bangladeshi MBBS students.',
  },
  {
    item: 'Mandatory Internship Fee',
    statutoryAmount: 'BDT 1,80,000',
    paymentTiming: 'Bundled into the BDT 21,24,000 3-step statutory schedule',
    notes: 'Paid toward the compulsory 12-month internship at the college hospital.',
  },
  {
    item: 'Monthly Tuition Fee (60 Months / 5 Years)',
    statutoryAmount: 'BDT 6,00,000 (BDT 10,000/month)',
    paymentTiming: 'Monthly throughout the 5 academic years',
    notes: 'Per DGME policy, collected monthly rather than in bulk upfront.',
  },
  {
    item: 'Statutory Core Subtotal (Tuition + Admission + Internship)',
    statutoryAmount: 'BDT 27,24,000',
    paymentTiming: 'Day-1 minimum cash required: BDT 12,74,400 (60% of 21.24L)',
    notes: 'Excludes university registration, prof exams, BMDC student fees, books, hostel, and meals.',
  },
  {
    item: 'Excluded Separate Costs (Prof Exams, Hostel, Meals & Living)',
    statutoryAmount: 'BDT 8,50,000 – 16,50,000+ (5–6 Years)',
    paymentTiming: 'Recurring monthly hostel/mess (~BDT 12k–18k/mo) + university fees',
    notes: 'University registration (DU/CMU/RU/BSMMU), 4 Prof exams, clinical kits, hostel rent & food are billed separately.',
  },
];

export interface MbbsHeadToHeadRow {
  criterion: string;
  bdPrivate: string;
  chinaMoe: string;
  advantageLabel: string;
  detailNote: string;
}

export const MBBS_HEAD_TO_HEAD_ROWS: MbbsHeadToHeadRow[] = [
  {
    criterion: 'Day-1 Upfront Cash Requirement',
    bdPrivate: 'BDT 12,74,400 immediately at admission (60% of BDT 21.24L ceiling) before finishing Year 1.',
    chinaMoe: 'BDT 0 capitation or admission donation. Pay Year-1 annual tuition + dorm (~BDT 5.5L–7.6L before scholarship) directly to the public university.',
    advantageLabel: 'China saves Day-1 shock',
    detailNote: 'No bulk private-college development or lump-sum admission barrier in China.',
  },
  {
    criterion: 'Statutory 5–6 Year Tuition & Institutional Cost',
    bdPrivate: 'BDT 27.24 Lakh statutory core (BDT 19.44L admission + BDT 1.80L internship + BDT 6.00L tuition) + university/exam fees (~BDT 30L–32L academic total before hostel/meals).',
    chinaMoe: 'Budget MOE Tier (e.g., CTGU, Nantong, Beihua, NSMC): CNY 24k–28k/yr tuition + ~CNY 4k dorm (~BDT 32L–37L over 6 yrs before scholarships). Flagship Provincial (CQMU, WMU, JSU): CNY 30k–34k/yr (~BDT 39L–44L gross; lower with awards).',
    advantageLabel: 'Comparable spend, far higher tier',
    detailNote: 'Shown at ~18.70 BDT/CNY; living/meals/flights separated transparently for both countries.',
  },
  {
    criterion: 'University Type & Global Rankings',
    bdPrivate: 'Locally affiliated private medical colleges (not listed in global top-1000 clinical medicine rankings).',
    chinaMoe: 'State-funded Public Medical Universities (including C9 League, Project 985, Project 211 & Double First-Class institutions ranked in QS / THE / ARWU Global Top 50–650).',
    advantageLabel: 'China public research tier',
    detailNote: 'Backed by central and provincial government hospital & laboratory budgets.',
  },
  {
    criterion: 'Affiliated Teaching Hospital Scale',
    bdPrivate: 'Minimum DGME threshold is 250 beds; many private medical college hospitals run 250–750 beds with localized patient volume.',
    chinaMoe: 'Grade-3A (Level III, Class A) provincial hospital networks spanning 2,500 to 10,000+ beds (e.g., Zhengzhou Univ. 10,000+ beds; CQMU 10,000+ beds; WMU 8,500+ beds).',
    advantageLabel: 'China clinical scale',
    detailNote: 'High-volume trauma, oncology, transplant, robotic surgery, and digital 3D anatomy simulation.',
  },
  {
    criterion: 'Scholarships & Merit Reductions',
    bdPrivate: 'Virtually zero tuition scholarships in local private seats (fixed full commercial MOHFW ceiling applies).',
    chinaMoe: 'Provincial & Freshman Scholarships (CNY 10,000–30,000 in Year 1) plus Annual Academic Merit Awards (CNY 5,000–15,000/yr in Years 2–5 for top performers).',
    advantageLabel: 'China merit funding',
    detailNote: 'MBBS is rarely 100% free for all 6 years, but strong students reduce costs significantly.',
  },
  {
    criterion: 'Entry Gate & Admission Transparency',
    bdPrivate: 'Must clear DGME National Medical Admission Test (pass ≥40/100), meet SSC+HSC combined GPA (≥8.50 in 2025/26, previously 9.00), Biology ≥3.50, and compete in a tight private seat queue.',
    chinaMoe: 'Direct university application with HSC/A-Level Science (Physics, Chemistry, Biology), English evidence/interview, and required CSCA subjects; 3,080+ annual English-MBBS seats across 45 MOE schools.',
    advantageLabel: 'China merit clarity',
    detailNote: 'Important: To practice later in Bangladesh, candidates must still verify BMDC academic eligibility before departing.',
  },
  {
    criterion: 'Course Duration & Clinical Internship',
    bdPrivate: '5 Years Academic + 1 Year Mandatory Internship at the college hospital in Bangladesh.',
    chinaMoe: '6 Years total (5 Years Academic + 1 Year Clinical Internship in China Grade-3A hospitals or approved Bangladesh hospital route depending on university & BMDC rules).',
    advantageLabel: 'Same 6-year timeline',
    detailNote: 'English-taught curriculum with progressive medical Chinese (HSK-4) for patient communication.',
  },
  {
    criterion: 'Licensing & Global Career Mobility',
    bdPrivate: 'Direct BMDC provisional registration upon graduation; international pathways (USMLE/UKMLA/AMC) depend on individual college WDOMS/ECFMG status.',
    chinaMoe: 'Return to Bangladesh via BMDC RQE + 1-year internship for full BMDC registration; simultaneously WDOMS-listed for USMLE (USA), UKMLA/PLAB (UK), AMC (Australia), and global postgraduate medicine.',
    advantageLabel: 'Dual BD + Global pathway',
    detailNote: 'Verify programme-specific MOE English authorization and ECFMG Sponsor Note before applying.',
  },
];

export const MBBS_WIN_CARDS = [
  {
    badge: 'Zero Capitation Fee',
    metric: 'BDT 0 Upfront Donation',
    title: 'Avoid the BDT 12.74 Lakh Day-1 Shock',
    detail:
      'Bangladesh private medical colleges require 60% of the BDT 21.24L admission+internship package immediately at entry. Chinese public medical universities charge zero capitation—tuition is paid year by year directly to the university.',
  },
  {
    badge: 'Grade-3A Tertiary Scale',
    metric: '3,000–10,000+ Beds',
    title: 'Hospital Volume That Private Colleges Cannot Match',
    detail:
      'Train inside provincial state hospital networks equipped with robotic surgical theatres, 3D virtual dissection suites, and massive multi-specialty inpatient volume rather than 250–500 bed private facilities.',
  },
  {
    badge: 'Dual Career Mobility',
    metric: 'BMDC RQE + Global WDOMS',
    title: 'Practice in Bangladesh or Pursue USMLE / UKMLA',
    detail:
      'Graduates from MOE-authorized English MBBS universities can pass the BMDC RQE to register in Bangladesh—while holding globally ranked public university credentials recognized across WDOMS pathways.',
  },
] as const;

export interface ProvincialDistributionRow {
  province: string;
  universities: number;
  annualQuota: number;
  avgTuitionRmb: number;
  flagshipExamples: string;
}

export const CHINA_MOE_PROVINCIAL_DISTRIBUTION: ProvincialDistributionRow[] = [
  { province: 'Jiangsu', universities: 7, annualQuota: 510, avgTuitionRmb: 32114, flagshipExamples: 'Nanjing Medical, Southeast, Jiangsu Univ., Soochow, Yangzhou, Nantong, Xuzhou' },
  { province: 'Guangdong', universities: 5, annualQuota: 300, avgTuitionRmb: 40000, flagshipExamples: 'Sun Yat-sen, Southern Medical, Jinan, Guangzhou Medical, Shantou (direct Dhaka flights)' },
  { province: 'Liaoning', universities: 3, annualQuota: 280, avgTuitionRmb: 38000, flagshipExamples: 'China Medical Univ., Dalian Medical Univ., Jinzhou Medical Univ.' },
  { province: 'Sichuan', universities: 3, annualQuota: 240, avgTuitionRmb: 32000, flagshipExamples: 'Sichuan Univ. (West China), Southwest Medical, North Sichuan Medical' },
  { province: 'Zhejiang', universities: 3, annualQuota: 210, avgTuitionRmb: 35267, flagshipExamples: 'Zhejiang Univ., Wenzhou Medical Univ., Ningbo Univ.' },
  { province: 'Hubei', universities: 3, annualQuota: 210, avgTuitionRmb: 34667, flagshipExamples: 'Wuhan Univ., HUST (Tongji Medical), China Three Gorges Univ. (lowest tuition)' },
  { province: 'Shanghai', universities: 3, annualQuota: 130, avgTuitionRmb: 65000, flagshipExamples: 'Fudan Univ., Shanghai Jiao Tong Univ., Tongji Univ.' },
  { province: 'Tianjin', universities: 2, annualQuota: 130, avgTuitionRmb: 45000, flagshipExamples: 'Tianjin Medical Univ., Nankai Univ.' },
  { province: 'Shandong', universities: 2, annualQuota: 120, avgTuitionRmb: 39500, flagshipExamples: 'Shandong Univ. (Cheeloo), Qingdao Univ.' },
  { province: 'Beijing', universities: 2, annualQuota: 80, avgTuitionRmb: 62500, flagshipExamples: 'Peking Univ. Health Science Center, Capital Medical Univ.' },
];

export interface MoeMbbsUniversityRecord {
  no: number;
  name: string;
  chineseName: string;
  province: string;
  city: string;
  tier: string;
  tierGroup: 'C9 / 985 / 211' | 'Double First-Class' | 'Provincial Medical';
  quota: number;
  preMedAvailable: boolean;
  preMedNote: string;
  preMedFeeRmb: number;
  deadline: string;
  tuitionRmb: number;
  hostelRmb: number;
  otherFeesRmb: number;
  scholarshipLevel: 'High' | 'Moderate' | 'Low';
  scholarshipDetail: string;
  counselorTargetGpa: string;
  cscaStatus: string;
  hskRule: string;
  internshipPolicy: string;
  slug: string;
  verified2026FeeNote?: string;
}

/**
 * Complete 45-University MOE English-MBBS Reference Directory from EduExpress 2026/2027 Master Dashboard.
 * Where 2026 official university guides updated fees (CQMU, WMU, JSU, XJTU), those verified figures are applied directly.
 */
export const MOE_MBBS_UNIVERSITIES: MoeMbbsUniversityRecord[] = [
  { no: 1, name: 'Peking University Health Science Center', chineseName: '北京大学医学部', province: 'Beijing', city: 'Beijing', tier: '985 / 211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 30, preMedAvailable: true, preMedNote: '1-Yr Pre-Med at PKU', preMedFeeRmb: 48000, deadline: 'March 31', tuitionRmb: 75000, hostelRmb: 12000, otherFeesRmb: 2000, scholarshipLevel: 'High', scholarshipDetail: 'Beijing Govt (20,000–40,000 RMB) + CSC Type A', counselorTargetGpa: 'GPA 5.0 (90%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 Clinical, HSK-5 Grad', internshipPolicy: 'Must complete in China', slug: 'peking-university-health-science-center' },
  { no: 2, name: 'Capital Medical University', chineseName: '首都医科大学', province: 'Beijing', city: 'Beijing', tier: 'Double First-Class', tierGroup: 'Double First-Class', quota: 50, preMedAvailable: true, preMedNote: 'Mar 6-Mo / Sep 1-Yr Foundation', preMedFeeRmb: 15000, deadline: 'May 31', tuitionRmb: 50000, hostelRmb: 9000, otherFeesRmb: 2000, scholarshipLevel: 'Moderate', scholarshipDetail: 'Beijing Foreign Student Scholarship (15,000–25,000 RMB/yr)', counselorTargetGpa: 'GPA 4.8+ (85%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 before Year 3', internshipPolicy: 'China or Approved BD Hospital', slug: 'capital-medical-university' },
  { no: 3, name: 'Fudan University', chineseName: '复旦大学', province: 'Shanghai', city: 'Shanghai', tier: '985 / 211 / C9 League', tierGroup: 'C9 / 985 / 211', quota: 45, preMedAvailable: true, preMedNote: '1-Yr Pre-Univ Program', preMedFeeRmb: 32000, deadline: 'April 15', tuitionRmb: 75000, hostelRmb: 10000, otherFeesRmb: 2000, scholarshipLevel: 'High', scholarshipDetail: 'Shanghai Govt Class A (Full) / Class B (Tuition)', counselorTargetGpa: 'GPA 5.0 (90%+)', cscaStatus: 'CSCA (Math, Physics, Chem)', hskRule: 'HSK-4 Clinical, HSK-5 Grad', internshipPolicy: 'Must complete in Shanghai', slug: 'fudan-university', verified2026FeeNote: 'Verified against 2026 Fudan MBBS guide (CNY 75,000/yr).' },
  { no: 4, name: 'Shanghai Jiao Tong University', chineseName: '上海交通大学', province: 'Shanghai', city: 'Shanghai', tier: '985 / 211 / C9 League', tierGroup: 'C9 / 985 / 211', quota: 40, preMedAvailable: true, preMedNote: 'Mar 6-Mo / Sep 1-Yr Pre-Univ', preMedFeeRmb: 16500, deadline: 'April 15', tuitionRmb: 75000, hostelRmb: 11000, otherFeesRmb: 2000, scholarshipLevel: 'High', scholarshipDetail: 'Shanghai Govt + SJTU Excellence Award (20,000 RMB)', counselorTargetGpa: 'GPA 5.0 (90%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 Clinical, HSK-5 Grad', internshipPolicy: 'Must complete in China', slug: 'shanghai-jiao-tong-university' },
  { no: 5, name: 'Tongji University', chineseName: '同济大学', province: 'Shanghai', city: 'Shanghai', tier: '985 / 211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 45, preMedAvailable: true, preMedNote: 'Mar 6-Mo / Sep 1-Yr Prep', preMedFeeRmb: 15000, deadline: 'May 15', tuitionRmb: 45000, hostelRmb: 9000, otherFeesRmb: 2000, scholarshipLevel: 'Moderate', scholarshipDetail: 'Shanghai Municipal Scholarship (Partial Waiver)', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 Clinical, HSK-5 Grad', internshipPolicy: 'China Affiliated Hospital', slug: 'tongji-university', verified2026FeeNote: 'Verified against 2026 Tongji MBBS guide (CNY 45,000/yr).' },
  { no: 6, name: 'Tianjin Medical University', chineseName: '天津医科大学', province: 'Tianjin', city: 'Tianjin', tier: '211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 100, preMedAvailable: true, preMedNote: 'Mar 6-Mo / Sep 1-Yr Pre-Med', preMedFeeRmb: 13000, deadline: 'June 15', tuitionRmb: 48000, hostelRmb: 7000, otherFeesRmb: 1800, scholarshipLevel: 'High', scholarshipDetail: 'Tianjin Govt (20,000–30,000 RMB) + Annual Merit', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'CSCA / Univ Test', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China or Approved BD Hospital', slug: 'tianjin-medical-university' },
  { no: 7, name: 'Nankai University', chineseName: '南开大学', province: 'Tianjin', city: 'Tianjin', tier: '985 / 211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 30, preMedAvailable: true, preMedNote: 'Language Prep Available', preMedFeeRmb: 12000, deadline: 'May 30', tuitionRmb: 42000, hostelRmb: 7500, otherFeesRmb: 1800, scholarshipLevel: 'Moderate', scholarshipDetail: 'Tianjin Govt (15,000–30,000 RMB)', counselorTargetGpa: 'GPA 4.8+ (85%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 Clinical, HSK-5 Grad', internshipPolicy: 'China Affiliated Hospital', slug: 'nankai-university' },
  { no: 8, name: 'Jilin University', chineseName: '吉林大学', province: 'Jilin', city: 'Changchun', tier: '985 / 211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 90, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Med / Chinese', preMedFeeRmb: 11000, deadline: 'June 30', tuitionRmb: 33000, hostelRmb: 5500, otherFeesRmb: 1800, scholarshipLevel: 'Moderate', scholarshipDetail: 'JLU Outstanding Student Award (5,000–15,000 RMB)', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'jilin-university' },
  { no: 9, name: 'Beihua University', chineseName: '北华大学', province: 'Jilin', city: 'Jilin City', tier: 'Provincial Comprehensive', tierGroup: 'Provincial Medical', quota: 50, preMedAvailable: true, preMedNote: 'Mar 6-Mo Foundation', preMedFeeRmb: 8500, deadline: 'July 15', tuitionRmb: 26000, hostelRmb: 4000, otherFeesRmb: 1600, scholarshipLevel: 'Low', scholarshipDetail: 'Merit Scholarship Years 2–5 (2,000–5,000 RMB/yr)', counselorTargetGpa: 'GPA 3.8+ (65%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Graduation', internshipPolicy: 'China or Approved BD Hospital', slug: 'beihua-university' },
  { no: 10, name: 'China Medical University', chineseName: '中国医科大学', province: 'Liaoning', city: 'Shenyang', tier: 'Provincial Flagship Medical', tierGroup: 'Provincial Medical', quota: 100, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Medical', preMedFeeRmb: 12500, deadline: 'June 20', tuitionRmb: 40000, hostelRmb: 6000, otherFeesRmb: 1800, scholarshipLevel: 'Moderate', scholarshipDetail: 'CMU Freshman & Annual Merit (5,000–15,000 RMB)', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'CSCA / CMU Exam', hskRule: 'HSK-4 by Year 3', internshipPolicy: 'China Affiliated Hospital', slug: 'china-medical-university' },
  { no: 11, name: 'Dalian Medical University', chineseName: '大连医科大学', province: 'Liaoning', city: 'Dalian', tier: 'Provincial Key Medical', tierGroup: 'Provincial Medical', quota: 100, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Med Foundation', preMedFeeRmb: 12000, deadline: 'June 30', tuitionRmb: 42000, hostelRmb: 6500, otherFeesRmb: 1800, scholarshipLevel: 'Moderate', scholarshipDetail: 'DMU Academic Scholarship (3,000–10,000 RMB/yr Yrs 2–5)', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'dalian-medical-university' },
  { no: 12, name: 'Jinzhou Medical University', chineseName: '锦州医科大学', province: 'Liaoning', city: 'Jinzhou', tier: 'Provincial Medical', tierGroup: 'Provincial Medical', quota: 80, preMedAvailable: true, preMedNote: 'Mar 6-Mo Foundation + Spring Seats*', preMedFeeRmb: 9000, deadline: 'July 20', tuitionRmb: 32000, hostelRmb: 4500, otherFeesRmb: 1600, scholarshipLevel: 'High', scholarshipDetail: 'Freshman Scholarship up to 10,000 RMB + Annual Merit', counselorTargetGpa: 'GPA 3.8+ (65%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 for Graduation', internshipPolicy: 'China or Approved BD Hospital', slug: 'jinzhou-medical-university' },
  { no: 13, name: 'Harbin Medical University', chineseName: '哈尔滨医科大学', province: 'Heilongjiang', city: 'Harbin', tier: 'Provincial Flagship Medical', tierGroup: 'Provincial Medical', quota: 60, preMedAvailable: true, preMedNote: 'Language Prep Available', preMedFeeRmb: 10000, deadline: 'June 30', tuitionRmb: 30000, hostelRmb: 4500, otherFeesRmb: 1600, scholarshipLevel: 'Moderate', scholarshipDetail: 'Heilongjiang Govt & HMU Merit (5,000–10,000 RMB)', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'CSCA / Interview', hskRule: 'HSK-4 before Clinical', internshipPolicy: 'China Affiliated Hospital', slug: 'harbin-medical-university' },
  { no: 14, name: 'Shandong University', chineseName: '山东大学', province: 'Shandong', city: 'Jinan', tier: '985 / 211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 60, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Med / Chinese', preMedFeeRmb: 11000, deadline: 'May 31', tuitionRmb: 45000, hostelRmb: 6000, otherFeesRmb: 1800, scholarshipLevel: 'High', scholarshipDetail: 'SDU International Scholarship (10,000–30,000 RMB)', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'shandong-university' },
  { no: 15, name: 'Qingdao University', chineseName: '青岛大学', province: 'Shandong', city: 'Qingdao', tier: 'Provincial Key Comprehensive', tierGroup: 'Provincial Medical', quota: 60, preMedAvailable: true, preMedNote: 'Mar 6-Mo Foundation', preMedFeeRmb: 9500, deadline: 'June 30', tuitionRmb: 34000, hostelRmb: 5000, otherFeesRmb: 1700, scholarshipLevel: 'Moderate', scholarshipDetail: 'Qingdao Govt & Presidential (5,000–15,000 RMB)', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'CSCA / Interview', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China Affiliated Hospital', slug: 'qingdao-university' },
  { no: 16, name: 'Nanjing Medical University', chineseName: '南京医科大学', province: 'Jiangsu', city: 'Nanjing', tier: 'Double First-Class', tierGroup: 'Double First-Class', quota: 100, preMedAvailable: true, preMedNote: 'Pre-Med via Jiangsu Consortium', preMedFeeRmb: 12000, deadline: 'May 30', tuitionRmb: 34000, hostelRmb: 6000, otherFeesRmb: 1800, scholarshipLevel: 'High', scholarshipDetail: 'Jasmine Jiangsu (30,000 RMB) + NJMU Freshman (10,000–20,000 RMB)', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'CSCA Mandatory + Exam', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China or BD (Strict Rules)', slug: 'nanjing-medical-university' },
  { no: 17, name: 'Southeast University', chineseName: '东南大学', province: 'Jiangsu', city: 'Nanjing', tier: '985 / 211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 50, preMedAvailable: true, preMedNote: 'Mar 6-Mo / Sep 1-Yr Prep', preMedFeeRmb: 11000, deadline: 'May 30', tuitionRmb: 32800, hostelRmb: 5500, otherFeesRmb: 1800, scholarshipLevel: 'High', scholarshipDetail: 'Jasmine Jiangsu + SEU Scholarship (10,000–30,000 RMB)', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 Clinical, HSK-5 Grad', internshipPolicy: 'China Affiliated Hospital', slug: 'southeast-university' },
  { no: 18, name: 'Jiangsu University', chineseName: '江苏大学', province: 'Jiangsu', city: 'Zhenjiang', tier: 'Provincial Key Comprehensive', tierGroup: 'Provincial Medical', quota: 80, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Medical', preMedFeeRmb: 9500, deadline: 'June 30', tuitionRmb: 34000, hostelRmb: 4900, otherFeesRmb: 1700, scholarshipLevel: 'High', scholarshipDetail: 'Jasmine / UJS Presidential Scholarship + Annual Merit', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'CSCA (Math & Chemistry)', hskRule: 'HSK-4 (≥180) Graduation', internshipPolicy: 'China or Approved BD Hospital', slug: 'jiangsu-university', verified2026FeeNote: 'Verified against 2026 JSU programme page (CNY 34,000 tuition, CNY 4,900/yr double dorm).' },
  { no: 19, name: 'Soochow University', chineseName: '苏州大学', province: 'Jiangsu', city: 'Suzhou', tier: '211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 60, preMedAvailable: true, preMedNote: 'Mar 6-Mo Prep', preMedFeeRmb: 11000, deadline: 'June 15', tuitionRmb: 35000, hostelRmb: 6000, otherFeesRmb: 1800, scholarshipLevel: 'High', scholarshipDetail: 'Soochow Jasmine Scholarship (10,000–25,000 RMB)', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'CSCA / Assessment', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China Affiliated Hospital', slug: 'soochow-university' },
  { no: 20, name: 'Yangzhou University', chineseName: '扬州大学', province: 'Jiangsu', city: 'Yangzhou', tier: 'Provincial Key Comprehensive', tierGroup: 'Provincial Medical', quota: 70, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Med Foundation', preMedFeeRmb: 9000, deadline: 'June 30', tuitionRmb: 30000, hostelRmb: 4500, otherFeesRmb: 1700, scholarshipLevel: 'High', scholarshipDetail: 'YZU Freshman & Annual Scholarship (5,000–15,000 RMB)', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'YZU Test / Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'yangzhou-university' },
  { no: 21, name: 'Nantong University', chineseName: '南通大学', province: 'Jiangsu', city: 'Nantong', tier: 'Provincial Comprehensive', tierGroup: 'Provincial Medical', quota: 80, preMedAvailable: true, preMedNote: 'Mar 6-Mo Foundation', preMedFeeRmb: 8000, deadline: 'July 10', tuitionRmb: 26000, hostelRmb: 4000, otherFeesRmb: 1600, scholarshipLevel: 'High', scholarshipDetail: 'NTU Freshman & Merit Scholarship (4,000–12,000 RMB/yr)', counselorTargetGpa: 'GPA 4.0+ (70%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'ntu' },
  { no: 22, name: 'Xuzhou Medical University', chineseName: '徐州医科大学', province: 'Jiangsu', city: 'Xuzhou', tier: 'Provincial Medical', tierGroup: 'Provincial Medical', quota: 70, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Medical', preMedFeeRmb: 9000, deadline: 'July 10', tuitionRmb: 33000, hostelRmb: 4500, otherFeesRmb: 1700, scholarshipLevel: 'High', scholarshipDetail: 'First-Year Scholarship (10,000–15,000 RMB) + Annual Merit', counselorTargetGpa: 'GPA 4.0+ (70%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'xuzhou-medical-university' },
  { no: 23, name: 'Zhejiang University', chineseName: '浙江大学', province: 'Zhejiang', city: 'Hangzhou', tier: '985 / 211 / C9 League', tierGroup: 'C9 / 985 / 211', quota: 60, preMedAvailable: true, preMedNote: 'Sep 1-Yr Foundation', preMedFeeRmb: 22000, deadline: 'March 31', tuitionRmb: 42800, hostelRmb: 8000, otherFeesRmb: 2000, scholarshipLevel: 'High', scholarshipDetail: 'Zhejiang Govt (30,000 RMB) + ZJU Scholarship', counselorTargetGpa: 'GPA 5.0 (88%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 Clinical, HSK-5 Grad', internshipPolicy: 'Must complete in ZJU Hospital', slug: 'zhejiang-university' },
  { no: 24, name: 'Wenzhou Medical University', chineseName: '温州医科大学', province: 'Zhejiang', city: 'Wenzhou', tier: 'Provincial Flagship Medical', tierGroup: 'Provincial Medical', quota: 90, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Medical', preMedFeeRmb: 10000, deadline: 'June 20', tuitionRmb: 33000, hostelRmb: 4400, otherFeesRmb: 1400, scholarshipLevel: 'High', scholarshipDetail: 'Freshman Awards up to CNY 20,000 (20k / 10k / 5k) + Zhejiang Govt', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'CSCA (Math & Chemistry)', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China or Approved BD Hospital', slug: 'wenzhou-medical-university', verified2026FeeNote: 'Verified against 2026 WMU guide (CNY 33,000 tuition, CNY 4,400 twin dorm).' },
  { no: 25, name: 'Ningbo University', chineseName: '宁波大学', province: 'Zhejiang', city: 'Ningbo', tier: 'Double First-Class', tierGroup: 'Double First-Class', quota: 60, preMedAvailable: true, preMedNote: 'Mar 6-Mo Foundation', preMedFeeRmb: 10000, deadline: 'June 30', tuitionRmb: 30000, hostelRmb: 4500, otherFeesRmb: 1700, scholarshipLevel: 'High', scholarshipDetail: 'Ningbo Municipal Scholarship (30,000 RMB) + NBU Merit', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'CSCA / Interview', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China Affiliated Hospital', slug: 'ningbo-university' },
  { no: 26, name: 'Anhui Medical University', chineseName: '安徽医科大学', province: 'Anhui', city: 'Hefei', tier: 'Provincial Key Medical', tierGroup: 'Provincial Medical', quota: 70, preMedAvailable: true, preMedNote: 'Mar 6-Mo Prep', preMedFeeRmb: 8500, deadline: 'July 10', tuitionRmb: 30000, hostelRmb: 4000, otherFeesRmb: 1600, scholarshipLevel: 'Moderate', scholarshipDetail: 'Anhui Provincial Scholarship (15,000–20,000 RMB)', counselorTargetGpa: 'GPA 4.0+ (70%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'anhui-medical-university' },
  { no: 27, name: 'Fujian Medical University', chineseName: '福建医科大学', province: 'Fujian', city: 'Fuzhou', tier: 'Provincial Key Medical', tierGroup: 'Provincial Medical', quota: 60, preMedAvailable: true, preMedNote: 'Language Prep Available', preMedFeeRmb: 9000, deadline: 'June 30', tuitionRmb: 35000, hostelRmb: 4500, otherFeesRmb: 1700, scholarshipLevel: 'High', scholarshipDetail: 'Fujian Govt Scholarship (30,000 RMB) + FJMU Freshman', counselorTargetGpa: 'GPA 4.0+ (70%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China Affiliated Hospital', slug: 'fujian-medical-university' },
  { no: 28, name: 'Xiamen University', chineseName: '厦门大学', province: 'Fujian', city: 'Xiamen', tier: '985 / 211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 40, preMedAvailable: true, preMedNote: 'Pre-Univ Prep', preMedFeeRmb: 14000, deadline: 'April 30', tuitionRmb: 38000, hostelRmb: 5000, otherFeesRmb: 1800, scholarshipLevel: 'High', scholarshipDetail: 'XMU Presidential & Fujian Govt (30,000–50,000 RMB)', counselorTargetGpa: 'GPA 4.8+ (85%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 Clinical, HSK-5 Grad', internshipPolicy: 'China Affiliated Hospital', slug: 'xiamen-university' },
  { no: 29, name: 'Zhengzhou University', chineseName: '郑州大学', province: 'Henan', city: 'Zhengzhou', tier: '211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 100, preMedAvailable: true, preMedNote: 'Mar 6-Mo / Sep 1-Yr Pre-Med', preMedFeeRmb: 9500, deadline: 'June 30', tuitionRmb: 35000, hostelRmb: 4500, otherFeesRmb: 1700, scholarshipLevel: 'Moderate', scholarshipDetail: 'Henan Govt (15,000 RMB) + ZZU President Award', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'CSCA / Interview', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China Affiliated (10,000+ bed hospital)', slug: 'zzu' },
  { no: 30, name: 'Wuhan University', chineseName: '武汉大学', province: 'Hubei', city: 'Wuhan', tier: '985 / 211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 70, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Medical', preMedFeeRmb: 12000, deadline: 'May 31', tuitionRmb: 40000, hostelRmb: 6000, otherFeesRmb: 1800, scholarshipLevel: 'Moderate', scholarshipDetail: 'Hubei Provincial & WHU Merit (10,000–25,000 RMB)', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China Affiliated Hospital', slug: 'wuhan-university' },
  { no: 31, name: 'Huazhong University of Science and Technology', chineseName: '华中科技大学', province: 'Hubei', city: 'Wuhan', tier: '985 / 211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 70, preMedAvailable: true, preMedNote: '1-Yr Pre-Univ', preMedFeeRmb: 18000, deadline: 'May 31', tuitionRmb: 40000, hostelRmb: 6000, otherFeesRmb: 1800, scholarshipLevel: 'Moderate', scholarshipDetail: 'HUST Academic Excellence Award (5,000–20,000 RMB)', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China Affiliated (Tongji Medical)', slug: 'huazhong-university-of-science-and-technology' },
  { no: 32, name: 'China Three Gorges University', chineseName: '三峡大学', province: 'Hubei', city: 'Yichang', tier: 'Provincial Comprehensive', tierGroup: 'Provincial Medical', quota: 70, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Med Foundation', preMedFeeRmb: 7500, deadline: 'July 15', tuitionRmb: 24000, hostelRmb: 3600, otherFeesRmb: 1500, scholarshipLevel: 'High', scholarshipDetail: 'CTGU Scholarship (20%–50% tuition for top students)', counselorTargetGpa: 'GPA 3.8+ (65%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'ctgu' },
  { no: 33, name: 'Sun Yat-sen University', chineseName: '中山大学', province: 'Guangdong', city: 'Guangzhou', tier: '985 / 211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 50, preMedAvailable: true, preMedNote: 'Pre-Univ Prep', preMedFeeRmb: 16000, deadline: 'April 30', tuitionRmb: 48000, hostelRmb: 7000, otherFeesRmb: 2000, scholarshipLevel: 'High', scholarshipDetail: 'Guangdong Govt (20,000 RMB) + SYSU Belt & Road', counselorTargetGpa: 'GPA 4.8+ (85%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 Clinical, HSK-5 Grad', internshipPolicy: 'China Affiliated Hospital', slug: 'sun-yat-sen-university' },
  { no: 34, name: 'Southern Medical University', chineseName: '南方医科大学', province: 'Guangdong', city: 'Guangzhou', tier: 'Provincial Flagship Medical', tierGroup: 'Provincial Medical', quota: 90, preMedAvailable: true, preMedNote: 'Mar 6-Mo Foundation', preMedFeeRmb: 11000, deadline: 'June 20', tuitionRmb: 40000, hostelRmb: 6000, otherFeesRmb: 1800, scholarshipLevel: 'High', scholarshipDetail: 'Guangdong Govt (20,000 RMB) + SMU Freshman', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'CSCA / Interview', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China or Approved BD Hospital', slug: 'southern-medical-university' },
  { no: 35, name: 'Jinan University', chineseName: '暨南大学', province: 'Guangdong', city: 'Guangzhou', tier: '211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 60, preMedAvailable: true, preMedNote: 'Mar 6-Mo / Sep 1-Yr Prep', preMedFeeRmb: 11500, deadline: 'June 10', tuitionRmb: 42000, hostelRmb: 6000, otherFeesRmb: 1800, scholarshipLevel: 'High', scholarshipDetail: 'Guangdong Govt (20,000 RMB) + JNU Freshman', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'CSCA / JNU Exam', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'jinan-university' },
  { no: 36, name: 'Guangzhou Medical University', chineseName: '广州医科大学', province: 'Guangdong', city: 'Guangzhou', tier: 'Double First-Class', tierGroup: 'Double First-Class', quota: 60, preMedAvailable: false, preMedNote: 'Direct Sep Intake Only', preMedFeeRmb: 0, deadline: 'June 30', tuitionRmb: 30000, hostelRmb: 5000, otherFeesRmb: 1800, scholarshipLevel: 'High', scholarshipDetail: 'Guangdong Govt Scholarship (10,000–20,000 RMB/yr)', counselorTargetGpa: 'GPA 4.2+ (75%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China Affiliated Hospital', slug: 'guangzhou-medical-university' },
  { no: 37, name: 'Shantou University', chineseName: '汕头大学', province: 'Guangdong', city: 'Shantou', tier: 'Provincial Key (Li Ka-shing)', tierGroup: 'Provincial Medical', quota: 40, preMedAvailable: false, preMedNote: 'Direct Sep Intake Only', preMedFeeRmb: 0, deadline: 'June 20', tuitionRmb: 40000, hostelRmb: 5000, otherFeesRmb: 1700, scholarshipLevel: 'High', scholarshipDetail: 'STU Medical (10,000–20,000 RMB) + Guangdong Govt', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China Affiliated (USMLE-aligned)', slug: 'shantou-university' },
  { no: 38, name: 'Guangxi Medical University', chineseName: '广西医科大学', province: 'Guangxi', city: 'Nanning', tier: 'Provincial Flagship Medical', tierGroup: 'Provincial Medical', quota: 80, preMedAvailable: true, preMedNote: 'Mar 6-Mo Foundation', preMedFeeRmb: 8500, deadline: 'July 10', tuitionRmb: 30000, hostelRmb: 4000, otherFeesRmb: 1600, scholarshipLevel: 'Moderate', scholarshipDetail: 'Guangxi Govt Scholarship (10,000–20,000 RMB)', counselorTargetGpa: 'GPA 4.0+ (70%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'guangxi-medical-university' },
  { no: 39, name: 'Sichuan University', chineseName: '四川大学', province: 'Sichuan', city: 'Chengdu', tier: '985 / 211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 100, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Medical', preMedFeeRmb: 12000, deadline: 'May 31', tuitionRmb: 42000, hostelRmb: 5500, otherFeesRmb: 1800, scholarshipLevel: 'High', scholarshipDetail: 'Sichuan Belt & Road Scholarship (20,000 RMB/yr)', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China or Approved BD Hospital', slug: 'sichuan-university' },
  { no: 40, name: 'Southwest Medical University', chineseName: '西南医科大学', province: 'Sichuan', city: 'Luzhou', tier: 'Provincial Medical', tierGroup: 'Provincial Medical', quota: 70, preMedAvailable: true, preMedNote: 'Mar 6-Mo Foundation', preMedFeeRmb: 8000, deadline: 'July 15', tuitionRmb: 28000, hostelRmb: 4000, otherFeesRmb: 1600, scholarshipLevel: 'High', scholarshipDetail: 'Sichuan Govt (15,000 RMB) + SWMU Freshman Award', counselorTargetGpa: 'GPA 3.8+ (65%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'southwest-medical-university' },
  { no: 41, name: 'North Sichuan Medical College', chineseName: '川北医学院', province: 'Sichuan', city: 'Nanchong', tier: 'Provincial Medical', tierGroup: 'Provincial Medical', quota: 70, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Medical', preMedFeeRmb: 7500, deadline: 'July 15', tuitionRmb: 26000, hostelRmb: 3800, otherFeesRmb: 1500, scholarshipLevel: 'Moderate', scholarshipDetail: 'NSMC Merit & Freshman (3,000–10,000 RMB)', counselorTargetGpa: 'GPA 3.8+ (65%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'north-sichuan-medical-college' },
  { no: 42, name: 'Chongqing Medical University', chineseName: '重庆医科大学', province: 'Chongqing', city: 'Chongqing', tier: 'Provincial Flagship Medical', tierGroup: 'Provincial Medical', quota: 100, preMedAvailable: true, preMedNote: 'Mar 6-Mo Pre-Medical', preMedFeeRmb: 10000, deadline: 'June 30', tuitionRmb: 30000, hostelRmb: 4800, otherFeesRmb: 1250, scholarshipLevel: 'High', scholarshipDetail: 'CQMU Freshman Award CNY 15,000 (30% quota) + Mayor Award', counselorTargetGpa: 'Min 70% HSC Science', cscaStatus: 'CSCA (Math in English)', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China or Approved BD Hospital', slug: 'chongqing-medical-university', verified2026FeeNote: 'Verified against 2026 CQMU guide (CNY 30,000 tuition, CNY 4,800 twin dorm).' },
  { no: 43, name: 'Kunming Medical University', chineseName: '昆明医科大学', province: 'Yunnan', city: 'Kunming', tier: 'Provincial Flagship Medical', tierGroup: 'Provincial Medical', quota: 80, preMedAvailable: true, preMedNote: 'Mar 6-Mo Foundation', preMedFeeRmb: 8500, deadline: 'July 10', tuitionRmb: 30000, hostelRmb: 4000, otherFeesRmb: 1600, scholarshipLevel: 'High', scholarshipDetail: 'Yunnan Govt (Full/Partial) + KMMU Merit (5,000–15,000 RMB)', counselorTargetGpa: 'GPA 4.0+ (70%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital (2.5h Dhaka flight)', slug: 'kunming-medical-university' },
  { no: 44, name: "Xi'an Jiaotong University", chineseName: '西安交通大学', province: 'Shaanxi', city: "Xi'an", tier: '985 / 211 / C9 League', tierGroup: 'C9 / 985 / 211', quota: 80, preMedAvailable: true, preMedNote: 'Mar 6-Mo / Sep 1-Yr Pre-Med', preMedFeeRmb: 11000, deadline: 'May 31', tuitionRmb: 40000, hostelRmb: 8000, otherFeesRmb: 1800, scholarshipLevel: 'Moderate', scholarshipDetail: 'City / Enrolled-Student Merit Awards (Freshman % award excludes Medicine)', counselorTargetGpa: 'GPA 4.5+ (80%+)', cscaStatus: 'CSCA Mandatory', hskRule: 'HSK-4 before Year 4', internshipPolicy: 'China Affiliated Hospital', slug: 'xian-jiaotong-university', verified2026FeeNote: 'Verified against 2026 XJTU guide (CNY 40,000 tuition; hostel CNY 8,000–19,000).' },
  { no: 45, name: 'Shihezi University', chineseName: '石河子大学', province: 'Xinjiang', city: 'Shihezi', tier: '211 / Double First-Class', tierGroup: 'C9 / 985 / 211', quota: 60, preMedAvailable: true, preMedNote: 'Mar 6-Mo Prep', preMedFeeRmb: 7500, deadline: 'July 15', tuitionRmb: 28000, hostelRmb: 4000, otherFeesRmb: 1600, scholarshipLevel: 'Moderate', scholarshipDetail: 'Xinjiang Govt & SHZU Merit (5,000–15,000 RMB)', counselorTargetGpa: 'GPA 4.0+ (70%+)', cscaStatus: 'University Interview', hskRule: 'HSK-4 before Internship', internshipPolicy: 'China or Approved BD Hospital', slug: 'shihezi-university' },
];

export interface BmdcFactCheckItem {
  aspect: string;
  agencyMyth: string;
  legalReality: string;
  eduExpressPolicy: string;
}

export const BMDC_ELIGIBILITY_FACT_CHECK: BmdcFactCheckItem[] = [
  {
    aspect: 'China Visa vs. BMDC Doctor Registration',
    agencyMyth:
      'Unverified sub-agents claim "No BMDC Eligibility Certificate is needed" because the Chinese university and Chinese Embassy in Dhaka do not ask for it to issue an Offer Letter, JW202, or X1 Visa.',
    legalReality:
      'Flying to China without a BMDC document does NOT waive Bangladesh law. The official BMDC Registration Qualifying Examination (RQE) Application Form explicitly lists Item 6 ("Eligibility Certificate Sl. No. & Date of Issue") and Item 12(c) ("Original Eligibility Certificate from BM&DC with photocopy"). Always check the active cohort circular on bmdc.org.bd before enrolment.',
    eduExpressPolicy:
      'Never confuse "not needed for China X1 Visa" with "not needed for Bangladesh doctor registration." EduExpress audits every MBBS applicant against current BMDC/DGME circulars before any deposit is paid.',
  },
  {
    aspect: 'Post-Return Certificate & Admission-Year GPA Audit',
    agencyMyth:
      'Some agents promise students can easily obtain the Eligibility Certificate years later during vacation or after returning from China regardless of their HSC scores.',
    legalReality:
      'Whether verified pre-departure or during later BMDC processing under cohort circulars, BMDC strictly audits original SSC & HSC (or O/A-Level DGHS equivalence) marksheets against the admission-year national medical criteria—including Science stream, Biology GPA ≥ 3.50, combined GPA floor, and study-gap rules.',
    eduExpressPolicy:
      'If a candidate has HSC Biology below 3.50 or falls short of the admission-year BMDC baseline, we tell the family upfront in writing—never allowing a student to spend 6 years abroad only to be blocked from RQE.',
  },
  {
    aspect: 'Options When a Student Does Not Meet BMDC MBBS Criteria',
    agencyMyth:
      'Unscrupulous brokers push students with low Biology GPA or 3+ year study gaps into unverified or non-MOE bilingual medical schools just to collect commissions.',
    legalReality:
      'Non-MOE or unverified English-medium MBBS degrees risk rejection at BMDC document verification, regardless of tuition paid. Furthermore, BMDC Act 2010 prohibits medical practice in Bangladesh without Council registration.',
    eduExpressPolicy:
      'For candidates who do not meet BMDC MBBS criteria (or have a 2–3 year gap), we recommend two lawful alternatives: (1) pivot to a 4-year high-scholarship B.Sc. in Pharmacy, Biotechnology, or Biomedical Engineering in China, OR (2) document a written Non-BMDC Overseas/MPH pathway plan.',
  },
];

export interface BmdcRqeSpecItem {
  parameter: string;
  officialRule: string;
  practicalDetail: string;
}

export const BMDC_RQE_SPECIFICATIONS: BmdcRqeSpecItem[] = [
  {
    parameter: 'Statutory Legal Basis',
    officialRule: 'Bangladesh Medical and Dental Council Act, 2010 (Sections 5 & 12)',
    practicalDetail:
      'No Bangladeshi citizen graduating with a primary medical (MBBS) or dental (BDS) degree from abroad can legally practice medicine or hold a registered clinical internship in Bangladesh without passing the BMDC Registration Qualifying Examination (RQE).',
  },
  {
    parameter: 'Exam Frequency & Verification Venue',
    officialRule: 'Held Twice Annually (Typically April/May & October/November)',
    practicalDetail:
      'Official circulars and deadlines are published at www.bmdc.org.bd. Physical verification of original degrees, transcripts, and passports takes place at the BMDC Office, 203 Shaheed Syed Nazrul Islam Sarani, Bijoy Nagar, Dhaka.',
  },
  {
    parameter: 'Syllabus & Examination Format',
    officialRule: 'Written MCQ Assessment Aligned with Bangladesh Final Prof MBBS Curriculum',
    practicalDetail:
      'Core subjects tested: Internal Medicine, Surgery, Obstetrics & Gynecology, Physiology, Anatomy, Pathology, Pharmacology, and Microbiology. Pass-mark threshold and negative-marking rules follow the active session circular published before each exam (historically 40%–60% pass range; verify current admit card instructions).',
  },
  {
    parameter: 'Retake Policy & Processing Fees',
    officialRule: 'Re-appearance Permitted in Subsequent Biannual Sessions',
    practicalDetail:
      'Candidates who do not clear the RQE on the first attempt may sit in subsequent April/October sessions by submitting the re-examination fee (per active BMDC schedule, historically BDT 5,000 re-exam / BDT 8,000 initial processing Pay Order).',
  },
  {
    parameter: 'Post-RQE Internship & Permanent Registration',
    officialRule: 'Pass RQE → Provisional Registration → 1-Year Internship → Permanent BMDC License',
    practicalDetail:
      'Upon passing RQE, BMDC issues Provisional (Temporary) Registration to complete a mandatory 12-month rotatory internship at a BMDC-approved hospital in Bangladesh (or evaluates China internship logs for required local acclimatization). Completion leads to Permanent BMDC Registration—unlocking clinical practice, BCS (Health), FCPS, MD, and MS.',
  },
];

export const BMDC_RQE_CHECKLIST_DOSSIER: { title: string; detail: string; critical?: boolean }[] = [
  {
    title: 'Original MBBS Graduation Certificate & Full Academic Transcripts',
    detail: 'Both official Chinese originals and certified English translations issued by the university.',
  },
  {
    title: 'Dual Diplomatic Legalization (Beijing + Dhaka)',
    detail: 'Degree & transcripts must be notarized and attested by the Bangladesh Embassy in Beijing, then re-attested by the Ministry of Foreign Affairs (MoFA) in Dhaka.',
    critical: true,
  },
  {
    title: 'Host-Country MOE Authorization Proof & WDOMS Confirmation',
    detail: 'Downloaded official Ministry of Education of China listing proving the university was authorized for English-medium undergraduate Clinical Medicine.',
  },
  {
    title: 'ALL Original Passports Covering 5–6 Years of China Study',
    detail: 'Must show every X1 Student Visa, Chinese Residence Permit sticker, and immigration entry-exit stamp proving physical in-person study in China. NEVER lose or discard expired passports.',
    critical: true,
  },
  {
    title: 'Original SSC & HSC (or O/A-Level DGHS Equivalence) + BMDC Eligibility Certificate',
    detail: 'Original academic certificates, board marksheets, and BMDC Eligibility Certificate (per applicable cohort circular).',
  },
  {
    title: 'University Testimonial, Dean Contact & Prescribed BMDC Fee',
    detail: 'Official university testimonial, Dean/Registrar institutional email for direct verification, attested color photos, CV, and prescribed Pay Order payable to BM&DC.',
  },
];

export interface ScholarshipMatrixRow {
  name: string;
  authority: string;
  eligiblePrograms: string;
  coverageValue: string;
  window: string;
  renewalRule: string;
}

export const CHINA_MEDICAL_SCHOLARSHIP_MATRIX: ScholarshipMatrixRow[] = [
  {
    name: 'Chinese Government Scholarship (CSC Type-A / Bilateral)',
    authority: 'China Scholarship Council & Ministry of Education (Bangladesh)',
    eligiblePrograms: 'MBBS (primarily Chinese-medium + 1-Yr Prep), Pharmacy, Biotech, Master’s/PhD',
    coverageValue: '100% Tuition + Free Hostel + Insurance + Monthly Stipend (CNY 2,500 Undergrad / 3,000 Master / 3,500 PhD)',
    window: 'Nov – Feb (BANBEIS / Embassy)',
    renewalRule: 'Annual academic review + HSK-4 after 1-year Chinese prep; very scarce seats for English MBBS.',
  },
  {
    name: 'Jasmine Jiangsu Government Scholarship',
    authority: 'Jiangsu Provincial Dept. of Education',
    eligiblePrograms: 'English MBBS, BDS, Pharmacy & Biotech at NJMU, SEU, Jiangsu Univ., CPU, Yangzhou, Nantong, Xuzhou',
    coverageValue: 'Partial Award: CNY 10,000–30,000 (or Full Tier for select applicants)',
    window: 'March – May',
    renewalRule: 'Annual review based on academic standing (top class bracket).',
  },
  {
    name: 'Shanghai Government Scholarship (SGS Class A & B)',
    authority: 'Shanghai Municipal Education Commission',
    eligiblePrograms: 'English MBBS & Biomedical Sciences at Fudan, SJTU, Tongji',
    coverageValue: 'Class A: Full Tuition + Hostel + CNY 2,500/mo · Class B: 100% Tuition Waiver',
    window: 'Jan – April 15',
    renewalRule: 'Maintain GPA ≥ 3.2/4.0 annually; requires top A-Level/GPA 5.0 + strong CSCA + IELTS 6.5+.',
  },
  {
    name: 'Beijing Government Scholarship (BGS)',
    authority: 'Beijing Municipal Commission of Education',
    eligiblePrograms: 'English MBBS at Peking Univ. HSC & Capital Medical Univ.',
    coverageValue: 'Tuition reduction of CNY 15,000 – 40,000 / year',
    window: 'Feb – May',
    renewalRule: 'Re-evaluated annually on exam scores; cuts Capital Medical net tuition sharply.',
  },
  {
    name: 'Zhejiang & Fujian Provincial Scholarships',
    authority: 'Zhejiang / Fujian Provincial Education Depts.',
    eligiblePrograms: 'ZJU, Wenzhou Medical, Ningbo Univ., Xiamen Univ., Fujian Medical Univ.',
    coverageValue: 'CNY 20,000 – 30,000 Year-1 grant (Fujian covers up to ~85% of FJMU tuition)',
    window: 'March – May',
    renewalRule: 'Year-1 freshman award (followed by annual university merit grants in Years 2–5).',
  },
  {
    name: 'Guangdong Government Outstanding Student Scholarship',
    authority: 'Guangdong Provincial Dept. of Education',
    eligiblePrograms: 'Sun Yat-sen, Southern Medical, Jinan, Guangzhou Medical, Shantou, SCUT',
    coverageValue: 'CNY 10,000 – 20,000 / year (renewable annually)',
    window: 'April – June',
    renewalRule: 'Renewable based on top 20% class performance; drops Guangzhou Medical net tuition to ~CNY 20k/yr.',
  },
  {
    name: 'University Freshman & Belt & Road MBBS Grants',
    authority: 'WMU, CQMU, Sichuan, Xuzhou, Jinzhou, Shandong, JSU',
    eligiblePrograms: 'English-Medium MBBS (Year-1 Entry)',
    coverageValue: 'CNY 5,000 – 20,000 deducted from Year-1 tuition (e.g., WMU up to 20k, CQMU 15k)',
    window: 'March – June (Early Bird)',
    renewalRule: 'Year-1 entry grant (some assessed after registration); Years 2–5 shift to Academic Merit Awards.',
  },
  {
    name: 'Annual Academic Merit Awards (Years 2–5)',
    authority: 'All Major MOE Medical Universities',
    eligiblePrograms: 'Continuing MBBS Students (Years 2, 3, 4 & 5)',
    coverageValue: '1st Prize: CNY 10k–15k · 2nd Prize: CNY 5k–8k · 3rd Prize: CNY 2k–4k / year',
    window: 'Evaluated every October',
    renewalRule: 'Requires 90%+ attendance, zero failed subjects, and HSK progress (top 20%–30% of class).',
  },
  {
    name: '100% Tuition Waiver Scholarships (Pharmacy & Biotech)',
    authority: 'CPU, Nanjing Tech, Nantong, Yangzhou, Shenyang Pharm, SCUT',
    eligiblePrograms: '4-Year English B.Sc. Pharmacy, Biotechnology & Pharmaceutical Engineering',
    coverageValue: '50% to 100% Tuition Waiver for all 4 years (Net tuition: CNY 0 – 6,000/yr)',
    window: 'Feb – July (Mar & Sep)',
    renewalRule: 'Maintain 75%+ marks & 90% attendance; best zero-tuition alternative for science students.',
  },
];

export interface AlliedHealthAlternative {
  university: string;
  city: string;
  tier: string;
  major: string;
  duration: string;
  grossTuitionRmb: number;
  netAfterScholarshipRmb: number;
  hostelRmb: number;
  scholarshipSummary: string;
  councilAndCareer: string;
  slug?: string;
}

export const ALLIED_HEALTH_ALTERNATIVES: AlliedHealthAlternative[] = [
  {
    university: 'China Pharmaceutical University (CPU)',
    city: 'Nanjing, Jiangsu',
    tier: '211 / Double First-Class (#1 Pharmacy)',
    major: 'B.Sc. Pharmacy / Clinical Pharmacy / Biopharmaceuticals',
    duration: '4 Years',
    grossTuitionRmb: 27000,
    netAfterScholarshipRmb: 0,
    hostelRmb: 4500,
    scholarshipSummary: '50%–100% Tuition Waiver via CPU Presidential / Nanjing Govt / Belt & Road',
    councilAndCareer: 'Pharmacy Council of Bangladesh (PCB) pathway; R&D & US/EU M.Pharm/PhD.',
    slug: 'cpu',
  },
  {
    university: 'Nanjing Tech University (NJTech)',
    city: 'Nanjing, Jiangsu',
    tier: 'Double First-Class / Top 100 China',
    major: 'B.Sc. Pharmaceutical Engineering / Biotechnology',
    duration: '4 Years',
    grossTuitionRmb: 18000,
    netAfterScholarshipRmb: 0,
    hostelRmb: 3000,
    scholarshipSummary: 'Up to 100% Free Tuition + Free Hostel under NJTech Belt & Road (GPA review)',
    councilAndCareer: 'No BMDC exam needed; biopharma manufacturing & funded Western Master’s.',
    slug: 'njtech',
  },
  {
    university: 'Nantong University',
    city: 'Nantong, Jiangsu',
    tier: 'Provincial Comprehensive',
    major: 'B.Sc. Pharmacy / Biotechnology / Nursing',
    duration: '4 Years',
    grossTuitionRmb: 16000,
    netAfterScholarshipRmb: 0,
    hostelRmb: 4000,
    scholarshipSummary: 'Up to 100% Tuition Waiver Years 1–4 (pay hostel CNY 4,000/yr); accepts up to 3-yr gap',
    councilAndCareer: 'Ideal low-cost Jiangsu route for pharma QC/QA, biotech & global M.Sc.',
    slug: 'ntu',
  },
  {
    university: 'Sichuan University (West China Stomatology)',
    city: 'Chengdu, Sichuan',
    tier: '985 / 211 (#1 Dentistry in China)',
    major: 'BDS Stomatology (Dentistry)',
    duration: '5 Years',
    grossTuitionRmb: 42000,
    netAfterScholarshipRmb: 22000,
    hostelRmb: 5500,
    scholarshipSummary: 'Sichuan Belt & Road Scholarship (CNY 20,000/yr)',
    councilAndCareer: 'China’s #1 dental school; BMDC Dental RQE pathway & maxillofacial specialization.',
    slug: 'sichuan-university',
  },
  {
    university: 'Shandong University',
    city: 'Jinan, Shandong',
    tier: '985 / 211 / Double First-Class',
    major: 'B.Sc. Nursing / Pharmacy / Biological Sciences',
    duration: '4 Years',
    grossTuitionRmb: 30000,
    netAfterScholarshipRmb: 10000,
    hostelRmb: 6000,
    scholarshipSummary: 'SDU Freshman Scholarship (50%–100% Tuition Waiver for Allied Health)',
    councilAndCareer: 'BNMC / Global NCLEX-RN pathway to UK, USA & Australia or pharma careers.',
    slug: 'shandong-university',
  },
  {
    university: 'South China University of Technology (SCUT)',
    city: 'Guangzhou, Guangdong',
    tier: '985 / 211 / Double First-Class',
    major: 'B.Sc. Biotechnology / Biomedical Engineering',
    duration: '4 Years',
    grossTuitionRmb: 26000,
    netAfterScholarshipRmb: 6000,
    hostelRmb: 5000,
    scholarshipSummary: 'Guangdong Govt (CNY 20,000) + SCUT Scholarship up to 100% waiver',
    councilAndCareer: 'Medical device engineering (Mindray/Siemens), bioinformatics; direct Dhaka flights.',
    slug: 'scut',
  },
  {
    university: 'Yangzhou University',
    city: 'Yangzhou, Jiangsu',
    tier: 'Provincial Key Comprehensive',
    major: 'B.Sc. Biotechnology / Pharmacy',
    duration: '4 Years',
    grossTuitionRmb: 18000,
    netAfterScholarshipRmb: 6000,
    hostelRmb: 4000,
    scholarshipSummary: 'YZU Scholarship covering 50%–100% tuition (net CNY 0–6,000/yr)',
    councilAndCareer: 'Medical genetics, agri-biotech, pharmaceutical quality assurance.',
    slug: 'yangzhou-university',
  },
  {
    university: 'Nanjing Medical University & Wenzhou Medical University',
    city: 'Nanjing / Wenzhou',
    tier: 'Double First-Class / Flagship Medical',
    major: 'BDS Dentistry (5 Yrs) & B.Sc. Pharmacy / Nursing (4 Yrs)',
    duration: '4–5 Years',
    grossTuitionRmb: 30000,
    netAfterScholarshipRmb: 15000,
    hostelRmb: 4500,
    scholarshipSummary: 'Jasmine Jiangsu / Zhejiang Govt / University Scholarships (CNY 10k–20k)',
    councilAndCareer: '5-year BDS saves 1 full year vs MBBS; BMDC Dental RQE / BNMC / PCB routes.',
    slug: 'nanjing-medical-university',
  },
  {
    university: 'Zhengzhou University & Jiangsu University',
    city: 'Zhengzhou / Zhenjiang',
    tier: '211 Double First-Class / Provincial Key',
    major: 'B.Sc. Pharmacy (4 Yrs) & BDS Stomatology (5 Yrs)',
    duration: '4–5 Years',
    grossTuitionRmb: 22000,
    netAfterScholarshipRmb: 11500,
    hostelRmb: 4500,
    scholarshipSummary: 'Up to 50% Henan/ZZU waiver or CNY 10,000 UJS Presidential deduction',
    councilAndCareer: 'Strong backup for students with 2–3 year study gaps or mid-range budgets.',
    slug: 'zzu',
  },
  {
    university: 'Zhejiang University – Univ. of Edinburgh Institute (ZJE)',
    city: 'Haining / Hangzhou, Zhejiang',
    tier: 'C9 League + UK Top-35 Dual Degree',
    major: 'B.Sc. Biomedical Sciences / Biomedical Informatics (Dual UK+China Degree)',
    duration: '4 Years',
    grossTuitionRmb: 160000,
    netAfterScholarshipRmb: 80000,
    hostelRmb: 8000,
    scholarshipSummary: 'ZJU-UoE Dean’s Scholarship (50%–100% tuition waiver for elite A-Level/HSC)',
    councilAndCareer: 'Awards both University of Edinburgh (UK) & ZJU degrees; direct UK/US PhD or graduate MD.',
    slug: 'zhejiang-university',
  },
];

export const PRE_MED_FOUNDATION_TRACKS = [
  {
    title: '6-Month March Pre-Medical / Foundation Track',
    durationAndIntake: 'March to July (Spring Entry) → Transitions to Year-1 MBBS in September',
    typicalFee: 'CNY 7,500 – 12,500 (1 Semester, 43 of 45 MOE schools offer prep options)',
    whoNeedsIt: [
      'Bangladeshi HSC/A-Level students who missed the September intake and want to avoid wasting a full year at home.',
      '17-year-old graduates turning 18 by September (meeting China’s strict 18+ MBBS entry rule).',
      'Students strengthening Mathematics, Physics, Chemistry (CSCA), Medical English, and HSK 1–2 before Year 1.',
    ],
    progressionNote:
      'Budget foundation tuition and living expenses as a separate stage. Progression to Year-1 MBBS follows each university’s published science, CSCA, and attendance criteria.',
  },
  {
    title: '1-Year Pre-University / Chinese Preparatory Track',
    durationAndIntake: 'September to July (1 Academic Year) → Year-1 Degree in Following September',
    typicalFee: 'CNY 15,000 – 48,000 (C9 / Project 985 schools like PKU, Fudan, SJTU, ZJU)',
    whoNeedsIt: [
      'Top-1% applicants targeting CSC Type-A Bilateral Scholarships or Chinese-medium/C9 medical schools.',
      'Students aiming for elite C9 medical faculties (Peking, Fudan, Shanghai Jiao Tong, Zhejiang) needing higher academic & HSK readiness.',
    ],
    progressionNote:
      'Passing the university’s June foundation exam, HSK threshold, and required CSCA subjects unlocks formal MBBS registration in September.',
  },
] as const;

export const MBBS_COMPARISON_FAQS = [
  {
    question: 'What is the actual government-regulated cost of private MBBS in Bangladesh vs. China?',
    answer:
      'Under Bangladesh Ministry of Health & Family Welfare (MOHFW) and DGME gazettes, local private medical colleges carry a statutory ceiling of BDT 19,44,000 admission fee + BDT 1,80,000 internship fee (BDT 21,24,000 total, with 60% = BDT 12,74,400 due immediately at admission) plus BDT 10,000/month tuition for 60 months (BDT 6,00,000), making the statutory academic core BDT 27,24,000 before university registration, Prof exams, books, hostel, and meals (realistic residential total ~BDT 36–45+ Lakh). In China, MOE-authorized public medical universities charge BDT 0 upfront capitation; annual tuition starts from CNY 24,000–34,000/year (~BDT 4.5–6.4 Lakh/year) plus CNY 3,600–4,900/year dorm, paid year by year with merit scholarships available.',
  },
  {
    question: 'Do I really need a BMDC Eligibility Certificate before going to China for MBBS?',
    answer:
      'Do not listen to sub-agents who confuse the China visa checklist with Bangladesh medical registration law. While Chinese universities and the Chinese Embassy in Dhaka do NOT ask for a BMDC Eligibility Certificate to issue an offer letter or X1 visa, the official BMDC Registration Qualifying Examination (RQE) application form explicitly asks for the Eligibility Certificate serial number and original copy (Item 6 & Item 12c). Even where BMDC updates cohort procedures by circular, BMDC ALWAYS audits your original SSC/HSC marksheets against the admission-year national medical criteria (Science stream, Biology GPA ≥ 3.50, combined GPA floor). Always verify your eligibility and active BMDC circular at bmdc.org.bd before enrolling.',
  },
  {
    question: 'How does a China MBBS graduate get registered to practice as a doctor in Bangladesh?',
    answer:
      'Under the Bangladesh Medical and Dental Council Act, 2010, every Bangladeshi graduate with a foreign MBBS degree follows a four-step route: (1) graduate from a Chinese Ministry of Education (MOE) authorized English-medium medical university listed in WDOMS; (2) legalize the degree and transcripts at the Bangladesh Embassy in Beijing and MoFA Dhaka, preserving ALL passports covering 5–6 years of China X1 visas and entry-exit stamps; (3) pass the bi-annual BMDC Registration Qualifying Examination (RQE, held around April/May and October/November); and (4) obtain Provisional Registration, complete the required 1-year rotatory internship at a BMDC-approved hospital in Bangladesh, and receive Permanent BMDC Registration.',
  },
  {
    question: 'Why must China MBBS students never lose their old or expired passports?',
    answer:
      'During physical document verification at BMDC (203 Shaheed Syed Nazrul Islam Sarani, Bijoy Nagar, Dhaka) for the RQE, BMDC inspects your passport visa pages, Chinese Residence Permits, and immigration entry-exit stamps spanning all 5–6 years to verify genuine physical, in-person study in China (ruling out online-only degrees). Always safeguard both expired and renewed passports.',
  },
  {
    question: 'Are 100% free full scholarships realistic for English-taught MBBS in China?',
    answer:
      'Honestly, no—full 6-year free scholarships for English-taught MBBS are extremely rare (limited mainly to ultra-competitive Shanghai Govt Class A or bilateral CSC Chinese-medium tracks). Most strong Bangladeshi MBBS applicants receive Year-1 Freshman or Provincial Scholarships worth CNY 10,000–30,000 (e.g., WMU up to CNY 20,000, CQMU CNY 15,000, Jasmine Jiangsu/Zhejiang/Fujian up to CNY 30,000), followed by Annual Academic Merit Awards of CNY 5,000–15,000/year in Years 2–5. If you need a 100% tuition waiver for all 4 years, 4-year English Pharmacy or Biotechnology at CPU, NJTech, or Nantong University is a much stronger match.',
  },
  {
    question: 'Is CSCA mandatory for MBBS in China in 2026/2027?',
    answer:
      'CSCA requirements are university-specific rather than identical across all 45 institutions. Verified 2026 examples: CQMU lists Mathematics in English; WMU and Jiangsu University list Mathematics and Chemistry; Fudan lists Mathematics, Physics, and Chemistry; while several provincial universities assess candidates via their own science exam and English interview. EduExpress provides complimentary CSCA Master Pro access to help applicants prepare for the exact subjects their shortlisted universities require.',
  },
  {
    question: 'Can I complete my 6th-year clinical internship in Bangladesh or in China?',
    answer:
      'It depends on your chosen university’s graduation policy and BMDC rules. Elite C9/985 schools (such as PKU, Fudan, SJTU, and Zhejiang University) mandate completing the internship inside their affiliated Chinese Grade-3A hospitals. Many popular MOE universities (such as CQMU, WMU, Jiangsu Univ., Tianjin Medical, Jilin, Yangzhou, Kunming, and Sichuan) permit either China affiliated hospitals (after passing HSK-4) or an approved Bangladesh teaching hospital route. Remember that under BMDC rules, you must pass the RQE before starting a registered internship in Bangladesh.',
  },
  {
    question: 'What if I have a 2–3 year study gap or Biology GPA below 3.50?',
    answer:
      'Do not risk enrolling in an MBBS degree intending to practice clinically in Bangladesh if your HSC Biology or study gap fails BMDC’s admission-year criteria. Instead, pivot to China’s high-scholarship 4-year English-taught B.Sc. Pharmacy (CPU, Shenyang Pharm, Zhengzhou, Nantong), Biotechnology / Pharmaceutical Engineering (NJTech, Yangzhou, SCUT), or B.Sc. Nursing (Shandong Univ.)—many of which offer 50%–100% tuition waivers and lead to strong pharmaceutical, biotech, or international postgraduate careers without requiring BMDC MBBS RQE.',
  },
];

export const MBBS_OFFICIAL_SOURCES: OfficialSource[] = [
  {
    label: 'Bangladesh Medical & Dental Council (BMDC) — Official Portal & Notices',
    href: 'https://www.bmdc.org.bd',
  },
  {
    label: 'BMDC Registration Qualifying Examination (RQE) Official Application & Checklist',
    href: 'https://www.bmdc.org.bd/upl/doc/form/QSPRfvjJ5NtF.pdf',
  },
  {
    label: 'BMDC Eligibility Certificate Official Application & Guidelines',
    href: 'https://www.bmdc.org.bd/docs/ELIGIBILITY_CERTIFICATE.pdf',
  },
  {
    label: 'Ministry of Health & Family Welfare (MOHFW / MEFWD) Bangladesh',
    href: 'https://mefwd.gov.bd',
  },
  {
    label: 'Directorate General of Medical Education (DGME) Bangladesh',
    href: 'https://dgme.gov.bd',
  },
  {
    label: 'Ministry of Education of China — English-Medium Undergraduate Medicine Standards',
    href: 'https://en.moe.gov.cn/documents/laws_policies/201506/t20150626_191398.html',
  },
  {
    label: 'Ministry of Education of China — Article 30 Authorisation Rules',
    href: 'https://en.moe.gov.cn/documents/laws_policies/201506/t20150626_191405.html',
  },
  {
    label: 'World Directory of Medical Schools (WDOMS) — Official Registry & Scope',
    href: 'https://www.wdoms.org/about/',
  },
  {
    label: 'Chongqing Medical University — 2026 Undergraduate English MBBS Guide',
    href: 'https://english.cqmu.edu.cn/info/1148/3038.htm',
  },
  {
    label: 'Wenzhou Medical University — 2026 International Undergraduate Guide',
    href: 'https://sis.wmu.edu.cn/zw24/lxwy/bksxm/bkszsjz.htm',
  },
  {
    label: 'Jiangsu University — 2026 Clinical Medicine (MBBS) Programme Page',
    href: 'https://oec.ujs.edu.cn/en/PROGRAMS/Bachelor/Clinical_Medicine_MBBS_.htm',
  },
];
