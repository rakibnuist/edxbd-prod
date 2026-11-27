// Pure Asia/Dhaka (GMT+6) date helpers & 4-pillar Employee KPI + Workflow computation
import { resolveAttendanceLocationStatus, type OfficeLocationStatus } from './office-location';
import { categorizeLeadSource, getSourceCategoryDef, type LeadSourceCategory } from './lead-sources';

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

export function normalizeMonthParam(rawMonth?: string | null, nowMs = Date.now()): string {
  if (rawMonth && /^\d{4}-\d{2}$/.test(rawMonth.trim())) return rawMonth.trim();
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
}

function buildAliases(emp: KpiEmployeeRow): Set<string> {
  const aliases = new Set<string>();
  const name = emp.name.trim().toLowerCase();
  if (name) {
    aliases.add(name);
    const firstWord = name.split(/\s+/)[0];
    if (firstWord && firstWord.length >= 4) aliases.add(firstWord);
    if (name.includes('shamoyla')) aliases.add('mim');
    if (name.includes('taj')) {
      aliases.add('taj');
      aliases.add('taj ahmed');
      aliases.add('md taj ahmed');
      aliases.add('taj ahmmed');
    }
    if (name.includes('tamal')) aliases.add('tamal');
    if (name.includes('manjurul')) aliases.add('manjurul');
    if (name.includes('rakib')) aliases.add('rakib');
    if (name.includes('jubaer') || name.includes('sakib')) {
      aliases.add('jubaer');
      aliases.add('sakib');
    }
  }
  aliases.add(emp.empId.trim().toLowerCase());
  if (emp.email) aliases.add(emp.email.trim().toLowerCase());
  return aliases;
}

function matchesEmployeeName(raw: string | null | undefined, aliases: Set<string>): boolean {
  const val = (raw || '').trim().toLowerCase();
  if (!val) return false;
  if (aliases.has(val)) return true;
  for (const alias of aliases) {
    if (alias.length >= 5 && (val.includes(alias) || alias.includes(val))) return true;
  }
  return false;
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
    if (dow !== 5 && dow !== 6) workingDays++;
  }

  let effWorking = 0;
  const todayInMonth = today >= start && today <= end;
  const cutoff = todayInMonth ? today : today < start ? start : end;
  if (today >= start) {
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${month}-${String(d).padStart(2, '0')}`;
      if (dateStr > cutoff) break;
      const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
      if (dow !== 5 && dow !== 6) effWorking++;
    }
  }
  const cutoffDayNum = Number(cutoff.slice(8, 10)) || daysInMonth;

  const todayDow = new Date(
    Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1, Number(today.slice(8, 10))),
  ).getUTCDay();
  const isWorkingDayToday = todayDow !== 5 && todayDow !== 6;

  // Map latest human touch timestamp per lead
  const lastTouchByLead = new Map<string, number>();
  for (const act of input.activities) {
    if (!act.leadId) continue;
    if (act.type === 'lead_created' || act.type === 'student_message') continue;
    const ms = new Date(act.createdAt).getTime();
    if (!Number.isFinite(ms)) continue;
    const prev = lastTouchByLead.get(act.leadId) || 0;
    if (ms > prev) lastTouchByLead.set(act.leadId, ms);
  }

  const slaBottlenecks: SlaBottleneckLead[] = [];

  const computedEmployees: ComputedEmployeeKpi[] = input.employees.map((emp) => {
    const aliases = buildAliases(emp);
    const targetRow = input.targets.find(
      (t) => t.month === month && (t.employeeId === emp.id || matchesEmployeeName(t.consultant, aliases)),
    );
    const targetDailyActions = Math.max(1, targetRow?.targetDailyActions || 12);
    const targetEnrolled = Math.max(0, targetRow?.targetEnrolled || 0);
    const maxSlaHours = Math.max(1, targetRow?.maxSlaHours || 24);

    // Attendance
    const attLogs = input.attendances.filter(
      (a) => (a.employeeId === emp.id || a.empId === emp.empId) && a.date >= start && a.date <= end,
    );
    const present = attLogs.filter((a) => a.status === 'Present').length;
    const late = attLogs.filter((a) => a.status === 'Late').length;
    const absent = Math.max(0, effWorking - present - late);
    const hours = Number(attLogs.reduce((sum, a) => sum + (Number(a.hoursWorked) || 0), 0).toFixed(1));
    const attendancePct = effWorking > 0 ? Math.min(100, Math.round(((present + late) / effWorking) * 100)) : 0;
    const todayAtt = attLogs.find((a) => a.date === today) || null;
    const todayLocation = todayAtt?.checkIn ? resolveAttendanceLocationStatus(todayAtt.source, todayAtt.notes) : null;
    const attDates = new Set(attLogs.map((a) => a.date));

    // Daily logs
    const logs = input.dailyLogs.filter(
      (l) => (l.employeeId === emp.id || l.empId === emp.empId) && l.date >= start && l.date <= end,
    );
    const logDates = new Set(logs.map((l) => l.date));
    const logsSubmitted = logs.length;
    const todayLogSubmitted = logDates.has(today);
    let streak = 0;
    if (today >= start) {
      let cur = cutoff;
      while (cur >= start) {
        const [cy, cm, cd] = cur.split('-').map(Number);
        const dow = new Date(Date.UTC(cy, cm - 1, cd)).getUTCDay();
        if (dow !== 5 && dow !== 6) {
          if (!logDates.has(cur)) break;
          streak++;
        }
        cur = shiftIsoDays(cur, -1);
      }
    }
    const logPct = effWorking > 0 ? Math.min(100, Math.round((logsSubmitted / effWorking) * 100)) : 0;

    // Activities this month (Dhaka date)
    const empActs = input.activities.filter((a) => {
      const d = toDhakaDate(a.createdAt);
      if (!d || d < start || d > end) return false;
      if (a.employeeId === emp.id) return true;
      if (emp.userId && a.actorUserId === emp.userId) return true;
      return matchesEmployeeName(a.actorName, aliases);
    });

    const actByType: Record<string, number> = {};
    const actionsByDay = new Map<string, number>();
    const touchedLeadIds = new Set<string>();
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
          isWeekend: dow === 5 || dow === 6,
        });
      }
    }

    // Assigned leads & SLA check (including Application Tracker files assigned or referred to this counselor)
    const empLeads = input.leads.filter(
      (l) =>
        l.assignedEmployeeId === emp.id ||
        matchesEmployeeName(l.assignedTo, aliases) ||
        (l.isApplication && !l.assignedEmployeeId && matchesEmployeeName(l.referrer, aliases)),
    );
    const activeLeads = empLeads.filter((l) => !CLOSED_LEAD_STATUSES.has(l.status));
    const newThisMonth = empLeads.filter((l) => toDhakaDate(l.createdAt)?.slice(0, 7) === month).length;
    const qualifiedCount = empLeads.filter((l) => l.status === 'qualified').length;
    const applicationStartedCount = empLeads.filter(
      (l) =>
        (l.isApplication &&
          !['documents_withdraw', 'application_withdraw'].includes(l.applicationStage)) ||
        ['application_started', 'application_submitted', 'admission_received', 'visa_applied', 'visa_approved'].includes(
          l.status,
        ),
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

    let uncontactedOverdue = 0;
    let followupsDueToday = 0;
    let followupsOverdue = 0;

    for (const l of activeLeads) {
      const createdMs = new Date(l.createdAt).getTime();
      const ageHours = Number.isFinite(createdMs) ? Math.max(0, Math.round((nowMs - createdMs) / 3600000)) : 0;
      const followDate = l.nextFollowup ? l.nextFollowup.slice(0, 10) : null;

      if (followDate === today) {
        followupsDueToday++;
        slaBottlenecks.push({
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
        slaBottlenecks.push({
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
        slaBottlenecks.push({
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

    // Tasks
    const empTasks = input.tasks.filter(
      (t) => t.status !== 'cancelled' && (t.employeeId === emp.id || matchesEmployeeName(t.assignedTo, aliases)),
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

    let executionScore = 0;
    if (empLeads.length > 0) {
      const slaPart = touchedLeadIds.size > 0 || uncontactedOverdue === 0 ? (slaCompliancePct / 100) * 10 : 0;
      const taskPart = totalRelevantTasks > 0
        ? (taskCompletionPct / 100) * 10
        : Math.min(10, (touchedLeadIds.size / Math.max(1, effWorking)) * 5);
      const outcomePart = targetEnrolled > 0
        ? Math.min(5, ((applicationStartedCount + admittedCount + enrolledCount) / targetEnrolled) * 5)
        : Math.min(5, applicationStartedCount * 0.5 + admittedCount * 1 + enrolledCount * 2);
      executionScore = slaPart + taskPart + outcomePart;
    } else {
      const taskPart = totalRelevantTasks > 0 ? (taskCompletionPct / 100) * 15 : 0;
      const throughputPart = Math.min(10, (actScore / targetActScore) * 10);
      executionScore = taskPart + throughputPart;
    }

    const score = Math.round(attendanceScore + disciplineScore + activityScore + executionScore);
    const filesOpened = empLeads.filter(
      (l) => l.isApplication || ['application_started', 'application_submitted', 'admission_received', 'visa_applied', 'visa_approved'].includes(l.status),
    ).length;
    const callsLogged = actByType['call_logged'] || 0;
    const conversionRatePct = empLeads.length > 0 ? Number(((filesOpened / empLeads.length) * 100).toFixed(1)) : 0;

    let workflowStage: WorkflowStageKey = 'on_track';
    if (!isWorkingDayToday) {
      workflowStage = todayEvents > 0 || todayAtt ? 'on_track' : 'weekend';
    } else if (!todayAtt) {
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

  for (const l of input.leads) {
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
    if (l.isApplication || ['application_started', 'application_submitted', 'admission_received', 'visa_applied', 'visa_approved'].includes(l.status)) {
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
  };
}
