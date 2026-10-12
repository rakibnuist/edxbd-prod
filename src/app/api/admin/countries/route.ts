import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';

const forbidden = () => NextResponse.json({ error: 'Admin access required' }, { status: 403 });

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) return forbidden();
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(countries);
  } catch (error) {
    // Error fetching countries
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) return forbidden();
    const body = await request.json() as Record<string, unknown>;
    const name = String(body.name || '').trim();
    const slug = String(body.slug || '').trim().toLowerCase();
    if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json({ error: 'A country name and valid lowercase slug are required' }, { status: 400 });
    }
    const country = await prisma.country.create({
      data: {
        name,
        slug,
        description: String(body.description || '').trim() || null,
        isActive: body.isActive !== false,
      }
    });

    return NextResponse.json(country, { status: 201 });
  } catch (error) {
    // Error creating country
    return NextResponse.json(
      { error: 'Failed to create country' },
      { status: 500 }
    );
  }
}
