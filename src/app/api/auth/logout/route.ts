import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyTokenFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);
    if (decoded) {
      // Bump tokenVersion server-side so any captured cookie/Bearer JWT stops working immediately.
      await prisma.user.updateMany({
        where: { id: decoded.userId, tokenVersion: decoded.tokenVersion },
        data: { tokenVersion: { increment: 1 } },
      });
    }

    const response = NextResponse.json({
      message: 'Logout successful'
    });
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
