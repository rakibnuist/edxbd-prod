import Link from 'next/link';
import {
  Anchor,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
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
const PATH = '/study-in-croatia-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=Croatia';
export const revalidate = 3600;

const CROATIA_OFFICIAL_AUTHORITIES = [
  {
    label: 'Agency for Science and Higher Education (ASHE / AZVO)',
    href: 'https://www.azvo.hr/en/',
    note: 'Statutory national quality assurance and accreditation agency for Croatian higher education; full member of ENQA and registered in EQAR.',
  },
  {
    label: 'Study in Croatia — Official National Higher Education Portal',
    href: 'https://www.studyincroatia.hr/',
    note: 'Official portal managed by ASHE under the Ministry of Science, Education and Youth providing verified information on English-taught degrees, admissions, and living rules.',
  },
  {
    label: 'Ministry of Science, Education and Youth (MZO Croatia)',
    href: 'https://mzo.gov.hr/',
    note: 'Central state ministry governing academic accreditation standards, university charters, and international qualification recognitions.',
  },
  {
    label: 'Ministry of the Interior (MUP Croatia — Odjel za strance)',
    href: 'https://mup.gov.hr/',
    note: 'State authority regulating National Long-Stay Type D student visas, temporary stay permits (privremeni boravak u svrhu studiranja), and residence biometrics.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in Croatia from Bangladesh: Costs, Visa & Universities | EduExpress',
    description:
      'Evidence-first guide to studying in Croatia from Bangladesh: ASHE-accredited public universities, 6-Year English MD Medicine, Business & STEM degrees, Type D visa roadmap, and transparent living costs.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('croatia', 'Study in Croatia from Bangladesh — EduExpress International'),
  });
}

const CROATIA_FAQS = [
  {
    question: 'Are English-taught degree programs available in Croatia for international students?',
    answer:
      'Yes. Croatia offers established English-medium degree programs across its premier public universities. Most notable are the 6-Year Integrated Medical Doctor (MD) programs (360 ECTS credits, listed in WDOMS) at the University of Zagreb, University of Split, and University of Rijeka. In addition, institutions offer high-ranking English-taught Bachelor and Master degrees in Business Economics, Digital Marketing, Computer Science, Software Engineering, and Maritime Logistics under full European ECTS standards.',
  },
  {
    question: 'What is the tuition fee range for studying in Croatia?',
    answer:
      'Tuition in Croatia is structured in Euros (EUR) and varies by academic faculty. English-taught Bachelor and Master programs in Business, Economics, and STEM fields range between €3,500 and €5,500 per year (approximately 4.55 to 7.15 Lakh BDT). The specialized 6-Year Medical Doctor (MD) English programs maintain an annual tuition of €12,000 per year across Zagreb, Split, and Rijeka medical faculties. All tuition fees must be wired through Authorized Dealer bank Student Files directly to the university account.',
  },
  {
    question: 'How do Bangladeshi students apply for a Croatian Student Visa and Residence Permit?',
    answer:
      'Bangladeshi students must obtain an unconditional admission letter from an ASHE-accredited Croatian university, pay the required tuition deposit, and apply for a National Long-Stay Type D Study Visa through the Embassy of the Republic of Croatia in New Delhi (concurrently accredited for Bangladesh) or an authorized VFS Global visa centre. Upon arrival in Croatia, students register their address with the local police department (policijska uprava) within 48 hours and submit biometrics to receive their plastic biometric Temporary Stay Permit card (privremeni boravak).',
  },
  {
    question: 'Can international students work part-time in Croatia during their studies?',
    answer:
      'Yes. International students in Croatia are legally permitted to work part-time through the university Student Centre (Studentski centar) via a formal student contract (Studentski ugovor). The Croatian government sets a statutory minimum student hourly wage (minimalna studentska satnica). Students find employment in seasonal hospitality, tourism management, administrative support, and remote IT. However, medical students have intensive clinic hours and should not plan to finance tuition through student work.',
  },
  {
    question: 'What are the recognition standards for a Croatian university degree?',
    answer:
      'Croatia is a full member state of the European Union and participates in the Bologna Process. Degrees awarded by public Croatian universities carry European Credit Transfer and Accumulation System (ECTS) validation and are recognized across the EU, UK, US, and internationally. Medical degrees (MD) are listed in the World Directory of Medical Schools (WDOMS), qualifying graduates to sit for international licensing exams including USMLE (USA), PLAB/UKMLA (UK), and the BMDC Registration Qualifying Exam (Bangladesh).',
  },
];

export default async function StudyInCroatiaPage() {
  const croatiaUnis = await prisma.university.findMany({
    where: {
      country: { in: ['Croatia', 'croatia'] },
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
        dateModified: '2026-11-27',
        name: 'Study in Croatia from Bangladesh: Costs, Visa & Universities (2027 Benchmark)',
        description:
          'Official 2026/27 guide: ASHE-accredited public universities, 6-Year English MD Medicine, Business & STEM degrees, Type D visa roadmap, and transparent living costs in Zagreb, Split, and Rijeka.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/croatia.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(CROATIA_OFFICIAL_AUTHORITIES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#universities`,
        name: 'Verified Universities in Croatia for Bangladeshi Students',
        numberOfItems: croatiaUnis.length,
        itemListElement: croatiaUnis.map((u, i) => ({
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
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: 'Croatia' }]}
        eyebrow="Active Destination · European Union Member · ASHE-Accredited Public Universities"
        title="Study in Croatia from Bangladesh: Costs, Visa & Universities."
        lead="Croatia provides rigorous European higher education in historic university hubs including Zagreb, Split, and Rijeka. Taught 100% in English, Croatia’s accredited faculties feature accessible annual tuition (€3,500–€5,500/year for Business/STEM; €12,000/year for 6-Year MD Medicine), WDOMS-listed medical qualifications, and structured student-contract work rights under national law."
        reviewed="November 2026"
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Croatia Eligibility Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#universities" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              View 3 Verified Institutions
            </a>
          </>
        }
      />

      <TrustBar />

      {/* 3. Who This Country Fits — And Who Should Reconsider */}
      <Section
        id="who-fits"
        tone="white"
        title="Who Croatia fits — and who should reconsider."
        intro="Croatia is a serious academic destination for medicine, business economics, and computer engineering. Read our transparent counseling assessment before applying."
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
                <span><strong>Targeting Recognized 6-Year English MD Medicine:</strong> The Medical faculties of Zagreb (founded 1669), Split, and Rijeka offer complete English-medium MD degrees (360 ECTS) listed in WDOMS and recognized across Europe, the UK (GMC), the US (ECFMG), and Bangladesh (BMDC RQE).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Seeking Affordable European Union Tuition:</strong> Bachelor’s and Master’s programs in Business, Economics, Information Technology, and Maritime Science start from €3,500 to €5,500 per year, making it one of the most cost-effective EU options.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Valuing High Educational Standards &amp; Safety:</strong> Croatia ranks among the safest countries in Europe with low living costs (€500–€750/month in Zagreb or coastal cities) and a high standard of student campus amenities.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Aiming for European Academic Mobility:</strong> Croatian universities participate actively in the European Erasmus+ mobility network, enabling funded exchange semesters at partner institutions across continental Europe.</span>
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
                <span><strong>Applicants Seeking Backdoor European Migration:</strong> EduExpress strictly rejects treating student visas as migratory shortcuts. Admissions require genuine academic qualifications, entrance assessments, and verified financial resources.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Medical Aspirants Who Cannot Pass Academic Entrance Exams:</strong> Admission to English MD programs at Zagreb, Split, and Rijeka requires passing an entrance test in Biology, Chemistry, and Physics. There is no unconditional admission.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Expecting to Pay Tuition Entirely from Part-Time Earnings:</strong> While student contract work is legal, earnings are intended to supplement personal expenses, not replace core tuition funding. Families must pre-fund first-year expenses.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Medical Candidates Without BMDC Prerequisite GPA:</strong> To be eligible for BMDC registration in Bangladesh upon graduation, medical students must satisfy SSC+HSC combined GPA 7.00 and Biology GPA 3.50 before departure.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Critical Statutory Guardrail: Education-First Commitment */}
        <div className="mt-8 rounded-2xl border-2 border-petrol-800 bg-petrol-900 p-6 text-white shadow-md">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-xl bg-petrol-800 p-2.5 text-emerald-400">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Statutory Guardrail: Education-First Standards &amp; MUP Immigration Compliance
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-sand-200">
                EduExpress advises students on Croatian education strictly as an academic pursuit. Every institution recommended is audited against the official Agency for Science and Higher Education (ASHE / AZVO) registry. In compliance with Croatian Ministry of the Interior (MUP) protocols, all academic credentials, clean police clearance certificates, and medical records must be legalised by the Ministry of Foreign Affairs (MOFA) in Dhaka and the Embassy of Croatia. Tuition remittances must be executed via official Authorized Dealer bank Student Files directly to the university account.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Education System & Recognition */}
      <Section
        id="education-system"
        tone="sage"
        title="Bologna ECTS architecture &amp; ASHE national accreditation."
        intro="Croatia’s higher education system is fully integrated into the European Higher Education Area (EHEA), guaranteeing transparent degree equivalence and international recognition."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Award className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">ASHE / AZVO Accreditation</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              All higher education institutions in Croatia are evaluated by the Agency for Science and Higher Education (ASHE / AZVO), ensuring compliance with Standards and Guidelines for Quality Assurance in the European Higher Education Area (ESG).
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <BookOpen className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">European ECTS Credit Framework</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Degrees strictly adhere to European norms: 180–240 ECTS for 3- to 4-year Bachelor’s degrees, 60–120 ECTS for Master’s programs, and 360 ECTS for 6-year integrated Medical Doctor (MD) qualifications.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Stethoscope className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Global Medical Recognition</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Medical faculties at Zagreb, Split, and Rijeka are listed in the World Directory of Medical Schools (WDOMS). Graduates are eligible for international licensing: USMLE (USA), PLAB/UKMLA (UK), and BMDC RQE (Bangladesh).
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Verified Institutions in Croatia */}
      <Section
        id="universities"
        tone="white"
        title="3 verified public research universities in Croatia."
        intro="EduExpress International connects Bangladeshi students with top-tier public universities accredited by ASHE and recognized internationally for excellence in medicine, business, and technology."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {croatiaUnis.map((uni) => (
            <div
              key={uni.id}
              className="flex flex-col justify-between rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs hover:border-petrol-800/35 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-600/20">
                      ASHE Accredited · European Union
                    </span>
                    <h3 className="mt-2 font-display text-[20px] font-bold text-petrol-800">
                      <Link href={`/universities/${uni.slug}`} className="hover:underline">
                        {uni.name}
                      </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-soft">
                      <MapPin size={13} className="text-petrol-800" /> {uni.city || 'Zagreb'}, Croatia
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-sand-50/70 p-3 text-[13px]">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">Tuition Range</span>
                    <p className="font-bold text-petrol-800">{uni.tuition || '€3,500 – €12,000 / yr'}</p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">Intakes</span>
                    <p className="font-bold text-petrol-800">{uni.intake || 'September / October'}</p>
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

                {uni.fees.length > 0 && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-sand-50/50 p-3 text-[12.5px] text-slate-700">
                    <span className="flex items-center gap-1 font-bold text-petrol-800">
                      <Sparkles size={14} className="text-emerald-700" /> Statutory Fee Note:
                    </span>
                    <p className="mt-0.5 leading-5 text-slate-600">
                      {uni.fees[0].item}: {uni.fees[0].cost} ({uni.fees[0].recipient}). Non-refundable statutory assessment.
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
        intro="Specific academic thresholds, entrance exam rules, and document legalization standards for Croatian universities."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Stethoscope className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Medical Doctor (6-Year MD)</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>Academic Background:</strong> Higher Secondary Certificate (HSC) in Science with Biology, Chemistry, and Physics (minimum Biology GPA 3.50).</li>
              <li>• <strong>BMDC Criteria:</strong> Combined SSC+HSC minimum GPA 7.00 with mandatory BMDC Eligibility Certificate prior to departure.</li>
              <li>• <strong>Entrance Assessment:</strong> Passing mark in university entrance examination (multiple-choice Biology, Chemistry, Physics) or accepted SAT/MCAT score.</li>
              <li>• <strong>Oral Screening:</strong> Structured online interview evaluating academic motivation and English comprehension.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <School className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Undergraduate Business &amp; STEM</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>Academic:</strong> HSC in Science, Business Studies, or Humanities with minimum GPA 3.00/5.00, or GCE A-Levels.</li>
              <li>• <strong>Credential Evaluation:</strong> Secondary school certificate recognition conducted through the Education and Teacher Training Agency (AZOO/ASHE).</li>
              <li>• <strong>Mathematics Baseline:</strong> Minimum passing grade in secondary mathematics for Computer Science and Economics tracks.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <FileText className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Language &amp; Document Legalisation</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>English Proficiency:</strong> IELTS Academic 6.0+ (with minimum 5.5 in each component), TOEFL iBT 80+, or verified English medium schooling.</li>
              <li>• <strong>Attestation Hierarchy:</strong> Transcripts authenticated by Education Board/University, Ministry of Education, and MOFA Dhaka.</li>
              <li>• <strong>Croatian Consular Legalisation:</strong> Authentication via the Embassy of the Republic of Croatia in New Delhi.</li>
              <li>• <strong>Police Clearance:</strong> Clean criminal record certificate issued by Bangladesh Police, authenticated by MOFA.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7. Total Cost & Funding Reality */}
      <Section
        id="costs"
        tone="white"
        title="Complete annual cost structure (Tuition + Living)."
        intro="Itemized annual expenditure estimates in Euros (€) and Bangladeshi Taka (BDT) based on current Zagreb, Split, and Rijeka living benchmarks."
      >
        <div className="overflow-hidden rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-sand-50/80 text-petrol-800 font-bold border-b border-petrol-800/10">
                <tr>
                  <th className="px-5 py-4">Expense Category</th>
                  <th className="px-5 py-4">Annual / Monthly in EUR (€)</th>
                  <th className="px-5 py-4">Equivalent in BDT (Approx.)</th>
                  <th className="px-5 py-4">Payment Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">English Medical Doctor (6-Year MD) Tuition</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-800">€12,000 / year</td>
                  <td className="px-5 py-3.5 font-semibold text-petrol-800">15.60 Lakh BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Uniform national public rate for Zagreb, Split, Rijeka MD</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Business, Economics &amp; IT (Bachelor / Master)</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-800">€3,500 – €5,500 / year</td>
                  <td className="px-5 py-3.5 font-semibold text-petrol-800">4.55 – 7.15 Lakh BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Standard annual tuition paid per semester</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Student Housing (Shared Flat / Private Room)</td>
                  <td className="px-5 py-3.5">€200 – €400 / month</td>
                  <td className="px-5 py-3.5">26,000 – 52,000 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Furnished apartment near university tram / bus lines</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Food, Groceries &amp; Daily Living</td>
                  <td className="px-5 py-3.5">€180 – €260 / month</td>
                  <td className="px-5 py-3.5">23,400 – 33,800 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Local supermarkets, produce markets, student cafeterias</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Public Transit, Utilities &amp; Internet</td>
                  <td className="px-5 py-3.5">€50 – €90 / month</td>
                  <td className="px-5 py-3.5">6,500 – 11,700 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Subsidized student transit pass (€15/mo) + utilities</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Temporary Stay Permit (MUP) &amp; Biometric Card</td>
                  <td className="px-5 py-3.5">€100 (Year 1)</td>
                  <td className="px-5 py-3.5">13,000 BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Official police administration fee for residence card</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Mandatory Health Insurance (HZZO / Approved)</td>
                  <td className="px-5 py-3.5">€600 – €850 / year</td>
                  <td className="px-5 py-3.5">78,000 – 110,500 BDT / yr</td>
                  <td className="px-5 py-3.5 text-ink-soft">Comprehensive health insurance coverage required by MUP</td>
                </tr>
                <tr className="bg-sand-50/60 font-bold text-petrol-800">
                  <td className="px-5 py-4">Total Typical First-Year Budget (Business/STEM)</td>
                  <td className="px-5 py-4 text-emerald-800">€9,500 – €14,000</td>
                  <td className="px-5 py-4 text-petrol-800">12.35 – 18.20 Lakh BDT</td>
                  <td className="px-5 py-4 text-[13px] font-normal text-ink-soft">Includes annual tuition + 12 months comprehensive living</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 bg-sand-50/40 p-4 text-[13px] text-ink-soft">
            <p>
              <strong>Official Bangladesh Bank Remittance Protocol:</strong> Educational remittances to Croatian universities must be conducted through an Authorized Dealer commercial bank in Bangladesh via an approved <strong>Student File</strong> opened under Bangladesh Bank foreign exchange guidelines. Funds wire directly to the university’s verified official IBAN account in Croatia. EduExpress does not handle tuition in personal or cash accounts.
            </p>
          </div>
        </div>
      </Section>

      {/* 8. Visa & Residence Permit Roadmap */}
      <Section
        id="visa-process"
        tone="sage"
        title="Croatia National Type D Visa &amp; Temporary Stay roadmap."
        intro="Step-by-step consular and police immigration roadmap from university enrollment to the biometric residence card."
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              01
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Admission &amp; Fee Remittance</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Pass academic selection or medical entrance exam. Secure formal acceptance certificate and wire tuition deposit via Authorized Dealer bank Student File.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              02
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Document Attestation &amp; Solvency</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Legalise educational certificates, transcripts, clean police clearance, and medical reports via MOFA Dhaka. Prepare bank solvency statements (~€300–€400/month for Year 1).
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              03
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Type D Visa Application</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Submit your National Long-Stay (Type D) Visa dossier at the Embassy of the Republic of Croatia / VFS centre with accommodation contract and travel insurance.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              04
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Arrival &amp; Temporary Stay (MUP)</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Enter Croatia, register address with the police station within 48 hours, and submit biometric data at the Ministry of the Interior (MUP) for your biometric plastic residence card.
            </p>
          </div>
        </div>
      </Section>

      {/* 9. Work Rights & Post-Study Career Realities */}
      <Section
        id="work-rights"
        tone="white"
        title="Student contract employment rights &amp; career progression."
        intro="Evidence-based guidance on working in Croatia through the Student Centre and professional pathways after graduation."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-petrol-800 text-[18px]">
              <Clock className="size-6 text-petrol-800" />
              <span>Student Contract Work via Studentski Centar</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Statutory Student Contract:</strong> International students holding a valid Croatian temporary stay permit for study can legally work via the university Student Centre (Studentski centar) on an official student contract (Studentski ugovor).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Statutory Minimum Wage:</strong> Student hourly compensation is legally protected under Croatia's national minimum student wage (minimalna studentska satnica), indexed annually.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Language Consideration:</strong> Standard domestic retail and hospitality jobs require Croatian language proficiency. English-medium employment is concentrated in international tech startups, coastal tourism hospitality, and digital freelancing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Medical Rigour:</strong> 6-year Medical Doctor programs demand heavy hospital rotations and laboratory schedules. Medical students must not rely on student earnings to fund living costs.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-petrol-800 text-[18px]">
              <Briefcase className="size-6 text-petrol-800" />
              <span>Career Opportunities &amp; Graduate Retention</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>12-Month Job Search Stay:</strong> Under the Croatian Aliens Act (Zakon o strancima), university graduates can apply for a 12-month temporary stay permit to seek employment or establish an innovative business in Croatia.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Growing Technology Sector:</strong> Zagreb has emerged as a dynamic South-Eastern European technology hub (home to tech unicorns such as Infobip and Rimac Technology), creating strong demand for software and electrical engineers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Global Medical Practice:</strong> Croatian MD graduates hold European-standard degrees (360 ECTS) eligible for direct medical licensing exam registration across the EU, the UK (GMC), and Bangladesh (BMDC RQE).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>No False Promises:</strong> EduExpress strictly rejects unverified claims of "guaranteed work visas." Post-study legal stay requires securing a legitimate corporate contract complying with Croatian labor regulations.</span>
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
        intro="Understand the Croatian university admissions calendar to ensure adequate preparation for entrance examinations and consular visa processing."
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
              The primary intake offering 100% of Medical Doctor (MD), Computer Science, and Business degree programs.
            </p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-ink-soft">Application Window:</span>
                <span className="font-bold text-petrol-800">March – June</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Medical Entrance Exams:</span>
                <span className="font-bold text-petrol-800">May – July</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Admission &amp; Fee Wire:</span>
                <span className="font-bold text-petrol-800">June – July</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Type D Visa Submission:</span>
                <span className="font-bold text-petrol-800">July – August</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Arrival in Croatia:</span>
                <span className="font-bold text-petrol-800">Late September / Early October</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-petrol-50 px-2.5 py-0.5 text-[11px] font-bold text-petrol-800 border border-petrol-800/20">
                Secondary Intake
              </span>
              <span className="text-[12px] font-semibold text-ink-soft">Select Master’s Tracks</span>
            </div>
            <h3 className="mt-3 font-display text-[18px] font-bold text-petrol-800">Spring Intake (February / March)</h3>
            <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">
              Available at select university departments for postgraduate business and engineering tracks.
            </p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-ink-soft">Application Window:</span>
                <span className="font-bold text-petrol-800">October – November</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Admission &amp; Fee Wire:</span>
                <span className="font-bold text-petrol-800">November – December</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Type D Visa Submission:</span>
                <span className="font-bold text-petrol-800">December – January</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Arrival in Croatia:</span>
                <span className="font-bold text-petrol-800">February</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 11. Comparison with Alternatives */}
      <Section
        id="comparison"
        tone="white"
        title="Comparing Croatia with Hungary and Georgia."
        intro="How studying in Croatia compares against other premier medical and European higher education options."
      >
        <div className="overflow-hidden rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-sand-50/80 text-petrol-800 font-bold border-b border-petrol-800/10">
              <tr>
                <th className="px-5 py-4">Key Criteria</th>
                <th className="px-5 py-4 bg-emerald-50/60 text-emerald-950 font-bold">Croatia (Zagreb/Split/Rijeka)</th>
                <th className="px-5 py-4">Hungary (Budapest/Debrecen)</th>
                <th className="px-5 py-4">Georgia (Tbilisi)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">European Union Status</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">Full EU member state</td>
                <td className="px-5 py-3.5">Full EU member state</td>
                <td className="px-5 py-3.5">EHEA member (Non-EU)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Medical Degree (MD) Tuition</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">€12,000 / year</td>
                <td className="px-5 py-3.5">€15,000 – €18,000 / year (or Stipendium)</td>
                <td className="px-5 py-3.5">USD 5,500 – 8,000 / year</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Business &amp; STEM Tuition</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">€3,500 – €5,500 / year</td>
                <td className="px-5 py-3.5">€4,000 – €7,000 / year</td>
                <td className="px-5 py-3.5">USD 3,500 – 4,500 / year</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Monthly Living Expenses</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">€500 – €750 / month</td>
                <td className="px-5 py-3.5">€600 – €850 / month</td>
                <td className="px-5 py-3.5">USD 350 – 600 / month</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Academic Accreditation</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 text-ink-soft">ASHE / AZVO (EQAR &amp; ENQA)</td>
                <td className="px-5 py-3.5">HAC / MAB (EQAR &amp; ENQA)</td>
                <td className="px-5 py-3.5">NCEQE (WFME recognized)</td>
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
      <Section id="faqs" tone="sage" title="Frequently asked questions about studying in Croatia.">
        <FaqBlock items={CROATIA_FAQS} />
      </Section>

      {/* 13. Official Sources & Review Ownership */}
      <Section id="sources" tone="white" title="Statutory sources &amp; editorial review ownership.">
        <div className="grid gap-4 sm:grid-cols-2">
          {CROATIA_OFFICIAL_AUTHORITIES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content audited against the Agency for Science and Higher Education (ASHE / AZVO) registry, official Study in Croatia guidance, and Ministry of the Interior (MUP) consular directives. Last verified on 27 November 2026. Next scheduled review: 27 February 2027.
          </p>
        </div>
      </Section>

      {/* 14. CTA Band & Education Fit Assessment */}
      <Section id="assessment" tone="sage" title="Assess your Croatia admission &amp; visa readiness.">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="Ready to evaluate your Croatia university options?"
        text="Book an in-person session at our Dhanmondi office or schedule a video consultation. We audit your academic transcripts, evaluate medical entrance exam preparation, and guide your Croatian visa roadmap."
        assessmentHref={applyHref}
        assessmentLabel="Start Application Assessment"
      />
    </article>
  );
}
