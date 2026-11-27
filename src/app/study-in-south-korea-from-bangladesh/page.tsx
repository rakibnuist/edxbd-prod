import Link from 'next/link';
import {
  ArrowRight,
  Award,
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
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/study-in-south-korea-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=South%20Korea';
export const revalidate = 3600;

const KOREA_OFFICIAL_AUTHORITIES = [
  {
    label: 'Study in Korea (National Institute for International Education — NIIED)',
    href: 'https://www.studyinkorea.go.kr/',
    note: 'Statutory government portal under the Ministry of Education for Korean university admission, GKS guidelines, and TOPIK verification',
  },
  {
    label: 'Embassy of the Republic of Korea in Dhaka, Bangladesh',
    href: 'https://overseas.mofa.go.kr/bd-en/index.do',
    note: 'Official visa application authority for D-2 Student Visas, GKS Embassy Track interviews, and document consular legalization',
  },
  {
    label: 'HiKorea (Korea Immigration Service — Ministry of Justice)',
    href: 'https://www.hikorea.go.kr/',
    note: 'Official government portal for Alien Registration Card (ARC), part-time work permissions (S-3), and D-10 Job Seeker visa extensions',
  },
  {
    label: 'Bangladesh Bank Foreign Exchange Policy (Student File Remittance)',
    href: 'https://www.bb.org.bd/',
    note: 'Authorized Dealer (AD) bank foreign exchange regulations for outward student file tuition and living cost wires to South Korea',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in South Korea from Bangladesh: Costs, Visa & Universities | EduExpress',
    description:
      'Evidence-first guide to studying in South Korea from Bangladesh: GKS scholarship, 6 top-ranked universities (KAIST, SNU, Yonsei), D-2 visa bank solvency, D-10 job seeker route, and English STEM programs.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('south-korea', 'Study in South Korea from Bangladesh — EduExpress International'),
  });
}

const KOREA_FAQS = [
  {
    question: 'How does the Global Korea Scholarship (GKS) work for Bangladeshi students?',
    answer:
      'The Global Korea Scholarship (GKS), managed by NIIED under the Korean Ministry of Education, is one of the most generous full scholarships in the world. It covers 100% tuition for the full degree duration, provides 1 year of mandatory Korean language training, round-trip economy airfare, a monthly living stipend (KRW 1,000,000/month for undergraduate and KRW 1,000,000–1,500,000/month for graduate), medical insurance, and settlement allowances. Bangladeshi students can apply through two parallel routes: the Embassy Track (submitted directly to the Korean Embassy in Dhaka) or the University Track (submitted directly to a participating Korean university). Undergraduate applications open in September; graduate applications open in February.',
  },
  {
    question: 'Can I study in South Korea entirely in English without knowing Korean?',
    answer:
      'Yes, especially in STEM, Computer Science, AI, and International Business. Premier institutions like KAIST (Korea Advanced Institute of Science and Technology) teach almost 100% of undergraduate and graduate courses in English. Elite universities such as Yonsei University (Underwood International College — UIC), Korea University, Seoul National University, and Sungkyunkwan University (SKKU) offer dedicated English-taught bachelor’s and master’s programs where admission requires IELTS Academic (6.0–6.5) or TOEFL iBT (80+). However, learning basic Korean is essential for daily living and off-campus internships.',
  },
  {
    question: 'What is the bank solvency requirement for a South Korean D-2 student visa in Dhaka?',
    answer:
      'For self-funded students applying for a D-2 Student Visa at the Korean Embassy in Dhaka, immigration guidelines require proof of financial capability. You must submit an official bank statement and solvency certificate in the student’s or parent’s name showing a minimum balance equivalent to USD 16,000 to USD 20,000 (universities in Seoul metropolitan area generally require USD 20,000; regional universities outside Seoul require USD 16,000–18,000). The funds should be maintained consistently for at least 30 to 90 days. For full GKS scholarship recipients, this bank solvency requirement is completely waived.',
  },
  {
    question: 'Are international students allowed to work part-time in South Korea?',
    answer:
      'Yes. International students holding a D-2 visa can work part-time legally after obtaining a Part-Time Work Permit (S-3) from the local immigration office via HiKorea. Undergraduate students with TOPIK Level 3 or higher can work up to 20–25 hours per week during semester time and unlimited hours during summer and winter vacations. Minimum wage in South Korea is approximately KRW 9,860 to KRW 10,000 (~USD 7.50–8.00) per hour. Students without TOPIK certification have their work hours restricted to 10 hours per week.',
  },
  {
    question: 'What is the post-graduation work visa (D-10) and employment pathway in South Korea?',
    answer:
      'Upon graduating from a recognized Korean university with an Associate, Bachelor’s, or Master’s degree, international students can transition to the D-10 Job Seeker Visa. This visa allows legal residence in South Korea for up to 2 years (granted in 6-month renewable increments based on a points system evaluating GPA, degree level, and TOPIK score). Once you secure a qualifying job offer in technology, engineering, manufacturing, or business, your status converts directly into an E-7 Professional Employment Visa or the fast-track F-2-7 Points-Based Resident Visa.',
  },
];

export default async function StudyInSouthKoreaPage() {
  const universities = await prisma.university.findMany({
    where: { country: { contains: 'Korea' }, isActive: true },
    include: {
      programs: { where: { status: 'active' }, take: 4 },
      scholarships: { where: { status: 'active' }, take: 2 },
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
        name: 'Study in South Korea from Bangladesh: Costs, Visa & Universities (2027 Benchmark)',
        description:
          'Official 2026/27 guide: GKS scholarship tracks, 6 verified universities, tuition (USD 4,000–10,000/yr), D-2 student visa solvency, and D-10 job seeker pathway for Bangladeshi students.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/south-korea.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(KOREA_OFFICIAL_AUTHORITIES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#universities`,
        name: 'Verified South Korean Universities for Bangladeshi Students',
        numberOfItems: universities.length,
        itemListElement: universities.map((u, i) => ({
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
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: 'South Korea' }]}
        eyebrow="Wave 1 Active Destination · Asian High-Tech & Innovation Hub · GKS Quota & English STEM Tracks"
        title="Study in South Korea from Bangladesh: Costs, Visa & Universities."
        lead="South Korea ranks among the world’s top spenders in R&D, semiconductors, robotics, and artificial intelligence. Bangladeshi students benefit from generous Global Korea Scholarships (GKS), fully funded professor STEM research assistantships, English-taught programs at KAIST and SKY universities, and a 2-year D-10 post-graduation job seeker visa."
        reviewed="November 2026"
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Korea Eligibility Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/south-korea-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Korea Study Cost Guide (2027)
            </Link>
            <a href="#universities" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              View 6 Verified Universities
            </a>
          </>
        }
      />

      <TrustBar />

      {/* 3. Who This Country Fits — And Who Should Reconsider */}
      <Section
        id="who-fits"
        tone="white"
        title="Who South Korea fits — and who should reconsider."
        intro="South Korea provides world-class STEM education, generous research lab stipends, and clear technology career pathways, but requires strong academic discipline and substantial bank solvency for self-funded applicants. Review our evidence-based assessment below."
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
                <span><strong>Targeting STEM, AI, Robotics &amp; Semiconductors:</strong> Korea is the global semiconductor and tech powerhouse (Samsung, SK Hynix, LG, Hyundai). Labs offer funded Master’s and PhD research assistantships.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Aiming for the Global Korea Scholarship (GKS):</strong> Academic top-performers (GPA 4.5+ or 80%+) prepared to compete for 100% tuition, monthly KRW 1M stipend, airfare, and 1-year language immersion.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Seeking English-Taught Degrees at Top 50 Institutions:</strong> KAIST offers 100% English curriculum with full tuition waivers; Yonsei UIC and Korea University offer international bachelor’s programs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Committed to Post-Graduation Career in Tech:</strong> Graduates qualify for up to 2 years of D-10 job search and transition easily to E-7/F-2-7 work and permanent residency visas.</span>
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
                <span><strong>Self-Funded Students Lacking Bank Solvency:</strong> The Korean Embassy in Dhaka strictly requires USD 16,000–20,000 held for 30–90 days. If your family cannot document these funds, self-funded D-2 visas will be refused.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Unwilling to Learn Korean for Off-Campus Jobs:</strong> Off-campus part-time work without TOPIK Level 3 is legally restricted to 10 hours/week, and local high-paying jobs require conversational Korean.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Expecting Casual Academic Workloads:</strong> Korean universities maintain high academic intensity. Grading is frequently on a strict relative curve where poor GPA can lead to scholarship cancellation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Relying on Non-Apostille Unverified Documents:</strong> Korean admission and visa applications require rigorous Ministry of Foreign Affairs (MOFA) attestation and embassy consular authentication in Dhaka.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 4. Education System & Recognition */}
      <Section
        id="education-system"
        tone="sage"
        title="South Korean higher education system &amp; global rankings."
        intro="South Korea's higher education system is internationally celebrated for technological innovation, rigorous research output, and state-backed corporate partnerships with global conglomerates."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <GraduationCap className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">4-Year Bachelor’s &amp; 2-Year Master’s</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Undergraduate degrees (Haksa) require 4 years (130–140 credit hours). Master’s programs (Seoksa) require 2 years (24–36 course credits plus an approved thesis). Integrated Master-PhD programs offer accelerated 4–5 year doctoral tracks.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Building2 className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">World Top 100 QS Rankings</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Seoul National University (#31 globally), KAIST (#53), Yonsei University (#56), and Korea University (#67) rank among the world’s elite research powerhouses, consistently placing higher than most UK Russell Group or Australian Go8 institutions.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Award className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">UGC Recognition &amp; BCS Equivalence</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              All state and chartered private Korean universities are fully recognized by the University Grants Commission (UGC) of Bangladesh. Degrees are certified for BCS examination eligibility, Bangladesh civil service equivalence, and global postgraduate study.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Verified Korean Universities in Catalog */}
      <Section
        id="universities"
        tone="white"
        title="6 verified South Korean universities for Bangladeshi students."
        intro="Explore our active institutional profiles in South Korea. Each university features verified tuition costs, English-taught degree options, and active scholarship pathways."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="flex flex-col justify-between rounded-3xl border border-petrol-800/15 bg-white p-6 transition hover:border-petrol-800/40 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="size-3.5 text-emerald-600" /> Verified 2026/27
                  </span>
                  <span className="text-[12px] font-medium text-ink-soft flex items-center gap-1">
                    <MapPin className="size-3 text-ink-soft" /> {uni.city}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-[20px] font-bold text-petrol-800 leading-tight">
                  {uni.name}
                </h3>
                <p className="mt-1 text-[13px] text-ink-soft">
                  {uni.location || 'Leading South Korean Research University'}
                </p>

                <div className="mt-4 border-t border-petrol-800/10 pt-4">
                  <div className="text-[13px] text-ink-soft">
                    <strong className="text-petrol-800 font-semibold">Active Programs:</strong> {uni.programs.length} verified in catalog
                  </div>
                  {uni.programs.length > 0 && (
                    <ul className="mt-2 space-y-1.5 text-[12.5px] text-slate-700">
                      {uni.programs.slice(0, 3).map((p) => (
                        <li key={p.id} className="flex items-center gap-1.5 truncate">
                          <span className="size-1.5 rounded-full bg-petrol-800/50" />
                          <span className="truncate">{p.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {uni.scholarships.length > 0 && (
                  <div className="mt-3 rounded-xl bg-lime-50/70 p-2.5 text-[12px] text-lime-900 border border-lime-200">
                    <strong>Funding:</strong> {uni.scholarships[0]?.title || 'GKS & Institutional Merit Scholarships'}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-petrol-800/10 flex items-center justify-between">
                <Link
                  href={`/universities/${uni.slug}`}
                  className="text-[13.5px] font-bold text-petrol-800 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  Inspect Full Profile <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href={`/apply?university=${encodeURIComponent(uni.name)}`}
                  className="rounded-lg bg-petrol-800 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-petrol-900 transition"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Admission Requirements for Bangladeshi Students */}
      <Section
        id="admission-requirements"
        tone="sage"
        title="Admission requirements for Bangladeshi applicants."
        intro="Admission standards in South Korea evaluate academic consistency, language preparedness (IELTS or TOPIK), and family financial capability. Review the criteria for undergraduate and postgraduate entry."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7">
            <h3 className="font-display text-[18px] font-bold text-petrol-800 flex items-center gap-2">
              <School className="size-5 text-emerald-700" /> Undergraduate Admission (Bachelor’s)
            </h3>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">1.</span>
                <span><strong>HSC / Alim Examination:</strong> Minimum GPA 3.80 to 4.50 out of 5.00 (Science background required for Engineering/IT programs; Commerce for Business).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">2.</span>
                <span><strong>Cambridge / Edexcel O &amp; A-Levels:</strong> Minimum 5 O-Levels + 2 A-Levels (grades B or higher preferred for competitive SKY and KAIST admissions). Direct entry without foundation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">3.</span>
                <span><strong>Language Proficiency:</strong> For English-track programs (KAIST, Yonsei UIC, Korea University DIS): IELTS Academic overall 6.0–6.5 or TOEFL iBT 80+. For Korean-track programs: TOPIK Level 3 minimum (Level 4+ recommended).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">4.</span>
                <span><strong>Apostille &amp; Legalization:</strong> All academic certificates and transcripts must be attested by the Education Board, Ministry of Foreign Affairs (MOFA) in Dhaka, and consular-legalized by the Korean Embassy.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7">
            <h3 className="font-display text-[18px] font-bold text-petrol-800 flex items-center gap-2">
              <BookOpen className="size-5 text-petrol-800" /> Postgraduate Admission (Master’s &amp; PhD)
            </h3>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">1.</span>
                <span><strong>4-Year Bachelor’s Degree:</strong> Accredited undergraduate degree from a recognized Bangladeshi university with a minimum CGPA of 3.00 out of 4.00 (higher for STEM research groups).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">2.</span>
                <span><strong>Professor Contact &amp; Lab Acceptance (STEM):</strong> Securing a preliminary acceptance email or Recommendation Letter from a Korean lab professor (P.I.) is the single most effective pathway to securing full tuition waivers and monthly research stipends.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">3.</span>
                <span><strong>English Proficiency:</strong> IELTS Academic overall 6.0 to 6.5 or TOEFL iBT 85+. Several STEM faculties accept university Medium of Instruction (MOI) certificates from recognized Bangladeshi English-medium engineering departments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">4.</span>
                <span><strong>Statement of Purpose &amp; Research Plan:</strong> Detailed 2–3 page academic statement articulating research interests, lab methodology, and career application.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7. Total Cost & Funding Reality */}
      <Section
        id="costs"
        tone="white"
        title="Itemized costs &amp; funding reality in South Korea (2026/27)."
        intro="South Korea combines high living standards with reasonable public university tuition. We itemize actual university tuition, monthly living expenses, official consular visa fees, and the complete Global Korea Scholarship (GKS) package."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-petrol-800/10 bg-petrol-800/5 text-petrol-800">
              <tr>
                <th className="px-5 py-4 font-bold">Expense Category</th>
                <th className="px-5 py-4 font-bold">Official Korean Cost</th>
                <th className="px-5 py-4 font-bold">BDT Equivalent (~1 USD = 122 BDT)</th>
                <th className="px-5 py-4 font-bold">Payment Recipient &amp; Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">National / Public University Tuition (SNU, KAIST, PNU)</td>
                <td className="px-5 py-3.5">USD 3,500 – USD 6,000 / year</td>
                <td className="px-5 py-3.5 font-medium">BDT 4.27 Lakh – BDT 7.32 Lakh / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Paid per semester via Student File bank wire</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Private University Tuition (Yonsei, Korea, SKKU)</td>
                <td className="px-5 py-3.5">USD 6,500 – USD 10,000 / year</td>
                <td className="px-5 py-3.5 font-medium">BDT 7.93 Lakh – BDT 12.20 Lakh / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Paid per semester (merit scholarships deduct 30%–70%)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Seoul Metropolitan Monthly Living (Dorm/Goshiwon, Food)</td>
                <td className="px-5 py-3.5">USD 600 – USD 900 / month</td>
                <td className="px-5 py-3.5 font-medium">BDT 73,200 – BDT 109,800 / month</td>
                <td className="px-5 py-3.5 text-ink-soft">Campus dorms KRW 300k–500k/mo; Goshiwon KRW 350k–550k</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Regional City Monthly Living (Daejeon, Busan, Daegu)</td>
                <td className="px-5 py-3.5">USD 450 – USD 650 / month</td>
                <td className="px-5 py-3.5 font-medium">BDT 54,900 – BDT 79,300 / month</td>
                <td className="px-5 py-3.5 text-ink-soft">Affordable dormitories and dining halls on campus</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">D-2 Student Visa Application Fee (Dhaka Embassy)</td>
                <td className="px-5 py-3.5">USD 60</td>
                <td className="px-5 py-3.5 font-medium">BDT 7,320</td>
                <td className="px-5 py-3.5 text-ink-soft">Paid to Embassy of the Republic of Korea in Dhaka</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">National Health Insurance Service (NHIS)</td>
                <td className="px-5 py-3.5">~KRW 70,000 / month (~USD 52/mo)</td>
                <td className="px-5 py-3.5 font-medium">~BDT 6,350 / month</td>
                <td className="px-5 py-3.5 text-ink-soft">Mandatory statutory health insurance after arrival in Korea</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">EduExpress Counseling &amp; Admission Service</td>
                <td className="px-5 py-3.5">Transparent written schedule</td>
                <td className="px-5 py-3.5 font-bold text-emerald-700">ClearCost Guarantee</td>
                <td className="px-5 py-3.5 text-ink-soft">Zero hidden surcharges; itemized in formal agreement</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Global Korea Scholarship (GKS) Highlight Box */}
        <div className="mt-6 rounded-3xl border border-emerald-700/25 bg-emerald-50/70 p-6 sm:p-7">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-[18px]">
            <Sparkles className="size-6 text-emerald-700" />
            <span>Global Korea Scholarship (GKS) Government Package (NIIED)</span>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-[13.5px] text-slate-800">
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">100% Tuition Exemption</strong>
              <span>Full university tuition covered for entire degree period (4 years UG / 2 years Master / 3 years PhD).</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">Monthly Living Stipend</strong>
              <span>KRW 1,000,000/month (~USD 750) for UG; KRW 1,000,000–1,500,000/month (~USD 750–1,120) for Graduate.</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">1-Year Korean Language</strong>
              <span>100% funded preliminary Korean language training at an accredited Korean university language center.</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">Airfare &amp; Settlement</strong>
              <span>Round-trip economy flight tickets + KRW 200,000 settlement allowance + complete medical insurance.</span>
            </div>
          </div>
          <p className="mt-4 text-[13px] text-emerald-900 font-medium">
            * Note: EduExpress does NOT sell government scholarships. GKS awards are strictly granted by NIIED and the Korean Embassy. We provide authentic profile auditing, SOP &amp; Study Plan mentoring, professor outreach guidance, and consular interview preparation.
          </p>
        </div>

        {/* Detailed Cost Guide Cross-Link */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs">
          <div>
            <h4 className="font-bold text-petrol-800 text-[16px]">Need an itemized, line-by-line financial breakdown for South Korea?</h4>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              Inspect semester tuition at SNU, KAIST, Yonsei &amp; SKKU, Seoul vs regional living budgets, Korean Embassy approved bank solvency guidelines (USD 20k / USD 16k–18k), and student work earnings.
            </p>
          </div>
          <Link href="/south-korea-study-cost-bangladesh" className="ed-btn ed-btn-signal shrink-0 text-xs px-6 py-3">
            South Korea Cost Guide (2027) <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </Section>

      {/* 8. Visa & Residence Permit Process */}
      <Section
        id="visa-process"
        tone="sage"
        title="D-2 student visa &amp; Alien Registration Card (ARC) roadmap."
        intro="Obtaining a South Korean D-2 student visa requires obtaining an official Certificate of Admission (CoA) from your university, followed by document legalization and visa lodgement at the Korean Embassy in Dhaka."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 1</div>
            <h4 className="mt-1 font-bold text-slate-900">Offer &amp; CoA Issuance</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Accept admission offer, pay tuition deposit (or obtain GKS award), and receive official Certificate of Admission (CoA).
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 2</div>
            <h4 className="mt-1 font-bold text-slate-900">MOFA &amp; Consular Legalization</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Attest academic certificates and transcripts at Education Board, MOFA Dhaka, and Korean Embassy Consular section.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 3</div>
            <h4 className="mt-1 font-bold text-slate-900">Bank Solvency (USD 16k–20k)</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Generate bank statement and solvency certificate in student/parent name held for 30–90 days (waived for full GKS).
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 4</div>
            <h4 className="mt-1 font-bold text-slate-900">Embassy Visa Lodgement</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Submit D-2 visa application dossier, TB clearance certificate from designated hospital, and attend interview in Dhaka.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 5</div>
            <h4 className="mt-1 font-bold text-slate-900">Visa Grant Notice</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Check visa status online via Korea Visa Portal and download official Visa Grant Notice document.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 6</div>
            <h4 className="mt-1 font-bold text-slate-900">ARC Collection in Korea</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Register at local immigration office via HiKorea within 90 days to receive your plastic Alien Registration Card (ARC).
            </p>
          </div>
        </div>
      </Section>

      {/* 9. Work Rights & Post-Study Career Pathways */}
      <Section
        id="work-rights"
        tone="white"
        title="Part-time work permissions (S-3) &amp; 2-year D-10 job seeker visa."
        intro="South Korea provides clear, regulated employment rights during your degree and a structured 2-year job-search visa leading to professional employment."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Clock className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">10–25 Hours / Week Part-Time Work</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              D-2 students who have completed one semester can work part-time legally after obtaining university confirmation and immigration permission (S-3). Students with TOPIK Level 3+ can work up to 25 hours per week during term time and unlimited hours during vacations. Minimum wage is ~KRW 9,860/hr.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Compass className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">2-Year D-10 Job Seeker Visa</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Graduates from accredited Korean institutions qualify for the D-10 Job Seeker Visa. Granted in 6-month renewable terms for up to 2 years, it allows you to reside legally in Korea while interviewing for professional jobs, internships, and research contracts.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Plane className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">E-7 &amp; F-2-7 Points Residency</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Securing a full-time contract with a Korean corporation or research laboratory converts your status to an E-7 Professional Employment Visa. High-earning tech/engineering professionals can fast-track to the F-2-7 points-based resident visa and eventual F-5 permanent residency.
            </p>
          </div>
        </div>
      </Section>

      {/* 10. Intake Calendar */}
      <Section
        id="intakes"
        tone="sage"
        title="Intake calendar: March main intake vs. September intake."
        intro="The Korean academic year begins in March (Spring Semester), which serves as the primary intake for domestic and international students. A second intake opens in September (Fall Semester)."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-700/20 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[18px] text-emerald-900">March Intake (Spring Main Intake)</span>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">Flagship</span>
            </div>
            <p className="mt-2 text-[14px] text-ink-soft">
              Primary intake across 100% of Bachelor’s, Master’s, and PhD departments in Korea.
            </p>
            <dl className="mt-4 space-y-2.5 text-[13.5px] border-t border-petrol-800/10 pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-soft">GKS Undergraduate Deadline:</dt>
                <dd className="font-semibold text-petrol-800">September – October (Previous Year)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Self-Funded University Applications:</dt>
                <dd className="font-semibold text-petrol-800">September 1 – October 30</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Interview &amp; Admission Results:</dt>
                <dd className="font-semibold text-petrol-800">November – December</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">D-2 Visa Lodgement in Dhaka:</dt>
                <dd className="font-semibold text-petrol-800">December – January</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[18px] text-petrol-800">September Intake (Fall Semester)</span>
              <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-700">Major Intake</span>
            </div>
            <p className="mt-2 text-[14px] text-ink-soft">
              Extensive intake for international students, particularly for Graduate STEM research labs.
            </p>
            <dl className="mt-4 space-y-2.5 text-[13.5px] border-t border-petrol-800/10 pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-soft">GKS Graduate Deadline:</dt>
                <dd className="font-semibold text-petrol-800">February – March (Annual)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Self-Funded University Applications:</dt>
                <dd className="font-semibold text-petrol-800">March 1 – May 15</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Admission &amp; CoA Results:</dt>
                <dd className="font-semibold text-petrol-800">May – June</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">D-2 Visa Lodgement in Dhaka:</dt>
                <dd className="font-semibold text-petrol-800">June – July</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* 11. 3-Way Comparison: South Korea vs. China vs. Hungary */}
      <Section
        id="comparison"
        tone="white"
        title="Compare destinations: South Korea vs. China vs. Hungary."
        intro="Compare your options objectively before committing funds. Review duration, tuition, living costs, and post-study opportunities across our three active Wave 1 destinations."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-petrol-800/10 bg-petrol-800/5 text-petrol-800">
              <tr>
                <th className="px-5 py-4 font-bold">Comparison Metric</th>
                <th className="px-5 py-4 font-bold text-emerald-800">South Korea 🇰🇷 (High-Tech)</th>
                <th className="px-5 py-4 font-bold">China 🇨🇳 (Flagship)</th>
                <th className="px-5 py-4 font-bold">Hungary 🇭🇺 (EU/Schengen)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Average Annual Tuition</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">USD 4,000 – 10,000 (~BDT 4.9L – 12.2L)</td>
                <td className="px-5 py-3.5">CNY 14,000 – 28,000 (~BDT 2.4L – 4.8L)</td>
                <td className="px-5 py-3.5">EUR 3,000 – 8,000 (~BDT 3.9L – 10.4L)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Monthly Living Cost</td>
                <td className="px-5 py-3.5">USD 500 – 850 (~BDT 61k – 104k)</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">CNY 1,500 – 2,500 (~BDT 26k – 43k)</td>
                <td className="px-5 py-3.5">EUR 450 – 700 (~BDT 58k – 91k)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Flagship Full Scholarship</td>
                <td className="px-5 py-3.5">GKS (100% Tuition + KRW 1M/mo + Airfare)</td>
                <td className="px-5 py-3.5">CSC Type A &amp; B, Provincial, University</td>
                <td className="px-5 py-3.5">Stipendium Hungaricum (140+ BD quota)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Degree Duration</td>
                <td className="px-5 py-3.5">Bachelor 4 yrs / Master 2 yrs</td>
                <td className="px-5 py-3.5">Bachelor 4 yrs / Master 2–3 yrs</td>
                <td className="px-5 py-3.5">Bachelor 3–3.5 yrs / Master 1.5–2 yrs</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Part-Time Work Permission</td>
                <td className="px-5 py-3.5">10–25 hrs/wk (S-3 Permit with TOPIK)</td>
                <td className="px-5 py-3.5">Strictly university-approved internships only</td>
                <td className="px-5 py-3.5">24 hours / week during term</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Post-Study Work Authorization</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">2-Year D-10 Job Seeker Visa</td>
                <td className="px-5 py-3.5">Z Work Visa with qualifying employer</td>
                <td className="px-5 py-3.5">9-Month Study-to-Work Permit</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Key Academic Strengths</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">Semiconductors, AI, Robotics, Battery Tech</td>
                <td className="px-5 py-3.5">Engineering, Medicine, CS, Material Science</td>
                <td className="px-5 py-3.5">Medicine, Dentistry, European Engineering</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 12. FAQ Section */}
      <Section id="faqs" tone="sage" title="Frequently asked questions about studying in South Korea.">
        <FaqBlock items={KOREA_FAQS} />
      </Section>

      {/* 13. Official Sources & Review Ownership */}
      <Section id="sources" tone="white" title="Statutory sources &amp; editorial review ownership.">
        <div className="grid gap-4 sm:grid-cols-2">
          {KOREA_OFFICIAL_AUTHORITIES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content reviewed against official NIIED 2026/2027 GKS Guidelines and Korea Immigration Service (HiKorea) D-2/D-10 regulations. Last verified on 26 November 2026. Next scheduled review: 26 February 2027.
          </p>
        </div>
      </Section>

      {/* 14. CTA Band & Education Fit Assessment */}
      <Section id="assessment" tone="sage" title="Assess your South Korea admission &amp; GKS scholarship readiness.">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="Ready to evaluate your South Korean university options?"
        text="Book an in-person session at our Dhanmondi office or schedule a video consultation. We evaluate your academic qualifications, mentor your GKS Study Plan and Statement of Purpose, and guide your document legalization for the Korean Embassy in Dhaka."
        assessmentHref={applyHref}
        assessmentLabel="Start Application Assessment"
      />
    </article>
  );
}
