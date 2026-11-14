'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Award, Building2, CalendarCheck, CheckCircle2, ShieldCheck, Sparkles, X } from 'lucide-react';

const STORAGE_KEY = 'edx_march_2027_popup_dismissed_v1';
const CAMPAIGN_PATH = '/china-march-2027-intake';

export default function MarchIntakePopup() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isExcludedRoute =
    !pathname ||
    pathname === CAMPAIGN_PATH ||
    pathname.startsWith('/china-march-2027-intake/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard');

  useEffect(() => {
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

    // Show immediately when visitor lands on the website
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

  if (isExcludedRoute || !open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="march-intake-popup-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={dismissPopup}
        aria-hidden="true"
        className="fixed inset-0 bg-[#071e30]/75 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-white shadow-[0_28px_80px_rgba(7,30,48,0.45)]">
        {/* Top Executive Banner */}
        <div className="relative overflow-hidden bg-petrol-800 px-6 pb-6 pt-6 text-white sm:px-8 sm:pb-7 sm:pt-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-lime/15 blur-3xl"
          />
          <button
            type="button"
            onClick={dismissPopup}
            aria-label="Close China March 2027 Intake announcement"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20 hover:text-white"
          >
            <X size={19} />
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lime">
            <span className="size-2 animate-pulse rounded-full bg-lime" aria-hidden="true" />
            China March 2027 Intake · Admissions Open
          </div>

          <h2
            id="march-intake-popup-title"
            className="mt-3.5 font-display text-[28px] font-black leading-[1.05] tracking-tight text-white sm:text-[34px]"
          >
            Study in China — <span className="text-lime">March 2027 Intake</span>
          </h2>

          <p className="mt-2.5 max-w-lg text-[15px] leading-relaxed text-white/85 sm:text-[16px]">
            Get your personalised university shortlist, scholarship eligibility check, and complete written cost plan for the Spring 2027 intake.
          </p>
        </div>

        {/* Highlights & CTA Body */}
        <div className="p-6 sm:p-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-petrol-800">
                <Building2 size={15} className="shrink-0 text-petrol-700" aria-hidden="true" />
                17 Universities
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                Foundation → Bachelor, Direct Bachelor, Master’s & Language routes.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
                <Award size={15} className="shrink-0 text-emerald-700" aria-hidden="true" />
                Scholarships
              </div>
              <p className="mt-1.5 text-xs leading-5 text-emerald-950/80">
                Up to 100% tuition waivers + monthly stipends on degree progression.
              </p>
            </div>

            <div className="rounded-2xl border border-lime-deep/20 bg-lime-pale/60 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-petrol-800">
                <ShieldCheck size={15} className="shrink-0 text-lime-deep" aria-hidden="true" />
                Visa-First Policy
              </div>
              <p className="mt-1.5 text-xs font-semibold leading-5 text-petrol-800">
                ভিসার আগে এক টাকাও না · BDT 0 service fee before visa.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-[#f8fafc] px-4 py-3 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-semibold text-petrol-800">
              <CalendarCheck size={15} className="text-lime-deep" aria-hidden="true" />
              Deadline: 31 January 2027
            </span>
            <span className="hidden text-slate-300 sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" aria-hidden="true" />
              No file opening charge
            </span>
            <span className="hidden text-slate-300 sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" aria-hidden="true" />
              CSCA & Engineering / Medical / Business routes
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleGoToLeadGen}
              className="ed-btn ed-btn-signal inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-bold shadow-md transition"
            >
              <Sparkles size={17} aria-hidden="true" />
              Apply for March 2027 Intake
              <ArrowRight size={17} aria-hidden="true" />
            </button>

            <Link
              href={`${CAMPAIGN_PATH}#study-options`}
              onClick={dismissPopup}
              className="inline-flex min-h-[52px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-petrol-800 transition hover:bg-slate-50"
            >
              View 17 Universities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
