import jwt from 'jsonwebtoken';

function getJwtSecret(): string {
  const envSecret = process.env.JWT_SECRET;
  if (envSecret && envSecret.length >= 32) {
    return envSecret;
  }
  throw new Error(
    'JWT_SECRET environment variable is missing or too short (min 32 chars). Refusing to sign/verify tokens with an insecure secret.'
  );
}


export type AdminRole = 'admin' | 'super_admin';

export interface AuthUser {
  userId: string;
  email: string;
  role: AdminRole;
  tokenVersion: number;
}

export function isAdminRole(role: unknown): role is AdminRole {
  return role === 'admin' || role === 'super_admin';
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

export function verifyTokenFromRequest(request: Request): AuthUser | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export function isAdminRequest(request: Request): boolean {
  return Boolean(verifyTokenFromRequest(request));
}

export function generateToken(user: Omit<AuthUser, 'tokenVersion'> & { tokenVersion?: number }): string {
  const payload: AuthUser = {
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
