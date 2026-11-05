export type IntakeStatus = 'Open' | 'Closing' | 'Closed' | 'Next Intake' | 'Under Verification';

type IntakeStatusInput = {
  opensAt?: Date | string | null;
  deadline?: Date | string | null;
  nextIntakeAt?: Date | string | null;
  verifiedUntil?: Date | string | null;
};

// Admission dates are published as calendar days in Bangladesh time (UTC+6, no
// DST). new Date('2027-01-31') is UTC midnight, i.e. 06:00 in Dhaka, which
// closed a window six hours into its final day. Date-only strings are pinned
// to the start (opens) or end (deadline, verified-until) of that Dhaka day.
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const asDate = (value?: Date | string | null, edge: 'start' | 'end' = 'start') => {
  if (!value) return null;
  if (typeof value === 'string' && DATE_ONLY.test(value)) {
    return new Date(`${value}T${edge === 'start' ? '00:00:00.000' : '23:59:59.999'}+06:00`);
  }
  return new Date(value);
};

export function getIntakeStatus(input: IntakeStatusInput, now = new Date()): IntakeStatus {
  const opensAt = asDate(input.opensAt);
  const deadline = asDate(input.deadline, 'end');
  const nextIntakeAt = asDate(input.nextIntakeAt);
  const verifiedUntil = asDate(input.verifiedUntil, 'end');

  if (!deadline || !verifiedUntil || Number.isNaN(deadline.getTime()) || Number.isNaN(verifiedUntil.getTime()) || verifiedUntil < now) {
    return 'Under Verification';
  }
  if (deadline < now) return nextIntakeAt && nextIntakeAt > now ? 'Next Intake' : 'Closed';
  if (opensAt && opensAt > now) return 'Next Intake';
  const closingWindow = new Date(deadline);
  closingWindow.setDate(closingWindow.getDate() - 14);
  return now >= closingWindow ? 'Closing' : 'Open';
}

export const canApplyToIntake = (status: IntakeStatus) => status === 'Open' || status === 'Closing';

