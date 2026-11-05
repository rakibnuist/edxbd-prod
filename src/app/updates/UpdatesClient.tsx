'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Newspaper, Search } from 'lucide-react';
import type { Update, UpdatesResponse } from '@/lib/types';
import { categoryHref } from '@/lib/update-categories';
import { chinaGuides } from './guides';

// Keep the whole current library crawlable in one server-rendered page. The
// pagination controls below remain for when the library grows past this size.
const ITEMS_PER_PAGE = 24;

const fmtDate = (update: Update) => {
  const iso = update.publishedAt || update.createdAt;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
};

const primaryCategory = (update: Update) => update.category || update.categories?.[0] || 'Update';

const archivedBadge = 'ml-2 inline-flex rounded-full bg-canvas-soft px-2.5 py-0.5 align-middle text-[14px] font-semibold text-clay';

interface UpdatesClientProps {
  initialUpdates?: Update[];
  initialCategories?: string[];
}

export default function UpdatesClient({ initialUpdates = [] }: UpdatesClientProps) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    // The server snapshot covers crawlers and first paint (including the empty
    // state); this refresh pulls the freshest backend records so a new post
    // shows immediately instead of waiting for the 5-minute ISR window.
    let active = true;
    fetch('/api/updates')
      .then(response => (response.ok ? (response.json() as Promise<UpdatesResponse>) : Promise.reject(new Error('Unable to load updates'))))
      .then(data => {
        if (!active) return;
        const fresh = data.updates || [];
        if (fresh.length > 0 || initialUpdates.length === 0) setUpdates(fresh);
      })
      .catch(() => {
        /* keep the server snapshot */
      });
    return () => {
      active = false;
    };
  }, [initialUpdates.length]);

  const currentUpdates = updates;

  const categories = useMemo(() => {
    const values = currentUpdates.flatMap(update => [update.category, ...(update.categories || [])]).filter((value): value is string => Boolean(value?.trim()));
    const labels = new Map<string, string>();
    values.forEach(value => {
      const clean = value.trim();
      const rawKey = clean.toLowerCase();
      const key = rawKey === 'announcements' ? 'announcement' : rawKey;
      if (!labels.has(key)) labels.set(key, key === 'announcement' ? 'Announcement' : clean);
    });
    return ['All', ...labels.values()];
  }, [currentUpdates]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return currentUpdates
      .filter(update => {
        const matchesCategory =
          category === 'All' ||
          primaryCategory(update).toLowerCase() === category.toLowerCase() ||
          update.categories?.some(item => item.toLowerCase() === category.toLowerCase());
        const matchesSearch = !query || `${update.title} ${update.excerpt || ''} ${update.content || ''}`.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => Number(Boolean(a.archived)) - Number(Boolean(b.archived)));
  }, [category, currentUpdates, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const visible = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const [lead, ...rest] = visible;

  const chooseCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };
  const choosePage = (value: number) => {
    setPage(Math.max(1, Math.min(value, totalPages)));
    document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Nothing published yet: say so plainly and send readers to the evergreen
  // China guides instead of showing an empty search box.
  if (currentUpdates.length === 0) {
    return (
      <div className="rounded-3xl bg-canvas-soft p-6 sm:p-10">
        <div className="max-w-2xl">
          <span className="grid size-12 place-items-center rounded-full bg-white text-petrol-800">
            <Newspaper size={22} aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-display text-[30px] font-black leading-[1.02] tracking-[-0.01em] text-petrol-800 sm:text-[40px]">
            No dated updates are published right now.
          </h2>
          <p className="mt-4 text-[17px] leading-7 text-ink-soft">
            Intake notices, scholarship changes and visa news appear here with their publish date and author. Until the next one is
            published, the China guides below cover intakes, scholarships, visas and complete costs.
          </p>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {chinaGuides.map(guide => (
            <li key={guide.href}>
              <Link href={guide.href} className="group flex min-h-[76px] items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 transition-colors hover:bg-lime-pale">
                <span>
                  <span className="block text-[14px] text-ink-soft">{guide.label}</span>
                  <span className="block text-[17px] font-semibold leading-snug text-petrol-800">{guide.title}</span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-petrol-800 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/study-in-china-from-bangladesh" className="ed-btn ed-btn-signal min-h-[52px] px-7">
            Open the Study in China guide <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/contact" className="ed-btn ed-btn-outline min-h-[52px] px-7">Ask a counsellor</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[34px] font-black leading-[0.98] tracking-[-0.01em] text-petrol-800 sm:text-[46px]">
            {category === 'All' ? 'The library.' : category}
          </h2>
          <p className="mt-3 text-[16px] text-ink-soft">
            <strong className="font-semibold text-petrol-800">{filtered.length}</strong> {filtered.length === 1 ? 'record' : 'records'} · new posts appear as soon as they are published
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block lg:w-[420px]">
          <span className="sr-only">Search updates</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute" size={16} aria-hidden="true" />
          <input
            value={search}
            onChange={event => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search the library: intake, visa, cost, scholarship"
            className="ed-field ed-field-icon"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" role="group" aria-label="Filter by category">
          {categories.map(item => (
            <button
              key={item}
              type="button"
              onClick={() => chooseCategory(item)}
              aria-pressed={category === item}
              className={`min-h-[44px] shrink-0 rounded-full px-4 text-[15px] font-semibold transition-colors ${
                category === item ? 'bg-petrol-800 text-white' : 'bg-canvas-soft text-petrol-800 hover:bg-lime-pale'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <>
          {lead && (
            <article className="mt-8 rounded-3xl bg-canvas-soft p-6 sm:p-8">
              <p className="text-[14px] text-ink-soft">
                <Link href={categoryHref(primaryCategory(lead))} className="font-semibold text-petrol-800 underline-offset-4 hover:underline">
                  {primaryCategory(lead)}
                </Link>
                {' · '}
                {fmtDate(lead)}
                {lead.archived && <span className={archivedBadge}>Archived</span>}
              </p>
              <h3 className="mt-3 max-w-[30ch] font-display text-[28px] font-black leading-[1.05] tracking-[-0.01em] text-petrol-800 sm:text-[36px]">
                <Link href={`/updates/${lead.slug}`} className="underline-offset-4 hover:underline">
                  {lead.title}
                </Link>
              </h3>
              {lead.excerpt && <p className="mt-3 max-w-[62ch] text-[16px] leading-7 text-ink-soft">{lead.excerpt}</p>}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-[15px]">
                <Link href={`/updates/${lead.slug}`} className="ed-btn ed-btn-signal min-h-11 px-5">
                  Read the {lead.type === 'article' ? 'article' : 'update'} <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <span className="text-ink-soft">{lead.author}</span>
              </div>
            </article>
          )}

          <ul className="mt-4">
            {rest.map(update => (
              <li key={update.id} className="border-b border-canvas-soft">
                <article className="grid gap-2 py-5 sm:grid-cols-[120px_minmax(0,1fr)_150px] sm:items-baseline sm:gap-6">
                  <p className="text-[14px] text-ink-soft">{fmtDate(update)}</p>
                  <div>
                    <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.01em] text-petrol-800">
                      <Link href={`/updates/${update.slug}`} className="underline-offset-4 hover:underline">
                        {update.title}
                      </Link>
                      {update.archived && <span className={archivedBadge}>Archived</span>}
                    </h3>
                    {update.excerpt && <p className="mt-1 line-clamp-2 max-w-[70ch] text-[15px] leading-6 text-ink-soft">{update.excerpt}</p>}
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <Link href={categoryHref(primaryCategory(update))} className="text-[14px] font-semibold text-petrol-800 underline-offset-4 hover:underline">
                      {primaryCategory(update)}
                    </Link>
                    <span className="text-[14px] text-ink-soft">{update.author}</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-8 rounded-3xl bg-canvas-soft px-6 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-white text-petrol-800">
            <Search size={22} aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-[26px] font-black leading-tight text-petrol-800">No record matches “{search || category}”</h3>
          <p className="mx-auto mt-2 max-w-md text-[16px] leading-6 text-ink-soft">Clear the search or pick a different category. If you need a specific intake answer, a counsellor can check it directly.</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              chooseCategory('All');
            }}
            className="ed-btn ed-btn-outline mt-5 min-h-11 text-[15px]"
          >
            Clear the search
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Update pages">
          <button
            type="button"
            onClick={() => choosePage(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className="grid size-11 place-items-center rounded-full bg-canvas-soft text-petrol-800 hover:bg-lime-pale disabled:opacity-30"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <span className="text-[15px] text-ink-soft">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => choosePage(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
            className="grid size-11 place-items-center rounded-full bg-canvas-soft text-petrol-800 hover:bg-lime-pale disabled:opacity-30"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
}
