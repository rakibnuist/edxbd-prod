export type FinanceAdminRole = 'admin' | 'super_admin';
export type AdminRole = 'operations_admin' | FinanceAdminRole;
export type StaffRole = 'counselor' | AdminRole;
export type UserRole = 'user' | StaffRole;

export const ALLOWED_USER_ROLES = [
  'user',
  'counselor',
  'operations_admin',
  'admin',
  'super_admin',
] as const satisfies readonly UserRole[];

/**
 * Any admin-tier role with full operational access across leads, applications,
 * KPI, team roster, settings, and website CMS.
 * Note: 'operations_admin' has full control EXCEPT financial details.
 */
export function isAdminRole(role: unknown): role is AdminRole {
  return role === 'operations_admin' || role === 'admin' || role === 'super_admin';
}

/**
 * Roles permitted to view or modify financial details (Finance & Ledger,
 * Payroll, employee salaries, investor equity, and student fee/payment figures).
 */
export function canAccessFinanceRole(role: unknown): role is FinanceAdminRole {
  return role === 'admin' || role === 'super_admin';
}

/** Roles with unrestricted full control, including user/role management and finance. */
export function isSuperAdminRole(role: unknown): role is 'super_admin' {
  return role === 'super_admin';
}

/** Any staff role permitted to sign into the operations/counselor portal. */
export function isStaffRole(role: unknown): role is StaffRole {
  return role === 'counselor' || isAdminRole(role);
}

/** ActivityEvent types containing financial figures that must be hidden from non-finance roles. */
export const FINANCE_ACTIVITY_TYPES = ['expense_recorded', 'payment_recorded'] as const;

export function formatRoleLabel(role: unknown): string {
  switch (role) {
    case 'super_admin':
      return 'Full Control';
    case 'admin':
      return 'Admin (Full + Finance)';
    case 'operations_admin':
      return 'Full (No Finance)';
    case 'counselor':
      return 'Counselor (Scoped)';
    case 'user':
      return 'User (Public only)';
    default:
      return typeof role === 'string' ? role : 'Unknown';
  }
}
