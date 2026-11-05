'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { Update, UpdatesResponse } from '@/lib/types';
import { categoryHref } from '@/lib/update-categories';

// Keep the whole current library crawlable in one server-rendered page. The
// pagination controls below remain for when the library grows past this size.
const ITEMS_PER_PAGE = 24;

const fmtDate = (update: Update) => {
  const iso = update.publishedAt || update.createdAt;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
};

const currentGuides = [
  { label: '2027 intakes', title: 'Application windows and deadlines', href: '/china-intakes-deadlines' },
  { label: 'Scholarships', title: 'Coverage, eligibility and renewal', href: '/china-scholarships-bangladesh' },
  { label: 'Visa guidance', title: 'Documents and readiness', href: '/china-student-visa-bangladesh' },
  { label: 'Complete costs', title: 'Tuition, living and official fees', href: '/study-in-china-cost-bangladesh' },
];

const primaryCategory = (update: Update) => update.category || update.categories?.[0] || 'Update';

interface UpdatesClientProps {
  initialUpdates?: Update[];
  initialCategories?: string[];
}

export default function UpdatesClient({ initialUpdates = [] }: UpdatesClientProps) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [loading, setLoading] = useState(initialUpdates.length === 0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    // The server snapshot above covers crawlers and first paint; this refresh
    // pulls the freshest backend records so a new post shows immediately
    // instead of waiting for the 5-minute ISR window.
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
      })
      .finally(() => {
        if (active) setLoading(false);
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
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  return (
    <div className="bg-chalk text-ink">
      <header className="border-b border-rule px-5 pb-10 pt-[104px] sm:px-8 lg:px-12 lg:pt-[140px]">
        <div className="mx-auto max-w-shell">
          <p className="ed-label">Information centre</p>
          <div className="mt-4 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-16">
            <div>
              <h1 className="max-w-[24ch] ed-home-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.02] text-ink">
                Advice that carries a date and a source.
              </h1>
              <p className="mt-4 max-w-[56ch] text-[14.5px] leading-7 text-ink-soft">
                Admissions news, scholarship changes and practical study guidance. Every entry shows when it was published and who wrote it — old intake notices stay online, visibly closed.
              </p>
            </div>
            <div className="border-t border-rule pt-4 lg:border-t-0 lg:pt-0">
              <p className="text-[13px] font-semibold text-petrol-600">{filtered.length} records in the library</p>
              <p className="mt-1 text-[14px] leading-6 text-ink-mute">Refreshed from the backend on every visit.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block flex-1">
              <span className="sr-only">Search updates</span>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute" size={16} aria-hidden="true" />
              <input
                value={search}
                onChange={event => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search the library — intake, visa, cost, scholarship"
                className="ed-field ed-field-icon"
              />
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar" role="group" aria-label="Filter by category">
              {categories.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => chooseCategory(item)}
                  aria-pressed={category === item}
                  className={`shrink-0 min-h-8 border px-2.5 text-[14px] font-medium transition-colors ${
                    category === item ? 'border-petrol-600 bg-petrol-600 text-white' : 'border-rule-strong bg-white text-ink-soft hover:border-petrol-400 hover:text-petrol-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-shell px-5 py-12 sm:px-8 lg:px-12">
        <section aria-labelledby="current-information">
          <h2 id="current-information" className="text-[14px] font-semibold text-petrol-600">
            Check before you apply
          </h2>
          <ul className="mt-3 grid border-t border-rule sm:grid-cols-2 xl:grid-cols-4">
            {currentGuides.map((guide, index) => (
              <li key={guide.href} className={`border-b border-rule ${index < 3 ? 'xl:border-r' : ''}`}>
                <Link href={guide.href} className="group flex h-full flex-col justify-between gap-6 px-1 py-4 transition-colors hover:bg-white xl:px-4">
                  <span className="text-[13px] text-ink-mute">{guide.label}</span>
                  <span className="flex items-end justify-between gap-3">
                    <span className="ed-home-display text-[17px] leading-snug text-ink group-hover:text-petrol-700">{guide.title}</span>
                    <ArrowUpRight size={14} className="shrink-0 text-petrol-500" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="browse-updates">
          <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-3">
            <h2 id="browse-updates" className="ed-home-display text-[22px] leading-tight text-ink">
              {category === 'All' ? 'The library' : category}
            </h2>
            <span className="text-[13px] text-ink-mute">{filtered.length} records</span>
          </div>

          {loading ? (
            <div className="mt-4" aria-label="Loading updates">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="h-24 animate-pulse border-b border-rule bg-chalk-100/70" />
              ))}
            </div>
          ) : visible.length > 0 ? (
            <>
              {lead && (
                <article className="border-b border-rule py-7">
                  <p className="text-[13px] text-ink-mute">
                    <Link href={categoryHref(primaryCategory(lead))} className="font-semibold text-petrol-600 hover:underline">
                      {primaryCategory(lead)}
                    </Link>
                    {' · '}
                    {fmtDate(lead)}
                    {lead.archived && <span className="ml-2 border border-clay/40 bg-clay/5 px-1.5 py-0.5 text-[12px] font-semibold text-clay">Archived</span>}
                  </p>
                  <h3 className="mt-3 max-w-[30ch] ed-home-display text-[clamp(1.6rem,2.8vw,2.3rem)] leading-[1.1] text-ink">
                    <Link href={`/updates/${lead.slug}`} className="underline-offset-4 hover:underline">
                      {lead.title}
                    </Link>
                  </h3>
                  {lead.excerpt && <p className="mt-3 max-w-[62ch] text-[14px] leading-7 text-ink-soft">{lead.excerpt}</p>}
                  <div className="mt-4 flex items-center gap-4 text-[14px]">
                    <Link href={`/updates/${lead.slug}`} className="inline-flex items-center gap-1.5 font-semibold text-petrol-600 underline-offset-4 hover:underline">
                      Read the {lead.type === 'article' ? 'article' : 'update'} <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                    <span className="text-ink-mute">{lead.author}</span>
                  </div>
                </article>
              )}

              <ul>
                {rest.map(update => (
                  <li key={update.id} className="border-b border-rule">
                    <article className="grid gap-2 py-5 sm:grid-cols-[120px_minmax(0,1fr)_130px] sm:items-baseline sm:gap-6">
                      <p className="text-[13px] text-ink-mute">{fmtDate(update)}</p>
                      <div>
                        <h3 className="ed-home-display text-[18px] leading-snug text-ink">
                          <Link href={`/updates/${update.slug}`} className="underline-offset-4 hover:underline">
                            {update.title}
                          </Link>
                          {update.archived && <span className="ml-2 align-middle border border-clay/40 bg-clay/5 px-1.5 py-0.5 text-[12px] font-semibold text-clay">Archived</span>}
                        </h3>
                        {update.excerpt && <p className="mt-1 line-clamp-2 max-w-[70ch] text-[15px] leading-6 text-ink-soft">{update.excerpt}</p>}
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                        <Link href={categoryHref(primaryCategory(update))} className="text-[13px] font-semibold text-petrol-600 hover:underline">
                          {primaryCategory(update)}
                        </Link>
                        <span className="text-[13px] text-ink-mute">{update.author}</span>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="mt-6 border border-rule bg-white px-6 py-14 text-center">
              <Search size={22} className="mx-auto text-petrol-500" aria-hidden="true" />
              <h3 className="mt-4 ed-home-display text-[21px] text-ink">No record matches “{search || category}”</h3>
              <p className="mx-auto mt-2 max-w-md text-[15px] leading-6 text-ink-soft">Clear the search or pick a different category. If you need a specific intake answer, a counsellor can check it directly.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  chooseCategory('All');
                }}
                className="ed-btn ed-btn-outline mt-5 min-h-10 text-[15px]"
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
                className="grid size-9 place-items-center border border-rule-strong text-petrol-700 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[14px] text-ink-soft">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => choosePage(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
                className="grid size-9 place-items-center border border-rule-strong text-petrol-700 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </section>
      </main>
    </div>
  );
}
