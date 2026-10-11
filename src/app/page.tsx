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
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Phone,
  PlaneTakeoff,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import HomeAssessment from '@/components/home/HomeAssessment';
import { config } from '@/lib/config';
import { getPublicTrustRecords } from '@/lib/trust-records';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Education Consultancy in Bangladesh | EduExpress International' },
  description:
    'Study abroad with clear costs, written guidance and personal support. Get a free profile assessment for China and other study destinations from EduExpress International, Dhaka.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Choose Better Education Abroad | EduExpress International',
    description: 'Clear costs, written proof and human guidance from profile assessment to departure.',
    url: '/',
    type: 'website',
    images: [{ url: '/images/home/consultation-family.webp', width: 1280, height: 960, alt: 'Student and parent consultation at the EduExpress Dhanmondi office' }],
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

const otherDestinations = [
  { name: 'Malaysia', image: '/images/destinations/malaysia.jpg', href: '/study-in-malaysia-from-bangladesh' },
  { name: 'United Kingdom', image: '/images/destinations/united-kingdom.jpg', href: '/study-in-uk-from-bangladesh' },
  { name: 'South Korea', image: '/images/destinations/south-korea.jpg', href: '/study-in-south-korea-from-bangladesh' },
  { name: 'Hungary', image: '/images/destinations/hungary.jpg', href: '/study-in-hungary-from-bangladesh' },
  { name: 'Finland', image: '/images/destinations/finland.jpg', href: '/study-in-finland-from-bangladesh' },
];

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
    answer: 'For the China package, the approved policy is No Success, No Service Charge. You can use the documented original-document security route and pay after visa issuance, or deposit BDT 15,000, retain your originals and deduct that deposit from the final package price.',
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

const fallbackPackageItems = [
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
  const trust = await loadTrustRecords();
  const office = trust.offices.find(item => item.isHeadOffice) ?? trust.offices[0] ?? null;
  const fullPackage = trust.servicePackages.find(item => item.packageType === 'full_scholarship');
  const testimonials = trust.testimonials.slice(0, 3);

  const officeAddress = office?.address ?? `${config.contact.address.street}, ${config.contact.address.city} ${config.contact.address.postalCode}`;
  const officePhone = office?.phonePrimary ?? config.contact.phone;
  const officeHours = office?.hours ?? 'Saturday to Thursday, 11:00 AM to 6:00 PM';
  const packagePrice = fullPackage?.priceLabel ?? '2,00,000 BDT';
  const packageItems = fullPackage?.includedItems?.length ? fullPackage.includedItems : fallbackPackageItems;
  const whatsappHref = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Assalamu alaikum. I would like a free profile assessment for studying abroad.')}`;

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
    <main className="overflow-hidden bg-[#fbfcfe] text-[#102a43]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="relative border-b border-slate-200 bg-[radial-gradient(circle_at_10%_10%,#e7f5ff_0,transparent_35%),radial-gradient(circle_at_90%_15%,#fff2d8_0,transparent_27%),linear-gradient(180deg,#ffffff_0%,#f7fbfe_100%)] px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-24 lg:pt-40">
        <div className="absolute -left-24 top-40 size-64 rounded-full border-[45px] border-[#dff1fb]/70" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1767a0]/15 bg-white px-4 py-2 text-xs font-bold text-[#1767a0] shadow-sm">
              <MapPin size={14} /> Dhanmondi, Dhaka · In-person and online guidance
            </span>
            <h1 className="mt-6 max-w-[14ch] text-[clamp(2.55rem,5.5vw,5rem)] font-bold leading-[.98] tracking-[-.06em] text-[#102a43]">
              Choose Better Education Abroad — <span className="text-[#1767a0]">with Clear Costs and Written Proof</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Explore suitable universities, understand the complete cost and receive personal support from application to departure.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#assessment" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#f4a024] px-6 text-sm font-extrabold text-[#102a43] shadow-[0_10px_25px_rgba(244,160,36,.25)] transition hover:-translate-y-0.5 hover:bg-[#ffb33f]">
                Get Free Profile Assessment <ArrowRight size={17} />
              </Link>
              <Link href="/study-in-china-from-bangladesh" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-[#1767a0]/20 bg-white px-6 text-sm font-extrabold text-[#1767a0] transition hover:border-[#1767a0] hover:bg-[#eef8fe]">
                Explore Study in China <ArrowUpRight size={17} />
              </Link>
            </div>

            <ul className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
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
                <Image src="/images/home/student-departure-support.webp" alt="EduExpress counsellor with a student and luggage at Dhaka airport" fill priority sizes="(max-width:1024px) 35vw, 220px" className="object-cover object-[center_35%]" />
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

      <section className="border-b border-slate-200 bg-white px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1240px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [ShieldCheck, 'No Success, No Service Charge', 'Terms provided in writing'],
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
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            centered
            eyebrow="Start with the information you need"
            title="Get useful answers before speaking to a consultant"
            copy="Check universities, costs, scholarships and documents at your own pace. When you are ready, we can review the information against your profile."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {informationRoutes.map(({ icon: Icon, title, copy, href, link }) => (
              <Link key={title} href={href} className="group flex min-h-64 flex-col rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#1767a0]/40 hover:shadow-[0_18px_45px_rgba(15,55,87,.10)]">
                <span className="grid size-12 place-items-center rounded-2xl bg-[#e9f5fc] text-[#1767a0]"><Icon size={23} /></span>
                <h3 className="mt-6 text-xl font-bold tracking-[-.03em] text-[#102a43]">{title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{copy}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#1767a0]">{link} <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                <span className="inline-flex rounded-full bg-[#e9f5fc] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#1767a0]">Full Scholarship Support Package</span>
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
              <p className="flex items-center gap-2 text-sm font-extrabold text-[#102a43]"><ShieldCheck size={18} className="text-[#1767a0]" /> No Success, No Service Charge</p>
              <Link href="/china-visa-first-policy" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1767a0]">Read payment terms <ArrowRight size={15} /></Link>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Real people. Real records. Real presence."
              title="Trust should be visible, not requested"
              copy="These are EduExpress counselling, departure, campus and international-education records—not stock photographs or invented counters. Sensitive information remains redacted."
            />
            <Link href="/proof-library" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#1767a0]/20 bg-white px-5 text-sm font-extrabold text-[#1767a0] hover:bg-[#eef8fe]">Open proof library <ArrowRight size={16} /></Link>
          </div>

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
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="border-y border-slate-200 bg-[#f5f9fc] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <SectionHeading centered eyebrow="Student experiences" title="Stories shared with permission" copy="Every published story uses an approved display name and consented image." />
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {testimonials.map(item => (
                <figure key={item.id} className="rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <blockquote className="text-sm leading-7 text-slate-600">“{item.content}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    {item.image && <Image src={item.image} alt={item.displayName || item.studentName} width={48} height={48} className="size-12 rounded-full object-cover" />}
                    <div><strong className="block text-sm text-[#102a43]">{item.displayName || item.studentName}</strong><span className="text-xs text-slate-500">{[item.university, item.country].filter(Boolean).join(' · ')}</span></div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading centered eyebrow="How it works" title="Six simple steps from profile to departure" copy="You know the next action, who is responsible and what information you should receive." />
          <ol className="relative mt-11 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {journey.map(([number, title, copy]) => (
              <li key={number} className="relative rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-sm">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#1767a0] text-sm font-extrabold text-white">{number}</span>
                <h3 className="mt-5 text-xl font-bold tracking-[-.03em] text-[#102a43]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center"><Link href="/your-study-journey" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1767a0] px-6 text-sm font-extrabold text-white hover:bg-[#104f7c]">See the complete journey <ArrowRight size={16} /></Link></div>
        </div>
      </section>

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

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Study destinations" title="China first, with more routes to compare" copy="China carries our deepest experience and evidence. We also support selected destinations across Asia and Europe." />
            <Link href="/destinations" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#1767a0]/20 px-5 text-sm font-extrabold text-[#1767a0] hover:bg-[#eef8fe]">Explore all destinations <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <Link href="/study-in-china-from-bangladesh" className="group relative min-h-[430px] overflow-hidden rounded-[1.5rem]">
              <Image src="/images/proof/egpc-team-conference.webp" alt="EduExpress representatives meeting international education partners" fill sizes="(max-width:1024px) 100vw, 55vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/95 via-[#102a43]/25 to-transparent" />
              <span className="absolute left-6 top-6 rounded-full bg-[#f4a024] px-3 py-1.5 text-xs font-extrabold text-[#102a43]">Flagship destination</span>
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8ed6f7]">Study in China from Bangladesh</p><h3 className="mt-3 text-3xl font-bold tracking-[-.04em]">Universities, scholarships, costs and visa guidance</h3><span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold">Explore China <ArrowUpRight size={16} /></span></div>
            </Link>
            <div className="grid gap-4 sm:grid-cols-2">
              {otherDestinations.map((destination, index) => (
                <Link key={destination.name} href={destination.href} className={`group relative min-h-[205px] overflow-hidden rounded-[1.5rem] ${index === 4 ? 'sm:col-span-2' : ''}`}>
                  <Image src={destination.image} alt={`Study in ${destination.name} from Bangladesh`} fill sizes={index === 4 ? '(max-width:1024px) 100vw, 45vw' : '(max-width:640px) 100vw, 23vw'} className="object-cover transition duration-500 group-hover:scale-[1.025]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/90 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-white"><strong className="text-lg">{destination.name}</strong><ArrowUpRight size={17} /></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f5f9fc] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <SectionHeading eyebrow="Frequently asked questions" title="Clear answers before you decide" copy="If your situation is different, submit the free assessment or ask us directly on WhatsApp." />
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-extrabold text-[#07301a]"><MessageCircle size={18} /> Ask on WhatsApp</a>
          </div>
          <div className="grid gap-3">
            {faqs.map(item => (
              <details key={item.question} className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-[#1767a0]/35 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-bold text-[#102a43]"><span>{item.question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e9f5fc] text-[#1767a0] transition group-open:rotate-45">+</span></summary>
                <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Useful guides" title="Continue your research" />
            <Link href="/updates" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1767a0]">View all guides <ArrowRight size={15} /></Link>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              [BookOpenCheck, 'Study in China from Bangladesh', 'A complete starting guide covering fit, cost, scholarships and student life.', '/study-in-china-from-bangladesh'],
              [CircleDollarSign, 'Cost of Studying in China', 'Plan tuition, hostel, living, insurance, visa and travel expenses.', '/study-in-china-cost-bangladesh'],
              [Search, 'China Scholarships Explained', 'Compare CSC, university and other scholarship types without vague promises.', '/china-scholarships-bangladesh'],
            ].map(([Icon, title, copy, href]) => {
              const GuideIcon = Icon as typeof BookOpenCheck;
              return (
                <Link key={String(title)} href={String(href)} className="group rounded-[1.4rem] border border-slate-200 bg-[#fbfcfe] p-6 transition hover:-translate-y-1 hover:border-[#1767a0]/40 hover:shadow-lg">
                  <span className="grid size-11 place-items-center rounded-2xl bg-white text-[#1767a0] shadow-sm"><GuideIcon size={21} /></span>
                  <h3 className="mt-6 text-xl font-bold tracking-[-.03em] text-[#102a43]">{String(title)}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{String(copy)}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#1767a0]">Read guide <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

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
              <li className="flex gap-3"><Phone size={18} className="mt-1 shrink-0 text-[#1767a0]" /><a href={`tel:${officePhone.replace(/\s/g, '')}`} className="font-bold text-[#1767a0] hover:underline">{officePhone}</a></li>
              <li className="flex gap-3"><MessageCircle size={18} className="mt-1 shrink-0 text-[#1767a0]" /><span>{officeHours}</span></li>
            </ul>
            <Link href="/contact" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1767a0] px-5 text-sm font-extrabold text-white hover:bg-[#104f7c]">Book an office consultation <ArrowRight size={16} /></Link>
          </address>
        </div>
      </section>
    </main>
  );
}
