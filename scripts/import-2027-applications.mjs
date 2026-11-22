import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const DOC_TEMPLATES_BY_COUNTRY = {
  China: [
    'Passport',
    'SSC Certificate',
    'HSC Certificate',
    'SSC Marksheet',
    'HSC Marksheet',
    'Passport-size Photo',
    'NID/Birth Certificate',
    'English Medium Certificate (MOI)',
    'CV',
    'Statement of Purpose',
    'Police Clearance',
    'Medical Check-up',
    'Bank Statement',
  ],
  Hungary: [
    'Passport',
    'SSC Certificate',
    'HSC Certificate',
    'Marksheets',
    'IELTS Score',
    'Passport-size Photo',
    'CV',
    'Statement of Purpose',
    'Recommendation Letters',
    'Bank Statement',
    'Health Insurance',
  ],
  Malaysia: [
    'Passport',
    'SSC Certificate',
    'HSC Certificate',
    'Marksheets',
    'Passport-size Photo',
    'Medical Declaration',
    'IELTS / MOI',
    'CV',
  ],
};

const DEFAULT_DOCS = [
  'Passport',
  'SSC Certificate',
  'HSC Certificate',
  'Marksheets',
  'Passport-size Photo',
  'CV',
  'Statement of Purpose',
  'Bank Statement',
];

function getDocsForCountry(country) {
  return DOC_TEMPLATES_BY_COUNTRY[country] || DEFAULT_DOCS;
}

// All 30 named 2027 student records extracted from the 3 tabs (CHINA, MALAYSIA, EUROPE)
// of Google Sheet 1S4Vn0FFAcc9zFDAoc7ZmVyuAVrezjMgFAEXKJa8sqOo, including embedded Drive folder URLs.
export const RECORDS_2027 = [
  // ── TAB 1: CHINA (23 named records) ──
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'AHMED SHAFKAT',
    nationality: 'Bangladesh',
    passport: 'A18896456',
    intake: 'March 2027',
    degree: 'PhD',
    program: 'Computer Science & Technology (CST)',
    sheetStatus: 'Documents Pending',
    stage: 'documents',
    university: null,
    notes: 'Pending docs: publications, LOR | Applications count: 2',
    reference: 'AFSANA',
    driveLink: 'https://drive.google.com/drive/folders/1oJ7IHYLOoMLdWau4uQPDXthLMn4b5hB6?usp=sharing',
  },
  {
    country: 'China',
    remark: 'Agent',
    name: 'SADIKUL ISLAM',
    nationality: 'Bangladesh',
    passport: 'A22563167',
    intake: 'September 2027',
    degree: 'Masters',
    program: null,
    sheetStatus: 'Documents Pending',
    stage: 'documents',
    university: 'NJIT',
    notes: 'Pending docs: Recommendation letter, Picture',
    reference: 'BheUni',
    driveLink: 'https://drive.google.com/drive/folders/1ODSlliOBLp48lmZ-RbQ0POPuJ5Mw4iPZ?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'KANTA DASH',
    nationality: 'Bangladesh',
    passport: 'A20002225',
    intake: 'March 2027',
    degree: 'Masters',
    program: 'Accounting & Finance',
    sheetStatus: 'Offer Received',
    stage: 'admitted',
    university: 'NJIT',
    notes: 'NJIT (Accounting) — Offer Received',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/1h9rDSuv1D6gveFnOtTGHd3XbeOxS0rKW?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'MD MA AAB SHAH',
    nationality: 'Bangladesh',
    passport: 'A09696108',
    intake: 'September 2027',
    degree: 'Bachelor',
    program: 'Mechanical, CST',
    sheetStatus: 'Documents Pending',
    stage: 'documents',
    university: null,
    notes: 'Preferred track: CST / Mechanical',
    reference: 'SAKIB',
    driveLink: 'https://drive.google.com/drive/folders/19hq-NkDOQk5EZ5Mjg556TCRVlfnAmBmL?usp=sharing',
  },
  {
    country: 'China',
    remark: 'Agent',
    name: 'MOHAMMAD ARAB AYAAN',
    nationality: 'Bangladesh',
    passport: 'A16774245',
    intake: 'March 2027',
    degree: 'Foundation',
    program: 'Mechanical',
    sheetStatus: 'Offer Received',
    stage: 'admitted',
    university: 'HIT',
    notes: 'HIT — Offer Received (March 2027 Foundation + Mechanical)',
    reference: 'BheUni',
    driveLink: 'https://drive.google.com/drive/folders/10e1iPae9bGVpqrINIzqCHgUMUG65yiqS?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'MD EMRAN BHUIYAN',
    nationality: 'Bangladesh',
    passport: 'A03374033',
    intake: 'March 2027',
    degree: 'Masters',
    program: 'Resource & Environment',
    sheetStatus: 'Applied',
    stage: 'submitted',
    university: 'NJIT',
    notes: 'Applied: NJIT (Resource & Environment)',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/1XJ7mYU8gk9aHTX8xzm8czXaw8bKqumez?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'MINHAJ AHMED',
    nationality: 'Bangladesh',
    passport: 'A22433434',
    intake: 'March 2027',
    degree: 'Masters',
    program: 'Social Work',
    sheetStatus: 'Applied',
    stage: 'submitted',
    university: 'NJIT',
    notes: 'Applied: NJIT (Social Work)',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/1MKIu5gVqBG4vmGvYRPz5YdB4LhEO9g8M?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'H. M. ASIF AHAMED',
    nationality: 'Bangladesh',
    passport: 'B00003026',
    intake: 'March 2027',
    degree: 'Masters',
    program: 'Electrical Engineering',
    sheetStatus: 'Applied',
    stage: 'submitted',
    university: 'NJIT',
    notes: 'Applied: NJIT (Electrical Engineering)',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/1kF_t2J0XLPTFUOgT0sgpnMsIjo1WfDS1?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'ROKEYA ISLAM MIRA',
    nationality: 'Bangladesh',
    passport: 'A17103835',
    intake: 'March 2027',
    degree: 'L+Bachelor',
    program: 'Business Administration',
    sheetStatus: 'Ready',
    stage: 'ready',
    university: null,
    notes: 'L+ Major (Business Administration) — Documents Ready',
    reference: 'AFSANA',
    driveLink: 'https://drive.google.com/drive/folders/1VfGHpd-IiMB3jwqPsM7JbaSYkdI1TiIS?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'MD AMIRUL ISLAM',
    nationality: 'Bangladesh',
    passport: 'A08749445',
    intake: 'September 2027',
    degree: 'PhD',
    program: 'Petroleum Engineering',
    sheetStatus: 'Documents Pending',
    stage: 'documents',
    university: 'CUPB / NUIST',
    notes: 'Targets: CUPB (Petroleum), NUIST (Meteorology), Green Energy | Pending: Bank, Medical, Police, Pic, Publications, LOR, NID, Work',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/1pDSdQ7fJRp_8b--VBfnqm2q6XTStnggo?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'RABEYA AKTER AKHI',
    nationality: 'Bangladesh',
    passport: 'A09992757',
    intake: 'March 2027',
    degree: 'Masters',
    program: 'Social Work',
    sheetStatus: 'Applied',
    stage: 'submitted',
    university: 'NJIT',
    notes: 'Applied: NJIT (Social Work)',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/1zIdg3Afo9kw8Pw7-IpXylJraJN-0cTgq?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'ABU HAYAT MAJUMDER',
    nationality: 'Bangladesh',
    passport: 'A13095735',
    intake: 'March 2027',
    degree: 'Masters',
    program: 'Accounting & Finance',
    sheetStatus: 'Withdrawn',
    stage: 'application_withdraw',
    university: 'NJIT',
    notes: 'Withdrawn (March 2027 · NJIT)',
    reference: 'AFSANA',
    driveLink: 'https://drive.google.com/drive/folders/1lIP0LYXUGQTXJCrRhGcGxNEsihtNmJPt?usp=sharing',
  },
  {
    country: 'China',
    remark: 'Agent',
    name: 'SHEIKH TAMZID ISLAM',
    nationality: 'Bangladesh',
    passport: 'A08748642',
    intake: 'March 2027',
    degree: 'Masters',
    program: 'Design',
    sheetStatus: 'Ready',
    stage: 'ready',
    university: 'NJIT',
    notes: 'Documents Ready for NJIT (Design)',
    reference: 'SAKIB',
    driveLink: 'https://drive.google.com/drive/folders/1Ha5WC-NMYQBoY6VjiQ1lxrBrt6jp3THM?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'SHUHEL AHAMMED',
    nationality: 'Bangladesh',
    passport: 'A01560151',
    intake: 'September 2027',
    degree: 'PhD',
    program: 'GIS',
    sheetStatus: 'Documents Pending',
    stage: 'documents',
    university: null,
    notes: 'Receive Acceptance Letter',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/1KBcG_U9_ROcCJtALLvhoWnzFeqFMLj6i?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'Md. Arsad Ihsan',
    nationality: 'Bangladesh',
    passport: null,
    intake: 'March 2027',
    degree: 'Language',
    program: 'Chinese Language',
    sheetStatus: 'Documents Pending',
    stage: 'documents',
    university: null,
    notes: 'Preference: Tuition + Hostel 5000 | Pending: Pic, Passport, Medical, Bank, Police | Physical: 5.5, 57kg',
    bloodGroup: 'O+',
    reference: 'AFSANA',
    driveLink: 'https://drive.google.com/drive/folders/1yvqKXzSGy9ERZyX_1oNngAQgmfULHOFY?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'ALBEENA SHAHADAT',
    nationality: 'Bangladesh',
    passport: 'A21995111',
    intake: 'September 2027',
    degree: 'Bachelor',
    program: 'Data Science',
    sheetStatus: 'Ready',
    stage: 'ready',
    university: null,
    notes: 'Preference: Ranking university + Full free scholarship',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/1ng463VgS9JZrvpz4CL1xNGot6l9jKRbg?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'SAYEM HASNAT',
    nationality: 'Bangladesh',
    passport: null,
    intake: 'March 2027',
    degree: 'Language',
    program: 'Trade and Economics',
    sheetStatus: 'Documents Pending',
    stage: 'documents',
    university: null,
    notes: 'Pending docs: Police clearance, Bank statement',
    reference: 'AFSANA',
    driveLink: 'https://drive.google.com/drive/folders/1Ctw6B7pMONJr0qJ4FxfDvu5QOEp-ne6N?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'BISWAMVER BARMAN',
    nationality: 'Bangladesh',
    passport: 'A22781085',
    intake: 'March 2027',
    degree: 'L+Bachelor',
    program: 'Computer Science & Technology (CST)',
    sheetStatus: 'Documents Pending',
    stage: 'documents',
    university: 'HIT',
    notes: 'Pending docs: Bank, Medical',
    reference: 'Meta',
    driveLink: 'https://drive.google.com/drive/folders/1ql5sNgnX6q9h1G4OeFBrcaUMMCfbIbhQ?usp=sharing',
  },
  {
    country: 'China',
    remark: 'Agent',
    name: 'FARJANA RAHMAN',
    nationality: 'Bangladesh',
    passport: 'A21608621',
    intake: 'March 2027',
    degree: 'Masters',
    program: 'Textile / Material Engineering',
    sheetStatus: 'Applied',
    stage: 'submitted',
    university: 'NJIT',
    notes: 'Applied: NJIT (Material / Textile)',
    reference: 'Taufiq (Agent)',
    driveLink: 'https://drive.google.com/drive/folders/1BVCG7v6dpQ9Z-LKbbd1GCpDaVCakZvSE?usp=sharing',
  },
  {
    country: 'China',
    remark: 'Agent',
    name: 'MAHINUR',
    nationality: 'Bangladesh',
    passport: 'A22036544',
    intake: 'March 2027',
    degree: 'Bachelor',
    program: 'Bioengineering',
    sheetStatus: 'Ready',
    stage: 'ready',
    university: 'Changchun University of Science and Technology',
    notes: 'Documents Ready for Changchun (Bio Eng)',
    reference: 'BheUni',
    driveLink: 'https://drive.google.com/drive/folders/1wacvp49cUbSQg0XOd7z4XJ8UPyIjfu9x?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'MANIK',
    nationality: 'Bangladesh',
    passport: 'A11271221',
    intake: 'March 2027',
    degree: 'Masters',
    program: 'Accounting & Finance',
    sheetStatus: 'Applied',
    stage: 'submitted',
    university: 'NJIT',
    notes: 'Applied: NJIT (Accounting & Finance)',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/1lIAh3ZAnPmUVzQp0CYFicuTVXfkWThjG?usp=sharing',
  },
  {
    country: 'China',
    remark: 'EduExpress',
    name: 'TASIN FERDOUS SAMI',
    nationality: 'Bangladesh',
    passport: 'A21832962',
    intake: 'March 2027',
    degree: 'L+Bachelor',
    program: 'Logistics Management',
    sheetStatus: 'Documents Pending',
    stage: 'documents',
    university: null,
    notes: 'L+ Major (Logistics) — Documents Pending',
    reference: 'AFSANA',
    driveLink: 'https://drive.google.com/drive/folders/1B2_8p53j9Cw8CglYbfJ5gC0n344rHPJu?usp=sharing',
  },
  {
    country: 'China',
    remark: 'Agent',
    name: 'TASRIFUL AHASAN',
    nationality: 'Bangladesh',
    passport: 'A21957707',
    intake: 'March 2027',
    degree: 'L+Bachelor',
    program: 'General / Open Major',
    sheetStatus: 'Documents Pending',
    stage: 'documents',
    university: 'Changchun University of Science and Technology',
    notes: 'Pending docs: Bank, Police',
    reference: 'AZFAR',
    driveLink: 'https://drive.google.com/drive/folders/1-PyRw3CuBnaAwGT8R_9LZ5a7GeRP-B-t?usp=sharing',
  },

  // ── TAB 2: MALAYSIA (4 named records) ──
  {
    country: 'Malaysia',
    remark: 'EduExpress',
    name: 'KM WAHID SAEEM',
    nationality: 'Bangladesh',
    passport: 'A10058495',
    intake: 'January 2027',
    degree: 'Foundation',
    program: 'Foundation',
    sheetStatus: 'Given',
    stage: 'submitted',
    university: 'INTI International University',
    notes: 'Status in 2027 Malaysia sheet: Given (INTI)',
    reference: 'AFSANA',
    driveLink: 'https://drive.google.com/drive/folders/1Vu8lGqCfdEHKMkfHc0fne76MIBtWSDSY?usp=sharing',
  },
  {
    country: 'Malaysia',
    remark: 'EduExpress',
    name: 'ANAF NUR ARONNO',
    nationality: 'Bangladesh',
    passport: 'A09998253',
    intake: 'January 2027',
    degree: 'Foundation',
    program: 'Foundation',
    sheetStatus: 'Documents Pending',
    stage: 'documents',
    university: 'INTI International University (Subang)',
    notes: 'Target: INTI Subang',
    reference: 'AFSANA',
    driveLink: 'https://drive.google.com/drive/folders/1qKYbu5ktFgpIagkFehAnA8zrwN1xYtOB?usp=sharing',
  },
  {
    country: 'Malaysia',
    remark: 'EduExpress',
    name: 'MD NUR E ALAM SIDDIQUI',
    nationality: 'Bangladesh',
    passport: 'A19030142',
    intake: 'January 2027',
    degree: 'Masters',
    program: 'Automation',
    sheetStatus: 'Withdrawn',
    stage: 'application_withdraw',
    university: null,
    notes: 'Naiamul working — Withdrawn',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/18ymbG84iiKZ3cTonJ0QHZrQZdLH1SbGm?usp=sharing',
  },
  {
    country: 'Malaysia',
    remark: 'EduExpress',
    name: 'MD. SANSABIL',
    nationality: 'Bangladesh',
    passport: 'A07695340',
    intake: 'January 2027',
    degree: 'Masters',
    program: 'Business Administration',
    sheetStatus: 'Given',
    stage: 'submitted',
    university: 'UniSZA (Universiti Sultan Zainal Abidin)',
    notes: 'Status in 2027 Malaysia sheet: Given (UNIZA)',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/1630Tfpe3l5OAgLn1VGrsIhEbJQm4Re1Y?usp=sharing',
  },

  // ── TAB 3: EUROPE (3 named records) ──
  {
    country: 'Hungary',
    remark: 'Agent',
    name: 'RUPAM SAHA',
    nationality: 'Bangladesh',
    passport: 'A22534921',
    intake: 'January 2027',
    degree: 'Foundation',
    program: 'Economics',
    sheetStatus: 'Applied',
    stage: 'submitted',
    university: null,
    notes: 'Application 2 contact: jahanalam179@gmail.com',
    reference: 'Pranto Vai',
    driveLink: 'https://drive.google.com/drive/folders/1CrhH3C1OMZwSIgUrUbI9dgYOQ4kNbqpJ?usp=sharing',
  },
  {
    country: 'Greece',
    remark: 'Agent',
    name: 'Mehedi Hasan',
    nationality: 'Bangladesh',
    passport: 'A21740495',
    intake: 'January 2027',
    degree: 'Masters',
    program: null,
    sheetStatus: 'Applied',
    stage: 'submitted',
    university: 'Epsilon College, Greece',
    notes: 'Applied via QE Group portal (Epsilon College, Greece · Dec 2026 / Jan 2027 cohort)',
    reference: 'Agent',
    driveLink: 'https://drive.google.com/drive/folders/1Mqflbq4V6isCspAtghiNHN7a87AiqodR?usp=sharing',
  },
  {
    country: 'Finland',
    remark: 'EduExpress',
    name: 'ANJUMAN ARA MUKTA',
    nationality: 'Bangladesh',
    passport: 'A14931163',
    intake: 'September 2027',
    degree: 'Masters',
    program: 'Business Administration',
    sheetStatus: 'Applied',
    stage: 'submitted',
    university: null,
    notes: 'Finland Master of Business Administration (September 2027)',
    reference: 'MUKTA',
    driveLink: 'https://drive.google.com/drive/folders/1f7Tb_syPCk7MpMJYAJ4QbLVmaUzIEqGs?usp=sharing',
  },
];

function deriveStatus(stage) {
  switch (stage) {
    case 'admitted':
      return 'admission_received';
    case 'submitted':
      return 'application_submitted';
    case 'application_withdraw':
      return 'closed';
    default:
      return 'application_started';
  }
}

function mapUniStatus(stage) {
  if (stage === 'admitted') return 'admitted';
  if (stage === 'submitted') return 'submitted';
  if (stage === 'ready') return 'ready';
  return 'documents';
}

function normalizeName(s) {
  return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function generatePublicToken() {
  return crypto.randomBytes(12).toString('hex');
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const employees = await prisma.employee.findMany({ where: { active: true } });
    const empByKeyword = {
      AFSANA: employees.find((e) => e.name.toLowerCase().includes('afsana')) || null,
      MUKTA: employees.find((e) => e.name.toLowerCase().includes('mukta')) || null,
      SAKIB: employees.find((e) => e.name.toLowerCase().includes('sakib')) || null,
    };

    const existingApps = await prisma.lead.findMany({
      where: { isApplication: true },
      select: {
        id: true,
        leadRef: true,
        name: true,
        passport: true,
        country: true,
        assessIntake: true,
        publicToken: true,
      },
    });

    // Determine next sequential LEAD-04XX number
    let maxRefNum = 445;
    for (const a of existingApps) {
      const m = String(a.leadRef || '').match(/(?:LEAD|APP)-(\d+)/i);
      if (m) {
        const n = Number.parseInt(m[1], 10);
        if (Number.isFinite(n) && n > maxRefNum) maxRefNum = n;
      }
    }

    let createdCount = 0;
    let updatedCount = 0;
    let docsCreatedCount = 0;
    let uniAppsCreatedCount = 0;

    for (const rec of RECORDS_2027) {
      const refUpper = String(rec.reference || '').trim().toUpperCase();
      const matchedEmp = empByKeyword[refUpper] || null;
      const channelType = rec.remark === 'Agent' ? 'B2B' : 'B2C';
      const source = rec.remark === 'Agent' ? 'B2B' : 'In-House';
      const status = deriveStatus(rec.stage);

      // Match existing 2027 application by (passport + 2027 intake) or (normalized name + country + 2027 intake)
      const existing = existingApps.find((a) => {
        const is2027 = String(a.assessIntake || '').includes('2027');
        if (!is2027) return false;
        if (rec.passport && a.passport && a.passport.toUpperCase() === rec.passport.toUpperCase()) {
          return true;
        }
        return normalizeName(a.name) === normalizeName(rec.name) && a.country.toLowerCase() === rec.country.toLowerCase();
      });

      let leadId;
      let leadRef;

      if (existing) {
        leadRef = existing.leadRef || `LEAD-${String(++maxRefNum).padStart(4, '0')}`;
        const updated = await prisma.lead.update({
          where: { id: existing.id },
          data: {
            leadRef,
            isApplication: true,
            name: rec.name,
            country: rec.country,
            destinationInterest: rec.country.toLowerCase(),
            nationality: rec.nationality,
            passport: rec.passport,
            assessIntake: rec.intake,
            degree: rec.degree,
            program: rec.program,
            assessSubject: rec.program,
            university: rec.university,
            applicationStage: rec.stage,
            status,
            channelType,
            source,
            leadMarket: 'Bangladesh',
            referrer: rec.reference,
            assignedEmployeeId: matchedEmp?.id || null,
            assignedTo: matchedEmp?.name || null,
            driveLink: rec.driveLink,
            applicationNotes: rec.notes,
            bloodGroup: rec.bloodGroup || undefined,
            embassyStatus: 'Pending',
            hardcopyStatus: 'Pending',
            publicToken: existing.publicToken || generatePublicToken(),
            publicEnabled: true,
          },
        });
        leadId = updated.id;
        updatedCount++;
      } else {
        leadRef = `LEAD-${String(++maxRefNum).padStart(4, '0')}`;
        const email = `${leadRef.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.eduexpressint.com`;
        const created = await prisma.lead.create({
          data: {
            leadRef,
            isApplication: true,
            leadType: 'application',
            name: rec.name,
            email,
            phone: '—',
            country: rec.country,
            destinationInterest: rec.country.toLowerCase(),
            nationality: rec.nationality,
            passport: rec.passport,
            assessIntake: rec.intake,
            degree: rec.degree,
            program: rec.program,
            assessSubject: rec.program,
            university: rec.university,
            applicationStage: rec.stage,
            status,
            channelType,
            source,
            leadMarket: 'Bangladesh',
            referrer: rec.reference,
            assignedEmployeeId: matchedEmp?.id || null,
            assignedTo: matchedEmp?.name || null,
            driveLink: rec.driveLink,
            applicationNotes: rec.notes,
            bloodGroup: rec.bloodGroup || null,
            embassyStatus: 'Pending',
            hardcopyStatus: 'Pending',
            publicToken: generatePublicToken(),
            publicEnabled: true,
            consentTimestamp: new Date(),
            consentPolicyVersion: 'google_sheet_2027_import',
          },
        });
        leadId = created.id;
        existingApps.push({
          id: created.id,
          leadRef: created.leadRef,
          name: created.name,
          passport: created.passport,
          country: created.country,
          assessIntake: created.assessIntake,
          publicToken: created.publicToken,
        });
        createdCount++;
      }

      // Ensure destination document checklist exists
      const existingDocs = await prisma.leadDocument.findMany({
        where: { leadId },
        select: { id: true, docType: true, status: true },
      });
      const existingDocMap = new Map(existingDocs.map((d) => [d.docType.toLowerCase(), d]));
      const templateDocs = getDocsForCountry(rec.country);

      for (const docType of templateDocs) {
        const initialStatus =
          docType === 'Passport' && rec.passport
            ? 'received'
            : rec.stage === 'ready' || rec.stage === 'submitted' || rec.stage === 'admitted'
              ? 'received'
              : 'pending';
        const found = existingDocMap.get(docType.toLowerCase());
        if (!found) {
          await prisma.leadDocument.create({
            data: {
              leadId,
              docType,
              status: initialStatus,
              updatedBy: '2027-sheet-sync',
            },
          });
          docsCreatedCount++;
        } else if (found.status === 'pending' && initialStatus === 'received') {
          await prisma.leadDocument.update({
            where: { id: found.id },
            data: { status: 'received' },
          });
        }
      }

      // Ensure university application row exists if university specified
      if (rec.university) {
        const uniStatus = mapUniStatus(rec.stage);
        const existingUni = await prisma.leadUniversityApp.findFirst({
          where: { leadId, university: rec.university },
        });
        if (!existingUni) {
          await prisma.leadUniversityApp.create({
            data: {
              leadId,
              university: rec.university,
              program: rec.program,
              status: uniStatus,
              notes: rec.notes,
              updatedBy: '2027-sheet-sync',
            },
          });
          uniAppsCreatedCount++;
        } else if (existingUni.status !== uniStatus) {
          await prisma.leadUniversityApp.update({
            where: { id: existingUni.id },
            data: { status: uniStatus, program: rec.program },
          });
        }
      }
    }

    const totalAppsNow = await prisma.lead.count({ where: { isApplication: true } });
    const byIntake = await prisma.lead.groupBy({
      by: ['assessIntake'],
      where: { isApplication: true },
      _count: { id: true },
    });

    console.log(
      JSON.stringify(
        {
          sheetRecordsProcessed: RECORDS_2027.length,
          createdCount,
          updatedCount,
          docsCreatedCount,
          uniAppsCreatedCount,
          totalAppsNow,
          byIntake,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[import-2027] Fatal error:', err);
  process.exit(1);
});
