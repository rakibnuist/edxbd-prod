import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { validateAdminPartnershipCreate } from '@/lib/payload-validation';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';
import { serializePartnership } from '@/lib/partnership-serialize';
import { parsePagination } from '@/lib/pagination';

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);

    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(
      searchParams.get('page'),
      searchParams.get('limit'),
      { defaultLimit: 10, maxLimit: 100 },
    );
    const status = searchParams.get('status')?.slice(0, 60) || null;
    const partnershipType = searchParams.get('partnershipType')?.slice(0, 60) || null;
    const country = searchParams.get('country')?.slice(0, 100) || null;
    const priority = searchParams.get('priority')?.slice(0, 40) || null;
    const search = searchParams.get('search')?.trim().slice(0, 200) || null;

    // Build filter object
    const filter: Prisma.PartnershipWhereInput = {};
    if (status) filter.status = status;
    if (partnershipType) filter.partnershipType = partnershipType;
    if (country) filter.country = country;
    if (priority) filter.priority = priority;

    // Search functionality
    if (search) {
      filter.OR = [
        { companyName: { contains: search } },
        { contactPerson: { contains: search } },
        { email: { contains: search } },
        { city: { contains: search } },
        { state: { contains: search } }
      ];
    }

    // Get partnerships with pagination
    const partnerships = await prisma.partnership.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Get total count
    const totalCount = await prisma.partnership.count({ where: filter });

    // Get status counts
    const statusGroups = await prisma.partnership.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });
    const statusCounts = statusGroups.map(g => ({ id: g.status, count: g._count.status }));

    // Get partnership type counts
    const typeGroups = await prisma.partnership.groupBy({
      by: ['partnershipType'],
      _count: {
        partnershipType: true
      }
    });
    const typeCounts = typeGroups.map(g => ({ id: g.partnershipType, count: g._count.partnershipType }));

    return NextResponse.json({
      partnerships: partnerships.map((p) => serializePartnership(p as Record<string, unknown>)),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      stats: {
        statusCounts,
        typeCounts
      }
    });

  } catch (error) {
    console.error('Error fetching partnerships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partnerships' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);

    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 128 * 1024);
    const validated = validateAdminPartnershipCreate(body);
    if (!validated.data) {
      return NextResponse.json(
        { error: validated.error || 'Invalid partnership payload' },
        { status: 400 }
      );
    }

    // Create new partnership from explicit validated allowlist
    const partnership = await prisma.partnership.create({
      data: validated.data as Prisma.PartnershipCreateInput
    });

    return NextResponse.json(
      {
        message: 'Partnership created successfully',
        partnership
      },
      { status: 201 }
    );

  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Error creating partnership:', error);
    return NextResponse.json(
      { error: 'Failed to create partnership' },
      { status: 500 }
    );
  }
}
