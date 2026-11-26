import type { Metadata } from 'next';
import CostCalculatorWidget from '@/components/embed/CostCalculatorWidget';
import {
  buildPublicCalculatorDestinations,
  buildPublicUniversityDetail,
  buildPublicUniversitySummaries,
} from '@/lib/calculator-public';
import { getUniversityRecords } from '@/lib/university-records';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Embeddable Study Abroad Cost & Scholarship Calculator | EduExpress International',
  description:
    'Free embeddable Bangladesh study abroad cost & scholarship calculator covering verified Chinese universities (English-taught & Chinese language programs) and 32 global study destinations.',
  robots: {
    index: false,
    follow: true,
  },
};

async function loadWidgetData() {
  const destinations = buildPublicCalculatorDestinations();
  try {
    const allUniversities = await getUniversityRecords();
    const chinaUniversities = allUniversities.filter(
      (u) => u.isActive && u.country.toLowerCase() === 'china',
    );
    const now = new Date();
    const universities = buildPublicUniversitySummaries(chinaUniversities, now);

    // Preload the first university with explicit programs/scholarships so initial render needs zero extra roundtrip
    const initialUniRecord =
      chinaUniversities.find((u) => u.slug === universities[0]?.slug) ||
      chinaUniversities[0] ||
      null;
    const initialDetail = initialUniRecord ? buildPublicUniversityDetail(initialUniRecord, now) : null;

    return {
      universities,
      initialDetail,
      destinations,
      activeUniversitiesCount: allUniversities.filter((u) => u.isActive).length,
      chinaUniversitiesCount: universities.length,
    };
  } catch {
    return {
      universities: [],
      initialDetail: null,
      destinations,
      activeUniversitiesCount: 159,
      chinaUniversitiesCount: 150,
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
        universities={data.universities}
        initialDetail={data.initialDetail}
        destinations={data.destinations}
        activeUniversitiesCount={data.activeUniversitiesCount}
        chinaUniversitiesCount={data.chinaUniversitiesCount}
      />
    </div>
  );
}
