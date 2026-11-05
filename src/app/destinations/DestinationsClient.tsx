import { ArrowRight, ArrowUpRight, BadgeCheck } from 'lucide-react';
import Link from 'next/link';

import DestinationCover from '@/components/destinations/DestinationCover';
import { Section, kit } from '@/components/page/PageKit';
import { activeCountries } from '@/lib/countries';
import { countryCode } from '@/lib/country-code';
import { destinationPath } from '@/lib/site-urls';

/**
 * Destination directory: the flagship China route, then every other active
 * route as a photo card. Server-rendered (no client state), so every link and
 * description is in the HTML for crawlers.
 */
export default function DestinationsClient() {
  const flagship = activeCountries.find(country => country.slug === 'china');
  const others = activeCountries.filter(country => country.slug !== 'china');

  return (
    <>
      <Section
        title="Start with the route that has the clearest record."
        intro="Each destination page explains education fit, recognition, indicative costs, intakes, scholarships to check, visa steps and realistic work and career notes."
        action={
          <Link href="/compare-study-destinations" className="ed-btn ed-btn-outline min-h-[52px] px-7">
            Compare destinations side by side <ArrowRight size={18} aria-hidden="true" />
          </Link>
        }
      >
        {flagship && (
          <div data-anim="up">
            <article className="grid overflow-hidden rounded-3xl bg-canvas-soft lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[280px] lg:min-h-full">
                <DestinationCover slug={flagship.slug} name={flagship.name} flag={flagship.flag} sizes="(max-width:1024px) 100vw, 600px" />
                <span className={`absolute left-5 top-5 ${kit.badge}`}>Flagship route</span>
              </div>
              <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-12">
                <div>
                  <p className="flex items-center gap-3 text-[15px] font-semibold text-ink-soft">
                    <span className="text-3xl" aria-hidden="true">{flagship.flag}</span>
                    {countryCode(flagship.slug)} · Deepest evidence base
                  </p>
                  <h3 className="mt-4 font-display text-[34px] font-black leading-[0.98] tracking-[-0.01em] text-petrol-800 sm:text-[44px]">
                    Study in {flagship.name} from Bangladesh
                  </h3>
                  <p className={`mt-4 max-w-[56ch] ${kit.body}`}>{flagship.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {flagship.programs.slice(0, 6).map(program => (
                      <li key={program} className="rounded-full bg-white px-3.5 py-1.5 text-[14px] font-semibold text-petrol-800">
                        {program}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-[15px] text-ink-soft">
                    <BadgeCheck size={18} className="shrink-0 text-[#2ead4b]" aria-hidden="true" />
                    CSC scholarships · University records · Visa-first guidance
                  </p>
                  <Link href={destinationPath(flagship.slug)} className="ed-btn ed-btn-signal min-h-[52px] shrink-0 px-7">
                    Open China route <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}
      </Section>

      <Section tone="sage" title="Browse every route we actively support." intro="Sorted by current focus. Every route is reviewed against official sources.">
        <ul data-anim="stagger" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {others.map(country => (
            <li key={country.slug}>
              <Link
                href={destinationPath(country.slug)}
                className="group flex h-full flex-col rounded-3xl bg-white p-3 transition duration-200 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                  <DestinationCover
                    slug={country.slug}
                    name={country.name}
                    flag={country.flag}
                    sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 380px"
                    className="transition duration-500 group-hover:scale-105"
                    compact
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[14px] font-semibold text-petrol-800">
                    <span aria-hidden="true">{country.flag}</span> {country.serviceStatus || 'Active'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                  <h3 className={kit.h3}>Study in {country.name} from Bangladesh</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-[16px] leading-6 text-ink-soft">{country.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {country.programs.slice(0, 3).map(program => (
                      <span key={program} className="rounded-full bg-canvas-soft px-3 py-1 text-[14px] font-semibold text-petrol-800">
                        {program}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[16px] font-semibold text-petrol-800 underline-offset-4 group-hover:underline">
                    Costs, universities and visa <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
