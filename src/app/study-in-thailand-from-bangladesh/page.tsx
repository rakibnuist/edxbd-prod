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
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/study-in-thailand-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=Thailand';
export const revalidate = 3600;

const THAILAND_OFFICIAL_AUTHORITIES = [
  {
    label: 'Ministry of Higher Education, Science, Research and Innovation (MHESI Thailand)',
    href: 'https://www.mhesi.go.th/',
    note: 'Statutory governmental authority governing university charters, academic accreditation standards, and international degree recognition across Thailand.',
  },
  {
    label: 'Royal Thai Embassy, Dhaka — Consular & Visa Section',
    href: 'https://dhaka.thaiembassy.org/',
    note: 'Official diplomatic mission issuing Non-Immigrant ED Study Visas for Bangladeshi students admitted to recognized Thai universities.',
  },
  {
    label: 'Immigration Bureau of Thailand (สำนักงานตรวจคนเข้าเมือง)',
    href: 'https://www.immigration.go.th/',
    note: 'Immigration authority overseeing 90-day residence reporting (TM.47), study stay extensions (TM.7), and legal student residency compliance.',
  },
  {
    label: 'Office of the Civil Service Commission (OCSC Thailand)',
    href: 'https://www.ocsc.go.th/',
    note: 'State authority establishing national degree equivalence, public curriculum benchmarking, and civil service academic recognitions.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in Thailand from Bangladesh: Costs, Visa & Universities | EduExpress',
    description:
      'Evidence-first guide to studying in Thailand from Bangladesh: MHESI-accredited universities, English-taught Business, AI & Engineering degrees, Non-Immigrant ED Visa process, and transparent living costs in Bangkok.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('thailand', 'Study in Thailand from Bangladesh — EduExpress International'),
  });
}

const THAILAND_FAQS = [
  {
    question: 'Why should Bangladeshi students consider studying in Thailand?',
    answer:
      'Thailand is Southeast Asia’s premier regional education hub, offering world-class, 100% English-taught degree programs at institutions such as Chulalongkorn University (ranked #1 in Thailand), Mahidol University (global top 150 in medicine and life sciences), Thammasat University, and the Asian Institute of Technology (AIT). Students benefit from high-quality education, close geographical proximity to Dhaka (2.5-hour direct flight), moderate tuition fees (THB 110,000–350,000/year), low living costs, and prestigious fellowship programs such as the Chula Graduate Scholarship for Non-ASEAN Countries and AIT Fellowships.',
  },
  {
    question: 'How much does it cost to study in Thailand for Bangladeshi students?',
    answer:
      'Tuition in Thailand is paid in Thai Baht (THB). Undergraduate international programs at public research universities range from THB 110,000 to THB 220,000 per year (approximately 3.85 to 7.70 Lakh BDT). Postgraduate Master’s degrees generally cost THB 200,000 to THB 380,000 per year (approx. 7.00 to 13.30 Lakh BDT), with competitive merit reductions and research fellowships available for qualified candidates. Monthly living expenses in the Bangkok metropolitan area range from THB 12,000 to THB 20,000 (approx. 42,000 to 70,000 BDT), including student housing, food, and transit.',
  },
  {
    question: 'How do Bangladeshi students obtain a Thai Non-Immigrant ED Visa?',
    answer:
      'After receiving an unconditional letter of acceptance from an MHESI-recognized Thai university and paying the initial registration fee via an Authorized Dealer bank Student File, the university issues an official visa endorsement letter. The student submits the application for a Single-Entry Non-Immigrant ED Visa to the Royal Thai Embassy in Dhaka (or designated visa application center). Essential documents include attested educational transcripts, clean police clearance, a medical fitness certificate, and bank solvency proof (~THB 200,000 or equivalent). Upon arrival, the visa is extended to one full year at the Immigration Bureau.',
  },
  {
    question: 'Can international students work off-campus in Thailand on an ED Visa?',
    answer:
      'No. Under Thai immigration law, international students holding a Non-Immigrant ED Visa are not permitted to engage in off-campus commercial employment. However, students are allowed to hold on-campus graduate teaching assistantships (TA), research assistantships (RA), departmental student positions, and approved academic internships required by their degree curriculum. Families must ensure tuition and living expenses are fully funded before departure and not rely on local wages.',
  },
  {
    question: 'Is the Asian Institute of Technology (AIT) recognized in Bangladesh?',
    answer:
      'Yes, highly. The Asian Institute of Technology (AIT) is an international intergovernmental postgraduate institution chartered in Thailand with deep historic ties to Bangladesh. Hundreds of Bangladeshi engineers, academics, BUET alumni, and government officials have completed postgraduate degrees at AIT. AIT degrees are internationally accredited and fully recognized by the University Grants Commission (UGC) of Bangladesh and global engineering bodies.',
  },
];

export default async function StudyInThailandPage() {
  const thailandUnis = await prisma.university.findMany({
    where: {
      country: { in: ['Thailand', 'thailand'] },
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
        name: 'Study in Thailand from Bangladesh: Costs, Visa & Universities (2027 Benchmark)',
        description:
          'Official 2026/27 guide: MHESI-accredited universities, English-taught Business, AI & Engineering degrees, Non-Immigrant ED Visa process, and transparent living costs in Bangkok and Pathum Thani.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/thailand.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(THAILAND_OFFICIAL_AUTHORITIES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#universities`,
        name: 'Verified Universities in Thailand for Bangladeshi Students',
        numberOfItems: thailandUnis.length,
        itemListElement: thailandUnis.map((u, i) => ({
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
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: 'Thailand' }]}
        eyebrow="Active Destination · ASEAN Regional Education Hub · MHESI-Accredited Public Universities"
        title="Study in Thailand from Bangladesh: Costs, Visa & Universities."
        lead="Thailand offers premier English-medium higher education across world-renowned public universities in Bangkok and Pathum Thani. Featuring moderate annual tuition (THB 110,000–350,000/year), low living costs (THB 12,000–20,000/month), direct 2.5-hour flights from Dhaka, and prestigious research fellowships at Chulalongkorn, Mahidol, Thammasat, and AIT, Thailand delivers exceptional regional value for focused Bangladeshi scholars."
        reviewed="November 2026"
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Thailand Eligibility Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#universities" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              View 4 Verified Institutions
            </a>
            <Link href="/thailand-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Full Cost Guide
            </Link>
            <Link href="/thailand-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Thailand ED Visa Guide
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* 3. Who This Country Fits — And Who Should Reconsider */}
      <Section
        id="who-fits"
        tone="white"
        title="Who Thailand fits — and who should reconsider."
        intro="Thailand is an exceptional regional option for undergraduate and postgraduate studies in engineering, business, and health sciences. Read our transparent counseling criteria."
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
                <span><strong>Targeting Top-Ranked Asian Public Universities:</strong> Chulalongkorn University and Mahidol University consistently rank among Asia’s top 50 institutions, offering world-class research infrastructure and international faculty.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Engineers Seeking Global Postgraduate Excellence at AIT:</strong> The Asian Institute of Technology (AIT) provides premier Master’s and PhD programs in AI, Data Science, Civil Engineering, and Sustainability with a massive network of Bangladeshi alumni leaders.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Seeking Affordable Education with Regional Proximity:</strong> Located just a 2.5-hour direct flight from Hazrat Shahjalal International Airport (DAC to BKK), Thailand allows students to maintain close family connections while enjoying low living expenses (THB 12,000–20,000/month).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Aspirants for Full Postgraduate Fellowships:</strong> Programs like the Chulalongkorn Graduate Scholarship for Non-ASEAN Countries provide full tuition coverage, monthly living stipends, and round-trip airfare for qualified Master’s and PhD applicants.</span>
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
                <span><strong>Expecting to Fund Studies via Off-Campus Part-Time Work:</strong> Under Thai immigration law, Non-Immigrant ED visa holders are legally prohibited from off-campus employment. Families must fully pre-fund both tuition and living costs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Looking for Short Informal Language/Work Schemes:</strong> EduExpress strictly does not represent non-degree language schools or work-travel schemes. We exclusively advise on accredited Bachelor, Master, and Doctoral degrees.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Seeking Automatic Post-Study Work Visas or Permanent Residence:</strong> Thailand does not grant an automatic post-study work permit upon graduation. Legal employment requires securing a corporate position that sponsors a Non-B visa and Work Permit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Applicants Without Academic Attestation:</strong> Admission and visa issuance require original academic certificates and transcripts attested by the Education Board, Ministry of Education, and MOFA Dhaka.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Critical Statutory Guardrail: Academic Degree Focus */}
        <div className="mt-8 rounded-2xl border-2 border-petrol-800 bg-petrol-900 p-6 text-white shadow-md">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-xl bg-petrol-800 p-2.5 text-emerald-400">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Statutory Guardrail: MHESI Degree Accreditation &amp; Non-ED Visa Compliance
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-sand-200">
                EduExpress advises students exclusively on formal, degree-granting academic programs accredited by the Ministry of Higher Education, Science, Research and Innovation (MHESI Thailand) and chartered institutions. We strictly reject informal short-course work schemes. Applications for the Non-Immigrant ED Study Visa are processed via the Royal Thai Embassy in Dhaka with formal university endorsement, police clearance, and documented financial solvency. Tuition fees must be remitted through official Authorized Dealer bank Student Files directly to the university account.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Education System & Recognition */}
      <Section
        id="education-system"
        tone="sage"
        title="MHESI statutory accreditation &amp; global academic standing."
        intro="Thai higher education combines high academic rigor with internationally recognized credit transfer systems and strong global university rankings."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Award className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">MHESI Accreditation</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              All higher education programs are overseen by the Ministry of Higher Education, Science, Research and Innovation (MHESI), adhering to the Thai Qualifications Framework for Higher Education (TQF).
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <BookOpen className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">International Credit Structure</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Curricula follow standard credit architectures (120–140 semester credits for 4-year Bachelor’s, 36–48 credits for Master’s), enabling seamless credit transfer and dual-degree pathways with top Western universities.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Landmark className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Global Reputation &amp; Rankings</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Chulalongkorn and Mahidol rank consistently in the world’s top 200–300 universities (QS / THE World University Rankings), outranking many institutions in the UK, Australia, and North America.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Verified Institutions in Thailand */}
      <Section
        id="universities"
        tone="white"
        title="4 verified premier universities in Thailand."
        intro="EduExpress connects Bangladeshi students with top-ranked, MHESI-accredited public research universities and international institutes offering verified English-medium faculties."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {thailandUnis.map((uni) => (
            <div
              key={uni.id}
              className="flex flex-col justify-between rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs hover:border-petrol-800/35 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-600/20">
                      MHESI Accredited · ASEAN Hub
                    </span>
                    <h3 className="mt-2 font-display text-[20px] font-bold text-petrol-800">
                      <Link href={`/universities/${uni.slug}`} className="hover:underline">
                        {uni.name}
                      </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-soft">
                      <MapPin size={13} className="text-petrol-800" /> {uni.city || 'Bangkok'}, Thailand
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-sand-50/70 p-3 text-[13px]">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">Tuition Range</span>
                    <p className="font-bold text-petrol-800">{uni.tuition || 'THB 110,000 – 350,000 / yr'}</p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">Intakes</span>
                    <p className="font-bold text-petrol-800">{uni.intake || 'August & January'}</p>
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
        intro="Academic thresholds, language criteria, and document legalisation standards for Thai university admissions."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <School className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Undergraduate Admission</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>Academic Background:</strong> Higher Secondary Certificate (HSC) in Science, Commerce, or Humanities with minimum GPA 3.00/5.00, or GCE A-Levels.</li>
              <li>• <strong>Standardized Tests (Optional):</strong> SAT (Math/Evidence-Based Reading) or university aptitude test required for Chulalongkorn BBA &amp; ISE engineering.</li>
              <li>• <strong>Interviews:</strong> Structured online interview evaluating academic commitment and English fluency.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <GraduationCap className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Master’s &amp; PhD Degrees</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>Bachelor’s Degree:</strong> 4-year Bachelor’s degree from a UGC-recognized university in Bangladesh (minimum CGPA 2.75/4.00; 3.00+ for AIT fellowships).</li>
              <li>• <strong>Research Proposal:</strong> Detailed Statement of Purpose (SOP) or research proposal required for thesis Master’s and Doctoral programs.</li>
              <li>• <strong>Recommendation Letters:</strong> 2 academic reference letters from university professors.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <FileText className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Language &amp; Attestation</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>English Proficiency:</strong> IELTS Academic 6.0–6.5, TOEFL iBT 80+, or university English entrance test (e.g., AIT English test or CU-TEP).</li>
              <li>• <strong>Ministry Attestation:</strong> Board/University transcripts attested by Education Board, Ministry of Education, and MOFA Dhaka.</li>
              <li>• <strong>Police Clearance:</strong> Clean criminal record certificate issued by Bangladesh Police, authenticated by MOFA Dhaka.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7. Total Cost & Funding Reality */}
      <Section
        id="costs"
        tone="white"
        title="Complete annual cost structure (Tuition + Living)."
        intro="Itemized annual expenditure estimates in Thai Baht (THB) and Bangladeshi Taka (BDT) based on current Bangkok living benchmarks."
      >
        <div className="overflow-hidden rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-sand-50/80 text-petrol-800 font-bold border-b border-petrol-800/10">
                <tr>
                  <th className="px-5 py-4">Expense Category</th>
                  <th className="px-5 py-4">Annual / Monthly in THB</th>
                  <th className="px-5 py-4">Equivalent in BDT (Approx.)</th>
                  <th className="px-5 py-4">Payment Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Undergraduate Business / Engineering Tuition</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-800">THB 150,000 – THB 220,000 / year</td>
                  <td className="px-5 py-3.5 font-semibold text-petrol-800">5.25 – 7.70 Lakh BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Standard international undergraduate rate paid per semester</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Postgraduate / Master’s Tuition (STEM / Business)</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-800">THB 200,000 – THB 350,000 / year</td>
                  <td className="px-5 py-3.5 font-semibold text-petrol-800">7.00 – 12.25 Lakh BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Paid per semester; reduced substantially by fellowships</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Student Housing (On-Campus Dorm / Studio Flat)</td>
                  <td className="px-5 py-3.5">THB 5,000 – THB 8,500 / month</td>
                  <td className="px-5 py-3.5">17,500 – 29,750 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Furnished room near campus or BTS/MRT transit lines</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Food, Groceries &amp; Campus Meals</td>
                  <td className="px-5 py-3.5">THB 5,000 – THB 8,000 / month</td>
                  <td className="px-5 py-3.5">17,500 – 28,000 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Subsidized university food courts (THB 40–70 per meal)</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Public Transit, Utilities &amp; 4G Mobile Internet</td>
                  <td className="px-5 py-3.5">THB 2,000 – THB 3,500 / month</td>
                  <td className="px-5 py-3.5">7,000 – 12,250 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Discounted student Rabbit card (BTS/MRT) + mobile SIM</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Non-Immigrant ED Visa &amp; 1-Year Extension (TM.7)</td>
                  <td className="px-5 py-3.5">THB 4,000 (Year 1)</td>
                  <td className="px-5 py-3.5">14,000 BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Embassy visa fee + Chaengwattana immigration extension</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Mandatory Student Health Insurance</td>
                  <td className="px-5 py-3.5">THB 3,500 – THB 6,000 / year</td>
                  <td className="px-5 py-3.5">12,250 – 21,000 BDT / yr</td>
                  <td className="px-5 py-3.5 text-ink-soft">Annual comprehensive campus or private medical coverage</td>
                </tr>
                <tr className="bg-sand-50/60 font-bold text-petrol-800">
                  <td className="px-5 py-4">Total Typical First-Year Budget (Undergraduate)</td>
                  <td className="px-5 py-4 text-emerald-800">THB 310,000 – THB 460,000</td>
                  <td className="px-5 py-4 text-petrol-800">10.85 – 16.10 Lakh BDT</td>
                  <td className="px-5 py-4 text-[13px] font-normal text-ink-soft">Includes annual tuition + 12 months comprehensive living</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 bg-sand-50/40 p-4 text-[13px] text-ink-soft">
            <p>
              <strong>Official Bangladesh Bank Remittance Protocol:</strong> All tuition payments to Thai universities must be transferred via an Authorized Dealer (AD) bank in Bangladesh through an official <strong>Student File</strong> opened under Bangladesh Bank foreign exchange guidelines. Funds wire directly to the university’s verified official bank account in Thailand. EduExpress does not collect tuition fees in personal accounts or cash.
            </p>
          </div>

          {/* Deep-Dive Cost Guide Callout */}
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Itemized Cost Breakdown · 2027 Benchmark
              </span>
              <h3 className="text-base font-bold text-petrol-800">
                Deep Dive: Thailand Study Cost Guide (/thailand-study-cost-bangladesh)
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Explore comprehensive tuition fee schedules across Chulalongkorn, Mahidol, Thammasat, and AIT, Royal Thai Embassy Non-Immigrant ED Visa bank proof, Bangkok vs. Rangsit student living budgets, and fellowship awards.
              </p>
            </div>
            <Link
              href="/thailand-study-cost-bangladesh"
              className="ed-btn ed-btn-signal min-h-[48px] px-6 text-xs font-bold whitespace-nowrap shrink-0"
            >
              Read Thailand Cost Guide <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Section>

      {/* 8. Visa & Non-Immigrant ED Roadmap */}
      <Section
        id="visa-process"
        tone="sage"
        title="Thailand Non-Immigrant ED Visa &amp; Extension roadmap."
        intro="Step-by-step consular and immigration roadmap from university admission to annual study stay extensions."
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              01
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Admission &amp; Fee Remittance</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Secure formal unconditional acceptance letter from an MHESI-recognized university. Wire initial fee deposit via AD Bank Student File to receive the official payment confirmation.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              02
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">MHESI Endorsement &amp; Attestation</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              University obtains formal MHESI visa endorsement letter addressed to the Royal Thai Embassy Dhaka. Attest educational records and police clearance at MOFA Dhaka.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              03
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Non-Immigrant ED Visa Issuance</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Submit your visa dossier at the Royal Thai Embassy Dhaka / VFS centre with bank solvency statement (~THB 200,000 equivalent), passport, and health certificate.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              04
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Arrival &amp; Annual Extension (TM.7)</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Enter Thailand on your 90-day ED visa. Complete university registration and submit extension application (TM.7) at the Immigration Bureau for full 1-year stay. Maintain 90-day reporting (TM.47).
            </p>
          </div>
        </div>
      </Section>

      {/* 9. Work Rights & Post-Study Career Realities */}
      <Section
        id="work-rights"
        tone="white"
        title="Student work rules &amp; professional career realities."
        intro="Evidence-based guidance on employment restrictions during studies and corporate career pathways across the ASEAN region."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-petrol-800 text-[18px]">
              <Clock className="size-6 text-petrol-800" />
              <span>Student Employment Restrictions &amp; On-Campus Roles</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>No Off-Campus Work:</strong> Under Thai immigration law, international students holding a Non-Immigrant ED Visa are legally prohibited from working off-campus. Off-campus commercial work without a Work Permit violates visa conditions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Permitted On-Campus Opportunities:</strong> Graduate students are eligible for on-campus Research Assistantships (RA), Teaching Assistantships (TA), and laboratory support roles that provide modest stipends or tuition offsets.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Curricular Internships:</strong> Degree-mandated internships (Cooperative Education / Sahakij) with registered corporate partners are legally approved as part of academic training.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Pre-Funded Budget Requirement:</strong> Families must ensure living expenses for the complete academic duration are pre-funded. Students must never count on local employment to sustain their studies.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-petrol-800 text-[18px]">
              <Briefcase className="size-6 text-petrol-800" />
              <span>Post-Graduation Pathways &amp; ASEAN Employment</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Regional Corporate Hub:</strong> Bangkok hosts regional headquarters for hundreds of multinational corporations (MNCs), UN agencies (ESCAP, UNEP, FAO), and tech firms with demand for English-fluent engineering and business graduates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Transition to Non-B Visa &amp; Work Permit:</strong> Graduates who secure professional employment with an approved corporate employer transition from the ED visa to a Non-Immigrant B visa accompanied by an official Ministry of Labour Work Permit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>AIT Global Alumni Stronghold:</strong> Over 1,000 Bangladeshi alumni hold leadership roles in engineering consultancies, universities, and international development agencies across Asia and North America.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Candid Reality:</strong> Thailand does not offer an unconditional post-study job search visa. Career success depends on academic excellence, technical competence, and networking during degree study.</span>
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
        intro="Understand the admissions schedule for Thai public universities to ensure timely scholarship applications and consular visa processing."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-600/20">
                Primary Intake
              </span>
              <span className="text-[12px] font-semibold text-ink-soft">All Faculties Open</span>
            </div>
            <h3 className="mt-3 font-display text-[18px] font-bold text-petrol-800">Semester 1 Intake (August / September)</h3>
            <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">
              The main intake for 100% of undergraduate international programs, engineering schools, and graduate fellowships across Thailand.
            </p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-ink-soft">Application Window:</span>
                <span className="font-bold text-petrol-800">December – April</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Scholarship Deadlines (Chula/AIT):</span>
                <span className="font-bold text-petrol-800">February – March</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Admission &amp; Fee Remittance:</span>
                <span className="font-bold text-petrol-800">April – June</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Non-ED Visa Submission:</span>
                <span className="font-bold text-petrol-800">June – July</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Arrival in Bangkok:</span>
                <span className="font-bold text-petrol-800">Early August</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-petrol-50 px-2.5 py-0.5 text-[11px] font-bold text-petrol-800 border border-petrol-800/20">
                Secondary Intake
              </span>
              <span className="text-[12px] font-semibold text-ink-soft">Graduate &amp; Select UG Tracks</span>
            </div>
            <h3 className="mt-3 font-display text-[18px] font-bold text-petrol-800">Semester 2 Intake (January / February)</h3>
            <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">
              Popular second intake available for Master’s, Doctoral programs, and select undergraduate international college intakes.
            </p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-ink-soft">Application Window:</span>
                <span className="font-bold text-petrol-800">August – October</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Admission &amp; Fee Remittance:</span>
                <span className="font-bold text-petrol-800">October – November</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Non-ED Visa Submission:</span>
                <span className="font-bold text-petrol-800">November – December</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Arrival in Bangkok:</span>
                <span className="font-bold text-petrol-800">Early January</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 11. Comparison with Alternatives */}
      <Section
        id="comparison"
        tone="white"
        title="Comparing Thailand with Malaysia and China."
        intro="How studying in Thailand compares against neighboring Asian destinations for Bangladeshi students."
      >
        <div className="overflow-hidden rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-sand-50/80 text-petrol-800 font-bold border-b border-petrol-800/10">
              <tr>
                <th className="px-5 py-4">Key Criteria</th>
                <th className="px-5 py-4 bg-emerald-50/60 text-emerald-950 font-bold">Thailand (Bangkok/AIT)</th>
                <th className="px-5 py-4">Malaysia (Kuala Lumpur)</th>
                <th className="px-5 py-4">China (Tier 1/2 Cities)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Flight Duration from Dhaka</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">2.5 hours (Direct flight)</td>
                <td className="px-5 py-3.5">3.5 – 4 hours (Direct flight)</td>
                <td className="px-5 py-3.5">4.5 – 6 hours (Transit/Direct)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Average Annual Tuition</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">THB 110,000 – 350,000 (~$3,200–$10,000)</td>
                <td className="px-5 py-3.5">MYR 16,000 – 35,000 (~$3,500–$7,800)</td>
                <td className="px-5 py-3.5">CNY 18,000 – 45,000 (~$2,500–$6,300)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Monthly Living Expenses</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">THB 12,000 – 20,000 (~$350–$580)</td>
                <td className="px-5 py-3.5">MYR 1,500 – 2,200 (~$340–$500)</td>
                <td className="px-5 py-3.5">CNY 2,000 – 3,500 (~$280–$500)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Instruction Medium</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">100% English medium</td>
                <td className="px-5 py-3.5">100% English medium</td>
                <td className="px-5 py-3.5">English medium (HSK required for select majors)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Statutory Accreditation</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 text-ink-soft">MHESI (Ministry of Higher Education)</td>
                <td className="px-5 py-3.5">MQA (Malaysian Qualifications Agency)</td>
                <td className="px-5 py-3.5">Ministry of Education (MOE China)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Distinct Strengths</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 text-ink-soft">Chula/Mahidol Top Rankings, AIT Engineering Alumni</td>
                <td className="px-5 py-3.5">UK Branch Campuses, Direct Credit Transfers</td>
                <td className="px-5 py-3.5">CSC Full Scholarships, High-Tech Laboratories</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 12. FAQ Section */}
      <Section id="faqs" tone="sage" title="Frequently asked questions about studying in Thailand.">
        <FaqBlock items={THAILAND_FAQS} />
      </Section>

      {/* 13. Official Sources & Review Ownership */}
      <Section id="sources" tone="white" title="Statutory sources &amp; editorial review ownership.">
        <div className="grid gap-4 sm:grid-cols-2">
          {THAILAND_OFFICIAL_AUTHORITIES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content audited against the Ministry of Higher Education, Science, Research and Innovation (MHESI) registry, Royal Thai Embassy consular directives, and Immigration Bureau of Thailand regulations. Last verified on 27 November 2026. Next scheduled review: 27 February 2027.
          </p>
        </div>
      </Section>

      {/* 14. CTA Band & Education Fit Assessment */}
      <Section id="assessment" tone="sage" title="Assess your Thailand admission &amp; visa readiness.">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="Ready to evaluate your Thailand university options?"
        text="Book an in-person session at our Dhanmondi office or schedule a video consultation. We audit your academic transcripts, evaluate Chula/AIT fellowship opportunities, and guide your Royal Thai Embassy visa dossier."
        assessmentHref={applyHref}
        assessmentLabel="Start Application Assessment"
      />
    </article>
  );
}
