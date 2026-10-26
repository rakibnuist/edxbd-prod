import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Phone,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from 'lucide-react';
import Carousel from '@/components/home/Carousel';
import HomeAssessment from '@/components/home/HomeAssessment';
import Reveal from '@/components/home/Reveal';
import { config } from '@/lib/config';
import { countries } from '@/lib/countries';
import { getPublishedUpdates } from '@/lib/content-records';
import { destinationPath } from '@/lib/site-urls';
import { getPublicTrustRecords } from '@/lib/trust-records';
import type { Update } from '@/lib/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Education Consultancy in Bangladesh | EduExpress International' },
  description:
    'Compare study destinations with clear costs and written guidance. Free profile assessment for China and other routes from EduExpress International, Dhaka.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Choose Better Education Abroad | EduExpress International',
    description: 'Clear costs, written proof and human guidance from profile assessment to departure.',
    url: '/',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Better Education. Clear Costs. Written Proof.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Choose Better Education Abroad | EduExpress International',
    description: 'Clear costs, written proof and human guidance from profile assessment to departure.',
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
    return await getPublishedUpdates(8);
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

const informationRoutes = [
  {
    icon: GraduationCap,
    title: 'Find a university',
    copy: 'Browse universities, programs and current admission information.',
    href: '/universities',
    link: 'Explore universities',
  },
  {
    icon: CircleDollarSign,
    title: 'Understand the cost',
    copy: 'See tuition, accommodation, deposits and other likely expenses.',
    href: '/study-in-china-cost-bangladesh',
    link: 'See China costs',
  },
  {
    icon: Sparkles,
    title: 'Check scholarships',
    copy: 'Learn what tuition, accommodation or stipend support may cover.',
    href: '/china-scholarships-bangladesh',
    link: 'Compare scholarships',
  },
  {
    icon: FileCheck2,
    title: 'Prepare documents',
    copy: 'Understand admission, JW202 and China student-visa requirements.',
    href: '/china-student-visa-bangladesh',
    link: 'View requirements',
  },
];

const journey = [
  ['01', 'Share your profile', 'Tell us your study level, subject and preferred destination.'],
  ['02', 'Compare suitable options', 'A counsellor shortlists realistic university and scholarship routes.'],
  ['03', 'Receive the full cost', 'University, third-party and EduExpress charges are separated in writing.'],
  ['04', 'Complete the application', 'We guide documents, applications and admission-notice processing.'],
  ['05', 'Prepare for the visa', 'Your file is checked against the current official requirements.'],
  ['06', 'Travel with support', 'Air ticket, airport pickup and arrival guidance follow the signed package.'],
];

// Local destination photography where it exists; otherwise fall back to the
// country record's own https image. Countries whose record only carries a
// generic office photo deliberately render as a typographic tile instead.
const destinationImageOverrides: Record<string, string> = {
  china: '/images/destinations/china.jpg',
  'south-korea': '/images/destinations/south-korea.jpg',
  uk: '/images/destinations/united-kingdom.jpg',
  hungary: '/images/destinations/hungary.jpg',
  finland: '/images/destinations/finland.jpg',
  cyprus: '/images/destinations/cyprus.jpg',
  croatia: '/images/destinations/croatia.jpg',
  georgia: '/images/destinations/georgia.jpg',
  malaysia: '/images/destinations/malaysia.jpg',
};

const destinationCards = countries
  .filter(country => country.isActive)
  .map(country => {
    const remote = country.images.find(src => src.startsWith('https://'));
    return {
      name: country.name,
      flag: country.flag,
      slug: country.slug,
      href: destinationPath(country.slug),
      status: country.serviceStatus ?? 'Active',
      description: country.description,
      image: destinationImageOverrides[country.slug] ?? remote ?? null,
    };
  })
  .sort((a, b) => Number(b.status === 'Flagship') - Number(a.status === 'Flagship') || a.name.localeCompare(b.name));

const faqs = [
  {
    question: 'How do I start with EduExpress?',
    answer: 'Complete the free profile assessment with your current study level, preferred destination and contact details. A counsellor will review the profile and explain the most relevant next step.',
  },
  {
    question: 'What does a full scholarship mean?',
    answer: 'The exact coverage depends on the university award. It may cover tuition, accommodation, a monthly stipend or a stated combination. We show every covered and payable item before you proceed.',
  },
  {
    question: 'When do I pay the EduExpress service charge?',
    answer: 'For the China package, no EduExpress service fee is due before China visa approval. Any university, embassy, medical, translation, courier or deposit fee required earlier is itemised in writing before you proceed. You can also hold your original documents with EduExpress and place a BDT 15,000 deposit, which is deducted from the final package price.',
  },
  {
    question: 'Are university deposits included in the BDT 200,000 package?',
    answer: 'No. University registration, seat or tuition deposits are paid separately when required. They are identified in the written cost schedule before payment.',
  },
  {
    question: 'Can my parents join the counselling session?',
    answer: 'Yes. Parents and sponsors are encouraged to join so costs, payment terms, documents, safety and responsibilities can be explained together.',
  },
  {
    question: 'Does EduExpress guarantee a visa?',
    answer: 'No consultancy controls an embassy decision. EduExpress provides admission and visa-application support under written service and refund terms, but the final decision belongs to the relevant university and authority.',
  },
];

const fallbackGuides = [
  { key: 'guide-china', title: 'Study in China from Bangladesh', excerpt: 'A complete starting guide covering fit, cost, scholarships and student life.', href: '/study-in-china-from-bangladesh', meta: 'Guide', image: null },
  { key: 'guide-cost', title: 'Cost of Studying in China', excerpt: 'Plan tuition, hostel, living, insurance, visa and travel expenses.', href: '/study-in-china-cost-bangladesh', meta: 'Guide', image: null },
  { key: 'guide-scholarships', title: 'China Scholarships Explained', excerpt: 'Compare CSC, university and other scholarship types without vague promises.', href: '/china-scholarships-bangladesh', meta: 'Guide', image: null },
];

function SectionHeading({
  eyebrow,
  title,
  copy,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#1767a0]">{eyebrow}</p>
      <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-.045em] text-[#102a43]">{title}</h2>
      {copy && <p className="mt-4 text-base leading-7 text-slate-600">{copy}</p>}
    </div>
  );
}

export default async function Home() {
  const [trust, guides] = await Promise.all([loadTrustRecords(), loadGuides()]);
  const office = trust.offices.find(item => item.isHeadOffice) ?? trust.offices[0] ?? null;
  const fullPackage = trust.servicePackages.find(item => item.packageType === 'full_scholarship');
  const testimonials = trust.testimonials.slice(0, 6);

  const officeAddress = office?.address ?? `${config.contact.address.street}, ${config.contact.address.city} ${config.contact.address.postalCode}`;
  const officePhone = office?.phonePrimary ?? config.contact.phone;
  const officeHours = office?.hours ?? 'Saturday to Thursday, 11:00 AM to 6:00 PM';
  const packagePrice = fullPackage?.priceLabel ?? 'BDT 200,000';
  const packageItems = fullPackage?.includedItems?.length ? fullPackage.includedItems : [
    'Application fee',
    'Admission Notice',
    'Scholarship assistance',
    'JW202 Form',
    'Visa application support',
    'Embassy fee',
    'Medical checkup in Bangladesh',
    'Pre-departure briefing and travel guidance',
    'One-way air ticket',
    'Airport pickup',
  ];
  const whatsappHref = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Assalamu alaikum. I would like a free profile assessment for studying abroad.')}`;

  const guideCards = guides.length > 0
    ? guides.map(post => ({
        key: post.id,
        title: post.title,
        excerpt: post.excerpt ?? '',
        href: `/updates/${post.slug}`,
        meta: `${post.type === 'article' ? 'Article' : 'Update'} · ${fmtGuideDate(post.publishedAt ?? post.createdAt)}`,
        image: post.featuredImage ?? null,
      }))
    : fallbackGuides;

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
        description: 'Profile assessment, university comparison, cost guidance, admission support, visa preparation and pre-departure support.',
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
    <div className="overflow-x-clip bg-[#fbfcfe] text-[#102a43]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_10%_10%,#e7f5ff_0,transparent_35%),radial-gradient(circle_at_90%_15%,#fff2d8_0,transparent_27%),linear-gradient(180deg,#ffffff_0%,#f7fbfe_100%)] px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-24 lg:pt-40">
        <div className="pointer-events-none absolute -left-24 top-40 size-64 rounded-full border-[45px] border-[#dff1fb]/70" aria-hidden="true" />
        <div className="home-aura pointer-events-none absolute -right-24 top-8 size-[26rem] rounded-full bg-[#b9e0f7]/40 blur-3xl" aria-hidden="true" style={{ animationDelay: '-6s' }} />
        <div className="home-aura pointer-events-none absolute -left-32 bottom-0 size-[22rem] rounded-full bg-[#ffe3ae]/40 blur-3xl" aria-hidden="true" style={{ animationDelay: '-12s' }} />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <span className="home-rise inline-flex items-center gap-2 rounded-full border border-[#1767a0]/15 bg-white px-4 py-2 text-xs font-bold text-[#1767a0] shadow-sm">
              <MapPin size={14} /> Dhanmondi, Dhaka · In-person and online guidance
            </span>
            <h1 className="home-rise mt-6 max-w-[14ch] text-[clamp(2.55rem,5.5vw,5rem)] font-bold leading-[.98] tracking-[-.06em] text-[#102a43]" style={{ animationDelay: '80ms' }}>
              Choose Better Education Abroad — <span className="text-[#1767a0]">with Clear Costs and Written Proof</span>
            </h1>
            <p className="home-rise mt-6 max-w-2xl text-lg leading-8 text-slate-600" style={{ animationDelay: '150ms' }}>
              Explore suitable universities, understand the complete cost and receive personal support from application to departure.
            </p>

            <div className="home-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '220ms' }}>
              <Link href="#assessment" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#f4a024] px-6 text-sm font-extrabold text-[#102a43] shadow-[0_10px_25px_rgba(244,160,36,.25)] transition hover:-translate-y-0.5 hover:bg-[#ffb33f]">
                Get Free Profile Assessment <ArrowRight size={17} />
              </Link>
              <Link href="/study-in-china-from-bangladesh" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-[#1767a0]/20 bg-white px-6 text-sm font-extrabold text-[#1767a0] transition hover:border-[#1767a0] hover:bg-[#eef8fe]">
                Explore Study in China <ArrowUpRight size={17} />
              </Link>
            </div>

            <ul className="home-rise mt-8 grid max-w-2xl gap-3 sm:grid-cols-3" style={{ animationDelay: '290ms' }}>
              {['Real counsellors', 'Written cost breakdown', 'Support to airport pickup'].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                  <CheckCircle2 size={17} className="shrink-0 text-emerald-600" /> {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 grid max-w-xl grid-cols-[1fr_.72fr] gap-3">
              <div className="relative min-h-48 overflow-hidden rounded-2xl">
                <Image src="/images/home/consultation-student-parent.webp" alt="EduExpress counsellor speaking with a student and parent in the Dhanmondi office" fill priority sizes="(max-width:1024px) 65vw, 380px" className="object-cover object-[center_42%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/75 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-4 text-sm font-bold text-white">Discuss your options with a real counsellor</p>
              </div>
              <div className="relative min-h-48 overflow-hidden rounded-2xl">
                <Image src="/images/home/student-departure-support.webp" alt="EduExpress counsellor with a student and luggage at Dhaka airport" fill sizes="(max-width:1024px) 35vw, 220px" className="object-cover object-[center_35%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/75 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-4 text-sm font-bold text-white">Support through departure day</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <HomeAssessment whatsappNumber={config.contact.whatsapp} />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-slate-200 bg-white px-5 py-7 sm:px-8 lg:px-12">
        <Reveal className="mx-auto grid max-w-[1240px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [ShieldCheck, 'No service fee before China visa approval', 'Official third-party fees are itemised in writing'],
            [BadgeCheck, 'Written proof, not vague claims', 'Sensitive numbers stay hidden'],
            [UsersRound, 'Students and parents welcome', 'Join the consultation together'],
            [HeartHandshake, 'Human support throughout', 'Application to departure guidance'],
          ].map(([Icon, title, copy]) => {
            const TrustIcon = Icon as typeof ShieldCheck;
            return (
              <div key={String(title)} className="flex items-start gap-3 rounded-2xl bg-[#f5f9fc] p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#1767a0] shadow-sm"><TrustIcon size={19} /></span>
                <div><strong className="block text-sm font-bold text-[#102a43]">{String(title)}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{String(copy)}</span></div>
              </div>
            );
          })}
        </Reveal>
      </section>

      {/* Information routes */}
      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading
              centered
              eyebrow="Start with the information you need"
              title="Get useful answers before speaking to a consultant"
              copy="Check universities, costs, scholarships and documents at your own pace. When you are ready, we can review the information against your profile."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {informationRoutes.map(({ icon: Icon, title, copy, href, link }, index) => (
              <Reveal key={title} delay={index * 70} className="h-full">
                <Link href={href} className="group flex h-full min-h-64 flex-col rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#1767a0]/40 hover:shadow-[0_18px_45px_rgba(15,55,87,.10)]">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#e9f5fc] text-[#1767a0]"><Icon size={23} /></span>
                  <h3 className="mt-6 text-xl font-bold tracking-[-.03em] text-[#102a43]">{title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#1767a0]">{link} <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* China flagship */}
      <Reveal>
        <section className="bg-[#0d3856] px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#8ed6f7]">China · Our flagship destination</p>
              <h2 className="mt-4 text-[clamp(2.2rem,4.5vw,4rem)] font-bold leading-[1.02] tracking-[-.05em]">A clear China route for students and parents</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/75">
                Compare universities, understand scholarship coverage and know the full financial responsibility before starting an application.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="relative min-h-56 overflow-hidden rounded-2xl">
                  <Image src="/images/proof/egpc-team-conference.webp" alt="EduExpress representatives at an international education conference" fill sizes="(max-width:1024px) 50vw, 280px" className="object-cover" />
                </div>
                <div className="relative min-h-56 overflow-hidden rounded-2xl">
                  <Image src="/images/home/china-campus-life.webp" alt="Bangladeshi and international students together on a university campus in China" fill sizes="(max-width:1024px) 50vw, 280px" className="object-cover" />
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/study-in-china-from-bangladesh" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f4a024] px-5 text-sm font-extrabold text-[#102a43] hover:bg-[#ffb33f]">Explore the China guide <ArrowRight size={16} /></Link>
                <Link href="/china-march-2027-intake" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-bold text-white hover:bg-white/10">March 2027 intake <ArrowUpRight size={16} /></Link>
              </div>
            </div>

            <article className="rounded-[1.75rem] bg-white p-6 text-[#102a43] shadow-[0_25px_70px_rgba(0,0,0,.22)] sm:p-8">
              <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start">
                <div>
                  <span className="inline-flex rounded-full bg-[#e9f5fc] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#1767a0]">China visa-first service package</span>
                  <h3 className="mt-4 text-2xl font-bold tracking-[-.035em]">Application-to-arrival support</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">The scholarship letter defines whether tuition, accommodation, stipend or a combination is covered.</p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Package price</p>
                  <strong className="mt-1 block text-3xl font-extrabold tracking-[-.04em] text-[#1767a0]">{packagePrice}</strong>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {packageItems.map(item => (
                  <p key={item} className="flex gap-2.5 rounded-xl bg-[#f5f9fc] px-3.5 py-3 text-xs font-semibold leading-5 text-slate-700">
                    <Check size={15} className="mt-0.5 shrink-0 text-emerald-600" /> {item}
                  </p>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-extrabold text-[#6d4300]">University deposits are not included.</p>
                <p className="mt-1 text-xs leading-5 text-[#7a5a26]">Registration, seat or tuition deposits charged directly by the university are listed separately in your written cost sheet.</p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-sm font-extrabold text-[#102a43]"><ShieldCheck size={18} className="text-[#1767a0]" /> No service fee before China visa approval</p>
                <Link href="/china-visa-first-policy" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1767a0]">Read payment terms <ArrowRight size={15} /></Link>
              </div>
            </article>
          </div>
        </section>
      </Reveal>

      {/* Proof */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <Reveal className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Real people. Real moments. Real presence."
              title="Trust should be visible, not requested"
              copy="Photographs from EduExpress counselling sessions, team workdays and student departures in Dhaka and abroad. Personal documents and sensitive details are never shown."
            />
            <Link href="/proof-library" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#1767a0]/20 bg-white px-5 text-sm font-extrabold text-[#1767a0] hover:bg-[#eef8fe]">Open proof library <ArrowRight size={16} /></Link>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-[1.1fr_.9fr_.9fr] lg:grid-rows-2">
              <figure className="group relative min-h-[420px] overflow-hidden rounded-[1.5rem] lg:row-span-2">
                <Image src="/images/home/consultation-family.webp" alt="A student and parent meeting an EduExpress counsellor in Dhanmondi" fill sizes="(max-width:1024px) 100vw, 42vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/85 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#8ed6f7]">Guidance in person</span><strong className="mt-2 block text-xl">A student and parent discussing the decision together</strong></figcaption>
              </figure>
              <figure className="group relative min-h-52 overflow-hidden rounded-[1.5rem]">
                <Image src="/images/home/student-departure-support.webp" alt="EduExpress departure support with a student at Dhaka airport" fill sizes="(max-width:1024px) 50vw, 28vw" className="object-cover object-[center_35%] transition duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/80 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm font-bold text-white">Support on departure day</figcaption>
              </figure>
              <figure className="group relative min-h-52 overflow-hidden rounded-[1.5rem]">
                <Image src="/images/home/education-partners-meeting.webp" alt="EduExpress representatives at an international education partners meeting" fill sizes="(max-width:1024px) 50vw, 28vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/80 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm font-bold text-white">International education engagement</figcaption>
              </figure>
              <figure className="group relative min-h-52 overflow-hidden rounded-[1.5rem]">
                <Image src="/images/home/dhanmondi-counselling-team.webp" alt="EduExpress counselling team working in the Dhanmondi office" fill sizes="(max-width:1024px) 50vw, 28vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/80 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm font-bold text-white">The Dhanmondi counselling team</figcaption>
              </figure>
              <figure className="group relative min-h-52 overflow-hidden rounded-[1.5rem]">
                <Image src="/images/home/china-campus-life.webp" alt="Bangladeshi and international students on a university campus in China" fill sizes="(max-width:1024px) 50vw, 28vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/80 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm font-bold text-white">Student life on campus in China</figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials carousel */}
      {testimonials.length > 0 && (
        <section className="border-y border-slate-200 bg-[#f5f9fc] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <Reveal>
              <SectionHeading centered eyebrow="Student experiences" title="Stories from our students" copy="Experiences shared with EduExpress by students we have supported." />
            </Reveal>
            <Reveal delay={80} className="mt-9">
              <Carousel
                label="Student testimonials"
                itemClassName="w-[300px] sm:w-[380px]"
                items={testimonials.map(item => (
                  <figure key={item.id} className="flex h-full flex-col rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-0.5 text-[#f4a024]" aria-label={`${Math.min(5, Math.max(1, item.rating))} out of 5`}>
                      {Array.from({ length: Math.min(5, Math.max(1, item.rating)) }).map((_, star) => (
                        <Star key={star} size={15} className="fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="mt-4 line-clamp-6 text-sm leading-7 text-slate-600">“{item.content}”</blockquote>
                    <figcaption className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-5">
                      {item.consentImageApproved && item.image && <Image src={item.image} alt={item.displayName || item.studentName} width={48} height={48} className="size-12 rounded-full object-cover" />}
                      <div><strong className="block text-sm text-[#102a43]">{item.displayName || item.studentName}</strong><span className="text-xs text-slate-500">{[item.university, item.country].filter(Boolean).join(' · ')}</span></div>
                    </figcaption>
                  </figure>
                ))}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Journey */}
      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading centered eyebrow="How it works" title="Six simple steps from profile to departure" copy="You know the next action, who is responsible and what information you should receive." />
          </Reveal>
          <div className="journey-line mx-auto mt-10 hidden h-1 max-w-[880px] rounded-full lg:block" aria-hidden="true" />
          <ol className="relative mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {journey.map(([number, title, copy], index) => (
              <li key={number}>
                <Reveal delay={index * 60} className="h-full">
                  <div className="relative h-full rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,55,87,.10)]">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[#1767a0] text-sm font-extrabold text-white">{number}</span>
                    <h3 className="mt-5 text-xl font-bold tracking-[-.03em] text-[#102a43]">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center"><Link href="/your-study-journey" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1767a0] px-6 text-sm font-extrabold text-white hover:bg-[#104f7c]">See the complete journey <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      {/* Parents */}
      <Reveal>
        <section className="bg-[#eef8fe] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="mx-auto grid max-w-[1240px] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_60px_rgba(15,55,87,.10)] lg:grid-cols-2">
            <div className="relative min-h-[390px]">
              <Image src="/images/home/parent-counselling.webp" alt="An EduExpress counsellor meeting a student and parent in the Dhanmondi office" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover object-[center_35%]" />
            </div>
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#1767a0]">For parents and sponsors</p>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.1rem)] font-bold leading-[1.06] tracking-[-.045em] text-[#102a43]">You should understand the decision too</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">Join the consultation and ask directly about costs, university recognition, documents, payment security, accommodation and student support.</p>
              <ul className="mt-7 grid gap-3">
                {['Receive the cost breakdown in writing', 'Understand what the scholarship actually covers', 'See payment and refund terms before signing', 'Know who to contact throughout the process'].map(item => (
                  <li key={item} className="flex gap-3 text-sm font-semibold leading-6 text-slate-700"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" /> {item}</li>
                ))}
              </ul>
              <Link href="/for-parents" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1767a0] px-5 text-sm font-extrabold text-white hover:bg-[#104f7c]">Read the parent guide <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Destinations carousel */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <Reveal className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Study destinations" title="China first, with more routes to compare" copy="China carries our deepest experience and evidence. We also support selected destinations across Asia and Europe — each labelled with its current service status." />
            <Link href="/destinations" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#1767a0]/20 px-5 text-sm font-extrabold text-[#1767a0] hover:bg-[#eef8fe]">Explore all destinations <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal delay={80} className="mt-10">
            <Carousel
              label="Study destinations"
              itemClassName="w-[268px] sm:w-[316px]"
              items={destinationCards.map(destination => (
                <Link key={destination.slug} href={destination.href} className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#1767a0]/40 hover:shadow-[0_18px_45px_rgba(15,55,87,.12)]">
                  <div className="relative h-44 w-full overflow-hidden bg-[#0d3856]">
                    {destination.image
                      ? <Image src={destination.image} alt={`Study in ${destination.name} from Bangladesh`} fill sizes="(max-width:640px) 268px, 316px" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                      : <div className="grid h-full place-items-center text-5xl" aria-hidden="true">{destination.flag}</div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/45 via-transparent to-transparent" aria-hidden="true" />
                    <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${destination.status === 'Flagship' ? 'bg-[#f4a024] text-[#102a43]' : 'border border-white/25 bg-[#08263c]/70 text-white backdrop-blur-sm'}`}>{destination.status}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2"><span aria-hidden="true" className="text-lg">{destination.flag}</span><h3 className="text-lg font-bold tracking-[-.02em] text-[#102a43]">{destination.name}</h3></div>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{destination.description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-extrabold text-[#1767a0]">Study guide <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              ))}
            />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-slate-200 bg-[#f5f9fc] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <Reveal>
            <div>
              <SectionHeading eyebrow="Frequently asked questions" title="Clear answers before you decide" copy="If your situation is different, submit the free assessment or ask us directly on WhatsApp." />
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-extrabold text-[#07301a]"><MessageCircle size={18} /> Ask on WhatsApp</a>
            </div>
          </Reveal>
          <div className="grid gap-3">
            {faqs.map((item, index) => (
              <Reveal key={item.question} delay={index * 45}>
                <details className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-[#1767a0]/35 open:shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-bold text-[#102a43]"><span>{item.question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e9f5fc] text-[#1767a0] transition group-open:rotate-45">+</span></summary>
                  <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Guides carousel */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Latest guides and updates" title="Continue your research" copy="New intake news, cost guides and destination updates — written and dated by the EduExpress team." />
            <Link href="/updates" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1767a0]">View all updates <ArrowRight size={15} /></Link>
          </Reveal>
          <Reveal delay={80} className="mt-9">
            <Carousel
              label="Guides and updates"
              itemClassName="w-[280px] sm:w-[340px]"
              items={guideCards.map(guide => (
                <Link key={guide.key} href={guide.href} className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-slate-200 bg-[#fbfcfe] transition hover:-translate-y-1 hover:border-[#1767a0]/40 hover:shadow-lg">
                  <div className="relative h-40 w-full overflow-hidden bg-[#0d3856]">
                    {guide.image
                      ? <Image src={guide.image} alt="" fill sizes="(max-width:640px) 280px, 340px" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                      : <div className="grid h-full place-items-center text-[#8ed6f7]"><BookOpenCheck size={30} /></div>}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[10px] font-extrabold uppercase tracking-[.13em] text-[#1767a0]">{guide.meta}</span>
                    <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-6 tracking-[-.02em] text-[#102a43]">{guide.title}</h3>
                    {guide.excerpt && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{guide.excerpt}</p>}
                    <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-extrabold text-[#1767a0]">Read guide <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              ))}
            />
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <Reveal>
        <section className="px-5 pb-16 sm:px-8 sm:pb-24 lg:px-12">
          <div className="mx-auto grid max-w-[1240px] overflow-hidden rounded-[1.75rem] bg-[#0d3856] text-white lg:grid-cols-[1.15fr_.85fr]">
            <div className="relative p-8 sm:p-12 lg:p-14">
              <PlaneTakeoff className="text-[#8ed6f7]" size={29} />
              <h2 className="mt-5 max-w-xl text-[clamp(2.2rem,4vw,3.7rem)] font-bold leading-[1.04] tracking-[-.05em]">Your next step can be simple</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/75">Share your profile, visit the office or message us on WhatsApp. We will help you understand the most suitable next action.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="#assessment" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f4a024] px-5 text-sm font-extrabold text-[#102a43] hover:bg-[#ffb33f]">Get Free Profile Assessment <ArrowRight size={16} /></Link>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-bold text-white hover:bg-white/10"><MessageCircle size={17} /> WhatsApp EduExpress</a>
              </div>
            </div>
            <address className="m-4 rounded-[1.35rem] bg-white p-7 not-italic text-[#102a43] sm:m-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#1767a0]">Dhanmondi counselling office</p>
              <h3 className="mt-3 text-2xl font-bold tracking-[-.03em]">Visit EduExpress</h3>
              <ul className="mt-6 grid gap-4 text-sm leading-6 text-slate-600">
                <li className="flex gap-3"><MapPin size={18} className="mt-1 shrink-0 text-[#1767a0]" /><span>{officeAddress}</span></li>
                <li className="flex gap-3"><Phone size={18} className="mt-1 shrink-0 text-[#1767a0]" /><a href={`tel:${officePhone.replace(/[^\d+]/g, '')}`} className="font-bold text-[#1767a0] hover:underline">{officePhone}</a></li>
                <li className="flex gap-3"><Clock3 size={18} className="mt-1 shrink-0 text-[#1767a0]" /><span>{officeHours}</span></li>
              </ul>
              <Link href="/contact" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1767a0] px-5 text-sm font-extrabold text-white hover:bg-[#104f7c]">Book an office consultation <ArrowRight size={16} /></Link>
            </address>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
