'use client';

import { useEffect, useState } from 'react';
import { Handshake, MessageCircle, Phone } from 'lucide-react';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/conversion-events';

type PartnershipMobileBarProps = {
  whatsappHref: string;
  phoneHref: string;
};

export default function PartnershipMobileBar({ whatsappHref, phoneHref }: PartnershipMobileBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 360);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const form = document.getElementById('partnership-form');
    const footer = document.getElementById('site-footer');
    if (!form) return;

    const formObserver = new IntersectionObserver(
      (entries) => setFormVisible(entries[0]?.isIntersecting ?? false),
      { threshold: 0.12 },
    );
    formObserver.observe(form);

    let footerObserver: IntersectionObserver | undefined;
    if (footer) {
      footerObserver = new IntersectionObserver(
        (entries) => setFooterVisible(entries[0]?.isIntersecting ?? false),
        { threshold: 0.08 },
      );
      footerObserver.observe(footer);
    }

    return () => {
      formObserver.disconnect();
      footerObserver?.disconnect();
    };
  }, []);

  if (!scrolled || formVisible || footerVisible) return null;

  return (
    <div
      data-mobile-bar="partnership"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 rounded-[22px] border border-rule bg-white/95 px-2.5 py-2 shadow-[0_18px_40px_-18px_rgba(15,53,87,0.45)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <a
          href={phoneHref}
          data-tracking-type="phone"
          onClick={() => trackPhoneClick({ destination: 'china', label: 'partnership_mobile_phone' })}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-rule-strong px-2 text-[14px] font-bold text-petrol-800"
        >
          <Phone size={14} aria-hidden="true" /> Call Desk
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          data-tracking-type="whatsapp"
          onClick={() => trackWhatsAppClick({ destination: 'china', label: 'partnership_mobile_whatsapp' })}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[#e8f8ed] px-2 text-[14px] font-bold text-[#14532d]"
        >
          <MessageCircle size={14} aria-hidden="true" /> WhatsApp
        </a>
        <a
          href="#partnership-form"
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-lime px-2 text-[14px] font-extrabold text-petrol-800"
        >
          <Handshake size={14} aria-hidden="true" /> Apply
        </a>
      </div>
    </div>
  );
}
