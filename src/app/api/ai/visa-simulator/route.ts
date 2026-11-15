import { NextRequest, NextResponse } from 'next/server';
import { generateVisaInterviewFeedback } from '@/lib/gemini-visa-simulator';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { cleanText, type FitResponseLanguage } from '@/lib/fit-matcher';
import type { VisaAnswerSubmission, VisaDestination, VisaSimulationInput } from '@/lib/visa-simulator';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'ai-visa-simulator',
    maxRequests: 25,
    windowMs: 60 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const rawBody = await readLimitedJson(request, 16 * 1024);
    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const body = rawBody as Record<string, unknown>;
    const destination: VisaDestination = body.destination === 'malaysia' ? 'malaysia' : 'china';
    const universityName = cleanText(body.universityName, 120) || (destination === 'china' ? 'Nanjing University of Information Science & Technology' : 'Asia Pacific University');
    const programName = cleanText(body.programName, 120) || 'Computer Science & Technology';
    const academicLevel = cleanText(body.academicLevel, 60) || 'Bachelor';
    const language: FitResponseLanguage = body.language === 'bn' ? 'bn' : 'en';

    const rawAnswers = Array.isArray(body.answers) ? body.answers : [];
    const answers: VisaAnswerSubmission[] = [];

    for (const a of rawAnswers) {
      if (!a || typeof a !== 'object') continue;
      const aObj = a as Record<string, unknown>;
      const qId = typeof aObj.questionId === 'number' ? aObj.questionId : 1;
      const ans = cleanText(aObj.answer, 600);
      answers.push({ questionId: qId, answer: ans });
    }

    if (answers.length === 0) {
      return NextResponse.json(
        { error: 'Provide at least one answered interview question.' },
        { status: 400 },
      );
    }

    const input: VisaSimulationInput = {
      destination,
      universityName,
      programName,
      academicLevel,
      answers,
      language,
    };

    const feedback = await generateVisaInterviewFeedback(input);

    return NextResponse.json(
      { success: true, feedback },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;

    console.error(
      'Visa simulator route error:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return NextResponse.json(
      { error: 'Unable to evaluate visa interview answers right now.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
