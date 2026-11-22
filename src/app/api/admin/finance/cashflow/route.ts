import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import {
  getDynamicFinanceCategories,
  getFinanceCashInitial,
  getMonthlyCashflowData,
  setFinanceCashInitial,
} from '@/lib/finance-service';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

const NO_STORE = { 'Cache-Control': 'no-store, private' };

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403, headers: NO_STORE });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    const [cashflow, categories, cashInitial] = await Promise.all([
      getMonthlyCashflowData(month),
      getDynamicFinanceCategories(),
      getFinanceCashInitial(),
    ]);

    return NextResponse.json(
      { ...cashflow, categories, cashInitial },
      { headers: NO_STORE },
    );
  } catch (err) {
    console.error('Finance cashflow GET error:', err);
    return NextResponse.json({ error: 'Failed to load monthly cashflow' }, { status: 500, headers: NO_STORE });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403, headers: NO_STORE });
    }

    const body = await readLimitedJson(request, 8 * 1024);
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || Math.abs(amount) > 1_000_000_000) {
      return NextResponse.json({ error: 'A valid opening cash amount is required.' }, { status: 400, headers: NO_STORE });
    }

    const saved = await setFinanceCashInitial(amount);
    return NextResponse.json({ ok: true, cashInitial: saved }, { headers: NO_STORE });
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    console.error('Finance cashflow initial PUT error:', err);
    return NextResponse.json({ error: 'Failed to update opening cash' }, { status: 500, headers: NO_STORE });
  }
}
