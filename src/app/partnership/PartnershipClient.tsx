'use client';

import { motion } from 'framer-motion';
import {
  Handshake,
  Users,
  TrendingUp,
  Award,
  Globe,
  Shield,
  BookOpen,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  Star,
  Briefcase,
  Headphones,
  Zap,
  GraduationCap,
  Landmark,
  Microscope,
  Languages,
  Banknote,
  GraduationCap as GradCap,
  Link as LinkIcon,
  MapPin,
  ClipboardCheck,
  FileCheck,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import PartnershipForm from '@/components/PartnershipForm';
import PageHeader from '@/components/PageHeader';

export default function PartnershipClient() {
  const partnershipTypes = [
    {
      number: '01',
      modelCode: 'MODEL 01',
      title: 'Global Authorized Agent',
      label: 'Exclusive Territorial Representation',
      description: 'Represent EduExpress in your region with exclusive territory rights, complete training, and written agreement.',
      features: [
        'Exclusive territory rights',
        'Complete training & support',
        'Marketing materials & leads',
        'Commission on global placements',
        'Priority student support'
      ],
      icon: Shield
    },
    {
      number: '02',
      modelCode: 'MODEL 02',
      title: 'China Strategic Partner',
      label: 'Flagship Service-Charge Model',
      description: 'Specialized partnership for China placements via our transparent Service-Charge model and direct university links.',
      features: [
        'Direct access to Chinese Universities',
        'Transparent Service Charge pricing',
        'High success rate on Government Scholarships',
        'End-to-end Visa and on-arrival support',
        'Dedicated account manager'
      ],
      icon: Handshake
    },
    {
      number: '03',
      modelCode: 'MODEL 03',
      title: 'Referral Partner',
      label: 'Education Consultant Referral',
      description: 'Simple referral program for education consultants and student advocates with zero upfront investment.',
      features: [
        'Easy referral process',
        'No upfront investment required',
        'Flexible arrangements',
        'Fixed referral bonuses',
        'Quick approval process'
      ],
      icon: Users
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Revenue Growth',
      description: 'Earn lucrative commissions globally and competitive margins on China service charges under written terms.',
      stat: 'High Yield Returns'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Access to universities across 10 active destinations, including directly affiliated Chinese institutions.',
      stat: 'Direct Institutional Links'
    },
    {
      icon: BookOpen,
      title: 'Training & Resources',
      description: 'Receive our complete, current directory for university entry requirements, intakes, and scholarships.',
      stat: 'Full Documentation'
    },
    {
      icon: Headphones,
      title: 'Direct Oversight',
      description: 'Dedicated WhatsApp support and Dhanmondi decision desk monitoring for your student applications.',
      stat: 'Decision Support'
    }
  ];

  const pricingTable = [
    { type: 'Type-A', coverage: 'Full Tuition · Hostel · Monthly Stipend', price: '$500' },
    { type: 'Type-B', coverage: 'Full Tuition · Hostel Free', price: '$450' },
    { type: 'Type-C', coverage: 'Tuition Waiver Only', price: '$400' },
    { type: 'Type-D', coverage: 'Partial Scholarship (50–80% Off)', price: '$300' },
    { type: 'Add-On', coverage: 'Airport Pickup — Per Student (Optional)', price: '$150' },
  ];

  return (
    <div className="overflow-hidden bg-[#f4f8fa] text-[#08263c] font-sans">
      {/* Homepage Hero Header Style */}
      <section className="relative px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 md:pt-40 lg:px-12 border-b border-[#174f7a]/15">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(23,79,122,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,79,122,0.07)_1px,transparent_1px)] bg-[size:76px_76px]" />
        <div className="pointer-events-none absolute right-[4%] top-28 size-72 rounded-full border-[44px] border-[#64b5df]/15 md:size-[460px]" />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#174f7a]/25 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#174f7a]">
            <span>EduExpress International Bangladesh</span>
            <span>Global Partner Network</span>
            <span>Institutional Cooperation 2027</span>
          </div>

          <div className="max-w-4xl">
            <p className="flex w-full max-w-full items-start gap-3 bg-[#174f7a] px-4 py-2 text-[11px] font-black uppercase leading-5 tracking-[0.16em] text-white sm:inline-flex sm:w-auto sm:items-center sm:text-xs sm:tracking-[0.2em]">
              <Handshake className="mt-0.5 shrink-0 text-[#8ed0ee] sm:mt-0" size={16} />
              <span className="min-w-0 whitespace-normal">Global Partner Programme 2027</span>
            </p>

            <h1 className="mt-7 w-full max-w-4xl break-words text-balance font-heading text-[clamp(2.4rem,5.6vw,4.2rem)] font-bold leading-[1.06] tracking-[-0.022em]">
              Expand your consultancy <span className="relative mt-2 inline-block bg-[#64b5df] px-2 pb-2 text-[#08263c] sm:px-3 sm:pb-3">with written proof</span> and direct university links
            </h1>

            <p className="mt-7 max-w-2xl border-l-4 border-[#64b5df] pl-5 text-base leading-7 text-slate-700 md:text-lg md:leading-8">
              Partner with EduExpress International to expand your student placement business across 10 active destinations and our flagship China service-charge model.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center justify-center gap-3 bg-[#08263c] px-6 py-4 text-sm font-black text-white hover:bg-[#174f7a] shadow-[4px_4px_0_0_#174f7a]"
              >
                Apply for Partnership <ArrowUpRight className="shrink-0 transition group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
              </button>
              <Link
                href="/universities"
                className="inline-flex items-center justify-center gap-3 border-2 border-[#08263c] bg-white/70 px-6 py-4 text-sm font-black text-[#08263c] hover:bg-white"
              >
                View Verified Universities <GraduationCap className="shrink-0" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Universal Promise Dark Section */}
      <section className="border-y border-[#08263c] bg-[#08263c] text-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[.8fr_repeat(3,1fr)]">
          <div className="bg-[#64b5df] p-6 text-[#08263c] lg:p-7">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Institutional Models</p>
            <h2 className="mt-3 font-heading text-2xl font-bold leading-tight">Three Clear Cooperation Frameworks</h2>
          </div>
          {partnershipTypes.map(({ number, title, description, icon: Icon }) => (
            <div key={title} className="group relative border-b border-white/15 p-5 hover:bg-white/5 lg:border-b-0 lg:border-r lg:p-6">
              <div className="flex items-center justify-between"><span className="font-mono text-[9px] text-[#64b5df]">MODEL {number}</span><Icon size={19} className="text-[#64b5df]" /></div>
              <h3 className="mt-7 font-heading text-lg font-bold leading-6">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-white/50">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership Models Grid */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 md:py-32 lg:px-12 border-b border-[#174f7a]/15">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#174f7a]">Institutional Models</p>
            <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#08263c] md:text-5xl">Partnership Frameworks</h2>
            <p className="mt-4 text-base text-slate-600">Choose the agreement that fits your agency structure.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {partnershipTypes.map(({ number, title, label, description, icon: Icon, features }, index) => (
              <article
                key={title}
                className={`group relative overflow-hidden border-2 border-[#08263c] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#174f7a] ${
                  index === 1 ? 'bg-[#174f7a] text-white' : 'bg-[#f4f8fa] text-[#08263c]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm font-black">MODEL {number}</span>
                  <Icon size={35} strokeWidth={1.6} className={index === 1 ? 'text-[#64b5df]' : 'text-[#174f7a]'} />
                </div>

                <div className="mt-6">
                  <p className={`text-xs font-black uppercase tracking-[0.18em] ${index === 1 ? 'text-[#bde7f8]' : 'text-[#174f7a]'}`}>{label}</p>
                  <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight">{title}</h3>
                  <p className={`mt-3 leading-6 text-xs ${index === 1 ? 'text-white/80' : 'text-slate-700'}`}>{description}</p>

                  <ul className="mt-6 space-y-2 border-t border-[#174f7a]/20 pt-4 bg-white/60 p-4 border border-[#08263c]/20">
                    {features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center text-xs font-semibold text-[#08263c]">
                        <span className="text-[#174f7a] font-bold mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* China Service Charges Schedule Table */}
      <section className="py-20 px-5 sm:px-8 lg:px-12 bg-[#f4f8fa] border-b border-[#174f7a]/15">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">
              Flagship Specialization
            </span>
            <h2 className="mt-2 font-heading text-4xl font-bold text-[#08263c]">
              Service Charge Schedule
            </h2>
            <p className="text-sm text-slate-700 max-w-3xl mx-auto mt-3 bg-white p-5 border-2 border-[#08263c]">
              Chinese university arrangements use a service charge model separate from Western commission structures. Charges are determined by the <strong className="text-[#08263c]">scholarship type secured</strong> and covered by the partner agency. Fees are quoted in <strong>USD</strong> and payment is triggered by JW202 issuance under our written policy.
            </p>
          </div>

          <div className="border-2 border-[#08263c] bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-[#08263c] text-white font-mono text-[10px] font-black uppercase tracking-wider">
                    <th className="px-6 py-4">Scholarship Type</th>
                    <th className="px-6 py-4">Coverage</th>
                    <th className="px-6 py-4 text-right">Fee (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#174f7a]/15">
                  {pricingTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#f4f8fa]">
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-[#174f7a] text-[#8ed0ee] font-mono text-xs font-black uppercase">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-[#08263c]">
                        {row.coverage}
                      </td>
                      <td className="px-6 py-4 text-right font-heading text-xl font-bold text-[#08263c]">
                        {row.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-[#08263c] p-4 text-xs text-white/80 border-t border-[#174f7a]/30">
              <strong className="text-[#64b5df] font-bold">Verification Note:</strong> The original JW202 will not be dispatched until service charge payment is confirmed. Upon issuance, we provide your agency with a JW202 screenshot for independent verification before any final payment.
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Form Section */}
      <section id="partnership-form" className="py-20 px-5 sm:px-8 lg:px-12 bg-white border-b border-[#174f7a]/15">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Cooperation Request</p>
            <h2 className="mt-2 font-heading text-4xl font-bold text-[#08263c]">
              Apply for Partnership
            </h2>
          </div>

          <div className="bg-[#f4f8fa] border-2 border-[#08263c] p-6 md:p-10 max-w-4xl mx-auto shadow-[8px_8px_0_0_#174f7a]">
            <PartnershipForm />
          </div>
        </div>
      </section>

      {/* Bring 01-03 CTA Banner */}
      <section className="bg-[#64b5df] px-5 py-16 text-[#08263c] sm:px-8 sm:py-24 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#174f7a]">Compare before you commit</p>
              <h2 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">Expand your student placement business with written proof and clear terms.</h2>
            </div>
            <button
              onClick={() => window.open('https://wa.me/8801410585926?text=Hello%2C%20I%27m%20interested%20in%20the%20EduExpress%20International%20Global%20Partner%20Programme.', '_blank')}
              className="inline-flex w-full items-center justify-center gap-3 bg-[#08263c] px-7 py-5 text-base font-black text-white hover:bg-[#174f7a] sm:text-lg lg:w-auto lg:min-w-64"
            >
              WhatsApp Partner Desk <ArrowUpRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
