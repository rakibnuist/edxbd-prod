import 'server-only';

import { GoogleGenAI } from '@google/genai';
import {
  COST_FEASIBILITY_SCHEMA,
  evaluateCostFeasibilityLocally,
  type FeasibilityReport,
  type FeasibilityRequest,
} from '@/lib/cost-feasibility';

export const GEMINI_FEASIBILITY_MODEL = 'gemini-4-hydrogen';

const FEASIBILITY_SYSTEM_INSTRUCTION = [
  'You are the Senior Financial Feasibility Advisor for EduExpress International (Dhaka, Bangladesh).',
  'You evaluate university cost comparisons for Bangladeshi families comparing study options in China.',
  'STRICT FINANCIAL & COMPLIANCE RULES:',
  '1. GROUNDING IN DATA: Only use the exact program tuition, accommodation, and fee figures provided in the request payload. Never invent tuition amounts or living expenses.',
  '2. FEE SEPARATION: Always separate university tuition/hostel from Dhaka third-party costs (embassy visa, physical exam, airfare). Emphasize EduExpress visa-first policy: no consultancy service fee before China visa approval.',
  '3. CURRENCY REALISM: Advise families on CNY/BDT exchange rate buffer (10-15% margin).',
  '4. NO ADMISSION GUARANTEES: Never state that scholarships or visas are guaranteed. Partial scholarships depend on annual GPA renewal.',
  '5. OUTPUT: Output must match the requested schema in the specified language (Bengali if language is "bn", otherwise English).',
].join('\n');

export async function generateCostFeasibilityReport(
  input: FeasibilityRequest,
): Promise<FeasibilityReport> {
  const localBaseline = evaluateCostFeasibilityLocally(input);
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();

  if (!apiKey) {
    return localBaseline;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const payload = {
      language: input.language,
      exchangeRateBdtPerCny: input.bdtCnyExchangeRate,
      annualFamilyBudgetBdt: input.familyBudgetBdtPerYear,
      comparedPrograms: input.programs,
      localBaselineCalculations: localBaseline.programAnalyses,
    };

    const interaction = await ai.interactions.create(
      {
        model: GEMINI_FEASIBILITY_MODEL,
        system_instruction: FEASIBILITY_SYSTEM_INSTRUCTION,
        input: JSON.stringify(payload),
        store: false,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: COST_FEASIBILITY_SCHEMA,
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
      return localBaseline;
    }

    const parsed: unknown = JSON.parse(outputText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return localBaseline;
    }

    const obj = parsed as Record<string, unknown>;
    const rawVerdict = String(obj.verdict || '');
    const verdict = (['comfortably_affordable', 'realistic_with_buffer', 'budget_stretch', 'high_financial_risk'].includes(rawVerdict)
      ? rawVerdict
      : localBaseline.verdict) as FeasibilityReport['verdict'];

    return {
      mode: 'gemini',
      verdict,
      verdictHeadline: String(obj.verdictHeadline || localBaseline.verdictHeadline),
      verdictDetail: String(obj.verdictDetail || localBaseline.verdictDetail),
      programAnalyses: localBaseline.programAnalyses,
      currencySensitivityNote: String(obj.currencySensitivityNote || localBaseline.currencySensitivityNote),
      feeTransparencyAudit: localBaseline.feeTransparencyAudit,
      counselorBudgetTips: Array.isArray(obj.counselorBudgetTips) && obj.counselorBudgetTips.length > 0
        ? obj.counselorBudgetTips.map(String)
        : localBaseline.counselorBudgetTips,
      language: input.language,
    };
  } catch (error) {
    console.warn(
      '[gemini-feasibility] Falling back to local baseline evaluation:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return localBaseline;
  }
}
