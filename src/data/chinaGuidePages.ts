export type ChinaGuideSection = {
  heading: string;
  summary: string;
  items?: string[];
};

export type ChinaGuidePage = {
  slug: string;
  code: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  directAnswer: string;
  facts: { value: string; label: string; note: string }[];
  sections: ChinaGuideSection[];
  changeRisks: string[];
  notSuitable: string[];
  faqs: { question: string; answer: string }[];
  sources: { label: string; href: string }[];
  related: { label: string; href: string }[];
  ctaTitle: string;
  ctaText: string;
};

const embassy = { label: 'Chinese Embassy in Bangladesh', href: 'https://bd.china-embassy.gov.cn/eng/' };
const embassyVisa = { label: 'Chinese Embassy Bangladesh notice on visa application agencies', href: 'https://bd.china-embassy.gov.cn/eng/lsyw/lsxx/202605/t20260520_11914015.htm' };
const visaCenter = { label: 'Chinese Visa Application Service Center in Dhaka', href: 'https://visaforchina.cn/DAC3_EN' };
const campusChina = { label: 'Campus China and Chinese Government Scholarship portal', href: 'https://www.campuschina.org/' };
const csca = { label: 'Official CSCA portal', href: 'https://csca.cn/' };

const commonRelated = [
  { label: 'Study in China from Bangladesh', href: '/study-in-china-from-bangladesh' },
  { label: 'Universities and study options', href: '/china-universities' },
  { label: 'China service fee policy', href: '/china-visa-first-policy' },
];

export const chinaGuidePages: Record<string, ChinaGuidePage> = Object.fromEntries(([
  {
    slug: 'china-scholarships-bangladesh',
    code: 'CN FUNDING',
    title: 'China Scholarships for Bangladeshi Students',
    metaTitle: 'China Scholarships for Bangladeshi Students | EduExpress',
    description: 'Compare CSC, provincial and university scholarships by eligibility, coverage, renewal terms, CSCA requirements and official source status.',
    eyebrow: 'Funding after education fit',
    directAnswer: 'Bangladeshi students can explore Chinese Government Scholarship, provincial and university awards after confirming that the program and university fit their goals. Coverage can range from a tuition reduction to tuition, accommodation, insurance or a stipend. Each item, renewal condition, eligible program and deadline is matched to the official notice, while the awarding body makes the selection decision.',
    facts: [
      { value: '3', label: 'Funding families', note: 'Government, provincial and university awards' },
      { value: 'Official', label: 'Selection decision', note: 'The awarding body confirms each award' },
      { value: '1st', label: 'Education fit', note: 'Funding is assessed after program suitability' },
    ],
    sections: [
      { heading: 'Chinese Government Scholarship', summary: 'Use the current Campus China notice and the relevant dispatching authority or university instructions. The application route, eligible level, required documents and CSCA position can differ.', items: ['Confirm whether the route is bilateral, university or another official category', 'Use only the official application portal stated in the notice', 'Check whether a pre admission document is required', 'Record the source URL and application period'] },
      { heading: 'Provincial and university awards', summary: 'Coverage is confirmed independently for each institution specific award.', items: ['Identify the university and exact eligible program', 'Separate full tuition from accommodation and living support', 'Check whether the award is automatic, competitive or reviewed after enrolment', 'Confirm whether the award continues beyond the first year'] },
      { heading: 'Eligibility and document screen', summary: 'A funding application normally depends on academic history, age or study level limits, language evidence, study plan and other route specific documents.', items: ['Academic certificates and transcripts', 'Language evidence required by the program', 'Study or research plan appropriate to the level', 'Recommendations and health documents where officially requested', 'CSCA result where the undergraduate route requires it'] },
      { heading: 'Renewal is part of the cost decision', summary: 'An award that can be reduced or removed changes the total program cost. Renewal standards should be written into the ClearCost Sheet.', items: ['Minimum academic performance', 'Attendance and conduct conditions', 'Annual review requirements', 'Coverage after a program or university change'] },
      { heading: 'Scholarship risk check', summary: 'A headline such as “100% scholarship” may refer only to tuition. The student still needs to budget for every uncovered cost and understand the refund status of early payments.' },
    ],
    changeRisks: ['Annual scholarship quotas and eligible programs', 'Application windows and required portals', 'CSCA requirements for undergraduate routes', 'Coverage, renewal rules and stipend values'],
    notSuitable: ['Students who compare program quality before funding', 'Applicants prepared for merit and seat based selection', 'Families with a plan for every cost outside the confirmed coverage'],
    faqs: [
      { question: 'Can a China scholarship cover 100% of tuition?', answer: 'Selected awards may cover full tuition, but the official notice must confirm what “100%” includes. Accommodation, insurance, living expenses, travel and other charges may remain.' },
      { question: 'Who decides a CSC scholarship result?', answer: 'EduExpress can help assess fit and prepare the application. The scholarship authority or university makes the official selection decision.' },
      { question: 'Is CSCA required for scholarship applicants?', answer: 'For current undergraduate Chinese Government Scholarship routes, CSCA can be required. The exact route and university notice must be checked before application.' },
      { question: 'How should I choose a university with a scholarship?', answer: 'Assess recognition, curriculum, academic fit, teaching language and total cost first, then compare the scholarship coverage and renewal conditions.' },
    ],
    sources: [campusChina, csca, embassy],
    related: [...commonRelated, { label: 'Cost of studying in China', href: '/study-in-china-cost-bangladesh' }],
    ctaTitle: 'Check scholarship fit after program fit',
    ctaText: 'Share your academic level and target subject so the team can screen suitable university routes and current funding conditions.',
  },
  {
    slug: 'china-visa-first-policy',
    code: 'CN TERMS',
    title: 'China Visa First Service Policy',
    metaTitle: 'China Visa First Service Policy | EduExpress',
    description: 'Understand EduExpress China service fee timing, third party cost exceptions, written itemization, responsibilities and outcome limits.',
    eyebrow: 'Exact payment terms in writing',
    directAnswer: 'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds. This policy controls EduExpress service fee timing, while genuine university and authority charges remain separate. Universities, scholarship bodies and the responsible authorities issue the official decisions.',
    facts: [
      { value: '0', label: 'File opening charge', note: 'No fee for opening the China file' },
      { value: 'After visa', label: 'EduExpress service fee', note: 'Subject to the written service agreement' },
      { value: 'Written', label: 'Earlier third party costs', note: 'Itemized before the student proceeds' },
    ],
    sections: [
      { heading: 'EduExpress charges', summary: 'The EduExpress service fee is separate from university and authority charges. The written agreement should define the service scope, milestone and amount.' },
      { heading: 'Third party charges that may be due earlier', summary: 'An external recipient may require payment before the visa decision.', items: ['University application or registration fee', 'Tuition or seat deposit required by the university', 'Embassy or visa service charges', 'Medical examination or insurance', 'Translation, notarisation and courier'] },
      { heading: 'Every cost needs five facts', summary: 'Before payment, the cost sheet should state the item, amount or calculation, recipient, due date and refund status.' },
      { heading: 'Student responsibilities', summary: 'The student must provide authentic documents, disclose relevant history, review the written cost sheet and meet university and authority deadlines.' },
      { heading: 'EduExpress responsibilities and limits', summary: 'EduExpress provides the agreed guidance, application proof tracking and visa readiness support. Universities, scholarship bodies and government authorities make their own decisions.' },
      { heading: 'Example cost separation', summary: 'A university deposit paid to the institution is not an EduExpress service fee. A medical charge paid to a clinic is not an EduExpress service fee. The written cost sheet should make that distinction visible.' },
    ],
    changeRisks: ['University deposits and refund rules', 'Authority and medical charges', 'Scope agreed for a particular student', 'External deadlines and recipient instructions'],
    notSuitable: ['Students who understand that genuine third party payments may be due earlier', 'Applicants who understand where each official decision is made', 'Students ready to review the written recipient and refund status'],
    faqs: [
      { question: 'Is there a China file opening charge?', answer: 'No. EduExpress does not charge a file opening fee for the China service.' },
      { question: 'When is the EduExpress China service fee paid?', answer: 'No EduExpress service fee is due before China visa approval, subject to the written service agreement.' },
      { question: 'Can a university fee be required before visa approval?', answer: 'Yes. A university, embassy, medical provider or another third party may require a genuine earlier payment. It must be itemized in writing before the student proceeds.' },
      { question: 'What does a payment cover?', answer: 'Each payment covers the service or third party item stated in writing. The responsible authorities issue admission, scholarship and visa decisions.' },
    ],
    sources: [embassyVisa, visaCenter, embassy],
    related: [...commonRelated, { label: 'Fees and transparency', href: '/fees-and-transparency' }],
    ctaTitle: 'Request your China cost and responsibility summary',
    ctaText: 'Start with a fit assessment, then receive the relevant payment items and recipients in writing.',
  },
] satisfies ChinaGuidePage[]).map(item => [item.slug, item]));
