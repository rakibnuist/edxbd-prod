import 'server-only';
import crypto from 'node:crypto';
import prisma from '@/lib/prisma';

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

/**
 * Resolves an automatic counselor assignment based on destination team / specialization
 * and balances active lead count among matching active employees.
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
    if (!activeEmployees.length) {
      return { assignedTo: null, assignedEmployeeId: null };
    }

    const teamKey = (input.assignedTeam || '').trim().toLowerCase();
    const countryKey = (input.country || '').trim().toLowerCase();
    const isChina = teamKey === 'china' || countryKey === 'china';

    let pool = activeEmployees.filter((emp) => {
      const empTeam = emp.team.toLowerCase();
      if (isChina) return empTeam === 'china';
      if (teamKey === 'active_country_owner') return empTeam === 'europe' || empTeam === 'malaysia' || empTeam === 'global';
      if (teamKey === 'senior_review') return /senior|head|manager|lead/i.test(emp.role);
      return true;
    });

    if (!pool.length) {
      pool = activeEmployees.filter((emp) => emp.team.toLowerCase() === 'china' || emp.team.toLowerCase() === 'general');
    }
    if (!pool.length) {
      pool = activeEmployees;
    }

    // Balance assignment by choosing the matching counselor with fewest active leads
    const chosen = [...pool].sort((a, b) => a._count.leads - b._count.leads || a.empId.localeCompare(b.empId))[0];
    return {
      assignedTo: chosen.name,
      assignedEmployeeId: chosen.id,
    };
  } catch {
    return { assignedTo: null, assignedEmployeeId: null };
  }
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
