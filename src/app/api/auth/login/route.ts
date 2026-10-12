import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { getRequiredString, jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    name: 'admin-login',
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const body = await readLimitedJson(request, 4 * 1024);
    const email = getRequiredString(body, 'email', 254);
    const password = getRequiredString(body, 'password', 256);

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Auto-provision the admin account ONCE, only if credentials are supplied via
    // environment variables. No password is ever hardcoded in the codebase.
    const seedEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const seedPassword = process.env.ADMIN_PASSWORD;
    if (!user && seedEmail && seedPassword && normalizedEmail === seedEmail) {
      const hashed = await bcrypt.hash(seedPassword, 10);
      user = await prisma.user.create({
        data: {
          name: 'Admin',
          email: seedEmail,
          password: hashed,
          role: 'admin',
        }
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password with bcrypt only — no plaintext or backdoor fallbacks.
    let isValidPassword = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isValidPassword = await bcrypt.compare(password, user.password);
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
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
