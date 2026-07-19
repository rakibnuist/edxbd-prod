import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
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
    const body = await request.json();
    const country = await prisma.country.create({
      data: body
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
