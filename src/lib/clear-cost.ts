export const COST_CURRENCIES = ['CNY', 'BDT', 'USD', 'EUR', 'GBP'] as const;
export type CostCurrency = typeof COST_CURRENCIES[number];
export type CostField = 'application' | 'deposit' | 'service' | 'tuition' | 'housing' | 'insurance' | 'medical' | 'residence' | 'other';
export type CostValues = Record<CostField, string>;
export type TuitionPeriod = 'programme' | 'semester' | 'year';
export type ScholarshipCostScenario = { id: string; title: string; type: 'percent' | 'fixed'; value: number; currency?: string; period?: TuitionPeriod; feeWaivers?: ('housing' | 'insurance')[] };
export type CostScenario = {
  values: CostValues;
  currency?: CostCurrency;
  serviceCurrency?: CostCurrency;
  scholarshipType: 'fixed' | 'percent';
  scholarship: string;
  tuitionPeriod: TuitionPeriod;
  housingPeriod: 'programme' | 'semester' | 'year' | 'monthly' | 'daily';
  housingMonths: string;
  housingDays?: string;
  depositRequired: boolean;
  depositCreditedToTuition: boolean;
  depositCreditedToHousing?: boolean;
  otherCostsApply: boolean;
};
export type CostCurrencyTotals = Partial<Record<CostCurrency, number>>;
export type CostPrefills = Partial<Record<CostField, { value: string; sourceUrl: string; recorded: string; period?: TuitionPeriod | 'monthly' | 'oneoff' }>>;
type SourceProgram = { name: string; tuition?: string; sourceUrl?: string };
type SourceFee = { item: string; cost: string; sourceUrl?: string };
type SourcePlan = {
  programName?: string; scholarshipTitle?: string; currency: string; isPublished: boolean; sourceUrl?: string; lastVerifiedAt?: string;
  tuitionBeforeScholarship?: string; hostel?: string; insurance?: string; applicationFee?: string; medical?: string; serviceFee?: string;
};

export const COST_LABELS: Record<CostField, string> = {
  application: 'Application fee', deposit: 'Deposit', service: 'EduExpress Package',
  tuition: 'Tuition fee', housing: 'Accommodation', insurance: 'Insurance',
  medical: 'Medical examination', residence: 'Residence permit', other: 'Other costs',
};
export const BEFORE_CHINA_FIELDS: CostField[] = ['application', 'deposit', 'service'];
export const IN_CHINA_FIELDS: CostField[] = ['tuition', 'housing', 'insurance', 'medical', 'residence', 'other'];
export const COST_FIELDS = [...BEFORE_CHINA_FIELDS, ...IN_CHINA_FIELDS];

type NumericValue = { status: 'valid'; value: number } | { status: 'missing' | 'invalid'; value: null };
export function readCostNumber(raw: string): NumericValue {
  if (!raw.trim()) return { status: 'missing', value: null };
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw.trim())) return { status: 'invalid', value: null };
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 && value <= 1_000_000_000_000 ? { status: 'valid', value } : { status: 'invalid', value: null };
}

/** Package prices can use either international or South Asian digit grouping. */
export function parseServicePackagePrice(raw: string | undefined): { amount: number; currency: CostCurrency } | null {
  if (!raw?.trim() || /\b(?:from|starting|approx|estimate|about|up to|or|to|quote)\b|[%\-–—]/i.test(raw)) return null;
  const currencies = raw.match(/\b(?:CNY|RMB|BDT|USD|EUR|GBP)\b/gi) || [];
  const amounts = raw.match(/\d[\d,]*(?:\.\d+)?/g) || [];
  if (currencies.length !== 1 || amounts.length !== 1 || !/^(?:\d+(?:\.\d+)?|\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d{1,2}(?:,\d{2})*,\d{3}(?:\.\d+)?)$/.test(amounts[0])) return null;
  const amount = Number(amounts[0].replaceAll(',', ''));
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000_000_000) return null;
  return { amount, currency: currencies[0].toUpperCase().replace('RMB', 'CNY') as CostCurrency };
}

export function servicePackageSelection(priceLabel: string | undefined, fallbackCurrency: CostCurrency) {
  const price = parseServicePackagePrice(priceLabel);
  return { value: price ? String(price.amount) : '', currency: price?.currency || fallbackCurrency };
}

export function scholarshipScenarioReduction(scenario: ScholarshipCostScenario | undefined, currency: CostCurrency, period: TuitionPeriod): { type: 'percent' | 'fixed'; value: string } | null {
  if (!scenario || !Number.isFinite(scenario.value) || scenario.value < 0 || scenario.value > 1_000_000_000_000) return null;
  if (scenario.type === 'fixed' && (scenario.currency?.toUpperCase() !== currency || scenario.period !== period)) return null;
  return { type: scenario.type, value: String(scenario.value) };
}

/** Only explicitly covered charges are waived; allowances never reduce cash charges. */
export function applyScholarshipFeeWaivers(values: CostValues, feeWaivers: ScholarshipCostScenario['feeWaivers']): CostValues {
  const next = { ...values };
  for (const field of feeWaivers || []) {
    if (field === 'housing' || field === 'insurance') next[field] = '0';
  }
  return next;
}

/** Parse an explicit fee without guessing ranges, discounts, currency or billing period. */
export function parseSourceFee(raw: string | undefined, currency: CostCurrency, period: 'annual' | 'monthly' | 'oneoff' | 'programme' | 'semester' | 'year'): number | null {
  const text = raw?.replace(/\b(?:non-refundable|one-time)\b/gi, phrase => phrase.replace('-', ' '));
  if (!text?.trim() || /scholarship|waiv|discount|free|\bfrom\b|starting|approx|estimat|\babout\b|\bup to\b|\bor\b|\bto\b|%|[-–—]/i.test(text)) return null;
  const currencies = text.match(/\b(?:CNY|RMB|BDT|USD|EUR|GBP|JPY|HKD|AUD|CAD)\b/gi) || [];
  if (currencies.length !== 1 || currencies[0].toUpperCase().replace('RMB', 'CNY') !== currency) return null;
  const amounts = text.match(/\d[\d,]*(?:\.\d+)?/g) || [];
  if (amounts.length !== 1 || !/^\d{1,3}(?:,\d{3})*(?:\.\d+)?$|^\d+(?:\.\d+)?$/.test(amounts[0])) return null;
  const annual = /(?:\/\s*|per\s+)(?:academic\s+)?year\b|\bannual(?:ly)?\b|\byearly\b/i.test(text);
  const monthly = /(?:\/\s*|per\s+)month\b|\bmonthly\b/i.test(text);
  const semester = /(?:\/\s*|per\s+)semester\b|\bsemester fee\b/i.test(text);
  const programme = /(?:\/\s*|per\s+)(?:programme|program|course)\b|\b(?:full|whole|complete) (?:programme|program|course)\b/i.test(text);
  if (/week|day|term/i.test(text) || [annual, monthly, semester, programme].filter(Boolean).length > 1) return null;
  if (((period === 'annual' || period === 'year') && !annual) || (period === 'monthly' && !monthly) || (period === 'semester' && !semester) || (period === 'programme' && !programme) || (period === 'oneoff' && (annual || monthly || semester || programme))) return null;
  const amount = Number(amounts[0].replaceAll(',', ''));
  return Number.isFinite(amount) && amount >= 0 && amount <= 1_000_000_000_000 ? amount : null;
}

export function buildCostPrefills(program: SourceProgram, currency: CostCurrency, fees: SourceFee[], plans: SourcePlan[]): CostPrefills {
  const patterns: Partial<Record<CostField, RegExp>> = {
    housing: /hostel|accommodation|dormitor/i, insurance: /insurance/i, application: /application/i,
    deposit: /deposit/i, medical: /medical|health check/i, residence: /residence permit/i,
    service: /service.*edu|eduexpress/i,
  };
  const planFields: Partial<Record<CostField, keyof SourcePlan>> = { tuition: 'tuitionBeforeScholarship', housing: 'hostel', insurance: 'insurance', application: 'applicationFee', medical: 'medical', service: 'serviceFee' };
  const result: CostPrefills = {};
  const plan = plans.find(item => item.isPublished && item.sourceUrl && item.lastVerifiedAt && item.programName === program.name && !item.scholarshipTitle && item.currency.toUpperCase() === currency);
  for (const field of COST_FIELDS) {
    const candidates: Array<{ value?: string; sourceUrl?: string }> = [];
    if (field === 'tuition') candidates.push({ value: program.tuition, sourceUrl: program.sourceUrl });
    const planField = planFields[field];
    if (planField && plan) candidates.push({ value: String(plan[planField] || ''), sourceUrl: plan.sourceUrl });
    const pattern = patterns[field];
    if (pattern) {
      for (const fee of fees.filter(item => item.sourceUrl && pattern.test(item.item))) {
        const combined = Object.entries(patterns).some(([other, otherPattern]) => other !== field && otherPattern.test(fee.item));
        // Do not infer a student's room choice, or split a combined visa/residence fee.
        if (!combined && !/visa|embassy/i.test(fee.item) && !(field === 'housing' && /room|twin|single|double/i.test(fee.item))) candidates.push({ value: fee.cost, sourceUrl: fee.sourceUrl });
      }
    }
    const periods = ['tuition', 'housing'].includes(field) ? ['year', 'semester', 'programme'] as const : field === 'insurance' ? ['year', 'semester', 'programme', 'oneoff'] as const : ['oneoff'] as const;
    for (const candidate of candidates) {
      for (const period of periods) {
        const parsed = parseSourceFee(candidate.value, currency, period);
        if (candidate.sourceUrl && parsed !== null) {
          result[field] = { value: String(parsed), sourceUrl: candidate.sourceUrl, recorded: candidate.value!, period };
          break;
        }
      }
      if (result[field]) break;
    }
  }
  return result;
}

/** Programme-specific numeric fees are imported from the checked admission notice. */
export function buildProgramCostPrefills(detail: { fees: { key: Exclude<CostField, 'service'>; item: string; amount?: number; currency: string; period: 'programme' | 'semester' | 'year' | 'month' | 'oneoff' | 'day'; stage?: 'before_china' | 'in_china'; notes?: string; optional?: boolean }[] } | undefined, currency: CostCurrency): CostPrefills {
  const result: CostPrefills = {};
  if (!detail) return result;
  const descriptions = { programme: 'for the programme', semester: 'per semester', year: 'per year', month: 'per month', oneoff: 'one-time', day: 'per day' };
  for (const fee of detail.fees) {
    const alternatives = detail.fees.filter(item => item.key === fee.key && !item.optional && item.currency.toUpperCase() === currency && item.amount !== undefined);
    if ((fee.key === 'other' && fee.stage === 'before_china') || fee.optional || alternatives.length !== 1 || fee.amount === undefined || fee.currency.toUpperCase() !== currency || fee.amount < 0 || !Number.isFinite(fee.amount) || fee.amount > 1_000_000_000_000 || fee.period === 'day' || (fee.key !== 'housing' && fee.period === 'month')) continue;
    result[fee.key] = { value: String(fee.amount), sourceUrl: '', recorded: [`${fee.item} · ${descriptions[fee.period]}`, fee.notes?.trim()].filter(Boolean).join('. '), period: fee.period === 'month' ? 'monthly' : fee.period };
  }
  return result;
}

export function emptyCostValues(): CostValues {
  return Object.fromEntries(COST_FIELDS.map(field => [field, ''])) as CostValues;
}

export function calculateClearCost(scenario: CostScenario) {
  const missing: string[] = [];
  const invalid: string[] = [];
  const entries: Partial<Record<CostField, number>> = {};
  const amounts: Partial<Record<CostField, number>> = {};
  for (const field of COST_FIELDS) {
    if ((field === 'deposit' && !scenario.depositRequired) || (field === 'other' && !scenario.otherCostsApply)) { amounts[field] = 0; continue; }
    const read = readCostNumber(scenario.values[field]);
    if (read.status === 'missing') missing.push(COST_LABELS[field]);
    else if (read.status === 'invalid') invalid.push(COST_LABELS[field]);
    else if (read.status === 'valid') amounts[field] = read.value;
  }
  let housingMonths: number | null = 1;
  if (scenario.housingPeriod === 'monthly' || scenario.housingPeriod === 'daily') {
    const isDaily = scenario.housingPeriod === 'daily';
    const label = isDaily ? 'Accommodation days' : 'Accommodation months';
    const read = readCostNumber(isDaily ? scenario.housingDays || '' : scenario.housingMonths);
    if (read.status === 'missing') { missing.push(label); housingMonths = null; }
    else if (read.status !== 'valid' || !Number.isInteger(read.value) || read.value < 1 || read.value > (isDaily ? 4000 : 120)) { invalid.push(label); housingMonths = null; }
    else housingMonths = read.value;
  }
  const scholarship = readCostNumber(scenario.scholarship);
  if (scholarship.status === 'missing') missing.push('Tuition reduction');
  else if (scholarship.status === 'invalid') invalid.push('Tuition reduction');
  let scholarshipDeduction: number | null = null;
  let scholarshipCapped = false;
  let netTuition: number | null = null;
  let depositCredit = 0;
  let depositExceedsTuition = false;
  let housingDepositCredit = 0;
  let depositExceedsHousing = false;
  const tuitionWaivedWithoutGross = readCostNumber(scenario.values.tuition).status === 'missing'
    && scholarship.status === 'valid' && scenario.scholarshipType === 'percent' && scholarship.value === 100;
  if (amounts.tuition !== undefined && scholarship.status === 'valid') {
    const requested = scenario.scholarshipType === 'percent' ? amounts.tuition * scholarship.value / 100 : scholarship.value;
    scholarshipDeduction = Math.min(amounts.tuition, requested);
    scholarshipCapped = requested > amounts.tuition;
    netTuition = amounts.tuition - scholarshipDeduction;
    if (scenario.depositRequired && scenario.depositCreditedToTuition) {
      // An unknown deposit also makes the remaining tuition unknown: never show an inflated total.
      if (amounts.deposit !== undefined) {
        depositCredit = Math.min(netTuition, amounts.deposit);
        depositExceedsTuition = amounts.deposit > netTuition;
        entries.tuition = netTuition - depositCredit;
      }
    } else entries.tuition = netTuition;
  } else if (tuitionWaivedWithoutGross) {
    // The payable amount is known to be zero, while the unpublished gross fee stays unknown.
    missing.splice(missing.indexOf(COST_LABELS.tuition), 1);
    netTuition = 0;
    entries.tuition = 0;
    depositExceedsTuition = scenario.depositRequired && scenario.depositCreditedToTuition && amounts.deposit !== undefined && amounts.deposit > 0;
  }
  for (const field of COST_FIELDS.filter(field => field !== 'tuition')) {
    if (amounts[field] === undefined) continue;
    if (field === 'housing') { if (housingMonths !== null) entries[field] = amounts[field] * housingMonths; }
    else entries[field] = amounts[field];
  }
  if (scenario.depositRequired && scenario.depositCreditedToHousing && !scenario.depositCreditedToTuition) {
    if (entries.housing !== undefined && amounts.deposit !== undefined) {
      housingDepositCredit = Math.min(entries.housing, amounts.deposit);
      depositExceedsHousing = amounts.deposit > entries.housing;
      entries.housing -= housingDepositCredit;
    } else delete entries.housing;
  }
  const currency = scenario.currency || 'CNY';
  const serviceCurrency = scenario.serviceCurrency || currency;
  const separatePackage = serviceCurrency !== currency;
  const beforeTotal = BEFORE_CHINA_FIELDS.reduce((sum, field) => sum + (field === 'service' && separatePackage ? 0 : entries[field] ?? 0), 0);
  const inChinaTotal = IN_CHINA_FIELDS.reduce((sum, field) => sum + (entries[field] ?? 0), 0);
  const beforeCurrencyTotals: CostCurrencyTotals = { [currency]: beforeTotal };
  const currencyTotals: CostCurrencyTotals = { [currency]: beforeTotal + inChinaTotal };
  if (separatePackage && entries.service !== undefined) {
    beforeCurrencyTotals[serviceCurrency] = entries.service;
    currencyTotals[serviceCurrency] = entries.service;
  }
  return { entries, total: beforeTotal + inChinaTotal, beforeTotal, inChinaTotal, beforeCurrencyTotals, currencyTotals, missing, invalid, netTuition, tuitionWaivedWithoutGross, depositCredit, depositExceedsTuition, housingDepositCredit, depositExceedsHousing, scholarshipDeduction, scholarshipCapped, isComplete: !missing.length && !invalid.length };
}

export function convertToBdt(amount: number, rate: string): number | null {
  const parsed = readCostNumber(rate);
  if (!Number.isFinite(amount) || amount < 0 || parsed.status !== 'valid' || parsed.value <= 0) return null;
  const result = amount * parsed.value;
  return Number.isFinite(result) ? result : null;
}

/** A BDT package is already in the target currency and must never be converted twice. */
export function convertCostTotalsToBdt(totals: CostCurrencyTotals, studyCurrency: CostCurrency, rate: string): number | null {
  if (Object.keys(totals).some(currency => currency !== studyCurrency && currency !== 'BDT')) return null;
  const bdt = totals.BDT || 0;
  if (studyCurrency === 'BDT') return bdt;
  const converted = convertToBdt(totals[studyCurrency] || 0, rate);
  return converted === null ? null : converted + bdt;
}
