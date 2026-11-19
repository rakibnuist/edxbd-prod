import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateToken, isStaffRole } from '@/lib/auth';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { getRequiredString, jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

// Precomputed cost-12 dummy bcrypt hash used when no matching user hash exists so
// failed logins perform comparable bcrypt work and avoid timing-based email enumeration.
const DUMMY_BCRYPT_HASH = '$2b$12$kz8KMflsqISwwtl3Qmu6c.SW0hMhEkFuI0ERqAJeMCiuk8XLDus1K';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'admin-login',
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    persistent: true,
    protectActiveBuckets: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const body = await readLimitedJson(request, 4 * 1024);
    const email = getRequiredString(body, 'email', 254);
    const password = getRequiredString(body, 'password', 256);

    const normalizedEmail = email.toLowerCase().trim();

    // Find existing user by email — never auto-provision privileged accounts on HTTP login.
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    const storedHash = user?.password;
    const hasBcryptHash = Boolean(
      storedHash && (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$'))
    );
    const matchesHash = await bcrypt.compare(
      password,
      hasBcryptHash ? storedHash! : DUMMY_BCRYPT_HASH
    );
    const isValidPassword = Boolean(user && hasBcryptHash && matchesHash);

    if (!user || !isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!isStaffRole(user.role)) {
      return NextResponse.json(
        { error: 'This account does not have staff portal access' },
        { status: 403 }
      );
    }

    // Generate JWT token tied to the current server-side tokenVersion
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
    const token = generateToken(tokenPayload);

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 8 * 60 * 60,
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;

  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
