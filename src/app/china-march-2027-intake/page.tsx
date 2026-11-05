import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, Check, ChevronDown, FileCheck2, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import March2027Experience from '@/components/campaigns/March2027Experience';
import March2027ContactLink from '@/components/campaigns/March2027ContactLink';
import { JsonLd, TrustBar, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { CHINA_INTAKE_VERIFIED_ON, getChinaIntakes } from '@/lib/china-intakes';
import { canApplyToIntake } from '@/lib/intake-status';
import { publicMarchCatalogue } from '@/lib/march-campaign-catalogue';
import { getChinaMarch2027Landing } from '@/lib/intake-campaigns';
import { ogImage, pageMetadata } from '@/lib/seo';
import { getPublicTrustRecords } from '@/lib/trust-records';

export const revalidate = 1800;
const SITE = 'https://eduexpressint.com';
const PATH = '/china-march-2027-intake';
const canonical = `${SITE}${PATH}`;
const title = 'China March 2027 Intake & Fees | EduExpress International';
const description = 'Compare China March 2027 intake options: university rankings, majors, tuition and scholarships. Get a free personalised application plan from EduExpress.';
export const metadata = pageMetadata({
  title,
  description,
  path: PATH,
  locale: 'en_GB',
  image: ogImage('march-2027', 'Students at a cultural event in China'),
});
const paymentPolicy = 'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';
const documents = [
  ['Academic documents', 'Certificates, transcripts, or current enrolment and expected-graduation evidence.'],
  ['Passport & photograph', 'A valid passport and a recent photograph meeting the programme requirements.'],
  ['Language & supporting evidence', 'HSK or English evidence, health examination, police clearance and financial proof, where required.'],
  ['Postgraduate applicants', 'A study plan, recommendation letters and programme-specific postgraduate documents.'],
];

export default async function Page() {
  const [trust, campaign] = await Promise.all([getPublicTrustRecords().catch(() => null), getChinaMarch2027Landing()]);
  const office = trust?.offices.find(item => item.isHeadOffice) ?? trust?.offices[0];
  const phone = office?.phonePrimary ?? config.contact.phone;
  const whatsapp = config.contact.whatsapp || phone;
  const address = office?.address ?? `${config.contact.address.street}, ${config.contact.address.city} ${config.contact.address.postalCode}`;
  const supportPackage = trust?.servicePackages.find(item => item.slug === 'china-complete-support-package') ?? trust?.servicePackages.find(item => item.destination.toLowerCase() === 'china');
  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello, I would like a study plan for China March 2027 intake.')}`;
  // The intake window comes from the shared China intake calendar, so this page and /china-intakes-deadlines never disagree.
  const marchIntake = getChinaIntakes().find(row => row.activeCampaignHref === PATH);
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: title, description, inLanguage: 'en', isPartOf: { '@id': `${SITE}/#website` }, publisher: { '@id': `${SITE}/#organization` }, breadcrumb: { '@id': `${canonical}#breadcrumb` } },
    { '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: 'China March 2027 intake', item: canonical }] },
    { '@type': 'FAQPage', mainEntity: campaign.faqs.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
    { '@type': 'ItemList', name: 'China spring university planning shortlist', numberOfItems: campaign.universities.length, itemListElement: campaign.universities.map((university, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'CollegeOrUniversity', name: university.name, logo: `${SITE}${university.logo}`, address: { '@type': 'PostalAddress', addressLocality: university.city, addressCountry: 'CN' } } })) },
  ] };

  return <div lang="en" className="min-h-screen bg-white pb-24 text-petrol-800 lg:pb-0">
    <JsonLd data={schema}/>
    <header className="border-b border-canvas-soft bg-white px-5 sm:px-8"><div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 py-3.5"><Link href="/" aria-label="EduExpress International home"><Image src="/logo.png" alt="EduExpress International" width={205} height={58} className="h-auto w-36 sm:w-44" priority/></Link><div className="flex items-center gap-3 sm:gap-4"><March2027ContactLink kind="phone" href={`tel:${phone}`} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-petrol-800"><Phone size={17} aria-hidden="true"/><span className="hidden sm:inline">{formatBangladeshPhone(phone)}</span><span className="sm:hidden">Call</span></March2027ContactLink><March2027ContactLink kind="whatsapp" href={whatsappHref} className="ed-btn ed-btn-soft min-h-11 px-4 text-[15px]"><MessageCircle size={17} aria-hidden="true"/>WhatsApp</March2027ContactLink></div></div></header>

    {marchIntake && <div className="border-b border-canvas-soft bg-lime-pale px-5 sm:px-8"><p className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-[14px] leading-6 text-petrol-800">
      <CalendarCheck size={16} className="shrink-0" aria-hidden="true"/>
      <strong className="font-semibold">March 2027 intake: {marchIntake.status}</strong>
      {canApplyToIntake(marchIntake.status) || marchIntake.status === 'Next Intake'
        ? <span>University deadline {marchIntake.deadlineLabel} · window checked {CHINA_INTAKE_VERIFIED_ON}</span>
        : <span>Ask a counsellor for the current deadline</span>}
      <Link href="/china-intakes-deadlines" className="font-semibold underline underline-offset-4">All China intakes</Link>
    </p></div>}

    <March2027Experience universities={publicMarchCatalogue(campaign.universities)} whatsappNumber={whatsapp}/>

    <TrustBar/>

    <section id="costs" aria-labelledby="cost-title" className="bg-canvas-soft px-5 py-14 sm:px-8 lg:py-20"><div className="mx-auto max-w-[1180px]">
      <div className="max-w-2xl"><h2 id="cost-title" data-anim="up" className={kit.h2}>See the full cost before you commit.</h2><p className={`mt-4 ${kit.lead}`}>Your ClearCost plan separates university fees, living expenses and EduExpress services, so you know what to pay, who receives it and when it is due.</p></div>
      <div data-anim="stagger" className="mt-8 grid gap-4 md:grid-cols-2">{[
        { title: 'Before you travel', subtitle: 'Before China', items: [['University', 'Application fees and any required admission or tuition deposit.'], ['Third parties', 'Any university or third-party costs outside your package, itemised in writing.'], ['EduExpress', 'Your selected package price and written payment terms.']] },
        { title: 'After arrival in China', subtitle: 'In China', items: [['Study', 'Tuition after any supported scholarship reduction.'], ['Stay', 'Accommodation, meals, utilities and personal living expenses.'], ['Formalities', 'Insurance, medical examination, residence permit and other applicable charges.']] },
      ].map(group => <article key={group.subtitle} className={kit.card}><div className="flex flex-wrap items-center justify-between gap-2 border-b border-canvas-soft pb-4"><h3 className={kit.h3}>{group.title}</h3><span className={kit.badge}>{group.subtitle}</span></div><dl className="mt-4 space-y-4">{group.items.map(([label, copy]) => <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-3 text-[16px]"><dt className="font-semibold text-petrol-800">{label}</dt><dd className="leading-7 text-ink-soft">{copy}</dd></div>)}</dl></article>)}</div>
      {supportPackage && <section id="support-package" aria-labelledby="support-package-title" className="mt-6 overflow-hidden rounded-3xl bg-white">
        <div className="grid gap-5 bg-petrol-800 p-6 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-8"><div><p className="text-[14px] font-semibold text-white/75">One package. Application to arrival.</p><h3 id="support-package-title" className="mt-2 font-display text-[28px] font-black leading-[1.05] text-lime">{supportPackage.title}</h3><p className="mt-2 max-w-xl text-[16px] leading-7 text-white/85">{supportPackage.summary}</p></div><div className="sm:text-right"><p className="text-[14px] text-white/70">Complete support package</p><strong className="mt-1 block font-display text-[34px] font-black text-lime">{supportPackage.priceLabel}</strong></div></div>
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_.8fr]"><div><h4 className="text-[17px] font-semibold text-petrol-800">Everything included in your support package</h4><ul className="mt-4 grid gap-3 sm:grid-cols-2">{supportPackage.includedItems.map((entry: string) => <li key={entry} className="flex gap-2.5 text-[15px] leading-6 text-ink-soft"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><Check size={13} strokeWidth={3} aria-hidden="true"/></span>{entry}</li>)}</ul></div><div className={kit.cardLime}><p className="flex items-center gap-2 text-[14px] font-semibold text-lime-deep"><ShieldCheck size={17} aria-hidden="true"/>EduExpress service charge</p><p lang="bn" className="mt-3 text-[1.65rem] font-bold leading-relaxed text-petrol-800">ভিসার আগে এক টাকাও না।</p><p className="mt-2 text-[16px] font-semibold text-petrol-800">No EduExpress service fee before visa approval.</p><p className="mt-3 text-[15px] leading-6 text-ink-soft">University and third-party charges, including required deposits, are separate and itemised in writing before you proceed.</p><Link href="/china-visa-first-policy" className={`mt-3 ${kit.link} text-[15px]`}>Read the payment policy<ArrowRight size={15} aria-hidden="true"/></Link></div></div>
        <details className="group border-t border-canvas-soft"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 text-[16px] font-semibold text-petrol-800 sm:px-8 [&::-webkit-details-marker]:hidden">Package terms & additional study costs<ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true"/></summary><div className="space-y-4 px-6 pb-7 text-[15px] leading-7 text-ink-soft sm:px-8"><p>{supportPackage.outcomeScope}</p><div><h4 className="font-semibold text-petrol-800">Paid separately</h4><ul className="mt-2 list-disc pl-5">{supportPackage.excludedItems.map((entry: string) => <li key={entry}>{entry}</li>)}</ul></div><div><h4 className="font-semibold text-petrol-800">Payment terms</h4><p>{supportPackage.paymentTerms}</p></div><div><h4 className="font-semibold text-petrol-800">Refund terms</h4><p>{supportPackage.refundTerms}</p></div><p>{paymentPolicy}</p><p>Package prices remain in BDT; university fees remain in CNY. No assumed exchange rate is applied.</p></div></details>
      </section>}

    </div></section>

    <section aria-labelledby="file-title" className="px-5 py-14 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-14">
      <div><div data-anim="up" className="relative aspect-[4/3] overflow-hidden rounded-3xl"><Image src="/images/home/consultation-family.webp" alt="A student and parent meeting an EduExpress counsellor at the Dhanmondi office" fill sizes="(max-width:1023px) 100vw, 480px" className="object-cover"/></div><div className="mt-4 flex gap-2.5 text-[15px] leading-6 text-ink-soft"><MapPin size={18} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true"/><p>{address}<br/><span className="font-semibold text-petrol-800">Parents are welcome to join your consultation.</span></p></div></div>
      <div><h2 id="file-title" data-anim="up" className={kit.h2}>Turn your plan into an application.</h2><p className={`mt-4 ${kit.lead}`}>First, we review your profile. Then we agree on the programme, costs and service terms. Your personalised checklist guides the next step: preparing a complete application file.</p><dl className="mt-6 divide-y divide-canvas-soft border-y border-canvas-soft">{documents.map(([label, copy]) => <div key={label} className="flex gap-3.5 py-4"><span className={`${kit.iconLime} !size-10`}><FileCheck2 size={19} aria-hidden="true"/></span><div><dt className="text-[17px] font-semibold text-petrol-800">{label}</dt><dd className="mt-1 text-[15px] leading-6 text-ink-soft">{copy}</dd></div></div>)}</dl><p className="mt-3 text-[15px] leading-6 text-ink-soft">Documents apply to both self-funded and scholarship applicants. Your selected programme determines the final checklist.</p><a href="#march-2027-assessment" className="ed-btn ed-btn-signal mt-6 min-h-[52px] px-7">Get my free study plan<ArrowRight size={18} aria-hidden="true"/></a></div>
    </div></section>

    <section aria-labelledby="faq-title" className="bg-canvas-soft px-5 py-14 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[.65fr_1.35fr] lg:gap-14"><div><h2 id="faq-title" data-anim="up" className={kit.h2}>Questions before your next step?</h2><p className={`mt-4 ${kit.lead}`}>Talk to a counsellor about your specific study goals.</p><March2027ContactLink kind="phone" href={`tel:${phone}`} className="ed-btn ed-btn-outline mt-5 min-h-[52px] px-6"><Phone size={17} aria-hidden="true"/>{formatBangladeshPhone(phone)}</March2027ContactLink></div><div data-anim="stagger" className="grid gap-3">{campaign.faqs.map(item => <details key={item.question} className="faq-smooth group rounded-3xl bg-white px-6"><summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-5 py-4 text-[17px] font-semibold leading-snug text-petrol-800 [&::-webkit-details-marker]:hidden">{item.question}<span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-[22px] leading-none text-petrol-800 transition group-open:rotate-45" aria-hidden="true">+</span></summary><p className="pb-6 pr-10 text-[16px] leading-7 text-ink-soft">{item.answer}</p></details>)}</div></div></section>

    <section className="bg-petrol-800 px-5 py-14 text-white sm:px-8 lg:py-16"><div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><h2 data-anim="pop" className="font-display text-[34px] font-black leading-[0.98] text-lime sm:text-[44px]">Your next step starts with your profile.</h2><p className="mt-3 text-[18px] text-white/85">Your universities, funding options and costs. One clear plan.</p></div><a href="#march-2027-assessment" className="ed-btn ed-btn-signal min-h-[54px] shrink-0 px-7">Get my free study plan<ArrowRight size={18} aria-hidden="true"/></a></div></section>
    <footer className="px-5 py-8 sm:px-8"><div className="mx-auto max-w-[1180px]"><nav aria-label="China study guides" className="flex flex-wrap gap-x-5 gap-y-1 border-b border-canvas-soft pb-5 text-[15px] text-petrol-800">{[['/study-in-china-from-bangladesh','Study in China guide'],['/china-intakes-deadlines','Intakes & deadlines'],['/china-scholarships-bangladesh','Scholarships'],['/study-in-china-cost-bangladesh','Study costs'],['/china-admission-requirements','Admission requirements'],['/china-student-visa-bangladesh','Student visa']].map(([href,label]) => <Link href={href} key={href} className="inline-flex min-h-11 items-center underline underline-offset-4">{label}</Link>)}</nav><div className="mt-5 flex flex-col justify-between gap-3 text-[14px] text-ink-soft sm:flex-row"><p>EduExpress International · Guidance & application support</p><div className="flex flex-wrap gap-x-4"><Link href="/privacy" className="inline-flex min-h-11 items-center">Privacy</Link><Link href="/terms" className="inline-flex min-h-11 items-center">Service terms</Link><Link href="/fees-and-transparency" className="inline-flex min-h-11 items-center">Fee policy</Link><Link href="/contact" className="inline-flex min-h-11 items-center">Contact</Link></div></div></div></footer>
  </div>;
}
