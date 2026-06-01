import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Allow a placeholder ONLY during the build phase (no real auth happens then).
// At runtime in production, a missing/short secret is fatal so tokens can never
// be signed or verified with a predictable key.
const isProd = process.env.NODE_ENV === 'production';
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

if (isProd && !isBuildPhase && (!JWT_SECRET || JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET is missing or too short (min 32 chars) in production.');
}

const jwtSecret = JWT_SECRET || 'build-time-only-placeholder-not-for-runtime';


export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
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
  return jwt.sign(user, jwtSecret, { expiresIn: '24h' });
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}
