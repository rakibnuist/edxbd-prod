import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { canAccessFinanceRole } from '@/lib/auth';
import {
  buildCounselorLeadWhere,
  canAccessLeadScope,
  verifyLiveAdminUser,
  verifyLiveStaffUser,
} from '@/lib/auth-user';
import { generatePublicToken, logActivityEvent } from '@/lib/crm-operations';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import {
  APPLICATION_TRACKER_STAGES,
  DESTINATION_OPTIONS,
  DEGREE_OPTIONS,
  deriveLeadStatusFromStage,
  generateNextLeadRef,
  getDocsTemplateForDestination,
  getIntakeSortValue,
  normalizeTrackerStage,
  validateApplicationPatchPayload,
  type ApplicationRowDto,
} from '@/lib/application-tracker';
import prisma from '@/lib/prisma';

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, private' };

function isApplicationLeadWhere(): Prisma.LeadWhereInput {
  return { isApplication: true };
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;
    if (!actor) {
      return NextResponse.json(
        { message: 'Unauthorized - Staff access required' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const isAdmin = Boolean(admin);
    const canSeeFinance = canAccessFinanceRole(actor.role);
    const url = new URL(request.url);
    const market = (url.searchParams.get('market') || 'all').trim().toLowerCase();
    const channel = (url.searchParams.get('channel') || 'all').trim().toLowerCase();
    const destination = (url.searchParams.get('destination') || 'all').trim();
    const intake = (url.searchParams.get('intake') || 'all').trim();
    const stage = (url.searchParams.get('stage') || 'all').trim().toLowerCase();
    const embassy = (url.searchParams.get('embassy') || 'all').trim();
    const consultant = (url.searchParams.get('consultant') || 'all').trim();
    const search = (url.searchParams.get('search') || '').trim().toLowerCase();
    const hideWithdrawn = url.searchParams.get('hideWithdrawn') === '1';

    // Strict China market isolation for counselors
    if (!isAdmin && market === 'china') {
      return NextResponse.json(
        { error: 'Access denied to China market applications.' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const andFilters: Prisma.LeadWhereInput[] = [isApplicationLeadWhere()];

    if (!isAdmin) {
      andFilters.push({ leadMarket: { not: 'China' } });
      andFilters.push(buildCounselorLeadWhere(staff?.employee ?? null));
    } else if (market === 'china') {
      andFilters.push({ leadMarket: 'China' });
    } else if (market === 'bangladesh') {
      andFilters.push({ leadMarket: { not: 'China' } });
    }

    if (channel === 'office' || channel === 'b2c') {
      andFilters.push({
        OR: [{ channelType: 'B2C' }, { channelType: '' }],
      });
    } else if (channel === 'b2b') {
      andFilters.push({
        OR: [{ channelType: 'B2B' }, { source: { in: ['B2B', 'Agent'] } }],
      });
    }

    if (destination && destination.toLowerCase() !== 'all') {
      andFilters.push({ country: destination });
    }
    if (intake && intake.toLowerCase() !== 'all') {
      andFilters.push({ assessIntake: intake });
    }
    if (stage && stage !== 'all') {
      andFilters.push({ applicationStage: stage });
    }
    if (embassy && embassy.toLowerCase() !== 'all') {
      andFilters.push({ embassyStatus: embassy });
    }
    if (consultant && consultant.toLowerCase() !== 'all') {
      andFilters.push({
        OR: [{ assignedEmployeeId: consultant }, { assignedTo: consultant }],
      });
    }
    if (hideWithdrawn) {
      andFilters.push({
        applicationStage: { notIn: ['documents_withdraw', 'application_withdraw'] },
      });
    }

    const [leads, employees, promotableRaw, catalogUniversities, catalogPrograms] = await Promise.all([
      prisma.lead.findMany({
        where: { AND: andFilters },
        include: {
          assignedEmployee: { select: { id: true, name: true, empId: true } },
          documents: { select: { status: true } },
          universityApps: { select: { university: true, status: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.employee.findMany({
        where: { active: true },
        select: { id: true, empId: true, name: true, team: true },
        orderBy: { name: 'asc' },
      }),
      prisma.lead.findMany({
        where: {
          AND: [
            { isApplication: false },
            { status: { notIn: ['not_interested', 'closed'] } },
            ...(!isAdmin
              ? [{ leadMarket: { not: 'China' } }, buildCounselorLeadWhere(staff?.employee ?? null)]
              : []),
          ],
        },
        select: {
          id: true,
          leadRef: true,
          name: true,
          phone: true,
          email: true,
          country: true,
          assessIntake: true,
          university: true,
          degree: true,
          program: true,
          assignedTo: true,
          status: true,
          leadMarket: true,
          source: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.university.findMany({
        select: { id: true, name: true, country: true, majors: true },
        orderBy: { name: 'asc' },
      }),
      prisma.program.findMany({
        select: { name: true, subject: true, level: true },
        distinct: ['name'],
        orderBy: { name: 'asc' },
        take: 300,
      }),
    ]);

    // Finance-admin-only linkage: compute received & spent totals by leadId or leadRef
    const receivedByLead = new Map<string, number>();
    const spentByLead = new Map<string, number>();

    if (canSeeFinance && leads.length > 0) {
      const leadIds = leads.map((l) => l.id);
      const leadRefMap = new Map<string, string>();
      for (const l of leads) {
        if (l.leadRef) leadRefMap.set(l.leadRef.trim().toUpperCase(), l.id);
      }
      const refKeys = Array.from(new Set(leads.map((l) => l.leadRef).filter((v): v is string => Boolean(v))));

      const [incomes, expenses] = await Promise.all([
        prisma.financeIncome.findMany({
          where: {
            excludeFromCash: false,
            OR: [
              { leadId: { in: leadIds } },
              ...(refKeys.length > 0 ? [{ leadRef: { in: refKeys } }] : []),
            ],
          },
          select: { id: true, leadId: true, leadRef: true, amount: true },
        }),
        prisma.financeExpense.findMany({
          where: {
            OR: [
              { leadId: { in: leadIds } },
              ...(refKeys.length > 0 ? [{ leadRef: { in: refKeys } }] : []),
            ],
          },
          select: { id: true, leadId: true, leadRef: true, amount: true },
        }),
      ]);

      const seenIncome = new Set<string>();
      for (const inc of incomes) {
        const targetLeadId =
          (inc.leadId && leadIds.includes(inc.leadId) ? inc.leadId : null) ||
          (inc.leadRef ? leadRefMap.get(inc.leadRef.trim().toUpperCase()) || null : null);
        if (!targetLeadId) continue;
        const dedupKey = `${targetLeadId}:${inc.id}`;
        if (seenIncome.has(dedupKey)) continue;
        seenIncome.add(dedupKey);
        receivedByLead.set(targetLeadId, (receivedByLead.get(targetLeadId) || 0) + (Number(inc.amount) || 0));
      }

      const seenExpense = new Set<string>();
      for (const exp of expenses) {
        const targetLeadId =
          (exp.leadId && leadIds.includes(exp.leadId) ? exp.leadId : null) ||
          (exp.leadRef ? leadRefMap.get(exp.leadRef.trim().toUpperCase()) || null : null);
        if (!targetLeadId) continue;
        const dedupKey = `${targetLeadId}:${exp.id}`;
        if (seenExpense.has(dedupKey)) continue;
        seenExpense.add(dedupKey);
        spentByLead.set(targetLeadId, (spentByLead.get(targetLeadId) || 0) + (Number(exp.amount) || 0));
      }
    }

    let rows: ApplicationRowDto[] = leads.map((l) => {
      const docsTotal = l.documents.length;
      const docsReceived = l.documents.filter((d) => d.status === 'received' || d.status === 'verified').length;
      const uniTotal = l.universityApps.length;
      const uniAdmitted = l.universityApps.filter((u) => u.status === 'admitted').length;
      const uniList = l.universityApps.map((u) => u.university).filter(Boolean).join(', ');
      const normalizedStage = normalizeTrackerStage(l.applicationStage);

      return {
        id: l.id,
        legacyCrmId: l.legacyCrmId,
        leadRef: l.leadRef,
        name: l.name,
        email: l.email,
        phone: l.phone,
        country: l.country,
        leadMarket: l.leadMarket || 'Bangladesh',
        channelType: l.channelType || 'B2C',
        source: l.source,
        referrer: l.referrer,
        nationality: l.nationality,
        passport: l.passport,
        assessIntake: l.assessIntake,
        degree: l.degree,
        program: l.program,
        university: l.university,
        gpa: l.gpa,
        assessAcademicLevel: l.assessAcademicLevel,
        assessAcademicResults: l.assessAcademicResults,
        assessLanguage: l.assessLanguage,
        status: l.status,
        applicationStage: normalizedStage,
        embassyStatus: l.embassyStatus,
        embassyDate: l.embassyDate,
        hardcopyStatus: l.hardcopyStatus,
        visaDeadline: l.visaDeadline,
        departureDate: l.departureDate,
        nextFollowup: l.nextFollowup,
        driveLink: l.driveLink,
        serviceFee: canSeeFinance ? l.serviceFee || 0 : 0,
        paidAmount: canSeeFinance ? l.paidAmount || 0 : 0,
        deposit: canSeeFinance ? l.deposit || 0 : 0,
        applicationNotes: l.applicationNotes,
        notes: l.notes,
        bloodGroup: l.bloodGroup,
        dateOfBirth: l.dateOfBirth,
        emergencyContact: l.emergencyContact,
        medicalNotes: l.medicalNotes,
        publicToken: l.publicToken,
        publicEnabled: l.publicEnabled,
        assignedTo: l.assignedTo,
        assignedEmployeeId: l.assignedEmployeeId,
        employeeName: l.assignedEmployee?.name || l.assignedTo || null,
        docsTotal,
        docsReceived,
        uniTotal,
        uniAdmitted,
        uniList,
        financeReceivedTotal: canSeeFinance ? receivedByLead.get(l.id) || 0 : null,
        financeSpentTotal: canSeeFinance ? spentByLead.get(l.id) || 0 : null,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      };
    });

    if (search) {
      rows = rows.filter((r) =>
        [
          r.name,
          r.leadRef,
          r.phone,
          r.email,
          r.passport,
          r.university,
          r.uniList,
          r.program,
          r.country,
          r.assessIntake,
          r.referrer,
          r.employeeName,
          r.nationality,
        ].some((val) => val && val.toLowerCase().includes(search)),
      );
    }

    // Sort: Latest Intake DESC, then updatedAt DESC
    rows.sort((a, b) => {
      const intakeA = getIntakeSortValue(a.assessIntake);
      const intakeB = getIntakeSortValue(b.assessIntake);
      if (intakeA !== intakeB) return intakeB - intakeA;
      return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    });

    const destinationSet = new Set<string>([...DESTINATION_OPTIONS]);
    const intakeSet = new Set<string>(['March 2027', 'September 2026', 'March 2026', 'September 2027']);
    const universitySet = new Set<string>();
    const programSet = new Set<string>();
    const referrerSet = new Set<string>();
    const degreeSet = new Set<string>([...DEGREE_OPTIONS]);

    for (const u of catalogUniversities) {
      if (u.name) universitySet.add(u.name.trim());
      if (u.country) destinationSet.add(u.country.trim());
      if (u.majors) {
        for (const m of u.majors.split(',')) {
          const trimmed = m.trim();
          if (trimmed.length > 2) programSet.add(trimmed);
        }
      }
    }

    for (const p of catalogPrograms) {
      if (p.name) programSet.add(p.name.trim());
    }

    for (const r of rows) {
      if (r.country) destinationSet.add(r.country);
      if (r.assessIntake) intakeSet.add(r.assessIntake);
      if (r.university) universitySet.add(r.university);
      if (r.program) programSet.add(r.program);
      if (r.referrer) referrerSet.add(r.referrer);
      if (r.degree) degreeSet.add(r.degree);
    }

    const sortedIntakes = Array.from(intakeSet).sort((a, b) => getIntakeSortValue(b) - getIntakeSortValue(a));

    return NextResponse.json(
      {
        isAdmin,
        canAccessFinance: canSeeFinance,
        stages: APPLICATION_TRACKER_STAGES,
        rows,
        meta: {
          employees,
          destinations: Array.from(destinationSet).sort(),
          intakes: sortedIntakes,
          universities: Array.from(universitySet).sort(),
          programs: Array.from(programSet).sort(),
          catalogUniversities: catalogUniversities.map((u) => ({
            name: u.name,
            country: u.country,
            majors: u.majors
              ? u.majors
                  .split(',')
                  .map((m: string) => m.trim())
                  .filter(Boolean)
              : [],
          })),
          referrers: Array.from(referrerSet).sort(),
          degrees: Array.from(degreeSet),
          promotableLeads: promotableRaw,
        },
      },
      { headers: NO_STORE_HEADERS },
    );
  } catch (err) {
    console.error('[applications GET]', err);
    return NextResponse.json(
      { error: 'Failed to load application tracker records.' },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;
    if (!actor) {
      return NextResponse.json(
        { message: 'Unauthorized - Staff access required' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const isAdmin = Boolean(admin);
    const canSeeFinance = canAccessFinanceRole(actor.role);
    const body = await readLimitedJson(request, 32 * 1024);

    // Block counselors from setting China market
    if (!isAdmin && typeof body.leadMarket === 'string' && body.leadMarket.trim().toLowerCase() === 'china') {
      return NextResponse.json(
        { error: 'Counselor accounts cannot create or modify China market files.' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const existingLeadId = typeof body.existingLeadId === 'string' ? body.existingLeadId.trim() : '';

    // Mode A: Promote an existing CRM Lead into Application Tracker
    if (existingLeadId) {
      const existing = await prisma.lead.findUnique({
        where: { id: existingLeadId },
      });
      if (!existing) {
        return NextResponse.json({ error: 'Selected lead not found.' }, { status: 404, headers: NO_STORE_HEADERS });
      }
      if (!isAdmin && existing.leadMarket === 'China') {
        return NextResponse.json(
          { error: 'Access denied to China market applications.' },
          { status: 403, headers: NO_STORE_HEADERS },
        );
      }
      if (!canAccessLeadScope({ role: actor.role, employee: staff?.employee }, existing)) {
        return NextResponse.json(
          { error: 'Unauthorized - Lead is assigned to another counselor.' },
          { status: 403, headers: NO_STORE_HEADERS },
        );
      }

      const patchValidation = validateApplicationPatchPayload(body);
      if (patchValidation.error) {
        return NextResponse.json({ error: patchValidation.error }, { status: 400, headers: NO_STORE_HEADERS });
      }
      const patch = { ...(patchValidation.data || {}) };
      if (!canSeeFinance) {
        delete patch.serviceFee;
        delete patch.paidAmount;
        delete patch.deposit;
      }
      const nextStage = typeof patch.applicationStage === 'string' ? patch.applicationStage : normalizeTrackerStage(existing.applicationStage);
      const nextToken = existing.publicToken || generatePublicToken();
      let nextRef = (typeof patch.leadRef === 'string' ? patch.leadRef : existing.leadRef) || null;
      if (!nextRef) {
        const refs = await prisma.lead.findMany({ where: { leadRef: { not: null } }, select: { leadRef: true } });
        nextRef = generateNextLeadRef(refs.map((r) => r.leadRef));
      }

      // Resolve assigned employee name if changed by admin
      let assignedEmployeeId = existing.assignedEmployeeId;
      let assignedTo = existing.assignedTo;
      if (isAdmin && 'assignedEmployeeId' in patch) {
        assignedEmployeeId = (patch.assignedEmployeeId as string | null) ?? null;
        if (assignedEmployeeId) {
          const emp = await prisma.employee.findUnique({ where: { id: assignedEmployeeId }, select: { name: true } });
          assignedTo = emp?.name || assignedTo;
        } else {
          assignedTo = null;
        }
      }

      const updated = await prisma.lead.update({
        where: { id: existingLeadId },
        data: {
          ...patch,
          isApplication: true,
          leadRef: nextRef,
          publicToken: nextToken,
          publicEnabled: true,
          applicationStage: nextStage,
          status: deriveLeadStatusFromStage(nextStage, existing.status),
          assignedEmployeeId,
          assignedTo,
        },
      });

      const docCount = await prisma.leadDocument.count({ where: { leadId: updated.id } });
      if (docCount === 0) {
        const templateDocs = getDocsTemplateForDestination(updated.country);
        await prisma.leadDocument.createMany({
          data: templateDocs.map((docType) => ({
            leadId: updated.id,
            docType,
            status: 'pending',
            updatedBy: actor.email,
          })),
        });
      }

      if (updated.university) {
        const uniCount = await prisma.leadUniversityApp.count({ where: { leadId: updated.id } });
        if (uniCount === 0) {
          await prisma.leadUniversityApp.create({
            data: {
              leadId: updated.id,
              university: updated.university,
              program: updated.program || null,
              status: 'documents',
              updatedBy: actor.email,
            },
          });
        }
      }

      void logActivityEvent({
        type: 'application_opened',
        actorName: actor.email,
        actorUserId: actor.userId,
        employeeId: updated.assignedEmployeeId,
        leadId: updated.id,
        leadName: updated.name,
        toValue: `${updated.leadRef || ''} · ${updated.country} (${nextStage})`,
      });

      const sanitizedApplication = canSeeFinance
        ? updated
        : { ...updated, serviceFee: 0, paidAmount: 0, deposit: 0 };

      return NextResponse.json({ id: updated.id, application: sanitizedApplication }, { status: 201, headers: NO_STORE_HEADERS });
    }

    // Mode B: Create a brand-new Application Tracker student file
    const validation = validateApplicationPatchPayload(body);
    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers: NO_STORE_HEADERS });
    }
    const data = validation.data || {};
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name) {
      return NextResponse.json({ error: 'Student name is required.' }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const country = typeof data.country === 'string' && data.country ? data.country : 'China';
    const stage = typeof data.applicationStage === 'string' ? data.applicationStage : 'documents';
    const market = isAdmin && data.leadMarket === 'China' ? 'China' : 'Bangladesh';
    const channelType = data.channelType === 'B2B' ? 'B2B' : 'B2C';
    const source = typeof data.source === 'string' && data.source
      ? data.source
      : channelType === 'B2B'
        ? 'B2B'
        : 'In-House';

    let assignedEmployeeId: string | null = null;
    let assignedTo: string | null = null;
    if (isAdmin && typeof data.assignedEmployeeId === 'string' && data.assignedEmployeeId) {
      const emp = await prisma.employee.findUnique({
        where: { id: data.assignedEmployeeId },
        select: { id: true, name: true },
      });
      if (emp) {
        assignedEmployeeId = emp.id;
        assignedTo = emp.name;
      }
    } else if (!isAdmin && staff?.employee) {
      assignedEmployeeId = staff.employee.id;
      assignedTo = staff.employee.name;
    }

    let leadRef = typeof data.leadRef === 'string' && data.leadRef ? data.leadRef : null;
    if (!leadRef) {
      const refs = await prisma.lead.findMany({ where: { leadRef: { not: null } }, select: { leadRef: true } });
      leadRef = generateNextLeadRef(refs.map((r) => r.leadRef));
    }

    const email =
      typeof data.email === 'string' && data.email
        ? data.email
        : `${leadRef.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.eduexpressint.com`;
    const phone = typeof data.phone === 'string' && data.phone ? data.phone : '—';

    const created = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        country,
        destinationInterest: country.toLowerCase(),
        program: (data.program as string | null) ?? null,
        assessSubject: (data.program as string | null) ?? null,
        assessIntake: (data.assessIntake as string | null) ?? null,
        degree: (data.degree as string | null) ?? null,
        university: (data.university as string | null) ?? null,
        nationality: (data.nationality as string | null) ?? (market === 'China' ? 'China' : 'Bangladesh'),
        passport: (data.passport as string | null) ?? null,
        referrer: (data.referrer as string | null) ?? null,
        leadMarket: market,
        channelType,
        source,
        leadType: 'application',
        isApplication: true,
        leadRef,
        applicationStage: stage,
        status: deriveLeadStatusFromStage(stage),
        embassyStatus: (data.embassyStatus as string | null) ?? 'Pending',
        embassyDate: (data.embassyDate as string | null) ?? null,
        hardcopyStatus: (data.hardcopyStatus as string | null) ?? 'Pending',
        visaDeadline: (data.visaDeadline as string | null) ?? null,
        departureDate: (data.departureDate as string | null) ?? null,
        driveLink: (data.driveLink as string | null) ?? null,
        serviceFee: canSeeFinance ? Number(data.serviceFee) || 0 : 0,
        paidAmount: canSeeFinance ? Number(data.paidAmount) || 0 : 0,
        deposit: canSeeFinance ? Number(data.deposit) || 0 : 0,
        applicationNotes: (data.applicationNotes as string | null) ?? null,
        notes: (data.notes as string | null) ?? null,
        bloodGroup: (data.bloodGroup as string | null) ?? null,
        dateOfBirth: (data.dateOfBirth as string | null) ?? null,
        emergencyContact: (data.emergencyContact as string | null) ?? null,
        medicalNotes: (data.medicalNotes as string | null) ?? null,
        publicToken: generatePublicToken(),
        publicEnabled: true,
        assignedEmployeeId,
        assignedTo,
        consentTimestamp: new Date(),
        consentPolicyVersion: 'admin_application_tracker',
      },
    });

    // Auto-seed destination document checklist
    const templateDocs = getDocsTemplateForDestination(country);
    await prisma.leadDocument.createMany({
      data: templateDocs.map((docType) => ({
        leadId: created.id,
        docType,
        status: 'pending',
        updatedBy: actor.email,
      })),
    });

    // Seed initial university app if university provided
    if (created.university) {
      await prisma.leadUniversityApp.create({
        data: {
          leadId: created.id,
          university: created.university,
          program: created.program || null,
          status: 'documents',
          updatedBy: actor.email,
        },
      });
    }

    void logActivityEvent({
      type: 'application_opened',
      actorName: actor.email,
      actorUserId: actor.userId,
      employeeId: created.assignedEmployeeId,
      leadId: created.id,
      leadName: created.name,
      toValue: `${created.leadRef} · ${country} (${stage})`,
    });

    const sanitizedCreated = canSeeFinance
      ? created
      : { ...created, serviceFee: 0, paidAmount: 0, deposit: 0 };

    return NextResponse.json({ id: created.id, application: sanitizedCreated }, { status: 201, headers: NO_STORE_HEADERS });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('[applications POST]', error);
    return NextResponse.json(
      { error: 'Failed to create application record.' },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
