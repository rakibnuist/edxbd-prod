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
const PATH = '/study-in-hungary-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=Hungary';
export const revalidate = 3600;

const HUNGARY_OFFICIAL_AUTHORITIES = [
  {
    label: 'Tempus Public Foundation (Stipendium Hungaricum Portal)',
    href: 'https://stipendiumhungaricum.hu/',
    note: 'Statutory managing agency for Hungarian government higher education bilateral scholarship quotas',
  },
  {
    label: 'Study in Hungary (Official National Portal)',
    href: 'https://studyinhungary.hu/',
    note: 'Official government portal with verified higher education institutions, programs, and European Credit Transfer (ECTS)',
  },
  {
    label: 'National Directorate-General for Aliens Policing (NDGAP)',
    href: 'http://oif.gov.hu/index.php?lang=en',
    note: 'Immigration authority governing Type-D residence permits for study purposes and the 9-month Study-to-Work extension',
  },
  {
    label: 'Ministry of Education Bangladesh (Secondary & Higher Education Division)',
    href: 'https://shed.gov.bd/',
    note: 'Bilateral sending partner responsible for screening, interview, and national quota nomination for Bangladeshi applicants',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in Hungary from Bangladesh: Costs, Visa & Universities | EduExpress',
    description:
      'Evidence-first guide to studying in Hungary from Bangladesh: Stipendium Hungaricum quota, 6 verified universities, tuition (EUR 3,000–8,000/yr), NDGAP student residence permit, and Schengen mobility.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('hungary', 'Study in Hungary from Bangladesh — EduExpress International'),
  });
}

const HUNGARY_FAQS = [
  {
    question: 'How does the Stipendium Hungaricum bilateral scholarship work for Bangladeshi students?',
    answer:
      'Under the bilateral educational agreement between Hungary and Bangladesh, approximately 140+ fully funded scholarships are allocated annually for Bangladeshi students. The scholarship covers 100% of tuition fees, provides free dormitory accommodation (or a HUF 40,000/month housing allowance), medical health insurance, and a monthly living stipend (HUF 43,700/month for Bachelor/Master and HUF 140,000–180,000/month for PhD). Applicants must apply through BOTH the Tempus online DreamApply portal and the Ministry of Education Bangladesh (SHED) portal by mid-January. Final selections are made by Hungarian host universities after MoE Bangladesh nomination.',
  },
  {
    question: 'Can I study in Hungary as a self-funded student from Bangladesh?',
    answer:
      'Yes. Hungarian public research universities welcome self-funded international students. Annual tuition ranges between EUR 3,000 and EUR 8,000 (~BDT 3.9L – 10.4L) for Engineering, IT, and Business degrees (EUR 14,000 – 17,000 for Medicine and Dentistry). Monthly living expenses in Budapest average EUR 450 – 700 (~BDT 58k – 91k), while regional university cities like Debrecen, Szeged, and Pécs cost EUR 350 – 500 (~BDT 45k – 65k). Self-funded students can open a Bangladesh Bank Student File to remit legal tuition payments.',
  },
  {
    question: 'Where do Bangladeshi students submit their Hungarian Type-D student visa application?',
    answer:
      'Because Hungary does not maintain a full resident consular visa section in Dhaka, Bangladeshi applicants submit their long-term Type-D student visa application dossier and biometrics either at the Embassy of Hungary in New Delhi (India) or through authorized VFS Global visa application centers designated for Hungarian consular processing. The dossier is adjudicated by the National Directorate-General for Aliens Policing (NDGAP) in Hungary. Upon arrival in Hungary, the student collects their plastic biometric Residence Permit card within 30 days.',
  },
  {
    question: 'Are Bangladeshi students allowed to work part-time while studying in Hungary?',
    answer:
      'Yes. Under Hungarian immigration regulations, international students holding a valid Residence Permit for Study Purposes are legally permitted to work up to 24 hours per week during term time, and up to 66 working days (or full-time) during official university semester breaks and holidays. Typical student wages range from HUF 1,800 to HUF 2,600 (~EUR 4.50 – 6.50) per hour.',
  },
  {
    question: 'What is the post-study work opportunity in Hungary after graduation?',
    answer:
      'Graduates who successfully complete an accredited degree program at a Hungarian higher education institution can apply for the "Study-to-Work" residence permit (Álláskeresési vagy vállalkozásindítási célú tartózkodási engedély). This grants an additional 9 months of legal residence in Hungary to secure full-time employment or register a business, which then converts into a standard Hungarian work residence permit or EU Blue Card.',
  },
];

export default async function StudyInHungaryPage() {
  const universities = await prisma.university.findMany({
    where: { country: 'Hungary', isActive: true },
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
        name: 'Study in Hungary from Bangladesh: Costs, Visa & Universities (2027 Benchmark)',
        description:
          'Official 2026/27 tuition (EUR 3,000–8,000/yr), Stipendium Hungaricum bilateral quota, NDGAP residence permit, and Schengen mobility guide for Bangladeshi students.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/hungary.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(HUNGARY_OFFICIAL_AUTHORITIES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#universities`,
        name: 'Verified Hungarian Universities for Bangladeshi Students',
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
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: 'Hungary' }]}
        eyebrow="Wave 1 Active Destination · European Union & Schengen Member · Stipendium Hungaricum Quota"
        title="Study in Hungary from Bangladesh: Costs, Visa & Universities."
        lead="Hungary delivers internationally accredited European university degrees at a fraction of Western costs. Bangladeshi students benefit from 140+ annual Stipendium Hungaricum government scholarships, affordable self-funded tuition (EUR 3,000–8,000/yr), and unrestricted mobility across 29 Schengen nations."
        reviewed="November 2026"
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Hungary Eligibility Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/hungary-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Hungary Cost Guide (2027)
            </Link>
            <Link href="/hungary-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Hungary Student Visa Guide
            </Link>
            <Link href="/hungary-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Stipendium Scholarship Guide
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
        title="Who Hungary fits — and who should reconsider."
        intro="Hungary offers prestigious European degrees, EU ECTS mobility, and generous government scholarships, but requires competitive entrance examinations for engineering and medicine. Read our candid assessment before applying."
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
                <span><strong>Targeting the Stipendium Hungaricum Quota:</strong> High-achieving students with strong academic records (HSC GPA 4.5+ or A-Level BBB+) prepared to clear dual MoE Bangladesh and Tempus selection interviews.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Want Budget-Friendly European Degrees:</strong> Families seeking an accredited EU Bachelor’s or Master’s degree with annual tuition from EUR 3,000 (~BDT 3.9L) and living costs from EUR 350/mo.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Seeking Schengen Mobility &amp; 9-Month Job Search:</strong> Students who value legal travel across all 29 Schengen member states and the 9-month Study-to-Work residence permit after graduation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Pursuing Globally Recognized Medicine &amp; Dentistry:</strong> World-renowned medical programs at Debrecen, Pécs, and Szeged recognized by BMDC, WHO, and GMC UK at half the cost of Western schools.</span>
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
                <span><strong>Students Expecting Immediate London-Level Wages:</strong> Hungarian student wages (EUR 4.50–6.50/hr) cover local pocket expenses and food, but cannot pay tuition fees. You must have guaranteed living support.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Unprepared for Science Entrance Exams:</strong> Flagship institutions (BME for engineering, Debrecen/Szeged for medical sciences) require rigorous subject entrance tests in Mathematics, Physics, Chemistry, or Biology.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Seeking Unrealistic Visa Guarantees:</strong> Hungarian consular visa processing includes an in-person academic and financial interview. We reject agencies promising 100% unconditional visa outcomes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Relying Exclusively on English in Daily Life:</strong> While coursework is 100% in English, local administrative life and non-tech internships require basic conversational Hungarian.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 4. Education System & Recognition */}
      <Section
        id="education-system"
        tone="sage"
        title="Hungarian education system &amp; international recognition."
        intro="Hungary was among the earliest signers of the Bologna Declaration, ensuring that Hungarian university credits and degrees are seamlessly transferable across the European Union and recognized in Bangladesh."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <GraduationCap className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Bologna Three-Cycle Structure</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Degrees follow the European standard: 3 to 3.5 years for Bachelor&apos;s (Alapképzés, 180–210 ECTS), 1 to 2 years for Master&apos;s (Mesterképzés, 60–120 ECTS), and 4 years for PhD (Doktori képzés). Medicine and Architecture are 5–6 year one-tier master programs (Osztatlan képzés).
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Building2 className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">MAB &amp; EQAR Quality Accreditation</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              All state universities are accredited by the Hungarian Accreditation Committee (MAB), a full member of the European Association for Quality Assurance in Higher Education (ENQA) and registered on EQAR, guaranteeing European quality benchmarks.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Award className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">UGC &amp; BMDC Recognition</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Accredited Hungarian public research universities are fully recognized by the University Grants Commission (UGC) of Bangladesh for government equivalence and BCS examinations. Medical programs at Debrecen, Pécs, and Szeged meet BMDC licensing criteria.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Verified Hungarian Universities in Catalog */}
      <Section
        id="universities"
        tone="white"
        title="6 verified Hungarian universities for Bangladeshi students."
        intro="Explore our active institutional profiles in Hungary. Each university features verified 2026/2027 tuition fees, active English-taught faculties, and direct application support from our Dhanmondi desk."
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
                  {uni.location || 'Leading Hungarian Public Research University'}
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
                    <strong>Funding:</strong> {uni.scholarships[0]?.title || 'Stipendium Hungaricum & Merit Awards'}
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
        intro="Admission standards in Hungary are merit-based and transparent. Below are statutory academic and language benchmarks for Bangladeshi curriculum (HSC) and international curriculum (O/A-Levels) students."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7">
            <h3 className="font-display text-[18px] font-bold text-petrol-800 flex items-center gap-2">
              <School className="size-5 text-emerald-700" /> Undergraduate Admission (Bachelor&apos;s)
            </h3>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">1.</span>
                <span><strong>HSC / Alim:</strong> Minimum GPA 3.50 to 4.00 out of 5.00 depending on faculty (Engineering, IT, and Business prioritize Science and Commerce backgrounds).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">2.</span>
                <span><strong>Cambridge / Edexcel O &amp; A-Levels:</strong> Minimum 5 O-Levels + 2 A-Levels (grades C or higher). Direct entry to Year 1 without foundation for qualified candidates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">3.</span>
                <span><strong>English Proficiency:</strong> IELTS Academic overall 5.5 to 6.5 (or TOEFL iBT 72+, PTE Academic 50+). Several universities accept English Medium of Instruction (MOI) certificates from recognized Bangladeshi English-medium schools or host an internal online English evaluation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">4.</span>
                <span><strong>Online Entrance Test &amp; Interview:</strong> Technical universities (e.g. BME, Debrecen, Pécs) administer a remote 60-minute online test in Mathematics/Physics followed by a 15-minute motivational interview via Teams/Zoom.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7">
            <h3 className="font-display text-[18px] font-bold text-petrol-800 flex items-center gap-2">
              <BookOpen className="size-5 text-petrol-800" /> Postgraduate Admission (Master&apos;s &amp; PhD)
            </h3>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">1.</span>
                <span><strong>4-Year Bachelor’s Degree:</strong> Accredited undergraduate degree from a recognized Bangladeshi public or private university (CGPA 2.75+ out of 4.00 preferred).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">2.</span>
                <span><strong>Credit Alignment (ECTS Pre-evaluation):</strong> Hungarian faculties evaluate your undergraduate transcript to verify at least 30–60 relevant European ECTS credits in mathematics, core sciences, or economics.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">3.</span>
                <span><strong>English Proficiency:</strong> IELTS Academic 6.0 to 6.5. Official university Medium of Instruction (MOI) verification letters are widely accepted for graduates of Bangladeshi English-medium degree programs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">4.</span>
                <span><strong>Research Proposal (PhD only):</strong> 3–5 page structured research synopsis, preliminary supervisor acceptance letter from a Hungarian doctoral school, and 2 academic recommendation letters.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7. Total Cost & Funding Reality */}
      <Section
        id="costs"
        tone="white"
        title="Itemized costs &amp; funding reality in Hungary (2026/27)."
        intro="Financial planning for Hungary is predictable. We itemize actual university tuition, monthly living expenses, official consular visa fees, and the complete Stipendium Hungaricum package so your family plans with zero surprises."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-petrol-800/10 bg-petrol-800/5 text-petrol-800">
              <tr>
                <th className="px-5 py-4 font-bold">Expense Category</th>
                <th className="px-5 py-4 font-bold">Official Hungarian Cost</th>
                <th className="px-5 py-4 font-bold">BDT Equivalent (~1 EUR = 130 BDT)</th>
                <th className="px-5 py-4 font-bold">Payment Recipient &amp; Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Bachelor’s / Master’s Tuition (Self-Funded)</td>
                <td className="px-5 py-3.5">EUR 3,000 – EUR 8,000 / year</td>
                <td className="px-5 py-3.5 font-medium">BDT 3.90 Lakh – BDT 10.40 Lakh / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Direct to university via Student File before visa</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Medical / Dentistry Tuition (Debrecen/Szeged/Pécs)</td>
                <td className="px-5 py-3.5">EUR 14,000 – EUR 17,000 / year</td>
                <td className="px-5 py-3.5 font-medium">BDT 18.20 Lakh – BDT 22.10 Lakh / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Direct to university medical faculty per semester</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Budapest Monthly Living (Rent, Food, Transport)</td>
                <td className="px-5 py-3.5">EUR 450 – EUR 700 / month</td>
                <td className="px-5 py-3.5 font-medium">BDT 58,500 – BDT 91,000 / month</td>
                <td className="px-5 py-3.5 text-ink-soft">Monthly living in Budapest private flat or shared room</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Provincial City Living (Debrecen, Szeged, Pécs)</td>
                <td className="px-5 py-3.5">EUR 350 – EUR 500 / month</td>
                <td className="px-5 py-3.5 font-medium">BDT 45,500 – BDT 65,000 / month</td>
                <td className="px-5 py-3.5 text-ink-soft">Campus dorms cost EUR 100–150/mo; flats EUR 250–350</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Type-D Visa &amp; Residence Permit Application Fee</td>
                <td className="px-5 py-3.5">EUR 110</td>
                <td className="px-5 py-3.5 font-medium">BDT 14,300</td>
                <td className="px-5 py-3.5 text-ink-soft">Paid to Embassy / VFS at time of biometrics submission</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Health Insurance (Generali / Uni-Med)</td>
                <td className="px-5 py-3.5">EUR 200 – EUR 350 / year</td>
                <td className="px-5 py-3.5 font-medium">BDT 26,000 – BDT 45,500 / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Annual private student health insurance (free for Stipendium)</td>
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

        {/* Stipendium Hungaricum Highlight Box */}
        <div className="mt-6 rounded-3xl border border-emerald-700/25 bg-emerald-50/70 p-6 sm:p-7">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-[18px]">
            <Sparkles className="size-6 text-emerald-700" />
            <span>Stipendium Hungaricum Government Scholarship Package (Bangladesh Bilateral Quota)</span>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-[13.5px] text-slate-800">
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">100% Tuition Exemption</strong>
              <span>Full waiver covering entire nominal study period (3–4 years UG, 2 years Master, 4 years PhD).</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">Monthly Stipend</strong>
              <span>HUF 43,700/month (~EUR 110) for Bachelor/Master; HUF 140,000–180,000/month (~EUR 360–460) for PhD.</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">Free Accommodation</strong>
              <span>Guaranteed free dormitory room or HUF 40,000/month (~EUR 100) housing contribution.</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">Medical Insurance</strong>
              <span>Complete health insurance coverage in Hungary up to HUF 65,000/year per person.</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-canvas-soft border border-petrol-800/10 p-4">
            <span className="text-xs font-semibold text-slate-700">Looking for a detailed breakdown of Hungarian university tuition, living expenses in Budapest vs regional cities, and Student File transfers?</span>
            <Link
              href="/hungary-study-cost-bangladesh"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-petrol-800 hover:text-emerald-700 hover:underline"
            >
              Read Full Hungary Study Cost Guide (2027) <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      {/* 8. Visa & Residence Permit Process */}
      <Section
        id="visa-process"
        tone="sage"
        title="Type-D student visa &amp; residence permit roadmap."
        intro="Entering Hungary for higher education requires a long-term Type-D single-entry visa, which is exchanged for a biometric plastic Residence Permit card within 30 days of arrival in Hungary."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 1</div>
            <h4 className="mt-1 font-bold text-slate-900">Acceptance &amp; Fee / Award</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Receive Letter of Acceptance from Hungarian university and pay first-year tuition (or receive Stipendium Letter of Award).
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 2</div>
            <h4 className="mt-1 font-bold text-slate-900">Accommodation Certificate</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Obtain formal dormitory voucher or authenticated Hungarian lease contract (Szállásbejelentő lap) proving residential address.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 3</div>
            <h4 className="mt-1 font-bold text-slate-900">Solvency &amp; Student File</h4>
            <p className="mt-1 text-xs text-ink-soft">
              For self-funded: show EUR 6,000–8,000 living maintenance in bank account for 3+ months (waived for Stipendium Hungaricum awardees).
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 4</div>
            <h4 className="mt-1 font-bold text-slate-900">Biometrics &amp; Interview</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Submit biometrics and original documents at the Hungarian Embassy in New Delhi or designated VFS center, followed by consular interview.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 5</div>
            <h4 className="mt-1 font-bold text-slate-900">Type-D Visa Issuance</h4>
            <p className="mt-1 text-xs text-ink-soft">
              NDGAP adjudicates the case within 15–30 calendar days. A 30-day single-entry Type-D visa sticker is placed in your passport.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 6</div>
            <h4 className="mt-1 font-bold text-slate-900">Biometric Card in Hungary</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Arrive in Hungary and collect your plastic biometric Residence Permit card (Tartózkodási engedély) from NDGAP regional office.
            </p>
          </div>
        </div>
      </Section>

      {/* 9. Work Rights & Post-Study Career Pathways */}
      <Section
        id="work-rights"
        tone="white"
        title="Part-time work rights &amp; 9-month Study-to-Work permit."
        intro="Hungary provides realistic working rights for enrolled students and structured post-study job-seeking pathways under Hungarian and European Union immigration law."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Clock className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">24 Hours / Week Work Rights</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              International students holding a valid Hungarian Residence Permit for Study Purposes may legally work up to 24 hours per week during term time and full-time (up to 66 days) during university holidays. Many students work through student work cooperatives (Iskolaszövetkezet) with tax benefits.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Compass className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">9-Month Study-to-Work Permit</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Upon successful completion of a Bachelor’s or Master’s degree, graduates can apply for a 9-month job-seeking residence permit (Álláskeresési célú tartózkodási engedély). This provides legal residence in Hungary while interviewing with multinational employers.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Plane className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Schengen Mobility &amp; EU Blue Card</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Your Hungarian residence card allows unrestricted 90/180-day travel across all 29 Schengen countries. Once securing a full-time contract matching your qualification with sufficient salary, you transition into a Hungarian Single Permit or an EU Blue Card.
            </p>
          </div>
        </div>
      </Section>

      {/* 10. Intake Calendar */}
      <Section
        id="intakes"
        tone="sage"
        title="Intake calendar: September main vs. February intake."
        intro="Understanding key application deadlines is critical for Hungarian university admissions and bilateral scholarship quotas."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-700/20 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[18px] text-emerald-900">September Intake (Main Academic Intake)</span>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">Flagship</span>
            </div>
            <p className="mt-2 text-[14px] text-ink-soft">
              100% of Bachelor’s, Master’s, Medical, and PhD programs commence in September.
            </p>
            <dl className="mt-4 space-y-2.5 text-[13.5px] border-t border-petrol-800/10 pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Stipendium Hungaricum Deadline:</dt>
                <dd className="font-semibold text-petrol-800">Mid-January (Annual)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Self-Funded Application Deadline:</dt>
                <dd className="font-semibold text-petrol-800">April 30 – June 30</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Entrance Exams &amp; Interviews:</dt>
                <dd className="font-semibold text-petrol-800">March – July</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Type-D Visa Application:</dt>
                <dd className="font-semibold text-petrol-800">June – August</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[18px] text-petrol-800">February Intake (Spring Intake)</span>
              <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-700">Select Programs</span>
            </div>
            <p className="mt-2 text-[14px] text-ink-soft">
              Available for select self-funded Master’s degrees in Business, Computer Science, and Engineering.
            </p>
            <dl className="mt-4 space-y-2.5 text-[13.5px] border-t border-petrol-800/10 pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Application Deadline:</dt>
                <dd className="font-semibold text-petrol-800">October 15 – November 30</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Entrance Exams &amp; Interviews:</dt>
                <dd className="font-semibold text-petrol-800">November – December</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Visa Lodgement:</dt>
                <dd className="font-semibold text-petrol-800">November – January</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Semester Begins:</dt>
                <dd className="font-semibold text-petrol-800">Early February</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* 11. 3-Way Comparison: Hungary vs. China vs. UK */}
      <Section
        id="comparison"
        tone="white"
        title="Compare destinations: Hungary vs. China vs. UK."
        intro="Compare your options objectively before committing funds. Review duration, tuition, living costs, and post-study opportunities across our three primary destinations."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-petrol-800/10 bg-petrol-800/5 text-petrol-800">
              <tr>
                <th className="px-5 py-4 font-bold">Comparison Metric</th>
                <th className="px-5 py-4 font-bold text-emerald-800">Hungary 🇭🇺 (EU/Schengen)</th>
                <th className="px-5 py-4 font-bold">China 🇨🇳 (Flagship)</th>
                <th className="px-5 py-4 font-bold">United Kingdom 🇬🇧</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Average Annual Tuition</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">EUR 3,000 – 8,000 (~BDT 3.9L – 10.4L)</td>
                <td className="px-5 py-3.5">CNY 14,000 – 28,000 (~BDT 2.4L – 4.8L)</td>
                <td className="px-5 py-3.5">£13,000 – 26,000 (~BDT 20.8L – 41.6L)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Monthly Living Cost</td>
                <td className="px-5 py-3.5">EUR 450 – 700 (~BDT 58k – 91k)</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">CNY 1,500 – 2,500 (~BDT 26k – 43k)</td>
                <td className="px-5 py-3.5">£1,136 – £1,483 (~BDT 1.8L – 2.4L)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Flagship Full Scholarship</td>
                <td className="px-5 py-3.5">Stipendium Hungaricum (140+ BD quota)</td>
                <td className="px-5 py-3.5">CSC Type A &amp; B, Provincial, University</td>
                <td className="px-5 py-3.5">Chevening (Highly competitive, Master’s only)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Degree Duration</td>
                <td className="px-5 py-3.5">Bachelor 3–3.5 yrs / Master 1.5–2 yrs</td>
                <td className="px-5 py-3.5">Bachelor 4 yrs / Master 2–3 yrs</td>
                <td className="px-5 py-3.5">Bachelor 3 yrs / Master 1 yr</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Part-Time Work Permission</td>
                <td className="px-5 py-3.5">24 hours / week during term</td>
                <td className="px-5 py-3.5">Strictly university-approved internships only</td>
                <td className="px-5 py-3.5">20 hours / week during term</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Post-Study Work Authorization</td>
                <td className="px-5 py-3.5">9-Month Study-to-Work Permit</td>
                <td className="px-5 py-3.5">Z Work Visa with qualifying employer</td>
                <td className="px-5 py-3.5">2-Year Graduate Route Visa</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Regional Travel Mobility</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">Visa-free travel across 29 Schengen states</td>
                <td className="px-5 py-3.5">Domestic China travel</td>
                <td className="px-5 py-3.5">UK domestic only (Schengen requires visa)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 12. FAQ Section */}
      <Section id="faqs" tone="sage" title="Frequently asked questions about studying in Hungary.">
        <FaqBlock items={HUNGARY_FAQS} />
      </Section>

      {/* 13. Official Sources & Review Ownership */}
      <Section id="sources" tone="white" title="Statutory sources &amp; editorial review ownership.">
        <div className="grid gap-4 sm:grid-cols-2">
          {HUNGARY_OFFICIAL_AUTHORITIES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content reviewed against official Tempus Public Foundation 2026/2027 Call for Applications and NDGAP immigration guidelines. Last verified on 26 November 2026. Next scheduled review: 26 February 2027.
          </p>
        </div>
      </Section>

      {/* 14. CTA Band & Education Fit Assessment */}
      <Section id="assessment" tone="sage" title="Assess your Hungary admission &amp; scholarship readiness.">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="Ready to evaluate your Hungarian university options?"
        text="Book an in-person session at our Dhanmondi office or schedule a video consultation. We evaluate your academic qualifications, verify university entrance requirements, and mentor you through the dual-portal Stipendium Hungaricum dossier."
        assessmentHref={applyHref}
        assessmentLabel="Start Application Assessment"
      />
    </article>
  );
}
