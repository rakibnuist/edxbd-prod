'use client';

import { useState, useEffect } from 'react';
import { Printer, CalendarDays, Wallet, Calculator, Building2, Globe, FileCheck2, Loader2 } from 'lucide-react';

type Props = {
  defaultTuition?: number;
  defaultHostel?: number;
  isChina?: boolean;
  universityName?: string;
  studyLevel?: string;
  teaching?: string;
  programs?: any[];
  scholarships?: any[];
  documents?: string[];
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
  documents
}: Props) {
  // We use CNY by default if China, else USD.
  const currency = isChina ? 'CNY' : 'USD';
  const defaultExchange = isChina ? 16.8 : 120; // Default BDT per currency

  const [tuition, setTuition] = useState<number | string>(defaultTuition);
  const [appFee, setAppFee] = useState<number | string>('');
  const [hostel, setHostel] = useState<number | string>(defaultHostel);
  const [insurance, setInsurance] = useState<number | string>(800);
  const [residencePermit, setResidencePermit] = useState<number | string>(400);
  const [destMedical, setDestMedical] = useState<number | string>(500);

  // Other Costs in BDT
  const [bdMedical, setBdMedical] = useState<number | string>(6000);
  const [embassyFee, setEmbassyFee] = useState<number | string>(5000);
  const [airTicket, setAirTicket] = useState<number | string>(45000);
  const [serviceCharge, setServiceCharge] = useState<number | string>(50000);
  const [exchangeRate, setExchangeRate] = useState<number | string>(defaultExchange);

  const [totalCurrencyY1, setTotalCurrencyY1] = useState<number>(0);
  const [totalCurrencyY2to4, setTotalCurrencyY2to4] = useState<number>(0);
  const [totalBDTY1, setTotalBDTY1] = useState<number>(0);
  const [totalBDT4Years, setTotalBDT4Years] = useState<number>(0);
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const baseTotalY1 = (Number(appFee) || 0) + (Number(tuition) || 0) + (Number(hostel) || 0) + (Number(insurance) || 0) + (Number(residencePermit) || 0) + (Number(destMedical) || 0);
    setTotalCurrencyY1(baseTotalY1);

    const recurringAnnual = (Number(tuition) || 0) + (Number(hostel) || 0) + (Number(insurance) || 0) + (Number(residencePermit) || 0);
    const baseTotalY2to4 = recurringAnnual * 3;
    setTotalCurrencyY2to4(baseTotalY2to4);

    const bdtTotalY1 = (baseTotalY1 * (Number(exchangeRate) || 0)) + (Number(bdMedical) || 0) + (Number(embassyFee) || 0) + (Number(airTicket) || 0) + (Number(serviceCharge) || 0);
    setTotalBDTY1(bdtTotalY1);

    const bdtTotal4Y = bdtTotalY1 + (baseTotalY2to4 * (Number(exchangeRate) || 0));
    setTotalBDT4Years(bdtTotal4Y);

  }, [tuition, appFee, hostel, insurance, residencePermit, destMedical, bdMedical, embassyFee, airTicket, serviceCharge, exchangeRate]);

  const handleInput = (val: string, setter: (val: number | string) => void) => {
    setter(val === '' ? '' : Number(val));
  };

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('pdf-export-container');
      
      if (element) {
        // Force the element into view but behind everything
        element.style.display = 'block';
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.zIndex = '-9999';
        element.style.width = '794px';
        
        // Wait for DOM to calculate layout
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const opt: any = {
          margin:       0.3,
          filename:     `${universityName?.replace(/\s+/g, '_') || 'University'}_4Year_Investment_Plan.pdf`,
          image:        { type: 'jpeg' as const, quality: 0.98 },
          html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            logging: true,
            scrollY: 0,
            scrollX: 0,
            windowWidth: 800
          },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(element).save();
        
        // Hide it again
        element.style.display = 'none';
      }
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      {/* ========================================= */}
      {/* HIDDEN PDF TEMPLATE (Strict 794px width for A4 matching) */}
      {/* ========================================= */}
      <div id="pdf-export-container" style={{ display: 'none' }} className="w-[794px] bg-white text-slate-900 font-sans p-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-start border-b-4 border-[#174f7a] pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#174f7a] tracking-tight mb-2 uppercase">4-Year Investment Plan</h1>
            <h2 className="text-2xl font-bold text-slate-800">{universityName || 'University Details'}</h2>
          </div>
          <div className="text-right">
            <div className="inline-block bg-[#174f7a] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              Official Estimate
            </div>
            <p className="font-black text-[#174f7a] text-xl mb-1 tracking-tight">EduExpress International</p>
            <p className="text-xs text-slate-600">House 12/1, Ground Floor, Road 4/A</p>
            <p className="text-xs text-slate-600">Dhanmondi, Dhaka 1209</p>
            <p className="text-sm font-bold mt-1 text-[#174f7a]">+880 1983-333566</p>
          </div>
        </div>

        {/* UNIVERSITY & PROGRAM PROFILE */}
        <div className="grid grid-cols-2 gap-6 mb-8 bg-[#f4f8fb] p-6 rounded-2xl border border-blue-100">
          <div>
            <h3 className="font-bold text-[#174f7a] mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
              <Building2 size={14} /> Academic Profile
            </h3>
            <div className="space-y-2 text-sm">
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
             <h3 className="font-bold text-[#174f7a] mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
               <FileCheck2 size={14} /> Required Documents
             </h3>
             <ul className="text-sm space-y-1.5 font-medium text-slate-700">
               {documents?.slice(0, 4).map((doc, i) => (
                 <li key={i} className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 bg-[#174f7a] rounded-full mt-1.5 shrink-0" />
                   {doc}
                 </li>
               )) || <li>As per assessment</li>}
               {documents && documents.length > 4 && <li className="text-slate-500 italic text-xs ml-3.5">+ {documents.length - 4} more</li>}
             </ul>
          </div>
        </div>

        {/* PROGRAMS & SCHOLARSHIPS */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="border border-slate-200 rounded-xl p-5">
            <h3 className="font-bold text-[#174f7a] border-b-2 border-slate-100 pb-2 mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} /> Highlighted Programs
            </h3>
            {programs?.slice(0, 3).map((p, i) => (
              <div key={i} className="mb-3">
                <p className="font-bold text-slate-900 text-sm leading-tight">{p.name}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Tuition: <span className="font-bold text-slate-700">{p.tuition}</span></p>
              </div>
            ))}
          </div>
          <div className="border border-emerald-100 bg-emerald-50/50 rounded-xl p-5">
            <h3 className="font-bold text-emerald-800 border-b-2 border-emerald-100 pb-2 mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
              <Wallet size={14} /> Potential Scholarships
            </h3>
            {scholarships?.slice(0, 3).map((s, i) => (
              <div key={i} className="mb-3">
                <p className="font-bold text-emerald-900 text-sm leading-tight">{s.title}</p>
                <p className="text-xs text-emerald-700 font-mono mt-0.5">Coverage: <span className="font-bold text-emerald-800">{s.amount}</span></p>
              </div>
            ))}
            {(!scholarships || scholarships.length === 0) && (
              <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-slate-200">Scholarships are matched dynamically based on your academic profile.</p>
            )}
          </div>
        </div>

        {/* FINANCIAL BREAKDOWN TABLE */}
        <div className="mb-8">
           <h3 className="font-bold text-[#174f7a] mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
             <Calculator size={16} /> Detailed Financial Breakdown
           </h3>
           
           <div className="grid grid-cols-2 gap-6">
             {/* Left Column: University Costs */}
             <div>
               <div className="bg-[#08263c] text-white px-4 py-2 rounded-t-xl border border-[#08263c]">
                 <p className="font-bold text-xs uppercase tracking-wider text-center">University Costs (Year 1)</p>
               </div>
               <div className="border-x border-b border-slate-200 rounded-b-xl px-4 py-3 text-sm space-y-2.5">
                 <div className="flex justify-between items-center"><p className="text-slate-600">Application/Registration</p><p className="font-mono font-bold text-slate-900">{appFee !== '' ? `${appFee} ${currency}` : '-'}</p></div>
                 <div className="flex justify-between items-center"><p className="text-slate-600">Tuition Fee</p><p className="font-mono font-bold text-slate-900">{tuition !== '' ? `${tuition} ${currency}` : '-'}</p></div>
                 <div className="flex justify-between items-center"><p className="text-slate-600">Hostel Fee</p><p className="font-mono font-bold text-slate-900">{hostel !== '' ? `${hostel} ${currency}` : '-'}</p></div>
                 <div className="flex justify-between items-center"><p className="text-slate-600">Insurance</p><p className="font-mono font-bold text-slate-900">{insurance !== '' ? `${insurance} ${currency}` : '-'}</p></div>
                 <div className="flex justify-between items-center"><p className="text-slate-600">Residence Permit</p><p className="font-mono font-bold text-slate-900">{residencePermit !== '' ? `${residencePermit} ${currency}` : '-'}</p></div>
                 <div className="flex justify-between items-center"><p className="text-slate-600">Medical Checkup (1st yr)</p><p className="font-mono font-bold text-slate-900">{destMedical !== '' ? `${destMedical} ${currency}` : '-'}</p></div>
                 
                 <div className="pt-3 mt-3 border-t-2 border-slate-200 flex justify-between items-center">
                   <p className="font-bold text-[#08263c]">Total Year 1 (University)</p>
                   <p className="font-mono font-black text-[#174f7a] text-base">{totalCurrencyY1.toLocaleString()} {currency}</p>
                 </div>
               </div>
             </div>

             {/* Right Column: Processing Costs */}
             <div>
               <div className="bg-[#174f7a] text-white px-4 py-2 rounded-t-xl border border-[#174f7a]">
                 <p className="font-bold text-xs uppercase tracking-wider text-center">Initial Processing & Travel</p>
               </div>
               <div className="border-x border-b border-slate-200 rounded-b-xl px-4 py-3 text-sm space-y-2.5">
                 <div className="flex justify-between items-center"><p className="text-slate-600">Exchange Rate Assumption</p><p className="font-mono font-bold text-slate-900">1 {currency} = {exchangeRate} BDT</p></div>
                 <div className="flex justify-between items-center"><p className="text-slate-600">Medical Checkup (BD)</p><p className="font-mono font-bold text-slate-900">{bdMedical !== '' ? `${bdMedical} BDT` : '-'}</p></div>
                 <div className="flex justify-between items-center"><p className="text-slate-600">Embassy Fee</p><p className="font-mono font-bold text-slate-900">{embassyFee !== '' ? `${embassyFee} BDT` : '-'}</p></div>
                 <div className="flex justify-between items-center"><p className="text-slate-600">Air Ticket (One-way)</p><p className="font-mono font-bold text-slate-900">{airTicket !== '' ? `${airTicket} BDT` : '-'}</p></div>
                 <div className="flex justify-between items-center"><p className="text-slate-600">EduExpress Service Charge</p><p className="font-mono font-bold text-slate-900">{serviceCharge !== '' ? `${serviceCharge} BDT` : '-'}</p></div>
               </div>
             </div>
           </div>
        </div>

        {/* 4-YEAR PROJECTION SUMMARY */}
        <div className="bg-[#f4f8fb] rounded-2xl p-6 flex justify-between items-center border border-blue-200">
          <div className="text-center w-full">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">First-Year Required Funds</p>
            <p className="text-3xl font-black font-mono text-[#08263c]">৳{totalBDTY1.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="text-[10px] text-slate-500 mt-1 font-medium bg-white px-3 py-1 rounded-full inline-block border border-slate-200">Includes Year 1 University + Processing</p>
          </div>
          <div className="w-px h-20 bg-blue-200 mx-6" />
          <div className="text-center w-full">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><CalendarDays size={12}/> Estimated 4-Year Total</p>
            <p className="text-4xl font-black font-mono text-emerald-600">৳{totalBDT4Years.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="text-[10px] text-slate-500 mt-1 font-medium bg-white px-3 py-1 rounded-full inline-block border border-slate-200">Projects recurring costs for remaining 3 years</p>
          </div>
        </div>

        {/* PRINT FOOTER */}
        <div className="mt-8 text-center pt-6">
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            <strong>Disclaimer:</strong> This is an estimate based on standard university fees and current exchange rates. Official university invoices and embassy rules may change. Service charges apply only after successful visa issuance.
          </p>
        </div>
      </div>
      {/* ========================================= */}


      {/* ========================================= */}
      {/* INTERACTIVE WEB VIEW */}
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
        <p className="text-sm text-slate-600 mb-8 max-w-3xl">
          Enter figures from your university offer to calculate both your initial First-Year required funds and the total 4-Year projected investment.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* University Cost & Scholarship Side */}
          <div className="space-y-5 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <h4 className="font-heading font-bold text-lg text-emerald-900 mb-4 flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-700 text-xs">1</span>
              University Costs
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

          {/* Other Costs Side */}
          <div className="space-y-5 bg-white p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
            <h4 className="font-heading font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-blue-100 text-blue-700 text-xs">2</span>
              Other & Processing Costs
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
        </div>

        {/* DUAL SUMMARY FOOTER (WEB ONLY) */}
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
