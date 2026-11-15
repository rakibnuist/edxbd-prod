import 'server-only';

import { GoogleGenAI } from '@google/genai';
import {
  buildAllowedGuides,
  cleanText,
  scoreCandidateUniversities,
  type FitResponseLanguage,
} from '@/lib/fit-matcher';
import { buildDestinationContext, toCandidateUniversity } from '@/lib/gemini-fit';
import {
  buildCatalogLeadCopilotFallback,
  buildDeterministicLeadTriage,
  buildLeadProfileForCatalog,
  extractDecisionTriage,
  LEAD_COPILOT_JSON_SCHEMA,
  sanitizeAndHydrateLeadCopilot,
  type DecisionAnswerLike,
  type LeadCopilotResult,
} from '@/lib/lead-copilot';
import type { LeadRecord } from '@/lib/lead-workflow';
import { getUniversityRecords } from '@/lib/university-records';

export const GEMINI_DECISION_MODEL = 'gemini-decision-1';
export const GEMINI_COPILOT_MODEL = 'gemini-4-hydrogen';

const COPILOT_SYSTEM_INSTRUCTION = [
  'You are an internal senior admissions co-pilot assisting human counselors at EduExpress International (Dhanmondi, Dhaka, Bangladesh).',
  'Your job is to prepare an honest, evidence-first internal brief and a polite student/parent reply draft.',
  'STRICT COMPLIANCE RULES:',
  '1. Never promise or guarantee university admission, scholarship awards, free education, or visa approval.',
  '2. Never invent tuition numbers, stipends, rankings, partner status, or university names. Only reference facts present in candidateRecords or destinationContext.',
  '3. Only include exact university slug values from candidateRecords in universityMatches (max 3), and exact relative paths from allowedGuides or /universities/<slug> in recommendedRoutes (max 3). Do NOT put external URLs in recommendedRoutes.',
  '4. For China leads, state clearly and accurately when referencing fees that EduExpress charges no service fee before China visa approval, while university, hostel, medical, and embassy/third-party fees are separate.',
  '5. For MBBS/clinical/medical queries, insist on verifying WDOMS listing and Bangladesh (BMDC) recognition requirements before comparing prices.',
  '6. Wait before sending any university shortlist until missing transcript/language/budget gaps are checked.',
  '7. LANGUAGE RULE: If responseLanguage is "bn", write counselorBrief, verificationPriorities, missingDocuments, reasons, emailSubject, emailDraft, and whatsappDraft in clear, respectful natural Bengali (বাংলা), keeping official terms (CNY, RM, BDT, IELTS, BMDC, WDOMS, CSC, JW201/JW202, EMGS) readable. Otherwise write in crisp, polite English.',
].join('\n');

export type CopilotLeadInput = Pick<
  LeadRecord,
  | 'id'
  | 'name'
  | 'email'
  | 'phone'
  | 'country'
  | 'destinationInterest'
  | 'program'
  | 'message'
  | 'notes'
  | 'status'
  | 'source'
  | 'leadType'
  | 'assignedTeam'
  | 'assignedTo'
  | 'riskFlag'
  | 'medicalProgram'
  | 'assessAcademicLevel'
  | 'assessAcademicResults'
  | 'assessSubject'
  | 'assessBudget'
  | 'assessIntake'
  | 'assessLanguage'
  | 'assessCareerGoal'
> & {
  assessPreferredCountries?: string | null;
};

export async function generateLeadCopilotForLead(
  lead: CopilotLeadInput,
  options: { language?: FitResponseLanguage; focus?: string } = {},
): Promise<LeadCopilotResult> {
  const responseLanguage: FitResponseLanguage = options.language === 'bn' ? 'bn' : 'en';
  const focusNote = cleanText(options.focus || '', 300) || undefined;

  const records = await getUniversityRecords();
  const candidates = records.filter(record => record.isActive).map(toCandidateUniversity);
  const profile = buildLeadProfileForCatalog(lead, responseLanguage);
  const scoredCandidates = scoreCandidateUniversities(profile, candidates, 8);
  const allowedGuides = buildAllowedGuides(profile, responseLanguage);
  const baselineTriage = buildDeterministicLeadTriage(lead, profile);

  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) {
    return buildCatalogLeadCopilotFallback(lead, profile, scoredCandidates, allowedGuides, baselineTriage);
  }

  const sanitizedLeadSummary = {
    firstName: cleanText(lead.name, 80).split(/\s+/)[0] || 'Student',
    fullName: cleanText(lead.name, 100),
    status: lead.status,
    source: lead.source,
    leadType: lead.leadType,
    destination: cleanText(lead.country || lead.destinationInterest || '', 80) || 'Not specified',
    program: cleanText(lead.program || '', 160) || undefined,
    riskFlag: Boolean(lead.riskFlag),
    medicalProgram: Boolean(lead.medicalProgram),
    academicLevel: profile.academicLevel,
    academicResults: profile.academicResults,
    subject: profile.subject,
    budget: profile.budget,
    intake: profile.intake,
    language: profile.language,
    careerGoal: profile.careerGoal,
    studentMessage: cleanText(lead.message || '', 800) || undefined,
    existingNotes: cleanText(lead.notes || '', 800) || undefined,
    counselorFocus: focusNote,
    responseLanguage,
  };

  const decisionAi = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
  const generationAi = new GoogleGenAI({ apiKey });

  const decisionPromise = decisionAi.decisions.create(
    {
      model: GEMINI_DECISION_MODEL,
      api_version: 'v1beta',
      input: JSON.stringify({
        lead: sanitizedLeadSummary,
        triageContext: {
          hasAcademicResults: Boolean(profile.academicResults),
          hasBudget: Boolean(profile.budget && !/not sure/i.test(profile.budget)),
          hasLanguage: Boolean(profile.language && !/not sure/i.test(profile.language)),
          preferredCountries: profile.preferredCountries,
        },
      }),
      questions: {
        readiness: {
          type: 'choice',
          instructions: 'Select the best admissions readiness tier for this student enquiry.',
          criteria: {
            ready_for_shortlist: 'Has target country/subject plus academic scores and a workable budget range.',
            needs_documents: 'Clear study intent but missing GPA/transcript scores or language readiness.',
            needs_budget_clarification: 'Yearly budget is missing, undecided, or needs fee clarification before shortlisting.',
            high_risk_review: 'Flagged risk, medical MBBS without grades, or expecting 100% free education/guaranteed visa.',
          },
        },
        team_route: {
          type: 'choice',
          instructions: 'Select the best internal EduExpress counseling desk.',
          criteria: {
            medical_review: 'MBBS, clinical medicine, dentistry, nursing, or medical licensing query.',
            china_admissions: 'Non-medical enquiry focused on China.',
            malaysia_admissions: 'Non-medical enquiry focused on Malaysia.',
            europe_uk_admissions: 'Enquiry focused on UK, Hungary, Finland, South Korea, Malta, Cyprus, Georgia, Greece, Croatia, or Thailand.',
            general: 'Undecided destination and general study consultation.',
          },
        },
        medical_review: {
          type: 'noul',
          instructions: 'Does this applicant require WDOMS and Bangladesh BMDC medical recognition verification?',
          criteria: {
            true_description: 'Mentions MBBS, medicine, clinical degree, dental, or physician licensing.',
            false_description: 'Non-medical field such as engineering, CS, business, or arts.',
          },
        },
        scholarship_expectation_risk: {
          type: 'noul',
          instructions: 'Does this enquiry indicate an unrealistic 100% free / guaranteed scholarship expectation or severely constrained budget relative to typical study costs?',
          criteria: {
            true_description: 'Asks for 100% free study, zero cost, guaranteed full scholarship, or budget under 5 lakh BDT without realistic pathway notes.',
            false_description: 'Open to checking realistic partial/merit awards or standard tuition ranges.',
          },
        },
      },
    },
    {
      timeout_ms: 8_000,
      retries: { strategy: 'attempt-count-backoff', maxRetries: 1, retryConnectionErrors: true },
    },
  );

  const generationPromise = generationAi.interactions.create(
    {
      model: GEMINI_COPILOT_MODEL,
      system_instruction: COPILOT_SYSTEM_INSTRUCTION,
      input: JSON.stringify({
        lead: sanitizedLeadSummary,
        candidateRecords: scoredCandidates,
        destinationContext: buildDestinationContext(profile),
        allowedGuides,
      }),
      store: false,
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: LEAD_COPILOT_JSON_SCHEMA,
      },
      generation_config: {
        max_output_tokens: 1800,
        thinking_level: 'low',
      },
    },
    {
      timeout_ms: 14_000,
      retries: { strategy: 'attempt-count-backoff', maxRetries: 1, retryConnectionErrors: true },
    },
  );

  const [decisionRes, generationRes] = await Promise.allSettled([decisionPromise, generationPromise]);

  let triage = baselineTriage;
  if (decisionRes.status === 'fulfilled' && decisionRes.value.answers) {
    triage = extractDecisionTriage(
      decisionRes.value.answers as Record<string, DecisionAnswerLike>,
      baselineTriage,
    );
  } else if (decisionRes.status === 'rejected') {
    console.warn(
      '[gemini-lead-copilot] Decision API fallback to heuristic triage:',
      decisionRes.reason instanceof Error ? decisionRes.reason.message : 'Unknown error',
    );
  }

  if (generationRes.status === 'fulfilled') {
    const outputText = generationRes.value.output_text?.trim();
    if (outputText) {
      try {
        const parsed: unknown = JSON.parse(outputText);
        return sanitizeAndHydrateLeadCopilot(
          parsed,
          lead,
          profile,
          scoredCandidates,
          allowedGuides,
          triage,
          { model: GEMINI_COPILOT_MODEL, decisionModel: GEMINI_DECISION_MODEL },
        );
      } catch (parseErr) {
        console.warn(
          '[gemini-lead-copilot] Invalid JSON from model, falling back to catalog brief:',
          parseErr instanceof Error ? parseErr.message : 'JSON parse error',
        );
      }
    }
  } else {
    console.warn(
      '[gemini-lead-copilot] Interactions API fallback to catalog brief:',
      generationRes.reason instanceof Error ? generationRes.reason.message : 'Unknown error',
    );
  }

  return {
    ...buildCatalogLeadCopilotFallback(lead, profile, scoredCandidates, allowedGuides, triage),
    decisionModel: triage.source === 'gemini-decision-1' ? GEMINI_DECISION_MODEL : undefined,
  };
}
