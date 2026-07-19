/**
 * Lead-routing rules — Evidence-First Plan, Section 15.
 *
 * Pure, server-safe logic that decides which team a new lead is assigned to,
 * whether it needs senior review, and whether a medical/licensing review is
 * required. Applied on lead creation so no lead reaches untrained general sales
 * staff when the plan requires a specialist.
 */

export type LeadTeam =
  | 'general'
  | 'china'
  | 'wave1_owner'
  | 'launching_interest'
  | 'senior_review';

// Destination status drives routing (mirrors the strategy launch waves).
const FLAGSHIP = ['china'];
const WAVE1 = ['uk', 'united-kingdom', 'hungary', 'south-korea', 'korea', 'finland', 'malaysia'];
const WAVE2 = ['malta', 'cyprus', 'georgia'];
const WAVE3 = ['greece', 'croatia', 'thailand'];
// Remaining destinations stay in launching/interest queue
const LAUNCHING = [
  'netherlands',
];

const MEDICAL_PATTERN = /mbbs|medicine|medical|dentistry|dental|pharmacy|nursing|clinical/i;

export interface RoutingInput {
  destinationInterest?: string;
  country?: string;
  program?: string;
  subject?: string;
  careerGoal?: string;
  source?: string;
  budget?: string;
}

export interface RoutingResult {
  assignedTeam: LeadTeam;
  riskFlag: boolean;
  medicalProgram: boolean;
  routingNote: string;
}

function normalize(value?: string): string {
  return (value || '').toString().trim().toLowerCase().replace(/\s+/g, '-');
}

/** Decide routing for a lead using the plan's rules (order matters). */
export function routeLead(input: RoutingInput): RoutingResult {
  const dest = normalize(input.destinationInterest || input.country);
  const programText = `${input.program || ''} ${input.subject || ''} ${input.careerGoal || ''}`;
  const medicalProgram = MEDICAL_PATTERN.test(programText) || MEDICAL_PATTERN.test(dest);

  let assignedTeam: LeadTeam = 'general';
  let routingNote = 'General counseling queue.';

  if (FLAGSHIP.includes(dest)) {
    assignedTeam = 'china';
    routingNote = 'China team — show visa-first policy and relevant university context.';
  } else if (WAVE1.includes(dest) || WAVE2.includes(dest) || WAVE3.includes(dest)) {
    assignedTeam = 'wave1_owner';
    routingNote = 'Assigned active country owner — never untrained general sales staff.';
  } else if (LAUNCHING.includes(dest)) {
    assignedTeam = 'launching_interest';
    routingNote = 'Interest list + honest launch message; no payment or application promise until gate passes.';
  }

  // A medical/licensing program always needs the recognition/licensing review,
  // and is escalated to senior review if it would otherwise sit in the general queue.
  if (medicalProgram) {
    routingNote += ' Medical program — recognition/licensing review required before recommendations.';
    if (assignedTeam === 'general') assignedTeam = 'senior_review';
  }

  // High-risk profile: escalate to senior counselor review before recommendations/payment.
  const riskFlag = isHighRisk(input);
  if (riskFlag) {
    assignedTeam = 'senior_review';
    routingNote += ' High-risk profile — senior counselor review before recommendations or payment.';
  }

  return { assignedTeam, riskFlag, medicalProgram, routingNote };
}

/**
 * A conservative high-risk heuristic. Real risk assessment is a human step;
 * this only flags obvious cases for senior review so nothing slips through.
 */
function isHighRisk(input: RoutingInput): boolean {
  const budget = normalize(input.budget);
  // Explicitly declared very-low budget against an expensive destination is worth a review.
  const veryLowBudget = /under|below|less|<|0-|no-budget|not-sure/.test(budget) && budget.length > 0;
  const expensiveDest = ['uk', 'united-kingdom', 'finland'].includes(
    normalize(input.destinationInterest || input.country)
  );
  return veryLowBudget && expensiveDest;
}
