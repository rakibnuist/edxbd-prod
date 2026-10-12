import jwt from 'jsonwebtoken';

// Dev-only fallback so local work doesn't need a .env; production MUST set JWT_SECRET.
const DEV_SECRET = 'dev-only-insecure-secret-do-not-use-in-production-000000';

function getJwtSecret(): string {
  const envSecret = process.env.JWT_SECRET;
  if (envSecret && envSecret.length >= 32) return envSecret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is missing or too short (min 32 chars). Refusing to sign/verify tokens with an insecure secret.');
  }
  return DEV_SECRET;
}


export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export function isAdminRole(role: unknown): role is 'admin' | 'super_admin' {
  return role === 'admin' || role === 'super_admin';
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
    if (!isAdminRole(decoded.role)) return null;

    return {
      userId: decoded.userId,
      email: decoded.email,
      // Protected API routes historically compare against `admin` directly.
      // Normalize the senior administrator role at the authorization boundary
      // while /api/auth/me continues to return the stored display role.
      role: 'admin'
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

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, getJwtSecret(), { expiresIn: '8h' });
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
