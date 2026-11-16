'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Building2,
  Check,
  ChevronRight,
  Compass,
  GraduationCap,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { trackWhatsAppClick } from '@/lib/conversion-events';
import ChinaPillarLeadForm from './ChinaPillarLeadForm';
import { dispatchChinaSelect } from './ChinaSelectAction';

const quickRoutes = [
  { label: 'Bachelor’s', route: 'Bachelor’s Degree', note: 'English / Chinese' },
  { label: 'Foundation → Bachelor', route: 'Foundation → Bachelor', note: 'March & Sept' },
  { label: 'MBBS in China', route: 'MBBS in China', note: 'MoE / BMDC check' },
  { label: 'Master’s & PhD', route: 'Master’s Degree', note: 'CSC / Uni awards' },
  { label: 'Chinese Language', route: 'Chinese Language', note: '1-semester / 1-yr' },
];

type Props = {
  intro: string;
  reviewed?: string;
  heroPhoto: { src: string; alt: string; caption: string };
  stats: {
    universities: string;
    universitiesSub: string;
    programmes: string;
    programmesSub: string;
    scholarships: string;
    scholarshipsSub: string;
  };
  intakeBadge: string;
  phoneNumber: string;
  whatsappNumber: string;
};

export default function ChinaPillarHero({
  intro,
  reviewed,
  heroPhoto,
  stats,
  intakeBadge,
  phoneNumber,
  whatsappNumber,
}: Props) {
  const [selectedRoute, setSelectedRoute] = useState('');

  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Assalamu alaikum. I would like a free Study in China plan from EduExpress International.',
  )}`;

  const pickRoute = (route: string) => {
    setSelectedRoute(route);
    dispatchChinaSelect({ route, scroll: false });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#061a2b] via-[#0b2b45] to-[#12436b] pb-14 pt-[94px] text-white sm:pt-[112px] lg:pb-20 lg:pt-[144px]">
      {/* Architectural Grid & Subtle Ambient Glows */}
      <div aria-hidden="true" className="ed-grid-lines pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-lime/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-1/3 size-80 rounded-full bg-[#66b5e0]/12 blur-3xl" />

      <div className="relative mx-auto max-w-[1200px] px-5 lg:px-8">
        {/* Top Breadcrumb + Live Intake Status Row */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs text-white/75">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold">
              <li>
                <Link href="/" className="text-white/80 transition hover:text-lime hover:underline">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} className="text-white/40" aria-hidden="true" />
                <span aria-current="page" className="text-lime">
                  Study in China
                </span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/15 px-3 py-1 font-bold text-lime">
              <span className="size-1.5 rounded-full bg-lime" aria-hidden="true" />
              {intakeBadge}
            </span>
            <span lang="bn" className="hidden rounded-full bg-white/10 px-3 py-1 font-bold text-white/95 sm:inline-block">
              ভিসার আগে ০ টাকা সার্ভিস চার্জ
            </span>
          </div>
        </div>

        {/* Split Conversion Grid */}
        <div className="grid gap-10 lg:grid-cols-[1.14fr_.86fr] lg:items-start lg:gap-12">
          {/* Left Column: Value Proposition, Live Proof Metrics, Route Pills & Campus Photo */}
          <div className="min-w-0">
            <p className="anim-rise inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-lime">
              <GraduationCap size={14} className="shrink-0" aria-hidden="true" />
              Bachelor’s · Master’s · PhD · MBBS · Language
            </p>

            <h1 className="anim-lift mt-5 font-display text-[40px] font-black leading-[0.96] tracking-[-0.02em] text-white sm:text-[54px] lg:text-[62px]">
              Study in China from Bangladesh.
            </h1>

            <p className="mt-4 font-display text-[20px] font-extrabold leading-snug text-lime sm:text-[23px]">
              Verified universities. Clear costs in writing. BDT 0 service fee before visa.
            </p>

            <p className="anim-rise mt-4 max-w-2xl text-[17px] leading-[1.65] text-white/85">
              {intro}
            </p>

            {/* 4 Live Verified Stat Cards */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <Building2 size={14} className="text-lime" aria-hidden="true" />
                  Directory
                </div>
                <p className="mt-1 font-display text-xl font-black text-white">{stats.universities}</p>
                <p className="text-[11.5px] text-white/75">{stats.universitiesSub}</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <Compass size={14} className="text-lime" aria-hidden="true" />
                  Programmes
                </div>
                <p className="mt-1 font-display text-xl font-black text-white">{stats.programmes}</p>
                <p className="text-[11.5px] text-white/75">{stats.programmesSub}</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <Award size={14} className="text-lime" aria-hidden="true" />
                  Scholarships
                </div>
                <p className="mt-1 font-display text-xl font-black text-lime">{stats.scholarships}</p>
                <p className="text-[11.5px] text-white/75">{stats.scholarshipsSub}</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <ShieldCheck size={14} className="text-lime" aria-hidden="true" />
                  Before Visa
                </div>
                <p className="mt-1 font-display text-xl font-black text-lime">BDT 0</p>
                <p className="text-[11.5px] text-white/75">EduExpress fee</p>
              </div>
            </div>

            {/* Interactive Quick-Select Route Pills */}
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.06] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-lime">
                1. Choose a study route to pre-fill your free plan:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickRoutes.map(item => {
                  const active = selectedRoute === item.route;
                  return (
                    <button
                      key={item.route}
                      type="button"
                      onClick={() => pickRoute(item.route)}
                      aria-pressed={active}
                      className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                        active
                          ? 'border-lime bg-lime text-petrol-800 shadow-sm'
                          : 'border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/15'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                          active ? 'bg-petrol-800/15 text-petrol-800' : 'bg-white/15 text-white/85'
                        }`}
                      >
                        {item.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#china-fit-form" className="ed-btn ed-btn-signal min-h-[52px] px-6 lg:hidden">
                Get my free China plan <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a
                href="#study-routes"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-3xl border border-white/25 bg-white/10 px-5 text-[15px] font-bold text-white transition hover:bg-white/20"
              >
                Explore programmes <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ destination: 'china', label: 'china_hero_whatsapp' })}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-3xl border border-emerald-400/35 bg-emerald-500/15 px-5 text-[15px] font-bold text-white transition hover:bg-emerald-500/25"
              >
                <MessageCircle size={17} className="text-lime" aria-hidden="true" />
                WhatsApp a counsellor
              </a>
              <Link
                href="/bn/study-in-china"
                hrefLang="bn-BD"
                lang="bn"
                className="inline-flex min-h-[48px] items-center rounded-3xl border border-white/25 px-5 text-[15px] font-bold text-white/95 transition hover:bg-white/10"
              >
                বাংলায় পড়ুন
              </Link>
            </div>

            {/* Trust Guarantees */}
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold text-white/90">
              {['No file opening charge', 'Parents welcome at Dhanmondi office', 'Reply within 1 working day'].map(point => (
                <li key={point} className="inline-flex items-center gap-2">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-lime text-petrol-800">
                    <Check size={13} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            {/* Campus Photography Showcase */}
            <figure className="relative mt-6 overflow-hidden rounded-3xl border border-white/15 bg-[#071f33] shadow-xl">
              <div className="relative h-[200px] sm:h-[225px]">
                <Image
                  src={heroPhoto.src}
                  alt={heroPhoto.alt}
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 620px"
                  className="object-cover object-[68%_43%]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#051827]/85 via-[#051827]/35 to-transparent"
                />
                <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1 text-[13px] font-bold text-petrol-800 shadow-sm">
                    <MapPin size={14} aria-hidden="true" />
                    {heroPhoto.caption}
                  </span>
                  {reviewed && (
                    <span className="rounded-full bg-[#071f33]/90 px-3 py-1 text-[12px] font-semibold text-lime backdrop-blur-sm">
                      Verified {reviewed}
                    </span>
                  )}
                </div>
              </div>
            </figure>
          </div>

          {/* Right Column: Embedded Lead Capture Form */}
          <div className="lg:sticky lg:top-28">
            <ChinaPillarLeadForm
              sectionId="china-fit-form"
              headingAs="h2"
              phoneNumber={phoneNumber}
              whatsappNumber={whatsappNumber}
              selectedRoute={selectedRoute}
              onRouteChange={setSelectedRoute}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
