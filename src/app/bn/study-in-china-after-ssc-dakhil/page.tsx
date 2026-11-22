import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileCheck2,
  Globe2,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Trophy,
  Wallet,
  Wrench,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import BnChinaRelatedGuides from '@/components/page/BnChinaRelatedGuides';
import { CtaBand, FaqBlock, JsonLd, Section, kit } from '@/components/page/PageKit';
import { breadcrumbJsonLd, citationJsonLd, primaryImageOfPageSchema, type Crumb } from '@/lib/json-ld';
import { toSafeExternalUrl } from '@/lib/safe-url';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bn/study-in-china-after-ssc-dakhil';
const EN_PATH = '/study-in-china-after-o-level-ssc';
export const revalidate = 3600;

const trail: Crumb[] = [
  { name: 'চীনে উচ্চশিক্ষা', path: '/bn/study-in-china' },
  { name: 'SSC ও দাখিলের পর চীনে পড়াশোনা' },
];

export const metadata = pageMetadata({
  title: 'SSC ও দাখিলের পর চীনে ৩+২ ডিপ্লোমা ও ব্যাচেলর | EduExpress',
  description:
    'SSC, দাখিল ও O-Level পাসের পর চীনে ৩ বছরের ডিপ্লোমা ও ২ বছরের টপ-আপ ব্যাচেলর (মোট ৫ বছরে ব্যাচেলর), ৩টি স্কলারশিপ স্তর, হোস্টেল খরচ ও গার্ডিয়ান নিয়ম।',
  path: PATH,
  image: ogImage('china-guide', 'SSC এবং দাখিল পাসের পর চীনে ৩+২ ডিপ্লোমা ও ব্যাচেলর প্রোগ্রাম — EduExpress International'),
  type: 'article',
  locale: 'bn_BD',
  languages: {
    'en-BD': EN_PATH,
    'bn-BD': PATH,
    'x-default': EN_PATH,
  },
});

const trustItemsBn = [
  { icon: CalendarCheck, title: '২০১৮ সাল থেকে', text: 'ধানমন্ডি, ঢাকা থেকে অভিভাবক ও শিক্ষার্থীদের কাউন্সেলিং' },
  { icon: MapPin, title: 'সরাসরি অফিস ভিজিট', text: 'শনিবার–বৃহস্পতিবার, সকাল ১১টা থেকে সন্ধ্যা ৬টা' },
  { icon: Wallet, title: 'ভিসার আগে ০ সার্ভিস ফি', text: 'চায়না ভিসা অনুমোদনের আগে কোনো সার্ভিস চার্জ নেই' },
  { icon: BadgeCheck, title: 'টিউশন ও থাকা-খাওয়া আলাদা', text: 'প্রতিটি খরচ লিখিত শিডিউলে উল্লেখ থাকে' },
] as const;

const visaFirstTermsBn =
  'কোনো ফাইল ওপেনিং চার্জ নেই। চায়না ভিসা অনুমোদনের আগে এডুএক্সপ্রেসের কোনো সার্ভিস ফি নেই। এর আগে বিশ্ববিদ্যালয়, এম্বাসি, মেডিকেল, অনুবাদ, কুরিয়ার, ডিপোজিট বা অন্য কোনো থার্ড-পার্টি ফি প্রয়োজন হলে শিক্ষার্থী এগোনোর আগেই তা লিখিতভাবে তালিকাভুক্ত করা হয়।';

const winCardsBn = [
  {
    badge: 'সময় সাশ্রয়',
    metric: '১ বছর আগেই ব্যাচেলর',
    title: '৬ বছরের বদলে ৫ বছরেই স্নাতক ডিগ্রি',
    detail:
      'বাংলাদেশে SSC বা দাখিলের পর ২ বছর HSC/আলিম এবং ৪ বছর ব্যাচেলর করতে মোট ৬ বছর লাগে। চীনে ৩ বছরের ডিপ্লোমা + ২ বছরের টপ-আপ ব্যাচেলর (৩+২) রুটে মোট ৫ বছরেই ব্যাচেলর শেষ করা যায়।',
  },
  {
    badge: 'টিউশন ও হোস্টেল সাশ্রয়',
    metric: 'CNY ০ – ৮,০০০ / বছর',
    title: 'স্বল্প বা শূন্য টিউশন ও ডরমিটরি খরচ',
    detail:
      'যোগ্যতা ও কোটার ভিত্তিতে ৩ ধরনের ডিপ্লোমা স্কলারশিপ পাওয়া যায়—টিউশন ও হোস্টেল পুরো ফ্রি থেকে শুরু করে শুধু হোস্টেল (CNY ১,২০০–৩,০০০/বছর) বা আংশিক প্যাকেজ (CNY ৫,০০০–৮,০০০/বছর)।',
  },
  {
    badge: 'দক্ষতা ও ল্যাব প্রশিক্ষণ',
    metric: 'প্রথম দিন থেকেই প্র্যাকটিক্যাল',
    title: 'ইঞ্জিনিয়ারিং, রোবোটিক্স ও টেকনোলজি দক্ষতা',
    detail:
      'তাত্ত্বিক HSC বা আলিম বইয়ের মুখস্থ পড়ার বদলে শিক্ষার্থীরা ১ম বর্ষ থেকেই CNC, মেকাট্রনিক্স, রোবোটিক্স, সফটওয়্যার বা ই-কমার্স ল্যাবে হাতে-কলমে প্রশিক্ষণ পায়।',
  },
] as const;

const timelineStepsBn = [
  {
    step: 'ধাপ ১ · ১ম–৩য় বছর',
    title: '৩ বছরের হায়ার ভোকেশনাল ডিপ্লোমা (Higher Vocational Diploma)',
    detail:
      'SSC, দাখিল (মাদ্রাসা বোর্ড) অথবা O-Level পাসের পরপরই চীনের স্বীকৃত পলিটেকনিক ও টেকনিক্যাল কলেজে ভর্তি। প্রয়োজন অনুযায়ী প্রথম সেমিস্টার বা প্রথম বছরে চাইনিজ ভাষা (HSK) প্রস্তুতি ও মূল প্র্যাকটিক্যাল কারিকুলাম সম্পন্ন হয়।',
  },
  {
    step: 'ধাপ ২ · ৪র্থ–৫ম বছর',
    title: '২ বছরের টপ-আপ ব্যাচেলর (Top-Up Bachelor Upgrade)',
    detail:
      '৩ বছরের ডিপ্লোমা এবং নির্ধারিত GPA ও HSK শর্ত পূরণ করে শিক্ষার্থীরা আর্টিকুলেশন চুক্তিভুক্ত চীনা বিশ্ববিদ্যালয়ের ৩য় বর্ষে (২ বছরের টপ-আপ ব্যাচেলর) সরাসরি আপগ্রেড করতে পারে।',
  },
  {
    step: 'মোট ৫ বছর',
    title: 'HSC/আলিম ছাড়াই পূর্ণাঙ্গ ব্যাচেলর ও ডিপ্লোমা সনদ',
    detail:
      '৫ বছর শেষে শিক্ষার্থীর হাতে থাকে একটি ৩ বছরের হায়ার ভোকেশনাল ডিপ্লোমা এবং একটি অনুমোদিত ব্যাচেলর ডিগ্রি—দেশের প্রচলিত ৬ বছরের তুলনায় পুরো ১ বছর এগিয়ে।',
  },
] as const;

const fiveYearProofRowsBn = [
  {
    criterion: 'SSC / দাখিল / O-Level থেকে ব্যাচেলর পর্যন্ত মোট সময়',
    local6Yr: 'মোট ৬ বছর (২ বছর HSC / আলিম + ৪ বছর বাংলাদেশের প্রাইভেট বিশ্ববিদ্যালয়ে ব্যাচেলর)',
    china5Yr: 'মোট ৫ বছর (৩ বছর ডিপ্লোমা + ২ বছর টপ-আপ ব্যাচেলর)',
    winNote: 'চাকরি বা বিদেশের মাস্টার্স পর্যায়ে পুরো ১ বছর আগে প্রবেশের সুযোগ।',
  },
  {
    criterion: 'প্রাতিষ্ঠানিক টিউশন ও ডরমিটরি খরচ (থাকা-খাওয়া আলাদা)',
    local6Yr: 'কলেজ/কোচিং + ক্যাটাগরি-A প্রাইভেট বিশ্ববিদ্যালয়ে ৪ বছরে শুধু টিউশন ও ফি বাবদ ~৯.১৭ থেকে ১৪.৩০ লাখ+ টাকা',
    china5Yr: '৩ বছরের ডিপ্লোমায় স্তরভেদে: টিউশন ফ্রি + হোস্টেল ফ্রি (স্তর ১), অথবা শুধু হোস্টেল CNY ১,২০০–৩,০০০/বছর (স্তর ২), অথবা মোট CNY ৫,০০০–৮,০০০/বছর (স্তর ৩)',
    winNote: 'প্রথম ৩ বছরেই পরিবারের বড় অঙ্কের টিউশন খরচ সাশ্রয় হয় (থাকা-খাওয়া বাজেট আলাদা)।',
  },
  {
    criterion: 'হাতে-কলমে টেকনিক্যাল ও আন্তর্জাতিক অভিজ্ঞতা',
    local6Yr: 'প্রথম ২ বছর শুধু বোর্ড পরীক্ষার সাধারণ তাত্ত্বিক প্রস্তুতি',
    china5Yr: '১৬–১৯ বছর বয়স থেকেই আধুনিক ইন্ডাস্ট্রিয়াল ল্যাব, HSK চাইনিজ ভাষা ও আন্তর্জাতিক ক্যাম্পাস অভিজ্ঞতা',
    winNote: 'ব্যাচেলর শেষের আগেই একটি ভকেশনাল ডিপ্লোমা ও ব্যবহারিক প্রজেক্ট পোর্টফোলিও তৈরি হয়।',
  },
] as const;

const diplomaScholarshipTiersBn = [
  {
    tier: 'স্তর ১ · ফুল ডিপ্লোমা স্কলারশিপ (Type A / Full)',
    tuition: 'সম্পূর্ণ ফ্রি (CNY ০)',
    hostel: 'সম্পূর্ণ ফ্রি (ক্যাম্পাস ডরমিটরি CNY ০)',
    total: 'CNY ০ / বছর (শুধু টিউশন + হোস্টেল)',
    note: 'উচ্চ নম্বর, প্রাদেশিক/প্রতিষ্ঠান কোটা ও বার্ষিক একাডেমিক ফলাফল রিভিউ সাপেক্ষে প্রযোজ্য।',
  },
  {
    tier: 'স্তর ২ · ক্লাস বি / টিউশন ফ্রি স্কলারশিপ (Type B)',
    tuition: 'সম্পূর্ণ ফ্রি (CNY ০)',
    hostel: 'বছরে CNY ১,২০০ – ৩,০০০',
    total: 'CNY ১,২০০ – ৩,০০০ / বছর (শুধু হোস্টেল ফি)',
    note: 'SSC, দাখিল ও O-Level শিক্ষার্থীদের জন্য সবচেয়ে প্রচলিত মেধাভিত্তিক স্তর; রুম শেয়ারিং অনুযায়ী হোস্টেল ফি নির্ধারিত হয়।',
  },
  {
    tier: 'স্তর ৩ · আংশিক স্কলারশিপ প্যাকেজ (Partial)',
    tuition: 'হ্রাসকৃত টিউশন ফি অন্তর্ভুক্ত',
    hostel: 'প্যাকেজের ভেতরেই হোস্টেল অন্তর্ভুক্ত',
    total: 'CNY ৫,০০০ – ৮,০০০ / বছর (টিউশন + হোস্টেল)',
    note: 'ফুল/টিউশন-ফ্রি কোটা শেষ হলে সহজপ্রাপ্য সাশ্রয়ী রুট; প্রতিটি অফার লেটারে বিভাজন লিখিত থাকে।',
  },
] as const;

const curriculumTracksBn = [
  {
    icon: Wrench,
    title: 'মেকাট্রনিক্স, CNC ও স্মার্ট রোবোটিক্স',
    curriculum: 'Industrial Automation, CNC Machining, Robotics, Electrical Equipment & EV Systems — কারখানার বাস্তব ল্যাব ও ওয়ার্কশপভিত্তিক কারিকুলাম।',
    linkHref: '/updates/yunnan-provincial-government-scholarship-vocational-diploma-2027',
    linkLabel: 'YVCMET প্রাদেশিক স্কলারশিপ উদাহরণ দেখুন',
  },
  {
    icon: Building2,
    title: 'সফটওয়্যার, কম্পিউটিং ও ই-কমার্স',
    curriculum: 'Computer Application Technology, Software Engineering, Cross-Border E-Commerce, Digital Supply Chain & Logistics।',
    linkHref: '/programs',
    linkLabel: 'চীনের প্রোগ্রাম ডিরেক্টরি দেখুন',
  },
  {
    icon: FileCheck2,
    title: 'সিভিল, রেল অপারেশন ও হসপিটালিটি',
    curriculum: 'Civil Construction Technology, High-Speed Rail & Logistics Management, International Hospitality & Tourism।',
    linkHref: '/china-universities',
    linkLabel: 'যাচাইকৃত চীনা প্রতিষ্ঠান দেখুন',
  },
] as const;

const officialSourcesBn = [
  { label: 'চীনের শিক্ষা মন্ত্রণালয় (MoE China)', href: 'http://en.moe.gov.cn/' },
  { label: 'Campus China — অফিশিয়াল স্টাডি ইন চায়না পোর্টাল', href: 'https://www.campuschina.org/' },
  { label: 'MoE Order No. 42 — আন্তর্জাতিক শিক্ষার্থী ও অপ্রাপ্তবয়স্ক অভিভাবক নীতি', href: 'https://www.campuschina.org/content/details3_74776.html' },
  { label: 'ঢাকাস্থ গণপ্রজাতন্ত্রী চীনের দূতাবাস', href: 'https://bd.china-embassy.gov.cn/eng/' },
  { label: 'CBCA — China Bangladesh Consultancy Alliance (#08)', href: 'https://cbcabd.org/' },
  { label: 'FACD-CAB (FACECAB) অফিশিয়াল ডিরেক্টরি (ID: FCM-452)', href: 'https://www.facdcab.org/members/directory/2264' },
];

const faqsBn = [
  {
    question: 'SSC বা মাদ্রাসা বোর্ডের দাখিল (Dakhil) পাসের পর কি সরাসরি চীনে পড়া যায়?',
    answer:
      'হ্যাঁ। বাংলাদেশ শিক্ষা বোর্ডের SSC এবং মাদ্রাসা শিক্ষা বোর্ডের দাখিল (Dakhil)—উভয়ই মাধ্যমিক (১০ম শ্রেণি সমমান) সনদ হিসেবে চীনের ৩ বছরের হায়ার ভোকেশনাল ডিপ্লোমা প্রোগ্রামে আবেদনের জন্য গ্রহণযোগ্য। ইংরেজি মাধ্যমের O-Level শিক্ষার্থীরাও একইভাবে আবেদন করতে পারে।',
  },
  {
    question: 'দাখিল শিক্ষার্থীদের জন্য কি কোনো আলাদা বাধা আছে?',
    answer:
      'না। দাখিল (বিজ্ঞান বা সাধারণ বিভাগ) সনদ শিক্ষা মন্ত্রণালয় ও মাদ্রাসা শিক্ষা বোর্ড কর্তৃক স্বীকৃত, তাই যথাযথ ইংরেজি অনুবাদ ও পররাষ্ট্র মন্ত্রণালয় (MoFA) / নোটারাইজেশন সম্পন্ন থাকলে SSC-এর মতোই আবেদন করা যায়। তবে ইঞ্জিনিয়ারিং বা টেকনিক্যাল বিষয়ের জন্য গণিত ও বিজ্ঞান বিষয়ে ভালো নম্বর থাকা প্রয়োজন।',
  },
  {
    question: '৩+২ প্রোগ্রামে মাসিক থাকা-খাওয়ার খরচ কি স্কলারশিপ বা টিউশন মোটের ভেতরে ধরা আছে?',
    answer:
      'না। এই পৃষ্ঠার সব টেবিলে টিউশন ও হোস্টেল ফি আলাদা রাখা হয়েছে এবং প্রতিদিনের খাবার, মোবাইল, যাতায়াত ও ব্যক্তিগত খরচ সম্পূর্ণ আলাদা দেখানো হয়েছে। শহর ও জীবনযাত্রা অনুযায়ী মাসে সাধারণত CNY ৮০০ থেকে CNY ১,৪০০ (ক্যান্টিন ব্যবহারে) আলাদাভাবে বাজেট করতে হয়। এছাড়া মেডিকেল চেকআপ, রেসিডেন্স পারমিট, বিমা (~CNY ৮০০/বছর), ভিসা ফি ও বিমান ভাড়া আলাদা থার্ড-পার্টি খরচ।',
  },
  {
    question: 'SSC বা দাখিল পাসের পর শিক্ষার্থীর বয়স ১৮ বছরের কম হলে ভিসা ও অভিভাবক নিয়ম কী?',
    answer:
      'চীনের শিক্ষা মন্ত্রণালয়ের Order No. 42 (Article 38) অনুযায়ী, ১৮ বছরের কম বয়সী আন্তর্জাতিক শিক্ষার্থীর বাবা-মা চীনে বসবাস না করলে শিক্ষার্থী ১৮ বছর পূর্ণ না হওয়া পর্যন্ত চীনে অবস্থানরত একজন নোটারিকৃত লিগ্যাল গার্ডিয়ান (Legal Guardian) থাকা বাধ্যতামূলক। সব কলেজ অনূর্ধ্ব-১৮ শিক্ষার্থী গ্রহণ করে না—তাই আবেদনের আগেই এডুএক্সপ্রেস প্রতিটি কলেজের বয়স ও গার্ডিয়ান নীতি লিখিতভাবে যাচাই করে নেয়।',
  },
  {
    question: 'ডিপ্লোমা প্রোগ্রাম কি ইংরেজি নাকি চাইনিজ মাধ্যমে পড়ানো হয়?',
    answer:
      'চীনের বেশিরভাগ ৩ বছরের টেকনিক্যাল ও ভোকেশনাল ডিপ্লোমা চাইনিজ মাধ্যমে (শুরুতে ১ সেমিস্টার থেকে ১ বছর চাইনিজ ভাষা ও HSK প্রস্তুতিসহ) পরিচালিত হয়; কিছু নির্বাচিত প্রোগ্রামে বাইলিঙ্গুয়াল বা ইংরেজি-সহায়ক ক্লাস রয়েছে। আপনি যদি চাইনিজ ভাষা শিখতে না চান এবং সম্পূর্ণ ইংরেজি মাধ্যমে O-Level-এর পর যেতে চান, তবে আমাদের মালয়েশিয়া ফাউন্ডেশন ও ডিপ্লোমা গাইডটি দেখতে পারেন।',
  },
  {
    question: 'চায়না ডিপ্লোমা প্রোগ্রামের জন্য এডুএক্সপ্রেসের সার্ভিস চার্জ কত ও কখন দিতে হয়?',
    answer:
      'কোনো ফাইল ওপেনিং চার্জ নেই। চায়না ভিসা (X1) অনুমোদনের আগে এডুএক্সপ্রেসের কোনো সার্ভিস ফি দিতে হয় না। বিশ্ববিদ্যালয়ের আবেদন ফি, নোটারি, মেডিকেল, দূতাবাস ফি বা ডিপোজিট আগে প্রদেয় হলে তা আগে থেকেই লিখিতভাবে জানানো হয়।',
  },
];

export default function BengaliStudyInChinaAfterSscDakhilPage() {
  const url = `${SITE}${PATH}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'Article'],
    '@id': `${url}#page`,
    url,
    headline: 'SSC, দাখিল ও O-Level-এর পর চীনে ৩+২ ডিপ্লোমা ও ব্যাচেলর গাইড ২০২৭',
    name: 'SSC ও দাখিলের পর চীনে পড়াশোনা: ৩ বছর ডিপ্লোমা + ২ বছর ব্যাচেলর (৫ বছর)',
    description:
      'SSC, দাখিল ও O-Level পাসের পর চীনে ৩ বছরের ডিপ্লোমা ও ২ বছরের টপ-আপ ব্যাচেলর রুট, ৩টি স্কলারশিপ স্তর, পৃথক থাকা-খাওয়া বাজেট এবং অনূর্ধ্ব-১৮ গার্ডিয়ান শর্ত।',
    inLanguage: 'bn-BD',
    mainEntityOfPage: url,
    image: `${SITE}/og/china-guide.jpg`,
    primaryImageOfPage: primaryImageOfPageSchema('/og/china-guide.jpg'),
    datePublished: '2026-11-21T00:00:00Z',
    dateModified: '2026-11-21T00:00:00Z',
    author: { '@type': 'Person', name: 'Afsana Meme', jobTitle: 'Senior Consultant — China Admissions & Scholarships' },
    reviewedBy: { '@type': 'Person', name: 'Abdullah Al Rakib', jobTitle: 'Founder and CEO' },
    publisher: { '@id': `${SITE}/#organization` },
    isPartOf: { '@id': `${SITE}/#website` },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    ...citationJsonLd(officialSourcesBn),
  };

  return (
    <div lang="bn" className="text-petrol-800">
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbJsonLd(trail, PATH)} />

      {/* Hero Section */}
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
                  <span aria-current="page" className="text-petrol-800">SSC ও দাখিলের পর চীন (৩+২)</span>
                </li>
              </ol>
            </nav>
            <p className={`anim-rise mt-6 ${kit.badge}`}>
              <Award size={15} aria-hidden="true" /> SSC, দাখিল ও O-Level সমমান · ৫ বছরে ব্যাচেলর · ভিসার আগে ০ সার্ভিস ফি
            </p>
            <h1 className="anim-lift mt-5 font-display text-[26px] xs:text-[30px] font-bold leading-[1.25] text-petrol-800 sm:text-[44px] lg:text-[54px] sm:leading-[1.18]">
              SSC বা দাখিলের পর চীনে ৩+২ ডিপ্লোমা ও ব্যাচেলর পড়াশোনা।
            </h1>
            <p className={`anim-rise mt-6 max-w-2xl ${kit.lead}`}>
              দেশে HSC বা আলিম পাসের জন্য ২ বছর অপেক্ষা না করে সরাসরি চীনে <strong>৩ বছরের ডিপ্লোমা + ২ বছরের টপ-আপ ব্যাচেলর (মোট ৫ বছর)</strong> সম্পন্ন করুন—ফ্রি টিউশন ও ডরমিটরি স্কলারশিপ স্তর এবং ভিসার আগে শূন্য সার্ভিস ফির সুবিধাসহ।
            </p>
            <div className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#bn-ssc-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                আমার যোগ্যতা ও স্কলারশিপ যাচাই করুন <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link href={EN_PATH} hrefLang="en-BD" className="ed-btn ed-btn-outline min-h-[52px] px-6">
                <Globe2 size={17} aria-hidden="true" /> <span lang="en">Read in English (O-Level / SSC)</span>
              </Link>
            </div>
          </div>

          <figure className="anim-rise relative aspect-[4/3] overflow-hidden rounded-3xl bg-petrol-800">
            <Image
              src="/images/destinations/china-study-guide.webp"
              alt="SSC এবং দাখিল পাসের পর চীনের টেকনিক্যাল ও ব্যাচেলর ক্যাম্পাস"
              fill
              priority
              sizes="(max-width:1024px) 100vw, 480px"
              className="object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/95 px-4 py-2.5 text-[13px] font-semibold text-petrol-800 backdrop-blur-sm">
              <span>৩ বছর ডিপ্লোমা + ২ বছর ব্যাচেলর (মোট ৫ বছর)</span>
              <span className="rounded-full bg-lime-pale px-2.5 py-0.5 text-[12px] text-lime-deep">
                থাকা-খাওয়া খরচ আলাদা
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Bangla Trust Bar */}
      <section aria-label="কেন পরিবারগুলো এডুএক্সপ্রেসের ওপর আস্থা রাখে" className="border-b border-canvas-soft bg-white py-8">
        <ul data-anim="stagger" className={`${kit.wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
          {trustItemsBn.map(item => (
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

      {/* Direct Answer & Timeline */}
      <Section
        lang="bn"
        id="pathway-timeline"
        title="SSC, দাখিল ও O-Level পাসের পর কীভাবে ৫ বছরে ব্যাচেলর সম্পন্ন হয়?"
        intro="সাধারণভাবে বাংলাদেশের SSC বা মাদ্রাসা বোর্ডের দাখিল (Dakhil) পাসের পর ২ বছর HSC/আলিম এবং ৪ বছর ব্যাচেলর ডিগ্রি করতে মোট ৬ বছর সময় লেগে যায়। চীনের কারিগরি ও উচ্চশিক্ষা কাঠামোতে যোগ্য শিক্ষার্থীরা ১০ম শ্রেণি সমমান (SSC / দাখিল / O-Level) পাসের পর সরাসরি ৩ বছরের হায়ার ভোকেশনাল ডিপ্লোমা প্রোগ্রামে ভর্তি হয়ে পরে ২ বছরের টপ-আপ ব্যাচেলরে (৩+২ রুট) উন্নীত হতে পারে। এতে সময় বাঁচে পুরো ১ বছর এবং প্রাতিষ্ঠানিক স্কলারশিপে প্রথম ৩ বছরের টিউশন ও ডরমিটরি খরচ অতি স্বল্প বা শূন্য রাখা যায়।"
      >
        <div data-anim="stagger" className="grid gap-6 md:grid-cols-3">
          {timelineStepsBn.map(item => (
            <div key={item.step} className={kit.cardSage}>
              <span className={kit.badge}>
                <Clock size={14} aria-hidden="true" />
                {item.step}
              </span>
              <h3 className={`mt-4 ${kit.h3}`}>{item.title}</h3>
              <p className={`mt-2 ${kit.body}`}>{item.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why Students Win Scorecard */}
      <Section
        lang="bn"
        id="why-students-win"
        tone="sage"
        title="SSC ও দাখিল শিক্ষার্থীরা যে ৩টি ক্ষেত্রে সরাসরি জিতছে"
        intro="শুধু তুলনা নয়—সময়, খরচ এবং প্র্যাকটিক্যাল দক্ষতার হিসেবে কেন এই পথটি বাংলাদেশের শিক্ষার্থীদের এগিয়ে রাখছে তা দেখুন।"
      >
        <div data-anim="stagger" className="grid gap-6 lg:grid-cols-3">
          {winCardsBn.map(card => (
            <div
              key={card.title}
              className={`${kit.card} flex flex-col justify-between`}
            >
              <div>
                <span className={kit.badge}>
                  <Trophy size={13} aria-hidden="true" />
                  {card.badge}
                </span>
                <p className="mt-4 font-display text-[26px] font-black leading-tight text-petrol-800 sm:text-[28px]">
                  {card.metric}
                </p>
                <h3 className={`mt-2 ${kit.h3}`}>{card.title}</h3>
                <p className={`mt-2 ${kit.body}`}>{card.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 5-Year vs 6-Year Direct Proof Table */}
      <Section
        lang="bn"
        id="five-year-proof"
        title="প্রমাণ ছক: বাংলাদেশের ৬ বছরের সাধারণ পথ বনাম চীনের ৫ বছরের ৩+২ পথ"
        intro="প্রতিটি খরচের হিসাবেই মাসিক থাকা-খাওয়া (খাবার ও ব্যক্তিগত খরচ) টিউশন ও হোস্টেল ফি থেকে সম্পূর্ণ আলাদা রাখা হয়েছে।"
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white">
          <table className="w-full min-w-[760px] text-left text-[15px] leading-6">
            <caption className="sr-only">বাংলাদেশের ৬ বছরের রুট বনাম চীনের ৫ বছরের ৩+২ ডিপ্লোমা থেকে ব্যাচেলর প্রমাণের তুলনা</caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">তুলনার বিষয়</th>
                <th scope="col" className="p-4 font-bold">বাংলাদেশে ৬ বছরের সাধারণ পথ</th>
                <th scope="col" className="p-4 font-bold text-lime">চীনে ৫ বছরের ৩+২ পথ</th>
                <th scope="col" className="p-4 font-bold">শিক্ষার্থীর প্রকৃত লাভ (Win)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {fiveYearProofRowsBn.map(row => (
                <tr key={row.criterion}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">{row.criterion}</th>
                  <td className="p-4 align-top">{row.local6Yr}</td>
                  <td className="bg-lime-pale/30 p-4 align-top font-semibold text-lime-deep">{row.china5Yr}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{row.winNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 3 Scholarship Tiers + Separated Living Cost */}
      <Section
        lang="bn"
        id="scholarship-tiers"
        tone="sage"
        title="চীনা ডিপ্লোমার ৩টি স্কলারশিপ স্তর ও পৃথক থাকা-খাওয়ার বাজেট"
        intro="অংশগ্রহণকারী চীনা পলিটেকনিক ও ভোকেশনাল কলেজগুলোতে টিউশন ও হোস্টেল ফি মূলত এই ৩টি প্রাতিষ্ঠানিক স্তরে নির্ধারিত হয়।"
      >
        <div className="overflow-x-auto rounded-3xl bg-white">
          <table className="w-full min-w-[740px] text-left text-[15px] leading-6">
            <caption className="sr-only">চীনের ৩ বছরের ডিপ্লোমা প্রোগ্রামের ৩টি স্কলারশিপ স্তর</caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">স্কলারশিপ স্তর</th>
                <th scope="col" className="p-4 font-bold">বাৎসরিক টিউশন ফি</th>
                <th scope="col" className="p-4 font-bold">বাৎসরিক হোস্টেল ফি</th>
                <th scope="col" className="p-4 font-bold text-lime">প্রাতিষ্ঠানিক মোট (থাকা-খাওয়া ছাড়া)</th>
                <th scope="col" className="p-4 font-bold">শর্ত ও নবায়ন নিয়ম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {diplomaScholarshipTiersBn.map(row => (
                <tr key={row.tier}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">{row.tier}</th>
                  <td className="p-4 align-top font-semibold text-lime-deep">{row.tuition}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{row.hostel}</td>
                  <td className="bg-lime-pale/30 p-4 align-top font-bold text-petrol-800">{row.total}</td>
                  <td className="p-4 align-top">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div data-anim="stagger" className="mt-8 grid gap-6 md:grid-cols-2">
          <div className={kit.card}>
            <h3 className={kit.h3}>মাসিক থাকা-খাওয়া ও থার্ড-পার্টি খরচ (আলাদা হিসাব)</h3>
            <ul className="mt-4 space-y-2.5 text-[15px] leading-6 text-ink-soft">
              <li>• <strong className="text-petrol-800">খাবার ও ব্যক্তিগত মাসিক খরচ (আলাদা):</strong> সাধারণত মাসে CNY ৮০০ থেকে CNY ১,৪০০ (ক্যাম্পাস ক্যান্টিন ও শহরভেদে ভিন্ন; এটি টিউশন মোটের ভেতরে নয়)।</li>
              <li>• <strong className="text-petrol-800">বাধ্যতামূলক স্বাস্থ্য বিমা:</strong> বছরে প্রায় CNY ৮০০ (MoE নিয়ম অনুযায়ী প্রদেয়)।</li>
              <li>• <strong className="text-petrol-800">ভিসা ও যাতায়াত থার্ড-পার্টি খরচ:</strong> মেডিকেল পরীক্ষা, নোটারি/MoFA সত্যায়ন, দূতাবাস ভিসা ফি, রেসিডেন্স পারমিট (CNY ৪০০–৮০০/বছর) ও বিমান টিকিট।</li>
            </ul>
          </div>

          <div className={kit.cardDark}>
            <h3 className="text-[20px] font-bold text-lime">ভিসা-ফার্স্ট পেমেন্ট নীতি</h3>
            <p className="mt-3 flex items-start gap-2.5 text-[15px] leading-7 text-white/90">
              <ShieldCheck size={20} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
              <span>{visaFirstTermsBn}</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link href="/bn/study-in-china-cost-bangladesh" className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-lime hover:underline">
                চীনে খরচের পূর্ণাঙ্গ বাংলা গাইড <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Curriculum Tracks */}
      <Section
        lang="bn"
        id="curriculum-fields"
        title="জনপ্রিয় ৩ বছরের ডিপ্লোমা কারিকুলাম ও বিষয়সমূহ"
        intro="চীনের হায়ার ভোকেশনাল কলেজগুলো বাস্তব শিল্প-কারখানা ও আধুনিক প্রযুক্তিনির্ভর দক্ষতা তৈরিতে অগ্রাধিকার দেয়।"
      >
        <div data-anim="stagger" className="grid gap-6 lg:grid-cols-3">
          {curriculumTracksBn.map(track => (
            <div key={track.title} className={`${kit.cardSage} flex flex-col justify-between`}>
              <div>
                <span className={kit.icon}>
                  <track.icon size={22} aria-hidden="true" />
                </span>
                <h3 className={`mt-4 ${kit.h3}`}>{track.title}</h3>
                <p className={`mt-2 ${kit.body}`}>{track.curriculum}</p>
              </div>
              <div className="mt-5 border-t border-petrol-800/10 pt-4">
                <Link href={track.linkHref} className={kit.link}>
                  {track.linkLabel} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Under-18 Legal Guardian & Suitability Caveats */}
      <Section
        lang="bn"
        id="safeguards"
        tone="sage"
        title="SSC ও দাখিল শিক্ষার্থীদের জন্য বয়স, গার্ডিয়ান ও উপযোগিতা যাচাই"
        intro="ভুল বা অসম্পূর্ণ তথ্যে আবেদন করলে ভিসা বা ভর্তি জটিলতা হতে পারে—তাই এই বিষয়গুলো আবেদনের আগেই যাচাই করা জরুরি।"
      >
        <div data-anim="stagger" className="grid gap-6 md:grid-cols-2">
          <div className={kit.card}>
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-clay/10 text-clay">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className={kit.h3}>১৮ বছরের কম বয়সীদের আইনি অভিভাবক শর্ত (MoE Order 42)</h3>
            </div>
            <p className={`mt-3 ${kit.body}`}>
              SSC বা দাখিল পাস করা অনেক শিক্ষার্থীর বয়স ১৬ বা ১৭ বছর থাকে। চীনের শিক্ষা মন্ত্রণালয়ের নিয়ম অনুযায়ী, শিক্ষার্থীর বয়স ১৮ বছর পূর্ণ না হলে এবং বাবা-মা চীনে না থাকলে চীনে অবস্থানরত একজন নোটারিকৃত লিগ্যাল গার্ডিয়ান (Legal Guardian) মনোনয়ন দিতে হয়। প্রতিটি কলেজ অনূর্ধ্ব-১৮ শিক্ষার্থী গ্রহণ করে কি না তা আমরা লিখিতভাবে যাচাই করে নিই।
            </p>
          </div>

          <div className={kit.cardLime}>
            <div className="flex items-center gap-3">
              <span className={kit.iconLime}>
                <CheckCircle2 size={20} aria-hidden="true" />
              </span>
              <h3 className={kit.h3}>কাদের জন্য উপযোগী — এবং কাদের জন্য নয়</h3>
            </div>
            <p className={`mt-3 ${kit.body}`}>
              <strong className="text-petrol-800">উপযোগী:</strong> SSC, দাখিল বা O-Level পাস শিক্ষার্থী যারা ইঞ্জিনিয়ারিং, রোবোটিক্স, আইটি বা ব্যবসায় হাতে-কলমে দক্ষ হয়ে ৫ বছরেই ব্যাচেলর শেষ করতে চায় এবং চাইনিজ ভাষা (HSK) শিখতে প্রস্তুত।
              <br />
              <strong className="text-petrol-800">উপযোগী নয়:</strong> যারা MBBS ডাক্তারি পড়তে চায় (BMDC-র জন্য HSC বিজ্ঞান বা A-Level বায়োলজি আবশ্যক), অথবা যারা চাইনিজ ভাষা ছাড়া ইংরেজি মাধ্যমে শুরু করতে চায় (তারা O-Level-এর পর{' '}
              <Link href="/study-in-malaysia-after-o-level" hrefLang="en" className="font-semibold text-petrol-800 underline underline-offset-4">
                মালয়েশিয়া ফাউন্ডেশন রুট
              </Link>{' '}
              দেখতে পারেন)।
            </p>
          </div>
        </div>

        <div className={`mt-8 ${kit.card}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-[14px] leading-6 text-ink-soft">
              <strong className="text-petrol-800">প্রস্তুতকারী ও পর্যালোচনা:</strong> আফসানা মিমি (Senior Consultant — China Admissions &amp; Scholarships) · পর্যালোচনা: আব্দুল্লাহ আল রাকিব (Founder &amp; CEO) · অ্যাসোসিয়েশন: CBCA ফাউন্ডিং মেম্বার (#08) ও FACD-CAB / FACECAB (ID: FCM-452) · সর্বশেষ যাচাই: ২১ নভেম্বর ২০২৬ · পরবর্তী রিভিউ: ২১ ফেব্রুয়ারি ২০২৭
            </div>
            <div className="flex flex-wrap gap-3 text-[13.5px]">
              {officialSourcesBn.map(src => {
                const safeHref = toSafeExternalUrl(src.href);
                return safeHref ? (
                  <a
                    key={src.href}
                    href={safeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-petrol-800 underline underline-offset-4"
                  >
                    {src.label} <ExternalLink size={12} className="text-lime-deep" aria-hidden="true" />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <div id="bn-ssc-faq" className="scroll-mt-28">
        <FaqBlock lang="bn" items={faqsBn} title="SSC ও দাখিলের পর চীনে পড়াশোনা: সাধারণ প্রশ্নোত্তর" tone="white" />
      </div>

      {/* Shared Bengali China Cross-Links */}
      <BnChinaRelatedGuides
        currentPath={PATH}
        englishTwin={{ label: 'Study in China After O-Level or SSC (English)', href: EN_PATH }}
        ariaLabel="সম্পর্কিত বাংলা ও ইংরেজি চায়না গাইড"
      />

      {/* Embedded Bengali Assessment */}
      <Section
        lang="bn"
        id="bn-ssc-assessment"
        title="SSC / দাখিল / O-Level প্রোফাইল যাচাই করুন"
        intro="আপনার বোর্ড, প্রাপ্ত নম্বর/GPA, বয়স এবং পছন্দের বিষয় জানান। এডুএক্সপ্রেসের চীনা ভর্তি ডেস্ক এক কার্যদিবসের মধ্যে উপযুক্ত কলেজ, স্কলারশিপ স্তর এবং গার্ডিয়ান নিয়মসহ লিখিত পরিকল্পনা দেবে।"
      >
        <div className="mx-auto max-w-3xl">
          <EducationFitAssessment initialContext={{ country: 'china', language: 'bn' }} />
        </div>
      </Section>

      <CtaBand
        lang="bn"
        title="সঠিক তথ্যে ৫ বছরের ব্যাচেলর যাত্রা শুরু করুন"
        text="কোনো ফাইল ওপেনিং চার্জ নেই এবং চায়না ভিসা অনুমোদনের আগে এডুএক্সপ্রেসের কোনো সার্ভিস ফি নেই। ধানমন্ডি অফিসে আসুন অথবা WhatsApp-এ ফ্রি অ্যাসেসমেন্ট নিন।"
        assessmentHref="#bn-ssc-assessment"
        assessmentLabel="ফ্রি অ্যাসেসমেন্ট নিন"
        whatsappLabel="WhatsApp-এ কাউন্সেলরের সাথে কথা বলুন"
        whatsappMessage="আসসালামু আলাইকুম। SSC / দাখিল / O-Level পাসের পর চীনে ৩+২ ডিপ্লোমা ও স্কলারশিপ সম্পর্কে জানতে চাই।"
      />
    </div>
  );
}
