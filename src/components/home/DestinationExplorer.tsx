'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { countryCode } from '@/lib/country-code';

export type ExplorerDestination = {
  slug: string;
  name: string;
  flag: string;
  href: string;
  status: string;
  description: string;
  image: string | null;
};

const statusTone = (status: string) =>
  status === 'Flagship' ? 'text-petrol-500' : status.toLowerCase().includes('paused') ? 'text-clay' : 'text-jade';

export default function DestinationExplorer({ destinations }: { destinations: ExplorerDestination[] }) {
  const [activeSlug, setActiveSlug] = useState(destinations[0]?.slug ?? '');
  const active = destinations.find(destination => destination.slug === activeSlug) ?? destinations[0];

  if (!active) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
      <div>
        <ul className="border-t border-rule">
          {destinations.map((destination, index) => {
            const selected = destination.slug === active.slug;
            return (
              <li key={destination.slug} className="border-b border-rule">
                <button
                  type="button"
                  onClick={() => setActiveSlug(destination.slug)}
                  aria-pressed={selected}
                  className={`flex w-full items-center gap-4 py-3 text-left transition-colors ${
                    selected ? 'text-petrol-700' : 'text-ink hover:text-petrol-600'
                  }`}
                >
                  <span className={`ed-figure w-6 shrink-0 text-[14px] ${selected ? 'text-marigold' : 'text-ink-mute'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true" className="min-w-6 text-center text-[12px] font-semibold text-ink-mute">
                    {countryCode(destination.slug)}
                  </span>
                  <span className={`min-w-0 flex-1 font-heading text-[19px] leading-tight ${selected ? '' : ''}`}>{destination.name}</span>
                  <span className={`shrink-0 text-[13px] font-semibold ${statusTone(destination.status)}`}>{destination.status}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 flex items-start gap-2 text-[14px] leading-5 text-ink-mute">
          <MapPin size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
          Status reflects the current counselling service, not a ranking of the country.
        </p>
      </div>

      <div aria-live="polite" className="border border-rule bg-white">
        <div className="relative h-56 overflow-hidden bg-petrol-800">
          {active.image ? (
            <Image
              src={active.image}
              alt={`Study in ${active.name} from Bangladesh`}
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center" aria-hidden="true">
              <span className="border border-white/25 px-4 py-2 font-heading text-4xl text-mint-300">{countryCode(active.slug)}</span>
            </div>
          )}
          <span className={`absolute left-0 top-0 bg-petrol-900/90 px-3 py-1.5 text-[13px] font-semibold text-white`}>{active.status}</span>
        </div>
        <div className="p-6 sm:p-7">
          <h3 className="font-heading text-[26px] leading-tight text-ink">{active.name}</h3>
          <p className="mt-3 text-[14px] leading-7 text-ink-soft">{active.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-rule pt-5">
            <Link href={active.href} className="ed-btn ed-btn-primary min-h-10 px-4 text-[15px]">
              Read the {active.name} guide <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/destinations" className="text-[15px] font-semibold text-petrol-600 underline underline-offset-4 hover:text-petrol-800">
              Compare all destinations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
