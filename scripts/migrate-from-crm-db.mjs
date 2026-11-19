import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { PrismaClient } from '@prisma/client';

const CRM_DB_PATH = process.env.CRM_DB_PATH || '/docker/edxbd-production/imports/crm.db';

function normalizePhone10(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length < 7) return '';
  return digits.slice(-10);
}

function normalizePhoneFull(phone) {
  const raw = String(phone || '').replace(/[^\d+]/g, '');
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (/^88001[0-9]{9}$/.test(digits)) return `+880${digits.slice(4)}`;
  if (/^01[0-9]{9}$/.test(digits)) return `+88${digits}`;
  if (/^1[3-9][0-9]{8}$/.test(digits)) return `+880${digits}`;
  if (raw.startsWith('+')) return `+${digits}`;
  return digits;
}

function mapCrmStatus(raw) {
  const key = String(raw || '').trim().toLowerCase();
  const map = {
    'new lead': 'new',
    'new': 'new',
    'contacted': 'contacted',
    'no response': 'no_response',
    'positive': 'qualified',
    'qualified': 'qualified',
    'office visited': 'consultation_completed',
    'file opened': 'application_started',
    'application submitted': 'application_submitted',
    'admitted': 'admission_received',
    'visa applied': 'visa_applied',
    'visa approved': 'visa_approved',
    'enrolled': 'enrolled',
    'not interested': 'not_interested',
    'application withdraw': 'closed',
    'documents withdraw': 'closed',
    'closed': 'closed',
  };
  return map[key] || 'new';
}

function mapCrmStage(raw) {
  const key = String(raw || '').trim().toLowerCase();
  if (!key) return 'documents';
  if (key === 'fly') return 'enrolled';
  if (key === 'air_ticket') return 'visa';
  if (key === 'application_withdraw' || key === 'partial_payment') return 'documents';
  if (['documents', 'submitted', 'review', 'interview', 'admitted', 'jw202', 'visa', 'enrolled'].includes(key)) {
    return key;
  }
  return 'documents';
}

function inferTeamForEmployee(role, name) {
  const text = `${role || ''} ${name || ''}`.toLowerCase();
  if (text.includes('investor') || text.includes('managing')) return 'general';
  if (text.includes('hr')) return 'europe';
  return 'china';
}

function parseDateSafe(raw) {
  if (!raw) return new Date();
  const iso = String(raw).includes('T') ? String(raw) : String(raw).replace(' ', 'T') + (String(raw).length <= 19 ? 'Z' : '');
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

async function main() {
  console.log(`[migrate] Opening CRM SQLite DB at ${CRM_DB_PATH}`);
  const crm = new DatabaseSync(CRM_DB_PATH, { readOnly: true });
  const prisma = new PrismaClient();

  try {
    // 1. Employees
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true } });
    const userByEmail = new Map(users.map((u) => [u.email.toLowerCase(), u.id]));

    const crmEmployees = crm.prepare('SELECT * FROM employees').all();
    const crmEmpToPrisma = new Map();
    const empByNameLower = new Map();

    for (const emp of crmEmployees) {
      const empId = String(emp.emp_id || `CRM-${emp.id}`).trim();
      const email = emp.email ? String(emp.email).trim().toLowerCase() : null;
      const linkedUserId = email ? userByEmail.get(email) || null : null;
      const saved = await prisma.employee.upsert({
        where: { empId },
        update: {
          name: String(emp.name).trim(),
          role: String(emp.role || 'Counselor').trim(),
          email,
          phone: emp.phone ? normalizePhoneFull(emp.phone) : null,
          active: String(emp.active || 'Yes').toLowerCase() === 'yes',
          team: inferTeamForEmployee(emp.role, emp.name),
          ...(linkedUserId ? { userId: linkedUserId } : {}),
        },
        create: {
          empId,
          name: String(emp.name).trim(),
          role: String(emp.role || 'Counselor').trim(),
          email,
          phone: emp.phone ? normalizePhoneFull(emp.phone) : null,
          active: String(emp.active || 'Yes').toLowerCase() === 'yes',
          joinDate: emp.join_date ? String(emp.join_date).slice(0, 10) : null,
          team: inferTeamForEmployee(emp.role, emp.name),
          userId: linkedUserId,
        },
      });
      crmEmpToPrisma.set(Number(emp.id), saved);
      empByNameLower.set(saved.name.toLowerCase(), saved);
    }
    console.log(`[migrate] Synced ${crmEmployees.length} employees`);

    // 2. Leads (dedupe/merge with existing prod.db leads)
    const existingLeads = await prisma.lead.findMany();
    const byPhone10 = new Map();
    const byEmail = new Map();
    for (const l of existingLeads) {
      const p10 = normalizePhone10(l.phone);
      if (p10 && !byPhone10.has(p10)) byPhone10.set(p10, l);
      if (l.email && !l.email.startsWith('no-email+')) {
        byEmail.set(l.email.toLowerCase(), l);
      }
    }

    const crmLeads = crm.prepare('SELECT * FROM leads ORDER BY id ASC').all();
    const crmLeadIdToPrisma = new Map();
    let mergedCount = 0;
    let createdCount = 0;

    for (const c of crmLeads) {
      const phone = normalizePhoneFull(c.phone);
      const p10 = normalizePhone10(phone || c.phone);
      const rawEmail = c.email ? String(c.email).trim().toLowerCase() : '';
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : '';

      const match = (p10 && byPhone10.get(p10)) || (validEmail && byEmail.get(validEmail)) || null;
      const mappedStatus = mapCrmStatus(c.lead_status);
      const mappedStage = mapCrmStage(c.application_stage);
      const assignedEmp =
        (c.assigned_employee_id && crmEmpToPrisma.get(Number(c.assigned_employee_id))) ||
        (c.assigned_consultant && empByNameLower.get(String(c.assigned_consultant).trim().toLowerCase())) ||
        null;

      const numericGpa =
        typeof c.gpa === 'number' && Number.isFinite(c.gpa) && c.gpa > 0 && c.gpa <= 5.5
          ? Number(c.gpa.toFixed(2))
          : null;

      if (match) {
        const nextToken = c.public_token
          ? String(c.public_token).trim()
          : match.publicToken || crypto.randomBytes(12).toString('hex');
        const nextStatus = match.status === 'new' && mappedStatus !== 'new' ? mappedStatus : match.status;
        const updated = await prisma.lead.update({
          where: { id: match.id },
          data: {
            publicToken: nextToken,
            publicEnabled: c.public_enabled == null ? true : Boolean(c.public_enabled),
            applicationStage: mappedStage !== 'documents' ? mappedStage : match.applicationStage,
            university: c.university || match.university,
            degree: c.degree || c.last_education || match.degree,
            gpa: numericGpa ?? match.gpa,
            visaDeadline: c.visa_deadline || match.visaDeadline,
            departureDate: c.departure_date || match.departureDate,
            nextFollowup: c.next_followup || match.nextFollowup,
            driveLink: c.drive_link || match.driveLink,
            assignedTo: c.assigned_consultant || assignedEmp?.name || match.assignedTo,
            assignedEmployeeId: assignedEmp?.id || match.assignedEmployeeId,
            status: nextStatus,
            notes: c.notes && (!match.notes || !match.notes.includes(String(c.notes).slice(0, 30)))
              ? [match.notes, c.notes].filter(Boolean).join('\n\n')
              : match.notes,
          },
        });
        crmLeadIdToPrisma.set(Number(c.id), updated);
        mergedCount++;
      } else {
        const dest = String(c.destination || 'China').trim() || 'China';
        const isChina = dest.toLowerCase().includes('china');
        const createdAt = parseDateSafe(c.created_at || c.date_added);
        const syntheticEmail = validEmail || `no-email+${p10 || c.id}@leads.eduexpressint.com`;
        const created = await prisma.lead.create({
          data: {
            name: String(c.client_name || 'Student').trim().slice(0, 120),
            email: syntheticEmail,
            phone: phone || `+8800000${c.id}`,
            country: dest,
            destinationInterest: dest.toLowerCase(),
            program: c.program || c.major || null,
            message: c.application_notes || null,
            status: mappedStatus,
            source: String(c.lead_source || c.source || 'crm_migrated').trim(),
            leadType: String(c.lead_type || 'contact').toLowerCase(),
            assignedTeam: isChina ? 'china' : 'active_country_owner',
            assignedTo: c.assigned_consultant || assignedEmp?.name || null,
            assignedEmployeeId: assignedEmp?.id || null,
            assessAcademicLevel: c.last_education || c.degree || null,
            assessAcademicResults: numericGpa != null ? String(numericGpa) : null,
            assessSubject: c.major || null,
            assessIntake: c.intake_term || null,
            assessLanguage: c.english_score || null,
            notes: c.notes || null,
            publicToken: c.public_token ? String(c.public_token).trim() : crypto.randomBytes(12).toString('hex'),
            publicEnabled: c.public_enabled == null ? true : Boolean(c.public_enabled),
            applicationStage: mappedStage,
            university: c.university || null,
            degree: c.degree || c.last_education || null,
            gpa: numericGpa,
            visaDeadline: c.visa_deadline || null,
            departureDate: c.departure_date || null,
            nextFollowup: c.next_followup || null,
            driveLink: c.drive_link || null,
            consentTimestamp: createdAt,
            consentPolicyVersion: 'crm-migration-v1',
            adTrackingConsent: Boolean(c.meta_lead_id),
            createdAt,
          },
        });
        crmLeadIdToPrisma.set(Number(c.id), created);
        if (p10) byPhone10.set(p10, created);
        createdCount++;
      }
    }

    // Backfill publicToken for any remaining prod.db leads without a token
    const tokenless = await prisma.lead.findMany({
      where: { publicToken: null },
      select: { id: true },
    });
    for (const l of tokenless) {
      await prisma.lead.update({
        where: { id: l.id },
        data: { publicToken: crypto.randomBytes(12).toString('hex'), publicEnabled: true },
      });
    }
    console.log(`[migrate] Leads: merged=${mergedCount}, created=${createdCount}, backfilledTokens=${tokenless.length}`);

    // 3. University Applications
    const crmUniApps = crm.prepare('SELECT * FROM lead_university_applications').all();
    let uniCount = 0;
    for (const ua of crmUniApps) {
      const targetLead = crmLeadIdToPrisma.get(Number(ua.lead_id));
      if (!targetLead || !ua.university) continue;
      const existing = await prisma.leadUniversityApp.findFirst({
        where: { leadId: targetLead.id, university: String(ua.university).trim() },
      });
      if (!existing) {
        await prisma.leadUniversityApp.create({
          data: {
            leadId: targetLead.id,
            university: String(ua.university).trim(),
            program: ua.program ? String(ua.program).trim() : null,
            status: String(ua.status || 'documents').trim(),
            applicationId: ua.application_id ? String(ua.application_id).trim() : null,
            submittedOn: ua.submitted_on || null,
            decisionOn: ua.decision_on || null,
            notes: ua.notes || null,
            updatedBy: ua.updated_by || 'CRM Migration',
          },
        });
        uniCount++;
      }
    }
    console.log(`[migrate] University apps added: ${uniCount}`);

    // 4. Lead Documents
    const crmDocs = crm.prepare('SELECT * FROM lead_documents').all();
    let docCount = 0;
    for (const d of crmDocs) {
      const targetLead = crmLeadIdToPrisma.get(Number(d.lead_id));
      if (!targetLead || !d.doc_type) continue;
      const existing = await prisma.leadDocument.findFirst({
        where: { leadId: targetLead.id, docType: String(d.doc_type).trim() },
      });
      if (!existing) {
        await prisma.leadDocument.create({
          data: {
            leadId: targetLead.id,
            docType: String(d.doc_type).trim(),
            status: String(d.status || 'pending').trim(),
            notes: d.notes || null,
            fileUrl: d.file_url || null,
            studentUploadedUrl: d.student_uploaded_url || null,
            studentUploadedAt: d.student_uploaded_at ? parseDateSafe(d.student_uploaded_at) : null,
            requestedByStudent: Boolean(d.requested_by_student),
            receivedOn: d.received_on || null,
            updatedBy: d.updated_by || 'CRM Migration',
          },
        });
        docCount++;
      }
    }
    console.log(`[migrate] Lead documents added: ${docCount}`);

    // 5. Attendance
    const crmAtt = crm.prepare('SELECT * FROM attendance').all();
    let attCount = 0;
    for (const a of crmAtt) {
      const empId = String(a.emp_id || '').trim();
      if (!empId || !a.date) continue;
      const emp = await prisma.employee.findUnique({ where: { empId } });
      if (!emp) continue;
      await prisma.attendance.upsert({
        where: { empId_date: { empId, date: String(a.date).slice(0, 10) } },
        update: {},
        create: {
          employeeId: emp.id,
          empId,
          name: emp.name,
          date: String(a.date).slice(0, 10),
          checkIn: a.check_in || null,
          checkOut: a.check_out || null,
          hoursWorked: Number(a.hours_worked) || 0,
          status: a.status || 'Present',
          source: a.source || 'crm_migration',
          notes: a.notes || null,
        },
      });
      attCount++;
    }
    console.log(`[migrate] Attendance records synced: ${attCount}`);

    // 6. Daily Logs
    const crmLogs = crm.prepare('SELECT * FROM daily_logs').all();
    let logCount = 0;
    for (const dl of crmLogs) {
      const empId = String(dl.emp_id || '').trim();
      const emp = await prisma.employee.findUnique({ where: { empId } });
      if (!emp || !dl.date) continue;
      await prisma.dailyLog.upsert({
        where: { empId_date: { empId, date: String(dl.date).slice(0, 10) } },
        update: {},
        create: {
          employeeId: emp.id,
          empId,
          date: String(dl.date).slice(0, 10),
          accomplishments: dl.accomplishments || null,
          challenges: dl.challenges || null,
          tomorrowPlan: dl.tomorrow_plan || null,
          metricsJson: dl.metrics_json || null,
        },
      });
      logCount++;
    }
    console.log(`[migrate] Daily logs synced: ${logCount}`);

    // 7. KPI Targets & Tasks
    const crmTargets = crm.prepare('SELECT * FROM kpi_targets').all();
    for (const t of crmTargets) {
      const emp = empByNameLower.get(String(t.consultant || '').trim().toLowerCase());
      await prisma.kpiTarget.upsert({
        where: { consultant_month: { consultant: String(t.consultant).trim(), month: String(t.month).trim() } },
        update: {},
        create: {
          employeeId: emp?.id || null,
          consultant: String(t.consultant).trim(),
          month: String(t.month).trim(),
          targetLeads: Number(t.target_leads) || 0,
          targetEnrolled: Number(t.target_enrolled) || 0,
          targetRevenue: Number(t.target_revenue) || 0,
          targetDailyActions: Number(t.target_daily_actions) || 12,
          targetFollowups: Number(t.target_followups) || 0,
          maxSlaHours: Number(t.max_sla_hours) || 24,
        },
      });
    }

    const crmTasks = crm.prepare('SELECT * FROM management_tasks').all();
    for (const tk of crmTasks) {
      const emp = tk.assigned_to ? empByNameLower.get(String(tk.assigned_to).trim().toLowerCase()) : null;
      const mappedLead = tk.lead_id ? crmLeadIdToPrisma.get(Number(tk.lead_id)) : null;
      const exists = await prisma.taskDirective.findFirst({
        where: { title: String(tk.title).trim(), assignedTo: tk.assigned_to || null },
      });
      if (!exists) {
        await prisma.taskDirective.create({
          data: {
            title: String(tk.title).trim(),
            details: tk.details || null,
            assignedTo: tk.assigned_to || null,
            employeeId: emp?.id || null,
            assignedBy: tk.assigned_by || 'CRM Migration',
            dueDate: tk.due_date || null,
            priority: tk.priority || 'normal',
            status: tk.status || 'open',
            category: tk.category || 'operations',
            leadId: mappedLead?.id || null,
            completedAt: tk.completed_at ? parseDateSafe(tk.completed_at) : null,
          },
        });
      }
    }

    // 8. Activity Events (trackable KPI / portal events)
    const ALLOWED_ACT_TYPES = new Set([
      'application_stage_changed', 'attendance_in', 'lead_assigned',
      'lead_created', 'lead_status_changed', 'lead_updated_via_app',
      'note', 'payment_recorded', 'uni_app_status', 'daily_log_submitted',
    ]);
    const existingActCount = await prisma.activityEvent.count();
    let actCount = 0;
    if (existingActCount === 0) {
      const crmActs = crm.prepare('SELECT * FROM activity_log ORDER BY id ASC').all();
      for (const a of crmActs) {
        if (!ALLOWED_ACT_TYPES.has(a.type)) continue;
        const mappedLead = a.lead_id ? crmLeadIdToPrisma.get(Number(a.lead_id)) : null;
        const emp = a.actor_name ? empByNameLower.get(String(a.actor_name).trim().toLowerCase()) : null;
        await prisma.activityEvent.create({
          data: {
            type: a.type,
            actorName: a.actor_name || null,
            employeeId: emp?.id || mappedLead?.assignedEmployeeId || null,
            leadId: mappedLead?.id || null,
            leadName: a.lead_name || mappedLead?.name || null,
            fromValue: a.from_value || null,
            toValue: a.to_value || null,
            details: a.details || null,
            createdAt: parseDateSafe(a.created_at),
          },
        });
        actCount++;
      }
    }
    console.log(`[migrate] Activity events imported: ${actCount}`);
    console.log('[migrate] Complete!');
  } finally {
    crm.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[migrate] Fatal error:', err);
  process.exit(1);
});
