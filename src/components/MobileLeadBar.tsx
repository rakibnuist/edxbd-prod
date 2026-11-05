'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const PHONE = '+8801983333566';

export default function MobileLeadBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Do not cover the lead form or the footer links.
    const targets = [document.getElementById('assessment'), document.getElementById('site-footer')].filter(
      (element): element is HTMLElement => Boolean(element),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        setBlocked(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.04 },
    );
    targets.forEach((element) => observer.observe(element));

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [pathname]);

  if (
    pathname === '/' ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/sitemap-submission')
  ) {
    return null;
  }

  const assessmentHref = pathname === '/' ? '#assessment' : '/education-fit-assessment';
  const whatsappHref =
    `https://wa.me/${PHONE.replace(/\D/g, '')}?text=` +
    encodeURIComponent('Assalamu alaikum. I would like counselling for studying abroad.');
  const visible = scrolled && !blocked;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-300 lg:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-lg px-3 pb-[calc(env(safe-area-inset-bottom,0px)+10px)]">
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-rule bg-white/95 p-1.5 shadow-[0_-20px_60px_-30px_rgba(15,53,87,0.5)] backdrop-blur-md">
          <a
            href={`tel:${PHONE}`}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-[14px] font-bold text-petrol-700 transition-colors hover:bg-mint-100"
          >
            <Phone size={15} aria-hidden="true" />
            Call
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-[14px] font-bold text-jade transition-colors hover:bg-mint-100"
          >
            <MessageCircle size={15} aria-hidden="true" />
            WhatsApp
          </a>
          <Link
            href={assessmentHref}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-petrol-700 px-2 text-[14px] font-bold text-white transition-colors hover:bg-petrol-600"
          >
            Assess
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
