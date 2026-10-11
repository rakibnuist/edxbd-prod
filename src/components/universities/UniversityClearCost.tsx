'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Calculator, Check, Download, GraduationCap, ReceiptText, Sparkles } from 'lucide-react';
import { trackCostSheetDownloaded } from '@/lib/conversion-events';

type Program = {
  name: string;
  level: string;
  tuition?: string;
  tuitionAfterScholarship?: string;
};

type Fee = { item: string; cost: string; recipient?: string; sourceUrl?: string };
type Scholarship = {
  title: string;
  type?: string;
  amount?: string;
  coverage?: string;
  condition?: string;
  eligiblePrograms: string[];
  status: 'active' | 'planned' | 'closed';
  sourceUrl?: string;
};
type CostPlan = {
  id: string;
  title: string;
  programName?: string;
  scholarshipTitle?: string;
  currency: string;
  tuitionBeforeScholarship?: string;
  scholarshipValue?: string;
  tuitionAfterScholarship?: string;
  applicationFee?: string;
  hostel?: string;
  insurance?: string;
  medical?: string;
  visa?: string;
  travel?: string;
  living?: string;
  serviceFee?: string;
  otherCosts: string[];
  totalEstimate?: string;
  notes: string[];
  sourceUrl?: string;
  lastVerifiedAt?: string;
  isPublished: boolean;
};

type Props = {
  university: { name: string; slug: string; city: string; country: string; logo?: string };
  programs: Program[];
  fees: Fee[];
  scholarships: Scholarship[];
  costPlans: CostPlan[];
  assessmentHref: string;
};

type Range = { min: number; max: number };
type CostRow = { label: string; value: string; recipient: string; range: Range | null };

const emptyRange = (): Range => ({ min: 0, max: 0 });

function readRange(value?: string): Range | null {
  if (!value) return null;
  if (/\bfree\b/i.test(value)) return emptyRange();
  const range = value.match(/(\d[\d,]*(?:\.\d+)?)\s*(?:-|–|—|to)\s*(\d[\d,]*(?:\.\d+)?)/i);
  if (range) return { min: Number(range[1].replaceAll(',', '')), max: Number(range[2].replaceAll(',', '')) };
  const first = value.match(/\d[\d,]*(?:\.\d+)?/);
  if (!first) return null;
  const amount = Number(first[0].replaceAll(',', ''));
  return Number.isFinite(amount) ? { min: amount, max: amount } : null;
}

const formatAmount = (amount: number, currency: string) => `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(amount))} ${currency}`;
const formatRange = (range: Range, currency: string) => range.min === range.max
  ? formatAmount(range.min, currency)
  : `${formatAmount(range.min, currency)} to ${formatAmount(range.max, currency)}`;

function scholarshipPercentage(scholarship?: Scholarship) {
  if (!scholarship) return null;
  const source = `${scholarship.amount || ''} ${scholarship.coverage || ''}`;
  if (/full\s+tuition|tuition\s+fully|free\s*\(?\s*(?:first|1st)\s+year/i.test(source)) return 100;
  const match = source.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? Math.min(100, Number(match[1])) : null;
}

const feeFor = (fees: Fee[], pattern: RegExp) => fees.find(fee => pattern.test(fee.item));

export default function UniversityClearCost(props: Props) {
  const publishedPlans = props.costPlans.filter(plan => plan.isPublished && Boolean(plan.sourceUrl) && Boolean(plan.lastVerifiedAt));
  if (!publishedPlans.length) {
    return (
      <section id="costs" className="scroll-mt-28 px-5 pb-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px] rounded-[2rem] border border-[#174f7a]/15 bg-white p-6 shadow-[0_24px_70px_rgba(8,38,60,.08)] sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#174f7a]">Program specific ClearCost</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><h2 className="font-heading text-3xl font-bold">Receive the current written cost plan</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">The downloadable plan becomes available after the selected program, scholarship, official costs, source URL and verification date are aligned. No estimated PDF is generated from incomplete records.</p></div>
            <Link href={props.assessmentHref} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#08263c] px-5 text-sm font-black text-white">Request this ClearCost <ArrowRight size={16} /></Link>
          </div>
          <p className="mt-6 border-t border-[#174f7a]/15 pt-4 text-[11px] leading-5 text-slate-500">No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.</p>
        </div>
      </section>
    );
  }
  return <VerifiedUniversityClearCost {...props} costPlans={publishedPlans} />;
}

function VerifiedUniversityClearCost({ university, programs, fees, scholarships, costPlans, assessmentHref }: Props) {
  const activePrograms = programs.length ? programs : [{ name: 'Current study option', level: 'Program' }];
  const [programName, setProgramName] = useState(activePrograms[0].name);
  const [scholarshipTitle, setScholarshipTitle] = useState('none');
  const [downloading, setDownloading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const program = activePrograms.find(item => item.name === programName) || activePrograms[0];
  const eligibleScholarships = useMemo(() => scholarships.filter(scholarship => (
    scholarship.status === 'active'
    && Boolean(scholarship.sourceUrl)
    && (!scholarship.eligiblePrograms.length || scholarship.eligiblePrograms.some(item => item.toLowerCase() === programName.toLowerCase()))
  )), [programName, scholarships]);

  useEffect(() => {
    if (scholarshipTitle !== 'none' && !eligibleScholarships.some(item => item.title === scholarshipTitle)) setScholarshipTitle('none');
  }, [eligibleScholarships, scholarshipTitle]);

  const scholarship = eligibleScholarships.find(item => item.title === scholarshipTitle);
  const publishedPlans = costPlans;
  const selectedPlan = publishedPlans.find(plan => plan.programName === programName && (
    scholarship ? plan.scholarshipTitle === scholarship.title : !plan.scholarshipTitle
  )) || publishedPlans.find(plan => plan.programName === programName);
  const currency = selectedPlan?.currency || (program.tuition?.match(/\b(CNY|BDT|USD|EUR|GBP)\b/i)?.[1].toUpperCase()) || 'CNY';
  const tuitionBefore = selectedPlan?.tuitionBeforeScholarship || program.tuition || 'Included in the written university plan';
  const tuitionRange = readRange(tuitionBefore);
  const percentage = scholarshipPercentage(scholarship);
  const fixedScholarship = scholarship && percentage === null ? readRange(scholarship.amount) : null;
  const calculatedTuition = tuitionRange && percentage !== null
    ? { min: tuitionRange.min * (1 - percentage / 100), max: tuitionRange.max * (1 - percentage / 100) }
    : tuitionRange && fixedScholarship
      ? { min: Math.max(0, tuitionRange.min - fixedScholarship.max), max: Math.max(0, tuitionRange.max - fixedScholarship.min) }
      : null;
  const tuitionAfter = selectedPlan?.tuitionAfterScholarship
    || (scholarship ? program.tuitionAfterScholarship : undefined)
    || (calculatedTuition ? formatRange(calculatedTuition, currency) : tuitionBefore);

  const rows = useMemo<CostRow[]>(() => {
    const planRows: Array<[string, string | undefined, string]> = [
      ['Tuition after selected scholarship', tuitionAfter, 'University'],
      ['Application fee', selectedPlan?.applicationFee || feeFor(fees.filter(fee => fee.sourceUrl), /application/i)?.cost, feeFor(fees.filter(fee => fee.sourceUrl), /application/i)?.recipient || 'University'],
      ['Accommodation or hostel', selectedPlan?.hostel || feeFor(fees.filter(fee => fee.sourceUrl), /hostel|accommodation/i)?.cost, feeFor(fees.filter(fee => fee.sourceUrl), /hostel|accommodation/i)?.recipient || 'University or housing provider'],
      ['Insurance', selectedPlan?.insurance || feeFor(fees.filter(fee => fee.sourceUrl), /insurance/i)?.cost, feeFor(fees.filter(fee => fee.sourceUrl), /insurance/i)?.recipient || 'Insurance provider'],
      ['Medical', selectedPlan?.medical || feeFor(fees.filter(fee => fee.sourceUrl), /medical|health check/i)?.cost, feeFor(fees.filter(fee => fee.sourceUrl), /medical|health check/i)?.recipient || 'Medical provider'],
      ['Visa and official charges', selectedPlan?.visa || feeFor(fees.filter(fee => fee.sourceUrl), /visa|embassy|residence permit/i)?.cost, feeFor(fees.filter(fee => fee.sourceUrl), /visa|embassy|residence permit/i)?.recipient || 'Responsible authority'],
      ['Travel', selectedPlan?.travel || feeFor(fees.filter(fee => fee.sourceUrl), /travel|air ticket|flight/i)?.cost, feeFor(fees.filter(fee => fee.sourceUrl), /travel|air ticket|flight/i)?.recipient || 'Travel provider'],
      ['Living plan', selectedPlan?.living || feeFor(fees.filter(fee => fee.sourceUrl), /living|food|personal/i)?.cost, feeFor(fees.filter(fee => fee.sourceUrl), /living|food|personal/i)?.recipient || 'Student budget'],
      ['EduExpress service', selectedPlan?.serviceFee || feeFor(fees.filter(fee => fee.sourceUrl), /service.*edu|eduexpress/i)?.cost, 'EduExpress'],
    ];
    const used = new Set(planRows.map(([, value]) => value).filter(Boolean));
    const extraRows = fees.filter(fee => fee.sourceUrl)
      .filter(fee => !used.has(fee.cost) && !/(tuition|application|hostel|accommodation|insurance|medical|health check|visa|embassy|residence permit|travel|air ticket|flight|living|food|personal|service.*edu|eduexpress)/i.test(fee.item))
      .map(fee => [fee.item, fee.cost, fee.recipient || 'Third party'] as [string, string, string]);
    const planExtras = (selectedPlan?.otherCosts || []).map(item => {
      const [label, ...value] = item.split(':');
      return [label || 'Other cost', value.join(':').trim() || item, 'Third party'] as [string, string, string];
    });
    return [...planRows, ...extraRows, ...planExtras]
      .filter((item): item is [string, string, string] => Boolean(item[1]))
      .map(([label, value, recipient]) => ({ label, value, recipient, range: readRange(value) }));
  }, [fees, selectedPlan, tuitionAfter]);

  const total = rows.reduce<Range>((sum, row) => row.range
    ? { min: sum.min + row.range.min, max: sum.max + row.range.max }
    : sum, emptyRange());
  const displayedTotal = selectedPlan?.totalEstimate || formatRange(total, currency);

  const downloadPdf = async () => {
    if (!pdfRef.current) return;
    setDownloading(true);
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      trackCostSheetDownloaded({ destination: university.country, university: university.name, program: program.name });
      await html2pdf().set({
        margin: 8,
        filename: `${university.slug}-${program.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-clearcost.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      }).from(pdfRef.current).save();
    } finally {
      setDownloading(false);
    }
  };

  const selectionSummary = scholarship
    ? `${scholarship.title}: ${scholarship.amount || scholarship.coverage || 'program conditions apply'}`
    : 'No scholarship selected';

  return (
    <section id="costs" className="scroll-mt-28 px-5 pb-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[2rem] border border-[#174f7a]/15 bg-white shadow-[0_24px_70px_rgba(8,38,60,.1)]">
        <div className="grid bg-[#08263c] text-white lg:grid-cols-[.75fr_1.25fr]">
          <div className="p-6 sm:p-8"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.16em] text-[#8ed0ee]"><Calculator size={16} /> Interactive ClearCost</div><h2 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">Build your university cost view</h2><p className="mt-4 text-sm leading-7 text-white/65">Choose one program and one scholarship. Tuition and other recorded costs stay aligned in a single view.</p></div>
          <div className="grid gap-4 bg-[#0b304a] p-6 sm:grid-cols-2 sm:p-8">
            <label className="text-xs font-bold"><span className="mb-2 flex items-center gap-2 text-white/65"><GraduationCap size={15} /> Program</span><select value={programName} onChange={event => setProgramName(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/15 bg-white px-3 text-sm font-bold text-[#08263c]">{activePrograms.map(item => <option key={`${item.level}-${item.name}`} value={item.name}>{item.level}: {item.name}</option>)}</select></label>
            <label className="text-xs font-bold"><span className="mb-2 flex items-center gap-2 text-white/65"><Sparkles size={15} /> Scholarship</span><select value={scholarshipTitle} onChange={event => setScholarshipTitle(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/15 bg-white px-3 text-sm font-bold text-[#08263c]"><option value="none">No scholarship selected</option>{eligibleScholarships.map(item => <option key={item.title} value={item.title}>{item.title}</option>)}</select></label>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#174f7a]">Selected cost breakdown</p><h3 className="mt-2 font-heading text-2xl font-bold">{program.name}</h3></div><ReceiptText className="text-[#174f7a]" /></div>
            <div className="overflow-hidden rounded-2xl border border-[#174f7a]/15">{rows.map(row => <div key={`${row.label}-${row.value}`} className="grid gap-1 border-b border-[#174f7a]/10 p-4 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center"><div><strong className="text-sm">{row.label}</strong><span className="mt-1 block text-[10px] font-bold uppercase tracking-[.08em] text-slate-400">Paid to {row.recipient}</span></div><span className="text-sm font-black text-[#174f7a]">{row.value}</span></div>)}</div>
          </div>

          <aside className="rounded-2xl bg-[#e9f7fd] p-6">
            <p className="text-[10px] font-black uppercase tracking-[.14em] text-[#174f7a]">Recorded first year subtotal</p><strong className="mt-3 block font-heading text-4xl leading-tight">{displayedTotal}</strong><p className="mt-3 text-xs leading-5 text-slate-600">{selectionSummary}</p>
            {scholarship?.condition && <p className="mt-4 rounded-xl bg-white p-3 text-xs leading-5 text-slate-600"><strong className="text-[#08263c]">Scholarship condition:</strong> {scholarship.condition}</p>}
            <div className="mt-5 space-y-2 text-xs leading-5 text-slate-600"><p className="flex gap-2"><Check size={14} className="mt-1 shrink-0 text-[#174f7a]" /> University and third party items are shown separately.</p><p className="flex gap-2"><Check size={14} className="mt-1 shrink-0 text-[#174f7a]" /> Scholarship coverage changes with the selected award.</p></div>
            <button type="button" onClick={downloadPdf} disabled={downloading} className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#08263c] px-4 text-sm font-black text-white disabled:opacity-60"><Download size={16} />{downloading ? 'Creating PDF…' : 'Download branded PDF'}</button>
            <Link href={assessmentHref} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#08263c] px-4 text-sm font-black">Check my eligibility <ArrowRight size={15} /></Link>
          </aside>
        </div>

        <div className="border-t border-[#174f7a]/15 bg-[#f7fafc] px-6 py-4 text-[11px] leading-5 text-slate-500 sm:px-8">No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.</div>
      </div>

      <div ref={pdfRef} aria-hidden="true" className="fixed left-[-12000px] top-0 w-[760px] bg-white p-10 text-[#08263c]">
        <div className="flex items-center justify-between border-b-4 border-[#64b5df] pb-5"><Image src="/logo.png" alt="EduExpress International" width={190} height={60} className="h-auto w-[190px]" /><div className="text-right"><strong className="block text-lg">University ClearCost Sheet</strong><span className="text-xs text-slate-500">Program and scholarship aligned</span></div></div>
        <div className="mt-8 rounded-2xl bg-[#08263c] p-7 text-white"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#8ed0ee]">{university.city}, {university.country}</p><h2 className="mt-3 text-3xl font-bold">{university.name}</h2><p className="mt-3 text-sm text-white/70">{program.level}: {program.name}</p></div>
        <div className="mt-6 grid grid-cols-2 gap-4"><div className="rounded-xl bg-[#e9f7fd] p-4"><span className="text-xs font-bold text-slate-500">Scholarship selection</span><strong className="mt-2 block">{selectionSummary}</strong></div><div className="rounded-xl bg-[#64b5df] p-4"><span className="text-xs font-bold text-[#174f7a]">Recorded subtotal</span><strong className="mt-2 block text-2xl">{displayedTotal}</strong></div></div>
        <div className="mt-7 overflow-hidden rounded-xl border border-slate-200">{rows.map(row => <div key={`pdf-${row.label}-${row.value}`} className="grid grid-cols-[1fr_190px] border-b border-slate-200 p-3 last:border-0"><div><strong className="text-sm">{row.label}</strong><span className="mt-1 block text-[10px] text-slate-500">Recipient: {row.recipient}</span></div><strong className="text-right text-sm text-[#174f7a]">{row.value}</strong></div>)}</div>
        <div className="mt-7 rounded-xl bg-[#f7fafc] p-5 text-xs leading-5 text-slate-600"><strong className="text-[#08263c]">China service terms</strong><p className="mt-2">No file opening charge. No EduExpress service fee before China visa approval. University, embassy and other third party items are separately itemized before the student proceeds.</p></div>
        <div className="mt-8 flex items-end justify-between border-t border-slate-200 pt-5 text-xs text-slate-500"><div><strong className="block text-[#08263c]">EduExpress International</strong><span>Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209</span></div><span>eduexpressint.com</span></div>
      </div>
    </section>
  );
}
