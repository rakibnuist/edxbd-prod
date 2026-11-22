export type MilestoneKey = 'submitted' | 'review' | 'admission' | 'jw202' | 'visa' | 'fly';

export interface FlagshipMilestone {
  id: number;
  key: MilestoneKey;
  titleEn: string;
  titleBn: string;
  shortEn: string;
  shortBn: string;
  descEn: string;
  descBn: string;
  actionEn: string;
  actionBn: string;
  estimatedTime: string;
}

export const FLAGSHIP_MILESTONES: FlagshipMilestone[] = [
  {
    id: 1,
    key: 'submitted',
    titleEn: 'Application Submitted',
    titleBn: 'বিশ্ববিদ্যালয়ে আবেদন দাখিল',
    shortEn: 'Submitted',
    shortBn: 'দাখিল সম্পন্ন',
    descEn: 'Your academic transcripts, certificates, and scholarship application package are prepared and officially submitted to the university admissions office.',
    descBn: 'আপনার সকল একাডেমিক মার্কশিট, সার্টিফিকেট ও স্কলারশিপ আবেদনপত্র সংশ্লিষ্ট বিশ্ববিদ্যালয়ের আন্তর্জাতিক ভর্তি অফিসে সফলভাবে সাবমিট করা হয়েছে।',
    actionEn: 'Admissions desk is coordinating initial faculty verification.',
    actionBn: 'এডমিশন ডেস্ক বিশ্ববিদ্যালয়ের ফ্যাকাল্টি বোর্ড থেকে প্রাথমিক ভেরিফিকেশনের সমন্বয় করছে।',
    estimatedTime: '১-২ সপ্তাহ',
  },
  {
    id: 2,
    key: 'review',
    titleEn: 'University Review & Assessment',
    titleBn: 'বিশ্ববিদ্যালয় রিভিউ ও ইন্টারভিউ',
    shortEn: 'Under Review',
    shortBn: 'মূল্যায়ন চলছে',
    descEn: 'The university academic committee and scholarship panel are actively reviewing your GPA, study plan, and eligibility.',
    descBn: 'বিশ্ববিদ্যালয় স্কলারশিপ কমিটি ও প্রফেসরদের প্যানেল আপনার একাডেমিক ফলাফল, স্টাডি প্ল্যান এবং যোগ্যতা পুঙ্খানুপুঙ্খভাবে মূল্যায়ন করছে।',
    actionEn: 'Our counselor will brief you ahead of any online university interview.',
    actionBn: 'কোনো অনলাইন ইন্টারভিউ বা অতিরিক্ত তথ্যের প্রয়োজন হলে আমাদের কাউন্সেলর আপনাকে আগেই প্রস্তুত করে দেবেন।',
    estimatedTime: '২-৪ সপ্তাহ',
  },
  {
    id: 3,
    key: 'admission',
    titleEn: 'Official Admission Notice',
    titleBn: 'অফিশিয়াল অ্যাডমিশন অনুমোদন',
    shortEn: 'Admission Approved',
    shortBn: 'ভর্তি অনুমোদিত',
    descEn: 'Congratulations! The university has approved your admission and issued your official Scholarship & Admission Notice.',
    descBn: 'অভিনন্দন! বিশ্ববিদ্যালয় আপনার স্কলারশিপসহ ভর্তির আবেদন অনুমোদন করেছে এবং অফিশিয়াল অ্যাডমিশন নোটিশ (ভর্তি চিঠি) ইস্যু করেছে।',
    actionEn: 'The university is now requesting your state JW202 / DQ visa form.',
    actionBn: 'বিশ্ববিদ্যালয় এখন আপনার জন্য সরকারি JW202 / DQ স্টুডেন্ট ভিসা অনুমোদন ফরম ইস্যুর প্রক্রিয়া চালাচ্ছে।',
    estimatedTime: '১-২ সপ্তাহ',
  },
  {
    id: 4,
    key: 'jw202',
    titleEn: 'JW202 / DQ Form Issued',
    titleBn: 'সরকারি JW202 / DQ ভিসা ফরম অনুমোদন',
    shortEn: 'JW202 Issued',
    shortBn: 'JW202 রেডি',
    descEn: 'The Chinese Ministry of Education / Provincial Foreign Affairs Office has issued your official JW202 / DQ Visa Application Form.',
    descBn: 'চীনা শিক্ষা মন্ত্রণালয় ও প্রাদেশিক অথরিটি থেকে আপনার স্টুডেন্ট ভিসার অফিশিয়াল অনুমোদন পত্র (JW202 / DQ Form) সফলভাবে ইস্যু হয়েছে।',
    actionEn: 'Our visa desk is preparing your original Dhaka embassy file & medical check.',
    actionBn: 'এডুএক্সপ্রেস ভিসা টিম ঢাকাস্থ চীনা দূতাবাসে সাবমিশনের জন্য আপনার মূল ফাইল প্রস্তুত করছে।',
    estimatedTime: '২-৩ সপ্তাহ',
  },
  {
    id: 5,
    key: 'visa',
    titleEn: 'Embassy Visa Stamped',
    titleBn: 'চীনা দূতাবাস ভিসা অনুমোদন',
    shortEn: 'Visa Stamped',
    shortBn: 'ভিসা স্ট্যাম্পড',
    descEn: 'Your X1/X2 Student Visa has been approved and stamped in your passport by the Embassy of China in Dhaka.',
    descBn: 'আলহামদুলিল্লাহ! ঢাকাস্থ চীনা দূতাবাস থেকে আপনার পাসপোর্টে অফিশিয়াল এক্স১/এক্স২ স্টুডেন্ট ভিসা স্ট্যাম্পিং সফলভাবে সম্পন্ন হয়েছে।',
    actionEn: 'Moving to air ticket booking, pre-departure briefing & campus arrival setup.',
    actionBn: 'পাসপোর্ট হ্যান্ডওভার সম্পন্ন; এখন এয়ার টিকিট বুকিং ও প্রি-ডিপার্চার ব্রিফিং শুরু হবে।',
    estimatedTime: '১ সপ্তাহ',
  },
  {
    id: 6,
    key: 'fly',
    titleEn: 'Flight to China & Campus Enrollment',
    titleBn: 'যাত্রা ও ক্যাম্পাসে স্বাগতম',
    shortEn: 'Departed & Enrolled',
    shortBn: 'ফ্লাইট ও এনরোলমেন্ট',
    descEn: 'Cleared for takeoff! Welcome to your university campus in China — including airport pickup coordination and dormitory registration.',
    descBn: 'অভিনন্দন! আপনার চায়না যাত্রা শুরু হয়েছে। এয়ারপোর্ট পিকআপ, ডরমেটরি রুম ও ক্যাম্পাস রেজিস্ট্রেশনে আমাদের প্রতিনিধি আপনার পাশে থাকবেন।',
    actionEn: 'Journey complete — EduExpress Student Alumni Support active.',
    actionBn: 'প্রসেসিং সফলভাবে সম্পন্ন হয়েছে — এডুএক্সপ্রেস স্টুডেন্ট সাপোর্ট চলমান।',
    estimatedTime: 'সম্পন্ন 🎉',
  },
];

export const APPLICATION_STAGE_OPTIONS = [
  { value: 'documents', label: '1. File Open / Documents Collection', step: 1 },
  { value: 'submitted', label: '1. Application Submitted to University', step: 1 },
  { value: 'review', label: '2. University Review & Interview', step: 2 },
  { value: 'admitted', label: '3. Admission Notice Issued', step: 3 },
  { value: 'jw202', label: '4. JW202 / DQ Form Issued', step: 4 },
  { value: 'visa', label: '5. Embassy Visa Stamped', step: 5 },
  { value: 'enrolled', label: '6. Flight to China & Enrolled', step: 6 },
] as const;

export const ALLOWED_APPLICATION_STAGES = new Set<string>([
  'documents',
  'ready',
  'submitted',
  'review',
  'interview',
  'pre_admission',
  'deposit',
  'admitted',
  'jw202',
  'visa',
  'visa_applied',
  'visa_approved',
  'partial_payment',
  'air_ticket',
  'complete_payment',
  'pre_departure',
  'enrolled',
  'fly',
  'documents_withdraw',
  'application_withdraw',
]);

export const DEFAULT_CHINA_DOCUMENTS = [
  'Passport Information Page (Color Scan)',
  'SSC / O-Level Certificate & Transcript',
  'HSC / A-Level Certificate & Transcript',
  'Foreigner Physical Examination Form (Medical)',
  'Police Clearance Certificate (PCC)',
  'Bank Statement / Sponsor Solvency',
  'Study Plan / Statement of Purpose (SOP)',
  'Digital Passport Photo (White Background)',
] as const;

export function resolvePortalMilestoneStep(
  applicationStage?: string | null,
  leadStatus?: string | null,
  universityApps?: Array<{ status: string }>,
): number {
  const stage = (applicationStage || '').trim().toLowerCase();
  const status = (leadStatus || '').trim().toLowerCase();

  if (stage === 'enrolled' || stage === 'fly' || status === 'enrolled' || status === 'converted') {
    return 6;
  }
  if (
    stage === 'visa' ||
    stage === 'visa_applied' ||
    stage === 'visa_approved' ||
    stage === 'partial_payment' ||
    stage === 'air_ticket' ||
    stage === 'complete_payment' ||
    stage === 'pre_departure' ||
    status === 'visa_approved' ||
    status === 'visa_applied'
  ) {
    return 5;
  }
  if (stage === 'jw202' || stage === 'dq' || stage === 'jw202_issued') {
    return 4;
  }
  if (stage === 'admitted' || stage === 'admission' || stage === 'pre_admission' || stage === 'deposit' || status === 'admission_received') {
    return 3;
  }
  if (universityApps?.some((u) => u.status.toLowerCase() === 'admitted')) {
    return 3;
  }
  if (stage === 'review' || stage === 'interview' || stage === 'university_review') {
    return 2;
  }
  if (universityApps?.some((u) => u.status.toLowerCase() === 'submitted')) {
    return 2;
  }
  if (stage === 'submitted' || status === 'application_submitted' || status === 'application_started') {
    return 1;
  }
  return 1;
}

export function portalProgressPct(step: number): number {
  const bounded = Math.max(1, Math.min(6, Math.round(step)));
  return Math.round((bounded / 6) * 100);
}
