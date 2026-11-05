'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

/**
 * Site-wide assessment prompt in the footer.
 * Hidden on the homepage, which closes with its own richer call to action
 * (assessment + phone + WhatsApp + office) — two stacked prompts read as a mistake.
 */
export default function FooterCta() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-petrol-800 px-5 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 ed-grid-lines opacity-80" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -top-24 size-[320px] rounded-full bg-sky-500/20 blur-[80px]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-shell items-end gap-7 md:grid-cols-[1fr_auto]">
        <div>
          <p className="ed-label !text-mint-300">Not sure where to begin?</p>
          <h2 className="mt-3 max-w-3xl font-heading text-[clamp(1.6rem,2.6vw,2.35rem)] leading-[1.12] text-white">
            Start with a free fit assessment. We compare the cost, the recognition and your visa readiness in writing.
          </h2>
        </div>
        <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-12 md:min-h-13">
          Get a free fit assessment <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
