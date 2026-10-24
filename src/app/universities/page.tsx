import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import UniversitiesClient from './UniversitiesClient';
import { getUniversityRankings } from '@/lib/university-rankings';
import { getAllUniversityProfileDetails } from '@/lib/university-profile-details';
import { getUniversityRecords } from '@/lib/university-records';
import { filterUniversities, intakeMonths, readDirectoryFilters } from '@/lib/university-directory';
import { feeText, normalizeProgramLevel } from '@/lib/university-profile-view';
import { evergreenText, prepareUniversityScholarship } from '@/lib/university-profile-public';
import { scholarshipReductionLabel } from '@/lib/university-scholarship-view';
import { universityProfileLogo } from '@/lib/university-profile-assets';

const canonical = 'https://eduexpressint.com/universities';
export const revalidate = 3600;
const programName = (value: string) => evergreenText(value).replace(/\s*\([^)]*\b(?:till|until|deadline)\b[^)]*\)/gi, '').trim();

type Query = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<Query> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await searchParams;
  return {
    title: { absolute: 'Universities and Study Options | EduExpress International' },
    description: 'Plan your 2027 study journey. Explore universities, rankings, scholarships, programs and tuition, and apply with EduExpress International.',
    alternates: { canonical },
    ...(Object.values(query).some(value => Array.isArray(value) ? value.some(Boolean) : Boolean(value)) ? { robots: { index: false, follow: true } } : {}),
  };
}

async function getUniversities() {
  try {
    const [records, profiles] = await Promise.all([getUniversityRecords(), getAllUniversityProfileDetails()]);
    return await Promise.all(records.map(async record => {
      const rankings = await getUniversityRankings(record.slug);
      const profile = profiles.find(profile => profile.slug === record.slug);
      const awards = profile?.scholarshipOptions?.map(prepareUniversityScholarship) || [];
      const programs = profile?.programs.length ? profile.programs.map(program => {
        const prior = record.programs.find(item => item.name === program.name && normalizeProgramLevel(item.level) === normalizeProgramLevel(program.level));
        const tuition = program.fees.find(fee => fee.key === 'tuition' && !fee.optional);
        return { name: programName(program.name), level: normalizeProgramLevel(program.level), languages: program.languages,
          subject: programName(program.name), duration: evergreenText(program.duration), intakes: intakeMonths([program.intake || '', ...(prior?.intakes || [])]),
          tuition: tuition ? feeText(tuition) : undefined, eligibility: [...program.qualifications, ...program.languageRequirements, ...program.notes], sourceUrl: prior?.sourceUrl,
          status: prior?.status === 'active' ? 'active' as const : 'planned' as const,
        };
      }) : record.programs.map(program => ({ ...program, name: programName(program.name), ...(program.subject ? { subject: programName(program.subject) } : {}), intakes: intakeMonths(program.intakes) }));
      const { id, slug, name, aliases, city, country, isActive, degree, taught, intake, details, scholarships } = record;
      return { id, slug, name, aliases, city, country, isActive, degree, taught, intake, details, scholarships, programs, logo: universityProfileLogo(record),
        publishedRankings: rankings.map(({ publisher, rank, scope, subject }) => ({ publisher, rank, scope, ...(subject ? { subject } : {}) })),
        ...(awards.length ? { fundingRoutes: awards.map(award => ({ title: award.title, value: scholarshipReductionLabel(award) || award.coverage[0] || '', levels: award.levels,
          ...(award.languages ? { languages: award.languages } : {}),
          ...((award.programNames?.length || award.programIds?.length) ? { programNames: [...new Set([...(award.programNames || []), ...(award.programIds || []).flatMap(id => profile?.programs.filter(program => program.id === id).map(program => program.name) || [])])] } : {}),
        })) } : {}),
      };
    }));
  } catch { return []; }
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
    <article className="bg-[#f4f6f7] pt-[76px] text-[#08263c] xl:pt-[112px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="bg-[#082d45] px-5 py-5 text-white sm:px-8 sm:py-7 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <h1 className="max-w-3xl font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.18] tracking-[-.025em]">Universities and Study Options</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#c4d6e2]">Find programs, costs and scholarships for your 2027 study plan.</p>
          <nav aria-label="Popular university study routes" className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold"><Link href="/universities?country=China&search=medicine" className="inline-flex min-h-10 items-center text-[#f0bc6a] hover:underline">Explore medicine in China</Link><Link href="/mbbs-in-china-bangladesh" className="inline-flex min-h-10 items-center text-white hover:underline">MBBS fees & admission guide</Link></nav>
        </div>
      </header>
      <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading study options…</div>}><UniversitiesClient initialUniversities={universities} /></Suspense>
    </article>
  );
}
