export type EvidencePage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  sections: { heading: string; body: string; items?: string[] }[];
  sources?: { label: string; href: string }[];
  reviewedAt: string;
  nextReviewAt: string;
};

const reviewedAt = '2026-07-19';
const nextReviewAt = '2026-10-19';
const chinaOffer = 'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';

const page = (data: Omit<EvidencePage, 'reviewedAt' | 'nextReviewAt'>): EvidencePage => ({
  ...data,
  reviewedAt,
  nextReviewAt,
});

export const evidencePages: Record<string, EvidencePage> = Object.fromEntries([
  page({
    slug: 'better-education-standard',
    title: 'The Better Education Standard',
    description: 'The six checks EduExpress uses before recommending an overseas education option.',
    eyebrow: 'How decisions are made',
    intro: 'A recommendation should be explainable in writing. EduExpress compares recognition, academic fit, career value, total financial reality, visa readiness, and student support before recommending a route.',
    sections: [
      { heading: 'Six evidence checks', body: 'Every recommendation is assessed against the same standard.', items: ['Recognition through an official registry or accreditor', 'Academic fit based on entry requirements and curriculum', 'Career value framed through evidence and realistic pathways', 'Tuition, living costs, official fees and EduExpress charges', 'Visa-readiness gaps checked against official guidance', 'Student support, safety and limits of responsibility'] },
      { heading: 'What you receive', body: 'Where appropriate, the assessment leads to an EduFit Decision Report comparing at least three suitable options, followed by a ClearCost Sheet and an Application Proof Pack.' },
      { heading: 'Who this process serves best', body: 'This process is designed for students who value an evidence based recommendation and understand that universities, scholarship bodies and government authorities issue the official decisions.' },
    ],
  }),
  page({
    slug: 'fees-and-transparency',
    title: 'Fees and Transparency',
    description: 'How EduExpress separates service charges from university, embassy and other third-party costs.',
    eyebrow: 'Clear costs before commitment',
    intro: 'Before a student proceeds, each expected payment should identify its purpose, amount or calculation method, recipient, due date and refund status. EduExpress charges must be shown separately from third-party costs.',
    sections: [
      { heading: 'ClearCost Sheet', body: 'The written cost schedule separates tuition, deposits, embassy charges, medicals, insurance, translation, courier and other external costs from EduExpress service charges.' },
      { heading: 'China service terms', body: chinaOffer },
      { heading: 'Payment and decision clarity', body: 'Payments cover the stated service or third party item, while admission, scholarship and visa decisions remain with the responsible authority. Refund terms and exceptions are recorded in writing before payment.' },
    ],
  }),
  page({
    slug: 'china-visa-first-policy',
    title: 'China Visa-First Service Policy',
    description: 'The exact China service-fee timing, third-party cost exceptions and responsibilities.',
    eyebrow: 'Written China service terms',
    intro: chinaOffer,
    sections: [
      { heading: 'What may be payable earlier', body: 'A university or authority may require an application fee, deposit, medical, translation, courier, insurance or embassy-related payment before a visa decision. Each item must be disclosed in writing with the recipient and refund status.' },
      { heading: 'What EduExpress provides', body: 'Education-fit comparison, application guidance, document-readiness checks, proof tracking, visa-readiness support and pre-departure guidance within the agreed scope.' },
      { heading: 'Shared responsibilities', body: 'Students provide accurate documents and meet deadlines, EduExpress supports the agreed preparation process, and universities, scholarship bodies and Chinese authorities issue each official decision.' },
    ],
    sources: [{ label: 'Embassy of the People’s Republic of China in Bangladesh', href: 'http://bd.china-embassy.gov.cn/eng/' }],
  }),
  page({
    slug: 'how-we-verify-universities',
    title: 'How We Verify Universities and Programs',
    description: 'EduExpress verification rules for institutions, programs, recognition, fees and partnerships.',
    eyebrow: 'Evidence before recommendation',
    intro: 'EduExpress records the official institution name, source URL, recognition or accreditation evidence, program details, fees, intake status and the date each fact was checked.',
    sections: [
      { heading: 'Verification record', body: 'Each record uses a unique ID and stores aliases, official links, recognition notes, exact program names, tuition periods, intake dates and source-expiry dates.' },
      { heading: 'Relationship labels', body: 'Direct partner, authorized representative, network access, public direct application and unverified are different relationships. We use “partner” only when supporting evidence is current.' },
      { heading: 'Current detail review', body: 'After its review date, time sensitive information enters a fresh source check. Application action becomes available again when the current deadline and official source are recorded.' },
    ],
  }),
  page({
    slug: 'student-data-privacy',
    title: 'Student Data and Document Privacy',
    description: 'How EduExpress handles consent, sensitive documents, access and retention.',
    eyebrow: 'Privacy by design',
    intro: 'EduExpress collects only the information needed for assessment and agreed application support. Consent is recorded with a timestamp and policy version.',
    sections: [
      { heading: 'Sensitive documents', body: 'Passport numbers, dates of birth, visa identifiers, financial documents and academic records must not appear in public stories, posts or review replies.' },
      { heading: 'Access and retention', body: 'Access should be limited to assigned staff, logged where sensitive files are involved, and removed according to the documented retention schedule or a valid deletion request.' },
      { heading: 'Student choices', body: 'Students may ask what is held, correct inaccurate data, withdraw optional marketing consent, or request deletion where legal and operational retention duties allow.' },
    ],
  }),
  page({
    slug: 'complaints-and-resolution',
    title: 'Complaints and Resolution',
    description: 'A timestamped process for raising and resolving an EduExpress service complaint.',
    eyebrow: 'A clear escalation path',
    intro: 'Complaints are recorded as dedicated cases with an owner, submission time, supporting evidence and a written resolution trail.',
    sections: [
      { heading: 'How to complain', body: 'Contact EduExpress with your name, contact details, service, relevant dates, the issue and the resolution you seek. Avoid sending sensitive document numbers through public channels.' },
      { heading: 'What happens next', body: 'The team acknowledges the case, assigns a management owner, reviews the evidence and communicates either a resolution or a reasoned progress update.' },
      { heading: 'Escalation', body: 'If the first response does not resolve the issue, request management review. Refund questions are assessed against the written fee schedule, recipient, milestone and applicable terms.' },
    ],
  }),
  page({
    slug: 'compare-study-destinations',
    title: 'Compare Study Destinations',
    description: 'Compare education quality, recognition, costs, visa readiness and career fit before choosing a country.',
    eyebrow: 'Compare before you commit',
    intro: 'A country is not “best” in isolation. The right choice depends on your academic profile, subject, recognition needs, total budget, language readiness, risk tolerance and career goal.',
    sections: [
      { heading: 'Comparison criteria', body: 'Use the Better Education Standard rather than comparing scholarships or tuition alone.', items: ['Recognition and program quality', 'Entry and language fit', 'Full first-year and total-program cost', 'Funding conditions and renewal rules', 'Visa-readiness requirements', 'Student support and realistic career pathways'] },
      { heading: 'Service status matters', body: 'China is the flagship service. Other countries must pass the eight-part launch gate before EduExpress presents them as active.' },
      { heading: 'Your next step', body: 'Complete the Education Fit Assessment to receive a written summary of suitable routes, risks and missing information.' },
    ],
  }),
  page({
    slug: 'country-status',
    title: 'Country Service Status',
    description: 'See the EduExpress flagship and active destination education services.',
    eyebrow: 'Honest service readiness',
    intro: 'Destination status reflects whether EduExpress has verified information, trained ownership, service terms, operational workflows and current content—not simply whether a country is popular.',
    sections: [
      { heading: 'Flagship', body: 'China — the current proof engine and most developed EduExpress destination service with visa-first service terms.' },
      { heading: 'Active Destination Services', body: 'United Kingdom, Hungary, South Korea, Finland, Malaysia, Malta, Cyprus, Georgia, Greece, Croatia, and Thailand have active education services with trained country ownership, clear costs, and institution verification.' },
      { heading: 'Evidence & Integrity Rule', body: 'Every destination operates under the Better Education Standard. Success statistics and student testimonials are never borrowed from another country.' },
    ],
  }),
  page({
    slug: 'education-consultant-dhaka',
    title: 'Education Consultant in Dhanmondi, Dhaka',
    description: 'Visit EduExpress International for evidence-first overseas education guidance in Dhanmondi.',
    eyebrow: 'EduExpress International Bangladesh',
    intro: 'Meet the team to compare education quality, total cost, recognition and career fit before choosing an overseas study route.',
    sections: [
      { heading: 'Office', body: 'House 12/1, Ground Floor, Road 4/A, Dhanmondi, Dhaka 1209\n+880 1983-333566\n+880 1329-663505\nSaturday-Thursday 11:00 AM-6:00 PM, Friday closed' },
      { heading: 'What to expect', body: 'An initial Education Fit Assessment, a discussion of decision factors and missing information, and a clear next step. Universities, scholarship bodies and authorities issue the official outcomes.' },
      { heading: 'China fee timing', body: chinaOffer },
    ],
  }),
  page({
    slug: 'study-in-china-from-bangladesh',
    title: 'Study in China from Bangladesh',
    description: 'Compare Chinese universities, costs, scholarships, recognition, intakes and visa readiness with written evidence.',
    eyebrow: 'EduExpress flagship destination',
    intro: 'China can suit Bangladeshi students seeking a broad university choice, technical and research programs, and multiple funding routes—but the decision should start with program quality, recognition, full cost and career fit, not a scholarship promise.',
    sections: [
      { heading: 'Who China may fit', body: 'Students prepared to compare program recognition, language of instruction, university-specific entry rules, total costs and the realities of living in China.' },
      { heading: 'What to verify', body: 'Confirm the official program, teaching language, recognition needs, tuition and hostel terms, scholarship renewal conditions, intake deadline and visa documents directly from current official sources.' },
      { heading: 'Costs and scholarships', body: 'Scholarships are an affordability factor assessed after education fit. University fees, deposits, medicals, insurance, travel and living costs vary and must be itemized with the source and date checked.' },
      { heading: 'Visa-first service terms', body: chinaOffer },
      { heading: 'What may change', body: 'Scholarship notices, university deadlines, fees and embassy procedures can change. Recheck the linked official sources before acting.' },
    ],
    sources: [{ label: 'Chinese Embassy in Bangladesh', href: 'http://bd.china-embassy.gov.cn/eng/' }, { label: 'Campus China / CSC', href: 'https://www.campuschina.org/' }],
  }),
  ...[
    ['china-universities', 'Chinese Universities for Bangladeshi Students', 'Compare verified programs, fees, recognition and intake status—not a “partner” label alone.'],
    ['china-scholarships-bangladesh', 'China Scholarships for Bangladeshi Students', 'Compare CSC, provincial and university funding only after confirming education fit, eligibility, coverage and renewal rules.'],
    ['china-student-visa-bangladesh', 'China X1/X2 Student Visa from Bangladesh', 'Prepare against current embassy guidance. Visa type, documents and timing depend on the study duration and official admission documents.'],
    ['study-in-china-cost-bangladesh', 'Cost of Studying in China from Bangladesh', 'Build a dated ClearCost Sheet covering tuition, hostel, food, insurance, medicals, visa-related costs, flights and currency assumptions.'],
    ['study-in-china-without-ielts', 'Study in China Without IELTS', 'Some universities may accept other evidence of English ability, but there is no universal IELTS exemption. Verify the exact program rule in writing.'],
    ['mbbs-in-china-bangladesh', 'MBBS in China for Bangladeshi Students', 'Start with program-specific recognition and the licensing route for the intended country of practice before comparing price or scholarships.'],
    ['china-intakes-deadlines', 'China Intakes and Deadlines', 'March and September are common intake periods, but every university and scholarship deadline must be individually verified before showing an open status.'],
    ['life-in-china-bangladeshi-students', 'Life in China for Bangladeshi Students', 'Plan realistically for housing, halal food, language, banking, insurance, safety, culture and the current rules that affect student work.'],
    ['china-success-stories', 'China Student Success Stories', 'Only consent-based, evidence-backed stories are published. Sensitive identifiers are always redacted and every outcome is presented as an individual case.'],
    ['success-stories/china', 'China Education Outcomes and Stories', 'Read consent-based accounts explaining the student profile, options considered, timeline, support provided and outcome.'],
  ].map(([slug, title, intro]) => page({
    slug,
    title,
    description: intro,
    eyebrow: 'China evidence guide',
    intro,
    sections: [
      { heading: 'Decision first', body: 'Compare education quality, recognition, academic fit, total cost and career value before treating a scholarship or visa route as the deciding factor.' },
      { heading: 'Evidence required', body: 'Time-sensitive facts must include an official source URL, a verification date and a next-review date. University-specific rules must not be generalized to all institutions.' },
      { heading: 'A strong fit for this route', body: 'This route works best for students ready to meet current requirements, review written evidence and make decisions with the responsible institution or authority holding final approval.' },
      { heading: 'EduExpress China terms', body: chinaOffer },
    ],
    sources: [{ label: 'Chinese Embassy in Bangladesh', href: 'http://bd.china-embassy.gov.cn/eng/' }, { label: 'Campus China / CSC', href: 'https://www.campuschina.org/' }],
  })),
].map((item) => [item.slug, item]));
