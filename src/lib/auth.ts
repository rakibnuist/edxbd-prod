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

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
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

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, getJwtSecret(), { expiresIn: '24h' });
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}
