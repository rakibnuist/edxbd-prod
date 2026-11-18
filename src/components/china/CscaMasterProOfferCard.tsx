import Link from 'next/link';
import { ArrowRight, Award, BookOpenCheck, Check, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { kit } from '@/components/page/PageKit';

export interface CscaMasterProOfferCardProps {
  lang?: 'en' | 'bn';
  assessmentHref?: string;
  compact?: boolean;
  headingLevel?: 'h2' | 'h3';
}

const CSCA_FREE_EXAM_URL =
  'https://www.cscamaster.com/free-exam?utm_source=eduexpressint&utm_medium=offer_card&utm_campaign=csca_pro_access';
const CSCA_BD_GUIDE_URL =
  'https://www.cscamaster.com/csca/countries/bangladesh?utm_source=eduexpressint&utm_medium=offer_card&utm_campaign=csca_pro_access';
const CSCA_SCORE_CALC_URL =
  'https://www.cscamaster.com/tools/score-calculator?utm_source=eduexpressint&utm_medium=offer_card&utm_campaign=csca_pro_access';
const CSCA_MBBS_URL =
  'https://www.cscamaster.com/csca/programmes/mbbs?utm_source=eduexpressint&utm_medium=offer_card&utm_campaign=csca_pro_access';
const CSCA_HOME_URL =
  'https://www.cscamaster.com/?utm_source=eduexpressint&utm_medium=offer_card&utm_campaign=csca_pro_access';

const enFeatures = [
  {
    title: '155 Full-Length Mock Papers',
    detail:
      'Unlimited timed attempts across Mathematics, Physics, Chemistry, and Professional Chinese (Humanities & STEM).',
  },
  {
    title: '21 Official Past Papers on the Clock',
    detail:
      'Sit real 2025–2026 official CSCA papers under exact 60-minute and 90-minute exam conditions with worked solutions.',
  },
  {
    title: '2,867 Syllabus Drills & Adaptive Plan',
    detail:
      '54 concept lessons, topic-level drills, global percentile estimation, and a personalised weak-topic study schedule.',
  },
  {
    title: 'BDT 0 File Opening + Instant Seat Code',
    detail:
      'Verify your core academic documents to open your China application file at BDT 0 and redeem your Pro code on cscamaster.com.',
  },
];

const bnFeatures = [
  {
    title: '১৫৫টি পূর্ণাঙ্গ মক টেস্ট',
    detail:
      'Mathematics, Physics, Chemistry এবং Professional Chinese (Humanities ও STEM) বিষয়ে আনলিমিটেড মক পরীক্ষার সুযোগ।',
  },
  {
    title: '২১টি অফিশিয়াল প্রশ্নপত্রে টাইমড প্র্যাকটিস',
    detail:
      '২০২৫–২০২৬ সেশনের অফিশিয়াল CSCA প্রশ্নপত্রে আসল পরীক্ষার সময় (৬০ ও ৯০ মিনিট) ধরে অনুশীলন ও ব্যাখ্যাসহ সমাধান।',
  },
  {
    title: '২,৮৬৭টি টপিক ড্রিল ও স্মার্ট স্টাডি প্ল্যান',
    detail:
      '৫৪টি কনসেপ্ট লেসন, টপিকভিত্তিক প্রশ্ন ব্যাংক, স্কোর ও পার্সেন্টাইল হিসাব এবং দুর্বল টপিক অনুযায়ী স্টাডি প্ল্যান।',
  },
  {
    title: '০ টাকা ফাইল ওপেনিং + Pro অ্যাক্টিভেশন কোড',
    detail:
      'কোনো ফাইল ওপেনিং চার্জ ছাড়াই একাডেমিক ডকুমেন্ট যাচাই করে চায়না ফাইল ওপেন করুন এবং cscamaster.com-এর Pro কোড বুঝে নিন।',
  },
];

export default function CscaMasterProOfferCard({
  lang = 'en',
  assessmentHref = '/education-fit-assessment',
  compact = false,
  headingLevel = 'h3',
}: CscaMasterProOfferCardProps) {
  const HeadingTag = headingLevel;
  const isInternalAnchor = assessmentHref.startsWith('#');

  if (lang === 'bn') {
    return (
      <div
        lang="bn"
        className="rounded-3xl border-2 border-lime/60 bg-canvas-soft p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-1.5 text-[13px] font-bold text-petrol-800">
            <Award size={15} aria-hidden="true" /> বিনামূল্যে CSCA পরীক্ষার প্রস্তুতি · CNY ৯৯ মূল্যের Pro অ্যাক্সেস
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[13px] font-semibold text-petrol-800">
            <Clock size={14} aria-hidden="true" /> ফাইল ওপেনিং চার্জ: ০ টাকা
          </span>
        </div>

        <HeadingTag className="mt-4 font-display text-[24px] font-bold leading-[1.2] text-petrol-800 sm:text-[30px]">
          এডুএক্সপ্রেসে চায়না ফাইল ওপেন করলেই ফ্রি CSCA Master Pro অ্যাক্সেস
        </HeadingTag>

        <p className="mt-3 max-w-3xl text-[16px] leading-7 text-ink-soft">
          চীনে আন্ডারগ্র্যাজুয়েট ভর্তি ও সিএসসি (CSC) স্কলারশিপের জন্য নির্ধারিত{' '}
          <strong className="text-petrol-800">CSCA (China Scholastic Competency Assessment)</strong> পরীক্ষার প্রস্তুতি নিচ্ছেন?
          এডুএক্সপ্রেসে যাচাইকৃত চায়না অ্যাপ্লিকেশন ফাইল ওপেন করলেই কোনো ফাইল ওপেনিং চার্জ ছাড়াই পাচ্ছেন{' '}
          <a
            href={CSCA_HOME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-petrol-800 underline underline-offset-4"
          >
            cscamaster.com
          </a>
          -এর একটি <strong className="text-petrol-800">ফ্রি CSCA Master Pro সিট অ্যাক্টিভেশন কোড</strong> (মূল্য CNY ৯৯ / ইনটেক) — এবং চায়না ভিসা অনুমোদনের আগে এডুএক্সপ্রেসের কোনো সার্ভিস ফি নেই।
        </p>

        <div className={`mt-6 grid gap-4 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
          {bnFeatures.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-4 sm:p-5">
              <p className="flex items-start gap-2 text-[16px] font-bold leading-6 text-petrol-800">
                <Check size={17} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                <span>{item.title}</span>
              </p>
              <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-canvas-soft bg-white/90 px-4 py-3.5 text-[14.5px] leading-6 text-ink-soft">
          <strong className="text-petrol-800">স্বচ্ছ খরচের পার্থক্য:</strong> এডুএক্সপ্রেসে চায়না ফাইল ওপেনিং চার্জ ০ টাকা এবং ভিসার আগে কোনো সার্ভিস ফি নেই; ফাইল ওপেন করলে{' '}
          <span lang="en">CSCA Master Pro</span> প্রস্তুতি লাইসেন্সটি (মূল্য CNY ৯৯) সম্পূর্ণ বিনামূল্যে দেওয়া হয়। তবে অফিশিয়াল CSCA পরীক্ষার রেজিস্ট্রেশন ফি (১ বিষয়ের জন্য CNY ৪৫০; ২ বা ততোধিক বিষয়ের জন্য CNY ৭০০) আলাদাভাবে অফিশিয়াল পোর্টাল{' '}
          <a
            href="https://csca.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-petrol-800 underline underline-offset-4"
          >
            csca.cn
          </a>
          -এ প্রদেয়। Master’s বা PhD প্রোগ্রামে CSCA প্রযোজ্য নয়।{' '}
          <Link
            href="/universities?country=China&cscaFree=1"
            className="font-semibold text-petrol-800 underline underline-offset-4"
          >
            CSCA ছাড়া আবেদনের উপযোগী চীনা বিশ্ববিদ্যালয়গুলো দেখুন
          </Link>
          ।
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {isInternalAnchor ? (
            <a href={assessmentHref} className="ed-btn ed-btn-signal min-h-[50px] px-6">
              চায়না ফাইল ওপেন ও ফ্রি Pro কোড নিন <ArrowRight size={17} aria-hidden="true" />
            </a>
          ) : (
            <Link href={assessmentHref} className="ed-btn ed-btn-signal min-h-[50px] px-6">
              চায়না ফাইল ওপেন ও ফ্রি Pro কোড নিন <ArrowRight size={17} aria-hidden="true" />
            </Link>
          )}
          <a
            href={CSCA_FREE_EXAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-btn ed-btn-outline min-h-[50px] bg-white px-6"
          >
            <BookOpenCheck size={16} aria-hidden="true" /> ফ্রি ১০-প্রশ্নের মক টেস্ট দিন (CSCA Master){' '}
            <ExternalLink size={15} aria-hidden="true" />
          </a>
          <a
            href={CSCA_BD_GUIDE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-btn ed-btn-outline min-h-[50px] bg-white px-6"
          >
            বাংলাদেশ CSCA পরীক্ষার সময়সূচি <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-2 border-lime/60 bg-canvas-soft p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-petrol-800">
          <Sparkles size={15} aria-hidden="true" /> Complimentary Exam Prep · CNY 99 Value Included
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[13px] font-semibold text-petrol-800">
          <Award size={15} aria-hidden="true" /> BDT 0 File Opening Charge
        </span>
      </div>

      <HeadingTag className={`mt-4 ${kit.h3} sm:text-[26px]`}>
        Free CSCA Master Pro Access When You Open Your China File with EduExpress
      </HeadingTag>

      <p className="mt-3 max-w-3xl text-[16px] leading-7 text-ink-soft">
        Preparing for the mandatory undergraduate{' '}
        <strong className="text-petrol-800">China Scholastic Competency Assessment (CSCA)</strong>? Students who open a verified China university or CSC scholarship application file with EduExpress receive a complimentary{' '}
        <strong className="text-petrol-800">CSCA Master Pro seat activation code</strong> (worth CNY 99 per intake on{' '}
        <a
          href={CSCA_HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-petrol-800 underline underline-offset-4"
        >
          cscamaster.com
        </a>
        ) — alongside <strong className="text-petrol-800">BDT 0 file-opening charge</strong> and{' '}
        <strong className="text-petrol-800">no EduExpress service fee before China visa approval</strong>.
      </p>

      <div className={`mt-6 grid gap-4 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
        {enFeatures.map((item) => (
          <div key={item.title} className="rounded-2xl bg-white p-4 sm:p-5">
            <p className="flex items-start gap-2 text-[16px] font-bold leading-6 text-petrol-800">
              <Check size={17} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
              <span>{item.title}</span>
            </p>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-canvas-soft bg-white/90 px-4 py-3.5 text-[14.5px] leading-6 text-ink-soft">
        <strong className="text-petrol-800">Clear cost separation:</strong> Opening your China application file with EduExpress is BDT 0, and your{' '}
        <a
          href={CSCA_HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-petrol-800 underline underline-offset-4"
        >
          CSCA Master Pro
        </a>{' '}
        preparation licence (CNY 99 value) is complimentary once your application file documents are verified. Official CSCA exam registration (CNY 450 for 1 subject; CNY 700 for 2+ subjects) is a separate third-party test fee paid directly on the official portal{' '}
        <a
          href="https://csca.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-petrol-800 underline underline-offset-4"
        >
          csca.cn
        </a>
        . Applying for Master’s/PhD (where CSCA is not required) or looking for undergraduate exemptions?{' '}
        <Link
          href="/universities?country=China&cscaFree=1"
          className="font-semibold text-petrol-800 underline underline-offset-4"
        >
          Browse Chinese universities with CSCA-exempt options
        </Link>{' '}
        or read our{' '}
        <Link
          href="/bn/csca-exam-bangladesh"
          hrefLang="bn-BD"
          lang="bn"
          className="font-semibold text-petrol-800 underline underline-offset-4"
        >
          বাংলায় CSCA পরীক্ষার গাইড
        </Link>
        .
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {isInternalAnchor ? (
          <a href={assessmentHref} className="ed-btn ed-btn-signal min-h-[50px] px-6">
            Open China File &amp; Claim Free Pro Code <ArrowRight size={17} aria-hidden="true" />
          </a>
        ) : (
          <Link href={assessmentHref} className="ed-btn ed-btn-signal min-h-[50px] px-6">
            Open China File &amp; Claim Free Pro Code <ArrowRight size={17} aria-hidden="true" />
          </Link>
        )}
        <a
          href={CSCA_FREE_EXAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ed-btn ed-btn-outline min-h-[50px] bg-white px-6"
        >
          <BookOpenCheck size={16} aria-hidden="true" /> Try Free 10-Question Diagnostic (CSCA Master){' '}
          <ExternalLink size={15} aria-hidden="true" />
        </a>
        <a
          href={CSCA_BD_GUIDE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ed-btn ed-btn-outline min-h-[50px] bg-white px-6"
        >
          Bangladesh CSCA Schedule &amp; Rules <ExternalLink size={15} aria-hidden="true" />
        </a>
        <a
          href={CSCA_SCORE_CALC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ed-btn ed-btn-outline min-h-[50px] bg-white px-5"
        >
          Score Calculator <ExternalLink size={15} aria-hidden="true" />
        </a>
        <a
          href={CSCA_MBBS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ed-btn ed-btn-outline min-h-[50px] bg-white px-5"
        >
          MBBS CSCA Track <ExternalLink size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
