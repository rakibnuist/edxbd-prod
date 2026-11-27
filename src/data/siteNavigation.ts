import { destinationPath } from '@/lib/site-urls';

export type SiteLink = {
  name: string;
  href: string;
  note?: string;
  code?: string;
};

/**
 * Public information architecture.
 *
 * Keep this file as the single source for the header, footer and destination
 * discovery. Every public destination is open for counselling and application
 * support. China remains the flagship because it has the deepest published
 * evidence base; "flagship" is not a gate on the other destinations.
 */
export const destinationLinks: SiteLink[] = [
  { name: 'China', href: '/study-in-china-from-bangladesh', note: 'Flagship route', code: 'CN' },
  { name: 'United Kingdom', href: destinationPath('uk'), note: 'Open for applications', code: 'UK' },
  { name: 'Hungary', href: destinationPath('hungary'), note: 'Open for applications', code: 'HU' },
  { name: 'South Korea', href: destinationPath('south-korea'), note: 'Open for applications', code: 'KR' },
  { name: 'Finland', href: destinationPath('finland'), note: 'Open for applications', code: 'FI' },
  { name: 'Malaysia', href: destinationPath('malaysia'), note: 'Open for applications', code: 'MY' },
  { name: 'Malta', href: destinationPath('malta'), note: 'Open for applications', code: 'MT' },
  { name: 'Cyprus', href: destinationPath('cyprus'), note: 'Open for applications', code: 'CY' },
  { name: 'Georgia', href: destinationPath('georgia'), note: 'Open for applications', code: 'GE' },
  { name: 'Greece', href: destinationPath('greece'), note: 'Open for applications', code: 'GR' },
  { name: 'Croatia', href: destinationPath('croatia'), note: 'Open for applications', code: 'HR' },
  { name: 'Thailand', href: destinationPath('thailand'), note: 'Open for applications', code: 'TH' },
];

export const findEducationNavigation: SiteLink[] = [
  { name: 'Find education hub', href: '/find-education', note: 'Start with subject, level, budget and intake' },
  { name: 'Find universities', href: '/universities', note: 'Browse verified university records' },
  { name: 'Program & tuition finder', href: '/programs', note: 'Search programs by yearly tuition budget' },
  { name: 'Compare costs', href: '/compare-costs', note: 'First-year costs for up to 3 programs' },
  { name: 'Scholarship database', href: '/scholarships', note: 'Search recorded coverage and deadlines' },
  { name: 'Compare destinations', href: '/compare-study-destinations', note: 'Compare recognition, cost and readiness' },
  { name: 'Bangladesh Study Abroad Market', href: '/bangladesh-study-abroad-market', note: '2027 trends, 12 destinations, Student File & BDT data' },
  { name: 'China vs. UK/USA/AU & Dhaka', href: '/compare-bachelor-china-abroad-bangladesh', note: 'Rankings, university scholarships & separated tuition' },
  { name: 'Bangladesh vs. China', href: '/bangladesh-vs-china-bachelor-study', note: 'NSU/EWU/AIUB vs. top-ranked China universities' },
  { name: 'Bangladesh vs. Abroad', href: '/bangladesh-vs-study-abroad-countries', note: 'Local study vs. Malaysia, UK, Europe & Western routes' },
  { name: 'Malaysia after O-Level', href: '/study-in-malaysia-after-o-level', note: '1-year Foundation & 2-year Diploma routes' },
  { name: 'China after O-Level / SSC', href: '/study-in-china-after-o-level-ssc', note: '3-year Diploma + 2-year top-up Bachelor' },
  { name: 'Free Education Fit Assessment', href: '/education-fit-assessment', note: 'Turn your profile into a practical shortlist' },
];

export const journeyNavigation: SiteLink[] = [
  { name: 'See the complete journey', href: '/your-study-journey', note: 'From first profile to university registration' },
  { name: '1. Education fit', href: '/your-study-journey#education-fit', note: 'Open your profile and goals' },
  { name: '2. Compare options', href: '/your-study-journey#compare-options', note: 'Assess university and program fit' },
  { name: '3. Clear costs', href: '/your-study-journey#clear-costs', note: 'See the full financial picture' },
  { name: '4. Application file', href: '/your-study-journey#application-file', note: 'Prepare and check every document' },
  { name: '5–7. Visa to registration', href: '/your-study-journey#visa-to-registration', note: 'Prepare, travel, arrive and register' },
];

export const serviceNavigation: SiteLink[] = [
  { name: 'How EduExpress helps', href: '/services', note: 'See services, responsibilities and limits' },
  { name: 'Education counselling', href: '/education-fit-assessment', note: 'Profile-led advice before applications' },
  { name: 'Application support', href: '/your-study-journey#application-file', note: 'Document checks and application records' },
  { name: 'Visa readiness', href: '/your-study-journey#visa-to-registration', note: 'A checklist, not a visa guarantee' },
  { name: 'Parents and families', href: '/for-parents', note: 'Costs, safety and responsibilities explained' },
  { name: 'Education consultant in Dhaka', href: '/education-consultant-dhaka', note: 'Visit the Dhanmondi office or call the team' },
  { name: 'B2B Partner Desk', href: '/b2b', note: 'Agency & sub-agent admissions processing under written MOU' },
  { name: 'Visit or contact us', href: '/contact', note: 'Dhanmondi office, phone and WhatsApp' },
];

export const chinaNavigation: SiteLink[] = [
  { name: 'Study in China hub', href: '/study-in-china-from-bangladesh', note: 'Start with the complete decision guide' },
  { name: 'China universities', href: '/china-universities', note: 'Compare university and program records' },
  { name: 'Programs by budget', href: '/programs', note: 'Find programs within your yearly tuition' },
  { name: 'China scholarships', href: '/china-scholarships-bangladesh', note: 'Explore documented scholarship routes' },
  { name: 'After O-Level, SSC & Dakhil (3+2)', href: '/study-in-china-after-o-level-ssc', note: '5-year Diploma-to-Bachelor pathway' },
  { name: 'Bangladesh vs China Bachelor', href: '/bangladesh-vs-china-bachelor-study', note: 'Compare Dhaka private uni vs China 4-year costs' },
  { name: 'Bangladesh vs China MBBS', href: '/bangladesh-vs-china-mbbs', note: 'Private medical in BD vs China MOE MBBS comparison' },
  { name: 'Student visa guide', href: '/china-student-visa-bangladesh', note: 'Prepare for the X1 or X2 route' },
  { name: 'Cost planner', href: '/study-in-china-cost-bangladesh', note: 'Plan tuition and living costs' },
  { name: 'Intakes and deadlines', href: '/china-intakes-deadlines', note: 'Review the application cycle' },
  { name: 'China cost & data report', href: '/china-study-report-bangladesh', note: 'Live CNY tuition quartiles and scholarship counts' },
  { name: 'বাংলা চায়না গাইড', href: '/bn/study-in-china', note: 'বাংলাদেশি শিক্ষার্থীদের জন্য সম্পূর্ণ বাংলা গাইড' },
  { name: 'SSC ও দাখিলের পর চীন (৩+২)', href: '/bn/study-in-china-after-ssc-dakhil', note: '৫ বছরে ডিপ্লোমা ও ব্যাচেলর বাংলা গাইড' },
];

export const proofNavigation: SiteLink[] = [
  { name: 'Public proof library', href: '/proof-library', note: 'Inspect redacted evidence and company records' },
  { name: 'Better Education Standard', href: '/better-education-standard', note: 'The checks behind a recommendation' },
  { name: 'Fees and transparency', href: '/fees-and-transparency', note: 'Know who receives each payment' },
  { name: 'University verification', href: '/how-we-verify-universities', note: 'How recognition and records are checked' },
  { name: 'Student success stories', href: '/success-stories', note: 'Real student outcomes' },
  { name: 'Country service status', href: '/country-status', note: 'Which destinations are open and how they are verified' },
  { name: 'Complaints and resolution', href: '/complaints-and-resolution', note: 'Accountability and written response times' },
];

export const resourceNavigation: SiteLink[] = [
  { name: 'Education updates', href: '/updates', note: 'New universities, scholarships, programs and tips' },
  { name: 'Bangladesh study abroad report', href: '/bangladesh-study-abroad-market', note: 'Market trends, 12 destinations & Student File rules' },
  { name: 'Study in China guides', href: '/study-in-china-from-bangladesh', note: 'Costs, visas, intakes and student life' },
  { name: 'For parents', href: '/for-parents', note: 'A family view of the complete journey' },
  { name: 'About EduExpress', href: '/about', note: 'Our company and working method' },
  { name: 'B2B Partner Desk', href: '/b2b', note: 'Agency & sub-agent file processing under written MOU' },
  { name: 'Partner with us', href: '/partnership', note: 'Institutional and referral cooperation' },
  { name: 'Contact the decision desk', href: '/contact', note: 'Dhanmondi office, phone and hours' },
];

export const primaryNavigation = [
  { name: 'Find Education', href: '/find-education', menu: 'find' as const },
  { name: 'Destinations', href: '/destinations', menu: 'destinations' as const },
  { name: 'Your Journey', href: '/your-study-journey', menu: 'journey' as const },
  { name: 'How We Help', href: '/services', menu: 'services' as const },
  { name: 'Proof', href: '/better-education-standard', menu: 'proof' as const },
  { name: 'Updates', href: '/updates', menu: 'resources' as const },
];

// Header groups for the simplified primary navigation (5 items). Plain labels
// a first-time student or parent recognises without decoding the brand terms.
export const costNavigation: SiteLink[] = [
  { name: 'Scholarship guidance', href: '/scholarships', note: 'What awards really cover and who qualifies' },
  { name: 'China scholarships (CSC 306 list)', href: '/china-scholarships-bangladesh', note: 'CSC Type A/B, provincial and university awards' },
  { name: 'Cost of studying in China', href: '/study-in-china-cost-bangladesh', note: 'Tuition, hostel, insurance, visa and travel' },
  { name: 'Cost of studying in Malaysia', href: '/malaysia-study-cost-bangladesh', note: 'RM/BDT tuition, EMGS, Student File and BDT 0 service fee' },
  { name: 'Visa Bank Solvency Calculator', href: '/student-visa-bank-solvency-bangladesh', note: 'Calculate 12-country bank statement & FDR in BDT' },
  { name: 'Study Gap Eligibility Matcher', href: '/study-gap-acceptable-countries-bangladesh', note: 'Check HSC/Bachelor study gap rules across 12 countries' },
  { name: 'Study Without IELTS (MOI Matcher)', href: '/study-abroad-without-ielts-from-bangladesh', note: 'Check MOI vs IELTS/PTE visa rules by destination' },
  { name: 'BMDC Foreign Medical Checker', href: '/bmdc-recognized-medical-colleges-abroad', note: 'Verify China MOE 45-list & BMDC eligibility before MBBS' },
  { name: 'MOFA e-Apostille Workflow Builder', href: '/document-attestation-apostille-bangladesh', note: 'Step-by-step Education Board, MOFA & Embassy attestation' },
  { name: 'Malaysia after O-Level', href: '/study-in-malaysia-after-o-level', note: '1-year Foundation or 2-year Diploma routes' },
  { name: 'China vs UK, USA, Australia & Dhaka', href: '/compare-bachelor-china-abroad-bangladesh', note: '4-year bachelor tuition & scholarship matrix' },
  { name: 'Bangladesh vs Abroad matrix', href: '/bangladesh-vs-study-abroad-countries', note: 'Compare 7 bachelor routes side by side' },
  { name: 'Bangladesh Study Abroad Market 2027', href: '/bangladesh-study-abroad-market', note: '12-country tuition, living & Student File report' },
  { name: 'Our fees, in writing', href: '/fees-and-transparency', note: 'What you pay us, when, and what is refundable' },
  { name: 'Compare destinations', href: '/compare-study-destinations', note: 'Cost and entry side by side' },
];

export const aboutNavigation: SiteLink[] = [
  { name: 'About EduExpress', href: '/about', note: 'Our team and Dhanmondi office, since 2018' },
  { name: 'Education consultant in Dhaka', href: '/education-consultant-dhaka', note: 'Visit our Dhanmondi office or book free counselling' },
  { name: 'How it works', href: '/your-study-journey', note: 'From free assessment to arrival' },
  { name: 'What we do for you', href: '/services', note: 'Counselling, applications and visa support' },
  { name: 'Student success stories', href: '/success-stories', note: 'Stories from our students' },
  { name: 'Proof library', href: '/proof-library', note: 'Redacted evidence and company records' },
  { name: 'For parents', href: '/for-parents', note: 'Costs, safety and responsibilities' },
  { name: 'B2B Partner Desk', href: '/b2b', note: 'Agency admissions processing & bilateral MOU terms' },
  { name: 'Partner with us', href: '/partnership', note: 'Global Partner Programme & regional cooperation' },
  { name: 'বাংলা গাইড (Study in China)', href: '/bn/study-in-china', note: 'চীন পড়াশোনা, খরচ ও ভিসা গাইড (বাংলায়)' },
  { name: 'মালয়েশিয়ায় উচ্চশিক্ষা (বাংলা গাইড)', href: '/bn/study-in-malaysia-from-bangladesh', note: '০ টাকা সার্ভিস ফি ও EMGS ভিসা গাইড (বাংলায়)' },
  { name: 'বিদেশে উচ্চশিক্ষা ২০২৭ মার্কেট গাইড', href: '/bn/bangladesh-study-abroad-market', note: '১২টি দেশের টিউশন ও স্টুডেন্ট ফাইল বাংলা গাইড' },
  { name: 'Contact and visit us', href: '/contact', note: 'Phone, WhatsApp and office hours' },
];
