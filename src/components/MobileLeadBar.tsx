'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { trackAssessmentStart, trackPhoneClick, trackWhatsAppClick } from '@/lib/conversion-events';

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
    const targets = ['assessment', 'china-fit-form', 'china-fit-form-bottom', 'march-2027-assessment', 'b2b-inquiry', 'partnership-form', 'site-footer']
      .map(id => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    const intersecting = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) intersecting.set(entry.target, entry.isIntersecting);
        setBlocked(Array.from(intersecting.values()).some(Boolean));
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

  const isChinaHub = pathname === '/study-in-china-from-bangladesh';
  const isMarchCampaign = pathname === '/china-march-2027-intake';
  const isB2B = pathname === '/b2b';
  const isPartnership = pathname === '/partnership';
  const isPartnerDesk = isB2B || isPartnership;
  const assessmentHref = isChinaHub
    ? '#china-fit-form'
    : isMarchCampaign
      ? '#march-2027-assessment'
      : isB2B
        ? '#b2b-inquiry'
        : isPartnership
          ? '#partnership-form'
          : '/education-fit-assessment';
  const whatsappHref =
    `https://wa.me/${PHONE.replace(/\D/g, '')}?text=` +
    encodeURIComponent(
      isChinaHub
        ? 'Assalamu alaikum. I would like a free Study in China plan from EduExpress International.'
        : isMarchCampaign
          ? 'Assalamu alaikum. I would like a study plan for China March 2027 intake.'
          : isB2B
            ? 'Hello EduExpress B2B Desk, I would like to discuss agency/sub-agent onboarding and written MOU terms.'
            : isPartnership
              ? 'Hello EduExpress Partner Desk, I would like to discuss agency partnership and China USD partner terms.'
              : 'Assalamu alaikum. I would like counselling for studying abroad.',
    );
  const visible = scrolled && !blocked;

  return (
    <div
      data-mobile-bar={visible ? 'open' : 'closed'}
      className={`mobile-lead-bar fixed inset-x-0 bottom-0 z-40 transition-all duration-300 lg:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-lg px-3 pb-[calc(env(safe-area-inset-bottom,0px)+10px)]">
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-rule bg-white/95 p-1.5 shadow-[0_-20px_60px_-30px_rgba(15,53,87,0.5)] backdrop-blur-md">
          <a
            href={`tel:${PHONE}`}
            onClick={() => trackPhoneClick({ label: 'mobile_bar_phone' })}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-[14px] font-bold text-petrol-700 transition-colors hover:bg-mint-100"
          >
            <Phone size={15} aria-hidden="true" />
            Call
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ label: 'mobile_bar_whatsapp' })}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-[14px] font-bold text-jade transition-colors hover:bg-mint-100"
          >
            <MessageCircle size={15} aria-hidden="true" />
            WhatsApp
          </a>
          {assessmentHref.startsWith('#') ? (
            <a
              href={assessmentHref}
              onClick={() =>
                trackAssessmentStart({
                  destination: isPartnerDesk ? 'b2b' : 'china',
                  label: isPartnership ? 'partnership_mobile_apply' : isB2B ? 'mobile_bar_b2b' : 'mobile_bar_china_assess',
                })
              }
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-lime px-2 text-[14px] font-bold text-petrol-800 transition-colors hover:bg-lime-hover"
            >
              {isPartnership ? 'Apply' : isB2B ? 'B2B Desk' : 'Free Plan'}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          ) : (
            <Link
              href={assessmentHref}
              onClick={() => trackAssessmentStart({ label: 'mobile_bar_assess' })}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-petrol-700 px-2 text-[14px] font-bold text-white transition-colors hover:bg-petrol-600"
            >
              Assess
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
