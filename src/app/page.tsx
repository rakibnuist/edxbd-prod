import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  Search,
  ShieldCheck,
  Star,
  Wallet,
} from 'lucide-react';

import MobileLeadBar from '@/components/home/MobileLeadBar';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import HomeLeadForm from '@/components/lead/HomeLeadForm';
import { getChinaIntakes } from '@/lib/china-intakes';
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
  title: { absolute: 'Study Abroad Consultancy in Bangladesh | EduExpress' },
  description:
    'Free study abroad assessment in Dhanmondi, Dhaka. Compare universities, scholarships and the full cost in writing, with no fee before your China visa.',
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
  logo?: string;
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
      logo: university.logo,
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

// Four plain steps. Each reuses the commitments the full journey page makes.
const steps = [
  {
    title: 'Free profile assessment',
    copy: 'Share your study level, subject, results, budget and preferred intake. A counsellor reviews it and calls you within one working day.',
  },
  {
    title: 'Compare options and the full cost',
    copy: 'A shortlist where recognition, cost and fit are checked together, with university, third-party and EduExpress charges separated in writing.',
  },
  {
    title: 'Apply and receive admission',
    copy: 'We prepare and submit your documents and handle the admission notice with you.',
  },
  {
    title: 'Visa and travel',
    copy: 'Your file is checked against the current official requirements. Air ticket, airport pickup and arrival guidance follow the signed package.',
  },
];

// Entrance stagger for the hero (consumed by .anim-rise / .anim-lift).
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

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
    ...(item.image ? { image: item.image } : {}),
  }));
  const ratedTestimonials = testimonials.filter(item => typeof item.rating === 'number' && item.rating > 0);
  const averageRating = ratedTestimonials.length
    ? ratedTestimonials.reduce((sum, item) => sum + (item.rating ?? 0), 0) / ratedTestimonials.length
    : 0;

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
  const telHref = `tel:${officePhone.replace(/[^\d+]/g, '')}`;

  // Live intake badge: only intakes whose window is open right now.
  const openIntakes = getChinaIntakes()
    .filter(row => row.status === 'Open' || row.status === 'Closing')
    .map(row => row.name.split(' Intake')[0]);
  const intakeBadge = openIntakes.length ? `${openIntakes.join(' & ')} intakes open for China` : 'Free assessment for the next intake';

  const logos = plannerData.filter(item => item.logo && !item.logo.endsWith('.gif')).slice(0, 16);
  const levels = [...new Set(plannerData.flatMap(item => item.levels))].filter(level => ['Bachelor’s', 'Master’s', 'PhD'].includes(level));

  const activeDestinations = countries.filter(country => country.isActive);
  const destinationImages: Record<string, string> = {
    china: '/images/destinations/china-hero.webp',
    uk: '/images/destinations/united-kingdom-hero.webp',
    'south-korea': '/images/destinations/south-korea-hero.webp',
    malaysia: '/images/destinations/malaysia-hero.webp',
    hungary: '/images/destinations/hungary-hero.webp',
  };
  const featured = ['china', 'uk', 'south-korea', 'malaysia', 'hungary']
    .map(slug => activeDestinations.find(country => country.slug === slug))
    .filter((country): country is (typeof activeDestinations)[number] => Boolean(country))
    .map(country => ({ name: country.name, slug: country.slug, href: destinationPath(country.slug), description: country.description, image: destinationImages[country.slug] }));

  const guideRows = guides.length
    ? guides.map(post => ({
        key: post.id,
        title: post.title,
        excerpt: post.excerpt ?? '',
        href: `/updates/${post.slug}`,
        date: fmtGuideDate(post.publishedAt ?? post.createdAt),
        category: post.category ?? 'Advice',
      }))
    : [
        { key: 'guide-china', title: 'Study in China from Bangladesh', excerpt: 'A complete starting guide covering fit, cost, scholarships and student life.', href: '/study-in-china-from-bangladesh', date: '', category: 'China' },
        { key: 'guide-cost', title: 'Cost of studying in China', excerpt: 'Plan tuition, hostel, living, insurance, visa and travel expenses.', href: '/study-in-china-cost-bangladesh', date: '', category: 'Costs' },
        { key: 'guide-scholarships', title: 'China scholarships explained', excerpt: 'Compare CSC, university and other scholarship types without vague promises.', href: '/china-scholarships-bangladesh', date: '', category: 'Scholarships' },
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

  // Wise-style scale (awesome-design-md/wise.md): weight-900 display for brand
  // moments, semibold Jakarta for sub-displays, 24px card/button radius.
  const wrap = 'mx-auto max-w-[1200px] px-5 lg:px-8';
  const displaySection = 'font-display text-[38px] font-black leading-[0.95] tracking-[-0.01em] text-petrol-800 sm:text-[52px]';
  const subDisplay = 'text-[23px] font-semibold leading-[1.3] tracking-[-0.02em] text-petrol-800';
  const lead = 'text-[19px] leading-[1.55] text-ink-soft sm:text-[20px]';
  const badge = 'inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1.5 text-[14px] font-semibold text-lime-deep';

  return (
    <div className="overflow-x-clip bg-white text-petrol-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      {/* 1. Hero band — sage canvas, heavy display, signature plan card */}
      <section className="bg-canvas-soft pb-14 pt-[100px] sm:pt-[116px] lg:pb-20 lg:pt-[150px]">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:gap-14`}>
          <div>
            <p className={`${badge} anim-rise`}>
              <span className="size-2 rounded-full bg-[#2ead4b]" aria-hidden="true" /> {intakeBadge}
            </p>
            <h1 style={delay(60)} className="anim-lift mt-6 font-display text-[50px] font-black leading-[0.95] tracking-[-0.02em] text-petrol-800 sm:text-[80px] lg:text-[96px]">
              <span className="sr-only">Study abroad. Every cost in writing.</span>
              <span aria-hidden="true">
                Study in{' '}
                <span className="inline-block h-[1.02em] overflow-hidden rounded-[0.28em] bg-lime px-[0.18em] align-[-0.12em]">
                  <span className="hero-rotator flex flex-col">
                    {['China', 'the UK', 'Korea', 'Malaysia', 'Hungary', 'China'].map((word, index) => (
                      <span key={index} className="block h-[1.02em] whitespace-nowrap leading-[1.02em]">{word}.</span>
                    ))}
                  </span>
                </span>
                <br />
                Every cost in writing.
              </span>
            </h1>
            <p style={delay(160)} className={`anim-rise mt-7 max-w-[34rem] ${lead}`}>
              Bangladesh&apos;s evidence-first study abroad consultancy since 2018. Compare universities, scholarships and the full cost
              with a counsellor before you pay anything.
            </p>
            <div style={delay(240)} className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                Get my free assessment <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-outline min-h-[52px] px-7">
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp a counsellor
              </a>
            </div>
            <ul style={delay(320)} className="anim-rise mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold text-petrol-800">
              {['Free, no obligation', 'Parents welcome', 'Reply within one working day'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#2ead4b]" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Signature card — the counterpart of Wise's converter: real numbers, one action */}
          <form action="/universities" method="get" role="search" aria-label="Plan your study" style={delay(200)} className="anim-rise rounded-3xl border border-petrol-800 bg-white p-6 sm:p-7">
            <p className={subDisplay}>Plan your study</p>
            <label className="mt-5 block">
              <span className="text-[14px] font-semibold text-petrol-800">What do you want to study?</span>
              <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-petrol-800 px-4 focus-within:ring-4 focus-within:ring-lime/60">
                <Search size={18} className="shrink-0 text-ink-mute" aria-hidden="true" />
                <input name="search" type="search" placeholder="Computer Science, MBBS, a university…" className="min-h-[50px] w-full bg-transparent text-[16px] text-petrol-800 placeholder:text-ink-mute focus:outline-none" />
              </span>
            </label>
            <label className="mt-4 block">
              <span className="text-[14px] font-semibold text-petrol-800">Study level</span>
              <select name="level" defaultValue="" className="mt-1.5 min-h-[50px] w-full rounded-xl border border-petrol-800 bg-white px-4 text-[16px] text-petrol-800 focus:outline-none focus:ring-4 focus:ring-lime/60">
                <option value="">Any level</option>
                {levels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </label>

            <dl className="mt-6 divide-y divide-canvas-soft border-y border-canvas-soft">
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-[15px] text-ink-soft">EduExpress fee before visa</dt>
                <dd className="whitespace-nowrap font-display text-[24px] font-black leading-none text-petrol-800 sm:text-[28px]">BDT 0</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-[15px] text-ink-soft">China package, after visa</dt>
                <dd className="whitespace-nowrap text-[17px] font-bold text-petrol-800 sm:text-[18px]">{packagePrice}</dd>
              </div>
              {plannerData.length > 0 && (
                <div className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="text-[15px] text-ink-soft">Universities on record</dt>
                  <dd className="whitespace-nowrap text-[17px] font-bold text-petrol-800 sm:text-[18px]">{plannerData.length}</dd>
                </div>
              )}
            </dl>
            <button type="submit" className="ed-btn ed-btn-signal mt-6 min-h-[52px] w-full">
              Find universities <ArrowRight size={18} aria-hidden="true" />
            </button>
            <p className="mt-3 text-center text-[13px] leading-5 text-ink-mute">University tuition and deposits are paid to the university and listed separately.</p>
          </form>
        </div>

        {/* Real photographs, rounded like every card in the system */}
        <div className={`${wrap} mt-12 grid grid-cols-3 gap-3 sm:gap-5`}>
          {[
            { src: '/images/students/campus-nuist.webp', alt: 'A student at the I love NUIST sign on campus in Nanjing', caption: 'On campus in Nanjing', position: 'object-[60%_45%]' },
            { src: '/images/students/students-campus.webp', alt: 'Bangladeshi students in front of a Chinese university admissions board', caption: 'Admitted and enrolled', position: 'object-[center_35%]' },
            { src: '/images/students/departure-family.webp', alt: 'A Bangladeshi family seeing a student off at Dhaka airport', caption: 'Departure day, Dhaka', position: 'object-center' },
          ].map((photo, index) => (
            <figure key={photo.src} style={delay(320 + index * 90)} className="anim-rise group relative aspect-[3/4] overflow-hidden rounded-3xl sm:aspect-[4/3]">
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width:640px) 33vw, 380px" className={`object-cover transition duration-700 group-hover:scale-105 ${photo.position}`} />
              <figcaption className="absolute bottom-3 left-3 hidden rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-petrol-800 sm:block">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 2. University logos */}
      {logos.length >= 6 && (
        <section aria-label="Universities in our directory" className="border-b border-canvas-soft py-10">
          <p className="text-center text-[15px] font-semibold text-ink-soft">
            {plannerData.length} universities in our verified directory, with fees, intakes and scholarships
          </p>
          <div className="home-ticker mt-6" data-pause-offscreen>
            <div className="home-ticker-track items-center gap-14 px-7">
              {[...logos, ...logos].map((item, index) => (
                <Image
                  key={`${item.slug}-${index}`}
                  src={item.logo as string}
                  alt={index < logos.length ? item.name : ''}
                  aria-hidden={index >= logos.length ? true : undefined}
                  width={120}
                  height={56}
                  unoptimized
                  className="h-14 w-auto max-w-[140px] object-contain"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. What you get — sage / pale-lime / dark feature cards */}
      <section className="py-20 lg:py-24">
        <div className={wrap}>
          <h2 data-anim="up" className={`max-w-3xl ${displaySection}`}>Three things you get in writing.</h2>
          <p className={`mt-5 max-w-2xl ${lead}`}>Decisions this big should not depend on a phone call. You receive all three before you pay.</p>
          <div data-anim="stagger" className="mt-12 grid gap-5 md:grid-cols-3">
            <Link href="/how-we-verify-universities" className="group flex flex-col rounded-3xl bg-canvas-soft p-7 transition hover:-translate-y-1">
              <span className="grid size-12 place-items-center rounded-full bg-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"><ShieldCheck size={22} aria-hidden="true" /></span>
              <h3 className={`mt-8 ${subDisplay}`}>Recognition check</h3>
              <p className="mt-2 flex-1 text-[16px] leading-6 text-ink-soft">Who recognises the degree, on which official source, and when it was last verified.</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[16px] font-semibold underline-offset-4 group-hover:underline">How we verify <ArrowRight size={16} aria-hidden="true" /></span>
            </Link>
            <Link href="/fees-and-transparency" className="group flex flex-col rounded-3xl bg-lime-pale p-7 transition hover:-translate-y-1">
              <span className="grid size-12 place-items-center rounded-full bg-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"><Wallet size={22} aria-hidden="true" /></span>
              <h3 className={`mt-8 ${subDisplay}`}>Full cost schedule</h3>
              <p className="mt-2 flex-1 text-[16px] leading-6 text-ink-soft">Tuition, hostel, insurance, visa, travel and our fee on one page, with what is refundable.</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[16px] font-semibold underline-offset-4 group-hover:underline">Our fee policy <ArrowRight size={16} aria-hidden="true" /></span>
            </Link>
            <Link href="/your-study-journey" className="group flex flex-col rounded-3xl bg-petrol-800 p-7 text-white transition hover:-translate-y-1">
              <span className="grid size-12 place-items-center rounded-full bg-lime text-petrol-800 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"><ClipboardCheck size={22} aria-hidden="true" /></span>
              <h3 className="mt-8 text-[23px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">Application record</h3>
              <p className="mt-2 flex-1 text-[16px] leading-6 text-white/80">Every document submitted, every deadline and the status of your file, from application to airport pickup.</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[16px] font-semibold text-white underline-offset-4 group-hover:underline">See every stage <ArrowRight size={16} aria-hidden="true" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Cost — dark band with lime display headline */}
      <section id="package" className="bg-petrol-800 py-20 text-white lg:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center`}>
          <div>
            <h2 data-anim="pop" className="font-display text-[56px] font-black leading-[0.9] tracking-[-0.02em] text-lime sm:text-[88px]">BDT 0 before your visa.</h2>
            <p className="mt-6 max-w-xl text-[20px] leading-[1.55] text-white/85">
              For China, the EduExpress package is {packagePrice}, paid after your visa is approved. University deposits, personal
              spending and some document fees are paid separately, and listed for you before you commit.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">Get my full cost schedule</a>
              <Link href="/study-in-china-cost-bangladesh" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">Living and tuition costs</Link>
            </div>
          </div>
          <div data-anim="up" className="rounded-3xl bg-white p-6 text-petrol-800 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={subDisplay}>What&apos;s included</p>
              <span className="rounded-full bg-lime-pale px-3 py-1 text-[14px] font-semibold text-lime-deep">{packagePrice}</span>
            </div>
            <ul data-anim="stagger" className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {packageItems.map(item => (
                <li key={item} className="flex gap-2 text-[15px] leading-6">
                  <CheckCircle2 size={18} className="mt-[3px] shrink-0 text-[#2ead4b]" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl bg-canvas-soft p-5">
              <p className="text-[15px] font-bold">Paid separately</p>
              <ul className="mt-2 grid gap-1.5">
                {excludedItems.map(item => (
                  <li key={item} className="flex gap-2 text-[15px] leading-6 text-ink-soft">
                    <span className="mt-[10px] size-1.5 shrink-0 rounded-full bg-ink-mute" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/china-visa-first-policy" className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold underline underline-offset-4">
              Read the payment terms <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Destinations — white cards on sage */}
      {featured.length > 0 && (
        <section className="py-20 lg:py-24">
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <h2 data-anim="up" className={`max-w-2xl ${displaySection}`}>{activeDestinations.length} countries. One honest plan.</h2>
              <Link href="/destinations" className="ed-btn ed-btn-outline min-h-12 px-6">All destinations <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <div data-anim="stagger" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item, index) => (
                <Link key={item.slug} href={item.href} className={`group flex flex-col rounded-3xl bg-canvas-soft p-3 transition hover:-translate-y-1 ${index === 0 ? 'sm:col-span-2' : ''}`}>
                  <div className={`relative overflow-hidden rounded-2xl ${index === 0 ? 'aspect-[16/8]' : 'aspect-[16/10]'}`}>
                    {item.image && <Image src={item.image} alt="" fill sizes={index === 0 ? '(max-width:1024px) 100vw, 760px' : '(max-width:640px) 100vw, 380px'} className="object-cover transition duration-500 group-hover:scale-105" />}
                    {index === 0 && <span className={`absolute left-4 top-4 ${badge}`}>Most data available</span>}
                  </div>
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                    <h3 className={index === 0 ? 'font-display text-[34px] font-black leading-none text-petrol-800' : subDisplay}>Study in {item.name}</h3>
                    {item.description && <p className="mt-2 line-clamp-2 text-[16px] leading-6 text-ink-soft">{item.description}</p>}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[16px] font-semibold underline-offset-4 group-hover:underline">
                      Costs, universities and visa <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. How it works — a boarding pass from Dhaka to campus */}
      <section className="bg-canvas-soft py-20 lg:py-24">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 data-anim="up" className={`max-w-2xl ${displaySection}`}>Your route: Dhaka to campus.</h2>
            <Link href="/your-study-journey" className="ed-btn ed-btn-outline min-h-12 bg-white px-6">See the full journey <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>

          <div className="relative mt-12 grid overflow-hidden rounded-3xl bg-white ring-1 ring-petrol-800 lg:grid-cols-[330px_1fr]">
            {/* Stub */}
            <div className="relative bg-petrol-800 p-7 text-white sm:p-8">
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-lime">Boarding pass</p>
              <div className="mt-6 flex items-center gap-4">
                <div>
                  <p className="font-display text-[42px] font-black leading-none">DAC</p>
                  <p className="mt-1 text-[14px] text-white/75">Dhaka</p>
                </div>
                <Plane size={28} className="shrink-0 text-lime" aria-hidden="true" />
                <div>
                  <p className="font-display text-[42px] font-black leading-none">UNI</p>
                  <p className="mt-1 text-[14px] text-white/75">Your campus</p>
                </div>
              </div>
              <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 text-[14px]">
                <div><dt className="text-white/60">Passenger</dt><dd className="mt-0.5 font-semibold">You (and family)</dd></div>
                <div><dt className="text-white/60">Check-in</dt><dd className="mt-0.5 font-semibold">Dhanmondi office</dd></div>
                <div><dt className="text-white/60">Fare before visa</dt><dd className="mt-0.5 font-semibold text-lime">BDT 0</dd></div>
                <div><dt className="text-white/60">Class</dt><dd className="mt-0.5 font-semibold">Free assessment</dd></div>
              </dl>
              <div className="ticket-barcode mt-8 h-12 text-white/80" aria-hidden="true" />
            </div>

            {/* Perforation notches between stub and body (desktop) */}
            <span className="ticket-notch -top-[14px] left-[316px] hidden lg:block" aria-hidden="true" />
            <span className="ticket-notch -bottom-[14px] left-[316px] hidden lg:block" aria-hidden="true" />

            {/* Route */}
            <ol data-anim="route" className="relative grid gap-8 border-dashed border-petrol-800/30 p-7 sm:grid-cols-2 sm:p-8 lg:grid-cols-4 lg:border-l-2 lg:p-10">
              <span className="route-line absolute left-10 right-10 top-[72px] hidden border-t-2 border-dashed border-petrol-800/25 lg:block" aria-hidden="true" />
              <span className="route-flyer absolute left-10 right-10 top-[26px] hidden text-petrol-800 lg:block" aria-hidden="true"><Plane size={28} className="rotate-45" /></span>
              {steps.map((step, index) => (
                <li key={step.title} className="relative">
                  <span className="route-stop relative grid size-12 place-items-center rounded-full bg-lime font-display text-[20px] font-black text-petrol-800" aria-hidden="true">
                    {index + 1}
                  </span>
                  <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.14em] text-ink-mute">{['Consult', 'Compare', 'Apply', 'Fly'][index]}</p>
                  <h3 className="mt-1 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-petrol-800">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-6 text-ink-soft">{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 7. Real students — proof */}
      <section className="py-20 lg:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-2 lg:items-center`}>
          <div data-anim="up" className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/students/success-banner.webp"
              alt="Students and parents at Dhaka airport holding a banner: Finally we made our dream study in China with EduExpress International"
              fill
              sizes="(max-width:1024px) 100vw, 580px"
              className="object-cover"
            />
          </div>
          <div>
            <p className={badge}>Since 2018 · Dhanmondi, Dhaka</p>
            <h2 data-anim="up" className={`mt-6 ${displaySection}`}>&ldquo;Finally we made our dream: study in China.&rdquo;</h2>
            <p className={`mt-6 ${lead}`}>
              Families meet our counsellors in Dhanmondi, and we see students off at Dhaka airport. Read their stories in their own
              words.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/success-stories" className="ed-btn ed-btn-outline min-h-[52px] px-7">Read student stories</Link>
              <Link href="/proof-library" className="ed-btn ed-btn-soft min-h-[52px] px-7">
                {trust.evidence.length > 0 ? `See ${trust.evidence.length} published records` : 'Open the proof library'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Student voices (only when published) */}
      {testimonialQuotes.length > 0 && (
        <section className="py-20 lg:py-24">
          <div className={`${wrap} grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center`}>
            <div>
              <h2 className={displaySection}>What students say.</h2>
              {averageRating > 0 && ratedTestimonials.length >= 3 && (
                <p className="mt-5 inline-flex items-center gap-2 text-[16px] text-ink-soft">
                  <span className="inline-flex text-[#ffd11a]" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => <Star key={i} size={20} fill="currentColor" strokeWidth={0} />)}
                  </span>
                  <strong className="text-petrol-800">{averageRating.toFixed(1)} / 5</strong> from {ratedTestimonials.length} published reviews
                </p>
              )}
            </div>
            <TestimonialCarousel quotes={testimonialQuotes} />
          </div>
        </section>
      )}

      {/* 9. Guides */}
      <section className={`${testimonialQuotes.length ? 'bg-canvas-soft' : ''} py-20 lg:py-24`}>
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 data-anim="up" className={`max-w-2xl ${displaySection}`}>Read before you decide.</h2>
            <Link href="/updates" className="ed-btn ed-btn-outline min-h-12 px-6">All guides <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ul data-anim="stagger" className="mt-12 grid gap-5 md:grid-cols-3">
            {guideRows.slice(0, 3).map((row, index) => (
              <li key={row.key}>
                <Link href={row.href} className={`group flex h-full flex-col rounded-3xl p-3 transition hover:-translate-y-1 ${testimonialQuotes.length ? 'bg-white' : 'bg-canvas-soft'}`}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                    <Image
                      src={['/images/home/china-campus-life.webp', '/images/students/student-life.webp', '/images/home/china-campus-group.webp'][index % 3]}
                      alt=""
                      fill
                      sizes="(max-width:768px) 100vw, 380px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                    <span className="text-[14px] font-semibold text-ink-mute">{row.category}{row.date && ` · ${row.date}`}</span>
                    <span className={`mt-2 ${subDisplay}`}>{row.title}</span>
                    {row.excerpt && <span className="mt-2 line-clamp-2 text-[16px] leading-6 text-ink-soft">{row.excerpt}</span>}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[16px] font-semibold underline-offset-4 group-hover:underline">
                      Read the guide <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className={`${testimonialQuotes.length ? '' : 'bg-canvas-soft'} py-20 lg:py-24`}>
        <div className={`${wrap} grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-start`}>
          <div className="lg:sticky lg:top-[140px]">
            <h2 data-anim="up" className={displaySection}>Questions parents ask first.</h2>
            <p className={`mt-5 ${lead}`}>Your situation is different? Ask a counsellor directly.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp us
              </a>
              <a href={telHref} className="ed-btn ed-btn-outline min-h-[52px] px-7">
                <Phone size={18} aria-hidden="true" /> {formatBangladeshPhone(officePhone)}
              </a>
            </div>
          </div>
          <div data-anim="stagger" className="grid gap-3">
            {faqs.map(item => (
              <details key={item.question} className={`faq-smooth group rounded-3xl px-6 ${testimonialQuotes.length ? 'bg-canvas-soft' : 'bg-white'}`}>
                <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-5 py-4 text-[18px] font-semibold leading-snug">
                  {item.question}
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-[22px] leading-none text-petrol-800 transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="pb-6 pr-10 text-[16px] leading-7 text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Free assessment — dark band, lime headline */}
      <section id="assessment" className="scroll-mt-24 bg-petrol-800 py-20 text-white lg:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_minmax(0,460px)] lg:items-center`}>
          <div>
            <h2 data-anim="pop" className="font-display text-[48px] font-black leading-[0.92] tracking-[-0.02em] text-lime sm:text-[72px]">Not sure where to start?</h2>
            <p className="mt-6 max-w-xl text-[20px] leading-[1.55] text-white/85">
              Tell us your results, budget and preferred country. A counsellor calls you within one working day with realistic options,
              the costs and the documents to prepare.
            </p>
            <ul className="mt-8 grid gap-4 text-[16px] text-white/90">
              <li className="flex gap-3"><MapPin size={20} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> {officeAddress}</li>
              <li className="flex gap-3"><Clock3 size={20} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> {officeHours}</li>
            </ul>
          </div>
          <div data-anim="up"><HomeLeadForm whatsappHref={whatsappHref} /></div>
        </div>
      </section>

      <MobileLeadBar whatsappHref={whatsappHref} />
    </div>
  );
}
