import { chinaGuidePages } from '@/data/chinaGuidePages';
import { evidencePages } from '@/data/evidencePages';
import { OFFICIAL_COUNTRY_SOURCES } from '@/app/destinations/[country]/country-seo';
import { CHINA_REPORT_OFFICIAL_AUTHORITIES } from '@/lib/china-benchmark';
import { getChinaIntakes } from '@/lib/china-intakes';
import { getPublishedUpdates } from '@/lib/content-records';
import { activeCountries } from '@/lib/countries';
import { OPEN_DATA_REPOSITORIES } from '@/lib/open-data';
import { destinationPath } from '@/lib/site-urls';
import { getPublicTrustRecords } from '@/lib/trust-records';
import { getIndexableUniversityGuides } from '@/lib/university-guide-publication';
import { getUniversityRecords } from '@/lib/university-records';

/**
 * Plain-text knowledge files for AI answer engines and buying agents
 * (/llms-full.txt, /pricing.md). Every line is generated from the same data the
 * site renders — no separate copy to drift — and dated so a reader can judge
 * freshness. Nothing here may state a fact the site itself does not state.
 */

const SITE = 'https://eduexpressint.com';
const url = (path: string) => `${SITE}${path}`;
const today = () => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(new Date());
const clean = (value?: string | null) => (value ?? '').replace(/\s+/g, ' ').trim();
const UNPRICED = /not recorded|contact|request|not specified|not confirmed|unknown/i;

async function loadOffice() {
  try {
    const { offices } = await getPublicTrustRecords();
    return offices.find(item => item.isHeadOffice) ?? offices[0] ?? null;
  } catch {
    return null;
  }
}

async function loadPackages() {
  try {
    return (await getPublicTrustRecords()).servicePackages;
  } catch {
    return [];
  }
}

function companyBlock(office: Awaited<ReturnType<typeof loadOffice>>) {
  const phones = [office?.phonePrimary, office?.phoneSecondary].filter(Boolean).join(', ');
  return [
    '## Company facts',
    '',
    '- Name: EduExpress International (EduExpress)',
    '- What it is: an evidence-first study abroad consultancy for students and families in Bangladesh (unaffiliated with unrelated companies named EduExpress registered outside Bangladesh).',
    '- Founded: 8 March 2018, by Abdullah Al Rakib (Founder and CEO), in Chinese university admissions; a China entity (Wuxi Haiying Culture and Art Consulting Co., Ltd.) was formed in 2019; the Bangladesh operation relaunched in 2023.',
    office?.address ? `- Office: ${clean(office.address)}` : '- Office: Dhanmondi, Dhaka, Bangladesh',
    office?.hours ? `- Opening hours: ${clean(office.hours)}` : '',
    phones ? `- Phone / WhatsApp: ${phones}` : '',
    office?.email ? `- Email: ${office.email}` : '',
    `- Dhaka office & local guide: ${url('/education-consultant-dhaka')}`,
    `- Website: ${SITE}`,
    `- Languages: English and Bengali (Bengali Bangladesh market guide: ${url('/bn/bangladesh-study-abroad-market')}, Bengali China guide: ${url('/bn/study-in-china')}, Bengali visa guide: ${url('/bn/china-student-visa-bangladesh')}, Bengali cost guide: ${url('/bn/study-in-china-cost-bangladesh')}, Bengali CSC scholarship guide: ${url('/bn/csc-scholarship-bangladesh')}, Bengali MBBS guide: ${url('/bn/mbbs-in-china-bangladesh')}, Bengali CSCA exam guide: ${url('/bn/csca-exam-bangladesh')}, Bengali SSC & Dakhil 3+2 guide: ${url('/bn/study-in-china-after-ssc-dakhil')})`,
    '',
  ].filter(line => line !== '').join('\n') + '\n';
}

const policyBlock = [
  '## Policies that never change',
  '',
  '- The first profile assessment is free and carries no obligation.',
  '- China: BDT 0 file opening charge and no EduExpress service fee is due before the student’s China visa is approved (BDT 200,000 Complete China Support Package payable 100% after visa approval).',
  '- China CSCA exam preparation: students who open a verified China undergraduate or CSC scholarship application file with EduExpress receive a complimentary CSCA Master Pro seat activation code (CNY 99 value on https://www.cscamaster.com/, unlocking 155 full-length mock papers and 21 timed official past papers). Official CSCA test registration (CNY 450–700) is paid separately on https://csca.cn.',
  '- Malaysia & United Kingdom (UK): BDT 0 EduExpress service fee (100% free consultancy) for university application, CAS/offer letter processing, and EMGS Student Pass / UKVI Student Visa guidance, including Bangladesh Bank Student File documentation support.',
  '- Other European destinations (Hungary, Finland, Malta, Cyprus, Georgia, Greece, Croatia): BDT 0 file-opening charge; BDT 100,000 (1 Lakh Taka) EduExpress service fee payable 100% after visa approval.',
  '- University tuition, deposits, embassy, EMGS, medical, translation and courier costs are paid to those recipients and are listed in writing before payment.',
  '- Admission, scholarship, visa and employment outcomes are never guaranteed; the university and the authorities decide.',
  `- Fee policy: ${url('/fees-and-transparency')} · Visa-first policy: ${url('/china-visa-first-policy')} · Complaints: ${url('/complaints-and-resolution')}`,
  '',
].join('\n') + '\n';

function intakeBlock() {
  const rows = getChinaIntakes();
  return [
    `## China intakes (status computed ${today()})`,
    '',
    ...rows.map(row => `- ${row.name}: ${row.status}. Applications open ${row.opensLabel}; university deadline ${row.deadlineLabel}; classes start ${row.classesStart}. ${clean(row.programs)}`),
    `- Details: ${url('/china-intakes-deadlines')}`,
    '',
  ].join('\n') + '\n';
}

function destinationBlock() {
  return [
    '## Destinations served',
    '',
    ...activeCountries.map(country => `- [Study in ${country.name}](${url(destinationPath(country.slug))}): ${clean(country.description)}`),
    '',
  ].join('\n') + '\n';
}

function guideBlock() {
  const out: string[] = ['## China guides (direct answers)', ''];
  for (const guide of Object.values(chinaGuidePages)) {
    out.push(`### ${guide.title}`, `URL: ${url(`/${guide.slug}`)}`, '', clean(guide.directAnswer), '');
    if (guide.facts.length) {
      out.push(...guide.facts.map(fact => `- ${fact.label}: ${fact.value}${fact.note ? ` (${clean(fact.note)})` : ''}`), '');
    }
    for (const faq of guide.faqs) out.push(`Q: ${clean(faq.question)}`, `A: ${clean(faq.answer)}`, '');
    if (guide.sources.length) out.push(`Official sources: ${guide.sources.map(source => source.href).join(' · ')}`, '');
  }
  return out.join('\n') + '\n';
}

function evidenceBlock() {
  return [
    '## How EduExpress works (policy pages)',
    '',
    ...Object.entries(evidencePages)
      .filter(([slug]) => !slug.includes('/'))
      .map(([slug, page]) => `- [${page.title}](${url(`/${slug}`)}): ${clean(page.description)}`),
    '',
  ].join('\n') + '\n';
}

async function universityBlock() {
  try {
    const [records, indexable] = await Promise.all([getUniversityRecords(), getIndexableUniversityGuides()]);
    const listed = records.filter(record => record.isActive || indexable.has(record.slug)).sort((a, b) => a.name.localeCompare(b.name));
    if (!listed.length) return '';
    return [
      `## University directory (${listed.length} public profiles)`,
      '',
      'Each profile lists programmes, fees, scholarships, intakes and the official source for each figure.',
      '',
      ...listed.map(record => {
        const tuition = clean(record.details.tuition);
        const awards = record.scholarships.filter(award => award.status !== 'closed').length;
        return `- [${record.name}](${url(`/universities/${record.slug}`)}), ${record.city}, ${record.country}` +
          (tuition && !UNPRICED.test(tuition) ? ` — tuition: ${tuition}` : '') +
          (record.programs.length ? ` — ${record.programs.length} programmes` : '') +
          (awards ? ` — ${awards} scholarship option${awards === 1 ? '' : 's'}` : '');
      }),
      `- Search all: ${url('/universities')}`,
      '',
    ].join('\n') + '\n';
  } catch {
    return '';
  }
}

async function updatesBlock() {
  try {
    const posts = (await getPublishedUpdates(undefined, false)).filter(post => !post.archived);
    if (!posts.length) return '';
    const day = (value?: string) => (value ? new Date(value).toISOString().slice(0, 10) : '');
    return [
      `## Active education updates & CSC university guides (${posts.length})`,
      '',
      'New universities, scholarships, programs and study guides, newest first. Each is dated; check the page for the current status.',
      '',
      ...posts.map(post => {
        const summary = clean(post.excerpt || post.metaDescription);
        const meta = [post.category, day(post.publishedAt ?? post.createdAt)].filter(Boolean).join(', ');
        return `- [${clean(post.title)}](${url(`/updates/${post.slug}`)})${meta ? ` (${meta})` : ''}${summary ? `: ${summary}` : ''}`;
      }),
      `- All updates: ${url('/updates')} · RSS: ${url('/updates/feed.xml')}`,
      '',
    ].join('\n') + '\n';
  } catch {
    return '';
  }
}

function malaysiaAndKeyRoutesBlock() {
  return [
    '## Malaysia & key campaign guides',
    '',
    `- [Study in Malaysia from Bangladesh](${url('/study-in-malaysia-from-bangladesh')}): public, private and UK/Australian branch campuses; RM 12,000-45,000 typical tuition; BDT 0 EduExpress service fee`,
    `- [Malaysia study costs & Student File guide](${url('/malaysia-study-cost-bangladesh')}): MYR and BDT itemised budget, EMGS processing and Bangladesh Bank Student File remittance steps`,
    `- [Malaysia student visa (EMGS & VAL)](${url('/malaysia-student-visa-bangladesh')}): EMGS application, Visa Approval Letter (VAL), Single Entry Visa (SEV) and arrival clearance`,
    `- [Malaysia scholarships & merit waivers](${url('/malaysia-scholarships-bangladesh')}): MTCP, MIS, Sunway/Taylor’s/APU/Monash 10%–75% tuition waivers, remaining living budget and BDT 0 EduExpress service fee`,
    `- [Study in Malaysia after O-Level](${url('/study-in-malaysia-after-o-level')}): 1-year Foundation (5 O-Level credits) and 2-year Diploma (3 credits) pathways skipping 2 years of A-Levels in Bangladesh, with living costs separated and BDT 0 EduExpress fee`,
    `- [Study gap acceptable countries for Bangladeshi students](${url('/study-gap-acceptable-countries-bangladesh')}): 12-country Bachelor & Master/PhD gap limits, age caps and verifiable employment/tax evidence`,
    `- [Student visa bank solvency & Bangladesh Bank Student File guide](${url('/student-visa-bank-solvency-bangladesh')}): required bank balances, maturity windows, sponsor documents and FE Circular 37 rules across 12 countries`,
    `- [Study abroad without IELTS from Bangladesh (MOI matrix)](${url('/study-abroad-without-ielts-from-bangladesh')}): university Medium of Instruction (MOI) acceptance vs embassy visa language enforcement across 12 countries`,
    `- [BMDC recognized medical colleges abroad & 45 China MOE list](${url('/bmdc-recognized-medical-colleges-abroad')}): mandatory pre-departure BMDC Eligibility Certificate rules (SSC+HSC GPA ≥ 7.00, Biology ≥ 3.50), WDOMS/WFME rules and 4-country MBBS comparison (${url('/bangladesh-vs-china-mbbs')})`,
    `- [Document attestation, MOFA e-Apostille & notarization guide](${url('/document-attestation-apostille-bangladesh')}): Education Board, MoE/UGC, myGov e-Apostille QR verification and Embassy legalization workflow in Dhaka`,
    `- [Europe, UK & Asia student visa guides]: UK (${url('/uk-student-visa-bangladesh')}), Hungary (${url('/hungary-student-visa-bangladesh')}), South Korea (${url('/south-korea-student-visa-bangladesh')}), Finland (${url('/finland-student-visa-bangladesh')}), Malta (${url('/malta-student-visa-bangladesh')}), Cyprus (${url('/cyprus-student-visa-bangladesh')}), Georgia (${url('/georgia-student-visa-bangladesh')}), Greece (${url('/greece-student-visa-bangladesh')}), Croatia (${url('/croatia-student-visa-bangladesh')}), Thailand (${url('/thailand-student-visa-bangladesh')})`,
    `- [Country scholarship guides]: UK (${url('/uk-scholarships-bangladesh')}), Hungary (${url('/hungary-scholarships-bangladesh')}), South Korea (${url('/south-korea-scholarships-bangladesh')}), Finland (${url('/finland-scholarships-bangladesh')}), Malaysia (${url('/malaysia-scholarships-bangladesh')})`,
    `- [Founder & CEO Editorial Profile — Abdullah Al Rakib](${url('/author/abdullah-al-rakib')}): NUIST PhD researcher credentials, institutional memberships and editorial verification governance`,
    `- [Study in China after O-Level or SSC (3+2)](${url('/study-in-china-after-o-level-ssc')}): 3-year Diploma + 2-year Top-Up Bachelor (5 years total) with 3 tuition/hostel scholarship tiers (CNY 0/yr, CNY 1,200–3,000/yr, CNY 5,000–8,000/yr), separated living costs, and under-18 guardian checks`,
    `- [China Bachelor vs. UK, USA, Australia, New Zealand & Dhaka Private Universities](${url('/compare-bachelor-china-abroad-bangladesh')}): live comparison of top-ranked Chinese universities and University/Provincial scholarships against NSU/EWU/AIUB and Western tuition benchmarks (living costs separated)`,
    `- [Bangladesh vs. China University Study](${url('/bangladesh-vs-china-bachelor-study')}): direct 1-on-1 comparison of NSU, EWU, and AIUB 4-year fees against top-ranked Chinese universities, residential labs, and university scholarships (living costs separated)`,
    `- [Study in Bangladesh vs. Study Abroad Countries](${url('/bangladesh-vs-study-abroad-countries')}): local Bangladesh A-Level & private university baseline compared against Malaysia, China, UK, Europe, and Western benchmarks (living costs separated)`,
    `- [Bangladesh Study Abroad Market 2027 Report](${url('/bangladesh-study-abroad-market')}): comprehensive outbound market overview, all 12 active destinations, separated BDT tuition/living budgets, Bangladesh Bank Student File rules, B2C pathways & B2B desk ([JSON dataset](${url('/bangladesh-study-abroad-market.json')}) · [বাংলা গাইড](${url('/bn/bangladesh-study-abroad-market')}))`,
    `- [China March 2027 intake](${url('/china-march-2027-intake')}): open Spring 2027 programmes, deadlines and Visa-First study plan`,
    `- [China city university guides](${url('/china-universities')}): compare recorded universities, tuition and scholarships by Chinese city`,
    `- [Bangladesh to China Study Data & Cost Report](${url('/china-study-report-bangladesh')}): live CNY tuition quartiles, first-year fee distributions, scholarship counts and verification transparency across Chinese universities ([JSON dataset](${url('/china-study-report.json')}))`,
    `- [Media, Data & Research Press Room](${url('/press')}): open CC BY 4.0 datasets, bilingual press briefs, spokesperson bios and journalist verification desk (Zenodo DOI: ${OPEN_DATA_REPOSITORIES.zenodoDoiUrl} · Concept DOI: ${OPEN_DATA_REPOSITORIES.zenodoConceptDoiUrl} · GitHub: ${OPEN_DATA_REPOSITORIES.githubRepoUrl} · Kaggle: ${OPEN_DATA_REPOSITORIES.kaggleUrl})`,
    `- [Program and tuition finder](${url('/programs')}) · [Compare first-year costs](${url('/compare-costs')})`,
    '',
  ].join('\n') + '\n';
}

const MALAYSIA_OFFICIAL_AUTHORITIES = [
  { label: 'Education Malaysia Global Services (EMGS)', href: 'https://educationmalaysia.gov.my/' },
  { label: 'Malaysian Qualifications Register (MQR / MQA)', href: 'https://www2.mqa.gov.my/mqr/' },
  { label: 'Ministry of Higher Education Malaysia (MoHE)', href: 'https://www.mohe.gov.my/en' },
  { label: 'Immigration Department of Malaysia — Student Pass', href: 'https://www.imi.gov.my/index.php/en/main-services/pass/student-pass/' },
];

function officialAuthoritiesBlock() {
  const destinationSources = [
    ...MALAYSIA_OFFICIAL_AUTHORITIES,
    ...Object.values(OFFICIAL_COUNTRY_SOURCES).flat(),
  ];
  const seen = new Set<string>(CHINA_REPORT_OFFICIAL_AUTHORITIES.map(item => item.href));
  const uniqueDestinationSources = destinationSources.filter(source => {
    if (seen.has(source.href)) return false;
    seen.add(source.href);
    return true;
  });

  return [
    '## Primary official & regulatory authorities verified against',
    '',
    '### China (flagship)',
    ...CHINA_REPORT_OFFICIAL_AUTHORITIES.map(
      source => `- [${source.label}](${source.href}): ${clean(source.note)}`,
    ),
    '',
    '### Malaysia & active destination regulators',
    ...uniqueDestinationSources.map(source => `- [${source.label}](${source.href})`),
    '',
  ].join('\n') + '\n';
}

function decisionAndRegulatoryDirectAnswersBlock() {
  return [
    '## 12-Country Regulatory, Visa Solvency, Study Gap, MOI, BMDC & Scholarship Direct Answers (2027)',
    '',
    '### 1. Student Visa Bank Solvency & Bangladesh Bank Student File (FE Circular 37)',
    `URL: ${url('/student-visa-bank-solvency-bangladesh')}`,
    '- China (X1/X2 Visa): USD 2,500–5,000+ (~BDT 3.1L–6.2L+) closing balance in student, parent, or blood-sponsor account (3–6 month statement; waived on full CSC scholarship).',
    '- Malaysia (EMGS eVAL & SEV): MYR 15,000–25,000 (~BDT 4.0L–6.8L) in student or parent account for Dhaka SEV stamping; semester tuition wired via Bangladesh Bank Student File.',
    '- United Kingdom (UKVI Student Route): Unpaid Year-1 tuition (after CAS deposit) + £13,347 (Inside London, £1,483/mo × 9) or £10,224 (Outside London, £1,136/mo × 9), held untouched for 28 consecutive days strictly in Student or Legal Parent account ONLY (statement ≤31 days old).',
    '- Finland (Migri Type A Residence Permit): Statutory EUR 9,600/year (EUR 800/month × 12, ~BDT 12.48L) deposited strictly inside the STUDENT’S SOLE PERSONAL bank account (plus paid Year-1 tuition receipt and 6-month sponsor tax/income provenance).',
    '- Hungary (Schengen Type D): EUR 6,500–8,000 (~BDT 8.5L–10.4L) liquid solvency + SWIFT MT103 paid tuition receipt (waived for Stipendium Hungaricum scholars).',
    '- South Korea (D-2 Visa): USD 20,000 (Seoul Metro) or USD 16,000–18,000 (Regional) held for 30–90 days strictly inside one of the Korean Embassy Dhaka’s 14 designated commercial banks (waived for full GKS scholars).',
    '- Malta (Identità CVU): EUR 8,000–10,000 (~BDT 10.5L–13.2L) meeting 75% minimum wage benchmark + paid tuition receipt.',
    '- Republic of Cyprus (EU CRMD Blue Slip): EUR 7,000–8,500 (~BDT 9.1L–11.0L) bank statement attested by bank & MoFA Dhaka + initial tuition deposit wire.',
    '- Georgia (D3 Study Visa), Greece (Type D), Croatia (MUP Temporary Stay), Thailand (Non-Immigrant ED): Georgia USD 3,500–5,000; Greece EUR 6,000–7,800; Croatia EUR 6,000–7,200; Thailand USD 4,000–6,000.',
    '',
    '### 2. Study Gap & Statutory Age Limits for Bangladeshi Students',
    `URL: ${url('/study-gap-acceptable-countries-bangladesh')}`,
    '- China: Bachelor gap up to 3–5 years (CSC age <25); Master’s gap up to 8–12 years (CSC age <35); PhD gap up to 10–14 years (CSC age <40).',
    '- Malaysia: Highest gap flexibility in Asia — Bachelor gap up to 5–7 years, Master/PhD gap up to 10–15 years (EMGS age limit 18–45).',
    '- UK, Finland & Europe: Bachelor gap 2–3 years optimal (Finland up to 4–6 years via UAS Entrance Exam with no upper age cap); Master/PhD gap 5–10+ years accepted when backed by verifiable employment NOC, bank salary credits, or trade license/TIN.',
    '- South Korea: Strictest undergraduate gap audit in Dhaka (Bachelor gap 1–2 years max, GKS UG <25; Graduate gap 4–6 years, GKS PG <40).',
    '',
    '### 3. Study Abroad Without IELTS from Bangladesh (MOI vs. Embassy Visa Rules)',
    `URL: ${url('/study-abroad-without-ielts-from-bangladesh')}`,
    '- Both University & Embassy Visa Safe with MOI / Internal Interview: China (English MOI + university video interview or 1-yr Chinese HSK Foundation), Malaysia (MOI or on-campus IEP), Hungary Self-Funded (live Zoom faculty entrance exam), Georgia (recorded Zoom English interview), Thailand (MOI or AIT-EET).',
    '- Conditional / Exam Required: UK (accepted without IELTS only if a UKVI track-record HEP university assesses CEFR B2 from an approved BD university MOI/HSC English ≥75% + internal test + Pre-CAS interview and certifies B2 on the CAS), Finland (Bachelor UAS track via International UAS Digital Entrance Exam; Master’s requires IELTS 6.5/PTE 62).',
    '',
    '### 4. BMDC Recognized Medical Colleges Abroad & 45 China MOE List',
    `URL: ${url('/bmdc-recognized-medical-colleges-abroad')} · Comparison: ${url('/bangladesh-vs-china-mbbs')}`,
    '- Statutory Pre-Departure Gate (BMDC Act 2010): Bangladeshi citizens studying MBBS/MD abroad who wish to return and sit the BMDC Registration Qualifying Examination (RQE) in Dhaka MUST obtain a pre-departure BMDC Eligibility Certificate (Combined SSC+HSC Science GPA ≥ 7.00, individual ≥ 3.00, HSC Biology GP ≥ 3.50, and HSC passing year within the current or immediate preceding 1–2 years).',
    '- Recognized Foreign Medical Routes: (1) China’s 45 MOE-authorized English-medium public medical universities (tuition CNY 24,000–48,000/yr ≈ BDT 4.5L–9.0L/yr; 2,500–10,000+ bed Grade-3A hospitals; WDOMS listed); (2) Georgia WFME/NCEQE 6-year English MD (USD 5,300–8,000/yr); (3) Croatia EU Directive 2005/36/EC 6-year English MD at Zagreb, Split, Rijeka (EUR 12,000/yr).',
    '',
    '### 5. Document Attestation, MOFA myGov e-Apostille & Legalization in Dhaka',
    `URL: ${url('/document-attestation-apostille-bangladesh')}`,
    '- Sequential Chain: (1) Issuing body verification (Education Board for SSC/HSC, British Council for O/A-Levels, University Controller + UGC Agargaon for BD Bachelor/Master, BTEB for Polytechnic Diploma); (2) Ministry of Education (SHED/TMED) digital verification via myGov.bd; (3) Ministry of Foreign Affairs (MoFA Segunbagicha) QR-coded e-Apostille (1961 Hague Convention) or bilateral Embassy Consular Legalization; (4) Online Police Clearance Certificate (pcc.police.gov.bd) with MoFA QR verification.',
    '',
    '### 6. Country Scholarship Manuals & Founder E-E-A-T Governance',
    `- China Scholarships & 306 CSC Directory: ${url('/china-scholarships-bangladesh')} · ${url('/csc-scholarship-bangladesh')} · ${url('/updates/complete-csc-universities-list-2027')}`,
    `- Malaysia Scholarships (MTCP, MIS, GRA & 10%–75% Sunway/Taylor’s/APU/Monash waivers at BDT 0 service fee): ${url('/malaysia-scholarships-bangladesh')}`,
    `- UK Scholarships (Chevening, Commonwealth, GREAT £10k & £2,000–£8,000 automatic CAS merit discounts): ${url('/uk-scholarships-bangladesh')}`,
    `- Hungary Scholarships (Stipendium Hungaricum dual-portal DreamApply + SHED shed.gov.bd nomination): ${url('/hungary-scholarships-bangladesh')}`,
    `- South Korea Scholarships (Global Korea Scholarship GKS Embassy vs University track & BK21 STEM labs): ${url('/south-korea-scholarships-bangladesh')}`,
    `- Finland Scholarships (100% tuition + €5,000 Finland Scholarship & 20%–50% UAS waivers): ${url('/finland-scholarships-bangladesh')}`,
    `- Chief Editorial Reviewer & Founder Profile: Abdullah Al Rakib (Founder & CEO, EduExpress International since 8 March 2018; PhD Researcher in Computer Application Technology at Nanjing University of Information Science & Technology — NUIST, China; M.Sc. in AI; B.Sc. in Microelectronics Engineering; CBCA Founding Member #08; FACD-CAB FCM-452): ${url('/author/abdullah-al-rakib')}`,
    '',
  ].join('\n') + '\n';
}

export async function buildLlmsFull(): Promise<string> {
  const [office, universities, updates] = await Promise.all([loadOffice(), universityBlock(), updatesBlock()]);
  return [
    '# EduExpress International — full reference for AI assistants',
    '',
    `> Evidence-first study abroad consultancy in Dhanmondi, Dhaka, Bangladesh (since 2018). Generated ${today()} from the live website data; the website is the source of truth.`,
    '',
    companyBlock(office),
    policyBlock,
    `Pricing summary: ${url('/pricing.md')}`,
    `China live data benchmark JSON: ${url('/china-study-report.json')}`,
    `Bangladesh study abroad market JSON: ${url('/bangladesh-study-abroad-market.json')}`,
    '',
    intakeBlock(),
    destinationBlock(),
    malaysiaAndKeyRoutesBlock(),
    decisionAndRegulatoryDirectAnswersBlock(),
    officialAuthoritiesBlock(),
    guideBlock(),
    universities,
    updates,
    evidenceBlock(),
    `## B2B & Institutional Partner Services`,
    '',
    `- [B2B Partner Desk](${url('/b2b')}): dedicated file processing for education agencies, sub-agents, and institutions across China, Malaysia, and active destinations; 24-48h file audits, non-poaching attribution protection, 5-stage SOP, and custom bilateral MOU terms confirmed in writing before submission.`,
    `- [Global Partner Programme](${url('/partnership')}): regional agency, China strategic, and referral cooperation with published China partner service schedule (Type-A Full Funded Scholarship $800, Type-B Tuition Fee Free $600, Type-C Partial Scholarship $500, optional Airport Pickup $150; third-party university/embassy fees separate).`,
    '',
    `## Contact`,
    '',
    `- Free assessment: ${url('/education-fit-assessment')}`,
    `- Contact and office visit: ${url('/contact')}`,
    '',
  ].join('\n').replace(/\n{3,}/g, '\n\n');
}

export async function buildPricing(): Promise<string> {
  const [office, packages] = await Promise.all([loadOffice(), loadPackages()]);
  const cost = chinaGuidePages['study-in-china-cost-bangladesh'];
  const thirdParty = cost?.sections.find(section => /third party/i.test(section.heading));
  const lines: string[] = [
    '# Pricing — EduExpress International',
    '',
    `> Study abroad service fees for students in Bangladesh. Generated ${today()} from the live website data. All amounts as published on ${url('/fees-and-transparency')}.`,
    '',
    '## Free profile assessment',
    '- Price: BDT 0',
    '- What you get: a counsellor reviews your results, budget and preferred country and explains realistic options, costs and documents.',
    `- Start: ${url('/education-fit-assessment')}`,
    '',
    '## Malaysia & United Kingdom (UK) Application Support',
    '- Destinations: Malaysia and United Kingdom (UK)',
    '- Price: BDT 0 EduExpress service fee (100% Free Consultancy)',
    '- Summary: Zero consultancy or file-opening charge from EduExpress for Malaysian and UK university applications, offer letter & CAS follow-up, Pre-CAS interview prep, EMGS Student Pass / UKVI Student Visa guidance, and Bangladesh Bank Student File documentation support.',
    '- Not included (paid directly at published rates): University application/registration fees or CAS deposits, EMGS Student Pass / UKVI visa & IHS charges, SEV visa fee, IOM TB or medical test, air ticket and university tuition paid directly to the institution (via Student File where applicable).',
    `- Details: ${url('/study-in-malaysia-from-bangladesh')} · ${url('/malaysia-study-cost-bangladesh')} · ${url('/study-in-uk-from-bangladesh')} · ${url('/uk-study-cost-bangladesh')}`,
    '',
    '## Other European Destinations Support (Hungary, Finland, Malta, Cyprus, Georgia, Greece, Croatia)',
    '- Destinations: Hungary, Finland, Malta, Cyprus, Georgia, Greece, Croatia',
    '- Price: BDT 0 file-opening charge · BDT 100,000 (1 Lakh Taka) payable 100% after visa approval',
    '- Summary: University admission, scholarship application guidance, Student File & bank solvency preparation, and VFS/Embassy visa guidance across mainland European destinations.',
    `- Details: ${url('/destinations')} · ${url('/education-consultant-dhaka')}`,
    '',
  ];
  for (const item of packages) {
    lines.push(
      `## ${item.title}`,
      `- Destination: ${item.destination}`,
      `- Price: ${item.priceLabel}`,
      `- Summary: ${clean(item.summary)}`,
      `- Payment terms: ${clean(item.paymentTerms)}`,
      `- Refund terms: ${clean(item.refundTerms)}`,
    );
    if (item.includedItems.length) lines.push('- Included:', ...item.includedItems.map(value => `  - ${clean(value)}`));
    if (item.excludedItems.length) lines.push('- Not included (paid separately):', ...item.excludedItems.map(value => `  - ${clean(value)}`));
    if (item.complianceNote) lines.push(`- Note: ${clean(item.complianceNote)}`);
    lines.push('');
  }
  if (thirdParty?.items?.length) {
    lines.push('## Third-party costs that may be due earlier', clean(thirdParty.summary), ...thirdParty.items.map(value => `- ${value}`), '');
  }
  lines.push(
    '## Rules',
    '- China: no EduExpress service fee before China visa approval (BDT 200,000 package after visa).',
    '- Malaysia & United Kingdom (UK): BDT 0 EduExpress service fee; tuition, CAS deposits, EMGS/UKVI/IHS fees are paid directly by the student.',
    '- Other European destinations (Hungary, Finland, Malta, Cyprus, Georgia, Greece, Croatia): BDT 0 file-opening charge; BDT 100,000 service fee payable 100% after visa approval.',
    '- Every cost is listed with item, amount, recipient, due date and refund status before payment.',
    '- No admission, scholarship or visa outcome is guaranteed.',
    '',
    '## Contact',
    office?.phonePrimary ? `- Phone / WhatsApp: ${office.phonePrimary}` : '',
    office?.address ? `- Office: ${clean(office.address)}` : '',
    `- ${url('/contact')}`,
    '',
  );
  return lines.filter((line, index, all) => !(line === '' && all[index - 1] === '')).join('\n');
}
