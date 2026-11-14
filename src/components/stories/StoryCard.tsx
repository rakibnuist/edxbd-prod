import Image from 'next/image';
import { Award, CheckCircle2, GraduationCap, MapPin, Star } from 'lucide-react';

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

function parseProgramAndAward(program?: string, quote?: string): { degree?: string; award?: string } {
  if (program && program.includes('·')) {
    const [degreePart, ...awardParts] = program.split('·').map(part => part.trim());
    return {
      degree: degreePart || undefined,
      award: awardParts.join(' · ') || undefined,
    };
  }
  let inferredAward: string | undefined;
  if (quote) {
    if (/1200\s*CNY|1,200\s*CNY/i.test(quote)) inferredAward = 'Full Tuition + 1,200 CNY/mo Stipend';
    else if (/1000\s*CNY|1,000\s*CNY/i.test(quote)) inferredAward = 'Full Tuition + 1,000 CNY/mo Stipend';
    else if (/500\s*CNY/i.test(quote)) inferredAward = 'Full Tuition + Hostel + 500 CNY/mo';
    else if (/tuition and hostel/i.test(quote)) inferredAward = 'Full Tuition + Hostel Scholarship';
    else if (/full.*scholarship|tuition-free scholarship/i.test(quote)) inferredAward = 'Full Tuition Scholarship';
  }
  return { degree: program, award: inferredAward };
}

export function Stars({
  rating = 5,
  size = 16,
  className = 'text-[#f5b301]',
}: {
  rating?: number;
  size?: number;
  className?: string;
}) {
  const value = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          strokeWidth={0}
          fill="currentColor"
          className={index < value ? '' : 'opacity-25'}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default function StoryCard({
  story,
  compact = false,
  asElement = 'article',
}: {
  story: StoryCardData;
  compact?: boolean;
  asElement?: 'article' | 'div';
}) {
  const facts = (story.facts ?? []).filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()));
  const place = [story.location, story.country]
    .filter(Boolean)
    .filter((val, idx, arr) => arr.indexOf(val) === idx)
    .join(', ');
  const { degree, award } = parseProgramAndAward(story.program, story.quote);
  const Tag = asElement;

  return (
    <Tag
      id={`story-${story.id}`}
      className="group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white text-petrol-800 shadow-[0_12px_32px_rgba(15,58,92,0.08)]"
    >
      {story.image && (
        <div className="relative aspect-[4/3] overflow-hidden bg-petrol-800">
          <Image
            src={story.image}
            alt={`${story.name}, EduExpress student${story.university ? ` at ${story.university}` : ''}`}
            fill
            sizes="(max-width:768px) 90vw, (max-width:1024px) 45vw, 360px"
            className="object-cover object-[50%_8%] transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#071f33]/90 via-[#071f33]/40 to-transparent" />

          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2">
            {story.university ? (
              <p className="flex min-w-0 items-center gap-1.5 text-xs font-bold leading-snug text-white drop-shadow-xs">
                <GraduationCap size={15} className="shrink-0 text-lime" aria-hidden="true" />
                <span className="truncate">{story.university}</span>
              </p>
            ) : (
              <span />
            )}
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-petrol-800/90 px-2.5 py-0.5 text-[11px] font-bold text-lime backdrop-blur-xs">
              <CheckCircle2 size={11} aria-hidden="true" />
              Verified
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Stars rating={story.rating} />
          {award ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900">
              <Award size={12} className="shrink-0 text-emerald-700" aria-hidden="true" />
              {award}
            </span>
          ) : (
            !story.image &&
            story.country && (
              <span className="rounded-full bg-canvas-soft px-3 py-1 text-xs font-semibold text-petrol-800">
                {story.country}
              </span>
            )
          )}
        </div>

        <blockquote className={`mt-3.5 text-[15px] leading-[1.65] text-petrol-800 ${compact ? 'line-clamp-4' : ''}`}>
          <span
            aria-hidden="true"
            className="mr-0.5 font-display text-[28px] font-black leading-[0] text-lime-deep [vertical-align:-0.28em]"
          >
            &ldquo;
          </span>
          {story.quote}
        </blockquote>

        <div className="mt-auto pt-4" />
        <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
          {story.image ? (
            <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-petrol-800 ring-2 ring-lime">
              <Image
                src={story.image}
                alt={story.name}
                fill
                sizes="44px"
                className="object-cover object-[50%_18%]"
              />
            </div>
          ) : (
            <span
              className="grid size-11 shrink-0 place-items-center rounded-2xl bg-lime font-display text-[15px] font-black text-petrol-800"
              aria-hidden="true"
            >
              {initials(story.name)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15.5px] font-bold leading-tight text-petrol-800">{story.name}</p>
            {degree && <p className="mt-0.5 truncate text-[13px] font-medium leading-snug text-ink-soft">{degree}</p>}
            {story.university && (
              <p className="mt-0.5 flex items-center gap-1 text-[12.5px] font-bold leading-snug text-[#12436b]">
                <GraduationCap size={14} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{story.university}</span>
              </p>
            )}
            {!compact && place && (
              <p className="mt-1 flex items-start gap-1 text-xs leading-snug text-ink-mute">
                <MapPin size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{place}</span>
              </p>
            )}
          </div>
        </div>

        {!compact && facts.length > 0 && (
          <details className="faq-smooth group/journey mt-4 rounded-2xl border border-slate-200/80 bg-[#f8fafc] px-4">
            <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-petrol-800 [&::-webkit-details-marker]:hidden">
              Read the full student case file
              <span
                className="grid size-7 shrink-0 place-items-center rounded-full bg-lime text-[17px] leading-none text-petrol-800 transition group-open/journey:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <dl className="grid gap-3.5 border-t border-slate-200/70 pb-4 pt-3.5">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-bold uppercase tracking-wider text-petrol-800">{label}</dt>
                  <dd className="mt-0.5 text-sm leading-6 text-ink-soft">{value}</dd>
                </div>
              ))}
            </dl>
          </details>
        )}
      </div>
    </Tag>
  );
}
