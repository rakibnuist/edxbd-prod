import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const raw = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const testimonials = raw.map((t) => ({
      ...t,
      name: t.studentName || (t as any).name || 'Student',
      displayName: t.studentName || (t as any).displayName || 'Student',
      quote: t.content || (t as any).quote || '',
      isActive: t.isPublished ?? true,
      featured: (t as any).featured ?? false,
      academicProfile: (t as any).academicProfile || '',
      decisionFactors: (t as any).decisionFactors || '',
      applicationTimeline: (t as any).applicationTimeline || '',
      serviceProvided: (t as any).serviceProvided || '',
      studentPaid: (t as any).studentPaid || '',
      currentUpdate: (t as any).currentUpdate || '',
    }));

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const studentName = body.name || body.studentName || body.displayName || 'Student';
    const content = body.quote || body.content || '';

    const testimonial = await prisma.testimonial.create({
      data: {
        studentName,
        content,
        university: body.university || null,
        country: body.country || null,
        rating: Number(body.rating) || 5,
        isPublished: body.isActive ?? body.isPublished ?? true,
      }
    });

    const formatted = {
      ...testimonial,
      name: testimonial.studentName,
      displayName: testimonial.studentName,
      quote: testimonial.content,
      isActive: testimonial.isPublished,
    };

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
