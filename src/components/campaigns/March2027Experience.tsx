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
    <section className="bg-canvas-soft px-5 py-10 sm:px-8 lg:py-14">
      <div className="mx-auto grid max-w-[1180px] gap-7 lg:grid-cols-[1.22fr_1fr] lg:gap-14">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1.5 text-[14px] font-semibold text-lime-deep"><span className="size-2 rounded-full bg-lime-deep" aria-hidden="true"/>Spring study routes for Bangladeshi students</p>
          <h1 className="mt-5 font-display text-[44px] font-black leading-[0.95] tracking-[-0.02em] text-petrol-800 sm:text-[56px] lg:text-[60px]">Study in China.<br/>March 2027 intake.</h1>
          <p className="mt-5 max-w-xl text-[21px] font-semibold leading-relaxed text-petrol-800">Find your programme.<br className="hidden sm:block"/> Know your costs. Plan your next step.</p>
          <p className="mt-3 max-w-xl text-[17px] leading-7 text-ink-soft">Explore universities, scholarship options and study routes. Get a personalised shortlist and a clear application plan with EduExpress International.</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3"><a href="#march-2027-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-6 lg:hidden">Get my free study plan<ArrowRight size={17} aria-hidden="true"/></a><a href="#study-options" className="inline-flex min-h-11 items-center gap-2 text-[16px] font-semibold text-petrol-800 underline underline-offset-4">Explore universities<ArrowRight size={16} aria-hidden="true"/></a><span className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-petrol-800"><span className="grid size-5 place-items-center rounded-full bg-lime"><Check size={13} strokeWidth={3} aria-hidden="true"/></span>No file opening charge</span></div>
          <figure className="relative mt-6 overflow-hidden rounded-3xl bg-petrol-800">
            <Image src="/images/students/student-life.webp" alt="Students at a cultural event in China" width={1400} height={933} priority sizes="(max-width:1023px) 100vw, 620px" className="h-[190px] w-full object-cover object-[center_42%] sm:h-[220px]"/>
            <figcaption className="flex items-center justify-between gap-3 px-5 py-3 text-[14px] text-white"><span>Your education. A new experience.</span><span className="shrink-0 font-semibold text-lime">Student life in China</span></figcaption>
          </figure>
        </div>
        <div className="lg:pt-1"><March2027LeadForm whatsappNumber={whatsappNumber} route={route} onRoute={next => { setRoute(next); setSelection(null); }} selection={selection} onClearSelection={() => setSelection(null)}/></div>
      </div>
    </section>
    <div className="border-b border-canvas-soft bg-white px-5 sm:px-8"><div data-anim="stagger" className="mx-auto grid max-w-[1180px] gap-5 py-8 sm:grid-cols-3 sm:gap-7">{[
      { icon: GraduationCap, title: 'A shortlist that fits you', copy: 'Matched to your results and study goals' },
      { icon: Wallet, title: 'Costs you can plan for', copy: 'Tuition, funding and other fees, itemised' },
      { icon: FileCheck2, title: 'Ready for your application', copy: 'Your documents, requirements and next steps' },
    ].map(item => <div key={item.title} className="flex items-start gap-3.5"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><item.icon size={20} aria-hidden="true"/></span><div><p className="text-[17px] font-bold text-petrol-800">{item.title}</p><p className="mt-0.5 text-[15px] leading-6 text-ink-soft">{item.copy}</p></div></div>)}</div></div>
    <MarchUniversityCatalogue universities={universities} onChoose={choose}/>
    {showSticky && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-canvas-soft bg-white p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(15,58,92,.06)] lg:hidden"><a href="#march-2027-assessment" className="ed-btn ed-btn-signal mx-auto flex min-h-12 w-full max-w-lg"><Sparkles size={17} aria-hidden="true"/>Get my free study plan<ArrowRight size={17} aria-hidden="true"/></a></div>}
  </>;
}
