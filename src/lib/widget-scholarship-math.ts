/**
 * Evidence-first scholarship scenario helpers for the Cost Calculator Widget
 * and CC BY 4.0 Open Dataset exports.
 *
 * Follows the accounting rule from `src/lib/clear-cost.ts`:
 * - Always show gross published tuition first.
 * - Deduct ONLY explicitly published tuition waivers (% waiver, fixed annual CNY
 *   reduction, or explicit target net annual tuition like "Tuition reduced to 7,000 CNY/Year")
 *   and explicitly published dormitory/insurance waivers.
 * - Monthly or annual living stipends are displayed separately and NEVER subtracted
 *   from upfront arrival cash charges.
 * - Never expose private deep source URLs to client components.
 */

import {
  FEE_LABELS,
  FIRST_YEAR_FEES,
  scholarshipCategory,
  type FeeCategory,
  type FeeRow,
  type ProgramRow,
  type ScholarshipCategory,
} from './catalog-views';

export type PublicScholarshipScenario = {
  id: string;
  universitySlug: string;
  title: string;
  category: ScholarshipCategory;
  /**
   * Tuition waiver model parsed strictly from recorded scholarship text:
   * - `percent`: % off gross annual tuition
   * - `fixed_cny`: fixed annual CNY deduction off gross tuition
   * - `net_tuition_cny`: explicit post-scholarship annual tuition payable in CNY (e.g. "Pay 6,000 CNY/Year")
   * - `none`: no tuition waiver (e.g. accommodation-only or stipend-only award)
   * - `varies`: variable / multi-tier terms requiring offer-letter confirmation
   */
  tuitionWaiverType: 'percent' | 'fixed_cny' | 'net_tuition_cny' | 'none' | 'varies';
  tuitionWaiverValue: number | null;
  waivesAccommodation: boolean;
  waivesInsurance: boolean;
  monthlyStipendCny: number | null;
  stipendLabel: string | null;
  coverageSummary: string;
  renewalNote: string | null;
  deadline: string | null;
  eligibleLevels: string[];
};

export type ScholarshipAdjustedEstimate = {
  grossTuitionCny: number | null;
  tuitionDeductionCny: number | null;
  netTuitionCny: number | null;
  waivedCategories: FeeCategory[];
  feeLines: {
    category: FeeCategory;
    label: string;
    recordedText: string;
    grossCny: number | null;
    netCny: number | null;
    waivedByScholarship: boolean;
  }[];
  grossTotalCny: number | null;
  grossPartialCny: number;
  netTotalCny: number | null;
  netPartialCny: number;
  unclear: string[];
  missing: string[];
  /** True when the chosen scholarship has variable/unspecified terms so net savings cannot be computed automatically. */
  scholarshipTermsVariable: boolean;
  stipendMonthlyCny: number | null;
  stipendLabel: string | null;
};

type RawScholarshipInput = {
  title: string;
  type?: string | null;
  amount?: string | null;
  coverage?: string | null;
  condition?: string | null;
  renewal?: string | null;
  deadline?: string | null;
  eligiblePrograms?: string[];
  details?: string[];
  status?: string | null;
};

function normalizeEligibleLevels(texts: string[]): string[] {
  const joined = texts.join(' ').toLowerCase();
  const levels = new Set<string>();
  if (/\bbachelor\b|undergraduate|\bb\.?sc\b|\bb\.?eng\b/.test(joined)) levels.add('Bachelor');
  if (/\bmbbs\b|clinical medicine/.test(joined)) levels.add('MBBS');
  if (/\bmaster\b|postgraduate|\bm\.?sc\b|\bmba\b/.test(joined)) levels.add('Master');
  if (/\bph\.?d\b|doctoral|doctorate/.test(joined)) levels.add('PhD');
  if (/\blanguage\b|non.?degree|chinese studies|clec|confucius/.test(joined)) levels.add('Chinese language');
  if (/\bfoundation\b|preparatory/.test(joined)) levels.add('Foundation');
  if (/\bdiploma\b|vocational|associate/.test(joined)) levels.add('Diploma');
  return [...levels];
}

function parseStipend(text: string): { cny: number | null; label: string | null } {
  if (/no\s+stipend/i.test(text)) return { cny: null, label: null };

  // 1. Explicit monthly stipend: "2500 CNY/Month", "1,200 RMB/Month", "1,000 Yuan/Month", "Monthly Stipend 1400 CNY", "Monthly 400 CNY"
  const m1 = text.match(
    /(?:(?:CNY|RMB|¥)\s*(\d[\d,]{2,5})\s*(?:\/\s*|per\s+)month|(\d[\d,]{2,5})\s*(?:CNY|RMB|yuan)\s*(?:\/\s*|per\s+)month|(?:monthly\s+(?:stipend|living\s+allowance)|stipend|living\s+allowance)\s*:?\s*(?:CNY|RMB|¥)?\s*(\d[\d,]{2,5})\s*(?:CNY|RMB|yuan)?(?!\s*\/\s*year))/i,
  );
  if (m1) {
    const raw = (m1[1] || m1[2] || m1[3] || '').replaceAll(',', '');
    const val = Number(raw);
    if (Number.isFinite(val) && val >= 200 && val <= 15000) {
      const monthsMatch = text.match(/\((\d{1,2})\s*months?\)/i);
      const monthsNote = monthsMatch ? ` (${monthsMatch[1]} months/year)` : '';
      return { cny: val, label: `CNY ${val.toLocaleString('en-US')} / month living stipend${monthsNote}` };
    }
  }

  // 2. Explicit annual stipend / living allowance: "Stipend 5000 CNY/Year", "Living Allowance: 30000 CNY/Year"
  const yr = text.match(/(?:stipend|living\s+allowance)\s*:?\s*(?:CNY|RMB|¥)?\s*(\d[\d,]{3,6})\s*(?:CNY|RMB|yuan)?\s*(?:\/\s*|per\s+)year/i);
  if (yr) {
    const val = Number(yr[1].replaceAll(',', ''));
    if (Number.isFinite(val) && val >= 1000 && val <= 80000) {
      return { cny: null, label: `CNY ${val.toLocaleString('en-US')} / year living allowance` };
    }
  }

  if (/\bcsc\b|chinese government scholarship/i.test(text)) {
    return {
      cny: null,
      label: 'Standard CSC stipend: CNY 2,500 (Bachelor) / CNY 3,000 (Master) / CNY 3,500 (PhD) per month',
    };
  }
  if (/stipend|living allowance/i.test(text)) {
    return { cny: null, label: 'Includes living stipend (exact CNY tier confirmed on official award letter)' };
  }
  return { cny: null, label: null };
}

/**
 * Parse a recorded university Scholarship row into a clean, public-safe
 * `PublicScholarshipScenario` without ever leaking `sourceUrl`.
 */
export function toPublicScholarshipScenario(
  universitySlug: string,
  index: number,
  raw: RawScholarshipInput,
): PublicScholarshipScenario {
  const category = scholarshipCategory(raw.title, raw.type || '');
  const parts = [
    raw.title,
    raw.type || '',
    raw.amount || '',
    raw.coverage || '',
    ...(raw.details || []),
  ].filter(Boolean);
  const fullText = parts.join(' ; ');
  const lower = fullText.toLowerCase();

  const isCsc = category === 'Chinese Government (CSC)';
  const isClec = category === 'Chinese language (CLEC)';

  let tuitionWaiverType: PublicScholarshipScenario['tuitionWaiverType'] = 'varies';
  let tuitionWaiverValue: number | null = null;
  let waivesAccommodation = false;
  let waivesInsurance = false;

  // Check explicit "post-scholarship payable tuition" phrasing first (NEVER confuse with deduction!)
  const netPayableMatch = fullText.match(
    /(?:tuition\s+(?:fees?\s+)?(?:reduced\s+to|after\s+scholarship\s*:?)|pay\s+(?:tuition\s+)?)(?:CNY|RMB|¥)?\s*(\d[\d,]{3,6})\s*(?:CNY|RMB|yuan)?\s*(?:\/\s*|per\s+)year/i,
  );
  const isCombinedPackage = /tuition\s*(?:\+|and)\s*accommodation/i.test(lower) && Boolean(netPayableMatch);

  // Check explicit unambiguous percentage waiver (never a range like 10%-100%, never "(50% of students)" quota notes)
  const sanitizedForPct = fullText
    .replace(/\(\s*\d{1,3}\s*%\s*(?:of\s+students|coverage)\s*\)/gi, '')
    .replace(/top\s*\d{1,3}\s*%/gi, '')
    .replace(/\d{1,3}\s*[-–—]\s*\d{1,3}\s*%/gi, '');
  const rangePercent = /\d+\s*%\s*[-–—to]+\s*\d+\s*%/i.test(sanitizedForPct);
  const pctMatch = !rangePercent
    ? sanitizedForPct.match(/(\d{1,3})\s*%\s*(?:of\s+)?(?:one-year\s+)?(?:tuition|waiver|off|free|reduction)/i)
    : null;

  // Check explicit fixed annual CNY deduction (exclude net-payable phrasing & stipends & accommodation amounts)
  const sanitizedForFixed = fullText
    .replace(/(?:stipend|living\s+allowance|accommodation)[^;]*/gi, '')
    .replace(/(?:reduced\s+to|after\s+scholarship|pay\s+)[^;]*/gi, '');
  const rangeCny =
    /(?:CNY|RMB|¥)\s*\d[\d,]*\s*[-–—]\s*\d[\d,]*/i.test(sanitizedForFixed) ||
    /\d[\d,]*\s*[-–—]\s*\d[\d,]*\s*(?:CNY|RMB)/i.test(sanitizedForFixed);
  const fixedMatch = !rangeCny
    ? sanitizedForFixed.match(
        /(?:(?:CNY|RMB|¥)\s*(\d[\d,]{3,6})|(\d[\d,]{3,6})\s*(?:CNY|RMB|yuan))(?:\s*(?:\/\s*|per\s+)?(?:academic\s+)?year|\s+(?:tuition\s+)?(?:subsidy|scholarship|waiver|reduction))/i,
      )
    : null;

  if (isCsc || isClec) {
    tuitionWaiverType = 'percent';
    tuitionWaiverValue = 100;
    waivesAccommodation = true;
    waivesInsurance = true;
  } else if (netPayableMatch && !isCombinedPackage) {
    const val = Number(netPayableMatch[1].replaceAll(',', ''));
    if (Number.isFinite(val) && val >= 0 && val <= 100000) {
      tuitionWaiverType = 'net_tuition_cny';
      tuitionWaiverValue = val;
    }
  } else if (
    /100\s*%\s*(?:off|tuition|waiv)|full\s+tuition\s*(?:fees?)?\s*(?:free|waiv)|tuition\s*(?:fees?)?\s*:?\s*(?:full\s+)?free|tuition\s+and\s+accommodations?\s+free|free\s+tuition|tuition[\s-]free/i.test(
      sanitizedForPct,
    )
  ) {
    tuitionWaiverType = 'percent';
    tuitionWaiverValue = 100;
  } else if (/half\s+of\s+tuition\s+(?:fees?\s+)?waiv/i.test(lower)) {
    tuitionWaiverType = 'percent';
    tuitionWaiverValue = 50;
  } else if (pctMatch) {
    const pct = Number(pctMatch[1]);
    if (pct >= 5 && pct <= 100) {
      tuitionWaiverType = 'percent';
      tuitionWaiverValue = pct;
    }
  } else if (fixedMatch) {
    const rawNum = (fixedMatch[1] || fixedMatch[2] || '').replaceAll(',', '');
    const amt = Number(rawNum);
    if (Number.isFinite(amt) && amt >= 1000 && amt <= 100000) {
      tuitionWaiverType = 'fixed_cny';
      tuitionWaiverValue = amt;
    }
  } else if (/pay\s+tuition|accommodation\s+fees?\s+covered/i.test(lower)) {
    tuitionWaiverType = 'none';
    tuitionWaiverValue = 0;
  } else if (/^\s*full\s*$/i.test(raw.type || '') || /\bfull\s+scholarship\b/i.test(lower)) {
    tuitionWaiverType = 'percent';
    tuitionWaiverValue = 100;
  }

  // Explicit accommodation / insurance waivers only (never match "Pay Dorm" / "Student pays Accommodation")
  if (
    !/(?:pay\s+(?:dorm|accommodation)|student\s+pays\s+accommodation)/i.test(lower) &&
    /(?:free\s+(?:dorm|dormitory|accommodation|hostel|housing)|accommodation\s*(?:fees?)?\s*:?\s*(?:full\s+)?(?:free|covered|waived)|(?:full\s+)?accommodation\s+fees?\s+free|tuition\s+and\s+accommodations?\s*(?:fees?)?\s*free|dorm(?:itory)?\s+waiv)/i.test(
      lower,
    )
  ) {
    waivesAccommodation = true;
  }
  if (
    /(?:comprehensive\s+medical\s+insurance|medical\s+insurance\s*(?:fees?)?\s*(?:included|covered|waived|free)|insurance\s*(?:fees?)?\s*:?\s*(?:full\s+)?free|free\s+insurance|registration\s*&\s*insurance\s+free)/i.test(
      lower,
    )
  ) {
    waivesInsurance = true;
  }

  const stipend = parseStipend(fullText);

  const summaryBits: string[] = [];
  if (raw.coverage?.trim()) summaryBits.push(raw.coverage.trim());
  else if (raw.amount?.trim()) summaryBits.push(raw.amount.trim());
  else if (raw.details && raw.details.length) summaryBits.push(raw.details.join(' · '));
  else if (tuitionWaiverType === 'percent' && tuitionWaiverValue !== null) {
    summaryBits.push(`${tuitionWaiverValue}% tuition waiver`);
    if (waivesAccommodation) summaryBits.push('on-campus accommodation waived');
    if (waivesInsurance) summaryBits.push('medical insurance covered');
  } else if (tuitionWaiverType === 'fixed_cny' && tuitionWaiverValue !== null) {
    summaryBits.push(`CNY ${tuitionWaiverValue.toLocaleString('en-US')} / year tuition reduction`);
  } else if (tuitionWaiverType === 'net_tuition_cny' && tuitionWaiverValue !== null) {
    summaryBits.push(`Net annual tuition reduced to CNY ${tuitionWaiverValue.toLocaleString('en-US')} / year`);
  } else if (raw.type?.trim()) {
    summaryBits.push(`${raw.type.trim()} (exact tier confirmed on official university notice)`);
  } else {
    summaryBits.push('Coverage varies by applicant merit and annual seats');
  }

  return {
    id: `${universitySlug}-sch-${index}`,
    universitySlug,
    title: raw.title.trim(),
    category,
    tuitionWaiverType,
    tuitionWaiverValue,
    waivesAccommodation,
    waivesInsurance,
    monthlyStipendCny: stipend.cny,
    stipendLabel: stipend.label,
    coverageSummary: summaryBits.join(' · '),
    renewalNote: raw.renewal?.trim() || raw.condition?.trim() || 'Subject to annual academic & attendance review',
    deadline: raw.deadline?.trim() || null,
    eligibleLevels: normalizeEligibleLevels([...(raw.eligiblePrograms || []), raw.title, ...(raw.details || [])]),
  };
}

export function scholarshipAppliesToProgram(
  scholarship: PublicScholarshipScenario,
  program: Pick<ProgramRow, 'level' | 'languages'>,
): boolean {
  if (!scholarship.eligibleLevels.length) return true;
  return scholarship.eligibleLevels.includes(program.level);
}

/**
 * Compute gross vs. scholarship-adjusted first-year out-of-pocket costs.
 * Never deducts living stipends from upfront arrival cash fees.
 */
export function computeScholarshipAdjustedEstimate(
  program: Pick<ProgramRow, 'annualTuitionCny' | 'level'>,
  fees: FeeRow[],
  scholarship: PublicScholarshipScenario | null,
): ScholarshipAdjustedEstimate {
  const grossTuitionCny = program.annualTuitionCny;
  let tuitionDeductionCny: number | null = null;
  let netTuitionCny: number | null = grossTuitionCny;
  let scholarshipTermsVariable = false;

  if (scholarship) {
    if (scholarship.tuitionWaiverType === 'percent' && scholarship.tuitionWaiverValue !== null) {
      if (grossTuitionCny !== null) {
        tuitionDeductionCny = Math.round((grossTuitionCny * scholarship.tuitionWaiverValue) / 100);
        netTuitionCny = Math.max(0, grossTuitionCny - tuitionDeductionCny);
      } else if (scholarship.tuitionWaiverValue === 100) {
        netTuitionCny = 0;
      }
    } else if (scholarship.tuitionWaiverType === 'fixed_cny' && scholarship.tuitionWaiverValue !== null) {
      if (grossTuitionCny !== null) {
        tuitionDeductionCny = Math.min(grossTuitionCny, scholarship.tuitionWaiverValue);
        netTuitionCny = Math.max(0, grossTuitionCny - tuitionDeductionCny);
      } else {
        scholarshipTermsVariable = true;
      }
    } else if (scholarship.tuitionWaiverType === 'net_tuition_cny' && scholarship.tuitionWaiverValue !== null) {
      netTuitionCny = scholarship.tuitionWaiverValue;
      if (grossTuitionCny !== null) {
        tuitionDeductionCny = Math.max(0, grossTuitionCny - scholarship.tuitionWaiverValue);
      }
    } else if (scholarship.tuitionWaiverType === 'none') {
      tuitionDeductionCny = 0;
      netTuitionCny = grossTuitionCny;
    } else if (scholarship.tuitionWaiverType === 'varies') {
      scholarshipTermsVariable = true;
    }
  }

  const waivedCategories: FeeCategory[] = [];
  if (scholarship?.waivesAccommodation) waivedCategories.push('accommodation');
  if (scholarship?.waivesInsurance) waivedCategories.push('insurance');

  const unclear: string[] = [];
  if (grossTuitionCny === null && netTuitionCny === null) unclear.push('Tuition');

  let grossPartialCny = grossTuitionCny ?? 0;
  let netPartialCny = netTuitionCny ?? 0;

  const feeLines: ScholarshipAdjustedEstimate['feeLines'] = [];
  for (const category of FIRST_YEAR_FEES) {
    const matched = fees.filter((f) => f.category === category);
    if (!matched.length) continue;

    const singleGross = matched.length === 1 ? matched[0].firstYearCny : null;
    const isWaived = waivedCategories.includes(category);
    const recordedText =
      singleGross !== null
        ? `CNY ${Math.round(singleGross).toLocaleString('en-US')}`
        : matched.map((m) => m.cost).join(' / ');

    if (singleGross !== null) {
      grossPartialCny += singleGross;
    }

    let netCny: number | null = singleGross;
    if (isWaived) {
      netCny = 0;
    } else if (singleGross !== null) {
      netPartialCny += singleGross;
    } else {
      unclear.push(FEE_LABELS[category]);
    }

    feeLines.push({
      category,
      label: FEE_LABELS[category],
      recordedText,
      grossCny: singleGross,
      netCny,
      waivedByScholarship: isWaived,
    });
  }

  const missing = FIRST_YEAR_FEES.filter(
    (category) => !fees.some((f) => f.category === category) && !waivedCategories.includes(category),
  ).map((category) => FEE_LABELS[category]);

  let stipendMonthlyCny = scholarship?.monthlyStipendCny ?? null;
  let stipendLabel = scholarship?.stipendLabel ?? null;
  if (scholarship && scholarship.category === 'Chinese Government (CSC)' && stipendMonthlyCny === null) {
    if (program.level === 'PhD') {
      stipendMonthlyCny = 3500;
      stipendLabel = 'CNY 3,500 / month CSC doctoral living stipend (paid separately after arrival)';
    } else if (program.level === 'Master') {
      stipendMonthlyCny = 3000;
      stipendLabel = 'CNY 3,000 / month CSC master living stipend (paid separately after arrival)';
    } else {
      stipendMonthlyCny = 2500;
      stipendLabel = 'CNY 2,500 / month CSC undergraduate living stipend (paid separately after arrival)';
    }
  }

  const grossUnclear = grossTuitionCny === null || feeLines.some((l) => l.grossCny === null);

  return {
    grossTuitionCny,
    tuitionDeductionCny,
    netTuitionCny,
    waivedCategories,
    feeLines,
    grossTotalCny: grossUnclear ? null : grossPartialCny,
    grossPartialCny,
    netTotalCny: unclear.length || scholarshipTermsVariable ? null : netPartialCny,
    netPartialCny,
    unclear,
    missing,
    scholarshipTermsVariable,
    stipendMonthlyCny,
    stipendLabel,
  };
}
