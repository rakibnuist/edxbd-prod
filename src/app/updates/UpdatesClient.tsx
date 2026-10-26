'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
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
      .then(response => response.ok ? response.json() as Promise<UpdatesResponse> : Promise.reject(new Error('Unable to load updates')))
      .then(data => {
        if (!active) return;
        const fresh = data.updates || [];
        if (fresh.length > 0 || initialUpdates.length === 0) setUpdates(fresh);
      })
      .catch(() => { /* keep the server snapshot */ })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [initialUpdates.length]);

  const currentUpdates = updates;

  const categories = useMemo(() => {
    const values = currentUpdates.flatMap(update => [update.category, ...(update.categories || [])])
      .filter((value): value is string => Boolean(value?.trim()));
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
    return currentUpdates.filter(update => {
      const matchesCategory = category === 'All' || primaryCategory(update).toLowerCase() === category.toLowerCase() || update.categories?.some(item => item.toLowerCase() === category.toLowerCase());
      const matchesSearch = !query || `${update.title} ${update.excerpt || ''} ${update.content || ''}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, currentUpdates, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const visible = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const chooseCategory = (value: string) => { setCategory(value); setPage(1); };
  const choosePage = (value: number) => {
    setPage(Math.max(1, Math.min(value, totalPages)));
    window.scrollTo({ top: 360, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#08263c]">
      <PageHeader
        title="Education"
        highlight="Updates"
        description="Find admissions, scholarships, university news and practical study guidance in one place."
        icon={<Sparkles />}
        badgeText="Information centre"
      />

      <main className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <section>
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#174f7a]">Check before you apply</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">Current study information</h2></div></div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {currentGuides.map(guide => (
              <Link key={guide.href} href={guide.href} className="group rounded-[1.5rem] border border-[#174f7a]/12 bg-[#f4f8fb] p-5 transition hover:-translate-y-1 hover:border-[#174f7a]/35">
                <span className="text-[10px] font-black uppercase tracking-[0.13em] text-[#174f7a]">{guide.label}</span>
                <h3 className="mt-3 text-lg font-extrabold leading-7">{guide.title}</h3>
                <ArrowRight size={15} className="mt-5 text-[#174f7a] transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        {(loading || currentUpdates.length > 0) && <section className="mt-12">
        <div className="rounded-[1.5rem] border border-[#174f7a]/12 bg-[#f4f8fb] p-4 sm:p-5">
          <label className="relative block">
            <span className="sr-only">Search updates</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#174f7a]" size={19} />
            <input
              value={search}
              onChange={event => { setSearch(event.target.value); setPage(1); }}
              placeholder="Search updates"
              className="min-h-13 w-full rounded-xl border border-[#174f7a]/15 bg-white pl-12 pr-4 text-base outline-none focus:border-[#174f7a]/50"
            />
          </label>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Update categories">
            {categories.map(item => (
              <button key={item} onClick={() => chooseCategory(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${category === item ? 'bg-[#08263c] text-white' : 'border border-[#174f7a]/15 bg-white text-[#174f7a] hover:bg-[#e8f5fb]'}`}>{item}</button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#174f7a]">Information library</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">Browse updates</h2></div>
          <span className="text-sm font-bold text-slate-500">{filtered.length} records</span>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading updates">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-[1.5rem] bg-[#edf3f6]" />)}</div>
        ) : visible.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map(update => (
              <article key={update.id} className="group overflow-hidden rounded-[1.5rem] border border-[#174f7a]/12 bg-white shadow-[0_8px_28px_rgba(8,38,60,.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(8,38,60,.11)]">
                <Link href={`/updates/${update.slug}`} className="block" aria-label={`Open ${update.type === 'article' ? 'article' : 'update'}: ${update.title}`}>
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#08263c]">
                    {update.featuredImage ? <Image src={update.featuredImage} alt={update.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" /> : <div className="grid h-full place-items-center text-sm font-black uppercase tracking-[0.15em] text-[#9bd8f3]">EduExpress update</div>}
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Link href={categoryHref(primaryCategory(update))} className="text-[10px] font-black uppercase tracking-[0.13em] text-[#174f7a] hover:underline">{primaryCategory(update)}</Link>
                    <span className="shrink-0 rounded-full border border-[#174f7a]/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.13em] text-slate-500">{update.type === 'article' ? 'Article' : 'Update'}</span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-xl font-extrabold leading-7 tracking-[-0.025em]"><Link href={update.slug ? `/updates/${update.slug}` : '#'} className="hover:underline">{update.title}</Link></h3>
                  {update.excerpt ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{update.excerpt}</p> : null}
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm text-slate-500">
                    <span className="truncate">{update.author}</span>
                    <span className="shrink-0">{fmtDate(update)}</span>
                  </div>
                  <Link href={`/updates/${update.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#174f7a]">{update.type === 'article' ? 'Read article' : 'Read update'} <ArrowRight size={14} className="transition group-hover:translate-x-1" /></Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.5rem] border border-dashed border-[#174f7a]/25 bg-[#f8fbfd] px-6 py-16 text-center"><Search size={28} className="mx-auto text-[#174f7a]" /><h3 className="mt-4 text-xl font-extrabold">No matching update</h3><button onClick={() => { setSearch(''); chooseCategory('All'); }} className="mt-4 text-sm font-black text-[#174f7a]">Clear search</button></div>
        )}

        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Update pages">
            <button onClick={() => choosePage(page - 1)} disabled={page === 1} aria-label="Previous page" className="grid size-11 place-items-center rounded-full border border-[#174f7a]/15 disabled:opacity-35"><ChevronLeft size={18} /></button>
            <span className="text-sm font-bold">{page} of {totalPages}</span>
            <button onClick={() => choosePage(page + 1)} disabled={page === totalPages} aria-label="Next page" className="grid size-11 place-items-center rounded-full border border-[#174f7a]/15 disabled:opacity-35"><ChevronRight size={18} /></button>
          </nav>
        )}
        </section>}
      </main>
    </div>
  );
}
