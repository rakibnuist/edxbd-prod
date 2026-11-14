import Link from 'next/link';
import { ArrowRight, BadgeCheck, CheckCircle2, CircleSlash, Download, FileSearch, GraduationCap, ReceiptText, Sparkles } from 'lucide-react';

import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { pageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site-urls';
import { getPublicTrustRecords } from '@/lib/trust-records';

const PATH = '/fees-and-transparency';

export const metadata = pageMetadata({
  title: 'Fees, University Costs & Itemised Breakdown | EduExpress',
  description:
    'What EduExpress charges, when you pay and what goes to universities and embassies. No service fee before China visa approval, and every cost in writing.',
  path: PATH,
  image: { url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Itemised cost breakdown' },
});

const policyFacts = [
  { label: 'File opening charge', value: '0', note: 'No fee for opening the China file' },
  { label: 'EduExpress service fee', value: 'After visa', note: 'Subject to the written service agreement' },
  { label: 'Earlier third-party costs', value: 'Written', note: 'Itemised before the student proceeds' },
];

const feeSteps = [
  { icon: GraduationCap, title: '1. Choose a program', text: 'Bachelor, Master, MBBS and other levels keep their own tuition and requirements.', tone: kit.cardSage },
  { icon: Sparkles, title: '2. Select a scholarship', text: 'Available scholarship types change the tuition view and show their conditions.', tone: kit.cardLime },
  { icon: Download, title: '3. Download the PDF', text: 'The official fee schedule PDF carries the selected program, scholarship, recipients and subtotal.', tone: kit.cardSage },
];

const earlierThirdParty = [
  'University application or registration fee',
  'Tuition or seat deposit required by the university',
  'Embassy or visa service charges',
  'Medical examination or insurance',
  'Translation, notarisation and courier',
];

const fiveFacts = ['Item', 'Amount or calculation', 'Recipient', 'Due date', 'Refund status'];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}${PATH}#webpage`,
  name: 'University Costs, Scholarships & Fee Schedules',
  url: `${SITE_URL}${PATH}`,
  description: 'How EduExpress aligns university programs, scholarships and itemized study costs.',
  inLanguage: 'en-BD',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#organization` },
  breadcrumb: { '@id': `${SITE_URL}${PATH}#breadcrumb` },
};

export default async function FeesAndTransparencyPage() {
  const { servicePackages } = await getPublicTrustRecords();
  const chinaPackages = servicePackages.filter(item => item.destination === 'China');

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Fees and transparency' }]}
        eyebrow="Transparent costs confirmed with the university"
        title="Our fees and your study costs, in writing."
        lead="Every university profile keeps programs, scholarship choices, tuition and other first-year costs together, and you can download the selected view as an EduExpress branded PDF. The EduExpress service package is separate from university costs."
        actions={
          <>
            <Link href="/universities" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Choose a university <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/china-visa-first-policy" className="ed-btn ed-btn-outline min-h-[52px] px-7">Read the China payment terms</Link>
          </>
        }
        aside={
          <div className={kit.cardDark}>
            <p className="text-[15px] font-semibold text-white/80">China payment policy</p>
            <dl className="mt-4 grid gap-4">
              {policyFacts.map(fact => (
                <div key={fact.label} className="grid grid-cols-[1fr_auto] gap-x-5 border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                  <dt className="text-[16px] font-semibold text-white">{fact.label}</dt>
                  <dd className="row-span-2 self-center font-display text-[30px] font-black leading-none text-lime">{fact.value}</dd>
                  <dd className="mt-0.5 text-[15px] leading-6 text-white/75">{fact.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <TrustBar />

      <Section
        title="See the cost before you choose."
        intro="The university page is the main cost record. Separate cost pages redirect back to it, so there is one data point in one place."
        action={
          <Link href="/universities" className="ed-btn ed-btn-outline min-h-[52px] px-7">
            Open the university finder <ArrowRight size={18} aria-hidden="true" />
          </Link>
        }
      >
        <ol data-anim="stagger" className="grid gap-5 md:grid-cols-3">
          {feeSteps.map(step => (
            <li key={step.title} className={step.tone}>
              <span className={kit.icon}><step.icon size={22} aria-hidden="true" /></span>
              <h3 className={`mt-6 ${kit.h3}`}>{step.title}</h3>
              <p className="mt-2 text-[16px] leading-7 text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {chinaPackages.map(item => (
        <Section key={item.id} tone="navy">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-14">
            <div>
              <p className="text-[15px] font-semibold capitalize text-white/80">China service costs · {item.packageType.replaceAll('_', ' ')}</p>
              <h2 data-anim="up" className={`mt-4 ${kit.h2OnDark}`}>The service package is separate from university costs.</h2>
              <p className="mt-6 text-[17px] font-semibold text-white">{item.title}</p>
              <p data-anim="pop" className="mt-1 font-display text-[48px] font-black leading-none tracking-[-0.02em] text-lime sm:text-[64px]">{item.priceLabel}</p>
              <p className="mt-5 max-w-xl text-[18px] leading-[1.6] text-white/85">{item.summary}</p>
              {item.outcomeScope && <p className="mt-4 max-w-xl text-[16px] leading-7 text-white/75">{item.outcomeScope}</p>}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/china-visa-first-policy" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                  Open complete package terms <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link href="/study-in-china-cost-bangladesh" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">Tuition and living costs</Link>
              </div>
            </div>

            <div data-anim="up" className="rounded-3xl bg-white p-6 text-petrol-800 sm:p-8">
              {item.includedItems.length > 0 && (
                <>
                  <h3 className={kit.h3}>Included in the package</h3>
                  <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {item.includedItems.map(included => (
                      <li key={included} className="flex gap-2 text-[15px] leading-6">
                        <CheckCircle2 size={18} className="mt-[3px] shrink-0 text-[#2ead4b]" aria-hidden="true" /> {included}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {item.excludedItems.length > 0 && (
                <div className="mt-6 rounded-2xl bg-canvas-soft p-5">
                  <h3 className="text-[17px] font-bold">Paid separately</h3>
                  <ul className="mt-2 grid gap-1.5">
                    {item.excludedItems.map(excluded => (
                      <li key={excluded} className="flex gap-2 text-[15px] leading-6 text-ink-soft">
                        <CircleSlash size={16} className="mt-1 shrink-0 text-ink-mute" aria-hidden="true" /> {excluded}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Section>
      ))}

      <Section
        tone="sage"
        title="When you pay, and what is refundable."
        intro="No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds."
      >
        <div data-anim="stagger" className="grid gap-5 lg:grid-cols-2">
          {chinaPackages.flatMap(item => [
            item.securityOptions.length > 0 && (
              <article key={`${item.id}-security`} className={kit.card}>
                <h3 className={kit.h3}>Payment protection</h3>
                <ul className="mt-4 grid gap-3">
                  {item.securityOptions.map(option => (
                    <li key={option} className="flex gap-3 text-[16px] leading-7 text-ink-soft">
                      <BadgeCheck size={19} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" /> {option}
                    </li>
                  ))}
                </ul>
              </article>
            ),
            item.refundTerms && (
              <article key={`${item.id}-refund`} className={kit.card}>
                <h3 className={kit.h3}>Return and refund terms</h3>
                <p className="mt-4 text-[16px] leading-7 text-ink-soft">{item.refundTerms}</p>
                {item.complianceNote && <p className="mt-4 text-[15px] leading-6 text-ink-soft">{item.complianceNote}</p>}
              </article>
            ),
          ])}
          <article className={kit.cardLime}>
            <h3 className={kit.h3}>Third-party costs that may be due earlier</h3>
            <p className="mt-2 text-[16px] leading-7 text-ink-soft">An external recipient may require payment before the visa decision.</p>
            <ul className="mt-4 grid gap-2">
              {earlierThirdParty.map(cost => (
                <li key={cost} className="flex gap-2 text-[16px] leading-6 text-petrol-800">
                  <ReceiptText size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> {cost}
                </li>
              ))}
            </ul>
          </article>
          <article className={kit.cardOutline}>
            <h3 className={kit.h3}>Every cost needs five facts</h3>
            <p className="mt-2 text-[16px] leading-7 text-ink-soft">Before payment, the cost sheet should state:</p>
            <ol className="mt-4 flex flex-wrap gap-2">
              {fiveFacts.map((fact, index) => (
                <li key={fact} className="inline-flex items-center gap-2 rounded-full bg-canvas-soft px-4 py-2 text-[15px] font-semibold text-petrol-800">
                  <span className="grid size-6 place-items-center rounded-full bg-lime text-[14px] font-black">{index + 1}</span> {fact}
                </li>
              ))}
            </ol>
            <p className="mt-5 text-[15px] leading-6 text-ink-soft">
              A university deposit paid to the institution is not an EduExpress service fee. A medical charge paid to a clinic is not an
              EduExpress service fee. The written cost sheet makes that distinction visible.
            </p>
          </article>
        </div>
      </Section>

      <Section title="How we verify the figures." intro="Fees and scholarships are checked at source, and each record carries the date it was last checked.">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
          <div data-anim="up" className={`flex gap-5 ${kit.cardSage}`}>
            <span className={kit.icon}><FileSearch size={22} aria-hidden="true" /></span>
            <div className={`space-y-4 ${kit.body}`}>
              <p>
                EduExpress records the official institution name, source URL, recognition or accreditation evidence, program details,
                fees, intake status and the date each fact was checked.
              </p>
              <p>
                Tuition, scholarship and ranking entries link to their official source records inside each university profile. Where a
                figure is under verification, the profile says so. We do not publish estimates as facts.
              </p>
            </div>
          </div>
          <ul data-anim="stagger" className="grid gap-3">
            {[
              { label: 'How we verify universities', href: '/how-we-verify-universities' },
              { label: 'Proof library and company records', href: '/proof-library' },
              { label: 'Cost of studying in China', href: '/study-in-china-cost-bangladesh' },
              { label: 'Guidance for parents and sponsors', href: '/for-parents' },
            ].map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex min-h-[60px] items-center justify-between gap-3 rounded-2xl bg-canvas-soft px-5 py-4 text-[16px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale"
                >
                  {link.label}
                  <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand
        title="Get your cost schedule in writing."
        text="Start with a free fit assessment, then receive the relevant payment items and recipients in writing before you commit to anything."
      />
    </>
  );
}
