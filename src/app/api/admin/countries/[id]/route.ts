import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

const NO_STORE = { 'Cache-Control': 'no-store, private' };
const forbidden = () => NextResponse.json({ error: 'Admin access required' }, { status: 403, headers: NO_STORE });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyLiveAdminUser(request))) return forbidden();
    const { id } = await params;

    const country = await prisma.country.findUnique({ where: { id } });
    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404, headers: NO_STORE }
      );
    }

    return NextResponse.json(country, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch country' },
      { status: 500, headers: NO_STORE }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyLiveAdminUser(request))) return forbidden();
    const { id } = await params;

    const body = await readLimitedJson(request, 32 * 1024);
    const name = String(body.name || '').trim();
    const slug = String(body.slug || '').trim().toLowerCase();
    if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json({ error: 'A country name and valid lowercase slug are required' }, { status: 400, headers: NO_STORE });
    }
    const country = await prisma.country.update({
      where: { id },
      data: {
        name,
        slug,
        description: String(body.description || '').trim() || null,
        isActive: body.isActive !== false,
      }
    });

    revalidatePath('/destinations');
    revalidatePath('/universities');

    return NextResponse.json(country, { headers: NO_STORE });
  } catch (error) {
    const bodyErr = jsonBodyErrorResponse(error);
    if (bodyErr) return bodyErr;
    const code = (error as { code?: string })?.code;
    if (code === 'P2025') {
      return NextResponse.json({ error: 'Country not found' }, { status: 404, headers: NO_STORE });
    }
    if (code === 'P2002') {
      return NextResponse.json({ error: 'Another destination already uses that name or slug.' }, { status: 409, headers: NO_STORE });
    }
    return NextResponse.json(
      { error: 'Failed to update country' },
      { status: 500, headers: NO_STORE }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyLiveAdminUser(request))) return forbidden();
    const { id } = await params;

    await prisma.country.delete({ where: { id } });

    revalidatePath('/destinations');
    revalidatePath('/universities');

    return NextResponse.json({ message: 'Country deleted successfully' }, { headers: NO_STORE });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === 'P2025') {
      return NextResponse.json({ error: 'Country not found' }, { status: 404, headers: NO_STORE });
    }
    return NextResponse.json(
      { error: 'Failed to delete country' },
      { status: 500, headers: NO_STORE }
    );
  }
}
