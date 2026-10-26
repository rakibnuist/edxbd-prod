import type { Metadata } from 'next';
import { chinaFocusedGuides } from './chinaFocusedGuides';

export type ChinaGuideSection = {
  heading: string;
  summary: string;
  items?: string[];
  table?: { columns: string[]; rows: string[][] };
  cards?: { title: string; body: string }[];
  steps?: { title: string; body: string }[];
  disclosures?: { title: string; body: string }[];
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

const commonRelated = [
  { label: 'Study in China from Bangladesh', href: '/study-in-china-from-bangladesh' },
  { label: 'Universities and study options', href: '/china-universities' },
  { label: 'China service fee policy', href: '/china-visa-first-policy' },
];

export const chinaGuidePages: Record<string, ChinaGuidePage> = Object.fromEntries(([
  {
    slug: 'china-visa-first-policy',
    code: 'CN TERMS',
    title: 'China Visa First Service Policy',
    metaTitle: 'China Service Payment Policy | EduExpress International',
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
  ...chinaFocusedGuides,
] satisfies ChinaGuidePage[]).map(item => [item.slug, item]));

export function chinaGuideMetadata(slug: string): Metadata {
  const guide = chinaGuidePages[slug];
  if (!guide) return {};
  return {
    title: { absolute: guide.metaTitle }, description: guide.description,
    alternates: { canonical: `/${guide.slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      url: `/${guide.slug}`,
      type: 'website',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Better Education. Clear Costs. Written Proof.' }],
    },
    twitter: { card: 'summary_large_image', title: guide.metaTitle, description: guide.description, images: ['/og-image.jpg'] },
  };
}
