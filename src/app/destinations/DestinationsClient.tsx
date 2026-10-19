'use client';

import { ArrowRight, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { activeCountries } from '@/lib/countries';
import { destinationPath } from '@/lib/site-urls';

const destinationTones: Record<string, string> = {
  china: 'from-[#8b2d32] to-[#b7643f]',
  'south-korea': 'from-[#163b5b] to-[#4d6f8a]',
  uk: 'from-[#18355e] to-[#425f8d]',
  hungary: 'from-[#234a4b] to-[#527572]',
  finland: 'from-[#24485f] to-[#6d91a5]',
  cyprus: 'from-[#5a3d28] to-[#9b734d]',
  georgia: 'from-[#43345f] to-[#765f91]',
  malaysia: 'from-[#174f7a] to-[#3d8292]',
  malta: 'from-[#554238] to-[#9d765a]',
  greece: 'from-[#214b70] to-[#5e8cab]',
  thailand: 'from-[#51344e] to-[#8d5d79]',
  croatia: 'from-[#4f3d31] to-[#97765c]',
};

export default function DestinationsClient() {
  return (
    <div className="min-h-screen bg-white text-[#08263c]">
      <PageHeader
        title="Choose Your"
        highlight="Study Destination"
        description="Open a country route, compare the essentials and decide what fits your education and budget."
        icon={<Globe />}
        badgeText="Active destination services"
      />

      <section className="px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#174f7a]">Explore by country</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">One clear starting point for every route.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">All 12 destination services are open. China remains our flagship because it has the deepest published EduExpress evidence base.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activeCountries.map((country) => {
              const china = country.slug === 'china';
              const href = destinationPath(country.slug);
              const programs = country.programs.slice(0, 3);

              return (
                <Link
                  key={country.slug}
                  href={href}
                  className={`group relative min-h-[300px] overflow-hidden rounded-[1.75rem] border bg-gradient-to-br ${destinationTones[country.slug] || 'from-[#174f7a] to-[#476f89]'} transition hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(8,38,60,.14)] ${china ? 'border-[#08263c] md:col-span-2 xl:col-span-2' : 'border-[#174f7a]/12'}`}
                >
                  <span className={`pointer-events-none absolute -bottom-12 right-2 opacity-20 transition duration-700 group-hover:scale-105 ${china ? 'text-[15rem]' : 'text-[11rem]'}`} aria-hidden="true">{country.flag}</span>
                  <div className="pointer-events-none absolute -right-14 -top-16 size-56 rounded-full border-[2.5rem] border-white/10" />
                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-white sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#08263c]/70 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] backdrop-blur-sm">
                        <span className="size-1.5 rounded-full bg-[#64b5df]" /> {china ? 'Flagship destination' : 'Active route'}
                      </span>
                      <span className="grid size-12 place-items-center rounded-xl border border-white/20 bg-white/10 text-3xl backdrop-blur-sm" aria-hidden="true">{country.flag}</span>
                    </div>
                    <div>
                      <h2 className={`font-heading font-bold tracking-[-0.035em] ${china ? 'text-4xl sm:text-5xl' : 'text-3xl'}`}>{country.name}</h2>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {programs.map(program => (
                          <span key={program} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">{program}</span>
                        ))}
                      </div>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#9bd8f3]">Explore {country.name} <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#dff3fb] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-[#174f7a]"><ShieldCheck size={23} /></span>
            <div><h2 className="text-xl font-extrabold">Not sure which country fits?</h2><p className="mt-1 text-sm text-slate-600">Compare education, affordability and entry requirements first.</p></div>
          </div>
          <Link href="/education-fit-assessment" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#08263c] px-6 text-sm font-black text-white">Start free assessment <ArrowRight size={15} /></Link>
        </div>
      </section>
    </div>
  );
}
