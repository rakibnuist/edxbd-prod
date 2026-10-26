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
import { activeCountries } from '@/lib/countries';
import { destinationPath } from '@/lib/site-urls';

const canonical = 'https://eduexpressint.com/universities';
export const revalidate = 3600;
const programName = (value: string) => evergreenText(value).replace(/\s*\([^)]*\b(?:till|until|deadline)\b[^)]*\)/gi, '').trim();

type Query = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<Query> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await searchParams;
  return {
    title: { absolute: 'University & Program Finder 2027 | EduExpress International' },
    description: 'Find and compare 2027 universities, programs, tuition and scholarships across destinations. Verified fees, rankings and intake months with sources.',
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
      const relationshipLabels = { direct_partner: 'Direct university partner', authorized_representative: 'Authorized representative', network_access: 'Network access', public_direct_application: 'Public direct application' } as const;
      return { id, slug, name, aliases, city, country, isActive, degree, taught, intake, details, scholarships, programs, logo: universityProfileLogo(record),
        verification: { status: record.verificationStatus, ...(record.lastVerifiedAt ? { lastVerifiedAt: record.lastVerifiedAt } : {}) },
        ...(record.relationshipType && record.relationshipType !== 'unverified' && relationshipLabels[record.relationshipType] ? { relationship: relationshipLabels[record.relationshipType] } : {}),
        clearCost: record.costPlans.some(plan => plan.isPublished),
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
  // Crawlable destination quick-picks: destinations with verified directory
  // data filter the finder; launching destinations link to their country guide.
  const destinations = activeCountries.map(country => {
    const inDirectory = universities.filter(university => university.isActive && university.country === country.name).length;
    return {
      name: country.name, flag: country.flag, count: inDirectory,
      href: inDirectory ? '/universities?country=' + country.name : destinationPath(country.slug),
      hasDirectoryData: inDirectory > 0,
    };
  });
  const listedDestinations = destinations.filter(item => item.hasDirectoryData).sort((a, b) => b.count - a.count);
  const guideDestinations = destinations.filter(item => !item.hasDirectoryData);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${canonical}#page`, url: canonical, name: 'Universities and Study Options', inLanguage: 'en-BD' },
      { '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'EduExpress International', item: 'https://eduexpressint.com' },
        { '@type': 'ListItem', position: 2, name: 'Universities and Study Options', item: canonical },
      ] },
      { '@type': 'ItemList', numberOfItems: visibleUniversities.length, itemListElement: visibleUniversities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `${canonical}/${item.slug}` })) },
    ],
  };

  return (
    <article className="bg-[#f4f6f7] pt-[76px] text-[#08263c] xl:pt-[112px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="bg-[#082d45] px-5 py-5 text-white sm:px-8 sm:py-7 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f0bc6a]"><span aria-hidden="true">🎓</span>Program Finder 2027</p>
          <h1 className="max-w-3xl font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.18] tracking-[-.025em]">Universities and Study Options</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#c4d6e2]">Find and compare universities, programs, tuition and scholarships for your 2027 study plan across every destination we assess.</p>
          <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-xs">
            <div className="flex items-baseline gap-1.5"><dt className="sr-only">Universities listed</dt><dd className="text-lg font-bold tabular-nums">{universities.filter(u => u.isActive).length}</dd><dd className="text-[#8fa8b8]">universities</dd></div>
            <div className="flex items-baseline gap-1.5 border-l border-white/10 pl-5"><dt className="sr-only">Programs listed</dt><dd className="text-lg font-bold tabular-nums">{universities.reduce((count, u) => count + u.programs.length, 0)}</dd><dd className="text-[#8fa8b8]">programs</dd></div>
            <div className="flex items-baseline gap-1.5 border-l border-white/10 pl-5"><dt className="sr-only">Destinations with verified data</dt><dd className="text-lg font-bold tabular-nums">{listedDestinations.length}</dd><dd className="text-[#8fa8b8]">destinations with verified data</dd></div>
          </dl>
          <p className="mt-3 flex max-w-2xl items-start gap-1.5 text-[11px] leading-5 text-[#8fa8b8]"><span aria-hidden="true">✔</span>Fees, scholarships and rankings carry source records and verification dates in every university profile.</p>
                    <nav aria-label="Browse verified universities by destination" className="mt-4 flex flex-wrap gap-2">
            {listedDestinations.map(item => (
              <Link key={item.name} href={item.href} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20">
                <span aria-hidden="true">{item.flag}</span>{item.name}<span className="rounded-md bg-[#efa93d] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-[#08263c]">{item.count}</span>
              </Link>
            ))}
            {guideDestinations.length > 0 && <span className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-[#8fa8b8]">{guideDestinations.length} more destinations are launching — see the destinations menu</span>}
          </nav>
<nav aria-label="Popular university study routes" className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold"><Link href="/universities?country=China&search=medicine" className="inline-flex min-h-10 items-center text-[#f0bc6a] hover:underline">Explore medicine in China</Link><Link href="/mbbs-in-china-bangladesh" className="inline-flex min-h-10 items-center text-white hover:underline">MBBS fees & admission guide</Link></nav>
        </div>
      </header>
      <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading study options…</div>}><UniversitiesClient initialUniversities={universities} /></Suspense>
      <footer className="border-t border-[#d8e2e8] bg-white px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-3xl text-xs leading-6 text-slate-500">Tuition, scholarship and ranking entries in this directory link to their official source records inside each university profile. Where a figure is under verification, the profile says so — we do not publish estimates as facts. Compare before you commit.</p>
          <nav aria-label="Directory transparency" className="flex shrink-0 flex-wrap gap-x-5 gap-y-1 text-xs font-semibold">
            <Link href="/fees-and-transparency" className="inline-flex min-h-8 items-center text-[#174f7a] hover:underline">Fee &amp; transparency policy</Link>
            <Link href="/how-we-verify-universities" className="inline-flex min-h-8 items-center text-[#174f7a] hover:underline">How we verify universities</Link>
          </nav>
        </div>
      </footer>
    </article>
  );
}
