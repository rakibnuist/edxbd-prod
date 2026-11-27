import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/study-gap-acceptable-countries-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const STUDY_GAP_SOURCES = [
  {
    label: 'China Scholarship Council (CSC) — Campus China Official Age & Degree Eligibility Rules',
    href: 'https://www.campuschina.org/',
    note: 'Statutory CSC age limits: under 25 for Undergraduate, under 35 for Master’s, and under 40 for Doctoral applicants.',
  },
  {
    label: 'UK Visas and Immigration (UKVI) — Student Route Caseworker Guidance (Genuine Student Rule)',
    href: 'https://www.gov.uk/student-visa',
    note: 'UK Home Office assessment rules on academic progression, career continuity, and verifiable employment evidence during study gaps.',
  },
  {
    label: 'Education Malaysia Global Services (EMGS) — International Student Pass Eligibility Guidelines',
    href: 'https://educationmalaysia.gov.my/',
    note: 'Malaysian Ministry of Higher Education and Immigration age and mature-student admission rules across public and private universities.',
  },
  {
    label: 'Finnish Immigration Service (Migri) & Studyinfo.fi — Higher Education Eligibility',
    href: 'https://migri.fi/en/residence-permit-for-studies',
    note: 'Nordic degree admission rules allowing mature applicants with verifiable career history and personal EUR 9,600 living funds.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study Gap Acceptable Countries for Bangladeshi Students 2027',
    description:
      'Compare study gap rules across 12 destinations for Bangladeshi students: Bachelor (2–5 yrs) & Master/PhD (5–10+ yrs) gap proofs, work records, and visa.',
    path: PATH,
    locale: 'en_BD',
    image: {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Study Gap Acceptable Countries for Bangladeshi Students — EduExpress International',
    },
  });
}

const STUDY_GAP_FAQS = [
  {
    question: 'How is a study gap calculated for Bangladeshi HSC, Diploma, and Bachelor graduates?',
    answer:
      'Embassies and international universities calculate your study gap from the official publication date (or passing year) on your latest completed academic certificate (HSC, Alim, A-Levels, 4-Year BTEB Diploma, or Bachelor’s degree) up to the intended intake month (e.g., March or September 2027). Because Bangladeshi public and National University students often experience session delays, many foreign universities look at the actual date on your provisional certificate or transcript rather than the exam year Title — provided your transcript clearly records the graduation date.',
  },
  {
    question: 'Which countries accept a 2 to 4 year study gap after HSC for Bachelor’s admission?',
    answer:
      'For undergraduate (Bachelor’s) applicants with a 2 to 3 year gap after HSC, China (self-funded and university scholarship tracks, provided the applicant is under age 25), Malaysia (both public and private universities via EMGS), the United Kingdom (with a Pre-CAS interview explanation), Hungary, Finland (via university entrance exam), and Cyprus are the most accessible destinations. Once an HSC gap reaches 4 to 5+ years, direct Bachelor’s visa risk rises sharply in Europe, making Malaysia, China foundation/language-to-degree routes, or BTEB Diploma-to-Bachelor transfer routes much safer.',
  },
  {
    question: 'Which countries accept a 5 to 10+ year study gap for Master’s and PhD applicants from Bangladesh?',
    answer:
      'Postgraduate (Master’s, MBA, MRes, and PhD) applicants enjoy far wider gap tolerance globally because work experience after a Bachelor’s degree is treated as professional progression rather than an idle gap. The UK, Finland, Malaysia, Hungary, China (under age 35 for Master’s and under 40 for PhD), and South Korea routinely accept 5 to 10+ years between a Bachelor’s and Master’s degree, provided the applicant supplies verifiable employment appointment letters, experience certificates, salary bank statements, or business trade licenses.',
  },
  {
    question: 'Why do fake job experience certificates or fake coaching computer diplomas cause visa refusals?',
    answer:
      'Many unscrupulous agencies in Dhaka advise students with a 3–5 year HSC gap to buy backdated IT diploma certificates or fabricated employment letters from local shops. Visa officers at UKVI, NDGAP (Hungary), Migri (Finland), and the Korean Embassy Dhaka verify employment claims by cross-checking salary deposits in the applicant’s personal bank statement, calling employer HR landlines, or requesting NBR tax records. Submitting a fabricated job certificate without matching bank salary credits can trigger a 5-to-10-year deception ban.',
  },
  {
    question: 'What legitimate documents are accepted to justify a study gap from Bangladesh?',
    answer:
      'Valid, verifiable gap evidence includes: (1) formal full-time or part-time employment (offer letter, NOC/experience certificate on official letterhead, and 6–12 months of bank statements showing salary credits); (2) self-employment or family business management (City Corporation/Union Parishad Trade License, TIN certificate, and business bank transactions); (3) documented enrollment in a Bangladeshi university (university ID card, registration card, and semester transcripts if transferring credits or restarting); or (4) verifiable medical treatment records from a recognized hospital.',
  },
  {
    question: 'How does EduExpress assess my study gap before I spend money on university fees?',
    answer:
      'EduExpress conducts a free Education Fit Assessment with BDT 0 file-opening charges. Our counselors audit your passing years, age, CGPA, IELTS/MOI status, and verifiable work/gap proofs against the live admission and embassy rules of all 12 destinations, giving you a written EduFit Decision Report that rules out high-risk visa routes before you pay a single taka.',
  },
];

export default async function StudyGapAcceptableCountriesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: '2026-11-27',
        name: 'Study Gap Acceptable Countries for Bangladeshi Students 2027 | 12-Country Visa Matrix',
        description:
          'Compare study gap rules across 12 destinations for Bangladeshi students: Bachelor (2–5 yrs) & Master/PhD (5–10+ yrs) gap proofs, work records, and visa.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og-image.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(STUDY_GAP_SOURCES),
      },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'Find Education', path: '/find-education' },
          { name: 'Study Gap Acceptable Countries' },
        ]}
        eyebrow="12-Country Study Gap & Age Limit Matrix · Bachelor, Master & PhD · Evidence-First Visa Rules"
        title="Study Gap Acceptable Countries for Bangladeshi Students 2027."
        lead="An honest, country-by-country breakdown of how much academic gap is realistically accepted for Bangladeshi HSC, Diploma, and Bachelor graduates across China, Malaysia, the UK, Hungary, Finland, South Korea, and Europe — and what verifiable documents embassies require to approve your visa."
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get My Free Study Gap Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/student-visa-bank-solvency-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Visa Bank Solvency Rules
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* Quick Summary Cards */}
      <section aria-label="Study gap tolerance summary" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <GraduationCap size={16} className="text-emerald-700" /> After HSC (Bachelor)
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">2 – 3 Years Optimal</p>
              <p className="mt-1 text-xs text-slate-600">Up to 4–5 years accepted in Malaysia, China &amp; select UK/EU routes with proof.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Briefcase size={16} className="text-emerald-700" /> After Bachelor (Master/PhD)
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">5 – 10+ Years Accepted</p>
              <p className="mt-1 text-xs text-slate-600">Treated as career progression when backed by salary trail &amp; employer NOC.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Clock size={16} className="text-emerald-700" /> Session Jam Rule (BD)
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Certificate Issue Date</p>
              <p className="mt-1 text-xs text-slate-600">National/Public university session delays explained via Controller letter.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <ShieldCheck size={16} className="text-emerald-700" /> Zero Deception Policy
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">100% Verifiable Proof</p>
              <p className="mt-1 text-xs text-slate-600">Never submit fake coaching/job letters; use authentic academic &amp; tax trails.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: 12-Country Study Gap & Age Limit Comparison Table */}
      <Section
        id="country-gap-matrix"
        tone="white"
        title="12-country study gap &amp; age limit matrix for Bangladeshi students (2027)."
        intro="Compare realistic undergraduate (post-HSC/Diploma) and postgraduate (post-Bachelor) gap limits alongside statutory age caps across all 12 EduExpress destinations."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[780px] border-collapse text-left text-[14px]">
            <caption className="sr-only">12-country study gap tolerance and age limits for Bangladeshi applicants</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-5 py-4 font-bold">Destination</th>
                <th className="px-5 py-4 font-bold">Bachelor Gap (After HSC)</th>
                <th className="px-5 py-4 font-bold">Master / PhD Gap (After Bachelor)</th>
                <th className="px-5 py-4 font-bold">Statutory Age Limit</th>
                <th className="px-5 py-4 font-bold">Required Gap Justification &amp; Guide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-china-from-bangladesh" className="hover:underline">China (Flagship)</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 3–5 Years</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 8–12 Years</td>
                <td className="px-5 py-4">UG &lt; 25 · Master &lt; 35 · PhD &lt; 40 (CSC)</td>
                <td className="px-5 py-4">Study plan, CV timeline, BTEB diploma or work certificate</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-malaysia-from-bangladesh" className="hover:underline">Malaysia</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 4–6 Years</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 10–15 Years</td>
                <td className="px-5 py-4">18 – 45 Years (EMGS eVAL rule)</td>
                <td className="px-5 py-4">CV &amp; work/study chronology; highest gap flexibility in Asia</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-uk-from-bangladesh" className="hover:underline">United Kingdom</Link>
                </td>
                <td className="px-5 py-4">Up to 2–3 Years</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 7–10+ Years</td>
                <td className="px-5 py-4">No strict upper age cap for PG</td>
                <td className="px-5 py-4">Verifiable employment NOC, salary bank credits &amp; Pre-CAS interview</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-hungary-from-bangladesh" className="hover:underline">Hungary</Link>
                </td>
                <td className="px-5 py-4">Up to 2–3 Years</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 5–8 Years</td>
                <td className="px-5 py-4">18+ by Aug 31 (Stipendium rule)</td>
                <td className="px-5 py-4">Pass online entrance exam + explain gap in consular interview</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-finland-from-bangladesh" className="hover:underline">Finland</Link>
                </td>
                <td className="px-5 py-4">Up to 3–5 Years</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 10+ Years</td>
                <td className="px-5 py-4">No age cap (Lifelong learning policy)</td>
                <td className="px-5 py-4">Pass UAS/University exam + clean €9,600 personal bank provenance</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-south-korea-from-bangladesh" className="hover:underline">South Korea</Link>
                </td>
                <td className="px-5 py-4">Up to 1–2 Years</td>
                <td className="px-5 py-4">Up to 4–6 Years</td>
                <td className="px-5 py-4">GKS: UG &lt; 25 · PG &lt; 40</td>
                <td className="px-5 py-4">Strict Dhaka Korean Embassy review; continuous study/work record required</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-cyprus-from-bangladesh" className="hover:underline">Cyprus (EU)</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 3–5 Years</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 6–8 Years</td>
                <td className="px-5 py-4">Typically under 30–35</td>
                <td className="px-5 py-4">MoFA attested certificates, police clearance &amp; CRMD solvency</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-malta-from-bangladesh" className="hover:underline">Malta</Link>
                </td>
                <td className="px-5 py-4">Up to 2–3 Years</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 6–8 Years</td>
                <td className="px-5 py-4">Flexible with career continuity</td>
                <td className="px-5 py-4">Employment reference + Identità Malta financial &amp; interview check</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-georgia-from-bangladesh" className="hover:underline">Georgia (MD/STEM)</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 3–4 Years</td>
                <td className="px-5 py-4">Up to 5–7 Years</td>
                <td className="px-5 py-4">Note BMDC 1-yr HSC gap limit for MBBS</td>
                <td className="px-5 py-4">For MD/MBBS, BMDC Bangladesh allows max 1–2 yr gap after HSC!</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-greece-from-bangladesh" className="hover:underline">Greece</Link>
                </td>
                <td className="px-5 py-4">Up to 2–3 Years</td>
                <td className="px-5 py-4">Up to 5–7 Years</td>
                <td className="px-5 py-4">Standard academic age range</td>
                <td className="px-5 py-4">Apostille/Consular attestation + Type D National Visa interview</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-croatia-from-bangladesh" className="hover:underline">Croatia</Link>
                </td>
                <td className="px-5 py-4">Up to 2–3 Years</td>
                <td className="px-5 py-4">Up to 5–7 Years</td>
                <td className="px-5 py-4">Standard academic age range</td>
                <td className="px-5 py-4">AZVO academic recognition + clean criminal record &amp; employment proof</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-thailand-from-bangladesh" className="hover:underline">Thailand</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 4–6 Years</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Up to 10+ Years</td>
                <td className="px-5 py-4">Flexible across AIT, Chula &amp; Mahidol</td>
                <td className="px-5 py-4">Non-Immigrant ED visa issued via Royal Thai Embassy Dhaka</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: Legitimate Gap Justification Documents vs Fake Agency Traps */}
      <Section
        id="gap-justification"
        tone="sage"
        title="How to legally document your study gap — and avoid deception bans."
        intro="A study gap is not an automatic visa refusal; an UNEXPLAINED or FALSIFIED study gap is."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <h3 className="text-[19px] font-bold text-petrol-800">4 Embassy-Verified Ways to Justify a Gap</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>1. Salaried Employment Trail:</strong> Appointment letter, Employee ID card, official NOC / Experience Certificate with HR landline &amp; domain email, plus at least 6 months of personal bank statements showing monthly salary deposits.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>2. University Enrollment / Credit Transfer Proof:</strong> If you enrolled in a Bangladeshi public, National, or private university after HSC and decided to study abroad 2–3 years later, submit your university registration card, student ID, and 1st/2nd-year transcripts showing you were actively studying.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>3. BTEB 4-Year Polytechnic Diploma:</strong> A 4-year Diploma-in-Engineering after SSC is an accredited academic qualification, not a study gap! You can apply directly for Bachelor’s or 2+2 top-up programs in China and Malaysia.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>4. Entrepreneurship / Family Business Role:</strong> Trade License naming the applicant (or partnership deed), NBR TIN/Tax Return, and corporate bank statement.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">3 Critical Gap Traps Bangladeshi Students Must Avoid</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Never Buy Fake "Cash-Salary" Job Certificates:</strong> Claiming you worked for 3 years and received salary "in cash" with zero bank trail or tax record is the #1 trigger for UKVI and Schengen credibility refusal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>BMDC Medical Licensing Gap Limit (MBBS Abroad):</strong> Even if a Chinese or Georgian medical university admits you with a 3-year HSC gap, the <strong>Bangladesh Medical &amp; Dental Council (BMDC)</strong> strictly requires your HSC passing year to be within the current or immediate preceding 1–2 academic years to issue an Eligibility Certificate for practicing medicine in Bangladesh!</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Hiding Previous Bangladeshi University Study:</strong> Concealing that you spent 2 years at a local university leaves an unexplained 2-year void on your CV. Showing your local enrollment transcripts honestly is far more credible than pretending you did a 2-year computer course.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: Best Pathways by Gap Profile */}
      <Section
        id="recommended-pathways"
        tone="white"
        title="Best study abroad pathways by Bangladeshi student profile."
        intro="Select the route that matches your exact graduation year and qualification."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className={kit.cardSage}>
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-petrol-800">2–3 Years After HSC</span>
            <h3 className="mt-4 text-[19px] font-bold text-petrol-800">China, Malaysia, UK &amp; Hungary</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              You remain eligible for Chinese Government &amp; university scholarships (under age 25), Malaysian top public/private universities, UK 3-year Bachelor’s (with IELTS 6.0+), and Hungarian state universities.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-xs font-bold text-petrol-800">
              <Link href="/study-in-china-from-bangladesh" className="hover:underline">→ Explore Study in China</Link>
              <Link href="/study-in-malaysia-from-bangladesh" className="hover:underline">→ Explore Study in Malaysia</Link>
            </div>
          </div>

          <div className={kit.cardSage}>
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-petrol-800">4-Year Polytechnic Diploma</span>
            <h3 className="mt-4 text-[19px] font-bold text-petrol-800">China Bachelor Transfer &amp; Malaysia</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              BTEB Diploma-in-Engineering holders can enter Chinese engineering and CS/AI Bachelor’s degrees (with tuition scholarships) or transfer credits to Malaysian technological universities.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-xs font-bold text-petrol-800">
              <Link href="/updates/china-diploma-to-bachelor-transfer-bangladesh" className="hover:underline">→ Read Diploma-to-Bachelor China Guide</Link>
              <Link href="/china-scholarships-bangladesh" className="hover:underline">→ View China Scholarships</Link>
            </div>
          </div>

          <div className={kit.cardSage}>
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-petrol-800">4–10+ Years After Bachelor’s</span>
            <h3 className="mt-4 text-[19px] font-bold text-petrol-800">UK, Finland, China &amp; Korea PG</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              Professionals with documented job history qualify for UK 1-year Master’s or MRes/PhD, Finland Type A continuous residence permits, China CSC Master/PhD (under 35/40), and Korean BK21 research labs.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-xs font-bold text-petrol-800">
              <Link href="/finland-student-visa-bangladesh" className="hover:underline">→ Read Finland Type A Visa Guide</Link>
              <Link href="/uk-student-visa-bangladesh" className="hover:underline">→ Read UK Student Visa Guide</Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 4: FAQs */}
      <FaqBlock
        items={STUDY_GAP_FAQS}
        title="Frequently asked questions about study gap rules from Bangladesh."
        tone="sage"
      />

      {/* Module 5: Official Sources & Disclaimer */}
      <Section id="sources" tone="white" title="Official regulatory sources &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2">
          {STUDY_GAP_SOURCES.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between rounded-2xl border border-petrol-800/15 bg-canvas-soft p-4 transition hover:border-petrol-800/40"
            >
              <div>
                <span className="flex items-center justify-between gap-2 text-xs font-bold text-petrol-800">
                  <span>{source.label}</span>
                  <ExternalLink size={13} className="shrink-0" aria-hidden="true" />
                </span>
                <p className="mt-1.5 text-[12px] leading-5 text-slate-600">{source.note}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-petrol-800/10 bg-canvas-soft p-5 text-xs leading-relaxed text-slate-600">
          <p>
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209 on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission, scholarship award, and visa issuance decisions rest solely with the respective universities and official embassy authorities.
          </p>
        </div>
      </Section>

      {/* Module 6: Assessment Form */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Free 1-Working-Day Profile Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Get Your Written Study Gap &amp; Country Fit Report</h2>
              <p className="mt-2 text-sm text-slate-600">
                Enter your passing year, GPA, and work history. Our Dhanmondi counselors will match you with the 3 safest country and university options with BDT 0 file-opening charges.
              </p>
            </div>
            <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm sm:p-10">
              <EducationFitAssessment />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
