import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, Check, GraduationCap, Search, ShieldCheck } from 'lucide-react';
import { JsonLd, kit } from '@/components/page/PageKit';
import DarkCrumbs from '@/components/page/DarkCrumbs';
import HomeLeadForm from '@/components/lead/HomeLeadForm';
import UpdateCard from '@/components/updates/UpdateCard';
import { getPublishedUpdates } from '@/lib/content-records';
import { config } from '@/lib/config';
import { openByDeadline, requestTime } from '@/lib/update-deadlines';
import { pageMetadata } from '@/lib/seo';
import UniversitiesClient from './UniversitiesClient';
import { compactDirectory } from '@/lib/university-directory-compact';
import { getUniversityRankings } from '@/lib/university-rankings';
import { getAllUniversityProfileDetails } from '@/lib/university-profile-details';
import { getUniversityRecords } from '@/lib/university-records';
import { filterUniversities, intakeMonths, readDirectoryFilters, type DirectoryUniversity } from '@/lib/university-directory';
import { feeText, normalizeProgramLevel, programMergeKey } from '@/lib/university-profile-view';
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
      const programs: DirectoryUniversity['programs'] = profile?.programs.length ? profile.programs.map(program => {
        const prior = record.programs.find(item => item.name === program.name && normalizeProgramLevel(item.level) === normalizeProgramLevel(program.level));
        const tuition = program.fees.find(fee => fee.key === 'tuition' && !fee.optional);
        return { name: programName(program.name), level: normalizeProgramLevel(program.level), languages: program.languages,
          subject: programName(program.name), duration: evergreenText(program.duration), intakes: intakeMonths([program.intake || '', ...(prior?.intakes || [])]),
          tuition: tuition ? feeText(tuition) : undefined, eligibility: [...program.qualifications, ...program.languageRequirements, ...program.notes], sourceUrl: prior?.sourceUrl,
          status: prior?.status === 'active' ? 'active' as const : 'planned' as const,
        };
      }) : [];
      // Stored programme records the detailed profile does not cover (e.g. imported 2027 catalogues).
      const covered = new Set((profile?.programs || []).map(program => programMergeKey(program.level, program.name)));
      programs.push(...record.programs
        .filter(program => !covered.has(programMergeKey(program.level, program.name)))
        .map(program => ({ ...program, name: programName(program.name), ...(program.subject ? { subject: programName(program.subject) } : {}), intakes: intakeMonths(program.intakes) })));
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

  const now = requestTime();
  const openDeadlines = await getPublishedUpdates(undefined, false)
    .then(updates => openByDeadline(updates.filter(update => !update.archived), now).slice(0, 4))
    .catch(() => []);
  const scholarshipCount = universities.filter(u => u.isActive && (u.fundingRoutes?.length || u.scholarships.some(item => item.status !== 'closed'))).length;
  const waNumber = config.contact.whatsapp.replace(/\D/g, '');
  const formWa = `https://wa.me/${waNumber}?text=${encodeURIComponent('Assalamu alaikum. I am looking at universities on your website. Please suggest a shortlist for me.')}`;
  const quickPicks: [string, string][] = [
    ['/universities?scholarship=1', 'Scholarships available'],
    ['/universities?language=English', 'English-taught'],
    ['/universities?search=medicine', 'Medicine & MBBS'],
    ['/universities?city=Beijing', 'Beijing'],
    ['/universities?city=Shanghai', 'Shanghai'],
    ['/universities?level=Master', 'Master’s programmes'],
  ];

  return (
    <>
      <JsonLd data={schema} />

      <section className="relative overflow-hidden bg-petrol-800 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-[-220px] size-[520px] rounded-full bg-lime/10 blur-3xl" />
        <div className={`${kit.wrap} relative py-12 sm:py-16 lg:py-20`}>
          <DarkCrumbs trail={[{ name: 'Universities' }]} path={PATH} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[14px] font-semibold text-lime">
                <GraduationCap size={16} aria-hidden="true" /> University finder · 2027 intake
              </p>
              <h1 className="mt-5 font-display text-[42px] font-black leading-[0.95] tracking-[-0.015em] sm:text-[60px] lg:text-[68px]">
                Find your university in China, <span className="text-lime">with the scholarship.</span>
              </h1>
              <p className="mt-5 max-w-[56ch] text-[18px] leading-[1.6] text-white/80">
                Compare {activeCount} universities by tuition, ranking, intake and scholarship, then let a counsellor check which ones you can realistically get.
              </p>
              <form action="/universities" method="get" role="search" className="mt-7 flex max-w-2xl flex-col gap-2 rounded-[28px] bg-white p-2 sm:flex-row">
                <label htmlFor="hero-university-search" className="sr-only">Search universities, cities or subjects</label>
                <div className="relative flex-1">
                  <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" aria-hidden="true" />
                  <input
                    id="hero-university-search"
                    name="search"
                    type="search"
                    placeholder="University, city or subject (e.g. computer science)"
                    className="h-[52px] w-full rounded-full bg-transparent pl-12 pr-4 text-[16px] text-ink outline-none placeholder:text-ink-mute"
                  />
                </div>
                <button type="submit" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                  Search <ArrowRight size={18} aria-hidden="true" />
                </button>
              </form>
              <nav aria-label="Popular searches" className="mt-4 flex flex-wrap gap-2">
                {quickPicks.map(([href, label]) => (
                  <Link key={href} href={href} className="inline-flex min-h-10 items-center rounded-full bg-white/10 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-white/20">
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
            <dl className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {[
                [String(activeCount), activeCount === 1 ? 'university' : 'universities'],
                [String(programCount), 'programmes with fees'],
                [String(scholarshipCount), 'with scholarships'],
              ].map(([value, label]) => (
                <div key={label} className="flex flex-col-reverse rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10 lg:flex-row-reverse lg:items-center lg:justify-end lg:gap-4">
                  <dt className="mt-1 text-[14px] leading-5 text-white/75 lg:mt-0 lg:text-[16px]">{label}</dt>
                  <dd className="font-display text-[32px] font-black leading-none text-lime sm:text-[40px]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {openDeadlines.length > 0 && (
        <section aria-labelledby="open-deadlines" className="border-b border-canvas-soft bg-canvas py-10">
          <div className={kit.wrap}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="open-deadlines" className="font-display text-[26px] font-black leading-none text-petrol-800 sm:text-[32px]">Scholarship deadlines open now</h2>
              <Link href="/updates" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-petrol-800 underline-offset-4 hover:underline">
                All scholarship updates <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {openDeadlines.map(update => (
                <li key={update.id}><UpdateCard update={update} now={now} variant="row" /></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {listedDestinations.length > 1 && (
        <nav aria-label="Browse verified universities by destination" className="border-b border-canvas-soft bg-white py-5">
          <div className={`${kit.wrap} flex flex-wrap items-center gap-2`}>
            {listedDestinations.map(item => (
              <Link key={item.name} href={item.href} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-canvas-soft px-4 text-[15px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale">
                <span aria-hidden="true" className="text-[14px] font-semibold text-ink-soft">{countryCode(item.name.toLowerCase().replace(/\s+/g, '-'))}</span>
                {item.name}
                <span className="rounded-full bg-white px-2 text-[14px] text-ink-soft">{item.count}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div className="bg-white pt-10">
        <Suspense fallback={<div className="px-5 py-20 text-center text-[16px] text-ink-soft sm:px-8">Loading the directory…</div>}>
          <UniversitiesClient directory={compactDirectory(universities)} />
        </Suspense>
      </div>

      <section id="shortlist" className="scroll-mt-24 bg-petrol-800 py-16 text-white lg:py-20" data-cta-band>
        <div className={`${kit.wrap} grid gap-10 lg:grid-cols-[1fr_.95fr] lg:items-center lg:gap-16`}>
          <div>
            <h2 className="font-display text-[38px] font-black leading-[0.95] tracking-[-0.01em] text-lime sm:text-[52px]">Get a free university shortlist.</h2>
            <p className="mt-5 max-w-xl text-[18px] leading-[1.6] text-white/85">
              Tell us your results, budget and preferred subject. Within one working day a counsellor sends the universities and scholarships that fit, with the full cost and the documents to prepare.
            </p>
            <ul className="mt-6 grid gap-2.5 text-[16px] text-white/85">
              <li className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> Matched to your CGPA, IELTS or no-IELTS route</li>
              <li className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> Tuition, hostel and living cost in writing</li>
              <li className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> Scholarship deadlines for each option</li>
            </ul>
            <p className="mt-6 flex items-center gap-2 text-[15px] text-white/60">
              <ShieldCheck size={16} aria-hidden="true" /> Fees and rankings link to official sources on each profile. <Link href="/how-we-verify-universities" className="underline underline-offset-4 hover:text-white">How we verify</Link>
            </p>
          </div>
          <div className="rounded-3xl bg-white p-1 text-ink">
            <HomeLeadForm
              whatsappHref={formWa}
              source="universities_finder"
              topic="University shortlist from the finder"
              eyebrow="Free shortlist"
              heading="Which universities fit me?"
              intro="Share a few details. A counsellor calls you within one working day."
            />
          </div>
        </div>
      </section>
    </>
  );
}
