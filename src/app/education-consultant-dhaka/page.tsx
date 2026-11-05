import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CircleDollarSign, Clock, FileCheck2, MapPin, Phone, ShieldCheck, Users } from 'lucide-react';
import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { pageMetadata } from '@/lib/seo';
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

// The Organization / LocalBusiness node (with address and hours) is emitted
// site-wide by the layout; this page only describes itself and the service.
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: 'Education consultant in Dhanmondi, Dhaka',
      inLanguage: 'en-BD',
      about: ORG,
      isPartOf: { '@id': 'https://eduexpressint.com/#website' },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      mainEntity: { '@id': `${PAGE_URL}#service` },
    },
    {
      '@type': 'Service',
      '@id': `${PAGE_URL}#service`,
      name: 'Study abroad education consultancy',
      serviceType: 'Education consultancy',
      description: 'Education fit guidance, university comparison, complete cost planning and application support from the Dhanmondi office.',
      provider: ORG,
      areaServed: { '@type': 'Country', name: 'Bangladesh' },
    },
  ],
};

const steps = [
  { title: 'Check education fit', copy: 'Start with results, subject, budget and career direction.', icon: ShieldCheck, tone: kit.cardSage },
  { title: 'Compare complete costs', copy: 'Separate tuition, living, official and service charges.', icon: CircleDollarSign, tone: kit.cardLime },
  { title: 'Keep written records', copy: 'Understand documents, responsibilities and application actions.', icon: FileCheck2, tone: kit.cardSage },
];

export default async function EducationConsultantDhakaPage() {
  const { offices, metrics } = await getPublicTrustRecords();
  const office = offices[0];
  const phone = office?.phonePrimary ?? config.contact.phone;
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
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start a free fit assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="ed-btn ed-btn-outline min-h-[52px] px-7">
              <Phone size={18} aria-hidden="true" /> Call {formatBangladeshPhone(phone)}
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
                  <li className="flex gap-3"><Clock size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" /><span>{office.hours}</span></li>
                </ul>
                {office.mapUrl && (
                  <a href={office.mapUrl} target="_blank" rel="noopener noreferrer" className={`${kit.link} mt-5 min-h-[44px]`}>
                    Open directions <ArrowRight size={16} aria-hidden="true" />
                  </a>
                )}
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

      <Section>
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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact?audience=parent" className="ed-btn ed-btn-signal min-h-[52px] px-7">Book a conversation <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link href="/for-parents" className="ed-btn ed-btn-outline min-h-[52px] px-7">Guide for parents</Link>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand title="Visit us, or start online." text="Come to the Dhanmondi office during opening hours or start the free assessment now. A counsellor reviews your profile and explains realistic options with the complete cost." />
    </>
  );
}
