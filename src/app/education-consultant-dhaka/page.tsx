import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CircleDollarSign, Clock, FileCheck2, MapPin, MessageCircle, Phone, ShieldCheck, Users } from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import DhanmondiMapCard from '@/components/office/DhanmondiMapCard';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { initials, teamMembers } from '@/data/teamMembers';
import { config } from '@/lib/config';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import { pageMetadata } from '@/lib/seo';
import { toSafeSitePathOrUrl } from '@/lib/safe-url';
import { getPublicTrustRecords } from '@/lib/trust-records';
import PaymentRules from '../contact/PaymentRules';

const PATH = '/education-consultant-dhaka';
const PAGE_URL = `https://eduexpressint.com${PATH}`;
const ORG = { '@id': 'https://eduexpressint.com/#organization' };

export const metadata = pageMetadata({
  title: 'Education Consultant in Dhanmondi, Dhaka | EduExpress',
  description:
    'Visit EduExpress in Dhanmondi, Dhaka for education fit guidance, university comparison, complete cost planning and application support. Parents welcome.',
  path: PATH,
});

// The Organization / LocalBusiness node (with address, geo, hasMap, and hours) is emitted
// site-wide by the layout; this page only describes itself and the local service.
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      mainEntityOfPage: PAGE_URL,
      name: 'Education consultant in Dhanmondi, Dhaka',
      description:
        'Visit EduExpress International Bangladesh in Dhanmondi, Dhaka for education fit guidance, university comparison, complete cost planning and application support.',
      inLanguage: 'en-BD',
      dateModified: '2026-11-15',
      about: ORG,
      publisher: ORG,
      reviewedBy: ORG,
      isPartOf: { '@id': 'https://eduexpressint.com/#website' },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      mainEntity: { '@id': `${PAGE_URL}#service` },
      primaryImageOfPage: { '@type': 'ImageObject', url: 'https://eduexpressint.com/images/office/dhanmondi-desk.webp' },
    },
    {
      '@type': 'Service',
      '@id': `${PAGE_URL}#service`,
      name: 'Study abroad education consultancy in Dhanmondi, Dhaka',
      url: PAGE_URL,
      serviceType: 'Education consultancy',
      description: 'Education fit guidance, university comparison, complete cost planning and application support from the Dhanmondi, Dhaka office.',
      provider: ORG,
      areaServed: [
        { '@type': 'City', name: 'Dhaka' },
        { '@type': 'Country', name: 'Bangladesh' },
      ],
    },
  ],
};

const steps = [
  { title: 'Check education fit', copy: 'Start with results, subject, budget and career direction.', icon: ShieldCheck, tone: kit.cardSage },
  { title: 'Compare complete costs', copy: 'Separate tuition, living, official and service charges.', icon: CircleDollarSign, tone: kit.cardLime },
  { title: 'Keep written records', copy: 'Understand documents, responsibilities and application actions.', icon: FileCheck2, tone: kit.cardSage },
];

const officePhotos = [
  {
    src: '/images/office/dhanmondi-reception.webp',
    alt: 'Reception area at EduExpress International Dhanmondi office in Dhaka',
    caption: 'Dhanmondi Road 4/A Reception',
  },
  {
    src: '/images/office/counselor-office.webp',
    alt: 'One-on-one study abroad counseling room at EduExpress Dhanmondi',
    caption: 'Counseling & ClearCost Review',
  },
  {
    src: '/images/office/dhanmondi-brandwall.webp',
    alt: 'EduExpress International office interior and wall signage in Dhanmondi, Dhaka',
    caption: 'Evergreen Latif · Ground Floor',
  },
] as const;

const dhakaOfficeFaqs = [
  {
    question: 'Where is the EduExpress International office in Dhaka and what are the opening hours?',
    answer: `Our sole office and decision desk is at ${DEFAULT_OFFICE_RECORD.address}. We are open ${DEFAULT_OFFICE_RECORD.hours} (closed Friday). Appointments and walk-ins can call ${formatBangladeshPhone(DEFAULT_OFFICE_RECORD.phonePrimary)}.`,
  },
  {
    question: 'Is EduExpress International affiliated with any UK agency named EduExpress Ltd.?',
    answer: 'No. EduExpress International (eduexpressint.com), established in 2018 in Dhanmondi, Dhaka, Bangladesh, is an independent Bangladeshi study-abroad consultancy and is not affiliated with any UK company sharing the word EduExpress.',
  },
  {
    question: 'What is the EduExpress fee policy for China and Malaysia applications?',
    answer: 'For China, EduExpress charges BDT 0 for file opening and BDT 0 EduExpress service fee before China student visa approval (the post-visa Complete China Support Package is BDT 2,00,000). For Malaysia, EduExpress charges BDT 0 service fee. University, embassy, medical, translation, and courier fees are always itemized in writing in advance.',
  },
  {
    question: 'Can parents join the counselling session at the Dhanmondi office?',
    answer: 'Yes. Parents and family guardians are encouraged to attend either in person at our Dhanmondi office or by phone/video so academic fit, recognition (such as MoE/BMDC for MBBS), and first-year costs are reviewed transparently together.',
  },
  {
    question: 'Do you charge anything for the first in-person consultation at Dhanmondi Road 4/A?',
    answer: 'No. Your first profile assessment and written cost comparison at our Dhanmondi office—whether for China, Malaysia, the UK, Hungary, South Korea, Finland, or other active destinations—is completely free with zero obligation.',
  },
];

export default async function EducationConsultantDhakaPage() {
  const { offices, metrics } = await getPublicTrustRecords();
  const office = offices[0];
  const phone = office?.phonePrimary ?? config.contact.phone;
  const whatsappDigits = (office?.phonePrimary ?? config.contact.whatsapp).replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    'Assalamu alaikum. I would like to book an in-person or phone study abroad counselling session at the Dhanmondi office.',
  )}`;
  const records = metrics.slice(0, 3);

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Education consultant in Dhaka' }]}
        eyebrow="Since 2018 · Dhanmondi, Dhaka"
        title="Education consultant in Dhanmondi, Dhaka."
        lead="Compare overseas education options, recognition, scholarship conditions and complete costs with a counsellor at our Dhanmondi office."
        reviewed="November 2026"
        actions={
          <>
            <a href="#book-consultation" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Book office or free fit assessment <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="ed-btn ed-btn-outline min-h-[52px] px-7">
              <Phone size={18} aria-hidden="true" /> Call {formatBangladeshPhone(phone)}
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp office desk
            </a>
          </>
        }
        aside={
          <article className="overflow-hidden rounded-3xl bg-white">
            <div className="relative aspect-[16/10]">
              <Image
                src="/images/office/dhanmondi-desk.webp"
                alt="Counselling desk at the EduExpress office in Dhanmondi, Dhaka"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover object-[center_40%]"
              />
            </div>
            {office && (
              <div className="p-6 sm:p-7">
                <h2 className="text-[22px] font-semibold leading-snug tracking-[-0.02em] text-petrol-800">{office.name}</h2>
                <ul className="mt-4 space-y-3 text-[16px] leading-6 text-ink-soft">
                  <li className="flex gap-3"><MapPin size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" /><span>{office.address}</span></li>
                  <li className="flex gap-3"><Phone size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" /><span>{[office.phonePrimary, office.phoneSecondary].filter((value): value is string => Boolean(value)).map(formatBangladeshPhone).join(' / ')}</span></li>
                  <li className="flex gap-3"><Clock size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" /><span>{office.hours}</span></li>
                </ul>
                {(() => {
                  const safeMapUrl = toSafeSitePathOrUrl(office.mapUrl);
                  return safeMapUrl ? (
                    <a href={safeMapUrl} target="_blank" rel="noopener noreferrer" className={`${kit.link} mt-5 min-h-[44px]`}>
                      Open directions <ArrowRight size={16} aria-hidden="true" />
                    </a>
                  ) : null;
                })()}
              </div>
            )}
          </article>
        }
      />

      <TrustBar />

      <Section title="What happens at the decision desk." intro="The first conversation is for understanding your profile and questions, then comparing realistic options with their complete cost.">
        <ol data-anim="stagger" className="grid gap-5 md:grid-cols-3">
          {steps.map(({ title, copy, icon: Icon, tone }, index) => (
            <li key={title} className={tone}>
              <div className="flex items-center justify-between">
                <span className={kit.icon}><Icon size={22} aria-hidden="true" /></span>
                <span className="font-display text-[28px] font-black leading-none text-petrol-800/25" aria-hidden="true">0{index + 1}</span>
              </div>
              <h3 className={`mt-6 ${kit.h3}`}>{title}</h3>
              <p className="mt-2 text-[16px] leading-7 text-ink-soft">{copy}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/bangladesh-study-abroad-market" className="ed-btn ed-btn-outline min-h-[46px] px-5 text-[15px]">Bangladesh Market 2027 Report</Link>
          <Link href="/study-in-china-from-bangladesh" className="ed-btn ed-btn-outline min-h-[46px] px-5 text-[15px]">Study in China hub</Link>
          <Link href="/china-study-report-bangladesh" className="ed-btn ed-btn-outline min-h-[46px] px-5 text-[15px]">China data &amp; cost report</Link>
          <Link href="/study-in-malaysia-from-bangladesh" className="ed-btn ed-btn-outline min-h-[46px] px-5 text-[15px]">Study in Malaysia (BDT 0 fee)</Link>
          <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-[46px] px-5 text-[15px]">Fees &amp; transparency</Link>
          <Link href="/how-we-verify-universities" className="ed-btn ed-btn-outline min-h-[46px] px-5 text-[15px]">How we verify universities</Link>
          <Link href="/china-visa-first-policy" className="ed-btn ed-btn-outline min-h-[46px] px-5 text-[15px]">China visa-first policy</Link>
          <Link href="/success-stories" className="ed-btn ed-btn-outline min-h-[46px] px-5 text-[15px]">Student stories</Link>
          <Link href="/b2b" className="ed-btn ed-btn-outline min-h-[46px] px-5 text-[15px]">B2B Partner Desk</Link>
        </div>
      </Section>

      {/* Embedded Map + Office Photos */}
      <Section
        id="dhaka-office-map"
        tone="sage"
        title="Visit our Dhanmondi office & Google Maps pin."
        intro="Walk in Saturday to Thursday, 11:00 AM to 6:00 PM at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209."
      >
        <DhanmondiMapCard office={office} />

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {officePhotos.map((photo) => (
            <figure key={photo.src} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width:768px) 100vw, 380px"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-5 py-3.5 text-[14px] font-semibold text-petrol-800">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Named Dhanmondi Counselling & Application Processing Team */}
      <Section
        id="dhanmondi-team"
        tone="white"
        title="Meet your Dhanmondi counselling & processing team."
        intro="Every student file has a named counselor and application processing specialist—you always know who handles your university applications and proof records."
      >
        <div data-anim="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article key={member.name} className={kit.cardSage}>
              <div className="flex items-center gap-3.5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-petrol-800 font-display text-[17px] font-black text-lime">
                  {initials(member.name)}
                </span>
                <div>
                  <h3 className="text-[18px] font-semibold leading-snug text-petrol-800">{member.name}</h3>
                  <p className="text-[14px] font-medium text-lime-deep">{member.role}</p>
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-6 text-ink-soft">{member.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {member.specialties.map((item) => (
                  <span key={item} className="rounded-full bg-white px-3 py-1 text-[12.5px] font-semibold text-petrol-800">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {records.length > 0 && (
        <Section
          tone="sage"
          title="Company records with a definition."
          intro="Each figure is published with what it counts and where it comes from, so you can judge it for yourself."
          action={<Link href="/proof-library" className="ed-btn ed-btn-outline min-h-[48px] px-6">Open the proof library <ArrowRight size={16} aria-hidden="true" /></Link>}
        >
          <ul data-anim="stagger" className="grid gap-5 md:grid-cols-3">
            {records.map(metric => (
              <li key={metric.id} className={kit.card}>
                <p className="font-display text-[48px] font-black leading-none text-petrol-800">{metric.value}</p>
                <h3 className={`mt-4 ${kit.h3}`}>{metric.label}</h3>
                <p className="mt-2 text-[15px] leading-6 text-ink-soft">{metric.definition}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <PaymentRules title="Clear rules before any payment." intro="The China visa-first rule, written costs and our no-guarantee policy, in plain words." />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <figure data-anim="up" className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/home/parent-counselling.webp"
                alt="An EduExpress counsellor meeting a parent and student"
                fill
                sizes="(max-width:1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </figure>
          <div>
            <p className={kit.badge}><Users size={15} aria-hidden="true" /> For families</p>
            <h2 className={`mt-5 ${kit.h2}`}>Parents can join the conversation.</h2>
            <p className={`mt-5 ${kit.lead}`}>Bring academic results, subject direction and a realistic family budget. Costs, documents and responsibilities are explained to the whole family together.</p>
            <div lang="bn" className="mt-5 rounded-2xl bg-canvas-soft p-4 text-[15px] leading-7 text-petrol-800">
              <strong>অভিভাবকদের জন্য:</strong> শনি–বৃহস্পতিবার সকাল ১১টা থেকে সন্ধ্যা ৬টা পর্যন্ত আমাদের ধানমন্ডি অফিসে (বাড়ি ১২/১, রোড ৪/এ, এভারগ্রিন লতিফ, নিচতলা) এসে সরাসরি লিখিত খরচ ও বিশ্ববিদ্যালয় যাচাই করতে পারবেন।{' '}
              <Link href="/bn/bangladesh-study-abroad-market" hrefLang="bn" className="font-semibold underline underline-offset-4">
                বাংলা মার্কেট গাইড পড়ুন
              </Link>
              ।
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact?audience=parent" className="ed-btn ed-btn-signal min-h-[52px] px-7">Book a conversation <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link href="/study-in-china-agency-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">China agency checklist</Link>
              <Link href="/for-parents" className="ed-btn ed-btn-outline min-h-[52px] px-7">Guide for parents</Link>
            </div>
          </div>
        </div>
      </Section>

      <FaqBlock items={dhakaOfficeFaqs} title="Visiting our Dhanmondi, Dhaka office." tone="sage" />

      <Section
        id="book-consultation"
        tone="white"
        title="Book your Dhanmondi consultation or free assessment."
        intro="Share your academic results, target destination, and budget below. Our Dhanmondi team responds within one working day to schedule an office meeting or phone review."
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-petrol-800/10 bg-canvas-soft p-6 shadow-sm sm:p-10">
          <EducationFitAssessment />
        </div>
      </Section>

      <CtaBand
        title="Visit us, or start online."
        text="Come to the Dhanmondi office during opening hours or start the free assessment now. A counsellor reviews your profile and explains realistic options with the complete cost."
        assessmentHref="#book-consultation"
      />
    </>
  );
}
