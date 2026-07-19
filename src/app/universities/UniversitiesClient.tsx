'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, BookOpenCheck, CalendarCheck, Check, ChevronDown, 
  Filter, Languages, MapPin, Search, Sparkles, Wallet, Clock, X, SlidersHorizontal, ArrowUpRight
} from 'lucide-react';
import type { CleanUniversityRecord } from '@/lib/university-records';

type Props = { initialUniversities: CleanUniversityRecord[] };

export default function UniversitiesClient({ initialUniversities }: Props) {
  const searchParams = useSearchParams();
  const initialCountry = searchParams?.get('country');

  const [query, setQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(initialCountry ? [initialCountry] : []);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedIntakes, setSelectedIntakes] = useState<string[]>([]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countryOptions = useMemo(() => Array.from(new Set(initialUniversities.map(item => item.country).filter(Boolean))).sort(), [initialUniversities]);
  const degreeOptions = useMemo(() => Array.from(new Set(initialUniversities.flatMap(item => item.degree || []))).sort(), [initialUniversities]);
  const languageOptions = useMemo(() => Array.from(new Set(initialUniversities.flatMap(item => item.taught || []))).sort(), [initialUniversities]);
  const intakeOptions = useMemo(() => Array.from(new Set(initialUniversities.flatMap(item => item.intake || []))).sort(), [initialUniversities]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return initialUniversities.filter(item => {
      const searchText = [item.name, item.city, item.location, item.country, ...(item.details?.majors || []), ...(item.programs || []).flatMap(program => [program.name || '', program.subject || ''])].join(' ').toLowerCase();
      
      const matchQuery = !normalized || searchText.includes(normalized);
      const matchCountry = selectedCountries.length === 0 || selectedCountries.includes(item.country);
      const matchDegree = selectedDegrees.length === 0 || item.degree?.some(d => selectedDegrees.includes(d));
      const matchLanguage = selectedLanguages.length === 0 || item.taught?.some(l => selectedLanguages.includes(l));
      const matchIntake = selectedIntakes.length === 0 || item.intake?.some(i => selectedIntakes.includes(i));

      return matchQuery && matchCountry && matchDegree && matchLanguage && matchIntake;
    });
  }, [initialUniversities, query, selectedCountries, selectedDegrees, selectedLanguages, selectedIntakes]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (setState: React.Dispatch<React.SetStateAction<string[]>>, option: string) => {
    setState(prev => prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]);
  };

  const clearAll = () => {
    setQuery('');
    setSelectedCountries([]);
    setSelectedDegrees([]);
    setSelectedLanguages([]);
    setSelectedIntakes([]);
    setActiveDropdown(null);
  };

  const hasFilters = query || selectedCountries.length || selectedDegrees.length || selectedLanguages.length || selectedIntakes.length;

  const FilterDropdown = ({ title, options, selected, setState, id }: { title: string, options: string[], selected: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, id: string }) => {
    const isOpen = activeDropdown === id;
    
    return (
      <div className="relative">
        <button 
          onClick={() => setActiveDropdown(isOpen ? null : id)}
          className={`flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-all ${isOpen || selected.length > 0 ? 'border-[#174f7a] bg-[#174f7a]/5 text-[#174f7a]' : 'border-slate-300 bg-white text-slate-700 hover:border-[#174f7a]'}`}
        >
          {title} {selected.length > 0 && <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#174f7a] text-[10px] text-white">{selected.length}</span>}
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-black/10 animate-in fade-in slide-in-from-top-2">
            <div className="max-h-64 overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
              {options.map(option => (
                <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                  <div className={`grid size-5 shrink-0 place-items-center rounded border transition-colors ${selected.includes(option) ? 'border-[#174f7a] bg-[#174f7a] text-white' : 'border-slate-300 bg-white'}`}>
                    {selected.includes(option) && <Check size={14} strokeWidth={3} />}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{option}</span>
                </label>
              ))}
            </div>
            {selected.length > 0 && (
              <div className="border-t border-slate-100 p-2 mt-1">
                <button onClick={() => setState([])} className="w-full rounded-lg bg-slate-100 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200">Clear Selection</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="global-university-directory" className="bg-[#f4f8fa] min-h-screen">
      {/* Top Filter Bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-12">
          
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" ref={dropdownRef}>
            
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                value={query} 
                onChange={event => setQuery(event.target.value)} 
                className="h-12 w-full rounded-full border border-slate-300 bg-white pl-12 pr-4 text-sm font-medium text-[#08263c] shadow-sm outline-none transition focus:border-[#174f7a] focus:ring-4 focus:ring-[#174f7a]/10" 
                placeholder="Search universities, majors, or cities..." 
              />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 mr-2 text-slate-400">
                <SlidersHorizontal size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
              </div>
              <FilterDropdown id="dest" title="Destination" options={countryOptions} selected={selectedCountries} setState={setSelectedCountries as any} />
              <FilterDropdown id="level" title="Study Level" options={degreeOptions} selected={selectedDegrees} setState={setSelectedDegrees as any} />
              <FilterDropdown id="lang" title="Language" options={languageOptions} selected={selectedLanguages} setState={setSelectedLanguages as any} />
              <FilterDropdown id="intake" title="Intake" options={intakeOptions} selected={selectedIntakes} setState={setSelectedIntakes as any} />
            </div>

          </div>

          {/* Active Filter Pills */}
          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 animate-in fade-in">
              <span className="text-xs font-bold text-slate-500 mr-2">Active:</span>
              
              {query && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#174f7a] px-3 py-1 text-xs font-medium text-white shadow-sm">
                  Search: "{query}" <button onClick={() => setQuery('')} className="hover:text-white/70"><X size={14} /></button>
                </span>
              )}
              
              {selectedCountries.map(c => (
                <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-[#174f7a]/20 bg-[#174f7a]/5 px-3 py-1 text-xs font-medium text-[#174f7a]">
                  {c} <button onClick={() => toggleFilter(setSelectedCountries as any, c)} className="hover:text-[#174f7a]/70"><X size={14} /></button>
                </span>
              ))}
              
              {selectedDegrees.map(d => (
                <span key={d} className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                  {d} <button onClick={() => toggleFilter(setSelectedDegrees as any, d)} className="hover:text-orange-700/70"><X size={14} /></button>
                </span>
              ))}

              {selectedLanguages.map(l => (
                <span key={l} className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                  {l} <button onClick={() => toggleFilter(setSelectedLanguages as any, l)} className="hover:text-purple-700/70"><X size={14} /></button>
                </span>
              ))}

              <button onClick={clearAll} className="ml-2 text-xs font-bold text-red-500 hover:underline">Clear All</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid (Rich List) */}
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-500">Showing <strong className="text-[#08263c] font-black">{filtered.length}</strong> available records</h2>
        </div>

        <div className="flex flex-col gap-5">
          {filtered.map((university) => {
            const isVerified = university.verificationStatus === 'verified' && university.sourceUrls?.length;
            
            return (
              <article key={university.id} className="group relative flex flex-col md:flex-row items-stretch overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#64b5df]/50">
                {/* Visual Accent / Cover Placeholder */}
                <div className="w-full md:w-64 shrink-0 bg-gradient-to-br from-[#08263c] to-[#174f7a] p-6 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 size-40 rounded-full border-[20px] border-white/5" />
                  
                  <div>
                    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${isVerified ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' : 'bg-white/10 text-white/80 border border-white/20'}`}>
                      {isVerified ? <BookOpenCheck size={12} /> : <CalendarCheck size={12} />}
                      {isVerified ? 'Verified Record' : 'Under Review'}
                    </div>
                  </div>

                  <div className="mt-12">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-white/70 uppercase tracking-widest mb-2">
                      <MapPin size={14} /> {university.country || university.location}
                    </p>
                    <p className="font-heading text-lg font-bold leading-tight">{university.city}</p>
                  </div>
                </div>
                
                {/* Core Info */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(university.degree || []).map(value => (
                      <span key={value} className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600 tracking-wider uppercase">
                        {value}
                      </span>
                    ))}
                  </div>

                  <h2 className="font-heading text-2xl md:text-3xl font-bold leading-tight text-[#08263c] transition-colors group-hover:text-[#174f7a]">
                    <Link href={`/universities/${university.slug}`} className="focus:outline-none">
                      <span className="absolute inset-0 z-10" aria-hidden="true" />
                      {university.name}
                    </Link>
                  </h2>

                  {/* Feature Grid */}
                  <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-4 border-t border-slate-100 pt-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Tuition Estimate</p>
                      <p className="text-sm font-bold text-[#08263c] flex items-center gap-1.5"><Wallet size={14} className="text-slate-400" /> {university.details?.tuition || 'Variable'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Teaching Lang</p>
                      <p className="text-sm font-bold text-[#08263c] flex items-center gap-1.5"><Languages size={14} className="text-slate-400" /> {university.taught?.join(', ') || 'Mixed'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Scholarships</p>
                      <p className="text-sm font-bold text-[#08263c] flex items-center gap-1.5"><Sparkles size={14} className="text-amber-500" /> {university.scholarships?.length ? `${university.scholarships.length} Types` : 'None'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Next Intake</p>
                      <p className="text-sm font-bold text-[#08263c] flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {university.intake?.[0] || 'Rolling'}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow CTA */}
                <div className="hidden lg:flex w-24 shrink-0 border-l border-slate-100 items-center justify-center bg-slate-50 transition-colors group-hover:bg-[#174f7a] text-slate-300 group-hover:text-white">
                  <ArrowUpRight size={32} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </article>
            );
          })}
        </div>

        {!filtered.length && (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-32 text-center">
            <div className="grid size-20 place-items-center rounded-full bg-[#e9f7fd] text-[#174f7a]">
              <Search size={32} />
            </div>
            <h2 className="mt-6 font-heading text-3xl font-bold text-[#08263c]">No results found</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-500">We couldn't find any institutions matching your exact requirements. Try removing some filters to broaden your search.</p>
            <button onClick={clearAll} className="mt-8 rounded-full bg-[#174f7a] px-8 py-4 text-sm font-black text-white hover:bg-[#0b2f4a] shadow-lg shadow-[#174f7a]/20 transition-all hover:-translate-y-0.5">Clear all filters</button>
          </div>
        )}
      </div>
    </section>
  );
}
