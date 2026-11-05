import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Database, SearchCheck, ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';
import UniversitiesClient from '@/app/universities/UniversitiesClient';
import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { getUniversityRecords } from '@/lib/university-records';
import { filterUniversities, readDirectoryFilters } from '@/lib/university-directory';
import { chinaCities } from '@/lib/city-pages';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/china-universities';
const canonical = `${SITE}${PATH}`;

export const revalidate = 3600;

async function getChinaUniversities() {
  try {
    const allUniversities = await getUniversityRecords();
    return allUniversities.filter(uni => uni.country?.toLowerCase() === 'china');
  } catch (error) {
    console.error('Error fetching china universities server-side:', error);
    return [];
  }
}

type Query = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<Query> };

export async function generateMetadata({ searchParams }: Props) {
  const universities = await getChinaUniversities();
  const count = universities.length;
  const query = await searchParams;
  const filtered = Object.values(query).some(value => Array.isArray(value) ? value.some(Boolean) : Boolean(value));
  return pageMetadata({
    title: 'China Universities for Bangladeshi Students | EduExpress',
    description: `Compare ${count > 0 ? `${count} ` : ''}China university records for Bangladeshi students by subject, degree, teaching language, city and intake, with recorded costs and source status.`,
    path: PATH,
    image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing'),
    // Filtered views stay crawlable but out of the index; the canonical stays the unfiltered directory.
    noindex: filtered,
  });
}

const guides = [
  { label: 'Study in China from Bangladesh', href: '/study-in-china-from-bangladesh' },
  { label: 'MBBS in China', href: '/mbbs-in-china-bangladesh' },
  { label: 'China admission requirements', href: '/china-admission-requirements' },
  { label: 'China scholarships', href: '/china-scholarships-bangladesh' },
  { label: 'Study costs and ClearCost', href: '/study-in-china-cost-bangladesh' },
  { label: 'Intakes and deadlines', href: '/china-intakes-deadlines' },
];

export default async function ChinaUniversitiesPage({ searchParams }: Props) {
  const universities = await getChinaUniversities();
  const query = await searchParams;
  const params = new URLSearchParams(Object.entries(query).flatMap(([key, value]) => value ? [[key, Array.isArray(value) ? value[0] : value]] : []));
  const matching = filterUniversities(universities, readDirectoryFilters(params));
  const cities = chinaCities(universities);
  const rawLimit = params.get('limit') || '12';
  const limit = /^\d+$/.test(rawLimit) ? Math.max(12, Math.min(Number(rawLimit), universities.length || 12)) : 12;
  const visibleUniversities = matching.slice(0, limit);
  const sourceLinkedCount = universities.filter(item => [item.officialUrl, ...item.sourceUrls, ...item.programs.map(program => program.sourceUrl)].some(url => url && /^https?:\/\//i.test(url))).length;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: 'China Universities for Bangladeshi Students', inLanguage: 'en-BD', isPartOf: { '@id': `${SITE}/#website` }, breadcrumb: { '@id': `${canonical}#breadcrumb` }, mainEntity: { '@id': `${canonical}#directory` } },
      { '@type': 'ItemList', '@id': `${canonical}#directory`, numberOfItems: visibleUniversities.length, itemListElement: visibleUniversities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `${SITE}/universities/${item.slug}` })) },
      ...visibleUniversities.map(item => ({
        '@type': 'CollegeOrUniversity',
        '@id': `${SITE}/universities/${item.slug}#university`,
        name: item.name,
        url: `${SITE}/universities/${item.slug}`,
        address: { '@type': 'PostalAddress', addressLocality: item.city, addressCountry: 'CN' },
      })),
    ],
  };

  const stats = [
    { icon: Database, title: `${universities.length} China university records`, text: 'Browse the available directory records. A listing does not establish an institutional partnership or open admission.' },
    { icon: SearchCheck, title: `${sourceLinkedCount} records with linked sources`, text: 'Source links support specific facts. Each card shows whether the complete record still needs verification.' },
    { icon: ShieldCheck, title: 'Compare education fit first', text: 'Review recognition, academic fit, career value, full cost, visa readiness and student support side by side.' },
  ];

  return (
    <article>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Study in China', path: '/study-in-china-from-bangladesh' }, { name: 'China universities' }]}
        eyebrow="China university directory"
        title="China universities for Bangladeshi students."
        lead={`Explore ${universities.length} Chinese university records. Filter recorded programs by subject, degree, language, city and intake, then compare academic fit, costs and source status.`}
        actions={
          <>
            <a href="#china-directory" className="ed-btn ed-btn-signal min-h-[52px] px-7">Search the directory <ArrowRight size={18} aria-hidden="true" /></a>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-outline min-h-[52px] px-7">Get my free assessment</Link>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image src="/images/students/campus-nuist.webp" alt="A student at the I love NUIST sign on campus in Nanjing" fill priority sizes="(max-width:1024px) 100vw, 480px" className="object-cover object-[60%_45%]" />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">On campus in Nanjing</figcaption>
          </figure>
        }
      />

      <TrustBar />

      <section aria-label="How to read this directory" className="border-b border-canvas-soft bg-white pb-10">
        <ul data-anim="stagger" className={`${kit.wrap} grid gap-4 md:grid-cols-3`}>
          {stats.map(item => (
            <li key={item.title} className={kit.cardSage}>
              <span className={kit.icon}><item.icon size={22} aria-hidden="true" /></span>
              <p className="mt-4 text-[18px] font-semibold text-petrol-800">{item.title}</p>
              <p className="mt-1.5 text-[15px] leading-6 text-ink-soft">{item.text}</p>
            </li>
          ))}
        </ul>
        {cities.length > 0 && (
          <nav aria-labelledby="browse-cities" className={`${kit.wrap} mt-8`}>
            <h2 id="browse-cities" className="text-[17px] font-semibold text-petrol-800">Browse universities by city</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {cities.map(item => <li key={item.slug}><Link href={`/china-universities/${item.slug}`} className="ed-btn ed-btn-soft min-h-11 text-[15px]">{item.city} <span className="text-ink-soft">({item.universities.length})</span></Link></li>)}
            </ul>
            <p className="mt-4 text-[15px] text-ink-soft">Or search by budget: <Link href="/programs" className={kit.link}>program and tuition finder</Link> · <Link href="/compare-costs" className={kit.link}>compare first-year costs</Link></p>
          </nav>
        )}
      </section>

      <div id="china-directory" className="scroll-mt-28">
        <Suspense fallback={<div className="py-20 text-center text-[16px] text-ink-soft">Loading China directory…</div>}>
          <UniversitiesClient initialUniversities={universities} />
        </Suspense>
      </div>

      <Section tone="sage" title="How to use this directory.">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={kit.card}>
            <h3 className={kit.h3}>Database status</h3>
            <p className={`mt-2 ${kit.body}`}>{universities.length} Chinese university records are available; {sourceLinkedCount} have linked sources. Historical fees, intakes and scholarship options require a current official-source review before application.</p>
            <Link href="/how-we-verify-universities" className={`mt-3 ${kit.link}`}>How we verify universities <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className={kit.card}>
            <h3 className={kit.h3}>From shortlist to written plan</h3>
            <p className={`mt-2 ${kit.body}`}>Open an individual profile for detailed evidence, use Compare to identify unanswered questions, then request a program-specific Education Fit Assessment and written ClearCost Sheet.</p>
            <Link href="/education-fit-assessment" className={`mt-3 ${kit.link}`}>Start the Education Fit Assessment <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
        <nav aria-label="China study guides" className="mt-10">
          <h3 className={kit.h3}>China guides for your shortlist</h3>
          <ul data-anim="stagger" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map(item => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-[60px] items-center justify-between gap-4 rounded-3xl bg-white px-5 py-3.5 text-[16px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale">
                  {item.label}<ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <CtaBand title="Need help choosing a university?" text="Share your results, subject and budget. A counsellor replies within one working day with a shortlist of suitable Chinese universities and every cost in writing." />
    </article>
  );
}
