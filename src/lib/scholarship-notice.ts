import { sanitizeUpdateHtml } from './content-html';
import { toSafeExternalUrl } from './safe-url';

export interface ParsedScholarshipNotice {
  universityName: string;
  slug: string;
  title: string;
  excerpt: string;
  htmlContent: string;
  scholarshipTypes: string[];
  targetDegrees: string[];
  applicationDeadline: string;
  stipendCoverage: string;
  languageRequirements: string;
  sourceUrl: string | null;
  deadlineAt: Date | null;
  tags: string[];
}

export type ParseScholarshipNoticeResult =
  | { ok: true; data: ParsedScholarshipNotice }
  | { ok: false; skipped?: boolean; error: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toStringList(value: unknown, maxItems = 12): string[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(/[,;\n]/)
      : [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') continue;
    const clean = item.replace(/\s+/g, ' ').trim().slice(0, 120);
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
    if (out.length >= maxItems) break;
  }
  return out;
}

function cleanText(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLen);
}

function slugifyAscii(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export function parseNoticeDeadlineDate(raw: string): Date | null {
  if (!raw) return null;
  const isoMatch = raw.match(/\b(202[5-9]|203\d)-([01]\d)-([0-3]\d)\b/);
  if (isoMatch) {
    const dt = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T23:59:59.000Z`);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  const monthDayYear = raw.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+(202[5-9]|203\d)\b/i);
  if (monthDayYear) {
    const dt = new Date(monthDayYear[0]);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  return null;
}

export function parseScholarshipNoticePayload(
  raw: unknown,
  now = new Date(),
): ParseScholarshipNoticeResult {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'Invalid payload: expected JSON object.' };
  }

  const record = raw as Record<string, unknown>;
  if (typeof record.error === 'string' && record.error.trim()) {
    return { ok: false, skipped: true, error: `Upstream monitor error skipped: ${record.error.trim().slice(0, 160)}` };
  }

  const universityName = cleanText(record.university_name, 160);
  if (universityName.length < 2) {
    return { ok: false, error: 'university_name is required (minimum 2 characters).' };
  }

  let sourceUrl: string | null = null;
  if (record.source_url !== undefined && record.source_url !== null && String(record.source_url).trim() !== '') {
    sourceUrl = toSafeExternalUrl(record.source_url);
    if (!sourceUrl) {
      return { ok: false, error: 'source_url must be a valid http:// or https:// URL.' };
    }
  }

  const scholarshipTypes = toStringList(record.scholarship_types, 12);
  const targetDegrees = toStringList(record.target_degrees, 10);
  const applicationDeadline = cleanText(record.application_deadline, 200) || 'Check official portal';
  const stipendCoverage = cleanText(record.stipend_coverage, 600) || 'Pending editorial verification';
  const languageRequirements = cleanText(record.language_requirements, 600) || 'Pending editorial verification';
  const summary =
    cleanText(record.summary, 2000) ||
    cleanText(record.notes, 2000) ||
    `Automated admissions and scholarship notice check for ${universityName}.`;

  const cycleMatch = `${applicationDeadline} ${summary}`.match(/\b(202[5-9]|203\d)\b/);
  const cycleYear = cycleMatch?.[1] || String(now.getUTCFullYear());

  const uniSlug = slugifyAscii(universityName) || 'china-university';
  const slug = `china-notice-${uniSlug}-${cycleYear}`.slice(0, 100);
  const title = `${universityName} Scholarship & Admissions Notice (${cycleYear})`.slice(0, 180);
  const excerpt = summary.slice(0, 280);
  const deadlineAt = parseNoticeDeadlineDate(applicationDeadline);
  const checkedDate = now.toISOString().slice(0, 10);

  const rawHtml = `
    <div class="editorial-draft-notice">
      <p><strong>Editorial Draft (Stages 3–6 Pending Review):</strong> Extracted automatically from official China admissions sources on ${escapeHtml(checkedDate)}. Verify Bangladesh-specific eligibility, total cost impact, <em>What may change</em>, and <em>Who this route is not suitable for</em> before publishing.</p>
    </div>
    <h2>${escapeHtml(universityName)} — Official Scholarship Update</h2>
    <p>${escapeHtml(summary)}</p>
    <h3>Key Verified Details</h3>
    <table>
      <tbody>
        <tr><th>University / Portal</th><td>${escapeHtml(universityName)}</td></tr>
        <tr><th>Scholarship Types</th><td>${escapeHtml(scholarshipTypes.length ? scholarshipTypes.join(', ') : 'See official notice')}</td></tr>
        <tr><th>Target Degrees</th><td>${escapeHtml(targetDegrees.length ? targetDegrees.join(', ') : 'Verify with official guide')}</td></tr>
        <tr><th>Application Deadline</th><td>${escapeHtml(applicationDeadline)}</td></tr>
        <tr><th>Stipend &amp; Coverage</th><td>${escapeHtml(stipendCoverage)}</td></tr>
        <tr><th>Language Requirements</th><td>${escapeHtml(languageRequirements)}</td></tr>
        <tr><th>Checked Date</th><td>${escapeHtml(checkedDate)}</td></tr>
        ${sourceUrl ? `<tr><th>Official Source</th><td><a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceUrl)}</a></td></tr>` : ''}
      </tbody>
    </table>
    <h3>Before Publishing (Bangladesh Desk Review)</h3>
    <ul>
      <li>Confirm Bangladesh applicant eligibility (HSC/Bachelor percentage/GPA, age, CSCA if required).</li>
      <li>Add estimated total yearly living &amp; hostel balance in CNY/BDT after scholarship coverage.</li>
      <li>Add <strong>What may change</strong> and <strong>Who this route is not suitable for</strong> sections.</li>
    </ul>
  `;

  const htmlContent = sanitizeUpdateHtml(rawHtml);
  const tags = Array.from(
    new Set(['China', 'Scholarships', 'Admissions Monitor', ...scholarshipTypes.slice(0, 3), ...targetDegrees.slice(0, 3)]),
  ).slice(0, 8);

  return {
    ok: true,
    data: {
      universityName,
      slug,
      title,
      excerpt,
      htmlContent,
      scholarshipTypes,
      targetDegrees,
      applicationDeadline,
      stipendCoverage,
      languageRequirements,
      sourceUrl,
      deadlineAt,
      tags,
    },
  };
}
