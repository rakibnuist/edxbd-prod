import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import UniversitiesClient from './UniversitiesClient';
import { getUniversityRecords } from '@/lib/university-records';
import Breadcrumbs from '@/components/Breadcrumbs';

const canonical = 'https://eduexpressint.com/universities';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Universities and Study Options | EduExpress International' },
  description: 'Search university and program records by study level, teaching language, city and destination, with a fresh detail check before application.',
  alternates: { canonical },
};

async function getUniversities() {
  try { return await getUniversityRecords(); } catch { return []; }
}

export default async function UniversitiesPage() {
  const universities = await getUniversities();
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: 'Universities and Study Options', inLanguage: 'en-BD' },
      { '@type': 'ItemList', numberOfItems: universities.length, itemListElement: universities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `${canonical}/${item.slug}` })) },
    ],
  };

  return (
    <article className="bg-[#f7fafc] pt-[74px] text-[#08263c] xl:pt-[106px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="border-b border-[#174f7a]/15 bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <Breadcrumbs items={[{ name: 'Universities' }]} />
          <div className="mt-7 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div><p className="text-xs font-black uppercase tracking-[.16em] text-[#174f7a]">Find education</p><h1 className="mt-3 max-w-3xl font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-.035em]">Find a university that fits.</h1><p className="mt-4 text-base font-semibold text-slate-600">Search by subject, study level, city or budget.</p></div>
            <Link href="/education-fit-assessment" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#174f7a] px-5 text-sm font-black text-white">Not sure? Help me choose <ArrowRight size={15} /></Link>
          </div>
        </div>
      </header>
      <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading study options…</div>}><UniversitiesClient initialUniversities={universities} /></Suspense>
    </article>
  );
}
