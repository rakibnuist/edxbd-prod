import { NextRequest, NextResponse } from 'next/server';
import { generateCostFeasibilityReport } from '@/lib/gemini-cost-feasibility';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { cleanText, type FitResponseLanguage } from '@/lib/fit-matcher';
import type { FeeRow } from '@/lib/catalog-views';
import type { FeasibilityProgramInput, FeasibilityRequest } from '@/lib/cost-feasibility';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'ai-cost-feasibility',
    maxRequests: 30,
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
    const rawPrograms = Array.isArray(body.programs) ? body.programs : [];

    if (rawPrograms.length === 0) {
      return NextResponse.json(
        { error: 'Select at least one program to evaluate financial feasibility.' },
        { status: 400 },
      );
    }

    const programs: FeasibilityProgramInput[] = [];
    for (const p of rawPrograms.slice(0, 3)) {
      if (!p || typeof p !== 'object') continue;
      const pObj = p as Record<string, unknown>;
      const key = cleanText(pObj.key, 120);
      const name = cleanText(pObj.name, 120);
      const uniName = cleanText(pObj.universityName, 120);
      const uniSlug = cleanText(pObj.universitySlug, 120);
      const city = cleanText(pObj.city, 60);
      const level = cleanText(pObj.level, 60);
      const tuitionCny = typeof pObj.tuitionCny === 'number' && Number.isFinite(pObj.tuitionCny) ? pObj.tuitionCny : 20000;
      const tuitionText = cleanText(pObj.tuitionText, 80) || `CNY ${tuitionCny.toLocaleString()}`;
      const tuitionAfterScholarshipCny = typeof pObj.tuitionAfterScholarshipCny === 'number' ? pObj.tuitionAfterScholarshipCny : undefined;

      const rawFees = Array.isArray(pObj.recordedFees) ? pObj.recordedFees : [];
      const recordedFees: FeeRow[] = [];
      for (const f of rawFees) {
        if (!f || typeof f !== 'object') continue;
        const fObj = f as Record<string, unknown>;
        recordedFees.push({
          category: (fObj.category as FeeRow['category']) || 'accommodation',
          item: cleanText(fObj.item, 80),
          cost: cleanText(fObj.cost, 60),
          firstYearCny: typeof fObj.firstYearCny === 'number' ? fObj.firstYearCny : null,
          sourceUrl: typeof fObj.sourceUrl === 'string' ? fObj.sourceUrl : undefined,
        });
      }

      programs.push({
        key,
        name,
        universityName: uniName,
        universitySlug: uniSlug,
        city,
        level,
        tuitionCny,
        tuitionText,
        tuitionAfterScholarshipCny,
        recordedFees,
      });
    }

    const exchangeRate = typeof body.bdtCnyExchangeRate === 'number' && body.bdtCnyExchangeRate > 0
      ? body.bdtCnyExchangeRate
      : 17.2;

    const budgetBdt = typeof body.familyBudgetBdtPerYear === 'number' && body.familyBudgetBdtPerYear > 0
      ? body.familyBudgetBdtPerYear
      : undefined;

    const language: FitResponseLanguage = body.language === 'bn' ? 'bn' : 'en';

    const input: FeasibilityRequest = {
      programs,
      familyBudgetBdtPerYear: budgetBdt,
      bdtCnyExchangeRate: exchangeRate,
      language,
    };

    const report = await generateCostFeasibilityReport(input);

    return NextResponse.json(
      { success: true, report },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;

    console.error(
      'Cost feasibility route error:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return NextResponse.json(
      { error: 'Unable to evaluate budget feasibility right now.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
