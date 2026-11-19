import { PrismaClient } from '@prisma/client';

const NON_COUNSELING_ROLE_RE = /\b(investor|managing)\b/i;

function pickCounselor(pool, { assignedTeam, country }) {
  const counselingStaff = pool.filter((e) => !NON_COUNSELING_ROLE_RE.test(e.role));
  const candidatePool = counselingStaff.length ? counselingStaff : pool;

  const teamKey = String(assignedTeam || '').trim().toLowerCase();
  const countryKey = String(country || '').trim().toLowerCase();
  const isChina = teamKey === 'china' || countryKey === 'china';

  let filtered = candidatePool.filter((e) => {
    const empTeam = e.team.toLowerCase();
    if (isChina) return empTeam === 'china';
    if (teamKey === 'active_country_owner' || (!isChina && countryKey)) {
      return empTeam === 'europe' || empTeam === 'malaysia' || empTeam === 'global';
    }
    return true;
  });
  if (!filtered.length) filtered = candidatePool;
  return [...filtered].sort((a, b) => a.activeCount - b.activeCount || a.empId.localeCompare(b.empId))[0] || null;
}

async function main() {
  const prisma = new PrismaClient();
  const month = new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 7);

  try {
    // 1. Sync Tahmid's email observed in crm.db users table if currently empty
    const e03 = await prisma.employee.findUnique({ where: { empId: 'E-03' } });
    if (e03 && !e03.email) {
      await prisma.employee.update({
        where: { empId: 'E-03' },
        data: { email: 'tahmidrazi@gmail.com' },
      });
      console.log('[setup] Updated E-03 Tahmid Imam email -> tahmidrazi@gmail.com');
    }

    // 2. Seed monthly KPI targets for current month
    const employees = await prisma.employee.findMany({
      where: { active: true },
      orderBy: { empId: 'asc' },
      include: {
        _count: {
          select: {
            leads: {
              where: { status: { notIn: ['closed', 'not_interested', 'enrolled', 'converted'] } },
            },
          },
        },
      },
    });

    let targetsCreated = 0;
    for (const emp of employees) {
      const exists = await prisma.kpiTarget.findUnique({
        where: { consultant_month: { consultant: emp.name, month } },
      });
      if (exists) continue;
      const team = emp.team.toLowerCase();
      const isMgmt = NON_COUNSELING_ROLE_RE.test(emp.role) || team === 'general';
      const isChina = team === 'china' && !NON_COUNSELING_ROLE_RE.test(emp.role);

      await prisma.kpiTarget.create({
        data: {
          employeeId: emp.id,
          consultant: emp.name,
          month,
          targetLeads: isChina ? 35 : isMgmt ? 15 : 25,
          targetEnrolled: isChina ? 5 : isMgmt ? 2 : 3,
          targetDailyActions: isChina ? 15 : isMgmt ? 8 : 12,
          targetFollowups: isChina ? 10 : isMgmt ? 5 : 8,
          maxSlaHours: isChina ? 12 : isMgmt ? 24 : 18,
        },
      });
      targetsCreated++;
    }
    console.log(`[setup] Monthly KPI targets (${month}) seeded: ${targetsCreated}`);

    // 3. Distribute unassigned active leads across active counselors by specialization
    const pool = employees.map((e) => ({
      id: e.id,
      empId: e.empId,
      name: e.name,
      team: e.team,
      role: e.role,
      activeCount: e._count.leads,
    }));

    const unassigned = await prisma.lead.findMany({
      where: {
        assignedEmployeeId: null,
        assignedTo: null,
        status: { notIn: ['closed', 'not_interested', 'enrolled', 'converted'] },
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, country: true, assignedTeam: true },
    });

    const breakdown = {};
    for (const lead of unassigned) {
      const chosen = pickCounselor(pool, { assignedTeam: lead.assignedTeam, country: lead.country });
      if (!chosen) continue;
      await prisma.lead.update({
        where: { id: lead.id },
        data: { assignedTo: chosen.name, assignedEmployeeId: chosen.id },
      });
      chosen.activeCount++;
      breakdown[chosen.name] = (breakdown[chosen.name] || 0) + 1;
    }

    console.log(`[setup] Distributed active unassigned leads (${unassigned.length}):`, JSON.stringify(breakdown));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[setup] Error:', err);
  process.exit(1);
});
