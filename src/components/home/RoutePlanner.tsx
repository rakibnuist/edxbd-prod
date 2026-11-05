'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, RotateCcw } from 'lucide-react';


export type PlannerUniversity = {
  slug: string;
  name: string;
  country: string;
  city: string;
  levels: string[];
  funding: boolean;
  tuition: string;
  programmes: number;
};

const LEVELS = ['Bachelor’s', 'Master’s', 'PhD', 'Language', 'Foundation'];

const emptyResult = { count: 0, sample: [] as PlannerUniversity[] };

export default function RoutePlanner({ universities }: { universities: PlannerUniversity[] }) {
  const [level, setLevel] = useState('');
  const [country, setCountry] = useState('');
  const [funding, setFunding] = useState(false);

  const destinations = useMemo(
    () => [...new Set(universities.map(university => university.country).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [universities],
  );

  const result = useMemo(() => {
    const matches = universities.filter(university => {
      const levelMatch = !level || university.levels.some(item => item.toLowerCase().startsWith(level.replace('’s', '').toLowerCase().slice(0, 5)));
      const countryMatch = !country || university.country === country;
      const fundingMatch = !funding || university.funding;
      return levelMatch && countryMatch && fundingMatch;
    });
    if (!matches.length) return emptyResult;
    return { count: matches.length, sample: matches.slice(0, 3) };
  }, [universities, level, country, funding]);

  const query = new URLSearchParams({
    ...(level ? { level } : {}),
    ...(country ? { country } : {}),
    ...(funding ? { scholarship: '1' } : {}),
  }).toString();

  const dirty = Boolean(level || country || funding);

  return (
    <div className="border border-rule bg-chalk-50">
      <div className="flex items-center justify-between border-b border-rule bg-white px-5 py-3">
        <p className="text-[14px] font-semibold text-petrol-700">Route planner</p>
        <span className="text-[12px] text-ink-mute">Live directory · {universities.length} records</span>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <label htmlFor="planner-level" className="block text-[14px] font-semibold text-ink-soft">
            What are you applying for?
          </label>
          <select id="planner-level" value={level} onChange={event => setLevel(event.target.value)} className="ed-field mt-1.5">
            <option value="">Any study level</option>
            {LEVELS.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="planner-country" className="block text-[14px] font-semibold text-ink-soft">
              Destination
            </label>
            <select id="planner-country" value={country} onChange={event => setCountry(event.target.value)} className="ed-field mt-1.5">
              <option value="">Anywhere</option>
              {destinations.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="block text-[14px] font-semibold text-ink-soft">Funding</span>
            <label className="mt-1.5 flex min-h-[2.75rem] cursor-pointer items-center gap-2 border border-rule-strong bg-white px-3 text-[15px] text-ink">
              <input type="checkbox" checked={funding} onChange={event => setFunding(event.target.checked)} className="size-4 accent-[#175180]" />
              Scholarship on file
            </label>
          </div>
        </div>

        <div className="border-t border-rule pt-4" aria-live="polite">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[15px] text-ink-soft">
              <strong className="ed-figure text-[26px] leading-none text-petrol-700">{result.count}</strong>{' '}{result.count === 1 ? 'university matches' : 'universities match'}
            </p>
            {dirty && (
              <button
                type="button"
                onClick={() => {
                  setLevel('');
                  setCountry('');
                  setFunding(false);
                }}
                className="inline-flex items-center gap-1 text-[14px] font-semibold text-ink-mute hover:text-petrol-600"
              >
                <RotateCcw size={12} aria-hidden="true" /> Reset
              </button>
            )}
          </div>

          {result.sample.length > 0 ? (
            <ul className="mt-3 divide-y divide-rule border-y border-rule">
              {result.sample.map(university => (
                <li key={university.slug}>
                  <Link href={`/universities/${university.slug}`} className="group flex items-baseline justify-between gap-3 py-2">
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold text-ink group-hover:text-petrol-700">{university.name}</span>
                      <span className="block text-[13px] text-ink-mute">
                        {university.city}, {university.country}
                      </span>
                    </span>
                    <ArrowUpRight size={13} className="shrink-0 text-petrol-400" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 border border-dashed border-rule-strong px-3 py-4 text-[14px] leading-6 text-ink-soft">
              No stored record matches that combination. Reset, or ask a counsellor to check the route with you.
            </p>
          )}

          <Link href={`/universities${query ? `?${query}` : ''}`} className="ed-btn ed-btn-primary mt-4 w-full">
            {dirty ? 'Open these results in the finder' : 'Browse all universities'}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
