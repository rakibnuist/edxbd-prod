import { NextRequest, NextResponse } from 'next/server';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { logAndFormatServerError } from '@/lib/api-error';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalLeads,
      newLeads,
      inProgressLeads,
      noResponseLeads,
      closedLeads,
      metaLeads,
      websiteLeads,
      todayLeads,
      chinaLeads,
      totalUniversities,
      totalTeam,
      publishedTeam,
      totalTestimonials,
      totalCountries,
      totalPartnerships,
      newPartnerships,
      recentLeads,
      recentPartnerships,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'new' } }),
      prisma.lead.count({ where: { status: { in: ['contacted', 'in_progress', 'qualified'] } } }),
      prisma.lead.count({ where: { status: 'no_response' } }),
      prisma.lead.count({ where: { status: { in: ['closed', 'completed', 'enrolled', 'converted', 'not_interested'] } } }),
      prisma.lead.count({ where: { source: { contains: 'meta' } } }),
      prisma.lead.count({ where: { NOT: { source: { contains: 'meta' } } } }),
      prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.lead.count({ where: { country: 'China' } }),
      prisma.university.count({ where: { isActive: true } }),
      prisma.teamMember.count(),
      prisma.teamMember.count({ where: { isPublished: true } }),
      prisma.testimonial.count({ where: { isPublished: true } }),
      prisma.country.count({ where: { isActive: true } }),
      prisma.partnership.count(),
      prisma.partnership.count({ where: { status: 'pending' } }),
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          country: true,
          program: true,
          status: true,
          source: true,
          assessAcademicLevel: true,
          assessAcademicResults: true,
          assessLanguage: true,
          createdAt: true,
        },
      }),
      prisma.partnership.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          companyName: true,
          contactPerson: true,
          email: true,
          country: true,
          partnershipType: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalLeads,
      newLeads,
      inProgressLeads,
      noResponseLeads,
      closedLeads,
      metaLeads,
      websiteLeads,
      todayLeads,
      chinaLeads,
      totalUniversities,
      totalTeam,
      publishedTeam,
      totalTestimonials,
      totalCountries,
      totalPartnerships,
      newPartnerships,
      recentLeads,
      recentPartnerships,
      metaSync: {
        active: true,
        pollInterval: '2m',
        formId: '986182003780725',
        formName: 'WebLead&InstantForm_18_4_2026',
        campaignName: 'META_Leads_BD_China-Mar2027_2026Q1',
        tokenType: 'Never-Expiring System User Token',
      },
    });
  } catch (error) {
    return NextResponse.json(
      logAndFormatServerError('Dashboard API error', error, 'Failed to fetch dashboard data'),
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
