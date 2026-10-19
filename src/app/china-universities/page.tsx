import type { Metadata } from 'next';
import { Database, SearchCheck, ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';
import PageHeader from '@/components/PageHeader';
import UniversitiesClient from '@/app/universities/UniversitiesClient';
import { getUniversityRecords } from '@/lib/university-records';
import { filterUniversities, readDirectoryFilters } from '@/lib/university-directory';

const canonical = 'https://eduexpressint.com/china-universities';

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

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const universities = await getChinaUniversities();
  const count = universities.length;
  const query = await searchParams;
  const description = count > 0
    ? `Search and compare ${count} China university records by subject, degree, teaching language, city and intake. Compare program details, recorded costs and source status.`
    : 'Search and compare China university records by subject, degree, language, city and intake, with recorded costs and visible source status.';
  return {
    title: { absolute: 'China Universities Database for Bangladeshi Students | EduExpress' },
    description,
    alternates: { canonical },
    ...(Object.values(query).some(value => Array.isArray(value) ? value.some(Boolean) : Boolean(value)) ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: 'China Universities Database for Bangladeshi Students',
      description,
      url: canonical,
      type: 'website',
    },
  };
}

export default async function ChinaUniversitiesPage({ searchParams }: Props) {
  const universities = await getChinaUniversities();
  const query = await searchParams;
  const params = new URLSearchParams(Object.entries(query).flatMap(([key, value]) => value ? [[key, Array.isArray(value) ? value[0] : value]] : []));
  const matching = filterUniversities(universities, readDirectoryFilters(params));
  const rawLimit = params.get('limit') || '12';
  const limit = /^\d+$/.test(rawLimit) ? Math.max(12, Math.min(Number(rawLimit), universities.length || 12)) : 12;
  const visibleUniversities = matching.slice(0, limit);
  const sourceLinkedCount = universities.filter(item => [item.officialUrl, ...item.sourceUrls, ...item.programs.map(program => program.sourceUrl)].some(url => url && /^https?:\/\//i.test(url))).length;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: 'China Universities Database', inLanguage: 'en-BD' },
      { '@type': 'ItemList', '@id': `${canonical}#directory`, numberOfItems: visibleUniversities.length, itemListElement: visibleUniversities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `https://eduexpressint.com/universities/${item.slug}` })) },
      ...visibleUniversities.map((item) => ({
        '@type': 'CollegeOrUniversity',
        '@id': `https://eduexpressint.com/universities/${item.slug}#university`,
        name: item.name,
        url: `https://eduexpressint.com/universities/${item.slug}`,
        address: { '@type': 'PostalAddress', addressLocality: item.city, addressCountry: 'CN' },
      })),
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' },
        { '@type': 'ListItem', position: 2, name: 'Study in China', item: 'https://eduexpressint.com/study-in-china-from-bangladesh' },
        { '@type': 'ListItem', position: 3, name: 'China Universities', item: canonical },
      ] },
    ],
  };

  return (
    <article className="bg-[#f4f8fa] text-[#08263c] font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      
      <PageHeader
        title="China Universities"
        highlight="Study Options"
        description={`Explore ${universities.length} Chinese university records. Filter recorded programs by subject, degree, language, city and intake, then compare academic fit, costs and source status.`}
        icon={<Database />}
        badgeText="China university directory"
      />

      <section className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-[#174f7a]/15 sm:grid-cols-3">
          {[
            [Database, `${universities.length} China university records`, 'Browse the available directory records. A listing does not establish an institutional partnership or open admission.'],
            [SearchCheck, `${sourceLinkedCount} records with linked sources`, 'Source links support specific facts. Each card shows whether the complete record still needs verification.'],
            [ShieldCheck, 'Compare education fit first', 'Review recognition, academic fit, career value, full cost, visa readiness and student support side by side.'],
          ].map(([Icon, title, text]) => (
            <div key={String(title)} className="flex gap-4 bg-white p-5"><span className="grid size-10 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a]"><Icon size={20} /></span><div><strong className="text-sm">{String(title)}</strong><p className="mt-1 text-xs leading-5 text-slate-500">{String(text)}</p></div></div>
          ))}
        </div>
      </section>

      <Suspense fallback={<div className="py-20 text-center">Loading China directory...</div>}>
        <UniversitiesClient initialUniversities={universities} />
      </Suspense>

      <section className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-8 text-xs leading-6 text-slate-500 sm:px-8 lg:px-12">
          <p><strong className="text-[#08263c]">Database status:</strong> {universities.length} Chinese university records are available; {sourceLinkedCount} have linked sources. Historical fees, intakes and scholarship options require a current official-source review before application.</p>
          <p className="mt-2"><strong className="text-[#08263c]">How to use this directory:</strong> Open an individual profile for detailed evidence, use Compare to identify unanswered questions, then request a program-specific Education Fit Assessment and written ClearCost Sheet.</p>
        </div>
      </section>
    </article>
  );
}
