'use client';

import { useState, useEffect } from 'react';
import { Printer, CalendarDays, Wallet, Calculator, Building2, Globe, FileCheck2, Loader2, Plus, Trash2, Award } from 'lucide-react';

type Fee = { item: string; cost: string };
type Scholarship = { title: string; amount?: string; coverage?: string; type?: string };
type CustomCost = { id: string; label: string; amount: number | string; currency: 'CNY' | 'USD' | 'BDT' };

type Props = {
  defaultTuition?: number;
  defaultHostel?: number;
  isChina?: boolean;
  universityName?: string;
  studyLevel?: string;
  teaching?: string;
  programs?: any[];
  scholarships?: Scholarship[];
  documents?: string[];
  fees?: Fee[];
};

// Pull the first number out of a fee cost string like "800 CNY" or "৳3,000".
const num = (v: unknown) => Number(String(v ?? '').replace(/[^0-9.]/g, '')) || 0;
const findFee = (fees: Fee[] | undefined, re: RegExp): number | undefined => {
  const f = fees?.find(x => re.test(x.item));
  return f ? num(f.cost) : undefined;
};

export default function CostCalculator({
  defaultTuition = 25000,
  defaultHostel = 8000,
  isChina = true,
  universityName,
  studyLevel,
  teaching,
  programs,
  scholarships,
  documents,
  fees,
}: Props) {
  // CNY by default if China, else USD.
  const currency = isChina ? 'CNY' : 'USD';

  // ---- University-side costs: auto-filled from the university record where available ----
  const [tuition, setTuition] = useState<number | string>(defaultTuition);
  const [appFee, setAppFee] = useState<number | string>(findFee(fees, /application|registration/i) ?? '');
  const [hostel, setHostel] = useState<number | string>(findFee(fees, /hostel|accommodation|dormitory/i) ?? defaultHostel);
  const [insurance, setInsurance] = useState<number | string>(findFee(fees, /insurance/i) ?? 800);
  const [residencePermit, setResidencePermit] = useState<number | string>(findFee(fees, /residence\s*permit|visa\s*fee/i) ?? 400);
  const [destMedical, setDestMedical] = useState<number | string>(findFee(fees, /medical|health\s*check/i) ?? 500);

  // ---- Other / processing costs (BDT) — auto defaults requested by EduExpress ----
  const [bdMedical, setBdMedical] = useState<number | string>(3000);
  const [embassyFee, setEmbassyFee] = useState<number | string>(9200);
  const [airTicket, setAirTicket] = useState<number | string>(35000);
  const [serviceCharge, setServiceCharge] = useState<number | string>(10000);
  const [exchangeRate, setExchangeRate] = useState<number | string>(19);

  // ---- User-added custom cost lines ----
  const [customCosts, setCustomCosts] = useState<CustomCost[]>([]);

  const [totalCurrencyY1, setTotalCurrencyY1] = useState<number>(0);
  const [totalCurrencyY2to4, setTotalCurrencyY2to4] = useState<number>(0);
  const [totalBDTY1, setTotalBDTY1] = useState<number>(0);
  const [totalBDT4Years, setTotalBDT4Years] = useState<number>(0);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const customCurrency = customCosts.filter(c => c.currency === currency).reduce((s, c) => s + num(c.amount), 0);
    const customBDT = customCosts.filter(c => c.currency === 'BDT').reduce((s, c) => s + num(c.amount), 0);

    const baseTotalY1 = (Number(appFee) || 0) + (Number(tuition) || 0) + (Number(hostel) || 0) + (Number(insurance) || 0) + (Number(residencePermit) || 0) + (Number(destMedical) || 0) + customCurrency;
    setTotalCurrencyY1(baseTotalY1);

    const recurringAnnual = (Number(tuition) || 0) + (Number(hostel) || 0) + (Number(insurance) || 0) + (Number(residencePermit) || 0);
    const baseTotalY2to4 = recurringAnnual * 3;
    setTotalCurrencyY2to4(baseTotalY2to4);

    const rate = Number(exchangeRate) || 0;
    const bdtTotalY1 = (baseTotalY1 * rate) + (Number(bdMedical) || 0) + (Number(embassyFee) || 0) + (Number(airTicket) || 0) + (Number(serviceCharge) || 0) + customBDT;
    setTotalBDTY1(bdtTotalY1);

    setTotalBDT4Years(bdtTotalY1 + (baseTotalY2to4 * rate));
  }, [tuition, appFee, hostel, insurance, residencePermit, destMedical, bdMedical, embassyFee, airTicket, serviceCharge, exchangeRate, customCosts, currency]);

  const handleInput = (val: string, setter: (val: number | string) => void) => {
    setter(val === '' ? '' : Number(val));
  };

  const addCustomCost = () => {
    setCustomCosts(prev => [...prev, { id: `${Date.now()}-${prev.length}`, label: '', amount: '', currency }]);
  };
  const updateCustomCost = (id: string, patch: Partial<CustomCost>) => {
    setCustomCosts(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)));
  };
  const removeCustomCost = (id: string) => {
    setCustomCosts(prev => prev.filter(c => c.id !== id));
  };

  const customCurrencyRows = customCosts.filter(c => c.currency === currency && (c.label || num(c.amount)));
  const customBDTRows = customCosts.filter(c => c.currency === 'BDT' && (c.label || num(c.amount)));

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('pdf-export-container');

      if (element) {
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.top = '0';
        tempContainer.style.left = '0';
        tempContainer.style.width = '794px';
        tempContainer.style.zIndex = '999999';
        tempContainer.style.backgroundColor = '#ffffff';
        tempContainer.style.color = '#0f172a';

        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.display = 'block';
        clone.style.visibility = 'visible';
        clone.style.position = 'relative';
        clone.style.width = '794px';
        clone.style.backgroundColor = '#ffffff';

        tempContainer.appendChild(clone);
        document.body.appendChild(tempContainer);

        await new Promise((resolve) => setTimeout(resolve, 300));

        const opt = {
          // Zero side margins: the page inner width then equals 210mm ≈ 794px,
          // exactly matching the fixed-width template (non-zero sides clipped
          // the right edge). Horizontal whitespace comes from the template padding.
          margin: [0.25, 0, 0.25, 0] as [number, number, number, number],
          filename: `${universityName?.replace(/\s+/g, '_') || 'University'}_4Year_Investment_Plan.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false, scrollX: 0, scrollY: 0, windowWidth: 794 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const },
          // avoid-all keeps every block whole; the .pdf-block wrappers below
          // are the units that move to the next page instead of being sliced.
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'], avoid: '.pdf-block' },
        };

        await html2pdf().set(opt as any).from(clone).save();

        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      {/* ========================================= */}
      {/* HIDDEN PDF TEMPLATE (794px width for A4)   */}
      {/* ========================================= */}
      <div id="pdf-export-container" style={{ display: 'none' }} className="w-[794px] bg-white text-slate-900 font-sans px-8 py-6">

        {/* HEADER */}
        <div className="pdf-block flex justify-between items-start border-b-4 border-[#174f7a] pb-4 mb-5">
          <div>
            <h1 className="text-3xl font-black text-[#174f7a] tracking-tight mb-1 uppercase">4-Year Investment Plan</h1>
            <h2 className="text-xl font-bold text-slate-800">{universityName || 'University Details'}</h2>
          </div>
          <div className="text-right">
            <div className="inline-block bg-[#174f7a] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
              Official Estimate
            </div>
            <p className="font-black text-[#174f7a] text-lg mb-0.5 tracking-tight">EduExpress International</p>
            <p className="text-[11px] text-slate-600">House 12/1, Ground Floor, Road 4/A</p>
            <p className="text-[11px] text-slate-600">Dhanmondi, Dhaka 1209</p>
            <p className="text-sm font-bold mt-0.5 text-[#174f7a]">+880 1983-333566</p>
          </div>
        </div>

        {/* UNIVERSITY & PROGRAM PROFILE */}
        <div className="pdf-block grid grid-cols-2 gap-5 mb-5 bg-[#f4f8fb] p-4 rounded-2xl border border-blue-100">
          <div>
            <h3 className="font-bold text-[#174f7a] mb-2 text-[11px] uppercase tracking-widest flex items-center gap-2">
              <Building2 size={13} /> Academic Profile
            </h3>
            <div className="space-y-1.5 text-[13px]">
              <div className="flex justify-between border-b border-blue-200 pb-1">
                <span className="font-semibold text-slate-600">Study Level</span>
                <span className="font-bold text-slate-900">{studyLevel || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-1">
                <span className="font-semibold text-slate-600">Teaching Language</span>
                <span className="font-bold text-slate-900">{teaching || 'N/A'}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-[#174f7a] mb-2 text-[11px] uppercase tracking-widest flex items-center gap-2">
              <FileCheck2 size={13} /> Required Documents
            </h3>
            <ul className="text-[13px] space-y-1 font-medium text-slate-700">
              {documents?.slice(0, 4).map((doc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#174f7a] rounded-full mt-1.5 shrink-0" />
                  {doc}
                </li>
              )) || <li>As per assessment</li>}
              {documents && documents.length > 4 && <li className="text-slate-500 italic text-[11px] ml-3.5">+ {documents.length - 4} more</li>}
            </ul>
          </div>
        </div>

        {/* PROGRAMS & SCHOLARSHIPS */}
        <div className="pdf-block grid grid-cols-2 gap-5 mb-5">
          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="font-bold text-[#174f7a] border-b-2 border-slate-100 pb-2 mb-2 text-[11px] uppercase tracking-widest flex items-center gap-2">
              <Globe size={13} /> Highlighted Programs
            </h3>
            {programs?.slice(0, 3).map((p, i) => (
              <div key={i} className="mb-2">
                <p className="font-bold text-slate-900 text-[13px] leading-tight">{p.name}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Tuition: <span className="font-bold text-slate-700">{p.tuition || `${tuition} ${currency}/yr`}</span></p>
              </div>
            ))}
          </div>
          <div className="border border-amber-100 bg-amber-50/50 rounded-xl p-4">
            <h3 className="font-bold text-amber-800 border-b-2 border-amber-100 pb-2 mb-2 text-[11px] uppercase tracking-widest flex items-center gap-2">
              <Award size={13} /> Potential Scholarships
            </h3>
            {scholarships && scholarships.length > 0 ? (
              scholarships.slice(0, 3).map((s, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold text-amber-900 text-[13px] leading-tight">{s.title}</p>
                  <p className="text-[11px] text-amber-700 font-mono mt-0.5">
                    {s.amount ? <>Value: <span className="font-bold text-amber-800">{s.amount}</span></> : null}
                    {s.amount && s.coverage ? ' · ' : null}
                    {s.coverage ? <>Coverage: <span className="font-bold text-amber-800">{s.coverage}</span></> : null}
                    {!s.amount && !s.coverage ? (s.type || 'Grant') : null}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200">Scholarships are matched dynamically based on your academic profile.</p>
            )}
          </div>
        </div>

        {/* FINANCIAL BREAKDOWN TABLE */}
        <div className="pdf-block mb-5">
          <h3 className="font-bold text-[#174f7a] mb-3 text-[13px] uppercase tracking-widest flex items-center gap-2">
            <Calculator size={15} /> Detailed Financial Breakdown
          </h3>

          <div className="grid grid-cols-2 gap-5">
            {/* Left: University Costs */}
            <div>
              <div className="bg-[#08263c] text-white px-4 py-1.5 rounded-t-xl border border-[#08263c]">
                <p className="font-bold text-[11px] uppercase tracking-wider text-center">University Costs (Year 1)</p>
              </div>
              <div className="border-x border-b border-slate-200 rounded-b-xl px-4 py-2.5 text-[13px] space-y-2">
                <div className="flex justify-between items-center"><p className="text-slate-600">Application/Registration</p><p className="font-mono font-bold text-slate-900">{appFee !== '' ? `${appFee} ${currency}` : '-'}</p></div>
                <div className="flex justify-between items-center"><p className="text-slate-600">Tuition Fee</p><p className="font-mono font-bold text-slate-900">{tuition !== '' ? `${tuition} ${currency}` : '-'}</p></div>
                <div className="flex justify-between items-center"><p className="text-slate-600">Hostel Fee</p><p className="font-mono font-bold text-slate-900">{hostel !== '' ? `${hostel} ${currency}` : '-'}</p></div>
                <div className="flex justify-between items-center"><p className="text-slate-600">Insurance</p><p className="font-mono font-bold text-slate-900">{insurance !== '' ? `${insurance} ${currency}` : '-'}</p></div>
                <div className="flex justify-between items-center"><p className="text-slate-600">Residence Permit</p><p className="font-mono font-bold text-slate-900">{residencePermit !== '' ? `${residencePermit} ${currency}` : '-'}</p></div>
                <div className="flex justify-between items-center"><p className="text-slate-600">Medical Checkup (1st yr)</p><p className="font-mono font-bold text-slate-900">{destMedical !== '' ? `${destMedical} ${currency}` : '-'}</p></div>
                {customCurrencyRows.map(c => (
                  <div key={c.id} className="flex justify-between items-center"><p className="text-slate-600">{c.label || 'Custom cost'}</p><p className="font-mono font-bold text-slate-900">{num(c.amount)} {currency}</p></div>
                ))}
                <div className="pt-2 mt-2 border-t-2 border-slate-200 flex justify-between items-center">
                  <p className="font-bold text-[#08263c]">Total Year 1 (University)</p>
                  <p className="font-mono font-black text-[#174f7a] text-[15px]">{totalCurrencyY1.toLocaleString()} {currency}</p>
                </div>
              </div>
            </div>

            {/* Right: Processing Costs */}
            <div>
              <div className="bg-[#174f7a] text-white px-4 py-1.5 rounded-t-xl border border-[#174f7a]">
                <p className="font-bold text-[11px] uppercase tracking-wider text-center">Initial Processing & Travel</p>
              </div>
              <div className="border-x border-b border-slate-200 rounded-b-xl px-4 py-2.5 text-[13px] space-y-2">
                <div className="flex justify-between items-center"><p className="text-slate-600">Exchange Rate Assumption</p><p className="font-mono font-bold text-slate-900">1 {currency} = {exchangeRate} BDT</p></div>
                <div className="flex justify-between items-center"><p className="text-slate-600">Medical Checkup (BD)</p><p className="font-mono font-bold text-slate-900">{bdMedical !== '' ? `${bdMedical} BDT` : '-'}</p></div>
                <div className="flex justify-between items-center"><p className="text-slate-600">Embassy Fee</p><p className="font-mono font-bold text-slate-900">{embassyFee !== '' ? `${embassyFee} BDT` : '-'}</p></div>
                <div className="flex justify-between items-center"><p className="text-slate-600">Air Ticket (One-way)</p><p className="font-mono font-bold text-slate-900">{airTicket !== '' ? `${airTicket} BDT` : '-'}</p></div>
                <div className="flex justify-between items-center"><p className="text-slate-600">EduExpress Service Charge</p><p className="font-mono font-bold text-slate-900">{serviceCharge !== '' ? `${serviceCharge} BDT` : '-'}</p></div>
                {customBDTRows.map(c => (
                  <div key={c.id} className="flex justify-between items-center"><p className="text-slate-600">{c.label || 'Custom cost'}</p><p className="font-mono font-bold text-slate-900">{num(c.amount)} BDT</p></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4-YEAR PROJECTION SUMMARY */}
        <div className="pdf-block bg-[#f4f8fb] rounded-2xl p-5 flex justify-between items-center border border-blue-200">
          <div className="text-center w-full">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">First-Year Required Funds</p>
            <p className="text-2xl font-black font-mono text-[#08263c] leading-none py-1">Tk {totalBDTY1.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="text-[10px] text-slate-500 mt-1 font-medium bg-white px-3 py-1 rounded-full inline-block border border-slate-200">Includes Year 1 University + Processing</p>
          </div>
          <div className="w-px h-16 bg-blue-200 mx-5" />
          <div className="text-center w-full">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><CalendarDays size={11} /> Estimated 4-Year Total</p>
            <p className="text-3xl font-black font-mono text-emerald-600 leading-none py-1">Tk {totalBDT4Years.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="text-[10px] text-slate-500 mt-1 font-medium bg-white px-3 py-1 rounded-full inline-block border border-slate-200">Projects recurring costs for remaining 3 years</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pdf-block mt-4 text-center pt-4">
          <p className="text-[11px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
            <strong>Disclaimer:</strong> This is an estimate based on standard university fees and current exchange rates. Official university invoices and embassy rules may change. Service charges apply only after successful visa issuance.
          </p>
        </div>
      </div>
      {/* ========================================= */}


      {/* ========================================= */}
      {/* INTERACTIVE WEB VIEW                       */}
      {/* ========================================= */}
      <div className="rounded-3xl border border-slate-200 bg-[#ebfcf4] overflow-hidden print:hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-2">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#08263c]">Build your 4-Year Investment Plan</h3>
            <button
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
              className="flex self-start items-center justify-center min-w-[140px] gap-2 px-4 py-2 bg-white text-[#174f7a] border border-[#174f7a]/20 rounded-full text-sm font-bold shadow-sm hover:bg-[#f4f8fb] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download PDF"
            >
              {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
              {isGeneratingPdf ? 'Generating...' : 'Save as PDF'}
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-6 max-w-3xl">
            Figures are auto-filled from {universityName || 'this university'}&rsquo;s disclosed fees. Adjust any value, add your own cost lines, and the First-Year and full 4-Year totals recalculate instantly.
          </p>

          {/* Scholarship strip */}
          {scholarships && scholarships.length > 0 && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
                <Award size={14} /> Scholarships you may reduce these costs with
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {scholarships.slice(0, 3).map((s, i) => (
                  <div key={i} className="rounded-xl bg-white border border-amber-100 p-3">
                    <p className="text-sm font-bold text-amber-900 leading-tight">{s.title}</p>
                    <p className="mt-1 font-mono text-xs text-amber-700">{s.amount || s.coverage || s.type || 'Merit-based'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* University Costs */}
            <div className="space-y-5 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
              <h4 className="font-heading font-bold text-lg text-emerald-900 mb-4 flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-700 text-xs">1</span>
                University Costs <span className="text-[10px] font-medium text-emerald-600 normal-case tracking-normal">(auto-filled)</span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Application/Registration ({currency})</label>
                  <input type="number" value={appFee} onChange={e => handleInput(e.target.value, setAppFee)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-mono font-medium text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Tuition ({currency})</label>
                  <input type="number" value={tuition} onChange={e => handleInput(e.target.value, setTuition)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-mono font-medium text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Hostel ({currency})</label>
                  <input type="number" value={hostel} onChange={e => handleInput(e.target.value, setHostel)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-mono font-medium text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Insurance ({currency})</label>
                  <input type="number" value={insurance} onChange={e => handleInput(e.target.value, setInsurance)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-mono font-medium text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Residence Permit ({currency})</label>
                  <input type="number" value={residencePermit} onChange={e => handleInput(e.target.value, setResidencePermit)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-mono font-medium text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Medical ({currency}) <span className="text-[9px] font-normal tracking-normal text-slate-400">1st Yr</span></label>
                  <input type="number" value={destMedical} onChange={e => handleInput(e.target.value, setDestMedical)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-mono font-medium text-slate-900" />
                </div>
              </div>
            </div>

            {/* Other Costs */}
            <div className="space-y-5 bg-white p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
              <h4 className="font-heading font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-blue-100 text-blue-700 text-xs">2</span>
                Other &amp; Processing Costs <span className="text-[10px] font-medium text-blue-600 normal-case tracking-normal">(auto)</span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">BD Medical (BDT)</label>
                  <input type="number" value={bdMedical} onChange={e => handleInput(e.target.value, setBdMedical)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono font-medium text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Embassy Fee (BDT)</label>
                  <input type="number" value={embassyFee} onChange={e => handleInput(e.target.value, setEmbassyFee)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono font-medium text-slate-900" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Air Ticket (BDT)</label>
                <input type="number" value={airTicket} onChange={e => handleInput(e.target.value, setAirTicket)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono font-medium text-slate-900" />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">EduExpress Service Charge, Only After VISA (BDT)</label>
                <input type="number" value={serviceCharge} onChange={e => handleInput(e.target.value, setServiceCharge)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono font-medium text-slate-900" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">BDT per {currency} Exchange Rate</label>
                <input type="number" step="0.1" value={exchangeRate} onChange={e => handleInput(e.target.value, setExchangeRate)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono font-medium text-slate-900" />
              </div>
            </div>
          </div>

          {/* Custom cost lines */}
          <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-slate-100 text-slate-700 text-xs">3</span>
                Custom Costs
              </h4>
              <button
                onClick={addCustomCost}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#174f7a] text-white text-sm font-bold hover:bg-[#08263c] transition-colors"
              >
                <Plus size={16} /> Add cost
              </button>
            </div>

            {customCosts.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No custom costs added. Use &ldquo;Add cost&rdquo; for anything extra — books, deposits, agent add-ons, etc.</p>
            ) : (
              <div className="space-y-3">
                {customCosts.map(c => (
                  <div key={c.id} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <input
                      type="text"
                      placeholder="Cost label (e.g. Book deposit)"
                      value={c.label}
                      onChange={e => updateCustomCost(c.id, { label: e.target.value })}
                      className="flex-1 h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-[#174f7a] focus:ring-2 focus:ring-[#174f7a]/20 outline-none transition-all font-medium text-slate-900"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={c.amount}
                      onChange={e => updateCustomCost(c.id, { amount: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full sm:w-32 h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-[#174f7a] focus:ring-2 focus:ring-[#174f7a]/20 outline-none transition-all font-mono font-medium text-slate-900"
                    />
                    <select
                      value={c.currency}
                      onChange={e => updateCustomCost(c.id, { currency: e.target.value as CustomCost['currency'] })}
                      className="w-full sm:w-28 h-12 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white shadow-sm focus:border-[#174f7a] outline-none transition-all font-bold text-slate-700"
                    >
                      <option value={currency}>{currency}</option>
                      <option value="BDT">BDT</option>
                    </select>
                    <button
                      onClick={() => removeCustomCost(c.id)}
                      className="grid size-12 shrink-0 place-items-center rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DUAL SUMMARY FOOTER (WEB) */}
        <div className="bg-[#050b14] text-white p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
          <div className="w-full md:w-1/2">
            <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">First-Year Required Funds</p>
            <p className="text-3xl md:text-4xl font-bold font-mono">৳{totalBDTY1.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">({totalCurrencyY1.toLocaleString()} {currency} University Cost + BDT Processing)</p>
          </div>

          <div className="hidden md:block w-px h-16 bg-slate-800 shrink-0" />
          <div className="w-full md:hidden h-px bg-slate-800" />

          <div className="w-full md:w-1/2 md:text-right">
            <p className="text-xs font-bold text-[#64b5df] mb-2 uppercase tracking-widest flex items-center md:justify-end gap-1">
              <CalendarDays size={14} /> Estimated 4-Year Total
            </p>
            <div className="flex items-center gap-4 md:justify-end">
              <p className="text-4xl md:text-5xl font-black font-mono text-emerald-400">৳{totalBDT4Years.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <button
                onClick={handleGeneratePdf}
                disabled={isGeneratingPdf}
                className="sm:hidden flex items-center justify-center size-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                title="Save as PDF"
              >
                {isGeneratingPdf ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Assumes constant exchange rates and no tuition hikes</p>
          </div>
        </div>
      </div>
    </>
  );
}
