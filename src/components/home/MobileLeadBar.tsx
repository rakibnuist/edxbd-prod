'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck, MessageCircle, Phone } from 'lucide-react';

import { trackPhoneClick, trackWhatsAppClick } from '@/lib/conversion-events';

export default function MobileLeadBar({ whatsappHref }: { whatsappHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const form = document.getElementById('assessment');
    const footer = document.getElementById('site-footer');
    if (!form) return;

    const formObserver = new IntersectionObserver(entries => setFormVisible(entries[0]?.isIntersecting ?? false), {
      threshold: 0.12,
    });
    formObserver.observe(form);

    let footerObserver: IntersectionObserver | undefined;
    if (footer) {
      footerObserver = new IntersectionObserver(entries => setFooterVisible(entries[0]?.isIntersecting ?? false), {
        threshold: 0.08,
      });
      footerObserver.observe(footer);
    }

    return () => {
      formObserver.disconnect();
      footerObserver?.disconnect();
    };
  }, []);

  if (!scrolled || formVisible || footerVisible) return null;

  return (
    <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 rounded-[22px] border border-rule bg-white/95 px-2.5 py-2 shadow-[0_18px_40px_-18px_rgba(15,53,87,0.45)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <a
          href="tel:+8801983333566"
          onClick={() => trackPhoneClick({ label: 'home_mobile_bar_phone' })}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-rule-strong px-2 text-[14px] font-bold text-petrol-700"
        >
          <Phone size={14} aria-hidden="true" /> Call
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick({ label: 'home_mobile_bar_whatsapp' })}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[#25d366] px-2 text-[14px] font-bold text-[#06251a]"
        >
          <MessageCircle size={14} aria-hidden="true" /> WhatsApp
        </a>
        <a
          href="#assessment"
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-lime px-2 text-[14px] font-bold text-petrol-800"
        >
          <CalendarCheck size={14} aria-hidden="true" /> Assessment
        </a>
      </div>
    </div>
  );
}
