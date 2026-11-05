'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, ShieldCheck, Star } from 'lucide-react';

export type CarouselQuote = {
  id: string;
  quote: string;
  name: string;
  detail: string;
  rating: number;
  image?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const INTERVAL = 8000;

export default function TestimonialCarousel({ quotes }: { quotes: CarouselQuote[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const move = (delta: number) => {
    setIndex(current => (current + delta + quotes.length) % quotes.length);
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(entries => setInView(entries[0]?.isIntersecting ?? false), {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || !playing || reduced || quotes.length < 2) return;
    const timer = setInterval(() => {
      setIndex(current => (current + 1) % quotes.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [inView, paused, playing, reduced, quotes.length]);

  if (!quotes.length) return null;
  const active = quotes[index];

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Student stories"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 z-0 rounded-[40px] bg-gradient-to-br from-terra-100/70 via-chalk-100/0 to-marigold-100/60 blur-2xl"
      />

      <div className="relative z-10 overflow-hidden rounded-[26px] border border-rule bg-white shadow-[0_30px_70px_-48px_rgba(15,53,87,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-rule bg-chalk-100 px-5 py-3.5">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-ink">
            <span className="size-1.5 rounded-full bg-marigold" aria-hidden="true" />
            Student stories
            <span className="ml-0.5 rounded-full bg-mint-100 px-2 py-0.5 text-[12px] font-semibold normal-case tracking-normal text-petrol-600">
              {quotes.length} verified
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPlaying(value => !value)}
              aria-pressed={!playing}
              aria-label={playing ? 'Pause stories' : 'Play stories'}
              className="grid size-8 place-items-center rounded-full border border-rule bg-white text-ink-mute transition hover:border-petrol-300 hover:text-petrol-700"
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous student story"
              className="grid size-8 place-items-center rounded-full border border-rule bg-white text-petrol-700 transition hover:border-petrol-300 hover:bg-mint-100"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next student story"
              className="grid size-8 place-items-center rounded-full border border-rule bg-white text-petrol-700 transition hover:border-petrol-300 hover:bg-mint-100"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Quote */}
        <div className="min-h-[270px] sm:min-h-[250px]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
              className="relative flex h-full flex-col px-5 pb-5 pt-6 sm:px-7"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 text-[#d99a2b]" aria-label={`${active.rating} out of 5`}>
                  {Array.from({ length: Math.min(5, Math.max(1, active.rating)) }).map((_, star) => (
                    <Star key={star} size={14} className="fill-current" aria-hidden="true" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-jade">
                  <ShieldCheck size={12} aria-hidden="true" /> Consent on file
                </span>
              </div>

              <blockquote className="mt-4 font-heading text-[clamp(1.15rem,1.6vw,1.4rem)] leading-[1.5] tracking-[-0.01em] text-ink">
                <span className="mr-1 font-heading text-[1.4em] font-semibold leading-none text-terra/70" aria-hidden="true">
                  “
                </span>
                {active.quote}
              </blockquote>

              <div className="mt-auto flex items-center gap-3 border-t border-rule pt-4">
                {active.image ? (
                  <Image
                    src={active.image}
                    alt={active.name}
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-full border border-rule object-cover shadow-sm"
                  />
                ) : (
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-mint-200 to-chalk-200 font-heading text-[19px] font-semibold text-petrol-700 shadow-sm">
                    {active.name.slice(0, 1)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-ink">{active.name}</p>
                  <p className="truncate text-[14px] text-ink-mute">{active.detail}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Story avatar selector (replaces plain dots) */}
        <div className="flex items-center gap-2 border-t border-rule bg-chalk-100 px-5 py-3">
          {quotes.map((quote, dot) => {
            const isActive = dot === index;
            return (
              <button
                key={quote.id}
                type="button"
                onClick={() => setIndex(dot)}
                aria-label={`Show story ${dot + 1}: ${quote.name}`}
                aria-current={isActive ? 'true' : undefined}
                className={`relative size-9 shrink-0 overflow-hidden rounded-full border-2 transition ${
                  isActive ? 'border-terra opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                {quote.image ? (
                  <Image src={quote.image} alt="" width={36} height={36} className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center bg-mint-100 text-[14px] font-semibold text-petrol-700">
                    {quote.name.slice(0, 1)}
                  </span>
                )}
              </button>
            );
          })}
          <span className="ed-figure ml-auto text-[13px] text-ink-mute">
            {String(index + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
