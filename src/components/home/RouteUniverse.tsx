'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Crosshair, Radio } from 'lucide-react';

const routes = [
  { code: 'CN', name: 'China', signal: 'Flagship', note: 'Scholarships, university records, clear costs and visa-first service terms.', href: '/study-in-china-from-bangladesh', image: '/images/students/campus-nuist.webp', x: 18, y: 25 },
  { code: 'MY', name: 'Malaysia', signal: 'Pathways', note: 'Foundation, Diploma and Bachelor routes with English-medium options.', href: '/study-in-malaysia-from-bangladesh', image: '/images/destinations/malaysia.jpg', x: 80, y: 22 },
  { code: 'KR', name: 'South Korea', signal: 'Career', note: 'Compare English and Korean-track study routes against your language plan.', href: '/study-in-south-korea-from-bangladesh', image: '/images/destinations/south-korea.jpg', x: 91, y: 49 },
  { code: 'HU', name: 'Hungary', signal: 'Europe', note: 'A European route to assess by recognition, funding and complete living cost.', href: '/study-in-hungary-from-bangladesh', image: '/images/destinations/hungary.jpg', x: 75, y: 73 },
  { code: 'UK', name: 'United Kingdom', signal: 'Direct', note: 'University choices assessed against entry rules, budget and career value.', href: '/study-in-uk-from-bangladesh', image: '/images/destinations/united-kingdom.jpg', x: 49, y: 86 },
  { code: 'CY', name: 'Cyprus', signal: 'Options', note: 'Program, institution and total-cost checks before any recommendation.', href: '/study-in-cyprus-from-bangladesh', image: '/images/destinations/cyprus.jpg', x: 23, y: 74 },
  { code: 'GE', name: 'Georgia', signal: 'Compare', note: 'A route that needs exact recognition, program and visa checks.', href: '/study-in-georgia-from-bangladesh', image: '/images/destinations/georgia.jpg', x: 8, y: 50 },
];

const stars = [
  [6, 18], [34, 8], [63, 12], [95, 16], [86, 35], [61, 39], [39, 31], [14, 62], [42, 67], [96, 75], [68, 91], [9, 88],
];

export default function RouteUniverse() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = routes[activeIndex];

  return (
    <div className="relative mx-auto min-h-[610px] w-full max-w-[680px] overflow-hidden rounded-[34px] border border-[#bdd5e4] bg-white/85 shadow-[0_34px_100px_rgba(23,79,122,.16)] backdrop-blur-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,181,223,.22),transparent_43%),linear-gradient(145deg,#ffffff,#edf7fc)]" />
      <div className="absolute left-1/2 top-[43%] size-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8bbbd6]/35" />
      <div className="route-ring-spin absolute left-1/2 top-[43%] size-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#2f7fbf]/35" />
      <div className="absolute left-1/2 top-[43%] size-[126px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_12px_38px_rgba(23,79,122,.22)]">
        <Image src="/images/office/counselor-office.webp" alt="EduExpress counselor at the decision desk" fill sizes="126px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071622]/75 via-transparent to-transparent" />
      </div>

      {stars.map(([left, top], index) => (
        <span key={`${left}-${top}`} className={`absolute rounded-full bg-[#174f7a] ${index % 3 === 0 ? 'size-1 opacity-45' : 'size-0.5 opacity-25'}`} style={{ left: `${left}%`, top: `${top}%` }} />
      ))}

      <div className="absolute left-1/2 top-[43%] z-10 -translate-x-1/2 -translate-y-1/2 text-center">
        <Crosshair className="mx-auto text-white" size={20} />
        <span className="ed-label mt-2 block text-white/75">Decision desk</span>
        <strong className="ed-display mt-1 block text-lg text-white">YOU</strong>
      </div>

      <div role="list" aria-label="Explore study routes">
        {routes.map((route, index) => {
          const selected = index === activeIndex;
          return (
            <button
              type="button"
              role="listitem"
              key={route.code}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={`route-node-float absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border transition duration-300 ${selected ? 'route-pulse size-16 border-[#174f7a] bg-[#174f7a] text-white shadow-[0_10px_30px_rgba(23,79,122,.3)]' : 'size-12 border-[#bdd5e4] bg-white text-[#174f7a] shadow-[0_8px_24px_rgba(23,79,122,.12)] hover:border-[#174f7a]'}`}
              style={{ left: `${route.x}%`, top: `${route.y}%`, animationDelay: `${index * -0.7}s` }}
              aria-pressed={selected}
              aria-label={`Explore ${route.name}`}
            >
              <span className="ed-label text-[10px]">{route.code}</span>
            </button>
          );
        })}
      </div>

      <div className="absolute inset-x-4 bottom-4 z-30 rounded-[24px] border border-[#c8dce8] bg-white/95 p-5 text-[#0a1f33] shadow-[0_18px_50px_rgba(23,79,122,.14)] backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-6">
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 gap-4">
            <span className="relative hidden size-16 shrink-0 overflow-hidden rounded-2xl sm:block">
              <Image src={active.image} alt="" fill sizes="64px" className="object-cover" />
            </span>
            <div>
              <p className="ed-label flex items-center gap-2 text-[#2f7fbf]"><Radio size={12} /> Route signal · {active.signal}</p>
              <h2 className="ed-display mt-2 text-2xl">{active.name}</h2>
              <p className="mt-2 max-w-md text-xs leading-5 text-[#5d6f7f]">{active.note}</p>
            </div>
          </div>
          <Link href={active.href} className="grid size-11 shrink-0 place-items-center rounded-full bg-[#174f7a] text-white transition hover:bg-[#0a1f33]" aria-label={`Open ${active.name} route`}>
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </div>
  );
}
