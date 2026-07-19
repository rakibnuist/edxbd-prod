import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const { id } = await params;

    const body = await request.json();
    const country = await prisma.country.update({
      where: { id },
      data: body
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
