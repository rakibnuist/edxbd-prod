import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Globe2,
  Hospital,
  Microscope,
  TrendingDown,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar } from '@/components/page/PageKit';
import {
  FitVsReconsiderGrid,
  PathwayCrossLinks,
  PathwayGovernanceSection,
} from '@/components/pathways/PathwaySharedBlocks';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bangladesh-vs-china-mbbs';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

export async function generateMetadata() {
  return pageMetadata({
    title: 'MBBS in Bangladesh vs China 2027: Fees, Hospitals & BMDC Rules | EduExpress',
    description:
      'Authentic comparison: Private medical colleges in Bangladesh vs MOE-accredited Chinese medical universities. Total cost comparison, 3,000+ bed teaching hospitals, BMDC/WDOMS eligibility, and USMLE/PLAB pathways.',
    path: PATH,
    type: 'article',
    locale: 'en_BD',
    image: ogImage('china', 'MBBS in Bangladesh vs China: Authentic Cost, Hospital & BMDC Comparison — EduExpress'),
  });
}

const COMPARISON_METRICS = [
  {
    parameter: 'Total Course Duration',
    bdPrivate: '5 Years Academic + 1 Year Mandatory Internship in Bangladesh',
    chinaMoe: '5 Years Academic + 1 Year Clinical Internship (Can be done in China tertiary hospitals or approved BD teaching hospitals)',
    advantage: 'China',
    notes: 'Same 6-year global standard curriculum aligned with WHO & WFME guidelines.',
  },
  {
    parameter: 'Government-Regulated Base Admission Fee',
    bdPrivate: 'BDT 19,44,000 (Ministry of Health & Family Welfare gazetted admission fee ceiling)',
    chinaMoe: 'BDT 0 (No capitation, admission donation, or development fee)',
    advantage: 'China',
    notes: 'China charges only official application fee (~CNY 400–800) and direct tuition.',
  },
  {
    parameter: 'Total 5/6-Year Cost (Tuition + Accommodation)',
    bdPrivate: 'BDT 42,00,000 – 55,00,000+ (Admission fee + monthly tuition + clinical sessionals + hostel + mess charges)',
    chinaMoe: 'BDT 26,00,000 – 35,00,000 (Total 6 years tuition CNY 30k–35k/year + on-campus dorm CNY 4k–5k/year)',
    advantage: 'China',
    notes: 'Families save BDT 15–20+ Lakhs in China, payable in manageable yearly installments directly to the university.',
  },
  {
    parameter: 'Teaching Hospital Bed Capacity & Clinical Volume',
    bdPrivate: '250 – 750 Beds (DGHS minimum mandate is 250 beds; patient flow is often localized)',
    chinaMoe: '3,000 – 10,000+ Beds (Multi-campus provincial level-3 Grade-A tertiary hospital complexes)',
    advantage: 'China',
    notes: 'Unmatched practical patient exposure, robotic surgery, organ transplants, and advanced trauma centers.',
  },
  {
    parameter: 'Scholarships for International Medical Students',
    bdPrivate: 'Virtually None in Private Medical Colleges (Fixed full commercial rate applies)',
    chinaMoe: 'Freshman Merit Scholarships (CNY 10,000 – 20,000) & Annual Academic Performance Awards',
    advantage: 'China',
    notes: 'E.g., Wenzhou Medical University (WMU) & Chongqing Medical University (CQMU) offer structured freshman awards.',
  },
  {
    parameter: 'Global Professional Recognition',
    bdPrivate: 'BMDC registered; local clinical practice focus. Variable USMLE/PLAB clinical match history.',
    chinaMoe: 'WHO, WDOMS, ECFMG (USA), GMC (UK), AMC (Australia), and BMDC (Bangladesh) recognized.',
    advantage: 'China',
    notes: 'Graduates are eligible to sit for USMLE (USA), PLAB/UKMLA (UK), AMC (Australia), and BMDC Qualifying Exam.',
  },
  {
    parameter: 'Eligibility & Entry Filter',
    bdPrivate: 'Combined GPA 9.00 in SSC+HSC (Min 3.50 each), Biology GP ≥ 3.50 + DGHS National Medical Admission Test pass (Cut-off ≥ 40%)',
    chinaMoe: 'Science stream (Physics, Chemistry, Biology) with min 70% in HSC, Biology GPA 3.50+ & CSCA / University entrance test',
    advantage: 'Tie / Objective',
    notes: 'Both demand strict academic science rigor; China eliminates national seat-allocation uncertainty.',
  },
];

const PROOF_CARDS = [
  {
    icon: Hospital,
    title: 'Clinical Exposure: 3,000–8,000 Bed Hospital Networks',
    badge: 'Clinical Superiority',
    description:
      'In private medical colleges in Bangladesh, students often rotate in 250–500 bed hospitals where patient volume is shared across interns and private consultants. Top Chinese medical universities operate provincial Tier-3A (Grade A) affiliated hospital clusters with 3,000 to over 8,000 in-patient beds, treating tens of thousands of complex clinical cases daily.',
  },
  {
    icon: TrendingDown,
    title: 'Authentic Cost Savings: BDT 15 to 20 Lakhs Saved',
    badge: 'Zero Capitation Fee',
    description:
      'Under Ministry of Health & Family Welfare gazetted rules, private medical college admission in Bangladesh requires BDT 19.44 Lakhs upfront on day one, reaching BDT 45–55 Lakhs overall. MOE-accredited Chinese medical universities require zero donation or capitation fees: tuition is paid annually (approx. CNY 30,000–35,000/year), bringing total 6-year education and housing to BDT 26–35 Lakhs.',
  },
  {
    icon: Globe2,
    title: 'Dual Qualification: BMDC + USMLE / PLAB Pathway',
    badge: 'Worldwide Licensure',
    description:
      'Every MOE-authorized English-medium Chinese university is listed in the World Directory of Medical Schools (WDOMS) with valid ECFMG Sponsor Notes. Students can appear for USMLE (USA) and PLAB/UKMLA (UK) during or right after their degree, as well as the BMDC Qualifying Examination upon returning to Bangladesh.',
  },
  {
    icon: Microscope,
    title: 'World-Class Simulation & Anatomy Labs',
    badge: 'Modern Technology',
    description:
      'Chinese state medical universities feature digital 3D virtual dissection tables, robotic surgical simulators, advanced histology/pathology imaging suites, and international research laboratories funded directly by provincial governments—facilities rarely accessible at domestic private colleges.',
  },
];

const FAQS = [
  {
    question: 'Is MBBS in China recognized by the Bangladesh Medical and Dental Council (BMDC)?',
    answer:
      'Yes. Degrees from Chinese Ministry of Education (MOE) approved English-medium medical universities listed in the World Directory of Medical Schools (WDOMS) are recognized by the BMDC. Upon completion of the degree and required internship, graduates return to Bangladesh and appear for the BMDC Qualifying Examination to obtain their full practicing license.',
  },
  {
    question: 'What are the exact BMDC minimum eligibility requirements for studying medicine abroad?',
    answer:
      'Under BMDC foreign medical education regulations, Bangladeshi candidates must have passed SSC and HSC in the Science stream with a combined minimum GPA of 9.00 (with no individual GPA below 3.50 in SSC or HSC), and a minimum Grade Point of 3.50 in Biology in HSC. Students must obtain a BMDC Eligibility Certificate before traveling abroad.',
  },
  {
    question: 'Why is the total cost in China lower than private medical colleges in Bangladesh?',
    answer:
      'Public medical universities in China are heavily subsidized by the Chinese central and provincial governments. They do not charge private commercial profit margins, capital investment fees, or "donation" packages. International students pay strictly government-approved annual tuition (CNY 30,000–35,000/year) and subsidized university dorm fees (CNY 4,000–5,000/year).',
  },
  {
    question: 'Is the medium of instruction entirely in English in China?',
    answer:
      'Yes. For the 45 universities authorized by the Chinese Ministry of Education to enroll international students in MBBS, the official instructional medium for all pre-clinical and clinical medical sciences is English. However, students study conversational Chinese (HSK-3/4 level) during pre-clinical years to interact smoothly with patients during hospital ward bedside rounds in the clinical phase.',
  },
  {
    question: 'Can I complete my 1-year internship in Bangladesh or must I stay in China?',
    answer:
      'Students have two recognized options: (1) Complete the 1-year clinical rotation in China at the university’s affiliated Grade-3A hospital (recommended for advanced clinical technology), or (2) With university approval and BMDC NOC, complete the 12-month internship at an accredited medical college hospital in Bangladesh.',
  },
  {
    question: 'What happens if a student fails the DGHS government medical admission test in Bangladesh?',
    answer:
      'If a student satisfies the BMDC minimum academic criteria (Combined GPA 9.00 and Bio GPA 3.50+), they can apply directly to accredited Chinese medical universities based on their HSC board marks and CSCA assessment, avoiding private tuition exploitation or career loss due to national test seat limits in Bangladesh.',
  },
];

const OFFICIAL_SOURCES = [
  {
    label: 'Ministry of Health and Family Welfare (Bangladesh) — Private Medical College Fee Gazettes',
    href: 'https://mefwd.gov.bd',
    note: 'Regulatory gazette establishing the official admission fee cap (BDT 19.44 Lakh) and monthly tuition structures.',
  },
  {
    label: 'Bangladesh Medical and Dental Council (BMDC)',
    href: 'https://bmdc.org.bd',
    note: 'Registration regulations, foreign medical degree evaluation guidelines, and HSC Biology minimum criteria.',
  },
  {
    label: 'Ministry of Education of the People’s Republic of China (MOE)',
    href: 'https://en.moe.gov.cn',
    note: 'Official list of universities approved to offer English-medium clinical undergraduate programmes (MBBS) to international students.',
  },
  {
    label: 'World Directory of Medical Schools (WDOMS) & ECFMG',
    href: 'https://www.wdoms.org',
    note: 'Confirmation of university listing and ECFMG Sponsor Note eligibility for international medical licensing examinations.',
  },
];

export default function BangladeshVsChinaMbbsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      primaryImageOfPageSchema('/og/china.jpg'),
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: 'MBBS in Bangladesh vs China: Authentic Cost, Hospital & BMDC Comparison',
        description:
          'Evidence-first comparison of private medical colleges in Bangladesh and MOE-accredited Chinese medical universities for Bangladeshi students.',
        image: `${SITE}/og/china.jpg`,
        primaryImageOfPage: primaryImageOfPageSchema('/og/china.jpg'),
        datePublished: '2026-11-25T00:00:00Z',
        dateModified: '2026-11-25T00:00:00Z',
        inLanguage: 'en-BD',
        author: { '@type': 'Person', name: 'Afsana Meme', jobTitle: 'Senior Consultant — China Admissions & Scholarships' },
        reviewedBy: { '@type': 'Person', name: 'Abdullah Al Rakib', jobTitle: 'Founder and CEO' },
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(OFFICIAL_SOURCES),
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      {/* Hero */}
      <PageHero
        path={PATH}
        trail={[
          { name: 'Study in China', path: '/study-in-china-from-bangladesh' },
          { name: 'MBBS in China', path: '/mbbs-in-china-bangladesh' },
          { name: 'Bangladesh vs China MBBS' },
        ]}
        eyebrow="Evidence-First Medical Study Comparison · 2027 Entry · BMDC & MOE Standards"
        title="MBBS in Private Medical Colleges in Bangladesh vs. China."
        lead="An authentic, verified breakdown of tuition costs, admission fees, clinical hospital bed capacity, and BMDC & international licensing pathways. See why ranked Chinese public medical universities provide superior clinical training at BDT 15–20 Lakhs lower cost."
        reviewed="25 November 2026"
        actions={
          <>
            <a href="#comparison-table" className="ed-btn ed-btn-signal min-h-[50px] px-7">
              View Side-by-Side Comparison <ArrowRight size={17} className="ml-2 inline" />
            </a>
            <a href="#hospital-capacity" className="ed-btn ed-btn-outline min-h-[50px] px-6">
              Compare Hospital Bed Capacities
            </a>
            <Link href="/mbbs-in-china-bangladesh" className="ed-btn ed-btn-outline min-h-[50px] px-6">
              Explore Approved Universities
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* Regulatory Context Notice */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-amber-100 p-2.5 text-amber-800">
              <AlertCircle size={24} />
            </div>
            <div className="text-sm leading-relaxed text-slate-700">
              <h3 className="text-base font-bold text-slate-900">
                Authenticity & Strict Regulatory Hygiene Statement
              </h3>
              <p className="mt-1">
                All data presented below is derived directly from the{' '}
                <strong>Bangladesh Ministry of Health & Family Welfare (MOHFW)</strong> private medical college gazettes, the{' '}
                <strong>Bangladesh Medical & Dental Council (BMDC)</strong> foreign medical eligibility criteria, and published tuition notices from{' '}
                <strong>Chinese Ministry of Education (MOE)</strong> approved medical universities. EduExpress operates under a strict visa-first transparency policy: zero file charges and zero agency service fees prior to visa issuance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Comparison Table */}
      <Section
        id="comparison-table"
        title="Side-by-Side Breakdown: Bangladesh Private Medical Colleges vs. China MOE Universities"
        intro="Direct comparison across the 7 critical metrics every parent and medical aspirant in Bangladesh must evaluate before investing 5 to 6 years of tuition."
      >
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-4 px-6 font-semibold">Evaluation Metric</th>
                <th className="py-4 px-6 font-semibold text-rose-900 bg-rose-50/50">Private Medical in Bangladesh</th>
                <th className="py-4 px-6 font-semibold text-emerald-900 bg-emerald-50/50">MOE Medical Universities in China</th>
                <th className="py-4 px-6 font-semibold text-center">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPARISON_METRICS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 align-top">
                    <span className="font-semibold text-slate-900 block">{row.parameter}</span>
                    <span className="text-xs text-slate-500 mt-0.5 block">{row.notes}</span>
                  </td>
                  <td className="py-4 px-6 align-top text-slate-700 bg-rose-50/20 leading-relaxed">
                    {row.bdPrivate}
                  </td>
                  <td className="py-4 px-6 align-top text-slate-900 font-medium bg-emerald-50/20 leading-relaxed">
                    {row.chinaMoe}
                  </td>
                  <td className="py-4 px-6 align-top text-center">
                    {row.advantage === 'China' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 size={13} /> China Wins
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        Rigorous
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Proof Pillars: Why China is Superior */}
      <Section
        id="hospital-capacity"
        tone="sage"
        title="Why Clinical Training in China Provides Superior Long-Term Value"
        intro="Clinical competence depends on patient volume, diversity of pathology, and modern surgical facilities. Here is why studying MBBS in China excels over local private options."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {PROOF_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-xl bg-teal-100/70 p-3 text-teal-800">
                    <Icon size={24} />
                  </div>
                  <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-0.5 text-xs font-semibold text-teal-800">
                    {card.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Concrete University Cost Examples */}
      <Section
        id="university-examples"
        title="Itemized China MBBS University Fee Examples (2027 Admissions)"
        intro="Actual published tuition and hostel costs at premier MOE-approved universities. Compare these against Bangladesh's BDT 19.44 Lakh starting fee."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Chongqing, China</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Chongqing Medical University (CQMU)</h3>
            <p className="text-xs text-slate-500 mt-1">Ranked global top 500 in Clinical Medicine · 6 Affiliated Hospitals with 10,000+ Beds</p>
            <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Annual Tuition:</span>
                <span className="font-semibold text-slate-900">CNY 30,000 (~BDT 5.1L/yr)</span>
              </div>
              <div className="flex justify-between">
                <span>Hostel (Twin Room):</span>
                <span className="font-semibold text-slate-900">CNY 4,800/year</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Freshman Scholarship:</span>
                <span>Up to CNY 15,000</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
                <span>Est. 6-Year Academic + Dorm:</span>
                <span>~BDT 30–33 Lakhs</span>
              </div>
            </div>
            <Link
              href="/universities/chongqing-medical-university"
              className="mt-5 inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              View CQMU Profile <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Wenzhou, Zhejiang</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Wenzhou Medical University (WMU)</h3>
            <p className="text-xs text-slate-500 mt-1">Renowned Ophthalmology & Surgery · 5 Direct Affiliated Hospitals with 8,500+ Beds</p>
            <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Annual Tuition:</span>
                <span className="font-semibold text-slate-900">CNY 33,000 (~BDT 5.6L/yr)</span>
              </div>
              <div className="flex justify-between">
                <span>Hostel (Twin Room):</span>
                <span className="font-semibold text-slate-900">CNY 4,400/year</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Freshman Scholarship:</span>
                <span>Up to CNY 20,000</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
                <span>Est. 6-Year Academic + Dorm:</span>
                <span>~BDT 33–36 Lakhs</span>
              </div>
            </div>
            <Link
              href="/universities/wenzhou-medical-university"
              className="mt-5 inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              View WMU Profile <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Zhenjiang, Jiangsu</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Jiangsu University (JSU)</h3>
            <p className="text-xs text-slate-500 mt-1">Top National Comprehensive University · Affiliated Teaching Hospital with 2,500+ Beds</p>
            <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Annual Tuition:</span>
                <span className="font-semibold text-slate-900">CNY 34,000 (~BDT 5.8L/yr)</span>
              </div>
              <div className="flex justify-between">
                <span>Hostel (Double Room):</span>
                <span className="font-semibold text-slate-900">CNY 4,900/year</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Merit Awards:</span>
                <span>Annual Academic Grants</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
                <span>Est. 6-Year Academic + Dorm:</span>
                <span>~BDT 34–37 Lakhs</span>
              </div>
            </div>
            <Link
              href="/universities/jiangsu-university"
              className="mt-5 inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              View JSU Profile <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Decision Matrix */}
      <Section
        id="decision-fit"
        tone="navy"
        title="Who Should Choose China vs. Staying in Bangladesh?"
        intro="Honest counseling means matching student aspirations and family circumstances to the right country."
      >
        <FitVsReconsiderGrid
          fitTitle="Choose MBBS in China if:"
          fitItems={[
            {
              label: 'You want high clinical exposure in 3,000+ bed hospital networks',
              detail: 'Experience massive pathology volume, advanced medical imaging, and robotic surgery firsthand during rotations.',
            },
            {
              label: 'Your family wants to avoid BDT 19–20 Lakh upfront admission donation fees',
              detail: 'In China, you pay standard annual tuition directly to the university in manageable installments.',
            },
            {
              label: 'You plan to sit for USMLE (USA), PLAB (UK), or practice internationally',
              detail: 'Chinese medical schools have strong international alumni networks actively practicing in the US, UK, and Australia.',
            },
            {
              label: 'You have solid HSC Biology scores (GPA 3.50+) but narrowly missed public medical seats',
              detail: 'Do not settle for sub-standard clinical training; enter world-ranked public medical schools in China.',
            },
          ]}
          reconsiderTitle="Choose Private Medical in Bangladesh if:"
          reconsiderItems={[
            {
              label: 'You cannot spend 5 to 6 years residing outside Bangladesh',
              detail: 'If immediate family responsibilities prevent international living, domestic private colleges offer physical proximity.',
            },
            {
              label: 'You are unwilling to learn basic conversational Chinese',
              detail: 'Although classes are in English, hospital ward patient communication requires basic everyday Chinese (HSK-3 level).',
            },
            {
              label: 'You cannot meet BMDC foreign study eligibility (GPA 9.00 combined)',
              detail: 'BMDC enforces minimum combined GPA 9.00 for foreign medical degree registration; do not travel abroad without this verification.',
            },
          ]}
        />
      </Section>

      {/* FAQs */}
      <div id="faq" className="scroll-mt-24">
        <FaqBlock items={FAQS} tone="sage" title="Frequently Asked Questions: MBBS Bangladesh vs. China" />
      </div>

      {/* Cross Links */}
      <PathwayCrossLinks
        currentPath={PATH}
        tone="white"
        extraLinks={[
          { label: 'Full Guide: MBBS in China for Bangladeshi Students', href: '/mbbs-in-china-bangladesh' },
          { label: 'বাংলায় MBBS গাইড ও BMDC শর্তাবলী', href: '/bn/mbbs-in-china-bangladesh' },
          { label: 'CSCA Medical Preparation & Requirements', href: '/bn/csca-exam-bangladesh' },
          { label: 'Bangladesh vs. China Bachelor Degree (All Majors)', href: '/bangladesh-vs-china-bachelor-study' },
        ]}
      />

      {/* Governance & Authenticity Guarantee */}
      <PathwayGovernanceSection
        tone="sage"
        authorName="EduExpress Medical Advisory Desk"
        authorRole="Reviewed by Senior Medical Admissions Consultants"
        lastVerified="25 November 2026"
        nextReview="25 February 2027"
        whatMayChange={[
          'Bangladesh private medical college admission fee caps are set by the Ministry of Health and Family Welfare (MOHFW).',
          'BMDC eligibility rules (Biology GPA ≥ 3.50, combined GPA ≥ 9.00) are statutory and strictly verified prior to departure.',
          'Chinese MOE English-medium university lists and intake seat limits are confirmed annually.',
          'RMB to BDT currency conversion fluctuates based on official commercial bank foreign exchange rates.',
        ]}
        sources={OFFICIAL_SOURCES}
      />

      {/* Assessment Funnel */}
      <Section
        id="mbbs-assessment"
        title="Check Your MBBS Eligibility for China (BMDC & MOE Pre-Check)"
        intro="Enter your SSC & HSC GPA, Biology grade, and study preferences. Our medical counselors will provide an itemized fee breakdown and list of approved universities within 24 hours."
      >
        <div className="mx-auto max-w-3xl">
          <EducationFitAssessment initialContext={{ country: 'china' }} />
        </div>
      </Section>

      <CtaBand
        title="Compare authentic costs before paying BDT 20 Lakhs in local admission fees."
        text="Visit our Dhanmondi desk or talk to our medical advisors for an authentic, transparent breakdown of BMDC-recognized Chinese universities."
        assessmentHref="#mbbs-assessment"
      />
    </article>
  );
}
