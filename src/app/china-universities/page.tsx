import type { Metadata } from 'next';
import Link from 'next/link';
import { Database, SearchCheck, ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';
import UniversitiesClient from '@/app/universities/UniversitiesClient';
import { getUniversityRecords } from '@/lib/university-records';

const canonical = 'https://eduexpressint.com/china-universities';

// ISR: regenerated at most every hour.
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
  const programs = new Set(universities.flatMap(item => item.programs?.map(program => program.name || '').filter(Boolean) || item.details?.majors || [])).size;
  const scholarships = universities.reduce((acc, item) => acc + (item.scholarships?.length || 0), 0);

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
    <article className="bg-[#f6f9fb] pt-[76px] text-[#08263c] min-[1200px]:pt-[104px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      
      <header className="relative overflow-hidden bg-[#08263c] text-white">
        <div className="absolute right-[-12rem] top-[-14rem] size-[40rem] rounded-full border-[6rem] border-[#64b5df]/10" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:px-12 lg:grid-cols-[.64fr_.36fr] lg:items-end lg:py-16">
          <div>
            <nav className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/50" aria-label="Breadcrumb"><Link href="/">Home</Link> <span aria-hidden="true">/</span> <Link href="/study-in-china-from-bangladesh">Study in China</Link> <span aria-hidden="true">/</span> Universities</nav>
            <p className="mt-8 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">China University Evidence Desk</p>
            <h1 className="mt-4 max-w-4xl text-balance font-heading text-4xl font-bold leading-tight sm:text-6xl">China Universities Database</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/70">Search all Chinese university records currently loaded in the EduExpress directory. Compare study level, teaching language, majors, recorded tuition and intake data, then confirm every time-sensitive fact before applying.</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/15">
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{universities.length}</strong><span className="mt-2 block text-xs text-white/55">Active China records</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{programs}</strong><span className="mt-2 block text-xs text-white/55">Structured program names</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{scholarships}</strong><span className="mt-2 block text-xs text-white/55">Recorded scholarships</span></div>
          </div>
        </div>
      </header>

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
