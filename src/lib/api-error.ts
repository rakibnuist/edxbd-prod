import { randomUUID } from 'node:crypto';

export interface ServerErrorPayload {
  error: string;
  errorId: string;
}

/**
 * Log an internal error server-side under a fresh correlation ID and return a
 * minimal client-safe JSON payload with no internal error messages or types.
 */
export function logAndFormatServerError(
  context: string,
  error: unknown,
  publicMessage = 'Internal server error',
): ServerErrorPayload {
  const errorId = `err_${randomUUID().replace(/-/g, '').slice(0, 12)}`;
  console.error(`[${context}] [${errorId}]`, error);
  return {
    error: publicMessage,
    errorId,
  };
}
