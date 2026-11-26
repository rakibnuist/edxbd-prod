import { NextRequest, NextResponse } from 'next/server';
import { canAccessFinanceRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { getInvestorsData } from '@/lib/finance-service';

const NO_STORE = { 'Cache-Control': 'no-store, private' };

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !canAccessFinanceRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Financial access required' }, { status: 403, headers: NO_STORE });
    }

    const data = await getInvestorsData();
    return NextResponse.json(data, { headers: NO_STORE });
  } catch (err) {
    console.error('Finance investors GET error:', err);
    return NextResponse.json({ error: 'Failed to load investor data' }, { status: 500, headers: NO_STORE });
  }
}
