'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export type RegisterQuote = {
  id: string;
  quote: string;
  name: string;
  detail: string;
  rating: number;
  image?: string;
};

export default function QuoteRegister({ quotes }: { quotes: RegisterQuote[] }) {
  const [index, setIndex] = useState(0);
  if (!quotes.length) return null;
  const active = quotes[index];

  const move = (delta: number) => setIndex(current => (current + delta + quotes.length) % quotes.length);

  return (
    <div className="home-sheet grid overflow-hidden !rotate-0 lg:grid-cols-[minmax(0,1fr)_248px]">
      <div className="relative p-6 sm:p-9 lg:p-10" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-[#d99a2b]" aria-label={`${active.rating} out of 5`}>
            {Array.from({ length: Math.min(5, Math.max(1, active.rating)) }).map((_, star) => (
              <Star key={star} size={14} className="fill-current" aria-hidden="true" />
            ))}
          </div>
          <span className="home-stamp rotate-[-1.4deg] !border-jade/60 !px-2 !py-1 text-[9px] !text-jade">
            Consent on file
          </span>
        </div>

        <blockquote className="relative mt-5 max-w-[54ch] font-heading text-[clamp(1.25rem,2vw,1.62rem)] leading-[1.42] text-ink">
          “{active.quote}”
        </blockquote>

        <div className="mt-7 flex items-center gap-3 border-t border-rule pt-5">
          {active.image ? (
            <Image
              src={active.image}
              alt={active.name}
              width={52}
              height={52}
              className="size-[52px] shrink-0 rounded-2xl border border-rule object-cover"
            />
          ) : (
            <span className="grid size-[52px] shrink-0 place-items-center rounded-2xl border border-rule bg-chalk-50 font-heading text-[19px] text-petrol-700">
              {active.name.slice(0, 1)}
            </span>
          )}
          <div>
            <p className="text-[14px] font-semibold text-ink">{active.name}</p>
            <p className="mt-0.5 text-[12px] text-ink-mute">{active.detail}</p>
          </div>
          <span className="ml-auto hidden text-[10.5px] text-ink-mute sm:block">Published with consent</span>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-5 border-t border-rule bg-chalk-50 p-5 lg:border-l lg:border-t-0 lg:p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              className="grid size-9 place-items-center rounded-full border border-rule-strong text-petrol-700 transition hover:border-petrol-500 hover:bg-mint-100"
              aria-label="Previous story"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="grid size-9 place-items-center rounded-full border border-rule-strong text-petrol-700 transition hover:border-petrol-500 hover:bg-mint-100"
              aria-label="Next story"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <span className="ed-figure text-[12px] text-ink-mute">
            {String(index + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}
          </span>
        </div>

        <ol className="grid gap-1">
          {quotes.map((quote, position) => (
            <li key={quote.id}>
              <button
                type="button"
                onClick={() => setIndex(position)}
                aria-current={position === index ? 'true' : undefined}
                className={`w-full truncate border-l-2 py-1.5 pl-3 text-left text-[12px] transition-colors ${
                  position === index
                    ? 'border-marigold font-semibold text-petrol-700'
                    : 'border-transparent text-ink-mute hover:border-rule-strong hover:text-ink'
                }`}
              >
                {quote.name}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
