'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, FileCheck2, GraduationCap, Sparkles, Wallet } from 'lucide-react';
import March2027LeadForm from './March2027LeadForm';
import MarchUniversityCatalogue from './MarchUniversityCatalogue';
import type { MarchCatalogueUniversity, MarchCatalogueProgramme } from '@/lib/march-campaign-catalogue';

export default function March2027Experience({ universities, whatsappNumber }: { universities: MarchCatalogueUniversity[]; whatsappNumber: string }) {
  const [route, setRoute] = useState('');
  const [selection, setSelection] = useState<{ university: string; program: string } | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const form = document.getElementById('march-2027-assessment');
    if (!form) return;
    let formVisible = false;
    const sync = () => setShowSticky(!formVisible && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName || ''));
    const observer = new IntersectionObserver(entries => { formVisible = entries[0].isIntersecting; sync(); }, { threshold: 0 });
    observer.observe(form); document.addEventListener('focusin', sync); document.addEventListener('focusout', sync);
    return () => { observer.disconnect(); document.removeEventListener('focusin', sync); document.removeEventListener('focusout', sync); };
  }, []);
  const choose = (university: MarchCatalogueUniversity, programme: MarchCatalogueProgramme, major?: string) => {
    setSelection({ university: university.name, program: [programme.name, major].filter(Boolean).join(' · ') });
    setRoute(({ language: 'Chinese language', foundation: 'Foundation → Bachelor', bachelor: 'Direct Bachelor', masters: 'Master’s' } as Record<string,string>)[programme.route]);
    requestAnimationFrame(()=>{const form = document.getElementById('march-2027-assessment'); form?.scrollIntoView({ behavior: 'auto', block: 'start' }); (form?.querySelector('input, select') as HTMLElement | null)?.focus({ preventScroll: true });});
  };
  return <>
    <section className="border-b border-[#dfe8ee] bg-[#f0f6fa] px-5 py-8 sm:px-8 lg:py-11">
      <div className="mx-auto grid max-w-[1180px] gap-7 lg:grid-cols-[1.22fr_1fr] lg:gap-14">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-md border border-[#e8c9c9] bg-white px-3 py-1.5 text-xs font-semibold text-[#a62e30]"><span className="size-2 rounded-full bg-[#b83536]"/>Spring study routes for Bangladeshi students</p>
          <h1 style={{ fontSynthesis: 'weight' }} className="mt-5 text-[clamp(2.5rem,5vw,4.1rem)] font-extrabold leading-[1.08] tracking-[-.045em] text-[#0b2f4a]">Study in China.<br/>March 2027 intake.</h1>
          <p className="mt-4 max-w-xl text-xl font-semibold leading-relaxed text-[#0b2f4a]">Find your programme.<br className="hidden sm:block"/> Know your costs. Plan your next step.</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">Explore universities, scholarship options and study routes. Get a personalised shortlist and a clear application plan with EduExpress International.</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3"><a href="#march-2027-assessment" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#f2b544] px-5 text-sm font-bold text-[#0b2f4a] transition hover:bg-[#e9a92f] lg:hidden">Get my free study plan<ArrowRight size={17}/></a><a href="#study-options" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#174f7a] underline underline-offset-4">Explore universities<ArrowRight size={16}/></a><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#17624f]"><Check size={15}/>No file opening charge</span></div>
          <figure className="relative mt-5 overflow-hidden rounded-xl bg-[#0b2f4a]">
            <Image src="/images/students/student-life.webp" alt="Students at a cultural event in China" width={1400} height={933} priority sizes="(max-width:1023px) 100vw, 620px" className="h-[190px] w-full object-cover object-[center_42%] sm:h-[220px]"/>
            <figcaption className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs text-white"><span>Your education. A new experience.</span><span className="shrink-0 text-[#b4d9ef]">Student life in China</span></figcaption>
          </figure>
        </div>
        <div className="lg:pt-1"><March2027LeadForm whatsappNumber={whatsappNumber} route={route} onRoute={next => { setRoute(next); setSelection(null); }} selection={selection} onClearSelection={() => setSelection(null)}/></div>
      </div>
    </section>
    <div className="border-b border-[#e2e9ee] px-5 sm:px-8"><div className="mx-auto grid max-w-[1180px] gap-5 py-6 sm:grid-cols-3 sm:gap-7">{[
      { icon: GraduationCap, title: 'A shortlist that fits you', copy: 'Matched to your results and study goals' },
      { icon: Wallet, title: 'Costs you can plan for', copy: 'Tuition, funding and other fees, itemised' },
      { icon: FileCheck2, title: 'Ready for your application', copy: 'Your documents, requirements and next steps' },
    ].map(item => <div key={item.title} className="flex items-start gap-3"><item.icon size={23} strokeWidth={1.7} className="mt-0.5 shrink-0 text-[#174f7a]"/><div><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs leading-6 text-slate-500">{item.copy}</p></div></div>)}</div></div>
    <MarchUniversityCatalogue universities={universities} onChoose={choose}/>
    {showSticky && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#cddde8] bg-white p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(11,47,74,.06)] lg:hidden"><a href="#march-2027-assessment" className="mx-auto flex min-h-12 max-w-lg items-center justify-center gap-2 rounded-lg bg-[#f2b544] px-4 text-sm font-bold text-[#0b2f4a]"><Sparkles size={17}/>Get my free study plan<ArrowRight size={17}/></a></div>}
  </>;
}
