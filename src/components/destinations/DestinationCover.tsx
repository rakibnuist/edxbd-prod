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

/** What each photo actually shows, for screen readers and image search. */
const PHOTO_ALT: Record<string, string> = {
  china: 'The Great Wall of China across autumn hills',
  'south-korea': 'A street lined with Korean shop signs in South Korea',
  uk: 'Tower Bridge and the River Thames in London',
  malaysia: 'The Petronas Twin Towers in Kuala Lumpur at dusk',
  georgia: 'Old town rooftops in Georgia at sunset',
  greece: 'The Parthenon on the Acropolis in Athens',
  thailand: 'Thai temple buildings under a blue sky',
  hungary: 'The Hungarian Parliament Building in Budapest lit up at night',
  finland: 'Helsinki Cathedral above the harbour in Finland',
  cyprus: 'Seafront towers and a promenade in Cyprus',
  croatia: 'The twin spires of Zagreb Cathedral in Croatia',
  malta: 'Aerial view of Valletta, Malta, with the sea behind',
};

export function destinationPhoto(slug: string) {
  return DESTINATION_PHOTOS[slug];
}

export function destinationPhotoAlt(slug: string) {
  return PHOTO_ALT[slug];
}

export default function DestinationCover({
  slug,
  name,
  flag,
  priority = false,
  sizes = '(max-width: 1024px) 100vw, 560px',
  className = '',
  compact = false,
  alt,
}: {
  slug: string;
  name: string;
  flag?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  compact?: boolean;
  /** Override the photo description; pass "" when a visible heading already names the country. */
  alt?: string;
}) {
  const photo = DESTINATION_PHOTOS[slug];

  if (photo) {
    return (
      <Image
        src={photo}
        alt={alt ?? PHOTO_ALT[slug] ?? `Study in ${name} from Bangladesh`}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden bg-petrol-800 ${className}`} aria-hidden="true">
      <div className="absolute -right-16 -top-16 size-56 rounded-full bg-lime/25 blur-2xl" />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(7,28,46,0.05),rgba(7,28,46,0.6))]" />
      <span
        className={`absolute font-display font-black leading-none text-white/10 ${
          compact ? 'right-3 top-3 text-[46px]' : '-right-3 -top-8 text-[180px]'
        }`}
      >
        {countryCode(slug)}
      </span>
      {!compact && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          {flag && <span className="text-5xl leading-none">{flag}</span>}
          <span className="mt-3 font-display text-[22px] font-black text-white">{name}</span>
          <span className="mt-1 text-[14px] font-semibold text-lime">Destination profile</span>
        </div>
      )}
    </div>
  );
}
