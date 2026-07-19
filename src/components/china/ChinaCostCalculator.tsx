'use client';

import { useMemo, useState } from 'react';

const number = (value: string) => Math.max(0, Number(value) || 0);

export default function ChinaCostCalculator() {
  const [tuition, setTuition] = useState('25000');
  const [hostel, setHostel] = useState('8000');
  const [monthlyLiving, setMonthlyLiving] = useState('2500');
  const [months, setMonths] = useState('12');
  const [officialFees, setOfficialFees] = useState('3000');
  const [travel, setTravel] = useState('6000');
  const [rate, setRate] = useState('16.8');

  const totalCny = useMemo(() => number(tuition) + number(hostel) + number(monthlyLiving) * number(months) + number(officialFees) + number(travel), [tuition, hostel, monthlyLiving, months, officialFees, travel]);
  const totalBdt = totalCny * number(rate);
  const fields = [
    ['Tuition (CNY)', tuition, setTuition], ['Hostel (CNY)', hostel, setHostel], ['Monthly living (CNY)', monthlyLiving, setMonthlyLiving], ['Living months', months, setMonths], ['Insurance, medical and official fees (CNY)', officialFees, setOfficialFees], ['Flights and travel (CNY)', travel, setTravel], ['BDT per CNY assumption', rate, setRate],
  ] as const;

  return <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 md:p-10"><p className="font-bold uppercase tracking-widest text-emerald-800">Planning tool</p><h2 className="mt-2 text-3xl font-bold">Build your China first-year cost estimate</h2><p className="mt-3 max-w-2xl leading-7 text-slate-700">Enter figures from your university offer and current official requirements. The defaults are examples only—not verified fees or a quotation.</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{fields.map(([label, value, setter]) => <label key={label} className="grid gap-2 text-sm font-semibold text-slate-700">{label}<input inputMode="decimal" value={value} onChange={(event) => setter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none focus:border-emerald-600" /></label>)}</div><div className="mt-8 grid gap-4 rounded-2xl bg-slate-950 p-6 text-white sm:grid-cols-2"><div><p className="text-sm text-slate-400">Estimated first-year total</p><p className="mt-1 text-3xl font-bold">{totalCny.toLocaleString()} CNY</p></div><div><p className="text-sm text-slate-400">Using your exchange-rate assumption</p><p className="mt-1 text-3xl font-bold">৳{Math.round(totalBdt).toLocaleString()}</p></div></div><p className="mt-4 text-sm leading-6 text-slate-600">Not included unless you enter them: EduExpress charges, deposits paid to a university, refundable amounts, program-specific equipment, or personal spending. Request a ClearCost Sheet before paying.</p></section>;
}
