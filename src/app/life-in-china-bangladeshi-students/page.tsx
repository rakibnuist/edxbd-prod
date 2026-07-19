import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Heart,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Building2,
  Utensils,
  Smartphone,
  Users,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';

export const metadata: Metadata = {
  title: { absolute: 'Life in China for Bangladeshi Students | Halal Food, Banking & Community 2026' },
  description:
    'Complete guide to student life in China for Bangladeshi students. Halal food canteens, Bangladeshi student associations, WeChat Pay/Alipay setup, safety, and cultural adaptation.',
  alternates: { canonical: '/life-in-china-bangladeshi-students' },
  openGraph: {
    title: 'Life in China for Bangladeshi Students | EduExpress International',
    description: 'Practical guide to Halal food, campus safety, banking, student communities, and living in China.',
    url: '/life-in-china-bangladeshi-students',
    type: 'website',
  },
};

const lifeTopics = [
  {
    title: '1. Halal Food & Muslim Canteens',
    detail: 'Virtually all major Chinese universities have dedicated Muslim Canteens (清真餐厅 - Qingzhen Canting) serving certified Halal beef, mutton, chicken, and rice dishes prepared by Muslim chefs.',
    icon: Utensils,
  },
  {
    title: '2. Digital Life (WeChat Pay & Alipay)',
    detail: 'China is a cashless society. Bangladeshi students easily link their local Chinese bank debit cards (ICBC, Bank of China) to WeChat Pay and Alipay for instant payments and mobile transfers.',
    icon: Smartphone,
  },
  {
    title: '3. Bangladeshi Student Community',
    detail: 'Strong Bangladeshi Student Associations (BSA) operate across major university hubs in Nanjing, Hangzhou, Wuhan, Beijing, Guangzhou, and Changzhou, providing peer support and festival celebrations.',
    icon: Users,
  },
  {
    title: '4. Safety & Security',
    detail: 'China is recognized as one of the safest countries in the world. Campus dormitories feature 24/7 security control, card-key entry, and dedicated international student advisors.',
    icon: ShieldCheck,
  },
];

export default function LifeInChinaBangladeshiStudentsPage() {
  return (
    <div className="bg-[#f4f8fa] text-[#08263c]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12">
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden>/</span>{' '}
            <Link href="/study-in-china-from-bangladesh" className="hover:text-white">Study in China</Link> <span aria-hidden>/</span> Life in China
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8ed0ee]/30 bg-[#8ed0ee]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#8ed0ee]">
              <Heart size={14} /> Student Experience Guide
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Life in China for Bangladeshi Students
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80 md:text-xl">
              What is it really like for a Bangladeshi student living and studying in China? Learn about Halal food availability, campus culture, safety, banking, and community networks.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              <a
                href="#life-assessment"
                className="inline-flex items-center gap-2 rounded-full bg-[#64b5df] px-7 py-3.5 text-[#08263c] transition-all hover:bg-white"
              >
                Find Student Friendly Universities <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Daily Life Essentials</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">Key Pillars of Living in China</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {lifeTopics.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-[#e9f7fd] text-[#174f7a]">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#08263c]">{t.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="bg-white px-5 py-16 border-y border-slate-200 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1000px] text-center">
          <ShieldCheck size={36} className="mx-auto text-[#174f7a]" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#08263c]">Pre-Departure Orientation Included</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Every EduExpress student receives full pre-departure briefing on SIM card registration, mobile payments, airport pickups, dorm check-in, and emergency contacts in China.
          </p>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section id="life-assessment" className="px-5 py-20 bg-[#e9f7fd] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <EducationFitAssessment />
        </div>
      </section>
    </div>
  );
}
