import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  GraduationCap,
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
  const intakeBadge = openIntakes.length
    ? `China ${openIntakes.join(' & ')} intakes are open`
    : 'Free profile assessment for the next intake';

  // Logo strip: universities in the directory that have a logo on file.
  const logos = plannerData.filter(item => item.logo && !item.logo.endsWith('.gif')).slice(0, 16);
  const levels = [...new Set(plannerData.flatMap(item => item.levels))].filter(level => ['Bachelor’s', 'Master’s', 'PhD'].includes(level));

  const activeDestinations = countries.filter(country => country.isActive);
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
  const featuredOrder = ['china', 'uk', 'south-korea', 'malaysia', 'hungary'];
  const featured = featuredOrder
    .map(slug => activeDestinations.find(country => country.slug === slug))
    .filter((country): country is (typeof activeDestinations)[number] => Boolean(country))
    .map(country => ({ name: country.name, slug: country.slug, href: destinationPath(country.slug), description: country.description, image: destinationImages[country.slug] }));
  const [lead, ...others] = featured;

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

  const wrap = 'mx-auto max-w-7xl px-5 lg:px-8';
  const eyebrow = 'text-[15px] font-bold text-green-500';
  const h2 = 'mt-2 text-[32px] font-extrabold leading-[1.1] tracking-tight text-petrol-800 sm:text-[42px]';
  const glass = 'border border-white/20 bg-white/10 backdrop-blur-md';

  return (
    <div className="overflow-x-clip bg-white text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      {/* Hero — full-bleed campus photo under the transparent header */}
      <section className="relative isolate overflow-hidden bg-petrol-900">
        <Image
          src="/images/students/campus-nuist.webp"
          alt="A Bangladeshi student standing at the I love NUIST sign on campus in Nanjing, China"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[62%_45%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-petrol-900/95 via-petrol-900/80 to-petrol-900/25" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-petrol-900/80 to-transparent" aria-hidden="true" />

        <div className={`${wrap} grid gap-12 pb-24 pt-[120px] sm:pt-[132px] lg:grid-cols-[1.15fr_.85fr] lg:pb-32 lg:pt-[180px]`}>
          <div>
            <p className={`inline-flex items-center gap-2 rounded-full ${glass} px-4 py-2 text-[14px] font-semibold text-white`}>
              <span className="size-2 rounded-full bg-[#f5b83d]" aria-hidden="true" /> {intakeBadge}
            </p>
            <h1 className="mt-6 text-[42px] font-extrabold leading-[1.04] tracking-tight text-white sm:text-[58px] lg:text-[70px]">
              Your study abroad dream, <span className="text-mint-300">planned in writing.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[18px] leading-8 text-white/85">
              Bangladesh&apos;s evidence-first consultancy since 2018. Compare universities, scholarships and the full cost, and pay no
              EduExpress service fee before your China visa is approved.
            </p>

            <form action="/universities" method="get" role="search" aria-label="Find universities" className="mt-9 grid max-w-2xl gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/30 sm:grid-cols-[1.3fr_1fr_auto]">
              <label className="flex items-center gap-3 rounded-xl px-4 py-2.5 focus-within:bg-chalk-100">
                <Search size={20} className="shrink-0 text-petrol-600" aria-hidden="true" />
                <span className="flex w-full flex-col">
                  <span className="text-[13px] font-semibold text-ink-mute">Subject or university</span>
                  <input name="search" type="search" placeholder="e.g. Computer Science" className="w-full bg-transparent text-[16px] font-bold text-ink placeholder:font-semibold placeholder:text-ink-mute focus:outline-none" />
                </span>
              </label>
              <label className="flex items-center gap-3 rounded-xl px-4 py-2.5 focus-within:bg-chalk-100 sm:border-l sm:border-rule">
                <GraduationCap size={20} className="shrink-0 text-petrol-600" aria-hidden="true" />
                <span className="flex w-full flex-col">
                  <span className="text-[13px] font-semibold text-ink-mute">Study level</span>
                  <select name="level" defaultValue="" className="w-full bg-transparent text-[16px] font-bold text-ink focus:outline-none">
                    <option value="">Any level</option>
                    {levels.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                </span>
              </label>
              <button type="submit" className="ed-btn ed-btn-signal min-h-[56px] rounded-xl px-7 text-[16px]">
                <Search size={19} aria-hidden="true" /> Find universities
              </button>
            </form>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium text-white/90">
              {['Free assessment', 'Parents welcome', 'Reply within one working day'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={19} className="text-mint-300" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Floating proof cards (desktop) */}
          <div className="relative hidden min-h-[420px] lg:block" aria-hidden="false">
            <div className={`absolute right-0 top-4 w-[300px] rounded-2xl ${glass} p-5 text-white`}>
              <div className="flex items-center gap-3.5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-green-500"><BadgeCheck size={24} aria-hidden="true" /></span>
                <p>
                  <span className="block text-[26px] font-extrabold leading-none">BDT 0</span>
                  <span className="mt-1 block text-[14px] text-white/80">EduExpress fee before China visa approval</span>
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 right-4 w-[330px] rounded-2xl bg-white p-4 shadow-2xl">
              <div className="flex items-center gap-3.5">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                  <Image src="/images/students/departure-family.webp" alt="" fill sizes="64px" className="object-cover" />
                </div>
                <p>
                  <span className="block text-[16px] font-bold text-ink">Departure day, Dhaka airport</span>
                  <span className="mt-0.5 block text-[14px] leading-5 text-ink-soft">We see students off, and airport pickup on arrival is part of the package.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University logo strip */}
      {logos.length >= 6 && (
        <section aria-label="Universities in our directory" className="border-b border-rule bg-white py-8">
          <p className="text-center text-[13px] font-bold uppercase tracking-[0.16em] text-ink-mute">Universities in our verified directory</p>
          <div className="home-ticker mt-6">
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
          <p className="mt-6 text-center">
            <Link href="/universities" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-petrol-600 hover:underline">
              Browse all {plannerData.length} universities <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </p>
        </section>
      )}

      {/* Destinations — photo bento */}
      {lead && (
        <section className="bg-chalk-100 py-20 lg:py-24">
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={eyebrow}>Where will you study?</p>
                <h2 className={h2}>{activeDestinations.length} countries. One honest plan.</h2>
              </div>
              <Link href="/destinations" className="ed-btn ed-btn-outline min-h-12 rounded-full px-6">
                All destinations <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
              <Link href={lead.href} className="group relative min-h-[340px] overflow-hidden rounded-3xl sm:col-span-2 lg:row-span-2">
                {lead.image && <Image src={lead.image} alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />}
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/90 via-petrol-900/25 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <span className="rounded-full bg-[#f5b83d] px-3 py-1 text-[13px] font-extrabold uppercase tracking-wide text-petrol-900">Most data available</span>
                  <h3 className="mt-3 text-[32px] font-extrabold">Study in {lead.name}</h3>
                  {lead.description && <p className="mt-2 max-w-md text-[16px] leading-7 text-white/90">{lead.description}</p>}
                  <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-mint-200">
                    Universities, costs and scholarships <ArrowRight size={16} aria-hidden="true" className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
              {others.map(item => (
                <Link key={item.slug} href={item.href} className="group relative min-h-[170px] overflow-hidden rounded-3xl">
                  {item.image && <Image src={item.image} alt="" fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/85 via-petrol-900/10 to-transparent" aria-hidden="true" />
                  <h3 className="absolute bottom-4 left-5 text-[21px] font-bold text-white">Study in {item.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Real students, real departures */}
      <section className="bg-white py-20 lg:py-24">
        <div className={`${wrap} grid items-center gap-14 lg:grid-cols-2`}>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/images/students/success-banner.webp"
                alt="Students and parents at Dhaka airport holding a banner: Finally we made our dream study in China with EduExpress International"
                fill
                sizes="(max-width:1024px) 100vw, 600px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-4 rounded-2xl bg-petrol-800 px-6 py-5 text-white shadow-xl sm:-right-4">
              <p className="text-[28px] font-extrabold leading-none">Since 2018</p>
              <p className="mt-1 text-[14px] text-white/80">Dhanmondi, Dhaka</p>
            </div>
          </div>
          <div>
            <p className={eyebrow}>Real students. Real departures.</p>
            <h2 className={h2}>&ldquo;Finally we made our dream: study in China.&rdquo;</h2>
            <p className="mt-5 text-[18px] leading-8 text-ink-soft">
              Every family receives three documents before paying anything: the recognition check, the full cost schedule and the
              application record. No spoken promises.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: 'Recognition check', tone: 'bg-mint-100 text-petrol-600', href: '/how-we-verify-universities' },
                { icon: Wallet, title: 'Full cost in writing', tone: 'bg-green-50 text-green-600', href: '/fees-and-transparency' },
                { icon: Plane, title: 'Visa to airport pickup', tone: 'bg-[#fff6dc] text-[#b7791f]', href: '/your-study-journey' },
              ].map(item => (
                <Link key={item.title} href={item.href} className={`rounded-2xl p-5 transition hover:-translate-y-0.5 ${item.tone}`}>
                  <item.icon size={28} aria-hidden="true" />
                  <span className="mt-3 block text-[16px] font-bold leading-snug text-petrol-800">{item.title}</span>
                </Link>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#assessment" className="ed-btn ed-btn-signal min-h-[54px] rounded-full px-7 text-[17px]">
                Get my free assessment <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link href="/success-stories" className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-petrol-600 hover:underline">
                Student stories <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* China package cost */}
      <section id="package" className="relative overflow-hidden bg-petrol-800 py-20 text-white lg:py-24">
        <div className="absolute -right-40 -top-40 size-[520px] rounded-full bg-sky-500/20 blur-[120px]" aria-hidden="true" />
        <div className={`${wrap} relative grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center`}>
          <div>
            <p className="text-[15px] font-bold text-mint-300">What does it cost?</p>
            <h2 className="mt-2 text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[42px]">
              China package: {packagePrice}. <span className="text-mint-300">Paid after your visa.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[18px] leading-8 text-white/85">
              The package covers the work we do. University deposits, personal spending and some document fees are paid separately,
              and you see each one on a written schedule before you commit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#assessment" className="ed-btn ed-btn-signal min-h-[52px] rounded-full px-7">Get my full cost schedule</a>
              <Link href="/study-in-china-cost-bangladesh" className="ed-btn ed-btn-on-dark min-h-[52px] rounded-full px-7">Living and tuition costs</Link>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 text-ink shadow-2xl sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-5">
              <p className="ed-figure text-[34px] leading-none text-petrol-800">{packagePrice}</p>
              <span className="rounded-full bg-green-100 px-3.5 py-1.5 text-[14px] font-bold text-green-700">No fee before visa approval</span>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-[15px] font-bold text-ink">Included</p>
                <ul className="mt-3 grid gap-2">
                  {packageItems.map(item => (
                    <li key={item} className="flex gap-2 text-[15px] leading-6 text-ink-soft">
                      <CheckCircle2 size={17} className="mt-[3px] shrink-0 text-green-500" aria-hidden="true" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[15px] font-bold text-ink">Paid separately</p>
                <ul className="mt-3 grid gap-2">
                  {excludedItems.map(item => (
                    <li key={item} className="flex gap-2 text-[15px] leading-6 text-ink-soft">
                      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-ink-mute" aria-hidden="true" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/china-visa-first-policy" className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-petrol-600 hover:underline">
                  Read the payment terms <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 lg:py-24">
        <div className={wrap}>
          <div className="text-center">
            <p className={eyebrow}>How it works</p>
            <h2 className={h2}>From first call to your first class</h2>
          </div>
          <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            <span className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-[2px] bg-gradient-to-r from-mint-300 via-sky-500 to-green-400 md:block" aria-hidden="true" />
            {steps.map((step, index) => (
              <li key={step.title} className="relative text-center">
                <span className="relative mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-green-500 text-[24px] font-extrabold text-white shadow-lg ring-8 ring-white" aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-[20px] font-bold text-petrol-800">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[30ch] text-[15px] leading-6 text-ink-soft">{step.copy}</p>
              </li>
            ))}
          </ol>
          <p className="mt-12 text-center">
            <Link href="/your-study-journey" className="ed-btn ed-btn-outline min-h-12 rounded-full px-6">See the full journey <ArrowRight size={16} aria-hidden="true" /></Link>
          </p>
        </div>
      </section>

      {/* Student voices — only when published testimonials exist */}
      {testimonialQuotes.length > 0 && (
        <section className="bg-chalk-100 py-20 lg:py-24">
          <div className={`${wrap} grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center`}>
            <div>
              <p className={eyebrow}>Student voices</p>
              <h2 className={h2}>What our students say</h2>
              {averageRating > 0 && ratedTestimonials.length >= 3 && (
                <p className="mt-4 inline-flex items-center gap-2 text-[16px] text-ink-soft">
                  <span className="inline-flex text-[#f5b83d]" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => <Star key={i} size={20} fill="currentColor" strokeWidth={0} />)}
                  </span>
                  <strong className="text-ink">{averageRating.toFixed(1)} / 5</strong> from {ratedTestimonials.length} published reviews
                </p>
              )}
            </div>
            <TestimonialCarousel quotes={testimonialQuotes} />
          </div>
        </section>
      )}

      {/* Free guides */}
      <section className={`${testimonialQuotes.length ? 'bg-white' : 'bg-chalk-100'} py-20 lg:py-24`}>
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={eyebrow}>Free guides</p>
              <h2 className={h2}>Read before you decide</h2>
            </div>
            <Link href="/updates" className="ed-btn ed-btn-outline min-h-12 rounded-full px-6">All guides <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {guideRows.slice(0, 3).map((row, index) => (
              <li key={row.key}>
                <Link href={row.href} className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-rule transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={['/images/home/china-campus-life.webp', '/images/students/student-life.webp', '/images/home/china-campus-group.webp'][index % 3]}
                      alt=""
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[13px] font-bold text-petrol-700">{row.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[19px] font-bold leading-snug text-petrol-800 group-hover:text-petrol-600">{row.title}</span>
                    {row.excerpt && <span className="mt-2 line-clamp-3 text-[15px] leading-6 text-ink-soft">{row.excerpt}</span>}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[15px] font-semibold text-green-600">
                      Read the guide {row.date && <span className="font-normal text-ink-mute">· {row.date}</span>} <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 lg:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start`}>
          <div className="lg:sticky lg:top-[140px]">
            <p className={eyebrow}>Questions</p>
            <h2 className={h2}>What students and parents ask first</h2>
            <div className="relative mt-8 overflow-hidden rounded-3xl">
              <div className="relative aspect-[4/3]">
                <Image src="/images/home/consultation-family.webp" alt="A student and parent meeting an EduExpress counsellor in Dhanmondi" fill sizes="(max-width:1024px) 100vw, 480px" className="object-cover" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-petrol-900/90 to-transparent p-5 pt-16 text-white">
                <p className="text-[17px] font-bold">Ask a counsellor directly</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="ed-btn min-h-11 rounded-full bg-[#25d366] px-5 text-[#06251a]">
                    <MessageCircle size={17} aria-hidden="true" /> WhatsApp
                  </a>
                  <a href={telHref} className="ed-btn ed-btn-on-dark min-h-11 rounded-full px-5">
                    <Phone size={17} aria-hidden="true" /> {formatBangladeshPhone(officePhone)}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            {faqs.map(item => (
              <details key={item.question} className="group rounded-2xl border border-rule bg-white px-6 transition open:border-mint-300 open:shadow-[0_16px_40px_-28px_rgba(15,23,42,.5)]">
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-5 py-4 text-[17px] font-bold leading-snug text-petrol-800">
                  {item.question}
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint-100 text-[20px] leading-none text-petrol-600 transition group-open:rotate-45 group-open:bg-green-500 group-open:text-white" aria-hidden="true">+</span>
                </summary>
                <p className="pb-5 pr-8 text-[16px] leading-7 text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Free assessment form */}
      <section id="assessment" className="relative isolate scroll-mt-24 overflow-hidden bg-petrol-900 py-20 text-white lg:py-24">
        <Image src="/images/home/china-campus-group.webp" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-petrol-900 via-petrol-900/90 to-petrol-900/70" aria-hidden="true" />
        <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_minmax(0,460px)] lg:items-center`}>
          <div>
            <p className="text-[15px] font-bold text-mint-300">Free profile assessment</p>
            <h2 className="mt-2 text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[48px]">Not sure where to start? Start here.</h2>
            <p className="mt-5 max-w-xl text-[18px] leading-8 text-white/85">
              Tell us your results, budget and preferred country. A counsellor calls you within one working day with realistic options,
              the costs and the documents to prepare.
            </p>
            <ul className="mt-8 grid gap-4 text-[16px]">
              <li className="flex gap-3"><MapPin size={20} className="mt-0.5 shrink-0 text-mint-300" aria-hidden="true" /> <span className="text-white/90">{officeAddress}</span></li>
              <li className="flex gap-3"><Clock3 size={20} className="mt-0.5 shrink-0 text-mint-300" aria-hidden="true" /> <span className="text-white/90">{officeHours}</span></li>
              <li className="flex gap-3"><Phone size={20} className="mt-0.5 shrink-0 text-mint-300" aria-hidden="true" /> <a href={telHref} className="font-semibold text-white hover:underline">{formatBangladeshPhone(officePhone)}</a></li>
            </ul>
          </div>
          <HomeLeadForm whatsappHref={whatsappHref} />
        </div>
      </section>

      <MobileLeadBar whatsappHref={whatsappHref} />
    </div>
  );
}
