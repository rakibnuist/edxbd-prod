import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Database, SearchCheck, ShieldCheck } from 'lucide-react';
import ChinaUniversityDirectory, { type ChinaUniversityRecord } from '@/components/china/ChinaUniversityDirectory';
import { getUniversityRecords } from '@/lib/university-records';

const canonical = 'https://eduexpressint.com/china-universities';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'China Universities for Bangladeshi Students | EduExpress' },
  description: 'Search China university records by study level, teaching language, intake, city, tuition and major, with clear verification status.',
  alternates: { canonical },
  openGraph: { title: 'Universities and Study Options in China', description: 'Compare current China university records before choosing an application route.', url: canonical, type: 'website' },
};

async function getChinaUniversities(): Promise<ChinaUniversityRecord[]> {
  try {
    return await getUniversityRecords('China');
  } catch (error) {
    console.error('China university directory unavailable:', error);
    return [];
  }
}

export default async function ChinaUniversitiesPage() {
  const universities = await getChinaUniversities();
  const cities = new Set(universities.map(item => item.city).filter(Boolean)).size;
  const programs = new Set(universities.flatMap(item => item.programs?.map(program => program.name || '').filter(Boolean) || item.details?.majors || [])).size;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: 'Universities and Study Options in China for Bangladeshi Students', dateModified: '2026-07-19', inLanguage: 'en-BD' },
      { '@type': 'ItemList', '@id': `${canonical}#directory`, numberOfItems: universities.length, itemListElement: universities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `https://eduexpressint.com/universities/${item.slug}` })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' },
        { '@type': 'ListItem', position: 2, name: 'Study in China', item: 'https://eduexpressint.com/study-in-china-from-bangladesh' },
        { '@type': 'ListItem', position: 3, name: 'China universities', item: canonical },
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
            <nav className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/50" aria-label="Breadcrumb"><Link href="/">Home</Link> <span aria-hidden="true">/</span> <Link href="/study-in-china-from-bangladesh">Study in China</Link> <span aria-hidden="true">/</span> China universities</nav>
            <p className="mt-8 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">China university evidence desk</p>
            <h1 className="mt-4 max-w-4xl text-balance font-heading text-4xl font-bold leading-tight sm:text-6xl">Universities and Study Options in China for Bangladeshi Students</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/70">Search the university records currently loaded in the EduExpress directory. Compare study level, teaching language, city, majors, recorded tuition and intake data, then confirm every time sensitive fact before applying.</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/15">
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{universities.length}</strong><span className="mt-2 block text-xs text-white/55">Active China records loaded</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">134+</strong><span className="mt-2 block text-xs text-white/55">Wider collaboration network</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{cities}</strong><span className="mt-2 block text-xs text-white/55">Cities represented</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{programs}</strong><span className="mt-2 block text-xs text-white/55">Structured program names</span></div>
          </div>
        </div>
      </header>

      <section className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-[#174f7a]/15 sm:grid-cols-3">
          {[
            [Database, `${universities.length} database records`, 'These are the active records currently available for comparison.'],
            [SearchCheck, '2027 detail check included', 'Every shortlisted option receives a fresh program and source review before application.'],
            [ShieldCheck, 'Program aligned application', 'Program, deadline, eligibility and fees are confirmed together before proceeding.'],
          ].map(([Icon, title, text]) => (
            <div key={String(title)} className="flex gap-4 bg-white p-5"><span className="grid size-10 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a]"><Icon size={20} /></span><div><strong className="text-sm">{String(title)}</strong><p className="mt-1 text-xs leading-5 text-slate-500">{String(text)}</p></div></div>
          ))}
        </div>
      </section>

      <ChinaUniversityDirectory universities={universities} />

      <section className="bg-[#08263c] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-7 px-5 py-12 sm:px-8 lg:px-12 lg:grid-cols-[.7fr_.3fr] lg:items-center">
          <div><p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Need a shorter list?</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Match the directory to your actual profile</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">A counselor can screen academic eligibility, CSCA, English proof, cost and scholarship conditions before you choose a university route.</p></div>
          <Link href="/study-in-china-from-bangladesh#china-fit-form" className="flex min-h-14 items-center justify-center gap-2 bg-[#64b5df] px-5 text-sm font-black text-[#08263c]">Get My China Fit Assessment <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-8 text-xs leading-6 text-slate-500 sm:px-8 lg:px-12">
          <p><strong className="text-[#08263c]">2027 planning status:</strong> {universities.length} active China profiles are available for comparison. Each shortlisted university receives a current program, source, fee, scholarship and deadline check before the student proceeds.</p>
          <p className="mt-2"><strong className="text-[#08263c]">Last data review:</strong> 19 July 2026 <span aria-hidden="true">•</span> <strong className="text-[#08263c]">Next review:</strong> 19 October 2026</p>
        </div>
      </section>
    </article>
  );
}
