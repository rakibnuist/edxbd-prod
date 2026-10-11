'use client';

import { useEffect, useState } from 'react';
import { Check, MapPin } from 'lucide-react';

const stages = [
  { id: 'journey-start', short: 'Check-in', number: '01' },
  { id: 'journey-compare', short: 'University', number: '02' },
  { id: 'journey-cost', short: 'Cost clearance', number: '03' },
  { id: 'journey-apply', short: 'Admission file', number: '04' },
  { id: 'journey-visa', short: 'Visa gate', number: '05' },
  { id: 'journey-depart', short: 'Boarding', number: '06' },
  { id: 'journey-register', short: 'Campus', number: '07' },
];

export default function JourneyProgress() {
  const [active, setActive] = useState(0);
  const [inJourney, setInJourney] = useState(false);

  useEffect(() => {
    const elements = stages
      .map(stage => document.getElementById(stage.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = stages.findIndex(stage => stage.id === visible.target.id);
        if (index >= 0) setActive(index);
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.1, 0.25, 0.5] },
    );

    elements.forEach(element => observer.observe(element));
    const journey = document.getElementById('journey');
    const journeyObserver = new IntersectionObserver(
      entries => setInJourney(Boolean(entries[0]?.isIntersecting)),
      { threshold: 0 },
    );
    if (journey) journeyObserver.observe(journey);

    return () => {
      observer.disconnect();
      journeyObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div className="sticky top-[74px] z-30 -mx-5 border-y border-[#c9dbe7] bg-white/95 px-5 py-3 shadow-[0_12px_30px_rgba(23,79,122,.08)] backdrop-blur-xl sm:-mx-8 sm:px-8 lg:hidden xl:top-[106px]">
        <div className="mx-auto flex max-w-[760px] items-center gap-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#174f7a] text-white"><MapPin size={16} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="ed-label text-[#2f7fbf]">Your journey now</span>
              <strong className="text-xs text-[#0a1f33]">{stages[active].number} · {stages[active].short}</strong>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#dbe8ef]">
              <span className="block h-full rounded-full bg-[#2f7fbf] transition-all duration-700" style={{ width: `${((active + 1) / stages.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <aside className={`journey-fixed-progress top-36 z-30 hidden w-[250px] transition duration-300 lg:block ${inJourney ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`} aria-label="Complete student journey">
        <div className="rounded-[28px] border border-[#c9dbe7] bg-white p-5 shadow-[0_20px_55px_rgba(23,79,122,.09)]">
          <p className="ed-label text-[#2f7fbf]">Your complete journey</p>
          <p className="mt-2 text-xs leading-5 text-[#647788]">From the first question to university registration.</p>
          <ol className="relative mt-6 space-y-1">
            <span className="absolute bottom-5 left-[17px] top-5 w-px bg-[#d8e5ed]" aria-hidden="true" />
            <span
              className="absolute left-[17px] top-5 w-px bg-[#2f7fbf] transition-all duration-700"
              style={{ height: `calc(${(active / (stages.length - 1)) * 100}% - ${(active / (stages.length - 1)) * 40}px)` }}
              aria-hidden="true"
            />
            {stages.map((stage, index) => {
              const current = index === active;
              const complete = index < active;
              return (
                <li key={stage.id} className="relative">
                  <a href={`#${stage.id}`} aria-current={current ? 'step' : undefined} className={`flex items-center gap-3 rounded-2xl px-2 py-2.5 text-sm transition ${current ? 'bg-[#e8f5fb] text-[#0a1f33]' : 'text-[#6b7c89] hover:bg-[#f2f7fa] hover:text-[#174f7a]'}`}>
                    <span className={`relative z-10 grid size-[35px] shrink-0 place-items-center rounded-full border text-[10px] font-black transition ${current ? 'border-[#174f7a] bg-[#174f7a] text-white shadow-[0_8px_20px_rgba(23,79,122,.25)]' : complete ? 'border-[#2f7fbf] bg-[#e8f5fb] text-[#174f7a]' : 'border-[#c9dbe7] bg-white text-[#7d8e9a]'}`}>
                      {complete ? <Check size={14} strokeWidth={3} /> : stage.number}
                    </span>
                    <span className={current ? 'font-extrabold' : 'font-semibold'}>{stage.short}</span>
                  </a>
                </li>
              );
            })}
          </ol>
          <div className="mt-5 rounded-2xl bg-[#0a1f33] p-4 text-white">
            <p className="ed-label text-[#8ed0ee]">End point</p>
            <p className="mt-2 text-sm font-extrabold">On campus + registered</p>
          </div>
        </div>
      </aside>
    </>
  );
}
