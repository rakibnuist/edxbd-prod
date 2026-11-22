import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  FileCheck2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import DhanmondiMapCard from '@/components/office/DhanmondiMapCard';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import { OPEN_DATA_REPOSITORIES } from '@/lib/open-data';
import { pageMetadata } from '@/lib/seo';
import { getPublicTrustRecords } from '@/lib/trust-records';
import { getUniversityRecords } from '@/lib/university-records';
import PaymentRules from '../contact/PaymentRules';

const PATH = '/study-in-china-agency-bangladesh';
const PAGE_URL = `https://eduexpressint.com${PATH}`;
const ORG = { '@id': 'https://eduexpressint.com/#organization' };

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Study in China Agency in Bangladesh — Dhanmondi Visa-First Consultancy',
  description:
    'Looking for a trusted study in China agency in Bangladesh? EduExpress International (Dhanmondi, Dhaka, since 2018) offers 150 verified Chinese universities, written ClearCost sheets, and BDT 0 service fee before China visa approval.',
  path: PATH,
  locale: 'en_BD',
});

const AGENCY_CHECKLIST = [
  {
    criterion: 'Upfront Service Fee Risk',
    redFlag: 'Charging BDT 20,000–50,000 non-refundable "file opening" fees before checking eligibility or submitting an application.',
    eduExpressStandard:
      'No file opening charge. No EduExpress service fee before China visa approval. Third-party university, medical, notarization, or visa fees are itemized in writing before you proceed.',
  },
  {
    criterion: 'Embassy & Visa Authority Claims',
    redFlag: 'Claiming "100% guaranteed China visa" or pretending to be an exclusive embassy-authorized agency.',
    eduExpressStandard:
      'Transparent guidance aligned with the Chinese Embassy in Dhaka: no agency holds exclusive visa authority, and visa decisions rest strictly with consular officers after verified JW201/JW202 issuance.',
  },
  {
    criterion: 'Tuition & Hidden First-Year Fees',
    redFlag: 'Quoting only discounted tuition while hiding hostel, insurance, medical check, residence permit, or registration charges.',
    eduExpressStandard:
      'Public ClearCost database covering 150 verified Chinese universities and itemized non-tuition fees, plus a written first-year cost sheet naming every recipient and due date.',
  },
  {
    criterion: 'MBBS & Degree Recognition',
    redFlag: 'Pushing cheap unverified medical colleges without checking Chinese MoE English-medium lists or BMDC eligibility.',
    eduExpressStandard:
      'Leads every medical enquiry with MoE recognition, clinical teaching language, and Bangladesh Medical & Dental Council (BMDC) RQE licensing eligibility before discussing price.',
  },
  {
    criterion: 'Scholarships (CSC, Provincial, University)',
    redFlag: 'Selling "guaranteed 100% full CSC scholarships" regardless of GPA, subject fit, or renewal rules.',
    eduExpressStandard:
      'Honest eligibility review against official 2026/27 CSC Type A/B, provincial, and university rules — clearly distinguishing full stipends from partial tuition waivers and annual GPA renewal conditions.',
  },
  {
    criterion: 'Physical Office & Legal Entity',
    redFlag: 'Social-media-only operators without a verifiable Dhaka office, written refund policy, or transparent complaints desk.',
    eduExpressStandard:
      'Permanent ground-floor office since 2018 at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209 (parents welcome Sat–Thu, 11 AM–6 PM), published fee & complaints policies, and CERN-archived open data.',
  },
] as const;

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Education Fit Assessment',
    detail: 'Review SSC/O-Level, HSC/A-Level, or Bachelor results, subject interest, English/HSK readiness, and realistic family budget.',
  },
  {
    step: '02',
    title: 'Verified Shortlist & Comparison',
    detail: 'Compare 2–3 suitable universities from our 150-university China catalog side by side with official degree and recognition checks.',
  },
  {
    step: '03',
    title: 'Written ClearCost Sheet',
    detail: 'Receive every institutional fee, living estimate, third-party charge, and EduExpress post-visa term in writing before spending.',
  },
  {
    step: '04',
    title: 'Document & Application Tracking',
    detail: 'Notarization, study plan review, CSCA/interview prep where required, and transparent proof of portal submission.',
  },
  {
    step: '05',
    title: 'JW201 / JW202 & X1 Visa File',
    detail: 'Official Admission Notice verification, Foreigner Physical Examination Form, police clearance, and CVASC Dhaka visa file readiness.',
  },
  {
    step: '06',
    title: 'Post-Visa Settlement & Pre-Departure',
    detail: 'EduExpress China service fee applies only after X1/X2 visa approval, followed by airport pickup coordination and arrival orientation.',
  },
] as const;

const FAQS = [
  {
    question: 'How do I choose a reliable study in China agency in Bangladesh?',
    answer:
      'Verify five things before paying any agency: (1) a permanent physical office where parents can meet counsellors in person, (2) a written cost breakdown separating official university fees from consultancy charges, (3) zero "100% visa" or "guaranteed CSC scholarship" promises, (4) explicit MoE/BMDC recognition checks for MBBS, and (5) transparent proof of official university portal submissions and JW201/JW202 forms.',
  },
  {
    question: 'Does any consultancy in Bangladesh have exclusive authority from the Chinese Embassy or CSC?',
    answer:
      'No. The Chinese Embassy in Bangladesh explicitly notes that it has not authorized any exclusive visa agency, and students may also apply directly on official Chinese university and CSC portals. EduExpress International operates as an independent guidance, document-verification, and application-support consultancy in Dhanmondi, Dhaka.',
  },
  {
    question: 'What is EduExpress International’s exact China Visa-First fee policy?',
    answer:
      'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds. Our post-visa Complete China Support Package is BDT 2,00,000, payable only after China student visa approval.',
  },
  {
    question: 'Can I compare Chinese university fees and scholarships before visiting your Dhanmondi office?',
    answer:
      'Yes. You can use our public China Cost Comparison tool (/compare-costs), browse all 150 verified Chinese universities (/china-universities), or inspect our CERN-archived open dataset (DOI: 10.5281/zenodo.24423801) published under CC BY 4.0 before booking a free consultation.',
  },
  {
    question: 'Which China intakes and degree levels do you support from Bangladesh?',
    answer:
      'We support both the March (Spring) and September (Autumn) 2027 intakes across Diploma/Foundation (after SSC/O-Level), Bachelor (Engineering, CS/AI, Business, Economics), MBBS (subject to MoE & BMDC eligibility checks), Master, and PhD tracks.',
  },
  {
    question: 'Where is EduExpress International located in Dhaka, and is it linked to any UK company?',
    answer: `Our head office is at ${DEFAULT_OFFICE_RECORD.address} (open ${DEFAULT_OFFICE_RECORD.hours}, closed Friday; phone ${formatBangladeshPhone(DEFAULT_OFFICE_RECORD.phonePrimary)}). EduExpress International is an independent Bangladeshi consultancy founded in 2018 and is unaffiliated with UK-registered EduExpress Ltd.`,
  },
];

export default async function StudyInChinaAgencyBangladeshPage() {
  const [chinaUniversities, trust] = await Promise.all([
    getUniversityRecords('China').catch(() => []),
    getPublicTrustRecords(),
  ]);

  const activeChina = chinaUniversities.filter((u) => u.isActive);
  const chinaCount = activeChina.length || 150;
  const programCount = activeChina.reduce((sum, u) => sum + u.programs.length, 0);
  const scholarshipCount = activeChina.reduce((sum, u) => sum + u.scholarships.length, 0);

  const office = trust.offices[0];
  const phone = office?.phonePrimary ?? config.contact.phone;
  const whatsappDigits = (office?.phonePrimary ?? config.contact.whatsapp).replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    'Assalamu alaikum. I would like a free China university shortlist and written cost breakdown from EduExpress International.',
  )}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        mainEntityOfPage: PAGE_URL,
        name: 'Study in China Agency in Bangladesh — EduExpress International',
        description:
          'Evidence-first China education consultancy in Dhanmondi, Dhaka offering 150 verified Chinese universities, written cost breakdowns, and BDT 0 service fee before China visa approval.',
        inLanguage: 'en-BD',
        dateModified: '2026-11-22',
        about: ORG,
        publisher: ORG,
        reviewedBy: ORG,
        isPartOf: { '@id': 'https://eduexpressint.com/#website' },
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
        mainEntity: { '@id': `${PAGE_URL}#service` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://eduexpressint.com/images/office/dhanmondi-brandwall.webp',
        },
      },
      {
        '@type': 'Service',
        '@id': `${PAGE_URL}#service`,
        name: 'Study in China Admissions, Scholarship & Visa-First Consultancy in Bangladesh',
        url: PAGE_URL,
        serviceType: 'China Education Consultancy',
        description:
          'China university shortlisting across 150 verified institutions, written first-year ClearCost breakdowns, CSC/provincial scholarship eligibility checks, and JW201/JW202 + X1 student visa file preparation in Dhanmondi, Dhaka.',
        provider: ORG,
        areaServed: [
          { '@type': 'City', name: 'Dhaka' },
          { '@type': 'Country', name: 'Bangladesh' },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'Study in China', path: '/study-in-china-from-bangladesh' },
          { name: 'Study in China Agency in Bangladesh' },
        ]}
        eyebrow="Since 2018 · Dhanmondi, Dhaka · Visa-First Policy"
        title="Study in China agency in Bangladesh — verify costs & visas before you pay."
        lead="EduExpress International is a Dhaka-based, evidence-first China education consultancy. Compare 150 verified Chinese universities with written first-year cost sheets and BDT 0 EduExpress service fee before China visa approval."
        reviewed="November 2026"
        actions={
          <>
            <a href="#book-consultation" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get free China shortlist <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link href="/compare-costs" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare first-year costs
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ed-btn ed-btn-outline min-h-[52px] px-7"
            >
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp Dhanmondi desk
            </a>
          </>
        }
        aside={
          <div className="rounded-3xl bg-petrol-800 p-6 text-white sm:p-7">
            <span className={kit.iconLime}>
              <ShieldCheck size={22} aria-hidden="true" />
            </span>
            <p className="mt-4 text-[19px] font-semibold leading-7 text-lime">
              Approved China Visa-First Standard
            </p>
            <p className="mt-2 text-[14.5px] leading-6 text-white/90">
              No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-[13.5px]">
              <div className="rounded-2xl bg-white/10 p-3">
                <dt className="text-white/75">Verified China Universities</dt>
                <dd className="mt-0.5 text-[20px] font-bold text-lime">{chinaCount}</dd>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <dt className="text-white/75">Cataloged Programs</dt>
                <dd className="mt-0.5 text-[20px] font-bold text-lime">{programCount || 850}+</dd>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <dt className="text-white/75">Scholarship Records</dt>
                <dd className="mt-0.5 text-[20px] font-bold text-lime">{scholarshipCount || 250}+</dd>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <dt className="text-white/75">Open-Data DOI</dt>
                <dd className="mt-0.5 text-[13px] font-bold text-white">
                  <a
                    href={OPEN_DATA_REPOSITORIES.zenodoDoiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-lime/60 underline-offset-2 hover:text-lime"
                  >
                    10.5281/zenodo.24423801
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        }
      />

      <TrustBar
        universities={chinaCount}
        feeNote="BDT 0 file opening · BDT 0 service fee before China visa approval"
      />

      {/* Section 1: Agency Verification Checklist */}
      <Section
        id="verify-agency"
        tone="white"
        title="How to verify any study in China agency in Bangladesh."
        intro="The Chinese Embassy in Bangladesh does not authorize any exclusive visa agency, and students can always apply directly on official portals. If you choose a consultancy for shortlisting, document checks, and visa file preparation, test them against these six safeguards."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
          <table className="w-full border-collapse text-left text-[14.5px] leading-6">
            <thead>
              <tr className="bg-canvas-soft text-petrol-800">
                <th className="p-4 font-bold">Check</th>
                <th className="p-4 font-bold text-rose-800">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldAlert size={16} aria-hidden="true" /> Common Agency Red Flag
                  </span>
                </th>
                <th className="p-4 font-bold text-emerald-900">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={16} aria-hidden="true" /> EduExpress International Standard
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10">
              {AGENCY_CHECKLIST.map((row) => (
                <tr key={row.criterion} className="align-top">
                  <td className="p-4 font-semibold text-petrol-800">{row.criterion}</td>
                  <td className="p-4 text-ink-soft">{row.redFlag}</td>
                  <td className="p-4 font-medium text-petrol-900">{row.eduExpressStandard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 2: 6-Step Transparent Process */}
      <Section
        id="process"
        tone="sage"
        title="Our transparent China admission & visa-first workflow."
        intro="Every milestone produces a written record you and your parents can independently check against official university and embassy rules."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {WORKFLOW_STEPS.map((item) => (
            <article key={item.step} className={kit.card}>
              <span className="inline-flex rounded-full bg-petrol-800 px-3 py-1 text-[12px] font-bold text-lime">
                Step {item.step}
              </span>
              <h3 className={`mt-3 ${kit.h3}`}>{item.title}</h3>
              <p className={`mt-2 ${kit.body}`}>{item.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-petrol-800/15 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.08em] text-lime-deep">
                <Award size={14} aria-hidden="true" /> Open-Access Proof Tools
              </p>
              <h3 className="mt-1 text-[20px] font-bold text-petrol-800">
                Verify our China data yourself before speaking to a counsellor
              </h3>
            </div>
            <div className="flex flex-wrap gap-2.5 text-[14px] font-semibold">
              <Link href="/china-universities" className="ed-btn ed-btn-outline min-h-[42px] px-4">
                150 China Universities
              </Link>
              <Link href="/china-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[42px] px-4">
                CSC &amp; Provincial Scholarships
              </Link>
              <Link href="/mbbs-in-china-bangladesh" className="ed-btn ed-btn-outline min-h-[42px] px-4">
                MBBS &amp; BMDC Rules
              </Link>
              <Link href="/china-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[42px] px-4">
                X1 / X2 Visa Checklist
              </Link>
              <Link href="/china-visa-first-policy" className="ed-btn ed-btn-outline min-h-[42px] px-4">
                Full Visa-First Terms
              </Link>
              <Link href="/bn/study-in-china" className="ed-btn ed-btn-outline min-h-[42px] px-4">
                বাংলা চীন গাইড
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 3: Dhanmondi Office & Official Payment Rules */}
      <Section
        id="dhaka-office"
        tone="white"
        title="Visit our Dhanmondi, Dhaka China desk with your parents."
        intro="Founded on 8 March 2018 in Dhaka. Unaffiliated with any similarly named UK company."
      >
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-5">
            <div className="overflow-hidden rounded-3xl border border-petrol-800/15 bg-canvas-soft">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/office/dhanmondi-brandwall.webp"
                  alt="EduExpress International China consultancy office in Dhanmondi Road 4/A, Dhaka"
                  fill
                  sizes="(max-width:1024px) 100vw, 460px"
                  className="object-cover"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-[19px] font-bold text-petrol-800">
                  EduExpress International — Dhanmondi Head Office
                </h3>
                <ul className="mt-3 space-y-2.5 text-[14.5px] leading-6 text-ink-soft">
                  <li className="flex items-start gap-2">
                    <MapPin size={16} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                    <span>{DEFAULT_OFFICE_RECORD.address}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone size={16} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                    <span>
                      <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="font-semibold text-petrol-800 underline underline-offset-2">
                        +880 1983-333566
                      </a>{' '}
                      / +880 1329-663505
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock size={16} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                    <span>{DEFAULT_OFFICE_RECORD.hours} (Friday closed)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileCheck2 size={16} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                    <span>
                      <Link href="/education-consultant-dhaka" className="font-semibold text-petrol-800 underline underline-offset-2">
                        Full Dhanmondi office &amp; team directory →
                      </Link>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <PaymentRules />
          </div>

          <div className="lg:col-span-7">
            <DhanmondiMapCard />
          </div>
        </div>
      </Section>

      {/* Section 4: Free Assessment */}
      <Section
        id="book-consultation"
        tone="sage"
        title="Start your free China Education Fit & ClearCost review."
        intro="Share your academic results, subject goal, and budget. A China desk counsellor prepares a written shortlist and first-year cost plan with zero upfront fee."
      >
        <EducationFitAssessment />
      </Section>

      <FaqBlock items={FAQS} title="Study in China agency FAQs (Bangladesh)" tone="white" />

      <CtaBand
        title="Compare before you pay any agency."
        text="Bring your transcripts to Evergreen Latif, House 12/1, Road 4/A, Dhanmondi — or request a written China cost breakdown online."
        assessmentHref="#book-consultation"
      />
    </>
  );
}
