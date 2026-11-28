// Pure Asia/Dhaka (GMT+6) date helpers & 4-pillar Employee KPI + Workflow computation
import { resolveAttendanceLocationStatus, type OfficeLocationStatus } from './office-location';
import { categorizeLeadSource, formatFriendlySource, getSourceCategoryDef, type LeadSourceCategory } from './lead-sources';

export const KPI_ACT_WEIGHTS: Record<string, number> = {
  call_logged: 3,
  discussion_logged: 2,
  lead_created: 3,
  lead_status_changed: 2,
  lead_assigned: 1,
  lead_updated_via_app: 2,
  payment_recorded: 3,
  application_opened: 3,
  application_stage_changed: 3,
  embassy_status_changed: 2,
  uni_app_status: 3,
  document_updated: 2,
  reply_to_student: 2,
  note: 2,
  task_completed: 3,
  daily_log_submitted: 1,
  daily_log_updated: 1,
  attendance_in: 1,
};

export const KPI_ACT_GROUPS: Record<string, string[]> = {
  lead_work: ['lead_created', 'lead_status_changed', 'lead_assigned', 'lead_updated_via_app', 'payment_recorded'],
  application: ['application_opened', 'application_stage_changed', 'embassy_status_changed', 'uni_app_status', 'document_updated'],
  communication: ['call_logged', 'discussion_logged', 'reply_to_student', 'note'],
  tasks: ['task_completed', 'daily_log_submitted', 'daily_log_updated', 'attendance_in'],
};

export const CLOSED_LEAD_STATUSES = new Set([
  'enrolled',
  'converted',
  'not_interested',
  'closed',
  'Enrolled',
  'Not Interested',
  'Documents Withdraw',
  'Application Withdraw',
]);

export function dhakaTodayIso(nowMs = Date.now()): string {
  return new Date(nowMs + 6 * 3600 * 1000).toISOString().slice(0, 10);
}

export function dhakaTimeNow(nowMs = Date.now()): string {
  return new Date(nowMs + 6 * 3600 * 1000).toISOString().slice(11, 16);
}

export function toDhakaDate(ts: Date | string | null | undefined): string | null {
  if (!ts) return null;
  const d = ts instanceof Date ? ts : new Date(ts);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getTime() + 6 * 3600 * 1000).toISOString().slice(0, 10);
}

export function toDhakaTime(ts: Date | string | null | undefined): string | null {
  if (!ts) return null;
  const d = ts instanceof Date ? ts : new Date(ts);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getTime() + 6 * 3600 * 1000).toISOString().slice(11, 16);
}

export function shiftIsoDays(isoDateStr: string, deltaDays: number): string {
  const d = new Date(`${isoDateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

export function isDhakaWeekend(dayOfWeek: number): boolean {
  // EduExpress Dhaka HQ operates Saturday–Thursday and is closed Friday only.
  return dayOfWeek === 5;
}

export function normalizeMonthParam(rawMonth?: string | null, nowMs = Date.now()): string {
  if (rawMonth && /^\d{4}-(0[1-9]|1[0-2])$/.test(rawMonth.trim())) return rawMonth.trim();
  return dhakaTodayIso(nowMs).slice(0, 7);
}

export function computeHoursWorked(checkIn?: string | null, checkOut?: string | null): number {
  if (!checkIn || !checkOut) return 0;
  const parseMinutes = (hhmm: string) => {
    const m = /^(\d{1,2}):(\d{2})/.exec(hhmm.trim());
    if (!m) return null;
    return Number(m[1]) * 60 + Number(m[2]);
  };
  const startMin = parseMinutes(checkIn);
  const endMin = parseMinutes(checkOut);
  if (startMin === null || endMin === null || endMin <= startMin) return 0;
  return Number(((endMin - startMin) / 60).toFixed(2));
}

export interface KpiEmployeeRow {
  id: string;
  empId: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  team: string;
  specialization: string | null;
  active: boolean;
  userId: string | null;
}

export interface KpiAttendanceRow {
  id: string;
  employeeId: string;
  empId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hoursWorked: number;
  status: string;
  source?: string | null;
  notes?: string | null;
}

export interface KpiDailyLogRow {
  id: string;
  employeeId: string;
  empId: string;
  date: string;
  accomplishments: string | null;
  challenges: string | null;
  tomorrowPlan: string | null;
  metricsJson: string | null;
  submittedAt: Date | string;
}

export interface KpiTargetRow {
  employeeId: string | null;
  consultant: string;
  month: string;
  targetLeads: number;
  targetEnrolled: number;
  targetRevenue: number;
  targetDailyActions: number;
  targetFollowups: number;
  maxSlaHours: number;
}

export interface KpiTaskRow {
  id: string;
  title: string;
  details: string | null;
  assignedTo: string | null;
  employeeId: string | null;
  assignedBy: string | null;
  dueDate: string | null;
  priority: string;
  status: string;
  category: string | null;
  leadId: string | null;
  completedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface KpiLeadRow {
  id: string;
  name: string;
  phone: string;
  country: string;
  status: string;
  source?: string | null;
  utm?: unknown;
  message?: string | null;
  channelType?: string | null;
  isApplication?: boolean;
  referrer?: string | null;
  applicationStage: string;
  assignedTo: string | null;
  assignedEmployeeId: string | null;
  nextFollowup: string | null;
  gpa: number | null;
  assessAcademicResults: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface KpiSourceMetric {
  source: string;
  category: LeadSourceCategory;
  categoryLabel: string;
  totalLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  filesOpened: number;
  conversionRatePct: number;
}

export interface MetaAdLeadPreview {
  id: string;
  name: string;
  phone: string;
  country: string;
  status: string;
  applicationStage: string;
  isApplication: boolean;
  gpa: number | null;
  academicText: string | null;
  assignedTo: string | null;
  createdAt: string;
}

export interface KpiMetaAdMetric {
  adKey: string;
  adId: string | null;
  adName: string;
  rawCode: string | null;
  adsetName: string | null;
  campaignName: string;
  formName: string | null;
  channel: 'instant_form' | 'website_ad' | 'meta_other';
  channelLabel: string;
  attributionQuality: 'direct_ad' | 'creative_utm' | 'campaign_only';
  totalLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  filesOpened: number;
  enrolledCount: number;
  highGpaCount: number;
  avgGpa: number | null;
  contactRatePct: number;
  conversionRatePct: number;
  qualityScore: number;
  verdict: 'winner' | 'working' | 'review' | 'testing';
  verdictLabel: string;
  leads: MetaAdLeadPreview[];
}

export interface KpiActivityRow {
  id: string;
  type: string;
  actorName: string | null;
  actorUserId: string | null;
  employeeId: string | null;
  leadId: string | null;
  leadName: string | null;
  fromValue: string | null;
  toValue: string | null;
  details: string | null;
  createdAt: Date | string;
}

export type WorkflowStageKey = 'on_track' | 'needs_attention' | 'not_checked_in' | 'idle' | 'weekend';

export interface DailySeriesPoint {
  date: string;
  actions: number;
  hasAttendance: boolean;
  hasLog: boolean;
  isWeekend: boolean;
}

export interface ComputedEmployeeKpi {
  employee: KpiEmployeeRow;
  score: number;
  pillars: {
    attendance: number;
    discipline: number;
    activity: number;
    execution: number;
  };
  attendance: {
    present: number;
    late: number;
    absent: number;
    hours: number;
    pct: number;
    todayCheckIn: string | null;
    todayCheckOut: string | null;
    todayStatus: string | null;
    todayLocationType?: OfficeLocationStatus;
    todayLocationLabel?: string | null;
    todayDistanceMeters?: number | null;
    todayMapsUrl?: string | null;
  };
  discipline: {
    logsSubmitted: number;
    pct: number;
    streak: number;
    todayLogSubmitted: boolean;
  };
  activity: {
    totalEvents: number;
    weightedScore: number;
    todayEvents: number;
    todayWeighted: number;
    dailyAvg: number;
    targetDailyActions: number;
    touchedLeadsMonth: number;
    breakdown: Record<string, number>;
    groups: Record<string, number>;
  };
  funnel: {
    totalAssigned: number;
    activeLeads: number;
    newThisMonth: number;
    qualifiedCount: number;
    applicationStartedCount: number;
    admittedCount: number;
    enrolledCount: number;
    callsLogged: number;
    filesOpened: number;
    conversionRatePct: number;
    todayCallsLogged?: number;
    todayTouchedLeads?: number;
    todayFilesOpened?: number;
  };
  sla: {
    maxSlaHours: number;
    uncontactedOverdue: number;
    followupsDueToday: number;
    followupsOverdue: number;
    compliancePct: number;
  };
  tasks: {
    open: number;
    inProgress: number;
    blocked: number;
    overdue: number;
    doneMonth: number;
    completionPct: number;
  };
  workflowStage: WorkflowStageKey;
  dailySeries: DailySeriesPoint[];
}

export interface SlaBottleneckLead {
  id: string;
  name: string;
  phone: string;
  country: string;
  status: string;
  assignedTo: string | null;
  assignedEmployeeId: string | null;
  nextFollowup: string | null;
  issueType: 'untouched_sla' | 'followup_overdue' | 'followup_due_today';
  ageHours: number;
  maxSlaHours: number;
  createdAt: string;
}

export interface KpiReportResult {
  month: string;
  today: string;
  workingDays: number;
  effWorkingDays: number;
  isWorkingDayToday: boolean;
  summary: {
    activeEmployees: number;
    avgScore: number;
    checkedInToday: number;
    logsSubmittedToday: number;
    totalEventsMonth: number;
    totalOverdueFollowups: number;
    totalUntouchedOverdue: number;
    totalOpenTasks: number;
  };
  employees: ComputedEmployeeKpi[];
  slaBottlenecks: SlaBottleneckLead[];
  sourceMetrics: KpiSourceMetric[];
  metaAdMetrics: KpiMetaAdMetric[];
  metaAdMetricsAllTime: KpiMetaAdMetric[];
}

const GENERIC_ACTOR_NAMES = new Set([
  'admin',
  'administrator',
  'system',
  'staff',
  'counselor',
  'consultant',
  'eduexpress',
  'auto-assign engine',
]);

interface EmployeeAliases {
  exact: Set<string>;
  names: Set<string>;
}

function buildAliases(emp: KpiEmployeeRow): EmployeeAliases {
  const exact = new Set<string>();
  const names = new Set<string>();
  const name = emp.name.trim().toLowerCase();
  if (name) {
    exact.add(name);
    names.add(name);
    const firstWord = name.split(/\s+/)[0];
    if (firstWord && firstWord.length >= 4 && firstWord !== 'mohammad' && firstWord !== 'mohammed') {
      names.add(firstWord);
    }
    if (name.includes('shamoyla')) {
      exact.add('mim');
      names.add('shamoyla');
    }
    if (name.includes('taj')) {
      exact.add('taj');
      names.add('taj ahmed');
      names.add('md taj ahmed');
      names.add('taj ahmmed');
    }
    if (name.includes('tamal')) names.add('tamal');
    if (name.includes('manjurul')) names.add('manjurul');
    if (name.includes('rakib')) names.add('rakib');
    if (name.includes('jubaer') || name.includes('sakib')) {
      names.add('jubaer');
      names.add('sakib');
    }
  }
  exact.add(emp.empId.trim().toLowerCase());
  if (emp.email) exact.add(emp.email.trim().toLowerCase());
  return { exact, names };
}

function matchesEmployeeName(raw: string | null | undefined, aliases: EmployeeAliases): boolean {
  const val = (raw || '').trim().toLowerCase();
  if (!val || GENERIC_ACTOR_NAMES.has(val)) return false;
  if (aliases.exact.has(val)) return true;
  if (val.length < 4) return false;
  for (const alias of aliases.names) {
    if (alias.length >= 5 && (val.includes(alias) || alias.includes(val))) return true;
  }
  return false;
}

function isAttendancePresentStatus(status: string | null | undefined): boolean {
  const s = (status || '').trim().toLowerCase();
  return s === 'present' || s === 'on_time' || s === 'on time' || s === 'half_day' || s === 'half day';
}

function isAttendanceLateStatus(status: string | null | undefined): boolean {
  return (status || '').trim().toLowerCase() === 'late';
}

export function computeEmployeeKpiReport(input: {
  month?: string | null;
  nowMs?: number;
  employees: KpiEmployeeRow[];
  attendances: KpiAttendanceRow[];
  dailyLogs: KpiDailyLogRow[];
  targets: KpiTargetRow[];
  tasks: KpiTaskRow[];
  leads: KpiLeadRow[];
  activities: KpiActivityRow[];
}): KpiReportResult {
  const nowMs = input.nowMs ?? Date.now();
  const month = normalizeMonthParam(input.month, nowMs);
  const [y, m] = month.split('-').map(Number);
  const start = `${month}-01`;
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const end = `${month}-${String(daysInMonth).padStart(2, '0')}`;
  const today = dhakaTodayIso(nowMs);

  let workingDays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    if (!isDhakaWeekend(dow)) workingDays++;
  }

  let effWorking = 0;
  const todayInMonth = today >= start && today <= end;
  const cutoff = todayInMonth ? today : today < start ? start : end;
  if (today >= start) {
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${month}-${String(d).padStart(2, '0')}`;
      if (dateStr > cutoff) break;
      const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
      if (!isDhakaWeekend(dow)) effWorking++;
    }
  }
  const cutoffDayNum = Number(cutoff.slice(8, 10)) || daysInMonth;

  const todayDow = new Date(
    Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1, Number(today.slice(8, 10))),
  ).getUTCDay();
  const isWorkingDayToday = !isDhakaWeekend(todayDow);

  // Map latest human touch timestamp per lead (exclude system creation, student messages, and lead assignment)
  const lastTouchByLead = new Map<string, number>();
  for (const act of input.activities) {
    if (!act.leadId) continue;
    if (act.type === 'lead_created' || act.type === 'student_message' || act.type === 'lead_assigned') continue;
    const ms = new Date(act.createdAt).getTime();
    if (!Number.isFinite(ms)) continue;
    const prev = lastTouchByLead.get(act.leadId) || 0;
    if (ms > prev) lastTouchByLead.set(act.leadId, ms);
  }

  const slaBottlenecks: SlaBottleneckLead[] = [];
  const seenBottleneckKeys = new Set<string>();

  const computedEmployees: ComputedEmployeeKpi[] = input.employees.map((emp) => {
    const aliases = buildAliases(emp);
    const targetRow = input.targets.find(
      (t) =>
        t.month === month &&
        (t.employeeId ? t.employeeId === emp.id : matchesEmployeeName(t.consultant, aliases)),
    );
    const targetDailyActions = Math.max(1, targetRow?.targetDailyActions || 12);
    const targetEnrolled = Math.max(0, targetRow?.targetEnrolled || 0);
    const maxSlaHours = Math.max(1, targetRow?.maxSlaHours || 24);

    // Attendance (selected month + today's live check-in even when viewing a past month)
    const empAllAtt = input.attendances.filter((a) => a.employeeId === emp.id || a.empId === emp.empId);
    const attLogs = empAllAtt.filter((a) => a.date >= start && a.date <= end);
    const present = attLogs.filter((a) => isAttendancePresentStatus(a.status)).length;
    const late = attLogs.filter((a) => isAttendanceLateStatus(a.status)).length;
    const absent = Math.max(0, effWorking - present - late);
    const hours = Number(attLogs.reduce((sum, a) => sum + (Number(a.hoursWorked) || 0), 0).toFixed(1));
    const attendancePct = effWorking > 0 ? Math.min(100, Math.round(((present + late) / effWorking) * 100)) : 0;
    const todayAtt = empAllAtt.find((a) => a.date === today) || null;
    const todayLocation = todayAtt?.checkIn ? resolveAttendanceLocationStatus(todayAtt.source, todayAtt.notes) : null;
    const attDates = new Set(attLogs.filter((a) => Boolean(a.checkIn)).map((a) => a.date));

    // Daily logs (selected month + today's live log status)
    const empAllLogs = input.dailyLogs.filter((l) => l.employeeId === emp.id || l.empId === emp.empId);
    const logs = empAllLogs.filter((l) => l.date >= start && l.date <= end);
    const logDates = new Set(logs.map((l) => l.date));
    const logsSubmitted = logs.length;
    const todayLogSubmitted = empAllLogs.some((l) => l.date === today);
    let streak = 0;
    if (today >= start) {
      // On an active working day before EOD submission, count consecutive streak up to yesterday
      let cur = cutoff;
      if (todayInMonth && cur === today && !logDates.has(today)) {
        cur = shiftIsoDays(cur, -1);
      }
      while (cur >= start) {
        const [cy, cm, cd] = cur.split('-').map(Number);
        const dow = new Date(Date.UTC(cy, cm - 1, cd)).getUTCDay();
        if (!isDhakaWeekend(dow)) {
          if (!logDates.has(cur)) break;
          streak++;
        }
        cur = shiftIsoDays(cur, -1);
      }
    }
    const logPct = effWorking > 0 ? Math.min(100, Math.round((logsSubmitted / effWorking) * 100)) : 0;

    // Activities this month (Dhaka date) — strict FK precedence avoids multi-employee double counting
    const empActs = input.activities.filter((a) => {
      const d = toDhakaDate(a.createdAt);
      if (!d || d < start || d > end) return false;
      if (a.employeeId) return a.employeeId === emp.id;
      if (emp.userId && a.actorUserId) return a.actorUserId === emp.userId;
      return matchesEmployeeName(a.actorName, aliases);
    });

    const actByType: Record<string, number> = {};
    const actionsByDay = new Map<string, number>();
    const touchedLeadIds = new Set<string>();
    const todayTouchedLeadIds = new Set<string>();
    let todayCallsLogged = 0;
    let todayFilesOpenedEvents = 0;
    let actScore = 0;
    let todayEvents = 0;
    let todayWeighted = 0;

    for (const a of empActs) {
      actByType[a.type] = (actByType[a.type] || 0) + 1;
      const w = KPI_ACT_WEIGHTS[a.type] || 1;
      actScore += w;
      const d = toDhakaDate(a.createdAt);
      if (d) {
        actionsByDay.set(d, (actionsByDay.get(d) || 0) + 1);
        if (d === today) {
          todayEvents++;
          todayWeighted += w;
          if (a.type === 'call_logged') {
            todayCallsLogged++;
          }
          if (a.type === 'application_opened') {
            todayFilesOpenedEvents++;
          }
          if (a.leadId && a.type !== 'student_message') {
            todayTouchedLeadIds.add(a.leadId);
          }
        }
      }
      if (a.leadId && a.type !== 'student_message') {
        touchedLeadIds.add(a.leadId);
      }
    }

    const groupTotals = Object.fromEntries(
      Object.entries(KPI_ACT_GROUPS).map(([g, types]) => [
        g,
        types.reduce((sum, t) => sum + (actByType[t] || 0), 0),
      ]),
    );
    const totalEvents = Object.values(actByType).reduce((sum, n) => sum + n, 0);

    const dailySeries: DailySeriesPoint[] = [];
    if (today >= start) {
      for (let d = 1; d <= cutoffDayNum; d++) {
        const ds = `${month}-${String(d).padStart(2, '0')}`;
        const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
        dailySeries.push({
          date: ds,
          actions: actionsByDay.get(ds) || 0,
          hasAttendance: attDates.has(ds),
          hasLog: logDates.has(ds),
          isWeekend: isDhakaWeekend(dow),
        });
      }
    }

    // Assigned leads & SLA check — strict FK precedence
    const empLeads = input.leads.filter((l) => {
      if (l.assignedEmployeeId) return l.assignedEmployeeId === emp.id;
      if (matchesEmployeeName(l.assignedTo, aliases)) return true;
      return Boolean(l.isApplication && !l.assignedTo && matchesEmployeeName(l.referrer, aliases));
    });
    const activeLeads = empLeads.filter((l) => !CLOSED_LEAD_STATUSES.has(l.status));
    const newThisMonth = empLeads.filter((l) => toDhakaDate(l.createdAt)?.slice(0, 7) === month).length;
    const qualifiedCount = empLeads.filter((l) => l.status === 'qualified').length;
    const applicationStartedCount = empLeads.filter(
      (l) =>
        (l.isApplication &&
          !['documents_withdraw', 'application_withdraw'].includes(l.applicationStage)) ||
        [
          'application_started',
          'application_submitted',
          'admission_received',
          'visa_applied',
          'visa_approved',
          'enrolled',
          'converted',
        ].includes(l.status),
    ).length;
    const admittedCount = empLeads.filter(
      (l) =>
        l.status === 'admission_received' ||
        [
          'pre_admission',
          'admitted',
          'jw202',
          'visa',
          'visa_applied',
          'visa_approved',
          'partial_payment',
          'air_ticket',
          'complete_payment',
          'pre_departure',
        ].includes(l.applicationStage),
    ).length;
    const enrolledCount = empLeads.filter(
      (l) =>
        l.status === 'enrolled' ||
        l.status === 'converted' ||
        l.applicationStage === 'enrolled' ||
        l.applicationStage === 'fly',
    ).length;

    const pushBottleneck = (item: SlaBottleneckLead) => {
      const key = `${item.id}:${item.issueType}`;
      if (seenBottleneckKeys.has(key)) return;
      seenBottleneckKeys.add(key);
      slaBottlenecks.push(item);
    };

    let uncontactedOverdue = 0;
    let followupsDueToday = 0;
    let followupsOverdue = 0;

    for (const l of activeLeads) {
      const createdMs = new Date(l.createdAt).getTime();
      const ageHours = Number.isFinite(createdMs) ? Math.max(0, Math.round((nowMs - createdMs) / 3600000)) : 0;
      const followDate = l.nextFollowup ? l.nextFollowup.slice(0, 10) : null;

      if (followDate === today) {
        followupsDueToday++;
        pushBottleneck({
          id: l.id,
          name: l.name,
          phone: l.phone,
          country: l.country,
          status: l.status,
          assignedTo: l.assignedTo || emp.name,
          assignedEmployeeId: l.assignedEmployeeId || emp.id,
          nextFollowup: l.nextFollowup,
          issueType: 'followup_due_today',
          ageHours,
          maxSlaHours,
          createdAt: new Date(l.createdAt).toISOString(),
        });
      } else if (followDate && followDate < today) {
        followupsOverdue++;
        pushBottleneck({
          id: l.id,
          name: l.name,
          phone: l.phone,
          country: l.country,
          status: l.status,
          assignedTo: l.assignedTo || emp.name,
          assignedEmployeeId: l.assignedEmployeeId || emp.id,
          nextFollowup: l.nextFollowup,
          issueType: 'followup_overdue',
          ageHours,
          maxSlaHours,
          createdAt: new Date(l.createdAt).toISOString(),
        });
      } else if (l.status === 'new' && !lastTouchByLead.has(l.id) && ageHours >= maxSlaHours) {
        uncontactedOverdue++;
        pushBottleneck({
          id: l.id,
          name: l.name,
          phone: l.phone,
          country: l.country,
          status: l.status,
          assignedTo: l.assignedTo || emp.name,
          assignedEmployeeId: l.assignedEmployeeId || emp.id,
          nextFollowup: l.nextFollowup,
          issueType: 'untouched_sla',
          ageHours,
          maxSlaHours,
          createdAt: new Date(l.createdAt).toISOString(),
        });
      }
    }

    const totalLeadIssues = uncontactedOverdue + followupsOverdue;
    const slaCompliancePct = activeLeads.length > 0
      ? Math.max(0, Math.round(100 - (totalLeadIssues / activeLeads.length) * 100))
      : 100;

    // Tasks — strict FK precedence
    const empTasks = input.tasks.filter(
      (t) =>
        t.status !== 'cancelled' &&
        (t.employeeId ? t.employeeId === emp.id : matchesEmployeeName(t.assignedTo, aliases)),
    );
    const tasksOpen = empTasks.filter((t) => t.status === 'open').length;
    const tasksInProgress = empTasks.filter((t) => t.status === 'in_progress').length;
    const tasksBlocked = empTasks.filter((t) => t.status === 'blocked').length;
    const tasksOverdue = empTasks.filter((t) => t.status !== 'done' && t.dueDate && t.dueDate < today).length;
    const tasksDoneMonth = empTasks.filter((t) => {
      if (t.status !== 'done') return false;
      const doneDate = toDhakaDate(t.completedAt || t.updatedAt || t.createdAt);
      return Boolean(doneDate && doneDate >= start && doneDate <= end);
    }).length;
    const activeTaskCount = tasksOpen + tasksInProgress + tasksBlocked;
    const totalRelevantTasks = activeTaskCount + tasksDoneMonth;
    const taskCompletionPct = totalRelevantTasks > 0
      ? Math.round((tasksDoneMonth / totalRelevantTasks) * 100)
      : 100;

    // 4-Pillar Composite Score (0-100)
    const attendanceScore = Math.min(25, (attendancePct / 100) * 25);
    const disciplineScore = Math.min(15, (logPct / 100) * 15);
    const targetActScore = Math.max(1, effWorking * targetDailyActions);
    const activityScore = Math.min(35, (actScore / targetActScore) * 35);

    // Mutually exclusive monthly outcome progression for the Execution pillar
    const monthOutcomeLeads = empLeads.filter((l) => {
      const updatedMonth = toDhakaDate(l.updatedAt)?.slice(0, 7);
      const createdMonth = toDhakaDate(l.createdAt)?.slice(0, 7);
      return updatedMonth === month || createdMonth === month;
    });
    let monthEnrolled = 0;
    let monthAdmittedOnly = 0;
    let monthAppliedOnly = 0;
    for (const l of monthOutcomeLeads) {
      const isEnrolled =
        l.status === 'enrolled' ||
        l.status === 'converted' ||
        l.applicationStage === 'enrolled' ||
        l.applicationStage === 'fly';
      const isAdmitted =
        !isEnrolled &&
        (l.status === 'admission_received' ||
          [
            'pre_admission',
            'admitted',
            'jw202',
            'visa',
            'visa_applied',
            'visa_approved',
            'partial_payment',
            'air_ticket',
            'complete_payment',
            'pre_departure',
          ].includes(l.applicationStage));
      const isApplied =
        !isEnrolled &&
        !isAdmitted &&
        ((l.isApplication &&
          !['documents_withdraw', 'application_withdraw'].includes(l.applicationStage)) ||
          ['application_started', 'application_submitted'].includes(l.status));
      if (isEnrolled) monthEnrolled++;
      else if (isAdmitted) monthAdmittedOnly++;
      else if (isApplied) monthAppliedOnly++;
    }

    let executionScore = 0;
    if (empLeads.length > 0) {
      const slaPart = touchedLeadIds.size > 0 || uncontactedOverdue === 0 ? (slaCompliancePct / 100) * 10 : 0;
      const taskPart = totalRelevantTasks > 0
        ? (taskCompletionPct / 100) * 10
        : Math.min(10, (touchedLeadIds.size / Math.max(1, effWorking)) * 5);
      const outcomePart = targetEnrolled > 0
        ? Math.min(5, ((monthAppliedOnly * 0.5 + monthAdmittedOnly + monthEnrolled * 2) / targetEnrolled) * 5)
        : Math.min(5, monthAppliedOnly * 0.5 + monthAdmittedOnly * 1 + monthEnrolled * 2);
      executionScore = slaPart + taskPart + outcomePart;
    } else {
      const taskPart = totalRelevantTasks > 0 ? (taskCompletionPct / 100) * 15 : 0;
      const throughputPart = Math.min(10, (actScore / targetActScore) * 10);
      executionScore = taskPart + throughputPart;
    }

    const score = Math.round(attendanceScore + disciplineScore + activityScore + executionScore);
    const filesOpened = empLeads.filter(
      (l) =>
        (l.isApplication && !['documents_withdraw', 'application_withdraw'].includes(l.applicationStage)) ||
        [
          'application_started',
          'application_submitted',
          'admission_received',
          'visa_applied',
          'visa_approved',
          'enrolled',
          'converted',
        ].includes(l.status),
    ).length;
    const todayFilesOpened =
      todayFilesOpenedEvents > 0
        ? todayFilesOpenedEvents
        : empLeads.filter(
            (l) =>
              (l.isApplication ||
                ['application_started', 'application_submitted', 'admission_received', 'visa_applied', 'visa_approved'].includes(
                  l.status,
                )) &&
              toDhakaDate(l.createdAt) === today,
          ).length;
    const callsLogged = actByType['call_logged'] || 0;
    const conversionRatePct = empLeads.length > 0 ? Number(((filesOpened / empLeads.length) * 100).toFixed(1)) : 0;

    let workflowStage: WorkflowStageKey = 'on_track';
    if (!isWorkingDayToday) {
      workflowStage = todayEvents > 0 || Boolean(todayAtt?.checkIn) ? 'on_track' : 'weekend';
    } else if (!todayAtt?.checkIn) {
      workflowStage = 'not_checked_in';
    } else if (uncontactedOverdue > 0 || followupsOverdue > 0 || tasksOverdue > 0) {
      workflowStage = 'needs_attention';
    } else if (todayEvents === 0 && !todayLogSubmitted) {
      workflowStage = 'idle';
    }

    return {
      employee: emp,
      score,
      pillars: {
        attendance: Math.round(attendanceScore),
        discipline: Math.round(disciplineScore),
        activity: Math.round(activityScore),
        execution: Math.round(executionScore),
      },
      attendance: {
        present,
        late,
        absent,
        hours,
        pct: attendancePct,
        todayCheckIn: todayAtt?.checkIn || null,
        todayCheckOut: todayAtt?.checkOut || null,
        todayStatus: todayAtt?.status || null,
        ...(todayLocation
          ? {
              todayLocationType: todayLocation.locationType,
              todayLocationLabel: todayLocation.locationLabel,
              todayDistanceMeters: todayLocation.distanceMeters,
              todayMapsUrl: todayLocation.mapsUrl,
            }
          : {}),
      },
      discipline: {
        logsSubmitted,
        pct: logPct,
        streak,
        todayLogSubmitted,
      },
      activity: {
        totalEvents,
        weightedScore: actScore,
        todayEvents,
        todayWeighted,
        dailyAvg: effWorking > 0 ? Number((totalEvents / effWorking).toFixed(1)) : 0,
        targetDailyActions,
        touchedLeadsMonth: touchedLeadIds.size,
        breakdown: actByType,
        groups: groupTotals,
      },
      funnel: {
        totalAssigned: empLeads.length,
        activeLeads: activeLeads.length,
        newThisMonth,
        qualifiedCount,
        applicationStartedCount,
        admittedCount,
        enrolledCount,
        callsLogged,
        filesOpened,
        conversionRatePct,
        todayCallsLogged,
        todayTouchedLeads: todayTouchedLeadIds.size,
        todayFilesOpened,
      },
      sla: {
        maxSlaHours,
        uncontactedOverdue,
        followupsDueToday,
        followupsOverdue,
        compliancePct: slaCompliancePct,
      },
      tasks: {
        open: tasksOpen,
        inProgress: tasksInProgress,
        blocked: tasksBlocked,
        overdue: tasksOverdue,
        doneMonth: tasksDoneMonth,
        completionPct: taskCompletionPct,
      },
      workflowStage,
      dailySeries,
    };
  });

  // Also include unassigned new leads exceeding 24h in global SLA bottlenecks
  for (const l of input.leads) {
    if (l.assignedEmployeeId || l.assignedTo || CLOSED_LEAD_STATUSES.has(l.status)) continue;
    const createdMs = new Date(l.createdAt).getTime();
    const ageHours = Number.isFinite(createdMs) ? Math.max(0, Math.round((nowMs - createdMs) / 3600000)) : 0;
    if (l.status === 'new' && ageHours >= 24 && slaBottlenecks.length < 150) {
      slaBottlenecks.push({
        id: l.id,
        name: l.name,
        phone: l.phone,
        country: l.country,
        status: l.status,
        assignedTo: 'Unassigned',
        assignedEmployeeId: null,
        nextFollowup: l.nextFollowup,
        issueType: 'untouched_sla',
        ageHours,
        maxSlaHours: 24,
        createdAt: new Date(l.createdAt).toISOString(),
      });
    }
  }

  computedEmployees.sort((a, b) => b.score - a.score || b.activity.weightedScore - a.activity.weightedScore);
  slaBottlenecks.sort((a, b) => {
    const rank = { followup_overdue: 0, untouched_sla: 1, followup_due_today: 2 };
    return rank[a.issueType] - rank[b.issueType] || b.ageHours - a.ageHours;
  });

  const activeCount = computedEmployees.length;
  const avgScore = activeCount
    ? Math.round(computedEmployees.reduce((sum, e) => sum + e.score, 0) / activeCount)
    : 0;

  const sourceMap = new Map<string, {
    source: string;
    category: LeadSourceCategory;
    totalLeads: number;
    contactedLeads: number;
    qualifiedLeads: number;
    filesOpened: number;
  }>();

  // Month-scoped acquisition source metrics (matching report.month)
  const monthLeadsForSource = input.leads.filter((l) => {
    const d = toDhakaDate(l.createdAt);
    return Boolean(d && d >= start && d <= end);
  });

  for (const l of monthLeadsForSource) {
    const s = l.source || 'website';
    const cat = categorizeLeadSource(s, l.utm, l.channelType);
    let entry = sourceMap.get(s);
    if (!entry) {
      entry = {
        source: s,
        category: cat,
        totalLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        filesOpened: 0,
      };
      sourceMap.set(s, entry);
    }
    entry.totalLeads += 1;
    if (l.status !== 'new') entry.contactedLeads += 1;
    if (['qualified', 'consultation_scheduled', 'consultation_completed'].includes(l.status)) entry.qualifiedLeads += 1;
    if (
      (l.isApplication && !['documents_withdraw', 'application_withdraw'].includes(l.applicationStage)) ||
      [
        'application_started',
        'application_submitted',
        'admission_received',
        'visa_applied',
        'visa_approved',
        'enrolled',
        'converted',
      ].includes(l.status)
    ) {
      entry.filesOpened += 1;
    }
  }

  const sourceMetrics: KpiSourceMetric[] = Array.from(sourceMap.values())
    .map((e) => ({
      ...e,
      categoryLabel: getSourceCategoryDef(e.category).label,
      conversionRatePct: e.totalLeads > 0 ? Number(((e.filesOpened / e.totalLeads) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.totalLeads - a.totalLeads);

  const metaAdMetrics = computeMetaAdMetrics(monthLeadsForSource);
  const metaAdMetricsAllTime = computeMetaAdMetrics(input.leads);

  return {
    month,
    today,
    workingDays,
    effWorkingDays: effWorking,
    isWorkingDayToday,
    summary: {
      activeEmployees: activeCount,
      avgScore,
      checkedInToday: computedEmployees.filter((e) => Boolean(e.attendance.todayCheckIn)).length,
      logsSubmittedToday: computedEmployees.filter((e) => e.discipline.todayLogSubmitted).length,
      totalEventsMonth: computedEmployees.reduce((sum, e) => sum + e.activity.totalEvents, 0),
      totalOverdueFollowups: computedEmployees.reduce((sum, e) => sum + e.sla.followupsOverdue, 0),
      totalUntouchedOverdue: computedEmployees.reduce((sum, e) => sum + e.sla.uncontactedOverdue, 0),
      totalOpenTasks: computedEmployees.reduce((sum, e) => sum + e.tasks.open + e.tasks.inProgress + e.tasks.blocked, 0),
    },
    employees: computedEmployees,
    slaBottlenecks: slaBottlenecks.slice(0, 100),
    sourceMetrics,
    metaAdMetrics,
    metaAdMetricsAllTime,
  };
}

function parseKpiUtmRecord(utm: unknown): Record<string, string> {
  if (!utm) return {};
  let obj: unknown = utm;
  if (typeof utm === 'string') {
    const trimmed = utm.trim();
    if (!trimmed) return {};
    try {
      obj = JSON.parse(trimmed);
    } catch {
      return {};
    }
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof v === 'string' && v.trim()) out[k.toLowerCase()] = v.trim();
    else if (typeof v === 'number' && Number.isFinite(v)) out[k.toLowerCase()] = String(v);
  }
  return out;
}

function humanizeAdCreativeLabel(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (/[A-Z]/.test(trimmed) && /\s/.test(trimmed)) return trimmed;
  return trimmed
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => {
      const upper = word.toUpperCase();
      if (['IELTS', 'CSCA', 'MBBS', 'CSC', 'BD', 'HSC', 'SSC', 'GPA', 'CGPA', 'UK', 'AI', 'IT', 'PHD'].includes(upper)) {
        return upper;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function extractLeadNumericGpa(gpa: number | null, academicText: string | null): number | null {
  if (typeof gpa === 'number' && Number.isFinite(gpa) && gpa > 0 && gpa <= 5) {
    return Number(gpa.toFixed(2));
  }
  if (!academicText) return null;
  const text = academicText.trim();
  if (!text) return null;
  const m = /(?:gpa|cgpa|hsc|ssc)?\s*[:=-]?\s*([1-4]\.\d{1,2}|5(?:\.0{1,2})?)\b/i.exec(text);
  if (!m) return null;
  const parsed = Number.parseFloat(m[1]);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= 5 ? Number(parsed.toFixed(2)) : null;
}

export interface ExtractedMetaAdAttribution {
  adKey: string;
  adId: string | null;
  adName: string;
  rawCode: string | null;
  adsetName: string | null;
  campaignName: string;
  formName: string | null;
  channel: 'instant_form' | 'website_ad' | 'meta_other';
  channelLabel: string;
  attributionQuality: 'direct_ad' | 'creative_utm' | 'campaign_only';
}

export function extractMetaAdAttribution(
  lead: Pick<KpiLeadRow, 'source' | 'utm' | 'message' | 'channelType'>,
): ExtractedMetaAdAttribution | null {
  const utm = parseKpiUtmRecord(lead.utm);
  const msg = typeof lead.message === 'string' ? lead.message : '';
  const isInstantFormMsg = /meta instant form/i.test(msg);
  const category = categorizeLeadSource(lead.source, lead.utm, lead.channelType);
  const hasMetaUtm = Boolean(
    utm.ad_id ||
      utm.ad_name ||
      utm.adset_name ||
      utm.meta_lead_id ||
      utm.fbclid ||
      utm.utm_medium === 'meta_instant_form' ||
      /^(facebook|fb|instagram|ig|meta)$/i.test(utm.utm_source || ''),
  );

  if (category !== 'paid' && !isInstantFormMsg && !hasMetaUtm) {
    return null;
  }

  const msgFormMatch = /Meta Instant Form\s*\(([^)]+)\)/i.exec(msg);
  const msgCampaignMatch = /(?:^|\|)\s*Campaign:\s*([^|]+)/i.exec(msg);
  const msgAdMatch = /(?:^|\|)\s*Ad:\s*([^|]+)/i.exec(msg);

  const formName = utm.form_name || msgFormMatch?.[1]?.trim() || null;
  const msgAdName = msgAdMatch?.[1]?.trim() || null;
  const campaignName =
    utm.campaign_name ||
    utm.utm_campaign ||
    msgCampaignMatch?.[1]?.trim() ||
    formatFriendlySource(lead.source);
  const adsetName = utm.adset_name || null;

  const numericTerm = utm.utm_term && /^\d{8,24}$/.test(utm.utm_term) ? utm.utm_term : null;
  const adId = utm.ad_id || numericTerm || null;
  const isInstantForm = Boolean(
    isInstantFormMsg || utm.utm_medium === 'meta_instant_form' || utm.form_id || utm.meta_lead_id,
  );
  const isWebsiteMetaAd = Boolean(
    !isInstantForm &&
      (utm.utm_medium === 'paid_social' || utm.utm_content || utm.utm_term || utm.fbclid || hasMetaUtm),
  );

  const channel: ExtractedMetaAdAttribution['channel'] = isInstantForm
    ? 'instant_form'
    : isWebsiteMetaAd
      ? 'website_ad'
      : 'meta_other';
  const channelLabel =
    channel === 'instant_form'
      ? 'Meta Instant Form'
      : channel === 'website_ad'
        ? 'Meta Website Ad'
        : 'Paid Ad';

  if (utm.ad_name || msgAdName) {
    const adName = utm.ad_name || msgAdName!;
    const rawCode = utm.utm_content && utm.utm_content !== adName ? utm.utm_content : null;
    return {
      adKey: adId ? `${channel}:id:${adId}` : `${channel}:name:${campaignName.toLowerCase()}:${adName.toLowerCase()}`,
      adId,
      adName,
      rawCode,
      adsetName,
      campaignName,
      formName,
      channel,
      channelLabel,
      attributionQuality: 'direct_ad',
    };
  }

  if (utm.utm_content) {
    const adName = humanizeAdCreativeLabel(utm.utm_content);
    return {
      adKey: adId
        ? `${channel}:id:${adId}`
        : `${channel}:content:${campaignName.toLowerCase()}:${utm.utm_content.toLowerCase()}`,
      adId,
      adName,
      rawCode: utm.utm_content,
      adsetName,
      campaignName,
      formName,
      channel,
      channelLabel,
      attributionQuality: adId ? 'direct_ad' : 'creative_utm',
    };
  }

  if (adId) {
    return {
      adKey: `${channel}:id:${adId}`,
      adId,
      adName: `Meta Ad #${adId.slice(-6)}`,
      rawCode: adId,
      adsetName,
      campaignName,
      formName,
      channel,
      channelLabel,
      attributionQuality: 'direct_ad',
    };
  }

  if (isInstantForm) {
    const label = formName ? `Instant Form: ${formName}` : 'Meta Instant Form (Unsplit)';
    return {
      adKey: `instant_form:unsplit:${(formName || campaignName).toLowerCase()}`,
      adId: null,
      adName: label,
      rawCode: null,
      adsetName,
      campaignName,
      formName,
      channel: 'instant_form',
      channelLabel: 'Meta Instant Form',
      attributionQuality: 'campaign_only',
    };
  }

  return {
    adKey: `campaign:${campaignName.toLowerCase()}`,
    adId: null,
    adName: campaignName,
    rawCode: lead.source || null,
    adsetName,
    campaignName,
    formName,
    channel,
    channelLabel,
    attributionQuality: 'campaign_only',
  };
}

export function computeMetaAdMetrics(leads: KpiLeadRow[]): KpiMetaAdMetric[] {
  const buckets = new Map<
    string,
    {
      meta: ExtractedMetaAdAttribution;
      totalLeads: number;
      contactedLeads: number;
      qualifiedLeads: number;
      filesOpened: number;
      enrolledCount: number;
      highGpaCount: number;
      gpaSum: number;
      gpaCount: number;
      leads: MetaAdLeadPreview[];
    }
  >();

  for (const l of leads) {
    const attr = extractMetaAdAttribution(l);
    if (!attr) continue;

    let entry = buckets.get(attr.adKey);
    if (!entry) {
      entry = {
        meta: attr,
        totalLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        filesOpened: 0,
        enrolledCount: 0,
        highGpaCount: 0,
        gpaSum: 0,
        gpaCount: 0,
        leads: [],
      };
      buckets.set(attr.adKey, entry);
    }

    entry.totalLeads += 1;
    if (l.status !== 'new') entry.contactedLeads += 1;

    const isFileOpened =
      (Boolean(l.isApplication) && !['documents_withdraw', 'application_withdraw'].includes(l.applicationStage)) ||
      [
        'application_started',
        'application_submitted',
        'admission_received',
        'visa_applied',
        'visa_approved',
        'enrolled',
        'converted',
      ].includes(l.status);

    const isEnrolled =
      l.status === 'enrolled' ||
      l.status === 'converted' ||
      l.applicationStage === 'enrolled' ||
      l.applicationStage === 'fly';

    if (
      isFileOpened ||
      ['qualified', 'consultation_scheduled', 'consultation_completed'].includes(l.status)
    ) {
      entry.qualifiedLeads += 1;
    }
    if (isFileOpened) entry.filesOpened += 1;
    if (isEnrolled) entry.enrolledCount += 1;

    const numericGpa = extractLeadNumericGpa(l.gpa, l.assessAcademicResults);
    if (numericGpa !== null) {
      entry.gpaSum += numericGpa;
      entry.gpaCount += 1;
      if (numericGpa >= 3.5) entry.highGpaCount += 1;
    }

    entry.leads.push({
      id: l.id,
      name: l.name,
      phone: l.phone,
      country: l.country,
      status: l.status,
      applicationStage: l.applicationStage,
      isApplication: Boolean(l.isApplication),
      gpa: numericGpa,
      academicText: l.assessAcademicResults || null,
      assignedTo: l.assignedTo || null,
      createdAt: new Date(l.createdAt).toISOString(),
    });
  }

  return Array.from(buckets.values())
    .map((b) => {
      const contactRatePct = b.totalLeads > 0 ? Math.round((b.contactedLeads / b.totalLeads) * 100) : 0;
      const conversionRatePct = b.totalLeads > 0 ? Number(((b.filesOpened / b.totalLeads) * 100).toFixed(1)) : 0;
      const qualRatePct = b.totalLeads > 0 ? (b.qualifiedLeads / b.totalLeads) * 100 : 0;
      const gpaRatePct = b.gpaCount > 0 ? (b.highGpaCount / b.gpaCount) * 100 : 0;
      const avgGpa = b.gpaCount > 0 ? Number((b.gpaSum / b.gpaCount).toFixed(2)) : null;

      // 0-100 composite ad lead quality score
      const qualityScore = Math.min(
        100,
        Math.round(
          Math.min(45, conversionRatePct * 3) +
            Math.min(25, qualRatePct * 0.6) +
            Math.min(15, contactRatePct * 0.15) +
            Math.min(15, gpaRatePct * 0.15),
        ),
      );

      let verdict: KpiMetaAdMetric['verdict'] = 'testing';
      let verdictLabel = '🧪 Testing / Early';
      if (
        b.filesOpened >= 3 ||
        (b.filesOpened >= 1 && conversionRatePct >= 8) ||
        (b.totalLeads >= 10 && b.qualifiedLeads >= 5)
      ) {
        verdict = 'winner';
        verdictLabel = '⭐ Winner — Scale';
      } else if (
        b.filesOpened >= 1 ||
        b.qualifiedLeads >= 2 ||
        (b.totalLeads >= 5 && b.highGpaCount / b.totalLeads >= 0.35)
      ) {
        verdict = 'working';
        verdictLabel = '✓ Working Good';
      } else if (b.totalLeads >= 10 && b.filesOpened === 0 && b.qualifiedLeads === 0) {
        verdict = 'review';
        verdictLabel = '⚠️ Review Ad Quality';
      }

      const sortedLeads = b.leads.sort(
        (a, c) => Date.parse(c.createdAt) - Date.parse(a.createdAt),
      );

      return {
        ...b.meta,
        totalLeads: b.totalLeads,
        contactedLeads: b.contactedLeads,
        qualifiedLeads: b.qualifiedLeads,
        filesOpened: b.filesOpened,
        enrolledCount: b.enrolledCount,
        highGpaCount: b.highGpaCount,
        avgGpa,
        contactRatePct,
        conversionRatePct,
        qualityScore,
        verdict,
        verdictLabel,
        leads: sortedLeads,
      };
    })
    .sort(
      (a, b) =>
        b.filesOpened - a.filesOpened ||
        b.qualifiedLeads - a.qualifiedLeads ||
        b.totalLeads - a.totalLeads,
    );
}
