import type { CleanUniversityRecord } from '@/lib/university-records';
import type { UniversityProfileDetail, UniversityProgramDetail, UniversityProfileFee } from '@/types/university-profile';

export const PROGRAM_LEVELS = ['Bachelor', 'Master', 'PhD', 'Language', 'Foundation', 'Diploma'] as const;
export type ProgramLevel = typeof PROGRAM_LEVELS[number];
export const PROGRAM_LEVEL_LABELS: Record<ProgramLevel, string> = { Bachelor: 'Bachelor’s', Master: 'Master’s', PhD: 'PhD', Language: 'Language', Foundation: 'Foundation', Diploma: 'Diploma' };
export function normalizeProgramLevel(level: string): ProgramLevel {
  if (/ph\.?d|doctor/i.test(level)) return 'PhD';
  if (/master|postgraduate/i.test(level)) return 'Master';
  if (/language|chinese studies|non.degree/i.test(level)) return 'Language';
  if (/foundation|preparatory|pre.university/i.test(level)) return 'Foundation';
  if (/diploma|associate/i.test(level)) return 'Diploma';
  return 'Bachelor';
}

/** Lowest-to-highest published tuition per study level. Levels with mixed
 *  currencies or billing periods are excluded rather than compared. */
export function programFeePreviews(programs: UniversityProgramDetail[]): { level: ProgramLevel; amount: string; period: string }[] {
  const levels = PROGRAM_LEVELS.filter(item => programs.some(program => normalizeProgramLevel(program.level) === item));
  return levels.flatMap(level => {
    const fees = programs.filter(program => normalizeProgramLevel(program.level) === level).flatMap(program => program.fees.filter(fee => fee.key === 'tuition' && !fee.optional && fee.amount !== undefined));
    if (!fees.length || new Set(fees.map(fee => fee.currency)).size !== 1 || new Set(fees.map(fee => fee.period)).size !== 1) return [];
    const low = Math.min(...fees.map(fee => fee.amount!));
    const high = Math.max(...fees.map(fee => fee.amount!));
    return [{ level, amount: `${fees[0].currency} ${low.toLocaleString('en-US')}${high > low ? `–${high.toLocaleString('en-US')}` : ''}`, period: ({ year: 'per year', semester: 'per semester', programme: 'per program', month: 'per month', day: 'per day', oneoff: 'one-time' })[fees[0].period] }];
  });
}

export function feeText(fee: UniversityProfileFee): string {
  if ('displayAmount' in fee && typeof fee.displayAmount === 'string') return fee.displayAmount;
  if (fee.amount === undefined) return 'Not specified';
  const periods = { programme: 'programme', semester: 'semester', year: 'year', month: 'month', day: 'day', oneoff: 'one-time' };
  return `${fee.currency} ${fee.amount.toLocaleString('en-US')} / ${periods[fee.period]}`;
}
function makeFee(item: string, cost: string, key: UniversityProfileFee['key'], sourced: boolean): UniversityProfileFee {
  const period = /semester/i.test(cost) ? 'semester' : /month/i.test(cost) ? 'month' : /day/i.test(cost) ? 'day' : /year|annual/i.test(cost) ? 'year' : key === 'tuition' ? 'programme' : 'oneoff';
  const currencies = cost.match(/\b(CNY|RMB|BDT|USD|EUR|GBP)\b/gi) || [];
  // Remove a bracketed admission-cycle label before counting fee amounts.
  const plain = cost.replace(/\([^)]*\)/g, '').replace(/non-refundable/gi, '');
  const amounts = plain.match(/\d[\d,]*(?:\.\d+)?/g) || [];
  const amount = sourced && amounts.length === 1 && currencies.length === 1 && !/scholarship|after|free|discount|waiv|[–—]|\d\s*-\s*\d/i.test(plain) ? Number(amounts[0].replaceAll(',', '')) : undefined;
  return { key, item, amount, currency: currencies[0]?.toUpperCase().replace('RMB','CNY') || 'CNY', period, stage: key === 'application' || key === 'deposit' ? 'before_china' : 'in_china', displayAmount: cost };
}
export function profilePrograms(university: CleanUniversityRecord, details: UniversityProfileDetail | null, researchedFees: [string, string][] = []): UniversityProgramDetail[] {
  if (details?.programs.length) return details.programs;
  return university.programs.filter(program => program.status !== 'paused').map((program, index) => {
    const fees: UniversityProfileFee[] = [];
    if (program.tuition) fees.push(makeFee('Tuition', program.tuition, 'tuition', Boolean(program.sourceUrl)));
    const rows = [...researchedFees.map(([item, cost]) => ({ item, cost, sourceUrl: 'internal-research' })), ...university.fees];
    const keys: [RegExp, UniversityProfileFee['key']][] = [[/application/i, 'application'], [/room.*deposit|deposit.*room/i, 'other'], [/deposit/i, 'deposit'], [/accommodation|housing|dorm|hostel|room/i, 'housing'], [/insurance/i,'insurance'], [/medical|health check/i,'medical'], [/residence permit/i,'residence']];
    const seen = new Set<string>();
    for (const fee of rows) {
      if (/tuition/i.test(fee.item) || seen.has(`${fee.item}|${fee.cost}`)) continue;
      const key = keys.find(([pattern]) => pattern.test(fee.item))?.[1] || 'other';
      seen.add(`${fee.item}|${fee.cost}`);
      fees.push(makeFee(fee.item, fee.cost, key, Boolean(fee.sourceUrl)));
    }
    return {
      id: `${university.slug}-${index}`, name: program.name, level: normalizeProgramLevel(program.level), languages: program.languages,
      duration: program.duration || 'Not specified', intake: program.intakes.join(', ') || undefined,
      deadline: program.applicationDeadline || undefined,
      qualifications: program.eligibility.filter(text => !/IELTS|TOEFL|HSK|Duolingo|language|English evidence/i.test(text)),
      languageRequirements: program.eligibility.filter(text => /IELTS|TOEFL|HSK|Duolingo|language|English evidence/i.test(text)),
      documents: university.documents, fees, notes: program.status === 'planned' ? ['Confirm availability for your intended intake before applying.'] : [],
    };
  });
}
