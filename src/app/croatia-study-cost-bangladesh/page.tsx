import Link from 'next/link';
import {
  AlertTriangle,
  Anchor,
  ArrowRight,
  Banknote,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Bus,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  ExternalLink,
  FileCheck,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Info,
  Landmark,
  MapPin,
  Plane,
  Receipt,
  Scale,
  School,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Stethoscope,
  Utensils,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/croatia-study-cost-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const CROATIA_COST_SOURCES = [
  {
    label: 'Agency for Science and Higher Education (ASHE / AZVO Croatia)',
    href: 'https://www.azvo.hr/en/',
    note: 'Statutory national accreditation agency for Croatian higher education; full member of ENQA and registered on EQAR verifying European Qualifications Framework (EQF) degree compliance.',
  },
  {
    label: 'Study in Croatia — Official National Higher Education Portal',
    href: 'https://www.studyincroatia.hr/',
    note: 'Official portal managed by ASHE under the Ministry of Science, Education and Youth providing verified tuition data and admissions standards for English-taught degrees.',
  },
  {
    label: 'Ministry of the Interior (MUP Croatia — Odjel za strance)',
    href: 'https://mup.gov.hr/',
    note: 'Statutory government ministry administering National Long-Stay (Type D) Study Visa financial solvency criteria (€400–€550/month) and biometric Temporary Stay Permit (privremeni boravak) issuance.',
  },
  {
    label: 'Ministry of Science, Education and Youth (MZO Croatia)',
    href: 'https://mzo.gov.hr/',
    note: 'Central state ministry governing public university tuition frameworks, student social welfare subsidies (X-ica Mensa dining), and Bologna ECTS charters.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File Guidelines)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations governing legal SWIFT wire remittances (Form TM) to Croatian university IBAN accounts and international Education Card quotas.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cost of Studying in Croatia from Bangladesh 2027 | EduExpress',
    description:
      'Croatia study cost breakdown for Bangladeshi students: English MD (€12,000/yr) & STEM tuition, Type D visa bank solvency, and living expenses in Zagreb.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('croatia', 'Cost of Studying in Croatia from Bangladesh — EduExpress International'),
  });
}

const faqs = [
  {
    question: 'How much does it cost to study in Croatia in Bangladeshi Taka (BDT)?',
    answer:
      'Tuition in Croatia is billed in Euros (EUR) and represents outstanding value within the European Union and Schengen Area. English-taught Bachelor and Master degrees in Business Economics, Computer Science, and Engineering at public universities (Zagreb, Split, Rijeka) range from €3,500 to €5,500 per year (approximately 4.6 lakh to 7.3 lakh BDT at 1 EUR ≈ 132 BDT). Premier 6-Year Integrated Medical Doctor (MD / MBBS equivalent) programs cost a uniform €12,000 per year (~15.8 lakh BDT). Monthly living costs in Zagreb or Split average €450 to €750 (approx. 59,000 to 99,000 BDT), resulting in a typical first-year non-medical budget of 12.0 lakh to 17.5 lakh BDT (tuition + 12 months comprehensive living).',
  },
  {
    question: 'What is the National Type D Visa bank solvency requirement for Croatia?',
    answer:
      'The Ministry of the Interior of the Republic of Croatia (MUP) requires non-EU international students to demonstrate verified financial solvency covering at least €400 to €550 per month for maintenance during their first year of study (€4,800 to €6,600 minimum, approx. 6.3 lakh to 8.7 lakh BDT). EduExpress strongly recommends maintaining 8.0 lakh to 10.0 lakh BDT in a recognized Bangladeshi bank account for at least 3 to 6 months prior to application. Funds must be documented by an official bank solvency certificate, 6-month transaction statements, and a notarized Affidavit of Financial Support from the student’s legal parent sponsor.',
  },
  {
    question: 'Can Bangladeshi students travel across the Schengen Area on a Croatian study permit?',
    answer:
      'Yes. Croatia officially joined the Schengen Area on January 1, 2023. International students holding a valid Croatian biometric Temporary Stay Permit card (privremeni boravak u svrhu studiranja) enjoy full European Schengen mobility, permitting visa-free travel throughout all 29 Schengen member states (such as Germany, France, Italy, Austria, and Switzerland) for up to 90 days within any 180-day rolling period for tourism, academic conferences, and university exchanges.',
  },
  {
    question: 'How do Bangladeshi families legally wire tuition fees to Croatian universities?',
    answer:
      'Under Bangladesh Bank Foreign Exchange Guidelines, tuition fees to European universities must be remitted legally through an Authorized Dealer (AD) scheduled commercial bank by opening an official Student File. Using the university unconditional acceptance certificate, fee invoice, and attested educational documents, parents execute a SWIFT telegraphic transfer (Form TM) directly to the university’s verified IBAN account in Croatia. The bank also provides an international Education Card with an annual allowance of up to USD 12,000 equivalent for accommodation and living expenses in Zagreb or Split.',
  },
  {
    question: 'Are international students legally permitted to work part-time in Croatia?',
    answer:
      'Yes. Full-time international students in Croatia can work legally through the university Student Centre (Studentski centar) under a formal Student Contract (Studentski ugovor). The Croatian government mandates a statutory minimum hourly student wage (minimalna studentska satnica of approx. €5.25 to €5.60/hour, or ~690 to 740 BDT/hour). Students typically earn €420 to €650 per month in tourism, hospitality, digital marketing, and IT support during semester terms, with higher earnings available during summer vacation.',
  },
  {
    question: 'What is EduExpress’s service fee guarantee for Croatian admissions and visas?',
    answer:
      'EduExpress enforces an evidence-first, zero-risk fee guarantee for all European destinations: BDT 0 upfront file-opening fee, and an EduExpress service fee of BDT 100,000 (1 Lakh Taka) payable 100% strictly after your Croatian National Type D Study Visa is approved. Students pay all statutory third-party charges (consular visa fees, health insurance, certified translations, and university tuition) directly to the respective authorities and universities.',
  },
];

export default async function CroatiaStudyCostPage() {
  const croatiaUnis = await prisma.university.findMany({
    where: {
      country: { in: ['Croatia', 'croatia'] },
      isActive: true,
    },
    include: {
      programs: { where: { status: 'active' }, take: 4 },
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
        name: 'Cost of Studying in Croatia from Bangladesh 2027 | Tuition, Visa & Living Breakdown',
        description:
          'Evidence-first cost analysis for Bangladeshi students: English MD tuition (€12,000/yr), Business & STEM fees (€3,500–€5,500/yr), Type D visa solvency, Zagreb vs Split living budgets, and Schengen mobility.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/croatia.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(CROATIA_COST_SOURCES),
      },
    ],
  };

  return (
    <article lang="en" className="bg-canvas text-ink">
      <JsonLd data={schema} />

      {/* Hero */}
      <PageHero
        path={PATH}
        trail={[
          { name: 'Destinations', path: '/destinations' },
          { name: 'Croatia', path: '/study-in-croatia-from-bangladesh' },
          { name: 'Cost Guide' },
        ]}
        eyebrow="Evidence-First Tuition & Living Analysis · Planning Assumption: 1 EUR ≈ 132 BDT · Schengen Member State"
        title="Cost of Studying in Croatia from Bangladesh (2027 Guide)"
        lead="Comprehensive financial breakdown for European higher education in Croatia: ASHE-accredited public university tuition (€3,500–€5,500/yr for Business/STEM; €12,000/yr for 6-Year English MD), National Type D Visa bank solvency, subsidized student dining (X-ica Mensa), Zagreb vs Split living budgets, and Schengen Area mobility."
        reviewed="November 27, 2026"
        actions={
          <>
            <Link href="/apply?country=Croatia" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Croatia Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/study-in-croatia-from-bangladesh"
              className="ed-btn ed-btn-outline min-h-[52px] px-6"
            >
              Explore Croatia Country Pillar
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* Module 1: Quick Facts & Planning Assumption */}
      <Section
        id="quick-facts"
        tone="white"
        title="Croatia Study Cost at a Glance (2027 Planning Assumption)"
        intro="Planning Assumption: All currency conversions utilize 1 EUR ≈ 132 BDT. Croatia adopted the Euro (EUR) on January 1, 2023, and all tuition and living expenses are priced strictly in Euros."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-petrol-100 text-petrol-900">
              <Building2 size={20} />
            </div>
            <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Business &amp; STEM Tuition
            </span>
            <p className="mt-1 font-display text-xl font-bold text-petrol-800">
              €3,500 – €5,500 <span className="text-xs font-normal text-slate-500">/ yr</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-800">
              ~4.6L – 7.3L BDT / year
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Public faculties at Zagreb, Split &amp; Rijeka in International Business, Informatics, and Engineering.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Stethoscope size={20} />
            </div>
            <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              English MD (Medicine)
            </span>
            <p className="mt-1 font-display text-xl font-bold text-petrol-800">
              €12,000 <span className="text-xs font-normal text-slate-500">/ yr</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-800">
              ~15.8L BDT / year
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Uniform national public tuition for 6-Year Integrated MD (360/366 ECTS) listed in WDOMS.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <Home size={20} />
            </div>
            <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Monthly Living Budget
            </span>
            <p className="mt-1 font-display text-xl font-bold text-petrol-800">
              €450 – €750 <span className="text-xs font-normal text-slate-500">/ mo</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-900">
              ~59,400 – 99,000 BDT / mo
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Rent (€200–€400), food with subsidized Mensa student card (€180–€260), transit &amp; utilities.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-900">
              <Landmark size={20} />
            </div>
            <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Type D Visa Solvency
            </span>
            <p className="mt-1 font-display text-xl font-bold text-petrol-800">
              €4,800 – €6,600
            </p>
            <p className="mt-1 text-xs font-semibold text-blue-900">
              ~6.3L – 8.7L BDT in BD Bank
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Demonstrating €400–€550/mo maintenance in sponsor account for 3–6 months. Buffer of 8L–10L BDT advised.
            </p>
          </div>
        </div>

        {/* Currency & Schengen Callout */}
        <div className="mt-6 rounded-2xl border border-rule bg-canvas-soft p-5">
          <div className="flex items-start gap-3">
            <Compass className="mt-0.5 size-5 shrink-0 text-petrol-800" />
            <div className="text-xs leading-relaxed text-slate-700">
              <strong className="text-petrol-800">Official Eurozone &amp; Schengen Integration:</strong> Croatia entered both the Eurozone and Schengen Area on January 1, 2023. All educational remittances are executed in Euros (€), completely eliminating exchange volatility between EU member institutions. Holding a Croatian student residence permit enables border-free travel across 29 European Schengen nations.
            </div>
          </div>
        </div>
      </Section>

      {/* Module 2: Complete First-Year Comprehensive Budget Breakdown */}
      <Section
        id="first-year-budget"
        tone="sage"
        title="Complete First-Year Itemized Budget (Pre-Departure to Zagreb/Split Arrival)"
        intro="A transparent, line-by-line financial roadmap detailing every mandatory expense for a Bangladeshi student beginning studies in Croatia."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-rule bg-canvas-soft font-bold uppercase tracking-wider text-petrol-800">
              <tr>
                <th className="p-4">Cost Category</th>
                <th className="p-4">Item &amp; Statutory Purpose</th>
                <th className="p-4">Estimated Range in EUR (€)</th>
                <th className="p-4">Equivalent in BDT</th>
                <th className="p-4">Payable To &amp; Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {/* Pre-Departure Outlays */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 1: Pre-Departure Documentation, Attestation &amp; Consular Visa
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Academic Attestation</td>
                <td className="p-4">Education Board, Ministry of Education &amp; MOFA Dhaka attestation</td>
                <td className="p-4">€35 – €50</td>
                <td className="p-4">4,600 – 6,600 BDT</td>
                <td className="p-4 text-slate-500">Bangladesh Government challans (Direct)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Croatian Certified Translation</td>
                <td className="p-4">Court-certified Croatian translation of academic records &amp; police clearance</td>
                <td className="p-4">€120 – €180</td>
                <td className="p-4">15,800 – 23,800 BDT</td>
                <td className="p-4 text-slate-500">Certified court interpreter / Translation agency</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">National Type D Visa Fee</td>
                <td className="p-4">Embassy of Croatia consular visa processing fee</td>
                <td className="p-4">€93 (Statutory fee)</td>
                <td className="p-4">12,300 BDT</td>
                <td className="p-4 text-slate-500">Croatian Embassy New Delhi / VFS Global</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">VFS Logistics &amp; Biometrics</td>
                <td className="p-4">VFS Global application center handling and biometrics fee</td>
                <td className="p-4">€25 – €40</td>
                <td className="p-4">3,300 – 5,300 BDT</td>
                <td className="p-4 text-slate-500">VFS Global Application Centre</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Airfare (One-Way)</td>
                <td className="p-4">Dhaka to Zagreb (DAC &rarr; ZAG via Doha, Dubai, or Istanbul)</td>
                <td className="p-4">€450 – €650</td>
                <td className="p-4">59,400 – 85,800 BDT</td>
                <td className="p-4 text-slate-500">Airlines (Qatar Airways, Emirates, Turkish)</td>
              </tr>

              {/* Institutional Outlays */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 2: First-Year Academic Tuition Fees (Remitted via Student File)
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Business &amp; STEM Tuition</td>
                <td className="p-4">English Bachelor / Master at public faculties (Zagreb, Split, Rijeka)</td>
                <td className="p-4 font-bold text-petrol-800">€3,500 – €5,500 / yr</td>
                <td className="p-4 font-bold text-petrol-800">4.62 – 7.26 Lakh BDT</td>
                <td className="p-4 text-slate-500">Direct university IBAN via SWIFT Form TM</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-emerald-800">Medical Doctor (MD) Tuition</td>
                <td className="p-4">6-Year Integrated English MD (Zagreb, Split, or Rijeka Medical Faculty)</td>
                <td className="p-4 font-bold text-emerald-800">€12,000 / yr</td>
                <td className="p-4 font-bold text-emerald-800">15.84 Lakh BDT</td>
                <td className="p-4 text-slate-500">Direct university IBAN via SWIFT Form TM</td>
              </tr>

              {/* On-Arrival & Residence Outlays */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 3: Croatia On-Arrival Statutory &amp; Living Maintenance (12 Months)
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Temporary Stay Permit (MUP)</td>
                <td className="p-4">Biometric plastic residence card issued by Police Administration</td>
                <td className="p-4">€95 – €110 (Year 1)</td>
                <td className="p-4">12,500 – 14,500 BDT</td>
                <td className="p-4 text-slate-500">Ministry of the Interior (MUP Croatia)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Mandatory Health Insurance</td>
                <td className="p-4">HZZO or MUP-compliant international student health insurance policy</td>
                <td className="p-4">€600 – €850 / yr</td>
                <td className="p-4">79,200 – 112,200 BDT</td>
                <td className="p-4 text-slate-500">Croatian Health Insurance Fund (HZZO) / Approved insurer</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Accommodation (12 Months)</td>
                <td className="p-4">Shared 2-room student flat near tram lines (€200–€400/mo)</td>
                <td className="p-4">€2,400 – €4,800</td>
                <td className="p-4">3.17 – 6.34 Lakh BDT</td>
                <td className="p-4 text-slate-500">Private apartment landlord / Student residence</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Food &amp; Groceries (12 Months)</td>
                <td className="p-4">Subsidized Mensa dining card (X-ica) + groceries (€180–€260/mo)</td>
                <td className="p-4">€2,160 – €3,120</td>
                <td className="p-4">2.85 – 4.12 Lakh BDT</td>
                <td className="p-4 text-slate-500">University cafeterias (Mensa), Konzum, Lidl, Spar</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Public Transit, SIM &amp; Utilities</td>
                <td className="p-4">ZET student tram card (€13/mo) + mobile data + winter heating share</td>
                <td className="p-4">€600 – €1,080</td>
                <td className="p-4">79,200 – 142,600 BDT</td>
                <td className="p-4 text-slate-500">ZET Zagreb / Promet Split, A1 / Telemach / HT</td>
              </tr>

              {/* EduExpress Fee Policy */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 4: EduExpress European Advisory &amp; Processing Guarantee
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">EduExpress Service Fee</td>
                <td className="p-4">
                  Comprehensive admission, court translation coordination &amp; Type D Visa processing.
                  <span className="block font-bold text-emerald-800">BDT 0 Upfront · 100% After Visa Approval</span>
                </td>
                <td className="p-4 font-bold text-petrol-800">BDT 100,000</td>
                <td className="p-4 font-bold text-emerald-800">1.00 Lakh BDT</td>
                <td className="p-4 text-emerald-800 font-bold">Strictly After Visa Approval</td>
              </tr>

              {/* Grand Totals */}
              <tr className="bg-petrol-800 font-bold text-white">
                <td className="p-4 text-sm" colSpan={2}>
                  Total First-Year Business / STEM Budget (Tuition + 12 Months Living + Statutory Fees)
                </td>
                <td className="p-4 text-sm text-emerald-300">€10,500 – €16,500</td>
                <td className="p-4 text-sm text-sand-100">13.8 – 21.8 Lakh BDT</td>
                <td className="p-4 text-xs font-normal text-sand-200">Includes 12 full months living in Zagreb/Split</td>
              </tr>
              <tr className="bg-petrol-900 font-bold text-white">
                <td className="p-4 text-sm" colSpan={2}>
                  Total First-Year Medical (MD) Budget (Tuition + 12 Months Living + Statutory Fees)
                </td>
                <td className="p-4 text-sm text-emerald-300">€19,000 – €24,000</td>
                <td className="p-4 text-sm text-sand-100">25.0 – 31.7 Lakh BDT</td>
                <td className="p-4 text-xs font-normal text-sand-200">Includes €12,000 MD tuition + 12 months living</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 3: University-by-University Tuition Matrix */}
      <Section
        id="universities-tuition"
        tone="white"
        title="Tuition Matrix: Verified Croatian Public Universities (2026/27 Intake)"
        intro="Official tuition schedules across Croatia's flagship ASHE-accredited public universities offering English-taught degrees."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {croatiaUnis.map((uni) => (
            <div
              key={uni.slug}
              className="flex flex-col justify-between rounded-3xl border border-rule bg-white p-7 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-900">
                      <ShieldCheck size={13} /> ASHE / AZVO Accredited
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold text-petrol-800">
                      <Link href={`/universities/${uni.slug}`} className="hover:underline">
                        {uni.name}
                      </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={13} /> {uni.city || 'Croatia'}, European Union
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-canvas-soft p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Tuition Range Benchmark
                  </span>
                  <p className="mt-1 text-sm font-bold text-emerald-800">
                    {uni.tuition || 'EUR 3,500 – EUR 12,000 / year'}
                  </p>
                </div>

                <div className="mt-4">
                  <span className="text-xs font-bold text-petrol-800">Premier English Programs:</span>
                  <ul className="mt-2 space-y-2 text-xs text-slate-700">
                    {uni.programs && uni.programs.length > 0 ? (
                      uni.programs.map((prog, idx) => (
                        <li key={idx} className="flex items-start justify-between gap-2 border-b border-rule/50 pb-1.5">
                          <div>
                            <span className="font-semibold text-slate-800">{prog.name}</span>
                            <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                              {prog.level}
                            </span>
                          </div>
                          <span className="shrink-0 font-bold text-emerald-800">{prog.tuition}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">Programs updated dynamically per academic cycle</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-rule pt-4 text-xs">
                <span className="text-slate-500">Bologna ECTS · WDOMS</span>
                <Link
                  href={`/universities/${uni.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-petrol-800 hover:underline"
                >
                  View Full Profile <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Module 4: English Medical Doctor (MD) & BMDC Guardrails */}
      <Section
        id="medical-guardrails"
        tone="sage"
        title="Medical Studies in Croatia: 6-Year Integrated MD &amp; BMDC Licensing"
        intro="Croatia is renowned for top-tier European medical education. Learn about the curriculum structure, WDOMS listings, and mandatory BMDC licensing prerequisites."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Degree Structure */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Stethoscope size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">
              The 6-Year Integrated MD Program (360 ECTS Credits)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Croatian medical faculties at the <strong>University of Zagreb</strong>, <strong>University of Split</strong>, and <strong>University of Rijeka</strong> offer prestigious English-medium medical degrees:
            </p>

            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                <span>
                  <strong>Full EU Medical Directive Compliance:</strong> Complies with EU Directive 2005/36/EC on mutual recognition of professional qualifications across all 27 EU member states.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                <span>
                  <strong>WDOMS Directory Indexed:</strong> Listed in the World Directory of Medical Schools, making graduates eligible for USMLE (United States), PLAB/UKMLA (United Kingdom), and AMC (Australia).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                <span>
                  <strong>Clinical Teaching Hospitals:</strong> Hands-on rotations in premier university hospital centers (KBC Zagreb - Rebro, KBC Split, KBC Rijeka) with modern European clinical simulation facilities.
                </span>
              </li>
            </ul>
          </div>

          {/* Mandatory BMDC Licensing Criteria */}
          <div className="rounded-3xl border-2 border-petrol-800 bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-petrol-100 text-petrol-900">
              <Scale size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">
              Mandatory BMDC Prerequisites for Bangladeshi Students
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              To practice medicine in Bangladesh upon graduation, students must strictly comply with the <strong>Bangladesh Medical and Dental Council (BMDC)</strong> foreign medical circular:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl border border-rule bg-canvas-soft p-3.5">
                <strong className="text-petrol-800">1. SSC &amp; HSC Science Academic Threshold:</strong>
                <p className="mt-1 text-slate-600">
                  Combined GPA of <strong>7.00 or higher</strong> across SSC and HSC (with no single GPA below 3.00), and a minimum GPA of <strong>3.50 in Biology</strong> at HSC.
                </p>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-3.5">
                <strong className="text-petrol-800">2. Pre-Departure BMDC Eligibility Clearance:</strong>
                <p className="mt-1 text-slate-600">
                  Students must secure a formal BMDC Eligibility Certificate before departing Bangladesh. BMDC will refuse registration to graduates who travel without this prior certificate.
                </p>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-3.5">
                <strong className="text-petrol-800">3. Post-Graduation Registration Exam (RQE):</strong>
                <p className="mt-1 text-slate-600">
                  Following completion of the 6-year MD program, graduates return to Bangladesh to sit for the BMDC Registration Qualifying Examination (RQE) and complete a 1-year clinical internship for full license issuance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 5: National Type D Study Visa & Bank Solvency Protocols */}
      <Section
        id="visa-solvency"
        tone="white"
        title="Croatia National Type D Visa: Bank Solvency &amp; Remittance Rules"
        intro="The Croatian Ministry of the Interior (MUP) enforces strict statutory proof of living maintenance and accommodation before granting student visa approval."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Statutory Solvency Benchmark */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-900">
              <Landmark size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Statutory Monthly Solvency Benchmark</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Under the Croatian Foreigners Act (Zakon o strancima), international students applying for a National Type D Long-Stay Visa must prove sufficient financial resources for living maintenance:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">Minimum Solvency Requirement:</span>
                <p className="mt-1 text-sm font-bold text-emerald-800">
                  €4,800 – €6,600 (~6.3 Lakh – 8.7 Lakh BDT)
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Demonstrating €400 to €550 per month. Maintaining 8.0 Lakh to 10.0 Lakh BDT in the sponsor account provides a solid financial safety margin.
                </p>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">Bank Statement &amp; Sponsor Proofs:</span>
                <ul className="mt-1.5 space-y-1 text-slate-600">
                  <li>• Official Bank Solvency Certificate from a scheduled commercial bank in Bangladesh.</li>
                  <li>• Certified bank statements showing consistent transaction activity for <strong>3 to 6 months</strong>.</li>
                  <li>• Notarized Affidavit of Financial Support from parent/legal sponsor.</li>
                  <li>• Sponsor&apos;s TIN certificates and last 2–3 years of income tax payment challans.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">Croatian Police Department (MUP) Registration:</span>
                <p className="mt-1 text-slate-600">
                  Within 48 hours of landing in Croatia, students register their address with the local police station (policijska uprava) and collect their biometric Temporary Stay Permit card (privremeni boravak).
                </p>
              </div>
            </div>
          </div>

          {/* Bangladesh Bank Student File Protocol */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <CreditCard size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Bangladesh Bank Student File &amp; SWIFT Wire</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              All tuition transactions to Croatia must comply with Bangladesh Bank foreign exchange circulars:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl bg-canvas-soft p-4">
                <strong className="text-petrol-800">1. Formal Student File Opening:</strong>
                <p className="mt-1 text-slate-600">
                  Your parent opens an official Student File at an Authorized Dealer (AD) bank (e.g., Eastern Bank, City Bank, BRAC Bank) using the university unconditional offer and fee invoice.
                </p>
              </div>

              <div className="rounded-2xl bg-canvas-soft p-4">
                <strong className="text-petrol-800">2. SWIFT Telegraphic Transfer (Form TM):</strong>
                <p className="mt-1 text-slate-600">
                  Tuition is wired directly to the Croatian university&apos;s verified bank IBAN under Form TM. The bank issues a SWIFT MT103 confirmation slip required for the visa file.
                </p>
              </div>

              <div className="rounded-2xl bg-canvas-soft p-4">
                <strong className="text-petrol-800">3. International Education Card Quota:</strong>
                <p className="mt-1 text-slate-600">
                  Under FE Circular No. 37, banks issue an international debit/credit card with an annual foreign exchange quota up to USD 12,000 equivalent for living and accommodation expenses in Croatia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 6: Monthly Living Cost Comparison — Zagreb vs Split vs Rijeka */}
      <Section
        id="city-living-costs"
        tone="sage"
        title="Monthly Living Cost Comparison: Zagreb vs Split vs Rijeka"
        intro="Living expenses vary between the capital metropolis and Adriatic coastal cities. Learn how subsidized dining and transit keep overall costs manageable."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-rule bg-canvas-soft font-bold uppercase tracking-wider text-petrol-800">
              <tr>
                <th className="p-4">Expense Category</th>
                <th className="p-4">Zagreb (Capital Metropolis)</th>
                <th className="p-4">Split (Dalmatian Coast)</th>
                <th className="p-4">Rijeka (Kvarner Bay Hub)</th>
                <th className="p-4">Practical Student Budget Advice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Shared Flat (2-Bedroom)</td>
                <td className="p-4 font-bold text-petrol-800">€220 – €380 / mo</td>
                <td className="p-4 font-bold text-petrol-800">€200 – €360 / mo</td>
                <td className="p-4 font-bold text-petrol-800">€190 – €330 / mo</td>
                <td className="p-4 text-slate-600">
                  In coastal Split and Rijeka, secure 10-month academic leases to avoid summer peak tourist rental hikes.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Subsidized Food (X-ica Mensa)</td>
                <td className="p-4 font-bold text-petrol-800">€160 – €230 / mo</td>
                <td className="p-4 font-bold text-petrol-800">€150 – €220 / mo</td>
                <td className="p-4 font-bold text-petrol-800">€140 – €210 / mo</td>
                <td className="p-4 text-slate-600">
                  The Croatian student card (&quot;X-ica&quot;) provides a 50%–70% state subsidy on Mensa meals (€1.50–€2.50 per complete meal).
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Public Transit Card</td>
                <td className="p-4 font-bold text-petrol-800">€13 / mo (ZET Tram/Bus)</td>
                <td className="p-4 font-bold text-petrol-800">€15 / mo (Promet Split)</td>
                <td className="p-4 font-bold text-petrol-800">€14 / mo (Autotrolej)</td>
                <td className="p-4 text-slate-600">
                  Heavily subsidized unlimited monthly student pass across city tram and bus networks.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Utilities (Heating, Water, Electricity)</td>
                <td className="p-4 font-bold text-petrol-800">€40 – €70 / mo</td>
                <td className="p-4 font-bold text-petrol-800">€35 – €60 / mo</td>
                <td className="p-4 font-bold text-petrol-800">€35 – €65 / mo</td>
                <td className="p-4 text-slate-600">
                  Shared utility bills among roommates. Continental Zagreb experiences colder winters than the coast.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">High-Speed Fiber &amp; 4G SIM</td>
                <td className="p-4 font-bold text-petrol-800">€15 – €20 / mo</td>
                <td className="p-4 font-bold text-petrol-800">€15 – €20 / mo</td>
                <td className="p-4 font-bold text-petrol-800">€15 – €20 / mo</td>
                <td className="p-4 text-slate-600">
                  Unlimited 4G/5G data bundle from Croatian operators (A1, Telemach, Hrvatski Telekom).
                </td>
              </tr>
              <tr className="bg-sand-50/60 font-bold text-petrol-800">
                <td className="p-4">Total Monthly Living Budget</td>
                <td className="p-4 text-emerald-800">€450 – €720 / mo</td>
                <td className="p-4 text-emerald-800">€420 – €680 / mo</td>
                <td className="p-4 text-emerald-800">€400 – €650 / mo</td>
                <td className="p-4 text-slate-600 font-normal">
                  ~53,000 – 95,000 BDT/month covering all daily necessities and student recreation.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 7: Part-Time Work Rights & Schengen Mobility */}
      <Section
        id="work-and-mobility"
        tone="white"
        title="Part-Time Employment via Student Contract &amp; Schengen Mobility"
        intro="Understand the legal framework for student jobs through the Croatian Student Centre (Studentski centar) and your cross-border European mobility rights."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Student Contract Work Rights */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <Briefcase size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">
              Student Centre (Studentski Centar) Employment Framework
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Full-time international students in Croatia have the statutory right to work legally through the university <strong>Student Centre (SC)</strong> using an official <strong>Student Contract (Studentski ugovor)</strong>:
            </p>
            <div className="mt-4 rounded-2xl border border-rule bg-canvas-soft p-4 text-xs text-slate-700">
              <strong className="text-petrol-800">Key Employment Regulations:</strong>
              <ul className="mt-1.5 space-y-1 text-slate-600">
                <li>• <strong>Statutory Minimum Wage:</strong> Croatia sets a mandatory minimum student hourly rate of ~€5.25 to €5.60/hour (~690–740 BDT/hour).</li>
                <li>• <strong>Common Student Jobs:</strong> Tourism, customer service, summer hospitality in Split/Dubrovnik, English tutoring, and tech support.</li>
                <li>• <strong>Tax-Free Threshold:</strong> Croatian law exempts student earnings from personal income tax up to a generous annual ceiling.</li>
                <li>• <strong>Medical Student Notice:</strong> Medical clinical rotations require 35+ hours/week. MD students must not rely on work to cover tuition fees.</li>
              </ul>
            </div>
          </div>

          {/* Schengen Mobility */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-900">
              <Compass size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">
              Schengen Area Visa-Free Travel (29 European Nations)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Croatia is a full Schengen Area member state. Holding a Croatian biometric Temporary Stay Permit provides immense academic and mobility advantages:
            </p>
            <div className="mt-4 rounded-2xl border border-rule bg-canvas-soft p-4 text-xs text-slate-700">
              <strong className="text-petrol-800">Schengen Mobility Benefits:</strong>
              <ul className="mt-1.5 space-y-1 text-slate-600">
                <li>• <strong>Visa-Free Schengen Travel:</strong> Travel freely across 29 Schengen countries (Germany, France, Italy, Austria, Netherlands, etc.) up to 90 days in any 180-day window.</li>
                <li>• <strong>Erasmus+ Mobility:</strong> Croatian universities participate actively in the European Erasmus+ program, allowing semester exchanges at partner European universities.</li>
                <li>• <strong>No Internal Border Checks:</strong> Direct overland and flight transit within Europe without border passport control.</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 8: EduExpress Europe Fee Policy & Written Guarantees */}
      <Section
        id="eduexpress-policy"
        tone="sage"
        title="The EduExpress Europe Fee Guarantee: Zero Risk, 100% Written Transparency"
        intro="We maintain an uncompromising transparent fee policy for Croatia and all European destinations. Never pay an agency fee before visa approval."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900">
              <Receipt size={18} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">BDT 0 File-Opening Charge</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Zero upfront file-opening fee, assessment charge, or hidden retainer. Your initial academic audit and BMDC prerequisite review are 100% free.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-petrol-100 text-petrol-900">
              <ShieldCheck size={18} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">BDT 100,000 Service Fee (After Visa)</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Our comprehensive Europe processing charge is BDT 100,000 (1 Lakh Taka), payable strictly and only <strong>100% after your Croatian National Type D Visa is issued</strong>.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
              <FileCheck size={18} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">Three Written Guarantees</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Every applicant receives our written Official Recognition Check, a 1-page itemized ClearCost Sheet, and a complete Application Proof Pack documenting direct submissions.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 9: FAQs */}
      <Section
        id="faqs"
        tone="white"
        title="Frequently Asked Questions: Cost of Studying in Croatia"
        intro="Direct, counselor-verified answers to common financial and regulatory questions from Bangladeshi students and parents."
      >
        <FaqBlock items={faqs} />
      </Section>

      {/* Editorial Card */}
      <Section tone="white" className="pt-0">
        <div className="rounded-3xl border border-rule bg-canvas-soft p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-petrol-800 text-white font-bold">
                AR
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Reviewed &amp; Verified By
                </p>
                <h4 className="font-display text-base font-bold text-petrol-800">
                  Abdullah Al Rakib
                </h4>
                <p className="text-xs text-slate-600">
                  Founder &amp; CEO, EduExpress International · Updated November 27, 2026
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/study-in-croatia-from-bangladesh"
                className="ed-btn ed-btn-outline text-xs min-h-[40px] px-4"
              >
                Croatia Country Pillar
              </Link>
              <Link
                href="/apply?country=Croatia"
                className="ed-btn ed-btn-signal text-xs min-h-[40px] px-4"
              >
                Apply for Croatia
              </Link>
            </div>
          </div>
          <div className="mt-5 border-t border-rule/60 pt-4 text-[11px] leading-relaxed text-slate-500">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission, scholarship award, and visa issuance decisions rest solely with the respective universities and official embassy authorities.
          </div>
        </div>
      </Section>

      {/* Assessment Funnel */}
      <Section tone="sage" className="pb-16">
        <div className="mx-auto max-w-3xl">
          <EducationFitAssessment />
        </div>
      </Section>
    </article>
  );
}
