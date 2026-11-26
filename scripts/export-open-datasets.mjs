#!/usr/bin/env node
/**
 * Export verified EduExpress International open datasets (CC BY 4.0)
 * for GitHub, Zenodo (DOI), Kaggle, and Frictionless Data Packages.
 *
 * Implements the 2-Tier Hybrid Source Governance Model:
 * - Strictly exports public, verified catalog & benchmark data (zero PII, zero student records,
 *   zero internal CRM/admin data, and ZERO deep granular monitoring URLs — deep update URLs
 *   remain private inside `InternalSourceWatch`).
 * - Exposes Tier-1 root institutional domains (`official_domain`) and high-level national
 *   regulatory authority names for academic & journalistic E-E-A-T verifiability.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { register } from 'node:module';
import { DatabaseSync } from 'node:sqlite';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));

const { GLOBAL_DESTINATIONS_BENCHMARK } = await import('../src/lib/global-study-destinations.ts');
const { toPublicScholarshipScenario } = await import('../src/lib/widget-scholarship-math.ts');
const { buildChinaBenchmark, CHINA_REPORT_OFFICIAL_AUTHORITIES } = await import('../src/lib/china-benchmark.ts');
const {
  BANGLADESH_MACRO_INDICATORS,
  BANGLADESH_MARKET_SOURCES,
  STUDENT_FILE_COMPARISON,
  buildBangladeshMarketBenchmark,
} = await import('../src/lib/bangladesh-market-benchmark.ts');
const { CHINA_INTAKE_VERIFIED_ON, getChinaIntakes } = await import('../src/lib/china-intakes.ts');
const { DEFAULT_OFFICE_RECORD } = await import('../src/lib/office-record.ts');
const { OPEN_DATA_REPOSITORIES } = await import('../src/lib/open-data.ts');

const ROOT = process.cwd();
const DB_PATH = path.join(ROOT, 'prisma/data/edxbd.db');
const OUT_DIR = path.join(ROOT, 'open-data/bangladesh-study-abroad-dataset');
const DATA_DIR = path.join(OUT_DIR, 'data');
const DIST_DIR = path.join(ROOT, 'open-data/dist');

const SITE_URL = 'https://eduexpressint.com';
const GITHUB_USER = 'rakibnuist';
const KAGGLE_DATASET_ID = 'abdullahalrakibww/bangladesh-study-abroad-china-cost-benchmark-2027';
const REPO_NAME = 'bangladesh-study-abroad-dataset';
const REPO_URL = `https://github.com/${GITHUB_USER}/${REPO_NAME}`;
const VERSION = OPEN_DATA_REPOSITORIES.version;
const RELEASE_DATE = '2026-11-26';

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(DIST_DIR, { recursive: true });

function stripExternalDeepUrls(str) {
  return str.replace(/https?:\/\/[^\s,;"')]+/gi, (match) => {
    if (match.toLowerCase().startsWith(SITE_URL)) return match;
    return extractRootDomain(match) || '';
  });
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const str = stripExternalDeepUrls(String(value).replace(/\r\n/g, '\n').replace(/\r/g, '\n'));
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function writeCsv(filePath, headers, rows) {
  const lines = [
    headers.map(csvEscape).join(','),
    ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(',')),
  ];
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function parseJsonList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    if (parsed && typeof parsed === 'object') return Object.values(parsed).map(String).filter(Boolean);
  } catch {
    return [String(raw)];
  }
  return [];
}

function formatDateIso(value) {
  if (!value) return '';
  const d = typeof value === 'number' ? new Date(value) : new Date(String(value));
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

/** Extract Tier-1 root hostname only (e.g. nuist.edu.cn) — never expose deep brochure paths. */
function extractRootDomain(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return parsed.hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return '';
  }
}

function tryFetchLiveJson(url, fallbackPath) {
  if (process.argv.includes('--local-only')) {
    return fs.existsSync(fallbackPath) ? JSON.parse(fs.readFileSync(fallbackPath, 'utf8')) : null;
  }
  try {
    const raw = execSync(`curl -4 -fsSL --max-time 12 "${url}"`, {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    });
    return JSON.parse(raw);
  } catch {
    if (fs.existsSync(fallbackPath)) {
      console.warn(`Live fetch skipped for ${url}; reusing existing local snapshot.`);
      return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }
    return null;
  }
}

console.log(`Reading verified catalog from ${DB_PATH}...`);
const db = new DatabaseSync(DB_PATH, { readOnly: true });

const universities = db
  .prepare(
    `SELECT id, slug, name, chineseName, country, province, city, location,
            cscAgencyNumber, isCscDesignated, isMoeMbbsListed,
            intake, degree, taught,
            rankingWorld, rankingNational, rankingCountry, majors, tuition,
            deadlineApplication, officialUrl, relationshipType,
            recognitionAuthority, lastVerifiedAt, verificationExpiresAt, verificationStatus
     FROM University
     WHERE isActive = 1 AND verificationStatus = 'verified'
     ORDER BY country ASC, COALESCE(rankingWorld, 999999) ASC, name ASC`,
  )
  .all();

const uniById = new Map(universities.map((u) => [u.id, u]));

const programs = db
  .prepare(
    `SELECT id, universityId, level, name, subject, languages, duration,
            intakes, tuition, tuitionAfterScholarship, applicationDeadline,
            eligibility, status
     FROM Program
     ORDER BY universityId ASC, level ASC, name ASC`,
  )
  .all()
  .filter((p) => uniById.has(p.universityId));

const scholarships = db
  .prepare(
    `SELECT id, universityId, title, type, amount, coverage, condition,
            renewal, deadline, eligiblePrograms, details, status
     FROM Scholarship
     ORDER BY universityId ASC, title ASC`,
  )
  .all()
  .filter((s) => uniById.has(s.universityId));

const fees = db
  .prepare(
    `SELECT id, universityId, item, cost, recipient, refundable, validFor, notes
     FROM Fee
     ORDER BY universityId ASC, item ASC`,
  )
  .all()
  .filter((f) => uniById.has(f.universityId));

const publishedStoriesCount =
  db
    .prepare(
      `SELECT COUNT(*) AS c FROM Testimonial
       WHERE isPublished = 1 AND consentRevokedAt IS NULL
         AND (consentExpiresAt IS NULL OR consentExpiresAt >= ?)`,
    )
    .get(Date.now())?.c ?? 0;
const chinaStoriesCount =
  db
    .prepare(
      `SELECT COUNT(*) AS c FROM Testimonial
       WHERE isPublished = 1 AND consentRevokedAt IS NULL
         AND (consentExpiresAt IS NULL OR consentExpiresAt >= ?)
         AND country LIKE '%China%'`,
    )
    .get(Date.now())?.c ?? 0;

db.close();

// Count child rows and teaching-medium flags per university
const progCount = new Map();
const scholCount = new Map();
const feeCount = new Map();
const uniHasEnglish = new Map();
const uniHasChineseLang = new Map();

for (const p of programs) {
  progCount.set(p.universityId, (progCount.get(p.universityId) || 0) + 1);
  if (/english/i.test(p.languages || '')) uniHasEnglish.set(p.universityId, true);
  if (/language|non.?degree/i.test(p.level || '') || /chinese\s+language/i.test(p.name || '')) {
    uniHasChineseLang.set(p.universityId, true);
  }
}
for (const s of scholarships) scholCount.set(s.universityId, (scholCount.get(s.universityId) || 0) + 1);
for (const f of fees) feeCount.set(f.universityId, (feeCount.get(f.universityId) || 0) + 1);

// 1. universities_verified.csv (Tier-1 root official_domain only; deep URLs kept private)
const uniRows = universities.map((u) => {
  const hasEnglish = Boolean(uniHasEnglish.get(u.id) || /english/i.test(u.taught || ''));
  const hasChineseLang = Boolean(
    uniHasChineseLang.get(u.id) || /language|non.?degree/i.test(u.degree || ''),
  );
  return {
    slug: u.slug,
    name: u.name,
    chinese_name: u.chineseName || '',
    country: u.country,
    province: u.province || '',
    city: u.city || '',
    location: u.location || '',
    official_domain: extractRootDomain(u.officialUrl),
    csc_agency_number: u.cscAgencyNumber || '',
    is_csc_designated: u.isCscDesignated ? 'yes' : 'no',
    has_english_taught: hasEnglish ? 'yes' : 'no',
    has_chinese_language_program: hasChineseLang ? 'yes' : 'no',
    eduexpress_profile_url: `${SITE_URL}/universities/${u.slug}`,
    clear_cost_url: `${SITE_URL}/universities/${u.slug}/clear-cost`,
    tuition_summary: u.tuition || '',
    degrees: u.degree || '',
    teaching_languages: u.taught || '',
    intakes: u.intake || '',
    application_deadline: u.deadlineApplication || '',
    ranking_world: u.rankingWorld ?? '',
    ranking_national: u.rankingNational ?? u.rankingCountry ?? '',
    recognition_authority: u.recognitionAuthority || '',
    relationship_type: u.relationshipType || 'public_direct_application',
    verification_status: u.verificationStatus,
    last_verified_date: formatDateIso(u.lastVerifiedAt),
    verification_expires_date: formatDateIso(u.verificationExpiresAt),
    program_count: progCount.get(u.id) || 0,
    scholarship_count: scholCount.get(u.id) || 0,
    itemized_fee_count: feeCount.get(u.id) || 0,
    source_governance: '2-tier-hybrid (official institutional notice retained in private verification vault)',
  };
});

writeCsv(path.join(DATA_DIR, 'universities_verified.csv'), Object.keys(uniRows[0]), uniRows);

// 2. programs_verified.csv (no deep source URLs exposed)
const progRows = programs.map((p) => {
  const u = uniById.get(p.universityId);
  return {
    university_slug: u.slug,
    university_name: u.name,
    country: u.country,
    city: u.city || '',
    level: p.level || '',
    program_name: p.name || '',
    subject: p.subject || '',
    languages: p.languages || '',
    duration: p.duration || '',
    intakes: p.intakes || '',
    tuition: p.tuition || '',
    tuition_after_scholarship: p.tuitionAfterScholarship || '',
    application_deadline: p.applicationDeadline || '',
    eligibility_requirements: parseJsonList(p.eligibility).join(' ; '),
    status: p.status || 'active',
    last_verified_date: formatDateIso(u.lastVerifiedAt),
    verification_basis: 'Official Institutional Programme Notice (Private Vault)',
    eduexpress_profile_url: `${SITE_URL}/universities/${u.slug}`,
  };
});

writeCsv(path.join(DATA_DIR, 'programs_verified.csv'), Object.keys(progRows[0]), progRows);

// 3. scholarships_verified.csv (structured tuition/dorm/insurance waiver & stipend fields; no deep URLs)
const scholRows = scholarships.map((s, idx) => {
  const u = uniById.get(s.universityId);
  const parsed = toPublicScholarshipScenario(u.slug, idx, {
    title: s.title,
    type: s.type,
    amount: s.amount,
    coverage: s.coverage,
    condition: s.condition,
    renewal: s.renewal,
    deadline: s.deadline,
    eligiblePrograms: parseJsonList(s.eligiblePrograms),
    details: parseJsonList(s.details),
    status: s.status,
  });
  return {
    university_slug: u.slug,
    university_name: u.name,
    country: u.country,
    scholarship_title: s.title || '',
    scholarship_category: parsed.category,
    scholarship_type: s.type || '',
    tuition_waiver_type: parsed.tuitionWaiverType,
    tuition_waiver_value: parsed.tuitionWaiverValue ?? '',
    waives_accommodation: parsed.waivesAccommodation ? 'yes' : 'no',
    waives_insurance: parsed.waivesInsurance ? 'yes' : 'no',
    monthly_stipend_cny: parsed.monthlyStipendCny ?? '',
    amount: s.amount || '',
    coverage: s.coverage || parsed.coverageSummary,
    condition: s.condition || '',
    renewal: s.renewal || parsed.renewalNote || '',
    deadline: s.deadline || '',
    eligible_programs: parseJsonList(s.eligiblePrograms).join(' ; '),
    details: parseJsonList(s.details).join(' ; '),
    status: s.status || 'active',
    last_verified_date: formatDateIso(u.lastVerifiedAt),
    verification_basis: 'Official Scholarship Notice (Private Vault)',
    eduexpress_profile_url: `${SITE_URL}/universities/${u.slug}`,
  };
});

writeCsv(path.join(DATA_DIR, 'scholarships_verified.csv'), Object.keys(scholRows[0]), scholRows);

// 4. itemized_fees_verified.csv (no deep source URLs exposed)
const feeRows = fees.map((f) => {
  const u = uniById.get(f.universityId);
  return {
    university_slug: u.slug,
    university_name: u.name,
    country: u.country,
    fee_item: f.item || '',
    cost: f.cost || '',
    recipient: f.recipient || '',
    refundable: f.refundable || '',
    valid_for: f.validFor || '',
    notes: f.notes || '',
    last_verified_date: formatDateIso(u.lastVerifiedAt),
    verification_basis: 'Official Institutional Fee Schedule (Private Vault)',
    eduexpress_profile_url: `${SITE_URL}/universities/${u.slug}/clear-cost`,
  };
});

writeCsv(path.join(DATA_DIR, 'itemized_fees_verified.csv'), Object.keys(feeRows[0]), feeRows);

// 5. destinations_matrix_12_countries.csv (backward-compatible 12 EduExpress Active destinations)
const activeDestBenchmarks = GLOBAL_DESTINATIONS_BENCHMARK.filter(
  (d) => d.serviceStatus !== 'Benchmark Reference',
);
const dest12Rows = activeDestBenchmarks.map((d) => ({
  slug: d.slug,
  country: d.name,
  region: d.region,
  tier: d.tier,
  currency: d.currency,
  intakes: d.intakes,
  indicative_tuition: d.indicativeTuition,
  indicative_living_monthly: d.indicativeLiving,
  statutory_visa_financial_proof: d.officialVisaFinancialProof,
  student_file_rule: d.studentFileRule,
  eduexpress_service_fee_model: d.eduExpressFeeModel,
  flagship_scholarships: d.flagshipScholarships.map((s) => `${s.name} (${s.category})`).join(' | '),
  key_verification_guardrail: d.keyGuardrail,
  guide_url: d.href ? `${SITE_URL}${d.href}` : `${SITE_URL}/bangladesh-study-abroad-market`,
  public_authorities: d.publicAuthorityNames.join(' | '),
  last_verified_date: d.lastVerifiedIso,
}));

writeCsv(
  path.join(DATA_DIR, 'destinations_matrix_12_countries.csv'),
  Object.keys(dest12Rows[0]),
  dest12Rows,
);

// 6. destinations_matrix_32_countries.csv (NEW — full 32-country outbound Bangladesh global matrix)
const dest32Rows = GLOBAL_DESTINATIONS_BENCHMARK.map((d) => ({
  slug: d.slug,
  country: d.name,
  region: d.region,
  service_status: d.serviceStatus,
  tier: d.tier,
  currency: d.currency,
  intakes: d.intakes,
  indicative_tuition: d.indicativeTuition,
  indicative_living_monthly: d.indicativeLiving,
  statutory_visa_financial_proof: d.officialVisaFinancialProof,
  student_file_rule: d.studentFileRule,
  part_time_work_rights: d.partTimeWorkRights,
  post_study_work_policy: d.postStudyWorkPolicy,
  flagship_scholarships: d.flagshipScholarships.map((s) => `${s.name}: ${s.coverage}`).join(' | '),
  eduexpress_service_fee_model: d.eduExpressFeeModel,
  key_verification_guardrail: d.keyGuardrail,
  eduexpress_guide_url: d.href ? `${SITE_URL}${d.href}` : '',
  public_authorities: d.publicAuthorityNames.join(' | '),
  last_verified_date: d.lastVerifiedIso,
  next_review_date: d.nextReviewIso,
}));

writeCsv(
  path.join(DATA_DIR, 'destinations_matrix_32_countries.csv'),
  Object.keys(dest32Rows[0]),
  dest32Rows,
);

// 7. country_scholarships_verified.csv (NEW — Bangladesh-eligible national & institutional scholarships across all 32 destinations)
const countryScholRows = GLOBAL_DESTINATIONS_BENCHMARK.flatMap((d) =>
  d.flagshipScholarships.map((s) => ({
    country_slug: d.slug,
    country: d.name,
    region: d.region,
    service_status: d.serviceStatus,
    scholarship_name: s.name,
    scholarship_category: s.category,
    coverage: s.coverage,
    typical_deadline_window: s.typicalDeadline,
    bangladesh_eligible: s.bangladeshEligible ? 'yes' : 'no',
    awarding_authority: s.authorityName,
    last_verified_date: d.lastVerifiedIso,
    eduexpress_benchmark_url: d.href ? `${SITE_URL}${d.href}` : `${SITE_URL}/bangladesh-study-abroad-market`,
  })),
);

writeCsv(
  path.join(DATA_DIR, 'country_scholarships_verified.csv'),
  Object.keys(countryScholRows[0]),
  countryScholRows,
);

// Build fresh benchmark JSON snapshots directly from local verified SQLite catalog
const chinaJsonPath = path.join(DATA_DIR, 'china_study_report_2027.json');
const marketJsonPath = path.join(DATA_DIR, 'bangladesh_study_abroad_market_2027.json');

const parseCsvList = (str) =>
  String(str || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const progsByUni = new Map();
const scholsByUni = new Map();
const feesByUni = new Map();
for (const p of programs) {
  if (!progsByUni.has(p.universityId)) progsByUni.set(p.universityId, []);
  progsByUni.get(p.universityId).push(p);
}
for (const s of scholarships) {
  if (!scholsByUni.has(s.universityId)) scholsByUni.set(s.universityId, []);
  scholsByUni.get(s.universityId).push(s);
}
for (const f of fees) {
  if (!feesByUni.has(f.universityId)) feesByUni.set(f.universityId, []);
  feesByUni.get(f.universityId).push(f);
}

const cleanUniversityRecords = universities.map((u) => ({
  id: String(u.id),
  slug: u.slug,
  legacySlugs: [],
  name: u.name,
  aliases: [],
  location: u.location || '',
  country: u.country,
  city: u.city || '',
  intake: parseCsvList(u.intake),
  degree: parseCsvList(u.degree),
  taught: parseCsvList(u.taught),
  rankings: {
    world: u.rankingWorld ?? undefined,
    national: u.rankingNational ?? undefined,
    country: u.rankingCountry ?? undefined,
  },
  details: {
    majors: parseCsvList(u.majors),
    tuition: u.tuition || '',
    tuitionDetails: [],
  },
  programs: (progsByUni.get(u.id) || []).map((p) => ({
    level: p.level || '',
    name: p.name || '',
    subject: p.subject || undefined,
    languages: parseCsvList(p.languages),
    duration: p.duration || undefined,
    intakes: parseCsvList(p.intakes),
    tuition: p.tuition || undefined,
    tuitionAfterScholarship: p.tuitionAfterScholarship || undefined,
    applicationDeadline: p.applicationDeadline || undefined,
    eligibility: parseJsonList(p.eligibility),
    status: p.status || 'active',
  })),
  fees: (feesByUni.get(u.id) || []).map((f) => ({
    item: f.item || '',
    cost: f.cost || '',
    notes: f.notes || undefined,
    recipient: f.recipient || undefined,
    refundable: f.refundable || '',
    validFor: f.validFor || undefined,
  })),
  scholarships: (scholsByUni.get(u.id) || []).map((s) => ({
    title: s.title || '',
    type: s.type || undefined,
    details: parseJsonList(s.details),
    amount: s.amount || undefined,
    condition: s.condition || undefined,
    eligiblePrograms: parseJsonList(s.eligiblePrograms),
    coverage: s.coverage || undefined,
    renewal: s.renewal || undefined,
    deadline: s.deadline || undefined,
    status: s.status || 'active',
  })),
  costPlans: [],
  documents: [],
  deadlines: { application: u.deadlineApplication || '', startDate: '' },
  notes: [],
  badges: [],
  isActive: true,
  officialUrl: extractRootDomain(u.officialUrl) ? `https://${extractRootDomain(u.officialUrl)}/` : undefined,
  relationshipType: u.relationshipType || 'public_direct_application',
  recognitionAuthority: u.recognitionAuthority || undefined,
  sourceUrls: [],
  lastVerifiedAt: u.lastVerifiedAt ? new Date(u.lastVerifiedAt).toISOString() : undefined,
  verificationExpiresAt: u.verificationExpiresAt ? new Date(u.verificationExpiresAt).toISOString() : undefined,
  verificationStatus: u.verificationStatus || 'verified',
}));

const now = new Date(`${RELEASE_DATE}T00:00:00Z`);
const chinaIntakes = getChinaIntakes(now);
const chinaCleanUnis = cleanUniversityRecords.filter((u) => u.country === 'China');
const chinaBenchmark = buildChinaBenchmark(chinaCleanUnis, chinaIntakes, chinaStoriesCount, now);
const marketSnapshot = buildBangladeshMarketBenchmark(cleanUniversityRecords, publishedStoriesCount, now, chinaIntakes);

const chinaReport = {
  title: 'Bangladesh to China Study Data & Cost Benchmark Report',
  url: `${SITE_URL}/china-study-report-bangladesh`,
  datasetUrl: `${SITE_URL}/china-study-report.json`,
  publisher: {
    name: 'EduExpress International',
    url: SITE_URL,
    officeName: DEFAULT_OFFICE_RECORD.name,
    address: DEFAULT_OFFICE_RECORD.address,
    hours: DEFAULT_OFFICE_RECORD.hours,
    phonePrimary: DEFAULT_OFFICE_RECORD.phonePrimary,
    email: DEFAULT_OFFICE_RECORD.email,
  },
  generatedAt: now.toISOString(),
  intakeVerifiedOn: CHINA_INTAKE_VERIFIED_ON,
  license: OPEN_DATA_REPOSITORIES.licenseUrl,
  methodology: {
    tuitionCurrency: 'CNY',
    servicePackageCurrency: 'BDT',
    explicitSingleYearCnyOnly: true,
    noSyntheticFxConversion: true,
    sourceGovernance: '2-tier-hybrid (Tier-1 public authorities & root domains; Tier-2 private change-monitoring vault)',
    license: OPEN_DATA_REPOSITORIES.licenseUrl,
    chinaVisaFirstPolicy:
      'No file opening charge. No EduExpress service fee before China visa approval. Earlier third-party fees must be itemized in writing.',
  },
  report: chinaBenchmark,
  officialSources: CHINA_REPORT_OFFICIAL_AUTHORITIES,
};

const marketReport = {
  title: 'Bangladesh Study Abroad Market Benchmark & 32-Country Global Destination Matrix 2027',
  url: `${SITE_URL}/bangladesh-study-abroad-market`,
  bengaliUrl: `${SITE_URL}/bn/bangladesh-study-abroad-market`,
  datasetUrl: `${SITE_URL}/bangladesh-study-abroad-market.json`,
  publisher: {
    name: 'EduExpress International',
    url: SITE_URL,
    officeName: DEFAULT_OFFICE_RECORD.name,
    address: DEFAULT_OFFICE_RECORD.address,
    hours: DEFAULT_OFFICE_RECORD.hours,
    phonePrimary: DEFAULT_OFFICE_RECORD.phonePrimary,
    phoneSecondary: DEFAULT_OFFICE_RECORD.phoneSecondary,
    email: DEFAULT_OFFICE_RECORD.email,
  },
  generatedAt: now.toISOString(),
  lastVerified: RELEASE_DATE,
  license: OPEN_DATA_REPOSITORIES.licenseUrl,
  methodology: {
    tuitionAndLivingSeparated: true,
    sourceGovernance: '2-tier-hybrid (high-level public authorities exposed; granular update-tracking URLs retained privately for automated change monitoring)',
    chinaVisaFirstPolicy:
      'No file opening charge. No EduExpress service fee before China visa approval. Earlier third-party fees must be itemized in writing.',
    malaysiaServiceFee: 'BDT 0 EduExpress service fee; EMGS, tuition, and travel are paid directly by the student.',
    license: OPEN_DATA_REPOSITORIES.licenseUrl,
  },
  snapshot: marketSnapshot,
  macroMarketFundamentals: BANGLADESH_MACRO_INDICATORS,
  studentFileVsChinaPayment: STUDENT_FILE_COMPARISON,
  officialSources: BANGLADESH_MARKET_SOURCES,
};

fs.writeFileSync(chinaJsonPath, `${JSON.stringify(chinaReport, null, 2)}\n`, 'utf8');
fs.writeFileSync(marketJsonPath, `${JSON.stringify(marketReport, null, 2)}\n`, 'utf8');

const chinaCount = universities.filter((u) => u.country === 'China').length;
const chinaCscCount = universities.filter((u) => u.country === 'China' && Boolean(u.isCscDesignated)).length;
const chinaLangUniCount = uniRows.filter((u) => u.country === 'China' && u.has_chinese_language_program === 'yes').length;
const chinaEngUniCount = uniRows.filter((u) => u.country === 'China' && u.has_english_taught === 'yes').length;
const malaysiaCount = universities.filter((u) => u.country === 'Malaysia').length;
const cityCount = chinaBenchmark.cityCount;
const td = chinaBenchmark.tuitionDistributions;
const feeB = chinaBenchmark.feeBenchmarks || [];

// 8. LICENSE (CC BY 4.0)
const licenseText = `Creative Commons Attribution 4.0 International (CC BY 4.0)

Copyright (c) 2026 EduExpress International (Dhaka, Bangladesh)

This dataset and accompanying documentation are licensed under the
Creative Commons Attribution 4.0 International License.

You are free to:
  - Share — copy and redistribute the material in any medium or format
  - Adapt — remix, transform, and build upon the material for any purpose,
    even commercially.

Under the following terms:
  - Attribution — You must give appropriate credit to "EduExpress International
    (https://eduexpressint.com)", provide a link to the license, and indicate
    if changes were made.

Full legal code: https://creativecommons.org/licenses/by/4.0/legalcode
Canonical dataset source: https://eduexpressint.com/press
`;
fs.writeFileSync(path.join(OUT_DIR, 'LICENSE'), licenseText, 'utf8');

// 9. CITATION.cff
const citationCff = `cff-version: 1.2.0
title: "Bangladesh Study Abroad, Scholarship & China University Cost Benchmark Dataset (2027)"
message: "If you use this dataset in journalism, policy research, or data analysis, please cite it using the metadata below."
type: dataset
authors:
  - family-names: "Al Rakib"
    given-names: "Abdullah"
    affiliation: "EduExpress International, Dhanmondi, Dhaka, Bangladesh"
  - name: "EduExpress International Editorial & Verification Desk"
    city: "Dhaka"
    country: "BD"
    website: "https://eduexpressint.com"
version: "${VERSION}"
doi: "${OPEN_DATA_REPOSITORIES.zenodoDoi}"
date-released: "${RELEASE_DATE}"
license: "CC-BY-4.0"
repository-code: "${REPO_URL}"
url: "${SITE_URL}/press"
abstract: >-
  Open, CC BY 4.0 dataset of ${universities.length} verified active universities
  (${chinaCount} in China across ${cityCount} cities and ${malaysiaCount} in Malaysia),
  ${programs.length} degree and language programs, ${fees.length} itemized non-tuition fee rows,
  ${scholarships.length} structured university scholarship tracks, a ${dest32Rows.length}-country
  global Bangladesh outbound cost/visa matrix, and ${countryScholRows.length} Bangladesh-eligible
  flagship national scholarships covering Bangladesh Bank AD Student File rules, statutory visa
  financial proofs, and explicit single-year CNY tuition quartiles.
keywords:
  - bangladesh-higher-education
  - study-in-china
  - study-abroad-scholarships
  - international-tuition-benchmark
  - csc-scholarship
  - higher-education-costs
  - open-education-data
  - bangladesh-student-file
references:
  - type: data
    title: "Bangladesh to China Study Data & Cost Benchmark Report (Live JSON API)"
    url: "${SITE_URL}/china-study-report.json"
  - type: data
    title: "Bangladesh Study Abroad Market Benchmark & 32-Country Matrix 2027 (Live JSON API)"
    url: "${SITE_URL}/bangladesh-study-abroad-market.json"
`;
fs.writeFileSync(path.join(OUT_DIR, 'CITATION.cff'), citationCff, 'utf8');

// 10. .zenodo.json
const zenodoJson = {
  title: 'Bangladesh Study Abroad, Scholarship & China University Cost Benchmark Dataset (2027)',
  upload_type: 'dataset',
  access_right: 'open',
  license: 'CC-BY-4.0',
  version: VERSION,
  publication_date: RELEASE_DATE,
  language: 'eng',
  creators: [
    { name: 'Al Rakib, Abdullah', affiliation: 'EduExpress International (Dhaka, Bangladesh)' },
    {
      name: 'EduExpress International Editorial & Verification Desk',
      affiliation: 'EduExpress International (Dhaka, Bangladesh)',
    },
  ],
  description:
    `<p>An open, evidence-verified higher-education cost, scholarship, and visa benchmark dataset compiled for Bangladeshi students, parents, journalists, and education researchers by <strong>EduExpress International</strong> (<a href="${SITE_URL}">${SITE_URL}</a>, Dhanmondi, Dhaka).</p>` +
    `<ul>` +
    `<li><strong>${universities.length} verified active institutions</strong> (${chinaCount} Chinese universities across ${cityCount} cities + ${malaysiaCount} Malaysian universities).</li>` +
    `<li><strong>${programs.length} structured degree &amp; language programs</strong> with explicit currency tuition.</li>` +
    `<li><strong>${fees.length} itemized non-tuition fee records</strong> separating tuition from dormitory, medical insurance, residence permit, health check, and EMGS costs.</li>` +
    `<li><strong>${scholarships.length} structured university scholarship tracks</strong> with parsed tuition waiver type, dorm/insurance waivers, and separate living stipends.</li>` +
    `<li><strong>${dest32Rows.length}-country global Bangladesh outbound matrix</strong> (12 EduExpress active destinations + 20 top OECD/regional benchmark destinations) documenting 2026/27 statutory visa solvency rules, Bangladesh Bank AD Student File rules, and <strong>${countryScholRows.length} Bangladesh-eligible flagship scholarships</strong>.</li>` +
    `</ul>` +
    `<p>Follows EduExpress's 2-Tier Hybrid Source Governance: high-level regulatory authorities and root institutional domains are cited openly, while deep brochure/policy tracking URLs are monitored privately to prevent link rot and detect updates.</p>`,
  keywords: [
    'Bangladesh higher education',
    'Study in China from Bangladesh',
    'Study abroad scholarships Bangladesh',
    'China university tuition benchmark',
    'CSC Scholarship',
    'International student visa financial proof',
    'Open education data',
    'EduExpress International',
  ],
  related_identifiers: [
    { identifier: `${SITE_URL}/press`, relation: 'isSupplementTo', resource_type: 'publication-report', scheme: 'url' },
    { identifier: `${SITE_URL}/china-study-report-bangladesh`, relation: 'isSupplementTo', resource_type: 'publication-report', scheme: 'url' },
    { identifier: `${SITE_URL}/bangladesh-study-abroad-market`, relation: 'isSupplementTo', resource_type: 'publication-report', scheme: 'url' },
    { identifier: `${SITE_URL}/china-study-report.json`, relation: 'isDerivedFrom', resource_type: 'dataset', scheme: 'url' },
    { identifier: `${SITE_URL}/bangladesh-study-abroad-market.json`, relation: 'isDerivedFrom', resource_type: 'dataset', scheme: 'url' },
  ],
  notes:
    'Tuition quartiles include strictly explicit single-year CNY program rows; non-tuition arrival fees and monthly scholarship stipends are separated from tuition and never converted using synthetic exchange rates. Licensed under CC BY 4.0.',
};
fs.writeFileSync(path.join(OUT_DIR, '.zenodo.json'), `${JSON.stringify(zenodoJson, null, 2)}\n`, 'utf8');

// 11. dataset-metadata.json (Kaggle)
const resources = [
  {
    path: 'data/universities_verified.csv',
    description: `${universities.length} verified active universities (China & Malaysia) with CSC/English/Chinese-language flags, rankings, root official domains, and record counts.`,
  },
  {
    path: 'data/programs_verified.csv',
    description: `${programs.length} structured degree and language programs with explicit tuition, duration, language, and verification dates.`,
  },
  {
    path: 'data/scholarships_verified.csv',
    description: `${scholarships.length} structured university scholarship tracks with parsed tuition waiver type/value, dorm/insurance waivers, and monthly stipends.`,
  },
  {
    path: 'data/itemized_fees_verified.csv',
    description: `${fees.length} non-tuition and institutional fee rows (dorms, insurance, residence permit, EMGS, application fees).`,
  },
  {
    path: 'data/destinations_matrix_32_countries.csv',
    description: `${dest32Rows.length}-country global Bangladesh outbound matrix covering tuition, living costs, 2026/27 statutory visa solvency thresholds, AD Bank Student File rules, and work rights.`,
  },
  {
    path: 'data/country_scholarships_verified.csv',
    description: `${countryScholRows.length} Bangladesh-eligible flagship government, regional, and institutional scholarships across ${dest32Rows.length} global destinations.`,
  },
  {
    path: 'data/destinations_matrix_12_countries.csv',
    description: '12-destination active EduExpress service portfolio matrix (backward-compatible view).',
  },
  {
    path: 'data/china_study_report_2027.json',
    description: 'Snapshot of EduExpress China study cost benchmark JSON API.',
  },
  {
    path: 'data/bangladesh_study_abroad_market_2027.json',
    description: 'Snapshot of EduExpress Bangladesh 2027 outbound study abroad market & 32-country benchmark JSON API.',
  },
];

const kaggleMetadata = {
  title: 'Bangladesh Study Abroad, Scholarship & China Cost Benchmark 2027',
  id: KAGGLE_DATASET_ID,
  subtitle: `${universities.length} unis (${chinaCscCount}/306 CSC China), ${programs.length.toLocaleString()} programs, ${(scholarships.length + countryScholRows.length).toLocaleString()} scholarships, ${dest32Rows.length} countries`.slice(0, 80),
  description: `# Bangladesh Study Abroad, Scholarship & China University Cost Benchmark Dataset (2027)\n\nOpen CC BY 4.0 higher-education benchmark published by **EduExpress International** (${SITE_URL}/press, Dhanmondi, Dhaka, Bangladesh).\n\n## Highlights\n- **${universities.length} verified active universities** (${chinaCount} in China across ${cityCount} cities, ${malaysiaCount} in Malaysia)\n- **${programs.length} structured degree & language programs** with explicit tuition and medium of instruction\n- **${scholarships.length} structured university scholarship rows** with parsed waiver types, dorm/insurance waivers, and separate stipends\n- **${fees.length} itemized non-tuition fee rows** kept strictly separate from tuition\n- **${dest32Rows.length}-country global Bangladesh outbound matrix** (12 active EduExpress countries + 20 top OECD/regional benchmark destinations) with 2026/27 statutory visa solvency rules\n- **${countryScholRows.length} Bangladesh-eligible flagship national & institutional scholarships** across all ${dest32Rows.length} countries`,
  isPrivate: false,
  licenses: [{ name: 'CC-BY-4.0' }],
  keywords: [
    'education',
    'higher education',
    'bangladesh',
    'china',
    'scholarships',
    'universities',
    'tuition',
    'study abroad',
  ],
  resources,
};
fs.writeFileSync(path.join(OUT_DIR, 'dataset-metadata.json'), `${JSON.stringify(kaggleMetadata, null, 2)}\n`, 'utf8');

// 12. datapackage.json (Frictionless Data Package)
const datapackage = {
  profile: 'tabular-data-package',
  name: REPO_NAME,
  title: 'Bangladesh Study Abroad, Scholarship & China University Cost Benchmark Dataset (2027)',
  version: VERSION,
  homepage: `${SITE_URL}/press`,
  licenses: [
    {
      name: 'CC-BY-4.0',
      title: 'Creative Commons Attribution 4.0 International',
      path: 'https://creativecommons.org/licenses/by/4.0/',
    },
  ],
  sources: [
    { title: 'EduExpress China Study Data & Cost Benchmark API', path: `${SITE_URL}/china-study-report.json` },
    { title: 'EduExpress Bangladesh Study Abroad Market 2027 API', path: `${SITE_URL}/bangladesh-study-abroad-market.json` },
    { title: 'EduExpress Verification Standard', path: `${SITE_URL}/how-we-verify-universities` },
  ],
  contributors: [
    { title: 'Abdullah Al Rakib', role: 'author', organization: 'EduExpress International' },
    { title: 'EduExpress International', role: 'publisher', path: SITE_URL },
  ],
  resources: resources.map((r) => ({
    name: path.basename(r.path, path.extname(r.path)),
    path: r.path,
    format: path.extname(r.path).slice(1),
    mediatype: r.path.endsWith('.csv') ? 'text/csv' : 'application/json',
    description: r.description,
  })),
};
fs.writeFileSync(path.join(OUT_DIR, 'datapackage.json'), `${JSON.stringify(datapackage, null, 2)}\n`, 'utf8');

// 13. README.md
const feeTableRows = feeB
  .map((f) => `| ${f.label} | ${f.sampleCount} | CNY ${f.min.toLocaleString()} | **CNY ${f.median.toLocaleString()}** | CNY ${f.max.toLocaleString()} |`)
  .join('\n');

const destTableRows = dest32Rows
  .map((d) => `| ${d.country} | ${d.region} | ${d.service_status} | ${d.indicative_tuition} | ${d.statutory_visa_financial_proof} |`)
  .join('\n');

const tuitionBlock = td
  ? `| Program Category | Explicit Rows | Min | Q1 (25th) | Median (50th) | Q3 (75th) | Max |
|---|---:|---:|---:|---:|---:|---:|
| **All Explicit China Programs** | ${td.allExplicit.count} | CNY ${td.allExplicit.min.toLocaleString()} | CNY ${td.allExplicit.q1.toLocaleString()} | **CNY ${td.allExplicit.median.toLocaleString()}** | CNY ${td.allExplicit.q3.toLocaleString()} | CNY ${td.allExplicit.max.toLocaleString()} |
| **English-Taught Bachelor** | ${td.bachelorEnglish.count} | CNY ${td.bachelorEnglish.min.toLocaleString()} | CNY ${td.bachelorEnglish.q1.toLocaleString()} | **CNY ${td.bachelorEnglish.median.toLocaleString()}** | CNY ${td.bachelorEnglish.q3.toLocaleString()} | CNY ${td.bachelorEnglish.max.toLocaleString()} |
| **Chinese-Taught Bachelor** | ${td.bachelorChinese.count} | CNY ${td.bachelorChinese.min.toLocaleString()} | CNY ${td.bachelorChinese.q1.toLocaleString()} | **CNY ${td.bachelorChinese.median.toLocaleString()}** | CNY ${td.bachelorChinese.q3.toLocaleString()} | CNY ${td.bachelorChinese.max.toLocaleString()} |
| **Master's Programs** | ${td.master.count} | CNY ${td.master.min.toLocaleString()} | CNY ${td.master.q1.toLocaleString()} | **CNY ${td.master.median.toLocaleString()}** | CNY ${td.master.q3.toLocaleString()} | CNY ${td.master.max.toLocaleString()} |
| **PhD Programs** | ${td.phd.count} | CNY ${td.phd.min.toLocaleString()} | CNY ${td.phd.q1.toLocaleString()} | **CNY ${td.phd.median.toLocaleString()}** | CNY ${td.phd.q3.toLocaleString()} | CNY ${td.phd.max.toLocaleString()} |`
  : '_Run with live JSON API access to refresh quartile summary._';

const readme = `# Bangladesh Study Abroad, Scholarship & China University Cost Benchmark Dataset (2027)

[![DOI](https://zenodo.org/badge/DOI/${OPEN_DATA_REPOSITORIES.zenodoDoi}.svg)](${OPEN_DATA_REPOSITORIES.zenodoDoiUrl})
[![Kaggle Dataset](https://img.shields.io/badge/Kaggle-Public_Dataset-20beff.svg)](${OPEN_DATA_REPOSITORIES.kaggleUrl})
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Verified Universities](https://img.shields.io/badge/Verified_Universities-${universities.length}-0f766e.svg)](${SITE_URL}/universities)
[![CSC China Coverage](https://img.shields.io/badge/China_CSC_Universities-${chinaCscCount}%2F306-15803d.svg)](${SITE_URL}/csc-scholarship-bangladesh)
[![Programs](https://img.shields.io/badge/Verified_Programs-${programs.length}-1d4ed8.svg)](${SITE_URL}/china-study-report-bangladesh)
[![Global Destinations](https://img.shields.io/badge/Global_Destinations-${dest32Rows.length}-0369a1.svg)](${SITE_URL}/bangladesh-study-abroad-market)
[![Scholarships](https://img.shields.io/badge/Scholarships-${scholarships.length + countryScholRows.length}-b45309.svg)](${SITE_URL}/scholarships)

An open, zero-signup, machine-readable dataset of **${universities.length} verified active universities** (**${chinaCount} in China** across ${cityCount} cities — including **${chinaCscCount}/306 CSC-designated Chinese universities**, ${chinaEngUniCount} offering English-taught tracks, and ${chinaLangUniCount} offering Non-Degree Chinese Language programs — plus **${malaysiaCount} in Malaysia**), **${programs.length} structured degree and language programs**, **${fees.length} itemized non-tuition fee rows**, **${scholarships.length} structured university scholarship tracks**, a **${dest32Rows.length}-country global Bangladesh outbound cost & visa matrix**, and **${countryScholRows.length} Bangladesh-eligible flagship national scholarships** — published under **CC BY 4.0** by **[EduExpress International](${SITE_URL})** (Dhanmondi, Dhaka, Bangladesh).

> **Canonical Sources & Permanent Mirrors**
> - **Interactive Cost & Scholarship Calculator:** [${SITE_URL}/compare-costs](${SITE_URL}/compare-costs) ([Embeddable Widget](${SITE_URL}/embed/cost-calculator))
> - **China Study Data & Cost Benchmark Report:** [${SITE_URL}/china-study-report-bangladesh](${SITE_URL}/china-study-report-bangladesh) ([Live JSON](${SITE_URL}/china-study-report.json))
> - **Bangladesh Study Abroad Market 2027 Report (EN / বাংলা):** [${SITE_URL}/bangladesh-study-abroad-market](${SITE_URL}/bangladesh-study-abroad-market) · [বাংলা সংস্করণ](${SITE_URL}/bn/bangladesh-study-abroad-market) ([Live JSON](${SITE_URL}/bangladesh-study-abroad-market.json))
> - **Verification & Evidence Standard:** [${SITE_URL}/how-we-verify-universities](${SITE_URL}/how-we-verify-universities)
> - **Permanent Academic Archive (Zenodo Version DOI):** [${OPEN_DATA_REPOSITORIES.zenodoDoi}](${OPEN_DATA_REPOSITORIES.zenodoDoiUrl}) ([Record](${OPEN_DATA_REPOSITORIES.zenodoRecordUrl})) · **Concept DOI (all versions):** [${OPEN_DATA_REPOSITORIES.zenodoConceptDoi}](${OPEN_DATA_REPOSITORIES.zenodoConceptDoiUrl})
> - **Kaggle Interactive Dataset:** [Bangladesh Study Abroad China Cost Benchmark 2027](${OPEN_DATA_REPOSITORIES.kaggleUrl})

---

## 1. Key Benchmark Snapshot (${RELEASE_DATE} · v${VERSION})

- **Catalog Coverage:** **${universities.length} verified active universities** (${chinaCount} in China across ${cityCount} cities including **${chinaCscCount}/306 CSC-designated universities**; ${malaysiaCount} in Malaysia).
- **China Language & English Access:** **${chinaEngUniCount}** Chinese universities with English-taught programs and **${chinaLangUniCount}** with Non-Degree Chinese Language tracks.
- **Global Country Coverage:** **${dest32Rows.length} destinations** (12 EduExpress Active + 20 Global Benchmark Reference destinations where Bangladeshi students go) with 2026/27 statutory visa financial proof thresholds and **${countryScholRows.length}** flagship scholarships.
- **2-Tier Hybrid Source Governance:** High-level regulatory authorities and root institutional domains are cited openly, while deep brochure/policy tracking URLs are monitored privately to prevent dead links and detect updates automatically.

### Explicit Single-Year China Tuition Quartiles (CNY)

${tuitionBlock}

${feeTableRows ? `### Separated Non-Tuition Arrival & Living Fee Benchmarks (China)\n\n| Fee Category | Sample Rows | Min | Median | Max |\n|---|---:|---:|---:|---:|\n${feeTableRows}\n` : ''}
### ${dest32Rows.length}-Country Global Outbound Benchmark Matrix (2026/27)

| Country | Region | Scope | Indicative Tuition | Statutory Visa Financial Proof |
|---|---|---|---|---|
${destTableRows}

---

## 2. Dataset Files & Schema

| File | Rows | Description |
|---|---:|---|
| [\`data/universities_verified.csv\`](./data/universities_verified.csv) | ${uniRows.length} | Verified active universities (China & Malaysia) with CSC/English/Chinese-language flags, root official domain, rankings, recognition authority, and record counts. |
| [\`data/programs_verified.csv\`](./data/programs_verified.csv) | ${progRows.length} | Structured degree and language programs with level, subject, language, duration, intakes, and explicit tuition. |
| [\`data/scholarships_verified.csv\`](./data/scholarships_verified.csv) | ${scholRows.length} | Structured university scholarship tracks with parsed tuition waiver type/value, accommodation/insurance waivers, and separate living stipends. |
| [\`data/itemized_fees_verified.csv\`](./data/itemized_fees_verified.csv) | ${feeRows.length} | Non-tuition fees (dormitory, medical insurance, residence permit, health check, EMGS Student Pass, application fees). |
| [\`data/destinations_matrix_32_countries.csv\`](./data/destinations_matrix_32_countries.csv) | ${dest32Rows.length} | Full 32-country outbound Bangladesh matrix with separated tuition, monthly living, 2026/27 statutory visa solvency rules, BD Bank Student File rules, work rights, and scholarships. |
| [\`data/country_scholarships_verified.csv\`](./data/country_scholarships_verified.csv) | ${countryScholRows.length} | Normalized table of Bangladesh-eligible flagship government, regional, and institutional scholarships across all 32 destinations. |
| [\`data/destinations_matrix_12_countries.csv\`](./data/destinations_matrix_12_countries.csv) | ${dest12Rows.length} | Backward-compatible 12-destination active EduExpress service portfolio matrix. |
| [\`data/china_study_report_2027.json\`](./data/china_study_report_2027.json) | JSON | Snapshot of [\`${SITE_URL}/china-study-report.json\`](${SITE_URL}/china-study-report.json). |
| [\`data/bangladesh_study_abroad_market_2027.json\`](./data/bangladesh_study_abroad_market_2027.json) | JSON | Snapshot of [\`${SITE_URL}/bangladesh-study-abroad-market.json\`](${SITE_URL}/bangladesh-study-abroad-market.json). |

---

## 3. Methodology & Verification Guardrails

1. **Zero Blended Tuition + Living Averages:** Institutional tuition is strictly separated from dormitory, health insurance, residence permit, EMGS, medical, and visa costs.
2. **Separate Scholarship Accounting:** Gross published tuition is always preserved; only explicitly covered tuition/dorm/insurance items are waived, and monthly stipends are reported separately without being deducted from upfront arrival cash fees.
3. **2-Tier Hybrid Source Privacy:** High-level national authorities and root university domains are published openly, while deep brochure/fee tracking URLs remain private inside EduExpress's automated change-monitoring vault.
4. **Zero Synthetic Exchange Rates or Guarantees:** Fee rows retain published local currencies without synthetic BDT rates, and zero admission, scholarship, or visa guarantees are included.
5. **Zero Personal Data:** Contains strictly public institutional catalog and policy benchmark records — zero PII or private student files.

Full methodology: [${SITE_URL}/how-we-verify-universities](${SITE_URL}/how-we-verify-universities)
`;
fs.writeFileSync(path.join(OUT_DIR, 'README.md'), readme, 'utf8');

// 14. Build clean ZIP archives for Zenodo and Kaggle
const zenodoZip = path.join(DIST_DIR, 'bangladesh-study-abroad-dataset-2027-zenodo.zip');
const kaggleZip = path.join(DIST_DIR, 'bangladesh-study-abroad-dataset-2027-kaggle.zip');
fs.rmSync(zenodoZip, { force: true });
fs.rmSync(kaggleZip, { force: true });

execSync(
  `cd "${OUT_DIR}" && zip -rq "${zenodoZip}" README.md LICENSE CITATION.cff .zenodo.json datapackage.json data/`,
);
execSync(
  `cd "${OUT_DIR}" && zip -rq "${kaggleZip}" dataset-metadata.json README.md LICENSE data/`,
);

console.log('\n=== OPEN DATA PACKAGE GENERATED SUCCESSFULLY (2-TIER HYBRID MODEL) ===');
console.log(`Directory: ${OUT_DIR}`);
console.log(`- universities_verified.csv: ${uniRows.length} rows`);
console.log(`- programs_verified.csv: ${progRows.length} rows`);
console.log(`- scholarships_verified.csv: ${scholRows.length} rows`);
console.log(`- itemized_fees_verified.csv: ${feeRows.length} rows`);
console.log(`- destinations_matrix_32_countries.csv: ${dest32Rows.length} rows`);
console.log(`- country_scholarships_verified.csv: ${countryScholRows.length} rows`);
console.log(`- destinations_matrix_12_countries.csv: ${dest12Rows.length} rows`);
console.log(`- Zenodo ZIP: ${zenodoZip} (${(fs.statSync(zenodoZip).size / 1024).toFixed(1)} KB)`);
console.log(`- Kaggle ZIP: ${kaggleZip} (${(fs.statSync(kaggleZip).size / 1024).toFixed(1)} KB)`);
