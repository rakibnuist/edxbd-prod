import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarClock, GraduationCap } from 'lucide-react';
import { deadlineBadge, fmtDay } from '@/lib/update-deadlines';

export type UpdateCardData = {
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  categories?: string[];
  deadlineAt?: string;
  publishedAt?: string;
  createdAt?: string;
  archived?: boolean;
  type?: string;
};

const toneClass = {
  urgent: 'bg-peach text-petrol-800',
  open: 'bg-lime text-petrol-800',
  closed: 'bg-canvas-soft text-ink-soft',
} as const;

export const updateCategory = (update: UpdateCardData) => update.category || update.categories?.[0] || 'Update';

function Cover({ update, sizes, priority }: { update: UpdateCardData; sizes: string; priority?: boolean }) {
  if (update.featuredImage) {
    return (
      <Image
        src={update.featuredImage}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
      />
    );
  }
  // No cover yet: a branded tile instead of an empty grey box.
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-petrol-800 p-5">
      <span className="grid size-11 place-items-center rounded-full bg-lime text-petrol-800">
        <GraduationCap size={20} aria-hidden="true" />
      </span>
      <span className="line-clamp-3 font-display text-[22px] font-black leading-[1.05] text-white">{update.title}</span>
    </div>
  );
}

/**
 * One post card. `feature` = wide hero card, `card` = grid card, `row` = compact list row.
 * Pure markup (no hooks) so server and client components can both render it.
 */
export default function UpdateCard({
  update,
  now,
  variant = 'card',
  priority,
  headingLevel = 'h3',
}: {
  update: UpdateCardData;
  now: number;
  variant?: 'feature' | 'card' | 'row';
  priority?: boolean;
  headingLevel?: 'h2' | 'h3';
}) {
  const href = `/updates/${update.slug}`;
  const badge = deadlineBadge(update.deadlineAt, now);
  const date = update.publishedAt || update.createdAt;
  const Heading = headingLevel;

  if (variant === 'row') {
    return (
      <article className="group relative flex gap-4 rounded-2xl bg-white p-3 transition-colors hover:bg-lime-pale">
        <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl bg-canvas-soft sm:w-32">
          <Cover update={update} sizes="128px" />
        </div>
        <div className="min-w-0 py-1">
          {badge ? (
            <p className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${toneClass[badge.tone]}`}>
              <CalendarClock size={13} aria-hidden="true" /> {badge.label}
            </p>
          ) : (
            <p className="text-[13px] font-semibold text-ink-soft">{updateCategory(update)}</p>
          )}
          <Heading className="mt-1.5 line-clamp-3 text-[16px] font-semibold leading-snug text-petrol-800">
            <Link href={href} className="after:absolute after:inset-0">{update.title}</Link>
          </Heading>
        </div>
      </article>
    );
  }

  const feature = variant === 'feature';
  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-3xl bg-white ${feature ? 'lg:items-stretch' : ''} shadow-[0_1px_0_rgba(15,40,60,0.06)] ring-1 ring-petrol-800/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(15,40,60,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        feature ? 'flex-col lg:grid lg:grid-cols-[1.25fr_1fr]' : 'flex-col'
      }`}
    >
      <div className={`relative aspect-[1200/630] overflow-hidden bg-canvas-soft ${feature ? 'lg:self-center' : ''}`}>
        <Cover update={update} sizes={feature ? '(max-width:1024px) 100vw, 660px' : '(max-width:640px) 100vw, (max-width:1024px) 50vw, 380px'} priority={priority} />
        {update.archived && (
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[13px] font-semibold text-clay">Archived</span>
        )}
      </div>
      <div className={`flex flex-1 flex-col ${feature ? 'p-6 sm:p-8 lg:justify-center' : 'p-5 sm:p-6'}`}>
        {badge && (
          <p className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-bold ${toneClass[badge.tone]}`}>
            <CalendarClock size={14} aria-hidden="true" /> {badge.label}
          </p>
        )}
        <p className="flex flex-wrap items-center gap-x-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-lime-deep">
          {updateCategory(update)}
          {date && <span className="font-medium normal-case tracking-normal text-ink-soft">· {fmtDay(date)}</span>}
        </p>
        <Heading
          className={
            feature
              ? 'mt-3 font-display text-[28px] font-black leading-[1.04] tracking-[-0.01em] text-petrol-800 sm:text-[36px]'
              : 'mt-2.5 line-clamp-3 text-[19px] font-semibold leading-[1.3] tracking-[-0.01em] text-petrol-800'
          }
        >
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {update.title}
          </Link>
        </Heading>
        {update.excerpt && (
          <p className={`mt-3 text-[15px] leading-6 text-ink-soft ${feature ? 'line-clamp-4 sm:text-[16px] sm:leading-7' : 'line-clamp-2'}`}>{update.excerpt}</p>
        )}
        <span className={`mt-auto inline-flex items-center gap-1.5 pt-5 text-[15px] font-semibold text-petrol-800 ${feature ? '' : ''}`}>
          {feature ? 'Read the full guide' : 'Read more'}
          <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
