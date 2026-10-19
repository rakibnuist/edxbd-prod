import Link from 'next/link';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { getChinaStudyResearch, type ChinaStudyResearch } from '@/lib/china-study-research';

const sectionClass = 'scroll-mt-32 border-t border-slate-200 py-10 sm:py-12';
const headingClass = 'font-heading text-2xl font-bold sm:text-3xl';
const bodyClass = 'mt-3 text-sm leading-7 text-slate-600';

function Sources({ ids, sources }: { ids: string[]; sources: ChinaStudyResearch['sources'] }) {
  const selected = ids.map(id => sources.find(source => source.id === id)).filter(source => source !== undefined);
  if (!selected.length) return null;
  return <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5">
    {selected.map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-[#174f7a] underline underline-offset-4">{source.publisher} source <ExternalLink size={12} aria-hidden="true" /></a>)}
  </div>;
}

export default async function ChinaResearch() {
  const research = await getChinaStudyResearch();
  if (!research) return null;
  const stale = new Date(research.nextReviewAt).getTime() < Date.now();

  return <section className="bg-white px-5 py-12 text-[#08263c] sm:px-8 lg:px-12" id="china-study-guide">
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-[1fr_.42fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#174f7a]">China study guide · Official source research</p>
          <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">What to know before you choose a university</h2>
          <p className="mt-5 text-base leading-8 text-slate-600">Explore eligibility, teaching language, scholarships and the costs you will actually need to cover. Every dated example below identifies its official source and admission cycle.</p>
        </div>
        <aside className="self-start border-l-4 border-[#64b5df] bg-[#f1f7fb] p-5 text-xs leading-6 text-slate-600">
          {stale && <p className="mt-2 font-bold text-amber-800">Source recheck is due. Confirm every dated requirement before applying.</p>}
          <p className="mt-3">{research.editorialNote}</p>
        </aside>
      </div>

      <nav aria-label="China study guide contents" className="my-8 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        {[
          ['Eligibility', 'china-eligibility'], ['Language & CSCA', 'china-language'], ['Scholarships', 'china-funding'],
          ['Real fee examples', 'china-fee-examples'], ['Total budget', 'china-total-cost'], ['Application timeline', 'china-preparation'],
          ['Visa', 'china-visa-route'], ['Student life', 'china-student-life'], ['Recognition & risks', 'china-recognition'], ['FAQs', 'china-research-faq'],
        ].map(([label, id]) => <a key={id} href={`#${id}`} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#174f7a] shadow-sm hover:bg-[#e9f7fd]">{label}</a>)}
      </nav>

      <section id="china-eligibility" className={sectionClass}>
        <h3 className={headingClass}>Which route matches your education?</h3>
        <p className={bodyClass}>Bring SSC and HSC or equivalent records for an undergraduate assessment; bring university certificates and transcripts for postgraduate study. The exact institution decides whether your qualification meets its requirements.</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">{research.eligibility.map(item => <article key={item.title} className="rounded-xl border border-slate-200 p-5">
          <h4 className="text-lg font-bold">{item.title}</h4><p className={bodyClass}>{item.body}</p>
          <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6"><strong>Before applying: </strong>{item.action}</p>
          <Sources ids={item.sourceIds} sources={research.sources} />
        </article>)}</div>
      </section>

      <section id="china-language" className={sectionClass}>
        <h3 className={headingClass}>Language evidence and CSCA are different checks</h3>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">{research.language.map(item => <article key={item.title} className="rounded-xl bg-[#f1f7fb] p-5">
          <h4 className="font-bold">{item.title}</h4><p className={bodyClass}>{item.body}</p><Sources ids={item.sourceIds} sources={research.sources} />
        </article>)}</div>
        <Link href="/study-in-china-without-ielts" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#174f7a] underline underline-offset-4">Read the English-proof guide <ArrowRight size={15} /></Link>
      </section>

      <section id="china-funding" className={sectionClass}>
        <h3 className={headingClass}>Compare what a scholarship actually pays</h3>
        <p className={bodyClass}>Choose the program for academic and career fit first. Then compare the funding route, covered costs, award period and conditions. A tuition award leaves other costs to plan.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">{research.scholarships.map(item => <article key={item.name} className="rounded-xl border border-slate-200 p-5">
          <h4 className="text-lg font-bold">{item.name}</h4><p className={bodyClass}>{item.coverage}</p>
          <p className={bodyClass}>{item.conditions}</p><Sources ids={item.sourceIds} sources={research.sources} />
        </article>)}</div>
        <Link href="/china-scholarships-bangladesh" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#174f7a] underline underline-offset-4">Explore scholarship requirements <ArrowRight size={15} /></Link>
      </section>

      <section id="china-fee-examples" className={sectionClass}>
        <h3 className={headingClass}>Real university fees, with the year attached</h3>
        <p className={bodyClass}>Use these published examples to understand fee differences. They are not an average China price or a personalised quotation. CNY and RMB refer to the same currency; the period and included services still matter.</p>
        <div className="mt-6 grid gap-5">{research.examples.map(item => <article key={item.slug || item.name} className="overflow-hidden rounded-xl border border-slate-200">
          <div className="bg-[#08263c] px-5 py-4 text-white"><p className="text-xs leading-5 text-[#a9e2fb]">{item.cycle}</p><h4 className="mt-1 text-xl font-bold">{item.name}</h4></div>
          <div className="p-5 sm:p-6"><dl className="divide-y divide-slate-100">{item.facts.map(fact => <div key={fact.label} className="grid gap-2 py-3 text-sm sm:grid-cols-[1.1fr_1fr]"><dt className="font-semibold">{fact.label}</dt><dd className="leading-6 text-slate-600">{fact.value}</dd></div>)}</dl>
            <p className="mt-4 rounded-lg bg-sky-50 p-4 text-sm leading-7">{item.takeaway}</p>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4"><Sources ids={item.sourceIds} sources={research.sources} />{item.slug && <Link href={`/universities/${item.slug}`} className="inline-flex items-center gap-2 py-3 text-sm font-bold text-[#174f7a]">University profile <ArrowRight size={15} /></Link>}</div>
          </div>
        </article>)}</div>
      </section>

      <section id="china-total-cost" className={sectionClass}>
        <h3 className={headingClass}>Build a complete budget, not just a tuition figure</h3>
        <p className={bodyClass}>Plan each study year and the cash needed before departure separately. Subtract only funding confirmed in your written award; record deposits, annual costs and one-off charges in their own columns.</p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">Total study-cost checklist and evidence to collect</caption>
          <thead className="bg-[#08263c] text-white"><tr><th scope="col" className="px-5 py-4">Cost category</th><th scope="col" className="px-5 py-4">Include in your calculation</th><th scope="col" className="px-5 py-4">Evidence to collect</th></tr></thead>
          <tbody>{research.costChecklist.map(item => <tr key={item.item} className="border-t border-slate-200 even:bg-slate-50"><th scope="row" className="px-5 py-4 align-top font-bold">{item.item}</th><td className="px-5 py-4 align-top leading-6 text-slate-600">{item.include}</td><td className="px-5 py-4 align-top leading-6 text-slate-600">{item.evidence}</td></tr>)}</tbody>
        </table></div>
        <p className="mt-5 rounded-lg bg-[#e9f7fd] p-5 text-sm leading-7"><strong>Your budget equation: </strong>tuition + housing + living costs + health/immigration + preparation/travel + contingency − confirmed scholarship support. Treat a refundable deposit as cash you still need to have available.</p>
        <Link href="/study-in-china-cost-bangladesh" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#174f7a] underline underline-offset-4">Continue to cost planning <ArrowRight size={15} /></Link>
      </section>

      <section id="china-preparation" className={sectionClass}>
        <h3 className={headingClass}>Work backwards from your official deadline</h3>
        <p className={bodyClass}>This is a preparation sequence. It does not invent a common deadline for every university or predict a future intake from a historical notice.</p>
        <ol className="mt-6 grid gap-4">{research.preparation.map((step, index) => <li key={step.stage} className="grid gap-4 rounded-xl border border-slate-200 p-5 sm:grid-cols-[2.5rem_1fr]">
          <span className="grid size-10 place-items-center rounded-full bg-[#174f7a] text-sm font-bold text-white">{index + 1}</span><div><h4 className="font-bold">{step.stage}</h4><p className={bodyClass}>{step.task}</p><p className="mt-2 text-sm leading-6"><strong>Keep: </strong>{step.deliverable}</p></div>
        </li>)}</ol>
        <Link href="/china-intakes-deadlines" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#174f7a] underline underline-offset-4">Check the intake guide <ArrowRight size={15} /></Link>
      </section>

      <section id="china-visa-route" className={sectionClass}>
        <h3 className={headingClass}>Prepare the Bangladesh student visa route</h3><p className={bodyClass}>{research.visa.body}</p>
        <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm leading-7 text-slate-600">{research.visa.checklist.map(item => <li key={item}>{item}</li>)}</ul>
        <Sources ids={research.visa.sourceIds} sources={research.sources} />
        <Link href="/china-student-visa-bangladesh" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#174f7a] underline underline-offset-4">Read the X1 and X2 visa guide <ArrowRight size={15} /></Link>
      </section>

      <section id="china-student-life" className={sectionClass}>
        <h3 className={headingClass}>Think beyond the admission letter</h3>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">{research.life.map(item => <article key={item.title} className="rounded-xl bg-slate-50 p-5"><h4 className="font-bold">{item.title}</h4><p className={bodyClass}>{item.body}</p><Sources ids={item.sourceIds} sources={research.sources} /></article>)}</div>
        <Link href="/life-in-china-bangladeshi-students" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#174f7a] underline underline-offset-4">Read the student life guide <ArrowRight size={15} /></Link>
      </section>

      <section id="china-recognition" className={sectionClass}>
        <h3 className={headingClass}>Recognition, risks and when to reconsider</h3>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">{research.risks.map(item => <article key={item.title} className="rounded-xl border border-amber-200 bg-amber-50/40 p-5"><h4 className="font-bold">{item.title}</h4><p className={bodyClass}>{item.body}</p><Sources ids={item.sourceIds} sources={research.sources} /></article>)}</div>
        <Link href="/mbbs-in-china-bangladesh" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#174f7a] underline underline-offset-4">Read the MBBS recognition checks <ArrowRight size={15} /></Link>
      </section>

      <section id="china-research-faq" className={sectionClass}>
        <h3 className={headingClass}>Questions students ask before applying</h3>
        <div className="mt-6 grid gap-3">{research.faqs.map(faq => <details key={faq.question} className="rounded-xl border border-slate-200 p-5"><summary className="cursor-pointer text-base font-bold">{faq.question}</summary><p className={bodyClass}>{faq.answer}</p><Sources ids={faq.sourceIds} sources={research.sources} /></details>)}</div>
      </section>

      <section id="china-official-sources" className={sectionClass}>
        <div className="flex items-center gap-3"><BookOpen size={22} className="text-[#174f7a]" /><h3 className={headingClass}>Official sources and their scope</h3></div>
        <p className={bodyClass}>Follow the source for the detail that matters to your application. A historical guide remains useful for comparison but does not establish availability for a new intake.</p>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2">{research.sources.map(source => <li key={source.id} className="rounded-lg border border-slate-200 p-4 text-xs leading-6"><a href={source.url} target="_blank" rel="noreferrer" className="font-bold text-[#174f7a] underline underline-offset-4">{source.publisher}: {source.title} ↗</a><p className="mt-1 text-slate-600">{source.scope}</p></li>)}</ol>
      </section>
    </div>
  </section>;
}
