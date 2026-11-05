/** Guide publication is separate from admission/award availability. Sources stay internal. */
export function universityGuideIsIndexable(value: unknown, now = new Date()): boolean {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Record<string, unknown>;
  const internal = profile.internal as Record<string, unknown> | undefined;
  const publication = internal?.searchPublication as Record<string, unknown> | undefined;
  if (publication?.mode !== 'evergreen_guide' || publication.index !== true) return false;
  const researchedAt = new Date(String(publication.researchedAt || ''));
  if (Number.isNaN(researchedAt.getTime()) || researchedAt > now) return false;
  if (typeof profile.slug !== 'string' || typeof profile.overview !== 'string' || !profile.overview.trim()) return false;
  let officialHost: string;
  try { officialHost = new URL(String(profile.officialUrl)).hostname.replace(/^www\./, ''); } catch { return false; }
  const officialSource = (url: unknown) => {
    try {
      const source = new URL(String(url));
      return source.protocol === 'https:' && (source.hostname === officialHost || source.hostname.endsWith(`.${officialHost}`));
    } catch { return false; }
  };
  if (!Array.isArray(publication.sources) || new Set(publication.sources.filter(officialSource)).size < 2) return false;
  if (!Array.isArray(profile.programs) || !profile.programs.length) return false;
  // Each listed option needs provenance. At least one route must have useful
  // admission and numeric tuition facts; a name-only directory row is insufficient.
  const programs = profile.programs as Record<string, unknown>[];
  if (!programs.every(program => program && typeof program === 'object' && officialSource(program.sourceUrl) && typeof program.name === 'string' && program.name.trim() && typeof program.duration === 'string' && program.duration.trim() && Array.isArray(program.languages) && program.languages.length)) return false;
  return programs.some(program => Array.isArray(program.qualifications) && program.qualifications.length
    && Array.isArray(program.documents) && program.documents.length
    && Array.isArray(program.fees) && program.fees.some(fee => fee?.key === 'tuition' && typeof fee.amount === 'number' && Number.isFinite(fee.amount) && fee.amount >= 0 && fee.currency && fee.period));
}
