import Link from 'next/link';
import { ArrowRight, CheckCircle2, Download, ExternalLink, FileText, Info, ShieldAlert, ShieldCheck, Trophy } from 'lucide-react';
import { Section, kit } from '@/components/page/PageKit';
import { PATHWAY_BOOKLET_PDF, type OfficialSource } from '@/lib/pathway-comparison';

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
  const cardSurface =
    tone === 'navy' ? kit.cardDark : tone === 'sage' ? kit.card : kit.cardSage;
  const isNavy = tone === 'navy';

  return (
    <Section tone={tone} id={id} title={title} intro={intro}>
      <div data-anim="stagger" className="grid gap-6 lg:grid-cols-3">
        {cards.map(card => (
          <div
            key={card.title}
            className={`${cardSurface} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={
                    isNavy
                      ? 'inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-lime'
                      : kit.badge
                  }
                >
                  <Trophy size={13} aria-hidden="true" />
                  {card.badge}
                </span>
              </div>
              <p
                className={`mt-4 font-display text-[26px] font-black leading-tight sm:text-[30px] ${
                  isNavy ? 'text-lime' : 'text-petrol-800'
                }`}
              >
                {card.metric}
              </p>
              <h3 className={`mt-2 ${isNavy ? 'font-display text-[20px] font-bold leading-snug tracking-[-0.015em] text-white sm:text-[22px]' : kit.h3}`}>
                {card.title}
              </h3>
              <p className={`mt-2 ${isNavy ? 'text-[15.5px] leading-[1.68] text-white/75' : kit.body}`}>
                {card.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function BookletDownloadBanner({
  tone = 'white',
  contextNote = 'Compare O-Level & A-Level pathways across Malaysia and China for September 2027 in one printable 10-page A4 guide—verified against QS World Rankings 2027 and late-November 2026 FX baselines.',
}: {
  tone?: 'white' | 'sage';
  contextNote?: string;
}) {
  return (
    <div className={`${tone === 'sage' ? 'bg-white' : 'bg-canvas-soft'} rounded-3xl border border-petrol-800/12 p-5 sm:p-7`}>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-petrol-800 text-lime">
            <FileText size={22} aria-hidden="true" />
          </span>
          <div>
            <span className="inline-flex items-center rounded-full bg-lime-pale px-3 py-0.5 text-[12px] font-bold text-lime-deep">
              {PATHWAY_BOOKLET_PDF.pagesLabel}
            </span>
            <h3 className="mt-2 font-display text-[20px] font-black leading-snug text-petrol-800 sm:text-[22px]">
              Download the September 2027 Malaysia &amp; China Pathway Booklet
            </h3>
            <p className="mt-1.5 max-w-2xl text-[14.5px] leading-6 text-ink-soft">{contextNote}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a
            href={PATHWAY_BOOKLET_PDF.href}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="ed-btn ed-btn-signal min-h-[48px] px-6"
          >
            <Download size={17} aria-hidden="true" />
            Download 10-Page PDF
          </a>
        </div>
      </div>
    </div>
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
    <div className={`${tone === 'sage' ? kit.cardSage : kit.card} p-5 sm:p-6`}>
      <div className="flex items-start gap-3.5">
        <span className={kit.iconLime}>
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
  tone = 'white',
  fitTitle,
  fitItems,
  reconsiderTitle,
  reconsiderItems,
}: {
  tone?: 'white' | 'sage';
  fitTitle: string;
  fitItems: { label: string; detail: string }[];
  reconsiderTitle: string;
  reconsiderItems: { label: string; detail: string }[];
}) {
  const reconsiderCard = tone === 'sage' ? kit.card : kit.cardSage;
  return (
    <div data-anim="stagger" className="grid gap-6 lg:grid-cols-2">
      <div className={kit.cardLime}>
        <div className="flex items-center gap-3">
          <span className={kit.iconLime}>
            <CheckCircle2 size={20} aria-hidden="true" />
          </span>
          <h3 className={kit.h3}>{fitTitle}</h3>
        </div>
        <ul className="mt-5 space-y-3.5 text-[15px] leading-6 text-ink-soft">
          {fitItems.map(item => (
            <li key={item.label} className="flex items-start gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-deep" aria-hidden="true" />
              <span>
                <strong className="text-petrol-800">{item.label}: </strong>
                {item.detail}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className={reconsiderCard}>
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-clay/10 text-clay">
            <ShieldAlert size={20} aria-hidden="true" />
          </span>
          <h3 className={kit.h3}>{reconsiderTitle}</h3>
        </div>
        <ul className="mt-5 space-y-3.5 text-[15px] leading-6 text-ink-soft">
          {reconsiderItems.map(item => (
            <li key={item.label} className="flex items-start gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-clay" aria-hidden="true" />
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
    badge: 'After O-Level / SSC / Dakhil',
    title: 'Study in China After O-Level, SSC or Dakhil',
    desc: 'Complete a 3-year Diploma + 2-year Top-Up Bachelor in 5 years total.',
  },
  {
    href: '/compare-bachelor-china-abroad-bangladesh',
    badge: 'After A-Level / Comparison',
    title: 'China Bachelor vs UK, USA, Australia & Dhaka',
    desc: 'Compare top-ranked Chinese universities & university scholarships side by side.',
  },
  {
    href: '/bangladesh-vs-china-bachelor-study',
    badge: 'Cost & Ranking',
    title: 'Bangladesh Private University vs China Bachelor',
    desc: 'Side-by-side 4-year tuition, hostel costs, BDT separation & BDT 0 pre-visa policy.',
  },
  {
    href: '/bangladesh-vs-study-abroad-countries',
    badge: 'Decision Matrix',
    title: 'Bangladesh vs China, Malaysia, UK, USA & Australia',
    desc: 'Filter 7 bachelor pathways by SSC/O-Level or HSC/Alim/A-Level budget and rank.',
  },
  {
    href: '/bangladesh-study-abroad-market',
    badge: '2027 Benchmark',
    title: 'Bangladesh Study Abroad Market & Cost Benchmark 2027',
    desc: 'Verified UNESCO/UGC flows, BDT cost floors & scholarship data across 6 destinations.',
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
  const cardSurface = tone === 'sage' ? kit.card : kit.cardSage;
  return (
    <Section
      tone={tone}
      title="Compare Related O-Level, SSC, Dakhil & A-Level Pathways"
      intro="Explore the connected EduExpress guides before selecting a study route."
    >
      <div data-anim="stagger" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {siblingCards.map(card => (
          <Link
            key={card.href}
            href={card.href}
            className={`${cardSurface} group flex flex-col justify-between transition hover:-translate-y-0.5`}
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
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-petrol-800/15 bg-white px-4 py-2 text-[14px] font-semibold text-petrol-800 transition hover:bg-lime-pale"
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
  const cardSurface = tone === 'sage' ? kit.card : kit.cardSage;
  return (
    <Section
      tone={tone}
      title="Verification, Editorial Review & What May Change"
      intro="Every figure on this page separates tuition from living expenses and cites its primary authority or institution schedule."
    >
      <div data-anim="stagger" className="grid gap-6 lg:grid-cols-3">
        <div className={cardSurface}>
          <div className="flex items-center gap-2.5 text-petrol-800">
            <ShieldCheck size={20} className="text-lime-deep" aria-hidden="true" />
            <h3 className="text-[17px] font-bold">Editorial &amp; Review Record</h3>
          </div>
          <dl className="mt-4 space-y-2.5 text-[14px] leading-6 text-ink-soft">
            <div>
              <dt className="font-semibold text-petrol-800">Prepared by</dt>
              <dd>{authorName} · {authorRole}</dd>
            </div>
            <div>
              <dt className="font-semibold text-petrol-800">Reviewed by</dt>
              <dd>
                {reviewerName === 'Abdullah Al Rakib' ? (
                  <Link href="/author/abdullah-al-rakib" className="font-semibold text-petrol-800 underline underline-offset-4 hover:text-emerald-800">
                    {reviewerName}
                  </Link>
                ) : (
                  reviewerName
                )}{' '}
                · {reviewerRole}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-petrol-800">Last verified / Next review</dt>
              <dd>{lastVerified} · Next scheduled review: {nextReview}</dd>
            </div>
            <div>
              <dt className="font-semibold text-petrol-800">Industry associations</dt>
              <dd>
                Founding Member (#08),{' '}
                <a
                  href="https://cbcabd.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-petrol-800 underline underline-offset-4 hover:text-lime-deep"
                >
                  CBCA
                </a>{' '}
                · Active Member (ID: FCM-452),{' '}
                <a
                  href="https://www.facdcab.org/members/directory/2264"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-petrol-800 underline underline-offset-4 hover:text-lime-deep"
                >
                  FACD-CAB (FACECAB #2264)
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className={cardSurface}>
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

        <div className={cardSurface}>
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
                  <ExternalLink size={14} className="mt-1 shrink-0 text-lime-deep" aria-hidden="true" />
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
