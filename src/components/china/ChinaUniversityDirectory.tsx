'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, Building2, CalendarCheck, Filter, Languages, MapPin, Search, Sparkles } from 'lucide-react';

export type ChinaUniversityRecord = {
  _id: string;
  slug: string;
  name: string;
  city: string;
  location: string;
  degree: string[];
  taught: string[];
  intake: string[];
  programs?: { level?: string; name?: string; subject?: string; languages?: string[]; intakes?: string[] }[];
  details?: { majors?: string[]; tuition?: string };
  deadlines?: { application?: string; startDate?: string };
  scholarships?: { title?: string; amount?: string }[];
  verificationStatus?: 'verified' | 'under_verification' | 'expired';
  lastVerifiedAt?: string;
  sourceUrls?: string[];
};

type Props = { universities: ChinaUniversityRecord[] };

const inputClass = 'h-12 w-full border border-[#174f7a]/20 bg-white px-4 text-sm font-bold text-[#08263c] outline-none transition focus:border-[#174f7a] focus:ring-4 focus:ring-[#64b5df]/20';

export default function ChinaUniversityDirectory({ universities }: Props) {
  const [query, setQuery] = useState('');
  const [degree, setDegree] = useState('');
  const [language, setLanguage] = useState('');
  const [intake, setIntake] = useState('');

  const degreeOptions = useMemo(() => Array.from(new Set(universities.flatMap(item => item.degree || []))).sort(), [universities]);
  const languageOptions = useMemo(() => Array.from(new Set(universities.flatMap(item => item.taught || []))).sort(), [universities]);
  const intakeOptions = useMemo(() => Array.from(new Set(universities.flatMap(item => item.intake || []))).sort(), [universities]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return universities.filter(item => {
      const searchText = [item.name, item.city, item.location, ...(item.details?.majors || []), ...(item.programs || []).flatMap(program => [program.name || '', program.subject || ''])].join(' ').toLowerCase();
      return (!normalized || searchText.includes(normalized))
        && (!degree || item.degree?.includes(degree))
        && (!language || item.taught?.includes(language))
        && (!intake || item.intake?.includes(intake));
    });
  }, [universities, query, degree, language, intake]);

  const clear = () => {
    setQuery('');
    setDegree('');
    setLanguage('');
    setIntake('');
  };

  return (
    <section id="china-university-directory" className="bg-[#f6f9fb]">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-6 border border-[#174f7a]/15 bg-[#e9f7fd] p-5 lg:grid-cols-[1fr_auto] lg:items-end lg:p-7">
          <div>
            <p className="flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#174f7a]"><Filter size={14} /> Compare current records</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="relative sm:col-span-2 lg:col-span-1">
                <span className="sr-only">Search universities or majors</span>
                <Search size={17} className="pointer-events-none absolute left-4 top-4 text-[#174f7a]" />
                <input value={query} onChange={event => setQuery(event.target.value)} className={`${inputClass} pl-11`} placeholder="University, city or major" />
              </label>
              <label><span className="sr-only">Filter by study level</span><select value={degree} onChange={event => setDegree(event.target.value)} className={inputClass}><option value="">All study levels</option>{degreeOptions.map(value => <option key={value}>{value}</option>)}</select></label>
              <label><span className="sr-only">Filter by teaching language</span><select value={language} onChange={event => setLanguage(event.target.value)} className={inputClass}><option value="">All teaching languages</option>{languageOptions.map(value => <option key={value}>{value}</option>)}</select></label>
              <label><span className="sr-only">Filter by intake</span><select value={intake} onChange={event => setIntake(event.target.value)} className={inputClass}><option value="">All intake records</option>{intakeOptions.map(value => <option key={value}>{value}</option>)}</select></label>
            </div>
          </div>
          <div className="flex items-center justify-between gap-5 lg:flex-col lg:items-end">
            <p className="text-sm font-black"><span className="font-heading text-3xl text-[#174f7a]">{filtered.length}</span> matching records</p>
            {(query || degree || language || intake) ? <button onClick={clear} className="text-xs font-black text-[#174f7a] underline underline-offset-4">Clear filters</button> : null}
          </div>
        </div>

        <div className="mt-5 border-l border-t border-[#174f7a]/20">
          {filtered.map((university, index) => {
            const isVerified = university.verificationStatus === 'verified' && university.sourceUrls?.length;
            return (
              <article key={university._id} className="grid border-b border-r border-[#174f7a]/20 bg-white lg:grid-cols-[5rem_1.25fr_.9fr_.8fr_auto]">
                <div className="flex items-center justify-between border-b border-[#174f7a]/15 bg-[#08263c] px-4 py-3 text-white lg:flex-col lg:justify-start lg:border-b-0 lg:border-r lg:px-2 lg:py-5">
                  <span className="font-mono text-[9px] font-black text-[#8ed0ee]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="mt-0 grid size-9 place-items-center bg-white/10 font-heading text-sm font-bold lg:mt-5">{university.name.charAt(0)}</span>
                </div>

                <div className="border-b border-[#174f7a]/15 p-4 lg:border-b-0 lg:border-r lg:p-5">
                  <div className={`inline-flex items-center gap-2 px-2 py-1 font-mono text-[8px] font-black uppercase tracking-[0.14em] ${isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                    {isVerified ? <BookOpenCheck size={11} /> : <CalendarCheck size={11} />}{isVerified ? 'Current source record' : '2027 details confirmed before application'}
                  </div>
                  <h2 className="mt-3 font-heading text-xl font-bold leading-tight">{university.name}</h2>
                  <p className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500"><MapPin size={13} className="text-[#174f7a]" />{university.city || university.location || 'China'}</p>
                </div>

                <div className="border-b border-[#174f7a]/15 p-4 lg:border-b-0 lg:border-r lg:p-5">
                  <p className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">Study options</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">{(university.degree || []).map(value => <span key={value} className="bg-[#e9f7fd] px-2 py-1 text-[10px] font-black text-[#174f7a]">{value}</span>)}</div>
                  <p className="mt-3 text-[10px] font-black text-[#174f7a]">{university.programs?.length || university.details?.majors?.length || 0} program option{(university.programs?.length || university.details?.majors?.length || 0) === 1 ? '' : 's'}</p>
                  <p className="mt-3 flex items-center gap-2 text-[11px] font-bold text-slate-500"><Languages size={13} />{university.taught?.join(', ') || 'Teaching language confirmed with program'}</p>
                </div>

                <div className="border-b border-[#174f7a]/15 p-4 lg:border-b-0 lg:border-r lg:p-5">
                  <p className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">Recorded tuition</p>
                  <p className="mt-2 text-sm font-black leading-5">{university.details?.tuition || 'Request current fee record'}</p>
                  {university.scholarships?.length ? <p className="mt-3 flex items-center gap-2 text-[10px] font-bold text-[#174f7a]"><Sparkles size={13} />{university.scholarships.length} scholarship record{university.scholarships.length === 1 ? '' : 's'}</p> : null}
                </div>

                <div className="flex min-w-44 flex-col justify-between gap-4 p-4 lg:p-5">
                  <div>
                    <p className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">Deadline record</p>
                    <p className="mt-2 text-[11px] font-bold leading-5 text-slate-600">{university.deadlines?.application || '2027 deadline confirmed before application'}</p>
                  </div>
                  <Link href={`/universities/${university.slug}`} className="flex items-center justify-between gap-3 bg-[#174f7a] px-3 py-3 text-xs font-black text-white hover:bg-[#08263c]">Inspect record <ArrowRight size={15} /></Link>
                </div>
              </article>
            );
          })}
        </div>

        {!filtered.length ? (
          <div className="border border-[#174f7a]/20 bg-white px-6 py-16 text-center">
            <Building2 className="mx-auto text-[#174f7a]" size={34} />
            <h2 className="mt-5 font-heading text-2xl font-bold">No current record matches every filter</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">Clear one filter or request a China Fit Assessment so the team can check the wider network.</p>
            <button onClick={clear} className="mt-5 bg-[#174f7a] px-5 py-3 text-sm font-black text-white">Clear filters</button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
