import { cleanText, type FitResponseLanguage } from './fit-matcher';

export type RoadmapTargetDegree = 'Bachelor' | 'Master' | 'PhD' | 'MBBS';
export type RoadmapTargetCountry = 'China' | 'Malaysia' | 'General';

export interface RoadmapRequest {
  studentName: string;
  studentPhone?: string;
  studentEmail?: string;
  targetCountry: RoadmapTargetCountry;
  targetDegree: RoadmapTargetDegree;
  intendedMajor: string;
  targetIntake: string;
  gpa: string;
  budgetRange?: string;
  language?: FitResponseLanguage;
  consent?: boolean;
}

export interface RoadmapInstitutionRecommendation {
  name: string;
  city: string;
  estimatedYearOneCny: number;
  scholarshipCoverage: string;
}

export interface RoadmapFeeItemization {
  tuitionRange: string;
  dormitoryRange: string;
  insuranceRange: string;
  medicalAndVisaRange: string;
  eduExpressServiceFee: string;
}

export interface RoadmapMilestone {
  period: string;
  action: string;
}

export interface RoadmapSummary {
  studentName: string;
  targetDegree: RoadmapTargetDegree;
  targetCountry: RoadmapTargetCountry;
  intendedMajor: string;
  targetIntake: string;
  gpa: string;
  executiveSummary: string;
  scholarshipProspects: string;
  recommendedInstitutions: RoadmapInstitutionRecommendation[];
  feeItemization: RoadmapFeeItemization;
  timelineMilestones: RoadmapMilestone[];
  complianceNotes: string[];
  mode: 'gemini' | 'catalog';
}

/**
 * Normalizes user input for roadmap generation.
 */
export function normalizeRoadmapRequest(input: unknown): RoadmapRequest {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid request payload: must be an object.');
  }

  const obj = input as Record<string, unknown>;

  const studentName = cleanText(obj.studentName, 100) || 'Prospective Scholar';
  const studentPhone = cleanText(obj.studentPhone, 30) || undefined;
  const studentEmail = cleanText(obj.studentEmail, 150) || undefined;
  const intendedMajor = cleanText(obj.intendedMajor, 120) || 'General Science & Engineering';
  const targetIntake = cleanText(obj.targetIntake, 50) || 'March 2027';
  const gpa = cleanText(obj.gpa, 30) || '4.50 / 5.00';
  const budgetRange = cleanText(obj.budgetRange, 80) || 'CNY 15,000–25,000 / year';
  const consent = Boolean(obj.consent);

  let targetCountry: RoadmapTargetCountry = 'China';
  const rawCountry = String(obj.targetCountry || '').toLowerCase();
  if (rawCountry.includes('malaysia')) targetCountry = 'Malaysia';
  else if (rawCountry.includes('general')) targetCountry = 'General';

  let targetDegree: RoadmapTargetDegree = 'Bachelor';
  const rawDegree = String(obj.targetDegree || '').toLowerCase();
  if (rawDegree.includes('master')) targetDegree = 'Master';
  else if (rawDegree.includes('phd') || rawDegree.includes('doctor')) targetDegree = 'PhD';
  else if (rawDegree.includes('mbbs') || rawDegree.includes('medicine')) targetDegree = 'MBBS';

  const language: FitResponseLanguage = obj.language === 'bn' ? 'bn' : 'en';

  return {
    studentName,
    studentPhone,
    studentEmail,
    targetCountry,
    targetDegree,
    intendedMajor,
    targetIntake,
    gpa,
    budgetRange,
    language,
    consent,
  };
}

/**
 * Deterministic catalog fallback for roadmap generator when offline.
 */
export function buildCatalogRoadmapFallback(req: RoadmapRequest): RoadmapSummary {
  const isChina = req.targetCountry === 'China';
  const isMBBS = req.targetDegree === 'MBBS' || /mbbs|medicine|clinical/i.test(req.intendedMajor);

  let executiveSummary = `Comprehensive study-abroad strategy prepared for ${req.studentName} pursuing ${req.targetDegree} in ${req.intendedMajor} for the ${req.targetIntake} intake.`;
  if (isChina) {
    executiveSummary += ` Based on your reported academic standing (${req.gpa}), your profile qualifies for verified Chinese university admission and competitive provincial/institutional scholarship pools.`;
  } else {
    executiveSummary += ` Malaysian university admissions emphasize academic progression and English language proficiency, with direct bachelor and master intakes.`;
  }

  let scholarshipProspects = '';
  if (isChina) {
    scholarshipProspects = req.targetDegree === 'Master' || req.targetDegree === 'PhD'
      ? 'Strong candidacy for CSC Type B university recommendation and Provincial Government full/partial awards (covering tuition and accommodation).'
      : 'Eligible for university freshmen tuition waiver awards (Class A/B) and one-year Chinese language progression subsidies.';
  } else {
    scholarshipProspects = 'Merit-based international student bursaries ranging from 10% to 30% tuition fee reductions at participating universities.';
  }

  const recommendedInstitutions: RoadmapInstitutionRecommendation[] = isChina
    ? isMBBS
      ? [
          { name: 'China Medical University', city: 'Shenyang', estimatedYearOneCny: 42000, scholarshipCoverage: 'WDOMS & BMDC Eligible' },
          { name: 'Nanjing Medical University', city: 'Nanjing', estimatedYearOneCny: 38000, scholarshipCoverage: 'WDOMS & BMDC Listed' },
          { name: 'Dalian Medical University', city: 'Dalian', estimatedYearOneCny: 40000, scholarshipCoverage: 'English-medium Clinical Medicine' },
        ]
      : [
          { name: 'Nanjing University of Information Science & Technology', city: 'Nanjing', estimatedYearOneCny: 16000, scholarshipCoverage: 'Full & Partial University Awards' },
          { name: 'Southeast University', city: 'Nanjing', estimatedYearOneCny: 24000, scholarshipCoverage: 'CSC Type B & Presidential Award' },
          { name: 'Jiangsu University', city: 'Zhenjiang', estimatedYearOneCny: 18000, scholarshipCoverage: 'Presidential Scholarship Pool' },
        ]
    : [
        { name: 'Asia Pacific University of Technology & Innovation (APU)', city: 'Kuala Lumpur', estimatedYearOneCny: 28000, scholarshipCoverage: 'Merit Tuition Grant' },
        { name: 'Monash University Malaysia', city: 'Subang Jaya', estimatedYearOneCny: 52000, scholarshipCoverage: 'High Achiever Award' },
        { name: 'Sunway University', city: 'Petaling Jaya', estimatedYearOneCny: 34000, scholarshipCoverage: 'International Excellence Bursary' },
      ];

  const feeItemization: RoadmapFeeItemization = isChina
    ? isMBBS
      ? {
          tuitionRange: 'CNY 30,000–45,000 / year',
          dormitoryRange: 'CNY 4,000–8,000 / year',
          insuranceRange: 'CNY 800 / year',
          medicalAndVisaRange: 'CNY 1,200 (first year physical & residence permit)',
          eduExpressServiceFee: 'Zero service fee before China visa approval (China Visa-First Policy)',
        }
      : {
          tuitionRange: 'CNY 12,000–26,000 / year (before scholarship waiver)',
          dormitoryRange: 'CNY 3,000–6,000 / year',
          insuranceRange: 'CNY 800 / year',
          medicalAndVisaRange: 'CNY 1,000–1,400 (JW202, physical & visa conversion)',
          eduExpressServiceFee: 'Zero service fee before China visa approval (China Visa-First Policy)',
        }
    : {
        tuitionRange: 'RM 18,000–45,000 / year',
        dormitoryRange: 'RM 6,000–12,000 / year',
        insuranceRange: 'RM 500 / year (EMGS Medical Card)',
        medicalAndVisaRange: 'RM 2,000–3,500 (EMGS Visa Approval Letter & Student Pass)',
        eduExpressServiceFee: 'Clear written schedule before processing commences',
      };

  const timelineMilestones: RoadmapMilestone[] = isChina
    ? [
        { period: 'Month 1: Evaluation & Shortlist', action: 'Complete profile review, authenticate HSC/Bachelor marksheets, and select 3 target universities.' },
        { period: 'Month 2: Application Submission', action: 'Draft CSC Study Plan/SOP, obtain Foreigner Physical Examination, and submit university applications.' },
        { period: 'Month 3: Admission & JW202 Issuance', action: 'Receive formal admission notice and JW202/DQ visa application form issued by the Chinese Ministry of Education.' },
        { period: 'Month 4: Embassy Visa & Pre-Departure', action: 'Submit X1 visa file to CVASC Dhaka, attend EduExpress pre-departure briefing, and finalize hostel booking.' },
      ]
    : [
        { period: 'Month 1: Program Choice & Application', action: 'Select target Malaysian institution, verify credit exemptions, and apply for Offer of Acceptance.' },
        { period: 'Month 2: EMGS Visa Approval Letter (VAL)', action: 'Submit academic documents and passport to EMGS portal for single entry visa clearance.' },
        { period: 'Month 3: Travel & Campus Registration', action: 'Obtain e-VISA, complete post-arrival medical screening in Malaysia, and endorse Student Pass.' },
      ];

  const complianceNotes: string[] = [
    'EduExpress China Visa-First Guarantee: No file opening charge and no service fee charged before your China student visa is officially approved.',
    'Third-Party Transparency: University application fees, embassy visa fees, medical exams, and courier charges are paid directly to authorities or itemized in writing.',
  ];

  if (isMBBS) {
    complianceNotes.push(
      'BMDC Licensing Requirement: Must be a WDOMS-recognized medical university. Bangladesh Medical and Dental Council mandates minimum HSC Biology GPA >= 3.50.',
    );
  }

  complianceNotes.push(
    'Visa Integrity: Chinese and Malaysian student visas strictly prohibit unauthorized off-campus employment. Demonstrate legitimate family funding and non-immigrant intent.',
  );

  return {
    studentName: req.studentName,
    targetDegree: req.targetDegree,
    targetCountry: req.targetCountry,
    intendedMajor: req.intendedMajor,
    targetIntake: req.targetIntake,
    gpa: req.gpa,
    executiveSummary,
    scholarshipProspects,
    recommendedInstitutions,
    feeItemization,
    timelineMilestones,
    complianceNotes,
    mode: 'catalog',
  };
}
