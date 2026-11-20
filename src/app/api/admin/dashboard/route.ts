import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { buildCounselorLeadWhere, verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { logAndFormatServerError } from '@/lib/api-error';
import { buildCounselorDeskSummary, buildOwnerOfficePulse } from '@/lib/office-pulse';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;
    if (!actor) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }

    const isAdmin = isAdminRole(actor.role);
    const scopeWhere = isAdmin ? {} : buildCounselorLeadWhere(staff?.employee || null);

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
      prisma.lead.count({ where: scopeWhere }),
      prisma.lead.count({ where: { AND: [scopeWhere, { status: 'new' }] } }),
      prisma.lead.count({ where: { AND: [scopeWhere, { status: { in: ['contacted', 'in_progress', 'qualified'] } }] } }),
      prisma.lead.count({ where: { AND: [scopeWhere, { status: 'no_response' }] } }),
      prisma.lead.count({ where: { AND: [scopeWhere, { status: { in: ['closed', 'completed', 'enrolled', 'converted', 'not_interested'] } }] } }),
      prisma.lead.count({ where: { AND: [scopeWhere, { source: { contains: 'meta' } }] } }),
      prisma.lead.count({ where: { AND: [scopeWhere, { NOT: { source: { contains: 'meta' } } }] } }),
      prisma.lead.count({ where: { AND: [scopeWhere, { createdAt: { gte: startOfToday } }] } }),
      prisma.lead.count({ where: { AND: [scopeWhere, { country: 'China' }] } }),
      prisma.university.count({ where: { isActive: true } }),
      isAdmin ? prisma.teamMember.count() : Promise.resolve(0),
      isAdmin ? prisma.teamMember.count({ where: { isPublished: true } }) : Promise.resolve(0),
      isAdmin ? prisma.testimonial.count({ where: { isPublished: true } }) : Promise.resolve(0),
      prisma.country.count({ where: { isActive: true } }),
      isAdmin ? prisma.partnership.count() : Promise.resolve(0),
      isAdmin ? prisma.partnership.count({ where: { status: 'pending' } }) : Promise.resolve(0),
      prisma.lead.findMany({
        where: scopeWhere,
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
      isAdmin
        ? prisma.partnership.findMany({
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
          })
        : Promise.resolve([]),
    ]);

    const [officePulse, counselorDesk] = await Promise.all([
      isAdmin ? buildOwnerOfficePulse().catch(() => null) : Promise.resolve(null),
      !isAdmin ? buildCounselorDeskSummary(staff?.employee || null).catch(() => null) : Promise.resolve(null),
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
      ...(officePulse ? { officePulse } : {}),
      ...(counselorDesk ? { counselorDesk } : {}),
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
