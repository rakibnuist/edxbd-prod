import Link from 'next/link';
import { ArrowRight, Check, CircleDollarSign, FileCheck2, Plane, RotateCcw, ShieldCheck } from 'lucide-react';
import { Section, kit } from '@/components/page/PageKit';

type ServicePackage = {
  id: string;
  slug: string;
  title: string;
  packageType: string;
  priceLabel: string;
  summary: string;
  outcomeScope: string;
  includedItems: string[];
  excludedItems: string[];
  paymentTerms: string;
  refundTerms: string;
  securityOptions: string[];
  complianceNote: string;
};

const darkH3 = 'text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime';

export default function ChinaServicePackages({ packages }: { packages: ServicePackage[] }) {
  if (!packages.length) return null;
  const shared = packages[0];
  const single = packages.length === 1;

  return (
    <Section
      tone="sage"
      id="china-package"
      title="One China package. A clear responsibility plan."
      intro="The university scholarship letter defines the education benefit. The EduExpress package defines the application support, included costs, payment timing and responsibilities."
    >
      <div data-anim="stagger" className={`grid gap-5 ${single ? '' : 'lg:grid-cols-2'}`}>
        {packages.map((item, index) => {
          const dark = index === 0;
          return (
            <article key={item.id} className={dark ? kit.cardDark : kit.card}>
              <div className={`grid gap-6 ${single ? 'lg:grid-cols-[1fr_1.1fr] lg:gap-12' : ''}`}>
                <div>
                  <div className="flex items-start justify-between gap-5">
                    <span className={kit.iconLime}>{dark ? <ShieldCheck size={22} aria-hidden="true" /> : <CircleDollarSign size={22} aria-hidden="true" />}</span>
                    <span className={`rounded-full px-3.5 py-1.5 text-[14px] font-semibold ${dark ? 'bg-white/10 text-white' : 'bg-canvas-soft text-petrol-800'}`}>Package 0{index + 1}</span>
                  </div>
                  <h3 className={`mt-6 font-display text-[30px] font-black leading-[1] tracking-[-0.01em] ${dark ? 'text-white' : 'text-petrol-800'}`}>{item.title}</h3>
                  <p className={`mt-4 font-display text-[40px] font-black leading-none ${dark ? 'text-lime' : 'text-petrol-800'}`}>{item.priceLabel}</p>
                </div>
                <div>
                  <p className={`text-[16px] leading-7 ${dark ? 'text-white/80' : 'text-ink-soft'}`}>{item.summary}</p>
                  <p className={`mt-5 rounded-2xl p-4 text-[15px] leading-6 ${dark ? 'bg-white/5 text-white/80' : 'bg-canvas-soft text-ink-soft'}`}>{item.outcomeScope}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div data-anim="stagger" className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <article className={kit.card}>
          <div className="flex items-center gap-3">
            <span className={kit.iconLime}><FileCheck2 size={22} aria-hidden="true" /></span>
            <h3 className={kit.h3}>Included in your package</h3>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {shared.includedItems.map(item => (
              <li key={item} className="flex gap-3 rounded-2xl bg-canvas-soft p-3.5 text-[15px] leading-6 text-ink-soft">
                <Check size={18} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </article>
        <div className="grid gap-5">
          <article className={kit.cardLime}>
            <span className={kit.icon}><Plane size={22} aria-hidden="true" /></span>
            <h3 className={`mt-5 ${kit.h3}`}>Paid separately</h3>
            <ul className="mt-3 space-y-2">
              {shared.excludedItems.map(item => <li key={item} className="text-[15px] leading-6 text-ink-soft">{item}</li>)}
            </ul>
          </article>
          <article className={kit.cardDark}>
            <span className={kit.iconLime}><RotateCcw size={22} aria-hidden="true" /></span>
            <h3 className={`mt-5 ${darkH3}`}>Payment and return terms</h3>
            <p className="mt-3 text-[15px] leading-6 text-white/80">{shared.paymentTerms}</p>
            <p className="mt-3 text-[15px] leading-6 text-white/80">{shared.refundTerms}</p>
          </article>
        </div>
      </div>

      <article data-anim="up" className={`mt-5 ${kit.cardOutline}`}>
        <h3 className={kit.h3}>Document and payment protection</h3>
        <p className="mt-3 max-w-4xl text-[16px] leading-7 text-ink-soft">
          No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.
        </p>
        <p className="mt-5 border-l-4 border-lime pl-4 text-[15px] leading-6 text-ink-soft">{shared.complianceNote}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/study-in-china-from-bangladesh#china-fit-form" className="ed-btn ed-btn-signal min-h-[52px] px-7">
            Check which route fits me <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/china-visa-first-policy" className="ed-btn ed-btn-outline min-h-[52px] px-7">Read the visa-first policy</Link>
        </div>
      </article>
    </Section>
  );
}
