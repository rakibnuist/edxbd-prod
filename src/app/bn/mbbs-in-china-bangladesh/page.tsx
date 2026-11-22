import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Globe2,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Wallet,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import CscaMasterProOfferCard from '@/components/china/CscaMasterProOfferCard';
import BnChinaRelatedGuides from '@/components/page/BnChinaRelatedGuides';
import { CtaBand, FaqBlock, JsonLd, Section, kit } from '@/components/page/PageKit';
import { getChinaMbbsGuide } from '@/lib/china-mbbs-guide';
import { config } from '@/lib/config';
import { breadcrumbJsonLd, citationJsonLd, primaryImageOfPageSchema, type Crumb } from '@/lib/json-ld';
import { toSafeExternalUrl } from '@/lib/safe-url';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bn/mbbs-in-china-bangladesh';
const EN_PATH = '/mbbs-in-china-bangladesh';

const trail: Crumb[] = [
  { name: 'চীনে উচ্চশিক্ষা', path: '/bn/study-in-china' },
  { name: 'চীনে MBBS ভর্তি ও BMDC গাইড' },
];

const visaFirstTermsBn =
  'কোনো ফাইল ওপেনিং চার্জ নেই। চায়না ভিসা অনুমোদনের আগে এডুএক্সপ্রেসের কোনো সার্ভিস ফি নেই। এর আগে বিশ্ববিদ্যালয়, এম্বাসি, মেডিকেল, অনুবাদ, কুরিয়ার, ডিপোজিট বা অন্য কোনো থার্ড-পার্টি ফি প্রয়োজন হলে শিক্ষার্থী এগোনোর আগেই তা লিখিতভাবে তালিকাভুক্ত করা হয়।';

export async function generateMetadata() {
  const guide = await getChinaMbbsGuide();
  const minTuition = Math.min(...guide.universities.map(u => u.tuition));
  return pageMetadata({
    title: 'বাংলাদেশি শিক্ষার্থীদের জন্য চীনে MBBS ২০২৭: খরচ ও BMDC নিয়ম',
    description: `চীনে ইংরেজি মাধ্যমে ৬ বছরের MBBS (টিউশন CNY ${minTuition.toLocaleString('en-US')} থেকে), MoE অনুমোদন, CSCA, আবাসন খরচ ও বাংলাদেশে BMDC RQE নিবন্ধন প্রক্রিয়া।`,
    path: PATH,
    image: ogImage('china-guide', 'Chinese medical university campus for Bangladeshi MBBS students'),
    type: 'article',
    locale: 'bn_BD',
    languages: {
      'en-BD': EN_PATH,
      'bn-BD': PATH,
      'x-default': EN_PATH,
    },
  });
}

const bmdcStepsBn = [
  {
    step: 'ধাপ ১ · সঠিক বিশ্ববিদ্যালয় নির্বাচন',
    title: 'চীনের MoE অনুমোদিত ইংরেজি-মাধ্যম MBBS নিশ্চিত করুন',
    body: 'বিশ্ববিদ্যালয়টি চীনের শিক্ষা মন্ত্রণালয় (MoE) কর্তৃক বিদেশি শিক্ষার্থীদের জন্য ইংরেজি মাধ্যমে Clinical Medicine (MBBS) পরিচালনার অনুমোদিত কি না যাচাই করুন। শুধুমাত্র WDOMS-এ তালিকা থাকা মানেই স্বয়ংক্রিয় BMDC অনুমোদন নয়।',
  },
  {
    step: 'ধাপ ২ · ৬ বছরের ডিগ্রি ও ক্লিনিক্যাল ট্রেনিং',
    title: 'একাডেমিক, ক্লিনিক্যাল ও HSK শর্ত পূরণ',
    body: 'নির্ধারিত সিলেবাস, প্রযোজ্য HSK লেভেল (রোগী ও হাসপাতালের টিমের সাথে কথা বলার জন্য অনেক বিশ্ববিদ্যালয়ে HSK 4 লাগে) এবং ১ বছরের ক্লিনিক্যাল ইন্টার্নশিপ সম্পন্ন করুন। ভিসা ও অধ্যয়নের সব আসল কাগজপত্র সংরক্ষণ করুন।',
  },
  {
    step: 'ধাপ ৩ · দেশে ফিরে BMDC RQE সম্পন্ন',
    title: 'BMDC Registration Qualifying Examination',
    body: 'দেশে ফিরে বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল (BMDC)-এর নির্ধারিত ডকুমেন্ট যাচাই, RQE (Registration Qualifying Examination), প্রযোজ্য ইন্টার্নশিপ এবং নিবন্ধন ধাপ সম্পন্ন করে প্র্যাকটিসের অনুমোদন নিন।',
  },
];

const bnFaqs = [
  {
    question: 'চীনে MBBS পড়তে বছরে টিউশন ফি কত হতে পারে?',
    answer:
      'এই গাইডে থাকা ৬টি যাচাইকৃত বিশ্ববিদ্যালয়ে বার্ষিক টিউশন ফি সাধারণত CNY ৩০,০০০ থেকে CNY ৭৫,০০০ পর্যন্ত। ডরমিটরি, স্বাস্থ্য বীমা, মেডিকেল চেক, থাকা-খাওয়া ও সার্ভিস চার্জ আলাদাভাবে হিসাব করতে হবে এবং প্রতিটি পেমেন্ট ইউয়ান (CNY) ও টাকা (BDT) হিসেবে পৃথক রাখতে হবে।',
  },
  {
    question: 'চীনে MBBS পাস করে বাংলাদেশে ডাক্তারি প্র্যাকটিস করা যায় কি?',
    answer:
      'হ্যাঁ, তবে শর্ত হলো আপনাকে চীনের শিক্ষা মন্ত্রণালয় (MoE) কর্তৃক ইংরেজি মাধ্যমে অনুমোদিত মেডিকেল প্রোগ্রামে পড়াশোনা করতে হবে, ডিগ্রি ও ক্লিনিক্যাল ট্রেনিং শেষ করতে হবে এবং বাংলাদেশে ফিরে BMDC Registration Qualifying Examination (RQE), প্রযোজ্য ইন্টার্নশিপ ও রেজিস্ট্রেশন প্রক্রিয়া উত্তীর্ণ হতে হবে।',
  },
  {
    question: 'WDOMS-এ নাম থাকলেই কি বিশ্ববিদ্যালয় BMDC অনুমোদিত ধরা হয়?',
    answer:
      'না। WDOMS মেডিকেল স্কুলগুলো শনাক্ত করে মাত্র; এটি আলাদা কোনো অনুমোদন বা অ্যাক্রিডিটেশন নয়। ইংরেজি মাধ্যমে MBBS-এর জন্য চীনের MoE-এর প্রোগ্রাম-ভিত্তিক অনুমোদন এবং বাংলাদেশে BMDC-এর প্রযোজ্য নিয়ম যাচাই করা বাধ্যতামূলক।',
  },
  {
    question: 'চীনে MBBS-এর জন্য কি CSCA পরীক্ষা বা IELTS লাগে?',
    answer:
      'অধিকাংশ বিশ্ববিদ্যালয়ে HSC বিজ্ঞান বিভাগের (জীববিজ্ঞান, রসায়ন, পদার্থবিজ্ঞান) ফলাফলের পাশাপাশি CSCA (যেমন গণিত, রসায়ন বা পদার্থবিজ্ঞান — বিশ্ববিদ্যালয়ভেদে ভিন্ন) এবং ইংরেজি দক্ষতার প্রমাণ (IELTS/TOEFL/Duolingo বা ইংরেজি-মাধ্যম সনদ/সাক্ষাৎকার) চাওয়া হয়।',
  },
  {
    question: 'ইংরেজি মাধ্যমে MBBS পড়লেও কি চাইনিজ ভাষা (HSK) শিখতে হয়?',
    answer:
      'হ্যাঁ। হাসপাতালে ক্লিনিক্যাল রোটেশন ও রোগীদের সাথে কথা বলার জন্য বেশিরভাগ বিশ্ববিদ্যালয় চাইনিজ ভাষা শেখায় এবং স্নাতক সম্পন্ন করার আগে নির্দিষ্ট HSK লেভেল (যেমন জিয়াংসু বিশ্ববিদ্যালয়ে HSK 4-এ ন্যূনতম ১৮০ নম্বর) বাধ্যতামূলক করে।',
  },
  {
    question: 'ভিসার আগে এডুএক্সপ্রেসে কোনো সার্ভিস ফি দিতে হয় কি?',
    answer: visaFirstTermsBn,
  },
];

export default async function BengaliMbbsInChinaPage() {
  const guide = await getChinaMbbsGuide();
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম। চীনে MBBS ভর্তি ও BMDC নিয়মাবলী সম্পর্কে জানতে চাই।')}`;
  const url = `${SITE}${PATH}`;

  const bmdcSource = toSafeExternalUrl('https://www.bmdc.org.bd/');
  const moeSource = toSafeExternalUrl('https://en.moe.gov.cn/documents/laws_policies/201506/t20150626_191405.html');

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebPage', 'Article'],
        '@id': `${url}#page`,
        url,
        headline: 'বাংলাদেশি শিক্ষার্থীদের জন্য চীনে MBBS ২০২৭: MoE স্বীকৃতি, খরচ ও BMDC প্রক্রিয়া',
        name: 'বাংলাদেশ থেকে চীনে MBBS ভর্তি গাইড',
        description:
          'বাংলাদেশি শিক্ষার্থীদের জন্য চীনে ইংরেজি মাধ্যমে MBBS, BMDC নিবন্ধনের শর্ত, CSCA ও বিশ্ববিদ্যালয়ভিত্তিক খরচের হিসাব।',
        inLanguage: 'bn-BD',
        mainEntityOfPage: url,
        image: `${SITE}/og/china-guide.jpg`,
        primaryImageOfPage: primaryImageOfPageSchema('/og/china-guide.jpg'),
        datePublished: guide.research?.checkedAt ? `${guide.research.checkedAt}T00:00:00Z` : '2026-11-15T00:00:00Z',
        dateModified: guide.research?.checkedAt ? `${guide.research.checkedAt}T00:00:00Z` : '2026-11-15T00:00:00Z',
        author: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        isPartOf: { '@id': `${SITE}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        ...citationJsonLd([
          { label: 'Ministry of Education of China: English-medium undergraduate medical education', href: 'https://en.moe.gov.cn/documents/laws_policies/201506/t20150626_191405.html' },
          { label: 'Bangladesh Medical & Dental Council (BMDC)', href: 'https://www.bmdc.org.bd/' },
        ]),
      },
      {
        '@type': 'ItemList',
        name: 'চীনে ইংরেজি মাধ্যম MBBS বিশ্ববিদ্যালয়ের যাচাইকৃত উদাহরণ',
        numberOfItems: guide.universities.length,
        itemListElement: guide.universities.map((university, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CollegeOrUniversity',
            name: university.name,
            address: { '@type': 'PostalAddress', addressLocality: university.city, addressCountry: 'CN' },
            url: `${SITE}/universities/${university.profileSlug}`,
          },
        })),
      },
    ],
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
                  <span aria-current="page" className="text-petrol-800">চীনে MBBS গাইড</span>
                </li>
              </ol>
            </nav>
            <p className={`anim-rise mt-6 ${kit.badge}`}><Stethoscope size={15} aria-hidden="true" /> MoE ও BMDC-সচেতন মেডিকেল গাইড ২০২৭</p>
            <h1 className="anim-lift mt-5 font-display text-[26px] xs:text-[30px] font-bold leading-[1.25] text-petrol-800 sm:text-[44px] lg:text-[54px] sm:leading-[1.18]">
              বাংলাদেশ থেকে চীনে MBBS: স্বীকৃতি, খরচ ও BMDC নিয়ম
            </h1>
            <p className={`anim-rise mt-6 max-w-2xl ${kit.lead}`}>
              টিউশন ফির আগে স্বীকৃতি যাচাই করুন। চীনের MoE কর্তৃক ইংরেজি মাধ্যমে অনুমোদিত ৬ বছরের মেডিকেল প্রোগ্রাম, CSCA বিষয় এবং বাংলাদেশে ফিরে BMDC নিবন্ধনের পূর্ণাঙ্গ রূপরেখা।
            </p>
            <div className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#bn-mbbs-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                মেডিকেল যোগ্যতা যাচাই করুন <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link href={EN_PATH} hrefLang="en-BD" className="ed-btn ed-btn-outline min-h-[52px] px-7">
                <Globe2 size={17} aria-hidden="true" /> <span lang="en">Read in English</span>
              </Link>
            </div>
          </div>
          <figure className="anim-rise relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/real/counseling/counseling_global_ambitions.webp"
                alt="এডুএক্সপ্রেসে চীনে মেডিকেল উচ্চশিক্ষার পরামর্শ"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
              সঠিক স্বীকৃতি দেখে সিদ্ধান্ত নিন
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-label="মেডিকেল ভর্তির মূল নীতি" className="border-b border-canvas-soft bg-white py-8">
        <ul data-anim="stagger" className={`${kit.wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
          {[
            { icon: ShieldAlert, title: 'স্বীকৃতি আগে', text: 'MoE অনুমোদিত ইংরেজি MBBS ও BMDC RQE রুট যাচাই বাধ্যতামূলক' },
            { icon: BookOpen, title: '৬ বছরের কাঠামো', text: 'মূল মেডিকেল অধ্যয়ন এবং ক্লিনিক্যাল ইন্টার্নশিপসহ ৬ বছর' },
            { icon: Wallet, title: 'ভিসার আগে ০ ফি', text: 'চায়না ভিসা অনুমোদনের আগে এডুএক্সপ্রেসের সার্ভিস ফি নেই' },
            { icon: BadgeCheck, title: 'যাচাইকৃত খরচের তথ্য', text: 'প্রতিটি বিশ্ববিদ্যালয়ের নিজস্ব বিজ্ঞপ্তি থেকে সংগৃহীত ইউয়ান (CNY) ফি' },
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
        title="৬টি যাচাইকৃত চীনা মেডিকেল বিশ্ববিদ্যালয়ের খরচের তুলনা"
        intro="নিচের প্রতিটি উদাহরণ সংশ্লিষ্ট বিশ্ববিদ্যালয়ের প্রকাশিত গাইড থেকে নেওয়া হয়েছে। বিস্তারিত শর্ত, ডরমিটরি ও CSCA তথ্য দেখতে প্রোফাইলে প্রবেশ করুন।"
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {guide.universities.map(uni => (
            <article key={uni.id} className={kit.cardOutline}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-ink-soft">{uni.city} · {uni.duration}</p>
                  <h3 className={`mt-1 ${kit.h3}`}>{uni.name}</h3>
                </div>
                <span className="shrink-0 rounded-full bg-lime-pale px-3 py-1 text-[13px] font-semibold text-lime-deep">
                  {uni.acronym}
                </span>
              </div>
              <p className="mt-4 font-display text-[28px] font-black text-petrol-800">
                CNY {uni.tuition.toLocaleString('en-US')}
                <span className="ml-1.5 font-sans text-[14px] font-normal text-ink-soft">/ বছর টিউশন</span>
              </p>
              <dl className="mt-4 space-y-2 border-t border-canvas-soft pt-4 text-[14px] leading-6 text-ink-soft">
                <div>
                  <dt className="inline font-semibold text-petrol-800">আবাসন: </dt>
                  <dd className="inline">{uni.housing}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-petrol-800">CSCA: </dt>
                  <dd className="inline">{uni.csca}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-petrol-800">বিশেষ নোট: </dt>
                  <dd className="inline">{uni.highlight}</dd>
                </div>
              </dl>
              <Link href={`/universities/${uni.profileSlug}`} className={`mt-5 ${kit.link}`}>
                বিস্তারিত প্রোফাইল ও ফি শিট <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="bn-bmdc"
        tone="navy"
        title="বাংলাদেশে ফিরে মেডিকেল প্র্যাকটিসের রাস্তা (BMDC পথ)"
        intro="ভর্তির সিদ্ধান্ত নেওয়ার আগে থেকেই ডিগ্রি ও প্রফেশনাল রেজিস্ট্রেশনের প্রতিটি ধাপ পরিষ্কার রাখুন।"
      >
        <ol data-anim="stagger" className="grid gap-4 md:grid-cols-3">
          {bmdcStepsBn.map(item => (
            <li key={item.step} className="rounded-3xl border border-white/20 p-6 sm:p-7">
              <span className="text-[14px] font-semibold text-lime">{item.step}</span>
              <h3 className="mt-2 text-[20px] font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-[16px] leading-7 text-white/80">{item.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-5 border-t border-white/20 pt-5 text-[15px] text-white/80">
          {bmdcSource && (
            <a href={bmdcSource} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-lime underline underline-offset-4">
              BMDC অফিশিয়াল ওয়েবসাইট <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
          {moeSource && (
            <a href={moeSource} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-lime underline underline-offset-4">
              চীনের MoE ইংরেজি MBBS বিধিমালা <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </Section>

      <Section tone="sage" title="ভিসা-ফার্স্ট পেমেন্ট শর্ত ও ভর্তি সহায়তা">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div className={kit.card}>
            <span className={kit.iconLime}><GraduationCap size={22} aria-hidden="true" /></span>
            <h3 className={`mt-4 ${kit.h3}`}>অভিভাবকসহ স্বচ্ছ পরামর্শ</h3>
            <p className={`mt-2 ${kit.body}`}>
              আপনার SSC ও HSC বিজ্ঞান বিভাগের নম্বর, বাজেট ও পছন্দের শহর আমাদের জানান। আমরা আপনার জন্য উপযুক্ত মেডিকেল বিশ্ববিদ্যালয়ের শর্টলিস্ট ও সম্পূর্ণ লিখিত খরচ বিবরণী দেব।
            </p>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-signal mt-6 min-h-[50px] px-6">
              WhatsApp-এ পরামর্শ নিন <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className={kit.cardDark}>
            <p className="flex items-center gap-2 text-[19px] font-semibold text-lime">
              <ShieldCheck size={20} aria-hidden="true" /> ভিসা-ফার্স্ট পেমেন্ট নিয়ম
            </p>
            <p className="mt-3 text-[16px] leading-7 text-white/85">{visaFirstTermsBn}</p>
            <Link href="/china-visa-first-policy" hrefLang="en" className="ed-btn ed-btn-on-dark mt-5 min-h-[48px] px-5">
              সম্পূর্ণ পলিসি <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="mt-8">
          <CscaMasterProOfferCard lang="bn" assessmentHref="#bn-mbbs-assessment" compact />
        </div>
      </Section>

      <div id="bn-mbbs-faq" className="scroll-mt-28">
        <FaqBlock items={bnFaqs} title="চীনে MBBS সম্পর্কে সাধারণ প্রশ্নোত্তর" tone="white" />
      </div>

      <BnChinaRelatedGuides
        currentPath={PATH}
        englishTwin={{ label: 'MBBS in China Guide (English)', href: EN_PATH }}
        ariaLabel="সম্পর্কিত মেডিকেল ও চায়না গাইড"
      />

      <Section id="bn-mbbs-assessment" title="চীনে MBBS যোগ্যতা যাচাই ফরম" intro="SSC ও HSC ফলাফল এবং বাজেট জানান; আমরা ১ কার্যদিবসের মধ্যে আপনার উপযোগী মেডিকেল বিশ্ববিদ্যালয় ও লিখিত খরচ জানাব।">
        <EducationFitAssessment />
      </Section>

      <CtaBand
        title="নির্ভুল স্বীকৃতি ও লিখিত খরচ জেনে MBBS শুরু করুন"
        text="ফাইল ওপেনিং ফি শূন্য। অফার ও খরচ লিখিতভাবে যাচাই করে পরবর্তী ধাপ শুরু করুন।"
      />
    </div>
  );
}
