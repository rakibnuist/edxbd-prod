import { DatabaseSync } from 'node:sqlite';
import { PrismaClient } from '@prisma/client';

const CRM_DB_PATH = process.env.CRM_DB_PATH || '/docker/edxbd-production/imports/crm.db';

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

async function main() {
  console.log(`[finance-migrate] Opening legacy CRM SQLite DB at ${CRM_DB_PATH}`);
  const crm = new DatabaseSync(CRM_DB_PATH, { readOnly: true });
  const prisma = new PrismaClient();

  try {
    // 1. Sync Employee base salaries & build legacy CRM employee ID -> Prisma Employee map
    const prismaEmployees = await prisma.employee.findMany();
    const prismaEmpByEmpId = new Map(prismaEmployees.map((e) => [e.empId.trim().toUpperCase(), e]));
    const prismaEmpByName = new Map(prismaEmployees.map((e) => [normalizeNameKey(e.name), e]));

    const crmEmployees = crm.prepare('SELECT * FROM employees').all();
    const crmEmpIdToPrisma = new Map();
    let updatedSalaries = 0;

    for (const ce of crmEmployees) {
      const empIdKey = String(ce.emp_id || '').trim().toUpperCase();
      const nameKey = normalizeNameKey(ce.name);
      const target = (empIdKey && prismaEmpByEmpId.get(empIdKey)) || prismaEmpByName.get(nameKey) || null;
      if (!target) continue;

      crmEmpIdToPrisma.set(Number(ce.id), target);
      const crmSalary = Number(ce.salary) || 0;
      if (crmSalary > 0 && target.salary !== crmSalary) {
        await prisma.employee.update({
          where: { id: target.id },
          data: { salary: crmSalary },
        });
        updatedSalaries++;
      }
    }
    console.log(`[finance-migrate] Mapped ${crmEmpIdToPrisma.size}/${crmEmployees.length} employees (updated ${updatedSalaries} base salaries)`);

    // 2. Build Lead lookup maps (legacy lead_id -> Prisma Lead ID, name/phone fallback)
    const prismaLeads = await prisma.lead.findMany({
      select: { id: true, name: true, phone: true },
    });
    const prismaLeadByPhone10 = new Map();
    const prismaLeadByName = new Map();
    for (const pl of prismaLeads) {
      const p10 = normalizePhone10(pl.phone);
      if (p10 && !prismaLeadByPhone10.has(p10)) prismaLeadByPhone10.set(p10, pl.id);
      const nk = normalizeNameKey(pl.name);
      if (nk && !prismaLeadByName.has(nk)) prismaLeadByName.set(nk, pl.id);
    }

    const crmLeads = crm.prepare('SELECT id, lead_id, client_name, phone FROM leads').all();
    const leadRefToPrismaId = new Map();
    for (const cl of crmLeads) {
      const p10 = normalizePhone10(cl.phone);
      const nk = normalizeNameKey(cl.client_name);
      const matchedId = (p10 && prismaLeadByPhone10.get(p10)) || (nk && prismaLeadByName.get(nk)) || null;
      if (matchedId && cl.lead_id) {
        leadRefToPrismaId.set(String(cl.lead_id).trim().toUpperCase(), matchedId);
      }
    }

    function resolveLeadId(leadRef, studentName, clientName) {
      if (leadRef) {
        const byRef = leadRefToPrismaId.get(String(leadRef).trim().toUpperCase());
        if (byRef) return byRef;
      }
      for (const candidate of [studentName, clientName]) {
        const nk = normalizeNameKey(candidate);
        if (nk && prismaLeadByName.has(nk)) return prismaLeadByName.get(nk);
      }
      return null;
    }

    // 3. Migrate Income rows (idempotent by legacyCrmId)
    const crmIncomes = crm.prepare('SELECT * FROM income ORDER BY id ASC').all();
    let incomeUpserted = 0;
    let sourceIncomeAll = 0;
    let sourceIncomeCash = 0;

    for (const row of crmIncomes) {
      const legacyCrmId = Number(row.id);
      const amount = Number(row.amount) || 0;
      const excludeFromCash = Boolean(row.exclude_from_cash);
      sourceIncomeAll += amount;
      if (!excludeFromCash) sourceIncomeCash += amount;

      const date = cleanText(row.date, 10) || '2026-01-01';
      const month = cleanText(row.month, 7) || date.slice(0, 7);
      const leadRef = cleanText(row.lead_id, 60);
      const studentName = cleanText(row.student_name, 160);
      const clientName = cleanText(row.client_name, 160);
      const employeeId = row.employee_id ? crmEmpIdToPrisma.get(Number(row.employee_id))?.id || null : null;
      const leadId = resolveLeadId(leadRef, studentName, clientName);

      const data = {
        date,
        month,
        category: cleanText(row.category, 80),
        leadRef,
        leadId,
        clientName,
        studentName,
        reference: cleanText(row.reference, 160),
        amount,
        notes: cleanText(row.notes, 2000),
        excludeFromCash,
        employeeId,
      };

      await prisma.financeIncome.upsert({
        where: { legacyCrmId },
        update: data,
        create: { legacyCrmId, ...data },
      });
      incomeUpserted++;
    }
    console.log(`[finance-migrate] Upserted ${incomeUpserted} income rows (source all=${sourceIncomeAll}, cash=${sourceIncomeCash})`);

    // 4. Migrate Expense rows (idempotent by legacyCrmId)
    const crmExpenses = crm.prepare('SELECT * FROM expenses ORDER BY id ASC').all();
    let expenseUpserted = 0;
    let sourceExpenseTotal = 0;

    for (const row of crmExpenses) {
      const legacyCrmId = Number(row.id);
      const amount = Number(row.amount) || 0;
      sourceExpenseTotal += amount;

      const date = cleanText(row.date, 10) || '2026-01-01';
      const month = cleanText(row.month, 7) || date.slice(0, 7);
      const leadRef = cleanText(row.lead_id, 60);
      const studentName = cleanText(row.student_name, 160);
      const paidTo = cleanText(row.paid_to, 160);
      const employeeId = row.employee_id ? crmEmpIdToPrisma.get(Number(row.employee_id))?.id || null : null;
      const leadId = resolveLeadId(leadRef, studentName, paidTo);

      const data = {
        date,
        month,
        category: cleanText(row.category, 80),
        paidTo,
        leadRef,
        leadId,
        studentName,
        reference: cleanText(row.reference, 160),
        amount,
        notes: cleanText(row.notes, 2000),
        employeeId,
      };

      await prisma.financeExpense.upsert({
        where: { legacyCrmId },
        update: data,
        create: { legacyCrmId, ...data },
      });
      expenseUpserted++;
    }
    console.log(`[finance-migrate] Upserted ${expenseUpserted} expense rows (source total=${sourceExpenseTotal})`);

    // 5. Migrate Payroll rows (idempotent by composite unique month_empId_name)
    const crmPayrolls = crm.prepare('SELECT * FROM payroll ORDER BY id ASC').all();
    let payrollUpserted = 0;
    let sourcePayrollNet = 0;

    for (const row of crmPayrolls) {
      const legacyCrmId = Number(row.id);
      const month = cleanText(row.month, 7);
      const empId = cleanText(row.emp_id, 40) || 'UNKNOWN';
      const name = cleanText(row.name, 160) || 'Unknown';
      if (!month) continue;

      const matchedEmp = prismaEmpByEmpId.get(empId.toUpperCase()) || prismaEmpByName.get(normalizeNameKey(name)) || null;
      const netPay = Number(row.net_pay) || 0;
      sourcePayrollNet += netPay;

      const data = {
        employeeId: matchedEmp?.id || null,
        baseSalary: Number(row.base_salary) || 0,
        daysWorked: Number(row.days_worked) || 0,
        workingDays: Number(row.working_days) || 0,
        bonus: Number(row.bonus) || 0,
        deductions: Number(row.deductions) || 0,
        netPay,
        paidOn: cleanText(row.paid_on, 10),
        status: cleanText(row.status, 24) || 'pending',
        notes: cleanText(row.notes, 1000),
      };

      await prisma.payrollRecord.upsert({
        where: { month_empId_name: { month, empId, name } },
        update: { ...data, legacyCrmId },
        create: { legacyCrmId, month, empId, name, ...data },
      });
      payrollUpserted++;
    }
    console.log(`[finance-migrate] Upserted ${payrollUpserted} payroll rows (source netPay sum=${sourcePayrollNet})`);

    // 6. Migrate cash_initial if set in meta_config
    const cashInitialRow = crm.prepare("SELECT value FROM meta_config WHERE key = 'cash_initial'").get();
    if (cashInitialRow && cashInitialRow.value !== null && cashInitialRow.value !== undefined) {
      const parsed = Number(cashInitialRow.value);
      if (Number.isFinite(parsed)) {
        await prisma.setting.upsert({
          where: { key: 'financeCashInitial' },
          update: { value: String(parsed) },
          create: { key: 'financeCashInitial', value: String(parsed) },
        });
        console.log(`[finance-migrate] Synced financeCashInitial = ${parsed}`);
      }
    }

    // 7. Strict reconciliation verification
    const [destInAll, destInCash, destExpAll, destPayAll] = await Promise.all([
      prisma.financeIncome.aggregate({ where: { legacyCrmId: { not: null } }, _count: { id: true }, _sum: { amount: true } }),
      prisma.financeIncome.aggregate({ where: { legacyCrmId: { not: null }, excludeFromCash: false }, _count: { id: true }, _sum: { amount: true } }),
      prisma.financeExpense.aggregate({ where: { legacyCrmId: { not: null } }, _count: { id: true }, _sum: { amount: true } }),
      prisma.payrollRecord.aggregate({ where: { legacyCrmId: { not: null } }, _count: { id: true }, _sum: { netPay: true } }),
    ]);

    const summary = {
      source: {
        incomeRows: crmIncomes.length,
        incomeAll: sourceIncomeAll,
        incomeCash: sourceIncomeCash,
        expenseRows: crmExpenses.length,
        expenseTotal: sourceExpenseTotal,
        cashBalance: sourceIncomeCash - sourceExpenseTotal,
        payrollRows: crmPayrolls.length,
        payrollNet: sourcePayrollNet,
      },
      migrated: {
        incomeRows: destInAll._count.id,
        incomeAll: destInAll._sum.amount || 0,
        incomeCash: destInCash._sum.amount || 0,
        expenseRows: destExpAll._count.id,
        expenseTotal: destExpAll._sum.amount || 0,
        cashBalance: (destInCash._sum.amount || 0) - (destExpAll._sum.amount || 0),
        payrollRows: destPayAll._count.id,
        payrollNet: destPayAll._sum.netPay || 0,
      },
    };
    console.log('[finance-migrate] Reconciliation:', JSON.stringify(summary, null, 2));

    const diffIn = Math.abs(summary.source.incomeAll - summary.migrated.incomeAll);
    const diffCash = Math.abs(summary.source.incomeCash - summary.migrated.incomeCash);
    const diffExp = Math.abs(summary.source.expenseTotal - summary.migrated.expenseTotal);
    const diffPay = Math.abs(summary.source.payrollNet - summary.migrated.payrollNet);

    if (
      summary.source.incomeRows !== summary.migrated.incomeRows ||
      summary.source.expenseRows !== summary.migrated.expenseRows ||
      summary.source.payrollRows !== summary.migrated.payrollRows ||
      diffIn > 0.01 ||
      diffCash > 0.01 ||
      diffExp > 0.01 ||
      diffPay > 0.01
    ) {
      throw new Error('Reconciliation mismatch detected between legacy CRM DB and migrated Prisma records!');
    }

    console.log('[finance-migrate] SUCCESS — 100% reconciled with zero discrepancy.');
  } finally {
    crm.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[finance-migrate] Fatal error:', err);
  process.exit(1);
});
