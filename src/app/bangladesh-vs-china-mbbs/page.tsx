import Image from 'next/image';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileWarning,
  Globe2,
  Hospital,
  Landmark,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import CscaMasterProOfferCard from '@/components/china/CscaMasterProOfferCard';
import {
  CtaBand,
  FaqBlock,
  JsonLd,
  PageHero,
  Section,
  TrustBar,
  VerifiedFactsBlock,
  kit,
} from '@/components/page/PageKit';
import {
  MbbsCostCalculator,
  MoeMbbsDirectoryExplorer,
} from '@/components/pathways/MbbsComparisonWorkbench';
import {
  FitVsReconsiderGrid,
  LivingCostSeparationNotice,
  PathwayCrossLinks,
  PathwayGovernanceSection,
  WinningAdvantageGrid,
} from '@/components/pathways/PathwaySharedBlocks';
import {
  ALLIED_HEALTH_ALTERNATIVES,
  BANGLADESH_PRIVATE_FEE_BREAKDOWN,
  BMDC_ELIGIBILITY_FACT_CHECK,
  BMDC_RQE_CHECKLIST_DOSSIER,
  BMDC_RQE_SPECIFICATIONS,
  CHINA_MEDICAL_SCHOLARSHIP_MATRIX,
  CHINA_MOE_PROVINCIAL_DISTRIBUTION,
  CHINA_VISA_FIRST_TERMS,
  MBBS_COMPARISON_FAQS,
  MBBS_COMPARISON_LAST_UPDATED_ISO,
  MBBS_COMPARISON_LAST_UPDATED_LABEL,
  MBBS_COMPARISON_NEXT_REVIEW_LABEL,
  MBBS_HEAD_TO_HEAD_ROWS,
  MBBS_OFFICIAL_SOURCES,
  MBBS_WIN_CARDS,
  MOE_MBBS_UNIVERSITIES,
  PRE_MED_FOUNDATION_TRACKS,
} from '@/data/bangladeshVsChinaMbbs';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { mbbsApplyHref } from '@/lib/mbbs-enquiry';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bangladesh-vs-china-mbbs';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const ON_PAGE_NAV = [
  ['Cost Calculator', 'cost-calculator'],
  ['MOHFW vs China Fees', 'head-to-head'],
  ['BMDC & Practice Law', 'bmdc-regulations'],
  ['BMDC RQE & Dossier', 'bmdc-rqe'],
  ['45 MOE Schools', 'moe-directory'],
  ['Scholarships', 'scholarships'],
  ['March Pre-Med', 'pre-med'],
  ['Pharmacy & Biotech', 'allied-health'],
  ['FAQs', 'faq'],
] as const;

const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));

export async function generateMetadata() {
  return pageMetadata({
    title: 'MBBS in Bangladesh Private Medical vs China 2027: Costs, BMDC & RQE Rules | EduExpress',
    description:
      'Authentic comparison of Bangladesh private medical colleges (MOHFW gazetted fees) vs 45 Chinese MOE public medical universities. Includes BMDC Eligibility Certificate fact-check, RQE licensing law, hospital scale, scholarships, and March Pre-Med pathways.',
    path: PATH,
    type: 'article',
    locale: 'en_BD',
    image: ogImage('china-guide', 'MBBS in Bangladesh Private Medical vs China: Verified Costs & BMDC Practice Regulations — EduExpress'),
  });
}

export default function BangladeshVsChinaMbbsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebPage', 'Article'],
        '@id': `${canonical}#article`,
        url: canonical,
        mainEntityOfPage: canonical,
        headline: 'MBBS in Private Medical Colleges in Bangladesh vs. China (2027): Costs, Hospitals & BMDC Practice Regulations',
        name: 'MBBS in Bangladesh Private Medical Colleges vs. China — Verified Comparison & BMDC Guide',
        description:
          'Evidence-first comparison of Bangladesh MOHFW-regulated private medical colleges against Chinese MOE-authorized English MBBS universities, complete with BMDC Act 2010 RQE & Eligibility Certificate regulations.',
        image: `${SITE}/og/china-guide.jpg`,
        primaryImageOfPage: primaryImageOfPageSchema('/og/china-guide.jpg'),
        datePublished: `${MBBS_COMPARISON_LAST_UPDATED_ISO}T00:00:00Z`,
        dateModified: `${MBBS_COMPARISON_LAST_UPDATED_ISO}T00:00:00Z`,
        inLanguage: 'en-BD',
        author: { '@type': 'Person', name: 'Afsana Meme', jobTitle: 'Senior Consultant — China Admissions & Scholarships' },
        reviewedBy: { '@type': 'Person', name: 'Abdullah Al Rakib', jobTitle: 'Founder and CEO' },
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(MBBS_OFFICIAL_SOURCES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#moe-mbbs-list`,
        name: 'Chinese MOE-Authorized English-Medium MBBS Universities Reference List',
        numberOfItems: MOE_MBBS_UNIVERSITIES.length,
        itemListElement: MOE_MBBS_UNIVERSITIES.slice(0, 15).map((uni, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: uni.name,
          url: `${SITE}/universities/${uni.slug}`,
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
        eyebrow="Verified 2026/2027 Medical Comparison · MOHFW Fees · BMDC Act 2010 & RQE Guide"
        title="MBBS in Private Medical Colleges in Bangladesh vs. China."
        lead="Before committing BDT 12.74 Lakh upfront at a local private medical college, compare statutory MOHFW fees, Grade-3A tertiary hospital scale, 45 Chinese MOE public medical universities, and the exact BMDC Registration Qualifying Examination (RQE) law required to practice as a doctor in Bangladesh."
        reviewed={MBBS_COMPARISON_LAST_UPDATED_LABEL}
        actions={
          <>
            <a href="#bmdc-regulations" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              BMDC &amp; Practice Law <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#cost-calculator" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Compare 6-Year Costs
            </a>
            <a href="#moe-directory" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Explore 45 MOE Schools
            </a>
          </>
        }
        aside={
          <figure className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/real/china_campus/cie_campus_visit.webp"
                alt="EduExpress campus verification visit at an international medical education college in China"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover object-[68%_43%]"
              />
              <figcaption className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/95 px-4 py-2 text-[13px] font-semibold text-petrol-800 backdrop-blur-sm">
                <span>MOHFW Private BD vs. China MOE</span>
                <span className="rounded-full bg-lime-pale px-2.5 py-0.5 text-[12px] text-lime-deep">
                  BMDC RQE Verified
                </span>
              </figcaption>
            </div>
            <dl className="grid grid-cols-3 divide-x divide-canvas-soft p-5 text-center">
              {[
                ['MOE Schools', '45'],
                ['Annual Seats', '3,080'],
                ['Capitation Fee', 'BDT 0'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[13.5px] text-ink-soft">{label}</dt>
                  <dd className="mt-1 font-display text-[22px] font-black text-petrol-800">{value}</dd>
                </div>
              ))}
            </dl>
          </figure>
        }
      />

      <TrustBar
        destination="China"
        universities={45}
        feeNote="BDT 0 EduExpress service fee before China visa approval"
      />

      {/* Quick In-Page Navigation + Recognition-First Lead */}
      <section aria-label="Recognition and section navigation" className="border-b border-canvas-soft bg-white py-7">
        <div className={`${kit.wrap} grid gap-6 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-10`}>
          <p className="text-[15.5px] leading-7 text-ink-soft">
            <strong className="text-petrol-800">Lead with recognition, not tuition alone.</strong> Choosing MBBS in China
            gives Bangladeshi families stronger public hospital training and zero capitation shock—<em>only</em> when you
            select a Chinese Ministry of Education (MOE) authorized English programme and follow BMDC eligibility and
            RQE rules from day one.
          </p>
          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {ON_PAGE_NAV.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="inline-flex min-h-[40px] items-center rounded-full bg-canvas-soft px-3.5 text-[14px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Section 1: Direct Answer + Interactive Cost Calculator */}
      <Section
        id="cost-calculator"
        title="The real cost comparison: MOHFW private medical fees vs. China MOE universities."
        intro="In Bangladesh, Ministry of Health & Family Welfare (MOHFW) gazettes cap local private MBBS admission at BDT 19,44,000 plus BDT 1,80,000 internship (requiring BDT 12,74,400 upfront on Day 1) and BDT 10,000/month tuition—making the statutory academic core BDT 27.24 Lakh before university exams, hostel, and meals (~BDT 36–45+ Lakh residential total). In China, state-subsidized MOE public medical universities charge BDT 0 capitation and annual tuition from CNY 24,000–34,000/yr, delivering 3,000–10,000+ bed Grade-3A tertiary hospital training and global WDOMS mobility."
      >
        <LivingCostSeparationNotice
          summary="Every comparison on this page strictly separates Statutory Academic Tuition & On-Campus Dormitory Fees from Personal Living Costs (meals, local transport, winter clothing, flights, visa, and EduExpress’s visa-first service package). Chinese fees remain in CNY/RMB alongside editable BDT conversions so families verify against live bank TT rates."
        />

        <div className="mt-8">
          <MbbsCostCalculator assessmentHref="#mbbs-assessment" />
        </div>

        {/* Bangladesh MOHFW Statutory Breakdown Table */}
        <div className="mt-10">
          <h3 className={kit.h3}>Verified Bangladesh Private Medical College Fee Structure (MOHFW / DGME Gazette)</h3>
          <p className="mt-2 max-w-3xl text-[15.5px] leading-7 text-ink-soft">
            Official government-regulated breakdown for Bangladeshi nationals enrolling in domestic private medical
            colleges, showing mandatory payment milestones and separate living costs.
          </p>
          <div className="mt-4 overflow-x-auto rounded-3xl border border-canvas-soft bg-white shadow-sm">
            <table className="w-full min-w-[740px] text-left text-[14.5px] leading-6">
              <caption className="sr-only">
                Bangladesh private medical college official MOHFW and DGME gazetted fee schedule
              </caption>
              <thead className="border-b border-canvas-soft bg-canvas-soft text-petrol-800">
                <tr>
                  <th scope="col" className="p-4 font-bold">Fee Component (Bangladesh Private MBBS)</th>
                  <th scope="col" className="p-4 font-bold">Official / Estimated Amount</th>
                  <th scope="col" className="p-4 font-bold">Payment Schedule</th>
                  <th scope="col" className="p-4 font-bold">Regulatory Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-soft text-ink-soft">
                {BANGLADESH_PRIVATE_FEE_BREAKDOWN.map((row) => {
                  const isSubtotal = row.item.startsWith('Statutory Core');
                  return (
                    <tr key={row.item} className={isSubtotal ? 'bg-lime-pale/35 font-semibold text-petrol-800' : ''}>
                      <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                        {row.item}
                      </th>
                      <td className="p-4 align-top font-bold text-petrol-800">{row.statutoryAmount}</td>
                      <td className="p-4 align-top">{row.paymentTiming}</td>
                      <td className="p-4 align-top">{row.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Section 2: Three Core Wins */}
      <WinningAdvantageGrid
        id="why-china-wins"
        tone="sage"
        title="Why Ranked Chinese Public Medical Universities Outperform Local Private Colleges"
        intro="Compare upfront cash-flow pressure, tertiary clinical hospital scale, and international licensure mobility side by side."
        cards={MBBS_WIN_CARDS}
      />

      {/* Section 3: Head-to-Head 8-Point Proof Table */}
      <Section
        id="head-to-head"
        title="Head-to-Head Comparison: Bangladesh Private Medical vs. China MOE Universities"
        intro="Eight critical academic, financial, clinical, and regulatory benchmarks every medical aspirant and parent must verify before enrolling."
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white shadow-sm">
          <table className="w-full min-w-[820px] text-left text-[14.5px] leading-6">
            <caption className="sr-only">
              Side-by-side comparison of Bangladesh private medical colleges and Chinese MOE English MBBS universities
            </caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Evaluation Dimension</th>
                <th scope="col" className="p-4 font-bold">Bangladesh Private Medical College</th>
                <th scope="col" className="p-4 font-bold text-lime">China MOE Public Medical University</th>
                <th scope="col" className="p-4 font-bold">Key Takeaway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {MBBS_HEAD_TO_HEAD_ROWS.map((row) => (
                <tr key={row.criterion} className="hover:bg-canvas-soft/40">
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                    <span className="block">{row.criterion}</span>
                    <span className="mt-1 block text-[12.5px] font-normal text-ink-mute">{row.detailNote}</span>
                  </th>
                  <td className="p-4 align-top">{row.bdPrivate}</td>
                  <td className="bg-lime-pale/25 p-4 align-top font-medium text-petrol-800">{row.chinaMoe}</td>
                  <td className="p-4 align-top">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-pale px-3 py-1 text-[12.5px] font-bold text-lime-deep">
                      <CheckCircle2 size={13} aria-hidden="true" />
                      {row.advantageLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 4: BMDC & BANGLADESH PRACTICE REGULATIONS (NAVY FLAGSHIP BAND) */}
      <Section
        id="bmdc-regulations"
        tone="navy"
        title="BMDC & Bangladesh Medical Practice Regulations (2026–2027)."
        intro="Under the Bangladesh Medical and Dental Council Act, 2010 (Sections 5 & 12), no Bangladeshi national who graduates with a foreign MBBS or BDS degree receives automatic registration. Follow this exact statutory four-stage pathway from Day 1 so your Chinese medical degree translates smoothly into legal medical practice in Bangladesh."
      >
        {/* 4-Step Legal Pathway */}
        <ol data-anim="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: 'Stage 01 · Pre-Departure',
              title: 'MOE Authorisation & BMDC Eligibility Audit',
              body: 'Confirm your university holds programme-specific Chinese MOE authorisation for English-taught MBBS (Article 30) and is listed in WDOMS. Verify your SSC/HSC Science GPA, HSC Biology ≥ 3.50, study gap, and current BMDC Eligibility Certificate circular at bmdc.org.bd BEFORE paying any deposit.',
            },
            {
              step: 'Stage 02 · Years 1–5 in China',
              title: 'In-Person Study, HSK-4 & Visa Trail',
              body: 'Complete all pre-clinical and clinical coursework physically on campus—online medical degrees are rejected by BMDC. Pass HSK-4 for clinical ward communication and safeguard EVERY passport containing China X1 visas, Residence Permits, and immigration entry-exit stamps.',
            },
            {
              step: 'Stage 03 · Graduation & Attestation',
              title: 'Embassy + MoFA Legalization & BMDC RQE',
              body: 'Legalize original Chinese & English degree certificates and transcripts via the Bangladesh Embassy in Beijing and MoFA in Dhaka. Submit the 13-point dossier at BMDC Bijoy Nagar and pass the biannual Registration Qualifying Examination (RQE).',
            },
            {
              step: 'Stage 04 · Licensing in Bangladesh',
              title: 'Provisional License → 1-Yr Internship → Full BMDC',
              body: 'After passing RQE, BMDC grants Provisional (Temporary) Registration to complete a mandatory 12-month rotatory internship at a BMDC-approved hospital in Bangladesh (or assesses China internship logs for required local acclimatization), culminating in Permanent BMDC Registration.',
            },
          ].map((item) => (
            <li key={item.step} className="rounded-3xl border border-white/15 bg-white/5 p-6">
              <span className="inline-flex rounded-full bg-lime px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-petrol-800">
                {item.step}
              </span>
              <h3 className="mt-4 font-display text-[20px] font-bold leading-snug text-white">{item.title}</h3>
              <p className="mt-2.5 text-[15px] leading-7 text-white/80">{item.body}</p>
            </li>
          ))}
        </ol>

        {/* Global Licensure Callout Strip */}
        <div className="mt-8 rounded-3xl border border-lime/30 bg-white/10 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-lime text-petrol-800">
                <Globe2 size={24} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[18px] font-bold text-lime">
                  Permanent BMDC Registration Unlocks Full Career Rights — Plus Global WDOMS Mobility
                </h3>
                <p className="mt-1 text-[15px] leading-6 text-white/85">
                  Once permanently registered with BMDC after RQE and internship, China MBBS graduates hold identical
                  clinical practice rights in Bangladesh—eligible for private/hospital practice, <strong>BCS (Health)</strong>,{' '}
                  <strong>FCPS</strong>, <strong>MD</strong>, and <strong>MS</strong> postgraduate residency. Simultaneously,
                  MOE universities listed in WDOMS with valid ECFMG Sponsor Notes remain eligible for{' '}
                  <strong>USMLE (USA)</strong>, <strong>UKMLA / PLAB (UK)</strong>, and <strong>AMC (Australia)</strong>{' '}
                  subject to each host council’s active accreditation standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 5: CRITICAL FACT-CHECK ON BMDC ELIGIBILITY CERTIFICATE RUMORS */}
      <Section
        id="bmdc-fact-check"
        title="Critical Fact-Check: Separating Sub-Agent Rumors from Legal BMDC Reality"
        intro="One of the costliest mistakes Bangladeshi families make is trusting unverified brokers who say 'BMDC Eligibility Certificate is no longer needed' just because China doesn't ask for it during visa processing. Read the exact legal distinction below."
      >
        <div className="mb-7 rounded-3xl border border-clay/30 bg-clay/5 p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-clay text-white">
              <ShieldAlert size={22} aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[18px] font-bold text-petrol-800">
                Warning: Never Confuse &ldquo;Not Needed for China X1 Visa&rdquo; with &ldquo;Not Needed for BMDC Doctor Registration&rdquo;
              </h3>
              <p className="mt-1.5 text-[15px] leading-7 text-ink-soft">
                Chinese universities and the Chinese Embassy in Dhaka issue Offer Letters, JW202 forms, and X1 visas
                without requesting a BMDC Eligibility Certificate. However, the official{' '}
                <strong>BMDC RQE Application Form</strong> explicitly lists{' '}
                <strong>Item 6 (&ldquo;Eligibility Certificate Sl. No. &amp; Date of Issue&rdquo;)</strong> and{' '}
                <strong>Item 12(c) (&ldquo;Original Eligibility Certificate from BM&amp;DC with photocopy&rdquo;)</strong>.
                Note that BMDC periodically issues cohort notices (including 2025/2026 administrative circulars on{' '}
                <code>bmdc.org.bd</code>); always verify the exact active circular for your intake year—and remember
                that BMDC <em>always</em> audits your original SSC/HSC Science GPA and Biology ≥ 3.50 threshold.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white shadow-sm">
          <table className="w-full min-w-[820px] text-left text-[14.5px] leading-6">
            <caption className="sr-only">
              Fact check comparing sub-agent myths with actual BMDC legal regulations and EduExpress operational policy
            </caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Regulatory Aspect</th>
                <th scope="col" className="p-4 font-bold">What Sub-Agents Claim (Myth)</th>
                <th scope="col" className="p-4 font-bold text-lime">Actual Legal Reality at BMDC (Dhaka)</th>
                <th scope="col" className="p-4 font-bold">EduExpress Operational Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {BMDC_ELIGIBILITY_FACT_CHECK.map((row) => (
                <tr key={row.aspect}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                    {row.aspect}
                  </th>
                  <td className="bg-clay/5 p-4 align-top text-ink-soft">{row.agencyMyth}</td>
                  <td className="bg-lime-pale/25 p-4 align-top font-medium text-petrol-800">{row.legalReality}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{row.eduExpressPolicy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 6: COMPLETE BMDC RQE GUIDE & 13-POINT MANDATORY DOSSIER */}
      <Section
        id="bmdc-rqe"
        tone="sage"
        title="Complete Guide to the BMDC Registration Qualifying Examination (RQE)"
        intro="Exact operational details for returning China MBBS graduates—covering exam schedule, Bijoy Nagar verification venue, syllabus, retake policy, and the mandatory document & passport attestation dossier."
      >
        <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
          {/* Left: RQE Specification Table */}
          <div className="space-y-4">
            {BMDC_RQE_SPECIFICATIONS.map((spec) => (
              <div key={spec.parameter} className={kit.card}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-lime-deep">
                    <Scale size={14} aria-hidden="true" />
                    {spec.parameter}
                  </span>
                </div>
                <h3 className="mt-1.5 text-[18px] font-bold text-petrol-800">{spec.officialRule}</h3>
                <p className="mt-2 text-[15px] leading-7 text-ink-soft">{spec.practicalDetail}</p>
              </div>
            ))}
          </div>

          {/* Right: 13-Point Mandatory Document & Attestation Dossier */}
          <aside className={`${kit.cardOutline} self-start`}>
            <div className="flex items-center gap-3">
              <span className={kit.iconLime}>
                <ClipboardCheck size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[12.5px] font-bold uppercase tracking-wider text-lime-deep">
                  BMDC Bijoy Nagar Registrar Audit
                </p>
                <h3 className={kit.h3}>Mandatory RQE Document &amp; Attestation Dossier</h3>
              </div>
            </div>
            <p className="mt-3 text-[14.5px] leading-6 text-ink-soft">
              BMDC requires a strict 13-point physical document dossier verified at{' '}
              <strong className="text-petrol-800">203 Shaheed Syed Nazrul Islam Sarani, Bijoy Nagar, Dhaka</strong>.
              Start organizing these records from Year 1:
            </p>
            <ul className="mt-5 space-y-4">
              {BMDC_RQE_CHECKLIST_DOSSIER.map((doc) => (
                <li
                  key={doc.title}
                  className={`rounded-2xl p-4 ${
                    doc.critical ? 'border border-clay/30 bg-clay/5' : 'bg-canvas-soft'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {doc.critical ? (
                      <FileWarning size={18} className="mt-0.5 shrink-0 text-clay" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lime-deep" aria-hidden="true" />
                    )}
                    <div>
                      <p className="text-[15px] font-bold text-petrol-800">{doc.title}</p>
                      <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">{doc.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl bg-petrol-800 p-4 text-[13.5px] leading-5 text-white/85">
              <strong className="text-lime">O-Level / A-Level Students:</strong> Obtain an official{' '}
              <strong>DGHS Equivalence Certificate</strong> for your Cambridge / Edexcel grades alongside your BMDC
              eligibility file before departure.
            </div>
          </aside>
        </div>
      </Section>

      {/* Section 7: PROVINCIAL BENCHMARKS & COMPLETE 45 MOE UNIVERSITIES DIRECTORY */}
      <Section
        id="moe-directory"
        title="45 Chinese MOE-Authorized English-MBBS Universities (2026/2027 Master Data)"
        intro="Filter all 45 Chinese Ministry of Education reference English-MBBS institutions by province, tier (C9 / 985 / 211 / Double First-Class / Provincial), annual tuition (CNY 24,000–75,000), March Pre-Med availability, CSCA requirements, and internship flexibility. Fees checked against 2026 official university guides (CQMU, WMU, JSU, XJTU, Tongji, Fudan) are tagged directly."
      >
        {/* Provincial Distribution Summary Cards */}
        <div className="mb-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className={kit.h3}>Provincial Distribution of Annual International MBBS Quotas</h3>
              <p className="mt-1 text-[14.5px] text-ink-soft">
                Total tracked across all 45 institutions: <strong className="text-petrol-800">3,080 annual seats</strong> ·
                Average annual tuition: <strong className="text-petrol-800">CNY 38,280</strong> · Lowest annual tuition:{' '}
                <strong className="text-petrol-800">CNY 24,000</strong> (China Three Gorges University).
              </p>
            </div>
            <Link href="/mbbs-in-china-bangladesh" className={kit.link}>
              Open full MBBS university profiles <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CHINA_MOE_PROVINCIAL_DISTRIBUTION.map((p) => (
              <div key={p.province} className="rounded-2xl border border-canvas-soft bg-canvas-soft/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-petrol-800">{p.province}</span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[12px] font-bold text-lime-deep">
                    {p.universities} unis
                  </span>
                </div>
                <p className="mt-2 font-display text-[19px] font-black text-petrol-800">
                  CNY {fmtNum(p.avgTuitionRmb)}
                  <span className="ml-1 font-sans text-[12px] font-normal text-ink-soft">avg/yr</span>
                </p>
                <p className="mt-0.5 text-[12.5px] font-semibold text-ink-soft">{p.annualQuota} annual seats</p>
                <p className="mt-1.5 text-[12px] leading-4 text-ink-mute">{p.flagshipExamples}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Searchable / Filterable 45-University Explorer */}
        <MoeMbbsDirectoryExplorer universities={MOE_MBBS_UNIVERSITIES} />

        <p className="mt-5 text-[13.5px] leading-6 text-ink-soft">
          <AlertTriangle size={14} className="mr-1.5 inline text-clay" aria-hidden="true" />
          <strong>Annual Quota Verification Notice:</strong> China’s Ministry of Education publishes annual updates to
          programme-specific English-MBBS enrollment quotas before each academic cycle. EduExpress verifies the current
          intake’s active authorization notice and exact fee schedule in writing before any student applies.
        </p>
      </Section>

      {/* Section 8: 6-Month March Pre-Med Foundation + CSCA Preparation */}
      <Section
        id="pre-med"
        tone="sage"
        title="6-Month March Pre-Medical Foundation & CSCA Readiness."
        intro="43 of the 45 MOE medical universities offer Spring (March) 6-month Pre-Medical or 1-year Preparatory tracks—helping Bangladeshi HSC students avoid losing an entire academic year while preparing for CSCA and HSK."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {PRE_MED_FOUNDATION_TRACKS.map((track) => (
            <div key={track.title} className={`${kit.card} flex flex-col justify-between`}>
              <div>
                <span className={kit.badge}>
                  <BookOpen size={14} aria-hidden="true" />
                  {track.durationAndIntake}
                </span>
                <h3 className={`mt-4 ${kit.h3}`}>{track.title}</h3>
                <p className="mt-2 font-display text-[20px] font-black text-petrol-800">{track.typicalFee}</p>
                <ul className="mt-4 space-y-2.5 text-[15px] leading-6 text-ink-soft">
                  {track.whoNeedsIt.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-deep" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-5 rounded-2xl bg-canvas-soft p-4 text-[13.5px] leading-5 text-ink-soft">
                <strong className="text-petrol-800">Progression &amp; Budgeting Rule:</strong> {track.progressionNote}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <CscaMasterProOfferCard assessmentHref={mbbsApplyHref('MBBS Bangladesh vs China Comparison')} compact />
        </div>
      </Section>

      {/* Section 9: HONEST CHINA MEDICAL, PHARMACY & BIOTECH SCHOLARSHIP MATRIX */}
      <Section
        id="scholarships"
        title="China Medical & Allied Health Scholarship Matrix (Honest Reality)."
        intro="Unlike local Bangladeshi private medical colleges—where commercial seats carry virtually zero tuition waivers—Chinese provincial governments and public universities award structured freshman and annual merit grants. Here is the realistic breakdown without exaggerated '100% free MBBS' promises."
      >
        <div className="mb-6 rounded-3xl bg-lime-pale p-6">
          <div className="flex items-start gap-3.5">
            <span className={kit.icon}>
              <Award size={22} aria-hidden="true" />
            </span>
            <div className="text-[15px] leading-6 text-ink-soft">
              <p className="font-bold text-petrol-800">Counselor Honesty Rule on MBBS Scholarships</p>
              <p className="mt-1">
                English-taught MBBS is rarely 100% tuition-free for all 6 years. Smart Bangladeshi families budget on
                published base tuition first, apply before <strong>May 15</strong> to capture{' '}
                <strong>Year-1 Freshman / Provincial grants (CNY 10,000–30,000)</strong>, and then maintain strong
                grades for <strong>Years 2–5 Annual Academic Merit Awards (CNY 5,000–15,000/yr)</strong>. Families
                needing a guaranteed 50%–100% tuition waiver across all years should compare the 4-year Pharmacy &amp;
                Biotech routes below.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white shadow-sm">
          <table className="w-full min-w-[860px] text-left text-[14px] leading-6">
            <caption className="sr-only">
              China medical, pharmacy and biotechnology scholarships available to Bangladeshi students
            </caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Scholarship &amp; Authority</th>
                <th scope="col" className="p-4 font-bold">Applicable Programs</th>
                <th scope="col" className="p-4 font-bold text-lime">Coverage &amp; Value (CNY)</th>
                <th scope="col" className="p-4 font-bold">Window &amp; Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {CHINA_MEDICAL_SCHOLARSHIP_MATRIX.map((item) => (
                <tr key={item.name} className="hover:bg-canvas-soft/40">
                  <th scope="row" className="p-4 align-top">
                    <span className="block font-bold text-petrol-800">{item.name}</span>
                    <span className="mt-0.5 block text-[12.5px] font-normal text-ink-mute">{item.authority}</span>
                  </th>
                  <td className="p-4 align-top">{item.eligiblePrograms}</td>
                  <td className="bg-lime-pale/20 p-4 align-top font-semibold text-petrol-800">{item.coverageValue}</td>
                  <td className="p-4 align-top">
                    <span className="block font-semibold text-petrol-800">{item.window}</span>
                    <span className="mt-1 block text-[13px]">{item.renewalRule}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 10: HIGH-SCHOLARSHIP ALLIED HEALTH ALTERNATIVES (PHARMACY, BIOTECH, BDS, NURSING) */}
      <Section
        id="allied-health"
        tone="sage"
        title="High-Scholarship Alternatives: English Pharmacy, Biotechnology, BDS & Nursing."
        intro="If your budget cannot stretch to 6-year MBBS tuition, you have a 2–3 year study gap, or your HSC Biology grade does not meet BMDC MBBS thresholds, these 4–5 year English-taught health science degrees offer 50% to 100% tuition waivers at top Chinese universities—with average net tuition around CNY 14,867/yr (and as low as CNY 0/yr)."
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-[14px] leading-5">
            <caption className="sr-only">
              English-taught Pharmacy, Biotechnology, BDS Dentistry and Nursing alternatives in China with scholarship details
            </caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">University &amp; Tier</th>
                <th scope="col" className="p-4 font-bold">English-Taught Major</th>
                <th scope="col" className="p-4 font-bold text-lime">Gross vs. Net Tuition (CNY/yr)</th>
                <th scope="col" className="p-4 font-bold">Scholarship Policy</th>
                <th scope="col" className="p-4 font-bold">Council &amp; Career Route</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {ALLIED_HEALTH_ALTERNATIVES.map((alt) => (
                <tr key={`${alt.university}-${alt.major}`} className="hover:bg-canvas-soft/45">
                  <td className="p-4 align-top">
                    {alt.slug ? (
                      <Link href={`/universities/${alt.slug}`} className="font-bold text-petrol-800 hover:underline">
                        {alt.university}
                      </Link>
                    ) : (
                      <span className="font-bold text-petrol-800">{alt.university}</span>
                    )}
                    <p className="mt-0.5 text-[12.5px] text-ink-mute">{alt.city} · {alt.tier}</p>
                  </td>
                  <td className="p-4 align-top">
                    <p className="font-semibold text-petrol-800">{alt.major}</p>
                    <p className="mt-0.5 text-[12.5px]">{alt.duration} · Dorm ~CNY {fmtNum(alt.hostelRmb)}/yr</p>
                  </td>
                  <td className="bg-lime-pale/25 p-4 align-top">
                    <p className="text-[12.5px] text-ink-mute line-through">Gross: CNY {fmtNum(alt.grossTuitionRmb)}/yr</p>
                    <p className="font-display text-[17px] font-black text-lime-deep">
                      Net: CNY {fmtNum(alt.netAfterScholarshipRmb)}/yr
                    </p>
                  </td>
                  <td className="p-4 align-top">{alt.scholarshipSummary}</td>
                  <td className="p-4 align-top">{alt.councilAndCareer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 11: Verified Facts & China Visa-First Policy */}
      <Section id="verified-facts" title="Verified Policy Benchmarks & China Visa-First Terms">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <VerifiedFactsBlock
            verifiedDate={MBBS_COMPARISON_LAST_UPDATED_LABEL}
            reviewer="EduExpress Medical Advisory & Compliance Desk"
            facts={[
              {
                claim:
                  'Bangladesh MOHFW gazettes cap local private medical college admission at BDT 19,44,000 + BDT 1,80,000 internship (60% = BDT 12,74,400 due at admission) plus BDT 10,000/month tuition (60 months = BDT 6,00,000), totaling BDT 27,24,000 before exams, hostel, and meals.',
                source: 'Ministry of Health & Family Welfare (MOHFW / DGME) Bangladesh',
                sourceUrl: 'https://dgme.gov.bd',
              },
              {
                claim:
                  'Under the BMDC Act, 2010, all foreign MBBS/BDS graduates must pass the biannual BMDC Registration Qualifying Examination (RQE) and complete mandatory internship before obtaining Permanent BMDC Registration in Bangladesh.',
                source: 'Bangladesh Medical & Dental Council (BMDC) RQE Official Dossier',
                sourceUrl: 'https://www.bmdc.org.bd/upl/doc/form/QSPRfvjJ5NtF.pdf',
              },
              {
                claim:
                  'Chinese Ministry of Education Article 30 requires programme-specific authorisation for English-medium undergraduate Clinical Medicine (MBBS); general university recognition alone is not sufficient.',
                source: 'Ministry of Education of China (MOE) Regulations',
                sourceUrl: 'https://en.moe.gov.cn/documents/laws_policies/201506/t20150626_191405.html',
              },
              {
                claim:
                  '2026 official university tuition checks confirm CQMU CNY 30,000/yr (CNY 15,000 freshman award), WMU CNY 33,000/yr (up to CNY 20,000 freshman award), JSU CNY 34,000/yr, XJTU CNY 40,000/yr, and China Three Gorges starting from CNY 24,000/yr—all with BDT 0 capitation fee.',
                source: 'Published 2026 University Undergraduate Guides (CQMU / WMU / JSU / XJTU)',
                sourceUrl: 'https://english.cqmu.edu.cn/info/1148/3038.htm',
              },
            ]}
          />

          <div className={`${kit.cardDark} flex flex-col justify-between`}>
            <div>
              <p className="flex items-center gap-2 text-[19px] font-bold text-lime">
                <ShieldCheck size={22} aria-hidden="true" />
                China Visa-First Payment Terms
              </p>
              <p className="mt-3 text-[15.5px] leading-7 text-white/85">{CHINA_VISA_FIRST_TERMS}</p>
              <ul className="mt-5 space-y-2.5 border-t border-white/15 pt-5 text-[14.5px] text-white/80">
                <li className="flex items-start gap-2.5">
                  <Hospital size={16} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
                  <span>Written MOE English-MBBS authorisation &amp; WDOMS check before application</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Landmark size={16} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
                  <span>Pre-departure BMDC GPA, Biology &amp; Eligibility Certificate audit</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Stethoscope size={16} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
                  <span>Itemised ClearCost Sheet separating CNY university fees from BDT package fees</span>
                </li>
              </ul>
            </div>
            <Link href="/china-visa-first-policy" className="ed-btn ed-btn-on-dark mt-6 min-h-[48px] px-5">
              Read full Visa-First Policy <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Section 12: Decision Fit Matrix */}
      <Section
        id="decision-fit"
        tone="sage"
        title="Who Should Choose MBBS in China vs. Staying in Bangladesh?"
        intro="Evidence-first counseling means stating honestly both when China is the clear winner and when staying in Bangladesh—or choosing Pharmacy/Biotech—makes better sense."
      >
        <FitVsReconsiderGrid
          tone="sage"
          fitTitle="Choose MBBS in China if:"
          fitItems={[
            {
              label: 'You want Grade-3A tertiary clinical training (3,000–10,000+ beds)',
              detail:
                'Gain massive clinical patient volume, modern 3D dissection suites, and robotic surgical exposure inside state-funded provincial medical university hospitals.',
            },
            {
              label: 'Your family prefers annual tuition over BDT 12.74 Lakh Day-1 private admission shock',
              detail:
                'Pay BDT 0 capitation and spread tuition annually directly to the public university, reducing costs further with Year-1 Freshman/Provincial and Years 2–5 Merit scholarships.',
            },
            {
              label: 'You meet BMDC science baselines and want dual BD + global (USMLE/UKMLA) options',
              detail:
                'Graduate with a globally ranked public university MBBS recognized for BMDC RQE in Bangladesh as well as WDOMS international licensing tracks.',
            },
            {
              label: 'You missed public medical seats or September deadlines',
              detail:
                'Use a 6-month March Pre-Medical Foundation track to enter Year-1 MBBS in September without losing a full year at home.',
            },
          ]}
          reconsiderTitle="Reconsider or Pivot if:"
          reconsiderItems={[
            {
              label: 'Your HSC Biology GPA is below 3.50 or you have a multi-year study gap',
              detail:
                'Do not enroll in MBBS hoping to practice clinically in Bangladesh—BMDC audits original HSC marksheets at RQE. Pivot to 4-year B.Sc. Pharmacy or Biotechnology with up to 100% scholarships instead.',
            },
            {
              label: 'You are unwilling to learn clinical Chinese (HSK-4)',
              detail:
                'Lectures are in English, but interviewing real patients during Years 4–6 hospital rotations and meeting graduation rules require HSK-4 Chinese.',
            },
            {
              label: 'You cannot live abroad for 5–6 years or pass an independent licensing exam',
              detail:
                'Foreign medical graduates must pass the BMDC RQE upon return. If you require immediate family proximity in Dhaka and cleared the DGME test, a local college may fit better.',
            },
          ]}
        />
      </Section>

      {/* Section 13: FAQs (Note: FaqBlock automatically emits FAQPage JSON-LD — no duplicate schema!) */}
      <div id="faq" className="scroll-mt-24">
        <FaqBlock
          items={MBBS_COMPARISON_FAQS}
          tone="white"
          title="Frequently Asked Questions: Bangladesh Private MBBS vs. China & BMDC Rules"
        />
      </div>

      {/* Cross Links */}
      <PathwayCrossLinks
        currentPath={PATH}
        tone="sage"
        extraLinks={[
          { label: 'Full Guide: MBBS in China for Bangladeshi Students', href: '/mbbs-in-china-bangladesh' },
          { label: 'বাংলায় চীনে MBBS গাইড ও BMDC শর্তাবলী', href: '/bn/mbbs-in-china-bangladesh' },
          { label: 'China Admission Requirements & CSCA Guide', href: '/china-admission-requirements' },
          { label: 'China Visa-First Fee Policy', href: '/china-visa-first-policy' },
          { label: 'Bangladesh vs. China Bachelor Degree (All Majors)', href: '/bangladesh-vs-china-bachelor-study' },
        ]}
      />

      {/* Governance & Editorial Review */}
      <PathwayGovernanceSection
        tone="white"
        authorName="Afsana Meme"
        authorRole="Senior Consultant (China Admissions, MBBS & Scholarships)"
        lastVerified={MBBS_COMPARISON_LAST_UPDATED_LABEL}
        nextReview={MBBS_COMPARISON_NEXT_REVIEW_LABEL}
        whatMayChange={[
          'Bangladesh private medical college statutory fee ceilings, installment splits, and domestic GPA thresholds are updated periodically by MOHFW and DGME gazettes.',
          'BMDC Eligibility Certificate administrative notices, RQE pass-mark circulars, negative-marking rules, and Pay Order fees are governed by active bmdc.org.bd circulars.',
          'Chinese Ministry of Education (MOE) annual English-MBBS university quotas, tuition schedules, and CSCA subject matrices are confirmed before each September intake.',
          'RMB-to-BDT conversion fluctuates daily with commercial bank foreign exchange TT selling rates.',
        ]}
        sources={MBBS_OFFICIAL_SOURCES}
      />

      {/* Embedded Assessment Funnel */}
      <Section
        id="mbbs-assessment"
        tone="sage"
        title="Get Your Free BMDC Pre-Check & China MBBS Shortlist"
        intro="Share your SSC & HSC (or O/A-Level) GPA, Biology grade, budget, and intake target. Our senior counselors reply within one working day with a BMDC eligibility check, 3–5 MOE-authorized universities, and an itemized ClearCost Sheet in writing."
      >
        <div className="mx-auto max-w-3xl">
          <EducationFitAssessment initialContext={{ country: 'china' }} />
        </div>
      </Section>

      <CtaBand
        title="Compare written proof before paying BDT 12.74 Lakh upfront."
        text="Bring your SSC/HSC transcripts to our Dhanmondi desk or book online for a BMDC eligibility verification and side-by-side ClearCost Sheet of Chinese MOE medical universities."
        assessmentHref="#mbbs-assessment"
      />
    </article>
  );
}
