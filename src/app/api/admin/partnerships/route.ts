import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { serializePartnership } from '@/lib/partnership-serialize';

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const partnershipType = searchParams.get('partnershipType');
    const country = searchParams.get('country');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    // Build filter object
    const filter: any = {};
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

    // Calculate pagination
    const skip = (page - 1) * limit;

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
    const decoded = verifyTokenFromRequest(request);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      companyName,
      businessType,
      contactPerson,
      email,
      phone,
      partnershipType,
      status = 'pending',
      priority = 'medium',
      assignedTo,
      reviewNotes
    } = body;

    // Validate required fields
    if (!companyName || !contactPerson || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new partnership
    const partnership = await prisma.partnership.create({
      data: {
        companyName,
        businessType,
        contactPerson,
        email,
        phone,
        partnershipType,
        status,
        priority,
        assignedTo,
        reviewNotes,
        source: 'admin_created'
      }
    });

    return NextResponse.json(
      {
        message: 'Partnership created successfully',
        partnership
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating partnership:', error);
    return NextResponse.json(
      { error: 'Failed to create partnership' },
      { status: 500 }
    );
  }
}
