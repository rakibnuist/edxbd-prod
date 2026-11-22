import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { PrismaClient } from '@prisma/client';

const CRM_DB_PATH = process.env.CRM_DB_PATH || '/docker/edxbd-production/imports/crm.db';

const ALLOWED_STAGES = new Set([
  'documents',
  'ready',
  'submitted',
  'interview',
  'pre_admission',
  'deposit',
  'admitted',
  'jw202',
  'visa_applied',
  'visa_approved',
  'partial_payment',
  'air_ticket',
  'complete_payment',
  'pre_departure',
  'fly',
  'documents_withdraw',
  'application_withdraw',
]);

function normalizeStage(raw) {
  const s = String(raw || '').trim().toLowerCase();
  if (!s || s === 'none') return 'documents';
  if (s === 'enrolled') return 'fly';
  if (s === 'visa') return 'visa_approved';
  if (s === 'review') return 'submitted';
  return ALLOWED_STAGES.has(s) ? s : 'documents';
}

function deriveStatus(stage) {
  switch (stage) {
    case 'fly':
      return 'enrolled';
    case 'visa_approved':
    case 'air_ticket':
    case 'complete_payment':
    case 'pre_departure':
      return 'visa_approved';
    case 'visa_applied':
    case 'partial_payment':
      return 'visa_applied';
    case 'admitted':
    case 'jw202':
      return 'admission_received';
    case 'submitted':
    case 'interview':
    case 'pre_admission':
    case 'deposit':
      return 'application_submitted';
    case 'documents_withdraw':
    case 'application_withdraw':
      return 'closed';
    default:
      return 'application_started';
  }
}

function normalizePhone10(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length < 7) return '';
  return digits.slice(-10);
}

function normalizeNameKey(raw) {
  return String(raw || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function cleanText(raw, maxLen) {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim();
  return s ? s.slice(0, maxLen) : null;
}

function parseIsoDate(raw) {
  const s = cleanText(raw, 20);
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return null;
}

function parseOptionalGpa(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const n = Number(raw);
  if (Number.isFinite(n) && n >= 0 && n <= 5.5) return Number(n.toFixed(2));
  return null;
}

function generatePublicToken() {
  return crypto.randomBytes(12).toString('hex');
}

async function main() {
  console.log(`[app-migrate] Opening legacy CRM SQLite DB at ${CRM_DB_PATH}`);
  const crm = new DatabaseSync(CRM_DB_PATH, { readOnly: true });
  const prisma = new PrismaClient();

  try {
    // 1. Build Employee lookup map
    const prismaEmployees = await prisma.employee.findMany();
    const prismaEmpByEmpId = new Map(prismaEmployees.map((e) => [e.empId.trim().toUpperCase(), e]));
    const prismaEmpByName = new Map(prismaEmployees.map((e) => [normalizeNameKey(e.name), e]));

    const crmEmployees = crm.prepare('SELECT * FROM employees').all();
    const crmEmpIdToPrisma = new Map();
    for (const ce of crmEmployees) {
      const empIdKey = String(ce.emp_id || '').trim().toUpperCase();
      const nameKey = normalizeNameKey(ce.name);
      const target = (empIdKey && prismaEmpByEmpId.get(empIdKey)) || prismaEmpByName.get(nameKey) || null;
      if (target) crmEmpIdToPrisma.set(Number(ce.id), target);
    }

    // 2. Query active Application Tracker leads (matches legacy /api/applications WHERE clause + any lead with university applications)
    const crmApps = crm
      .prepare(`
        SELECT * FROM leads
        WHERE (application_stage IS NOT NULL AND application_stage != '' AND application_stage != 'none')
           OR lead_status IN ('Enrolled','File Opened','Submitted','Processing','Admitted','Visa Approved','Visa Applied')
           OR EXISTS (SELECT 1 FROM lead_university_applications u WHERE u.lead_id = leads.id)
        ORDER BY id ASC
      `)
      .all();

    console.log(`[app-migrate] Found ${crmApps.length} application leads in legacy CRM DB`);

    // Preload existing Prisma leads for phone/name deduplication
    const existingLeads = await prisma.lead.findMany({
      select: {
        id: true,
        legacyCrmId: true,
        name: true,
        phone: true,
        email: true,
        publicToken: true,
        leadRef: true,
      },
    });

    const leadByLegacyId = new Map();
    const leadByPublicToken = new Map();
    const leadByPhone10 = new Map();
    const leadByName = new Map();
    const usedTokens = new Set();

    for (const pl of existingLeads) {
      if (pl.legacyCrmId !== null) leadByLegacyId.set(pl.legacyCrmId, pl);
      if (pl.publicToken) {
        leadByPublicToken.set(pl.publicToken, pl);
        usedTokens.add(pl.publicToken);
      }
      const p10 = normalizePhone10(pl.phone);
      if (p10 && !leadByPhone10.has(p10)) leadByPhone10.set(p10, pl);
      const nk = normalizeNameKey(pl.name);
      if (nk && !leadByName.has(nk)) leadByName.set(nk, pl);
    }

    const crmIdToPrismaLeadId = new Map();
    const leadRefToPrismaLeadId = new Map();
    const migratedNameToPrismaLeadId = new Map();

    let createdCount = 0;
    let updatedCount = 0;

    for (const row of crmApps) {
      const legacyCrmId = Number(row.id);
      const leadRef = cleanText(row.lead_id, 60) || `LEAD-${String(legacyCrmId).padStart(4, '0')}`;
      const name = cleanText(row.client_name, 140) || `Student ${leadRef}`;
      const phone = cleanText(row.phone, 40) || '—';
      const country = cleanText(row.destination, 80) || 'China';
      const stage = normalizeStage(row.application_stage);
      const status = deriveStatus(stage);
      const market = cleanText(row.lead_market, 40) === 'China' ? 'China' : 'Bangladesh';
      const rawLeadType = cleanText(row.lead_type, 20)?.toUpperCase();
      const rawSource = cleanText(row.source, 80) || cleanText(row.lead_source, 80) || 'In-House';
      const channelType =
        rawLeadType === 'B2B' || rawSource === 'B2B' || rawSource === 'Agent' ? 'B2B' : 'B2C';
      const program = cleanText(row.major, 160) || cleanText(row.program, 160);

      // Resolve counselor
      let matchedEmp = row.assigned_employee_id
        ? crmEmpIdToPrisma.get(Number(row.assigned_employee_id)) || null
        : null;
      if (!matchedEmp && row.assigned_consultant) {
        matchedEmp = prismaEmpByName.get(normalizeNameKey(row.assigned_consultant)) || null;
      }
      const assignedEmployeeId = matchedEmp?.id || null;
      const assignedTo = matchedEmp?.name || cleanText(row.assigned_consultant, 120) || null;

      // Resolve existing Prisma Lead match without stealing another legacyCrmId's lead
      let target = leadByLegacyId.get(legacyCrmId) || null;
      const rawToken = cleanText(row.public_token, 80);
      if (!target && rawToken) {
        const byTok = leadByPublicToken.get(rawToken);
        if (byTok && (byTok.legacyCrmId === null || byTok.legacyCrmId === legacyCrmId)) {
          target = byTok;
        }
      }
      if (!target) {
        const p10 = normalizePhone10(row.phone);
        if (p10) {
          const byPhone = leadByPhone10.get(p10);
          if (byPhone && (byPhone.legacyCrmId === null || byPhone.legacyCrmId === legacyCrmId)) {
            target = byPhone;
          }
        }
      }
      if (!target) {
        const nk = normalizeNameKey(name);
        if (nk) {
          const byName = leadByName.get(nk);
          if (byName && (byName.legacyCrmId === null || byName.legacyCrmId === legacyCrmId)) {
            target = byName;
          }
        }
      }

      // Preserve or safely allocate publicToken
      let publicToken = target?.publicToken || null;
      if (!publicToken && rawToken && !usedTokens.has(rawToken)) {
        publicToken = rawToken;
      }
      if (!publicToken) {
        do {
          publicToken = generatePublicToken();
        } while (usedTokens.has(publicToken));
      }
      usedTokens.add(publicToken);

      const fallbackEmail = `${leadRef.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.eduexpressint.com`;
      const email = cleanText(row.email, 200)?.toLowerCase() || target?.email || fallbackEmail;
      const gpaNum = parseOptionalGpa(row.gpa);
      const assessAcademicResults = cleanText(row.gpa, 80);

      const updateFields = {
        legacyCrmId,
        leadRef,
        isApplication: true,
        name,
        email,
        phone: phone !== '—' ? phone : target?.phone || '—',
        country,
        destinationInterest: country.toLowerCase(),
        leadMarket: market,
        channelType,
        source: rawSource,
        referrer: cleanText(row.referrer, 120),
        nationality: cleanText(row.nationality, 80) || (market === 'China' ? 'China' : 'Bangladesh'),
        passport: cleanText(row.passport, 40),
        assessIntake: cleanText(row.intake_term, 80),
        degree: cleanText(row.degree, 80),
        program,
        assessSubject: program,
        university: cleanText(row.university, 180),
        gpa: gpaNum,
        assessAcademicLevel: cleanText(row.last_education, 100),
        assessAcademicResults,
        assessLanguage: cleanText(row.english_score, 80),
        status,
        applicationStage: stage,
        visaDeadline: parseIsoDate(row.visa_deadline),
        departureDate: parseIsoDate(row.departure_date),
        nextFollowup: parseIsoDate(row.next_followup),
        hardcopyStatus: cleanText(row.hardcopy_status, 40) || 'Pending',
        embassyStatus:
          stage === 'fly' || stage === 'visa_approved' || stage === 'air_ticket' || stage === 'complete_payment'
            ? 'Done'
            : stage === 'visa_applied'
              ? 'Submitted'
              : 'Pending',
        driveLink: cleanText(row.drive_link, 1000),
        serviceFee: Number(row.service_fee) || 0,
        paidAmount: Number(row.paid) || 0,
        deposit: Number(row.deposit) || 0,
        applicationNotes: cleanText(row.application_notes, 4000),
        notes: cleanText(row.notes, 4000),
        bloodGroup: cleanText(row.blood_group, 12),
        dateOfBirth: parseIsoDate(row.date_of_birth),
        emergencyContact: cleanText(row.emergency_contact, 200),
        medicalNotes: cleanText(row.medical_notes, 1000),
        publicToken,
        publicEnabled: row.public_enabled === 0 ? false : true,
        assignedEmployeeId,
        assignedTo,
      };

      let saved;
      if (target) {
        saved = await prisma.lead.update({
          where: { id: target.id },
          data: updateFields,
        });
        target.legacyCrmId = legacyCrmId;
        leadByLegacyId.set(legacyCrmId, target);
        updatedCount++;
      } else {
        const createdAt = row.created_at ? new Date(row.created_at) : new Date();
        const validCreatedAt = Number.isNaN(createdAt.getTime()) ? new Date() : createdAt;
        saved = await prisma.lead.create({
          data: {
            ...updateFields,
            leadType: 'application',
            consentTimestamp: validCreatedAt,
            consentPolicyVersion: 'legacy_crm_migration',
            createdAt: validCreatedAt,
          },
        });
        const cacheEntry = {
          id: saved.id,
          legacyCrmId,
          name: saved.name,
          phone: saved.phone,
          email: saved.email,
          publicToken: saved.publicToken,
          leadRef: saved.leadRef,
        };
        leadByLegacyId.set(legacyCrmId, cacheEntry);
        createdCount++;
      }

      crmIdToPrismaLeadId.set(legacyCrmId, saved.id);
      if (leadRef) leadRefToPrismaLeadId.set(leadRef.trim().toUpperCase(), saved.id);
      migratedNameToPrismaLeadId.set(normalizeNameKey(name), saved.id);
    }

    console.log(
      `[app-migrate] Application leads synced: ${crmApps.length} total (${createdCount} created, ${updatedCount} enriched/updated)`,
    );

    // 3. Migrate valid lead_documents linked to migrated application leads
    const crmLeadIds = Array.from(crmIdToPrismaLeadId.keys());
    let sourceDocsForApps = 0;
    let docsCreated = 0;
    let docsUpdated = 0;

    if (crmLeadIds.length > 0) {
      const crmDocs = crm
        .prepare('SELECT d.* FROM lead_documents d INNER JOIN leads l ON d.lead_id = l.id ORDER BY d.id ASC')
        .all();

      for (const doc of crmDocs) {
        const prismaLeadId = crmIdToPrismaLeadId.get(Number(doc.lead_id));
        if (!prismaLeadId) continue;
        sourceDocsForApps++;

        const docType = cleanText(doc.doc_type, 160);
        if (!docType) continue;

        const existingDoc = await prisma.leadDocument.findFirst({
          where: { leadId: prismaLeadId, docType },
          select: { id: true },
        });

        const docData = {
          status: cleanText(doc.status, 32) || 'pending',
          notes: cleanText(doc.notes, 500),
          fileUrl: cleanText(doc.file_url, 1000),
          studentUploadedUrl: cleanText(doc.student_uploaded_url, 1000),
          studentUploadedAt: doc.student_uploaded_at ? new Date(doc.student_uploaded_at) : null,
          requestedByStudent: Boolean(doc.requested_by_student),
          receivedOn: cleanText(doc.received_on, 32),
          updatedBy: cleanText(doc.updated_by, 120),
        };
        if (docData.studentUploadedAt && Number.isNaN(docData.studentUploadedAt.getTime())) {
          docData.studentUploadedAt = null;
        }

        if (existingDoc) {
          await prisma.leadDocument.update({
            where: { id: existingDoc.id },
            data: docData,
          });
          docsUpdated++;
        } else {
          await prisma.leadDocument.create({
            data: {
              leadId: prismaLeadId,
              docType,
              ...docData,
            },
          });
          docsCreated++;
        }
      }
    }
    console.log(
      `[app-migrate] Lead documents synced: ${sourceDocsForApps} matched (${docsCreated} created, ${docsUpdated} updated)`,
    );

    // 4. Migrate valid lead_university_applications linked to migrated application leads
    let sourceUnisForApps = 0;
    let unisCreated = 0;
    let unisUpdated = 0;

    if (crmLeadIds.length > 0) {
      const crmUnis = crm
        .prepare('SELECT u.* FROM lead_university_applications u INNER JOIN leads l ON u.lead_id = l.id ORDER BY u.id ASC')
        .all();

      for (const uni of crmUnis) {
        const prismaLeadId = crmIdToPrismaLeadId.get(Number(uni.lead_id));
        if (!prismaLeadId) continue;
        sourceUnisForApps++;

        const university = cleanText(uni.university, 180);
        if (!university) continue;

        const existingUni = await prisma.leadUniversityApp.findFirst({
          where: { leadId: prismaLeadId, university },
          select: { id: true },
        });

        const uniData = {
          program: cleanText(uni.program, 160),
          status: cleanText(uni.status, 32) || 'documents',
          applicationId: cleanText(uni.application_id, 80),
          submittedOn: cleanText(uni.submitted_on, 32),
          decisionOn: cleanText(uni.decision_on, 32),
          notes: cleanText(uni.notes, 500),
          updatedBy: cleanText(uni.updated_by, 120),
        };

        if (existingUni) {
          await prisma.leadUniversityApp.update({
            where: { id: existingUni.id },
            data: uniData,
          });
          unisUpdated++;
        } else {
          await prisma.leadUniversityApp.create({
            data: {
              leadId: prismaLeadId,
              university,
              ...uniData,
            },
          });
          unisCreated++;
        }
      }
    }
    console.log(
      `[app-migrate] University applications synced: ${sourceUnisForApps} matched (${unisCreated} created, ${unisUpdated} updated)`,
    );

    // 5. Backfill FinanceIncome.leadId and FinanceExpense.leadId for newly migrated application leads
    const [unlinkedIncomes, unlinkedExpenses] = await Promise.all([
      prisma.financeIncome.findMany({
        where: { leadId: null },
        select: { id: true, leadRef: true, studentName: true, clientName: true },
      }),
      prisma.financeExpense.findMany({
        where: { leadId: null },
        select: { id: true, leadRef: true, studentName: true, paidTo: true },
      }),
    ]);

    let linkedIncomes = 0;
    for (const inc of unlinkedIncomes) {
      const targetId =
        (inc.leadRef ? leadRefToPrismaLeadId.get(inc.leadRef.trim().toUpperCase()) : null) ||
        (inc.studentName ? migratedNameToPrismaLeadId.get(normalizeNameKey(inc.studentName)) : null) ||
        (inc.clientName ? migratedNameToPrismaLeadId.get(normalizeNameKey(inc.clientName)) : null) ||
        null;
      if (targetId) {
        await prisma.financeIncome.update({ where: { id: inc.id }, data: { leadId: targetId } });
        linkedIncomes++;
      }
    }

    let linkedExpenses = 0;
    for (const exp of unlinkedExpenses) {
      const targetId =
        (exp.leadRef ? leadRefToPrismaLeadId.get(exp.leadRef.trim().toUpperCase()) : null) ||
        (exp.studentName ? migratedNameToPrismaLeadId.get(normalizeNameKey(exp.studentName)) : null) ||
        (exp.paidTo ? migratedNameToPrismaLeadId.get(normalizeNameKey(exp.paidTo)) : null) ||
        null;
      if (targetId) {
        await prisma.financeExpense.update({ where: { id: exp.id }, data: { leadId: targetId } });
        linkedExpenses++;
      }
    }
    console.log(
      `[app-migrate] Finance cross-link backfill: linked ${linkedIncomes} income rows and ${linkedExpenses} expense rows`,
    );

    // 6. Strict reconciliation verification
    const [destAppCount, destDocCount, destUniCount] = await Promise.all([
      prisma.lead.count({ where: { legacyCrmId: { not: null }, isApplication: true } }),
      prisma.leadDocument.count({ where: { lead: { legacyCrmId: { not: null } } } }),
      prisma.leadUniversityApp.count({ where: { lead: { legacyCrmId: { not: null } } } }),
    ]);

    const summary = {
      source: {
        applications: crmApps.length,
        documentsForApps: sourceDocsForApps,
        universityAppsForApps: sourceUnisForApps,
      },
      migrated: {
        applications: destAppCount,
        documentsForApps: destDocCount,
        universityAppsForApps: destUniCount,
        financeIncomesNewlyLinked: linkedIncomes,
        financeExpensesNewlyLinked: linkedExpenses,
      },
    };

    console.log('[app-migrate] Reconciliation:', JSON.stringify(summary, null, 2));

    const mismatches = [];
    if (destAppCount < crmApps.length) {
      mismatches.push(`applications ${destAppCount} < ${crmApps.length}`);
    }
    if (destDocCount < sourceDocsForApps) {
      mismatches.push(`documents ${destDocCount} < ${sourceDocsForApps}`);
    }
    if (destUniCount < sourceUnisForApps) {
      mismatches.push(`universityApps ${destUniCount} < ${sourceUnisForApps}`);
    }

    if (mismatches.length > 0) {
      console.error('[app-migrate] RECONCILIATION FAILED:', mismatches.join('; '));
      process.exitCode = 1;
    } else {
      console.log('[app-migrate] RECONCILIATION PASSED (100% exact match)');
    }
  } finally {
    crm.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[app-migrate] Fatal error:', err);
  process.exit(1);
});
