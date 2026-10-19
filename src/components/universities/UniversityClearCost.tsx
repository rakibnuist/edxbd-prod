'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { ArrowRight, Calculator, Printer, RotateCcw } from 'lucide-react';
import { applyScholarshipFeeWaivers, BEFORE_CHINA_FIELDS, buildCostPrefills, buildProgramCostPrefills, calculateClearCost, convertCostTotalsToBdt, COST_CURRENCIES, COST_LABELS, emptyCostValues, IN_CHINA_FIELDS, parseServicePackagePrice, readCostNumber, scholarshipScenarioReduction, servicePackageSelection, type CostCurrency, type CostCurrencyTotals, type CostField, type CostScenario, type ScholarshipCostScenario, type TuitionPeriod } from '@/lib/clear-cost';
import type { UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';

type Program = { name: string; level: string; tuition?: string; tuitionAfterScholarship?: string; sourceUrl?: string };
type Fee = { item: string; cost: string; recipient?: string; sourceUrl?: string };
type CostPlan = {
  id: string; title: string; programName?: string; scholarshipTitle?: string; currency: string;
  tuitionBeforeScholarship?: string; scholarshipValue?: string; tuitionAfterScholarship?: string;
  applicationFee?: string; hostel?: string; insurance?: string; medical?: string; visa?: string;
  travel?: string; living?: string; serviceFee?: string; otherCosts: string[]; totalEstimate?: string;
  notes: string[]; sourceUrl?: string; lastVerifiedAt?: string; isPublished: boolean;
};
type Props = {
  university: { name: string; slug: string; city: string; country: string; logo?: string };
  programs: Program[];
  programDetails?: UniversityProgramDetail[];
  hideProgramPicker?: boolean;
  servicePackages?: { title: string; priceLabel: string; summary?: string }[];
  scholarshipScenario?: ScholarshipCostScenario;
  scholarshipOptions?: UniversityScholarshipOption[];
  selectedScholarshipId?: string;
  onScholarshipChange?: (option: UniversityScholarshipOption | null) => void;
  fees: Fee[];
  scholarships: { title: string; eligiblePrograms: string[]; status: 'active' | 'planned' | 'closed'; sourceUrl?: string }[];
  costPlans: CostPlan[];
  assessmentHref: string;
};
const formatAmount = (amount: number, currency: string) => `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amount)} ${currency}`;
const formatTotals = (totals: CostCurrencyTotals) => Object.entries(totals).map(([currency, amount]) => formatAmount(amount!, currency)).join(' + ');
const periodLabel = (period?: string) => ({ programme: 'for the programme', semester: 'per semester', year: 'per year', monthly: 'per month', month: 'per month', day: 'per day', oneoff: 'one-time' })[period || ''] || '';
const inputClass = 'mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#174f7a] focus:ring-2 focus:ring-[#174f7a]/10';

export default function UniversityClearCost(props: Props) {
  return <UniversityCostPicker key={props.university.slug} {...props} />;
}

function UniversityCostPicker(props: Props) {
  const programs: Program[] = props.programDetails?.length
    ? props.programDetails.map(detail => ({ name: detail.name, level: detail.level }))
    : props.programs.length ? props.programs : [{ name: 'My study option', level: 'Program' }];
  const [programIndex, setProgramIndex] = useState(0);
  const activeProgramIndex = programIndex < programs.length ? programIndex : 0;
  const program = programs[activeProgramIndex];
  const detail = props.programDetails?.[activeProgramIndex];
  const recordedCurrency = props.programs[0]?.tuition?.match(/\b(CNY|BDT|USD|EUR|GBP)\b/i)?.[1].toUpperCase() as CostCurrency | undefined;
  const [currency, setCurrency] = useState<CostCurrency>(props.university.country.toLowerCase() === 'china' ? 'CNY' : recordedCurrency || 'USD');
  const selectedScholarshipId = props.selectedScholarshipId ?? props.scholarshipScenario?.id ?? '';
  const selectedScholarship = props.scholarshipOptions?.find(option => option.id === selectedScholarshipId);
  const id = useId();
  return <section id="costs" className="clearcost-calculator scroll-mt-36">
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="clearcost-no-print border-b border-slate-200 p-5 sm:p-7">
        <h2 className="flex items-center gap-2.5 text-xl font-semibold text-[#102b40]"><Calculator size={21} className="text-[#174f7a]" />ClearCost calculator</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">See what you pay before travelling and after arriving in China.</p>
        <div className={`mt-5 grid gap-4 ${props.hideProgramPicker ? 'max-w-[120px]' : 'sm:grid-cols-[1fr_120px]'}`}>
          {!props.hideProgramPicker && <label htmlFor={`${id}-program`} className="text-xs font-semibold text-slate-600">Choose your program<select id={`${id}-program`} value={activeProgramIndex} onChange={event => setProgramIndex(Number(event.target.value))} className={inputClass}>{programs.map((item, index) => <option key={`${index}-${item.name}`} value={index}>{item.level} · {item.name}</option>)}</select></label>}
          <label htmlFor={`${id}-currency`} className="text-xs font-semibold text-slate-600">Currency<select id={`${id}-currency`} value={currency} onChange={event => setCurrency(event.target.value as CostCurrency)} className={inputClass}>{COST_CURRENCIES.map(item => <option key={item}>{item}</option>)}</select></label>
        </div>
        {detail?.duration && <p className="mt-3 text-xs text-slate-500">{detail.duration}</p>}
        {!!props.scholarshipOptions?.length && <div className="mt-5 border-t border-slate-100 pt-5">
          <label htmlFor={`${id}-scholarship`} className="block text-xs font-semibold text-slate-600">Scholarship option<select id={`${id}-scholarship`} value={selectedScholarshipId} onChange={event => props.onScholarshipChange?.(props.scholarshipOptions?.find(option => option.id === event.target.value) || null)} className={inputClass}><option value="">Self-funded · no scholarship selected</option>{props.scholarshipOptions.map(option => <option key={option.id} value={option.id}>{option.title}</option>)}</select></label>
          {selectedScholarship ? <div className="mt-3 text-xs leading-6 text-slate-500">
            <p>{props.scholarshipScenario ? 'The selected award is included as a planning scenario. Confirm your eligibility and award before relying on a reduction.' : 'Enter only the payable amounts and tuition reduction confirmed in your scholarship award.'}</p>
            <details className="mt-2"><summary className="cursor-pointer font-semibold text-[#174f7a]">Coverage & scholarship conditions</summary><dl className="mt-3 space-y-3 rounded-lg bg-slate-50 p-4">{selectedScholarship.coverage.length > 0 && <div><dt className="font-semibold text-slate-700">Coverage</dt><dd>{selectedScholarship.coverage.join(' ')}</dd></div>}{selectedScholarship.conditions.length > 0 && <div><dt className="font-semibold text-slate-700">Conditions</dt><dd>{selectedScholarship.conditions.join(' ')}</dd></div>}{selectedScholarship.renewal.length > 0 && <div><dt className="font-semibold text-slate-700">Renewal</dt><dd>{selectedScholarship.renewal.join(' ')}</dd></div>}</dl></details>
          </div> : <p className="mt-2 text-xs leading-6 text-slate-500">Compare the listed awards, or use the full tuition fee for a self-funded plan.</p>}
        </div>}
      </div>
      <CostCalculator key={`${props.university.slug}-${detail?.id || `${program.level}:${program.name}`}-${currency}-${selectedScholarshipId || 'self-funded'}`} {...props} program={program} programDetail={detail} currency={currency} />
    </div>
    <style jsx global>{`
      @media print {
        body * { visibility: hidden; }
        body *:has(.clearcost-calculator) { display: contents !important; }
        body *:not(.clearcost-calculator):not(.clearcost-calculator *):not(:has(.clearcost-calculator)) { display: none !important; }
        .clearcost-calculator, .clearcost-calculator * { visibility: visible; }
        .clearcost-calculator { position: absolute; inset: 0 auto auto 0; width: 100%; padding: 0; background: white; }
        .clearcost-calculator .clearcost-no-print { display: none !important; }
        .clearcost-calculator .clearcost-print-only { display: block !important; }
        .clearcost-calculator > div { border: 0; border-radius: 0; box-shadow: none; }
        .clearcost-calculator aside { position: static; break-inside: avoid; background: white !important; border: 1px solid #cbd5e1; }
      }
    `}</style>
  </section>;
}

function CostCalculator({ university, program, programDetail, currency, fees, costPlans, servicePackages = [], scholarshipScenario, assessmentHref }: Props & { program: Program; programDetail?: UniversityProgramDetail; currency: CostCurrency }) {
  const cmsProgram = programDetail ? { name: program.name } : program;
  const prefills = { ...buildCostPrefills(cmsProgram, currency, programDetail ? [] : fees, programDetail ? [] : costPlans), ...buildProgramCostPrefills(programDetail, currency) };
  const recordedTuitionPeriod = prefills.tuition?.period || programDetail?.fees.find(fee => fee.key === 'tuition' && !fee.optional)?.period;
  const initialTuitionPeriod: TuitionPeriod = recordedTuitionPeriod === 'semester' || recordedTuitionPeriod === 'programme' ? recordedTuitionPeriod : 'year';
  const selectedReduction = scholarshipScenarioReduction(scholarshipScenario, currency, initialTuitionPeriod);
  const createScenario = (): CostScenario => ({
    values: applyScholarshipFeeWaivers({ ...emptyCostValues(), ...Object.fromEntries(Object.entries(prefills).map(([field, prefill]) => [field, prefill.value])) }, scholarshipScenario?.feeWaivers),
    currency, serviceCurrency: currency,
    scholarshipType: selectedReduction?.type || 'fixed', scholarship: selectedReduction?.value || '0', tuitionPeriod: initialTuitionPeriod,
    housingPeriod: scholarshipScenario?.feeWaivers?.includes('housing') ? 'programme' : prefills.housing?.period === 'monthly' ? 'monthly' : prefills.housing?.period === 'semester' ? 'semester' : prefills.housing?.period === 'programme' || prefills.housing?.period === 'oneoff' ? 'programme' : 'year',
    housingMonths: '', housingDays: '', depositRequired: !!prefills.deposit, depositCreditedToTuition: false, otherCostsApply: !!prefills.other,
  });
  const [scenario, setScenario] = useState<CostScenario>(createScenario);
  const [edited, setEdited] = useState<CostField[]>([]);
  const [packageIndex, setPackageIndex] = useState('');
  const [housingIndex, setHousingIndex] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const id = useId();
  const result = calculateClearCost(scenario);
  const converted = currency === 'BDT' ? null : convertCostTotalsToBdt(result.currencyTotals, currency, exchangeRate);
  const exchangeValue = readCostNumber(exchangeRate);
  const exchangeError = exchangeRate !== '' && (exchangeValue.status !== 'valid' || exchangeValue.value <= 0);
  const selectedPackage = packageIndex === '' ? undefined : servicePackages[Number(packageIndex)];
  const packagePrice = parseServicePackagePrice(selectedPackage?.priceLabel);
  const serviceCurrency = scenario.serviceCurrency || currency;
  const hasSeparatePackage = serviceCurrency !== currency && result.entries.service !== undefined;
  const housingChoices = programDetail?.fees.filter(fee => fee.key === 'housing' && fee.currency.toUpperCase() === currency && fee.amount !== undefined) || [];
  const update = (field: CostField, value: string) => {
    setScenario(current => ({ ...current, values: { ...current.values, [field]: value } }));
    setEdited(current => current.includes(field) ? current : [...current, field]);
  };
  const reset = () => { setScenario(createScenario()); setEdited([]); setPackageIndex(''); setHousingIndex(''); setExchangeRate(''); };
  const selectPackage = (index: string) => {
    const selection = servicePackageSelection(index === '' ? undefined : servicePackages[Number(index)]?.priceLabel, currency);
    setPackageIndex(index);
    setScenario(current => ({ ...current, serviceCurrency: selection.currency, values: { ...current.values, service: selection.value } }));
    setEdited(current => current.includes('service') ? current : [...current, 'service']);
  };
  const field = (name: CostField, helper?: string) => {
    const invalid = readCostNumber(scenario.values[name]).status === 'invalid';
    const covered = (name === 'housing' || name === 'insurance') && scholarshipScenario?.feeWaivers?.includes(name);
    const recorded = !edited.includes(name) ? covered ? 'Covered by the selected scholarship. Edit if your award letter states a different payable amount.' : prefills[name]?.recorded : undefined;
    const help = invalid ? 'Enter a valid amount of zero or more.' : [recorded, helper].filter(Boolean).join(' ');
    return <div key={name}>
      <label htmlFor={`${id}-${name}`} className="block text-xs font-semibold text-slate-600">{COST_LABELS[name]}
        <span className="relative mt-2 block"><input id={`${id}-${name}`} type="number" inputMode="decimal" min="0" max="1000000000000" step="0.01" value={scenario.values[name]} placeholder="Enter amount" aria-invalid={invalid} aria-describedby={`${id}-${name}-help`} onChange={event => update(name, event.target.value)} className={`${inputClass} mt-0 pr-14 ${invalid ? 'border-red-500' : ''}`} /><span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] font-medium text-slate-500">{name === 'service' ? serviceCurrency : currency}</span></span>
      </label>
      {help.length > 160 && !invalid ? <details id={`${id}-${name}-help`} className="mt-1.5 text-[11px] leading-5 text-slate-500"><summary className="cursor-pointer font-medium">Fee conditions</summary><p className="mt-1.5">{help}</p></details> : <p id={`${id}-${name}-help`} className={`mt-1.5 text-[11px] leading-5 ${invalid ? 'text-red-600' : 'text-slate-500'}`}>{help}</p>}
    </div>;
  };
  const subtotal = (label: string, amount: string) => <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm"><span className="font-medium text-slate-600">{label}</span><strong className="text-right font-semibold text-[#102b40]">{amount}</strong></div>;
  const summaryRows = (fields: CostField[]) => fields.map(name => {
    const optional = (name === 'deposit' && !scenario.depositRequired) || (name === 'other' && !scenario.otherCostsApply);
    if (optional) return null;
    return <div key={name} className="flex items-start justify-between gap-4 py-1.5 text-xs"><span className="text-slate-500">{name === 'tuition' ? `Tuition balance · ${periodLabel(scenario.tuitionPeriod)}` : name === 'housing' && scenario.housingPeriod === 'monthly' ? `Accommodation · ${scenario.housingMonths || '?'} months` : name === 'housing' && scenario.housingPeriod === 'daily' ? `Accommodation · ${scenario.housingDays || '?'} days` : COST_LABELS[name]}{name === 'service' && selectedPackage && <span className="mt-0.5 block text-[10px] leading-4">{selectedPackage.title}</span>}</span><span className="text-right font-medium text-slate-800">{result.entries[name] === undefined ? name === 'service' && selectedPackage ? 'Quote required' : 'Not entered' : formatAmount(result.entries[name]!, name === 'service' ? serviceCurrency : currency)}</span></div>;
  });

  return <div className="grid items-start gap-7 p-5 sm:p-7 xl:grid-cols-[minmax(0,1fr)_290px]">
    <div className="clearcost-no-print space-y-7">
      <fieldset>
        <legend className="mb-4 flex items-center gap-3 text-base font-semibold text-[#102b40]"><span className="grid size-7 place-items-center rounded-full bg-[#edf4f9] text-xs text-[#174f7a]">1</span>Before China</legend>
        <div className="grid gap-4 sm:grid-cols-2">{field('application')}
          <div><label htmlFor={`${id}-deposit-required`} className="flex min-h-6 items-center gap-2 text-xs font-semibold text-slate-600"><input id={`${id}-deposit-required`} type="checkbox" checked={scenario.depositRequired} onChange={event => setScenario(current => ({ ...current, depositRequired: event.target.checked }))} className="size-4 accent-[#174f7a]" />Deposit required</label>{scenario.depositRequired ? <div className="mt-3">{field('deposit')}<label htmlFor={`${id}-deposit-credit`} className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-slate-500"><input id={`${id}-deposit-credit`} type="checkbox" checked={scenario.depositCreditedToTuition} onChange={event => setScenario(current => ({ ...current, depositCreditedToTuition: event.target.checked }))} className="mt-0.5 size-4 shrink-0 accent-[#174f7a]" />This deposit is credited toward tuition</label></div> : <p className="mt-3 text-xs text-slate-500">No deposit included.</p>}</div>
        </div>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
          {servicePackages.length > 0 && <label htmlFor={`${id}-package`} className="block text-xs font-semibold text-slate-600">Select an EduExpress Package<select id={`${id}-package`} value={packageIndex} onChange={event => selectPackage(event.target.value)} className={inputClass}><option value="">Enter agreed package fee</option>{servicePackages.map((item, index) => <option key={`${item.title}-${index}`} value={index}>{item.title}{item.priceLabel ? ` · ${item.priceLabel}` : ''}</option>)}</select></label>}
          {selectedPackage?.summary && <p className="mt-2 text-xs leading-5 text-slate-500">{selectedPackage.summary}</p>}
          <div className={`grid gap-4 sm:grid-cols-[minmax(0,1fr)_110px] ${servicePackages.length ? 'mt-4' : ''}`}>{field('service', packagePrice ? 'The selected package price is included automatically. Edit only for an agreed quote.' : selectedPackage ? 'Enter your written package quote to complete the estimate.' : 'Enter the agreed package fee.')}<label htmlFor={`${id}-package-currency`} className="text-xs font-semibold text-slate-600">Package currency<select id={`${id}-package-currency`} value={serviceCurrency} onChange={event => setScenario(current => ({ ...current, serviceCurrency: event.target.value as CostCurrency, values: { ...current.values, service: '' } }))} className={inputClass}>{COST_CURRENCIES.map(item => <option key={item}>{item}</option>)}</select></label></div>
          {serviceCurrency !== currency && <p className="mt-2 text-[11px] leading-5 text-slate-500">The package stays in {serviceCurrency}. {serviceCurrency === 'BDT' ? 'Add a BDT exchange rate in your cost breakdown to combine the totals.' : 'Amounts in different currencies are shown separately.'}</p>}
          <p className="mt-2 text-[11px] leading-5 text-slate-500">Payable after China visa approval, before departure.</p>
        </div>
        {subtotal('Before China subtotal', formatTotals(result.beforeCurrencyTotals))}
      </fieldset>

      <fieldset className="border-t border-slate-200 pt-7">
        <legend className="mb-4 flex items-center gap-3 pt-7 text-base font-semibold text-[#102b40]"><span className="grid size-7 place-items-center rounded-full bg-[#edf4f9] text-xs text-[#174f7a]">2</span>In China</legend>
        <div className="grid gap-4 sm:grid-cols-2">{field('tuition', result.tuitionWaivedWithoutGross ? '100% tuition waiver: the gross fee is not needed for this estimate.' : 'Full fee before any tuition reduction.')}
          <label htmlFor={`${id}-tuition-period`} className="text-xs font-semibold text-slate-600">Tuition period<select id={`${id}-tuition-period`} value={scenario.tuitionPeriod} onChange={event => { setScenario(current => ({ ...current, tuitionPeriod: event.target.value as TuitionPeriod, scholarship: '0', values: { ...current.values, tuition: '' } })); setEdited(current => [...current, 'tuition']); }} className={inputClass}><option value="year">One year</option><option value="semester">One semester</option><option value="programme">Full programme</option></select><span className="mt-1.5 block text-[11px] font-normal leading-5 text-slate-500">The entered tuition is used once.</span></label>
        </div>
        <div className="mt-3 grid gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
          {scholarshipScenario && <div className="text-xs leading-5 text-slate-600 sm:col-span-2"><p className="font-semibold text-[#102b40]">{scholarshipScenario.title}</p><p className="mt-1">{selectedReduction ? 'This estimate applies the selected scholarship tuition reduction and any explicitly covered accommodation or insurance. Eligibility and the final award remain subject to the scholarship conditions.' : 'Enter a reduction that matches this currency and study period. No fixed reduction has been converted automatically.'}</p></div>}
          <label htmlFor={`${id}-reduction-type`} className="text-xs font-semibold text-slate-600">Tuition reduction<select id={`${id}-reduction-type`} value={scenario.scholarshipType} onChange={event => setScenario(current => ({ ...current, scholarshipType: event.target.value as 'fixed' | 'percent', scholarship: '0' }))} className={inputClass}><option value="fixed">Amount ({currency})</option><option value="percent">Percentage (%)</option></select></label>
          <label htmlFor={`${id}-reduction`} className="text-xs font-semibold text-slate-600">Reduction {scenario.scholarshipType === 'percent' ? '(%)' : `(${currency})`}<input id={`${id}-reduction`} type="number" min="0" max="1000000000000" step="0.01" value={scenario.scholarship} aria-invalid={readCostNumber(scenario.scholarship).status === 'invalid'} onChange={event => setScenario(current => ({ ...current, scholarship: event.target.value }))} className={inputClass} /></label>
          <p className="text-[11px] leading-5 text-slate-500 sm:col-span-2">Enter a confirmed reduction, or keep zero.</p>
        </div>
        {result.scholarshipCapped && <p role="status" className="mt-2 text-xs text-amber-700">The reduction is capped at the tuition fee.</p>}
        {(housingChoices.length > 1 || housingChoices.some(fee => fee.period === 'day' || fee.optional)) && <label htmlFor={`${id}-housing-choice`} className="mt-5 block text-xs font-semibold text-slate-600">Accommodation option<select id={`${id}-housing-choice`} value={housingIndex} onChange={event => { const choice = housingChoices[Number(event.target.value)]; setHousingIndex(event.target.value); if (event.target.value === '' || !choice) { update('housing', ''); return; } update('housing', String(choice.amount)); setScenario(current => ({ ...current, housingPeriod: choice.period === 'month' ? 'monthly' : choice.period === 'day' ? 'daily' : choice.period === 'oneoff' ? 'programme' : choice.period })); }} className={inputClass}><option value="">Choose a room or enter your own fee</option>{housingChoices.map((fee, index) => <option key={`${fee.item}-${index}`} value={index}>{fee.item} · {formatAmount(fee.amount!, currency)} {periodLabel(fee.period)}</option>)}</select></label>}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">{field('housing')}
          <label htmlFor={`${id}-housing-period`} className="text-xs font-semibold text-slate-600">Accommodation period<select id={`${id}-housing-period`} value={scenario.housingPeriod} onChange={event => { setScenario(current => ({ ...current, housingPeriod: event.target.value as CostScenario['housingPeriod'], values: { ...current.values, housing: '' } })); setHousingIndex(''); setEdited(current => [...current, 'housing']); }} className={inputClass}><option value="year">One year</option><option value="semester">One semester</option><option value="programme">Full programme</option><option value="monthly">Monthly × months</option><option value="daily">Daily × days</option></select></label>
          {scenario.housingPeriod === 'monthly' && <label htmlFor={`${id}-housing-months`} className="text-xs font-semibold text-slate-600">Accommodation months<input id={`${id}-housing-months`} type="number" min="1" max="120" step="1" value={scenario.housingMonths} onChange={event => setScenario(current => ({ ...current, housingMonths: event.target.value }))} placeholder="Enter months" className={inputClass} /></label>}
          {scenario.housingPeriod === 'daily' && <label htmlFor={`${id}-housing-days`} className="text-xs font-semibold text-slate-600">Accommodation days<input id={`${id}-housing-days`} type="number" min="1" max="4000" step="1" value={scenario.housingDays || ''} onChange={event => setScenario(current => ({ ...current, housingDays: event.target.value }))} placeholder="Enter days" className={inputClass} /></label>}
          {field('insurance')}{field('medical')}{field('residence')}
        </div>
        <div className="mt-4"><label htmlFor={`${id}-other-required`} className="flex items-center gap-2 text-xs font-semibold text-slate-600"><input id={`${id}-other-required`} type="checkbox" checked={scenario.otherCostsApply} onChange={event => setScenario(current => ({ ...current, otherCostsApply: event.target.checked }))} className="size-4 accent-[#174f7a]" />Include other costs</label>{scenario.otherCostsApply && <div className="mt-4">{field('other', 'For example, utilities, books and personal living expenses.')}</div>}</div>
        {subtotal('In China subtotal', formatAmount(result.inChinaTotal, currency))}
      </fieldset>
      <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-4"><button type="button" onClick={reset} className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#174f7a]"><RotateCcw size={14} />Reset amounts</button><p className="text-[11px] leading-5 text-slate-500">Changing program or currency starts a new estimate.</p></div>
    </div>

    <aside className="rounded-xl border border-slate-200 bg-[#f7f9fb] p-5 xl:sticky xl:top-[184px]">
      <div className="clearcost-print-only mb-5 hidden border-b border-slate-200 pb-4"><h2 className="text-xl font-semibold">EduExpress ClearCost</h2><p className="mt-2 text-sm">{university.name}</p><p className="mt-1 text-xs">{program.level} · {program.name}</p></div>
      <h3 className="text-sm font-semibold text-[#102b40]">Your cost breakdown</h3>
      <div className="mt-5"><h4 className="mb-1 text-xs font-semibold text-[#174f7a]">Before China</h4>{summaryRows(BEFORE_CHINA_FIELDS)}<div className="mt-2 flex justify-between gap-3 border-t border-slate-200 pt-3 text-sm font-semibold text-[#102b40]"><span>Subtotal</span><span className="text-right">{formatTotals(result.beforeCurrencyTotals)}</span></div></div>
      <div className="mt-5"><h4 className="mb-1 text-xs font-semibold text-[#174f7a]">In China</h4>{summaryRows(IN_CHINA_FIELDS)}<div className="mt-2 flex justify-between gap-3 border-t border-slate-200 pt-3 text-sm font-semibold text-[#102b40]"><span>Subtotal</span><span>{formatAmount(result.inChinaTotal, currency)}</span></div></div>
      {result.depositCredit > 0 && <p className="mt-4 text-[11px] leading-5 text-slate-500">{formatAmount(result.depositCredit, currency)} of your deposit is deducted from the tuition balance.</p>}
      {result.depositExceedsTuition && <p role="status" className="mt-3 text-[11px] leading-5 text-amber-700">Your deposit exceeds the tuition balance. Confirm how the excess will be credited or refunded.</p>}
      <div className="mt-5 border-t border-slate-200 pt-5" aria-live="polite" aria-atomic="true"><p className="text-xs font-medium text-slate-500">{!result.isComplete ? 'Entered amounts subtotal' : hasSeparatePackage && converted === null ? 'Cash estimate by currency' : 'Combined cash estimate'}</p><strong className={`mt-1 block font-semibold tracking-tight text-[#102b40] ${hasSeparatePackage && converted === null ? 'text-xl' : 'text-2xl'}`}>{hasSeparatePackage && converted !== null ? formatAmount(converted, 'BDT') : formatTotals(result.currencyTotals)}</strong>{hasSeparatePackage && converted !== null && <p className="mt-2 text-[11px] leading-5 text-slate-500">{formatTotals(result.currencyTotals)}</p>}<p className="mt-2 text-[11px] leading-5 text-slate-500">{result.isComplete ? 'All required items entered.' : `${result.missing.length + result.invalid.length} ${result.missing.length + result.invalid.length === 1 ? 'item still needs' : 'items still need'} an amount.`}</p></div>
      {!result.isComplete && <details className="clearcost-no-print mt-3 text-[11px] leading-5 text-slate-500"><summary className="cursor-pointer font-medium">View incomplete items</summary><p className="mt-2">{result.missing.length > 0 && `Enter: ${result.missing.join(', ')}.`} {result.invalid.length > 0 && `Check: ${result.invalid.join(', ')}.`}</p></details>}
      {currency !== 'BDT' && <div className="clearcost-no-print mt-5 border-t border-slate-200 pt-5"><label htmlFor={`${id}-exchange`} className="text-xs font-medium text-slate-600">Optional BDT conversion<input id={`${id}-exchange`} type="number" inputMode="decimal" min="0.000001" max="1000000000000" step="any" value={exchangeRate} placeholder={`1 ${currency} = ? BDT`} aria-invalid={exchangeError} onChange={event => setExchangeRate(event.target.value)} className={inputClass} /></label>{converted !== null && !hasSeparatePackage && <p className="mt-3 text-base font-semibold text-[#102b40]">{formatAmount(converted, 'BDT')}</p>}{hasSeparatePackage && serviceCurrency === 'BDT' && <p className="mt-2 text-[11px] leading-5 text-slate-500">University costs are converted at your rate. The package is added once in BDT.</p>}{exchangeError && <p role="status" className="mt-2 text-[11px] text-red-600">Enter a rate greater than zero.</p>}</div>}
      {converted !== null && <p className="clearcost-print-only mt-4 hidden text-xs">BDT equivalent: {formatAmount(converted, 'BDT')} at 1 {currency} = {exchangeRate} BDT.</p>}
      <p className="mt-5 text-[11px] leading-5 text-slate-500">An editable planning estimate for the entered study period. Travel and personal expenses are included only if you add them to other costs.</p>
      <button type="button" onClick={() => window.print()} className="clearcost-no-print mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-[#174f7a]"><Printer size={15} />Print / save PDF</button>
      <Link href={assessmentHref} className="clearcost-no-print mt-3 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#174f7a] px-3 py-3 text-center text-xs font-semibold text-white">Apply with EduExpress International<ArrowRight size={14} className="shrink-0" /></Link>
    </aside>
  </div>;
}
