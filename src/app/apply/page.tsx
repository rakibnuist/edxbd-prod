import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileCheck2, ShieldCheck, Wallet } from 'lucide-react';

import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { CtaBand, JsonLd, PageHero, Section, kit } from '@/components/page/PageKit';
import { pageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site-urls';

const PATH = '/apply';

type SearchParams = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<SearchParams> };

function contextValue(value: string | string[] | undefined, limit = 220) {
  return (Array.isArray(value) ? value[0] : value)?.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, limit) || undefined;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await searchParams;
  return pageMetadata({
    title: 'University Application Support from Bangladesh | EduExpress',
    description:
      'Start your university application with EduExpress. Share your preferred university, program and results for an eligibility and document check.',
    path: PATH,
    image: { url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — university application support' },
    // Pre-filled variants (?university=…) are the same page; keep only the clean URL indexed.
    noindex: Object.keys(query).length > 0,
  });
}

const afterYouSend = [
  { icon: FileCheck2, title: 'Eligibility check', text: 'A counselor reviews your preferred university, program and academic profile, then checks your eligibility.' },
  { icon: ShieldCheck, title: 'Documents in writing', text: 'The document list for your university and program is confirmed in writing before submission, with help preparing the file.' },
  { icon: Wallet, title: 'Costs before you commit', text: 'University, embassy and third-party costs are itemised separately from EduExpress charges, in writing.' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}${PATH}#webpage`,
  url: `${SITE_URL}${PATH}`,
  name: 'Apply with EduExpress International',
  description: 'Request university application support: eligibility, documents and the application process.',
  inLanguage: 'en-BD',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#organization` },
  breadcrumb: { '@id': `${SITE_URL}${PATH}#breadcrumb` },
};

export default async function ApplyPage({ searchParams }: Props) {
  const query = await searchParams;
  const university = contextValue(query.university);
  const program = contextValue(query.program, 300);
  const country = contextValue(query.country, 80);
  const intake = contextValue(query.intake, 80);
  const hasContext = Boolean(university || program || country || intake);

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Universities', path: '/universities' }, { name: 'Apply' }]}
        eyebrow="University applications"
        title="Apply with EduExpress International."
        lead="Share your academic background and study preferences. Our counselors can help you check eligibility, prepare documents and plan your university application."
        actions={
          <>
            <a href="#application-form" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start my application <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link href="/universities" className="ed-btn ed-btn-outline min-h-[52px] px-7">Explore universities</Link>
          </>
        }
        aside={
          hasContext ? (
            <div className={kit.card}>
              <p className={kit.badge}>Your selection</p>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                {university && (
                  <div className="sm:col-span-2">
                    <dt className="text-[14px] font-semibold text-ink-soft">Preferred university</dt>
                    <dd className="mt-1 text-[19px] font-semibold leading-snug text-petrol-800">{university}</dd>
                  </div>
                )}
                {program && (
                  <div>
                    <dt className="text-[14px] font-semibold text-ink-soft">Selected program</dt>
                    <dd className="mt-1 text-[16px] leading-6 text-petrol-800">{program}</dd>
                  </div>
                )}
                {country && (
                  <div>
                    <dt className="text-[14px] font-semibold text-ink-soft">Destination</dt>
                    <dd className="mt-1 text-[16px] leading-6 text-petrol-800">{country}</dd>
                  </div>
                )}
                {intake && (
                  <div>
                    <dt className="text-[14px] font-semibold text-ink-soft">Preferred intake</dt>
                    <dd className="mt-1 text-[16px] leading-6 text-petrol-800">{intake}</dd>
                  </div>
                )}
              </dl>
            </div>
          ) : (
            <figure className="relative overflow-hidden rounded-3xl">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/office/admission-packets.webp"
                  alt="Admission packets from Nanjing University of Information Science and Technology"
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            </figure>
          )
        }
      />

      <Section id="application-form">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div>
            <EducationFitAssessment key={JSON.stringify([university, program, country, intake])} initialContext={{ university, program, country, intake, intent: 'application' }} />
            <p className="mt-5 text-[15px] leading-6 text-ink-soft">
              This form requests application support from EduExpress International. Admission and scholarship decisions are made by
              the university and the relevant awarding body.
            </p>
          </div>

          <aside className="grid gap-5">
            <div className={kit.cardSage}>
              <h2 className={kit.h3}>What happens after you send it</h2>
              <ul className="mt-5 grid gap-5">
                {afterYouSend.map(item => (
                  <li key={item.title} className="flex gap-3.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-petrol-800"><item.icon size={19} aria-hidden="true" /></span>
                    <span>
                      <strong className="block text-[16px] font-semibold text-petrol-800">{item.title}</strong>
                      <span className="mt-0.5 block text-[15px] leading-6 text-ink-soft">{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={kit.cardDark}>
              <h2 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">China payment policy</h2>
              <ul className="mt-3 grid gap-2 text-[16px] leading-6 text-white/85">
                <li className="flex gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> No file opening charge.</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> No EduExpress service fee before China visa approval.</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> Earlier third-party fees are itemised in writing before you proceed.</li>
              </ul>
              <Link href="/fees-and-transparency" className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[16px] font-semibold text-white underline underline-offset-4">
                Fees and transparency <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand
        title="Not sure which university yet?"
        text="Start with the free education fit assessment. A counsellor compares realistic routes, recognition and total costs with you before any application."
      />
    </>
  );
}
