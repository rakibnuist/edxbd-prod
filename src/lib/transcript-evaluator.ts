import { cleanText, type FitResponseLanguage } from '@/lib/fit-matcher';
import type { CleanUniversityRecord } from '@/lib/university-records';

export interface TranscriptSubject {
  name: string;
  grade: string;
  gradePoint?: number;
}

export interface TranscriptAnalysis {
  candidateName?: string;
  examination: string;
  educationBoard?: string;
  passingYear?: number;
  groupOrMajor: string;
  gpa: number;
  scale: number;
  isScienceGroup: boolean;
  subjects: TranscriptSubject[];
}

export interface BmdcEligibility {
  status: 'eligible' | 'ineligible_biology' | 'needs_full_documents';
  biologyGradePoint: number | null;
  biologySatisfied: boolean;
  ruleExplanation: string;
}

export interface EvaluatedProgramMatch {
  slug: string;
  universityName: string;
  city: string;
  country: string;
  programName: string;
  level: string;
  tuition: string;
  tuitionAfterScholarship?: string;
  scholarshipSummary?: string;
  clearCostPath?: string;
  profilePath: string;
  bmdcRecognized?: boolean;
  eligibilityNotes: string;
}

export interface TranscriptEvaluationResult {
  mode: 'gemini' | 'catalog';
  analysis: TranscriptAnalysis;
  bmdcEligibility: BmdcEligibility;
  eligibleDisciplines: string[];
  recommendedMatches: EvaluatedProgramMatch[];
  counselorSummary: string;
  language: FitResponseLanguage;
}

export interface TranscriptHints {
  targetLevel?: string;
  targetSubject?: string;
  language?: FitResponseLanguage;
}

export const TRANSCRIPT_EVALUATOR_SCHEMA = {
  type: 'object',
  properties: {
    candidateName: { type: 'string', description: 'Student name if clearly legible on transcript, otherwise empty.' },
    examination: { type: 'string', description: 'e.g. "HSC / Alim", "SSC / Dakhil", "Cambridge A Level", "Bachelor Degree".' },
    educationBoard: { type: 'string', description: 'e.g. "Dhaka", "Chattogram", "Rajshahi", "Madrasah Board", or university name.' },
    passingYear: { type: 'integer', description: 'Year of passing (e.g. 2024, 2025).' },
    groupOrMajor: { type: 'string', description: 'e.g. "Science", "Business Studies", "Humanities", "CSE".' },
    gpa: { type: 'number', description: 'Numeric GPA or CGPA (e.g. 4.83, 3.65).' },
    scale: { type: 'number', description: 'GPA scale (usually 5.0 for SSC/HSC, 4.0 for Bachelor).' },
    isScienceGroup: { type: 'boolean', description: 'True if student is from Science/Pre-Medical/STEM stream.' },
    subjects: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Subject name (e.g. "Biology", "Physics", "Chemistry", "Higher Mathematics", "English").' },
          grade: { type: 'string', description: 'Letter grade (e.g. "A+", "A", "B").' },
          gradePoint: { type: 'number', description: 'Numeric point (e.g. 5.0, 4.0, 3.5).' },
        },
        required: ['name', 'grade'],
      },
    },
    eligibleDisciplines: {
      type: 'array',
      items: { type: 'string' },
      description: 'Disciplines student qualifies for (e.g. "MBBS / Clinical Medicine (Subject to BMDC)", "Computer Science & Engineering", "Business Administration").',
    },
    counselorSummary: {
      type: 'string',
      description: 'A 2-3 sentence assessment of academic standing, subject strengths, and recommended next steps without guaranteeing outcomes.',
    },
  },
  required: ['examination', 'groupOrMajor', 'gpa', 'scale', 'isScienceGroup', 'subjects'],
} as const;

export function evaluateBmdcEligibility(
  analysis: TranscriptAnalysis,
  language: FitResponseLanguage,
): BmdcEligibility {
  const bn = language === 'bn';
  const biologySub = analysis.subjects.find(s => /biology|জীববিজ্ঞান/i.test(s.name));
  const bioPoint = typeof biologySub?.gradePoint === 'number'
    ? biologySub.gradePoint
    : /A\+/i.test(biologySub?.grade || '') ? 5.0
    : /A\b/i.test(biologySub?.grade || '') ? 4.0
    : /A-/i.test(biologySub?.grade || '') ? 3.5
    : /B\b/i.test(biologySub?.grade || '') ? 3.0
    : /C\b/i.test(biologySub?.grade || '') ? 2.0
    : null;

  if (!analysis.isScienceGroup) {
    return {
      status: 'ineligible_biology',
      biologyGradePoint: bioPoint,
      biologySatisfied: false,
      ruleExplanation: bn
        ? 'বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল (BMDC) অনুযায়ী বিদেশে MBBS পড়তে বিজ্ঞান বিভাগ (Science) এবং এইচএসসিতে জীববিজ্ঞান (Biology) থাকা বাধ্যতামূলক।'
        : 'Bangladesh Medical & Dental Council (BMDC) requires a Science background with mandatory Biology in HSC to study MBBS abroad.',
    };
  }

  if (bioPoint !== null && bioPoint < 3.5) {
    return {
      status: 'ineligible_biology',
      biologyGradePoint: bioPoint,
      biologySatisfied: false,
      ruleExplanation: bn
        ? `এইচএসসি জীববিজ্ঞানে প্রাপ্ত গ্রেড পয়েন্ট (${bioPoint}) BMDC-এর ন্যূনতম শর্ত (GPA 3.50)-এর নিচে। ফলে বিদেশে MBBS করার পর বাংলাদেশে লাইসেন্সিং পরীক্ষার যোগ্যতা অর্জন সম্ভব নয়।`
        : `Biology grade point (${bioPoint}) is below the BMDC minimum threshold of GPA 3.50 in HSC for foreign medical graduates.`,
    };
  }

  if (bioPoint !== null && bioPoint >= 3.5) {
    return {
      status: 'eligible',
      biologyGradePoint: bioPoint,
      biologySatisfied: true,
      ruleExplanation: bn
        ? `এইচএসসি জীববিজ্ঞান শর্ত সন্তোষজনক (GPA ${bioPoint} >= 3.50)। SSC ও HSC মিলিয়ে মোট জিপিএ এবং সমমান শর্ত যাচাই সাপেক্ষে BMDC তালিকাভুক্ত প্রতিষ্ঠানে আবেদনযোগ্য।`
        : `HSC Biology requirement satisfied (GPA ${bioPoint} >= 3.50). Eligible for BMDC/WDOMS listed medical universities subject to combined SSC+HSC GPA verification.`,
    };
  }

  return {
    status: 'needs_full_documents',
    biologyGradePoint: null,
    biologySatisfied: false,
    ruleExplanation: bn
      ? 'ট্রান্সক্রিপ্টে জীববিজ্ঞানের আলাদা গ্রেড পাওয়া যায়নি। BMDC নিয়মানুযায়ী এইচএসসিতে জীববিজ্ঞানে ন্যূনতম GPA ৩.৫০ আবশ্যক।'
      : 'Separate Biology grade was not identified on this document. BMDC requires minimum GPA 3.50 in HSC Biology.',
  };
}

export function sanitizeAndHydrateTranscriptEvaluation(
  raw: Record<string, unknown>,
  records: CleanUniversityRecord[],
  language: FitResponseLanguage,
): TranscriptEvaluationResult {
  const activeRecords = records.filter(r => r.isActive);
  const exam = cleanText(raw.examination, 80) || 'HSC Examination';
  const group = cleanText(raw.groupOrMajor, 80) || 'Science';
  const board = cleanText(raw.educationBoard, 100);
  const name = cleanText(raw.candidateName, 100);
  const rawGpa = typeof raw.gpa === 'number' && Number.isFinite(raw.gpa) ? Math.max(0, Math.min(5, raw.gpa)) : 4.0;
  const rawScale = typeof raw.scale === 'number' && raw.scale > 0 ? raw.scale : 5.0;
  const isScience = typeof raw.isScienceGroup === 'boolean'
    ? raw.isScienceGroup
    : /science|stem|medical|eng/i.test(group);

  const rawSubjects = Array.isArray(raw.subjects) ? raw.subjects : [];
  const subjects: TranscriptSubject[] = [];
  for (const s of rawSubjects) {
    if (!s || typeof s !== 'object') continue;
    const sObj = s as Record<string, unknown>;
    const sName = cleanText(sObj.name, 60);
    const sGrade = cleanText(sObj.grade, 10);
    const sPoint = typeof sObj.gradePoint === 'number' && Number.isFinite(sObj.gradePoint) ? sObj.gradePoint : undefined;
    if (sName && sGrade) {
      subjects.push({ name: sName, grade: sGrade, gradePoint: sPoint });
    }
  }

  const analysis: TranscriptAnalysis = {
    candidateName: name || undefined,
    examination: exam,
    educationBoard: board || undefined,
    passingYear: typeof raw.passingYear === 'number' ? raw.passingYear : undefined,
    groupOrMajor: group,
    gpa: rawGpa,
    scale: rawScale,
    isScienceGroup: isScience,
    subjects,
  };

  const bmdc = evaluateBmdcEligibility(analysis, language);

  // Match eligible disciplines
  const rawDisciplines = Array.isArray(raw.eligibleDisciplines)
    ? raw.eligibleDisciplines.map(d => cleanText(d, 80)).filter(Boolean)
    : [];

  const defaultDisciplines = isScience
    ? [
        bmdc.biologySatisfied ? 'MBBS / Clinical Medicine (BMDC/WDOMS listed)' : 'Biomedical Science / Biotechnology',
        'Computer Science & Software Engineering',
        'Civil / Electrical Engineering',
        'Applied Sciences & Technology',
      ]
    : [
        'Business Administration / International Trade',
        'Finance & Accounting',
        'Media & Communication',
        'Language & Regional Studies',
      ];

  const eligibleDisciplines = rawDisciplines.length > 0 ? rawDisciplines : defaultDisciplines;

  // Find grounded matches from active records
  const matches: EvaluatedProgramMatch[] = [];
  const targetSubjects = isScience && bmdc.biologySatisfied
    ? ['Clinical Medicine', 'Computer Science', 'Engineering']
    : isScience
    ? ['Computer Science', 'Software Engineering', 'Biotechnology']
    : ['International Economics', 'Business Administration', 'Marketing'];

  for (const targetSub of targetSubjects) {
    for (const uni of activeRecords) {
      if (matches.some(m => m.slug === uni.slug)) continue;
      const prog = uni.programs.find(p =>
        p.status !== 'paused' && new RegExp(targetSub, 'i').test(p.name + ' ' + p.subject),
      );
      if (prog) {
        const hasCost = uni.costPlans.some(cp => cp.isPublished);
        const isMbbs = /medicine|mbbs|clinical/i.test(prog.name);
        matches.push({
          slug: uni.slug,
          universityName: uni.name,
          city: uni.city,
          country: uni.country,
          programName: prog.name,
          level: prog.level,
          tuition: prog.tuition || uni.details.tuition,
          tuitionAfterScholarship: prog.tuitionAfterScholarship,
          scholarshipSummary: uni.scholarships[0]?.title,
          clearCostPath: hasCost ? `/universities/${uni.slug}/clear-cost` : undefined,
          profilePath: `/universities/${uni.slug}`,
          bmdcRecognized: isMbbs ? /bmdc|wdoms/i.test(uni.recognitionAuthority || '') : undefined,
          eligibilityNotes: isMbbs
            ? (bmdc.biologySatisfied ? 'BMDC Biology >= 3.50 satisfied; verified WDOMS institution.' : 'BMDC check required.')
            : `Fits ${group} background (GPA ${rawGpa}/${rawScale}).`,
        });
        if (matches.length >= 4) break;
      }
    }
    if (matches.length >= 4) break;
  }

  const bn = language === 'bn';
  const counselorSummary = cleanText(raw.counselorSummary, 400) || (bn
    ? `ট্রান্সক্রিপ্ট অনুযায়ী আপনার জিপিএ ${rawGpa}/${rawScale} (${group})। ${bmdc.ruleExplanation} স্কলারশিপ ও ভর্তির চূড়ান্ত সিদ্ধান্ত বিশ্ববিদ্যালয় কর্তৃপক্ষের উপর নির্ভরশীল।`
    : `Transcript indicates GPA ${rawGpa}/${rawScale} (${group} stream). ${bmdc.ruleExplanation} Admissions and scholarships remain competitive and are decided by universities.`);

  return {
    mode: 'gemini',
    analysis,
    bmdcEligibility: bmdc,
    eligibleDisciplines,
    recommendedMatches: matches,
    counselorSummary,
    language,
  };
}

export function buildCatalogTranscriptFallback(
  hints: TranscriptHints,
  records: CleanUniversityRecord[],
): TranscriptEvaluationResult {
  const language = hints.language === 'bn' ? 'bn' : 'en';
  const targetSub = hints.targetSubject || 'Computer Science';
  const isMed = /mbbs|medical|doctor/i.test(targetSub);

  const analysis: TranscriptAnalysis = {
    examination: hints.targetLevel || 'HSC Examination',
    groupOrMajor: isMed ? 'Science (Pre-Medical)' : 'Science / General',
    gpa: 4.5,
    scale: 5.0,
    isScienceGroup: true,
    subjects: [
      { name: 'Physics', grade: 'A', gradePoint: 4.0 },
      { name: 'Chemistry', grade: 'A', gradePoint: 4.0 },
      { name: isMed ? 'Biology' : 'Higher Mathematics', grade: 'A+', gradePoint: 5.0 },
      { name: 'English', grade: 'A', gradePoint: 4.0 },
    ],
  };

  const bmdc = evaluateBmdcEligibility(analysis, language);
  const activeRecords = records.filter(r => r.isActive);
  const matches: EvaluatedProgramMatch[] = [];

  for (const uni of activeRecords) {
    if (matches.some(m => m.slug === uni.slug)) continue;
    const prog = uni.programs.find(p =>
      p.status !== 'paused' && new RegExp(isMed ? 'Medicine|MBBS' : 'Computer|Science|Engineering', 'i').test(p.name + ' ' + p.subject),
    );
    if (prog) {
      const hasCost = uni.costPlans.some(cp => cp.isPublished);
      matches.push({
        slug: uni.slug,
        universityName: uni.name,
        city: uni.city,
        country: uni.country,
        programName: prog.name,
        level: prog.level,
        tuition: prog.tuition || uni.details.tuition,
        tuitionAfterScholarship: prog.tuitionAfterScholarship,
        scholarshipSummary: uni.scholarships[0]?.title,
        clearCostPath: hasCost ? `/universities/${uni.slug}/clear-cost` : undefined,
        profilePath: `/universities/${uni.slug}`,
        bmdcRecognized: isMed ? /bmdc|wdoms/i.test(uni.recognitionAuthority || '') : undefined,
        eligibilityNotes: isMed
          ? 'Requires WDOMS listing and BMDC eligibility check.'
          : 'Grounded program match for science background.',
      });
      if (matches.length >= 3) break;
    }
  }

  const bn = language === 'bn';
  return {
    mode: 'catalog',
    analysis,
    bmdcEligibility: bmdc,
    eligibleDisciplines: isMed
      ? ['MBBS / Clinical Medicine (Subject to BMDC)', 'Biomedical Science']
      : ['Computer Science & Engineering', 'Software Engineering', 'Information Technology'],
    recommendedMatches: matches,
    counselorSummary: bn
      ? 'ক্যাটালগ রেকর্ড অনুযায়ী প্রাথমিক মূল্যায়ন তৈরি করা হয়েছে। ভর্তির যোগ্যতা ও স্কলারশিপের জন্য অফিসিয়াল মার্কশিট যাচাই করুন।'
      : 'Preliminary evaluation generated from EduExpress verified catalog records. Verify official marksheet during counselor assessment.',
    language,
  };
}
