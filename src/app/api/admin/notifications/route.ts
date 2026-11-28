import { NextRequest, NextResponse } from 'next/server';
import { getAlertConfig, saveAlertConfig, sendTelegramAlert } from '@/lib/alerts';
import { isAdminRole } from '@/lib/auth';
import { buildCounselorLeadWhere, verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { parseNumericGpa } from '@/lib/wa-templates';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

const MASK = '••••••••';

export interface NotificationItem {
  id: string;
  kind: 'hot_lead' | 'sla_untouched' | 'student_doc_upload' | 'student_message' | 'new_lead' | 'scholarship_notice' | 'b2b_inquiry';
  title: string;
  subtitle: string;
  leadId: string | null;
  leadName: string | null;
  href?: string;
  createdAt: string;
  urgent: boolean;
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
    const leadScope = isAdmin ? {} : buildCounselorLeadWhere(staff?.employee || null);
    const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000);
    const threeDaysAgo = new Date(Date.now() - 72 * 3600 * 1000);

    const [freshNewLeads, portalEvents, scholarshipEvents, pendingB2B] = await Promise.all([
      prisma.lead.findMany({
        where: {
          AND: [
            leadScope,
            { status: 'new' },
            { createdAt: { gte: threeDaysAgo } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 25,
        select: {
          id: true,
          name: true,
          phone: true,
          country: true,
          program: true,
          source: true,
          gpa: true,
          assessAcademicResults: true,
          assignedTo: true,
          isApplication: true,
          leadRef: true,
          createdAt: true,
        },
      }),
      prisma.activityEvent.findMany({
        where: {
          type: { in: ['student_doc_upload', 'student_message'] },
          createdAt: { gte: threeDaysAgo },
          ...(isAdmin
            ? {}
            : {
                OR: [
                  ...(staff?.employee ? [{ employeeId: staff.employee.id }] : []),
                  { employeeId: null },
                ],
              }),
        },
        orderBy: { createdAt: 'desc' },
        take: 25,
        select: {
          id: true,
          type: true,
          leadId: true,
          leadName: true,
          toValue: true,
          details: true,
          createdAt: true,
        },
      }),
      isAdmin
        ? prisma.activityEvent.findMany({
            where: {
              type: 'scholarship_notice_synced',
              createdAt: { gte: threeDaysAgo },
            },
            orderBy: { createdAt: 'desc' },
            take: 8,
            select: {
              id: true,
              toValue: true,
              details: true,
              createdAt: true,
            },
          })
        : Promise.resolve([]),
      isAdmin
        ? prisma.partnership.findMany({
            where: {
              status: 'pending',
              createdAt: { gte: threeDaysAgo },
            },
            orderBy: { createdAt: 'desc' },
            take: 8,
            select: {
              id: true,
              companyName: true,
              contactPerson: true,
              partnershipType: true,
              monthlyTarget: true,
              priority: true,
              createdAt: true,
            },
          })
        : Promise.resolve([]),
    ]);

    const items: NotificationItem[] = [];

    for (const partner of pendingB2B) {
      items.push({
        id: `b2b-${partner.id}`,
        kind: 'b2b_inquiry',
        title: `B2B Inquiry: ${partner.companyName || partner.contactPerson}`,
        subtitle: `${partner.contactPerson} · ${partner.partnershipType.replace(/_/g, ' ')} · ~${partner.monthlyTarget}/mo`,
        leadId: null,
        leadName: null,
        href: '/admin/partnerships',
        createdAt: partner.createdAt.toISOString(),
        urgent: partner.priority === 'high',
      });
    }

    for (const ev of scholarshipEvents) {
      items.push({
        id: `sch-${ev.id}`,
        kind: 'scholarship_notice',
        title: `Scholarship Draft: ${ev.toValue || 'China University'}`,
        subtitle: ev.details || 'Review automated China Scholarship Monitor draft in Content Desk',
        leadId: null,
        leadName: null,
        href: '/admin/content',
        createdAt: ev.createdAt.toISOString(),
        urgent: false,
      });
    }

    const portalLeadIds = Array.from(
      new Set(portalEvents.map((ev) => ev.leadId).filter((id): id is string => Boolean(id))),
    );
    const portalLeadMetaList = portalLeadIds.length
      ? await prisma.lead.findMany({
          where: { id: { in: portalLeadIds } },
          select: { id: true, name: true, leadRef: true, isApplication: true, leadMarket: true },
        })
      : [];
    const portalLeadMap = new Map(portalLeadMetaList.map((l) => [l.id, l]));

    for (const ev of portalEvents) {
      const leadMeta = ev.leadId ? portalLeadMap.get(ev.leadId) : null;
      if (!isAdmin && leadMeta?.leadMarket === 'China') continue;
      const href = leadMeta?.isApplication
        ? `/admin/applications?search=${encodeURIComponent(leadMeta.leadRef || leadMeta.name)}`
        : ev.leadId
          ? `/admin/leads?lead=${encodeURIComponent(ev.leadId)}`
          : '/admin/leads';
      items.push({
        id: `act-${ev.id}`,
        kind: ev.type === 'student_doc_upload' ? 'student_doc_upload' : 'student_message',
        title: ev.type === 'student_doc_upload'
          ? `${ev.leadName || 'Student'} submitted document`
          : `${ev.leadName || 'Student'} sent a portal message`,
        subtitle: ev.toValue || ev.details || 'Open lead drawer to review',
        leadId: ev.leadId,
        leadName: ev.leadName,
        href,
        createdAt: ev.createdAt.toISOString(),
        urgent: true,
      });
    }

    for (const lead of freshNewLeads) {
      const numericGpa = parseNumericGpa(lead.gpa, lead.assessAcademicResults);
      const isHot = numericGpa !== null && numericGpa >= 3.5;
      const isUntouchedSla = lead.createdAt < twoHoursAgo;
      if (!isHot && !isUntouchedSla && items.length >= 12) continue;

      items.push({
        id: `lead-${lead.id}`,
        kind: isHot ? 'hot_lead' : isUntouchedSla ? 'sla_untouched' : 'new_lead',
        title: isHot
          ? `Hot Lead: ${lead.name} (GPA ${numericGpa!.toFixed(2)})`
          : isUntouchedSla
            ? `Untouched >2h: ${lead.name}`
            : `New Lead: ${lead.name}`,
        subtitle: `${lead.country} · ${lead.assignedTo || 'Unassigned'} · ${lead.source}`,
        leadId: lead.id,
        leadName: lead.name,
        href: lead.isApplication
          ? `/admin/applications?search=${encodeURIComponent(lead.leadRef || lead.name)}`
          : `/admin/leads?lead=${encodeURIComponent(lead.id)}`,
        createdAt: lead.createdAt.toISOString(),
        urgent: isHot || isUntouchedSla,
      });
    }

    items.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    let telegramConfig: {
      telegramBotTokenSet: boolean;
      telegramBotTokenMask: string;
      telegramChatId: string;
      preferences: Awaited<ReturnType<typeof getAlertConfig>>['preferences'];
    } | undefined;

    if (isAdmin) {
      const cfg = await getAlertConfig({ includeSecret: false });
      telegramConfig = {
        telegramBotTokenSet: cfg.telegramBotTokenSet,
        telegramBotTokenMask: cfg.telegramBotTokenSet ? MASK : '',
        telegramChatId: cfg.telegramChatId,
        preferences: cfg.preferences,
      };
    }

    return NextResponse.json(
      {
        items: items.slice(0, 20),
        urgentCount: items.filter((i) => i.urgent).length,
        ...(telegramConfig ? { telegramConfig } : {}),
      },
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch {
    return NextResponse.json({ error: 'Failed to load alerts' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 16 * 1024);
    const botToken = typeof body.telegramBotToken === 'string' && body.telegramBotToken !== MASK
      ? body.telegramBotToken.trim()
      : undefined;
    const chatId = typeof body.telegramChatId === 'string' ? body.telegramChatId.trim() : undefined;
    const rawPrefs = body.preferences && typeof body.preferences === 'object' && !Array.isArray(body.preferences)
      ? (body.preferences as Record<string, unknown>)
      : undefined;

    await saveAlertConfig({
      ...(botToken !== undefined ? { telegramBotToken: botToken } : {}),
      ...(chatId !== undefined ? { telegramChatId: chatId } : {}),
      ...(rawPrefs
        ? {
            preferences: {
              ...(typeof rawPrefs.enabled === 'boolean' ? { enabled: rawPrefs.enabled } : {}),
              ...(typeof rawPrefs.alertOnNewLead === 'boolean' ? { alertOnNewLead: rawPrefs.alertOnNewLead } : {}),
              ...(typeof rawPrefs.alertOnHighGpaOnly === 'boolean' ? { alertOnHighGpaOnly: rawPrefs.alertOnHighGpaOnly } : {}),
              ...(typeof rawPrefs.alertOnPortalActivity === 'boolean' ? { alertOnPortalActivity: rawPrefs.alertOnPortalActivity } : {}),
              ...(typeof rawPrefs.minGpaThreshold === 'number' ? { minGpaThreshold: rawPrefs.minGpaThreshold } : {}),
            },
          }
        : {}),
    });

    const cfg = await getAlertConfig({ includeSecret: false });
    return NextResponse.json(
      {
        ok: true,
        telegramConfig: {
          telegramBotTokenSet: cfg.telegramBotTokenSet,
          telegramBotTokenMask: cfg.telegramBotTokenSet ? MASK : '',
          telegramChatId: cfg.telegramChatId,
          preferences: cfg.preferences,
        },
      },
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to save alert settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const result = await sendTelegramAlert(
      `✅ <b>EduExpress Live Alerts Connected</b>\nInstant notifications for high-GPA leads & student portal activity are active.\nSent by: <code>${decoded.email}</code>`,
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error || 'Telegram delivery failed.' }, { status: 400 });
    }
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch {
    return NextResponse.json({ error: 'Test alert failed' }, { status: 500 });
  }
}
