import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, FileSearch, ShieldCheck } from 'lucide-react';
import { CtaBand, JsonLd, PageHero, Section, kit } from '@/components/page/PageKit';
import { pageMetadata } from '@/lib/seo';
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

const PATH = '/universities';
const canonical = `https://eduexpressint.com${PATH}`;
export const revalidate = 3600;
const programName = (value: string) => evergreenText(value).replace(/\s*\([^)]*\b(?:till|until|deadline)\b[^)]*\)/gi, '').trim();

type Query = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<Query> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await searchParams;
  return pageMetadata({
    title: 'University & Program Finder 2027 | EduExpress International',
    description: 'Find and compare 2027 universities, programs, tuition and scholarships across destinations. Verified fees, rankings and intake months with sources.',
    path: PATH,
    image: { url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — university and program finder' },
    // Filtered views (?country=…) are variants of the directory; only the clean URL is indexed.
    noindex: Object.values(query).some(value => Array.isArray(value) ? value.some(Boolean) : Boolean(value)),
  });
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
  const activeCount = universities.filter(u => u.isActive).length;
  const programCount = universities.reduce((count, u) => count + u.programs.length, 0);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#page`,
        url: canonical,
        name: 'Universities and Study Options',
        inLanguage: 'en-BD',
        isPartOf: { '@id': 'https://eduexpressint.com/#website' },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      { '@type': 'ItemList', numberOfItems: visibleUniversities.length, itemListElement: visibleUniversities.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: `${canonical}/${item.slug}` })) },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Universities' }]}
        eyebrow="Programme finder · 2027 cycle"
        title="Universities and study options, without the brochure."
        lead="Every record below carries its own fee, intake, scholarship and ranking source. Filter it like a directory, compare up to four, and read the profile before you shortlist."
        actions={
          <>
            <a href="#university-results" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Search the directory <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-outline min-h-[52px] px-7">Ask for a shortlist</Link>
          </>
        }
        aside={
          <div className={kit.cardDark}>
            <p className="text-[15px] font-semibold text-white/80">In the directory today</p>
            <dl className="mt-5 grid grid-cols-3 gap-4">
              <div className="flex flex-col-reverse">
                <dt className="mt-2 text-[14px] leading-5 text-white/80">{activeCount === 1 ? 'university' : 'universities'}</dt>
                <dd className="font-display text-[40px] font-black leading-none text-lime">{activeCount}</dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="mt-2 text-[14px] leading-5 text-white/80">programmes</dt>
                <dd className="font-display text-[40px] font-black leading-none text-lime">{programCount}</dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="mt-2 text-[14px] leading-5 text-white/80">{listedDestinations.length === 1 ? 'destination with data' : 'destinations with data'}</dt>
                <dd className="font-display text-[40px] font-black leading-none text-lime">{listedDestinations.length}</dd>
              </div>
            </dl>
            <Link href="/how-we-verify-universities" className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[16px] font-semibold text-white underline underline-offset-4">
              How records are verified <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        }
      />

      <section aria-label="Browse by destination" className="border-b border-canvas-soft bg-white py-7">
        <div className={kit.wrap}>
          <nav aria-label="Browse verified universities by destination" className="flex flex-wrap items-center gap-2">
            {listedDestinations.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-canvas-soft px-4 text-[15px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale"
              >
                <span aria-hidden="true" className="text-[14px] font-semibold text-ink-soft">{countryCode(item.name.toLowerCase().replace(/\s+/g, '-'))}</span>
                {item.name}
                <span className="rounded-full bg-white px-2 text-[14px] text-ink-soft">{item.count}</span>
              </Link>
            ))}
            {guideDestinations.length > 0 && (
              <span className="text-[14px] text-ink-soft">{guideDestinations.length} further destinations are counselling-only — see the <Link href="/destinations" className="font-semibold text-petrol-800 underline underline-offset-4">destinations hub</Link></span>
            )}
          </nav>

          <nav aria-label="Popular university study routes" className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[15px] font-semibold">
            <Link href="/universities?country=China&search=medicine" className="inline-flex min-h-[44px] items-center text-petrol-800 underline-offset-4 hover:underline">
              Medicine in China
            </Link>
            <Link href="/mbbs-in-china-bangladesh" className="inline-flex min-h-[44px] items-center text-petrol-800 underline-offset-4 hover:underline">
              MBBS fees and admission
            </Link>
            <Link href="/china-scholarships-bangladesh" className="inline-flex min-h-[44px] items-center text-petrol-800 underline-offset-4 hover:underline">
              China scholarships
            </Link>
            <Link href="/how-we-verify-universities" className="inline-flex min-h-[44px] items-center text-ink-soft underline-offset-4 hover:text-petrol-800 hover:underline">
              How records are verified
            </Link>
          </nav>
        </div>
      </section>

      <div className="bg-white pt-8">
        <Suspense fallback={<div className="px-5 py-20 text-center text-[16px] text-ink-soft sm:px-8">Loading the directory…</div>}>
          <UniversitiesClient initialUniversities={universities} />
        </Suspense>
      </div>

      <Section tone="sage" title="How we keep the directory honest." intro="Tuition, scholarship and ranking entries link to their official source records inside each profile.">
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-3">
          <article className={kit.card}>
            <span className={kit.iconLime}><FileSearch size={22} aria-hidden="true" /></span>
            <h3 className={`mt-6 ${kit.h3}`}>Sources on every record</h3>
            <p className="mt-2 text-[16px] leading-7 text-ink-soft">
              Each record stores the official institution name, source URL, recognition notes, exact program names, tuition periods,
              intake dates and the date each fact was checked.
            </p>
          </article>
          <article className={kit.card}>
            <span className={kit.iconLime}><ShieldCheck size={22} aria-hidden="true" /></span>
            <h3 className={`mt-6 ${kit.h3}`}>No estimates as facts</h3>
            <p className="mt-2 text-[16px] leading-7 text-ink-soft">
              Where a figure is under verification, the profile says so. We do not publish estimates as facts.
            </p>
          </article>
          <article className={kit.cardDark}>
            <h3 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">Honest relationship labels</h3>
            <p className="mt-2 text-[16px] leading-7 text-white/80">
              Direct partner, authorized representative, network access and public direct application are different relationships. We
              use &ldquo;partner&rdquo; only when supporting evidence is current.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1">
              <Link href="/fees-and-transparency" className="inline-flex min-h-[44px] items-center gap-1.5 text-[16px] font-semibold text-white underline underline-offset-4">Fee policy</Link>
              <Link href="/how-we-verify-universities" className="inline-flex min-h-[44px] items-center gap-1.5 text-[16px] font-semibold text-white underline underline-offset-4">Verification method</Link>
            </div>
          </article>
        </div>
      </Section>

      <CtaBand
        title="Want a shortlist instead?"
        text="Tell us your results, budget and preferred intake. A counsellor checks which universities in the directory are realistic for you, with the costs and documents in writing."
      />
    </>
  );
}
