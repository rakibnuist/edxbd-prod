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
    <div className="border-b border-white/15 bg-[#08263c] px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#8ed0ee]">Not sure where to begin?</p>
          <h2 className="mt-2.5 max-w-3xl font-heading text-2xl font-bold leading-tight sm:text-3xl">
            Start with a free fit assessment. We will compare the cost, the recognition and your visa chances.
          </h2>
        </div>
        <Link
          href="/education-fit-assessment"
          className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#64b5df] px-6 text-base font-black text-[#08263c] transition hover:bg-white md:w-auto"
        >
          Get a free fit assessment <ArrowUpRight size={18} />
        </Link>
      </div>
    </div>
  );
}
