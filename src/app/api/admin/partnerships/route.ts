import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Partnership from '@/models/Partnership';

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const partnershipType = searchParams.get('partnershipType');
    const country = searchParams.get('country');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    // Build filter object
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (partnershipType) filter.partnershipType = partnershipType;
    if (country) filter.country = country;
    if (priority) filter.priority = priority;

    // Search functionality
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get partnerships with pagination
    const partnerships = await Partnership.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalCount = await Partnership.countDocuments(filter);

    // Get status counts
    const statusCounts = await Partnership.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get partnership type counts
    const typeCounts = await Partnership.aggregate([
      {
        $group: {
          _id: '$partnershipType',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      partnerships,
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

    await connectDB();

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
    const partnership = new Partnership({
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
    });

    await partnership.save();

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
