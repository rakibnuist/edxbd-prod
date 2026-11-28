import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

const NO_STORE = { 'Cache-Control': 'no-store, private' };
const forbidden = () => NextResponse.json({ error: 'Admin access required' }, { status: 403, headers: NO_STORE });

export async function GET(request: NextRequest) {
  try {
    if (!(await verifyLiveAdminUser(request))) return forbidden();
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(countries, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500, headers: NO_STORE }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyLiveAdminUser(request))) return forbidden();
    const body = await readLimitedJson(request, 32 * 1024);
    const name = String(body.name || '').trim();
    const slug = String(body.slug || '').trim().toLowerCase();
    if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json({ error: 'A country name and valid lowercase slug are required' }, { status: 400, headers: NO_STORE });
    }
    const country = await prisma.country.create({
      data: {
        name,
        slug,
        description: String(body.description || '').trim() || null,
        isActive: body.isActive !== false,
      }
    });

    revalidatePath('/destinations');
    revalidatePath('/universities');

    return NextResponse.json(country, { status: 201, headers: NO_STORE });
  } catch (error) {
    const bodyErr = jsonBodyErrorResponse(error);
    if (bodyErr) return bodyErr;
    const code = (error as { code?: string })?.code;
    if (code === 'P2002') {
      return NextResponse.json({ error: 'A destination with that name or slug already exists.' }, { status: 409, headers: NO_STORE });
    }
    return NextResponse.json(
      { error: 'Failed to create country' },
      { status: 500, headers: NO_STORE }
    );
  }
}
