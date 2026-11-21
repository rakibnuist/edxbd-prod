import type { Metadata } from 'next';
import CostCalculatorWidget from '@/components/embed/CostCalculatorWidget';
import { buildBangladeshMarketBenchmark } from '@/lib/bangladesh-market-benchmark';
import { toFeeRows, toProgramRows, type FeeRow } from '@/lib/catalog-views';
import { getUniversityRecords } from '@/lib/university-records';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Embeddable Study Abroad Cost Calculator | EduExpress International',
  description:
    'Free embeddable Bangladesh study abroad cost calculator covering 150 verified Chinese universities and 12 global study destinations.',
  robots: {
    index: false,
    follow: true,
  },
};

async function loadWidgetData() {
  try {
    const allUniversities = await getUniversityRecords();
    const chinaUniversities = allUniversities.filter(
      (u) => u.isActive && u.country.toLowerCase() === 'china',
    );
    const feesByUniversity: Record<string, FeeRow[]> = {};
    for (const university of chinaUniversities) {
      feesByUniversity[university.slug] = toFeeRows(university);
    }
    const programs = toProgramRows(chinaUniversities, new Date());
    const market = buildBangladeshMarketBenchmark(allUniversities, 0, new Date());

    return {
      programs,
      feesByUniversity,
      destinations: market.destinations,
      activeUniversitiesCount: market.liveCatalog.activeUniversities,
    };
  } catch {
    return {
      programs: [],
      feesByUniversity: {},
      destinations: [],
      activeUniversitiesCount: 159,
    };
  }
}

export default async function EmbedCostCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ tab }, data] = await Promise.all([searchParams, loadWidgetData()]);
  const initialTab = tab === 'destinations' ? 'destinations' : 'china';

  return (
    <div className="min-h-screen bg-transparent p-2 sm:p-3">
      {/* Keep embedded iframes completely clean without root-layout mobile bars or extra bottom spacing */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            '#main-content{padding-bottom:0!important;}body{background:transparent!important;}div[class*="fixed"][class*="bottom-0"]{display:none!important;}',
        }}
      />
      <CostCalculatorWidget
        initialTab={initialTab}
        programs={data.programs}
        feesByUniversity={data.feesByUniversity}
        destinations={data.destinations}
        activeUniversitiesCount={data.activeUniversitiesCount}
      />
    </div>
  );
}
