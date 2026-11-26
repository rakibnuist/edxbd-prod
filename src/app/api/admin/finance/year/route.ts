import { NextRequest, NextResponse } from 'next/server';
import { canAccessFinanceRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { getYearCashflowData } from '@/lib/finance-service';

const NO_STORE = { 'Cache-Control': 'no-store, private' };

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !canAccessFinanceRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Financial access required' }, { status: 403, headers: NO_STORE });
    }

    const { searchParams } = new URL(request.url);
    const data = await getYearCashflowData(searchParams.get('year'));
    return NextResponse.json(data, { headers: NO_STORE });
  } catch (err) {
    console.error('Finance year GET error:', err);
    return NextResponse.json({ error: 'Failed to load yearly cashflow' }, { status: 500, headers: NO_STORE });
  }
}
