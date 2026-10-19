import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, GraduationCap } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProgramFinder from '@/components/finders/ProgramFinder';
import { getUniversityRecords } from '@/lib/university-records';
import { toProgramRows, toScholarshipRows } from '@/lib/catalog-views';
import { chinaCities } from '@/lib/city-pages';

export const revalidate = 3600;
const base = 'https://eduexpressint.com/china-universities';
type Props = { params: Promise<{ city: string }> };

async function loadCities() {
  try { return chinaCities(await getUniversityRecords('China')); } catch { return []; }
}

export async function generateStaticParams() {
  return (await loadCities()).map(item => ({ city: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).city;
  const match = (await loadCities()).find(item => item.slug === slug);
  if (!match) return {};
  const count = match.universities.length;
  return {
    title: { absolute: `Universities in ${match.city}, China for Bangladeshi Students | EduExpress` },
    description: `Compare ${count} recorded universities in ${match.city}: programs, yearly tuition, teaching language, scholarships and deadlines, with the source for each record.`,
    alternates: { canonical: `${base}/${match.slug}` },
  };
}

const cny = (value: number) => `CNY ${value.toLocaleString('en-US')}`;

export default async function CityPage({ params }: Props) {
  const slug = (await params).city;
  const cities = await loadCities();
  const match = cities.find(item => item.slug === slug);
  if (!match) notFound();
  const now = new Date();
  const programs = toProgramRows(match.universities, now);
  const scholarships = toScholarshipRows(match.universities, now);
  const prices = programs.flatMap(row => row.annualTuitionCny === null ? [] : [row.annualTuitionCny]).sort((a, b) => a - b);
  const english = programs.filter(row => row.languages.includes('English')).length;
  const openScholarships = scholarships.filter(row => !row.deadlinePassed).length;
  const url = `${base}/${match.slug}`;
  const faqs = [
    { question: `How many universities in ${match.city} accept international students?`, answer: `We have records for ${match.universities.length} universities in ${match.city} that admit international students, with ${programs.length} programs between them. That is our recorded list, not every university in the city.` },
    { question: `How much is tuition in ${match.city}?`, answer: prices.length ? `Recorded yearly tuition in ${match.city} runs from ${cny(prices[0])} to ${cny(prices[prices.length - 1])} for programs with one yearly figure, before any scholarship. Living costs, accommodation and insurance are extra; open the full cost breakdown for a specific program.` : `Tuition depends on the program. Open a university's full cost breakdown for recorded figures.` },
    { question: `Can I study in English in ${match.city}?`, answer: english ? `Yes. ${english} of the recorded programs in ${match.city} list English as a teaching language. Requirements such as IELTS or an interview vary by university.` : `None of the recorded programs in ${match.city} list English teaching yet. Ask a counselor about current English-taught options.` },
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${url}#page`, url, name: `Universities in ${match.city}, China`, inLanguage: 'en-BD', about: { '@type': 'City', name: match.city, containedInPlace: { '@type': 'Country', name: 'China' } } },
      { '@type': 'ItemList', numberOfItems: match.universities.length, itemListElement: match.universities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `https://eduexpressint.com/universities/${item.slug}` })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' }, { '@type': 'ListItem', position: 2, name: 'China universities', item: base }, { '@type': 'ListItem', position: 3, name: match.city, item: url }] },
      { '@type': 'FAQPage', mainEntity: faqs.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
    ],
  };

  return (
    <article className="bg-[#f7fafc] pt-[74px] text-[#08263c] xl:pt-[106px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="border-b border-[#174f7a]/15 bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <Breadcrumbs items={[{ name: 'China universities', href: '/china-universities' }, { name: match.city }]} />
          <h1 className="mt-7 max-w-4xl font-heading text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.04] tracking-[-.035em]">Universities in {match.city}, China</h1>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-600">Compare the {match.universities.length} universities we have records for in {match.city}: what they teach, recorded tuition, scholarships and deadlines. Each record links to its source.</p>
          <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Universities', String(match.universities.length)],
              ['Programs', String(programs.length)],
              ['English-taught programs', String(english)],
              ['Open scholarships', String(openScholarships)],
            ].map(([label, value]) => <div key={label} className="rounded-2xl border border-[#174f7a]/12 bg-[#f7fafc] p-4"><dt className="text-xs font-bold text-slate-600">{label}</dt><dd className="mt-1 text-2xl font-black">{value}</dd></div>)}
          </dl>
        </div>
      </header>

      <section aria-labelledby="city-universities" className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <h2 id="city-universities" className="font-heading text-2xl font-bold sm:text-3xl">Universities in {match.city}</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {match.universities.map(university => {
              const rows = programs.filter(row => row.universitySlug === university.slug);
              const levels = Array.from(new Set(rows.map(row => row.level)));
              const lowest = rows.flatMap(row => row.annualTuitionCny === null ? [] : [row.annualTuitionCny]).sort((a, b) => a - b)[0];
              const awards = scholarships.filter(row => row.universitySlug === university.slug && !row.deadlinePassed).length;
              return (
                <li key={university.slug} className="flex flex-col rounded-2xl border border-[#174f7a]/15 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e9f7fd] text-[#174f7a]"><GraduationCap size={22} /></span><h3 className="text-lg font-black leading-snug">{university.name}</h3></div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="text-xs font-bold text-slate-500">Programs</dt><dd className="font-bold">{rows.length || 'Not recorded'}</dd></div>
                    <div><dt className="text-xs font-bold text-slate-500">Lowest yearly tuition</dt><dd className="font-bold">{lowest !== undefined ? cny(lowest) : 'See breakdown'}</dd></div>
                    <div><dt className="text-xs font-bold text-slate-500">Levels</dt><dd className="font-bold">{levels.join(', ') || 'Not recorded'}</dd></div>
                    <div><dt className="text-xs font-bold text-slate-500">Open scholarships</dt><dd className="font-bold">{awards}</dd></div>
                  </dl>
                  <Link href={`/universities/${university.slug}`} className="mt-5 inline-flex min-h-11 items-center justify-between rounded-xl bg-[#08263c] px-4 text-sm font-black text-white hover:bg-[#174f7a]">View programs and costs <ArrowRight size={15} /></Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {programs.length > 0 && <><h2 className="sr-only">All recorded programs in {match.city}</h2><ProgramFinder rows={programs} /></>}

      <section aria-labelledby="city-faq" className="border-t border-[#174f7a]/10 bg-white px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[900px]">
          <h2 id="city-faq" className="font-heading text-3xl font-bold tracking-[-.02em]">Studying in {match.city}: common questions</h2>
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map(item => <details key={item.question} className="py-5"><summary className="cursor-pointer text-lg font-bold">{item.question}</summary><p className="mt-3 text-base leading-7 text-slate-600">{item.answer}</p></details>)}
          </div>
          <nav aria-label="Other cities" className="mt-8 text-sm leading-7 text-slate-600">Other cities: {cities.filter(item => item.slug !== match.slug).map((item, index) => <span key={item.slug}>{index > 0 && ' · '}<Link href={`/china-universities/${item.slug}`} className="font-bold text-[#174f7a] underline">{item.city}</Link></span>)}</nav>
        </div>
      </section>
    </article>
  );
}
