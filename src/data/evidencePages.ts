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

const reviewedAt = '2026-11-15';
const nextReviewAt = '2027-02-15';

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
      { heading: 'What you receive', body: 'Where appropriate, the assessment leads to an EduFit Decision Report comparing at least three suitable options, followed by an Itemised Fee Schedule and an Application Proof Pack.' },
      { heading: 'Who this process serves best', body: 'This process is designed for students who value an evidence based recommendation and understand that universities, scholarship bodies and government authorities issue the official decisions.' },
    ],
    sources: [
      { label: 'Campus China (Ministry of Education / CSC Official Portal)', href: 'https://www.campuschina.org/' },
      { label: 'Bangladesh Medical & Dental Council (BMDC)', href: 'https://www.bmdc.org.bd/' },
      { label: 'Malaysian Qualifications Register (MQR / MQA)', href: 'https://www2.mqa.gov.my/mqr/' },
      { label: 'UK Visas and Immigration — Student Visas', href: 'https://www.gov.uk/browse/visas-immigration/student-visas' },
    ],
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
    sources: [
      { label: 'Ministry of Education of the People’s Republic of China', href: 'http://en.moe.gov.cn/' },
      { label: 'Campus China (Official Study in China Portal)', href: 'https://www.campuschina.org/' },
      { label: 'Malaysian Qualifications Register (MQR / MQA)', href: 'https://www2.mqa.gov.my/mqr/' },
      { label: 'World Directory of Medical Schools (WDOMS)', href: 'https://www.wdoms.org/' },
      { label: 'Bangladesh Medical & Dental Council (BMDC)', href: 'https://www.bmdc.org.bd/' },
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
    description: 'How to raise a concern with EduExpress International, and the timelines each complaint is reviewed and resolved against.',
    eyebrow: 'Accountability in writing',
    intro: 'If any part of our service falls short, you can raise it directly and expect a written response. Complaints are recorded as dedicated cases with an owner, submission time, supporting evidence and a written resolution trail.',
    sections: [
      { heading: 'How to raise a concern', body: 'Send the details to our office by email or phone, or in person at the Dhanmondi decision desk. Include your name, contact number, the service or counselor involved, the relevant dates and the outcome you are seeking. Avoid sending sensitive document numbers through public channels.', items: ['Email: info@eduexpressint.com', 'Phone: +880 1983-333566', 'In person: Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209'] },
      { heading: 'What happens next', body: 'We acknowledge every complaint in writing within two working days, assign a management owner, review the file and any documents involved, and provide a written response with our findings and next steps within ten working days. Complex cases that need third-party confirmation are updated at each stage.' },
      { heading: 'Escalation and records', body: 'If the first response does not resolve the issue, you can request a senior review by management. Refund questions are assessed against the written fee schedule, recipient, milestone and applicable terms. Every complaint, its evidence and its resolution are recorded so patterns can be identified and the service improved.' },
      { heading: 'What we do not control', body: 'Admission, scholarship and visa decisions are made by universities, scholarship bodies and government authorities. We can explain a decision, check for errors in our own work and correct them, but we cannot overturn an official authority’s decision.' },
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
      { heading: 'Service status matters', body: 'All 12 listed destination services are open. China is the flagship because it has the deepest published EduExpress evidence base; every other listed country is active for counselling and application support.' },
      { heading: 'Your next step', body: 'Complete the Education Fit Assessment to receive a written summary of suitable routes, risks and missing information.' },
    ],
    sources: [
      { label: 'Campus China (Official Study in China Portal)', href: 'https://www.campuschina.org/' },
      { label: 'Education Malaysia Global Services (EMGS)', href: 'https://educationmalaysia.gov.my/' },
      { label: 'UK Visas and Immigration — Student Visa', href: 'https://www.gov.uk/student-visa' },
      { label: 'Study in Korea (NIIED Official Portal)', href: 'https://www.studyinkorea.go.kr/' },
      { label: 'Study in Finland (EDUFI Official Guide)', href: 'https://www.studyinfinland.fi/' },
      { label: 'Study in Hungary (Tempus Public Foundation)', href: 'https://studyinhungary.hu/' },
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
    sources: [
      { label: 'Campus China (Official Study in China Portal)', href: 'https://www.campuschina.org/' },
      { label: 'Embassy of the People’s Republic of China in Bangladesh', href: 'https://bd.china-embassy.gov.cn/eng/' },
      { label: 'Education Malaysia Global Services (EMGS)', href: 'https://educationmalaysia.gov.my/' },
      { label: 'UK Visas and Immigration — Student Visa', href: 'https://www.gov.uk/student-visa' },
    ],
  }),
].map((item) => [item.slug, item]));
