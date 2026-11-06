'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck } from 'lucide-react';
import UpdateCard, { updateCategory, type UpdateCardData } from '@/components/updates/UpdateCard';
import { daysLeft } from '@/lib/update-deadlines';

export type LibraryItem = UpdateCardData & { id: string; search: string };

const PAGE = 18;

const rank = (item: LibraryItem, now: number) => (item.archived ? 2 : (daysLeft(item.deadlineAt, now) ?? 0) < 0 ? 1 : 0);

const normal = (value: string) => {
  const key = value.trim().toLowerCase();
  return key === 'announcements' ? 'announcement' : key;
};

export default function UpdatesClient({ items, now }: { items: LibraryItem[]; now: number }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [shown, setShown] = useState(PAGE);

  // Chips ordered by how many posts use them, so the useful filters come first.
  const categories = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    items.forEach(item => {
      new Set([item.category, ...(item.categories || [])].filter((v): v is string => Boolean(v?.trim())).map(v => v.trim())).forEach(label => {
        const key = normal(label);
        const entry = counts.get(key) || { label: key === 'announcement' ? 'Announcement' : label, count: 0 };
        entry.count += 1;
        counts.set(key, entry);
      });
    });
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 8);
  }, [items]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items
      .filter(item => {
        const inCategory =
          category === 'All' || normal(updateCategory(item)) === normal(category) || item.categories?.some(value => normal(value) === normal(category));
        return inCategory && (!query || query.split(/\s+/).every(word => item.search.includes(word)));
      })
      // Open and undated posts first (newest first), then closed rounds, then archived.
      .sort((a, b) => rank(a, now) - rank(b, now));
  }, [category, items, now, search]);

  const visible = filtered.slice(0, shown);
  const [lead, ...rest] = visible;
  const filteredView = search.trim() !== '' || category !== 'All';

  const choose = (value: string) => {
    setCategory(value);
    setShown(PAGE);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-lime-deep">The library</p>
          <h2 className="mt-2 font-display text-[34px] font-black leading-[0.98] tracking-[-0.01em] text-petrol-800 sm:text-[46px]">
            {category === 'All' ? 'Latest updates.' : category}
          </h2>
        </div>
        <p className="text-[15px] text-ink-soft">
          <strong className="font-semibold text-petrol-800">{filtered.length}</strong> {filtered.length === 1 ? 'post' : 'posts'}
          {filteredView ? ' match' : ', newest first'}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block lg:w-[400px] lg:shrink-0">
          <span className="sr-only">Search updates</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" size={18} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={event => {
              setSearch(event.target.value);
              setShown(PAGE);
            }}
            placeholder="Search a university, scholarship or exam"
            className="ed-field ed-field-icon min-h-[52px] rounded-full pl-11"
          />
        </label>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar lg:mx-0 lg:px-0" role="group" aria-label="Filter by category">
          {[{ label: 'All', count: items.length }, ...categories].map(item => (
            <button
              key={item.label}
              type="button"
              onClick={() => choose(item.label)}
              aria-pressed={category === item.label}
              className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full px-4 text-[15px] font-semibold transition-colors ${
                category === item.label ? 'bg-petrol-800 text-white' : 'bg-canvas-soft text-petrol-800 hover:bg-lime-pale'
              }`}
            >
              {item.label}
              <span className={`text-[13px] ${category === item.label ? 'text-lime' : 'text-ink-soft'}`}>{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <>
          {lead && (
            <div className="mt-8">
              <UpdateCard update={lead} now={now} variant="feature" priority />
            </div>
          )}

          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, index) => (
              <FragmentWithLead key={item.id} index={index}>
                <li>
                  <UpdateCard update={item} now={now} />
                </li>
              </FragmentWithLead>
            ))}
          </ul>

          {filtered.length > shown && (
            <div className="mt-10 flex justify-center">
              <button type="button" onClick={() => setShown(value => value + PAGE)} className="ed-btn ed-btn-outline min-h-[52px] px-7">
                Show more updates ({filtered.length - shown} more)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 rounded-3xl bg-canvas-soft px-6 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-white text-petrol-800">
            <Search size={22} aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-[26px] font-black leading-tight text-petrol-800">Nothing matches “{search || category}” yet.</h3>
          <p className="mx-auto mt-2 max-w-md text-[16px] leading-6 text-ink-soft">
            A counsellor can check the latest notice for that university or scholarship and tell you if it is open.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href="#shortlist" className="ed-btn ed-btn-signal min-h-11 px-5 text-[15px]">
              Ask a counsellor <ArrowRight size={16} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                choose('All');
              }}
              className="ed-btn ed-btn-outline min-h-11 px-5 text-[15px]"
            >
              Clear the search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** After the 5th grid card, a lead card takes one grid cell. */
function FragmentWithLead({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <>
      {children}
      {index === 4 && (
        <li className="flex">
          <aside className="flex w-full flex-col justify-between rounded-3xl bg-petrol-800 p-6 text-white sm:p-7">
            <div>
              <span className="grid size-12 place-items-center rounded-full bg-lime text-petrol-800">
                <ShieldCheck size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-[28px] font-black leading-[1.02] text-lime">Which of these can you actually get?</h3>
              <p className="mt-3 text-[16px] leading-7 text-white/80">
                Send your results once. We check every open scholarship against your profile and reply with a realistic shortlist.
              </p>
            </div>
            <div className="mt-6 grid gap-2">
              <a href="#shortlist" className="ed-btn ed-btn-signal min-h-[52px] px-5">
                Get my free shortlist <ArrowRight size={17} aria-hidden="true" />
              </a>
              <Link href="/education-fit-assessment" className="inline-flex min-h-11 items-center justify-center text-[15px] font-semibold text-white underline-offset-4 hover:underline">
                Or take the 2-minute assessment
              </Link>
            </div>
          </aside>
        </li>
      )}
    </>
  );
}
