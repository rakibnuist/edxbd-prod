import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';

const documents = [
  {
    number: '01',
    kicker: 'Recognition check',
    title: 'Recognition check',
    copy: 'Who recognises the degree, on which official source, and when it was last verified. Missing evidence is labelled missing — not estimated.',
    points: ['Official registries and sources', 'Programme-level recognition notes', 'Last-verified date on every record'],
    href: '/how-we-verify-universities',
    link: 'How verification works',
    tilt: '-1.6deg',
    tab: 'bg-petrol-600',
  },
  {
    number: '02',
    kicker: 'Cost schedule',
    title: 'Cost schedule',
    copy: 'Tuition, hostel, insurance, visa, travel and our service fee on one page, showing who receives each payment and what is refundable.',
    points: ['University and third-party fees separated', 'First-year cost in BDT', 'Refund terms in writing'],
    href: '/fees-and-transparency',
    link: 'Read the fee policy',
    tilt: '1.1deg',
    tab: 'bg-marigold',
  },
  {
    number: '03',
    kicker: 'Application record',
    title: 'Application record',
    copy: 'Every document you submitted, every deadline, and the exact status of your file — so nothing depends on remembering a phone call.',
    points: ['Timestamped submission references', 'Official fee receipts', 'Named counsellor and contact'],
    href: '/your-study-journey',
    link: 'See the six stages',
    tilt: '-0.6deg',
    tab: 'bg-jade',
  },
];

export default function FileSheets() {
  return (
    <section className="home-paper px-5 py-section sm:px-8 lg:px-12">
      <div className="mx-auto max-w-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[58ch]">
            <p className="ed-label">What you leave with</p>
            <h2 className="mt-4 font-heading text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              Not two hours of talk — three documents.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[14.5px] leading-7 text-ink-soft">
              Three documents decide whether a recommendation is safe to act on. You keep the copies.
            </p>
          </div>
          <Link href="/services" className="ed-btn ed-btn-outline min-h-11 shrink-0">
            See all services <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3 lg:gap-6">
          {documents.map((doc, index) => (
            <article
              key={doc.kicker}
              className="home-sheet group flex flex-col p-6 pb-5 sm:p-7"
              style={{ '--sheet-tilt': doc.tilt } as CSSProperties}
            >
              <span className={`home-sheet-tab ${doc.tab}`} aria-hidden="true" />

              <div className="flex items-baseline justify-between gap-3">
                <span className="ed-figure text-[14px] tracking-[0.08em] text-ink-mute">{doc.number}</span>
                <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-mute">{doc.kicker}</span>
              </div>

              <h3 className="mt-5 font-heading text-[clamp(1.5rem,2.2vw,1.85rem)] leading-snug text-ink">{doc.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-[1.75] text-ink-soft">{doc.copy}</p>

              <ul className="mt-5 space-y-2 border-t border-rule pt-4">
                {doc.points.map(point => (
                  <li key={point} className="flex items-start gap-2 text-[14px] leading-5 text-ink-soft">
                    <Check size={13} className="mt-1 shrink-0 text-jade" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                href={doc.href}
                className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-petrol-600 underline-offset-4 hover:underline"
              >
                {doc.link} <ArrowUpRight size={12} aria-hidden="true" />
              </Link>

              <span className="pointer-events-none absolute right-4 top-4 font-heading text-[46px] leading-none text-ink/[0.045]" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
