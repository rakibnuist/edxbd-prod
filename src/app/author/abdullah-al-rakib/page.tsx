import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Globe,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/author/abdullah-al-rakib';
const canonical = `${SITE}${PATH}`;
const PERSON_ID = `${canonical}#person`;
export const revalidate = 3600;

const AUTHOR_VERIFICATION_SOURCES = [
  {
    label: 'Nanjing University of Information Science & Technology (NUIST — Double First-Class University, China)',
    href: 'https://en.nuist.edu.cn/',
    note: 'Chinese Double First-Class discipline university in Nanjing, Jiangsu where Abdullah Al Rakib conducts doctoral research in Computer Application Technology.',
  },
  {
    label: 'China Bangladesh Consultancy Alliance (CBCA) — Founding Member Directory (#08)',
    href: 'https://cbcabd.org/',
    note: 'Industry alliance promoting ethical, transparent student recruitment between Bangladesh and Chinese higher education institutions.',
  },
  {
    label: 'Foreign Admission & Career Development Consultants Association of Bangladesh (FACD-CAB — Member #2264 / FCM-452)',
    href: 'https://www.facdcab.org/members/directory/2264',
    note: 'Official Bangladeshi trade association directory record for EduExpress International (Dhanmondi, Dhaka).',
  },
  {
    label: 'Campus China (Ministry of Education & China Scholarship Council Official Portal)',
    href: 'https://www.campuschina.org/',
    note: 'Primary regulatory authority referenced across Abdullah Al Rakib’s CSC scholarship and Chinese university admission audits.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Abdullah Al Rakib — Founder & CEO | EduExpress Bangladesh',
    description:
      'Academic profile and editorial governance record of Abdullah Al Rakib, Founder & CEO of EduExpress International and PhD Researcher at NUIST, Nanjing.',
    path: PATH,
    locale: 'en_BD',
    image: {
      url: '/images/team/abdullah-al-rakib.webp',
      width: 800,
      height: 1000,
      alt: 'Abdullah Al Rakib — Founder & CEO of EduExpress International',
    },
  });
}

const AUTHOR_FAQS = [
  {
    question: 'What is Abdullah Al Rakib’s academic and professional background in international higher education?',
    answer:
      'Abdullah Al Rakib is the Founder and Chief Executive Officer of EduExpress International (established 8 March 2018) and a PhD Researcher in Computer Application Technology at Nanjing University of Information Science & Technology (NUIST) in Nanjing, China. He holds a Master of Science (M.Sc.) in Artificial Intelligence and a Bachelor of Science (B.Sc.) in Microelectronics Engineering. Combining over eight years of hands-on university partnership governance in China and Bangladesh with active doctoral research on a Chinese Double First-Class campus, he leads EduExpress’s evidence-first admissions and editorial verification standards.',
  },
  {
    question: 'How does Abdullah Al Rakib verify the tuition, scholarship, and visa guides published on EduExpress?',
    answer:
      'Every destination pillar, cost guide, scholarship manual, and university profile reviewed by Abdullah Al Rakib is audited against six mandatory checks under The Better Education Standard: (1) official accreditation verification (e.g., China MOE, BMDC, MQA, UKVI, CYQAA, MFHEA, NCEQE, HAHE, AZVO); (2) exact curriculum and entry-requirement matching; (3) realistic career and licensing pathways without job-guarantee language; (4) complete first-year and total cost itemization separating university/embassy fees from EduExpress charges; (5) statutory visa solvency rules verified against primary government portals; and (6) dated source records with a 90-day re-verification schedule.',
  },
  {
    question: 'Why did Abdullah Al Rakib establish the "Visa-First, Costs in Writing" policy at EduExpress?',
    answer:
      'Bangladeshi students and parents frequently lose money to unverified consultancies that charge non-refundable upfront "file-opening fees" or promise "100% guaranteed scholarships and visas." To eliminate financial opacity, Abdullah Al Rakib instituted EduExpress’s signature governance rule: BDT 0 file-opening charges across all 12 destinations, a 1-page itemized ClearCost Sheet before any student proceeds, BDT 0 consultancy service fee for Malaysia and the United Kingdom (UK), and 100% of EduExpress’s service fee for China (BDT 200,000) and other European destinations (BDT 100,000) payable strictly after visa approval.',
  },
  {
    question: 'Can students and parents book an academic fit consultation with EduExpress’s Dhanmondi team?',
    answer:
      'Yes. Prospective students and parents can request a free Education Fit Assessment online or visit the EduExpress International headquarters at Evergreen Latif, House 12/1, Road 4/A (Ground Floor), Dhanmondi, Dhaka 1209 from Saturday to Thursday (11:30 AM to 6:00 PM; Friday closed). Complex STEM, Master’s/PhD research, and Chinese university scholarship files are directly overseen under Abdullah Al Rakib’s editorial and academic framework.',
  },
];

const authoredClusters = [
  {
    category: 'China Flagship Research & Guides',
    items: [
      { label: 'Study in China from Bangladesh (2027 Master Pillar)', href: '/study-in-china-from-bangladesh', note: 'Complete admission, CSCA, cost & X1/X2 visa architecture' },
      { label: 'China Study Data & Cost Benchmark Report', href: '/china-study-report-bangladesh', note: 'Open dataset across 354+ Chinese universities (306+ CSC-designated) & 2,000+ programs' },
      { label: 'CSC Scholarship Bangladesh Guide (Type A & Type B)', href: '/csc-scholarship-bangladesh', note: 'Stipends, age caps, agency numbers & pre-admission rules' },
      { label: 'MBBS in China for Bangladeshi Students (45 MOE List)', href: '/mbbs-in-china-bangladesh', note: 'MOE English-medium universities & BMDC RQE rules' },
      { label: 'BMDC Recognized Medical Colleges Abroad (RQE & 45 MOE Guide)', href: '/bmdc-recognized-medical-colleges-abroad', note: 'Eligibility Certificate, WDOMS/WFME & 4-country medical comparison' },
      { label: 'Bangladesh Private Medical vs China MBBS Comparison', href: '/bangladesh-vs-china-mbbs', note: 'MOHFW gazetted fees vs Chinese public medical universities' },
      { label: 'China March 2027 Intake (Language, Foundation & Degree)', href: '/china-march-2027-intake', note: 'Spring intake deadlines & fast-track foundation pathways' },
    ],
  },
  {
    category: '12-Country Cross-Border Decision Guides',
    items: [
      { label: 'Study Gap Acceptable Countries for Bangladeshi Students', href: '/study-gap-acceptable-countries-bangladesh', note: '12-country Bachelor & Master/PhD gap & age matrix' },
      { label: 'Student Visa Bank Solvency & Bangladesh Bank Student File Guide', href: '/student-visa-bank-solvency-bangladesh', note: 'FE Circular 37, maturity days & sponsor rules across 12 countries' },
      { label: 'Study Abroad Without IELTS from Bangladesh (MOI Matrix)', href: '/study-abroad-without-ielts-from-bangladesh', note: 'University MOI acceptance vs embassy visa stage rules' },
      { label: 'Document Attestation, MOFA e-Apostille & Notarization Guide', href: '/document-attestation-apostille-bangladesh', note: 'Board, MoE/UGC, myGov e-Apostille & Embassy legalization workflow' },
      { label: 'The Better Education Standard (6-Point Verification)', href: '/better-education-standard', note: 'How EduExpress audits recognition, costs & visa readiness' },
      { label: 'How We Verify Universities & Official Registries', href: '/how-we-verify-universities', note: 'Primary source verification methodology' },
      { label: 'Fees, University Costs & Itemised ClearCost Breakdown', href: '/fees-and-transparency', note: 'Written fee separation & visa-first payment terms' },
    ],
  },
  {
    category: 'Europe, UK & Asia Visa & Scholarship Manuals',
    items: [
      { label: 'Malaysia Scholarships & Merit Waivers Guide', href: '/malaysia-scholarships-bangladesh', note: 'MTCP, MIS, Sunway/Taylor’s/APU/Monash waivers & BDT 0 service fee' },
      { label: 'UK Student Visa & 28-Day Financial Rules', href: '/uk-student-visa-bangladesh', note: 'CAS, £13,347/£10,224 maintenance, IOM TB & VFS' },
      { label: 'UK Scholarships for Bangladeshi Students', href: '/uk-scholarships-bangladesh', note: 'Chevening, Commonwealth, GREAT £10k & automatic bursaries' },
      { label: 'Hungary Scholarships (Stipendium Hungaricum & SHED)', href: '/hungary-scholarships-bangladesh', note: 'Dual-portal DreamApply + SHED Bangladesh nomination' },
      { label: 'South Korea Scholarships (GKS, BK21 & Merit Waivers)', href: '/south-korea-scholarships-bangladesh', note: 'Embassy vs University track & STEM professor lab funding' },
      { label: 'Finland Student Residence Permit (Migri €9,600 Rule)', href: '/finland-student-visa-bangladesh', note: 'Sole student account provenance, Enter Finland & Type A' },
      { label: 'Finland Scholarships (100% + €5,000 & UAS Waivers)', href: '/finland-scholarships-bangladesh', note: 'National Finland Scholarship & 55–60 ECTS renewal rules' },
    ],
  },
];

export default function AbdullahAlRakibAuthorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${canonical}#profilepage`,
        url: canonical,
        mainEntityOfPage: canonical,
        name: 'Abdullah Al Rakib — Founder & CEO, EduExpress International',
        description:
          'Academic profile, credentials, and editorial governance record of Abdullah Al Rakib, Founder & CEO of EduExpress International and PhD Researcher at NUIST, China.',
        inLanguage: 'en-BD',
        datePublished: '2026-11-15T00:00:00Z',
        dateModified: '2026-11-27T00:00:00Z',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        mainEntity: { '@id': PERSON_ID },
        primaryImageOfPage: primaryImageOfPageSchema('/images/team/abdullah-al-rakib.webp'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(AUTHOR_VERIFICATION_SOURCES),
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Abdullah Al Rakib',
        jobTitle: 'Founder and CEO',
        url: canonical,
        image: `${SITE}/images/team/abdullah-al-rakib.webp`,
        description:
          'Founder & CEO of EduExpress International (Dhanmondi, Dhaka) since 2018 and PhD Researcher in Computer Application Technology at Nanjing University of Information Science & Technology (NUIST), China.',
        worksFor: { '@id': `${SITE}/#organization` },
        alumniOf: [
          {
            '@type': 'CollegeOrUniversity',
            name: 'Nanjing University of Information Science & Technology (NUIST)',
            url: 'https://en.nuist.edu.cn/',
          },
        ],
        affiliation: [
          {
            '@type': 'CollegeOrUniversity',
            name: 'Nanjing University of Information Science & Technology (NUIST)',
            url: 'https://en.nuist.edu.cn/',
          },
          {
            '@type': 'Organization',
            name: 'China Bangladesh Consultancy Alliance (CBCA)',
            url: 'https://cbcabd.org/',
          },
          {
            '@type': 'Organization',
            name: 'Foreign Admission & Career Development Consultants Association of Bangladesh (FACD-CAB)',
            url: 'https://www.facdcab.org/members/directory/2264',
          },
        ],
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Doctoral Research (PhD)',
            name: 'PhD Researcher in Computer Application Technology — Nanjing University of Information Science & Technology (NUIST), China',
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Postgraduate Degree',
            name: 'Master of Science (M.Sc.) in Artificial Intelligence',
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Undergraduate Degree',
            name: 'Bachelor of Science (B.Sc.) in Microelectronics Engineering',
          },
        ],
        knowsAbout: [
          'Higher Education in China for Bangladeshi Students',
          'Chinese Government Scholarship (CSC) Governance',
          'China Scholastic Competency Assessment (CSCA)',
          'BMDC Foreign Medical Eligibility and RQE Licensing',
          'Bangladesh Bank Student File Foreign Exchange Compliance',
          'European and Asian Student Visa Financial Auditing',
        ],
        knowsLanguage: ['bn', 'en', 'zh'],
        sameAs: [
          'https://www.linkedin.com/company/eduexpressint',
          'https://www.facdcab.org/members/directory/2264',
          'https://cbcabd.org/',
        ],
      },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'About Us', path: '/about' },
          { name: 'Abdullah Al Rakib' },
        ]}
        eyebrow="Founder & CEO · PhD Researcher at NUIST, Nanjing · Chief Editorial Reviewer"
        title="Abdullah Al Rakib."
        lead="Founder and Chief Executive Officer of EduExpress International (since 8 March 2018) and PhD Researcher in Computer Application Technology at Nanjing University of Information Science & Technology (NUIST), China. Architect of The Better Education Standard and Bangladesh’s written ClearCost study-abroad governance model."
        reviewed="27 November 2026"
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Request an Education Fit Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/better-education-standard" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              The Better Education Standard
            </Link>
            <Link href="/about" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              Meet the Full Dhanmondi Team
            </Link>
          </>
        }
        aside={
          <figure className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-petrol-800/15 bg-petrol-800 shadow-md">
            <div className="relative aspect-[4/5]">
              <Image
                src="/images/team/abdullah-al-rakib.webp"
                alt="Abdullah Al Rakib — Founder & CEO of EduExpress International"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 380px"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="bg-petrol-800 px-5 py-4 text-white">
              <p className="font-display text-lg font-bold text-lime">Abdullah Al Rakib</p>
              <p className="text-xs text-white/85">Founder &amp; CEO, EduExpress International · PhD Researcher (NUIST, China)</p>
            </figcaption>
          </figure>
        }
      />

      <TrustBar />

      {/* Module 1: Verified Academic & Institutional Credentials */}
      <Section
        id="credentials"
        tone="white"
        title="Verified academic &amp; institutional credentials."
        intro="In a sector where many commercial agents have never studied at an overseas research university, EduExpress’s editorial and admissions policies are led by active STEM scholarship and on-campus experience in China."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className={kit.cardSage}>
            <span className={kit.iconLime}><GraduationCap size={22} aria-hidden="true" /></span>
            <h3 className="mt-5 text-[18px] font-bold text-petrol-800">PhD Researcher (NUIST, China)</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              Doctoral Researcher in Computer Application Technology at <strong>Nanjing University of Information Science &amp; Technology (NUIST)</strong>, a Chinese Double First-Class discipline university in Nanjing, Jiangsu.
            </p>
          </div>

          <div className={kit.cardSage}>
            <span className={kit.iconLime}><Award size={22} aria-hidden="true" /></span>
            <h3 className="mt-5 text-[18px] font-bold text-petrol-800">M.Sc. in AI &amp; B.Sc. in Microelectronics</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              Holds a <strong>Master of Science in Artificial Intelligence</strong> and a <strong>Bachelor of Science in Microelectronics Engineering</strong>, bringing rigorous technical evaluation to STEM, CS, and medical program shortlisting.
            </p>
          </div>

          <div className={kit.cardSage}>
            <span className={kit.iconLime}><Building2 size={22} aria-hidden="true" /></span>
            <h3 className="mt-5 text-[18px] font-bold text-petrol-800">China &amp; BD Operations Since 2018</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              Entered international university admissions on <strong>8 March 2018</strong>, formed <strong>Wuxi Haiying Culture and Art Consulting Co., Ltd.</strong> in China (2019), and leads our Dhanmondi 4/A headquarters in Dhaka.
            </p>
          </div>

          <div className={kit.cardSage}>
            <span className={kit.iconLime}><ShieldCheck size={22} aria-hidden="true" /></span>
            <h3 className="mt-5 text-[18px] font-bold text-petrol-800">CBCA (#08) &amp; FACD-CAB (FCM-452)</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              Represents EduExpress as <strong>Founding Member (#08)</strong> of the China Bangladesh Consultancy Alliance (CBCA) and verified member (<strong>FCM-452 / #2264</strong>) of FACD-CAB.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 2: Editorial Governance & The Better Education Standard */}
      <Section
        id="editorial-standard"
        tone="sage"
        title="How Abdullah Al Rakib reviews and verifies every EduExpress guide."
        intro="Because overseas education decisions involve a family’s life savings and a student’s legal immigration record (YMYL), no guide goes live on eduexpressint.com without passing our four-part editorial audit."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: '1. Primary Government & Accreditation Source Verification',
              body: 'Every visa solvency figure, scholarship stipend, and medical licensing rule is cross-checked directly against statutory authorities — including Campus China (CSC/MOE), BMDC Bangladesh, Bangladesh Bank (FE Circular 37), UKVI, Migri Finland, NDGAP Hungary, NIIED South Korea, EMGS Malaysia, Identità Malta, CRMD Cyprus, NCEQE Georgia, HAHE Greece, AZVO/MUP Croatia, and the Royal Thai Embassy Dhaka.',
            },
            {
              title: '2. Strict Separation of Official Fees vs EduExpress Charges',
              body: 'Guides must never blur third-party university or embassy charges with consultancy service fees. Every cost guide states the planning exchange rate baseline (CNY, GBP, EUR, USD, MYR, KRW, HUF, THB to BDT) and distinguishes direct institutional remittances from EduExpress’s post-visa service package.',
            },
            {
              title: '3. Zero Unverifiable Promises or Deceptive Shortcuts',
              body: 'Under Abdullah Al Rakib’s editorial mandate, EduExpress content strictly prohibits "100% visa guarantee" language, fake cash-salary study gap schemes, borrowed bank "show-money" loans, or unrecognized territorial claims (such as promoting Northern Cyprus as the EU or selling Croatia around border transit).',
            },
            {
              title: '4. On-Campus Reality & Quarterly Re-Verification Cycle',
              body: 'From hostel conditions, halal food availability, and HSK/CSCA examination readiness in China to part-time work restrictions in Europe and Asia, guides reflect lived campus reality and carry an explicit Last Verified Date and 90-day review schedule.',
            },
          ].map((rule) => (
            <div key={rule.title} className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-1 shrink-0 text-emerald-700" />
                <div>
                  <h3 className="text-[19px] font-bold text-petrol-800">{rule.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">{rule.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Module 3: Authored & Reviewed Research Library */}
      <Section
        id="authored-guides"
        tone="white"
        title="Key research reports &amp; guides authored or reviewed by Abdullah Al Rakib."
        intro="Explore our core evidence-first guides across China, Europe, the UK, and Asia."
      >
        <div className="space-y-10">
          {authoredClusters.map((cluster) => (
            <div key={cluster.category}>
              <h3 className="text-lg font-bold text-petrol-800 border-b border-canvas-soft pb-3">{cluster.category}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cluster.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex flex-col justify-between rounded-2xl border border-petrol-800/10 bg-canvas-soft p-5 transition hover:border-petrol-800 hover:bg-white hover:shadow-xs"
                  >
                    <div>
                      <p className="text-[15.5px] font-bold text-petrol-800 group-hover:underline">{item.label}</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-600">{item.note}</p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-800">
                      Read verified guide <ArrowRight size={13} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Module 4: FAQs */}
      <FaqBlock
        items={AUTHOR_FAQS}
        title="Frequently asked questions about our founder &amp; editorial governance."
        tone="sage"
      />

      {/* Module 5: Official Institutional & Association Links */}
      <Section id="sources" tone="white" title="Institutional affiliations &amp; verification records.">
        <div className="grid gap-4 sm:grid-cols-2">
          {AUTHOR_VERIFICATION_SOURCES.map((source) => (
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
      </Section>

      <CtaBand
        title="Want your study abroad plan reviewed with the costs in writing?"
        text="Share your academic results, target country, and budget. Our Dhanmondi counseling desk prepares your written EduFit Decision Report and ClearCost Sheet within one working day — with BDT 0 file-opening charges."
      />
    </article>
  );
}
