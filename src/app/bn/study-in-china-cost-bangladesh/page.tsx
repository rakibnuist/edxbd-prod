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
import { JsonLd, Section, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bn/study-in-china-cost-bangladesh';
const EN_PATH = '/study-in-china-cost-bangladesh';
const trail = [
  { name: 'চীনে উচ্চশিক্ষা', href: '/bn/study-in-china' },
  { name: 'পড়াশোনার মোট খরচ ও স্কলারশিপ গাইড' },
];

export const metadata = pageMetadata({
  title: 'চীনে পড়াশোনার মোট খরচ ও স্কলারশিপ গাইড ২০২৭ | EduExpress',
  description:
    'চীনে Bachelor, Master’s ও MBBS পড়ার বাস্তবসম্মত খরচ (টাকা ও RMB হিসাব)। কোনো জটিল Student File-এর ঝামেলা নেই। CSC ও Provincial স্কলারশিপের পূর্ণাঙ্গ বিবরণ।',
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
    title: 'Full CSC Scholarship (Type A / B)',
    tag: 'সর্বোচ্চ সাশ্রয়ী (Fully Funded)',
    highlight: '১০০% Tuition Fee ও Dormitory ফ্রি + মাসিক হ্যান্ডসাম Stipend',
    tuition: 'BDT 0 (সম্পূর্ণ Tuition Waiver)',
    hostel: 'ফ্রি ইউনিভার্সিটি ডরমিটরি (Single / Double Room)',
    stipend: 'মাসিক 2,500 – 3,500 RMB (প্রায় ৪৬,০০০ – ৬৫,০০০ টাকা)',
    outOfPocket:
      'শুধুমাত্র Medical Insurance (৮০০ RMB/বছর), Residence Permit (৪০০ RMB) এবং এককালীন বিমান ভাড়া।',
    badgeTone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    title: 'Partial / Provincial Scholarship',
    tag: 'সবচেয়ে জনপ্রিয় বিকল্প',
    highlight: '৫০% থেকে ১০০% পর্যন্ত Tuition Fee ছাড়',
    tuition: '০ – ১৫,০০০ RMB / বছর (প্রায় BDT 0 – ২.৮০ লাখ)',
    hostel: '১,৫০০ – ৪,৫০০ RMB / বছর (প্রায় ২৮,০০০ – ৮৪,০০০ টাকা)',
    stipend: 'কিছু বিশ্ববিদ্যালয় বার্ষিক এককালীন মেরিট স্টাইপেন্ড প্রদান করে',
    outOfPocket:
      'খাবার ও ব্যক্তিগত পকেট খরচ: মাসিক ১,০০০ – ১,৫০০ RMB (প্রায় ১৮,০০০ – ২৮,০০০ টাকা)।',
    badgeTone: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    title: 'Self-Funded (স্ব-অর্থায়ন)',
    tag: 'সরাসরি ভর্তি (Direct Admission)',
    highlight: 'সাশ্রয়ী টিউশনে আন্তর্জাতিক মানের ডিগ্রি',
    tuition: 'Engineering / Business: ১২,০০০ – ২৫,০০০ RMB / বছর (প্রায় ২.২৫ – ৪.৬৭ লাখ টাকা)',
    hostel: '২,০০০ – ৬,০০০ RMB / বছর (প্রায় ৩৭,০০০ – ১.১২ লাখ টাকা)',
    stipend: 'প্রযোজ্য নয় (তবে ২য় বর্ষ থেকে রেজাল্টের ভিত্তিতে University Merit Scholarship সম্ভব)',
    outOfPocket:
      'MBBS প্রোগ্রামের বার্ষিক Tuition Fee সাধারণত ৩০,০০০ – ৫০,০০০ RMB (প্রায় ৫.৬০ – ৯.৩৩ লাখ টাকা; BMDC ও WHO স্বীকৃত)।',
    badgeTone: 'bg-canvas-soft text-petrol-800 border-rule',
  },
];

const annualComparisonRows = [
  {
    category: 'Full CSC Scholarship',
    tuition: '০ টাকা (ফ্রি)',
    hostel: 'ফ্রি ডরমিটরি',
    foodPersonal: 'মাসিক Stipend থেকেই খাবার খরচ মেটানো যায়',
    totalOutPocket: 'শুধু Insurance, Visa ও বিমান ভাড়া',
  },
  {
    category: 'Provincial / University Scholarship (Tuition Free)',
    tuition: '০ টাকা (100% Waiver)',
    hostel: '২৮,০০০ – ৫৫,০০০ টাকা',
    foodPersonal: '২.২০ – ২.৮০ লাখ টাকা',
    totalOutPocket: 'বার্ষিক প্রায় ২.৫০ – ৩.৪০ লাখ টাকা',
  },
  {
    category: 'Partial Scholarship (50% Tuition Waiver)',
    tuition: '১.২০ – ১.৮০ লাখ টাকা',
    hostel: '২৮,০০০ – ৫৫,০০০ টাকা',
    foodPersonal: '২.২০ – ২.৮০ লাখ টাকা',
    totalOutPocket: 'বার্ষিক প্রায় ৩.৭০ – ৫.১৫ লাখ টাকা',
  },
  {
    category: 'Self-Funded (Engineering / BBA / CS)',
    tuition: '২.২৫ – ৪.৫০ লাখ টাকা',
    hostel: '৩৭,০০০ – ৮০,০০০ টাকা',
    foodPersonal: '২.২০ – ২.৮০ লাখ টাকা',
    totalOutPocket: 'বার্ষিক প্রায় ৪.৮০ – ৭.৫০ লাখ টাকা',
  },
  {
    category: 'Self-Funded MBBS (English Medium)',
    tuition: '৫.৬০ – ৯.৩০ লাখ টাকা',
    hostel: '৫৫,০০০ – ১.১০ লাখ টাকা',
    foodPersonal: '২.৫০ – ৩.২০ লাখ টাকা',
    totalOutPocket: 'বার্ষিক প্রায় ৮.৬৫ – ১৩.৬০ লাখ টাকা',
  },
];

const paymentSimplicityPoints = [
  {
    icon: CheckCircle2,
    title: 'কোনো Student File খোলার ঝামেলা নেই',
    desc: 'ইউকে, কানাডা বা ইউরোপের মতো চীনে পড়ার ক্ষেত্রে বাংলাদেশ ব্যাংকে জটিল Student File খুলে ট্যাক্স ফাইল বা সোর্স অব ফান্ড অডিট করাতে হয় না। কোনো ব্যাংকিং আমলাতান্ত্রিক জটিলতা নেই।',
  },
  {
    icon: Building2,
    title: 'বিশ্ববিদ্যালয়ে পৌঁছে On-Campus পেমেন্ট সুবিধা',
    desc: 'আংশিক স্কলারশিপ বা সেলফ-ফান্ডেড টিউশন ফি সাধারণত চীনে পৌঁছে বিশ্ববিদ্যালয় ক্যাম্পাসে সরাসরি রেজিস্ট্রেশনের সময় জমা দেওয়া যায়। দেশ ছাড়ার আগে আগাম কোনো ফি পাঠাতে হয় না।',
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
    q: 'চীনে পড়ার জন্য কি বাংলাদেশ ব্যাংকে Student File খুলতে হবে?',
    a: 'না, চীনে পড়াশোনার জন্য কোনো Student File খোলার প্রয়োজন নেই। ফুল স্কলারশিপে টিউশন ও হোস্টেল সম্পূর্ণ ফ্রি থাকে। আর যাদের আংশিক ফি থাকে, তারা চীনে গিয়ে ক্যাম্পাসে সরাসরি রেজিস্ট্রেশনের সময় ফি দিতে পারেন।',
  },
  {
    q: 'বাংলাদেশ থেকে চীনে টাকা নিয়ে যাওয়ার নিয়ম কী?',
    a: 'শিক্ষার্থী ভ্রমণের সময় আইনসম্মতভাবে পাসপোর্টে ডলার বা ইউয়ান এনডোর্স করে সাথে ক্যাশ নিতে পারেন। এছাড়া ইন্টারন্যাশনাল কার্ড বা পরবর্তীতে লোকাল ব্যাংক অ্যাকাউন্টের মাধ্যমেও খরচ ম্যানেজ করা যায়।',
  },
  {
    q: 'চীনে পড়ার জন্য কি ব্যাংকে বড় অঙ্কের Bank Solvency দেখাতে হয়?',
    a: 'চায়না এম্বাসির ভিসার জন্য সাধারণ একটি ব্যাংক স্টেটমেন্ট বা সলভেন্সি সার্টিফিকেটই যথেষ্ট (সাধারণত ৫ থেকে ৮ লাখ টাকা সমপরিমাণ ব্যালেন্স)। কোনো অস্বাভাবিক লেনদেন বা জটিল প্রমাণের প্রয়োজন পড়ে না।',
  },
  {
    q: 'ভিসা হওয়ার আগে EduExpress-কে কি কোনো সার্ভিস চার্জ দিতে হবে?',
    a: 'একদমই না। আমাদের চায়না প্যাকেজে ফাইল ওপেনিং চার্জ সম্পূর্ণ ০ টাকা। চায়না স্টুডেন্ট ভিসা (X1/X2) কনফার্ম হওয়ার পূর্বে আমাদের কোনো সার্ভিস ফি নেই। ভিসা শতভাগ নিশ্চিত হওয়ার পর নির্ধারিত প্যাকেজ ফি (BDT 2,00,000) প্রদেয়।',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${SITE}${PATH}#article`,
  url: `${SITE}${PATH}`,
  headline: 'চীনে পড়াশোনার মোট খরচ ও স্কলারশিপ গাইড ২০২৭',
  description:
    'বাংলাদেশী শিক্ষার্থীদের জন্য চীনে পড়াশোনার পূর্ণাঙ্গ ব্যয় বিবরণী, স্কলারশিপ ও অন-ক্যাম্পাস পেমেন্ট গাইড। কোনো জটিল Student File-এর প্রয়োজন নেই।',
  inLanguage: 'bn-BD',
  publisher: { '@id': `${SITE}/#organization` },
  breadcrumb: { '@id': `${SITE}${PATH}#breadcrumb` },
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
            <Sparkles size={15} className="text-petrol-800" /> কোনো জটিল Student File-এর ঝামেলা নেই
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
              <p className="text-[15px] font-bold text-petrol-800">No Student File</p>
              <p className="text-[13px] text-ink-soft">ব্যাংক ফাইলের কোনো ঝামেলা নেই</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calculator className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">BDT ও RMB রূপান্তর</p>
              <p className="text-[13px] text-ink-soft">১ RMB ≈ ১৮.৬৬ টাকা (মার্কেট রেট অনুযায়ী)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeCheck className="size-8 text-lime shrink-0" />
            <div>
              <p className="text-[15px] font-bold text-petrol-800">লিখিত ClearCost™ শিট</p>
              <p className="text-[13px] text-ink-soft">আবেদনের আগেই প্রতিটি ফি লিখিত আকারে প্রদান</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why China Has No Student File Hassle */}
      <Section
        title="চীনে উচ্চশিক্ষায় কোনো Student File খোলার ঝামেলা নেই কেন?"
        intro="ইউরোপ বা পশ্চিমা দেশগুলোর তুলনায় চীনে পড়াশোনার পেমেন্ট প্রক্রিয়া অত্যন্ত সহজ ও ঝামেলামুক্ত:"
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
                <th className="p-4 sm:p-5">খাবার ও হাতখরচ (বার্ষিক)</th>
                <th className="p-4 sm:p-5 font-black text-petrol-800">অভিভাবকের সম্ভাব্য খরচ</th>
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
          *হিসাবটি আনুমানিক এবং ১ RMB = ১৮.৬৬ টাকা ও ১ USD = ১২২ টাকা ধরে রূপান্তর করা হয়েছে। কোর্স, শহর এবং শিক্ষার্থীর নিজস্ব লাইফস্টাইলের ওপর নির্ভর করে খরচ কিছুটা কম-বেশি হতে পারে।
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
                <ShieldCheck size={16} /> ভিসা-ফার্স্ট (Visa-First) প্রতিশ্রুতি
              </span>
              <h3 className="mt-4 font-display text-[26px] font-bold sm:text-[32px]">
                ভিসা নিশ্চিত হওয়ার আগে আমাদের সার্ভিস ফি BDT 0
              </h3>
              <p className="mt-4 text-[16px] leading-relaxed text-white/85">
                চায়না প্যাকেজের জন্য ফাইল ওপেনিং চার্জ সম্পূর্ণ ০ টাকা। চায়না ভিসা স্ট্যাম্পিংয়ের আগে EduExpress কোনো সার্ভিস ফি গ্রহণ করে না। ভিসা শতভাগ নিশ্চিত হওয়ার পর নির্ধারিত প্যাকেজ ফি (BDT 2,00,000) পরিশোধযোগ্য।
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
    </div>
  );
}
