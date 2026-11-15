import { NextRequest, NextResponse } from 'next/server';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const liveUser = await verifyLiveAdminUser(request);

    if (!liveUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: liveUser.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
