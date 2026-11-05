'use client';

import { ArrowRight, ArrowUpRight, BadgeCheck, Globe2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationCover from '@/components/destinations/DestinationCover';
import { activeCountries } from '@/lib/countries';
import { destinationPath } from '@/lib/site-urls';
import { countryCode } from '@/lib/country-code';

export default function DestinationsClient() {
  const flagship = activeCountries.find((country) => country.slug === 'china');
  const others = activeCountries.filter((country) => country.slug !== 'china');

  return (
    <main className="overflow-x-clip bg-chalk text-ink">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rule bg-chalk">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-20 size-[380px] rounded-full bg-sky-400/20 blur-[100px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-shell px-4 pb-16 pt-[104px] sm:px-6 lg:px-10 lg:pb-20 lg:pt-[142px]">
          <Breadcrumbs items={[{ name: 'Destinations' }]} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-rule bg-white px-3 py-1.5 text-[13px] font-semibold text-petrol-700">
                  <span className="size-1.5 rounded-full bg-jade" aria-hidden="true" />
                  {activeCountries.length} active destination services
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-white px-3 py-1.5 text-[13px] font-semibold text-ink-soft">
                  <Globe2 size={13} aria-hidden="true" /> Asia &amp; Europe
                </span>
              </div>
              <h1 className="ed-home-display mt-4 max-w-[16ch] text-[clamp(2.4rem,4.4vw,3.9rem)] text-ink">
                Study abroad destinations for Bangladeshi students
              </h1>
              <p className="mt-4 max-w-[56ch] text-[14.5px] leading-7 text-ink-soft">
                Compare recognition, tuition, living costs, scholarships, intakes and visa readiness across our active routes. China carries the deepest published evidence base; every route is reviewed against official sources.
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-12 px-6">
                  Start free education fit assessment <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/find-education" className="ed-btn ed-btn-outline min-h-12 bg-white px-6">
                  Research universities <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-mute">
                <li className="inline-flex items-center gap-1.5">
                  <BadgeCheck size={13} className="text-jade" aria-hidden="true" />
                  Evidence-based reviews
                </li>
                <li aria-hidden="true" className="text-ink-mute/40">·</li>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-jade" aria-hidden="true" />
                  Clear costs in writing
                </li>
                <li aria-hidden="true" className="text-ink-mute/40">·</li>
                <li>Reviewed 4 November 2026</li>
              </ul>
            </div>

            <div className="relative min-w-0">
              <figure className="overflow-hidden rounded-[20px] border border-rule bg-white p-2 shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-petrol-900">
                  <Image
                    src="/images/students/students-campus.webp"
                    alt="International students comparing study destinations"
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 560px"
                    className="ed-photo-settle object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/55 via-transparent to-transparent" aria-hidden="true" />
                  <figcaption className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 px-4 py-3 backdrop-blur">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-petrol-600">Compare before you commit</p>
                    <p className="mt-1 text-[14px] font-semibold leading-5 text-ink">
                      Fit • Recognition • Total cost • Visa readiness
                    </p>
                  </figcaption>
                </div>
              </figure>
              <div className="absolute -left-2 -top-4 hidden rounded-2xl border border-rule bg-white px-4 py-3 shadow-[0_18px_40px_-20px_rgba(7,28,46,0.35)] sm:block">
                <span className="ed-figure block text-[26px] leading-none text-petrol-700">{String(activeCountries.length).padStart(2, '0')}</span>
                <span className="mt-1 block text-[12px] font-bold uppercase tracking-[0.12em] text-ink-mute">active routes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section aria-label="Directory facts" className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-10">
        <dl className="mx-auto grid max-w-shell grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-rule bg-rule shadow-[0_30px_70px_-48px_rgba(15,53,87,0.5)] sm:grid-cols-4">
          <div className="bg-white px-5 py-5">
            <dt className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Active routes</dt>
            <dd className="mt-2 ed-home-display text-[32px] text-petrol-700">{activeCountries.length}</dd>
          </div>
          <div className="bg-white px-5 py-5">
            <dt className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Regions</dt>
            <dd className="mt-2 ed-home-display text-[32px] text-petrol-700">Asia & Europe</dd>
          </div>
          <div className="bg-white px-5 py-5">
            <dt className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Focus</dt>
            <dd className="mt-2 text-[14px] font-semibold text-ink">Recognition • Costs • Visa</dd>
          </div>
          <div className="bg-white px-5 py-5">
            <dt className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Guidance</dt>
            <dd className="mt-2 text-[14px] font-semibold text-ink">Written, evidence-first</dd>
          </div>
        </dl>
      </section>

      {/* Destinations list */}
      <section className="relative px-4 py-section sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark" aria-hidden="true" />
        <div className="relative mx-auto max-w-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[62ch]">
              <p className="ed-label">Explore by destination</p>
              <h2 className="ed-display mt-4 text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.06] text-ink">
                Start with the route that has the clearest record
              </h2>
              <p className="mt-4 max-w-[52ch] text-[14px] leading-7 text-ink-soft">
                Each destination page explains education fit, recognition, indicative costs, intakes, scholarships to check, visa steps and realistic work/career notes.
              </p>
            </div>
            <Link href="/compare-study-destinations" className="ed-btn ed-btn-outline min-h-11 w-fit shrink-0">
              Compare destinations side by side <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {flagship && (
            <article className="group mt-10 overflow-hidden rounded-[32px] border border-rule bg-white shadow-[0_30px_70px_-48px_rgba(15,53,87,0.5)]">
              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[280px] lg:min-h-full">
                  <DestinationCover
                    slug={flagship.slug}
                    name={flagship.name}
                    flag={flagship.flag}
                    sizes="(max-width:1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/90 via-petrol-900/40 to-transparent" aria-hidden="true" />
                  <div className="absolute inset-x-6 bottom-6">
                    <span className="ed-chip-dark">
                      <span className="ed-chip-dark-dot" aria-hidden="true" />
                      Flagship route
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-12">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl" aria-hidden="true">
                        {flagship.flag}
                      </span>
                      <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-ink-mute">
                        {countryCode(flagship.slug)} • Deepest evidence base
                      </p>
                    </div>
                    <h3 className="ed-display mt-4 text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.04] text-ink">
                      Study in {flagship.name} from Bangladesh
                    </h3>
                    <p className="mt-4 max-w-[56ch] text-[14px] leading-7 text-ink-soft">{flagship.description}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {flagship.programs.slice(0, 6).map((program) => (
                        <li
                          key={program}
                          className="rounded-full border border-rule-strong bg-chalk-100 px-3.5 py-1.5 text-[14px] font-semibold text-petrol-700"
                        >
                          {program}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-[15px] text-ink-soft">
                      <BadgeCheck size={16} className="text-jade" aria-hidden="true" />
                      CSC scholarships • University records • Visa-first guidance
                    </div>
                    <Link href={destinationPath(flagship.slug)} className="ed-btn ed-btn-primary min-h-11">
                      Open China route <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}

          <div className="mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="ed-label">All active destinations</p>
                <h2 className="mt-3 ed-home-display text-[clamp(1.7rem,2.8vw,2.3rem)] leading-tight text-ink">
                  Browse every route we actively support
                </h2>
              </div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-mute">
                Sorted by current focus
              </p>
            </div>

            <ul className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {others.map((country) => (
                <li key={country.slug}>
                  <Link
                    href={destinationPath(country.slug)}
                    className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-rule bg-white shadow-[0_24px_60px_-52px_rgba(15,53,87,0.5)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_34px_70px_-40px_rgba(15,53,87,0.42)]"
                  >
                    <div className="relative h-[150px] overflow-hidden">
                      <DestinationCover
                        slug={country.slug}
                        name={country.name}
                        flag={country.flag}
                        sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                        className="transition duration-500 group-hover:scale-[1.02]"
                        compact
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/85 via-petrol-900/30 to-transparent" aria-hidden="true" />
                      <div className="absolute inset-x-5 bottom-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl" aria-hidden="true">
                            {country.flag}
                          </span>
                          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/80">
                            {countryCode(country.slug)}
                          </span>
                        </div>
                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-white/80 backdrop-blur">
                          {country.serviceStatus || 'Active'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="ed-home-display text-[22px] leading-snug text-ink group-hover:text-petrol-700">
                          Study in {country.name} from Bangladesh
                        </h3>
                        <ArrowUpRight size={18} className="mt-1 shrink-0 text-petrol-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                      </div>
                      <p className="mt-2 flex-1 text-[15px] leading-6 text-ink-soft line-clamp-3">{country.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {country.programs.slice(0, 3).map((program) => (
                          <span
                            key={program}
                            className="rounded-full border border-rule bg-chalk-100 px-2.5 py-1 text-[13px] font-semibold text-ink-mute"
                          >
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-6 rounded-[28px] border border-rule bg-white p-6 shadow-[0_22px_50px_-44px_rgba(15,53,87,0.45)] sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid size-11 place-items-center rounded-2xl bg-mint-100 text-petrol-700">
                <ShieldCheck size={22} aria-hidden="true" />
              </span>
              <div>
                <h2 className="ed-home-display text-[21px] leading-tight text-ink">Not sure which country fits?</h2>
                <p className="mt-1 max-w-[56ch] text-[15px] leading-6 text-ink-soft">
                  Compare education quality, recognition, affordability and entry requirements side by side, then get a written shortlist based on your profile.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/compare-study-destinations" className="ed-btn ed-btn-outline min-h-11">
                Compare destinations
              </Link>
              <Link href="/education-fit-assessment" className="ed-btn ed-btn-primary min-h-11">
                Start free assessment <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
