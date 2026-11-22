import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { buildCounselorLeadWhere, verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { logAndFormatServerError } from '@/lib/api-error';
import { buildConsultancyExecutiveSnapshot } from '@/lib/consultancy-analytics';
import { getFinanceDashboardSnapshot } from '@/lib/finance-service';
import { dhakaTodayIso } from '@/lib/kpi-workflow';
import { buildCounselorDeskSummary, buildOwnerOfficePulse } from '@/lib/office-pulse';
import { getAllSettings, resolveMetaConfig } from '@/lib/settings';
import prisma from '@/lib/prisma';

const CLOSED_OR_TERMINAL_STATUSES = ['closed', 'completed', 'enrolled', 'converted', 'not_interested'];

function parseHealthJson(raw: string | undefined): {
  ok?: boolean;
  message?: string;
  attemptedAt?: string;
  eventsReceived?: number;
  error?: string;
} | null {
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

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

    const todayIso = dhakaTodayIso();
    const startOfToday = new Date(new Date(`${todayIso}T00:00:00.000Z`).getTime() - 6 * 3600 * 1000);

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
      settings,
    ] = await Promise.all([
      prisma.lead.count({ where: scopeWhere }),
      prisma.lead.count({ where: { AND: [scopeWhere, { status: 'new' }] } }),
      prisma.lead.count({
        where: {
          AND: [
            scopeWhere,
            { status: { notIn: ['new', 'no_response', ...CLOSED_OR_TERMINAL_STATUSES] } },
          ],
        },
      }),
      prisma.lead.count({ where: { AND: [scopeWhere, { status: 'no_response' }] } }),
      prisma.lead.count({ where: { AND: [scopeWhere, { status: { in: CLOSED_OR_TERMINAL_STATUSES } }] } }),
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
      isAdmin ? getAllSettings() : Promise.resolve({} as Record<string, string>),
    ]);

    const [officePulse, counselorDesk, consultancy, financeSnapshot] = await Promise.all([
      isAdmin ? buildOwnerOfficePulse().catch(() => null) : Promise.resolve(null),
      !isAdmin ? buildCounselorDeskSummary(staff?.employee || null).catch(() => null) : Promise.resolve(null),
      buildConsultancyExecutiveSnapshot(prisma, scopeWhere, todayIso).catch(() => null),
      isAdmin ? getFinanceDashboardSnapshot().catch(() => null) : Promise.resolve(null),
    ]);

    const resolvedMeta = isAdmin ? resolveMetaConfig(settings) : null;
    const deliveryHealth = isAdmin ? parseHealthJson(settings.metaDeliveryHealth) : null;
    const connHealth = isAdmin ? parseHealthJson(settings.metaConnectionCheck) : null;

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
      ...(consultancy ? { consultancy } : {}),
      ...(isAdmin && financeSnapshot ? { financeSnapshot } : {}),
      ...(isAdmin && resolvedMeta
        ? {
            metaSync: {
              pixelConfigured: Boolean(resolvedMeta.pixelId),
              pixelId: resolvedMeta.pixelId || null,
              tokenConfigured: Boolean(resolvedMeta.accessToken),
              lastCheckOk: connHealth?.ok ?? null,
              lastCheckMessage: connHealth?.message ?? null,
              lastDeliveryAt: deliveryHealth?.attemptedAt ?? null,
              lastDeliveryError: deliveryHealth?.error ?? null,
              leadFlowMode: settings.leadFlowMode || 'auto_balanced',
            },
          }
        : {}),
    });
  } catch (error) {
    return NextResponse.json(
      logAndFormatServerError('Dashboard API error', error, 'Failed to fetch dashboard data'),
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
