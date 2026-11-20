import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { logActivityEvent } from '@/lib/crm-operations';
import { computeHoursWorked, dhakaTimeNow, dhakaTodayIso } from '@/lib/kpi-workflow';
import {
  appendCheckInLocationNote,
  classifyCheckInLocation,
  resolveAttendanceLocationStatus,
  resolveOfficeGeofenceConfig,
} from '@/lib/office-location';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { getAllSettings } from '@/lib/settings';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;
    if (!actor) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || dhakaTodayIso();
    const [records, settings] = await Promise.all([
      prisma.attendance.findMany({
        where: isAdminRole(actor.role)
          ? { date }
          : { date, employeeId: staff?.employee?.id || '__none__' },
        orderBy: { empId: 'asc' },
      }),
      getAllSettings(),
    ]);

    const geofence = resolveOfficeGeofenceConfig(settings);

    return NextResponse.json(
      {
        date,
        records: records.map((r) => ({
          ...r,
          locationStatus: resolveAttendanceLocationStatus(r.source, r.notes),
        })),
        geofence,
      },
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch {
    return NextResponse.json({ error: 'Failed to load attendance' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const decoded = admin || staff;
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }

    const isAdmin = isAdminRole(decoded.role);
    const body = await readLimitedJson(request, 16 * 1024);
    const requestedEmployeeId = typeof body.employeeId === 'string' ? body.employeeId.trim() : '';

    if (!isAdmin) {
      if (!staff?.employee) {
        return NextResponse.json({ error: 'Your user login is not linked to an employee profile.' }, { status: 403 });
      }
      if (requestedEmployeeId && requestedEmployeeId !== staff.employee.id && requestedEmployeeId !== staff.employee.empId) {
        return NextResponse.json({ error: 'Unauthorized - You can only record your own attendance.' }, { status: 403 });
      }
    }

    const employeeId = isAdmin ? requestedEmployeeId : (staff?.employee?.id || '');
    const employee = employeeId
      ? await prisma.employee.findFirst({ where: { OR: [{ id: employeeId }, { empId: employeeId }] } })
      : null;
    if (!employee) {
      return NextResponse.json({ error: 'Valid employee is required.' }, { status: 400 });
    }

    const date = isAdmin && typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
      ? body.date
      : dhakaTodayIso();
    const mode = typeof body.mode === 'string' ? body.mode : 'checkin';
    const existing = await prisma.attendance.findUnique({
      where: { empId_date: { empId: employee.empId, date } },
    });

    const nowTime = dhakaTimeNow();
    let checkIn = isAdmin && typeof body.checkIn === 'string' ? body.checkIn.trim().slice(0, 10) : existing?.checkIn || null;
    let checkOut = isAdmin && typeof body.checkOut === 'string' ? body.checkOut.trim().slice(0, 10) : existing?.checkOut || null;
    let status = isAdmin && typeof body.status === 'string' ? body.status.trim().slice(0, 30) : existing?.status || 'Present';

    if (mode === 'checkin' && !checkIn) {
      checkIn = nowTime;
      status = nowTime > '10:20' ? 'Late' : 'Present';
    } else if (mode === 'checkout') {
      if (!checkIn) checkIn = nowTime;
      checkOut = nowTime;
    }

    const settings = mode === 'manual' ? null : await getAllSettings();
    const geofence = resolveOfficeGeofenceConfig(settings || {});
    const location = classifyCheckInLocation(
      {
        latitude: body.latitude,
        longitude: body.longitude,
        accuracyMeters: body.accuracyMeters,
        locationError: body.locationError,
      },
      geofence,
    );

    if (mode === 'checkin' && !existing?.checkIn && geofence.strictLocation && location.latitude === null) {
      return NextResponse.json(
        {
          error:
            'GPS location permission is required to check in. Allow Location access in your browser and try again.',
          locationRequired: true,
        },
        { status: 400 },
      );
    }

    const nextSource = mode === 'manual' ? 'manual' : location.locationType;
    const rawUserNote = typeof body.notes === 'string' ? body.notes.trim().slice(0, 220) : undefined;
    const computedNotes =
      mode === 'manual'
        ? rawUserNote ?? existing?.notes ?? null
        : appendCheckInLocationNote(rawUserNote ?? existing?.notes, location);

    const hoursWorked = computeHoursWorked(checkIn, checkOut);
    const preserveCheckInLocationOnCheckout = mode === 'checkout' && Boolean(existing?.checkIn);
    const saved = await prisma.attendance.upsert({
      where: { empId_date: { empId: employee.empId, date } },
      update: {
        employeeId: employee.id,
        name: employee.name,
        checkIn,
        checkOut,
        hoursWorked,
        status,
        ...(mode === 'checkin' && !existing?.checkIn
          ? { source: nextSource, notes: computedNotes }
          : mode === 'manual'
            ? { source: 'manual', notes: computedNotes }
            : preserveCheckInLocationOnCheckout
              ? {}
              : { source: nextSource, notes: computedNotes }),
      },
      create: {
        employeeId: employee.id,
        empId: employee.empId,
        name: employee.name,
        date,
        checkIn,
        checkOut,
        hoursWorked,
        status,
        source: nextSource,
        notes: computedNotes,
      },
    });

    if (!existing) {
      void logActivityEvent({
        type: 'attendance_in',
        actorName: employee.name,
        actorUserId: decoded.userId,
        employeeId: employee.id,
        toValue: `${status} (${checkIn || date})`,
        details:
          location.latitude !== null && location.longitude !== null
            ? `${location.locationLabel} (${location.latitude}, ${location.longitude})`
            : location.locationLabel,
      });
    }

    return NextResponse.json(
      {
        ...saved,
        locationStatus: resolveAttendanceLocationStatus(saved.source, saved.notes),
      },
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}
