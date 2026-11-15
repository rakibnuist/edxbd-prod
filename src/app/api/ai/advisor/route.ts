import { NextRequest, NextResponse } from 'next/server';
import { normalizeAdvisorRequest, type AdvisorStreamEvent } from '@/lib/advisor-tools';
import { streamAdvisorAnswer } from '@/lib/gemini-advisor';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'ai-study-advisor',
    maxRequests: 30,
    windowMs: 60 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const rawBody = await readLimitedJson(request, 24 * 1024);
    const validated = normalizeAdvisorRequest(rawBody);
    if (!validated.data) {
      return NextResponse.json(
        { error: validated.error || 'Invalid advisor query.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const input = validated.data;
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let closed = false;
        const closeSafe = () => {
          if (closed) return;
          closed = true;
          try {
            controller.close();
          } catch {
            // Stream may already be closed if client disconnected.
          }
        };

        const emit = (event: AdvisorStreamEvent) => {
          if (closed || request.signal.aborted) return;
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          } catch {
            closed = true;
          }
        };

        try {
          await streamAdvisorAnswer(input, emit, request.signal);
        } catch (err) {
          emit({
            type: 'error',
            error: err instanceof Error ? err.message : 'Unable to stream advisor response.',
          });
        } finally {
          closeSafe();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;

    console.error(
      'Study advisor route error:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return NextResponse.json(
      { error: 'Unable to process your question right now.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
