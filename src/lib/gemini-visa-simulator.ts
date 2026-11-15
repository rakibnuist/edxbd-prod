import 'server-only';

import { GoogleGenAI } from '@google/genai';
import {
  evaluateAnswersLocally,
  VISA_FEEDBACK_SCHEMA,
  type VisaInterviewFeedback,
  type VisaSimulationInput,
} from '@/lib/visa-simulator';

export const GEMINI_VISA_MODEL = 'gemini-4-hydrogen';

const VISA_SYSTEM_INSTRUCTION = [
  'You are a seasoned Senior Consular Officer & Study Abroad Visa Preparation Expert for EduExpress International (Dhaka, Bangladesh).',
  'You evaluate Bangladeshi student answers for China (Chinese Embassy in Dhaka, X1/X2 JW202/JW201 student visas) and Malaysia (EMGS student passes).',
  'STRICT CONSULAR EVALUATION RULES:',
  '1. RED FLAG CHECK - NON-IMMIGRANT INTENT: Student visas strictly forbid expressing intention to immigrate, seek permanent residency, or overstay. Students must show ties to Bangladesh and clear intent to return.',
  '2. RED FLAG CHECK - UNAUTHORIZED EMPLOYMENT: Student visas in China/Malaysia do not permit off-campus work without special permits. Answers suggesting funding through local odd jobs or part-time work are severe red flags.',
  '3. INSTITUTION ACCURACY: Student must demonstrate awareness of their institution name, city geography, and degree medium.',
  '4. SCORING RUBRIC: Assign readinessScore (0-100) based on clarity, credibility, legal compliance, and sponsor consistency.',
  '5. Provide diplomatic, confident model answers in the requested language (Bengali if language is "bn", otherwise English).',
].join('\n');

export async function generateVisaInterviewFeedback(
  input: VisaSimulationInput,
): Promise<VisaInterviewFeedback> {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) {
    return evaluateAnswersLocally(input);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const payload = {
      destination: input.destination,
      universityName: input.universityName,
      programName: input.programName,
      academicLevel: input.academicLevel,
      responseLanguage: input.language,
      studentResponses: input.answers,
    };

    const interaction = await ai.interactions.create(
      {
        model: GEMINI_VISA_MODEL,
        system_instruction: VISA_SYSTEM_INSTRUCTION,
        input: JSON.stringify(payload),
        store: false,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: VISA_FEEDBACK_SCHEMA,
        },
        generation_config: {
          max_output_tokens: 1800,
          thinking_level: 'low',
        },
      },
      { timeout_ms: 14_000 },
    );

    const outputText = interaction.output_text?.trim();
    if (!outputText) {
      return evaluateAnswersLocally(input);
    }

    const parsed: unknown = JSON.parse(outputText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return evaluateAnswersLocally(input);
    }

    const obj = parsed as Record<string, unknown>;
    const score = typeof obj.readinessScore === 'number' ? Math.max(0, Math.min(100, Math.round(obj.readinessScore))) : 75;
    const verdict = obj.verdict === 'strong' ? 'strong' : obj.verdict === 'needs_revision' ? 'needs_revision' : 'moderate';
    const verdictLabel = String(obj.verdictLabel || '');
    const strengths = Array.isArray(obj.strengths) ? obj.strengths.map(String) : [];
    const redFlags = Array.isArray(obj.redFlags) ? obj.redFlags.map(String) : [];
    const counselorTips = Array.isArray(obj.counselorTips) ? obj.counselorTips.map(String) : [];
    const rawCorrections = Array.isArray(obj.corrections) ? obj.corrections : [];

    const corrections = rawCorrections.map((c: unknown) => {
      const cObj = (c && typeof c === 'object' ? c : {}) as Record<string, unknown>;
      return {
        question: String(cObj.question || ''),
        studentAnswer: String(cObj.studentAnswer || ''),
        recommendedResponse: String(cObj.recommendedResponse || ''),
        tip: String(cObj.tip || ''),
      };
    });

    return {
      mode: 'gemini',
      destination: input.destination,
      readinessScore: score,
      verdict,
      verdictLabel,
      strengths,
      redFlags,
      counselorTips,
      corrections,
      language: input.language,
    };
  } catch (error) {
    console.warn(
      '[gemini-visa-simulator] Falling back to local evaluation:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return evaluateAnswersLocally(input);
  }
}
