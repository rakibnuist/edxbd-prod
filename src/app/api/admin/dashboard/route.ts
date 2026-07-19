import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    // Get dashboard statistics
    const [
      totalLeads,
      newLeads,
      totalTestimonials,
      totalCountries,
      totalPartnerships,
      newPartnerships,
      recentLeads,
      recentPartnerships
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'new' } }),
      prisma.testimonial.count({ where: { isPublished: true } }),
      prisma.country.count({ where: { isActive: true } }),
      prisma.partnership.count(),
      prisma.partnership.count({ where: { status: 'pending' } }),
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, country: true, program: true, status: true, createdAt: true }
      }),
      prisma.partnership.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, companyName: true, contactPerson: true, email: true, country: true, partnershipType: true, status: true, createdAt: true }
      })
    ]);

    return NextResponse.json({
      totalLeads,
      newLeads,
      totalTestimonials,
      totalCountries,
      totalPartnerships,
      newPartnerships,
      recentLeads,
      recentPartnerships
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isConnectionError = errorMessage.includes('connect') || errorMessage.includes('ECONNREFUSED');
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data',
        details: errorMessage,
        type: isConnectionError ? 'connection_error' : 'database_error'
      },
      { status: 500 }
    );
  }
}
