'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const PAGES_WITH_OWN_FORM = new Set(['/', '/education-fit-assessment', '/apply', '/contact']);

/**
 * Site-wide assessment prompt at the top of the footer.
 * Hidden where the page already carries the form (home, assessment, apply,
 * contact) and, via CSS, on any page that ends with its own CtaBand.
 */
export default function FooterCta() {
  const pathname = usePathname();
  if (PAGES_WITH_OWN_FORM.has(pathname)) return null;

  return (
    <div className="footer-cta mx-auto max-w-[1200px] px-5 pt-14 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#0b2b45] via-[#0f3a5c] to-[#12436b] p-7 text-white shadow-2xl sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-lime/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lime">
              <Sparkles size={13} aria-hidden="true" />
              Free Profile &amp; Cost Evaluation
            </span>
            <h2 className="mt-3.5 font-display text-[32px] font-black leading-[0.98] tracking-[-0.01em] text-white sm:text-[42px]">
              Not sure which university or intake fits your budget?
            </h2>
            <p className="mt-3 text-[16.5px] leading-7 text-white/80">
              Get a free written assessment from our Dhanmondi counselling desk. We compare university recognition, realistic scholarship tiers, and your complete cost schedule before you commit.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/85">
              {['BDT 0 before China visa approval', 'Written cost breakdown', 'Parents welcome'].map(item => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-lime" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get my free assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/contact" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">
              Talk to a counsellor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
