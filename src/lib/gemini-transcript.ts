import 'server-only';

import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import {
  buildCatalogTranscriptFallback,
  sanitizeAndHydrateTranscriptEvaluation,
  TRANSCRIPT_EVALUATOR_SCHEMA,
  type TranscriptEvaluationResult,
  type TranscriptHints,
} from '@/lib/transcript-evaluator';
import { getUniversityRecords } from '@/lib/university-records';

export const GEMINI_TRANSCRIPT_MODEL = 'gemini-4-hydrogen';

const TRANSCRIPT_SYSTEM_INSTRUCTION = [
  'You are the verified Academic Credentials & Transcript Evaluator for EduExpress International (Dhaka, Bangladesh).',
  'You evaluate Bangladeshi student marksheets (SSC, HSC, Dakhil, Alim, National University, Cambridge/Edexcel O/A Level).',
  'STRICT EXTRACTION RULES:',
  '1. Extract only clearly legible information. If candidate name or year is obscured, leave empty or omit.',
  '2. Identify group/stream accurately: Science, Business Studies (Commerce), Humanities (Arts), or Engineering.',
  '3. Extract key subject names and their letter grades or grade points (especially Biology, Physics, Chemistry, Higher Mathematics, English).',
  '4. BMDC COMPLIANCE: For medical study, Bangladesh Medical & Dental Council (BMDC) requires Biology in HSC with minimum GPA 3.50. Explicitly look for Biology grade point.',
  '5. Never guarantee university admission, scholarship awards, or visa outcomes.',
  '6. In counselorSummary, provide a professional, evidence-backed evaluation in the requested language (Bengali if language is "bn", otherwise English).',
].join('\n');

export async function evaluateTranscriptImage(
  imageBuffer: Buffer,
  rawMimeType: string,
  hints: TranscriptHints,
): Promise<TranscriptEvaluationResult> {
  const records = await getUniversityRecords();
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  const language = hints.language === 'bn' ? 'bn' : 'en';

  if (!apiKey) {
    return buildCatalogTranscriptFallback(hints, records);
  }

  try {
    // Standardize and optimize image for Gemini vision processing
    const optimizedBuffer = await sharp(imageBuffer, { failOn: 'none' })
      .rotate()
      .resize({ width: 1600, height: 2200, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const base64Image = optimizedBuffer.toString('base64');
    const ai = new GoogleGenAI({ apiKey });

    const promptText = [
      `Evaluate this student academic marksheet/transcript for study abroad suitability.`,
      `Preferred response language: ${language}.`,
      hints.targetLevel ? `Student intended level: ${hints.targetLevel}.` : '',
      hints.targetSubject ? `Student intended subject: ${hints.targetSubject}.` : '',
      `Extract exact examination name, GPA, group, key subject grades (especially Biology for BMDC check), and evaluate academic qualification.`,
    ].filter(Boolean).join(' ');

    const response = await ai.interactions.create(
      {
        model: GEMINI_TRANSCRIPT_MODEL,
        system_instruction: TRANSCRIPT_SYSTEM_INSTRUCTION,
        input: [
          {
            type: 'text',
            text: promptText,
          },
          {
            type: 'image',
            data: base64Image,
            mime_type: 'image/jpeg',
          },
        ],
        store: false,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: TRANSCRIPT_EVALUATOR_SCHEMA,
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

    const outputText = response.output_text?.trim();
    if (!outputText) {
      console.warn('[gemini-transcript] No text content returned from Gemini, falling back to catalog.');
      return buildCatalogTranscriptFallback(hints, records);
    }

    const parsed: unknown = JSON.parse(outputText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return buildCatalogTranscriptFallback(hints, records);
    }

    return sanitizeAndHydrateTranscriptEvaluation(
      parsed as Record<string, unknown>,
      records,
      language,
    );
  } catch (error) {
    console.warn(
      '[gemini-transcript] Multimodal evaluation failed, falling back to catalog:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return buildCatalogTranscriptFallback(hints, records);
  }
}
