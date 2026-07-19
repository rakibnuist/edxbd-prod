import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

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

    // Return success response
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
