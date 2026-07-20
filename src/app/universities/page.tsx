import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Database, SearchCheck, ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';
import UniversitiesClient from './UniversitiesClient';
import { getUniversityRecords } from '@/lib/university-records';

const canonical = 'https://eduexpressint.com/universities';

// ISR: regenerated at most every hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Global Universities Database | EduExpress International' },
  description: 'Search university records globally by study level, country, teaching language, intake, tuition and major, with clear verification status.',
  alternates: { canonical },
  openGraph: { 
    title: 'Global Universities Database', 
    description: 'Compare current global university records before choosing an application route.', 
    url: canonical, 
    type: 'website' 
  },
};

async function getUniversities() {
  try {
    return await getUniversityRecords();
  } catch (error) {
    console.error('Error fetching universities server-side:', error);
    return [];
  }
}

export default async function UniversitiesPage() {
  const universities = await getUniversities();
  const countries = new Set(universities.map(item => item.country).filter(Boolean)).size;
  const programs = new Set(universities.flatMap(item => item.programs?.map(program => program.name || '').filter(Boolean) || item.details?.majors || [])).size;
  const scholarships = universities.reduce((acc, item) => acc + (item.scholarships?.length || 0), 0);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: 'Global Universities Database', dateModified: '2026-07-19', inLanguage: 'en-BD' },
      { '@type': 'ItemList', '@id': `${canonical}#directory`, numberOfItems: universities.length, itemListElement: universities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `https://eduexpressint.com/universities/${item.slug}` })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' },
        { '@type': 'ListItem', position: 2, name: 'Universities', item: canonical },
      ] },
    ],
  };

  return (
    <article className="bg-[#f6f9fb] pt-[76px] text-[#08263c] min-[1200px]:pt-[104px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      
      <header className="relative overflow-hidden bg-[#08263c] text-white">
        <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] hidden md:block size-[28rem] opacity-15">
          <Image src="/emblem-icon.png" width={450} height={450} unoptimized alt="" className="h-auto w-full object-contain filter brightness-0 invert" />
        </div>
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:px-12 lg:grid-cols-[.64fr_.36fr] lg:items-end lg:py-16">
          <div>
            <nav className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/50" aria-label="Breadcrumb"><Link href="/">Home</Link> <span aria-hidden="true">/</span> Universities</nav>
            <p className="mt-8 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Global University Evidence Desk</p>
            <h1 className="mt-4 max-w-4xl text-balance font-heading text-4xl font-bold leading-tight sm:text-6xl">Global Universities Database</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/70">Search all university records currently loaded in the EduExpress directory across all destinations. Compare study level, teaching language, country, majors, recorded tuition and intake data, then confirm every time-sensitive fact before applying.</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/15">
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{universities.length}</strong><span className="mt-2 block text-xs text-white/55">Active global records</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{countries}</strong><span className="mt-2 block text-xs text-white/55">Countries covered</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{programs}</strong><span className="mt-2 block text-xs text-white/55">Structured program names</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{scholarships}</strong><span className="mt-2 block text-xs text-white/55">Recorded scholarships</span></div>
          </div>
        </div>
      </header>

      <section className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-[#174f7a]/15 sm:grid-cols-3">
          {[
            [Database, `${universities.length} database records`, 'These are the active records currently available for comparison across all destinations.'],
            [SearchCheck, 'Current detail check included', 'Every shortlisted option receives a fresh program and source review before application.'],
            [ShieldCheck, 'Program aligned application', 'Program, deadline, eligibility and fees are confirmed together before proceeding.'],
          ].map(([Icon, title, text]) => (
            <div key={String(title)} className="flex gap-4 bg-white p-5"><span className="grid size-10 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a]"><Icon size={20} /></span><div><strong className="text-sm">{String(title)}</strong><p className="mt-1 text-xs leading-5 text-slate-500">{String(text)}</p></div></div>
          ))}
        </div>
      </section>

      <Suspense fallback={<div className="py-20 text-center">Loading directory...</div>}>
        <UniversitiesClient initialUniversities={universities} />
      </Suspense>

      <section className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-8 text-xs leading-6 text-slate-500 sm:px-8 lg:px-12">
          <p><strong className="text-[#08263c]">Database status:</strong> {universities.length} active profiles are available for comparison. Each shortlisted university receives a current program, source, fee, scholarship and deadline check before the student proceeds.</p>
          <p className="mt-2"><strong className="text-[#08263c]">System update:</strong> Active <span aria-hidden="true">•</span> <strong className="text-[#08263c]">Data integrity:</strong> Verified</p>
        </div>
      </section>
    </article>
  );
}
