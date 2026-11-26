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
const PATH = '/study-in-uk-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=UK';
export const revalidate = 3600;

const UK_OFFICIAL_AUTHORITIES = [
  {
    label: 'UK Visas and Immigration (UKVI) Student Visa Guidance',
    href: 'https://www.gov.uk/student-visa',
    note: 'Official Home Office Student Visa financial requirements, CAS validity, and 28-day holding period',
  },
  {
    label: 'UKVI Register of Licensed Student Sponsors',
    href: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students',
    note: 'Statutory verification list of accredited UK universities authorized to issue CAS for international students',
  },
  {
    label: 'UK Council for International Student Affairs (UKCISA)',
    href: 'https://www.ukcisa.org.uk/',
    note: 'Independent advisory guidance on immigration rules, student finances, and working rights in the UK',
  },
  {
    label: 'Bangladesh Bank Foreign Exchange Guidelines (Student File)',
    href: 'https://www.bb.org.bd/',
    note: 'Authorized Dealer (AD) commercial bank outward remittance regulations for UK tuition & maintenance',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in UK from Bangladesh: Costs, Visa & Universities | EduExpress',
    description:
      'Evidence-first guide to studying in the UK from Bangladesh: 8 verified universities, CAS deposits, 2026/27 living fund rules (£1,483/mo London vs £1,136 outside), 1-year Masters, and Bangladesh Bank Student File.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('uk', 'Study in UK from Bangladesh — EduExpress International'),
  });
}

const UK_FAQS = [
  {
    question: 'How much bank balance is required for a UK Student Visa from Bangladesh in 2026/27?',
    answer:
      'Under UKVI rules, applicants must show proof of remaining first-year tuition (unpaid portion after CAS deposit) plus 9 months of living maintenance. For studies inside London, the maintenance rate is £1,483 per month (£13,347 for 9 months). Outside London, the rate is £1,136 per month (£10,224 for 9 months). These funds must be held in a recognized bank in the student’s or parents’ name for a strict consecutive 28-day period before visa submission.',
  },
  {
    question: 'Can Bangladeshi students open a Bangladesh Bank Student File for UK universities?',
    answer:
      'Yes. UK universities require tuition and deposit payments through legal banking channels. With an unconditional offer and CAS statement, Bangladeshi students can open an official Student File at any Authorized Dealer (AD) commercial bank in Bangladesh (e.g. City Bank, BRAC Bank, Eastern Bank, Standard Chartered) to remit tuition and living allowances under Bangladesh Bank foreign exchange regulations.',
  },
  {
    question: 'What is the advantage of a 1-Year UK Master’s degree for Bangladeshi graduates?',
    answer:
      'UK taught Master’s degrees (MSc/MA/MBA) are typically completed in 12 consecutive months (180 credits), compared to 2 years in the US, Canada, Australia, or Bangladesh. This cuts accommodation, food, and living costs by half and allows graduates to enter the job market or Graduate Visa route one full year earlier.',
  },
  {
    question: 'What are the current UK Graduate Route (post-study work visa) rules?',
    answer:
      'Under UK immigration policy, international graduates who successfully complete an eligible undergraduate or postgraduate degree at a UK higher education institution with a track record of compliance can apply for the Graduate route. This provides 2 years of unsponsored work authorization for bachelor’s and master’s graduates (3 years for PhDs). Dependants can only accompany postgraduate research (PhD) students or government-sponsored awardees.',
  },
  {
    question: 'Do I need IELTS for UK universities from Bangladesh?',
    answer:
      'Most UK universities require IELTS Academic (typically overall 6.0–6.5 with no band below 5.5 for undergraduate; 6.5 with no band below 6.0 for postgraduate), PTE Academic, or TOEFL iBT. Some universities accept Medium of Instruction (MOI) certificates from recognized Bangladeshi English-medium institutions or high English grades (A/B) in Cambridge O-Level/A-Level or HSC English (typically 75%+).',
  },
];

export default async function StudyInUkPage() {
  const universities = await prisma.university.findMany({
    where: { country: 'United Kingdom', isActive: true },
    include: {
      programs: { where: { status: 'active' }, take: 4 },
      scholarships: { where: { status: 'active' }, take: 2 },
    },
    orderBy: { name: 'asc' },
  });

  const year = new Date().getFullYear();

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: '2026-11-26',
        name: 'Study in the UK from Bangladesh: Costs, Visa & Universities (2027 Benchmark)',
        description:
          'Official 2026/27 tuition, living maintenance (£1,483/mo London vs £1,136 outside), CAS deposit, and visa guidelines for Bangladeshi students.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/uk.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(UK_OFFICIAL_AUTHORITIES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#universities`,
        name: 'Verified UK Universities for Bangladeshi Students',
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
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: 'United Kingdom' }]}
        eyebrow={`Verified 2026/2027 UK Benchmark · UKVI Maintenance Rules (£1,483/mo London / £1,136 Outside)`}
        title="Study in the UK from Bangladesh: Costs, Visa & Universities."
        lead="UK Russell Group and career-focused universities offer prestigious 3-year Bachelor’s and fast-track 1-year Master’s degrees. EduExpress provides transparent CAS guidance, official Bangladesh Bank Student File support, and realistic cost budgeting with zero hidden surcharges."
        reviewed="November 2026"
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start UK Eligibility Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/uk-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              UK Study Cost Guide
            </Link>
            <a href="#universities" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              View 8 Verified Universities
            </a>
          </>
        }
      />

      <TrustBar />

      {/* 3. Who This Country Fits — And Who Should Reconsider */}
      <Section
        id="who-fits"
        tone="white"
        title="Who the UK fits — and who should reconsider."
        intro="The UK delivers unmatched academic prestige and accelerated 1-year Master’s programs, but requires substantial upfront solvency and strictly regulated work hours. Evaluate your family’s budget realistically."
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
                <span><strong>Want a 1-Year Fast-Track Master’s:</strong> Complete an internationally recognized MSc, MA, or MBA in 12 calendar months, saving a full year of living expenses.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Have Provable Liquid Funds:</strong> Families who can show tuition plus £10,224–£13,347 maintenance in an AD bank account for 28 consecutive days.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Target Russell Group / Global Brand Value:</strong> Students seeking degrees from centuries-old research powerhouses (Manchester, Birmingham, Leeds, Glasgow, Cardiff).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Value 2 Years of Post-Study Work:</strong> Graduates who want 24 months of unsponsored work authorization via the UK Graduate Route.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-rose-700/20 bg-rose-50/50 p-6 sm:p-7">
            <div className="flex items-center gap-2 text-rose-950 font-bold text-[18px]">
              <ShieldAlert className="size-6 text-rose-700" />
              <span>Who should reconsider or explore alternatives:</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-700">✕</span>
                <span><strong>Relying on part-time jobs to pay tuition:</strong> UKVI strictly caps term-time work at 20 hours/week. Part-time wages cover pocket expenses and groceries, NOT £16,000+ tuition fees.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-700">✕</span>
                <span><strong>Seeking all-inclusive 100% full scholarships:</strong> Unlike China’s CSC or Hungary’s Stipendium Hungaricum, full UK government scholarships (Chevening/Commonwealth) are ultra-competitive (sub-2% acceptance). University scholarships typically offer £1,500–£5,000 fee discounts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-700">✕</span>
                <span><strong>Planning to bring family dependants on Master’s:</strong> Since January 2024, dependants are prohibited on taught Master’s routes (only PhD research students may sponsor spouses).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-700">✕</span>
                <span><strong>Low budget thresholds:</strong> If your total 4-year undergraduate budget is under BDT 40–50 lakh, explore China (with CSC/provincial waiver) or Malaysia instead.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 4. Education System and Recognition */}
      <Section
        id="education-system"
        tone="sage"
        title="UK higher education system &amp; global recognition."
        intro="The UK operates one of the world's most rigorous quality assurance frameworks governed by the Quality Assurance Agency (QAA) and Office for Students (OfS)."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className={kit.card}>
            <div className="size-10 rounded-xl bg-petrol-800/10 flex items-center justify-center text-petrol-800">
              <GraduationCap size={22} />
            </div>
            <h3 className="mt-4 text-[18px] font-bold text-petrol-800">Degree Structure</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Undergraduate degrees take 3 years in England &amp; Wales (4 years in Scotland for Honours). Taught Master’s degrees take exactly 1 year (12 months intensive, 180 CATS credits).
            </p>
          </div>

          <div className={kit.card}>
            <div className="size-10 rounded-xl bg-petrol-800/10 flex items-center justify-center text-petrol-800">
              <Scale size={22} />
            </div>
            <h3 className="mt-4 text-[18px] font-bold text-petrol-800">Global &amp; BD Recognition</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Degrees are globally accredited and fully recognized by the University Grants Commission (UGC) of Bangladesh, BCS examination boards, and international professional bodies (ACCA, IMechE, BCS The Chartered Institute for IT).
            </p>
          </div>

          <div className={kit.card}>
            <div className="size-10 rounded-xl bg-petrol-800/10 flex items-center justify-center text-petrol-800">
              <Building2 size={22} />
            </div>
            <h3 className="mt-4 text-[18px] font-bold text-petrol-800">Russell Group vs. Modern Unis</h3>
            <p className="mt-2 text-[14px] leading-6 text-ink-soft">
              Russell Group institutions (Manchester, Birmingham, Leeds) emphasize high-impact research. Modern universities (Coventry, UWE Bristol) offer industry-embedded coursework, work placements, and lower tuition.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Verified UK Universities in Catalog */}
      <Section
        id="universities"
        tone="white"
        title="Verified UK universities with active admissions."
        intro={`Explore 8 official UKVI licensed institutions in our catalog with published local-currency tuition, scholarship tracks, and verified application requirements.`}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {universities.map((uni) => {
            const badges = typeof uni.badges === 'string' ? JSON.parse(uni.badges || '[]') : uni.badges || [];
            return (
              <div key={uni.slug} className="flex flex-col justify-between rounded-3xl border border-petrol-800/15 bg-white p-5 shadow-xs transition hover:border-petrol-800/40 hover:shadow-sm">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {badges.slice(0, 2).map((b: string) => (
                      <span key={b} className="rounded-full bg-petrol-800/10 px-2.5 py-0.5 text-[11px] font-bold text-petrol-800">
                        {b}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-[17px] font-bold text-petrol-800 leading-snug">
                    {uni.name}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-soft">
                    <MapPin size={13} className="text-emerald-700" /> {uni.city}, United Kingdom
                  </p>

                  <div className="mt-3.5 rounded-xl bg-canvas-soft p-3 text-[12.5px] leading-5 text-slate-800">
                    <span className="font-semibold text-petrol-800 block text-[11px] uppercase tracking-wider">Tuition Range</span>
                    {uni.tuition}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-canvas-soft flex items-center justify-between text-[13px]">
                  <Link href={`/universities/${uni.slug}`} className="font-bold text-petrol-800 hover:text-emerald-700 transition">
                    View Programs ({uni.programs.length}) →
                  </Link>
                  <a href={uni.officialUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-ink-soft hover:text-petrol-800">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 6. Admission Requirements for Bangladesh */}
      <Section
        id="requirements"
        tone="sage"
        title="Admission requirements for Bangladeshi students."
        intro="Entry requirements vary by institution tier and level. Below are documented standard criteria across UK universities for 2026/27."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className={kit.card}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-petrol-800/10 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-petrol-800">
              Undergraduate (Bachelor’s)
            </span>
            <h3 className="mt-3 text-[20px] font-bold text-petrol-800">Direct Entry vs. Foundation</h3>
            <ul className="mt-3 space-y-2.5 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>A-Levels / IB:</strong> Minimum 3 A-Level passes (typically BBB to A*AA depending on ranking and course). Direct 3-year entry.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>HSC Graduates (National Curriculum):</strong> HSC is rarely accepted for direct Year 1 entry at top universities. Most students complete a 1-year International Foundation Programme (IFP) or International Year One (IYOne).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>English Proficiency:</strong> IELTS Academic 6.0 overall (min 5.5 in each skill) or equivalent PTE/TOEFL. Cambridge O-Level English Grade C/4 or above is widely accepted.</span>
              </li>
            </ul>
          </div>

          <div className={kit.card}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-petrol-800/10 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-petrol-800">
              Postgraduate (Master’s)
            </span>
            <h3 className="mt-3 text-[20px] font-bold text-petrol-800">1-Year Taught Master’s (MSc / MA / MBA)</h3>
            <ul className="mt-3 space-y-2.5 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Bachelor’s Degree:</strong> 4-year Bachelor’s from a recognized public or private university in Bangladesh with minimum CGPA 2.8–3.2 / 4.0 (depending on university tier).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>English Proficiency:</strong> IELTS Academic 6.5 overall (min 6.0 in each band) or PTE Academic 62+. Select universities accept Medium of Instruction (MOI) certificates from accredited private universities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Documentation:</strong> Statement of Purpose (SOP), 2 Academic Recommendation Letters, CV, and verified transcripts.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7. Total Cost & Funding Reality */}
      <Section
        id="costs"
        tone="white"
        title="Total cost and funding reality (GBP &amp; BDT)."
        intro="UK tuition and statutory living funds must be calculated separately. Never rely on marketing averages."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-canvas-soft border-b border-petrol-800/10 text-[13px] font-bold uppercase tracking-wider text-petrol-800">
              <tr>
                <th className="p-4">Cost Category</th>
                <th className="p-4">Outside London (Annual)</th>
                <th className="p-4">Inside London (Annual)</th>
                <th className="p-4">Approx. BDT Equivalent (@ 155 BDT/GBP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10 text-slate-800">
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Undergraduate Tuition</td>
                <td className="p-4">£16,800 – £31,700</td>
                <td className="p-4">£18,000 – £36,000</td>
                <td className="p-4">BDT 26.0 Lakh – 49.1 Lakh / yr</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">1-Year Master’s Tuition</td>
                <td className="p-4">£17,500 – £34,500</td>
                <td className="p-4">£19,000 – £38,000</td>
                <td className="p-4">BDT 27.1 Lakh – 53.5 Lakh (Total degree)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">UKVI Statutory Living Maintenance (9 mos)</td>
                <td className="p-4">£10,224 (£1,136/mo)</td>
                <td className="p-4">£13,347 (£1,483/mo)</td>
                <td className="p-4">BDT 15.8 Lakh – 20.7 Lakh</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Immigration Health Surcharge (IHS)</td>
                <td className="p-4">£776 / year</td>
                <td className="p-4">£776 / year</td>
                <td className="p-4">~BDT 1.20 Lakh / yr (access to full NHS)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Student Visa Application Fee</td>
                <td className="p-4">£490</td>
                <td className="p-4">£490</td>
                <td className="p-4">~BDT 76,000 (one-off)</td>
              </tr>
              <tr className="bg-canvas-soft/60 font-bold text-petrol-800">
                <td className="p-4">Estimated Year 1 Total Solvency</td>
                <td className="p-4">£28,000 – £43,000</td>
                <td className="p-4">£32,000 – £50,000</td>
                <td className="p-4 text-emerald-800">BDT 43.4 Lakh – 66.6 Lakh</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sand-50/70 p-4 text-xs">
          <span className="text-slate-700">Looking for granular monthly accommodation, groceries, IHS, and bank Student File breakdown?</span>
          <Link href="/uk-study-cost-bangladesh" className="font-bold text-petrol-800 hover:text-emerald-800 inline-flex items-center gap-1">
            Read Complete UK Study Cost Guide <ArrowRight size={14} />
          </Link>
        </div>
      </Section>

      {/* 8. Visa & Residence Process */}
      <Section
        id="visa"
        tone="sage"
        title="UK Student Visa (Subroute) &amp; CAS workflow from Dhaka."
        intro="Follow the 6-step evidence-verified procedure to avoid delays or refusals at the VFS Global Visa Application Centre in Dhaka or Sylhet."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className={kit.card}>
            <span className="size-8 rounded-full bg-petrol-800 text-lime flex items-center justify-center font-bold text-[14px]">1</span>
            <h4 className="mt-3 text-[17px] font-bold text-petrol-800">Offer &amp; Conditions</h4>
            <p className="mt-2 text-[13.5px] leading-6 text-ink-soft">
              Submit academic transcripts, SOP, and reference letters to secure a Conditional Offer, then clear academic and English language conditions.
            </p>
          </div>

          <div className={kit.card}>
            <span className="size-8 rounded-full bg-petrol-800 text-lime flex items-center justify-center font-bold text-[14px]">2</span>
            <h4 className="mt-3 text-[17px] font-bold text-petrol-800">CAS Deposit &amp; Pre-CAS</h4>
            <p className="mt-2 text-[13.5px] leading-6 text-ink-soft">
              Pay the university’s tuition deposit (typically £2,000–£5,000) via an Authorized Dealer (AD) Bank Student File. Complete the university’s Pre-CAS credibility interview.
            </p>
          </div>

          <div className={kit.card}>
            <span className="size-8 rounded-full bg-petrol-800 text-lime flex items-center justify-center font-bold text-[14px]">3</span>
            <h4 className="mt-3 text-[17px] font-bold text-petrol-800">28-Day Bank Maturation</h4>
            <p className="mt-2 text-[13.5px] leading-6 text-ink-soft">
              Hold the remaining tuition balance plus 9 months of maintenance (£10,224 or £13,347) in a compliant bank account for 28 consecutive days without dropping by even 1 taka.
            </p>
          </div>

          <div className={kit.card}>
            <span className="size-8 rounded-full bg-petrol-800 text-lime flex items-center justify-center font-bold text-[14px]">4</span>
            <h4 className="mt-3 text-[17px] font-bold text-petrol-800">CAS Statement Issuance</h4>
            <p className="mt-2 text-[13.5px] leading-6 text-ink-soft">
              The university issues your unique Confirmation of Acceptance for Studies (CAS) number valid for 6 months. Verify every personal detail and fee credited.
            </p>
          </div>

          <div className={kit.card}>
            <span className="size-8 rounded-full bg-petrol-800 text-lime flex items-center justify-center font-bold text-[14px]">5</span>
            <h4 className="mt-3 text-[17px] font-bold text-petrol-800">TB Screening (IOM Dhaka/Sylhet)</h4>
            <p className="mt-2 text-[13.5px] leading-6 text-ink-soft">
              Complete mandatory Tuberculosis (TB) testing at the International Organization for Migration (IOM) designated medical clinic in Dhaka or Sylhet to receive an official TB Certificate.
            </p>
          </div>

          <div className={kit.card}>
            <span className="size-8 rounded-full bg-petrol-800 text-lime flex items-center justify-center font-bold text-[14px]">6</span>
            <h4 className="mt-3 text-[17px] font-bold text-petrol-800">Online Visa &amp; VFS Biometrics</h4>
            <p className="mt-2 text-[13.5px] leading-6 text-ink-soft">
              Complete the GOV.UK online application, pay the visa fee (£490) and IHS (£776/yr), and attend biometrics at VFS Global Dhaka (Delta Life Tower) or Sylhet.
            </p>
          </div>
        </div>
      </Section>

      {/* 9. Work Rights & Career Pathways */}
      <Section
        id="work-rights"
        tone="white"
        title="Part-time work rules &amp; Graduate Route career rights."
        intro="Understand exact statutory work permissions during and after study to stay fully compliant with UKVI regulations."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className={kit.card}>
            <h3 className="text-[19px] font-bold text-petrol-800">During Your Studies (Term Time)</h3>
            <ul className="mt-3 space-y-2.5 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>20 Hours / Week:</strong> Permitted for degree-level students (Bachelor’s, Master’s, PhD) during term time. Foundation students are limited to 10 hours/week.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Full-Time on Vacations:</strong> Permitted to work full-time during official university vacation periods.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>National Minimum Wage:</strong> Current UK National Living Wage is £11.44/hour (for ages 21+), yielding approx. £900–£1,000/month before tax for 20 hours/week—sufficient for food and personal living expenses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-rose-700">✕</span>
                <span><strong>Prohibited:</strong> Self-employment, freelancing, starting a business, or professional sports/entertainment roles.</span>
              </li>
            </ul>
          </div>

          <div className={kit.card}>
            <h3 className="text-[19px] font-bold text-petrol-800">After Graduation (Graduate Route PSW)</h3>
            <ul className="mt-3 space-y-2.5 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>2-Year Work Authorization:</strong> Bachelor’s and Master’s graduates can work at any skill level without requiring employer sponsorship. (3 years for PhD).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Path to Skilled Worker Visa:</strong> During the Graduate Route, students can transition to an employer-sponsored Skilled Worker Visa if they secure an eligible qualifying role meeting Home Office salary thresholds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>High-Demand STEM Sectors:</strong> Data Science, AI, Cybersecurity, Civil &amp; Mechanical Engineering, Health Informatics, and Accountancy.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 10. Intakes & Deadlines */}
      <Section
        id="intakes"
        tone="sage"
        title="UK intake calendar (January vs. September)."
        intro="Plan your application 4–6 months ahead to secure CAS statements and complete the 28-day financial holding period without missing orientation."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className={kit.card}>
            <div className="flex items-center justify-between border-b border-canvas-soft pb-3">
              <span className="font-bold text-[18px] text-petrol-800">September Intake (Autumn)</span>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[12px] font-bold text-emerald-800">Main UK Intake</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-6 text-slate-800">
              <li><strong>Programs:</strong> 100% of Bachelor’s, Master’s, and Foundation courses open.</li>
              <li><strong>Applications Open:</strong> October / November (previous year).</li>
              <li><strong>Application Deadline:</strong> May – July (Russell Group courses fill by April).</li>
              <li><strong>CAS &amp; Visa Submission:</strong> June – August.</li>
              <li><strong>Classes Start:</strong> Late September / Early October.</li>
            </ul>
          </div>

          <div className={kit.card}>
            <div className="flex items-center justify-between border-b border-canvas-soft pb-3">
              <span className="font-bold text-[18px] text-petrol-800">January / February Intake (Spring)</span>
              <span className="rounded-full bg-petrol-800/10 px-3 py-0.5 text-[12px] font-bold text-petrol-800">Fast-Track Entry</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-6 text-slate-800">
              <li><strong>Programs:</strong> Extensive selection of Business, Management, Computing, and Engineering Master’s.</li>
              <li><strong>Applications Open:</strong> July / August.</li>
              <li><strong>Application Deadline:</strong> October – November.</li>
              <li><strong>CAS &amp; Visa Submission:</strong> November – December.</li>
              <li><strong>Classes Start:</strong> Mid January / Early February.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 11. Comparison with Two Alternatives */}
      <Section
        id="comparison"
        tone="white"
        title="UK compared to China &amp; Malaysia for Bangladeshi students."
        intro="Compare real return on investment, tuition models, and visa requirements across EduExpress active destinations."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-canvas-soft border-b border-petrol-800/10 text-[13px] font-bold uppercase tracking-wider text-petrol-800">
              <tr>
                <th className="p-4">Criterion</th>
                <th className="p-4">United Kingdom</th>
                <th className="p-4">China (Flagship)</th>
                <th className="p-4">Malaysia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10 text-slate-800">
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Master’s Duration</td>
                <td className="p-4 font-bold text-emerald-800">1 Year (12 months)</td>
                <td className="p-4">2–3 Years</td>
                <td className="p-4">1–2 Years</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Annual Tuition</td>
                <td className="p-4">£16,800 – £34,500 (BDT 26L–53L)</td>
                <td className="p-4 font-bold text-emerald-800">CNY 15,000 – 30,000 (BDT 2.6L–5.2L; CSC waiver covers 100%)</td>
                <td className="p-4">RM 16,000 – 38,000 (BDT 4.3L–10.2L)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Monthly Living Cost</td>
                <td className="p-4">£800 – £1,400 (BDT 1.2L–2.1L)</td>
                <td className="p-4 font-bold text-emerald-800">CNY 1,500 – 2,500 (BDT 25k–42k)</td>
                <td className="p-4">RM 1,500 – 2,500 (BDT 40k–67k)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Visa Solvency Proof</td>
                <td className="p-4">£10,224–£13,347 (28-day hold)</td>
                <td className="p-4 font-bold text-emerald-800">$2,500 bank proof (waived on CSC)</td>
                <td className="p-4">EMGS approval + Student File</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Post-Study Work</td>
                <td className="p-4 font-bold text-emerald-800">2-Year Graduate Route PSW</td>
                <td className="p-4">K-Visa STEM / Work Permit</td>
                <td className="p-4">Employment Pass transfer</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">EduExpress Fee Model</td>
                <td className="p-4">Written service schedule</td>
                <td className="p-4 font-bold text-emerald-800">BDT 0 before China visa approval</td>
                <td className="p-4 font-bold text-emerald-800">BDT 0 EduExpress service charge</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sand-50/70 p-4 text-xs">
          <span className="text-slate-700">Looking for granular monthly accommodation, groceries, IHS, and bank Student File breakdown?</span>
          <Link href="/uk-study-cost-bangladesh" className="font-bold text-petrol-800 hover:text-emerald-800 inline-flex items-center gap-1">
            Read Complete UK Study Cost Guide <ArrowRight size={14} />
          </Link>
        </div>
      </Section>

      {/* 12. FAQ with Visible Answers */}
      <FaqBlock items={UK_FAQS} />

      {/* 13. Official Sources & Verification Desk */}
      <Section
        id="sources"
        tone="sage"
        title="Official sources &amp; verification desk."
        intro="All statutory thresholds, sponsor rules, and living costs are cross-referenced directly with UK government authorities."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {UK_OFFICIAL_AUTHORITIES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Last verified on 26 November 2026. Next scheduled review: 26 February 2027.
          </p>
        </div>
      </Section>

      {/* 14. CTA Band & Education Fit Assessment */}
      <Section id="assessment" tone="white" title="Assess your UK admission &amp; CAS readiness.">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="Ready to evaluate your UK university options?"
        text="Book an in-person session at our Dhanmondi office or schedule a video consultation. We audit your academic profile, verify university fee guarantees, and structure your 28-day financial schedule."
        assessmentHref={applyHref}
        assessmentLabel="Start Application Assessment"
      />
    </article>
  );
}
