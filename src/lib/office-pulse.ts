import 'server-only';
import {
  CLOSED_LEAD_STATUSES,
  dhakaTimeNow,
  dhakaTodayIso,
  shiftIsoDays,
} from '@/lib/kpi-workflow';
import {
  buildGoogleMapsUrl,
  resolveAttendanceLocationStatus,
  resolveOfficeGeofenceConfig,
  type OfficeLocationStatus,
} from '@/lib/office-location';
import prisma from '@/lib/prisma';
import { getAllSettings } from '@/lib/settings';

export interface OfficePulseStaffRow {
  id: string;
  empId: string;
  name: string;
  role: string;
  team: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  hoursWorked: number;
  locationType: OfficeLocationStatus;
  locationLabel: string;
  distanceMeters: number | null;
  accuracyMeters: number | null;
  mapsUrl: string | null;
  eodSubmitted: boolean;
  todayActions: number;
  lastActionAt: string | null;
  activeLeads: number;
  overdueLeads: number;
  openTasks: number;
  overdueTasks: number;
}

export interface OfficePulseActivityItem {
  id: string;
  type: string;
  actorName: string | null;
  employeeId: string | null;
  leadId: string | null;
  leadName: string | null;
  fromValue: string | null;
  toValue: string | null;
  summary: string | null;
  createdAt: string;
}

export interface OwnerOfficePulsePayload {
  dhakaDate: string;
  dhakaTime: string;
  officeLatitude: number;
  officeLongitude: number;
  geofenceRadiusMeters: number;
  officeLocationStrict: boolean;
  officeMapsUrl: string | null;
  summary: {
    totalStaff: number;
    checkedInCount: number;
    onTimeCount: number;
    lateCount: number;
    notCheckedInCount: number;
    officeLocationCount: number;
    remoteLocationCount: number;
    locationMissingCount: number;
    eodSubmittedCount: number;
    todayActionsTotal: number;
    openTasksCount: number;
    overdueTasksCount: number;
    overdueLeadsCount: number;
  };
  staffStatus: OfficePulseStaffRow[];
  recentFeed: OfficePulseActivityItem[];
}

export interface CounselorDeskSummary {
  dhakaDate: string;
  dhakaTime: string;
  employeeName: string | null;
  empId: string | null;
  role: string | null;
  team: string | null;
  checkIn: string | null;
  checkOut: string | null;
  attendanceStatus: string;
  hoursWorked: number;
  locationType: OfficeLocationStatus;
  locationLabel: string;
  distanceMeters: number | null;
  mapsUrl: string | null;
  eodSubmitted: boolean;
  todayActions: number;
  openTasks: number;
  overdueTasks: number;
  overdueLeads: number;
}

function dhakaStartUtc(todayIso: string): Date {
  return new Date(new Date(`${todayIso}T00:00:00.000Z`).getTime() - 6 * 3600 * 1000);
}

function isLeadOverdue(
  lead: {
    status: string;
    nextFollowup: string | null;
    createdAt: Date;
    updatedAt: Date;
  },
  todayIso: string,
  nowMs: number,
  maxSlaHours = 24,
): boolean {
  if (CLOSED_LEAD_STATUSES.has(lead.status)) return false;
  const followDate = lead.nextFollowup ? lead.nextFollowup.slice(0, 10) : null;
  if (followDate && followDate < todayIso) return true;

  if (lead.status === 'new') {
    const untouchedHours = (nowMs - lead.updatedAt.getTime()) / (1000 * 3600);
    return untouchedHours > maxSlaHours;
  }
  return false;
}

export async function buildOwnerOfficePulse(): Promise<OwnerOfficePulsePayload> {
  const nowMs = Date.now();
  const todayIso = dhakaTodayIso(nowMs);
  const nowTime = dhakaTimeNow(nowMs);
  const dayStart = dhakaStartUtc(todayIso);
  const recentWindowStart = new Date(`${shiftIsoDays(todayIso, -2)}T00:00:00.000Z`);

  const [employees, attendances, dailyLogs, todayActivities, recentFeedRows, openTasks, assignedLeads, settings] =
    await Promise.all([
      prisma.employee.findMany({
        where: { active: true },
        orderBy: { empId: 'asc' },
        select: { id: true, empId: true, name: true, role: true, team: true },
      }),
      prisma.attendance.findMany({
        where: { date: todayIso },
        select: {
          employeeId: true,
          checkIn: true,
          checkOut: true,
          status: true,
          hoursWorked: true,
          source: true,
          notes: true,
        },
      }),
      prisma.dailyLog.findMany({
        where: { date: todayIso },
        select: { employeeId: true },
      }),
      prisma.activityEvent.findMany({
        where: { createdAt: { gte: dayStart } },
        orderBy: { createdAt: 'desc' },
        select: { employeeId: true, createdAt: true },
      }),
      prisma.activityEvent.findMany({
        where: { createdAt: { gte: recentWindowStart } },
        orderBy: { createdAt: 'desc' },
        take: 14,
        select: {
          id: true,
          type: true,
          actorName: true,
          employeeId: true,
          leadId: true,
          leadName: true,
          fromValue: true,
          toValue: true,
          details: true,
          createdAt: true,
        },
      }),
      prisma.taskDirective.findMany({
        where: { status: { notIn: ['done', 'cancelled'] } },
        select: { employeeId: true, dueDate: true },
      }),
      prisma.lead.findMany({
        where: { assignedEmployeeId: { not: null } },
        select: {
          assignedEmployeeId: true,
          status: true,
          nextFollowup: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      getAllSettings(),
    ]);

  const geofence = resolveOfficeGeofenceConfig(settings);
  const attMap = new Map(attendances.map((row) => [row.employeeId, row]));
  const logSet = new Set(dailyLogs.map((row) => row.employeeId));

  const staffStatus: OfficePulseStaffRow[] = employees.map((emp) => {
    const att = attMap.get(emp.id);
    const loc = att
      ? resolveAttendanceLocationStatus(att.source, att.notes)
      : {
          locationType: 'unverified' as const,
          locationLabel: 'Not Checked In',
          latitude: null,
          longitude: null,
          accuracyMeters: null,
          distanceMeters: null,
          mapsUrl: null,
        };

    const empActivities = todayActivities.filter((a) => a.employeeId === emp.id);
    const lastActionAt = empActivities[0]?.createdAt ? empActivities[0].createdAt.toISOString() : null;

    const empTasks = openTasks.filter((t) => t.employeeId === emp.id);
    const overdueTasks = empTasks.filter((t) => t.dueDate && t.dueDate < todayIso).length;

    const empLeads = assignedLeads.filter(
      (l) => l.assignedEmployeeId === emp.id && !CLOSED_LEAD_STATUSES.has(l.status),
    );
    const overdueLeads = empLeads.filter((l) => isLeadOverdue(l, todayIso, nowMs)).length;

    return {
      id: emp.id,
      empId: emp.empId,
      name: emp.name,
      role: emp.role,
      team: emp.team,
      checkIn: att?.checkIn ?? null,
      checkOut: att?.checkOut ?? null,
      status: att?.checkIn ? att.status : 'Not Checked In',
      hoursWorked: att?.hoursWorked ?? 0,
      locationType: att?.checkIn ? loc.locationType : 'unverified',
      locationLabel: att?.checkIn ? loc.locationLabel : 'Not Checked In',
      distanceMeters: att?.checkIn ? loc.distanceMeters : null,
      accuracyMeters: att?.checkIn ? loc.accuracyMeters : null,
      mapsUrl: att?.checkIn ? loc.mapsUrl : null,
      eodSubmitted: logSet.has(emp.id),
      todayActions: empActivities.length,
      lastActionAt,
      activeLeads: empLeads.length,
      overdueLeads,
      openTasks: empTasks.length,
      overdueTasks,
    };
  });

  const checkedInCount = staffStatus.filter((s) => Boolean(s.checkIn)).length;
  const onTimeCount = staffStatus.filter((s) => s.checkIn && s.status === 'Present').length;
  const lateCount = staffStatus.filter((s) => s.checkIn && s.status === 'Late').length;
  const officeLocationCount = staffStatus.filter((s) => s.checkIn && s.locationType === 'office_location').length;
  const remoteLocationCount = staffStatus.filter((s) => s.checkIn && s.locationType === 'remote_location').length;
  const locationMissingCount = staffStatus.filter(
    (s) =>
      s.checkIn &&
      (s.locationType === 'location_denied' ||
        s.locationType === 'location_unavailable' ||
        s.locationType === 'unverified'),
  ).length;

  return {
    dhakaDate: todayIso,
    dhakaTime: nowTime,
    officeLatitude: geofence.latitude,
    officeLongitude: geofence.longitude,
    geofenceRadiusMeters: geofence.radiusMeters,
    officeLocationStrict: geofence.strictLocation,
    officeMapsUrl: buildGoogleMapsUrl(geofence.latitude, geofence.longitude),
    summary: {
      totalStaff: staffStatus.length,
      checkedInCount,
      onTimeCount,
      lateCount,
      notCheckedInCount: Math.max(0, staffStatus.length - checkedInCount),
      officeLocationCount,
      remoteLocationCount,
      locationMissingCount,
      eodSubmittedCount: staffStatus.filter((s) => s.eodSubmitted).length,
      todayActionsTotal: todayActivities.length,
      openTasksCount: openTasks.length,
      overdueTasksCount: openTasks.filter((t) => t.dueDate && t.dueDate < todayIso).length,
      overdueLeadsCount: staffStatus.reduce((acc, s) => acc + s.overdueLeads, 0),
    },
    staffStatus,
    recentFeed: recentFeedRows.map((row) => ({
      id: row.id,
      type: row.type,
      actorName: row.actorName,
      employeeId: row.employeeId,
      leadId: row.leadId,
      leadName: row.leadName,
      fromValue: row.fromValue,
      toValue: row.toValue,
      summary: row.details,
      createdAt: row.createdAt.toISOString(),
    })),
  };
}

export async function buildCounselorDeskSummary(
  employee: { id: string; empId: string; name: string; role?: string | null; team?: string | null } | null,
): Promise<CounselorDeskSummary> {
  const nowMs = Date.now();
  const todayIso = dhakaTodayIso(nowMs);
  const nowTime = dhakaTimeNow(nowMs);

  if (!employee) {
    return {
      dhakaDate: todayIso,
      dhakaTime: nowTime,
      employeeName: null,
      empId: null,
      role: null,
      team: null,
      checkIn: null,
      checkOut: null,
      attendanceStatus: 'Unlinked Account',
      hoursWorked: 0,
      locationType: 'unverified',
      locationLabel: 'No GPS Data',
      distanceMeters: null,
      mapsUrl: null,
      eodSubmitted: false,
      todayActions: 0,
      openTasks: 0,
      overdueTasks: 0,
      overdueLeads: 0,
    };
  }

  const dayStart = dhakaStartUtc(todayIso);
  const [att, log, todayActions, tasks, leads] = await Promise.all([
    prisma.attendance.findUnique({
      where: { empId_date: { empId: employee.empId, date: todayIso } },
      select: { checkIn: true, checkOut: true, status: true, hoursWorked: true, source: true, notes: true },
    }),
    prisma.dailyLog.findUnique({
      where: { empId_date: { empId: employee.empId, date: todayIso } },
      select: { id: true, date: true },
    }),
    prisma.activityEvent.count({
      where: { employeeId: employee.id, createdAt: { gte: dayStart } },
    }),
    prisma.taskDirective.findMany({
      where: { employeeId: employee.id, status: { notIn: ['done', 'cancelled'] } },
      select: { dueDate: true },
    }),
    prisma.lead.findMany({
      where: { assignedEmployeeId: employee.id },
      select: { status: true, nextFollowup: true, createdAt: true, updatedAt: true },
    }),
  ]);

  const loc = att
    ? resolveAttendanceLocationStatus(att.source, att.notes)
    : {
        locationType: 'unverified' as const,
        locationLabel: 'Not Checked In',
        distanceMeters: null,
        mapsUrl: null,
      };

  const activeLeads = leads.filter((l) => !CLOSED_LEAD_STATUSES.has(l.status));
  const overdueLeads = activeLeads.filter((l) => isLeadOverdue(l, todayIso, nowMs)).length;

  return {
    dhakaDate: todayIso,
    dhakaTime: nowTime,
    employeeName: employee.name,
    empId: employee.empId,
    role: employee.role ?? null,
    team: employee.team ?? null,
    checkIn: att?.checkIn ?? null,
    checkOut: att?.checkOut ?? null,
    attendanceStatus: att?.checkIn ? att.status : 'Not Checked In',
    hoursWorked: att?.hoursWorked ?? 0,
    locationType: att?.checkIn ? loc.locationType : 'unverified',
    locationLabel: att?.checkIn ? loc.locationLabel : 'Not Checked In',
    distanceMeters: att?.checkIn ? loc.distanceMeters : null,
    mapsUrl: att?.checkIn ? loc.mapsUrl : null,
    eodSubmitted: Boolean(log),
    todayActions,
    openTasks: tasks.length,
    overdueTasks: tasks.filter((t) => t.dueDate && t.dueDate < todayIso).length,
    overdueLeads,
  };
}
