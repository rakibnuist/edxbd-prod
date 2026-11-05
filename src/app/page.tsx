import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  ClipboardCheck,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

import HomeHero from '@/components/home/HomeHero';
import LightRail from '@/components/home/LightRail';
import MobileLeadBar from '@/components/home/MobileLeadBar';
import ScrollProgress from '@/components/home/ScrollProgress';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import { config } from '@/lib/config';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { countries } from '@/lib/countries';
import { getPublishedUpdates } from '@/lib/content-records';
import { destinationPath } from '@/lib/site-urls';
import { getPublicTrustRecords } from '@/lib/trust-records';
import { getUniversityRecords } from '@/lib/university-records';
import type { Update } from '@/lib/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Study Abroad Consultancy in Bangladesh | Free Assessment | EduExpress' },
  description:
    'Free profile assessment for Bangladeshi students. Compare universities, tuition, scholarships and visa requirements, then get the costs and next step in writing. Dhanmondi, Dhaka.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Study Abroad, With the Costs in Writing | EduExpress International',
    description: 'Free profile assessment. Clear costs, written proof and a counsellor in Dhanmondi, Dhaka.',
    url: '/',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Study abroad with the costs in writing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Abroad, With the Costs in Writing | EduExpress International',
    description: 'Free profile assessment. Clear costs, written proof and a counsellor in Dhanmondi, Dhaka.',
    images: ['/og-image.jpg'],
  },
};

type TrustRecords = Awaited<ReturnType<typeof getPublicTrustRecords>>;

const EMPTY_TRUST = {
  metrics: [],
  evidence: [],
  offices: [],
  team: [],
  servicePackages: [],
  testimonials: [],
} as unknown as TrustRecords;

async function loadTrustRecords(): Promise<TrustRecords> {
  try {
    return await getPublicTrustRecords();
  } catch {
    return EMPTY_TRUST;
  }
}

async function loadGuides(): Promise<Update[]> {
  try {
    return await getPublishedUpdates(6);
  } catch {
    return [];
  }
}

type PlannerUniversity = {
  slug: string;
  name: string;
  country: string;
  city: string;
  levels: string[];
  funding: boolean;
  tuition: string;
  programmes: number;
};

async function loadPlannerData(): Promise<PlannerUniversity[]> {
  try {
    const universities = await getUniversityRecords();
    const levelLabel = (value: string): string => {
      const label = value.toLowerCase();
      if (/phd|doctor/.test(label)) return 'PhD';
      if (/master|postgraduate/.test(label)) return 'Master’s';
      if (/bachelor|undergraduate|mbbs/.test(label)) return 'Bachelor’s';
      if (/language|chinese studies/.test(label)) return 'Language';
      if (/foundation|preparatory/.test(label)) return 'Foundation';
      return '';
    };
    return universities.map(university => ({
      slug: university.slug,
      name: university.name,
      country: university.country,
      city: university.city,
      levels: [
        ...new Set(
          [...university.degree, ...university.programs.map(program => program.level)]
            .map(levelLabel)
            .filter((level): level is string => Boolean(level)),
        ),
      ],
      funding: university.scholarships.some(award => award.status !== 'closed'),
      tuition: university.details.tuition,
      programmes: university.programs.length,
    }));
  } catch {
    return [];
  }
}

const fmtGuideDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
};



const faqs = [
  {
    question: 'How do I start with EduExpress?',
    answer:
      'Complete the free profile assessment with your current study level, preferred destination and contact details. A counsellor reviews the profile and explains the most relevant next step.',
  },
  {
    question: 'What does a full scholarship mean?',
    answer:
      'The exact coverage depends on the university award. It may cover tuition, accommodation, a monthly stipend or a stated combination. We show every covered and payable item before you proceed.',
  },
  {
    question: 'When do I pay the EduExpress service charge?',
    answer:
      'For the China package, no EduExpress service fee is due before China visa approval. Any university, embassy, medical, translation, courier or deposit fee required earlier is itemised in writing before you proceed. You can also hold your original documents with EduExpress and place a BDT 15,000 deposit, deducted from the final package price.',
  },
  {
    question: 'Are university deposits included in the BDT 200,000 package?',
    answer:
      'No. University registration, seat or tuition deposits are paid separately when required. They are identified in the written cost schedule before payment.',
  },
  {
    question: 'Can my parents join the counselling session?',
    answer:
      'Yes. Parents and sponsors are encouraged to join so costs, payment terms, documents, safety and responsibilities can be explained together.',
  },
  {
    question: 'Does EduExpress guarantee a visa?',
    answer:
      'No consultancy controls an embassy decision. EduExpress provides admission and visa-application support under written service and refund terms, but the final decision belongs to the relevant university and authority.',
  },
];

const journey = [
  ['Share your profile', 'Study level, subject, results, budget and preferred intake.'],
  ['Compare suitable options', 'A shortlist where recognition, cost and fit are checked together.'],
  ['Receive the full cost', 'University, third-party and EduExpress charges separated in writing.'],
  ['Complete the application', 'Documents, submission and admission-notice handling.'],
  ['Prepare for the visa', 'Your file checked against the current official requirements.'],
  ['Travel with support', 'Air ticket, airport pickup and arrival guidance per the signed package.'],
];

export default async function Home() {
  const [trust, guides, plannerData] = await Promise.all([loadTrustRecords(), loadGuides(), loadPlannerData()]);
  const office = trust.offices.find(item => item.isHeadOffice) ?? trust.offices[0] ?? null;
  const fullPackage = trust.servicePackages.find(item => item.packageType === 'full_scholarship');
  const testimonials = trust.testimonials.slice(0, 6);
  const testimonialQuotes = testimonials.map(item => ({
    id: item.id,
    quote: item.content,
    name: item.displayName || item.studentName,
    detail: [item.university, item.country].filter(Boolean).join(' · '),
    rating: item.rating,
    ...(item.consentImageApproved && item.image ? { image: item.image } : {}),
  }));

  const officeAddress = office?.address ?? `${config.contact.address.street}, ${config.contact.address.city} ${config.contact.address.postalCode}`;
  const officePhone = office?.phonePrimary ?? config.contact.phone;
  const officeHours = office?.hours ?? 'Saturday to Thursday, 11:00 AM to 6:00 PM';
  const packagePrice = fullPackage?.priceLabel ?? 'BDT 200,000';
  const packageItems = fullPackage?.includedItems?.length
    ? fullPackage.includedItems
    : [
        'Application fee',
        'Admission notice',
        'Scholarship assistance',
        'JW202 form',
        'Visa application support',
        'Embassy fee',
        'Medical checkup in Bangladesh',
        'Pre-departure briefing',
        'One-way air ticket',
        'Airport pickup',
      ];
  const excludedItems = fullPackage?.excludedItems?.length
    ? fullPackage.excludedItems
    : ['University registration or seat deposit', 'Personal spending', 'Document translation or courier where required'];
  const whatsappHref = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Assalamu alaikum. I would like a free profile assessment for studying abroad.',
  )}`;

  const activeDestinations = countries.filter(country => country.isActive);
  // Only show photography we have verified against the country. A designed
  // typographic tile is used for routes without a matching photo.
  const destinationImages: Record<string, string> = {
    china: '/images/destinations/china-hero.webp',
    uk: '/images/destinations/united-kingdom-hero.webp',
    'south-korea': '/images/destinations/south-korea-hero.webp',
    malaysia: '/images/destinations/malaysia-hero.webp',
    georgia: '/images/destinations/georgia-hero.webp',
    hungary: '/images/destinations/hungary-hero.webp',
    finland: '/images/destinations/finland-hero.webp',
    cyprus: '/images/destinations/cyprus-hero.webp',
    croatia: '/images/destinations/croatia-hero.webp',
    malta: '/images/destinations/malta-hero.webp',
    greece: '/images/destinations/greece-hero.webp',
    thailand: '/images/destinations/thailand-hero.webp',
  };
  const imageOrder: Record<string, number> = {
    china: 0,
    uk: 1,
    malaysia: 2,
    'south-korea': 3,
    georgia: 4,
    hungary: 5,
    finland: 6,
    cyprus: 7,
    croatia: 8,
    malta: 9,
    greece: 10,
    thailand: 11,
  };
  const destinationCards = activeDestinations
    .map(country => ({
      name: country.name,
      flag: country.flag,
      slug: country.slug,
      href: destinationPath(country.slug),
      status: country.serviceStatus ?? 'Active',
      description: country.description,
      image: destinationImages[country.slug] ?? null,
    }))
    .sort(
      (a, b) =>
        Number(b.status === 'Flagship') - Number(a.status === 'Flagship') ||
        (imageOrder[a.slug] ?? 99) - (imageOrder[b.slug] ?? 99) ||
        a.name.localeCompare(b.name),
    );

  const guideRows = guides.length
    ? guides.map(post => ({
        key: post.id,
        title: post.title,
        excerpt: post.excerpt ?? '',
        href: `/updates/${post.slug}`,
        date: fmtGuideDate(post.publishedAt ?? post.createdAt),
        kind: post.type === 'article' ? 'Article' : 'Update',
        category: post.category ?? 'Advice',
      }))
    : [
        { key: 'guide-china', title: 'Study in China from Bangladesh', excerpt: 'A complete starting guide covering fit, cost, scholarships and student life.', href: '/study-in-china-from-bangladesh', date: '', kind: 'Guide', category: 'China' },
        { key: 'guide-cost', title: 'Cost of studying in China', excerpt: 'Plan tuition, hostel, living, insurance, visa and travel expenses.', href: '/study-in-china-cost-bangladesh', date: '', kind: 'Guide', category: 'Costs' },
        { key: 'guide-scholarships', title: 'China scholarships explained', excerpt: 'Compare CSC, university and other scholarship types without vague promises.', href: '/china-scholarships-bangladesh', date: '', kind: 'Guide', category: 'Scholarships' },
      ];

  const stats = [
    { value: String(plannerData.length), label: 'university records' },
    { value: String(activeDestinations.length), label: 'destination services' },
    { value: String(trust.evidence.length), label: 'evidence records' },
    { value: '0', label: 'service fee before China visa approval' },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://eduexpressint.com/#website',
        url: 'https://eduexpressint.com/',
        name: 'EduExpress International',
        inLanguage: 'en-BD',
        publisher: { '@id': 'https://eduexpressint.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://eduexpressint.com/universities?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://eduexpressint.com/#study-abroad-consultancy',
        name: 'Study abroad consultancy for Bangladeshi students and families',
        provider: { '@id': 'https://eduexpressint.com/#organization' },
        areaServed: { '@type': 'Country', name: 'Bangladesh' },
        description: 'Free profile assessment, university comparison, cost guidance, admission support, visa preparation and pre-departure support.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <div className="overflow-x-clip bg-chalk text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <ScrollProgress />

      <HomeHero universityCount={plannerData.length} whatsappHref={whatsappHref} />

      {/* Facts — a raised strip overlapping the navy hero */}
      <section aria-label="Directory facts" className="relative z-20 -mt-10 px-4 sm:px-6 lg:-mt-14 lg:px-10">
        <dl className="mx-auto grid max-w-shell grid-cols-2 gap-px overflow-hidden rounded-[26px] border border-rule bg-rule shadow-[0_34px_80px_-48px_rgba(15,53,87,0.5)] sm:grid-cols-4">
          {stats.map((item, index) => (
            <div key={item.label} className="bg-white px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex items-baseline justify-between gap-2">
                <dd className="ed-numeral text-[38px] text-petrol-700">{item.value}</dd>
                <span className="ed-figure text-[10px] font-bold tracking-[0.14em] text-ink-mute">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <dt className="mt-2.5 text-[11.5px] leading-4 text-ink-mute">{item.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* What you get */}
      <section className="relative px-4 py-section sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark" aria-hidden="true" />
        <div className="relative mx-auto max-w-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[56ch]">
              <p className="ed-label">What you get</p>
              <h2 className="ed-display mt-4 text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.06] text-ink">
                Everything in writing, before you pay.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[14px] leading-7 text-ink-soft lg:pb-2">
              Three documents carry the decision: what is recognised, what it costs, and what was submitted.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Recognition check',
                copy: 'Who recognises the degree, on which official source, and when it was last verified. Missing evidence is labelled missing — not estimated.',
                href: '/how-we-verify-universities',
                link: 'How verification works',
                tone: 'bg-petrol-700 text-white',
              },
              {
                icon: Wallet,
                title: 'Cost schedule',
                copy: 'Tuition, hostel, insurance, visa, travel and our fee on one schedule, showing who receives each payment and what is refundable.',
                href: '/fees-and-transparency',
                link: 'Read the fee policy',
                tone: 'bg-petrol-500 text-white',
              },
              {
                icon: ClipboardCheck,
                title: 'Application record',
                copy: 'Every document submitted, every deadline and the exact status of your file — so nothing depends on remembering a phone call.',
                href: '/your-study-journey',
                link: 'See the six stages',
                tone: 'bg-sky-500 text-petrol-900',
              },
            ].map((item, index) => (
              <article
                key={item.title}
                className="group flex flex-col overflow-hidden rounded-[26px] border border-rule bg-white shadow-[0_26px_60px_-50px_rgba(15,53,87,0.5)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_36px_70px_-38px_rgba(15,53,87,0.42)]"
              >
                <div className={`relative h-[108px] overflow-hidden ${item.tone}`}>
                  <span className="ed-numeral absolute -right-3 -top-7 text-[116px] opacity-[0.16]" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="absolute bottom-4 left-5 grid size-11 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/30">
                    <item.icon size={20} aria-hidden="true" />
                  </span>
                  <span className="absolute bottom-5 right-5 text-[10px] font-bold uppercase tracking-[0.16em] opacity-80">
                    Document {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="ed-home-display text-[23px] leading-snug text-ink">{item.title}</h3>
                  <p className="mt-2.5 flex-1 text-[13.5px] leading-6 text-ink-soft">{item.copy}</p>
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex items-center justify-between gap-2 border-t border-rule pt-4 text-[12.5px] font-bold text-petrol-600 transition-colors hover:text-petrol-800"
                  >
                    {item.link}
                    <span className="grid size-7 place-items-center rounded-full bg-mint-100 transition-colors group-hover:bg-mint-200">
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* China package */}
      <section
        id="package"
        className="ed-band ed-band-navy relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
      >
        <div className="pointer-events-none absolute inset-0 ed-grid-lines" aria-hidden="true" />
        <div className="relative mx-auto max-w-shell">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-16">
            <div>
              <p className="ed-label text-mint-300 before:!bg-mint-300">China route</p>
              <h2 className="ed-display mt-5 text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.03] text-white">
                {packagePrice} is the package.
                <span className="mt-2 block text-mint-300">It is not the whole cost.</span>
              </h2>
              <p className="mt-6 max-w-[48ch] text-[15px] leading-7 text-white/80">
                The China visa-first package covers the work EduExpress does. University deposits, personal spending
                and some document fees are paid separately, and appear on your written schedule before you commit.
              </p>

              <ul className="mt-7 grid gap-2.5">
                {['No service fee before China visa approval', 'University deposits are identified separately', 'Payment terms in writing before you proceed'].map(item => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[13px] leading-6 text-white/90"
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint-300/20 text-mint-300">
                      <Check size={12} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#assessment" className="ed-btn ed-btn-signal min-h-12 px-6">
                  Get the full cost schedule
                </a>
                <Link href="/china-visa-first-policy" className="ed-btn ed-btn-on-dark min-h-12 px-6">
                  Payment terms
                </Link>
              </div>
            </div>

            <div className="ed-stack relative rounded-[28px]">
              <div className="rounded-[28px] border border-white/25 bg-white p-5 text-ink shadow-[0_44px_90px_-40px_rgba(0,0,0,0.65)] sm:p-7">
                <div className="flex items-start justify-between gap-4 border-b border-rule pb-5">
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-mute">China service package</p>
                    <p className="ed-figure mt-2 text-[38px] leading-none text-petrol-700">{packagePrice}</p>
                  </div>
                  <span className="rounded-full bg-mint-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-petrol-700">
                    Visa-first
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-jade">Included</p>
                  <ul className="mt-3 grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
                    {packageItems.map(item => (
                      <li key={item} className="flex gap-2 text-[11.5px] leading-5 text-ink-soft">
                        <Check size={13} className="mt-[3px] shrink-0 text-jade" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 border-t border-rule pt-4">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-clay">Paid separately</p>
                  <ul className="mt-3 grid gap-2.5">
                    {excludedItems.map(item => (
                      <li key={item} className="flex gap-2 text-[11.5px] leading-5 text-ink-soft">
                        <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-clay" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-5 rounded-2xl bg-chalk-100 px-3.5 py-3 text-[11px] leading-5 text-ink-mute">
                  University registration, seat or tuition deposits are paid separately when required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="ed-band ed-band-sand relative overflow-hidden px-4 py-section sm:px-6 lg:px-10">
        <div className="relative mx-auto max-w-shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[56ch]">
              <p className="ed-label">Destinations</p>
              <h2 className="ed-display mt-4 text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.06] text-ink">
                China first, then the routes we can evidence.
              </h2>
            </div>
            <div className="flex items-end gap-5">
              <div className="hidden text-right sm:block">
                <span className="ed-numeral block text-[52px] text-petrol-700">
                  {String(activeDestinations.length).padStart(2, '0')}
                </span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-mute">
                  live routes
                </span>
              </div>
              <Link href="/destinations" className="ed-btn ed-btn-outline min-h-11 bg-white/70">
                All destination services <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <LightRail items={destinationCards} className="mt-9" />

          <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-[#d5c8b5]/60 bg-white/50 px-4 py-3 text-[11.5px] leading-5 text-ink-mute">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-petrol-600" aria-hidden="true" />
            Status reflects the current counselling service, not a ranking of the country. Ask us if a route is not listed.
          </p>
        </div>
      </section>

      {/* Journey */}
      <section className="ed-band ed-band-navy relative overflow-hidden px-4 py-section sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines" aria-hidden="true" />
        <div className="relative mx-auto max-w-shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[58ch]">
              <p className="ed-label text-mint-300 before:!bg-mint-300">How it runs</p>
              <h2 className="ed-display mt-4 text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.06] text-white">
                Six stages, each with a named owner and a document.
              </h2>
            </div>
            <Link href="/your-study-journey" className="ed-btn ed-btn-on-dark min-h-11 shrink-0">
              See the complete journey
            </Link>
          </div>

          <ol className="mt-11 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {journey.map(([title, copy], index) => (
              <li
                key={title}
                className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.06] p-6 transition-colors hover:bg-white/[0.1]"
              >
                <span className="ed-numeral absolute -right-1 -top-2 text-[78px] text-white/10" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="relative ed-figure text-[10.5px] font-bold uppercase tracking-[0.16em] text-mint-300">
                  Stage {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="relative mt-4 ed-home-display text-[21px] leading-snug text-white">{title}</h3>
                <p className="relative mt-2 text-[13px] leading-6 text-white/70">{copy}</p>
                <span className="mt-5 block h-px w-10 bg-mint-300/60 transition-all duration-300 group-hover:w-16" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Proof */}
      <section className="relative overflow-hidden px-4 py-section sm:px-6 lg:px-10">
        <div className="mx-auto max-w-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[52ch]">
              <p className="ed-label">Proof library</p>
              <h2 className="ed-display mt-4 text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.06] text-ink">
                Real people, real records.
              </h2>
            </div>
            <p className="max-w-[40ch] text-[14px] leading-7 text-ink-soft lg:pb-2">
              Office sessions, departure support and partner meetings — published with consent and personal data removed.
            </p>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start lg:gap-14">
            <div className="relative">
              <figure className="overflow-hidden rounded-[30px] border border-rule bg-white p-2.5 shadow-[0_36px_80px_-46px_rgba(15,53,87,0.55)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
                  <Image
                    src="/images/home/consultation-family.webp"
                    alt="A student and parent meeting an EduExpress counsellor in Dhanmondi"
                    fill
                    sizes="(max-width:1024px) 100vw, 600px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/60 via-transparent to-transparent" aria-hidden="true" />
                  <figcaption className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/95 px-4 py-2.5 text-[11px] font-semibold text-ink-soft backdrop-blur">
                    <span>Dhanmondi counselling room</span>
                    <span className="inline-flex items-center gap-1.5 text-jade">
                      <ShieldCheck size={12} aria-hidden="true" /> Witnessed in office
                    </span>
                  </figcaption>
                </div>
              </figure>

              <figure className="absolute -bottom-9 right-2 hidden w-[42%] overflow-hidden rounded-[22px] border-[6px] border-chalk bg-white shadow-[0_30px_60px_-30px_rgba(15,53,87,0.6)] sm:block">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/home/consultation-student-parent.webp"
                    alt="A student reviewing study options with an EduExpress counsellor"
                    fill
                    sizes="260px"
                    className="object-cover"
                  />
                </div>
              </figure>

              <div className="absolute -left-2 top-6 hidden rounded-2xl border border-petrol-600/20 bg-white px-4 py-3 shadow-[0_20px_40px_-24px_rgba(15,53,87,0.5)] sm:block">
                <span className="ed-numeral block text-[34px] leading-none text-petrol-700">{trust.evidence.length}</span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-ink-mute">
                  evidence records
                </span>
              </div>
            </div>

            <div className="lg:pt-1">
              <TestimonialCarousel quotes={testimonialQuotes} />

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/proof-library" className="ed-btn ed-btn-primary min-h-11">
                  Open {trust.evidence.length} evidence records
                </Link>
                <Link
                  href="/success-stories"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-petrol-600 underline-offset-4 hover:underline"
                >
                  Student outcomes <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="ed-band ed-band-sky border-y border-[#cfe7f5] px-4 py-section sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-shell gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div>
            <p className="ed-label">Advice, dated</p>
            <h2 className="ed-display mt-4 text-[clamp(2.1rem,4vw,3.1rem)] leading-[1.06] text-ink">
              Current guidance, not evergreen filler.
            </h2>
            <p className="mt-4 max-w-[36ch] text-[14px] leading-7 text-ink-soft">
              Every guide is dated and tied to the intake it was written for, so you can see when a rule or cost last changed.
            </p>
            <Link href="/updates" className="ed-btn ed-btn-outline mt-7 min-h-11 bg-white/70">
              All updates and guides <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-3">
            {guideRows.slice(0, 3).map(row => (
              <Link
                key={row.key}
                href={row.href}
                className="group grid gap-2 rounded-[22px] border border-white bg-white px-5 py-5 shadow-[0_18px_40px_-34px_rgba(15,53,87,0.5)] transition duration-200 hover:-translate-y-0.5 hover:border-[#cfe7f5] hover:shadow-[0_26px_50px_-30px_rgba(15,53,87,0.4)] sm:grid-cols-[104px_minmax(0,1fr)_auto] sm:items-start sm:gap-5"
              >
                <span className="flex flex-col gap-1">
                  <span className="ed-figure text-[10.5px] font-bold uppercase tracking-[0.1em] text-petrol-500">
                    {row.date || row.kind}
                  </span>
                  <span className="w-fit rounded-full bg-mint-100 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.08em] text-petrol-700">
                    {row.category}
                  </span>
                </span>
                <span>
                  <span className="block ed-home-display text-[20px] leading-snug text-ink transition-colors group-hover:text-petrol-700">
                    {row.title}
                  </span>
                  {row.excerpt && <span className="mt-1.5 block line-clamp-2 text-[12.5px] leading-6 text-ink-soft">{row.excerpt}</span>}
                </span>
                <span className="hidden size-8 place-items-center rounded-full border border-rule text-petrol-600 transition-colors group-hover:border-petrol-400 group-hover:bg-mint-100 sm:grid">
                  <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-section sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-shell gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
          <div className="ed-band ed-band-navy relative overflow-hidden rounded-[30px] p-7 text-white sm:p-9 lg:sticky lg:top-[130px]">
            <div className="pointer-events-none absolute inset-0 ed-grid-lines" aria-hidden="true" />
            <div className="relative">
              <p className="ed-label text-mint-300 before:!bg-mint-300">Questions families ask first</p>
              <h2 className="ed-display mt-5 text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.08] text-white">
                If your case is different, ask us directly.
              </h2>
              <p className="mt-4 text-[13.5px] leading-6 text-white/75">
                Answers before the first session. For anything specific to your results or budget, message a counsellor.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="ed-btn mt-7 min-h-11 bg-[#25d366] text-[#06251a]"
              >
                <MessageCircle size={16} aria-hidden="true" /> Ask on WhatsApp
              </a>

              <div className="mt-7 grid gap-3 border-t border-white/20 pt-6 text-[12.5px] leading-6 text-white/80">
                <span className="flex gap-2.5">
                  <MapPin size={15} className="mt-1 shrink-0 text-mint-300" aria-hidden="true" />
                  {officeAddress}
                </span>
                <span className="flex gap-2.5">
                  <Clock3 size={15} className="mt-1 shrink-0 text-mint-300" aria-hidden="true" />
                  {officeHours}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {faqs.map(item => (
              <details
                key={item.question}
                className="group rounded-[20px] border border-rule bg-white px-5 shadow-[0_16px_36px_-32px_rgba(15,53,87,0.45)] open:border-[#cfe7f5] open:bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4 ed-home-display text-[17px] leading-snug text-ink">
                  {item.question}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-rule-strong bg-chalk-100 text-[16px] leading-none text-petrol-600 transition group-open:rotate-45 group-open:border-petrol-400 group-open:bg-mint-100">
                    +
                  </span>
                </summary>
                <p className="pb-5 pr-10 text-[13px] leading-7 text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-10 sm:px-6 lg:px-10 lg:pb-16">
        <div className="ed-band ed-band-navy relative mx-auto max-w-shell overflow-hidden rounded-[34px] px-6 py-12 sm:px-9 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute inset-0 ed-grid-lines" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 -top-28 size-[420px] rounded-full bg-sky-500/25 blur-[110px]" aria-hidden="true" />
          <div className="relative grid gap-9 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2.5 text-[12px] font-bold text-mint-300">
                <span className="h-px w-7 bg-mint-300" aria-hidden="true" /> Next step
              </p>
              <h2 className="ed-display mt-4 max-w-[22ch] text-[clamp(2.2rem,4.2vw,3.4rem)] leading-[1.04] text-white">
                Get a free assessment before you apply.
              </h2>
              <p className="mt-4 max-w-[50ch] text-[14px] leading-7 text-white/80">
                Share your profile and preferred destination. A counsellor will call you within one working day with the
                realistic options, the costs and the documents to prepare.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#assessment" className="ed-btn ed-btn-signal min-h-12 px-6">
                  Get my free assessment <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-btn ed-btn-on-dark min-h-12 px-6"
                >
                  <MessageCircle size={16} aria-hidden="true" /> WhatsApp a counsellor
                </a>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/20 bg-white/[0.08] p-5 backdrop-blur-sm sm:p-6">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-mint-300">Dhanmondi counselling office</p>
              <ul className="mt-4 space-y-3.5 text-[13px] leading-6 text-white/80">
                <li className="flex gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-mint-300" aria-hidden="true" />
                  <span>{officeAddress}</span>
                </li>
                <li className="flex gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-mint-300" aria-hidden="true" />
                  <a href={`tel:${officePhone.replace(/[^\d+]/g, '')}`} className="font-semibold text-white hover:underline">
                    {formatBangladeshPhone(officePhone)}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock3 size={16} className="mt-0.5 shrink-0 text-mint-300" aria-hidden="true" />
                  <span>{officeHours}</span>
                </li>
              </ul>
              <Link href="/contact" className="ed-btn mt-5 min-h-11 w-full bg-white text-petrol-800 hover:bg-chalk-100">
                Book an office consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MobileLeadBar whatsappHref={whatsappHref} />
    </div>
  );
}
