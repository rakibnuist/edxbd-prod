import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProgramFinder from '@/components/finders/ProgramFinder';
import { CtaBand, FaqBlock, JsonLd, PageHero, kit } from '@/components/page/PageKit';
import { toProgramRows, type ProgramRow } from '@/lib/catalog-views';
import { programSegments } from '@/lib/program-segments';
import { SITE_URL, ogImage, pageMetadata } from '@/lib/seo';
import { getUniversityRecords } from '@/lib/university-records';

const PATH = '/programs';
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'China University Programs and Tuition Finder | EduExpress',
  description: 'Search bachelor, master, PhD, MBBS and Chinese language programs at Chinese universities by yearly tuition, language, city and deadline, with sources.',
  path: PATH,
  image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing'),
});

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
    { question: 'Does a recorded deadline mean applications are open?', answer: 'No. Deadlines are copied from the latest university source we recorded and can change or close early when seats fill. Confirm the current deadline with the university or a counsellor before preparing documents.' },
  ];
};

async function loadRows() {
  try { return toProgramRows(await getUniversityRecords('China'), new Date()); } catch { return []; }
}

export default async function ProgramsPage() {
  const rows = await loadRows();
  const universityCount = new Set(rows.map(row => row.universitySlug)).size;
  const url = `${SITE_URL}${PATH}`;

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${url}#page`, url, name: 'China University Programs and Tuition Finder', inLanguage: 'en-BD', about: { '@type': 'Thing', name: 'Higher education in China' } }} />
      <PageHero
        path={PATH}
        trail={[{ name: 'Universities', path: '/universities' }, { name: 'Programs' }]}
        eyebrow="Program and tuition finder"
        title="Find a China program that fits your budget"
        lead={`Search ${rows.length} recorded programs at ${universityCount} Chinese universities. Set your yearly tuition limit, then open the full cost breakdown before you decide. Each figure links to the university source it came from.`}
        actions={<>
          <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[54px] px-7">Help me shortlist <ArrowRight size={18} aria-hidden="true" /></Link>
          <Link href="/compare-costs" className="ed-btn ed-btn-outline min-h-[54px] px-7">Compare first-year costs</Link>
        </>}
      />
      <nav aria-label="Browse by program type" className="bg-white py-8">
        <div className={kit.wrap}>
          <p className="text-[15px] font-semibold text-petrol-800">Browse by program type</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {programSegments.map(segment => <li key={segment.slug}><Link href={`/programs/${segment.slug}`} className="ed-btn ed-btn-soft min-h-11 text-[15px]">{segment.h1}</Link></li>)}
          </ul>
        </div>
      </nav>
      <ProgramFinder rows={rows} />
      <FaqBlock items={faqsFor(rows)} title="Questions about programs and tuition" tone="white" />
      <section className="bg-white pb-16">
        <p className={`${kit.wrap} ${kit.body}`}>Related: <Link href="/scholarships#scholarship-database" className={kit.link}>China scholarship database</Link> · <Link href="/china-universities" className={kit.link}>China universities</Link> · <Link href="/study-in-china-cost-bangladesh" className={kit.link}>Study in China cost guide</Link></p>
      </section>
      <CtaBand title="Want a shortlist in writing?" text="Share your results, subject and budget. A counsellor compares at least three suitable programs for you in writing, with the full cost of each." />
    </>
  );
}
