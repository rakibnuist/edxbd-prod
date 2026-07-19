import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Building2,
  Award,
  DollarSign,
  FileCheck2,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';

export const metadata: Metadata = {
  title: { absolute: 'বাংলাদেশে শিক্ষার্থীদের জন্য চীনে উচ্চশিক্ষা ও স্কলারশিপ ২০২৬ | EduExpress' },
  description:
    'বাংলাদেশী শিক্ষার্থীদের জন্য চীনে ব্যাচেলর, মাস্টার্স, স্কলারশিপ ও ভিসা প্রসেসিং গাইড। ভিসা অনুমোদনের পূর্বে কোনো ফাইল ওপেনিং চার্জ বা সার্ভিস ফি নেই।',
  alternates: { canonical: '/bn/study-in-china' },
  openGraph: {
    title: 'বাংলাদেশে শিক্ষার্থীদের জন্য চীনে উচ্চশিক্ষা | EduExpress International',
    description: 'চীনে স্কলারশিপ, বিশ্ববিদ্যালয়ের তালিকা, টিউশন ফি এবং ভিসা প্রসেসিং তথ্য।',
    url: '/bn/study-in-china',
    type: 'website',
  },
};

const bnFeatures = [
  {
    title: '১০০% ফুল টিউশন ও হোস্টেল স্কলারশিপ',
    detail: 'চীনা সরকারি সিএসসি (CSC), প্রোভিনশিয়াল এবং বিশ্ববিদ্যালয় স্কলারশিপের মাধ্যমে সম্পূর্ণ বিনামূল্যে পড়ার সুযোগ।',
  },
  {
    title: 'আইইএলটিএস (IELTS) ছাড়া আবেদনের সুযোগ',
    detail: 'মিডিয়াম অফ ইন্সট্রাকশন (MOI) সার্টিফিকেটের মাধ্যমে অনেক সেরা বিশ্ববিদ্যালয়ে সরাসরি ভর্তি।',
  },
  {
    title: 'ভিসার আগে কোনো সার্ভিস ফি নেই',
    detail: 'এজু এক্সপ্রেস ইন্টারন্যাশনাল-এ ভিসা অনুমোদনের পূর্বে কোনো কনসালটেন্সি সার্ভিস চার্জ প্রযোজ্য নয়।',
  },
];

export default function BengaliStudyInChinaPage() {
  return (
    <div className="bg-[#f4f8fa] text-[#08263c] font-sans">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12">
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            <Link href="/" className="hover:text-white">হোম</Link> <span aria-hidden>/</span>{' '}
            <Link href="/study-in-china-from-bangladesh" className="hover:text-white">Study in China (EN)</Link> <span aria-hidden>/</span> চীনে উচ্চশিক্ষা (বাংলা)
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8ed0ee]/30 bg-[#8ed0ee]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#8ed0ee]">
              <Globe2 size={14} /> ফ্ল্যাগশিপ চায়না উচ্চশিক্ষা পোর্টাল
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
              বাংলাদেশী শিক্ষার্থীদের জন্য চীনে উচ্চশিক্ষা ২০২৬
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80 md:text-xl">
              টিউশন ফি waiver, স্কলারশিপ, বিশ্ববিদ্যালয় পছন্দ, খরচ এবং ভিসা আবেদনের সঠিক ও লিখিত তথ্যভিত্তিক গাইডলাইন।
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              <a
                href="#bn-assessment"
                className="inline-flex items-center gap-2 rounded-full bg-[#64b5df] px-7 py-3.5 text-[#08263c] transition-all hover:bg-white"
              >
                ফ্রি এডুকেশন ফিট অ্যাসেসমেন্ট <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">প্রধান সুবিধাসমূহ</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">কেন চীনে উচ্চশিক্ষা নির্বাচন করবেন?</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {bnFeatures.map((f) => (
              <div key={f.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-[#08263c]">{f.title}</h3>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="bg-white px-5 py-16 border-y border-slate-200 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1000px] text-center">
          <ShieldCheck size={36} className="mx-auto text-[#174f7a]" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#08263c]">ভিসা-ফার্স্ট সার্ভিস পলিসি</h2>
          <div className="mt-6 rounded-2xl bg-[#e9f7fd] p-6 text-base font-semibold leading-relaxed text-[#08263c] border border-blue-200">
            "কোনো ফাইল ওপেনিং চার্জ নেই। চায়না স্টুডেন্ট ভিসা অনুমোদনের পূর্বে এজু এক্সপ্রেসের কোনো সার্ভিস ফি নেই। বিশ্ববিদ্যালয়, এম্বাসি, মেডিকেল, অনুবাদ বা অন্যান্য থার্ড-পার্টি ফি লিখিতভাবে প্রদান করা হয়।"
          </div>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section id="bn-assessment" className="px-5 py-20 bg-[#e9f7fd] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <EducationFitAssessment />
        </div>
      </section>
    </div>
  );
}
