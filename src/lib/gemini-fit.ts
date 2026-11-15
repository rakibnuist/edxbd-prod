import 'server-only';

import { GoogleGenAI } from '@google/genai';
import { activeCountries } from '@/lib/countries';
import {
  buildAllowedGuides,
  buildCatalogFallbackPreview,
  FIT_PREVIEW_JSON_SCHEMA,
  sanitizeAndHydrateGeminiPreview,
  scoreCandidateUniversities,
  type FitCandidateUniversity,
  type FitPreviewResult,
  type FitProfileInput,
} from '@/lib/fit-matcher';
import { getUniversityRecords } from '@/lib/university-records';

export const GEMINI_FIT_MODEL = 'gemini-4-hydrogen';

const SYSTEM_INSTRUCTION = [
  'You are a senior education counsellor at EduExpress International (Dhanmondi, Dhaka, Bangladesh).',
  'Your voice is plain, specific, calm, and helpful to both Bangladeshi students and parents.',
  'STRICT EVIDENCE GUARDRAILS:',
  '1. Never guarantee university admission, scholarship selection, or visa approval.',
  '2. Never invent tuition fees, stipends, rankings, partner status, or university names. Only cite facts present in candidateRecords or destinationContext.',
  '3. For universityMatches, only choose exact slug values from candidateRecords (max 4, ideally 2-3 strong fits). For matchedProgram, use an exact program name from that candidate record when applicable.',
  '4. For routes, only choose exact href values from allowedGuides or /universities/<slug> from candidateRecords (max 3).',
  '5. When referencing scholarships, state clearly that coverage depends on eligibility/renewal and non-covered costs remain payable. For China, note accurately that EduExpress charges no service fee before China visa approval while university, embassy, medical, and third-party costs are separate.',
  '6. For MBBS, medicine, dentistry, or clinical queries, emphasize verifying WDOMS listing and Bangladesh (BMDC) recognition requirements before comparing costs or applying.',
  '7. LANGUAGE RULE: If studentProfile.responseLanguage is "bn", write all natural-language output fields in clear, natural Bengali (বাংলা), keeping currency codes and official acronyms (CNY, RM, BDT, BMDC, WDOMS, IELTS, CSC) clear. Otherwise write in concise English.',
].join('\n');

export function toCandidateUniversity(record: Awaited<ReturnType<typeof getUniversityRecords>>[number]): FitCandidateUniversity {
  return {
    slug: record.slug,
    name: record.name,
    country: record.country,
    city: record.city,
    degrees: record.degree,
    taught: record.taught,
    intakes: record.intake,
    majors: record.details.majors,
    tuition: record.details.tuition,
    recognitionAuthority: record.recognitionAuthority,
    verificationStatus: record.verificationStatus,
    hasPublishedCostPlan: record.costPlans.some(plan => plan.isPublished),
    programs: record.programs
      .filter(program => program.status !== 'paused')
      .map(program => ({
        name: program.name,
        level: program.level,
        subject: program.subject,
        languages: program.languages,
        intakes: program.intakes,
        tuition: program.tuition,
        tuitionAfterScholarship: program.tuitionAfterScholarship,
      })),
    scholarships: record.scholarships
      .filter(scholarship => scholarship.status !== 'closed')
      .map(scholarship => ({
        title: scholarship.title,
        amount: scholarship.amount,
        coverage: scholarship.coverage,
        condition: scholarship.condition,
      })),
  };
}

export function buildDestinationContext(profile: FitProfileInput) {
  const selected = new Set(profile.preferredCountries.filter(c => c !== 'not-sure'));
  const relevant = activeCountries.filter(country =>
    selected.size === 0 ? ['china', 'malaysia'].includes(country.slug) : selected.has(country.slug),
  );
  return (relevant.length > 0 ? relevant : activeCountries.slice(0, 3)).slice(0, 4).map(country => ({
    name: country.name,
    slug: country.slug,
    serviceStatus: country.serviceStatus || 'Active',
    tuition: country.costs.tuition,
    living: country.costs.living,
    intakes: country.intakesText || '',
    languageNotes: country.requirements.language.slice(0, 2),
    scholarships: country.scholarships.slice(0, 3),
  }));
}

export async function generateGroundedFitPreview(profile: FitProfileInput): Promise<FitPreviewResult> {
  const records = await getUniversityRecords();
  const candidates = records.filter(record => record.isActive).map(toCandidateUniversity);
  const scoredCandidates = scoreCandidateUniversities(profile, candidates, 8);
  const allowedGuides = buildAllowedGuides(profile, profile.responseLanguage);

  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) {
    return buildCatalogFallbackPreview(profile, scoredCandidates, allowedGuides);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const payload = {
      studentProfile: profile,
      candidateRecords: scoredCandidates,
      destinationContext: buildDestinationContext(profile),
      allowedGuides,
    };

    const interaction = await ai.interactions.create(
      {
        model: GEMINI_FIT_MODEL,
        system_instruction: SYSTEM_INSTRUCTION,
        input: JSON.stringify(payload),
        store: false,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: FIT_PREVIEW_JSON_SCHEMA,
        },
        generation_config: {
          max_output_tokens: 1600,
          thinking_level: 'low',
        },
      },
      { timeout_ms: 14_000 },
    );

    const outputText = interaction.output_text?.trim();
    if (!outputText) {
      return buildCatalogFallbackPreview(profile, scoredCandidates, allowedGuides);
    }

    const parsed: unknown = JSON.parse(outputText);
    return sanitizeAndHydrateGeminiPreview(
      parsed,
      profile,
      scoredCandidates,
      allowedGuides,
      GEMINI_FIT_MODEL,
    );
  } catch (error) {
    console.warn(
      '[gemini-fit] Falling back to catalog matcher:',
      error instanceof Error ? error.message : 'Unknown Gemini API error',
    );
    return buildCatalogFallbackPreview(profile, scoredCandidates, allowedGuides);
  }
}
