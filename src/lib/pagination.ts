export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
}

function parseIntegerOrFallback(value: string | number | null | undefined, fallback: number): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.trunc(value) : fallback;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

/**
 * Parse and clamp pagination query parameters so callers cannot trigger unbounded
 * database reads, negative offsets, or division-by-zero page counts.
 */
export function parsePagination(
  rawPage: string | number | null | undefined,
  rawLimit: string | number | null | undefined,
  options: PaginationOptions = {},
): ParsedPagination {
  const maxLimit = Math.max(1, Math.trunc(options.maxLimit ?? 100));
  const defaultLimit = Math.min(maxLimit, Math.max(1, Math.trunc(options.defaultLimit ?? 10)));

  const page = Math.max(1, parseIntegerOrFallback(rawPage, 1));
  const limit = Math.min(maxLimit, Math.max(1, parseIntegerOrFallback(rawLimit, defaultLimit)));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}
