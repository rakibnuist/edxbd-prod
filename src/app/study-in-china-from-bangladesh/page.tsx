import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Check, MapPin, ShieldCheck, Stethoscope } from 'lucide-react';
import ChinaStudyPlanner from '@/components/china/ChinaStudyPlanner';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { getUniversityRoute } from '@/lib/university-records';
import { getChinaStudyHub } from '@/lib/china-study-hub';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/study-in-china-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=China';
export const revalidate = 3600;

export async function generateMetadata() {
  const content = await getChinaStudyHub();
  return pageMetadata({
    title: 'Study in China from Bangladesh | EduExpress International',
    description: content.description,
    path: PATH,
    locale: 'en_GB',
    languages: { 'en-BD': PATH, 'bn-BD': '/bn/study-in-china', 'x-default': PATH },
    image: ogImage('china-guide', content.photos.hero.alt),
  });
}

const selections = [
  { slug: 'nuist', acronym: 'NUIST', logo: '/images/universities/logos/nuist.webp', summary: 'Explore atmospheric science, computing and engineering, with English- and Chinese-medium options.' },
  { slug: 'hit-harbin', acronym: 'HIT', logo: '/images/campaigns/march-2027/harbin-institute-of-technology.png', summary: 'Explore an engineering-focused university, preparation routes and degree scholarship options.' },
  { slug: 'nuaa', acronym: 'NUAA', logo: '/images/campaigns/march-2027/nanjing-university-of-aeronautics-and-astronautics.jpg', summary: 'Compare engineering and business programmes, preparation and university funding.' },
];
const contents = [['Education & rankings', 'china-education-quality'], ['Scholarships', 'china-funding'], ['MBBS', 'china-recognition'], ['Admission & CSCA', 'china-eligibility'], ['Fees', 'china-total-cost'], ['Student life', 'china-student-life'], ['Universities', 'china-university-options'], ['FAQs', 'china-research-faq']];
const visaFirstTerms = 'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';
const monthYear = (iso?: string) => {
  const date = iso ? new Date(`${iso}T00:00:00Z`) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : undefined;
};

export default async function StudyInChinaFromBangladeshPage() {
  const [content, records] = await Promise.all([getChinaStudyHub(), Promise.all(selections.map(async selection => {
    const route = await getUniversityRoute(selection.slug);
    return route ? { ...selection, university: route.record } : null;
  }))]);
  const universities = records.filter(record => record !== null);
  const reviewed = monthYear(content.research?.checkedAt);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${canonical}#page`, url: canonical, name: 'Study in China from Bangladesh', description: content.description, inLanguage: 'en-BD', isPartOf: { '@id': `${SITE}/#website` }, publisher: { '@id': `${SITE}/#organization` }, breadcrumb: { '@id': `${canonical}#breadcrumb` }, mainEntity: { '@id': `${canonical}#guides` } },
      { '@type': 'ItemList', '@id': `${canonical}#guides`, name: 'Study in China topic guides for Bangladeshi students', numberOfItems: content.guides.length, itemListElement: content.guides.map((guide, i) => ({ '@type': 'ListItem', position: i + 1, name: guide.title, url: `${SITE}${guide.href}` })) },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Study in China' }]}
        eyebrow="Bachelor’s · Master’s · PhD · MBBS · Language"
        title="Study in China from Bangladesh."
        lead={content.intro}
        reviewed={reviewed}
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">Get my China study plan <ArrowRight size={18} aria-hidden="true" /></Link>
            <a href="#study-routes" className="ed-btn ed-btn-outline min-h-[52px] px-7">Find a programme</a>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image src={content.photos.hero.src} alt={content.photos.hero.alt} fill priority sizes="(max-width:1024px) 100vw, 480px" className="object-cover object-[68%_43%]" />
            </div>
            <figcaption className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
              <MapPin size={15} aria-hidden="true" />{content.photos.hero.caption}
            </figcaption>
          </figure>
        }
      />

      <TrustBar />

      <section aria-label="Plan your China study" className="border-b border-canvas-soft bg-white py-8">
        <div className={`${kit.wrap} grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12`}>
          <p className={kit.body}>{content.introDetail}</p>
          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {contents.map(([label, id]) => <a key={id} href={`#${id}`} className="inline-flex min-h-[44px] items-center rounded-full bg-canvas-soft px-4 text-[15px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale">{label}</a>)}
          </nav>
        </div>
      </section>

      <Section id="china-education-quality" title="Why study in China? Education quality comes first." intro="A good shortlist connects the reputation of a university with the quality of your actual programme. Look at what you will study, who will teach you and the facilities you will use.">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div data-anim="stagger" className="grid gap-4">
            {content.quality.map(item => (
              <div key={item.title} className={kit.cardSage}>
                <h3 className={kit.h3}>{item.title}</h3>
                <p className={`mt-2 ${kit.body}`}>{item.body}</p>
              </div>
            ))}
          </div>
          <aside data-anim="up" className={`${kit.cardDark} self-start`}>
            <h3 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">Chinese universities on the world stage</h3>
            <p className="mt-2 text-[14px] leading-6 text-white/75">ShanghaiRanking · Academic Ranking of World Universities</p>
            <table className="mt-5 w-full text-left text-[16px]">
              <caption className="sr-only">Examples of Chinese university world rankings from ShanghaiRanking</caption>
              <thead><tr className="border-b border-white/20 text-[14px] text-white/70"><th scope="col" className="py-3 font-medium">University</th><th scope="col" className="py-3 text-right font-medium">World rank</th></tr></thead>
              <tbody className="divide-y divide-white/15">
                {content.rankings.map(item => <tr key={item.name}><th scope="row" className="py-4 pr-4 font-semibold text-white">{item.name}</th><td className="py-4 text-right font-display text-[30px] font-black leading-none text-lime">#{item.rank}</td></tr>)}
              </tbody>
            </table>
            <p className="mt-5 border-t border-white/20 pt-4 text-[15px] leading-6 text-white/80">World, national and subject rankings answer different questions. Use the ranking for your intended major alongside teaching language, admission fit and total cost.</p>
            <Link href="/china-universities" className="ed-btn ed-btn-on-dark mt-5 min-h-[48px] px-5">Explore university options <ArrowRight size={16} aria-hidden="true" /></Link>
          </aside>
        </div>
      </Section>

      <Section
        id="china-funding"
        tone="sage"
        title="Scholarships for Bangladeshi students."
        intro="From tuition reductions to full awards, funding can make your chosen programme more affordable. Compare the coverage, eligible degree and renewal conditions."
        action={<Link href="/china-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] px-6">Explore scholarships <ArrowRight size={16} aria-hidden="true" /></Link>}
      >
        <div data-anim="stagger" className="grid gap-4 md:grid-cols-3">
          {content.fundingRoutes.map(item => (
            <div key={item.title} className={kit.card}>
              <h3 className={kit.h3}>{item.title}</h3>
              <p className={`mt-2 ${kit.body}`}>{item.body}</p>
            </div>
          ))}
        </div>
        <div className={`mt-5 grid gap-6 ${kit.cardLime} lg:grid-cols-[1fr_1.5fr] lg:items-center`}>
          <div>
            <h3 className={kit.h3}>Full CSC scholarship monthly stipends</h3>
            <p className="mt-2 text-[15px] leading-6 text-ink-soft">For eligible full-award recipients; the scholarship terms define your funding period. Partial awards and other schemes differ.</p>
            <Link href="/csc-scholarship-bangladesh" className={`mt-3 ${kit.link}`}>CSC scholarship guide <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <dl className="grid grid-cols-3 gap-3">
            {content.stipends.map(item => (
              <div key={item.level} className="rounded-2xl bg-white p-4">
                <dt className="text-[14px] font-semibold text-ink-soft">{item.level}</dt>
                <dd className="mt-1 font-display text-[22px] font-black leading-tight text-petrol-800 sm:text-[28px]">{item.amount}</dd>
                <dd className="text-[14px] text-ink-soft">{item.period}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section id="china-recognition" tone="navy" title="MBBS in China: plan your medical career." intro={content.mbbs.intro}>
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
          <div>
            <span className={kit.iconLime}><Stethoscope size={22} aria-hidden="true" /></span>
            <p className="mt-5 text-[17px] leading-7 text-white/85">Compare medical universities, annual tuition, freshman scholarships and entry requirements in our dedicated guide for Bangladeshi students.</p>
            <Link href="/mbbs-in-china-bangladesh" className="ed-btn ed-btn-signal mt-6 min-h-[52px] px-6">MBBS universities, fees & scholarships <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <div data-anim="stagger" className="divide-y divide-white/15">
            {content.mbbs.points.map(item => (
              <div key={item.title} className="py-5 first:pt-0">
                <h3 className="text-[19px] font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-[16px] leading-7 text-white/80">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="china-eligibility"
        title="Your Bangladesh-to-China admission plan."
        intro="Use your current qualification to find the right starting point. Requirements belong to the selected university and programme."
        action={<Link href="/china-admission-requirements" className="ed-btn ed-btn-outline min-h-[48px] px-6">Full admission guide <ArrowRight size={16} aria-hidden="true" /></Link>}
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft">
          <table className="w-full min-w-[620px] text-left text-[15px] leading-6">
            <caption className="sr-only">China study routes and qualifications for Bangladeshi applicants</caption>
            <thead className="bg-canvas-soft"><tr>{['Study route', 'Your starting qualification', 'What to prepare'].map(label => <th key={label} scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">{label}</th>)}</tr></thead>
            <tbody className="divide-y divide-canvas-soft">
              {content.qualifications.map(item => <tr key={item.level}><th scope="row" className="px-5 py-4 align-top font-semibold text-petrol-800">{item.level}</th><td className="px-5 py-4 align-top text-ink-soft">{item.qualification}</td><td className="max-w-md px-5 py-4 text-ink-soft">{item.prepare}</td></tr>)}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div id="china-language" className={`scroll-mt-28 ${kit.cardSage}`}>
            <h3 className={kit.h3}>English, Chinese and CSCA</h3>
            <p className={`mt-2 ${kit.body}`}>Teaching-language evidence and academic entrance results serve different purposes. English-taught programmes specify accepted IELTS, TOEFL or MOI evidence; Chinese-taught routes specify HSK requirements. CSCA Mathematics and any required Physics, Chemistry or Professional Chinese depend on your undergraduate route.</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/china-admission-requirements#guide-3-understand-csca-and-language-proof" className={kit.link}>Understand CSCA <ArrowRight size={15} aria-hidden="true" /></Link>
              <Link href="/study-in-china-without-ielts" className={kit.link}>English & MOI options <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </div>
          <div id="china-preparation" className={`scroll-mt-28 ${kit.cardSage}`}>
            <h3 className={kit.h3}>Prepare your application file</h3>
            <ul className="mt-4 grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
              {content.documents.map(item => <li key={item} className="flex items-start gap-2.5 text-[15px] leading-6 text-ink-soft"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><Check size={13} strokeWidth={3} aria-hidden="true" /></span>{item}</li>)}
            </ul>
            <p className="mt-4 text-[14px] leading-6 text-ink-soft">Keep names consistent across your passport and academic records. Programme documents apply to self-funded and scholarship applicants.</p>
          </div>
        </div>
        <p className="mt-6 text-[16px] leading-7 text-ink-soft"><strong className="text-petrol-800">Choosing a start: </strong>Autumn is a common degree-entry period; spring offers language and foundation options, with selected degree routes by university. <Link href="/china-intakes-deadlines" className="font-semibold text-petrol-800 underline underline-offset-4">See 2027 intakes and deadlines</Link>.</p>
      </Section>

      <ChinaStudyPlanner />

      <Section id="china-total-cost" title="What does studying in China cost?" intro="Build a full family budget around the university, major and city. Keep tuition before scholarship, confirmed funding and living expenses as separate items. CNY and RMB refer to the same currency; BDT service charges stay separate.">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          <div>
            <div id="china-fee-examples" className="scroll-mt-28 divide-y divide-canvas-soft rounded-3xl border border-canvas-soft px-6">
              {content.costExamples.map(item => (
                <div key={item.name} className="flex flex-wrap items-center justify-between gap-3 py-5">
                  <div>
                    <Link href={item.href} className="text-[17px] font-semibold text-petrol-800 underline-offset-4 hover:underline">{item.name}</Link>
                    <p className="mt-1 text-[14px] text-ink-soft">{item.programme}</p>
                  </div>
                  <div className="sm:text-right">
                    <strong className="font-display text-[26px] font-black leading-none text-petrol-800">{item.amount}</strong>
                    <p className="mt-1 text-[14px] text-ink-soft">{item.period}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/study-in-china-cost-bangladesh" className={`mt-4 ${kit.link}`}>Explore fees & total costs <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className={`${kit.cardLime} self-start`}>
            <h3 className={kit.h3}>Your itemised cost checklist</h3>
            <dl className="mt-3 divide-y divide-white">
              <div className="py-4"><dt className="text-[16px] font-semibold text-petrol-800">Before China</dt><dd className={`mt-1 ${kit.body}`}>Application charges, any university deposit, document preparation, visa and travel arrangements, plus the agreed EduExpress Package.</dd></div>
              <div className="py-4"><dt className="text-[16px] font-semibold text-petrol-800">In China</dt><dd className={`mt-1 ${kit.body}`}>Tuition after confirmed support, accommodation, insurance, medical examination, residence permit, meals and everyday living.</dd></div>
            </dl>
            <p className="mt-1 text-[15px] leading-6 text-ink-soft">Compare the first year and later years, including the conditions for scholarship renewal.</p>
            <Link href="/fees-and-transparency" className={`mt-3 ${kit.link}`}>How EduExpress handles fees <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </Section>

      <Section
        id="china-student-life"
        tone="sage"
        title="Feel prepared for life in China."
        intro="Practical details matter to students and parents as much as the course."
        action={<Link href="/life-in-china-bangladeshi-students" className="ed-btn ed-btn-outline min-h-[48px] px-6">Explore student life <ArrowRight size={16} aria-hidden="true" /></Link>}
      >
        <div className="grid items-start gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-12">
          <figure data-anim="up">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image src={content.photos.life.src} alt={content.photos.life.alt} fill sizes="(max-width:1024px) 100vw, 500px" className="object-cover object-[50%_72%]" />
            </div>
            <figcaption className="mt-3 text-[14px] leading-6 text-ink-soft">{content.photos.life.caption}</figcaption>
          </figure>
          <div data-anim="stagger" className="grid gap-3">
            {content.life.map(item => (
              <div key={item.title} className={kit.card}>
                <h3 className={kit.h3}>{item.title}</h3>
                <p className={`mt-2 ${kit.body}`}>{item.body}</p>
              </div>
            ))}
            <Link id="china-visa-route" href="/china-student-visa-bangladesh" className={`scroll-mt-28 mt-2 ${kit.link}`}>Student visa and arrival preparation from Bangladesh <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </Section>

      <Section
        id="china-university-options"
        title="Explore Chinese university programmes."
        intro="Open a profile for majors, teaching language, entry requirements, scholarships and fee schedules."
        action={<Link href="/china-universities" className="ed-btn ed-btn-outline min-h-[48px] px-6">View all universities <ArrowRight size={16} aria-hidden="true" /></Link>}
      >
        <div data-anim="stagger" className="grid gap-4 md:grid-cols-3">
          {universities.map(({ university, logo, acronym, summary }) => (
            <div key={university.slug}>
              <Link href={`/universities/${university.slug}`} className="group flex h-full flex-col rounded-3xl bg-canvas-soft p-6 transition-colors hover:bg-lime-pale">
                <div className="flex items-center gap-3">
                  <Image src={logo} alt={`${university.name} logo`} width={56} height={56} className="size-14 rounded-2xl bg-white object-contain p-1.5" />
                  <div><p className="text-[16px] font-bold text-petrol-800">{acronym}</p><p className="text-[14px] text-ink-soft">{university.city}, China</p></div>
                </div>
                <h3 className={`mt-5 ${kit.h3}`}>{university.name}</h3>
                <p className={`mt-2 ${kit.body}`}>{summary}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[16px] font-semibold text-petrol-800 group-hover:underline">View programmes <ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section id="china-study-guide" tone="sage" title="Go deeper into your next question." intro="Each topic has its own guide, so you can focus on the part of your study plan that matters now.">
        <nav aria-label="China study topic guides">
          <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.guides.map(guide => (
              <li key={guide.href}>
                <Link href={guide.href} className="group flex h-full flex-col rounded-3xl bg-white p-6 transition-colors hover:bg-lime-pale">
                  <span className="flex items-center justify-between gap-3 text-[18px] font-semibold text-petrol-800"><span className="inline-flex items-center gap-2"><BookOpen size={18} aria-hidden="true" />{guide.title}</span><ArrowRight size={17} className="shrink-0" aria-hidden="true" /></span>
                  <span className="mt-2 text-[15px] leading-6 text-ink-soft">{guide.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section id="china-fit-form" title="From your first question to your university plan." intro="Share your academic background and study goals. EduExpress helps you prepare a suitable shortlist, scholarship route and written cost plan. Parents are welcome to join the conversation.">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
          <div>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image src={content.photos.support.src} alt={content.photos.support.alt} fill sizes="(max-width:1024px) 100vw, 430px" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-[14px] leading-6 text-ink-soft">{content.photos.support.caption}</figcaption>
            </figure>
            <Link href={applyHref} className="ed-btn ed-btn-signal mt-6 min-h-[52px] px-7">Apply with EduExpress <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <div>
            <ol data-anim="stagger" className="grid gap-4 sm:grid-cols-2">
              {content.steps.map((item, i) => (
                <li key={item.title} className={kit.cardSage}>
                  <span className="grid size-10 place-items-center rounded-full bg-lime font-display text-[18px] font-black text-petrol-800" aria-hidden="true">{i + 1}</span>
                  <h3 className={`mt-4 ${kit.h3}`}>{item.title}</h3>
                  <p className={`mt-2 ${kit.body}`}>{item.body}</p>
                </li>
              ))}
            </ol>
            <div className={`mt-5 ${kit.cardDark}`}>
              <p className="flex items-center gap-2 text-[21px] font-semibold leading-[1.3] text-lime"><ShieldCheck size={22} aria-hidden="true" />Clear support. Written payment terms.</p>
              <p className="mt-3 text-[16px] leading-7 text-white/85">{visaFirstTerms}</p>
              <Link href="/china-visa-first-policy" className="ed-btn ed-btn-on-dark mt-5 min-h-[48px] px-5">Support package & payment terms <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </Section>

      <div id="china-research-faq" className="scroll-mt-28">
        <FaqBlock items={content.faqs} title="Study in China: your questions answered." />
      </div>

      <CtaBand title="Plan your China study with us." text="Share your results, subject and budget. A counsellor replies within one working day with suitable universities, scholarship routes and every cost in writing." />
    </article>
  );
}
