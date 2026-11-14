'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Building2,
  Check,
  Compass,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';
import March2027LeadForm from './March2027LeadForm';
import MarchUniversityCatalogue from './MarchUniversityCatalogue';
import type { MarchCatalogueUniversity, MarchCatalogueProgramme } from '@/lib/march-campaign-catalogue';

const quickRoutes = [
  { label: 'Foundation → Bachelor', value: 'Foundation → Bachelor', badge: '12 Universities' },
  { label: 'Direct Bachelor', value: 'Direct Bachelor', badge: '4 Universities' },
  { label: 'Chinese Language', value: 'Chinese language', badge: '3 Institutions' },
  { label: 'Master’s Degree', value: 'Master’s', badge: 'Postgraduate' },
];

export default function March2027Experience({
  universities,
  whatsappNumber,
}: {
  universities: MarchCatalogueUniversity[];
  whatsappNumber: string;
}) {
  const [route, setRoute] = useState('');
  const [selection, setSelection] = useState<{ university: string; program: string } | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  const totalRoutes = universities.reduce((sum, uni) => sum + uni.programmes.length, 0);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const initialRoute = params.get('route');
      if (
        initialRoute &&
        ['Foundation → Bachelor', 'Direct Bachelor', 'Master’s', 'Chinese language', 'Help me choose a route'].includes(
          initialRoute
        )
      ) {
        setRoute(initialRoute);
      }
    } catch {
      // ignore URL parsing errors
    }
  }, []);

  useEffect(() => {
    const form = document.getElementById('march-2027-assessment');
    if (!form) return;
    let formVisible = false;
    const sync = () =>
      setShowSticky(!formVisible && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName || ''));
    const observer = new IntersectionObserver(
      entries => {
        formVisible = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    observer.observe(form);
    document.addEventListener('focusin', sync);
    document.addEventListener('focusout', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('focusin', sync);
      document.removeEventListener('focusout', sync);
    };
  }, []);

  const choose = (university: MarchCatalogueUniversity, programme: MarchCatalogueProgramme, major?: string) => {
    setSelection({ university: university.name, program: [programme.name, major].filter(Boolean).join(' · ') });
    setRoute(
      (
        {
          language: 'Chinese language',
          foundation: 'Foundation → Bachelor',
          bachelor: 'Direct Bachelor',
          masters: 'Master’s',
        } as Record<string, string>
      )[programme.route]
    );
    requestAnimationFrame(() => {
      const form = document.getElementById('march-2027-assessment');
      form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      (form?.querySelector('input, select') as HTMLElement | null)?.focus({ preventScroll: true });
    });
  };

  return (
    <>
      {/* Executive Dark-Petrol Split Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061a2b] via-[#0b2b45] to-[#12436b] px-5 pb-14 pt-9 text-white sm:px-8 lg:pb-20 lg:pt-12">
        {/* Subtle Architectural Grid & Glow Accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-lime/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-1/3 size-80 rounded-full bg-[#38bdf8]/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1180px]">
          {/* Executive Breadcrumb & Intake Window Bar */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs text-white/75">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-medium">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <span aria-hidden="true" className="text-white/35">
                /
              </span>
              <Link href="/study-in-china-from-bangladesh" className="transition hover:text-white">
                Study in China
              </Link>
              <span aria-hidden="true" className="text-white/35">
                /
              </span>
              <span className="font-bold text-lime">March 2027 Spring Intake</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/15 px-3 py-1 font-bold text-lime">
                <span className="size-1.5 rounded-full bg-lime" aria-hidden="true" />
                Applications Open · Apply by 31 Jan 2027
              </span>
              <span lang="bn" className="hidden rounded-full bg-white/10 px-3 py-1 font-bold text-white/95 sm:inline-block">
                ভিসার আগে ০ টাকা সার্ভিস চার্জ
              </span>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.18fr_1fr] lg:items-start lg:gap-12">
            {/* Left Hero Column */}
            <div className="min-w-0">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12.5px] font-bold uppercase tracking-wider text-lime">
                <Sparkles size={13} aria-hidden="true" />
                China Spring 2027 Admissions Desk · Dhaka
              </div>

              <h1 className="mt-5 font-display text-[42px] font-black leading-[0.95] tracking-[-0.02em] text-white sm:text-[56px] lg:text-[64px]">
                Study in China.
                <br />
                <span className="text-lime">March 2027 intake.</span>
              </h1>

              <p className="mt-5 max-w-xl text-[20px] font-semibold leading-snug text-white/95 sm:text-[22px]">
                Find your programme. Know your costs. Plan your next step with written proof.
              </p>

              <p className="mt-3 max-w-xl text-[16px] leading-7 text-white/80">
                Compare {universities.length} shortlisted Chinese universities and colleges across {totalRoutes} verified spring study routes—including Foundation → Bachelor, Direct Bachelor, Master’s, and bundled Tuition + Hostel Chinese Language programmes.
              </p>

              {/* 4 Key Executive Metric Cards */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                    <Building2 size={14} className="text-lime" aria-hidden="true" />
                    Shortlist
                  </div>
                  <p className="mt-1 font-display text-xl font-black text-white">{universities.length} Unis</p>
                  <p className="text-[11px] text-white/70">{totalRoutes} verified routes</p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                    <Award size={14} className="text-lime" aria-hidden="true" />
                    Scholarships
                  </div>
                  <p className="mt-1 font-display text-xl font-black text-lime">Up to 100%</p>
                  <p className="text-[11px] text-white/70">Tuition + stipends</p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                    <ShieldCheck size={14} className="text-lime" aria-hidden="true" />
                    Service Fee
                  </div>
                  <p className="mt-1 font-display text-xl font-black text-white">BDT 0</p>
                  <p className="text-[11px] text-white/70">Before visa approval</p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                    <Compass size={14} className="text-lime" aria-hidden="true" />
                    Pathways
                  </div>
                  <p className="mt-1 font-display text-xl font-black text-white">4 Routes</p>
                  <p className="text-[11px] text-white/70">Language to Master’s</p>
                </div>
              </div>

              {/* Interactive Quick Route Selector Pills */}
              <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.05] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-lime">
                  1. Select a study route to pre-fill your personalised plan:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickRoutes.map(item => {
                    const active = route === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setRoute(item.value);
                          setSelection(null);
                        }}
                        className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                          active
                            ? 'border-lime bg-lime text-petrol-800 shadow-sm'
                            : 'border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/15'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                            active ? 'bg-petrol-800/15 text-petrol-800' : 'bg-white/15 text-white/85'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Actions & Guarantees */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href="#march-2027-assessment"
                  className="ed-btn ed-btn-signal min-h-[52px] px-6 lg:hidden"
                >
                  Get my free study plan
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a
                  href="#study-options"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-[15px] font-bold text-white transition hover:bg-white/20"
                >
                  Explore all {universities.length} universities
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-white/90">
                  <span className="grid size-5 place-items-center rounded-full bg-lime text-petrol-800">
                    <Check size={13} strokeWidth={3} aria-hidden="true" />
                  </span>
                  No file opening charge
                </span>
              </div>

              {/* Campus Showcase Banner */}
              <figure className="relative mt-6 overflow-hidden rounded-3xl border border-white/15 bg-[#071f33] shadow-lg">
                <Image
                  src="/images/home/china-campus-group.webp"
                  alt="Bangladeshi students enrolled at a Chinese partner university campus"
                  width={1400}
                  height={1050}
                  priority
                  sizes="(max-width:1023px) 100vw, 620px"
                  className="h-[195px] w-full object-cover object-[center_68%] opacity-95 sm:h-[220px]"
                />
                <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#071f33]/95 px-5 py-3 text-[13px] text-white/90">
                  <span>English & Chinese-medium routes across major Chinese university cities</span>
                  <span className="shrink-0 font-bold text-lime">Bangladeshi students on campus</span>
                </figcaption>
              </figure>
            </div>

            {/* Right Hero Column: Lead Form */}
            <div className="lg:sticky lg:top-24 lg:pt-1">
              <March2027LeadForm
                whatsappNumber={whatsappNumber}
                route={route}
                onRoute={next => {
                  setRoute(next);
                  setSelection(null);
                }}
                selection={selection}
                onClearSelection={() => setSelection(null)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Executive Value Strip */}
      <div className="border-b border-slate-200/80 bg-white px-5 sm:px-8">
        <div
          data-anim="stagger"
          className="mx-auto grid max-w-[1180px] gap-5 py-8 sm:grid-cols-3 sm:gap-6"
        >
          {[
            {
              step: '01',
              icon: GraduationCap,
              title: 'A shortlist that fits you',
              copy: 'Matched to your HSC/A-Level or degree results, preferred major, and study goals.',
            },
            {
              step: '02',
              icon: Wallet,
              title: 'Costs you can plan for',
              copy: 'Tuition, hostel, scholarship conditions, and third-party fees itemised in writing.',
            },
            {
              step: '03',
              icon: FileCheck2,
              title: 'Ready for your application',
              copy: 'Clear document checklist, CSCA guidance, and visa processing with BDT 0 fee before visa.',
            },
          ].map(item => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-[#f8fafc] p-5"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-lime text-petrol-800 shadow-2xs">
                <item.icon size={21} aria-hidden="true" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2c6a97]">
                  Step {item.step}
                </span>
                <p className="mt-0.5 text-[17px] font-bold text-petrol-800">{item.title}</p>
                <p className="mt-1 text-[14px] leading-6 text-ink-soft">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 18-University Catalogue */}
      <MarchUniversityCatalogue universities={universities} onChoose={choose} />

      {/* Mobile Sticky CTA Bar */}
      {showSticky && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-canvas-soft bg-white p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(15,58,92,.08)] lg:hidden">
          <a
            href="#march-2027-assessment"
            className="ed-btn ed-btn-signal mx-auto flex min-h-12 w-full max-w-lg"
          >
            <Sparkles size={17} aria-hidden="true" />
            Get my free study plan
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      )}
    </>
  );
}
