import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, GraduationCap } from 'lucide-react';
import ProgramFinder from '@/components/finders/ProgramFinder';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, kit } from '@/components/page/PageKit';
import { toProgramRows, toScholarshipRows } from '@/lib/catalog-views';
import { chinaCities } from '@/lib/city-pages';
import { SITE_URL, ogImage, pageMetadata } from '@/lib/seo';
import { getUniversityRecords } from '@/lib/university-records';

export const revalidate = 3600;
type Props = { params: Promise<{ city: string }> };

async function loadCities() {
  try { return chinaCities(await getUniversityRecords('China')); } catch { return []; }
}

export async function generateStaticParams() {
  return (await loadCities()).map(item => ({ city: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const slug = (await params).city;
  const match = (await loadCities()).find(item => item.slug === slug);
  if (!match) return {};
  const count = match.universities.length;
  return pageMetadata({
    title: `Study in ${match.city}, China: Universities and Fees | EduExpress`,
    description: `Compare ${count} recorded ${count === 1 ? 'university' : 'universities'} in ${match.city}, China for Bangladeshi students: programs, yearly tuition, teaching language, scholarships and deadlines.`,
    path: `/china-universities/${match.slug}`,
    image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing'),
  });
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
  const path = `/china-universities/${match.slug}`;
  const url = `${SITE_URL}${path}`;
  const faqs = [
    { question: `How many universities in ${match.city} accept international students?`, answer: `We have records for ${match.universities.length} universities in ${match.city} that admit international students, with ${programs.length} programs between them. That is our recorded list, not every university in the city.` },
    { question: `How much is tuition in ${match.city}?`, answer: prices.length ? `Recorded yearly tuition in ${match.city} runs from ${cny(prices[0])} to ${cny(prices[prices.length - 1])} for programs with one yearly figure, before any scholarship. Living costs, accommodation and insurance are extra; open the full cost breakdown for a specific program.` : 'Tuition depends on the program. Open a university\'s full cost breakdown for recorded figures.' },
    { question: `Can I study in English in ${match.city}?`, answer: english ? `Yes. ${english} of the recorded programs in ${match.city} list English as a teaching language. Requirements such as IELTS or an interview vary by university.` : `None of the recorded programs in ${match.city} list English teaching yet. Ask a counsellor about current English-taught options.` },
  ];
  const figures = [
    ['Universities', String(match.universities.length)],
    ['Programs', String(programs.length)],
    ['English-taught programs', String(english)],
    ['Open scholarships', String(openScholarships)],
  ];

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'CollectionPage', '@id': `${url}#page`, url, name: `Universities in ${match.city}, China`, inLanguage: 'en-BD', about: { '@type': 'City', name: match.city, containedInPlace: { '@type': 'Country', name: 'China' } } },
          { '@type': 'ItemList', numberOfItems: match.universities.length, itemListElement: match.universities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `${SITE_URL}/universities/${item.slug}` })) },
        ],
      }} />
      <PageHero
        path={path}
        trail={[{ name: 'China universities', path: '/china-universities' }, { name: match.city }]}
        eyebrow={`Study in ${match.city}`}
        title={`Universities in ${match.city}, China`}
        lead={`Compare the ${match.universities.length} universities we have records for in ${match.city}: what they teach, recorded tuition, scholarships and deadlines. Each record links to its source.`}
        aside={
          <div className={kit.card}>
            <dl className="grid grid-cols-2 gap-5">
              {figures.map(([label, value]) => <div key={label}><dt className="text-[15px] text-ink-soft">{label}</dt><dd className="mt-1 font-display text-[32px] font-black leading-none text-petrol-800">{value}</dd></div>)}
            </dl>
          </div>
        }
      />
      <Section tone="white" title={`Universities in ${match.city}`}>
        <ul data-anim="stagger" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {match.universities.map(university => {
            const rows = programs.filter(row => row.universitySlug === university.slug);
            const levels = Array.from(new Set(rows.map(row => row.level)));
            const lowest = rows.flatMap(row => row.annualTuitionCny === null ? [] : [row.annualTuitionCny]).sort((a, b) => a - b)[0];
            const awards = scholarships.filter(row => row.universitySlug === university.slug && !row.deadlinePassed).length;
            return (
              <li key={university.slug} className={`${kit.cardSage} flex flex-col`}>
                <div className="flex items-start gap-3"><span className={kit.icon}><GraduationCap size={22} aria-hidden="true" /></span><h3 className="text-[19px] font-bold leading-snug text-petrol-800">{university.name}</h3></div>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-[15px]">
                  <div><dt className="text-ink-soft">Programs</dt><dd className="font-semibold text-petrol-800">{rows.length || 'Not recorded'}</dd></div>
                  <div><dt className="text-ink-soft">Lowest yearly tuition</dt><dd className="font-semibold text-petrol-800">{lowest !== undefined ? cny(lowest) : 'See breakdown'}</dd></div>
                  <div><dt className="text-ink-soft">Levels</dt><dd className="font-semibold text-petrol-800">{levels.join(', ') || 'Not recorded'}</dd></div>
                  <div><dt className="text-ink-soft">Open scholarships</dt><dd className="font-semibold text-petrol-800">{awards}</dd></div>
                </dl>
                <Link href={`/universities/${university.slug}`} className="ed-btn ed-btn-signal mt-6 min-h-11 text-[15px]">View programs and costs <ArrowRight size={16} aria-hidden="true" /></Link>
              </li>
            );
          })}
        </ul>
      </Section>
      {programs.length > 0 && <><h2 className="sr-only">All recorded programs in {match.city}</h2><ProgramFinder rows={programs} /></>}
      <FaqBlock items={faqs} title={`Studying in ${match.city}: common questions`} tone="white" />
      {cities.length > 1 && (
        <Section tone="sage" title="Other cities">
          <ul className="flex flex-wrap gap-2">
            {cities.filter(item => item.slug !== match.slug).map(item => <li key={item.slug}><Link href={`/china-universities/${item.slug}`} className="ed-btn ed-btn-outline min-h-11 text-[15px]">{item.city}</Link></li>)}
          </ul>
        </Section>
      )}
      <CtaBand title={`Thinking about ${match.city}?`} text="Share your results, subject and budget. A counsellor compares suitable universities in writing, with the full first-year cost for each." />
    </>
  );
}
