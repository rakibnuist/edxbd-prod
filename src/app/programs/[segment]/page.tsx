import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProgramFinder from '@/components/finders/ProgramFinder';
import { getUniversityRecords } from '@/lib/university-records';
import { toProgramRows, type ProgramRow } from '@/lib/catalog-views';
import { findProgramSegment, MIN_SEGMENT_PROGRAMS, programSegments } from '@/lib/program-segments';

export const revalidate = 3600;
export const dynamicParams = false;
const base = 'https://eduexpressint.com/programs';
type Props = { params: Promise<{ segment: string }> };

export function generateStaticParams() {
  return programSegments.map(segment => ({ segment: segment.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const segment = findProgramSegment((await params).segment);
  if (!segment) return {};
  return { title: { absolute: `${segment.title} | EduExpress` }, description: segment.description, alternates: { canonical: `${base}/${segment.slug}` } };
}

async function loadRows() {
  try { return toProgramRows(await getUniversityRecords('China'), new Date()); } catch { return []; }
}

const cny = (value: number) => `CNY ${value.toLocaleString('en-US')}`;

function stats(rows: ProgramRow[]) {
  const prices = rows.flatMap(row => row.annualTuitionCny === null ? [] : [row.annualTuitionCny]).sort((a, b) => a - b);
  const cityCounts = new Map<string, number>();
  for (const row of rows) cityCounts.set(row.city, (cityCounts.get(row.city) || 0) + 1);
  return {
    universities: new Set(rows.map(row => row.universitySlug)).size,
    open: rows.filter(row => !row.deadlinePassed).length,
    lowest: prices[0],
    middle: prices.length >= 4 ? [prices[Math.floor(prices.length * 0.25)], prices[Math.floor(prices.length * 0.75)]] as const : null,
    priced: prices.length,
    topCities: [...cityCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 4).map(([city]) => city),
  };
}

export default async function ProgramSegmentPage({ params }: Props) {
  const segment = findProgramSegment((await params).segment);
  if (!segment) notFound();
  const rows = (await loadRows()).filter(segment.match);
  if (rows.length < MIN_SEGMENT_PROGRAMS) notFound();
  const facts = stats(rows);
  const url = `${base}/${segment.slug}`;
  const costFaq = { question: `How much does it cost per year?`, answer: facts.middle ? `Across the ${facts.priced} programs here with one yearly tuition figure, the lowest is ${cny(facts.lowest)} and the middle half charge ${cny(facts.middle[0])} to ${cny(facts.middle[1])} before any scholarship. Accommodation, insurance, a medical check and the residence permit come on top; open the full cost breakdown for any program to see them.` : 'Tuition varies by university and subject. Open the full cost breakdown for any program to see tuition with accommodation, insurance and other fees.' };
  const faqs = [costFaq, ...segment.faqs];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${url}#page`, url, name: segment.h1, description: segment.description, inLanguage: 'en-BD' },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' }, { '@type': 'ListItem', position: 2, name: 'Programs', item: base }, { '@type': 'ListItem', position: 3, name: segment.h1, item: url }] },
      { '@type': 'FAQPage', mainEntity: faqs.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
    ],
  };

  return (
    <article className="bg-[#f7fafc] pt-[74px] text-[#08263c] xl:pt-[106px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="border-b border-[#174f7a]/15 bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <Breadcrumbs items={[{ name: 'Programs', href: '/programs' }, { name: segment.h1 }]} />
          <h1 className="mt-7 max-w-4xl font-heading text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.04] tracking-[-.035em]">{segment.h1}</h1>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-600">{segment.intro}</p>
          <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Programs recorded', String(rows.length)],
              ['Universities', String(facts.universities)],
              ['Lowest yearly tuition', facts.lowest !== undefined ? cny(facts.lowest) : 'Not recorded'],
              ['Deadline not yet passed', String(facts.open)],
            ].map(([label, value]) => <div key={label} className="rounded-2xl border border-[#174f7a]/12 bg-[#f7fafc] p-4"><dt className="text-xs font-bold text-slate-600">{label}</dt><dd className="mt-1 text-2xl font-black">{value}</dd></div>)}
          </dl>
          {facts.topCities.length > 0 && <p className="mt-4 text-sm text-slate-600">Most programs are in {facts.topCities.join(', ')}.</p>}
        </div>
      </header>

      <ProgramFinder rows={rows} />

      <section aria-labelledby="segment-faq" className="border-t border-[#174f7a]/10 bg-white px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[900px]">
          <h2 id="segment-faq" className="font-heading text-3xl font-bold tracking-[-.02em]">Common questions</h2>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map(item => <details key={item.question} className="py-5"><summary className="cursor-pointer text-lg font-bold">{item.question}</summary><p className="mt-3 text-base leading-7 text-slate-600">{item.answer}</p></details>)}
          </div>
          <div className="mt-8 rounded-2xl bg-[#08263c] p-6 text-white sm:p-8">
            <h2 className="text-2xl font-black">Not sure which program fits?</h2>
            <p className="mt-2 text-base leading-7 text-white/80">Share your results, subject and budget. A counselor compares at least three suitable options in writing, with the full cost for each.</p>
            <Link href="/education-fit-assessment" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-[#08263c]">Get my free assessment <ArrowRight size={15} /></Link>
          </div>
          <nav aria-label="Other program types" className="mt-8 text-sm leading-7 text-slate-600">Other program types: {programSegments.filter(item => item.slug !== segment.slug).map((item, index) => <span key={item.slug}>{index > 0 && ' · '}<Link href={`/programs/${item.slug}`} className="font-bold text-[#174f7a] underline">{item.h1}</Link></span>)}</nav>
        </div>
      </section>
    </article>
  );
}
