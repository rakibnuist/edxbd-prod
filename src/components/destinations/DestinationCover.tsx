import Image from 'next/image';

import { countryCode } from '@/lib/country-code';

/**
 * Verified destination photography only. Countries without a verified image
 * get a designed gradient cover instead of an unrelated stock photo — the
 * country name and code still make the card feel complete.
 */
export const DESTINATION_PHOTOS: Record<string, string> = {
  china: '/images/destinations/china-hero.webp',
  'south-korea': '/images/destinations/south-korea-hero.webp',
  uk: '/images/destinations/united-kingdom-hero.webp',
  malaysia: '/images/destinations/malaysia-hero.webp',
  georgia: '/images/destinations/georgia-hero.webp',
  greece: '/images/destinations/greece-hero.webp',
  thailand: '/images/destinations/thailand-hero.webp',
  hungary: '/images/destinations/hungary-hero.webp',
  finland: '/images/destinations/finland-hero.webp',
  cyprus: '/images/destinations/cyprus-hero.webp',
  croatia: '/images/destinations/croatia-hero.webp',
  malta: '/images/destinations/malta-hero.webp',
};

export function destinationPhoto(slug: string) {
  return DESTINATION_PHOTOS[slug];
}

export default function DestinationCover({
  slug,
  name,
  flag,
  priority = false,
  sizes = '(max-width: 1024px) 100vw, 560px',
  className = '',
  compact = false,
}: {
  slug: string;
  name: string;
  flag?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  compact?: boolean;
}) {
  const photo = DESTINATION_PHOTOS[slug];

  if (photo) {
    return (
      <Image
        src={photo}
        alt={`Study in ${name} from Bangladesh`}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden bg-petrol-800 ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_0%,rgba(102,181,224,0.55),transparent_62%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(7,28,46,0.1),rgba(7,28,46,0.75))]" />
      <div className="ed-grid-lines absolute inset-0 opacity-60" />
      <span
        className={`ed-numeral absolute leading-none text-white/10 ${
          compact ? 'right-3 top-3 text-[46px]' : '-right-3 -top-10 text-[180px]'
        }`}
      >
        {countryCode(slug)}
      </span>
      {!compact && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          {flag && <span className="text-5xl leading-none">{flag}</span>}
          <span className="mt-3 text-[12px] font-bold uppercase tracking-[0.16em] text-white/90">{name}</span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-mint-300">
            Destination profile
          </span>
        </div>
      )}
    </div>
  );
}
