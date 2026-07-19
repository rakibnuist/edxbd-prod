'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Compass, Route } from 'lucide-react';

const destinations = [
  {
    code: 'CN',
    name: 'China',
    status: 'Flagship',
    since: 'Serving since 2018',
    image: '/images/destinations/china.jpg',
    href: '/study-in-china-from-bangladesh',
    headline: 'The route with our deepest evidence record',
    detail: 'Compare universities, program fit, scholarships, complete costs, intakes, student life and visa readiness in one connected hub.',
  },
  {
    code: 'MT',
    name: 'Malta',
    status: 'Active',
    since: 'Serving since 2025',
    image: '/images/partnership.jpg',
    href: '/destinations/malta',
    headline: 'Check the institution before choosing the island',
    detail: 'Review program suitability, institution recognition, complete cost and student visa readiness for Malta.',
  },
  {
    code: 'HU',
    name: 'Hungary',
    status: 'Active',
    since: 'Serving since 2025',
    image: '/images/destinations/hungary.jpg',
    href: '/destinations/hungary',
    headline: 'Compare funded and self funded study routes',
    detail: 'Assess university choices, Stipendium conditions, tuition, living costs and application readiness together.',
  },
  {
    code: 'CY',
    name: 'Cyprus',
    status: 'Active',
    since: 'Serving since 2025',
    image: '/images/destinations/cyprus.jpg',
    href: '/destinations/cyprus',
    headline: 'Make the jurisdiction and recognition clear',
    detail: 'Confirm institution location, degree recognition, costs, visa route and support before making a commitment.',
  },
  {
    code: 'KR',
    name: 'South Korea',
    status: 'Active',
    since: 'Serving since 2025',
    image: '/images/destinations/south-korea.jpg',
    href: '/destinations/south-korea',
    headline: 'Match research ambition with language readiness',
    detail: 'Compare direct admission, funding routes, program language, research fit, costs and student life preparation.',
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    status: 'Active',
    since: 'Serving since 2025',
    image: '/images/destinations/united-kingdom.jpg',
    href: '/destinations/uk',
    headline: 'Test the program value, not only the destination name',
    detail: 'Review course value, institution status, total funding needs and current visa readiness before applying.',
  },
  {
    code: 'GE',
    name: 'Georgia',
    status: 'Active',
    since: 'Serving since 2025',
    image: '/images/destinations/georgia.jpg',
    href: '/destinations/georgia',
    headline: 'Put recognition and licensing before price',
    detail: 'For medical and other routes, compare recognition, admission, total cost and student support carefully.',
  },
  {
    code: 'GR',
    name: 'Greece',
    status: 'Active',
    since: 'University network active',
    image: '/images/partnership.jpg',
    href: '/destinations/greece',
    headline: 'Inspect English taught university options',
    detail: 'Compare available programs, recognition, complete costs, visa readiness and active university routes.',
  },
  {
    code: 'MY',
    name: 'Malaysia',
    status: 'Active',
    since: 'University routes available',
    image: '/images/destinations/malaysia.jpg',
    href: '/destinations/malaysia',
    headline: 'Bring education quality and cost into one view',
    detail: 'Compare universities, branch campuses, program quality, the student pass process and a complete budget.',
  },
  {
    code: 'TH',
    name: 'Thailand',
    status: 'Active',
    since: 'University routes available',
    image: '/images/partnership.jpg',
    href: '/destinations/thailand',
    headline: 'Find regional value without lowering the standard',
    detail: 'Assess international programs, university quality, total cost and education visa readiness.',
  },
];

const decisionChecks = ['Academic fit', 'Recognition', 'Complete cost', 'Visa readiness'];

export default function DestinationDecisionDesk() {
  const [selected, setSelected] = useState(0);
  const current = destinations[selected];
  const progress = `${((selected + 1) / destinations.length) * 100}%`;

  return (
    <div className="relative w-full min-w-0 overflow-hidden border border-[#174f7a] bg-[#061b2a] text-white shadow-[14px_14px_0_0_#bde7f8]">
      <div className="flex items-center justify-between gap-4 border-b border-white/15 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-[#64b5df]/60 text-[#8ed0ee]"><Compass size={17} /></span>
          <div><p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#8ed0ee]">Destination navigator</p><p className="mt-0.5 text-xs text-white/55">Choose a route, then inspect the fit</p></div>
        </div>
        <p className="font-heading text-2xl font-bold"><span className="text-[#8ed0ee]">{String(selected + 1).padStart(2, '0')}</span><span className="text-white/25"> / 10</span></p>
      </div>

      <div className="h-1 bg-white/10"><div className="h-full bg-[#64b5df] transition-all duration-500" style={{ width: progress }} /></div>

      <div className="grid grid-cols-5 border-b border-white/15 bg-[#08263c]">
        {destinations.map((item, index) => (
          <button
            key={item.code}
            onClick={() => setSelected(index)}
            className={`group min-w-0 border-b border-r border-white/10 px-2 py-3 text-left transition sm:px-3 ${selected === index ? 'bg-[#64b5df] text-[#08263c]' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}
            aria-pressed={selected === index}
            aria-label={`${item.code} ${item.name}`}
          >
            <span className="block font-mono text-[8px] font-black tracking-[0.18em]">{item.code}</span>
            <span className="mt-1 block truncate text-[10px] font-extrabold sm:text-xs">{item.name}</span>
          </button>
        ))}
      </div>

      <div className="relative min-h-[520px] overflow-hidden" aria-live="polite">
        <Image key={current.image} src={current.image} alt={`${current.name} education destination`} fill priority={selected === 0} sizes="(max-width: 1024px) 100vw, 650px" className="object-cover transition duration-700" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(6,27,42,0.98)_10%,rgba(8,38,60,0.86)_58%,rgba(8,38,60,0.24)_100%)]" />
        <div className="pointer-events-none absolute -right-8 top-5 font-heading text-[10rem] font-bold leading-none tracking-[-0.1em] text-white/[0.07] sm:text-[14rem]">{current.code}</div>
        <div className="pointer-events-none absolute right-6 top-7 size-40 rounded-full border border-[#8ed0ee]/35 sm:size-52"><span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#64b5df] shadow-[0_0_0_12px_rgba(100,181,223,0.12)]" /></div>

        <div className="relative flex min-h-[520px] flex-col justify-between p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 bg-[#64b5df] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#08263c]"><span className="size-1.5 rounded-full bg-[#08263c]" /> {current.status} service</span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">{current.since}</span>
          </div>

          <div>
            <div className="flex items-center gap-3 text-[#8ed0ee]"><Route size={18} /><span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">{current.name} route file</span></div>
            <h2 className="mt-4 max-w-2xl font-heading text-4xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-5xl">{current.headline}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">{current.detail}</p>

            <div className="mt-6 grid grid-cols-2 gap-px bg-white/15 sm:grid-cols-4">
              {decisionChecks.map((check, index) => <span key={check} className="flex items-center gap-2 bg-[#08263c]/90 px-3 py-3 text-[10px] font-bold text-white/70"><Check size={13} className="shrink-0 text-[#64b5df]" /> <span><span className="mr-1 font-mono text-[8px] text-white/30">0{index + 1}</span>{check}</span></span>)}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href={current.href} className="group inline-flex items-center gap-3 bg-white px-5 py-4 text-sm font-black text-[#08263c] hover:bg-[#bde7f8]">Inspect {current.name} <ArrowUpRight size={17} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
              <Link href="/destinations" className="inline-flex items-center gap-2 text-xs font-black text-[#8ed0ee] hover:text-white">Compare all ten routes <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
