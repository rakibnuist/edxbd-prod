import 'server-only';
import crypto from 'node:crypto';
import prisma from '@/lib/prisma';
import { notifyNewLeadAlert } from '@/lib/alerts';
import { selectCounselorFromPool, type PoolEmployee } from '@/lib/lead-workflow';

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

const NON_COUNSELING_ROLE_RE = /\b(investor|managing)\b/i;

/**
 * Resolves an automatic counselor assignment based on destination team / specialization
 * and balances active lead count among matching active counselors.
 */
export async function resolveAutoAssignment(input: {
  assignedTeam?: string | null;
  country?: string | null;
}): Promise<{ assignedTo: string | null; assignedEmployeeId: string | null }> {
  try {
    const activeEmployees = await prisma.employee.findMany({
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
              where: {
                status: { notIn: ['closed', 'not_interested', 'enrolled', 'converted'] },
              },
            },
          },
        },
      },
    });
    const chosen = selectCounselorFromPool(
      activeEmployees.map((e) => ({
        id: e.id,
        empId: e.empId,
        name: e.name,
        team: e.team,
        role: e.role,
        activeCount: e._count.leads,
      })),
      input,
    );
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

export async function distributeUnassignedLeads(options: {
  scope: 'new' | 'all_active';
  actorName?: string | null;
  actorUserId?: string | null;
}): Promise<{ assignedCount: number; breakdown: Record<string, number> }> {
  const activeEmployees = await prisma.employee.findMany({
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
            where: {
              status: { notIn: ['closed', 'not_interested', 'enrolled', 'converted'] },
            },
          },
        },
      },
    },
  });

  const pool: PoolEmployee[] = activeEmployees.map((e) => ({
    id: e.id,
    empId: e.empId,
    name: e.name,
    team: e.team,
    role: e.role,
    activeCount: e._count.leads,
  }));
  if (!pool.length) return { assignedCount: 0, breakdown: {} };

  const statusFilter = options.scope === 'new'
    ? { status: 'new' }
    : { status: { notIn: ['closed', 'not_interested', 'enrolled', 'converted'] } };

  const unassignedLeads = await prisma.lead.findMany({
    where: {
      assignedEmployeeId: null,
      assignedTo: null,
      ...statusFilter,
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      country: true,
      assignedTeam: true,
      publicToken: true,
    },
  });

  const breakdown: Record<string, number> = {};
  let assignedCount = 0;

  for (const lead of unassignedLeads) {
    const chosen = selectCounselorFromPool(pool, {
      assignedTeam: lead.assignedTeam,
      country: lead.country,
    });
    if (!chosen) continue;

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        assignedTo: chosen.name,
        assignedEmployeeId: chosen.id,
        ...(!lead.publicToken ? { publicToken: generatePublicToken(), publicEnabled: true } : {}),
      },
    });
    chosen.activeCount++;
    breakdown[chosen.name] = (breakdown[chosen.name] || 0) + 1;
    assignedCount++;
  }

  if (assignedCount > 0) {
    await logActivityEvent({
      type: 'lead_assigned',
      actorName: options.actorName || 'Auto-Assign Engine',
      actorUserId: options.actorUserId || null,
      toValue: `${assignedCount} ${options.scope === 'new' ? 'new' : 'active'} leads distributed`,
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
