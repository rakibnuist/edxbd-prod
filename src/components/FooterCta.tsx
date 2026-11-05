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
    <div className="border-b border-white/10 bg-petrol-700 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-shell items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-[26px] font-bold leading-tight text-white sm:text-[30px]">Not sure where to begin?</h2>
          <p className="mt-2 max-w-3xl text-[17px] leading-7 text-white/85">
            Get a free assessment. A counsellor compares the cost, the recognition and your visa readiness, and explains it in writing.
          </p>
        </div>
        <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7 text-[16px]">
          Get my free assessment <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
