import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Partnership from '@/models/Partnership';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyTokenFromRequest(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    await connectDB();
    
    const { id } = await params;

    const partnership = await Partnership.findById(id);
    
    if (!partnership) {
      return NextResponse.json(
        { error: 'Partnership not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ partnership });

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
    const decoded = verifyTokenFromRequest(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    await connectDB();
    
    const { id } = await params;
    const body = await request.json();

    const partnership = await Partnership.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

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
    const decoded = verifyTokenFromRequest(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    await connectDB();
    
    const { id } = await params;

    const partnership = await Partnership.findByIdAndDelete(id);

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
