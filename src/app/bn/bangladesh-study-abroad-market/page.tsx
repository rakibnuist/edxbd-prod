import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe2,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import ReportCitationActions from '@/components/china/ReportCitationActions';
import BnChinaRelatedGuides from '@/components/page/BnChinaRelatedGuides';
import { CtaBand, FaqBlock, JsonLd, Section, kit } from '@/components/page/PageKit';
import {
  BANGLADESH_MARKET_LAST_VERIFIED_ISO,
  BANGLADESH_MARKET_SOURCES,
  buildBangladeshMarketBenchmark,
} from '@/lib/bangladesh-market-benchmark';
import { breadcrumbJsonLd, citationJsonLd, primaryImageOfPageSchema, type Crumb } from '@/lib/json-ld';
import { toSafeExternalUrl } from '@/lib/safe-url';
import { ogImage, pageMetadata } from '@/lib/seo';
import { getUniversityRecords } from '@/lib/university-records';
import { getPublishedStories } from '@/app/success-stories/stories';

export const revalidate = 3600;

const SITE = 'https://eduexpressint.com';
const PATH = '/bn/bangladesh-study-abroad-market';
const EN_PATH = '/bangladesh-study-abroad-market';
const canonical = `${SITE}${PATH}`;

const trail: Crumb[] = [{ name: 'বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষা ২০২৭' }];

export const metadata = pageMetadata({
  title: 'বিদেশে উচ্চশিক্ষা ২০২৭: বাংলাদেশ মার্কেট গাইড | EduExpress',
  description:
    'বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষা ২০২৭: ১২টি দেশের টিউশন ও থাকা-খাওয়ার আলাদা হিসাব, স্টুডেন্ট ফাইল নিয়ম, SSC/HSC ও O/A-Level রুট এবং লিখিত খরচ।',
  path: PATH,
  image: ogImage('parents', 'বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষা ও খরচের লিখিত গাইড — EduExpress International'),
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
  { icon: Wallet, title: 'ভিসার আগে ০ টাকা', text: 'চীন ভিসার আগে এবং মালয়েশিয়া আবেদনে সার্ভিস ফি ০ টাকা' },
  { icon: BadgeCheck, title: 'টিউশন ও থাকা-খাওয়া আলাদা', text: 'প্রতিটি খরচ লিখিত শিডিউলে উল্লেখ থাকে' },
];

const macroDriversBn = [
  {
    badge: 'মার্কেট ট্রেন্ড',
    title: 'পশ্চিমা দেশের পরিবর্তে চীন, মালয়েশিয়া ও ইউরোপমুখী ঝোঁক',
    detail:
      'বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষাগ্রহণকারী শিক্ষার্থীর সংখ্যা ১ লাখ ছাড়িয়েছে বলে সাম্প্রতিক বিশ্লেষণে উঠে এসেছে। ডলারের বিপরীতে টাকার মান কমে যাওয়া, ২০২৭ সালের জানুয়ারি থেকে UK Graduate Route-এ ১৮ মাসের সীমা এবং কানাডা/অস্ট্রেলিয়ার ভিসা কড়াকড়ির কারণে পরিবারগুলো এখন বাস্তবসম্মত খরচের গন্তব্য খুঁজছে।',
  },
  {
    badge: 'খরচের স্বচ্ছতা',
    title: 'টিউশন ফি ও থাকা-খাওয়ার খরচ সবসময় আলাদা হিসাব করুন',
    detail:
      'অনেক এজেন্সি টিউশন ও ডরমিটরির সাথে আনুমানিক খাবার খরচ মিলিয়ে বিভ্রান্তিকর প্যাকেজ দেখায়। এডুএক্সপ্রেস প্রতিটি টেবিলে বিশ্ববিদ্যালয়ের টিউশন, থাকা-খাওয়া (Living Cost) এবং থার্ড-পার্টি ফি (ভিসা, EMGS, মেডিকেল, বিমা) আলাদা কলামে দেখায়।',
  },
  {
    badge: 'এআই ও যাচাইযোগ্য তথ্য',
    title: 'সিদ্ধান্ত নেওয়ার আগে সরকারি উৎস যাচাই জরুরি',
    detail:
      'শিক্ষার্থী ও অভিভাবকেরা এখন ChatGPT বা Gemini-এর মতো AI দিয়েও তথ্য যাচাই করেন। তাই প্রতিটি বিশ্ববিদ্যালয়ের স্বীকৃতি (MoE, MQA, BMDC, UKVI) এবং সর্বশেষ যাচাইয়ের তারিখ লিখিতভাবে দেখে সিদ্ধান্ত নেওয়া নিরাপদ।',
  },
];

const entryPathwaysBn = [
  {
    title: 'SSC / দাখিল / O-Level পাসের পর',
    detail:
      'দেশে ২ বছর HSC বা A-Level কোচিংয়ে ৪.৮–১৫ লাখ+ টাকা খরচ ও সময় না বাড়িয়ে মালয়েশিয়ায় ১ বছরের ফাউন্ডেশন + ৩ বছরের ব্যাচেলর (মোট ৪ বছর) অথবা চীনে ৩ বছরের ডিপ্লোমা + ২ বছরের টপ-আপ ব্যাচেলর (মোট ৫ বছর) রুট যাচাই করা যায়।',
    links: [
      { label: 'SSC ও দাখিলের পর চীনে ৩+২ গাইড (বাংলা)', href: '/bn/study-in-china-after-ssc-dakhil' },
      { label: 'মালয়েশিয়া O-Level রুট (English)', href: '/study-in-malaysia-after-o-level' },
    ],
  },
  {
    title: 'HSC / আলিম / A-Level পাসের পর',
    detail:
      'ঢাকার ক্যাটাগরি-A প্রাইভেট বিশ্ববিদ্যালয়ে ৪ বছরে ৯.১৭–১৪.৩০ লাখ টাকা টিউশন ফির তুলনায় চীনের র‍্যাংকড বিশ্ববিদ্যালয়ে ইউনিভার্সিটি/প্রাদেশিক স্কলারশিপ, মালয়েশিয়ায় Monash/Nottingham শাখা ক্যাম্পাস, হাঙ্গেরি, দক্ষিণ কোরিয়া, ফিনল্যান্ড বা UK ৩-বছরের ব্যাচেলর তুলনা করা যায়।',
    links: [
      { label: 'বাংলাদেশ বনাম চীন ব্যাচেলর তুলনা (English)', href: '/bangladesh-vs-china-bachelor-study' },
      { label: 'চীনে MBBS ও BMDC গাইড (বাংলা)', href: '/bn/mbbs-in-china-bangladesh' },
    ],
  },
  {
    title: 'ব্যাচেলর শেষে মাস্টার্স ও PhD',
    detail:
      'পূর্ণ মেধাভিত্তিক CSC Type A/B (চীন), GKS (দক্ষিণ কোরিয়া), Stipendium Hungaricum (হাঙ্গেরি) স্কলারশিপ অথবা UK ১-বছরের মাস্টার্স ও ফিনল্যান্ডের রিসার্চ ট্র্যাকে আবেদন করা যায়—তবে প্রতিটি স্কলারশিপই প্রতিযোগিতামূলক ও মেধানির্ভর।',
    links: [
      { label: 'CSC স্কলারশিপ সম্পূর্ণ গাইড (বাংলা)', href: '/bn/csc-scholarship-bangladesh' },
      { label: 'CSCA ভর্তি পরীক্ষার গাইড (বাংলা)', href: '/bn/csca-exam-bangladesh' },
    ],
  },
];

const parentRedFlagsBn = [
  'ভিসার কোনো শতভাগ নিশ্চয়তা নেই—বিশ্ববিদ্যালয় ও দূতাবাসই চূড়ান্ত সিদ্ধান্ত দেয়; অবাস্তব প্রতিশ্রুতি দেখলে সতর্ক হোন।',
  'মূল পাসপোর্ট বা SSC/HSC মূল সনদ কোনো এজেন্সির কাছে জামানত হিসেবে জমা দেবেন না।',
  'ফাইল ওপেনিংয়ের আগেই প্রতিটি থার্ড-পার্টি ফি (আবেদন ফি, EMGS, মেডিকেল, নোটারি, বিমা) কার কাছে যাবে তা লিখিতভাবে নিন।',
  'MBBS-এ ভর্তির আগে বিশ্ববিদ্যালয়টি চীনের MoE ইংরেজি-মাধ্যম তালিকা, WDOMS এবং বাংলাদেশের BMDC RQE নীতিমালার উপযোগী কি না যাচাই করুন।',
];

const bnDestinationTierLabels: Record<string, string> = {
  Flagship: 'ফ্ল্যাগশিপ গন্তব্য',
  'Wave 1 Active': 'সক্রিয় অগ্রাধিকার (Wave 1)',
  'Wave 2 Active': 'সক্রিয় গন্তব্য (Wave 2)',
  'Wave 3 Active': 'সক্রিয় গন্তব্য (Wave 3)',
};

const faqsBn = [
  {
    question: 'বাংলাদেশ ব্যাংক স্টুডেন্ট ফাইল (Student File) ছাড়া কোন দেশে পড়াশোনা করা যায়?',
    answer:
      'চীনে পূর্ণ CSC স্কলারশিপে টিউশন ও হোস্টেল ফ্রি থাকায় এবং অনেক আংশিক/স্ব-অর্থায়িত চীনা বিশ্ববিদ্যালয়ে ক্যাম্পাসে পৌঁছানোর পর রেজিস্ট্রেশন সপ্তাহে ফি পরিশোধের সুযোগ থাকায় সাধারণত বাংলাদেশ ব্যাংক স্টুডেন্ট ফাইল খোলার জটিলতা লাগে না—পাসপোর্ট এনডোর্সমেন্ট ও ডুয়াল-কারেন্সি কার্ডেই কাজ চলে। অন্যদিকে মালয়েশিয়া, UK, ফিনল্যান্ড বা অগ্রিম টিউশন ওয়্যার প্রয়োজন এমন দেশে AD ব্যাংকের মাধ্যমে স্টুডেন্ট ফাইল খুলতে হয়।',
  },
  {
    question: 'SSC, দাখিল বা O-Level পাস করে কি সরাসরি বিদেশে ব্যাচেলর রুট শুরু করা যায়?',
    answer:
      'হ্যাঁ। মালয়েশিয়ায় O-Level-এ ৫টি ক্রেডিট থাকলে ১ বছরের ফাউন্ডেশন + ৩ বছরের ব্যাচেলর (মোট ৪ বছর) এবং চীনে SSC, দাখিল বা O-Level পাসের পর ৩ বছরের ডিপ্লোমা + ২ বছরের টপ-আপ ব্যাচেলর (মোট ৫ বছর) করা যায়। তবে চীনে ১৮ বছরের কম শিক্ষার্থীদের জন্য MoE Order No. 42 অনুযায়ী লিগ্যাল গার্ডিয়ান নিয়ম প্রযোজ্য।',
  },
  {
    question: 'এডুএক্সপ্রেসের সার্ভিস ফি কীভাবে কাজ করে?',
    answer:
      'প্রাথমিক প্রোফাইল অ্যাসেসমেন্ট সম্পূর্ণ ফ্রি। চীন প্যাকেজে কোনো ফাইল ওপেনিং চার্জ নেই এবং চায়না ভিসা অনুমোদনের আগে এডুএক্সপ্রেসের কোনো সার্ভিস ফি নেওয়া হয় না। মালয়েশিয়া বিশ্ববিদ্যালয় আবেদন ও EMGS গাইডেন্সেও এডুএক্সপ্রেস সার্ভিস ফি ০ টাকা। বিশ্ববিদ্যালয়, দূতাবাস, EMGS বা মেডিকেল ফি শিক্ষার্থী সরাসরি সংশ্লিষ্ট প্রতিষ্ঠানে পরিশোধ করেন।',
  },
  {
    question: 'অন্যান্য শিক্ষা এজেন্সি কি এডুএক্সপ্রেসের সাথে B2B পার্টনার হিসেবে কাজ করতে পারে?',
    answer:
      'হ্যাঁ। বাংলাদেশের আঞ্চলিক এজেন্সি ও সাব-এজেন্টরা /b2b এবং /partnership পেজের মাধ্যমে লিখিত নন-পোচিং সুরক্ষা, ২৪–৪৮ ঘণ্টায় ফাইল অডিট এবং দ্বিপাক্ষিক MOU চুক্তির আওতায় চীন, মালয়েশিয়া ও অন্যান্য সক্রিয় গন্তব্যে ফাইল প্রসেসিং সহায়তা নিতে পারেন।',
  },
];

export default async function BengaliBangladeshStudyAbroadMarketPage() {
  const now = new Date();
  const [universities, stories] = await Promise.all([
    getUniversityRecords(),
    getPublishedStories().catch(() => []),
  ]);
  const snapshot = buildBangladeshMarketBenchmark(universities, stories.length, now);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebPage', 'Article'],
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        name: 'বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষা ২০২৭: সম্পূর্ণ মার্কেট ও খরচ গাইড',
        headline: 'বিদেশে উচ্চশিক্ষা ২০২৭: বাংলাদেশ মার্কেট গাইড | EduExpress International',
        description:
          'বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষার সম্পূর্ণ গাইড: ১২টি দেশের আলাদা টিউশন ও থাকা-খাওয়ার হিসাব, স্টুডেন্ট ফাইল নিয়ম, SSC/HSC ও O/A-Level রুট।',
        image: `${SITE}/og/parents.jpg`,
        primaryImageOfPage: primaryImageOfPageSchema('/og/parents.jpg'),
        inLanguage: 'bn-BD',
        datePublished: `${BANGLADESH_MARKET_LAST_VERIFIED_ISO}T00:00:00Z`,
        dateModified: `${BANGLADESH_MARKET_LAST_VERIFIED_ISO}T00:00:00Z`,
        author: { '@type': 'Person', name: 'মুক্তা রহমান', jobTitle: 'Senior Counselor' },
        reviewedBy: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        isPartOf: { '@id': `${SITE}/#website` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(BANGLADESH_MARKET_SOURCES),
      },
    ],
  };

  return (
    <div lang="bn" className="text-petrol-800">
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbJsonLd(trail, PATH)} />

      {/* Hero */}
      <section className="bg-canvas-soft pb-14 pt-[96px] sm:pt-[112px] lg:pb-20 lg:pt-[140px]">
        <div className={`${kit.wrap} grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-14`}>
          <div>
            <nav aria-label="ব্রেডক্রাম্ব" className="anim-rise">
              <ol className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold text-ink-soft">
                <li>
                  <Link href="/" className="hover:text-petrol-800 hover:underline">
                    হোম
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight size={14} className="text-ink-mute" aria-hidden="true" />
                  <span aria-current="page" className="text-petrol-800">
                    {trail[0].name}
                  </span>
                </li>
              </ol>
            </nav>
            <p className={`anim-rise mt-6 ${kit.badge}`}>
              <Globe2 size={15} aria-hidden="true" /> বাংলাদেশ স্টাডি অ্যাব্রোড মার্কেট গাইড ২০২৭
            </p>
            <h1 className="anim-lift mt-5 font-display text-[36px] font-bold leading-[1.08] text-petrol-800 sm:text-[48px] lg:text-[54px]">
              বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষা ২০২৭: দেশ, খরচ ও স্টুডেন্ট ফাইল গাইড
            </h1>
            <p className={`anim-rise mt-6 max-w-2xl ${kit.lead}`}>
              এডুএক্সপ্রেসের {snapshot.liveCatalog.activeUniversities}টি সক্রিয় বিশ্ববিদ্যালয় ও {snapshot.activeDestinationCount}টি গন্তব্যের যাচাইকৃত ডেটা থেকে শিক্ষার্থী ও অভিভাবকদের জন্য টিউশন, থাকা-খাওয়া, বাংলাদেশ ব্যাংক স্টুডেন্ট ফাইল ও সঠিক রুটের পূর্ণাঙ্গ নির্দেশনা।
            </p>
            <div className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#bn-market-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                ফ্রি প্রোফাইল অ্যাসেসমেন্ট নিন <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link href={EN_PATH} hrefLang="en" className="ed-btn ed-btn-outline min-h-[52px] px-7">
                <span lang="en">Read Full English Report &amp; JSON Data</span>
              </Link>
            </div>
          </div>

          <figure className="anim-rise relative overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/home/parent-counselling.webp"
                alt="ঢাকার ধানমন্ডি অফিসে শিক্ষার্থী ও অভিভাবককে বিদেশে উচ্চশিক্ষার লিখিত খরচ বুঝিয়ে দিচ্ছেন এডুএক্সপ্রেস কাউন্সেলর"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="p-4 text-[14px] font-semibold text-petrol-800">
              সক্রিয় ক্যাটালগ: {snapshot.liveCatalog.activeUniversities}টি বিশ্ববিদ্যালয় · {snapshot.liveCatalog.programsCount}টি প্রোগ্রাম · {snapshot.liveCatalog.scholarshipsCount}টি স্কলারশিপ রেকর্ড
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Bangla Trust Bar */}
      <section aria-label="কেন পরিবারগুলো এডুএক্সপ্রেসের ওপর আস্থা রাখে" className="border-b border-canvas-soft bg-white py-8">
        <ul data-anim="stagger" className={`${kit.wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
          {trustItemsBn.map((item) => (
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

      {/* Macro Market Trends in Bangla */}
      <Section
        title="২০২৬–২০২৭ সালে বাংলাদেশের বিদেশে পড়াশোনার বাজারে বড় ৩টি পরিবর্তন"
        intro="মুদ্রাস্ফীতি, টাকার বিনিময় হার এবং পশ্চিমা ভিসা নীতির পরিবর্তনের কারণে অভিভাবকেরা এখন গন্তব্য বাছাইয়ে বেশি হিসাবি হচ্ছেন।"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {macroDriversBn.map((item) => (
            <div key={item.title} className={kit.cardSage}>
              <span className={kit.badge}>
                <BarChart3 size={14} aria-hidden="true" /> {item.badge}
              </span>
              <h3 className={`mt-4 ${kit.h3}`}>{item.title}</h3>
              <p className={`mt-2 ${kit.body}`}>{item.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 12 Destinations Table in Bangla */}
      <Section
        tone="sage"
        title="১২টি সক্রিয় গন্তব্য: টিউশন, থাকা-খাওয়া ও স্টুডেন্ট ফাইল তুলনা"
        intro="প্রতিটি দেশের টিউশন ফি ও মাসিক থাকা-খাওয়ার খরচ আলাদা কলামে দেখানো হয়েছে, যাতে পরিবার বাস্তব বাজেট বুঝতে পারেন।"
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
          <table className="w-full min-w-[880px] text-left text-[14px] leading-6">
            <caption className="sr-only">১২টি দেশে উচ্চশিক্ষার টিউশন, থাকা-খাওয়া ও স্টুডেন্ট ফাইল তথ্য</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">দেশ ও সার্ভিস স্তর</th>
                <th scope="col" className="p-4 font-bold">মূল ইনটেক</th>
                <th scope="col" className="p-4 font-bold">সম্ভাব্য টিউশন ফি (থাকা-খাওয়া ছাড়া)</th>
                <th scope="col" className="p-4 font-bold">থাকা-খাওয়া (আলাদা হিসাব)</th>
                <th scope="col" className="p-4 font-bold">স্টুডেন্ট ফাইল ও এডুএক্সপ্রেস ফি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {snapshot.destinations.map((dest) => (
                <tr key={dest.slug} className={dest.slug === 'china' || dest.slug === 'malaysia' ? 'bg-lime-pale/25' : undefined}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                    <Link href={dest.href} hrefLang="en" className="underline decoration-petrol-800/30 underline-offset-4 hover:text-lime-deep">
                      {dest.name}
                    </Link>
                    <span className="mt-1 block text-[12px] font-semibold text-emerald-900">
                      {bnDestinationTierLabels[dest.tier] ?? dest.tier}
                    </span>
                  </th>
                  <td className="p-4 align-top font-medium text-petrol-800">{dest.intakes}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{dest.indicativeTuition}</td>
                  <td className="p-4 align-top text-amber-900">{dest.indicativeLiving}</td>
                  <td className="p-4 align-top">
                    <span className="block font-semibold text-petrol-800">{dest.studentFileRule}</span>
                    <span className="mt-1 block text-[13px]">{dest.eduExpressFeeModel}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Academic Pathways in Bangla */}
      <Section title="শিক্ষাগত যোগ্যতা অনুযায়ী সঠিক বিদেশি রুট নির্বাচন">
        <div className="grid gap-6 lg:grid-cols-3">
          {entryPathwaysBn.map((track) => (
            <div key={track.title} className="flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm sm:p-7">
              <div>
                <h3 className={kit.h3}>{track.title}</h3>
                <p className={`mt-3 ${kit.body}`}>{track.detail}</p>
              </div>
              <div className="mt-5 flex flex-col gap-2 border-t border-canvas-soft pt-4">
                {track.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    hrefLang={item.href.startsWith('/bn/') ? 'bn' : 'en'}
                    className={kit.link}
                  >
                    {item.label} <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Student File vs China + Parent Red Flags */}
      <Section tone="navy" title="বাংলাদেশ ব্যাংক স্টুডেন্ট ফাইল বনাম চায়না পেমেন্ট সুবিধা">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/20 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-[20px] font-semibold text-lime">
              <ShieldCheck size={20} aria-hidden="true" /> চীন বনাম অন্যান্য দেশে টিউশন পাঠানোর নিয়ম
            </h3>
            <ul className="mt-4 space-y-3 text-[16px] leading-7 text-white/85">
              <li>
                <strong className="text-white">মালয়েশিয়া, UK, ফিনল্যান্ড ও ইউরোপ:</strong> অগ্রিম টিউশন ফি বা লিভিং ফান্ড পাঠাতে বাংলাদেশ ব্যাংকের GFET নীতিমালা অনুযায়ী একটি AD বাণিজ্যিক ব্যাংক শাখায় স্টুডেন্ট ফাইল (Student File) খুলতে হয় (ব্যাংকভেদে খোলা ও নবায়ন ফি সাধারণত ৫,০০০–৬,০০০ টাকা + ভ্যাট)।
              </li>
              <li>
                <strong className="text-white">চীনে পূর্ণ CSC ও অন-ক্যাম্পাস রুট:</strong> পূর্ণ স্কলারশিপে টিউশন-ডরমিটরি ফ্রি থাকায় এবং অধিকাংশ বিশ্ববিদ্যালয়ে ক্যাম্পাসে গিয়ে রেজিস্ট্রেশন সপ্তাহে ফি জমা দেওয়ার সুযোগ থাকায় স্টুডেন্ট ফাইল ছাড়াই পাসপোর্ট এনডোর্সমেন্ট ও ডুয়াল-কারেন্সি কার্ডে প্রক্রিয়া সম্পন্ন হয়।
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/5 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-[20px] font-semibold text-lime">
              <ShieldAlert size={20} aria-hidden="true" /> অভিভাবকদের জন্য ৪টি জরুরি সতর্কতা
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15.5px] leading-7 text-white/85">
              {parentRedFlagsBn.map((flag) => (
                <li key={flag} className="flex items-start gap-2.5">
                  <CheckCircle2 size={17} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/b2b" hrefLang="en" className="ed-btn ed-btn-signal min-h-[46px] px-5">
                <Briefcase size={16} aria-hidden="true" /> B2B এজেন্সি ডেস্ক (English)
              </Link>
              <Link href="/fees-and-transparency" hrefLang="en" className="ed-btn ed-btn-on-dark min-h-[46px] px-5">
                লিখিত ফি নীতিমালা
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Sources & Verification Stamp */}
      <Section tone="sage" title="তথ্যের উৎস ও যাচাই রেকর্ড">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[15px] leading-7 text-ink-soft">
            <strong className="text-petrol-800">প্রস্তুতকারী:</strong> মুক্তা রহমান (Senior Counselor) ·{' '}
            <strong className="text-petrol-800">পর্যালোচনা:</strong> আব্দুল্লাহ আল রাকিব (Founder &amp; CEO) ·{' '}
            <strong className="text-petrol-800">সর্বশেষ যাচাই:</strong> ২১ নভেম্বর ২০২৬ ·{' '}
            <strong className="text-petrol-800">পরবর্তী রিভিউ:</strong> ২১ ফেব্রুয়ারি ২০২৭
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-[14px]">
            {BANGLADESH_MARKET_SOURCES.slice(0, 6).map((src) => {
              const safeHref = toSafeExternalUrl(src.href);
              return safeHref ? (
                <a
                  key={src.href}
                  href={safeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-canvas-soft px-4 py-2 font-semibold text-petrol-800 hover:bg-lime-pale"
                >
                  {src.label} <ExternalLink size={13} aria-hidden="true" />
                </a>
              ) : null;
            })}
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-petrol-800 p-6 text-white sm:p-7">
          <h3 className="flex items-center gap-2 text-[20px] font-semibold text-lime">
            <ShieldAlert size={20} aria-hidden="true" /> মিডিয়া, গবেষক ও শিক্ষা পোর্টালের জন্য ওপেন ডেটাসেট ও সাইটেশন (CC BY 4.0)
          </h3>
          <blockquote className="mt-4 rounded-2xl border border-white/15 bg-black/20 p-4 text-[14px] leading-6 text-white/90">
            EduExpress International ({now.getUTCFullYear()}). <em>বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষা মার্কেট রিপোর্ট ২০২৭ (Bangladesh Study Abroad Market 2027 Report)</em>. Retrieved from {canonical}
          </blockquote>
          <ReportCitationActions
            citationText={`EduExpress International (${now.getUTCFullYear()}). বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষা মার্কেট রিপোর্ট ২০২৭ (Bangladesh Study Abroad Market 2027 Report). Retrieved from ${canonical}`}
            reportUrl={canonical}
            reportTitle="বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষা মার্কেট রিপোর্ট ২০২৭ — EduExpress International"
            datasetUrl={`${SITE}/bangladesh-study-abroad-market.json`}
            downloadPath="/bangladesh-study-abroad-market.json"
            downloadFilename="eduexpress-bangladesh-study-abroad-market.json"
            analyticsDestination="bangladesh_market_bn"
            analyticsLabel="bangladesh_market_report_json_bn"
          />
        </div>
      </Section>

      {/* FAQs in Bangla */}
      <div id="bn-market-faq" className="scroll-mt-24">
        <FaqBlock items={faqsBn} title="বিদেশে উচ্চশিক্ষা ও বাংলাদেশ মার্কেট: সাধারণ প্রশ্নোত্তর" tone="white" />
      </div>

      {/* Related Guides Grid */}
      <BnChinaRelatedGuides
        currentPath={PATH}
        englishTwin={{ label: 'Bangladesh Study Abroad Market 2027 (English Report)', href: EN_PATH }}
        ariaLabel="সম্পর্কিত বাংলা ও ইংরেজি গাইড"
      />

      {/* Embedded Assessment */}
      <Section
        id="bn-market-assessment"
        title="আপনার বাজেট ও রেজাল্ট অনুযায়ী ফ্রি প্রোফাইল যাচাই করুন"
        intro="SSC, HSC, O/A-Level বা ব্যাচেলর ফলাফল ও বাজেট জানান—এক কার্যদিবসের মধ্যে উপযুক্ত দেশ ও লিখিত খরচের তালিকা পান।"
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-petrol-800/10 bg-canvas-soft p-6 shadow-sm sm:p-10">
          <EducationFitAssessment initialContext={{ language: 'bn' }} />
        </div>
      </Section>

      <CtaBand
        title="সঠিক তথ্যে বিদেশে উচ্চশিক্ষার সিদ্ধান্ত নিন"
        text="ধানমন্ডি অফিসে আসুন অথবা অনলাইনে ফ্রি অ্যাসেসমেন্ট নিন—কোনো অপ্রকাশিত চার্জ বা ভুয়া প্রতিশ্রুতি ছাড়াই।"
        assessmentHref="#bn-market-assessment"
      />
    </div>
  );
}
