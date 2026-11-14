import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, FileCheck2, GraduationCap, ShieldCheck, Wallet } from 'lucide-react';
import TeamSection from '@/components/about/TeamSection';
import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { countries } from '@/lib/countries';
import { ogImage, pageMetadata } from '@/lib/seo';
import { getPublicTrustRecords } from '@/lib/trust-records';

const PATH = '/about';

export const metadata = pageMetadata({
  title: 'About EduExpress International | Since 2018, Dhaka',
  description:
    'Meet EduExpress, an evidence-first study abroad consultancy in Dhanmondi, Dhaka since 2018: our story, team, China expertise and how we put every cost in writing.',
  path: PATH,
  image: ogImage('about', 'The EduExpress counselling team at the Dhanmondi office in Dhaka'),
});

const timeline = [
  { year: '2018', title: 'Journey began', text: 'Abdullah Al Rakib entered the Chinese international-education and student-admission sector on 8 March 2018.' },
  { year: '2019', title: 'China entity formed', text: 'Wuxi Haiying Culture and Art Consulting Co., Ltd. was established in China.' },
  { year: '2019', title: 'Regional partners', text: 'Partner offices and cooperation were developed in Thailand and Vietnam.' },
  { year: 'Pre-COVID', title: 'University cooperation', text: 'Formal recruitment relationships were established, including a student-recruitment agreement with Linyi University.' },
  { year: 'COVID', title: 'Operations paused', text: 'International operations were temporarily suspended during the pandemic.' },
  { year: '2023', title: 'Bangladesh relaunch', text: 'EduExpress resumed operations in Dhaka from RK Tower, Banglamotor.' },
  { year: 'Today', title: 'Dhanmondi office', text: 'Evergreen Latif, House 12/1, Road 4/A, Ground Floor, Dhanmondi, Dhaka 1209.' },
];

const services = [
  { icon: GraduationCap, title: 'Education fit assessment', text: 'We compare education quality, entry requirements, recognition and the total cost before recommending any option.', tone: kit.cardSage },
  { icon: Wallet, title: 'Itemised cost schedule', text: 'Tuition, hostel, deposits, embassy, medical and courier costs itemised separately from EduExpress service charges.', tone: kit.cardLime },
  { icon: FileCheck2, title: 'Application proof pack', text: 'Submission references, receipts, offer letters and deadlines recorded for every student, so nothing depends on memory.', tone: kit.cardSage },
  { icon: ShieldCheck, title: 'Visa readiness record', text: 'Document checklists, missing items, official embassy guidance and who is responsible for each step, in writing.', tone: kit.cardDark },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://eduexpressint.com/about#aboutpage',
  url: 'https://eduexpressint.com/about',
  name: 'About EduExpress International',
  description: 'Evidence-first study abroad consultancy in Dhanmondi, Dhaka since 2018.',
  inLanguage: 'en-BD',
  about: { '@id': 'https://eduexpressint.com/#organization' },
  isPartOf: { '@id': 'https://eduexpressint.com/#website' },
  breadcrumb: { '@id': 'https://eduexpressint.com/about#breadcrumb' },
};

export default async function About() {
  const { team } = await getPublicTrustRecords();
  const destinationCount = countries.filter(country => country.isActive).length;

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'About us' }]}
        eyebrow="Since 2018 · Dhanmondi, Dhaka"
        title="About EduExpress International."
        lead="Bangladesh's evidence-first study abroad consultancy. We compare education quality, cost, recognition and career fit before recommending any route, and we put every cost in writing."
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get my free assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-[52px] px-7">How we handle fees</Link>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/home/dhanmondi-counselling-team.webp"
                alt="The EduExpress counselling team at the Dhanmondi office in Dhaka"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
              Our counselling team, Dhanmondi
            </figcaption>
          </figure>
        }
      />

      <TrustBar />

      <Section
        title="Our story."
        intro={`From Chinese university admissions in 2018 to a Dhanmondi office serving students across ${destinationCount} destinations today.`}
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div data-anim="up" className={`space-y-5 ${kit.body} text-[17px] leading-8`}>
            <p>
              EduExpress International&apos;s journey began on 8 March 2018 through Founder and CEO Abdullah Al Rakib&apos;s work in Chinese
              higher education. In 2019 he established Wuxi Haiying Culture and Art Consulting Co., Ltd. in China and developed
              institutional cooperation with Chinese universities, including a formal student-recruitment agreement with Linyi University.
            </p>
            <p>
              Regional partner operations followed in Thailand and Vietnam. After a pause during COVID-19, EduExpress relaunched its
              Bangladesh operation in 2023 and now works from Dhanmondi 4/A, Dhaka, serving students and education agency partners
              under strict transparency standards.
            </p>
            <Link href="/proof-library" className={kit.link}>See our published records <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>

          <ol data-anim="stagger" className="relative space-y-4 border-l-2 border-dashed border-petrol-800/25 pl-7">
            {timeline.map(item => (
              <li key={`${item.year}-${item.title}`} className="relative">
                <span className="absolute -left-[37px] top-5 size-4 rounded-full bg-lime ring-4 ring-white" aria-hidden="true" />
                <div className={kit.cardSage}>
                  <p className="font-display text-[22px] font-black leading-none text-petrol-800">{item.year}</p>
                  <h3 className={`mt-2 ${kit.h3}`}>{item.title}</h3>
                  <p className="mt-1 text-[15px] leading-6 text-ink-soft">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="navy" title="Bangladesh's China admission and scholarship specialist.">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <p className="text-[18px] leading-[1.6] text-white/85">
            With experience dating back to 2018, university agent portals and direct institutional relationships, EduExpress supports
            Chinese university admission, scholarships, documentation and student visa preparation under our visa-first payment policy.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/study-in-china-from-bangladesh" className="ed-btn ed-btn-signal min-h-[52px] px-7">Study in China guide</Link>
            <Link href="/china-visa-first-policy" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">Visa-first policy</Link>
          </div>
        </div>
      </Section>

      <TeamSection team={team} />

      <Section tone="sage" title="What we do for every student.">
        <div data-anim="stagger" className="grid gap-5 sm:grid-cols-2">
          {services.map(item => (
            <article key={item.title} className={item.tone}>
              <span className={item.tone === kit.cardDark ? kit.iconLime : kit.icon}><item.icon size={22} aria-hidden="true" /></span>
              <h3 className={`mt-6 ${item.tone === kit.cardDark ? 'text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime' : kit.h3}`}>{item.title}</h3>
              <p className={`mt-2 text-[16px] leading-7 ${item.tone === kit.cardDark ? 'text-white/80' : 'text-ink-soft'}`}>{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <CtaBand title="Ready to compare your options?" text="Visit our Dhanmondi office or start the free assessment online. A counsellor replies within one working day with a written summary of suitable routes." />
    </>
  );
}
