import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import UniversitiesClient from './UniversitiesClient';
import { getUniversityRecords } from '@/lib/university-records';
import { filterUniversities, readDirectoryFilters } from '@/lib/university-directory';
import Breadcrumbs from '@/components/Breadcrumbs';

const canonical = 'https://eduexpressint.com/universities';
export const revalidate = 3600;

type Query = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<Query> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await searchParams;
  return {
    title: { absolute: 'Universities and Study Options | EduExpress International' },
    description: 'Filter university and program records by subject, study level, teaching language, city and intake. Compare academic fit, recognition, costs and source status.',
    alternates: { canonical },
    ...(Object.values(query).some(value => Array.isArray(value) ? value.some(Boolean) : Boolean(value)) ? { robots: { index: false, follow: true } } : {}),
  };
}

async function getUniversities() {
  try { return await getUniversityRecords(); } catch { return []; }
}

export default async function UniversitiesPage({ searchParams }: Props) {
  const universities = await getUniversities();
  const query = await searchParams;
  const params = new URLSearchParams(Object.entries(query).flatMap(([key, value]) => value ? [[key, Array.isArray(value) ? value[0] : value]] : []));
  const matching = filterUniversities(universities, readDirectoryFilters(params));
  const rawLimit = params.get('limit') || '12';
  const limit = /^\d+$/.test(rawLimit) ? Math.max(12, Math.min(Number(rawLimit), universities.length || 12)) : 12;
  const visibleUniversities = matching.slice(0, limit);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: 'Universities and Study Options', inLanguage: 'en-BD' },
      { '@type': 'ItemList', numberOfItems: visibleUniversities.length, itemListElement: visibleUniversities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `${canonical}/${item.slug}` })) },
    ],
  };

  return (
    <article className="bg-[#f7fafc] pt-[74px] text-[#08263c] xl:pt-[106px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="border-b border-[#174f7a]/15 bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <Breadcrumbs items={[{ name: 'Universities' }]} />
          <div className="mt-7 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div><p className="text-xs font-black uppercase tracking-[.16em] text-[#174f7a]">Find education</p><h1 className="mt-3 max-w-3xl font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-.035em]">Universities and Study Options</h1><p className="mt-4 text-base font-semibold text-slate-600">Filter recorded programs by subject, degree, language, city and intake. Compare your shortlist with linked sources and clear review status.</p></div>
            <Link href="/education-fit-assessment" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#174f7a] px-5 text-sm font-black text-white">Not sure? Help me choose <ArrowRight size={15} /></Link>
          </div>
        </div>
      </header>
      <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading study options…</div>}><UniversitiesClient initialUniversities={universities} /></Suspense>
    </article>
  );
}
