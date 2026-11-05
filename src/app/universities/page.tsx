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
import { countryCode } from '@/lib/country-code';

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
    openGraph: {
      title: 'University & Program Finder 2027',
      description: 'Compare 2027 universities, programs, tuition, scholarships and intake months with source records.',
      url: canonical,
      type: 'website',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — university and program finder' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'University & Program Finder 2027',
      description: 'Compare 2027 universities, programs, tuition, scholarships and intake months with source records.',
      images: ['/og-image.jpg'],
    },
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
    <article className="bg-chalk pt-[74px] text-ink lg:pt-[108px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="border-b border-rule px-5 pb-8 pt-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="ed-label">Programme finder · 2027 cycle</p>
              <h1 className="mt-4 max-w-[24ch] ed-home-display text-[clamp(2.1rem,4.4vw,3.5rem)] leading-[1.02] text-ink">
                Universities and study options, without the brochure.
              </h1>
              <p className="mt-4 max-w-[58ch] text-[14.5px] leading-7 text-ink-soft">
                Every record below carries its own fee, intake, scholarship and ranking source. Filter it like a directory, compare up to four, and read the profile before you shortlist.
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-6 border-t border-rule pt-4 lg:border-t-0 lg:pt-0">
              <div>
                <dd className="ed-figure text-[28px] leading-none text-petrol-700">{universities.filter(u => u.isActive).length}</dd>
                <dt className="mt-1 text-[11.5px] text-ink-mute">universities</dt>
              </div>
              <div>
                <dd className="ed-figure text-[28px] leading-none text-petrol-700">{universities.reduce((count, u) => count + u.programs.length, 0)}</dd>
                <dt className="mt-1 text-[11.5px] text-ink-mute">programmes</dt>
              </div>
              <div>
                <dd className="ed-figure text-[28px] leading-none text-petrol-700">{listedDestinations.length}</dd>
                <dt className="mt-1 text-[11.5px] text-ink-mute">destinations with data</dt>
              </div>
            </dl>
          </div>

          <nav aria-label="Browse verified universities by destination" className="mt-7 flex flex-wrap items-center gap-2">
            {listedDestinations.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex min-h-8 items-center gap-2 border border-rule-strong bg-white px-2.5 text-[12px] font-medium text-ink transition-colors hover:border-petrol-500 hover:text-petrol-700"
              >
                <span aria-hidden="true" className="text-[10.5px] font-semibold text-ink-mute">{countryCode(item.name.toLowerCase().replace(/\s+/g, '-'))}</span>
                {item.name}
                <span className="ed-figure text-[11px] text-ink-mute">{item.count}</span>
              </Link>
            ))}
            {guideDestinations.length > 0 && (
              <span className="text-[11.5px] text-ink-mute">{guideDestinations.length} further destinations are counselling-only — see the destinations menu</span>
            )}
          </nav>

          <nav aria-label="Popular university study routes" className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] font-semibold">
            <Link href="/universities?country=China&search=medicine" className="inline-flex min-h-9 items-center text-petrol-600 underline-offset-4 hover:underline">
              Medicine in China
            </Link>
            <Link href="/mbbs-in-china-bangladesh" className="inline-flex min-h-9 items-center text-petrol-600 underline-offset-4 hover:underline">
              MBBS fees and admission
            </Link>
            <Link href="/how-we-verify-universities" className="inline-flex min-h-9 items-center text-ink-mute underline-offset-4 hover:text-petrol-600 hover:underline">
              How records are verified
            </Link>
          </nav>
        </div>
      </header>

      <Suspense fallback={<div className="px-5 py-20 text-center text-[13px] text-ink-mute sm:px-8">Loading the directory…</div>}>
        <UniversitiesClient initialUniversities={universities} />
      </Suspense>

      <footer className="border-t border-rule bg-white px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-shell flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-3xl text-[11.5px] leading-6 text-ink-mute">
            Tuition, scholarship and ranking entries link to their official source records inside each profile. Where a figure is under verification, the profile says so — we do not publish estimates as facts.
          </p>
          <nav aria-label="Directory transparency" className="flex shrink-0 flex-wrap gap-x-5 gap-y-1 text-[12px] font-semibold">
            <Link href="/fees-and-transparency" className="inline-flex min-h-8 items-center text-petrol-600 hover:underline">
              Fee policy
            </Link>
            <Link href="/how-we-verify-universities" className="inline-flex min-h-8 items-center text-petrol-600 hover:underline">
              Verification method
            </Link>
          </nav>
        </div>
      </footer>
    </article>
  );
}
