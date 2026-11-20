import 'server-only';
import crypto from 'node:crypto';
import prisma from '@/lib/prisma';
import { notifyNewLeadAlert } from '@/lib/alerts';
import { dhakaTodayIso } from '@/lib/kpi-workflow';
import {
  NON_COUNSELING_ROLE_RE,
  parseLeadFlowConfig,
  resolveEmployeeFlowRule,
  selectCounselorByFlowConfig,
  sortLeadsForBalancedDistribution,
  type LeadFlowCandidate,
  type LeadFlowSettingsConfig,
} from '@/lib/lead-flow';
import { getAllSettings } from '@/lib/settings';

export function generatePublicToken(): string {
  return crypto.randomBytes(12).toString('hex');
}

export async function ensureLeadPublicToken(leadId: string): Promise<string | null> {
  const existing = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true, publicToken: true },
  });
  if (!existing) return null;
  if (existing.publicToken) return existing.publicToken;

  const token = generatePublicToken();
  await prisma.lead.update({
    where: { id: leadId },
    data: { publicToken: token, publicEnabled: true },
  });
  return token;
}

const CLOSED_LEAD_STATUSES = ['closed', 'not_interested', 'enrolled', 'converted'];

function dhakaStartUtc(todayIso: string): Date {
  return new Date(new Date(`${todayIso}T00:00:00.000Z`).getTime() - 6 * 3600 * 1000);
}

async function loadLeadFlowPool(options?: {
  excludeNewFromActiveCount?: boolean;
}): Promise<{
  config: LeadFlowSettingsConfig;
  pool: LeadFlowCandidate[];
  eligibleIds: Set<string>;
}> {
  const todayIso = dhakaTodayIso();
  const dayStart = dhakaStartUtc(todayIso);
  const excludedStatuses = options?.excludeNewFromActiveCount
    ? ['new', ...CLOSED_LEAD_STATUSES]
    : CLOSED_LEAD_STATUSES;

  const [settings, activeEmployees, todayAttendances, todayLeads] = await Promise.all([
    getAllSettings(),
    prisma.employee.findMany({
      where: { active: true },
      orderBy: { empId: 'asc' },
      select: {
        id: true,
        empId: true,
        name: true,
        team: true,
        role: true,
        _count: {
          select: {
            leads: {
              where: { status: { notIn: excludedStatuses } },
            },
          },
        },
      },
    }),
    prisma.attendance.findMany({
      where: { date: todayIso },
      select: { employeeId: true, checkIn: true },
    }),
    prisma.lead.findMany({
      where: {
        assignedEmployeeId: { not: null },
        updatedAt: { gte: dayStart },
      },
      select: { assignedEmployeeId: true, updatedAt: true },
    }),
  ]);

  const config = parseLeadFlowConfig(settings);
  const checkedInSet = new Set(
    todayAttendances.filter((a) => Boolean(a.checkIn)).map((a) => a.employeeId),
  );
  const todayCountMap = new Map<string, number>();
  const lastAssignedMap = new Map<string, number>();
  for (const row of todayLeads) {
    if (!row.assignedEmployeeId) continue;
    todayCountMap.set(row.assignedEmployeeId, (todayCountMap.get(row.assignedEmployeeId) || 0) + 1);
    const ms = row.updatedAt.getTime();
    if (ms > (lastAssignedMap.get(row.assignedEmployeeId) || 0)) {
      lastAssignedMap.set(row.assignedEmployeeId, ms);
    }
  }

  const eligibleIds = new Set<string>();
  const pool: LeadFlowCandidate[] = activeEmployees.map((e) => {
    const rule = resolveEmployeeFlowRule(e, config.rulesByEmpId);
    if (rule.eligible) eligibleIds.add(e.id);
    return {
      id: e.id,
      empId: e.empId,
      name: e.name,
      team: e.team,
      role: e.role,
      activeCount: options?.excludeNewFromActiveCount ? 0 : e._count.leads,
      todayAssignedCount: options?.excludeNewFromActiveCount ? 0 : todayCountMap.get(e.id) || 0,
      checkedInToday: checkedInSet.has(e.id),
      lastAssignedAtMs: options?.excludeNewFromActiveCount ? 0 : lastAssignedMap.get(e.id) || 0,
    };
  });

  return { config, pool, eligibleIds };
}

/**
 * Resolves an automatic counselor assignment based on Admin Lead Flow Settings,
 * destination scope (e.g. All Countries vs China Only), check-in status, and caseload/round-robin mode.
 */
export async function resolveAutoAssignment(input: {
  assignedTeam?: string | null;
  country?: string | null;
  destinationInterest?: string | null;
}): Promise<{ assignedTo: string | null; assignedEmployeeId: string | null }> {
  try {
    const { config, pool } = await loadLeadFlowPool();
    const { chosen } = selectCounselorByFlowConfig(pool, input, config);
    return chosen
      ? { assignedTo: chosen.name, assignedEmployeeId: chosen.id }
      : { assignedTo: null, assignedEmployeeId: null };
  } catch {
    return { assignedTo: null, assignedEmployeeId: null };
  }
}

export async function seedDefaultMonthlyTargets(rawMonth?: string): Promise<{ month: string; createdCount: number }> {
  const month = rawMonth && /^\d{4}-\d{2}$/.test(rawMonth)
    ? rawMonth
    : new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 7);

  const employees = await prisma.employee.findMany({
    where: { active: true },
    orderBy: { empId: 'asc' },
    select: { id: true, name: true, team: true, role: true },
  });

  let createdCount = 0;
  for (const emp of employees) {
    const existing = await prisma.kpiTarget.findUnique({
      where: { consultant_month: { consultant: emp.name, month } },
      select: { id: true },
    });
    if (existing) continue;

    const team = emp.team.toLowerCase();
    const isMgmt = NON_COUNSELING_ROLE_RE.test(emp.role) || team === 'general';
    const isChina = team === 'china' && !NON_COUNSELING_ROLE_RE.test(emp.role);

    await prisma.kpiTarget.create({
      data: {
        employeeId: emp.id,
        consultant: emp.name,
        month,
        targetLeads: isChina ? 35 : isMgmt ? 15 : 25,
        targetEnrolled: isChina ? 5 : isMgmt ? 2 : 3,
        targetDailyActions: isChina ? 15 : isMgmt ? 8 : 12,
        targetFollowups: isChina ? 10 : isMgmt ? 5 : 8,
        maxSlaHours: isChina ? 12 : isMgmt ? 24 : 18,
      },
    });
    createdCount++;
  }

  return { month, createdCount };
}

export type DistributeLeadsScope =
  | 'new'
  | 'untouched_pool'
  | 'untouched_rebalance'
  | 'all_active';

export async function distributeUnassignedLeads(options: {
  scope: DistributeLeadsScope;
  actorName?: string | null;
  actorUserId?: string | null;
}): Promise<{ assignedCount: number; breakdown: Record<string, number> }> {
  const isRebalance = options.scope === 'untouched_rebalance';
  const { config, pool, eligibleIds } = await loadLeadFlowPool({
    excludeNewFromActiveCount: isRebalance,
  });
  if (!pool.length || eligibleIds.size === 0) {
    return { assignedCount: 0, breakdown: {} };
  }

  const eligibleIdList = Array.from(eligibleIds);
  const whereClause =
    options.scope === 'untouched_rebalance'
      ? { status: 'new' }
      : options.scope === 'untouched_pool'
        ? {
            status: 'new',
            OR: [
              { assignedEmployeeId: null },
              { assignedEmployeeId: { notIn: eligibleIdList } },
            ],
          }
        : options.scope === 'all_active'
          ? {
              assignedEmployeeId: null,
              assignedTo: null,
              status: { notIn: CLOSED_LEAD_STATUSES },
            }
          : {
              assignedEmployeeId: null,
              assignedTo: null,
              status: 'new',
            };

  const targetLeads = await prisma.lead.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      country: true,
      destinationInterest: true,
      assignedTeam: true,
      assignedEmployeeId: true,
      assignedTo: true,
      publicToken: true,
    },
  });

  // Assign non-China leads before China leads so counselors covering All Countries
  // absorb non-China volume first before China-only counselors share China volume equally.
  const orderedLeads = sortLeadsForBalancedDistribution(targetLeads);
  const breakdown: Record<string, number> = {};
  let assignedCount = 0;
  let seqMs = Date.now();

  for (const lead of orderedLeads) {
    const { chosen } = selectCounselorByFlowConfig(
      pool,
      {
        assignedTeam: lead.assignedTeam,
        country: lead.country,
        destinationInterest: lead.destinationInterest,
      },
      config,
      { ignoreManualMode: true },
    );
    if (!chosen) continue;

    if (lead.assignedEmployeeId !== chosen.id || lead.assignedTo !== chosen.name) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          assignedTo: chosen.name,
          assignedEmployeeId: chosen.id,
          ...(!lead.publicToken ? { publicToken: generatePublicToken(), publicEnabled: true } : {}),
        },
      });
      assignedCount++;
    }
    chosen.activeCount++;
    chosen.todayAssignedCount = (chosen.todayAssignedCount || 0) + 1;
    chosen.lastAssignedAtMs = seqMs++;
    breakdown[chosen.name] = (breakdown[chosen.name] || 0) + 1;
  }

  if (assignedCount > 0) {
    const scopeLabel =
      options.scope === 'untouched_rebalance'
        ? 'untouched leads rebalanced'
        : options.scope === 'untouched_pool'
          ? 'untouched pool leads distributed'
          : options.scope === 'all_active'
            ? 'active unassigned leads distributed'
            : 'untouched new leads distributed';
    await logActivityEvent({
      type: 'lead_assigned',
      actorName: options.actorName || 'Auto-Assign Engine',
      actorUserId: options.actorUserId || null,
      toValue: `${assignedCount} ${scopeLabel}`,
      details: Object.entries(breakdown)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', '),
    });
  }

  return { assignedCount, breakdown };
}

export async function logActivityEvent(input: {
  type: string;
  actorName?: string | null;
  actorUserId?: string | null;
  employeeId?: string | null;
  leadId?: string | null;
  leadName?: string | null;
  fromValue?: string | null;
  toValue?: string | null;
  details?: string | null;
}): Promise<void> {
  try {
    let resolvedEmployeeId = input.employeeId ?? null;
    if (!resolvedEmployeeId && input.actorUserId) {
      const emp = await prisma.employee.findFirst({
        where: { userId: input.actorUserId },
        select: { id: true },
      });
      if (emp) resolvedEmployeeId = emp.id;
    }
    if (!resolvedEmployeeId && input.actorName) {
      const actorTrim = input.actorName.trim().toLowerCase();
      if (actorTrim) {
        const activeEmps = await prisma.employee.findMany({
          where: { active: true },
          select: { id: true, name: true, email: true },
        });
        const matched = activeEmps.find(
          (e) => e.name.trim().toLowerCase() === actorTrim || (e.email && e.email.trim().toLowerCase() === actorTrim),
        );
        if (matched) resolvedEmployeeId = matched.id;
      }
    }

    await prisma.activityEvent.create({
      data: {
        type: input.type,
        actorName: input.actorName?.slice(0, 120) || null,
        actorUserId: input.actorUserId || null,
        employeeId: resolvedEmployeeId,
        leadId: input.leadId || null,
        leadName: input.leadName?.slice(0, 140) || null,
        fromValue: input.fromValue?.slice(0, 200) || null,
        toValue: input.toValue?.slice(0, 200) || null,
        details: input.details?.slice(0, 2000) || null,
      },
    });
  } catch {
    // Logging should never block primary mutation flow
  }
}

export async function recordNewLeadEffects(input: {
  lead: {
    id: string;
    name: string;
    phone: string;
    country: string;
    program?: string | null;
    source: string;
    gpa?: number | null;
    assessAcademicResults?: string | null;
    assessAcademicLevel?: string | null;
    assignedTo?: string | null;
    assignedEmployeeId?: string | null;
  };
  actorName: string;
  toValue?: string | null;
  details?: string | null;
}): Promise<void> {
  await Promise.allSettled([
    logActivityEvent({
      type: 'lead_created',
      actorName: input.actorName,
      employeeId: input.lead.assignedEmployeeId ?? null,
      leadId: input.lead.id,
      leadName: input.lead.name,
      toValue: input.toValue ?? input.lead.assignedTo ?? null,
      details: input.details ?? `${input.lead.country}${input.lead.program ? ` · ${input.lead.program}` : ''}`,
    }),
    notifyNewLeadAlert(input.lead),
  ]);
}
