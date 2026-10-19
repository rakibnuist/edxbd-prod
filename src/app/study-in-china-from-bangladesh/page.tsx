import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import ChinaStudyPlanner from '@/components/china/ChinaStudyPlanner';
import { getUniversityRoute } from '@/lib/university-records';
import { universitySearchIdentity } from '@/lib/university-profile-seo';

const siteUrl = 'https://eduexpressint.com';
const canonical = `${siteUrl}/study-in-china-from-bangladesh`;
const applyHref = '/apply?country=China';
const description = 'Plan your study in China from Bangladesh. Compare universities, fees, scholarships, admission requirements and student visa guidance with EduExpress International.';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: { absolute: 'Study in China from Bangladesh | EduExpress International' },
  description,
  alternates: { canonical },
  openGraph: {
    title: 'Study in China from Bangladesh', description, url: canonical, type: 'website', siteName: 'EduExpress International',
    images: [{ url: '/images/destinations/china-study-guide.webp', width: 1400, height: 933, alt: 'The Great Wall of China across wooded hills' }],
  },
  twitter: { card: 'summary_large_image', title: 'Study in China from Bangladesh', description, images: ['/images/destinations/china-study-guide.webp'] },
};

const guides = [
  { title: 'Costs & tuition fees', href: '/study-in-china-cost-bangladesh', summary: 'Understand university fees, accommodation and the costs to plan before travel and in China.', ids: ['china-fee-examples', 'china-total-cost'] },
  { title: 'Scholarships', href: '/china-scholarships-bangladesh', summary: 'Compare CSC, provincial and university funding, including coverage and renewal conditions.', ids: ['china-funding'] },
  { title: 'Admission requirements', href: '/china-admission-requirements', summary: 'Match your qualifications to a study route. Prepare academic documents and any required CSCA evidence.', ids: ['china-eligibility', 'china-preparation'] },
  { title: 'Student visa', href: '/china-student-visa-bangladesh', summary: 'Understand X1 and X2 study routes, admission paperwork and visa preparation from Bangladesh.', ids: ['china-visa-route'] },
  { title: 'English & IELTS options', href: '/study-in-china-without-ielts', summary: 'Check English tests, accepted MOI alternatives and Chinese-medium language requirements.', ids: ['china-language'] },
  { title: 'Student life', href: '/life-in-china-bangladeshi-students', summary: 'Prepare for housing, halal food, everyday payments, campus support and life in a new city.', ids: ['china-student-life'] },
];
const faqs = [
  { question: 'How can I study in China from Bangladesh?', answer: 'Start by choosing your study level and subject, then compare universities against your qualifications, teaching language and budget. Prepare the university’s required documents, apply through the stated admission route and assess scholarships separately. After an offer, follow the applicable student visa process.' },
  { question: 'Can I study in China without IELTS?', answer: 'Some programs accept another English test or official evidence that previous study was taught in English. Acceptance depends on the university, program and scholarship. Check the exact requirements before relying on an MOI certificate; there is no universal IELTS exemption.' },
  { question: 'What does a China scholarship cover?', answer: 'Coverage depends on the award. It may reduce tuition or include accommodation, insurance and a living allowance. Check the amount, supported study period, eligible program and renewal conditions. Plan separately for costs outside the written award.' },
  { question: 'How much does studying in China cost?', answer: 'The total depends on the university, program, city, room choice and confirmed scholarship support. Add tuition, accommodation, insurance, health and residence procedures, living expenses and travel. Compare a specific university’s fee schedule in ClearCost, keeping CNY and BDT amounts separate unless you enter an exchange rate.' },
];
const universitySelections = [
  { slug: 'nuist', summary: 'Atmospheric science, computing and engineering, with English- and Chinese-medium study routes.' },
  { slug: 'xian-jiaotong-university', summary: 'Explore Chinese-language study and foundation preparation at a university in Xi’an.' },
  { slug: 'wzu', summary: 'Explore undergraduate majors, entry requirements and tuition at Wenzhou University.' },
];
const actionClass = 'inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#174f7a] px-5 py-3 text-center text-sm font-semibold leading-6 text-white transition-colors hover:bg-[#103d60] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f7a]';
const textLinkClass = 'inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#174f7a] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f7a]';
const headingClass = 'text-2xl font-semibold tracking-tight text-[#102b40] sm:text-3xl';

export default async function StudyInChinaFromBangladeshPage() {
  const records = await Promise.all(universitySelections.map(async selection => {
    const route = await getUniversityRoute(selection.slug);
    return route ? { university: route.record, summary: selection.summary } : null;
  }));
  const universities = records.filter(record => record !== null);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${canonical}#page`, url: canonical, name: 'Study in China from Bangladesh', description, inLanguage: 'en-BD', publisher: { '@id': `${siteUrl}/#organization` }, breadcrumb: { '@id': `${canonical}#breadcrumb` }, mainEntity: { '@id': `${canonical}#guides` } },
      { '@type': 'ItemList', '@id': `${canonical}#guides`, name: 'Study in China guides', numberOfItems: guides.length, itemListElement: guides.map((guide, index) => ({ '@type': 'ListItem', position: index + 1, name: guide.title, url: `${siteUrl}${guide.href}` })) },
      { '@type': 'FAQPage', '@id': `${canonical}#faq`, mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
      { '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Study in China', item: canonical }] },
    ],
  };

  return <article className="china-study-hub bg-white pt-[76px] text-[#102b40] xl:pt-[112px]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <header className="bg-[#f5f7f7] px-5 pb-8 pt-5 sm:px-8 lg:px-10 lg:pb-10">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-xs leading-6 text-slate-500"><Link href="/" className="hover:text-[#174f7a]">Home</Link><ChevronRight size={13} aria-hidden="true" /><span>Study in China</span></nav>
        <div className="grid items-center gap-7 lg:grid-cols-[.58fr_.42fr] lg:gap-10">
          <div>
            <h1 className="max-w-xl text-[34px] font-semibold leading-[1.12] tracking-tight sm:text-[46px] lg:text-[52px]">Study in China<br />from Bangladesh</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">Explore Chinese universities, scholarships and study costs with EduExpress International. Build a plan around your qualifications, preferred subject and budget.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3"><Link href={applyHref} className={actionClass}>Apply with EduExpress International<ArrowRight size={17} className="shrink-0" /></Link><a href="#china-study-guide" className={textLinkClass}>Explore the guides<ArrowRight size={16} /></a></div>
            <p className="mt-4 text-sm leading-7 text-slate-500">English- and Chinese-medium routes · Undergraduate to postgraduate study</p>
          </div>
          <figure className="relative overflow-hidden rounded-lg"><Image src="/images/destinations/china-study-guide.webp" alt="The Great Wall of China crossing wooded hills" width={1400} height={933} priority sizes="(max-width: 1023px) 100vw, 480px" className="h-[190px] w-full object-cover object-[50%_57%] sm:h-[250px] lg:h-[330px]" /></figure>
        </div>
      </div>
    </header>

    <ChinaStudyPlanner />

    <section id="china-study-guide" className="scroll-mt-32 px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[.28fr_.72fr] lg:gap-10">
        <div><h2 className={headingClass}>Your China study guide</h2><p className="mt-3 text-sm leading-7 text-slate-600">Start with the question on your mind. Each guide covers one part of your study plan in detail.</p><Link href="/china-universities" className={`mt-3 ${textLinkClass}`}>Compare universities<ArrowRight size={16} /></Link></div>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">{guides.map(guide => <div key={guide.href} className="relative">{guide.ids.map(anchor => <span id={anchor} key={anchor} className="block scroll-mt-36" />)}<Link href={guide.href} className="group block rounded-md bg-[#f5f7f7] px-5 py-4 transition-colors hover:bg-[#eaf1f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f7a]"><h3 className="flex items-center justify-between gap-3 text-lg font-semibold leading-7"><span>{guide.title}</span><ArrowRight size={18} className="shrink-0 text-[#174f7a] transition-transform group-hover:translate-x-1 motion-reduce:transform-none" /></h3><p className="mt-2 text-sm leading-7 text-slate-600">{guide.summary}</p></Link></div>)}</div>
      </div>
    </section>

    <section id="china-university-options" className="bg-[#f5f7f7] px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className={headingClass}>Explore universities in China</h2><p className="mt-3 text-sm leading-7 text-slate-600">Look closer at the university, your major and the full study cost.</p></div><Link href="/china-universities" className={textLinkClass}>View all universities<ArrowRight size={16} /></Link></div>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[.42fr_.58fr] lg:gap-10">
          <figure><Image src="/images/universities/nuist-campus.webp" alt="NUIST campus building and meteorological radar dome in Nanjing" width={1600} height={708} sizes="(max-width: 1023px) 100vw, 480px" className="h-[200px] w-full rounded-lg object-cover object-[65%_45%] lg:h-[280px]" /><figcaption className="mt-2 text-xs leading-6 text-slate-500">NUIST campus, Nanjing</figcaption></figure>
          <div className="grid gap-3">{universities.map(({ university, summary }) => <Link key={university.slug} href={`/universities/${university.slug}`} className="group flex items-center justify-between gap-5 rounded-md bg-white px-5 py-4 transition-colors hover:bg-[#eaf1f3]"><div><h3 className="text-lg font-semibold leading-7">{universitySearchIdentity(university).shortName}</h3><p className="mt-0.5 text-xs leading-6 text-[#287465]">{university.city}, {university.country}</p><p className="mt-1 text-sm leading-6 text-slate-600">{summary}</p></div><ArrowRight size={18} className="shrink-0 text-[#174f7a]" /></Link>)}{universities.length === 0 && <Link href="/china-universities" className={textLinkClass}>Explore university profiles<ArrowRight size={16} /></Link>}</div>
        </div>
        <div id="china-recognition" className="mt-4 flex scroll-mt-32 flex-wrap gap-x-6 gap-y-1"><Link href="/mbbs-in-china-bangladesh" className={textLinkClass}>Considering MBBS? Read the recognition guide<ArrowRight size={16} /></Link><Link href="/china-success-stories" className={textLinkClass}>Student stories<ArrowRight size={16} /></Link></div>
      </div>
    </section>

    <section id="china-fit-form" className="scroll-mt-32 bg-[#174f7a] px-5 py-9 text-white sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-[1200px] items-center gap-7 lg:grid-cols-[.42fr_.58fr] lg:gap-10">
        <div><h2 className="max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">Prepare with EduExpress</h2><p className="mt-3 max-w-md text-sm leading-7 text-white/85">Get support with your university shortlist, application documents, scholarship route and ClearCost plan.</p><Link href={applyHref} className="mt-5 inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-white px-5 py-3 text-center text-sm font-semibold leading-6 text-[#174f7a] transition-colors hover:bg-[#eaf1f3]">Apply with EduExpress International<ArrowRight size={17} className="shrink-0" /></Link></div>
        <div><p className="text-sm leading-8 text-white/90">No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.</p><Link href="/china-visa-first-policy" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline underline-offset-4">Packages & payment terms<ArrowRight size={16} /></Link></div>
      </div>
    </section>

    <section id="china-research-faq" className="scroll-mt-32 px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[.28fr_.72fr] lg:gap-10"><div><h2 className={headingClass}>Common questions</h2><p className="mt-3 text-sm leading-7 text-slate-600">A few answers to help you take the next step.</p></div><div className="grid gap-3">{faqs.map(faq => <details key={faq.question} className="group rounded-md bg-[#f5f7f7] px-5"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 py-4 text-sm font-semibold leading-7 [&::-webkit-details-marker]:hidden">{faq.question}<ChevronDown size={17} className="shrink-0 text-[#174f7a] transition-transform group-open:rotate-180 motion-reduce:transform-none" /></summary><p className="pb-5 text-sm leading-7 text-slate-600">{faq.answer}</p></details>)}</div></div>
    </section>
  </article>;
}
