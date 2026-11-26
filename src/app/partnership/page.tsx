import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  GraduationCap,
  Handshake,
  Lock,
  MessageCircle,
  Phone,
  Plane,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import PartnershipForm from '@/components/PartnershipForm';
import PartnershipContactLink from '@/components/partnership/PartnershipContactLink';
import DarkCrumbs from '@/components/page/DarkCrumbs';
import { FaqBlock, JsonLd, Section, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { countries } from '@/lib/countries';
import { primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';
import { getUniversityRecords } from '@/lib/university-records';

export const revalidate = 3600;

const PATH = '/partnership';
const PAGE_URL = `https://eduexpressint.com${PATH}`;

export const metadata = pageMetadata({
  title: 'B2B Education Agency Partnership in Bangladesh | EduExpress',
  description:
    'Partner with EduExpress as a B2B education agency, China processing partner, or referral desk—with written MOU terms, USD fee schedule, and 48h file audits.',
  path: PATH,
  image: ogImage('about', 'EduExpress International B2B education agency partnership desk in Dhaka'),
});

const partnershipTypes = [
  {
    number: '01',
    title: 'Regional Agency Partner',
    label: 'Territory-based cooperation',
    description:
      'Build a documented regional cooperation arrangement with training, file audits, and responsibilities confirmed in your written agreement.',
    features: [
      'Territory and scope confirmed in writing',
      'Onboarding and 6-point SOP training',
      'Approved university & cost-sheet materials',
      'Placement terms defined by destination',
      'Named B2B desk coordinator in Dhaka',
    ],
    icon: Shield,
  },
  {
    number: '02',
    title: 'China Strategic Partner',
    label: 'Flagship China B2B route',
    description:
      'Support China applicants through a transparent USD service-charge schedule, verified university routes, and timestamped portal tracking.',
    features: [
      'Governed China university & CSC route records',
      'Written Type-A, Type-B & Type-C fee schedule',
      'Scholarship options matched by student GPA & profile',
      'JW201 / JW202 & X1/X2 visa-readiness review',
      'Strict non-poaching & partner file attribution',
    ],
    icon: Handshake,
  },
  {
    number: '03',
    title: 'Referral & Sub-Agent Partner',
    label: 'Student referral cooperation',
    description:
      'Refer suitable students across China, Malaysia, and active destinations through a straightforward written arrangement with clear payout milestones.',
    features: [
      'Simple student handover with attribution log',
      'Zero partner onboarding or setup charge',
      'Written referral & privacy responsibilities',
      'Defined settlement & invoice triggers',
      'Regular portal & offer status updates',
    ],
    icon: Users,
  },
];

const pricingTable = [
  {
    type: 'Type-A',
    badge: 'Flagship Tier',
    coverage: 'Full Funded Scholarship',
    detail: 'Full tuition, campus accommodation & monthly stipend (as stated in the official university award)',
    bullets: [
      'CSC, Provincial & full university award routes',
      'Eligibility & GPA screening within 24–48 hours',
      'Timestamped portal ID & JW202 follow-up',
    ],
    price: '$800',
    numericPrice: 800,
    featured: true,
    icon: Award,
  },
  {
    type: 'Type-B',
    badge: 'Tuition Waiver',
    coverage: 'Tuition Fee Free',
    detail: '100% tuition fee waiver (hostel and living expenses remain payable per official university schedule)',
    bullets: [
      'Full tuition-waiver undergraduate & postgrad routes',
      'Clear separation of hostel & personal living costs',
      'Complete admission & visa checklist support',
    ],
    price: '$600',
    numericPrice: 600,
    featured: false,
    icon: GraduationCap,
  },
  {
    type: 'Type-C',
    badge: 'Partial Waiver',
    coverage: 'Partial Scholarship',
    detail: 'Partial tuition fee reduction confirmed in the university admission & scholarship notice',
    bullets: [
      'Verified partial scholarship & discounted tuition seats',
      'Itemised ClearCost sheet before student commits',
      'Offer follow-up & X1/X2 readiness audit',
    ],
    price: '$500',
    numericPrice: 500,
    featured: false,
    icon: ShieldCheck,
  },
  {
    type: 'Add-On Service',
    badge: 'Optional',
    coverage: 'Airport Pickup — Per Student (Optional)',
    detail: 'Arrival reception and campus transfer coordination in China (optional add-on)',
    bullets: [
      'Scheduled arrival reception upon landing',
      'Direct campus & dormitory check-in handover',
      'Billed only when requested for a travelling student',
    ],
    price: '$150',
    numericPrice: 150,
    featured: false,
    icon: Plane,
  },
];

const steps = [
  { number: '01', label: 'Apply in 60s', href: '#partnership-form' },
  { number: '02', label: 'Partner models', href: '#partnership-models' },
  { number: '03', label: 'China USD tiers', href: '#china-partner-terms' },
  { number: '04', label: 'Verification & FAQ', href: '#institutional-cooperation' },
];

const onboardingTimeline = [
  {
    step: '01',
    title: '60-second agency profile',
    copy: 'Share your agency name, city, and preferred route—no upfront documents or deposits required.',
  },
  {
    step: '02',
    title: 'Vetting & draft MOU (2–3 days)',
    copy: 'Our Dhanmondi B2B coordinator confirms scope, student attribution protection, and commercial schedule.',
  },
  {
    step: '03',
    title: '24–48h student file audits',
    copy: 'Start submitting dossiers with verified university matches, portal submission IDs, and milestone updates.',
  },
];

const partnerSafeguards = [
  {
    icon: Lock,
    title: 'Written Non-Poaching & Student Ownership',
    text: 'Every submitted applicant remains attributed exclusively to your agency or sub-agent code. Our desk never contacts a partner’s student directly without written partner permission.',
  },
  {
    icon: FileCheck2,
    title: 'Separated Official & Consultancy Payments',
    text: 'University application fees, tuition deposits, EMGS charges, medical exams, and embassy fees stay separate from partner service charges on an itemised written sheet.',
  },
];

const partnerFaqs = [
  {
    question: 'What are the updated China B2B partner service fees by scholarship tier?',
    answer:
      'EduExpress International publishes a four-line USD partner service schedule for China admissions: Type-A (Full Funded Scholarship) at $800, Type-B (Tuition Fee Free) at $600, Type-C (Partial Scholarship) at $500, and optional Add-On Airport Pickup at $150 per student. Exact university deposits, embassy fees, and payment stages are confirmed in writing before filing.',
  },
  {
    question: 'Do the China partner fees include university application fees, deposits, or airfare?',
    answer:
      'No. University application fees, seat or tuition deposits, medical examination, translation, courier, embassy visa fees, and international airfare are separate third-party expenses paid per the official notice and listed in writing on each case cost sheet.',
  },
  {
    question: 'How does EduExpress protect sub-agent and regional agency student files?',
    answer:
      'Every vetted partner signs a bilateral MOU containing a non-poaching and attribution clause. Portal references, university offer notices, and JW202 / eVAL status updates are shared directly with your agency contact rather than bypassing your desk.',
  },
  {
    question: 'Can agencies also submit files for Malaysia or other destinations under custom MOU terms?',
    answer:
      'Yes. Beyond the published China USD schedule, agencies and sub-agents can work with our dedicated B2B desk for Malaysia (EMGS & branch campuses) and our active European/Asian destinations under custom bilateral MOU terms tailored to destination and volume.',
  },
  {
    question: 'How quickly does the partner desk review a new agency application or student file?',
    answer:
      'New partnership applications are reviewed within 2–3 business days. Once onboarded, new student dossiers undergo an initial academic, recognition, and document-gap audit within 24–48 business hours.',
  },
  {
    question: 'Does EduExpress guarantee university admission, scholarships, or visas for partner files?',
    answer:
      'No. Universities, scholarship committees, and embassies retain sole decision authority. EduExpress provides verified eligibility screening, timestamped portal submission tracking, and document-readiness audits in writing.',
  },
];

const trail = [
  { name: 'B2B Partner Desk', path: '/b2b' },
  { name: 'Partnership Programme' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      mainEntityOfPage: PAGE_URL,
      datePublished: '2026-11-15',
      dateModified: '2026-11-20',
      name: 'B2B Education Agency Partnership Programme | EduExpress International',
      description:
        'Documented B2B cooperation models for education agencies, China strategic partners, and referral sub-agents in Bangladesh, with a published China partner USD schedule.',
      inLanguage: 'en-BD',
      about: { '@id': 'https://eduexpressint.com/#organization' },
      publisher: { '@id': 'https://eduexpressint.com/#organization' },
      isPartOf: { '@id': 'https://eduexpressint.com/#website' },
      primaryImageOfPage: primaryImageOfPageSchema('/og/about.jpg'),
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      mainEntity: { '@id': `${PAGE_URL}#service` },
    },
    {
      '@type': 'Service',
      '@id': `${PAGE_URL}#service`,
      name: 'EduExpress B2B Education Agency Partnership & China Admissions Schedule',
      serviceType: 'B2B Education Agency Partnership',
      url: PAGE_URL,
      description:
        'B2B admissions processing, China scholarship placement tiers, and referral cooperation for study-abroad agencies and sub-agents under written MOU terms.',
      provider: { '@id': 'https://eduexpressint.com/#organization' },
      areaServed: [
        { '@type': 'Country', name: 'Bangladesh' },
        { '@type': 'AdministrativeArea', name: 'Global' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'China Partner Service Schedule (USD)',
        itemListElement: pricingTable.map((row) => ({
          '@type': 'Offer',
          name: `${row.type} — ${row.coverage}`,
          description: row.detail,
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: row.numericPrice,
            priceCurrency: 'USD',
          },
        })),
      },
    },
  ],
};

async function loadChinaUniversityCount(): Promise<number> {
  try {
    const records = await getUniversityRecords();
    const chinaCount = records.filter((u) => u.country.toLowerCase().includes('china')).length;
    return chinaCount > 0 ? chinaCount : records.length;
  } catch {
    return 0;
  }
}

export default async function PartnershipPage() {
  const [chinaUniCount] = await Promise.all([loadChinaUniversityCount()]);
  const destinationCount = countries.filter((country) => country.isActive).length;
  const phoneHref = `tel:${config.contact.phone.replace(/[^\d+]/g, '')}`;
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    "Hello, I saw the EduExpress B2B Partnership page and would like to discuss agency onboarding and China USD partner terms.",
  )}`;

  return (
    <>
      <JsonLd data={structuredData} />

      {/* Meta Ads High-Conversion Split Hero */}
      <section className="relative overflow-x-clip bg-gradient-to-br from-[#061c2e] via-petrol-800 to-[#11426a] pb-14 pt-[96px] text-white sm:pt-[112px] lg:pb-20 lg:pt-[136px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-lime/10 blur-3xl"
        />
        <div className={`${kit.wrap} relative grid grid-cols-1 gap-10 lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:gap-12`}>
          <div className="min-w-0">
            <DarkCrumbs trail={trail} path={PATH} />

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full bg-lime px-3.5 py-1.5 text-[13px] font-extrabold text-petrol-800">
                <Sparkles size={14} aria-hidden="true" />
                China &amp; Global Partner Desk · 2027
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-white/90">
                <Lock size={13} className="text-lime" aria-hidden="true" />
                Written non-poaching MOU
              </span>
            </div>

            <h1 className="mt-5 font-display text-[34px] font-black leading-[0.98] tracking-[-0.02em] text-white sm:text-[56px] lg:text-[66px]">
              Scale your agency with{' '}
              <span className="text-lime">clear China USD partner terms.</span>
            </h1>

            <p className="mt-5 max-w-xl text-[17px] leading-[1.6] text-white/85 sm:text-[17.5px]">
              Process China scholarship tiers and co-placements across {destinationCount} active destinations through our
              Dhanmondi partner desk—with zero setup fee, 24–48h file audits, and timestamped portal tracking.
            </p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {[
                'BDT 0 partner onboarding charge',
                'Non-poaching MOU & file attribution',
                '24–48h academic & gap audit',
                'Verified Chinese university & CSC links',
              ].map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-[15px] font-medium text-white/90">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#partnership-form" className="ed-btn ed-btn-signal min-h-[54px] px-7">
                Apply Free in 60 Seconds <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a
                href="/api/b2b/partner-pack"
                download="EduExpress-B2B-Partner-Process-Pack-2027.pdf"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-[15.5px] font-bold text-white transition hover:bg-white/20"
              >
                <Download size={17} className="text-lime" aria-hidden="true" />
                Download Partner Pack (PDF)
              </a>
              <PartnershipContactLink
                kind="whatsapp"
                label="hero_whatsapp"
                href={whatsapp}
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/20 px-7 text-[16px] font-bold text-white transition hover:bg-emerald-500/30"
              >
                <MessageCircle size={18} className="text-lime" aria-hidden="true" />
                WhatsApp Partner Desk
              </PartnershipContactLink>
            </div>

            <dl className="mt-7 grid grid-cols-3 gap-2 rounded-2xl bg-white/[0.07] p-3.5 ring-1 ring-white/15 sm:max-w-lg sm:gap-4 sm:p-4">
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-normal text-white/70 sm:text-xs sm:tracking-wider">
                  China Records
                </dt>
                <dd className="mt-1 font-display text-[20px] font-black leading-none text-lime sm:text-[26px]">
                  {chinaUniCount > 0 ? chinaUniCount : '115+'}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-normal text-white/70 sm:text-xs sm:tracking-wider">
                  Setup Fee
                </dt>
                <dd className="mt-1 font-display text-[20px] font-black leading-none text-white sm:text-[26px]">$0</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-normal text-white/70 sm:text-xs sm:tracking-wider">
                  File Audit
                </dt>
                <dd className="mt-1 font-display text-[20px] font-black leading-none text-white sm:text-[26px]">
                  24–48h
                </dd>
              </div>
            </dl>

            <p className="mt-5 flex flex-wrap items-center gap-2 text-[13.5px] text-white/70">
              <ShieldCheck size={16} className="shrink-0 text-lime" aria-hidden="true" />
              <span>Last updated November 2026 ·</span>
              <Link href="/b2b" className="font-semibold text-white/90 underline underline-offset-4 hover:text-lime">
                Explore B2B Desk &amp; SOP
              </Link>
            </p>
          </div>

          {/* Right Above-the-Fold Offer Rate Card */}
          <div className="min-w-0 rounded-3xl bg-white p-4 text-petrol-800 shadow-[0_28px_70px_rgba(0,0,0,0.32)] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#2c6a97]">
                  Published USD Partner Schedule
                </p>
                <p className="mt-0.5 font-display text-[20px] font-black leading-tight text-petrol-800 sm:text-[22px]">
                  China Scholarship &amp; Service Tiers
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-lime-pale px-3 py-1 text-xs font-bold text-lime-deep">
                <span className="size-2 rounded-full bg-[#2ead4b]" aria-hidden="true" />
                Open Now
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {pricingTable.map((row) => (
                <a
                  key={row.type}
                  href="#china-partner-terms"
                  className={`flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition hover:-translate-y-0.5 ${
                    row.featured
                      ? 'border-petrol-800 bg-lime-pale/70 shadow-sm'
                      : 'border-slate-200/90 bg-canvas-soft/50 hover:border-petrol-800/40 hover:bg-white'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-petrol-800 px-2.5 py-0.5 text-[11px] font-bold text-lime">
                        {row.type}
                      </span>
                      {row.featured && (
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-lime-deep">
                          Flagship CSC / Full
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[14.5px] font-bold leading-snug text-petrol-800 sm:text-[15px]">{row.coverage}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block font-display text-[24px] font-black leading-none text-petrol-800 sm:text-[26px]">
                      {row.price}
                    </span>
                    <span className="text-[11px] font-semibold text-ink-soft">per student</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-canvas-soft p-3 sm:flex-nowrap">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src="/images/home/education-partners-meeting.webp"
                  alt="EduExpress representatives meeting university staff at an international education event"
                  fill
                  priority
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-bold leading-snug text-petrol-800">Dhanmondi Partner Desk, Dhaka</p>
                <p className="text-[12px] leading-snug text-ink-soft">Custom MOUs also open for Malaysia &amp; UK</p>
              </div>
              <a
                href="#partnership-form"
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-petrol-800 px-3.5 py-2 text-xs font-bold text-lime transition hover:opacity-90"
              >
                Apply <ArrowRight size={13} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Quick Navigation */}
      <nav aria-label="Partnership page sections" className="border-b border-canvas-soft bg-white py-5">
        <ol className={`${kit.wrap} grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4`}>
          {steps.map((step) => (
            <li key={step.href}>
              <a
                href={step.href}
                className="group flex min-h-[56px] items-center gap-3.5 rounded-2xl border border-transparent px-4 transition hover:border-slate-200 hover:bg-canvas-soft"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime font-display text-[15px] font-black text-petrol-800">
                  {step.number}
                </span>
                <span className="flex-1 text-[16px] font-semibold text-petrol-800">{step.label}</span>
                <ArrowRight size={15} className="shrink-0 text-petrol-800 transition group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Visual Tier Showcase — China Partner USD Schedule */}
      <Section
        tone="sage"
        id="china-partner-terms"
        title="China partner service schedule."
        intro="Clear, upfront USD service tiers for education agencies and sub-agents. Every fee tier, coverage scope, and payment stage is confirmed on a written partner cost sheet before filing."
      >
        <div data-anim="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pricingTable.map((row) => {
            const Icon = row.icon;
            return (
              <article
                key={row.type}
                className={`flex flex-col rounded-3xl p-6 transition hover:-translate-y-1 ${
                  row.featured
                    ? 'bg-petrol-800 text-white shadow-[0_24px_50px_rgba(15,58,92,0.18)] ring-2 ring-lime'
                    : 'border border-slate-200/90 bg-white text-petrol-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[13px] font-bold ${
                      row.featured ? 'bg-lime text-petrol-800' : 'bg-lime-pale text-lime-deep'
                    }`}
                  >
                    {row.type}
                  </span>
                  <span
                    className={`grid size-10 place-items-center rounded-2xl ${
                      row.featured ? 'bg-white/10 text-lime' : 'bg-canvas-soft text-petrol-800'
                    }`}
                  >
                    <Icon size={19} aria-hidden="true" />
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span
                    className={`font-display text-[44px] font-black leading-none ${
                      row.featured ? 'text-lime' : 'text-petrol-800'
                    }`}
                  >
                    {row.price}
                  </span>
                  <span className={`text-[13px] font-semibold ${row.featured ? 'text-white/70' : 'text-ink-soft'}`}>
                    USD / student
                  </span>
                </div>

                <h3 className={`mt-3 text-[20px] font-bold leading-snug ${row.featured ? 'text-white' : 'text-petrol-800'}`}>
                  {row.coverage}
                </h3>
                <p className={`mt-2 text-[14.5px] leading-6 ${row.featured ? 'text-white/80' : 'text-ink-soft'}`}>
                  {row.detail}
                </p>

                <ul
                  className={`mt-5 flex-1 space-y-2 border-t pt-4 ${
                    row.featured ? 'border-white/15' : 'border-slate-100'
                  }`}
                >
                  {row.bullets.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-2 text-[13.5px] leading-5 ${
                        row.featured ? 'text-white/85' : 'text-petrol-800'
                      }`}
                    >
                      <CheckCircle2
                        size={15}
                        className={`mt-0.5 shrink-0 ${row.featured ? 'text-lime' : 'text-[#2ead4b]'}`}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#partnership-form"
                  className={`mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-5 text-[14.5px] font-bold transition ${
                    row.featured
                      ? 'bg-lime text-petrol-800 hover:bg-white'
                      : 'border border-petrol-800/20 bg-canvas-soft text-petrol-800 hover:bg-petrol-800 hover:text-white'
                  }`}
                >
                  Select &amp; Apply <ArrowRight size={15} aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>

        <p className="mt-6 rounded-3xl border border-petrol-800/15 bg-lime-pale px-6 py-4 text-[15px] leading-6 text-petrol-800">
          <strong className="font-bold">Written confirmation:</strong> Third-party university application fees, tuition
          deposits, medical, translation, and embassy fees remain separate and are itemised on the student cost sheet.
          University and authority decisions remain independent.
        </p>

        <div data-anim="stagger" className="mt-6 grid gap-5 md:grid-cols-2">
          {partnerSafeguards.map(({ icon: Icon, title, text }) => (
            <article key={title} className={kit.card}>
              <div className="flex items-start gap-4">
                <span className={kit.iconLime}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className={kit.h3}>{title}</h3>
                  <p className="mt-2 text-[15px] leading-6 text-ink-soft">{text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-petrol-800/10 bg-canvas-soft p-5 sm:p-6">
          <div className="max-w-xl">
            <h3 className="font-heading text-lg font-bold text-petrol-800">Download the Official Partner Process Pack (PDF)</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Keep the written China USD rate card, non-poaching guarantees, and onboarding milestones on hand for your management team.
            </p>
          </div>
          <a
            href="/api/b2b/partner-pack"
            download="EduExpress-B2B-Partner-Process-Pack-2027.pdf"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-petrol-800 px-6 text-sm font-bold text-lime transition hover:bg-petrol-900"
          >
            <Download size={16} aria-hidden="true" />
            Download Process Pack (PDF)
          </a>
        </div>
      </Section>

      {/* Cooperation Models */}
      <Section
        id="partnership-models"
        title="Choose the cooperation route that fits your work."
        intro="Each route begins with a suitability review. Territory, responsibilities, payments and student-data handling are documented in the final agreement."
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-3">
          {partnershipTypes.map(({ number, title, label, description, icon: Icon, features }, index) => {
            const dark = index === 1;
            return (
              <article key={title} className={`${dark ? kit.cardDark : kit.cardSage} flex flex-col`}>
                <div className="flex items-start justify-between">
                  <span className={dark ? kit.iconLime : kit.icon}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className={`text-[14px] font-semibold ${dark ? 'text-white/70' : 'text-ink-soft'}`}>Model {number}</span>
                </div>
                <p className={`mt-6 text-[14px] font-semibold ${dark ? 'text-white/70' : 'text-ink-soft'}`}>{label}</p>
                <h3 className={`mt-1 ${dark ? 'text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime' : kit.h3}`}>
                  {title}
                </h3>
                <p className={`mt-2 text-[16px] leading-7 ${dark ? 'text-white/80' : 'text-ink-soft'}`}>{description}</p>
                <ul className={`mt-6 flex-1 space-y-2.5 border-t pt-5 ${dark ? 'border-white/15' : 'border-petrol-800/10'}`}>
                  {features.map((feature) => (
                    <li key={feature} className={`flex gap-2.5 text-[15px] leading-6 ${dark ? 'text-white/85' : 'text-petrol-800'}`}>
                      <CheckCircle2 size={17} className={`mt-0.5 shrink-0 ${dark ? 'text-lime' : 'text-petrol-800'}`} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#partnership-form"
                  className={`mt-6 inline-flex items-center gap-1.5 text-[15px] font-bold underline-offset-4 hover:underline ${
                    dark ? 'text-lime' : 'text-petrol-800'
                  }`}
                >
                  Apply under this model <ArrowRight size={15} aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Conversion Form + Post-Apply Timeline */}
      <Section id="partnership-form" tone="sage">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start lg:gap-14">
          <div data-anim="up">
            <p className={kit.badge}>Fast Partner Onboarding</p>
            <h2 className={`mt-5 ${kit.h2}`}>Get your written MOU &amp; university list.</h2>
            <p className={`mt-4 ${kit.lead}`}>
              Complete this 2-step form (under 60 seconds). Our partner desk reviews your agency details and connects via
              phone or WhatsApp with your custom agreement and China fee schedule.
            </p>

            <ol className="mt-7 space-y-3">
              {onboardingTimeline.map((item) => (
                <li
                  key={item.step}
                  className="flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-petrol-800 font-display text-[14px] font-black text-lime">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-[15.5px] font-bold text-petrol-800">{item.title}</p>
                    <p className="mt-0.5 text-[14px] leading-6 text-ink-soft">{item.copy}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
              <div className="relative aspect-[16/9]">
                <Image
                  src="/images/home/education-partners-meeting.webp"
                  alt="EduExpress Dhanmondi partner team briefing international university representatives"
                  fill
                  sizes="(max-width:1024px) 100vw, 440px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 text-[13.5px]">
                <span className="font-bold text-petrol-800">Dhanmondi Head Office · Dhaka</span>
                <span className="inline-flex items-center gap-1.5 text-ink-soft">
                  <Clock3 size={14} className="text-petrol-800" aria-hidden="true" />
                  Sat–Thu, 11:00 AM – 6:00 PM
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <PartnershipContactLink
                kind="whatsapp"
                label="form_sidebar_whatsapp"
                href={whatsapp}
                className="ed-btn ed-btn-signal min-h-[52px] px-7"
              >
                <MessageCircle size={18} aria-hidden="true" /> Chat Directly on WhatsApp
              </PartnershipContactLink>
              <PartnershipContactLink
                kind="phone"
                label="form_sidebar_phone"
                href={phoneHref}
                className="ed-btn ed-btn-outline min-h-[50px] bg-white px-6"
              >
                <Phone size={16} aria-hidden="true" /> Partner Hotline: {formatBangladeshPhone(config.contact.phone)}
              </PartnershipContactLink>
              <Link href="/b2b" className="inline-flex items-center gap-1.5 pt-1 text-[15px] font-bold text-petrol-800 underline-offset-4 hover:underline">
                Open B2B Services &amp; Multi-Destination Desk <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="lg:sticky lg:top-[108px]">
            <PartnershipForm whatsappHref={whatsapp} />
          </div>
        </div>
      </Section>

      <Section
        id="institutional-cooperation"
        title="Universities, Bangladeshi schools &amp; media verification desk."
        intro="Alongside consultancy agreements, our Dhanmondi office works directly with Chinese university international offices, Bangladeshi colleges and education journalists on verified information."
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-3">
          <article className={kit.cardSage}>
            <h3 className={kit.h3}>Chinese university offices</h3>
            <p className="mt-2 text-[15px] leading-7 text-ink-soft">
              Update official tuition, scholarship seats or Bangladesh admissions representative listings. Relationship records are published only when written authorization is on file.
            </p>
            <Link href="/how-we-verify-universities" className={`mt-4 ${kit.link}`}>
              How we verify records <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article className={kit.cardSage}>
            <h3 className={kit.h3}>Bangladeshi schools &amp; colleges</h3>
            <p className="mt-2 text-[15px] leading-7 text-ink-soft">
              Host evidence-first seminars for HSC students and parents covering realistic China costs, CSC scholarship competition, X1/X2 visa rules and BMDC awareness.
            </p>
            <Link href="/education-consultant-dhaka" className={`mt-4 ${kit.link}`}>
              Dhanmondi consultation desk <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article className={kit.cardSage}>
            <h3 className={kit.h3}>Media &amp; researchers</h3>
            <p className="mt-2 text-[15px] leading-7 text-ink-soft">
              Cite live explicit CNY tuition quartiles, first-year non-tuition ranges and primary regulatory links directly from our open benchmark and JSON feed.
            </p>
            <Link href="/china-study-report-bangladesh" className={`mt-4 ${kit.link}`}>
              China study benchmark <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/study-in-china-from-bangladesh" className="ed-btn ed-btn-outline min-h-[44px] bg-white px-5 text-[14.5px]">
            Study in China guide
          </Link>
          <Link href="/china-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[44px] bg-white px-5 text-[14.5px]">
            China scholarships
          </Link>
          <Link href="/study-in-malaysia-from-bangladesh" className="ed-btn ed-btn-outline min-h-[44px] bg-white px-5 text-[14.5px]">
            Study in Malaysia guide
          </Link>
          <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-[44px] bg-white px-5 text-[14.5px]">
            Fees &amp; transparency
          </Link>
        </div>
      </Section>

      <FaqBlock items={partnerFaqs} title="Education agency partnership questions" tone="sage" />

      <section data-cta-band className="bg-petrol-800 py-16 text-white lg:py-20">
        <div className={`${kit.wrap} flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="max-w-2xl">
            <h2 data-anim="pop" className="font-display text-[40px] font-black leading-[0.95] tracking-[-0.02em] text-lime sm:text-[56px]">
              Ready to partner for 2027 admissions?
            </h2>
            <p className="mt-5 text-[18px] leading-[1.6] text-white/85">
              Speak directly with our Dhanmondi B2B desk on WhatsApp, or complete the 2-step form for your written MOU and USD partner schedule.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <PartnershipContactLink
              kind="whatsapp"
              label="footer_cta_whatsapp"
              href={whatsapp}
              className="ed-btn ed-btn-signal min-h-[54px] px-7"
            >
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp partner desk
            </PartnershipContactLink>
            <a href="#partnership-form" className="ed-btn ed-btn-on-dark min-h-[54px] px-7">
              Apply for partnership <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
