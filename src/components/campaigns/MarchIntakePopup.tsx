'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';

const STORAGE_KEY = 'edx_march_2027_popup_dismissed_v3';
const CAMPAIGN_PATH = '/china-march-2027-intake';

const HIGHLIGHTS = [
  '17 Partner Universities (Bachelor, Foundation, Master’s & Language)',
  'Up to 100% Tuition Scholarships & monthly stipends',
  'BDT 0 Service Fee Before Visa · ভিসার আগে এক টাকাও না',
];

export default function MarchIntakePopup() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isExcludedRoute =
    !pathname ||
    pathname === CAMPAIGN_PATH ||
    pathname.startsWith('/china-march-2027-intake/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard');

  useEffect(() => {
    setMounted(true);
    if (isExcludedRoute) {
      setOpen(false);
      return;
    }

    try {
      const dismissed = window.sessionStorage.getItem(STORAGE_KEY);
      if (dismissed === '1') return;
    } catch {
      // ignore storage errors
    }

    setOpen(true);
  }, [isExcludedRoute]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismissPopup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const dismissPopup = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore storage errors
    }
    setOpen(false);
  };

  const handleGoToLeadGen = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore storage errors
    }
    setOpen(false);
    router.push(`${CAMPAIGN_PATH}#march-2027-assessment`);
  };

  if (isExcludedRoute || !mounted || !open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="march-intake-popup-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        onClick={dismissPopup}
        aria-hidden="true"
        className="fixed inset-0 bg-[#051827]/70 backdrop-blur-xs transition-opacity"
      />

      {/* Clean, Minimal Single-Column Modal */}
      <div className="relative z-10 w-full max-w-[430px] overflow-hidden rounded-3xl bg-white p-6 shadow-[0_24px_70px_rgba(5,24,39,0.45)] ring-1 ring-slate-200/80 sm:p-8">
        {/* Top Close & Badge Row */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-petrol-800 px-3.5 py-1 text-xs font-bold text-lime">
            <span className="size-2 rounded-full bg-lime" aria-hidden="true" />
            China March 2027 Intake
          </span>

          <button
            type="button"
            onClick={dismissPopup}
            aria-label="Close March 2027 Intake popup"
            className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title & Subtitle */}
        <h2
          id="march-intake-popup-title"
          className="mt-5 font-display text-[28px] font-black leading-[1.08] tracking-tight text-petrol-800 sm:text-[32px]"
        >
          Study in China — March 2027 Intake
        </h2>

        <p className="mt-2.5 text-[15px] leading-6 text-slate-600">
          Compare 17 verified universities, scholarship tiers, and your complete cost breakdown in writing.
        </p>

        {/* Clean 3-Point Checklist */}
        <ul className="mt-5 space-y-2.5 border-y border-slate-100 py-4">
          {HIGHLIGHTS.map(item => (
            <li key={item} className="flex items-start gap-2.5 text-[14px] font-medium leading-5 text-petrol-800">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={handleGoToLeadGen}
          className="ed-btn ed-btn-signal mt-6 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-bold shadow-sm transition"
        >
          Apply for March 2027 Intake
          <ArrowRight size={17} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={dismissPopup}
          className="mt-2.5 block w-full py-1.5 text-center text-xs font-semibold text-slate-500 transition hover:text-petrol-800"
        >
          Continue browsing website
        </button>
      </div>
    </div>
  );
}
