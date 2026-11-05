// Two-letter destination codes. Emoji flags render inconsistently across
// platforms (Windows shows letters, some Android builds show nothing), so the
// interface uses the code as the stable mark and keeps the emoji optional.
const CODES: Record<string, string> = {
  china: 'CN',
  'south-korea': 'KR',
  uk: 'GB',
  'united-kingdom': 'GB',
  hungary: 'HU',
  finland: 'FI',
  malaysia: 'MY',
  malta: 'MT',
  cyprus: 'CY',
  georgia: 'GE',
  greece: 'GR',
  croatia: 'HR',
  thailand: 'TH',
};

export function countryCode(slug: string): string {
  return CODES[slug.toLowerCase()] ?? slug.slice(0, 2).toUpperCase();
}
