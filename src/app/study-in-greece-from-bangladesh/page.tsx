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
const PATH = '/study-in-greece-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=Greece';
export const revalidate = 3600;

const GREECE_OFFICIAL_AUTHORITIES = [
  {
    label: 'Hellenic Authority for Higher Education (HAHE / ETHAAE)',
    href: 'https://www.ethaae.gr/en/',
    note: 'Independent statutory quality assurance and accreditation agency for Greek higher education institutions; full member of ENQA and registered in EQAR.',
  },
  {
    label: 'Study in Greece — Official National Portal',
    href: 'https://studyingreece.edu.gr/',
    note: 'The official agency supported by the Hellenic Ministry of Foreign Affairs and Ministry of Education for international students, degree verification, and living guidance.',
  },
  {
    label: 'Ministry of Education, Religious Affairs and Sports (Greece)',
    href: 'https://minedu.gov.gr/',
    note: 'Central governmental authority overseeing university charters, academic recognition standards, and national enrollment regulations.',
  },
  {
    label: 'Ministry of Migration and Asylum (Greece)',
    href: 'https://migration.gov.gr/en/',
    note: 'Governs immigration regulations, National Type D Study Visa entry criteria, and biometric Student Residence Permit (e-Permit) issuance.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in Greece from Bangladesh: Costs, Visa & Universities | EduExpress',
    description:
      'Evidence-first guide to studying in Greece from Bangladesh: HAHE-accredited public universities, English-taught Business, Maritime & Engineering MSc, tuition (€1,000–€7,600), Type D Visa, and living costs.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('greece', 'Study in Greece from Bangladesh — EduExpress International'),
  });
}

const GREECE_FAQS = [
  {
    question: 'Are English-taught degree programs available in Greece for Bangladeshi students?',
    answer:
      'Yes. Greece has expanded English-medium higher education significantly through public university consortia and accredited departments. Prominent offerings include specialized English Bachelor programs (such as NKUA’s BA in Archaeology & History and 6-Year English MD Medicine), prestigious English-taught Master’s degrees in Shipping, Finance, Logistics, and Data Science at Athens University of Economics and Business (AUEB), and cutting-edge engineering MSc programs at National Technical University of Athens (NTUA). All public programs carry official accreditation from the Hellenic Authority for Higher Education (HAHE).',
  },
  {
    question: 'How much does it cost to study in Greece for non-EU students?',
    answer:
      'Greece is one of the most budget-friendly study destinations within the European Union. Tuition for English-taught Master’s programs at top public universities ranges from as low as €1,000 to €3,500 per year at NTUA and €7,000 to €7,600 for specialized shipping and business tracks at AUEB. International Bachelor’s programs generally cost between €3,500 and €6,000 per year (with English MD medicine at €12,000–€17,000/year). Monthly living costs in Athens or Thessaloniki range from €500 to €850 (approximately 65,000 to 110,000 BDT), including student housing, groceries, and transit.',
  },
  {
    question: 'What is the visa process for Bangladeshi students traveling to Greece?',
    answer:
      'Bangladeshi students must obtain a National Long-Stay Type D Student Visa before departing. The application is submitted to the Embassy of Greece (or designated VFS Global visa center). Mandatory requirements include an unconditional university acceptance letter, tuition payment receipt, valid passport, attested police clearance certificate, approved medical fitness clearance, international health insurance, and demonstrated financial solvency (typically proving at least €400 to €500 per month for the first year). Once in Greece, students apply online for a biometric Student Residence Permit within 90 days.',
  },
  {
    question: 'Can international students work part-time in Greece?',
    answer:
      'Yes. Under Greek immigration law, international students holding a valid Greek Student Residence Permit have the statutory right to work part-time up to 20 hours per week during academic semesters, and full-time (up to 40 hours per week) during scheduled university vacations. However, local jobs in customer-facing sectors usually require proficiency in the Greek language. English-only work is concentrated in international tourism, hospitality management internships, maritime shipping logistics, and remote tech or freelance roles.',
  },
  {
    question: 'Does studying in Greece grant Schengen mobility and residence rights?',
    answer:
      'Yes. Greece is a full member state of the European Union and the Schengen Area. The Greek Student Residence Permit functions as a Schengen biometric residence document, allowing visa-free travel across all 29 Schengen member states for up to 90 days in any 180-day period. However, the student permit is granted solely for the duration of the approved academic program; post-study long-term settlement requires transitioning to an EU Blue Card or a sponsored Greek employment residence permit.',
  },
];

export default async function StudyInGreecePage() {
  const greeceUnis = await prisma.university.findMany({
    where: {
      country: { in: ['Greece', 'greece'] },
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
        name: 'Study in Greece from Bangladesh: Costs, Visa & Universities (2027 Benchmark)',
        description:
          'Official 2026/27 guide: HAHE-accredited public universities, English-taught Business, Maritime & Engineering MSc, tuition (€1,000–€7,600), Type D Visa, and living costs in Athens & Thessaloniki.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/greece.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(GREECE_OFFICIAL_AUTHORITIES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#universities`,
        name: 'Verified Universities in Greece for Bangladeshi Students',
        numberOfItems: greeceUnis.length,
        itemListElement: greeceUnis.map((u, i) => ({
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
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: 'Greece' }]}
        eyebrow="Active Destination · European Union &amp; Schengen Member · HAHE-Accredited Public Universities"
        title="Study in Greece from Bangladesh: Costs, Visa & Universities."
        lead="Greece combines ancient academic heritage with modern, HAHE-accredited European degrees in Athens and Thessaloniki. With affordable public university Master’s tuition (€1,000–€7,600/total), world-renowned Maritime &amp; Shipping disciplines, and full Schengen residency, Greece delivers high European academic value for disciplined Bangladeshi scholars."
        reviewed="November 2026"
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Greece Eligibility Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#universities" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              View 4 Verified Institutions
            </a>
          </>
        }
      />

      <TrustBar />

      {/* 3. Who This Country Fits — And Who Should Reconsider */}
      <Section
        id="who-fits"
        tone="white"
        title="Who Greece fits — and who should reconsider."
        intro="Greece is an outstanding European option for students seeking low-cost public graduate education, maritime specialization, and Schengen mobility. Read our transparent counseling criteria."
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
                <span><strong>Targeting World-Class Shipping, Maritime &amp; Logistics:</strong> Greece commands the world’s largest merchant marine fleet. Institutions like AUEB offer premier English-taught Master’s in International Shipping, Maritime Economics, and Supply Chain with direct corporate links.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Seeking Low-Cost Public University Master’s in the EU:</strong> Prestigious public polytechnics like NTUA offer interdisciplinary engineering and applied mathematics Master’s degrees starting from just €1,000/year (€500/semester).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Desiring Full EU Schengen Residency &amp; Travel Rights:</strong> A Greek Student Residence Permit grants visa-free travel across all 29 Schengen member states and access to Erasmus+ mobility semesters.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Looking for Affordable Mediterranean Living:</strong> Monthly living expenses in Athens and Thessaloniki (€500–€850/month) are substantially lower than in Western Europe, the UK, or the Nordics.</span>
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
                <span><strong>Seeking Full-Ride Government Scholarships:</strong> While Greek public universities maintain modest tuition fees, full government scholarships (State Scholarships Foundation - IKY) are highly competitive and primarily designated for research scholars.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Relying on Part-Time Jobs to Pay Tuition:</strong> While 20 hours/week part-time work is legally permitted, the domestic labor market in Greece requires Greek fluency. Non-Greek speakers cannot depend on local wages to pay university tuition.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Undergraduate Applicants Seeking 100% English Programs in General Engineering:</strong> At public institutions like NTUA, undergraduate degrees are taught in Greek; English-taught offerings at NTUA are concentrated at the Master’s and PhD levels.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">✕</span>
                <span><strong>Expecting Automatic Post-Study Work Settlement:</strong> Greece does not offer an unconditional post-study job search visa. Graduates must secure employment with a registered Greek company that sponsors a work permit.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Critical Statutory Guardrail */}
        <div className="mt-8 rounded-2xl border-2 border-petrol-800 bg-petrol-900 p-6 text-white shadow-md">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-xl bg-petrol-800 p-2.5 text-emerald-400">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Statutory Guardrail: HAHE Quality Assurance &amp; Embassy Visa Legalisation
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-sand-200">
                All degrees recommended by EduExpress in Greece are recognized under the Hellenic Authority for Higher Education (HAHE) and accredited under European Standards and Guidelines (ESG). Under Greek immigration protocol, Bangladeshi applicants must legalise all academic transcripts, police clearance, and medical fitness documents via the Ministry of Foreign Affairs (MOFA) in Dhaka and the Embassy of Greece. Tuition deposits must be remitted exclusively through Authorized Dealer bank Student Files to official university bank accounts.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Education System & Recognition */}
      <Section
        id="education-system"
        tone="sage"
        title="Bologna ECTS framework &amp; HAHE accreditation standards."
        intro="Greek higher education operates within the European Higher Education Area (EHEA), ensuring full international transferability and qualification recognition."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Award className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">HAHE Accreditation (ETHAAE)</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Every public university program is periodically audited and certified by the Hellenic Authority for Higher Education (HAHE), a full member of ENQA. Degrees are recognized across the EU, UK, and North America.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <BookOpen className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">European ECTS Credit System</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Degrees follow standard Bologna ECTS architectures: 240 ECTS for 4-year Bachelor’s (or 300 ECTS for 5-year integrated Engineering Diplomas), 90–120 ECTS for Master’s, and 360 ECTS for 6-year Medical Doctor programs.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <Anchor className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Global Sector Leadership</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Greek public universities lead global rankings in Maritime Economics, Commercial Shipping, Classical Archaeology, Seismic Engineering, and Renewable Mediterranean Energy systems.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Verified Institutions in Greece */}
      <Section
        id="universities"
        tone="white"
        title="4 verified public universities in Greece."
        intro="EduExpress International connects Bangladeshi students with top-tier, HAHE-accredited state universities in Athens and Thessaloniki offering verified English-taught degree tracks."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {greeceUnis.map((uni) => (
            <div
              key={uni.id}
              className="flex flex-col justify-between rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs hover:border-petrol-800/35 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-600/20">
                      HAHE Accredited · European Union
                    </span>
                    <h3 className="mt-2 font-display text-[20px] font-bold text-petrol-800">
                      <Link href={`/universities/${uni.slug}`} className="hover:underline">
                        {uni.name}
                      </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-soft">
                      <MapPin size={13} className="text-petrol-800" /> {uni.city || 'Athens'}, Greece
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-sand-50/70 p-3 text-[13px]">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">Tuition Range</span>
                    <p className="font-bold text-petrol-800">{uni.tuition || '€1,000 – €7,600 / yr'}</p>
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
                      {uni.fees[0].item}: {uni.fees[0].cost} ({uni.fees[0].recipient}). Non-refundable statutory fee.
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
        intro="Academic credentials, language proficiency standards, and legalization guidelines for Greek university admissions."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <School className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Undergraduate Admission</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>Academic:</strong> HSC in Science, Commerce, or Humanities with minimum GPA 3.00/5.00, or GCE A-Levels (minimum 2 subjects).</li>
              <li>• <strong>Recognition:</strong> Certificate of equivalence or General Access Grade calculation via Greek Ministry of Education.</li>
              <li>• <strong>Medicine Track:</strong> 6-Year English MD requires high grades in Biology/Chemistry and online entrance exam/interview.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <GraduationCap className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Master’s &amp; Postgraduate</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>Bachelor’s Degree:</strong> 4-year accredited Bachelor’s degree from a UGC-recognized university in Bangladesh (min CGPA 2.75/4.00).</li>
              <li>• <strong>Relevant Background:</strong> Business/Economics/Engineering background required for AUEB shipping and NTUA engineering tracks.</li>
              <li>• <strong>Supporting Dossier:</strong> 2 Academic Recommendation Letters, Statement of Purpose (SOP), and updated CV.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <FileText className="size-7 text-petrol-800" />
            <h3 className="mt-4 font-display text-[18px] font-bold text-petrol-800">Language &amp; Attestation</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
              <li>• <strong>English Proficiency:</strong> IELTS 6.0–6.5, TOEFL iBT 80+, or Medium of Instruction (MOI) certificate for select postgraduate tracks.</li>
              <li>• <strong>Ministry Attestation:</strong> Board/University transcripts attested by Education Ministry and Ministry of Foreign Affairs (MOFA) Dhaka.</li>
              <li>• <strong>Greek Embassy Legalisation:</strong> Attested documents must be submitted to the Embassy of Greece for consular authentication.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7. Total Cost & Funding Reality */}
      <Section
        id="costs"
        tone="white"
        title="Complete annual cost structure (Tuition + Living)."
        intro="Itemized annual expenditure estimates in Euros (€) and Bangladeshi Taka (BDT) based on current Athens and Thessaloniki budgets."
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
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Public Engineering MSc Tuition (NTUA)</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-800">€1,000 – €2,500 / year</td>
                  <td className="px-5 py-3.5 font-semibold text-petrol-800">1.30 – 3.25 Lakh BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Subsidized public polytechnic rate paid per semester</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Shipping &amp; Business MSc Tuition (AUEB)</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-800">€3,500 – €7,600 / total</td>
                  <td className="px-5 py-3.5 font-semibold text-petrol-800">4.55 – 9.88 Lakh BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Standard international postgraduate program fee</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">English Medical Degree Tuition (NKUA/AUTH)</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-800">€12,000 – €17,000 / year</td>
                  <td className="px-5 py-3.5 font-semibold text-petrol-800">15.60 – 22.10 Lakh BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">Specialized 6-year English MD for international students</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Student Housing (Shared Flat / Private Room)</td>
                  <td className="px-5 py-3.5">€250 – €450 / month</td>
                  <td className="px-5 py-3.5">32,500 – 58,500 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Furnished apartment near Athens or Thessaloniki metro</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Food, Groceries &amp; Daily Living</td>
                  <td className="px-5 py-3.5">€180 – €280 / month</td>
                  <td className="px-5 py-3.5">23,400 – 36,400 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Local Mediterranean markets, groceries, student meals</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Public Transit, Utilities &amp; Internet</td>
                  <td className="px-5 py-3.5">€60 – €100 / month</td>
                  <td className="px-5 py-3.5">7,800 – 13,000 BDT / mo</td>
                  <td className="px-5 py-3.5 text-ink-soft">Discounted student transit card (€15/mo) + utilities</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Type D Visa &amp; Student Residence Permit (e-Permit)</td>
                  <td className="px-5 py-3.5">€240 (Year 1)</td>
                  <td className="px-5 py-3.5">31,200 BDT</td>
                  <td className="px-5 py-3.5 text-ink-soft">€90 National Visa fee + €150 biometric residence permit</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-petrol-800">Mandatory Student Health Insurance</td>
                  <td className="px-5 py-3.5">€150 – €280 / year</td>
                  <td className="px-5 py-3.5">19,500 – 36,400 BDT / yr</td>
                  <td className="px-5 py-3.5 text-ink-soft">Annual comprehensive private medical coverage in Greece</td>
                </tr>
                <tr className="bg-sand-50/60 font-bold text-petrol-800">
                  <td className="px-5 py-4">Total Typical First-Year Budget (Master’s)</td>
                  <td className="px-5 py-4 text-emerald-800">€7,500 – €14,000</td>
                  <td className="px-5 py-4 text-petrol-800">9.75 – 18.20 Lakh BDT</td>
                  <td className="px-5 py-4 text-[13px] font-normal text-ink-soft">Includes Master tuition + 12 months comprehensive living</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 bg-sand-50/40 p-4 text-[13px] text-ink-soft">
            <p>
              <strong>Official Bangladesh Bank Remittance Protocol:</strong> All tuition payments to Greek universities must be transferred via an Authorized Dealer (AD) bank in Bangladesh through an official <strong>Student File</strong> opened under Bangladesh Bank foreign exchange guidelines. Funds wire directly to the university’s verified IBAN account in Greece. EduExpress does not handle tuition fees in cash or personal accounts.
            </p>
          </div>
        </div>
      </Section>

      {/* 8. Visa & Type D Study Roadmap */}
      <Section
        id="visa-process"
        tone="sage"
        title="Greece National Type D Study Visa &amp; Residence Permit roadmap."
        intro="Step-by-step consular and immigration roadmap from university offer to Greek biometric residence."
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              01
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Admission &amp; Fee Wire</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Secure unconditional acceptance letter from a HAHE-accredited university. Wire initial tuition or deposit via Authorized Dealer bank Student File to obtain the official paid receipt.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              02
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Document Attestation &amp; Police Clearance</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Attest academic certificates and transcripts at the Education Board/University and MOFA Dhaka. Obtain a clean Police Clearance Certificate and authorized medical fitness certificate.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              03
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Type D Visa Application</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Submit your National Long-Stay (Type D) Study Visa application at the Embassy of Greece / VFS center with proof of financial means (~€400–€500/month for Year 1) and health insurance.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              04
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Arrival &amp; Biometric Residence (e-Permit)</h4>
            <p className="mt-2 text-[13px] leading-5 text-ink-soft">
              Enter Greece on your Type D visa. Within 90 days, apply online through the Ministry of Migration portal, provide biometrics at the local Aliens and Immigration Directorate, and receive your biometric card.
            </p>
          </div>
        </div>
      </Section>

      {/* 9. Work Rights & Post-Study Career Realities */}
      <Section
        id="work-rights"
        tone="white"
        title="Part-time employment rights &amp; realistic career progression."
        intro="Evidence-based analysis of working in Greece during your studies and professional opportunities across the EU."
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
                <span><strong>Statutory Work Rights:</strong> Holders of a valid Greek Student Residence Permit are legally entitled to work part-time up to 20 hours per week during academic semesters, and full-time (up to 40 hours per week) during vacations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Language Imperative:</strong> The local Greek retail and hospitality sectors communicate in Greek. Students who do not learn basic conversational Greek will find casual customer-facing work challenging to obtain.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>English-Medium Employment:</strong> English opportunities exist primarily in luxury tourism resorts (seasonal summer internships in the Greek islands), maritime shipping agencies in Piraeus, and international tech startups in Athens.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Budget Planning:</strong> Families must ensure living expenses for at least the first 6 to 12 months are fully pre-funded. Do not count on part-time wages to pay university tuition.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-petrol-800 text-[18px]">
              <Briefcase className="size-6 text-petrol-800" />
              <span>Career Pathways &amp; Post-Graduation Realities</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Global Maritime &amp; Shipping Hub:</strong> Athens and the port city of Piraeus host one of the world’s most dense maritime clusters. AUEB graduates in shipping economics and logistics are highly sought after by global shipping firms.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>EU Blue Card Transition:</strong> Graduates who secure a professional employment contract in Greece meeting statutory salary thresholds can convert their student residence into an EU Blue Card or national employment residence permit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>European Academic Mobility:</strong> An ECTS-accredited degree from NKUA, NTUA, or AUTH provides seamless entry into PhD programs and research institutes across Germany, the Netherlands, France, and Scandinavia.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>No Automatic PR Guarantee:</strong> EduExpress strictly rejects unverified claims of "guaranteed European permanent residence." Post-study legal stay requires legitimate corporate employment.</span>
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
        intro="Understand the academic cycle in Greece to ensure sufficient lead time for document attestation and embassy visa processing."
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
              The main intake for 100% of undergraduate programs, English-taught Master’s degrees, and medical faculties across Greece.
            </p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[13px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-ink-soft">Application Window:</span>
                <span className="font-bold text-petrol-800">March – June</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Admission &amp; Fee Wire:</span>
                <span className="font-bold text-petrol-800">May – July</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Type D Visa Submission:</span>
                <span className="font-bold text-petrol-800">July – August</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Arrival in Greece:</span>
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
              Targeted intake available for selected postgraduate programs and university language preparation cohorts.
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
                <span className="text-ink-soft">Arrival in Greece:</span>
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
        title="Comparing Greece with Malta and Malaysia."
        intro="How studying in Greece compares with other popular English-medium destinations for Bangladeshi students."
      >
        <div className="overflow-hidden rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-sand-50/80 text-petrol-800 font-bold border-b border-petrol-800/10">
              <tr>
                <th className="px-5 py-4">Key Criteria</th>
                <th className="px-5 py-4 bg-emerald-50/60 text-emerald-950 font-bold">Greece (Athens/Thessaloniki)</th>
                <th className="px-5 py-4">Malta (EU / Schengen)</th>
                <th className="px-5 py-4">Malaysia (Asia Hub)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">EU / Schengen Status</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">Full EU &amp; Schengen member</td>
                <td className="px-5 py-3.5">Full EU &amp; Schengen member</td>
                <td className="px-5 py-3.5">Non-EU (Asian Regional Hub)</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Average Master’s Tuition</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">€1,000 – €7,600 / total</td>
                <td className="px-5 py-3.5">€6,000 – €11,000 / year</td>
                <td className="px-5 py-3.5">€3,500 – €6,500 / year</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Monthly Living Cost</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">€500 – €850 / month</td>
                <td className="px-5 py-3.5">€650 – €950 / month</td>
                <td className="px-5 py-3.5">€350 – €550 / month</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Instruction Language</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">English for select programs / Greek for general UG</td>
                <td className="px-5 py-3.5">100% English (Official co-language)</td>
                <td className="px-5 py-3.5">100% English medium</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Key Domain Strengths</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 font-semibold text-emerald-900">Maritime Shipping, Classics, Polytechnic Engineering</td>
                <td className="px-5 py-3.5">Fintech, iGaming, Hospitality Management</td>
                <td className="px-5 py-3.5">Computer Science, Business, UK Branch Transfers</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-petrol-800">Statutory Accreditation</td>
                <td className="px-5 py-3.5 bg-emerald-50/30 text-ink-soft">HAHE (Hellenic Authority for Higher Education)</td>
                <td className="px-5 py-3.5">MFHEA (Malta Further &amp; Higher Education)</td>
                <td className="px-5 py-3.5">MQA (Malaysian Qualifications Agency)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 12. FAQ Section */}
      <Section id="faqs" tone="sage" title="Frequently asked questions about studying in Greece.">
        <FaqBlock items={GREECE_FAQS} />
      </Section>

      {/* 13. Official Sources & Review Ownership */}
      <Section id="sources" tone="white" title="Statutory sources &amp; editorial review ownership.">
        <div className="grid gap-4 sm:grid-cols-2">
          {GREECE_OFFICIAL_AUTHORITIES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content audited against the Hellenic Authority for Higher Education (HAHE) registry, official Study in Greece portals, and Ministry of Migration and Asylum consular regulations. Last verified on 27 November 2026. Next scheduled review: 27 February 2027.
          </p>
        </div>
      </Section>

      {/* 14. CTA Band & Education Fit Assessment */}
      <Section id="assessment" tone="sage" title="Assess your Greece admission &amp; visa readiness.">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="Ready to evaluate your Greece university options?"
        text="Book an in-person session at our Dhanmondi office or schedule a video consultation. We audit your academic transcripts, check English program eligibility, and guide your Greek Type D visa roadmap."
        assessmentHref={applyHref}
        assessmentLabel="Start Application Assessment"
      />
    </article>
  );
}
