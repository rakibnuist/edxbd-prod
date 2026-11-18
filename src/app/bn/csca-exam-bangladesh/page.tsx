import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Globe2,
  Laptop,
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
const PATH = '/bn/csca-exam-bangladesh';
const EN_PATH = '/updates/csca-guide-study-in-china';

const trail: Crumb[] = [
  { name: 'চীনে উচ্চশিক্ষা', path: '/bn/study-in-china' },
  { name: 'CSCA ভর্তি পরীক্ষার গাইড' },
];

export const metadata = pageMetadata({
  title: 'CSCA ভর্তি পরীক্ষার গাইড ২০২৭ (বাংলা) | EduExpress',
  description:
    'বাংলাদেশি শিক্ষার্থীদের জন্য চীনের আন্ডারগ্র্যাজুয়েট ভর্তি পরীক্ষা CSCA-এর সিলেবাস, ঢাকা সময়সূচি, রেজিস্ট্রেশন ফি ও ফ্রি CSCA Master Pro মক টেস্ট গাইড।',
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

const subjectRows = [
  [
    'Mathematics (গণিত · বাধ্যতামূলক)',
    '৪৮টি MCQ · ৬০ মিনিট · ১০০ নম্বর',
    'ইংরেজি অথবা চাইনিজ',
    'সেট, অসমতা, ফাংশন, ধারা, প্রাথমিক ক্যালকুলাস, জ্যামিতি, ভেক্টর ও সম্ভাব্যতা (সকল আন্ডারগ্র্যাজুয়েট আবেদনকারীর জন্য আবশ্যক)',
  ],
  [
    'Physics (পদার্থবিজ্ঞান)',
    '৪৮টি MCQ · ৬০ মিনিট · ১০০ নম্বর',
    'ইংরেজি অথবা চাইনিজ',
    'বলবিদ্যা, তাপগতিবিদ্যা, তড়িৎচুম্বকত্ব, আলোকবিজ্ঞান ও আধুনিক পদার্থবিজ্ঞান (ইঞ্জিনিয়ারিং, কম্পিউটার সায়েন্স ও বিজ্ঞান বিষয়ের জন্য)',
  ],
  [
    'Chemistry (রসায়ন)',
    '৪৮টি MCQ · ৬০ মিনিট · ১০০ নম্বর',
    'ইংরেজি অথবা চাইনিজ',
    'রাসায়নিক গণনা, মৌল ও যৌগের ধর্ম, বিক্রিয়া, রাসায়নিক সাম্যাবস্থা ও ল্যাবরেটরি প্রয়োগ (MBBS, ফার্মেসি ও কেমিক্যাল ইঞ্জিনিয়ারিংয়ের জন্য)',
  ],
  [
    'Professional Chinese (মানবিক / বিজ্ঞান ট্র্যাক)',
    '৮০টি MCQ · ৯০ মিনিট · ১০০ নম্বর',
    'চাইনিজ (Chinese only)',
    'অক্ষর চেনা, শূন্যস্থান পূরণ, শব্দ পার্থক্য, বাক্য গঠন ও একাডেমিক প্যাসেজ রিডিং (CSC স্কলারশিপ ও চাইনিজ মাধ্যমের ব্যাচেলর প্রোগ্রামের জন্য)',
  ],
];

const scheduleRows = [
  [
    '১৪–১৫ নভেম্বর ২০২৬ · ২৩–২৪ জানুয়ারি ২০২৭ · ১৩–১৪ মার্চ ২০২৭ · ২৪–২৫ এপ্রিল ২০২৭ (বেইজিং দুপুর ২:০০ ব্লক)',
    'Professional Chinese: দুপুর ১২:০০ – ১:৩০\nMathematics: বিকেল ৩:০০ – ৪:০০',
    'Physics: দুপুর ১২:০০ – ১:০০\nChemistry: দুপুর ২:৩০ – ৩:৩০',
  ],
  [
    '১৯–২০ ডিসেম্বর ২০২৬ · ২৬–২৭ জুন ২০২৭ (বেইজিং সকাল ৮:০০ ব্লক)',
    'Professional Chinese: সকাল ৬:০০ – ৭:৩০\nMathematics: সকাল ৯:০০ – ১০:০০',
    'Physics: সকাল ৬:০০ – ৭:০০\nChemistry: সকাল ৮:৩০ – ৯:৩০',
  ],
];

const actionCards = [
  {
    icon: CreditCard,
    title: 'বাংলাদেশ থেকে CNY ৪৫০ / ৭০০ ফি পেমেন্টের নিয়ম',
    body: 'অফিশিয়াল csca.cn পোর্টালে ১টি বিষয়ের ফি CNY ৪৫০ এবং ২ বা ততোধিক বিষয়ের ফি CNY ৭০০। বিকাশ, নগদ বা সাধারণ দেশীয় ডেবিট কার্ড এখানে কাজ করে না। পাসপোর্টে ডুয়াল-কারেন্সি (Dual-Currency) এন্ডোর্স করা ভিসা বা মাস্টারকার্ড ব্যবহার করুন এবং নাম, জন্মতারিখ ও পাসপোর্ট নম্বর হুবহু পাসপোর্ট অনুযায়ী পূরণ করুন।',
    points: [
      '১ বিষয়ের ফি: CNY ৪৫০ · ২ বা ততোধিক বিষয়: CNY ৭০০',
      'আন্তর্জাতিক ই-কমার্স চালু থাকা Visa বা Mastercard প্রয়োজন',
      'পাসপোর্ট ও পরবর্তীতে বিশ্ববিদ্যালয়ের ফরমের সাথে নামের বানান হুবহু মিল থাকতে হবে',
    ],
  },
  {
    icon: Laptop,
    title: 'বাসায় বসে অনলাইন পরীক্ষার (Home Test) প্রস্তুতি',
    body: 'রিমোট AI-প্রক্টরড হোম টেস্টের জন্য একটি Windows কম্পিউটার বা ল্যাপটপ (ওয়েবক্যাম ও মাইক্রোফোনসহ) এবং দ্বিতীয় ক্যামেরা হিসেবে একটি স্মার্টফোন প্রয়োজন। বাংলাদেশে বিদ্যুৎ বিভ্রাট বা লোডশেডিং এড়াতে রাউটারে মিনি-UPS এবং অন্তত ২০ Mbps গতির 4G মোবাইল হটস্পট ব্যাকআপ রাখুন।',
    points: [
      'মূল পরীক্ষার সফটওয়্যারের জন্য Windows পিসি বা ল্যাপটপ আবশ্যক',
      'পাশ থেকে পর্যবেক্ষণের জন্য দ্বিতীয় স্মার্টফোন ক্যামেরা সেটআপ',
      'নিরবচ্ছিন্ন বিদ্যুৎ ও ইন্টারনেটের জন্য UPS এবং 4G ডেটা ব্যাকআপ',
    ],
  },
  {
    icon: CheckCircle2,
    title: 'কাদের CSCA পরীক্ষা দিতে হবে না? (Exemption)',
    body: 'CSCA শুধুমাত্র আন্ডারগ্র্যাজুয়েট (Bachelor’s) পর্যায়ে ভর্তির পরীক্ষা। যারা Master’s বা PhD প্রোগ্রামে CSC বা বিশ্ববিদ্যালয় স্কলারশিপে আবেদন করবেন, তাদের CSCA দিতে হয় না। এছাড়া ২০২৭ ইনটেকে বেশ কিছু সেল্ফ-ফান্ডেড ও বিশ্ববিদ্যালয় স্কলারশিপের ইংরেজি ব্যাচেলর প্রোগ্রামে CSCA ছাড়াও আবেদন করা যায়।',
    points: [
      'Master’s ও PhD আবেদনকারীদের জন্য CSCA প্রযোজ্য নয়',
      '২০২৮ সালের আগে অনেক ইংরেজি মাধ্যমের ব্যাচেলর প্রোগ্রামে CSCA ঐচ্ছিক',
      'আমাদের ডিরেক্টরিতে CSCA-মুক্ত চীনা বিশ্ববিদ্যালয় ফিল্টার করে দেখুন',
    ],
  },
];

const officialLinks = [
  { label: 'CSCA — অফিশিয়াল প্রবেশিকা পোর্টাল', href: 'https://csca.cn/' },
  { label: 'CSCA Master — ফ্রি মক টেস্ট ও বাংলাদেশ সময়সূচি', href: 'https://www.cscamaster.com/csca/countries/bangladesh' },
  { label: 'CampusChina — অফিশিয়াল CSC পোর্টাল', href: 'https://www.campuschina.org/' },
  { label: 'ঢাকাস্থ চীনা দূতাবাস — অফিশিয়াল বিজ্ঞপ্তি', href: 'https://bd.china-embassy.gov.cn/eng/' },
];

const bnCscaFaqs = [
  {
    question: 'CSCA পরীক্ষা কী এবং এটি কাদের জন্য বাধ্যতামূলক?',
    answer:
      'CSCA (China Scholastic Competency Assessment) হলো চীনা বিশ্ববিদ্যালয়গুলোতে আন্তর্জাতিক আন্ডারগ্র্যাজুয়েট (Bachelor’s) শিক্ষার্থীদের ভর্তির মানদণ্ড পরীক্ষা, যা চায়না স্কলারশিপ কাউন্সিল (CSC) পরিচালনা করে। ২০২৬/২০২৭ সেশন থেকে আন্ডারগ্র্যাজুয়েট পর্যায়ে চাইনিজ গভর্নমেন্ট স্কলারশিপ (CGS/CSC) ও নির্ধারিত বিশ্ববিদ্যালয়গুলোতে আবেদনের জন্য এটি প্রয়োজন এবং ২০২৮ সাল থেকে সকল আন্ডারগ্র্যাজুয়েট ভর্তিতে এটি চালু হওয়ার কথা রয়েছে।',
  },
  {
    question: 'Master’s বা PhD-তে CSC স্কলারশিপের জন্য কি CSCA পরীক্ষা দিতে হবে?',
    answer:
      'না। CSCA কেবল আন্ডারগ্র্যাজুয়েট (Bachelor’s) আবেদনকারীদের জন্য। Master’s ও Doctoral (PhD) পর্যায়ে ভর্তির ক্ষেত্রে পূর্ববর্তী ডিগ্রির ট্রান্সক্রিপ্ট, রিসার্চ প্রপোজাল বা স্টাডি প্ল্যান, রিকমেন্ডেশন লেটার এবং ভাষাগত যোগ্যতার সনদ বিবেচনা করা হয়।',
  },
  {
    question: 'এডুএক্সপ্রেসে চায়না ফাইল ওপেন করলে কীভাবে ফ্রি CSCA Master Pro অ্যাক্সেস পাওয়া যায়?',
    answer:
      'এডুএক্সপ্রেসে ফ্রি এডুকেশন ফিট অ্যাসেসমেন্ট সম্পন্ন করে যাচাইকৃত চায়না আন্ডারগ্র্যাজুয়েট বা সিএসসি স্কলারশিপ অ্যাপ্লিকেশন ফাইল ওপেন করলে (ফাইল ওপেনিং চার্জ ০ টাকা এবং ভিসা অনুমোদনের আগে এডুএক্সপ্রেসের কোনো সার্ভিস ফি নেই) আমাদের কাউন্সেলর আপনাকে cscamaster.com-এর একটি ফ্রি CSCA Master Pro সিট অ্যাক্টিভেশন কোড (মূল্য CNY ৯৯ / ইনটেক) প্রদান করবেন। এর মাধ্যমে ১৫৫টি পূর্ণাঙ্গ মক টেস্ট, ২১টি টাইমড অফিশিয়াল প্রশ্নপত্র ও ২,৮৬৭টি টপিক ড্রিল অনুশীলন করা যাবে। অফিশিয়াল CSCA পরীক্ষার রেজিস্ট্রেশন ফি (CNY ৪৫০–৭০০) আলাদাভাবে csca.cn পোর্টালে প্রদেয়।',
  },
  {
    question: 'ইংরেজি মাধ্যমে ব্যাচেলর বা MBBS পড়তে চাইলে CSCA-তে কোন কোন বিষয় দিতে হয়?',
    answer:
      'Mathematics সকল আবেদনকারীর জন্য আবশ্যক এবং এটি ইংরেজিতে দেওয়া যায়। বিজ্ঞান, ইঞ্জিনিয়ারিং বা ইংরেজি মাধ্যমের MBBS প্রোগ্রামের জন্য বিশ্ববিদ্যালয়ের শর্ত অনুযায়ী ইংরেজিতে Physics ও Chemistry (অথবা যেকোনো একটি) দিতে হতে পারে। চাইনিজ গভর্নমেন্ট স্কলারশিপ (CGS) এবং চাইনিজ মাধ্যমের প্রোগ্রামের ক্ষেত্রে অতিরিক্তভাবে Professional Chinese পেপার দিতে হয়।',
  },
  {
    question: 'CSCA পরীক্ষায় কি নেগেটিভ মার্কিং আছে এবং স্কোর কতদিন বৈধ থাকে?',
    answer:
      'প্রতিটি বিষয় ১০০ নম্বরে মূল্যায়ন করা হয় এবং কোনো নেগেটিভ মার্কিং নেই। পরীক্ষার ফলাফল সাধারণত ৭ থেকে ১০ কার্যদিবসের মধ্যে প্রকাশিত হয় এবং অফিশিয়াল স্কোর রিপোর্ট ২ বছর পর্যন্ত বৈধ থাকে।',
  },
];

export default function BengaliCscaExamPage() {
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম। চীনে আন্ডারগ্র্যাজুয়েট ভর্তি ও CSCA পরীক্ষার প্রস্তুতি এবং ফ্রি CSCA Master Pro কোড সম্পর্কে জানতে চাই।')}`;
  const url = `${SITE}${PATH}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'Article'],
    '@id': `${url}#page`,
    url,
    headline: 'বাংলাদেশি শিক্ষার্থীদের জন্য CSCA ভর্তি পরীক্ষার সম্পূর্ণ গাইড ২০২৭',
    name: 'CSCA ভর্তি পরীক্ষার গাইড ২০২৭ (বাংলাদেশ সময়সূচি, সিলেবাস ও প্রস্তুতি)',
    description:
      'চীনে আন্ডারগ্র্যাজুয়েট ভর্তি ও CSC স্কলারশিপের জন্য CSCA পরীক্ষার সিলেবাস, ঢাকা সময়সূচি (UTC+6), ফি পেমেন্ট ও ফ্রি CSCA Master Pro মক টেস্ট প্রস্তুতি।',
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
                  <span aria-current="page" className="text-petrol-800">CSCA ভর্তি পরীক্ষার গাইড</span>
                </li>
              </ol>
            </nav>
            <p className={`anim-rise mt-6 ${kit.badge}`}><Award size={15} aria-hidden="true" /> চায়না আন্ডারগ্র্যাজুয়েট প্রবেশিকা পরীক্ষা ২০২৬–২০২৭</p>
            <h1 className="anim-lift mt-5 font-display text-[36px] font-bold leading-[1.08] text-petrol-800 sm:text-[48px] lg:text-[54px]">
              বাংলাদেশি শিক্ষার্থীদের জন্য CSCA ভর্তি পরীক্ষার সম্পূর্ণ গাইড ২০২৭
            </h1>
            <p className={`anim-rise mt-6 max-w-2xl ${kit.lead}`}>
              চীনে ব্যাচেলর ডিগ্রি ও আন্ডারগ্র্যাজুয়েট CSC স্কলারশিপের জন্য নির্ধারিত <strong>CSCA (China Scholastic Competency Assessment)</strong> পরীক্ষার বিষয়, ঢাকা সময়সূচি (UTC+6), ফি পরিশোধের নিয়ম এবং এডুএক্সপ্রেসে ফাইল ওপেন করলেই <strong>ফ্রি CSCA Master Pro</strong> মক টেস্ট অ্যাক্সেস।
            </p>
            <div className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#bn-csca-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                চায়না ফাইল ওপেন ও ফ্রি Pro কোড নিন <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a
                href="https://www.cscamaster.com/free-exam?utm_source=eduexpressint&utm_medium=bn_csca_hero&utm_campaign=csca_pro_access"
                target="_blank"
                rel="noopener noreferrer"
                className="ed-btn ed-btn-outline min-h-[52px] px-6"
              >
                <BookOpenCheck size={17} aria-hidden="true" /> ফ্রি ১০-প্রশ্নের মক টেস্ট <ExternalLink size={15} aria-hidden="true" />
              </a>
              <Link href={EN_PATH} hrefLang="en-BD" className="ed-btn ed-btn-outline min-h-[52px] px-6">
                <Globe2 size={17} aria-hidden="true" /> <span lang="en">English CSCA Guide</span>
              </Link>
            </div>
          </div>
          <figure className="anim-rise relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/students/campus-nuist.webp"
                alt="নানজিং-এ চীনা বিশ্ববিদ্যালয় ক্যাম্পাসে বাংলাদেশি শিক্ষার্থী"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover object-[60%_45%]"
              />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
              সঠিক সিলেবাস ও টাইমড মক টেস্টে প্রস্তুতি নিন
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-label="CSCA পরীক্ষার মূল তথ্য" className="border-b border-canvas-soft bg-white py-8">
        <ul data-anim="stagger" className={`${kit.wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
          {[
            { icon: BookOpenCheck, title: '৪৮ ও ৮০টি MCQ প্রশ্ন', text: 'গণিত, পদার্থ ও রসায়ন ৬০ মিনিট; প্রফেশনাল চাইনিজ ৯০ মিনিট' },
            { icon: Calendar, title: 'বছরে ৬টি পরীক্ষার সেশন', text: 'জানুয়ারি, মার্চ, এপ্রিল, জুন, নভেম্বর ও ডিসেম্বর (ঢাকা সময় অনুযায়ী)' },
            { icon: Wallet, title: 'ফাইল ওপেনিং চার্জ ০ টাকা', text: 'চায়না ভিসা অনুমোদনের আগে এডুএক্সপ্রেসের কোনো সার্ভিস ফি নেই' },
            { icon: BadgeCheck, title: 'ফ্রি CSCA Master Pro', text: 'ফাইল ওপেন করলেই CNY ৯৯ মূল্যের ১৫৫টি মক ও ২১টি অফিশিয়াল পেপার ফ্রি' },
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
        title="CSCA পরীক্ষার বিষয়, প্রশ্ন সংখ্যা ও নম্বর বণ্টন"
        intro="আপনার পছন্দের মেজর ও শিক্ষার মাধ্যম (English-taught বনাম Chinese-taught) অনুযায়ী নিচের বিষয়গুলোর মধ্যে পরীক্ষা দিতে হয়। প্রতিটি বিষয়ের পূর্ণমান ১০০ এবং কোনো নেগেটিভ মার্কিং নেই।"
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-[15px] leading-6">
            <caption className="sr-only">CSCA পরীক্ষার বিষয় ও কাঠামো</caption>
            <thead className="bg-canvas-soft">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">বিষয় (Subject)</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">প্রশ্ন ও সময়</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">পরীক্ষার ভাষা</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">সিলেবাস ও প্রযোজ্য প্রোগ্রাম</th>
              </tr>
            </thead>
            <tbody>
              {subjectRows.map(([subject, format, langLabel, notes]) => (
                <tr key={subject} className="border-t border-canvas-soft">
                  <th scope="row" className="px-5 py-4 font-semibold text-petrol-800">{subject}</th>
                  <td className="px-5 py-4 font-semibold text-petrol-800">{format}</td>
                  <td className="px-5 py-4 text-petrol-800">{langLabel}</td>
                  <td className="px-5 py-4 text-ink-soft">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        tone="sage"
        title="বাংলাদেশ সময় (ঢাকা UTC+6) অনুযায়ী ২০২৬–২০২৭ পরীক্ষার সময়সূচি"
        intro="অফিশিয়াল পোর্টালে সব সময় বেইজিং সময় (UTC+8) অনুযায়ী দেওয়া থাকে, যা বাংলাদেশের সময়ের চেয়ে ২ ঘণ্টা এগিয়ে। নিচে ঢাকা সময় অনুযায়ী পরীক্ষার সঠিক সময় দেওয়া হলো:"
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-[15px] leading-6">
            <caption className="sr-only">বাংলাদেশ সময় অনুযায়ী CSCA পরীক্ষার রুটিন</caption>
            <thead className="bg-canvas-soft">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">পরীক্ষার সেশন ও তারিখ</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">১ম দিন (ঢাকা সময় · UTC+6)</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">২য় দিন (ঢাকা সময় · UTC+6)</th>
              </tr>
            </thead>
            <tbody>
              {scheduleRows.map(([dates, day1, day2]) => (
                <tr key={dates} className="border-t border-canvas-soft">
                  <th scope="row" className="px-5 py-4 font-semibold text-petrol-800">{dates}</th>
                  <td className="whitespace-pre-line px-5 py-4 text-ink-soft">{day1}</td>
                  <td className="whitespace-pre-line px-5 py-4 text-ink-soft">{day2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="বাংলাদেশ থেকে রেজিস্ট্রেশন ফি পেমেন্ট, হোম টেস্ট ও Exemption নিয়ম"
        intro="পরীক্ষার রেজিস্ট্রেশন করার আগে কার্ড পেমেন্ট, কম্পিউটার সেটআপ এবং আপনার প্রোগ্রামে CSCA প্রয়োজন কি না তা নিশ্চিত করে নিন।"
      >
        <div data-anim="stagger" className="grid gap-6 lg:grid-cols-3">
          {actionCards.map((card, idx) => (
            <div key={card.title} className={idx === 1 ? kit.cardLime : kit.cardSage}>
              <span className={kit.icon}><card.icon size={20} aria-hidden="true" /></span>
              <h3 className={`mt-4 ${kit.h3}`}>{card.title}</h3>
              <p className={`mt-3 ${kit.body}`}>{card.body}</p>
              <ul className="mt-5 space-y-2.5">
                {card.points.map(point => (
                  <li key={point} className="flex items-start gap-2.5 text-[15px] leading-6 text-petrol-800">
                    <CheckCircle2 size={17} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[16px] leading-7 text-ink-soft">
          আপনি যদি এখনো CSCA পরীক্ষার জন্য প্রস্তুত না থাকেন অথবা এমন বিশ্ববিদ্যালয়ে আবেদন করতে চান যেখানে ২০২৭ ইনটেকে CSCA ছাড়াও আবেদন গ্রহণ করা হচ্ছে, তবে আমাদের{' '}
          <Link href="/universities?country=China&cscaFree=1" className="font-semibold text-petrol-800 underline underline-offset-4">
            CSCA-মুক্ত চীনা বিশ্ববিদ্যালয় ডিরেক্টরি
          </Link>{' '}
          এবং{' '}
          <Link href="/updates/csca-exam-guide-chinese-universities-2026-2027" className="font-semibold text-petrol-800 underline underline-offset-4">
            বিশ্ববিদ্যালয়ভিত্তিক CSCA নীতিমালা গাইড
          </Link>{' '}
          দেখুন।
        </p>
      </Section>

      <Section
        id="bn-csca-pro-offer"
        tone="sage"
        title="এডুএক্সপ্রেসে চায়না ফাইল ওপেন করলেই ফ্রি CSCA Master Pro অ্যাক্সেস"
        intro="নিজে অনুমান করে প্রস্তুতি না নিয়ে আসল পরীক্ষার ফরম্যাটে ১৫৫টি মক টেস্ট ও ২১টি অফিশিয়াল বিগত প্রশ্নপত্রে অনুশীলন করুন।"
      >
        <CscaMasterProOfferCard lang="bn" assessmentHref="#bn-csca-assessment" />
      </Section>

      <Section tone="navy" title="ভিসা-ফার্স্ট সার্ভিস নীতি">
        <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:items-center">
          <div>
            <p className="flex items-start gap-3 text-[18px] leading-8 text-white/90">
              <ShieldCheck size={24} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
              <span>{visaFirstTermsBn}</span>
            </p>
            <p className="mt-4 text-[15px] leading-7 text-white/75">
              অফিশিয়াল ও প্রস্তুতি পোর্টাল:{' '}
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

      <div id="bn-csca-faq" className="scroll-mt-28">
        <FaqBlock items={bnCscaFaqs} title="CSCA পরীক্ষা সম্পর্কে সাধারণ প্রশ্নোত্তর" tone="white" />
      </div>

      <BnChinaRelatedGuides
        currentPath={PATH}
        englishTwin={{ label: '2027 CSCA Entrance Exam Guide (English)', href: EN_PATH }}
        ariaLabel="সম্পর্কিত বাংলা ও ইংরেজি চায়না গাইড"
      />

      <Section
        id="bn-csca-assessment"
        title="ফ্রি এডুকেশন ফিট অ্যাসেসমেন্ট ও ফ্রি CSCA Master Pro কোড বুকিং"
        intro="আপনার SSC ও HSC ফলাফল, পছন্দের বিষয় এবং ইনটেক জানান। আমাদের কাউন্সেলর আপনার উপযুক্ত বিশ্ববিদ্যালয় শর্টলিস্ট দেবেন এবং ফাইল ওপেন করলেই ফ্রি CSCA Master Pro কোড প্রদান করবেন।"
      >
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="সঠিক প্রস্তুতি ও স্বচ্ছ খরচের নিশ্চয়তায় চায়না আবেদন শুরু করুন"
        text="কোনো ফাইল ওপেনিং চার্জ নেই। যাচাইকৃত চায়না ফাইল ওপেন করলেই পাচ্ছেন ফ্রি CSCA Master Pro অ্যাক্সেস এবং ভিসা অনুমোদনের আগে শূন্য সার্ভিস ফির সুবিধা।"
      />
    </div>
  );
}
