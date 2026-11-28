import prisma from '@/lib/prisma';
import {
  AuthUser,
  StaffAuthUser,
  isAdminRole,
  isStaffRole,
  verifyStaffTokenFromRequest,
  verifyTokenFromRequest,
} from '@/lib/auth';

export interface LinkedEmployeeSummary {
  id: string;
  empId: string;
  name: string;
  team: string;
  email: string | null;
}

export interface LiveStaffUser extends StaffAuthUser {
  name: string;
  employee: LinkedEmployeeSummary | null;
}

/**
 * Verify both the signed JWT and the caller's live database record + tokenVersion
 * for administrator roles ('operations_admin' | 'admin' | 'super_admin').
 */
export async function verifyLiveAdminUser(request: Request): Promise<AuthUser | null> {
  const decoded = verifyTokenFromRequest(request);
  if (!decoded) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true, tokenVersion: true },
  });

  if (!user || !isAdminRole(user.role) || user.tokenVersion !== decoded.tokenVersion) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };
}

/**
 * Deterministically resolve an active Employee linked to a User.
 * Explicit `userId` linkage always takes precedence; email fallback only matches
 * an unlinked (`userId: null`) employee so explicit unlinks are never undone or hijacked.
 */
export async function findLinkedEmployeeForUser(
  userId: string,
  email: string,
): Promise<LinkedEmployeeSummary | null> {
  const byUserId = await prisma.employee.findFirst({
    where: { active: true, userId },
    select: { id: true, empId: true, name: true, team: true, email: true },
  });
  if (byUserId) return byUserId;

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  return prisma.employee.findFirst({
    where: { active: true, userId: null, email: normalizedEmail },
    select: { id: true, empId: true, name: true, team: true, email: true },
  });
}

/**
 * Verify a signed JWT + live tokenVersion for any staff role ('counselor' | 'admin' | 'super_admin')
 * and resolve their linked Employee record if available.
 */
export async function verifyLiveStaffUser(request: Request): Promise<LiveStaffUser | null> {
  const decoded = verifyStaffTokenFromRequest(request);
  if (!decoded) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, name: true, email: true, role: true, tokenVersion: true },
  });

  if (!user || !isStaffRole(user.role) || user.tokenVersion !== decoded.tokenVersion) {
    return null;
  }

  const employee = await findLinkedEmployeeForUser(user.id, user.email);

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
    employee,
  };
}

/** Checks whether a staff actor is allowed to view/work on a given Lead. */
export function canAccessLeadScope(
  actor: { role: unknown; employee?: LinkedEmployeeSummary | null },
  lead: { assignedEmployeeId?: string | null; assignedTo?: string | null; leadMarket?: string | null },
): boolean {
  if (isAdminRole(actor.role)) return true;
  if (actor.role !== 'counselor') return false;
  if (lead.leadMarket === 'China') return false;

  const emp = actor.employee;
  if (lead.assignedEmployeeId) {
    return Boolean(emp && lead.assignedEmployeeId === emp.id);
  }
  const assignedName = (lead.assignedTo || '').trim().toLowerCase();
  if (!assignedName) {
    return true;
  }
  if (!emp) return false;
  return assignedName === emp.name.trim().toLowerCase();
}

/** Prisma WHERE clause scoping leads for a counselor (own leads + unassigned queue, excluding China market). */
export function buildCounselorLeadWhere(employee: LinkedEmployeeSummary | null) {
  const unassigned = {
    assignedEmployeeId: null,
    OR: [{ assignedTo: null }, { assignedTo: '' }],
  };
  const marketGuard = {
    leadMarket: { not: 'China' },
  };
  if (!employee) {
    return { AND: [marketGuard, unassigned] };
  }
  return {
    AND: [
      marketGuard,
      {
        OR: [
          { assignedEmployeeId: employee.id },
          { assignedEmployeeId: null, assignedTo: employee.name },
          unassigned,
        ],
      },
    ],
  };
}
