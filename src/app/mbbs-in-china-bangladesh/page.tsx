import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Check, ExternalLink, GraduationCap, ShieldCheck, Stethoscope } from 'lucide-react';
import MbbsUniversityFinder from '@/components/china/MbbsUniversityFinder';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { getChinaMbbsGuide } from '@/lib/china-mbbs-guide';
import { mbbsApplyHref } from '@/lib/mbbs-enquiry';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;
const SITE = 'https://eduexpressint.com';
const PATH = '/mbbs-in-china-bangladesh';
const canonical = `${SITE}${PATH}`;
const heroImage = { url: '/images/real/china_campus/cie_campus_visit.webp', width: 1600, height: 1200, alt: 'Campus visit at a College of International Education in China' };
const contents = [['Universities & fees', 'mbbs-universities'], ['Scholarships', 'mbbs-scholarships'], ['Eligibility & CSCA', 'mbbs-eligibility'], ['Total cost', 'mbbs-cost'], ['BMDC pathway', 'mbbs-bmdc'], ['Sources', 'mbbs-sources'], ['FAQs', 'mbbs-faq']];
const documents = ['Passport and recent photograph', 'SSC and HSC certificates and full transcripts', 'English-language evidence', 'Required CSCA score report', 'Personal statement or study plan', 'Medical examination and police clearance', 'Financial support documents'];
const visaFirstTerms = 'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';
const related = [
  { title: 'Study in China from Bangladesh', body: 'Explore degrees, education quality and the wider China study plan.', href: '/study-in-china-from-bangladesh' },
  { title: 'Scholarships in China', body: 'Understand coverage, selection and renewal before applying.', href: '/china-scholarships-bangladesh' },
  { title: 'China admission requirements', body: 'Prepare your qualifications, language evidence and CSCA.', href: '/china-admission-requirements' },
  { title: 'Life in China', body: 'Plan accommodation, halal food, language and everyday life.', href: '/life-in-china-bangladeshi-students' },
];
const moreUniversities = [
  { name: 'Shanghai Jiao Tong University', slug: 'shanghai-jiao-tong-university', city: 'Shanghai', fee: '75,000' },
  { name: 'Capital Medical University', slug: 'capital-medical-university', city: 'Beijing', fee: '50,000' },
  { name: 'Zhejiang University', slug: 'zhejiang-university', city: 'Hangzhou', fee: '42,800' },
  { name: 'Nanjing Medical University', slug: 'nanjing-medical-university', city: 'Nanjing', fee: '34,000' },
];
// Official sources recorded in the MBBS research file, shown with their stored labels.
const sourceLabels: Record<string, string> = {
  'moe-english-authorisation': 'Ministry of Education of China: authorisation for English-medium medicine',
  moe: 'Ministry of Education of China: English-medium undergraduate medical education standards',
  'bmdc-rqe': 'Bangladesh Medical & Dental Council: Registration Qualifying Examination documents',
};
const monthYear = (iso?: string) => {
  const date = iso ? new Date(`${iso}T00:00:00Z`) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : undefined;
};
const fullDay = (iso?: string) => {
  const date = iso ? new Date(`${iso}T00:00:00Z`) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : undefined;
};

export async function generateMetadata() {
  const guide = await getChinaMbbsGuide();
  return pageMetadata({
    title: 'MBBS in China for Bangladeshi Students | EduExpress',
    description: guide.description,
    path: PATH,
    image: heroImage,
  });
}

export default async function MbbsChinaPage() {
  const guide = await getChinaMbbsGuide();
  const checkedAt = guide.research?.checkedAt;
  const universityNames = new Map(guide.universities.map(item => [item.id, item.name]));
  const sources = (guide.research?.sources ?? []).flatMap(source => {
    const university = universityNames.get(source.key.replace(/-admission$/, ''));
    const label = university ? `${university}: ${'edition' in source && source.edition ? source.edition : 'published fees'}` : sourceLabels[source.key];
    return label ? [{ label, href: source.url }] : [];
  });
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: 'MBBS in China for Bangladeshi Students', description: guide.description, inLanguage: 'en', isPartOf: { '@id': `${SITE}/#website` }, publisher: { '@id': `${SITE}/#organization` }, breadcrumb: { '@id': `${canonical}#breadcrumb` } },
      { '@type': 'ItemList', name: 'MBBS university options in China', itemListElement: guide.universities.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, url: `${canonical}#mbbs-${item.id}` })) },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Study in China', path: '/study-in-china-from-bangladesh' }, { name: 'MBBS in China' }]}
        eyebrow="Your medical education starts here"
        title="MBBS in China for Bangladeshi students."
        lead="Find an English-taught medical programme that fits your science background, career plans and family budget. Compare universities, tuition and scholarships in one place."
        reviewed={monthYear(checkedAt)}
        actions={
          <>
            <Link href={mbbsApplyHref()} className="ed-btn ed-btn-signal min-h-[52px] px-7">Build my MBBS shortlist <ArrowRight size={18} aria-hidden="true" /></Link>
            <a href="#mbbs-universities" className="ed-btn ed-btn-outline min-h-[52px] px-7">Explore universities</a>
          </>
        }
        aside={
          <figure className="overflow-hidden rounded-3xl bg-white">
            <div className="relative aspect-[4/3]">
              <Image src={heroImage.url} alt="Campus visit outside a College of International Education in China" fill priority sizes="(max-width:1024px) 100vw, 480px" className="object-cover object-[68%_43%]" />
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">Exploring university life in China</figcaption>
            </div>
            <dl className="grid grid-cols-3 divide-x divide-canvas-soft p-5 text-center">
              {[['Duration', '6 years'], ['Teaching', 'English'], ['Qualification', 'MBBS']].map(([label, value]) => (
                <div key={label}><dt className="text-[14px] text-ink-soft">{label}</dt><dd className="mt-1 font-display text-[22px] font-black text-petrol-800">{value}</dd></div>
              ))}
            </dl>
          </figure>
        }
      />

      <TrustBar />

      <section aria-label="Before you choose" className="border-b border-canvas-soft bg-white py-8">
        <div className={`${kit.wrap} grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12`}>
          <p className={kit.body}><strong className="text-petrol-800">Choose an authorised medical programme.</strong> Meet the university’s admission requirements, complete your degree and clinical training, then follow the BMDC examination and registration pathway for practice in Bangladesh.</p>
          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {contents.map(([label, id]) => <a key={id} href={`#${id}`} className="inline-flex min-h-[44px] items-center rounded-full bg-canvas-soft px-4 text-[15px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale">{label}</a>)}
          </nav>
        </div>
      </section>

      <Section
        id="mbbs-universities"
        title="Find your MBBS university in China."
        intro="Start with these six medical programme options. Open the details for accommodation, academic entry, English requirements and funding."
        action={<Link href={mbbsApplyHref()} className="ed-btn ed-btn-outline min-h-[48px] px-6">Get a personal shortlist <ArrowRight size={16} aria-hidden="true" /></Link>}
      >
        <MbbsUniversityFinder universities={guide.universities} />
        <div className="mt-12 border-t border-canvas-soft pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className={kit.h3}>More medical universities to explore</h3>
            <Link href="/universities?country=China&search=medicine" className={kit.link}>Browse the full medical directory <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div data-anim="stagger" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {moreUniversities.map(item => (
              <div key={item.slug}>
                <Link href={`/universities/${item.slug}#programs`} className="group flex h-full flex-col rounded-3xl bg-canvas-soft p-5 transition-colors hover:bg-lime-pale">
                  <h4 className="text-[17px] font-semibold leading-6 text-petrol-800">{item.name}</h4>
                  <p className="mt-1 text-[14px] text-ink-soft">{item.city} · English MBBS · 6 years</p>
                  <p className="mt-4 font-display text-[22px] font-black text-petrol-800">CNY {item.fee}<span className="ml-1 font-sans text-[14px] font-normal text-ink-soft">/year tuition</span></p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[15px] font-semibold text-petrol-800 group-hover:underline">View programmes <ArrowRight size={15} aria-hidden="true" /></span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="mbbs-scholarships"
        tone="sage"
        title="MBBS scholarships: make your budget go further."
        intro="Match the award to your medical programme, then compare coverage, selection and payment timing."
        action={<Link href="/china-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] px-6">Full scholarship guide <ArrowRight size={16} aria-hidden="true" /></Link>}
      >
        <div data-anim="stagger" className="grid gap-4 md:grid-cols-3">
          <div className={kit.card}>
            <p className="text-[14px] font-semibold text-ink-soft">Wenzhou Medical University</p>
            <h3 className="mt-2 font-display text-[30px] font-black leading-none text-petrol-800">Up to CNY 20,000</h3>
            <p className={`mt-3 ${kit.body}`}>Freshman awards of CNY 20,000, 10,000 or 5,000. Assessment follows registration and full tuition payment.</p>
            <a href="#mbbs-wmu" className={`mt-3 ${kit.link}`}>View WMU details <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
          <div className={kit.card}>
            <p className="text-[14px] font-semibold text-ink-soft">Chongqing Medical University</p>
            <h3 className="mt-2 font-display text-[30px] font-black leading-none text-petrol-800">CNY 15,000</h3>
            <p className={`mt-3 ${kit.body}`}>First-year award for selected freshmen, covering 30% of the enrolment quota. Academic documents support selection.</p>
            <a href="#mbbs-cqmu" className={`mt-3 ${kit.link}`}>View CQMU details <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
          <div className={kit.cardLime}>
            <p className="text-[14px] font-semibold text-lime-deep">Your funding plan</p>
            <h3 className={`mt-2 ${kit.h3}`}>Plan each year separately</h3>
            <p className={`mt-3 ${kit.body}`}>Keep freshman awards, later merit awards and government funding as separate routes. Check medical-programme eligibility and continuation terms.</p>
            <Link href={mbbsApplyHref()} className={`mt-3 ${kit.link}`}>Find my scholarship fit <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </Section>

      <Section id="mbbs-eligibility" title="MBBS admission requirements for Bangladeshi students.">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className={kit.lead}>Prepare SSC and HSC or equivalent science qualifications, including Biology, Chemistry and Physics. Universities assess academic results, age, English evidence and entrance performance individually. Choose a programme authorised for its stated teaching language and degree.</p>
            <div data-anim="stagger" className="mt-6 grid gap-4">
              <div className={kit.cardSage}>
                <h3 className={kit.h3}>CSCA: prepare the right subjects</h3>
                <p className={`mt-2 ${kit.body}`}>WMU and JSU list Mathematics and Chemistry; Fudan lists Mathematics, Physics and Chemistry. CQMU lists Mathematics in English for English-medium programmes.</p>
                <Link href="/china-admission-requirements#guide-3-understand-csca-and-language-proof" className={`mt-3 ${kit.link}`}>Explore CSCA preparation <ArrowRight size={15} aria-hidden="true" /></Link>
              </div>
              <div className={kit.cardSage}>
                <h3 className={kit.h3}>English teaching, Chinese clinical communication</h3>
                <p className={`mt-2 ${kit.body}`}>Check accepted English evidence when applying. Build Chinese and medical Chinese alongside your degree for patient communication; HSK requirements follow your university.</p>
                <Link href="/study-in-china-without-ielts" className={`mt-3 ${kit.link}`}>English & MOI options <ArrowRight size={15} aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
          <aside className={`${kit.cardOutline} self-start`}>
            <h3 className={kit.h3}>Your application file</h3>
            <p className={`mt-2 ${kit.body}`}>Prepare these for your selected route. Academic documents apply to both self-funded and scholarship applicants.</p>
            <ul className="mt-5 space-y-3">
              {documents.map(item => <li key={item} className="flex items-start gap-3 text-[16px] leading-6 text-ink-soft"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><Check size={13} strokeWidth={3} aria-hidden="true" /></span>{item}</li>)}
            </ul>
            <p className="mt-5 border-t border-canvas-soft pt-4 text-[15px] leading-6 text-ink-soft">Use English or Chinese translations where required. Add award-specific evidence and any programme-specific documents to this file.</p>
            <Link href={mbbsApplyHref()} className="ed-btn ed-btn-signal mt-5 min-h-[50px] px-6">Get help with my application <ArrowRight size={16} aria-hidden="true" /></Link>
          </aside>
        </div>
      </Section>

      <Section id="mbbs-cost" tone="sage" title="MBBS in China fees: a clear family budget.">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className={kit.lead}>The featured universities list <strong className="text-petrol-800">CNY 30,000–75,000 per year in tuition</strong>. CNY and RMB are the same currency. Build a first-year and later-year plan around your actual room, scholarship and living arrangements.</p>
            <div className={`mt-6 ${kit.card}`}>
              <h3 className={kit.h3}>Example: WMU annual study charges</h3>
              <dl className="mt-3 divide-y divide-canvas-soft text-[16px]">
                {[['Tuition', 'CNY 33,000'], ['Twin-room accommodation', 'CNY 4,400'], ['Insurance', 'CNY 800']].map(([label, value]) => <div key={label} className="flex justify-between gap-3 py-3"><dt className="text-ink-soft">{label}</dt><dd className="shrink-0 font-semibold text-petrol-800">{value}</dd></div>)}
                <div className="flex justify-between gap-3 py-3"><dt className="font-bold text-petrol-800">Annual subtotal</dt><dd className="font-display text-[22px] font-black text-petrol-800">CNY 38,200</dd></div>
              </dl>
              <p className="mt-2 text-[15px] leading-6 text-ink-soft">Before scholarship. Add first-year registration CNY 600, textbooks, living expenses, travel and other applicable charges. Freshman awards are assessed after payment and registration.</p>
              {fullDay(checkedAt) && <p className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-lime-deep"><ShieldCheck size={16} aria-hidden="true" />Fees checked against university sources on {fullDay(checkedAt)}</p>}
            </div>
            <Link href="/study-in-china-cost-bangladesh" className={`mt-4 ${kit.link}`}>Explore the full China cost guide <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className={`${kit.cardLime} self-start`}>
            <h3 className={kit.h3}>Your ClearCost breakdown</h3>
            <dl className="mt-3 divide-y divide-white">
              <div className="py-4"><dt className="text-[16px] font-semibold text-petrol-800">Before China</dt><dd className={`mt-1 ${kit.body}`}>Application fee, deposit or tuition prepayment if required, document preparation, visa, travel and the agreed EduExpress Package.</dd></div>
              <div className="py-4"><dt className="text-[16px] font-semibold text-petrol-800">In China</dt><dd className={`mt-1 ${kit.body}`}>Remaining tuition after any confirmed reduction, accommodation, insurance, medical examination, residence permit, meals and personal expenses.</dd></div>
            </dl>
            <p className="mt-1 text-[15px] leading-6 text-ink-soft">Keep BDT service charges separate from CNY university costs. Include preparation courses as a separate stage and ask how tuition and housing are charged during internship.</p>
            <Link href={mbbsApplyHref()} className="ed-btn ed-btn-signal mt-5 min-h-[50px] px-6">Request my written cost plan <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </Section>

      <Section id="mbbs-course" title="What will you study?" intro="Medical education brings together scientific knowledge, practical skills and patient care. Compare curriculum, hospital training and graduation requirements alongside university reputation.">
        <ol data-anim="stagger" className="grid gap-4 md:grid-cols-3">
          {[
            ['Build the medical sciences', 'Anatomy, physiology, biochemistry, pathology, microbiology and pharmacology establish the scientific foundation.'],
            ['Develop clinical skills', 'Diagnostics, internal medicine, surgery, paediatrics and obstetrics and gynaecology connect learning with patient assessment.'],
            ['Complete clinical training', 'Follow the university’s required rotations, supervised internship and graduation assessments. Keep placement and training records for your licensing route.'],
          ].map(([title, copy], i) => (
            <li key={title} className={kit.cardSage}>
              <span className="font-display text-[34px] font-black leading-none text-petrol-800">0{i + 1}</span>
              <h3 className={`mt-4 ${kit.h3}`}>{title}</h3>
              <p className={`mt-2 ${kit.body}`}>{copy}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="mbbs-bmdc" tone="navy" title="Your route back to medical practice in Bangladesh." intro="Connect your university choice to the Bangladesh Medical & Dental Council pathway from the beginning. Academic admission, medical-school listing and professional registration each serve a different purpose.">
        <ol data-anim="stagger" className="grid gap-4 md:grid-cols-3">
          {[
            ['Choose your programme', 'Match English-taught MBBS to Chinese Ministry of Education authorisation. Meet the university’s science, language and entrance requirements, and understand its clinical-training arrangements.'],
            ['During your degree', 'Complete the curriculum and required clinical training. Retain transcripts, degree documents, internship records and passport and visa evidence of study abroad.'],
            ['Return & register', 'Apply for and pass the BMDC Registration Qualifying Examination. Complete document assessment, applicable internship and registration steps before starting medical practice in Bangladesh.'],
          ].map(([title, copy], i) => (
            <li key={title} className="rounded-3xl border border-white/20 p-6 sm:p-7">
              <span className="text-[14px] font-semibold text-lime">Step {i + 1}</span>
              <h3 className="mt-2 text-[20px] font-semibold text-white">{title}</h3>
              <p className="mt-2 text-[16px] leading-7 text-white/80">{copy}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 border-t border-white/20 pt-5 text-[15px] leading-6 text-white/75">Keep your degree, transcripts, clinical-training records, university recognition evidence and passport and visa history organised for your BMDC application.</p>
      </Section>

      <Section id="mbbs-pathways" tone="sage">
        <div data-anim="stagger" className="grid gap-5 lg:grid-cols-2">
          <div className={kit.card}>
            <span className={kit.iconLime}><BookOpen size={22} aria-hidden="true" /></span>
            <h2 className={`mt-5 ${kit.h3}`}>Need preparation before MBBS?</h2>
            <p className={`mt-2 ${kit.body}`}>A foundation or Chinese language course can strengthen academic and language skills. Choose preparation that aligns with the medical programme’s own entrance requirements, and budget separately for the course and living expenses.</p>
            <Link href="/china-intakes-deadlines" className={`mt-4 ${kit.link}`}>Explore preparation routes and intakes <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className={kit.card}>
            <span className={kit.iconLime}><Stethoscope size={22} aria-hidden="true" /></span>
            <h2 className={`mt-5 ${kit.h3}`}>Considering another health-science degree?</h2>
            <p className={`mt-2 ${kit.body}`}>Dentistry, pharmacy, biotechnology, nursing and rehabilitation lead to different qualifications and career paths. Compare the intended profession, curriculum and registration route before choosing your degree.</p>
            <Link href="/universities?country=China" className={`mt-4 ${kit.link}`}>Find other university programmes <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </Section>

      <Section id="mbbs-apply">
        <div className="grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
          <div data-anim="up" className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src="/images/real/counseling/counseling_global_ambitions.webp" alt="University study counselling at EduExpress International" fill sizes="(max-width:1024px) 100vw, 440px" className="object-cover" />
          </div>
          <div>
            <span className={kit.iconLime}><GraduationCap size={22} aria-hidden="true" /></span>
            <h2 className={`mt-5 ${kit.h2}`}>Turn your medical ambition into a practical plan.</h2>
            <p className={`mt-4 ${kit.lead}`}>Share your SSC and HSC results, science subjects, preferred budget and career goal. EduExpress helps you build a university shortlist, prepare your file and understand your full cost. Parents are welcome to join.</p>
            <Link href={mbbsApplyHref()} className="ed-btn ed-btn-signal mt-6 min-h-[52px] px-7">Apply with EduExpress <ArrowRight size={18} aria-hidden="true" /></Link>
            <div className={`mt-6 ${kit.cardDark}`}>
              <p className="flex items-center gap-2 text-[19px] font-semibold text-lime"><ShieldCheck size={20} aria-hidden="true" />Visa-first payment terms</p>
              <p className="mt-2 text-[16px] leading-7 text-white/85">{visaFirstTerms}</p>
              <Link href="/china-visa-first-policy" className="ed-btn ed-btn-on-dark mt-4 min-h-[48px] px-5">Support package & payment terms <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </Section>

      {sources.length ? (
        <Section id="mbbs-sources" tone="sage" title="Official sources." intro={`The six featured programme examples come from the universities’ own published guides${fullDay(checkedAt) ? `, checked on ${fullDay(checkedAt)}` : ''}. Confirm the current notice for your intake before you pay.`}>
          <ul data-anim="stagger" className="grid gap-3 md:grid-cols-2">
            {sources.map(source => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noopener noreferrer" className="group flex h-full min-h-[64px] items-start justify-between gap-4 rounded-3xl bg-white p-5 transition-colors hover:bg-lime-pale">
                  <span className="text-[16px] font-semibold leading-6 text-petrol-800 group-hover:underline">{source.label}</span>
                  <ExternalLink size={17} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <div id="mbbs-faq" className="scroll-mt-28">
        <FaqBlock items={guide.faqs} title="MBBS in China: your questions answered." tone={sources.length ? 'white' : 'sage'} />
      </div>

      <Section tone={sources.length ? 'sage' : 'white'} title="Keep planning your study in China.">
        <nav aria-label="Related China study guides">
          <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(item => (
              <li key={item.href}>
                <Link href={item.href} className={`group flex h-full flex-col rounded-3xl p-6 transition-colors hover:bg-lime-pale ${sources.length ? 'bg-white' : 'bg-canvas-soft'}`}>
                  <span className="flex items-start justify-between gap-2 text-[17px] font-semibold text-petrol-800">{item.title}<ArrowRight size={17} className="mt-1 shrink-0" aria-hidden="true" /></span>
                  <span className="mt-2 text-[15px] leading-6 text-ink-soft">{item.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <CtaBand title="Plan your MBBS with us." text="Share your SSC and HSC results and budget. A counsellor replies within one working day with suitable medical programmes and the full cost in writing." />
    </article>
  );
}
