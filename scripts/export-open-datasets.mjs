#!/usr/bin/env node
/**
 * Export verified EduExpress International open datasets (CC BY 4.0)
 * for GitHub, Zenodo (DOI), Kaggle, and Frictionless Data Packages.
 *
 * Strictly exports public, verified catalog data (zero PII, zero student records,
 * zero internal CRM/admin data) sourced from prisma/data/edxbd.db and the live
 * JSON APIs on https://eduexpressint.com.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';

const ROOT = process.cwd();
const DB_PATH = path.join(ROOT, 'prisma/data/edxbd.db');
const OUT_DIR = path.join(ROOT, 'open-data/bangladesh-study-abroad-dataset');
const DATA_DIR = path.join(OUT_DIR, 'data');
const DIST_DIR = path.join(ROOT, 'open-data/dist');

const SITE_URL = 'https://eduexpressint.com';
const GITHUB_USER = 'rakibnuist';
const REPO_NAME = 'bangladesh-study-abroad-dataset';
const REPO_URL = `https://github.com/${GITHUB_USER}/${REPO_NAME}`;
const VERSION = '2026.11.21';
const RELEASE_DATE = '2026-11-21';

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(DIST_DIR, { recursive: true });

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const str = String(value).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
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

function fetchJson(url) {
  const raw = execSync(`curl -4 -fsSL "${url}"`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  return JSON.parse(raw);
}

console.log('Fetching live verified JSON benchmarks from https://eduexpressint.com...');
const chinaReport = fetchJson(`${SITE_URL}/china-study-report.json`);
const marketReport = fetchJson(`${SITE_URL}/bangladesh-study-abroad-market.json`);

fs.writeFileSync(
  path.join(DATA_DIR, 'china_study_report_2027.json'),
  `${JSON.stringify(chinaReport, null, 2)}\n`,
  'utf8',
);
fs.writeFileSync(
  path.join(DATA_DIR, 'bangladesh_study_abroad_market_2027.json'),
  `${JSON.stringify(marketReport, null, 2)}\n`,
  'utf8',
);

console.log(`Reading verified catalog from ${DB_PATH}...`);
const db = new DatabaseSync(DB_PATH, { readOnly: true });

const universities = db
  .prepare(
    `SELECT id, slug, name, country, city, location, intake, degree, taught,
            rankingWorld, rankingNational, rankingCountry, majors, tuition,
            deadlineApplication, officialUrl, relationshipType,
            recognitionAuthority, recognitionSourceUrl, sourceUrls,
            lastVerifiedAt, verificationExpiresAt, verificationStatus
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
            eligibility, sourceUrl, status
     FROM Program
     ORDER BY universityId ASC, level ASC, name ASC`,
  )
  .all()
  .filter((p) => uniById.has(p.universityId));

const scholarships = db
  .prepare(
    `SELECT id, universityId, title, type, amount, coverage, condition,
            renewal, deadline, eligiblePrograms, details, sourceUrl, status
     FROM Scholarship
     ORDER BY universityId ASC, title ASC`,
  )
  .all()
  .filter((s) => uniById.has(s.universityId));

const fees = db
  .prepare(
    `SELECT id, universityId, item, cost, recipient, refundable, validFor, notes, sourceUrl
     FROM Fee
     ORDER BY universityId ASC, item ASC`,
  )
  .all()
  .filter((f) => uniById.has(f.universityId));

db.close();

// Count child rows per university
const progCount = new Map();
const scholCount = new Map();
const feeCount = new Map();
for (const p of programs) progCount.set(p.universityId, (progCount.get(p.universityId) || 0) + 1);
for (const s of scholarships) scholCount.set(s.universityId, (scholCount.get(s.universityId) || 0) + 1);
for (const f of fees) feeCount.set(f.universityId, (feeCount.get(f.universityId) || 0) + 1);

// 1. universities_verified.csv
const uniRows = universities.map((u) => ({
  slug: u.slug,
  name: u.name,
  country: u.country,
  city: u.city || '',
  location: u.location || '',
  official_url: u.officialUrl || '',
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
  recognition_source_url: u.recognitionSourceUrl || '',
  relationship_type: u.relationshipType || 'public_direct_application',
  verification_status: u.verificationStatus,
  last_verified_date: formatDateIso(u.lastVerifiedAt),
  verification_expires_date: formatDateIso(u.verificationExpiresAt),
  program_count: progCount.get(u.id) || 0,
  scholarship_count: scholCount.get(u.id) || 0,
  itemized_fee_count: feeCount.get(u.id) || 0,
  primary_source_urls: parseJsonList(u.sourceUrls).join(' | '),
}));

writeCsv(
  path.join(DATA_DIR, 'universities_verified.csv'),
  Object.keys(uniRows[0]),
  uniRows,
);

// 2. programs_verified.csv
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
    official_source_url: p.sourceUrl || u.officialUrl || '',
    eduexpress_profile_url: `${SITE_URL}/universities/${u.slug}`,
  };
});

writeCsv(
  path.join(DATA_DIR, 'programs_verified.csv'),
  Object.keys(progRows[0]),
  progRows,
);

// 3. scholarships_verified.csv
const scholRows = scholarships.map((s) => {
  const u = uniById.get(s.universityId);
  return {
    university_slug: u.slug,
    university_name: u.name,
    country: u.country,
    scholarship_title: s.title || '',
    scholarship_type: s.type || '',
    amount: s.amount || '',
    coverage: s.coverage || '',
    condition: s.condition || '',
    renewal: s.renewal || '',
    deadline: s.deadline || '',
    eligible_programs: parseJsonList(s.eligiblePrograms).join(' ; '),
    details: parseJsonList(s.details).join(' ; '),
    status: s.status || 'active',
    official_source_url: s.sourceUrl || u.officialUrl || '',
    eduexpress_profile_url: `${SITE_URL}/universities/${u.slug}`,
  };
});

writeCsv(
  path.join(DATA_DIR, 'scholarships_verified.csv'),
  Object.keys(scholRows[0]),
  scholRows,
);

// 4. itemized_fees_verified.csv
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
    official_source_url: f.sourceUrl || u.officialUrl || '',
    eduexpress_profile_url: `${SITE_URL}/universities/${u.slug}/clear-cost`,
  };
});

writeCsv(
  path.join(DATA_DIR, 'itemized_fees_verified.csv'),
  Object.keys(feeRows[0]),
  feeRows,
);

// 5. destinations_matrix_12_countries.csv
const destRows = (marketReport.snapshot?.destinations || []).map((d) => ({
  slug: d.slug,
  country: d.name,
  tier: d.tier,
  intakes: d.intakes,
  indicative_tuition: d.indicativeTuition,
  indicative_living_monthly: d.indicativeLiving,
  student_file_rule: d.studentFileRule,
  eduexpress_service_fee_model: d.eduExpressFeeModel,
  key_verification_guardrail: d.keyGuardrail,
  guide_url: `${SITE_URL}${d.href}`,
  official_sources: (d.officialSources || []).map((s) => `${s.label} (${s.href})`).join(' | '),
}));

writeCsv(
  path.join(DATA_DIR, 'destinations_matrix_12_countries.csv'),
  Object.keys(destRows[0]),
  destRows,
);

const chinaCount = universities.filter((u) => u.country === 'China').length;
const malaysiaCount = universities.filter((u) => u.country === 'Malaysia').length;
const td = chinaReport.report.tuitionDistributions;
const feeB = chinaReport.report.feeBenchmarks;

// 6. LICENSE (CC BY 4.0)
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

// 7. CITATION.cff (GitHub native "Cite this repository" + Zenodo)
const citationCff = `cff-version: 1.2.0
title: "Bangladesh Study Abroad & China University Cost Benchmark Dataset (2027)"
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
date-released: "${RELEASE_DATE}"
license: "CC-BY-4.0"
repository-code: "${REPO_URL}"
url: "${SITE_URL}/press"
abstract: >-
  Open, CC BY 4.0 dataset of ${universities.length} verified active universities
  (${chinaCount} in China across ${chinaReport.report.cityCount} cities and ${malaysiaCount} in Malaysia),
  ${programs.length} degree and language programs, ${fees.length} itemized non-tuition fee rows,
  ${scholarships.length} scholarship tracks, and a 12-destination Bangladesh study abroad market
  comparison matrix covering Bangladesh Bank AD Student File remittance rules, CSC/CSCA criteria,
  EMGS Malaysia costs, and explicit single-year CNY tuition quartiles.
keywords:
  - bangladesh-higher-education
  - study-in-china
  - study-in-malaysia
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
    title: "Bangladesh Study Abroad Market Benchmark & Destination Matrix 2027 (Live JSON API)"
    url: "${SITE_URL}/bangladesh-study-abroad-market.json"
`;
fs.writeFileSync(path.join(OUT_DIR, 'CITATION.cff'), citationCff, 'utf8');

// 8. .zenodo.json (Auto-parsed by Zenodo on GitHub Release / upload)
const zenodoJson = {
  title: 'Bangladesh Study Abroad & China University Cost Benchmark Dataset (2027)',
  upload_type: 'dataset',
  access_right: 'open',
  license: 'CC-BY-4.0',
  version: VERSION,
  publication_date: RELEASE_DATE,
  language: 'eng',
  creators: [
    {
      name: 'Al Rakib, Abdullah',
      affiliation: 'EduExpress International (Dhaka, Bangladesh)',
    },
    {
      name: 'EduExpress International Editorial & Verification Desk',
      affiliation: 'EduExpress International (Dhaka, Bangladesh)',
    },
  ],
  description:
    `<p>An open, evidence-verified higher-education cost and admissions dataset compiled for Bangladeshi students, parents, journalists, and education researchers by <strong>EduExpress International</strong> (<a href="${SITE_URL}">${SITE_URL}</a>, Dhanmondi, Dhaka).</p>` +
    `<ul>` +
    `<li><strong>${universities.length} verified active institutions</strong> (${chinaCount} Chinese universities across ${chinaReport.report.cityCount} cities + ${malaysiaCount} Malaysian universities; 0 under verification).</li>` +
    `<li><strong>${programs.length} structured programs</strong> (${chinaReport.report.programCounts.bachelorEnglish} English-taught China Bachelor programs, ${chinaReport.report.programCounts.master} Master's, ${chinaReport.report.programCounts.phd} PhD).</li>` +
    `<li><strong>${fees.length} itemized non-tuition fee records</strong> separating university tuition from dormitory, medical insurance, residence permit, health check, and EMGS processing costs.</li>` +
    `<li><strong>${scholarships.length} scholarship tracks</strong> across CSC, Chinese provincial/city governments, Belt and Road, CLEC, and institutional awards.</li>` +
    `<li><strong>12-destination Bangladesh outbound comparison matrix</strong> documenting Bangladesh Bank AD Student File remittance rules vs. China on-campus/CSC payment pathways.</li>` +
    `</ul>` +
    `<p>Live machine-readable endpoints and press briefs are maintained at <a href="${SITE_URL}/press">${SITE_URL}/press</a>. EduExpress International (Dhaka, Bangladesh) is an independent entity unaffiliated with UK-registered EduExpress Ltd.</p>`,
  keywords: [
    'Bangladesh higher education',
    'Study in China from Bangladesh',
    'China university tuition benchmark',
    'CSC Scholarship',
    'Study in Malaysia from Bangladesh',
    'International student costs',
    'Open education data',
    'EduExpress International',
  ],
  related_identifiers: [
    {
      identifier: `${SITE_URL}/press`,
      relation: 'isSupplementTo',
      resource_type: 'publication-report',
      scheme: 'url',
    },
    {
      identifier: `${SITE_URL}/china-study-report-bangladesh`,
      relation: 'isSupplementTo',
      resource_type: 'publication-report',
      scheme: 'url',
    },
    {
      identifier: `${SITE_URL}/bangladesh-study-abroad-market`,
      relation: 'isSupplementTo',
      resource_type: 'publication-report',
      scheme: 'url',
    },
    {
      identifier: `${SITE_URL}/china-study-report.json`,
      relation: 'isDerivedFrom',
      resource_type: 'dataset',
      scheme: 'url',
    },
    {
      identifier: `${SITE_URL}/bangladesh-study-abroad-market.json`,
      relation: 'isDerivedFrom',
      resource_type: 'dataset',
      scheme: 'url',
    },
  ],
  notes:
    'Tuition quartiles include strictly explicit single-year CNY program rows; non-tuition arrival fees are separated from tuition and never converted using synthetic exchange rates. Licensed under CC BY 4.0.',
};
fs.writeFileSync(path.join(OUT_DIR, '.zenodo.json'), `${JSON.stringify(zenodoJson, null, 2)}\n`, 'utf8');

// 9. dataset-metadata.json (Official Kaggle Dataset API metadata)
const kaggleMetadata = {
  title: 'Bangladesh Study Abroad & China University Cost Benchmark 2027',
  id: `${GITHUB_USER}/bangladesh-study-abroad-cost-benchmark-2027`,
  subtitle: `${universities.length} verified universities, ${programs.length} programs, ${fees.length} itemized fee rows, ${scholarships.length} scholarships & 12-country matrix`,
  description: `# Bangladesh Study Abroad & China University Cost Benchmark Dataset (2027)\n\nOpen CC BY 4.0 higher-education benchmark published by **EduExpress International** (${SITE_URL}/press, Dhanmondi, Dhaka, Bangladesh).\n\n## Highlights\n- **${universities.length} verified active universities** (${chinaCount} in China across ${chinaReport.report.cityCount} cities, ${malaysiaCount} in Malaysia; 100% mapped to official institutional domains)\n- **${programs.length} structured programs** with degree level, medium of instruction, duration, intakes, explicit tuition, and official source URLs\n- **${fees.length} itemized non-tuition fee rows** (dormitory, medical insurance, residence permit, EMGS Student Pass, application fees) kept strictly separate from tuition\n- **${scholarships.length} scholarship tracks** (CSC, Provincial/City Government, University Merit, Belt & Road, CLEC)\n- **12-destination Bangladesh outbound matrix** comparing indicative tuition, monthly living costs, and Bangladesh Bank AD Student File remittance requirements\n\n## Live Reports & APIs\n- Press Room & Media Briefs: ${SITE_URL}/press\n- China Study Cost Report: ${SITE_URL}/china-study-report-bangladesh (Live JSON: ${SITE_URL}/china-study-report.json)\n- Bangladesh Market Benchmark 2027: ${SITE_URL}/bangladesh-study-abroad-market (Live JSON: ${SITE_URL}/bangladesh-study-abroad-market.json)\n- Verification Standard: ${SITE_URL}/how-we-verify-universities`,
  isPrivate: false,
  licenses: [{ name: 'CC-BY-4.0' }],
  keywords: [
    'education',
    'higher education',
    'bangladesh',
    'china',
    'malaysia',
    'universities',
    'tuition',
    'scholarships',
  ],
  resources: [
    {
      path: 'data/universities_verified.csv',
      description: `${universities.length} verified active universities across China and Malaysia with official URLs, rankings, recognition authorities, and child record counts.`,
    },
    {
      path: 'data/programs_verified.csv',
      description: `${programs.length} structured degree and language programs with explicit tuition, duration, language, and official source links.`,
    },
    {
      path: 'data/scholarships_verified.csv',
      description: `${scholarships.length} verified scholarship tracks categorized by awarding body and eligibility.`,
    },
    {
      path: 'data/itemized_fees_verified.csv',
      description: `${fees.length} non-tuition and institutional fee rows (dorms, insurance, residence permit, EMGS, application fees).`,
    },
    {
      path: 'data/destinations_matrix_12_countries.csv',
      description: '12-destination Bangladesh study abroad comparison matrix covering tuition, living costs, Student File rules, and official regulatory links.',
    },
    {
      path: 'data/china_study_report_2027.json',
      description: 'Live snapshot of EduExpress China study cost benchmark JSON API.',
    },
    {
      path: 'data/bangladesh_study_abroad_market_2027.json',
      description: 'Live snapshot of EduExpress Bangladesh 2027 outbound study abroad market JSON API.',
    },
  ],
};
fs.writeFileSync(path.join(OUT_DIR, 'dataset-metadata.json'), `${JSON.stringify(kaggleMetadata, null, 2)}\n`, 'utf8');

// 10. datapackage.json (Frictionless Data Package spec)
const datapackage = {
  profile: 'tabular-data-package',
  name: REPO_NAME,
  title: 'Bangladesh Study Abroad & China University Cost Benchmark Dataset (2027)',
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
  resources: kaggleMetadata.resources.map((r) => ({
    name: path.basename(r.path, path.extname(r.path)),
    path: r.path,
    format: path.extname(r.path).slice(1),
    mediatype: r.path.endsWith('.csv') ? 'text/csv' : 'application/json',
    description: r.description,
  })),
};
fs.writeFileSync(path.join(OUT_DIR, 'datapackage.json'), `${JSON.stringify(datapackage, null, 2)}\n`, 'utf8');

// 11. README.md
const feeTableRows = feeB
  .map((f) => `| ${f.label} | ${f.sampleCount} | CNY ${f.min.toLocaleString()} | **CNY ${f.median.toLocaleString()}** | CNY ${f.max.toLocaleString()} |`)
  .join('\n');

const destTableRows = destRows
  .map((d) => `| [${d.country}](${d.guide_url}) | ${d.tier} | ${d.indicative_tuition} | ${d.indicative_living_monthly} | ${d.student_file_rule} |`)
  .join('\n');

const readme = `# Bangladesh Study Abroad & China University Cost Benchmark Dataset (2027)

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Verified Universities](https://img.shields.io/badge/Verified_Universities-${universities.length}-0f766e.svg)](${SITE_URL}/universities)
[![Programs](https://img.shields.io/badge/Verified_Programs-${programs.length}-1d4ed8.svg)](${SITE_URL}/china-study-report-bangladesh)
[![Scholarships](https://img.shields.io/badge/Scholarships-${scholarships.length}-b45309.svg)](${SITE_URL}/csc-scholarship-bangladesh)
[![Live JSON API](https://img.shields.io/badge/Live_API-JSON-111827.svg)](${SITE_URL}/press)

An open, zero-signup, machine-readable dataset of **${universities.length} verified active universities** (${chinaCount} in China across ${chinaReport.report.cityCount} cities and ${malaysiaCount} in Malaysia), **${programs.length} structured degree and language programs**, **${fees.length} itemized non-tuition fee rows**, **${scholarships.length} scholarship tracks**, and a **12-country Bangladesh study abroad market comparison matrix** — published under **CC BY 4.0** by **[EduExpress International](${SITE_URL})** (Dhanmondi, Dhaka, Bangladesh).

> **Live Interactive Reports & Press Room:**
> - **Media, Data & Research Press Room:** [${SITE_URL}/press](${SITE_URL}/press)
> - **China Study Data & Cost Benchmark Report:** [${SITE_URL}/china-study-report-bangladesh](${SITE_URL}/china-study-report-bangladesh) ([Live JSON](${SITE_URL}/china-study-report.json))
> - **Bangladesh Study Abroad Market 2027 Report (EN / বাংলা):** [${SITE_URL}/bangladesh-study-abroad-market](${SITE_URL}/bangladesh-study-abroad-market) · [বাংলা সংস্করণ](${SITE_URL}/bn/bangladesh-study-abroad-market) ([Live JSON](${SITE_URL}/bangladesh-study-abroad-market.json))
> - **Verification & Evidence Standard:** [${SITE_URL}/how-we-verify-universities](${SITE_URL}/how-we-verify-universities)

---

## 1. Key Findings & Live Benchmark Snapshot (${RELEASE_DATE})

- **Catalog Coverage:** **${universities.length} active verified universities** (\`0\` unverified, \`100%\` mapped to official institutional websites): **${chinaCount} in China** (${chinaReport.report.cityCount} cities) and **${malaysiaCount} in Malaysia**.
- **Explicit Single-Year China Tuition Quartiles** (computed strictly from explicit single-year CNY program records; non-tuition charges excluded and zero synthetic exchange rates applied):

| Program Category | Explicit Rows | Min | Q1 (25th) | Median (50th) | Q3 (75th) | Max |
|---|---:|---:|---:|---:|---:|---:|
| **All Explicit China Programs** | ${td.allExplicit.count} | CNY ${td.allExplicit.min.toLocaleString()} | CNY ${td.allExplicit.q1.toLocaleString()} | **CNY ${td.allExplicit.median.toLocaleString()}** | CNY ${td.allExplicit.q3.toLocaleString()} | CNY ${td.allExplicit.max.toLocaleString()} |
| **English-Taught Bachelor** | ${td.bachelorEnglish.count} | CNY ${td.bachelorEnglish.min.toLocaleString()} | CNY ${td.bachelorEnglish.q1.toLocaleString()} | **CNY ${td.bachelorEnglish.median.toLocaleString()}** | CNY ${td.bachelorEnglish.q3.toLocaleString()} | CNY ${td.bachelorEnglish.max.toLocaleString()} |
| **Chinese-Taught Bachelor** | ${td.bachelorChinese.count} | CNY ${td.bachelorChinese.min.toLocaleString()} | CNY ${td.bachelorChinese.q1.toLocaleString()} | **CNY ${td.bachelorChinese.median.toLocaleString()}** | CNY ${td.bachelorChinese.q3.toLocaleString()} | CNY ${td.bachelorChinese.max.toLocaleString()} |
| **Master's Programs** | ${td.master.count} | CNY ${td.master.min.toLocaleString()} | CNY ${td.master.q1.toLocaleString()} | **CNY ${td.master.median.toLocaleString()}** | CNY ${td.master.q3.toLocaleString()} | CNY ${td.master.max.toLocaleString()} |
| **PhD Programs** | ${td.phd.count} | CNY ${td.phd.min.toLocaleString()} | CNY ${td.phd.q1.toLocaleString()} | **CNY ${td.phd.median.toLocaleString()}** | CNY ${td.phd.q3.toLocaleString()} | CNY ${td.phd.max.toLocaleString()} |

- **Separated Non-Tuition Arrival & Living Fee Benchmarks (China):**

| Fee Category | Sample Rows | Min | Median | Max |
|---|---:|---:|---:|---:|
${feeTableRows}

- **12-Destination Bangladesh Study Abroad Matrix (2027):**

| Destination | Tier | Indicative Tuition | Indicative Living / Month | Bangladesh Bank Student File Rule |
|---|---|---|---|---|
${destTableRows}

---

## 2. Dataset Files & Schema

| File | Rows | Description |
|---|---:|---|
| [\`data/universities_verified.csv\`](./data/universities_verified.csv) | ${uniRows.length} | Verified active universities (China & Malaysia) with official URLs, EduExpress profile & ClearCost URLs, rankings, recognition authorities, verification dates, and record counts. |
| [\`data/programs_verified.csv\`](./data/programs_verified.csv) | ${progRows.length} | Structured degree and language programs with level, subject, language, duration, intakes, tuition, eligibility, and official source URLs. |
| [\`data/scholarships_verified.csv\`](./data/scholarships_verified.csv) | ${scholRows.length} | Scholarship tracks (CSC, Provincial/City Government, University Merit, Belt & Road, CLEC) with coverage, conditions, and eligible programs. |
| [\`data/itemized_fees_verified.csv\`](./data/itemized_fees_verified.csv) | ${feeRows.length} | Non-tuition fees (dormitory, medical insurance, residence permit, health check, EMGS Student Pass, application fees) with recipient and refundability notes. |
| [\`data/destinations_matrix_12_countries.csv\`](./data/destinations_matrix_12_countries.csv) | ${destRows.length} | 12-destination outbound Bangladesh matrix with tuition, living cost ranges, AD Bank Student File rules, and official ministry/embassy source links. |
| [\`data/china_study_report_2027.json\`](./data/china_study_report_2027.json) | JSON | Snapshot of [\`${SITE_URL}/china-study-report.json\`](${SITE_URL}/china-study-report.json). |
| [\`data/bangladesh_study_abroad_market_2027.json\`](./data/bangladesh_study_abroad_market_2027.json) | JSON | Snapshot of [\`${SITE_URL}/bangladesh-study-abroad-market.json\`](${SITE_URL}/bangladesh-study-abroad-market.json). |

---

## 3. Quick Start (Python & JavaScript)

### Python (\`pandas\`)
\`\`\`python
import pandas as pd

universities = pd.read_csv("data/universities_verified.csv")
programs = pd.read_csv("data/programs_verified.csv")

print(universities.groupby("country")["slug"].count())
print(programs[programs["country"] == "China"]["level"].value_counts())
\`\`\`

### Live JSON API (Always Current)
\`\`\`javascript
const chinaReport = await fetch("${SITE_URL}/china-study-report.json").then(r => r.json());
const marketReport = await fetch("${SITE_URL}/bangladesh-study-abroad-market.json").then(r => r.json());

console.log(chinaReport.report.tuitionDistributions.bachelorEnglish);
console.log(marketReport.snapshot.liveCatalog);
\`\`\`

---

## 4. Methodology & Verification Guardrails

1. **Zero Blended Tuition + Living Averages:** Institutional tuition is kept strictly separate from dormitory, health insurance, residence permit, EMGS, medical, and visa costs.
2. **Official Primary Sources Only:** Every university record is mapped to its official institutional domain alongside national recognition registries (China MoE / CampusChina / CSC, Malaysian Qualifications Register MQR/MQA, BMDC/WDOMS for MBBS pathways, CVASC Dhaka, and Bangladesh Bank AD Student File guidelines).
3. **No Synthetic Exchange Rates or Guarantees:** Fee rows retain their published institutional currencies (\`CNY\`, \`MYR\`) without synthetic conversions, and zero admission, scholarship, or visa guarantees are included.
4. **Zero Personal Data:** Contains strictly public institutional catalog and policy benchmark records—no student PII, passports, or private lead data.

Full methodology: [${SITE_URL}/how-we-verify-universities](${SITE_URL}/how-we-verify-universities)

---

## 5. How to Cite (CC BY 4.0)

### APA 7th Edition
> EduExpress International. (2026). *Bangladesh Study Abroad & China University Cost Benchmark Dataset (2027)* [Data set]. EduExpress International Editorial & Verification Desk, Dhaka, Bangladesh. ${SITE_URL}/press

### BibTeX
\`\`\`bibtex
@dataset{eduexpress_bangladesh_study_abroad_2027,
  author       = {Al Rakib, Abdullah and {EduExpress International Editorial \\& Verification Desk}},
  title        = {{Bangladesh Study Abroad \\& China University Cost Benchmark Dataset (2027)}},
  month        = nov,
  year         = 2026,
  publisher    = {EduExpress International},
  version      = {${VERSION}},
  url          = {${SITE_URL}/press}
}
\`\`\`

### HTML Attribution Snippet (for News Portals & Blogs)
\`\`\`html
Source: <a href="${SITE_URL}/china-study-report-bangladesh">EduExpress International Bangladesh–China Study Cost Benchmark (2027)</a> (<a href="${SITE_URL}/press">Open Dataset, CC BY 4.0</a>).
\`\`\`

---

## 6. Publisher & Canonical Entity Record

- **Organization:** [EduExpress International](${SITE_URL}) (Founded March 8, 2018; Dhaka, Bangladesh)
- **Office Address:** Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209, Bangladesh
- **Office Hours:** Saturday to Thursday, 11:00 AM to 6:00 PM (Friday closed)
- **Phone / WhatsApp:** +880 1983-333566 / +880 1329-663505
- **Editorial & Media Inquiries:** info@eduexpressint.com · [Press Room](${SITE_URL}/press) · [Dhaka Office Profile](${SITE_URL}/education-consultant-dhaka)
- **Entity Disambiguation:** EduExpress International (Dhaka, Bangladesh; \`eduexpressint.com\`) is an independent Bangladesh education consultancy and is unaffiliated with UK-registered \`EduExpress Ltd.\`.
`;
fs.writeFileSync(path.join(OUT_DIR, 'README.md'), readme, 'utf8');

// 12. Build clean ZIP archives for Zenodo and Kaggle
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

console.log('\n=== OPEN DATA PACKAGE GENERATED SUCCESSFULLY ===');
console.log(`Directory: ${OUT_DIR}`);
console.log(`- universities_verified.csv: ${uniRows.length} rows`);
console.log(`- programs_verified.csv: ${progRows.length} rows`);
console.log(`- scholarships_verified.csv: ${scholRows.length} rows`);
console.log(`- itemized_fees_verified.csv: ${feeRows.length} rows`);
console.log(`- destinations_matrix_12_countries.csv: ${destRows.length} rows`);
console.log(`- Zenodo ZIP: ${zenodoZip} (${(fs.statSync(zenodoZip).size / 1024).toFixed(1)} KB)`);
console.log(`- Kaggle ZIP: ${kaggleZip} (${(fs.statSync(kaggleZip).size / 1024).toFixed(1)} KB)`);
