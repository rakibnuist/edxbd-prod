import 'server-only';

import { GoogleGenAI, type Interactions } from '@google/genai';
import {
  ADVISOR_TOOL_DECLARATIONS,
  buildCatalogAdvisorFallbackAnswer,
  dedupeCitations,
  executeAdvisorTool,
  type AdvisorCitation,
  type AdvisorStreamEvent,
  type NormalizedAdvisorRequest,
} from '@/lib/advisor-tools';
import { cleanText, type FitResponseLanguage } from '@/lib/fit-matcher';
import { getUniversityRecords } from '@/lib/university-records';

export const GEMINI_ADVISOR_MODEL = 'gemini-4-hydrogen';

const ADVISOR_SYSTEM_INSTRUCTION = [
  'You are the verified Study & Cost Advisor for EduExpress International (Dhanmondi, Dhaka, Bangladesh).',
  'Always call your database tools (search_universities_and_programs, get_cost_breakdown, lookup_verified_guides) before naming universities, stating tuition/cost numbers, or citing EduExpress pages.',
  'STRICT COMPLIANCE RULES:',
  '1. Never invent tuition fees, living expenses, scholarship stipends, rankings, partner status, or university names. Only quote facts returned by tools.',
  '2. Never guarantee university admission, scholarship awards, free education, or visa approval.',
  '3. Separate university tuition, hostel, medical, and embassy/third-party visa costs clearly from consultancy fees. For China admissions, explain accurately that EduExpress charges no consultancy service fee before China visa approval.',
  '4. For MBBS, clinical medicine, or medical study questions, prioritize checking WDOMS listing and Bangladesh (BMDC) recognition rules before comparing fees.',
  '5. Only reference internal paths (/universities/<slug>, /universities/<slug>/clear-cost, /mbbs-in-china-bangladesh, etc.) returned by tools — never invent external URLs.',
  '6. LANGUAGE: Reply in natural, clear Bengali (বাংলা) if responseLanguage is "bn", keeping acronyms and currency labels (CNY, RM, USD, BDT, BMDC, WDOMS, IELTS, CSC, JW201/JW202, EMGS) intact. Otherwise reply in concise, plain English.',
].join('\n');

function toolStatusLabel(name: string, language: FitResponseLanguage): string {
  const bn = language === 'bn';
  switch (name) {
    case 'search_universities_and_programs':
      return bn ? 'বিশ্ববিদ্যালয় ও প্রোগ্রাম রেকর্ড খোঁজা হচ্ছে…' : 'Searching verified university & program records…';
    case 'get_cost_breakdown':
      return bn ? 'ClearCost ও দেশের খরচের হিসাব যাচাই হচ্ছে…' : 'Checking ClearCost & destination fee schedules…';
    case 'lookup_verified_guides':
      return bn ? 'যাচাইকৃত গাইড ও নীতিমালা খোঁজা হচ্ছে…' : 'Looking up verified guides & policies…';
    default:
      return bn ? 'তথ্য যাচাই হচ্ছে…' : 'Verifying catalog records…';
  }
}

async function emitChunkedFallback(
  text: string,
  citations: AdvisorCitation[],
  emit: (event: AdvisorStreamEvent) => void,
  signal?: AbortSignal,
) {
  if (citations.length > 0) {
    emit({ type: 'citations', citations });
  }
  const tokens = text.split(/(\s+)/);
  let buffer = '';
  for (let i = 0; i < tokens.length; i++) {
    if (signal?.aborted) return;
    buffer += tokens[i];
    if (buffer.length >= 28 || i === tokens.length - 1) {
      emit({ type: 'chunk', text: buffer });
      buffer = '';
      await new Promise(resolve => setTimeout(resolve, 12));
    }
  }
  emit({ type: 'done', mode: 'catalog' });
}

function parseArgumentsSafe(rawArgs: string, fallbackObj: Record<string, unknown> | undefined): Record<string, unknown> {
  if (rawArgs.trim()) {
    try {
      const parsed: unknown = JSON.parse(rawArgs);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // Fall back to pre-populated arguments from step.start if available.
    }
  }
  return fallbackObj && typeof fallbackObj === 'object' ? fallbackObj : {};
}

export async function streamAdvisorAnswer(
  req: NormalizedAdvisorRequest,
  emit: (event: AdvisorStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const records = await getUniversityRecords();
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();

  if (!apiKey) {
    const fallback = buildCatalogAdvisorFallbackAnswer(req.question, records, req.language);
    await emitChunkedFallback(fallback.text, fallback.citations, emit, signal);
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  const history: Interactions.Step[] = req.history.map(msg => ({
    type: msg.role === 'assistant' ? 'model_output' : 'user_input',
    content: [{ type: 'text', text: msg.content }],
  }));

  history.push({
    type: 'user_input',
    content: [
      {
        type: 'text',
        text: `[responseLanguage=${req.language}] ${cleanText(req.question, 600)}`,
      },
    ],
  });

  const collectedCitations: AdvisorCitation[] = [];
  let totalStreamedChars = 0;

  try {
    const maxRounds = 3;
    for (let round = 0; round < maxRounds; round++) {
      if (signal?.aborted) return;

      const stream = await ai.interactions.create(
        {
          model: GEMINI_ADVISOR_MODEL,
          system_instruction: ADVISOR_SYSTEM_INSTRUCTION,
          input: history,
          tools: ADVISOR_TOOL_DECLARATIONS as unknown as Interactions.Tool[],
          stream: true,
          store: false,
          generation_config: {
            max_output_tokens: 1400,
            thinking_level: 'low',
          },
        },
        {
          timeout_ms: 14_000,
          retries: { strategy: 'attempt-count-backoff', maxRetries: 1, retryConnectionErrors: true },
          fetch_options: signal ? { signal } : undefined,
        },
      );

      interface PendingCall {
        id: string;
        name: string;
        argumentsText: string;
        initialArgs?: Record<string, unknown>;
      }

      const pendingCalls = new Map<number, PendingCall>();

      for await (const event of stream) {
        if (signal?.aborted) return;

        if (event.event_type === 'step.start' && event.step.type === 'function_call') {
          const initialArgs = event.step.arguments && typeof event.step.arguments === 'object'
            ? (event.step.arguments as Record<string, unknown>)
            : undefined;
          pendingCalls.set(event.index, {
            id: event.step.id,
            name: event.step.name,
            argumentsText: initialArgs ? JSON.stringify(initialArgs) : '',
            initialArgs,
          });
          emit({ type: 'status', label: toolStatusLabel(event.step.name, req.language) });
        } else if (event.event_type === 'step.delta') {
          if (event.delta.type === 'arguments_delta') {
            const call = pendingCalls.get(event.index);
            if (call) {
              call.argumentsText += event.delta.arguments ?? '';
            }
          } else if (event.delta.type === 'text' && event.delta.text) {
            totalStreamedChars += event.delta.text.length;
            emit({ type: 'chunk', text: event.delta.text });
          }
        }
      }

      if (pendingCalls.size === 0) {
        break;
      }

      for (const call of pendingCalls.values()) {
        const parsedArgs = parseArgumentsSafe(call.argumentsText, call.initialArgs);
        const exec = executeAdvisorTool(call.name, parsedArgs, records, req.language);
        collectedCitations.push(...exec.citations);

        history.push({
          type: 'function_call',
          id: call.id,
          name: call.name,
          arguments: parsedArgs,
        });
        history.push({
          type: 'function_result',
          name: call.name,
          call_id: call.id,
          result: JSON.stringify(exec.toolResult),
        });
      }

      const deduped = dedupeCitations(collectedCitations);
      if (deduped.length > 0) {
        emit({ type: 'citations', citations: deduped });
      }
    }

    if (totalStreamedChars > 0) {
      const finalCitations = dedupeCitations(collectedCitations);
      if (finalCitations.length > 0) {
        emit({ type: 'citations', citations: finalCitations });
      }
      emit({ type: 'done', mode: 'gemini', model: GEMINI_ADVISOR_MODEL });
      return;
    }

    const fallback = buildCatalogAdvisorFallbackAnswer(req.question, records, req.language);
    await emitChunkedFallback(fallback.text, fallback.citations, emit, signal);
  } catch (error) {
    if (signal?.aborted) return;
    console.warn(
      '[gemini-advisor] Falling back to catalog answer:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    if (totalStreamedChars === 0) {
      const fallback = buildCatalogAdvisorFallbackAnswer(req.question, records, req.language);
      await emitChunkedFallback(fallback.text, fallback.citations, emit, signal);
      return;
    }
    emit({ type: 'done', mode: 'gemini', model: GEMINI_ADVISOR_MODEL });
  }
}
