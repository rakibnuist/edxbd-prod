import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { publicTestimonialWhere } from '@/lib/testimonial-visibility';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

/**
 * Public student stories (published, not taken down), with public fields
 * only: the display name (never the legal name when a display name is set)
 * and the photo, with no consent records, payment or contact data.
 */
export async function GET(request: NextRequest) {
  try {
    const requested = Number.parseInt(new URL(request.url).searchParams.get('limit') ?? '', 10);
    const take = Number.isFinite(requested) && requested > 0 ? Math.min(requested, MAX_LIMIT) : DEFAULT_LIMIT;

    const records = await prisma.testimonial.findMany({
      where: publicTestimonialWhere(),
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take,
      select: {
        id: true,
        studentName: true,
        displayName: true,
        content: true,
        university: true,
        program: true,
        country: true,
        location: true,
        rating: true,
        featured: true,
        image: true,
        createdAt: true,
      },
    });

    const testimonials = records.map(({ studentName, displayName, image, ...rest }) => ({
      ...rest,
      name: displayName || studentName,
      image: image || null,
    }));

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
