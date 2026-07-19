import type { Metadata } from 'next';
import { Database, SearchCheck, ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';
import PageHeader from '@/components/PageHeader';
import UniversitiesClient from '@/app/universities/UniversitiesClient';
import { getUniversityRecords } from '@/lib/university-records';

const canonical = 'https://eduexpressint.com/china-universities';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'China Universities Database for Bangladeshi Students | EduExpress' },
  description: 'Search and compare universities in China by study level, teaching language, intake, tuition, and MBBS options.',
  alternates: { canonical },
  openGraph: { 
    title: 'China Universities Database for Bangladeshi Students', 
    description: 'Compare current Chinese university records before choosing an application route.', 
    url: canonical, 
    type: 'website' 
  },
};

async function getChinaUniversities() {
  try {
    const allUniversities = await getUniversityRecords();
    return allUniversities.filter(uni => uni.country?.toLowerCase() === 'china');
  } catch (error) {
    console.error('Error fetching china universities server-side:', error);
    return [];
  }
}

export default async function ChinaUniversitiesPage() {
  const universities = await getChinaUniversities();

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: 'China Universities Database', dateModified: '2026-07-19', inLanguage: 'en-BD' },
      { '@type': 'ItemList', '@id': `${canonical}#directory`, numberOfItems: universities.length, itemListElement: universities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `https://eduexpressint.com/universities/${item.slug}` })) },
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
        highlight="Verified Directory"
        description="Inspect and compare 134+ collaborating Chinese institutions by degree level, taught language, intake deadlines, tuition and scholarship coverage."
        icon={<Database />}
        badgeText="China Database 2027"
      />

      <section className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-[#174f7a]/15 sm:grid-cols-3">
          {[
            [Database, `${universities.length} China database records`, 'These are the active Chinese university records currently available for comparison.'],
            [SearchCheck, 'Current detail check included', 'Every shortlisted option receives a fresh program and source review before application.'],
            [ShieldCheck, 'Program aligned application', 'Program, deadline, eligibility and fees are confirmed together before proceeding.'],
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
          <p><strong className="text-[#08263c]">Database status:</strong> {universities.length} active Chinese profiles are available for comparison. Each shortlisted university receives a current program, source, fee, scholarship and deadline check before the student proceeds.</p>
          <p className="mt-2"><strong className="text-[#08263c]">System update:</strong> Active <span aria-hidden="true">•</span> <strong className="text-[#08263c]">Data integrity:</strong> Verified</p>
        </div>
      </section>
    </article>
  );
}
