import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { dhakaTodayIso } from '@/lib/kpi-workflow';
import {
  isChinaDestination,
  parseLeadFlowConfig,
  resolveEmployeeFlowRule,
  THREE_OFFICE_COUNSELORS_PRESET,
  type CounselorFlowRule,
} from '@/lib/lead-flow';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { getAllSettings, saveSettings } from '@/lib/settings';
import prisma from '@/lib/prisma';

const CLOSED_LEAD_STATUSES = ['closed', 'not_interested', 'enrolled', 'converted'];

function dhakaStartUtc(todayIso: string): Date {
  return new Date(new Date(`${todayIso}T00:00:00.000Z`).getTime() - 6 * 3600 * 1000);
}

async function buildLeadFlowSnapshot() {
  const todayIso = dhakaTodayIso();
  const dayStart = dhakaStartUtc(todayIso);

  const [settings, employees, todayAttendances, openLeads, newLeads, todayAssignedEvents] = await Promise.all([
    getAllSettings(),
    prisma.employee.findMany({
      orderBy: [{ active: 'desc' }, { empId: 'asc' }],
      select: {
        id: true,
        empId: true,
        name: true,
        role: true,
        team: true,
        email: true,
        phone: true,
        active: true,
        userId: true,
      },
    }),
    prisma.attendance.findMany({
      where: { date: todayIso },
      select: { employeeId: true, checkIn: true },
    }),
    prisma.lead.findMany({
      where: { status: { notIn: CLOSED_LEAD_STATUSES } },
      select: { assignedEmployeeId: true, status: true },
    }),
    prisma.lead.findMany({
      where: {
        status: 'new',
        isApplication: false,
        leadMarket: { not: 'China' },
      },
      select: {
        id: true,
        country: true,
        destinationInterest: true,
        assignedTeam: true,
        assignedEmployeeId: true,
        assignedTo: true,
      },
    }),
    prisma.activityEvent.findMany({
      where: {
        employeeId: { not: null },
        leadId: { not: null },
        type: { in: ['lead_created', 'lead_assigned'] },
        createdAt: { gte: dayStart },
      },
      select: { employeeId: true, leadId: true },
    }),
  ]);

  const config = parseLeadFlowConfig(settings);
  const checkedInSet = new Set(
    todayAttendances.filter((a) => Boolean(a.checkIn)).map((a) => a.employeeId),
  );

  const openByEmp = new Map<string, number>();
  const untouchedByEmp = new Map<string, number>();
  const todayLeadSets = new Map<string, Set<string>>();
  for (const lead of openLeads) {
    if (!lead.assignedEmployeeId) continue;
    openByEmp.set(lead.assignedEmployeeId, (openByEmp.get(lead.assignedEmployeeId) || 0) + 1);
    if (lead.status === 'new') {
      untouchedByEmp.set(lead.assignedEmployeeId, (untouchedByEmp.get(lead.assignedEmployeeId) || 0) + 1);
    }
  }
  for (const ev of todayAssignedEvents) {
    if (!ev.employeeId || !ev.leadId) continue;
    let set = todayLeadSets.get(ev.employeeId);
    if (!set) {
      set = new Set<string>();
      todayLeadSets.set(ev.employeeId, set);
    }
    set.add(ev.leadId);
  }

  const eligibleEmpIds = new Set<string>();
  const staffRows = employees.map((emp) => {
    const rule = resolveEmployeeFlowRule(emp, config.rulesByEmpId);
    if (emp.active && rule.eligible) {
      eligibleEmpIds.add(emp.id);
    }
    return {
      ...emp,
      rule,
      checkedInToday: checkedInSet.has(emp.id),
      activeLeadsCount: openByEmp.get(emp.id) || 0,
      untouchedLeadsCount: untouchedByEmp.get(emp.id) || 0,
      todayAssignedCount: todayLeadSets.get(emp.id)?.size || 0,
    };
  });

  let untouchedUnassignedTotal = 0;
  let untouchedUnassignedChina = 0;
  let untouchedUnassignedOther = 0;
  let untouchedOnIneligibleTotal = 0;
  let untouchedAllChina = 0;
  let untouchedAllOther = 0;

  for (const lead of newLeads) {
    const china = isChinaDestination(lead);
    if (china) untouchedAllChina++;
    else untouchedAllOther++;

    const isUnassigned = !lead.assignedEmployeeId && !lead.assignedTo;
    if (isUnassigned) {
      untouchedUnassignedTotal++;
      if (china) untouchedUnassignedChina++;
      else untouchedUnassignedOther++;
    } else if (!lead.assignedEmployeeId || !eligibleEmpIds.has(lead.assignedEmployeeId)) {
      untouchedOnIneligibleTotal++;
    }
  }

  return {
    config,
    employees: staffRows,
    backlog: {
      untouchedUnassignedTotal,
      untouchedUnassignedChina,
      untouchedUnassignedOther,
      untouchedOnIneligibleTotal,
      untouchedPoolTotal: untouchedUnassignedTotal + untouchedOnIneligibleTotal,
      untouchedAllTotal: newLeads.length,
      untouchedAllChina,
      untouchedAllOther,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const snapshot = await buildLeadFlowSnapshot();
    return NextResponse.json(snapshot, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (err) {
    console.error('Lead flow GET error:', err);
    return NextResponse.json({ error: 'Failed to load lead flow settings.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 16 * 1024);
    const action = typeof body.action === 'string' ? body.action : '';

    if (action !== 'apply_3_counselors_preset') {
      return NextResponse.json({ error: 'Unsupported lead flow action.' }, { status: 400 });
    }

    const [existingEmployees, users, settings] = await Promise.all([
      prisma.employee.findMany({ orderBy: { empId: 'asc' } }),
      prisma.user.findMany({ select: { id: true, name: true, email: true } }),
      getAllSettings(),
    ]);

    const currentConfig = parseLeadFlowConfig(settings);
    const takenEmpIds = new Set(existingEmployees.map((e) => e.empId.toUpperCase()));
    let nextNum = existingEmployees.length + 1;
    const allocEmpId = () => {
      while (takenEmpIds.has(`E-${String(nextNum).padStart(2, '0')}`)) {
        nextNum++;
      }
      const id = `E-${String(nextNum).padStart(2, '0')}`;
      takenEmpIds.add(id);
      return id;
    };

    const claimedUserIds = new Set(existingEmployees.map((e) => e.userId).filter((id): id is string => Boolean(id)));
    const matchedIds = new Map<string, typeof THREE_OFFICE_COUNSELORS_PRESET[number]>();

    for (const preset of THREE_OFFICE_COUNSELORS_PRESET) {
      const existing = existingEmployees.find(
        (e) => preset.match.test(e.name) || (e.email && preset.match.test(e.email)),
      );
      const matchedUser = users.find(
        (u) => !claimedUserIds.has(u.id) && (preset.match.test(u.name) || preset.match.test(u.email)),
      );

      if (existing) {
        const assignUserId = matchedUser && !existing.userId ? matchedUser.id : undefined;
        if (assignUserId) claimedUserIds.add(assignUserId);
        const updated = await prisma.employee.update({
          where: { id: existing.id },
          data: {
            role: preset.role,
            team: preset.team,
            active: true,
            ...(assignUserId ? { userId: assignUserId } : {}),
          },
        });
        matchedIds.set(updated.empId.toUpperCase(), preset);
      } else {
        if (matchedUser) claimedUserIds.add(matchedUser.id);
        const created = await prisma.employee.create({
          data: {
            empId: allocEmpId(),
            name: preset.canonicalName,
            role: preset.role,
            team: preset.team,
            active: true,
            ...(matchedUser ? { userId: matchedUser.id, email: matchedUser.email.toLowerCase() } : {}),
          },
        });
        matchedIds.set(created.empId.toUpperCase(), preset);
      }
    }

    const allEmployees = await prisma.employee.findMany({ orderBy: { empId: 'asc' } });
    const nextRules: Record<string, CounselorFlowRule> = {};
    for (const emp of allEmployees) {
      const key = emp.empId.toUpperCase();
      const preset = matchedIds.get(key);
      if (preset) {
        nextRules[key] = {
          eligible: true,
          countryScope: preset.countryScope,
          dailyCap: 0,
        };
      } else {
        const prev = resolveEmployeeFlowRule(emp, currentConfig.rulesByEmpId);
        nextRules[key] = {
          eligible: false,
          countryScope: prev.countryScope,
          dailyCap: prev.dailyCap,
        };
      }
    }

    await saveSettings({ leadFlowRulesJson: JSON.stringify(nextRules) });
    const snapshot = await buildLeadFlowSnapshot();
    return NextResponse.json(
      { ok: true, ...snapshot },
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    console.error('Lead flow POST error:', err);
    return NextResponse.json({ error: 'Failed to update lead flow preset.' }, { status: 500 });
  }
}
