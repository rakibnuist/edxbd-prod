import Image from 'next/image';
import { GraduationCap, MapPin, Star } from 'lucide-react';

/** One student story, as shown on the homepage and /success-stories. */
export type StoryCardData = {
  id: string;
  name: string;
  quote: string;
  image?: string;
  program?: string;
  university?: string;
  location?: string;
  country?: string;
  rating?: number;
  /** Optional journey details; only filled entries are shown. */
  facts?: [label: string, value: string | undefined][];
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

export function Stars({ rating = 5, size = 16, className = 'text-[#f5b301]' }: { rating?: number; size?: number; className?: string }) {
  const value = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={size} strokeWidth={0} fill="currentColor" className={index < value ? '' : 'opacity-25'} aria-hidden="true" />
      ))}
    </span>
  );
}

export default function StoryCard({ story, compact = false }: { story: StoryCardData; compact?: boolean }) {
  const facts = (story.facts ?? []).filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()));
  const place = [story.location, story.country].filter(Boolean).join(', ');

  return (
    <article id={`story-${story.id}`} className="group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl bg-white">
      {story.image && (
        <div className={`relative overflow-hidden bg-canvas-soft ${compact ? 'aspect-[16/11]' : 'aspect-[4/3]'}`}>
          <Image
            src={story.image}
            alt={`${story.name}, EduExpress student${story.university ? ` at ${story.university}` : ''}`}
            fill
            sizes="(max-width:768px) 90vw, (max-width:1024px) 45vw, 380px"
            className="object-cover object-[50%_25%] transition duration-700 group-hover:scale-[1.03]"
          />
          {story.country && (
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[14px] font-semibold text-petrol-800">
              {story.country}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <Stars rating={story.rating} />
          {!story.image && story.country && (
            <span className="rounded-full bg-canvas-soft px-3 py-1 text-[14px] font-semibold text-petrol-800">{story.country}</span>
          )}
        </div>

        <blockquote className={`mt-4 text-[17px] leading-[1.65] text-petrol-800 ${compact ? 'line-clamp-6' : ''}`}>
          <span aria-hidden="true" className="mr-0.5 font-display text-[34px] font-black leading-[0] text-lime-deep [vertical-align:-0.3em]">
            &ldquo;
          </span>
          {story.quote}
        </blockquote>

        <div className="mt-auto pt-6" />
        <div className="flex items-center gap-3.5 border-t border-canvas-soft pt-5">
          {!story.image && (
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-lime font-display text-[17px] font-black text-petrol-800" aria-hidden="true">
              {initials(story.name)}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-[17px] font-bold leading-tight text-petrol-800">{story.name}</p>
            {story.program && <p className="mt-1 text-[15px] leading-snug text-ink-soft">{story.program}</p>}
            {story.university && (
              <p className="mt-1 flex items-start gap-1.5 text-[15px] font-semibold leading-snug text-petrol-600">
                <GraduationCap size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                {story.university}
              </p>
            )}
            {!compact && place && (
              <p className="mt-1 flex items-start gap-1.5 text-[14px] leading-snug text-ink-mute">
                <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                {place}
              </p>
            )}
          </div>
        </div>

        {!compact && facts.length > 0 && (
          <details className="faq-smooth group/journey mt-5 rounded-2xl bg-canvas-soft px-5">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold text-petrol-800">
              Read the full journey
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lime text-[18px] leading-none transition group-open/journey:rotate-45" aria-hidden="true">+</span>
            </summary>
            <dl className="grid gap-4 pb-5">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[14px] font-semibold text-petrol-800">{label}</dt>
                  <dd className="mt-0.5 text-[15px] leading-6 text-ink-soft">{value}</dd>
                </div>
              ))}
            </dl>
          </details>
        )}
      </div>
    </article>
  );
}
