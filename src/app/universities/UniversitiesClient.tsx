'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, CheckCircle2, GraduationCap, Languages, MapPin, Search, Sparkles, X } from 'lucide-react';
import type { CleanUniversityRecord } from '@/lib/university-records';

type Props = { initialUniversities: CleanUniversityRecord[] };

export default function UniversitiesClient({ initialUniversities }: Props) {
  const searchParams = useSearchParams();
  const initialCountry = searchParams?.get('country') || '';
  // Lets the homepage hero (and any campaign link) deep-link a search term.
  const initialQuery = searchParams?.get('search') || '';
  const [query, setQuery] = useState(initialQuery);
  const [country, setCountry] = useState(initialCountry);
  const [level, setLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [visible, setVisible] = useState(12);

  const countries = useMemo(() => Array.from(new Set(initialUniversities.map(item => item.country).filter(Boolean))).sort(), [initialUniversities]);
  const levels = useMemo(() => Array.from(new Set(initialUniversities.flatMap(item => item.programs.map(program => program.level)).filter(Boolean))).sort(), [initialUniversities]);
  const languages = useMemo(() => Array.from(new Set(initialUniversities.flatMap(item => item.programs.flatMap(program => program.languages)).filter(Boolean))).sort(), [initialUniversities]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return initialUniversities.filter(university => {
      const haystack = [
        university.name,
        university.city,
        university.country,
        ...university.programs.map(program => program.name),
        ...university.details.majors,
      ].join(' ').toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesCountry = !country || university.country === country;
      const matchesLevel = !level || university.programs.some(program => program.level === level) || university.degree.includes(level);
      const matchesLanguage = !language || university.programs.some(program => program.languages.includes(language)) || university.taught.includes(language);
      return matchesSearch && matchesCountry && matchesLevel && matchesLanguage;
    });
  }, [country, initialUniversities, language, level, query]);

  const clearFilters = () => {
    setQuery('');
    setCountry('');
    setLevel('');
    setLanguage('');
    setVisible(12);
  };

  const activeFilters = Boolean(query || country || level || language);

  return (
    <section className="min-h-[60vh] bg-[#f7fafc] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="rounded-2xl border border-[#174f7a]/15 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_repeat(3,.52fr)]">
            <label className="relative">
              <span className="sr-only">Search universities and programs</span>
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={event => { setQuery(event.target.value); setVisible(12); }} placeholder="Search a university, program or city" className="h-12 w-full rounded-xl border border-slate-200 bg-[#f7fafc] pl-11 pr-10 text-sm font-semibold outline-none transition focus:border-[#174f7a] focus:ring-4 focus:ring-[#174f7a]/10" />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full hover:bg-slate-100"><X size={15} /></button>}
            </label>
            {countries.length > 1 && <label><span className="sr-only">Destination</span><select value={country} onChange={event => { setCountry(event.target.value); setVisible(12); }} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-[#174f7a]"><option value="">All destinations</option>{countries.map(item => <option key={item}>{item}</option>)}</select></label>}
            <label><span className="sr-only">Study level</span><select value={level} onChange={event => { setLevel(event.target.value); setVisible(12); }} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-[#174f7a]"><option value="">All study levels</option>{levels.map(item => <option key={item}>{item}</option>)}</select></label>
            <label><span className="sr-only">Teaching language</span><select value={language} onChange={event => { setLanguage(event.target.value); setVisible(12); }} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-[#174f7a]"><option value="">All languages</option>{languages.map(item => <option key={item}>{item}</option>)}</select></label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><p className="text-sm text-slate-500"><strong className="text-[#08263c]">{filtered.length}</strong> suitable university {filtered.length === 1 ? 'record' : 'records'}</p>{activeFilters && <button type="button" onClick={clearFilters} className="text-xs font-black text-[#174f7a]">Clear all filters</button>}</div>
        </div>

        {filtered.length ? <>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visible).map(university => {
              const verified = university.verificationStatus === 'verified' && university.sourceUrls.length > 0;
              const studyLevels = Array.from(new Set(university.programs.map(program => program.level))).filter(Boolean);
              const programNames = Array.from(new Set(university.programs.map(program => program.name))).filter(Boolean);
              const teaching = Array.from(new Set(university.programs.flatMap(program => program.languages))).filter(Boolean);
              return <article key={university.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#174f7a]/15 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#174f7a]/35 hover:shadow-xl">
                <div className="flex items-center justify-between gap-3 border-b border-[#174f7a]/10 bg-[#f7fafc] px-5 py-3 text-[10px] font-black uppercase tracking-[.12em]"><span className="flex items-center gap-2 text-[#174f7a]"><MapPin size={13} />{university.city}, {university.country}</span><span className={`rounded-full px-2.5 py-1 ${verified ? 'bg-emerald-50 text-emerald-700' : 'bg-[#e9f7fd] text-[#174f7a]'}`}>{verified ? 'Source checked' : 'Fresh check included'}</span></div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start gap-4">
                    <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#174f7a]/12 bg-white p-2 shadow-sm">
                      {university.logo ? (
                        <Image src={university.logo} alt={`${university.name} logo`} width={52} height={52} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <GraduationCap size={25} className="text-[#174f7a]" />
                      )}
                    </span>
                    <h2 className="font-heading text-2xl font-bold leading-7"><Link href={`/universities/${university.slug}`} className="hover:text-[#174f7a]">{university.name}</Link></h2>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">{studyLevels.slice(0, 3).map(item => <span key={item} className="rounded-full bg-[#e9f7fd] px-2.5 py-1 text-[10px] font-bold text-[#174f7a]">{item}</span>)}</div>
                  <div className="mt-5 space-y-2 text-sm text-slate-600">
                    {programNames.slice(0, 2).map(program => <p key={program} className="flex items-start gap-2"><BookOpenCheck size={15} className="mt-0.5 shrink-0 text-[#174f7a]" />{program}</p>)}
                    {programNames.length > 2 && <p className="pl-6 text-xs font-bold text-[#174f7a]">+ {programNames.length - 2} more program options</p>}
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#f7fafc] p-3 text-xs"><div><span className="flex items-center gap-1.5 font-bold text-slate-400"><Languages size={13} />Teaching</span><strong className="mt-1 block text-[#08263c]">{teaching.slice(0, 2).join(', ') || 'Confirmed by program'}</strong></div><div><span className="flex items-center gap-1.5 font-bold text-slate-400"><Sparkles size={13} />Scholarships</span><strong className="mt-1 block text-[#08263c]">{university.scholarships.length ? `${university.scholarships.length} recorded option${university.scholarships.length === 1 ? '' : 's'}` : 'Matched after fit'}</strong></div></div>
                  <Link href={`/universities/${university.slug}`} className="mt-5 inline-flex min-h-12 items-center justify-between rounded-xl bg-[#08263c] px-4 text-sm font-black text-white transition hover:bg-[#174f7a]">View study options <ArrowRight size={15} /></Link>
                </div>
              </article>;
            })}
          </div>
          {visible < filtered.length && <div className="mt-8 text-center"><button type="button" onClick={() => setVisible(count => count + 12)} className="inline-flex min-h-13 items-center gap-2 rounded-xl border-2 border-[#08263c] bg-white px-6 text-sm font-black">Show 12 more <ArrowRight size={15} /></button></div>}
        </> : <div className="mt-7 rounded-2xl border border-dashed border-[#174f7a]/30 bg-white px-6 py-16 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e9f7fd] text-[#174f7a]"><Search size={24} /></span><h2 className="mt-5 font-heading text-2xl font-bold">No exact match yet</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">Clear one filter or ask a counselor to compare suitable alternatives.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={clearFilters} className="min-h-12 rounded-xl bg-[#08263c] px-5 text-sm font-black text-white">Clear filters</button><Link href="/education-fit-assessment" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#08263c] px-5 text-sm font-black">Ask for help <ArrowRight size={15} /></Link></div></div>}

        <div className="mt-10 flex items-start gap-3 rounded-2xl bg-[#dff3fb] p-5 text-sm leading-6 text-slate-600"><CheckCircle2 size={19} className="mt-0.5 shrink-0 text-[#174f7a]" /><p><strong className="text-[#08263c]">Before application:</strong> EduExpress aligns the selected program, current deadline, tuition, eligibility and official source in one fresh review.</p></div>
      </div>
    </section>
  );
}
