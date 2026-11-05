import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CalendarCheck, ChevronRight, Globe2, MapPin, MessageCircle, ShieldCheck, Wallet } from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { JsonLd, Section, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bn/study-in-china';
const trail = [{ name: 'চীনে উচ্চশিক্ষা' }];

export const metadata = pageMetadata({
  title: 'চীনে উচ্চশিক্ষা ও স্কলারশিপ গাইড ২০২৭ | EduExpress',
  description:
    'বাংলাদেশী শিক্ষার্থীদের জন্য চীনে ব্যাচেলর, মাস্টার্স, স্কলারশিপ ও ভিসা প্রসেসিং গাইড। ভিসা অনুমোদনের পূর্বে কোনো ফাইল ওপেনিং চার্জ বা সার্ভিস ফি নেই।',
  path: PATH,
  locale: 'bn_BD',
  languages: {
    'en-BD': '/study-in-china-from-bangladesh',
    'bn-BD': PATH,
    'x-default': '/study-in-china-from-bangladesh',
  },
});

const bnFeatures = [
  {
    title: 'ফুল টিউশন ও হোস্টেল স্কলারশিপের সুযোগ',
    detail: 'চীনা সরকারি সিএসসি (CSC), প্রোভিনশিয়াল এবং বিশ্ববিদ্যালয় স্কলারশিপে টিউশন ও হোস্টেল পুরোপুরি কভার হতে পারে। তবে স্কলারশিপ প্রতিযোগিতামূলক — আমরা কোনো স্কলারশিপের নিশ্চয়তা দিই না।',
  },
  {
    title: 'আইইএলটিএস (IELTS) ছাড়া আবেদনের সুযোগ',
    detail: 'কিছু বিশ্ববিদ্যালয় ও প্রোগ্রাম মিডিয়াম অফ ইন্সট্রাকশন (MOI) সার্টিফিকেট গ্রহণ করে। এটি সব প্রোগ্রামে প্রযোজ্য নয় — আপনার নির্দিষ্ট প্রোগ্রামের শর্ত যাচাই করুন।',
  },
  {
    title: 'ভিসার আগে কোনো সার্ভিস ফি নেই',
    detail: 'এজু এক্সপ্রেস ইন্টারন্যাশনাল-এ ভিসা অনুমোদনের পূর্বে কোনো কনসালটেন্সি সার্ভিস চার্জ প্রযোজ্য নয়।',
  },
];

// The same four standing facts as the English TrustBar, in Bangla.
const trustItems = [
  { icon: CalendarCheck, title: '২০১৮ সাল থেকে', text: 'ধানমন্ডি, ঢাকা থেকে পরিবারগুলোকে কাউন্সেলিং' },
  { icon: MapPin, title: 'সরাসরি অফিসে আসুন', text: 'শনিবার থেকে বৃহস্পতিবার, সকাল ১১টা থেকে সন্ধ্যা ৬টা' },
  { icon: Wallet, title: 'ভিসার আগে ০ টাকা', text: 'চায়না ভিসা অনুমোদনের আগে এজু এক্সপ্রেসের কোনো ফি নেই' },
  { icon: BadgeCheck, title: 'সব খরচ লিখিতভাবে', text: 'সিদ্ধান্ত নেওয়ার আগেই প্রতিটি পেমেন্টের তালিকা' },
];

// Detailed guides are published in English; links carry hrefLang so readers know.
const guides = [
  { label: 'চীনে স্কলারশিপ: সব রুটের তুলনা', href: '/china-scholarships-bangladesh' },
  { label: 'সিএসসি (CSC) স্কলারশিপ গাইড', href: '/csc-scholarship-bangladesh' },
  { label: 'ভর্তির যোগ্যতা ও কাগজপত্র', href: '/china-admission-requirements' },
  { label: 'পড়াশোনার মোট খরচ', href: '/study-in-china-cost-bangladesh' },
  { label: 'চায়না স্টুডেন্ট ভিসা', href: '/china-student-visa-bangladesh' },
  { label: 'চীনে এমবিবিএস', href: '/mbbs-in-china-bangladesh' },
  { label: 'ইনটেক ও আবেদনের সময়সীমা', href: '/china-intakes-deadlines' },
  { label: 'চীনের বিশ্ববিদ্যালয় খুঁজুন', href: '/china-universities' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE}${PATH}#page`,
  url: `${SITE}${PATH}`,
  name: 'বাংলাদেশী শিক্ষার্থীদের জন্য চীনে উচ্চশিক্ষা ২০২৭',
  inLanguage: 'bn-BD',
  isPartOf: { '@id': `${SITE}/#website` },
  publisher: { '@id': `${SITE}/#organization` },
  breadcrumb: { '@id': `${SITE}${PATH}#breadcrumb` },
};

export default function BengaliStudyInChinaPage() {
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম। চীনে উচ্চশিক্ষার বিষয়ে কাউন্সেলিং চাই।')}`;
  return (
    <div lang="bn" className="text-petrol-800">
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbJsonLd(trail, PATH)} />

      {/* Hero: the shared PageHero layout with a Bangla breadcrumb label. */}
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
            <p className={`anim-rise mt-6 ${kit.badge}`}><Globe2 size={15} aria-hidden="true" /> ফ্ল্যাগশিপ চায়না উচ্চশিক্ষা পোর্টাল</p>
            <h1 className="anim-lift mt-5 font-display text-[38px] font-bold text-petrol-800 sm:text-[50px] lg:text-[58px]">
              বাংলাদেশী শিক্ষার্থীদের জন্য চীনে উচ্চশিক্ষা ২০২৭
            </h1>
            <p className={`anim-rise mt-6 max-w-2xl ${kit.lead}`}>
              টিউশন ফি waiver, স্কলারশিপ, বিশ্ববিদ্যালয় পছন্দ, খরচ এবং ভিসা আবেদনের সঠিক ও লিখিত তথ্যভিত্তিক গাইডলাইন।
            </p>
            <div className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#bn-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">ফ্রি এডুকেশন ফিট অ্যাসেসমেন্ট <ArrowRight size={18} aria-hidden="true" /></a>
              <Link href="/study-in-china-from-bangladesh" hrefLang="en" className="ed-btn ed-btn-outline min-h-[52px] px-7"><span lang="en">Read in English</span></Link>
            </div>
          </div>
          <figure className="anim-rise relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image src="/images/home/china-campus-group.webp" alt="চীনের একটি বিশ্ববিদ্যালয় ক্যাম্পাসে একত্র হওয়া একটি দল" fill priority sizes="(max-width:1024px) 100vw, 480px" className="object-cover" />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">চীনের বিশ্ববিদ্যালয় ক্যাম্পাসে</figcaption>
          </figure>
        </div>
      </section>

      <section aria-label="কেন পরিবারগুলো এজু এক্সপ্রেসের ওপর আস্থা রাখে" className="border-b border-canvas-soft bg-white py-8">
        <ul data-anim="stagger" className={`${kit.wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
          {trustItems.map(item => (
            <li key={item.title} className="flex items-start gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><item.icon size={20} aria-hidden="true" /></span>
              <span>
                <span className="block text-[17px] font-bold text-petrol-800">{item.title}</span>
                <span className="block text-[15px] leading-6 text-ink-soft">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Section title="কেন চীনে উচ্চশিক্ষা নির্বাচন করবেন?">
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-3">
          {bnFeatures.map((feature, index) => (
            <div key={feature.title} className={index === 1 ? kit.cardLime : kit.cardSage}>
              <h3 className="text-[21px] font-semibold text-petrol-800">{feature.title}</h3>
              <p className="mt-3 text-[16px] leading-7 text-ink-soft">{feature.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="navy" title="ভিসা-ফার্স্ট সার্ভিস পলিসি">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <p className="flex items-start gap-3 text-[18px] leading-8 text-white/90">
            <ShieldCheck size={24} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
            <span>কোনো ফাইল ওপেনিং চার্জ নেই। চায়না স্টুডেন্ট ভিসা অনুমোদনের পূর্বে এজু এক্সপ্রেসের কোনো সার্ভিস ফি নেই। এর আগে বিশ্ববিদ্যালয়, এম্বাসি, মেডিকেল, অনুবাদ বা অন্য কোনো থার্ড-পার্টি ফি প্রয়োজন হলে, আপনি এগোনোর আগেই তা লিখিতভাবে জানানো হয়।</span>
          </p>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/china-visa-first-policy" hrefLang="en" className="ed-btn ed-btn-signal min-h-[52px] px-7">পুরো পলিসি পড়ুন (ইংরেজি)</Link>
          </div>
        </div>
      </Section>

      <Section tone="sage" title="বিস্তারিত গাইড" intro="প্রতিটি বিষয়ে আমাদের বিস্তারিত গাইড ইংরেজিতে প্রকাশিত।">
        <nav aria-label="চীনে উচ্চশিক্ষার গাইড">
          <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map(item => (
              <li key={item.href}>
                <Link href={item.href} hrefLang="en" className="flex h-full min-h-[64px] items-center justify-between gap-3 rounded-3xl bg-white px-5 py-4 text-[16px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale">
                  {item.label}<ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section id="bn-assessment" title="ফ্রি এডুকেশন ফিট অ্যাসেসমেন্ট" intro="আপনার ফলাফল, পছন্দের বিষয় ও বাজেট জানান। একজন কাউন্সেলর আপনার জন্য উপযুক্ত পথগুলো পর্যালোচনা করবেন।">
        <EducationFitAssessment />
      </Section>

      <section className="bg-petrol-800 py-16 text-white lg:py-20">
        <div className={`${kit.wrap} flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="max-w-2xl">
            <h2 data-anim="pop" className="font-display text-[36px] font-bold text-lime sm:text-[48px]">কোথা থেকে শুরু করবেন বুঝতে পারছেন না?</h2>
            <p className="mt-5 text-[18px] leading-[1.7] text-white/85">আপনার ফলাফল, বাজেট ও পছন্দের বিষয় জানান। আমরা বাস্তবসম্মত বিকল্প, খরচ এবং প্রয়োজনীয় কাগজপত্রের তালিকা লিখিতভাবে জানাব।</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a href="#bn-assessment" className="ed-btn ed-btn-signal min-h-[54px] px-7">ফ্রি অ্যাসেসমেন্ট শুরু করুন <ArrowRight size={18} aria-hidden="true" /></a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-on-dark min-h-[54px] px-7"><MessageCircle size={18} aria-hidden="true" /> হোয়াটসঅ্যাপে কথা বলুন</a>
          </div>
        </div>
      </section>
    </div>
  );
}
