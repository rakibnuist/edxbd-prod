// Pure lead distribution & counselor flow rules shared between server, client UI, and tests.
// Contains zero Node built-ins.

export type LeadFlowMode = 'auto_balanced' | 'round_robin' | 'manual_queue';
export type LeadFlowAttendanceFilter = 'all_eligible' | 'prefer_checked_in' | 'strict_checked_in';
export type CounselorCountryScope = 'all' | 'china_only' | 'non_china_only';

export interface CounselorFlowRule {
  eligible: boolean;
  countryScope: CounselorCountryScope;
  dailyCap: number; // 0 = unlimited
}

export interface LeadFlowSettingsConfig {
  mode: LeadFlowMode;
  attendanceFilter: LeadFlowAttendanceFilter;
  onlyDistributeUntouched: boolean;
  rulesByEmpId: Record<string, CounselorFlowRule>;
}

export interface LeadFlowCandidate {
  id: string;
  empId: string;
  name: string;
  team: string;
  role: string;
  activeCount: number;
  todayAssignedCount?: number;
  checkedInToday?: boolean;
  lastAssignedAtMs?: number;
}

export interface LeadRoutingMatchInput {
  assignedTeam?: string | null;
  country?: string | null;
  destinationInterest?: string | null;
}

export const NON_COUNSELING_ROLE_RE =
  /\b(investor|managing|director|ceo|super\s*admin|founder|founder_ceo|b2b|accountant|business\s+development|creative|designer|video\s+editor|files?\s*(?:&|and)?\s*visa\s+processing|processing\s+executive)\b/i;

const VALID_MODES = new Set<LeadFlowMode>(['auto_balanced', 'round_robin', 'manual_queue']);
const VALID_ATTENDANCE = new Set<LeadFlowAttendanceFilter>([
  'all_eligible',
  'prefer_checked_in',
  'strict_checked_in',
]);
const VALID_SCOPES = new Set<CounselorCountryScope>(['all', 'china_only', 'non_china_only']);

export function isChinaDestination(input: LeadRoutingMatchInput): boolean {
  const assignedTeam = (input.assignedTeam || '').trim().toLowerCase();
  const dest = (input.destinationInterest || '').trim().toLowerCase();
  const country = (input.country || '').trim().toLowerCase();
  return assignedTeam === 'china' || dest === 'china' || country === 'china' || country.includes('china');
}

export function inferDefaultCounselorFlowRule(emp: {
  name?: string | null;
  role?: string | null;
  team?: string | null;
}): CounselorFlowRule {
  const role = (emp.role || '').trim();
  const team = (emp.team || '').trim().toLowerCase();
  const name = (emp.name || '').trim();
  const eligible = !NON_COUNSELING_ROLE_RE.test(role);

  let countryScope: CounselorCountryScope = 'china_only';
  if (team === 'all' || team === 'all_countries' || team === 'global' || /\bmukta\b/i.test(name)) {
    countryScope = 'all';
  } else if (team === 'europe' || team === 'malaysia' || team === 'non_china_only') {
    countryScope = 'non_china_only';
  } else if (team === 'general') {
    countryScope = 'all';
  } else {
    countryScope = 'china_only';
  }

  return { eligible, countryScope, dailyCap: 0 };
}

export function resolveEmployeeFlowRule(
  emp: { empId: string; name?: string | null; role?: string | null; team?: string | null },
  rulesByEmpId: Record<string, CounselorFlowRule>,
): CounselorFlowRule {
  const key = emp.empId.trim().toUpperCase();
  return rulesByEmpId[key] || rulesByEmpId[emp.empId] || inferDefaultCounselorFlowRule(emp);
}

export function doesCountryScopeMatchLead(
  scope: CounselorCountryScope,
  leadInput: LeadRoutingMatchInput,
): boolean {
  if (scope === 'all') return true;
  const china = isChinaDestination(leadInput);
  if (scope === 'china_only') return china;
  return !china;
}

export function normalizeLeadFlowRulesObject(raw: unknown): {
  rules?: Record<string, CounselorFlowRule>;
  error?: string;
} {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { error: 'Lead flow rules must be an object keyed by employee ID.' };
  }
  const clean: Record<string, CounselorFlowRule> = {};
  for (const [rawEmpId, val] of Object.entries(raw)) {
    const empId = rawEmpId.trim().toUpperCase().slice(0, 32);
    if (!empId || !/^[A-Z0-9_-]{1,32}$/.test(empId)) {
      return { error: `Invalid employee ID "${rawEmpId}" in lead flow rules.` };
    }
    if (!val || typeof val !== 'object' || Array.isArray(val)) {
      return { error: `Rule for ${empId} must be an object.` };
    }
    const obj = val as Record<string, unknown>;
    const eligible = typeof obj.eligible === 'boolean' ? obj.eligible : true;
    const rawScope = typeof obj.countryScope === 'string' ? obj.countryScope.trim() : 'china_only';
    if (!VALID_SCOPES.has(rawScope as CounselorCountryScope)) {
      return { error: `Invalid country scope "${rawScope}" for ${empId}.` };
    }
    const rawCap = obj.dailyCap === undefined || obj.dailyCap === null || obj.dailyCap === '' ? 0 : Number(obj.dailyCap);
    if (!Number.isFinite(rawCap) || !Number.isInteger(rawCap) || rawCap < 0 || rawCap > 500) {
      return { error: `Daily cap for ${empId} must be an integer between 0 and 500.` };
    }
    clean[empId] = {
      eligible,
      countryScope: rawScope as CounselorCountryScope,
      dailyCap: rawCap,
    };
  }
  return { rules: clean };
}

export function validateLeadFlowRulesJson(raw: string): { normalized?: string; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { normalized: '' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { error: 'leadFlowRulesJson must be valid JSON.' };
  }
  const checked = normalizeLeadFlowRulesObject(parsed);
  if (!checked.rules) return { error: checked.error };
  return { normalized: JSON.stringify(checked.rules) };
}

export function parseLeadFlowConfig(
  settings: Record<string, string | undefined>,
): LeadFlowSettingsConfig {
  const rawMode = (settings.leadFlowMode || '').trim() as LeadFlowMode;
  const mode: LeadFlowMode = VALID_MODES.has(rawMode) ? rawMode : 'auto_balanced';

  const rawAtt = (settings.leadFlowAttendanceFilter || '').trim() as LeadFlowAttendanceFilter;
  const attendanceFilter: LeadFlowAttendanceFilter = VALID_ATTENDANCE.has(rawAtt)
    ? rawAtt
    : 'all_eligible';

  const onlyDistributeUntouched = settings.leadFlowOnlyUntouched !== 'false';

  let rulesByEmpId: Record<string, CounselorFlowRule> = {};
  if (settings.leadFlowRulesJson?.trim()) {
    try {
      const parsed = JSON.parse(settings.leadFlowRulesJson);
      const checked = normalizeLeadFlowRulesObject(parsed);
      if (checked.rules) rulesByEmpId = checked.rules;
    } catch {
      rulesByEmpId = {};
    }
  }

  return {
    mode,
    attendanceFilter,
    onlyDistributeUntouched,
    rulesByEmpId,
  };
}

export function selectCounselorByFlowConfig<T extends LeadFlowCandidate>(
  candidates: T[],
  leadInput: LeadRoutingMatchInput,
  config: LeadFlowSettingsConfig,
  options?: { ignoreManualMode?: boolean },
): { chosen: T | null; reason: string } {
  if (config.mode === 'manual_queue' && !options?.ignoreManualMode) {
    return { chosen: null, reason: 'manual_queue' };
  }
  if (!candidates.length) {
    return { chosen: null, reason: 'no_employees' };
  }

  const matched = candidates.filter((emp) => {
    const rule = resolveEmployeeFlowRule(emp, config.rulesByEmpId);
    if (!rule.eligible) return false;
    if (!doesCountryScopeMatchLead(rule.countryScope, leadInput)) return false;
    if (rule.dailyCap > 0 && (emp.todayAssignedCount ?? 0) >= rule.dailyCap) return false;
    return true;
  });

  if (!matched.length) {
    return { chosen: null, reason: 'no_matching_counselor' };
  }

  let pool = matched;
  if (config.attendanceFilter === 'strict_checked_in') {
    pool = matched.filter((c) => Boolean(c.checkedInToday));
    if (!pool.length) return { chosen: null, reason: 'no_checked_in_counselor' };
  } else if (config.attendanceFilter === 'prefer_checked_in') {
    const checkedInPool = matched.filter((c) => Boolean(c.checkedInToday));
    if (checkedInPool.length) pool = checkedInPool;
  }

  const effectiveMode =
    config.mode === 'manual_queue' && options?.ignoreManualMode ? 'auto_balanced' : config.mode;

  const sorted = [...pool].sort((a, b) => {
    if (effectiveMode === 'round_robin') {
      const todayDiff = (a.todayAssignedCount ?? 0) - (b.todayAssignedCount ?? 0);
      if (todayDiff !== 0) return todayDiff;
      const lastDiff = (a.lastAssignedAtMs ?? 0) - (b.lastAssignedAtMs ?? 0);
      if (lastDiff !== 0) return lastDiff;
    }
    const activeDiff = a.activeCount - b.activeCount;
    if (activeDiff !== 0) return activeDiff;
    const todayDiff = (a.todayAssignedCount ?? 0) - (b.todayAssignedCount ?? 0);
    if (todayDiff !== 0) return todayDiff;
    const lastDiff = (a.lastAssignedAtMs ?? 0) - (b.lastAssignedAtMs ?? 0);
    if (lastDiff !== 0) return lastDiff;
    return a.empId.localeCompare(b.empId);
  });

  return { chosen: sorted[0] || null, reason: 'assigned' };
}

/** Sorts batch leads so narrow-country leads (non-China) assign before broad China leads, balancing total workload across Mukta vs China-only counselors. */
export function sortLeadsForBalancedDistribution<T extends LeadRoutingMatchInput>(leads: T[]): T[] {
  return [...leads].sort((a, b) => {
    const aChina = isChinaDestination(a) ? 1 : 0;
    const bChina = isChinaDestination(b) ? 1 : 0;
    return aChina - bChina;
  });
}

export const THREE_OFFICE_COUNSELORS_PRESET = [
  {
    match: /\bmukta\b/i,
    canonicalName: 'Mukta Rahaman',
    role: 'Senior Consultant',
    team: 'all',
    countryScope: 'all' as CounselorCountryScope,
  },
  {
    match: /\bafsana\b/i,
    canonicalName: 'Afsana Meme',
    role: 'Senior Consultant',
    team: 'china',
    countryScope: 'china_only' as CounselorCountryScope,
  },
  {
    match: /\b(shamoyla|mim)\b/i,
    canonicalName: 'Shamoyla Narmin',
    role: 'Consultant',
    team: 'china',
    countryScope: 'china_only' as CounselorCountryScope,
  },
] as const;
