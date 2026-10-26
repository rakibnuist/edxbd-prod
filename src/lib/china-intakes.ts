import { getIntakeStatus } from '@/lib/intake-status';
import type { IntakeStatus } from '@/lib/intake-status';

// China 2027 intake calendar — single source of truth for the intake windows.
// Consumed by the /china-intakes-deadlines pillar page and by the trust
// guidance shown on stale posts, so the two can never drift apart.
// getIntakeStatus() derives Open/Closing/Next Intake automatically; if
// verification expires before a counselor re-checks the window, consumers
// flip to "Under Verification" instead of showing a stale promise.

export const CHINA_INTAKE_VERIFIED_ON = '26 October 2026';
export const CHINA_INTAKE_NEXT_REVIEW = 'January 2027 (before the March deadline window)';

export function intakeStatus(detail: { opensAt: string; deadline: string; verifiedUntil: string }): IntakeStatus {
  return getIntakeStatus({ opensAt: detail.opensAt, deadline: detail.deadline, verifiedUntil: detail.verifiedUntil });
}

export interface ChinaIntakeRow {
  name: string;
  applicationsOpen: string;
  cscDeadline: string;
  universityDeadline: string;
  classesStart: string;
  programs: string;
  badge: string;
  status: IntakeStatus;
  activeCampaignHref: string | null;
}

export const chinaIntakes: ChinaIntakeRow[] = [
  {
    name: 'September 2027 Intake (Autumn) — Main Intake',
    applicationsOpen: 'October / November (Previous Year)',
    cscDeadline: 'December – March',
    universityDeadline: 'April – June',
    classesStart: 'September',
    programs: 'All Bachelor’s, Master’s, PhD, and MBBS degree programs.',
    badge: 'Largest Selection & Full CSC Allocation',
    status: intakeStatus({ opensAt: '2026-10-31', deadline: '2027-06-30', verifiedUntil: '2027-02-28' }),
    activeCampaignHref: null,
  },
  {
    name: 'March 2027 Intake (Spring) — Secondary Intake',
    applicationsOpen: 'July / August (Previous Year)',
    cscDeadline: 'Limited CSC Quotas',
    universityDeadline: 'December – January',
    classesStart: 'March',
    programs: 'Select Bachelor’s, Master’s, and Chinese Language preparatory courses.',
    badge: 'Faster Entry (No 1-Year Gap)',
    status: intakeStatus({ opensAt: '2026-08-01', deadline: '2027-01-31', verifiedUntil: '2027-01-31' }),
    activeCampaignHref: '/china-march-2027-intake',
  },
];

// Compact rows for the stale-post guidance box (server-computed; the pillar
// page renders the full detail, this surface only needs name/status/window).
export const chinaIntakeOverview = () =>
  chinaIntakes.map(row => ({
    name: row.name,
    status: row.status,
    summary: row.status === 'Open' || row.status === 'Closing'
      ? 'Applications are open now — university deadline 31 January 2027'
      : row.name.startsWith('September')
        ? 'Applications open 31 October 2026 · university deadline 30 June 2027'
        : 'Applications open August 2026 · university deadline 31 January 2027',
  }));
