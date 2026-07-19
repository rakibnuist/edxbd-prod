import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    // Build query
    const now = new Date();
    const query: Record<string, unknown> = {
      isActive: true,
      consentVerified: true,
      consentEvidenceId: { $exists: true, $ne: '' },
      $and: [
        { $or: [{ consentRevokedAt: { $exists: false } }, { consentRevokedAt: null }] },
        { $or: [{ consentExpiresAt: { $exists: false } }, { consentExpiresAt: null }, { consentExpiresAt: { $gt: now } }] },
      ],
    };
    
    if (featured === 'true') {
      query.featured = true;
    }

    // Build sort criteria
    const sort = { featured: -1 as const, createdAt: -1 as const };

    // Execute query
    let testimonialsQuery = Testimonial.find(query).sort(sort);
    
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        testimonialsQuery = testimonialsQuery.limit(limitNum);
      }
    }

    const testimonials = await testimonialsQuery.exec();

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
