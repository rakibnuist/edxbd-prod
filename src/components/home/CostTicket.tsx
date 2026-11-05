import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Plane, X } from 'lucide-react';

type CostTicketProps = {
  priceLabel: string;
  included: string[];
  excluded: string[];
};

export default function CostTicket({ priceLabel, included, excluded }: CostTicketProps) {
  return (
    <section data-surface="dark" className="relative overflow-hidden bg-petrol-800 px-5 py-section text-white sm:px-8 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full border border-mint-300/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-[280px] rounded-full border border-mint-300/10"
      />

      <div className="relative mx-auto grid max-w-shell items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <p className="ed-label !text-mint-300">Money, stated plainly</p>
          <h2 className="mt-4 font-heading text-[clamp(2rem,4vw,3.2rem)] leading-[1.04] text-white">
            The package price is one number.
            <span className="mt-2 block text-mint-300">The full cost is another.</span>
          </h2>
          <p className="mt-5 max-w-[44ch] text-[14px] leading-7 text-white/70">
            The China visa-first package covers the work EduExpress does. University deposits, personal spending and
            some document fees are paid separately, and appear on your written schedule before you commit.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/fees-and-transparency" className="ed-btn ed-btn-signal min-h-11">
              Read every line item <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/china-visa-first-policy" className="ed-btn ed-btn-on-dark min-h-11">
              Payment terms
            </Link>
          </div>
        </div>

        <article
          className="home-ticket text-ink"
          style={{ '--notch-bg': '#0b2b45', '--notch-top': '57%' } as CSSProperties}
          aria-label={`China service package: ${priceLabel}`}
        >
          <div className="flex items-start justify-between gap-4 border-b border-rule/70 px-6 pb-4 pt-5 sm:px-7">
            <div>
              <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-mute">EduExpress International</p>
              <p className="mt-1 text-[13px] font-semibold text-petrol-700">China service package</p>
            </div>
            <span className="whitespace-nowrap rounded-full border border-petrol-600/30 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-petrol-600">
              Visa-first
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-6 pb-5 pt-5 sm:px-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-mute">From</p>
              <p className="ed-figure mt-1 text-[30px] leading-none text-ink">DAC</p>
              <p className="mt-1 text-[11px] text-ink-soft">Dhaka, Bangladesh</p>
            </div>
            <div className="flex flex-col items-center gap-1 text-petrol-600" aria-hidden="true">
              <Plane size={14} className="rotate-45" />
              <span className="w-12 border-t border-dashed border-rule-strong sm:w-20" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-mute">To</p>
              <p className="ed-figure mt-1 text-[30px] leading-none text-ink">CHN</p>
              <p className="mt-1 text-[11px] text-ink-soft">Your campus</p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 border-y border-rule/70 bg-chalk-50 px-6 py-4 sm:px-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-mute">Package price</p>
              <p className="ed-figure mt-1 text-[clamp(1.9rem,3.4vw,2.6rem)] leading-none text-petrol-700">{priceLabel}</p>
            </div>
            <p className="max-w-[18ch] text-right text-[11px] leading-5 text-ink-mute">No service fee before visa approval</p>
          </div>

          <div className="grid gap-6 px-6 py-5 sm:grid-cols-2 sm:px-7">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-jade">Included</p>
              <ul className="mt-3 space-y-1.5">
                {included.map(item => (
                  <li key={item} className="flex gap-1.5 text-[11.5px] leading-[1.55] text-ink-soft">
                    <Check size={12} className="mt-[3px] shrink-0 text-jade" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-clay">Paid separately</p>
              <ul className="mt-3 space-y-1.5">
                {excluded.map(item => (
                  <li key={item} className="flex gap-1.5 text-[11.5px] leading-[1.55] text-ink-soft">
                    <X size={12} className="mt-[3px] shrink-0 text-clay" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-l-2 border-marigold pl-2.5 text-[10.5px] leading-[1.6] text-ink-mute">
                University registration, seat or tuition deposits are paid separately when required.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-dashed border-rule-strong px-6 py-3.5 sm:px-7">
            <div className="flex items-end gap-[3px]" aria-hidden="true">
              {[3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1].map((width, index) => (
                <span key={index} className="block h-5 bg-ink/70" style={{ width: `${width}px` }} />
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-mute">EDX · BD · 2027</p>
          </div>
        </article>
      </div>
    </section>
  );
}
