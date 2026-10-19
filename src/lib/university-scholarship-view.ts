import type { UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';

const levelKey = (level: string) => {
  if (/ph\.?d|doctor/i.test(level)) return 'phd';
  if (/master|postgraduate/i.test(level)) return 'master';
  if (/bachelor|undergraduate|mbbs/i.test(level)) return 'bachelor';
  if (/language|chinese studies|non.degree/i.test(level)) return 'language';
  if (/foundation|preparatory|pre.university/i.test(level)) return 'foundation';
  if (/diploma|associate/i.test(level)) return 'diploma';
  return level.trim().toLowerCase();
};

/** Catalogue compatibility only; the applicant must also meet the award's published conditions. */
export function scholarshipMatchesProgram(option: UniversityScholarshipOption, program: UniversityProgramDetail) {
  const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
  if (option.programIds?.length && !option.programIds.includes(program.id)) return false;
  if (option.levels.length && !option.levels.some(level => levelKey(level) === levelKey(program.level))) return false;
  if (option.languages?.length && !option.languages.some(language => program.languages.some(value => same(language, value)))) return false;
  if (option.programNames?.length && !option.programNames.some(name => same(name, program.name))) return false;
  return true;
}

export function scholarshipReductionLabel(option: UniversityScholarshipOption) {
  const reduction = option.tuitionReduction;
  if (!reduction) return '';
  const period = reduction.period ? ` / ${reduction.period}` : '';
  return reduction.type === 'percent'
    ? `${reduction.value}% tuition reduction`
    : `${reduction.currency ? `${reduction.currency} ` : ''}${reduction.value.toLocaleString('en-US')}${period} tuition reduction${reduction.currency ? '' : ' (currency not specified)'}`;
}
