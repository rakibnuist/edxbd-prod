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
const PATH = '/study-in-malta-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=Malta';
export const revalidate = 3600;

const MALTA_OFFICIAL_AUTHORITIES = [
  {
    label: 'Identità Malta (Central Visa Unit — Non-EU Student Residence)',
    href: 'https://identita.gov.mt/expatriates-unit-student-visa-guidelines/',
    note: 'Statutory government agency governing National Type-D Student Visas, living fund solvency, and e-Residence card issuance',
  },
  {
    label: 'Malta Further & Higher Education Authority (MFHEA)',
    href: 'https://mfhea.mt/',
    note: 'National regulatory accreditation authority classifying programs on the Malta Qualifications Framework (MQF Levels 5–8)',
  },
  {
    label: 'Jobsplus (Malta National Employment Agency)',
    href: 'https://jobsplus.gov.mt/',
    note: 'Statutory authority issuing student employment licences (up to 20 hours/week) after the mandatory first 90 days of study',
  },
  {
    label: 'Bangladesh Bank Foreign Exchange Policy (Student File Remittance)',
    href: 'https://www.bb.org.bd/',
    note: 'Authorized Dealer (AD) commercial bank regulations for outward tuition wires and living maintenance remittances to Malta',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in Malta from Bangladesh: Costs, Visa & Universities | EduExpress',
    description:
      'Evidence-first guide to studying in Malta from Bangladesh: 100% English degrees, MFHEA accreditation, tuition (EUR 6,000–12,000/yr), Jobsplus work licences, and 9-month job seeker permit.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('malta', 'Study in Malta from Bangladesh — EduExpress International'),
  });
}

const MALTA_FAQS = [
  {
    question: 'Is English an official language in Malta, and are degree programs taught in English?',
    answer:
      'Yes. Malta is one of only two European Union countries (alongside Ireland) where English is an official national language. 100% of lectures, exams, course materials, and administrative services at the University of Malta, MCAST, and licensed higher education institutions are conducted in English. Outside the classroom, daily commerce, signs, and public administration are fully bilingual in English and Maltese.',
  },
  {
    question: 'How do international students obtain a part-time work permit in Malta?',
    answer:
      'Under Maltese immigration law (Legal Notice 229/2018), non-EU/EEA degree students holding a valid student residence permit can legally work up to 20 hours per week during academic terms. However, by statutory law, students must complete their first 90 days of physical residence in Malta before applying for an employment licence. Once eligible, the student and employer jointly apply for a student work licence through Jobsplus (the national employment agency). Average wages range from EUR 6.50 to EUR 9.00 per hour.',
  },
  {
    question: 'What is the bank solvency requirement for a Malta Student Visa from Bangladesh?',
    answer:
      'Under Identità Malta guidelines, applicants must demonstrate proof of adequate living funds equivalent to approximately 75% of Malta’s national minimum wage for each month of study (typically around EUR 650–750 per month, totaling EUR 7,800 to EUR 9,000 for a full academic year). The funds must be documented via official bank statements and a solvency certificate from an Authorized Dealer bank in the student’s or sponsoring parents’ name. In addition, applicants must provide proof of advance tuition payment and an authenticated housing lease contract.',
  },
  {
    question: 'Where do Bangladeshi students submit their Malta visa application?',
    answer:
      'Because the Republic of Malta does not maintain a resident embassy in Dhaka, Bangladeshi applicants submit their long-term Type-D student visa application dossier, biometrics, and verified academic credentials through authorized VFS Global visa application centers designated for Maltese consular processing (with final adjudication conducted by the Central Visa Unit of Identità Malta). Upon arrival in Malta, students register at Identità Expatriates Unit to receive their biometric plastic e-Residence card.',
  },
  {
    question: 'What are the post-graduation work opportunities in Malta for Bangladeshi graduates?',
    answer:
      'Graduates who complete an accredited Bachelor’s (MQF Level 6), Master’s (MQF Level 7), or Doctorate (MQF Level 8) program at a recognized Maltese institution are eligible to apply for an extended 9-month post-study residence permit. This permits graduates to seek professional employment or establish a business in Malta. Securing full-time employment with a registered company allows students to transition smoothly into a standard European Single Work Permit (Single Permit / Key Employee Initiative).',
  },
];

export default async function StudyInMaltaPage() {
  const universities = await prisma.university.findMany({
    where: { country: 'Malta', isActive: true },
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
        name: 'Study in Malta from Bangladesh: Costs, Visa & Universities (2027 Benchmark)',
        description:
          'Official 2026/27 guide: English-taught EU degrees, MFHEA accreditation, tuition (EUR 6,000–12,000/yr), Identità Malta visa regulations, Jobsplus work licence, and Schengen mobility.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/malta.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(MALTA_OFFICIAL_AUTHORITIES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#universities`,
        name: 'Verified Maltese Higher Education Institutions for Bangladeshi Students',
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
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: 'Malta' }]}
        eyebrow="Wave 2 Active Destination · Official English-Speaking European Union Member · Schengen Mobility"
        title="Study in Malta from Bangladesh: Costs, Visa & Universities."
        lead="Malta provides an authentic English-speaking European Union university experience in the sunny Mediterranean. Bangladeshi students benefit from globally accredited MFHEA qualifications, affordable tuition (EUR 6,000–12,000/year), legal Jobsplus part-time work rights, and unrestricted travel across 29 Schengen countries."
        reviewed="November 2026"
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Malta Eligibility Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#universities" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              View Verified Institutions
            </a>
          </>
        }
      />

      <TrustBar />

      {/* 3. Who This Country Fits — And Who Should Reconsider */}
      <Section
        id="who-fits"
        tone="white"
        title="Who Malta fits — and who should reconsider."
        intro="Malta offers high European living quality, English-medium education, and Mediterranean lifestyle, but enforces strict 90-day initial work restrictions and requires verified bank solvency. Read our candid counselor assessment."
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
                <span><strong>Prefer 100% English-Speaking European Living:</strong> Unlike continental Europe where daily administration requires local languages, English is an official national language in Malta spoken fluently by 90%+ of the population.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Targeting Tourism, Hospitality, iGaming &amp; IT:</strong> Malta is the global capital for online gaming, digital marketing, maritime logistics, and Mediterranean hospitality management.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Seeking Bologna ECTS EU Degrees at Moderate Costs:</strong> Tuition at MCAST and ITS ranges between EUR 6,000 and EUR 9,000/year (~BDT 7.8L – 11.7L), far below UK or Australian fee structures.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Value 29-Country Schengen Travel:</strong> Holding a Maltese e-Residence permit allows visa-free business and leisure travel throughout the entire Schengen zone.</span>
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
                <span><strong>Students Expecting to Work from Day One:</strong> By Maltese law, international students cannot work during their first 90 days. You must have full living funds for your first 3 months without relying on part-time wages.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Relying on Unaccredited Private Colleges:</strong> Malta has numerous small private academies. We strictly verify MFHEA institutional accreditation and MQF levels before application to prevent bogus credentials.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Underestimating Island Accommodation Costs:</strong> Due to heavy tourism demand, private studio rentals in central towns (Sliema/St. Julian’s) can be expensive (EUR 700+/mo). Students must budget for shared student flats (EUR 350–500/mo).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Seeking Unconditional Visa Promises:</strong> Identità Malta conducts strict document verification and financial scrutiny. We reject agencies promising 100% unconditional visa outcomes.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 4. Education System & Recognition */}
      <Section
        id="education-system"
        tone="sage"
        title="Malta Qualifications Framework (MQF) &amp; global recognition."
        intro="The Maltese education system is regulated by the Malta Further &amp; Higher Education Authority (MFHEA), aligning directly with the European Qualifications Framework (EQF) and the Bologna Process."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <GraduationCap className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">MQF Levels 5 to 8 Structure</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Qualifications strictly follow European standards: MQF Level 5 (Undergraduate Higher Diploma, 120 ECTS), MQF Level 6 (Bachelor’s, 180–240 ECTS), MQF Level 7 (Master’s, 90–120 ECTS), and MQF Level 8 (Doctorate/PhD).
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Building2 className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">MFHEA Statutory Quality Assurance</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              All higher education programs must be formally accredited by the Malta Further &amp; Higher Education Authority (MFHEA). Degrees are fully recognized across the European Higher Education Area (EHEA) and internationally transferable.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Award className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">UGC Bangladesh &amp; Global Equivalence</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Degrees from chartered state institutions such as the University of Malta and MCAST are fully recognized by the University Grants Commission (UGC) of Bangladesh for government equivalence, BCS exams, and international career progression.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Verified Maltese Higher Education Institutions in Catalog */}
      <Section
        id="universities"
        tone="white"
        title="Verified Maltese institutions for Bangladeshi students."
        intro="Explore our active institutional profiles in Malta. Each profile features verified tuition fees, accredited MFHEA programs, and direct application support from our Dhanmondi desk."
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
                  {uni.location || 'Leading Maltese Higher Education Institution'}
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
                    <strong>Funding:</strong> {uni.scholarships[0]?.title || 'Institutional Fee Discounts & Merit Awards'}
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
        intro="Admission standards in Malta are transparent and practical. We outline the statutory academic and English proficiency criteria for HSC, Alim, and O/A-Levels graduates."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7">
            <h3 className="font-display text-[18px] font-bold text-petrol-800 flex items-center gap-2">
              <School className="size-5 text-emerald-700" /> Undergraduate Admission (Bachelor’s &amp; Diploma)
            </h3>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">1.</span>
                <span><strong>HSC / Alim Examination:</strong> Minimum GPA 3.50 out of 5.00 for Higher Diploma (MQF Level 5) or direct Bachelor’s entry in Business, Computing, and Hospitality.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">2.</span>
                <span><strong>Cambridge / Edexcel O &amp; A-Levels:</strong> Minimum 5 O-Levels + 2 A-Levels (grades C or higher). Direct entry to Year 1 Bachelor’s degrees without foundation year.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">3.</span>
                <span><strong>English Proficiency:</strong> IELTS Academic overall 5.5 to 6.0 (or TOEFL iBT 70+, PTE Academic 46+). Select private institutes accept verified English Medium of Instruction (MOI) certificates from recognized Bangladeshi English-medium institutions or administer an internal online English interview.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">4.</span>
                <span><strong>Academic Attestation:</strong> Board certificates and transcripts must be authenticated by the Education Board and Ministry of Foreign Affairs (MOFA) in Dhaka.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7">
            <h3 className="font-display text-[18px] font-bold text-petrol-800 flex items-center gap-2">
              <BookOpen className="size-5 text-petrol-800" /> Postgraduate Admission (Master’s &amp; MBA)
            </h3>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">1.</span>
                <span><strong>3 or 4-Year Bachelor’s Degree:</strong> Graduation from a UGC-recognized Bangladeshi university with a minimum CGPA of 2.75 out of 4.00 (or second-class division).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">2.</span>
                <span><strong>Flexible Program Conversion:</strong> Many Master’s programs in Business, Marketing, and Project Management welcome graduates from engineering, humanities, and commerce backgrounds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">3.</span>
                <span><strong>English Proficiency:</strong> IELTS Academic 6.0 (with no band below 5.5). Official Medium of Instruction (MOI) verification letters are widely accepted for graduates of Bangladeshi English-taught degree programs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-petrol-800">4.</span>
                <span><strong>Statement of Purpose &amp; CV:</strong> 1–2 page structured academic intent letter explaining career rationale and financial readiness.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7. Total Cost & Funding Reality */}
      <Section
        id="costs"
        tone="white"
        title="Itemized costs &amp; funding reality in Malta (2026/27)."
        intro="Financial planning for Malta is transparent. We itemize actual university tuition, monthly living expenses, official consular visa fees, and required solvency thresholds so your family plans with zero hidden surprises."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-petrol-800/10 bg-petrol-800/5 text-petrol-800">
              <tr>
                <th className="px-5 py-4 font-bold">Expense Category</th>
                <th className="px-5 py-4 font-bold">Official Maltese Cost</th>
                <th className="px-5 py-4 font-bold">BDT Equivalent (~1 EUR = 130 BDT)</th>
                <th className="px-5 py-4 font-bold">Payment Recipient &amp; Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Bachelor’s / Diploma Tuition (MCAST / ITS / Colleges)</td>
                <td className="px-5 py-3.5">EUR 6,000 – EUR 9,500 / year</td>
                <td className="px-5 py-3.5 font-medium">BDT 7.80 Lakh – BDT 12.35 Lakh / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Paid to institution via Student File bank wire</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">University of Malta / Master’s Degree Tuition</td>
                <td className="px-5 py-3.5">EUR 8,500 – EUR 12,000 / year</td>
                <td className="px-5 py-3.5 font-medium">BDT 11.05 Lakh – BDT 15.60 Lakh / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Paid per semester or annual schedule</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Monthly Shared Accommodation (Msida / Gzira / Birkirkara)</td>
                <td className="px-5 py-3.5">EUR 350 – EUR 550 / month</td>
                <td className="px-5 py-3.5 font-medium">BDT 45,500 – BDT 71,500 / month</td>
                <td className="px-5 py-3.5 text-ink-soft">Shared student flat with registered Housing Authority contract</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Food, Utilities &amp; Personal Living</td>
                <td className="px-5 py-3.5">EUR 350 – EUR 450 / month</td>
                <td className="px-5 py-3.5 font-medium">BDT 45,500 – BDT 58,500 / month</td>
                <td className="px-5 py-3.5 text-ink-soft">Groceries, mobile plan, utilities (public bus is free with Tal-Linja)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">National Type-D Student Visa Application Fee</td>
                <td className="px-5 py-3.5">EUR 100</td>
                <td className="px-5 py-3.5 font-medium">BDT 13,000</td>
                <td className="px-5 py-3.5 text-ink-soft">Paid to VFS Global / Central Visa Unit at lodgement</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Health Insurance (Schengen Compliant)</td>
                <td className="px-5 py-3.5">EUR 150 – EUR 250 / year</td>
                <td className="px-5 py-3.5 font-medium">BDT 19,500 – BDT 32,500 / year</td>
                <td className="px-5 py-3.5 text-ink-soft">Annual private international student health policy (min EUR 30,000)</td>
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

        {/* Solvency & Wage Reality Highlight Box */}
        <div className="mt-6 rounded-3xl border border-emerald-700/25 bg-emerald-50/70 p-6 sm:p-7">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-[18px]">
            <Sparkles className="size-6 text-emerald-700" />
            <span>Identità Malta Solvency Rule &amp; Jobsplus Employment Reality</span>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-[13.5px] text-slate-800">
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">Living Solvency Benchmark</strong>
              <span>EUR 7,800 to EUR 9,000 (~75% of national minimum wage x 12 months) in student or parent account.</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">First 90 Days Rule</strong>
              <span>Students cannot work during their first 90 days. Living funds must be provable without work.</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">20 Hours / Week Work</strong>
              <span>After 90 days, Jobsplus licence permits 20 hrs/week at EUR 6.50–9.00/hr (~EUR 500–700/month).</span>
            </div>
            <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
              <strong className="block text-emerald-900">Housing Authority Contract</strong>
              <span>Proof of accommodation must be formally registered online with the Housing Authority of Malta.</span>
            </div>
          </div>
          <p className="mt-4 text-[13px] text-emerald-900 font-medium">
            * Note: EduExpress audits your bank statement to ensure compliance with Identità Malta guidelines and verifies your college’s MFHEA license before you pay any university fee.
          </p>
        </div>
      </Section>

      {/* 8. Visa & Residence Permit Process */}
      <Section
        id="visa-process"
        tone="sage"
        title="National Type-D student visa &amp; e-Residence card roadmap."
        intro="Entering Malta for studies requires obtaining a National Type-D Long Stay Visa, which is converted to a plastic biometric e-Residence Card after arrival in Malta."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 1</div>
            <h4 className="mt-1 font-bold text-slate-900">Offer &amp; Tuition Payment</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Receive unconditional Letter of Acceptance from MFHEA-accredited institution and remit tuition via Bank Student File.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 2</div>
            <h4 className="mt-1 font-bold text-slate-900">Housing Lease Declaration</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Secure residential rental lease and obtain online confirmation from the Housing Authority of Malta.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 3</div>
            <h4 className="mt-1 font-bold text-slate-900">Bank Solvency &amp; Insurance</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Show EUR 8,000–9,000 living funds in bank account and purchase 1-year Schengen student medical insurance.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 4</div>
            <h4 className="mt-1 font-bold text-slate-900">Visa Lodgement &amp; Biometrics</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Submit original dossier and biometrics at VFS Global, followed by Central Visa Unit (CVU) security review.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 5</div>
            <h4 className="mt-1 font-bold text-slate-900">Type-D Visa Sticker</h4>
            <p className="mt-1 text-xs text-ink-soft">
              CVU issues approval and passport is stamped with National Type-D entry visa valid for 90 to 180 days.
            </p>
          </div>
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-4">
            <div className="text-xs font-bold text-petrol-800">STEP 6</div>
            <h4 className="mt-1 font-bold text-slate-900">e-Residence Card Collection</h4>
            <p className="mt-1 text-xs text-ink-soft">
              Arrive in Malta, register at Identità Expatriates Unit in Msida, and receive your plastic biometric e-Residence Card.
            </p>
          </div>
        </div>
      </Section>

      {/* 9. Work Rights & Post-Study Career Pathways */}
      <Section
        id="work-rights"
        tone="white"
        title="Jobsplus student work licences &amp; 9-month job search permit."
        intro="Malta offers structured part-time working rights during your studies and an extended job-seeking residence permit for higher education graduates."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Clock className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">20 Hours / Week (After 90 Days)</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Following your first 90 days of study in Malta, you and your employer can apply to Jobsplus for an Employment Licence. You may work up to 20 hours per week during term time and full-time during holidays, earning EUR 6.50 to EUR 9.00/hour in hospitality, customer care, and retail.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Compass className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">9-Month Post-Study Job Seeker Permit</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Graduates completing an accredited Bachelor’s (MQF Level 6) or Master’s (MQF Level 7) degree can apply to Identità Malta for an extended 9-month residence permit to seek graduate employment or register an innovative enterprise in Malta.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Plane className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Single Permit &amp; Key Employee Route</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Securing a full-time employment contract matching your degree allows you to transition into a Maltese Single Work Permit. High-skilled IT, iGaming, and engineering professionals earning EUR 30,000+/year can fast-track via the Key Employee Initiative (KEI) processed within 5 working days.
            </p>
          </div>
        </div>
      </Section>

      {/* 10. Intake Calendar */}
      <Section
        id="intakes"
        tone="sage"
        title="Intake calendar: October main intake vs. February &amp; May intakes."
        intro="Unlike single-intake countries, Maltese higher education institutions offer flexible entry cycles throughout the calendar year."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-700/20 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[18px] text-emerald-900">October Intake (Autumn Main Intake)</span>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">Flagship</span>
            </div>
            <p className="mt-2 text-[14px] text-ink-soft">
              Main intake across University of Malta, MCAST, and ITS across 100% of Bachelor’s and Master’s degrees.
            </p>
            <dl className="mt-4 space-y-2.5 text-[13.5px] border-t border-petrol-800/10 pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Application Deadline:</dt>
                <dd className="font-semibold text-petrol-800">May 31 – July 15</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Housing Contract Registration:</dt>
                <dd className="font-semibold text-petrol-800">June – July</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Type-D Visa Lodgement:</dt>
                <dd className="font-semibold text-petrol-800">July – August</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Lectures Commence:</dt>
                <dd className="font-semibold text-petrol-800">Early October</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[18px] text-petrol-800">February &amp; May Intakes (Spring / Summer)</span>
              <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-700">Flexible Entry</span>
            </div>
            <p className="mt-2 text-[14px] text-ink-soft">
              Widely available across Business, Hospitality, and Computing Master’s and Undergraduate Higher Diplomas.
            </p>
            <dl className="mt-4 space-y-2.5 text-[13.5px] border-t border-petrol-800/10 pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Application Deadline (Feb Intake):</dt>
                <dd className="font-semibold text-petrol-800">November 15 – December 15</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Visa Processing Window:</dt>
                <dd className="font-semibold text-petrol-800">December – January</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">May Intake Application Window:</dt>
                <dd className="font-semibold text-petrol-800">January 15 – March 15</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Semester Begins:</dt>
                <dd className="font-semibold text-petrol-800">Mid February / Early May</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* 11. 3-Way Comparison: Malta vs. Hungary vs. UK */}
      <Section
        id="comparison"
        tone="white"
        title="Compare destinations: Malta vs. Hungary vs. UK."
        intro="Compare your options objectively before committing funds. Review language of instruction, tuition, living costs, and working regulations across our European destinations."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-petrol-800/10 bg-petrol-800/5 text-petrol-800">
              <tr>
                <th className="px-5 py-4 font-bold">Comparison Metric</th>
                <th className="px-5 py-4 font-bold text-emerald-800">Malta 🇲🇹 (English EU)</th>
                <th className="px-5 py-4 font-bold">Hungary 🇭🇺 (Central EU)</th>
                <th className="px-5 py-4 font-bold">United Kingdom 🇬🇧</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Language Environment</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">English official national language (100% spoken)</td>
                <td className="px-5 py-3.5">English on campus; Hungarian in public life</td>
                <td className="px-5 py-3.5">English native national language</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Average Annual Tuition</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">EUR 6,000 – 12,000 (~BDT 7.8L – 15.6L)</td>
                <td className="px-5 py-3.5">EUR 3,000 – 8,000 (~BDT 3.9L – 10.4L)</td>
                <td className="px-5 py-3.5">£13,000 – 26,000 (~BDT 20.8L – 41.6L)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Monthly Living Cost</td>
                <td className="px-5 py-3.5">EUR 700 – 1,000 (~BDT 91k – 130k)</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">EUR 450 – 700 (~BDT 58k – 91k)</td>
                <td className="px-5 py-3.5">£1,136 – £1,483 (~BDT 1.8L – 2.4L)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Part-Time Work Permission</td>
                <td className="px-5 py-3.5">20 hrs/wk (Jobsplus licence after 90 days)</td>
                <td className="px-5 py-3.5">24 hours / week during term</td>
                <td className="px-5 py-3.5">20 hours / week during term</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Post-Study Work Authorization</td>
                <td className="px-5 py-3.5">9-Month Job Search Residence Permit</td>
                <td className="px-5 py-3.5">9-Month Study-to-Work Permit</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">2-Year Graduate Route Visa</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-semibold text-petrol-800">Regional Travel Mobility</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">Visa-free travel across 29 Schengen states</td>
                <td className="px-5 py-3.5 font-bold text-emerald-800">Visa-free travel across 29 Schengen states</td>
                <td className="px-5 py-3.5">UK domestic only (Schengen requires separate visa)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 12. FAQ Section */}
      <Section id="faqs" tone="sage" title="Frequently asked questions about studying in Malta.">
        <FaqBlock items={MALTA_FAQS} />
      </Section>

      {/* 13. Official Sources & Review Ownership */}
      <Section id="sources" tone="white" title="Statutory sources &amp; editorial review ownership.">
        <div className="grid gap-4 sm:grid-cols-2">
          {MALTA_OFFICIAL_AUTHORITIES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content reviewed against official Identità Malta Expatriates Unit Student Guidelines, MFHEA accreditation registers, and Jobsplus student employment regulations. Last verified on 26 November 2026. Next scheduled review: 26 February 2027.
          </p>
        </div>
      </Section>

      {/* 14. CTA Band & Education Fit Assessment */}
      <Section id="assessment" tone="sage" title="Assess your Malta admission &amp; student visa readiness.">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="Ready to evaluate your Maltese university options?"
        text="Book an in-person session at our Dhanmondi office or schedule a video consultation. We audit your academic profile, verify university MFHEA accreditation, and structure your Identità-compliant financial dossier."
        assessmentHref={applyHref}
        assessmentLabel="Start Application Assessment"
      />
    </article>
  );
}
