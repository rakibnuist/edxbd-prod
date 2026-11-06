// Deadline helpers shared by update cards, rails and university profiles.
// `now` is passed in (not read inside) so server and client render the same label.

const DAY = 86_400_000;

type Dated = { deadlineAt?: string | null };

export function daysLeft(deadlineAt: string | null | undefined, now: number): number | null {
  if (!deadlineAt) return null;
  const end = new Date(deadlineAt).getTime();
  if (Number.isNaN(end)) return null;
  // A deadline date counts as open for the whole day (Asia/Dhaka is ahead of UTC).
  return Math.ceil((end + DAY - now) / DAY) - 1;
}

export const fmtDay = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));

export type DeadlineTone = 'urgent' | 'open' | 'closed';

export function deadlineBadge(deadlineAt: string | null | undefined, now: number): { label: string; tone: DeadlineTone } | null {
  const days = daysLeft(deadlineAt, now);
  if (days === null || !deadlineAt) return null;
  if (days < 0) return { label: `Closed ${fmtDay(deadlineAt)}`, tone: 'closed' };
  if (days === 0) return { label: 'Closes today', tone: 'urgent' };
  if (days <= 30) return { label: `${days} ${days === 1 ? 'day' : 'days'} left`, tone: 'urgent' };
  return { label: `Apply by ${fmtDay(deadlineAt)}`, tone: 'open' };
}

/** Open deadlines, soonest first. */
export function openByDeadline<T extends Dated>(items: T[], now: number): T[] {
  return items
    .filter(item => (daysLeft(item.deadlineAt, now) ?? -1) >= 0)
    .sort((a, b) => new Date(a.deadlineAt as string).getTime() - new Date(b.deadlineAt as string).getTime());
}

/** Request time for server components (ISR pages re-render on revalidation). */
export function requestTime(): number {
  return Date.now();
}
