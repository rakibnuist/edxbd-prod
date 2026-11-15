import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileCheck2,
  FileText,
  HelpCircle,
  Landmark,
  PhoneCall,
  Plane,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import BnChinaRelatedGuides from '@/components/page/BnChinaRelatedGuides';
import { JsonLd, Section, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { breadcrumbJsonLd, citationJsonLd, type Crumb } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bn/study-in-china-cost-bangladesh';
const EN_PATH = '/study-in-china-cost-bangladesh';
const trail: Crumb[] = [
  { name: 'চীনে উচ্চশিক্ষা', path: '/bn/study-in-china' },
  { name: 'পড়াশোনার মোট খরচ ও স্কলারশিপ গাইড' },
];

export const metadata = pageMetadata({
  title: 'চীনে পড়াশোনার মোট খরচ ও স্কলারশিপ গাইড ২০২৭ | EduExpress',
  description:
    'চীনে Bachelor, Master’s ও MBBS পড়ার বাস্তবসম্মত খরচ (টাকা ও RMB হিসাব)। ভিসার আগে কোনো সার্ভিস ফি নেই এবং CSC ও Provincial স্কলারশিপের পূর্ণাঙ্গ বিবরণ।',
  path: PATH,
  image: ogImage('china', 'Chinese university campus and cost planning guide'),
  type: 'article',
  locale: 'bn_BD',
  languages: {
    'en-BD': EN_PATH,
    'bn-BD': PATH,
    'x-default': EN_PATH,
  },
});

const costTiers = [
  {
    title: 'Full CSC Scholarship (Type A / B)',
    tag: 'পূর্ণ সরকারি স্কলারশিপ রুট',
    highlight: 'পূর্ণ টিউশন ও ডরমিটরি কাভারেজ + মাসিক স্টাইপেন্ড (অফিশিয়াল অ্যাওয়ার্ড অনুযায়ী)',
    tuition: 'সম্পূর্ণ টিউশন মওকুফ (Full CSC Award অনুযায়ী)',
    hostel: 'ফ্রি ক্যাম্পাস ডরমিটরি বা নির্ধারিত আবাসন ভাতা',
    stipend: 'Bachelor: CNY ২,৫০০ · Master’s / General Scholar: CNY ৩,০০০ · PhD / Senior Scholar: CNY ৩,৫০০ / মাস',
    outOfPocket:
      'মেডিকেল ইন্স্যুরেন্স নীতিগত মান CNY ৮০০/বছর (৬ মাসের কমে CNY ৪০০) স্কলারশিপের অংশ হলেও বিমান ভাড়া, পাসপোর্ট, ডকুমেন্ট নোটারি, ভিসা এবং স্টাইপেন্ড আসার আগের প্রাথমিক খরচ হাতে রাখতে হয়।',
    badgeTone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    title: 'Partial / Provincial / University Scholarship',
    tag: 'আংশিক বা বিশ্ববিদ্যালয় স্কলারশিপ',
    highlight: 'লিখিত অ্যাওয়ার্ড লেটার অনুযায়ী আংশিক বা পূর্ণ টিউশন ছাড়',
    tuition: 'মূল টিউশন থেকে অ্যাওয়ার্ডের অংশ বাদে বাকি পরিমাণ CNY-তে নির্ধারিত (উদাহরণস্বরূপ প্রোগ্রামভেদে ১৫,০০০–৩০,০০০ CNY মূল ফি থেকে ছাড়)',
    hostel: 'ক্যাম্পাস ডরমিটরি রুমভেদে ভিন্ন হয় (যেমন Tsinghua বেইজিং ক্যাম্পাস উদাহরণ: দৈনিক ৩০–৪০ CNY প্রতি শয্যা; সিট বুকিং সাপেক্ষ)',
    stipend: 'কিছু বিশ্ববিদ্যালয় বা প্রভিন্সিয়াল স্কলারশিপে আংশিক বা বার্ষিক ভাতা থাকতে পারে (নিশ্চিত অ্যাওয়ার্ড দেখে হিসাব করুন)',
    outOfPocket:
      'খাবার, স্থানীয় যাতায়াত, ইউটিলিটি ও ব্যক্তিগত জীবনযাত্রার খরচ শহর ও শিক্ষার্থীর অভ্যাসের ওপর ভিত্তি করে CNY-তে আলাদা বাজেট করতে হয়।',
    badgeTone: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    title: 'Self-Funded (স্ব-অর্থায়ন রুট)',
    tag: 'সরাসরি ভর্তি (Direct Admission)',
    highlight: 'প্রকাশিত বিশ্ববিদ্যালয় ফি শিডিউল অনুযায়ী CNY-তে টিউশন হিসাব',
    tuition: 'বিশ্ববিদ্যালয়, বিষয় ও ভাষার ওপর নির্ভরশীল (যেমন প্রকাশিত উদাহরণ: Shandong-এ মানবিক/অর্থনীতি চাইনিজ মাধ্যম CNY ২০,০০০ ও বিজ্ঞান-প্রযুক্তি ইংরেজি মাধ্যম CNY ৩০,০০০/বছর; AHUT-এ প্রোগ্রামভেদে CNY ১৫,০০০–৩০,০০০/বছর)',
    hostel: 'উদাহরণ: AHUT ডাবল রুম CNY ৩,০০০/বছর; ডরমিটরি প্রাপ্যতা ও ইউটিলিটি নিয়ম বিশ্ববিদ্যালয়ভেদে ভিন্ন',
    stipend: 'সাধারণত প্রযোজ্য নয় (কোনো পরবর্তী বর্ষের মেধা-পুরস্কার নিশ্চিত ধরে নেওয়া উচিত নয়)',
    outOfPocket:
      'ইংরেজি মাধ্যমের MBBS প্রোগ্রাম চূড়ান্ত করতে হলে চীনের MoE (Ministry of Education) অনুমোদন ও WDOMS তালিকা যাচাই করুন এবং দেশে ফিরে BMDC-র RQE নীতিমালা অনুসরণ করুন। প্রতিটি প্রোগ্রামের আসল CNY ফি ডিরেক্টরিতে যাচাই করুন।',
    badgeTone: 'bg-canvas-soft text-petrol-800 border-rule',
  },
];

const annualComparisonRows = [
  {
    category: 'Full CSC Scholarship',
    tuition: 'অফিশিয়াল অ্যাওয়ার্ডে মওকুফ (CNY ০)',
    hostel: 'ফ্রি ডরমিটরি বা আবাসন ভাতা',
    foodPersonal: 'মাসিক CNY ২,৫০০–৩,৫০০ স্টাইপেন্ড (প্রোগ্রাম ভেদে)',
    totalOutPocket: 'ভিসা, ডকুমেন্টস, বিমান ভাড়া ও শুরুর দিনের নিজস্ব রিজার্ভ (BDT/CNY)',
  },
  {
    category: 'Provincial / University Scholarship (Tuition Waiver)',
    tuition: 'লিখিত অ্যাওয়ার্ড অনুযায়ী মওকুফ',
    hostel: 'বিশ্ববিদ্যালয় নির্ধারিত ডরমিটরি ফি (CNY)',
    foodPersonal: 'শহর ও লাইফস্টাইল ভেদে নিজস্ব খাবার ও চলাচল ব্যয় (CNY)',
    totalOutPocket: 'ডরমিটরি, ইন্স্যুরেন্স, যাতায়াত ও জীবনযাত্রার খরচ (ব্যাংক রেটে BDT রূপান্তর)',
  },
  {
    category: 'Partial Scholarship',
    tuition: 'মূল CNY টিউশন থেকে নিশ্চিত ডিসকাউন্ট বাদ দিয়ে বাকি অংশ',
    hostel: 'রুম ও ক্যাম্পাস ভেদে নির্ধারিত CNY ফি',
    foodPersonal: 'শহর ও লাইফস্টাইল ভেদে নিজস্ব ব্যয় (CNY)',
    totalOutPocket: 'বাকি টিউশন + আবাসন + জীবনযাত্রা (একক গড় অনুমান নয়)',
  },
  {
    category: 'Self-Funded (Degree Examples)',
    tuition: 'প্রকাশিত উদাহরণ: CNY ১৫,০০০ – ৩০,০০০+/বছর (প্রোগ্রামভেদে)',
    hostel: 'প্রকাশিত উদাহরণ: AHUT CNY ৩,০০০/বছর বা দৈনিক CNY ৩০–৪০',
    foodPersonal: 'মেডিকেল ইন্স্যুরেন্স CNY ৮০০/বছর + খাবার ও ব্যক্তিগত ব্যয়',
    totalOutPocket: 'কোর্স ও শহরভেদে লিখিত ফি-শিট + ব্যাংকের তারিখভুক্ত রেটে BDT হিসাব',
  },
  {
    category: 'Self-Funded MBBS (English Medium)',
    tuition: 'বিশ্ববিদ্যালয় অনুযায়ী আলাদা (MoE অনুমোদিত প্রোগ্রাম তালিকা দেখে নিশ্চিত করুন)',
    hostel: 'বিশ্ববিদ্যালয়ের নির্ধারিত ডরমিটরি ও ইউটিলিটি ফি (CNY)',
    foodPersonal: 'ইন্স্যুরেন্স, রেসিডেন্স পারমিট ও ৫–৬ বছরের ব্যক্তিগত বাজেট (CNY)',
    totalOutPocket: 'আমাদের China Directory-তে প্রতিটি মেডিকেল স্কুলের প্রকাশিত ফি যাচাই করুন',
  },
];

const paymentSimplicityPoints = [
  {
    icon: CheckCircle2,
    title: 'ভিসার আগে ০ টাকা সার্ভিস চার্জ',
    desc: 'চায়না স্টুডেন্ট ভিসা কনফার্ম হওয়ার আগে আমাদের কোনো এজেন্সি সার্ভিস চার্জ নেই। শুরুতেই লিখিতভাবে সব ফি-এর বিবরণ প্রদান করা হয়।',
  },
  {
    icon: Building2,
    title: 'স্পষ্ট টিউশন ও হোস্টেল ফি কাঠামো',
    desc: 'প্রোগ্রাম অনুযায়ী বিশ্ববিদ্যালয়ের বার্ষিক টিউশন ফি, ডরমিটরি চার্জ, মেডিকেল ও ইনস্যুরেন্স ফি আলাদাভাবে উল্লেখ থাকে।',
  },
  {
    icon: CreditCard,
    title: 'পাসপোর্ট এনডোর্সমেন্ট ও ইন্টারন্যাশনাল কার্ড',
    desc: 'ভিসা ও বিমানের টিকিট দেখিয়ে পাসপোর্টে প্রয়োজনীয় বৈদেশিক মুদ্রা (USD/RMB) সহজে এনডোর্স করা যায় এবং যেকোনো ডুয়াল কারেন্সি ডেবিট/ক্রেডিট কার্ড চীনে স্বাচ্ছন্দ্যে ব্যবহার করা যায়।',
  },
  {
    icon: Zap,
    title: 'WeChat Pay ও Alipay-তে ডিজিটাল পেমেন্ট',
    desc: 'চীনে পৌঁছানোর পরপরই ক্যাম্পাসের ভেতরে লোকাল চাইনিজ ব্যাংক অ্যাকাউন্ট ওপেন করে দেওয়া হয়। এরপর মোবাইল থেকেই সহজে সব ধরনের দৈনিক খরচ ও কেনাকাটা করা যায়।',
  },
];

const faqs = [
  {
    q: 'বাংলাদেশ থেকে চীনে টাকা নিয়ে যাওয়ার নিয়ম কী?',
    a: 'শিক্ষার্থী ভ্রমণের সময় আইনসম্মতভাবে পাসপোর্টে ডলার বা ইউয়ান এনডোর্স করে সাথে ক্যাশ নিতে পারেন। এছাড়া ইন্টারন্যাশনাল কার্ড বা পরবর্তীতে লোকাল ব্যাংক অ্যাকাউন্টের মাধ্যমেও খরচ ম্যানেজ করা যায়।',
  },
  {
    q: 'চীনে পড়ার জন্য কি ব্যাংকে কত ব্যালেন্স দেখাতে হয় (Bank Evidence)?',
    a: 'পূর্ণ স্কলারশিপ থাকলে অফিশিয়াল স্কলারশিপ অ্যাওয়ার্ড প্রমাণ ব্যবহৃত হয়। স্ব-অর্থায়িত (Self-funded) X1 ভিসার ক্ষেত্রে ঢাকাস্থ চীনা দূতাবাসের প্রকাশিত নির্দেশনায় প্রতি শিক্ষাবর্ষের জন্য অন্তত USD ২,৫০০ সমপরিমাণ ব্যাংক প্রমাণ চাওয়া হয়—এটি ভিসার ন্যূনতম নথিগত মানদণ্ড মাত্র, পড়াশোনার মোট বাস্তব বাজেট নয়।',
  },
  {
    q: 'ভিসা হওয়ার আগে EduExpress-কে কি কোনো সার্ভিস চার্জ দিতে হবে?',
    a: 'একদমই না। কোনো ফাইল ওপেনিং চার্জ নেই এবং চায়না স্টুডেন্ট ভিসা (X1/X2) অনুমোদনের আগে EduExpress কোনো সার্ভিস ফি নেয় না। ভিসা অনুমোদনের পর আমাদের Complete China Support Package-এর নির্ধারিত সার্ভিস ফি BDT ২,০০,০০০ (যেটি বিশ্ববিদ্যালয়ের টিউশন বা স্কলারশিপ থেকে সম্পূর্ণ আলাদা; লিখিত চুক্তিতে সব শর্ত স্পষ্ট থাকে)। বিশ্ববিদ্যালয়, এম্বাসি বা মেডিকেল ধরনের থার্ড-পার্টি ফি আগে প্রযোজ্য হলে তা আগেই লিখিতভাবে তালিকাভুক্ত করা হয়।',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': ['WebPage', 'Article'],
  '@id': `${SITE}${PATH}#article`,
  url: `${SITE}${PATH}`,
  headline: 'চীনে পড়াশোনার মোট খরচ ও স্কলারশিপ গাইড ২০২৭',
  description:
    'বাংলাদেশী শিক্ষার্থীদের জন্য চীনে পড়াশোনার পূর্ণাঙ্গ ব্যয় বিবরণী ও স্কলারশিপ গাইড।',
  image: `${SITE}/og/china.jpg`,
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
    { label: 'CampusChina — Chinese Government Scholarship', href: 'https://www.campuschina.org/' },
    { label: 'Chinese Embassy in Bangladesh', href: 'https://bd.china-embassy.gov.cn/eng/' },
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

export default function BengaliChinaCostPage() {
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম। চীনে পড়াশোনার মোট খরচ ও স্কলারশিপ প্রসেসিং নিয়ে বিস্তারিত জানতে চাই।')}`;

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
                <span className="text-petrol-800">পড়াশোনার মোট খরচ ও স্কলারশিপ</span>
              </li>
            </ol>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-lime/25 px-4 py-1.5 text-[13px] font-bold text-petrol-800 tracking-wide">
            <Sparkles size={15} className="text-petrol-800" /> ভিসার আগে কোনো সার্ভিস চার্জ নেই (BDT 0 Before Visa)
          </span>

          <h1 className="mt-4 font-display text-[32px] font-black leading-tight sm:text-[44px] lg:text-[52px]">
            চীনে পড়াশোনার মোট খরচ ও স্কলারশিপ গাইড
          </h1>

          <p className="mt-5 text-[17px] leading-relaxed text-ink-soft sm:text-[19px]">
            কোনো গোপন চার্জ নেই। Tuition fee, হোস্টেল, খাবার ও ক্যাম্পাসে সরাসরি ফি পরিশোধের স্পষ্ট হিসাব জেনে পরিবারসহ নিশ্চিন্তে সিদ্ধান্ত নিন।
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#cost-tiers" className="ed-btn ed-btn-signal min-h-[50px] px-7">
              খরচ ও স্কলারশিপের ছক দেখুন <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="ed-btn ed-btn-outline min-h-[50px] px-7 inline-flex items-center gap-2"
            >
              <PhoneCall size={16} /> কাউন্সেলরের সাথে পরামর্শ করুন
            </a>
          </div>
        </div>
      </section>

      {/* Standing Trust Bar */}
      <div className="border-y border-rule bg-white py-6">
        <div className={`${kit.wrap} grid grid-cols-2 gap-6 lg:grid-cols-4`}>
          <div className="flex items-center gap-3">
            <Wallet className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">ভিসার আগে BDT 0</p>
              <p className="text-[13px] text-ink-soft">ভিসা স্ট্যাম্পিংয়ের আগে কোনো সার্ভিস ফি নেই</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">লিখিত ও স্বচ্ছ হিসাব</p>
              <p className="text-[13px] text-ink-soft">প্রতিটি পেমেন্ট ও প্রাপক আগে লিখিত থাকে</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calculator className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">BDT ও CNY পৃথক হিসাব</p>
              <p className="text-[13px] text-ink-soft">ব্যাংকের তারিখভুক্ত রেট অনুযায়ী রূপান্তর</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeCheck className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">লিখিত আইটেমাইজড ফি শিট</p>
              <p className="text-[13px] text-ink-soft">আবেদনের আগেই প্রতিটি ফি লিখিত আকারে প্রদান</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Banking Simplicity */}
      <Section
        title="চীনে উচ্চশিক্ষায় পেমেন্ট ও ব্যাংকিং ব্যবস্থাপনা"
        intro="বাংলাদেশী শিক্ষার্থীদের জন্য চীনে টিউশন ও দৈনিক খরচ পরিচালনার সহজ নির্দেশিকা:"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {paymentSimplicityPoints.map((item) => (
            <div key={item.title} className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
              <span className="grid size-11 place-items-center rounded-xl bg-lime/25 text-petrol-800">
                <item.icon size={22} />
              </span>
              <h3 className="mt-4 text-[17px] font-bold text-petrol-800">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Main Cost Tiers */}
      <section id="cost-tiers">
        <Section
          tone="sage"
          title="চীনে ৩টি প্রধান ক্যাটাগরিতে পড়াশোনার খরচ"
          intro="স্কলারশিপের ধরন অনুযায়ী শিক্ষার্থীর প্রকৃত খরচ নির্ধারিত হয়। নিচে ৩টি মূল ক্যাটাগরির আর্থিক বিবরণ দেওয়া হলো:"
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {costTiers.map((tier) => (
              <div
                key={tier.title}
                className="rounded-3xl border border-rule bg-white p-7 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span
                    className={`inline-block rounded-full border px-3.5 py-1 text-[13px] font-bold ${tier.badgeTone}`}
                  >
                    {tier.tag}
                  </span>
                  <h3 className="mt-4 text-[21px] font-bold text-petrol-800">{tier.title}</h3>
                  <p className="mt-3 text-[14px] font-semibold text-emerald-800 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    {tier.highlight}
                  </p>

                  <div className="mt-6 space-y-4 text-[15px] text-ink-soft border-t border-rule pt-5">
                    <div>
                      <span className="font-bold text-petrol-800 block text-[14px]">Tuition Fee:</span>
                      <span className="font-medium text-petrol-800">{tier.tuition}</span>
                    </div>
                    <div>
                      <span className="font-bold text-petrol-800 block text-[14px]">হোস্টেল / ডরমিটরি:</span>
                      <span>{tier.hostel}</span>
                    </div>
                    <div>
                      <span className="font-bold text-petrol-800 block text-[14px]">মাসিক স্টাইপেন্ড (Stipend):</span>
                      <span>{tier.stipend}</span>
                    </div>
                    <div>
                      <span className="font-bold text-petrol-800 block text-[14px]">অন্যান্য আনুষঙ্গিক খরচ:</span>
                      <span className="text-[14px] leading-relaxed">{tier.outOfPocket}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-rule">
                  <Link
                    href="/china-universities"
                    className="inline-flex items-center gap-2 text-[15px] font-bold text-petrol-800 hover:text-lime"
                  >
                    বিশ্ববিদ্যালয় তালিকা ও প্রোগ্রাম দেখুন <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* Quick Summary Comparison Table */}
      <Section
        title="এক নজরে বার্ষিক খরচের বাস্তবসম্মত হিসাব"
        intro="অভিভাবকদের বাজেট পরিকল্পনার সুবিধার্থে খাবার, আবাসন ও টিউশনসহ সম্ভাব্য বার্ষিক সর্বমোট ব্যয়ের তুলনামূলক ছক:"
      >
        <div className="overflow-x-auto rounded-2xl border border-rule bg-white shadow-sm">
          <table className="w-full text-left text-[14px] sm:text-[15px]">
            <thead className="bg-canvas-soft text-petrol-800 border-b border-rule font-bold text-[13px] uppercase tracking-wider">
              <tr>
                <th className="p-4 sm:p-5">ক্যাটাগরি / কোর্স</th>
                <th className="p-4 sm:p-5">বার্ষিক Tuition Fee</th>
                <th className="p-4 sm:p-5">বার্ষিক ডরমিটরি</th>
                <th className="p-4 sm:p-5">জীবনযাত্রা ও স্টাইপেন্ড (CNY)</th>
                <th className="p-4 sm:p-5 font-black text-petrol-800">বাজেট নোট ও মুদ্রা (CNY / BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-ink-soft">
              {annualComparisonRows.map((row) => (
                <tr key={row.category} className="hover:bg-canvas-soft/50 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-petrol-800">{row.category}</td>
                  <td className="p-4 sm:p-5">{row.tuition}</td>
                  <td className="p-4 sm:p-5">{row.hostel}</td>
                  <td className="p-4 sm:p-5">{row.foodPersonal}</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800">{row.totalOutPocket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[13px] text-ink-mute leading-relaxed">
          *বিভিন্ন বিশ্ববিদ্যালয়ের প্রকাশিত উদাহরণগুলো জাতীয় গড় বা চূড়ান্ত ব্যক্তিগত কোট নয়; আসল ফি ও মুদ্রা বিশ্ববিদ্যালয়, শহর ও ইনটেক অনুযায়ী নির্ধারিত হয়। আমরা কোনো স্থির CNY/RMB-টু-BDT রেট অনুমান করি না—BDT বাজেট করার সময় আপনার ব্যাংক বা রেমিট্যান্স মাধ্যমের তারিখভুক্ত বিনিময় হার ও স্থানান্তর চার্জ আলাদাভাবে যোগ করুন।
        </p>
      </Section>

      {/* EduExpress Commercial Policy */}
      <Section
        title="EduExpress-এর সার্ভিস চার্জ ও Visa-First পলিসি"
        intro="আমরা স্বচ্ছ ও লিখিত শর্তে কাজ করি। আপনার কোনো টাকা অনাকাঙ্ক্ষিত ঝুঁকির মুখে পড়বে না।"
      >
        <div className="rounded-3xl bg-petrol-800 text-white p-8 lg:p-12 shadow-md">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/20 px-3.5 py-1 text-[13px] font-semibold text-lime">
                <ShieldCheck size={16} /> ভিসা-ফার্স্ট (Visa-First) নীতিমালা
              </span>
              <h3 className="mt-4 font-display text-[26px] font-bold sm:text-[32px]">
                ভিসা অনুমোদনের আগে আমাদের সার্ভিস ফি BDT 0
              </h3>
              <p className="mt-4 text-[16px] leading-relaxed text-white/85">
                চায়না প্যাকেজের জন্য ফাইল ওপেনিং চার্জ সম্পূর্ণ ০ টাকা। চায়না ভিসা অনুমোদনের আগে EduExpress কোনো সার্ভিস ফি গ্রহণ করে না। ভিসা অনুমোদনের পর Complete China Support Package-এর নির্ধারিত সার্ভিস ফি BDT ২,০০,০০০ প্রদেয়, যা বিশ্ববিদ্যালয়ের টিউশন বা থার্ড-পার্টি খরচ থেকে সম্পূর্ণ আলাদা এবং লিখিত চুক্তিতে নির্ধারিত।
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                *বিশ্ববিদ্যালয় কর্তৃক নির্ধারিত Application Fee, অনুমোদিত মেডিকেল টেস্ট বা সরকারি এম্বাসি ফি সরাসরি সংশ্লিষ্ট কর্তৃপক্ষকে প্রদেয় এবং আবেদনের পূর্বেই লিখিত কস্ট শিটে স্পষ্ট উল্লেখ থাকে।
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 border border-white/15 backdrop-blur-sm">
              <h4 className="text-[18px] font-bold text-lime">লিখিত খরচের অঙ্গীকারনামা</h4>
              <ul className="mt-4 space-y-3.5 text-[15px] text-white/90">
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>কোনো গোপন বা অপ্রত্যাশিত চার্জ নেই</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>প্রতিটি ফির অফিশিয়াল রসিদ ও প্রাপক স্পষ্টীকরণ</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>ক্যাম্পাসে পৌঁছে ফি পরিশোধে গাইডলাইন ও সহায়তা</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>JW202 প্রসেসিং, এম্বাসি ফাইল প্রস্তুতি ও প্রি-ডিপার্চার ব্রিফিং অন্তর্ভুক্ত</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Frequently Asked Questions */}
      <Section
        title="সাধারণ জিজ্ঞাসা (FAQ)"
        intro="চীনে পড়াশোনার খরচ ও পেমেন্ট নিয়ে অভিভাবক ও শিক্ষার্থীদের সচরাচর প্রশ্নগুলোর উত্তর:"
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

      {/* Assessment CTA */}
      <section className="bg-canvas-soft py-16">
        <div className={kit.wrap}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
                ফ্রি প্রোফাইল অ্যাসেসমেন্ট
              </span>
              <h2 className="mt-2 font-display text-[26px] font-black sm:text-[32px] text-petrol-800">
                আপনার রেজাল্ট ও বাজেট অনুযায়ী সেরা অপশন জানুন
              </h2>
              <p className="mt-3 text-[15px] text-ink-soft">
                আপনার শিক্ষাগত যোগ্যতা ও পছন্দের বিষয় জমা দিন। আমাদের এক্সপার্ট কাউন্সেলর আপনার প্রোফাইল মূল্যায়ন করে স্কলারশিপ সম্ভাবনা জানাবেন।
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-rule shadow-sm">
              <EducationFitAssessment />
            </div>
          </div>
        </div>
      </section>

      <BnChinaRelatedGuides
        currentPath="/bn/study-in-china-cost-bangladesh"
        englishTwin={{ label: 'Cost of Studying in China (English)', href: '/study-in-china-cost-bangladesh' }}
        tone="white"
      />
    </div>
  );
}
