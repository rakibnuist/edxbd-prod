import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Banknote,
  BookOpen,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  FileText,
  GraduationCap,
  HelpCircle,
  Landmark,
  MapPin,
  Plane,
  Scale,
  School,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/study-in-cyprus-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=Cyprus';
export const revalidate = 3600;

const CYPRUS_OFFICIAL_AUTHORITIES = [
  {
    label: 'Cyprus Agency of Quality Assurance and Accreditation in Higher Education (CYQAA / DIPAE)',
    href: 'https://www.dipae.ac.cy/index.php/en/',
    note: 'Statutory national accreditation authority ensuring higher education institutions and programs adhere to European Higher Education Area (EHEA / Bologna Process) standards.',
  },
  {
    label: 'Civil Registry and Migration Department (Republic of Cyprus)',
    href: 'https://www.moi.gov.cy/crmd',
    note: 'Government authority responsible for Entry Permits (M-Visas), international student temporary residence cards (Pink Slip), and work regulations.',
  },
  {
    label: 'Ministry of Education, Sport and Youth (Republic of Cyprus)',
    href: 'https://www.moec.gov.cy/en/',
    note: 'Governs higher education institutional licensing, degree authenticity, and national scholarship oversight.',
  },
  {
    label: 'Bangladesh Bank Foreign Exchange Policy (Student File Remittance)',
    href: 'https://www.bb.org.bd/',
    note: 'Authorized Dealer (AD) bank rules for legitimate outward educational remittances to recognized Cypriot higher education institutions.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in Cyprus from Bangladesh: Costs, Visa & Universities | EduExpress',
    description:
      'Evidence-first guide to studying in the Republic of Cyprus (EU) from Bangladesh: CYQAA accredited degrees, tuition (EUR 5,000–10,000/yr), Entry Permit requirements, and 20 hrs/week work rights.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('cyprus', 'Study in Cyprus from Bangladesh — EduExpress International'),
  });
}

const CYPRUS_FAQS = [
  {
    question: 'What is the critical distinction between the Republic of Cyprus and Northern Cyprus?',
    answer:
      'The Republic of Cyprus is an internationally recognized sovereign nation, a full member of the European Union (EU) since 2004, and a member of the Bologna Process. Degrees awarded by CYQAA-accredited universities in the Republic of Cyprus (such as University of Cyprus, University of Nicosia, and European University Cyprus) are European degrees recognized worldwide. In contrast, Northern Cyprus (TRNC) is only recognized by Turkey, is outside the EU legal framework, operates under separate migration rules, and does not provide EU legal residence or automatic European credit transfers.',
  },
  {
    question: 'How do Bangladeshi students obtain an Entry Permit (Student Visa) for the Republic of Cyprus?',
    answer:
      'In the Republic of Cyprus, international admissions follow an institutional Entry Permit procedure. Once you are accepted and pay the university deposit (via Authorized Dealer bank Student File wire), the university submits your authenticated dossier (attested police clearance, medical screening, educational certificates with Ministry of Foreign Affairs authentication, and bank solvency statement) directly to the Civil Registry and Migration Department in Nicosia. The Migration Department issues an official Entry Permit (Blue Paper/M-Visa), allowing you to travel to Cyprus. Within days of arrival, you complete biometrics to obtain your Temporary Residence Card (Pink Slip).',
  },
  {
    question: 'What is the bank solvency requirement for a Cyprus student visa from Bangladesh?',
    answer:
      'The Republic of Cyprus Migration Department requires evidence that the student or sponsoring parent holds sufficient funds to cover tuition and living expenses. Typically, an Authorized Dealer bank statement showing an equivalent balance of EUR 7,000 to EUR 8,000 maintained over 3 to 6 months, accompanied by an official bank solvency certificate, is required. In addition, students must show advance tuition deposit payment receipts and comprehensive international medical travel insurance.',
  },
  {
    question: 'Are international students allowed to work part-time in Cyprus?',
    answer:
      'Under Cypriot statutory regulations (aligned with EU directives), full-time non-EU degree students in recognized higher education institutions in the Republic of Cyprus are legally permitted to work up to 20 hours per week during term time and up to 38 hours per week during recognized semester breaks. However, this right activates strictly after completing the first six consecutive months of physical study in Cyprus, and employment is restricted to designated sectors such as hospitality, food services, retail, maintenance, and logistics.',
  },
  {
    question: 'What are the post-study work and career opportunities in Cyprus for Bangladeshi graduates?',
    answer:
      'Cyprus does not grant an automatic open post-study work visa upon graduation. However, non-EU graduates from CYQAA-accredited institutions who secure an employment offer from a registered Cypriot or international company can have their employer apply for a work permit through the Department of Labour and Migration Department. Cyprus is a major European financial, shipping, IT, and fintech hub with thousands of multinational companies operating in Nicosia and Limassol.',
  },
];

export default async function StudyInCyprusPage() {
  const cyprusUnis = await prisma.university.findMany({
    where: {
      country: { in: ['Cyprus', 'cyprus'] },
      isActive: true,
    },
    include: {
      programs: { where: { status: 'active' }, take: 4 },
      scholarships: { where: { status: 'active' }, take: 2 },
      fees: true,
    },
    orderBy: { name: 'asc' },
  });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: '2026-11-26',
        name: 'Study in Cyprus from Bangladesh: Costs, Visa & Universities (2027 Benchmark)',
        description:
          'Official 2026/27 guide: English-taught European degrees, CYQAA accreditation, tuition (EUR 5,000–10,000/yr), Civil Registry and Migration Department entry permit regulations, and work rights.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/cyprus.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(CYPRUS_OFFICIAL_AUTHORITIES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#universities`,
        name: 'Verified Universities in Republic of Cyprus for Bangladeshi Students',
        numberOfItems: cyprusUnis.length,
        itemListElement: cyprusUnis.map((u, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: u.name,
          url: `${SITE}/universities/${u.slug}`,
        })),
      },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      {/* 1 & 2. Page Hero + Breadcrumbs + Value Statement */}
      <PageHero
        path={PATH}
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: 'Cyprus' }]}
        eyebrow="Wave 2 Active Destination · European Union Member State · Mediterranean Academic Center"
        title="Study in Cyprus from Bangladesh: Costs, Visa & Universities."
        lead="The Republic of Cyprus (EU) provides accredited European degree qualifications taught 100% in English at moderate Mediterranean tuition rates (EUR 5,000–10,000/year). Bangladeshi students benefit from globally recognized CYQAA institutional accreditation, legal part-time employment rights after 6 months, and streamlined institutional Entry Permit migration processing directly through university-sponsored immigration files."
        reviewed="November 2026"
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Cyprus Fit Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/cyprus-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Cyprus Cost Guide (EUR &amp; BDT)
            </Link>
            <Link href="/cyprus-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Cyprus Student Visa Guide
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* 3. Who This Country Fits — And Who Should Reconsider */}
      <Section
        id="who-fits"
        tone="white"
        title="Who Cyprus fits — and who should reconsider."
        intro="The Republic of Cyprus offers European Union degree standards and affordable living, but requires clear understanding of jurisdiction, bank solvency, and employment regulations. Read our candid counselor assessment."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-700/20 bg-emerald-50/50 p-6 sm:p-7">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-[18px]">
              <CheckCircle2 className="size-6 text-emerald-700" />
              <span>Ideal for students who:</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Seeking Bologna ECTS EU Qualifications at Moderate Costs:</strong> Tuition at CYQAA-accredited universities ranges between EUR 5,000 and EUR 9,500/year (~BDT 6.5L – 12.35L), approximately 40–50% lower than tuition in Western Europe or Australia.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Targeting Computer Science, Business &amp; Medicine:</strong> Cyprus hosts top faculties in AI, Data Science, Maritime Business, and international medical schools listed in WDOMS (University of Nicosia, European University Cyprus).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Prefer 100% English-Taught Programs:</strong> Programs are delivered entirely in English with international faculties and modern laboratory facilities across Nicosia and Limassol.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Have Demonstrated Family Bank Solvency:</strong> Families able to demonstrate an official bank balance of EUR 7,000–8,000 maintained legitimately in an Authorized Dealer bank account.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-600/20 bg-amber-50/40 p-6 sm:p-7">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-[18px]">
              <ShieldAlert className="size-6 text-amber-600" />
              <span>Who should reconsider:</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Expecting Immediate Part-Time Work:</strong> Under Cypriot immigration directives, international students cannot work during their first 6 months. Living expenses for the initial 6 months must be fully pre-funded.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Expecting an Automatic Post-Study Work Visa:</strong> Cyprus does not issue automatic open PSW visas upon graduation. Staying post-graduation requires direct employer-sponsored work permit sponsorship.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Confusing Republic of Cyprus with Northern Cyprus:</strong> We strictly warn against sub-agents selling unaccredited Northern Cyprus (TRNC) admissions. Northern Cyprus is outside the EU and lacks international degree recognition.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Seeking Schengen Free-Travel Privileges:</strong> While the Republic of Cyprus is a full EU member state, it has not yet completed full Schengen accession. Travel to Schengen states requires a separate visa.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Critical Jurisdiction Guardrail */}
        <div className="mt-8 rounded-2xl border-2 border-petrol-800 bg-petrol-900 p-6 text-white shadow-md">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-xl bg-petrol-800 p-2.5 text-emerald-400">
              <Scale className="size-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Jurisdiction Guardrail: Republic of Cyprus (EU) vs Northern Cyprus
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-sand-200">
                EduExpress International exclusively represents and processes admissions for accredited higher education institutions located within the <strong>Republic of Cyprus</strong> (southern part of the island, EU member state, governed by CYQAA accreditation and European Union law). We do not recruit for unaccredited colleges in Northern Cyprus (TRNC). Degrees from Republic of Cyprus institutions carry full European Credit Transfer System (ECTS) recognition and enable seamless academic progression throughout Europe.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Education System & Recognition */}
      <Section
        id="education-system"
        tone="sage"
        title="CYQAA accreditation &amp; global European degree recognition."
        intro="The higher education system in the Republic of Cyprus is regulated by statutory national authorities aligned with the European Higher Education Area (EHEA / Bologna Process)."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Award className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">CYQAA / DIPAE Accreditation</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              All universities and degree programs are accredited by the Cyprus Agency of Quality Assurance and Accreditation in Higher Education (CYQAA), a full member of ENQA. All awards carry full European Bologna equivalence.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <BookOpen className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">ECTS Credit Framework</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Degrees follow strict ECTS standards: 240 ECTS for 4-year Bachelor’s, 90–120 ECTS for 1.5–2 year Master’s, and 360 ECTS for 6-year Medical Degrees (MD), allowing easy credit transfer across Europe.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Landmark className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Worldwide &amp; Bangladesh Equivalence</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Degrees are recognized by UK ENIC, WES (World Education Services) for Canadian evaluation, and the University Grants Commission (UGC) of Bangladesh for government, civil service, and academic appointments.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Verified Institutions in Republic of Cyprus */}
      <Section
        id="universities"
        tone="white"
        title="4 verified higher education institutions in Republic of Cyprus."
        intro="EduExpress International verifies institutional accreditation on the official CYQAA national registry. Here are the 4 verified universities offering English-taught degrees for Bangladeshi students."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {cyprusUnis.map((uni) => (
            <div
              key={uni.id}
              className="flex flex-col justify-between rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs hover:border-petrol-800/35 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-600/20">
                      CYQAA Accredited · Republic of Cyprus (EU)
                    </span>
                    <h3 className="mt-2 font-display text-[20px] font-bold text-petrol-800">
                      <Link href={`/universities/${uni.slug}`} className="hover:underline">
                        {uni.name}
                      </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-soft">
                      <MapPin size={13} className="text-petrol-800" /> {uni.city || 'Nicosia'}, Cyprus
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-sand-50/70 p-3 text-[13px]">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">Tuition Range</span>
                    <p className="font-bold text-petrol-800">{uni.tuition || 'EUR 5,000 – 10,000 / yr'}</p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">Intakes</span>
                    <p className="font-bold text-petrol-800">{uni.intake || 'September & February'}</p>
                  </div>
                </div>

                {uni.programs.length > 0 && (
                  <div className="mt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                      Featured English Programs:
                    </span>
                    <ul className="mt-2 space-y-1.5 text-[13px] text-slate-800">
                      {uni.programs.slice(0, 3).map((prog) => (
                        <li key={prog.id} className="flex items-start gap-2">
                          <BookOpen size={14} className="mt-0.5 shrink-0 text-emerald-700" />
                          <span>
                            <strong>{prog.name}</strong> ({prog.level}) —{' '}
                            <span className="text-ink-soft">{prog.tuition}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {uni.scholarships.length > 0 && (
                  <div className="mt-4 rounded-xl border border-emerald-600/20 bg-emerald-50/50 p-3 text-[12.5px] text-emerald-950">
                    <span className="flex items-center gap-1 font-bold text-emerald-800">
                      <Sparkles size={14} /> Merit Scholarship Available:
                    </span>
                    <p className="mt-0.5 leading-5 text-emerald-900">
                      {uni.scholarships[0].title}: {uni.scholarships[0].amount || 'Partial tuition waiver'} (
                      {uni.scholarships[0].condition || 'Evaluated on academic merits at admission'}).
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[13px]">
                <Link
                  href={`/universities/${uni.slug}`}
                  className="font-bold text-petrol-800 hover:text-emerald-700 inline-flex items-center gap-1"
                >
                  Explore University Programs <ArrowRight size={14} />
                </Link>
                {uni.officialUrl && (
                  <a
                    href={uni.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-ink-soft hover:text-petrol-800 inline-flex items-center gap-1"
                  >
                    Official Portal <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Admission Requirements for Bangladeshi Students */}
      <Section
        id="admissions"
        tone="sage"
        title="Admission requirements for Bangladeshi applicants."
        intro="Clear, verified entry criteria for undergraduate and postgraduate degrees at CYQAA-accredited institutions in the Republic of Cyprus."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <School className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Undergraduate (Bachelor's)</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>Academic:</strong> Higher Secondary Certificate (HSC) with minimum GPA 3.00/5.00, or GCE A-Levels (minimum 2 passes).</li>
              <li>• <strong>Attestation:</strong> Board certificates & marksheets attested by Education Ministry and MOFA Dhaka.</li>
              <li>• <strong>Police Clearance:</strong> Clean certificate issued by Bangladesh Police, authenticated by MOFA.</li>
              <li>• <strong>Passport:</strong> Valid for at least 2 full years beyond intended date of arrival.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <GraduationCap className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Postgraduate (Master's / MBA)</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>Academic:</strong> 4-year Bachelor’s degree from a UGC-recognized university with minimum CGPA 2.50/4.00.</li>
              <li>• <strong>Attestation:</strong> Complete semester-wise academic transcripts authenticated by University Registrar and MOFA.</li>
              <li>• <strong>Statement of Purpose:</strong> 500–800 words detailing academic focus and long-term career rationale.</li>
              <li>• <strong>References:</strong> 2 formal letters of recommendation from former university professors.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <FileText className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">English Language Standards</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>Standard Requirement:</strong> IELTS 5.5–6.0 (Bachelor's) or 6.0–6.5 (Master's), or equivalent TOEFL/PTE scores.</li>
              <li>• <strong>Medium of Instruction Waiver:</strong> Available for students from verified English-medium backgrounds (A-Levels / English-medium universities).</li>
              <li>• <strong>Internal Assessment:</strong> Several universities offer internal online English screening interviews or placement exams upon arrival.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7. Total Cost & Funding Reality */}
      <Section
        id="costs"
        tone="white"
        title="Complete annual cost structure (Tuition + Living)."
        intro="Realistic expenditure estimates in Euros (EUR) and Bangladeshi Taka (BDT) based on actual living costs in Nicosia and Limassol."
      >
        <div className="overflow-hidden rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-sand-50/80 text-petrol-800 font-bold border-b border-petrol-800/10">
                <tr>
                  <th className="px-5 py-4">Expense Category</th>
                  <th className="px-5 py-4">Annual / Monthly in EUR</th>
                  <th className="px-5 py-4">Equivalent in BDT (Approx.)</th>
                  <th className="px-5 py-4">Payment Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Tuition Fees (Standard UG / PG)</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-800">€5,000 – €9,500 / year</td>
                  <td className="px-5 py-3.5 font-semibold text-petrol-800">6.50 – 12.35 Lakh BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Paid semester-wise via AD Bank Student File</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Tuition Fees (Medicine / Dentistry)</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-800">€19,000 – €23,000 / year</td>
                  <td className="px-5 py-3.5 font-semibold text-petrol-800">24.70 – 29.90 Lakh BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Specialized 6-year European medical degree</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Student Accommodation (Shared Flat)</td>
                  <td className="px-5 py-3.5">€250 – €450 / month</td>
                  <td className="px-5 py-3.5">32,500 – 58,500 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Shared student flat in Nicosia or Limassol</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Food &amp; Groceries</td>
                  <td className="px-5 py-3.5">€150 – €250 / month</td>
                  <td className="px-5 py-3.5">19,500 – 32,500 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Self-cooking fresh Mediterranean groceries</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Utilities, Mobile &amp; Transit</td>
                  <td className="px-5 py-3.5">€80 – €120 / month</td>
                  <td className="px-5 py-3.5">10,400 – 15,600 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Electricity, water, mobile data &amp; student bus pass</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Migration Registration (Pink Slip)</td>
                  <td className="px-5 py-3.5">€150 – €300 (One-time)</td>
                  <td className="px-5 py-3.5">19,500 – 39,000 BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Paid to Civil Registry &amp; Migration Dept in Cyprus</td>
                </tr>
                <tr className="bg-sand-50/60 font-bold text-petrol-800">
                  <td className="px-5 py-4">Total Estimated First-Year Budget</td>
                  <td className="px-5 py-4 text-emerald-800">€11,500 – €18,500</td>
                  <td className="px-5 py-4 text-petrol-800">14.95 – 24.05 Lakh BDT</td>
                  <td className="px-5 py-4 text-[13px] font-normal text-ink-soft">Includes full tuition + 12 months comprehensive living</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 bg-sand-50/40 p-4 text-[13px] text-ink-soft">
            <p>
              <strong>Official Bangladesh Bank Remittance Rule:</strong> All tuition payments must be wired directly from an authorized commercial bank in Bangladesh via an approved <strong>Student File</strong> directly to the verified IBAN account of the licensed Cypriot university. EduExpress International never accepts cash or personal account transfers for university tuition fees.
            </p>
          </div>
        </div>

        {/* Dedicated Cost Guide Callout Card */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-petrol-800 text-white">
              <Banknote size={24} />
            </div>
            <div>
              <h4 className="font-display text-base font-bold text-petrol-800">
                Need an Itemized BDT &amp; EUR Cost Breakdown for Cyprus?
              </h4>
              <p className="mt-1 text-xs text-ink-soft">
                Read our complete Cyprus Study Cost Guide: University of Cyprus vs private colleges, CRMD bank solvency rules (€7,000–8,000), monthly living expenses, and 20 hrs/week student work rights.
              </p>
            </div>
          </div>
          <Link
            href="/cyprus-study-cost-bangladesh"
            className="ed-btn ed-btn-signal min-h-[46px] px-6 text-xs font-bold"
          >
            Read Cyprus Cost Guide <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </Section>

      {/* 8. Visa & Entry Permit Process */}
      <Section
        id="visa-process"
        tone="sage"
        title="Republic of Cyprus Entry Permit (M-Visa) roadmap."
        intro="Step-by-step institutional migration processing governed by the Civil Registry and Migration Department in Nicosia."
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              01
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Admission &amp; MOFA Attestation</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Secure unconditional admission. Concurrently attest all educational certificates, transcripts, clean police clearance, and medical test reports at the Ministry of Foreign Affairs (MOFA) Dhaka.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              02
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Tuition Wire &amp; Bank Solvency</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Open an authorized Student File and remit the required initial deposit to the university IBAN. Obtain an official Bank Solvency Certificate showing €7,000–€8,000 equivalent balance maintained by student or parents.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              03
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Migration Entry Permit (Blue Paper)</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              The university submits your completed dossier directly to the Migration Department in Nicosia. Upon review, the Migration Department issues an official <strong>Entry Permit (Blue Paper)</strong> authorizing your flight to Cyprus.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              04
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Arrival &amp; Biometric Residence (Pink Slip)</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Upon arriving at Larnaca or Paphos Airport, border police verify your Entry Permit. Within 7–10 days, you complete local health screening and submit biometrics for your <strong>Temporary Residence Card (Pink Slip)</strong>.
            </p>
          </div>
        </div>
      </Section>

      {/* 9. Work Rights & Post-Study Pathways */}
      <Section
        id="work-rights"
        tone="white"
        title="Part-time employment rights &amp; post-graduation careers."
        intro="Understanding statutory work restrictions during studies and realistic employer-sponsored transition paths post-graduation."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-petrol-800 text-[18px]">
              <Clock className="size-6 text-petrol-800" />
              <span>Student Work Regulations (20 hrs/week)</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>20 Hours Per Week:</strong> Non-EU students in full-time accredited degree programs can legally work up to 20 hours/week during term time and up to 38 hours/week during recognized breaks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Mandatory 6-Month Waiting Period:</strong> By statutory law, employment rights activate strictly <em>after completing 6 consecutive months</em> of physical study in Cyprus.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Permitted Employment Sectors:</strong> Tourism, hotels, catering, restaurants, delivery services, retail shops, and general maintenance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Realistic Earnings:</strong> Typical wages range from €5.00 to €7.50 per hour, providing roughly €400 to €600 per month to help offset living expenses.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-petrol-800 text-[18px]">
              <Building2 className="size-6 text-petrol-800" />
              <span>Post-Study Careers &amp; Work Permits</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Corporate Hub of the Mediterranean:</strong> Nicosia and Limassol host over 2,000 multinational corporations in fintech, software development, maritime shipping, and international banking.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Employer-Sponsored Work Permits:</strong> While Cyprus does not offer an automatic open graduate visa, graduates who receive a qualifying job offer are sponsored for a General Employment Residence Permit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>High-Demand Fields:</strong> Computer Science, Cybersecurity, AI, International Business, Maritime Logistics, and Hospitality Management have strong local employer demand.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>European Academic Mobility:</strong> ECTS-accredited qualifications allow seamless progression into Master's or PhD programs across Germany, Sweden, France, and other EU member states.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 10. Intake Calendar & Deadlines */}
      <Section
        id="intakes"
        tone="sage"
        title="Application calendar &amp; key intake deadlines."
        intro="Plan your application timeline for Cyprus higher education admissions and migration processing."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-600/20">
                Primary Intake
              </span>
              <span className="text-[12px] font-semibold text-ink-soft">All Faculties Open</span>
            </div>
            <h3 className="mt-3 font-display text-[18px] font-bold text-petrol-800">Autumn Intake (September / October)</h3>
            <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">
              The primary academic intake offering 100% of Bachelor’s, Master’s, Medicine, and PhD programs.
            </p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-ink-soft">Application Window:</span>
                <span className="font-bold text-petrol-800">February – June</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Attestation &amp; Deposit Wire:</span>
                <span className="font-bold text-petrol-800">May – July</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Migration Entry Permit Issuance:</span>
                <span className="font-bold text-petrol-800">July – August</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Arrival &amp; Orientation:</span>
                <span className="font-bold text-petrol-800">Mid-September</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-petrol-50 px-2.5 py-0.5 text-[11px] font-bold text-petrol-800 border border-petrol-800/20">
                Secondary Intake
              </span>
              <span className="text-[12px] font-semibold text-ink-soft">Select Programs Open</span>
            </div>
            <h3 className="mt-3 font-display text-[18px] font-bold text-petrol-800">Spring Intake (February)</h3>
            <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">
              Ideal for students completing HSC or degree results in late autumn; available for Business, IT, and Humanities.
            </p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-ink-soft">Application Window:</span>
                <span className="font-bold text-petrol-800">September – November</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Attestation &amp; Deposit Wire:</span>
                <span className="font-bold text-petrol-800">October – December</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Migration Entry Permit Issuance:</span>
                <span className="font-bold text-petrol-800">December – January</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Arrival &amp; Orientation:</span>
                <span className="font-bold text-petrol-800">Late January / Early February</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 11. Comparison with European Alternatives */}
      <Section
        id="comparison"
        tone="white"
        title="Comparing Cyprus with European alternatives."
        intro="How studying in the Republic of Cyprus compares against Malta and Hungary for Bangladeshi students."
      >
        <div className="overflow-hidden rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-sand-50/80 text-petrol-800 font-bold border-b border-petrol-800/10">
              <tr>
                <th className="px-5 py-4">Key Criteria</th>
                <th className="px-5 py-4 bg-emerald-50/60 text-emerald-950 font-bold">Republic of Cyprus (EU)</th>
                <th className="px-5 py-4">Malta</th>
                <th className="px-5 py-4">Hungary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Language of Instruction</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">100% English</td>
                <td className="px-5 py-3.5">100% English (Official Language)</td>
                <td className="px-5 py-3.5">English-taught degree programs</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Annual Tuition (Standard UG/PG)</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">€5,000 – €9,500 / year</td>
                <td className="px-5 py-3.5">€6,000 – €12,000 / year</td>
                <td className="px-5 py-3.5">€3,500 – €8,000 / year</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Monthly Living Cost</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">€500 – €800 / month</td>
                <td className="px-5 py-3.5">€700 – €1,000 / month</td>
                <td className="px-5 py-3.5">€450 – €700 / month</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Visa / Entry Procedure</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">Institutional Entry Permit (Blue Paper)</td>
                <td className="px-5 py-3.5">Identità Malta Type-D (VFS New Delhi)</td>
                <td className="px-5 py-3.5">Hungarian Embassy New Delhi / VFS</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Student Work Rights</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">20 hrs/week (after 6 months)</td>
                <td className="px-5 py-3.5">20 hrs/week (Jobsplus licence after 90 days)</td>
                <td className="px-5 py-3.5">30 hrs/week during term</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">European Schengen Status</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 text-ink-soft">EU member; Schengen accession pending</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">Full Schengen member</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">Full Schengen member</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 12. FAQ Section */}
      <Section id="faqs" tone="sage" title="Frequently asked questions about studying in Cyprus.">
        <FaqBlock items={CYPRUS_FAQS} />
      </Section>

      {/* 13. Official Sources & Review Ownership */}
      <Section id="sources" tone="white" title="Statutory sources &amp; editorial review ownership.">
        <div className="grid gap-4 sm:grid-cols-2">
          {CYPRUS_OFFICIAL_AUTHORITIES.map((src) => (
            <a
              key={src.href}
              href={src.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between rounded-2xl border border-petrol-800/15 bg-white p-4 transition hover:border-petrol-800/40 hover:shadow-xs"
            >
              <div>
                <span className="flex items-center justify-between text-[14.5px] font-bold text-petrol-800">
                  {src.label} <ExternalLink size={14} className="text-ink-soft" />
                </span>
                <p className="mt-1 text-[13px] leading-5 text-ink-soft">{src.note}</p>
              </div>
              <span className="mt-3 text-[12px] font-semibold text-emerald-700">Inspect official guidance →</span>
            </a>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-petrol-800/10 bg-white p-4 text-[13px] text-ink-soft">
          <p>
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content reviewed against official CYQAA institutional accreditation registers, Civil Registry and Migration Department international student guidelines, and Bangladesh Bank foreign exchange rules. Last verified on 26 November 2026. Next scheduled review: 26 February 2027.
          </p>
        </div>
      </Section>

      {/* 14. CTA Band & Education Fit Assessment */}
      <Section id="assessment" tone="sage" title="Assess your Cyprus admission &amp; student visa readiness.">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="Ready to evaluate your Cyprus university options?"
        text="Book an in-person session at our Dhanmondi office or schedule a video consultation. We audit your academic profile, verify university CYQAA accreditation, and structure your Migration Department compliant financial dossier."
        assessmentHref={applyHref}
        assessmentLabel="Start Application Assessment"
      />
    </article>
  );
}
