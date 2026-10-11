import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calculator, Check, ChevronDown, CircleAlert, FileCheck2, SearchCheck, ShieldCheck, UserRoundCheck } from 'lucide-react';
import type { ChinaGuidePage as ChinaGuidePageData } from '@/data/chinaGuidePages';
import ChinaServicePackages from '@/components/china/ChinaServicePackages';
import { getPublicTrustRecords } from '@/lib/trust-records';

const canonicalBase = 'https://eduexpressint.com';

export default async function ChinaGuidePage({ guide }: { guide: ChinaGuidePageData }) {
  const servicePackages = guide.slug === 'china-visa-first-policy'
    ? (await getPublicTrustRecords()).servicePackages.filter(item => item.destination === 'China')
    : [];
  const canonical = `${canonicalBase}/${guide.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${canonical}#page`, url: canonical, name: guide.title, description: guide.description, dateModified: '2026-07-19', inLanguage: 'en-BD', reviewedBy: { '@id': 'https://eduexpressint.com/#organization' } },
      { '@type': 'FAQPage', '@id': `${canonical}#faq`, mainEntity: guide.faqs.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${canonicalBase}/` },
        { '@type': 'ListItem', position: 2, name: 'Study in China', item: `${canonicalBase}/study-in-china-from-bangladesh` },
        { '@type': 'ListItem', position: 3, name: guide.title, item: canonical },
      ] },
    ],
  };

  return (
    <article className="bg-[#f6f9fb] pt-[76px] text-[#08263c] min-[1200px]:pt-[104px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="relative overflow-hidden bg-[#08263c] text-white">
        <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] hidden md:block size-[28rem] opacity-15">
          <Image src="/emblem-icon.png" width={450} height={450} alt="" className="h-auto w-full object-contain filter brightness-0 invert" />
        </div>
        <div className="absolute bottom-0 left-[38%] h-44 w-px bg-gradient-to-b from-transparent to-[#64b5df]/50" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:px-12 lg:grid-cols-[.68fr_.32fr] lg:items-end lg:py-16">
          <div>
            <nav aria-label="Breadcrumb" className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/50"><Link href="/">Home</Link> <span aria-hidden="true">/</span> <Link href="/study-in-china-from-bangladesh">Study in China</Link> <span aria-hidden="true">/</span> {guide.code}</nav>
            <p className="mt-8 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">{guide.eyebrow}</p>
            <h1 className="mt-4 max-w-5xl text-balance font-heading text-4xl font-bold leading-tight sm:text-6xl">{guide.title}</h1>
            <p className="mt-6 max-w-4xl text-base leading-8 text-white/75">{guide.directAnswer}</p>
          </div>
          <div className="grid gap-px bg-white/15">
            {guide.facts.map(item => <div key={item.label} className="grid grid-cols-[6rem_1fr] bg-[#08263c] p-4"><strong className="font-heading text-2xl text-[#8ed0ee]">{item.value}</strong><span><b className="block text-xs">{item.label}</b><small className="mt-1 block text-[10px] leading-4 text-white/45">{item.note}</small></span></div>)}
          </div>
        </div>
      </header>

      <nav aria-label="China guide navigation" className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto flex max-w-[1440px] gap-px overflow-x-auto bg-[#174f7a]/15 px-5 sm:px-8 lg:px-12">
          {[
            ['Universities', '/china-universities'],
            ['Scholarships', '/china-scholarships-bangladesh'],
            ['Visa', '/china-student-visa-bangladesh'],
            ['Costs', '/study-in-china-cost-bangladesh'],
            ['Without IELTS', '/study-in-china-without-ielts'],
            ['MBBS', '/mbbs-in-china-bangladesh'],
            ['Intakes', '/china-intakes-deadlines'],
            ['Student life', '/life-in-china-bangladeshi-students'],
            ['Success stories', '/china-success-stories'],
          ].map(([label, href]) => <Link key={href} href={href} className={`shrink-0 bg-white px-4 py-4 text-xs font-black ${href === `/${guide.slug}` ? 'text-[#174f7a] shadow-[inset_0_-3px_0_#174f7a]' : 'text-slate-500 hover:bg-[#e9f7fd]'}`}>{label}</Link>)}
        </div>
      </nav>

      {guide.slug === 'china-visa-first-policy' ? <ChinaServicePackages packages={servicePackages} /> : null}

      <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[.28fr_.72fr] lg:px-12 lg:py-20">
        <aside>
          <div className="sticky top-32 border-t-4 border-[#174f7a] bg-[#e9f7fd] p-5">
            <SearchCheck size={25} className="text-[#174f7a]" />
            <h2 className="mt-5 font-heading text-2xl font-bold">What this guide does</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">It connects the decision, current official sources, costs and responsibilities in one practical explanation.</p>
          </div>
        </aside>

        <div className="grid gap-3">
          {guide.sections.map((section, index) => (
            <details key={section.heading} open={index === 0} className="group rounded-2xl border border-[#174f7a]/15 bg-white open:shadow-[0_14px_40px_rgba(8,38,60,.08)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 sm:p-6">
                <span className="flex items-center gap-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e9f7fd] text-[10px] font-black text-[#174f7a]">{String(index + 1).padStart(2, '0')}</span><h2 className="font-heading text-xl font-bold sm:text-2xl">{section.heading}</h2></span>
                <ChevronDown size={19} className="shrink-0 text-[#174f7a] transition group-open:rotate-180" />
              </summary>
              <div className="border-t border-[#174f7a]/10 px-5 pb-6 pt-5 sm:px-6">
                <p className="mt-3 text-sm leading-7 text-slate-600">{section.summary}</p>
                {section.items?.length ? <ul className="mt-5 grid gap-2 sm:grid-cols-2">{section.items.map(item => <li key={item} className="flex gap-3 bg-[#f6f9fb] p-3 text-xs leading-5 text-slate-600"><Check size={15} className="mt-0.5 shrink-0 text-[#174f7a]" />{item}</li>)}</ul> : null}
              </div>
            </details>
          ))}
        </div>
      </section>

      {guide.slug === 'study-in-china-cost-bangladesh' ? <section className="mx-auto max-w-[1440px] px-5 pb-14 sm:px-8 lg:px-12 lg:pb-20"><div className="grid items-center gap-6 rounded-3xl border-2 border-[#08263c] bg-white p-6 sm:p-8 lg:grid-cols-[auto_1fr_auto]"><Calculator size={36} className="text-[#174f7a]" /><div><h2 className="font-heading text-2xl font-bold">Costs vary by university, program and scholarship</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">A single average number can be misleading. Open a specific university to see its real tuition, apply an available scholarship and get an exact, itemized ClearCost estimate you can download as a PDF.</p></div><Link href="/universities" className="flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#08263c] px-6 text-sm font-black text-white">Open ClearCost by university <ArrowRight size={16} /></Link></div></section> : null}

      <section className="bg-[#e9f7fd]">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-14 sm:px-8 lg:px-12 lg:grid-cols-2 lg:py-20">
          <article className="border-t-4 border-amber-500 bg-white p-6 sm:p-8">
            <CircleAlert size={27} className="text-amber-600" />
            <h2 className="mt-5 font-heading text-2xl font-bold">Details tied to your selected route</h2>
            <ul className="mt-5 grid gap-3">{guide.changeRisks.map(item => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />{item}</li>)}</ul>
          </article>
          <article className="border-t-4 border-[#174f7a] bg-white p-6 sm:p-8">
            <UserRoundCheck size={27} className="text-[#174f7a]" />
            <h2 className="mt-5 font-heading text-2xl font-bold">A strong fit for this route</h2>
            <ul className="mt-5 grid gap-3">{guide.notSuitable.map(item => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><Check size={15} className="mt-1.5 shrink-0 text-[#174f7a]" />{item}</li>)}</ul>
          </article>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-center font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Questions before action</p>
          <h2 className="mt-3 text-center font-heading text-3xl font-bold sm:text-5xl">Frequently asked questions</h2>
          <div className="mt-9 grid gap-3">{guide.faqs.map((item, index) => <details key={item.question} className="group border border-[#174f7a]/15 bg-[#f6f9fb] p-5 open:bg-white open:shadow-[0_15px_45px_rgba(8,38,60,0.08)]"><summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-heading text-base font-bold"><span className="flex gap-4"><span className="font-mono text-[9px] text-[#174f7a]">0{index + 1}</span>{item.question}</span><span className="grid size-7 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a] transition group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl pl-8 text-sm leading-7 text-slate-600">{item.answer}</p></details>)}</div>
        </div>
      </section>

      <section className="bg-[#08263c] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 lg:px-12 lg:grid-cols-[.68fr_.32fr] lg:items-center">
          <div><p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Next useful step</p><h2 className="mt-3 text-balance font-heading text-3xl font-bold sm:text-4xl">{guide.ctaTitle}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">{guide.ctaText}</p></div>
          <Link href="/study-in-china-from-bangladesh#china-fit-form" className="flex min-h-14 items-center justify-center gap-2 bg-[#64b5df] px-5 text-sm font-black text-[#08263c]">Get My China Fit Assessment <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="border-b border-[#174f7a]/15 bg-[#f6f9fb]">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 sm:px-8 lg:px-12 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#174f7a]"><FileCheck2 size={14} /> Related China decisions</p>
            <div className="mt-4 grid gap-px bg-[#174f7a]/15 sm:grid-cols-2">{guide.related.map(item => <Link key={item.href} href={item.href} className="flex items-center justify-between gap-3 bg-white p-3 text-xs font-black hover:bg-[#e9f7fd]">{item.label}<ArrowRight size={14} className="text-[#174f7a]" /></Link>)}</div>
          </div>
          <div>
            <p className="flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#174f7a]"><ShieldCheck size={14} /> Official sources</p>
            <div className="mt-4 grid gap-2">{guide.sources.map(source => <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 border-b border-[#174f7a]/15 bg-white p-3 text-xs font-bold text-[#174f7a] hover:bg-[#e9f7fd]">{source.label}<ArrowRight size={14} /></a>)}</div>
          </div>
          <div className="lg:col-span-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#174f7a]/15 pt-5 text-[10px] leading-5 text-slate-500"><span><strong className="text-[#08263c]">Owned by:</strong> EduExpress China Admissions Desk</span><span><strong className="text-[#08263c]">Information standard:</strong> Official sources, written costs and clear responsibilities</span></div>
        </div>
      </section>
    </article>
  );
}
