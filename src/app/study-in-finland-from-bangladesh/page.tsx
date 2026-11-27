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
const PATH = '/study-in-finland-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=Finland';
export const revalidate = 3600;

const FINLAND_OFFICIAL_AUTHORITIES = [
  {
    label: 'Finnish Immigration Service (Migri) Student Residence Permit',
    href: 'https://migri.fi/en/residence-permit-for-studies',
    note: 'Official statutory requirements: EUR 800/month (EUR 9,600/year) liquid living funds, tuition receipt, and health insurance',
  },
  {
    label: 'Studyinfo.fi (Opintopolku — Finnish National Agency for Education)',
    href: 'https://opintopolku.fi/konfo/en/',
    note: 'Centralized government application portal for Finnish Joint Application (Yhteishaku), tuition waivers, and SAT score matching',
  },
  {
    label: 'Embassy of Finland in New Delhi & VFS Global Dhaka',
    href: 'https://finlandabroad.fi/web/ind/en',
    note: 'Consular mission responsible for biometric passport verification, identity interviews, and residence permit card processing for Bangladeshi applicants',
  },
  {
    label: 'Bangladesh Bank Foreign Exchange Guidelines (Student File)',
    href: 'https://www.bb.org.bd/',
    note: 'Authorized Dealer (AD) bank wire regulations for Finnish university tuition remittances and EUR 9,600 living fund transfers',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in Finland from Bangladesh: Costs, Visa & Universities | EduExpress',
    description:
      'Evidence-first guide to studying in Finland from Bangladesh: Migri EUR 800/mo funds rule, 6 verified universities, tuition waivers, 30 hrs/wk work rights, and 2-year job seeker permit.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('finland', 'Study in Finland from Bangladesh — EduExpress International'),
  });
}

const FINLAND_FAQS = [
  {
    question: 'What is the official Migri financial requirement for a Finnish student residence permit?',
    answer:
      'Under Finnish Immigration Service (Migri) regulations, applicants must demonstrate a minimum of EUR 800 per month (EUR 9,600 for one full academic year) in living funds. These funds must be held in liquid cash in the student’s own individual bank account (not parents’ name, unless legally transferred into the student’s personal account). In addition, you must show proof of paid first-year tuition (or an official 100% scholarship waiver from your Finnish university). Outdated consultancy claims citing EUR 560/month are obsolete and result in immediate visa refusal.',
  },
  {
    question: 'How do Finnish university scholarships and tuition fee waivers work for Bangladeshi students?',
    answer:
      'All Finnish higher education institutions offer merit-based tuition waivers (ranging from 20% to 100% of annual tuition) for non-EU/EEA students. These scholarships are applied for simultaneously during the centralized Joint Application on Studyinfo.fi in January. Selection is based on academic performance, SAT scores (for Bachelor’s), or bachelor’s CGPA and motivation (for Master’s). Furthermore, the national "Finland Scholarship" grants 100% tuition waiver plus a EUR 5,000 relocation stipend for outstanding Master’s candidates. To renew waivers in subsequent years, students must complete at least 55–60 ECTS credits annually.',
  },
  {
    question: 'What is the difference between a University and a University of Applied Sciences (UAS) in Finland?',
    answer:
      'Finland operates a high-quality dual higher education model. Academic Research Universities (Yliopisto, like University of Helsinki and Aalto) focus on scientific theory, research methodology, and direct pathways to PhDs (which are tuition-free). Universities of Applied Sciences (Ammattikorkeakoulu — UAS, like Metropolia) provide practical, industry-integrated professional degrees with mandatory corporate internships, delivering direct employment in technology, healthcare, and business.',
  },
  {
    question: 'Can Bangladeshi students work part-time while studying in Finland?',
    answer:
      'Yes. Finnish law permits international students holding a valid residence permit for studies to work an average of up to 30 hours per week across the calendar year. There are no hourly restrictions during official university vacation periods (summer and Christmas). Average hourly wages for student jobs in Finland range from EUR 11.00 to EUR 16.00 per hour, which comfortably covers monthly living expenses and student rent.',
  },
  {
    question: 'Where do Bangladeshi students complete biometrics for the Finnish residence permit?',
    answer:
      'After submitting your online residence permit application on the Enter Finland portal, Bangladeshi applicants must schedule an in-person identification appointment at the VFS Global application center or Embassy of Finland consular section (commonly in New Delhi, or seasonal biometric enrollment missions in Dhaka). Once identified, Migri processes the decision in Finland, and your biometric plastic Residence Permit card is delivered prior to departure.',
  },
];

export default async function StudyInFinlandPage() {
  const universities = await prisma.university.findMany({
    where: { country: 'Finland', isActive: true },
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
        name: 'Study in Finland from Bangladesh: Costs, Visa & Universities (2027 Benchmark)',
        description:
          'Official 2026/27 guide: Migri EUR 800/mo funds benchmark, 6 verified Finnish universities, Studyinfo Joint Application, 30 hrs/wk work rights, and 2-year post-study job seeker visa.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/finland.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(FINLAND_OFFICIAL_AUTHORITIES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#universities`,
        name: 'Verified Finnish Universities for Bangladeshi Students',
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
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: 'Finland' }]}
        eyebrow="Wave 1 Active Destination · Nordic Clean-Tech Hub · Migri EUR 800/Mo Standard & 30 Hr/Wk Work Rights"
        title="Study in Finland from Bangladesh: Costs, Visa & Universities."
        lead="Finland combines world-leading education quality, generous 20%–100% university tuition fee waivers, and unmatched student living safety. Bangladeshi students benefit from English-taught STEM and business programs, generous 30 hours/week work rights, and an extended 2-year post-study residence permit."
        reviewed="November 2026"
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Finland Eligibility Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/finland-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Finland Cost Guide (2027)
            </Link>
            <Link href="/finland-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Finland Residence Permit Guide
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
        title="Who Finland fits — and who should reconsider."
        intro="Finland offers world-renowned academic integrity, generous student work permissions, and transparent residence pathways, but strictly enforces personal bank solvency and cold-climate living. Review our evidence-based assessment below."
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
                <span><strong>Targeting High-Tech, Clean Energy &amp; ICT:</strong> Finland is the birthplace of Linux, Nokia, and 6G research. Leading tech universities (Aalto, LUT, Oulu) maintain direct hiring links with global tech employers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Have EUR 9,600 Liquid Living Funds:</strong> Families capable of depositing EUR 800/month (EUR 9,600/year) into the student’s personal account to meet Migri’s strict solvency test.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Seeking Generous 30 Hours/Week Work Allowance:</strong> Finland provides one of the highest student working rights in Europe (30 hrs/wk), with hourly wages from EUR 11–16/hr comfortably covering local rent and food.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Planning for Long-Term Nordic Career:</strong> Graduates receive a 2-year job seeker residence permit, and time spent on a continuous residence permit (A-permit) counts toward permanent residency and citizenship.</span>
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
                <span><strong>Students Relying on Outdated EUR 560/mo Funds Advice:</strong> Migri raised the statutory income threshold to EUR 800/mo (EUR 9,600/yr). Submitting lower balances leads to immediate visa refusal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Expecting Unconditional 100% Living Stipends:</strong> Finnish universities offer tuition waivers (20%–100%), but living allowances are limited to a small number of Finland Scholarships. You must fund your own food and housing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Unwilling to Maintain 55 ECTS Annual Course Credits:</strong> Tuition fee discounts require completing at least 55 ECTS credits per academic year; failing credits causes the scholarship to be revoked.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Sensitive to Sub-Zero Nordic Winters:</strong> Finnish winters feature temperatures down to -15°C to -25°C and short daylight hours. Mental resilience and preparation are essential.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 4. Education System & Recognition */}
      <Section
        id="education-system"
        tone="sage"
        title="Finnish dual higher education system &amp; global prestige."
        intro="Finland's higher education system is split into two complementary sectors: Academic Research Universities and Universities of Applied Sciences (UAS), both adhering to the European Bologna ECTS model."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <GraduationCap className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Universities of Applied Sciences (UAS)</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              UAS institutions (Ammattikorkeakoulu, e.g. Metropolia) provide 3.5 to 4-year Bachelor’s (210–240 ECTS) and 1 to 1.5-year Master’s degrees. Programs feature mandatory hands-on industry projects and internships tailored directly to Finnish workforce demands.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Building2 className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Academic Research Universities</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Traditional universities (Yliopisto, e.g. Helsinki, Aalto, LUT, Tampere, Oulu) offer 3-year Bachelor’s and 2-year Master’s degrees. They emphasize theoretical scientific inquiry, advanced research, and direct pathways to fully tuition-free doctoral (PhD) research.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Award className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">UGC Recognition &amp; Continuous Residence</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              All state-recognized Finnish universities are certified by the University Grants Commission (UGC) of Bangladesh for BCS and public sector recruitment. Importantly, under Finnish law, student residence permits are issued as continuous &quot;A-permits&quot;, which count toward permanent residency.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Verified Finnish Universities in Catalog */}
      <Section
        id="universities"
        tone="white"
        title="6 verified Finnish universities for Bangladeshi students."
        intro="Explore our active institutional profiles in Finland. Each institution features verified 2026/2027 tuition fees, active English-taught bachelor’s and master’s programs, and tuition fee waiver schemes."
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
                  {uni.location || 'Leading Finnish University'}
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
                    <strong>Funding:</strong> {uni.scholarships[0]?.title || 'University Tuition Fee Waiver & Early Bird'}
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
        intro="Admission to Finnish higher education is administered primarily through the national Studyinfo.fi portal. Selection uses standardized criteria: SAT scores, International UAS Exam, or bachelor’s academic merit."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7">
            <h3 className="font-display text-[18px] font-bold text-petrol-800 flex items-center gap-2">
              <School className="size-5 text-emerald-700" /> Undergraduate Admission (Bachelor’s)
            </h3>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">1.</span>
                <span><strong>HSC / Alim Examination:</strong> Minimum GPA 4.00 out of 5.00 from a recognized Bangladesh Education Board (Science track prioritized for Engineering and IT).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">2.</span>
                <span><strong>Cambridge / Edexcel O &amp; A-Levels:</strong> Minimum 5 O-Levels + 2 A-Levels (grades C or higher). Direct entry to Year 1 across UAS and research universities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">3.</span>
                <span><strong>Selection Method (SAT or UAS Exam):</strong> Many universities (e.g. Aalto, LUT, Oulu) admit via SAT scores (minimum 1100–1250+ depending on degree). Alternatively, students take the remote online International UAS Exam (Mathematics, Logical Reasoning, and English).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">4.</span>
                <span><strong>English Proficiency:</strong> IELTS Academic overall 6.0 (with no band below 5.5) or TOEFL iBT 78–80+. Exemptions apply for students meeting SAT Reading/Writing thresholds or completing the UAS Exam.</span>
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
                <span><strong>4-Year Bachelor’s Degree:</strong> Accredited undergraduate degree from a recognized Bangladeshi university in a closely related discipline with minimum CGPA 3.00 out of 4.00.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">2.</span>
                <span><strong>Two Years of Work Experience (UAS Master’s only):</strong> Finnish Universities of Applied Sciences legally require 24 months of relevant post-graduation work experience before entering a Master’s program. (Academic research universities do NOT require work experience).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">3.</span>
                <span><strong>English Proficiency:</strong> IELTS Academic overall 6.5 (with minimum 6.0 in writing) or TOEFL iBT 90+. Official Medium of Instruction (MOI) letters from recognized Bangladeshi English-medium degree programs are accepted by select departments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">4.</span>
                <span><strong>Motivation Letter &amp; Academic CV:</strong> Clear 1–2 page motivation detailing academic trajectory, thesis alignment, and relevant coursework.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7. Total Cost & Funding Reality */}
      <Section
        id="costs"
        tone="white"
        title="Itemized costs &amp; funding reality in Finland (2026/27)."
        intro="Financial planning for Finland is bound by statutory Finnish Immigration Service (Migri) laws. We itemize actual university tuition, monthly living expenses, official consular visa fees, and tuition waiver thresholds so your family budgets with clarity."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-petrol-800/10 bg-petrol-800/5 text-petrol-800">
              <tr>
                <th className="px-5 py-4 font-bold">Expense Category</th>
                <th className="px-5 py-4 font-bold">Official Finnish Cost</th>
                <th className="px-5 py-4 font-bold">BDT Equivalent (~1 EUR = 130 BDT)</th>
                <th className="px-5 py-4 font-bold">Payment Recipient &amp; Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">UAS Bachelor’s Tuition (Metropolia, etc.)</td>
                <td className="px-5 py-3.5">EUR 8,000 – EUR 11,000 / year</td>
                <td className="px-5 py-3.5 font-medium">BDT 10.40 Lakh – BDT 14.30 Lakh / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Paid annually or per semester (early-bird saves 10%–20%)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Research University Tuition (Helsinki, Aalto, LUT)</td>
                <td className="px-5 py-3.5">EUR 10,000 – EUR 15,000 / year</td>
                <td className="px-5 py-3.5 font-medium">BDT 13.00 Lakh – BDT 19.50 Lakh / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Paid to university via Student File wire before visa lodgement</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Statutory Living Solvency (Mandatory Migri Rule)</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">EUR 800 / month (EUR 9,600 / year)</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">BDT 12.48 Lakh / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Must be deposited in student’s personal account for residence permit</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Actual Monthly Living Cost (Helsinki / Capital Metro)</td>
                <td className="px-5 py-3.5">EUR 800 – EUR 1,000 / month</td>
                <td className="px-5 py-3.5 font-medium">BDT 1.04 Lakh – BDT 1.30 Lakh / month</td>
                <td className="px-5 py-3.5 text-ink-soft">Student housing (HOAS) costs EUR 380–550/mo; food EUR 250/mo</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Actual Monthly Living Cost (Tampere, Oulu, Lappeenranta)</td>
                <td className="px-5 py-3.5">EUR 650 – EUR 850 / month</td>
                <td className="px-5 py-3.5 font-medium">BDT 84,500 – BDT 1.10 Lakh / month</td>
                <td className="px-5 py-3.5 text-ink-soft">Regional student foundations (TOAS, PSOAS, LOAS) EUR 250–400/mo</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Migri Electronic Residence Permit Fee (Enter Finland)</td>
                <td className="px-5 py-3.5">EUR 370 (electronic application)</td>
                <td className="px-5 py-3.5 font-medium">BDT 48,100</td>
                <td className="px-5 py-3.5 text-ink-soft">Paid online via credit card at time of submission</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Mandatory Private Health Insurance (Swisscare / SIP)</td>
                <td className="px-5 py-3.5">EUR 250 – EUR 400 / year</td>
                <td className="px-5 py-3.5 font-medium">BDT 32,500 – BDT 52,000 / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Required by Migri (minimum EUR 120,000 medical coverage)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">EduExpress Counseling &amp; Admission Service</td>
                <td className="px-5 py-3.5">Transparent written schedule</td>
                <td className="px-5 py-3.5 font-bold text-emerald-700">ClearCost Guarantee</td>
                <td className="px-5 py-3.5 text-ink-soft">Zero hidden surcharges; itemized in agreement</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tuition Fee Waiver Highlight Box */}
        <div className="mt-6 rounded-3xl border border-emerald-700/25 bg-emerald-50/70 p-6 sm:p-7">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-[18px]">
            <Sparkles className="size-6 text-emerald-700" />
            <span>Finnish Institutional Scholarship Waivers &amp; Finland Scholarship</span>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-[13.5px] text-slate-800">
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">Tuition Fee Waivers</strong>
              <span>20% to 100% waiver applied directly to annual tuition based on SAT score or admission ranking.</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">Finland Scholarship</strong>
              <span>100% tuition waiver for Year 1 + EUR 5,000 relocation grant for top-ranking Master’s applicants.</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">Early-Bird Discount</strong>
              <span>EUR 1,000 to EUR 2,000 tuition discount for accepting your offer within 7 to 14 calendar days.</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">Renewal Requirement</strong>
              <span>Must complete at least 55 ECTS course credits per academic year to maintain waiver for subsequent years.</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-canvas-soft border border-petrol-800/10 p-4">
            <span className="text-xs font-semibold text-slate-700">Looking for a detailed breakdown of Finnish tuition, living budgets, and Student File SWIFT transfers?</span>
            <Link
              href="/finland-study-cost-bangladesh"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-petrol-800 hover:text-emerald-700 hover:underline"
            >
              Read Full Finland Study Cost Guide (2027) <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      {/* 8. Visa & Residence Permit Process */}
      <Section
        id="visa-process"
        tone="sage"
        title="Migri student residence permit (Oleskelulupa) roadmap."
        intro="Entering Finland for degree studies requires obtaining a continuous Type-A residence permit from the Finnish Immigration Service (Migri) via the Enter Finland digital portal."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 1</div>
            <h4 className="mt-1 font-bold text-slate-900">Admission &amp; Tuition Payment</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Accept offer on Studyinfo.fi, pay tuition fee via Student File (or show waiver), and download official Certificate of Admission.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 2</div>
            <h4 className="mt-1 font-bold text-slate-900">Health Insurance Policy</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Purchase comprehensive private medical insurance (Swisscare, SIP, or Aon) with minimum EUR 120,000 coverage.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 3</div>
            <h4 className="mt-1 font-bold text-slate-900">EUR 9,600 Bank Solvency</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Show EUR 800/mo (EUR 9,600/yr) in student’s personal bank account with official bank statement and certificate.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 4</div>
            <h4 className="mt-1 font-bold text-slate-900">Enter Finland Lodgement</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Complete electronic application on enterfinland.fi, upload dossier, and pay EUR 370 processing fee.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 5</div>
            <h4 className="mt-1 font-bold text-slate-900">Identity Verification</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Visit Finnish Embassy / VFS Global application center in person for passport verification and biometric capture.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 6</div>
            <h4 className="mt-1 font-bold text-slate-900">Biometric Card Receipt</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Migri issues decision; plastic biometric Residence Permit card is delivered to applicant prior to traveling to Finland.
            </p>
          </div>
        </div>
      </Section>

      {/* 9. Work Rights & Post-Study Career Pathways */}
      <Section
        id="work-rights"
        tone="white"
        title="30 hours/week work rights &amp; 2-year post-study job seeker permit."
        intro="Finland offers one of the most student-friendly legal employment frameworks in the European Union, alongside transparent pathways to permanent residency."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Clock className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">30 Hours / Week Work Rights</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Degree students holding a Finnish residence permit may legally work up to an average of 30 hours per week across the year (with full-time hours allowed during official summer and holiday breaks). Typical hourly wages range from EUR 11 to EUR 16/hr, allowing students to fund food and rent independently.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Compass className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">2-Year Post-Study Job Seeker Permit</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Upon graduating, international students can apply for an extended 2-year residence permit to look for employment or establish a startup business (Työnhakijan oleskelulupa). The permit can be applied for within 5 years of graduation and utilized in up to three separate periods.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Plane className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Continuous &quot;A-Permit&quot; PR Track</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Since 2022, Finnish student residence permits are granted as continuous &quot;A-status&quot; permits. Time spent on a student permit counts at full value toward the 4-year continuous residence requirement for a Finnish Permanent Residence (P-permit) and European citizenship.
            </p>
          </div>
        </div>
      </Section>

      {/* 10. Intake Calendar */}
      <Section
        id="intakes"
        tone="sage"
        title="Intake calendar: Joint Application in January vs. Autumn rolling intake."
        intro="The cornerstone of Finnish higher education admissions is the nationwide Joint Application (Yhteishaku) conducted every January for degree programs starting in late August or September."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-700/20 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[18px] text-emerald-900">Autumn Intake (September Start — Main Intake)</span>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">Flagship</span>
            </div>
            <p className="mt-2 text-[14px] text-ink-soft">
              Over 95% of English-taught Bachelor’s and Master’s programs admit exclusively through this cycle.
            </p>
            <dl className="mt-4 space-y-2.5 text-[13.5px] border-t border-petrol-800/10 pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Studyinfo Joint Application Period:</dt>
                <dd className="font-semibold text-petrol-800">Early January – Mid January (Strict)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">SAT Score &amp; Document Deadline:</dt>
                <dd className="font-semibold text-petrol-800">Late January – Early February</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">International UAS Remote Exam:</dt>
                <dd className="font-semibold text-petrol-800">Early February</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Admission &amp; Scholarship Results:</dt>
                <dd className="font-semibold text-petrol-800">March – Late May</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Migri Residence Permit Lodgement:</dt>
                <dd className="font-semibold text-petrol-800">May – July</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[18px] text-petrol-800">Spring Intake (January Start — Limited Intake)</span>
              <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-700">Select Programs</span>
            </div>
            <p className="mt-2 text-[14px] text-ink-soft">
              Offered by select Universities of Applied Sciences for technical, business, and nursing degrees.
            </p>
            <dl className="mt-4 space-y-2.5 text-[13.5px] border-t border-petrol-800/10 pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Autumn Joint Application Period:</dt>
                <dd className="font-semibold text-petrol-800">Late August – Mid September</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Entrance Exams &amp; Evaluation:</dt>
                <dd className="font-semibold text-petrol-800">October</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Admission Results:</dt>
                <dd className="font-semibold text-petrol-800">Late November</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Classes Begin:</dt>
                <dd className="font-semibold text-petrol-800">Early January</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* 11. 3-Way Comparison: Finland vs. China vs. Hungary */}
      <Section
        id="comparison"
        tone="white"
        title="Compare destinations: Finland vs. China vs. Hungary."
        intro="Compare your options objectively before committing funds. Review duration, tuition, living costs, and post-study opportunities across our three active European and Asian destinations."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-petrol-800/10 bg-petrol-800/5 text-petrol-800">
              <tr>
                <th className="px-5 py-4 font-bold">Comparison Metric</th>
                <th className="px-5 py-4 font-bold text-emerald-800">Finland 🇫🇮 (Nordic EU)</th>
                <th className="px-5 py-4 font-bold">China 🇨🇳 (Flagship)</th>
                <th className="px-5 py-4 font-bold">Hungary 🇭🇺 (EU/Schengen)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Average Annual Tuition</td>
                <td className="px-5 py-3.5">EUR 8,000 – 15,000 (~BDT 10.4L – 19.5L)</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">CNY 14,000 – 28,000 (~BDT 2.4L – 4.8L)</td>
                <td className="px-5 py-3.5">EUR 3,000 – 8,000 (~BDT 3.9L – 10.4L)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Statutory Monthly Living Fund</td>
                <td className="px-5 py-3.5">EUR 800 / month (~BDT 1.04 Lakh / mo)</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">CNY 1,500 – 2,500 (~BDT 26k – 43k / mo)</td>
                <td className="px-5 py-3.5">EUR 450 – 700 (~BDT 58k – 91k / mo)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Scholarship Mechanisms</td>
                <td className="px-5 py-3.5">20%–100% University Waivers + Early Bird</td>
                <td className="px-5 py-3.5">CSC Type A &amp; B, Provincial, University</td>
                <td className="px-5 py-3.5">Stipendium Hungaricum (140+ BD quota)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Part-Time Work Permission</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">30 hours / week during term (Highest in EU)</td>
                <td className="px-5 py-3.5">Strictly university-approved internships only</td>
                <td className="px-5 py-3.5">24 hours / week during term</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Post-Study Work Authorization</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">2-Year Job Seeker Residence Permit</td>
                <td className="px-5 py-3.5">Z Work Visa with qualifying employer</td>
                <td className="px-5 py-3.5">9-Month Study-to-Work Permit</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Permanent Residency (PR) Pathway</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">Direct A-Permit PR track (4 years continuous)</td>
                <td className="px-5 py-3.5">Standard national foreign residency rules</td>
                <td className="px-5 py-3.5">National settlement after employment</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Regional Travel Mobility</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">Visa-free travel across all 29 Schengen states</td>
                <td className="px-5 py-3.5">Domestic China travel</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">Visa-free travel across all 29 Schengen states</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 12. FAQ Section */}
      <Section id="faqs" tone="sage" title="Frequently asked questions about studying in Finland.">
        <FaqBlock items={FINLAND_FAQS} />
      </Section>

      {/* 13. Official Sources & Review Ownership */}
      <Section id="sources" tone="white" title="Statutory sources &amp; editorial review ownership.">
        <div className="grid gap-4 sm:grid-cols-2">
          {FINLAND_OFFICIAL_AUTHORITIES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content reviewed against official Finnish Immigration Service (Migri) 2026/2027 statutory maintenance standards and Studyinfo.fi Joint Application schedules. Last verified on 26 November 2026. Next scheduled review: 26 February 2027.
          </p>
        </div>
      </Section>

      {/* 14. CTA Band & Education Fit Assessment */}
      <Section id="assessment" tone="sage" title="Assess your Finland admission &amp; residence permit readiness.">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="Ready to evaluate your Finnish university options?"
        text="Book an in-person session at our Dhanmondi office or schedule a video consultation. We audit your academic profile, match your SAT or UAS entrance test readiness, and structure your Migri-compliant financial dossier."
        assessmentHref={applyHref}
        assessmentLabel="Start Application Assessment"
      />
    </article>
  );
}
