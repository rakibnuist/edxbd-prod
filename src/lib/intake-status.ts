export type IntakeStatus = 'Open' | 'Closing' | 'Closed' | 'Next Intake' | 'Under Verification';

type IntakeStatusInput = {
  opensAt?: Date | string | null;
  deadline?: Date | string | null;
  nextIntakeAt?: Date | string | null;
  verifiedUntil?: Date | string | null;
};

const asDate = (value?: Date | string | null) => value ? new Date(value) : null;

export function getIntakeStatus(input: IntakeStatusInput, now = new Date()): IntakeStatus {
  const opensAt = asDate(input.opensAt);
  const deadline = asDate(input.deadline);
  const nextIntakeAt = asDate(input.nextIntakeAt);
  const verifiedUntil = asDate(input.verifiedUntil);

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

