'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { countryCode } from '@/lib/country-code';

type RailDestination = {
  slug: string;
  name: string;
  href: string;
  status: string;
  description: string;
  image: string | null;
};

function Tile({ destination }: { destination: RailDestination }) {
  const flagship = destination.status === 'Flagship';

  return (
    <Link
      href={destination.href}
      className="light-rail-card group relative flex w-[82vw] max-w-[330px] shrink-0 flex-col overflow-hidden rounded-[26px] text-ink sm:w-[330px]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-mint-100">
        {destination.image ? (
          <Image
            src={destination.image}
            alt={`Study in ${destination.name} from Bangladesh`}
            fill
            sizes="(max-width:640px) 82vw, 330px"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-mint-200 via-mint-100 to-marigold-100">
            <span className="absolute -bottom-3 right-1 font-heading text-[92px] leading-none text-petrol-900/10">
              {countryCode(destination.slug)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[-0.005em] ${
            flagship ? 'bg-marigold text-petrol-900 shadow-sm' : 'bg-white/90 text-petrol-600 backdrop-blur-sm'
          }`}
        >
          {destination.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="ed-figure text-[10.5px] font-bold tracking-[0.12em] text-petrol-500">
          {countryCode(destination.slug)}
        </span>
        <h3 className="mt-1.5 font-heading text-[19px] font-semibold leading-snug text-ink">{destination.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-5 text-ink-soft">{destination.description}</p>
        <span className="mt-auto flex items-center gap-1 pt-4 text-[11.5px] font-bold text-petrol-600">
          View route
          <ArrowUpRight
            size={12}
            className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

/**
 * Infinite, always-moving destination marquee of light glass cards. Reuses the
 * `.home-loop` CSS so it pauses on hover/focus and falls back to a normal
 * horizontal list under prefers-reduced-motion. The duplicate set is inert.
 */
export default function LightRail({
  items,
  className = '',
}: {
  items: RailDestination[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <div
      role="region"
      aria-label="Study destinations"
      className={`home-loop light-rail ${className}`}
      style={{ '--loop-speed': '52s', '--loop-edge': '#f6e9da' } as CSSProperties}
    >
      <div className="light-rail-glow" aria-hidden="true" />
      <div className="home-loop-track light-rail-track">
        <div className="home-loop-set">
          {items.map(destination => (
            <Tile key={destination.slug} destination={destination} />
          ))}
        </div>
        <div className="home-loop-set" aria-hidden="true" inert>
          {items.map(destination => (
            <Tile key={`${destination.slug}-dup`} destination={destination} />
          ))}
        </div>
      </div>
    </div>
  );
}
