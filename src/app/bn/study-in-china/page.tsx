import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, BookOpenCheck, Check, FileCheck2, GraduationCap, Languages, ShieldCheck, Sparkles } from 'lucide-react';

const canonical = 'https://eduexpressint.com/bn/study-in-china';
const chinaTerms = 'কোনো ফাইল খোলার চার্জ নেই। চীনের ভিসা অনুমোদনের আগে EduExpress-এর কোনো সার্ভিস ফি নেই। তবে বিশ্ববিদ্যালয়, দূতাবাস, মেডিকেল, অনুবাদ, কুরিয়ার, ডিপোজিট বা অন্য কোনো তৃতীয় পক্ষের ফি আগে প্রয়োজন হলে শিক্ষার্থী এগোনোর আগে তা লিখিতভাবে আলাদা করে জানাতে হবে।';

export const metadata: Metadata = {
  title: { absolute: 'বাংলাদেশ থেকে চীনে উচ্চশিক্ষা | EduExpress' },
  description: '১৩৪টির বেশি বিশ্ববিদ্যালয় সহযোগিতা, ছয়টি স্টাডি লেভেল, IELTS বিকল্প, CSCA, স্কলারশিপ, খরচ ও ভিসা প্রস্তুতি তুলনা করুন।',
  alternates: {
    canonical,
    languages: { 'en-BD': 'https://eduexpressint.com/study-in-china-from-bangladesh', 'bn-BD': canonical },
  },
};

const sections = [
  { title: 'কার জন্য চীন উপযুক্ত হতে পারে', body: 'যেসব শিক্ষার্থী প্রোগ্রামের মান, বিশ্ববিদ্যালয়ের স্বীকৃতি, পড়াশোনার ভাষা, মোট খরচ এবং ভবিষ্যৎ পেশাগত প্রয়োজন তুলনা করে সিদ্ধান্ত নিতে চান, তাদের জন্য চীন একটি সম্ভাব্য গন্তব্য।', items: ['একাডেমিক যোগ্যতার সঙ্গে মানানসই প্রোগ্রাম', 'ভাষা ও CSCA প্রস্তুতি', 'লিখিত পূর্ণ খরচ পরিকল্পনা', 'বাস্তবসম্মত স্কলারশিপ মূল্যায়ন'] },
  { title: 'ছয় ধরনের স্টাডি লেভেল', body: 'EduExpress চাইনিজ ভাষা, Foundation, Diploma, Bachelor, Master এবং PhD রুট মূল্যায়নে সহায়তা করে। উপযুক্ত লেভেল নির্ভর করে আগের শিক্ষা, ফলাফল, বিষয়, বয়স, বাজেট ও বিশ্ববিদ্যালয়ের শর্তের ওপর।' },
  { title: 'IELTS সহ বা বিকল্প ইংরেজি প্রমাণ', body: 'কিছু বিশ্ববিদ্যালয় নির্দিষ্ট প্রোগ্রামে IELTS-এর পরিবর্তে MOI, অন্য স্বীকৃত পরীক্ষা বা নিজস্ব মূল্যায়ন গ্রহণ করতে পারে। এটি সবার জন্য সাধারণ IELTS ছাড় নয়। আবেদন করার আগে সংশ্লিষ্ট প্রোগ্রামের সরকারি নিয়ম লিখিতভাবে যাচাই করতে হবে।' },
  { title: 'CSCA সহ এবং CSCA ছাড়া রুট', body: '২০২৬ ও ২০২৭ শিক্ষাবর্ষে Undergraduate এবং Chinese Government Scholarship-এর বিভিন্ন রুটে CSCA প্রয়োজন হতে পারে। Language, Foundation, Diploma, Master, PhD অথবা বিশ্ববিদ্যালয়ভিত্তিক অন্য রুটে নিয়ম ভিন্ন হতে পারে। ইংরেজি প্রমাণ এবং CSCA দুটি আলাদা বিষয়।' },
  { title: 'খরচ ও স্কলারশিপের বাস্তবতা', body: 'স্কলারশিপকে প্রোগ্রাম উপযুক্ততা যাচাইয়ের পর সামর্থ্যের একটি অংশ হিসেবে বিবেচনা করুন। ১০০% Tuition award থাকলেও Hostel, Insurance, Living Cost, Medical, Visa, Flight বা অন্য খরচ বাকি থাকতে পারে।' },
  { title: 'ভিসা ও ডকুমেন্ট প্রস্তুতি', body: 'অফিশিয়াল Admission Letter, JW201 বা JW202 যেখানে প্রযোজ্য, আর্থিক প্রমাণ, Scholarship evidence এবং বর্তমান Embassy নির্দেশনা অনুসারে প্রস্তুতি নিতে হবে। কোনো প্রতিষ্ঠান ভিসা সিদ্ধান্ত নিশ্চিত করতে পারে না।' },
  { title: 'চীনে শিক্ষার্থী জীবন', body: 'আবাসন, হালাল খাবার, দৈনন্দিন চাইনিজ ভাষা, ব্যাংকিং, মোবাইল পেমেন্ট, বিমা, নিরাপত্তা ও বিশ্ববিদ্যালয়ের নিয়ম আগে থেকে বুঝে নিন। কাজ বা Internship-এর ক্ষেত্রে বর্তমান বিশ্ববিদ্যালয় ও Immigration নিয়ম যাচাই করুন।' },
  { title: 'কার জন্য এই প্রক্রিয়া উপযুক্ত নয়', body: 'যারা নিশ্চিত ভর্তি, নিশ্চিত স্কলারশিপ, নিশ্চিত ভিসা বা নিশ্চিত চাকরির প্রতিশ্রুতি চান, অথবা লিখিত খরচ ও সরকারি শর্ত যাচাই করতে চান না, তাদের জন্য এই প্রক্রিয়া উপযুক্ত নয়।' },
];

export default function BengaliChinaPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}#page`,
    url: canonical,
    name: 'বাংলাদেশ থেকে চীনে উচ্চশিক্ষা',
    description: 'বাংলাদেশি শিক্ষার্থীদের জন্য চীনের বিশ্ববিদ্যালয়, ভর্তি, খরচ, স্কলারশিপ ও ভিসা গাইড।',
    inLanguage: 'bn-BD',
    dateModified: '2026-07-19',
  };

  return (
    <article lang="bn" className="bg-[#f6f9fb] pt-[76px] text-[#08263c] min-[1200px]:pt-[104px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="relative overflow-hidden bg-[#08263c] text-white">
        <div className="absolute right-[-12rem] top-[-14rem] size-[40rem] rounded-full border-[6rem] border-[#64b5df]/10" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:px-12 lg:grid-cols-[.68fr_.32fr] lg:items-end lg:py-16">
          <div>
            <nav className="text-xs font-bold text-white/50" aria-label="Breadcrumb"><Link href="/">হোম</Link> <span aria-hidden="true">/</span> চীনে উচ্চশিক্ষা</nav>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-[#8ed0ee]">EduExpress-এর প্রধান গন্তব্য</p>
            <h1 className="mt-4 max-w-5xl font-heading text-4xl font-bold leading-tight sm:text-6xl">বাংলাদেশ থেকে চীনে উচ্চশিক্ষা</h1>
            <p className="mt-6 max-w-4xl text-base leading-8 text-white/75">EduExpress-এর ১৩৪টির বেশি বিশ্ববিদ্যালয় সহযোগিতা নেটওয়ার্কের মধ্য থেকে Language, Foundation, Diploma, Bachelor, Master ও PhD রুট তুলনা করুন। IELTS বা অনুমোদিত বিকল্প, CSCA, স্কলারশিপ, সম্পূর্ণ খরচ এবং ভিসা প্রস্তুতি যাচাই করে সিদ্ধান্ত নিন।</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/15">
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">১৩৪+</strong><span className="mt-2 block text-xs text-white/55">বিশ্ববিদ্যালয় সহযোগিতা</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">৬</strong><span className="mt-2 block text-xs text-white/55">স্টাডি লেভেল</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">২০১৮</strong><span className="mt-2 block text-xs text-white/55">চীন সেবা শুরু</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">০</strong><span className="mt-2 block text-xs text-white/55">নিশ্চিত ফলাফলের দাবি</span></div>
          </div>
        </div>
      </header>

      <section className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-[#174f7a]/15 sm:grid-cols-3">
          {[
            { icon: GraduationCap, title: 'শিক্ষাগত উপযুক্ততা আগে', text: 'স্কলারশিপ বা কম খরচের আগে প্রোগ্রামের মান ও স্বীকৃতি যাচাই।' },
            { icon: Languages, title: 'ভাষার নিয়ম লিখিতভাবে', text: 'IELTS, MOI, HSK বা বিশ্ববিদ্যালয়ের মূল্যায়ন প্রোগ্রামভিত্তিক।' },
            { icon: ShieldCheck, title: 'দায়িত্ব পরিষ্কার', text: 'বিশ্ববিদ্যালয়, কর্তৃপক্ষ ও EduExpress-এর ভূমিকা আলাদা।' },
          ].map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 bg-white p-5"><span className="grid size-10 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a]"><Icon size={20} /></span><div><strong className="text-sm">{title}</strong><p className="mt-1 text-xs leading-6 text-slate-500">{text}</p></div></div>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 lg:px-12 lg:grid-cols-[.28fr_.72fr] lg:py-20">
        <aside><div className="sticky top-32 border-t-4 border-[#174f7a] bg-[#e9f7fd] p-5"><BookOpenCheck size={25} className="text-[#174f7a]" /><h2 className="mt-5 font-heading text-2xl font-bold">সিদ্ধান্তের কাঠামো</h2><p className="mt-3 text-sm leading-7 text-slate-600">বিশ্ববিদ্যালয় বাছাই থেকে ভিসা প্রস্তুতি পর্যন্ত প্রতিটি ধাপে বর্তমান সরকারি বা বিশ্ববিদ্যালয় উৎস যাচাই করুন।</p><p className="mt-5 border-t border-[#174f7a]/15 pt-4 text-xs font-bold leading-6 text-slate-500">সর্বশেষ যাচাই: ১৯ জুলাই ২০২৬<br />পরবর্তী পর্যালোচনা: ১৯ অক্টোবর ২০২৬</p></div></aside>
        <div className="border-l border-t border-[#174f7a]/20">
          {sections.map((section, index) => <section key={section.title} className="grid border-b border-r border-[#174f7a]/20 bg-white sm:grid-cols-[5rem_1fr]"><div className="flex items-center justify-between bg-[#08263c] px-4 py-3 text-white sm:flex-col sm:justify-start sm:px-2 sm:py-6"><span className="font-mono text-[9px] font-black text-[#8ed0ee]">{String(index + 1).padStart(2, '0')}</span><FileCheck2 size={18} className="sm:mt-5" /></div><div className="p-5 sm:p-7"><h2 className="font-heading text-2xl font-bold">{section.title}</h2><p className="mt-3 text-sm leading-8 text-slate-600">{section.body}</p>{section.items ? <ul className="mt-5 grid gap-2 sm:grid-cols-2">{section.items.map(item => <li key={item} className="flex gap-3 bg-[#f6f9fb] p-3 text-xs leading-6 text-slate-600"><Check size={15} className="mt-1 shrink-0 text-[#174f7a]" />{item}</li>)}</ul> : null}</div></section>)}
        </div>
      </section>

      <section className="bg-[#08263c] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 lg:px-12 lg:grid-cols-[.68fr_.32fr] lg:items-center">
          <div><p className="text-xs font-black uppercase tracking-[0.17em] text-[#8ed0ee]">আপনার পরবর্তী কার্যকর ধাপ</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">আপনার প্রোফাইলের জন্য চীনের উপযুক্ত রুট যাচাই করুন</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">শিক্ষাগত যোগ্যতা, লক্ষ্য লেভেল, বিষয়, বাজেট এবং ভাষা প্রস্তুতি জানান।</p></div>
          <Link href="/study-in-china-from-bangladesh#china-fit-form" className="flex min-h-14 items-center justify-center gap-2 bg-[#64b5df] px-5 text-sm font-black text-[#08263c]">China Fit Assessment শুরু করুন <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="border-b border-[#174f7a]/15 bg-[#f6f9fb]">
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
          <blockquote className="border-l-4 border-[#174f7a] bg-white p-5 text-sm font-bold leading-8">{chinaTerms}</blockquote>
          <div className="mt-6 grid gap-6 text-xs leading-6 text-slate-500 lg:grid-cols-2">
            <div><p><strong className="text-[#08263c]">প্রস্তুতকারক:</strong> EduExpress China Admissions Desk</p><p><strong className="text-[#08263c]">পর্যালোচক:</strong> EduExpress Content and Compliance</p></div>
            <div><p className="flex items-center gap-2 font-black text-[#08263c]"><Sparkles size={14} />সরকারি উৎস</p><div className="mt-2 flex flex-wrap gap-4"><a href="https://bd.china-embassy.gov.cn/eng/" target="_blank" rel="noreferrer" className="font-bold text-[#174f7a] underline">Chinese Embassy in Bangladesh</a><a href="https://www.campuschina.org/" target="_blank" rel="noreferrer" className="font-bold text-[#174f7a] underline">Campus China</a><a href="https://csca.cn/" target="_blank" rel="noreferrer" className="font-bold text-[#174f7a] underline">Official CSCA portal</a></div></div>
          </div>
          <p className="mt-6 flex items-center gap-2 text-[10px] font-bold text-slate-500"><BadgeCheck size={13} className="text-[#174f7a]" />বাংলা সংস্করণ সম্পূর্ণ পর্যালোচনার পর ইংরেজি পৃষ্ঠার hreflang সমতুল্য হিসেবে প্রকাশিত।</p>
        </div>
      </section>
    </article>
  );
}
