import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  ShieldCheck,
  Building2,
  Utensils,
  Plane,
  FileCheck2,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';

export const metadata: Metadata = {
  title: { absolute: 'Cost of Studying in China from Bangladesh (2026 BDT Planner)' },
  description:
    'Complete cost guide for studying in China from Bangladesh. Detailed BDT breakdowns for tuition fees, hostel, food, visa, medical, flight ticket, and living expenses.',
  alternates: { canonical: '/study-in-china-cost-bangladesh' },
  openGraph: {
    title: 'Cost of Studying in China from Bangladesh | EduExpress International',
    description: 'Realistic BDT cost calculation sheet for tuition, accommodation, living expenses, and visa processing.',
    url: '/study-in-china-cost-bangladesh',
    type: 'website',
  },
};

const costItems = [
  {
    category: '1. University Tuition Fees',
    cny: 'CNY 12,000 – 30,000 / year',
    bdt: '~1.9 Lakh – 4.8 Lakh BDT / year',
    detail: 'Varies by subject (Engineering vs Medical vs Business) and scholarship type (Full Waiver to Partial Waiver).',
    icon: DollarSign,
  },
  {
    category: '2. Campus Accommodation',
    cny: 'CNY 3,000 – 8,000 / year',
    bdt: '~48,000 – 1.28 Lakh BDT / year',
    detail: 'Double or single room in international student dormitories with heating, air conditioning, and high-speed wifi.',
    icon: Building2,
  },
  {
    category: '3. Monthly Food & Living',
    cny: 'CNY 1,000 – 1,800 / month',
    bdt: '~16,000 – 28,000 BDT / month',
    detail: 'On-campus university canteens offer affordable Halal food options and daily necessities.',
    icon: Utensils,
  },
  {
    category: '4. Initial Pre-Departure & One-Time Costs',
    cny: 'CNY 2,500 – 4,000 one-time',
    bdt: '~40,000 – 65,000 BDT one-time',
    detail: 'Includes Bangladesh police clearance, medical test in BD, MOFA document notarization, and air ticket.',
    icon: Plane,
  },
];

export default function StudyInChinaCostBangladeshPage() {
  return (
    <div className="bg-[#f4f8fa] text-[#08263c]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12">
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden>/</span>{' '}
            <Link href="/study-in-china-from-bangladesh" className="hover:text-white">Study in China</Link> <span aria-hidden>/</span> Cost Planner
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8ed0ee]/30 bg-[#8ed0ee]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#8ed0ee]">
              <Calculator size={14} /> ClearCost™ Sheet 2026
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Cost of Studying in China from Bangladesh
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80 md:text-xl">
              Understand all expenses in BDT before applying. Clear itemized breakdowns of tuition, accommodation, living expenses, and third-party fees with zero hidden charges.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              <a
                href="#cost-calculator"
                className="inline-flex items-center gap-2 rounded-full bg-[#64b5df] px-7 py-3.5 text-[#08263c] transition-all hover:bg-white"
              >
                Calculate Your 4-Year Plan <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* COST GRID */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Complete BDT Breakdown</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">Itemized Expense Breakdown (CNY to BDT)</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {costItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.category} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-[#e9f7fd] text-[#174f7a]">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#08263c]">{item.category}</h3>
                  </div>

                  <div className="mt-4 rounded-xl bg-[#f4f8fa] p-4 font-mono text-sm space-y-1">
                    <p className="text-slate-600">CNY: <strong className="text-[#08263c]">{item.cny}</strong></p>
                    <p className="text-[#174f7a]">BDT Equivalent: <strong className="text-[#174f7a] text-base">{item.bdt}</strong></p>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">{item.detail}</p>
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
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#08263c]">No Surprise Expenses Policy</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            EduExpress International provides an official written ClearCost™ sheet for every recommendation before file opening. No file opening fee, and no service charge until visa approval.
          </p>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section id="cost-calculator" className="px-5 py-20 bg-[#e9f7fd] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <EducationFitAssessment />
        </div>
      </section>
    </div>
  );
}
