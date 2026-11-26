import jwt from 'jsonwebtoken';
import {
  ALLOWED_USER_ROLES,
  FINANCE_ACTIVITY_TYPES,
  canAccessFinanceRole,
  formatRoleLabel,
  isAdminRole,
  isStaffRole,
  isSuperAdminRole,
  type AdminRole,
  type FinanceAdminRole,
  type StaffRole,
  type UserRole,
} from './roles';

export {
  ALLOWED_USER_ROLES,
  FINANCE_ACTIVITY_TYPES,
  canAccessFinanceRole,
  formatRoleLabel,
  isAdminRole,
  isStaffRole,
  isSuperAdminRole,
  type AdminRole,
  type FinanceAdminRole,
  type StaffRole,
  type UserRole,
};

function getJwtSecret(): string {
  const envSecret = process.env.JWT_SECRET;
  if (envSecret && envSecret.length >= 32) {
    return envSecret;
  }
  throw new Error(
    'JWT_SECRET environment variable is missing or too short (min 32 chars). Refusing to sign/verify tokens with an insecure secret.'
  );
}

export interface AuthUser {
  userId: string;
  email: string;
  role: AdminRole;
  tokenVersion: number;
}

export interface StaffAuthUser {
  userId: string;
  email: string;
  role: StaffRole;
  tokenVersion: number;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] }) as jwt.JwtPayload;
    if (
      typeof decoded.userId !== 'string' ||
      !decoded.userId ||
      typeof decoded.email !== 'string' ||
      !decoded.email ||
      !isAdminRole(decoded.role) ||
      typeof decoded.tokenVersion !== 'number' ||
      !Number.isInteger(decoded.tokenVersion) ||
      decoded.tokenVersion < 1
    ) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      tokenVersion: decoded.tokenVersion,
    };
  } catch {
    return null;
  }
}

export function verifyStaffToken(token: string): StaffAuthUser | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] }) as jwt.JwtPayload;
    if (
      typeof decoded.userId !== 'string' ||
      !decoded.userId ||
      typeof decoded.email !== 'string' ||
      !decoded.email ||
      !isStaffRole(decoded.role) ||
      typeof decoded.tokenVersion !== 'number' ||
      !Number.isInteger(decoded.tokenVersion) ||
      decoded.tokenVersion < 1
    ) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      tokenVersion: decoded.tokenVersion,
    };
  } catch {
    return null;
  }
}

export function verifyTokenFromRequest(request: Request): AuthUser | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export function verifyStaffTokenFromRequest(request: Request): StaffAuthUser | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyStaffToken(token);
}

export function isAdminRequest(request: Request): boolean {
  return Boolean(verifyTokenFromRequest(request));
}

export function generateToken(user: Omit<StaffAuthUser, 'tokenVersion'> & { tokenVersion?: number }): string {
  const payload: StaffAuthUser = {
    userId: user.userId,
    email: user.email,
    role: user.role,
    tokenVersion:
      typeof user.tokenVersion === 'number' && Number.isInteger(user.tokenVersion) && user.tokenVersion >= 1
        ? user.tokenVersion
        : 1,
  };
  return jwt.sign(payload, getJwtSecret(), { algorithm: 'HS256', expiresIn: '8h' });
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    if (bearerToken) return bearerToken;
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const sessionCookie = cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith('admin_session='));
  return sessionCookie ? decodeURIComponent(sessionCookie.substring('admin_session='.length)) : null;
}
