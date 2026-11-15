import 'server-only';

import { GoogleGenAI } from '@google/genai';
import {
  buildCatalogRoadmapFallback,
  type RoadmapRequest,
  type RoadmapSummary,
} from './roadmap-generator';

export const GEMINI_ROADMAP_MODEL = 'gemini-4-hydrogen';

const ROADMAP_SCHEMA = {
  type: 'OBJECT',
  properties: {
    executiveSummary: { type: 'STRING' },
    scholarshipProspects: { type: 'STRING' },
    timelineMilestones: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          period: { type: 'STRING' },
          action: { type: 'STRING' },
        },
        required: ['period', 'action'],
      },
    },
    complianceNotes: {
      type: 'ARRAY',
      items: { type: 'STRING' },
    },
  },
  required: ['executiveSummary', 'scholarshipProspects'],
};

const ROADMAP_SYSTEM_INSTRUCTION = [
  'You are the Principal Study Abroad Strategist for EduExpress International (Dhaka, Bangladesh).',
  'You synthesize a personalized, authoritative study abroad executive strategy for a Bangladeshi student and their family.',
  '',
  'CRITICAL POLICY & COMPLIANCE RULES:',
  '1. CHINA VISA-FIRST GUARANTEE: Explicitly highlight that EduExpress charges zero consultancy service fees before China visa approval.',
  '2. MBBS/MEDICAL RULES: If MBBS or Medicine is selected, mandate World Directory of Medical Schools (WDOMS) listing and Bangladesh Medical and Dental Council (BMDC) criteria (HSC Biology GPA >= 3.50).',
  '3. VISA INTEGRITY: Non-immigrant intent is paramount. Remind the student that study visas prohibit off-campus employment, and future goals must focus on career contribution in Bangladesh or international scholarship progression.',
  '4. ACCURACY & CONCISENESS: Tone must be professional, supportive, objective, and realistic. Never promise or guarantee admission, scholarship awards, or visa outcomes.',
].join('\n');

/**
 * Generates an executive study abroad roadmap combining Gemini strategy synthesis
 * with verified Prisma database catalog records and fee breakdowns.
 */
export async function generateRoadmapSummary(req: RoadmapRequest): Promise<RoadmapSummary> {
  const baseSummary = buildCatalogRoadmapFallback(req);

  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) {
    return baseSummary;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const promptPayload = {
      studentName: req.studentName,
      targetCountry: req.targetCountry,
      targetDegree: req.targetDegree,
      intendedMajor: req.intendedMajor,
      targetIntake: req.targetIntake,
      academicStanding: req.gpa,
      budgetRange: req.budgetRange,
      language: req.language,
    };

    const interaction = await ai.interactions.create(
      {
        model: GEMINI_ROADMAP_MODEL,
        system_instruction: ROADMAP_SYSTEM_INSTRUCTION,
        input: JSON.stringify(promptPayload),
        store: false,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: ROADMAP_SCHEMA,
        },
        generation_config: {
          max_output_tokens: 1500,
          thinking_level: 'low',
        },
      },
      { timeout_ms: 12_000 },
    );

    const outputText = interaction.output_text?.trim();
    if (!outputText) {
      return baseSummary;
    }

    const parsed: unknown = JSON.parse(outputText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return baseSummary;
    }

    const obj = parsed as Record<string, unknown>;

    const executiveSummary = typeof obj.executiveSummary === 'string' && obj.executiveSummary.trim()
      ? obj.executiveSummary.trim()
      : baseSummary.executiveSummary;

    const scholarshipProspects = typeof obj.scholarshipProspects === 'string' && obj.scholarshipProspects.trim()
      ? obj.scholarshipProspects.trim()
      : baseSummary.scholarshipProspects;

    const timelineMilestones = Array.isArray(obj.timelineMilestones) && obj.timelineMilestones.length > 0
      ? (obj.timelineMilestones as Array<{ period: string; action: string }>).map(m => ({
          period: String(m.period || '').trim(),
          action: String(m.action || '').trim(),
        })).filter(m => m.period && m.action)
      : baseSummary.timelineMilestones;

    const customNotes = Array.isArray(obj.complianceNotes)
      ? (obj.complianceNotes as unknown[]).map(n => String(n || '').trim()).filter(Boolean)
      : [];

    return {
      ...baseSummary,
      executiveSummary,
      scholarshipProspects,
      timelineMilestones: timelineMilestones.length > 0 ? timelineMilestones : baseSummary.timelineMilestones,
      complianceNotes: customNotes.length > 0 ? customNotes : baseSummary.complianceNotes,
      mode: 'gemini',
    };
  } catch (err) {
    console.warn('[GeminiRoadmap] Falling back to catalog roadmap due to error:', err);
    return baseSummary;
  }
}
