import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Landmark,
  MapPin,
  Scale,
  School,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/study-in-georgia-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=Georgia';
export const revalidate = 3600;

const GEORGIA_OFFICIAL_AUTHORITIES = [
  {
    label: 'National Center for Educational Quality Enhancement (NCEQE Georgia)',
    href: 'https://eqe.ge/en',
    note: 'Statutory national accreditation agency under the Ministry of Education and Science of Georgia; recognized by the World Federation for Medical Education (WFME) and full member of ENQA.',
  },
  {
    label: 'Ministry of Education, Science and Youth of Georgia',
    href: 'https://mes.gov.ge/',
    note: 'Issues the official Ministerial Order for international student enrollment recognition required for Georgia D3 Study Visa issuance.',
  },
  {
    label: 'Ministry of Foreign Affairs of Georgia (E-Visa / Consular Portal)',
    href: 'https://www.geoconsul.gov.ge/en',
    note: 'Governs immigration protocols, D3 National Study Visa issuance, and overseas consular attestation procedures.',
  },
  {
    label: 'World Directory of Medical Schools (WDOMS)',
    href: 'https://www.wdoms.org/',
    note: 'Global public directory of medical schools; verification requirement for international licensing examinations (USMLE, PLAB/UKMLA, and BMDC RQE).',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in Georgia from Bangladesh: Costs, Visa & Universities | EduExpress',
    description:
      'Evidence-first guide to studying in Georgia from Bangladesh: 6-year English MD/MBBS, NCEQE & WFME accreditation, tuition (USD 3,500–8,000/yr), D3 Visa process, and BMDC licensing rules.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('georgia', 'Study in Georgia from Bangladesh — EduExpress International'),
  });
}

const GEORGIA_FAQS = [
  {
    question: 'Is a Medical Doctor (MD) degree from Georgia equivalent to MBBS in Bangladesh?',
    answer:
      'Yes. In Georgia and across continental Europe, the primary medical qualification is awarded as a single-cycle 6-year Medical Doctor (MD) degree comprising 360 ECTS credits. This program is identical in scope, clinical rotations, and curriculum to the British-heritage Bachelor of Medicine, Bachelor of Surgery (MBBS). The degree is listed in the World Directory of Medical Schools (WDOMS) and recognized by the World Federation for Medical Education (WFME). Upon graduation, Bangladeshi students must sit and pass the Bangladesh Medical and Dental Council (BMDC) Registration Qualifying Examination (RQE) to obtain full medical practice registration in Bangladesh.',
  },
  {
    question: 'What is the BMDC eligibility rule for studying medicine in Georgia?',
    answer:
      'Under BMDC regulations, students seeking medical education abroad must meet specific pre-requisites: passing SSC and HSC (Science) with minimum combined GPA 7.00 (with no GPA below 3.00), a minimum GPA of 3.50 in Biology at HSC, and having studied Physics, Chemistry, and Biology. Students must obtain a formal BMDC Eligibility Certificate prior to departure. We strongly advise all prospective medical students to audit their qualifications against the latest BMDC foreign medical circular before paying university deposits.',
  },
  {
    question: 'How do Bangladeshi students obtain a Georgia D3 Student Visa?',
    answer:
      'After receiving admission, the university submits the student’s attested educational certificates, transcripts, police clearance, and passport to the National Center for Educational Quality Enhancement (NCEQE) and the Ministry of Education of Georgia to obtain an official Ministerial Enrollment Order. Once the order is issued and the initial tuition payment is wired via an Authorized Dealer bank Student File, the student applies for a National D3 Immigration Study Visa (through the Georgian consular portal or designated VFS center). Upon arrival in Tbilisi, the student applies for a Georgian Temporary Residence Card (TRC) within 45 days.',
  },
  {
    question: 'What is the living cost in Tbilisi for international students?',
    answer:
      'Georgia remains one of the most affordable study destinations in the European educational area. Monthly living expenses for international students in Tbilisi typically range between USD 350 and USD 600 (approximately 42,000 to 72,000 BDT). This covers shared student apartment rent (USD 200–350/month), groceries and food (USD 120–180/month), metro and transit pass (USD 10–15/month), and mobile internet and utilities (USD 30–50/month).',
  },
  {
    question: 'Can international students work part-time in Georgia?',
    answer:
      'While students holding a valid Georgian Temporary Residence Card (TRC) have legal permission to work in Georgia, practical employment options for non-Georgian speakers are limited. English-language part-time positions exist mainly in online customer support, remote IT, content creation, and international call centers in Tbilisi. Students must not rely on local part-time earnings to fund university tuition fees or essential living costs.',
  },
];

export default async function StudyInGeorgiaPage() {
  const georgiaUnis = await prisma.university.findMany({
    where: {
      country: { in: ['Georgia', 'georgia'] },
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
        name: 'Study in Georgia from Bangladesh: Costs, Visa & Universities (2027 Benchmark)',
        description:
          'Official 2026/27 guide: English-medium MD/MBBS, Computer Science and Business degrees, NCEQE & WFME accreditation, tuition (USD 3,500–8,000/yr), D3 Visa process, and BMDC licensing rules.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/georgia.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(GEORGIA_OFFICIAL_AUTHORITIES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#universities`,
        name: 'Verified Universities in Georgia for Bangladeshi Students',
        numberOfItems: georgiaUnis.length,
        itemListElement: georgiaUnis.map((u, i) => ({
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
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: 'Georgia' }]}
        eyebrow="Wave 2 Active Destination · European Higher Education Area · WFME-Accredited Medical Education"
        title="Study in Georgia from Bangladesh: Costs, Visa & Universities."
        lead="Georgia offers globally accredited European higher education in the historic capital of Tbilisi. Taught 100% in English, Georgia's premier medical and technology faculties feature low annual tuition (USD 3,500–8,000/year), WFME-recognized 6-year MD (MBBS equivalent) programs, affordable living costs (USD 350–600/month), and direct ministerial admission recognition."
        reviewed="November 2026"
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Georgia Eligibility Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#universities" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              View 4 Verified Institutions
            </a>
            <Link href="/georgia-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Full Cost Guide
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* 3. Who This Country Fits — And Who Should Reconsider */}
      <Section
        id="who-fits"
        tone="white"
        title="Who Georgia fits — and who should reconsider."
        intro="Georgia is a high-value destination for medical, computer science, and business education, but requires strict adherence to BMDC prerequisites and pre-funded living resources. Read our candid counselor assessment."
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
                <span><strong>Targeting 100% English MD / MBBS Degrees:</strong> Georgia is a global hub for medical education. 6-year single-cycle MD programs are taught completely in English, listed in WDOMS, and accredited by NCEQE under WFME standards.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Seeking European ECTS Standards at Accessible Costs:</strong> Tuition for Bachelor's in CS, Engineering, and Business ranges between USD 3,500 and USD 4,500/year (~BDT 4.2L – 5.4L), with Medical Doctor tuition between USD 5,500 and USD 8,000/year.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Planning International Medical Licensing:</strong> Programs at TSMU, TSU, Ilia, and UG prepare students for USMLE (USA), PLAB/UKMLA (UK), AMC (Australia), and the BMDC Registration Qualifying Exam (Bangladesh).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Value a Safe, Welcoming European Environment:</strong> Tbilisi consistently ranks among Europe's safest metropolitan capitals, with low crime rates, modern transit, and a vibrant international student community.</span>
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
                <span><strong>Medical Aspirants Without BMDC Minimum Eligibility:</strong> Students who lack SSC+HSC combined GPA 7.00 or Biology minimum GPA 3.50 will NOT be eligible for BMDC registration in Bangladesh upon return.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Students Expecting to Finance Studies via Local Jobs:</strong> While TRC holders have the legal right to work, local jobs require fluency in Georgian. English-only part-time jobs are scarce. Families must fully pre-fund tuition and living costs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Expecting Automatic European PR / Post-Study Visas:</strong> Georgia is part of the European Higher Education Area (EHEA) but is not an EU member state. Post-graduation stay requires direct corporate employment sponsorship.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Looking for Unaccredited Low-Cost Colleges:</strong> We strictly warn against unlicensed private institutes in Georgia lacking NCEQE institutional accreditation or WDOMS listing for medicine.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Critical BMDC & Medical Education Guardrail */}
        <div className="mt-8 rounded-2xl border-2 border-petrol-800 bg-petrol-900 p-6 text-white shadow-md">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-xl bg-petrol-800 p-2.5 text-emerald-400">
              <Stethoscope className="size-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Medical Education Guardrail: NCEQE, WFME, WDOMS &amp; BMDC Compliance
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-sand-200">
                Medical Doctor (MD) programs at our verified Georgian partner universities are 6-year single-cycle programs (360 ECTS credits) listed in the World Directory of Medical Schools (WDOMS) and accredited by NCEQE under World Federation for Medical Education (WFME) standards. For Bangladeshi students, practicing medicine in Bangladesh requires complying with Bangladesh Medical and Dental Council (BMDC) foreign medical eligibility criteria prior to departure and passing the BMDC Registration Qualifying Examination (RQE) upon return. EduExpress conducts mandatory pre-admission eligibility audits for every medical applicant.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Education System & Recognition */}
      <Section
        id="education-system"
        tone="sage"
        title="European Higher Education Area (EHEA) alignment &amp; NCEQE standards."
        intro="The Georgian higher education system adheres to the Bologna Process, granting ECTS credits and degrees recognized across Europe and internationally."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Award className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">NCEQE National Accreditation</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              All higher education programs are accredited by the National Center for Educational Quality Enhancement (NCEQE), a full member of ENQA. NCEQE’s medical school accreditation holds formal recognition from the World Federation for Medical Education (WFME).
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <BookOpen className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">ECTS Credit Framework</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Qualifications strictly follow European ECTS norms: 240 ECTS for 4-year Bachelor’s degrees, 120 ECTS for 2-year Master’s degrees, and 360 ECTS for 6-year Medical Doctor (MD) single-cycle degrees.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Landmark className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Global Medical Licensing Pathway</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Graduates from WDOMS-listed medical faculties are eligible to sit for international licensing exams: USMLE (United States), PLAB/UKMLA (United Kingdom), AMC (Australia), and the BMDC RQE in Bangladesh.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Verified Institutions in Georgia */}
      <Section
        id="universities"
        tone="white"
        title="4 verified higher education institutions in Georgia."
        intro="EduExpress International represents premier state and accredited private universities in Tbilisi, verified on the official NCEQE registry and WDOMS."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {georgiaUnis.map((uni) => (
            <div
              key={uni.id}
              className="flex flex-col justify-between rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs hover:border-petrol-800/35 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-600/20">
                      NCEQE Accredited · WDOMS Listed
                    </span>
                    <h3 className="mt-2 font-display text-[20px] font-bold text-petrol-800">
                      <Link href={`/universities/${uni.slug}`} className="hover:underline">
                        {uni.name}
                      </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-soft">
                      <MapPin size={13} className="text-petrol-800" /> {uni.city || 'Tbilisi'}, Georgia
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-sand-50/70 p-3 text-[13px]">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">Tuition Range</span>
                    <p className="font-bold text-petrol-800">{uni.tuition || 'USD 3,500 – 8,000 / yr'}</p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">Intakes</span>
                    <p className="font-bold text-petrol-800">{uni.intake || 'September & March'}</p>
                  </div>
                </div>

                {uni.programs.length > 0 && (
                  <div className="mt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                      Featured English-Taught Programs:
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
                      <Sparkles size={14} /> Merit Grant / Fee Note:
                    </span>
                    <p className="mt-0.5 leading-5 text-emerald-900">
                      {uni.scholarships[0].title}: {uni.scholarships[0].amount || 'Academic performance waiver'} (
                      {uni.scholarships[0].condition || 'Annual evaluation based on university academic standing'}).
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
        intro="Prerequisites, document attestations, and language requirements for medical and non-medical programs in Georgia."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Stethoscope className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Medical Doctor (MD / MBBS)</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>Academic:</strong> HSC Science with Biology, Physics, and Chemistry. Minimum GPA 3.50 in Biology.</li>
              <li>• <strong>BMDC Eligibility:</strong> Combined SSC+HSC minimum GPA 7.00 with BMDC Eligibility Certificate.</li>
              <li>• <strong>Attestation:</strong> Board certificates, marksheets, and clean police clearance attested by Education Board, MOE, and MOFA Dhaka.</li>
              <li>• <strong>Interview:</strong> Online oral screening interview in basic English and natural sciences.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <School className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Non-Medical Undergraduate (CS / BBA)</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>Academic:</strong> Higher Secondary Certificate (HSC) in any discipline with minimum GPA 2.80/5.00, or GCE A-Levels.</li>
              <li>• <strong>Attestation:</strong> Academic documents authenticated by MOFA Dhaka.</li>
              <li>• <strong>Passport:</strong> Minimum 2 years validity from planned date of departure.</li>
              <li>• <strong>Police Clearance:</strong> Clean certificate issued by Bangladesh Police, authenticated by MOFA.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <FileText className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">English Language Standards</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>University Oral Interview:</strong> Most Georgian universities conduct a recorded Skype/Zoom oral English screening test.</li>
              <li>• <strong>Standard Scores (Optional):</strong> IELTS 5.5–6.0 or TOEFL iBT 70+ exempts students from the university English exam.</li>
              <li>• <strong>English Medium Waiver:</strong> Available for applicants with verified English-medium secondary schooling (A-Levels / English Version HSC).</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7. Total Cost & Funding Reality */}
      <Section
        id="costs"
        tone="white"
        title="Complete annual cost structure (Tuition + Living)."
        intro="Itemized annual expenditure estimates in US Dollars (USD) and Bangladeshi Taka (BDT) based on actual student budgets in Tbilisi."
      >
        <div className="overflow-hidden rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-sand-50/80 text-petrol-800 font-bold border-b border-petrol-800/10">
                <tr>
                  <th className="px-5 py-4">Expense Category</th>
                  <th className="px-5 py-4">Annual / Monthly in USD</th>
                  <th className="px-5 py-4">Equivalent in BDT (Approx.)</th>
                  <th className="px-5 py-4">Payment Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Medical Doctor Tuition (6-Year MD)</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-800">USD 5,500 – USD 8,000 / year</td>
                  <td className="px-5 py-3.5 font-semibold text-petrol-800">6.60 – 9.60 Lakh BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Paid semester-wise via AD Bank Student File</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Computer Science / Business Tuition</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-800">USD 3,500 – USD 4,500 / year</td>
                  <td className="px-5 py-3.5 font-semibold text-petrol-800">4.20 – 5.40 Lakh BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Standard non-medical international rate</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Student Accommodation (Shared Apartment)</td>
                  <td className="px-5 py-3.5">USD 200 – USD 350 / month</td>
                  <td className="px-5 py-3.5">24,000 – 42,000 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Furnished flat near metro stations in Tbilisi</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Food &amp; Daily Groceries</td>
                  <td className="px-5 py-3.5">USD 120 – USD 180 / month</td>
                  <td className="px-5 py-3.5">14,400 – 21,600 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Fresh local vegetables, dairy, poultry, and rice</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Utilities, Transit &amp; Mobile Internet</td>
                  <td className="px-5 py-3.5">USD 40 – USD 70 / month</td>
                  <td className="px-5 py-3.5">4,800 – 8,400 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Electricity, heating, unlimited 4G SIM &amp; metro card</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">NCEQE Recognition, Visa &amp; TRC Registration</td>
                  <td className="px-5 py-3.5">USD 500 – USD 800 (Year 1)</td>
                  <td className="px-5 py-3.5">60,000 – 96,000 BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">NCEQE ministerial recognition + D3 Visa + TRC</td>
                </tr>
                <tr className="bg-sand-50/60 font-bold text-petrol-800">
                  <td className="px-5 py-4">Total First-Year Medical Budget</td>
                  <td className="px-5 py-4 text-emerald-800">USD 10,200 – USD 15,000</td>
                  <td className="px-5 py-4 text-petrol-800">12.24 – 18.00 Lakh BDT</td>
                  <td className="px-5 py-4 text-[13px] font-normal text-ink-soft">Includes MD tuition + 12 months comprehensive living</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 bg-sand-50/40 p-4 text-[13px] text-ink-soft">
            <p>
              <strong>Official Bangladesh Bank Remittance Protocol:</strong> Educational remittances to Georgia must be executed through an Authorized Dealer commercial bank in Bangladesh via an approved <strong>Student File</strong> opened under Bangladesh Bank foreign exchange guidelines. Funds wire directly to the university’s verified official SWIFT/IBAN account. EduExpress never accepts cash or personal payments for university tuition.
            </p>
          </div>

          {/* Deep-Dive Cost Guide Callout */}
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Itemized Cost Breakdown · 2027 Benchmark
              </span>
              <h3 className="text-base font-bold text-petrol-800">
                Deep Dive: Georgia Study Cost Guide (/georgia-study-cost-bangladesh)
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Explore comprehensive tuition fee schedules across TSMU, TSU, Iliauni and UG, NCEQE ministerial recognition, National D3 Visa bank solvency rules ($3,500–$5,000), Tbilisi student living budgets, and BMDC licensing guidelines.
              </p>
            </div>
            <Link
              href="/georgia-study-cost-bangladesh"
              className="ed-btn ed-btn-signal min-h-[48px] px-6 text-xs font-bold whitespace-nowrap shrink-0"
            >
              Read Georgia Cost Guide <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Section>

      {/* 8. Visa & D3 Study Visa Roadmap */}
      <Section
        id="visa-process"
        tone="sage"
        title="Georgia National D3 Study Visa &amp; TRC roadmap."
        intro="Step-by-step immigration protocol from ministerial recognition to the Tbilisi Temporary Residence Card."
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              01
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Admission &amp; MOFA Attestation</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Pass university English interview. Attest SSC &amp; HSC certificates, transcripts, clean police clearance, and medical reports at Education Ministry and MOFA Dhaka.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              02
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">NCEQE Ministerial Recognition</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              The university translates your attested documents into Georgian and submits them to NCEQE. The Ministry of Education issues your official Ministerial Enrollment Order.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              03
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Tuition Wire &amp; D3 Visa Issuance</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Remit initial tuition via AD Bank Student File. Apply for the National D3 Study Visa via the Georgian E-Visa/consular system, accompanied by bank solvency and enrollment order.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              04
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Arrival &amp; Temporary Residence (TRC)</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Fly into Tbilisi International Airport on your D3 Visa. Within 45 days, visit the Public Service Hall in Tbilisi to submit biometrics and collect your biometric plastic TRC card.
            </p>
          </div>
        </div>
      </Section>

      {/* 9. Work Rights & Post-Study Career Realities */}
      <Section
        id="work-rights"
        tone="white"
        title="Part-time employment realities &amp; medical licensing paths."
        intro="Honest counselor guidance on working in Georgia during studies and career progression after graduation."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-petrol-800 text-[18px]">
              <Clock className="size-6 text-petrol-800" />
              <span>Student Work Rights &amp; Linguistic Reality</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Legal Right to Work:</strong> International students holding a valid Georgian Temporary Residence Card (TRC) are legally permitted to take employment without separate work permit applications.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>The Language Barrier:</strong> Local commerce, retail, hospitals, and hospitality operate in Georgian. Unless you achieve fluency in the Georgian language, traditional local part-time work is unavailable.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Available English Niches:</strong> English-speaking students find opportunities primarily in online freelancing, remote tech support, content moderation, and international BPO call centers in Tbilisi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Rigorous Medical Schedule:</strong> 6-year MD programs require intensive laboratory work, hospital bedside rounds, and daily study. Medical students rarely have time for regular part-time employment.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-petrol-800 text-[18px]">
              <Building2 className="size-6 text-petrol-800" />
              <span>Post-Graduation Pathways &amp; Licensing</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Bangladesh Return (BMDC RQE):</strong> Medical graduates return to Bangladesh, apply for BMDC provisional registration, and sit for the mandatory Registration Qualifying Examination (RQE) followed by 1-year clinical internship.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>USMLE Pathway (United States):</strong> With WFME recognition, Georgian MD graduates are eligible to take USMLE Step 1 and Step 2 CK for residency matching in the USA.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>PLAB / UKMLA Pathway (United Kingdom):</strong> Graduates can register directly with the General Medical Council (GMC) UK and take the PLAB/UKMLA examination for NHS junior doctor positions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Tech &amp; Business Graduates:</strong> Computer Science and BBA graduates can transition into European IT companies in Georgia or pursue advanced Master’s degrees across the EU.</span>
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
        intro="Plan your application timeline for Georgian university enrollment and NCEQE ministerial approval."
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
              The primary academic intake offering 100% of Medical Doctor (MD), Computer Science, and Business degree programs.
            </p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-ink-soft">Application Window:</span>
                <span className="font-bold text-petrol-800">April – July</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">NCEQE Recognition &amp; Order:</span>
                <span className="font-bold text-petrol-800">June – August</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">D3 Visa Processing:</span>
                <span className="font-bold text-petrol-800">August – September</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Arrival in Tbilisi:</span>
                <span className="font-bold text-petrol-800">Late September / Early October</span>
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
            <h3 className="mt-3 font-display text-[18px] font-bold text-petrol-800">Spring Intake (February / March)</h3>
            <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">
              Convenient second intake available at select medical and business faculties for late-completing HSC cohorts.
            </p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-ink-soft">Application Window:</span>
                <span className="font-bold text-petrol-800">October – December</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">NCEQE Recognition &amp; Order:</span>
                <span className="font-bold text-petrol-800">November – January</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">D3 Visa Processing:</span>
                <span className="font-bold text-petrol-800">January – February</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Arrival in Tbilisi:</span>
                <span className="font-bold text-petrol-800">Late February / Early March</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 11. Comparison with Alternatives */}
      <Section
        id="comparison"
        tone="white"
        title="Comparing Georgia with international medical destinations."
        intro="How studying medicine in Georgia compares against China and Malaysia for Bangladeshi students."
      >
        <div className="overflow-hidden rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-sand-50/80 text-petrol-800 font-bold border-b border-petrol-800/10">
              <tr>
                <th className="px-5 py-4">Key Criteria</th>
                <th className="px-5 py-4 bg-emerald-50/60 text-emerald-950 font-bold">Georgia (Tbilisi)</th>
                <th className="px-5 py-4">China (MOE-Listed)</th>
                <th className="px-5 py-4">Malaysia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Medical Degree Awarded</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">Medical Doctor (MD, 6 Years, 360 ECTS)</td>
                <td className="px-5 py-3.5">MBBS (6 Years with Internship)</td>
                <td className="px-5 py-3.5">MBBS / MD (5 Years)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Annual Medical Tuition</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">USD 5,500 – USD 8,000 / year</td>
                <td className="px-5 py-3.5">CNY 30,000 – 45,000 (~$4,200–$6,300)</td>
                <td className="px-5 py-3.5">MYR 60,000 – 110,000 (~$13,500–$25,000)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Monthly Living Cost</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">USD 350 – USD 600 / month</td>
                <td className="px-5 py-3.5">USD 250 – USD 450 / month</td>
                <td className="px-5 py-3.5">USD 400 – USD 650 / month</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Instruction Language</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">100% English medium</td>
                <td className="px-5 py-3.5">English medium (HSK4 required by Year 3)</td>
                <td className="px-5 py-3.5">100% English medium</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Global Accreditations</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">NCEQE (WFME recognized) &amp; WDOMS</td>
                <td className="px-5 py-3.5">China MOE &amp; WDOMS Listed</td>
                <td className="px-5 py-3.5">MMC (Malaysian Medical Council) &amp; WDOMS</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">BMDC Return Pathway</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 text-ink-soft">Eligible via BMDC Eligibility + RQE Exam</td>
                <td className="px-5 py-3.5">Eligible via BMDC Eligibility + RQE Exam</td>
                <td className="px-5 py-3.5">Eligible via BMDC Eligibility + RQE Exam</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 12. FAQ Section */}
      <Section id="faqs" tone="sage" title="Frequently asked questions about studying in Georgia.">
        <FaqBlock items={GEORGIA_FAQS} />
      </Section>

      {/* 13. Official Sources & Review Ownership */}
      <Section id="sources" tone="white" title="Statutory sources &amp; editorial review ownership.">
        <div className="grid gap-4 sm:grid-cols-2">
          {GEORGIA_OFFICIAL_AUTHORITIES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content audited against NCEQE accreditation registries, Ministry of Education and Science of Georgia regulations, and Bangladesh Medical and Dental Council (BMDC) foreign medical directives. Last verified on 26 November 2026. Next scheduled review: 26 February 2027.
          </p>
        </div>
      </Section>

      {/* 14. CTA Band & Education Fit Assessment */}
      <Section id="assessment" tone="sage" title="Assess your Georgia admission &amp; visa readiness.">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="Ready to evaluate your Georgia university options?"
        text="Book an in-person session at our Dhanmondi office or schedule a video consultation. We audit your academic transcripts, verify BMDC eligibility for medicine, and guide your NCEQE ministerial recognition."
        assessmentHref={applyHref}
        assessmentLabel="Start Application Assessment"
      />
    </article>
  );
}
