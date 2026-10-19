import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProgramFinder from '@/components/finders/ProgramFinder';
import { getUniversityRecords } from '@/lib/university-records';
import { toProgramRows, type ProgramRow } from '@/lib/catalog-views';
import { programSegments } from '@/lib/program-segments';

const canonical = 'https://eduexpressint.com/programs';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'China University Programs and Tuition Finder | EduExpress International' },
  description: 'Search recorded bachelor, master, PhD, MBBS and Chinese language programs at Chinese universities. Filter by yearly tuition, teaching language, city and deadline, with the source for each figure.',
  alternates: { canonical },
};

const formatCny = (value: number) => `CNY ${value.toLocaleString('en-US')}`;

/** Middle half of recorded yearly tuition, so the FAQ never quotes a stale hand-typed range. */
function tuitionRange(rows: ProgramRow[]) {
  const values = rows.flatMap(row => row.annualTuitionCny === null ? [] : [row.annualTuitionCny]).sort((a, b) => a - b);
  if (values.length < 4) return null;
  return { low: values[Math.floor(values.length * 0.25)], high: values[Math.floor(values.length * 0.75)], count: values.length };
}

const faqsFor = (rows: ProgramRow[]) => {
  const range = tuitionRange(rows);
  return [
  { question: 'How much is tuition at Chinese universities for Bangladeshi students?', answer: `${range ? `Across the ${range.count} programs recorded here with one yearly figure, the middle half charge between ${formatCny(range.low)} and ${formatCny(range.high)} a year before any scholarship.` : 'Yearly tuition depends on the university, subject, level and teaching language.'} Medicine and English-taught programs are often higher. Use the finder to sort the recorded figures, then check the full cost breakdown, which adds accommodation, insurance, medical check and residence permit fees.` },
  { question: 'Can I study in China in English?', answer: 'Yes. Most of the recorded programs list English as a teaching language, but many are Chinese-taught, and some list both. English-taught programs usually ask for IELTS, an English-medium certificate or an interview, and their exact requirement varies by university.' },
  { question: 'Why do some programs show no BDT amount?', answer: 'Exchange rates change daily, so the finder never assumes one. Enter today\'s rate and it converts every program that has one explicit yearly CNY figure. Ranges, "free" labels and scholarship-reduced prices are not converted.' },
  { question: 'Does a recorded deadline mean applications are open?', answer: 'No. Deadlines are copied from the latest university source we recorded and can change or close early when seats fill. Confirm the current deadline with the university or a counselor before preparing documents.' },
  ];
};

async function loadRows() {
  try { return toProgramRows(await getUniversityRecords('China'), new Date()); } catch { return []; }
}

export default async function ProgramsPage() {
  const rows = await loadRows();
  const universityCount = new Set(rows.map(row => row.universitySlug)).size;
  const faqs = faqsFor(rows);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: 'China University Programs and Tuition Finder', inLanguage: 'en-BD', about: { '@type': 'Thing', name: 'Higher education in China' } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' }, { '@type': 'ListItem', position: 2, name: 'Programs', item: canonical }] },
      { '@type': 'FAQPage', mainEntity: faqs.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
    ],
  };

  return (
    <article className="bg-[#f7fafc] pt-[74px] text-[#08263c] xl:pt-[106px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="border-b border-[#174f7a]/15 bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <Breadcrumbs items={[{ name: 'Universities', href: '/universities' }, { name: 'Programs' }]} />
          <div className="mt-7 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#174f7a]">Program and tuition finder</p>
              <h1 className="mt-3 max-w-3xl font-heading text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.04] tracking-[-.035em]">Find a China program that fits your budget</h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-600">Search {rows.length} recorded programs at {universityCount} Chinese universities. Set your yearly tuition limit, then open the full cost breakdown before you decide. Each figure links to the university source it came from.</p>
            </div>
            <Link href="/education-fit-assessment" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#174f7a] px-5 text-sm font-black text-white">Help me shortlist <ArrowRight size={15} /></Link>
          </div>
          <nav aria-label="Browse by program type" className="mt-6 flex flex-wrap gap-2">
            {programSegments.map(segment => <Link key={segment.slug} href={`/programs/${segment.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-[#174f7a]/20 bg-[#f7fafc] px-4 text-sm font-bold text-[#174f7a] hover:border-[#174f7a]">{segment.h1}</Link>)}
          </nav>
        </div>
      </header>

      <ProgramFinder rows={rows} />

      <section aria-labelledby="program-faq" className="border-t border-[#174f7a]/10 bg-white px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[900px]">
          <h2 id="program-faq" className="font-heading text-3xl font-bold tracking-[-.02em]">Questions about programs and tuition</h2>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map(item => <details key={item.question} className="group py-5"><summary className="cursor-pointer list-none text-lg font-bold marker:hidden">{item.question}</summary><p className="mt-3 text-base leading-7 text-slate-600">{item.answer}</p></details>)}
          </div>
          <p className="mt-8 text-sm leading-6 text-slate-600">Related: <Link href="/scholarships" className="font-bold text-[#174f7a] underline">China scholarship database</Link> · <Link href="/universities" className="font-bold text-[#174f7a] underline">Compare universities</Link> · <Link href="/study-in-china-cost-bangladesh" className="font-bold text-[#174f7a] underline">Study in China cost guide</Link></p>
        </div>
      </section>
    </article>
  );
}
