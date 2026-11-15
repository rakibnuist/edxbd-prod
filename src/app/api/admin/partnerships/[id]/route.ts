import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { validateAdminPartnershipUpdate } from '@/lib/payload-validation';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';
import { serializePartnership } from '@/lib/partnership-serialize';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    const partnership = await prisma.partnership.findUnique({ where: { id } });
    
    if (!partnership) {
      return NextResponse.json(
        { error: 'Partnership not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ partnership: serializePartnership(partnership as Record<string, unknown>) });

  } catch (error) {
    console.error('Error fetching partnership:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partnership' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await readLimitedJson(request, 128 * 1024);
    const validated = validateAdminPartnershipUpdate(body);
    if (!validated.data) {
      return NextResponse.json(
        { error: validated.error || 'Invalid partnership update' },
        { status: 400 }
      );
    }

    const partnership = await prisma.partnership.update({
      where: { id },
      data: validated.data as Prisma.PartnershipUpdateInput
    }).catch(() => null);

    if (!partnership) {
      return NextResponse.json(
        { error: 'Partnership not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Partnership updated successfully',
      partnership
    });

  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Error updating partnership:', error);
    return NextResponse.json(
      { error: 'Failed to update partnership' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    const partnership = await prisma.partnership.delete({ where: { id } }).catch(() => null);

    if (!partnership) {
      return NextResponse.json(
        { error: 'Partnership not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Partnership deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting partnership:', error);
    return NextResponse.json(
      { error: 'Failed to delete partnership' },
      { status: 500 }
    );
  }
}
