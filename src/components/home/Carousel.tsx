'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontal, scroll-snap carousel used on the homepage for destinations,
 * testimonials and guides. Native scrolling (touch, trackpad, keyboard) does
 * the real work; the buttons and progress bar are progressive enhancements.
 * Reduced-motion users get instant jumps instead of smooth scrolling (the
 * global stylesheet also zeroes transition durations for them).
 */
type CarouselProps = {
  /** Accessible name, e.g. "Study destinations". */
  label: string;
  items: ReactNode[];
  /** Width classes for each slide, e.g. "w-[280px] sm:w-[320px]". */
  itemClassName?: string;
  className?: string;
  /** Gap between slides in px (must match the wrapper's gap class). */
  gap?: number;
};

export default function Carousel({ label, items, itemClassName = '', className = '', gap = 16 }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [progress, setProgress] = useState(0);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const overflow = max > 8;
    setHasOverflow(overflow);
    setCanPrev(overflow && el.scrollLeft > 8);
    setCanNext(overflow && el.scrollLeft < max - 8);
    setProgress(overflow && max > 0 ? Math.min(100, Math.max(0, (el.scrollLeft / max) * 100)) : 100);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null;
    observer?.observe(el);
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      observer?.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const step = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>('[data-carousel-item]');
    const distance = slide ? slide.offsetWidth + gap : Math.round(el.clientWidth * 0.8);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direction * distance, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1767a0]"
      >
        {items.map((item, index) => (
          <div
            key={index}
            data-carousel-item
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
            className={`snap-start shrink-0 ${itemClassName}`}
          >
            {item}
          </div>
        ))}
      </div>

      {hasOverflow && (
        <>
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={!canPrev}
            aria-label={`Scroll ${label} backwards`}
            className="absolute -left-3 top-[38%] hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-[#1767a0] shadow-[0_10px_30px_rgba(15,55,87,.16)] backdrop-blur-sm transition hover:border-[#1767a0]/40 hover:text-[#102a43] disabled:cursor-default disabled:opacity-0 lg:grid"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={!canNext}
            aria-label={`Scroll ${label} forwards`}
            className="absolute -right-3 top-[38%] hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-[#1767a0] shadow-[0_10px_30px_rgba(15,55,87,.16)] backdrop-blur-sm transition hover:border-[#1767a0]/40 hover:text-[#102a43] disabled:cursor-default disabled:opacity-0 lg:grid"
          >
            <ChevronRight size={20} />
          </button>

          <div className="mt-5 flex items-center gap-3" aria-hidden="true">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200/80">
              <div className="h-full rounded-full bg-[#f4a024] transition-[width] duration-300" style={{ width: `${Math.max(6, progress)}%` }} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[.14em] text-slate-400">Swipe or drag</span>
          </div>
        </>
      )}
    </div>
  );
}
