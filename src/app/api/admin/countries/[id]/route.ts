import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';

const forbidden = () => NextResponse.json({ error: 'Admin access required' }, { status: 403 });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminRequest(request)) return forbidden();
    const { id } = await params;

    const country = await prisma.country.findUnique({ where: { id } });
    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(country);
  } catch (error) {
    // Error fetching country
    return NextResponse.json(
      { error: 'Failed to fetch country' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminRequest(request)) return forbidden();
    const { id } = await params;

    const body = await request.json() as Record<string, unknown>;
    const name = String(body.name || '').trim();
    const slug = String(body.slug || '').trim().toLowerCase();
    if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json({ error: 'A country name and valid lowercase slug are required' }, { status: 400 });
    }
    const country = await prisma.country.update({
      where: { id },
      data: {
        name,
        slug,
        description: String(body.description || '').trim() || null,
        isActive: body.isActive !== false,
      }
    }).catch(() => null);

    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(country);
  } catch (error) {
    // Error updating country
    return NextResponse.json(
      { error: 'Failed to update country' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminRequest(request)) return forbidden();
    const { id } = await params;

    const country = await prisma.country.delete({ where: { id } }).catch(() => null);
    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Country deleted successfully' });
  } catch (error) {
    // Error deleting country
    return NextResponse.json(
      { error: 'Failed to delete country' },
      { status: 500 }
    );
  }
}
