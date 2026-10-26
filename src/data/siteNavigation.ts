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
  { name: 'Scholarship guidance', href: '/scholarships', note: 'Understand fit, coverage and conditions' },
  { name: 'Compare destinations', href: '/compare-study-destinations', note: 'Compare recognition, cost and readiness' },
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
  { name: 'Visit or contact us', href: '/contact', note: 'Dhanmondi office, phone and WhatsApp' },
];

export const chinaNavigation: SiteLink[] = [
  { name: 'Study in China hub', href: '/study-in-china-from-bangladesh', note: 'Start with the complete decision guide' },
  { name: 'China universities', href: '/china-universities', note: 'Compare university and program records' },
  { name: 'China scholarships', href: '/china-scholarships-bangladesh', note: 'Explore documented scholarship routes' },
  { name: 'Student visa guide', href: '/china-student-visa-bangladesh', note: 'Prepare for the X1 or X2 route' },
  { name: 'Cost planner', href: '/study-in-china-cost-bangladesh', note: 'Plan tuition and living costs' },
  { name: 'Intakes and deadlines', href: '/china-intakes-deadlines', note: 'Review the application cycle' },
];

export const proofNavigation: SiteLink[] = [
  { name: 'Public proof library', href: '/proof-library', note: 'Inspect redacted evidence and company records' },
  { name: 'Better Education Standard', href: '/better-education-standard', note: 'The checks behind a recommendation' },
  { name: 'Fees and transparency', href: '/fees-and-transparency', note: 'Know who receives each payment' },
  { name: 'University verification', href: '/how-we-verify-universities', note: 'How recognition and records are checked' },
  { name: 'Student success stories', href: '/success-stories', note: 'Consent-based student outcomes' },
  { name: 'Country service status', href: '/country-status', note: 'Which destinations are open and how they are verified' },
  { name: 'Complaints and resolution', href: '/complaints-and-resolution', note: 'Accountability and written response times' },
];

export const resourceNavigation: SiteLink[] = [
  { name: 'Advice and updates', href: '/updates', note: 'Current study-abroad guidance' },
  { name: 'Study in China guides', href: '/study-in-china-from-bangladesh', note: 'Costs, visas, intakes and student life' },
  { name: 'For parents', href: '/for-parents', note: 'A family view of the complete journey' },
  { name: 'About EduExpress', href: '/about', note: 'Our company and working method' },
  { name: 'Partner with us', href: '/partnership', note: 'Institutional and referral cooperation' },
  { name: 'Contact the decision desk', href: '/contact', note: 'Dhanmondi office, phone and hours' },
];

export const primaryNavigation = [
  { name: 'Find Education', href: '/find-education', menu: 'find' as const },
  { name: 'Destinations', href: '/destinations', menu: 'destinations' as const },
  { name: 'Your Journey', href: '/your-study-journey', menu: 'journey' as const },
  { name: 'How We Help', href: '/services', menu: 'services' as const },
  { name: 'Proof', href: '/better-education-standard', menu: 'proof' as const },
  { name: 'Advice', href: '/updates', menu: 'resources' as const },
];
