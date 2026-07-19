import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const t = await prisma.testimonial.findUnique({ where: { id } });
    if (!t) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    const formatted = {
      ...t,
      name: t.studentName || (t as any).name || 'Student',
      displayName: t.studentName || (t as any).displayName || 'Student',
      quote: t.content || (t as any).quote || '',
      isActive: t.isPublished ?? true,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
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

    const studentName = body.name || body.studentName || body.displayName;
    const content = body.quote || body.content;

    const updateData: any = {};
    if (studentName) updateData.studentName = studentName;
    if (content) updateData.content = content;
    if (body.university !== undefined) updateData.university = body.university;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.rating !== undefined) updateData.rating = Number(body.rating);
    if (body.isActive !== undefined || body.isPublished !== undefined) {
      updateData.isPublished = body.isActive ?? body.isPublished;
    }

    const t = await prisma.testimonial.update({
      where: { id },
      data: updateData
    });

    const formatted = {
      ...t,
      name: t.studentName,
      displayName: t.studentName,
      quote: t.content,
      isActive: t.isPublished,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
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
    await prisma.testimonial.delete({ where: { id } }).catch(() => null);

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
