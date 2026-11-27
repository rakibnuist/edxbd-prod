import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CalendarCheck, ChevronRight, Globe2, MapPin, MessageCircle, ShieldCheck, Wallet } from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { JsonLd, Section, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { breadcrumbJsonLd, primaryImageOfPageSchema, type Crumb } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bn/study-in-malaysia-from-bangladesh';
const trail: Crumb[] = [{ name: 'মালয়েশিয়ায় উচ্চশিক্ষা' }];

export const metadata = pageMetadata({
  title: 'মালয়েশিয়ায় উচ্চশিক্ষা, খরচ ও স্টুডেন্ট ভিসা গাইড ২০২৭ (০ টাকা সার্ভিস ফি) | EduExpress',
  description:
    'বাংলাদেশী শিক্ষার্থীদের জন্য মালয়েশিয়ায় ফাউন্ডেশন, ব্যাচেলর, মাস্টার্স ও পিএইচডি গাইড ২০২৭। EMGS eVAL ভিসা প্রসেসিং, টিউশন ফি (BDT) এবং এজু এক্সপ্রেসের ০ টাকা সার্ভিস ফি পলিসি।',
  path: PATH,
  image: ogImage('malaysia', 'Bangladeshi students studying in Malaysia through EduExpress International'),
  locale: 'bn_BD',
  languages: {
    'en-BD': '/study-in-malaysia-from-bangladesh',
    'bn-BD': PATH,
    'x-default': '/study-in-malaysia-from-bangladesh',
  },
});

const bnFeatures = [
  {
    title: '০ টাকা কনসালটেন্সি সার্ভিস ফি (Free Processing)',
    detail:
      'মালয়েশিয়ায় ভর্তির ও ভিসা প্রসেসিংয়ের জন্য EduExpress কোনো ফাইল ওপেনিং চার্জ বা কনসালটেন্সি সার্ভিস ফি নেয় না। শিক্ষার্থী কেবল বিশ্ববিদ্যালয়ের নির্ধারিত টিউশন, EMGS ও মেডিকেল চার্জ সরাসরি প্রদান করে।',
  },
  {
    title: 'EMGS eVAL ভিসা প্রসেসিং (৪–৮ সপ্তাহ)',
    detail:
      'Education Malaysia Global Services (EMGS)-এর মাধ্যমে অনলাইনে ভিসা অ্যাপ্রুভাল লেটার (eVAL) ও সিঙ্গেল এন্ট্রি ভিসা (SEV) প্রসেস করা হয়। আমরা শুরু থেকে ফ্লাইট পর্যন্ত প্রতিটি ধাপের লিখিত চেকলিস্ট দিই।',
  },
  {
    title: 'O-Level, SSC ও HSC-এর পর সরাসরি ভর্তির সুযোগ',
    detail:
      'O-Level বা SSC পাসের পর ১ বছরের ফাউন্ডেশন বা ২.৫ বছরের ডিপ্লোমা এবং HSC/A-Level পাসের পর সরাসরি ব্যাচেলর ডিগ্রিতে (UTM, Taylor’s, APU, Sunway, UCSI, SEGi, INTI) আবেদন করা যায়।',
  },
];

const trustItems = [
  { icon: Wallet, title: 'সার্ভিস ফি ০ টাকা', text: 'মালয়েশিয়ার জন্য কোনো ফাইল ওপেনিং বা এজেন্সি চার্জ নেই' },
  { icon: BadgeCheck, title: 'MQA অনুমোদিত', text: 'প্রতিটি বিশ্ববিদ্যালয় ও প্রোগ্রামের সরকারি স্বীকৃতি যাচাইকৃত' },
  { icon: CalendarCheck, title: '৩টি প্রধান ইনটেক', text: 'জানুয়ারি/ফেব্রুয়ারি, মে/জুন এবং সেপ্টেম্বর/অক্টোবর ইনটেক' },
  { icon: MapPin, title: 'ধানমন্ডি হেড অফিস', text: 'শনি–বৃহস্পতিবার সকাল ১১টা থেকে সন্ধ্যা ৬টা সরাসরি কাউন্সেলিং' },
];

const universityComparison = [
  {
    name: 'Universiti Teknologi Malaysia (UTM)',
    type: 'পাবলিক রিসার্চ ইউনিভার্সিটি (QS Top 200)',
    tuitionBdt: '৩.৫ লক্ষ – ৫.৮ লক্ষ টাকা / বছর',
    programs: 'Computer Science, AI, Civil/Mechanical/Electrical Engineering, MBA',
    ieltsRule: 'IELTS 5.5–6.0 অথবা অনুমোদিত ইংরেজি মিডিয়াম প্রুফ',
  },
  {
    name: 'Asia Pacific University (APU)',
    type: 'শীর্ষ টেকনোলজি ও আইটি বিশ্ববিদ্যালয় (কুয়ালালামপুর)',
    tuitionBdt: '৬.২ লক্ষ – ৮.৫ লক্ষ টাকা / বছর (১০%–৩০% মেরিট ওয়েভার সহ)',
    programs: 'Software Engineering, Cyber Security, Data Science, Business, Dual UK Degree',
    ieltsRule: 'IELTS বা অনলাইন ইংলিশ প্লেসমেন্ট টেস্ট / MOI',
  },
  {
    name: 'Taylor’s University & Sunway University',
    type: 'মালয়েশিয়ার #১ প্রাইভেট বিশ্ববিদ্যালয় ও ওয়েস্টার্ন ট্রান্সফার হাব',
    tuitionBdt: '৭.৫ লক্ষ – ১১.৫ লক্ষ টাকা / বছর (মেরিট স্কলারশিপ উপলব্ধ)',
    programs: 'Hospitality, Business, Computer Science, Architecture, Biosciences',
    ieltsRule: 'IELTS 5.5–6.0 অথবা বিশ্ববিদ্যালয়ের নিজস্ব ইনটেনসিভ ইংলিশ পাথওয়ে',
  },
  {
    name: 'UCSI University / SEGi / INTI International University',
    type: 'সাশ্রয়ী টিউশন ও ক্রেডিট ট্রান্সফার প্রাইভেট ইউনিভার্সিটি',
    tuitionBdt: '৪.২ লক্ষ – ৬.৮ লক্ষ টাকা / বছর (২০%–৫০% পর্যন্ত টিউশন ডিসকাউন্ট)',
    programs: 'BBA, IT, Engineering, Pharmacy, Nursing, Mass Communication, Foundation',
    ieltsRule: 'MOI সার্টিফিকেট বা ক্যাম্পাস ইংলিশ প্লেসমেন্টের মাধ্যমে ভর্তির সুযোগ',
  },
];

const guides = [
  { label: 'Study in Malaysia (English Pillar)', href: '/study-in-malaysia-from-bangladesh' },
  { label: 'মালয়েশিয়ায় পড়াশোনার মোট খরচ (BDT Breakdown)', href: '/malaysia-study-cost-bangladesh' },
  { label: 'মালয়েশিয়া EMGS স্টুডেন্ট ভিসা গাইড', href: '/malaysia-student-visa-bangladesh' },
  { label: 'মালয়েশিয়া স্কলারশিপ ও টিউশন ওয়েভার ২০২৭', href: '/malaysia-scholarships-bangladesh' },
  { label: 'O-Level-এর পর মালয়েশিয়ায় ফাউন্ডেশন ও ডিপ্লোমা', href: '/study-in-malaysia-after-o-level' },
  { label: 'IELTS ছাড়া বিদেশে উচ্চশিক্ষা (MOI গাইড)', href: '/study-abroad-without-ielts-from-bangladesh' },
  { label: 'স্টাডি গ্যাপ গ্রহণযোগ্য দেশগুলোর তালিকা', href: '/study-gap-acceptable-countries-bangladesh' },
  { label: 'স্টুডেন্ট ভিসা ব্যাংক সলভেন্সি ক্যালকুলেটর', href: '/student-visa-bank-solvency-bangladesh' },
  { label: 'বাংলাদেশ স্টাডি অ্যাব্রোড মার্কেট রিপোর্ট (বাংলা)', href: '/bn/bangladesh-study-abroad-market' },
  { label: 'চীনে উচ্চশিক্ষা ও স্কলারশিপ গাইড (বাংলা)', href: '/bn/study-in-china' },
  { label: 'ধানমন্ডি অফিস ও ফ্রি কাউন্সেলিং বুকিং', href: '/education-consultant-dhaka' },
  { label: 'আমাদের লিখিত ফি ও স্বচ্ছতা পলিসি', href: '/fees-and-transparency' },
];

const faqs = [
  {
    q: 'মালয়েশিয়ায় স্টুডেন্ট ভিসার জন্য EduExpress-কে কত টাকা সার্ভিস ফি দিতে হয়?',
    a: '০ টাকা। মালয়েশিয়ার জন্য আমাদের কোনো ফাইল ওপেনিং চার্জ বা কনসালটেন্সি সার্ভিস ফি নেই। অফার লেটারের পর আপনি কেবল বিশ্ববিদ্যালয়ের নির্ধারিত EMGS ভিসা প্রসেসিং ফি এবং টিউশন ডিপোজিট সরাসরি বিশ্ববিদ্যালয়ের একাউন্টে জমা দেবেন।',
  },
  {
    q: 'বাংলাদেশ থেকে মালয়েশিয়ায় পড়াশোনা করতে প্রথম বছরে মোট কত খরচ হয়?',
    a: 'বিশ্ববিদ্যালয় ও প্রোগ্রাম ভেদে বার্ষিক টিউশন ফি সাধারণত ৩.৫ লক্ষ থেকে ৮.৫ লক্ষ টাকা (BDT) এবং কুয়ালালামপুরে থাকা-খাওয়ার খরচ মাসে প্রায় ২৫,০০০ থেকে ৪০,০০০ টাকা। ভর্তির আগে আমরা আপনাকে ১ পাতার লিখিত ClearCost Sheet দিয়ে দিই।',
  },
  {
    q: 'মালয়েশিয়া স্টুডেন্ট ভিসায় (EMGS eVAL) ব্যাংক স্টেটমেন্ট কত টাকা দেখাতে হয়?',
    a: 'অধিকাংশ মালয়েশিয়ান বিশ্ববিদ্যালয়ের অফার লেটার ও EMGS eVAL ধাপে বড় কোনো ব্যাংক ব্লক একাউন্ট লাগে না; তবে ঢাকা হাই কমিশনে Single Entry Visa (SEV) বা ব্যাংক স্টুডেন্ট ফাইল ওপেনিংয়ের জন্য সাধারণত ১০ লক্ষ থেকে ১৫ লক্ষ টাকার (BDT) স্পনসর ব্যাংক ব্যালেন্স রাখা নিরাপদ।',
  },
  {
    q: 'IELTS ছাড়া কি মালয়েশিয়ায় ব্যাচেলর বা মাস্টার্সে আবেদন করা যায়?',
    a: 'হ্যাঁ, অনেক প্রাইভেট ইউনিভার্সিটি ইংরেজি মাধ্যমের (MOI) সনদ অথবা ক্যাম্পাসে পৌঁছানোর পর ইংলিশ প্লেসমেন্ট টেস্টের শর্তে অফার লেটার ও eVAL ইস্যু করে। তবে পাবলিক ইউনিভার্সিটিতে (যেমন UTM বা UM) সাধারণত IELTS 5.5–6.0 বা সমমানের স্কোর প্রয়োজন হয়।',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE}${PATH}#page`,
      url: `${SITE}${PATH}`,
      name: 'বাংলাদেশী শিক্ষার্থীদের জন্য মালয়েশিয়ায় উচ্চশিক্ষা ও ভিসা গাইড ২০২৭',
      inLanguage: 'bn-BD',
      mainEntityOfPage: `${SITE}${PATH}`,
      dateModified: '2026-11-28T00:00:00Z',
      reviewedBy: { '@id': `${SITE}/#organization` },
      isPartOf: { '@id': `${SITE}/#website` },
      publisher: { '@id': `${SITE}/#organization` },
      primaryImageOfPage: primaryImageOfPageSchema('/images/destinations/malaysia-hero.webp'),
      breadcrumb: { '@id': `${SITE}${PATH}#breadcrumb` },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE}${PATH}#faq`,
      mainEntity: faqs.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
  ],
};

export default function BengaliStudyInMalaysiaPage() {
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম। মালয়েশিয়ায় উচ্চশিক্ষা (০ টাকা সার্ভিস ফি) সম্পর্কে কাউন্সেলিং চাই।')}`;

  return (
    <div lang="bn" className="text-petrol-800">
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbJsonLd(trail, PATH)} />

      <section className="bg-canvas-soft pb-14 pt-[96px] sm:pt-[112px] lg:pb-20 lg:pt-[140px]">
        <div className={`${kit.wrap} grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-14`}>
          <div>
            <nav aria-label="ব্রেডক্রাম্ব" className="anim-rise">
              <ol className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold text-ink-soft">
                <li><Link href="/" className="hover:text-petrol-800 hover:underline">হোম</Link></li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight size={14} className="text-ink-mute" aria-hidden="true" />
                  <span aria-current="page" className="text-petrol-800">{trail[0].name}</span>
                </li>
              </ol>
            </nav>
            <p className={`anim-rise mt-6 ${kit.badge}`}>
              <Globe2 size={15} aria-hidden="true" /> মালয়েশিয়া উচ্চশিক্ষা গাইড · ০ টাকা কনসালটেন্সি সার্ভিস ফি
            </p>
            <h1 className="anim-lift mt-5 font-display text-[28px] xs:text-[32px] font-bold leading-[1.25] text-petrol-800 sm:text-[46px] lg:text-[54px] sm:leading-[1.18]">
              বাংলাদেশী শিক্ষার্থীদের জন্য মালয়েশিয়ায় উচ্চশিক্ষা, খরচ ও স্টুডেন্ট ভিসা গাইড ২০২৭
            </h1>
            <p className={`anim-rise mt-6 max-w-2xl ${kit.lead}`}>
              কোনো ফাইল ওপেনিং চার্জ বা এজেন্সি সার্ভিস ফি ছাড়াই মালয়েশিয়ার শীর্ষ MQA-অনুমোদিত বিশ্ববিদ্যালয়ে ফাউন্ডেশন, ব্যাচেলর, মাস্টার্স ও পিএইচডি ভর্তির সম্পূর্ণ লিখিত গাইডলাইন।
            </p>
            <div className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#bn-malaysia-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                ফ্রি প্রোফাইল অ্যাসেসমেন্ট নিন <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link href="/study-in-malaysia-from-bangladesh" hrefLang="en" className="ed-btn ed-btn-outline min-h-[52px] px-7">
                <span lang="en">Read English Malaysia Guide</span>
              </Link>
            </div>
          </div>
          <figure className="anim-rise relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/destinations/malaysia-hero.webp"
                alt="মালয়েশিয়ায় বাংলাদেশী শিক্ষার্থীদের উচ্চশিক্ষা ক্যাম্পাস ও কুয়ালালামপুর স্কাইলাইন"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
              কুয়ালালামপুর ও মালয়েশিয়া ইউনিভার্সিটি হাব
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-label="মালয়েশিয়া ভর্তির মূল সুবিধা" className="border-b border-canvas-soft bg-white py-8">
        <ul data-anim="stagger" className={`${kit.wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
          {trustItems.map(item => (
            <li key={item.title} className="flex items-start gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-petrol-800">
                <item.icon size={20} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[17px] font-bold text-petrol-800">{item.title}</span>
                <span className="block text-[15px] leading-6 text-ink-soft">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Section title="কেন EduExpress-এর মাধ্যমে মালয়েশিয়ায় আবেদন করবেন?">
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-3">
          {bnFeatures.map((feature, index) => (
            <div key={feature.title} className={index === 0 ? kit.cardLime : kit.cardSage}>
              <h2 className="text-[21px] font-semibold text-petrol-800">{feature.title}</h2>
              <p className="mt-3 text-[16px] leading-7 text-ink-soft">{feature.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        tone="sage"
        title="মালয়েশিয়ার শীর্ষ বিশ্ববিদ্যালয় ও আনুমানিক বার্ষিক টিউশন ফি (BDT)"
        intro="নিচের তালিকাটি বাংলাদেশী শিক্ষার্থীদের সবচেয়ে জনপ্রিয় পাবলিক ও প্রাইভেট বিশ্ববিদ্যালয়ের ২০২৭ ইনটেকের টিউশন ও ভর্তির শর্তাবলী তুলে ধরেছে।"
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-sm">
          <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-petrol-800/15 bg-petrol-800 text-white">
                <th className="px-5 py-4 font-semibold">বিশ্ববিদ্যালয়ের নাম</th>
                <th className="px-5 py-4 font-semibold">ক্যাটাগরি ও র‍্যাঙ্কিং</th>
                <th className="px-5 py-4 font-semibold">বার্ষিক টিউশন ফি (আনুমানিক BDT)</th>
                <th className="px-5 py-4 font-semibold">জনপ্রিয় বিষয়সমূহ</th>
                <th className="px-5 py-4 font-semibold">IELTS / ইংরেজি শর্ত</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-800/10">
              {universityComparison.map(uni => (
                <tr key={uni.name} className="hover:bg-canvas-soft/60">
                  <td className="px-5 py-4 font-bold text-petrol-800">{uni.name}</td>
                  <td className="px-5 py-4 text-ink-soft">{uni.type}</td>
                  <td className="px-5 py-4 font-semibold text-petrol-800">{uni.tuitionBdt}</td>
                  <td className="px-5 py-4 text-ink-soft">{uni.programs}</td>
                  <td className="px-5 py-4 text-ink-soft">{uni.ieltsRule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section tone="navy" title="লিখিত ClearCost গ্যারান্টি ও ০ টাকা সার্ভিস ফি পলিসি">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <p className="flex items-start gap-3 text-[18px] leading-8 text-white/90">
            <ShieldCheck size={24} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
            <span>
              মালয়েশিয়ায় আবেদনের ক্ষেত্রে কোনো ফাইল ওপেনিং ফি নেই এবং ভিসা হওয়ার পরেও কোনো EduExpress কনসালটেন্সি সার্ভিস চার্জ নেই। অফার লেটার আসার পর EMGS ফি, টিউশন ডিপোজিট, মেডিকেল এবং বিমান ভাড়ার প্রতিটি হিসাব আমরা ১ পাতার লিখিত ClearCost Sheet-এ প্রদান করি।
            </span>
          </p>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/malaysia-study-cost-bangladesh" hrefLang="en" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              মালয়েশিয়ার সম্পূর্ণ খরচের তালিকা দেখুন
            </Link>
          </div>
        </div>
      </Section>

      <Section title="সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)">
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map(item => (
            <article key={item.q} className={kit.cardSage}>
              <h3 className="text-[19px] font-bold text-petrol-800">{item.q}</h3>
              <p className="mt-2.5 text-[15.5px] leading-7 text-ink-soft">{item.a}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="sage" title="মালয়েশিয়া ও বিদেশে উচ্চশিক্ষার বিস্তারিত গাইড ও ক্যালকুলেটর">
        <nav aria-label="মালয়েশিয়া উচ্চশিক্ষার গাইড">
          <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  hrefLang={item.href.startsWith('/bn/') ? 'bn' : 'en'}
                  className="flex h-full min-h-[64px] items-center justify-between gap-3 rounded-3xl bg-white px-5 py-4 text-[16px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale"
                >
                  {item.label}
                  <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section
        id="bn-malaysia-assessment"
        title="ফ্রি মালয়েশিয়া এডুকেশন ফিট অ্যাসেসমেন্ট"
        intro="আপনার SSC/HSC/O-Level/ব্যাচেলর ফলাফল, পছন্দের বিষয় ও বাজেট জানান। ১ কর্মদিবসের মধ্যে আমাদের কাউন্সেলর উপযুক্ত বিশ্ববিদ্যালয় ও খরচের তালিকা জানাবেন।"
      >
        <EducationFitAssessment />
      </Section>

      <section className="bg-petrol-800 py-16 text-white lg:py-20">
        <div className={`${kit.wrap} flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="max-w-2xl">
            <h2 className="font-display text-[26px] xs:text-[30px] font-bold leading-[1.25] text-lime sm:text-[42px]">
              মালয়েশিয়ায় ০ টাকা সার্ভিস ফিতে আবেদন শুরু করতে চান?
            </h2>
            <p className="mt-4 text-[18px] leading-[1.7] text-white/85">
              ধানমন্ডি অফিসে (বাড়ি ১২/১, রোড ৪/এ, এভারগ্রিন লতিফ, নিচতলা) সরাসরি আসুন অথবা হোয়াটসঅ্যাপে আপনার একাডেমিক ট্রান্সক্রিপ্ট পাঠিয়ে ফ্রি অ্যাসেসমেন্ট নিন।
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a href="#bn-malaysia-assessment" className="ed-btn ed-btn-signal min-h-[54px] px-7">
              ফ্রি অ্যাসেসমেন্ট শুরু করুন <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-on-dark min-h-[54px] px-7">
              <MessageCircle size={18} aria-hidden="true" /> হোয়াটসঅ্যাপে কথা বলুন
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
