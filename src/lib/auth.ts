import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// For build time, use a fallback secret
const jwtSecret = JWT_SECRET || 'build-time-fallback-secret';


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
