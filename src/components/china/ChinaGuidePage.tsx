import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import type { ChinaGuidePage as ChinaGuidePageData, ChinaGuideSection } from '@/data/chinaGuidePages';
import { getPublicTrustRecords } from '@/lib/trust-records';

const canonicalBase = 'https://eduexpressint.com';
const applyHref = '/apply?country=China';
const topics = [
  { label: 'Admission requirements', href: '/china-admission-requirements' },
  { label: 'Scholarships', href: '/china-scholarships-bangladesh' },
  { label: 'Costs & budget', href: '/study-in-china-cost-bangladesh' },
  { label: 'Student visa', href: '/china-student-visa-bangladesh' },
  { label: 'English & IELTS', href: '/study-in-china-without-ielts' },
  { label: 'Life in China', href: '/life-in-china-bangladeshi-students' },
];

const sectionId = (heading: string, index: number) => `guide-${index + 1}-${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
const headingClass = 'text-xl font-semibold leading-snug tracking-tight text-[#102b40] sm:text-2xl';
const bodyClass = 'text-sm leading-7 text-slate-600 sm:text-[15px] sm:leading-8';
const buttonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#174f7a] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#103d60] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f7a]';

function GuideSection({ section, index }: { section: ChinaGuideSection; index: number }) {
  return <section id={sectionId(section.heading, index)} className="scroll-mt-36 space-y-4 xl:scroll-mt-44">
    <h2 className={headingClass}>{section.heading}</h2>
    <div className="space-y-3">{section.summary.split(/\n\s*\n/).map((paragraph, paragraphIndex) => <p key={paragraphIndex} className={bodyClass}>{paragraph}</p>)}</div>
    {section.table && <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[460px] border-collapse text-left text-sm leading-6"><caption className="sr-only">{section.heading}</caption><thead className="bg-[#f3f6f8]"><tr>{section.table.columns.map((column, columnIndex) => <th key={`${columnIndex}-${column}`} scope="col" className="px-4 py-3 align-top font-semibold text-[#102b40]">{column}</th>)}</tr></thead><tbody>{section.table.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-t border-slate-200">{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row" className="min-w-[140px] px-4 py-4 align-top font-medium text-slate-800">{cell}</th> : <td key={cellIndex} className="px-4 py-4 align-top text-slate-600">{cell}</td>)}</tr>)}</tbody></table></div>}
    {section.cards?.length ? <div className={`grid gap-4 ${section.cards.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2'}`}>{section.cards.map((card, cardIndex) => <div key={`${cardIndex}-${card.title}`} className={`rounded-lg bg-[#f2f6f8] p-5 ${section.cards!.length > 1 && section.cards!.length % 2 !== 0 && section.cards!.length !== 3 && cardIndex === section.cards!.length - 1 ? 'sm:col-span-2' : ''}`}><h3 className="text-sm font-semibold leading-6 text-[#102b40]">{card.title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{card.body}</p></div>)}</div> : null}
    {section.steps?.length ? <ol className="space-y-5">{section.steps.map((step, stepIndex) => <li key={`${stepIndex}-${step.title}`} className="flex gap-4"><span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#eaf2f6] text-xs font-semibold tabular-nums text-[#174f7a]" aria-hidden="true">{stepIndex + 1}</span><div><h3 className="text-sm font-semibold leading-7 text-[#102b40]">{step.title}</h3><p className="mt-1 text-sm leading-7 text-slate-600">{step.body}</p></div></li>)}</ol> : null}
    {section.disclosures?.length ? <div className="space-y-3">{section.disclosures.map(entry => <details key={entry.title} className="group rounded-lg bg-[#f2f6f8] px-5"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-semibold leading-7 [&::-webkit-details-marker]:hidden">{entry.title}<ChevronDown size={16} className="shrink-0 text-[#174f7a] transition-transform group-open:rotate-180 motion-reduce:transform-none" aria-hidden="true" /></summary><p className="pb-5 text-sm leading-7 text-slate-600">{entry.body}</p></details>)}</div> : null}
    {section.items?.length ? <ul className={`grid list-disc gap-x-8 gap-y-2 pl-5 marker:text-[#477a98] ${section.items.length > 3 && section.items.every(item => item.length < 150) ? 'sm:grid-cols-2' : ''}`}>{section.items.map((item, itemIndex) => <li key={`${itemIndex}-${item}`} className="pl-1 text-sm leading-7 text-slate-600">{item}</li>)}</ul> : null}
  </section>;
}

function ApplyLink({ className = '' }: { className?: string }) {
  return <Link href={applyHref} className={`${buttonClass} ${className}`}>Apply with EduExpress International<ArrowRight size={16} className="shrink-0" aria-hidden="true" /></Link>;
}

export default async function ChinaGuidePage({ guide }: { guide: ChinaGuidePageData }) {
  const servicePackages = guide.slug === 'china-visa-first-policy'
    ? (await getPublicTrustRecords()).servicePackages.filter(item => item.destination === 'China')
    : [];
  const canonical = `${canonicalBase}/${guide.slug}`;
  const contents = [
    ...guide.sections.map((section, index) => ({ label: section.heading, href: `#${sectionId(section.heading, index)}` })),
    ...(servicePackages.length ? [{ label: 'EduExpress service packages', href: '#service-packages' }] : []),
    ...(guide.faqs.length ? [{ label: 'Frequently asked questions', href: '#guide-faq' }] : []),
  ];
  const related = [...new Map([...guide.related, ...topics].filter(item => item.href !== `/${guide.slug}`).map(item => [item.href, item])).values()];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${canonical}#page`, url: canonical, name: guide.title, description: guide.description, inLanguage: 'en-BD', isPartOf: { '@id': `${canonicalBase}/#website` } },
      ...(guide.faqs.length ? [{ '@type': 'FAQPage', '@id': `${canonical}#faq`, mainEntity: guide.faqs.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }] : []),
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${canonicalBase}/` },
        { '@type': 'ListItem', position: 2, name: 'Study in China', item: `${canonicalBase}/study-in-china-from-bangladesh` },
        { '@type': 'ListItem', position: 3, name: guide.title, item: canonical },
      ] },
    ],
  };

  return <article className="bg-[#f5f7f7] pb-12 pt-[76px] text-[#102b40] xl:pt-[112px]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <header className="bg-white"><div className="mx-auto max-w-[1200px] px-5 pb-8 pt-6 sm:px-8 lg:pb-9 lg:pt-7">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5 text-slate-500"><Link href="/" className="hover:text-[#174f7a]">Home</Link><ChevronRight size={12} aria-hidden="true" /><Link href="/study-in-china-from-bangladesh" className="hover:text-[#174f7a]">Study in China</Link><ChevronRight size={12} aria-hidden="true" /><span className="text-slate-700">{guide.title}</span></nav>
      <div className="max-w-4xl"><h1 className="text-[30px] font-semibold leading-[1.18] tracking-tight sm:text-[36px] lg:text-[40px]">{guide.title}</h1><p className="mt-4 max-w-3xl text-[15px] leading-8 text-slate-600 sm:text-base">{guide.directAnswer}</p></div>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3"><ApplyLink /><Link href="/universities?country=china" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#174f7a] hover:underline">Explore Chinese universities<ArrowRight size={15} aria-hidden="true" /></Link></div>
      {guide.facts.length ? <dl className="mt-7 grid gap-x-6 gap-y-5 rounded-lg bg-[#f2f6f8] p-5 sm:grid-cols-3">{guide.facts.map((fact, index) => <div key={`${index}-${fact.label}`}><dt className="text-xs font-medium leading-5 text-slate-600">{fact.label}</dt><dd className="mt-1.5 text-lg font-semibold leading-7 tracking-tight text-[#102b40]">{fact.value}</dd><dd className="mt-1 text-xs leading-6 text-slate-500">{fact.note}</dd></div>)}</dl> : null}
    </div></header>

    <nav aria-label="China study topics" className="border-y border-slate-200 bg-white"><div className="mx-auto flex max-w-[1200px] gap-6 overflow-x-auto px-5 sm:px-8">{topics.map(topic => <Link key={topic.href} href={topic.href} aria-current={topic.href === `/${guide.slug}` ? 'page' : undefined} className={`inline-flex min-h-12 shrink-0 items-center border-b-2 text-sm font-medium ${topic.href === `/${guide.slug}` ? 'border-[#174f7a] text-[#174f7a]' : 'border-transparent text-slate-600 hover:text-[#174f7a]'}`}>{topic.label}</Link>)}</div></nav>

    {/* 1200px frame minus 64px padding = 1136px: 220px contents + 40px gap + 876px article. */}
    <div className="mx-auto grid max-w-[1200px] items-start gap-7 px-5 pt-7 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:pt-9">
      <aside className="min-w-0 lg:sticky lg:top-36 lg:max-h-[calc(100svh-160px)] lg:overflow-y-auto lg:pr-2">
        <details className="rounded-lg border border-slate-200 bg-white lg:hidden"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold">On this page<ChevronDown size={16} aria-hidden="true" /></summary><nav aria-label="Guide contents" className="px-4 pb-3">{contents.map(item => <a key={item.href} href={item.href} className="flex min-h-11 items-center py-2 text-sm leading-6 text-slate-600 hover:text-[#174f7a]">{item.label}</a>)}</nav></details>
        <div className="hidden lg:block"><nav aria-label="Guide contents"><h2 className="mb-3 text-sm font-semibold">On this page</h2><div className="space-y-1">{contents.map(item => <a key={item.href} href={item.href} className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm leading-6 text-slate-600 transition-colors hover:bg-[#edf3f6] hover:text-[#174f7a]">{item.label}</a>)}</div></nav><div className="mt-6 rounded-lg bg-[#eaf2f6] p-4"><h2 className="text-base font-semibold leading-6">Plan your next step</h2><p className="mt-2 text-sm leading-7 text-slate-600">Get help matching your subject, qualifications and budget to a study route.</p><ApplyLink className="mt-4 w-full text-xs leading-6" /><Link href="/china-visa-first-policy" className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold leading-6 text-[#174f7a] hover:underline">Our China service terms<ArrowRight size={14} className="shrink-0" aria-hidden="true" /></Link></div></div>
      </aside>

      <div className="min-w-0 space-y-7">
        <div className="space-y-10 rounded-xl border border-slate-200 bg-white p-5 sm:p-7 lg:p-8">
          {guide.sections.map((section, index) => <GuideSection key={`${index}-${section.heading}`} section={section} index={index} />)}
          {guide.slug === 'study-in-china-cost-bangladesh' ? <section className="rounded-lg bg-[#eaf2f6] p-5"><h2 className="text-lg font-semibold leading-7">Build your university budget</h2><p className="mt-2 text-sm leading-7 text-slate-600">Choose a university and program to use ClearCost. Compare listed scholarship reductions, separate before-China and in-China payments, and include your EduExpress Package in its published currency.</p><Link href="/universities?country=china" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#174f7a] hover:underline">Find a university & open ClearCost<ArrowRight size={16} className="shrink-0" aria-hidden="true" /></Link></section> : null}

          {servicePackages.length ? <section id="service-packages" className="scroll-mt-36 xl:scroll-mt-44"><h2 className={headingClass}>EduExpress China service packages</h2><p className={`mt-3 ${bodyClass}`}>The university award defines your scholarship coverage. Your EduExpress Package defines the agreed support, service fee and responsibilities.</p><div className="mt-5 space-y-4">{servicePackages.map(item => <article key={item.id} className="rounded-lg border border-slate-200 p-5"><div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2"><h3 className="max-w-md text-base font-semibold leading-7">{item.title}</h3><p className="text-base font-semibold tabular-nums text-[#174f7a]">{item.priceLabel}</p></div><p className="mt-3 text-sm leading-7 text-slate-600">{item.summary}</p>{item.outcomeScope && <p className="mt-2 text-sm leading-7 text-slate-600">{item.outcomeScope}</p>}<details className="group mt-3"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#174f7a]">Included support, payment & return terms<ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" /></summary><div className="mt-3 space-y-5">{[['Included support', item.includedItems], ['Paid separately', item.excludedItems], ['Payment protection', item.securityOptions]].map(([label, values]) => (values as string[]).length ? <div key={label as string}><h4 className="text-sm font-semibold">{label as string}</h4><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-slate-600">{(values as string[]).map((value, index) => <li key={`${index}-${value}`} className="pl-1">{value}</li>)}</ul></div> : null)}{[['Payment terms', item.paymentTerms], ['Return terms', item.refundTerms], ['Responsibilities', item.complianceNote]].map(([label, value]) => value ? <div key={label}><h4 className="text-sm font-semibold">{label}</h4><p className="mt-2 text-sm leading-7 text-slate-600">{value}</p></div> : null)}</div></details></article>)}</div></section> : null}

          {(guide.changeRisks.length || guide.notSuitable.length) ? <section className="grid gap-6 rounded-lg bg-[#f5f7f6] p-5 sm:grid-cols-2">{guide.changeRisks.length ? <div><h2 className="text-base font-semibold leading-7">Confirm for your chosen route</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">{guide.changeRisks.map((item, index) => <li key={`${index}-${item}`} className="pl-1">{item}</li>)}</ul></div> : null}{guide.notSuitable.length ? <div><h2 className="text-base font-semibold leading-7">A good fit for your plans</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">{guide.notSuitable.map((item, index) => <li key={`${index}-${item}`} className="pl-1">{item}</li>)}</ul></div> : null}</section> : null}

          {guide.faqs.length ? <section id="guide-faq" className="scroll-mt-36 xl:scroll-mt-44"><h2 className={headingClass}>Frequently asked questions</h2><div className="mt-4 divide-y divide-slate-200">{guide.faqs.map((faq, index) => <details key={`${index}-${faq.question}`} className="group"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold leading-7 text-[#102b40]">{faq.question}<ChevronDown size={16} className="shrink-0 text-[#174f7a] transition-transform group-open:rotate-180" aria-hidden="true" /></summary><p className="pb-5 pr-6 text-sm leading-7 text-slate-600">{faq.answer}</p></details>)}</div></section> : null}
        </div>
        <section className="rounded-xl bg-[#eaf2f6] p-5 sm:p-7"><h2 className={headingClass}>{guide.ctaTitle}</h2><p className={`mt-3 ${bodyClass}`}>{guide.ctaText}</p><ApplyLink className="mt-5" /></section>
        <nav aria-label="Related China guides" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="text-lg font-semibold">Continue exploring China</h2><div className="mt-3 grid gap-x-6 sm:grid-cols-2">{related.map(item => <Link key={item.href} href={item.href} className="flex min-h-12 items-center justify-between gap-4 py-2 text-sm font-medium leading-6 text-[#174f7a] hover:underline">{item.label}<ArrowRight size={15} className="shrink-0" aria-hidden="true" /></Link>)}</div></nav>
      </div>
    </div>
  </article>;
}
