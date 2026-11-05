import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { countryCode } from '@/lib/country-code';

export type StampDestination = {
  slug: string;
  name: string;
  flag: string;
  href: string;
  status: string;
  description: string;
  image: string | null;
};

const tilts = ['-1.4deg', '1.1deg', '-0.7deg', '1.6deg', '-1.1deg', '0.8deg', '-1.7deg', '1.2deg'];

export default function DestinationStamps({ destinations }: { destinations: StampDestination[] }) {
  const flagship = destinations.find(destination => destination.status === 'Flagship') ?? destinations[0];
  const others = destinations.filter(destination => destination.slug !== flagship?.slug);
  if (!flagship) return null;

  return (
    <section className="home-paper px-5 py-section sm:px-8 lg:px-12">
      <div className="mx-auto max-w-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[56ch]">
            <p className="ed-label">Where you can study</p>
            <h2 className="mt-4 font-heading text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              China first, then the routes we can evidence.
            </h2>
            <p className="mt-4 max-w-[54ch] text-[15px] leading-7 text-ink-soft">
              Every destination carries its current counselling status. China holds our deepest evidence base; the
              others are offered only where we can answer recognition, cost and visa questions honestly.
            </p>
          </div>
          <Link href="/destinations" className="ed-btn ed-btn-outline min-h-11 shrink-0">
            All {destinations.length} routes <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8">
          <article className="group relative min-h-[380px] overflow-hidden rounded-3xl bg-petrol-800 lg:min-h-full">
            <Image
              src="/images/home/china-campus-life.webp"
              alt={`Bangladeshi students on campus in ${flagship.name}`}
              fill
              sizes="(max-width:1024px) 100vw, 600px"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/95 via-petrol-900/55 to-petrol-900/15" />

            <div className="absolute left-5 top-5 flex items-center gap-2">
              <span className="home-stamp bg-petrol-900/85 text-[13px] !text-marigold">Flagship route</span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-mint-300">{countryCode(flagship.slug)} · Deepest evidence base</p>
              <h3 className="mt-2 font-heading text-[clamp(1.8rem,3vw,2.5rem)] leading-tight">{flagship.name}</h3>
              <p className="mt-3 max-w-[44ch] text-[15px] leading-6 text-white/70 line-clamp-3">{flagship.description}</p>
              <Link href={flagship.href} className="ed-btn ed-btn-signal mt-5 min-h-11">
                Open the China guide <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>

          <ul className="grid grid-cols-2 content-start gap-3 sm:gap-4 xl:grid-cols-3">
            {others.map((destination, index) => (
              <li key={destination.slug}>
                <Link
                  href={destination.href}
                  className="home-stamp-card group flex h-full flex-col justify-between p-4"
                  style={{ '--tilt': tilts[index % tilts.length] } as CSSProperties}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="ed-figure text-[15px] font-semibold tracking-[0.08em] text-petrol-700">
                      {countryCode(destination.slug)}
                    </span>
                    <span
                      className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${
                        destination.status.toLowerCase().includes('paused') ? 'text-clay' : 'text-petrol-600'
                      }`}
                    >
                      {destination.status}
                    </span>
                  </div>

                  <div className="mt-5">
                    <span aria-hidden="true" className="text-[18px] leading-none">
                      {destination.flag}
                    </span>
                    <h3 className="mt-2 font-heading text-[17px] leading-tight text-ink group-hover:text-petrol-700">
                      {destination.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.55] text-ink-mute">{destination.description}</p>
                  </div>

                  <ArrowUpRight
                    size={14}
                    className="mt-4 self-end text-petrol-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
