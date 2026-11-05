'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

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
    <div className="footer-cta mx-auto max-w-[1200px] px-5 pt-16 lg:px-8">
      <div className="flex flex-col gap-6 rounded-3xl bg-white p-7 text-petrol-800 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-[34px] font-black leading-[0.95] tracking-[-0.01em] sm:text-[44px]">Not sure where to begin?</h2>
          <p className="mt-3 max-w-2xl text-[17px] leading-7 text-ink-soft">
            Get a free assessment. A counsellor compares the cost, the recognition and your visa readiness, and explains it in writing.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
            Get my free assessment <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/contact" className="ed-btn ed-btn-outline min-h-[52px] px-7">Talk to a counsellor</Link>
        </div>
      </div>
    </div>
  );
}
