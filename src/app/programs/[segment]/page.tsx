import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProgramFinder from '@/components/finders/ProgramFinder';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, kit } from '@/components/page/PageKit';
import { toProgramRows, type ProgramRow } from '@/lib/catalog-views';
import { findProgramSegment, MIN_SEGMENT_PROGRAMS, programSegments } from '@/lib/program-segments';
import { SITE_URL, ogImage, pageMetadata } from '@/lib/seo';
import { getUniversityRecords } from '@/lib/university-records';

export const revalidate = 3600;
export const dynamicParams = false;
type Props = { params: Promise<{ segment: string }> };

export function generateStaticParams() {
  return programSegments.map(segment => ({ segment: segment.slug }));
}

export async function generateMetadata({ params }: Props) {
  const segment = findProgramSegment((await params).segment);
  if (!segment) return {};
  return pageMetadata({
    title: `${segment.title} | EduExpress`,
    description: segment.description,
    path: `/programs/${segment.slug}`,
    image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing'),
  });
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
  const path = `/programs/${segment.slug}`;
  const url = `${SITE_URL}${path}`;
  const costFaq = { question: 'How much does it cost per year?', answer: facts.middle ? `Across the ${facts.priced} programs here with one yearly tuition figure, the lowest is ${cny(facts.lowest)} and the middle half charge ${cny(facts.middle[0])} to ${cny(facts.middle[1])} before any scholarship. Accommodation, insurance, a medical check and the residence permit come on top; open the full cost breakdown for any program to see them.` : 'Tuition varies by university and subject. Open the full cost breakdown for any program to see tuition with accommodation, insurance and other fees.' };
  const figures = [
    ['Programs recorded', String(rows.length)],
    ['Universities', String(facts.universities)],
    ['Lowest yearly tuition', facts.lowest !== undefined ? cny(facts.lowest) : 'Not recorded'],
    ['Deadline not yet passed', String(facts.open)],
  ];

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${url}#page`, url, name: segment.h1, description: segment.description, inLanguage: 'en-BD' }} />
      <PageHero
        path={path}
        trail={[{ name: 'Programs', path: '/programs' }, { name: segment.h1 }]}
        eyebrow="Recorded programs and tuition"
        title={segment.h1}
        lead={segment.intro}
        aside={
          <div className={kit.card}>
            <dl className="grid grid-cols-2 gap-5">
              {figures.map(([label, value]) => <div key={label}><dt className="text-[15px] text-ink-soft">{label}</dt><dd className="mt-1 font-display text-[28px] font-black leading-none text-petrol-800">{value}</dd></div>)}
            </dl>
            {facts.topCities.length > 0 && <p className="mt-5 border-t border-canvas-soft pt-4 text-[15px] leading-6 text-ink-soft">Most programs are in {facts.topCities.join(', ')}.</p>}
          </div>
        }
      />
      <ProgramFinder rows={rows} />
      <FaqBlock items={[costFaq, ...segment.faqs]} title="Common questions" tone="white" />
      <Section tone="sage" title="Other program types">
        <ul className="flex flex-wrap gap-2">
          {programSegments.filter(item => item.slug !== segment.slug).map(item => <li key={item.slug}><Link href={`/programs/${item.slug}`} className="ed-btn ed-btn-outline min-h-11 text-[15px]">{item.h1}</Link></li>)}
          <li><Link href="/programs" className="ed-btn ed-btn-outline min-h-11 text-[15px]">All programs</Link></li>
        </ul>
      </Section>
      <CtaBand title="Not sure which program fits?" text="Share your results, subject and budget. A counsellor compares at least three suitable options in writing, with the full cost for each." />
    </>
  );
}
