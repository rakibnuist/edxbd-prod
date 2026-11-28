import { NextRequest, NextResponse } from 'next/server';
import { findLinkedEmployeeForUser, verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const liveAdmin = await verifyLiveAdminUser(request);
    const liveStaff = await verifyLiveStaffUser(request);
    const liveUser = liveStaff || liveAdmin;

    if (!liveUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: liveUser.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const employee = liveStaff?.employee || (await findLinkedEmployeeForUser(user.id, user.email));

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: employee?.id || null,
        employeeEmpId: employee?.empId || null,
        employeeName: employee?.name || null,
        employeeTeam: employee?.team || null,
      },
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
