import type { UniversityScholarshipOption } from './university-scholarship';

/** Public programme information. Editorial sources and maintenance dates stay in the CMS. */
export type UniversityProfileFee = {
  key: 'tuition' | 'application' | 'deposit' | 'housing' | 'insurance' | 'medical' | 'residence' | 'other';
  item: string;
  amount?: number;
  displayAmount?: string;
  currency: string;
  period: 'programme' | 'semester' | 'year' | 'month' | 'oneoff' | 'day';
  stage: 'before_china' | 'in_china';
  notes?: string;
  optional?: boolean;
  creditToward?: 'tuition' | 'housing';
};

export type UniversityProgramDetail = {
  id: string;
  name: string;
  level: string;
  languages: string[];
  duration: string;
  periodLabel?: string;
  intake?: string;
  deadline?: string;
  campus?: string;
  school?: string;
  qualifications: string[];
  languageRequirements: string[];
  documents: string[];
  fees: UniversityProfileFee[];
  notes: string[];
  scholarships?: string[];
  progression?: string;
};

export type UniversityProfileDetail = {
  slug: string;
  overview: string;
  highlights?: { title: string; description: string }[];
  programs: UniversityProgramDetail[];
  scholarshipOptions?: UniversityScholarshipOption[];
};

export type ProfileFee = UniversityProfileFee;
export type ProfileProgramDetails = UniversityProgramDetail;
export type UniversityProfileDetails = UniversityProfileDetail;
