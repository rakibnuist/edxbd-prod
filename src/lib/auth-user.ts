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
 * for strict administrator roles ('admin' | 'super_admin').
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

  const employee = await prisma.employee.findFirst({
    where: {
      active: true,
      OR: [{ userId: user.id }, { email: user.email.toLowerCase() }],
    },
    select: { id: true, empId: true, name: true, team: true, email: true },
  });

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
  lead: { assignedEmployeeId?: string | null; assignedTo?: string | null },
): boolean {
  if (isAdminRole(actor.role)) return true;
  if (actor.role !== 'counselor') return false;

  const emp = actor.employee;
  if (!lead.assignedEmployeeId && !lead.assignedTo) {
    return true;
  }
  if (!emp) return false;
  if (lead.assignedEmployeeId && lead.assignedEmployeeId === emp.id) return true;
  if (lead.assignedTo && lead.assignedTo.trim().toLowerCase() === emp.name.trim().toLowerCase()) {
    return true;
  }
  return false;
}

/** Prisma WHERE clause scoping leads for a counselor (own leads + unassigned queue). */
export function buildCounselorLeadWhere(employee: LinkedEmployeeSummary | null) {
  const unassigned = { assignedEmployeeId: null, assignedTo: null };
  if (!employee) return unassigned;
  return {
    OR: [
      { assignedEmployeeId: employee.id },
      { assignedTo: employee.name },
      unassigned,
    ],
  };
}
