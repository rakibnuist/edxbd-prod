import Link from 'next/link';
import { ArrowRight, CheckCircle2, ExternalLink, Info, ShieldAlert, ShieldCheck, Trophy } from 'lucide-react';
import { Section, kit } from '@/components/page/PageKit';
import type { OfficialSource } from '@/lib/pathway-comparison';

export type WinProofCard = {
  readonly badge: string;
  readonly metric: string;
  readonly title: string;
  readonly detail: string;
};

export function WinningAdvantageGrid({
  tone = 'white',
  id,
  title,
  intro,
  cards,
}: {
  tone?: 'white' | 'sage' | 'navy';
  id?: string;
  title: string;
  intro: string;
  cards: readonly WinProofCard[];
}) {
  return (
    <Section tone={tone} id={id} title={title} intro={intro}>
      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map(card => (
          <div
            key={card.title}
            className="flex flex-col justify-between rounded-3xl border border-emerald-700/15 bg-white p-6 shadow-sm sm:p-7"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className={kit.badge}>
                  <Trophy size={13} aria-hidden="true" />
                  {card.badge}
                </span>
              </div>
              <p className="mt-4 font-display text-[26px] font-black leading-tight text-emerald-800 sm:text-[30px]">
                {card.metric}
              </p>
              <h3 className={`mt-2 ${kit.h3}`}>{card.title}</h3>
              <p className={`mt-2 ${kit.body}`}>{card.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function LivingCostSeparationNotice({
  tone = 'sage',
  title = 'Living Costs Are Shown Separately From Tuition Totals',
  summary,
}: {
  tone?: 'white' | 'sage';
  title?: string;
  summary: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-petrol-800/15 p-5 sm:p-6 ${
        tone === 'sage' ? 'bg-canvas-soft' : 'bg-white'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-lime text-petrol-800">
          <Info size={20} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[15px] font-bold text-petrol-800">{title}</p>
          <p className="mt-1 text-[14.5px] leading-6 text-ink-soft">{summary}</p>
        </div>
      </div>
    </div>
  );
}

export function FitVsReconsiderGrid({
  fitTitle,
  fitItems,
  reconsiderTitle,
  reconsiderItems,
}: {
  fitTitle: string;
  fitItems: { label: string; detail: string }[];
  reconsiderTitle: string;
  reconsiderItems: { label: string; detail: string }[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
            <CheckCircle2 size={20} aria-hidden="true" />
          </span>
          <h3 className={kit.h3}>{fitTitle}</h3>
        </div>
        <ul className="mt-5 space-y-3.5 text-[15px] leading-6 text-ink-soft">
          {fitItems.map(item => (
            <li key={item.label} className="flex items-start gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-700" aria-hidden="true" />
              <span>
                <strong className="text-petrol-800">{item.label}: </strong>
                {item.detail}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-900">
            <ShieldAlert size={20} aria-hidden="true" />
          </span>
          <h3 className={kit.h3}>{reconsiderTitle}</h3>
        </div>
        <ul className="mt-5 space-y-3.5 text-[15px] leading-6 text-ink-soft">
          {reconsiderItems.map(item => (
            <li key={item.label} className="flex items-start gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
              <span>
                <strong className="text-petrol-800">{item.label}: </strong>
                {item.detail}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const RELATED_PATHWAYS = [
  {
    href: '/study-in-malaysia-after-o-level',
    badge: 'After O-Level',
    title: 'Study in Malaysia After O-Level',
    desc: 'Start a 1-year Foundation or 2-year Diploma right after O-Levels and save 2 years.',
  },
  {
    href: '/study-in-china-after-o-level-ssc',
    badge: 'After O-Level / SSC',
    title: 'Study in China After O-Level or SSC',
    desc: 'Complete a 3-year Diploma + 2-year Top-Up Bachelor in 5 years total.',
  },
  {
    href: '/compare-bachelor-china-abroad-bangladesh',
    badge: 'After A-Level / Comparison',
    title: 'China Bachelor vs UK, USA, Australia & Dhaka',
    desc: 'Compare top-ranked Chinese universities & university scholarships side by side.',
  },
] as const;

export function PathwayCrossLinks({
  currentPath,
  extraLinks,
  tone = 'white',
}: {
  currentPath: string;
  extraLinks?: { label: string; href: string }[];
  tone?: 'white' | 'sage';
}) {
  const siblingCards = RELATED_PATHWAYS.filter(item => item.href !== currentPath);
  return (
    <Section
      tone={tone}
      title="Compare Related O-Level & A-Level Pathways"
      intro="Explore the connected EduExpress guides before selecting a study route."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {siblingCards.map(card => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-7"
          >
            <div>
              <span className={kit.badge}>{card.badge}</span>
              <h3 className={`mt-4 ${kit.h3} group-hover:underline`}>{card.title}</h3>
              <p className={`mt-2 ${kit.body}`}>{card.desc}</p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-bold text-petrol-800">
              Open pathway guide <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>

      {extraLinks && extraLinks.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          {extraLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-petrol-800/15 bg-white px-4 py-2 text-[14px] font-semibold text-petrol-800 hover:bg-lime-pale"
            >
              {link.label} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}

export function PathwayGovernanceSection({
  tone = 'sage',
  authorName,
  authorRole,
  reviewerName = 'Abdullah Al Rakib',
  reviewerRole = 'Founder and CEO (Chinese & International Higher Education since 2018)',
  lastVerified = '21 November 2026',
  nextReview = '21 February 2027',
  whatMayChange,
  sources,
}: {
  tone?: 'white' | 'sage';
  authorName: string;
  authorRole: string;
  reviewerName?: string;
  reviewerRole?: string;
  lastVerified?: string;
  nextReview?: string;
  whatMayChange: string[];
  sources: OfficialSource[];
}) {
  return (
    <Section
      tone={tone}
      title="Verification, Editorial Review & What May Change"
      intro="Every figure on this page separates tuition from living expenses and cites its primary authority or institution schedule."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-petrol-800">
            <ShieldCheck size={20} className="text-emerald-700" aria-hidden="true" />
            <h3 className="text-[17px] font-bold">Editorial &amp; Review Record</h3>
          </div>
          <dl className="mt-4 space-y-2.5 text-[14px] leading-6 text-ink-soft">
            <div>
              <dt className="font-semibold text-petrol-800">Prepared by</dt>
              <dd>{authorName} · {authorRole}</dd>
            </div>
            <div>
              <dt className="font-semibold text-petrol-800">Reviewed by</dt>
              <dd>{reviewerName} · {reviewerRole}</dd>
            </div>
            <div>
              <dt className="font-semibold text-petrol-800">Last verified / Next review</dt>
              <dd>{lastVerified} · Next scheduled review: {nextReview}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
          <h3 className="text-[17px] font-bold text-petrol-800">What May Change Before You Apply</h3>
          <ul className="mt-4 space-y-2 text-[14px] leading-6 text-ink-soft">
            {whatMayChange.map(note => (
              <li key={note} className="flex items-start gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-petrol-800" aria-hidden="true" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
          <h3 className="text-[17px] font-bold text-petrol-800">Primary Official Sources</h3>
          <ul className="mt-4 space-y-2.5 text-[14px] leading-6">
            {sources.map(source => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 font-semibold text-petrol-800 underline-offset-4 hover:underline"
                >
                  <ExternalLink size={14} className="mt-1 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span>{source.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
