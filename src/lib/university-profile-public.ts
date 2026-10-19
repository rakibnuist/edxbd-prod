import type { UniversityProfileDetail, UniversityProfileFee, UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';

const calendarYear = /\b(?:18|19|20)\d{2}\b/g;
const month = '(?:January|February|March|April|May|June|July|August|September|October|November|December)';
const calendarDate = new RegExp(`\\b(?:\\d{1,2}\\s+${month}|${month}\\s+\\d{1,2})(?:,?\\s+(?:18|19|20)\\d{2})?\\b`, 'gi');

function withoutCalendarYears(text: string): string {
  // Money, test scores and measured quantities are not publication years.
  return text.replace(calendarYear, (value, offset: number, input: string) => {
    const before = input.slice(0, offset);
    const after = input.slice(offset + value.length);
    const moneyBefore = /\b(?:CNY|RMB|BDT|USD|EUR|GBP)\s*(?:\d[\d,.]*\s*[-–—]\s*)?$/i.test(before);
    const moneyAfter = /^\s*(?:[-–—]\s*\d[\d,.]*\s*)?(?:(?:\/|per\s+)\s*(?:academic\s+)?(?:year|semester|programme|program|month|day)\s*)?(?:CNY|RMB|BDT|USD|EUR|GBP)\b/i.test(after);
    const measuredAfter = /^\s*(?:(?:\/|per\s+)\s*)?(?:words|characters|hours|days|weeks|months|years|year|semester|programme|program|month|day)\b/i.test(after);
    return moneyBefore || moneyAfter || measuredAfter ? value : '';
  });
}

/**
 * A presentation-only projection of sourced prose. The CMS retains the original
 * admission cycles, deadlines and dated evidence; this helper never changes them.
 */
export function evergreenText(value: string): string {
  return value.split(/(?<=[.!?])\s+(?=[A-Z])/u).flatMap(sentence => {
    let text = sentence.trim();
    if (!text || /^(?:Sources checked|Next review|Last verified|Review recorded|(?:(?:19|20)\d{2}\s+)?Application window)\s*:/i.test(text)) return [];
    if (/\b(?:cycle|entry|application window)\b.*\bclosed\b|\bclosed\b.*\b(?:cycle|entry|application window)\b/i.test(text)) return [];
    if (/^(?:Published\s+(?:19|20)\d{2}\s+scholarship programme|(?:19|20)\d{2}\s+(?:admission brochure listing|admission information))\b/i.test(text)) return [];
    if (/\b(?:notice|programme page)\b.*\b(?:deadline|dated open application|doctoral notice)\b/i.test(text)) return [];
    if (/^(?:Confirm|Check)\b.*\bdeadline\b/i.test(text)) return [];
    if (/\b(?:18|19|20)\d{2}\b.*\bdeadline\b|\bdeadline\b.*\b(?:18|19|20)\d{2}\b/i.test(text)) return [];
    if (/\bdoctoral notice\b.*\b(?:18|19|20)\d{2}\b|\b(?:18|19|20)\d{2}\b.*\bdoctoral notice\b/i.test(text)) return [];
    if (/\b(?:deadlines? shown|deadlines? (?:have|has) passed|this application window|current intake availability)\b/i.test(text)) return [];

    text = text
      .replace(/,?\s*founded in\s+(?:18|19|20)\d{2}\b/gi, '')
      .replace(/\bFor the\s+(?:19|20)\d{2}\s+cycle:\s*/gi, '')
      .replace(/\([^)]*\b(?:notice: born|passport validity|notice requires validity|notice requires passport validity)[^)]*\)/gi, '')
      .replace(/,?\s*born (?:before|after)\s+\d{1,2}\s+[A-Za-z]+\s+(?:19|20)\d{2}\b/gi, '')
      .replace(new RegExp(`\\b(?:on|before|after|beyond|from|to|until)\\s+${calendarDate.source}`, 'gi'), '')
      .replace(/\bthe\s+(?:19|20)\d{2}\s+brochure\b/gi, 'the admission brochure')
      .replace(/\bthe\s+(?:19|20)\d{2}\s+notice\b/gi, 'the published notice')
      .replace(/\bunder the\s+(?:19|20)\d{2}\s+call\b/gi, 'under the published scheme')
      .replace(/;\s*(?:the\s+)?(?:payment|application|registration) deadline[^.;]*/gi, '')
      .replace(/\b(?:19|20)\d{2}\s+eligible citizenships\b/gi, 'Published eligible citizenships')
      .replace(/\bthis\s+(?:19|20)\d{2}\s+list\b/gi, 'this published list')
      .replace(/\([^)]*\b(?:19|20)\d{2}\s+(?:brochure|admission|entry|notice|guide|catalogue|catalog|FAQ|call|scheme|prospectus)[^)]*\)/gi, '')
      .replace(/\b(?:by|before)\s+(?:(?:the|its)\s+)?(?:(?:university|intake|admission-letter|stated|applicable|registration|application)\s+)?deadline\b/gi, '')
      .replace(calendarDate, '');
    text = withoutCalendarYears(text)
      .replace(/\(\s*\)|\b(?:closed admission cycle|closed cycle)\b/gi, '')
      .replace(/\s+([,.;:])/g, '$1')
      .replace(/\s{2,}/g, ' ')
      .replace(/(^|\n)[\s,;:·–—-]+|[\s,;:·–—-]+$/g, '')
      .trim();
    if (!text || /^(?:closed|admission cycle|admission brochure|published brochure|scholarship programme)[\s.]*$/i.test(text)) return [];
    return [text];
  }).join(' ');
}

const publicStrings = (values: string[]) => [...new Set(values.map(evergreenText).filter(Boolean))];

function prepareFee(fee: UniversityProfileFee): UniversityProfileFee {
  // Rebuild rather than spreading source records, so paths and editorial fields cannot leak.
  const notes = fee.notes ? evergreenText(fee.notes) : '';
  const displayAmount = fee.displayAmount ? evergreenText(fee.displayAmount) : '';
  return {
    key: fee.key, item: evergreenText(fee.item), currency: fee.currency,
    period: fee.period, stage: fee.stage,
    ...(fee.amount !== undefined ? { amount: fee.amount } : {}),
    ...(displayAmount ? { displayAmount } : {}), ...(notes ? { notes } : {}),
    ...(fee.optional !== undefined ? { optional: fee.optional } : {}),
  };
}

export function prepareUniversityPrograms(programs: UniversityProgramDetail[]): UniversityProgramDetail[] {
  return programs.map(program => ({
    id: program.id, name: evergreenText(program.name), level: program.level,
    languages: publicStrings(program.languages), duration: evergreenText(program.duration),
    qualifications: publicStrings(program.qualifications), languageRequirements: publicStrings(program.languageRequirements),
    documents: publicStrings(program.documents), fees: program.fees.map(prepareFee), notes: publicStrings(program.notes),
    ...(program.campus ? { campus: evergreenText(program.campus) } : {}),
    ...(program.school ? { school: evergreenText(program.school) } : {}),
    ...(program.progression ? { progression: evergreenText(program.progression) } : {}),
    ...(program.scholarships ? { scholarships: publicStrings(program.scholarships) } : {}),
  }));
}

export function prepareUniversityScholarship(option: UniversityScholarshipOption): UniversityScholarshipOption {
  return {
    id: option.id, title: evergreenText(option.title), type: evergreenText(option.type), levels: [...option.levels],
    coverage: publicStrings(option.coverage), conditions: publicStrings(option.conditions), renewal: publicStrings(option.renewal),
    documents: publicStrings(option.documents), applicationSteps: publicStrings(option.applicationSteps), notes: publicStrings(option.notes),
    // This internal status is deliberately retained, never converted to an open award.
    status: option.status,
    ...(option.languages ? { languages: publicStrings(option.languages) } : {}),
    ...(option.programNames ? { programNames: publicStrings(option.programNames) } : {}),
    ...(option.programIds ? { programIds: [...option.programIds] } : {}),
    ...(option.feeWaivers ? { feeWaivers: [...option.feeWaivers] } : {}),
    ...(option.tuitionReduction ? { tuitionReduction: { ...option.tuitionReduction } } : {}),
    ...(option.stipend ? { stipend: evergreenText(option.stipend) } : {}),
  };
}

export function prepareUniversityProfile(details: UniversityProfileDetail): UniversityProfileDetail {
  return {
    slug: details.slug,
    overview: details.overview.split(/\n\s*\n/).map(evergreenText).filter(Boolean).join('\n\n'),
    programs: prepareUniversityPrograms(details.programs),
    ...(details.highlights ? { highlights: details.highlights.map(highlight => ({ title: evergreenText(highlight.title), description: evergreenText(highlight.description) })).filter(highlight => highlight.title && highlight.description) } : {}),
    ...(details.scholarshipOptions ? { scholarshipOptions: details.scholarshipOptions.map(prepareUniversityScholarship) } : {}),
  };
}
