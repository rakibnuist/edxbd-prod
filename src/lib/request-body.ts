import { NextResponse } from 'next/server';

export class JsonBodyError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'JsonBodyError';
  }
}

// API request bodies are untrusted at runtime. Returning a dynamic object here
// preserves the existing route payload contracts while enforcing a hard byte
// limit before JSON parsing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readLimitedJson(request: Request, maxBytes: number): Promise<Record<string, any>> {
  const contentType = request.headers.get('content-type')?.toLowerCase() || '';
  if (!contentType.includes('application/json')) {
    throw new JsonBodyError('Content-Type must be application/json.', 415);
  }

  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new JsonBodyError('Request body is too large.', 413);
  }

  if (!request.body) {
    throw new JsonBodyError('A JSON request body is required.', 400);
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new JsonBodyError('Request body is too large.', 413);
    }
    chunks.push(value);
  }

  if (totalBytes === 0) {
    throw new JsonBodyError('A JSON request body is required.', 400);
  }

  try {
    const parsed: unknown = JSON.parse(Buffer.concat(chunks, totalBytes).toString('utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new JsonBodyError('The JSON body must be an object.', 400);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return parsed as Record<string, any>;
  } catch (error) {
    if (error instanceof JsonBodyError) throw error;
    throw new JsonBodyError('Malformed JSON request body.', 400);
  }
}

export function jsonBodyErrorResponse(error: unknown) {
  if (!(error instanceof JsonBodyError)) return null;
  return NextResponse.json(
    { error: error.message },
    { status: error.status, headers: { 'Cache-Control': 'no-store' } },
  );
}

export function getOptionalString(
  body: Record<string, unknown>,
  field: string,
  maxLength: number,
): string | undefined {
  const value = body[field];
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') {
    throw new JsonBodyError(`${field} must be text.`, 400);
  }

  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new JsonBodyError(`${field} is too long.`, 400);
  }
  return normalized;
}

export function getRequiredString(
  body: Record<string, unknown>,
  field: string,
  maxLength: number,
): string {
  const value = getOptionalString(body, field, maxLength);
  if (!value) throw new JsonBodyError(`${field} is required.`, 400);
  return value;
}

export function getRequiredDate(body: Record<string, unknown>, field: string): Date {
  const value = getRequiredString(body, field, 100);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new JsonBodyError(`${field} must be a valid date.`, 400);
  }
  return date;
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export function getSafeUtm(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const safe: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const item = (value as Record<string, unknown>)[key];
    if (typeof item === 'string' && item.trim()) safe[key] = item.trim().slice(0, 200);
  }
  return Object.keys(safe).length > 0 ? safe : null;
}

export function getValidatedPhone(body: Record<string, unknown>, field = 'phone'): string {
  const value = getRequiredString(body, field, 40);
  const digits = value.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) {
    throw new JsonBodyError('Enter a valid phone number including country code.', 400);
  }
  return value.trim().startsWith('+') ? `+${digits}` : digits;
}
