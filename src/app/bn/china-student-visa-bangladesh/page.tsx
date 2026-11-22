import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  FileCheck2,
  FileText,
  HelpCircle,
  Landmark,
  MapPin,
  PhoneCall,
  Plane,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wallet,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import BnChinaRelatedGuides from '@/components/page/BnChinaRelatedGuides';
import { JsonLd, Section, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { breadcrumbJsonLd, citationJsonLd, primaryImageOfPageSchema, type Crumb } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bn/china-student-visa-bangladesh';
const EN_PATH = '/china-student-visa-bangladesh';
const trail: Crumb[] = [
  { name: 'চীনে উচ্চশিক্ষা', path: '/bn/study-in-china' },
  { name: 'চায়না স্টুডেন্ট ভিসা (X1 ও X2) সম্পূর্ণ গাইড' },
];

export const metadata = pageMetadata({
  title: 'চায়না স্টুডেন্ট ভিসা (X1 ও X2) গাইড ২০২৭ | EduExpress',
  description:
    'চায়না স্টুডেন্ট ভিসা (X1/X2) আবেদন নির্দেশিকা: JW202/JW201 ফর্ম, ঢাকা ভিসা সেন্টার ডকুমেন্টস চেকলিস্ট ও ভিসা নিশ্চিতের আগে BDT 0 সার্ভিস ফি।',
  path: PATH,
  image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing'),
  type: 'article',
  locale: 'bn_BD',
  languages: {
    'en-BD': EN_PATH,
    'bn-BD': PATH,
    'x-default': EN_PATH,
  },
});

const visaTypes = [
  {
    type: 'X1 Visa (দীর্ঘমেয়াদী পড়াশোনা)',
    period: '১৮০ দিনের বেশি সময়কাল',
    courses: 'Bachelor, Master’s, PhD, MBBS এবং ১ বছরের ডিপ্লোমা বা ল্যাঙ্গুয়েজ কোর্স',
    features: [
      'চীনে প্রবেশের পর ৩০ দিনের মধ্যে স্থানীয় PSB থেকে Residence Permit-এ রূপান্তর করতে হয়',
      'Residence Permit ইস্যুর পর নির্ধারিত মেয়াদে একাধিকবার আসা-যাওয়া (Multiple Entry) করা যায়',
      'JW201 (CSC/সরকারি) অথবা JW202 ফর্ম এবং অফিশিয়াল Admission Notice আবশ্যক',
      'মেডিকেল সার্টিফিকেট (Physical Examination Record) ও ব্যাংক/স্কলারশিপ প্রমাণ প্রযোজ্য',
    ],
    tag: 'সর্বাধিক জনপ্রিয় ক্যাটাগরি',
    badgeTone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    type: 'X2 Visa (স্বল্পমেয়াদী পড়াশোনা)',
    period: '১৮০ দিন বা তার কম সময়কাল',
    courses: '১ সেমিস্টার শর্ট-টার্ম ল্যাঙ্গুয়েজ কোর্স, সামার স্কুল বা স্পেশালাইজড ট্রেনিং',
    features: [
      'চীনে পৌঁছানোর পর Residence Permit-এ কনভার্ট করার প্রয়োজন হয় না',
      'সাধারণত সিঙ্গেল এন্ট্রি (Single Entry) ভিসা হিসেবে ইস্যু করা হয়',
      'বিশ্ববিদ্যালয়ের অফিশিয়াল Admission Notice ও ইনভাইটেশন লেটার প্রয়োজন',
      'অপেক্ষাকৃত কম কাগজপত্র ও দ্রুত প্রসেসিং সুবিধা',
    ],
    tag: 'শর্ট-টার্ম এক্সচেঞ্জ ও ট্রেনিং',
    badgeTone: 'bg-blue-50 text-blue-800 border-blue-200',
  },
];

const checklistCategories = [
  {
    title: '১. ব্যক্তিগত ও পাসপোর্ট ডকুমেন্টস',
    items: [
      'মূল পাসপোর্ট (কমপক্ষে ৬ মাসের মেয়াদ ও ২টি ফাঁকা পৃষ্ঠা থাকতে হবে)',
      'পূর্ববর্তী কোনো পাসপোর্ট থাকলে তার মূল কপি ও ফটোকপি',
      'সদ্য তোলা পাসপোর্ট সাইজ ছবি (সাদা ব্যাকগ্রাউন্ড, চশমা ছাড়া, চাইনিজ ভিসা স্পেসিফিকেশন অনুযায়ী)',
      'জাতীয় পরিচয়পত্র (NID) অথবা জন্ম সনদের ফটোকপি',
    ],
  },
  {
    title: '২. চাইনিজ বিশ্ববিদ্যালয় থেকে প্রাপ্ত ডকুমেন্টস',
    items: [
      'মূল Admission Notice (অফিসিয়াল ভর্তি অনুমোদন পত্র ও ফটোকপি)',
      'JW201 অথবা JW202 Form (ডিজিটাল বারকোডযুক্ত মূল কপি ও ফটোকপি)',
      'স্কলারশিপ অ্যাওয়ার্ড কনফার্মেশন লেটার (যদি স্কলারশিপ পেয়ে থাকেন)',
      'বিশ্ববিদ্যালয়ের টিউশন ও ডরমিটরি ইনভয়েস বা ফি বিবরণী',
    ],
  },
  {
    title: '৩. শিক্ষা ও একাডেমিক ডকুমেন্টস',
    items: [
      'সকল একাডেমিক সার্টিফিকেট ও নম্বরপত্রের মূল ও নোটারাইজড কপি',
      'প্রোগ্রাম, বিশ্ববিদ্যালয় বা ভিসা-সেন্টারের চাহিদা অনুযায়ী শিক্ষা বোর্ড বা MOFA সত্যায়ন',
      'প্রযোজ্য ভাষা প্রমাণপত্র (IELTS / HSK / বিশ্ববিদ্যালয় অনুমোদিত MOI বা ইন্টারভিউ প্রমাণ)',
      'স্টাডি প্ল্যান বা পার্সোনাল স্টেটমেন্ট (যে প্রোগ্রামে প্রযোজ্য)',
    ],
  },
  {
    title: '৪. মেডিকেল ও পুলিশ ক্লিয়ারেন্স',
    items: [
      'Physical Examination Record for Foreigner (অধ্যয়নের মেয়াদ অনুযায়ী প্রযোজ্য হলে)',
      'রক্ত পরীক্ষা, বুকের এক্স-রে, ইসিজি ও ডাক্তারের সিল-স্বাক্ষরযুক্ত রিপোর্ট (মেয়াদ ও ফর্ম্যাট নির্দেশিকা অনুযায়ী)',
      'পুলিশ ক্লিয়ারেন্স সার্টিফিকেট (Police Clearance Certificate - PCC)',
      'প্রয়োজন অনুযায়ী নোটারাইজড বা সত্যায়িত কপি ও অনলাইন আপলোড কপি',
    ],
  },
];

const dhakaProcessSteps = [
  {
    step: '০১',
    title: 'অনলাইন ভিসা অ্যাপ্লিকেশন ও ডকুমেন্ট আপলোড',
    desc: 'চাইনিজ ভিসা অ্যাপ্লিকেশন সার্ভিস সেন্টারের পোর্টালে নির্ভুলভাবে আবেদন ফর্ম পূরণ করে পাসপোর্ট ও এডমিশন পেপার্স আপলোড করতে হয়।',
  },
  {
    step: '০২',
    title: 'প্রাক-যাচাই ও অ্যাপয়েন্টমেন্ট শিডিউলিং',
    desc: 'অনলাইন স্ক্রুটিনি সম্পন্ন হলে ভিসা সেন্টার থেকে ফাইল সাবমিশনের অনুমোদন দেওয়া হয় এবং পাসপোর্ট ড্রপ-অফের তারিখ নির্ধারণ করা হয়।',
  },
  {
    step: '০৩',
    title: 'ঢাকায় পাসপোর্ট সাবমিশন ও বায়োমেট্রিক',
    desc: 'নির্ধারিত দিনে ঢাকায় ভিসা সেন্টারে গিয়ে মূল পাসপোর্ট, JW202, মেডিকেল রিপোর্ট ও অন্যান্য কাগজপত্র জমা দিয়ে বায়োমেট্রিক দিতে হয়।',
  },
  {
    step: '০৪',
    title: 'ভিসা স্ট্যাম্পিং ও পাসপোর্ট সংগ্রহ',
    desc: 'ভিসা অনুমোদন শেষে নির্ধারিত তারিখে এম্বাসি রসিদ দেখিয়ে স্ট্যাম্পড পাসপোর্ট সংগ্রহ করতে হয়। জরুরি প্রয়োজনে এক্সপ্রেস সার্ভিস নেওয়া যায়।',
  },
];

const arrivalChecklist = [
  {
    step: '১',
    title: 'ক্যাম্পাসে পৌঁছানো ও রেজিস্ট্রেশন',
    desc: 'বিশ্ববিদ্যালয়ের নির্ধারিত ওরিয়েন্টেশন ডেটে উপস্থিত হয়ে ইন্টারন্যাশনাল স্টুডেন্ট অফিসে মূল JW202 ও Admission Notice জমা দিতে হয়।',
  },
  {
    step: '২',
    title: 'লোকাল ব্যাংক অ্যাকাউন্ট ও সিম কার্ড',
    desc: 'ক্যাম্পাসেই চাইনিজ ব্যাংক অ্যাকাউন্ট (ICBC/BOC/ABC) খুলে দেওয়া হয় এবং মোবাইল সিম চালু করে Alipay ও WeChat Pay যুক্ত করা হয়।',
  },
  {
    step: '৩',
    title: 'লোকাল মেডিকেল ভেরিফিকেশন',
    desc: 'চীনের লোকাল হেলথ ব্যুরোতে গিয়ে বাংলাদেশের মেডিকেল রিপোর্টের ভেরিফিকেশন বা কনফার্মেশন টেস্ট সম্পন্ন করা হয়।',
  },
  {
    step: '৪',
    title: 'Residence Permit আবেদন (৩০ দিনের মধ্যে)',
    desc: 'X1 ভিসাধারীদের চীনে প্রবেশের ঠিক ৩০ দিনের মধ্যে স্থানীয় Public Security Bureau (PSB) থেকে রেসিডেন্স পারমিট কার্ড গ্রহণ করতে হয়।',
  },
];

const faqs = [
  {
    q: 'চায়না স্টুডেন্ট ভিসা প্রসেসিং হতে কত দিন সময় লাগে?',
    a: 'ভিসা প্রসেসিং সময় অনলাইন প্রাক-যাচাই (pre-check), বায়োমেট্রিক জমা ও দূতাবাসের তাৎক্ষণিক কর্মচাপের ওপর নির্ভর করে—CVASC ঢাকা পোর্টালে বর্তমান সময়সূচি দেখা যায়। এডমিশন লেটার হাতে পাওয়ার আগে নন-রিফান্ডেবল ফ্লাইট টিকিট না কেনাই নিরাপদ।',
  },
  {
    q: 'X1 ভিসা পাওয়ার পর কি চীনে আর কোনো কাগজপত্র করতে হয়?',
    a: 'হ্যাঁ। X1 ভিসা ১৮০ দিনের বেশি অধ্যয়নের এন্ট্রি ভিসা—চীনে পৌঁছানোর ৩০ দিনের মধ্যে বিশ্ববিদ্যালয়ের সহায়তায় স্থানীয় PSB (Public Security Bureau) অফিসে আবেদন করে এটিকে পূর্ণ মেয়াদের Residence Permit-এ রূপান্তর করতে হয়।',
  },
  {
    q: 'ভিসার জন্য ব্যাংকে কত টাকা দেখাতে হয়?',
    a: 'পূর্ণ CSC বা সম্পূর্ণ স্কলারশিপ থাকলে অফিশিয়াল স্কলারশিপ অ্যাওয়ার্ড প্রমাণ প্রযোজ্য হয়। স্ব-অর্থায়িত (Self-funded) X1 আবেদনে ঢাকাস্থ চীনা দূতাবাসের প্রকাশিত নির্দেশনা অনুযায়ী প্রতি শিক্ষাবর্ষের জন্য অন্তত USD ২,৫০০ সমপরিমাণ ব্যাংক প্রমাণ চাওয়া হয়—এটি নথিগত মানদণ্ড মাত্র, সম্পূর্ণ পড়াশোনার মোট বাজেট নয়।',
  },
  {
    q: 'ভিসা না হলে বা ভিসার আগে EduExpress-কে কি কোনো সার্ভিস চার্জ দিতে হবে?',
    a: 'না। আমাদের Visa-First নীতিমালা অনুযায়ী কোনো ফাইল ওপেনিং চার্জ নেই এবং চায়না ভিসা অনুমোদনের পূর্বে EduExpress কোনো সার্ভিস ফি নেয় না। ভিসা অনুমোদনের পরেই Complete China Support Package-এর নির্ধারিত সার্ভিস ফি BDT ২,০০,০০০ (অথবা লিখিত চুক্তিতে নির্ধারিত শর্ত) প্রদেয়; বিশ্ববিদ্যালয় বা থার্ড-পার্টি ফি আগে প্রযোজ্য হলে তা আগেই লিখিতভাবে জানানো হয়।',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': ['WebPage', 'Article'],
  '@id': `${SITE}${PATH}#article`,
  url: `${SITE}${PATH}`,
  headline: 'চায়না স্টুডেন্ট ভিসা (X1 ও X2) আবেদন গাইড ২০২৭: ঢাকা এম্বাসি প্রসেস',
  description:
    'বাংলাদেশী শিক্ষার্থীদের জন্য চায়না স্টুডেন্ট ভিসা আবেদন, ঢাকা ভিসা সেন্টারের নিয়মাবলী ও পোস্ট-অ্যারাইভাল গাইড।',
  image: `${SITE}/og/china.jpg`,
  primaryImageOfPage: primaryImageOfPageSchema('/og/china.jpg'),
  inLanguage: 'bn-BD',
  mainEntityOfPage: `${SITE}${PATH}`,
  datePublished: '2026-11-15T00:00:00Z',
  dateModified: '2026-11-15T00:00:00Z',
  author: { '@id': `${SITE}/#organization` },
  reviewedBy: { '@id': `${SITE}/#organization` },
  publisher: { '@id': `${SITE}/#organization` },
  isPartOf: { '@id': `${SITE}/#website` },
  breadcrumb: { '@id': `${SITE}${PATH}#breadcrumb` },
  ...citationJsonLd([
    { label: 'Chinese Embassy in Bangladesh', href: 'https://bd.china-embassy.gov.cn/eng/' },
    { label: 'Chinese Embassy Bangladesh Visa Application Agencies Notice', href: 'https://bd.china-embassy.gov.cn/eng/lsyw/lsxx/202605/t20260520_11914015.htm' },
    { label: 'Chinese Visa Application Service Center in Dhaka (CVASC)', href: 'https://www.visaforchina.cn/DAC4_EN/' },
  ]),
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};

export default function BengaliChinaVisaPage() {
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম। চায়না স্টুডেন্ট ভিসা (X1/X2) প্রসেসিং ও ডকুমেন্টস নিয়ে বিস্তারিত পরামর্শ চাই।')}`;

  return (
    <div lang="bn" className="text-petrol-800">
      <JsonLd data={structuredData} />
      <JsonLd data={faqStructuredData} />
      <JsonLd data={breadcrumbJsonLd(trail, PATH)} />

      {/* Hero */}
      <section className="bg-canvas-soft pb-14 pt-[96px] sm:pt-[112px] lg:pb-20 lg:pt-[140px]">
        <div className={`${kit.wrap} max-w-4xl text-center mx-auto`}>
          <nav aria-label="ব্রেডক্রাম্ব" className="flex justify-center mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold text-ink-soft">
              <li>
                <Link href="/" className="hover:text-petrol-800 hover:underline">
                  হোম
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} className="text-ink-mute" aria-hidden="true" />
                <Link href="/bn/study-in-china" className="hover:text-petrol-800 hover:underline">
                  চীনে উচ্চশিক্ষা
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} className="text-ink-mute" aria-hidden="true" />
                <span className="text-petrol-800">চায়না স্টুডেন্ট ভিসা গাইড</span>
              </li>
            </ol>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-lime/25 px-4 py-1.5 text-[13px] font-bold text-petrol-800 tracking-wide">
            <ShieldCheck size={16} className="text-petrol-800" /> ঢাকা চাইনিজ এম্বাসি স্ট্যান্ডার্ড গাইডলাইন
          </span>

          <h1 className="mt-4 font-display text-[26px] xs:text-[30px] font-black leading-[1.25] sm:text-[44px] lg:text-[52px] sm:leading-tight">
            চায়না স্টুডেন্ট ভিসা (X1 ও X2) সম্পূর্ণ গাইডলাইন
          </h1>

          <p className="mt-5 text-[17px] leading-relaxed text-ink-soft sm:text-[19px]">
            ভিসার আগে BDT 0 সার্ভিস ফি। JW202 ফর্ম, এম্বাসি ডকুমেন্টস চেকলিস্ট, বায়োমেট্রিক এবং চীনে পৌঁছানোর পরবর্তী Residence Permit-এর নির্ভুল নির্দেশিকা।
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#checklist" className="ed-btn ed-btn-signal min-h-[50px] px-7">
              প্রয়োজনীয় ডকুমেন্টস চেকলিস্ট <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="ed-btn ed-btn-outline min-h-[50px] px-7 inline-flex items-center gap-2"
            >
              <PhoneCall size={16} /> ভিসা কাউন্সেলরের সাথে পরামর্শ করুন
            </a>
          </div>
        </div>
      </section>

      {/* Trust & Key Metrics Bar */}
      <div className="border-y border-rule bg-white py-6">
        <div className={`${kit.wrap} grid grid-cols-2 gap-6 lg:grid-cols-4`}>
          <div className="flex items-center gap-3">
            <Wallet className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">ভিসার পূর্বে BDT 0</p>
              <p className="text-[13px] text-ink-soft">ভিসা স্ট্যাম্পিং ছাড়া কোনো সার্ভিস ফি নেই</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileCheck2 className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">JW202 / JW201 সাপোর্ট</p>
              <p className="text-[13px] text-ink-soft">অফিশিয়াল বারকোডযুক্ত ভিসা ডকুমেন্টস</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">CVASC ঢাকা প্রক্রিয়া</p>
              <p className="text-[13px] text-ink-soft">অফিশিয়াল পোর্টালে অনলাইন প্রাক-যাচাই ও জমা</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeCheck className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">সতর্ক ডকুমেন্ট যাচাই</p>
              <p className="text-[13px] text-ink-soft">পাসপোর্ট, তারিখ ও নাম হুবহু মিলিয়ে প্রস্তুতি</p>
            </div>
          </div>
        </div>
      </div>

      {/* X1 vs X2 Visa Comparison */}
      <Section
        title="X1 নাকি X2: আপনার জন্য কোন ভিসা ক্যাটাগরি প্রযোজ্য?"
        intro="কোর্সের মেয়াদ ও স্টাডি লেভেলের ওপর ভিত্তি করে চাইনিজ ভিসা অথরিটি ভিসা ক্যাটাগরি নির্ধারণ করে:"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {visaTypes.map((v) => (
            <div
              key={v.type}
              className="rounded-3xl border border-rule bg-white p-7 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span
                  className={`inline-block rounded-full border px-3.5 py-1 text-[13px] font-bold ${v.badgeTone}`}
                >
                  {v.tag}
                </span>
                <h3 className="mt-4 text-[22px] font-bold text-petrol-800">{v.type}</h3>
                <p className="mt-1 text-[15px] font-semibold text-emerald-800">{v.period}</p>
                <p className="mt-3 text-[14px] text-ink-soft bg-canvas-soft rounded-xl p-3 border border-rule">
                  <span className="font-bold text-petrol-800 block">প্রযোজ্য কোর্সসমূহ:</span>
                  {v.courses}
                </p>

                <ul className="mt-5 space-y-2.5 text-[14px] text-ink-soft">
                  {v.features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={17} className="text-emerald-700 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-rule">
                <Link
                  href="/china-admission-requirements"
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-petrol-800 hover:text-lime"
                >
                  ভর্তির প্রয়োজনীয় যোগ্যতা ও ডকুমেন্টস দেখুন <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Detailed Document Checklist */}
      <section id="checklist">
        <Section
          tone="sage"
          title="ঢাকা চাইনিজ এম্বাসির নির্ভুল ডকুমেন্টস চেকলিস্ট"
          intro="ভিসা সেন্টারে ফাইল জমা দেওয়ার পূর্বে নিচের প্রতিটি ডকুমেন্ট যথাযথভাবে প্রস্তুত ও সত্যায়ন করে নিতে হবে:"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {checklistCategories.map((cat) => (
              <div key={cat.title} className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
                <h3 className="text-[18px] font-bold text-petrol-800 border-b border-rule pb-3">
                  {cat.title}
                </h3>
                <ul className="mt-4 space-y-3 text-[14px] text-ink-soft">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6 flex items-start gap-4">
            <ShieldAlert className="size-6 text-amber-700 shrink-0 mt-1" />
            <div>
              <h4 className="text-[16px] font-bold text-amber-900">
                জরুরি ডকুমেন্ট টিপস: নামের বানান ও সত্যায়ন
              </h4>
              <p className="mt-1 text-[14px] leading-relaxed text-amber-800">
                পাসপোর্ট, জাতীয় পরিচয়পত্র, একাডেমিক সার্টিফিকেট এবং JW202 ফর্মে শিক্ষার্থীর নামের বানান ও জন্মতারিখ হুবহু এক হতে হবে। কোনো ধরনের অসঙ্গতি থাকলে ভিসা প্রসেসিং বিলম্বিত হতে পারে। এছাড়া মেডিকেল রিপোর্টের মেয়াদ ৬ মাস থাকে, তাই ভিসা আবেদনের কাছাকাছি সময়ে মেডিকেল করা সবচেয়ে নিরাপদ।
              </p>
            </div>
          </div>
        </Section>
      </section>

      {/* Dhaka Application Process */}
      <Section
        title="ঢাকায় ভিসা আবেদন সম্পন্ন করার ৪টি সহজ ধাপ"
        intro="চাইনিজ ভিসা অ্যাপ্লিকেশন সার্ভিস সেন্টার (CVASC) ঢাকা এর নিয়ম অনুযায়ী আবেদন প্রক্রিয়া:"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dhakaProcessSteps.map((s) => (
            <div key={s.step} className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-petrol-800 font-display text-[17px] font-black text-lime">
                {s.step}
              </span>
              <h3 className="mt-4 text-[17px] font-bold text-petrol-800">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Post-Visa & Arrival in China */}
      <Section
        tone="sage"
        title="ভিসা পাওয়ার পর ও চীনে পৌঁছানোর পরবর্তী ধাপসমূহ"
        intro="চীনে পা রাখার পর প্রথম ৩০ দিনের মধ্যে যেসব অফিশিয়াল কাজ সম্পন্ন করতে হবে:"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {arrivalChecklist.map((item) => (
            <div key={item.step} className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
              <span className="grid size-9 place-items-center rounded-xl bg-lime/25 text-[15px] font-bold text-petrol-800">
                {item.step}
              </span>
              <h3 className="mt-3 text-[17px] font-bold text-petrol-800">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* EduExpress Commercial Policy */}
      <Section
        title="EduExpress-এর সার্ভিস চার্জ ও Visa-First প্রতিশ্রুতি"
        intro="আমরা কোনো অগ্রিম সার্ভিস ফি নিয়ে আপনাকে আশ্বাসের ফাঁদে ফেলি না।"
      >
        <div className="rounded-3xl bg-petrol-800 text-white p-8 lg:p-12 shadow-md">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/20 px-3.5 py-1 text-[13px] font-semibold text-lime">
                <ShieldCheck size={16} /> ভিসা-ফার্স্ট (Visa-First) পলিসি
              </span>
              <h3 className="mt-4 font-display text-[26px] font-bold sm:text-[32px]">
                ভিসা অনুমোদনের আগে আমাদের সার্ভিস ফি BDT 0
              </h3>
              <p className="mt-4 text-[16px] leading-relaxed text-white/85">
                চায়না প্যাকেজের জন্য ফাইল ওপেনিং চার্জ সম্পূর্ণ ০ টাকা। চায়না স্টুডেন্ট ভিসা অনুমোদনের পূর্বে EduExpress কোনো কনসালটেন্সি সার্ভিস চার্জ নেয় না। ভিসা অনুমোদনের পর Complete China Support Package-এর নির্ধারিত সার্ভিস ফি BDT ২,০০,০০০ প্রদেয়, এবং প্রতিটি থার্ড-পার্টি ফি আগেই লিখিত কস্ট শিটে আলাদাভাবে উল্লেখ থাকে।
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                *বিশ্ববিদ্যালয় কর্তৃক নির্ধারিত আবেদন ফি, অনুমোদিত মেডিকেল টেস্ট বা সরকারি ভিসা সেন্টার ফি শিক্ষার্থীর সরাসরি প্রদেয় অফিসিয়াল খরচ যা আবেদনের শুরুতেই লিখিত কস্ট শিটে জানিয়ে দেওয়া হয়।
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 border border-white/15 backdrop-blur-sm">
              <h4 className="text-[18px] font-bold text-lime">আমাদের স্টুডেন্ট ভিসা সেবাসমূহ</h4>
              <ul className="mt-4 space-y-3.5 text-[15px] text-white/90">
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>JW202 / JW201 বারকোড ভেরিফিকেশন ও ট্র্যাকিং</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>অনলাইন ভিসা অ্যাপ্লিকেশন ফর্ম নির্ভুলভাবে পূরণ ও আপলোড</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>মেডিকেল ও পুলিশ ক্লিয়ারেন্স প্রস্তুতিতে সার্বিক সহায়তা</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>ভিসা ইন্টারভিউ প্রস্তুতি (মক ইন্টারভিউ) ও প্রি-ডিপার্চার ব্রিফিং</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Frequently Asked Questions */}
      <Section
        title="সাধারণ জিজ্ঞাসা (FAQ)"
        intro="চায়না স্টুডেন্ট ভিসা আবেদন নিয়ে সচরাচর প্রশ্নগুলোর বিস্তারিত উত্তর:"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
              <h3 className="flex items-start gap-2.5 text-[17px] font-bold text-petrol-800">
                <HelpCircle size={20} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="mt-3 pl-7 text-[15px] leading-relaxed text-ink-soft">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Free Visa Eligibility Assessment CTA */}
      <section className="bg-canvas-soft py-16">
        <div className={kit.wrap}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
                ফ্রি ভিসা ও প্রোফাইল মূল্যায়ন
              </span>
              <h2 className="mt-2 font-display text-[26px] font-black sm:text-[32px] text-petrol-800">
                আপনার রেজাল্ট অনুযায়ী ভিসা ও স্কলারশিপ সম্ভাবনা যাচাই করুন
              </h2>
              <p className="mt-3 text-[15px] text-ink-soft">
                আপনার শিক্ষাগত যোগ্যতা ও কাঙ্ক্ষিত প্রোগ্রাম জমা দিন। আমাদের এক্সপার্ট কাউন্সেলর আপনার প্রোফাইল মূল্যায়ন করে সঠিক পথ দেখাবেন।
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-rule shadow-sm">
              <EducationFitAssessment />
            </div>
          </div>
        </div>
      </section>

      <BnChinaRelatedGuides
        currentPath="/bn/china-student-visa-bangladesh"
        englishTwin={{ label: 'China Student Visa Guide (English)', href: '/china-student-visa-bangladesh' }}
        tone="white"
      />
    </div>
  );
}
