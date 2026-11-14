import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, ExternalLink, ShieldCheck } from 'lucide-react';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import type { ChinaGuidePage as ChinaGuidePageData, ChinaGuideSection } from '@/data/chinaGuidePages';
import research from '@/data/chinaStudyResearch.json';
import scholarshipResearch from '../../../data/research/china-scholarship-guide.json';
import { getPublicTrustRecords } from '@/lib/trust-records';

const SITE = 'https://eduexpressint.com';
const applyHref = '/apply?country=China';
const topics = [
  { label: 'Admission requirements', href: '/china-admission-requirements' },
  { label: 'Scholarships', href: '/china-scholarships-bangladesh' },
  { label: 'Costs & budget', href: '/study-in-china-cost-bangladesh' },
  { label: 'Student visa', href: '/china-student-visa-bangladesh' },
  { label: 'English & IELTS', href: '/study-in-china-without-ielts' },
  { label: 'Life in China', href: '/life-in-china-bangladeshi-students' },
];
const visaFirstTerms = 'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';

/**
 * Check dates recorded in the research library, keyed by source URL. Only
 * sources the research actually checked get a date; anything else (for
 * example a catalogue that could not be retrieved) is listed without one.
 */
const sourceRecords = new Map<string, { title?: string; checkedAt: string }>([
  ...research.sources.map(source => [source.url, { title: source.title, checkedAt: source.checkedAt }] as const),
  ...scholarshipResearch.internal.sources.map(source => [source.url, { checkedAt: scholarshipResearch.internal.checkedAt }] as const),
]);
const formatDay = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// Section anchors are linked from other pages (e.g. #guide-3-understand-csca-and-language-proof); keep the format.
const sectionId = (heading: string, index: number) => `guide-${index + 1}-${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
const sectionTitle = 'font-display text-[28px] font-black leading-[1.02] tracking-[-0.01em] text-petrol-800 sm:text-[34px]';
const bodyText = 'text-[16px] leading-7 text-ink-soft sm:text-[17px] sm:leading-8';

function GuideSection({ section, index }: { section: ChinaGuideSection; index: number }) {
  const cards = section.cards ?? [];
  return (
    <section id={sectionId(section.heading, index)} className="scroll-mt-28 space-y-5">
      <h2 data-anim="up" className={sectionTitle}>{section.heading}</h2>
      <div className="space-y-4">
        {section.summary.split(/\n\s*\n/).map((paragraph, paragraphIndex) => <p key={paragraphIndex} className={bodyText}>{paragraph}</p>)}
      </div>

      {section.table && (
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft">
          <table className="w-full min-w-[480px] border-collapse text-left text-[15px] leading-6">
            <caption className="sr-only">{section.heading}</caption>
            <thead className="bg-canvas-soft">
              <tr>{section.table.columns.map((column, columnIndex) => <th key={`${columnIndex}-${column}`} scope="col" className="px-5 py-3.5 align-top font-semibold text-petrol-800">{column}</th>)}</tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-canvas-soft">
                  {row.map((cell, cellIndex) => cellIndex === 0
                    ? <th key={cellIndex} scope="row" className="min-w-[150px] px-5 py-4 align-top font-semibold text-petrol-800">{cell}</th>
                    : <td key={cellIndex} className="px-5 py-4 align-top text-ink-soft">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cards.length ? (
        <div data-anim="stagger" className={`grid gap-4 ${cards.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {cards.map((card, cardIndex) => (
            <div key={`${cardIndex}-${card.title}`} className={`${kit.cardSage} ${cards.length > 1 && cards.length % 2 !== 0 && cards.length !== 3 && cardIndex === cards.length - 1 ? 'sm:col-span-2' : ''}`}>
              <h3 className="text-[18px] font-semibold leading-7 text-petrol-800">{card.title}</h3>
              <p className="mt-2 text-[15px] leading-7 text-ink-soft">{card.body}</p>
            </div>
          ))}
        </div>
      ) : null}

      {section.steps?.length ? (
        <ol data-anim="stagger" className="space-y-3">
          {section.steps.map((step, stepIndex) => (
            <li key={`${stepIndex}-${step.title}`} className="flex gap-4 rounded-3xl bg-canvas-soft p-5 sm:p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime font-display text-[18px] font-black text-petrol-800" aria-hidden="true">{stepIndex + 1}</span>
              <div>
                <h3 className="text-[18px] font-semibold leading-7 text-petrol-800">{step.title}</h3>
                <p className="mt-1 text-[15px] leading-7 text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      {section.disclosures?.length ? (
        <div className="space-y-3">
          {section.disclosures.map(entry => (
            <details key={entry.title} className="faq-smooth group rounded-3xl bg-canvas-soft px-5 sm:px-6">
              <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 py-3 text-[16px] font-semibold leading-7 text-petrol-800 [&::-webkit-details-marker]:hidden">
                {entry.title}
                <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transform-none" aria-hidden="true" />
              </summary>
              <p className="pb-5 text-[15px] leading-7 text-ink-soft">{entry.body}</p>
            </details>
          ))}
        </div>
      ) : null}

      {section.items?.length ? (
        <ul className={`grid gap-x-8 gap-y-3 ${section.items.length > 3 && section.items.every(item => item.length < 150) ? 'sm:grid-cols-2' : ''}`}>
          {section.items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`} className="flex items-start gap-3 text-[16px] leading-7 text-ink-soft">
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><Check size={13} strokeWidth={3} aria-hidden="true" /></span>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

/** Shared template for the China topic guides (also rendered by app/[slug] for e.g. /china-visa-first-policy). */
export default async function ChinaGuidePage({ guide }: { guide: ChinaGuidePageData }) {
  const path = `/${guide.slug}`;
  const url = `${SITE}${path}`;
  const isPolicyPage = guide.slug === 'china-visa-first-policy';
  const servicePackages = isPolicyPage
    ? (await getPublicTrustRecords()).servicePackages.filter(item => item.destination === 'China')
    : [];

  const sources = guide.sources.map(source => ({ ...source, record: sourceRecords.get(source.href) }));
  const checkedDates = sources.flatMap(source => source.record ? [source.record.checkedAt] : []).sort();
  const latestCheck = checkedDates.length ? formatDay(checkedDates[checkedDates.length - 1]) : null;

  const contents = [
    ...guide.sections.map((section, index) => ({ label: section.heading, href: `#${sectionId(section.heading, index)}` })),
    ...(servicePackages.length ? [{ label: 'EduExpress service packages', href: '#service-packages' }] : []),
    ...(sources.length ? [{ label: 'Official sources', href: '#guide-sources' }] : []),
    ...(guide.faqs.length ? [{ label: 'Frequently asked questions', href: '#guide-faq' }] : []),
  ];
  const related = [...new Map([...guide.related, ...topics, { label: 'Fees and transparency', href: '/fees-and-transparency' }]
    .filter(item => item.href !== path)
    .map(item => [item.href, item])).values()];

  // Bands after the main guide alternate white / sage; the navy policy band only
  // appears where it is not already the subject of the page.
  const sourcesTone = 'sage' as const;
  const faqTone = sources.length ? 'white' as const : 'sage' as const;
  const relatedTone = guide.faqs.length ? (faqTone === 'white' ? 'sage' : 'white') : (sources.length ? 'white' : 'sage');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#page`,
    url,
    name: guide.title,
    description: guide.description,
    inLanguage: 'en-BD',
    isPartOf: { '@id': `${SITE}/#website` },
    publisher: { '@id': `${SITE}/#organization` },
    breadcrumb: { '@id': `${url}#breadcrumb` },
  };

  return (
    <article>
      <JsonLd data={structuredData} />

      <PageHero
        path={path}
        trail={[{ name: 'Study in China', path: '/study-in-china-from-bangladesh' }, { name: guide.title }]}
        eyebrow={guide.eyebrow}
        title={guide.title}
        lead={guide.description}
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Apply with EduExpress <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/universities?country=china" className="ed-btn ed-btn-outline min-h-[52px] px-7">Explore Chinese universities</Link>
          </>
        }
        aside={guide.facts.length ? (
          <div className="rounded-3xl bg-white p-6 sm:p-7">
            <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-ink-soft">At a glance</p>
            <dl className="mt-2 divide-y divide-canvas-soft">
              {guide.facts.map((fact, index) => (
                <div key={`${index}-${fact.label}`} className="py-4">
                  <dt className="text-[14px] font-semibold text-ink-soft">{fact.label}</dt>
                  <dd className="mt-1 font-display text-[30px] font-black leading-none tracking-[-0.01em] text-petrol-800">{fact.value}</dd>
                  <dd className="mt-1.5 text-[15px] leading-6 text-ink-soft">{fact.note}</dd>
                </div>
              ))}
            </dl>
            {latestCheck && (
              <p className="flex items-start gap-2 border-t border-canvas-soft pt-4 text-[14px] leading-6 text-ink-soft">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
                <span>Source research checked {latestCheck}. <a href="#guide-sources" className="font-semibold text-petrol-800 underline underline-offset-4">See sources</a></span>
              </p>
            )}
          </div>
        ) : undefined}
      />

      <TrustBar />

      <nav aria-label="China study topics" className="border-b border-canvas-soft bg-white">
        <div className={`${kit.wrap} flex gap-2 overflow-x-auto py-3`}>
          {topics.map(topic => {
            const current = topic.href === path;
            return (
              <Link
                key={topic.href}
                href={topic.href}
                aria-current={current ? 'page' : undefined}
                className={`inline-flex min-h-[44px] shrink-0 items-center rounded-full px-4 text-[15px] font-semibold transition-colors ${current ? 'bg-petrol-800 text-white' : 'bg-canvas-soft text-petrol-800 hover:bg-lime-pale'}`}
              >
                {topic.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
          <aside className="min-w-0 lg:sticky lg:top-32 lg:max-h-[calc(100svh-150px)] lg:overflow-y-auto lg:pr-1">
            <details className="rounded-3xl bg-canvas-soft lg:hidden">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 px-5 text-[16px] font-semibold text-petrol-800 [&::-webkit-details-marker]:hidden">
                On this page<ChevronDown size={18} aria-hidden="true" />
              </summary>
              <nav aria-label="Guide contents" className="px-5 pb-4">
                {contents.map(item => <a key={item.href} href={item.href} className="flex min-h-[44px] items-center py-1.5 text-[15px] leading-6 text-ink-soft hover:text-petrol-800">{item.label}</a>)}
              </nav>
            </details>
            <div className="hidden lg:block">
              <nav aria-label="Guide contents">
                <p className="mb-2 text-[14px] font-semibold uppercase tracking-[0.08em] text-ink-soft">On this page</p>
                <div className="space-y-0.5 border-l-2 border-canvas-soft">
                  {contents.map(item => (
                    <a key={item.href} href={item.href} className="-ml-[2px] flex min-h-[44px] items-center border-l-2 border-transparent py-1.5 pl-4 text-[15px] leading-6 text-ink-soft transition-colors hover:border-petrol-800 hover:text-petrol-800">
                      {item.label}
                    </a>
                  ))}
                </div>
              </nav>
              <div className={`mt-8 ${kit.cardLime} !p-5`}>
                <p className="text-[17px] font-semibold leading-6 text-petrol-800">Plan your next step</p>
                <p className="mt-2 text-[15px] leading-6 text-ink-soft">Match your subject, qualifications and budget to a study route.</p>
                <Link href={applyHref} className="ed-btn ed-btn-signal mt-4 min-h-[48px] w-full text-[15px]">Apply with EduExpress</Link>
                <Link href="/china-visa-first-policy" className={`mt-3 ${kit.link} text-[15px]`}>Our China service terms <ArrowRight size={15} aria-hidden="true" /></Link>
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-14">
            <div className={kit.cardLime}>
              <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-lime-deep">The short answer</p>
              <p className="mt-3 text-[17px] leading-8 text-petrol-800 sm:text-[18px]">{guide.directAnswer}</p>
            </div>

            {guide.sections.map((section, index) => <GuideSection key={`${index}-${section.heading}`} section={section} index={index} />)}

            {guide.slug === 'study-in-china-cost-bangladesh' ? (
              <section className={kit.cardSage}>
                <h2 className={kit.h3}>Build your university budget</h2>
                <p className="mt-2 text-[16px] leading-7 text-ink-soft">Choose a university and program to review itemised fee structures. Compare listed scholarship reductions, separate before-departure and in-country payments, and view your EduExpress Package in its published currency.</p>
                <Link href="/universities?country=china" className="ed-btn ed-btn-signal mt-5 min-h-[50px] px-6">Find a university & view fees <ArrowRight size={17} aria-hidden="true" /></Link>
              </section>
            ) : null}

            {servicePackages.length ? (
              <section id="service-packages" className="scroll-mt-28 space-y-5">
                <h2 className={sectionTitle}>EduExpress China service packages</h2>
                <p className={bodyText}>The university award defines your scholarship coverage. Your EduExpress Package defines the agreed support, service fee and responsibilities.</p>
                <div className="space-y-4">
                  {servicePackages.map(item => (
                    <article key={item.id} className={kit.cardOutline}>
                      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                        <h3 className={`max-w-md ${kit.h3}`}>{item.title}</h3>
                        <p className="font-display text-[26px] font-black leading-none tabular-nums text-petrol-800">{item.priceLabel}</p>
                      </div>
                      <p className="mt-3 text-[16px] leading-7 text-ink-soft">{item.summary}</p>
                      {item.outcomeScope && <p className="mt-2 text-[16px] leading-7 text-ink-soft">{item.outcomeScope}</p>}
                      <details className="group mt-4 border-t border-canvas-soft">
                        <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 pt-3 text-[16px] font-semibold text-petrol-800 [&::-webkit-details-marker]:hidden">
                          Included support, payment & return terms<ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                        </summary>
                        <div className="mt-3 space-y-5">
                          {([['Included support', item.includedItems], ['Paid separately', item.excludedItems], ['Payment protection', item.securityOptions]] as const).map(([label, values]) => values.length ? (
                            <div key={label}>
                              <h4 className="text-[16px] font-semibold text-petrol-800">{label}</h4>
                              <ul className="mt-2 space-y-1.5">
                                {values.map((value, index) => (
                                  <li key={`${index}-${value}`} className="flex items-start gap-2.5 text-[15px] leading-7 text-ink-soft">
                                    <Check size={16} className="mt-1.5 shrink-0 text-petrol-800" aria-hidden="true" />{value}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null)}
                          {([['Payment terms', item.paymentTerms], ['Return terms', item.refundTerms], ['Responsibilities', item.complianceNote]] as const).map(([label, value]) => value ? (
                            <div key={label}>
                              <h4 className="text-[16px] font-semibold text-petrol-800">{label}</h4>
                              <p className="mt-2 text-[15px] leading-7 text-ink-soft">{value}</p>
                            </div>
                          ) : null)}
                        </div>
                      </details>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {(guide.changeRisks.length || guide.notSuitable.length) ? (
              <section aria-label="Before you decide" className="grid gap-4 sm:grid-cols-2">
                {guide.changeRisks.length ? (
                  <div className={kit.cardSage}>
                    <h2 className={kit.h3}>Confirm for your chosen route</h2>
                    <ul className="mt-4 space-y-2.5">
                      {guide.changeRisks.map((item, index) => (
                        <li key={`${index}-${item}`} className="flex items-start gap-2.5 text-[15px] leading-7 text-ink-soft">
                          <ShieldCheck size={17} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {guide.notSuitable.length ? (
                  <div className={kit.cardSage}>
                    <h2 className={kit.h3}>A good fit for your plans</h2>
                    <ul className="mt-4 space-y-2.5">
                      {guide.notSuitable.map((item, index) => (
                        <li key={`${index}-${item}`} className="flex items-start gap-2.5 text-[15px] leading-7 text-ink-soft">
                          <Check size={17} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            ) : null}
          </div>
        </div>
      </Section>

      {!isPolicyPage && (
        <Section tone="navy" title="No EduExpress fee before your China visa." intro={visaFirstTerms}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/china-visa-first-policy" className="ed-btn ed-btn-signal min-h-[52px] px-7">Read the visa-first policy <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link href="/fees-and-transparency" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">How we handle fees</Link>
          </div>
        </Section>
      )}

      {sources.length ? (
        <Section
          id="guide-sources"
          tone={sourcesTone}
          title="Official sources."
          intro="Universities, scholarship bodies and the Chinese authorities make the official decisions. Check the current notice for your exact programme before you pay."
        >
          <ul data-anim="stagger" className="grid gap-3 md:grid-cols-2">
            {sources.map(source => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noopener noreferrer" className="group flex h-full min-h-[72px] items-start justify-between gap-4 rounded-3xl bg-white p-5 transition-colors hover:bg-lime-pale">
                  <span>
                    <span className="block text-[16px] font-semibold leading-6 text-petrol-800 group-hover:underline">{source.label}</span>
                    {source.record?.title && <span className="mt-1 block text-[15px] leading-6 text-ink-soft">{source.record.title}</span>}
                    {source.record && <span className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-semibold text-lime-deep"><ShieldCheck size={15} aria-hidden="true" />Checked {formatDay(source.record.checkedAt)}</span>}
                  </span>
                  <ExternalLink size={17} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {guide.faqs.length ? (
        <div id="guide-faq" className="scroll-mt-28">
          <FaqBlock items={guide.faqs} tone={faqTone} />
        </div>
      ) : null}

      <Section tone={relatedTone} title="Continue exploring China.">
        <nav aria-label="Related China guides">
          <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map(item => (
              <li key={item.href}>
                <Link href={item.href} className={`group flex min-h-[64px] items-center justify-between gap-4 rounded-3xl px-5 py-4 text-[16px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale ${relatedTone === 'sage' ? 'bg-white' : 'bg-canvas-soft'}`}>
                  {item.label}
                  <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <CtaBand title={guide.ctaTitle} text={guide.ctaText} />
    </article>
  );
}
