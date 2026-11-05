'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const routes = [
  { value: 'Bachelor', label: 'Bachelor’s', description: 'Compare undergraduate majors against your HSC, A Level or equivalent qualification, subject background and teaching language.' },
  { value: 'Master', label: 'Master’s', description: 'Build on your bachelor’s degree. Compare subject prerequisites, research interests, language evidence and any supervisor requirements.' },
  { value: 'PhD', label: 'PhD', description: 'Find a research direction that fits your postgraduate background. Review the supervisor, proposal and academic recommendation requirements.' },
  { value: 'Language', label: 'Chinese language', description: 'Explore Chinese-language study for your learning goals. Check the course duration, starting level and the fees for your chosen course.' },
  { value: 'Foundation', label: 'Foundation', description: 'Compare academic and language preparation. Check the progression conditions and the full preparation cost before choosing a degree route.' },
  { value: 'Diploma', label: 'Diploma', description: 'Check the specific qualification, entry requirements and recognition of a diploma or vocational route against your future study and career plans.' },
];

export default function ChinaStudyPlanner() {
  const [level, setLevel] = useState('Bachelor');
  const id = useId();
  const route = routes.find(item => item.value === level) || routes[0];
  const control = 'mt-1.5 min-h-[50px] w-full rounded-xl border border-petrol-800 bg-white px-4 text-[16px] text-petrol-800 focus:outline-none focus:ring-4 focus:ring-lime/60';

  return <section id="study-routes" className="scroll-mt-28 bg-canvas-soft py-16 lg:py-20">
    <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-5 lg:grid-cols-[.9fr_1.1fr] lg:gap-14 lg:px-8">
      <div>
        <h2 data-anim="up" className="font-display text-[34px] font-black leading-[0.98] tracking-[-0.01em] text-petrol-800 sm:text-[46px]">Find your study route.</h2>
        <p className="mt-4 max-w-md text-[18px] leading-[1.6] text-ink-soft" aria-live="polite">{route.description}</p>
      </div>
      <form action="/china-universities" method="get" data-ui="true" className="grid items-end gap-4 rounded-3xl bg-white p-6 sm:grid-cols-2 sm:p-7">
        <input type="hidden" name="country" value="China" />
        <label htmlFor={`${id}-level`} className="text-[14px] font-semibold text-petrol-800">Study level<select id={`${id}-level`} name="level" value={level} onChange={event => setLevel(event.target.value)} className={control}>{routes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label htmlFor={`${id}-language`} className="text-[14px] font-semibold text-petrol-800">Medium of instruction<select id={`${id}-language`} name="language" defaultValue="" className={control}><option value="">All teaching languages</option><option value="English">English</option><option value="Chinese">Chinese</option></select></label>
        <button type="submit" className="ed-btn ed-btn-signal min-h-[52px] w-full">Find universities<ArrowRight size={17} aria-hidden="true" /></button>
        <Link href="/china-admission-requirements" className="inline-flex min-h-[48px] items-center justify-center gap-1.5 text-[16px] font-semibold text-petrol-800 underline-offset-4 hover:underline">Check entry requirements<ArrowRight size={16} aria-hidden="true" /></Link>
      </form>
    </div>
  </section>;
}
