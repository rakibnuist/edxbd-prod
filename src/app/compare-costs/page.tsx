import type { Metadata } from 'next';
import { Suspense } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import CostCompare from '@/components/finders/CostCompare';
import { getUniversityRecords } from '@/lib/university-records';
import { toFeeRows, toProgramRows, type FeeRow } from '@/lib/catalog-views';

const canonical = 'https://eduexpressint.com/compare-costs';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Compare Study in China Costs Side by Side | EduExpress International' },
  description: 'Pick up to three China programs and compare tuition, accommodation, insurance, medical check, residence permit and application fees as recorded, with an optional BDT conversion.',
  alternates: { canonical },
};

async function load() {
  try {
    const universities = await getUniversityRecords('China');
    const fees: Record<string, FeeRow[]> = {};
    for (const university of universities) if (university.isActive) fees[university.slug] = toFeeRows(university);
    return { programs: toProgramRows(universities, new Date()), fees };
  } catch {
    return { programs: [], fees: {} };
  }
}

export default async function CompareCostsPage() {
  const { programs, fees } = await load();
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebApplication', name: 'Study in China cost comparison', url: canonical, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'BDT' }, inLanguage: 'en-BD' },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' }, { '@type': 'ListItem', position: 2, name: 'Programs', item: 'https://eduexpressint.com/programs' }, { '@type': 'ListItem', position: 3, name: 'Compare costs', item: canonical }] },
    ],
  };

  return (
    <article className="bg-[#f7fafc] pt-[74px] text-[#08263c] xl:pt-[106px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="border-b border-[#174f7a]/15 bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <Breadcrumbs items={[{ name: 'Programs', href: '/programs' }, { name: 'Compare costs' }]} />
          <p className="mt-7 text-xs font-black uppercase tracking-[.16em] text-[#174f7a]">Compare before you commit</p>
          <h1 className="mt-3 max-w-3xl font-heading text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.04] tracking-[-.035em]">Compare first-year costs side by side</h1>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-600">Choose up to three programs. See tuition and every recorded first-year fee in one table, and where a figure is unclear, see exactly what to confirm with the university.</p>
        </div>
      </header>
      <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading cost comparison…</div>}>
        <CostCompare programs={programs} fees={fees} />
      </Suspense>
    </article>
  );
}
