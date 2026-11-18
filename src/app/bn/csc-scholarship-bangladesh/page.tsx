import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  Globe2,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import CscaMasterProOfferCard from '@/components/china/CscaMasterProOfferCard';
import BnChinaRelatedGuides from '@/components/page/BnChinaRelatedGuides';
import { CtaBand, FaqBlock, JsonLd, Section, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { breadcrumbJsonLd, citationJsonLd, primaryImageOfPageSchema, type Crumb } from '@/lib/json-ld';
import { toSafeExternalUrl } from '@/lib/safe-url';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bn/csc-scholarship-bangladesh';
const EN_PATH = '/csc-scholarship-bangladesh';

const trail: Crumb[] = [
  { name: 'চীনে উচ্চশিক্ষা', path: '/bn/study-in-china' },
  { name: 'CSC স্কলারশিপ গাইড' },
];

export const metadata = pageMetadata({
  title: 'বাংলাদেশ থেকে CSC স্কলারশিপ ২০২৭: সম্পূর্ণ গাইড | EduExpress',
  description:
    'বাংলাদেশি শিক্ষার্থীদের জন্য চীনা সরকারি (CSC) স্কলারশিপের Type A ও Type B আবেদন পদ্ধতি, মাসিক ভাতা, বয়সসীমা, ডকুমেন্টস ও ভিসা-ফার্স্ট নিয়ম।',
  path: PATH,
  image: ogImage('china', 'Bangladeshi student at Nanjing University of Information Science & Technology'),
  type: 'article',
  locale: 'bn_BD',
  languages: {
    'en-BD': EN_PATH,
    'bn-BD': PATH,
    'x-default': EN_PATH,
  },
});

const visaFirstTermsBn =
  'কোনো ফাইল ওপেনিং চার্জ নেই। চায়না ভিসা অনুমোদনের আগে এডুএক্সপ্রেসের কোনো সার্ভিস ফি নেই। এর আগে বিশ্ববিদ্যালয়, এম্বাসি, মেডিকেল, অনুবাদ, কুরিয়ার, ডিপোজিট বা অন্য কোনো থার্ড-পার্টি ফি প্রয়োজন হলে শিক্ষার্থী এগোনোর আগেই তা লিখিতভাবে তালিকাভুক্ত করা হয়।';

const coverageRows = [
  ['টিউশন ফি', 'সম্পূর্ণ টিউশন মওকুফ (Full award অনুযায়ী)', 'আংশিক স্কলারশিপে আংশিক বা কেবল টিউশন মওকুফ হতে পারে'],
  ['আবাসন (ডরমিটরি)', 'বিনামূল্যে ক্যাম্পাস ডরমিটরি বা নির্ধারিত আবাসন ভাতা', 'আংশিক বা সেল্ফ-ফান্ডেড রুটে সাধারণত নিজের খরচ'],
  ['মাসিক স্টাইপেন্ড (সাধারণ CSC হার)', 'Bachelor CNY ২,৫০০ · Master’s ও General Scholar CNY ৩,০০০ · PhD ও Senior Scholar CNY ৩,৫০০/মাস', 'চূড়ান্ত হার প্রতি বছরের সরকারি বিজ্ঞপ্তি অনুযায়ী নির্ধারিত'],
  ['মেডিকেল ইন্স্যুরেন্স', 'বার্ষিক CNY ৮০০ নীতিগত মেডিকেল বীমা (৬ মাসের কম প্রোগ্রামে CNY ৪০০)', 'এটি নগদ ভাতা নয়; বিমান ভাড়া, পাসপোর্ট ও ব্যক্তিগত খরচ আলাদা'],
];

const routes = [
  {
    tag: 'রুট ০১ · সরকারি ও দূতাবাস চ্যানেল',
    title: 'CSC Type A — Bilateral Program',
    body: 'বাংলাদেশ সরকারের শিক্ষা মন্ত্রণালয় বা ঢাকাস্থ চীনা দূতাবাসসহ নির্ধারিত সরকারি মনোনয়ন কর্তৃপক্ষের মাধ্যমে পরিচালিত হয়। নির্ধারিত আবেদন সময়সূচি, আসন সংখ্যা এবং পূর্ববর্তী একাডেমিক শর্ত থাকে।',
    points: [
      'আলাদা সরকারি মনোনয়ন আবেদন ও এজেন্সি নম্বর প্রয়োজন',
      'আবেদন উইন্ডো সাধারণত বছরের শুরুতে বন্ধ হয়ে যায়',
      'Bachelor, Master’s ও PhD-র জন্য মনোনীত কোটা অনুযায়ী সুযোগ',
    ],
  },
  {
    tag: 'রুট ০২ · সরাসরি বিশ্ববিদ্যালয় চ্যানেল',
    title: 'CSC Type B — University Track',
    body: 'সিএসসি-অনুমোদিত চীনা বিশ্ববিদ্যালয়ের সরাসরি আন্তর্জাতিক ভর্তি পোর্টালের মাধ্যমে আবেদন করা হয়। উচ্চমানের একাডেমিক রেজাল্ট, স্টাডি প্ল্যান এবং রিসার্চ/সুপারভাইজার ফিট এখানে মূল ভূমিকা রাখে।',
    points: [
      'সরাসরি মনোনীত চীনা বিশ্ববিদ্যালয়ের এজেন্সি নম্বরে আবেদন',
      'পোস্টগ্র্যাজুয়েট (Master’s / PhD) রুটে সবচেয়ে বেশি প্রচলিত',
      'আগে থেকেই শক্তিশালী স্টাডি প্ল্যান ও সুপারভাইজার যোগাযোগ সহায়ক',
    ],
  },
];

const documentItems = [
  {
    title: 'পাসপোর্ট ও পরিচয়পত্র',
    detail: 'বৈধ পাসপোর্ট, সাম্প্রতিক পাসপোর্ট সাইজ ছবি ও সিএসসি পোর্টাল আবেদন ফরম। সব একাডেমিক ডকুমেন্টে নাম ও জন্মতারিখ পাসপোর্টের সাথে হুবহু মিল থাকতে হবে।',
  },
  {
    title: 'একাডেমিক সনদ ও নম্বরপত্র',
    detail: 'সর্বশেষ ডিগ্রির নোটারাইজড সার্টিফিকেট ও ট্রান্সক্রিপ্ট (SSC/HSC বা Bachelor/Master’s)। চূড়ান্ত ফলাফল বাকি থাকলে প্রযোজ্য ক্ষেত্রে Expected Graduation সার্টিফিকেট।',
  },
  {
    title: 'ভাষা ও প্রবেশিকা প্রমাণ',
    detail: 'ইংরেজি মাধ্যমের জন্য IELTS, TOEFL, MOI বা সাক্ষাৎকার; এবং আন্ডারগ্র্যাজুয়েট পর্যায়ে বিশ্ববিদ্যালয়ের নির্ধারিত CSCA বিষয়। চাইনিজ মাধ্যমের জন্য HSK ৪/৫।',
  },
  {
    title: 'স্টাডি প্ল্যান ও সুপারিশপত্র',
    detail: 'সুস্পষ্ট Study Plan বা Research Proposal, এবং Master’s/PhD-র জন্য দুটি রিকমেন্ডেশন লেটার ও প্রযোজ্য ক্ষেত্রে সুপারভাইজার Acceptance Letter।',
  },
  {
    title: 'মেডিকেল ও পুলিশ ক্লিয়ারেন্স',
    detail: 'নির্ধারিত ফরমে Foreigner Physical Examination Form এবং নন-ক্রিমিনাল রেকর্ড (পুলিশ ক্লিয়ারেন্স সার্টিফিকেট)।',
  },
  {
    title: 'বয়স ও ইনটেক যাচাই',
    detail: 'অফিশিয়াল সিএসসি নিয়ম অনুযায়ী প্রোগ্রামভেদে বয়সসীমা "কম" (exclusive): Bachelor ২৫ বছরের কম, Master’s ৩৫ বছরের কম, PhD ৪০ বছরের কম, General Scholar ৪৫ বছরের কম ও Senior Scholar ৫০ বছরের কম (ইনটেক ও বিশ্ববিদ্যালয়ের বিজ্ঞপ্তি অনুযায়ী যাচাইযোগ্য)।',
  },
];

const officialLinks = [
  { label: 'CampusChina — অফিশিয়াল CSC পোর্টাল', href: 'https://www.campuschina.org/' },
  { label: 'CSCA — আন্ডারগ্র্যাজুয়েট প্রবেশিকা পোর্টাল', href: 'https://csca.cn/' },
  { label: 'CSCA Master — ফ্রি মক টেস্ট ও প্রস্তুতি প্ল্যাটফর্ম', href: 'https://www.cscamaster.com/' },
  { label: 'ঢাকাস্থ চীনা দূতাবাস — অফিশিয়াল বিজ্ঞপ্তি', href: 'https://bd.china-embassy.gov.cn/eng/' },
  { label: 'চায়না ভিসা সেন্টার ঢাকা (CVASC)', href: 'https://www.visaforchina.cn/DAC4_EN/' },
];

const bnFaqs = [
  {
    question: 'CSC স্কলারশিপ পেলে কি বাংলাদেশ থেকে কোনো টাকা লাগে না?',
    answer:
      'ফুল সিএসসি স্কলারশিপে সাধারণত টিউশন ফি, ক্যাম্পাস ডরমিটরি, মেডিকেল ইন্স্যুরেন্স ও মাসিক স্টাইপেন্ড কাভার থাকে। তবে পাসপোর্ট, ডকুমেন্ট নোটারাইজেশন, মেডিকেল চেকআপ, বিশ্ববিদ্যালয়ের প্রযোজ্য অ্যাপ্লিকেশন ফি, ভিসা ফি এবং বিমান ভাড়া শিক্ষার্থীর নিজস্ব বাজেটে রাখতে হয়।',
  },
  {
    question: 'CSC Type A ও Type B এর মধ্যে মূল পার্থক্য কী?',
    answer:
      'Type A হলো সরকারি ও দূতাবাস (Bilateral) মনোনয়ন রুট, আর Type B হলো সরাসরি চীনা বিশ্ববিদ্যালয়ের (University Track) অধীনে পরিচালিত সিএসসি স্কলারশিপ রুট। দুইটিরই এজেন্সি নম্বর, ডেডলাইন ও আসন সীমা আলাদা।',
  },
  {
    question: 'Bachelor, Master’s ও PhD-র জন্য কোন ইনটেক সবচেয়ে ভালো?',
    answer:
      'September (Autumn) হলো প্রধান ইনটেক এবং পূর্ণ সিএসসি স্কলারশিপের বেশিরভাগ কোটা এই ইনটেকের জন্যই বরাদ্দ থাকে। সাধারণত আগের বছরের নভেম্বর-ডিসেম্বর থেকে প্রস্তুতি শুরু করে জানুয়ারি-মার্চের মধ্যে আবেদন সম্পন্ন করা নিরাপদ।',
  },
  {
    question: 'কেউ কি CSC স্কলারশিপ নিশ্চিতভাবে বা গ্যারান্টি দিয়ে পাইয়ে দিতে পারে?',
    answer:
      'না। ভর্তি, স্কলারশিপ মনোনয়ন এবং ভিসা অনুমোদনের সিদ্ধান্ত সম্পূর্ণভাবে চীনা বিশ্ববিদ্যালয়, সিএসসি কর্তৃপক্ষ ও দূতাবাস গ্রহণ করে। এডুএক্সপ্রেস আপনার প্রোফাইলের সাথে মানানসই রুট নির্বাচন, নির্ভুল ডকুমেন্ট তৈরি এবং ভিসার আগে শূন্য সার্ভিস ফির স্বচ্ছ শর্তে সহায়তা করে।',
  },
  {
    question: 'ভর্তি বা স্কলারশিপ আবেদনের আগে এডুএক্সপ্রেসকে কি কোনো সার্ভিস ফি দিতে হয়?',
    answer: visaFirstTermsBn,
  },
  {
    question: 'এডুএক্সপ্রেসের মাধ্যমে চায়না ফাইল ওপেন করলে কি ফ্রি CSCA Master Pro অ্যাক্সেস পাওয়া যায়?',
    answer:
      'হ্যাঁ। এডুএক্সপ্রেসে ফ্রি এডুকেশন ফিট অ্যাসেসমেন্টের পর যাচাইকৃত চায়না আন্ডারগ্র্যাজুয়েট বা CSC স্কলারশিপ অ্যাপ্লিকেশন ফাইল ওপেন করলে (ফাইল ওপেনিং চার্জ ০ টাকা এবং ভিসার আগে এডুএক্সপ্রেসের কোনো সার্ভিস ফি নেই) আপনি cscamaster.com-এর একটি ফ্রি CSCA Master Pro সিট অ্যাক্টিভেশন কোড (মূল্য CNY ৯৯ / ইনটেক) পাবেন। এতে ১৫৫টি পূর্ণাঙ্গ মক টেস্ট, ২১টি টাইমড অফিশিয়াল প্রশ্নপত্র এবং ২,৮৬৭টি টপিক ড্রিল আনলিমিটেড অনুশীলন করা যায়। অফিশিয়াল CSCA পরীক্ষার রেজিস্ট্রেশন ফি (CNY ৪৫০–৭০০) আলাদাভাবে csca.cn পোর্টালে প্রদেয়।',
  },
];

export default function BengaliCscScholarshipPage() {
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম। চীনে CSC স্কলারশিপ আবেদনের বিষয়ে পরামর্শ চাই।')}`;
  const url = `${SITE}${PATH}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'Article'],
    '@id': `${url}#page`,
    url,
    headline: 'বাংলাদেশ থেকে CSC স্কলারশিপ ২০২৭: Type A, Type B ও পূর্ণাঙ্গ নিয়মাবলী',
    name: 'বাংলাদেশ থেকে চীনা সরকারি (CSC) স্কলারশিপ গাইড',
    description:
      'বাংলাদেশি শিক্ষার্থীদের জন্য CSC স্কলারশিপ Type A এবং Type B রুট, মাসিক ভাতা, প্রয়োজনীয় ডকুমেন্টস ও ভিসা-ফার্স্ট নীতিমালা।',
    inLanguage: 'bn-BD',
    mainEntityOfPage: url,
    image: `${SITE}/og/china.jpg`,
    primaryImageOfPage: primaryImageOfPageSchema('/og/china.jpg'),
    datePublished: '2026-11-15T00:00:00Z',
    dateModified: '2026-11-15T00:00:00Z',
    author: { '@id': `${SITE}/#organization` },
    reviewedBy: { '@id': `${SITE}/#organization` },
    publisher: { '@id': `${SITE}/#organization` },
    isPartOf: { '@id': `${SITE}/#website` },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    ...citationJsonLd(officialLinks),
  };

  return (
    <div lang="bn" className="text-petrol-800">
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbJsonLd(trail, PATH)} />

      <section className="bg-canvas-soft pb-14 pt-[96px] sm:pt-[112px] lg:pb-20 lg:pt-[140px]">
        <div className={`${kit.wrap} grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-14`}>
          <div>
            <nav aria-label="ব্রেডক্রাম্ব" className="anim-rise">
              <ol className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold text-ink-soft">
                <li><Link href="/" className="hover:text-petrol-800 hover:underline">হোম</Link></li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight size={14} className="text-ink-mute" aria-hidden="true" />
                  <Link href="/bn/study-in-china" className="hover:text-petrol-800 hover:underline">চীনে উচ্চশিক্ষা</Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight size={14} className="text-ink-mute" aria-hidden="true" />
                  <span aria-current="page" className="text-petrol-800">CSC স্কলারশিপ গাইড</span>
                </li>
              </ol>
            </nav>
            <p className={`anim-rise mt-6 ${kit.badge}`}><Award size={15} aria-hidden="true" /> চায়না সরকারি স্কলারশিপ ২০২৭ (Type A ও B)</p>
            <h1 className="anim-lift mt-5 font-display text-[36px] font-bold leading-[1.08] text-petrol-800 sm:text-[48px] lg:text-[56px]">
              বাংলাদেশি শিক্ষার্থীদের জন্য CSC স্কলারশিপ সম্পূর্ণ গাইড
            </h1>
            <p className={`anim-rise mt-6 max-w-2xl ${kit.lead}`}>
              চাইনিজ গভর্নমেন্ট স্কলারশিপ (CSC)-এর Type A ও Type B আবেদনের ধাপ, মাসিক স্টাইপেন্ড, প্রয়োজনীয় ডকুমেন্ট এবং প্রাদেশিক/বিশ্ববিদ্যালয় বিকল্প বৃত্তির বাস্তবসম্মত তথ্য।
            </p>
            <div className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#bn-csc-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                স্কলারশিপ যোগ্যতা যাচাই করুন <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link href={EN_PATH} hrefLang="en-BD" className="ed-btn ed-btn-outline min-h-[52px] px-7">
                <Globe2 size={17} aria-hidden="true" /> <span lang="en">Read in English</span>
              </Link>
            </div>
          </div>
          <figure className="anim-rise relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/students/campus-nuist.webp"
                alt="নানজিং-এ চীনা বিশ্ববিদ্যালয় ক্যাম্পাসে শিক্ষার্থী"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover object-[60%_45%]"
              />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
              সঠিক প্রোফাইল ও সময়ে প্রস্তুত হন
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-label="মূল সুবিধাসমূহ" className="border-b border-canvas-soft bg-white py-8">
        <ul data-anim="stagger" className={`${kit.wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
          {[
            { icon: Award, title: 'ফুল ও আংশিক বৃত্তি', text: 'টিউশন, আবাসন ও মাসিক স্টাইপেন্ডের স্পষ্ট বিভাজন' },
            { icon: Calendar, title: 'সেপ্টেম্বর প্রধান ইনটেক', text: 'অধিকাংশ CSC কোটা ডিসেম্বর থেকে মার্চের মধ্যে বন্ধ হয়' },
            { icon: Wallet, title: 'ভিসার আগে ০ সার্ভিস ফি', text: 'চায়না ভিসা অনুমোদনের আগে এডুএক্সপ্রেসের সার্ভিস ফি নেই' },
            { icon: BadgeCheck, title: 'স্বচ্ছ ডকুমেন্ট তালিকা', text: 'আসল সনদ, স্টাডি প্ল্যান ও লিখিত খরচ বিবরণী' },
          ].map(item => (
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

      <Section
        title="CSC স্কলারশিপে কী কী সুবিধা থাকে?"
        intro="স্কলারশিপের ধরন (Full বনাম Partial) এবং ডিগ্রি অনুযায়ী কাভারেজ নির্ধারিত হয়। অফার লেটারে প্রতিটি সুবিধা স্পষ্টভাবে উল্লেখ থাকে।"
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white">
          <table className="w-full min-w-[600px] border-collapse text-left text-[15px] leading-6">
            <caption className="sr-only">CSC স্কলারশিপ কাভারেজ ও মাসিক ভাতা</caption>
            <thead className="bg-canvas-soft">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">খাত</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">ফুল CSC স্কলারশিপ</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">গুরুত্বপূর্ণ নোট</th>
              </tr>
            </thead>
            <tbody>
              {coverageRows.map(([item, full, note]) => (
                <tr key={item} className="border-t border-canvas-soft">
                  <th scope="row" className="px-5 py-4 font-semibold text-petrol-800">{item}</th>
                  <td className="px-5 py-4 font-semibold text-petrol-800">{full}</td>
                  <td className="px-5 py-4 text-ink-soft">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        tone="sage"
        title="CSC আবেদনের দুটি প্রধান রুট: Type A ও Type B"
        intro="একই সময়ে আপনার যোগ্যতা অনুযায়ী সঠিক রুট বেছে নেওয়া জরুরি, যাতে কোনো ডেডলাইন বা এজেন্সি নম্বর মিস না হয়।"
      >
        <div data-anim="stagger" className="grid gap-6 lg:grid-cols-2">
          {routes.map((route, idx) => (
            <div key={route.title} className={idx === 0 ? kit.card : kit.cardLime}>
              <p className="text-[14px] font-semibold text-ink-soft">{route.tag}</p>
              <h3 className={`mt-2 ${kit.h3}`}>{route.title}</h3>
              <p className={`mt-3 ${kit.body}`}>{route.body}</p>
              <ul className="mt-5 space-y-2.5">
                {route.points.map(point => (
                  <li key={point} className="flex items-start gap-2.5 text-[15px] leading-6 text-petrol-800">
                    <CheckCircle2 size={17} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="প্রয়োজনীয় ডকুমেন্টস ও প্রস্তুতি চেকলিস্ট"
        intro="সিএসসি এবং বিশ্ববিদ্যালয় পোর্টালের জন্য নিচের নথিপত্র আগে থেকেই নির্ভুলভাবে গুছিয়ে নিন।"
      >
        <div data-anim="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documentItems.map(doc => (
            <div key={doc.title} className={kit.cardSage}>
              <span className={kit.icon}><FileCheck2 size={20} aria-hidden="true" /></span>
              <h3 className={`mt-4 ${kit.h3}`}>{doc.title}</h3>
              <p className={`mt-2 ${kit.body}`}>{doc.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="bn-csca-master-pro"
        title="এডুএক্সপ্রেসে চায়না ফাইল ওপেন করলেই ফ্রি CSCA Master Pro প্রস্তুতি"
        intro="আন্ডারগ্র্যাজুয়েট সিএসসি স্কলারশিপ ও চীনা বিশ্ববিদ্যালয়ে ভর্তির জন্য CSCA পরীক্ষায় ভালো স্কোর জরুরি। ০ টাকা ফাইল ওপেনিং চার্জে এডুএক্সপ্রেসে ফাইল ওপেন করে cscamaster.com-এর সম্পূর্ণ Pro অ্যাক্সেস নিন।"
      >
        <CscaMasterProOfferCard lang="bn" assessmentHref="#bn-csc-assessment" />
      </Section>

      <Section tone="navy" title="ভিসা-ফার্স্ট সার্ভিস নীতি">
        <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:items-center">
          <div>
            <p className="flex items-start gap-3 text-[18px] leading-8 text-white/90">
              <ShieldCheck size={24} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
              <span>{visaFirstTermsBn}</span>
            </p>
            <p className="mt-4 text-[15px] leading-7 text-white/75">
              অফিশিয়াল পোর্টাল:{' '}
              {officialLinks.map((src, i) => {
                const safeHref = toSafeExternalUrl(src.href);
                return safeHref ? (
                  <span key={src.href}>
                    {i > 0 ? ' · ' : ''}
                    <a href={safeHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-lime underline underline-offset-4">
                      {src.label} <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  </span>
                ) : null;
              })}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              WhatsApp-এ কথা বলুন <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link href="/china-visa-first-policy" hrefLang="en" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">
              <span lang="en">Visa-first policy</span>
            </Link>
          </div>
        </div>
      </Section>

      <div id="bn-csc-faq" className="scroll-mt-28">
        <FaqBlock items={bnFaqs} title="সিএসসি স্কলারশিপ সম্পর্কে সাধারণ প্রশ্নোত্তর" tone="white" />
      </div>

      <BnChinaRelatedGuides
        currentPath={PATH}
        englishTwin={{ label: 'CSC Scholarship Guide (English)', href: EN_PATH }}
        ariaLabel="সম্পর্কিত গাইড"
      />

      <Section id="bn-csc-assessment" title="আপনার CSC স্কলারশিপ ফিট যাচাই করুন" intro="আপনার SSC, HSC বা স্নাতক ফলাফল, পছন্দের সাবজেক্ট ও বাজেট জানান। একজন কাউন্সেলর ১ কার্যদিবসের মধ্যে আপনার উপযোগী স্কলারশিপ ও বিশ্ববিদ্যালয়ের তালিকা লিখিতভাবে দেবেন।">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="সঠিক তথ্যের ভিত্তিতে স্কলারশিপ আবেদন শুরু করুন"
        text="কোনো ফাইল ওপেনিং চার্জ নেই। প্রোফাইল যাচাইয়ের পর লিখিত খরচ ও ইনটেক পরিকল্পনা বুঝে তবেই আবেদন শুরু করুন।"
      />
    </div>
  );
}
