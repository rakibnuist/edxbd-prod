import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, BadgeCheck, CalendarCheck, ChevronRight, MapPin, MessageCircle, ShieldCheck, Wallet } from 'lucide-react';
import { config } from '@/lib/config';
import { breadcrumbJsonLd, faqJsonLd, serializeJsonLd, type Crumb } from '@/lib/json-ld';

/**
 * Page kit for static pages (Wise-style system, see awesome-design-md/wise.md):
 * sage hero band, heavy Archivo display, 24px cards, lime primary action, navy
 * bands with lime headlines. Server components only — safe in any page.
 */

export const kit = {
  wrap: 'mx-auto max-w-[1200px] px-5 lg:px-8',
  h2: 'font-display text-[34px] font-black leading-[0.98] tracking-[-0.01em] text-petrol-800 sm:text-[46px]',
  h2OnDark: 'font-display text-[34px] font-black leading-[0.98] tracking-[-0.01em] text-lime sm:text-[46px]',
  h3: 'text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-petrol-800',
  lead: 'text-[18px] leading-[1.6] text-ink-soft sm:text-[19px]',
  body: 'text-[16px] leading-7 text-ink-soft',
  card: 'rounded-3xl bg-white p-6 sm:p-7',
  cardSage: 'rounded-3xl bg-canvas-soft p-6 sm:p-7',
  cardLime: 'rounded-3xl bg-lime-pale p-6 sm:p-7',
  cardDark: 'rounded-3xl bg-petrol-800 p-6 text-white sm:p-7',
  cardOutline: 'rounded-3xl border border-petrol-800 bg-white p-6 sm:p-7',
  badge: 'inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1.5 text-[14px] font-semibold text-lime-deep',
  icon: 'grid size-12 shrink-0 place-items-center rounded-full bg-white text-petrol-800',
  iconLime: 'grid size-12 shrink-0 place-items-center rounded-full bg-lime text-petrol-800',
  link: 'inline-flex items-center gap-1.5 text-[16px] font-semibold text-petrol-800 underline-offset-4 hover:underline',
};

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}

/** Visible trail + BreadcrumbList structured data from the same items. */
export function PageCrumbs({ trail, path }: { trail: Crumb[]; path: string }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail, path)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold text-ink-soft">
          <li><Link href="/" className="hover:text-petrol-800 hover:underline">Home</Link></li>
          {trail.map((item, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
                <ChevronRight size={14} className="text-ink-mute" aria-hidden="true" />
                {item.path && !last ? (
                  <Link href={item.path} className="hover:text-petrol-800 hover:underline">{item.name}</Link>
                ) : (
                  <span aria-current={last ? 'page' : undefined} className="text-petrol-800">{item.name}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

type PageHeroProps = {
  path: string;
  trail: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Buttons / links under the lead. */
  actions?: ReactNode;
  /** Right-hand column (photo, fact card, form). */
  aside?: ReactNode;
  /** Human date the content was last updated, e.g. "November 2026". */
  reviewed?: string;
};

/** Sage hero band shared by every static page. */
export function PageHero({ path, trail, eyebrow, title, lead, actions, aside, reviewed }: PageHeroProps) {
  return (
    <section className="bg-canvas-soft pb-14 pt-[96px] sm:pt-[112px] lg:pb-20 lg:pt-[140px]">
      <div className={`${kit.wrap} grid gap-10 ${aside ? 'lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-14' : ''}`}>
        <div className={aside ? '' : 'max-w-4xl'}>
          <div className="anim-rise"><PageCrumbs trail={trail} path={path} /></div>
          {eyebrow && <p style={delay(40)} className={`anim-rise mt-6 ${kit.badge}`}>{eyebrow}</p>}
          <h1 style={delay(80)} className="anim-lift mt-5 font-display text-[44px] font-black leading-[0.95] tracking-[-0.02em] text-petrol-800 sm:text-[64px] lg:text-[76px]">
            {title}
          </h1>
          {lead && <p style={delay(160)} className={`anim-rise mt-6 max-w-2xl ${kit.lead}`}>{lead}</p>}
          {actions && <div style={delay(240)} className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>}
          {reviewed && (
            <p style={delay(300)} className="anim-rise mt-7 inline-flex items-center gap-2 text-[14px] text-ink-soft">
              <ShieldCheck size={17} className="shrink-0 text-green-500" aria-hidden="true" />
              Last updated {reviewed}
            </p>
          )}
        </div>
        {aside && <div style={delay(200)} className="anim-rise">{aside}</div>}
      </div>
    </section>
  );
}

type Tone = 'white' | 'sage' | 'navy';
const toneClass: Record<Tone, string> = {
  white: 'bg-white',
  sage: 'bg-canvas-soft',
  navy: 'bg-petrol-800 text-white',
};

/** A full-width band with an optional heading row. */
export function Section({
  tone = 'white',
  id,
  title,
  intro,
  action,
  children,
  className = '',
}: {
  tone?: Tone;
  id?: string;
  title?: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`${toneClass[tone]} scroll-mt-28 py-16 lg:py-20 ${className}`}>
      <div className={kit.wrap}>
        {(title || intro || action) && (
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5 lg:mb-12">
            <div className="max-w-3xl">
              {title && <h2 data-anim="up" className={tone === 'navy' ? kit.h2OnDark : kit.h2}>{title}</h2>}
              {intro && <p className={`mt-4 ${tone === 'navy' ? 'text-[18px] leading-[1.6] text-white/85' : kit.lead}`}>{intro}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Four standing facts that make a consultancy checkable. */
export function TrustBar({ universities, destination, feeNote }: { universities?: number; destination?: string; feeNote?: string }) {
  const isMalaysia = destination?.toLowerCase() === 'malaysia';
  const feeTitle = isMalaysia ? 'BDT 0 service fee' : 'BDT 0 before visa';
  const feeText = feeNote || (isMalaysia ? 'Free admission guidance for Malaysia' : 'No EduExpress fee before visa approval');
  const items = [
    { icon: CalendarCheck, title: 'Since 2018', text: 'Counselling families from Dhanmondi, Dhaka' },
    { icon: MapPin, title: 'Visit in person', text: 'Saturday to Thursday, 11 AM to 6 PM' },
    { icon: Wallet, title: feeTitle, text: feeText },
    universities
      ? { icon: BadgeCheck, title: `${universities} universities`, text: 'Fees and scholarships checked at source' }
      : { icon: BadgeCheck, title: 'Costs in writing', text: 'Every payment listed before you commit' },
  ];
  return (
    <section aria-label="Why families trust EduExpress" className="border-b border-canvas-soft bg-white py-8">
      <ul data-anim="stagger" className={`${kit.wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
        {items.map(item => (
          <li key={item.title} className="flex items-start gap-3.5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><item.icon size={20} aria-hidden="true" /></span>
            <span>
              <span className="block text-[17px] font-bold text-petrol-800">{item.title}</span>
              <span className="block text-[15px] leading-6 text-ink-soft">{item.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Visible FAQ and FAQPage structured data from one list. */
export function FaqBlock({
  items,
  title = 'Frequently asked questions',
  tone = 'sage',
}: {
  items: { question: string; answer: string }[];
  title?: string;
  tone?: 'white' | 'sage';
}) {
  if (!items.length) return null;
  return (
    <Section tone={tone} title={title}>
      <JsonLd data={faqJsonLd(items)} />
      <div data-anim="stagger" className="grid max-w-4xl gap-3">
        {items.map(item => (
          <details key={item.question} className={`faq-smooth group rounded-3xl px-6 ${tone === 'sage' ? 'bg-white' : 'bg-canvas-soft'}`}>
            <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-5 py-4 text-[18px] font-semibold leading-snug text-petrol-800">
              {item.question}
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-[22px] leading-none text-petrol-800 transition group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="pb-6 pr-10 text-[16px] leading-7 text-ink-soft">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/** Navy closing band with the two primary actions. */
export function CtaBand({
  title = 'Not sure where to start?',
  text = 'Tell us your results, budget and preferred country. A counsellor calls you within one working day with realistic options, the costs and the documents to prepare.',
}: {
  title?: string;
  text?: string;
}) {
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Assalamu alaikum. I would like counselling for studying abroad.')}`;
  return (
    <section data-cta-band className="bg-petrol-800 py-16 text-white lg:py-20">
      <div className={`${kit.wrap} flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between`}>
        <div className="max-w-2xl">
          <h2 data-anim="pop" className="font-display text-[40px] font-black leading-[0.95] tracking-[-0.02em] text-lime sm:text-[56px]">{title}</h2>
          <p className="mt-5 text-[18px] leading-[1.6] text-white/85">{text}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[54px] px-7">
            Get my free assessment <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-on-dark min-h-[54px] px-7">
            <MessageCircle size={18} aria-hidden="true" /> WhatsApp a counsellor
          </a>
        </div>
      </div>
    </section>
  );
}
