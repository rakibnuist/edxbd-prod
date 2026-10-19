import Link from 'next/link';
import { ArrowRight, Check, CircleDollarSign, FileCheck2, Plane, RotateCcw, ShieldCheck } from 'lucide-react';

type ServicePackage = {
  id: string;
  slug: string;
  title: string;
  packageType: string;
  priceLabel: string;
  summary: string;
  outcomeScope: string;
  includedItems: string[];
  excludedItems: string[];
  paymentTerms: string;
  refundTerms: string;
  securityOptions: string[];
  complianceNote: string;
};

export default function ChinaServicePackages({ packages }: { packages: ServicePackage[] }) {
  if (!packages.length) return null;
  const shared = packages[0];

  return (
    <section className="bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1240px]">
        <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.17em] text-[#174f7a]">Choose the service route that matches the award</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-5xl">Two China packages. One written responsibility plan.</h2><p className="mt-4 text-sm leading-7 text-slate-600">The university scholarship letter defines the education benefit. The EduExpress package defines the application support, included costs, payment timing and responsibilities.</p></div>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          {packages.map((item, index) => (
            <article key={item.id} className={`overflow-hidden rounded-[2rem] border ${index === 0 ? 'border-[#174f7a] bg-[#08263c] text-white' : 'border-[#174f7a]/20 bg-[#f7fafc]'}`}>
              <div className="p-6 sm:p-8"><div className="flex items-start justify-between gap-5"><span className={`grid size-12 place-items-center rounded-2xl ${index === 0 ? 'bg-[#64b5df] text-[#08263c]' : 'bg-[#e9f7fd] text-[#174f7a]'}`}>{index === 0 ? <ShieldCheck size={23} /> : <CircleDollarSign size={23} />}</span><span className={`rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] ${index === 0 ? 'bg-white/10 text-[#8ed0ee]' : 'bg-white text-[#174f7a]'}`}>Package 0{index + 1}</span></div><h3 className="mt-6 font-heading text-3xl font-bold">{item.title}</h3><strong className={`mt-4 block text-3xl ${index === 0 ? 'text-[#8ed0ee]' : 'text-[#174f7a]'}`}>{item.priceLabel}</strong><p className={`mt-4 text-sm leading-7 ${index === 0 ? 'text-white/65' : 'text-slate-600'}`}>{item.summary}</p><p className={`mt-5 rounded-xl p-4 text-xs leading-6 ${index === 0 ? 'bg-white/8 text-white/75' : 'bg-white text-slate-600'}`}>{item.outcomeScope}</p></div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <article className="rounded-[2rem] border border-[#174f7a]/15 bg-[#f7fafc] p-6 sm:p-8"><div className="flex items-center gap-3"><FileCheck2 className="text-[#174f7a]" /><h3 className="font-heading text-2xl font-bold">Included in both packages</h3></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{shared.includedItems.map(item => <p key={item} className="flex gap-3 rounded-xl bg-white p-3 text-xs leading-5 text-slate-600"><Check size={15} className="mt-0.5 shrink-0 text-[#2f8f6b]" />{item}</p>)}</div></article>
          <div className="grid gap-5">
            <article className="rounded-[2rem] bg-[#e9f7fd] p-6"><Plane className="text-[#174f7a]" /><h3 className="mt-4 font-heading text-xl font-bold">Paid separately</h3><ul className="mt-4 space-y-2">{shared.excludedItems.map(item => <li key={item} className="text-xs leading-5 text-slate-600">{item}</li>)}</ul></article>
            <article className="rounded-[2rem] bg-[#08263c] p-6 text-white"><RotateCcw className="text-[#8ed0ee]" /><h3 className="mt-4 font-heading text-xl font-bold">Payment and return terms</h3><p className="mt-3 text-xs leading-6 text-white/65">{shared.paymentTerms}</p><p className="mt-3 text-xs leading-6 text-white/65">{shared.refundTerms}</p></article>
          </div>
        </div>

        <article className="mt-6 rounded-[2rem] border-2 border-[#08263c] bg-white p-6 sm:p-8"><h3 className="font-heading text-2xl font-bold">Document and payment protection</h3><p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.</p><p className="mt-5 border-l-4 border-[#64b5df] pl-4 text-xs leading-6 text-slate-500">{shared.complianceNote}</p><Link href="/study-in-china-from-bangladesh#china-fit-form" className="mt-6 inline-flex min-h-13 items-center gap-2 rounded-xl bg-[#08263c] px-5 text-sm font-black text-white">Check which route fits me <ArrowRight size={16} /></Link></article>
      </div>
    </section>
  );
}
