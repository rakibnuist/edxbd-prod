'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Building2,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'edx_march_2027_popup_dismissed_v2';
const CAMPAIGN_PATH = '/china-march-2027-intake';

const FEATURED_LOGOS = [
  { name: 'SJTU', src: '/images/campaigns/march-2027/shanghai-jiao-tong-university.png' },
  { name: 'HIT', src: '/images/campaigns/march-2027/harbin-institute-of-technology.png' },
  { name: 'HUST', src: '/images/campaigns/march-2027/huazhong-university-of-science-and-technology.png' },
  { name: 'NUAA', src: '/images/campaigns/march-2027/nanjing-university-of-aeronautics-and-astronautics.jpg' },
  { name: 'CQMU', src: '/images/campaigns/march-2027/chongqing-medical-university.png' },
  { name: 'NTU', src: '/images/campaigns/march-2027/nantong-university.png' },
];

const STUDY_ROUTES = [
  {
    title: 'Foundation → Bachelor',
    routeValue: 'Foundation → Bachelor',
    badge: '12 Unis',
    desc: '1-semester prep + 4-year degree with up to 100% tuition waiver & stipends',
  },
  {
    title: 'Direct Bachelor',
    routeValue: 'Direct Bachelor',
    badge: '4 Unis',
    desc: 'Direct March entry in CS, AI, Engineering, Business, Pharmacy & MBBS',
  },
  {
    title: 'Master’s Degree',
    routeValue: 'Master’s',
    badge: 'Postgrad',
    desc: 'Full tuition + hostel scholarship routes for bachelor graduates',
  },
  {
    title: 'Chinese Language',
    routeValue: 'Chinese language',
    badge: 'Top 100',
    desc: 'Study at World Top 100 SJTU & HUST from CNY 7,300 / semester',
  },
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

  const handleGoToLeadGen = (selectedRoute?: string) => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore storage errors
    }
    setOpen(false);
    const query = selectedRoute ? `?route=${encodeURIComponent(selectedRoute)}` : '';
    router.push(`${CAMPAIGN_PATH}${query}#march-2027-assessment`);
  };

  if (isExcludedRoute || !mounted) {
    return null;
  }

  if (!open) {
    return (
      <div className="fixed bottom-20 left-4 z-40 flex items-center gap-1.5 rounded-full border border-lime/40 bg-petrol-800 p-1.5 pl-3.5 text-white shadow-[0_14px_34px_rgba(7,30,48,0.35)] lg:bottom-6 lg:left-16">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 text-left text-xs font-bold tracking-wide text-white transition hover:text-lime"
        >
          <span className="size-2 animate-pulse rounded-full bg-lime" aria-hidden="true" />
          <span>China March 2027 Intake</span>
        </button>
        <button
          type="button"
          onClick={() => handleGoToLeadGen()}
          className="inline-flex items-center gap-1 rounded-full bg-lime px-3 py-1.5 text-xs font-extrabold text-petrol-800 transition hover:bg-[#8ee05a]"
        >
          Apply
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="march-intake-popup-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-5"
    >
      {/* Backdrop */}
      <div
        onClick={dismissPopup}
        aria-hidden="true"
        className="fixed inset-0 bg-[#051827]/80 backdrop-blur-xs transition-opacity"
      />

      {/* Executive 2-Column Split Modal */}
      <div className="relative z-10 grid max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/15 bg-white shadow-[0_32px_90px_rgba(5,24,39,0.55)] lg:grid-cols-[0.95fr_1.05fr] lg:overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={dismissPopup}
          aria-label="Close China March 2027 Intake announcement"
          className="absolute right-3.5 top-3.5 z-20 grid size-10 place-items-center rounded-full bg-petrol-800/80 text-white transition hover:bg-petrol-800 lg:bg-slate-100 lg:text-slate-700 lg:hover:bg-slate-200"
        >
          <X size={19} />
        </button>

        {/* Left Column: Visual Showcase, Partner Logos & Student Proof */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#061a2b] via-petrol-800 to-[#0e3959] p-6 text-white sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-lime/15 blur-3xl"
          />

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lime/35 bg-lime/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-lime">
              <span className="size-2 animate-pulse rounded-full bg-lime" aria-hidden="true" />
              China March 2027 Intake · Open
            </div>

            {/* Campus Photo Banner */}
            <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-2xl border border-white/15 bg-[#071f33]">
              <Image
                src="/images/students/campus-nuist.webp"
                alt="Bangladeshi student on campus in China"
                fill
                sizes="(max-width:1024px) 90vw, 420px"
                className="object-cover object-[60%_38%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061a2b]/90 via-[#061a2b]/20 to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-white">17 Shortlisted Chinese Universities</span>
                <span className="rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-extrabold text-petrol-800">
                  Up to 100% Scholarship
                </span>
              </div>
            </div>

            {/* University Crests Strip */}
            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                Featured March 2027 Universities:
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {FEATURED_LOGOS.map(logo => (
                  <div
                    key={logo.name}
                    title={logo.name}
                    className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-xs"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={34}
                      height={34}
                      className="max-h-8 w-auto object-contain"
                    />
                  </div>
                ))}
                <span className="rounded-xl border border-white/15 bg-white/10 px-2.5 py-2 text-xs font-bold text-lime">
                  +11 more
                </span>
              </div>
            </div>
          </div>

          {/* Real Student Social Proof Box */}
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-white/15 bg-white/8 p-3.5 backdrop-blur-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex gap-0.5 text-[#f5b301]" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  ))}
                </span>
                <span className="text-[11px] font-bold text-lime">Real Student Outcome</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-white/90">
                &ldquo;EduExpress helped me secure a Full Tuition Scholarship + 1,200 CNY monthly stipend for Computer Science in Shanghai, with airport pickup and BDT 0 fee before my visa.&rdquo;
              </p>
              <p className="mt-1.5 text-[11px] font-bold text-white">
                Naoroj Jaman Rafi · <span className="font-normal text-white/75">Shanghai University of Electric Power</span>
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-lime/30 bg-lime/15 px-4 py-2.5">
              <div>
                <p lang="bn" className="text-base font-bold text-lime">
                  ভিসার আগে এক টাকাও না।
                </p>
                <p className="text-xs font-semibold text-white/90">
                  BDT 0 EduExpress service fee before visa approval
                </p>
              </div>
              <ShieldCheck size={24} className="shrink-0 text-lime" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Right Column: Route Selection & Lead Generation Redirect */}
        <div className="flex flex-col justify-between p-6 sm:p-7">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2c6a97]">
              <GraduationCap size={15} aria-hidden="true" />
              Spring 2027 Admissions · Dhanmondi Desk
            </span>

            <h2
              id="march-intake-popup-title"
              className="mt-2 font-display text-[26px] font-black leading-[1.04] tracking-tight text-petrol-800 sm:text-[32px]"
            >
              Get your March 2027 China Study Plan.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Select your preferred pathway below or click Apply to check university eligibility, scholarship tiers, and your itemised cost plan.
            </p>

            {/* 4 Interactive Route Cards */}
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {STUDY_ROUTES.map(item => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handleGoToLeadGen(item.routeValue)}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-[#f8fafc] p-3.5 text-left transition hover:border-petrol-800 hover:bg-[#f0f7fc] hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-extrabold text-petrol-800 group-hover:text-[#12436b]">
                        {item.title}
                      </span>
                      <span className="shrink-0 whitespace-nowrap rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-[#2c6a97] ring-1 ring-slate-200/80">
                        {item.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11.5px] leading-4.5 text-slate-600">{item.desc}</p>
                  </div>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-petrol-800 group-hover:underline">
                    Select & check eligibility
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              ))}
            </div>

            {/* Key Facts Row */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5 font-bold text-petrol-800">
                <CalendarCheck size={14} className="text-lime-deep" aria-hidden="true" />
                Deadline: 31 January 2027
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" aria-hidden="true" />
                No file opening charge
              </span>
              <span className="inline-flex items-center gap-1">
                <Award size={13} className="text-amber-600" aria-hidden="true" />
                Written cost breakdown
              </span>
            </div>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => handleGoToLeadGen()}
              className="ed-btn ed-btn-signal inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-bold shadow-md transition"
            >
              <Sparkles size={16} aria-hidden="true" />
              Apply for March 2027 Intake
              <ArrowRight size={16} aria-hidden="true" />
            </button>

            <Link
              href={`${CAMPAIGN_PATH}#study-options`}
              onClick={dismissPopup}
              className="inline-flex min-h-[50px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-petrol-800 transition hover:bg-slate-50"
            >
              <Building2 size={15} aria-hidden="true" />
              17 Universities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
