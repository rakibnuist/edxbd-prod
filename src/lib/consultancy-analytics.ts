import type { Prisma, PrismaClient } from '@prisma/client';

export type ConsultancyStageFunnel = {
  newLeads: number;
  counselingQualified: number;
  universityApplied: number;
  offerAdmitted: number;
  visaStage: number;
  enrolledConverted: number;
  noResponse: number;
  closedLost: number;
  activeTotal: number;
  totalLeads: number;
  offerRatePercent: number;
  enrollmentRatePercent: number;
};

export type CountryDemandBucket = {
  country: string;
  total: number;
  active: number;
  progressed: number;
};

export type UrgentStudentDeadline = {
  id: string;
  name: string;
  country: string;
  university: string | null;
  assignedTo: string | null;
  deadlineType: 'visa' | 'departure';
  deadlineDate: string;
  daysUntil: number;
  status: string;
};

export type ConsultancyOpsSummary = {
  activeUniApps: number;
  offersReceivedCount: number;
  docsPendingReviewCount: number;
  medicalTrackCount: number;
  riskEscalatedCount: number;
};

export type ConsultancyExecutiveSnapshot = {
  stageFunnel: ConsultancyStageFunnel;
  countryDemand: CountryDemandBucket[];
  urgentDeadlines: UrgentStudentDeadline[];
  consultancyOps: ConsultancyOpsSummary;
};

export const TERMINAL_LEAD_STATUSES = ['closed', 'not_interested', 'enrolled', 'converted'] as const;
const TERMINAL_SET = new Set<string>(TERMINAL_LEAD_STATUSES);

export function computePipelineSummary(
  statusCounts: Array<{ status: string; count: number }>,
): ConsultancyStageFunnel {
  let newLeads = 0;
  let counselingQualified = 0;
  let universityApplied = 0;
  let offerAdmitted = 0;
  let visaStage = 0;
  let enrolledConverted = 0;
  let noResponse = 0;
  let closedLost = 0;

  for (const row of statusCounts) {
    const count = row.count || 0;
    switch (row.status) {
      case 'new':
        newLeads += count;
        break;
      case 'contacted':
      case 'consultation_scheduled':
      case 'consultation_completed':
      case 'qualified':
        counselingQualified += count;
        break;
      case 'application_started':
      case 'application_submitted':
        universityApplied += count;
        break;
      case 'admission_received':
        offerAdmitted += count;
        break;
      case 'visa_applied':
      case 'visa_approved':
        visaStage += count;
        break;
      case 'enrolled':
      case 'converted':
        enrolledConverted += count;
        break;
      case 'no_response':
        noResponse += count;
        break;
      case 'not_interested':
      case 'closed':
        closedLost += count;
        break;
      default:
        counselingQualified += count;
        break;
    }
  }

  const activeTotal =
    newLeads +
    noResponse +
    counselingQualified +
    universityApplied +
    offerAdmitted +
    visaStage;
  const totalLeads = activeTotal + enrolledConverted + closedLost;

  const progressedToOffer = offerAdmitted + visaStage + enrolledConverted;
  const appliedOrBeyond = universityApplied + progressedToOffer;
  const qualifiedOrBeyond = counselingQualified + appliedOrBeyond;

  const offerRatePercent = appliedOrBeyond > 0
    ? Math.round((progressedToOffer / appliedOrBeyond) * 100)
    : 0;
  const enrollmentRatePercent = qualifiedOrBeyond > 0
    ? Math.round((enrolledConverted / qualifiedOrBeyond) * 100)
    : 0;

  return {
    newLeads,
    counselingQualified,
    universityApplied,
    offerAdmitted,
    visaStage,
    enrolledConverted,
    noResponse,
    closedLost,
    activeTotal,
    totalLeads,
    offerRatePercent,
    enrollmentRatePercent,
  };
}

export function normalizeDestinationLabel(
  country?: string | null,
  destinationInterest?: string | null,
): string {
  const raw = (destinationInterest || country || '').trim();
  if (!raw || raw.toLowerCase() === 'undecided' || raw.toLowerCase() === 'unspecified') {
    return 'Unspecified';
  }
  const lower = raw.toLowerCase();
  if (lower.includes('china') || lower === 'prc') return 'China';
  if (lower === 'uk' || lower.includes('united kingdom') || lower.includes('britain')) return 'UK';
  if (lower.includes('korea')) return 'South Korea';
  if (lower.includes('hungary')) return 'Hungary';
  if (lower.includes('finland')) return 'Finland';
  if (lower.includes('malaysia')) return 'Malaysia';
  if (lower.includes('malta')) return 'Malta';
  if (lower.includes('cyprus')) return 'Cyprus';
  if (lower.includes('georgia')) return 'Georgia';
  if (lower.includes('greece')) return 'Greece';
  if (lower.includes('croatia')) return 'Croatia';
  if (lower.includes('thailand')) return 'Thailand';
  return raw.replace(/\s+/g, ' ').slice(0, 32);
}

export function aggregateCountryDemand(
  rows: Array<{ country: string; destinationInterest?: string | null; status: string }>,
  maxBuckets = 6,
): CountryDemandBucket[] {
  const byCountry = new Map<string, CountryDemandBucket>();
  const progressedStatuses = new Set([
    'application_started',
    'application_submitted',
    'admission_received',
    'visa_applied',
    'visa_approved',
    'enrolled',
    'converted',
  ]);

  for (const row of rows) {
    const label = normalizeDestinationLabel(row.country, row.destinationInterest);
    const existing = byCountry.get(label) || { country: label, total: 0, active: 0, progressed: 0 };
    existing.total += 1;
    if (!TERMINAL_SET.has(row.status)) {
      existing.active += 1;
    }
    if (progressedStatuses.has(row.status)) {
      existing.progressed += 1;
    }
    byCountry.set(label, existing);
  }

  const sorted = Array.from(byCountry.values()).sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return b.active - a.active;
  });

  if (sorted.length <= maxBuckets) return sorted;

  const top = sorted.slice(0, maxBuckets - 1);
  const tail = sorted.slice(maxBuckets - 1);
  const other = tail.reduce<CountryDemandBucket>(
    (acc, item) => ({
      country: 'Other Destinations',
      total: acc.total + item.total,
      active: acc.active + item.active,
      progressed: acc.progressed + item.progressed,
    }),
    { country: 'Other Destinations', total: 0, active: 0, progressed: 0 },
  );
  return [...top, other];
}

function daysDiffYmd(targetYmd: string, todayYmd: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(targetYmd) || !/^\d{4}-\d{2}-\d{2}$/.test(todayYmd)) {
    return null;
  }
  const targetMs = Date.parse(`${targetYmd}T00:00:00Z`);
  const todayMs = Date.parse(`${todayYmd}T00:00:00Z`);
  if (!Number.isFinite(targetMs) || !Number.isFinite(todayMs)) return null;
  return Math.round((targetMs - todayMs) / 86_400_000);
}

export function buildUrgentDeadlines(
  rows: Array<{
    id: string;
    name: string;
    country: string;
    university: string | null;
    assignedTo: string | null;
    visaDeadline: string | null;
    departureDate: string | null;
    status: string;
  }>,
  todayDhaka: string,
  limit = 8,
): UrgentStudentDeadline[] {
  const candidates: UrgentStudentDeadline[] = [];

  for (const row of rows) {
    if (TERMINAL_SET.has(row.status)) continue;

    const visaDays = row.visaDeadline ? daysDiffYmd(row.visaDeadline, todayDhaka) : null;
    const departureDays = row.departureDate ? daysDiffYmd(row.departureDate, todayDhaka) : null;

    let chosenType: 'visa' | 'departure' | null = null;
    let chosenDate: string | null = null;
    let chosenDays: number | null = null;

    if (visaDays !== null && departureDays !== null) {
      if (visaDays <= departureDays) {
        chosenType = 'visa';
        chosenDate = row.visaDeadline;
        chosenDays = visaDays;
      } else {
        chosenType = 'departure';
        chosenDate = row.departureDate;
        chosenDays = departureDays;
      }
    } else if (visaDays !== null && row.visaDeadline) {
      chosenType = 'visa';
      chosenDate = row.visaDeadline;
      chosenDays = visaDays;
    } else if (departureDays !== null && row.departureDate) {
      chosenType = 'departure';
      chosenDate = row.departureDate;
      chosenDays = departureDays;
    }

    if (chosenType && chosenDate && chosenDays !== null && chosenDays <= 120) {
      candidates.push({
        id: row.id,
        name: row.name,
        country: normalizeDestinationLabel(row.country),
        university: row.university,
        assignedTo: row.assignedTo,
        deadlineType: chosenType,
        deadlineDate: chosenDate,
        daysUntil: chosenDays,
        status: row.status,
      });
    }
  }

  return candidates
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, limit);
}

export async function buildConsultancyExecutiveSnapshot(
  prisma: PrismaClient,
  scopeWhere: Prisma.LeadWhereInput,
  todayDhaka: string,
): Promise<ConsultancyExecutiveSnapshot> {
  const activeFilter: Prisma.LeadWhereInput = {
    AND: [scopeWhere, { status: { notIn: ['closed', 'not_interested'] } }],
  };

  const [
    groupedStatuses,
    countryRows,
    deadlineRows,
    activeUniApps,
    offersReceivedCount,
    docsPendingReviewCount,
    medicalTrackCount,
    riskEscalatedCount,
  ] = await Promise.all([
    prisma.lead.groupBy({
      by: ['status'],
      where: scopeWhere,
      _count: { _all: true },
    }),
    prisma.lead.findMany({
      where: scopeWhere,
      select: { country: true, destinationInterest: true, status: true },
    }),
    prisma.lead.findMany({
      where: {
        AND: [
          scopeWhere,
          { status: { notIn: [...TERMINAL_LEAD_STATUSES] } },
          { OR: [{ visaDeadline: { not: null } }, { departureDate: { not: null } }] },
        ],
      },
      select: {
        id: true,
        name: true,
        country: true,
        university: true,
        assignedTo: true,
        visaDeadline: true,
        departureDate: true,
        status: true,
      },
    }),
    prisma.leadUniversityApp.count({
      where: {
        lead: scopeWhere,
        status: { in: ['documents', 'ready', 'submitted', 'returned'] },
      },
    }),
    prisma.leadUniversityApp.count({
      where: {
        lead: scopeWhere,
        status: 'admitted',
      },
    }),
    prisma.leadDocument.count({
      where: {
        lead: scopeWhere,
        status: 'received',
      },
    }),
    prisma.lead.count({
      where: {
        AND: [activeFilter, { medicalProgram: true }],
      },
    }),
    prisma.lead.count({
      where: {
        AND: [activeFilter, { riskFlag: true }],
      },
    }),
  ]);

  const stageFunnel = computePipelineSummary(
    groupedStatuses.map((item) => ({ status: item.status, count: item._count._all })),
  );
  const countryDemand = aggregateCountryDemand(countryRows);
  const urgentDeadlines = buildUrgentDeadlines(deadlineRows, todayDhaka, 8);

  return {
    stageFunnel,
    countryDemand,
    urgentDeadlines,
    consultancyOps: {
      activeUniApps,
      offersReceivedCount,
      docsPendingReviewCount,
      medicalTrackCount,
      riskEscalatedCount,
    },
  };
}
