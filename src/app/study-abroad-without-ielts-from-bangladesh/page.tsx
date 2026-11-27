import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Globe,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import MoiVisaMatcher from '@/components/calculators/MoiVisaMatcher';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/study-abroad-without-ielts-from-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const WITHOUT_IELTS_SOURCES = [
  {
    label: 'Campus China (Ministry of Education & China Scholarship Council — Language Proof Rules)',
    href: 'https://www.campuschina.org/',
    note: 'Official Chinese higher education portal detailing English Medium of Instruction (MOI) acceptance, university online interview waivers, and HSK/Chinese foundation tracks.',
  },
  {
    label: 'UK Visas and Immigration (UKVI) — Knowledge of English & Higher Education Provider (HEP) Assessment',
    href: 'https://www.gov.uk/student-visa/knowledge-of-english',
    note: 'Statutory UK Home Office rule permitting licensed UK Student Sponsor universities with a track record of compliance to make their own CEFR B2 English assessment on the CAS.',
  },
  {
    label: 'Studyinfo.fi (Opintopolku — International UAS Exam & Language Waivers in Finland)',
    href: 'https://www.uasinfo.fi/international-uas-exam/',
    note: 'Official Finnish Universities of Applied Sciences joint entrance examination assessing English proficiency directly inside the digital admission exam.',
  },
  {
    label: 'Education Malaysia Global Services (EMGS) — Conditional English Entry & MUET Rules',
    href: 'https://educationmalaysia.gov.my/',
    note: 'Malaysian statutory student pass guidelines governing MOI evaluation and university-delivered English preparatory tracks.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study Abroad Without IELTS from Bangladesh 2027 | MOI Guide',
    description:
      'Compare study abroad without IELTS options for Bangladeshi students across 12 countries: MOI acceptance, internal English tests, Duolingo, PTE & embassy.',
    path: PATH,
    locale: 'en_BD',
    image: {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Study Abroad Without IELTS from Bangladesh — EduExpress International',
    },
  });
}

const WITHOUT_IELTS_FAQS = [
  {
    question: 'Can Bangladeshi students genuinely study abroad without IELTS in 2027?',
    answer:
      'Yes, provided you understand the exact legal substitute required by both the foreign university AND the embassy. "Without IELTS" never means "without knowing English." It means substituting the IELTS test with one of four legally recognized alternatives: (1) an official Medium of Instruction (MOI) Certificate confirming your previous HSC (English Version/A-Levels) or 4-year Bangladeshi Bachelor’s degree was taught and examined 100% in English; (2) passing the foreign university’s own live online English placement exam and video interview; (3) taking an alternative faster test such as PTE Academic, Duolingo English Test (DET), or Linguaskill; or (4) enrolling in a 1-year Host-Country Language Foundation (such as Chinese HSK Foundation in China).',
  },
  {
    question: 'Why do some students with a university MOI Offer Letter still get refused at the embassy visa interview?',
    answer:
      'This is the #1 trap in Bangladesh: University Admission and Embassy Visa Issuance are governed by two separate authorities. Even if a private college in Europe issues an offer letter based on a Bangladeshi MOI certificate, the consular visa officer (at VFS / New Delhi or Dhaka Embassy) conducts a live spoken interview or enforces statutory immigration language rules. If an applicant holding an MOI certificate cannot answer basic academic questions about their course modules in fluent spoken English during the consular interview, the visa is refused immediately on credibility grounds.',
  },
  {
    question: 'Which countries are safest for Bangladeshi students applying without IELTS (using MOI or University Interview)?',
    answer:
      'For both university admission AND visa approval without an IELTS score, the four most reliable destinations for Bangladeshi students are: (1) China — Chinese universities and the Chinese Visa Application Service Center in Dhaka officially accept English MOI certificates + live university video interviews for English-taught Bachelor’s, Master’s, PhD, and MBBS (or require zero IELTS for Chinese-medium/foundation routes); (2) Malaysia — Malaysian universities accept English-medium Bachelor MOI or conduct internal placement tests under EMGS rules; (3) Hungary (Self-Funded Track) — Hungarian public universities (Debrecen, Pécs, Szeged) assess your English directly during their live Skype/Zoom faculty entrance exam; and (4) Georgia — NCEQE and Georgian universities verify English via a recorded Zoom admission interview.',
  },
  {
    question: 'How does studying in the UK without IELTS work for Bangladeshi students?',
    answer:
      'Under UKVI Student Route rules, degree-level UK universities with a "track record of compliance" are legally authorized to assess a student’s CEFR B2 English proficiency themselves and state on the CAS that they have assessed your English. Several UK universities accept Bangladeshi applicants without IELTS if you: (a) graduated within the last 2 to 5 years from a UGC-recognized Bangladeshi public or top private university (e.g., DU, BUET, NSU, BRACU, IUB, AIUB, EWU) with an official MOI certificate, OR scored 70%–80%+ in HSC English, AND (b) pass the UK university’s internal online Password/Oxford ELLT test and Pre-CAS spoken credibility interview.',
  },
  {
    question: 'Can I apply for Bachelor’s in Finland without IELTS through the International UAS Exam?',
    answer:
      'Yes, for Bachelor’s degrees at Finnish Universities of Applied Sciences (UAS). In Finland’s Joint Application on Studyinfo.fi, many UAS institutions verify your English proficiency directly through the written and spoken sections of the online International UAS Entrance Exam, waiving the need for a separate IELTS certificate. However, for Master’s programs at Finnish Research Universities, an official IELTS (6.5+), PTE, or TOEFL score is almost always mandatory.',
  },
  {
    question: 'Does EduExpress verify whether my MOI certificate will pass both the university and the embassy?',
    answer:
      'Yes. During our free Education Fit Assessment (BDT 0 file-opening fee), our Dhanmondi counselors check your specific Bangladeshi school/university MOI against both institutional admission rules and current embassy consular standards, and conduct a mock spoken English check before recommending any no-IELTS route.',
  },
];

export default async function StudyAbroadWithoutIeltsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: '2026-11-27',
        name: 'Study Abroad Without IELTS from Bangladesh 2027: 12-Country MOI & Visa Matrix',
        description:
          'Compare study abroad without IELTS options for Bangladeshi students across 12 countries: MOI acceptance, internal English tests, Duolingo, PTE & embassy.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og-image.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(WITHOUT_IELTS_SOURCES),
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
          { name: 'Study Abroad Without IELTS' },
        ]}
        eyebrow="12-Country MOI & IELTS Alternative Matrix · University vs Embassy Rules · Evidence-First Guide"
        title="Study Abroad Without IELTS from Bangladesh 2027."
        lead="A transparent, country-by-country verification of where Bangladeshi students can genuinely study without an IELTS certificate — separating universities that accept Medium of Instruction (MOI) or online faculty interviews from embassies that strictly enforce IELTS or TOPIK at the visa counter."
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check My No-IELTS / MOI Eligibility <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/study-in-china-without-ielts" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              China Without-IELTS Deep Dive
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* Interactive MOI vs Embassy Visa Matcher */}
      <Section
        id="moi-visa-matcher"
        tone="sage"
        title="Test your MOI or alternative English proof across all 12 destinations."
        intro="Select your target degree level and current English evidence to separate destinations where MOI is accepted at both the university and visa counter from those requiring an online entrance exam or PTE/IELTS."
      >
        <MoiVisaMatcher />
      </Section>

      {/* Module 1: 12-Country MOI & No-IELTS Visa Matrix */}
      <Section
        id="country-moi-matrix"
        tone="white"
        title="12-country MOI &amp; no-IELTS acceptance matrix for Bangladeshi students (2027)."
        intro="Compare how each destination treats Medium of Instruction (MOI) certificates at the university offer stage versus the embassy visa stage."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[820px] border-collapse text-left text-[14px]">
            <caption className="sr-only">12-country MOI and no-IELTS university and embassy rules for Bangladeshi students</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-5 py-4 font-bold">Destination</th>
                <th className="px-5 py-4 font-bold">University MOI Acceptance</th>
                <th className="px-5 py-4 font-bold">Embassy Visa Stage Rule</th>
                <th className="px-5 py-4 font-bold">Accepted IELTS Substitute</th>
                <th className="px-5 py-4 font-bold">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-china-without-ielts" className="hover:underline">China (Flagship)</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">High (UG, PG &amp; MBBS)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Accepted for X1/X2 Visa</td>
                <td className="px-5 py-4">MOI + Uni Video Interview / Duolingo / Chinese Yr</td>
                <td className="px-5 py-4">Best no-IELTS scholarship &amp; degree route from BD</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-malaysia-from-bangladesh" className="hover:underline">Malaysia</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">High (Private &amp; Select Public)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Accepted for EMGS eVAL</td>
                <td className="px-5 py-4">Bachelor MOI / Internal Test / On-Campus IEP</td>
                <td className="px-5 py-4">Verify program MQA requirement before applying</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-uk-from-bangladesh" className="hover:underline">United Kingdom</Link>
                </td>
                <td className="px-5 py-4">Selective (Recognized BD Unis)</td>
                <td className="px-5 py-4">Accepted if HEP certifies B2 on CAS</td>
                <td className="px-5 py-4">Approved BD Uni MOI + Internal Test + Pre-CAS</td>
                <td className="px-5 py-4">PTE / OIETC / IELTS 6.0 still fastest for broad choice</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-hungary-from-bangladesh" className="hover:underline">Hungary</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">High (Self-Funded Track)</td>
                <td className="px-5 py-4">Tested in Live Consular Interview</td>
                <td className="px-5 py-4">University Skype/Zoom Oral Entrance Exam + MOI</td>
                <td className="px-5 py-4">Take IELTS 6.0+ if applying for SHED Stipendium</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-finland-from-bangladesh" className="hover:underline">Finland</Link>
                </td>
                <td className="px-5 py-4">UAS Bachelor Exam Only</td>
                <td className="px-5 py-4">Accepted if admitted via UAS Exam</td>
                <td className="px-5 py-4">International UAS Entrance Exam (Bachelor’s)</td>
                <td className="px-5 py-4">Master’s applicants should take IELTS 6.5 / PTE 62</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-georgia-from-bangladesh" className="hover:underline">Georgia (MD/STEM)</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">High (Zoom Assessment)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Accepted for D3 Visa</td>
                <td className="px-5 py-4">Recorded University Zoom English Interview + MOI</td>
                <td className="px-5 py-4">Ensure strong spoken English for recorded interview</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-malta-from-bangladesh" className="hover:underline">Malta</Link>
                </td>
                <td className="px-5 py-4">Moderate (Private HEIs)</td>
                <td className="px-5 py-4">Strict Identità Video Interview</td>
                <td className="px-5 py-4">MOI + Internal Placement Test (at select colleges)</td>
                <td className="px-5 py-4">IELTS 5.5–6.0 / PTE strongly recommended for CVU</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-greece-from-bangladesh" className="hover:underline">Greece</Link>
                </td>
                <td className="px-5 py-4">Moderate (MOI + Faculty Call)</td>
                <td className="px-5 py-4">Tested at Consular Interview</td>
                <td className="px-5 py-4">English-Medium Bachelor MOI or B2 Certificate</td>
                <td className="px-5 py-4">Check specific HAHE department language rule</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-croatia-from-bangladesh" className="hover:underline">Croatia</Link>
                </td>
                <td className="px-5 py-4">Moderate (Entrance Interview)</td>
                <td className="px-5 py-4">Accepted with University B2 Proof</td>
                <td className="px-5 py-4">University English Entrance Test / MOI</td>
                <td className="px-5 py-4">Medical MD faculties test English &amp; Science directly</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-thailand-from-bangladesh" className="hover:underline">Thailand</Link>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-800">High (Placement Test / MOI)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">Accepted at Dhaka Thai Embassy</td>
                <td className="px-5 py-4">University English Test (e.g. CU-TEP / TU-GET) or MOI</td>
                <td className="px-5 py-4">Ideal for fast regional admission without IELTS</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-south-korea-from-bangladesh" className="hover:underline">South Korea</Link>
                </td>
                <td className="px-5 py-4 text-amber-900">Low (Strict IEQAS Rule)</td>
                <td className="px-5 py-4 text-amber-900">IELTS 5.5+ or TOPIK 3+ Required</td>
                <td className="px-5 py-4">Only select Graduate STEM Labs waive via Professor</td>
                <td className="px-5 py-4">Do NOT apply for Korea UG without IELTS or TOPIK</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/study-in-cyprus-from-bangladesh" className="hover:underline">Cyprus (EU Republic)</Link>
                </td>
                <td className="px-5 py-4 text-amber-900">Low (Statutory CRMD Rule)</td>
                <td className="px-5 py-4 text-amber-900">IELTS 5.5+ / GCSE Mandatory</td>
                <td className="px-5 py-4">Official IELTS 5.5+ required for CRMD Blue Slip</td>
                <td className="px-5 py-4">Avoid fake "No-IELTS Northern Cyprus" traps</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: 4 Legitimate Alternatives to IELTS */}
      <Section
        id="ielts-alternatives"
        tone="sage"
        title="Four legitimate ways to satisfy English requirements without IELTS."
        intro="If you have not taken IELTS yet, use one of these four official pathways rather than risking an unverified shortcut."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-petrol-800">Option 01 · Medium of Instruction (MOI)</span>
            <h3 className="mt-4 text-[19px] font-bold text-petrol-800">Official University or College MOI Certificate</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              Issued on official letterhead by the Registrar or Principal of your Bangladeshi institution stating that your entire curriculum and examinations were conducted in English. Widely accepted for Master’s applications in China, Malaysia, Hungary, Thailand, and select UK universities.
            </p>
          </div>

          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-petrol-800">Option 02 · Direct University Entrance Exam</span>
            <h3 className="mt-4 text-[19px] font-bold text-petrol-800">Live Faculty Video Interview &amp; Online Placement</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              Universities in China, Hungary (Debrecen, Pécs, Szeged), Finland (International UAS Exam), Georgia, and Croatia conduct their own proctored online written test and 15-to-20-minute Zoom/Skype oral interview to certify your CEFR B2 English level directly.
            </p>
          </div>

          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-petrol-800">Option 03 · Fast 48-Hour Alternative Tests</span>
            <h3 className="mt-4 text-[19px] font-bold text-petrol-800">PTE Academic, Duolingo (DET) &amp; Oxford ELLT</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              If your target university or embassy requires a standardized score but IELTS dates in Dhaka are full, PTE Academic (results in 24–48 hours, accepted by UKVI, Finland, Malaysia, and Europe) or the Duolingo English Test (accepted by many Chinese and European programs) provides a rapid solution.
            </p>
          </div>

          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-petrol-800">Option 04 · Host-Country Language Year</span>
            <h3 className="mt-4 text-[19px] font-bold text-petrol-800">1-Year Chinese (HSK) or Preparatory Foundation</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              In China (including the <Link href="/china-march-2027-intake" className="font-bold text-petrol-800 underline">March 2027 Language &amp; Foundation Intake</Link>), students can enroll in a 1-year Chinese Language or Pre-University Foundation program with zero IELTS or HSK required upfront, progressing directly into scholarship Bachelor’s degrees.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 3: FAQs */}
      <FaqBlock
        items={WITHOUT_IELTS_FAQS}
        title="Frequently asked questions about studying abroad without IELTS."
        tone="white"
      />

      {/* Module 4: Official Sources & Disclaimer */}
      <Section id="sources" tone="sage" title="Official regulatory sources &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2">
          {WITHOUT_IELTS_SOURCES.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between rounded-2xl border border-petrol-800/15 bg-white p-4 transition hover:border-petrol-800/40"
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

        <div className="mt-6 rounded-2xl border border-petrol-800/10 bg-white p-5 text-xs leading-relaxed text-slate-600">
          <p>
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209 on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Language proficiency waivers are subject to individual university and embassy regulations and are never universal. Final admission, scholarship award, and visa issuance decisions rest solely with the respective universities and official embassy authorities.
          </p>
        </div>
      </Section>

      {/* Module 5: Assessment Form */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Free MOI &amp; English Pathway Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Which Universities Accept Your MOI or English Level</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your latest qualification, Bangladeshi school/university name, and target destination. Our Dhanmondi team will verify your MOI acceptance and embassy interview readiness within one working day.
              </p>
            </div>
            <div className="rounded-3xl border border-rule bg-canvas-soft p-6 shadow-sm sm:p-10">
              <EducationFitAssessment />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
