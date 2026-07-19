import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Languages,
  Microscope,
  PlaneTakeoff,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
} from 'lucide-react';
import ChinaCampaignLeadForm from '@/components/china/ChinaCampaignLeadForm';

const canonicalUrl = 'https://eduexpressint.com/study-in-china-from-bangladesh';
const verifiedDate = '2026-07-19';

export const metadata: Metadata = {
  title: { absolute: 'Study in China from Bangladesh | EduExpress' },
  description: 'Compare 134+ China university collaborations, six study levels, scholarship possibilities, IELTS alternatives and CSCA routes with EduExpress.',
  alternates: {
    canonical: canonicalUrl,
    languages: {
      'en-BD': canonicalUrl,
      'bn-BD': 'https://eduexpressint.com/bn/study-in-china',
    },
  },
  openGraph: {
    title: 'Study in China from Bangladesh with a Clear Admission Plan',
    description: 'Compare university, program, scholarship, English proof and CSCA requirements before applying.',
    url: canonicalUrl,
    type: 'website',
    images: [{ url: '/images/destinations/china.jpg', width: 1200, height: 800, alt: 'Study in China guidance for Bangladeshi students' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in China from Bangladesh | EduExpress',
    description: 'A China university and admission fit assessment for Bangladeshi students.',
    images: ['/images/destinations/china.jpg'],
  },
};

const studyLevels = [
  { label: 'Language', detail: 'Chinese language study routes', icon: Languages },
  { label: 'Foundation', detail: 'Academic and language preparation', icon: BookOpenCheck },
  { label: 'Diploma', detail: 'Career focused study options', icon: ClipboardCheck },
  { label: 'Bachelor', detail: 'Undergraduate degree routes', icon: GraduationCap },
  { label: 'Master', detail: 'Postgraduate taught and research routes', icon: Microscope },
  { label: 'PhD', detail: 'Doctoral research pathways', icon: Sparkles },
];

const subjectAreas = [
  { name: 'Engineering and Technology', icon: Building2 },
  { name: 'Computer Science and AI', icon: Microscope },
  { name: 'MBBS and Health Sciences', icon: Stethoscope },
  { name: 'Aeronautical and Aerospace', icon: PlaneTakeoff },
  { name: 'Business and Management', icon: CircleDollarSign },
  { name: 'Chinese Language', icon: Languages },
];

const faqs = [
  {
    question: 'Can a Bangladeshi student study in China without IELTS?',
    answer: 'Some universities or programs may accept another officially stated form of English proficiency, such as prior English medium study or a university assessment. This is not a universal IELTS exemption. EduExpress checks the current rule for the exact program before recommending it.',
  },
  {
    question: 'Is CSCA required for China admission in 2027?',
    answer: 'CSCA is relevant to undergraduate admission in the 2027 academic cycle and is required for undergraduate applicants to Chinese Government Scholarship universities under current official guidance. Other study levels and institution specific routes may use different requirements, so the target university notice is checked before application.',
  },
  {
    question: 'Can I receive a 100% scholarship in China?',
    answer: 'Selected universities in the EduExpress network may offer awards covering up to 100% of tuition. Availability, competition, coverage, renewal rules and eligibility vary. The scholarship review confirms tuition coverage, accommodation, insurance, living support and other charges separately, while the awarding body makes the selection decision.',
  },
  {
    question: 'Which study levels can EduExpress support for China?',
    answer: 'EduExpress supports eligible students exploring Chinese language, foundation, diploma, Bachelor, Master and PhD routes. The suitable level depends on academic history, age, subject background, language readiness, budget and the university rule.',
  },
  {
    question: 'Does EduExpress charge before the China visa is approved?',
    answer: 'There is no file opening charge and no EduExpress service fee before China visa approval. Required university, embassy, medical, translation, courier, deposit or other third party fees are separate and must be itemized in writing before the student proceeds.',
  },
  {
    question: 'What happens after I submit the China Fit Assessment?',
    answer: 'A counselor reviews your qualification and target level, identifies missing information, and discusses likely program, English proof, CSCA and budget routes. A final recommendation requires verified university and intake information.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: 'Study in China from Bangladesh',
      description: 'China university, admission, scholarship, English proficiency and CSCA guidance for Bangladeshi students.',
      inLanguage: 'en-BD',
      dateModified: verifiedDate,
      reviewedBy: { '@id': 'https://eduexpressint.com/#organization' },
      breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
      mainEntity: { '@id': `${canonicalUrl}#service` },
    },
    {
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      name: 'China Education Fit Assessment and Application Support',
      serviceType: 'International education guidance and application support',
      areaServed: { '@type': 'Country', name: 'Bangladesh' },
      provider: { '@id': 'https://eduexpressint.com/#organization' },
      audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
      url: canonicalUrl,
    },
    {
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' },
        { '@type': 'ListItem', position: 2, name: 'Study in China from Bangladesh', item: canonicalUrl },
      ],
    },
  ],
};

export default function StudyInChinaFromBangladeshPage() {
  return (
    <article className="overflow-hidden bg-[#f6f9fb] pt-[76px] text-[#08263c] min-[1200px]:pt-[104px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="relative isolate overflow-hidden bg-[#08263c] text-white">
        <Image src="/images/destinations/china.jpg" alt="University campus in China" fill priority sizes="100vw" className="object-cover object-center opacity-25" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#08263c_0%,rgba(8,38,60,.96)_45%,rgba(8,38,60,.75)_100%)]" />
        <div className="absolute left-[-9rem] top-[-12rem] size-[34rem] rounded-full border-[5rem] border-[#64b5df]/10" />
        <div className="absolute bottom-0 right-[42%] h-40 w-px bg-gradient-to-b from-transparent to-[#64b5df]/60" />

        <div className="relative mx-auto grid max-w-[1440px] gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-12">
          <div className="py-2 lg:py-4">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
              <Link href="/" className="hover:text-[#8ed0ee]">Home</Link><span aria-hidden="true">/</span><span className="text-[#8ed0ee]">China study desk</span>
            </nav>

            <div className="inline-flex items-center gap-2 border border-[#8ed0ee]/35 bg-[#174f7a]/35 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#a9e2fb] backdrop-blur">
              <span className="size-1.5 rounded-full bg-[#8ed0ee]" /> 2027 admission planning
            </div>

            <h1 className="mt-5 max-w-3xl text-balance font-heading text-4xl font-bold leading-[1.02] sm:text-5xl lg:text-[62px]">
              Study in China from Bangladesh with the right route, not a random offer
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Compare <strong className="text-white">134+ collaborating universities</strong> across Language, Foundation, Diploma, Bachelor, Master and PhD study. We screen English proof, CSCA, scholarship, cost and program fit before an application decision.
            </p>

            <div className="mt-6 grid max-w-2xl grid-cols-3 gap-px bg-white/15">
              <div className="bg-[#08263c]/90 p-3 sm:p-4"><strong className="font-heading text-2xl text-[#8ed0ee] sm:text-3xl">134+</strong><span className="mt-1 block text-[10px] leading-4 text-white/55 sm:text-xs">University collaborations</span></div>
              <div className="bg-[#08263c]/90 p-3 sm:p-4"><strong className="font-heading text-2xl text-[#8ed0ee] sm:text-3xl">6</strong><span className="mt-1 block text-[10px] leading-4 text-white/55 sm:text-xs">Study levels supported</span></div>
              <div className="bg-[#08263c]/90 p-3 sm:p-4"><strong className="font-heading text-2xl text-[#8ed0ee] sm:text-3xl">2018</strong><span className="mt-1 block text-[10px] leading-4 text-white/55 sm:text-xs">China service since</span></div>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs font-bold text-white/75">
              {['IELTS and approved alternative routes', 'CSCA planning by study level', 'Scholarship eligibility screening'].map((item) => (
                <span key={item} className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#8ed0ee]" />{item}</span>
              ))}
            </div>

            <a href="#china-fit-form" className="mt-7 inline-flex min-h-12 items-center gap-2 bg-[#64b5df] px-5 text-sm font-black text-[#08263c] lg:hidden">
              Check My China Options <ArrowRight size={17} />
            </a>
          </div>

          <ChinaCampaignLeadForm />
        </div>

        <div className="relative border-t border-white/15 bg-[#061f32]/90">
          <div className="mx-auto grid max-w-[1440px] divide-y divide-white/10 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
            {[
              ['01', 'No file opening charge'],
              ['02', 'No EduExpress service fee before China visa approval'],
              ['03', 'Third party fees itemized in writing'],
            ].map(([number, label]) => (
              <div key={number} className="flex items-center gap-4 py-4 sm:px-5 first:pl-0">
                <span className="font-mono text-[10px] font-black text-[#8ed0ee]">{number}</span>
                <strong className="text-xs leading-5 text-white/80">{label}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.34fr_.66fr] lg:py-16">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">One China desk, six study levels</p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-bold leading-tight sm:text-4xl">Start with your education stage</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">The best route begins with the qualification you already have, not with the biggest scholarship headline.</p>
          </div>
          <div className="grid border-l border-t border-[#174f7a]/20 sm:grid-cols-2 lg:grid-cols-3">
            {studyLevels.map(({ label, detail, icon: Icon }, index) => (
              <article key={label} className="group min-h-40 border-b border-r border-[#174f7a]/20 bg-white p-5 transition hover:bg-[#e9f7fd]">
                <div className="flex items-start justify-between"><span className="grid size-10 place-items-center bg-[#e9f7fd] text-[#174f7a] group-hover:bg-[#174f7a] group-hover:text-white"><Icon size={20} /></span><span className="font-mono text-[9px] font-black text-slate-400">0{index + 1}</span></div>
                <h3 className="mt-5 font-heading text-xl font-bold">{label}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e9f7fd]">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[.36fr_.64fr]">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Route navigator</p>
              <h2 className="mt-3 text-balance font-heading text-3xl font-bold leading-tight sm:text-5xl">Three rules can change your shortlist</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">We verify these conditions at program level. A rule at one university cannot be copied to another.</p>
            </div>

            <div className="grid gap-4">
              <article className="grid overflow-hidden bg-white shadow-[0_18px_50px_rgba(8,38,60,0.08)] md:grid-cols-[10rem_1fr]">
                <div className="flex items-center gap-3 bg-[#174f7a] p-5 text-white md:flex-col md:items-start md:justify-between"><Languages size={27} /><span className="font-mono text-[10px] font-black uppercase tracking-[0.18em]">English proof</span></div>
                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                  <div><strong className="text-sm">With IELTS</strong><p className="mt-2 text-xs leading-5 text-slate-600">Use a valid score that meets the exact program threshold.</p></div>
                  <div><strong className="text-sm">Without IELTS</strong><p className="mt-2 text-xs leading-5 text-slate-600">Consider only programs that officially accept another proof or assessment. No universal exemption.</p></div>
                </div>
              </article>

              <article className="grid overflow-hidden bg-white shadow-[0_18px_50px_rgba(8,38,60,0.08)] md:grid-cols-[10rem_1fr]">
                <div className="flex items-center gap-3 bg-[#08263c] p-5 text-white md:flex-col md:items-start md:justify-between"><FileCheck2 size={27} /><span className="font-mono text-[10px] font-black uppercase tracking-[0.18em]">CSCA check</span></div>
                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                  <div><strong className="text-sm">With CSCA</strong><p className="mt-2 text-xs leading-5 text-slate-600">Plan for undergraduate routes where the current university or scholarship notice requires it.</p></div>
                  <div><strong className="text-sm">Without CSCA</strong><p className="mt-2 text-xs leading-5 text-slate-600">Explore other study levels or an institution route only when its current official requirements allow it.</p></div>
                </div>
              </article>

              <article className="grid overflow-hidden bg-white shadow-[0_18px_50px_rgba(8,38,60,0.08)] md:grid-cols-[10rem_1fr]">
                <div className="flex items-center gap-3 bg-[#64b5df] p-5 text-[#08263c] md:flex-col md:items-start md:justify-between"><Sparkles size={27} /><span className="font-mono text-[10px] font-black uppercase tracking-[0.18em]">Funding fit</span></div>
                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                  <div><strong className="text-sm">Up to 100% tuition</strong><p className="mt-2 text-xs leading-5 text-slate-600">Available at selected universities, subject to eligibility, competition and current award terms.</p></div>
                  <div><strong className="text-sm">Know the uncovered cost</strong><p className="mt-2 text-xs leading-5 text-slate-600">Housing, insurance, living costs and other fees may remain even when tuition is fully covered.</p></div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[.42fr_.58fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4"><strong className="font-heading text-7xl font-bold leading-none text-[#174f7a] sm:text-8xl">134+</strong><span className="max-w-36 text-xs font-black uppercase leading-5 tracking-[0.13em] text-slate-500">Collaborating universities in the China network</span></div>
              <h2 className="mt-6 text-balance font-heading text-3xl font-bold leading-tight sm:text-5xl">A larger network only matters when the shortlist gets smaller</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">We narrow options by academic eligibility, subject strength, language rule, CSCA requirement, total cost and recognition needs. Relationship type, available programs and intake status can vary by university.</p>
            </div>
            <div className="grid border-l border-t border-[#174f7a]/20 sm:grid-cols-2">
              {subjectAreas.map(({ name, icon: Icon }) => (
                <div key={name} className="flex min-h-24 items-center gap-4 border-b border-r border-[#174f7a]/20 p-4 hover:bg-[#f6f9fb]">
                  <span className="grid size-10 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a]"><Icon size={19} /></span>
                  <strong className="text-sm leading-5">{name}</strong>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 border-l-4 border-[#64b5df] bg-[#f6f9fb] px-4 py-3 text-[11px] leading-5 text-slate-500">The 134+ portfolio count is supplied by EduExpress management. It does not mean every university offers every level, subject, scholarship or intake. Current availability is confirmed during assessment.</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#08263c] text-white">
        <div className="absolute right-[-12rem] top-[-12rem] size-[36rem] rounded-full border-[6rem] border-[#64b5df]/10" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[.42fr_.58fr] lg:py-20">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">China record</p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-bold leading-tight sm:text-5xl">Experience shown with context, not used as a promise</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/65">Our recorded China experience helps us identify application and document risks. Every admission, scholarship and visa decision still depends on the responsible institution or authority.</p>
          </div>
          <div>
            <div className="grid gap-px bg-white/15 sm:grid-cols-3">
              <div className="bg-[#08263c] p-6"><strong className="font-heading text-4xl text-[#8ed0ee]">2018</strong><span className="mt-3 block text-xs leading-5 text-white/60">China focused service operating since</span></div>
              <div className="bg-[#08263c] p-6"><strong className="font-heading text-4xl text-[#8ed0ee]">98%</strong><span className="mt-3 block text-xs leading-5 text-white/60">Recorded China visa success through 2025</span></div>
              <div className="bg-[#08263c] p-6"><strong className="font-heading text-4xl text-[#8ed0ee]">2000+</strong><span className="mt-3 block text-xs leading-5 text-white/60">Students supported through B2C and B2B channels</span></div>
            </div>
            <p className="mt-4 text-[10px] leading-5 text-white/45">Company records through 2025. The 2027 cycle is now in planning, with universities, scholarship bodies and authorities issuing their official decisions.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f9fb]">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[.34fr_.66fr]">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">From lead to readiness</p>
              <h2 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">What your assessment starts</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">Each step should produce a clearer decision or written evidence.</p>
            </div>
            <ol className="grid border-l border-t border-[#174f7a]/20 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Profile screen', 'Check education stage, results, gaps, budget and goal.', Target],
                ['Verified shortlist', 'Compare suitable university and program routes.', SearchCheck],
                ['ClearCost Sheet', 'Separate tuition, living and third party charges.', CircleDollarSign],
                ['Application proof', 'Track submitted documents and official responses.', FileCheck2],
                ['Visa readiness', 'Prepare the current document path and risk checks.', ShieldCheck],
                ['Pre departure', 'Plan arrival, housing, payment and practical support.', PlaneTakeoff],
              ].map(([title, text, Icon], index) => (
                <li key={String(title)} className="min-h-48 border-b border-r border-[#174f7a]/20 bg-white p-5">
                  <div className="flex items-center justify-between"><span className="grid size-10 place-items-center bg-[#e9f7fd] text-[#174f7a]"><Icon size={20} /></span><span className="font-mono text-[9px] font-black text-slate-400">0{index + 1}</span></div>
                  <h3 className="mt-5 font-heading text-lg font-bold">{String(title)}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{String(text)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <article className="border-t-4 border-[#174f7a] bg-[#e9f7fd] p-6 sm:p-8">
            <span className="grid size-11 place-items-center bg-[#174f7a] text-white"><BadgeCheck size={22} /></span>
            <h2 className="mt-6 font-heading text-2xl font-bold">Why this assessment helps</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
              {['China options are matched to your academic profile', 'The complete cost is compared alongside tuition', 'Your language, CSCA and scholarship route is program specific', 'You receive a focused and practical next step'].map((item) => <li key={item} className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-[#174f7a]" />{item}</li>)}
            </ul>
          </article>
          <article className="border-t-4 border-[#64b5df] bg-[#f4f8fb] p-6 sm:p-8">
            <span className="grid size-11 place-items-center bg-[#08263c] text-white"><ShieldCheck size={22} /></span>
            <h2 className="mt-6 font-heading text-2xl font-bold">The responsible application standard</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
              {['Authentic academic and identity documents', 'Complete facts shared with the institution', 'Language and CSCA rules confirmed for the exact program', 'Written costs reviewed before payment'].map((item) => <li key={item} className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-[#174f7a]" />{item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-[#e9f7fd]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="text-center">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Questions before you apply</p>
            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-5xl">China admission FAQ</h2>
          </div>
          <div className="mt-10 grid gap-3">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="group bg-white p-5 open:shadow-[0_15px_45px_rgba(8,38,60,0.08)] sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-heading text-base font-bold sm:text-lg">
                  <span className="flex items-start gap-4"><span className="font-mono text-[9px] font-black text-[#174f7a]">0{index + 1}</span>{faq.question}</span><span className="grid size-7 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-3xl pl-8 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[.34fr_.66fr]">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Continue your research</p>
              <h2 className="mt-3 font-heading text-3xl font-bold">China decision guides</h2>
            </div>
            <div className="grid border-l border-t border-[#174f7a]/20 sm:grid-cols-2">
              {[
                ['Compare China universities', '/china-universities'],
                ['Scholarships for Bangladeshi students', '/china-scholarships-bangladesh'],
                ['China X1 and X2 visa guide', '/china-student-visa-bangladesh'],
                ['Plan the full study cost', '/study-in-china-cost-bangladesh'],
                ['IELTS alternative routes', '/study-in-china-without-ielts'],
                ['China intakes and deadlines', '/china-intakes-deadlines'],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="group flex min-h-20 items-center justify-between border-b border-r border-[#174f7a]/20 p-4 text-sm font-black hover:bg-[#e9f7fd]">
                  {label}<ArrowRight size={16} className="text-[#174f7a] transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#174f7a] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.7fr_.3fr] lg:items-center lg:py-16">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#b7e9ff]">Your next useful step</p>
            <h2 className="mt-3 max-w-3xl text-balance font-heading text-3xl font-bold sm:text-5xl">Turn 134+ possibilities into a shortlist that fits you</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">Submit your education stage and target level. We will begin with fit, requirements and missing evidence.</p>
          </div>
          <a href="#china-fit-form" className="flex min-h-14 items-center justify-center gap-2 bg-white px-6 text-sm font-black text-[#174f7a] transition hover:bg-[#e9f7fd]">Start My Assessment <ArrowRight size={18} /></a>
        </div>
      </section>

      <section className="border-b border-[#174f7a]/15 bg-[#f6f9fb]">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
          <blockquote className="border-l-4 border-[#174f7a] bg-white p-5 text-sm font-bold leading-7 text-[#08263c] sm:p-6">
            “No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.”
          </blockquote>
          <div className="mt-7 grid gap-6 text-xs leading-6 text-slate-500 lg:grid-cols-2">
            <div>
              <p><strong className="text-[#08263c]">Prepared by:</strong> EduExpress China Admissions Desk</p>
              <p><strong className="text-[#08263c]">Reviewed by:</strong> EduExpress Content and Compliance</p>
              <p><strong className="text-[#08263c]">Last verified:</strong> 19 July 2026 <span aria-hidden="true">•</span> <strong className="text-[#08263c]">Next review:</strong> 19 October 2026</p>
            </div>
            <div>
              <p className="font-black uppercase tracking-[0.14em] text-[#08263c]">Official reference points checked 19 July 2026</p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                <a href="https://csca.cn/" target="_blank" rel="noreferrer" className="font-bold text-[#174f7a] underline underline-offset-4">Official CSCA portal</a>
                <a href="https://english.shanghai.gov.cn/en-FAQs-StudyinShanghai/20251218/134bb78943f640519e2185ff83051f5d.html" target="_blank" rel="noreferrer" className="font-bold text-[#174f7a] underline underline-offset-4">Government CSCA guidance</a>
                <a href="https://www.campuschina.org/" target="_blank" rel="noreferrer" className="font-bold text-[#174f7a] underline underline-offset-4">Campus China</a>
                <a href="http://bd.china-embassy.gov.cn/eng/" target="_blank" rel="noreferrer" className="font-bold text-[#174f7a] underline underline-offset-4">Chinese Embassy in Bangladesh</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
