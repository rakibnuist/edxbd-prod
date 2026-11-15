import 'server-only';

import { GoogleGenAI } from '@google/genai';
import {
  buildCatalogSopFallback,
  countWords,
  RECOMMENDED_WORD_RANGES,
  type SopCountrySpecificFeedback,
  type SopReviewRequest,
  type SopReviewResult,
  type SopSuggestion,
} from './sop-reviewer';

export const GEMINI_SOP_MODEL = 'gemini-4-hydrogen';

export const SOP_REVIEW_SCHEMA = {
  type: 'OBJECT',
  properties: {
    overallScore: { type: 'INTEGER' },
    status: { type: 'STRING', enum: ['excellent', 'good', 'needs_work', 'insufficient'] },
    strengths: { type: 'ARRAY', items: { type: 'STRING' } },
    weaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
    actionableSuggestions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          category: { type: 'STRING', enum: ['structure', 'academic_depth', 'relevance', 'compliance'] },
          title: { type: 'STRING' },
          text: { type: 'STRING' },
          exampleBeforeAfter: {
            type: 'OBJECT',
            properties: {
              before: { type: 'STRING' },
              after: { type: 'STRING' },
            },
            required: ['before', 'after'],
          },
        },
        required: ['category', 'title', 'text'],
      },
    },
    countrySpecificFeedback: {
      type: 'OBJECT',
      properties: {
        cscAlignment: { type: 'STRING' },
        visaComplianceRisk: { type: 'STRING' },
        medicalLicensingNote: { type: 'STRING' },
      },
    },
  },
  required: ['overallScore', 'status', 'strengths', 'weaknesses', 'actionableSuggestions'],
};

const SOP_SYSTEM_INSTRUCTION = [
  'You are the Chief Academic Evaluator & Scholarship Committee Advisor for EduExpress International (Dhaka, Bangladesh).',
  'You review Statement of Purpose (SOP), Research Proposals, and Study Plans written by Bangladeshi students applying for Chinese Government Scholarships (CSC Type A & Type B), Chinese University Scholarships, and Malaysian Universities.',
  '',
  'EVALUATION CRITERIA & COMPLIANCE GUARDRAILS:',
  '1. ACADEMIC & RESEARCH RIGOR: Evaluate technical clarity, study milestones, laboratory research objectives, and alignment with target university programs.',
  '2. NON-IMMIGRANT INTENT & BANGLADESH TIES: Evaluators require strong ties to Bangladesh and clear post-graduation career contribution goals. Flag any vague or absent career trajectory.',
  '3. RED FLAG: UNAUTHORIZED WORK: Chinese X1/X2 student visas strictly prohibit unauthorized off-campus employment. If student mentions part-time jobs to fund tuition, flag it immediately as a severe visa compliance risk.',
  '4. RED FLAG: PERMANENT RESIDENCE / IMMIGRATION: Flag any mentions of settling down abroad as a major consular refusal risk.',
  '5. MBBS / MEDICAL LICENSING: If MBBS or clinical medicine is targeted, remind the student that Bangladesh Medical and Dental Council (BMDC) requires WDOMS listing and minimum HSC Biology GPA >= 3.50.',
  '6. CONSTRUCTIVE & ACTIONABLE: Provide concrete rewrite examples (before/after) showing how to turn generic clichés into persuasive academic statements.',
  '7. LANGUAGE: Respond strictly in the requested language (natural, professional Bengali if language is "bn", otherwise formal English).',
].join('\n');

/**
 * Reviews a study plan or SOP using Gemini 4 Hydrogen with structured JSON output,
 * falling back gracefully to catalog rule-based review upon timeout or API unavailability.
 */
export async function evaluateSopWithGemini(
  req: SopReviewRequest,
): Promise<SopReviewResult> {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) {
    return buildCatalogSopFallback(req);
  }

  const words = countWords(req.text);
  const readTime = Math.max(1, Math.ceil(words / 200));
  const recommendedRange = RECOMMENDED_WORD_RANGES[req.targetDegree] || { min: 800, max: 1500 };

  try {
    const ai = new GoogleGenAI({ apiKey });

    const promptPayload = {
      documentType: req.documentType,
      targetCountry: req.targetCountry,
      targetDegree: req.targetDegree,
      targetSubject: req.targetSubject || 'Not specified',
      responseLanguage: req.language,
      studentDraft: req.text,
      wordCount: words,
      recommendedWordRange: recommendedRange,
    };

    const interaction = await ai.interactions.create(
      {
        model: GEMINI_SOP_MODEL,
        system_instruction: SOP_SYSTEM_INSTRUCTION,
        input: JSON.stringify(promptPayload),
        store: false,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: SOP_REVIEW_SCHEMA,
        },
        generation_config: {
          max_output_tokens: 2048,
          thinking_level: 'low',
        },
      },
      { timeout_ms: 14_000 },
    );

    const outputText = interaction.output_text?.trim();
    if (!outputText) {
      return buildCatalogSopFallback(req);
    }

    const parsed: unknown = JSON.parse(outputText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return buildCatalogSopFallback(req);
    }

    const obj = parsed as Record<string, unknown>;

    const overallScore = typeof obj.overallScore === 'number'
      ? Math.max(20, Math.min(98, Math.round(obj.overallScore)))
      : 75;

    let status: 'excellent' | 'good' | 'needs_work' | 'insufficient' = 'needs_work';
    if (obj.status === 'excellent' || obj.status === 'good' || obj.status === 'insufficient') {
      status = obj.status;
    } else if (overallScore >= 85) {
      status = 'excellent';
    } else if (overallScore >= 70) {
      status = 'good';
    } else if (overallScore < 45) {
      status = 'insufficient';
    }

    const strengths = Array.isArray(obj.strengths)
      ? obj.strengths.map(s => String(s || '').trim()).filter(Boolean)
      : [];

    const weaknesses = Array.isArray(obj.weaknesses)
      ? obj.weaknesses.map(w => String(w || '').trim()).filter(Boolean)
      : [];

    const rawSuggestions = Array.isArray(obj.actionableSuggestions) ? obj.actionableSuggestions : [];
    const actionableSuggestions: SopSuggestion[] = [];

    for (const item of rawSuggestions) {
      if (!item || typeof item !== 'object') continue;
      const sObj = item as Record<string, unknown>;
      const cat = String(sObj.category || '').toLowerCase();
      const validCategory: SopSuggestion['category'] =
        cat === 'academic_depth' || cat === 'relevance' || cat === 'compliance'
          ? (cat as SopSuggestion['category'])
          : 'structure';

      const title = String(sObj.title || 'Improvement Recommendation').trim();
      const text = String(sObj.text || '').trim();
      if (!text) continue;

      let exampleBeforeAfter: SopSuggestion['exampleBeforeAfter'] | undefined;
      if (sObj.exampleBeforeAfter && typeof sObj.exampleBeforeAfter === 'object') {
        const ex = sObj.exampleBeforeAfter as Record<string, unknown>;
        const before = String(ex.before || '').trim();
        const after = String(ex.after || '').trim();
        if (before && after) {
          exampleBeforeAfter = { before, after };
        }
      }

      actionableSuggestions.push({
        category: validCategory,
        title,
        text,
        exampleBeforeAfter,
      });
    }

    const countrySpecificFeedback: SopCountrySpecificFeedback = {};
    if (obj.countrySpecificFeedback && typeof obj.countrySpecificFeedback === 'object') {
      const cs = obj.countrySpecificFeedback as Record<string, unknown>;
      if (cs.cscAlignment) countrySpecificFeedback.cscAlignment = String(cs.cscAlignment).trim();
      if (cs.visaComplianceRisk) countrySpecificFeedback.visaComplianceRisk = String(cs.visaComplianceRisk).trim();
      if (cs.medicalLicensingNote) countrySpecificFeedback.medicalLicensingNote = String(cs.medicalLicensingNote).trim();
    }

    const isBn = req.language === 'bn';

    return {
      overallScore,
      status,
      wordCount: words,
      estimatedReadTimeMinutes: readTime,
      recommendedWordRange: recommendedRange,
      strengths: strengths.length > 0 ? strengths : [isBn ? 'মৌলিক শিক্ষাগত উদ্দেশ্য সন্নিবেশিত।' : 'Foundational statement of study intent.'],
      weaknesses,
      actionableSuggestions,
      countrySpecificFeedback,
      language: req.language,
      mode: 'gemini',
      disclaimer: isBn
        ? 'এডুএক্সপ্রেস এআই রিভিউ একটি একাডেমিক ও পরামর্শমূলক মূল্যায়ন। এটি বিশ্ববিদ্যালয় বা স্কলারশিপ প্রাপ্তির নিশ্চয়তা দেয় না।'
        : 'EduExpress AI evaluation is an advisory critique based on university and CSC rubrics. It does not guarantee admission or scholarship award.',
    };
  } catch (err) {
    console.warn('[GeminiSop] Falling back to catalog review due to error:', err);
    return buildCatalogSopFallback(req);
  }
}
