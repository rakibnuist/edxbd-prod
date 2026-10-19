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
  const control = 'mt-2 min-h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-[#102b40] outline-none focus:border-[#174f7a] focus:ring-2 focus:ring-[#174f7a]/15';

  return <section id="study-routes" className="scroll-mt-32 bg-[#eaf1f3] px-5 py-8 sm:px-8 lg:px-10">
    <div className="mx-auto grid max-w-[1200px] items-center gap-6 lg:grid-cols-[.42fr_.58fr] lg:gap-10">
      <div><h2 className="text-2xl font-semibold tracking-tight text-[#102b40] sm:text-3xl">Find your study route</h2><p className="mt-3 max-w-md text-sm leading-7 text-slate-600" aria-live="polite">{route.description}</p></div>
      <form action="/china-universities" method="get" data-ui="true" className="grid items-end gap-4 sm:grid-cols-2">
        <input type="hidden" name="country" value="China" />
        <label htmlFor={`${id}-level`} className="text-sm font-medium text-slate-600">Study level<select id={`${id}-level`} name="level" value={level} onChange={event => setLevel(event.target.value)} className={control}>{routes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label htmlFor={`${id}-language`} className="text-sm font-medium text-slate-600">Medium of instruction<select id={`${id}-language`} name="language" defaultValue="" className={control}><option value="">All teaching languages</option><option value="English">English</option><option value="Chinese">Chinese</option></select></label>
        <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#174f7a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#103d60] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f7a]">Find universities<ArrowRight size={17} /></button>
        <Link href="/china-admission-requirements" className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-[#174f7a] hover:underline">Check entry requirements<ArrowRight size={16} /></Link>
      </form>
    </div>
  </section>;
}
