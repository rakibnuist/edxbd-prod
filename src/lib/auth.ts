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
    console.log('Verifying token with secret length:', jwtSecret.length);
    const decoded = jwt.verify(token, jwtSecret) as any;
    console.log('Token decoded successfully:', { userId: decoded.userId, email: decoded.email, role: decoded.role });
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function verifyTokenFromRequest(request: Request): AuthUser | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    console.log('No token found in request');
    return null;
  }
  
  console.log('Token found, attempting verification...');
  console.log('JWT Secret available:', !!jwtSecret);
  console.log('Token length:', token.length);
  
  const result = verifyToken(token);
  console.log('Token verification result:', result);
  
  return result;
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
