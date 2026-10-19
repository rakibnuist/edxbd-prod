import type { CleanUniversityRecord } from '@/lib/university-records';
import type { UniversityProfileDetail, UniversityProgramDetail, UniversityProfileFee } from '@/types/university-profile';

export const PROGRAM_LEVELS = ['Bachelor', 'Master', 'PhD', 'Language', 'Foundation', 'Diploma'] as const;
export type ProgramLevel = typeof PROGRAM_LEVELS[number];
export function normalizeProgramLevel(level: string): ProgramLevel {
  if (/ph\.?d|doctor/i.test(level)) return 'PhD';
  if (/master|postgraduate/i.test(level)) return 'Master';
  if (/language|chinese studies|non.degree/i.test(level)) return 'Language';
  if (/foundation|preparatory|pre.university/i.test(level)) return 'Foundation';
  if (/diploma|associate/i.test(level)) return 'Diploma';
  return 'Bachelor';
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
