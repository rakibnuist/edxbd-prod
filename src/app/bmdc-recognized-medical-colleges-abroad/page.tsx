import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  Globe,
  Hospital,
  Landmark,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import BmdcEligibilityChecker from '@/components/calculators/BmdcEligibilityChecker';
import CscaMasterProOfferCard from '@/components/china/CscaMasterProOfferCard';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { MoeMbbsDirectoryExplorer } from '@/components/pathways/MbbsComparisonWorkbench';
import {
  BMDC_ELIGIBILITY_FACT_CHECK,
  BMDC_RQE_CHECKLIST_DOSSIER,
  BMDC_RQE_SPECIFICATIONS,
  MOE_MBBS_UNIVERSITIES,
} from '@/data/bangladeshVsChinaMbbs';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bmdc-recognized-medical-colleges-abroad';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const BMDC_GUIDE_SOURCES = [
  {
    label: 'Bangladesh Medical and Dental Council (BMDC) — Official Foreign Medical Eligibility & RQE Portal',
    href: 'https://www.bmdc.org.bd/',
    note: 'Statutory regulatory council in Dhaka (203 Shaheed Syed Nazrul Islam Sarani, Bijoy Nagar) administering pre-departure Foreign Medical Eligibility Certificates and the biannual Registration Qualifying Examination (RQE) under the BMDC Act, 2010.',
  },
  {
    label: 'Directorate General of Medical Education (DGME) & Ministry of Health and Family Welfare (MOHFW Bangladesh)',
    href: 'https://dgme.portal.gov.bd/',
    note: 'Issues annual national MBBS admission GPA circulars, O/A-Level equivalence certificates, and local private medical college fee gazettes.',
  },
  {
    label: 'World Directory of Medical Schools (WDOMS — WFME & FAIMER Global Directory)',
    href: 'https://www.wdoms.org/',
    note: 'Mandatory global medical school registry verifying that an overseas medical faculty is recognized by its home government and eligible for BMDC RQE, USMLE (ECFMG), and UKMLA/PLAB.',
  },
  {
    label: 'Ministry of Education of the People’s Republic of China (MOE) — 45 English-Medium MBBS Universities List',
    href: 'http://en.moe.gov.cn/',
    note: 'Statutory Chinese government authorization list restricting English-medium undergraduate Clinical Medicine (MBBS) for international students strictly to 45 approved public universities.',
  },
  {
    label: 'National Center for Educational Quality Enhancement (NCEQE Georgia) & ASHE/AZVO (Croatia)',
    href: 'https://eqe.ge/en',
    note: 'WFME-recognized and European ENQA quality assurance agencies accrediting 6-year English-taught Medical Doctor (MD / 360 ECTS) programs in Georgia and Croatia.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'BMDC Recognized Medical Colleges Abroad 2027 | RQE & Rules',
    description:
      'BMDC foreign medical eligibility rules, RQE licensing exam, WDOMS/WFME checklist, and 45 Chinese MOE vs Georgia, Croatia & BD private medical colleges.',
    path: PATH,
    type: 'article',
    locale: 'en_BD',
    image: ogImage('china-guide', 'BMDC Recognized Medical Colleges Abroad & RQE Licensing Guide — EduExpress International'),
  });
}

const BMDC_ABROAD_FAQS = [
  {
    question: 'Does BMDC publish a fixed "approved list" of foreign medical colleges, or how does BMDC recognition work?',
    answer:
      'Under the Bangladesh Medical and Dental Council (BMDC) Act, 2010, BMDC does not rely on commercial agency lists. Instead, for a foreign MBBS or 6-year Medical Doctor (MD) degree to be accepted for the BMDC Registration Qualifying Examination (RQE) in Dhaka, three statutory conditions must be met: (1) the foreign medical university must be officially recognized by the Ministry of Education / Ministry of Health of its home country AND listed in the World Directory of Medical Schools (WDOMS); (2) for China specifically, the university must be one of the 45 public universities officially authorized by China’s Ministry of Education (MOE) to teach Clinical Medicine (MBBS) in English (unauthorized "bilingual" programs are not accepted); and (3) the Bangladeshi student must meet BMDC’s pre-departure academic eligibility criteria (SSC/HSC GPA, Biology ≥ 3.50, and study-gap rules) and hold a valid BMDC Eligibility Certificate.',
  },
  {
    question: 'What are the exact SSC and HSC GPA requirements for a BMDC Eligibility Certificate to study MBBS abroad?',
    answer:
      'To obtain a pre-departure Eligibility Certificate from BMDC (Bijoy Nagar, Dhaka) for studying MBBS/MD abroad, you must have passed SSC and HSC (or O-Level and A-Level with a DGHS Mohakhali Equivalence Certificate) in the Science group with Physics, Chemistry, and Biology. Crucially, you must hold a minimum GP of 3.50 in HSC Biology (Grade B or higher). The required combined SSC + HSC GPA follows the active admission-year BMDC/DGME circular (historically a statutory floor of combined GPA 7.00 with at least 3.00 in each for foreign medical eligibility, though DGME domestic circulars set 8.00–8.50; always verify the active session notice at bmdc.org.bd before paying any foreign deposit). Furthermore, your HSC passing year must be within the current or immediate preceding 1–2 academic years.',
  },
  {
    question: 'Can I get a China X1 Visa or Georgia D3 Visa without a BMDC Eligibility Certificate?',
    answer:
      'Yes, foreign universities and the Chinese or Georgian embassies do not ask for a BMDC certificate to issue your admission offer or student visa—and that is the exact trap unscrupulous agencies use to mislead students! If you fly abroad and spend 6 years completing an MBBS with HSC Biology below 3.50 or a 3-year HSC study gap, you will graduate with a degree, but BMDC will reject your application to sit for the Registration Qualifying Examination (RQE) in Dhaka (where Item 6 and Item 12c of the RQE form require your BMDC Eligibility Certificate Serial Number and original certificate). You would never be allowed to practice as a licensed doctor in Bangladesh.',
  },
  {
    question: 'How do the 45 Chinese MOE medical universities compare with Georgia, Croatia, and Bangladesh private medical colleges?',
    answer:
      'China’s 45 MOE-authorized public medical universities offer the strongest hospital infrastructure (2,500 to 10,000+ bed Grade-3A state hospitals), global university rankings (C9 League, Project 985/211, Double First-Class), and the lowest tuition (CNY 24,000 to 48,000/year ≈ 4.5 to 9.0 Lakh BDT/year, with zero upfront capitation donation and provincial scholarships). Georgia offers WFME-accredited 6-year English MD programs ($5,300 to $8,000/year ≈ 6.5 to 9.8 Lakh BDT/year) without CSCA or HSK requirements. Croatia (EU) offers 6-year European MD degrees at Zagreb, Split, and Rijeka (€12,000/year ≈ 15.8 Lakh BDT/year) with full EU recognition. By comparison, Bangladesh private medical colleges require BDT 12,74,400 upfront on Day 1 and BDT 35 to 45+ Lakh total including hostel and prof exam fees.',
  },
  {
    question: 'What is the BMDC Registration Qualifying Examination (RQE) after returning to Bangladesh?',
    answer:
      'Under Sections 5 and 12 of the BMDC Act 2010, every Bangladeshi citizen who completes an MBBS or equivalent MD degree outside Bangladesh must pass the BMDC Registration Qualifying Examination (RQE) upon returning home. The RQE is a biannual written MCQ exam held in Dhaka (typically in April/May and October/November) covering Final Prof MBBS subjects. Passing the RQE grants Provisional BMDC Registration to complete your 12-month clinical internship (or verify your approved foreign teaching-hospital internship), leading to Permanent BMDC Registration.',
  },
  {
    question: 'What should I study if my HSC Biology GPA is below 3.50 or I have a 2–4 year study gap?',
    answer:
      'If your HSC Biology grade is below 3.50 or your study gap exceeds the BMDC window, EduExpress advises against enrolling in an overseas MBBS program if your goal is clinical practice in Bangladesh. Instead, you can legally enroll in high-scholarship 4-year Bachelor’s programs in Pharmacy, Pharmaceutical Engineering, Biotechnology, Bioinformatics, Public Health, or Biomedical Engineering in China, Malaysia, Hungary, or the UK, where BMDC medical licensing rules do not apply.',
  },
];

export default function BmdcRecognizedMedicalCollegesAbroadPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebPage', 'Article'],
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        datePublished: '2026-11-27T00:00:00Z',
        dateModified: '2026-11-27T00:00:00Z',
        headline: 'BMDC Recognized Medical Colleges Abroad (2027): Eligibility Certificate, RQE Rules & 45 Chinese MOE List',
        name: 'BMDC Recognized Medical Colleges Abroad 2027: Eligibility Certificate, RQE & 45 Chinese MOE List',
        description:
          'BMDC foreign medical eligibility rules, RQE licensing exam, WDOMS/WFME checklist, and 45 Chinese MOE vs Georgia, Croatia & BD private medical colleges.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        author: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/china-guide.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(BMDC_GUIDE_SOURCES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#moe-medical-universities`,
        name: '45 Chinese MOE-Authorized English-Medium MBBS Universities Recognized for BMDC RQE Pathway',
        numberOfItems: MOE_MBBS_UNIVERSITIES.length,
        itemListElement: MOE_MBBS_UNIVERSITIES.slice(0, 20).map((uni, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: uni.name,
          url: `${SITE}/universities/${uni.slug}`,
        })),
      },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'Find Education', path: '/find-education' },
          { name: 'BMDC Recognized Medical Colleges Abroad' },
        ]}
        eyebrow="BMDC Act 2010 Compliance · Eligibility Certificate & RQE Exam · 45 Chinese MOE & WFME Medical List"
        title="BMDC Recognized Medical Colleges Abroad 2027."
        lead="Before paying a single taka for an overseas MBBS or MD degree, verify the statutory Bangladesh Medical & Dental Council (BMDC) rules required to return and practice as a licensed doctor in Bangladesh: pre-departure Eligibility Certificate requirements (HSC Biology ≥ 3.50, study-gap caps), WDOMS/WFME verification, and the complete directory of 45 Chinese MOE public medical universities compared with Georgia, Croatia, and Bangladesh private colleges."
        reviewed="27 November 2026"
        actions={
          <>
            <Link href="/apply?subject=MBBS" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Verify My BMDC &amp; MBBS Eligibility <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#moe-45-directory" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Explore 45 Chinese MOE Schools
            </a>
            <Link href="/bangladesh-vs-china-mbbs" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              BD Private vs China MBBS Calculator
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* Key Statutory Medical Licensing Metrics */}
      <section aria-label="BMDC statutory medical metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Statutory Regulatory Baseline · BMDC Act, 2010 (Sections 5 &amp; 12)
              </span>
              <p className="text-xs text-slate-500">
                Authority: <strong>Bangladesh Medical &amp; Dental Council (BMDC)</strong>, 203 Shaheed Syed Nazrul Islam Sarani, Bijoy Nagar, Dhaka-1000.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 Pre-Application BMDC GPA &amp; University Audit
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <FileCheck2 size={16} className="text-emerald-700" /> Pre-Departure Gate
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Eligibility Certificate</p>
              <p className="mt-1 text-xs text-slate-600">HSC Biology ≥ 3.50, Science stream &amp; ≤1–2 yr HSC passing window.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Globe size={16} className="text-emerald-700" /> Global Accreditation
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">WDOMS + Home Ministry</p>
              <p className="mt-1 text-xs text-slate-600">Must be listed in WDOMS &amp; authorized by home government (e.g., China MOE 45).</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <ClipboardCheck size={16} className="text-emerald-700" /> Return Licensing Exam
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">BMDC RQE (Apr &amp; Oct)</p>
              <p className="mt-1 text-xs text-slate-600">Biannual written MCQ exam in Dhaka required for Provisional License.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Hospital size={16} className="text-emerald-700" /> Clinical Internship
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">12-Month Rotatory</p>
              <p className="mt-1 text-xs text-slate-600">Complete 1-year internship after RQE to receive Permanent BMDC License.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive BMDC Pre-Departure Eligibility Checker */}
      <Section
        id="bmdc-eligibility-checker"
        tone="sage"
        title="Check your BMDC Foreign Medical Eligibility Certificate readiness."
        intro="Enter your SSC and HSC Science GPAs, HSC Biology grade point, and passing year to test whether you qualify for a pre-departure BMDC Eligibility Certificate and the 45 Chinese MOE medical universities."
      >
        <BmdcEligibilityChecker />
      </Section>

      {/* Module 1: 4-Country Medical Study Comparison (China vs Georgia vs Croatia vs BD Private) */}
      <Section
        id="country-medical-comparison"
        tone="white"
        title="BMDC-compliant medical routes compared: China vs Georgia vs Croatia vs Bangladesh Private."
        intro="Compare total 6-year tuition, hospital bed capacity, WDOMS/WFME status, and Day-1 upfront cash requirements across the four primary medical routes available to Bangladeshi students."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[820px] border-collapse text-left text-[14px]">
            <caption className="sr-only">Comparison of medical degrees in China, Georgia, Croatia, and Bangladesh private colleges</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-5 py-4 font-bold">Medical Pathway</th>
                <th className="px-5 py-4 font-bold">Annual Tuition (Foreign / BDT)</th>
                <th className="px-5 py-4 font-bold">Day-1 Upfront Cash</th>
                <th className="px-5 py-4 font-bold">Accreditation &amp; Hospital Scale</th>
                <th className="px-5 py-4 font-bold">BMDC RQE &amp; Global Licensing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/mbbs-in-china-bangladesh" className="hover:underline">China (45 MOE Public Universities)</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">CNY 24,000 – 48,000/yr (~4.5L–9.0L BDT)</td>
                <td className="px-5 py-4">Year-1 Tuition + Dorm only (BDT 0 Donation)</td>
                <td className="px-5 py-4">China MOE 45 List + WDOMS; 2,500–10,000+ bed Grade-3A hospitals</td>
                <td className="px-5 py-4">Eligible for BMDC RQE, USMLE (ECFMG), UKMLA/PLAB &amp; AMC</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-georgia-from-bangladesh" className="hover:underline">Georgia (6-Year English MD)</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">USD 5,300 – 8,000/yr (~6.5L–9.8L BDT)</td>
                <td className="px-5 py-4">1st-Semester/Year Tuition (~3.5L–6.5L BDT)</td>
                <td className="px-5 py-4">WFME-recognized NCEQE + WDOMS (TSMU, TSU, Iliauni, UG)</td>
                <td className="px-5 py-4">Eligible for BMDC RQE (with pre-departure BMDC cert), USMLE &amp; PLAB</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-croatia-from-bangladesh" className="hover:underline">Croatia (EU 6-Year English MD)</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">EUR 12,000/yr (~15.8L BDT)</td>
                <td className="px-5 py-4">1st-Year Tuition via Student File</td>
                <td className="px-5 py-4">EU Directive 2005/36/EC + ASHE/AZVO + WDOMS (Zagreb, Split, Rijeka)</td>
                <td className="px-5 py-4">Automatic EU medical degree recognition + WDOMS &amp; BMDC RQE eligible</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/bangladesh-vs-china-mbbs" className="hover:underline">Bangladesh Private Medical Colleges</Link>
                </td>
                <td className="px-5 py-4">BDT 27.24L Statutory Core (+8.5L–16.5L Hostel/Exams)</td>
                <td className="px-5 py-4 font-bold text-amber-900">BDT 12,74,400 Cash on Day 1 (60% Cap)</td>
                <td className="px-5 py-4">MOHFW / BMDC Local Approval; 250–750 bed private hospitals</td>
                <td className="px-5 py-4">Direct BMDC registration; USMLE depends on individual college WDOMS note</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: BMDC Pre-Departure Eligibility Certificate Fact-Check */}
      <Section
        id="bmdc-eligibility-rules"
        tone="sage"
        title="BMDC pre-departure Eligibility Certificate rules vs agency myths."
        intro="Read the three statutory compliance rules that protect Bangladeshi medical students from graduating with an unusable degree."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {BMDC_ELIGIBILITY_FACT_CHECK.map((item) => (
            <div key={item.aspect} className="flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-xs">
              <div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">Agency Myth vs Law</span>
                <h3 className="mt-4 text-[18px] font-bold text-petrol-800">{item.aspect}</h3>
                <p className="mt-3 rounded-2xl bg-amber-50/80 p-3.5 text-xs leading-5 text-amber-950">
                  <strong>Common Myth:</strong> {item.agencyMyth}
                </p>
                <p className="mt-3 text-[14px] leading-6 text-ink-soft">
                  <strong className="text-petrol-800">Statutory Reality:</strong> {item.legalReality}
                </p>
              </div>
              <p className="mt-4 border-t border-canvas-soft pt-3 text-xs font-semibold text-emerald-800">
                EduExpress Policy: {item.eduExpressPolicy}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Module 3: Complete Interactive Directory of 45 Chinese MOE English-Medium Medical Universities */}
      <Section
        id="moe-45-directory"
        tone="white"
        title="Complete directory of all 45 Chinese MOE-authorized English MBBS universities."
        intro="In China, ONLY these 45 state public universities are authorized by the Ministry of Education (MOE) to enroll international students in English-taught undergraduate Clinical Medicine (MBBS). Filter by province, C9/985/211 tier, tuition, or CSCA requirement."
      >
        <MoeMbbsDirectoryExplorer />
        <div className="mt-10">
          <CscaMasterProOfferCard assessmentHref="#bmdc-assessment" compact headingLevel="h3" />
        </div>
      </Section>

      {/* Module 4: BMDC Registration Qualifying Examination (RQE) & Dossier Checklist */}
      <Section
        id="bmdc-rqe-process"
        tone="sage"
        title="BMDC Registration Qualifying Examination (RQE) &amp; verification dossier."
        intro="Upon completing your 6-year MBBS/MD abroad, you submit these statutory documents at the BMDC Office in Bijoy Nagar, Dhaka to sit for the biannual RQE licensing exam."
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-4">
            <h3 className="text-[20px] font-bold text-petrol-800">Statutory RQE Examination Specifications</h3>
            {BMDC_RQE_SPECIFICATIONS.map((spec) => (
              <div key={spec.parameter} className="rounded-2xl border border-petrol-800/10 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{spec.parameter}</span>
                  <span className="rounded-full bg-lime-pale px-3 py-0.5 text-xs font-bold text-petrol-800">{spec.officialRule}</span>
                </div>
                <p className="mt-2 text-[14px] leading-6 text-ink-soft">{spec.practicalDetail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7">
            <h3 className="text-[20px] font-bold text-petrol-800">Mandatory BMDC RQE Application Dossier</h3>
            <p className="mt-1 text-xs text-slate-500">Documents required at Bijoy Nagar, Dhaka after graduation:</p>
            <ul className="mt-4 space-y-3 text-[13.5px] leading-5 text-ink-soft">
              {BMDC_RQE_CHECKLIST_DOSSIER.map((doc) => (
                <li key={doc.title} className="flex items-start gap-2.5">
                  <CheckCircle2 size={17} className={`mt-0.5 shrink-0 ${doc.critical ? 'text-amber-700' : 'text-emerald-700'}`} />
                  <span>
                    <strong className="text-petrol-800">{doc.title}:</strong> {doc.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 5: FAQs */}
      <FaqBlock
        items={BMDC_ABROAD_FAQS}
        title="Frequently asked questions about BMDC recognition for foreign MBBS degrees."
        tone="white"
      />

      {/* Module 6: Official Sources & Editorial Review */}
      <Section id="sources" tone="sage" title="Official medical councils &amp; statutory sources.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BMDC_GUIDE_SOURCES.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between rounded-2xl border border-petrol-800/15 bg-white p-4 transition hover:border-petrol-800/40"
            >
              <div>
                <span className="flex items-center justify-between gap-2 text-xs font-bold text-petrol-800">
                  <span>{source.label}</span>
                  <ExternalLink size={13} className="shrink-0" aria-hidden="true" />
                </span>
                <p className="mt-1.5 text-[12px] leading-5 text-slate-600">{source.note}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-petrol-800/10 bg-white p-5 text-xs leading-relaxed text-slate-600">
          <p>
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by{' '}
            <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">
              Abdullah Al Rakib
            </Link>{' '}
            (Founder &amp; CEO, EduExpress International) and <strong>Afsana Meme</strong> (Senior Consultant — China Admissions &amp; MBBS Guidance) at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against the Bangladesh Medical and Dental Council (BMDC) Act 2010, China MOE English-medium MBBS authorization circulars, and WDOMS/WFME directories on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Foreign medical eligibility certification, RQE examination admission, and medical licensing decisions rest solely with the Bangladesh Medical and Dental Council (BMDC) and the respective national medical authorities.
          </p>
        </div>
      </Section>

      {/* Module 7: Assessment Form */}
      <section id="bmdc-assessment" className="scroll-mt-24 bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Free BMDC GPA &amp; Biology Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your BMDC Eligibility &amp; 45-MOE Medical University Fit</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your SSC &amp; HSC GPA, Biology grade, and passing year. Our Dhanmondi medical admissions desk will verify your BMDC compliance and shortlist your top 3 Chinese or European public medical universities within one working day.
              </p>
            </div>
            <div className="rounded-3xl border border-rule bg-canvas-soft p-6 shadow-sm sm:p-10">
              <EducationFitAssessment />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
