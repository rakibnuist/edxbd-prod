'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, CornerDownLeft, Search, X } from 'lucide-react';

type SearchHit = {
  kind: 'university' | 'program' | 'guide' | 'page';
  title: string;
  href: string;
  context: string;
  meta?: string;
};

const kindLabel: Record<SearchHit['kind'], string> = {
  university: 'University',
  program: 'Programme',
  guide: 'Advice',
  page: 'Page',
};

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    restoreFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement as HTMLElement;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then(response => (response.ok ? response.json() : { hits: [] }))
        .then(data => {
          setHits(Array.isArray(data.hits) ? data.hits : []);
          setActive(0);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, query ? 140 : 0);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, query]);

  const flatHrefs = useMemo(() => hits.map(hit => hit.href), [hits]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(index => Math.min(index + 1, hits.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(index => Math.max(index - 1, 0));
    }
    if (event.key === 'Enter' && flatHrefs[active]) {
      event.preventDefault();
      close();
      router.push(flatHrefs[active]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden min-h-10 items-center gap-2 rounded-full border border-rule bg-chalk-50 px-3 py-2 text-[15px] font-medium text-ink-soft transition hover:border-petrol-400 hover:text-petrol-700 lg:inline-flex"
        aria-label="Search universities, programmes and guides"
      >
        <Search size={15} aria-hidden="true" />
        {/* Label and shortcut only where the six-item menu leaves room. */}
        <span className="xl:hidden 2xl:inline">Search</span>
        <kbd className="ml-1 hidden 2xl:inline rounded border border-rule bg-white px-1.5 py-0.5 text-[12px] font-semibold text-ink-mute">⌘K</kbd>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-full border border-rule bg-white text-petrol-700 lg:hidden"
        aria-label="Search"
      >
        <Search size={17} aria-hidden="true" />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" role="presentation">
          <button type="button" aria-label="Close search" onClick={close} className="absolute inset-0 cursor-default bg-petrol-900/45 backdrop-blur-[2px]" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search EduExpress"
            className="relative w-full max-w-[640px] overflow-hidden rounded-3xl border border-petrol-800/20 bg-chalk shadow-deep"
          >
            <div className="flex items-center gap-3 border-b border-rule px-4">
              <Search size={18} className="shrink-0 text-petrol-500" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={event => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="University, programme, city or guide"
                aria-label="Search universities, programmes and guides"
                aria-autocomplete="list"
                aria-controls="search-results"
                className="h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-mute"
                autoComplete="off"
              />
              <button type="button" onClick={close} className="grid size-8 shrink-0 place-items-center rounded-full text-ink-mute hover:bg-chalk-100 hover:text-ink" aria-label="Close search">
                <X size={16} />
              </button>
            </div>

            <div id="search-results" role="listbox" aria-label="Search results" className="max-h-[52vh] overflow-y-auto p-2">
              {loading && <p className="px-3 py-4 text-sm text-ink-mute">Searching…</p>}
              {!loading && hits.length === 0 && (
                <p className="px-3 py-6 text-sm text-ink-mute">
                  Nothing matched “{query}”. Try a subject, a city, or <Link href="/universities" onClick={close} className="font-semibold text-petrol-600 underline underline-offset-4">browse the finder</Link>.
                </p>
              )}
              {hits.map((hit, index) => (
                <Link
                  key={`${hit.kind}-${hit.href}-${hit.title}`}
                  href={hit.href}
                  role="option"
                  aria-selected={index === active}
                  onClick={close}
                  onMouseEnter={() => setActive(index)}
                  className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${index === active ? 'bg-mint-100' : 'hover:bg-chalk-100'}`}
                >
                  <span className="mt-0.5 w-[74px] shrink-0 text-[13px] font-semibold text-petrol-500">{kindLabel[hit.kind]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-ink">{hit.title}</span>
                    <span className="mt-0.5 block truncate text-[14px] text-ink-mute">{hit.context}</span>
                  </span>
                  {hit.meta && <span className="hidden shrink-0 text-[13px] text-ink-mute sm:block">{hit.meta}</span>}
                  <ArrowUpRight size={14} className="mt-1 shrink-0 text-petrol-400" aria-hidden="true" />
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-rule bg-chalk-50 px-4 py-2.5 text-[13px] text-ink-mute">
              <span className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1"><CornerDownLeft size={12} /> open</span>
                <span>↑ ↓ move</span>
                <span>esc close</span>
              </span>
              <span>Live records, refreshed every five minutes</span>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
