import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  FileCheck2,
  MapPin,
  Phone,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { ogImage, pageMetadata } from '@/lib/seo';
import { getPublicTrustRecords } from '@/lib/trust-records';
import PaymentRules from '../contact/PaymentRules';

const PATH = '/for-parents';

export const metadata = pageMetadata({
  title: 'Study Abroad Guide for Parents in Bangladesh | EduExpress',
  description:
    'A practical guide for Bangladeshi parents comparing recognition, full study costs, student safety, application proof and visa responsibility.',
  path: PATH,
  image: ogImage('parents', 'An EduExpress counsellor meeting a parent and student'),
});

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://eduexpressint.com/for-parents#webpage',
  url: 'https://eduexpressint.com/for-parents',
  name: 'Study abroad guide for parents in Bangladesh',
  inLanguage: 'en-BD',
  audience: { '@type': 'Audience', audienceType: 'Parents of students planning to study abroad' },
  about: { '@id': 'https://eduexpressint.com/#organization' },
  isPartOf: { '@id': 'https://eduexpressint.com/#website' },
  breadcrumb: { '@id': 'https://eduexpressint.com/for-parents#breadcrumb' },
};

const parentChecks = [
  { title: 'Is the education recognized?', copy: 'We check the institution, selected program and the student’s intended career route.', icon: ShieldCheck, href: '/how-we-verify-universities', cta: 'How we verify universities' },
  { title: 'What will the family really pay?', copy: 'Tuition, living costs, official fees and EduExpress charges are separated in writing.', icon: CircleDollarSign, href: '/fees-and-transparency', cta: 'See the fee policy' },
  { title: 'How do we remit tuition legally?', copy: 'We guide guardians through opening an Authorized Dealer Student File with Bangladesh Bank TM Form and tax compliance.', icon: CircleDollarSign, href: '/study-in-china-cost-bangladesh', cta: 'Student File & remittance steps' },
  { title: 'Who is responsible for each step?', copy: 'Documents, deadlines, payments and application actions should have a named owner.', icon: FileCheck2, href: '/services', cta: 'See what we put in writing' },
  { title: 'Who can the family speak to?', copy: 'Parents can talk directly with the counseling desk in Dhanmondi before a student proceeds.', icon: UserRoundCheck, href: '/contact', cta: 'Contact the desk' },
];

const bringList = ['Latest academic results (SSC, HSC, or Bachelor marksheets)', 'Preferred subject or career area', 'Family budget range in BDT/CNY', 'Guardian/sponsor E-TIN or bank record questions', 'Questions about recognition, safety, or hostel living'];

// Answers restate commitments already published on the homepage, fee and journey pages.
const faqs = [
  {
    question: 'Can parents join the counselling session?',
    answer: 'Yes. Parents and sponsors are encouraged to join so costs, payment terms, documents, safety and responsibilities can be explained together.',
  },
  {
    question: 'How do parents legally pay university tuition and living expenses from Bangladesh?',
    answer:
      'Tuition and living expenses must be remitted legally through an Authorized Dealer (AD) bank branch in Bangladesh by opening a dedicated Student File under Bangladesh Bank foreign exchange rules (FE Circular No. 37). EduExpress assists with the university demand note, JW202/201 admission papers, and itemized cost breakdown so your bank approves the transfer without friction.',
  },
  {
    question: 'When does our family pay the EduExpress service charge?',
    answer:
      'For the China package, no EduExpress service fee is due before China visa approval. Any university, embassy, medical, translation, courier or deposit fee required earlier is itemised in writing before you proceed.',
  },
  {
    question: 'Are university deposits included in the package?',
    answer: 'No. University registration, seat or tuition deposits are paid separately when required. They are identified in the written cost schedule before payment.',
  },
  {
    question: 'Does EduExpress guarantee admission, a scholarship or a visa?',
    answer:
      'No. Universities decide admission and scholarships, and the relevant authority decides the visa. EduExpress provides admission and visa-application support under written service and refund terms, but cannot replace an official decision.',
  },
  {
    question: 'Do we need to choose a university before the first conversation?',
    answer: 'No university choice is required before the conversation. Bring the latest academic results, the preferred subject or career area and a family budget range.',
  },
];

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();

export default async function ParentsPage() {
  const { team, offices } = await getPublicTrustRecords();
  const counselors = team.filter(member => /Counselor|Founder/.test(member.role)).slice(0, 3);
  const office = offices[0];
  const phone = office?.phonePrimary ?? config.contact.phone;

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'For parents' }]}
        eyebrow="A parent-friendly decision guide"
        title="Help your child choose with facts, not pressure."
        lead="Check recognition, complete cost and responsibility before your family commits. Parents can speak directly with our counselling desk in Dhanmondi."
        actions={
          <>
            <Link href="/contact?audience=parent" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Book a parent conversation <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="ed-btn ed-btn-outline min-h-[52px] px-7">
              <Phone size={18} aria-hidden="true" /> Call {formatBangladeshPhone(phone)}
            </a>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src="/images/home/parent-counselling.webp"
                alt="An EduExpress counsellor meeting a parent and student"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover object-[center_40%]"
              />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
              Parents are welcome to join
            </figcaption>
          </figure>
        }
      />

      <TrustBar />

      <Section title="Four questions every family should answer first." intro="Before choosing a country or a university, make sure each of these has a clear answer in writing.">
        <ul data-anim="stagger" className="grid gap-5 md:grid-cols-2">
          {parentChecks.map(({ title, copy, icon: Icon, href, cta }, index) => (
            <li key={title}>
              <Link href={href} className={`${index === 1 ? kit.cardLime : kit.cardSage} group flex h-full gap-5 transition hover:-translate-y-1`}>
                <span className={kit.icon}><Icon size={22} aria-hidden="true" /></span>
                <div className="flex flex-col">
                  <h3 className={kit.h3}>{title}</h3>
                  <p className="mt-2 text-[16px] leading-7 text-ink-soft">{copy}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[16px] font-semibold text-petrol-800">
                    {cta} <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <PaymentRules title="What your family pays, and when." intro="Three rules to hold us to before any money changes hands." />

      <Section tone="sage" title="Visit together in Dhanmondi." intro={<>No university choice is required before the conversation. You can read the <Link href="/your-study-journey" className="font-semibold text-petrol-800 underline underline-offset-4">seven-stage study journey</Link> first.</>}>
        <div data-anim="stagger" className="grid gap-5 lg:grid-cols-2">
          <article className={kit.card}>
            <h3 className={kit.h3}>Bring these to the conversation</h3>
            <ul className="mt-5 space-y-3.5">
              {bringList.map(item => (
                <li key={item} className="flex items-start gap-3 text-[16px] leading-6 text-ink-soft">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          {office && (
            <article className={`${kit.card} flex flex-col`}>
              <h3 className={kit.h3}>{office.name}</h3>
              <ul className="mt-5 space-y-3.5 text-[16px] leading-6 text-ink-soft">
                <li className="flex gap-3"><MapPin size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" /><span>{office.address}</span></li>
                <li className="flex gap-3"><Clock size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" /><span>{office.hours}</span></li>
                <li className="flex gap-3"><Phone size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" /><a href={`tel:${office.phonePrimary}`} className="font-semibold text-petrol-800 hover:underline">{formatBangladeshPhone(office.phonePrimary)}</a></li>
              </ul>
              <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                <Link href="/contact" className="ed-btn ed-btn-soft min-h-[48px] px-6">Office details <ArrowRight size={16} aria-hidden="true" /></Link>
                {office.mapUrl && (
                  <a href={office.mapUrl} target="_blank" rel="noopener noreferrer" className={`${kit.link} min-h-[48px]`}>Open in Google Maps</a>
                )}
              </div>
            </article>
          )}
        </div>
      </Section>

      {counselors.length > 0 && (
        <Section
          title="The counselling team welcomes parents."
          action={<Link href="/about#team" className="ed-btn ed-btn-outline min-h-[48px] px-6">Meet the team <ArrowRight size={16} aria-hidden="true" /></Link>}
        >
          <ul data-anim="stagger" className="grid gap-5 md:grid-cols-3">
            {counselors.map(member => (
              <li key={member.name} className={`${kit.cardSage} flex items-center gap-4`}>
                {member.photoUrl ? (
                  <Image src={member.photoUrl} alt={member.name} width={64} height={64} className="size-16 rounded-full object-cover" />
                ) : (
                  <span className="grid size-16 shrink-0 place-items-center rounded-full bg-petrol-800 font-display text-[20px] font-black text-lime" aria-hidden="true">{initials(member.name)}</span>
                )}
                <div>
                  <h3 className="text-[18px] font-semibold text-petrol-800">{member.name}</h3>
                  <p className="mt-0.5 text-[15px] text-ink-soft">{member.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <FaqBlock items={faqs} title="Questions parents ask us." tone={counselors.length > 0 ? 'sage' : 'white'} />

      <CtaBand title="Talk it through as a family." text="Tell us your child’s results, budget and preferred country. A counsellor explains realistic options, the complete cost and the documents to prepare, with parents in the conversation." />
    </>
  );
}
