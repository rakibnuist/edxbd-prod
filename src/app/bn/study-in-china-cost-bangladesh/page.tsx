import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  HelpCircle,
  Landmark,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { JsonLd, Section, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bn/study-in-china-cost-bangladesh';
const EN_PATH = '/study-in-china-cost-bangladesh';
const trail = [
  { name: 'চীনে উচ্চশিক্ষা', href: '/bn/study-in-china' },
  { name: 'পড়াশোনার মোট খরচ ও ব্যাংক ফাইল' },
];

export const metadata = pageMetadata({
  title: 'চীনে পড়াশোনার খরচ ও বাংলাদেশ ব্যাংক স্টুডেন্ট ফাইল গাইড ২০২৭ | EduExpress',
  description:
    'চীনে ব্যাচেলর, মাস্টার্স ও এমবিবিএস পড়ার সম্পূর্ণ খরচ (টাকা ও আরএমবিতে হিসাব), স্কলারশিপ সুবিধা এবং বাংলাদেশ ব্যাংকের মাধ্যমে বৈধভাবে টিউশন ফি পাঠানোর নিয়মাবলী।',
  path: PATH,
  image: ogImage('china', 'Chinese university campus and cost planning guide'),
  locale: 'bn_BD',
  languages: {
    'en-BD': EN_PATH,
    'bn-BD': PATH,
    'x-default': EN_PATH,
  },
});

const costTiers = [
  {
    title: 'ফুল স্কলারশিপ (CSC / Type A)',
    tag: 'সর্বোচ্চ সাশ্রয়ী',
    highlight: 'টিউশন ও হোস্টেল সম্পূর্ণ ফ্রি',
    tuition: '০ টাকা (১০০% ওয়েভার)',
    hostel: '০ টাকা (ফ্রি ডরমিটরি)',
    stipend: 'মাসিক ২,৫০০ – ৩,৫00 আরএমবি (প্রায় ৪৬,০০০ – ৬৫,০০০ টাকা)',
    outOfPocket: 'ইনস্যুরেন্স (৮০০ আরএমবি/বছর), রেসিডেন্স পারমিট (৪০০ আরএমবি) ও বিমান ভাড়া',
  },
  {
    title: 'আংশিক স্কলারশিপ (প্রোভিন্সিয়াল / প্রেসিডেনশিয়াল)',
    tag: 'জনপ্রিয় বিকল্প',
    highlight: 'টিউশন ফি ৫০% – ১০০% পর্যন্ত ছাড়',
    tuition: '০ – ১৫,০০০ আরএমবি/বছর (প্রায় ০ – ২.৮০ লাখ টাকা)',
    hostel: '১,৫০০ – ৪,৫০০ আরএমবি/বছর (প্রায় ২৮,০০০ – ৮৪,০০০ টাকা)',
    stipend: 'সাধারণত প্রযোজ্য নয় (কোনো কোনো বিশ্ববিদ্যালয়ে সীমিত এলাউন্স)',
    outOfPocket: 'খাবার ও পকেট খরচ (মাসিক ১৮,০০০ – ৩০,০০০ টাকা)',
  },
  {
    title: 'স্ব-অর্থায়ন (Self-Funded)',
    tag: 'সরাসরি ভর্তি',
    highlight: 'নির্ধারিত টিউশন ফি প্রদান',
    tuition: '১২,০০০ – ২৫,০০০ আরএমবি/বছর (ইঞ্জিনিয়ারিং/বিজনেস: প্রায় ২.২৫ – ৪.৬৭ লাখ টাকা)',
    hostel: '২,০০০ – ৬,০০০ আরএমবি/বছর (প্রায় ৩৭,০০০ – ১.১২ লাখ টাকা)',
    stipend: 'প্রযোজ্য নয়',
    outOfPocket: 'এমবিবিএস কোর্সের ক্ষেত্রে টিউশন বার্ষিক ৩০,০০০ – ৫০,০০০ আরএমবি (প্রায় ৫.৬০ – ৯.৩৩ লাখ টাকা)',
  },
];

const studentFileSteps = [
  {
    step: '১',
    title: 'অনুমোদিত ডিলার (AD) ব্যাংক নির্বাচন',
    body: 'বাংলাদেশ ব্যাংকের অনুমোদিত যেকোনো কমার্শিয়াল ব্যাংকের অথরাইজড ডিলার শাখায় (যেমন: সিটি ব্যাংক, ইস্টার্ন ব্যাংক, ব্র্যাক ব্যাংক, প্রিমিয়ার ব্যাংক) শিক্ষার্থীর নামে স্টুডেন্ট ফাইল খুলতে হয়।',
  },
  {
    step: '২',
    title: 'বিশ্ববিদ্যালয়ের অফার লেটার ও ডিমান্ড নোট',
    body: 'বিশ্ববিদ্যালয় থেকে পাঠানো অফিশিয়াল এডমিশন লেটার, JW201 অথবা JW202 ফর্ম এবং টিউশন ফি ইনভয়েস মূল কপি ব্যাংকে জমা দিতে হবে।',
  },
  {
    step: '৩',
    title: 'অভিভাবকের আর্থিক ও ট্যাক্স ডকুমেন্টস (KYC)',
    body: 'স্পন্সরের ই-টিন (E-TIN), সর্বশেষ ট্যাক্স রিটার্ন দাখিলের প্রমাণপত্র এবং আয়ের উৎস যাচাইয়ের জন্য ৬ থেকে ১২ মাসের ব্যাংক স্টেটমেন্ট জমা দিতে হয়।',
  },
  {
    step: '৪',
    title: 'বাংলাদেশ ব্যাংক টিএম (TM) ফর্ম ও রেমিট্যান্স অনুমোদন',
    body: 'বৈদেশিক মুদ্রা লেনদেনের জন্য ব্যাংকের নির্ধারিত TM ফর্ম পূরণ করে টিউশন ফি সরাসরি বিশ্ববিদ্যালয়ের ব্যাংক অ্যাকাউন্টে ওয়্যার ট্রান্সফার করা হয়। প্রতি শিক্ষাবর্ষের জন্য ১ বছরের সমপরিমাণ ফি পাঠানোর অনুমতি মেলে।',
  },
  {
    step: '৫',
    title: 'ডেডিকেটেড এডুকেশন কার্ড (FE Circular No. 37)',
    body: 'বাংলাদেশ ব্যাংকের সার্কুলার অনুযায়ী বিশ্ববিদ্যালয় পোর্টালে অ্যাপ্লিকেশন ফি ও সিট বুকিং ফি অনলাইনে সরাসরি পরিশোধের জন্য স্টুডেন্ট ফাইলের বিপরীতে আন্তর্জাতিক এডুকেশন কার্ড ইস্যু করা যায়।',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${SITE}${PATH}#article`,
  url: `${SITE}${PATH}`,
  headline: 'চীনে পড়াশোনার খরচ ও বাংলাদেশ ব্যাংক স্টুডেন্ট ফাইল গাইড ২০২৭',
  description: 'বাংলাদেশী শিক্ষার্থীদের জন্য চীনে পড়াশোনার পূর্ণাঙ্গ ব্যয় বিবরণী ও ব্যাংক রেমিট্যান্স গাইড।',
  inLanguage: 'bn-BD',
  publisher: { '@id': `${SITE}/#organization` },
  breadcrumb: { '@id': `${SITE}${PATH}#breadcrumb` },
};

export default function BengaliChinaCostPage() {
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম। চীনে পড়াশোনার খরচ ও ব্যাংক ফাইলের বিষয়ে জানতে চাই।')}`;

  return (
    <div lang="bn" className="text-petrol-800">
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbJsonLd(trail, PATH)} />

      {/* Hero */}
      <section className="bg-canvas-soft pb-14 pt-[96px] sm:pt-[112px] lg:pb-20 lg:pt-[140px]">
        <div className={`${kit.wrap} max-w-4xl text-center mx-auto`}>
          <nav aria-label="ব্রেডক্রাম্ব" className="flex justify-center mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold text-ink-soft">
              <li><Link href="/" className="hover:text-petrol-800 hover:underline">হোম</Link></li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} className="text-ink-mute" aria-hidden="true" />
                <Link href="/bn/study-in-china" className="hover:text-petrol-800 hover:underline">চীনে উচ্চশিক্ষা</Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} className="text-ink-mute" aria-hidden="true" />
                <span className="text-petrol-800">খরচের হিসাব ও ব্যাংক ফাইল</span>
              </li>
            </ol>
          </nav>

          <span className="inline-block rounded-full bg-lime px-4 py-1.5 text-[13px] font-bold text-petrol-800 tracking-wide uppercase">
            স্বচ্ছ হিসাব ও সঠিক প্রক্রিয়া
          </span>

          <h1 className="mt-4 font-display text-[32px] font-black leading-tight sm:text-[44px] lg:text-[52px]">
            চীনে পড়াশোনার মোট খরচ ও বৈধ রেমিট্যান্স গাইড
          </h1>

          <p className="mt-5 text-[17px] leading-relaxed text-ink-soft sm:text-[19px]">
            লুকানো কোনো ফি নেই। টিউশন, হোস্টেল, খাবার ও সরকারি ফির স্পষ্ট হিসাব জেনে পরিবারসহ পরিকল্পিত সিদ্ধান্ত নিন।
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#student-file" className="ed-btn ed-btn-signal min-h-[50px] px-7">
              ব্যাংক স্টুডেন্ট ফাইল নিয়মাবলী <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-outline min-h-[50px] px-7">
              কাউন্সেলরের সাথে কথা বলুন
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
              <p className="text-[15px] font-bold text-petrol-800">ভিসার আগে ০ টাকা</p>
              <p className="text-[13px] text-ink-soft">ভিসার পূর্বে কোনো সার্ভিস ফি নেই</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Landmark className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">ব্যাংক ফাইল গাইডেন্স</p>
              <p className="text-[13px] text-ink-soft">বাংলাদেশ ব্যাংকের নিয়ম মেনে লেনদেন</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calculator className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">টাকা ও আরএমবি রূপান্তর</p>
              <p className="text-[13px] text-ink-soft">১ আরএমবি ≈ ১৮.৬৬ টাকা (বাজারদর অনুযায়ী)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeCheck className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">লিখিত ক্লিয়ারকস্ট শিট</p>
              <p className="text-[13px] text-ink-soft">পেমেন্টের পূর্বেই বিস্তারিত শিট প্রদান</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cost Tiers */}
      <Section title="চীনে ৩টি মূল ক্যাটাগরিতে পড়াশোনার খরচ" intro="স্কলারশিপের ধরন অনুযায়ী শিক্ষার্থীর প্রকৃত খরচ নির্ধারিত হয়। নিচে প্রধান ৩টি ক্যাটাগরির আর্থিক বিবরণ দেওয়া হলো:">
        <div className="grid gap-6 lg:grid-cols-3">
          {costTiers.map((tier) => (
            <div key={tier.title} className="rounded-3xl border border-rule bg-white p-7 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-full bg-canvas-soft px-3.5 py-1 text-[13px] font-bold text-petrol-800">
                  {tier.tag}
                </span>
                <h3 className="mt-4 text-[22px] font-bold text-petrol-800">{tier.title}</h3>
                <p className="mt-2 text-[15px] font-semibold text-emerald-700 bg-emerald-50 rounded-xl p-3">
                  {tier.highlight}
                </p>

                <div className="mt-6 space-y-4 text-[15px] text-ink-soft border-t border-rule pt-5">
                  <div>
                    <span className="font-bold text-petrol-800 block">টিউশন ফি:</span>
                    <span>{tier.tuition}</span>
                  </div>
                  <div>
                    <span className="font-bold text-petrol-800 block">হোস্টেল আবাসন:</span>
                    <span>{tier.hostel}</span>
                  </div>
                  <div>
                    <span className="font-bold text-petrol-800 block">মাসিক বৃত্তি / স্টাইপেন্ড:</span>
                    <span>{tier.stipend}</span>
                  </div>
                  <div>
                    <span className="font-bold text-petrol-800 block">অন্যান্য আনুষঙ্গিক খরচ:</span>
                    <span className="text-[14px] leading-relaxed">{tier.outOfPocket}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-rule">
                <Link href="/china-universities" className="inline-flex items-center gap-2 text-[15px] font-bold text-petrol-800 hover:text-lime">
                  বিশ্ববিদ্যালয় তালিকা দেখুন <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Bangladesh Bank Student File Section */}
      <section id="student-file" className="bg-canvas-soft py-16 lg:py-24">
        <div className={kit.wrap}>
          <div className="max-w-3xl">
            <span className="text-[14px] font-bold uppercase tracking-wider text-emerald-700">বাংলাদেশ ব্যাংক নির্দেশিকা</span>
            <h2 className="mt-2 font-display text-[28px] font-black sm:text-[36px] text-petrol-800">
              বৈধ ব্যাংকিং চ্যানেলে বিদেশে টিউশন ফি পাঠানো (স্টুডেন্ট ফাইল)
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
              বিদেশে পড়াশোনার টিউশন ও থাকার খরচ পাঠানোর জন্য হুন্ডি বা অননুমোদিত কোনো মাধ্যম ব্যবহার করা সম্পূর্ণ বেআইনি। বাংলাদেশ ব্যাংকের বৈদেশিক মুদ্রা নিয়ন্ত্রণ নীতি অনুযায়ী অনুমোদিত বাণিজ্যিক ব্যাংকের মাধ্যমে স্টুডেন্ট ফাইল খুলে টাকা পাঠাতে হয়।
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studentFileSteps.map((s) => (
              <div key={s.step} className="rounded-2xl bg-white p-6 border border-rule shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-xl bg-petrol-800 font-display text-[18px] font-black text-lime">
                  {s.step}
                </span>
                <h3 className="mt-4 text-[18px] font-bold text-petrol-800">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6 flex items-start gap-4">
            <ShieldAlert className="size-6 text-amber-700 shrink-0 mt-1" />
            <div>
              <h4 className="text-[16px] font-bold text-amber-900">অভিভাবকদের জন্য জরুরি সতর্কবার্তা</h4>
              <p className="mt-1 text-[14px] leading-relaxed text-amber-800">
                বাংলাদেশ ব্যাংকের নিয়ম অনুযায়ী স্পন্সরের টিআইএন (TIN) সার্টিফিকেট ও ব্যাংক স্টেটমেন্টে আয়ের সুনির্দিষ্ট বৈধ উৎস থাকা আবশ্যক। চাইনিজ বিশ্ববিদ্যালয়গুলো সাধারণত আরএমবি (CNY) কারেন্সিতে ইনভয়েস দেয়, কিন্তু দেশীয় ব্যাংকগুলো ইউএসডি (USD) বা ইউরো (EUR) তে ওয়্যার ট্রান্সফার করে। ফলে মুদ্রা রূপান্তরের ক্ষেত্রে ২–৪% এক্সচেঞ্জ মার্জিন হিসেবে বাজেটে বিবেচনায় রাখুন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EduExpress Commercial Policy */}
      <Section title="এজু এক্সপ্রেসের সার্ভিস চার্জ পলিসি" intro="আমরা স্বচ্ছ ও স্পষ্ট শর্তে কাজ করি। আপনার কোনো টাকা ঝুঁকির মুখে পড়তে দিই না।">
        <div className="rounded-3xl bg-petrol-800 text-white p-8 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="rounded-full bg-lime/20 px-3.5 py-1 text-[13px] font-semibold text-lime">ভিসা-ফার্স্ট প্রতিশ্রুতি</span>
              <h3 className="mt-4 font-display text-[26px] font-bold sm:text-[32px]">
                ভিসা স্ট্যাম্পিংয়ের পূর্বে আমাদের কোনো ফি নেই
              </h3>
              <p className="mt-4 text-[16px] leading-relaxed text-white/80">
                চায়না প্যাকেজের জন্য ফাইল ওপেনিং চার্জ সম্পূর্ণ ০ টাকা। চায়না ভিসা অনুমোদনের পূর্বে এজু এক্সপ্রেস কোনো সার্ভিস চার্জ গ্রহণ করে না। ভিসা নিশ্চিত হওয়ার পর নির্ধারিত প্যাকেজ ফি (২,০০,০০০ টাকা) পরিশোধযোগ্য।
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                *বিশ্ববিদ্যালয় কর্তৃক নির্ধারিত আবেদন ফি, মেডিকেল টেস্ট, ইনস্যুরেন্স কিংবা সরকারি ফি থাকলে তা সরাসরি সংশ্লিষ্ট প্রতিষ্ঠানে প্রদেয় এবং আবেদনের পূর্বেই লিখিত কস্ট শিটে উল্লেখ থাকবে।
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 border border-white/15">
              <h4 className="text-[18px] font-bold text-lime">লিখিত খরচের অঙ্গীকারনামা</h4>
              <ul className="mt-4 space-y-3 text-[15px] text-white/90">
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>কোনো গোপন বা অপ্রকাশিত চার্জ নেই</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>প্রতিটি ফির নির্দিষ্ট রিসিট ও প্রাপক নিশ্চিতকরণ</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>ব্যাংক স্টুডেন্ট ফাইল ওপেনিংয়ে পূর্ণাঙ্গ সহায়তা</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BadgeCheck size={18} className="text-lime shrink-0" />
                  <span>ভিসা প্রিপারেশন ও প্রি-ডিপার্চার ওরিয়েন্টেশন অন্তর্ভুক্ত</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Assessment CTA */}
      <section className="bg-canvas-soft py-16">
        <div className={kit.wrap}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-700">ফ্রি প্রোফাইল অ্যাসেসমেন্ট</span>
              <h2 className="mt-2 font-display text-[26px] font-black sm:text-[32px] text-petrol-800">
                আপনার বাজেট অনুযায়ী সেরা বিশ্ববিদ্যালয় ও স্কলারশিপ জানুন
              </h2>
              <p className="mt-3 text-[15px] text-ink-soft">
                আপনার রেজাল্ট ও পছন্দের সাবজেক্ট জমা দিন। আমাদের সিনিয়র কাউন্সেলর আপনার সাথে যোগাযোগ করবেন।
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-rule shadow-sm">
              <EducationFitAssessment />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
