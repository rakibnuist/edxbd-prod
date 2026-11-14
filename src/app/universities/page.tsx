import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Check,
  Globe2,
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
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
        return {
          name: programName(program.name), level: normalizeProgramLevel(program.level), languages: program.languages,
          subject: programName(program.name), duration: evergreenText(program.duration), intakes: intakeMonths([program.intake || '', ...(prior?.intakes || [])]),
          tuition: tuition ? feeText(tuition) : undefined, eligibility: [...program.qualifications, ...program.languageRequirements, ...program.notes], sourceUrl: prior?.sourceUrl,
          status: prior?.status === 'active' ? 'active' as const : 'planned' as const,
        };
      }) : [];
      // Stored programme records the detailed profile does not cover
      const covered = new Set((profile?.programs || []).map(program => programMergeKey(program.level, program.name)));
      programs.push(...record.programs
        .filter(program => !covered.has(programMergeKey(program.level, program.name)))
        .map(program => ({ ...program, name: programName(program.name), ...(program.subject ? { subject: programName(program.subject) } : {}), intakes: intakeMonths(program.intakes) })));
      const { id, slug, name, aliases, city, country, isActive, degree, taught, intake, details, scholarships } = record;
      const relationshipLabels = { direct_partner: 'Direct university partner', authorized_representative: 'Authorized representative', network_access: 'Network access', public_direct_application: 'Public direct application' } as const;
      return {
        id, slug, name, aliases, city, country, isActive, degree, taught, intake, details, scholarships, programs, logo: universityProfileLogo(record),
        verification: { status: record.verificationStatus, ...(record.lastVerifiedAt ? { lastVerifiedAt: record.lastVerifiedAt } : {}) },
        ...(record.relationshipType && record.relationshipType !== 'unverified' && relationshipLabels[record.relationshipType] ? { relationship: relationshipLabels[record.relationshipType] } : {}),
        clearCost: record.costPlans.some(plan => plan.isPublished),
        publishedRankings: rankings.length
          ? rankings.map(({ publisher, rank, scope, subject }) => ({ publisher, rank, scope, ...(subject ? { subject } : {}) }))
          : [
              ...(record.rankings.world ? [{ publisher: 'QS', rank: String(record.rankings.world), scope: 'world' as const }] : []),
              ...(record.rankings.country || record.rankings.national
                ? [{ publisher: 'National', rank: String(record.rankings.country || record.rankings.national), scope: 'national' as const }]
                : []),
            ],
        ...(awards.length ? {
          fundingRoutes: awards.map(award => ({
            title: award.title, value: scholarshipReductionLabel(award) || award.coverage[0] || '', levels: award.levels,
            ...(award.languages ? { languages: award.languages } : {}),
            ...((award.programNames?.length || award.programIds?.length) ? { programNames: [...new Set([...(award.programNames || []), ...(award.programIds || []).flatMap(id => profile?.programs.filter(program => program.id === id).map(program => program.name) || [])])] } : {}),
          }))
        } : {}),
      };
    }));
  } catch (err) {
    console.error('getUniversities error in /universities:', err);
    return [];
  }
}

export default async function UniversitiesPage({ searchParams }: Props) {
  const universities = await getUniversities();
  const query = await searchParams;
  const params = new URLSearchParams(Object.entries(query).flatMap(([key, value]) => value ? [[key, Array.isArray(value) ? value[0] : value]] : []));
  const activeCountryParam = params.get('country') || '';
  const matching = filterUniversities(universities, readDirectoryFilters(params));
  const rawLimit = params.get('limit') || '12';
  const limit = /^\d+$/.test(rawLimit) ? Math.max(12, Math.min(Number(rawLimit), universities.length || 12)) : 12;
  const visibleUniversities = matching.slice(0, limit);

  const destinations = activeCountries.map(country => {
    const inDirectory = universities.filter(university => university.isActive && university.country.toLowerCase() === country.name.toLowerCase()).length;
    return {
      name: country.name, flag: country.flag, count: inDirectory,
      href: inDirectory ? '/universities?country=' + encodeURIComponent(country.name) : destinationPath(country.slug),
      hasDirectoryData: inDirectory > 0,
    };
  });
  const listedDestinations = destinations.filter(item => item.hasDirectoryData).sort((a, b) => b.count - a.count);
  const activeCount = universities.filter(u => u.isActive).length;
  const programCount = universities.reduce((count, u) => count + u.programs.length, 0);
  const scholarshipCount = universities.filter(u => u.isActive && (u.fundingRoutes?.length || u.scholarships.some(item => item.status !== 'closed'))).length;

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
      {
        '@type': 'ItemList',
        numberOfItems: visibleUniversities.length,
        itemListElement: visibleUniversities.map((item, index) => ({
          '@type': 'ListItem', position: index + 1, name: item.name, url: `${canonical}/${item.slug}`
        })),
      },
    ],
  };

  const now = requestTime();
  const openDeadlines = await getPublishedUpdates(undefined, false)
    .then(updates => openByDeadline(updates.filter(update => !update.archived), now).slice(0, 4))
    .catch(() => []);
  const waNumber = config.contact.whatsapp.replace(/\D/g, '');
  const formWa = `https://wa.me/${waNumber}?text=${encodeURIComponent('Assalamu alaikum. I am looking at universities on your website. Please suggest a shortlist for me.')}`;

  const quickPicks = [
    { href: '/universities?country=Malaysia', label: '🇲🇾 Malaysia (9)' },
    { href: '/universities?country=China', label: '🇨🇳 China (110)' },
    { href: '/universities?scholarship=1', label: '🎁 Scholarships Available' },
    { href: '/universities?language=English', label: '🌐 English-Taught' },
    { href: '/universities?search=Computer', label: '💻 Computer Science' },
    { href: '/universities?search=Medicine', label: '🩺 Medicine & MBBS' },
    { href: '/universities?level=Master', label: '🎓 Master’s Degrees' },
  ];

  return (
    <>
      <JsonLd data={schema} />

      {/* Global Hero Banner */}
      <section className="relative overflow-hidden bg-petrol-800 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-[-220px] size-[520px] rounded-full bg-lime/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 size-[400px] rounded-full bg-emerald-500/10 blur-3xl" />

        <div className={`${kit.wrap} relative py-12 sm:py-16 lg:py-20`}>
          <DarkCrumbs trail={[{ name: 'Universities' }]} path={PATH} />

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-end lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-lime">
                <GraduationCap size={16} aria-hidden="true" /> Global University Directory · 2027 Intakes
              </p>

              <h1 className="mt-4 font-display text-[40px] font-black leading-[0.98] tracking-[-0.015em] sm:text-[54px] lg:text-[62px]">
                Find your university. <span className="text-lime">Compare costs & scholarships.</span>
              </h1>

              <p className="mt-4 max-w-[58ch] text-[16px] leading-[1.6] text-white/80 sm:text-[18px]">
                Compare {activeCount} verified universities across China, Malaysia, the UK, and beyond. Itemized tuition in local currency and BDT, QS world rankings, official MQA/MoE accreditations, and transparent scholarship routes.
              </p>

              {/* Search Bar */}
              <form action="/universities" method="get" role="search" className="mt-7 flex max-w-2xl flex-col gap-2 rounded-[28px] bg-white p-2 shadow-2xl sm:flex-row">
                <label htmlFor="hero-university-search" className="sr-only">Search universities, cities or subjects</label>
                <div className="relative flex-1">
                  <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" aria-hidden="true" />
                  <input
                    id="hero-university-search"
                    name="search"
                    type="search"
                    defaultValue={params.get('search') || ''}
                    placeholder="Search by university name, city, or major (e.g. Computer Science, Sunway)..."
                    className="h-[52px] w-full rounded-full bg-transparent pl-12 pr-4 text-[15px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button type="submit" className="ed-btn ed-btn-signal min-h-[52px] px-8 text-sm">
                  Search Directory <ArrowRight size={17} aria-hidden="true" />
                </button>
              </form>

              {/* Quick Search Chips */}
              <nav aria-label="Popular searches" className="mt-5 flex flex-wrap gap-2">
                {quickPicks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex min-h-9 items-center rounded-full bg-white/10 px-3.5 text-xs font-semibold text-white/90 transition-all hover:bg-lime/25 hover:text-lime"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="flex items-center gap-4 rounded-3xl bg-white/[0.08] p-5 ring-1 ring-white/10 backdrop-blur-sm">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-lime/20 text-lime">
                  <Building2 size={24} />
                </span>
                <div>
                  <dd className="font-display text-3xl font-black text-lime leading-tight">{activeCount}</dd>
                  <dt className="text-xs font-medium text-white/80">Verified Universities on File</dt>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-3xl bg-white/[0.08] p-5 ring-1 ring-white/10 backdrop-blur-sm">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-lime/20 text-lime">
                  <BookOpen size={24} />
                </span>
                <div>
                  <dd className="font-display text-3xl font-black text-lime leading-tight">{programCount}+</dd>
                  <dt className="text-xs font-medium text-white/80">Programs with Itemized Fees</dt>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-3xl bg-white/[0.08] p-5 ring-1 ring-white/10 backdrop-blur-sm">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-lime/20 text-lime">
                  <Award size={24} />
                </span>
                <div>
                  <dd className="font-display text-3xl font-black text-lime leading-tight">{scholarshipCount}</dd>
                  <dt className="text-xs font-medium text-white/80">Active Scholarship Programs</dt>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Tabs Bar */}
      {listedDestinations.length > 0 && (
        <nav aria-label="Browse verified universities by destination" className="sticky top-0 z-20 border-b border-rule bg-white/95 py-3.5 backdrop-blur-md shadow-sm">
          <div className={`${kit.wrap} flex flex-wrap items-center gap-2`}>
            <Link
              href="/universities"
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-full px-4 text-xs font-bold transition-all ${
                !activeCountryParam
                  ? 'bg-petrol-800 text-white shadow-sm'
                  : 'bg-canvas-soft text-slate-700 hover:bg-lime/25'
              }`}
            >
              <span>🌐</span>
              All Destinations
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${!activeCountryParam ? 'bg-white/20 text-white' : 'bg-white text-slate-700'}`}>
                {activeCount}
              </span>
            </Link>

            {listedDestinations.map((item) => {
              const isSelected = activeCountryParam.toLowerCase() === item.name.toLowerCase();
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-full px-4 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-petrol-800 text-white shadow-sm'
                      : 'bg-canvas-soft text-slate-700 hover:bg-lime/25'
                  }`}
                >
                  <span className="text-sm">{item.flag || '🏛️'}</span>
                  {item.name}
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700'}`}>
                    {item.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Directory & Facet Filter Section */}
      <div className="bg-[#f8fafc] pt-6">
        <Suspense fallback={<div className="px-5 py-24 text-center text-base font-semibold text-slate-600">Loading university catalog…</div>}>
          <UniversitiesClient directory={compactDirectory(universities)} />
        </Suspense>
      </div>

      {/* Open Scholarship Deadlines */}
      {openDeadlines.length > 0 && (
        <section aria-labelledby="open-deadlines" className="border-t border-slate-200 bg-white py-14">
          <div className={kit.wrap}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Time-Sensitive Deadlines</span>
                <h2 id="open-deadlines" className="mt-1 font-display text-2xl font-black text-petrol-800 sm:text-3xl">
                  Scholarship Applications Open Now
                </h2>
              </div>
              <Link href="/updates" className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold text-petrol-800 underline-offset-4 hover:underline">
                View All Scholarship Deadlines <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {openDeadlines.map(update => (
                <li key={update.id}><UpdateCard update={update} now={now} variant="row" /></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Bottom Shortlist Conversion Section */}
      <section id="shortlist" className="scroll-mt-24 bg-petrol-800 py-16 text-white lg:py-20" data-cta-band>
        <div className={`${kit.wrap} grid gap-10 lg:grid-cols-[1fr_.95fr] lg:items-center lg:gap-16`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-lime">Free Expert Guidance</span>
            <h2 className="mt-1 font-display text-[36px] font-black leading-[0.98] text-white sm:text-[48px]">
              Get a customized university shortlist.
            </h2>
            <p className="mt-4 max-w-xl text-[16px] leading-[1.6] text-white/85">
              Submit your academic transcripts, budget, and career goals. An EduExpress counselor matches you with the right universities and scholarships, with every cost itemized in writing before you commit.
            </p>
            <ul className="mt-6 grid gap-2.5 text-sm text-white/85">
              <li className="flex gap-2.5">
                <Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                Matched to your CGPA, IELTS, or medium-of-instruction pathway
              </li>
              <li className="flex gap-2.5">
                <Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                Tuition, hostel, and monthly living costs in writing (MYR, RMB, BDT)
              </li>
              <li className="flex gap-2.5">
                <Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                BDT 0 agency service charge for Malaysia · Visa-First pledge for China
              </li>
            </ul>
            <p className="mt-6 flex items-center gap-2 text-xs text-white/60">
              <ShieldCheck size={16} className="text-lime" aria-hidden="true" />
              Fees, accreditations, and rankings verified at source.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-1 text-ink shadow-2xl">
            <HomeLeadForm
              whatsappHref={formWa}
              source="universities_finder"
              topic="University shortlist from the finder"
              eyebrow="Free shortlist"
              heading="Which universities fit me?"
              intro="Share a few details. A counselor calls you within one working day."
            />
          </div>
        </div>
      </section>
    </>
  );
}
